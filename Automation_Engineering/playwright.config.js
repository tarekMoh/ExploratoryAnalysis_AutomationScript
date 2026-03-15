// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,      // site is real; avoid rate-limiting
  retries: 1,                // one retry so flaky network doesn't fail the run
  workers: 1,

  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['./reporters/custom-html-reporter.js'],
    ['list'],
  ],

  use: {
    baseURL: 'https://www.skoda-parts.com',
    headless: true,
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: 'reports/test-results',
});
