# Lead attribution → Zoho CRM

`POST /api/lead-attribution` writes a visitor's ad attribution onto the Zoho Lead
that their form, booking or proposal just created. Code: `server/attribution/`
(server) and `src/utils/leadAttribution.js` (browser).

## Why it exists

Before this, most paid leads reached the CRM with no way to join them back to an
ad (read 2026-09-22, leads since 2026-08-22): Google Ads 113 leads, of which
34–42 had a gclid, Bing Ads 59 with 1 UTM campaign, and zero page URLs, click ids
or UTMs on any WhatsApp lead. Google and Meta can only learn from CRM outcomes
they can match, so capture comes before the offline-conversion uploads.

## The field standard (agreed 2026-09-22)

| Field | Meaning | Values |
|---|---|---|
| Lead Source | Which channel paid for the visit | Google Ads, Meta Ads, Bing Ads, SEO (today the "Organic Search" option) |
| Secondary Source | How the person got in touch | Form, Booking, WhatsApp, Proposal Engine, Call, Lead Form |

## What the endpoint does

1. Accepts only POSTs from the site's own origins (`APP_ORIGINS` in
   `src/utils/booking.js`), 8 KB max, validated with zod.
2. Finds the Lead by email, else by phone (UAE formats covered), then re-reads
   each match by id with an explicit field list (search results do not reliably
   carry custom fields). A field missing from that read is treated as unknown
   and never written. Retries for about 50 s, because the Forms/Bookings → CRM
   sync lags.
3. Picks the newest match and leaves it alone if it is older than 7 days.
4. **Only fills empty fields.** The one overwrite: a Lead Source that is really an
   entry method (Zoho bookings, Gallabox, Wati, FinCore, WhatsApp CTA, Inbound
   Calls) is replaced with the channel. A stranger who knows an email can
   therefore add attribution to a fresh, unattributed lead, but can never change
   what the CRM already holds.
5. Updates with `trigger: []`, so no workflow or relay fires on the write.
6. If Zoho rejects a field (a picklist value or field not created yet), drops
   that field and writes the rest. The dropped names are logged.

Every valid request gets the same `202 {"status":"accepted"}`, whether the lead
was found, stale or updated, so the endpoint cannot be used to test which emails
are leads. The real outcome is in the Vercel function log
(`lead-attribution: outcome`). Rate limiting is not implemented; the origin check
stops browsers, not scripts.

Fields written: Lead_Source, Secondary_Source, MGCLID, GBRAID, WBRAID, FBCLID,
MSCLKID, TTCLID, FBP, FBC, Lead_ID, PostHog_Distinct_ID, UTM_\*,
First_UTM_\*, First_Landing_Page, Landing_Page, Referrer, Click_Timestamp.
MSCLKID already existed. FBP, FBC and Lead_ID were created on 2026-09-22
(Zoho field ids 5847102000094095165/175/184), all single-line text, 255 chars.

## Switch-on (in order)

1. **Zoho admin:** add the six Secondary Source values (Setup → Modules and
   Fields → Leads → Secondary Source). The four attribution fields already exist.
   SEO stays "Organic Search" (decided 2026-09-22).
2. **Zoho API console:** a Self Client with scope
   `ZohoCRM.modules.leads.READ,ZohoCRM.modules.leads.UPDATE`. Mint a refresh token.
3. **Vercel (server-only, never `VITE_`):** `ZOHO_CLIENT_ID`,
   `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, and `ZOHO_API_DOMAIN` /
   `ZOHO_ACCOUNTS_DOMAIN` if the org is not on zoho.com. Then set
   `LEAD_ATTRIBUTION_ENABLED=1` and redeploy.
4. **Verify:** open a landing page with `?gclid=test-<date>&utm_campaign=test`,
   submit the form with a test email, then check that Lead in Zoho for MGCLID,
   UTM_campaign, Lead Source and Secondary Source. Repeat for a booking.

Until step 3, the endpoint answers `202 {"status":"disabled"}` and touches nothing.

## Not covered here

- **WhatsApp:** the site never learns a WhatsApp lead's phone, and no WhatsApp
  integration writes a page URL, click id or ref into the CRM (task 1.8
  finding). This needs a ref code in the prefilled message that the Gallabox → CRM
  flow copies into a Lead field (task 1.9).
- **Phone calls:** click event only (task 1.11).
