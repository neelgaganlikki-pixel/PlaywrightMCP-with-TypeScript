const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/dashboard/);

  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'PIM' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();
  await page.getByRole('button', { name: 'Add' }).click();

  await page.getByPlaceholder('First Name').fill('David');
  await page.getByPlaceholder('Middle Name').fill('Michael');
  await page.getByPlaceholder('Last Name').fill('Wilson');

  const empId = page.locator('div').filter({ hasText: 'Employee Id' }).locator('input').first();
  await empId.waitFor({ state: 'visible' });
  await empId.fill('9090');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('test_data/employee_photo.png');

  const cb = page.locator('input[type="checkbox"]').first();
  await cb.check({ force: true });
  console.log('checkbox checked');

  await page.waitForTimeout(2000);

  const inputs = await page.locator('input').evaluateAll((els) => els.map((el) => ({
    type: el.type,
    placeholder: el.getAttribute('placeholder'),
    name: el.getAttribute('name'),
    className: el.className,
    value: el.value
  })));

  console.log(JSON.stringify(inputs, null, 2));
  console.log('--- body text ---');
  console.log((await page.locator('body').innerText()).slice(0, 5000));

  await browser.close();
})();
