import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('add a new vacancy in OrangeHRM', async ({ page }) => {

  console.log('================================');
  console.log('Adding Vacancy:');
  console.log('================================');

  // ============================================================
  // TEST DATA
  // ============================================================

  const baseUrl =
    process.env.BASE_URL ||
    'https://opensource-demo.orangehrmlive.com';

  const username =
    process.env.USERNAME ||
    'Admin';

  const password =
    process.env.PASSWORD ||
    'admin123';

  const vacancyName =
    `Senior Software Test Engineer ${Date.now()}`;

  const jobTitle = 'QA Engineer';

  const description =
    'Automation testing vacancy created using Playwright';

  // ============================================================
  // SAVE VACANCY NAME FOR DELETE TEST
  // ============================================================

  const vacancyFile = path.join(
    process.cwd(),
    'tests',
    'vacancy_name.txt'
  );

  fs.writeFileSync(
    vacancyFile,
    vacancyName,
    'utf-8'
  );

  console.log(`Vacancy name: ${vacancyName}`);

  // ============================================================
  // STEP 1 - LOGIN
  // ============================================================

  console.log('');
  console.log(
    'Step 1: Navigating to OrangeHRM login page...'
  );

  await page.goto(baseUrl, {
    waitUntil: 'domcontentloaded'
  });

  await expect(
    page.getByPlaceholder('Username')
  ).toBeVisible({
    timeout: 15000
  });

  console.log('Login page loaded');

  console.log('Entering username...');

  await page
    .getByPlaceholder('Username')
    .fill(username);

  console.log('Username entered');

  console.log('Entering password...');

  await page
    .getByPlaceholder('Password')
    .fill(password);

  console.log('Password entered');

  console.log('Clicking login button...');

  await page
    .getByRole('button', {
      name: 'Login'
    })
    .click();

  console.log('Waiting for Dashboard...');

  await expect(
    page.getByRole('heading', {
      name: 'Dashboard'
    })
  ).toBeVisible({
    timeout: 30000
  });

  console.log(
    'Login successful - Dashboard loaded'
  );

  // ============================================================
  // STEP 2 - RECRUITMENT
  // ============================================================

  console.log('');
  console.log(
    'Step 2: Navigating to Recruitment...'
  );

  await page
    .getByRole('link', {
      name: 'Recruitment'
    })
    .click();

  await expect(
    page
  ).toHaveURL(
    /\/web\/index\.php\/recruitment/,
    {
      timeout: 15000
    }
  );

  console.log('Recruitment page loaded');

  // ============================================================
  // STEP 3 - VACANCIES
  // ============================================================

  console.log('');
  console.log(
    'Step 3: Clicking on Vacancies...'
  );

  await page
    .getByRole('link', {
      name: 'Vacancies'
    })
    .click();

  await expect(
    page.getByRole('heading', {
      name: 'Vacancies'
    })
  ).toBeVisible({
    timeout: 15000
  });

  console.log('Vacancies page loaded');

  // ============================================================
  // STEP 4 - ADD
  // ============================================================

  console.log('');
  console.log(
    'Step 4: Clicking Add button...'
  );

  await page
    .getByRole('button', {
      name: 'Add'
    })
    .click();

  await expect(
    page.getByRole('heading', {
      name: 'Add Vacancy'
    })
  ).toBeVisible({
    timeout: 15000
  });

  console.log('Add Vacancy page loaded');

  // ============================================================
  // STEP 5 - FILL VACANCY DETAILS
  // ============================================================

  console.log('');
  console.log(
    'Step 5: Filling vacancy details...'
  );

  // ------------------------------------------------------------
  // Vacancy Name
  // ------------------------------------------------------------

  const vacancyNameInput = page
    .locator('div.oxd-input-group')
    .filter({
      hasText: 'Vacancy Name'
    })
    .locator('input')
    .first();

  await expect(
    vacancyNameInput
  ).toBeVisible({
    timeout: 10000
  });

  await vacancyNameInput.fill(
    vacancyName
  );

  console.log(
    'Vacancy name filled'
  );

  // ------------------------------------------------------------
  // Job Title
  // ------------------------------------------------------------

  console.log(
    'Opening Job Title dropdown...'
  );

  const jobTitleDropdown = page
    .locator('.oxd-select-text')
    .first();

  await expect(
    jobTitleDropdown
  ).toBeVisible({
    timeout: 10000
  });

  await jobTitleDropdown.click();

  console.log(
    'Waiting for Job Title option...'
  );

  const jobTitleOption = page
    .getByRole('option', {
      name: jobTitle,
      exact: true
    });

  await expect(
    jobTitleOption
  ).toBeVisible({
    timeout: 10000
  });

  console.log(
    `Selecting Job Title: ${jobTitle}...`
  );

  await jobTitleOption.click();

  console.log(
    'Job Title selected'
  );

  // ------------------------------------------------------------
  // Description
  // ------------------------------------------------------------

  console.log(
    'Entering description...'
  );

  const descriptionBox = page
    .getByPlaceholder(
      'Type description here'
    );

  await expect(
    descriptionBox
  ).toBeVisible({
    timeout: 10000
  });

  await descriptionBox.fill(
    description
  );

  console.log(
    'Description filled'
  );

  // ------------------------------------------------------------
  // Hiring Manager
  // ------------------------------------------------------------

  console.log(
    'Selecting Hiring Manager...'
  );

  const hiringManagerInput =
    page.getByPlaceholder(
      'Type for hints...'
    );

  await expect(
    hiringManagerInput
  ).toBeVisible({
    timeout: 10000
  });

  await hiringManagerInput.fill(
    'a'
  );

  console.log(
    'Waiting for Hiring Manager autocomplete...'
  );

  const managerDropdown = page.locator(
    '.oxd-autocomplete-dropdown'
  );

  await expect(
    managerDropdown
  ).toBeVisible({
    timeout: 10000
  });

  const managerOption = managerDropdown
    .locator(
      '.oxd-autocomplete-option'
    )
    .first();

  await expect(
    managerOption
  ).toBeVisible({
    timeout: 10000
  });

  console.log(
    'Hiring Manager option displayed'
  );

  await managerOption.click();

  console.log(
    'Hiring Manager selected'
  );

  // ------------------------------------------------------------
  // Number Of Positions
  // ------------------------------------------------------------

  console.log(
    'Entering Number of Positions...'
  );

  const numberOfPositionsInput =
    page
      .locator('div.oxd-input-group')
      .filter({
        hasText: 'Number of Positions'
      })
      .locator('input')
      .first();

  await expect(
    numberOfPositionsInput
  ).toBeVisible({
    timeout: 10000
  });

  await numberOfPositionsInput.fill(
    '1'
  );

  // ============================================================
  // STEP 6 - SAVE
  // ============================================================

  console.log('');
  console.log(
    'Clicking Save...'
  );

  const saveButton =
    page.getByRole('button', {
      name: 'Save'
    });

  await expect(
    saveButton
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    saveButton
  ).toBeEnabled({
    timeout: 10000
  });

  await saveButton.click();

  console.log(
    'Save button clicked'
  );

  // ============================================================
  // WAIT FOR SUCCESS TOAST
  // ============================================================

  const successToast = page
    .locator(
      '.oxd-toast-container .oxd-toast'
    )
    .filter({
      hasText: /Successfully Saved/i
    });

  await expect(
    successToast
  ).toBeVisible({
    timeout: 15000
  });

  const toastText =
    await successToast.innerText();

  console.log(
    `Success Toast: ${toastText}`
  );

  console.log(
    'Vacancy saved successfully'
  );

  // ============================================================
  // STEP 7 - GO BACK TO VACANCY LIST
  // ============================================================

  console.log('');
  console.log(
    'Step 7: Returning to vacancy list...'
  );

  await page
    .getByRole('link', {
      name: 'Vacancies'
    })
    .click();

  await expect(
    page.getByRole('heading', {
      name: 'Vacancies'
    })
  ).toBeVisible({
    timeout: 15000
  });

  // ============================================================
  // VERIFY CREATED VACANCY
  // ============================================================

  console.log(
    'Searching for created vacancy...'
  );

  const vacancyRow = page
    .locator('.oxd-table-card')
    .filter({
      hasText: vacancyName
    });

  await expect(
    vacancyRow
  ).toHaveCount(1, {
    timeout: 30000
  });

  console.log(
    `Vacancy verified successfully: ${vacancyName}`
  );

  console.log('');
  console.log(
    '================================'
  );
  console.log(
    'Vacancy Creation Completed'
  );
  console.log(
    '================================'
  );
});
