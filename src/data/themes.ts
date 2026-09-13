import { CrystallTheme, CrystallThemeId } from '../types';

export const CRYSTALL_THEMES: Record<CrystallThemeId, CrystallTheme> = {
  'dark-charcoal': {
    id: 'dark-charcoal',
    name: 'Dark Charcoal',
    subtitle: 'Classic Abyss Executor',
    category: 'dark',
    description: 'Original Figma dark executor theme with warm orange accents and obsidian panels.',
    previewColors: {
      bg: '#0a0c10',
      panel: '#0f1118',
      accent: '#f97316',
      text: '#f4f4f5',
      border: '#1b1e28'
    },
    monacoTheme: 'crystall-dark',
    cssVars: {
      '--bg-app': '#0a0c10',
      '--bg-header': '#0d0f15',
      '--bg-editor': '#0c0e14',
      '--bg-panel': '#0f1118',
      '--bg-card': '#131620',
      '--bg-statusbar': '#0a0c10',
      '--bg-modal': '#0d0f15',
      '--border-color': '#1b1e28',
      '--text-primary': '#f4f4f5',
      '--text-secondary': '#a1a1aa',
      '--text-muted': '#71717a',
      '--accent-primary': '#f97316',
      '--accent-hover': '#ea580c',
      '--accent-glow': 'rgba(249, 115, 22, 0.2)',
      '--hover-bg': 'rgba(255, 255, 255, 0.05)',
      '--status-badge-bg': 'rgba(249, 115, 22, 0.15)',
      '--status-badge-text': '#fb923c',
      '--status-badge-border': 'rgba(249, 115, 22, 0.3)',
      '--chat-user-bg': '#181a24',
      '--chat-assistant-bg': '#0e1017',
      '--chat-input-bg': '#08090d',
      '--tab-active-bg': '#0c0e14',
      '--tab-inactive-bg': '#0e1017',
      '--app-backdrop': 'transparent',
      '--app-filter': 'none'
    }
  },
  'midnight-oled': {
    id: 'midnight-oled',
    name: 'Midnight OLED',
    subtitle: 'Pure Pitch Black',
    category: 'dark',
    description: 'Ultra deep pure black contrast matching Figma second dark frame with vivid gold accents.',
    previewColors: {
      bg: '#000000',
      panel: '#070709',
      accent: '#ff9800',
      text: '#ffffff',
      border: '#16161a'
    },
    monacoTheme: 'crystall-midnight',
    cssVars: {
      '--bg-app': '#000000',
      '--bg-header': '#050507',
      '--bg-editor': '#000000',
      '--bg-panel': '#070709',
      '--bg-card': '#0b0b0e',
      '--bg-statusbar': '#000000',
      '--bg-modal': '#08080a',
      '--border-color': '#16161a',
      '--text-primary': '#ffffff',
      '--text-secondary': '#a3a3a3',
      '--text-muted': '#525252',
      '--accent-primary': '#ff9800',
      '--accent-hover': '#f57c00',
      '--accent-glow': 'rgba(255, 152, 0, 0.25)',
      '--hover-bg': 'rgba(255, 255, 255, 0.07)',
      '--status-badge-bg': 'rgba(255, 152, 0, 0.15)',
      '--status-badge-text': '#ffb74d',
      '--status-badge-border': 'rgba(255, 152, 0, 0.35)',
      '--chat-user-bg': '#121216',
      '--chat-assistant-bg': '#08080b',
      '--chat-input-bg': '#040406',
      '--tab-active-bg': '#000000',
      '--tab-inactive-bg': '#060608',
      '--app-backdrop': 'transparent',
      '--app-filter': 'none'
    }
  },
  'slate-navy': {
    id: 'slate-navy',
    name: 'Slate Navy',
    subtitle: 'Cool Dark Slate',
    category: 'dark',
    description: 'Cold graphite blue-gray tones matching Figma third dark variant with cyan accents.',
    previewColors: {
      bg: '#080c14',
      panel: '#0d1320',
      accent: '#0284c7',
      text: '#f8fafc',
      border: '#1e293b'
    },
    monacoTheme: 'crystall-slate',
    cssVars: {
      '--bg-app': '#080c14',
      '--bg-header': '#0b101b',
      '--bg-editor': '#0a0e18',
      '--bg-panel': '#0d1320',
      '--bg-card': '#111a2c',
      '--bg-statusbar': '#080c14',
      '--bg-modal': '#0c121e',
      '--border-color': '#1e293b',
      '--text-primary': '#f8fafc',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#64748b',
      '--accent-primary': '#0284c7',
      '--accent-hover': '#0369a1',
      '--accent-glow': 'rgba(2, 132, 199, 0.25)',
      '--hover-bg': 'rgba(255, 255, 255, 0.05)',
      '--status-badge-bg': 'rgba(2, 132, 199, 0.15)',
      '--status-badge-text': '#38bdf8',
      '--status-badge-border': 'rgba(2, 132, 199, 0.35)',
      '--chat-user-bg': '#131f33',
      '--chat-assistant-bg': '#0b1220',
      '--chat-input-bg': '#060910',
      '--tab-active-bg': '#0a0e18',
      '--tab-inactive-bg': '#0e1422',
      '--app-backdrop': 'transparent',
      '--app-filter': 'none'
    }
  },
  'light-classic': {
    id: 'light-classic',
    name: 'Light Classic',
    subtitle: 'Clean White Light',
    category: 'light',
    description: 'Bright clean daylight design matching Figma bottom row light frame with studio orange highlights.',
    previewColors: {
      bg: '#f1f5f9',
      panel: '#f8fafc',
      accent: '#ea580c',
      text: '#0f172a',
      border: '#e2e8f0'
    },
    monacoTheme: 'crystall-light',
    cssVars: {
      '--bg-app': '#f1f5f9',
      '--bg-header': '#ffffff',
      '--bg-editor': '#ffffff',
      '--bg-panel': '#f8fafc',
      '--bg-card': '#ffffff',
      '--bg-statusbar': '#ffffff',
      '--bg-modal': '#ffffff',
      '--border-color': '#e2e8f0',
      '--text-primary': '#0f172a',
      '--text-secondary': '#475569',
      '--text-muted': '#94a3b8',
      '--accent-primary': '#ea580c',
      '--accent-hover': '#c2410c',
      '--accent-glow': 'rgba(234, 88, 12, 0.2)',
      '--hover-bg': 'rgba(0, 0, 0, 0.04)',
      '--status-badge-bg': 'rgba(234, 88, 12, 0.1)',
      '--status-badge-text': '#c2410c',
      '--status-badge-border': 'rgba(234, 88, 12, 0.25)',
      '--chat-user-bg': '#e2e8f0',
      '--chat-assistant-bg': '#f8fafc',
      '--chat-input-bg': '#ffffff',
      '--tab-active-bg': '#ffffff',
      '--tab-inactive-bg': '#f1f5f9',
      '--app-backdrop': 'transparent',
      '--app-filter': 'none'
    }
  },
  'warm-paper': {
    id: 'warm-paper',
    name: 'Warm Paper',
    subtitle: 'Soft Cream Latte',
    category: 'light',
    description: 'Gentle warm sepia paper theme matching Figma fifth frame with terracotta accents.',
    previewColors: {
      bg: '#f5f2eb',
      panel: '#f8f6f0',
      accent: '#d97706',
      text: '#292524',
      border: '#e5dec9'
    },
    monacoTheme: 'crystall-warm',
    cssVars: {
      '--bg-app': '#f5f2eb',
      '--bg-header': '#fcfbf9',
      '--bg-editor': '#fdfdfc',
      '--bg-panel': '#f8f6f0',
      '--bg-card': '#fdfcf9',
      '--bg-statusbar': '#f5f2eb',
      '--bg-modal': '#fcfbf9',
      '--border-color': '#e5dec9',
      '--text-primary': '#292524',
      '--text-secondary': '#57534e',
      '--text-muted': '#78716c',
      '--accent-primary': '#d97706',
      '--accent-hover': '#b45309',
      '--accent-glow': 'rgba(217, 119, 6, 0.2)',
      '--hover-bg': 'rgba(0, 0, 0, 0.04)',
      '--status-badge-bg': 'rgba(217, 119, 6, 0.1)',
      '--status-badge-text': '#b45309',
      '--status-badge-border': 'rgba(217, 119, 6, 0.25)',
      '--chat-user-bg': '#eae3d2',
      '--chat-assistant-bg': '#f7f4ea',
      '--chat-input-bg': '#fdfdfc',
      '--tab-active-bg': '#fdfdfc',
      '--tab-inactive-bg': '#ede7dc',
      '--app-backdrop': 'transparent',
      '--app-filter': 'none'
    }
  },
  'acrylic-glass': {
    id: 'acrylic-glass',
    name: 'Acrylic Glass',
    subtitle: 'Frosted Translucent',
    category: 'glass',
    description: 'Exact Figma sixth frame translucent acrylic glass theme with 3D crystal watermark and specular glass reflections.',
    previewColors: {
      bg: '#141a29',
      panel: 'rgba(20, 26, 40, 0.65)',
      accent: '#f97316',
      text: '#ffffff',
      border: 'rgba(255, 255, 255, 0.14)'
    },
    monacoTheme: 'crystall-glass',
    cssVars: {
      '--bg-app': 'rgba(12, 16, 26, 0.72)',
      '--bg-header': 'rgba(10, 13, 22, 0.78)',
      '--bg-editor': 'rgba(12, 16, 26, 0.45)',
      '--bg-panel': 'rgba(16, 22, 34, 0.58)',
      '--bg-card': 'rgba(255, 255, 255, 0.05)',
      '--bg-statusbar': 'rgba(8, 11, 18, 0.85)',
      '--bg-modal': 'rgba(14, 18, 30, 0.90)',
      '--border-color': 'rgba(255, 255, 255, 0.12)',
      '--text-primary': '#ffffff',
      '--text-secondary': '#cbd5e1',
      '--text-muted': '#94a3b8',
      '--accent-primary': '#f97316',
      '--accent-hover': '#fb923c',
      '--accent-glow': 'rgba(249, 115, 22, 0.35)',
      '--hover-bg': 'rgba(255, 255, 255, 0.09)',
      '--status-badge-bg': 'rgba(249, 115, 22, 0.2)',
      '--status-badge-text': '#fdba74',
      '--status-badge-border': 'rgba(249, 115, 22, 0.4)',
      '--chat-user-bg': 'rgba(255, 255, 255, 0.08)',
      '--chat-assistant-bg': 'rgba(0, 0, 0, 0.45)',
      '--chat-input-bg': 'rgba(0, 0, 0, 0.5)',
      '--tab-active-bg': 'rgba(255, 255, 255, 0.08)',
      '--tab-inactive-bg': 'rgba(0, 0, 0, 0.2)',
      '--app-backdrop': 'rgba(10, 14, 22, 0.85)',
      '--app-filter': 'blur(28px)'
    }
  }
};

export const DEFAULT_THEME: CrystallThemeId = 'dark-charcoal';

export function applyThemeVariables(themeId: CrystallThemeId): void {
  const theme = CRYSTALL_THEMES[themeId] || CRYSTALL_THEMES[DEFAULT_THEME];
  const root = document.documentElement;

  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-theme-category', theme.category);

  Object.entries(theme.cssVars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
}
