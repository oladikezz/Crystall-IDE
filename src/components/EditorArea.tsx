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

const MONACO_THEME_MAP: Record<string, string> = {
  'dark-solid': 'crystall-dark-v1',
  'dark-transparent': 'crystall-dark-v2',
  'light-solid': 'crystall-light-v1',
  'light-transparent': 'crystall-light-v2',
  'dark-v1': 'crystall-dark-v1',
  'dark-v2': 'crystall-dark-v2',
  'dark-v3': 'crystall-dark-v3',
  'light-v1': 'crystall-light-v1',
  'light-v2': 'crystall-light-v2',
  'light-v3': 'crystall-light-v3',
  'dark-charcoal': 'crystall-dark-v1',
  'midnight-oled': 'crystall-dark-v2',
  'slate-navy': 'crystall-dark-v3',
  'light-classic': 'crystall-light-v1',
  'warm-paper': 'crystall-light-v2',
  'acrylic-glass': 'crystall-dark-v2'
};

export const getMonacoTheme = (activeTheme: string) => {
  return MONACO_THEME_MAP[activeTheme] || (activeTheme.includes('light') ? 'crystall-light-v1' : 'crystall-dark-v1');
};

export const defineMonacoThemes = (monaco: any) => {
  if (!monaco?.editor?.defineTheme) return;

  // 1. Dark v1 (Solid Abyss)
  monaco.editor.defineTheme('crystall-dark-v1', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'e2e8f0' },
      { token: 'keyword', foreground: 'f97316', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'f97316', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'f8fafc' },
      { token: 'string', foreground: '38bdf8' },
      { token: 'number', foreground: 'fbbf24' },
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'type', foreground: 'c084fc' },
      { token: 'function', foreground: '60a5fa' },
      { token: 'delimiter', foreground: '94a3b8' },
      { token: 'operator', foreground: 'f97316' },
    ],
    colors: {
      'editor.background': '#0c0e14',
      'editor.foreground': '#f8fafc',
      'editorLineNumber.foreground': '#3f3f46',
      'editorLineNumber.activeForeground': '#f97316',
      'editor.selectionBackground': '#f9731633',
      'editor.inactiveSelectionBackground': '#f973161a',
      'editorCursor.foreground': '#f97316',
      'editor.lineHighlightBackground': '#ffffff05',
      'editorGutter.background': '#0c0e14',
      'minimap.background': '#0c0e14',
      'minimapSlider.background': '#ea580c20',
      'minimapSlider.hoverBackground': '#ea580c35',
      'minimapSlider.activeBackground': '#ea580c50',
      'editorOverviewRuler.background': '#0c0e14',
      'editorOverviewRuler.border': '#00000000',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#ea580c20',
      'scrollbarSlider.hoverBackground': '#ea580c35',
      'scrollbarSlider.activeBackground': '#ea580c50',
    }
  });

  // 2. Dark v2 (Acrylic / Frosted Night)
  monaco.editor.defineTheme('crystall-dark-v2', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'e2e8f0' },
      { token: 'keyword', foreground: 'f97316', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'f97316', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'f8fafc' },
      { token: 'string', foreground: '38bdf8' },
      { token: 'number', foreground: 'fbbf24' },
      { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
      { token: 'type', foreground: 'c084fc' },
      { token: 'function', foreground: '60a5fa' },
      { token: 'delimiter', foreground: '94a3b8' },
      { token: 'operator', foreground: 'f97316' },
    ],
    colors: {
      'editor.background': '#00000000',
      'editor.foreground': '#f8fafc',
      'editorLineNumber.foreground': '#52525b',
      'editorLineNumber.activeForeground': '#f97316',
      'editor.selectionBackground': '#f9731640',
      'editorCursor.foreground': '#f97316',
      'editor.lineHighlightBackground': '#ffffff08',
      'editorGutter.background': '#00000000',
      'minimap.background': '#00000000',
      'minimapSlider.background': '#ea580c20',
      'minimapSlider.hoverBackground': '#ea580c35',
      'minimapSlider.activeBackground': '#ea580c50',
      'editorOverviewRuler.background': '#00000000',
      'editorOverviewRuler.border': '#00000000',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#ea580c20',
      'scrollbarSlider.hoverBackground': '#ea580c35',
      'scrollbarSlider.activeBackground': '#ea580c50',
    }
  });

  // 3. Dark v3 (Liquid Glass)
  monaco.editor.defineTheme('crystall-dark-v3', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'ffffff' },
      { token: 'keyword', foreground: 'f97316', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'f97316', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'ffffff' },
      { token: 'string', foreground: '38bdf8' },
      { token: 'number', foreground: 'facc15' },
      { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
      { token: 'type', foreground: 'e879f9' },
      { token: 'function', foreground: '38bdf8' },
      { token: 'delimiter', foreground: 'cbd5e1' },
      { token: 'operator', foreground: 'f97316' },
    ],
    colors: {
      'editor.background': '#00000000',
      'editor.foreground': '#ffffff',
      'editorLineNumber.foreground': '#71717a',
      'editorLineNumber.activeForeground': '#f97316',
      'editor.selectionBackground': '#f973164d',
      'editorCursor.foreground': '#f97316',
      'editor.lineHighlightBackground': '#ffffff0c',
      'editorGutter.background': '#00000000',
      'minimap.background': '#00000000',
      'minimapSlider.background': '#ea580c20',
      'minimapSlider.hoverBackground': '#ea580c35',
      'minimapSlider.activeBackground': '#ea580c50',
      'editorOverviewRuler.background': '#00000000',
      'editorOverviewRuler.border': '#00000000',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#ea580c20',
      'scrollbarSlider.hoverBackground': '#ea580c35',
      'scrollbarSlider.activeBackground': '#ea580c50',
    }
  });

  // 4. Light v1 (Solid Studio Light)
  monaco.editor.defineTheme('crystall-light-v1', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: '0f172a' },
      { token: 'keyword', foreground: 'ea580c', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'ea580c', fontStyle: 'bold' },
      { token: 'identifier', foreground: '0369a1' },
      { token: 'string', foreground: '15803d' },
      { token: 'number', foreground: '7c3aed' },
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'type', foreground: 'b45309' },
      { token: 'function', foreground: '2563eb' },
      { token: 'delimiter', foreground: '475569' },
      { token: 'operator', foreground: 'ea580c' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#0f172a',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#ea580c',
      'editor.selectionBackground': '#ea580c25',
      'editorCursor.foreground': '#ea580c',
      'editor.lineHighlightBackground': '#00000006',
      'editorGutter.background': '#ffffff',
      'minimap.background': '#ffffff',
      'minimapSlider.background': '#ea580c20',
      'minimapSlider.hoverBackground': '#ea580c35',
      'minimapSlider.activeBackground': '#ea580c50',
      'editorOverviewRuler.background': '#ffffff',
      'editorOverviewRuler.border': '#00000000',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#ea580c20',
      'scrollbarSlider.hoverBackground': '#ea580c35',
      'scrollbarSlider.activeBackground': '#ea580c50',
    }
  });

  // 5. Light v2 (Acrylic Frosted Light)
  monaco.editor.defineTheme('crystall-light-v2', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: '0f172a' },
      { token: 'keyword', foreground: 'ea580c', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'ea580c', fontStyle: 'bold' },
      { token: 'identifier', foreground: '0284c7' },
      { token: 'string', foreground: '15803d' },
      { token: 'number', foreground: '6d28d9' },
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'type', foreground: 'b45309' },
      { token: 'function', foreground: '2563eb' },
      { token: 'delimiter', foreground: '475569' },
      { token: 'operator', foreground: 'ea580c' },
    ],
    colors: {
      'editor.background': '#00000000',
      'editor.foreground': '#0f172a',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#ea580c',
      'editor.selectionBackground': '#ea580c30',
      'editorCursor.foreground': '#ea580c',
      'editor.lineHighlightBackground': '#00000008',
      'editorGutter.background': '#00000000',
      'minimap.background': '#00000000',
      'minimapSlider.background': '#ea580c20',
      'minimapSlider.hoverBackground': '#ea580c35',
      'minimapSlider.activeBackground': '#ea580c50',
      'editorOverviewRuler.background': '#00000000',
      'editorOverviewRuler.border': '#00000000',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#ea580c20',
      'scrollbarSlider.hoverBackground': '#ea580c35',
      'scrollbarSlider.activeBackground': '#ea580c50',
    }
  });

  // 6. Light v3 (Crystal Glass Light)
  monaco.editor.defineTheme('crystall-light-v3', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: '0f172a' },
      { token: 'keyword', foreground: 'ea580c', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'ea580c', fontStyle: 'bold' },
      { token: 'identifier', foreground: '0369a1' },
      { token: 'string', foreground: '15803d' },
      { token: 'number', foreground: '581c87' },
      { token: 'comment', foreground: '475569', fontStyle: 'italic' },
      { token: 'type', foreground: '9a3412' },
      { token: 'function', foreground: '2563eb' },
      { token: 'delimiter', foreground: '475569' },
      { token: 'operator', foreground: 'ea580c' },
    ],
    colors: {
      'editor.background': '#00000000',
      'editor.foreground': '#0f172a',
      'editorLineNumber.foreground': '#64748b',
      'editorLineNumber.activeForeground': '#ea580c',
      'editor.selectionBackground': '#ea580c38',
      'editorCursor.foreground': '#ea580c',
      'editor.lineHighlightBackground': '#ffffff20',
      'editorGutter.background': '#00000000',
      'minimap.background': '#00000000',
      'minimapSlider.background': '#ea580c20',
      'minimapSlider.hoverBackground': '#ea580c35',
      'minimapSlider.activeBackground': '#ea580c50',
      'editorOverviewRuler.background': '#00000000',
      'editorOverviewRuler.border': '#00000000',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#ea580c20',
      'scrollbarSlider.hoverBackground': '#ea580c35',
      'scrollbarSlider.activeBackground': '#ea580c50',
    }
  });
};

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
  onReorderTabs?: (draggedId: string, targetId: string) => void;
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
  settings,
  onReorderTabs
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

  const handleBeforeMount = (monaco: any) => {
    defineMonacoThemes(monaco);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    defineMonacoThemes(monaco);
    monaco.editor.setTheme(getMonacoTheme(activeTheme));
  };

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(getMonacoTheme(activeTheme));
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
                draggable={!isEditing}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', tab.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedId = e.dataTransfer.getData('text/plain');
                  if (draggedId && draggedId !== tab.id && onReorderTabs) {
                    onReorderTabs(draggedId, tab.id);
                  }
                }}
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
                    className={`p-0.5 rounded hover:bg-white/10 hover:text-red-400 transition-opacity ml-1 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
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

        {/* Right: Exact 4 Circular Action Buttons matching Figma 1:1 */}
        <div className="flex items-center gap-2 shrink-0 pl-2 pr-1">
          {/* 1. Orange Circular Execute Button */}
          <button
            onClick={onExecute}
            className="flex items-center justify-center w-[26px] h-[26px] rounded-full hover:scale-105 active:scale-95 transition-transform cursor-pointer text-white shadow-md"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            title="Execute (F5)"
          >
            <Play className="w-3 h-3 fill-current ml-0.5" />
          </button>

          {/* 2. Circular Clear Button */}
          <button
            onClick={onClear}
            className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all cursor-pointer text-zinc-400 hover:text-white"
            title="Clear Editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* 3. Circular Save Button */}
          <button
            onClick={onSave}
            className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all cursor-pointer text-zinc-400 hover:text-white"
            title="Save File (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
          </button>

          {/* 4. Circular Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all cursor-pointer text-zinc-400 hover:text-white"
            title="Copy Code"
          >
            <Copy className="w-3.5 h-3.5" />
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
            opacity: (activeTheme.includes('transparent') || activeTheme.includes('v2') || activeTheme.includes('v3') || activeTheme === 'acrylic-glass') ? 0.22 : 0.04,
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' 
          }}
        >
          <CrystallLogo size={200} />
        </div>

        <Editor
          height="100%"
          language={activeTab?.language || 'lua'}
          value={activeTab?.content || ''}
          theme={getMonacoTheme(activeTheme)}
          beforeMount={handleBeforeMount}
          onChange={(value) => onContentChange(value || '')}
          onMount={handleEditorMount}
          options={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: settings.fontSize || 12.5,
            lineHeight: Math.round((settings.fontSize || 12.5) * 1.55),
            lineNumbers: settings.lineNumbers ? 'on' : 'off',
            lineNumbersMinChars: 3,
            wordWrap: settings.wordWrap ? 'on' : 'off',
            minimap: { 
              enabled: !!settings.minimap,
              renderCharacters: false,
              maxColumn: 80
            },
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              useShadows: false
            },
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