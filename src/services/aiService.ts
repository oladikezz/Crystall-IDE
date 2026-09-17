import { AIProvider, AllConfigs, ProviderConfig } from '../types';
import { DEFAULT_CONFIGS } from '../data/constants';

const STORAGE_KEY = 'vibe_executor_ai_configs_v1';
const ACTIVE_PROVIDER_KEY = 'vibe_executor_active_provider_v1';

export function loadStoredConfigs(): AllConfigs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const merged: AllConfigs = { ...DEFAULT_CONFIGS };
      for (const k of Object.keys(DEFAULT_CONFIGS) as AIProvider[]) {
        merged[k] = {
          ...DEFAULT_CONFIGS[k],
          ...(parsed[k] || {})
        };
      }
      return merged;
    }
  } catch (e) {
    console.error('Failed to parse stored configs:', e);
  }
  return DEFAULT_CONFIGS;
}

export function saveStoredConfigs(configs: AllConfigs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (e) {
    console.error('Failed to save configs to localStorage:', e);
  }
}

export function loadActiveProvider(): AIProvider {
  try {
    const p = localStorage.getItem(ACTIVE_PROVIDER_KEY) as AIProvider;
    if (p && DEFAULT_CONFIGS[p]) return p;
  } catch {}
  return 'openrouter';
}

export function saveActiveProvider(provider: AIProvider): void {
  try {
    localStorage.setItem(ACTIVE_PROVIDER_KEY, provider);
  } catch {}
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onThinkingChunk?: (thinkText: string) => void;
  onError: (err: Error) => void;
  onDone: () => void;
}

export async function sendStreamingPrompt(
  provider: AIProvider,
  config: ProviderConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { onChunk, onThinkingChunk, onError, onDone } = callbacks;

  // 1. If no API key provided (except for ollama/local), use intelligent interactive mock streamer
  if (!config.apiKey && provider !== 'ollama') {
    simulateMockVibecoding(messages[messages.length - 1]?.content || '', callbacks, signal);
    return;
  }

  try {
    if (provider === 'anthropic') {
      await streamAnthropic(config, messages, callbacks, signal);
    } else if (provider === 'gemini' && !config.baseUrl?.includes('/openai')) {
      await streamGeminiNative(config, messages, callbacks, signal);
    } else {
      // Standard OpenAI compatible format (DeepSeek, OpenAI, Groq, OpenRouter, Ollama, Custom)
      await streamOpenAICompatible(config, messages, callbacks, signal);
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      onDone();
      return;
    }
    onError(err);
  }
}

async function streamOpenAICompatible(
  config: ProviderConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { onChunk, onThinkingChunk, onError, onDone } = callbacks;
  const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }
  if (baseUrl.includes('openrouter.ai')) {
    headers['HTTP-Referer'] = 'https://crystall-ide.app';
    headers['X-Title'] = 'Crystall IDE';
  }

  const payload = {
    model: config.model,
    messages: [
      { role: 'system', content: config.systemPrompt },
      ...messages
    ],
    temperature: config.temperature,
    stream: true
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorText.slice(0, 300)}`);
  }

  if (!response.body) throw new Error('ReadableStream not supported in response');

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  let inThinkingMode = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(':')) continue;
      if (trimmed === 'data: [DONE]') {
        onDone();
        return;
      }
      if (trimmed.startsWith('data: ')) {
        try {
          const json = JSON.parse(trimmed.slice(6));
          const delta = json.choices?.[0]?.delta;
          if (!delta) continue;

          // DeepSeek R1 reasoning extraction
          const reasoning = delta.reasoning_content || delta.reasoning;
          if (reasoning && onThinkingChunk) {
            onThinkingChunk(reasoning);
          }

          if (delta.content) {
            const content = delta.content;
            if (content.includes('<think>')) {
              inThinkingMode = true;
            }
            if (content.includes('</think>')) {
              inThinkingMode = false;
            }

            if (inThinkingMode && onThinkingChunk) {
              onThinkingChunk(content.replace('<think>', '').replace('</think>', ''));
            } else {
              onChunk(content);
            }
          }
        } catch {
          // ignore stream parse errors
        }
      }
    }
  }
  onDone();
}

async function streamAnthropic(
  config: ProviderConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { onChunk, onDone } = callbacks;
  const url = `${(config.baseUrl || 'https://api.anthropic.com/v1').replace(/\/$/, '')}/messages`;

  const payload = {
    model: config.model || 'claude-3-7-sonnet-20250219',
    max_tokens: 4096,
    system: config.systemPrompt,
    messages: messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role,
      content: m.content
    })),
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
    const errorText = await response.text();
    throw new Error(`Anthropic Error [${response.status}]: ${errorText.slice(0, 300)}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ')) {
        try {
          const json = JSON.parse(trimmed.slice(6));
          if (json.type === 'content_block_delta' && json.delta?.text) {
            onChunk(json.delta.text);
          }
        } catch {}
      }
    }
  }
  onDone();
}

async function streamGeminiNative(
  config: ProviderConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { onChunk, onDone } = callbacks;
  const model = config.model || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${config.apiKey}&alt=sse`;

  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: config.systemPrompt }] },
      generationConfig: { temperature: config.temperature }
    }),
    signal
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini Error [${response.status}]: ${errorText.slice(0, 300)}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ')) {
        try {
          const json = JSON.parse(trimmed.slice(6));
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) onChunk(text);
        } catch {}
      }
    }
  }
  onDone();
}

function simulateMockVibecoding(userPrompt: string, callbacks: StreamCallbacks, signal?: AbortSignal): void {
  const { onChunk, onDone } = callbacks;

  const mockCode = `*No API key configured for this provider. Add your API key in Settings (or connect local Ollama) to use live AI models.*

Here is a template implementation for: **${userPrompt.slice(0, 60)}**

\`\`\`lua
-- [Crystall IDE] Script: ${userPrompt.slice(0, 30)}
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

local function Initialize()
    print("[Crystall] Initializing module for " .. LocalPlayer.Name)
    -- Your implementation logic goes here
end

Initialize()
return true
\`\`\`

Click **Apply** on the code block to load this directly into your active editor tab.`;

  
  let index = 0;
  const interval = setInterval(() => {
    if (signal?.aborted) {
      clearInterval(interval);
      onDone();
      return;
    }
    if (index < mockCode.length) {
      const chunk = mockCode.slice(index, index + 8);
      onChunk(chunk);
      index += 8;
    } else {
      clearInterval(interval);
      onDone();
    }
  }, 25);
}
