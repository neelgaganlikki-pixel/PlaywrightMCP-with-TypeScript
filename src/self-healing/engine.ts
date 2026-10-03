import { Page, Locator } from '@playwright/test';
import {
  CandidateLocator,
  ElementDefinition,
  HealingEvent,
  FailureClassification,
} from './types';
import { config } from './config';
import { HealingLogger } from './logger';
import { historyManager } from './history';
import { LocatorStrategyEngine } from './locator-strategy';
import { ElementValidator } from './validator';
import { reporter } from './reporter';

/**
 * Central Self-Healing Engine.
 * Manages action execution, locator failure detection, fallback evaluation,
 * element validation, healing recording, and learning.
 */
export class SelfHealingEngine {
  private static instance: SelfHealingEngine;

  private constructor() {}

  public static getInstance(): SelfHealingEngine {
    if (!SelfHealingEngine.instance) {
      SelfHealingEngine.instance = new SelfHealingEngine();
    }
    return SelfHealingEngine.instance;
  }

  /**
   * Executes a Playwright action with automatic self-healing resilience.
   */
  public async executeAction<T>(
    page: Page,
    def: ElementDefinition,
    action: string,
    actionFn: (locator: Locator, timeoutMs: number) => Promise<T>,
    options?: { testName?: string; timeout?: number }
  ): Promise<T> {
    const cfg = config.getConfig();
    const primaryLocator = ElementValidator.resolvePlaywrightLocator(page, def.primary);

    const testName = options?.testName || 'Playwright Test';
    const primaryTimeout = options?.timeout || cfg.primaryTimeoutMs;

    // If self-healing is disabled globally, execute primary action directly
    if (!cfg.enabled) {
      return await actionFn(primaryLocator, primaryTimeout);
    }

    // Phase 1: Attempt action with primary locator first
    try {
      return await actionFn(primaryLocator, primaryTimeout);
    } catch (primaryError: any) {
      // Check if the failure is a genuine locator issue suitable for healing
      if (!this.isLocatorFailure(primaryError)) {
        // Genuine application, assertion, network, or environment issue: DO NOT HIDE
        HealingLogger.debug(
          `Action [${action}] failed with non-locator error. Skipping self-healing: ${primaryError.message}`
        );
        throw primaryError;
      }

      // Phase 2: Locator failed, initiate healing sequence
      HealingLogger.logHealingStart(
        testName,
        def.page || 'GenericPage',
        def.name,
        action,
        def.primary,
        primaryError.message
      );

      // Generate prioritized candidates
      const allCandidates = LocatorStrategyEngine.generateCandidates(def, testName);
      // Skip primary locator since it already failed
      const fallbackCandidates = allCandidates.filter((c) => c.selector !== def.primary);

      const maxAttempts = Math.min(cfg.maxAttempts, fallbackCandidates.length);
      const fallbacksAttempted: string[] = [];

      for (let i = 0; i < maxAttempts; i++) {
        const candidate = fallbackCandidates[i];
        fallbacksAttempted.push(candidate.selector);

        HealingLogger.logCandidateAttempt(i + 1, maxAttempts, candidate);

        // Validate candidate before acting (uniqueness, visibility, interactability)
        const validation = await ElementValidator.validateCandidate(page, candidate, def, action);

        if (!validation.valid || !validation.locator) {
          HealingLogger.logCandidateFailure(candidate, validation.reason || 'Validation failed');
          continue;
        }

        // Phase 3: Execute action on validated candidate
        try {
          const result = await actionFn(validation.locator, cfg.candidateTimeoutMs);

          // Success: element healed!
          const elementKey = `${def.page || 'GenericPage'}.${def.name}`;
          const healingEvent: HealingEvent = {
            id: `heal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            timestamp: new Date().toISOString(),
            testName,
            pageName: def.page || 'GenericPage',
            elementName: def.name,
            action,
            primaryLocator: def.primary,
            healedLocator: candidate.selector,
            fallbacksAttempted,
            attemptCount: i + 1,
            confidence: validation.score,
            source: candidate.source,
            success: true,
          };

          // Record in persistent history & learning engine
          historyManager.recordSuccess(elementKey, def.primary, candidate.selector, testName);

          // Record in run reporter
          reporter.recordEvent(healingEvent);
          reporter.generateReports();

          // Log formatted healing event
          HealingLogger.logHealingSuccess(healingEvent);

          return result;
        } catch (actionError: any) {
          HealingLogger.logCandidateFailure(
            candidate,
            `Action execution failed on candidate: ${actionError.message}`
          );
          // If this was a previously learned locator that now failed, update history
          const elementKey = `${def.page || 'GenericPage'}.${def.name}`;
          historyManager.recordFailure(elementKey, candidate.selector);
        }
      }

      // Phase 4: All fallbacks exhausted. Fail safely and rethrow original error
      const failedEvent: HealingEvent = {
        id: `fail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        testName,
        pageName: def.page || 'GenericPage',
        elementName: def.name,
        action,
        primaryLocator: def.primary,
        healedLocator: 'NONE',
        fallbacksAttempted,
        attemptCount: maxAttempts,
        confidence: 0,
        source: 'primary',
        success: false,
        failureReason: `All ${maxAttempts} fallback candidates failed or were invalid.`,
      };
      reporter.recordEvent(failedEvent);
      reporter.generateReports();

      HealingLogger.logHealingExhausted(def.name, action, maxAttempts, primaryError);
      throw primaryError;
    }
  }

  /**
   * Discerns whether an error is a legitimate locator/element identification problem
   * versus a real application bug, network failure, or assertion failure.
   */
  public isLocatorFailure(error: any): boolean {
    if (!error) return false;
    const msg = (error.message || '').toLowerCase();

    // Do NOT heal assertion failures
    if (
      msg.includes('expect(') ||
      msg.includes('tohavetext') ||
      msg.includes('tohavevalue') ||
      msg.includes('tohaveurl') ||
      msg.includes('assertionerror') ||
      error.name === 'AssertionError'
    ) {
      return false;
    }

    // Do NOT heal navigation/network/browser failures
    if (
      msg.includes('net::err') ||
      msg.includes('navigation failed') ||
      msg.includes('target closed') ||
      msg.includes('browser has been closed') ||
      msg.includes('crash')
    ) {
      return false;
    }

    // Locator failure markers in Playwright
    const locatorFailureMarkers = [
      'waiting for locator',
      'element is not visible',
      'element is not attached',
      'element is detached',
      'strict mode violation',
      'timeout',
      'waiting for selector',
      'element is not enabled',
      'element is not interactable',
      'cannot find element',
      'failed to find element',
      'invalid selector',
      'not a valid selector',
      'unexpected token',
      'syntaxerror',
      'failed to execute',
      'is not a valid',
    ];

    return locatorFailureMarkers.some((marker) => msg.includes(marker));
  }

  /**
   * Classifies failures according to Section 25.
   */
  public classifyFailure(error: any): FailureClassification {
    if (!error) return 'UNKNOWN';
    const msg = (error.message || '').toLowerCase();

    if (this.isLocatorFailure(error)) {
      return 'LOCATOR FAILURE';
    }
    if (
      msg.includes('expect(') ||
      msg.includes('tohave') ||
      msg.includes('tobe') ||
      msg.includes('assertionerror')
    ) {
      return 'ASSERTION FAILURE';
    }
    if (msg.includes('login failed') || msg.includes('invalid credentials') || msg.includes('401') || msg.includes('403')) {
      return 'AUTHENTICATION FAILURE';
    }
    if (msg.includes('net::') || msg.includes('econnrefused') || msg.includes('enotfound') || msg.includes('500') || msg.includes('502') || msg.includes('503')) {
      return 'ENVIRONMENT FAILURE';
    }
    if (msg.includes('test data') || msg.includes('file not found') || msg.includes('enoent')) {
      return 'TEST DATA FAILURE';
    }
    if (msg.includes('jenkins') || msg.includes('pipeline') || msg.includes('exit code 1')) {
      return 'CI/CD FAILURE';
    }

    return 'APPLICATION FAILURE';
  }
}

export const engine = SelfHealingEngine.getInstance();
