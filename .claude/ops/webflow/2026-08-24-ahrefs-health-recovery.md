# Ahrefs health-score recovery — 2026-08-24 (evening session)

Context: Always-on Ahrefs audit (project 6944111) showed Health 45 with errors +651
after the /services flattening. Diagnosis: the crawl snapshot ran MID-migration —
the two heaviest "broken" targets (/services/corporate-tax-return-filing-in-uae,
/services/vat-filing-and-accounting-in-uae — 589+588 inlinks) already 301→200 live
before this session started. The remaining real breakage was fixed below.

## Fixed this session

1. **Draft pages that footer links to (404 live)** — un-drafted via update_page_settings
   (bulk_update_pages silently ignores draft:false — gotcha #5 in memory):
   - /accounting-firm-for-smes-in-uae (78 inlinks)
   - /accounting-firm-for-startups-in-uae
   - /accounting-firm-for-ecommerce-in-uae
   - /accounting-firm-for-restaurants-in-uae
   → LIVE AFTER NEXT SITE PUBLISH.

2. **CMS content links rewritten** — 151 items, ~1,100 link instances:
   - 130 blog posts (14 payload batches, subagent fleet) + 20 glossary items + founder-burnout post
   - http://www.finanshels.com/* → https://finanshels.com/* (kills the 221-page
     "HTTPS page has internal links to HTTP" error group)
   - /services/* → new root slugs (data-driven: every URL resolved live to terminal 200)
   - links to deleted posts → live equivalents or /blog
   - zero-width-joiner-corrupted URLs cleaned
   - All updates published per-batch via publish_collection_items (live now).
   - Payloads + rewrite map: /tmp/fin-fixes/ (url-cache.json = full mapping)

3. **46 redirect-shadowed CMS items unpublished** (31 blog + 15 glossary incl.
   founder-burnout-uae-financial-stress) — they were published but 301-shadowed,
   causing 52× "3XX redirect in sitemap". Rollback ids: /tmp/fin-fixes/found-items.json

4. **8 redirect rules added via dashboard UI** (Add dialog; import NOT used — the CSV
   import overwrites the whole table):
   - 4 visa slugs (spain/russia-2025/the-usa/the-uk) → /blog
   - /careers → https://careers.finanshels.com (external targets ARE supported)
   - Bridge rules for dead redirect targets (rules can't be edited, only deleted —
     delete is manual-only; bridging chains instead):
     - /blog/uae-corporate-tax-compliance-deadlines → /tax-consultation-in-uae
     - /blog/uae-business-challenges-and-how-founders-solve-them → /cfo-services-uae
     - /blog/business-visa-uae-guide → /blog
   → ACTIVE AFTER NEXT SITE PUBLISH.
   Full post-change backup: 2026-08-24-redirects-export-after-audit-fix.csv (276 rules)

## Round 2 (post-recrawl, health 45→63 at time of fixes)

- CEO (Shafeekh) + CPO (Musthafa) team-bio `http://Finanshels.com` links → https (was flagging
  37+ pages via the author box). Live.
- Arabic post smart-quote-wrapped href fixed (2 anchors) → /corporate-tax-registration-in-uae. Live.
- 9 redirect rules for www→apex broken redirects: 6 /ar-ae/blog/* → English twins, 3 deleted
  visa posts → /blog. Live, verified terminal 200.
- "Hire an Expert" links on 2 pages (old footer on /claim-your-vat-refund-in-uae, old navbar on
  /corporate-tax-filing-portal...) retargeted /hire-an-accountant-in-uae → /bookkeeping-services-uae
  via element API; plus redirect /hire-an-accountant-in-uae → /bookkeeping-services-uae.
- robots.txt: REMOVED `Disallow: /*?5cb4d575_page=` (blog pagination) — de-orphans blog long-tail
  (3,398 previously blocked URLs). Also dropped empty Disallow + www sitemap line.
- 8 redirects /old-tools/* → tools.finanshels.com equivalents (orphan detail pages of the Tools
  collection; items kept — they power the /tools directory page).
- 2 oversized blog images (1.7MB + 1.5MB PNG) → compressed webp (72KB/82KB), swapped on
  corporate-tax-penalties-uae + exemptions posts, published.
- Zoho bookings links = Ahrefs false positive (400 to bots, 200 in browsers). No action.

### Out of Webflow scope (subdomain errors — needs app/careers teams or audit-scope change)
- app.finanshels.com: broken Gallabox widget JS (cdn.gallabox.com/widgets/gallabox.js 404),
  http sign-up link, oversized auth.png; halatax.finanshels.com auth API 404;
  audit/team/test-admin.finanshels.com oversized sign-in PNGs; careers.finanshels.com
  duplicate pages without canonical (6). Consider setting Ahrefs audit scope to apex+www only.
  test-admin.finanshels.com being publicly crawlable is a hygiene flag.

## Round 3 (health 91, 116 error URLs — orphan/no-outgoing endgame)

- **HTML sitemap hub built at /sitemap** (72 links: services, company, team ×14, authors ×6,
  topics ×7, customer stories, resources/events, partner offers) — de-orphans nearly every
  remaining orphan URL. Appended via whtml_builder to page 652fbd54a9100bc8a2b88cce.
- **Footer-new component: "Sitemap" legal link added** (after GDPR) → /sitemap gets inlinks
  from all 116 pages using the footer.
- **Team template + Topics template: internal link strips added** (About/Blog/Sitemap links)
  — fixes "no outgoing links" for all 14 team + 7 topic pages in one template edit each.
- **order-confirmation: back-to-home link added** (same fix).
- **2 broken decorative images hidden** on /claim-your-vat-refund-in-uae (asset-less Image
  elements rendering dead template fallback URLs — curved-dotted-line.svg 403 + base64 svg).

## Remaining (needs a human decision)

- **52 blog posts show Webflow placeholder.svg (403)** — the post template renders
  author image/name but these posts have NO author set (w-dyn-bind-empty). Fix either
  by assigning authors (editorial call) or conditional visibility on the author block
  in the Designer. 4 of 6 Authors-collection entries also have picture:null.
- **102 orphan pages** (pre-existing, chg 0): /team/*, /author/*, /topic/*,
  customer-stories, podcasts, old-tools/*, campaign/thank-you pages. Needs either
  internal links from hub pages or sitemap exclusion. Strategy call.
- **/accounting-packages pricing embed**: 8 hardcoded /services/* links inside the
  fspr HTML embed (custom code) — warning-level (they 301). Repo source at
  webflow-embed/pricing/ is newer than what's pasted in Webflow.
- **finanshels.com SSL "Update needed"** — CAA record at registrar must allow
  letsencrypt.org + pki.goog (pre-existing, from flattening report).
- **SITE PUBLISH required** to activate: un-drafted pages, new redirect rules,
  sitemap regeneration (removing 46 unpublished items).
