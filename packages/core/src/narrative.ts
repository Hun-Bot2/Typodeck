// Typodeck Narrative Intelligence — arc-ordered narrative planning + deck pipeline.
// planNarrative: claims -> 5-12 slide outline with one thesis per slide, ordered
// along an audience-aware argument arc (problem -> solution -> … -> next).
// planDeck / planDecksAll: ingestion -> evidence -> narrative -> layout -> validate.

import type { Claim, ClaimKind, ClaimRef } from './evidence';
import { extractClaims, MAX_CLAIM_CHARS } from './evidence';
import { acceptIdea, fetchRepo, type FetchRepoOptions, type Ingested, type IngestRequestStats } from './ingestion';
import { layoutDeck } from './layout';
import { resolveProvider, type ModelProvider } from './provider';
import { evaluateNarrative, type QualityReport } from './quality';
import {
  analyzeClaim,
  ARC,
  claimSimilarity,
  DIM_LABEL,
  displayStatus,
  EXTENDED_DIMENSIONS,
  isChangelogClaim,
  SIM_REDUNDANT,
  SIM_REPEATED_THESIS,
  type Audience,
  type ClaimAnalysis,
  type ClaimStatus,
  type Dimension,
} from './semantics';
import {
  kickerCase,
  legacyKicker,
  presetKicker,
  resolvePurpose,
  stepKicker,
  variantForDuration,
  type PresetStep,
  type PresetVariant,
  type PurposePreset,
} from './purposes';
import {
  validateDeck,
  type Deck,
  type Narrative,
  type NarrativeBlock,
  type NarrativeSlide,
} from './schema';
import { SYSTEM_IDS, type SystemId } from './systems';

export const MIN_SLIDES = 5;
export const MAX_SLIDES = 12;
const MAX_NUMBER_SLIDES = 2;

export interface PlanNarrativeOptions {
  purpose?: string;
  lang?: string;
  /** Purpose preset id (P01–P10). Also accepted inline as "P04" / "P04: Title" via purpose. */
  preset?: string;
  /** Presentation variant; derived from durationMin when omitted. */
  variant?: PresetVariant;
  /** User presentation length in minutes; selects short/standard/extended. */
  durationMin?: number;
  /** Emphasized dimensions: pinned into short variants, prioritized in picks. */
  emphasis?: Dimension[];
}

type Lang = 'ko' | 'en';

function normalizeLang(lang: string | undefined): Lang {
  return lang?.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

const LABELS: Record<Lang, Record<string, string>> = {
  en: {
    numbersKicker: 'BY THE NUMBERS',
    proposalKicker: 'PROPOSAL',
    closingKicker: 'CLOSING',
    closingTitle: 'The thesis, restated',
    proposalTitleA: 'Where this could go next',
    proposalBodyA:
      'Turn the strongest claims into a roadmap: confirm each number against its source, then decide what ships first.',
    proposalTitleB: 'Open questions',
    proposalBodyB:
      'Which claims need stronger evidence before they can be stated as fact? List them here and verify each one.',
    proposalCaption: 'proposal · unverified — a suggested direction, not a sourced fact',
    closingBody: 'One thesis per slide; every number traceable to its source.',
  },
  ko: {
    numbersKicker: '핵심 숫자',
    proposalKicker: '제안',
    closingKicker: '마무리',
    closingTitle: '핵심 메시지, 다시 한 번',
    proposalTitleA: '다음 단계 제안',
    proposalBodyA: '가장 강한 주장들을 로드맵으로: 각 숫자를 출처에서 확인한 뒤 무엇을 먼저 할지 정합니다.',
    proposalTitleB: '열린 질문들',
    proposalBodyB: '사실로 말하기 전에 어떤 주장이 더 강한 근거를 필요로 하는지 목록으로 정리하고 하나씩 검증합니다.',
    proposalCaption: 'proposal · unverified — 제안일 뿐, 출처가 있는 사실이 아님',
    closingBody: '슬라이드마다 하나의 테제; 모든 숫자는 출처까지 추적 가능.',
  },
};

export function formatRef(ref: ClaimRef): string {
  if (!ref.lines) return ref.path;
  const [a, b] = ref.lines;
  return a === b ? `${ref.path}:${a}` : `${ref.path}:${a}–${b}`;
}

function formatRefs(refs: ClaimRef[]): string {
  return refs.map(formatRef).join('; ');
}

/**
 * Compact traceability caption: status tags + refs (`verified · src/pack.js:2`).
 * Tags stay in English in both languages so they remain machine-parseable;
 * the caption role renders them small and muted, off the main reading path.
 */
export function captionFor(claim: Claim, lang: Lang): string {
  void lang;
  const tags: string[] = [claim.kind === 'verified' ? 'verified' : 'unverified'];
  if (claim.kind === 'ungrounded') tags.push('illustrative');
  const status = displayStatus(claim);
  if (status === 'proposed' || status === 'historical' || status === 'deprecated') {
    tags.push(status);
  }
  const refs = claim.refs.length > 0 ? formatRefs(claim.refs) : '';
  return refs === '' ? tags.join(' · ') : `${tags.join(' · ')} · ${refs}`;
}

function shorten(text: string, max: number): string {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  if (oneLine.length <= max) return oneLine;
  const cut = oneLine.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${cut.slice(0, space > max * 0.5 ? space : max).trimEnd()}…`;
}

function block(role: NarrativeBlock['role'], content: string): NarrativeBlock {
  return { role, content };
}

function dimKicker(dim: Dimension, lang: Lang): string {
  return kickerCase(DIM_LABEL[lang][dim], lang);
}

const KIND_RANK: Record<ClaimKind, number> = { verified: 0, suggestion: 1, ungrounded: 2 };
const STATUS_RANK: Record<ClaimStatus, number> = {
  implemented: 0, unverified: 1, proposed: 2, historical: 3, deprecated: 4,
};

interface Picked {
  claim: Claim;
  index: number;
  analysis: ClaimAnalysis;
}

function cmpRank(a: number[], b: number[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

/** Lower is better: evidence, maturity, substance, metric strength, stability. */
function thesisRank(p: Picked): number[] {
  return [
    KIND_RANK[p.claim.kind],
    STATUS_RANK[p.analysis.status],
    isChangelogClaim(p.claim) ? 1 : 0,
    p.analysis.thin ? 1 : 0,
    p.analysis.contextless ? 1 : 0,
    p.analysis.pointer ? 1 : 0,
    p.analysis.codeFragment ? 1 : 0,
    -p.analysis.heroScore,
    p.index,
  ];
}

function similarToAny(text: string, others: string[], threshold: number): boolean {
  return others.some((o) => claimSimilarity(text, o) >= threshold);
}

function claimSlide(
  id: string,
  kicker: string,
  claim: Claim,
  lang: Lang,
  support?: Claim,
): NarrativeSlide {
  const title = shorten(claim.text, 72);
  const blocks: NarrativeBlock[] = [block('kicker', kicker), block('title', title)];
  if (support) {
    blocks.push(block('body', support.text));
  } else if (claim.text.length > title.length + 20) {
    blocks.push(block('body', claim.text));
  }
  blocks.push(block('caption', captionFor(claim, lang)));
  return { id, thesis: title, blocks };
}

function numberSlide(
  id: string,
  claim: Claim,
  hero: string,
  lang: Lang,
  kicker: string,
): NarrativeSlide {
  const title = shorten(claim.text, 72);
  const blocks: NarrativeBlock[] = [
    block('kicker', kicker),
    block('number', hero),
    block('title', title),
  ];
  if (claim.text.length > title.length + 20) {
    blocks.push(block('body', claim.text));
  }
  blocks.push(block('caption', captionFor(claim, lang)));
  return { id, thesis: `${hero} — ${title}`, blocks };
}

/**
 * Plan a 5–12 slide narrative from atomic claims. Deterministic.
 * - One thesis per slide along the audience arc; deprecated claims never headline.
 * - Number slides only from claims with refs and a validated hero metric.
 * - Redundant and cover-echoing claims are skipped, never repeated.
 * - Cover/closing quote sourced claims but carry no caption machinery.
 */
export function planNarrativeWithQuality(
  claims: Claim[],
  opts: PlanNarrativeOptions = {},
): { narrative: Narrative; quality: QualityReport } {
  const resolved = resolvePurpose({ purpose: opts.purpose, preset: opts.preset });
  if (resolved.kind === 'preset') {
    return planPresetNarrative(claims, resolved.preset, resolved.title, opts);
  }
  return planLegacyNarrative(claims, resolved.audience, resolved.title, opts.lang);
}

/**
 * Frozen legacy planner: pre-preset behavior, bit-identical outputs
 * (see fixtures/legacy-narrative-baselines.json). Do not change the
 * planning logic here; extend the preset path instead.
 */
function planLegacyNarrative(
  claims: Claim[],
  audience: Audience,
  customTitle: string | undefined,
  langOpt: string | undefined,
): { narrative: Narrative; quality: QualityReport } {
  const lang = normalizeLang(langOpt);
  const L = LABELS[lang];
  const arc = ARC[audience];
  const arcIndex = new Map<Dimension, number>(arc.map((d, i) => [d, i]));

  const analyzed: Picked[] = claims.map((claim, index) => ({
    claim, index, analysis: analyzeClaim(claim),
  }));
  // Deprecated claims stay in the evidence set but never headline the story.
  const pool = analyzed.filter((p) => p.analysis.status !== 'deprecated');

  const slides: NarrativeSlide[] = [];
  let seq = 0;
  const nextId = (stem: string): string => {
    seq += 1;
    return `n${seq}-${stem}`;
  };
  const used = new Set<string>();
  const usedTexts: string[] = [];
  const use = (p: Picked): void => {
    used.add(p.claim.id);
    usedTexts.push(p.claim.text);
  };

  // 1. Number slides: validated heroes only, distinct metrics preferred.
  // Code fragments may headline only with a unit hero ("40ms" benchmarks
  // count; bare counts from API examples do not).
  const numeric = pool
    .filter(
      (p) =>
        p.analysis.hero !== null &&
        p.claim.refs.length > 0 &&
        (!p.analysis.codeFragment || p.analysis.heroScore >= 2),
    )
    .sort((a, b) =>
      cmpRank(
        [-a.analysis.heroScore, arcIndex.get(a.analysis.dim) ?? 9, KIND_RANK[a.claim.kind], a.index],
        [-b.analysis.heroScore, arcIndex.get(b.analysis.dim) ?? 9, KIND_RANK[b.claim.kind], b.index],
      ),
    );
  const numberPicks: Picked[] = [];
  const numberTexts: string[] = [];
  for (const p of numeric) {
    if (numberPicks.length >= MAX_NUMBER_SLIDES) break;
    const hero = p.analysis.hero as string;
    if (numberPicks.some((q) => q.analysis.hero === hero)) continue;
    if (similarToAny(p.claim.text, numberTexts, SIM_REDUNDANT)) continue;
    if (
      numberPicks.length > 0 &&
      numberPicks.some((q) => q.analysis.dim === p.analysis.dim) &&
      numeric.some(
        (r) =>
          !used.has(r.claim.id) &&
          !numberPicks.includes(r) &&
          r.analysis.hero !== hero &&
          r.analysis.dim !== p.analysis.dim &&
          !similarToAny(r.claim.text, numberTexts, SIM_REDUNDANT),
      )
    ) {
      continue; // a distinct dimension is still available; wait for it
    }
    numberPicks.push(p);
    numberTexts.push(p.claim.text);
    use(p);
  }
  // 2. Cover: custom title or the strongest problem/solution claim; body hooks.
  // (Picks run numbers-first so the used set is settled before theses are
  // chosen; the cover slide itself is emitted first to keep ids in order.)
  const coverRank = (p: Picked): number[] => {
    const dimPref = p.analysis.dim === 'problem' ? 0 : p.analysis.dim === 'solution' ? 1 : 2;
    return [
      dimPref, KIND_RANK[p.claim.kind], p.analysis.thin ? 1 : 0,
      p.analysis.contextless || p.analysis.pointer || p.analysis.codeFragment ? 1 : 0,
      isChangelogClaim(p.claim) ? 1 : 0, p.index,
    ];
  };
  const titleClaim = customTitle
    ? undefined
    : [...pool].sort((a, b) => cmpRank(coverRank(a), coverRank(b)))[0];
  const title = customTitle ?? (titleClaim ? shorten(titleClaim.claim.text, 64) : 'Untitled Deck');
  const bodyClaim = [...pool]
    .filter((p) => p !== titleClaim)
    .sort((a, b) => cmpRank(coverRank(a), coverRank(b)))[0];
  // Cover quotes never consume claims, but theses must add new information.
  const coverEcho: string[] = [];
  const coverBlocks: NarrativeBlock[] = [
    block('kicker', legacyKicker(audience, lang, customTitle)),
    block('title', shorten(title, 72)),
  ];
  if (titleClaim) coverEcho.push(titleClaim.claim.text);
  if (bodyClaim) {
    coverBlocks.push(block('body', bodyClaim.claim.text));
    coverEcho.push(bodyClaim.claim.text);
  }
  slides.push({ id: nextId('cover'), thesis: title, blocks: coverBlocks });
  for (const p of numberPicks) {
    slides.push(numberSlide(nextId('number'), p.claim, p.analysis.hero as string, lang, L.numbersKicker));
  }

  // 3. Thesis slides in arc order: best claim per dimension, deduped.
  // Substance first: when distinct claims remain, encore passes add a second
  // thesis per dimension (stem "point": an elaboration, not an arc step)
  // before the planner ever resorts to proposal filler.
  const THESIS_TARGET = 10;
  const addThesisPass = (encore: boolean): number => {
    let added = 0;
    for (const dim of arc) {
      if (slides.length + 1 >= MAX_SLIDES) break; // reserve the closing slot
      const candidates = pool
        .filter((p) => !used.has(p.claim.id) && p.analysis.dim === dim)
        .sort((a, b) => cmpRank(thesisRank(a), thesisRank(b)));
      const pick = candidates.find(
        (p) =>
          !similarToAny(p.claim.text, usedTexts, SIM_REDUNDANT) &&
          !similarToAny(p.claim.text, coverEcho, SIM_REPEATED_THESIS),
      );
      if (!pick) continue;
      use(pick);
      const support = pool
        .filter(
          (p) =>
            !used.has(p.claim.id) &&
            p.analysis.dim === dim &&
            claimSimilarity(p.claim.text, pick.claim.text) < SIM_REDUNDANT &&
            !similarToAny(p.claim.text, usedTexts, SIM_REDUNDANT),
        )
        .sort((a, b) => cmpRank(thesisRank(a), thesisRank(b)))[0];
      if (support) use(support);
      slides.push(
        claimSlide(nextId(encore ? 'point' : dim), dimKicker(dim, lang), pick.claim, lang, support?.claim),
      );
      added += 1;
    }
    return added;
  };
  addThesisPass(false);
  while (slides.length + 1 < THESIS_TARGET && addThesisPass(true) > 0) {
    // Encore passes run until the deck has substance or the pool is spent.
  }

  // 4. Pad with labeled proposal slides when short of the minimum.
  const proposals: Array<[string, string]> = [
    [L.proposalTitleA, L.proposalBodyA],
    [L.proposalTitleB, L.proposalBodyB],
  ];
  let pi = 0;
  while (slides.length + 1 < MIN_SLIDES) {
    const [ptitle, pbody] = proposals[pi % proposals.length];
    pi += 1;
    slides.push({
      id: nextId('proposal'),
      thesis: ptitle,
      blocks: [
        block('kicker', L.proposalKicker),
        block('title', ptitle),
        block('body', pbody),
        block('caption', L.proposalCaption),
      ],
    });
  }

  // 5. Closing: restate the strongest solution/result, then point forward.
  const restateRank = (p: Picked): number[] => {
    const dimPref =
      p.analysis.dim === 'solution' ? 0 : p.analysis.dim === 'results' ? 1 : p.analysis.dim === 'capabilities' ? 2 : 3;
    return [
      dimPref, KIND_RANK[p.claim.kind], STATUS_RANK[p.analysis.status],
      isChangelogClaim(p.claim) ? 1 : 0,
      p.analysis.thin || p.analysis.codeFragment ? 1 : 0, p.index,
    ];
  };
  const restate = [...pool].sort((a, b) => cmpRank(restateRank(a), restateRank(b)))[0];
  const forward =
    pool
      .filter((p) => p !== restate && p.analysis.dim === 'future' && !p.analysis.thin)
      .sort((a, b) => cmpRank(thesisRank(a), thesisRank(b)))[0] ??
    [...pool].filter((p) => p !== restate).sort((a, b) => cmpRank(restateRank(a), restateRank(b)))[0];
  let closingBody = L.closingBody;
  if (restate) {
    closingBody = restate.claim.text;
    if (forward && `${closingBody} ${forward.claim.text}`.length <= 420) {
      closingBody = `${closingBody} ${forward.claim.text}`;
    }
  }
  slides.push({
    id: nextId('closing'),
    thesis: L.closingTitle,
    blocks: [block('kicker', L.closingKicker), block('title', L.closingTitle), block('body', closingBody)],
  });

  const narrative: Narrative = { title, lang, slides: slides.slice(0, MAX_SLIDES) };
  const quality = evaluateNarrative(narrative, claims, { audience });
  return { narrative, quality };
}

/**
 * Preset planner: purpose-aware narrative over the 16-dimension extended
 * set. Steps with no qualifying claim are OMITTED (never invented filler);
 * integrity filters demote or drop weak claims per preset rules.
 */
function planPresetNarrative(
  claims: Claim[],
  preset: PurposePreset,
  customTitle: string | undefined,
  opts: PlanNarrativeOptions,
): { narrative: Narrative; quality: QualityReport } {
  const lang = normalizeLang(opts.lang);
  const L = LABELS[lang];
  const variant = variantForDuration(opts.durationMin, opts.variant);
  const cfg = preset.variants[variant];
  const repoMode = claims.some((c) => c.kind !== 'ungrounded');
  const emphasis = new Set(
    (opts.emphasis ?? []).filter((d): d is Dimension => (EXTENDED_DIMENSIONS as readonly string[]).includes(d)),
  );

  // Short variant: required steps first, emphasized optionals next, arc order kept.
  const stepOrder = new Map(preset.steps.map((s, i) => [s.id, i]));
  const orderedSteps = cfg.requiredOnly
    ? [...preset.steps]
        .sort((a, b) =>
          cmpRank(
            [(a.optional ? 1 : 0) - (emphasis.has(a.dim) ? 0.5 : 0), stepOrder.get(a.id) as number],
            [(b.optional ? 1 : 0) - (emphasis.has(b.dim) ? 0.5 : 0), stepOrder.get(b.id) as number],
          ),
        )
        .slice(0, Math.max(0, cfg.maxSlides - 2))
        .sort((a, b) => (stepOrder.get(a.id) as number) - (stepOrder.get(b.id) as number))
    : preset.steps;
  const dimFirstStep = new Map<Dimension, number>();
  for (const s of orderedSteps) {
    if (!dimFirstStep.has(s.dim)) dimFirstStep.set(s.dim, stepOrder.get(s.id) as number);
  }

  const analyzed: Picked[] = claims.map((claim, index) => ({
    claim, index, analysis: analyzeClaim(claim, EXTENDED_DIMENSIONS),
  }));
  const pool = analyzed.filter((p) => p.analysis.status !== 'deprecated');

  // Integrity gate for a claim headlining a step (or number slide when step is undefined).
  const allowed = (p: Picked, step?: PresetStep): boolean => {
    if (step?.allowStatuses && !step.allowStatuses.includes(p.analysis.status)) return false;
    if (
      repoMode &&
      preset.integrity.groundedOnlyDims?.includes(p.analysis.dim) &&
      p.claim.kind === 'ungrounded'
    ) {
      return false;
    }
    return true;
  };
  // Emphasis pins optionals and wins claim-pick ties within a dimension.
  const thesisRankPreset = (p: Picked): number[] => [
    emphasis.has(p.analysis.dim) ? 0 : 1,
    ...thesisRank(p),
  ];

  const slides: NarrativeSlide[] = [];
  let seq = 0;
  const nextId = (stem: string): string => {
    seq += 1;
    return `n${seq}-${stem}`;
  };
  const used = new Set<string>();
  const usedTexts: string[] = [];
  const use = (p: Picked): void => {
    used.add(p.claim.id);
    usedTexts.push(p.claim.text);
  };

  // 1. Number slides: validated heroes only + preset kind filter.
  const numberKinds = preset.integrity.numberKinds;
  const numeric = pool
    .filter(
      (p) =>
        p.analysis.hero !== null &&
        p.claim.refs.length > 0 &&
        (!p.analysis.codeFragment || p.analysis.heroScore >= 2) &&
        (!numberKinds || numberKinds.includes(p.claim.kind)) &&
        allowed(p),
    )
    .sort((a, b) =>
      cmpRank(
        [-a.analysis.heroScore, dimFirstStep.get(a.analysis.dim) ?? orderedSteps.length, KIND_RANK[a.claim.kind], a.index],
        [-b.analysis.heroScore, dimFirstStep.get(b.analysis.dim) ?? orderedSteps.length, KIND_RANK[b.claim.kind], b.index],
      ),
    );
  const numberPicks: Picked[] = [];
  const numberTexts: string[] = [];
  for (const p of numeric) {
    if (numberPicks.length >= MAX_NUMBER_SLIDES) break;
    const hero = p.analysis.hero as string;
    if (numberPicks.some((q) => q.analysis.hero === hero)) continue;
    if (similarToAny(p.claim.text, numberTexts, SIM_REDUNDANT)) continue;
    if (
      numberPicks.length > 0 &&
      numberPicks.some((q) => q.analysis.dim === p.analysis.dim) &&
      numeric.some(
        (r) =>
          !used.has(r.claim.id) &&
          !numberPicks.includes(r) &&
          r.analysis.hero !== hero &&
          r.analysis.dim !== p.analysis.dim &&
          !similarToAny(r.claim.text, numberTexts, SIM_REDUNDANT),
      )
    ) {
      continue;
    }
    numberPicks.push(p);
    numberTexts.push(p.claim.text);
    use(p);
  }

  // 2. Cover: preset kicker + custom title or strongest cover-dim claim.
  const coverRank = (p: Picked): number[] => {
    const di = preset.coverDims.indexOf(p.analysis.dim);
    return [
      di === -1 ? preset.coverDims.length : di,
      KIND_RANK[p.claim.kind], p.analysis.thin ? 1 : 0,
      p.analysis.contextless || p.analysis.pointer || p.analysis.codeFragment ? 1 : 0,
      isChangelogClaim(p.claim) ? 1 : 0, p.index,
    ];
  };
  const titleClaim = customTitle
    ? undefined
    : [...pool].sort((a, b) => cmpRank(coverRank(a), coverRank(b)))[0];
  const title = customTitle ?? (titleClaim ? shorten(titleClaim.claim.text, 64) : 'Untitled Deck');
  const bodyClaim = [...pool]
    .filter((p) => p !== titleClaim)
    .sort((a, b) => cmpRank(coverRank(a), coverRank(b)))[0];
  const coverEcho: string[] = [];
  const coverBlocks: NarrativeBlock[] = [
    block('kicker', presetKicker(preset, lang)),
    block('title', shorten(title, 72)),
  ];
  if (titleClaim) coverEcho.push(titleClaim.claim.text);
  if (bodyClaim) {
    coverBlocks.push(block('body', bodyClaim.claim.text));
    coverEcho.push(bodyClaim.claim.text);
  }
  slides.push({ id: nextId('cover'), thesis: title, blocks: coverBlocks });
  for (const p of numberPicks) {
    slides.push(numberSlide(nextId('number'), p.claim, p.analysis.hero as string, lang, L.numbersKicker));
  }

  // 3. Thesis slides in preset step order; missing evidence omits the step.
  const THESIS_TARGET = 10;
  const addThesisPass = (encore: boolean): number => {
    let added = 0;
    for (const st of orderedSteps) {
      if (slides.length + 1 >= cfg.maxSlides) break;
      const candidates = pool
        .filter((p) => !used.has(p.claim.id) && p.analysis.dim === st.dim && allowed(p, st))
        .sort((a, b) => cmpRank(thesisRankPreset(a), thesisRankPreset(b)));
      const pick = candidates.find(
        (p) =>
          !similarToAny(p.claim.text, usedTexts, SIM_REDUNDANT) &&
          !similarToAny(p.claim.text, coverEcho, SIM_REPEATED_THESIS),
      );
      if (!pick) continue;
      use(pick);
      const support = pool
        .filter(
          (p) =>
            !used.has(p.claim.id) &&
            p.analysis.dim === st.dim &&
            allowed(p, st) &&
            claimSimilarity(p.claim.text, pick.claim.text) < SIM_REDUNDANT &&
            !similarToAny(p.claim.text, usedTexts, SIM_REDUNDANT),
        )
        .sort((a, b) => cmpRank(thesisRankPreset(a), thesisRankPreset(b)))[0];
      if (support) use(support);
      slides.push(
        claimSlide(nextId(encore ? 'point' : st.dim), stepKicker(preset, st.id, lang), pick.claim, lang, support?.claim),
      );
      added += 1;
    }
    return added;
  };
  addThesisPass(false);
  if (cfg.encore) {
    while (slides.length + 1 < Math.min(THESIS_TARGET, cfg.maxSlides) && addThesisPass(true) > 0) {
      // Encore passes run until the deck has substance or the pool is spent.
    }
  }

  // 4. No proposal filler on the preset path: thin evidence yields a short
  // honest deck, never invented slides.

  // 5. Closing: restate by preset priority, then point forward.
  const restateRank = (p: Picked): number[] => {
    const di = preset.closeDims.indexOf(p.analysis.dim);
    return [
      di === -1 ? preset.closeDims.length : di,
      KIND_RANK[p.claim.kind], STATUS_RANK[p.analysis.status],
      isChangelogClaim(p.claim) ? 1 : 0,
      p.analysis.thin || p.analysis.codeFragment ? 1 : 0, p.index,
    ];
  };
  const restateRankPreset = (p: Picked): number[] => [
    emphasis.has(p.analysis.dim) ? 0 : 1,
    ...restateRank(p),
  ];
  const restate = [...pool].sort((a, b) => cmpRank(restateRankPreset(a), restateRankPreset(b)))[0];
  const forward =
    pool
      .filter((p) => p !== restate && p.analysis.dim === 'future' && !p.analysis.thin)
      .sort((a, b) => cmpRank(thesisRankPreset(a), thesisRankPreset(b)))[0] ??
    [...pool].filter((p) => p !== restate).sort((a, b) => cmpRank(restateRankPreset(a), restateRankPreset(b)))[0];
  let closingBody = L.closingBody;
  if (restate) {
    closingBody = restate.claim.text;
    if (forward && `${closingBody} ${forward.claim.text}`.length <= 420) {
      closingBody = `${closingBody} ${forward.claim.text}`;
    }
  }
  slides.push({
    id: nextId('closing'),
    thesis: L.closingTitle,
    blocks: [block('kicker', L.closingKicker), block('title', L.closingTitle), block('body', closingBody)],
  });

  const narrative: Narrative = { title, lang, slides: slides.slice(0, cfg.maxSlides) };
  const quality = evaluateNarrative(narrative, claims, { arc: orderedSteps.map((s) => s.dim) });
  return { narrative, quality };
}

/** Plan a narrative; see planNarrativeWithQuality for the quality report. */
export function planNarrative(claims: Claim[], opts: PlanNarrativeOptions = {}): Narrative {
  return planNarrativeWithQuality(claims, opts).narrative;
}

/**
 * User evidence review, applied between extraction and planning. Claim ids
 * are deterministic per ingest, so a review from /api/evidence lines up
 * with the generate call that follows it — unless the repo moved, in
 * which case the sha guard resets the selection honestly.
 */
export interface EvidenceSelection {
  /** Ingested sha at review time (repo mode). Mismatch resets the review. */
  sha?: string | null;
  /** Claim ids to drop before planning. */
  excluded?: string[];
  /** Claim reframes: text is replaced, refs still point at the source. */
  reframed?: Array<{ id: string; text: string }>;
}

const REFRAME_MIN_CHARS = 10;

/**
 * Apply an evidence review to extracted claims. Pure: the input array is
 * never mutated. Reframed numbers keep only tokens still verbatim in the
 * new text (same guard as rephraseClaims); refs always stay attached to
 * the original source lines.
 */
export function applyEvidenceSelection(
  claims: Claim[],
  selection: EvidenceSelection,
  currentSha?: string | null,
): { claims: Claim[]; warnings: string[] } {
  const warnings: string[] = [];
  if (selection.sha !== undefined && selection.sha !== (currentSha ?? null)) {
    warnings.push('repository changed since evidence review; selection was reset');
    return { claims, warnings };
  }
  const byId = new Map(claims.map((c) => [c.id, c]));
  const excluded = new Set(selection.excluded ?? []);
  let unknown = 0;
  for (const id of excluded) {
    if (!byId.has(id)) unknown += 1;
  }
  let kept = claims.filter((c) => !excluded.has(c.id));
  const dropped = claims.length - kept.length;
  if (dropped > 0) {
    warnings.push(`${dropped} claim(s) excluded during evidence review`);
  }
  const reframes = selection.reframed ?? [];
  let reframed = 0;
  kept = kept.map((claim) => {
    const edit = reframes.find((r) => r.id === claim.id);
    if (!edit) return claim;
    const text = edit.text.replace(/\s+/g, ' ').trim();
    if (text.length < REFRAME_MIN_CHARS || text.length > MAX_CLAIM_CHARS) {
      warnings.push(
        `reframe for ${claim.id} ignored (must be ${REFRAME_MIN_CHARS}–${MAX_CLAIM_CHARS} chars)`,
      );
      return claim;
    }
    reframed += 1;
    return { ...claim, text, numbers: claim.numbers.filter((n) => text.includes(n)) };
  });
  for (const r of reframes) {
    if (!byId.has(r.id)) unknown += 1;
  }
  if (reframed > 0) {
    warnings.push(`${reframed} claim(s) reframed by user; refs still point at the original source lines`);
  }
  if (unknown > 0) {
    warnings.push(`${unknown} reviewed claim(s) no longer exist; ignored`);
  }
  return { claims: kept, warnings };
}

// ---------------------------------------------------------------------------
// End-to-end pipeline
// ---------------------------------------------------------------------------

export type PlanDeckInput =
  | { type: 'repo'; owner: string; repo: string }
  | { type: 'idea'; text: string };

export interface PlanDeckOptions extends FetchRepoOptions {
  system: SystemId;
  purpose?: string;
  lang?: string;
  provider?: ModelProvider;
  seed?: number;
  preset?: string;
  variant?: PresetVariant;
  durationMin?: number;
  emphasis?: Dimension[];
  /** Evidence review from the inspector; applied between extraction and planning. */
  selection?: EvidenceSelection;
}

export interface ClaimCounts {
  total: number;
  verified: number;
  suggestion: number;
  ungrounded: number;
}

export interface NarrativeQualitySummary {
  pass: boolean;
  overall: number;
  errors: number;
  warnings: number;
}

export interface PlanDeckResult {
  deck: Deck;
  narrative: Narrative;
  claims: Claim[];
  ingested: Ingested;
  provenance: {
    provider: string;
    generatedBy: string;
    claims: ClaimCounts;
    warnings: string[];
    quality: NarrativeQualitySummary;
    /** Request budget consumed (repo mode only). */
    requests?: IngestRequestStats;
  };
}

/** Pipeline stages reported to an optional progress callback (Phase 3 SSE). */
export type PipelineStage = 'ingest' | 'evidence' | 'narrative' | 'layout';
export type StageCallback = (stage: PipelineStage, detail?: string) => void;

interface NarrativeRun {
  ingested: Ingested;
  claims: Claim[];
  narrative: Narrative;
  counts: ClaimCounts;
  warnings: string[];
  quality: QualityReport;
}

/** Shared ingestion -> evidence -> narrative run for planDeck/planDecksAll. */
async function runToNarrative(
  input: PlanDeckInput,
  opts: { purpose?: string; lang?: string; preset?: string; variant?: PresetVariant; durationMin?: number; emphasis?: Dimension[]; selection?: EvidenceSelection } & FetchRepoOptions,
  onStage?: StageCallback,
): Promise<NarrativeRun> {
  const warnings: string[] = [];

  onStage?.('ingest');
  const ingested: Ingested =
    input.type === 'repo' ? await fetchRepo(input.owner, input.repo, opts) : acceptIdea(input.text);
  warnings.push(...ingested.warnings);

  onStage?.('evidence');
  let claims = extractClaims(ingested);
  if (opts.selection) {
    const currentSha = ingested.kind === 'repo' ? ingested.sha : null;
    const reviewed = applyEvidenceSelection(claims, opts.selection, currentSha);
    claims = reviewed.claims;
    warnings.push(...reviewed.warnings);
  }
  if (claims.length === 0) {
    warnings.push('no claims extracted; deck is cover + proposal slides only');
  }

  onStage?.('narrative');
  const { narrative, quality } = planNarrativeWithQuality(claims, {
    purpose: opts.purpose,
    lang: opts.lang,
    preset: opts.preset,
    variant: opts.variant,
    durationMin: opts.durationMin,
    emphasis: opts.emphasis,
  });
  const counts: ClaimCounts = {
    total: claims.length,
    verified: claims.filter((c) => c.kind === 'verified').length,
    suggestion: claims.filter((c) => c.kind === 'suggestion').length,
    ungrounded: claims.filter((c) => c.kind === 'ungrounded').length,
  };
  if (counts.ungrounded > 0 && ingested.kind === 'repo') {
    warnings.push(`${counts.ungrounded} claim(s) are ungrounded and labeled in captions`);
  }
  if (ingested.kind === 'idea') {
    warnings.push('idea mode: all claims ungrounded; number slides labeled unverified/illustrative');
  }
  const shown = quality.issues.slice(0, 8);
  for (const issue of shown) {
    warnings.push(
      `quality ${issue.severity} [${issue.code}]${issue.slide ? ` on ${issue.slide}` : ''}: ${issue.detail}`,
    );
  }
  if (quality.issues.length > shown.length) {
    warnings.push(`quality: …and ${quality.issues.length - shown.length} more note(s)`);
  }

  return { ingested, claims, narrative, counts, warnings, quality };
}

function labelDeck(
  narrative: Narrative,
  system: SystemId,
  seed: number | undefined,
  provider: ModelProvider,
  ingested?: Ingested,
): Deck {
  const deck = layoutDeck(narrative, system, seed === undefined ? {} : { seed });
  // Label the producing provider on the deck itself.
  deck.meta.generatedBy = provider.id === 'fallback' ? 'fallback' : `typodeck:${provider.id}`;
  if (ingested?.kind === 'repo') {
    deck.meta.provenance = { repo: `${ingested.owner}/${ingested.repo}`, branch: ingested.branch, sha: ingested.sha };
  }
  validateDeck(deck);
  return deck;
}

function summarizeQuality(quality: QualityReport): NarrativeQualitySummary {
  return {
    pass: quality.pass,
    overall: quality.scores.overall,
    errors: quality.issues.filter((i) => i.severity === 'error').length,
    warnings: quality.issues.filter((i) => i.severity === 'warning').length,
  };
}

/**
 * End-to-end: ingestion -> evidence -> narrative -> layoutDeck -> validateDeck.
 * Provider defaults to resolveProvider() (fallback unless Muse env is set).
 * Fallback-built decks are labeled generatedBy=fallback.
 */
export async function planDeck(
  input: PlanDeckInput,
  opts: PlanDeckOptions,
  onStage?: StageCallback,
): Promise<PlanDeckResult> {
  const provider = opts.provider ?? resolveProvider(process.env, opts.fetchImpl);
  const run = await runToNarrative(input, opts, onStage);

  onStage?.('layout', opts.system);
  const deck = labelDeck(run.narrative, opts.system, opts.seed, provider, run.ingested);
  if (provider.id === 'fallback') {
    run.warnings.push('built with the deterministic fallback (not model inference)');
  }

  return {
    deck,
    narrative: run.narrative,
    claims: run.claims,
    ingested: run.ingested,
    provenance: {
      provider: provider.id,
      generatedBy: deck.meta.generatedBy,
      claims: run.counts,
      warnings: run.warnings,
      quality: summarizeQuality(run.quality),
      ...(run.ingested.kind === 'repo' && run.ingested.requests ? { requests: run.ingested.requests } : {}),
    },
  };
}

export interface PlanDecksAllOptions extends FetchRepoOptions {
  purpose?: string;
  lang?: string;
  provider?: ModelProvider;
  seed?: number;
  preset?: string;
  variant?: PresetVariant;
  durationMin?: number;
  emphasis?: Dimension[];
  /** Evidence review from the inspector; applied between extraction and planning. */
  selection?: EvidenceSelection;
}

export interface PlanDecksAllResult {
  narrative: Narrative;
  claims: Claim[];
  ingested: Ingested;
  decks: Record<SystemId, Deck>;
  provenance: {
    provider: string;
    generatedBy: string;
    claims: ClaimCounts;
    warnings: string[];
    quality: NarrativeQualitySummary;
    /** Request budget consumed (repo mode only). */
    requests?: IngestRequestStats;
  };
}

/**
 * End-to-end like planDeck, but lays out ALL registry systems from the SAME
 * planned narrative so the Web Studio can show comparable design previews.
 */
export async function planDecksAll(
  input: PlanDeckInput,
  opts: PlanDecksAllOptions = {},
  onStage?: StageCallback,
): Promise<PlanDecksAllResult> {
  const provider = opts.provider ?? resolveProvider(process.env, opts.fetchImpl);
  const run = await runToNarrative(input, opts, onStage);

  const systems: SystemId[] = [...SYSTEM_IDS];
  const decks = {} as Record<SystemId, Deck>;
  for (const system of systems) {
    onStage?.('layout', system);
    decks[system] = labelDeck(run.narrative, system, opts.seed, provider, run.ingested);
  }
  const generatedBy = provider.id === 'fallback' ? 'fallback' : `typodeck:${provider.id}`;
  if (provider.id === 'fallback') {
    run.warnings.push('built with the deterministic fallback (not model inference)');
  }

  return {
    narrative: run.narrative,
    claims: run.claims,
    ingested: run.ingested,
    decks,
    provenance: {
      provider: provider.id,
      generatedBy,
      claims: run.counts,
      warnings: run.warnings,
      quality: summarizeQuality(run.quality),
      ...(run.ingested.kind === 'repo' && run.ingested.requests ? { requests: run.ingested.requests } : {}),
    },
  };
}
