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
  await page.locator('input').nth(5).fill('9090');
  await page.locator('input[type="file"]').setInputFiles('test_data/employee_photo.png');

  const cb = page.locator('input[type="checkbox"]').first();
  console.log('checkbox count', await cb.count());
  if (await cb.count()) {
    await cb.check({ force: true });
    console.log('checkbox checked');
  }

  const allInputs = await page.locator('input').evaluateAll((els) => els.map((el) => ({
    type: el.type,
    placeholder: el.getAttribute('placeholder'),
    name: el.getAttribute('name'),
    value: el.value,
    checked: el.checked,
    className: el.className
  })));
  console.log('ALL_INPUTS_BEFORE_SAVE', JSON.stringify(allInputs, null, 2));

  const save = page.getByRole('button', { name: 'Save' }).last();
  console.log('save count', await save.count());
  await save.click();

  await page.waitForTimeout(5000);
  console.log('URL_AFTER_SAVE', page.url());
  console.log('BODY_AFTER_SAVE', (await page.locator('body').innerText()).slice(0, 4000));

  await browser.close();
})();
