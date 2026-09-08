# Pending page SEO changes — blocked by permission classifier

Site: `634fc8d084a32a7597b0bde8` (finanshels.com)
Prepared 2026-08-22. Apply via Webflow → Pages → page → Settings → SEO.

All copy below is checked against the standing Google Ads constraint: no filing/registration
claims, no price that is not shown on the pricing page (the AED 804 figure is deliberately absent).

---

## 1. `/accounting-packages` — page id `66fe8e3349e7a9ecf4cc63f7`

**Title** — was `Get the Pricing | Finanshels` (28 chars, zero keywords, on the money page)
```
Accounting & Bookkeeping Packages in UAE | Finanshels
```
(52 chars)

**Meta description** — was 124 chars starting with the CMS artefact `Pricing, With our transparent...`
```
Compare Finanshels accounting and bookkeeping packages for UAE businesses - monthly books, VAT-ready records and corporate tax support.
```
(134 chars. Deliberately does not claim "transparent pricing" — the page currently says "Pick the plan. We'll quote the number.")

---

## 2. `/aml-compliance-uae` — page id `674ac574394ca5f6848e7b9e`

**Title** — was `AML Compliance Filing in UAE` (28 chars, no brand)
```
AML Compliance Services in UAE | Finanshels
```
(43 chars)

**Meta description** — was **265 chars** (over limit) and contained the misspelling "Laundring"
```
AML compliance support for UAE businesses - risk assessments, written policies, staff training and ongoing transaction monitoring.
```
(129 chars. "Filing" removed from the title and "registration" avoided in the body per the Ads constraint.)

---

## 3. `/auditing-services-uae` — page id `67110c55511974bf612e21d6`

**Title** — was 69 chars (truncates in SERP)
```
Audit Services in UAE | Financial & Compliance Audits
```
(53 chars)

**Meta description** — was 162 chars
```
Audit services for UAE businesses from Finanshels - internal audits, external audit support and compliance reviews for SMEs and free zone companies.
```
(147 chars)

---

## Not yet located (page list is paginated at 100; these are on page 2+)

`/bookkeeping-services-uae` · `/about-us` · `/our-customers` · `/contact-us` · `/blog` ·
`/cfo-services-uae` · `/resources/faqs` · homepage

Homepage title is 71 chars and truncates; `/about-us` is 21 chars; `/our-customers` is 29;
`/contact-us` description is 209. `/services/vat-filing-and-accounting-in-uae` is titled
`VAT Filing and Return` — no location, no modifier, no brand.

---

## NEW FINDING — duplicate landing-page cluster (not in the audit register)

The page list surfaced a large set of near-duplicate pages, none of them in sitemap.xml:

- `accounting-and-bookkeeping-service-at-finanshels`
- `accounting-and-bookkeeping-service-at-finanshels-desk`
- `accounting-and-bookkeeping-service-at-finanshels-arabic-page`
- `accounting-and-bookkeeping-service-arabic-page`
- `accounting-and-bookkeeping-service-by-finanshels-uae`
- `accounting-and-bookkeeping-service-with-finanshels`
- `accounting-and-bookkeeping-service-with-finanshels-copy`
- `corporate-tax-filing-with-finanshels` + `-bing` + `-draft`
- `best-corporate-tax-filing-service-provider-in-the-{dubai,sharjah,ajman,abu-dhabi}-...`
- Gulf set: Bahrain / Kuwait / Oman / Qatar / Saudi, each with a `-desk` twin
- `accounting-firm-trusted-by-5000-uae-businesses`  ← carries the **5,000** claim; management ruled **7,000+**

Two consequences worth raising:
1. `-copy`, `-draft`, `-desk` and `-bing` variants are almost certainly unintended duplicates
   competing with the canonical service pages.
2. The audit concluded there were **no** geographic landing pages. That was wrong at the page level —
   Gulf-country pages and four `best-corporate-tax-filing-...-in-the-{emirate}` pages exist. They are
   simply **absent from the sitemap**, so they were invisible to a crawl-based audit. The UAE-city gap
   is narrower than reported; the sitemap gap is wider.

Needs a decision: keep, consolidate, or noindex each cluster.
