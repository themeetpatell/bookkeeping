/**
 * Assembles the Webflow embed blocks for the pricing page.
 *
 * Output lands in webflow-embed/pricing/ so it can't be confused with the
 * AI-accounting blocks, which use a different namespace and a different page.
 */
import { mkdirSync } from 'node:fs';
import { assemble } from './assemble.mjs';
import { PRICING_PAGE, buildCssChunks } from './css.mjs';
import { SECTIONS, SYMBOLS } from './pricing-html.mjs';

const DIR = new URL('../pricing/', import.meta.url).pathname.replace(/\/$/, '');
mkdirSync(DIR, { recursive: true });

/** Sections grouped into one embed each. Order is the page order. */
const BLOCKS = [
  { name: 'hero-plans', title: 'Hero + client logos + plan cards', sections: ['hero', 'logos', 'plans'], sprite: true },
  { name: 'compare', title: 'Plan comparison + what every plan includes', sections: ['compare', 'assurance', 'included'] },
  { name: 'addons', title: 'Add-on services', sections: ['addons'] },
  { name: 'alternatives', title: 'Ways to run finance', sections: ['alternatives'] },
  { name: 'process', title: 'How it works + testimonials', sections: ['process', 'voices'] },
  /* FAQ and the quote form used to share an embed; the grouped accordion and
     the "what you get" copy pushed the pair past Webflow's 50k limit. */
  { name: 'faq', title: 'FAQs', sections: ['faq'] },
  { name: 'cta', title: 'Quote form', sections: ['cta'], script: true },
];

const SCRIPT = `  <script>
  (function () {
    'use strict';

    function init() {
      var roots = document.querySelectorAll('.fspr-root');
      if (!roots.length) return;

      /* ---------- scroll reveal ----------
         The hidden state is gated behind \`is-ready\`, added here, so the page
         renders fully visible if this script never runs. */
      var targets = document.querySelectorAll('.fspr-root [data-reveal], .fspr-root [data-reveal-stagger]');
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
      var items = document.querySelectorAll('.fspr-root .fspr-faq-item');
      Array.prototype.forEach.call(items, function (item) {
        var button = item.querySelector('.fspr-faq-question');
        if (!button) return;

        button.addEventListener('click', function () {
          var willOpen = !item.classList.contains('is-open');

          Array.prototype.forEach.call(items, function (other) {
            other.classList.remove('is-open');
            var otherButton = other.querySelector('.fspr-faq-question');
            if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
          });

          if (willOpen) {
            item.classList.add('is-open');
            button.setAttribute('aria-expanded', 'true');
          }
        });
      });

      /* ---------- Plan switcher ----------
         CSS only acts on \`is-active\` below 760px, so this can run at every
         width without affecting the desktop three-up grid. */
      var switchEl = document.querySelector('.fspr-root .fspr-plan-switch');
      if (switchEl) {
        var tabs = switchEl.querySelectorAll('.fspr-plan-switch-btn');
        var cards = document.querySelectorAll('.fspr-root .fspr-plan');

        var selectPlan = function (index) {
          Array.prototype.forEach.call(tabs, function (tab, i) {
            var on = i === index;
            tab.classList.toggle('is-active', on);
            tab.setAttribute('aria-selected', on ? 'true' : 'false');
          });
          Array.prototype.forEach.call(cards, function (card, i) {
            card.classList.toggle('is-active', i === index);
          });
        };

        Array.prototype.forEach.call(tabs, function (tab, i) {
          tab.addEventListener('click', function () { selectPlan(i); });
        });
      }

      /* ---------- Comparison table: sideways-scroll affordance ---------- */
      var scroller = document.querySelector('.fspr-root .fspr-compare-scroll-inner');
      if (scroller && scroller.parentNode) {
        var shell = scroller.parentNode;
        var syncScroll = function () {
          var more = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 2;
          shell.classList.toggle('has-more', more);
        };
        scroller.addEventListener('scroll', syncScroll, { passive: true });
        window.addEventListener('resize', syncScroll);
        syncScroll();
      }

      /* ---------- Testimonial rail ----------
         The rail scrolls natively; this only adds the arrow buttons and the
         progress bar on top of it. Everything here is progressive: without
         JS the rail is still swipeable and keyboard-scrollable. */
      var rail = document.querySelector('.fspr-root .fspr-voices-rail');
      if (rail) {
        var prevBtn = document.querySelector('.fspr-root [data-fspr-voices="prev"]');
        var nextBtn = document.querySelector('.fspr-root [data-fspr-voices="next"]');
        var bar = document.querySelector('.fspr-root .fspr-voices-progress i');
        var firstCard = rail.querySelector('.fspr-voice');

        var railStep = function () {
          if (!firstCard) return rail.clientWidth * 0.8;
          // One card plus the flex gap.
          return firstCard.getBoundingClientRect().width + 16;
        };

        var syncRail = function () {
          var max = rail.scrollWidth - rail.clientWidth;
          var left = rail.scrollLeft;

          if (prevBtn) prevBtn.disabled = left <= 2;
          if (nextBtn) nextBtn.disabled = left >= max - 2;

          if (bar) {
            var ratio = rail.scrollWidth > 0 ? rail.clientWidth / rail.scrollWidth : 1;
            var travel = (1 - ratio) * 100;
            var progress = max > 0 ? left / max : 0;
            bar.style.width = (ratio * 100) + '%';
            bar.style.transform = 'translateX(' + ((travel * progress) / ratio) + '%)';
          }
        };

        var nudge = function (direction) {
          rail.scrollBy({ left: direction * railStep(), behavior: reduced ? 'auto' : 'smooth' });
        };

        if (prevBtn) prevBtn.addEventListener('click', function () { nudge(-1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { nudge(1); });

        rail.addEventListener('scroll', syncRail, { passive: true });
        window.addEventListener('resize', syncRail);
        syncRail();
      }

      /* ---------- Sticky quote bar ----------
         Rides along past the hero and retracts once the real form is on
         screen, so the two asks never compete. */
      var sticky = document.querySelector('.fspr-root [data-fspr-sticky]');
      if (sticky) {
        var quote = document.getElementById('fspr-quote');
        var ticking = false;

        var syncSticky = function () {
          ticking = false;
          var past = (window.pageYOffset || document.documentElement.scrollTop) > 520;
          var formInView = false;

          if (quote) {
            var box = quote.getBoundingClientRect();
            formInView = box.top < window.innerHeight * 0.85 && box.bottom > 0;
          }

          sticky.classList.toggle('is-visible', past && !formInView);
        };

        var requestSync = function () {
          if (ticking) return;
          ticking = true;
          window.requestAnimationFrame(syncSticky);
        };

        window.addEventListener('scroll', requestSync, { passive: true });
        window.addEventListener('resize', requestSync);
        syncSticky();
      }

      /* ---------- WhatsApp click tracking (GTM dataLayer) ---------- */
      document.addEventListener('click', function (event) {
        if (!event.target.closest) return;
        var link = event.target.closest('.fspr-root [data-fspr-wa]');
        if (!link) return;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'whatsapp_click',
          source: link.getAttribute('data-fspr-wa')
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
  ns: PRICING_PAGE,
  dir: DIR,
  pageLabel: 'ACCOUNTING PACKAGES / PRICING',
  previewTitle: 'Finanshels Pricing — Webflow embed preview',
  blocks: BLOCKS,
  sections: SECTIONS,
  symbols: SYMBOLS,
  script: SCRIPT,
  cssChunks: buildCssChunks(PRICING_PAGE),
});

if (!ok) {
  process.exitCode = 1;
}
