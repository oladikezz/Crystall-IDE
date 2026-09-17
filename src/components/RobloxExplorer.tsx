import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen,
  FileCode, 
  Code2,
  FileText,
  Terminal,
  Cpu,
  Layers,
  Globe,
  FileJson,
  Search, 
  X,
  Plus,
  FolderPlus
} from 'lucide-react';
import { ExplorerNode, FileTab } from '../types';

interface RobloxExplorerProps {
  onSelectNode: (node: ExplorerNode) => void;
  onOpenFolder?: () => void;
  onNewFile?: () => void;
  openedFolder?: { folderName: string; folderPath: string; tree: ExplorerNode[] } | null;
  openTabs?: FileTab[];
  activeTabId?: string;
  onSelectTab?: (id: string) => void;
  onCloseTab?: (id: string) => void;
  onCloseFolder?: () => void;
}

export const RobloxExplorer: React.FC<RobloxExplorerProps> = ({ 
  onSelectNode,
  onOpenFolder,
  onNewFile,
  openedFolder,
  openTabs = [],
  activeTabId,
  onSelectTab,
  onCloseTab,
  onCloseFolder
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [isOpenEditorsExpanded, setIsOpenEditorsExpanded] = useState(true);
  const [isFolderExpanded, setIsFolderExpanded] = useState(true);
  const [selectedId, setSelectedId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const getFileIcon = (name: string, isFolder: boolean, isExpanded?: boolean) => {
    if (isFolder) {
      return isExpanded 
        ? <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        : <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
    const lower = name.toLowerCase();
    if (lower.endsWith('.py')) return <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    if (lower.endsWith('.ts') || lower.endsWith('.tsx')) return <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    if (lower.endsWith('.js') || lower.endsWith('.jsx')) return <FileCode className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
    if (lower.endsWith('.lua') || lower.endsWith('.luau')) return <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    if (lower.endsWith('.cpp') || lower.endsWith('.c') || lower.endsWith('.h') || lower.endsWith('.hpp')) return <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    if (lower.endsWith('.html') || lower.endsWith('.htm')) return <Globe className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
    if (lower.endsWith('.css')) return <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    if (lower.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-lime-400 shrink-0" />;
    if (lower.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
    return <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
  };

  const renderNodes = (nodes: ExplorerNode[], depth = 0) => {
    return nodes
      .filter(n => !searchQuery || n.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(node => {
        const isFolder = node.type === 'folder';
        const hasChildren = isFolder && node.children && node.children.length > 0;
        const isExpanded = !!expandedIds[node.id];
        const isSelected = selectedId === node.id;

        return (
          <div key={node.id} className="select-none font-sans">
            <div
              onClick={() => handleNodeClick(node)}
              className={`flex items-center gap-1.5 py-1 px-2 text-xs transition-colors cursor-pointer rounded mx-1 ${
                isSelected ? 'hover:bg-[var(--hover-bg)] font-medium' : 'hover:bg-[var(--hover-bg)]'
              }`}
              style={{
                paddingLeft: `${depth * 14 + 6}px`,
                backgroundColor: isSelected ? 'var(--hover-bg)' : 'transparent',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              {isFolder ? (
                <button
                  onClick={(e) => toggleExpand(node.id, e)}
                  className="p-0.5 rounded hover:bg-[var(--hover-bg)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              ) : (
                <span className="w-3.5 shrink-0" />
              )}

              {getFileIcon(node.name, isFolder, isExpanded)}
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
      {/* Universal Explorer Header */}
      <div 
        className="h-8 px-2.5 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            Explorer
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Action: Open Folder */}
          {onOpenFolder && (
            <button
              onClick={onOpenFolder}
              className="p-1 rounded hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="Open Folder"
            >
              <FolderPlus className="w-3 h-3" />
            </button>
          )}

          {/* Action: New File */}
          {onNewFile && (
            <button
              onClick={onNewFile}
              className="p-1 rounded hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="New File (Ctrl+N)"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}

          {/* Search Toggle */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isSearchOpen ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
            }`}
            title="Search Files"
          >
            <Search className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="px-2 py-1.5 border-b flex items-center gap-1.5 shrink-0" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--hover-bg)' }}>
          <Search className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[11px] outline-none font-sans"
            style={{ color: 'var(--text-primary)' }}
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="cursor-pointer" style={{ color: 'var(--text-muted)' }}>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Explorer Content */}
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin flex flex-col">
        {/* Section 1: Open Editors / Tabs */}
        {openTabs.length > 0 && (
          <div className="mb-2">
            <div 
              onClick={() => setIsOpenEditorsExpanded(!isOpenEditorsExpanded)}
              className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider cursor-pointer hover:bg-[var(--hover-bg)] transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <div className="flex items-center gap-1">
                {isOpenEditorsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Открытые редакторы</span>
              </div>
              <span className="text-[9px] font-mono opacity-70">{openTabs.length}</span>
            </div>

            {isOpenEditorsExpanded && (
              <div className="mt-0.5 space-y-0.5">
                {openTabs.map(tab => {
                  const isActive = tab.id === activeTabId;
                  return (
                    <div
                      key={tab.id}
                      onClick={() => onSelectTab && onSelectTab(tab.id)}
                      className="group flex items-center justify-between py-1 px-2.5 text-xs transition-colors cursor-pointer rounded mx-1"
                      style={{
                        backgroundColor: isActive ? 'var(--hover-bg)' : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {getFileIcon(tab.name, false)}
                        <span className={`truncate text-[11.5px] ${isActive ? 'font-medium' : 'font-normal'}`}>
                          {tab.name}
                        </span>
                      </div>

                      {onCloseTab && openTabs.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloseTab(tab.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--hover-bg)] transition-opacity"
                          style={{ color: 'var(--text-muted)' }}
                          title="Close File"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Section 2: Workspace Folder or Clean Empty State */}
        {openedFolder ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Folder Header */}
            <div 
              onClick={() => setIsFolderExpanded(!isFolderExpanded)}
              className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider cursor-pointer hover:bg-[var(--hover-bg)] transition-colors border-t"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-1 min-w-0">
                {isFolderExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span className="truncate">{openedFolder.folderName}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {onCloseFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseFolder();
                    }}
                    className="p-0.5 rounded hover:bg-[var(--hover-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    title="Close Folder"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Folder Tree */}
            {isFolderExpanded && (
              <div className="flex-1 overflow-y-auto py-1">
                {renderNodes(openedFolder.tree)}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center select-none">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 shadow-xs"
              style={{ backgroundColor: 'var(--hover-bg)' }}
            >
              <Folder className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </div>

            <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Папка не открыта
            </p>
            <p className="text-[11px] mb-3.5 max-w-[190px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              В рабочей области нет открытых папок. Откройте папку на диске или создайте новый файл.
            </p>

            <div className="flex flex-col gap-1.5 w-full max-w-[170px]">
              {onOpenFolder && (
                <button
                  onClick={onOpenFolder}
                  className="w-full py-1.5 px-3 rounded-md text-[11.5px] font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Открыть папку</span>
                </button>
              )}

              {onNewFile && (
                <button
                  onClick={onNewFile}
                  className="w-full py-1.5 px-3 rounded-md text-[11.5px] font-medium border hover:bg-[var(--hover-bg)] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-primary)' 
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Новый файл</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};