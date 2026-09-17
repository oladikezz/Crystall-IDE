import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  X, 
  Zap, 
  Star,
  Code2,
  FileCode,
  Terminal,
  Cpu
} from 'lucide-react';
import { FIGMA_QUICK_SCRIPTS, CODE_SNIPPETS } from '../data/constants';
import { QuickScript } from '../types';

interface QuickScriptsListProps {
  onLoadScript: (script: QuickScript) => void;
  onExecuteScript: (script: QuickScript) => void;
}

interface UnifiedSnippet {
  id: string;
  name: string;
  stats: string;
  category: 'Python' | 'TypeScript' | 'JavaScript' | 'Lua' | 'C++' | 'Game';
  language?: string;
  isStarred?: boolean;
  content: string;
  description?: string;
}

export const QuickScriptsList: React.FC<QuickScriptsListProps> = ({
  onLoadScript,
  onExecuteScript
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Combine multi-language templates with game tools
  const allSnippets: UnifiedSnippet[] = [
    // Multi-Language Code Snippets
    ...CODE_SNIPPETS.map(s => ({
      id: s.id,
      name: s.name,
      stats: s.stats || s.category || 'Code',
      category: (s.category as any) || 'Python',
      language: s.language,
      isStarred: true,
      content: s.content,
      description: s.description
    })),
    // Game / Lua Utility Scripts
    ...FIGMA_QUICK_SCRIPTS.map(s => ({
      id: s.id,
      name: s.name,
      stats: s.stats,
      category: 'Game' as const,
      language: 'lua',
      isStarred: s.isStarred,
      content: s.content
    }))
  ];

  const categories = ['All', 'Python', 'TypeScript', 'JavaScript', 'Lua', 'C++', 'Game'];

  const filtered = allSnippets.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleScriptClick = (script: UnifiedSnippet) => {
    onLoadScript({
      id: script.id,
      name: script.name,
      stats: script.stats,
      category: script.category,
      content: script.content,
      description: script.description
    });
  };

  const handleExecute = (e: React.MouseEvent, script: UnifiedSnippet) => {
    e.stopPropagation();
    onExecuteScript({
      id: script.id,
      name: script.name,
      stats: script.stats,
      category: script.category,
      content: script.content,
      description: script.description
    });
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Python': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'TypeScript': return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'JavaScript': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      case 'Lua': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'C++': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Game': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      default: return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <div 
      className="flex flex-col h-full overflow-hidden select-none font-sans"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Header: Title | Count | Search */}
      <div 
        className="h-8 px-2.5 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            Snippets & Templates
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500">{filtered.length} items</span>
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isSearchOpen ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Search Snippets"
          >
            <Search className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div 
        className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto border-b shrink-0 scrollbar-none"
        style={{ borderColor: 'var(--border-color)' }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white border-orange-400 font-medium'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Optional Search Bar */}
      {isSearchOpen && (
        <div className="px-2 py-1.5 border-b flex items-center gap-1.5 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <Search className="w-3 h-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search templates..."
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

      {/* Snippet Items List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
        {filtered.map((script) => {
          return (
            <div
              key={script.id}
              onClick={() => handleScriptClick(script)}
              className="flex items-center justify-between px-2.5 py-1.5 rounded transition-all cursor-pointer group hover:bg-white/5 border border-transparent hover:border-[var(--border-color)]"
              style={{
                backgroundColor: 'var(--hover-bg)'
              }}
            >
              {/* Left: Star + Name + Category Badge */}
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
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${getCategoryBadgeColor(script.category)}`}>
                  {script.category}
                </span>
              </div>

              {/* Right: Circular Run Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleExecute(e, script)}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer text-white shadow-sm hover:scale-110 active:scale-95"
                  style={{
                    backgroundColor: script.isStarred ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.12)'
                  }}
                  title={`Insert & Run ${script.name}`}
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