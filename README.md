# Finanshels Bookkeeping Landing

Marketing site for Finanshels’ UAE bookkeeping, tax, and consultation offering. Built with React + Vite, styled in CSS, and wired to Zoho Forms/Bookings for lead capture.

## Getting Started
- Install deps: `npm install`
- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Preview build locally: `npm run preview`

## Environment & Integrations
- Zoho consultation form lives in `src/pages/NewHomePage.jsx` (`ZohoConsultationForm`). Do not change Zoho field `name` attributes or the form action URL.
- Booking CTA targets: `https://contact-finanshels.zohobookings.com/#/accounting-consultation`.
- Floating contacts: WhatsApp + phone links configured in `src/components/FloatingContacts.jsx`.

## Project Structure
- `src/pages/NewHomePage.jsx` — main landing content and CTAs.
- `src/components/` — navigation, footer, floating contact buttons, testimonials.
- `src/pages/NewHomePage.css` & `src/App.css` — styling.
- `public/clients` and `public/Dubai.png` — assets referenced in the page.

## SEO & Analytics
- Base meta, OG/Twitter tags defined in `index.html`.
- JSON-LD `ProfessionalService` schema injected in `NewHomePage.jsx`.
- Google Tag Manager: `GTM-MXFJ6CGB`.

## Deployment Notes
- Built with Vite; output in `dist/`.
- Ensure canonical/OG image (`/Dubai.png`) is available at the deployed root.
- Keep Zoho and booking URLs untouched to avoid breaking lead capture.
