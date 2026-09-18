// ============================================================================
// Crystall IDE — AI & Context Engineering Type Definitions
// ============================================================================

export type AIProviderId =
  | 'deepseek'
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'groq'
  | 'openrouter'
  | 'ollama'
  | 'llamacpp'
  | 'custom';

export interface AIModelSpec {
  id: string;
  name: string;
  provider: AIProviderId;
  contextWindow: number; // in tokens, e.g. 128000
  maxOutputTokens: number;
  supportsThinking?: boolean;
  isLocal?: boolean;
  costPer1kInput?: number; // USD
  costPer1kOutput?: number; // USD
  recommendedFor?: 'reasoning' | 'coding' | 'fast' | 'general' | 'offline';
}

export interface ProviderEndpointConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  maxTokens?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}

export type AllProviderConfigs = Record<AIProviderId, ProviderEndpointConfig>;

// ----------------------------------------------------------------------------
// Context Engineering & Indexing Types
// ----------------------------------------------------------------------------

export type ASTNodeType = 'function' | 'class' | 'method' | 'interface' | 'import' | 'struct' | 'type';

export interface ASTNodeSummary {
  type: ASTNodeType;
  name: string;
  signature: string;
  startLine: number;
  endLine: number;
  enclosesCursor?: boolean;
}

export interface ASTSliceResult {
  language: string;
  symbols: ASTNodeSummary[];
  cursorScope?: ASTNodeSummary;
  outlineText: string;
}

export interface DiagnosticItem {
  message: string;
  severity: 'error' | 'warning' | 'info';
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  codeSnippet?: string;
  source?: string;
}

export interface ExecutionStderrItem {
  timestamp: string;
  type: 'error' | 'warn';
  message: string;
}

export interface ContextPayload {
  activeFile: {
    name: string;
    language: string;
    path?: string;
    content: string;
    totalLines: number;
  };
  selection?: {
    text: string;
    startLine: number;
    endLine: number;
  };
  astOutline?: string;
  cursorEnclosingScope?: string;
  diagnostics: DiagnosticItem[];
  recentStderr: ExecutionStderrItem[];
  openTabSummaries?: Array<{
    name: string;
    language: string;
    summary: string;
  }>;
  budgetMetrics: {
    estimatedInputTokens: number;
    maxContextTokens: number;
    truncatedParts: string[];
  };
}

export interface FormattedPromptPayload {
  systemPrompt: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  totalEstimatedTokens: number;
  contextAudit: {
    hadDiagnostics: boolean;
    hadStderr: boolean;
    hadAST: boolean;
    wasTruncated: boolean;
  };
}

// ----------------------------------------------------------------------------
// Streaming & Server-Sent Events (SSE) Types
// ----------------------------------------------------------------------------

export interface SSEParsedEvent {
  event?: string;
  data: string;
  id?: string;
  retry?: number;
}

export interface StreamChunkDelta {
  content?: string;
  reasoning?: string;
  role?: 'assistant';
  finishReason?: string | null;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onThinkingChunk?: (thinkText: string) => void;
  onError: (err: Error) => void;
  onDone: (metrics?: { totalChunks: number; finishReason?: string }) => void;
  onMetricsUpdate?: (metrics: { tokensPerSec: number; elapsedMs: number }) => void;
}

export interface LocalInferenceStatus {
  online: boolean;
  latencyMs: number;
  backend: 'ollama' | 'llamacpp' | 'lmstudio' | 'none';
  availableModels: string[];
  endpoint: string;
  lastChecked: number;
}
