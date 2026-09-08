# /services folder elimination — 2026-08-24 — SHIPPED & VERIFIED

## Final state (all verified live by terminal-status curl sweep)
1. **All 12 pages moved out of `/services` to site root** via Webflow API, slugs unchanged.
   Live 7: business-compliance-services-in-uae, tax-consultation-in-uae, vat-registration-in-uae,
   claim-your-vat-refund-in-uae, valuation-and-financial-modelling-service-in-uae,
   corporate-tax-registration-in-uae, company-liquidation-services-in-uae — all 200 at root.
   Draft 5 (deprecated accounting-firm-* + hire-an-accountant) also moved; no live effect.
2. **JSON-LD `Service` schema `url`** corrected from `/services/<slug>` to `/<slug>` on the 3
   pages that carried it (business-compliance, corporate-tax-registration, company-liquidation).
3. **Full 301 table replaced via Site Settings CSV import** (browser automation, user-assisted
   login x3 — Webflow bot-detection kills automated sessions in ~5 min):
   - 261 rules total: 155 kept verbatim, 99 retargeted, 7 added.
   - 99 retargets: every rule that pointed into `/services/...` (46 of them terminated in 404,
     incl. all 25 prune-map rows + glossary/blog rules into never-existing pages like
     `/services/vat-services-by-finanshels`, `/services/corporate-tax-tool`, and six rules
     into the 404ing `/services` folder index itself) now points at the real root page:
     corporate-tax → /corporate-tax-filing-in-uae · vat filing/tool → /vat-filing-in-uae ·
     vat-registration-intent → /vat-registration-in-uae (Doom-mode intent split) ·
     bookkeeping/accounting → /bookkeeping-services-uae · cfo → /cfo-services-uae ·
     aml → /aml-compliance-uae · transfer-pricing/consultancy → /tax-consultation-in-uae ·
     moved-page targets → their new root URLs.
   - 7 added: /services/<slug> → /<slug> for the moved pages (all single-hop).
   - 2 dropped: broken Gautam rule (301→404; its landing page now 200s again) and a
     pre-existing self-loop (/blog/uae-corporate-tax-registration-avoid-penalties → itself).
4. **Site published**; nav/footer links auto-updated (0 `/services/` hrefs on live pages);
   sitemap lists all 7 root URLs and zero `/services/` URLs.

## Verification (Doom-mode terminal-status standard: final 200, not hop-presence)
- 97/97 retargeted sources: terminal 200. 7/7 new rules: 301 single-hop → 200.
- /financial-modelling and /ecommerce (2 rules the UI scrape missed, caught from the export
  ground truth): terminal 200.
- Deprecated drafts still 301 → /bookkeeping-services-uae → 200.

## Artifacts
- `2026-08-24-redirects-export-backup.csv` — full pre-change table (256 rules), restore point.
- `.playwright-mcp/redirects-import.csv` — the imported 261-row table.
- `prune-map.tsv` — rewritten with corrected targets.

## Addendum (same day, later): "for all services" hardening
After the import, someone hand-added 2 rules pointing at phantom URLs (/services/corporate-tax-filing-uae,
/services/vat-filing-uae) — both 404 dead-ends. Fixed and hardened, published, verified terminal-200:
- Replaced both bad rules → /corporate-tax-filing-in-uae and /vat-filing-in-uae.
- Added rules for the phantom slugs themselves → same targets.
- Added `/services → /` and wildcard `/services/(.*) → /` (added last; specific rules win) — no
  /services URL can ever 404 again.
- Fixed 2 pre-existing malformed rules missing their leading slash (founders-wellbeing blog, ar-ae crypto blog).
- LESSON: redirect edits only go live after a site publish. Always publish then curl-verify.

## Open items / flags
- **www.finanshels.com shows "Update needed"** in Webflow domain settings: registrar CAA
  record blocks SSL renewal — "delete the CAA record or set it to issue: letsencrypt.org and
  pki.goog". www currently serves (301 to apex) but fix the CAA before the cert lapses.
- Pre-existing malformed rule kept as-is: /blog/how-founders-can-prioritize-… →
  `blog/founder-burnout-uae-financial-stress` (missing leading slash).
- /locations/corporate-tax-tool-in-* sent to /corporate-tax-filing-in-uae (money page) while
  root-level /corporate-tax-tool-in-* twins go to /tools/corporate-tax-filing-deadline-checker.
  Doom ruled service-page targeting defensible; revisit if Ads QS or engagement says otherwise.
- Google Ads final URLs: export and confirm none still use /services/ paths (they'd 301 now —
  works, but update finals to root URLs for quality score).
- No GSC/GA4 access — indexation impact unmeasurable; review via Ahrefs 2026-09-21 & 2026-10-19.
- Empty /services folder shell remains in Designer (harmless; delete manually if desired).
