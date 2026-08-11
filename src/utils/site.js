/**
 * The app is served from more than one domain at once — finanshelsaccounting.co
 * alongside the older accounting.finanshels.co, which keeps running because live
 * campaigns still point at it. Neither redirects to the other.
 *
 * So nothing may hardcode a host: every absolute URL is built from the origin the
 * visitor actually arrived on. That keeps the Zoho form redirect, the conversion
 * flags in sessionStorage and the booking flow inside one origin — a cross-domain
 * hop would strand the sessionStorage flag and silently drop the conversion.
 */

// Only reached when there is no `window` (a build-time render). Live traffic
// always resolves the real origin below.
const FALLBACK_ORIGIN = 'https://finanshelsaccounting.co';

/**
 * @returns {string} the origin this page is being served from, e.g. 'https://finanshelsaccounting.co'
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
