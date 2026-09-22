/**
 * The app answers on several domains. accounting.finanshels.com is the PRIMARY
 * one (decided 2026-09-22); accounting.finanshels.co and finanshelsaccounting.co
 * (whose apex 308s to www) are secondary and stay up because live ad campaigns
 * still point at them.
 *
 * Two kinds of URL, kept apart on purpose:
 * - Identity (canonical, og:url, JSON-LD url/image): always the primary domain,
 *   so every copy of a page names one owner. Use canonicalUrl().
 * - Navigation (the Zoho form redirect, the booking flow): the origin the
 *   visitor actually arrived on. A cross-domain hop would strand the conversion
 *   flag in sessionStorage and silently drop the conversion. Use absoluteUrl().
 */

export const PRIMARY_ORIGIN = 'https://accounting.finanshels.com';

// Only reached when there is no `window` (a build-time render). Live traffic
// always resolves the real origin below.
const FALLBACK_ORIGIN = PRIMARY_ORIGIN;

/**
 * @returns {string} the origin this page is being served from, e.g. 'https://accounting.finanshels.com'
 */
export const getSiteOrigin = () => {
  if (typeof window === 'undefined') return FALLBACK_ORIGIN;
  return window.location.origin || FALLBACK_ORIGIN;
};

/**
 * @param {string} path - a root-relative path, e.g. '/thank-you'
 * @returns {string} that path on the current origin
 */
export const absoluteUrl = (path = '/') =>
  `${getSiteOrigin()}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * @param {string} path - a root-relative path, e.g. '/bookkeeping'
 * @returns {string} that path on the primary domain, whichever domain is serving
 */
export const canonicalUrl = (path = '/') =>
  `${PRIMARY_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
