// Routes that run "focused chrome": the site nav collapses to a logo and a
// single action, and the promotional strips above it are not rendered at all.
//
// These are paid-traffic landing pages where the first screen has to carry one
// decision. The offer bar and the trust bar each add a competing CTA and, on a
// 390x844 phone, 88px of the fold before the headline has started.
export const FOCUSED_CHROME_PATHS = [
  '/books-cleanup',
  '/books-cleanup-bing',
  // Bookkeeping_UAE_Search ad-group pages (src/pages/AdGroupLanding.jsx):
  // one primary CTA per page, so the nav CTA and promo strips are dropped.
  // /hire-accountant is deliberately NOT listed: marketing asked for the
  // section nav and the annual-plan offer bar on that page (2026-09-25).
  '/remote-bookkeeper',
  '/backlog-catch-up',
  '/outsource-accounting',
  '/accounting-services',
  '/accounting-firm',
  '/accounting-and-bookkeeping',
];

export const isFocusedChrome = (pathname) => FOCUSED_CHROME_PATHS.includes(pathname);

// Routes that keep the section nav and the offer bar but in a quieter form:
// the offer bar loses its pill badge and green button (the offer becomes a
// text link), the trust strip is dropped, and the nav keeps its section
// links without the "Book a Free Call" button. Asked for by marketing on
// /hire-accountant (2026-09-25): pill-shaped labels that are not buttons were
// pulling attention away from the form and the page's own CTAs.
export const QUIET_CHROME_PATHS = ['/hire-accountant'];

export const isQuietChrome = (pathname) => QUIET_CHROME_PATHS.includes(pathname);
