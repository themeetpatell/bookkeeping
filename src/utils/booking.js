// Single source of truth for the booking destinations. The same link is
// rendered from the global nav, the footer, and the WhatsApp landing page, so
// swapping the scheduler should be a one-line change here.

// In-app route, deliberately NOT an external URL: the scheduler is embedded on
// our own domain so a visitor never leaves it mid-funnel. That keeps the
// first-party cookies, the ad-click params and the PostHog session alive
// through the booking, which an off-site scheduler would drop.
export const BOOKING_PATH = '/book-a-call';

// Where Zoho Bookings is told to send the visitor after a confirmed booking.
export const BOOKING_CONFIRMED_PATH = '/booking-confirmed';

/* Every origin this app answers on. Zoho Bookings allows exactly ONE redirect
   URL per service, so whichever origin it points at, visitors arriving on any
   of the others get a confirmation page that is CROSS-ORIGIN with the page
   framing it — and a cross-origin frame cannot navigate the top window, so the
   confirmation renders squeezed inside the scheduler and the conversion fires
   in the wrong context. The two sides talk over postMessage instead, and this
   list is the allowlist for both ends. Add any new domain here.

   The long-term fix is to serve the site from one origin and redirect the rest;
   until then this keeps bookings attributable on all of them. */
export const APP_ORIGINS = [
  'https://accounting.finanshels.com',
  'https://accounting.finanshels.co',
  'https://finanshelsaccounting.co',
  'https://www.finanshelsaccounting.co',
];

// Sent by the framed confirmation page to whichever of our pages is framing it.
export const BOOKING_CONFIRMED_MESSAGE = 'finanshels:booking-confirmed';

const BOOKING_ORIGIN = 'https://contact-finanshels.zohobookings.com';

// One Zoho service per ad channel, so bookings land in the right calendar and
// stay attributable to the campaign that paid for them.
const BOOKING_SLUGS = {
  google: 'accounting-google',
  bing: 'accounting-bing',
};

const DEFAULT_CHANNEL = 'google';

// The channel travels from the landing page to the booking page on the query
// string, because BOOKING_PATH is its own route and would otherwise have no way
// of knowing which ad brought the visitor here.
export const BOOKING_CHANNEL_PARAM = 'channel';

// Bing traffic has its own set of landing pages, all suffixed this way in the
// router — see App.jsx.
const BING_PATH_SUFFIX = '-bing';

/**
 * @param {string} pathname - the current route, e.g. '/bookkeeping-bing'
 * @returns {'google' | 'bing'} the ad channel that owns the page
 */
const channelForPath = (pathname) =>
  String(pathname || '').endsWith(BING_PATH_SUFFIX) ? 'bing' : DEFAULT_CHANNEL;

/**
 * Booking link for a page, carrying that page's channel through to the scheduler.
 * @param {string} pathname - the current route
 * @returns {string} e.g. '/book-a-call?channel=bing'
 */
export const getBookingPath = (pathname) => {
  const channel = channelForPath(pathname);
  if (channel === DEFAULT_CHANNEL) return BOOKING_PATH;
  return `${BOOKING_PATH}?${BOOKING_CHANNEL_PARAM}=${channel}`;
};

/**
 * Resolves the two Zoho URLs the booking page needs for a channel.
 * Unknown or missing values fall back to Google, which is the larger spend and
 * the destination every non-Bing page uses.
 * @param {string} search - the booking page's query string, e.g. '?channel=bing'
 * @returns {{ portalUrl: string, fallbackUrl: string }}
 */
export const resolveBookingUrls = (search) => {
  let channel = DEFAULT_CHANNEL;
  try {
    const requested = new URLSearchParams(search).get(BOOKING_CHANNEL_PARAM);
    if (requested && BOOKING_SLUGS[requested]) channel = requested;
  } catch {
    // Malformed query string — the Google scheduler is the safe default.
  }

  const slug = BOOKING_SLUGS[channel];
  return {
    // Zoho's iframe-friendly portal, rendered by the embed widget on BOOKING_PATH.
    portalUrl: `${BOOKING_ORIGIN}/portal-embed#/${slug}`,
    // Standalone Zoho page, offered as an escape hatch when the embed script is
    // blocked (ad blockers routinely eat third-party booking widgets).
    fallbackUrl: `${BOOKING_ORIGIN}/${slug}`,
  };
};

// Basic shape check so a malformed value never renders into the confirmation copy.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Reads a customer detail Zoho Bookings appended to the post-booking redirect.
 * The inline script in index.html moves those params into sessionStorage under a
 * `booking_` prefix and strips them from the URL before GTM loads, so look there
 * first and fall back to the raw query string in case that script did not run.
 * @param {string} key - the Zoho param name, e.g. 'customer_email'
 * @returns {string} the trimmed value, or '' when absent
 */
export const readBookingParam = (key) => {
  try {
    const stored = window.sessionStorage.getItem(`booking_${key}`) || '';
    if (stored.trim()) return stored.trim();
  } catch {
    // sessionStorage blocked (private mode) — fall through to the URL.
  }
  try {
    return (new URLSearchParams(window.location.search).get(key) || '').trim();
  } catch {
    // URL parsing unavailable — the generic confirmation copy is used instead.
    return '';
  }
};

/**
 * @returns {string} the email the booking was made with, or '' when absent/malformed
 */
export const readBookedEmail = () => {
  const email = readBookingParam('customer_email');
  return EMAIL_PATTERN.test(email) ? email : '';
};
