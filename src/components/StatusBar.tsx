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
      {/* Left: 1.me/j8dsgn + Premium > matching Figma 1:1 */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <div 
            className="w-4 h-4 rounded-[4px] flex items-center justify-center bg-black/60 border border-white/10 text-white"
          >
            <CrystallLogo size={10} />
          </div>
          <span className="font-mono text-[11px] text-zinc-400 hover:text-white cursor-pointer transition-colors">
            1.me/j8dsgn
          </span>
        </div>

        {/* Orange Premium > Pill Badge */}
        <button
          onClick={() => alert('J8Dsgn Premium Active')}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <span>Premium</span>
          <span className="text-[9px] font-bold">&gt;</span>
        </button>
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