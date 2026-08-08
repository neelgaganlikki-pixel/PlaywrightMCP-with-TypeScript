import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',

  timeout: 30000,

  expect: {
    timeout: 5000,
  },

  retries: 2, // Retry failed tests up to 2 times

  workers: 1,
  fullyParallel: false,

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        ...devices['Desktop Chrome'],
        headless: false,
        launchOptions: {
          slowMo: 1000,
        },
      },
    },
  ],
});
