/**
 * Google Ads enhanced conversions: SHA-256 hashes of the lead's email and phone,
 * normalised the way Google requires (support.google.com/google-ads/answer/13262500):
 * lowercase and trim, dots before @gmail.com / @googlemail.com removed, phone in
 * E.164 with a '+'. Only the hex hashes enter the dataLayer.
 *
 * The contract GTM reads (task 3.2, 2026-09-22-gtm-3.2-fix-draft.md): the
 * consultation_form_ec push carries `lead_id` and `ads_user_data`, which the
 * "UPD - Lead (hashed dataLayer)" variable passes to tag 25.
 */
import { normalizeEmail, normalizePhone } from './metaMatching';

const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);
const CONVERSION_EVENT = 'consultation_form_ec';

/**
 * @param {unknown} raw
 * @returns {string} Google-normalised email, or '' when it is not one
 */
export function normalizeGoogleEmail(raw) {
  const email = normalizeEmail(raw);
  if (!email) return '';
  const [local, domain] = email.split('@');
  return GMAIL_DOMAINS.has(domain) ? `${local.replace(/\./g, '')}@${domain}` : email;
}

/**
 * @param {unknown} raw
 * @returns {string} E.164 with a '+', e.g. '+971501234567', or ''
 */
export function normalizeGooglePhone(raw) {
  const digits = normalizePhone(raw);
  return digits ? `+${digits}` : '';
}

async function sha256Hex(value, subtle) {
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * @param {{ email?: string, phone?: string }} keys
 * @param {SubtleCrypto} [subtle] injectable for tests
 * @returns {Promise<{ sha256_email_address?: string, sha256_phone_number?: string } | null>}
 *   null when there is nothing to hash, no Web Crypto, or hashing fails
 */
export async function buildGoogleUserData(
  { email, phone } = {},
  subtle = globalThis.crypto && globalThis.crypto.subtle,
) {
  const em = normalizeGoogleEmail(email);
  const ph = normalizeGooglePhone(phone);
  if (!subtle || (!em && !ph)) return null;
  try {
    return {
      ...(em && { sha256_email_address: await sha256Hex(em, subtle) }),
      ...(ph && { sha256_phone_number: await sha256Hex(ph, subtle) }),
    };
  } catch {
    return null; // Hashing must never block the conversion.
  }
}

/**
 * The consultation_form_ec dataLayer push.
 *
 * Keeps today's raw-email keys (enhanced_conversion_data, user_data) alongside
 * the hashes for now: GTM variables 38 and 77 may read them, and they are only
 * removed after a GTM Preview check shows neither does (the 3.2 follow-up).
 *
 * @param {{ leadId?: string, email?: string, adsUserData?: object | null }} input
 * @returns {Record<string, unknown>}
 */
export function buildConversionPush({ leadId, email, adsUserData }) {
  return {
    event: CONVERSION_EVENT,
    _event: CONVERSION_EVENT,
    ...(leadId && { lead_id: leadId }),
    ads_user_data: adsUserData || undefined,
    enhanced_conversion_data: { email },
    user_data: { email },
  };
}
