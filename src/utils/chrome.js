// Routes that run "focused chrome": the site nav collapses to a logo and a
// single action, and the promotional strips above it are not rendered at all.
//
// These are paid-traffic landing pages where the first screen has to carry one
// decision. The offer bar and the trust bar each add a competing CTA and, on a
// 390x844 phone, 88px of the fold before the headline has started.
export const FOCUSED_CHROME_PATHS = ['/books-cleanup', '/books-cleanup-bing'];

export const isFocusedChrome = (pathname) => FOCUSED_CHROME_PATHS.includes(pathname);
