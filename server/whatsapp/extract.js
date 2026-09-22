/**
 * Pulls the two things the join needs out of a Gallabox webhook body without
 * hard-coding its shape, which is not published anywhere we could read
 * (checked 2026-09-22). Once real deliveries confirm the paths, these walks
 * can be narrowed; `describeShape` logs the paths for exactly that purpose.
 */
import { decodeHiddenUrl } from './decode.js';

const HIDDEN = /[‌-‏]/;
const MAX_DEPTH = 8;

/* Our own WhatsApp Business number. A webhook can carry it (as the channel, or
   as `to`), and attaching a lead's attribution by it would be wrong every time. */
const BUSINESS_NUMBERS = new Set(['971521549572']);

/* Keys that name a phone. Deliberately not a bare "number": ids such as
   sequenceNumber or conversationNumber are 8-15 digits often enough to pass. */
const PHONE_KEY = /^(phone|phone_?number|mobile|mobile_?number|from|wa_?id|msisdn|sender)$/i;
/* Paths that describe the customer rank above everything else. */
const CUSTOMER_PATH = /(contact|customer|sender|from|user)/i;
/* Paths that describe our side of the conversation are never the customer. */
const OUR_SIDE_PATH = /(channel|business|account|agent|^to$|recipient|owner)/i;

function* walk(value, path = [], depth = 0) {
  if (depth > MAX_DEPTH || value === null || value === undefined) return;
  if (typeof value !== 'object') {
    yield { path, value };
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    yield* walk(child, [...path, key], depth + 1);
  }
}

/**
 * Tries every string that carries hidden characters and returns the first one
 * that decodes, so an emoji joined with U+200D elsewhere cannot shadow it.
 * @returns {string} the page URL hidden in the message, or ''
 */
export function findHiddenUrl(body) {
  for (const { value } of walk(body)) {
    if (typeof value !== 'string' || !HIDDEN.test(value)) continue;
    const url = decodeHiddenUrl(value);
    if (url) return url;
  }
  return '';
}

/** @returns {string} the customer's phone as +digits, or '' when none is found */
export function findPhone(body) {
  const candidates = [];
  for (const { path, value } of walk(body)) {
    const key = path[path.length - 1] || '';
    if (!PHONE_KEY.test(key) || path.some((p) => OUR_SIDE_PATH.test(p))) continue;
    const digits = String(value).replace(/[^0-9]/g, '');
    if (digits.length < 8 || digits.length > 15 || BUSINESS_NUMBERS.has(digits)) continue;
    candidates.push({ digits, customer: path.some((p) => CUSTOMER_PATH.test(p)) });
  }
  const best = candidates.find((c) => c.customer) || candidates[0];
  return best ? `+${best.digits}` : '';
}

/** Field paths only, never values: safe to log, and enough to pin the shape. */
export function describeShape(body) {
  return [...walk(body)].map(({ path, value }) => `${path.join('.')}:${typeof value}`).slice(0, 60);
}
