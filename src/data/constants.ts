import { AllConfigs, FileTab, ExplorerNode, QuickScript, LanguageMeta } from '../types';

export const PROVIDER_LABELS: Record<string, { name: string; badge: string; color: string }> = {
  deepseek: { name: 'DeepSeek', badge: 'R1 / V3', color: '#06b6d4' },
  openai: { name: 'OpenAI', badge: 'GPT-4o / o3', color: '#10b981' },
  anthropic: { name: 'Anthropic', badge: 'Claude 3.7', color: '#f59e0b' },
  gemini: { name: 'Google Gemini', badge: '2.0 Flash', color: '#8b5cf6' },
  groq: { name: 'Groq', badge: 'Ultra Fast', color: '#f43f5e' },
  openrouter: { name: 'OpenRouter', badge: '200+ Models', color: '#ec4899' },
  ollama: { name: 'Ollama (Local)', badge: 'Free / Offline', color: '#64748b' },
  llamacpp: { name: 'Llama.cpp / LM Studio', badge: 'Local Server', color: '#38bdf8' },
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
    model: 'deepseek/deepseek-chat',
    temperature: 0.7,
    systemPrompt: 'You are an expert AI coding assistant in Crystall IDE. Provide high quality, clean code with concise explanations.'
  },
  ollama: {
    apiKey: 'ollama',
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3:latest',
    temperature: 0.7,
    systemPrompt: 'You are a local coding assistant running via Ollama in Crystall IDE.'
  },
  llamacpp: {
    apiKey: 'local',
    baseUrl: 'http://localhost:8080/v1',
    model: 'default',
    temperature: 0.7,
    systemPrompt: 'You are a local coding assistant running via llama.cpp or LM Studio in Crystall IDE.'
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
    id: 'c',
    name: 'C',
    ext: '.c',
    color: '#555555',
    sampleCode: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct {\n    int id;\n    const char *name;\n} Worker;\n\nint main(void) {\n    Worker w = { .id = 101, .name = "Crystall Native Worker" };\n    printf("[C] Initialized worker: %s (ID: %d)\\n", w.name, w.id);\n    return 0;\n}\n`
  },
  {
    id: 'cpp',
    name: 'C++',
    ext: '.cpp',
    color: '#a855f7',
    sampleCode: `#include <iostream>\n#include <vector>\n#include <numeric>\n\nint main() {\n    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};\n    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);\n    std::cout << "[C++] High-Performance Compute: Sum = " << sum << std::endl;\n    return 0;\n}\n`
  },
  {
    id: 'rust',
    name: 'Rust',
    ext: '.rs',
    color: '#f97316',
    sampleCode: `// Rust Safe Systems Execution in Crystall IDE\nfn main() {\n    let items = vec!["Fast", "Safe", "Concurrent"];\n    for (i, feature) in items.iter().enumerate() {\n        println!("[Rust] Feature {}: {}", i + 1, feature);\n    }\n}\n`
  },
  {
    id: 'csharp',
    name: 'C#',
    ext: '.cs',
    color: '#10b981',
    sampleCode: `// C# .NET Execution in Crystall IDE\nusing System;\nusing System.Collections.Generic;\nusing System.Linq;\n\nclass Program {\n    static void Main() {\n        var data = new List<int> { 10, 20, 30, 40, 50 };\n        var average = data.Average();\n        Console.WriteLine($"[C#] Computed average: {average}");\n    }\n}\n`
  },
  {
    id: 'java',
    name: 'Java',
    ext: '.java',
    color: '#ea580c',
    sampleCode: `// Java Modern Execution in Crystall IDE\nimport java.util.List;\nimport java.util.stream.Collectors;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> items = List.of("Crystall", "IDE", "Java", "Backend");\n        String joined = items.stream()\n            .map(String::toUpperCase)\n            .collect(Collectors.joining(" | "));\n        System.out.println("[Java] " + joined);\n    }\n}\n`
  },
  {
    id: 'go',
    name: 'Go',
    ext: '.go',
    color: '#06b6d4',
    sampleCode: `package main\n\nimport (\n\t"fmt"\n\t"time"\n)\n\nfunc worker(id int, ch chan string) {\n\ttime.Sleep(50 * time.Millisecond)\n\tch <- fmt.Sprintf("Worker %d finished", id)\n}\n\nfunc main() {\n\tch := make(chan string)\n\tgo worker(1, ch)\n\tfmt.Println("[Go]", <-ch)\n}\n`
  },
  {
    id: 'lua',
    name: 'Lua / Luau',
    ext: '.lua',
    color: '#0284c7',
    sampleCode: `-- Lua Script in Crystall IDE\nlocal function fibonacci(n)\n    if n <= 1 then return n end\n    return fibonacci(n - 1) + fibonacci(n - 2)\nend\n\nprint("[Lua] Fibonacci(10) =", fibonacci(10))\n`
  },
  {
    id: 'php',
    name: 'PHP',
    ext: '.php',
    color: '#777bb4',
    sampleCode: `<?php\n// PHP 8+ Modern Script in Crystall IDE\n$framework = "Crystall IDE";\n$versions = ["PHP 8.2", "JIT", "FastCGI"];\n\necho "[PHP] Running on $framework\\n";\nforeach ($versions as $v) {\n    echo " - Feature: $v\\n";\n}\n`
  },
  {
    id: 'ruby',
    name: 'Ruby',
    ext: '.rb',
    color: '#e11d48',
    sampleCode: `# Ruby Script in Crystall IDE\nclass MetricTracker\n  def initialize(name)\n    @name = name\n  end\n\n  def report\n    puts "[Ruby] Metric #{@name}: Healthy (100%)"\n  end\nend\n\nMetricTracker.new("CoreEngine").report\n`
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    ext: '.kt',
    color: '#7c3aed',
    sampleCode: `// Kotlin Script in Crystall IDE\ndata class Task(val id: Int, val title: String)\n\nfun main() {\n    val tasks = listOf(Task(1, "Build AST"), Task(2, "Stream LLM"))\n    tasks.forEach { println("[Kotlin] Task \${it.id}: \${it.title}") }\n}\n`
  },
  {
    id: 'swift',
    name: 'Swift',
    ext: '.swift',
    color: '#f05138',
    sampleCode: `// Swift Script in Crystall IDE\nstruct AppConfig {\n    let name: String\n    let version: String\n}\n\nlet config = AppConfig(name: "Crystall IDE", version: "2.5.0")\nprint("[Swift] Initialized \\(config.name) v\\(config.version)")\n`
  },
  {
    id: 'dart',
    name: 'Dart',
    ext: '.dart',
    color: '#0175c2',
    sampleCode: `// Dart Script in Crystall IDE\nvoid main() {\n  final languages = ['Dart', 'Flutter', 'Crystall'];\n  for (var lang in languages) {\n    print('[Dart] Ready: $lang');\n  }\n}\n`
  },
  {
    id: 'r',
    name: 'R',
    ext: '.r',
    color: '#276dc3',
    sampleCode: `# R Data Analysis in Crystall IDE\nvalues <- c(12, 24, 36, 48, 60)\nmean_val <- mean(values)\nsd_val <- sd(values)\ncat(sprintf("[R] Mean: %.2f, StdDev: %.2f\\n", mean_val, sd_val))\n`
  },
  {
    id: 'julia',
    name: 'Julia',
    ext: '.jl',
    color: '#9558b2',
    sampleCode: `# Julia High-Performance Numerical Computing\nfunction compute_matrix()\n    A = [1.0 2.0; 3.0 4.0]\n    println("[Julia] Determinant: ", A[1,1]*A[2,2] - A[1,2]*A[2,1])\nend\n\ncompute_matrix()\n`
  },
  {
    id: 'perl',
    name: 'Perl',
    ext: '.pl',
    color: '#39457e',
    sampleCode: `#!/usr/bin/env perl\nuse strict;\nuse warnings;\n\nmy @items = ("Perl5", "Regex", "Crystall IDE");\nprint "[Perl] " . join(" -> ", @items) . "\\n";\n`
  },
  {
    id: 'scala',
    name: 'Scala',
    ext: '.scala',
    color: '#dc2626',
    sampleCode: `// Scala Modern Script\nobject Main extends App {\n  val langs = List("Scala 3", "Akka", "Cats")\n  println(s"[Scala] Stack: \${langs.mkString(", ")}")\n}\n`
  },
  {
    id: 'zig',
    name: 'Zig',
    ext: '.zig',
    color: '#ec4899',
    sampleCode: `const std = @import("std");\n\npub fn main() void {\n    std.debug.print("[Zig] Zero-overhead systems language in Crystall IDE!\\n", .{});\n}\n`
  },
  {
    id: 'haskell',
    name: 'Haskell',
    ext: '.hs',
    color: '#5e5086',
    sampleCode: `-- Haskell Pure Functional Script in Crystall IDE\nfactorial :: Integer -> Integer\nfactorial 0 = 1\nfactorial n = n * factorial (n - 1)\n\nmain :: IO ()\nmain = putStrLn ("[Haskell] Factorial 7 = " ++ show (factorial 7))\n`
  },
  {
    id: 'shell',
    name: 'Shell / Batch',
    ext: '.bat',
    color: '#4ade80',
    sampleCode: `@echo off\necho [Batch] Running script in Crystall IDE...\necho Current Time: %time%\n`
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
    id: 'markdown',
    name: 'Markdown',
    ext: '.md',
    color: '#e2e8f0',
    sampleCode: `# Crystall IDE Project\n\nUniversal modern code editor & IDE designed for high-performance workflows.\n`
  }
];

// Clean single starter tab for universal IDE
export const INITIAL_TABS: FileTab[] = [
  {
    id: 'tab-main-py',
    name: 'main.py',
    language: 'python',
    content: `# Crystall IDE\nprint("Hello, Crystall IDE!")\n`
  }
];

// Clean workspace tree (no mock dummy folders)
export const PROJECT_WORKSPACE_TREE: ExplorerNode[] = [];

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
  { id: 'log-1', type: 'info' as const, message: 'Crystall IDE v1.0.0 ready.', timestamp: '12:15:01' },
  { id: 'log-2', type: 'success' as const, message: 'Universal Language Server ready: Python, TS/JS, Lua, C++, Rust, Web', timestamp: '12:15:02' }
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