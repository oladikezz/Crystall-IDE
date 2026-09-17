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
            className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center border group-hover:border-orange-500/50 transition-colors"
            style={{
              backgroundColor: 'var(--hover-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <CrystallLogo size={13} />
          </div>
          <span className="font-mono text-[11px] group-hover:text-orange-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
            Crystall IDE
          </span>
        </a>

        {/* Open Source Pill Badge */}
        <span 
          className="font-mono text-[10px] px-1.5 py-0.5 rounded border select-none"
          style={{ 
            backgroundColor: 'var(--hover-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)'
          }}
        >
          &lt;open-source&gt;
        </span>
      </div>

      {/* Right: Total lines | Execution Time | FPS | Theme Switcher */}
      <div className="flex items-center gap-4 text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex items-center gap-1">
          <span style={{ color: 'var(--text-muted)' }}>Total Lines:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{lineCount}</span>
        </div>

        <div className="flex items-center gap-1">
          <span style={{ color: 'var(--text-muted)' }}>Execution Time:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{execTime}s</span>
        </div>

        <div className="flex items-center gap-1">
          <span style={{ color: 'var(--text-muted)' }}>FPS:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>60</span>
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