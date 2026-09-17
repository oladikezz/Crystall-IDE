import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileCode, 
  Search, 
  X,
  Box,
  Users,
  SunMedium,
  Shapes,
  Layers,
  Package,
  Cpu
} from 'lucide-react';
import { ExplorerNode } from '../types';
import { ROBLOX_EXPLORER_TREE } from '../data/constants';

interface RobloxExplorerProps {
  onSelectNode: (node: ExplorerNode) => void;
  onOpenFolder?: () => void;
  onNewFile?: () => void;
}

export const RobloxExplorer: React.FC<RobloxExplorerProps> = ({ 
  onSelectNode
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'exp-serverscriptservice': true
  });
  const [selectedId, setSelectedId] = useState<string>('exp-serverscriptservice');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNodeClick = (node: ExplorerNode) => {
    setSelectedId(node.id);
    if (node.type !== 'folder' && node.type !== 'service') {
      onSelectNode(node);
    }
  };

  const getServiceIcon = (node: ExplorerNode) => {
    switch (node.icon) {
      case 'workspace':
        return <Box className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'players':
        return <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'lighting':
        return <SunMedium className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'material':
        return <Shapes className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'replicatedfirst':
        return <Layers className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'replicatedstorage':
        return <Package className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'serverscriptservice':
        return <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      default:
        if (node.type === 'folder') {
          return <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
        }
        return <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
  };

  const renderNodes = (nodes: ExplorerNode[], depth = 0) => {
    return nodes
      .filter(n => !searchQuery || n.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(node => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = !!expandedIds[node.id];
        const isSelected = selectedId === node.id;
        const isServerScriptService = node.id === 'exp-serverscriptservice';

        return (
          <div key={node.id} className="select-none font-sans">
            <div
              onClick={() => handleNodeClick(node)}
              className={`flex items-center gap-1.5 py-1 px-2 text-xs transition-colors cursor-pointer rounded mx-1 ${
                isServerScriptService && isSelected
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium'
                  : isSelected 
                    ? 'hover:bg-white/5 font-medium' 
                    : 'hover:bg-white/5'
              }`}
              style={{
                paddingLeft: `${depth * 14 + 6}px`,
                backgroundColor: isServerScriptService && isSelected
                  ? undefined
                  : isSelected ? 'var(--hover-bg)' : 'transparent',
                color: isServerScriptService && isSelected
                  ? undefined
                  : isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              {hasChildren ? (
                <button
                  onClick={(e) => toggleExpand(node.id, e)}
                  className="p-0.5 rounded hover:bg-white/10"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              ) : (
                <span className="w-3.5 shrink-0" />
              )}

              {getServiceIcon(node)}
              <span className="truncate text-[11.5px] font-normal">{node.name}</span>
            </div>

            {hasChildren && isExpanded && (
              <div>{renderNodes(node.children!, depth + 1)}</div>
            )}
          </div>
        );
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
      {/* Exact Figma Header: Explorer | Instances: 4,960 | Search */}
      <div 
        className="h-8 px-3 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            Explorer
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500">Instances: 4,960</span>
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
            title="Search Instances"
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
            placeholder="Search instances..."
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

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto py-1.5 scrollbar-thin">
        {renderNodes(ROBLOX_EXPLORER_TREE)}
      </div>
    </div>
  );
};