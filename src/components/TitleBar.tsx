import React, { useState, useRef, useEffect } from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Palette,
  Check,
  FileCode,
  FileText,
  FolderOpen,
  Save,
  Trash2,
  LogOut,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  ClipboardPaste,
  Search,
  Replace,
  Sparkles,
  Bot,
  Layers,
  Terminal,
  Play,
  Zap,
  Cpu,
  Activity,
  BookOpen,
  Keyboard,
  RefreshCw,
  Info
} from 'lucide-react';
import { CrystallLogo } from './CrystallLogo';
import { CrystallThemeId, ModalType } from '../types';
import { CRYSTALL_THEMES, FIGMA_THEMES, resolveTheme } from '../data/themes';

interface TitleBarProps {
  onOpenModal: (modal: ModalType) => void;
  onToggleVibecoder: () => void;
  isVibecoderOpen: boolean;
  onToggleExplorer: () => void;
  onToggleConsole: () => void;
  onExecute: () => void;
  onExecuteSelection: () => void;
  onAttach: () => void;
  isInjected: boolean;
  onClear: () => void;
  onClearAndExecute: () => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onOpenFolder?: () => void;
  onSaveFile: () => void;
  onSaveAsFile: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onSelectAll: () => void;
  onFind: () => void;
  onReplace: () => void;
  onFormatCode: () => void;
  onMinifyCode: () => void;
  onCheckUpdates: () => void;
  activeTheme: CrystallThemeId;
  onSelectTheme: (id: CrystallThemeId) => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onOpenModal,
  onToggleVibecoder,
  isVibecoderOpen,
  onToggleExplorer,
  onToggleConsole,
  onExecute,
  onExecuteSelection,
  onAttach,
  isInjected,
  onClear,
  onClearAndExecute,
  onNewFile,
  onOpenFile,
  onOpenFolder,
  onSaveFile,
  onSaveAsFile,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onSelectAll,
  onFind,
  onReplace,
  onFormatCode,
  onMinifyCode,
  onCheckUpdates,
  activeTheme,
  onSelectTheme
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setIsPaletteOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => window.electronAPI?.maximize();
  const handleClose = () => window.electronAPI?.close();

  return (
    <div 
      className="h-[38px] border-b flex items-center justify-between px-3 select-none app-draggable z-40 transition-colors font-sans cursor-default"
      onDoubleClick={handleMaximize}
      style={{
        backgroundColor: 'var(--bg-header)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Left: Branding & Native Menus */}
      <div className="flex items-center gap-3 no-drag">
        {/* Brand: Orange square badge + Crystall + v1.0.0 pill matching Figma */}
        <div className="flex items-center gap-2 mr-1">
          <div 
            className="flex items-center justify-center w-[22px] h-[22px] rounded-[5px] shadow-sm text-white"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <CrystallLogo size={14} />
          </div>
          <span 
            className="text-[13px] font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Crystall
          </span>
          <span 
            className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
            style={{ 
              backgroundColor: 'var(--hover-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)'
            }}
          >
            v1.0.0
          </span>
        </div>

        {/* Menus Row matching Figma exactly: File (with orange dot), Edit, View, Run, Tools, Settings, Help */}
        <div ref={menuRef} className="flex items-center gap-1.5 text-[12px] relative font-sans">
          
          {/* 1. FILE MENU */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className="flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-[12px] font-normal cursor-pointer"
              style={{
                backgroundColor: activeMenu === 'file' ? 'var(--hover-bg)' : 'transparent',
                color: activeMenu === 'file' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span>File</span>
            </button>
            {activeMenu === 'file' && (
              <div 
                className="absolute left-0 top-full mt-1 w-56 rounded-md border shadow-2xl py-1 text-xs z-50 font-sans backdrop-blur-md"
                style={{
                  backgroundColor: 'var(--bg-modal)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <button 
                  onClick={() => { onNewFile(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                    <span>New File</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+N</span>
                </button>
                <button 
                  onClick={() => { onOpenFile(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Open File...</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+O</span>
                </button>
                {onOpenFolder && (
                  <button 
                    onClick={() => { onOpenFolder(); setActiveMenu(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open Folder / Project...</span>
                    </div>
                    <span className="text-zinc-500 font-mono text-[10px]">Ctrl+K Ctrl+O</span>
                  </button>
                )}
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onSaveFile(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Save File</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+S</span>
                </button>
                <button 
                  onClick={() => { onSaveAsFile(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Save As...</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+Shift+S</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onClear(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Active Buffer</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { handleClose(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between text-red-400 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Exit</span>
                  </div>
                  <span className="font-mono text-[10px]">Alt+F4</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. EDIT MENU */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
              className="px-2 py-1 rounded transition-colors text-[12px] cursor-pointer"
              style={{
                backgroundColor: activeMenu === 'edit' ? 'var(--hover-bg)' : 'transparent',
                color: activeMenu === 'edit' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              Edit
            </button>
            {activeMenu === 'edit' && (
              <div 
                className="absolute left-0 top-full mt-1 w-56 rounded-md border shadow-2xl py-1 text-xs z-50 font-sans backdrop-blur-md"
                style={{
                  backgroundColor: 'var(--bg-modal)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <button 
                  onClick={() => { onUndo(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Undo2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Undo</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+Z</span>
                </button>
                <button 
                  onClick={() => { onRedo(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Redo2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Redo</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+Y</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onCut(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Cut</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+X</span>
                </button>
                <button 
                  onClick={() => { onCopy(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+C</span>
                </button>
                <button 
                  onClick={() => { onPaste(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ClipboardPaste className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Paste</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+V</span>
                </button>
                <button 
                  onClick={() => { onSelectAll(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Select All</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+A</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onFind(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Find in File</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+F</span>
                </button>
                <button 
                  onClick={() => { onReplace(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Replace className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Replace</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+H</span>
                </button>
                <button 
                  onClick={() => { onFormatCode(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Format Code</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Shift+Alt+F</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. VIEW MENU */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className="px-2 py-1 rounded transition-colors text-[12px] cursor-pointer"
              style={{
                backgroundColor: activeMenu === 'view' ? 'var(--hover-bg)' : 'transparent',
                color: activeMenu === 'view' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div 
                className="absolute left-0 top-full mt-1 w-56 rounded-md border shadow-2xl py-1 text-xs z-50 font-sans backdrop-blur-md"
                style={{
                  backgroundColor: 'var(--bg-modal)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <button 
                  onClick={() => { onToggleVibecoder(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-orange-400" />
                    <span>AI Assistant Panel</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+I</span>
                </button>
                <button 
                  onClick={() => { onToggleExplorer(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Project Explorer</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+B</span>
                </button>
                <button 
                  onClick={() => { onToggleConsole(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Terminal & Output</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+`</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold font-mono text-zinc-500">
                  Figma Themes (6)
                </div>
                {FIGMA_THEMES.map((thm) => (
                  <button
                    key={thm.id}
                    onClick={() => {
                      onSelectTheme(thm.id);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: thm.previewColors.accent }}
                      />
                      <span>{thm.name}</span>
                    </div>
                    {activeTheme === thm.id && (
                      <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. RUN MENU */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'run' ? null : 'run')}
              className="px-2 py-1 rounded transition-colors text-[12px] cursor-pointer"
              style={{
                backgroundColor: activeMenu === 'run' ? 'var(--hover-bg)' : 'transparent',
                color: activeMenu === 'run' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              Run
            </button>
            {activeMenu === 'run' && (
              <div 
                className="absolute left-0 top-full mt-1 w-56 rounded-md border shadow-2xl py-1 text-xs z-50 font-sans backdrop-blur-md"
                style={{
                  backgroundColor: 'var(--bg-modal)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <button 
                  onClick={() => { onExecute(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-orange-400 fill-current" />
                    <span>Run Program / Script</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">F5</span>
                </button>
                <button 
                  onClick={() => { onExecuteSelection(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Run Selection</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">Ctrl+Enter</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onAttach(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span>{isInjected ? 'Connected Runtime' : 'Connect / Attach Runtime'}</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">F6</span>
                </button>
                <button 
                  onClick={() => { onClearAndExecute(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 cursor-pointer text-zinc-300"
                >
                  Clear Output & Run
                </button>
                <button 
                  onClick={() => { onCopy(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 cursor-pointer text-zinc-300"
                >
                  Copy Code to Clipboard
                </button>
              </div>
            )}
          </div>

          {/* 5. TOOLS MENU */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'tools' ? null : 'tools')}
              className="px-2 py-1 rounded transition-colors text-[12px] cursor-pointer"
              style={{
                backgroundColor: activeMenu === 'tools' ? 'var(--hover-bg)' : 'transparent',
                color: activeMenu === 'tools' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              Tools
            </button>
            {activeMenu === 'tools' && (
              <div 
                className="absolute left-0 top-full mt-1 w-64 rounded-md border shadow-2xl py-1 text-xs z-50 font-sans backdrop-blur-md"
                style={{
                  backgroundColor: 'var(--bg-modal)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <button 
                  onClick={() => { onOpenModal('scripthub'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-orange-400" />
                  <span>Code Snippets & Templates Hub</span>
                </button>
                <button 
                  onClick={() => { onOpenModal('bytecode'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AST & Bytecode Inspector</span>
                </button>
                <button 
                  onClick={() => { onOpenModal('process'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  <span>System & Process Monitor</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onFormatCode(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer text-zinc-300"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Format Code</span>
                </button>
                <button 
                  onClick={() => { onMinifyCode(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer text-zinc-300"
                >
                  <Scissors className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Minify Code</span>
                </button>
              </div>
            )}
          </div>

          {/* 6. SETTINGS MENU */}
          <button
            onClick={() => onOpenModal('settings')}
            className="px-2 py-1 rounded transition-colors text-[12px] cursor-pointer"
            style={{
              color: 'var(--text-secondary)'
            }}
          >
            Settings
          </button>

          {/* 7. HELP MENU */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
              className="px-2 py-1 rounded transition-colors text-[12px] cursor-pointer"
              style={{
                backgroundColor: activeMenu === 'help' ? 'var(--hover-bg)' : 'transparent',
                color: activeMenu === 'help' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              Help
            </button>
            {activeMenu === 'help' && (
              <div 
                className="absolute left-0 top-full mt-1 w-64 rounded-md border shadow-2xl py-1 text-xs z-50 font-sans backdrop-blur-md"
                style={{
                  backgroundColor: 'var(--bg-modal)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <button 
                  onClick={() => { onOpenModal('apiref'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Standard Library Reference (Py/JS/Lua)</span>
                </button>
                <button 
                  onClick={() => { onOpenModal('shortcuts'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <Keyboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Keyboard Shortcuts</span>
                </button>
                <button 
                  onClick={() => { onCheckUpdates(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Check for Updates</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onOpenModal('about'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-zinc-400" />
                  <span>About Crystall IDE</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: Draggable Workspace Handle */}
      <div 
        className="flex-1 h-full flex items-center justify-center app-draggable select-none cursor-default px-4"
        onDoubleClick={handleMaximize}
      >
        <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[11px] font-sans font-medium" style={{ color: 'var(--text-primary)' }}>
            Crystall IDE
          </span>
          <span className="text-[10px] font-mono opacity-50" style={{ color: 'var(--text-muted)' }}>
            —
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Professional Multi-Language Studio
          </span>
        </div>
      </div>

      {/* Right: Minimalist Native Window Controls & Quick Theme Palette */}
      <div className="flex items-center gap-1 no-drag">
        {/* Sleek Palette Icon for quick theme switching */}
        <div ref={paletteRef} className="relative mr-1">
          <button
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            title="Themes (4)"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {isPaletteOpen && (
            <div 
              className="absolute right-0 top-full mt-1 w-52 rounded-lg border shadow-2xl p-1.5 text-xs z-50 font-sans backdrop-blur-md"
              style={{
                backgroundColor: 'var(--bg-modal)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider px-2 py-1 text-zinc-500">
                Figma Themes (4)
              </div>
              <div className="space-y-0.5 mt-1">
                {FIGMA_THEMES.map((thm) => {
                  const isSelected = activeTheme === thm.id;
                  return (
                    <button
                      key={thm.id}
                      data-theme-id={thm.id}
                      onClick={() => {
                        onSelectTheme(thm.id);
                        setIsPaletteOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors text-left cursor-pointer hover:bg-white/5"
                      style={{
                        backgroundColor: isSelected ? 'var(--hover-bg)' : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: thm.previewColors.accent }}
                        />
                        <span className="text-xs font-medium">{thm.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Window controls */}
        <button
          onClick={handleMinimize}
          className="w-8 h-7 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          title="Minimize"
        >
          <Minus className="w-3 h-3" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-7 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          title="Maximize"
        >
          <Square className="w-2.5 h-2.5" />
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-7 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          title="Close"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};