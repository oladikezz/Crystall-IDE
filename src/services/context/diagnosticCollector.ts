// ============================================================================
// Crystall IDE — Monaco LSP Diagnostic & Compiler Marker Collector
// ============================================================================
// Extracts live compiler, linter, and Language Server Protocol (LSP) diagnostic
// markers from Monaco Editor and formats them into structured prompt context.

import { DiagnosticItem } from '../../types/ai';

export class DiagnosticCollector {
  /**
   * Translates raw Monaco editor markers into standardized DiagnosticItem models.
   */
  public static fromMonacoMarkers(markers: any[], fileContent?: string): DiagnosticItem[] {
    if (!Array.isArray(markers) || markers.length === 0) return [];

    const lines = fileContent ? fileContent.split('\n') : [];

    return markers.map(m => {
      let severity: DiagnosticItem['severity'] = 'info';
      // Monaco MarkerSeverity: 8 = Error, 4 = Warning, 2 = Info, 1 = Hint
      if (m.severity === 8 || m.severity === 'error' || m.severity === 'Error') {
        severity = 'error';
      } else if (m.severity === 4 || m.severity === 'warning' || m.severity === 'Warning') {
        severity = 'warning';
      }

      const startLine = m.startLineNumber || m.lineNumber || 1;
      let codeSnippet: string | undefined;

      if (lines.length > 0 && startLine <= lines.length) {
        // Capture 1 line before, offending line, and 1 line after
        const prev = startLine > 1 ? `  L${startLine - 1}: ${lines[startLine - 2]}\n` : '';
        const curr = `> L${startLine}: ${lines[startLine - 1]}\n`;
        const next = startLine < lines.length ? `  L${startLine + 1}: ${lines[startLine]}` : '';
        codeSnippet = `${prev}${curr}${next}`;
      }

      return {
        message: m.message || 'Unknown diagnostic error',
        severity,
        startLineNumber: startLine,
        startColumn: m.startColumn || 1,
        endLineNumber: m.endLineNumber || startLine,
        endColumn: m.endColumn || 1,
        codeSnippet,
        source: m.source || 'LSP'
      };
    });
  }

  /**
   * Formats diagnostics into a high-signal Markdown prompt block for the LLM.
   */
  public static formatForPrompt(diagnostics: DiagnosticItem[]): string {
    if (diagnostics.length === 0) return '';

    const errors = diagnostics.filter(d => d.severity === 'error');
    const warnings = diagnostics.filter(d => d.severity === 'warning');

    const sections: string[] = [
      `### ⚠️ Live Compiler & Language Server Diagnostics (${errors.length} Errors, ${warnings.length} Warnings):`
    ];

    // List errors first
    const criticals = [...errors, ...warnings].slice(0, 5); // cap at 5 to protect budget

    for (let i = 0; i < criticals.length; i++) {
      const d = criticals[i];
      const tag = d.severity.toUpperCase();
      sections.push(
        `[${tag}] Line ${d.startLineNumber}:${d.startColumn} - ${d.message}`
      );
      if (d.codeSnippet) {
        sections.push(`\`\`\`\n${d.codeSnippet}\n\`\`\``);
      }
    }

    if (diagnostics.length > 5) {
      sections.push(`... and ${diagnostics.length - 5} additional minor warnings.`);
    }

    return sections.join('\n');
  }
}
