import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('delete the vacancy created by the previous test case', async ({ page }) => {

  console.log('================================');
  console.log('Deleting Vacancy:');
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

  // ============================================================
  // READ VACANCY NAME CREATED BY TEST 8
  // ============================================================

  const vacancyFile = path.join(
    process.cwd(),
    'tests',
    'vacancy_name.txt'
  );

  if (!fs.existsSync(vacancyFile)) {

    throw new Error(
      `Vacancy file not found: ${vacancyFile}`
    );
  }

  const vacancyName = fs
    .readFileSync(
      vacancyFile,
      'utf-8'
    )
    .trim();

  if (!vacancyName) {

    throw new Error(
      'Vacancy name file is empty.'
    );
  }

  console.log(
    `Vacancy to delete: ${vacancyName}`
  );

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

  console.log(
    'Login page loaded'
  );

  console.log(
    'Entering username...'
  );

  await page
    .getByPlaceholder('Username')
    .fill(username);

  console.log(
    'Entering password...'
  );

  await page
    .getByPlaceholder('Password')
    .fill(password);

  console.log(
    'Clicking login button...'
  );

  await page
    .getByRole('button', {
      name: 'Login'
    })
    .click();

  console.log(
    'Waiting for Dashboard...'
  );

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

  console.log(
    'Recruitment page loaded'
  );

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

  console.log(
    'Vacancies page loaded'
  );

  // ============================================================
  // STEP 4 - SEARCH FOR VACANCY
  // ============================================================

  console.log('');
  console.log(
    'Step 4: Searching for the vacancy created in the previous test case...'
  );

  const vacancyRow = page
    .locator('.oxd-table-card')
    .filter({
      hasText: vacancyName
    });

  console.log(
    'Waiting for created vacancy to appear...'
  );

  await expect(
    vacancyRow
  ).toHaveCount(1, {
    timeout: 30000
  });

  console.log(
    'Created vacancy found'
  );

  // ============================================================
  // STEP 5 - DELETE
  // ============================================================

  console.log('');
  console.log(
    'Step 5: Deleting vacancy...'
  );

  await vacancyRow.scrollIntoViewIfNeeded();

  // ------------------------------------------------------------
  // Find delete button inside row
  // ------------------------------------------------------------

  const deleteButton = vacancyRow
    .getByRole('button')
    .filter({
      has: page.locator(
        '.bi-trash'
      )
    })
    .first();

  // Fallback if icon locator is not matched
  if (
    await deleteButton.count() === 0
  ) {

    const buttons =
      vacancyRow.getByRole('button');

    const buttonCount =
      await buttons.count();

    let foundDeleteButton = false;

    for (
      let i = 0;
      i < buttonCount;
      i++
    ) {

      const button = buttons.nth(i);

      const title =
        await button.getAttribute(
          'title'
        );

      const ariaLabel =
        await button.getAttribute(
          'aria-label'
        );

      const text =
        await button.innerText()
          .catch(() => '');

      if (
        title?.toLowerCase()
          .includes('delete') ||
        ariaLabel?.toLowerCase()
          .includes('delete') ||
        text?.toLowerCase()
          .includes('delete')
      ) {

        await button.click();

        foundDeleteButton = true;

        break;
      }
    }

    if (!foundDeleteButton) {

      throw new Error(
        'Delete button was not found inside vacancy row.'
      );
    }

  } else {

    await deleteButton.click();
  }

  console.log(
    'Delete button clicked'
  );

  // ============================================================
  // CONFIRM DELETE
  // ============================================================

  console.log(
    'Waiting for delete confirmation...'
  );

  const confirmDeleteButton =
    page.getByRole(
      'button',
      {
        name: /Yes, Delete/i
      }
    );

  await expect(
    confirmDeleteButton
  ).toBeVisible({
    timeout: 10000
  });

  console.log(
    'Delete confirmation displayed'
  );

  await confirmDeleteButton.click();

  console.log(
    'Delete confirmation clicked'
  );

  // ============================================================
  // WAIT FOR DELETE TOAST
  // ============================================================

  const deleteToast = page
    .locator(
      '.oxd-toast-container .oxd-toast'
    )
    .filter({
      hasText: /Successfully Deleted/i
    });

  await expect(
    deleteToast
  ).toBeVisible({
    timeout: 15000
  });

  const toastText =
    await deleteToast.innerText();

  console.log(
    `Delete Toast: ${toastText}`
  );

  console.log(
    'Vacancy deleted successfully'
  );

  // ============================================================
  // VERIFY VACANCY IS REMOVED
  // ============================================================

  await expect(
    page
      .locator('.oxd-table-card')
      .filter({
        hasText: vacancyName
      })
  ).toHaveCount(0, {
    timeout: 30000
  });

  console.log(
    `Verified vacancy no longer exists: ${vacancyName}`
  );

  // ============================================================
  // CLEANUP
  // ============================================================

  try {

    fs.unlinkSync(
      vacancyFile
    );

    console.log(
      'Vacancy tracking file deleted'
    );

  } catch (error) {

    console.log(
      'Could not delete vacancy tracking file'
    );
  }

  console.log('');
  console.log(
    '================================'
  );
  console.log(
    'Vacancy Deletion Completed'
  );
  console.log(
    '================================'
  );
});
