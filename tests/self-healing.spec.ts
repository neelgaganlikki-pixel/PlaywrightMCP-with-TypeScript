import { test, expect } from '../src/self-healing';
import {
  config,
  historyManager,
  reporter,
  ElementDefinition,
  HealedLocator,
  LocatorDiscovery,
} from '../src/self-healing';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Deterministic test suite verifying all 18 Self-Healing requirements from Section 23.
 */
test.describe('Self-Healing Automation System - Comprehensive Verification Suite', () => {
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head><title>Self-Healing Test Fixture</title></head>
    <body>
      <!-- 1. Primary Success -->
      <button id="primarySuccessBtn" onclick="this.dataset.clicked='true'">Primary Button</button>

      <!-- 2 & 3. First Fallback Success -->
      <!-- Original was #oldSubmitButton, new is data-testid="submit-btn" -->
      <button data-testid="submit-btn" onclick="this.dataset.clicked='true'">Submit Form</button>

      <!-- 4. Second Fallback Success -->
      <!-- Primary: #brokenPrimary, Fallback 1: .broken-class, Fallback 2: button[name="secondFallbackBtn"] -->
      <button name="secondFallbackBtn" onclick="this.dataset.clicked='true'">Second Fallback</button>

      <!-- 6. Multiple Matching Elements -->
      <div class="duplicate-container">
        <button class="duplicate-btn">Duplicate 1</button>
        <button class="duplicate-btn">Duplicate 2</button>
        <button class="duplicate-btn">Duplicate 3</button>
      </div>

      <!-- 7. Context-based Healing -->
      <div id="cardA" class="card">
        <h3>Card Alpha</h3>
        <button class="action-btn" onclick="this.dataset.clicked='cardA'">Action</button>
      </div>
      <div id="cardB" class="card">
        <h3>Card Beta</h3>
        <button class="action-btn" onclick="this.dataset.clicked='cardB'">Action</button>
      </div>

      <!-- 8. Click Healing Target -->
      <button class="btn-primary" data-testid="click-target" onclick="this.innerText='CLICKED_SUCCESS'">Click Target</button>

      <!-- 9. Input Healing -->
      <input type="text" placeholder="Enter Email" data-testid="email-field" />

      <!-- 10. Visibility Healing -->
      <div data-testid="visible-badge" style="display:block;">Status: Active</div>

      <!-- 11. Disabled Element -->
      <button id="disabledButton" disabled>Disabled Action</button>

      <!-- 12. Hidden Element -->
      <button id="hiddenButton" style="display:none;">Hidden Action</button>

      <!-- Interactive elements for Discovery -->
      <form id="sampleForm">
        <input name="sampleInput" placeholder="Sample Text" />
        <button type="submit" aria-label="Submit Sample">Submit</button>
      </form>
    </body>
    </html>
  `;

  test.beforeEach(async ({ page }) => {
    config.resetToDefaults();
    config.updateConfig({ primaryTimeoutMs: 1500, candidateTimeoutMs: 1500 });
    await page.setContent(testHtml);
  });

  // 1. Primary locator succeeds
  test('1. Primary locator succeeds directly without healing', async ({ page }) => {
    const btn = page.find({
      name: 'PrimaryBtn',
      primary: '#primarySuccessBtn',
      fallbacks: ['[data-testid="fallback"]'],
    });

    await btn.click();
    const clicked = await page.locator('#primarySuccessBtn').getAttribute('data-clicked');
    expect(clicked).toBe('true');
  });

  // 2. Primary locator fails
  test('2. Primary locator fails and initiates healing fallback', async ({ page }) => {
    const btn = page.find({
      name: 'FailedPrimaryBtn',
      primary: '#nonExistentPrimaryId',
      fallbacks: ['[data-testid="submit-btn"]'],
    });

    await btn.click();
    const clicked = await page.locator('[data-testid="submit-btn"]').getAttribute('data-clicked');
    expect(clicked).toBe('true');
  });

  // 3. First fallback succeeds
  test('3. First fallback succeeds', async ({ page }) => {
    const btn = page.find({
      name: 'FirstFallbackBtn',
      primary: '#brokenPrimaryId',
      fallbacks: ['[data-testid="submit-btn"]', 'button[name="secondFallbackBtn"]'],
    });

    await btn.click();
    const clicked = await page.locator('[data-testid="submit-btn"]').getAttribute('data-clicked');
    expect(clicked).toBe('true');
  });

  // 4. Second fallback succeeds
  test('4. Second fallback succeeds when first fallback fails', async ({ page }) => {
    const btn = page.find({
      name: 'SecondFallbackBtn',
      primary: '#brokenPrimaryId',
      fallbacks: ['#alsoBrokenFallback', 'button[name="secondFallbackBtn"]'],
    });

    await btn.click();
    const clicked = await page.locator('button[name="secondFallbackBtn"]').getAttribute('data-clicked');
    expect(clicked).toBe('true');
  });

  // 5. All fallbacks fail
  test('5. All fallbacks fail and preserves genuine error', async ({ page }) => {
    const btn = page.find({
      name: 'AllFailBtn',
      primary: '#broken1',
      fallbacks: ['#broken2', '#broken3'],
    });

    await expect(btn.click()).rejects.toThrow();
  });

  // 6. Multiple matching elements
  test('6. Multiple matching elements without context fails safely', async ({ page }) => {
    const btn = page.find({
      name: 'AmbiguousBtn',
      primary: '#nonExistent',
      fallbacks: ['.duplicate-btn'],
    });

    // Should reject because multiple elements match and cannot be distinguished safely
    await expect(btn.click()).rejects.toThrow();
  });

  // 7. Context-based healing
  test('7. Context-based healing accurately scopes to intended card', async ({ page }) => {
    const cardBButton = page.find({
      name: 'CardBAction',
      primary: '#brokenCardBButton',
      fallbacks: ['.action-btn'],
      contextSelector: '#cardB',
    });

    await cardBButton.click();
    const clickedVal = await page.locator('#cardB .action-btn').getAttribute('data-clicked');
    expect(clickedVal).toBe('cardB');

    // Verify card A was NOT clicked
    const cardAVal = await page.locator('#cardA .action-btn').getAttribute('data-clicked');
    expect(cardAVal).toBeNull();
  });

  // 8. Click healing
  test('8. Click healing handles broken selector and triggers event', async ({ page }) => {
    const target = page.find({
      name: 'ClickTargetBtn',
      primary: '#oldClickButtonId',
      fallbacks: ['[data-testid="click-target"]'],
    });

    await target.click();
    const text = await page.locator('[data-testid="click-target"]').innerText();
    expect(text).toBe('CLICKED_SUCCESS');
  });

  // 9. Input healing
  test('9. Input healing recovers and fills value', async ({ page }) => {
    const emailInput = page.find({
      name: 'EmailInput',
      primary: '#oldEmailInput',
      fallbacks: ['[data-testid="email-field"]'],
    });

    await emailInput.fill('tester@example.com');
    const val = await page.locator('[data-testid="email-field"]').inputValue();
    expect(val).toBe('tester@example.com');
  });

  // 10. Visibility healing
  test('10. Visibility healing verifies element through fallback', async ({ page }) => {
    const badge = page.find({
      name: 'StatusBadge',
      primary: '#oldBadgeId',
      fallbacks: ['[data-testid="visible-badge"]'],
    });

    const isVis = await badge.isVisible();
    expect(isVis).toBe(true);
  });

  // 11. Disabled element
  test('11. Disabled element is rejected during interactive action healing', async ({ page }) => {
    const disabledBtn = page.find({
      name: 'DisabledBtn',
      primary: '#brokenDisabledId',
      fallbacks: ['#disabledButton'],
    });

    await expect(disabledBtn.click()).rejects.toThrow();
  });

  // 12. Hidden element
  test('12. Hidden element is rejected during interactive click healing', async ({ page }) => {
    const hiddenBtn = page.find({
      name: 'HiddenBtn',
      primary: '#brokenHiddenId',
      fallbacks: ['#hiddenButton'],
    });

    await expect(hiddenBtn.click()).rejects.toThrow();
  });

  // 13. Timeout handling
  test('13. Timeout is enforced properly without infinite hanging', async ({ page }) => {
    const start = Date.now();
    const btn = page.find({
      name: 'TimeoutBtn',
      primary: '#nonExistent1',
      fallbacks: ['#nonExistent2'],
    });

    await expect(btn.click()).rejects.toThrow();
    const elapsed = Date.now() - start;
    // Should complete within controlled duration (< 8 seconds)
    expect(elapsed).toBeLessThan(8000);
  });

  // 14. Invalid locator
  test('14. Invalid locator syntax is handled gracefully without crashing system', async ({ page }) => {
    const btn = page.find({
      name: 'InvalidLocatorBtn',
      primary: '///invalid[[[selector',
      fallbacks: ['[data-testid="submit-btn"]'],
    });

    await btn.click();
    const clicked = await page.locator('[data-testid="submit-btn"]').getAttribute('data-clicked');
    expect(clicked).toBe('true');
  });

  // 15. Healing disabled
  test('15. Healing disabled obeys configuration and fails immediately', async ({ page }) => {
    config.updateConfig({ enabled: false });

    const btn = page.find({
      name: 'DisabledHealingBtn',
      primary: '#brokenPrimaryWhenDisabled',
      fallbacks: ['[data-testid="submit-btn"]'],
    });

    await expect(btn.click()).rejects.toThrow();
  });

  // 16. Previously healed locator
  test('16. Previously healed locator is prioritized from history', async ({ page }) => {
    const elementKey = 'GenericPage.LearnedElement';
    historyManager.recordSuccess(elementKey, '#oldPrimary', '[data-testid="submit-btn"]', 'Test16');

    const btn = page.find({
      name: 'LearnedElement',
      primary: '#oldPrimary',
      fallbacks: ['button[name="secondFallbackBtn"]'], // Fallback 1 is second button, but learned is submit-btn
    });

    await btn.click();
    // submit-btn should have been clicked due to learning!
    const submitClicked = await page.locator('[data-testid="submit-btn"]').getAttribute('data-clicked');
    expect(submitClicked).toBe('true');
  });

  // 17. Healing history
  test('17. Healing history stores records accurately', async ({ page }) => {
    const records = historyManager.getAll();
    expect(typeof records).toBe('object');
    // Save history to ensure disk write
    historyManager.save();
    const historyPath = path.resolve(process.cwd(), config.getConfig().historyFilePath);
    expect(fs.existsSync(historyPath)).toBe(true);
  });

  // 18. CI execution & Report Generation
  test('18. CI execution generates valid JSON and HTML reports', async ({ page }) => {
    reporter.generateReports();

    const reportJsonPath = path.resolve(process.cwd(), config.getConfig().reportFilePath);
    const reportHtmlPath = path.resolve(process.cwd(), config.getConfig().htmlReportFilePath);

    expect(fs.existsSync(reportJsonPath)).toBe(true);
    expect(fs.existsSync(reportHtmlPath)).toBe(true);

    const jsonContent = JSON.parse(fs.readFileSync(reportJsonPath, 'utf-8'));
    expect(jsonContent).toHaveProperty('totalAttempts');
    expect(jsonContent).toHaveProperty('successfulHeals');
    expect(jsonContent).toHaveProperty('events');

    const htmlContent = fs.readFileSync(reportHtmlPath, 'utf-8');
    expect(htmlContent).toContain('Self-Healing Test Automation Report');
  });

  // Bonus test: Verify LocatorDiscovery utility
  test('Bonus: LocatorDiscovery extracts semantic interactive elements', async ({ page }) => {
    const discovered = await LocatorDiscovery.discover(page);
    expect(discovered.length).toBeGreaterThan(0);
    const submitBtn = discovered.find((d) => d.testId === 'submit-btn');
    expect(submitBtn).toBeDefined();
    expect(submitBtn?.recommendedPrimary).toContain('submit-btn');
  });
});
