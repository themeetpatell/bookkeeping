import { test, expect } from '@playwright/test';
import {
  isolate,
  stubResolve,
  stubResolveFails,
  openQuote,
  fillContact,
  answerAllQuestions,
  chooseService,
  fillPeriod,
  spyOnPostHog,
  expectContactProps,
  assertNoRealWrites,
  readDataLayer,
} from './helpers';

const PAGE = '/bookkeeping';

test('the hero keeps its lead form and gains a Generate Quote CTA', async ({ page }) => {
  await isolate(page);
  await page.goto(PAGE);

  // The existing form is untouched — the CTA is an additional path, not a swap.
  await expect(page.locator('#zoho-consultation-hero')).toBeVisible();
  await expect(page.getByTestId('quote-cta-hero')).toBeVisible();
  await expect(page.getByTestId('quote-modal')).toHaveCount(0);
});

test('?quote=open lands the visitor straight in the dialog', async ({ page }) => {
  await isolate(page);
  await page.goto(`${PAGE}?quote=open`);

  await expect(page.getByTestId('quote-modal')).toBeVisible();
  // The hero form is still behind it — the dialog is an extra path, not a swap.
  await expect(page.locator('#zoho-consultation-hero')).toHaveCount(1);
});

test('no quote param leaves the page closed', async ({ page }) => {
  await isolate(page);
  await page.goto(`${PAGE}?quote=1`);
  await expect(page.getByTestId('quote-modal')).toHaveCount(0);
});

test('the CTA opens the quote modal', async ({ page }) => {
  await isolate(page);
  await page.goto(PAGE);
  await openQuote(page);
  await expect(page.locator('input[name="contactEmail"]')).toBeVisible();
});

test('the modal closes on escape, on the backdrop and on the close button', async ({ page }) => {
  await isolate(page);
  await page.goto(PAGE);

  await openQuote(page);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('quote-modal')).toHaveCount(0);

  await openQuote(page);
  await page.getByTestId('quote-modal-close').click();
  await expect(page.getByTestId('quote-modal')).toHaveCount(0);

  await openQuote(page);
  await page.getByTestId('quote-modal').click({ position: { x: 5, y: 5 } });
  await expect(page.getByTestId('quote-modal')).toHaveCount(0);
});

test('invalid contact details never start a quote', async ({ page }) => {
  const { proposals } = await isolate(page);
  await page.goto(PAGE);
  await openQuote(page);

  await page.click('button.quote-submit');
  await expect(page.locator('.quote-field-error').first()).toBeVisible();

  await fillContact(page, { contactEmail: 'not-an-email' });
  await expect(page.locator('.quote-field-error').first()).toBeVisible();
  await expect(page.getByTestId('quote-question')).toHaveCount(0);
  expect(proposals).toHaveLength(0);
});

test('a capped email is told before answering any questions', async ({ page }) => {
  await isolate(page, { session: 'capped' });
  await page.goto(PAGE);
  await openQuote(page);
  await fillContact(page);

  await expect(page.getByTestId('quote-capped')).toBeVisible();
  await expect(page.getByTestId('quote-question')).toHaveCount(0);
});

test('the full path prices and files a proposal', async ({ page }) => {
  const { proposals, zohoHits } = await isolate(page);
  await stubResolve(page);

  await page.goto(PAGE);
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page);

  const result = page.getByTestId('quote-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('AED 1,339');
  await expect(result).toContainText('PR-2026-TEST');

  /* The proposal is only worth creating if the customer can reach it: from
     /q/{token} they read the scope, pay by card and sign the engagement
     letter. */
  const link = page.getByTestId('quote-proposal-link');
  await expect(link).toHaveAttribute('href', 'https://fincore.finanshels.com/q/tok-test-1');
  await expect(link).toHaveAttribute('target', '_blank');

  expect(proposals).toHaveLength(1);
  const sent = proposals[0];
  expect(sent.contactEmail).toBe('e2e@example.com');
  expect(sent.companyName).toBe('E2E Test Co');
  // quarterly_annual is sold quarterly, and totals carry 5% VAT.
  expect(sent.billingCycle).toBe('quarterly');
  expect(sent.subtotal).toBe(4017);
  expect(sent.total).toBeCloseTo(4017 * 1.05, 2);
  expect(sent.lineItems).toHaveLength(1);
  /* Every answer reaches the proposal — including the two that do not move the
     price. An answer the advisor never sees is an answer not worth asking for. */
  expect(sent.lineItems[0].pathSnapshot).toHaveLength(7);
  /* A start_only service without a period gets the whole proposal rejected with
     a 400 — "The following services require a start period before this proposal
     can be saved". Regression guard. */
  expect(sent.lineItems[0].periodStart).toMatch(/^\d{4}-\d{2}$/);

  assertNoRealWrites(zohoHits);
});

/* The instruction this guards: the quote flow must not create a CRM lead of its
   own. The proposal engine raises the qualified deal, and a Zoho Forms post
   from here would file a duplicate against the same person. */
test('the quote flow never posts to Zoho', async ({ page }) => {
  const { zohoHits } = await isolate(page);
  await stubResolve(page);

  await page.goto(PAGE);
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page);
  await expect(page.getByTestId('quote-result')).toBeVisible();

  assertNoRealWrites(zohoHits);
  const events = await readDataLayer(page);
  expect(events).not.toContain('zf_submitform');
  expect(events).not.toContain('consultation_form_ec');
  expect(events).toContain('quote_proposal_created');
});

test('a failed proposal save shows the price but promises no callback', async ({ page }) => {
  await isolate(page, { proposal: 'error' });
  await stubResolve(page);

  await page.goto(PAGE);
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page);

  const result = page.getByTestId('quote-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('AED 1,339');
  // The component renders a typographic apostrophe, so match loosely.
  await expect(result).toContainText(/couldn.t save/);
  await expect(result).not.toContainText('PR-2026-TEST');
  // No proposal means no link to one — never a dead CTA.
  await expect(page.getByTestId('quote-proposal-link')).toHaveCount(0);
});

test('a pricing failure degrades to a contact route', async ({ page }) => {
  await isolate(page);
  await stubResolveFails(page);

  await page.goto(PAGE);
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page);

  await expect(page.getByTestId('quote-failed')).toBeVisible();
});

test('a custom quote is shown as custom, never as a number', async ({ page }) => {
  await isolate(page);
  await stubResolve(page, { isCustomQuote: true, priceMonthly: 0 });

  await page.goto(PAGE);
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page);

  const result = page.getByTestId('quote-result');
  await expect(result).toContainText('Custom quote');
  await expect(result).not.toContainText('AED 0');
});

/* Hits the REAL FinCore pricing catalog through the proxy. The session and
   proposal endpoints stay stubbed — this must never file a real proposal.

     npx playwright test --grep @live */
test('@live prices a real path against the live catalog', async ({ page }) => {
  await isolate(page);

  await page.goto(PAGE);
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page);

  const result = page.getByTestId('quote-result');
  await expect(result).toBeVisible({ timeout: 20000 });
  await expect(result).toContainText(/AED [\d,]+|Custom quote/);
});

/* The catch-up service is `date_range` and hidden from /services. Its questions
   and prices come from the live catalog here; only the writes stay stubbed. */
test('@live prices the catch-up service with a real window', async ({ page }) => {
  const { proposals } = await isolate(page);

  await page.goto('/books-cleanup');
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page, 3);
  await fillPeriod(page, '2025-04', '2026-03');

  const result = page.getByTestId('quote-result');
  await expect(result).toBeVisible({ timeout: 20000 });
  await expect(result).toContainText(/AED [\d,]+|Custom quote/);
  expect(proposals[0].lineItems[0].periodStart).toBe('2025-04');
  expect(proposals[0].lineItems[0].periodEnd).toBe('2026-03');
});

/* Finance Operations is showInCatalog:false. This is the check that /resolve
   still serves it — if FinCore ever closes that door, /payroll-accounting stops
   pricing and this is what says so. */
test('@live prices the hidden finance operations service', async ({ page }) => {
  await isolate(page);

  await page.goto('/payroll-accounting');
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page, 1);

  const result = page.getByTestId('quote-result');
  await expect(result).toBeVisible({ timeout: 20000 });
  await expect(result).toContainText(/AED [\d,]+|Custom quote/);
});

/* Every service in the generic chooser has to price, not just the first one. A
   stale option id returns a wrong price rather than an error, so this walks the
   whole list against the live catalog. */
for (const slug of [
  'accounting-bookkeeping',
  'vat-filing',
  'vat-registration',
  'corporate-tax-filing',
  'corporate-tax-registration',
  'audit-services',
  'aml-compliance',
  'dedicated-remote-accountant',
]) {
  test(`@live the chooser prices ${slug} against the live catalog`, async ({ page }) => {
    await isolate(page);

    await page.goto('/');
    await openQuote(page);
    await fillContact(page);
    await chooseService(page, slug);

    /* Answer until the flow leaves the questions. The count differs per service
       and is exactly the thing the sync script owns, so it is not restated. */
    for (let i = 0; i < 12; i += 1) {
      if (!(await page.getByTestId('quote-question').isVisible().catch(() => false))) break;
      const select = page.locator('select.quote-select');
      if (await select.count()) {
        const value = await select.locator('option:not([disabled])').first().getAttribute('value');
        await select.selectOption(value);
      } else {
        await page.locator('button.quote-option').first().click();
      }
    }

    const result = page.getByTestId('quote-result');
    await expect(result).toBeVisible({ timeout: 20000 });
    await expect(result).toContainText(/AED [\d,]+|Custom quote/);
  });
}

/* ── The other landing pages ─────────────────────────────────────────────────
   Every page below gained the same quote path and kept its own lead form. The
   plan differs because the service differs: a page must quote what it sells. */

test('the generic home page asks which service before pricing anything', async ({ page }) => {
  const { proposals, zohoHits } = await isolate(page);
  await stubResolve(page);

  await page.goto('/');
  await openQuote(page);
  await fillContact(page);

  /* Contact first, then the choice — the proposal engine cannot mint an
     anonymous proposal, and the cap gate has to run before anything else. */
  await chooseService(page, 'accounting-bookkeeping');
  await answerAllQuestions(page, 7);

  await expect(page.getByTestId('quote-result')).toBeVisible();
  expect(proposals).toHaveLength(1);
  expect(proposals[0].lineItems[0].serviceId).toBe('91ba4950-e80f-4010-bc74-d3482bc38f95');
  assertNoRealWrites(zohoHits);
});

/* Single-select, deliberately: FinCore switches to /combo/detect the moment more
   than one service is in play, and this client implements no combo pricing, so a
   multi-select would post a total that is simply wrong. */
test('the service step prices exactly one service', async ({ page }) => {
  const { proposals } = await isolate(page);
  await stubResolve(page);

  await page.goto('/');
  await openQuote(page);
  await fillContact(page);
  await chooseService(page, 'corporate-tax-registration');
  await answerAllQuestions(page, 1);

  await expect(page.getByTestId('quote-result')).toBeVisible();
  expect(proposals[0].lineItems).toHaveLength(1);
  expect(proposals[0].lineItems[0].serviceName).toBe('Corporate Tax Registration');
  // periodType "none" — no period fields at all, and none invented.
  expect(proposals[0].lineItems[0].periodStart).toBeNull();
  expect(proposals[0].lineItems[0].periodEnd).toBeNull();
});

test('changing service discards the previous answers', async ({ page }) => {
  const { proposals } = await isolate(page);
  await stubResolve(page);

  await page.goto('/');
  await openQuote(page);
  await fillContact(page);

  await chooseService(page, 'vat-filing');
  await answerAllQuestions(page, 1);
  /* Back through the first question, then out to the list. Only question one
     can leave the questions, and only when there was a list to go back to. */
  await page.locator('button.quote-back').click();
  await page.locator('button.quote-back').click();
  await chooseService(page, 'corporate-tax-registration');
  await answerAllQuestions(page, 1);

  await expect(page.getByTestId('quote-result')).toBeVisible();
  /* One answer, and it belongs to the service actually being priced. Carrying a
     VAT option id onto a Corporate Tax path would price the wrong thing. */
  expect(proposals[0].lineItems[0].pathSnapshot).toHaveLength(1);
  expect(proposals[0].lineItems[0].serviceName).toBe('Corporate Tax Registration');
});

/* /books-cleanup sells a retrospective engagement, so it is the one service with
   periodType "date_range". The window is the backlog being bought — it is asked
   for, never defaulted. */
test('the cleanup page asks for the catch-up window and sends both ends', async ({ page }) => {
  const { proposals, zohoHits } = await isolate(page);
  await stubResolve(page, {
    priceMonthly: 999,
    priceAnnual: 999,
    priceQuarterly: 0,
    billingFrequency: 'one_time',
    billingBucket: 'one_time',
    billingCycleMode: null,
  });

  await page.goto('/books-cleanup');
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page, 3);
  await fillPeriod(page, '2025-04', '2026-03');

  const result = page.getByTestId('quote-result');
  await expect(result).toBeVisible();
  /* A one-off engagement, so the price is the whole fee. Rendering it as
     "AED 999/month" would quote twelve times the real number. */
  await expect(result).toContainText('AED 999');
  await expect(result).toContainText('one-off');
  await expect(result).not.toContainText('/month');
  await expect(result).not.toContainText('Billed quarterly');

  expect(proposals).toHaveLength(1);
  const line = proposals[0].lineItems[0];
  expect(line.serviceId).toBe('d7ac6cee-d90c-4dcc-8920-459dc4a870ad');
  expect(line.periodStart).toBe('2025-04');
  expect(line.periodEnd).toBe('2026-03');
  /* A one-time service is billed once, never multiplied by the cycle. */
  expect(proposals[0].subtotal).toBe(999);
  assertNoRealWrites(zohoHits);
});

/* FinCore validates end > start and rejects the whole proposal otherwise — which
   would land after every question had been answered. The step refuses instead. */
test('an inverted catch-up window never reaches FinCore', async ({ page }) => {
  const { proposals } = await isolate(page);
  await stubResolve(page);

  await page.goto('/books-cleanup');
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page, 3);

  await page.fill('input[name="periodStart"]', '2026-03');
  await page.fill('input[name="periodEnd"]', '2025-04');
  await page.click('button.quote-submit');

  await expect(page.getByTestId('quote-period-error')).toBeVisible();
  await expect(page.getByTestId('quote-result')).toHaveCount(0);
  expect(proposals).toHaveLength(0);
});

test('an empty catch-up window never reaches FinCore', async ({ page }) => {
  const { proposals } = await isolate(page);
  await stubResolve(page);

  await page.goto('/books-cleanup');
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page, 3);
  await page.click('button.quote-submit');

  await expect(page.getByTestId('quote-period-error')).toBeVisible();
  expect(proposals).toHaveLength(0);
});

/* /payroll-accounting quotes Finance Operations (AR/AP & Payroll). That service
   is showInCatalog:false so it never appears in /services, but /questions/base
   and /resolve serve it normally — which is why the sync script declares its
   period type instead of looking it up. */
test('the payroll page quotes the finance operations service', async ({ page }) => {
  const { proposals, zohoHits } = await isolate(page);
  await stubResolve(page);

  await page.goto('/payroll-accounting');
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page, 1);

  await expect(page.getByTestId('quote-result')).toBeVisible();
  const line = proposals[0].lineItems[0];
  expect(line.serviceId).toBe('86dc56ed-c3d5-454d-8361-fe03526bdd64');
  // start_only — a missing start period gets the whole proposal rejected 400.
  expect(line.periodStart).toMatch(/^\d{4}-\d{2}$/);
  expect(line.periodEnd).toBeNull();
  assertNoRealWrites(zohoHits);
});

/* Rule 3: the quote is an ADDITIONAL path. Every page keeps the lead form it
   had, and none of them may file a CRM lead from the quote flow. */
const QUOTED_PAGES = [
  ['/', 'general'],
  ['/accounting-bing', 'general'],
  ['/bookkeeping', 'accounting'],
  ['/bookkeeping-bing', 'accounting'],
  ['/packages', 'accounting'],
  ['/packages-bing', 'accounting'],
  ['/books-cleanup', 'booksCleanup'],
  ['/books-cleanup-bing', 'booksCleanup'],
  ['/accounting-software', 'accounting'],
  ['/accounting-software-bing', 'accounting'],
  ['/payroll-accounting', 'payroll'],
  ['/payroll-accounting-bing', 'payroll'],
  ['/ai-accounting', 'accounting'],
  ['/accounting-form', 'general'],
  ['/accounting-form-reddit', 'general'],
  ['/accounting-whatsapp', 'general'],
];

for (const [path, plan] of QUOTED_PAGES) {
  test(`${path} offers the quote on the ${plan} plan and keeps its lead form`, async ({ page }) => {
    const { zohoHits } = await isolate(page);
    await page.goto(path);

    await expect(page.getByTestId('quote-cta-hero')).toBeVisible();
    /* The page's own lead capture is still there — the quote never replaced it.
       Most pages capture with a Zoho form; /accounting-whatsapp captures with
       the WhatsApp and booking buttons in the same hero card instead. */
    expect(await page.locator('form, .hero-form-card').count()).toBeGreaterThan(0);

    await openQuote(page);
    await expect(page.locator('.quote-generator')).toHaveAttribute('data-quote-plan', plan);
    assertNoRealWrites(zohoHits);
  });
}

/* Until the proposal is created, the contact details exist only in component
   state. If they are not on the analytics events, an abandoner leaves FinCore
   holding an email and nothing else — and the CRM mandates a phone number, so
   an email alone is not a workable lead. This is the recovery net; it must not
   rot silently. */
test('abandoned quotes stay recoverable — contact details ride every event', async ({ page }) => {
  await isolate(page);
  await stubResolve(page);

  await page.goto(PAGE);
  await page.addInitScript(() => {
    window.__events = [];
  });
  await page.reload();

  // Record captures on the live client rather than mocking the provider.
  await page.evaluate(() => {
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

  await openQuote(page);
  await fillContact(page);
  await expect(page.getByTestId('quote-question')).toBeVisible();

  const events = await page.evaluate(() => window.__events);
  const started = events.find((e) => e.name === 'quote_started');
  expect(started, 'quote_started must fire at contact submit').toBeTruthy();
  expect(started.props.contact_email).toBe('e2e@example.com');
  expect(started.props.contact_name).toBe('Playwright Test');
  expect(started.props.contact_mobile).toBe('+971500000000');
  expect(started.props.company_name).toBe('E2E Test Co');

  const identified = events.find((e) => e.name === '$identify');
  expect(identified, 'the visitor must be identified by email').toBeTruthy();
  expect(identified.props.id).toBe('e2e@example.com');
});

/* The selector path is a dead end like any other: on a generic page the visitor
   picks a service and then faces up to seven questions, so this is the last
   event before the longest stretch of the flow. Without the contact details on
   it, someone who stops there is an email with no phone — and the CRM mandates
   a phone number, so that is not a workable lead. */
test('a quote abandoned at the service step stays recoverable', async ({ page }) => {
  await isolate(page);
  await stubResolve(page);
  await spyOnPostHog(page);

  await page.goto('/');
  await openQuote(page);
  await fillContact(page);
  await chooseService(page, 'dedicated-remote-accountant');
  await expect(page.getByTestId('quote-question')).toBeVisible();

  const events = await page.evaluate(() => window.__events);

  const started = events.find((e) => e.name === 'quote_started');
  expect(started, 'quote_started must fire at contact submit').toBeTruthy();
  expectContactProps(started.props);

  const selected = events.find((e) => e.name === 'quote_service_selected');
  expect(selected, 'quote_service_selected must fire when a service is picked').toBeTruthy();
  expect(selected.props.service).toBe('dedicated-remote-accountant');
  expectContactProps(selected.props);

  const identified = events.find((e) => e.name === '$identify');
  expect(identified.props.id).toBe('e2e@example.com');

  /* Analytics only. The proposal engine files the deal; a second write from here
     would duplicate it against the same person. */
  expect(events.some((e) => e.name === 'consultation_form_ec')).toBe(false);
});
