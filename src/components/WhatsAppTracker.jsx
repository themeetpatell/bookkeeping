import { useEffect } from 'react';

/* Binds the Gallabox WhatsApp tracker (loaded from index.html) to the React
   tree.

   The vendor script scans for its selector exactly once and binds a click
   handler to each link it finds. That snapshot is wrong on a SPA: every route
   change mounts new CTAs with no handler, so the click opens WhatsApp without
   the encoded source URL and the lead lands in Gallabox unattributed. Its own
   `refresh()`/`destroy()` are unreachable — the bundle overwrites its public
   API with `{ init }` — so re-scanning has to avoid double-binding by itself.

   Hence: `autoInit` is off in index.html and this component owns every bind. It
   marks each link it binds and only ever hands `init()` the unmarked ones, so a
   link that survives a route change is never bound twice (which would open two
   WhatsApp tabs per click). A MutationObserver covers both route changes and
   CTAs that render late (offer bar, floating buttons, anything conditional). */

const BOUND_ATTR = 'data-gbwa-bound';
const PENDING_SELECTOR = `.data-wa-track:not([${BOUND_ATTR}])`;

/* The vendor script is async and may be blocked outright by an ad blocker, so
   poll for it rather than assuming it is there — but give up eventually. */
const READY_POLL_MS = 400;
const READY_POLL_ATTEMPTS = 75; // ~30s

const isTrackerReady = () => !!(window.GBWATracker && window.GBWATracker.init);

function bindPendingLinks() {
  try {
    const pending = document.querySelectorAll(PENDING_SELECTOR);
    if (!pending.length) return;

    window.GBWATracker.init({ selector: PENDING_SELECTOR });
    pending.forEach((link) => link.setAttribute(BOUND_ATTR, ''));
  } catch {
    // Tracking must never break the page.
  }
}

export default function WhatsAppTracker() {
  useEffect(() => {
    let observer = null;
    let readyTimer = null;
    let frame = null;

    // React can churn the DOM many times per render; coalesce into one scan.
    const scheduleBind = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        bindPendingLinks();
      });
    };

    const watchForNewLinks = () => {
      bindPendingLinks();
      observer = new MutationObserver(scheduleBind);
      observer.observe(document.body, { childList: true, subtree: true });
    };

    if (isTrackerReady()) {
      watchForNewLinks();
    } else {
      let attempts = 0;
      readyTimer = setInterval(() => {
        attempts += 1;
        if (isTrackerReady()) {
          clearInterval(readyTimer);
          readyTimer = null;
          watchForNewLinks();
        } else if (attempts >= READY_POLL_ATTEMPTS) {
          clearInterval(readyTimer);
          readyTimer = null;
        }
      }, READY_POLL_MS);
    }

    return () => {
      if (readyTimer !== null) clearInterval(readyTimer);
      if (frame !== null) cancelAnimationFrame(frame);
      if (observer) observer.disconnect();
    };
  }, []);

  return null;
}
