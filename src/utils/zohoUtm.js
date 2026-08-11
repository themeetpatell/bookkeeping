/**
 * Reads the attribution cookies that Zoho's tracking script writes.
 *
 * The vendor script in index.html resolves attribution once, in <head>, and
 * stores it in `utm_*` cookies (7-day expiry) before React ever boots. It then
 * tries to copy those values onto the forms' hidden inputs — but only once, on
 * `window.load`, by assigning to `input.value` directly. That does not survive
 * React: any later render of the form resets the inputs, and forms mounted by
 * client-side navigation are never populated at all.
 *
 * So React reads the cookies itself and renders them as the inputs' values.
 * The vendor script stays the single source of truth for *resolving*
 * attribution (URL params, gclid-only visits, referrer, organic search); this
 * only mirrors its result into the DOM in a way React won't undo.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function readCookie(name) {
  const match = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
  if (!match) return '';
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return '';
  }
}

/**
 * @returns {Record<'utm_source'|'utm_medium'|'utm_campaign'|'utm_term'|'utm_content', string>}
 *   Always every key, always a string — never undefined, so the inputs stay
 *   controlled and React never warns about a switch to uncontrolled.
 */
export function getZohoUtmValues() {
  const values = {};
  const canRead = typeof document !== 'undefined';
  UTM_KEYS.forEach((key) => {
    values[key] = canRead ? readCookie(key) : '';
  });
  return values;
}

/** Pulls a key out of the JSON attribution cookies SalesIQAttribution writes. */
function readAttributionCookie(name, key) {
  const raw = readCookie(name);
  if (!raw) return '';
  try {
    return JSON.parse(raw)[key] || '';
  } catch {
    return '';
  }
}

/**
 * The Google Ads click id, for the form's `zc_gad` field.
 *
 * Zoho's own zf_gclid.js is not loaded: it defines the routine that fills
 * `zc_gad` (`GAd.prototype.s_Hid`) but never calls it, so on an HTML-embedded
 * form it only sets a cookie and the field stays empty. The click id is already
 * captured here in three places, so read it back rather than add a script that
 * does not finish the job.
 *
 * Ordered most- to least-specific: this visit's URL, then the 7-day cookie the
 * Zoho tracking script sets, then the 90/365-day attribution cookies — so a
 * visitor who clicks the ad today and submits next week still reports a gclid.
 */
export function getGclid() {
  if (typeof document === 'undefined') return '';
  return (
    new URLSearchParams(window.location.search).get('gclid') ||
    readCookie('gclid') ||
    readAttributionCookie('fs_last', 'gclid') ||
    readAttributionCookie('fs_first', 'gclid') ||
    ''
  );
}
