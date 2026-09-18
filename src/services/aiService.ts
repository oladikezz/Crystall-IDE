// ============================================================================
// Crystall IDE — Unified AI Service
// ============================================================================
// Primary service layer connecting the UI to Cloud APIs and Local Inference.

import { AIProvider, AllConfigs, ProviderConfig } from '../types';
import { AIProviderId, ProviderEndpointConfig, StreamCallbacks as AIStreamCallbacks } from '../types/ai';
import { DEFAULT_CONFIGS } from '../data/constants';
import { UnifiedAIEngine } from './ai';

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

export type StreamCallbacks = AIStreamCallbacks;

/**
 * Dispatches prompt through the production UnifiedAIEngine with SSE chunk buffering and backpressure.
 */
export async function sendStreamingPrompt(
  provider: AIProvider,
  config: ProviderConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const endpointConfig: ProviderEndpointConfig = {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    model: config.model,
    temperature: config.temperature,
    systemPrompt: config.systemPrompt
  };

  await UnifiedAIEngine.stream(
    provider as AIProviderId,
    endpointConfig,
    messages,
    callbacks,
    signal
  );
}

export * from './ai';
export * from './context';
