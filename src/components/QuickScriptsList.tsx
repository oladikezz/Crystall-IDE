import React, { useState } from 'react';
import { 
  Play, 
  ArrowDownToLine, 
  Search,
  X,
  Code2
} from 'lucide-react';
import { QuickScript } from '../types';
import { CODE_SNIPPETS } from '../data/constants';

interface QuickScriptsListProps {
  onLoadScript: (script: QuickScript) => void;
  onExecuteScript: (script: QuickScript) => void;
}

const CATEGORIES = ['All', 'Python', 'TypeScript', 'JavaScript', 'Lua', 'Algorithms', 'Web'];

export const QuickScriptsList: React.FC<QuickScriptsListProps> = ({
  onLoadScript,
  onExecuteScript
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getLanguageColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'python': return '#3b82f6';
      case 'typescript': return '#38bdf8';
      case 'javascript': return '#eab308';
      case 'lua': return '#06b6d4';
      case 'algorithms': return '#a855f7';
      case 'web': return '#f97316';
      default: return '#10b981';
    }
  };

  const filteredSnippets = CODE_SNIPPETS.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div 
      className="flex flex-col h-full overflow-hidden select-none font-sans"
      style={{ backgroundColor: 'var(--bg-panel)' }}
    >
      {/* Header matching Figma */}
      <div 
        className="h-8 px-3 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
            Code Snippets
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500">{filteredSnippets.length} items</span>
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
            title="Search Snippets"
          >
            <Search className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-2 py-1.5 border-b flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0" style={{ borderColor: 'var(--border-color)' }}>
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isSelected ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={{
                backgroundColor: isSelected ? 'var(--hover-bg)' : 'transparent',
                border: isSelected ? '1px solid var(--border-color)' : '1px solid transparent'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Optional Search Bar */}
      {isSearchOpen && (
        <div className="px-2 py-1.5 border-b flex items-center gap-1.5 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <Search className="w-3 h-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[11px] outline-none text-zinc-200 placeholder-zinc-600 font-sans"
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Snippet Cards List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
        {filteredSnippets.map((snippet: QuickScript) => {
          const color = getLanguageColor(snippet.category);

          return (
            <div
              key={snippet.id}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md border transition-colors group hover:border-[var(--accent-primary)]/40"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: color }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[11.5px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {snippet.name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                    <span style={{ color }}>{snippet.category}</span>
                    {snippet.description && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[110px]">{snippet.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onLoadScript(snippet)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
                  title="Open Template in New Tab"
                >
                  <ArrowDownToLine className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onExecuteScript(snippet)}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:scale-105 active:scale-95 transition-transform cursor-pointer text-white shadow-sm"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                  title="Run Snippet"
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