import { test, expect } from '@playwright/test';
import * as fs from 'fs';
test.setTimeout(180000);

test('delete the vacancy created by the previous test case', async ({ page }) => {


  const uniqueVacancyName = fs.readFileSync('tests/vacancy-name.txt','utf-8').trim();

    console.log('================================');
    console.log('Deleting Vacancy:');
    console.log('================================');

  // Step 1: Login
  console.log('Step 1: Navigating to OrangeHRM login page...');
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  console.log('Login page loaded');

  console.log('Entering username...');
  await page.getByPlaceholder('Username').fill('Admin');
  console.log('Entering password...');
  await page.getByPlaceholder('Password').fill('admin123');
  console.log('Clicking login button...');
  await page.getByRole('button', { name: 'Login' }).click();

  console.log('Waiting for Dashboard...');
  await expect(page).toHaveURL(/dashboard/);
  console.log('Login successful - Dashboard loaded');

  // Step 2: Navigate to Recruitment
  console.log('Step 2: Navigating to Recruitment...');
  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Recruitment' }).click();
  console.log('Recruitment page loaded');

  // Step 3: Click on Vacancies
  console.log('Step 3: Clicking on Vacancies...');
  await page.getByRole('link', { name: 'Vacancies' }).click();
  console.log('Vacancies page loaded');

  // Step 4: Search for the vacancy created in the previous test case
  console.log('Step 4: Searching for the vacancy created in the previous test case...');
  console.log(`Vacancy to delete: ${uniqueVacancyName}`);

  const vacancyRow = page.locator('.oxd-table-card').filter({ hasText: uniqueVacancyName })


  console.log('Waiting for created vacancy to appear...');

  await expect(vacancyRow).toHaveCount(1, { timeout: 30000 });

  console.log('Created vacancy found');

  // Scroll to the created vacancy
  console.log('Scrolling to the created vacancy...');

  await vacancyRow.scrollIntoViewIfNeeded();

  console.log('Created vacancy is now in view');

  // Verify the vacancy name
  await expect(vacancyRow).toContainText(uniqueVacancyName);

  console.log(`Vacancy found: ${uniqueVacancyName}`);

  // Click the Delete/Trash button in this vacancy row
  console.log('Clicking Delete button for the created vacancy...');
  await vacancyRow.getByRole('button').first().click();
  console.log('Delete button clicked');
  console.log('Step 5: Deleting the vacancy...');
  // const deleteButton = page.locator('button').filter({ hasText: 'Delete' }).first();
  // await deleteButton.click();
  // console.log('Delete button clicked');

  console.log('Step 6: Preparing deletion toast listener...');

  const deleteToastPromise = page.evaluate(() => {
    return new Promise<string>((resolve) => {

      const observer = new MutationObserver(() => {

        const toast = document.querySelector('.oxd-toast-content.oxd-toast-content--success .oxd-toast-content-text');

        if (toast) {

          const text = toast.textContent?.trim() || '';

          if (text) {
            observer.disconnect();
            resolve(text);
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  });

  console.log('Deletion toast listener ready');

  // Step 8: Confirm deletion
  console.log('Step 7: Clicking Yes, Delete...');

  await page.getByRole('button', {
    name: 'Yes, Delete'
  }).click();

  console.log('Yes, Delete button clicked');

  // Step 9: Get deletion toast message
  console.log('Waiting for deletion toast message...');

  const deleteMessage = await deleteToastPromise;

  console.log('================================');
  console.log('DELETE TOAST MESSAGE:', JSON.stringify(deleteMessage));
  console.log('================================');

  // Step 10: Verify deletion toast
  expect(deleteMessage).toMatch(/Successfully Deleted|Success/i);
  console.log(deleteMessage);
  console.log('Deletion toast message verified successfully');

  // Step 11: Verify vacancy is deleted
  console.log('Step 8: Verifying vacancy was deleted...');

  await expect(vacancyRow).not.toBeVisible({ timeout: 30000 });

  console.log('================================');
  console.log('VACANCY DELETED SUCCESSFULLY');
  console.log('Deleted Vacancy:', uniqueVacancyName);
  console.log('================================');

  // Step 7: Verify deletion
  console.log('Step 7: Verifying deletion...'); 
  await expect(vacancyRow).toHaveCount(0, { timeout: 30000 });
  console.log('Vacancy deletion verified successfully');   

  
});
