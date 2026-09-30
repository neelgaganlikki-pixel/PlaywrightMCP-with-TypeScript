import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test('add a new user in OrangeHRM Admin', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);

  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();

  await page.locator('.oxd-select-wrapper').nth(0).click();
  await page.getByRole('option', { name: 'ESS' }).click();

  const employeeInput = page.getByPlaceholder('Type for hints...');
  await employeeInput.fill('auto_manda_29746 akhil user');
  await page.locator('.oxd-autocomplete-option').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

  const matchingOption = page.locator('.oxd-autocomplete-option').filter({ hasText: /George akhil Russell/i });
  if (await matchingOption.count()) {
    await matchingOption.first().click();
  } else {
    await employeeInput.fill('George akhil Russell');
    await page.locator('.oxd-autocomplete-option').first().click();
  }

  await page.locator('.oxd-select-wrapper').nth(1).click();
  await page.getByRole('option', { name: 'Enabled' }).click();


  await page.locator('(//input[@autocomplete="off"])[1]').fill('Neelgagan');   
  await page.locator('(//input[@autocomplete="off"])[2]').fill('@Neelgagan17');
  await page.locator('(//input[@autocomplete="off"])[3]').fill('@Neelgagan17');

//   await page.getByRole('button', { name: 'Save' }).click();

//   await expect(page.getByText(/Successfully Saved|Success/i)).toBeVisible({ timeout: 60000 });
});
