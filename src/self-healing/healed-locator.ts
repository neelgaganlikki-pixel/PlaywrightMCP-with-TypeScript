import { Page, Locator } from '@playwright/test';
import { ElementDefinition } from './types';
import { engine } from './engine';
import { ElementValidator } from './validator';

/**
 * Enhanced Playwright Locator wrapper with action-level self-healing.
 */
export class HealedLocator {
  private page: Page;
  private def: ElementDefinition;
  private baseLocator: Locator;

  constructor(page: Page, target: string | ElementDefinition, baseLocator?: Locator) {
    this.page = page;
    if (typeof target === 'string') {
      this.def = {
        name: target,
        primary: target,
        page: 'GenericPage',
      };
    } else {
      this.def = target;
    }

    this.baseLocator = baseLocator || ElementValidator.resolvePlaywrightLocator(page, this.def.primary);
  }

  public get definition(): Readonly<ElementDefinition> {
    return this.def;
  }

  public rawLocator(): Locator {
    return this.baseLocator;
  }

  // ==========================================
  // ACTION-LEVEL SELF-HEALING WRAPPERS
  // ==========================================

  public async click(options?: Parameters<Locator['click']>[0]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'click',
      (loc, to) => loc.click({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async dblclick(options?: Parameters<Locator['dblclick']>[0]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'dblclick',
      (loc, to) => loc.dblclick({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async fill(value: string, options?: Parameters<Locator['fill']>[1]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'fill',
      (loc, to) => loc.fill(value, { ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async type(text: string, options?: Parameters<Locator['type']>[1]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'type',
      (loc, to) => loc.type(text, { ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async press(key: string, options?: Parameters<Locator['press']>[1]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'press',
      (loc, to) => loc.press(key, { ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async check(options?: Parameters<Locator['check']>[0]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'check',
      (loc, to) => loc.check({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async uncheck(options?: Parameters<Locator['uncheck']>[0]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'uncheck',
      (loc, to) => loc.uncheck({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async selectOption(
    values: Parameters<Locator['selectOption']>[0],
    options?: Parameters<Locator['selectOption']>[1]
  ): Promise<string[]> {
    return await engine.executeAction(
      this.page,
      this.def,
      'selectOption',
      (loc, to) => loc.selectOption(values, { ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async hover(options?: Parameters<Locator['hover']>[0]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'hover',
      (loc, to) => loc.hover({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async setInputFiles(
    files: Parameters<Locator['setInputFiles']>[0],
    options?: Parameters<Locator['setInputFiles']>[1]
  ): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'setInputFiles',
      (loc, to) => loc.setInputFiles(files, { ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async clear(options?: Parameters<Locator['clear']>[0]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'clear',
      (loc, to) => loc.clear({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async waitFor(options?: Parameters<Locator['waitFor']>[0]): Promise<void> {
    return await engine.executeAction(
      this.page,
      this.def,
      'waitFor',
      (loc, to) => loc.waitFor({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async isVisible(options?: Parameters<Locator['isVisible']>[0]): Promise<boolean> {
    const primaryVisible = await this.baseLocator.isVisible(options).catch(() => false);
    if (primaryVisible) return true;

    return await engine.executeAction(
      this.page,
      this.def,
      'isVisible',
      async (loc, to) => {
        const vis = await loc.isVisible(options);
        if (!vis) {
          throw new Error(`Element is not visible for locator: ${this.def.primary}`);
        }
        return true;
      },
      { timeout: options?.timeout }
    ).catch(() => false);
  }

  public async isEnabled(options?: Parameters<Locator['isEnabled']>[0]): Promise<boolean> {
    try {
      return await this.baseLocator.isEnabled(options);
    } catch {
      return await engine.executeAction(
        this.page,
        this.def,
        'isEnabled',
        (loc, to) => loc.isEnabled({ ...options, timeout: options?.timeout ?? to }),
        { timeout: options?.timeout }
      );
    }
  }

  public async innerText(options?: Parameters<Locator['innerText']>[0]): Promise<string> {
    return await engine.executeAction(
      this.page,
      this.def,
      'innerText',
      (loc, to) => loc.innerText({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async textContent(options?: Parameters<Locator['textContent']>[0]): Promise<string | null> {
    return await engine.executeAction(
      this.page,
      this.def,
      'textContent',
      (loc, to) => loc.textContent({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async inputValue(options?: Parameters<Locator['inputValue']>[0]): Promise<string> {
    return await engine.executeAction(
      this.page,
      this.def,
      'inputValue',
      (loc, to) => loc.inputValue({ ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async getAttribute(
    name: string,
    options?: Parameters<Locator['getAttribute']>[1]
  ): Promise<string | null> {
    return await engine.executeAction(
      this.page,
      this.def,
      'getAttribute',
      (loc, to) => loc.getAttribute(name, { ...options, timeout: options?.timeout ?? to }),
      { timeout: options?.timeout }
    );
  }

  public async count(): Promise<number> {
    return await this.baseLocator.count();
  }

  public first(): HealedLocator {
    return new HealedLocator(this.page, {
      ...this.def,
      name: `${this.def.name}:first`,
      primary: `${this.def.primary} >> nth=0`,
    }, this.baseLocator.first());
  }

  public last(): HealedLocator {
    return new HealedLocator(this.page, {
      ...this.def,
      name: `${this.def.name}:last`,
      primary: `${this.def.primary} >> nth=-1`,
    }, this.baseLocator.last());
  }

  public nth(index: number): HealedLocator {
    return new HealedLocator(this.page, {
      ...this.def,
      name: `${this.def.name}:nth(${index})`,
      primary: `${this.def.primary} >> nth=${index}`,
    }, this.baseLocator.nth(index));
  }

  public filter(options?: Parameters<Locator['filter']>[0]): HealedLocator {
    let newName = this.def.name;
    let newPrimary = this.def.primary;
    if (options?.hasText) {
      newName += `:hasText(${options.hasText})`;
      newPrimary += `:has-text("${options.hasText}")`;
    }
    const filteredBase = this.baseLocator.filter(options);
    return new HealedLocator(this.page, {
      ...this.def,
      name: newName,
      primary: newPrimary,
    }, filteredBase);
  }

  public locator(selectorOrLocator: string | Locator, options?: any): HealedLocator {
    const subSelector = typeof selectorOrLocator === 'string' ? selectorOrLocator : 'sub-locator';
    const combinedDef: ElementDefinition = {
      name: `${this.def.name} >> ${subSelector}`,
      page: this.def.page,
      primary: `${this.def.primary} >> ${subSelector}`,
      contextSelector: this.def.primary,
    };
    return new HealedLocator(this.page, combinedDef);
  }
}
