// ============================================================================
// Crystall IDE — Terminal Stderr & Execution Log Collector
// ============================================================================
// Aggregates and filters runtime failures, uncaught exceptions, and stderr
// output from the execution runner to inject into the AI agent prompt.

import { ConsoleLog } from '../../types';
import { ExecutionStderrItem } from '../../types/ai';

export class StderrCollector {
  /**
   * Filters raw console logs for recent errors, warnings, and stack traces.
   */
  public static fromConsoleLogs(logs: ConsoleLog[], maxCount = 6): ExecutionStderrItem[] {
    if (!logs || logs.length === 0) return [];

    const stderrItems: ExecutionStderrItem[] = [];

    // Scan backwards from newest logs
    for (let i = logs.length - 1; i >= 0; i--) {
      const log = logs[i];
      if (log.type === 'error' || log.type === 'warn') {
        stderrItems.unshift({
          timestamp: log.timestamp,
          type: log.type,
          message: log.message
        });
        if (stderrItems.length >= maxCount) break;
      }
    }

    return stderrItems;
  }

  /**
   * Formats stderr items into a concise context block for debugging prompts.
   */
  public static formatForPrompt(items: ExecutionStderrItem[]): string {
    if (!items || items.length === 0) return '';

    const lines: string[] = [
      `### 🛑 Recent Runtime Stderr & Execution Logs:`
    ];

    for (const item of items) {
      lines.push(`[${item.timestamp}] [${item.type.toUpperCase()}] ${item.message}`);
    }

    return lines.join('\n');
  }
}
