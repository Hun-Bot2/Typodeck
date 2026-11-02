// Typodeck 90+ — Composition Grammar (formal, machine-readable).
// Translates slide semantics into layout decisions WITHOUT new PPTX constructs:
// a CompositionPlan only selects geometry/token variants within the existing
// typography-only schema (TextBlock roles + solid backgrounds).
//
// Evidence lineage (see research/typography/evidence-registry.json):
// - Coarse grids, asymmetry, center-short-only: A03/A04/A08/A11
// - Rhythm + scale discipline: A06/A07; expressive bounds: A12
// - Grouping: B01/B02; attention: B04/B05/B07; memory ~4: B08; clutter: B10
// - Narration: C08; density: C04 (no caps enforced); Korean: D01-D10
// All numeric slide values below are DERIVED HEURISTICS, not attributed rules.

import type { Narrative, NarrativeBlock, NarrativeSlide } from './schema';
import type { SystemId, ThemeOverride } from './systems';

// ---------------------------------------------------------------------------
// Semantic slide types (§4.1)
// ---------------------------------------------------------------------------

export type SemanticSlideType =
  | 'opening' | 'problem' | 'insight' | 'thesis' | 'comparison'
  | 'process' | 'architecture' | 'evidence' | 'metric' | 'quote'
  | 'tradeoff' | 'transition' | 'conclusion';

export const SEMANTIC_TYPES: readonly SemanticSlideType[] = [
  'opening', 'problem', 'insight', 'thesis', 'comparison', 'process',
  'architecture', 'evidence', 'metric', 'quote', 'tradeoff', 'transition',
  'conclusion',
];

// ---------------------------------------------------------------------------
// Composition primitives (§4.2) — typography-native only. No cards, boxes,
// arrows, icons, rules, or illustrations exist in this grammar.
// ---------------------------------------------------------------------------

export type CompositionPrimitive =
  | 'scale-contrast' | 'weight-contrast' | 'alignment' | 'column-rhythm'
  | 'baseline-relations' | 'controlled-asymmetry' | 'negative-space'
  | 'typographic-grouping' | 'textual-repetition' | 'number-led'
  | 'editorial-headline' | 'reading-flow' | 'optical-alignment';

export const PRIMITIVES: readonly CompositionPrimitive[] = [
  'scale-contrast', 'weight-contrast', 'alignment', 'column-rhythm',
  'baseline-relations', 'controlled-asymmetry', 'negative-space',
  'typographic-grouping', 'textual-repetition', 'number-led',
  'editorial-headline', 'reading-flow', 'optical-alignment',
];

// ---------------------------------------------------------------------------
// Candidate compositions (§4.4): preconditions, constraints, tokens,
// scoring hints, exceptions, fallback. Each semantic type has >=2 strategies.
// ---------------------------------------------------------------------------

export interface CompositionPreconditions {
  /** Required roles present on the slide (subset match). */
  requiresRoles?: Array<'kicker' | 'title' | 'body' | 'number' | 'caption'>;
  /** Max title chars for this composition to stay display-like (derived). */
  maxTitleChars?: number;
  /** Max body blocks this composition handles well (B08 ~4 chunks). */
  maxBodyBlocks?: number;
  /** Min body blocks (e.g. comparison wants >=2 ideas). */
  minBodyBlocks?: number;
  /** Preferred languages ('ko' enables keep-all/kinsoku handling downstream). */
  languages?: Array<'ko' | 'en' | 'any'>;
  /** Needs evidence refs in captions (metric/evidence integrity). */
  needsEvidenceRef?: boolean;
}

export interface CompositionConstraints {
  /** Display title line cap (derived from A01/A07; default 2). */
  maxTitleLines: number;
  /** Body measure cap in chars/line (derived; default 60). */
  maxBodyCharsPerLine: number;
  /** Alignment override for body role (system default when absent). */
  bodyAlign?: 'left' | 'center' | 'right';
  /** Column count for this composition (1-4; coarse grids per A03). */
  columns: number;
  /** Rhythm multiplier applied to system rhythm (>=1 spreads, <1 tightens). */
  rhythmScale: number;
}

/** Density tag for agent shortlisting (see candidateIndex). */
export type CandidateDensity = 'sparse' | 'balanced' | 'dense';
/** Formality tag for agent shortlisting (see candidateIndex). */
export type CandidateFormality = 'formal' | 'neutral' | 'expressive';

export interface CompositionCandidate {
  id: string;
  semanticTypes: SemanticSlideType[];
  systems: SystemId[];
  primitives: CompositionPrimitive[];
  preconditions: CompositionPreconditions;
  constraints: CompositionConstraints;
  /** Human-readable rationale template (filled at selection time). */
  rationale: string;
  /** Exceptions: when NOT to use this composition. */
  exceptions: string[];
  /** Selection metadata: what this composition is best for (agent shortlisting). */
  bestFor?: string[];
  /** Selection metadata: explicit avoid-for list. Defaults to `exceptions` when absent. */
  avoidFor?: string[];
  /** Selection metadata: density tag. Derived from columns/primitives when absent. */
  density?: CandidateDensity;
  /** Selection metadata: formality tag. Derived from systems when absent. */
  formality?: CandidateFormality;
  /** Visual identity override (B: per-candidate themes). Absent = system-native. */
  theme?: CandidateTheme;
}

/** Named visual-identity override (see THEMES.md registry doc). */
export interface CandidateTheme extends ThemeOverride {
  /** Theme id. */
  id: string;
}

export interface CandidateMeta {
  bestFor?: string[];
  avoidFor?: string[];
  density?: CandidateDensity;
  formality?: CandidateFormality;
}

const C = (
  id: string,
  semanticTypes: SemanticSlideType[],
  systems: SystemId[],
  primitives: CompositionPrimitive[],
  preconditions: CompositionPreconditions,
  constraints: CompositionConstraints,
  rationale: string,
  exceptions: string[],
  meta: CandidateMeta = {},
): CompositionCandidate => ({
  id, semanticTypes, systems, primitives, preconditions, constraints, rationale, exceptions,
  ...meta,
});

const TITLE2: CompositionConstraints = { maxTitleLines: 2, maxBodyCharsPerLine: 60, columns: 1, rhythmScale: 1 };

export const COMPOSITION_CANDIDATES: Record<string, CompositionCandidate> = {
  // Opening — statement vs context-setting.
  'opening-statement': C('opening-statement', ['opening'], ['editorial', 'swiss', 'expressive'],
    ['scale-contrast', 'negative-space', 'editorial-headline', 'reading-flow'],
    { requiresRoles: ['title'], maxTitleChars: 60 }, { ...TITLE2, rhythmScale: 1.2 },
    'Opening as single statement: hero title carries the thesis; body (if any) is subordinate.',
    ['Do not use when the title exceeds 60 chars — fall back to opening-context.']),
  'opening-context': C('opening-context', ['opening'], ['editorial', 'swiss'],
    ['controlled-asymmetry', 'typographic-grouping', 'reading-flow'],
    { requiresRoles: ['title'] }, { ...TITLE2, columns: 2, rhythmScale: 1.1 },
    'Opening with context: title plus supporting body grouped by proximity (B01).',
    ['Do not use for expressive — expressive openings stay single-statement.']),
  'opening-breath': C('opening-breath', ['opening'], ['expressive'],
    ['negative-space', 'scale-contrast', 'editorial-headline'],
    { requiresRoles: ['title'], maxTitleChars: 50, maxBodyBlocks: 0 }, { ...TITLE2, rhythmScale: 1.4 },
    'Expressive opening breath: very short title alone at display scale (2nd expressive option).',
    ['Do not use with body copy or titles over 50 chars — use opening-statement.']),
  // G1 MONUMENTAL-NUMERAL-COVER (research/slide-reconstruction, conditional
  // pass with R1 numeral-width + R2 title-wrap rules; two Tier-B instances on
  // identical geometry). Planner path: planMonumentalNumeral in layout.ts.
  'opening-monumental-numeral': C('opening-monumental-numeral', ['opening'], ['swiss', 'editorial'],
    ['number-led', 'scale-contrast', 'negative-space', 'reading-flow'],
    { requiresRoles: ['number', 'title'], maxTitleChars: 80 }, { ...TITLE2, rhythmScale: 1.2 },
    'G1 monumental-numeral cover: kicker, giant numeral (~30% canvas height), title (~1/4 numeral), footer triad.',
    ['Do not use without a hero number — use opening-statement.',
     'Do not use for centered-hero systems (expressive) — geometry is left-edge anchored.'],
    { bestFor: ['report and test-question covers led by one hero figure', 'openings where a single number carries the thesis'],
      avoidFor: ['slides without a hero number', 'titles over ~80 chars even after R2 step-down'],
      density: 'sparse', formality: 'formal' }),
  // Problem — tension vs narrative.
  'problem-tension': C('problem-tension', ['problem'], ['editorial', 'expressive'],
    ['scale-contrast', 'weight-contrast', 'negative-space'],
    { requiresRoles: ['title'], maxTitleChars: 72 }, TITLE2,
    'Problem as tension: short charged title, sparse body, whitespace carries severity.',
    ['Do not use when body exceeds 2 blocks — use problem-narrative.']),
  'problem-narrative': C('problem-narrative', ['problem'], ['editorial', 'swiss'],
    ['column-rhythm', 'typographic-grouping', 'reading-flow'],
    { requiresRoles: ['title', 'body'] }, { ...TITLE2, columns: 2 },
    'Problem as narrative: title plus sequenced bodies in column rhythm.',
    ['Do not use when bodies are unrelated fragments — split the slide.']),
  // Insight — punchline vs unpacked.
  'insight-punchline': C('insight-punchline', ['insight'], ['editorial', 'swiss', 'expressive'],
    ['scale-contrast', 'editorial-headline', 'negative-space'],
    { requiresRoles: ['title'], maxTitleChars: 60 }, TITLE2,
    'Insight as punchline: the takeaway IS the title; body only grounds it.',
    ['Do not use when the insight needs >2 supporting ideas — use insight-unpacked.']),
  'insight-unpacked': C('insight-unpacked', ['insight'], ['swiss', 'editorial'],
    ['column-rhythm', 'typographic-grouping', 'baseline-relations'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2, maxBodyBlocks: 4 }, { ...TITLE2, columns: 2 },
    'Insight unpacked: claim plus up to 4 supporting chunks (B08).',
    ['Do not use beyond 4 body blocks — chunk into two slides.']),
  // Thesis — default argument slide.
  'thesis-statement': C('thesis-statement', ['thesis'], ['editorial', 'swiss', 'expressive'],
    ['scale-contrast', 'weight-contrast', 'reading-flow'],
    { requiresRoles: ['title'] }, TITLE2,
    'Thesis as statement: title-first hierarchy, body subordinate (B14).',
    ['Do not use when title is contextless — fix narrative instead.']),
  'thesis-grouped': C('thesis-grouped', ['thesis'], ['swiss', 'editorial'],
    ['typographic-grouping', 'column-rhythm', 'alignment'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2, maxBodyBlocks: 4 }, { ...TITLE2, columns: 2 },
    'Thesis with grouped support: bodies in 2-column rhythm with alignment thread (B02).',
    ['Do not use for single-body slides — use thesis-statement.']),
  'thesis-sparse': C('thesis-sparse', ['thesis'], ['expressive', 'editorial'],
    ['negative-space', 'editorial-headline', 'reading-flow'],
    { requiresRoles: ['title'], maxBodyBlocks: 1 }, { ...TITLE2, rhythmScale: 1.2 },
    'Thesis sparse: single-body theses get whitespace-led treatment (2nd option for expressive).',
    ['Do not use beyond 1 body block — use thesis-grouped or thesis-statement.']),
  // Comparison — side-by-side vs stacked contrast.
  'comparison-columns': C('comparison-columns', ['comparison'], ['swiss'],
    ['column-rhythm', 'alignment', 'typographic-grouping', 'baseline-relations'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2, maxBodyBlocks: 4 }, { ...TITLE2, columns: 2 },
    'Swiss comparison: strict 2-column grid, baseline-aligned contrast (A08 lineage).',
    ['Do not use beyond 4 bodies or without parallel structure.']),
  'comparison-stacked': C('comparison-stacked', ['comparison'], ['editorial', 'expressive'],
    ['controlled-asymmetry', 'textual-repetition', 'reading-flow'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2 }, { ...TITLE2, rhythmScale: 1.3 },
    'Editorial/expressive comparison: stacked Before/After with repeated labels and asymmetric offset.',
    ['Do not use when labels are not parallel — rewrite labels first.']),
  'comparison-rows': C('comparison-rows', ['comparison'], ['editorial', 'swiss', 'expressive'],
    ['reading-flow', 'typographic-grouping', 'negative-space'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2, maxBodyBlocks: 3 }, { ...TITLE2, rhythmScale: 1.4 },
    'Row-stacked comparison: Before/After separated by generous rhythm (2nd option in every system).',
    ['Do not use beyond 3 bodies — use comparison-columns (swiss) or split.']),
  // Process — sequenced vs compact.
  'process-sequenced': C('process-sequenced', ['process'], ['swiss', 'editorial'],
    ['column-rhythm', 'reading-flow', 'typographic-grouping'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2, maxBodyBlocks: 4 }, { ...TITLE2, columns: 2 },
    'Process as sequence: ordered bodies in reading flow (typographic numbering in text, no arrows).',
    ['Do not use beyond 4 steps — split across slides.']),
  'process-compact': C('process-compact', ['process'], ['editorial', 'expressive'],
    ['negative-space', 'reading-flow', 'editorial-headline'],
    { requiresRoles: ['title', 'body'], maxBodyBlocks: 2 }, TITLE2,
    'Process compact: short sequences stay single-column with generous leading.',
    ['Do not use for 3+ steps — use process-sequenced.']),
  // Architecture — map vs layered.
  'architecture-map': C('architecture-map', ['architecture'], ['swiss'],
    ['column-rhythm', 'alignment', 'baseline-relations'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2, maxBodyBlocks: 4 }, { ...TITLE2, columns: 2 },
    'Architecture as map: components in grid columns with alignment threads (no boxes/arrows).',
    ['Do not use for single-component slides — use thesis-statement.']),
  'architecture-layered': C('architecture-layered', ['architecture'], ['editorial'],
    ['controlled-asymmetry', 'typographic-grouping', 'reading-flow'],
    { requiresRoles: ['title', 'body'] }, { ...TITLE2, rhythmScale: 1.2 },
    'Architecture layered: indented tiers express stacking via asymmetry + grouping.',
    ['Do not use when layer order is ambiguous — name layers explicitly in text.']),
  // Evidence — anchored vs collated.
  'evidence-anchored': C('evidence-anchored', ['evidence'], ['editorial', 'swiss'],
    ['typographic-grouping', 'reading-flow', 'alignment'],
    { requiresRoles: ['title', 'body'], needsEvidenceRef: true }, TITLE2,
    'Evidence anchored: claim plus adjacent source caption (spatial contiguity B07).',
    ['Do not use without a valid ref — demote to thesis-statement.']),
  'evidence-collated': C('evidence-collated', ['evidence'], ['swiss'],
    ['column-rhythm', 'textual-repetition', 'baseline-relations'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2, maxBodyBlocks: 4, needsEvidenceRef: true }, { ...TITLE2, columns: 2 },
    'Evidence collated: parallel findings in columns with repeated citation shape.',
    ['Do not use when findings lack parallel structure.']),
  'evidence-focused': C('evidence-focused', ['evidence'], ['editorial', 'swiss', 'expressive'],
    ['negative-space', 'typographic-grouping', 'reading-flow'],
    { requiresRoles: ['title', 'body'], maxBodyBlocks: 1, needsEvidenceRef: true }, { ...TITLE2, rhythmScale: 1.2 },
    'Evidence focused: single finding with adjacent source caption (2nd option for 1-body evidence).',
    ['Do not use beyond 1 body block — use evidence-anchored or evidence-collated.']),
  // G3 STARRED-EXPLAINER-COLUMNS (research/slide-reconstruction, conditional
  // pass with R3 body-reflow rule; grouped 2-column + single-column variant).
  // Star bullets are a text-glyph convention (★ in content), not a primitive.
  // Planner path: planExplainerColumns in layout.ts.
  'evidence-explainer-columns': C('evidence-explainer-columns', ['evidence', 'insight'], ['swiss', 'editorial'],
    ['column-rhythm', 'typographic-grouping', 'baseline-relations', 'reading-flow'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 3, maxBodyBlocks: 8 }, { ...TITLE2, columns: 2 },
    'G3 explainer columns: runhead/headline/lede full-width, bodies grouped in 2 columns (single column at <=3 bodies).',
    ['Do not use below 3 bodies — use evidence-anchored or insight-unpacked.',
     'Do not use beyond 8 bodies — Tier-B holds 8; split the slide past that.'],
    { bestFor: ['dense explainers with a lede plus grouped findings', 'FAQ-style evidence slides with parallel answers'],
      avoidFor: ['single-finding slides', 'unrelated body fragments without parallel structure'],
      density: 'dense', formality: 'neutral' }),
  // Metric — hero vs anchored. Metric NEVER auto-centers: it must be
  // meaningful (hero-eligible), supported (ref), and relevant (thesis-tied).
  'metric-hero': C('metric-hero', ['metric'], ['expressive', 'editorial'],
    ['number-led', 'scale-contrast', 'negative-space'],
    { requiresRoles: ['number'], needsEvidenceRef: true, maxBodyBlocks: 1 }, { ...TITLE2, rhythmScale: 1.2 },
    'Metric hero: meaningful+supported+relevant number leads; body (if any) is one grounding line.',
    ['Do not use when the number lacks a ref or is a version/year/hash — use metric-anchored.']),
  'metric-anchored': C('metric-anchored', ['metric'], ['editorial', 'swiss'],
    ['number-led', 'typographic-grouping', 'reading-flow'],
    { requiresRoles: ['number', 'title'] }, TITLE2,
    'Metric anchored: number subordinate to a thesis title; safe default when hero tests fail.',
    ['Do not use as hero — this is the fallback when metric-hero preconditions fail.']),
  // Quote — voice vs attribution.
  'quote-voice': C('quote-voice', ['quote'], ['editorial', 'expressive'],
    ['editorial-headline', 'negative-space', 'optical-alignment'],
    { requiresRoles: ['title'], maxTitleChars: 140 }, { ...TITLE2, rhythmScale: 1.3 },
    'Quote as voice: the quoted text is the hero; attribution small and adjacent.',
    ['Do not use beyond ~140 chars — trim or split the quote.']),
  'quote-attributed': C('quote-attributed', ['quote'], ['swiss', 'editorial'],
    ['typographic-grouping', 'alignment', 'reading-flow'],
    { requiresRoles: ['title', 'body'] }, TITLE2,
    'Quote attributed: quote plus explicit attribution body grouped by proximity.',
    ['Do not use without attribution — add the source in text.']),
  // Trade-off — balanced vs decided.
  'tradeoff-balanced': C('tradeoff-balanced', ['tradeoff'], ['swiss', 'editorial'],
    ['column-rhythm', 'typographic-grouping', 'baseline-relations'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2, maxBodyBlocks: 4 }, { ...TITLE2, columns: 2 },
    'Trade-off balanced: options in parallel columns with shared baseline.',
    ['Do not use when a decision is already made — use tradeoff-decided.']),
  'tradeoff-decided': C('tradeoff-decided', ['tradeoff'], ['editorial', 'expressive'],
    ['scale-contrast', 'weight-contrast', 'reading-flow'],
    { requiresRoles: ['title', 'body'] }, TITLE2,
    'Trade-off decided: chosen path leads at display scale; rejected path subordinate.',
    ['Do not use when options are still open — use tradeoff-balanced.']),
  // Transition — breath vs bridge.
  'transition-breath': C('transition-breath', ['transition'], ['editorial', 'swiss', 'expressive'],
    ['negative-space', 'editorial-headline'],
    { requiresRoles: ['title'], maxTitleChars: 50, maxBodyBlocks: 0 }, { ...TITLE2, rhythmScale: 1.4 },
    'Transition as breath: sparse section marker; very short title only.',
    ['Do not use with body copy — move bodies to adjacent slides.']),
  'transition-bridge': C('transition-bridge', ['transition'], ['editorial', 'swiss'],
    ['reading-flow', 'typographic-grouping'],
    { requiresRoles: ['title', 'body'], maxBodyBlocks: 1 }, TITLE2,
    'Transition as bridge: short title plus one linking line into the next section.',
    ['Do not use beyond one body block.']),
  // Conclusion — restatement vs charge.
  'conclusion-restatement': C('conclusion-restatement', ['conclusion'], ['editorial', 'swiss', 'expressive'],
    ['editorial-headline', 'reading-flow', 'typographic-grouping'],
    { requiresRoles: ['title'] }, TITLE2,
    'Conclusion restated: thesis echoed with the strongest grounding line.',
    ['Do not use when introducing new claims — conclusions restate only.']),
  'conclusion-charge': C('conclusion-charge', ['conclusion'], ['expressive', 'editorial'], ['scale-contrast', 'negative-space', 'editorial-headline'],
    { requiresRoles: ['title'], maxTitleChars: 60 }, { ...TITLE2, rhythmScale: 1.2 },
    'Conclusion as charge: short imperative close at display scale.',
    ['Do not use for informational closes — use conclusion-restatement.']),
  // Document (experimental, S1 technical-manual + S2/S3 folds). All are
  // document-only so production selection for existing systems is unchanged.
  'manual-opening': C('manual-opening', ['opening'], ['document'],
    ['typographic-grouping', 'textual-repetition', 'negative-space'],
    { requiresRoles: ['title'], maxTitleChars: 60 }, { ...TITLE2, rhythmScale: 1.1 },
    'Manual opening: numbered section marker in the meta column; title opens the chapter at manual scale.',
    ['Do not use beyond 60-char titles — use series-opening.']),
  'series-opening': C('series-opening', ['opening'], ['document'],
    ['textual-repetition', 'editorial-headline', 'reading-flow'],
    { requiresRoles: ['title', 'kicker'] }, { ...TITLE2, rhythmScale: 1.2 },
    'Series opening (S2 fold): repeated kicker label carries deck-series identity; no bands exist in typography-only output.',
    ['Do not use without a kicker — the repeated label IS the series signal.']),
  'manual-section': C('manual-section', ['thesis', 'process'], ['document'],
    ['typographic-grouping', 'alignment', 'reading-flow'],
    { requiresRoles: ['title'] }, { ...TITLE2, columns: 2, rhythmScale: 0.9, maxBodyCharsPerLine: 70 },
    'Manual section: dense hierarchy-stack for procedures and claims; meta column holds section markers.',
    ['Do not use for single-idea display slides — use manual-opening.']),
  'manual-reference': C('manual-reference', ['evidence', 'comparison'], ['document'],
    ['column-rhythm', 'textual-repetition', 'baseline-relations'],
    { requiresRoles: ['title', 'body'], minBodyBlocks: 2, maxBodyBlocks: 4 }, { ...TITLE2, columns: 2, rhythmScale: 0.9, maxBodyCharsPerLine: 64 },
    'Manual reference: parallel findings or options collated at reference density with repeated citation shape.',
    ['Do not use without parallel structure — rewrite bodies first.']),
  'margin-evidence': C('margin-evidence', ['evidence'], ['document'],
    ['typographic-grouping', 'alignment', 'reading-flow'],
    { requiresRoles: ['title', 'body'], maxBodyBlocks: 1, needsEvidenceRef: true }, { ...TITLE2, maxBodyCharsPerLine: 48 },
    'Margin evidence (S3 fold): tight-measure claim with adjacent source caption; closest margin-note form without a margin role.',
    ['Do not use beyond 1 body block — use manual-reference.']),
  'manual-metric': C('manual-metric', ['metric'], ['document'],
    ['number-led', 'scale-contrast', 'typographic-grouping'],
    { requiresRoles: ['number'], needsEvidenceRef: true, maxBodyBlocks: 1 }, { ...TITLE2, rhythmScale: 1.0 },
    'Manual metric: section-number-scale figure in the meta column with one grounding line.',
    ['Do not use without a ref or for versions/years — fall back to anchored forms.']),
};

export const CANDIDATE_IDS = Object.keys(COMPOSITION_CANDIDATES);

// ---------------------------------------------------------------------------
// Selection metadata backfill (§4.4 + research/slide-reconstruction §7).
// G1/G3 carry inline meta above; pre-existing candidates get one curated row
// each here (merged into the records below, so every record carries
// best_for/avoid_for/density/formality for the candidate-index).
// ---------------------------------------------------------------------------

const CANDIDATE_META_BACKFILL: Record<string, Required<Pick<CandidateMeta, 'bestFor' | 'density' | 'formality'>>> = {
  'opening-statement': { bestFor: ['thesis-led openings with a short hero title'], density: 'sparse', formality: 'neutral' },
  'opening-context': { bestFor: ['openings that need title plus supporting context'], density: 'balanced', formality: 'formal' },
  'opening-breath': { bestFor: ['expressive section covers with a very short title'], density: 'sparse', formality: 'expressive' },
  'problem-tension': { bestFor: ['problem slides where whitespace carries severity'], density: 'sparse', formality: 'neutral' },
  'problem-narrative': { bestFor: ['problem slides needing sequenced explanation'], density: 'balanced', formality: 'formal' },
  'insight-punchline': { bestFor: ['insights where the takeaway is the title'], density: 'sparse', formality: 'neutral' },
  'insight-unpacked': { bestFor: ['claims with 2-4 supporting chunks'], density: 'dense', formality: 'formal' },
  'thesis-statement': { bestFor: ['default argument slides, title-first'], density: 'balanced', formality: 'neutral' },
  'thesis-grouped': { bestFor: ['theses with grouped multi-point support'], density: 'dense', formality: 'formal' },
  'thesis-sparse': { bestFor: ['single-body theses with whitespace-led treatment'], density: 'sparse', formality: 'expressive' },
  'comparison-columns': { bestFor: ['parallel before/after contrasts on a strict grid'], density: 'dense', formality: 'formal' },
  'comparison-stacked': { bestFor: ['editorial before/after with repeated labels'], density: 'balanced', formality: 'neutral' },
  'comparison-rows': { bestFor: ['row-separated option contrasts'], density: 'balanced', formality: 'neutral' },
  'process-sequenced': { bestFor: ['ordered multi-step procedures'], density: 'dense', formality: 'formal' },
  'process-compact': { bestFor: ['short 1-2 step sequences'], density: 'sparse', formality: 'neutral' },
  'architecture-map': { bestFor: ['component maps on a grid'], density: 'dense', formality: 'formal' },
  'architecture-layered': { bestFor: ['layered stacks expressed via indentation'], density: 'balanced', formality: 'neutral' },
  'evidence-anchored': { bestFor: ['claims with an adjacent source caption'], density: 'balanced', formality: 'formal' },
  'evidence-collated': { bestFor: ['parallel findings with repeated citation shape'], density: 'dense', formality: 'formal' },
  'evidence-focused': { bestFor: ['single findings with one source caption'], density: 'sparse', formality: 'neutral' },
  'metric-hero': { bestFor: ['hero-eligible numbers with evidence refs'], density: 'sparse', formality: 'expressive' },
  'metric-anchored': { bestFor: ['numbers subordinate to a thesis title'], density: 'balanced', formality: 'formal' },
  'quote-voice': { bestFor: ['short quoted passages as hero text'], density: 'sparse', formality: 'expressive' },
  'quote-attributed': { bestFor: ['quotes with explicit attribution bodies'], density: 'balanced', formality: 'formal' },
  'tradeoff-balanced': { bestFor: ['open options in parallel columns'], density: 'dense', formality: 'formal' },
  'tradeoff-decided': { bestFor: ['decided paths with a subordinate rejected option'], density: 'balanced', formality: 'neutral' },
  'transition-breath': { bestFor: ['sparse section markers'], density: 'sparse', formality: 'neutral' },
  'transition-bridge': { bestFor: ['bridges with one linking line'], density: 'balanced', formality: 'neutral' },
  'conclusion-restatement': { bestFor: ['informational closes restating the thesis'], density: 'balanced', formality: 'formal' },
  'conclusion-charge': { bestFor: ['imperative closes at display scale'], density: 'sparse', formality: 'expressive' },
  'manual-opening': { bestFor: ['manual chapter openings with section markers'], density: 'balanced', formality: 'formal' },
  'series-opening': { bestFor: ['series covers with repeated kicker identity'], density: 'balanced', formality: 'formal' },
  'manual-section': { bestFor: ['dense manual procedures and claims'], density: 'dense', formality: 'formal' },
  'manual-reference': { bestFor: ['collated manual findings at reference density'], density: 'dense', formality: 'formal' },
  'margin-evidence': { bestFor: ['tight-measure claims with adjacent source'], density: 'balanced', formality: 'formal' },
  'manual-metric': { bestFor: ['manual figures with one grounding line'], density: 'balanced', formality: 'formal' },
};

for (const [id, meta] of Object.entries(CANDIDATE_META_BACKFILL)) {
  const c = COMPOSITION_CANDIDATES[id];
  if (c && c.bestFor === undefined) Object.assign(c, meta);
}

// ---------------------------------------------------------------------------
// Candidate themes (B: per-candidate visual identity).
// Grounded in research records (see THEMES.md). Pairs are WCAG AA
// (verified by tests/theme.test.ts). Transitions stay system-native.
// ---------------------------------------------------------------------------

const SANS_KR = ['Noto Sans KR', 'sans-serif'];
const SERIF_KR = ['Noto Serif KR', 'serif'];

const THEME_DEFS: Record<string, Omit<CandidateTheme, 'id'>> = {
  'signal-grotesk': {
    fonts: { heading: ['Helvetica Neue', 'Helvetica', 'Arial', ...SANS_KR], body: ['Helvetica Neue', 'Helvetica', 'Arial', ...SANS_KR] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#111111', accent: '#B00020', muted: '#5A5A5A' },
  },
  'paper-serif': {
    fonts: { heading: ['Georgia', ...SERIF_KR], body: ['Georgia', ...SERIF_KR] },
    colors: { background: '#FAF7F2', backgroundAlt: '#FAF7F2', ink: '#1A1A1A', accent: '#7B2D26', muted: '#6B6259' },
  },
  'mono-manual': {
    fonts: { heading: ['Arial', 'Helvetica', ...SANS_KR], body: ['Courier New', 'Noto Sans Mono', 'monospace'] },
    colors: { background: '#F7F7F5', backgroundAlt: '#F7F7F5', ink: '#1A1A1A', accent: '#0B4F9C', muted: '#5F6B6B' },
  },
  'hangul-gothic': {
    fonts: { heading: ['Apple SD Gothic Neo', 'Malgun Gothic', ...SANS_KR], body: ['Apple SD Gothic Neo', 'Malgun Gothic', ...SANS_KR] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#111111', accent: '#003FD6', muted: '#5A5A5A' },
  },
  'brutal-dark': {
    fonts: { heading: ['Archivo Black', 'Arial Black', 'sans-serif'], body: ['Arial', 'Helvetica', ...SANS_KR] },
    colors: { background: '#111111', backgroundAlt: '#111111', ink: '#F5F2EA', accent: '#FFD400', muted: '#B0B0B0' },
  },
  'grid-blue': {
    fonts: { heading: ['Inter', 'Helvetica Neue', 'Arial', ...SANS_KR], body: ['Inter', 'Helvetica Neue', 'Arial', ...SANS_KR] },
    colors: { background: '#F1F4F6', backgroundAlt: '#F1F4F6', ink: '#16232E', accent: '#0B4F9C', muted: '#54616E' },
  },
  'mincho-shu': {
    fonts: { heading: ['Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', 'serif'], body: ['Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', 'serif'] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#1A1A1A', accent: '#8C1D18', muted: '#666666' },
  },
  'evidence-slate': {
    fonts: { heading: ['Palatino Linotype', 'Georgia', 'serif'], body: ['Georgia', 'Palatino Linotype', ...SERIF_KR] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#222222', accent: '#2F5D62', muted: '#5A6B6B' },
  },
  'oxblood-serif': {
    fonts: { heading: ['Didot', 'Bodoni MT', 'Georgia', ...SERIF_KR], body: ['Georgia', ...SERIF_KR] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#1A1A1A', accent: '#7F1D1D', muted: '#5A5A5A' },
  },
  'sage-editorial': {
    fonts: { heading: ['Palatino Linotype', 'Book Antiqua', 'Georgia', ...SERIF_KR], body: ['Palatino Linotype', 'Georgia', ...SERIF_KR] },
    colors: { background: '#F5F2EA', backgroundAlt: '#F5F2EA', ink: '#2B2B28', accent: '#4D6A4F', muted: '#62625A' },
  },
  'gilt-garamond': {
    fonts: { heading: ['Garamond', 'Adobe Garamond Pro', 'Georgia', ...SERIF_KR], body: ['Garamond', 'Georgia', ...SERIF_KR] },
    colors: { background: '#FAF7F0', backgroundAlt: '#FAF7F0', ink: '#1F1B16', accent: '#7A5C00', muted: '#6E665A' },
  },
  'lime-grotesk': {
    fonts: { heading: ['Helvetica Neue', 'Helvetica', 'Arial', ...SANS_KR], body: ['Helvetica Neue', 'Helvetica', 'Arial', ...SANS_KR] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#111111', accent: '#4D7C0F', muted: '#5A5A5A' },
  },
  'signal-orange': {
    fonts: { heading: ['Helvetica Neue', 'Helvetica', 'Arial', ...SANS_KR], body: ['Helvetica Neue', 'Helvetica', 'Arial', ...SANS_KR] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#111111', accent: '#C2410C', muted: '#5A5A5A' },
  },
  'violet-grid': {
    fonts: { heading: ['Inter', 'Helvetica Neue', 'Arial', ...SANS_KR], body: ['Inter', 'Helvetica Neue', 'Arial', ...SANS_KR] },
    colors: { background: '#F4F4F5', backgroundAlt: '#F4F4F5', ink: '#18181B', accent: '#6D28D9', muted: '#52525B' },
  },
  'condensed-signal': {
    fonts: { heading: ['Arial Narrow', 'HelveticaNeue-CondensedBold', 'Arial', ...SANS_KR], body: ['Arial', 'Helvetica', ...SANS_KR] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#111111', accent: '#1D4ED8', muted: '#5A5A5A' },
  },
  'friendly-round': {
    fonts: { heading: ['Arial Rounded MT Bold', 'Trebuchet MS', 'Verdana', ...SANS_KR], body: ['Trebuchet MS', 'Verdana', ...SANS_KR] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#1F2937', accent: '#0F766E', muted: '#5B6470' },
  },
  'navy-ink': {
    fonts: { heading: ['Futura', 'Century Gothic', 'Avenir Next', 'Trebuchet MS', ...SANS_KR], body: ['Avenir Next', 'Trebuchet MS', 'Verdana', ...SANS_KR] },
    colors: { background: '#0F1B33', backgroundAlt: '#0F1B33', ink: '#F5F2EA', accent: '#F59E0B', muted: '#B8BCD0' },
  },
  'forest-night': {
    fonts: { heading: ['Georgia', ...SERIF_KR], body: ['Georgia', ...SERIF_KR] },
    colors: { background: '#12261D', backgroundAlt: '#12261D', ink: '#EAF4EC', accent: '#A3E635', muted: '#A8BFAE' },
  },
  'copper-charcoal': {
    fonts: { heading: ['Rockwell', 'Courier Bold', 'Georgia', 'serif'], body: ['Georgia', ...SERIF_KR] },
    colors: { background: '#1C1917', backgroundAlt: '#1C1917', ink: '#E7E5E4', accent: '#E8963C', muted: '#A8A29E' },
  },
  'plum-noir': {
    fonts: { heading: ['Didot', 'Bodoni MT', 'Georgia', ...SERIF_KR], body: ['Georgia', ...SERIF_KR] },
    colors: { background: '#231627', backgroundAlt: '#231627', ink: '#EDE9FE', accent: '#F472B6', muted: '#B8AEC4' },
  },
  'blueprint': {
    fonts: { heading: ['Courier New', 'Noto Sans Mono', 'monospace'], body: ['Courier New', 'Noto Sans Mono', 'monospace'] },
    colors: { background: '#1E3A8A', backgroundAlt: '#1E3A8A', ink: '#FFFFFF', accent: '#67E8F9', muted: '#C3D2F5' },
  },
  'manual-blue': {
    fonts: { heading: ['Arial', 'Helvetica', ...SANS_KR], body: ['Courier New', 'Noto Sans Mono', 'monospace'] },
    colors: { background: '#F8FAFC', backgroundAlt: '#F8FAFC', ink: '#1A1A1A', accent: '#1E40AF', muted: '#5B6470' },
  },
  'terminal-amber': {
    fonts: { heading: ['Menlo', 'Consolas', 'Courier New', 'monospace'], body: ['Menlo', 'Consolas', 'Courier New', 'monospace'] },
    colors: { background: '#0A0A0A', backgroundAlt: '#0A0A0A', ink: '#4ADE80', accent: '#FBBF24', muted: '#9CA3AF' },
  },
  'kraft-rust': {
    fonts: { heading: ['American Typewriter', 'Courier New', 'Georgia', 'serif'], body: ['Georgia', ...SERIF_KR] },
    colors: { background: '#E8DCC8', backgroundAlt: '#E8DCC8', ink: '#3B2F2F', accent: '#9A3412', muted: '#6B5F4E' },
  },
  'blush-rose': {
    fonts: { heading: ['Georgia', ...SERIF_KR], body: ['Georgia', ...SERIF_KR] },
    colors: { background: '#FDF2F2', backgroundAlt: '#FDF2F2', ink: '#3F3F46', accent: '#BE123C', muted: '#5F5F66' },
  },
  'sand-olive': {
    fonts: { heading: ['Trebuchet MS', 'Verdana', ...SANS_KR], body: ['Trebuchet MS', 'Verdana', ...SANS_KR] },
    colors: { background: '#EDE6D6', backgroundAlt: '#EDE6D6', ink: '#292524', accent: '#5D6B1F', muted: '#656054' },
  },
  'glacier-sky': {
    fonts: { heading: ['Helvetica Neue', 'Helvetica', 'Arial', ...SANS_KR], body: ['Helvetica Neue', 'Helvetica', 'Arial', ...SANS_KR] },
    colors: { background: '#F0F4F8', backgroundAlt: '#F0F4F8', ink: '#0F172A', accent: '#0369A1', muted: '#5B6B7B' },
  },
  'mint-slate': {
    fonts: { heading: ['Inter', 'Helvetica Neue', 'Arial', ...SANS_KR], body: ['Inter', 'Helvetica Neue', 'Arial', ...SANS_KR] },
    colors: { background: '#F1F5F9', backgroundAlt: '#F1F5F9', ink: '#0F172A', accent: '#047857', muted: '#5B6B7B' },
  },
  'mist-indigo': {
    fonts: { heading: ['Avenir Next', 'Futura', 'Trebuchet MS', ...SANS_KR], body: ['Trebuchet MS', 'Verdana', ...SANS_KR] },
    colors: { background: '#F5F3FF', backgroundAlt: '#F5F3FF', ink: '#1E1B4B', accent: '#4338CA', muted: '#5E5A8A' },
  },
  'kr-myeongjo': {
    fonts: { heading: ['Noto Serif KR', 'Batang', 'BatangChe', 'Georgia', 'serif'], body: ['Noto Serif KR', 'Batang', 'Georgia', 'serif'] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#1A1A1A', accent: '#A31621', muted: '#5A5A5A' },
  },
  'kr-today': {
    fonts: { heading: ['Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'], body: ['Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'] },
    colors: { background: '#FAFAF9', backgroundAlt: '#FAFAF9', ink: '#1C1917', accent: '#1D4ED8', muted: '#5F5B57' },
  },
  'jp-shu': {
    fonts: { heading: ['Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', 'serif'], body: ['Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', 'serif'] },
    colors: { background: '#F7F3E8', backgroundAlt: '#F7F3E8', ink: '#2B2B2B', accent: '#B23A1D', muted: '#6E675C' },
  },
  'jp-ai': {
    fonts: { heading: ['Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif'], body: ['Hiragino Kaku Gothic ProN', 'Meiryo', 'sans-serif'] },
    colors: { background: '#FFFFFF', backgroundAlt: '#FFFFFF', ink: '#222222', accent: '#1F3A93', muted: '#5A5A5A' },
  },
  'cn-seal': {
    fonts: { heading: ['Songti SC', 'SimSun', 'Noto Serif SC', 'serif'], body: ['Songti SC', 'SimSun', 'Noto Serif SC', 'serif'] },
    colors: { background: '#F6F1E7', backgroundAlt: '#F6F1E7', ink: '#201A17', accent: '#A31621', muted: '#6E6259' },
  },
};

const CANDIDATE_THEME_IDS: Record<string, string> = {
  'opening-monumental-numeral': 'signal-grotesk',
  'insight-punchline': 'signal-grotesk',
  'comparison-columns': 'condensed-signal',
  'metric-anchored': 'lime-grotesk',
  'conclusion-charge': 'signal-orange',
  'series-opening': 'violet-grid',
  'manual-metric': 'manual-blue',
  'opening-statement': 'paper-serif',
  'thesis-statement': 'oxblood-serif',
  'comparison-stacked': 'sage-editorial',
  'evidence-focused': 'mist-indigo',
  'quote-attributed': 'blush-rose',
  'conclusion-restatement': 'gilt-garamond',
  'process-sequenced': 'blueprint',
  'architecture-map': 'forest-night',
  'evidence-collated': 'kraft-rust',
  'manual-opening': 'sand-olive',
  'manual-section': 'mono-manual',
  'margin-evidence': 'mint-slate',
  'thesis-sparse': 'hangul-gothic',
  'opening-breath': 'plum-noir',
  'problem-tension': 'navy-ink',
  'metric-hero': 'brutal-dark',
  'tradeoff-decided': 'copper-charcoal',
  'opening-context': 'grid-blue',
  'problem-narrative': 'glacier-sky',
  'thesis-grouped': 'friendly-round',
  'process-compact': 'terminal-amber',
  'evidence-explainer-columns': 'kr-today',
  'quote-voice': 'mincho-shu',
  'insight-unpacked': 'kr-myeongjo',
  'comparison-rows': 'evidence-slate',
  'architecture-layered': 'jp-ai',
  'evidence-anchored': 'evidence-slate',
  'manual-reference': 'jp-shu',
  'tradeoff-balanced': 'cn-seal',
};

for (const [id, themeId] of Object.entries(CANDIDATE_THEME_IDS)) {
  const c = COMPOSITION_CANDIDATES[id];
  const def = THEME_DEFS[themeId];
  if (c && def && c.theme === undefined) c.theme = { id: themeId, ...def };
}

/** Derived density when a record omits the tag (columns/primitives heuristic). */
export function densityOfCandidate(c: CompositionCandidate): CandidateDensity {
  if (c.density) return c.density;
  if (c.constraints.columns >= 2) return 'dense';
  if (c.primitives.includes('negative-space')) return 'sparse';
  return 'balanced';
}

/** Derived formality when a record omits the tag (system heuristic). */
export function formalityOfCandidate(c: CompositionCandidate): CandidateFormality {
  if (c.formality) return c.formality;
  if (c.systems.includes('expressive') && c.systems.length === 1) return 'expressive';
  if (c.systems.includes('swiss') || c.systems.includes('document')) return 'formal';
  return 'neutral';
}

/** Effective avoid-for list: explicit `avoidFor`, else `exceptions`. */
export function avoidForOfCandidate(c: CompositionCandidate): string[] {
  return c.avoidFor ?? c.exceptions;
}

export interface CandidateIndexRow {
  id: string;
  semanticTypes: SemanticSlideType[];
  systems: SystemId[];
  density: CandidateDensity;
  formality: CandidateFormality;
  bestFor: string[];
  avoidFor: string[];
}

export const CANDIDATE_INDEX_VERSION = '1.0.0' as const;

/**
 * Compact candidate-index for agent shortlisting (research §7, analogue of
 * frontend-slides selection-index.json fitted to type+system scoring):
 * read index -> shortlist from metadata -> read only shortlisted records.
 * Derived from records at call time, so it can never go stale.
 */
export function candidateIndex(): CandidateIndexRow[] {
  return CANDIDATE_IDS.map((id) => {
    const c = COMPOSITION_CANDIDATES[id];
    return {
      id,
      semanticTypes: [...c.semanticTypes],
      systems: [...c.systems],
      density: densityOfCandidate(c),
      formality: formalityOfCandidate(c),
      bestFor: [...(c.bestFor ?? [])],
      avoidFor: [...avoidForOfCandidate(c)],
    };
  });
}

// Validation: every semantic type needs >=2 candidates (§4.1).
const _coverageCheck = (() => {
  for (const t of SEMANTIC_TYPES) {
    const n = CANDIDATE_IDS.filter((id) => COMPOSITION_CANDIDATES[id].semanticTypes.includes(t)).length;
    if (n < 2) throw new Error(`composition grammar: semantic type "${t}" has ${n} candidates (need >=2)`);
  }
  return true;
})();
void _coverageCheck;

// ---------------------------------------------------------------------------
// Slide classification (§4.1): id-stem mapping + content overrides.
// Deterministic; every decision carries a rationale.
// ---------------------------------------------------------------------------

export interface Classification {
  type: SemanticSlideType;
  rationale: string;
  confidence: 'high' | 'medium' | 'low';
}

const DIM_TO_TYPE: Record<string, SemanticSlideType> = {
  problem: 'problem',
  solution: 'insight',
  results: 'evidence',
  differentiation: 'comparison',
  limitations: 'tradeoff',
  future: 'transition',
  capabilities: 'thesis',
  architecture: 'architecture',
  decisions: 'tradeoff',
  methodology: 'process',
  market: 'insight',
  model: 'thesis',
  experience: 'thesis',
  objectives: 'thesis',
  context: 'thesis',
  lessons: 'insight',
};

function slideText(slide: NarrativeSlide): string {
  return slide.blocks.map((b) => b.content).join('\n');
}

function titleText(slide: NarrativeSlide): string {
  return slide.blocks.filter((b) => b.role === 'title').map((b) => b.content).join(' ');
}

function hasRole(slide: NarrativeSlide, role: string): boolean {
  return slide.blocks.some((b) => b.role === role);
}

function captionHasRef(slide: NarrativeSlide): boolean {
  return slide.blocks.some((b) => b.role === 'caption' && /[:/]/.test(b.content));
}

/** Classify one slide. Pure + deterministic. */
export function classifySlide(slide: NarrativeSlide, index: number, total: number): Classification {
  const stem = slide.id.split('-').pop() ?? '';
  const title = titleText(slide);
  const text = slideText(slide);
  const low = `${title}\n${text}`.toLowerCase();

  // Content overrides first (explicit signals beat stems).
  const isComparisonSignal = /(^|\s)(vs\.?|versus|before\/after|before-after|비교|대비)(\s|$|:)/i.test(low)
    || (/before/i.test(low) && /after/i.test(low));
  if (isComparisonSignal && slide.blocks.filter((b) => b.role === 'body').length >= 2) {
    return { type: 'comparison', rationale: `comparison signal (vs/before-after/비교) with >=2 bodies on "${slide.id}"`, confidence: 'high' };
  }
  const bodyCount = slide.blocks.filter((b) => b.role === 'body').length;
  const looksQuoted = /^["“«「『]/.test(title.trim()) || /said|says|quote|인용|말했다/i.test(low);
  if (looksQuoted && title.length >= 20) {
    return { type: 'quote', rationale: `quote signal (quotation marks or attribution language) on "${slide.id}"`, confidence: 'medium' };
  }
  const stepSignals = (text.match(/(^|\n)\s*(step\s*\d|단계|1[.)、]|2[.)、]|3[.)、])/gi) ?? []).length;
  if (stepSignals >= 2 && bodyCount >= 2) {
    return { type: 'process', rationale: `process signal (${stepSignals} step markers, ${bodyCount} bodies) on "${slide.id}"`, confidence: 'medium' };
  }
  const isTradeoffSignal = /(trade-?off|장단점|트레이드오프|pros and cons|pros\/cons|risk|위험|limitation|한계)/i.test(low);
  if (isTradeoffSignal && bodyCount >= 2) {
    return { type: 'tradeoff', rationale: `trade-off signal with ${bodyCount} bodies on "${slide.id}"`, confidence: 'medium' };
  }
  // Short bridging slides read as transitions (not covers/closings).
  if (index > 0 && index < total - 1 && title.length <= 50 && bodyCount <= 1 && text.length <= 160
    && /^(next|now|then|그래서|이제|다음|결론적으로|한편)/i.test(title.trim())) {
    return { type: 'transition', rationale: `transition signal (short bridging title) on "${slide.id}"`, confidence: 'low' };
  }

  // Stem mapping (planner + quality roleOf conventions).
  if (stem === 'cover' || index === 0) {
    return { type: 'opening', rationale: `opening by position/stem ("${stem}") on "${slide.id}"`, confidence: 'high' };
  }
  if (stem === 'closing' || index === total - 1) {
    return { type: 'conclusion', rationale: `closing by position/stem ("${stem}") -> conclusion on "${slide.id}"`, confidence: 'high' };
  }
  if (stem === 'number') {
    // Metric integrity: meaningful + supported + relevant, else anchored thesis.
    const hasNumber = hasRole(slide, 'number');
    const supported = captionHasRef(slide);
    if (hasNumber && supported) {
      return { type: 'metric', rationale: `metric: number role with evidence ref on "${slide.id}"`, confidence: 'high' };
    }
    if (hasNumber) {
      return { type: 'metric', rationale: `metric (unsupported: no caption ref; metric-anchored fallback) on "${slide.id}"`, confidence: 'medium' };
    }
    return { type: 'thesis', rationale: `number stem without number role -> thesis on "${slide.id}"`, confidence: 'low' };
  }
  if (stem === 'proposal') {
    return { type: 'tradeoff', rationale: `proposal stem reads as open trade-off on "${slide.id}"`, confidence: 'medium' };
  }
  if (stem === 'point') {
    return { type: 'evidence', rationale: `encore point reads as evidence on "${slide.id}"`, confidence: 'medium' };
  }
  const dimType = DIM_TO_TYPE[stem];
  if (dimType) {
    // results with a number role stays metric-led evidence; keep evidence type
    // (composition candidates branch on roles too).
    return { type: dimType, rationale: `dimension stem "${stem}" -> ${dimType} on "${slide.id}"`, confidence: 'high' };
  }
  // Foreign stems (samples, hand input): infer from shape.
  if (hasRole(slide, 'number')) {
    return { type: 'metric', rationale: `foreign stem with number role -> metric on "${slide.id}"`, confidence: 'low' };
  }
  if (bodyCount >= 2 && hasRole(slide, 'title')) {
    return { type: 'thesis', rationale: `foreign multi-body stem -> grouped thesis on "${slide.id}"`, confidence: 'low' };
  }
  return { type: 'thesis', rationale: `default thesis for "${slide.id}"`, confidence: 'low' };
}

// ---------------------------------------------------------------------------
// Selection engine (§4.3): deck-aware scoring over candidates.
// Considers: semantic fit, content length, idea count, evidence density,
// language, surrounding slides, system identity, prior patterns.
// ---------------------------------------------------------------------------

export interface SelectionContext {
  classification: Classification;
  slide: NarrativeSlide;
  index: number;
  total: number;
  lang: 'ko' | 'en';
  systemId: SystemId;
  /** Semantic types of neighbors (already classified deck-wide). */
  prevType: SemanticSlideType | null;
  nextType: SemanticSlideType | null;
  /** Candidate ids chosen so far (deck order) for repetition control. */
  priorCandidates: string[];
  /** Audience arc label when known (hackathon/competition/showcase/...). */
  audience?: string;
}

export interface CompositionPlanItem {
  slideId: string;
  semanticType: SemanticSlideType;
  candidateId: string;
  rationale: string;
  score: number;
}

function preconditionsMet(c: CompositionCandidate, slide: NarrativeSlide, lang: 'ko' | 'en'): boolean {
  const p = c.preconditions;
  if (p.requiresRoles && !p.requiresRoles.every((r) => hasRole(slide, r))) return false;
  if (p.maxTitleChars !== undefined && titleText(slide).length > p.maxTitleChars) return false;
  const bodies = slide.blocks.filter((b) => b.role === 'body').length;
  if (p.maxBodyBlocks !== undefined && bodies > p.maxBodyBlocks) return false;
  if (p.minBodyBlocks !== undefined && bodies < p.minBodyBlocks) return false;
  if (p.languages && !p.languages.includes('any') && !p.languages.includes(lang)) return false;
  if (p.needsEvidenceRef && !captionHasRef(slide)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Intent-aware adjustments (Stage 3, C6; IMPL-OWNED weights). Intent arrives
// via SelectionContext.slide.blocks[].intent (C1, optional; never assumed
// present). Absent intent = zero adjustment = byte-identical legacy output.
// deliberateCrop is intentionally unscored here: it is a critic opt-in (C5),
// not a composition signal.
// ---------------------------------------------------------------------------

/** Structural read of C1 BlockIntent without owning schema.ts (B owns it). */
interface IntentLike {
  emphasis?: string;
  groupId?: string;
  relation?: string;
  deliberateCrop?: boolean;
}

function blockIntent(b: NarrativeBlock): IntentLike | undefined {
  return (b as NarrativeBlock & { intent?: IntentLike }).intent;
}

/**
 * Bonus when a primary-emphasis title/number meets a display-led candidate
 * (scale/number-led hero treatment). 7: beats epsilon races and the 6pt
 * single-column penalty, stays below hard mismatch penalties (12+).
 */
export const INTENT_PRIMARY_DISPLAY_BONUS = 7;
/**
 * Bonus when grouped blocks (>=2 sharing a groupId) meet a proximity/column
 * candidate (B01/B02 grouping). 6: beats the 5pt system-signature bonus so an
 * explicit author group can overrule house style, below hard penalties.
 */
export const INTENT_GROUPING_BONUS = 6;
/**
 * Bonus when a label-value/evidence/support relation meets an adjacency-led
 * candidate (grouping/alignment keeps related blocks adjacent, B07). 5: flips
 * epsilon-tied pools without overruling structural penalties.
 */
export const INTENT_RELATION_ADJACENCY_BONUS = 5;

function hasPrimitive(c: CompositionCandidate, p: CompositionPrimitive): boolean {
  return c.primitives.includes(p);
}

function intentAdjustments(c: CompositionCandidate, ctx: SelectionContext): { delta: number; reasons: string[] } {
  let delta = 0;
  const reasons: string[] = [];
  const blocks = ctx.slide.blocks;
  const primaryDisplay = blocks.some(
    (b) => (b.role === 'title' || b.role === 'number') && blockIntent(b)?.emphasis === 'primary',
  );
  if (primaryDisplay && (hasPrimitive(c, 'scale-contrast') || hasPrimitive(c, 'editorial-headline') || hasPrimitive(c, 'number-led'))) {
    delta += INTENT_PRIMARY_DISPLAY_BONUS;
    reasons.push('primary emphasis favoring display treatment');
  }
  const groupCounts = new Map<string, number>();
  for (const b of blocks) {
    const g = blockIntent(b)?.groupId;
    if (typeof g === 'string' && g.length > 0) groupCounts.set(g, (groupCounts.get(g) ?? 0) + 1);
  }
  const topGroup = [...groupCounts.entries()].find(([, n]) => n >= 2)?.[0];
  if (topGroup !== undefined && (hasPrimitive(c, 'typographic-grouping') || hasPrimitive(c, 'column-rhythm'))) {
    delta += INTENT_GROUPING_BONUS;
    reasons.push(`group ${topGroup} favoring proximity treatment`);
  }
  const relation = blocks.map((b) => blockIntent(b)?.relation)
    .find((r) => r === 'label-value' || r === 'evidence' || r === 'support');
  if (relation !== undefined && (hasPrimitive(c, 'typographic-grouping') || hasPrimitive(c, 'alignment'))) {
    delta += INTENT_RELATION_ADJACENCY_BONUS;
    reasons.push(`relation ${relation} favoring adjacent treatment`);
  }
  return { delta, reasons };
}

/** Legacy intent-blind score (deterministic; higher wins). */
function scoreCandidateBase(c: CompositionCandidate, ctx: SelectionContext): number {
  let s = 100;
  // Semantic fit is primary (exact type match guaranteed by candidate pool).
  // Content-length fit: penalize overflow beyond constraints.
  const titleLen = titleText(ctx.slide).length;
  if (c.constraints.maxTitleLines <= 2 && titleLen > 100) s -= 15;
  const bodies = ctx.slide.blocks.filter((b) => b.role === 'body');
  const longBodies = bodies.filter((b) => b.content.length > 300).length;
  s -= longBodies * 8;
  // Idea count: B08 ~4 chunks; compositions with columns handle 2-4 better.
  if (bodies.length >= 3 && c.constraints.columns < 2) s -= 12;
  if (bodies.length <= 1 && c.constraints.columns >= 2) s -= 6;
  // Evidence density: metric/evidence candidates want refs (already gated);
  // bonus when refs present.
  if (captionHasRef(ctx.slide) && (c.semanticTypes.includes('metric') || c.semanticTypes.includes('evidence'))) s += 6;
  // Specialization: a candidate built around the number role (G1 monumental
  // numeral, metric heroes) beats generic same-type candidates on numeral
  // slides. Cancels out within number-requiring pools (all get it).
  if (hasRole(ctx.slide, 'number') && c.preconditions.requiresRoles?.includes('number')) s += 8;
  // Language: Korean bodies prefer single-column keep-all handling downstream;
  // slight penalty for 2-col Korean bodies until keep-all lands (D03).
  if (ctx.lang === 'ko' && c.constraints.columns >= 2 && bodies.length >= 2) s -= 4;
  // Surrounding slides: avoid identical neighbors (rhythm), prefer contrast
  // between dense (columns) and sparse (hero/negative-space).
  const last = ctx.priorCandidates[ctx.priorCandidates.length - 1];
  const last2 = ctx.priorCandidates[ctx.priorCandidates.length - 2];
  if (last === c.id) s -= 25;
  if (last2 === c.id) s -= 10;
  // Repetition budget: max ~40% same candidate in decks >=5 (soft penalty).
  const sameCount = ctx.priorCandidates.filter((id) => id === c.id).length;
  if (ctx.total >= 5 && sameCount >= Math.max(2, Math.floor(ctx.total * 0.4))) s -= 20;
  // System identity: candidates already declare systems; bonus for the
  // system's signature primitive (keeps systems genuinely distinct).
  const signature: Record<SystemId, CompositionPrimitive> = {
    editorial: 'controlled-asymmetry', swiss: 'column-rhythm', expressive: 'scale-contrast',
    document: 'textual-repetition',
  };
  if (c.primitives.includes(signature[ctx.systemId])) s += 5;
  // Deterministic tie-break by candidate id hash (stable, no RNG state).
  let h = 0;
  for (let i = 0; i < c.id.length; i++) h = (Math.imul(h, 31) + c.id.charCodeAt(i)) | 0;
  s += (Math.abs(h) % 100) / 1000;
  return s;
}

/**
 * Deterministic score: higher wins. Weights are derived heuristics (H);
 * intent adjustments (C6) stack additively and are zero when intent is absent.
 */
export function scoreCandidate(c: CompositionCandidate, ctx: SelectionContext): number {
  return scoreCandidateBase(c, ctx) + intentAdjustments(c, ctx).delta;
}

function fallbackCandidate(type: SemanticSlideType, systemId: SystemId, priorCandidates: string[] = []): CompositionCandidate {
  const n = priorCandidates.length;
  const repeating = n >= 2 && priorCandidates[n - 1] === priorCandidates[n - 2] ? priorCandidates[n - 1] : null;
  const pick = (pool: CompositionCandidate[]): CompositionCandidate | null => {
    if (pool.length === 0) return null;
    if (repeating && pool.length > 1) {
      const alt = pool.find((c) => c.id !== repeating);
      if (alt) return alt;
    }
    return pool[0];
  };
  const pool = CANDIDATE_IDS.map((id) => COMPOSITION_CANDIDATES[id])
    .filter((c) => c.semanticTypes.includes(type) && c.systems.includes(systemId));
  // Cross-system pool (keeps grammar total when same-system is thin).
  const anySystem = CANDIDATE_IDS.map((id) => COMPOSITION_CANDIDATES[id])
    .filter((c) => c.semanticTypes.includes(type));
  if (repeating) {
    // Prefer any non-repeating same-type candidate (same-system first).
    const altSame = pool.find((c) => c.id !== repeating);
    if (altSame) return altSame;
    const altCross = anySystem.find((c) => c.id !== repeating);
    if (altCross) return altCross;
  }
  const same = pick(pool);
  if (same) return same;
  const cross = pick(anySystem);
  if (cross) return cross;
  return COMPOSITION_CANDIDATES['thesis-statement'];
}

/** Select one candidate for a slide given deck context. Pure + deterministic. */
export function selectComposition(ctx: SelectionContext): CompositionPlanItem {
  let pool = CANDIDATE_IDS.map((id) => COMPOSITION_CANDIDATES[id])
    .filter((c) => c.semanticTypes.includes(ctx.classification.type) && c.systems.includes(ctx.systemId))
    .filter((c) => preconditionsMet(c, ctx.slide, ctx.lang));
  // Hard rule: never a 3rd repeat in a row when an alternate meets preconditions.
  const n = ctx.priorCandidates.length;
  if (n >= 2 && ctx.priorCandidates[n - 1] === ctx.priorCandidates[n - 2] && pool.length > 1) {
    const filtered = pool.filter((c) => c.id !== ctx.priorCandidates[n - 1]);
    if (filtered.length > 0) pool = filtered;
  }
  if (pool.length === 0) {
    const fb = fallbackCandidate(ctx.classification.type, ctx.systemId, ctx.priorCandidates);
    return {
      slideId: ctx.slide.id,
      semanticType: ctx.classification.type,
      candidateId: fb.id,
      rationale: `fallback: no candidate met preconditions for ${ctx.classification.type}; chose ${fb.id}. ${ctx.classification.rationale}`,
      score: -1,
    };
  }
  let best = pool[0];
  let bestScore = scoreCandidate(pool[0], ctx);
  for (const c of pool.slice(1)) {
    const sc = scoreCandidate(c, ctx);
    if (sc > bestScore) { best = c; bestScore = sc; }
  }
  const reasons: string[] = [ctx.classification.rationale];
  if (ctx.prevType === ctx.classification.type) reasons.push('same-type neighbor: repetition penalty applied');
  reasons.push(`chose ${best.id} (${best.primitives.join('+')}) score=${bestScore.toFixed(2)}`);
  // C6: cite intent only when it changed the outcome (re-run intent-blind).
  let baseBest = pool[0];
  let baseBestScore = scoreCandidateBase(pool[0], ctx);
  for (const c of pool.slice(1)) {
    const sc = scoreCandidateBase(c, ctx);
    if (sc > baseBestScore) { baseBest = c; baseBestScore = sc; }
  }
  if (baseBest.id !== best.id) {
    const cited = intentAdjustments(best, ctx).reasons;
    reasons.push(`intent: ${cited.length > 0 ? cited.join(', ') : 'adjustments decisive'}`);
  }
  return {
    slideId: ctx.slide.id,
    semanticType: ctx.classification.type,
    candidateId: best.id,
    rationale: reasons.join('; '),
    score: bestScore,
  };
}

export interface PlanCompositionsOptions {
  audience?: string;
}

/** Deck-level planning: classify all slides first, then select in order. */
export function planCompositions(
  narrative: Narrative, systemId: SystemId, opts: PlanCompositionsOptions = {},
): CompositionPlanItem[] {
  const lang = narrative.lang.toLowerCase().startsWith('ko') ? 'ko' : 'en';
  const total = narrative.slides.length;
  const classifications = narrative.slides.map((s, i) => classifySlide(s, i, total));
  const plan: CompositionPlanItem[] = [];
  narrative.slides.forEach((slide, i) => {
    const ctx: SelectionContext = {
      classification: classifications[i],
      slide,
      index: i,
      total,
      lang,
      systemId,
      prevType: i > 0 ? classifications[i - 1].type : null,
      nextType: i < total - 1 ? classifications[i + 1].type : null,
      priorCandidates: plan.map((p) => p.candidateId),
      audience: opts.audience,
    };
    plan.push(selectComposition(ctx));
  });
  return plan;
}

/** Validate a plan: every slide covered, candidates exist, no triple-repeat. */
export function validateCompositionPlan(plan: CompositionPlanItem[], narrative: Narrative): string[] {
  const errors: string[] = [];
  if (plan.length !== narrative.slides.length) {
    errors.push(`plan covers ${plan.length} slides, narrative has ${narrative.slides.length}`);
  }
  plan.forEach((p, i) => {
    if (!COMPOSITION_CANDIDATES[p.candidateId]) errors.push(`slide ${p.slideId}: unknown candidate ${p.candidateId}`);
    if (i >= 2 && plan[i - 2].candidateId === p.candidateId && plan[i - 1].candidateId === p.candidateId) {
      errors.push(`slide ${p.slideId}: candidate ${p.candidateId} repeats 3x in a row`);
    }
  });
  return errors;
}

// ---------------------------------------------------------------------------
// Formal grammar export (§4.4): machine-readable bundle.
// ---------------------------------------------------------------------------

export const COMPOSITION_GRAMMAR = {
  version: '0.2.0',
  semanticTypes: SEMANTIC_TYPES,
  primitives: PRIMITIVES,
  candidates: COMPOSITION_CANDIDATES,
  scoring: {
    weights: 'semantic-fit primary; length/idea/evidence/language/neighbor/repetition/system-signature adjustments (see scoreCandidate); additive intent bonuses primary-display/grouping/relation when intent present (C6)',
    repetitionRule: 'no identical neighbor preferred (-25), no 3x row (validation error), soft 40% budget in decks >=5',
    tieBreak: 'deterministic id-hash epsilon (no RNG state)',
  },
  fallback: 'same-type same-system first candidate; then same-type any-system; then thesis-statement',
  validation: 'plan length matches narrative; candidates exist; no triple-repeat',
} as const;
