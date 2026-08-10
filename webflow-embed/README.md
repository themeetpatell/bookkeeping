# Webflow embed — AI-Native Accounting section

A standalone, CSS-isolated build of [AIAccountingLanding.jsx](../src/pages/AIAccountingLanding.jsx)
for the Webflow home page. No React, no `react-icons`, no build step on Webflow's side.

## Paste these seven blocks

Each one goes in its own **HTML Embed** element, in this order. Every block is
self-contained: it carries the CSS for its own sections alongside its markup.

| # | File | Contains | Chars |
|---|---|---|---|
| 1 | [block-1-hero.html](block-1-hero.html) | Hero + client logos | 31,253 |
| 2 | [block-2-manifesto.html](block-2-manifesto.html) | Why AI-native + comparison table | 28,756 |
| 3 | [block-3-workflow.html](block-3-workflow.html) | WhatsApp strip + how it works | 21,257 |
| 4 | [block-4-dashboard.html](block-4-dashboard.html) | Findelivery dashboard | 25,382 |
| 5 | [block-5-services.html](block-5-services.html) | AI/human split + services bento | 26,186 |
| 6 | [block-6-social-proof.html](block-6-social-proof.html) | Testimonials + FAQ | 25,650 |
| 7 | [block-7-cta.html](block-7-cta.html) | Final CTA + form · **script** | 25,658 |

Webflow's limit is 50,000 characters per embed; the largest block is 31,253.

### Each block stands alone

Every block carries the design tokens, the cascade fence, the icons it
references and its own media queries. **Paste them in any order, or paste one on
its own** — each renders correctly by itself. The numbering is just page order.

The CSS used to be partitioned across the blocks, which made any single one
meaningless: it consumed custom properties it didn't define, so on its own every
`var(--fsai-*)` resolved to nothing and the section rendered as unstyled text.
Duplicating the shared layer is idempotent and leaves plenty of headroom.

- **Block 7 still carries the script** (FAQ accordion, scroll reveals, WhatsApp
  tracking). Without it those degrade to static fallbacks rather than vanishing.

### Never write a tag name in a CSS comment

Webflow parses an embed as markup, so a literal `p` in angle brackets inside a
CSS comment **closes the style element early and silently drops every rule below
it** — the section renders unstyled from that line down, which looks like the
CSS failed to load. The build now fails on any tag-like sequence in a stylesheet
and reports the line. Write "a p element", not the tag.

### Placement

- Drop each embed into a **Section with no padding**, ideally a direct child of
  Body. Each section paints its own full-width warm-cream background (#faf9f5),
  so the blocks seam together invisibly.
- If a wrapper is padded or width-capped, change that block's opening tag to
  `<div class="fsai-root fsai-fullbleed">`. The escape hatch is already in the
  CSS; it needs `body { overflow-x: hidden }` when a scrollbar is present.
- **Do not** put block 7 inside a Webflow Form Block — it contains its own
  `<form>`, and nested forms are invalid HTML.
- Page-settings custom code is capped well below 50,000 characters, which is why
  everything ships as embeds rather than head/body injection.

## How the CSS isolation works

Everything is namespaced `fsai-` and fenced behind `.fsai-root:not(#_)`.

```
Webflow tag style      h2 { }                            → (0,0,1)
Webflow class style    .heading.is-large { }             → (0,2,0)
This reset             .fsai-root:not(#_) :where(*)      → (1,1,0)  ← beats both
This component CSS     .fsai-root:not(#_) .fsai-btn      → (1,2,0)  ← beats the reset
```

`:not(#_)` matches everything — nothing has id `_` — while contributing id-level
specificity. That lets every block carry its own `class="fsai-root"` wrapper;
repeating `id="fsai-root"` across seven embeds would be invalid HTML.

The reset runs `all: revert`, which discards every author-origin declaration
Webflow contributed and falls back to the browser's own defaults.

Three details that are load-bearing:

- **SVG subtrees are excluded from `all: revert`.** Presentation attributes
  (`fill`, `stroke`, `d`) cascade at author origin, so reverting them erases the
  icon geometry — verified in-browser: `d` computes to `none` and paths stop
  rendering. A separate rule neutralises only box-model and decoration
  properties on `svg, svg *`, which is what catches Webflow's
  `img, svg { max-width: 100% }`.
- **The reset re-applies `margin: 0; padding: 0`** because the React page is
  authored against the global reset in [src/App.css](../src/App.css). Without it,
  headings and lists pick up UA margins the design never had.
- **`.is-ready` gates the scroll-reveal hidden state.** The script adds it to
  every wrapper on load, so if JS never runs the page renders fully visible
  rather than blank.

## Verified

Rendered in [preview.html](preview.html) against a deliberately hostile host
stylesheet — Comic Sans headings, teal paragraphs, lime borders on every image
and SVG, 60px list padding, yellow inputs. Open it in a browser to re-check.

- 15/15 computed-style assertions held; nothing leaked through the fence
- 7 wrappers, **0 duplicate ids**
- All 79 sprite refs resolve across block boundaries (sprite in block 1, uses in 2–7)
- Block 7's script drives block 6's FAQ: single-open, `aria-expanded` tracks state
- Block 7's media queries reach blocks 1–6: single column at 390px, no overflow
- All 22 scroll reveals fire; `is-ready` reaches 7/7 wrappers
- WhatsApp CTAs in blocks 1, 3 and 7 all push `whatsapp_click` to `dataLayer`
- Zoho action unchanged, 15 named fields intact, phone still `required`

## Regenerating

The embed is generated from the React page and will drift if you edit the JSX or
CSS without rebuilding.

```bash
npm run build:webflow
```

- [build/css.mjs](build/css.mjs) — namespaces and fences the stylesheet, splits it into per-section chunks
- [build/html.mjs](build/html.mjs) — renders each section from the same data arrays as the JSX
- [build/index.mjs](build/index.mjs) — groups sections into blocks, writes `preview.html`, enforces the 50,000-char limit

The build fails loudly if a CSS chunk is never shipped or a block goes over the
limit, so a section can't silently lose its styles.

Copy lives in the data arrays at the top of `build/html.mjs`. Keep them in sync
with the JSX, or edit the JSX and re-run the build.

## Assets

Client logos load from `https://accounting.finanshels.co/clients/*` (verified
200). They render in full brand colour on the cream canvas. If that host moves,
change `ASSETS` in `build/html.mjs`.

## Not included

- `<Seo />` — set title, description and canonical in Webflow's Page Settings.
- The `AccountingService` JSON-LD was dropped; add it only if your home page
  doesn't already declare an `AccountingService` or `LocalBusiness` schema.
- In-page anchors were renamed `#fsai-consultation` / `#fsai-pricing` /
  `#fsai-services` / `#fsai-testimonials` / `#fsai-faq` so they can't collide
  with ids already on the home page. Point Webflow nav links at those.
