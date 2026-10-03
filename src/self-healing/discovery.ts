import { Page } from '@playwright/test';
import { DiscoveredElement } from './types';
import { HealingLogger } from './logger';

/**
 * Intelligent locator discovery utility.
 * Inspects meaningful interactive DOM elements and computes stable semantic candidate locators.
 */
export class LocatorDiscovery {
  /**
   * Scans the active page for meaningful interactive elements.
   */
  public static async discover(page: Page): Promise<DiscoveredElement[]> {
    try {
      const rawElements = await page.evaluate(() => {
        const interactiveTags = [
          'button',
          'input',
          'select',
          'textarea',
          'a[href]',
          '[role="button"]',
          '[role="link"]',
          '[role="tab"]',
          '[role="menuitem"]',
          '[role="checkbox"]',
          '[role="radio"]',
          '[data-testid]',
          '[data-test]',
        ];

        const nodes = Array.from(document.querySelectorAll<HTMLElement>(interactiveTags.join(',')));
        const results: any[] = [];

        // Deduplicate and filter invisible/insignificant nodes
        for (const el of nodes) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

          const tag = el.tagName.toLowerCase();
          const id = el.id || undefined;
          const name = el.getAttribute('name') || undefined;
          const type = el.getAttribute('type') || undefined;
          const role = el.getAttribute('role') || undefined;
          const ariaLabel = el.getAttribute('aria-label') || undefined;
          const placeholder = el.getAttribute('placeholder') || undefined;
          const testId =
            el.getAttribute('data-testid') ||
            el.getAttribute('data-test') ||
            el.getAttribute('data-qa') ||
            undefined;
          const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').substring(0, 80);
          const className = el.className && typeof el.className === 'string' ? el.className.trim() : undefined;

          results.push({
            tag,
            id,
            name,
            type,
            role,
            ariaLabel,
            placeholder,
            testId,
            text: text || undefined,
            className,
          });
        }

        return results;
      });

      // Construct semantic locators and fallbacks
      const discovered: DiscoveredElement[] = rawElements.map((item) => {
        const fallbacks: string[] = [];

        let primary = '';

        if (item.testId) {
          primary = `[data-testid="${item.testId}"]`;
        } else if (item.id && !/\d{5,}/.test(item.id)) {
          // Avoid dynamic numeric IDs
          primary = `#${item.id}`;
        } else if (item.name) {
          primary = `${item.tag}[name="${item.name}"]`;
        } else if (item.ariaLabel) {
          primary = `[aria-label="${item.ariaLabel}"]`;
        } else if (item.role && item.text) {
          primary = `role=${item.role}[name="${item.text}"]`;
        } else if (item.placeholder) {
          primary = `[placeholder="${item.placeholder}"]`;
        } else if (item.text && item.text.length <= 40) {
          primary = `${item.tag}:has-text("${item.text}")`;
        } else {
          primary = item.tag;
        }

        // Add alternate fallbacks
        if (item.testId && primary !== `[data-testid="${item.testId}"]`) {
          fallbacks.push(`[data-testid="${item.testId}"]`);
        }
        if (item.id && primary !== `#${item.id}`) {
          fallbacks.push(`#${item.id}`);
        }
        if (item.name && primary !== `[name="${item.name}"]`) {
          fallbacks.push(`[name="${item.name}"]`);
        }
        if (item.ariaLabel && primary !== `[aria-label="${item.ariaLabel}"]`) {
          fallbacks.push(`[aria-label="${item.ariaLabel}"]`);
        }
        if (item.placeholder && primary !== `[placeholder="${item.placeholder}"]`) {
          fallbacks.push(`[placeholder="${item.placeholder}"]`);
        }
        if (item.text && item.text.length <= 40 && !primary.includes(item.text)) {
          fallbacks.push(`${item.tag}:has-text("${item.text}")`);
        }

        return {
          ...item,
          recommendedPrimary: primary,
          recommendedFallbacks: Array.from(new Set(fallbacks)),
        };
      });

      HealingLogger.debug(`Discovered ${discovered.length} semantic interactive elements on page`);
      return discovered;
    } catch (err: any) {
      HealingLogger.warn(`Locator discovery encountered an error: ${err.message}`);
      return [];
    }
  }
}
