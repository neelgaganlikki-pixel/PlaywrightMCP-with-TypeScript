# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 3buzz-post.spec.ts >> post a buzz message in OrangeHRM
- Location: tests\3buzz-post.spec.ts:5:5

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  getByPlaceholder('What\'s on your mind?')
Expected: "Buzz 1786453318786"
Received: ""
Timeout:  10000ms

Call log:
  - Expect "toHaveValue" with timeout 10000ms
  - waiting for getByPlaceholder('What\'s on your mind?')
    23 × locator resolved to <textarea rows="1" data-v-03a5ee57="" class="oxd-buzz-post-input" placeholder="What's on your mind?"></textarea>
       - unexpected value ""

```

```yaml
- textbox "What's on your mind?"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.setTimeout(180000);
  4  | 
  5  | test('post a buzz message in OrangeHRM', async ({ page }) => {
  6  | 
  7  |   await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  8  | 
  9  |   await page.getByPlaceholder('Username').fill('Admin');
  10 |   await page.getByPlaceholder('Password').fill('admin123');
  11 | 
  12 |   await page.getByRole('button', { name: 'Login' }).click();
  13 | 
  14 |   await expect(page).toHaveURL(/dashboard/);
  15 | 
  16 |   await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Buzz' }).click();
  17 | 
  18 |   const composer = page.getByPlaceholder("What's on your mind?");
  19 | 
  20 |   await composer.waitFor({ state: 'visible', timeout: 20000});
  21 | 
  22 |   // Generate a unique message for every test run
  23 |   // Generate a unique message for every test run
  24 | const message = `Buzz ${Date.now()}`;
  25 | 
  26 | await composer.click();
  27 | await composer.fill(message);
  28 | 
  29 | console.log(`Posting message: ${message}`);
  30 | 
  31 | // Wait 1 second after entering the message
  32 | await page.waitForTimeout(1000);
  33 | 
> 34 | await expect(composer).toHaveValue(message, {timeout: 10000});
     |                        ^ Error: expect(locator).toHaveValue(expected) failed
  35 | 
  36 | console.log('Message is still present in composer');
  37 | 
  38 | // Locate the actual Post button
  39 | const postButton = page.getByRole('button', { name: 'Post', exact: true });
  40 | 
  41 | // Make sure Post button is available
  42 | await expect(postButton).toBeVisible({ timeout: 20000 });
  43 | await expect(postButton).toBeEnabled({ timeout: 20000 });
  44 | // Click Post
  45 | await postButton.click();
  46 | 
  47 | // Wait for the posted message to appear
  48 | const postedMessage = page.locator('p.orangehrm-buzz-post-body-text').filter({ hasText: message });
  49 | 
  50 | await expect(postedMessage).toBeVisible({ timeout: 30000});
  51 | 
  52 | console.log(`Successfully verified: ${message}`);});
```