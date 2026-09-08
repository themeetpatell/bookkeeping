# Webflow remediation — change log

Site: `634fc8d084a32a7597b0bde8` (finanshels.com)
**STATUS: PUBLISHED LIVE, 22 Aug 2026.** Three publishes: initial batch, a schema-validity hotfix, and the blog meta rebinding. All changes verified on the live site.

Rollback: `footer-ORIGINAL-backup.html` (verified semantically identical to pre-change live state).

## Score movement

| | Before | After |
|---|---|---|
| SEO | 38 | **49** |
| AEO | 23 | **52** |
| GEO | 25 | **32** |
| **Composite** | **30** | **44** |

Structural scores — they measure on-page state, not observed rankings or traffic (still unmeasurable without GSC).

## Post-publish verification (live, measured)

- Invalid JSON-LD blocks across an 8-page sample: **0**
- Blog meta descriptions ≤160 chars: **38/45 (84%)**, median 147, zero empty — baseline was 19/20 **over** 160, range 489–1,176
- Glossary definition-first: verified live on 8/8 spot-checked entries
- Blog titles ≤60 chars: **9/45** — unchanged, still a live defect

## Bug I introduced and fixed

`DefinedTerm` v1.0 bound `description` to `summary-2`, which carries a **trailing newline**. Webflow interpolated it raw, producing a literal control character inside a JSON string — **invalid JSON-LD on all 211 glossary pages**. Caught in post-publish validation, description binding removed (v1.1), republished, verified valid. 66 of 200 `summary-2` values are whitespace-dirty; binding must not be restored until they are cleaned.

---

## Management rulings applied

| Question | Ruling | Where applied |
|---|---|---|
| HQ | Office 406, Publishing Pavilion, Dubai Production City | Site JSON-LD ×2 blocks |
| Legal entity | Finanshels Accounting Technologies LLC | `legalName` in both blocks |
| Client count | 7,000+ | `/about-us` meta, `/bookkeeping-services-uae` meta |
| Trustpilot | 274+ at 4.9 | **Not** written to schema — see policy note |
| Phone | +971 4 545 7841 | Site JSON-LD, `/contact-us` meta |
| Opening hours | 09:00–19:00 | Site JSON-LD (**Mon–Fri assumed** — confirm if Sat is worked) |
| Record retention | 7 years | Pending — blog cluster edit |
| Late-filing penalty | AED 10,000 | Pending — blog cluster edit |
| "From AED 804/month" | Correct / substantiated | Cleared for use. **Not yet shown on `/accounting-packages`** |

---

## 1. Site-wide JSON-LD — v2.1

Replaced three blocks with two. Affects all 727 pages.

| Field | Before | After |
|---|---|---|
| `streetAddress` | Shams Business Center, Sharjah Media City FreeZone | Office 406, Publishing Pavilion, Dubai Production City |
| `addressLocality` | Al Messaned, Sharjah | Dubai |
| `geo` | 25.27877778 / 55.67913889 (parking lot, 56 km off) | 25.0365257 / 55.1905532 |
| `telephone` | +971-504871229 | +971-4-545-7841 |
| `openingHours` | 00:00–23:59, 7 days | Mon–Fri 09:00–19:00 |
| `@id` / `url` | `www.finanshels.com` | `finanshels.com` |
| `legalName` | — | Finanshels Accounting Technologies LLC |
| `areaServed` | — | UAE + Dubai / Abu Dhabi / Sharjah |
| `BreadcrumbList` | fake trail, every page | **removed** |
| `sameAs` | Medium (dead since Mar 2023); no LinkedIn on LocalBusiness | Medium dropped, LinkedIn added |
| `Corporation` | — | → `Organization` (carries legalName + address) |

**Verified:** all 10 business-critical scripts intact (GTM, Zoho popup, Google Ads deferral, FS Attribution v1.0, WhatsApp tracking v1.2, Zoho CRM, SalesIQ).

**Policy note — `aggregateRating` deliberately omitted.** Marking third-party Trustpilot scores as first-party `aggregateRating` on your own `LocalBusiness` is self-serving under Google's structured-data policy and a known manual-action trigger. Use Trustpilot's official widget, which ships its own compliant markup. Assigned to the listings owner.

---

## 2. Page SEO — 12 pages

| Page | Change |
|---|---|
| `/accounting-packages` | `Get the Pricing \| Finanshels` (28) → `Accounting & Bookkeeping Packages in UAE \| Finanshels` |
| `/aml-compliance-uae` | 28-char title → branded; 265-char desc → 129; dropped "Filing"; fixed "Laundring" typo |
| `/auditing-services-uae` | 69-char title → 53 |
| `/cfo-services-uae` | 73-char title → 43 |
| `/bookkeeping-services-uae` | 61 → 57; desc now states 7,000+ clients |
| `/resources/faqs` | 63 → 53; removed `Faq Finanshels,` artefact |
| `/contact-us` | 66 → 52; 209-char desc → 127; canonical phone added (NAP reinforcement) |
| `/our-customers` | 29 → 48; removed `Customer Stories,` artefact |
| `/resources/glossary` | "Startup Glossary" → "UAE Accounting & Tax Glossary"; 174-char desc → 132 |
| `/blog` | removed **leading space** in title |
| `/about-us` | 21 → 44; **5,000+ → 7,000+** |
| `/sitemap` | 7-char title → branded; removed description copy-pasted from `/contact-us` |

---

## 3. Glossary CMS — 11 entries

Prepended the stored `summary-2` definition as the opening paragraph where the body never defined its own term. `isDraft: false` preserved on every item — no live page was demoted to draft.

`zero-rated-supply` · `ultimate-beneficial-owner-ubo` · `taxable-person` · `tax-registration-number-trn` · `tax-invoice` · `tax-group` · `petty-cash` · `free-zone-person-qualifying` · `corporate-tax-ct` · `audit` · `working-capital`

**Excluded after review:** `economic-substance-regulations-esr` — its body already opens definitionally.

### Correction to the audit's estimate

The AEO lane extrapolated **~60 of 211** glossary pages as broken. Measured on the first 100:

| Method | Count | Verdict |
|---|---|---|
| Crude string match | 57 | Wrong — most were paraphrased definitions |
| Definitional-verb heuristic | 27 | Still wrong — formula-style entries misflagged |
| **Visual confirmation** | **11** | Applied |

Acting on 57 would have prepended duplicate definitions to ~45 healthy pages.
Batches 2–3 (items 100–211) not yet analysed.

---

## 4. Template schema — applies to every CMS item

| Template | Change | Pages affected |
|---|---|---|
| `detail_glossary` head | Added `DefinedTerm` + `DefinedTermSet`, CMS-bound to `name` / `summary-2` / `slug` | **211** |
| `detail_blog` head | `BlogPosting` v2.0 — see below | **395** |

### BlogPosting v2.0 — four defects fixed, three of them not in the original audit

| Defect | Before | After |
|---|---|---|
| `@context` | `http://schema.org` | `https://schema.org` |
| Canonical mismatch | `www.finanshels.com` in `url` + `mainEntityOfPage` | `finanshels.com` |
| Date format | `"MMM DD, YYYY"` → `"Mar 02, 2024"`, **does not parse as a schema.org Date** | `YYYY-MM-DD` (ISO-8601) |
| **Publisher logo** | `https://images.app.goo.gl/Csok9xkwRkznG2zi8` — **a Google Images share link, not an image file** | real CDN SVG asset |
| Publisher identity | standalone Organization | `@id` reference to the site Organization node |

`dateModified` deliberately **not** added. Binding it to Webflow's automatic `updated-on` would certify freshness that never happened — the exact defect behind all 395 posts reading "Updated On: August 2026". A new **`last-reviewed`** DateTime field has been created on the Blog Posts collection (`slug: last-reviewed`) with help text warning against backfilling. Once the tax team populates it for real, bind `dateModified` to it.

**Not reachable via API:** the *second* `BlogPosting` block. The template's footer copy is already commented out, so the duplicate is a Designer embed element in the page body. Needs a human in Webflow Designer to delete it — until then, blog posts will emit two article blocks.

## 5. FAQPage — `/resources/faqs`

18 distinct Q&As marked up. Page head was empty, so nothing was overwritten.

Deliberately excluded:
- **Duplicate legacy entries.** "Are you an accounting firm? How are you different?" exists **three times** (two published, one draft). Same for "Who is entering the transaction data", "Does Finanshels handle transaction categorization", "I have in-house accountants" and "Does Finanshels use cash basis or accrual basis". Marking up duplicates gives engines conflicting answers to the same question.
- **"What are the deadlines for UAE Corporate Tax filing?"** — the live answer still says *"For businesses with a financial year ending December 31, 2024, the filing deadline is September 30, 2025."* Stale. Refresh it before marking it up.

**Finding:** AED 804 **is already published on the site** — the "How does pricing work?" FAQ states *"Accounting packages start from AED 804 per month."* So the homepage meta claim is substantiated by on-site content. It is still absent from `/accounting-packages` itself, which is the page the claim sends traffic to.

## 6. Service schema — 8 commercial pages

`Service` + `provider` (`@id` → the business node) + `areaServed` added to:
`/bookkeeping-services-uae` · `/cfo-services-uae` · `/auditing-services-uae` · `/aml-compliance-uae` · `/services/corporate-tax-registration-in-uae` · `/services/corporate-tax-return-filing-in-uae` · `/services/company-liquidation-services-in-uae` · `/services/business-compliance-services-in-uae`

No `Offer` / price node added. AED 804 does not appear on `/accounting-packages`, and structured data must represent visible page content. Add `Offer` once the number is on the page.

## 7. Glossary — COMPLETE across all 211 entries

| Batch | Items | Fixed |
|---|---|---|
| 1 (0–99) | 100 | 11 |
| 2 (100–199) | 100 | 12 |
| 3 (200–210) | 11 | 0 — all already definition-first |
| **Total** | **211** | **23** |

**Final correction to the audit.** The AEO lane projected ~60 broken entries. The measured figure is **23 of 211**. Three successive detection passes gave 57 → 27 → 23; only the last, visually confirmed, was safe to act on.

Batch 3 needs no schema work but is worth a content note: those 11 entries (`burn-multiple`, `bookings`, `board-director`, `basis-point`, `arpu`, `arr`, `acv`, `angel-investor`, `amortization`, `accredited-investor`, `billings`) are 2022-era generic finance definitions with **US framing** — `accredited-investor` cites the *US Securities and Exchange Commission*, and several use `$` amounts. They define their terms correctly, so they are not an AEO defect, but they are off-market for a UAE audience.

## 8. Tax content — one fix applied, one escalated

**Applied:** `/blog/corporate-tax-penalties-uae` — record retention corrected **five years → seven years** in both places it appeared, per management ruling.

**NOT applied, deliberately — the "penalty contradiction" is not a contradiction:**

| Page | Text | What it actually is |
|---|---|---|
| `/blog/corporate-tax-penalties-uae` | "Failure to File Tax Returns on Time: AED 500 per month… increasing to AED 1,000 per month afterward" | The late **filing** schedule |
| `/blog/all-about-uae-corporate-tax` | "Failure to file returns on time can lead to daily accumulating fines, starting at AED 10,000" | AED 10,000 is the late **registration** penalty |

The penalties article cites **Cabinet Decision No. 75 of 2023** and its figures are internally consistent with that instrument. The likely error is in `all-about-uae-corporate-tax`, which appears to describe the registration penalty as a filing penalty.

Applying the "AED 10,000" ruling to the filing statement would have made the accurate page inaccurate. **Needs a CA to confirm which penalty each sentence is describing before either is edited.** No FTA primary source was consulted.

**Also unfixed on `/blog/all-about-uae-corporate-tax`:** expired worked examples — *"businesses with a financial year ending December 31, 2023, must submit their returns by September 30, 2024"*. Refreshing these requires current-year deadline knowledge.

## Open items

**Needs a ruling**
- Opening hours: is Saturday worked? Mon–Fri assumed.
- Duplicate landing-page cluster: `-copy`, `-draft`, `-desk`, `-bing` variants + Gulf twins — keep / consolidate / noindex?
- `accounting-firm-trusted-by-5000-uae-businesses` — hardcodes 5,000 against the 7,000+ ruling. Rewrite or retire?
- `online-taxes-and-bookkeeping-services-from-aed-199-in-the-uae` — an **AED 199** claim. Substantiated like the AED 804?

**Queued, unblocked**
- Glossary batches 2–3 (items 100–211)
- `FAQPage` schema on the 42 Q&A pairs at `/resources/faqs`
- `BlogPosting` cleanup: de-duplicate blocks, ISO-8601 dates, `dateModified`, single author string
- Kill the fabricated "Updated On" stamp
- Sitemap rebuild
- `llms.txt`
- Tax cluster edit: 7 years / AED 10,000 / June 2023
- Show AED 804 on `/accounting-packages`

**Correction on record:** ~30 geo pages (`bookkeeping-services-in-sharjah`, `vat-registration-in-dubai`, 12 `corporate-tax-tool-in-{locality}`) exist as Webflow page objects but return **404/301** and are absent from the sitemap. The audit's "no live geo pages" conclusion was correct. Restoring them is a switch-on, not a build — materially cheaper than Wave 2 costed.

---

# 2026-08-26 — Work Order 01, Batch A (PUBLISHED LIVE)

Published to both custom domains. Verified live by curl on all 5 URLs (rendered `<title>` + `<meta name="description">`, not the Webflow UI confirmation).

| Page | Change |
|---|---|
| `/tax-consultation-in-uae` | Title was literally **"Tax Consultancy in UAE Copy File"** → `Corporate Tax Consultant in Dubai & UAE \| Finanshels` (52 visible). Targets `corporate tax consultant dubai` — 350/mo, $5.00 CPC |
| `/vat-filing-in-uae` | 21-char title with no keyword or brand → `VAT Return Filing in UAE & Dubai \| Finanshels` (45) |
| `/corporate-tax-filing-in-uae` | Desc 251 → 142 chars (was truncated in SERPs) |
| `/corporate-tax-registration-in-uae` | Desc 241 → 144 |
| `/vat-registration-in-uae` | Desc 221 → 129 |

All 5 are confirmed canonical redirect targets in the 24 Aug map. **No credential claims introduced** — "certified/FTA-approved tax agent" was deliberately kept out of the new copy, since that credential is still unsubstantiated on-site.

**Deliberately NOT touched** (would have reverted the 22 Aug batch): `/bookkeeping-services-uae`, `/cfo-services-uae`, `/auditing-services-uae`, `/aml-compliance-uae`.

## Management ruling this session

**Duplicate landing-page cluster → KEEP.** The open question from 22 Aug is now answered: no consolidation, no 301s, no retirement of the duplicate pages.

Consequence to be explicit about: **42% of live pages (54/130) still share a duplicated meta description**, including 12 pages carrying the identical bookkeeping description. Google cannot pick a canonical among them, so `bookkeeping services in dubai` (KD 7) and `bookkeeping services in uae` (KD 9) are expected to stay unranked. The remaining lever that respects the ruling is **unique metadata per duplicate page** — see Work Order 01 §3.

## New this session — not previously known to any session

`/ar-ae/*` **hard-404s across the board.** Those URLs carried 20 of the top 25 traffic pages before the Sept 2025 collapse (Ahrefs + GSC via Ahrefs project 6944111). Organic traffic 27,892/mo → 288/mo. Fix is one line in the redirect CSV: `/ar-ae/(.*)` → `/$1`. Full diagnosis in `../finanshels-com-seo-aeo-geo-plan.md`.

# 2026-08-26 — Work Order 01, Batches B–F (PUBLISHED LIVE)

Four further publishes to both custom domains. 65 live pages touched. Verified by curl against the live site, not the Webflow UI.

## Measured before → after (all live pages, n=130)

| Metric | Before | After |
|---|---:|---:|
| Live pages with a **duplicated meta description** | 54 (42%) | **0** |
| Live pages with a **duplicated title tag** | 22 | **0** |
| Live pages with **no meta description** | 24 | **7** |
| Descriptions **over 160 chars** (truncated in SERPs) | 19 | **0** (median 127) |
| Titles over 60 chars | 30 | 30 — unchanged, still open |

CMS binding expressions excluded from duplicate/length checks — they resolve per item.

## What was fixed

- **The 12-page bookkeeping cluster** — every page keeps its own unique description per the KEEP ruling. No page removed, no redirect.
- Duplicate clusters resolved: corporate tax filing (6), CT registration (4), VAT registration (2), VAT filing (2), GCC country twins (9), plus 7 assorted pairs.
- **Client count standardised to 7,000+** per the 22 Aug ruling, on pages that still read 1,000+ / 4,000+ / 5,000+.
- **Techcloud template boilerplate removed** from `/401`, `/checkout`, `/paypal-checkout`, `/detail_category`, `/detail_product`. The 3 live pricing pages rendered *"Enterprise - Techcloud X Webflow Template"* — now *"Enterprise Plan | Finanshels"*, with the CMS name binding preserved.
- **`/404` title** was *"Not Found - Finanshels is Not Responsible! GooGle is."* → "Page Not Found | Finanshels".
- Keyword-targeted titles on the industry pages (*"Building Unicorns"*, *"Whip Your Restaurant's Finance Manager… Into Shape"*).
- 17 pages given a first meta description.

## CMS template bindings — one fixed, one correctly refused

- **`/detail_podcasts` FIXED.** Bound to `description`, a RichText Transcript field, and rendered **empty on all 5 live pages**. Rebound to `short-description` (PlainText, populated). Verified live.
- **`/detail_industry` NOT fixed, deliberately.** It binds to `description` — a field that **does not exist** on the Industries collection. The only candidate, `industry-description`, is **null on every item sampled**. Rebinding would still render empty. These 11 pages need content written, not a binding change. Do not "fix" this by pasting static text — it would give all 11 industry pages an identical description and rebuild the duplicate problem.
- Remaining 7 pages with no description are all CMS templates (`detail_author`, `detail_topic`, `detail_videos`, `detail_sku`, `detail_old-tools`, `detail_customer-reviews`, `detail_blog-category`) and need the same per-collection field analysis.

## Needs a ruling — live price contradiction

`/landing-pages/online-taxes-and-bookkeeping-services-from-aed-199-in-the-uae` has **AED 199 in the URL and "from AED 299" in its title tag**, live simultaneously. Neither figure is substantiated on-site the way AED 804 is. Left untouched.

Also still unruled from 22 Aug: `/accounting-firm-trusted-by-5000-uae-businesses` hardcodes 5,000 in its **URL** against the 7,000+ ruling. Its description now says 7,000+; the slug still says 5000.

**No credential claims were introduced anywhere.** "FTA-approved / certified tax agent" was kept out of all new copy, since that credential remains unsubstantiated on-site.
