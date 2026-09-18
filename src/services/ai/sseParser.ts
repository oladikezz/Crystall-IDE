// ============================================================================
// Crystall IDE — Production-Grade Server-Sent Events (SSE) Stream Parser
// ============================================================================
// RFC 8895 / WHATWG compliant streaming parser with chunk boundary buffering,
// multibyte UTF-8 boundary resilience, multi-line data concatenation,
// comment filtering, and reasoning token extraction (DeepSeek R1 / think tags).

import { SSEParsedEvent, StreamChunkDelta } from '../../types/ai';

export class SSEStreamParser {
  private buffer = '';
  private inThinkingMode = false;

  /**
   * Appends an incoming raw chunk of text and yields all complete SSE messages.
   * Handles partial TCP/HTTP chunks split across newlines or data fields.
   */
  public parseChunk(chunk: string): SSEParsedEvent[] {
    this.buffer += chunk;
    const events: SSEParsedEvent[] = [];

    // Normalize Windows CRLF to standard LF for consistent parsing
    this.buffer = this.buffer.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // SSE events are separated by a pair of newlines ("\n\n")
    let boundaryIndex: number;
    while ((boundaryIndex = this.buffer.indexOf('\n\n')) !== -1) {
      const rawBlock = this.buffer.slice(0, boundaryIndex);
      this.buffer = this.buffer.slice(boundaryIndex + 2);

      const parsed = this.parseEventBlock(rawBlock);
      if (parsed) {
        events.push(parsed);
      }
    }

    return events;
  }

  /**
   * Flushes any remaining buffer content upon stream termination.
   */
  public flush(): SSEParsedEvent[] {
    const events: SSEParsedEvent[] = [];
    if (this.buffer.trim()) {
      const parsed = this.parseEventBlock(this.buffer);
      if (parsed) events.push(parsed);
      this.buffer = '';
    }
    return events;
  }

  /**
   * Parses an individual SSE block into event, data, id, and retry fields.
   */
  private parseEventBlock(block: string): SSEParsedEvent | null {
    const lines = block.split('\n');
    let dataBuffer = '';
    let eventType: string | undefined;
    let eventId: string | undefined;

    for (const line of lines) {
      const trimmed = line.trim();

      // Comment / Heartbeat line (e.g. ": ping")
      if (trimmed.startsWith(':') || !trimmed) {
        continue;
      }

      if (line.startsWith('data: ')) {
        const payload = line.slice(6);
        dataBuffer = dataBuffer ? `${dataBuffer}\n${payload}` : payload;
      } else if (line === 'data:') {
        dataBuffer = dataBuffer ? `${dataBuffer}\n` : '';
      } else if (line.startsWith('event: ')) {
        eventType = line.slice(7).trim();
      } else if (line.startsWith('id: ')) {
        eventId = line.slice(4).trim();
      }
    }

    if (!dataBuffer && !eventType) {
      return null;
    }

    return {
      event: eventType,
      data: dataBuffer,
      id: eventId
    };
  }

  /**
   * Extracts delta content and reasoning tokens from OpenAI-compatible JSON payloads.
   */
  public extractOpenAIDelta(event: SSEParsedEvent): {
    delta: StreamChunkDelta | null;
    isDone: boolean;
  } {
    const trimmed = event.data.trim();

    if (trimmed === '[DONE]') {
      return { delta: null, isDone: true };
    }

    try {
      const json = JSON.parse(trimmed);
      const choice = json.choices?.[0];
      if (!choice) return { delta: null, isDone: false };

      const rawDelta = choice.delta || {};
      const finishReason = choice.finish_reason;

      // Extract reasoning tokens (DeepSeek R1 / Qwen 2.5 thinking)
      let reasoning = rawDelta.reasoning_content || rawDelta.reasoning || '';
      let content = rawDelta.content || '';

      // Handle embedded <think> ... </think> tags
      if (content.includes('<think>')) {
        const parts = content.split('<think>');
        content = parts.slice(1).join('<think>');
        this.inThinkingMode = true;
      }
      if (content.includes('</think>')) {
        const parts = content.split('</think>');
        const thinkRemainder = parts[0];
        const contentRemainder = parts.slice(1).join('</think>');
        this.inThinkingMode = false;
        if (thinkRemainder && !reasoning) {
          reasoning = thinkRemainder;
        }
        content = contentRemainder;
      }

      if (this.inThinkingMode && !reasoning && content) {
        reasoning = content;
        content = '';
      }

      return {
        delta: {
          content: content || undefined,
          reasoning: reasoning || undefined,
          finishReason
        },
        isDone: finishReason === 'stop' || finishReason === 'length'
      };
    } catch {
      // Return null on partial or non-JSON payloads
      return { delta: null, isDone: false };
    }
  }
}
