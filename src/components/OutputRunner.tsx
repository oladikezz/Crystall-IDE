import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Copy, Check, Search, Terminal, CornerDownLeft } from 'lucide-react';
import { ConsoleLog } from '../types';

interface OutputRunnerProps {
  logs: ConsoleLog[];
  onClearLogs: () => void;
  onExecuteCommand?: (command: string) => void;
}

type ConsoleTab = 'output' | 'console' | 'warnings' | 'errors';

export const OutputRunner: React.FC<OutputRunnerProps> = ({ 
  logs, 
  onClearLogs,
  onExecuteCommand 
}) => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>('output');
  const [searchFilter, setSearchFilter] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Interactive Prompt State
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'print("Hello Crystall IDE")',
    'warn("Testing client offsets...")'
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter(log => {
    // Tab filter
    if (activeTab === 'console' && !(log.type === 'info' || log.type === 'ready' || log.type === 'injected')) return false;
    if (activeTab === 'warnings' && log.type !== 'warn') return false;
    if (activeTab === 'errors' && log.type !== 'error') return false;

    // Search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return log.message.toLowerCase().includes(q) || log.timestamp.includes(q) || log.type.includes(q);
    }
    return true;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = commandInput.trim();
      if (!trimmed) return;

      if (onExecuteCommand) {
        onExecuteCommand(trimmed);
      }
      
      setHistory(prev => [...prev, trimmed]);
      setHistoryIndex(-1);
      setCommandInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommandInput(history[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setCommandInput('');
      } else {
        setHistoryIndex(nextIndex);
        setCommandInput(history[nextIndex] || '');
      }
    }
  };

  const getLogBadge = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'info':
        return <span className="text-sky-400 font-mono">[INFO]</span>;
      case 'warn':
        return <span className="text-amber-400 font-mono">[WARN]</span>;
      case 'error':
        return <span className="text-rose-400 font-mono">[ERROR]</span>;
      case 'success':
        return <span className="text-emerald-400 font-mono">[SUCCESS]</span>;
      case 'injected':
        return <span className="font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>[INJECTED]</span>;
      case 'ready':
        return <span className="text-emerald-400 font-mono">[READY]</span>;
      default:
        return <span className="font-mono text-zinc-500">[LOG]</span>;
    }
  };

  return (
    <div 
      className="flex flex-col h-full select-none font-sans overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Console Tabs Row matching Figma exactly */}
      <div 
        className="h-8 px-3 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('output')}
            className="flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-xs cursor-pointer"
            style={{
              backgroundColor: activeTab === 'output' ? 'var(--hover-bg)' : 'transparent',
              color: activeTab === 'output' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'output' ? 500 : 400
            }}
          >
            {activeTab === 'output' && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
            )}
            <span>Output</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className="px-2 py-1 rounded transition-colors text-xs cursor-pointer"
            style={{
              backgroundColor: activeTab === 'console' ? 'var(--hover-bg)' : 'transparent',
              color: activeTab === 'console' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'console' ? 500 : 400
            }}
          >
            Console
          </button>

          <button
            onClick={() => setActiveTab('warnings')}
            className="px-2 py-1 rounded transition-colors text-xs cursor-pointer"
            style={{
              backgroundColor: activeTab === 'warnings' ? 'var(--hover-bg)' : 'transparent',
              color: activeTab === 'warnings' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'warnings' ? 500 : 400
            }}
          >
            Warnings
          </button>

          <button
            onClick={() => setActiveTab('errors')}
            className="px-2 py-1 rounded transition-colors text-xs cursor-pointer"
            style={{
              backgroundColor: activeTab === 'errors' ? 'var(--hover-bg)' : 'transparent',
              color: activeTab === 'errors' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'errors' ? 500 : 400
            }}
          >
            Errors
          </button>
        </div>

        {/* Right side: Search, Copy, Clear */}
        <div className="flex items-center gap-1">
          {isSearchOpen ? (
            <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded border border-[var(--border-color)]">
              <Search className="w-3 h-3 text-zinc-500" />
              <input
                type="text"
                autoFocus
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter logs..."
                className="bg-transparent text-[11px] font-mono outline-none text-zinc-200 w-24"
              />
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchFilter(''); }}
                className="text-zinc-500 hover:text-white text-[10px]"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
              title="Search logs"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopyLogs}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
            title="Copy Output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClearLogs}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
            title="Clear Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log view matching Figma JetBrains Mono */}
      <div 
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-2.5 font-mono text-[11px] leading-relaxed space-y-1 scrollbar-thin"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-zinc-500 text-[11px] italic py-2">No output logs recorded.</div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-white/5 px-1.5 py-0.5 rounded transition-colors">
              <span className="text-zinc-500">[{log.timestamp}]</span>
              {getLogBadge(log.type)}
              <span style={{ color: 'var(--text-primary)' }}>{log.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Interactive Command Prompt matching professional executor tools */}
      <div 
        className="h-7 px-2.5 border-t flex items-center gap-2 shrink-0 font-mono text-[11px]"
        style={{
          backgroundColor: 'var(--bg-app)',
          borderColor: 'var(--border-color)'
        }}
      >
        <span style={{ color: 'var(--accent-primary)' }} className="font-bold select-none">&gt;</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={handleCommandKeyDown}
          placeholder="Execute Lua command or expression (e.g. print(game.PlaceId), clear, help)..."
          className="flex-1 bg-transparent outline-none text-[11px] text-zinc-200 placeholder-zinc-600 font-mono"
        />
        {commandInput.trim() && (
          <button
            onClick={() => {
              if (onExecuteCommand && commandInput.trim()) {
                onExecuteCommand(commandInput.trim());
                setHistory(prev => [...prev, commandInput.trim()]);
                setCommandInput('');
              }
            }}
            className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-zinc-300 cursor-pointer"
          >
            <span>Run</span>
            <CornerDownLeft className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  );
};