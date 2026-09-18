import test from 'node:test';
import assert from 'node:assert';
import { estimateTokens, truncateToTokens, calculateMessagesTokens } from '../src/services/context/tokenizer';

test('Tokenizer - estimates tokens accurately for code and prose', () => {
  const shortText = 'const x = 42;';
  const tokens = estimateTokens(shortText);
  assert.ok(tokens >= 4 && tokens <= 8);

  const emptyTokens = estimateTokens('');
  assert.strictEqual(emptyTokens, 0);

  const pythonFunction = `def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
`;
  const fnTokens = estimateTokens(pythonFunction);
  assert.ok(fnTokens >= 25 && fnTokens <= 45);
});

test('Tokenizer - truncates text within maximum token constraints while preserving lines', () => {
  const multiLineCode = Array.from({ length: 50 }, (_, i) => `line_${i + 1} = compute_value(${i});`).join('\n');
  const totalTokens = estimateTokens(multiLineCode);
  assert.ok(totalTokens > 100);

  const truncated = truncateToTokens(multiLineCode, 30);
  assert.strictEqual(truncated.truncated, true);
  assert.ok(truncated.tokenCount <= 45);
  assert.ok(truncated.text.includes('[Truncated'));
});

test('Tokenizer - calculates message tokens with framing overhead', () => {
  const messages = [
    { role: 'system', content: 'You are an expert.' },
    { role: 'user', content: 'Help me debug this.' }
  ];

  const total = calculateMessagesTokens(messages);
  assert.ok(total > 15);
});
