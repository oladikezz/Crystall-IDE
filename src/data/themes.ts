import { CrystallTheme, CrystallThemeId } from '../types';

export const CRYSTALL_THEMES: Record<CrystallThemeId, CrystallTheme> = {
  // --- ROW 1: DARK MODE ---
  'dark-v1': {
    id: 'dark-v1',
    versionBadge: 'Version 1',
    styleVariant: 'Solid',
    name: 'Dark v1 (Solid)',
    subtitle: 'Classic Abyss Solid',
    category: 'dark',
    description: 'Оригинальная глубинная тёмная тема из Figma (Frame 1). Сплошной обсидиановый фон и фирменный янтарный акцент.',
    previewColors: {
      bg: '#0b0d13',
      panel: '#0e1017',
      accent: '#f97316',
      text: '#f3f4f6',
      border: '#1c202d'
    },
    monacoTheme: 'crystall-dark-v1',
    cssVars: {
      '--bg-app': '#0b0d13',
      '--bg-header': '#0e1017',
      '--bg-editor': '#0c0e14',
      '--bg-panel': '#0f1118',
      '--bg-card': '#131620',
      '--bg-statusbar': '#0a0c10',
      '--bg-modal': '#0e1017',
      '--border-color': '#1c202d',
      '--text-primary': '#f3f4f6',
      '--text-secondary': '#9ca3af',
      '--text-muted': '#6b7280',
      '--accent-primary': '#f97316',
      '--accent-hover': '#ea580c',
      '--accent-glow': 'rgba(249, 115, 22, 0.25)',
      '--hover-bg': 'rgba(255, 255, 255, 0.05)',
      '--status-badge-bg': 'rgba(249, 115, 22, 0.12)',
      '--status-badge-text': '#fb923c',
      '--status-badge-border': 'rgba(249, 115, 22, 0.28)',
      '--chat-user-bg': '#181a24',
      '--chat-assistant-bg': '#0e1017',
      '--chat-input-bg': '#08090d',
      '--tab-active-bg': '#0c0e14',
      '--tab-inactive-bg': '#0e1017',
      '--app-backdrop': 'none',
      '--app-filter': 'none'
    }
  },

  'dark-v2': {
    id: 'dark-v2',
    versionBadge: 'Version 2',
    styleVariant: 'Acrylic',
    name: 'Dark v2 (Acrylic)',
    subtitle: 'Frosted Mica Night',
    category: 'dark',
    description: 'Оригинальная матовая тёмная акриловая тема из Figma (Frame 2). Мягкое размытие 24px, свечение ночного сада на фоне.',
    previewColors: {
      bg: '#0d1017',
      panel: 'rgba(15, 19, 28, 0.85)',
      accent: '#f97316',
      text: '#f8fafc',
      border: 'rgba(255, 255, 255, 0.12)'
    },
    monacoTheme: 'crystall-dark-v2',
    cssVars: {
      '--bg-app': 'rgba(11, 14, 20, 0.78)',
      '--bg-header': 'rgba(14, 17, 25, 0.84)',
      '--bg-editor': 'rgba(11, 14, 20, 0.65)',
      '--bg-panel': 'rgba(15, 19, 28, 0.78)',
      '--bg-card': 'rgba(255, 255, 255, 0.06)',
      '--bg-statusbar': 'rgba(10, 13, 19, 0.88)',
      '--bg-modal': 'rgba(14, 18, 28, 0.94)',
      '--border-color': 'rgba(255, 255, 255, 0.10)',
      '--text-primary': '#f8fafc',
      '--text-secondary': '#cbd5e1',
      '--text-muted': '#94a3b8',
      '--accent-primary': '#f97316',
      '--accent-hover': '#ea580c',
      '--accent-glow': 'rgba(249, 115, 22, 0.35)',
      '--hover-bg': 'rgba(255, 255, 255, 0.08)',
      '--status-badge-bg': 'rgba(249, 115, 22, 0.18)',
      '--status-badge-text': '#fb923c',
      '--status-badge-border': 'rgba(249, 115, 22, 0.35)',
      '--chat-user-bg': 'rgba(255, 255, 255, 0.07)',
      '--chat-assistant-bg': 'rgba(0, 0, 0, 0.40)',
      '--chat-input-bg': 'rgba(0, 0, 0, 0.45)',
      '--tab-active-bg': 'rgba(255, 255, 255, 0.08)',
      '--tab-inactive-bg': 'rgba(0, 0, 0, 0.25)',
      '--app-backdrop': 'night',
      '--app-filter': 'blur(24px)'
    }
  },

  'dark-v3': {
    id: 'dark-v3',
    versionBadge: 'Version 3',
    styleVariant: 'Glass',
    name: 'Dark v3 (Glass)',
    subtitle: 'Liquid Crystal Glass',
    category: 'glass',
    description: 'Оригинальное тёмное жидкое стекло из Figma (Frame 3). Высокая прозрачность, просвечивание сада и глянцевые грани.',
    previewColors: {
      bg: '#080c14',
      panel: 'rgba(12, 17, 28, 0.52)',
      accent: '#f97316',
      text: '#ffffff',
      border: 'rgba(255, 255, 255, 0.22)'
    },
    monacoTheme: 'crystall-dark-v3',
    cssVars: {
      '--bg-app': 'rgba(10, 13, 20, 0.68)',
      '--bg-header': 'rgba(12, 16, 26, 0.75)',
      '--bg-editor': 'rgba(8, 11, 18, 0.55)',
      '--bg-panel': 'rgba(14, 19, 30, 0.68)',
      '--bg-card': 'rgba(255, 255, 255, 0.08)',
      '--bg-statusbar': 'rgba(8, 11, 18, 0.82)',
      '--bg-modal': 'rgba(12, 17, 28, 0.88)',
      '--border-color': 'rgba(255, 255, 255, 0.20)',
      '--text-primary': '#ffffff',
      '--text-secondary': '#e2e8f0',
      '--text-muted': '#a1a1aa',
      '--accent-primary': '#f97316',
      '--accent-hover': '#fb923c',
      '--accent-glow': 'rgba(249, 115, 22, 0.45)',
      '--hover-bg': 'rgba(255, 255, 255, 0.12)',
      '--status-badge-bg': 'rgba(249, 115, 22, 0.22)',
      '--status-badge-text': '#fed7aa',
      '--status-badge-border': 'rgba(249, 115, 22, 0.45)',
      '--chat-user-bg': 'rgba(255, 255, 255, 0.10)',
      '--chat-assistant-bg': 'rgba(0, 0, 0, 0.35)',
      '--chat-input-bg': 'rgba(0, 0, 0, 0.40)',
      '--tab-active-bg': 'rgba(255, 255, 255, 0.12)',
      '--tab-inactive-bg': 'rgba(0, 0, 0, 0.20)',
      '--app-backdrop': 'night',
      '--app-filter': 'blur(12px)'
    }
  },

  // --- ROW 2: LIGHT MODE ---
  'light-v1': {
    id: 'light-v1',
    versionBadge: 'Version 1',
    styleVariant: 'Solid',
    name: 'Light v1 (Solid)',
    subtitle: 'Studio Clean Light',
    category: 'light',
    description: 'Оригинальная дневная тема из макета Figma (Frame 4). Чистый белый фон, светлые панели и студийный оранжевый акцент.',
    previewColors: {
      bg: '#ffffff',
      panel: '#f8fafc',
      accent: '#ea580c',
      text: '#0f172a',
      border: '#e2e8f0'
    },
    monacoTheme: 'crystall-light-v1',
    cssVars: {
      '--bg-app': '#ffffff',
      '--bg-header': '#ffffff',
      '--bg-editor': '#ffffff',
      '--bg-panel': '#f8fafc',
      '--bg-card': '#f1f5f9',
      '--bg-statusbar': '#f8fafc',
      '--bg-modal': '#ffffff',
      '--border-color': '#e2e8f0',
      '--text-primary': '#0f172a',
      '--text-secondary': '#475569',
      '--text-muted': '#94a3b8',
      '--accent-primary': '#ea580c',
      '--accent-hover': '#c2410c',
      '--accent-glow': 'rgba(234, 88, 12, 0.2)',
      '--hover-bg': 'rgba(0, 0, 0, 0.04)',
      '--status-badge-bg': 'rgba(234, 88, 12, 0.10)',
      '--status-badge-text': '#c2410c',
      '--status-badge-border': 'rgba(234, 88, 12, 0.3)',
      '--chat-user-bg': '#f1f5f9',
      '--chat-assistant-bg': '#f8fafc',
      '--chat-input-bg': '#ffffff',
      '--tab-active-bg': '#fff7ed',
      '--tab-inactive-bg': '#ffffff',
      '--app-backdrop': 'none',
      '--app-filter': 'none'
    }
  },

  'light-v2': {
    id: 'light-v2',
    versionBadge: 'Version 2',
    styleVariant: 'Acrylic',
    name: 'Light v2 (Acrylic)',
    subtitle: 'Frosted Daylight Mica',
    category: 'light',
    description: 'Оригинальная светлая акриловая тема из Figma (Frame 5). Матовое размытие 24px, солнечный сад на фоне и отличная контрастность.',
    previewColors: {
      bg: '#ffffff',
      panel: 'rgba(248, 250, 252, 0.85)',
      accent: '#ea580c',
      text: '#0f172a',
      border: 'rgba(0, 0, 0, 0.10)'
    },
    monacoTheme: 'crystall-light-v2',
    cssVars: {
      '--bg-app': 'rgba(255, 255, 255, 0.82)',
      '--bg-header': 'rgba(255, 255, 255, 0.88)',
      '--bg-editor': 'rgba(255, 255, 255, 0.75)',
      '--bg-panel': 'rgba(248, 250, 252, 0.80)',
      '--bg-card': 'rgba(0, 0, 0, 0.04)',
      '--bg-statusbar': 'rgba(248, 250, 252, 0.90)',
      '--bg-modal': 'rgba(255, 255, 255, 0.95)',
      '--border-color': 'rgba(0, 0, 0, 0.10)',
      '--text-primary': '#0f172a',
      '--text-secondary': '#334155',
      '--text-muted': '#64748b',
      '--accent-primary': '#ea580c',
      '--accent-hover': '#c2410c',
      '--accent-glow': 'rgba(234, 88, 12, 0.25)',
      '--hover-bg': 'rgba(0, 0, 0, 0.05)',
      '--status-badge-bg': 'rgba(234, 88, 12, 0.12)',
      '--status-badge-text': '#c2410c',
      '--status-badge-border': 'rgba(234, 88, 12, 0.35)',
      '--chat-user-bg': 'rgba(241, 245, 249, 0.75)',
      '--chat-assistant-bg': 'rgba(248, 250, 252, 0.75)',
      '--chat-input-bg': 'rgba(255, 255, 255, 0.85)',
      '--tab-active-bg': 'rgba(255, 247, 237, 0.85)',
      '--tab-inactive-bg': 'rgba(255, 255, 255, 0.50)',
      '--app-backdrop': 'day',
      '--app-filter': 'blur(24px)'
    }
  },

  'light-v3': {
    id: 'light-v3',
    versionBadge: 'Version 3',
    styleVariant: 'Glass',
    name: 'Light v3 (Glass)',
    subtitle: 'Crystal Daylight Glass',
    category: 'glass',
    description: 'Оригинальное прозрачное светлое стекло из Figma (Frame 6). Солнечный сад сквозь редактор, глянцевые фаски и глубина.',
    previewColors: {
      bg: 'rgba(255, 255, 255, 0.65)',
      panel: 'rgba(255, 255, 255, 0.55)',
      accent: '#ea580c',
      text: '#0f172a',
      border: 'rgba(255, 255, 255, 0.65)'
    },
    monacoTheme: 'crystall-light-v3',
    cssVars: {
      '--bg-app': 'rgba(255, 255, 255, 0.65)',
      '--bg-header': 'rgba(255, 255, 255, 0.75)',
      '--bg-editor': 'rgba(255, 255, 255, 0.55)',
      '--bg-panel': 'rgba(255, 255, 255, 0.68)',
      '--bg-card': 'rgba(255, 255, 255, 0.25)',
      '--bg-statusbar': 'rgba(255, 255, 255, 0.82)',
      '--bg-modal': 'rgba(255, 255, 255, 0.90)',
      '--border-color': 'rgba(255, 255, 255, 0.55)',
      '--text-primary': '#0f172a',
      '--text-secondary': '#1e293b',
      '--text-muted': '#475569',
      '--accent-primary': '#ea580c',
      '--accent-hover': '#c2410c',
      '--accent-glow': 'rgba(234, 88, 12, 0.3)',
      '--hover-bg': 'rgba(255, 255, 255, 0.2)',
      '--status-badge-bg': 'rgba(234, 88, 12, 0.15)',
      '--status-badge-text': '#c2410c',
      '--status-badge-border': 'rgba(234, 88, 12, 0.45)',
      '--chat-user-bg': 'rgba(255, 255, 255, 0.4)',
      '--chat-assistant-bg': 'rgba(255, 255, 255, 0.35)',
      '--chat-input-bg': 'rgba(255, 255, 255, 0.55)',
      '--tab-active-bg': 'rgba(255, 247, 237, 0.5)',
      '--tab-inactive-bg': 'rgba(255, 255, 255, 0.25)',
      '--app-backdrop': 'day',
      '--app-filter': 'blur(12px)'
    }
  },

  // --- LEGACY FALLBACK ALIASES ---
  'dark-charcoal': {
    get id() { return 'dark-v1' as CrystallThemeId; },
    get versionBadge() { return 'Version 1' as const; },
    get styleVariant() { return 'Solid' as const; },
    get name() { return 'Dark v1 (Solid)'; },
    get subtitle() { return 'Classic Abyss Solid'; },
    get category() { return 'dark' as const; },
    get description() { return CRYSTALL_THEMES['dark-v1'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-v1'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-v1'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-v1'].cssVars; }
  },
  'midnight-oled': {
    get id() { return 'dark-v2' as CrystallThemeId; },
    get versionBadge() { return 'Version 2' as const; },
    get styleVariant() { return 'Acrylic' as const; },
    get name() { return 'Dark v2 (Acrylic)'; },
    get subtitle() { return 'Frosted Mica Night'; },
    get category() { return 'dark' as const; },
    get description() { return CRYSTALL_THEMES['dark-v2'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-v2'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-v2'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-v2'].cssVars; }
  },
  'slate-navy': {
    get id() { return 'dark-v3' as CrystallThemeId; },
    get versionBadge() { return 'Version 3' as const; },
    get styleVariant() { return 'Glass' as const; },
    get name() { return 'Dark v3 (Glass)'; },
    get subtitle() { return 'Liquid Crystal Glass'; },
    get category() { return 'glass' as const; },
    get description() { return CRYSTALL_THEMES['dark-v3'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-v3'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-v3'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-v3'].cssVars; }
  },
  'light-classic': {
    get id() { return 'light-v1' as CrystallThemeId; },
    get versionBadge() { return 'Version 1' as const; },
    get styleVariant() { return 'Solid' as const; },
    get name() { return 'Light v1 (Solid)'; },
    get subtitle() { return 'Studio Clean Light'; },
    get category() { return 'light' as const; },
    get description() { return CRYSTALL_THEMES['light-v1'].description; },
    get previewColors() { return CRYSTALL_THEMES['light-v1'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['light-v1'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['light-v1'].cssVars; }
  },
  'warm-paper': {
    get id() { return 'light-v2' as CrystallThemeId; },
    get versionBadge() { return 'Version 2' as const; },
    get styleVariant() { return 'Acrylic' as const; },
    get name() { return 'Light v2 (Acrylic)'; },
    get subtitle() { return 'Frosted Daylight Mica'; },
    get category() { return 'light' as const; },
    get description() { return CRYSTALL_THEMES['light-v2'].description; },
    get previewColors() { return CRYSTALL_THEMES['light-v2'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['light-v2'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['light-v2'].cssVars; }
  },
  'acrylic-glass': {
    get id() { return 'dark-v2' as CrystallThemeId; },
    get versionBadge() { return 'Version 2' as const; },
    get styleVariant() { return 'Acrylic' as const; },
    get name() { return 'Dark v2 (Acrylic)'; },
    get subtitle() { return 'Frosted Mica Night'; },
    get category() { return 'dark' as const; },
    get description() { return CRYSTALL_THEMES['dark-v2'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-v2'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-v2'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-v2'].cssVars; }
  }
};

export const FIGMA_THEMES: CrystallTheme[] = [
  CRYSTALL_THEMES['dark-v1'],
  CRYSTALL_THEMES['dark-v2'],
  CRYSTALL_THEMES['dark-v3'],
  CRYSTALL_THEMES['light-v1'],
  CRYSTALL_THEMES['light-v2'],
  CRYSTALL_THEMES['light-v3']
];

export const DEFAULT_THEME: CrystallThemeId = 'dark-v1';

export function resolveTheme(themeId?: string | null): CrystallTheme {
  if (!themeId) return CRYSTALL_THEMES[DEFAULT_THEME];
  const t = CRYSTALL_THEMES[themeId as CrystallThemeId];
  if (t) return t;
  return CRYSTALL_THEMES[DEFAULT_THEME];
}

export function applyThemeVariables(themeId: CrystallThemeId): void {
  const theme = resolveTheme(themeId);
  const root = document.documentElement;

  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-theme-category', theme.category);
  root.setAttribute('data-theme-variant', theme.styleVariant.toLowerCase());

  if (theme.category === 'light') {
    root.style.colorScheme = 'light';
  } else {
    root.style.colorScheme = 'dark';
  }

  Object.entries(theme.cssVars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
}
