import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Play, 
  ArrowDownToLine, 
  Copy, 
  Check, 
  Terminal, 
  Shield, 
  Cpu, 
  Activity, 
  ExternalLink, 
  BookOpen, 
  Layers, 
  Keyboard, 
  Info,
  Plus,
  Code2,
  Database
} from 'lucide-react';
import { CrystallLogo } from './CrystallLogo';
import { QuickScript } from '../types';

// ==========================================
// 1. SNIPPETS & TEMPLATES HUB MODAL
// ==========================================
interface ScriptHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScript: (name: string, code: string) => void;
  onExecuteScript: (name: string, code: string) => void;
}

interface HubItem {
  id: string;
  name: string;
  category: 'All' | 'Python' | 'TypeScript' | 'JavaScript' | 'Lua' | 'Algorithms' | 'Web';
  stats: string;
  author: string;
  description: string;
  code: string;
}

const HUB_TEMPLATES: HubItem[] = [
  {
    id: 'hub-py-fastapi',
    name: 'FastAPI Production Server',
    category: 'Python',
    stats: 'Python 3.12',
    author: 'Crystall Core',
    description: 'Asynchronous REST API framework with Pydantic validation, CORS middleware, and Swagger docs.',
    code: `from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Crystall High-Performance API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestPayload(BaseModel):
    query: str
    limit: int = 10

@app.get("/health")
async def health_check():
    return {"status": "ok", "runtime": "Python 3.12", "ready": True}

@app.post("/api/v1/search")
async def search_endpoint(payload: RequestPayload):
    return {"query": payload.query, "results": [f"Result #{i}" for i in range(payload.limit)]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`
  },
  {
    id: 'hub-ts-express',
    name: 'Express TypeScript REST API',
    category: 'TypeScript',
    stats: 'Node v20',
    author: 'Crystall Core',
    description: 'Fully typed Express.js server router with error handling and request logging.',
    code: `import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

app.get('/api/status', (_req: Request, res: Response) => {
  res.json({ service: 'Crystall Microservice', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(\`[Server] Running at http://localhost:\${PORT}\`);
});
`
  },
  {
    id: 'hub-js-canvas',
    name: 'Interactive Canvas 2D Engine',
    category: 'JavaScript',
    stats: 'Web Canvas',
    author: 'CreativeCode',
    description: 'Smooth 60FPS particle interaction with mouse gravity and repulsion vectors.',
    code: `const initCanvas = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    size: Math.random() * 4 + 2,
    color: '#f97316'
  }));

  function animate() {
    ctx.fillStyle = 'rgba(12, 13, 18, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
};
initCanvas();
`
  },
  {
    id: 'hub-lua-controller',
    name: 'Event-Driven Game Controller',
    category: 'Lua',
    stats: 'Lua 5.1 / Luau',
    author: 'Crystall Engine',
    description: 'Modular state machine and event emitter for character control and physics simulation.',
    code: `local Controller = {}
Controller.__index = Controller

function Controller.new(characterId)
    local self = setmetatable({}, Controller)
    self.id = characterId
    self.listeners = {}
    self.state = "IDLE"
    return self
end

function Controller:On(event, callback)
    self.listeners[event] = self.listeners[event] or {}
    table.insert(self.listeners[event], callback)
end

function Controller:Emit(event, ...)
    if self.listeners[event] then
        for _, cb in ipairs(self.listeners[event]) do
            cb(...)
        end
    end
end

function Controller:TransitionTo(newState)
    local old = self.state
    self.state = newState
    self:Emit("state_changed", old, newState)
end

local player = Controller.new("Player-01")
player:On("state_changed", function(old, new)
    print(string.format("[Controller] State transitioned from %s to %s", old, new))
end)
player:TransitionTo("RUNNING")
`
  },
  {
    id: 'hub-algo-graph',
    name: 'Dijkstra Shortest Path Finder',
    category: 'Algorithms',
    stats: 'Algorithms',
    author: 'CS Algorithms',
    description: 'Weighted graph representation and Dijkstra shortest-path evaluation algorithm.',
    code: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    priority_queue = [(0, start)]

    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))

    return distances

graph = {
    'A': {'B': 4, 'C': 2},
    'B': {'A': 4, 'C': 1, 'D': 5},
    'C': {'A': 2, 'B': 1, 'D': 8, 'E': 10},
    'D': {'B': 5, 'C': 8, 'E': 2},
    'E': {'C': 10, 'D': 2}
}
print("Shortest distances from A:", dijkstra(graph, 'A'))
`
  },
  {
    id: 'hub-web-glass',
    name: 'Modern Web Landing Page Template',
    category: 'Web',
    stats: 'HTML/CSS',
    author: 'DesignKit',
    description: 'Dark mode responsive landing page with neon orange accents and glass panels.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Modern Web Template</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0c0d12; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 2rem; border-radius: 16px; width: 400px; text-align: center; }
    .btn { background: #f97316; color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 1.5rem; }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Crystall Web App</h2>
    <p style="color: #94a3b8; margin-top: 0.5rem;">Responsive, fast, and modern.</p>
    <button class="btn">Get Started</button>
  </div>
</body>
</html>
`
  }
];

export const ScriptHubModal: React.FC<ScriptHubModalProps> = ({
  isOpen,
  onClose,
  onLoadScript,
  onExecuteScript
}) => {
  const [activeCat, setActiveCat] = useState<string>('All');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const categories = ['All', 'Python', 'TypeScript', 'JavaScript', 'Lua', 'Algorithms', 'Web'];

  const filtered = HUB_TEMPLATES.filter(item => {
    const matchesCat = activeCat === 'All' || item.category === activeCat;
    const matchesSearch = !search || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 font-sans select-none"
      style={{ backgroundColor: 'var(--modal-overlay, rgba(0, 0, 0, 0.45))' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-3xl max-h-[85vh] rounded-xl border shadow-2xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-modal)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)'
        }}
      >
        {/* Header */}
        <div className="h-12 px-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Code Snippets & Templates Hub</h2>
              <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Curated multi-language starter blueprints</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <div 
            className="flex items-center gap-1.5 border px-2.5 py-1 rounded-md w-72" 
            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}
          >
            <Search className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search template name, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs outline-none w-full"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  activeCat === cat
                    ? 'bg-orange-500 text-white font-medium shadow-sm'
                    : 'hover:bg-[var(--hover-bg)]'
                }`}
                style={{
                  color: activeCat === cat ? undefined : 'var(--text-secondary)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 scrollbar-thin">
          {filtered.map(item => (
            <div 
              key={item.id}
              className="p-3.5 rounded-lg border flex flex-col justify-between transition-colors hover:border-[var(--accent-primary)]/50 group"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-xs font-semibold group-hover:text-orange-400 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.name}
                  </span>
                  <span 
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                    style={{ 
                      backgroundColor: 'var(--hover-bg)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-muted)' 
                    }}
                  >
                    {item.stats}
                  </span>
                </div>
                <div className="text-[10px] mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                  by {item.author} • <span className="text-orange-400">{item.category}</span>
                </div>
                <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  onClick={() => {
                    onLoadScript(item.name, item.code);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--hover-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <ArrowDownToLine className="w-3 h-3" />
                  <span>Load</span>
                </button>
                <button
                  onClick={() => {
                    onExecuteScript(item.name, item.code);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Run</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. AST & BYTECODE INSPECTOR MODAL
// ==========================================
interface BytecodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptName: string;
  scriptContent: string;
}

export const BytecodeModal: React.FC<BytecodeModalProps> = ({
  isOpen,
  onClose,
  scriptName,
  scriptContent
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isPython = scriptName.endsWith('.py');
  const isTsJs = scriptName.endsWith('.ts') || scriptName.endsWith('.js');

  const lines = scriptContent.split('\n').filter(l => l.trim().length > 0);
  const disassemblyLines: string[] = [
    `; Crystall Multi-Language Bytecode & AST Inspector v2.0`,
    `; File: ${scriptName}`,
    `; Target Architecture: x86_64 JIT / Bytecode VM`,
    `; -------------------------------------------------------------`,
    ""
  ];

  if (isPython) {
    disassemblyLines.push("  0 LOAD_CONST               0 (<code object <module> at 0x7f8841a0>)");
    disassemblyLines.push("  2 LOAD_CONST               1 ('AnalyticsEngine')");
    disassemblyLines.push("  4 MAKE_FUNCTION            0");
    disassemblyLines.push("  6 STORE_NAME               0 (DataProcessor)");
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) return;
      disassemblyLines.push(`  ; Line ${idx+1}: ${trimmed.substring(0, 35)}`);
      disassemblyLines.push(`  ${String(idx * 4 + 8).padStart(4, '0')} LOAD_NAME               1 (${trimmed.split('(')[0].split('=')[0].trim() || 'item'})`);
      disassemblyLines.push(`  ${String(idx * 4 + 10).padStart(4, '0')} CALL_FUNCTION           1`);
      disassemblyLines.push(`  ${String(idx * 4 + 12).padStart(4, '0')} POP_TOP`);
    });
    disassemblyLines.push("  RETURN_VALUE");
  } else {
    disassemblyLines.push(".proto 0");
    disassemblyLines.push("  .params 0");
    disassemblyLines.push("  .registers 8");
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('--')) return;
      disassemblyLines.push(`  ; Line ${idx + 1}: ${trimmed.substring(0, 35)}`);
      disassemblyLines.push(`  [${String(idx * 2).padStart(4, '0')}] GETGLOBAL     R0   '${trimmed.split('(')[0].trim() || 'call'}'`);
      disassemblyLines.push(`  [${String(idx * 2 + 1).padStart(4, '0')}] CALL          R0   1 1`);
    });
    disassemblyLines.push("  .end");
    disassemblyLines.push("  [RETURN     R0   1]");
  }

  const fullText = disassemblyLines.join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 font-sans"
      style={{ backgroundColor: 'var(--modal-overlay, rgba(0, 0, 0, 0.45))' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-2xl max-h-[85vh] rounded-xl border shadow-2xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-modal)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)'
        }}
      >
        <div className="h-12 px-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Bytecode & AST Inspector</h2>
              <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Disassembly for {scriptName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: 'var(--hover-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Disassembly'}</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div 
          className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed scrollbar-thin select-text border-t"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <pre>{fullText}</pre>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. SYSTEM & PROCESS MONITOR MODAL
// ==========================================
interface ProcessInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInjected: boolean;
  onAttach: () => void;
}

export const ProcessInspectorModal: React.FC<ProcessInspectorModalProps> = ({
  isOpen,
  onClose,
  isInjected,
  onAttach
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 font-sans"
      style={{ backgroundColor: 'var(--modal-overlay, rgba(0, 0, 0, 0.45))' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-xl rounded-xl border shadow-2xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-modal)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)'
        }}
      >
        <div className="h-12 px-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">System & Runtime Process Monitor</h2>
              <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Execution Environments & Memory</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <span className="text-[10px] block uppercase" style={{ color: 'var(--text-muted)' }}>Node.js Engine</span>
              <span className="text-sm font-semibold text-emerald-400">v20.12.0 (Active)</span>
            </div>
            <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <span className="text-[10px] block uppercase" style={{ color: 'var(--text-muted)' }}>Python Virtualenv</span>
              <span className="text-sm font-semibold text-sky-400">3.12.2 (Detected)</span>
            </div>
            <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <span className="text-[10px] block uppercase" style={{ color: 'var(--text-muted)' }}>Luau / Lua VM</span>
              <span className="text-sm font-semibold text-orange-400">5.1 Sandbox (Ready)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Active Memory Heap</span>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--hover-bg)' }}>
              <div className="bg-orange-500 h-full w-[24%]" />
            </div>
            <div className="flex justify-between text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
              <span>Used: 142 MB</span>
              <span>Available: 16.0 GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. STANDARD LIBRARY & API REFERENCE MODAL
// ==========================================
interface ApiReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet: (snippet: string) => void;
}

export const ApiReferenceModal: React.FC<ApiReferenceModalProps> = ({
  isOpen,
  onClose,
  onInsertSnippet
}) => {
  const [activeTab, setActiveTab] = useState<'python' | 'javascript' | 'lua'>('python');

  if (!isOpen) return null;

  const references: Record<string, Array<{ name: string; signature: string; desc: string; snippet: string }>> = {
    python: [
      { name: 'asyncio.run()', signature: 'asyncio.run(coro)', desc: 'Execute an asynchronous coroutine and return result.', snippet: 'import asyncio\nasyncio.run(main())' },
      { name: 'json.dumps()', signature: 'json.dumps(obj, indent=2)', desc: 'Serialize Python object to a JSON formatted string.', snippet: 'import json\nresult = json.dumps(data, indent=2)' },
      { name: 'math.sqrt()', signature: 'math.sqrt(x)', desc: 'Return the square root of positive number x.', snippet: 'import math\nroot = math.sqrt(144)' }
    ],
    javascript: [
      { name: 'fetch()', signature: 'fetch(url, options)', desc: 'Starts the process of fetching a resource from the network.', snippet: 'const res = await fetch("/api/data");\nconst data = await res.json();' },
      { name: 'Promise.all()', signature: 'Promise.all(iterable)', desc: 'Fulfills when all of the promises have fulfilled.', snippet: 'const [a, b] = await Promise.all([task1(), task2()]);' },
      { name: 'crypto.randomUUID()', signature: 'crypto.randomUUID()', desc: 'Generates a random v4 UUID string.', snippet: 'const id = crypto.randomUUID();' }
    ],
    lua: [
      { name: 'table.insert()', signature: 'table.insert(list, [pos], value)', desc: 'Inserts element at specified position.', snippet: 'table.insert(myList, "item")' },
      { name: 'string.format()', signature: 'string.format(formatstring, ...)', desc: 'Returns a formatted version of its variable arguments.', snippet: 'local str = string.format("User: %s, ID: %d", name, id)' },
      { name: 'coroutine.create()', signature: 'coroutine.create(f)', desc: 'Creates a new coroutine with function f.', snippet: 'local co = coroutine.create(function()\n    print("Inside coroutine")\nend)\ncoroutine.resume(co)' }
    ]
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 font-sans select-none"
      style={{ backgroundColor: 'var(--modal-overlay, rgba(0, 0, 0, 0.45))' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-2xl max-h-[85vh] rounded-xl border shadow-2xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-modal)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)'
        }}
      >
        <div className="h-12 px-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold">Standard Library Reference</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b px-4 gap-2 pt-2 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          {(['python', 'javascript', 'lua'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors cursor-pointer capitalize ${
                activeTab === tab ? 'border-orange-500 font-semibold' : 'border-transparent hover:opacity-80'
              }`}
              style={{
                color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {references[activeTab].map(item => (
            <div 
              key={item.name} 
              className="p-3 rounded-lg border flex items-start justify-between" 
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div>
                <span className="font-mono text-xs font-semibold text-orange-400">{item.name}</span>
                <span className="font-mono text-[11px] block mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.signature}</span>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
              <button
                onClick={() => {
                  onInsertSnippet(item.snippet);
                  onClose();
                }}
                className="px-2.5 py-1 rounded text-[11px] border cursor-pointer shrink-0 transition-colors hover:opacity-80"
                style={{
                  backgroundColor: 'var(--hover-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                Insert
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. SHORTCUTS MODAL
// ==========================================
export const ShortcutsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const hotkeys = [
    { key: 'F5', desc: 'Run Active Program / Script' },
    { key: 'Ctrl + Enter', desc: 'Run Currently Selected Code' },
    { key: 'Ctrl + N', desc: 'Create New File Tab' },
    { key: 'Ctrl + O', desc: 'Open File from Disk' },
    { key: 'Ctrl + K Ctrl + O', desc: 'Open Folder / Project Workspace' },
    { key: 'Ctrl + S', desc: 'Save Active File' },
    { key: 'Ctrl + Shift + S', desc: 'Save As New File' },
    { key: 'Ctrl + B', desc: 'Toggle Project Explorer' },
    { key: 'Ctrl + `', desc: 'Toggle Terminal / Console' },
    { key: 'Ctrl + I', desc: 'Toggle AI Assistant Drawer' },
    { key: 'Shift + Alt + F', desc: 'Format Code' },
    { key: 'Ctrl + F', desc: 'Find in Code' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 font-sans select-none"
      style={{ backgroundColor: 'var(--modal-overlay, rgba(0, 0, 0, 0.45))' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-md rounded-xl border shadow-2xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-modal)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)'
        }}
      >
        <div className="h-12 px-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold">Keyboard Shortcuts</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto max-h-[60vh] scrollbar-thin">
          {hotkeys.map(h => (
            <div key={h.key} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{h.desc}</span>
              <kbd 
                className="px-2 py-0.5 rounded text-[10px] font-mono border"
                style={{
                  backgroundColor: 'var(--hover-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                {h.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. ABOUT MODAL
// ==========================================
export const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 font-sans select-none"
      style={{ backgroundColor: 'var(--modal-overlay, rgba(0, 0, 0, 0.45))' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-sm rounded-xl border shadow-2xl flex flex-col overflow-hidden p-6 text-center"
        style={{
          backgroundColor: 'var(--bg-modal)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)'
        }}
      >
        <div className="w-12 h-12 rounded-xl bg-orange-500 mx-auto flex items-center justify-center shadow-lg text-white mb-3">
          <CrystallLogo size={28} />
        </div>
        <h2 className="text-base font-bold">Crystall IDE</h2>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>v1.0.0 Pro • Universal Code Editor</span>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          High-performance modern desktop IDE built for fast coding in Python, TypeScript, JavaScript, Lua, C++, and Web technologies with AI intelligence.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full py-1.5 rounded text-xs font-medium text-white shadow cursor-pointer transition-transform active:scale-98 hover:opacity-90"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 7. ADD SCRIPT / SNIPPET MODAL
// ==========================================
interface AddScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScript: (script: QuickScript) => void;
}

export const AddScriptModal: React.FC<AddScriptModalProps> = ({
  isOpen,
  onClose,
  onAddScript
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Python');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddScript({
      id: 'custom-' + Date.now(),
      name: name,
      category,
      stats: 'Custom',
      content: content || `# Code snippet: ${name}\n`
    });
    setName('');
    setContent('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 font-sans select-none"
      style={{ backgroundColor: 'var(--modal-overlay, rgba(0, 0, 0, 0.45))' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border shadow-2xl flex flex-col overflow-hidden p-4 space-y-3"
        style={{
          backgroundColor: 'var(--bg-modal)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)'
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 font-medium text-xs">
            <Plus className="w-4 h-4 text-orange-400" />
            <span>Add Custom Snippet</span>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 rounded hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-[11px] mb-1" style={{ color: 'var(--text-secondary)' }}>Snippet Name</label>
          <input
            type="text"
            placeholder="e.g. DataCleaner.py, ApiRouter.ts"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded text-xs border outline-none font-sans"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-[11px] mb-1" style={{ color: 'var(--text-secondary)' }}>Language / Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded text-xs border outline-none font-sans cursor-pointer"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="Python">Python</option>
            <option value="TypeScript">TypeScript</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Lua">Lua</option>
            <option value="Web">Web</option>
            <option value="Algorithms">Algorithms</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] mb-1" style={{ color: 'var(--text-secondary)' }}>Code Content</label>
          <textarea
            rows={4}
            placeholder="Enter template code..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded text-xs font-mono border outline-none scrollbar-thin"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs hover:bg-[var(--hover-bg)] cursor-pointer transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded text-xs font-medium text-white shadow-sm cursor-pointer transition-transform active:scale-98 hover:opacity-90"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Save Snippet
          </button>
        </div>
      </form>
    </div>
  );
};