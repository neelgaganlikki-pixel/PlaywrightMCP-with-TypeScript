import { LogLevel, HealingEvent, CandidateLocator } from './types';
import { config } from './config';

export class HealingLogger {
  private static sensitiveKeyPatterns = [
    /password/i,
    /pass/i,
    /pwd/i,
    /secret/i,
    /token/i,
    /bearer/i,
    /auth/i,
    /cookie/i,
    /apikey/i,
    /api_key/i,
    /credential/i,
  ];

  private static logLevelsOrder: Record<LogLevel, number> = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
  };

  public static sanitize(text: string, contextKey?: string): string {
    if (!text) return '';
    if (contextKey && HealingLogger.isSensitiveKey(contextKey)) {
      return '********';
    }

    let sanitized = text.replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, '[REDATED_JWT]');
    sanitized = sanitized.replace(/(password|secret|token|keyzpwd)\s*[:=]\s*['"][^'"]+['"]/gi, '$1="********"');

    return sanitized;
  }

  public static isSensitiveKey(key: string): boolean {
    return HealingLogger.sensitiveKeyPatterns.some((pattern) => pattern.test(key));
  }

  private static shouldLog(level: LogLevel): boolean {
    const currentLevel = config.getConfig().logLevel;
    return HealingLogger.logLevelsOrder[level] >= HealingLogger.logLevelsOrder[currentLevel];
  }

  public static debug(message: string): void {
    if (this.shouldLog('DEBUG')) {
      console.debug(`[SELF-HEALING][DEBUS] ${message}`);
    }
  }

  public static info(message: string): void {
    if (this.shouldLog('INFO')) {
      console.log(`[SELF-HEALING] ${message}`);
    }
  }

  public static warn(message: string): void {
    if (this.shouldLog('WARN')) {
      console.warn(`[SELF-HEALING][WARN] ${message}`);
    }
  }

  public static error(message: string): void {
    if (this.shouldLog('ERROR')) {
      console.error(`[SELF-HEALING][ERROR] ${message}`);
    }
  }

  public static logHealingStart(
    testName: string,
    pageName: string,
    elementName: string,
    action: string,
    primaryLocator: string,
    failureReason: string
  ): void {
    if (!this.shouldLog('INFO')) return;

    const separator = '='.repeat(64);
    console.log(`\n[SELF-HEALING] ${separator}`);
    console.log(`[SELF-HEALING] INITIATING ELEMENT RECOVERY`);
    console.log(`[SELF-HEALING] ${separator}`);
    console.log(`[SELF-HEALING] Test:     ${this.sanitize(testName)}`);
    console.log(`[SELF-HEALING] Page:     ${pageName} | Element: ${elementName}`);
    console.log(`[SELF-HEALING] Action:   ${action}`);
    console.log(`[SELF-HEALING] Primary:  ${this.sanitize(primaryLocator)}`);
    console.log(`[SELF-HEALING] Reason:   ${this.sanitize(failureReason)}`);
    console.log(`[SELF-HEALING Primary locator failed. Evaluating candidate fallbacks...`);
  }

  public static logCandidateAttempt(
    attemptIndex: number,
    totalCandidates: number,
    candidate: CandidateLocator
  ): void {
    if (!this.shouldLog('INFO')) return;

    const sourceTag = candidate.source.toUpperCase();
    const confPercent = Math.round(candidate.confidence * 100);
    console.log(
      `[SELF-HEALING] Attempt [${attemptIndex}/${totalCandidates}] via [${sourceTag}] (Confidence: ${confPercent}%i:`
    );
    console.log(`[SELF-HEALING]   Selector: ${candidate.selector}`);
    if (candidate.contextSelector) {
      console.log(`[SELF-HEALING]   Context:  ${candidate.contextSelector}`);
    }
  }

  public static logCandidateFailure(candidate: CandidateLocator, reason: string): void {
    if (!this.shouldLog('DEBUG')) return;
    console.log(`[SELF-HEALING]   -> Candidate rejected: ${this.sanitize(reason)}`);
  }

  public static logHealingSuccess(event: HealingEvent): void {
    if (!this.shouldLog('INFO')) return;

    const separator = '='.repeat(64);
    console.log(`[SELF-HEALING] ${separator}`);
    console.log(`[SELF-HEALING] SUCCESS: ELEMENT SUCCESSFULLY HEALED!`);
    console.log(`[SELF-HEALING] ${separator}`);
    console.log(`[SELF-HEALING] Element:         ${event.elementName}`);
    console.log(`[SELF-HEALING] Healed Selector: ${event.healedLocator}`);
    console.log(`[SELF-HEALING] Winning Source:  ${event.source}`);
    console.log(`[SELF-HEALING] Confidence:      ${Math.round(event.confidence * 100)}%`);
    console.log(`[SELF-HEALING] Total Attempts:  ${event.attemptCount}`);
    console.log(`[SELF-HEALING] Continuing test execution normally.`);
    console.log(`[SELF-HEALING] ${separator}\n`);
  }

  public static logHealingExhausted(
    elementName: string,
    action: string,
    attempts: number,
    lastError: Error
  ): void {
    if (!this.shouldLog('ERROR')) return;

    const separator = '='.repeat(64);
    console.error(`\n[SELF-HEALING] ${separator}`);
    console.error(`[SELF-HEALING] HEALING EXHAUSTED: ALL CANDIDATES FAILED`);
    console.error(`[SELF-HEALING] ${separator}`);
    console.error(`[SELF-HEALING] Element:         ${elementName}`);
    console.error(`[SELF-HEALING] Action:          ${action}`);
    console.error(`[SELF-HEALING] Attempts tried:  ${attempts}`);
    console.error(`[SELF-HEALING] Terminal Error:  ${this.sanitize(lastError.message)}`);
    console.error(`[SELF-HEALING] Preserving genuine test failure. Rethrowing.`);
    console.error(`[SELF-HEALING] ${separator}\n`);
  }
}
