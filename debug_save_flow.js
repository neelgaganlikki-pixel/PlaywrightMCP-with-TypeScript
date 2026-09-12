const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/dashboard/);
  console.log('LOGIN OK');

  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'PIM' }).click();
  await page.waitForURL(/\/pim\//);
  console.log('PIM OK');

  await page.getByRole('link', { name: 'Employee List' }).click();
  await page.waitForURL(/\/pim\/viewEmployeeList/);
  console.log('EMP LIST OK');

  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForSelector('input[placeholder="First Name"]');
  console.log('ADD EMP OK');

  await page.getByPlaceholder('First Name').fill('David');
  await page.getByPlaceholder('Middle Name').fill('Michael');
  await page.getByPlaceholder('Last Name').fill('Wilson');
  await page.getByPlaceholder('Employee Id').fill('9090');

  await page.locator('input[type="file"]').setInputFiles('test_data/employee_photo.png');
  console.log('PHOTO UPLOADED');

  const checkbox = page.locator('label:has-text("Create Login Details") input[type="checkbox"]');
  console.log('CHECKBOX COUNT', await checkbox.count());
  if (await checkbox.count()) {
    await checkbox.check();
    console.log('CHECKBOX CHECKED');
  }

  const uid = page.locator('input[placeholder="Username"]').last();
  const pwd = page.locator('input[placeholder="Password"]').first();
  const cpwd = page.locator('input[placeholder="Confirm Password"]').first();
  console.log('INPUT COUNTS', await uid.count(), await pwd.count(), await cpwd.count());
  await uid.fill('JohnKing0442');
  await pwd.fill('JkAuto2026X9m4');
  await cpwd.fill('JkAuto2026X9m4');
  console.log('LOGIN DATA FILLED');

  const statusDropdown = page.locator('.oxd-select-wrapper').filter({ hasText: 'Status' }).first();
  console.log('STATUS COUNT', await statusDropdown.count());
  if (await statusDropdown.count()) {
    await statusDropdown.click();
    console.log('STATUS OPENED');
    const option = page.getByRole('option', { name: 'Enabled' });
    console.log('OPTION COUNT', await option.count());
    if (await option.count()) {
      await option.click();
      console.log('OPTION CLICKED');
    }
  }

  const saveBtn = page.getByRole('button', { name: 'Save' }).last();
  console.log('SAVE COUNT', await saveBtn.count());
  if (await saveBtn.count()) {
    await saveBtn.click();
    console.log('SAVE CLICKED');
  }

  await page.waitForTimeout(5000);
  console.log('URL after save:', page.url());
  console.log('BODY START');
  console.log((await page.locator('body').innerText()).slice(0, 4000));
  console.log('BODY END');

  await browser.close();
})();
