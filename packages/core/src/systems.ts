// Typodeck Typography Core — the three typography systems.
// Each system shares content but dictates a materially different composition:
// different grid/placement/scale strategy, not just different colors.

import type { TextAlign, TextRole } from './schema';

export type SystemId = 'editorial' | 'swiss' | 'expressive' | 'document';

export const SYSTEM_IDS: readonly SystemId[] = ['editorial', 'swiss', 'expressive', 'document'];

/** Role -> default presentation. Sizes in points. */
export interface RoleStyle {
  fontSize: number;
  minFontSize: number;
  fontWeight: 300 | 400 | 500 | 700 | 900;
  tracking: number;
  lineHeight: number;
  align: TextAlign;
}

export interface TypographySystem {
  id: SystemId;
  /** Ordered fallback chains; first entry is the preferred face. KR-capable. */
  fonts: {
    heading: string[];
    body: string[];
  };
  scale: Record<TextRole, RoleStyle>;
  /** Vertical rhythm step in inches between stacked blocks. */
  rhythm: number;
  /** Side margin in inches. */
  margin: number;
  /** Placement strategy tag consumed by the layout engine. */
  placement: 'asymmetric-stack' | 'grid-columns' | 'centered-hero' | 'hierarchy-stack';
  colors: {
    background: string;
    backgroundAlt: string;
    ink: string;
    accent: string;
    muted: string;
  };
}

const KR_SANS = ['"Noto Sans KR"', 'system-ui', 'sans-serif'];

export const EDITORIAL: TypographySystem = {
  id: 'editorial',
  fonts: {
    heading: ['"Noto Serif KR"', '"Source Serif 4"', 'Georgia', 'serif'],
    body: ['Pretendard', 'Inter', ...KR_SANS],
  },
  scale: {
    // Refined asymmetric whitespace; one large idea per slide.
    kicker: { fontSize: 11, minFontSize: 9, fontWeight: 500, tracking: 0.28, lineHeight: 1.4, align: 'left' },
    title: { fontSize: 46, minFontSize: 24, fontWeight: 700, tracking: -0.01, lineHeight: 1.12, align: 'left' },
    body: { fontSize: 15, minFontSize: 10, fontWeight: 400, tracking: 0, lineHeight: 1.6, align: 'left' },
    number: { fontSize: 120, minFontSize: 60, fontWeight: 700, tracking: -0.02, lineHeight: 1.0, align: 'left' },
    caption: { fontSize: 10, minFontSize: 8, fontWeight: 400, tracking: 0.04, lineHeight: 1.5, align: 'left' },
  },
  rhythm: 0.32,
  margin: 1.0,
  placement: 'asymmetric-stack',
  colors: {
    background: '#FAF7F2',
    backgroundAlt: '#FAF7F2',
    ink: '#1A1A1A',
    accent: '#9A3B26',
    muted: '#6B6B6B',
  },
};

export const SWISS: TypographySystem = {
  id: 'swiss',
  fonts: {
    heading: ['Inter', '"Helvetica Neue"', ...KR_SANS],
    body: ['Inter', '"Helvetica Neue"', ...KR_SANS],
  },
  scale: {
    // Rigorous grid, multi-column, high density, tight leading.
    kicker: { fontSize: 10, minFontSize: 8, fontWeight: 700, tracking: 0.18, lineHeight: 1.3, align: 'left' },
    title: { fontSize: 30, minFontSize: 18, fontWeight: 700, tracking: -0.015, lineHeight: 1.08, align: 'left' },
    body: { fontSize: 12, minFontSize: 8, fontWeight: 400, tracking: 0, lineHeight: 1.45, align: 'left' },
    number: { fontSize: 72, minFontSize: 40, fontWeight: 700, tracking: -0.02, lineHeight: 1.0, align: 'left' },
    caption: { fontSize: 9, minFontSize: 7, fontWeight: 400, tracking: 0.02, lineHeight: 1.4, align: 'right' },
  },
  rhythm: 0.22,
  margin: 0.6,
  placement: 'grid-columns',
  colors: {
    background: '#FFFFFF',
    backgroundAlt: '#FFFFFF',
    ink: '#111111',
    accent: '#E30613',
    muted: '#6E6E6E',
  },
};

export const EXPRESSIVE: TypographySystem = {
  id: 'expressive',
  fonts: {
    heading: ['"Archivo Black"', 'Inter', ...KR_SANS],
    body: ['Pretendard', 'Inter', ...KR_SANS],
  },
  scale: {
    // Dramatic centered scale contrast; extreme hero:body ratio.
    kicker: { fontSize: 12, minFontSize: 9, fontWeight: 700, tracking: 0.34, lineHeight: 1.4, align: 'center' },
    title: { fontSize: 64, minFontSize: 30, fontWeight: 900, tracking: -0.01, lineHeight: 1.05, align: 'center' },
    body: { fontSize: 14, minFontSize: 9, fontWeight: 400, tracking: 0, lineHeight: 1.6, align: 'center' },
    number: { fontSize: 170, minFontSize: 80, fontWeight: 900, tracking: -0.02, lineHeight: 0.95, align: 'center' },
    caption: { fontSize: 10, minFontSize: 8, fontWeight: 500, tracking: 0.08, lineHeight: 1.5, align: 'center' },
  },
  rhythm: 0.3,
  margin: 0.7,
  placement: 'centered-hero',
  colors: {
    background: '#0E0E0E',
    backgroundAlt: '#F5F2EA',
    ink: '#F5F2EA',
    accent: '#FFD400',
    muted: '#9A9A9A',
  },
};

/** Experimental (registry status): technical-manual voice. See research/implementation_notes.md. */
export const DOCUMENT: TypographySystem = {
  id: 'document',
  fonts: {
    heading: ['Inter', '"Helvetica Neue"', ...KR_SANS],
    body: ['Inter', '"Helvetica Neue"', ...KR_SANS],
  },
  scale: {
    // Dense reference hierarchy; section markers live in the meta column.
    kicker: { fontSize: 10, minFontSize: 8, fontWeight: 700, tracking: 0.22, lineHeight: 1.3, align: 'left' },
    title: { fontSize: 34, minFontSize: 20, fontWeight: 700, tracking: -0.01, lineHeight: 1.15, align: 'left' },
    body: { fontSize: 12.5, minFontSize: 8, fontWeight: 400, tracking: 0, lineHeight: 1.5, align: 'left' },
    number: { fontSize: 60, minFontSize: 36, fontWeight: 700, tracking: -0.02, lineHeight: 1.0, align: 'left' },
    caption: { fontSize: 9, minFontSize: 7, fontWeight: 400, tracking: 0.02, lineHeight: 1.4, align: 'right' },
  },
  rhythm: 0.18,
  margin: 0.7,
  placement: 'hierarchy-stack',
  colors: {
    background: '#F1F4F6',
    backgroundAlt: '#F1F4F6',
    ink: '#16232E',
    accent: '#0F4CAA',
    muted: '#52606E',
  },
};

export const SYSTEMS: Record<SystemId, TypographySystem> = {
  editorial: EDITORIAL,
  swiss: SWISS,
  expressive: EXPRESSIVE,
  document: DOCUMENT,
};

export function getSystem(id: string): TypographySystem {
  const s = (SYSTEMS as Record<string, TypographySystem>)[id];
  if (!s) throw new Error(`unknown typography system "${id}" (want ${SYSTEM_IDS.join('|')})`);
  return s;
}

/** Resolve the exportable font face for a role (first chain entry, unquoted). */
export function fontFaceFor(system: TypographySystem, role: TextRole): string {
  const chain = role === 'title' || role === 'number' || role === 'kicker' ? system.fonts.heading : system.fonts.body;
  return chain[0].replace(/"/g, '');
}

/** Resolve the text color token for a role on a given background. */
export function colorFor(system: TypographySystem, role: TextRole, background: string): string {
  const c = system.colors;
  const onAlt = background.toLowerCase() === c.backgroundAlt.toLowerCase() && c.backgroundAlt !== c.background;
  const ink = onAlt ? c.background : c.ink;
  switch (role) {
    case 'kicker':
      // The expressive accent (yellow) is unreadable on the light alt
      // background (1.28:1), so alt slides use the dark ink token instead.
      return onAlt ? c.background : c.accent;
    case 'caption':
      return onAlt ? '#6B6B6B' : c.muted;
    default:
      return ink;
  }
}

/** Slide background for a slide index (expressive alternates ink/paper). */
export function backgroundFor(system: TypographySystem, slideIndex: number): string {
  if (system.id === 'expressive' && slideIndex % 2 === 1) return system.colors.backgroundAlt;
  return system.colors.background;
}

/** Theme shape mirrored here to avoid a composition→systems import cycle. */
export interface ThemeOverride {
  fonts?: { heading?: string[]; body?: string[] };
  colors?: {
    background?: string;
    backgroundAlt?: string;
    ink?: string;
    accent?: string;
    muted?: string;
  };
}

/**
 * Effective system for a themed candidate: same id/placement/scale,
 * fonts + colors merged from the theme. No theme = identity.
 */
export function themedSystem(system: TypographySystem, theme?: ThemeOverride): TypographySystem {
  if (!theme) return system;
  return {
    ...system,
    fonts: {
      heading: theme.fonts?.heading ?? system.fonts.heading,
      body: theme.fonts?.body ?? system.fonts.body,
    },
    colors: { ...system.colors, ...theme.colors },
  };
}
