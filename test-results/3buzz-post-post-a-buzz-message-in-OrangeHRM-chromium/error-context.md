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

Locator: locator('p.orangehrm-buzz-post-body-text').filter({ hasText: 'Buzz 1786345569187' })
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('p.orangehrm-buzz-post-body-text').filter({ hasText: 'Buzz 1786345569187' })
  - Target page, context or browser has been closed

```

```yaml
- complementary:
  - navigation "Sidepanel":
    - link "client brand banner":
      - /url: https://www.orangehrm.com/
      - img "client brand banner"
    - textbox "Search"
    - button ""
    - separator
    - list:
      - listitem:
        - link "Admin":
          - /url: /web/index.php/admin/viewAdminModule
      - listitem:
        - link "PIM":
          - /url: /web/index.php/pim/viewPimModule
      - listitem:
        - link "Leave":
          - /url: /web/index.php/leave/viewLeaveModule
      - listitem:
        - link "Time":
          - /url: /web/index.php/time/viewTimeModule
      - listitem:
        - link "Recruitment":
          - /url: /web/index.php/recruitment/viewRecruitmentModule
      - listitem:
        - link "My Info":
          - /url: /web/index.php/pim/viewMyDetails
      - listitem:
        - link "Performance":
          - /url: /web/index.php/performance/viewPerformanceModule
      - listitem:
        - link "Dashboard":
          - /url: /web/index.php/dashboard/index
      - listitem:
        - link "Directory":
          - /url: /web/index.php/directory/viewDirectory
      - listitem:
        - link "Maintenance":
          - /url: /web/index.php/maintenance/viewMaintenanceModule
      - listitem:
        - link "Claim":
          - /url: /web/index.php/claim/viewClaimModule
          - img
          - text: Claim
      - listitem:
        - link "Buzz":
          - /url: /web/index.php/buzz/viewBuzz
- banner:
  - heading "Buzz" [level=6]
  - link "Upgrade":
    - /url: https://orangehrm.com/open-source/upgrade-to-advanced
    - button "Upgrade"
  - list:
    - listitem:
      - img "profile picture"
      - paragraph: Bivin Krishna
      - text: 
  - navigation "Topbar Menu":
    - list:
      - button ""
- paragraph: Buzz Newsfeed
- img "profile picture"
- textbox "What's on your mind?"
- button "Post"
- separator
- button "Share Photos"
- button "Share Video"
- button " Most Recent Posts"
- button " Most Liked Posts"
- button " Most Commented Posts"
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:56 AM
- listitem:
  - button ""
- separator
- paragraph: Bins
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:52 AM
- paragraph: Angella
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:56 AM
- listitem:
  - button ""
- separator
- paragraph: Truman
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:56 AM
- listitem:
  - button ""
- separator
- paragraph: Cortez
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:56 AM
- listitem:
  - button ""
- separator
- paragraph: Malcom
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:56 AM
- paragraph: Jesenia
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:56 AM
- listitem:
  - button ""
- separator
- paragraph: Fatima
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:56 AM
- listitem:
  - button ""
- separator
- paragraph: Ronald
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:52 AM
- paragraph: Robyn
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:56 AM
- listitem:
  - button ""
- separator
- paragraph: Stephen
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:56 AM
- listitem:
  - button ""
- separator
- paragraph: Jesenia
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 1 Share
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:52 AM
- listitem:
  - button ""
- separator
- paragraph: "null"
- iframe
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- img "profile picture"
- paragraph: Bivin M Krishna
- paragraph: 2026-08-10 11:52 AM
- listitem:
  - button ""
- separator
- paragraph: Otelia
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- paragraph: Upcoming Anniversaries
- img "No Content"
- paragraph: No Records Found
- paragraph: OrangeHRM OS 5.9
- paragraph:
  - text: © 2005 - 2026
  - link "OrangeHRM, Inc":
    - /url: http://www.orangehrm.com
  - text: . All rights reserved.
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
  26 | await composer.fill(message);
  27 | 
  28 | console.log(`Posting message: ${message}`);
  29 | 
  30 | // Wait 4 seconds after entering the message
  31 | await page.waitForTimeout(4000);
  32 | 
  33 | // Locate the actual Post button
  34 | const postButton = page.getByText('Post', { exact: true });
  35 | 
  36 | // Make sure Post button is available
  37 | await expect(postButton).toBeVisible({ timeout: 20000 });
  38 | 
  39 | // Click Post
  40 | await postButton.click();
  41 | 
  42 | // Wait for the posted message to appear
  43 | const postedMessage = page.locator('p.orangehrm-buzz-post-body-text').filter({ hasText: message });
  44 | 
> 45 | await expect(postedMessage).toBeVisible({ timeout: 30000});
     |                             ^ Error: expect(locator).toBeVisible() failed
  46 | 
  47 | console.log(`Successfully verified: ${message}`);});
```