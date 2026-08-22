# Finanshels Bookkeeping Landing

Paid-ads landing site for Finanshels’ UAE bookkeeping, month-end close, and CFO advisory offering. Built with React + Vite, styled in CSS, and wired to Zoho Forms/Bookings for lead capture.

> **Ad-policy constraint:** this site must never claim to perform registrations, filings, or submissions to any government body (VAT, Corporate Tax, FTA, WPS, Ministry of Labour, etc.), and must not link to or mention any other Finanshels domain. Google Ads disapproves the destination on both counts. Keep copy on bookkeeping, reconciliation, close, reporting, payroll processing, and advisory.

## Getting Started
- Install deps: `npm install`
- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Preview build locally: `npm run preview`

## Environment & Integrations
- Zoho consultation form lives in `src/pages/NewHomePage.jsx` (`ZohoConsultationForm`). Do not change Zoho field `name` attributes or the form action URL.
- Domains: `finanshelsaccounting.co` (primary) and `accounting.finanshels.co` (older, still live because
  campaigns point at it). Neither redirects to the other, so no absolute URL may be hardcoded in the app —
  build them from `src/utils/site.js` so the visitor stays on the domain they arrived on.
- Paid traffic only: every page is `noindex, nofollow` (meta tag in `index.html`, runtime tag in
  `src/components/Seo.jsx`, `X-Robots-Tag` header in `vercel.json`). robots.txt still allows crawling —
  a blocked crawler never reads the noindex — and never blocks AdsBot/adidxbot.
- Booking CTA targets: `https://contact-finanshels.zohobookings.com/accounting-google`, and
  `.../accounting-bing` from the `-bing` routes. Resolved in `src/utils/booking.js`.
- Zoho Bookings must redirect after a confirmed booking to `/booking-confirmed`
  (`src/pages/BookingConfirmed.jsx`), which pushes the `zoho_booking_completed` dataLayer event. The GTM
  "Book a meeting Zoho" Google Ads conversion fires on that event — not on booking-link clicks. Set it on
  **both** Zoho services; each stores a single absolute URL, so pick the domain that campaign runs on.
- Floating contacts: WhatsApp + phone links configured in `src/components/FloatingContacts.jsx`.

## Project Structure
- `src/pages/FinanshelsLanding.jsx` — home page at `/`
- `src/pages/NewHomePage.jsx` — alternative landing at `/accounting-services-with-finanshels`
- `src/components/` — navigation, footer, floating contact buttons, testimonials.
- `src/pages/NewHomePage.css`, `src/pages/FinanshelsLanding.css` & `src/App.css` — styling.
- `public/clients` and `public/Dubai.png` — assets referenced in the page.

## Routes
- `/` — AccountingLanding (primary home page - new design matching Lovable)
- `/bookkeeping` — BookkeepingLanding (original bookkeeping page)
- `/packages` — PackagesLanding, the ad-group variant for "bookkeeping packages"

### Ad-group landing page variants
Pages like `/packages` exist to match the *search intent of one ad group*, not a
whole campaign, so the Quality Score "landing page experience" rating stops
being dragged down by a generic destination. The pattern:

- Copy and plan data live in `src/content/<variant>.js`; the page component only
  lays them out. Fork the content file for the next ad group.
- Shared chrome (hero, pricing cards, FAQ, final CTA) is inherited by importing
  `BookkeepingLanding.css`. A variant's own stylesheet holds only new sections,
  and page-specific overrides are scoped under a root class (`.packages-landing`)
  so they cannot leak onto the other pages.
- The global `Nav` scrolls to `#services`, `#pricing`, `#testimonials` and
  `#faq`. A variant must expose those ids or those nav links are dead on it.
- **Every variant is re-checked against the ad-policy grep below before it
  ships.** Briefs written by the ads team routinely ask for the exact terms that
  got this site disapproved; rewrite them, do not ship them.

## SEO & Analytics
- Base meta, OG/Twitter tags defined in `index.html`.
- JSON-LD `ProfessionalService` schema injected in `NewHomePage.jsx`.
- Google Tag Manager: `GTM-MXFJ6CGB` (configured for conversion tracking).
- Gallabox WhatsApp Tracker: All WhatsApp CTAs tracked with `data-wa-track="true"` attribute.

## Deployment Notes
- Built with Vite; output in `dist/`.
- Ensure canonical/OG image (`/Dubai.png`) is available at the deployed root.
- Keep Zoho and booking URLs untouched to avoid breaking lead capture.
