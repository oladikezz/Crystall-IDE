import React from 'react';
import { CrystallLogo } from "./CrystallLogo";
import { CrystallThemeId, InjectorStatus } from '../types';
import { resolveTheme } from '../data/themes';

interface StatusBarProps {
  lastAction: string;
  execTime: number;
  activeLanguage: string;
  onChangeLanguage?: (language: string) => void;
  activeTheme: CrystallThemeId;
  onSelectTheme: (id: CrystallThemeId) => void;
  injectorStatus?: InjectorStatus;
  lineCount?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeTheme,
  onSelectTheme,
  lineCount = 19,
  execTime = 1215
}) => {
  const currentTheme = resolveTheme(activeTheme);

  const cycleTheme = () => {
    const figmaOrder: CrystallThemeId[] = [
      'dark-solid',
      'dark-transparent',
      'light-solid',
      'light-transparent'
    ];
    const resolvedId = currentTheme.id;
    const curIndex = figmaOrder.indexOf(resolvedId);
    const nextIdx = (curIndex + 1) % figmaOrder.length;
    onSelectTheme(figmaOrder[nextIdx]);
  };

  return (
    <div 
      className="h-[28px] border-t px-3 flex items-center justify-between select-none text-[11px] font-sans shrink-0 transition-colors z-30 relative"
      style={{
        backgroundColor: 'var(--bg-statusbar)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-secondary)'
      }}
    >
      {/* Left: Crystall IDE + Open Source badge (No Premium - 100% Open Source) */}
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/oladikezz/Crystall-IDE"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 cursor-pointer group text-inherit no-underline"
          title="GitHub: oladikezz/Crystall-IDE"
        >
          <div 
            className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center bg-black/60 border border-white/10 text-white group-hover:border-orange-500/50 transition-colors"
          >
            <CrystallLogo size={13} />
          </div>
          <span className="font-mono text-[11px] text-zinc-300 group-hover:text-white transition-colors">
            Crystall IDE
          </span>
        </a>

        {/* Open Source Pill Badge */}
        <span 
          className="font-mono text-[10px] px-1.5 py-0.5 rounded border select-none"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)'
          }}
        >
          &lt;open-source&gt;
        </span>
      </div>

      {/* Right: Total lines | Execution Time | FPS | Theme Switcher */}
      <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-1">
          <span className="text-zinc-500">Total Lines:</span>
          <span className="text-zinc-300 font-medium">{lineCount}</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-zinc-500">Execution Time:</span>
          <span className="text-zinc-300 font-medium">{execTime}s</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-zinc-500">FPS:</span>
          <span className="text-zinc-300 font-medium">60</span>
        </div>

        {/* Theme badge toggle */}
        <button
          onClick={cycleTheme}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans border hover:brightness-125 transition-all cursor-pointer"
          style={{
            backgroundColor: 'var(--status-badge-bg)',
            color: 'var(--status-badge-text)',
            borderColor: 'var(--status-badge-border)'
          }}
          title="Figma Theme: Click to switch between 4 themes"
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
          <span className="font-medium">{currentTheme.name}</span>
        </button>
      </div>
    </div>
  );
};