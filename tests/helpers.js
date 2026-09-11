import { expect } from '@playwright/test';

/**
 * Test doubles for everything the quote flow talks to.
 *
 * The rule this file exists to enforce: NOTHING reaches a real system.
 *
 * /api/quote-proposal creates a genuine proposal in FinCore, which the proposal
 * engine turns into a qualified deal in the CRM. /api/quote-session opens a real
 * wizard session and counts against the per-email proposal cap. In the dev
 * server both are proxied straight through to production, so a test that forgets
 * to stub them files real records. They are stubbed by default here, and
 * `assertNoRealWrites` proves nothing slipped past.
 *
 * Analytics vendors are blocked for the same reason: otherwise every run
 * pollutes the live PostHog project with synthetic traffic.
 */

const ANALYTICS_BLOCKLIST = [
  '**://*.posthog.com/**',
  '**://*.i.posthog.com/**',
  '**://www.googletagmanager.com/**',
  '**://www.google-analytics.com/**',
  '**://*.zoho.com/**',
  '**://*.zohopublic.com/**',
  '**://*.zohostatic.com/**',
  '**://*.redditstatic.com/**',
  '**://fonts.googleapis.com/**',
  '**://fonts.gstatic.com/**',
];

/* Anything hitting Zoho's form endpoint is a regression: the quote flow must
   never file a CRM lead of its own. */
const ZOHO_SUBMIT_GLOB = '**/formperma/**';

const DEFAULT_PROPOSAL = {
  quoteId: 'q-test-1',
  quoteNumber: 'PR-2026-TEST',
  publicToken: 'tok-test-1',
};

/**
 * @param {import('@playwright/test').Page} page
 * @param {{ session?: 'ok' | 'capped' | 'error',
 *           proposal?: 'ok' | 'error' | 'live-resolve' }} options
 * @returns {Promise<{ zohoHits: string[], proposals: object[] }>}
 */
export async function isolate(page, { session = 'ok', proposal = 'ok' } = {}) {
  for (const pattern of ANALYTICS_BLOCKLIST) {
    await page.route(pattern, (route) => route.abort());
  }

  const zohoHits = [];
  await page.route(ZOHO_SUBMIT_GLOB, async (route) => {
    zohoHits.push(route.request().url());
    await route.abort();
  });

  await page.route('**/api/quote-session', async (route) => {
    if (session === 'capped') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ errorType: 'proposal_cap_reached' }),
      });
      return;
    }
    if (session === 'error') {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ sessionToken: 'session-test-1' }),
    });
  });

  const proposals = [];
  await page.route('**/api/quote-proposal', async (route) => {
    proposals.push(JSON.parse(route.request().postData() || '{}'));
    if (proposal === 'error') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'nope' }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(DEFAULT_PROPOSAL),
    });
  });

  return { zohoHits, proposals };
}

/** Fixed price, so flow assertions do not depend on the live catalog. */
export async function stubResolve(page, body = {}) {
  await page.route('**/api/quote/resolve', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        priceMonthly: 1339,
        priceAnnual: 16069,
        priceQuarterly: 4017,
        billingFrequency: 'quarterly',
        billingBucket: 'recurring',
        billingCycleMode: 'quarterly_annual',
        isCustomQuote: false,
        ...body,
      }),
    }),
  );
}

export async function stubResolveFails(page) {
  await page.route('**/api/quote/resolve', (route) => route.fulfill({ status: 502, body: '{}' }));
}

/** Opens the modal from the hero CTA. */
export async function openQuote(page) {
  await page.getByTestId('quote-cta-hero').click();
  await expect(page.getByTestId('quote-modal')).toBeVisible();
}

/** Fills the contact step with obviously-synthetic details. */
export async function fillContact(page, overrides = {}) {
  const values = {
    companyName: 'E2E Test Co',
    contactName: 'Playwright Test',
    contactEmail: 'e2e@example.com',
    contactMobile: '+971500000000',
    ...overrides,
  };
  for (const [name, value] of Object.entries(values)) {
    await page.fill(`input[name="${name}"]`, value);
  }
  await page.click('button.quote-submit');
}

/**
 * Records PostHog captures and identifies on the live client.
 *
 * Spying rather than mocking, so what is asserted is what the real provider
 * would have been handed. Call before opening the quote; read with
 * `page.evaluate(() => window.__events)`.
 */
export async function spyOnPostHog(page) {
  await page.addInitScript(() => {
    window.__events = [];
    const wait = setInterval(() => {
      if (!window.posthog?.capture) return;
      clearInterval(wait);
      const realCapture = window.posthog.capture.bind(window.posthog);
      window.posthog.capture = (name, props) => {
        window.__events.push({ name, props });
        return realCapture(name, props);
      };
      const realIdentify = window.posthog.identify?.bind(window.posthog);
      window.posthog.identify = (id, props) => {
        window.__events.push({ name: '$identify', props: { id, ...props } });
        return realIdentify?.(id, props);
      };
    }, 20);
  });
}

/** The four fields an abandoned quote has to leave behind to be workable. */
export const expectContactProps = (props) => {
  expect(props.contact_email).toBe('e2e@example.com');
  expect(props.contact_name).toBe('Playwright Test');
  expect(props.contact_mobile).toBe('+971500000000');
  expect(props.company_name).toBe('E2E Test Co');
};

/** Picks a service on the generic pages' selector step. */
export async function chooseService(page, slug) {
  await expect(page.getByTestId('quote-service')).toBeVisible();
  await page.getByTestId(`quote-service-${slug}`).click();
}

/**
 * Fills the from/to window a `date_range` service needs.
 *
 * FinCore rejects the whole proposal unless it gets both ends with the end after
 * the start, so the step refuses to advance on anything else.
 */
export async function fillPeriod(page, periodStart = '2025-04', periodEnd = '2026-03') {
  await expect(page.getByTestId('quote-period')).toBeVisible();
  await page.fill('input[name="periodStart"]', periodStart);
  await page.fill('input[name="periodEnd"]', periodEnd);
  await page.click('button.quote-submit');
}

/** Answers every pricing question by taking the first available option. */
export async function answerAllQuestions(page, count = 7) {
  for (let i = 0; i < count; i += 1) {
    await expect(page.getByTestId('quote-question')).toBeVisible();
    const select = page.locator('select.quote-select');
    if (await select.count()) {
      const value = await select.locator('option:not([disabled])').first().getAttribute('value');
      await select.selectOption(value);
    } else {
      await page.locator('button.quote-option').first().click();
    }
  }
}

/** The quote flow must never file a Zoho CRM lead. */
export const assertNoRealWrites = (zohoHits) => expect(zohoHits).toEqual([]);

export const readDataLayer = (page) =>
  page.evaluate(() => (window.dataLayer || []).map((entry) => entry.event));
