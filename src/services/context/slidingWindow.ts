// ============================================================================
// Crystall IDE — Priority-Ordered Sliding-Window Context Budgeter
// ============================================================================
// Enforces strict model context window limits via prioritized reservation slots:
// P0 (Immutable): System instructions & latest user prompt
// P1 (Critical): Compiler/LSP diagnostic errors & runtime stderr
// P2 (Targeted): Enclosing AST function / cursor scope
// P3 (Primary): Active file content (windowed if necessary)
// P4 (Auxiliary): Open workspace file outlines
// P5 (Sliding Window): Multi-turn conversation history (retains newest, drops oldest)

import { ContextPayload, FormattedPromptPayload } from '../../types/ai';
import { estimateTokens, truncateToTokens } from './tokenizer';
import { DiagnosticCollector } from './diagnosticCollector';
import { StderrCollector } from './stderrCollector';

export interface SlidingWindowOptions {
  maxContextTokens?: number; // e.g. 8192 for local, 128000 for cloud
  systemPrompt: string;
  userPrompt: string;
  contextPayload: ContextPayload;
  conversationHistory?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
}

export class SlidingWindowContextBudgeter {
  public static budgetPrompt(options: SlidingWindowOptions): FormattedPromptPayload {
    const {
      maxContextTokens = 8192,
      systemPrompt,
      userPrompt,
      contextPayload,
      conversationHistory = []
    } = options;

    const truncatedParts: string[] = [];

    // P0: Calculate required tokens for System Prompt & User Prompt (Immutable)
    const systemTokens = estimateTokens(systemPrompt);
    const userTokens = estimateTokens(userPrompt);
    const p0Tokens = systemTokens + userTokens + 10; // framing overhead

    let remainingBudget = Math.max(0, maxContextTokens - p0Tokens);

    // P1: Diagnostics & Stderr Context Block
    const diagText = DiagnosticCollector.formatForPrompt(contextPayload.diagnostics);
    const stderrText = StderrCollector.formatForPrompt(contextPayload.recentStderr);
    let diagnosticsBlock = [diagText, stderrText].filter(Boolean).join('\n\n');
    let diagnosticsTokens = estimateTokens(diagnosticsBlock);

    if (diagnosticsTokens > remainingBudget * 0.25) {
      const truncated = truncateToTokens(diagnosticsBlock, Math.floor(remainingBudget * 0.25));
      diagnosticsBlock = truncated.text;
      diagnosticsTokens = truncated.tokenCount;
      truncatedParts.push('diagnostics');
    }
    remainingBudget -= diagnosticsTokens;

    // P2: Active AST Outline & Enclosing Scope
    let astBlock = '';
    if (contextPayload.astOutline) {
      astBlock = `### 📐 Active File AST Structure:\n${contextPayload.astOutline}`;
    }
    let astTokens = estimateTokens(astBlock);
    if (astTokens > remainingBudget * 0.15) {
      const truncated = truncateToTokens(astBlock, Math.floor(remainingBudget * 0.15));
      astBlock = truncated.text;
      astTokens = truncated.tokenCount;
      truncatedParts.push('astOutline');
    }
    remainingBudget -= astTokens;

    // P3: Active File Content
    let activeFileBlock = '';
    const file = contextPayload.activeFile;
    if (file && file.content) {
      activeFileBlock = `### 📄 Active File [${file.name} (${file.language})]:\n\`\`\`${file.language}\n${file.content}\n\`\`\``;
    }
    let fileTokens = estimateTokens(activeFileBlock);
    // Allow active file up to 50% of remaining budget
    const fileBudget = Math.floor(remainingBudget * 0.65);
    if (fileTokens > fileBudget && fileBudget > 20) {
      const truncated = truncateToTokens(file.content, Math.floor(fileBudget * 0.9));
      activeFileBlock = `### 📄 Active File [${file.name} (${file.language}) - Windowed]:\n\`\`\`${file.language}\n${truncated.text}\n\`\`\``;
      fileTokens = truncated.tokenCount;
      truncatedParts.push('activeFileContent');
    }
    remainingBudget -= fileTokens;

    // Assemble dynamic context string
    const dynamicContextParts = [
      activeFileBlock,
      diagnosticsBlock,
      astBlock
    ].filter(Boolean);

    const contextHeader = dynamicContextParts.length > 0
      ? `=== CURRENT WORKSPACE CONTEXT ===\n\n${dynamicContextParts.join('\n\n')}\n\n=================================`
      : '';

    // P5: Sliding Window over Conversation History (from newest to oldest)
    const budgetedHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];
    if (conversationHistory.length > 0) {
      for (let i = conversationHistory.length - 1; i >= 0; i--) {
        const msg = conversationHistory[i];
        const msgTokens = estimateTokens(msg.content) + 4;
        if (remainingBudget >= msgTokens) {
          budgetedHistory.unshift(msg);
          remainingBudget -= msgTokens;
        } else {
          truncatedParts.push(`history_turn_${i}`);
        }
      }
    }

    // Construct final message sequence
    const finalMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

    // Inject context either as system message or attached to user prompt
    if (contextHeader) {
      finalMessages.push({
        role: 'system',
        content: `${systemPrompt}\n\n${contextHeader}`
      });
    } else {
      finalMessages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    for (const h of budgetedHistory) {
      finalMessages.push(h);
    }

    finalMessages.push({
      role: 'user',
      content: userPrompt
    });

    const totalEstimatedTokens = estimateTokens(
      finalMessages.map(m => m.content).join(' ')
    );

    return {
      systemPrompt,
      messages: finalMessages,
      totalEstimatedTokens,
      contextAudit: {
        hadDiagnostics: !!diagnosticsBlock,
        hadStderr: !!stderrText,
        hadAST: !!astBlock,
        wasTruncated: truncatedParts.length > 0
      }
    };
  }
}
