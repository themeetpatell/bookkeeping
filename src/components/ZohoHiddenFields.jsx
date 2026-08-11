import { getGclid, getZohoUtmValues } from '../utils/zohoUtm';
import { ZOHO_REDIRECT_URL } from '../utils/zohoForms';

/**
 * The hidden inputs every Zoho lead form on the site must carry.
 *
 * Identical on every landing page, so it lives here rather than being copied
 * into each one — the copies had already drifted apart.
 *
 * All inputs are controlled + readOnly on purpose. Zoho's tracking script
 * writes the utm_* values onto the DOM nodes directly, which React silently
 * reverts on the next render; sourcing the values from the same cookies the
 * script wrote means a re-render re-asserts the correct value instead of
 * blanking it. See src/utils/zohoUtm.js.
 *
 * Renaming or removing a `name` attribute makes that value arrive empty in Zoho.
 */
export default function ZohoHiddenFields() {
  const utm = getZohoUtmValues();

  return (
    <>
      <input type="hidden" name="zf_referrer_name" value="" readOnly />
      <input type="hidden" name="zf_redirect_url" value={ZOHO_REDIRECT_URL} readOnly />
      <input type="hidden" name="zc_gad" value={getGclid()} readOnly />
      <input type="hidden" name="utm_source" value={utm.utm_source} readOnly />
      <input type="hidden" name="utm_medium" value={utm.utm_medium} readOnly />
      <input type="hidden" name="utm_campaign" value={utm.utm_campaign} readOnly />
      <input type="hidden" name="utm_term" value={utm.utm_term} readOnly />
      <input type="hidden" name="utm_content" value={utm.utm_content} readOnly />
    </>
  );
}
