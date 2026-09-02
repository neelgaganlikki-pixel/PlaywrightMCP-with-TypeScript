import { test, expect } from '@playwright/test';

test.setTimeout(180000);

test('post a buzz message in OrangeHRM', async ({ page }) => {

  // Step 1: Navigate to OrangeHRM
  await page.goto(
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    { waitUntil: 'domcontentloaded' }
  );

  // Step 2: Login
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');

  await page.getByRole('button', { name: 'Login' }).click();

  // Step 3: Verify Dashboard
  await expect(page).toHaveURL(/dashboard/, { timeout: 60000 });

  await expect(
    page.getByRole('heading', { name: 'Dashboard' })
  ).toBeVisible({ timeout: 60000 });

  // Step 4: Navigate to Buzz
  const buzzMenu = page
    .locator('span.oxd-main-menu-item--name')
    .filter({ hasText: 'Buzz' });

  await expect(buzzMenu).toBeVisible({ timeout: 20000 });
  await buzzMenu.click();

  // Step 5: Wait for Buzz page and composer
  const composer = page.locator('textarea.oxd-buzz-post-input');

  await expect(composer).toBeVisible({ timeout: 30000 });
  await expect(composer).toBeEditable({ timeout: 30000 });

  // Step 6: Generate unique message
  const message = `Buzz ${Date.now()}`;

  console.log(`Posting message: ${message}`);

  // Step 7: Enter message
  await composer.click();

  // Clear any existing value
  await composer.fill('');

  // Fill the Buzz message
  await composer.fill(message);

  // Verify the value
  await expect(composer).toHaveValue(message, {
    timeout: 10000
  });

  console.log(`Composer value: ${await composer.inputValue()}`);

  // Step 8: Locate Post button
  const postButton = page.locator(
    'button.oxd-button.oxd-button--medium.oxd-button--main'
  );

  await expect(postButton).toBeVisible({ timeout: 20000 });
  await expect(postButton).toBeEnabled({ timeout: 20000 });

  console.log('Post button is ready');

  // Step 9: Click Post
  await postButton.click({ timeout: 10000 });

  console.log('Post button clicked');

  // Step 10: Verify posted message
  const postedMessage = page
    .locator('p.orangehrm-buzz-post-body-text')
    .filter({ hasText: message });

  await expect(postedMessage).toBeVisible({
    timeout: 30000
  });

  console.log(`Successfully verified: ${message}`);
});