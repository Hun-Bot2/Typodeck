// Canonical theme normalization: any design.md front-matter -> one theme shape
// the generic builder can compose from. Per-slug maps are explicit (each
// design names its own tokens); the generic builder never guesses colors.

import { SpecError } from './spec.mjs';

// Canonical slots: bg, ink, accent, muted, line, panel.
const COLOR_MAP = {
  'atelier-noir': { bg: 'noir', ink: 'porcelain', accent: 'wine', muted: 'gallery-gray', line: 'soft-line', panel: 'noir' },
  'bubble-os': { bg: 'card-white', ink: 'deep-indigo', accent: 'bubblegum', muted: 'indigo-soft', line: 'ice-deep', panel: 'ice-blue' },
  'chapter-verse': { bg: 'cream', ink: 'ink', accent: 'oxblood', muted: 'smoke', line: 'tan', panel: 'cream' },
  'coin-op': { bg: 'void', ink: 'bone', accent: 'phosphor', muted: 'bone-dim', line: 'phosphor-dim', panel: 'void-panel' },
  'cut-paste': { bg: 'paper', ink: 'ink', accent: 'red', muted: 'ink', line: 'ink', panel: 'scrap' },
  'dessau': { bg: 'white', ink: 'black', accent: 'red', muted: 'black', line: 'black', panel: 'white' },
  'drafting-table': { bg: 'blueprint', ink: 'line-white', accent: 'amber', muted: 'pale-blue', line: 'light-line', panel: 'blueprint-deep' },
  'field-manual': { bg: 'paper', ink: 'ink', accent: 'procedural-blue', muted: 'muted', line: 'muted', panel: 'box-fill' },
  'fieldnote': { bg: 'kraft', ink: 'moss-ink', accent: 'clay', muted: 'leaf', line: 'kraft-deep', panel: 'wash-white' },
  'fika': { bg: 'off-white', ink: 'slate', accent: 'dusty-blue', muted: 'slate', line: 'sage', panel: 'white' },
  'front-page': { bg: 'newsprint', ink: 'ink', accent: 'dark-red', muted: 'gray', line: 'keyline', panel: 'white' },
  'gilded-line': { bg: 'lacquer-black', ink: 'champagne', accent: 'gold', muted: 'warm-gray', line: 'deep-gold', panel: 'lacquer-black' },
  'gridline-swiss': { bg: 'white', ink: 'ink', accent: 'signal-red', muted: 'muted', line: 'ink', panel: 'rail-gray' },
  'iron-press': { bg: 'aged-paper', ink: 'ink', accent: 'oxblood', muted: 'gray', line: 'gray', panel: 'paper-deep' },
  'ma': { bg: 'warm-white', ink: 'sumi', accent: 'shu-red', muted: 'sumi', line: 'stone', panel: 'warm-white' },
  'maison': { bg: 'black', ink: 'ivory', accent: 'gold', muted: 'gray', line: 'gray-line', panel: 'black-soft' },
  'memphis-squiggle': { bg: 'cream', ink: 'ink', accent: 'pink', muted: 'purple', line: 'purple', panel: 'white' },
  'modulo-grid': { bg: 'white', ink: 'deep', accent: 'amber', muted: 'deep-soft', line: 'silver', panel: 'silver' },
  'monolith': { bg: 'black', ink: 'bone', accent: 'signal-orange', muted: 'dim', line: 'dim', panel: 'slab-black' },
  'new-wave-static': { bg: 'paper-white', ink: 'signal-black', accent: 'static-magenta', muted: 'signal-black', line: 'signal-black', panel: 'paper-white' },
  'night-reel': { bg: 'black', ink: 'white', accent: 'blood-red', muted: 'smoke', line: 'bar-line', panel: 'spotlight' },
  'peer-review': { bg: 'white', ink: 'ink', accent: 'link-blue', muted: 'muted', line: 'rule-gray', panel: 'abstract-tint' },
  'seminar': { bg: 'white', ink: 'ink', accent: 'navy', muted: 'gray', line: 'hairline', panel: 'white' },
  'signal-board': { bg: 'mist', ink: 'slate', accent: 'signal-blue', muted: 'muted', line: 'row-rule', panel: 'white' },
  'tty-paper': { bg: 'paper', ink: 'ink', accent: 'green', muted: 'dim', line: 'faint-line', panel: 'white' },
  'vista': { bg: 'cream-white', ink: 'deep-teal', accent: 'burnt-orange', muted: 'deep-teal', line: 'sand', panel: 'sand' },
  'whiplash': { bg: 'parchment', ink: 'deep-green', accent: 'bronze', muted: 'deep-green', line: 'bronze', panel: 'parchment' },
};

// Canonical roles: display, title, kicker, body, caption, numeral.
const ROLE_MAP = {
  'atelier-noir': { display: 'runway-hero', title: 'display', kicker: 'gallery-label', body: 'body', caption: 'context-line', numeral: 'display' },
  'bubble-os': { display: 'bubble-hero', title: 'display', kicker: 'label-pill', body: 'body', caption: 'caption', numeral: 'display' },
  'chapter-verse': { display: 'chapter-title', title: 'section-title', kicker: 'kicker', body: 'body', caption: 'folio', numeral: 'page-mark' },
  'coin-op': { display: 'crt-hero', title: 'display', kicker: 'marquee', body: 'body', caption: 'body-small', numeral: 'stat-number' },
  'cut-paste': { display: 'shout', title: 'shout-first-line', kicker: 'scrap-text', body: 'body', caption: 'hand-note', numeral: 'badge-numeral' },
  'dessau': { display: 'bauhaus-display', title: 'bauhaus-subtitle', kicker: 'bauhaus-label', body: 'bauhaus-body', caption: 'bauhaus-context', numeral: 'bauhaus-numeral' },
  'drafting-table': { display: 'display', title: 'headline', kicker: 'dimension-tag', body: 'body', caption: 'drawing-tag', numeral: 'stamp-mark' },
  'field-manual': { display: 'manual-title', title: 'section-head', kicker: 'section-tag', body: 'body', caption: 'figure-tag', numeral: 'step-label' },
  'fieldnote': { display: 'field-title', title: 'section-title', kicker: 'context-caps', body: 'body-grotesque', caption: 'hand-caption', numeral: 'tally-numeral' },
  'fika': { display: 'hero', title: 'headline', kicker: 'label', body: 'body', caption: 'caption', numeral: 'data-numeral' },
  'front-page': { display: 'nameplate', title: 'wood-headline', kicker: 'kicker', body: 'body-column', caption: 'caption', numeral: 'folio-line' },
  'gilded-line': { display: 'deco-display', title: 'deco-subtitle', kicker: 'deco-kicker', body: 'deco-context', caption: 'deco-colophon', numeral: 'deco-display' },
  'gridline-swiss': { display: 'display-xl', title: 'display', kicker: 'kicker', body: 'body', caption: 'caption', numeral: 'index-numeral' },
  'iron-press': { display: 'hero', title: 'headline', kicker: 'smallcaps', body: 'body', caption: 'caption', numeral: 'page-mark' },
  'ma': { display: 'zen-display', title: 'zen-subtitle', kicker: 'zen-context', body: 'zen-body', caption: 'zen-context', numeral: 'zen-numeral' },
  'maison': { display: 'maison-hero', title: 'display', kicker: 'label-folio', body: 'body', caption: 'body-small', numeral: 'counter' },
  'memphis-squiggle': { display: 'party-title', title: 'section-head', kicker: 'chip-label', body: 'body', caption: 'caption', numeral: 'counter' },
  'modulo-grid': { display: 'module-hero', title: 'display', kicker: 'label-kicker', body: 'body', caption: 'caption', numeral: 'stat-number' },
  'monolith': { display: 'mega', title: 'display', kicker: 'strip-label', body: 'body', caption: 'body-compact', numeral: 'case-count' },
  'new-wave-static': { display: 'poster-shout', title: 'poster-shout', kicker: 'kicker-caps', body: 'deck-sub', caption: 'context-chip', numeral: 'band-caps' },
  'night-reel': { display: 'credit-title', title: 'section-title', kicker: 'kicker', body: 'body-light', caption: 'context-line', numeral: 'scene-count' },
  'peer-review': { display: 'article-title', title: 'section-head', kicker: 'kicker', body: 'body-serif', caption: 'figure-label', numeral: 'figure-title' },
  'seminar': { display: 'argument-title', title: 'section-title', kicker: 'marker', body: 'body', caption: 'footnote', numeral: 'page-number' },
  'signal-board': { display: 'dashboard-hero', title: 'dashboard-hero', kicker: 'pill-label', body: 'data-row', caption: 'footer-mono', numeral: 'kpi-numeral' },
  'tty-paper': { display: 'session-title', title: 'section-head', kicker: 'label-dim', body: 'body', caption: 'comment-line', numeral: 'counter' },
  'vista': { display: 'hero', title: 'headline', kicker: 'label', body: 'body', caption: 'caption', numeral: 'badge-numeral' },
  'whiplash': { display: 'nouveau-display', title: 'nouveau-subtitle', kicker: 'nouveau-context', body: 'nouveau-body', caption: 'nouveau-context', numeral: 'nouveau-display' },
};

const HEX = /^#[0-9a-fA-F]{3,8}$/;

function firstFamily(fontFamily) {
  const m = String(fontFamily ?? '').match(/'([^']+)'|"([^"]+)"/);
  if (m) return (m[1] ?? m[2]).trim();
  const head = String(fontFamily ?? '').split(',')[0].trim();
  return head || 'sans-serif';
}

function num(v, fallback) {
  if (typeof v === 'number') return v;
  const m = String(v ?? '').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : fallback;
}

/** Normalize one design's front-matter tokens to the canonical theme. */
export function toTheme(tokens, slug) {
  const cmap = COLOR_MAP[slug];
  const rmap = ROLE_MAP[slug];
  if (!cmap || !rmap) throw new SpecError(`${slug}: no theme map (add COLOR_MAP + ROLE_MAP entry)`);
  const colors = {};
  for (const [slot, key] of Object.entries(cmap)) {
    const v = tokens.colors?.[key];
    if (typeof v !== 'string' || !HEX.test(v.trim())) {
      throw new SpecError(`${slug}: colors.${key} missing or not a hex color`);
    }
    colors[slot] = v.trim();
  }
  const type = {};
  for (const [slot, role] of Object.entries(rmap)) {
    const tok = tokens.typography?.[role];
    if (!tok || typeof tok !== 'object') throw new SpecError(`${slug}: typography.${role} missing`);
    type[slot] = {
      role,
      family: tok.fontFamily ?? 'sans-serif',
      firstFamily: firstFamily(tok.fontFamily),
      size: num(tok.fontSize, 24),
      weight: num(tok.fontWeight, 400),
      lineHeight: num(tok.lineHeight, 1.4),
      letterSpacing: tok.letterSpacing ?? 'normal',
      textTransform: tok.textTransform ?? 'none',
    };
  }
  return { slug, colors, type };
}

/** Google Fonts css2 href covering the theme's display/body/kicker faces. */
export function latinFontsHref(theme) {
  const fams = new Map();
  for (const slot of ['display', 'title', 'kicker', 'body']) {
    const t = theme.type[slot];
    const name = t.firstFamily;
    if (!name || /^(sans-serif|serif|monospace|Georgia|Arial|Helvetica)$/i.test(name)) continue;
    if (!fams.has(name)) fams.set(name, new Set());
    fams.get(name).add(Math.round(t.weight / 100) * 100);
  }
  if (fams.size === 0) return null;
  const parts = [...fams.entries()].map(([n, w]) =>
    `family=${n.replace(/ +/g, '+')}:wght@${[...w].sort((a, b) => a - b).join(';')}`);
  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}

export const PRETENDARD_CSS =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';
export const NOTO_KR_CSS =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap';

// Per C-ko-typography research: Korean runs use Pretendard primary with
// Noto Sans KR + system fallbacks; Latin display face retained for numerals.
export function koStacks(theme) {
  const latin = theme.type.display.firstFamily;
  const ko = (w) => ({
    family: `'Pretendard Variable', Pretendard, 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`,
    weight: w,
  });
  return {
    display: ko(800), title: ko(700), kicker: ko(700),
    body: ko(400), caption: ko(500),
    numeral: { family: `'${latin}', 'Pretendard Variable', sans-serif`, weight: 800 },
  };
}
