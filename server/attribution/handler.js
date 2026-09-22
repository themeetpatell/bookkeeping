/**
 * POST /api/lead-attribution — attaches a site visitor's ad attribution to the
 * Zoho Lead their form, booking or proposal just created.
 *
 * Why server-side: the Zoho Forms -> CRM mapping silently overwrites whatever
 * CRM field a posted form field is mapped to (it once turned every Lead Source
 * in an ad group into "20 – 80 a month"), and Zoho Bookings and FinCore accept
 * no attribution at all. One endpoint that writes named CRM fields directly
 * serves every entry point the same way.
 *
 * Switched off unless LEAD_ATTRIBUTION_ENABLED=1. See docs/lead-attribution.md.
 */
import { APP_ORIGINS } from '../../src/utils/booking.js';
import { buildLeadUpdate, LEAD_READ_FIELDS } from './fields.js';
import { parseAttributionPayload } from './schema.js';

/** The caller's IP as Vercel forwards it; '' when absent. */
const clientIp = (request) =>
  (request.headers.get('x-forwarded-for') || '').split(',')[0].trim();

/* Zoho Forms -> CRM usually lands in seconds, Bookings and FinCore can take
   longer. ~50s in total, well inside the function's time limit. */
export const FIND_RETRY_DELAYS_MS = [3000, 5000, 7000, 10000, 25000];
const MAX_BODY_BYTES = 8 * 1024;
const MAX_DROPPED_FIELDS = 3;

const reply = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

async function readBody(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return { tooLarge: true };
  try {
    return { value: JSON.parse(raw) };
  } catch {
    return { value: null };
  }
}

async function findWithRetry(payload, { client, sleep }) {
  const contact = { email: payload.email, phone: payload.phone };
  let leads = await client.findLeads(contact, LEAD_READ_FIELDS);
  for (const delay of FIND_RETRY_DELAYS_MS) {
    if (leads.length) break;
    await sleep(delay);
    leads = await client.findLeads(contact, LEAD_READ_FIELDS);
  }
  return leads;
}

/* Every valid request gets this same answer. Distinct replies ("not found",
   "stale", "updated") would let anyone with a list of emails learn which are
   leads and how recent they are. The real outcome goes to the server log. */
const ACCEPTED = { status: 'accepted' };

const newest = (leads) =>
  [...leads].sort((a, b) => new Date(b.Created_Time) - new Date(a.Created_Time))[0];

/**
 * Writes the fields, dropping any one Zoho rejects (a restricted picklist value
 * the admin has not added yet, or a field not created yet) so one missing
 * piece of CRM setup never costs the click id.
 */
async function writeFields(client, id, fields) {
  let remaining = { ...fields };
  const dropped = [];
  while (Object.keys(remaining).length) {
    const result = await client.updateLead(id, remaining);
    if (result.ok) return { dropped };
    const rejected = result.field;
    if (!rejected || !(rejected in remaining) || dropped.length >= MAX_DROPPED_FIELDS) {
      throw new Error(`Zoho rejected the update: ${result.code} ${rejected || ''}`);
    }
    dropped.push(rejected);
    const { [rejected]: _omit, ...rest } = remaining;
    remaining = rest;
  }
  return { dropped };
}

/**
 * Finds the lead and writes what it may. Returns an outcome for the log only.
 * Shared with the WhatsApp webhook (server/whatsapp/handler.js) so both entry
 * points obey the same never-overwrite and freshness rules.
 * @param {object} payload a payload already accepted by parseAttributionPayload
 */
export async function attachAttribution(payload, deps) {
  const leads = await findWithRetry(payload, deps);
  if (!leads.length) return { result: 'not_found' };

  const lead = newest(leads);
  const { fields, skipped } = buildLeadUpdate(payload, lead, deps.now());
  if (skipped) return { result: `skipped_${skipped}` };
  if (!Object.keys(fields).length) return { result: 'nothing_to_write' };

  const { dropped } = await writeFields(deps.client, lead.id, fields);
  return {
    result: 'updated',
    written: Object.keys(fields).filter((f) => !dropped.includes(f)),
    dropped,
  };
}

/**
 * @param {Request} request
 * @param {{ env: object, client: object, sleep: (ms: number) => Promise<void>,
 *           now: () => Date, log: (msg: string, detail?: object) => void,
 *           limiters?: { ip: { allow: (k: string) => boolean },
 *                        contact: { allow: (k: string) => boolean } } }} deps
 * @returns {Promise<Response>}
 */
export async function handleLeadAttribution(request, deps) {
  const { env, log } = deps;
  if (request.method !== 'POST') return reply(405, { error: 'method not allowed' });

  const origin = request.headers.get('origin') || '';
  if (!APP_ORIGINS.includes(origin)) return reply(403, { error: 'origin not allowed' });

  if (env.LEAD_ATTRIBUTION_ENABLED !== '1') return reply(202, { status: 'disabled' });

  const { limiters } = deps;
  const tooMany = () => reply(429, { error: 'too many requests' });
  if (limiters && !limiters.ip.allow(clientIp(request) || 'unknown')) return tooMany();

  const body = await readBody(request);
  if (body.tooLarge) return reply(413, { error: 'payload too large' });
  const parsed = parseAttributionPayload(body.value);
  if (!parsed.ok) return reply(400, { error: parsed.error });
  const payload = parsed.value;
  // Per contact too: one address hammered from many IPs is the fishing pattern.
  if (limiters && !limiters.contact.allow(payload.email || payload.phone)) return tooMany();

  try {
    const outcome = await attachAttribution(payload, deps);
    log('lead-attribution: outcome', { source: payload.secondarySource, ...outcome });
    return reply(202, ACCEPTED);
  } catch (error) {
    // Detail goes to the server log only; the browser learns nothing about Zoho.
    log('lead-attribution: failed', { message: error.message });
    return reply(502, { error: 'could not update the lead' });
  }
}
