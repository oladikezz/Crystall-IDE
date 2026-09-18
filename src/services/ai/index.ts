// ============================================================================
// Crystall IDE — Unified AI Provider Engine Facade
// ============================================================================

import { AIProviderId, ProviderEndpointConfig, StreamCallbacks, LocalInferenceStatus, AIModelSpec } from '../../types/ai';
import { streamOpenAICompatible, streamAnthropic, streamGemini } from './providerAdapters';
import { LocalInferenceManager } from './localInference';

export const AI_MODELS_REGISTRY: Record<string, AIModelSpec> = {
  // Cloud Reasoning & Deep Models
  'deepseek/deepseek-r1': {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'openrouter',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    supportsThinking: true,
    costPer1kInput: 0.00055,
    costPer1kOutput: 0.00219,
    recommendedFor: 'reasoning'
  },
  'deepseek/deepseek-chat': {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3 (Chat)',
    provider: 'openrouter',
    contextWindow: 64000,
    maxOutputTokens: 8192,
    costPer1kInput: 0.00014,
    costPer1kOutput: 0.00028,
    recommendedFor: 'coding'
  },
  'openai/gpt-4o': {
    id: 'openai/gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'openrouter',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    costPer1kInput: 0.0025,
    costPer1kOutput: 0.01,
    recommendedFor: 'general'
  },
  'anthropic/claude-3.7-sonnet': {
    id: 'anthropic/claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet (Hybrid)',
    provider: 'openrouter',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    supportsThinking: true,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    recommendedFor: 'coding'
  },
  // Local Offline Inference
  'llama3:latest': {
    id: 'llama3:latest',
    name: 'Llama 3 8B (Local Q4)',
    provider: 'ollama',
    contextWindow: 8192,
    maxOutputTokens: 4096,
    isLocal: true,
    costPer1kInput: 0,
    costPer1kOutput: 0,
    recommendedFor: 'offline'
  },
  'qwen2.5-coder:7b': {
    id: 'qwen2.5-coder:7b',
    name: 'Qwen 2.5 Coder 7B (Local Q4)',
    provider: 'ollama',
    contextWindow: 32768,
    maxOutputTokens: 8192,
    isLocal: true,
    costPer1kInput: 0,
    costPer1kOutput: 0,
    recommendedFor: 'coding'
  }
};

export class UnifiedAIEngine {
  /**
   * Dispatches a streaming prompt to the selected provider.
   */
  public static async stream(
    provider: AIProviderId,
    config: ProviderEndpointConfig,
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const { onError } = callbacks;

    // Check if offline/mock is needed
    if (!config.apiKey && provider !== 'ollama' && provider !== 'llamacpp') {
      this.simulateMockResponse(messages[messages.length - 1]?.content || '', callbacks, signal);
      return;
    }

    try {
      if (provider === 'anthropic') {
        await streamAnthropic(config, messages, callbacks, signal);
      } else if (provider === 'gemini' && !config.baseUrl?.includes('/openai')) {
        await streamGemini(config, messages, callbacks, signal);
      } else {
        // OpenAI, DeepSeek, Groq, OpenRouter, Ollama, Llama.cpp, Custom
        await streamOpenAICompatible(config, messages, callbacks, signal);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        callbacks.onDone();
        return;
      }
      onError(err);
    }
  }

  /**
   * Probes local inference connectivity.
   */
  public static async probeLocal(endpoint?: string): Promise<LocalInferenceStatus> {
    return LocalInferenceManager.checkLocalBackends(endpoint);
  }

  private static simulateMockResponse(
    userPrompt: string,
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): void {
    const { onChunk, onDone } = callbacks;

    const mockCode = `*No API key configured for this provider. Add your API key in Settings or connect local Ollama.*

### Implementation Blueprint for: ${userPrompt.slice(0, 50)}

\`\`\`python
# [Crystall IDE] Universal AI Generator
import time

def execute_pipeline():
    print("[Crystall AI] Initializing pipeline...")
    time.sleep(0.05)
    return {"status": "success", "query": "${userPrompt.slice(0, 30)}"}

if __name__ == "__main__":
    result = execute_pipeline()
    print(f"Result: {result}")
\`\`\`

Click **Apply** on the code block to inject this into your active editor.`;

    let index = 0;
    const interval = setInterval(() => {
      if (signal?.aborted) {
        clearInterval(interval);
        onDone();
        return;
      }
      if (index < mockCode.length) {
        const chunk = mockCode.slice(index, index + 10);
        onChunk(chunk);
        index += 10;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 20);
  }
}

export * from './sseParser';
export * from './streamQueue';
export * from './localInference';
export * from './providerAdapters';
