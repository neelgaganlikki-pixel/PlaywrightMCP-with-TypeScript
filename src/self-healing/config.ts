import { SelfHealingConfig, LogLevel } from './types';

export class ConfigManager {
  private static instance: ConfigManager;
  private config: SelfHealingConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): SelfHealingConfig {
    const env = process.env;

    const parseBool = (val: string | undefined, defaultVal: boolean): boolean => {
      if (val === undefined || val === null || val === '') return defaultVal;
      return val.toLowerCase() === 'true' || val === '1';
    };

    const parseIntVal = (val: string | undefined, defaultVal: number): number => {
      if (!val) return defaultVal;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? defaultVal : parsed;
    };

    const parseFloatVal = (val: string | undefined, defaultVal: number): number => {
      if (!val) return defaultVal;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? defaultVal : parsed;
    };

    const validLogLevels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'];
    const envLogLevel = (env.SELF_HEALING_LOG_LEVEL?.toUpperCase() as LogLevel) || 'INFO';
    const logLevel: LogLevel = validLogLevels.includes(envLogLevel) ? envLogLevel : 'INFO';

    return {
      enabled: parseBool(env.SELF_HEALING_ENABLED, true),
      maxAttempts: parseIntVal(env.SELF_HEALING_MAX_ATTEMPTS, 3),
      saveLocators: parseBool(env.SELF_HEALING_SAVE_LOCATORS, true),
      logLevel,
      confidenceThreshold: parseFloatVal(env.SELF_HEALING_CONFIDENCE_THRESHOLD, 0.6),
      historyFilePath: env.SELF_HEALING_HISTORY_FILE || 'reports/healed_locators.json',
      reportFilePath: env.SELF_HEALING_REPORT_FILE || 'test-results/healing-report.json',
      htmlReportFilePath: env.SELF_HEALING_HTML_REPORT_FILE || 'test-results/healing-summary.html',
      candidateTimeoutMs: parseIntVal(env.SELF_HEALING_CANDIDATE_TIMEOUT_MS, 3000),
      primaryTimeoutMs: parseIntVal(env.SELF_HEALING_PRIMARY_TIMEOUT_MS, 5000),
      validateInteractable: parseBool(env.SELF_HEALING_VALIDATE_INTERACTABLE, true),
    };
  }

  public getConfig(): Readonly<SelfHealingConfig> {
    return this.config;
  }

  public updateConfig(overrides: Partial<SelfHealingConfig>): void {
    this.config = {
      ...this.config,
      ...overrides,
    };
  }

  public resetToDefaults(): void {
    this.config = this.loadConfig();
  }
}

export const config = ConfigManager.getInstance();
