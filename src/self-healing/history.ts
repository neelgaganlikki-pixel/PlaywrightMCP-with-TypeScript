import * as fs from 'fs';
import * as path from 'path';
import { HealingHistoryRecord } from './types';
import { config } from './config';
import { HealingLogger } from './logger';

export class HealingHistoryManager {
  private static instance: HealingHistoryManager;
  private history: Map<string, HealingHistoryRecord> = new Map();
  private filePath: string;

  private constructor() {
    this.filePath = config.getConfig().historyFilePath;
    this.load();
  }

  public static getInstance(): HealingHistoryManager {
    if (!HealingHistoryManager.instance) {
      HealingHistoryManager.instance = new HealingHistoryManager();
    }
    return HealingHistoryManager.instance;
  }

  public static makeKey(pageName?: string, elementName?: string, originalLocator?: string): string {
    const page = pageName || 'GenericPage';
    const element = elementName || originalLocator || 'UnknownElement';
    return `${page}.${element}`;
  }

  public load(): void {
    try {
      const fullPath = path.resolve(process.cwd(), this.filePath);
      if (fs.existsSync(fullPath)) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        if (raw.trim()) {
          const parsed = JSON.parse(raw);
          this.history.clear();
          for (const key of Object.keys(parsed)) {
            this.history.set(key, parsed[key]);
          }
          HealingLogger.debug(`Loaded ${this.history.size} healed locators from ${this.filePath}`);
        }
      }
    } catch (err: any) {
      HealingLogger.warn(`Failed to read  healing history from ${this.filePath}: ${err.message}`);
    }
  }

  public save(): void {
    if (!config.getConfig().saveLocators) return;

    try {
      const recordObj: Record<string, HealingHistoryRecord> = {};
      this.history.forEach((val, key) => {
        recordObj[key] = val;
      });

      const targets = [
        path.resolve(process.cwd(), this.filePath),
        path.resolve(process.cwd(), 'test-results', 'healed_locators.json'),
      ];

      for (const target of targets) {
        const dir = path.dirname(target);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(target, JSON.stringify(recordObj, null, 2), 'utf-8');
      }
    } catch (err: any) {
      HealingLogger.warn(`Failed to save healing history: ${err.message}`);
    }
  }

  public getLearnedCandidate(elementKey: string): HealingHistoryRecord | undefined {
    const record = this.history.get(elementKey);
    if (!record) return undefined;

    if (record.failure_count > 3 && record.failure_count > record.success_count) {
      return undefined;
    }

    return record;
  }

  public recordSuccess(
    elementKey: string,
    originalLocator: string,
    healedLocator: string,
    testName?: string
  ): void {
    const existing = this.history.get(elementKey);
    const successCount = (existing?.success_count || 0) + 1;
    const failureCount = existing?.failure_count || 0;

    const confidence = Math.min(
      0.99,
      0.8 + 0.05 * Math.min(successCount, 4) - 0.1 * failureCount
    );

    const record: HealingHistoryRecord = {
      elementKey,
      original: originalLocator,
      healed: healedLocator,
      success_count: successCount,
      failure_count: failureCount,
      confidence: Math.max(0.1, confidence),
      last_used: new Date().toISOString(),
      last_test: testName,
    };

    this.history.set(elementKey, record);
    this.save();
  }

  public recordFailure(elementKey: string, candidateSelector: string): void {
    const existing = this.history.get(elementKey);
    if (existing && existing.healed === candidateSelector) {
      existing.failure_count += 1;
      existing.confidence = Math.max(0.1, existing.confidence - 0.15);
      this.save();
    }
  }

  public getAll(): Record<string, HealingHistoryRecord> {
    const obj: Record<string, HealingHistoryRecord> = {};
    this.history.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }

  public clear(): void {
    this.history.clear();
    const fullPath = path.resolve(process.cwd(), this.filePath);
    if (fs.existsSync(mullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch {}
    }
  }
}

export const historyManager = HealingHistoryManager.getInstance();
