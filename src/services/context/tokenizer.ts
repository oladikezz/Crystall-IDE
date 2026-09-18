// ============================================================================
// Crystall IDE — BPE Token Estimator & Token Budgeter
// ============================================================================
// High-performance calibrated tokenizer utility modeled on cl100k_base & o200k_base
// tokenization rules for code, identifiers, and multilingual text.

/**
 * Estimates token count for a text string using calibrated BPE regex heuristics.
 * Code and whitespace chunks are treated with higher granularity than standard text.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;

  // Regex splitting on code tokens, words, numbers, punctuation, and whitespace runs
  // This mirrors the byte-pair boundary pattern of modern LLM tokenizers
  const bpeRegex = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
  const matches = text.match(bpeRegex);

  if (!matches) {
    // Fallback: ~3.8 chars per token for typical code/English text
    return Math.ceil(text.length / 3.8);
  }

  let tokenCount = 0;
  for (let i = 0; i < matches.length; i++) {
    const chunk = matches[i];
    const len = chunk.length;

    // Fast heuristic: long words/symbols get subdivided into multiple BPE merges
    if (len <= 4) {
      tokenCount += 1;
    } else if (len <= 8) {
      tokenCount += 2;
    } else {
      tokenCount += Math.ceil(len / 3.5);
    }
  }

  return Math.max(1, tokenCount);
}

/**
 * Truncates text so that its estimated token count does not exceed maxTokens.
 * Preserves syntax lines where possible.
 */
export function truncateToTokens(text: string, maxTokens: number): { text: string; truncated: boolean; tokenCount: number } {
  const currentTokens = estimateTokens(text);
  if (currentTokens <= maxTokens) {
    return { text, truncated: false, tokenCount: currentTokens };
  }

  const lines = text.split('\n');
  let accumulated = '';
  let tokensSoFar = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] + '\n';
    const lineTokens = estimateTokens(line);
    if (tokensSoFar + lineTokens > maxTokens) {
      return {
        text: accumulated + `\n... [Truncated ${lines.length - i} lines to fit token budget]`,
        truncated: true,
        tokenCount: tokensSoFar + 12
      };
    }
    accumulated += line;
    tokensSoFar += lineTokens;
  }

  // Fallback character slice if a single line exceeds maxTokens
  const charLimit = Math.floor(maxTokens * 3.5);
  const sliced = text.slice(0, charLimit) + '\n... [Truncated]';
  return {
    text: sliced,
    truncated: true,
    tokenCount: estimateTokens(sliced)
  };
}

/**
 * Computes prompt conversation token usage according to OpenAI/Anthropic framing:
 * ~3-4 tokens overhead per message (role, markers, delimiters).
 */
export function calculateMessagesTokens(
  messages: Array<{ role: string; content: string }>
): number {
  let total = 3; // Priming tokens (<|start|>assistant<|message|>)
  for (const msg of messages) {
    total += 4; // <|im_start|>role\n ... <|im_end|>\n
    total += estimateTokens(msg.content);
  }
  return total;
}
