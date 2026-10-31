// Typodeck Narrative Intelligence — Narrative Quality Gate.
// Deterministic evaluation of a planned narrative against its claims:
// meaningfulness, coherence, evidence fidelity, slide-level information value.
// Advisory by design: reports issues + scores; never throws, never fails a build.

import type { Claim } from './evidence';
import type { Narrative, NarrativeSlide } from './schema';
import {
  ARC,
  CAPTION_STATUS_TAGS,
  classifyStatus,
  claimSimilarity,
  isContextless,
  isHeroEligible,
  SIM_REPEATED_THESIS,
  type Audience,
  type Dimension,
} from './semantics';

export interface QualityIssue {
  code: string;
  severity: 'error' | 'warning';
  slide?: string;
  detail: string;
}

export interface QualityScores {
  meaningfulness: number;
  coherence: number;
  fidelity: number;
  infoValue: number;
  overall: number;
}

export interface QualityReport {
  pass: boolean;
  scores: QualityScores;
  coverage: Dimension[];
  issues: QualityIssue[];
}

export interface EvaluateOptions {
  audience?: Audience;
  /** Explicit arc order; wins over ARC[audience]. Used by purpose presets. */
  arc?: Dimension[];
}

const KNOWN_DIMS = new Set<string>([
  'problem', 'solution', 'results', 'differentiation',
  'limitations', 'future', 'capabilities', 'architecture',
  'decisions', 'methodology', 'market', 'model',
  'experience', 'objectives', 'context', 'lessons',
]);

type SlideRole = 'cover' | 'number' | 'thesis' | 'proposal' | 'closing';

/** Slide role + dimension from the planner's id stem (`n4-problem`). */
function roleOf(slide: NarrativeSlide): { role: SlideRole; dim: Dimension | null } {
  const stem = slide.id.split('-').pop() ?? '';
  if (stem === 'cover') return { role: 'cover', dim: null };
  if (stem === 'number') return { role: 'number', dim: null };
  if (stem === 'proposal') return { role: 'proposal', dim: null };
  if (stem === 'closing') return { role: 'closing', dim: null };
  if (KNOWN_DIMS.has(stem)) return { role: 'thesis', dim: stem as Dimension };
  return { role: 'thesis', dim: null }; // foreign stems (samples, hand input) read as generic theses
}

function blocksOf(slide: NarrativeSlide, role: string): string[] {
  return slide.blocks.filter((b) => b.role === role).map((b) => b.content);
}

/** True when slide content quotes the claim (exactly or as a shortened prefix). */
function quotesClaim(content: string, claim: Claim): boolean {
  if (content === claim.text) return true;
  const prefix = content.endsWith('…') ? content.slice(0, -1) : content;
  return prefix.length >= 30 && claim.text.startsWith(prefix);
}

function quotedClaims(slide: NarrativeSlide, claims: Claim[]): Claim[] {
  const texts = slide.blocks
    .filter((b) => b.role === 'title' || b.role === 'body')
    .map((b) => b.content);
  return claims.filter((c) => texts.some((t) => quotesClaim(t, c) || t.includes(c.text)));
}

/** A caption carries a ref when some segment looks like path[:lines]. */
function captionHasRef(caption: string): boolean {
  for (const raw of caption.split(/[·;]/)) {
    const seg = raw.trim();
    if (seg === '') continue;
    if (CAPTION_STATUS_TAGS.has(seg.split(/\s/)[0].toLowerCase())) continue;
    if (seg.startsWith('Source:') || seg.startsWith('출처:')) {
      const rest = seg.replace(/^(Source|출처):\s*/, '').trim();
      if (rest !== '' && !/^(verified|unverified|illustrative|proposal)/i.test(rest)) return true;
      continue;
    }
    if (/[:/]/.test(seg) && /[a-z0-9_]/i.test(seg)) return true;
  }
  return false;
}

const MAX_ISSUES = 24;

export function evaluateNarrative(
  narrative: Narrative,
  claims: Claim[],
  opts: EvaluateOptions = {},
): QualityReport {
  const issues: QualityIssue[] = [];
  const push = (issue: QualityIssue): void => {
    if (issues.length < MAX_ISSUES) issues.push(issue);
  };

  const roles = narrative.slides.map((s) => ({ slide: s, ...roleOf(s) }));
  const thesis = roles.filter((r) => r.role === 'thesis');
  const numbers = roles.filter((r) => r.role === 'number');
  const content = roles.filter((r) => r.role === 'thesis' || r.role === 'number');
  const pads = roles.filter((r) => r.role === 'proposal');
  const cover = roles.find((r) => r.role === 'cover');
  const closing = roles.find((r) => r.role === 'closing');

  // --- Meaningfulness -------------------------------------------------------
  let meaningfulness = 100;
  let contextlessHits = 0;
  for (const r of thesis) {
    const title = blocksOf(r.slide, 'title')[0] ?? '';
    if (title !== '' && isContextless(title)) {
      contextlessHits += 1;
      if (contextlessHits <= 2) {
        meaningfulness -= 15;
        push({
          code: 'contextless-excerpt', severity: 'warning', slide: r.slide.id,
          detail: `thesis quotes a pronoun-led fragment with no anchor: "${title.slice(0, 60)}"`,
        });
      }
    }
  }
  const coverage = [...new Set(thesis.map((r) => r.dim).filter((d): d is Dimension => d !== null))];
  if (coverage.length < 3 && content.length > 0) {
    meaningfulness -= 10;
    push({
      code: 'missing-dimension-coverage', severity: 'warning',
      detail: `only ${coverage.length} narrative dimension(s) covered: ${coverage.join(', ') || 'none'}`,
    });
  }
  const padRatio = pads.length / Math.max(1, narrative.slides.length - 2);
  if (padRatio > 0.4 && narrative.slides.length > 2) {
    meaningfulness -= 15;
    push({
      code: 'proposal-heavy', severity: 'warning',
      detail: `${pads.length} of ${narrative.slides.length} slides are filler proposals`,
    });
  }
  for (const r of content) {
    const quoted = quotedClaims(r.slide, claims);
    if (quoted.some((c) => classifyStatus(c.text, c.kind) === 'deprecated')) {
      meaningfulness -= 15;
      push({
        code: 'deprecated-as-fact', severity: 'error', slide: r.slide.id,
        detail: 'slide presents a deprecated claim as current fact',
      });
    }
  }

  // --- Coherence ------------------------------------------------------------
  let coherence = 100;
  let repeatPairs = 0;
  for (let i = 0; i < thesis.length; i++) {
    for (let j = i + 1; j < thesis.length; j++) {
      const a = blocksOf(thesis[i].slide, 'title')[0] ?? '';
      const b = blocksOf(thesis[j].slide, 'title')[0] ?? '';
      if (a !== '' && b !== '' && claimSimilarity(a, b) >= SIM_REPEATED_THESIS) {
        repeatPairs += 1;
        if (repeatPairs <= 2) {
          coherence -= 20;
          push({
            code: 'repeated-thesis', severity: 'error', slide: thesis[j].slide.id,
            detail: `thesis repeats "${thesis[i].slide.id}" (${claimSimilarity(a, b).toFixed(2)} similar)`,
          });
        }
      }
    }
  }
  let redundantPairs = 0;
  for (let i = 0; i < content.length; i++) {
    for (let j = i + 1; j < content.length; j++) {
      const a = [...blocksOf(content[i].slide, 'title'), ...blocksOf(content[i].slide, 'body')].join(' ');
      const b = [...blocksOf(content[j].slide, 'title'), ...blocksOf(content[j].slide, 'body')].join(' ');
      if (a.trim() !== '' && claimSimilarity(a, b) >= 0.8 && a !== b) {
        redundantPairs += 1;
        if (redundantPairs <= 2) {
          coherence -= 15;
          push({
            code: 'redundant-slide', severity: 'error', slide: content[j].slide.id,
            detail: `slide nearly duplicates "${content[i].slide.id}"`,
          });
        }
      } else if (a !== '' && a === b) {
        redundantPairs += 1;
        if (redundantPairs <= 2) {
          coherence -= 15;
          push({
            code: 'redundant-slide', severity: 'error', slide: content[j].slide.id,
            detail: `slide duplicates "${content[i].slide.id}" verbatim`,
          });
        }
      }
    }
  }
  const arc = opts.arc ?? ARC[opts.audience ?? 'general'];
  const arcIndex = new Map<Dimension, number>(arc.map((d, i) => [d, i]));
  let maxSeen = -1;
  let disorders = 0;
  for (const r of thesis) {
    if (r.dim === null) continue;
    const idx = arcIndex.get(r.dim) ?? 0;
    if (idx < maxSeen) {
      disorders += 1;
      if (disorders <= 2) {
        coherence -= 10;
        push({
          code: 'arc-disorder', severity: 'warning', slide: r.slide.id,
          detail: `"${r.dim}" appears after a later arc dimension`,
        });
      }
    } else {
      maxSeen = idx;
    }
  }

  // --- Fidelity ---------------------------------------------------------------
  let fidelity = 100;
  let fabricated = 0;
  let badHeroes = 0;
  for (const r of numbers) {
    const hero = blocksOf(r.slide, 'number')[0] ?? '';
    if (hero === '') continue;
    // Resolve the source through the slide title (a quote of the claim), not
    // the hero: short heroes ("3") occur in unrelated claims, including dates.
    const title = blocksOf(r.slide, 'title')[0] ?? '';
    const source =
      claims.find((c) => c.refs.length > 0 && quotesClaim(title, c)) ??
      claims.find((c) => c.text.includes(hero) && c.refs.length > 0);
    if (!source || !source.text.includes(hero)) {
      fabricated += 1;
      if (fabricated <= 2) {
        fidelity -= 25;
        push({
          code: 'fabricated-metric', severity: 'error', slide: r.slide.id,
          detail: `hero "${hero}" appears in no sourced claim`,
        });
      }
    } else if (!isHeroEligible(hero, source.text)) {
      badHeroes += 1;
      if (badHeroes <= 2) {
        fidelity -= 20;
        push({
          code: 'hero-metric-invalid', severity: 'error', slide: r.slide.id,
          detail: `hero "${hero}" is a version, date, or hash fragment`,
        });
      }
    }
  }
  let missingCaptions = 0;
  for (const r of content) {
    const captions = blocksOf(r.slide, 'caption');
    if (captions.length === 0 || !captions.some(captionHasRef)) {
      missingCaptions += 1;
      if (missingCaptions <= 3) {
        fidelity -= 10;
        push({
          code: 'caption-missing', severity: 'warning', slide: r.slide.id,
          detail: 'content slide carries no parseable source ref',
        });
      }
    }
  }

  // --- Information value ------------------------------------------------------
  let infoValue = 100;
  for (const r of content) {
    const title = blocksOf(r.slide, 'title')[0];
    const body = blocksOf(r.slide, 'body')[0];
    if (title !== undefined && body !== undefined && title === body) {
      infoValue -= 15;
      push({
        code: 'title-body-identical', severity: 'error', slide: r.slide.id,
        detail: 'title and body are identical; the slide adds no information',
      });
    }
    if (r.role === 'thesis' && body === undefined && (title ?? '').length < 60) {
      infoValue -= 8;
      push({
        code: 'thin-slide', severity: 'warning', slide: r.slide.id,
        detail: 'thesis slide has no supporting body',
      });
    }
  }
  if (closing) {
    const body = blocksOf(closing.slide, 'body').join(' ');
    const sourced = claims.some((c) => c.text.length >= 30 && body.includes(c.text));
    if (!sourced) {
      infoValue -= 25;
      push({
        code: 'weak-conclusion', severity: 'error', slide: closing.slide.id,
        detail: 'closing restates no sourced claim',
      });
    }
  }
  if (cover) {
    const body = blocksOf(cover.slide, 'body').join(' ');
    if (body !== '') {
      const sourced = claims.some((c) => c.text.length >= 30 && body.includes(c.text));
      if (!sourced) {
        infoValue -= 10;
        push({
          code: 'weak-cover', severity: 'warning', slide: cover.slide.id,
          detail: 'cover body quotes no sourced claim',
        });
      }
    }
  }

  const clamp = (n: number): number => Math.max(0, Math.min(100, n));
  const scores: QualityScores = {
    meaningfulness: clamp(meaningfulness),
    coherence: clamp(coherence),
    fidelity: clamp(fidelity),
    infoValue: clamp(infoValue),
    overall: 0,
  };
  scores.overall = Math.round(
    (scores.meaningfulness + scores.coherence + scores.fidelity + scores.infoValue) / 4,
  );
  return { pass: !issues.some((i) => i.severity === 'error'), scores, coverage, issues };
}

/** Resolve the source claims quoted by any slide (cover/closing included). */
export function traceSlide(slide: NarrativeSlide, claims: Claim[]): Claim[] {
  return quotedClaims(slide, claims);
}
