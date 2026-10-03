import { Locator, Page } from '@playwright/test';
import { CandidateLocator, ElementDefinition } from './types';
import { config } from './config';
import { HealingLogger } from './logger';

export interface ValidationResult {
  valid: boolean;
  score: number;
  reason?: string;
  locator?: Locator;
}

/**
 * Validates candidate elements before interaction to ensure integrity and safety.
 * Verifies existence, visibility, enabled state, uniqueness, and contextual alignment.
 */
export class ElementValidator {
  /**
   * Evaluates whether a candidate locator represents the intended element.
   */
  public static async validateCandidate(
    page: Page,
    candidate: CandidateLocator,
    def: ElementDefinition,
    action: string
  ): Promise<ValidationResult> {
    const minConfidence = config.getConfig().confidenceThreshold;

    // Reject candidates below minimum confidence
    if (candidate.confidence < minConfidence) {
      return {
        valid: false,
        score: candidate.confidence,
        reason: `Confidence score ${candidate.confidence.toFixed(2)} is below threshold ${minConfidence}`,
      };
    }

    try {
      // Resolve Playwright locator
      const locator = this.resolvePlaywrightLocator(page, candidate.selector);

      // Check existence within candidate timeout
      const candidateTimeout = config.getConfig().candidateTimeoutMs;
      await locator.first().waitFor({ state: 'attached', timeout: candidateTimeout });

      const count = await locator.count();
      if (count === 0) {
        return {
          valid: false,
          score: 0,
          reason: 'Element not attached to DOM',
        };
      }

      // Check uniqueness: Multiple matches require contextual resolution
      if (count > 1) {
        // If context was provided, attempt to narrow down
        if (def.contextSelector) {
          const scoped = page.locator(def.contextSelector).locator(candidate.selector);
          const scopedCount = await scoped.count();
          if (scopedCount === 1) {
            return await this.validateSingleElement(scoped, def, candidate.confidence, action);
          }
        }

        // Section 8: If multiple elements match and cannot be distinguished reliably, FAIL SAFELY.
        return {
          valid: false,
          score: candidate.confidence * 0.4,
          reason: `Strictness violation: Found ${count} matching elements for [${candidate.selector}]. Ambiguous target; failing safely.`,
        };
      }

      return await this.validateSingleElement(locator, def, candidate.confidence, action);
    } catch (err: any) {
      return {
        valid: false,
        score: 0,
        reason: `Validation error: ${err.message}`,
      };
    }
  }

  private static async validateSingleElement(
    locator: Locator,
    def: ElementDefinition,
    baseConfidence: number,
    action: string
  ): Promise<ValidationResult> {
    let score = baseConfidence;

    // Check visibility
    const isVisible = await locator.isVisible().catch(() => false);
    if (!isVisible) {
      // If action is checking visibility or presence, it might be fine, but for actions like click/fill it must be visible
      if (action !== 'waitFor' && action !== 'isVisible') {
        return {
          valid: false,
          score: score * 0.3,
          reason: 'Element is hidden or not visible on screen',
        };
      }
    }

    // Check enabled state for interactive actions
    if (['click', 'dblclick', 'fill', 'type', 'press', 'check', 'uncheck'].includes(action)) {
      const isEnabled = await locator.isEnabled().catch(() => false);
      if (!isEnabled) {
        return {
          valid: false,
          score: 0,
          reason: 'Element is disabled; rejecting interaction',
        };
      }
    }

    // Tag compatibility check if tag specified
    if (def.tag) {
      const tagName = await locator.evaluate((el: HTMLElement) => el.tagName.toLowerCase()).catch(() => '');
      if (def.tag && tagName && def.tag.toLowerCase() !== tagName) {
        score -= 0.15;
      }
    }

    if (score < config.getConfig().confidenceThreshold) {
      return {
        valid: false,
        score,
        reason: `Final validated score ${score.toFixed(2)} dropped below threshold`,
      };
    }

    return {
      valid: true,
      score,
      locator,
    };
  }

  /**
   * Resolves selector strings including Playwright pseudo-selectors or role queries.
   */
  public static resolvePlaywrightLocator(page: Page, selector: string): Locator {
    // If selector starts with role=... (e.g. role=button[name="Login"])
    const roleMatch = selector.match(/^role=([a-zA-Z]+)\[name=['"]([^'"]+)['"]\]$/i);
    if (roleMatch) {
      const [, role, name] = roleMatch;
      return page.getByRole(role as any, { name });
    }

    // Standard Playwright locator
    return page.locator(selector);
  }
}
