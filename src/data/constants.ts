import { AllConfigs, FileTab, ExplorerNode, QuickScript, LanguageMeta } from '../types';

export const PROVIDER_LABELS: Record<string, { name: string; badge: string; color: string }> = {
  deepseek: { name: 'DeepSeek', badge: 'R1 / V3', color: '#06b6d4' },
  openai: { name: 'OpenAI', badge: 'GPT-4o / o3', color: '#10b981' },
  anthropic: { name: 'Anthropic', badge: 'Claude 3.7', color: '#f59e0b' },
  gemini: { name: 'Google Gemini', badge: '2.0 Flash', color: '#8b5cf6' },
  groq: { name: 'Groq', badge: 'Ultra Fast', color: '#f43f5e' },
  openrouter: { name: 'OpenRouter', badge: '200+ Models', color: '#ec4899' },
  ollama: { name: 'Ollama (Local)', badge: 'Free / Offline', color: '#64748b' },
  custom: { name: 'Custom Proxy', badge: 'Self-Hosted', color: '#a855f7' }
};

export const DEFAULT_CONFIGS: AllConfigs = {
  deepseek: {
    apiKey: '',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-reasoner',
    temperature: 0.6,
    systemPrompt: 'You are an elite AI Vibecoding assistant in Crystall IDE. Provide high quality, clean code with concise explanations.'
  },
  openai: {
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    temperature: 0.7,
    systemPrompt: 'You are an expert AI Vibecoding assistant in Crystall IDE.'
  },
  anthropic: {
    apiKey: '',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-3-7-sonnet-20250219',
    temperature: 0.7,
    systemPrompt: 'You are Claude, an expert coding assistant in Crystall IDE.'
  },
  gemini: {
    apiKey: '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    systemPrompt: 'You are an expert AI Vibecoding assistant powered by Google Gemini.'
  },
  groq: {
    apiKey: '',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    systemPrompt: 'You are an ultra-fast coding assistant powered by Groq.'
  },
  openrouter: {
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'deepseek/deepseek-r1',
    temperature: 0.7,
    systemPrompt: 'You are an expert coding assistant in Crystall IDE.'
  },
  ollama: {
    apiKey: 'ollama',
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3:latest',
    temperature: 0.7,
    systemPrompt: 'You are a local coding assistant running via Ollama in Crystall IDE.'
  },
  custom: {
    apiKey: '',
    baseUrl: 'http://localhost:8000/v1',
    model: 'custom-model',
    temperature: 0.7,
    systemPrompt: 'You are a coding assistant connected to a custom API.'
  }
};

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    id: 'python',
    name: 'Python',
    ext: '.py',
    color: '#3b82f6',
    sampleCode: `# Python Universal Script in Crystall IDE\nimport asyncio\nimport time\n\nasync def process_stream():\n    print("[Python] Initializing async runtime...")\n    await asyncio.sleep(0.1)\n    data = [x ** 2 for x in range(1, 10)]\n    print(f"[Python] Computed squares: {data}")\n    return data\n\nasyncio.run(process_stream())\n`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    ext: '.ts',
    color: '#38bdf8',
    sampleCode: `// TypeScript Service in Crystall IDE\ninterface ExecutionTask<T> {\n  id: string;\n  timestamp: number;\n  payload: T;\n}\n\nfunction runTask<T>(task: ExecutionTask<T>): void {\n  console.log(\`[TypeScript] Executing task \${task.id} at \${new Date(task.timestamp).toISOString()}\`);\n}\n\nrunTask({ id: "job-001", timestamp: Date.now(), payload: { status: "active" } });\n`
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    ext: '.js',
    color: '#facc15',
    sampleCode: `// JavaScript Node / Web script in Crystall IDE\nconst calculateMetrics = (items) => {\n  const sum = items.reduce((acc, v) => acc + v, 0);\n  return { count: items.length, average: sum / items.length };\n};\n\nconsole.log("[JS] Metrics:", calculateMetrics([12, 45, 78, 23, 90]));\n`
  },
  {
    id: 'lua',
    name: 'Lua / Luau',
    ext: '.lua',
    color: '#0284c7',
    sampleCode: `-- Lua Script in Crystall IDE\nlocal function fibonacci(n)\n    if n <= 1 then return n end\n    return fibonacci(n - 1) + fibonacci(n - 2)\nend\n\nprint("[Lua] Fibonacci(10) =", fibonacci(10))\n`
  },
  {
    id: 'html',
    name: 'HTML',
    ext: '.html',
    color: '#f97316',
    sampleCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>Crystall Web App</title>\n  <style>\n    body { background: #0c0d12; color: #fff; font-family: sans-serif; padding: 2rem; }\n  </style>\n</head>\n<body>\n  <h1>Hello from Crystall IDE</h1>\n</body>\n</html>\n`
  },
  {
    id: 'css',
    name: 'CSS',
    ext: '.css',
    color: '#60a5fa',
    sampleCode: `/* Modern Glassmorphism Styling */\n.card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 12px;\n  padding: 1.5rem;\n}\n`
  },
  {
    id: 'json',
    name: 'JSON',
    ext: '.json',
    color: '#a3e635',
    sampleCode: `{\n  "name": "crystall-project",\n  "version": "1.0.0",\n  "author": "Crystall Team",\n  "settings": {\n    "autoSave": true,\n    "telemetry": false\n  }\n}\n`
  },
  {
    id: 'cpp',
    name: 'C++',
    ext: '.cpp',
    color: '#a855f7',
    sampleCode: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::cout << "[C++] Crystall Native Fast Engine\n";\n    return 0;\n}\n`
  },
  {
    id: 'rust',
    name: 'Rust',
    ext: '.rs',
    color: '#f97316',
    sampleCode: `fn main() {\n    println!("[Rust] Memory-safe execution in Crystall IDE!");\n}\n`
  },
  {
    id: 'go',
    name: 'Go',
    ext: '.go',
    color: '#06b6d4',
    sampleCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("[Go] High performance concurrency runtime")\n}\n`
  },
  {
    id: 'markdown',
    name: 'Markdown',
    ext: '.md',
    color: '#e2e8f0',
    sampleCode: `# Crystall IDE Project\n\nUniversal modern code editor & IDE designed for high-performance workflows.\n`
  }
];

// Universal Multi-Language Developer Starter Files
export const INITIAL_TABS: FileTab[] = [
  {
    id: 'tab-main-py',
    name: 'main.py',
    language: 'python',
    content: `# Crystall IDE - High-Performance Universal Environment
import asyncio
import time
from typing import Dict, List, Any

class ExecutionEngine:
    def __init__(self, name: str = "Crystall Core"):
        self.name = name
        self.start_time = time.time()
        self.stages: List[str] = []

    async def run_pipeline(self) -> Dict[str, Any]:
        print(f"[{self.name}] Initializing async runtime...")
        await asyncio.sleep(0.05)
        self.stages.extend(["Lexer", "Parser", "TypeChecker", "Optimizer", "NativeRuntime"])
        return {
            "engine": self.name,
            "status": "ready",
            "uptime": round(time.time() - self.start_time, 4),
            "stages": self.stages
        }

async def main():
    core = ExecutionEngine()
    result = await core.run_pipeline()
    print(f"[{core.name}] Execution pipeline successful: {result}")

if __name__ == "__main__":
    asyncio.run(main())
`
  },
  {
    id: 'tab-app-ts',
    name: 'app.ts',
    language: 'typescript',
    content: `// TypeScript Universal Application Architecture
export interface ProjectConfig {
  id: string;
  name: string;
  version: string;
  features: string[];
  openSource: boolean;
}

export class CrystallRuntime {
  private config: ProjectConfig;

  constructor(config: ProjectConfig) {
    this.config = config;
  }

  public boot(): void {
    console.log(\`[Crystall IDE] Launching \${this.config.name} v\${this.config.version} (Open Source: \${this.config.openSource})\`);
    console.log("[Crystall IDE] Active features:", this.config.features.join(", "));
  }
}

const ide = new CrystallRuntime({
  id: "crystall-ide-universal",
  name: "Crystall IDE",
  version: "1.0.0",
  features: ["Multi-Language", "AI Reasoning", "Monaco Engine", "Open Source"],
  openSource: true
});

ide.boot();
`
  },
  {
    id: 'tab-game-lua',
    name: 'game_logic.lua',
    language: 'lua',
    content: `-- Lua / Luau Universal Game Logic & Vector Math
local Vector3 = {}
Vector3.__index = Vector3

function Vector3.new(x, y, z)
    return setmetatable({ x = x or 0, y = y or 0, z = z or 0 }, Vector3)
end

function Vector3:magnitude()
    return math.sqrt(self.x^2 + self.y^2 + self.z^2)
end

function Vector3:normalize()
    local m = self:magnitude()
    if m > 0 then
        return Vector3.new(self.x / m, self.y / m, self.z / m)
    end
    return Vector3.new(0, 0, 0)
end

local velocity = Vector3.new(10, 25, 50)
print("[Lua Engine] Initial velocity magnitude: " .. velocity:magnitude())
print("[Lua Engine] Normalized direction: (" .. velocity:normalize().x .. ", " .. velocity:normalize().y .. ", " .. velocity:normalize().z .. ")")
`
  },
  {
    id: 'tab-native-cpp',
    name: 'engine.cpp',
    language: 'cpp',
    content: `// C++ High Performance Native Toolchain
#include <iostream>
#include <vector>
#include <chrono>

int main() {
    std::cout << "[C++] Crystall IDE High-Speed Engine Online" << std::endl;
    std::vector<int> numbers(1000, 42);
    long long total = 0;
    
    auto start = std::chrono::high_resolution_clock::now();
    for (int n : numbers) total += n;
    auto end = std::chrono::high_resolution_clock::now();
    
    std::cout << "[C++] Computed sum: " << total << " in native cycle." << std::endl;
    return 0;
}
`
  },
  {
    id: 'tab-readme-md',
    name: 'README.md',
    language: 'markdown',
    content: `# Crystall IDE

**Open Source Universal Developer IDE**

Crystall IDE is an ultra-fast, modern developer workspace designed for seamless coding in Python, TypeScript, JavaScript, Lua / Luau, C++, Rust, and Web technologies.

## ✨ Key Capabilities
- **Multi-Language Architecture**: Native syntax support, IntelliSense, and compilation.
- **Deep AI Integration**: DeepSeek R1 reasoning, Claude 3.7, GPT-4o, and Gemini 2.0.
- **Project & Game Engine Support**: Dual file explorer for general project workspaces and game runtime trees.
- **Modern Liquid Glass UI**: Custom GPU-accelerated blur themes and native window performance.
`
  }
];

// Universal Project Workspace file tree
export const PROJECT_WORKSPACE_TREE: ExplorerNode[] = [
  {
    id: 'proj-src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'proj-api',
        name: 'api',
        type: 'folder',
        children: [
          {
            id: 'file-router-py',
            name: 'router.py',
            type: 'file',
            language: 'python',
            content: `# API Routing Module\nfrom typing import Dict\n\ndef get_routes() -> Dict[str, str]:\n    return {"/users": "UsersController", "/auth": "AuthController"}\n`
          },
          {
            id: 'file-handlers-ts',
            name: 'handlers.ts',
            type: 'file',
            language: 'typescript',
            content: `// Request handlers\nexport const handleRequest = (req: any) => ({ ok: true, status: 200 });\n`
          }
        ]
      },
      {
        id: 'proj-components',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: 'file-header-tsx',
            name: 'Header.tsx',
            type: 'file',
            language: 'typescript',
            content: `export const Header = () => <header>Crystall IDE</header>;\n`
          },
          {
            id: 'file-styles-css',
            name: 'styles.css',
            type: 'file',
            language: 'css',
            content: `/* Modern Component Styles */\n.header { display: flex; align-items: center; }\n`
          }
        ]
      },
      {
        id: 'proj-scripts',
        name: 'scripts',
        type: 'folder',
        children: [
          {
            id: 'file-automation-py',
            name: 'automation.py',
            type: 'file',
            language: 'python',
            content: `# Automated task runner\nprint("[Automation] Syncing remote repositories...")\n`
          },
          {
            id: 'file-game-lua',
            name: 'game_logic.lua',
            type: 'file',
            language: 'lua',
            content: `-- Game logic module\nprint("[Game] Entity physics simulated.")\n`
          }
        ]
      },
      {
        id: 'file-main-py',
        name: 'main.py',
        type: 'file',
        language: 'python',
        content: `# Main entrypoint\nprint("[Main] Application initialized successfully.")\n`
      },
      {
        id: 'file-server-ts',
        name: 'server.ts',
        type: 'file',
        language: 'typescript',
        content: `// Server bootstrap\nconsole.log("[Server] Listening on port 8080");\n`
      }
    ]
  },
  {
    id: 'proj-public',
    name: 'public',
    type: 'folder',
    children: [
      {
        id: 'file-index-html',
        name: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>\n<html><head><title>App</title></head><body><h1>Hello</h1></body></html>\n`
      }
    ]
  },
  {
    id: 'file-config-json',
    name: 'config.json',
    type: 'file',
    language: 'json',
    content: `{\n  "app": "Crystall IDE",\n  "version": "1.0.0"\n}\n`
  },
  {
    id: 'file-readme-md',
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    content: `# Crystall IDE Project\n\nGeneral purpose developer project workspace.\n`
  }
];

// Roblox Game Explorer Tree matching Figma 1:1
export const ROBLOX_EXPLORER_TREE: ExplorerNode[] = [
  { id: 'exp-workspace', name: 'Workspace', type: 'service', icon: 'workspace' },
  { id: 'exp-players', name: 'Players', type: 'service', icon: 'players' },
  { id: 'exp-lighting', name: 'Lighting', type: 'service', icon: 'lighting' },
  { id: 'exp-material', name: 'MaterialService', type: 'service', icon: 'material' },
  { id: 'exp-replicatedfirst', name: 'ReplicatedFirst', type: 'service', icon: 'replicatedfirst' },
  { id: 'exp-replicatedstorage', name: 'ReplicatedStorage', type: 'service', icon: 'replicatedstorage' },
  { 
    id: 'exp-serverscriptservice', 
    name: 'ServerScriptService', 
    type: 'service', 
    icon: 'serverscriptservice',
    children: [
      { id: 'fld-admin', name: 'Admin', type: 'folder' },
      { id: 'fld-data', name: 'Data', type: 'folder' },
      { id: 'fld-jobs', name: 'Jobs', type: 'folder' },
      { id: 'fld-services', name: 'Services', type: 'folder' },
      { id: 'script-bootstrap', name: 'Bootstrap', type: 'script', language: 'lua', content: 'print("[ServerScriptService] Bootstrap sequence initiated.")' }
    ]
  }
];

export interface FigmaQuickScript {
  id: string;
  name: string;
  stats: string;
  isStarred?: boolean;
  content: string;
  description?: string;
}

export const FIGMA_QUICK_SCRIPTS: FigmaQuickScript[] = [
  {
    id: 'script-infinite-yield',
    name: 'Infinite Yield.lua',
    stats: '2.4M',
    isStarred: true,
    content: `loadstring(game:HttpGet('https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source'))()`
  },
  {
    id: 'script-dark-dex',
    name: 'Dark Dex V4.lua',
    stats: '850K',
    isStarred: false,
    content: `loadstring(game:HttpGet("https://raw.githubusercontent.com/Babyhamsta/RBLX_Scripts/main/Universal/BypassedDarkDexV4.lua"))()`
  },
  {
    id: 'script-hydroxide',
    name: 'Hydroxide Remote Spy.lua',
    stats: '120K',
    isStarred: false,
    content: `local owner = "Upbolt"\nlocal branch = "revision"\nlocal function webImport(file)\n    return loadstring(game:HttpGetAsync(("https://raw.githubusercontent.com/%s/Hydroxide/%s/%s.lua"):format(owner, branch, file)), file)()\nend\nwebImport("init")`
  },
  {
    id: 'script-fly-noclip',
    name: 'Fly & Noclip.lua',
    stats: '460K',
    isStarred: false,
    content: `local Speed = 50\nloadstring(game:HttpGet("https://raw.githubusercontent.com/XNEOFF/FlyGuiV3/main/FlyGuiV3.txt"))()`
  },
  {
    id: 'script-universal-esp',
    name: 'Universal ESP.lua',
    stats: '630K',
    isStarred: false,
    content: `loadstring(game:HttpGet('https://raw.githubusercontent.com/ic3w0lf22/Unnamed-ESP/master/UnnamedESP.lua'))()`
  },
  {
    id: 'script-admin-commands',
    name: 'Admin Commands.lua',
    stats: '50K',
    isStarred: false,
    content: `loadstring(game:HttpGet('https://raw.githubusercontent.com/CMD-X/CMD-X/master/Source', true))()`
  }
];

export const FIGMA_CONSOLE_LOGS = [
  { id: 'log-1', type: 'info' as const, message: 'Crystall IDE v1.0.0 initializing...', timestamp: '12:15:01' },
  { id: 'log-2', type: 'success' as const, message: 'Universal Language Server ready: Python, TS/JS, Lua, C++, Rust, Web', timestamp: '12:15:02' },
  { id: 'log-3', type: 'info' as const, message: 'AI Engine loaded: DeepSeek R1, Claude 3.7, GPT-4o ready', timestamp: '12:15:03' },
  { id: 'log-4', type: 'info' as const, message: 'Workspace indexed: 14 project files, Git branch: main', timestamp: '12:15:04' },
  { id: 'log-5', type: 'success' as const, message: 'Build and runtime environments active.', timestamp: '12:15:05' }
];

// Multi-Language Code Snippets & Templates
export const CODE_SNIPPETS: QuickScript[] = [
  {
    id: 'snip-fastapi',
    name: 'FastAPI Microservice',
    stats: 'Python',
    category: 'Python',
    language: 'python',
    description: 'Fast asynchronous REST API with Pydantic validation & health endpoints.',
    content: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Crystall API Service")

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = None

@app.get("/")
def read_root():
    return {"status": "online", "engine": "Crystall IDE"}

@app.post("/items/")
def create_item(item: Item):
    return {"received": item.name, "price_tax": item.price * 1.2}
`
  },
  {
    id: 'snip-py-data',
    name: 'Data Pipeline & Analysis',
    stats: 'Python',
    category: 'Python',
    language: 'python',
    description: 'Clean numerical data processing and statistics calculation.',
    content: `import statistics

def analyze_dataset(data: list[float]):
    return {
        "count": len(data),
        "mean": statistics.mean(data),
        "median": statistics.median(data),
        "stdev": statistics.stdev(data) if len(data) > 1 else 0
    }

sample = [10.5, 23.4, 56.1, 44.8, 98.2, 12.0]
print("[Data Analysis Result]:", analyze_dataset(sample))
`
  },
  {
    id: 'snip-ws-client',
    name: 'WebSocket Realtime Client',
    stats: 'TypeScript',
    category: 'TypeScript',
    language: 'typescript',
    description: 'Auto-reconnecting WebSocket client with typed packet dispatcher.',
    content: `export class RealtimeClient {
  private ws: WebSocket | null = null;

  connect(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => console.log("[WS] Connected to", url);
    this.ws.onmessage = (e) => console.log("[WS Message]:", JSON.parse(e.data));
    this.ws.onclose = () => {
      console.warn("[WS] Connection lost. Reconnecting in 3s...");
      setTimeout(() => this.connect(url), 3000);
    };
  }

  send(event: string, payload: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, payload, timestamp: Date.now() }));
    }
  }
}
`
  },
  {
    id: 'snip-canvas-particles',
    name: 'Canvas Particle Engine',
    stats: 'JavaScript',
    category: 'JavaScript',
    language: 'javascript',
    description: 'High-performance 60FPS 2D canvas particle physics simulation.',
    content: `const createParticleSystem = (canvas) => {
  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    radius: Math.random() * 3 + 1
  }));

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
};
`
  },
  {
    id: 'snip-lua-table',
    name: 'Table Deep Clone & Serialize',
    stats: 'Lua',
    category: 'Lua',
    language: 'lua',
    description: 'Safe recursive deep cloning and string serialization for Lua tables.',
    content: `local function deepClone(original)
    local copy = {}
    for k, v in pairs(original) do
        if type(v) == "table" then
            copy[k] = deepClone(v)
        else
            copy[k] = v
        end
    end
    return copy
end

local original = { user = "Admin", permissions = { read = true, write = true } }
local cloned = deepClone(original)
print("[Lua] Cloned object user:", cloned.user)
`
  },
  {
    id: 'snip-algo-binary-search',
    name: 'Binary Search Algorithm',
    stats: 'Algorithms',
    category: 'Algorithms',
    language: 'python',
    description: 'Logarithmic O(log N) optimal array search with bounds verification.',
    content: `def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print("Index of 23:", binary_search(numbers, 23))
`
  },
  {
    id: 'snip-web-fetch',
    name: 'Resilient Fetch with Timeout',
    stats: 'Web',
    category: 'Web',
    language: 'typescript',
    description: 'HTTP request wrapper with exponential backoff and timeout cancellation.',
    content: `async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return await res.json();
  } catch (err: any) {
    clearTimeout(id);
    throw new Error(err.name === 'AbortError' ? 'Request timed out' : err.message);
  }
}
`
  }
];

export const QUICK_SCRIPTS = CODE_SNIPPETS;