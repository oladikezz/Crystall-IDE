import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileCode, 
  Terminal, 
  Globe, 
  Layers, 
  Search, 
  X,
  FilePlus,
  FolderPlus,
  FolderOpen,
  Code2,
  FileJson,
  FileText
} from 'lucide-react';
import { ExplorerNode } from '../types';
import { PROJECT_WORKSPACE_TREE, ROBLOX_EXPLORER_TREE } from '../data/constants';

interface RobloxExplorerProps {
  onSelectNode: (node: ExplorerNode) => void;
  onOpenFolder?: () => void;
  onNewFile?: () => void;
}

export const RobloxExplorer: React.FC<RobloxExplorerProps> = ({ 
  onSelectNode,
  onOpenFolder,
  onNewFile
}) => {
  const [activeMode, setActiveMode] = useState<'project' | 'game'>('project');
  const [tree, setTree] = useState<ExplorerNode[]>(PROJECT_WORKSPACE_TREE);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'proj-src': true,
    'proj-api': true,
    'exp-serverscriptservice': true
  });
  const [selectedId, setSelectedId] = useState<string>('file-main-py');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currentTree = activeMode === 'project' ? tree : ROBLOX_EXPLORER_TREE;

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNodeClick = (node: ExplorerNode) => {
    setSelectedId(node.id);
    if (node.type !== 'folder') {
      onSelectNode(node);
    }
  };

  const handleCreateNewFile = () => {
    const fileName = prompt('Enter new file name (e.g. script.py, app.ts, index.html):');
    if (!fileName) return;

    let lang = 'plaintext';
    if (fileName.endsWith('.py')) lang = 'python';
    else if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) lang = 'typescript';
    else if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) lang = 'javascript';
    else if (fileName.endsWith('.lua') || fileName.endsWith('.luau')) lang = 'lua';
    else if (fileName.endsWith('.html')) lang = 'html';
    else if (fileName.endsWith('.css')) lang = 'css';
    else if (fileName.endsWith('.json')) lang = 'json';
    else if (fileName.endsWith('.md')) lang = 'markdown';

    const newNode: ExplorerNode = {
      id: 'custom-file-' + Date.now(),
      name: fileName,
      type: 'file',
      language: lang,
      content: `# New file: ${fileName}\n`
    };

    setTree(prev => [newNode, ...prev]);
    onSelectNode(newNode);
  };

  const getFileIcon = (node: ExplorerNode) => {
    if (node.type === 'folder') {
      const isExp = !!expandedIds[node.id];
      return <Folder className={`w-3.5 h-3.5 ${isExp ? 'text-amber-400' : 'text-amber-500'} shrink-0`} />;
    }

    const name = node.name.toLowerCase();
    if (name.endsWith('.py')) return <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    if (name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
    if (name.endsWith('.lua') || name.endsWith('.luau')) return <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    if (name.endsWith('.html')) return <Globe className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
    if (name.endsWith('.css')) return <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    if (name.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-lime-400 shrink-0" />;
    if (name.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;

    return <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
  };

  const renderNodes = (nodes: ExplorerNode[], depth = 0) => {
    return nodes
      .filter(n => !searchQuery || n.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(node => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = !!expandedIds[node.id];
        const isSelected = selectedId === node.id;

        return (
          <div key={node.id} className="select-none font-sans">
            <div
              onClick={() => handleNodeClick(node)}
              className="flex items-center gap-1.5 py-1 px-2 text-xs transition-colors cursor-pointer rounded hover:bg-white/5"
              style={{
                paddingLeft: `${depth * 14 + 8}px`,
                backgroundColor: isSelected ? 'var(--hover-bg)' : 'transparent',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
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
                <span className="w-3.5" />
              )}

              {getFileIcon(node)}
              <span className="truncate text-[11px] font-normal">{node.name}</span>
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
      className="flex flex-col h-full overflow-hidden select-none"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Explorer Header matching Figma */}
      <div 
        className="h-8 px-2.5 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Toggle Mode: Project Files / Game Hierarchy */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveMode('project')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              activeMode === 'project' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            style={{
              backgroundColor: activeMode === 'project' ? 'var(--hover-bg)' : 'transparent'
            }}
          >
            Project
          </button>
          <button
            onClick={() => setActiveMode('game')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              activeMode === 'game' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            style={{
              backgroundColor: activeMode === 'game' ? 'var(--hover-bg)' : 'transparent'
            }}
          >
            Hierarchy
          </button>
        </div>

        {/* Quick File & Folder Actions */}
        <div className="flex items-center gap-1">
          <button 
            onClick={handleCreateNewFile}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
            title="New File"
          >
            <FilePlus className="w-3 h-3" />
          </button>

          <button 
            onClick={onOpenFolder}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
            title="Open Folder"
          >
            <FolderOpen className="w-3 h-3" />
          </button>

          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
            title="Search Files"
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
            placeholder="Filter files..."
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
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
        {renderNodes(currentTree)}
      </div>
    </div>
  );
};