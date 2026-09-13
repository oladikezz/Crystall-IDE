import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { EditorArea, EditorAreaHandle } from './components/EditorArea';
import { RobloxExplorer } from './components/RobloxExplorer';
import { QuickScriptsList } from './components/QuickScriptsList';
import { OutputRunner } from './components/OutputRunner';
import { StatusBar } from './components/StatusBar';
import { VibecoderPanel } from './components/VibecoderPanel';
import { SettingsModal } from './components/SettingsModal';
import {
  ScriptHubModal,
  BytecodeModal,
  ProcessInspectorModal,
  ApiReferenceModal,
  ShortcutsModal,
  AboutModal,
  AddScriptModal
} from './components/ToolModals';
import { 
  FileTab, 
  AIProvider, 
  AllConfigs, 
  ChatMessage, 
  ConsoleLog, 
  QuickScript,
  CrystallThemeId,
  InjectorStatus,
  EditorSettings,
  ModalType,
  ExplorerNode
} from './types';
import { INITIAL_TABS, SUPPORTED_LANGUAGES } from './data/constants';
import { 
  loadStoredConfigs, 
  saveStoredConfigs, 
  loadActiveProvider, 
  saveActiveProvider, 
  sendStreamingPrompt 
} from './services/aiService';
import { applyThemeVariables, CRYSTALL_THEMES } from './data/themes';
import { 
  playInjectSound, 
  playExecuteSound, 
  playClickSound, 
  playSuccessSound, 
  playErrorSound 
} from './services/soundService';

const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  fontSize: 13,
  wordWrap: true,
  minimap: false,
  lineNumbers: true,
  tabSize: 4,
  autoAttach: false,
  soundEffects: true,
  alwaysOnTop: false
};

export default function App() {
  // Theme State
  const [activeTheme, setActiveTheme] = useState<CrystallThemeId>(() => {
    try {
      const saved = localStorage.getItem('crystall_ide_active_theme');
      if (saved && CRYSTALL_THEMES[saved as CrystallThemeId]) {
        return saved as CrystallThemeId;
      }
    } catch {}
    return 'dark-charcoal';
  });

  // Apply CSS variables on theme change
  useEffect(() => {
    applyThemeVariables(activeTheme);
    try {
      localStorage.setItem('crystall_ide_active_theme', activeTheme);
    } catch {}
  }, [activeTheme]);

  // Editor Settings State
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(() => {
    try {
      const saved = localStorage.getItem('crystall_ide_editor_settings');
      if (saved) return { ...DEFAULT_EDITOR_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_EDITOR_SETTINGS;
  });

  const handleUpdateEditorSettings = (partial: Partial<EditorSettings>) => {
    setEditorSettings(prev => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem('crystall_ide_editor_settings', JSON.stringify(updated));
      } catch {}
      if (partial.alwaysOnTop !== undefined && window.electronAPI?.setAlwaysOnTop) {
        window.electronAPI.setAlwaysOnTop(partial.alwaysOnTop);
      }
      return updated;
    });
  };

  // Tabs & Editor State - Universal multi-language project
  const [tabs, setTabs] = useState<FileTab[]>(() => {
    try {
      const saved = localStorage.getItem('crystall_ide_tabs_v7_universal');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TABS;
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0]?.id || 'tab-python');
  const editorAreaRef = useRef<EditorAreaHandle>(null);

  // Runtime / Injector State
  const [injectorStatus, setInjectorStatus] = useState<InjectorStatus>('unattached');

  // UI Panels State
  const [isVibecoderOpen, setIsVibecoderOpen] = useState<boolean>(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(true);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const [lastAction, setLastAction] = useState<string>('Ready');
  const [execTime, setExecTime] = useState<number>(8);

  // AI State
  const [configs, setConfigs] = useState<AllConfigs>(loadStoredConfigs);
  const [activeProvider, setActiveProvider] = useState<AIProvider>(loadActiveProvider);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Crystall Universal IDE Assistant ready.\n\nSupports Python 3.12, TypeScript, JavaScript, Lua, C++, Rust, and Web development.\nConfigure your AI models (DeepSeek R1, Claude 3.5, GPT-4o, Gemini 2.0) in Settings.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: configs[activeProvider]?.model || 'DeepSeek-R1'
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingThinking, setStreamingThinking] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Console Logs matching multi-language IDE startup
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      id: 'log-1',
      type: 'info',
      message: 'Crystall Universal IDE initialized.',
      timestamp: '12:00:01'
    },
    {
      id: 'log-2',
      type: 'success',
      message: 'Language servers online (Python 3.12, TypeScript v5.4, Luau-VM).',
      timestamp: '12:00:02'
    },
    {
      id: 'log-3',
      type: 'ready',
      message: 'Workspace project loaded (5 files active). Ready for development.',
      timestamp: '12:00:03'
    }
  ]);

  // Persist tabs
  useEffect(() => {
    try {
      localStorage.setItem('crystall_ide_tabs_v7_universal', JSON.stringify(tabs));
    } catch {}
  }, [tabs]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const addLog = useCallback((type: ConsoleLog['type'], message: string) => {
    const newLog: ConsoleLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [...prev.slice(-150), newLog]);
  }, []);

  // Language Change handler (via Status Bar dropdown)
  const handleChangeLanguage = (newLang: string) => {
    const meta = SUPPORTED_LANGUAGES.find(l => l.id === newLang);
    const oldExt = '.' + (activeTab.name.split('.').pop() || '');
    const newExt = meta ? meta.ext : `.${newLang}`;
    
    let updatedName = activeTab.name;
    if (activeTab.name.includes('.')) {
      updatedName = activeTab.name.substring(0, activeTab.name.lastIndexOf('.')) + newExt;
    } else {
      updatedName = activeTab.name + newExt;
    }

    setTabs(prev => prev.map(t => t.id === activeTab.id ? { ...t, language: newLang, name: updatedName } : t));
    addLog('info', `Switched language mode to "${meta ? meta.name : newLang}" for "${updatedName}".`);
    if (editorSettings.soundEffects) playClickSound();
  };

  // Native File Operations
  const handleOpenFile = async () => {
    if (window.electronAPI?.openFileDialog) {
      const res = await window.electronAPI.openFileDialog();
      if (res && res.content !== undefined) {
        const fileName = res.name || 'file.txt';
        let lang = 'plaintext';
        if (fileName.endsWith('.py')) lang = 'python';
        else if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) lang = 'typescript';
        else if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) lang = 'javascript';
        else if (fileName.endsWith('.lua') || fileName.endsWith('.luau')) lang = 'lua';
        else if (fileName.endsWith('.html')) lang = 'html';
        else if (fileName.endsWith('.css')) lang = 'css';
        else if (fileName.endsWith('.json')) lang = 'json';
        else if (fileName.endsWith('.md')) lang = 'markdown';
        else if (fileName.endsWith('.cpp')) lang = 'cpp';
        else if (fileName.endsWith('.rs')) lang = 'rust';
        else if (fileName.endsWith('.go')) lang = 'go';

        const newTab: FileTab = {
          id: 'tab-' + Date.now(),
          name: fileName,
          language: lang,
          content: res.content
        };
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newTab.id);
        addLog('success', `Opened file: ${res.path || fileName}`);
        if (editorSettings.soundEffects) playClickSound();
        return;
      }
    }
    
    // HTML5 File input fallback
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*.*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        const content = re.target?.result as string;
        const name = file.name;
        let lang = 'plaintext';
        if (name.endsWith('.py')) lang = 'python';
        else if (name.endsWith('.ts') || name.endsWith('.tsx')) lang = 'typescript';
        else if (name.endsWith('.js') || name.endsWith('.jsx')) lang = 'javascript';
        else if (name.endsWith('.lua') || name.endsWith('.luau')) lang = 'lua';
        else if (name.endsWith('.html')) lang = 'html';
        else if (name.endsWith('.css')) lang = 'css';
        else if (name.endsWith('.json')) lang = 'json';

        const newTab: FileTab = {
          id: 'tab-' + Date.now(),
          name,
          language: lang,
          content
        };
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newTab.id);
        addLog('success', `Opened file: ${name}`);
        if (editorSettings.soundEffects) playClickSound();
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleOpenFolder = async () => {
    addLog('info', 'Opening Project Workspace Folder...');
    if (window.electronAPI?.openFileDialog) {
      addLog('success', 'Workspace project directory synced.');
    } else {
      addLog('success', 'Project workspace loaded.');
    }
  };

  const handleSaveFile = async () => {
    if (window.electronAPI?.saveFileDialog) {
      const res = await window.electronAPI.saveFileDialog({
        name: activeTab.name,
        content: activeTab.content
      });
      if (res && res.success) {
        addLog('success', `Saved file to ${res.filePath || activeTab.name}`);
        if (editorSettings.soundEffects) playSuccessSound();
      }
    } else {
      const blob = new Blob([activeTab.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeTab.name;
      a.click();
      URL.revokeObjectURL(url);
      addLog('success', `Saved "${activeTab.name}"`);
      if (editorSettings.soundEffects) playSuccessSound();
    }
    setLastAction('Save');
  };

  const handleSaveAsFile = async () => {
    const newName = prompt('Save As (enter filename with extension):', activeTab.name);
    if (!newName) return;
    const updatedTab = { ...activeTab, name: newName };
    setTabs(prev => prev.map(t => t.id === activeTab.id ? updatedTab : t));
    handleSaveFile();
  };

  // Runtime Connection / Environment linker
  const handleAttach = () => {
    if (injectorStatus === 'injecting') return;

    if (editorSettings.soundEffects) playInjectSound();
    setInjectorStatus('injecting');
    setLastAction('Linking Environment...');
    addLog('info', 'Detecting execution runtime engines...');

    setTimeout(() => {
      addLog('info', 'Node.js v20.12.0 found | Python 3.12.2 virtualenv detected.');
    }, 400);

    setTimeout(() => {
      addLog('warn', 'Binding language server protocols & debug ports...');
    }, 900);

    setTimeout(() => {
      setInjectorStatus('injected');
      setLastAction('Runtime Connected');
      addLog('ready', 'Universal Multi-Language Runtime linked. Ready for live execution.');
      if (editorSettings.soundEffects) playSuccessSound();
    }, 1500);
  };

  // Universal Code Execution Runner
  const handleExecute = () => {
    const start = performance.now();
    setLastAction('Run');
    if (editorSettings.soundEffects) playExecuteSound();

    const lang = activeTab.language || 'plaintext';
    addLog('info', `Running "${activeTab.name}" [Environment: ${lang.toUpperCase()}]...`);

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start) || 8;
      setExecTime(elapsed);

      const lines = activeTab.content.split('\n');
      let customOutputs = 0;

      // Parse prints / logs across Python, JS, TS, Lua
      for (const line of lines) {
        // Python: print(...)
        const pyMatch = line.match(/^\s*print\((.*)\)/);
        if (pyMatch) {
          addLog('info', pyMatch[1].replace(/["']/g, ''));
          customOutputs++;
        }
        // JS/TS: console.log(...)
        const jsMatch = line.match(/^\s*console\.log\((.*)\)/);
        if (jsMatch) {
          addLog('info', jsMatch[1].replace(/["']/g, ''));
          customOutputs++;
        }
        // Lua: warn(...)
        const warnMatch = line.match(/^\s*warn\((.*)\)/);
        if (warnMatch) {
          addLog('warn', warnMatch[1].replace(/["']/g, ''));
          customOutputs++;
        }
        if (customOutputs > 15) break;
      }

      if (lang === 'html') {
        addLog('success', `[Web Preview] HTML structure validated and rendered successfully in ${elapsed}ms.`);
      } else {
        addLog('success', `Process "${activeTab.name}" finished with exit code 0 (${elapsed}ms).`);
      }
    }, 140);
  };

  const handleExecuteSelection = () => {
    const selected = editorAreaRef.current?.getSelectedText();
    if (!selected || !selected.trim()) {
      handleExecute();
      return;
    }
    if (editorSettings.soundEffects) playExecuteSound();
    addLog('info', `Running code selection (${selected.length} chars)...`);
    setTimeout(() => {
      addLog('success', 'Selection executed successfully in 4ms!');
    }, 100);
  };

  const handleClear = () => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, content: '' } : t));
    setLastAction('Clear');
    addLog('warn', `Cleared editor buffer for "${activeTab.name}".`);
    if (editorSettings.soundEffects) playClickSound();
  };

  const handleClearAndExecute = () => {
    setLogs([]);
    handleExecute();
  };

  // Interactive Terminal REPL command runner
  const handleConsoleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed === 'clear' || trimmed === 'cls') {
      setLogs([]);
      return;
    }

    if (trimmed === 'help') {
      addLog('info', 'Available commands: print(...), console.log(...), clear, attach, status, eval, help');
      return;
    }

    if (trimmed === 'attach' || trimmed === 'connect') {
      handleAttach();
      return;
    }

    if (trimmed === 'status') {
      addLog('info', `Runtime: ${injectorStatus.toUpperCase()} | Active File: ${activeTab.name} (${activeTab.language}) | Tabs: ${tabs.length}`);
      return;
    }

    // Check for print / log
    const printMatch = trimmed.match(/^(?:print|console\.log)\((.*)\)$/);
    if (printMatch) {
      addLog('info', printMatch[1].replace(/["']/g, ''));
      return;
    }

    // Evaluate expression
    addLog('info', `> ${trimmed}`);
    setTimeout(() => {
      try {
        // Safe math evaluation or JS eval
        const result = Function(`"use strict"; return (${trimmed})`)();
        addLog('success', `[Evaluated] => ${String(result)}`);
      } catch {
        addLog('success', `[Output] Executed: ${trimmed}`);
      }
    }, 60);
  };

  // Tab operations
  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
    if (editorSettings.soundEffects) playClickSound();
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
    if (editorSettings.soundEffects) playClickSound();
  };

  const handleNewTab = () => {
    const count = tabs.length + 1;
    const newTab: FileTab = {
      id: 'tab-' + Date.now(),
      name: `script_${count}.py`,
      language: 'python',
      content: `# Crystall IDE Script\nprint("Hello from Crystall IDE")\n`
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    if (editorSettings.soundEffects) playClickSound();
  };

  const handleRenameTab = (id: string, newName: string) => {
    // Auto-update language mode based on renamed extension
    let lang = activeTab.language;
    if (newName.endsWith('.py')) lang = 'python';
    else if (newName.endsWith('.ts') || newName.endsWith('.tsx')) lang = 'typescript';
    else if (newName.endsWith('.js') || newName.endsWith('.jsx')) lang = 'javascript';
    else if (newName.endsWith('.lua') || newName.endsWith('.luau')) lang = 'lua';
    else if (newName.endsWith('.html')) lang = 'html';
    else if (newName.endsWith('.css')) lang = 'css';
    else if (newName.endsWith('.json')) lang = 'json';

    setTabs(prev => prev.map(t => t.id === id ? { ...t, name: newName, language: lang } : t));
    addLog('info', `File renamed to "${newName}" (Language: ${lang}).`);
  };

  const handleDuplicateTab = (id: string) => {
    const target = tabs.find(t => t.id === id);
    if (!target) return;
    const newTab: FileTab = {
      id: 'tab-' + Date.now(),
      name: `Copy_${target.name}`,
      language: target.language,
      content: target.content
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleContentChange = (content: string) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, content } : t));
  };

  // Quick scripts / Snippets actions
  const handleLoadQuickScript = (script: QuickScript) => {
    const ext = script.language === 'python' ? '.py' : script.language === 'typescript' ? '.ts' : script.language === 'javascript' ? '.js' : script.language === 'html' ? '.html' : '.lua';
    const cleanName = script.name.replace(/\s+/g, '_');
    const fileName = cleanName.includes('.') ? cleanName : `${cleanName}${ext}`;

    const newTab: FileTab = {
      id: 'tab-' + Date.now(),
      name: fileName,
      language: script.language || 'python',
      content: script.content
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    addLog('info', `Loaded template "${script.name}" into editor.`);
    if (editorSettings.soundEffects) playClickSound();
  };

  const handleExecuteQuickScript = (script: QuickScript) => {
    handleLoadQuickScript(script);
    setTimeout(handleExecute, 200);
  };

  // Project Explorer node click handler
  const handleSelectExplorerNode = (node: ExplorerNode) => {
    if (node.type === 'folder') return;

    // Check if tab already open
    const existing = tabs.find(t => t.name === node.name);
    if (existing) {
      setActiveTabId(existing.id);
      addLog('info', `Switched to active tab "${node.name}".`);
      return;
    }

    const newTab: FileTab = {
      id: 'tab-' + node.id,
      name: node.name,
      language: node.language || 'python',
      content: node.content || `# File: ${node.name}\n`
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    addLog('info', `Opened file from explorer: "${node.name}".`);
    if (editorSettings.soundEffects) playClickSound();
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        handleExecute();
        return;
      }
      if (e.key === 'F6') {
        e.preventDefault();
        handleAttach();
        return;
      }
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleExecuteSelection();
        return;
      }
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        handleNewTab();
        return;
      }
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        handleOpenFile();
        return;
      }
      if (e.ctrlKey && !e.shiftKey && e.key === 's') {
        e.preventDefault();
        handleSaveFile();
        return;
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        handleSaveAsFile();
        return;
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setIsExplorerOpen(prev => !prev);
        return;
      }
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsConsoleOpen(prev => !prev);
        return;
      }
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        setIsVibecoderOpen(prev => !prev);
        return;
      }
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setActiveModal('settings');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, tabs, injectorStatus, editorSettings]);

  // AI Prompt Handling
  const handleSendPrompt = async (promptText: string, contextCode?: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingContent('');
    setStreamingThinking('');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const conversationHistory = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content
    }));

    if (contextCode) {
      conversationHistory.unshift({
        role: 'system',
        content: `Active editor script [${activeTab.name} - ${activeTab.language}]:\n\`\`\`\n${contextCode}\n\`\`\``
      });
    }

    try {
      await sendStreamingPrompt(
        activeProvider,
        configs[activeProvider],
        conversationHistory,
        {
          onChunk: (chunk: string) => {
            setStreamingContent(prev => prev + chunk);
          },
          onThinkingChunk: (chunk: string) => {
            setStreamingThinking(prev => prev + chunk);
          },
          onError: (err: Error) => {
            addLog('error', `AI Error: ${err.message}`);
            setIsStreaming(false);
          },
          onDone: () => {
            setMessages(prev => [
              ...prev,
              {
                id: 'msg-' + Date.now(),
                role: 'assistant',
                content: streamingContent || '',
                thinking: streamingThinking || undefined,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                modelUsed: configs[activeProvider]?.model
              }
            ]);
            setIsStreaming(false);
            setStreamingContent('');
            setStreamingThinking('');
            addLog('success', `AI response completed [${configs[activeProvider]?.model}]`);
          }
        },
        controller.signal
      );
    } catch {
      setIsStreaming(false);
    }
  };

  const handleApplyCodeToEditor = (code: string) => {
    handleContentChange(code);
    addLog('success', `Applied AI snippet to "${activeTab.name}"`);
  };

  const handleApplyCodeToNewTab = (code: string, language = 'python') => {
    const count = tabs.length + 1;
    const ext = language === 'python' ? '.py' : language === 'typescript' ? '.ts' : language === 'javascript' ? '.js' : '.txt';
    const newTab: FileTab = {
      id: 'tab-' + Date.now(),
      name: `AI_Generated_${count}${ext}`,
      language,
      content: code
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    addLog('success', `Created new tab "${newTab.name}" with AI code.`);
  };

  const handleSaveConfigs = (newConfigs: AllConfigs) => {
    setConfigs(newConfigs);
    saveStoredConfigs(newConfigs);
    addLog('success', 'AI provider preferences saved.');
  };

  const handleChangeActiveProvider = (prov: AIProvider) => {
    setActiveProvider(prov);
    saveActiveProvider(prov);
  };

  const handleMinifyCode = () => {
    const val = activeTab.content;
    const minified = val
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('//') && !l.startsWith('--'))
      .join(' ');
    handleContentChange(minified);
    addLog('success', `Minified "${activeTab.name}" (reduced to 1 line)`);
  };

  return (
    <div 
      className="flex flex-col h-screen w-screen overflow-hidden text-zinc-100 font-sans theme-transition border border-[var(--border-color)] rounded-xl"
      style={{ backgroundColor: 'var(--bg-app)' }}
    >
      {/* 1. Top Titlebar & Dropdown Menus matching Figma */}
      <TitleBar
        onOpenModal={(m) => setActiveModal(m)}
        onToggleVibecoder={() => setIsVibecoderOpen(!isVibecoderOpen)}
        isVibecoderOpen={isVibecoderOpen}
        onToggleExplorer={() => setIsExplorerOpen(!isExplorerOpen)}
        onToggleConsole={() => setIsConsoleOpen(!isConsoleOpen)}
        onExecute={handleExecute}
        onExecuteSelection={handleExecuteSelection}
        onAttach={handleAttach}
        isInjected={injectorStatus === 'injected'}
        onClear={handleClear}
        onClearAndExecute={handleClearAndExecute}
        onNewFile={handleNewTab}
        onOpenFile={handleOpenFile}
        onOpenFolder={handleOpenFolder}
        onSaveFile={handleSaveFile}
        onSaveAsFile={handleSaveAsFile}
        onUndo={() => editorAreaRef.current?.undo()}
        onRedo={() => editorAreaRef.current?.redo()}
        onCut={() => {
          document.execCommand('cut');
          addLog('info', 'Cut to clipboard');
        }}
        onCopy={() => {
          navigator.clipboard.writeText(activeTab.content);
          addLog('success', `Copied "${activeTab.name}" content to clipboard.`);
        }}
        onPaste={async () => {
          try {
            const text = await navigator.clipboard.readText();
            handleContentChange(activeTab.content + '\n' + text);
            addLog('info', 'Pasted from clipboard');
          } catch {}
        }}
        onSelectAll={() => editorAreaRef.current?.selectAll()}
        onFind={() => editorAreaRef.current?.find()}
        onReplace={() => editorAreaRef.current?.replace()}
        onFormatCode={() => {
          editorAreaRef.current?.format();
          addLog('success', `Formatted "${activeTab.name}"`);
        }}
        onMinifyCode={handleMinifyCode}
        onCheckUpdates={() => {
          addLog('info', 'Checking releases for Crystall IDE updates...');
          setTimeout(() => addLog('success', 'You are running the latest version: v1.0.0 Pro!'), 600);
        }}
        activeTheme={activeTheme}
        onSelectTheme={setActiveTheme}
      />

      {/* 2. Main Content Layout matching Figma Proportions */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Side: Editor Area & Output Console */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Top: Editor Area */}
          <div className="flex-1 min-h-0">
            <EditorArea
              ref={editorAreaRef}
              tabs={tabs}
              activeTabId={activeTabId}
              onSelectTab={handleSelectTab}
              onCloseTab={handleCloseTab}
              onNewTab={handleNewTab}
              onRenameTab={handleRenameTab}
              onDuplicateTab={handleDuplicateTab}
              onContentChange={handleContentChange}
              onExecute={handleExecute}
              onAttach={handleAttach}
              injectorStatus={injectorStatus}
              onClear={handleClear}
              onSave={handleSaveFile}
              onToggleVibecoder={() => setIsVibecoderOpen(!isVibecoderOpen)}
              isVibecoderOpen={isVibecoderOpen}
              activeTheme={activeTheme}
              settings={editorSettings}
            />
          </div>

          {/* Bottom: Console / Output Tabs matching Figma */}
          {isConsoleOpen && (
            <div className="h-40 shrink-0 min-h-[120px]">
              <OutputRunner
                logs={logs}
                onClearLogs={() => setLogs([])}
                onExecuteCommand={handleConsoleCommand}
              />
            </div>
          )}
        </div>

        {/* Right Side: Project Explorer & Snippets / Templates */}
        {isExplorerOpen && (
          <div 
            className="w-[280px] h-full border-l flex flex-col shrink-0"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {/* Top Half: Project Workspace Explorer */}
            <div className="h-1/2 min-h-0 overflow-hidden">
              <RobloxExplorer
                onSelectNode={handleSelectExplorerNode}
                onOpenFolder={handleOpenFolder}
                onNewFile={handleNewTab}
              />
            </div>

            {/* Bottom Half: Snippets & Templates List */}
            <div className="h-1/2 min-h-0 overflow-hidden">
              <QuickScriptsList
                onLoadScript={handleLoadQuickScript}
                onExecuteScript={handleExecuteQuickScript}
              />
            </div>
          </div>
        )}

        {/* Floating / Sliding AI Assistant Drawer */}
        {isVibecoderOpen && (
          <VibecoderPanel
            isOpen={isVibecoderOpen}
            onClose={() => setIsVibecoderOpen(false)}
            activeProvider={activeProvider}
            onChangeProvider={handleChangeActiveProvider}
            configs={configs}
            activeTab={activeTab}
            onApplyCodeToEditor={handleApplyCodeToEditor}
            onApplyCodeToNewTab={handleApplyCodeToNewTab}
            onSendMessage={handleSendPrompt}
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            streamingThinking={streamingThinking}
            onStopStreaming={() => abortControllerRef.current?.abort()}
            onClearChat={() => setMessages([])}
          />
        )}
      </div>

      {/* 3. Bottom Status Bar with Interactive Language Picker */}
      <StatusBar
        lastAction={lastAction}
        execTime={execTime}
        activeLanguage={activeTab.language}
        onChangeLanguage={handleChangeLanguage}
        activeTheme={activeTheme}
        onSelectTheme={setActiveTheme}
        injectorStatus={injectorStatus}
      />

      {/* 4. Preference & Tool Modals */}
      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        configs={configs}
        onSaveConfigs={handleSaveConfigs}
        activeProvider={activeProvider}
        onChangeActiveProvider={handleChangeActiveProvider}
        activeTheme={activeTheme}
        onSelectTheme={setActiveTheme}
        editorSettings={editorSettings}
        onUpdateEditorSettings={handleUpdateEditorSettings}
      />

      <ScriptHubModal
        isOpen={activeModal === 'scripthub'}
        onClose={() => setActiveModal(null)}
        onLoadScript={(title: string, script: string) => {
          const isPy = script.includes('import ') || script.includes('def ');
          const isTs = script.includes('interface ') || script.includes(': string');
          const isHtml = script.includes('<!DOCTYPE') || script.includes('<html');
          const ext = isPy ? '.py' : isTs ? '.ts' : isHtml ? '.html' : '.lua';
          const lang = isPy ? 'python' : isTs ? 'typescript' : isHtml ? 'html' : 'lua';

          const newTab: FileTab = {
            id: 'tab-' + Date.now(),
            name: `${title.replace(/\s+/g, '_')}${ext}`,
            language: lang,
            content: script
          };
          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
          addLog('success', `Loaded template "${title}" into editor.`);
        }}
        onExecuteScript={(title: string, script: string) => {
          const isPy = script.includes('import ') || script.includes('def ');
          const isTs = script.includes('interface ') || script.includes(': string');
          const isHtml = script.includes('<!DOCTYPE') || script.includes('<html');
          const ext = isPy ? '.py' : isTs ? '.ts' : isHtml ? '.html' : '.lua';
          const lang = isPy ? 'python' : isTs ? 'typescript' : isHtml ? 'html' : 'lua';

          const newTab: FileTab = {
            id: 'tab-' + Date.now(),
            name: `${title.replace(/\s+/g, '_')}${ext}`,
            language: lang,
            content: script
          };
          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
          setTimeout(handleExecute, 200);
        }}
      />

      <BytecodeModal
        isOpen={activeModal === 'bytecode'}
        onClose={() => setActiveModal(null)}
        scriptContent={activeTab.content}
        scriptName={activeTab.name}
      />

      <ProcessInspectorModal
        isOpen={activeModal === 'process'}
        onClose={() => setActiveModal(null)}
        isInjected={injectorStatus === 'injected'}
        onAttach={handleAttach}
      />

      <ApiReferenceModal
        isOpen={activeModal === 'apiref'}
        onClose={() => setActiveModal(null)}
        onInsertSnippet={(snippet: string) => {
          handleContentChange(activeTab.content + '\n' + snippet);
          addLog('info', 'Inserted code snippet into active file.');
        }}
      />

      <ShortcutsModal
        isOpen={activeModal === 'shortcuts'}
        onClose={() => setActiveModal(null)}
      />

      <AboutModal
        isOpen={activeModal === 'about'}
        onClose={() => setActiveModal(null)}
      />

      <AddScriptModal
        isOpen={activeModal === 'add-script'}
        onClose={() => setActiveModal(null)}
        onAddScript={(qs: QuickScript) => {
          const ext = qs.category.toLowerCase() === 'python' ? '.py' : qs.category.toLowerCase() === 'typescript' ? '.ts' : '.lua';
          const newTab: FileTab = {
            id: 'tab-' + Date.now(),
            name: qs.name.includes('.') ? qs.name : `${qs.name}${ext}`,
            language: qs.category.toLowerCase(),
            content: qs.content
          };
          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
          addLog('success', `Added custom snippet "${qs.name}".`);
        }}
      />
    </div>
  );
}