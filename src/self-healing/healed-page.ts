import { Page, Locator } from '@playwright/test';
import { ElementDefinition } from './types';
import { HealedLocator } from './healed-locator';
import { locatorRepository } from './locator-repository';

/**
 * Enhanced Playwright Page wrapper with transparent self-healing locator generation.
 */
export class HealedPage {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Primary entry point for finding an element using structured ElementDefinition or name.
   */
  public find(target: string | ElementDefinition, pageName?: string): HealedLocator {
    const def = locatorRepository.resolve(target, pageName);
    return new HealedLocator(this.page, def);
  }

  /**
   * Overrides page.locator to return a self-healing HealedLocator.
   */
  public locator(selector: string, options?: Parameters<Page['locator']>[1]): HealedLocator {
    const def = locatorRepository.resolve(selector);
    const rawLoc = this.page.locator(selector, options);
    return new HealedLocator(this.page, def, rawLoc);
  }

  public getByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1]
  ): HealedLocator {
    const nameStr = options?.name ? String(options.name) : '';
    const selector = `role=${role}${nameStr ? `[name="${nameStr}"]` : ''}`;
    const def: ElementDefinition = {
      name: `Role_${role}_${nameStr || 'unnamed'}`,
      primary: selector,
      role: role as string,
      accessibleName: nameStr || undefined,
    };
    const raw = this.page.getByRole(role, options);
    return new HealedLocator(this.page, def, raw);
  }

  public getByPlaceholder(
    text: Parameters<Page['getByPlaceholder']>[0],
    options?: Parameters<Page['getByPlaceholder']>[1]
  ): HealedLocator {
    const textStr = String(text);
    const def: ElementDefinition = {
      name: `Placeholder_${textStr}`,
      primary: `[placeholder="${textStr}"]`,
      fallbacks: [
        `input[placeholder*="${textStr}" i]`,
        `[data-testid*="${textStr}" i]`,
        `[name*="${textStr}" i]`,
      ],
    };
    const raw = this.page.getByPlaceholder(text, options);
    return new HealedLocator(this.page, def, raw);
  }

  public getByText(
    text: Parameters<Page['getByText']>[0],
    options?: Parameters<Page['getByText']>[1]
  ): HealedLocator {
    const textStr = String(text);
    const def: ElementDefinition = {
      name: `Text_${textStr.substring(0, 30)}`,
      primary: `text="${textStr}"`,
      text: textStr,
      fallbacks: [
        `:has-text("${textStr}")`,
        `button:has-text("${textStr}")`,
        `a:has-text("${textStr}")`,
      ],
    };
    const raw = this.page.getByText(text, options);
    return new HealedLocator(this.page, def, raw);
  }

  public getByLabel(
    text: Parameters<Page['getByLabel']>[0],
    options?: Parameters<Page['getByLabel']>[1]
  ): HealedLocator {
    const textStr = String(text);
    const def: ElementDefinition = {
      name: `Label_${textStr}`,
      primary: `label:has-text("${textStr}")`,
      accessibleName: textStr,
    };
    const raw = this.page.getByLabel(text, options);
    return new HealedLocator(this.page, def, raw);
  }

  public getByTestId(testId: Parameters<Page['getByTestId']>[0]): HealedLocator {
    const idStr = String(testId);
    const def: ElementDefinition = {
      name: `TestId_${idStr}`,
      primary: `[data-testid="${idStr}"]`,
      fallbacks: [`[data-test="${idStr}"]`, `[data-qa="${idStr}"]`, `#${idStr}`],
    };
    const raw = this.page.getByTestId(testId);
    return new HealedLocator(this.page, def, raw);
  }

  // ==========================================
  // ACTION SHORTCUTS WITH HEALING
  // ==========================================

  public async click(selector: string, options?: Parameters<Page['click']>[1]): Promise<void> {
    return await this.locator(selector).click(options);
  }

  public async fill(selector: string, value: string, options?: Parameters<Page['fill']>[2]): Promise<void> {
    return await this.locator(selector).fill(value, options);
  }

  // ==========================================
  // PASS-THROUGH NATIVE PAGE DELEGATION
  // ==========================================

  public async goto(url: string, options?: Parameters<Page['goto']>[1]) {
    return await this.page.goto(url, options);
  }

  public async waitForURL(url: Parameters<Page['waitForURL']>[0], options?: Parameters<Page['waitForURL']>[1]) {
    return await this.page.waitForURL(url, options);
  }

  public async waitForTimeout(timeout: number) {
    return await this.page.waitForTimeout(timeout);
  }

  public async evaluate<R, Arg>(pageFunction: any, arg?: Arg): Promise<R> {
    return await this.page.evaluate(pageFunction, arg);
  }

  public async screenshot(options?: Parameters<Page['screenshot']>[0]) {
    return await this.page.screenshot(options);
  }

  public url(): string {
    return this.page.url();
  }

  public async close(options?: Parameters<Page['close']>[0]) {
    return await this.page.close(options);
  }

  public get rawPage(): Page {
    return this.page;
  }
}

/**
 * Creates a transparent Proxy over Playwright's Page so any unhandled native method or
 * property passes directly to Playwright Page while augmented locator methods provide self-healing.
 */
export function wrapWithHealing(page: Page): HealedPage & Page {
  const healed = new HealedPage(page);

  return new Proxy(healed as any, {
    get(target, prop, receiver) {
      if (prop in target) {
        const val = (target as any)[prop];
        return typeof val === 'function' ? val.bind(target) : val;
      }
      const pageVal = (page as any)[prop];
      return typeof pageVal === 'function' ? pageVal.bind(page) : pageVal;
    },
  });
}
