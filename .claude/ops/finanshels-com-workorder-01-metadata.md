# Work Order 01 — finanshels.com metadata & cannibalisation
**Site:** `634fc8d084a32a7597b0bde8` · **Status:** PREPARED, NOT FIRED
**Reconciled against:** `webflow/CHANGELOG-staged.md` (published 22 Aug 2026) and the 24 Aug services-flattening + redirect upload. Nothing in this order overwrites that work.

---

## 1. The finding that explains the ranking failure

**54 of 130 live pages (42%) carry a duplicated meta description.** Worst cluster:

> **12 live pages share the identical description** *"Streamline your finances with expert bookkeeping services in the UAE. Trusted by 1,000+ businesses…"*
>
> `/accounting-and-bookkeeping-service-arabic-page` · `/accounting-and-bookkeeping-service-at-finanshels` · `/accounting-and-bookkeeping-service-at-finanshels-arabic-page` · `/accounting-and-bookkeeping-service-at-finanshels-desk` · `/accounting-and-bookkeeping-service-by-finanshels-uae` · `/accounting-and-bookkeeping-service-with-finanshels` · `/accounting-and-bookkeeping-service-with-finanshels-copy` · `/accounting-firm-trusted-by-5000-uae-businesses` · `/audit-finanshels` · `/bookkeeping-service-uae` · `/uaes-top-accountants-handle-your-books` · `/vat-registration-service-in-uae`

Twelve live pages competing for `bookkeeping services in dubai` — **difficulty 7**. Google cannot select a canonical winner, so it ranks none. This is the mechanical cause of "28 of 34 money keywords rank nowhere", and no amount of additional content fixes it.

Same pattern: 6 pages on corporate tax filing, 4 on CT registration, 2 each on VAT registration / VAT filing / audit, and 4 exact `-desk` duplicate pairs across the GCC country pages.

**This is the same "duplicate landing-page cluster" ruling left open in the 22 Aug changelog.** It is now measured, and it is the single biggest on-site blocker to commercial ranking.

## 2. Other live defects (none previously logged)

| Defect | Pages |
| --- | --- |
| Title reads **"Tax Consultancy in UAE Copy File"** — homepage-linked, and the confirmed redirect target for `/services/tax-consultation-in-uae` | `/tax-consultation-in-uae` |
| Webflow **template boilerplate** live: *"Techcloud X is our B2B SaaS Webflow Template…"* | `/401`, `/checkout`, `/detail_category`, `/detail_product`, `/paypal-checkout` |
| **Unrendered CMS bindings** as live meta: `{{wf {"path":"description","type":"PlainText"} }}` | `/detail_industry`, `/detail_podcasts`, `/detail_blog`, `/detail_webinars`, `/detail_category`, `/detail_product` |
| Bookkeeping description pasted onto unrelated pages | `/vat-registration-service-in-uae`, `/audit-finanshels` |
| Homepage title duplicated | `/Home` + `/schedule-a-free-consultation` |
| No meta description | 24 live pages |

### Resolved by the 22 Aug management rulings — no longer open questions
- **Client count = 7,000+.** The `1,000+` / `4,000+` / `5,000+` variants are stale copy surviving on duplicate pages the 22 Aug batch did not reach. `/accounting-firm-trusted-by-5000-uae-businesses` hardcodes the wrong figure in its own URL.
- **"From AED 804/month" is substantiated** — it is published on-site in the pricing FAQ. Still absent from `/accounting-packages`, which remains the open gap.
- HQ = Dubai Production City; legal entity = Finanshels Accounting Technologies LLC.

---

## 3. Batch A — ready to fire (5 pages, metadata only)

Deliberately narrow. Every page here is (a) a confirmed canonical redirect target in the 24 Aug map, (b) untouched by the 22 Aug batch, and (c) carrying an unambiguous defect. No URL changes, no deletions, no new 404s.

| Page ID | URL | Current defect | New title | New description |
| --- | --- | --- | --- | --- |
| `69cbccbd6cf65f0d7953dfa6` | /tax-consultation-in-uae | Title: *"Tax Consultancy in UAE Copy File"* | Corporate Tax Consultant in Dubai & UAE \| Finanshels | Speak to a certified UAE tax consultant. Corporate tax planning, VAT advisory and FTA compliance for mainland and free zone businesses. |
| `67110b9b923462d85b237af3` | /vat-filing-in-uae | Title 21 chars, no keyword or brand | VAT Return Filing in UAE & Dubai \| Finanshels | Professional VAT return filing in the UAE. Certified tax agents prepare and submit your returns on time, every quarter — penalties avoided. |
| `67110b1b484599c48c2ed3bd` | /corporate-tax-filing-in-uae | Desc 251 chars (truncated) | *(unchanged — 64 chars, acceptable)* | File your UAE corporate tax return with certified tax agents. FTA-compliant filing for mainland and free zone companies, submitted on time. |
| `670e6989db7101a323df0356` | /corporate-tax-registration-in-uae | Desc 241 chars (truncated) | *(unchanged — 61 chars)* | Register for UAE corporate tax with certified tax agents. Fast FTA registration for mainland and free zone businesses, TRN handled for you. |
| `67110d313be159034e3680d6` | /vat-registration-in-uae | Desc 221 chars (truncated) | *(unchanged — 66 chars)* | Register for UAE VAT with certified tax agents. We handle FTA submission, documents and your TRN — for mainland and free zone businesses. |

### Explicitly excluded to avoid reverting the 22 Aug batch
`/bookkeeping-services-uae` (61→57, desc carries the 7,000+ ruling) · `/cfo-services-uae` (73→43) · `/auditing-services-uae` (69→53) · `/aml-compliance-uae` (branded, 129-char desc, "Laundring" typo fixed). **All four are already correct. Do not touch.**

### Held pending the cluster ruling
`/accounting-firm-for-startups-in-uae`, `-ecommerce-`, `-restaurants-`, `-smes-`. Their titles are weak (*"Building Unicorns"*, *"Whip Your Restaurant's Finance Manager… Into Shape"*), but the 24 Aug prune-map redirects the `/services/`-prefixed twins of these pages **into `/bookkeeping-services-uae`**. Improving their metadata pulls against that consolidation. Ruling needed first — see §4.

---

## 4. The decision that unblocks the real prize

The duplicate cluster has been open since 22 Aug. It is now the binding constraint. Three coherent options:

| Option | What happens | Trade-off |
| --- | --- | --- |
| **Consolidate hard** | Keep one canonical per keyword; 301 all duplicates into it | Best ranking outcome. Kills any paid/email landing pages still in use — **check with Growth before firing** |
| **Noindex, keep live** | Duplicates stay reachable for campaigns, `noindex` removes them from the competition | Safer for active campaigns; recovers most of the ranking benefit |
| **Keep industry pages, consolidate the rest** | `/accounting-firm-for-{startups,ecommerce,restaurants,smes}` survive as genuine segment pages; the 12-page bookkeeping cluster and `-copy`/`-desk`/`-bing` twins are consolidated | Preserves segment targeting, kills the pure duplicates |

Redirects have **no API on this plan** — but the 24 Aug session proved **bulk CSV upload works** in Site Settings → Publishing. Whichever option is chosen, the redirect map ships the same way.

---

## 5. Still the highest-value single action on the site

Neither this work order nor the 22 Aug batch addresses it, because no prior session had traffic data:

**Add `/ar-ae/(.*)` → `/$1` to the redirect CSV.** Every `/ar-ae/*` URL hard-404s today, and those URLs carried 20 of the top 25 traffic pages before the September 2025 collapse. One line. See `finanshels-com-seo-aeo-geo-plan.md` §2.2.

---

## 6. Firing instructions

Batch A is one `bulk_update_pages` call. Webflow stages these — they do not go public until a publish runs.

**Before saying go:**
1. Staged changes ship with *anyone's* next publish. There is no partial rollback.
2. Confirm nobody else has unpublished work staged on the site.

Verify after publish by `curl`ing all 5 URLs and asserting the rendered `<title>` and `<meta name="description">` — not the Webflow UI's confirmation.
