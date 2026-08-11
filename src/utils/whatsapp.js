// Shared WhatsApp deep-link helpers for the global CTAs (floating button,
// offer-bar nudge). Bing/Microsoft Ads passes the matched search keyword
// through the `utm_term` URL parameter (see the Zoho tracking script in
// index.html, which captures the same param). On Bing landing pages we surface
// that keyword in the WhatsApp message so sales sees exactly what was searched.

const WHATSAPP_PHONE = '971521549572';

/**
 * Reads the Bing ads keyword from a URL query string.
 * @param {string} search - e.g. window.location.search / router location.search
 * @returns {string} the trimmed keyword, or '' when absent
 */
export const getAdKeyword = (search = '') => {
  const params = new URLSearchParams(search);
  const keyword = params.get('utm_term') || params.get('keyword') || '';
  return keyword.trim();
};

/**
 * Which network sent the visitor, inferred from the landing route. Every
 * network gets its own pages on this ads-only site, so the path is a more
 * reliable signal than utm_source, which ad blockers and manual link edits
 * strip. Anything unrecognised is Google — it buys the most traffic here.
 *
 * @param {string} pathname - router location.pathname
 * @returns {'bing' | 'reddit' | 'google'}
 */
export const getAdSource = (pathname = '') => {
  const path = pathname.toLowerCase();
  if (path.includes('bing')) return 'bing';
  if (path.includes('reddit')) return 'reddit';
  return 'google';
};

/**
 * @param {string} message - human-readable prefilled WhatsApp message
 * @returns {string} a full api.whatsapp.com deep link
 */
export const buildWhatsAppUrl = (message) =>
  `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}` +
  `&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
