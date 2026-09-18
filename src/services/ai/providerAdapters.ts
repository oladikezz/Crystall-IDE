// ============================================================================
// Crystall IDE — Unified Provider Adapters
// ============================================================================
// Handles protocol discrepancies across OpenAI-compatible engines, Anthropic,
// and Gemini, driving them through the SSE parser and token queue.

import { ProviderEndpointConfig, StreamCallbacks } from '../../types/ai';
import { SSEStreamParser } from './sseParser';
import { StreamTokenQueue } from './streamQueue';

/**
 * Standard OpenAI-compatible streaming adapter (DeepSeek, OpenAI, Groq, OpenRouter, Ollama, Llama.cpp, vLLM).
 */
export async function streamOpenAICompatible(
  config: ProviderEndpointConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { onChunk, onThinkingChunk, onError, onDone, onMetricsUpdate } = callbacks;
  const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (config.apiKey && config.apiKey !== 'ollama' && config.apiKey !== 'local') {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  // OpenRouter attribution headers
  if (baseUrl.includes('openrouter.ai')) {
    headers['HTTP-Referer'] = 'https://crystall-ide.app';
    headers['X-Title'] = 'Crystall IDE';
  }

  const payload: any = {
    model: config.model,
    messages,
    temperature: config.temperature,
    stream: true
  };

  const startTime = performance.now();
  let totalChunksReceived = 0;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`[${response.status}] ${errText.slice(0, 300)}`);
  }

  if (!response.body) {
    throw new Error('ReadableStream not supported by server response');
  }

  const parser = new SSEStreamParser();
  const queue = new StreamTokenQueue({
    onFlush: (token, isThinking) => {
      if (isThinking && onThinkingChunk) {
        onThinkingChunk(token);
      } else {
        onChunk(token);
      }
    },
    onDone: () => {
      onDone({ totalChunks: totalChunksReceived });
    }
  }, signal);

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalChunksReceived++;
      const textChunk = decoder.decode(value, { stream: true });
      const events = parser.parseChunk(textChunk);

      for (const event of events) {
        const { delta, isDone } = parser.extractOpenAIDelta(event);
        if (isDone) {
          queue.end();
          return;
        }

        if (delta) {
          if (delta.reasoning) {
            queue.enqueue(delta.reasoning, true);
          }
          if (delta.content) {
            queue.enqueue(delta.content, false);
          }
        }
      }

      // Telemetry metrics
      if (onMetricsUpdate && totalChunksReceived % 5 === 0) {
        const elapsedSec = (performance.now() - startTime) / 1000;
        if (elapsedSec > 0.2) {
          onMetricsUpdate({
            tokensPerSec: Math.round(totalChunksReceived / elapsedSec),
            elapsedMs: Math.round(elapsedSec * 1000)
          });
        }
      }
    }

    // Flush any remaining buffer tokens
    const flushed = parser.flush();
    for (const event of flushed) {
      const { delta } = parser.extractOpenAIDelta(event);
      if (delta?.content) queue.enqueue(delta.content, false);
    }
    queue.end();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      queue.clear();
      onDone({ totalChunks: totalChunksReceived, finishReason: 'aborted' });
      return;
    }
    onError(err);
  }
}

/**
 * Anthropic Messages streaming adapter (Claude 3.7 Sonnet / Claude 3.5).
 */
export async function streamAnthropic(
  config: ProviderEndpointConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { onChunk, onError, onDone } = callbacks;
  const url = `${(config.baseUrl || 'https://api.anthropic.com/v1').replace(/\/$/, '')}/messages`;

  const systemMsg = messages.find(m => m.role === 'system')?.content || config.systemPrompt;
  const conversation = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role,
    content: m.content
  }));

  const payload = {
    model: config.model || 'claude-3-7-sonnet-20250219',
    max_tokens: config.maxTokens || 4096,
    system: systemMsg,
    messages: conversation,
    stream: true
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true'
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic [${response.status}]: ${errText.slice(0, 300)}`);
  }

  const parser = new SSEStreamParser();
  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const events = parser.parseChunk(text);

      for (const ev of events) {
        if (!ev.data) continue;
        try {
          const json = JSON.parse(ev.data);
          if (json.type === 'content_block_delta' && json.delta?.text) {
            onChunk(json.delta.text);
          }
        } catch {}
      }
    }
    onDone();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      onDone();
      return;
    }
    onError(err);
  }
}

/**
 * Google Gemini Native REST streaming adapter.
 */
export async function streamGemini(
  config: ProviderEndpointConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { onChunk, onError, onDone } = callbacks;
  const model = config.model || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${config.apiKey}&alt=sse`;

  const systemMsg = messages.find(m => m.role === 'system')?.content || config.systemPrompt;
  const contents = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemMsg }] },
      generationConfig: { temperature: config.temperature }
    }),
    signal
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini [${response.status}]: ${errText.slice(0, 300)}`);
  }

  const parser = new SSEStreamParser();
  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const events = parser.parseChunk(text);

      for (const ev of events) {
        if (!ev.data) continue;
        try {
          const json = JSON.parse(ev.data);
          const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            onChunk(candidateText);
          }
        } catch {}
      }
    }
    onDone();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      onDone();
      return;
    }
    onError(err);
  }
}
