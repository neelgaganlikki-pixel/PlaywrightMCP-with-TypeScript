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

  const textNodes = await page.locator('body').evaluate(() => {
    const found = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.includes('Create Login Details') || text.includes('Employee Id') || text.includes('First Name')) {
        found.push({ tag: el.tagName, className: el.className, text: text.slice(0, 200), outer: el.outerHTML.slice(0, 800) });
      }
    }
    return found.slice(0, 20);
  });
  console.log(JSON.stringify(textNodes, null, 2));

  const checkboxHTML = await page.locator('input[type="checkbox"]').evaluateAll((els) => els.map(el => ({
    outer: el.outerHTML,
    checked: el.checked,
    attributes: Array.from(el.attributes).map(a => ({ name: a.name, value: a.value }))
  })));
  console.log('CHECKBOXES', JSON.stringify(checkboxHTML, null, 2));

  await browser.close();
})();
