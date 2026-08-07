import { test, expect } from '@playwright/test';

test.setTimeout(180000);

test('post a buzz message in OrangeHRM', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);

  await page
    .locator('span.oxd-main-menu-item--name')
    .filter({ hasText: 'Buzz' })
    .click();

  const composer = page.getByPlaceholder("What's on your mind?");
  await composer.waitFor({ state: 'visible', timeout: 20000 });

  // Generate a unique message for every test run
  const message = `Buzz ${Date.now()}`;

  await composer.fill(message);

  await page.getByRole('button', { name: 'Post', exact: true }).click();

  // Verify success toast
  await expect(page.locator('body')).toContainText(/success/i, {timeout: 60000,});

  // Verify the posted message appears in the feed
  await expect(page.locator('p.orangehrm-buzz-post-body-text', { hasText: message })).toBeVisible();
});