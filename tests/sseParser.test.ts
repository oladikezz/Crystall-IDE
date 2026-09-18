import test from 'node:test';
import assert from 'node:assert';
import { SSEStreamParser } from '../src/services/ai/sseParser.ts';

test('SSEStreamParser - parses standard single SSE event', () => {
  const parser = new SSEStreamParser();
  const chunk = 'data: {"choices": [{"delta": {"content": "Hello"}}]}\n\n';
  const events = parser.parseChunk(chunk);

  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].data, '{"choices": [{"delta": {"content": "Hello"}}]}');

  const { delta, isDone } = parser.extractOpenAIDelta(events[0]);
  assert.strictEqual(isDone, false);
  assert.strictEqual(delta?.content, 'Hello');
});

test('SSEStreamParser - buffers split TCP chunks across newline boundaries', () => {
  const parser = new SSEStreamParser();

  // Chunk 1: Cut off halfway through JSON payload
  const chunk1 = 'data: {"choices": [{"delta": {"con';
  const events1 = parser.parseChunk(chunk1);
  assert.strictEqual(events1.length, 0); // Must not emit partial event

  // Chunk 2: Remainder of payload plus boundary
  const chunk2 = 'tent": "World"}}]}\n\n';
  const events2 = parser.parseChunk(chunk2);
  assert.strictEqual(events2.length, 1);

  const { delta } = parser.extractOpenAIDelta(events2[0]);
  assert.strictEqual(delta?.content, 'World');
});

test('SSEStreamParser - handles multi-line data fields and ignores comments', () => {
  const parser = new SSEStreamParser();
  const chunk = ': ping heartbeat\ndata: Line 1\ndata: Line 2\n\n';
  const events = parser.parseChunk(chunk);

  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].data, 'Line 1\nLine 2');
});

test('SSEStreamParser - handles [DONE] terminal signal', () => {
  const parser = new SSEStreamParser();
  const chunk = 'data: [DONE]\n\n';
  const events = parser.parseChunk(chunk);

  assert.strictEqual(events.length, 1);
  const { isDone } = parser.extractOpenAIDelta(events[0]);
  assert.strictEqual(isDone, true);
});

test('SSEStreamParser - extracts DeepSeek R1 reasoning tokens', () => {
  const parser = new SSEStreamParser();
  const chunk = 'data: {"choices": [{"delta": {"reasoning_content": "Let me think..."}}]}\n\n';
  const events = parser.parseChunk(chunk);

  const { delta } = parser.extractOpenAIDelta(events[0]);
  assert.strictEqual(delta?.reasoning, 'Let me think...');
  assert.strictEqual(delta?.content, undefined);
});

test('SSEStreamParser - parses embedded <think> tags into reasoning mode', () => {
  const parser = new SSEStreamParser();

  const chunk1 = 'data: {"choices": [{"delta": {"content": "<think>Analyzing syntax..."}}]}\n\n';
  const events1 = parser.parseChunk(chunk1);
  const res1 = parser.extractOpenAIDelta(events1[0]);
  assert.strictEqual(res1.delta?.reasoning, 'Analyzing syntax...');

  const chunk2 = 'data: {"choices": [{"delta": {"content": "Done thinking</think>Here is code"}}]}\n\n';
  const events2 = parser.parseChunk(chunk2);
  const res2 = parser.extractOpenAIDelta(events2[0]);
  assert.strictEqual(res2.delta?.content, 'Here is code');
});
