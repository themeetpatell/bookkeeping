/**
 * Assembles the Webflow embed blocks.
 *
 * Each block is a self-contained Code Embed: its own <style> plus its own
 * markup, wrapped in `.fsai-root`. The CSS is partitioned across the blocks
 * (not duplicated), so all blocks must be present and in order — the last one
 * carries the animations, media queries and the script.
 */
import { assemble } from './assemble.mjs';
import { AI_PAGE, buildCssChunks } from './css.mjs';
import { SECTIONS, SYMBOLS } from './html.mjs';

const DIR = new URL('../', import.meta.url).pathname.replace(/\/$/, '');

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

const ok = assemble({
  ns: AI_PAGE,
  dir: DIR,
  pageLabel: 'AI-NATIVE ACCOUNTING',
  previewTitle: 'Finanshels AI Accounting — Webflow embed preview',
  blocks: BLOCKS,
  sections: SECTIONS,
  symbols: SYMBOLS,
  script: SCRIPT,
  cssChunks: buildCssChunks(AI_PAGE),
});

if (!ok) {
  process.exitCode = 1;
}
