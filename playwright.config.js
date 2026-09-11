import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end config for the quote generator.
 *
 * Runs against the vite dev server because that is the only local environment
 * where /api/quote proxies to FinCore — see the matching rewrite in vercel.json.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          /* Chrome blocks a public origin (forms.zohopublic.com, stubbed here)
             from navigating to localhost — ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS.
             That is an artefact of testing against a local server: in production
             both origins are public and the check never applies. WebKit does not
             enforce it, which is why the same flow passes there untouched. */
          args: ['--disable-features=LocalNetworkAccessChecks,BlockInsecurePrivateNetworkRequests'],
        },
      },
    },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
