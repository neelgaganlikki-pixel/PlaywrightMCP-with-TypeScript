# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 3buzz-post.spec.ts >> post a buzz message in OrangeHRM
- Location: tests\3buzz-post.spec.ts:5:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('p.orangehrm-buzz-post-body-text').filter({ hasText: 'Buzz 1786339311337' })
Expected: visible
Received: undefined

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.setTimeout(180000);
  4  | 
  5  | test('post a buzz message in OrangeHRM', async ({ page }) => {
  6  | 
  7  |   await page.goto(
  8  |     'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
  9  |   );
  10 | 
  11 |   await page.getByPlaceholder('Username').fill('Admin');
  12 |   await page.getByPlaceholder('Password').fill('admin123');
  13 | 
  14 |   await page.getByRole('button', { name: 'Login' }).click();
  15 | 
  16 |   await expect(page).toHaveURL(/dashboard/);
  17 | 
  18 |   await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Buzz' }).click();
  19 | 
  20 |   const composer = page.getByPlaceholder("What's on your mind?");
  21 | 
  22 |   await composer.waitFor({ state: 'visible', timeout: 20000});
  23 | 
  24 |   // Generate a unique message for every test run
  25 |   // Generate a unique message for every test run
  26 | const message = `Buzz ${Date.now()}`;
  27 | 
  28 | await composer.fill(message);
  29 | 
  30 | console.log(`Posting message: ${message}`);
  31 | 
  32 | // Wait 4 seconds after entering the message
  33 | await page.waitForTimeout(4000);
  34 | 
  35 | // Locate the actual Post button
  36 | const postButton = page.getByText('Post', { exact: true });
  37 | 
  38 | // Make sure Post button is available
  39 | await expect(postButton).toBeVisible({ timeout: 20000 });
  40 | 
  41 | // Click Post
  42 | await postButton.click();
  43 | 
  44 | // Wait for the posted message to appear
  45 | const postedMessage = page.locator('p.orangehrm-buzz-post-body-text').filter({ hasText: message });
  46 | 
> 47 | await expect(postedMessage).toBeVisible({ timeout: 30000});
     |                             ^ Error: expect(locator).toBeVisible() failed
  48 | 
  49 | console.log(`Successfully verified: ${message}`);});
```