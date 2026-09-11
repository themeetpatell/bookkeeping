import { test } from '@playwright/test';
import {
  isolate,
  stubResolve,
  openQuote,
  fillContact,
  answerAllQuestions,
  chooseService,
  fillPeriod,
} from './helpers';

/* Screenshots for eyeballing the three states on desktop and iOS Safari:
     npm run shots
   Output lands in test-results/shots (gitignored). Not an assertion — this
   exists so a human can look at the thing before it goes near ad spend. */
const DIR = process.env.SHOT_DIR || 'test-results/shots';

test('@shots capture the three states', async ({ page }, testInfo) => {
  await isolate(page);
  await stubResolve(page);
  const tag = testInfo.project.name;

  await page.goto('/bookkeeping');
  await openQuote(page);
  await page.locator('.quote-modal').screenshot({ path: `${DIR}/${tag}-1-contact.png` });

  await fillContact(page);
  await page.getByTestId('quote-question').waitFor();
  await page.locator('.quote-modal').screenshot({ path: `${DIR}/${tag}-2-question.png` });

  await answerAllQuestions(page);
  await page.getByTestId('quote-result').waitFor({ timeout: 20000 });
  await page.locator('.quote-modal').screenshot({ path: `${DIR}/${tag}-3-price.png` });
});

/* The two steps the reference page never shows: the generic pages' service
   chooser, and the catch-up window on /books-cleanup. */
test('@shots capture the service chooser', async ({ page }, testInfo) => {
  await isolate(page);
  await stubResolve(page);
  const tag = testInfo.project.name;

  await page.goto('/');
  await openQuote(page);
  await fillContact(page);
  await page.getByTestId('quote-service').waitFor();
  await page.locator('.quote-modal').screenshot({ path: `${DIR}/${tag}-4-service.png` });

  await chooseService(page, 'vat-filing');
  await page.getByTestId('quote-question').waitFor();
  await page.locator('.quote-modal').screenshot({ path: `${DIR}/${tag}-5-service-question.png` });
});

test('@shots capture the catch-up window', async ({ page }, testInfo) => {
  await isolate(page);
  /* A cleanup engagement is bought once, so the screenshot has to show the
     one-off framing rather than the recurring one. */
  await stubResolve(page, {
    priceMonthly: 999,
    priceAnnual: 999,
    priceQuarterly: 0,
    billingFrequency: 'one_time',
    billingBucket: 'one_time',
    billingCycleMode: null,
  });
  const tag = testInfo.project.name;

  await page.goto('/books-cleanup');
  await openQuote(page);
  await fillContact(page);
  await answerAllQuestions(page, 3);
  await page.getByTestId('quote-period').waitFor();
  await page.locator('.quote-modal').screenshot({ path: `${DIR}/${tag}-6-period.png` });

  await fillPeriod(page);
  await page.getByTestId('quote-result').waitFor({ timeout: 20000 });
  await page.locator('.quote-modal').screenshot({ path: `${DIR}/${tag}-7-cleanup-price.png` });
});
