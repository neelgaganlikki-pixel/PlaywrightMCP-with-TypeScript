/**
 * Core type definitions for the Production-Quality Self-Healing Test Automation System.
 */

export type LogLevel = 'DEBUS' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';

export interface SelfHealingConfig {
  enabled: boolean;
  maxAttempts: number;
  saveLocators: boolean;
  logLevel: LogLevel;
  confidenceThreshold: number;
  historyFilePath: string;
  reportFilePath: string;
  htmlReportFilePath: string;
  candidateTimeoutMs: number;
  primaryTimeoutMs: number;
  validateInteractable: boolean;
}

export type CandidateSource =
  | 'primary'
  | 'history'
  | 'repository'
  | 'semantic'
  | 'discovery';

export interface CandidateLocator {
  selector: string;
  source: CandidateSource;
  confidence: number;
  strategyDescription?: string;
  contextSelector?: string;
}

export interface ElementDefinition {
  name: string;
  page?: string;
  primary: string;
  fallbacks?: string[];
  tag?: string;
  role?: string;
  accessibleName?: string;
  text?: string;
  contextSelector?: string;
  description?: string;
}

export interface HealingEvent {
  id: string;
  timestamp: string;
  testName: string;
  pageName: string;
  elementName: string;
  action: string;
  primaryLocator: string;
  healedLocator: string;
  fallbacksAttempted: string[];
  attemptCount: number;
  confidence: number;
  source: CandidateSource;
  success: boolean;
  failureReason?: string;
}

export interface HealingHistoryRecord {
  elementKey: string;
  original: string;
  healed: string;
  success_count: number;
  failure_count: number;
  confidence: number;
  last_used: string;
  last_test?: string;
}

export interface DiscoveredElement {
  tag: string;
  id?: string;
  name?: string;
  type?: string;
  role?: string;
  ariaLabel?: string;
  placeholder?: string;
  text?: string;
  testId?: string;
  className?: string;
  recommendedPrimary: string;
  recommendedFallbacks: string[];
}

export type FailureClassification =
  | 'LOCATOR FAILURE'
  | 'APPLICATION FAILURE'
  | 'TEST DATA FAILURE'
  | 'AUTHENTICATION FAILURE'
  | 'ENVIRONMENT FAILURE'
  | 'CONFIGURATION FAILURE'
  | 'ASSERTION FAILURE'
  | 'CI/CD FAILURE'
  | 'UNKNOWN';
