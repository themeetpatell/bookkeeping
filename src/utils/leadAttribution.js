/**
 * Browser half of /api/lead-attribution: once a lead exists (form accepted,
 * booking confirmed, proposal created), send the visitor's stored attribution
 * so the server can write it onto that Zoho Lead. See server/attribution/.
 *
 * Tracking must never break the page, so nothing here throws. A failed send is
 * reported to PostHog rather than swallowed.
 */
import { claimOnce, getLeadId } from './leadTracking';

export const ATTRIBUTION_ENDPOINT = '/api/lead-attribution';
const ENTRY_KEY = 'fs_entry';

const TOUCH_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid',
  'landing_page', 'referrer', 'click_ts',
];

/**
 * Records the first page and external referrer of this tab session.
 * AttributionTracker only writes its cookies when the URL carries a UTM or a
 * click id, so without this an organic search visit leaves no trace at all.
 */
export function recordEntryTouch() {
  try {
    if (window.sessionStorage.getItem(ENTRY_KEY)) return;
    const referrer = document.referrer || '';
    const external = referrer && new URL(referrer).origin !== window.location.origin;
    window.sessionStorage.setItem(
      ENTRY_KEY,
      JSON.stringify({
        landing_page: window.location.origin + window.location.pathname,
        referrer: external ? referrer : '',
      }),
    );
  } catch {
    // Storage blocked or a malformed referrer: the lead is still sent, just without an entry touch.
  }
}

const pick = (source, prefix = '') =>
  TOUCH_KEYS.reduce((out, key) => {
    const value = source[prefix + key];
    if (value) out[key] = String(value);
    return out;
  }, {});

/**
 * Pure: shapes the request body from what the page has on hand.
 * @param {string} secondarySource one of the agreed Secondary Source values
 * @param {{ email?: string, phone?: string }} contact
 * @param {{ attribution?: object, entry?: object, leadId?: string, posthogId?: string }} context
 */
export function buildAttributionPayload(secondarySource, contact, context) {
  const a = context.attribution || {};
  const payload = {
    secondarySource,
    last: pick(a),
    first: pick(a, 'first_'),
    entry: context.entry || {},
  };
  if (contact.email) payload.email = contact.email;
  if (contact.phone) payload.phone = contact.phone;
  if (a.fbp) payload.fbp = a.fbp;
  if (a.fbc) payload.fbc = a.fbc;
  if (context.leadId) payload.leadId = context.leadId;
  if (context.posthogId) payload.posthogId = context.posthogId;
  return payload;
}

function readContext() {
  let entry = {};
  try {
    entry = JSON.parse(window.sessionStorage.getItem(ENTRY_KEY) || '{}');
  } catch {
    // Unreadable entry touch: send without it.
  }
  const posthog = window.posthog;
  return {
    attribution: typeof window.fsAttribution === 'function' ? window.fsAttribution() : {},
    entry,
    leadId: getLeadId(),
    posthogId: posthog && posthog.get_distinct_id ? posthog.get_distinct_id() : '',
  };
}

/**
 * Sends once per tab session per entry method. keepalive lets the request
 * finish if the visitor closes the tab straight after converting.
 * @param {string} secondarySource
 * @param {{ email?: string, phone?: string }} contact
 */
export function sendLeadAttribution(secondarySource, contact) {
  if (typeof window === 'undefined' || !(contact.email || contact.phone)) return;
  if (!claimOnce(`attribution:${secondarySource}`)) return;

  const body = JSON.stringify(buildAttributionPayload(secondarySource, contact, readContext()));
  fetch(ATTRIBUTION_ENDPOINT, {
    method: 'POST',
    keepalive: true,
    headers: { 'content-type': 'application/json' },
    body,
  }).catch((error) => {
    try {
      window.posthog?.capture('lead_attribution_failed', {
        secondary_source: secondarySource,
        message: String(error && error.message),
      });
    } catch {
      // PostHog itself unavailable; nothing further to report to.
    }
  });
}
