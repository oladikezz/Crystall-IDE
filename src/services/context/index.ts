// ============================================================================
// Crystall IDE — Context Engine Facade (Mini-RAG & Indexing Pipeline)
// ============================================================================

import { FileTab, ConsoleLog } from '../../types';
import { ContextPayload, FormattedPromptPayload, DiagnosticItem } from '../../types/ai';
import { ASTSlicer } from './astSlicer';
import { DiagnosticCollector } from './diagnosticCollector';
import { StderrCollector } from './stderrCollector';
import { SlidingWindowContextBudgeter } from './slidingWindow';
import { estimateTokens } from './tokenizer';

export interface BuildContextOptions {
  activeTab: FileTab;
  selectionText?: string;
  cursorLine?: number;
  monacoMarkers?: any[];
  consoleLogs?: ConsoleLog[];
  allTabs?: FileTab[];
  maxContextTokens?: number;
}

export class ContextEngine {
  /**
   * Builds a structured ContextPayload from active editor state and execution logs.
   */
  public static buildContext(options: BuildContextOptions): ContextPayload {
    const {
      activeTab,
      selectionText,
      cursorLine,
      monacoMarkers = [],
      consoleLogs = [],
      allTabs = [],
      maxContextTokens = 8192
    } = options;

    // 1. AST syntax slicing
    const astResult = ASTSlicer.slice(activeTab.content || '', activeTab.language || 'plaintext', cursorLine);

    // 2. LSP compiler diagnostics
    const diagnostics = DiagnosticCollector.fromMonacoMarkers(monacoMarkers, activeTab.content);

    // 3. Runtime stderr logs
    const recentStderr = StderrCollector.fromConsoleLogs(consoleLogs, 5);

    // 4. Summaries of other open tabs
    const otherTabs = allTabs.filter(t => t.id !== activeTab.id).slice(0, 3);
    const openTabSummaries = otherTabs.map(t => ({
      name: t.name,
      language: t.language,
      summary: (t.content || '').slice(0, 150)
    }));

    // 5. Initial estimate of token budget
    const initialTokens = estimateTokens(activeTab.content || '');

    return {
      activeFile: {
        name: activeTab.name,
        language: activeTab.language,
        path: activeTab.path,
        content: activeTab.content || '',
        totalLines: (activeTab.content || '').split('\n').length
      },
      selection: selectionText ? {
        text: selectionText,
        startLine: cursorLine || 1,
        endLine: cursorLine || 1
      } : undefined,
      astOutline: astResult.outlineText,
      cursorEnclosingScope: astResult.cursorScope ? `${astResult.cursorScope.type}: ${astResult.cursorScope.name}` : undefined,
      diagnostics,
      recentStderr,
      openTabSummaries,
      budgetMetrics: {
        estimatedInputTokens: initialTokens,
        maxContextTokens,
        truncatedParts: []
      }
    };
  }

  /**
   * Prepares and budgets prompt messages using priority sliding window truncation.
   */
  public static preparePrompt(
    systemPrompt: string,
    userPrompt: string,
    context: ContextPayload,
    history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [],
    maxTokens = 8192
  ): FormattedPromptPayload {
    return SlidingWindowContextBudgeter.budgetPrompt({
      systemPrompt,
      userPrompt,
      contextPayload: context,
      conversationHistory: history,
      maxContextTokens: maxTokens
    });
  }
}

export * from './tokenizer';
export * from './astSlicer';
export * from './diagnosticCollector';
export * from './stderrCollector';
export * from './slidingWindow';
