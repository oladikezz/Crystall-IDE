// ============================================================================
// Crystall IDE — Multi-Language AST & Syntax Slicer
// ============================================================================
// Extracts symbol trees, function/class signatures, import dependencies,
// and enclosing cursor scopes across Python, TypeScript, Lua, Rust, Go, and C++.

import { ASTNodeSummary, ASTSliceResult } from '../../types/ai';

export class ASTSlicer {
  /**
   * Slices and outlines the code structure of an active file.
   * @param code The complete source code of the file.
   * @param language Programming language identifier.
   * @param cursorLine 1-based line index of active user cursor (optional).
   */
  public static slice(code: string, language: string, cursorLine?: number): ASTSliceResult {
    const lines = code.split('\n');
    const symbols: ASTNodeSummary[] = [];

    const normLang = language.toLowerCase();

    if (normLang.includes('python') || normLang === 'py') {
      this.parsePython(lines, symbols);
    } else if (normLang.includes('typescript') || normLang.includes('javascript') || normLang === 'ts' || normLang === 'js' || normLang === 'tsx' || normLang === 'jsx') {
      this.parseTypeScript(lines, symbols);
    } else if (normLang.includes('lua')) {
      this.parseLua(lines, symbols);
    } else if (normLang.includes('rust') || normLang === 'rs') {
      this.parseRust(lines, symbols);
    } else if (normLang.includes('go')) {
      this.parseGo(lines, symbols);
    } else if (normLang.includes('java')) {
      this.parseJava(lines, symbols);
    } else if (normLang.includes('csharp') || normLang === 'cs' || normLang === 'c#') {
      this.parseCSharp(lines, symbols);
    } else if (normLang.includes('cpp') || normLang === 'c++' || normLang === 'c') {
      this.parseCAndCpp(lines, symbols);
    } else if (normLang.includes('php')) {
      this.parsePHP(lines, symbols);
    } else if (normLang.includes('ruby') || normLang === 'rb') {
      this.parseRuby(lines, symbols);
    } else if (normLang.includes('kotlin') || normLang === 'kt') {
      this.parseKotlin(lines, symbols);
    } else if (normLang.includes('swift')) {
      this.parseSwift(lines, symbols);
    } else if (normLang.includes('dart')) {
      this.parseDart(lines, symbols);
    } else if (normLang.includes('scala')) {
      this.parseScala(lines, symbols);
    } else if (normLang.includes('zig')) {
      this.parseZig(lines, symbols);
    } else if (normLang.includes('haskell') || normLang === 'hs') {
      this.parseHaskell(lines, symbols);
    } else {
      this.parseGeneric(lines, symbols);
    }

    // Determine if any symbol encloses the cursor line
    let cursorScope: ASTNodeSummary | undefined;
    if (cursorLine && cursorLine > 0) {
      for (const sym of symbols) {
        if (cursorLine >= sym.startLine && cursorLine <= sym.endLine) {
          sym.enclosesCursor = true;
          // Prefer narrower child scopes (functions/methods) over class container
          if (!cursorScope || (sym.endLine - sym.startLine < cursorScope.endLine - cursorScope.startLine)) {
            cursorScope = sym;
          }
        }
      }
    }

    const outlineText = this.formatOutline(symbols, cursorScope);

    return {
      language: normLang,
      symbols,
      cursorScope,
      outlineText
    };
  }

  // Python AST extraction: classes, functions, async functions, imports
  private static parsePython(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const lineNum = i + 1;

      // Imports
      if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      // Class
      const classMatch = line.match(/^(\s*)class\s+([A-Za-z0-9_]+)(?:\((.*?)\))?:/);
      if (classMatch) {
        const indent = classMatch[1].length;
        const endLine = this.findPythonBlockEnd(lines, i, indent);
        symbols.push({
          type: 'class',
          name: classMatch[2],
          signature: classMatch[0].trim(),
          startLine: lineNum,
          endLine
        });
        continue;
      }

      // Functions & Methods
      const fnMatch = line.match(/^(\s*)(?:async\s+)?def\s+([A-Za-z0-9_]+)\s*\((.*?)\)(?:\s*->\s*[^:]+)?:/);
      if (fnMatch) {
        const indent = fnMatch[1].length;
        const isMethod = indent > 0;
        const endLine = this.findPythonBlockEnd(lines, i, indent);
        symbols.push({
          type: isMethod ? 'method' : 'function',
          name: fnMatch[2],
          signature: fnMatch[0].trim(),
          startLine: lineNum,
          endLine
        });
      }
    }
  }

  private static findPythonBlockEnd(lines: string[], startIdx: number, baseIndent: number): number {
    for (let j = startIdx + 1; j < lines.length; j++) {
      const l = lines[j];
      if (!l.trim() || l.trim().startsWith('#')) continue;
      const curIndent = l.match(/^\s*/)?.[0].length || 0;
      if (curIndent <= baseIndent) {
        return j; // ends at previous non-empty line
      }
    }
    return lines.length;
  }

  // TypeScript/JavaScript AST: interfaces, classes, functions, arrow functions, methods
  private static parseTypeScript(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const lineNum = i + 1;

      // Imports
      if (trimmed.startsWith('import ') || trimmed.startsWith('export * from')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      // Interface / Type
      const ifaceMatch = trimmed.match(/^(?:export\s+)?(?:interface|type)\s+([A-Za-z0-9_]+)/);
      if (ifaceMatch) {
        symbols.push({
          type: 'interface',
          name: ifaceMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      // Class
      const classMatch = trimmed.match(/^(?:export\s+)?class\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        symbols.push({
          type: 'class',
          name: classMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      // Function & Exported const function
      const fnMatch = trimmed.match(/^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\((.*?)\)/);
      const arrowMatch = trimmed.match(/^(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\((.*?)\)\s*(?::\s*[^=]+)?=>/);
      if (fnMatch) {
        symbols.push({
          type: 'function',
          name: fnMatch[1],
          signature: fnMatch[0],
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      } else if (arrowMatch) {
        symbols.push({
          type: 'function',
          name: arrowMatch[1],
          signature: arrowMatch[0],
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // Lua AST: functions, local functions, module methods
  private static parseLua(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const lineNum = i + 1;

      // Requires / Imports
      if (trimmed.includes('require(')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      // Functions: function foo() or local function foo() or function Tab:Method()
      const fnMatch = trimmed.match(/^(?:local\s+)?function\s+([A-Za-z0-9_:.]+)\s*\((.*?)\)/);
      if (fnMatch) {
        symbols.push({
          type: 'function',
          name: fnMatch[1],
          signature: fnMatch[0],
          startLine: lineNum,
          endLine: this.findLuaEnd(lines, i)
        });
      }
    }
  }

  private static findLuaEnd(lines: string[], startIdx: number): number {
    let depth = 1;
    for (let j = startIdx + 1; j < lines.length; j++) {
      const t = lines[j].trim();
      if (t.match(/^(?:if|for|while|function)\b/)) {
        depth++;
      } else if (t === 'end' || t.startsWith('end ') || t.startsWith('end)')) {
        depth--;
        if (depth === 0) return j + 1;
      }
    }
    return lines.length;
  }

  // Rust AST: structs, impls, fns
  private static parseRust(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;
      const fnMatch = trimmed.match(/^(?:pub\s+)?(?:async\s+)?fn\s+([A-Za-z0-9_]+)/);
      if (fnMatch) {
        symbols.push({
          type: 'function',
          name: fnMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // Go AST: funcs, types
  private static parseGo(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;
      const fnMatch = trimmed.match(/^func\s+(?:\(.*?\)\s+)?([A-Za-z0-9_]+)/);
      if (fnMatch) {
        symbols.push({
          type: 'function',
          name: fnMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // Java AST: packages, imports, classes, records, interfaces, methods
  private static parseJava(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('package ') || trimmed.startsWith('import ')) {
        symbols.push({
          type: 'import',
          name: trimmed.replace(/^(package|import)\s+/, '').replace(/;$/, '').slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const classMatch = trimmed.match(/^(?:public\s+|protected\s+|private\s+)?(?:abstract\s+|final\s+|static\s+)?(class|interface|record|enum)\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        symbols.push({
          type: classMatch[1] === 'interface' ? 'interface' : 'class',
          name: classMatch[2],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      const methodMatch = trimmed.match(/^(?:public|protected|private|static|final|synchronized|abstract|\s)+[\w<>\[\], ?]+\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*(?:throws\s+[\w,\s]+)?\s*\{?/);
      if (methodMatch && !trimmed.startsWith('if') && !trimmed.startsWith('while') && !trimmed.startsWith('for') && !trimmed.startsWith('switch')) {
        symbols.push({
          type: 'method',
          name: methodMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // C# AST: namespaces, usings, classes, interfaces, structs, methods
  private static parseCSharp(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('using ') || trimmed.startsWith('namespace ')) {
        symbols.push({
          type: 'import',
          name: trimmed.replace(/^(using|namespace)\s+/, '').replace(/;$/, '').slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const classMatch = trimmed.match(/^(?:public\s+|protected\s+|private\s+|internal\s+)?(?:abstract\s+|sealed\s+|static\s+)?(class|interface|struct|record)\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        symbols.push({
          type: classMatch[1] === 'interface' ? 'interface' : 'class',
          name: classMatch[2],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      const methodMatch = trimmed.match(/^(?:public|protected|private|internal|static|async|override|virtual|\s)+[\w<>\[\], ?]+\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{?/);
      if (methodMatch && !trimmed.startsWith('if') && !trimmed.startsWith('while') && !trimmed.startsWith('for') && !trimmed.startsWith('switch')) {
        symbols.push({
          type: 'method',
          name: methodMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // C & C++ AST: includes, structs, classes, functions
  private static parseCAndCpp(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('#include') || trimmed.startsWith('using namespace')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const structOrClass = trimmed.match(/^(?:typedef\s+)?(class|struct|namespace)\s+([A-Za-z0-9_]+)/);
      if (structOrClass) {
        symbols.push({
          type: 'class',
          name: structOrClass[2],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      const fnMatch = trimmed.match(/^(?:[\w:*&<>]+\s+)+([A-Za-z0-9_]+)\s*\([^;]*\)\s*(?:const)?\s*\{?/);
      if (fnMatch && !trimmed.startsWith('if') && !trimmed.startsWith('while') && !trimmed.startsWith('for') && !trimmed.startsWith('switch') && !trimmed.startsWith('return')) {
        symbols.push({
          type: 'function',
          name: fnMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // PHP AST: namespaces, classes, functions
  private static parsePHP(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('use ') || trimmed.startsWith('namespace ')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const classMatch = trimmed.match(/^(?:abstract\s+|final\s+)?(class|interface|trait)\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        symbols.push({
          type: classMatch[1] === 'interface' ? 'interface' : 'class',
          name: classMatch[2],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      const fnMatch = trimmed.match(/^(?:public\s+|protected\s+|private\s+|static\s+)*function\s+([A-Za-z0-9_]+)\s*\(/);
      if (fnMatch) {
        symbols.push({
          type: 'function',
          name: fnMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // Ruby AST: classes, modules, defs
  private static parseRuby(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('require ') || trimmed.startsWith('require_relative ')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const classMatch = trimmed.match(/^(?:class|module)\s+([A-Za-z0-9_:]+)/);
      if (classMatch) {
        symbols.push({
          type: 'class',
          name: classMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findRubyEnd(lines, i)
        });
        continue;
      }

      const defMatch = trimmed.match(/^def\s+([A-Za-z0-9_.:!?]+)/);
      if (defMatch) {
        symbols.push({
          type: 'function',
          name: defMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findRubyEnd(lines, i)
        });
      }
    }
  }

  private static findRubyEnd(lines: string[], startIdx: number): number {
    let depth = 1;
    for (let j = startIdx + 1; j < lines.length; j++) {
      const t = lines[j].trim();
      if (t.match(/^(?:class|module|def|if|unless|while|until|case)\b/) || t.endsWith(' do')) {
        depth++;
      } else if (t === 'end' || t.startsWith('end ') || t.startsWith('end)')) {
        depth--;
        if (depth === 0) return j + 1;
      }
    }
    return lines.length;
  }

  // Kotlin AST: packages, classes, funs
  private static parseKotlin(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('package ') || trimmed.startsWith('import ')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const classMatch = trimmed.match(/^(?:data\s+|sealed\s+|open\s+)?(class|interface|object)\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        symbols.push({
          type: classMatch[1] === 'interface' ? 'interface' : 'class',
          name: classMatch[2],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      const funMatch = trimmed.match(/^fun\s+([A-Za-z0-9_]+)/);
      if (funMatch) {
        symbols.push({
          type: 'function',
          name: funMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // Swift AST: imports, structs, classes, funcs
  private static parseSwift(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('import ')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const classMatch = trimmed.match(/^(?:public\s+|open\s+|final\s+)?(class|struct|protocol|extension|enum)\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        symbols.push({
          type: classMatch[1] === 'protocol' ? 'interface' : 'class',
          name: classMatch[2],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      const funcMatch = trimmed.match(/^(?:public\s+|private\s+|static\s+|mutating\s+)*func\s+([A-Za-z0-9_]+)/);
      if (funcMatch) {
        symbols.push({
          type: 'function',
          name: funcMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // Dart AST: imports, classes, functions
  private static parseDart(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('import ') || trimmed.startsWith('export ')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const classMatch = trimmed.match(/^(?:abstract\s+)?class\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        symbols.push({
          type: 'class',
          name: classMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      const fnMatch = trimmed.match(/^(?:void|Future<[^>]+>|[\w<>]+)\s+([A-Za-z0-9_]+)\s*\(/);
      if (fnMatch && !trimmed.startsWith('if') && !trimmed.startsWith('for')) {
        symbols.push({
          type: 'function',
          name: fnMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // Scala AST: objects, classes, defs
  private static parseScala(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('package ') || trimmed.startsWith('import ')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const objMatch = trimmed.match(/^(?:case\s+)?(class|object|trait|enum)\s+([A-Za-z0-9_]+)/);
      if (objMatch) {
        symbols.push({
          type: objMatch[1] === 'trait' ? 'interface' : 'class',
          name: objMatch[2],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
        continue;
      }

      const defMatch = trimmed.match(/^def\s+([A-Za-z0-9_]+)/);
      if (defMatch) {
        symbols.push({
          type: 'function',
          name: defMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // Zig AST: const, pub fn
  private static parseZig(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.includes('@import(')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const fnMatch = trimmed.match(/^(?:pub\s+)?fn\s+([A-Za-z0-9_]+)/);
      if (fnMatch) {
        symbols.push({
          type: 'function',
          name: fnMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: this.findBraceBlockEnd(lines, i)
        });
      }
    }
  }

  // Haskell AST: data, type, function signatures
  private static parseHaskell(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;

      if (trimmed.startsWith('module ') || trimmed.startsWith('import ')) {
        symbols.push({
          type: 'import',
          name: trimmed.slice(0, 40),
          signature: trimmed,
          startLine: lineNum,
          endLine: lineNum
        });
        continue;
      }

      const dataMatch = trimmed.match(/^(?:data|type|newtype)\s+([A-Za-z0-9_]+)/);
      if (dataMatch) {
        symbols.push({
          type: 'class',
          name: dataMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: lineNum + 4
        });
        continue;
      }

      const sigMatch = trimmed.match(/^([a-z][A-Za-z0-9_]*)\s*::/);
      if (sigMatch) {
        symbols.push({
          type: 'function',
          name: sigMatch[1],
          signature: trimmed.slice(0, 60),
          startLine: lineNum,
          endLine: lineNum + 4
        });
      }
    }
  }

  // Generic fallback: looks for standard function / class declarations
  private static parseGeneric(lines: string[], symbols: ASTNodeSummary[]) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lineNum = i + 1;
      if (trimmed.match(/^(?:def|function|fn|func|class)\s+([A-Za-z0-9_]+)/)) {
        symbols.push({
          type: 'function',
          name: trimmed.split(' ')[1] || 'symbol',
          signature: trimmed.slice(0, 50),
          startLine: lineNum,
          endLine: lineNum + 10
        });
      }
    }
  }

  private static findBraceBlockEnd(lines: string[], startIdx: number): number {
    let depth = 0;
    let foundOpen = false;
    for (let j = startIdx; j < lines.length; j++) {
      const line = lines[j];
      for (const char of line) {
        if (char === '{') {
          depth++;
          foundOpen = true;
        } else if (char === '}') {
          depth--;
          if (foundOpen && depth <= 0) {
            return j + 1;
          }
        }
      }
    }
    return lines.length;
  }

  private static formatOutline(symbols: ASTNodeSummary[], cursorScope?: ASTNodeSummary): string {
    if (symbols.length === 0) return 'No distinct syntax symbols detected.';

    const nonImports = symbols.filter(s => s.type !== 'import');
    const imports = symbols.filter(s => s.type === 'import');

    const lines: string[] = [];
    if (imports.length > 0) {
      lines.push(`Dependencies: ${imports.length} imports detected`);
    }

    if (cursorScope) {
      lines.push(`Active Cursor Scope: [${cursorScope.type.toUpperCase()}] ${cursorScope.name} (Lines ${cursorScope.startLine}-${cursorScope.endLine})`);
    }

    lines.push('Declared Symbols:');
    for (const sym of nonImports.slice(0, 15)) {
      const marker = sym.enclosesCursor ? ' [ACTIVE EDIT FOCUS]' : '';
      lines.push(`  - [${sym.type}] ${sym.name} (L${sym.startLine}-${sym.endLine})${marker}`);
    }
    if (nonImports.length > 15) {
      lines.push(`  ... and ${nonImports.length - 15} more symbols`);
    }

    return lines.join('\n');
  }
}
