import { test, expect } from '@playwright/test';

test.setTimeout(240000);

test('delete the first buzz post in OrangeHRM', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);

  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Buzz' }).click();

  const firstPost = page.locator('.orangehrm-buzz-post').first();
  await firstPost.waitFor({ state: 'visible', timeout: 20000 });

  await firstPost.locator('button').click();
//   await page.getByRole('menuitem', { name: 'Delete' }).click();

  await page.getByText('Delete Post').click();

  await page.getByRole('button', { name: 'Yes, Delete' }).click();

  await expect(page.locator('body')).toContainText(/success|deleted/i, { timeout: 60000 });

  const toast = page.locator('.oxd-toast-container.oxd-toast-container--bottom');

await expect(toast).toBeVisible();

console.log(await toast.innerText());
});
