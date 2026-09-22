/**
 * Invisible join key for WhatsApp leads.
 *
 * Gallabox's tracker (bound to `.data-wa-track` links by WhatsAppTracker.jsx)
 * hides the page URL in the prefilled message as zero-width characters. The
 * customer sees the same message as before. Just before its click handler runs,
 * this adds a short `fs_ref` to the page URL, so the hidden URL carries it, and
 * records the click's attribution in PostHog under the same ref. The Gallabox
 * webhook (server/whatsapp/) decodes the ref and joins the chat to the click.
 *
 * Nothing visible is appended: a code in plain sight gets deleted by customers.
 */
import { REF_PARAM } from '../../server/whatsapp/decode.js';
import { messageFromHref, normalizeMessage } from '../../server/whatsapp/messageKey.js';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const REF_LENGTH = 8;
const ENTRY_KEY = 'fs_entry';
const TRACKED_SELECTOR = 'a.data-wa-track';
const WHATSAPP_HOST = /(^|\.)(wa\.me|api\.whatsapp\.com)$/;

/**
 * @param {Uint8Array} bytes random bytes, at least REF_LENGTH of them
 * @returns {string} an 8-character ref from an unambiguous alphabet
 */
export function refFromBytes(bytes) {
  return Array.from(bytes.slice(0, REF_LENGTH), (b) => ALPHABET[b % ALPHABET.length]).join('');
}

/**
 * @param {string} href the current page URL
 * @param {string} ref
 * @returns {string} the same URL with the ref set
 */
export function withRef(href, ref) {
  const url = new URL(href);
  url.searchParams.set(REF_PARAM, ref);
  return url.toString();
}

/** @returns {boolean} whether a link opens WhatsApp */
export function isWhatsAppLink(href) {
  try {
    return WHATSAPP_HOST.test(new URL(href).hostname);
  } catch {
    return false;
  }
}

/**
 * The prefilled message in the form the webhook compares. Gallabox strips its
 * hidden URL before forwarding a chat, so this text is what joins the chat to
 * the click (server/whatsapp/messageKey.js).
 * @param {string} href the WhatsApp link that was clicked
 * @returns {string}
 */
export function waTextFromHref(href) {
  return normalizeMessage(messageFromHref(href));
}

function readEntry() {
  try {
    return JSON.parse(window.sessionStorage.getItem(ENTRY_KEY) || '{}');
  } catch {
    return {};
  }
}

function recordClick(ref, href) {
  const attribution = typeof window.fsAttribution === 'function' ? window.fsAttribution() : {};
  const entry = readEntry();
  window.posthog?.capture(
    'whatsapp_ref_issued',
    {
      ...attribution,
      [REF_PARAM]: ref,
      entry_landing_page: entry.landing_page || '',
      entry_referrer: entry.referrer || '',
      page: window.location.pathname,
      wa_text: waTextFromHref(href),
    },
    // The visitor is leaving for WhatsApp; don't let the batch wait.
    { send_instantly: true },
  );
}

function onClick(event) {
  try {
    const link = event.target?.closest?.(TRACKED_SELECTOR);
    if (!link || !isWhatsAppLink(link.href)) return;

    const bytes = new Uint8Array(REF_LENGTH);
    window.crypto.getRandomValues(bytes);
    const ref = refFromBytes(bytes);
    const original = window.location.href;

    // Gallabox reads window.location.href inside its own click handler, which
    // runs after this capture-phase listener in the same dispatch.
    window.history.replaceState(window.history.state, '', withRef(original, ref));
    window.setTimeout(() => window.history.replaceState(window.history.state, '', original), 0);
    recordClick(ref, link.href);
  } catch (error) {
    // Tracking must never block the chat from opening; report instead of swallowing.
    try {
      window.posthog?.capture('whatsapp_ref_failed', { message: String(error && error.message) });
    } catch {
      // PostHog unavailable too; nothing left to report to.
    }
  }
}

/** Installs the listener once. Capture phase, so it runs before Gallabox's handler. */
export function installWhatsAppRef() {
  if (typeof window === 'undefined' || window.__fsWaRef) return;
  window.__fsWaRef = true;
  document.addEventListener('click', onClick, true);
}
