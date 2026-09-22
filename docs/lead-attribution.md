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
| Secondary Source | How the person got in touch | Zoho Form, Zoho Booking, WhatsApp Button, Proposal Engine, Call, Instant Form (Meta lead forms) |

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
(`lead-attribution: outcome`). Rate limits: 20 requests per IP and 5 per email or
phone per 10 minutes, held per function instance (best effort, no shared store);
over the limit answers 429.

Fields written: Lead_Source, Secondary_Source, MGCLID, GBRAID, WBRAID, FBCLID,
MSCLKID, TTCLID, FBP, FBC, Lead_ID, PostHog_Distinct_ID, UTM_\*,
First_UTM_\*, First_Landing_Page, Landing_Page, Click_Timestamp. Not Referrer: it is a
Zoho system field that accepts an API write and keeps nothing (verified 2026-09-22);
the referrer is still used to classify organic-search leads.
MSCLKID already existed. FBP, FBC and Lead_ID were created on 2026-09-22
(Zoho field ids 5847102000094095165/175/184), all single-line text, 255 chars.

## Switch-on (in order)

1. **Zoho admin:** done 2026-09-22. The six Secondary Source values and the four
   attribution fields exist.
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

## WhatsApp (task 1.9)

A chat started from a website button is joined to its ad click with nothing
visible added to the message.

1. **At click** (`src/utils/whatsappRef.js`): an 8-character `fs_ref` is put on
   the page URL for the instant Gallabox's tracker reads it, then removed. The
   click's attribution is captured in PostHog as `whatsapp_ref_issued` under
   that ref.
2. **In the message**: Gallabox's own tracker (links with `data-wa-track`)
   hides the page URL, ref included, as zero-width characters. The customer
   sees the same text as before and cannot delete what they cannot see.
3. **Webhook** `POST /api/whatsapp-inbound?key=<GALLABOX_WEBHOOK_SECRET>`
   (`server/whatsapp/`): decodes the hidden URL, looks the ref up in PostHog,
   finds the Lead by the sender's phone, and writes the attribution with
   Secondary Source "WhatsApp Button" under the same rules as the site endpoint.
   With no ref match it uses what the URL itself carries (landing page, a gclid
   still in the URL). It replies 200 at once and works in the background.

Switch-on, in order:
1. Vercel (production, sensitive): `GALLABOX_WEBHOOK_SECRET` (a long random
   string) and `POSTHOG_PERSONAL_API_KEY` (PostHog → Settings → Personal API
   keys, scope **query: read**, project 622242). Redeploy.
2. Gallabox: add a webhook for incoming messages pointing at
   `https://accounting.finanshels.com/api/whatsapp-inbound?key=<secret>`.
3. Leave `WHATSAPP_ATTRIBUTION_ENABLED` unset for the first few chats. The
   function log then shows each payload's field paths
   (`whatsapp-attribution: payload shape`), which confirms where Gallabox puts
   the message text and the phone. Narrow `server/whatsapp/extract.js` to
   those paths if they differ from what it expects.
4. Set `WHATSAPP_ATTRIBUTION_ENABLED=1` and redeploy. Check a test chat's Lead
   for MGCLID/UTMs and Secondary Source "WhatsApp Button".

## Not covered here

- **WhatsApp links without `data-wa-track`:** Gallabox does not encode them,
  so they carry no ref. Almost every button has the class.
- **Phone calls:** click event only (task 1.11).
