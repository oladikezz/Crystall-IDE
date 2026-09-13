import React, { useState, useRef, useEffect } from 'react';
import { CrystallLogo } from "./CrystallLogo";
import { CrystallThemeId, InjectorStatus, SupportedLanguage } from '../types';
import { CRYSTALL_THEMES, resolveTheme, FIGMA_THEMES } from '../data/themes';
import { SUPPORTED_LANGUAGES } from '../data/constants';
import { Check, ChevronUp } from 'lucide-react';

interface StatusBarProps {
  lastAction: string;
  execTime: number;
  activeLanguage: string;
  onChangeLanguage?: (language: string) => void;
  activeTheme: CrystallThemeId;
  onSelectTheme: (id: CrystallThemeId) => void;
  injectorStatus?: InjectorStatus;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  lastAction,
  execTime,
  activeLanguage,
  onChangeLanguage,
  activeTheme,
  onSelectTheme,
  injectorStatus = 'unattached'
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const langRef = useRef<HTMLDivElement>(null);
  const currentTheme = resolveTheme(activeTheme);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const currentLangMeta = SUPPORTED_LANGUAGES.find(l => l.id === activeLanguage) || {
    id: activeLanguage as SupportedLanguage,
    name: activeLanguage.toUpperCase(),
    color: '#0284c7'
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.id.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <div 
      className="h-[28px] border-t px-3 flex items-center justify-between select-none text-[11px] font-sans shrink-0 transition-colors z-30 relative"
      style={{
        backgroundColor: 'var(--bg-statusbar)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-secondary)'
      }}
    >
      {/* Left: Last Action & Engine Runtime Status Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <CrystallLogo size={12} />
          <button
            onClick={cycleTheme}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans border hover:brightness-125 transition-all cursor-pointer mr-1"
            style={{
              backgroundColor: 'var(--status-badge-bg)',
              color: 'var(--status-badge-text)',
              borderColor: 'var(--status-badge-border)'
            }}
            title="Тема оформления Figma — нажмите для переключения (4 темы)"
          >
            <span className="font-medium">{currentTheme.name}</span>
          </button>
          <span className="text-zinc-500">Last Action:</span>
          <span className="font-mono text-zinc-300">{lastAction}</span>
        </div>

        {/* Runtime / Environment Pill */}
        <div 
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border"
          style={{
            backgroundColor: 'var(--status-badge-bg)',
            color: 'var(--status-badge-text)',
            borderColor: 'var(--status-badge-border)'
          }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full animate-pulse" 
            style={{ 
              backgroundColor: injectorStatus === 'injected' ? '#10b981' : 'var(--accent-primary)' 
            }} 
          />
          <span>
            {injectorStatus === 'injected' 
              ? 'Runtime: Connected' 
              : injectorStatus === 'injecting' 
                ? 'Hooking Runtime...' 
                : 'Universal IDE (Node/Py/Lua)'}
          </span>
        </div>
      </div>

      {/* Right: Language Selector, Encoding, Theme, Metrics */}
      <div className="flex items-center gap-2.5">
        
        {/* Interactive Language Selector Dropdown */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer text-zinc-300 hover:text-white"
            title="Select Language Mode"
          >
            <span 
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: currentLangMeta.color }}
            />
            <span className="font-medium">{currentLangMeta.name}</span>
            <ChevronUp className="w-2.5 h-2.5 text-zinc-500" />
          </button>

          {isLangOpen && (
            <div 
              className="absolute right-0 bottom-full mb-1 w-48 rounded-lg border shadow-2xl p-1 text-xs z-50 font-sans backdrop-blur-md"
              style={{
                backgroundColor: 'var(--bg-modal)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="px-2 py-1 border-b mb-1" style={{ borderColor: 'var(--border-color)' }}>
                <input
                  type="text"
                  placeholder="Select Language..."
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  className="w-full bg-transparent text-[11px] outline-none text-zinc-200 placeholder-zinc-500"
                  autoFocus
                />
              </div>

              <div className="max-h-52 overflow-y-auto space-y-0.5 scrollbar-thin">
                {filteredLanguages.map((lang) => {
                  const isSelected = activeLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => {
                        if (onChangeLanguage) onChangeLanguage(lang.id);
                        setIsLangOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1 rounded transition-colors text-left cursor-pointer hover:bg-white/5"
                      style={{
                        backgroundColor: isSelected ? 'var(--hover-bg)' : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full shrink-0" 
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="text-xs">{lang.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <span className="text-zinc-700">|</span>

        <span className="text-zinc-500 font-mono text-[10px]">UTF-8</span>

        <span className="text-zinc-700">|</span>

        {/* Theme cycle */}
        <button
          onClick={cycleTheme}
          className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
          title="Сменить тему оформления (4 темы)"
        >
          <span 
            className="w-2 h-2 rounded-full border border-black/20"
            style={{ backgroundColor: currentTheme.previewColors.accent }}
          />
          <span className="text-zinc-500">Тема:</span>
          <span style={{ color: 'var(--text-primary)' }}>{currentTheme.name}</span>
        </button>

        <span className="text-zinc-700">|</span>

        <div className="flex items-center gap-1">
          <span className="text-zinc-500">Time:</span>
          <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{execTime}ms</span>
        </div>

        <span className="text-zinc-700">|</span>

        <div className="flex items-center gap-1">
          <span className="text-zinc-500">FPS:</span>
          <span className="font-mono text-emerald-400">60</span>
        </div>
      </div>
    </div>
  );
};