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
        {/* Brand: Orange square badge + Crystall IDE + <1.0.0> tag matching Figma 1:1 */}
        <div className="flex items-center gap-2 mr-1 shrink-0">
          <div 
            className="flex items-center justify-center w-[22px] h-[22px] rounded-[5px] shadow-sm text-white font-bold text-xs"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <CrystallLogo size={16} />
          </div>
          <span 
            className="text-[13px] font-semibold tracking-tight whitespace-nowrap"
            style={{ color: 'var(--text-primary)' }}
          >
            Crystall IDE
          </span>
          <span 
            className="text-[10px] font-mono px-1.5 py-0.5 rounded border whitespace-nowrap"
            style={{ 
              backgroundColor: 'var(--hover-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)'
            }}
          >
            &lt;1.0.0&gt;
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
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>New File</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+N</span>
                </button>
                <button 
                  onClick={() => { onOpenFile(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Open File...</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+O</span>
                </button>
                {onOpenFolder && (
                  <button 
                    onClick={() => { onOpenFolder(); setActiveMenu(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open Folder / Project...</span>
                    </div>
                    <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+K Ctrl+O</span>
                  </button>
                )}
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onSaveFile(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Save File</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+S</span>
                </button>
                <button 
                  onClick={() => { onSaveAsFile(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Save As...</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+Shift+S</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onClear(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Active Buffer</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { handleClose(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between text-red-400 cursor-pointer transition-colors"
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
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Undo2 className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Undo</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+Z</span>
                </button>
                <button 
                  onClick={() => { onRedo(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Redo2 className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Redo</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+Y</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onCut(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Cut</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+X</span>
                </button>
                <button 
                  onClick={() => { onCopy(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Copy</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+C</span>
                </button>
                <button 
                  onClick={() => { onPaste(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ClipboardPaste className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Paste</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+V</span>
                </button>
                <button 
                  onClick={() => { onSelectAll(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Select All</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+A</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onFind(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Find in File</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+F</span>
                </button>
                <button 
                  onClick={() => { onReplace(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Replace className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Replace</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+H</span>
                </button>
                <button 
                  onClick={() => { onFormatCode(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Format Code</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Shift+Alt+F</span>
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
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-orange-400" />
                    <span>AI Assistant Panel</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+I</span>
                </button>
                <button 
                  onClick={() => { onToggleExplorer(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Project Explorer</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+B</span>
                </button>
                <button 
                  onClick={() => { onToggleConsole(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Terminal & Output</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+`</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <div 
                  className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold font-mono"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Figma Themes (4)
                </div>
                {FIGMA_THEMES.map((thm) => (
                  <button
                    key={thm.id}
                    onClick={() => {
                      onSelectTheme(thm.id);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
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

          {/* 4. EXECUTE MENU (matching Figma 1:1) */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'execute' ? null : 'execute')}
              className="px-2 py-1 rounded transition-colors text-[12px] cursor-pointer"
              style={{
                backgroundColor: activeMenu === 'execute' ? 'var(--hover-bg)' : 'transparent',
                color: activeMenu === 'execute' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              Execute
            </button>
            {activeMenu === 'execute' && (
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
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-orange-400 fill-current" />
                    <span>Run Program / Script</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>F5</span>
                </button>
                <button 
                  onClick={() => { onExecuteSelection(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    <span>Run Selection</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+Enter</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onAttach(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span>{isInjected ? 'Connected Runtime' : 'Connect / Attach Runtime'}</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>F6</span>
                </button>
                <button 
                  onClick={() => { onClearAndExecute(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Clear Output & Run
                </button>
                <button 
                  onClick={() => { onCopy(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
                  style={{ color: 'var(--text-primary)' }}
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
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-orange-400" />
                  <span>Code Snippets & Templates Hub</span>
                </button>
                <button 
                  onClick={() => { onOpenModal('bytecode'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AST & Bytecode Inspector</span>
                </button>
                <button 
                  onClick={() => { onOpenModal('process'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  <span>System & Process Monitor</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onFormatCode(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Format Code</span>
                </button>
                <button 
                  onClick={() => { onMinifyCode(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Scissors className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
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
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Standard Library Reference (Py/JS/Lua)</span>
                </button>
                <button 
                  onClick={() => { onOpenModal('shortcuts'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Keyboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Keyboard Shortcuts</span>
                </button>
                <button 
                  onClick={() => { onCheckUpdates(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Check for Updates</span>
                </button>
                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />
                <button 
                  onClick={() => { onOpenModal('about'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--hover-bg)] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Info className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                  <span>About Crystall IDE</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: Clean Draggable Region matching Figma 1:1 */}
      <div 
        className="flex-1 h-full app-draggable select-none cursor-default"
        onDoubleClick={handleMaximize}
      />

      {/* Right: Minimalist Native Window Controls matching Figma 1:1 */}
      <div className="flex items-center gap-0.5 no-drag">

        {/* Window controls */}
        <button
          onClick={handleMinimize}
          className="w-8 h-7 flex items-center justify-center hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          title="Minimize"
        >
          <Minus className="w-3 h-3" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-7 flex items-center justify-center hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
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