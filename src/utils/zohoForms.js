/**
 * Zoho Form endpoints for the paid-traffic lead forms.
 *
 * Each ad channel posts to its OWN Zoho form so leads are separable in the CRM
 * without relying on UTMs surviving the round trip. Keep the split intact: a
 * `-bing` route must never post to the Google endpoint, or Bing conversions
 * land in the Google form's records.
 */
import { absoluteUrl } from './site';

const ZOHO_FORM_BASE = 'https://forms.zohopublic.com/finanshelsllc/form';

export const ZOHO_GOOGLE_FORM_ACTION = `${ZOHO_FORM_BASE}/BookYourAccountingConsultationGoogle/formperma/rqkTebkjHTC2gkE_UeXqR7bduSDXQY3OhyjAP8nWoGk/htmlRecords/submit`;

export const ZOHO_BING_FORM_ACTION = `${ZOHO_FORM_BASE}/BookYourAccountingConsultationBing/formperma/pTZ1WJZ9hxCnspXoXMYZtxgTQVFoMK6tTPG-KwVOfwE/htmlRecords/submit`;

/**
 * The Zoho form field that the Forms → CRM integration maps to Lead Source.
 *
 * This field is not free space. Whatever a page posts here becomes the lead's
 * Lead Source in the CRM: the /packages quote form posted its transaction-volume
 * answer here and every lead from that ad group arrived with a Lead Source of
 * "20 – 80 a month". Only ever stamp a channel name into it, and check the
 * Forms → CRM mapping before pointing any other field at a Zoho field name.
 */
export const ZOHO_LEAD_SOURCE_FIELD = 'SingleLine1';

/**
 * Lead Source per ad channel. Kept channel-level rather than per landing page
 * so the CRM picklist stays short — the landing page is already recoverable
 * from the utm_campaign/utm_content values posted alongside it.
 */
const LEAD_SOURCE_BY_CHANNEL = {
  google: 'Google Ads',
  bing: 'Bing Ads',
};

/**
 * @param {'google' | 'bing'} channel the ad channel the page serves
 * @returns {string} the Lead Source value to stamp on that channel's leads
 */
export const getLeadSourceForChannel = (channel) =>
  LEAD_SOURCE_BY_CHANNEL[channel] ?? LEAD_SOURCE_BY_CHANNEL.google;

/**
 * Where Zoho sends the browser after a successful submission.
 *
 * Pinned in the markup rather than left to the Zoho form's own redirect
 * setting, for two reasons: /thank-you is what fires the Google Ads
 * `consultation_form_ec` enhanced conversion, so a mis-set field in the Zoho UI
 * would silently kill every conversion; and the site answers on more than one
 * domain while Zoho only stores a single redirect URL per form. Building it from
 * the live origin returns the visitor to the domain they submitted from, which
 * is where the conversion flag in sessionStorage is waiting.
 * See src/pages/ThankYou.jsx and src/utils/site.js.
 * @returns {string} the absolute thank-you URL on the current domain
 */
export const getZohoRedirectUrl = () => absoluteUrl('/thank-you');
