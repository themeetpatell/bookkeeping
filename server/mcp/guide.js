/**
 * What the CMO's Claude is told about the site. INSTRUCTIONS is sent on
 * connect; SITE_GUIDE is returned by the site_guide tool and carries the
 * rules that are easy to break without breaking the build.
 */

export const LIVE_HOSTS = [
  'https://www.finanshelsaccounting.co',
  'https://accounting.finanshels.co',
  'https://accounting.finanshels.com',
];

export const INSTRUCTIONS = `This connector edits the Finanshels paid-ads landing site (React + Vite, deployed on Vercel from GitHub).

Workflow, always in this order:
1. Call site_guide once per conversation before the first edit. It holds brand and lead-capture rules that the build cannot check.
2. start_draft — every change is made on a draft, never on the live site.
3. Read before you write: list_pages, read_file, search. Copy old_text exactly from read_file output.
4. edit_files — one call per logical change, with a plain-English commit message.
5. preview — wait for the build, then give the user the preview link and ask them to check it on mobile and desktop.
6. publish — only after the user has looked at the preview and explicitly said to publish. Publishing puts the change live on every ad landing domain within about a minute.
If something goes wrong after a publish, undo_last_publish restores the previous version.

Never tell the user a change is live until publish returned a commit. A failed preview build means the change has a code error: read the log link, fix it on the same draft, and preview again.`;

export const SITE_GUIDE = `# Finanshels ads landing site — editing guide

## What this site is
Paid traffic only (Google Ads, Bing Ads, Reddit). Every page is noindex on purpose — do not remove noindex or add SEO-only pages.
The same build serves ${LIVE_HOSTS.join(', ')}. Never hardcode a domain in a link or image URL; use relative paths ("/bookkeeping", "/clients/logo.png").

## Where things live
- Routes: src/App.jsx (call list_pages for the route → file map). A new page needs a lazy import and a <Route> there.
- Pages: src/pages/<Name>.jsx with a matching <Name>.css. "-bing" routes are Bing Ads twins of the Google page; change both when copy changes, unless the user says otherwise.
- Copy and plan data for ad-group variants live in src/content/*.js; the page component only lays them out. Prefer editing content files for copy changes.
- Shared components: src/components (Nav, Footer, Testimonials, TrustBar, OfferBar, StickyMobileCta, FtaBadge, FtaStamp, ...).
- Design tokens: src/styles/designTokens.css and src/styles/variables.css. Use the CSS variables rather than new hex values.
- Images: public/ (served from the site root, e.g. public/clients/x.png → "/clients/x.png"). Use add_image to upload.

## Brand rules (not negotiable)
- Accent colour is Finanshels orange #f16610 (hover #d7540d / dark #d45a0e). Do not introduce other accent colours.
- Font is Inter only.
- WhatsApp buttons are green #25d366 and use src/utils/whatsapp.js for the number.

## Regulatory wording (UAE) — exact text only
- The credential is "FTA Registered Tax Agency", Agency Registration No. 30022628. Never write "FTA-approved", "FTA certified" or similar.
- Do not add guarantees about tax outcomes, penalties avoided, or refunds, and no invented statistics, client counts, ratings or testimonials. If the user asks for a number or a claim, use the figure they give and ask where it comes from if it is new.

## Lead capture (breaking these loses ad conversions silently)
- Every lead form must keep a required phone field — the CRM rejects leads without one. For small CTA strips use a WhatsApp button instead of a mini form.
- Do not rename Zoho form field name attributes, the form action URL, or hidden fields. Do not remove ZohoHiddenFields, the booking links, or tracking components from a page.
- WhatsApp CTAs carry the CSS class "data-wa-track" (a class, not an attribute) — keep it on any WhatsApp link you add.
- Lead capture, attribution and tracking files are locked for this connector (utils/zohoForms, booking, site, zohoUtm, leadTracking, SalesIQAttribution, ZohoHiddenFields, WhatsAppTracker, LeadEventTracker, lib/posthog, lib/quoteApi, the ThankYou and BookingConfirmed conversion pages, index.html, api/). The connector also refuses edits that unmount trackers from App.jsx, remove a live route, or introduce rejected FTA wording. If a change needs them, tell the user it needs engineering.
- The global Nav scrolls to #services, #pricing, #testimonials and #faq — keep those section ids on a page.

## Good practice
- Keep one change per draft so it can be previewed, published and undone on its own.
- Check the preview at phone width; most ad traffic is mobile.
- Pages are React (JSX): use className not class, close every tag, and keep imports at the top of the file.`;
