  import { test, expect } from '@playwright/test';

  import * as fs from 'fs';
  test.setTimeout(120000);
  test('add a new vacancy in OrangeHRM', async ({ page }) => {
    // Step 1: Login
    console.log('Step 1: Navigating to OrangeHRM login page...');
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    console.log('Login page loaded');

    console.log('Entering username...');
    await page.getByPlaceholder('Username').fill('Admin');
    console.log('Username entered');

    console.log('Entering password...');
    await page.getByPlaceholder('Password').fill('admin123');
    console.log('Password entered');

    console.log('Clicking login button...');
    await page.getByRole('button', { name: 'Login' }).click();

    console.log('Waiting for Dashboard...');
    await expect(page).toHaveURL(/dashboard/);
    console.log('Login successful - Dashboard loaded');
    
    const loggedInUser = (await page.locator('.oxd-userdropdown-name').innerText()).trim();

    console.log('Logged-in user:', loggedInUser);

    console.log('Step 2: Navigating to Recruitment...');
    await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'Recruitment' }).click();
    console.log('Recruitment page loaded');

    console.log('Step 3: Clicking on Vacancies...');
    await page.getByRole('link', { name: 'Vacancies' }).click();
    console.log('Vacancies page loaded');

    // Step 4: Click on Add button
    console.log('Step 4: Clicking Add button...');
    await page.getByText('Add', { exact: true }).click();
    console.log('Add Vacancy page loaded');
    // await expect(page.getByRole('heading', { name: 'Add Vacancy' })).toBeVisible();

    // Step 5: Fill in vacancy details
    console.log('Step 5: Filling vacancy details...');
    const vacancyName = page.locator('.oxd-input-group').filter({ hasText: 'Vacancy Name' }).locator('input');

    const uniqueVacancyName = `Senior Software Test Engineer ${Date.now()}`;

    await vacancyName.fill(uniqueVacancyName);
    console.log('Vacancy name filled');
    
    console.log('Opening Job Title dropdown...');
    await page.locator('.oxd-select-wrapper').nth(0).click();

    console.log('Waiting for Job Title option...');

    const jobTitleOption = page.getByRole('option', { name: 'QA Engineer' });

    await expect(jobTitleOption).toBeVisible({ timeout: 15000 });

    console.log('Selecting Job Title: QA Engineer...');

    await jobTitleOption.click();

    console.log('Job Title selected');
    console.log('Entering description...');
    await page.getByPlaceholder('Type description here').fill('We are looking for a skilled backend software engineer to join our team.');
    console.log('Description filled');
    // for hiring manager, we will use the logged-in user as the hiring manager
    console.log('Selecting Hiring Manager...');
    const hiringManager = page.getByPlaceholder('Type for hints...');

    await hiringManager.click();
    await hiringManager.fill(loggedInUser);
    console.log('Waiting for Hiring Manager autocomplete...');
    await page.waitForTimeout(1000);

    const firstOption = page.locator('.oxd-autocomplete-option').first();

    await expect(firstOption).toBeVisible({ timeout: 20000 });
    console.log('Hiring Manager option displayed');
    await firstOption.click();
    console.log('Hiring Manager selected');
    console.log('Entering Number of Positions...');
    await page.locator('input.oxd-input').nth(2).fill('3');
    

  // Click Save
const toastPromise = page.evaluate(() => {
  return new Promise<string>((resolve) => {
    const observer = new MutationObserver(() => {
      const toast = document.querySelector(
        '.oxd-toast-content.oxd-toast-content--success .oxd-toast-content-text'
      );

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

console.log('Clicking Save...');

await page.getByRole('button', { name: 'Save' }).click();

console.log('Save button clicked');

const message = await toastPromise;

console.log('================================');
console.log('TOAST MESSAGE:', JSON.stringify(message));
console.log('================================');

expect(message).toMatch(/Successfully Saved|Success/i);
console.log('message:', message);

console.log('Toast message verified successfully');

fs.writeFileSync('tests/vacancy-name.txt', uniqueVacancyName);
console.log('Vacancy name saved:', uniqueVacancyName);
  });