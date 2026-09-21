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
