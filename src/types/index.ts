export type AIProvider = 
  | 'deepseek'
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'groq'
  | 'openrouter'
  | 'ollama'
  | 'custom';

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
  temperature: number;
  systemPrompt: string;
}

export type AllConfigs = Record<AIProvider, ProviderConfig>;

export type SupportedLanguage = 
  | 'python'
  | 'typescript'
  | 'javascript'
  | 'lua'
  | 'html'
  | 'css'
  | 'json'
  | 'cpp'
  | 'rust'
  | 'go'
  | 'markdown'
  | 'shell';

export interface LanguageMeta {
  id: SupportedLanguage;
  name: string;
  ext: string;
  color: string;
  sampleCode: string;
}

export interface FileTab {
  id: string;
  name: string;
  language: string;
  content: string;
  path?: string;
  isDirty?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  timestamp: string;
  modelUsed?: string;
}

export interface ConsoleLog {
  id: string;
  type: 'info' | 'warn' | 'error' | 'success' | 'injected' | 'ready';
  message: string;
  timestamp: string;
}

export interface ExplorerNode {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'service' | 'script';
  icon?: string;
  children?: ExplorerNode[];
  content?: string;
  language?: string;
  path?: string;
}

export interface QuickScript {
  id: string;
  name: string;
  stats?: string;
  category: string;
  content: string;
  language?: string;
  description?: string;
}

export type InjectorStatus = 'unattached' | 'injecting' | 'injected';
export type RunnerTarget = 'auto' | 'python' | 'node' | 'lua' | 'browser' | 'system';

export interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  tabSize: number;
  autoAttach: boolean;
  soundEffects: boolean;
  alwaysOnTop: boolean;
  defaultRunner?: RunnerTarget;
}

export type ModalType = 
  | 'settings' 
  | 'scripthub' 
  | 'bytecode' 
  | 'process' 
  | 'apiref' 
  | 'shortcuts' 
  | 'about' 
  | 'add-script' 
  | 'properties' 
  | null;

declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      openFileDialog: () => Promise<{ name: string; path: string; content: string } | null>;
      saveFileDialog: (data: { name: string; content: string }) => Promise<{ success: boolean; filePath?: string }>;
      openFolderDialog?: () => Promise<{ path: string; name: string } | null>;
      setAlwaysOnTop?: (flag: boolean) => Promise<boolean>;
    };
  }
}

export type ActiveView = 'editor' | 'vibecoder' | 'scripthub' | 'runner' | 'settings';

export type CrystallThemeId = 
  | 'dark-charcoal'
  | 'midnight-oled'
  | 'slate-navy'
  | 'light-classic'
  | 'warm-paper'
  | 'acrylic-glass';

export interface CrystallTheme {
  id: CrystallThemeId;
  name: string;
  subtitle: string;
  category: 'dark' | 'light' | 'glass';
  description: string;
  previewColors: {
    bg: string;
    panel: string;
    accent: string;
    text: string;
    border: string;
  };
  monacoTheme: string;
  cssVars: Record<string, string>;
}