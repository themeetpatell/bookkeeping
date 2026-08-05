/**
 * Assembles the Webflow embed blocks.
 *
 * Each block is a self-contained Code Embed: its own <style> plus its own
 * markup, wrapped in `.fsai-root`. The CSS is partitioned across the blocks
 * (not duplicated), so all blocks must be present and in order — the last one
 * carries the animations, media queries and the script.
 */
import { readdirSync, rmSync, writeFileSync } from 'node:fs';
import { buildCssChunks } from './css.mjs';
import { SECTIONS, SPRITE } from './html.mjs';

const DIR = new URL('../', import.meta.url).pathname.replace(/\/$/, '');
const WEBFLOW_EMBED_LIMIT = 50000;

/** Sections grouped into one embed each. Order is the page order. */
const BLOCKS = [
  { name: 'hero', title: 'Hero + client logos', sections: ['hero', 'logos'], sprite: true },
  { name: 'manifesto', title: 'Why AI-native + comparison', sections: ['manifesto', 'compare'] },
  { name: 'workflow', title: 'WhatsApp strip + how it works', sections: ['lead-strip', 'workflow'] },
  { name: 'dashboard', title: 'Findelivery dashboard', sections: ['dashboard'] },
  { name: 'services', title: 'AI/human split + services', sections: ['split', 'services'] },
  { name: 'social-proof', title: 'Testimonials + FAQ', sections: ['testimonials', 'faq'] },
  { name: 'cta', title: 'Final CTA + form', sections: ['cta'], script: true },
];

const SCRIPT = `  <script>
  (function () {
    'use strict';

    function init() {
      var roots = document.querySelectorAll('.fsai-root');
      if (!roots.length) return;

      /* ---------- scroll reveal ----------
         The hidden state is gated behind \`is-ready\`, added here, so the page
         renders fully visible if this script never runs. */
      var targets = document.querySelectorAll('.fsai-root [data-reveal], .fsai-root [data-reveal-stagger]');
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      Array.prototype.forEach.call(roots, function (root) {
        root.classList.add('is-ready');
      });

      if (reduced || !('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
      } else {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

        Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });
      }

      /* ---------- FAQ accordion (single-open) ---------- */
      var items = document.querySelectorAll('.fsai-root .fsai-faq-item');
      Array.prototype.forEach.call(items, function (item) {
        var button = item.querySelector('.fsai-faq-question');
        if (!button) return;

        button.addEventListener('click', function () {
          var willOpen = !item.classList.contains('is-open');

          Array.prototype.forEach.call(items, function (other) {
            other.classList.remove('is-open');
            var otherButton = other.querySelector('.fsai-faq-question');
            if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
          });

          if (willOpen) {
            item.classList.add('is-open');
            button.setAttribute('aria-expanded', 'true');
          }
        });
      });

      /* ---------- WhatsApp click tracking (GTM dataLayer) ---------- */
      document.addEventListener('click', function (event) {
        if (!event.target.closest) return;
        var link = event.target.closest('.fsai-root [data-fsai-wa]');
        if (!link) return;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'whatsapp_click',
          source: link.getAttribute('data-fsai-wa')
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  </script>`;

const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
`;

const header = (index, block, total, extraNote) => `<!-- ==========================================================================
     FINANSHELS · AI-NATIVE ACCOUNTING — BLOCK ${index + 1} of ${total}: ${block.title.toUpperCase()}

     Paste into its own Webflow HTML Embed element, in order.
     Self-contained: this block carries the CSS for its own sections.

     ORDER MATTERS — the CSS is split across the blocks, not repeated. Block
     ${total} holds the animations and all media queries, so every block must be
     present and in sequence or the responsive rules won't apply.

     Place each embed in a Section with no padding. Do NOT put a block inside a
     Webflow Form Block — block ${total} contains its own <form>.${extraNote}
     ========================================================================== -->
`;

const cssChunks = buildCssChunks();
const sectionByKey = new Map(SECTIONS.map((section) => [section.key, section]));
const usedCss = new Set();

const rendered = BLOCKS.map((block, index) => {
  const sections = block.sections.map((key) => {
    const section = sectionByKey.get(key);
    if (!section) throw new Error(`Unknown section: ${key}`);
    return section;
  });

  // Block 1 also carries the shared BASE chunk (tokens, reset, buttons, reveal).
  const chunkNames = index === 0 ? ['BASE'] : [];
  sections.forEach((section) => chunkNames.push(...section.css));

  const css = chunkNames
    .map((name) => {
      if (!cssChunks.has(name)) throw new Error(`Unknown CSS chunk: ${name}`);
      usedCss.add(name);
      return cssChunks.get(name);
    })
    .join('\n');

  const notes = [];
  if (block.sprite) notes.push('\n     Also defines the icon sprite every later block references — this one\n     must be on the page.');
  if (block.script) notes.push('\n     Also carries the script (FAQ accordion, scroll reveals, WhatsApp tracking).');

  const body = [
    header(index, block, BLOCKS.length, notes.join('')),
    index === 0 ? FONT_LINKS : '',
    '<style>',
    css.trimEnd(),
    '</style>',
    '',
    '<div class="fsai-root">',
    block.sprite ? `\n  <!-- Icon sprite: defined once, referenced by every <use> on the page. -->\n${SPRITE}\n` : '',
    sections.map((section) => section.html).join('\n\n'),
    block.script ? `\n${SCRIPT}` : '',
    '</div>',
    '',
  ]
    .filter((part) => part !== '')
    .join('\n');

  return { ...block, index, body, filename: `block-${index + 1}-${block.name}.html` };
});

/* Fail loudly rather than silently shipping a stylesheet with holes in it. */
const orphaned = [...cssChunks.keys()].filter((name) => !usedCss.has(name));
if (orphaned.length) {
  throw new Error(`CSS chunks never shipped: ${orphaned.join(', ')}`);
}

readdirSync(DIR)
  .filter((file) => /^(block-|\d-|preview\.html$|_styles)/.test(file))
  .forEach((file) => rmSync(`${DIR}/${file}`, { force: true }));

rendered.forEach((block) => writeFileSync(`${DIR}/${block.filename}`, block.body, 'utf8'));

/* ---------- local preview: all blocks against a hostile host stylesheet ---------- */
const preview = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Finanshels AI Accounting — Webflow embed preview</title>

<!-- Simulates hostile Webflow-style globals to prove the cascade fence holds. -->
<style>
  body { font-family: Georgia, serif; font-size: 14px; line-height: 20px; color: #333; margin: 0; background: #fff; }
  h1, h2, h3 { font-family: "Comic Sans MS", cursive; color: hotpink; margin: 40px; }
  p, li, span, dt, dd { color: teal; letter-spacing: 3px; }
  a { color: red; text-decoration: underline; }
  img, svg { max-width: 100%; border: 4px dotted lime; vertical-align: middle; }
  ul, ol { padding-left: 60px; list-style: square; }
  button, input { font-family: monospace; background: yellow; border: 3px solid blue; }
  section, article, figure { outline: 1px solid rgba(255,0,0,.15); }
</style>
</head>
<body>
<div style="padding:24px;font:14px/1.5 system-ui">
  ↑ Hostile CSS above is OUTSIDE the embeds. Nothing below should inherit
  Comic Sans, hotpink, teal, lime borders or the yellow inputs.
</div>

${rendered.map((block) => block.body).join('\n')}
</body>
</html>
`;
writeFileSync(`${DIR}/preview.html`, preview, 'utf8');

let failed = false;
rendered.forEach((block) => {
  const chars = block.body.length;
  const over = chars > WEBFLOW_EMBED_LIMIT;
  if (over) failed = true;
  console.log(
    `${block.filename.padEnd(30)} ${chars.toLocaleString().padStart(7)} chars  ${over ? '✗ OVER LIMIT' : '✓'}`,
  );
});
console.log(`\nWebflow HTML Embed limit: ${WEBFLOW_EMBED_LIMIT.toLocaleString()} chars per element`);
console.log(`Total: ${rendered.reduce((sum, b) => sum + b.body.length, 0).toLocaleString()} chars across ${rendered.length} blocks`);

if (failed) {
  process.exitCode = 1;
}
