import test from 'node:test';
import assert from 'node:assert';
import { SlidingWindowContextBudgeter } from '../src/services/context/slidingWindow';
import { ContextPayload } from '../src/types/ai';

test('SlidingWindow - preserves P0 system and user prompts intact', () => {
  const context: ContextPayload = {
    activeFile: {
      name: 'test.py',
      language: 'python',
      content: 'print("hello world")',
      totalLines: 1
    },
    diagnostics: [],
    recentStderr: [],
    budgetMetrics: {
      estimatedInputTokens: 10,
      maxContextTokens: 4000,
      truncatedParts: []
    }
  };

  const systemPrompt = 'You are an elite coding assistant.';
  const userPrompt = 'How do I optimize this loop?';

  const result = SlidingWindowContextBudgeter.budgetPrompt({
    systemPrompt,
    userPrompt,
    contextPayload: context,
    maxContextTokens: 4000
  });

  assert.ok(result.messages.some(m => m.role === 'system' && m.content.includes(systemPrompt)));
  assert.ok(result.messages.some(m => m.role === 'user' && m.content === userPrompt));
  assert.strictEqual(result.contextAudit.wasTruncated, false);
});

test('SlidingWindow - truncates conversation history from oldest turns first when budget is exhausted', () => {
  const context: ContextPayload = {
    activeFile: {
      name: 'large.ts',
      language: 'typescript',
      content: 'const a = 1;',
      totalLines: 1
    },
    diagnostics: [],
    recentStderr: [],
    budgetMetrics: {
      estimatedInputTokens: 5,
      maxContextTokens: 100, // Very tight token budget
      truncatedParts: []
    }
  };

  const history = [
    { role: 'user' as const, content: 'Turn 1: Very old message that should be truncated when budget overflows.' },
    { role: 'assistant' as const, content: 'Turn 1 response: Very old answer.' },
    { role: 'user' as const, content: 'Turn 2: Recent message.' },
    { role: 'assistant' as const, content: 'Turn 2: Recent answer.' }
  ];

  const result = SlidingWindowContextBudgeter.budgetPrompt({
    systemPrompt: 'System',
    userPrompt: 'Newest prompt',
    contextPayload: context,
    conversationHistory: history,
    maxContextTokens: 80
  });

  // Older turns should have been dropped to preserve budget
  const contents = result.messages.map(m => m.content).join(' ');
  assert.ok(!contents.includes('Turn 1: Very old message'));
  assert.ok(result.contextAudit.wasTruncated);
});
