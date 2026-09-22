import { z } from 'zod';

/**
 * How a lead reached us. These are the CRM's Secondary Source values, agreed
 * 2026-09-22: Lead Source says WHICH channel paid for the visit, Secondary
 * Source says HOW the person got in touch.
 *
 * Secondary_Source is a RESTRICTED picklist: these must match its values exactly
 * (added in Zoho 2026-09-22). A value Zoho rejects is dropped by writeFields in
 * handler.js and the rest of the attribution is still written.
 */
export const SECONDARY_SOURCES = [
  'Zoho Form',
  'Zoho Booking',
  'WhatsApp Button',
  'Proposal Engine',
  'Call',
  'Instant Form', // Meta lead forms
];

/* Short, bounded strings only. Everything here lands in a CRM text field, and
   an unbounded value from a public endpoint is an easy way to fill one with junk. */
const id = z.string().trim().min(1).max(250);
const text = z.string().trim().max(250);

/** Last touch or first touch: the shape AttributionTracker keeps in fs_last / fs_first. */
const touchSchema = z
  .object({
    utm_source: text,
    utm_medium: text,
    utm_campaign: text,
    utm_term: text,
    utm_content: text,
    gclid: id,
    gbraid: id,
    wbraid: id,
    fbclid: id,
    msclkid: id,
    ttclid: id,
    landing_page: text,
    referrer: text,
    click_ts: text,
  })
  .partial()
  .strip();

export const attributionPayloadSchema = z
  .object({
    secondarySource: z.enum(SECONDARY_SOURCES),
    email: z.string().trim().toLowerCase().email().max(254).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ()-]{7,20}$/)
      .optional(),
    last: touchSchema.default({}),
    first: touchSchema.default({}),
    /* The session's entry page and referrer, recorded even when the visit
       carried no UTM or click id. The only way an organic visit is visible. */
    entry: z.object({ landing_page: text, referrer: text }).partial().strip().default({}),
    fbp: id.optional(),
    fbc: id.optional(),
    leadId: id.optional(),
    posthogId: id.optional(),
  })
  .strip()
  .refine((p) => Boolean(p.email || p.phone), {
    message: 'an email or a phone is required to find the lead',
  });

/**
 * @param {unknown} body the parsed request body
 * @returns {{ ok: true, value: object } | { ok: false, error: string }}
 */
export function parseAttributionPayload(body) {
  const result = attributionPayloadSchema.safeParse(body);
  if (result.success) return { ok: true, value: result.data };
  return { ok: false, error: result.error.issues.map((i) => i.message).join('; ') };
}
