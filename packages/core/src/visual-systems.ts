// Typodeck Visual System Registry — versioned, extensible, research-ready.
// The registry answers WHICH visual systems exist and WHAT they support;
// typography tokens stay in systems.ts and composition rules in
// composition.ts. New systems arrive via the research-import pipeline
// (scripts/import-research.ts) as candidate specs — never by hand-editing
// production entries, and never auto-promoted.
//
// Stored decks pin {system id + version} in deck.meta so revising, merging,
// or removing systems never breaks previously generated decks.

import { COMPOSITION_GRAMMAR, PRIMITIVES, type CompositionPrimitive } from './composition';
import { getSystem, SYSTEM_IDS, type SystemId, type TypographySystem } from './systems';

export type SystemStatus = 'production' | 'experimental' | 'deprecated';

export interface VisualSystemEntry {
  /** Stable id (never reused; renames go through deprecation). */
  id: string;
  /** Entry version (semver). Typography/grammar changes bump this. */
  version: string;
  status: SystemStatus;
  /** One-paragraph design philosophy. */
  philosophy: string;
  /** Composition grammar ref, e.g. "composition-grammar@0.1.0". */
  grammarRef: string;
  /** Attached research record ids (500-reference program; empty until then). */
  researchRefs: string[];
  /** Layout features this system actually uses in PPTX output. */
  supports: string[];
  /** Honestly recorded limitations (not marketing copy). */
  limitations: string[];
  /** Successor id when status is deprecated. */
  supersededBy?: string;
}

export const REGISTRY_VERSION = '1.0.0' as const;

/**
 * Honest engine capability inventory: what layout.ts + export.ts can
 * actually do in PPTX output today. The research importer maps
 * required_engine_capabilities against this list; anything missing
 * (rotation, vertical text, character-level layout) fails loudly.
 */
export const ENGINE_CAPABILITIES: readonly string[] = [
  'native-text',
  'solid-background',
  'left-align',
  'center-align',
  'right-align',
  'tracking',
  'leading',
  'weight-contrast',
  'scale-contrast',
  'multi-column',
  'asymmetric-offset',
  'alternating-background',
  'measure-cap',
  'rhythm-scale',
  'optical-hang',
  'optical-center',
  'widow-rag-scoring',
];

export { PRIMITIVES };
export type { CompositionPrimitive };

const GRAMMAR_REF = `composition-grammar@${COMPOSITION_GRAMMAR.version}`;

export const VISUAL_SYSTEMS: Record<string, VisualSystemEntry> = {
  editorial: {
    id: 'editorial',
    version: '1.0.0',
    status: 'production',
    philosophy: 'Serif-led editorial voice: asymmetric stacked text blocks with generous leading and warm paper tones.',
    grammarRef: GRAMMAR_REF,
    researchRefs: [],
    supports: ['native-text', 'solid-background', 'left-align', 'tracking', 'leading', 'weight-contrast', 'scale-contrast', 'asymmetric-offset', 'measure-cap', 'rhythm-scale', 'optical-hang', 'optical-center'],
    limitations: ['Single-column only; no multi-column compositions.', 'Centered bodies score poorly (T6); use left alignment.'],
  },
  swiss: {
    id: 'swiss',
    version: '1.0.0',
    status: 'production',
    philosophy: 'Swiss International Style: strict coarse grid, disciplined left alignment, strong typographic hierarchy.',
    grammarRef: GRAMMAR_REF,
    researchRefs: [],
    supports: ['native-text', 'solid-background', 'left-align', 'tracking', 'leading', 'weight-contrast', 'scale-contrast', 'multi-column', 'measure-cap', 'rhythm-scale', 'optical-hang'],
    limitations: ['Grid columns are fixed at four; no per-slide grid choice.', 'New data: keep body measure under ~60 chars.'],
  },
  expressive: {
    id: 'expressive',
    version: '1.0.0',
    status: 'production',
    philosophy: 'Expressive display voice: centered monumental type with dramatic scale contrast on dark fields.',
    grammarRef: GRAMMAR_REF,
    researchRefs: [],
    supports: ['native-text', 'solid-background', 'center-align', 'tracking', 'leading', 'weight-contrast', 'scale-contrast', 'alternating-background', 'measure-cap', 'rhythm-scale', 'optical-center'],
    limitations: ['Centered composition only; long bodies must wrap narrow or move to another system.', 'Alternating backgrounds keyed to slide parity.'],
  },
  document: {
    id: 'document',
    version: '0.1.0',
    status: 'experimental',
    philosophy: 'Technical-manual voice: dense hierarchy-stack with a meta column for section markers and a wide content zone; left-aligned grotesque at reference density.',
    grammarRef: GRAMMAR_REF,
    researchRefs: ['D-356', 'D-301', 'D-307', 'D-308', 'D-304', 'D-315'],
    supports: ['native-text', 'solid-background', 'left-align', 'right-align', 'tracking', 'leading', 'weight-contrast', 'scale-contrast', 'multi-column', 'measure-cap', 'rhythm-scale'],
    limitations: [
      'Experimental: grammar is provisional — merged G4 records are stubs (secondary-description); re-inspect sources before promotion.',
      'No verbatim/monospace role: code, paths, and specs render in the body face.',
      'Fixed two-zone geometry; no per-slide grid choice.',
    ],
  },
};

export interface ResolvedVisualSystem {
  entry: VisualSystemEntry;
  typography: TypographySystem;
}

/**
 * Resolve a system id to its registry entry + typography. Accepts an
 * explicit registry for testing (deprecation, experimental candidates).
 */
export function resolveVisualSystem(
  id: string,
  registry: Record<string, VisualSystemEntry> = VISUAL_SYSTEMS,
): ResolvedVisualSystem {
  const entry = registry[id];
  if (!entry) {
    const known = Object.keys(registry).join(', ');
    throw new Error(`unknown visual system "${id}" (want one of: ${known})`);
  }
  // Production typography still lives in systems.ts. Registered entries
  // without shipped tokens fail loudly at render time — never silently
  // render as another system.
  if (!(SYSTEM_IDS as readonly string[]).includes(entry.id)) {
    throw new Error(
      `visual system "${id}" is registered (${entry.status}) but has no shipped typography; ` +
      `add tokens to systems.ts before rendering`,
    );
  }
  return { entry, typography: getSystem(entry.id as SystemId) };
}

/** Resolve a stored deck's pinned system, defaulting to latest production. */
export function resolveDeckSystem(
  meta: { system: string; systemVersion?: string },
  registry: Record<string, VisualSystemEntry> = VISUAL_SYSTEMS,
): ResolvedVisualSystem {
  const resolved = resolveVisualSystem(meta.system, registry);
  if (meta.systemVersion !== undefined && meta.systemVersion !== resolved.entry.version) {
    throw new Error(
      `stored deck pins ${meta.system}@${meta.systemVersion} but registry has ${resolved.entry.version} ` +
      `(keep deprecated entries resolvable; do not delete them)`,
    );
  }
  return resolved;
}

/** Registry listing for galleries and benchmarks (stable id order). */
export function listVisualSystems(
  registry: Record<string, VisualSystemEntry> = VISUAL_SYSTEMS,
  statuses: readonly SystemStatus[] = ['production', 'experimental'],
): VisualSystemEntry[] {
  return Object.values(registry)
    .filter((e) => statuses.includes(e.status))
    .sort((a, b) => (a.id < b.id ? -1 : 1));
}
