import test from 'node:test';
import assert from 'node:assert';
import { ASTSlicer } from '../src/services/context/astSlicer';
import { DiagnosticCollector } from '../src/services/context/diagnosticCollector';
import { StderrCollector } from '../src/services/context/stderrCollector';
import { ContextEngine } from '../src/services/context/index';
import { ConsoleLog, FileTab } from '../src/types';

test('ASTSlicer - extracts Python classes, functions, and cursor scope', () => {
  const pyCode = `import asyncio
import time

class PipelineManager:
    def __init__(self, name: str):
        self.name = name

    async def execute_task(self, task_id: int):
        print(f"Running task {task_id}")
        return True

def standalone_helper():
    return 42
`;

  // Cursor is inside execute_task at line 9
  const result = ASTSlicer.slice(pyCode, 'python', 9);

  assert.strictEqual(result.symbols.length, 6); // 2 imports, 1 class, 2 methods, 1 function
  assert.ok(result.cursorScope);
  assert.strictEqual(result.cursorScope?.name, 'execute_task');
  assert.strictEqual(result.cursorScope?.type, 'method');
  assert.ok(result.outlineText.includes('PipelineManager'));
  assert.ok(result.outlineText.includes('execute_task'));
});

test('ASTSlicer - extracts TypeScript interfaces, functions, and arrow functions', () => {
  const tsCode = `import { useState } from 'react';

export interface UserSession {
  id: string;
  role: 'admin' | 'user';
}

export class AuthController {
  validate(): boolean {
    return true;
  }
}

export const processLogin = async (email: string) => {
  return { success: true };
};
`;

  const result = ASTSlicer.slice(tsCode, 'typescript', 14);
  assert.ok(result.symbols.some(s => s.name === 'UserSession' && s.type === 'interface'));
  assert.ok(result.symbols.some(s => s.name === 'AuthController' && s.type === 'class'));
  assert.ok(result.symbols.some(s => s.name === 'processLogin' && s.type === 'function'));
  assert.strictEqual(result.cursorScope?.name, 'processLogin');
});

test('ASTSlicer - extracts Lua functions and requires', () => {
  const luaCode = `local HttpService = game:GetService("HttpService")
local Players = require(script.Parent.Players)

local function InitializeClient(player)
    print("Init " .. player.Name)
end

function Module:ProcessBatch(data)
    return #data
end
`;

  const result = ASTSlicer.slice(luaCode, 'lua', 5);
  assert.ok(result.symbols.some(s => s.name === 'InitializeClient'));
  assert.ok(result.symbols.some(s => s.name === 'Module:ProcessBatch'));
  assert.strictEqual(result.cursorScope?.name, 'InitializeClient');
});

test('DiagnosticCollector - formats Monaco markers with code snippets', () => {
  const fileContent = `const x: number = 10;
const y: string = x; // Type mismatch
const z = 20;`;

  const fakeMonacoMarkers = [
    {
      message: "Type 'number' is not assignable to type 'string'.",
      severity: 8, // Error
      startLineNumber: 2,
      startColumn: 7,
      endLineNumber: 2,
      endColumn: 8
    }
  ];

  const items = DiagnosticCollector.fromMonacoMarkers(fakeMonacoMarkers, fileContent);
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].severity, 'error');
  assert.strictEqual(items[0].startLineNumber, 2);
  assert.ok(items[0].codeSnippet?.includes('> L2: const y: string = x;'));

  const promptBlock = DiagnosticCollector.formatForPrompt(items);
  assert.ok(promptBlock.includes('Live Compiler & Language Server Diagnostics'));
  assert.ok(promptBlock.includes('Line 2:7'));
});

test('StderrCollector - filters recent error and warn console logs', () => {
  const logs: ConsoleLog[] = [
    { id: '1', type: 'info', message: 'Starting process...', timestamp: '12:00:00' },
    { id: '2', type: 'error', message: 'SyntaxError: unexpected EOF', timestamp: '12:00:01' },
    { id: '3', type: 'warn', message: 'DeprecationWarning: buffer() is deprecated', timestamp: '12:00:02' },
    { id: '4', type: 'success', message: 'Finished', timestamp: '12:00:03' }
  ];

  const stderr = StderrCollector.fromConsoleLogs(logs);
  assert.strictEqual(stderr.length, 2);
  assert.strictEqual(stderr[0].message, 'SyntaxError: unexpected EOF');
  assert.strictEqual(stderr[1].message, 'DeprecationWarning: buffer() is deprecated');

  const formatted = StderrCollector.formatForPrompt(stderr);
  assert.ok(formatted.includes('Recent Runtime Stderr'));
  assert.ok(formatted.includes('SyntaxError'));
});

test('ContextEngine - builds comprehensive context payload', () => {
  const activeTab: FileTab = {
    id: 'tab-1',
    name: 'main.py',
    language: 'python',
    content: 'def run():\n    return True\n'
  };

  const context = ContextEngine.buildContext({
    activeTab,
    cursorLine: 1,
    monacoMarkers: [],
    consoleLogs: [],
    allTabs: [activeTab]
  });

  assert.strictEqual(context.activeFile.name, 'main.py');
  assert.ok(context.astOutline);
  assert.strictEqual(context.diagnostics.length, 0);
  assert.ok(context.budgetMetrics.estimatedInputTokens > 0);
});

test('ASTSlicer - extracts Java classes, records, methods, and cursor scope', () => {
  const javaCode = `package com.crystall.engine;

import java.util.List;

public class DataService {
    public static void main(String[] args) {
        System.out.println("Starting service");
    }

    public List<String> fetchRecords(int limit) {
        return List.of("A", "B");
    }
}
`;

  const result = ASTSlicer.slice(javaCode, 'java', 10);
  assert.ok(result.symbols.some(s => s.name === 'DataService' && s.type === 'class'));
  assert.ok(result.symbols.some(s => s.name === 'fetchRecords' && s.type === 'method'));
  assert.strictEqual(result.cursorScope?.name, 'fetchRecords');
});

test('ASTSlicer - extracts C# classes, methods, and usings', () => {
  const csCode = `using System;
using System.Threading.Tasks;

namespace Crystall.Core {
    public class WorkerPool {
        public async Task<int> ProcessQueueAsync() {
            await Task.Delay(10);
            return 100;
        }
    }
}
`;

  const result = ASTSlicer.slice(csCode, 'csharp', 7);
  assert.ok(result.symbols.some(s => s.name === 'WorkerPool' && s.type === 'class'));
  assert.ok(result.symbols.some(s => s.name === 'ProcessQueueAsync' && s.type === 'method'));
  assert.strictEqual(result.cursorScope?.name, 'ProcessQueueAsync');
});

test('ASTSlicer - extracts C/C++ classes, structs, and functions', () => {
  const cppCode = `#include <iostream>
#include <vector>

struct EngineStats {
    int fps;
    double frameTime;
};

int main(int argc, char** argv) {
    std::cout << "Engine ready\\n";
    return 0;
}
`;

  const result = ASTSlicer.slice(cppCode, 'cpp', 11);
  assert.ok(result.symbols.some(s => s.name === 'EngineStats' && s.type === 'class'));
  assert.ok(result.symbols.some(s => s.name === 'main' && s.type === 'function'));
  assert.strictEqual(result.cursorScope?.name, 'main');
});

test('ASTSlicer - extracts PHP, Ruby, Kotlin, Swift, and Zig symbols', () => {
  // PHP
  const phpCode = `<?php\nclass ApiRouter {\n    public function dispatch($req) {\n        return 200;\n    }\n}`;
  const phpRes = ASTSlicer.slice(phpCode, 'php', 3);
  assert.ok(phpRes.symbols.some(s => s.name === 'ApiRouter'));
  assert.ok(phpRes.symbols.some(s => s.name === 'dispatch'));

  // Ruby
  const rubyCode = `class OrderService\n  def calculate_total(items)\n    items.sum\n  end\nend`;
  const rubyRes = ASTSlicer.slice(rubyCode, 'ruby', 2);
  assert.ok(rubyRes.symbols.some(s => s.name === 'OrderService'));
  assert.ok(rubyRes.symbols.some(s => s.name === 'calculate_total'));

  // Kotlin
  const ktCode = `data class User(val id: Int)\nfun authenticateUser(token: String): Boolean {\n    return true\n}`;
  const ktRes = ASTSlicer.slice(ktCode, 'kotlin', 2);
  assert.ok(ktRes.symbols.some(s => s.name === 'User'));
  assert.ok(ktRes.symbols.some(s => s.name === 'authenticateUser'));

  // Swift
  const swiftCode = `struct DeviceInfo {\n    let uuid: String\n}\nfunc registerDevice() {\n    print("Registered")\n}`;
  const swiftRes = ASTSlicer.slice(swiftCode, 'swift', 4);
  assert.ok(swiftRes.symbols.some(s => s.name === 'DeviceInfo'));
  assert.ok(swiftRes.symbols.some(s => s.name === 'registerDevice'));

  // Zig
  const zigCode = `const std = @import("std");\npub fn calculate() u32 {\n    return 42;\n}`;
  const zigRes = ASTSlicer.slice(zigCode, 'zig', 2);
  assert.ok(zigRes.symbols.some(s => s.name === 'calculate'));
});
