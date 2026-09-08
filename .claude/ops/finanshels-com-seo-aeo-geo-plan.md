# finanshels.com — Verified Diagnosis & Recovery Plan
**Date:** 2026-08-26 · **Target:** finanshels.com (Webflow, root host, no www)
**Data sources:** Ahrefs Site Explorer + Rank Tracker + Site Audit (project 6944111), Google Search Console via Ahrefs, live HTTP checks as Googlebot.
Every figure below is cited to a source. Anything unreachable is printed UNKNOWN.

---

## 1. Verdict on the prior audit

The prior audit scored the site **68/100 "Moderate — strong domain footprint"**. That is wrong by an order of magnitude. The site lost **99% of its organic traffic** between August and October 2025 and has been flat on the floor for ten months. The audit never checked traffic.

| Prior claim | Verdict | Evidence |
| --- | --- | --- |
| "~2,800 URLs in sitemap" | **FALSE** | Sitemap contains **714** `<loc>` entries (live fetch). |
| "SEO 68/100, strong footprint" | **FALSE** | Organic traffic 27,892/mo (May 2025) → **288/mo** (Aug 2026). Ahrefs metrics-history. |
| "Active index coverage across services/industries/tools" | **FALSE** | Pages receiving any organic traffic: 743 (Aug 2025) → **35** (Aug 2026). |
| "Tools/calculators are a strength" | **MOSTLY FALSE** | Only **3** `/tools/` URLs in sitemap (+7 `/old-tools/`). |
| "`llms.txt` returns 404" | **TRUE** | HTTP 404 confirmed. Also `llms-full.txt`, `ai.txt` → 404. |
| "Homepage has AccountingService + Organization JSON-LD" | **TRUE** | 2 `ld+json` blocks; AccountingService, Organization, PostalAddress, GeoCoordinates, OpeningHoursSpecification, ContactPoint all present. |
| "Clean self-canonicals" | **TRUE** | Verified on 7 sampled pages. |
| "12 Google Font weights via WebFont loader" | **UNVERIFIED** | No `families:[...]` array found in homepage HTML. Do not action without re-measuring. |
| "5+ trackers incl. PostHog in head" | **PARTLY TRUE** | Found GTM, Facebook, Clarity, Zoho SalesIQ, Apollo (5 hosts). **No PostHog** on homepage. |
| "Competitors: Rise Accounting, Farahat & Co, NR Doshi" | **FALSE** | Actual organic competitor set (AE): wafeq.com (DR48), aaconsultancy.ae (DR49), shuraatax.com, alaan.com, tallysolutions.com, cleartax.com, crossval.com, bshsoft.com. |
| "AEO 52 / GEO 44" | **UNMEASURED** | Real measured figure: **48 AI citations across 25 pages** — ChatGPT 2, Google AI Mode 15, Perplexity 6, Copilot 5, Gemini 5, AI Overviews 3, Grok 0. |
| "Ad sub-properties transfer zero authority to the core — a gap" | **WRONG FRAMING** | That separation is a deliberate Google Ads policy requirement for the ads site. Merging them would create a policy problem. Leave it alone. |
| "Pricing AED 804/mo, 6,000–7,000 businesses" | **UNVERIFIED** | Sourced from AI summaries, not from the site or CRM. Do not reuse in copy until Finance confirms. |

**The deeper failure:** the audit measured *technical hygiene* and found it acceptable. Ahrefs Site Audit agrees — **health score 98/100**, 33 errors across 1,356 crawled URLs. The site is technically clean and commercially dead. Hygiene was never the problem.

---

## 2. What actually happened

### 2.1 The collapse (Google Search Console, ground truth)

| Month | Clicks | Impressions | Avg. position |
| --- | ---: | ---: | ---: |
| May 2025 | 26,948 | 2,532,637 | 21.1 |
| Jul 2025 | 19,639 | 2,539,381 | 20.1 |
| **Aug 2025** | **12,520** | **1,643,592** | 18.1 |
| **Sep 2025** | **1,447** | **101,951** | **9.1** |
| Oct 2025 | 1,067 | 94,514 | 5.1 |
| Nov 2025 | 999 | 103,832 | 3.6 |
| Dec 2025 | 714 | 53,546 | 4.4 |

Impressions fell **94% while average position *improved* from 18.1 → 3.6**. That combination has one meaning: **pages left the index**. A ranking demotion pushes average position *down*, not up. The surviving handful ranks well because everything else stopped being eligible to appear at all.

### 2.2 The mechanism — a deleted locale with no redirects

In August 2025, **20 of the top 25 traffic pages lived on `www.finanshels.com/ar-ae/...`** — a Webflow locale directory serving English content at duplicate URLs.

Today: **every `/ar-ae/*` URL hard-404s.**

```
https://www.finanshels.com/ar-ae/blog/salary-certificate-format-in-uae
  → 301 → https://finanshels.com/ar-ae/blog/salary-certificate-format-in-uae
  → 404          ← dead end. ~2,348 monthly visits lost here alone.
```

The `www → root` redirect still fires correctly, then drops the user into a 404. There is **no `/ar-ae/` → `/` redirect rule**. There is **no hreflang** anywhere on the site (0 occurrences), and **no `xhtml:link` alternates** in the sitemap — so Google was never told these were locale variants and never transferred the rankings back to the English originals when the locale was deleted.

**Most English originals still exist and return 200** — `/blog/unified-number-in-the-uae`, `/blog/how-to-calculate-gratuity-amount-in-the-uae`, `/blog/how-to-get-an-emirates-id-in-the-uae`, `/tools/gratuity-checker-calculator-tool-in-uae`. They sit live, intact, and receive essentially zero traffic, because the ranking signal died with the URL that held it.

### 2.3 The second wound — pruned posts redirected to `/blog`

```
/blog/how-much-is-a-freelance-visa-in-dubai   → 301 → /blog
/blog/iloe-insurance-about-the-deadline       → 301 → /blog
/blog/best-business-bank-accounts-in-uae      → 301 → /blog
/blog/visa-on-arrival-countries-for-uae-residents → 404
```

A 301 to an unrelated hub page is treated by Google as a **soft 404**. It passes no equity and the URL is dropped. Whoever pruned the blog used the hub as a catch-all, which destroyed the link equity they were presumably trying to consolidate.

### 2.4 The instrumentation blackout

**GSC data stops at December 2025.** Eight months with no search visibility at all. Nobody has been able to see indexation status, manual actions, or coverage errors during the entire period the site has been on the floor. This is the reason the collapse went undiagnosed long enough for a third-party audit to score the site 68/100.

---

## 3. The strategic reframe — do NOT chase the lost 27,000

The lost traffic was, commercially, close to worthless. Here is what it actually was:

> salary certificate · freelance visa cost · unified number · gratuity calculation · Emirates ID application · 2-year family visa prices · Emirates NBD account opening · visa on arrival · ILOE insurance · SIRA certificate · PRAN number

That is **UAE expat life-admin**, not finance buying intent. A reader checking their gratuity entitlement does not purchase a corporate bookkeeping retainer. The peak was inflated by (a) non-commercial content at consumer-scale volume and (b) a misconfigured duplicate locale that should never have been indexed.

**Meanwhile, the commercial surface has never worked at all.** Of the 34 keywords in the Ahrefs Rank Tracker, **28 rank nowhere in the top 100** — and that includes trivially winnable terms:

| Keyword | Volume/mo (AE) | Difficulty | CPC | Current position |
| --- | ---: | ---: | ---: | --- |
| e invoicing uae | 2,000 | **4** | $1.43 | — not ranking |
| vat registration uae | 1,800 | 35 | $2.11 | — not ranking |
| accounting services in dubai | 1,300 | 63 | $5.72 | — not ranking |
| audit firms in dubai | 1,000 | 56 | $4.00 | — not ranking |
| bookkeeping services in dubai | 700 | **7** | $4.79 | — not ranking |
| accounting services in uae | 700 | 52 | $5.45 | — not ranking |
| accounting & bookkeeping services in uae | 500 | 38 | $5.45 | — not ranking |
| bookkeeping services | 500 | **3** | $2.59 | — not ranking |
| corporate tax registration uae | 500 | 44 | $3.00 | — not ranking |
| corporate tax filing uae | 500 | 35 | $0.60 | — not ranking |
| bookkeeping services in uae | 450 | **9** | $0.62 | — not ranking |
| accounting software uae | 450 | **7** | $4.00 | — not ranking |
| corporate tax consultant dubai | 350 | 30 | $5.00 | — not ranking |
| cfo services dubai | 250 | — | $3.00 | — not ranking |
| aml compliance uae | 200 | 20 | $5.06 | — not ranking |
| outsourced accounting services dubai | 100 | **0** | — | — not ranking |

`/bookkeeping-services-uae` returns 200 with **4,258 words** of content and ranks for nothing, against a keyword of **difficulty 7**. That is not a content problem. That is a page with no authority, no proof, and no earned trust on a domain that just lost its footprint.

### The prize, sized honestly

Total addressable commercial demand across the category: **≈ 11,000 searches/month in the UAE.** That is small — small enough that *owning it outright is a realistic two-quarter goal*, which is not true in most markets. And it is expensive traffic: blended CPC across the set is roughly **$4**.

- Assumption (stated, not measured): capturing top-3 across this set yields ~30% of available clicks → **~3,000 visits/month**.
- Paid-equivalent value at ~$4 CPC → **≈ $12,000/month ≈ AED 44,000/month** in avoided ad spend.
- UNKNOWN: conversion rate and LTV for organic-sourced leads. GA4/CRM attribution is not currently readable. Do not put a revenue figure on this until it is.

**The goal is not 27,000 visits. The goal is 3,000 visits that are all buyers, plus ownership of the AI answer layer where this category's research now happens.**

---

## 4. The plan

### Phase 0 — Regain sight (Week 1) · **BLOCKER on everything else**

Nothing here should be negotiated. Eight months blind is why this happened.

| # | Action | Owner | Gate |
| --- | --- | --- | --- |
| 0.1 | Restore Google Search Console access to finanshels.com; re-link to Ahrefs project 6944111 | Marketing | GSC returns data for Aug 2026 |
| 0.2 | **Check Manual Actions + Security Issues immediately.** A scaled-content-abuse action is still an open hypothesis and would change this entire plan | Marketing | Screenshot of clean (or not) panel |
| 0.3 | Pull Pages → Indexing report. Get exact counts: indexed / crawled-not-indexed / discovered-not-indexed / soft-404 | Marketing | Numbers in hand |
| 0.4 | Confirm GA4 property + conversion events for form fills; confirm CRM source attribution | Marketing | One lead traced end-to-end |
| 0.5 | Set weekly Ahrefs Rank Tracker + GSC review; nothing runs unwatched again | Marketing | Recurring calendar hold |

> Until 0.2 returns clean, treat everything below as provisional. If there *is* a manual action, reconsideration comes before content work.

### Phase 1 — The one-line fix (Week 1) · **highest leverage in the entire document**

**Add a wildcard 301 in Webflow: `/ar-ae/(.*)` → `/$1`**

That single rule reconnects every dead URL that used to hold the site's rankings to the live English page that still exists at the same path. It is one line. It costs nothing. It addresses the largest single cause of the collapse.

*Operational note:* Webflow on this plan has **no redirects API** — these must be entered manually in the Webflow UI (Site Settings → Publishing → 301 Redirects). Verify each by terminal 200, not by the UI's confirmation.

| # | Action | Detail |
| --- | --- | --- |
| 1.1 | Wildcard `/ar-ae/(.*)` → `/$1` | Verify: `curl -I` on 10 sampled old URLs must terminate in 200 |
| 1.2 | Audit every existing `→ /blog` redirect | Each one is a soft 404. Repoint to the closest genuinely relevant page, or restore the post |
| 1.3 | Fix the 404'd originals | e.g. `/blog/visa-on-arrival-countries-for-uae-residents` → restore or redirect to a real topical match |
| 1.4 | Remove the duplicate `Sitemap:` line in robots.txt | Cosmetic, but it is listed twice |
| 1.5 | Resubmit sitemap in GSC; request indexing on the 16 money URLs | — |

**Honest expectation:** after ~12 months, Google has largely dropped these URLs. Recovery will be **partial, not full**, and much of what returns is the low-value expat traffic anyway. Do this because it is one line, it stops the bleeding, and it recovers link equity — **not** because it is the growth strategy. It is not.

### Phase 2 — Own the commercial core (Weeks 2–8) · **this is the growth strategy**

Nine service pages exist. They must go from ranking for nothing to owning all 16 money keywords.

| # | Action | Detail |
| --- | --- | --- |
| 2.1 | **One page, one keyword.** Map each of the 16 terms to exactly one owning URL. Kill overlaps | 81 sitemap URLs match "corporate-tax" and 54 match "vat" — cannibalisation is near-certain. Consolidate and 301 the losers into the winners |
| 2.2 | Rebuild each service page around **proof, not prose** | Named client outcomes, real pricing, real turnaround times, screenshots of the actual dashboard/product, named credentialed people. 4,258 words of generic copy is why it ranks 100+ |
| 2.3 | `Service` schema on every service page | With `provider: {"@id": "…/#organization"}`, `areaServed`, and `offers` + `priceSpecification` — only once Finance confirms real pricing |
| 2.4 | `FAQPage` schema on service + glossary pages | Currently absent below the homepage |
| 2.5 | Internal linking from the 393 blog + 196 glossary URLs into the 9 service pages | The blog is the only asset with any earned authority left. Point it at the money |
| 2.6 | Comparison tables on every service page | *In-house accountant vs. traditional firm vs. Finanshels* — cost, turnaround, software included, who signs the return. These get extracted verbatim into AI answers |

**Sequence by difficulty, not by revenue.** Win the easy ones first to rebuild domain trust: `outsourced accounting services dubai` (KD 0) → `bookkeeping services` (KD 3) → `e invoicing uae` (KD 4) → `bookkeeping services in dubai` (KD 7) → `accounting software uae` (KD 7) → `bookkeeping services in uae` (KD 9). Only then attack KD 50–68.

### Phase 3 — The e-invoicing land grab (Weeks 3–10) · **the single best unclaimed asset**

**`e invoicing uae` — 2,000 searches/month, difficulty 4, nobody ranking, no page on the site.**

UAE e-invoicing is a live compliance mandate. Every business in the country must act, most do not know how, and the query volume is the largest in the entire commercial set at the lowest difficulty in the entire commercial set. This is the highest-ROI content asset available and it does not exist today.

| # | Action |
| --- | --- |
| 3.1 | Build the definitive UAE e-invoicing hub — the mandate, the phased timeline by business size, the exact data fields required, accredited service provider list, integration paths for Xero/QuickBooks/Zoho |
| 3.2 | Ship an **e-invoicing readiness checker** tool. Tools earn links and citations; 400-word blog posts do not |
| 3.3 | `SoftwareApplication` / `WebApplication` schema on it and on all `/tools/` pages |
| 3.4 | Cluster: 10–15 supporting pages, each internally linked to the hub and to the bookkeeping service page |

### Phase 4 — AEO / GEO, measured rather than guessed (Weeks 4–12)

Current measured baseline: **48 AI citations across 25 pages** (ChatGPT 2, AI Mode 15, Perplexity 6, Copilot 5, Gemini 5, AI Overviews 3, Grok 0).

| # | Action |
| --- | --- |
| 4.1 | Publish `/llms.txt` (currently 404). Keep it factual — services, real pricing, credentials, integrations, key URLs. No unverified claims |
| 4.2 | **Set up an Ahrefs Brand Radar report** tracking Finanshels vs. wafeq, aaconsultancy, shuraatax, alaan, crossval across ChatGPT / AI Overviews / AI Mode / Perplexity / Gemini / Copilot. Measure share of voice monthly — do not estimate it |
| 4.3 | Add 40–60 word answer blocks directly under each `<h2>` on service and glossary pages. Direct factual answer first, marketing second |
| 4.4 | Publish original data: a **UAE SME Corporate Tax & Compliance Benchmark**, from real anonymised client data. LLMs cite primary sources; nothing else on this list makes Finanshels *the* source |
| 4.5 | Claim and populate Clutch, G2, Capterra, GoodFirms, Trustpilot. Third-party consensus is what AI models weigh for "best X" queries |

**Cut from the prior plan:** posting on r/dubai and Quora. It is low-yield, reads as astroturfing, and carries brand risk that outweighs any citation benefit.

### Phase 5 — Entity & authority (ongoing)

- DR 35, 734 live referring domains, 1,976 live backlinks — a real asset that is currently pointed at nothing commercial. Audit which refdomains point to now-404'd or `→ /blog` URLs and reclaim them via Phase 1 redirects.
- Google Business Profile for both Dubai Production City and Sharjah, actively reviewed.
- Wikidata entity + consistent NAP across UAE business directories.
- Founder/author `Person` entities with real credentials on every article — E-E-A-T is load-bearing in the finance vertical (YMYL).

---

## 5. Falsifiable predictions

Stated before the work, to be scored honestly afterwards.

| # | Prediction | Measured by | Due |
| --- | --- | --- | --- |
| P1 | The `/ar-ae/` wildcard redirect recovers **< 25%** of the lost 27k traffic — partial, not full | Ahrefs org_traffic | +90 days |
| P2 | GSC Pages report shows **> 300 URLs** in "Crawled – currently not indexed" or "Discovered – not indexed" | GSC Indexing report | Week 1 |
| P3 | The site has **no manual action**; the collapse is fully explained by the locale deletion | GSC Manual Actions | Week 1 |
| P4 | With a dedicated page + tool, `e invoicing uae` reaches **top 5** | Ahrefs Rank Tracker | +120 days |
| P5 | At least **6 of the 16** money keywords reach page 1 | Ahrefs Rank Tracker | +180 days |
| P6 | Measured AI citations rise from 48 to **> 150** | Ahrefs AI responses count | +180 days |

If P3 is wrong — if there *is* a manual action — Phases 2–5 pause and reconsideration comes first.

---

## 6. What to stop doing

| Drop | Why |
| --- | --- |
| Font-loading and script-deferral optimisation | Site Audit health is already 98/100. Zero pages rank. Performance is not the constraint, and the specific font claim did not verify |
| Chasing recovery of the 27k peak | It was expat life-admin traffic with no purchase intent, partly inflated by a duplicate locale that should never have been indexed |
| Reddit / Quora seeding | Low yield, brand risk, reads as astroturfing |
| Merging the ad sub-properties into finanshels.com | The separation is a deliberate Google Ads policy requirement. Leave it |
| Publishing any pricing or client-count figure | "AED 804/month" and "6,000–7,000 businesses" are unverified. Confirm with Finance before either appears in copy or schema |

---

## 7. Open UNKNOWNs

- Manual action status — **not readable without GSC access**. Highest-priority unknown in this document.
- Current indexed page count — not readable without GSC.
- Whether the `/ar-ae/` locale was deleted deliberately, and by whom — no record found.
- Organic→lead conversion rate and LTV — GA4/CRM attribution not currently readable. All revenue framing above is deliberately withheld until it is.
- Whether the 393 blog + 196 glossary URLs are indexed at all — pending 0.3.
