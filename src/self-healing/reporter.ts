import * as fs from 'fs';
import * as path from 'path';
import { HealingEvent } from './types';
import { config } from './config';
import { HealingLogger } from './logger';

export interface HealingSummary {
  totalAttempts: number;
  successfulHeals: number;
  failedHeals: number;
  healingRate: string;
  events: HealingEvent[];
  generatedAt: string;
}

/**
 * Collects healing events and generates structured JSON and HTML reports.
 */
export class HealingReporter {
  private static instance: HealingReporter;
  private events: HealingEvent[] = [];

  private constructor() {}

  public static getInstance(): HealingReporter {
    if (!HealingReporter.instance) {
      HealingReporter.instance = new HealingReporter();
    }
    return HealingReporter.instance;
  }

  public recordEvent(event: HealingEvent): void {
    this.events.push(event);
  }

  public getEvents(): HealingEvent[] {
    return [...this.events];
  }

  public getSummary(): HealingSummary {
    const totalAttempts = this.events.length;
    const successfulHeals = this.events.filter((e) => e.success).length;
    const failedHeals = totalAttempts - successfulHeals;
    const rate = totalAttempts > 0 ? `${Math.round((successfulHeals / totalAttempts) * 100)}%` : '100%';

    return {
      totalAttempts,
      successfulHeals,
      failedHeals,
      healingRate: rate,
      events: this.events,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Writes JSON and HTML reports to disk.
   */
  public generateReports(): void {
    try {
      const summary = this.getSummary();
      const cfg = config.getConfig();

      // Write JSON report
      const jsonPath = path.resolve(process.cwd(), cfg.reportFilePath);
      const jsonDir = path.dirname(jsonPath);
      if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
      fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2), 'utf-8');

      // Write HTML summary report
      const htmlPath = path.resolve(process.cwd(), cfg.htmlReportFilePath);
      const htmlDir = path.dirname(htmlPath);
      if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });
      fs.writeFileSync(htmlPath, this.buildHtmlReport(summary), 'utf-8');

      HealingLogger.debug(`Generated healing report: ${jsonPath} and ${htmlPath}`);
    } catch (err: any) {
      HealingLogger.warn(`Failed to generate healing reports: ${err.message}`);
    }
  }

  private buildHtmlReport(summary: HealingSummary): string {
    const rows = summary.events
      .map((e, idx) => {
        const statusBadge = e.success
          ? '<span style="background:#10b981;color:#fff;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:bold;">HEALED</span>'
          : '<span style="background:#ef4444;color:#fff;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:bold;">FAILED</span>';

        return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${idx + 1}</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;"><strong>${this.escape(e.testName || 'Test')}</strong></td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${this.escape(e.pageName)} :: ${this.escape(e.elementName)}</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;"><code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">${this.escape(e.action)}</code></td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;"><code style="color:#b91c1c;background:#fee2e2;padding:2px 6px;border-radius:4px;">${this.escape(e.primaryLocator)}</code></td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;"><code style="color:#047857;background:#d1fae5;padding:2px 6px;border-radius:4px;">${this.escape(e.healedLocator)}</code></td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${statusBadge}</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${Math.round(e.confidence * 100)}%</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;font-size:11px;color:#6b7280;">${new Date(e.timestamp).toLocaleTimeString()}</td>
        </tr>
      `;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Self-Healing Test Automation Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; background: #f9fafb; color: #111827; }
    .card { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 24px; margin-bottom: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; }
    .metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .metric-box { background: #f3f4f6; border-radius: 6px; padding: 16px; text-align: center; }
    .metric-value { font-size: 28px; font-weight: bold; color: #1f2937; margin-top: 4px; }
    .metric-label { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { background: #f9fafb; padding: 10px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <h1 style="margin:0;font-size:22px;color:#1e40af;">🛡️ Self-Healing Automation Execution Report</h1>
        <p style="margin:4px 0 0 0;color:#6b7280;font-size:13px;">Generated at ${summary.generatedAt}</p>
      </div>
      <div>
        <span style="background:#dbeafe;color:#1e40af;padding:6px 12px;border-radius:16px;font-weight:600;font-size:13px;">Playwright Self-Healing Engine v1.0</span>
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric-box">
        <div class="metric-label">Healing Attempts</div>
        <div class="metric-value">${summary.totalAttempts}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Successful Heals</div>
        <div class="metric-value" style="color:#059669;">${summary.successfulHeals}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Failed Heals</div>
        <div class="metric-value" style="color:#dc2626;">${summary.failedHeals}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Healing Recovery Rate</div>
        <div class="metric-value" style="color:#2563eb;">${summary.healingRate}</div>
      </div>
    </div>

    <h2 style="font-size:16px;margin:24px 0 12px 0;">Detailed Healing Incidents</h2>
    ${
      summary.events.length === 0
        ? '<p style="color:#6b7280;font-style:italic;">No healing events were triggered during this run (all primary locators passed directly).</p>'
        : `<table>
        <thead>
          <tr>
            <th>#</th>
            <th>Test</th>
            <th>Element</th>
            <th>Action</th>
            <th>Primary (Failed)</th>
            <th>Healed Locator</th>
            <th style="text-align:center;">Status</th>
            <th style="text-align:center;">Confidence</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>`
    }
  </div>
</body>
</html>`;
  }

  private escape(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  public clear(): void {
    this.events = [];
  }
}

export const reporter = HealingReporter.getInstance();
