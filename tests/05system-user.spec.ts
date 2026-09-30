import { test, expect } from '@playwright/test';

test('login to OrangeHRM and verify Admin system users page', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);

  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Admin' }).click();

  await expect(page.getByText('System Users')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
});
