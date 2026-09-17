import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  X, 
  Zap, 
  Star,
  Users
} from 'lucide-react';
import { FIGMA_QUICK_SCRIPTS, FigmaQuickScript } from '../data/constants';
import { QuickScript } from '../types';

interface QuickScriptsListProps {
  onLoadScript: (script: QuickScript) => void;
  onExecuteScript: (script: QuickScript) => void;
}

export const QuickScriptsList: React.FC<QuickScriptsListProps> = ({
  onLoadScript,
  onExecuteScript
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredScripts = FIGMA_QUICK_SCRIPTS.filter(s =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScriptClick = (script: FigmaQuickScript) => {
    onLoadScript({
      id: script.id,
      name: script.name,
      stats: script.stats,
      category: 'Lua',
      content: script.content,
      description: script.description
    });
  };

  const handleExecute = (e: React.MouseEvent, script: FigmaQuickScript) => {
    e.stopPropagation();
    onExecuteScript({
      id: script.id,
      name: script.name,
      stats: script.stats,
      category: 'Lua',
      content: script.content,
      description: script.description
    });
  };

  return (
    <div 
      className="flex flex-col h-full overflow-hidden select-none font-sans"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Exact Figma Header: Quick Scripts | Scripts: 20 | Search */}
      <div 
        className="h-8 px-3 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            Quick Scripts
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500">Scripts: 20</span>
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
            title="Search Scripts"
          >
            <Search className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Optional Search Bar */}
      {isSearchOpen && (
        <div className="px-2 py-1.5 border-b flex items-center gap-1.5 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <Search className="w-3 h-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[11px] outline-none text-zinc-200 placeholder-zinc-600 font-sans"
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-white cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Script Items List matching Figma 1:1 */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
        {filteredScripts.map((script) => {
          return (
            <div
              key={script.id}
              onClick={() => handleScriptClick(script)}
              className="flex items-center justify-between px-2.5 py-1.5 rounded transition-all cursor-pointer group hover:bg-white/5 border border-transparent hover:border-[var(--border-color)]"
              style={{
                backgroundColor: 'var(--hover-bg)'
              }}
            >
              {/* Left: Star + Script Name */}
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <Star 
                  className={`w-3 h-3 shrink-0 ${
                    script.isStarred 
                      ? 'text-amber-400 fill-amber-400' 
                      : 'text-zinc-500 group-hover:text-zinc-400'
                  }`} 
                />
                <span 
                  className="text-[11.5px] font-medium truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {script.name}
                </span>
              </div>

              {/* Right: Stats Badge + Circular Play Button */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  {script.stats}
                  <Users className="w-2.5 h-2.5 text-zinc-500" />
                </span>

                <button
                  onClick={(e) => handleExecute(e, script)}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer text-white shadow-sm hover:scale-110 active:scale-95"
                  style={{
                    backgroundColor: script.isStarred ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.12)'
                  }}
                  title={`Run ${script.name}`}
                >
                  <Play className="w-2 h-2 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};