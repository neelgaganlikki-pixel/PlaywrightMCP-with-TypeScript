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
 * Single Consolidated Verification Test:
 * Covers all 19 Self-Healing capabilities inside structured test steps.
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

  test('Self-Healing Engine - End-to-End Verification of All 19 Capabilities', async ({ page }) => {
    test.setTimeout(120000);

    const resetState = async () => {
      config.resetToDefaults();
      config.updateConfig({ primaryTimeoutMs: 1500, candidateTimeoutMs: 1500 });
      await page.setContent(testHtml);
    };

    await resetState();

    await test.step('1. Primary locator succeeds directly without healing', async () => {
      const btn = page.find({
        name: 'PrimaryBtn',
        primary: '#primarySuccessBtn',
        fallbacks: ['[data-testid="fallback"]'],
      });

      await btn.click();
      const clicked = await page.locator('#primarySuccessBtn').getAttribute('data-clicked');
      expect(clicked).toBe('true');
    });

    await test.step('2. Primary locator fails and initiates healing fallback', async () => {
      await resetState();
      const btn = page.find({
        name: 'FailedPrimaryBtn',
        primary: '#nonExistentPrimaryId',
        fallbacks: ['[data-testid="submit-btn"]'],
      });

      await btn.click();
      const clicked = await page.locator('[data-testid="submit-btn"]').getAttribute('data-clicked');
      expect(clicked).toBe('true');
    });

    await test.step('3. First fallback succeeds', async () => {
      await resetState();
      const btn = page.find({
        name: 'FirstFallbackBtn',
        primary: '#brokenPrimaryId',
        fallbacks: ['[data-testid="submit-btn"]', 'button[name="secondFallbackBtn"]'],
      });

      await btn.click();
      const clicked = await page.locator('[data-testid="submit-btn"]').getAttribute('data-clicked');
      expect(clicked).toBe('true');
    });

    await test.step('4. Second fallback succeeds when first fallback fails', async () => {
      await resetState();
      const btn = page.find({
        name: 'SecondFallbackBtn',
        primary: '#brokenPrimaryId',
        fallbacks: ['#alsoBrokenFallback', 'button[name="secondFallbackBtn"]'],
      });

      await btn.click();
      const clicked = await page.locator('button[name="secondFallbackBtn"]').getAttribute('data-clicked');
      expect(clicked).toBe('true');
    });

    await test.step('5. All fallbacks fail and preserves genuine error', async () => {
      await resetState();
      const btn = page.find({
        name: 'AllFailBtn',
        primary: '#broken1',
        fallbacks: ['#broken2', '#broken3'],
      });

      await expect(btn.click()).rejects.toThrow();
    });

    await test.step('6. Multiple matching elements without context fails safely', async () => {
      await resetState();
      const btn = page.find({
        name: 'AmbiguousBtn',
        primary: '#nonExistent',
        fallbacks: ['.duplicate-btn'],
      });

      await expect(btn.click()).rejects.toThrow();
    });

    await test.step('7. Context-based healing accurately scopes to intended card', async () => {
      await resetState();
      const cardBButton = page.find({
        name: 'CardBAction',
        primary: '#brokenCardBButton',
        fallbacks: ['.action-btn'],
        contextSelector: '#cardB',
      });

      await cardBButton.click();
      const clickedVal = await page.locator('#cardB .action-btn').getAttribute('data-clicked');
      expect(clickedVal).toBe('cardB');

      const cardAVal = await page.locator('#cardA .action-btn').getAttribute('data-clicked');
      expect(cardAVal).toBeNull();
    });

    await test.step('8. Click healing handles broken selector and triggers event', async () => {
      await resetState();
      const target = page.find({
        name: 'ClickTargetBtn',
        primary: '#oldClickButtonId',
        fallbacks: ['[data-testid="click-target"]'],
      });

      await target.click();
      const text = await page.locator('[data-testid="click-target"]').innerText();
      expect(text).toBe('CLICKED_SUCCESS');
    });

    await test.step('9. Input healing recovers and fills value', async () => {
      await resetState();
      const emailInput = page.find({
        name: 'EmailInput',
        primary: '#oldEmailInput',
        fallbacks: ['[data-testid="email-field"]'],
      });

      await emailInput.fill('tester@example.com');
      const val = await page.locator('[data-testid="email-field"]').inputValue();
      expect(val).toBe('tester@example.com');
    });

    await test.step('10. Visibility healing verifies element through fallback', async () => {
      await resetState();
      const badge = page.find({
        name: 'StatusBadge',
        primary: '#oldBadgeId',
        fallbacks: ['[data-testid="visible-badge"]'],
      });

      const isVis = await badge.isVisible();
      expect(isVis).toBe(true);
    });

    await test.step('11. Disabled element is rejected during interactive action healing', async () => {
      await resetState();
      const disabledBtn = page.find({
        name: 'DisabledBtn',
        primary: '#brokenDisabledId',
        fallbacks: ['#disabledButton'],
      });

      await expect(disabledBtn.click()).rejects.toThrow();
    });

    await test.step('12. Hidden element is rejected during interactive click healing', async () => {
      await resetState();
      const hiddenBtn = page.find({
        name: 'HiddenBtn',
        primary: '#brokenHiddenId',
        fallbacks: ['#hiddenButton'],
      });

      await expect(hiddenBtn.click()).rejects.toThrow();
    });

    await test.step('13. Timeout is enforced properly without infinite hanging', async () => {
      await resetState();
      const start = Date.now();
      const btn = page.find({
        name: 'TimeoutBtn',
        primary: '#nonExistent1',
        fallbacks: ['#nonExistent2'],
      });

      await expect(btn.click()).rejects.toThrow();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(8000);
    });

    await test.step('14. Invalid locator syntax is handled gracefully without crashing system', async () => {
      await resetState();
      const btn = page.find({
        name: 'InvalidLocatorBtn',
        primary: '///invalid[[[selector',
        fallbacks: ['[data-testid="submit-btn"]'],
      });

      await btn.click();
      const clicked = await page.locator('[data-testid="submit-btn"]').getAttribute('data-clicked');
      expect(clicked).toBe('true');
    });

    await test.step('15. Healing disabled obeys configuration and fails immediately', async () => {
      await resetState();
      config.updateConfig({ enabled: false });

      const btn = page.find({
        name: 'DisabledHealingBtn',
        primary: '#brokenPrimaryWhenDisabled',
        fallbacks: ['[data-testid="submit-btn"]'],
      });

      await expect(btn.click()).rejects.toThrow();
    });

    await test.step('16. Previously healed locator is prioritized from history', async () => {
      await resetState();
      const elementKey = 'GenericPage.LearnedElement';
      historyManager.recordSuccess(elementKey, '#oldPrimary', '[data-testid="submit-btn"]', 'Test16');

      const btn = page.find({
        name: 'LearnedElement',
        primary: '#oldPrimary',
        fallbacks: ['button[name="secondFallbackBtn"]'],
      });

      await btn.click();
      const submitClicked = await page.locator('[data-testid="submit-btn"]').getAttribute('data-clicked');
      expect(submitClicked).toBe('true');
    });

    await test.step('17. Healing history stores records accurately', async () => {
      const records = historyManager.getAll();
      expect(typeof records).toBe('object');
      historyManager.save();
      const historyPath = path.resolve(process.cwd(), config.getConfig().historyFilePath);
      expect(fs.existsSync(historyPath)).toBe(true);
    });

    await test.step('18. CI execution generates valid JSON and HTML reports', async () => {
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

    await test.step('19. LocatorDiscovery extracts semantic interactive elements', async () => {
      await resetState();
      const discovered = await LocatorDiscovery.discover(page);
      expect(discovered.length).toBeGreaterThan(0);
      const submitBtn = discovered.find((d) => d.testId === 'submit-btn');
      expect(submitBtn).toBeDefined();
      expect(submitBtn?.recommendedPrimary).toContain('submit-btn');
    });
  });
});