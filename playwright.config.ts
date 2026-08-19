import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',

    fullyParallel: false,

    workers: 1,

    reporter: [
        ['line'],
        ['json', { outputFile: 'playwright-report.json' }]
    ],

    use: {
        headless: true,

        launchOptions: {
            slowMo: 1500
        },

        screenshot: 'only-on-failure'
    },

    projects: [
        {
            name: 'chromium',

            use: {
                ...devices['Desktop Chrome']
            }
        }
    ]
});