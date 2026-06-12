const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5175',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 5000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    // ── Desktop ────────────────────────────────────────────
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    // ── Mobile ─────────────────────────────────────────────
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
})
