import React, { useState } from 'react';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle,
  Palette,
  Key,
  Sliders,
  Volume2,
  VolumeX,
  Code2,
  Sparkles,
  Layers
} from 'lucide-react';
import { AIProvider, AllConfigs, ProviderConfig, CrystallThemeId, EditorSettings } from '../types';
import { PROVIDER_LABELS } from '../data/constants';
import { resolveTheme } from '../data/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  configs: AllConfigs;
  onSaveConfigs: (newConfigs: AllConfigs) => void;
  activeProvider: AIProvider;
  onChangeActiveProvider: (provider: AIProvider) => void;
  activeTheme: CrystallThemeId;
  onSelectTheme: (themeId: CrystallThemeId) => void;
  editorSettings: EditorSettings;
  onUpdateEditorSettings: (settings: Partial<EditorSettings>) => void;
}

const MODEL_PRESETS: Record<AIProvider, string[]> = {
  deepseek: ['deepseek-reasoner', 'deepseek-chat'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1'],
  anthropic: ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
  gemini: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'],
  groq: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'],
  openrouter: [
    'deepseek/deepseek-chat',
    'deepseek/deepseek-r1',
    'anthropic/claude-3.7-sonnet',
    'openai/gpt-4o',
    'google/gemini-2.0-flash-001',
    'meta-llama/llama-3.3-70b-instruct',
    'deepseek/deepseek-r1:free'
  ],
  ollama: ['llama3:latest', 'deepseek-r1:latest', 'qwen2.5-coder:latest', 'codellama:latest'],
  llamacpp: ['default', 'llama-3-8b-instruct', 'mistral-7b-instruct', 'qwen2.5-coder-7b'],
  custom: ['custom-model']
};

interface ThemeCardData {
  id: CrystallThemeId;
  name: string;
  badge: string;
  desc: string;
  isGlass: boolean;
  isLight: boolean;
  accent: string;
  preview: {
    bg: string;
    header: string;
    editor: string;
    sidebar: string;
    border: string;
    codeLines: Array<{ color: string; width: string }>;
  };
}

const FIGMA_THEME_CARDS: ThemeCardData[] = [
  {
    id: 'dark-solid',
    name: 'Черный обычный',
    badge: 'Обсидиан',
    desc: 'Классический тёмный интерфейс без прозрачности',
    isGlass: false,
    isLight: false,
    accent: '#f97316',
    preview: {
      bg: '#0b0d13',
      header: '#0e1017',
      editor: '#0c0e14',
      sidebar: '#0f1118',
      border: '#1c202d',
      codeLines: [
        { color: '#f97316', width: '38%' },
        { color: '#60a5fa', width: '65%' },
        { color: '#34d399', width: '50%' },
        { color: '#9ca3af', width: '30%' }
      ]
    }
  },
  {
    id: 'dark-transparent',
    name: 'Черный прозрачный',
    badge: 'iOS Liquid Glass',
    desc: 'Ультра-прозрачное жидкое стекло в стиле iOS',
    isGlass: true,
    isLight: false,
    accent: '#f97316',
    preview: {
      bg: 'rgba(10, 14, 23, 0.45)',
      header: 'rgba(255, 255, 255, 0.08)',
      editor: 'rgba(255, 255, 255, 0.03)',
      sidebar: 'rgba(0, 0, 0, 0.25)',
      border: 'rgba(255, 255, 255, 0.20)',
      codeLines: [
        { color: '#f97316', width: '42%' },
        { color: '#38bdf8', width: '70%' },
        { color: '#4ade80', width: '54%' },
        { color: '#cbd5e1', width: '32%' }
      ]
    }
  },
  {
    id: 'light-solid',
    name: 'Белый обычный',
    badge: 'Чистый белый',
    desc: 'Оригинальная дневная светлая тема из Figma',
    isGlass: false,
    isLight: true,
    accent: '#ea580c',
    preview: {
      bg: '#ffffff',
      header: '#f8fafc',
      editor: '#ffffff',
      sidebar: '#f1f5f9',
      border: '#e2e8f0',
      codeLines: [
        { color: '#ea580c', width: '38%' },
        { color: '#2563eb', width: '62%' },
        { color: '#16a34a', width: '48%' },
        { color: '#64748b', width: '28%' }
      ]
    }
  },
  {
    id: 'light-transparent',
    name: 'Белый прозрачный',
    badge: 'iOS Frosted Glass',
    desc: 'Светлое ультра-прозрачное стекло в стиле iOS',
    isGlass: true,
    isLight: true,
    accent: '#ea580c',
    preview: {
      bg: 'rgba(255, 255, 255, 0.60)',
      header: 'rgba(255, 255, 255, 0.35)',
      editor: 'rgba(255, 255, 255, 0.20)',
      sidebar: 'rgba(255, 255, 255, 0.40)',
      border: 'rgba(255, 255, 255, 0.65)',
      codeLines: [
        { color: '#ea580c', width: '40%' },
        { color: '#0284c7', width: '66%' },
        { color: '#059669', width: '52%' },
        { color: '#475569', width: '30%' }
      ]
    }
  }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  configs,
  onSaveConfigs,
  activeProvider,
  onChangeActiveProvider,
  activeTheme,
  onSelectTheme,
  editorSettings,
  onUpdateEditorSettings
}) => {
  const [activeSection, setActiveSection] = useState<'editor' | 'appearance' | 'providers'>('appearance');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(activeProvider);
  const [localConfigs, setLocalConfigs] = useState<AllConfigs>(configs);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const resolvedTheme = resolveTheme(activeTheme);
  const isGlass = activeTheme.includes('transparent');
  const isLight = activeTheme.includes('light');

  const currentCfg = localConfigs[selectedProvider] || { apiKey: '', baseUrl: '', model: '' };
  const providerMeta = PROVIDER_LABELS[selectedProvider] || { name: selectedProvider, badge: '' };

  const updateConfig = (field: keyof ProviderConfig, value: any) => {
    setLocalConfigs((prev) => ({
      ...prev,
      [selectedProvider]: {
        ...prev[selectedProvider],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSaveConfigs(localConfigs);
    onChangeActiveProvider(selectedProvider);
    onClose();
  };

  const handleTestKey = async () => {
    setTestStatus('testing');
    setTestMessage('Проверка подключения...');

    if (!currentCfg.apiKey && selectedProvider !== 'ollama') {
      setTimeout(() => {
        setTestStatus('success');
        setTestMessage('Офлайн-режим симулятора готов');
      }, 300);
      return;
    }

    try {
      const baseUrl = (currentCfg.baseUrl || 'https://api.openai.com/v1').replace(/\/$/, '');
      let testUrl = `${baseUrl}/models`;
      const headers: Record<string, string> = {};

      if (selectedProvider === 'anthropic') {
        testUrl = `${baseUrl}/messages`;
        headers['x-api-key'] = currentCfg.apiKey;
        headers['anthropic-version'] = '2023-06-01';
        headers['dangerously-allow-browser'] = 'true';
      } else if (selectedProvider === 'gemini') {
        testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${currentCfg.apiKey}`;
      } else {
        headers['Authorization'] = `Bearer ${currentCfg.apiKey}`;
      }

      const res = await fetch(testUrl, { method: 'GET', headers });
      if (res.ok || res.status === 400) {
        setTestStatus('success');
        setTestMessage(`Подключено (HTTP ${res.status})`);
      } else {
        setTestStatus('failed');
        setTestMessage(`Ошибка HTTP ${res.status}`);
      }
    } catch (e: any) {
      setTestStatus('failed');
      setTestMessage(e.message || 'Ошибка сети');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-sans transition-colors duration-200"
      style={{
        backgroundColor: 'var(--modal-overlay)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Shell */}
      <div 
        className="w-full max-w-[740px] h-[575px] rounded-2xl flex flex-col overflow-hidden border transition-all duration-200 relative"
        style={{
          backgroundColor: isGlass 
            ? (isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(12, 16, 25, 0.65)')
            : (isLight ? '#ffffff' : '#0e1017'),
          borderColor: isGlass
            ? (isLight ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.14)')
            : (isLight ? '#e2e8f0' : '#1c202d'),
          boxShadow: isGlass
            ? (isLight 
                ? 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), inset 0 0 0 1px rgba(255, 255, 255, 0.40), 0 25px 60px -15px rgba(0, 0, 0, 0.25)' 
                : 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.10), 0 25px 60px -15px rgba(0, 0, 0, 0.70)')
            : (isLight 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.18)' 
                : '0 25px 50px -12px rgba(0, 0, 0, 0.85)'),
          backdropFilter: isGlass ? 'blur(40px) saturate(190%) contrast(108%)' : 'none',
          WebkitBackdropFilter: isGlass ? 'blur(40px) saturate(190%) contrast(108%)' : 'none',
          color: 'var(--text-primary)'
        }}
      >
        {/* iOS Glass Specular Top Highlight */}
        {isGlass && (
          <div 
            className="absolute top-0 inset-x-0 h-[1px] pointer-events-none z-30"
            style={{
              background: isLight 
                ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%)' 
                : 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.40) 50%, rgba(255,255,255,0) 100%)'
            }}
          />
        )}

        {/* Modal Header */}
        <div 
          className="h-12 border-b px-5 flex items-center justify-between shrink-0 relative z-20"
          style={{
            backgroundColor: isGlass
              ? (isLight ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.04)')
              : (isLight ? '#f8fafc' : '#12151f'),
            borderColor: isGlass
              ? (isLight ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.08)')
              : (isLight ? '#e2e8f0' : '#1c202d')
          }}
        >
          <div className="flex items-center gap-2 text-xs">
            <div 
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{
                backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
              }}
            >
              <Settings className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Настройки
            </span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              {activeSection === 'editor' && 'Редактор кода'}
              {activeSection === 'appearance' && 'Внешний вид'}
              {activeSection === 'providers' && 'AI & Модели'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.07)',
              color: 'var(--text-muted)'
            }}
            title="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden min-h-0 relative z-10">
          
          {/* Main Navigation Sidebar */}
          <div 
            className="w-48 border-r p-3 space-y-1 overflow-y-auto shrink-0 flex flex-col justify-between"
            style={{
              backgroundColor: isGlass
                ? (isLight ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.18)')
                : (isLight ? '#f8fafc' : '#0b0d13'),
              borderColor: isGlass
                ? (isLight ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.08)')
                : (isLight ? '#e2e8f0' : '#1c202d')
            }}
          >
            <div className="space-y-1">
              <span 
                className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 block"
                style={{ color: 'var(--text-muted)' }}
              >
                Разделы
              </span>

              {/* Editor Tab */}
              <button
                onClick={() => setActiveSection('editor')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left cursor-pointer ${
                  activeSection === 'editor'
                    ? 'font-medium shadow-sm'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: activeSection === 'editor'
                    ? (isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)')
                    : 'transparent',
                  color: activeSection === 'editor' ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                <Sliders className="w-4 h-4 shrink-0" style={{ color: activeSection === 'editor' ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <span>Редактор кода</span>
              </button>
              
              {/* Appearance Tab */}
              <button
                onClick={() => setActiveSection('appearance')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left cursor-pointer ${
                  activeSection === 'appearance'
                    ? 'font-medium shadow-sm'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: activeSection === 'appearance'
                    ? (isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)')
                    : 'transparent',
                  color: activeSection === 'appearance' ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                <Palette className="w-4 h-4 shrink-0" style={{ color: activeSection === 'appearance' ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <span>Внешний вид</span>
              </button>

              {/* AI Providers Tab */}
              <button
                onClick={() => setActiveSection('providers')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left cursor-pointer ${
                  activeSection === 'providers'
                    ? 'font-medium shadow-sm'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: activeSection === 'providers'
                    ? (isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)')
                    : 'transparent',
                  color: activeSection === 'providers' ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                <Key className="w-4 h-4 shrink-0" style={{ color: activeSection === 'providers' ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <span>AI & Модели</span>
              </button>
            </div>

            {/* Providers Sub-list if in providers section */}
            {activeSection === 'providers' && (
              <div 
                className="pt-2 border-t mt-2 space-y-0.5" 
                style={{ 
                  borderColor: isGlass ? 'rgba(255,255,255,0.08)' : 'var(--border-color)' 
                }}
              >
                <span className="text-[9px] uppercase tracking-wider px-2 py-1 block font-medium" style={{ color: 'var(--text-muted)' }}>
                  Провайдеры
                </span>
                {(Object.keys(PROVIDER_LABELS) as AIProvider[]).map((p) => {
                  const meta = PROVIDER_LABELS[p];
                  const isSelected = selectedProvider === p;
                  const hasKey = !!localConfigs[p]?.apiKey || p === 'ollama';

                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setSelectedProvider(p);
                        setTestStatus('idle');
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] transition-colors text-left cursor-pointer ${
                        isSelected
                          ? 'font-semibold'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? (isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)')
                          : 'transparent',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}
                    >
                      <span className="truncate">{meta.name}</span>
                      {hasKey && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settings Content Area */}
          <div 
            className="flex-1 p-6 overflow-y-auto"
            style={{ 
              backgroundColor: 'transparent'
            }}
          >
            {/* SECTION 1: APPEARANCE / 4 FIGMA THEMES */}
            {activeSection === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Внешний вид
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Выберите цветовую тему интерфейса Crystall IDE
                  </p>
                </div>

                {/* 4 Figma Theme Cards with Miniature Window Previews */}
                <div className="grid grid-cols-2 gap-3.5 pt-1">
                  {FIGMA_THEME_CARDS.map((thm) => {
                    const isSelected = activeTheme === thm.id;
                    return (
                      <div
                        key={thm.id}
                        onClick={() => onSelectTheme(thm.id)}
                        className={`rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                          isSelected 
                            ? 'ring-2 scale-[1.01]' 
                            : 'hover:scale-[1.008] hover:opacity-95'
                        }`}
                        style={{
                          backgroundColor: isGlass
                            ? (isLight ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.04)')
                            : (isLight ? '#ffffff' : '#141722'),
                          borderColor: isSelected 
                            ? thm.accent 
                            : (isLight ? '#e2e8f0' : '#222738'),
                          boxShadow: isSelected 
                            ? `0 0 16px ${thm.accent}35` 
                            : (isLight ? '0 2px 8px rgba(0,0,0,0.04)' : '0 2px 8px rgba(0,0,0,0.3)')
                        }}
                      >
                        {/* Miniature Window Preview */}
                        <div 
                          className="h-24 p-2 relative overflow-hidden border-b flex flex-col justify-between"
                          style={{
                            backgroundColor: thm.preview.bg,
                            borderColor: thm.preview.border
                          }}
                        >
                          {/* Glass Wallpaper Ambient Glow behind preview */}
                          {thm.isGlass && (
                            <div 
                              className="absolute inset-0 pointer-events-none opacity-40"
                              style={{
                                background: thm.isLight
                                  ? 'radial-gradient(circle at 70% 30%, rgba(234, 88, 12, 0.25), transparent 70%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.20), transparent 70%)'
                                  : 'radial-gradient(circle at 70% 30%, rgba(249, 115, 22, 0.30), transparent 70%), radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.20), transparent 70%)'
                              }}
                            />
                          )}

                          {/* Mini Window Titlebar */}
                          <div 
                            className="h-4.5 rounded-t px-2 flex items-center justify-between border-b relative z-10"
                            style={{
                              backgroundColor: thm.preview.header,
                              borderColor: thm.preview.border
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 inline-block" />
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80 inline-block" />
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 inline-block" />
                            </div>
                            <span 
                              className="text-[8px] font-medium opacity-60 tracking-wider"
                              style={{ color: thm.isLight ? '#0f172a' : '#ffffff' }}
                            >
                              Crystall IDE
                            </span>
                            <div className="w-3" />
                          </div>

                          {/* Mini Window Body: Sidebar + Editor Lines */}
                          <div 
                            className="flex-1 rounded-b flex overflow-hidden relative z-10 border"
                            style={{
                              backgroundColor: thm.preview.editor,
                              borderColor: thm.preview.border
                            }}
                          >
                            {/* Mini Editor Code Lines */}
                            <div className="flex-1 p-2 space-y-1.5 flex flex-col justify-center">
                              {thm.preview.codeLines.map((line, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <span 
                                    className="h-1 rounded-full inline-block"
                                    style={{
                                      backgroundColor: line.color,
                                      width: line.width
                                    }}
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Mini Sidebar */}
                            <div 
                              className="w-7 border-l p-1 flex flex-col gap-1 shrink-0"
                              style={{
                                backgroundColor: thm.preview.sidebar,
                                borderColor: thm.preview.border
                              }}
                            >
                              <div className="w-full h-1 rounded bg-current opacity-20" />
                              <div className="w-3/4 h-1 rounded bg-current opacity-15" />
                              <div className="w-1/2 h-1 rounded bg-current opacity-15" />
                            </div>
                          </div>
                        </div>

                        {/* Card Info Footer */}
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <div 
                                className="text-xs font-semibold whitespace-nowrap leading-tight"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {thm.name}
                              </div>
                              <div 
                                className="text-[10px] font-medium mt-0.5"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                {thm.badge}
                              </div>
                            </div>

                            {isSelected ? (
                              <span 
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 shrink-0"
                                style={{ 
                                  backgroundColor: thm.accent,
                                  color: '#ffffff'
                                }}
                              >
                                <Check className="w-3 h-3" />
                                <span>Активно</span>
                              </span>
                            ) : null}
                          </div>
                          
                          <p 
                            className="text-[11px] leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {thm.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 0: EDITOR & ENGINE SETTINGS */}
            {activeSection === 'editor' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Параметры редактора
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Настройка параметров отображения редактора кода Monaco и звуковых сигналов
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {/* Font Size */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ 
                      borderColor: isGlass ? 'rgba(255,255,255,0.10)' : 'var(--border-color)',
                      backgroundColor: isGlass ? (isLight ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.04)') : 'var(--hover-bg)'
                    }}
                  >
                    <div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Размер шрифта</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Масштаб текста редактора (Текущий: {editorSettings.fontSize}px)</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="range"
                        min={10}
                        max={22}
                        step={1}
                        value={editorSettings.fontSize}
                        onChange={(e) => onUpdateEditorSettings({ fontSize: Number(e.target.value) })}
                        className="w-28 cursor-pointer accent-orange-500"
                      />
                      <span 
                        className="text-xs font-mono font-medium px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.15)'
                        }}
                      >
                        {editorSettings.fontSize}px
                      </span>
                    </div>
                  </div>

                  {/* Word Wrap */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ 
                      borderColor: isGlass ? 'rgba(255,255,255,0.10)' : 'var(--border-color)',
                      backgroundColor: isGlass ? (isLight ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.04)') : 'var(--hover-bg)'
                    }}
                  >
                    <div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Перенос строк</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Автоматический перенос длинных строк по ширине экрана</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.wordWrap}
                        onChange={(e) => onUpdateEditorSettings({ wordWrap: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className={`w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)] ${isLight ? 'bg-zinc-300' : 'bg-zinc-700/60'}`}></div>
                    </label>
                  </div>

                  {/* Minimap */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ 
                      borderColor: isGlass ? 'rgba(255,255,255,0.10)' : 'var(--border-color)',
                      backgroundColor: isGlass ? (isLight ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.04)') : 'var(--hover-bg)'
                    }}
                  >
                    <div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Мини-карта</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Отображать обзор кода в правой части редактора</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.minimap}
                        onChange={(e) => onUpdateEditorSettings({ minimap: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className={`w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)] ${isLight ? 'bg-zinc-300' : 'bg-zinc-700/60'}`}></div>
                    </label>
                  </div>

                  {/* Line Numbers */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ 
                      borderColor: isGlass ? 'rgba(255,255,255,0.10)' : 'var(--border-color)',
                      backgroundColor: isGlass ? (isLight ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.04)') : 'var(--hover-bg)'
                    }}
                  >
                    <div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Номера строк</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Показывать нумерацию строк слева от кода</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.lineNumbers}
                        onChange={(e) => onUpdateEditorSettings({ lineNumbers: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className={`w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)] ${isLight ? 'bg-zinc-300' : 'bg-zinc-700/60'}`}></div>
                    </label>
                  </div>

                  {/* Sound Effects */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ 
                      borderColor: isGlass ? 'rgba(255,255,255,0.10)' : 'var(--border-color)',
                      backgroundColor: isGlass ? (isLight ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.04)') : 'var(--hover-bg)'
                    }}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                        {editorSettings.soundEffects ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
                        <span>Звуковые эффекты</span>
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Аудио-сигналы при запуске скрипта, инжекте и ошибках</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.soundEffects}
                        onChange={(e) => onUpdateEditorSettings({ soundEffects: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className={`w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)] ${isLight ? 'bg-zinc-300' : 'bg-zinc-700/60'}`}></div>
                    </label>
                  </div>

                  {/* Always on top */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ 
                      borderColor: isGlass ? 'rgba(255,255,255,0.10)' : 'var(--border-color)',
                      backgroundColor: isGlass ? (isLight ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.04)') : 'var(--hover-bg)'
                    }}
                  >
                    <div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Поверх всех окон</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Окно Crystall IDE отображается поверх других окон</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.alwaysOnTop}
                        onChange={(e) => onUpdateEditorSettings({ alwaysOnTop: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className={`w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)] ${isLight ? 'bg-zinc-300' : 'bg-zinc-700/60'}`}></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: AI PROVIDERS */}
            {activeSection === 'providers' && (
              <div className="space-y-4">
                <div 
                  className="flex items-center justify-between pb-3 border-b"
                  style={{ 
                    borderColor: isGlass ? 'rgba(255,255,255,0.10)' : 'var(--border-color)' 
                  }}
                >
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {providerMeta.name}
                    </h3>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {providerMeta.badge}
                    </p>
                  </div>

                  <button
                    onClick={() => onChangeActiveProvider(selectedProvider)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                    style={{
                      backgroundColor: activeProvider === selectedProvider ? 'var(--status-badge-bg)' : 'var(--hover-bg)',
                      color: activeProvider === selectedProvider ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      border: `1px solid ${activeProvider === selectedProvider ? 'var(--status-badge-border)' : 'transparent'}`
                    }}
                  >
                    {activeProvider === selectedProvider ? '✓ Активный провайдер' : 'Сделать активным'}
                  </button>
                </div>

                {/* API Key */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold" style={{ color: 'var(--text-primary)' }}>Ключ API (API Key)</label>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {selectedProvider === 'ollama' ? 'Локальный сервер' : 'Хранится локально'}
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={currentCfg.apiKey}
                      onChange={(e) => updateConfig('apiKey', e.target.value)}
                      placeholder={selectedProvider === 'ollama' ? 'ollama' : `sk-...`}
                      className="w-full border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none pr-9 transition-colors"
                      style={{
                        backgroundColor: isGlass ? (isLight ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.25)') : 'var(--bg-app)',
                        borderColor: isGlass ? (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)') : 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 hover:opacity-80 cursor-pointer"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Base URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Базовый URL (Base URL)</label>
                  <input
                    type="text"
                    value={currentCfg.baseUrl || ''}
                    onChange={(e) => updateConfig('baseUrl', e.target.value)}
                    placeholder="https://api.openai.com/v1"
                    className="w-full border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none transition-colors"
                    style={{
                      backgroundColor: isGlass ? (isLight ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.25)') : 'var(--bg-app)',
                      borderColor: isGlass ? (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)') : 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {/* Model Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Модель (Model)</label>
                  <input
                    type="text"
                    value={currentCfg.model}
                    onChange={(e) => updateConfig('model', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none transition-colors"
                    style={{
                      backgroundColor: isGlass ? (isLight ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.25)') : 'var(--bg-app)',
                      borderColor: isGlass ? (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)') : 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {MODEL_PRESETS[selectedProvider] && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {MODEL_PRESETS[selectedProvider].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => updateConfig('model', m)}
                          className="px-2.5 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer"
                          style={{
                            backgroundColor: currentCfg.model === m ? 'var(--status-badge-bg)' : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)'),
                            color: currentCfg.model === m ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            border: `1px solid ${currentCfg.model === m ? 'var(--status-badge-border)' : 'transparent'}`
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Test Connection Button */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleTestKey}
                    disabled={testStatus === 'testing'}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border"
                    style={{
                      backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.08)',
                      borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {testStatus === 'testing' ? 'Проверка соединения...' : 'Проверить подключение'}
                  </button>

                  {testStatus === 'success' && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span>{testMessage}</span>
                    </div>
                  )}

                  {testStatus === 'failed' && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>{testMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div 
          className="h-13 border-t px-5 flex items-center justify-between shrink-0 relative z-20"
          style={{
            backgroundColor: isGlass
              ? (isLight ? 'rgba(255, 255, 255, 0.40)' : 'rgba(255, 255, 255, 0.04)')
              : (isLight ? '#f8fafc' : '#12151f'),
            borderColor: isGlass
              ? (isLight ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.08)')
              : (isLight ? '#e2e8f0' : '#1c202d')
          }}
        >
          <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
            <span>Настройки сохраняются автоматически</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              style={{ 
                color: 'var(--text-secondary)',
                backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)'
              }}
            >
              Закрыть
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-all cursor-pointer shadow-sm hover:opacity-90"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};