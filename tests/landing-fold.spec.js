import { test, expect } from '@playwright/test';
import { isolate } from './helpers';

/* Google Ads grades the landing page a visitor reaches from a keyword. Two
   things it reads are guarded here: whether the page says what the keyword
   searched for (title, description, headline), and whether a phone shows that
   headline and a way to act on it without scrolling. Every conversion on these
   campaigns is mobile, so the fold checks run on the mobile project only. */

const PAGES = [
  { path: '/', topic: /accounting/i },
  { path: '/bookkeeping', topic: /bookkeeping/i },
];

for (const { path, topic } of PAGES) {
  test(`${path} names its keyword in the title, description and headline`, async ({ page }) => {
    await isolate(page);
    await page.goto(path);
    await expect(page.locator('h1')).toHaveText(topic);
    await expect(page).toHaveTitle(topic);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', topic);
  });

  test(`${path} shows the headline and the quote CTA above the fold on a phone`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'fold is a phone measurement');
    await isolate(page);
    await page.goto(path);

    const { height } = page.viewportSize();
    const headline = await page.locator('h1').boundingBox();
    const cta = await page.getByTestId('quote-cta-hero').boundingBox();

    expect(headline.y).toBeLessThan(height);
    expect(cta.y + cta.height).toBeLessThanOrEqual(height);
  });
}
