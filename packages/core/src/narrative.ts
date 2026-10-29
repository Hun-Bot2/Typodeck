// Typodeck Phase 2 — narrative planning + end-to-end deck pipeline.
// planNarrative: claims -> 5-12 slide outline (one thesis per slide).
// planDeck: ingestion -> evidence -> narrative -> layout -> validate.

import type { Claim, ClaimKind, ClaimRef } from './evidence';
import { extractClaims } from './evidence';
import { acceptIdea, fetchRepo, type FetchRepoOptions, type Ingested } from './ingestion';
import { layoutDeck } from './layout';
import { resolveProvider, type ModelProvider } from './provider';
import {
  validateDeck,
  type Deck,
  type Narrative,
  type NarrativeBlock,
  type NarrativeSlide,
} from './schema';
import type { SystemId } from './systems';

export const MIN_SLIDES = 5;
export const MAX_SLIDES = 12;
const MAX_NUMBER_SLIDES = 2;

export interface PlanNarrativeOptions {
  purpose?: string;
  lang?: string;
}

type Lang = 'ko' | 'en';

function normalizeLang(lang: string | undefined): Lang {
  return lang?.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

const LABELS: Record<Lang, Record<string, string>> = {
  en: {
    coverKicker: 'TYPODECK',
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
    unverified: 'unverified',
    illustrative: 'illustrative',
    proposal: 'proposal',
    source: 'Source',
    closingBody: 'One thesis per slide; every number traceable to its source.',
  },
  ko: {
    coverKicker: 'TYPODECK',
    numbersKicker: '핵심 숫자',
    proposalKicker: '제안',
    closingKicker: '마무리',
    closingTitle: '핵심 메시지, 다시 한 번',
    proposalTitleA: '다음 단계 제안',
    proposalBodyA: '가장 강한 주장들을 로드맵으로: 각 숫자를 출처에서 확인한 뒤 무엇을 먼저 할지 정합니다.',
    proposalTitleB: '열린 질문들',
    proposalBodyB: '사실로 말하기 전에 어떤 주장이 더 강한 근거를 필요로 하는지 목록으로 정리하고 하나씩 검증합니다.',
    proposalCaption: 'proposal · unverified — 제안일 뿐, 출처가 있는 사실이 아님',
    unverified: 'unverified',
    illustrative: 'illustrative',
    proposal: 'proposal',
    source: '출처',
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

/** Caption carrying evidence refs + honesty labels for a claim. */
export function captionFor(claim: Claim, lang: Lang): string {
  const L = LABELS[lang];
  const src = claim.refs.length > 0 ? `${L.source}: ${formatRefs(claim.refs)}` : '';
  const tags: string[] = [];
  if (claim.kind === 'suggestion') tags.push(L.unverified);
  if (claim.kind === 'ungrounded') tags.push(L.unverified, L.illustrative);
  const tagStr = tags.join(' · ');
  if (src && tagStr) return `${src} · ${tagStr}`;
  return src || tagStr || L.unverified;
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

function claimSlide(id: string, kicker: string, claim: Claim, lang: Lang): NarrativeSlide {
  const title = shorten(claim.text, 72);
  return {
    id,
    thesis: title,
    blocks: [
      block('kicker', kicker),
      block('title', title),
      block('body', claim.text),
      block('caption', captionFor(claim, lang)),
    ],
  };
}

function numberSlide(id: string, claim: Claim, lang: Lang): NarrativeSlide {
  const L = LABELS[lang];
  const num = claim.numbers[0];
  const title = shorten(claim.text, 72);
  return {
    id,
    thesis: `${num} — ${title}`,
    blocks: [
      block('kicker', L.numbersKicker),
      block('number', num),
      block('title', title),
      block('caption', captionFor(claim, lang)),
    ],
  };
}

const KIND_RANK: Record<ClaimKind, number> = { verified: 0, suggestion: 1, ungrounded: 2 };

/**
 * Plan a 5–12 slide narrative from atomic claims. Deterministic.
 * - One thesis per slide; number slides only from claims with numeric refs.
 * - Ungrounded/proposal material is labeled in captions.
 */
export function planNarrative(claims: Claim[], opts: PlanNarrativeOptions = {}): Narrative {
  const lang = normalizeLang(opts.lang);
  const L = LABELS[lang];
  const purpose = (opts.purpose ?? '').trim();
  const title = purpose || (claims.length > 0 ? shorten(claims[0].text, 64) : 'Untitled Deck');

  const slides: NarrativeSlide[] = [];
  let seq = 0;
  const nextId = (stem: string): string => {
    seq += 1;
    return `n${seq}-${stem}`;
  };

  // 1. Cover.
  const lead = claims[0]?.text ?? purpose;
  slides.push({
    id: nextId('cover'),
    thesis: title,
    blocks: [
      block('kicker', purpose ? purpose.toUpperCase().slice(0, 48) : L.coverKicker),
      block('title', shorten(title, 72)),
      ...(lead ? [block('body' as const, shorten(lead, 220))] : []),
    ],
  });

  // 2. Number slides: only claims with numbers AND refs.
  const numeric = claims.filter((c) => c.numbers.length > 0 && c.refs.length > 0);
  const used = new Set<string>();
  for (const c of numeric.slice(0, MAX_NUMBER_SLIDES)) {
    used.add(c.id);
    slides.push(numberSlide(nextId('number'), c, lang));
  }

  // 3. Claim slides, verified-first (stable), bounded by the slide cap.
  const rest = claims
    .filter((c) => !used.has(c.id))
    .map((c, i) => ({ c, i }))
    .sort((a, b) => KIND_RANK[a.c.kind] - KIND_RANK[b.c.kind] || a.i - b.i)
    .map(({ c }) => c);
  // Reserve one slot for the closing slide.
  for (const c of rest.slice(0, MAX_SLIDES - slides.length - 1)) {
    slides.push(claimSlide(nextId('point'), `${L.coverKicker} · ${String(slides.length + 1).padStart(2, '0')}`, c, lang));
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

  // 5. Closing.
  slides.push({
    id: nextId('closing'),
    thesis: L.closingTitle,
    blocks: [block('kicker', L.closingKicker), block('title', L.closingTitle), block('body', L.closingBody)],
  });

  return { title, lang, slides: slides.slice(0, MAX_SLIDES) };
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
}

export interface ClaimCounts {
  total: number;
  verified: number;
  suggestion: number;
  ungrounded: number;
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
  };
}

/**
 * End-to-end: ingestion -> evidence -> narrative -> layoutDeck -> validateDeck.
 * Provider defaults to resolveProvider() (fallback unless Muse env is set).
 * Fallback-built decks are labeled generatedBy=fallback.
 */
export async function planDeck(input: PlanDeckInput, opts: PlanDeckOptions): Promise<PlanDeckResult> {
  const provider = opts.provider ?? resolveProvider(process.env, opts.fetchImpl);
  const warnings: string[] = [];

  const ingested: Ingested =
    input.type === 'repo' ? await fetchRepo(input.owner, input.repo, opts) : acceptIdea(input.text);
  warnings.push(...ingested.warnings);

  const claims = extractClaims(ingested);
  if (claims.length === 0) {
    warnings.push('no claims extracted; deck is cover + proposal slides only');
  }

  const narrative = planNarrative(claims, { purpose: opts.purpose, lang: opts.lang });
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

  const deck = layoutDeck(narrative, opts.system, opts.seed === undefined ? {} : { seed: opts.seed });
  // Label the producing provider on the deck itself.
  deck.meta.generatedBy = provider.id === 'fallback' ? 'fallback' : `typodeck:${provider.id}`;
  if (provider.id === 'fallback') {
    warnings.push('built with the deterministic fallback (not model inference)');
  }

  validateDeck(deck);
  return {
    deck,
    narrative,
    claims,
    ingested,
    provenance: { provider: provider.id, generatedBy: deck.meta.generatedBy, claims: counts, warnings },
  };
}
