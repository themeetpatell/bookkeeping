# Webflow embed — Pricing / Accounting packages

A standalone, CSS-isolated pricing page for Webflow. No React, no build step on
Webflow's side. Same design system as the [AI-accounting embed](../README.md),
but namespaced `fspr-` instead of `fsai-` so the two can never collide.

## Paste these seven blocks

Each one goes in its own **HTML Embed** element, in this order.

| # | File | Contains | Chars |
|---|------|----------|-------|
| 1 | [block-1-hero-plans.html](block-1-hero-plans.html) | Hero + client logo strip + 3 plan cards + mobile plan switcher · **icon sprite** · base tokens | 34,830 |
| 2 | [block-2-compare.html](block-2-compare.html) | Feature comparison + guarantees strip + what every plan includes (AI/human split, trust row) | 23,663 |
| 3 | [block-3-addons.html](block-3-addons.html) | Add-on services (13, incl. AML), each with its own CTAs | 21,578 |
| 4 | [block-4-alternatives.html](block-4-alternatives.html) | In-house vs firm vs Finanshels + stats | 7,208 |
| 5 | [block-5-process.html](block-5-process.html) | How it works + testimonials | 16,793 |
| 6 | [block-6-faq.html](block-6-faq.html) | Grouped FAQ accordion + sticky question rail | 17,629 |
| 7 | [block-7-cta.html](block-7-cta.html) | Quote form + **sticky mobile bar** · **animations, media queries, script** | 35,039 |

Webflow's limit is 50,000 characters per embed; the largest block is 35,039.
FAQ and the quote form were one block until the grouped accordion and the
"what you get" section pushed the pair past that limit.

### Each block stands alone

Every block carries the design tokens, the cascade fence, the icons it
references and its own media queries. **Paste them in any order, or paste one on
its own** — each renders correctly by itself. The numbering is just page order.

This used to be false, and it cost a debugging session: the CSS was partitioned
so block 3 consumed 16 custom properties and defined none. On its own every
`var(--fspr-*)` resolved to nothing and the section rendered as unstyled text —
which looks like a broken embed, not a missing sibling block. Duplicated tokens
across seven blocks are idempotent and cost a few KB each; the limit has room.

One thing still only lives in the last block:

- **Block 7 carries the script** that drives the plan switcher (block 1), the
  comparison scroll hint (block 2), the testimonial rail (block 5), the FAQ
  accordion (block 6) and the sticky bar. Without it those degrade to static
  fallbacks — three stacked plan cards, a manually scrollable table, FAQ answers
  rendered open. Nothing disappears.

### Never write a tag name in a CSS comment

Webflow parses an embed as markup, so a literal `p` in angle brackets inside a
CSS comment **closes the style element early and silently drops every rule below
it**. The page still renders — just unstyled from that line down, which reads as
"the CSS didn't load" and sends you hunting in the wrong place entirely.

This shipped once, in the add-ons block, and took a while to find because only
that one section was affected. The build now fails on any tag-like sequence in a
stylesheet and points at the line. Write "a p element", not the tag.

### Placement

- Drop each embed into a **Section with no padding**, ideally a direct child of
  Body. Each section paints its own full-width cream background (`#faf9f5`), so
  the blocks seam together invisibly.
- If a wrapper is padded or width-capped, change that block's opening tag to
  `<div class="fspr-root fspr-fullbleed">`.
- **Do not** put block 6 inside a Webflow Form Block — it contains its own
  `<form>`.

## Content decisions

**Quote-based, no prices.** Matches what is live on
`finanshels.com/accounting-packages` today. Every plan CTA is "Request a quote"
and scrolls to the form. The only AED figures on the page are the in-house and
traditional-firm market ranges in the comparison table, which carry an explicit
disclaimer that they are not Finanshels-verified.

**Transaction caps are 100 / 500 / 1,500.** The two source pages disagreed —
the planned page's cards said 60 / 200 / 2,000 / 3,600, but both comparison
tables said 100 / 500 / 1,500. The table numbers won because they are
corroborated on both pages. If the card numbers were the correct ones, edit
`plans` and `compareRows` in [../build/pricing-html.mjs](../build/pricing-html.mjs)
and rebuild.

**Three plans, not four.** The planned page's Starter tier has no row in either
comparison table, so it was left out rather than shipped half-specified.

**Add-on services** are taken from the "Our Most Popular Add-On Services" grid on
the live accounting-packages page, plus the services listed in that site's nav,
with AML Compliance added and flagged as deadline-driven. Edit the `addons`
array in [../build/pricing-html.mjs](../build/pricing-html.mjs) to change them.

Each one is its own funnel rather than another route to the shared quote form:
a **WhatsApp** button opening a thread pre-filled with that service's name, and
a **Learn more** link to that service's page on `finanshels.com`. Every `path`
in the `addons` array was checked for a 200 before being added.

Three entries have no page of their own:

| Add-on | Points at | Why |
|---|---|---|
| Corporate Tax De-registration | `/services/corporate-tax-registration-in-uae` | No standalone de-registration page; the registration page covers the lifecycle |
| VAT De-registration | `/services/vat-registration-in-uae` | Same |
| Invoicing & Quotation | *(nothing)* | No service page exists, so it ships WhatsApp-only rather than linking somewhere that doesn't answer the question |

Give any of them a `path` the day a real page goes live and the button appears
on its own.

## Testimonials

Eight reviews in a scroll-snap rail rather than a two-up grid — a grid of eight
is a wall, and a rail reads as "there are more of these".

**Every quote is already published on finanshels.com under the same
attribution.** Six run on the service pages (AML, CFO, Corporate Tax filing,
VAT filing, SMEs) and the homepage; the ZWAG AI and Nassib Sawaya quotes were
already on this page. Nothing is written for the page — these are real
customers, so the wording stays as published. The one exception is Jomon
Ulahannan's, which reads "We insurancehub.ae highly recommend" live; the stray
domain is dropped and nothing else changed.

Edit the `voices` array in [../build/pricing-html.mjs](../build/pricing-html.mjs)
to add more. **Only add quotes you can point at a real, attributable source
for** — Trustpilot blocks automated reads, so the 4.9 figure in the header is
carried over from the existing stats row rather than computed from these eight.

Behaviour:

- **No auto-rotation.** It moves only when the reader moves it — auto-advancing
  carousels take control away and are a known accessibility problem.
- Swipe, trackpad, arrow buttons and arrow keys all drive the same native
  scroll, so there is no JS-only route to the content.
- Arrows appear from 760px up and disable at each end; below that the next card
  peeks past the screen edge instead, which is the affordance a thumb expects.
- The rail cancels the container gutter so cards run to the screen edge.

## Conversion structure

The page is built to produce quote requests, so the ask repeats instead of
sitting only in the footer:

- **Conversion rails** after the comparison, the alternatives and the FAQs —
  one line of copy, "Request a quote", and WhatsApp.
- **Per-service CTAs** on all 13 add-ons.
- **Sticky mobile bar** from just past the hero, which retracts once the real
  form is on screen so the two asks never compete. It is `position: fixed`, so
  it will misbehave only if a Webflow ancestor sets a `transform` — if that
  happens, move block 6 higher in the DOM.
- Every WhatsApp entry point pushes its own `data-fspr-wa` source to
  `dataLayer`, so plan / rail / add-on / sticky can be told apart in GTM.

## Verified

Rendered in [preview.html](preview.html) against the same hostile host
stylesheet used for the AI page (Comic Sans headings, teal paragraphs, lime
borders, yellow inputs).

- Cascade fence holds — headline computes to Inter / `#191919`, not the host's
  Comic Sans / teal / 3px tracking
- 6 wrappers, 1 sprite, **0 unresolved `<use>` refs** across block boundaries
- No Finanshels price string anywhere on the page
- Comparison table 4 columns × 14 rows; below 940px it keeps all four and
  scrolls sideways under a pinned feature column
- The alternatives table becomes one card per criterion at 940px, with the
  Finanshels cell carrying the accent edge
- **0px horizontal overflow and 0 clipped elements at 320 / 360 / 375 / 390 /
  414 / 480 / 600 / 768 / 940 / 1024 / 1280 / 1440**
- Mobile page height **15,132px → 11,663px at 390px** despite adding three
  conversion rails, 13 per-service CTA rows and the sticky bar
- Plan switcher swaps the card and updates `aria-selected`; the FAQ accordion
  and the sticky bar's retract-over-form behaviour verified by real clicks
- **Degrades without JS**: switcher hidden, all three plan cards stack, sticky
  bar never appears, every `data-reveal` element renders at full opacity
- Every bento grid reflows via `auto-fit` rather than fixed column counts, so
  no breakpoint can strand it at the wrong track count
- FAQ accordion is single-open and tracks `aria-expanded`
- WhatsApp CTAs push `whatsapp_click` to `dataLayer`
- Zoho action intact, phone still `required`
- Contrast: every text element passes WCAG AA except the primary button
  (white on brand orange, 3.16:1) — same known brand trade-off as the AI page

## Regenerating

```bash
npm run build:webflow:pricing
```

Copy lives in the data arrays at the top of
[../build/pricing-html.mjs](../build/pricing-html.mjs); styling in
[src/pages/PricingLanding.css](../../src/pages/PricingLanding.css). The build
fails loudly if a CSS chunk is never shipped or a block goes over the limit.

## Not included

- `<Seo />` — set title, description and canonical in Webflow's Page Settings.
- In-page anchors are `#fspr-quote`, `#fspr-plans` and `#fspr-faq` so they
  can't collide with ids already on the page. Point Webflow nav links at those.
