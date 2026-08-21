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

Locator: locator('p.orangehrm-buzz-post-body-text').filter({ hasText: 'Buzz 1787322005867' })
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('p.orangehrm-buzz-post-body-text').filter({ hasText: 'Buzz 1787322005867' })
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
      - paragraph: Mary Jane
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
- paragraph: Mary akhil Jane
- paragraph: 2026-21-08 07:46 PM
- listitem:
  - button ""
- separator
- paragraph: Buzz 1787321797340
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- img "profile picture"
- paragraph: Mary akhil Jane
- paragraph: 2020-08-10 09:08 AM
- listitem:
  - button ""
- separator
- paragraph: "Hi All; Linda has been blessed with a baby boy! Linda: With love, we welcome your dear new baby to this world. Congratulations!"
- img
- button ""
- button ""
- text: 
- paragraph: 1 Like
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- img "profile picture"
- paragraph: Sania Shaheen
- paragraph: 2020-08-10 09:08 AM
- listitem:
  - button ""
- separator
- paragraph: "World Championship: What makes the perfect snooker player? Mark Selby: Robertson has one of the best techniques in the game. It is very, very straight and he fully commits to every single shot he plays. John Higgins: Every shot is repetitive. He always keeps the same technique and cues through the ball bang straight. Barry Hawkins: Robertson is textbook with his grip and has a ramrod solid cue action, delivering it in a straight line. Honourable mentions: Shaun Murphy, Ding Junhui, Jack Lisowski."
- paragraph: Read More
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- img "profile picture"
- paragraph: Rebecca Harmony
- paragraph: 2020-08-10 09:04 AM
- listitem:
  - button ""
- separator
- paragraph: Throwback Thursdays!!
- img
- img
- button ""
- button ""
- text: 
- paragraph: 0 Likes
- paragraph: 0 Comments
- text: ‚
- paragraph: 0 Shares
- img "profile picture"
- paragraph: Russel Hamilton
- paragraph: 2020-08-10 09:03 AM
- listitem:
  - button ""
- separator
- paragraph: Live SIMPLY Dream BIG Be GREATFULL Give LOVE Laugh LOT.......
- img
- button ""
- button ""
- text: 
- paragraph: 2 Likes
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
  7  |   // Step 1: Navigate to OrangeHRM
  8  |   await page.goto(
  9  |     'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
  10 |     { waitUntil: 'domcontentloaded' }
  11 |   );
  12 | 
  13 |   // Step 2: Login
  14 |   await page.getByPlaceholder('Username').fill('Admin');
  15 |   await page.getByPlaceholder('Password').fill('admin123');
  16 | 
  17 |   await page.getByRole('button', { name: 'Login' }).click();
  18 | 
  19 |   // Step 3: Verify Dashboard
  20 |   await expect(page).toHaveURL(/dashboard/, { timeout: 60000 });
  21 |   await expect(
  22 |   page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 60000 });
  23 | 
  24 |   // Step 4: Navigate to Buzz
  25 |   const buzzMenu = page
  26 |     .locator('span.oxd-main-menu-item--name')
  27 |     .filter({ hasText: 'Buzz' });
  28 | 
  29 |   await expect(buzzMenu).toBeVisible({ timeout: 20000 });
  30 | 
  31 |   await buzzMenu.click();
  32 | 
  33 |   // Step 5: Wait for Buzz page
  34 |   const composer = page.locator('textarea.oxd-buzz-post-input');
  35 |   await expect(composer).toBeVisible({ timeout: 30000 });
  36 | 
  37 |   // Step 6: Generate unique message
  38 |   const message = `Buzz ${Date.now()}`;
  39 | 
  40 |   console.log(`Posting message: ${message}`);
  41 | 
  42 |   // Step 7: Enter message
  43 |   await composer.fill(message);
  44 | 
  45 |   // Verify the value immediately after filling
  46 |   console.log(`Composer value: ${await composer.inputValue()}`);
  47 | 
  48 |   // Step 8: Locate Post button
  49 |   const postButton = page.locator('button.oxd-button.oxd-button--medium.oxd-button--main');
  50 | 
  51 |   await expect(postButton).toBeVisible({ timeout: 20000 });
  52 |   await expect(postButton).toBeEnabled({ timeout: 20000 });
  53 | 
  54 |   console.log('Post button is ready');
  55 | 
  56 |   // Step 9: Click Post
  57 |   await postButton.click({ timeout: 10000 });
  58 |   console.log('Post button clicked');
  59 | 
  60 |   // Step 10: Verify posted message
  61 |   const postedMessage = page
  62 |     .locator('p.orangehrm-buzz-post-body-text')
  63 |     .filter({ hasText: message });
  64 | 
> 65 |   await expect(postedMessage).toBeVisible({
     |                               ^ Error: expect(locator).toBeVisible() failed
  66 |     timeout: 30000
  67 |   });
  68 | 
  69 |   console.log(`Successfully verified: ${message}`);
  70 | });
```