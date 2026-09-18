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
