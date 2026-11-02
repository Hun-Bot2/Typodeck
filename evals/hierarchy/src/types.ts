// Stage-4 hierarchy eval: shared types.
// Eval-owned; mirrors core C1 vocabulary structurally (never imports core types
// at the type level except through the built dist at runtime boundaries).

/** The five seeded defect families (narrative- and/or deck-level seeds). */
export type DefectCategory =
  | 'headline-prominence'
  | 'number-scale'
  | 'grouping'
  | 'clip'
  | 'contrast';

export type SeedLevel = 'narrative' | 'deck';

export interface SeedSpec {
  /** Stable seed id, e.g. "F04:grouping/deck:swap-member". */
  id: string;
  fixtureId: string;
  category: DefectCategory;
  level: SeedLevel;
  /** Short deterministic description of the mutation. */
  mutation: string;
}

export type ArmId = 'A' | 'C';

export interface ArmFinding {
  arm: ArmId;
  /** Eval-owned check name (a/* for text-only, c/* for layout-only). */
  check: string;
  category: DefectCategory;
  /** Block indices (narrative order) or ids (deck) the finding points at. */
  targets: string[];
  evidence: string;
}

/** One scored item: an input + the seeds planted in it + per-arm findings. */
export interface ScoredItem {
  itemId: string;
  fixtureId: string;
  system: string;
  /** Seeds planted (empty = clean control). */
  seeds: SeedSpec[];
  findingsA: ArmFinding[];
  findingsC: ArmFinding[];
}

export interface PRPoint {
  tp: number;
  fp: number;
  fn: number;
  precision: number | null; // null when tp+fp == 0
  recall: number | null; // null when tp+fn == 0
}

export interface FixtureMeta {
  id: string;
  kind: string;
  lang: string;
  systems: string[];
  knownGood: { primaryBlock: number; intentOrder: number[]; note: string };
}
