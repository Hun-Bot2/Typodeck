// Stage-4 hierarchy eval: controlled defect seeds (deterministic, pure).
//
// Narrative-level seeds feed Arm A directly and flow through layout/revise
// for the BEFORE/AFTER arms. Deck-level seeds mutate positioned decks and
// are detection-only: reviseDeck re-lays-out from narrative bytes, so a
// deck mutation is outside the repair loop's input space by construction.
// Every seeder verifies its own predicate after mutation; inapplicable or
// unverified seeds return null and are recorded, never silently dropped.

import {
  checkCContrast,
  checkCGroupingSplit,
  checkCNumberScale,
  checkCPrimarySubordinate,
  checkCSupportClip,
  type SlideLike,
  type TextBlockLike,
} from './arms';
import { prominenceProxy } from './prominence';
import type { DefectCategory, SeedLevel, SeedSpec } from './types';
import type {
  Deck,
  Narrative,
  NarrativeBlock,
  Slide,
  TextBlock,
} from '../../../packages/core/dist/src/index.js';

// ---------------------------------------------------------------------------
// Narrative-level seeds (Arm A positives + BEFORE/AFTER inputs).
// ---------------------------------------------------------------------------

export interface NarrativeSeed {
  spec: Omit<SeedSpec, 'id'>;
  narrative: Narrative;
}

function cloneNarrative(n: Narrative): Narrative {
  return JSON.parse(JSON.stringify(n)) as Narrative;
}

function firstSlideBlocks(n: Narrative): NarrativeBlock[] {
  return n.slides[0].blocks;
}

/** headline-prominence/narrative: strip every emphasis annotation. */
export function seedStripEmphasis(
  fixtureId: string,
  narrative: Narrative,
): NarrativeSeed | null {
  const blocks = firstSlideBlocks(narrative);
  if (!blocks.some((b) => b.intent?.emphasis !== undefined)) return null;
  const next = cloneNarrative(narrative);
  for (const b of firstSlideBlocks(next)) {
    if (b.intent && 'emphasis' in b.intent) delete b.intent.emphasis;
  }
  return {
    spec: {
      fixtureId,
      category: 'headline-prominence',
      level: 'narrative',
      mutation: 'strip-emphasis: removed all emphasis annotations',
    },
    narrative: next,
  };
}

/** headline-prominence/narrative: move primary onto the first caption. */
export function seedPrimaryOnCaption(
  fixtureId: string,
  narrative: Narrative,
): NarrativeSeed | null {
  const blocks = firstSlideBlocks(narrative);
  const capIdx = blocks.findIndex((b) => b.role === 'caption');
  const primIdx = blocks.findIndex((b) => b.intent?.emphasis === 'primary');
  if (capIdx < 0 || primIdx < 0 || capIdx === primIdx) return null;
  const next = cloneNarrative(narrative);
  const nb = firstSlideBlocks(next);
  if (nb[primIdx].intent) nb[primIdx].intent!.emphasis = 'secondary';
  nb[capIdx].intent = { ...(nb[capIdx].intent ?? {}), emphasis: 'primary' };
  return {
    spec: {
      fixtureId,
      category: 'headline-prominence',
      level: 'narrative',
      mutation: `primary-on-caption: moved primary from #${primIdx} to caption #${capIdx}`,
    },
    narrative: next,
  };
}

/** grouping/narrative: leave the first multi-member group with one member. */
export function seedDangleGroup(
  fixtureId: string,
  narrative: Narrative,
): NarrativeSeed | null {
  const blocks = firstSlideBlocks(narrative);
  const byGroup = new Map<string, number[]>();
  blocks.forEach((b, i) => {
    const gid = b.intent?.groupId;
    if (typeof gid === 'string' && gid.length > 0) {
      const list = byGroup.get(gid) ?? [];
      list.push(i);
      byGroup.set(gid, list);
    }
  });
  const entry = [...byGroup.entries()].find(([, m]) => m.length >= 2);
  if (!entry) return null;
  const [gid, members] = entry;
  const next = cloneNarrative(narrative);
  const nb = firstSlideBlocks(next);
  for (const i of members.slice(1)) {
    if (nb[i].intent && 'groupId' in nb[i].intent!) {
      const { groupId: _drop, ...rest } = nb[i].intent!;
      void _drop;
      nb[i].intent = rest;
    }
  }
  return {
    spec: {
      fixtureId,
      category: 'grouping',
      level: 'narrative',
      mutation: `dangle-group: group ${gid} reduced ${members.length} -> 1 member`,
    },
    narrative: next,
  };
}

export function narrativeSeeds(
  fixtureId: string,
  narrative: Narrative,
): NarrativeSeed[] {
  const out: NarrativeSeed[] = [];
  for (const s of [
    seedStripEmphasis(fixtureId, narrative),
    seedPrimaryOnCaption(fixtureId, narrative),
    seedDangleGroup(fixtureId, narrative),
  ]) {
    if (s) out.push(s);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Deck-level seeds (Arm C positives; detection-only, see header).
// ---------------------------------------------------------------------------

export interface DeckSeed {
  spec: Omit<SeedSpec, 'id'>;
  deck: Deck;
}

function cloneDeck(d: Deck): Deck {
  return JSON.parse(JSON.stringify(d)) as Deck;
}

function asSlideLike(slide: Slide): SlideLike {
  return slide as unknown as SlideLike;
}

function pOf(b: TextBlock): number {
  return prominenceProxy(b.fontSize, b.fontWeight);
}

/**
 * headline-prominence/deck: demote every primary block's type until the
 * max-P block is non-primary by > 5%. Shrink-only (never overflows).
 */
export function seedDemotePrimary(
  fixtureId: string,
  deck: Deck,
): DeckSeed | null {
  const slide = deck.slides[0];
  const primaries = slide.blocks.filter(
    (b) => b.intent?.emphasis === 'primary',
  );
  const others = slide.blocks.filter((b) => b.intent?.emphasis !== 'primary');
  if (primaries.length === 0 || others.length === 0) return null;
  const next = cloneDeck(deck);
  const nb = next.slides[0].blocks;
  const nPrim = nb.filter((b) => b.intent?.emphasis === 'primary');
  // Deterministic shrink ladder (pt): stop at the first verified step.
  for (const size of [14, 12, 10, 8]) {
    for (const b of nPrim) {
      b.fontSize = size;
      b.fontWeight = 400;
    }
    if (checkCPrimarySubordinate(asSlideLike(next.slides[0])) !== null) {
      return {
        spec: {
          fixtureId,
          category: 'headline-prominence',
          level: 'deck',
          mutation: `demote-primary: primary type -> ${size}pt/400 (verified c/primary-subordinate)`,
        },
        deck: next,
      };
    }
  }
  return null; // unverified: recorded as inapplicable, never forced
}

/**
 * number-scale/deck: inflate the first non-primary number until it exceeds
 * the max primary P by > 50% (cap 400pt per schema).
 */
export function seedNumberScale(
  fixtureId: string,
  deck: Deck,
): DeckSeed | null {
  const slide = deck.slides[0];
  const primaries = slide.blocks.filter(
    (b) => b.intent?.emphasis === 'primary',
  );
  const numIdx = slide.blocks.findIndex(
    (b) => b.role === 'number' && b.intent?.emphasis !== 'primary',
  );
  if (primaries.length === 0 || numIdx < 0) return null;
  const maxPP = Math.max(...primaries.map(pOf));
  const next = cloneDeck(deck);
  const target = next.slides[0].blocks[numIdx];
  // P = size * 1.25 at weight 900; solve size for 1.6x margin, fixed ladder.
  const need = (maxPP * 1.6) / 1.25;
  for (const size of [need, 200, 300, 400]) {
    target.fontSize = Math.min(400, Math.max(12, Math.ceil(size)));
    target.fontWeight = 900;
    if (target.fontSize >= 400) {
      // Cap reached: verify once, then stop ladder.
      if (checkCNumberScale(asSlideLike(next.slides[0])) !== null) break;
      return null;
    }
    if (checkCNumberScale(asSlideLike(next.slides[0])) !== null) break;
  }
  if (checkCNumberScale(asSlideLike(next.slides[0])) === null) return null;
  return {
    spec: {
      fixtureId,
      category: 'number-scale' as DefectCategory,
      level: 'deck' as SeedLevel,
      mutation: `number-scale: number ${target.id} -> ${target.fontSize}pt/900 (verified c/number-scale)`,
    },
    deck: next,
  };
}

/**
 * grouping/deck: swap the rect of the first group member with the first
 * non-member block (bounds/overlap preserved, proximity broken).
 */
export function seedGroupingSwap(
  fixtureId: string,
  deck: Deck,
): DeckSeed | null {
  const slide = deck.slides[0];
  const byGroup = new Map<string, number[]>();
  slide.blocks.forEach((b, i) => {
    const gid = b.intent?.groupId;
    if (typeof gid === 'string' && gid.length > 0) {
      const list = byGroup.get(gid) ?? [];
      list.push(i);
      byGroup.set(gid, list);
    }
  });
  const entry = [...byGroup.entries()].find(([, m]) => m.length >= 2);
  if (!entry) return null;
  const [, members] = entry;
  const memberSet = new Set(members);
  const outIdx = slide.blocks.findIndex((_, i) => !memberSet.has(i));
  if (outIdx < 0) return null;
  // Try swapping each member (in order) with the outsider; keep the first
  // swap that verifies c/grouping-split (or dangling, if swap is vacuous).
  for (const mIdx of members) {
    const next = cloneDeck(deck);
    const nb = next.slides[0].blocks;
    const a = nb[mIdx];
    const o = nb[outIdx];
    const rect = { x: a.x, y: a.y, w: a.w, h: a.h };
    a.x = o.x;
    a.y = o.y;
    a.w = o.w;
    a.h = o.h;
    o.x = rect.x;
    o.y = rect.y;
    o.w = rect.w;
    o.h = rect.h;
    if (checkCGroupingSplit(asSlideLike(next.slides[0])) !== null) {
      return {
        spec: {
          fixtureId,
          category: 'grouping',
          level: 'deck',
          mutation: `grouping-swap: rect ${a.id} <-> ${o.id} (verified c/grouping-split)`,
        },
        deck: next,
      };
    }
  }
  return null;
}

/**
 * clip/deck: shrink the first secondary/supporting box height along a fixed
 * ladder until the estimate-only clip predicate fires.
 */
export function seedClipSupport(
  fixtureId: string,
  deck: Deck,
): DeckSeed | null {
  const slide = deck.slides[0];
  const idx = slide.blocks.findIndex(
    (b) =>
      b.intent?.emphasis === 'secondary' ||
      b.intent?.emphasis === 'supporting',
  );
  if (idx < 0) return null;
  for (const frac of [0.35, 0.2, 0.1]) {
    const next = cloneDeck(deck);
    const target = next.slides[0].blocks[idx];
    target.h = Math.max(0.05, target.h * frac);
    if (checkCSupportClip(asSlideLike(next.slides[0])) !== null) {
      return {
        spec: {
          fixtureId,
          category: 'clip',
          level: 'deck',
          mutation: `clip-support: box ${target.id} h x${frac} (verified c/support-clip, ESTIMATE-ONLY)`,
        },
        deck: next,
      };
    }
  }
  return null;
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (v: number): string =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

/**
 * contrast/deck: drag the first body/secondary/supporting color toward the
 * background along a fixed mix ladder until WCAG AA fails.
 */
export function seedContrastFail(
  fixtureId: string,
  deck: Deck,
): DeckSeed | null {
  const slide = deck.slides[0];
  const idx = slide.blocks.findIndex(
    (b) =>
      b.role === 'body' ||
      b.intent?.emphasis === 'secondary' ||
      b.intent?.emphasis === 'supporting',
  );
  if (idx < 0) return null;
  const bg = hexToRgb(slide.background);
  for (const mix of [0.5, 0.7, 0.85, 0.95]) {
    const next = cloneDeck(deck);
    const target = next.slides[0].blocks[idx];
    const fg = hexToRgb(target.color);
    target.color = rgbToHex(
      fg[0] + (bg[0] - fg[0]) * mix,
      fg[1] + (bg[1] - fg[1]) * mix,
      fg[2] + (bg[2] - fg[2]) * mix,
    );
    if (checkCContrast(asSlideLike(next.slides[0])) !== null) {
      return {
        spec: {
          fixtureId,
          category: 'contrast',
          level: 'deck',
          mutation: `contrast-fail: color ${target.id} mixed ${Math.round(mix * 100)}% toward bg (verified c/contrast)`,
        },
        deck: next,
      };
    }
  }
  return null;
}

export function deckSeeds(fixtureId: string, deck: Deck): DeckSeed[] {
  const out: DeckSeed[] = [];
  for (const s of [
    seedDemotePrimary(fixtureId, deck),
    seedNumberScale(fixtureId, deck),
    seedGroupingSwap(fixtureId, deck),
    seedClipSupport(fixtureId, deck),
    seedContrastFail(fixtureId, deck),
  ]) {
    if (s) out.push(s);
  }
  return out;
}

/** Re-export block type for the runner's mutation-space checks. */
export type { TextBlock };
