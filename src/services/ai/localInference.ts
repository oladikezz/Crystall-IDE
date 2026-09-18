// ============================================================================
// Crystall IDE — Local Offline Inference Engine (Ollama & Llama.cpp)
// ============================================================================
// Performs health checks, latency measurement, and model auto-discovery
// for offline inference servers running on localhost.

import { LocalInferenceStatus } from '../../types/ai';

export class LocalInferenceManager {
  private static cachedStatus: LocalInferenceStatus | null = null;
  private static lastCheckTime = 0;
  private static readonly CACHE_TTL_MS = 6000;

  /**
   * Checks the status of local inference backends (Ollama first, then Llama.cpp/LM Studio).
   */
  public static async checkLocalBackends(preferredEndpoint?: string): Promise<LocalInferenceStatus> {
    const now = Date.now();
    if (this.cachedStatus && (now - this.lastCheckTime < this.CACHE_TTL_MS)) {
      return this.cachedStatus;
    }

    // Endpoints to probe
    const probeEndpoints = [
      preferredEndpoint,
      'http://localhost:11434', // Default Ollama
      'http://localhost:8080',  // Default Llama.cpp server
      'http://localhost:1234'   // Default LM Studio
    ].filter(Boolean) as string[];

    for (const rawBase of probeEndpoints) {
      const cleanBase = rawBase.replace(/\/v1\/?$/, '').replace(/\/$/, '');
      const status = await this.probeEndpoint(cleanBase);
      if (status.online) {
        this.cachedStatus = status;
        this.lastCheckTime = now;
        return status;
      }
    }

    const offlineStatus: LocalInferenceStatus = {
      online: false,
      latencyMs: 0,
      backend: 'none',
      availableModels: [],
      endpoint: preferredEndpoint || 'http://localhost:11434',
      lastChecked: now
    };

    this.cachedStatus = offlineStatus;
    this.lastCheckTime = now;
    return offlineStatus;
  }

  private static async probeEndpoint(base: string): Promise<LocalInferenceStatus> {
    const start = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    try {
      // 1. Try Ollama native tags API
      const ollamaRes = await fetch(`${base}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });

      if (ollamaRes.ok) {
        clearTimeout(timeoutId);
        const data = await ollamaRes.json();
        const models = Array.isArray(data.models)
          ? data.models.map((m: any) => m.name || m.model).filter(Boolean)
          : [];

        const latency = Math.round(performance.now() - start);
        return {
          online: true,
          latencyMs: Math.max(1, latency),
          backend: 'ollama',
          availableModels: models.length > 0 ? models : ['llama3:latest', 'deepseek-r1:8b'],
          endpoint: `${base}/v1`,
          lastChecked: Date.now()
        };
      }
    } catch {
      // Ollama not responding on /api/tags, try OpenAI compatible /v1/models (Llama.cpp / LM Studio)
    }

    try {
      const modelsRes = await fetch(`${base}/v1/models`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (modelsRes.ok) {
        const data = await modelsRes.json();
        const models = Array.isArray(data.data)
          ? data.data.map((m: any) => m.id).filter(Boolean)
          : ['local-model'];

        const latency = Math.round(performance.now() - start);
        return {
          online: true,
          latencyMs: Math.max(1, latency),
          backend: base.includes('1234') ? 'lmstudio' : 'llamacpp',
          availableModels: models,
          endpoint: `${base}/v1`,
          lastChecked: Date.now()
        };
      }
    } catch {
      // Both probes failed
    } finally {
      clearTimeout(timeoutId);
    }

    return {
      online: false,
      latencyMs: 0,
      backend: 'none',
      availableModels: [],
      endpoint: `${base}/v1`,
      lastChecked: Date.now()
    };
  }
}
