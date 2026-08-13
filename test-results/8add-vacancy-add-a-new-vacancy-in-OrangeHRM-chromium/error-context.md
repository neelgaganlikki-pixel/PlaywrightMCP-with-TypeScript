# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 8add-vacancy.spec.ts >> add a new vacancy in OrangeHRM
- Location: tests\8add-vacancy.spec.ts:2:7

# Error details

```
Test timeout of 40000ms exceeded.
```

```
Error: page.waitForTimeout: Test timeout of 40000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=f4e3]:
  - generic:
    - complementary [ref=f4e4]:
      - navigation "Sidepanel" [ref=f4e5]:
        - generic [ref=f4e6]:
          - link [ref=f4e7] [cursor=pointer]:
            - /url: https://www.orangehrm.com/
            - img "client brand banner" [ref=f4e9]
          - text: 
        - generic [ref=f4e10]:
          - generic [ref=f4e11]:
            - generic [ref=f4e12]:
              - textbox "Search" [ref=f4e15]
              - button "" [ref=f4e16] [cursor=pointer]
            - separator [ref=f4e18]
          - list [ref=f4e19]:
            - listitem [ref=f4e20]:
              - link "Admin" [ref=f4e21] [cursor=pointer]:
                - /url: /web/index.php/admin/viewAdminModule
            - listitem [ref=f4e25]:
              - link "PIM" [ref=f4e26] [cursor=pointer]:
                - /url: /web/index.php/pim/viewPimModule
            - listitem [ref=f4e41]:
              - link "Leave" [ref=f4e42] [cursor=pointer]:
                - /url: /web/index.php/leave/viewLeaveModule
            - listitem [ref=f4e46]:
              - link "Time" [ref=f4e47] [cursor=pointer]:
                - /url: /web/index.php/time/viewTimeModule
            - listitem [ref=f4e54]:
              - link "Recruitment" [ref=f4e55] [cursor=pointer]:
                - /url: /web/index.php/recruitment/viewRecruitmentModule
            - listitem [ref=f4e62]:
              - link "My Info" [ref=f4e63] [cursor=pointer]:
                - /url: /web/index.php/pim/viewMyDetails
            - listitem [ref=f4e70]:
              - link "Performance" [ref=f4e71] [cursor=pointer]:
                - /url: /web/index.php/performance/viewPerformanceModule
            - listitem [ref=f4e80]:
              - link "Dashboard" [ref=f4e81] [cursor=pointer]:
                - /url: /web/index.php/dashboard/index
            - listitem [ref=f4e85]:
              - link "Directory" [ref=f4e86] [cursor=pointer]:
                - /url: /web/index.php/directory/viewDirectory
            - listitem [ref=f4e90]:
              - link "Maintenance" [ref=f4e91] [cursor=pointer]:
                - /url: /web/index.php/maintenance/viewMaintenanceModule
            - listitem [ref=f4e96]:
              - link "Claim" [ref=f4e97] [cursor=pointer]:
                - /url: /web/index.php/claim/viewClaimModule
            - listitem [ref=f4e105]:
              - link "Buzz" [ref=f4e106] [cursor=pointer]:
                - /url: /web/index.php/buzz/viewBuzz
    - banner [ref=f4e110]:
      - generic [ref=f4e111]:
        - generic [ref=f4e112]:
          - text: 
          - heading "Recruitment" [level=6] [ref=f4e114]
        - link [ref=f4e116]:
          - /url: https://orangehrm.com/open-source/upgrade-to-advanced
          - button "Upgrade" [ref=f4e117] [cursor=pointer]
        - list [ref=f4e123]:
          - listitem [ref=f4e124]:
            - generic [ref=f4e125] [cursor=pointer]:
              - img "profile picture" [ref=f4e126]
              - paragraph [ref=f4e127]: André Freitas
              - generic [ref=f4e128]: 
      - navigation "Topbar Menu" [ref=f4e130]:
        - list [ref=f4e131]:
          - listitem [ref=f4e132] [cursor=pointer]:
            - link "Candidates" [ref=f4e133]:
              - /url: "#"
          - listitem [ref=f4e134] [cursor=pointer]:
            - link "Vacancies" [ref=f4e135]:
              - /url: "#"
          - button "" [ref=f4e137] [cursor=pointer]
  - generic [ref=f4e139]:
    - generic [ref=f4e142]:
      - heading "Add Vacancy" [level=6] [ref=f4e143]
      - separator [ref=f4e144]
      - generic [ref=f4e145]:
        - generic [ref=f4e146]:
          - generic [ref=f4e148]:
            - generic [ref=f4e149]: Vacancy Name*
            - textbox [ref=f4e152]: Senior Software Test Engineer 1786631189792
          - generic [ref=f4e154]:
            - generic [ref=f4e155]: Job Title*
            - generic [ref=f4e159] [cursor=pointer]:
              - generic [ref=f4e160]: Automaton Tester
              - generic [ref=f4e161]: 
        - generic [ref=f4e165]:
          - generic [ref=f4e166]: Description
          - textbox "Type description here" [ref=f4e169]: We are looking for a skilled backend software engineer to join our team.
        - generic [ref=f4e170]:
          - generic [ref=f4e172]:
            - generic [ref=f4e173]: Hiring Manager*
            - generic [ref=f4e176]:
              - textbox "Type for hints..." [active] [ref=f4e178]: André Freitas
              - listbox [ref=f4e179]:
                - option "André Freitas" [ref=f4e180] [cursor=pointer]
          - generic [ref=f4e185]:
            - generic [ref=f4e186]: Number of Positions
            - textbox [ref=f4e189]
        - generic [ref=f4e191]:
          - paragraph [ref=f4e192]: Active
          - checkbox [checked] [ref=f4e195]
        - generic [ref=f4e198]:
          - paragraph [ref=f4e199]: Publish in RSS Feed and Web Page
          - checkbox [checked] [ref=f4e202]
        - generic [ref=f4e206]:
          - generic [ref=f4e207]:
            - paragraph [ref=f4e208]: "RSS Feed URL :"
            - link "https://opensource-demo.orangehrmlive.com/web/index.php/recruitmentApply/jobs.rss" [ref=f4e209] [cursor=pointer]:
              - /url: https://opensource-demo.orangehrmlive.com/web/index.php/recruitmentApply/jobs.rss
          - generic [ref=f4e210]:
            - paragraph [ref=f4e211]: "Web Page URL :"
            - link "https://opensource-demo.orangehrmlive.com/web/index.php/recruitmentApply/jobs.html" [ref=f4e212] [cursor=pointer]:
              - /url: https://opensource-demo.orangehrmlive.com/web/index.php/recruitmentApply/jobs.html
        - separator [ref=f4e213]
        - generic [ref=f4e214]:
          - paragraph [ref=f4e215]: "* Required"
          - button "Cancel" [ref=f4e216] [cursor=pointer]
          - button "Save" [ref=f4e217] [cursor=pointer]
    - generic [ref=f4e218]:
      - paragraph [ref=f4e219]: OrangeHRM OS 5.9
      - paragraph [ref=f4e220]:
        - text: © 2005 - 2026
        - link "OrangeHRM, Inc" [ref=f4e221] [cursor=pointer]:
          - /url: http://www.orangehrm.com
        - text: . All rights reserved.
```

# Test source

```ts
  1   |   import { test, expect } from '@playwright/test';
  2   |   test('add a new vacancy in OrangeHRM', async ({ page }) => {
  3   |     // Step 1: Login
  4   |     console.log('Step 1: Navigating to OrangeHRM login page...');
  5   |     await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  6   |     console.log('Login page loaded');
  7   | 
  8   |     console.log('Entering username...');
  9   |     await page.getByPlaceholder('Username').fill('Admin');
  10  |     console.log('Username entered');
  11  | 
  12  |     console.log('Entering password...');
  13  |     await page.getByPlaceholder('Password').fill('admin123');
  14  |     console.log('Password entered');
  15  | 
  16  |     console.log('Clicking login button...');
  17  |     await page.getByRole('button', { name: 'Login' }).click();
  18  | 
  19  |     console.log('Waiting for Dashboard...');
  20  |     await expect(page).toHaveURL(/dashboard/);
  21  |     console.log('Login successful - Dashboard loaded');
  22  |     
  23  |     const loggedInUser = (await page.locator('.oxd-userdropdown-name').innerText()).trim();
  24  | 
  25  |     console.log('Logged-in user:', loggedInUser);
  26  | 
  27  |     console.log('Step 2: Navigating to Recruitment...');
  28  |     await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Recruitment' }).click();
  29  |     console.log('Recruitment page loaded');
  30  | 
  31  |     console.log('Step 3: Clicking on Vacancies...');
  32  |     await page.getByRole('link', { name: 'Vacancies' }).click();
  33  |     console.log('Vacancies page loaded');
  34  | 
  35  |     // Step 4: Click on Add button
  36  |     console.log('Step 4: Clicking Add button...');
  37  |     await page.getByText('Add', { exact: true }).click();
  38  |     console.log('Add Vacancy page loaded');
  39  |     // await expect(page.getByRole('heading', { name: 'Add Vacancy' })).toBeVisible();
  40  | 
  41  |     // Step 5: Fill in vacancy details
  42  |     console.log('Step 5: Filling vacancy details...');
  43  |     const vacancyName = page.locator('.oxd-input-group').filter({ hasText: 'Vacancy Name' }).locator('input');
  44  | 
  45  |     const uniqueVacancyName = `Senior Software Test Engineer ${Date.now()}`;
  46  | 
  47  |     await vacancyName.fill(uniqueVacancyName);
  48  |     console.log('Vacancy name filled');
  49  |     
  50  |     console.log('Opening Job Title dropdown...');
  51  |     await page.locator('.oxd-select-wrapper').nth(0).click();
  52  | 
  53  |     console.log('Waiting for Job Title option...');
  54  | 
  55  |     const jobTitleOption = page.getByRole('option', { name: 'Automaton Tester' });
  56  | 
  57  |     await expect(jobTitleOption).toBeVisible({ timeout: 15000 });
  58  | 
  59  |     console.log('Selecting Job Title: Automaton Tester...');
  60  | 
  61  |     await jobTitleOption.click();
  62  | 
  63  |     console.log('Job Title selected');
  64  |     console.log('Entering description...');
  65  |     await page.getByPlaceholder('Type description here').fill('We are looking for a skilled backend software engineer to join our team.');
  66  |     console.log('Description filled');
  67  |     // for hiring manager, we will use the logged-in user as the hiring manager
  68  |     console.log('Selecting Hiring Manager...');
  69  |     const hiringManager = page.getByPlaceholder('Type for hints...');
  70  | 
  71  |     await hiringManager.click();
  72  |     await hiringManager.fill(loggedInUser);
  73  |     console.log('Waiting for Hiring Manager autocomplete...');
> 74  |     await page.waitForTimeout(1000);
      |                ^ Error: page.waitForTimeout: Test timeout of 40000ms exceeded.
  75  | 
  76  |     const firstOption = page.locator('.oxd-autocomplete-option').first();
  77  | 
  78  |     await expect(firstOption).toBeVisible({ timeout: 20000 });
  79  |     console.log('Hiring Manager option displayed');
  80  |     await firstOption.click();
  81  |     console.log('Hiring Manager selected');
  82  |     console.log('Entering Number of Positions...');
  83  |     await page.locator('input.oxd-input').nth(2).fill('3');
  84  |     
  85  | 
  86  |   // Click Save
  87  |   console.log('Clicking Save button...');
  88  |   await page.getByRole('button', { name: 'Save' }).click();
  89  |   console.log('Save button clicked');
  90  |   // await page.waitForTimeout(1000);
  91  | 
  92  |   const toast = page.locator('.oxd-toast');
  93  |   console.log('Waiting for save operation...');
  94  |   await page.waitForTimeout(1000);
  95  | 
  96  |   //New code to test if the vacancy was added successfully
  97  |   console.log('Current URL after Save:', page.url());
  98  | 
  99  |     console.log('Checking if toast is present...');
  100 | 
  101 |     const toastCount = await toast.count();
  102 | 
  103 |     console.log('Toast count:', toastCount);
  104 | 
  105 |     if (toastCount > 0) {
  106 |       console.log('Toast found');
  107 | 
  108 |       const toastText = await toast.innerText();
  109 | 
  110 |       console.log('Toast message:', toastText);
  111 |     } else {
  112 |       console.log('No toast found');
  113 |     }
  114 | 
  115 |     console.log('Current page title:', await page.title());
  116 | 
  117 |     console.log('Vacancy creation test completed');
  118 |   // await expect(toast).toBeVisible({ timeout: 2000 });
  119 |   });
```