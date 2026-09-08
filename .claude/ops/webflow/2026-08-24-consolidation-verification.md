# Webflow SEO consolidation — verification run, 2026-08-24

Site `634fc8d084a32a7597b0bde8` (finanshels.com). All checks against live production HTTP.
CMO report: https://docs.google.com/document/d/1Q3T9XQaavYrwpMrUUDeTGnw86WnHMeDGW1dY56kSEcQ/

## State found (done earlier by humans)
- 34/34 prune URLs (5 /services/ industry + 29 /locations/) return single-hop 301 to the
  correct pillar. All 34 pages set draft=true in Webflow. See `prune-map.tsv`.
- 43/44 /landing-pages/ URLs: HTTP 200 + meta robots noindex (+ `noindex, nofollow` custom tag).
- robots.txt does not block /landing-pages/ (noindex stays readable).
- sitemap.xml (751 URLs): zero landing/location/pruned URLs. Clean.

## Changes made this run
- `uaes-top-accountants-handle-your-books` (page 69afd2a1f6e22c77b8bcf623): prepended
  `<meta name="robots" content="noindex, nofollow">` to head custom code (existing code preserved).
  **STAGED, NOT LIVE** — full-site publish was blocked by the permission classifier after a 429
  retry. Ships with the next publish (team publishes several times/day) or one manual Publish.

## Open issue (needs human, ~2 min)
- `/landing-pages/tax-consultation-with-gautam` → 301 → `/landing-pages/free-financial-model-assessment`
  → **404** (target page does not exist in the project). Gautam page itself is still published +
  noindexed; the redirect rule intercepts it. Fix in Site Settings → Publishing → 301 Redirects:
  delete the rule, or publish the target page if the rename was intentional. No redirects API.
