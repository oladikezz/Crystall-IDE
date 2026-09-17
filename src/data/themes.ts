import { CrystallTheme, CrystallThemeId } from '../types';

export const CRYSTALL_THEMES: Record<CrystallThemeId, CrystallTheme> = {
  // 1. ЧЕРНЫЙ ОБЫЧНЫЙ (Dark Solid)
  'dark-solid': {
    id: 'dark-solid',
    versionBadge: 'Черный обычный',
    styleVariant: 'Обычный',
    name: 'Черный обычный',
    subtitle: 'Classic Solid Dark',
    category: 'dark',
    description: 'Классическая тёмная тема из Figma. Сплошной обсидиановый фон без прозрачностей и фирменный янтарный акцент.',
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
      '--input-bg': '#08090d',
      '--modal-overlay': 'rgba(0, 0, 0, 0.65)',
      '--tab-active-bg': '#0c0e14',
      '--tab-inactive-bg': '#0e1017',
      '--app-backdrop': 'none',
      '--app-filter': 'none'
    }
  },

  // 2. ЧЕРНЫЙ ПРОЗРАЧНЫЙ (Dark Liquid Glass / iOS Glass)
  'dark-transparent': {
    id: 'dark-transparent',
    versionBadge: 'Черный прозрачный',
    styleVariant: 'Прозрачный',
    name: 'Черный прозрачный',
    subtitle: 'iOS Liquid Glass Dark',
    category: 'glass',
    description: 'Ультра-прозрачное жидкое стекло в стиле iOS (Apple Liquid Glass). Настоящая прозрачность с глубоким размытием фона (Apple Blur), зеркальными бликами и отражениями.',
    previewColors: {
      bg: 'rgba(10, 14, 23, 0.22)',
      panel: 'rgba(255, 255, 255, 0.05)',
      accent: '#f97316',
      text: '#ffffff',
      border: 'rgba(255, 255, 255, 0.16)'
    },
    monacoTheme: 'crystall-dark-v2',
    cssVars: {
      '--bg-app': 'rgba(10, 14, 23, 0.22)',
      '--bg-header': 'rgba(255, 255, 255, 0.03)',
      '--bg-editor': 'transparent',
      '--bg-panel': 'rgba(0, 0, 0, 0.10)',
      '--bg-card': 'rgba(255, 255, 255, 0.06)',
      '--bg-statusbar': 'rgba(0, 0, 0, 0.16)',
      '--bg-modal': 'rgba(10, 14, 23, 0.40)',
      '--border-color': 'rgba(255, 255, 255, 0.12)',
      '--text-primary': '#ffffff',
      '--text-secondary': '#cbd5e1',
      '--text-muted': '#94a3b8',
      '--accent-primary': '#f97316',
      '--accent-hover': '#fb923c',
      '--accent-glow': 'rgba(249, 115, 22, 0.45)',
      '--hover-bg': 'rgba(255, 255, 255, 0.08)',
      '--status-badge-bg': 'rgba(249, 115, 22, 0.20)',
      '--status-badge-text': '#fed7aa',
      '--status-badge-border': 'rgba(249, 115, 22, 0.45)',
      '--chat-user-bg': 'rgba(255, 255, 255, 0.10)',
      '--chat-assistant-bg': 'rgba(0, 0, 0, 0.22)',
      '--chat-input-bg': 'rgba(0, 0, 0, 0.25)',
      '--input-bg': 'rgba(0, 0, 0, 0.25)',
      '--modal-overlay': 'rgba(0, 0, 0, 0.45)',
      '--tab-active-bg': 'rgba(255, 255, 255, 0.10)',
      '--tab-inactive-bg': 'transparent',
      '--app-backdrop': 'none',
      '--app-filter': 'blur(40px) saturate(190%) contrast(108%)'
    }
  },

  // 3. БЕЛЫЙ ОБЫЧНЫЙ (Light Solid)
  'light-solid': {
    id: 'light-solid',
    versionBadge: 'Белый обычный',
    styleVariant: 'Обычный',
    name: 'Белый обычный',
    subtitle: 'Studio Clean Light',
    category: 'light',
    description: 'Оригинальная дневная тема из Figma. Сплошной белый фон, светлые контрастные панели и студийный оранжевый акцент.',
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
      '--accent-glow': 'rgba(234, 88, 12, 0.20)',
      '--hover-bg': 'rgba(0, 0, 0, 0.04)',
      '--status-badge-bg': 'rgba(234, 88, 12, 0.10)',
      '--status-badge-text': '#c2410c',
      '--status-badge-border': 'rgba(234, 88, 12, 0.30)',
      '--chat-user-bg': '#f1f5f9',
      '--chat-assistant-bg': '#f8fafc',
      '--chat-input-bg': '#ffffff',
      '--input-bg': '#f1f5f9',
      '--modal-overlay': 'rgba(0, 0, 0, 0.25)',
      '--tab-active-bg': '#fff7ed',
      '--tab-inactive-bg': '#ffffff',
      '--app-backdrop': 'none',
      '--app-filter': 'none'
    }
  },

  // 4. БЕЛЫЙ ПРОЗРАЧНЫЙ (Light Liquid Glass / iOS Frosted)
  'light-transparent': {
    id: 'light-transparent',
    versionBadge: 'Белый прозрачный',
    styleVariant: 'Прозрачный',
    name: 'Белый прозрачный',
    subtitle: 'iOS Liquid Glass Light',
    category: 'glass',
    description: 'Светлое ультра-прозрачное жидкое стекло в стиле iOS. Хрустальная прозрачность с мягким оптическим размытием, шелковистыми бликами и четким контрастным текстом.',
    previewColors: {
      bg: 'rgba(255, 255, 255, 0.28)',
      panel: 'rgba(255, 255, 255, 0.15)',
      accent: '#ea580c',
      text: '#0f172a',
      border: 'rgba(255, 255, 255, 0.40)'
    },
    monacoTheme: 'crystall-light-v2',
    cssVars: {
      '--bg-app': 'rgba(255, 255, 255, 0.25)',
      '--bg-header': 'rgba(255, 255, 255, 0.15)',
      '--bg-editor': 'transparent',
      '--bg-panel': 'rgba(255, 255, 255, 0.12)',
      '--bg-card': 'rgba(255, 255, 255, 0.35)',
      '--bg-statusbar': 'rgba(255, 255, 255, 0.20)',
      '--bg-modal': 'rgba(255, 255, 255, 0.50)',
      '--border-color': 'rgba(255, 255, 255, 0.40)',
      '--text-primary': '#0f172a',
      '--text-secondary': '#334155',
      '--text-muted': '#64748b',
      '--accent-primary': '#ea580c',
      '--accent-hover': '#c2410c',
      '--accent-glow': 'rgba(234, 88, 12, 0.30)',
      '--hover-bg': 'rgba(0, 0, 0, 0.05)',
      '--status-badge-bg': 'rgba(234, 88, 12, 0.12)',
      '--status-badge-text': '#c2410c',
      '--status-badge-border': 'rgba(234, 88, 12, 0.35)',
      '--chat-user-bg': 'rgba(255, 255, 255, 0.45)',
      '--chat-assistant-bg': 'rgba(255, 255, 255, 0.22)',
      '--chat-input-bg': 'rgba(255, 255, 255, 0.35)',
      '--input-bg': 'rgba(255, 255, 255, 0.45)',
      '--modal-overlay': 'rgba(0, 0, 0, 0.20)',
      '--tab-active-bg': 'rgba(255, 255, 255, 0.45)',
      '--tab-inactive-bg': 'transparent',
      '--app-backdrop': 'none',
      '--app-filter': 'blur(40px) saturate(190%) contrast(108%)'
    }
  },

  // Backward-compatible Aliases
  'dark-v1': {
    get id() { return 'dark-solid' as CrystallThemeId; },
    get versionBadge() { return 'Черный обычный'; },
    get styleVariant() { return 'Обычный'; },
    get name() { return 'Черный обычный'; },
    get subtitle() { return 'Classic Solid Dark'; },
    get category() { return 'dark' as const; },
    get description() { return CRYSTALL_THEMES['dark-solid'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-solid'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-solid'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-solid'].cssVars; }
  },
  'dark-v2': {
    get id() { return 'dark-transparent' as CrystallThemeId; },
    get versionBadge() { return 'Черный прозрачный'; },
    get styleVariant() { return 'Прозрачный'; },
    get name() { return 'Черный прозрачный'; },
    get subtitle() { return 'Acrylic Glass Dark'; },
    get category() { return 'glass' as const; },
    get description() { return CRYSTALL_THEMES['dark-transparent'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-transparent'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-transparent'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-transparent'].cssVars; }
  },
  'dark-v3': {
    get id() { return 'dark-transparent' as CrystallThemeId; },
    get versionBadge() { return 'Черный прозрачный'; },
    get styleVariant() { return 'Прозрачный'; },
    get name() { return 'Черный прозрачный'; },
    get subtitle() { return 'Acrylic Glass Dark'; },
    get category() { return 'glass' as const; },
    get description() { return CRYSTALL_THEMES['dark-transparent'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-transparent'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-transparent'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-transparent'].cssVars; }
  },
  'light-v1': {
    get id() { return 'light-solid' as CrystallThemeId; },
    get versionBadge() { return 'Белый обычный'; },
    get styleVariant() { return 'Обычный'; },
    get name() { return 'Белый обычный'; },
    get subtitle() { return 'Studio Clean Light'; },
    get category() { return 'light' as const; },
    get description() { return CRYSTALL_THEMES['light-solid'].description; },
    get previewColors() { return CRYSTALL_THEMES['light-solid'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['light-solid'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['light-solid'].cssVars; }
  },
  'light-v2': {
    get id() { return 'light-transparent' as CrystallThemeId; },
    get versionBadge() { return 'Белый прозрачный'; },
    get styleVariant() { return 'Прозрачный'; },
    get name() { return 'Белый прозрачный'; },
    get subtitle() { return 'Crystal Daylight Glass'; },
    get category() { return 'glass' as const; },
    get description() { return CRYSTALL_THEMES['light-transparent'].description; },
    get previewColors() { return CRYSTALL_THEMES['light-transparent'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['light-transparent'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['light-transparent'].cssVars; }
  },
  'light-v3': {
    get id() { return 'light-transparent' as CrystallThemeId; },
    get versionBadge() { return 'Белый прозрачный'; },
    get styleVariant() { return 'Прозрачный'; },
    get name() { return 'Белый прозрачный'; },
    get subtitle() { return 'Crystal Daylight Glass'; },
    get category() { return 'glass' as const; },
    get description() { return CRYSTALL_THEMES['light-transparent'].description; },
    get previewColors() { return CRYSTALL_THEMES['light-transparent'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['light-transparent'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['light-transparent'].cssVars; }
  },
  'dark-charcoal': {
    get id() { return 'dark-solid' as CrystallThemeId; },
    get versionBadge() { return 'Черный обычный'; },
    get styleVariant() { return 'Обычный'; },
    get name() { return 'Черный обычный'; },
    get subtitle() { return 'Classic Solid Dark'; },
    get category() { return 'dark' as const; },
    get description() { return CRYSTALL_THEMES['dark-solid'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-solid'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-solid'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-solid'].cssVars; }
  },
  'midnight-oled': {
    get id() { return 'dark-transparent' as CrystallThemeId; },
    get versionBadge() { return 'Черный прозрачный'; },
    get styleVariant() { return 'Прозрачный'; },
    get name() { return 'Черный прозрачный'; },
    get subtitle() { return 'Acrylic Glass Dark'; },
    get category() { return 'glass' as const; },
    get description() { return CRYSTALL_THEMES['dark-transparent'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-transparent'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-transparent'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-transparent'].cssVars; }
  },
  'slate-navy': {
    get id() { return 'dark-transparent' as CrystallThemeId; },
    get versionBadge() { return 'Черный прозрачный'; },
    get styleVariant() { return 'Прозрачный'; },
    get name() { return 'Черный прозрачный'; },
    get subtitle() { return 'Acrylic Glass Dark'; },
    get category() { return 'glass' as const; },
    get description() { return CRYSTALL_THEMES['dark-transparent'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-transparent'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-transparent'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-transparent'].cssVars; }
  },
  'light-classic': {
    get id() { return 'light-solid' as CrystallThemeId; },
    get versionBadge() { return 'Белый обычный'; },
    get styleVariant() { return 'Обычный'; },
    get name() { return 'Белый обычный'; },
    get subtitle() { return 'Studio Clean Light'; },
    get category() { return 'light' as const; },
    get description() { return CRYSTALL_THEMES['light-solid'].description; },
    get previewColors() { return CRYSTALL_THEMES['light-solid'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['light-solid'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['light-solid'].cssVars; }
  },
  'warm-paper': {
    get id() { return 'light-transparent' as CrystallThemeId; },
    get versionBadge() { return 'Белый прозрачный'; },
    get styleVariant() { return 'Прозрачный'; },
    get name() { return 'Белый прозрачный'; },
    get subtitle() { return 'Crystal Daylight Glass'; },
    get category() { return 'glass' as const; },
    get description() { return CRYSTALL_THEMES['light-transparent'].description; },
    get previewColors() { return CRYSTALL_THEMES['light-transparent'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['light-transparent'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['light-transparent'].cssVars; }
  },
  'acrylic-glass': {
    get id() { return 'dark-transparent' as CrystallThemeId; },
    get versionBadge() { return 'Черный прозрачный'; },
    get styleVariant() { return 'Прозрачный'; },
    get name() { return 'Черный прозрачный'; },
    get subtitle() { return 'Acrylic Glass Dark'; },
    get category() { return 'glass' as const; },
    get description() { return CRYSTALL_THEMES['dark-transparent'].description; },
    get previewColors() { return CRYSTALL_THEMES['dark-transparent'].previewColors; },
    get monacoTheme() { return CRYSTALL_THEMES['dark-transparent'].monacoTheme; },
    get cssVars() { return CRYSTALL_THEMES['dark-transparent'].cssVars; }
  }
};

// Exactly the 4 Themes from Figma:
// 1. Черный обычный
// 2. Черный прозрачный
// 3. Белый обычный
// 4. Белый прозрачный
export const FIGMA_THEMES: CrystallTheme[] = [
  CRYSTALL_THEMES['dark-solid'],
  CRYSTALL_THEMES['dark-transparent'],
  CRYSTALL_THEMES['light-solid'],
  CRYSTALL_THEMES['light-transparent']
];

export const DEFAULT_THEME: CrystallThemeId = 'dark-solid';

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
