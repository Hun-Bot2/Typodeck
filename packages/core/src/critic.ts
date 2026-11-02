// Typodeck 90+ — Visual Critic + Revision Loop (§7).
// Structural checks are deterministic (validate.ts/schema). Perceptual and
// design checks are GEOMETRIC PROXIES, honestly labeled — no vision model is
// integrated (no verified integration available; see visionUnmeasured). An AI
// critic must not be treated as ground truth; these proxies are not either:
// they are regression signals with documented limits.
//
// Revision: identify failure -> classify -> targeted correction ->
// regenerate -> re-evaluate, bounded (default max 3 attempts). Provenance
// preserved; editability re-validated after every attempt.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { planArtDirection } from './art-direction';
import { COMPOSITION_CANDIDATES, planCompositions, type CompositionPlanItem } from './composition';
import { estimateWrap, inkHeightIn, layoutDeck, rectsOverlap } from './layout';
import { applyOpticalCorrections, ragScore, widowRisk } from './optical';
import { SLIDE_HEIGHT_IN, SLIDE_WIDTH_IN, validateDeck, type Deck, type Narrative, type Slide } from './schema';
import type { SystemId } from './systems';

export type FailureClass = 'semantic' | 'structural' | 'typographic' | 'perceptual';

export interface CriticFinding {
  slideId: string;
  failureClass: FailureClass;
  check: string;
  severity: 'error' | 'warning';
  detail: string;
  suggestedFix: string;
}

export interface CriticScores {
  /** Share of slides with title<=2 lines and body<=60 chars/line. */
  typographicFit: number;
  /** Share of blocks without widow risk and rag>=70. */
  opticalQuality: number;
  /** 1 - max same-candidate share (repetition proxy). */
  compositionVariety: number;
  /** Share of text blocks meeting WCAG AA (4.5:1 / 3:1 large). */
  contrastAA: number;
}

export interface CriticReport {
  findings: CriticFinding[];
  scores: CriticScores;
  /** Checks that need a real rendered comparison or vision model. */
  visionUnmeasured: string[];
}

function luminance(hex: string): number {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrastRatio(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Critique a positioned deck. Pure + deterministic. */
export function critiqueDeck(deck: Deck, narrative?: Narrative, plan?: CompositionPlanItem[]): CriticReport {
  const findings: CriticFinding[] = [];

  for (const slide of deck.slides) {
    // Structural: bounds + overlap (defense in depth; layout already guards).
    for (const b of slide.blocks) {
      if (b.x < -1e-9 || b.y < -1e-9 || b.x + b.w > 13.33 + 1e-9 || b.y + b.h > 7.5 + 1e-9) {
        findings.push({
          slideId: slide.id, failureClass: 'structural', check: 'bounds', severity: 'error',
          detail: `block ${b.id} exceeds canvas`, suggestedFix: 're-layout at smaller scale or narrower measure',
        });
      }
      // Typographic: title line cap (derived A01/A07), body measure (T2).
      const est = estimateWrap(b.content, b.fontSize, b.w, b.tracking, b.lineHeight, b.fontWeight >= 700);
      const lines = est.lines;
      // Static overflow-risk (estimate-based WARNING; the headless rendered
      // gate below is authoritative). Ink-aware like fitText: rendering clips
      // ink, not line boxes, so the estimate must agree with the gate.
      const inkH = inkHeightIn(est, b.fontSize, b.lineHeight);
      if (inkH > b.h + 0.005 || est.maxWidthIn > b.w + 0.005) {
        findings.push({
          slideId: slide.id, failureClass: 'structural', check: 'overflow-risk', severity: 'warning',
          detail: `block ${b.id} estimate ${est.maxWidthIn.toFixed(2)}x${inkH.toFixed(2)}in exceeds box ${b.w.toFixed(2)}x${b.h.toFixed(2)}in (char-model)`,
          suggestedFix: 're-layout with narrower measure, smaller scale, or R1-R3 rules; confirm with critiqueRenderedOverflow',
        });
      }
      if (b.role === 'title' && lines.length > 2) {
        findings.push({
          slideId: slide.id, failureClass: 'typographic', check: 'title-lines', severity: 'warning',
          detail: `title spans ${lines.length} lines (cap 2, derived)`, suggestedFix: 'shorten title in narrative (<=~50 chars) or split slide',
        });
      }
      if (b.role === 'body') {
        const longest = Math.max(...lines.map((l) => l.length));
        if (longest > 60) {
          findings.push({
            slideId: slide.id, failureClass: 'typographic', check: 'body-measure', severity: 'warning',
            detail: `body line ${longest} chars (cap ~60, derived)`, suggestedFix: 'narrow measure via composition plan or split body',
          });
        }
      }
      // Optical proxies (O3/O4).
      if (widowRisk(b)) {
        findings.push({
          slideId: slide.id, failureClass: 'typographic', check: 'widow-risk', severity: 'warning',
          detail: `block ${b.id} ends in 1-2 word line (T8)`, suggestedFix: 're-break lines (manual until auto-rebreak is validated)',
        });
      }
      if ((b.role === 'title' || b.role === 'number') && lines.length > 1) {
        const rag = ragScore(b);
        if (rag.score < 70) {
          findings.push({
            slideId: slide.id, failureClass: 'perceptual', check: 'rag-quality', severity: 'warning',
            detail: `headline rag score ${rag.score} (${rag.detail})`, suggestedFix: 're-break headline for even rag',
          });
        }
      }
      // Contrast (WCAG AA thresholds; projection transfer unvalidated per C06).
      const ratio = contrastRatio(b.color, slide.background);
      const large = b.fontSize >= 18 || (b.fontSize >= 14 && b.fontWeight >= 700);
      const need = large ? 3.0 : 4.5;
      if (ratio < need) {
        findings.push({
          slideId: slide.id, failureClass: 'perceptual', check: 'contrast', severity: 'error',
          detail: `block ${b.id} contrast ${ratio.toFixed(2)}:1 < ${need}:1`, suggestedFix: 'darken text or quiet background token',
        });
      }
    }
    for (let i = 0; i < slide.blocks.length; i++) {
      for (let j = i + 1; j < slide.blocks.length; j++) {
        if (rectsOverlap(slide.blocks[i], slide.blocks[j])) {
          findings.push({
            slideId: slide.id, failureClass: 'structural', check: 'overlap', severity: 'error',
            detail: `blocks ${i} and ${j} overlap`, suggestedFix: 're-layout with narrower measure or smaller scale',
          });
        }
      }
    }
    // Hierarchy proxy (B14): title must exceed body size when both present.
    const titles = slide.blocks.filter((b) => b.role === 'title');
    const bodies = slide.blocks.filter((b) => b.role === 'body');
    if (titles.length > 0 && bodies.length > 0) {
      const tMin = Math.min(...titles.map((b) => b.fontSize));
      const bMax = Math.max(...bodies.map((b) => b.fontSize));
      if (tMin <= bMax) {
        findings.push({
          slideId: slide.id, failureClass: 'perceptual', check: 'hierarchy', severity: 'warning',
          detail: `title min ${tMin}pt <= body max ${bMax}pt`, suggestedFix: 'restore size contrast between title and body',
        });
      }
    }
    // Semantic: unsupported metric hero (number without caption ref).
    const hasNumber = slide.blocks.some((b) => b.role === 'number');
    const hasRef = slide.blocks.some((b) => b.role === 'caption' && /[:/]/.test(b.content));
    if (hasNumber && !hasRef) {
      findings.push({
        slideId: slide.id, failureClass: 'semantic', check: 'unsupported-metric', severity: 'warning',
        detail: 'number role without caption ref', suggestedFix: 'demote to metric-anchored composition',
      });
    }
  }

  // Deck-level rhythm (art-direction issues surface as perceptual findings).
  if (narrative && plan) {
    void plan;
  }

  // Scores (proxies).
  let titleOk = 0;
  let titleN = 0;
  let bodyOk = 0;
  let bodyN = 0;
  let opticalOk = 0;
  let opticalN = 0;
  let contrastOk = 0;
  let contrastN = 0;
  for (const slide of deck.slides) {
    for (const b of slide.blocks) {
      const lines = estimateWrap(b.content, b.fontSize, b.w, b.tracking, b.lineHeight, b.fontWeight >= 700).lines;
      if (b.role === 'title') { titleN++; if (lines.length <= 2) titleOk++; }
      if (b.role === 'body') { bodyN++; if (Math.max(...lines.map((l) => l.length)) <= 60) bodyOk++; }
      opticalN++;
      if (!widowRisk(b) && (b.role !== 'title' || lines.length <= 1 || ragScore(b).score >= 70)) opticalOk++;
      const ratio = contrastRatio(b.color, slide.background);
      const large = b.fontSize >= 18 || (b.fontSize >= 14 && b.fontWeight >= 700);
      contrastN++;
      if (ratio >= (large ? 3.0 : 4.5)) contrastOk++;
    }
  }
  const planIds = plan?.map((p) => p.candidateId) ?? [];
  const maxShare = planIds.length === 0 ? 0
    : Math.max(...Object.values(planIds.reduce<Record<string, number>>((m, id) => ({ ...m, [id]: (m[id] ?? 0) + 1 }), {}))) / planIds.length;

  return {
    findings,
    scores: {
      typographicFit: (titleN + bodyN) === 0 ? 1 : (titleOk + bodyOk) / (titleN + bodyN),
      opticalQuality: opticalN === 0 ? 1 : opticalOk / opticalN,
      compositionVariety: 1 - maxShare,
      contrastAA: contrastN === 0 ? 1 : contrastOk / contrastN,
    },
    visionUnmeasured: [
      'rendered wrap vs estimateWrap divergence (T11: needs PPTX rasterizer)',
      'font substitution in PowerPoint/LibreOffice (needs rendered comparison)',
      'optical centering/balance verdicts (need visual review)',
      'clipping inside text boxes (overflow-risk is estimate-only; critiqueRenderedOverflow measures the render)',
      'vision-model aesthetic scores (no verified integration; not fabricated)',
    ],
  };
}

export interface ReviseOptions {
  maxAttempts?: number;
  seed?: number;
}

export interface ReviseResult {
  deck: Deck;
  plan: CompositionPlanItem[];
  reports: CriticReport[];
  /** Provenance: one line per attempt (what failed, what was tried). */
  provenance: string[];
  attempts: number;
}

/**
 * Bounded revision loop: critique -> targeted fix -> regenerate -> re-evaluate.
 * Fixes operate on the composition plan + layout/optical pipeline (content
 * itself is never rewritten: factual accuracy over visual appeal).
 */
export function reviseDeck(narrative: Narrative, systemId: SystemId, opts: ReviseOptions = {}): ReviseResult {
  const maxAttempts = opts.maxAttempts ?? 3;
  const seed = opts.seed ?? 42;
  const provenance: string[] = [];
  const reports: CriticReport[] = [];

  let plan = planCompositions(narrative, systemId);
  // Art-direction rhythm balancing is attempt 0 (part of improved pipeline).
  const art = planArtDirection(narrative, systemId);
  plan = art.slides.map((s, i) => ({ ...plan[i], candidateId: s.candidateId, semanticType: s.semanticType }));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const laid = layoutDeck(narrative, systemId, { seed, compositionPlan: plan });
    const { deck } = applyOpticalCorrections(laid, { tiers: ['measurable', 'heuristic'] });
    validateDeck(deck);
    const report = critiqueDeck(deck, narrative, plan);
    reports.push(report);
    const errors = report.findings.filter((f) => f.severity === 'error');
    if (errors.length === 0) {
      provenance.push(`attempt ${attempt}: clean (0 errors, ${report.findings.length} warnings) — stop`);
      return { deck, plan, reports, provenance, attempts: attempt };
    }
    if (attempt === maxAttempts) {
      provenance.push(`attempt ${attempt}: ${errors.length} errors remain — bounded stop (${errors.map((e) => e.check).join(', ')})`);
      return { deck, plan, reports, provenance, attempts: attempt };
    }
    // Targeted fix by failure class (first error only; one change per attempt).
    const target = errors[0];
    const idx = plan.findIndex((p) => p.slideId === target.slideId);
    if (idx < 0) {
      provenance.push(`attempt ${attempt}: ${target.check} on unknown slide — stop`);
      return { deck, plan, reports, provenance, attempts: attempt };
    }
    if (target.failureClass === 'semantic' && target.check === 'unsupported-metric') {
      const anchored = Object.values(COMPOSITION_CANDIDATES).find((c) =>
        c.id === 'metric-anchored' && c.systems.includes(systemId));
      if (anchored && plan[idx].candidateId !== anchored.id) {
        plan[idx] = { ...plan[idx], candidateId: anchored.id, rationale: `${plan[idx].rationale}; revision: demoted to metric-anchored` };
        provenance.push(`attempt ${attempt}: semantic/unsupported-metric on ${target.slideId} -> metric-anchored`);
        continue;
      }
    }
    // Structural/perceptual errors: try alternate same-type candidate.
    const slide = narrative.slides[idx];
    const alt = Object.values(COMPOSITION_CANDIDATES).find((c) =>
      c.id !== plan[idx].candidateId
      && c.semanticTypes.includes(plan[idx].semanticType)
      && c.systems.includes(systemId)
      && (!c.preconditions.requiresRoles || c.preconditions.requiresRoles.every((r) => slide.blocks.some((b) => b.role === r))));
    if (alt) {
      plan[idx] = { ...plan[idx], candidateId: alt.id, rationale: `${plan[idx].rationale}; revision: ${target.failureClass}/${target.check} -> ${alt.id}` };
      provenance.push(`attempt ${attempt}: ${target.failureClass}/${target.check} on ${target.slideId} -> ${alt.id}`);
    } else {
      provenance.push(`attempt ${attempt}: ${target.failureClass}/${target.check} on ${target.slideId} — no alternate (stop)`);
      return { deck, plan, reports, provenance, attempts: attempt };
    }
  }
  // Unreachable (loop returns), kept for type-totality.
  const laid = layoutDeck(narrative, systemId, { seed, compositionPlan: plan });
  return { deck: laid, plan, reports, provenance, attempts: maxAttempts };
}

// ---------------------------------------------------------------------------
// Rendered overflow gate (Q1 OVERFLOW-MUST-BE-VISIBLE).
// research/slide-reconstruction: 3 silent `overflow: hidden` clips, all
// validation-OK. This gate measures the RENDER (headless-Chrome scroll vs
// client size per text block) instead of trusting the char-width estimate.
// Intentional cropping is distinguished ONLY by explicit opt-in (per-block
// `allowOverflow` flag or the `intentional` allowlist) — never inferred.
// ---------------------------------------------------------------------------

/** One block's rendered box metrics, collected by OVERFLOW_PROBE_JS. */
export interface RenderedBlockMeasurement {
  /** Position among .slide-block elements (fallback match key). */
  index: number;
  /** data-block-id when present (mirror HTML; real SlideView has none). */
  blockId: string | null;
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
  fontSizePx: number;
  lineHeightPx: number;
}

export interface RenderedOverflowOptions {
  /**
   * Explicit opt-in: block ids allowed to crop (e.g. deliberate bleeds).
   * Overflow on these blocks is reported as intentional, never as a finding.
   * No other block is ever treated as intentional — the gate never guesses.
   */
  intentional?: readonly string[];
}

export interface RenderedOverflowRow {
  blockId: string;
  overflowX: boolean;
  overflowY: boolean;
  intentional: boolean;
  scrollHeight: number;
  clientHeight: number;
  scrollWidth: number;
  clientWidth: number;
  vTolerancePx: number;
  hTolerancePx: number;
}

/**
 * Vertical tolerance: a rendered line box is fontExtent × fontSize where
 * fontExtent = max(lineHeight, font ascent+descent) — real fonts lay out up
 * to ~1.2em per line (measured: 231pt digit line boxes at 1.07em in Chrome),
 * while only cap-height ink (~0.7em EST, research findings) shows. Tolerance
 * (lineHeight − 0.5)em covers extent-minus-ink; a fully lost line adds
 * ≥0.8em (schema min lineHeight) so real clips still fire. Sub-half-line
 * slivers may pass here — the ink-aware static check covers that class.
 * Horizontal tolerance covers tracking rounding only: "12"→"1" must fire.
 */
export function overflowTolerances(m: Pick<RenderedBlockMeasurement, 'fontSizePx' | 'lineHeightPx'>): {
  vTolerancePx: number; hTolerancePx: number;
} {
  const ratio = m.fontSizePx > 0 ? m.lineHeightPx / m.fontSizePx : 1.2;
  return {
    vTolerancePx: Math.max(2, (ratio - 0.5) * m.fontSizePx),
    hTolerancePx: Math.max(2, 0.05 * m.fontSizePx),
  };
}

/** Pure detection over collected measurements. Deterministic; fully unit-testable. */
export function detectRenderedOverflow(
  measurements: RenderedBlockMeasurement[],
  fallbackIds: readonly string[],
  opts: RenderedOverflowOptions = {},
): RenderedOverflowRow[] {
  const intentional = new Set(opts.intentional ?? []);
  return measurements.map((m) => {
    const blockId = m.blockId ?? fallbackIds[m.index] ?? `block-${m.index}`;
    const { vTolerancePx, hTolerancePx } = overflowTolerances(m);
    return {
      blockId,
      overflowX: m.scrollWidth - m.clientWidth > hTolerancePx,
      overflowY: m.scrollHeight - m.clientHeight > vTolerancePx,
      intentional: intentional.has(blockId),
      scrollHeight: m.scrollHeight,
      clientHeight: m.clientHeight,
      scrollWidth: m.scrollWidth,
      clientWidth: m.clientWidth,
      vTolerancePx,
      hTolerancePx,
    };
  });
}

export interface RenderedOverflowReport {
  findings: CriticFinding[];
  /** Block ids with a measurement. */
  measured: string[];
  /** Block ids with no measurement (coverage gap, warned not failed). */
  unmeasured: string[];
  /** Overflowing blocks that were explicitly opted in (no finding). */
  intentional: string[];
}

/**
 * Critic gate over rendered measurements for one slide. Real overflow is an
 * ERROR (check `overflow-visible`); unmeasured blocks are WARNINGS
 * (`overflow-unmeasured`); opted-in blocks never produce findings.
 * Block-level opt-in (`allowOverflow: true` on the block object, provisional
 * until the schema carries the flag) and the `intentional` allowlist are the
 * only two opt-in channels, and both are explicit.
 */
export function critiqueRenderedOverflow(
  slide: Slide,
  measurements: RenderedBlockMeasurement[],
  opts: RenderedOverflowOptions = {},
): RenderedOverflowReport {
  const findings: CriticFinding[] = [];
  const ids = slide.blocks.map((b) => b.id);
  const rows = detectRenderedOverflow(measurements, ids, opts);
  const measured = rows.map((r) => r.blockId);
  const unmeasured = ids.filter((id) => !measured.includes(id));
  const intentional: string[] = [];
  for (const row of rows) {
    const block = slide.blocks.find((b) => b.id === row.blockId);
    const flagged = (block as unknown as { allowOverflow?: unknown })?.allowOverflow === true;
    if (!row.overflowX && !row.overflowY) continue;
    if (row.intentional || flagged) {
      intentional.push(row.blockId);
      continue;
    }
    const axes: string[] = [];
    if (row.overflowX) axes.push(`width ${row.scrollWidth}px > ${row.clientWidth}px client (tol ${row.hTolerancePx.toFixed(1)}px)`);
    if (row.overflowY) axes.push(`height ${row.scrollHeight}px > ${row.clientHeight}px client (tol ${row.vTolerancePx.toFixed(1)}px)`);
    findings.push({
      slideId: slide.id, failureClass: 'structural', check: 'overflow-visible', severity: 'error',
      detail: `block ${row.blockId} clips in the render: ${axes.join('; ')}`,
      suggestedFix: 'grow the box, step the size down (R1-R3), or split the slide — or explicitly opt in via allowOverflow',
    });
  }
  for (const id of unmeasured) {
    findings.push({
      slideId: slide.id, failureClass: 'structural', check: 'overflow-unmeasured', severity: 'warning',
      detail: `block ${id} has no rendered measurement (probe coverage gap)`,
      suggestedFix: 're-run the headless measurement so every block is covered',
    });
  }
  return { findings, measured, unmeasured, intentional };
}

// Font stacks mirror apps/web SlideView fontFor (preview-only mapping);
// the mirror exists so core can measure without depending on apps/web.
const MIRROR_SERIF = '"Noto Serif KR", "Source Serif 4", Georgia, serif';
const MIRROR_SANS = 'Pretendard, Inter, "Noto Sans KR", system-ui, sans-serif';
const MIRROR_DISPLAY = '"Archivo Black", Pretendard, Inter, "Noto Sans KR", system-ui, sans-serif';

function mirrorFontFor(system: string, role: string, fonts?: { heading: string; body: string }): string {
  if (fonts) return role === 'body' || role === 'caption' ? fonts.body : fonts.heading;
  if (system === 'editorial') return role === 'body' || role === 'caption' ? MIRROR_SANS : MIRROR_SERIF;
  if (system === 'expressive') return role === 'body' || role === 'caption' ? MIRROR_SANS : MIRROR_DISPLAY;
  return MIRROR_SANS;
}

function escapeHtml(s: string): string {
  // Must match slide-ir.ts: style="..." attributes carry quoted font stacks.
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Probe script: measures every .slide-block (scroll/client + font metrics)
 * and appends the JSON results as #typodeck-overflow for --dump-dom capture.
 * Works on mirror HTML (data-block-id) and real SlideView HTML (index match).
 */
export const OVERFLOW_PROBE_JS = `(function(){
  function collect(){
    var els = document.querySelectorAll('.slide-block');
    var out = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var cs = window.getComputedStyle(el);
      var fs = parseFloat(cs.fontSize) || 0;
      var lh = cs.lineHeight === 'normal' ? fs * 1.2 : (parseFloat(cs.lineHeight) || fs * 1.2);
      out.push({
        index: i,
        blockId: el.getAttribute('data-block-id'),
        scrollWidth: el.scrollWidth, scrollHeight: el.scrollHeight,
        clientWidth: el.clientWidth, clientHeight: el.clientHeight,
        fontSizePx: fs, lineHeightPx: lh
      });
    }
    if (!document.getElementById('typodeck-overflow')) {
      var s = document.createElement('script');
      s.id = 'typodeck-overflow'; s.type = 'application/json';
      s.textContent = JSON.stringify(out);
      document.body.appendChild(s);
    }
  }
  if (document.readyState === 'complete') collect();
  else window.addEventListener('load', collect);
})();`;

export interface MeasureHtmlOptions {
  /** Stage width in px (height follows 16:9). Default 1280. */
  widthPx?: number;
  fonts?: { heading: string; body: string };
  /** Include the measurement probe script. Default true. */
  probe?: boolean;
}

/**
 * Standalone measure HTML for one slide. Mirrors SlideView geometry math
 * (%-positioned blocks, cqw font sizes, .slide-block overflow:hidden +
 * pre-wrap + break-word) plus data-block-id per block. MIRROR RISK: if
 * SlideView changes, this mirror must be re-verified (compare against
 * SlideView SSR output); prefer measuring real SlideView HTML when available.
 */
export function renderMeasureHtml(slide: Slide, system: string, opts: MeasureHtmlOptions = {}): string {
  const widthPx = opts.widthPx ?? 1280;
  const blocks = slide.blocks.map((b) => {
    const style = [
      `left:${((b.x / SLIDE_WIDTH_IN) * 100).toFixed(4)}%`,
      `top:${((b.y / SLIDE_HEIGHT_IN) * 100).toFixed(4)}%`,
      `width:${((b.w / SLIDE_WIDTH_IN) * 100).toFixed(4)}%`,
      `height:${((b.h / SLIDE_HEIGHT_IN) * 100).toFixed(4)}%`,
      `font-size:${(((b.fontSize / 72) / SLIDE_WIDTH_IN) * 100).toFixed(4)}cqw`,
      `font-weight:${b.fontWeight}`,
      `line-height:${b.lineHeight}`,
      `letter-spacing:${b.tracking}em`,
      `text-align:${b.align}`,
      `color:${b.color}`,
      `font-family:${mirrorFontFor(system, b.role, opts.fonts)}`,
    ].join(';');
    return `<div class="slide-block" data-block-id="${escapeHtml(b.id)}" style="${escapeHtml(style)}">${escapeHtml(b.content)}</div>`;
  }).join('');
  const css = `.slide{position:relative;aspect-ratio:1333/750;width:${widthPx}px;overflow:hidden;container-type:inline-size;background:${slide.background}}`
    + `.slide-block{position:absolute;overflow:hidden;white-space:pre-wrap;overflow-wrap:break-word}`;
  const probe = opts.probe === false ? '' : `<script>${OVERFLOW_PROBE_JS}</script>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>measure</title><style>${css}</style></head>`
    + `<body style="margin:0"><div class="slide">${blocks}</div>${probe}</body></html>`;
}

export interface ChromeMeasureOptions {
  /** Chrome binary; default $TYPODECK_CHROME, then well-known paths. */
  chromePath?: string;
  /** Stage width in px. Default 1280. */
  widthPx?: number;
  /** Chrome timeout in ms. Default 30000. */
  timeoutMs?: number;
}

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'google-chrome',
  'chromium',
];

/**
 * Measure one HTML document in headless Chrome via --dump-dom (no new deps).
 * The HTML must include OVERFLOW_PROBE_JS (renderMeasureHtml does by
 * default). Throws when Chrome is missing or the probe found nothing —
 * callers treat that as "unmeasured", never as "clean".
 */
export function measureHtmlWithChrome(html: string, opts: ChromeMeasureOptions = {}): RenderedBlockMeasurement[] {
  const candidates = [opts.chromePath, process.env.TYPODECK_CHROME, ...CHROME_CANDIDATES].filter(Boolean) as string[];
  const dir = mkdtempSync(join(tmpdir(), 'typodeck-overflow-'));
  const file = join(dir, 'measure.html');
  writeFileSync(file, html);
  try {
    let lastError: string | null = null;
    for (const bin of candidates) {
      const r = spawnSync(bin, [
        '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
        `--window-size=${opts.widthPx ?? 1280},720`,
        '--virtual-time-budget=3000', '--dump-dom', `file://${file}`,
      ], { encoding: 'utf8', timeout: opts.timeoutMs ?? 30000 });
      if (r.error) {
        lastError = `${bin}: ${(r.error as Error).message}`;
        continue;
      }
      if (r.status !== 0) {
        lastError = `${bin}: exit ${r.status} ${(r.stderr ?? '').slice(0, 200)}`;
        continue;
      }
      const m = /<script[^>]*id="typodeck-overflow"[^>]*>([\s\S]*?)<\/script>/.exec(r.stdout ?? '');
      if (!m) {
        lastError = `${bin}: probe produced no #typodeck-overflow payload`;
        continue;
      }
      const parsed = JSON.parse(m[1]) as RenderedBlockMeasurement[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        lastError = `${bin}: probe measured 0 blocks`;
        continue;
      }
      return parsed;
    }
    throw new Error(`headless Chrome measurement failed (${lastError ?? 'no Chrome binary tried'})`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Convenience: render one slide's measure HTML and measure it in headless
 * Chrome. Throws when Chrome is unavailable (caller reports unmeasured).
 */
export function measureSlideRender(
  slide: Slide, system: string, opts: ChromeMeasureOptions & MeasureHtmlOptions = {},
): RenderedBlockMeasurement[] {
  return measureHtmlWithChrome(renderMeasureHtml(slide, system, opts), opts);
}
