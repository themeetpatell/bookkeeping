/**
 * Meta pixel advanced matching: hands the lead's email and phone to the pixel
 * so Meta can match the Lead event to a person.
 *
 * Why this exists: the base pixel is a Custom HTML tag in GTM that calls
 * `fbq('init', <id>)` with no user data, and the Lead tag fires a bare
 * `fbq('track', 'Lead')` on `form_submit`. Nothing ever gave the pixel an em or
 * ph, which is why the dataset's event match quality sat at 6.1.
 *
 * How it works without a GTM change: fbevents.js accepts a SECOND
 * `fbq('init', id, userData)` for a pixel whose first init carried no user
 * data, and fills the user data in instead of rejecting it as a duplicate
 * (read from the fbevents.js source, 2026-09-22). Every later event on the
 * page, including the Lead tag, then carries it. The pixel normalises and
 * SHA-256 hashes em/ph in the browser before anything leaves the page.
 *
 * Rules this module keeps:
 * 1. It only re-inits pixel ids the page has ALREADY initialised, read from the
 *    pixel itself. A hardcoded id that drifted from the GTM tag would create a
 *    second pixel and send it every Lead.
 * 2. Email and phone never go into the dataLayer or PostHog event params — the
 *    stash here is separate from the GA4 `form_submit` payload on purpose.
 * 3. Tracking never breaks the page. Every storage and fbq call is wrapped.
 */

const MATCH_KEYS_KEY = 'fs_match_keys';

// Zoho field names shared by every lead form on the site.
const EMAIL_FIELD = 'Email';
const PHONE_FIELD = 'PhoneNumber_countrycode';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// E.164 allows at most 15 digits; below 8 is not a reachable number anywhere.
const MIN_PHONE_DIGITS = 8;
const MAX_PHONE_DIGITS = 15;
const UAE_CODE = '971';

const DEFAULT_RETRY_MS = 100;
const DEFAULT_TIMEOUT_MS = 5000;

/**
 * @param {unknown} raw
 * @returns {string} trimmed lowercase email, or '' when it is not one
 */
export function normalizeEmail(raw) {
  const email = String(raw || '').trim().toLowerCase();
  return EMAIL_PATTERN.test(email) ? email : '';
}

/**
 * Digits only, with a country code and no leading zeros — the form Meta
 * matches on. The forms are free text and nearly every lead is in the UAE, so
 * a local mobile ("050 123 4567" or "50 123 4567") gets 971 added; any other
 * number is expected to have been typed with its own code.
 * @param {unknown} raw
 * @returns {string} e.g. '971501234567', or '' when it cannot be a real number
 */
export function normalizePhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  else if (/^05\d{8}$/.test(digits)) digits = UAE_CODE + digits.slice(1);
  else if (/^5\d{8}$/.test(digits)) digits = UAE_CODE + digits;

  if (digits.length < MIN_PHONE_DIGITS || digits.length > MAX_PHONE_DIGITS) return '';
  return digits;
}

/**
 * @param {{ email?: string, phone?: string }} keys
 * @returns {{ em?: string, ph?: string } | null} null when nothing normalised
 */
export function buildUserData({ email, phone } = {}) {
  const em = normalizeEmail(email);
  const ph = normalizePhone(phone);
  if (!em && !ph) return null;
  return { ...(em && { em }), ...(ph && { ph }) };
}

/**
 * The pixel ids this page initialised without user data — the only ones
 * fbevents.js will accept user data for on a second init.
 *
 * Read from getState() once fbevents.js has loaded, or from the stub's queue
 * before it has (the GTM tag queues its init there).
 * @param {unknown} fbq window.fbq
 * @returns {string[]}
 */
export function initialisedPixelIds(fbq) {
  if (typeof fbq !== 'function') return [];

  try {
    if (typeof fbq.getState === 'function') {
      const pixels = (fbq.getState() || {}).pixels || [];
      return pixels.map((pixel) => String(pixel.id)).filter(Boolean);
    }
  } catch {
    // Fall through to the queue.
  }

  const queue = Array.isArray(fbq.queue) ? fbq.queue : [];
  return queue
    .filter((args) => args && args[0] === 'init' && args[1] && !args[2])
    .map((args) => String(args[1]));
}

function initWithUserData(win, userData) {
  const ids = initialisedPixelIds(win.fbq);
  if (ids.length === 0) return false;
  ids.forEach((id) => {
    try {
      win.fbq('init', id, userData);
    } catch {
      // A broken pixel must not break the confirmation page.
    }
  });
  return true;
}

/**
 * Gives the page's Meta pixel the lead's email and phone.
 *
 * Call it BEFORE pushing the event that fires the Meta Lead tag, so the user
 * data is ahead of the Lead in the pixel's queue. If the pixel has not loaded
 * yet (GTM still arriving), it retries until `timeoutMs` and then gives up —
 * an ad blocker means it never will.
 *
 * @param {{ em?: string, ph?: string } | null} userData from buildUserData()
 * @param {{ win?: object, retryMs?: number, timeoutMs?: number }} [options]
 * @returns {boolean} true when applied immediately; false when deferred or skipped
 */
export function applyMetaUserData(userData, options = {}) {
  const {
    win = typeof window === 'undefined' ? undefined : window,
    retryMs = DEFAULT_RETRY_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;
  if (!win || !userData) return false;
  if (initWithUserData(win, userData)) return true;

  let waited = 0;
  const timerId = setInterval(() => {
    waited += retryMs;
    if (initWithUserData(win, userData) || waited >= timeoutMs) clearInterval(timerId);
  }, retryMs);
  return false;
}

/**
 * The call sites use this, not applyMetaUserData directly.
 *
 * On a fresh page load React usually runs before GTM has arrived, so there is
 * no fbq yet. A direct call would fall back to its retry, while the event push
 * that follows waits in the dataLayer — and when GTM lands it drains that queue
 * (base pixel init, then the Lead tag) before the retry ticks. The Lead then
 * leaves without user data. Seen in a real browser against the live container,
 * 2026-09-22.
 *
 * GTM runs a function pushed onto the dataLayer in queue order, so pushing the
 * apply step immediately before the event puts it after the base pixel's init
 * and ahead of the Lead tag whether GTM has loaded yet or not. The retry inside
 * applyMetaUserData still covers a pixel that is slower than GTM.
 *
 * @param {{ em?: string, ph?: string } | null} userData from buildUserData()
 * @param {{ win?: object }} [options]
 */
export function queueMetaUserData(userData, options = {}) {
  const { win = typeof window === 'undefined' ? undefined : window } = options;
  if (!win || !userData) return;
  try {
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push(() => {
      applyMetaUserData(userData, { win });
    });
  } catch {
    // A blocked dataLayer must not break the confirmation page.
  }
}

/**
 * Records the submitted email and phone for /thank-you, which is where the
 * Lead fires. Same sessionStorage handoff the rest of the submit tracking uses,
 * because the native POST to Zoho leaves the page.
 * @param {HTMLFormElement} formEl
 * @param {object} [win]
 */
export function stashMatchKeys(formEl, win = window) {
  const read = (name) => {
    const field = formEl.querySelector(`[name="${name}"]`);
    return field ? String(field.value || '').trim() : '';
  };
  const email = read(EMAIL_FIELD);
  const phone = read(PHONE_FIELD);
  if (!email && !phone) return;

  try {
    win.sessionStorage.setItem(MATCH_KEYS_KEY, JSON.stringify({ email, phone }));
  } catch {
    // Blocked storage: the Lead still fires, just without match keys.
  }
}

/**
 * Reads the stashed match keys once and clears them, so a refresh of
 * /thank-you does not re-send them.
 * @param {object} [win]
 * @returns {{ email: string, phone: string } | null}
 */
export function takeMatchKeys(win = window) {
  let raw = '';
  try {
    raw = win.sessionStorage.getItem(MATCH_KEYS_KEY) || '';
    if (raw) win.sessionStorage.removeItem(MATCH_KEYS_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return { email: String(parsed.email || ''), phone: String(parsed.phone || '') };
  } catch {
    return null;
  }
}
