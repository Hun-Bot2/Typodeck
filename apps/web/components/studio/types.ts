import type { Deck, Narrative } from '@typodeck/core';

export const STAGES = ['ingest', 'evidence', 'narrative', 'layout'] as const;
export type Stage = (typeof STAGES)[number];
export type StageState = 'pending' | 'active' | 'done';
export type Phase = 'idle' | 'generating' | 'done' | 'error';

export type SystemId = string;

export interface CatalogPreset {
  id: string;
  version: string;
  name: { en: string; ko: string };
  audience: { en: string; ko: string };
  goal: { en: string; ko: string };
  steps: Array<{ id: string; dim: string; label: { en: string; ko: string }; optional: boolean }>;
  langNotes: { en: string; ko: string };
}

export interface CatalogSystem {
  id: string;
  version: string;
  status: 'production' | 'experimental' | 'deprecated';
  philosophy: string;
  supports: string[];
  limitations: string[];
  renderable: boolean;
  fonts: { heading: string; body: string } | null;
}

export interface Catalog {
  purposes: CatalogPreset[];
  systems: CatalogSystem[];
}

/** One Typo Pack selection card from GET /api/templates. */
export interface TemplateEntry {
  slug: string;
  name: string;
  scheme: 'light' | 'dark';
  density: 'low' | 'medium' | 'high';
  baseSystem: string;
  mood: string[];
  bestFor: string;
}

export const LEGACY_PURPOSES = [
  { id: 'hackathon', label: 'Hackathon (legacy)' },
  { id: 'competition', label: 'Competition (legacy)' },
  { id: 'showcase', label: 'Showcase (legacy)' },
];

/** Fallback preset ids when /api/catalog is unreachable; core still validates. */
export const FALLBACK_PRESETS = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10'];

export interface ClaimCounts {
  total: number;
  verified: number;
  suggestion: number;
  ungrounded: number;
}

export interface Provenance {
  provider: string;
  generatedBy: string;
  claims: ClaimCounts;
  warnings: string[];
  requests?: { api: number; blobs: number; cached: number };
}

export interface GenerateSource {
  kind: 'repo' | 'idea';
  owner?: string;
  repo?: string;
  branch?: string;
  sha?: string | null;
}

export interface GenerateResult {
  narrative: Narrative;
  decks: Record<SystemId, Deck>;
  provenance: Provenance;
  slideMarkdown?: string;
  source?: GenerateSource;
}

export interface TypedError {
  code: string;
  message: string;
  resetAt?: string;
  retryAfterMs?: number;
}

export interface EvidenceClaimView {
  id: string;
  text: string;
  kind: 'verified' | 'suggestion' | 'ungrounded';
  status: 'implemented' | 'proposed' | 'historical' | 'unverified' | 'deprecated';
  refs: Array<{ path: string; lines?: [number, number] }>;
  numbers: string[];
  url: string | null;
}

export interface EvidenceResult {
  source: GenerateSource;
  files: Array<{ path: string; lines: number; bytes: number; truncated: boolean }>;
  claims: EvidenceClaimView[];
  counts: ClaimCounts;
  warnings: string[];
  degraded: boolean;
  requests?: { api: number; blobs: number; cached: number };
}

/** One-click demo inputs; the first is the smallest and fastest. */
export const SAMPLE_REPOS = ['sindresorhus/is', 'psf/requests', 'facebook/react'];

export const STAGE_LABEL: Record<StageState, string> = {
  pending: 'waiting',
  active: 'working…',
  done: 'done',
};

/** Plain-language guidance per typed error code. */
export const ERROR_GUIDE: Record<string, string> = {
  'rate-limited':
    'GitHub refused with a rate limit, so nothing was invented. Wait for the reset, or continue with pasted text below.',
  'not-found': 'That repository was not found. Check the spelling, or paste the text directly instead.',
  'private-repo': 'Private repositories are rejected on purpose. Paste the text you want presented instead.',
  timeout: 'The request timed out. Smaller repositories respond faster; pasted text always works.',
  network: 'GitHub could not be reached. Check the connection, or continue with pasted text.',
  'idea-length': 'Idea text needs 100–20,000 characters. Add detail, or point at a repository instead.',
  'invalid-input': 'That input was not understood. Use owner/repo, a github.com URL, or pasted text.',
};

export function formatResetAt(resetAt: string): string {
  const d = new Date(resetAt);
  return Number.isNaN(d.getTime()) ? resetAt : d.toLocaleTimeString();
}

export function formatEvidenceRef(ref: { path: string; lines?: [number, number] }): string {
  if (!ref.lines) return ref.path;
  const [a, b] = ref.lines;
  return a === b ? `${ref.path}:${a}` : `${ref.path}:${a}–${b}`;
}
