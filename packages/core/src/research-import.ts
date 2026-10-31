// Typodeck research import — 500-reference program → candidate specs.
// Boundary rules (correction 4 + ownership):
// - Reads researcher JSONL from a caller-supplied path. NEVER writes to
//   research/ and never modifies researcher files or workspaces.
// - Output is evidence-backed candidate SPECIFICATIONS for human review.
//   The importer has no code path that creates or promotes production
//   Visual Systems; every emitted spec carries status "experimental".
// - Philosophy text is EXTRACTIVE (verbatim observed claims only).
//   Nothing here invents design findings.

import { COMPOSITION_GRAMMAR } from './composition';
import { ENGINE_CAPABILITIES } from './visual-systems';

export type ResearchCategory =
  | 'swiss-international' | 'editorial' | 'brutalist' | 'minimalist'
  | 'expressive' | 'hangul-contemporary' | 'japanese-modern' | 'data-driven'
  | 'retro' | 'luxury' | 'academic' | 'experimental';

const CATEGORIES: readonly string[] = [
  'swiss-international', 'editorial', 'brutalist', 'minimalist',
  'expressive', 'hangul-contemporary', 'japanese-modern', 'data-driven',
  'retro', 'luxury', 'academic', 'experimental',
];

export interface ResearchRecord {
  ref_id: string;
  source_url: string;
  canonical_category: ResearchCategory;
  classification_confidence: 'high' | 'medium' | 'low';
  layer: 'L1-practitioner' | 'L2-trade-press' | 'L3-scholarly';
  jurisdiction: 'KR' | 'EN' | 'JP' | 'GLOBAL';
  license: string;
  design_tokens: {
    composition: string[];
    type_scale?: Record<string, string[]>;
    color?: Record<string, string[]>;
    texture?: Record<string, string[]>;
  };
  claims_observed: string[];
  claims_excluded?: string[];
  slide_transfer: 'direct' | 'adapted' | 'not-transferable';
  slide_transfer_rationale?: string;
  reusable_primitives: string[];
  typefaces_mentioned?: string[];
  evidence_grade: 'A' | 'B' | 'C' | 'D';
  needs_render_proof: boolean;
  crossref_ids?: string[];
}

export interface RecordError {
  line: number;
  ref_id: string | null;
  message: string;
}

const REF_ID = /^R\d{3}$/;
const URL = /^https?:\/\/[^\s]+$/;
const LICENSES = new Set([
  'CC0', 'CC-BY', 'CC-BY-SA', 'CC-BY-NC', 'CC-BY-NC-SA',
  'CC-BY-ND', 'CC-BY-NC-ND', 'Fair-use-only', 'All-rights-reserved',
]);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/**
 * Validate one parsed record (compatible subset of the researchers'
 * research/schema.json; their validate.py remains authoritative).
 * Returns error messages (empty = valid).
 */
export function validateResearchRecord(rec: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(rec)) return ['record must be an object'];
  if (typeof rec.ref_id !== 'string' || !REF_ID.test(rec.ref_id)) errors.push('ref_id must match ^R\\d{3}$');
  if (typeof rec.source_url !== 'string' || !URL.test(rec.source_url)) errors.push('source_url must be an http(s) URL');
  if (!CATEGORIES.includes(rec.canonical_category as string)) errors.push('canonical_category is not a known category');
  if (!['high', 'medium', 'low'].includes(rec.classification_confidence as string)) {
    errors.push('classification_confidence must be high|medium|low');
  }
  if (!['L1-practitioner', 'L2-trade-press', 'L3-scholarly'].includes(rec.layer as string)) {
    errors.push('layer must be L1|L2|L3');
  }
  if (!['KR', 'EN', 'JP', 'GLOBAL'].includes(rec.jurisdiction as string)) errors.push('bad jurisdiction');
  if (typeof rec.license !== 'string' || !LICENSES.has(rec.license)) errors.push('bad license');
  const tokens = rec.design_tokens;
  if (!isRecord(tokens) || !Array.isArray(tokens.composition) || tokens.composition.length === 0) {
    errors.push('design_tokens.composition must be a non-empty array');
  } else if (!tokens.composition.every((t) => typeof t === 'string' && t.length > 0)) {
    errors.push('design_tokens.composition must hold non-empty strings');
  }
  if (!Array.isArray(rec.claims_observed) || rec.claims_observed.length === 0) {
    errors.push('claims_observed must be a non-empty array');
  } else if (!(rec.claims_observed as unknown[]).every((c) => typeof c === 'string' && (c as string).length > 0)) {
    errors.push('claims_observed must hold non-empty strings');
  }
  if (!['direct', 'adapted', 'not-transferable'].includes(rec.slide_transfer as string)) {
    errors.push('slide_transfer must be direct|adapted|not-transferable');
  }
  if (!Array.isArray(rec.reusable_primitives)) errors.push('reusable_primitives must be an array');
  if (!['A', 'B', 'C', 'D'].includes(rec.evidence_grade as string)) errors.push('evidence_grade must be A|B|C|D');
  if (typeof rec.needs_render_proof !== 'boolean') errors.push('needs_render_proof must be boolean');
  return errors;
}

/** Parse JSONL text into valid records + per-line errors (1-based lines). */
export function parseResearchJsonl(text: string): { records: ResearchRecord[]; errors: RecordError[] } {
  const records: ResearchRecord[] = [];
  const errors: RecordError[] = [];
  const lines = text.split('\n');
  lines.forEach((raw, idx) => {
    const line = idx + 1;
    if (raw.trim() === '') return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      errors.push({ line, ref_id: null, message: 'not valid JSON' });
      return;
    }
    const problems = validateResearchRecord(parsed);
    if (problems.length > 0) {
      const ref = isRecord(parsed) && typeof parsed.ref_id === 'string' ? parsed.ref_id : null;
      for (const message of problems) errors.push({ line, ref_id: ref, message });
      return;
    }
    records.push(parsed as unknown as ResearchRecord);
  });
  return { records, errors };
}

/** Deduplicate by source_url (first record wins; deterministic). */
export function dedupeRecords(records: ResearchRecord[]): { kept: ResearchRecord[]; duplicates: ResearchRecord[] } {
  const seen = new Set<string>();
  const kept: ResearchRecord[] = [];
  const duplicates: ResearchRecord[] = [];
  for (const r of records) {
    if (seen.has(r.source_url)) {
      duplicates.push(r);
      continue;
    }
    seen.add(r.source_url);
    kept.push(r);
  }
  return { kept, duplicates };
}

const norm = (s: string): string => s.toLowerCase().trim().replace(/[\s_]+/g, '-');

/**
 * Map a research composition/primitive term to engine capabilities.
 * Returns { supported, missing, unmapped } term lists. Unknown terms are
 * reported for human review — never guessed.
 */
export function mapTermToCapabilities(term: string): { supported: string[]; missing: string[]; unmapped: string[] } {
  const t = norm(term);
  // Engine-supported strategies.
  const supportedMap: Record<string, string> = {
    grid: 'multi-column',
    'multi-column': 'multi-column',
    columns: 'multi-column',
    'asymmetric-grid-left': 'asymmetric-offset',
    asymmetric: 'asymmetric-offset',
    asymmetry: 'asymmetric-offset',
    centered: 'center-align',
    'center-aligned': 'center-align',
    'left-aligned': 'left-align',
    'left-align': 'left-align',
    'right-aligned': 'right-align',
    monospace: 'native-text',
    'hanging-punctuation': 'optical-hang',
    'optical-alignment': 'optical-hang',
    'scale-contrast': 'scale-contrast',
    'weight-contrast': 'weight-contrast',
    measure: 'measure-cap',
    rhythm: 'rhythm-scale',
    'baseline-grid': 'rhythm-scale',
    'alternating-background': 'alternating-background',
  };
  // Known-unsupported: honest MISSING markers (engine cannot do these).
  const missingMap: Record<string, string> = {
    'vertical-text': 'vertical-text',
    vertical: 'vertical-text',
    tategaki: 'vertical-text',
    rotation: 'rotation',
    rotated: 'rotation',
    diagonal: 'rotation',
    overlap: 'overlap-layout',
    overlapping: 'overlap-layout',
    bleed: 'bleed-crop',
    crop: 'bleed-crop',
    'outline-type': 'outline-type',
    gradient: 'gradient-text',
    'gradient-text': 'gradient-text',
    texture: 'textured-background',
    'variable-font': 'variable-font-axis',
    'color-font': 'color-font',
    animation: 'animation',
    kinetic: 'animation',
    '3d-type': '3d-type',
  };
  // Pure descriptors: no capability implication either way.
  const descriptive = new Set([
    'minimal', 'minimalist', 'bold', 'elegant', 'restrained', 'dramatic',
    'dense', 'airy', 'refined', 'modern', 'classic', 'editorial', 'swiss',
    'brutalist', 'expressive', 'quiet', 'luxury', 'poetic', 'neutral',
  ]);
  if (supportedMap[t]) return { supported: [supportedMap[t]], missing: [], unmapped: [] };
  if (missingMap[t]) return { supported: [], missing: [missingMap[t]], unmapped: [] };
  if (descriptive.has(t)) return { supported: [], missing: [], unmapped: [] };
  return { supported: [], missing: [], unmapped: [t] };
}

export interface ResearchCluster {
  key: string;
  category: ResearchCategory;
  primaryToken: string;
  records: ResearchRecord[];
  /** Claims observed in 2+ records (extractive principle candidates). */
  sharedClaims: string[];
}

const GRADE_RANK: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

/**
 * Cluster records by category + primary composition token (heuristic v0).
 * Clusters are the "truly distinct strategy" candidates for human review.
 */
export function clusterRecords(records: ResearchRecord[]): ResearchCluster[] {
  const groups = new Map<string, ResearchRecord[]>();
  for (const r of [...records].sort((a, b) => (a.ref_id < b.ref_id ? -1 : 1))) {
    const primary = norm(r.design_tokens.composition[0] ?? 'none');
    const key = `${r.canonical_category}|${primary}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)?.push(r);
  }
  const clusters: ResearchCluster[] = [];
  for (const [key, members] of groups) {
    const counts = new Map<string, number>();
    for (const m of members) {
      for (const c of new Set(m.claims_observed)) counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    const sharedClaims = [...counts.entries()]
      .filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
      .map(([c]) => c);
    clusters.push({
      key,
      category: members[0].canonical_category,
      primaryToken: norm(members[0].design_tokens.composition[0] ?? 'none'),
      records: members,
      sharedClaims,
    });
  }
  // Distinct strategies first: multi-record clusters, then best evidence grade.
  clusters.sort((a, b) => {
    const am = a.records.length > 1 ? 0 : 1;
    const bm = b.records.length > 1 ? 0 : 1;
    if (am !== bm) return am - bm;
    const ag = Math.min(...a.records.map((r) => GRADE_RANK[r.evidence_grade]));
    const bg = Math.min(...b.records.map((r) => GRADE_RANK[r.evidence_grade]));
    if (ag !== bg) return ag - bg;
    return a.key < b.key ? -1 : 1;
  });
  return clusters;
}

export interface CandidateSpec {
  candidateId: string;
  /** Always "experimental": the importer cannot promote (correction 4). */
  status: 'experimental';
  version: '0.1.0';
  sourceCluster: { category: ResearchCategory; primaryToken: string; recordCount: number };
  /** Extractive philosophy: verbatim observed claims only, capped. */
  philosophy: string;
  grammarRef: string;
  researchRefs: string[];
  provenance: Array<{ ref_id: string; source_url: string; evidence_grade: string }>;
  reusablePrimitives: string[];
  supportedCapabilities: string[];
  missingCapabilities: string[];
  unmappedTerms: string[];
  needsRenderProof: boolean;
  typefacesMentioned: string[];
  slideTransfer: Array<'direct' | 'adapted' | 'not-transferable'>;
  warnings: string[];
}

const slug = (s: string): string =>
  norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'none';

/** Build one candidate spec per cluster (specs only, never registry writes). */
export function buildCandidateSpecs(clusters: ResearchCluster[]): CandidateSpec[] {
  return clusters.map((c) => {
    const supported = new Set<string>();
    const missing = new Set<string>();
    const unmapped = new Set<string>();
    const primitives = new Set<string>();
    const typefaces = new Set<string>();
    const transfers = new Set<CandidateSpec['slideTransfer'][number]>();
    const warnings: string[] = [];
    for (const r of c.records) {
      for (const term of [...r.design_tokens.composition, ...r.reusable_primitives]) {
        const m = mapTermToCapabilities(term);
        m.supported.forEach((s) => supported.add(s));
        m.missing.forEach((s) => missing.add(s));
        m.unmapped.forEach((s) => unmapped.add(s));
      }
      r.reusable_primitives.forEach((p) => primitives.add(p));
      (r.typefaces_mentioned ?? []).forEach((t) => typefaces.add(t));
      transfers.add(r.slide_transfer);
    }
    // Engine truth check: supported claims must exist in the inventory.
    for (const s of [...supported]) {
      if (!(ENGINE_CAPABILITIES as readonly string[]).includes(s)) {
        supported.delete(s);
        unmapped.add(s);
      }
    }
    const coreClaims = c.sharedClaims.length > 0 ? c.sharedClaims : c.records[0].claims_observed;
    if (c.sharedClaims.length === 0) warnings.push('single-source cluster: no shared claim corroboration');
    if (c.records.some((r) => r.evidence_grade === 'D')) warnings.push('contains grade-D evidence');
    if (c.records.some((r) => r.needs_render_proof)) warnings.push('needs_render_proof on at least one record');
    const philosophy = `Derived (extractive) from ${c.records.length} record(s): ` +
      coreClaims.slice(0, 3).join(' / ').slice(0, 500);
    return {
      candidateId: `candidate-${slug(c.category)}-${slug(c.primaryToken)}`,
      status: 'experimental',
      version: '0.1.0',
      sourceCluster: { category: c.category, primaryToken: c.primaryToken, recordCount: c.records.length },
      philosophy,
      grammarRef: `composition-grammar@${COMPOSITION_GRAMMAR.version}`,
      researchRefs: c.records.map((r) => r.ref_id),
      provenance: c.records.map((r) => ({ ref_id: r.ref_id, source_url: r.source_url, evidence_grade: r.evidence_grade })),
      reusablePrimitives: [...primitives].sort(),
      supportedCapabilities: [...supported].sort(),
      missingCapabilities: [...missing].sort(),
      unmappedTerms: [...unmapped].sort(),
      needsRenderProof: c.records.some((r) => r.needs_render_proof),
      typefacesMentioned: [...typefaces].sort(),
      slideTransfer: [...transfers].sort(),
      warnings,
    };
  });
}

export interface ImportOptions {
  /** Minimum evidence grade to include (default: D = everything). */
  minGrade?: 'A' | 'B' | 'C' | 'D';
  /** Include not-transferable records as specs (default false: counted, skipped). */
  includeNotTransferable?: boolean;
}

export interface ImportResult {
  specs: CandidateSpec[];
  stats: {
    lines: number;
    valid: number;
    duplicates: number;
    belowGrade: number;
    notTransferable: number;
    clusters: number;
  };
}

/** Full pipeline: JSONL text → validated candidate specs + stats. */
export function importResearchRecords(text: string, opts: ImportOptions = {}): { result: ImportResult; errors: RecordError[] } {
  const { records, errors } = parseResearchJsonl(text);
  if (errors.length > 0) {
    return {
      result: { specs: [], stats: { lines: 0, valid: 0, duplicates: 0, belowGrade: 0, notTransferable: 0, clusters: 0 } },
      errors,
    };
  }
  const minRank = GRADE_RANK[opts.minGrade ?? 'D'];
  const gradeKept = records.filter((r) => GRADE_RANK[r.evidence_grade] <= minRank);
  const belowGrade = records.length - gradeKept.length;
  const transferable = opts.includeNotTransferable
    ? gradeKept
    : gradeKept.filter((r) => r.slide_transfer !== 'not-transferable');
  const notTransferable = gradeKept.length - transferable.length;
  const { kept, duplicates } = dedupeRecords(transferable);
  const clusters = clusterRecords(kept);
  const specs = buildCandidateSpecs(clusters);
  return {
    result: {
      specs,
      stats: {
        lines: records.length,
        valid: records.length,
        duplicates: duplicates.length,
        belowGrade,
        notTransferable,
        clusters: clusters.length,
      },
    },
    errors: [],
  };
}
