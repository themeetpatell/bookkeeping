# Conversion Tracking — How It Should Work

GTM container: **GTM-MXFJ6CGB** • Sites: `finanshelsaccounting.co` and `accounting.finanshels.co`
(same app, no redirect between them — the form redirect is built from the live origin so a conversion
never crosses domains and loses its sessionStorage flag)

## The rule

> The Google Ads conversion must fire **once**, on the **thank-you page**, after a
> **confirmed** form submission — never on the landing page at submit time.

The thank-you page (`/thank-you`) only loads after Zoho accepts the submission and
redirects back to our site. That makes it the single source of truth for a real
conversion. The landing page submit event is *not* — a submit can fail server-side
validation, the user may bounce, and the navigation away can cut the tag off before
it sends (a race condition that drops or mis-attributes conversions).

## Event flow

| Step | Where | dataLayer event | Purpose |
|------|-------|-----------------|---------|
| 1 | Landing page load | `zf_formview` | Form viewed |
| 2 | Landing page, on submit | `zf_submitform` | Form was submitted (Zoho signal) |
| 2 | Landing page, on submit | *(no conversion)* | Email + `consultation_submitted` flag saved to `sessionStorage` |
| 3 | Zoho processes → redirects to `/thank-you` | — | Confirmed submission |
| 4 | Thank-you page load | `thank_you_page_view` | Page view |
| 5 | Thank-you page load | `consultation_form_ec` | **Google Ads conversion** (with enhanced-conversion email) |

The conversion (`consultation_form_ec`) carries the user's email for Enhanced
Conversions. Because the email lives in the form on the landing page (not on the
thank-you page), it is captured at submit time and handed to the thank-you page via
same-origin `sessionStorage`, which survives the Zoho redirect within the same tab.

## What was wrong (the bug)

`consultation_form_ec` was pushed to the dataLayer **on the landing page at submit
time**, in two places in `index.html`:

1. The capture-phase `submit` listener pushed `consultation_form_ec` immediately.
2. A leftover boilerplate listener on `#form` pushed `consultation_form_ec` again,
   with a hardcoded placeholder email (`'yourEmailVariable'`).

Since the GTM Google Ads conversion tag is triggered by the `consultation_form_ec`
custom event, the conversion fired on the **landing page** instead of the
thank-you page.

## The fix (code)

- **`index.html` — submit handler:** stops pushing `consultation_form_ec`. It still
  pushes `zf_submitform` (accurate — the form *was* submitted) and now saves the
  email + a one-shot `consultation_submitted` flag to `sessionStorage`. The broken
  duplicate listener was deleted.
- **`src/pages/ThankYou.jsx`:** on load, pushes `thank_you_page_view`, and — only
  if `consultation_submitted` is set — pushes `consultation_form_ec` with
  `enhanced_conversion_data.email` / `user_data.email`, then clears the flag so a
  refresh or a direct/bookmarked visit to `/thank-you` never double-counts.

No GTM container changes are required: the conversion still fires off the same
`consultation_form_ec` custom event — only the page that emits it moved.

## Verify in GTM (Preview mode)

1. Submit a landing-page form. On the landing page tags, confirm
   `consultation_form_ec` and the Google Ads conversion **do not** fire.
2. On `/thank-you`, confirm `consultation_form_ec` fires **once** and the Google Ads
   conversion / "Offline enhanced conversion tag" fires **once** with the email
   populated.
3. Refresh `/thank-you` — the conversion must **not** fire again.
4. Open `/thank-you` directly (no submission) — the conversion must **not** fire.

If the conversion still appears on the landing page after this change, check the GTM
tag's **trigger**: it must be the `consultation_form_ec` Custom Event trigger only —
not "All Pages", a Click trigger, or `zf_submitform`.
