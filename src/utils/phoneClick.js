/**
 * `phone_click`: a visitor tapped one of the site's phone numbers.
 *
 * Measurement only. A tap on a tel: link tells us nothing about who is calling,
 * so it cannot be joined to a CRM lead; calls that become leads are filed by
 * sales with Secondary Source "Call". This event makes the channel visible in
 * GA4 and PostHog, next to whatsapp_click, instead of not existing at all.
 */

export const PHONE_CLICK = 'phone_click';
export const PHONE_SELECTOR = 'a[href^="tel:" i]';

/** @returns {boolean} whether an href dials a number */
export const isPhoneLink = (href) => /^tel:/i.test(String(href || ''));

/**
 * Where the tapped number sits, from the page structure; the site's phone
 * links carry no location attribute of their own.
 * @param {Element} el the clicked link
 * @returns {string}
 */
export function phoneLinkLocation(el) {
  const tagged = el.closest('[data-phone-location]');
  if (tagged) return tagged.getAttribute('data-phone-location') || '';
  if (el.closest('footer')) return 'footer';
  if (el.closest('.contact-btn, .floating-contacts')) return 'floating';
  return 'inline';
}

/**
 * @param {{ href: string, location: string, pathname: string }} input
 * @returns {{ link_location: string, page_path: string, phone_number: string }}
 */
export function phoneClickParams({ href, location, pathname }) {
  return {
    link_location: location || 'inline',
    page_path: pathname,
    // Our own business number, not a visitor's: safe to report.
    phone_number: String(href).replace(/^tel:/i, '').replace(/[^0-9+]/g, ''),
  };
}
