import { test, expect } from '@playwright/test';

test.setTimeout(180000);

test('post a buzz message in OrangeHRM', async ({ page }) => {

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);

  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Buzz' }).click();

  const composer = page.getByPlaceholder("What's on your mind?");

  await composer.waitFor({ state: 'visible', timeout: 20000});

  // Generate a unique message for every test run
  // Generate a unique message for every test run
const message = `Buzz ${Date.now()}`;

await composer.click();
await composer.fill(message);

console.log(`Posting message: ${message}`);

// Wait 1 second after entering the message
await page.waitForTimeout(1000);

await expect(composer).toHaveValue(message, {timeout: 10000});

console.log('Message is still present in composer');

// Locate the actual Post button
const postButton = page.getByRole('button', { name: 'Post', exact: true });

// Make sure Post button is available
await expect(postButton).toBeVisible({ timeout: 20000 });
await expect(postButton).toBeEnabled({ timeout: 20000 });
// Click Post
await postButton.click();

// Wait for the posted message to appear
const postedMessage = page.locator('p.orangehrm-buzz-post-body-text').filter({ hasText: message });

await expect(postedMessage).toBeVisible({ timeout: 30000});

console.log(`Successfully verified: ${message}`);});