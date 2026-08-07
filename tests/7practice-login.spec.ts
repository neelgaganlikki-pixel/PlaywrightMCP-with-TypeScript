import { test, expect } from '@playwright/test';

test('logs in and out on the practice test site', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  await page.locator('#username').fill('student');
  await page.locator('#password').fill('Password123');
  await page.getByRole('button', { name: /submit/i }).click();

  await expect(page.getByRole('heading', { name: /logged in successfully/i })).toBeVisible();

  await page.getByRole('link', { name: /log out/i }).click();
});
