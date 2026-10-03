import { test as base, expect, Page } from '@playwright/test';
import { HealedPage, wrapWithHealing } from './healed-page';

export * from './types';
export * from './config';
export * from './logger';
export * from './history';
export * from './locator-repository';
export * from './locator-strategy';
export * from './validator';
export * from './discovery';
export * from './reporter';
export * from './engine';
export * from './healed-locator';
export * from './healed-page';
export * from './base-page';

/**
 * Custom Playwright test runner fixture that automatically injects
 * self-healing capabilities into the `page` fixture for all tests.
 */
export const test = base.extend<{ page: HealedPage & Page }>({
  page: async ({ page }, use) => {
    const healedPage = wrapWithHealing(page);
    await use(healedPage);
  },
});

export { expect };
