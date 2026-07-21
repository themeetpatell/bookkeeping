// PostHog client configuration.
//
// The project token below is a PUBLIC, client-side identifier (the `phc_`
// prefix marks a publishable key) — it is designed to ship in the browser
// bundle and is NOT a secret. We still read it from an env var first so it can
// be rotated or overridden per environment; the constant is only a fallback so
// analytics keep working on a deploy where the env var was not configured.
export const POSTHOG_KEY =
  import.meta.env.VITE_PUBLIC_POSTHOG_KEY ||
  'phc_saLqpV3uLmLXEqprdnXTpoFKyMp5hcZEnPXkYajpwzSk';

export const POSTHOG_HOST =
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

// `defaults` opts into PostHog's recommended config for this date, which
// includes automatic pageview capture on SPA history changes — so client-side
// route changes across the landing pages are tracked without manual calls.
export const posthogOptions = {
  api_host: POSTHOG_HOST,
  defaults: '2026-05-30',
};
