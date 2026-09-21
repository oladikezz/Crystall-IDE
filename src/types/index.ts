export type AIProvider = 
  | 'deepseek'
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'groq'
  | 'openrouter'
  | 'ollama'
  | 'llamacpp'
  | 'custom';

export * from './ai';

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
  tokensUsed?: { prompt: number; completion: number };
  contextSummary?: string;
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

export interface ProcessOutputEvent {
  type: 'stdout' | 'stderr' | 'exit';
  text?: string;
  code?: number;
  elapsedMs?: number;
  pid?: number;
}

export interface SystemRuntimesInfo {
  python: string | null;
  node: string | null;
  git: string | null;
  rustc: string | null;
  go: string | null;
  gcc: string | null;
  os: string;
  cpus: number;
  totalMemoryGb: number;
  freeMemoryGb: number;
}

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
      openFolderDialog?: () => Promise<{ folderName: string; folderPath: string; tree: ExplorerNode[] } | null>;
      readFile?: (filePath: string) => Promise<{ success: boolean; content?: string; name?: string; path?: string; error?: string }>;
      writeFile?: (filePath: string, content: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      createFile?: (targetPath: string, content?: string) => Promise<{ success: boolean; targetPath?: string; error?: string }>;
      deleteFile?: (targetPath: string) => Promise<{ success: boolean; error?: string }>;
      renameFile?: (oldPath: string, newPath: string) => Promise<{ success: boolean; error?: string }>;
      createFolder?: (dirPath: string) => Promise<{ success: boolean; error?: string }>;
      runProcess?: (opts: { code?: string; language?: string; filePath?: string; cwd?: string; args?: string[] }) => Promise<{ success: boolean; pid?: number; command?: string; workingDir?: string; error?: string }>;
      killProcess?: () => Promise<{ success: boolean; error?: string }>;
      writeStdin?: (text: string) => Promise<{ success: boolean; error?: string }>;
      onProcessOutput?: (callback: (event: ProcessOutputEvent) => void) => () => void;
      detectRuntimes?: () => Promise<SystemRuntimesInfo>;
      setAlwaysOnTop?: (flag: boolean) => Promise<boolean>;
      setThemeMode?: (opts: { isTransparent: boolean; isLight: boolean }) => void;
    };
  }
}

export type ActiveView = 'editor' | 'vibecoder' | 'scripthub' | 'runner' | 'settings';

export type CrystallThemeId = 
  | 'dark-solid'
  | 'dark-transparent'
  | 'light-solid'
  | 'light-transparent'
  // Backward compatibility
  | 'dark-v1'
  | 'dark-v2'
  | 'dark-v3'
  | 'light-v1'
  | 'light-v2'
  | 'light-v3'
  | 'dark-charcoal'
  | 'midnight-oled'
  | 'slate-navy'
  | 'light-classic'
  | 'warm-paper'
  | 'acrylic-glass';

export interface CrystallTheme {
  id: CrystallThemeId;
  versionBadge: string;
  styleVariant: string;
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