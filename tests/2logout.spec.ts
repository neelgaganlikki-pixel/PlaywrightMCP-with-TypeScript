import { test, expect } from '@playwright/test';

test('Login and logout from OrangeHRM', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

await expect(page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Dashboard' })).toBeVisible()

  await page.locator('.oxd-userdropdown-name').click();
  await page.getByText('Logout').click();

  await expect(page).toHaveURL(/auth\/login/);
  await expect(page.getByPlaceholder('Username')).toBeVisible();
});
