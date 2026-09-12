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

  const inputs = await page.locator('input').evaluateAll((nodes) => nodes.map((n) => ({
    type: n.type,
    placeholder: n.getAttribute('placeholder'),
    name: n.getAttribute('name'),
    id: n.getAttribute('id'),
    value: n.value,
    ariaLabel: n.getAttribute('aria-label')
  })));

  console.log(JSON.stringify(inputs, null, 2));

  const labels = await page.locator('label, .oxd-input-group').evaluateAll((nodes) => nodes.map((n) => ({
    text: (n.textContent || '').replace(/\s+/g, ' ').trim(),
    className: n.className,
    role: n.getAttribute('role')
  })));

  console.log('--- labels ---');
  console.log(JSON.stringify(labels.slice(0, 80), null, 2));

  await browser.close();
})();
