const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/dashboard/);
  console.log('LOGIN_OK');

  const pimLink = page.locator('a[href*="/pim/viewPimModule"]');
  console.log('PIM_LINK_COUNT', await pimLink.count());
  if ((await pimLink.count()) > 0) {
    await pimLink.first().click();
    await page.waitForTimeout(2000);
    console.log('AFTER_PIM_URL', page.url());
  }

  const employeeListLink = page.locator('a[href*="/pim/viewEmployeeList"]');
  console.log('EMPLOYEE_LIST_COUNT', await employeeListLink.count());
  if ((await employeeListLink.count()) > 0) {
    await employeeListLink.first().click();
    await page.waitForTimeout(2000);
    console.log('AFTER_EMP_LIST_URL', page.url());
  }

  const addEmployeeButton = page.getByRole('button', { name: 'Add Employee' });
  console.log('ADD_EMP_COUNT', await addEmployeeButton.count());
  if ((await addEmployeeButton.count()) > 0) {
    await addEmployeeButton.first().click();
    await page.waitForTimeout(2000);
    console.log('AFTER_ADD_URL', page.url());
    console.log('FIRST_NAME_COUNT', await page.getByPlaceholder('First Name').count());
    console.log('EMP_ID_COUNT', await page.getByPlaceholder('Employee Id').count());
    console.log('CREATE_LOGIN_COUNT', await page.getByRole('checkbox', { name: 'Create Login Details' }).count());
  }

  await browser.close();
})();
