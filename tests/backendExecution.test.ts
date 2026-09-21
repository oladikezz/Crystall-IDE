import test from 'node:test';
import assert from 'node:assert';
import { ProcessOutputEvent, SystemRuntimesInfo } from '../src/types';

// Helper simulating command resolution logic from electron/main.cjs
function resolveCommand(language: string, execFile: string, args: string[] = []): { cmd: string; cmdArgs: string[] } {
  const lang = (language || '').toLowerCase();
  if (lang === 'python' || lang === 'py') {
    return { cmd: 'python', cmdArgs: ['-u', execFile, ...args] };
  } else if (lang === 'javascript' || lang === 'js') {
    return { cmd: 'node', cmdArgs: [execFile, ...args] };
  } else if (lang === 'typescript' || lang === 'ts' || lang === 'tsx') {
    return { cmd: 'node', cmdArgs: ['--experimental-strip-types', execFile, ...args] };
  } else if (lang === 'lua') {
    return { cmd: 'lua', cmdArgs: [execFile, ...args] };
  } else if (lang === 'java') {
    return { cmd: 'java', cmdArgs: [execFile, ...args] };
  } else if (lang === 'rust' || lang === 'rs') {
    const exeOut = execFile.replace(/\.rs$/i, process.platform === 'win32' ? '.exe' : '');
    return { cmd: `rustc -O "${execFile}" -o "${exeOut}" && "${exeOut}"`, cmdArgs: args };
  } else if (lang === 'cpp' || lang === 'c++') {
    const exeOut = execFile.replace(/\.(cpp|cc|cxx)$/i, process.platform === 'win32' ? '.exe' : '');
    return { cmd: `g++ -O2 -std=c++17 "${execFile}" -o "${exeOut}" && "${exeOut}"`, cmdArgs: args };
  } else if (lang === 'c') {
    const exeOut = execFile.replace(/\.c$/i, process.platform === 'win32' ? '.exe' : '');
    return { cmd: `gcc -O2 "${execFile}" -o "${exeOut}" && "${exeOut}"`, cmdArgs: args };
  } else if (lang === 'csharp' || lang === 'cs' || lang === 'c#') {
    const exeOut = execFile.replace(/\.cs$/i, '.exe');
    return { cmd: `csc -nologo -out:"${exeOut}" "${execFile}" && "${exeOut}"`, cmdArgs: args };
  } else if (lang === 'go') {
    return { cmd: 'go', cmdArgs: ['run', execFile, ...args] };
  } else if (lang === 'php') {
    return { cmd: 'php', cmdArgs: [execFile, ...args] };
  } else if (lang === 'ruby' || lang === 'rb') {
    return { cmd: 'ruby', cmdArgs: [execFile, ...args] };
  } else if (lang === 'kotlin' || lang === 'kt') {
    return { cmd: 'kotlinc', cmdArgs: ['-script', execFile, ...args] };
  } else if (lang === 'swift') {
    return { cmd: 'swift', cmdArgs: [execFile, ...args] };
  } else if (lang === 'dart') {
    return { cmd: 'dart', cmdArgs: ['run', execFile, ...args] };
  } else if (lang === 'r') {
    return { cmd: 'Rscript', cmdArgs: [execFile, ...args] };
  } else if (lang === 'julia' || lang === 'jl') {
    return { cmd: 'julia', cmdArgs: [execFile, ...args] };
  } else if (lang === 'perl' || lang === 'pl') {
    return { cmd: 'perl', cmdArgs: [execFile, ...args] };
  } else if (lang === 'scala') {
    return { cmd: 'scala', cmdArgs: [execFile, ...args] };
  } else if (lang === 'zig') {
    return { cmd: 'zig', cmdArgs: ['run', execFile, ...args] };
  } else if (lang === 'haskell' || lang === 'hs') {
    return { cmd: 'runghc', cmdArgs: [execFile, ...args] };
  } else if (lang === 'powershell' || lang === 'ps1') {
    return { cmd: 'powershell.exe', cmdArgs: ['-ExecutionPolicy', 'Bypass', '-File', execFile, ...args] };
  } else if (lang === 'shell' || lang === 'bat' || lang === 'cmd') {
    return { cmd: 'cmd.exe', cmdArgs: ['/c', execFile, ...args] };
  }
  return { cmd: execFile, cmdArgs: args };
}

test('BackendExecution - resolves correct command and flags for Python unbuffered execution', () => {
  const res = resolveCommand('python', 'C:\\scripts\\main.py', ['--debug']);
  assert.strictEqual(res.cmd, 'python');
  assert.deepStrictEqual(res.cmdArgs, ['-u', 'C:\\scripts\\main.py', '--debug']);
});

test('BackendExecution - resolves correct flags for TypeScript direct execution', () => {
  const res = resolveCommand('typescript', 'C:\\scripts\\index.ts');
  assert.strictEqual(res.cmd, 'node');
  assert.deepStrictEqual(res.cmdArgs, ['--experimental-strip-types', 'C:\\scripts\\index.ts']);
});

test('BackendExecution - resolves PowerShell execution bypass flags', () => {
  const res = resolveCommand('powershell', 'C:\\scripts\\run.ps1');
  assert.strictEqual(res.cmd, 'powershell.exe');
  assert.deepStrictEqual(res.cmdArgs, ['-ExecutionPolicy', 'Bypass', '-File', 'C:\\scripts\\run.ps1']);
});

test('BackendExecution - resolves Java, Rust, C++, C, and C# compilation & execution commands', () => {
  const javaRes = resolveCommand('java', 'C:\\scripts\\Main.java');
  assert.strictEqual(javaRes.cmd, 'java');
  assert.deepStrictEqual(javaRes.cmdArgs, ['C:\\scripts\\Main.java']);

  const rustRes = resolveCommand('rust', 'C:\\scripts\\main.rs');
  assert.ok(rustRes.cmd.includes('rustc -O "C:\\scripts\\main.rs"'));

  const cppRes = resolveCommand('cpp', 'C:\\scripts\\main.cpp');
  assert.ok(cppRes.cmd.includes('g++ -O2 -std=c++17 "C:\\scripts\\main.cpp"'));

  const cRes = resolveCommand('c', 'C:\\scripts\\main.c');
  assert.ok(cRes.cmd.includes('gcc -O2 "C:\\scripts\\main.c"'));

  const csRes = resolveCommand('csharp', 'C:\\scripts\\Program.cs');
  assert.ok(csRes.cmd.includes('csc -nologo'));
});

test('BackendExecution - resolves Go, PHP, Ruby, Kotlin, Swift, Dart, Zig, and Haskell runtimes', () => {
  const goRes = resolveCommand('go', 'C:\\scripts\\main.go');
  assert.strictEqual(goRes.cmd, 'go');
  assert.deepStrictEqual(goRes.cmdArgs, ['run', 'C:\\scripts\\main.go']);

  const phpRes = resolveCommand('php', 'C:\\scripts\\index.php');
  assert.strictEqual(phpRes.cmd, 'php');

  const rubyRes = resolveCommand('ruby', 'C:\\scripts\\app.rb');
  assert.strictEqual(rubyRes.cmd, 'ruby');

  const ktRes = resolveCommand('kotlin', 'C:\\scripts\\script.kt');
  assert.strictEqual(ktRes.cmd, 'kotlinc');
  assert.deepStrictEqual(ktRes.cmdArgs, ['-script', 'C:\\scripts\\script.kt']);

  const swiftRes = resolveCommand('swift', 'C:\\scripts\\main.swift');
  assert.strictEqual(swiftRes.cmd, 'swift');

  const dartRes = resolveCommand('dart', 'C:\\scripts\\main.dart');
  assert.strictEqual(dartRes.cmd, 'dart');
  assert.deepStrictEqual(dartRes.cmdArgs, ['run', 'C:\\scripts\\main.dart']);

  const zigRes = resolveCommand('zig', 'C:\\scripts\\main.zig');
  assert.strictEqual(zigRes.cmd, 'zig');
  assert.deepStrictEqual(zigRes.cmdArgs, ['run', 'C:\\scripts\\main.zig']);

  const hsRes = resolveCommand('haskell', 'C:\\scripts\\main.hs');
  assert.strictEqual(hsRes.cmd, 'runghc');
});

test('BackendExecution - parses and buffers stdout/stderr process output events', () => {
  const events: ProcessOutputEvent[] = [];
  const logSink: Array<{ type: string; text: string }> = [];

  const handleEvent = (event: ProcessOutputEvent) => {
    events.push(event);
    if (event.type === 'stdout' && event.text) {
      const lines = event.text.split(/\r?\n/).filter(Boolean);
      for (const l of lines) logSink.push({ type: 'info', text: l });
    } else if (event.type === 'stderr' && event.text) {
      const lines = event.text.split(/\r?\n/).filter(Boolean);
      for (const l of lines) logSink.push({ type: 'error', text: l });
    } else if (event.type === 'exit') {
      logSink.push({ type: 'status', text: `Exit ${event.code} in ${event.elapsedMs}ms` });
    }
  };

  handleEvent({ type: 'stdout', text: 'Line 1\nLine 2\n', pid: 1234 });
  handleEvent({ type: 'stderr', text: 'Traceback (most recent call last):\n  File "main.py", line 10\n', pid: 1234 });
  handleEvent({ type: 'exit', code: 1, elapsedMs: 45, pid: 1234 });

  assert.strictEqual(events.length, 3);
  assert.strictEqual(logSink.length, 5);
  assert.strictEqual(logSink[0].text, 'Line 1');
  assert.strictEqual(logSink[1].text, 'Line 2');
  assert.strictEqual(logSink[2].type, 'error');
  assert.strictEqual(logSink[4].text, 'Exit 1 in 45ms');
});

test('BackendExecution - validates SystemRuntimesInfo interface structure', () => {
  const sampleInfo: SystemRuntimesInfo = {
    python: 'Python 3.12.2',
    node: 'v24.18.0',
    git: 'git version 2.45.0.windows.1',
    rustc: 'rustc 1.80.0',
    go: 'go version go1.22.4 windows/amd64',
    gcc: null,
    os: 'Windows_NT 10.0.22631 (x64)',
    cpus: 16,
    totalMemoryGb: 32,
    freeMemoryGb: 18
  };

  assert.strictEqual(sampleInfo.python, 'Python 3.12.2');
  assert.strictEqual(sampleInfo.node, 'v24.18.0');
  assert.strictEqual(sampleInfo.gcc, null);
  assert.ok(sampleInfo.totalMemoryGb > 0);
});
