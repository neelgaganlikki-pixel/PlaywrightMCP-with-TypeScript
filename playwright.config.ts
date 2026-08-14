import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',

  timeout: 60000,

  expect: {
    timeout: 10000,
  },

  retries: 2, // Retry failed tests up to 2 times

  workers: 2,
  fullyParallel: false,

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        ...devices['Desktop Chrome'],
        headless: false,

        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        launchOptions: {
          slowMo:1000,
        },
      },
    },
  ],
});
