import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  X, 
  Plus, 
  Play, 
  Trash2, 
  Copy, 
  Bot, 
  Save, 
  Zap, 
  Check, 
  RotateCw, 
  Sparkles,
  Code2,
  FileCode,
  Globe,
  Terminal,
  FileJson,
  FileText
} from 'lucide-react';
import { FileTab, CrystallThemeId, InjectorStatus, EditorSettings } from '../types';
import { CRYSTALL_THEMES } from '../data/themes';
import { CrystallLogo } from './CrystallLogo';

export interface EditorAreaHandle {
  undo: () => void;
  redo: () => void;
  find: () => void;
  replace: () => void;
  format: () => void;
  selectAll: () => void;
  getSelectedText: () => string;
}

interface EditorAreaProps {
  tabs: FileTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onRenameTab: (id: string, newName: string) => void;
  onDuplicateTab: (id: string) => void;
  onContentChange: (content: string) => void;
  onExecute: () => void;
  onAttach: () => void;
  injectorStatus: InjectorStatus;
  onClear: () => void;
  onSave: () => void;
  onToggleVibecoder: () => void;
  isVibecoderOpen: boolean;
  activeTheme: CrystallThemeId;
  settings: EditorSettings;
}

export const EditorArea = forwardRef<EditorAreaHandle, EditorAreaProps>(({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onRenameTab,
  onDuplicateTab,
  onContentChange,
  onExecute,
  onAttach,
  injectorStatus,
  onClear,
  onSave,
  onToggleVibecoder,
  isVibecoderOpen,
  activeTheme,
  settings
}, ref) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [tempTabName, setTempTabName] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useImperativeHandle(ref, () => ({
    undo: () => editorRef.current?.trigger('source', 'undo', null),
    redo: () => editorRef.current?.trigger('source', 'redo', null),
    find: () => editorRef.current?.getAction('actions.find')?.run(),
    replace: () => editorRef.current?.getAction('editor.action.startFindReplaceAction')?.run(),
    format: () => {
      try {
        editorRef.current?.getAction('editor.action.formatDocument')?.run();
      } catch {}
    },
    selectAll: () => {
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          editorRef.current.setSelection(model.getFullModelRange());
        }
      }
    },
    getSelectedText: () => {
      if (editorRef.current) {
        const selection = editorRef.current.getSelection();
        return editorRef.current.getModel()?.getValueInRange(selection) || '';
      }
      return '';
    }
  }));

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // 1. Dark Charcoal (Figma exact default)
    monaco.editor.defineTheme('crystall-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'f97316', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'f97316', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'f8fafc' },
        { token: 'string', foreground: '38bdf8' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'comment', foreground: '52525b', fontStyle: 'italic' },
        { token: 'type', foreground: 'c084fc' },
        { token: 'function', foreground: '60a5fa' },
      ],
      colors: {
        'editor.background': '#0c0d12',
        'editor.foreground': '#f8fafc',
        'editorLineNumber.foreground': '#3f3f46',
        'editorLineNumber.activeForeground': '#f97316',
        'editor.selectionBackground': '#f9731633',
        'editor.inactiveSelectionBackground': '#f973161a',
        'editorCursor.foreground': '#f97316',
        'editor.lineHighlightBackground': '#ffffff05',
        'editorGutter.background': '#0c0d12',
      }
    });

    // 2. Midnight OLED (Pitch Black)
    monaco.editor.defineTheme('crystall-midnight', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'ff9800', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'ffffff' },
        { token: 'string', foreground: '4fc3f7' },
        { token: 'number', foreground: 'ffd54f' },
        { token: 'comment', foreground: '424242', fontStyle: 'italic' },
        { token: 'type', foreground: 'ce93d8' },
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#ffffff',
        'editorLineNumber.foreground': '#333333',
        'editorLineNumber.activeForeground': '#ff9800',
        'editor.selectionBackground': '#ff980040',
        'editorCursor.foreground': '#ff9800',
        'editor.lineHighlightBackground': '#ffffff05',
        'editorGutter.background': '#000000',
      }
    });

    // 3. Slate Navy
    monaco.editor.defineTheme('crystall-slate', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '38bdf8', fontStyle: 'bold' },
        { token: 'identifier', foreground: '7dd3fc' },
        { token: 'string', foreground: '6ee7b7' },
        { token: 'number', foreground: 'c4b5fd' },
        { token: 'comment', foreground: '475569', fontStyle: 'italic' },
        { token: 'type', foreground: 'fde047' },
      ],
      colors: {
        'editor.background': '#0b1120',
        'editor.foreground': '#f1f5f9',
        'editorLineNumber.foreground': '#334155',
        'editorLineNumber.activeForeground': '#0284c7',
        'editor.selectionBackground': '#0284c733',
        'editorCursor.foreground': '#38bdf8',
        'editor.lineHighlightBackground': '#ffffff08',
        'editorGutter.background': '#0b1120',
      }
    });

    // 4. Light Classic
    monaco.editor.defineTheme('crystall-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'ea580c', fontStyle: 'bold' },
        { token: 'identifier', foreground: '0284c7' },
        { token: 'string', foreground: '16a34a' },
        { token: 'number', foreground: '7c3aed' },
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
        { token: 'type', foreground: 'd97706' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#0f172a',
        'editorLineNumber.foreground': '#cbd5e1',
        'editorLineNumber.activeForeground': '#ea580c',
        'editor.selectionBackground': '#ea580c25',
        'editorCursor.foreground': '#ea580c',
        'editor.lineHighlightBackground': '#00000006',
        'editorGutter.background': '#ffffff',
      }
    });

    // 5. Warm Paper
    monaco.editor.defineTheme('crystall-warm', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'c2410c', fontStyle: 'bold' },
        { token: 'identifier', foreground: '0369a1' },
        { token: 'string', foreground: '15803d' },
        { token: 'number', foreground: '6d28d9' },
        { token: 'comment', foreground: 'a8a29e', fontStyle: 'italic' },
        { token: 'type', foreground: 'b45309' },
      ],
      colors: {
        'editor.background': '#fbf9f4',
        'editor.foreground': '#292524',
        'editorLineNumber.foreground': '#d6d3d1',
        'editorLineNumber.activeForeground': '#ea580c',
        'editor.selectionBackground': '#ea580c20',
        'editorCursor.foreground': '#ea580c',
        'editor.lineHighlightBackground': '#00000004',
        'editorGutter.background': '#fbf9f4',
      }
    });

    // 6. Acrylic Glass
    monaco.editor.defineTheme('crystall-acrylic', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'f97316', fontStyle: 'bold' },
        { token: 'identifier', foreground: '38bdf8' },
        { token: 'string', foreground: '4ade80' },
        { token: 'number', foreground: 'c084fc' },
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#00000000',
        'editor.foreground': '#f8fafc',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#f97316',
        'editor.selectionBackground': '#f9731633',
        'editorCursor.foreground': '#f97316',
        'editor.lineHighlightBackground': '#ffffff08',
        'editorGutter.background': '#00000000',
      }
    });

    const themeMap: Record<CrystallThemeId, string> = {
      'dark-charcoal': 'crystall-dark',
      'midnight-oled': 'crystall-midnight',
      'slate-navy': 'crystall-slate',
      'light-classic': 'crystall-light',
      'warm-paper': 'crystall-warm',
      'acrylic-glass': 'crystall-acrylic'
    };
    monaco.editor.setTheme(themeMap[activeTheme] || 'crystall-dark');
  };

  useEffect(() => {
    if (monacoRef.current) {
      const themeMap: Record<CrystallThemeId, string> = {
        'dark-charcoal': 'crystall-dark',
        'midnight-oled': 'crystall-midnight',
        'slate-navy': 'crystall-slate',
        'light-classic': 'crystall-light',
        'warm-paper': 'crystall-warm',
        'acrylic-glass': 'crystall-acrylic'
      };
      monacoRef.current.editor.setTheme(themeMap[activeTheme] || 'crystall-dark');
    }
  }, [activeTheme]);

  const handleCopy = () => {
    if (activeTab?.content) {
      navigator.clipboard.writeText(activeTab.content);
    }
  };

  const handleStartRename = (tab: FileTab, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setTempTabName(tab.name);
  };

  const handleFinishRename = (id: string) => {
    if (tempTabName.trim()) {
      onRenameTab(id, tempTabName.trim());
    }
    setEditingTabId(null);
  };

  const getTabIcon = (tab: FileTab) => {
    const name = tab.name.toLowerCase();
    if (name.endsWith('.py')) return <Code2 className="w-3 h-3 text-blue-400 shrink-0" />;
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return <FileCode className="w-3 h-3 text-sky-400 shrink-0" />;
    if (name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode className="w-3 h-3 text-yellow-400 shrink-0" />;
    if (name.endsWith('.lua') || name.endsWith('.luau')) return <Terminal className="w-3 h-3 text-cyan-400 shrink-0" />;
    if (name.endsWith('.html')) return <Globe className="w-3 h-3 text-orange-400 shrink-0" />;
    if (name.endsWith('.json')) return <FileJson className="w-3 h-3 text-lime-400 shrink-0" />;
    return <FileText className="w-3 h-3 text-zinc-400 shrink-0" />;
  };

  return (
    <div 
      className="flex flex-col h-full select-none font-sans overflow-hidden border-b"
      style={{
        backgroundColor: 'var(--bg-editor)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* 1. Exact Figma Tabs Bar + Right Action Controls */}
      <div 
        className="h-9 px-2 flex items-center justify-between border-b shrink-0 select-none overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Left: Scrollable Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none h-full py-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isEditing = editingTabId === tab.id;

            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                onDoubleClick={(e) => handleStartRename(tab, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, tabId: tab.id });
                }}
                className={`group relative flex items-center gap-1.5 h-7 px-2.5 rounded text-xs transition-all cursor-pointer select-none border ${
                  isActive 
                    ? 'border-t-2 font-medium shadow-sm' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--bg-editor)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderTopColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  borderColor: isActive ? 'var(--border-color)' : 'transparent'
                }}
              >
                {getTabIcon(tab)}

                {isEditing ? (
                  <input
                    type="text"
                    value={tempTabName}
                    autoFocus
                    onChange={(e) => setTempTabName(e.target.value)}
                    onBlur={() => handleFinishRename(tab.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinishRename(tab.id);
                      if (e.key === 'Escape') setEditingTabId(null);
                    }}
                    className="bg-transparent text-xs font-sans outline-none w-20 text-zinc-100 border-b border-orange-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate max-w-[120px] font-sans text-xs">{tab.name}</span>
                )}

                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 hover:text-red-400 transition-opacity ml-1"
                    title="Close Tab"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={onNewTab}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-200 ml-0.5 shrink-0"
            title="New File (Ctrl+N)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Modern IDE Toolbar */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2">
          {/* Runtime Connect / Attach Button */}
          <button
            onClick={onAttach}
            disabled={injectorStatus === 'injecting'}
            className="flex items-center justify-center w-6 h-6 rounded-full transition-all cursor-pointer shadow-sm relative group"
            style={{
              backgroundColor: injectorStatus === 'injected' 
                ? 'rgba(16, 185, 129, 0.2)' 
                : injectorStatus === 'injecting'
                  ? 'rgba(245, 158, 11, 0.2)'
                  : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${injectorStatus === 'injected' ? '#10b981' : injectorStatus === 'injecting' ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)'}`
            }}
            title={
              injectorStatus === 'injected' 
                ? 'Runtime Target Connected (Click to Re-link)' 
                : injectorStatus === 'injecting' 
                  ? 'Linking Environment...' 
                  : 'Connect Runtime Environment (F6)'
            }
          >
            {injectorStatus === 'injecting' ? (
              <RotateCw className="w-3 h-3 text-amber-400 animate-spin" />
            ) : injectorStatus === 'injected' ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Zap className="w-3 h-3 text-zinc-300 group-hover:text-amber-400 transition-colors" />
            )}
          </button>

          {/* Orange Circular Play Button */}
          <button
            onClick={onExecute}
            className="flex items-center justify-center w-6 h-6 rounded-full hover:scale-105 active:scale-95 transition-transform cursor-pointer text-white shadow-md"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            title="Run Program / Script (F5)"
          >
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </button>

          {/* Circular Clear Button */}
          <button
            onClick={onClear}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/5 transition-all cursor-pointer text-zinc-400 hover:text-white"
            title="Clear Active Buffer"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          {/* Circular Save Button */}
          <button
            onClick={onSave}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/5 transition-all cursor-pointer text-zinc-400 hover:text-white"
            title="Save File (Ctrl+S)"
          >
            <Save className="w-3 h-3" />
          </button>

          {/* Circular Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/5 transition-all cursor-pointer text-zinc-400 hover:text-white"
            title="Copy Code"
          >
            <Copy className="w-3 h-3" />
          </button>

          <div className="w-px h-3.5 bg-white/10 mx-0.5" />

          {/* AI Vibecoder Button */}
          <button
            onClick={onToggleVibecoder}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border"
            style={{
              backgroundColor: isVibecoderOpen ? 'var(--status-badge-bg)' : 'transparent',
              color: isVibecoderOpen ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderColor: isVibecoderOpen ? 'var(--status-badge-border)' : 'var(--border-color)'
            }}
            title="AI Assistant Drawer (Ctrl+I)"
          >
            <Bot className="w-3 h-3" />
            <span>Crystall AI</span>
          </button>
        </div>
      </div>

      {/* Tab Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 rounded-lg border shadow-2xl py-1 text-xs font-sans backdrop-blur-md w-40"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'var(--bg-modal)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <button
            onClick={() => {
              const targetTab = tabs.find(t => t.id === contextMenu.tabId);
              if (targetTab) {
                setEditingTabId(targetTab.id);
                setTempTabName(targetTab.name);
              }
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-white/5 cursor-pointer"
          >
            Rename Tab
          </button>
          <button
            onClick={() => {
              onDuplicateTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-white/5 cursor-pointer"
          >
            Duplicate Tab
          </button>
          <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
          <button
            onClick={() => {
              onCloseTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-red-400 cursor-pointer"
          >
            Close Tab
          </button>
        </div>
      )}

      {/* 2. Monaco Editor Container */}
      <div className="flex-1 relative min-h-0">
        {/* Centered 3D Crystal Watermark */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0"
          style={{ 
            opacity: activeTheme === 'acrylic-glass' ? 0.35 : 0.04,
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' 
          }}
        >
          <CrystallLogo size={200} />
        </div>

        <Editor
          height="100%"
          language={activeTab?.language || 'python'}
          value={activeTab?.content || ''}
          onChange={(value) => onContentChange(value || '')}
          onMount={handleEditorMount}
          options={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: settings.fontSize || 12.5,
            lineHeight: Math.round((settings.fontSize || 12.5) * 1.55),
            lineNumbers: settings.lineNumbers ? 'on' : 'off',
            lineNumbersMinChars: 3,
            wordWrap: settings.wordWrap ? 'on' : 'off',
            minimap: { enabled: settings.minimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: settings.tabSize || 4,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>
    </div>
  );
});