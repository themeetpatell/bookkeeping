/**
 * POST /api/whatsapp-inbound?key=<GALLABOX_WEBHOOK_SECRET> — Gallabox's
 * incoming-message webhook. Joins a WhatsApp chat that started on the website
 * to the ad click behind it, and writes that attribution onto the Zoho Lead
 * the Gallabox → CRM sync created, with Secondary Source "WhatsApp Button".
 *
 * The join: the site adds `fs_ref` to the page URL at click time and records
 * the click's attribution in PostHog under it; Gallabox's tracker hides that
 * URL invisibly in the first message; this decodes it, looks the ref up, and
 * matches the Lead by the sender's phone. With no ref match, whatever the hidden
 * URL itself carries (landing page, a gclid still in the URL) is used instead.
 *
 * Replies 200 at once and does the work in the background: finding the Lead
 * can take ~50s while the CRM sync lands, longer than a webhook should wait.
 *
 * Switched off unless WHATSAPP_ATTRIBUTION_ENABLED=1. While off it logs each
 * payload's field paths (never values), to pin Gallabox's real shape first.
 */
import { timingSafeEqual } from 'node:crypto';
import { attachAttribution } from '../attribution/handler.js';
import { parseAttributionPayload } from '../attribution/schema.js';
import { attributionFromUrl } from './decode.js';
import { describeShape, findHiddenUrl, findMessageText, findPhone, hiddenCharCount } from './extract.js';
import { normalizeMessage } from './messageKey.js';

export const SECONDARY_SOURCE = 'WhatsApp Button';
/* The click event is captured a few seconds before the first message is sent;
   PostHog usually has it within a minute. */
export const REF_RETRY_DELAYS_MS = [5000, 15000, 30000];
/* The text lookup waits longer: the first real test (2026-09-22 12:07 UTC)
   found no click after ~50s, and PostHog can take minutes to make a new event
   queryable. 200s in all, inside the function's 300s limit. */
export const TEXT_RETRY_DELAYS_MS = [5000, 15000, 30000, 60000, 90000];
const MAX_BODY_BYTES = 64 * 1024;

const TOUCH_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid',
  'landing_page', 'referrer', 'click_ts',
];

const reply = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

function secretMatches(given, expected) {
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const pick = (source, prefix = '') =>
  TOUCH_KEYS.reduce((out, key) => {
    const value = source[prefix + key];
    return value ? { ...out, [key]: String(value) } : out;
  }, {});

async function lookupWithRetry(ref, { lookupRef, sleep }) {
  let found = await lookupRef(ref);
  for (const delay of REF_RETRY_DELAYS_MS) {
    if (found) break;
    await sleep(delay);
    found = await lookupRef(ref);
  }
  return found;
}

/** The attribution payload for a click the site recorded in PostHog. */
function payloadFromClick(phone, click, landingFallback = '') {
  const p = click.properties || {};
  return {
    secondarySource: SECONDARY_SOURCE,
    phone,
    last: pick(p),
    first: pick(p, 'first_'),
    entry: {
      landing_page: String(p.entry_landing_page || landingFallback || ''),
      referrer: String(p.entry_referrer || ''),
    },
    ...(p.fbp ? { fbp: String(p.fbp) } : {}),
    ...(p.fbc ? { fbc: String(p.fbc) } : {}),
    ...(click.distinctId ? { posthogId: click.distinctId } : {}),
  };
}

/** Builds the attribution payload from the ref's click, else from the URL. */
async function buildPayload(phone, hidden, deps) {
  const fromRef = hidden.ref ? await lookupWithRetry(hidden.ref, deps) : null;
  if (fromRef) {
    return { matchedBy: 'ref', payload: payloadFromClick(phone, fromRef, hidden.landingPage) };
  }
  return {
    matchedBy: 'url',
    payload: {
      secondarySource: SECONDARY_SOURCE,
      phone,
      last: { ...hidden.touch, landing_page: hidden.landingPage },
      entry: { landing_page: hidden.landingPage },
    },
  };
}

/* Waits out PostHog ingestion like the ref lookup, stopping once any click
   matches; one match is a join, several are left alone. */
async function lookupTextWithRetry(text, { lookupText, sleep }) {
  let found = await lookupText(text);
  for (const delay of TEXT_RETRY_DELAYS_MS) {
    if (found.count > 0) break;
    await sleep(delay);
    found = await lookupText(text);
  }
  return found;
}

/* Counts only, never text: tells "the click never reached PostHog" apart from
   "it arrived but its message differs". */
async function recentClickCounts({ countRecentClicks }) {
  if (!countRecentClicks) return {};
  try {
    const { clicks, withText } = await countRecentClicks();
    return { recent_clicks: clicks, recent_clicks_with_text: withText };
  } catch {
    return { recent_clicks: 'unavailable' };
  }
}

async function attach(payload, matchedBy, deps, extra = {}) {
  const parsed = parseAttributionPayload(payload);
  if (!parsed.ok) return { result: 'invalid', error: parsed.error };
  const outcome = await attachAttribution(parsed.value, deps);
  return { ...outcome, matched_by: matchedBy, ...extra };
}

async function processChat(body, deps) {
  const url = findHiddenUrl(body);
  const phone = findPhone(body);

  if (url && phone) {
    const hidden = attributionFromUrl(url);
    const { matchedBy, payload } = await buildPayload(phone, hidden, deps);
    return attach(payload, matchedBy, deps, { has_ref: Boolean(hidden.ref) });
  }

  /* Gallabox strips its hidden URL before forwarding, so the usual path is
     the message text the button prefilled (messageKey.js). */
  const text = normalizeMessage(findMessageText(body));
  if (phone && text && deps.lookupText) {
    const found = await lookupTextWithRetry(text, deps);
    if (found.match) return attach(payloadFromClick(phone, found.match), 'text', deps);
    if (found.count > 1) return { result: 'ambiguous_text', matches: found.count };
  }
  const diagnostics = phone && text ? await recentClickCounts(deps) : {};
  return {
    result: 'no_site_origin',
    has_phone: Boolean(phone),
    has_text: Boolean(text),
    hidden_chars: hiddenCharCount(body),
    ...diagnostics,
  };
}

/**
 * @param {Request} request
 * @param {{ env: object, client: object, lookupRef: (ref: string) => Promise<object|null>,
 *           sleep: (ms: number) => Promise<void>, now: () => Date,
 *           log: (msg: string, detail?: object) => void,
 *           defer: (work: Promise<unknown>) => void }} deps
 * @returns {Promise<Response>}
 */
export async function handleWhatsAppInbound(request, deps) {
  const { env, log, defer } = deps;
  if (request.method !== 'POST') return reply(405, { error: 'method not allowed' });

  const key = new URL(request.url).searchParams.get('key') || '';
  if (!secretMatches(key, env.GALLABOX_WEBHOOK_SECRET)) return reply(401, { error: 'unauthorised' });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply(413, { error: 'payload too large' });
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, { error: 'invalid json' });
  }

  if (env.WHATSAPP_ATTRIBUTION_ENABLED !== '1') {
    // Gallabox calls this for every incoming message, so the shape is logged
    // only in this learning mode, before the switch is flipped.
    log('whatsapp-attribution: payload shape', { paths: describeShape(body) });
    return reply(200, { status: 'disabled' });
  }

  defer(
    processChat(body, deps)
      .then((outcome) => log('whatsapp-attribution: outcome', outcome))
      .catch((error) => log('whatsapp-attribution: failed', { message: error.message })),
  );
  return reply(200, { status: 'accepted' });
}
