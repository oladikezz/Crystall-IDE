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
  Code2
} from 'lucide-react';
import { AIProvider, AllConfigs, ProviderConfig, CrystallThemeId, EditorSettings } from '../types';
import { PROVIDER_LABELS } from '../data/constants';
import { CRYSTALL_THEMES, FIGMA_THEMES, resolveTheme } from '../data/themes';

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
  openrouter: ['deepseek/deepseek-r1', 'anthropic/claude-3.7-sonnet', 'openai/gpt-4o', 'meta-llama/llama-3.3-70b-instruct'],
  ollama: ['llama3:latest', 'deepseek-r1:latest', 'qwen2.5-coder:latest', 'codellama:latest'],
  custom: ['custom-model']
};

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
  const [activeSection, setActiveSection] = useState<'editor' | 'appearance' | 'providers'>('editor');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(activeProvider);
  const [localConfigs, setLocalConfigs] = useState<AllConfigs>(configs);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const currentCfg = localConfigs[selectedProvider];
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
    setTestMessage('Testing connection...');

    if (!currentCfg.apiKey && selectedProvider !== 'ollama') {
      setTimeout(() => {
        setTestStatus('success');
        setTestMessage('Offline simulator mode ready');
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
        setTestMessage(`Connected (HTTP ${res.status})`);
      } else {
        setTestStatus('failed');
        setTestMessage(`HTTP ${res.status}`);
      }
    } catch (e: any) {
      setTestStatus('failed');
      setTestMessage(e.message || 'Connection error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none font-sans">
      <div 
        className="w-full max-w-2xl h-[560px] rounded-xl flex flex-col shadow-2xl overflow-hidden border"
        style={{
          backgroundColor: 'var(--bg-modal)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Header */}
        <div 
          className="h-11 border-b px-4 flex items-center justify-between shrink-0"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-2 text-xs">
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-medium">Preferences</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {activeSection === 'editor' && 'Editor & Engine'}
              {activeSection === 'appearance' && 'Appearance & Themes'}
              {activeSection === 'providers' && 'AI Providers'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Main Navigation Sidebar */}
          <div 
            className="w-48 border-r p-2 space-y-1 overflow-y-auto shrink-0"
            style={{
              backgroundColor: 'var(--bg-panel)',
              borderColor: 'var(--border-color)'
            }}
          >
            <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-1 block" style={{ color: 'var(--text-muted)' }}>
              Preferences
            </span>

            <button
              onClick={() => setActiveSection('editor')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors text-left cursor-pointer ${
                activeSection === 'editor'
                  ? 'bg-white/10 font-medium'
                  : 'hover:bg-white/5'
              }`}
              style={{
                color: activeSection === 'editor' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              <Sliders className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              <span>Editor & Engine</span>
            </button>
            
            <button
              onClick={() => setActiveSection('appearance')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors text-left cursor-pointer ${
                activeSection === 'appearance'
                  ? 'bg-white/10 font-medium'
                  : 'hover:bg-white/5'
              }`}
              style={{
                color: activeSection === 'appearance' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              <Palette className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              <span>Appearance (Themes)</span>
            </button>

            <button
              onClick={() => setActiveSection('providers')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors text-left cursor-pointer ${
                activeSection === 'providers'
                  ? 'bg-white/10 font-medium'
                  : 'hover:bg-white/5'
              }`}
              style={{
                color: activeSection === 'providers' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              <Key className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              <span>AI Providers</span>
            </button>

            {/* Providers Sub-list if in providers section */}
            {activeSection === 'providers' && (
              <div className="pt-2 border-t mt-2 space-y-0.5" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[9px] uppercase tracking-wider px-2 py-1 block font-mono" style={{ color: 'var(--text-muted)' }}>
                  Models
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
                      className={`w-full flex items-center justify-between px-2.5 py-1 rounded text-[11px] transition-colors text-left cursor-pointer ${
                        isSelected
                          ? 'bg-white/10 font-medium'
                          : 'hover:bg-white/5'
                      }`}
                      style={{
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
            className="flex-1 p-5 overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-modal)' }}
          >
            {/* SECTION 0: EDITOR & ENGINE SETTINGS */}
            {activeSection === 'editor' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Editor & Engine Configuration
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Customize Monaco editor rendering, audio feedback, and Roblox execution behavior.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Font Size */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--hover-bg)' }}>
                    <div>
                      <div className="text-xs font-medium">Font Size</div>
                      <div className="text-[11px] text-zinc-500">Editor text size in pixels (Current: {editorSettings.fontSize}px)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={10}
                        max={22}
                        step={1}
                        value={editorSettings.fontSize}
                        onChange={(e) => onUpdateEditorSettings({ fontSize: Number(e.target.value) })}
                        className="w-28 cursor-pointer accent-orange-500"
                      />
                      <span className="text-xs font-mono w-6 text-right">{editorSettings.fontSize}</span>
                    </div>
                  </div>

                  {/* Word Wrap */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--hover-bg)' }}>
                    <div>
                      <div className="text-xs font-medium">Word Wrap</div>
                      <div className="text-[11px] text-zinc-500">Wrap long lines to fit the editor viewport</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.wordWrap}
                        onChange={(e) => onUpdateEditorSettings({ wordWrap: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                    </label>
                  </div>

                  {/* Minimap */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--hover-bg)' }}>
                    <div>
                      <div className="text-xs font-medium">Show Minimap</div>
                      <div className="text-[11px] text-zinc-500">Display mini code preview on the right edge of editor</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.minimap}
                        onChange={(e) => onUpdateEditorSettings({ minimap: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                    </label>
                  </div>

                  {/* Line Numbers */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--hover-bg)' }}>
                    <div>
                      <div className="text-xs font-medium">Line Numbers</div>
                      <div className="text-[11px] text-zinc-500">Render code line numbers in the gutter</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.lineNumbers}
                        onChange={(e) => onUpdateEditorSettings({ lineNumbers: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                    </label>
                  </div>

                  {/* Sound Effects */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--hover-bg)' }}>
                    <div>
                      <div className="text-xs font-medium flex items-center gap-1.5">
                        {editorSettings.soundEffects ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
                        <span>Audio Sound Effects</span>
                      </div>
                      <div className="text-[11px] text-zinc-500">Play audio cues on script execution, attach/inject, and errors</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.soundEffects}
                        onChange={(e) => onUpdateEditorSettings({ soundEffects: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                    </label>
                  </div>

                  {/* Always on top */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--hover-bg)' }}>
                    <div>
                      <div className="text-xs font-medium">Always On Top</div>
                      <div className="text-[11px] text-zinc-500">Keep Crystall IDE window above Roblox game window</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editorSettings.alwaysOnTop}
                        onChange={(e) => onUpdateEditorSettings({ alwaysOnTop: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 1: APPEARANCE / 6 FIGMA THEMES */}
            {activeSection === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Figma Project Themes (6 Themes)
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Exact color palettes extracted from the Roblox Executor Figma canvas. Click any theme to apply immediately.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {FIGMA_THEMES.map((thm) => {
                    const isSelected = activeTheme === thm.id;
                    return (
                      <div
                        key={thm.id}
                        onClick={() => onSelectTheme(thm.id)}
                        className="p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
                        style={{
                          backgroundColor: thm.previewColors.bg,
                          borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                          boxShadow: isSelected ? '0 0 12px var(--accent-glow)' : 'none'
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span 
                              className="text-xs font-semibold"
                              style={{ color: thm.previewColors.text }}
                            >
                              {thm.name}
                            </span>
                            {isSelected && (
                              <span 
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                                style={{ 
                                  backgroundColor: thm.previewColors.accent,
                                  color: '#ffffff'
                                }}
                              >
                                Active
                              </span>
                            )}
                          </div>
                          <p 
                            className="text-[11px] line-clamp-2 leading-relaxed"
                            style={{ color: thm.previewColors.text, opacity: 0.7 }}
                          >
                            {thm.description}
                          </p>
                        </div>

                        {/* Theme Swatches */}
                        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t" style={{ borderColor: thm.previewColors.border }}>
                          <span 
                            className="w-4 h-4 rounded-full border border-black/20"
                            style={{ backgroundColor: thm.previewColors.bg }}
                            title="Background"
                          />
                          <span 
                            className="w-4 h-4 rounded-full border border-black/20"
                            style={{ backgroundColor: thm.previewColors.panel }}
                            title="Panel"
                          />
                          <span 
                            className="w-4 h-4 rounded-full border border-black/20"
                            style={{ backgroundColor: thm.previewColors.accent }}
                            title="Accent"
                          />
                          <span 
                            className="text-[10px] font-mono ml-auto"
                            style={{ color: thm.previewColors.text, opacity: 0.6 }}
                          >
                            {thm.category}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 2: AI PROVIDERS */}
            {activeSection === 'providers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {providerMeta.name}
                    </h3>
                    <p className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {providerMeta.badge}
                    </p>
                  </div>

                  <button
                    onClick={() => onChangeActiveProvider(selectedProvider)}
                    className="px-2.5 py-1 rounded text-xs transition-colors font-sans cursor-pointer"
                    style={{
                      backgroundColor: activeProvider === selectedProvider ? 'var(--status-badge-bg)' : 'var(--hover-bg)',
                      color: activeProvider === selectedProvider ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      border: `1px solid ${activeProvider === selectedProvider ? 'var(--status-badge-border)' : 'transparent'}`
                    }}
                  >
                    {activeProvider === selectedProvider ? 'Active Provider' : 'Use as Active'}
                  </button>
                </div>

                {/* API Key */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-medium" style={{ color: 'var(--text-primary)' }}>API Key</label>
                    <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {selectedProvider === 'ollama' ? 'Local' : 'Stored in localStorage'}
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={currentCfg.apiKey}
                      onChange={(e) => updateConfig('apiKey', e.target.value)}
                      placeholder={selectedProvider === 'ollama' ? 'ollama' : `sk-...`}
                      className="w-full border rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none pr-8 transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-app)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2.5 hover:opacity-80"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Base URL */}
                <div className="space-y-1">
                  <label className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Base URL</label>
                  <input
                    type="text"
                    value={currentCfg.baseUrl || ''}
                    onChange={(e) => updateConfig('baseUrl', e.target.value)}
                    placeholder="https://api.openai.com/v1"
                    className="w-full border rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-app)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {/* Model Name */}
                <div className="space-y-1">
                  <label className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Model</label>
                  <input
                    type="text"
                    value={currentCfg.model}
                    onChange={(e) => updateConfig('model', e.target.value)}
                    className="w-full border rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-app)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {MODEL_PRESETS[selectedProvider] && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {MODEL_PRESETS[selectedProvider].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => updateConfig('model', m)}
                          className="px-2 py-0.5 rounded text-[10px] font-mono hover:bg-white/10 transition-colors"
                          style={{
                            backgroundColor: 'var(--hover-bg)',
                            color: currentCfg.model === m ? 'var(--accent-primary)' : 'var(--text-muted)',
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
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleTestKey}
                    disabled={testStatus === 'testing'}
                    className="px-3 py-1.5 rounded text-xs transition-colors cursor-pointer border"
                    style={{
                      backgroundColor: 'var(--hover-bg)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {testStatus === 'testing' ? 'Connecting...' : 'Test Connection'}
                  </button>

                  {testStatus === 'success' && (
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>{testMessage}</span>
                    </div>
                  )}

                  {testStatus === 'failed' && (
                    <div className="flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" />
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
          className="h-12 border-t px-4 flex items-center justify-between shrink-0"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--border-color)'
          }}
        >
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Changes apply immediately across Crystall IDE.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded text-xs hover:bg-white/5 transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded text-xs font-medium text-white transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};