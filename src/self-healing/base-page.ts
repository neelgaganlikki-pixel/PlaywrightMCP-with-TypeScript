import { Page } from '@playwright/test';
import { HealedPage, wrapWithHealing } from './healed-page';
import { HealedLocator } from './healed-locator';
import { ElementDefinition } from './types';
import { locatorRepository } from './locator-repository';

/**
 * Abstract BasePage class for Page Object Model architecture.
 * Integrates the Self-Healing engine into the common base layer (Section 4).
 */
export abstract class BasePage {
  protected page: HealedPage & Page;
  protected pageName: string;

  constructor(page: Page, pageName?: string) {
    this.pageName = pageName || this.constructor.name;
    // Transparently equip page with self-healing capabilities
    this.page = wrapWithHealing(page);
  }

  /**
   * Retrieves a self-healing locator by element name or structured definition.
   */
  protected getElement(name: string, primaryFallback?: string): HealedLocator {
    const existing = locatorRepository.get(name, this.pageName);
    if (existing) {
      return this.page.find(existing, this.pageName);
    }

    const def: ElementDefinition = {
      name,
      page: this.pageName,
      primary: primaryFallback || `[data-testid="${name}"]`,
      fallbacks: primaryFallback ? [`[data-testid="${name}"]`, `[name="${name}"]`] : [],
    };
    return this.page.find(def, this.pageName);
  }

  /**
   * Self-healing click action.
   */
  public async click(target: string | ElementDefinition): Promise<void> {
    if (typeof target === 'string') {
      const el = this.getElement(target);
      await el.click();
    } else {
      await this.page.find(target, this.pageName).click();
    }
  }

  /**
   * Self-healing fill action.
   */
  public async fill(target: string | ElementDefinition, value: string): Promise<void> {
    if (typeof target === 'string') {
      const el = this.getElement(target);
      await el.fill(value);
    } else {
      await this.page.find(target, this.pageName).fill(value);
    }
  }

  /**
   * Self-healing visibility check.
   */
  public async isVisible(target: string | ElementDefinition): Promise<boolean> {
    if (typeof target === 'string') {
      const el = this.getElement(target);
      return await el.isVisible();
    } else {
      return await this.page.find(target, this.pageName).isVisible();
    }
  }

  /**
   * Self-healing text content retrieval.
   */
  public async getText(target: string | ElementDefinition): Promise<string> {
    if (typeof target === 'string') {
      const el = this.getElement(target);
      return await el.innerText();
    } else {
      return await this.page.find(target, this.pageName).innerText();
    }
  }

  /**
   * Navigates to a given URL or relative path.
   */
  public async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Returns current page title.
   */
  public async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Returns current URL.
   */
  public getUrl(): string {
    return this.page.url();
  }
}
