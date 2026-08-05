// Single source of truth for the booking destinations. The same link is
// rendered from the global nav, the footer, and the WhatsApp landing page, so
// swapping the scheduler should be a one-line change here.

// In-app route, deliberately NOT an external URL: the scheduler is embedded on
// our own domain so a visitor never leaves it mid-funnel. That keeps the
// first-party cookies, the ad-click params and the PostHog session alive
// through the booking, which an off-site scheduler would drop.
export const BOOKING_PATH = '/book-a-call';

// Zoho's iframe-friendly portal, rendered by the embed widget on BOOKING_PATH.
export const BOOKING_PORTAL_URL =
  'https://contact-finanshels.zohobookings.com/portal-embed#/accounting';

// Standalone Zoho page, offered as an escape hatch when the embed script is
// blocked (ad blockers routinely eat third-party booking widgets).
export const BOOKING_FALLBACK_URL =
  'https://contact-finanshels.zohobookings.com/#/accounting';

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
