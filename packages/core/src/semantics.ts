// Typodeck Narrative Intelligence — deterministic semantic analysis over claims.
// Pure functions of claim text + kind: no LLM, no I/O, no randomness.
// Powers dimension-ranked planning (narrative.ts) and the Quality Gate (quality.ts).

import type { Claim, ClaimKind } from './evidence';

/**
 * The eight narrative dimensions, in fixed tie-break order. A dimension that
 * merely shares a keyword loses to one the sentence is actually about: pain
 * must be predicated (wastes, churns, fails), not merely mentioned (expiry),
 * to beat a function description — so problem and future settle ties last.
 */
export type Dimension =
  | 'solution'
  | 'results'
  | 'differentiation'
  | 'limitations'
  | 'capabilities'
  | 'architecture'
  | 'problem'
  | 'future'
  | 'decisions'
  | 'methodology'
  | 'market'
  | 'model'
  | 'experience'
  | 'objectives'
  | 'context'
  | 'lessons';

/**
 * Frozen legacy order: the original 8 dimensions. Classification, arcs, and
 * all legacy outputs are computed over exactly this set, so pre-preset
 * behavior is bit-identical (see fixtures/legacy-narrative-baselines.json).
 * Do not extend this list; extend EXTENDED_DIMENSIONS instead.
 */
export const DIMENSIONS: readonly Dimension[] = [
  'solution',
  'results',
  'differentiation',
  'limitations',
  'capabilities',
  'architecture',
  'problem',
  'future',
];

/** Legacy alias used by classifiers: the frozen 8-dimension competition set. */
export const LEGACY_DIMENSIONS: readonly Dimension[] = DIMENSIONS;

export const NEW_DIMENSIONS: readonly Dimension[] = [
  'decisions',
  'methodology',
  'market',
  'model',
  'experience',
  'objectives',
  'context',
  'lessons',
];

/** Full 16-dimension set used by purpose presets (P01–P10). */
export const EXTENDED_DIMENSIONS: readonly Dimension[] = [...DIMENSIONS, ...NEW_DIMENSIONS];

/** Lifecycle stage of a claim: what the text asserts about its own maturity. */
export type ClaimStatus = 'implemented' | 'proposed' | 'historical' | 'deprecated' | 'unverified';

/** Pitch audience: selects the argument arc (dimension order). */
export type Audience = 'hackathon' | 'competition' | 'showcase' | 'general';

export type NarrLang = 'ko' | 'en';

/**
 * Caption status tags (single source of truth): every tag captionFor can
 * emit. Parsers must skip these before reading refs.
 */
export const CAPTION_STATUS_TAGS: ReadonlySet<string> = new Set([
  'verified', 'unverified', 'illustrative', 'proposal', 'proposed',
  'historical', 'deprecated',
]);

/**
 * Argument arc per audience: the order dimensions should appear on stage.
 * FROZEN legacy config: these four arcs and their 8-dimension orders define
 * pre-preset narrative behavior and must not change (correction 1).
 * Purpose presets (P01–P10) define their own arcs in purposes.ts.
 */
export const ARC: Record<Audience, Dimension[]> = {
  hackathon: ['problem', 'solution', 'capabilities', 'architecture', 'results', 'differentiation', 'future', 'limitations'],
  competition: ['problem', 'results', 'differentiation', 'solution', 'capabilities', 'architecture', 'future', 'limitations'],
  showcase: ['problem', 'solution', 'capabilities', 'results', 'differentiation', 'architecture', 'limitations', 'future'],
  general: ['problem', 'solution', 'capabilities', 'results', 'differentiation', 'architecture', 'limitations', 'future'],
};

export const DIM_LABEL: Record<NarrLang, Record<Dimension, string>> = {
  en: {
    problem: 'Problem',
    solution: 'Solution',
    results: 'Results',
    differentiation: 'Why different',
    limitations: 'Limits',
    future: "What's next",
    capabilities: 'What it does',
    architecture: 'How it is built',
    decisions: 'Decisions',
    methodology: 'Method',
    market: 'Market',
    model: 'Business model',
    experience: 'Experience',
    objectives: 'Objectives',
    context: 'Context',
    lessons: 'Lessons',
  },
  ko: {
    problem: '문제',
    solution: '해결책',
    results: '성과',
    differentiation: '차별점',
    limitations: '한계',
    future: '다음 단계',
    capabilities: '주요 기능',
    architecture: '동작 구조',
    decisions: '결정 과정',
    methodology: '방법',
    market: '시장',
    model: '수익 모델',
    experience: '경험',
    objectives: '목표',
    context: '배경',
    lessons: '교훈',
  },
};

export const AUDIENCE_LABEL: Record<NarrLang, Record<Audience, string>> = {
  en: { hackathon: 'Hackathon', competition: 'Competition', showcase: 'Showcase', general: 'Typodeck' },
  ko: { hackathon: '해커톤', competition: '경진대회', showcase: '쇼케이스', general: 'Typodeck' },
};

// ---------------------------------------------------------------------------
// Cue matching: ASCII cues match at a leading word boundary only (so "waste"
// meets "wastes" but never "wastewater" mid-word); Korean cues are substring
// matches; multi-word phrases match literally and weigh double, while a lone
// boundary space ("first ") keeps single-word weight.
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cueHit(textLower: string, cue: string): boolean {
  if (cue.includes(' ')) return textLower.includes(cue);
  if (/^[\x00-\x7F]+$/.test(cue)) return new RegExp(`\\b${esc(cue)}`).test(textLower);
  return textLower.includes(cue);
}

const DIM_CUES: Record<Dimension, string[]> = {
  problem: [
    'problem', 'pain', 'waste', 'losing track', 'lose track', 'loses', 'expir', 'fail',
    'struggle', 'difficult', 'hard to', 'challenge', 'frustrat', 'lack of', 'missing',
    'broken', 'expensive', 'costly', 'manual', 'tedious', 'concern', 'worr', 'silos',
    'churn', 'bounce', 'took down', 'outage', 'downtime',
    '문제', '낭비', '잃', '실패', '어렵', '불편', '고통', '부족', '비효율', '걱정', '위험', '만료', '버려',
  ],
  solution: [
    'fix', 'solve', 'solution', 'ritual', 'lets you', 'allows', 'enables', 'helps',
    'approach', 'introduces', 'introducing', 'powers', 'automates', 'recommends',
    'designed for', 'designed to', 'built to', 'we built', 'meet ', 'no more',
    'business model', 'subscription', 'addressed by',
    '해결', '도와', '제공', '도입', '선보', '출시', '추천',
  ],
  results: [
    'pilot', 'benchmark', 'in production', 'support load', 'tickets', 'feature request',
    'savings', 'saves', 'save ', 'cut render time', 'drop in', 'drop of', 'faster',
    'measured', 'performance', 'grew', 'reached', 'pays for', 'outperform', 'recall',
    'precision', 'ndcg', 'conversion', 'click', 'retention', 'uptime', 'downloads',
    'adopted', 'stars', 'a/b', 'lift',
    '결과', '성과', '파일럿', '벤치마크', '절감', '절약', '측정', '향상', '달성', '증가', '감소',
  ],
  differentiation: [
    'unlike', 'different from', 'unique', 'first ', 'moat', 'advantage', 'versus',
    ' vs ', 'compared', 'competition', 'alternative', 'instead',
    'proprietary', 'exclusive', 'better than', 'faster than', '10x', 'no other', 'competitor',
    'zero configuration', 'dependency-free', 'but no', 'ignore', 'founders', 'combined years',
    '차별', '유일', '최초', '독특', '경쟁', '비교', '달리', '우위', '특허',
  ],
  limitations: [
    'limitation', 'limit', 'constraint', 'tradeoff', 'trade-off', 'however', 'but ',
    ' yet ', 'risk', 'gap', 'missing', 'lack', 'slow', 'fails', 'fatigue',
    'fewer than', 'no faster than', 'no better than', 'at most',
    '한계', '제한', '위험', '단점', '부족', '아직', '다만', '그러나', '문제점', '아쉬', '갭',
  ],
  future: [
    'roadmap', 'phase', 'will ', 'going to', 'plan to', 'plans to', 'planned',
    'upcoming', 'future', 'next step', 'next phase', 'explore', 'partnership',
    'targeting', 'to reach', 'launch', 'soon', 'aims to', 'coming soon',
    'on the roadmap',
    '로드맵', '향후', '다음 단계', '미래', '예정', '계획', '비전', '확장',
  ],
  capabilities: [
    // Stems, not inflections: leading-boundary matching already meets every
    // suffix, so listing both "include" and "includes" would double-count.
    'feature', 'supports', 'include', 'track', 'scann',
    'propose', 'sync', 'nudge', 'adds', 'cover', 'built-in', 'loop',
    'capture', 'steps', 'onboarding', 'catalog', 'predict', 'weighs', 'reorders', 'check',
    'import', 'interface', 'render', 'validates', 'install', 'example', 'only \\d',
    '기능', '지원', '포함', '추적', '스캔', '제안', '동기화', '알림', '탑재', '온보딩', '카탈로그', '예측', '자동', '연동',
  ],
  architecture: [
    'architecture', 'layout engine', 'engine', 'deterministic', 'grid', 'module',
    'stack', 'pipeline', 'algorithm', 'model', 'library', 'framework', 'sensor',
    'bluetooth', 'camera', 'unicode', 'glyph', 'registry', 'configuration',
    'explicit widths', 'function',
    '구조', '아키텍처', '엔진', '모듈', '알고리즘', '모델', '렌더링', '라이브러리', '프레임워크', '센서', '파이프라인', '결정론적', '결정적',
  ],
  // --- Extended dimensions (purpose presets only; legacy scoring untouched) ---
  decisions: [
    'decid', 'decision', 'chose', 'chosen', 'opted', 'we decided', 'we chose',
    'options considered', 'rationale', 'weighing the', 'weighed against',
    '결정', '선택했', '장단점', '트레이드오프', '고려했', '결정했',
  ],
  methodology: [
    'hypothesis', 'methodology', 'methods', 'method ', 'experiment design',
    'experimental setup', 'dataset', 'data set', 'baseline model', 'ablation',
    'study protocol', 'reproduc', 'controlled trial',
    '가설', '방법론', '실험 설계', '데이터셋', '재현', '대조군',
  ],
  market: [
    'market', 'opportunity', 'customers', 'target users', 'user segment',
    'addressable', 'total addressable', 'market size', 'demand', 'persona',
    'customer segment', 'early adopter',
    '시장', '고객', '수요', '기회', '타깃', '세그먼트', '페르소나', '잠재고객',
  ],
  model: [
    'business model', 'revenue', 'pricing', 'price per', 'per seat', 'per user',
    'monetiz', 'annual recurring', 'monthly recurring', 'recurring revenue',
    'unit economics', 'go-to-market', 'go to market', 'sales motion',
    '수익', '매출', '가격', '요금제', '수익모델', '과금',
  ],
  experience: [
    'led ', 'led the', 'managed', 'my role', 'i led', 'i built', 'i designed',
    'responsible for', 'role at', 'joined ', 'worked at', 'worked on',
    'years of experience', 'years at', 'previously at', 'formerly', 'career',
    '경력', '역할', '담당', '년차', '근무', '합류', '이끌었', '맡았',
  ],
  objectives: [
    'objective', 'goals', 'goal ', 'requirements', 'requirement',
    'must support', 'must handle', 'learning objective', 'learning outcome',
    'success criteria', 'acceptance criteria', 'definition of done',
    '목표', '요구사항', '학습 목표', '성공 기준', '완료 조건',
  ],
  context: [
    'background', 'context', 'currently', 'today', 'status quo', 'state of',
    'situation', 'prerequisite', 'prereq', 'assumes', 'assuming', 'given that',
    'workflow', 'day-to-day', 'as-is', 'how teams work today',
    '현황', '배경', '현재', '선수', '전제', '업무 흐름', '워크플로', '요즘',
  ],
  lessons: [
    'learned', 'lesson', 'retrospective', 'retrospect', 'hindsight',
    'takeaway', 'post-mortem', 'postmortem', 'what worked', 'next time',
    'in hindsight', 'looking back',
    '교훈', '배운 점', '회고', '느낀점', '돌아보', '아쉬웠던',
  ],
};

/** "X is a <…> app/product/library/…" self-description → solution +2. */
const WHAT_IT_IS_EN =
  /\b(is|are)\s+(a|an|the)\s+(?:[\w-]+\s+){0,3}(app|product|service|librar\w*|tool|platform|engine|framework|system|sensor|ritual|assistant|cli|api|sdk|bot|dashboard|network|marketplace)\b/;
// Korean stacks modifiers before the noun ("…을 위한 점심 기록 앱이다"), so the gap runs wider.
const WHAT_IT_IS_KO = /[은는]\s+(?:[\w가-힣-]+\s+){0,6}[\w가-힣-]*(앱|제품|서비스|도구|플랫폼|엔진|시스템|라이브러리|어시스턴트)/;

export type DimScores = Record<Dimension, number>;

export function emptyScores(): DimScores {
  return {
    problem: 0, solution: 0, results: 0, differentiation: 0,
    limitations: 0, future: 0, capabilities: 0, architecture: 0,
    decisions: 0, methodology: 0, market: 0, model: 0,
    experience: 0, objectives: 0, context: 0, lessons: 0,
  };
}

/**
 * Context suppressions: "no faster than 10/s" is a constraint, not an
 * advantage (inner "faster than" must not score differentiation), and
 * "the missing ingredients" names known items on a list, not a product
 * gap the way bare "missing features" does.
 */
const NEGATED_CUES: Array<{ phrase: string; dim: Dimension; cue: string }> = [
  { phrase: 'no faster than', dim: 'differentiation', cue: 'faster than' },
  { phrase: 'no better than', dim: 'differentiation', cue: 'better than' },
  { phrase: 'the missing', dim: 'limitations', cue: 'missing' },
  { phrase: 'the missing', dim: 'problem', cue: 'missing' },
];

/**
 * Score every dimension for a text. Deterministic; phrases weigh double.
 * Only `dims` compete (default: frozen legacy 8, so legacy callers are
 * unaffected by the extended set); non-competing dims stay 0.
 */
export function scoreDimensions(text: string, dims: readonly Dimension[] = DIMENSIONS): DimScores {
  const lower = text.toLowerCase();
  const scores = emptyScores();
  const suppressed = new Set<string>();
  for (const n of NEGATED_CUES) {
    if (lower.includes(n.phrase)) suppressed.add(`${n.dim}::${n.cue}`);
  }
  for (const dim of dims) {
    for (const cue of DIM_CUES[dim]) {
      if (suppressed.has(`${dim}::${cue}`)) continue;
      if (cue === 'only \\d') {
        if (/only\s+\d/.test(lower)) scores[dim] += 2;
        continue;
      }
      // Only true multi-word phrases weigh double; a boundary space
      // ("first ") does not make a single word a phrase.
      const phrase = cue.trim().split(/\s+/).length >= 2;
      if (cueHit(lower, cue)) scores[dim] += phrase ? 2 : 1;
    }
  }
  if (dims.includes('solution') && (WHAT_IT_IS_EN.test(lower) || WHAT_IT_IS_KO.test(text))) scores.solution += 2;
  return scores;
}

/**
 * Primary dimension: highest score, ties broken by the competing-set order.
 * Default competes the frozen legacy 8 (identical to pre-preset behavior).
 */
export function classifyDimension(
  text: string,
  dims: readonly Dimension[] = DIMENSIONS,
): { dim: Dimension; scores: DimScores } {
  const scores = scoreDimensions(text, dims);
  let best: Dimension = 'capabilities';
  let bestScore = -1;
  for (const dim of dims) {
    if (scores[dim] > bestScore) {
      bestScore = scores[dim];
      best = dim;
    }
  }
  // Scoreless claims default to capabilities: without the remap, the first
  // tie-break dimension would win all-zero ties and mislabel neutral text.
  if (bestScore === 0) return { dim: 'capabilities', scores };
  return { dim: best, scores };
}

// ---------------------------------------------------------------------------
// Lifecycle status
// ---------------------------------------------------------------------------

const DEPRECATED_CUES = [
  'deprecat', 'will be removed', 'has been removed', 'was removed', 'removed in',
  'no longer supported', 'no longer maintained', 'no longer works', 'discontinued',
  'sunset', 'obsolete', 'end of life', '지원 종료', '중단됨', '더 이상 지원', '제거됨',
];

const HISTORICAL_CUES = [
  'previously', 'formerly', 'used to', 'in the past', 'history of', 'originally',
  'legacy', 'migration from', 'before the rewrite', '구버전', '이전에는', '과거에는', '예전에는', '원래는', '예전 버전',
];

const PROPOSED_CUES = [
  'will ', "'ll ", 'going to', 'plan to', 'plans to', 'planned', 'roadmap',
  'upcoming', 'future', 'next step', 'next phase', 'phase one', 'phase two',
  'phase three', 'could ', 'would like', 'proposal', 'propose to', 'suggest',
  // No bare "vision": it fires inside email domains ("vision-media.ca").
  'consider ', 'might ', 'targeting', 'aims to', 'coming soon',
  'we intend', 'explore', 'partnership', 'to reach', 'launch',
  '예정', '계획', '제안', '구상', '향후', '목표로', '할 것', '할 예정',
];

function hitsAny(textLower: string, raw: string, cues: string[]): boolean {
  return cues.some((c) => (/^[\x00-\x7F]+$/.test(c) ? cueHit(textLower, c) : raw.includes(c)));
}

export function classifyStatus(text: string, kind: ClaimKind): ClaimStatus {
  const lower = text.toLowerCase();
  if (hitsAny(lower, text, DEPRECATED_CUES)) return 'deprecated';
  if (hitsAny(lower, text, HISTORICAL_CUES)) return 'historical';
  if (hitsAny(lower, text, PROPOSED_CUES)) return 'proposed';
  if (kind === 'ungrounded') return 'unverified';
  return 'implemented';
}

/**
 * Lifecycle status for display (Evidence Inspector, captions): the
 * classifier's verdict, with changelog-file claims read as historical.
 * Single source of truth shared by captionFor and the inspector so both
 * surfaces always agree on implemented / proposed / historical /
 * unverified / deprecated.
 */
export function displayStatus(claim: Pick<Claim, 'text' | 'kind' | 'refs'>): ClaimStatus {
  const status = classifyStatus(claim.text, claim.kind);
  if (status === 'proposed' || status === 'historical' || status === 'deprecated') return status;
  if (isChangelogClaim(claim)) return 'historical';
  return status;
}

// ---------------------------------------------------------------------------
// Hero-number validation: versions, years, dates, and hashes are never heroes.
// ---------------------------------------------------------------------------

const HARD_VERSION = /^(v\d|\d+\.\d+\.\d+)/i;
const SOFT_DECIMAL = /^\d+\.\d+$/;
const BARE_VERSION = /^v\d+$/i;
const YEAR_TOKEN = /^(19|20)\d{2}년?$/;
const HEX_TOKEN = /^[0-9a-f]{7,}$/i;
/**
 * Two-part decimals only read as versions near release language. Bare
 * decimals next to support/require/use/need language ("Ruby 1.8",
 * "Python 3.9", "use 4.2") are versions or requirements, never
 * achievements.
 */
const VERSION_WORD =
  /\b(version|release|removed|support\w*|requir\w*|upgrad\w*|migrat\w*|downgrade|update|use|need)\w*\b/i;

function nearVersionWord(text: string, token: string): boolean {
  const idx = text.indexOf(token);
  if (idx < 0) return false;
  const window = text.slice(Math.max(0, idx - 24), idx + token.length + 24);
  return VERSION_WORD.test(window);
}

/** True when the token's occurrence in text sits inside a date/version context. */
function inDateContext(text: string, token: string): boolean {
  const idx = text.indexOf(token);
  if (idx < 0) return true; // not found: untrustworthy, reject
  const before = idx > 0 ? text[idx - 1] : '';
  const after = idx + token.length < text.length ? text[idx + token.length] : '';
  const beforeBefore = idx > 1 ? text[idx - 2] : '';
  const afterAfter = idx + token.length + 1 < text.length ? text[idx + token.length + 1] : '';
  if (before === '/' || after === '/' || after === '월') return true;
  // Issue/PR/bug numbers are incidental references, never metrics.
  if (before === '#') return true;
  if (/\b(issue|pull|bug|ticket|pr|request)s?\s*#?\s*$/.test(text.slice(Math.max(0, idx - 14), idx))) {
    return true;
  }
  if (after === '-' && /\d/.test(afterAfter)) return true;
  if (before === '-' && /\d/.test(beforeBefore)) return true;
  if (before === '.' && /\d/.test(beforeBefore)) return true;
  // Dotted-version fragment: "4.2" inside "4.2.1".
  if (after === '.' && /\d/.test(afterAfter)) return true;
  // "10월 30일": a day counter right after a month name is a date, not a duration.
  if (token.endsWith('일') && /\d월\s*$/.test(text.slice(Math.max(0, idx - 8), idx))) return true;
  return false;
}

export function isHeroEligible(token: string, text: string): boolean {
  if (HARD_VERSION.test(token) || BARE_VERSION.test(token)) return false;
  if (SOFT_DECIMAL.test(token) && nearVersionWord(text, token)) return false;
  if (YEAR_TOKEN.test(token) || HEX_TOKEN.test(token)) return false;
  if (inDateContext(text, token)) return false;
  return true;
}

/** A from-X-to-Y range: the target bound (last) reads better than the start. */
function isRangeText(text: string): boolean {
  return /\d[^.]{0,30}\bto\b[^.]{0,30}\d/.test(text) || /\d\s*[–-]\s*\d/.test(text);
}

/**
 * Hero quality: compact units (%) first, then decimals (versions never reach
 * scoring), then word/hyphen/Korean units, last bare numbers.
 */
export function heroScore(token: string): number {
  if (/(\d\s?(?:%|kB|KB|MB|ms)|\dx|\ds)$/.test(token)) return 3;
  if (/\d+\.\d+/.test(token)) return 2.5;
  if (/[ -]/.test(token) || /[가-힣]$/.test(token)) return 2;
  return 1;
}

export function selectHeroNumber(claim: Pick<Claim, 'text' | 'numbers'>): string | null {
  // Ranges ("from 6 hours to 15 minutes") break score ties toward the last
  // bound; everywhere else the first telling number wins.
  const lastWinsTies = isRangeText(claim.text);
  let best: string | null = null;
  let bestScore = 0;
  for (const token of claim.numbers) {
    if (!isHeroEligible(token, claim.text)) continue;
    const s = heroScore(token);
    if (s > bestScore || (lastWinsTies && s === bestScore)) {
      bestScore = s;
      best = token;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Redundancy + thin/contextless detection
// ---------------------------------------------------------------------------

const SIM_STOP = new Set(
  ('the,a,an,and,or,for,for,with,that,these,those,from,have,has,are,was,were,' +
    'will,would,can,could,should,into,your,you,our,their,they,them,then,than,' +
    'when,what,which,who,how,all,any,each,more,most,other,such,only,also,use,' +
    'used,using,its,including,provides,of,to,in,on,at,by,as,is,it,be,been,per,' +
    'via,over,under,between,across,through,within,without,no,not,do,does,did,' +
    'too,very,just,some,same,own,new,this,that,s,its').split(','),
);

export function contentTokens(text: string): Set<string> {
  const out = new Set<string>();
  for (const raw of text.toLowerCase().split(/[^a-z0-9가-힣]+/)) {
    if (raw === '' || SIM_STOP.has(raw)) continue;
    if (/^[0-9]+$/.test(raw) || raw.length >= 2) out.add(raw);
  }
  return out;
}

/** Jaccard similarity over content tokens. 1 = identical bags. */
export function claimSimilarity(a: string, b: string): number {
  const ta = contentTokens(a);
  const tb = contentTokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  return inter / (ta.size + tb.size - inter);
}

/** Claims this similar (or more) must not share a deck as separate theses. */
export const SIM_REDUNDANT = 0.55;
/** Slide theses this similar (or more) count as a repeated thesis. */
export const SIM_REPEATED_THESIS = 0.6;

/** Pronoun/demonstrative-led with no named anchor, number, or substance. */
export function isContextless(text: string): boolean {
  const t = text.trim();
  if (/^(it|they|them|he|she|this|that|these|those|here|there)\b/i.test(t)) {
    if (t.length >= 120) return false;
    if (/\d/.test(t)) return false;
    const terms = [...contentTokens(t)].filter((w) => w.length >= 6);
    return terms.length === 0;
  }
  if (/^(이것|그것|저것|이는|그는|저는|이것은|그것은|여기|거기)/.test(t) && t.length < 80) return true;
  return false;
}

/** Too thin to carry a slide on its own (section headers, fragments). */
export function isThin(text: string, numbers: string[]): boolean {
  return text.trim().length < 60 && numbers.length === 0;
}

/** Pointer sentences ("See docs/…") carry no thesis of their own. */
export function isPointer(text: string): boolean {
  // No bare "read": "Read receipts sync…" is content, not a pointer.
  return /^(see|refer to|check out|check|cf\.?)\s+\S+/i.test(text.trim());
}

/** API-example residue ("dayjs().set('month', 3)") — incidental, not prose. */
export function isCodeFragment(text: string): boolean {
  const t = text.replace(/:\/\//g, ''); // URL slashes are not comment markers
  return /\(\)|=>|\/\//.test(t) || /^(import|export|const|let|var|def|function|class)\s/.test(text);
}

/**
 * Changelog-family files (docs only — a module named history.js is code).
 * Their claims read as historical whatever their tense.
 */
const CHANGELOG_FILE =
  /(^|\/)(changelog|changes|history|news|releases|release-notes|release_notes)(\.md|\.mdx|\.txt|\.rst|\.adoc|\.rdoc|\.textile|)$/i;

export function isChangelogClaim(claim: Pick<Claim, 'refs'>): boolean {
  return claim.refs.length > 0 && CHANGELOG_FILE.test(claim.refs[0].path);
}

// ---------------------------------------------------------------------------
// Audience parsing: "hackathon" / "competition: Acme" / "쇼케이스: …" / "Acme"
// ---------------------------------------------------------------------------

// Single source of truth for legacy audience names: each alternation feeds
// both the bare matcher ("hackathon") and the titled matcher
// ("hackathon: Acme"), so the two can never diverge. The constructed
// patterns are source-identical to the regex literals they replace.
const AUDIENCE_NAMES: Array<{ names: string; audience: Audience }> = [
  { names: 'hackathon|해커톤', audience: 'hackathon' },
  { names: 'competition|contest|경진대회|공모전', audience: 'competition' },
  { names: 'showcase|demo\\s*day|demoday|쇼케이스|발표회?|시연회?', audience: 'showcase' },
];

const AUDIENCE_PATTERNS: Array<{ re: RegExp; audience: Audience }> = AUDIENCE_NAMES.map(
  ({ names, audience }) => ({ re: new RegExp(`^(${names})$`, 'i'), audience }),
);

const AUDIENCE_PREFIX: Array<{ re: RegExp; audience: Audience }> = AUDIENCE_NAMES.map(
  ({ names, audience }) => ({ re: new RegExp(`^(${names})\\s*[:\\-–]\\s*(.+)$`, 'i'), audience }),
);

export type PresetRef = `P${'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'}`;

const PRESET_PREFIX = /^(P0[1-9]|P10)\s*[:\-–]\s*(.+)$/i;
const PRESET_BARE = /^(P0[1-9]|P10)$/i;

export function parsePurpose(purpose?: string): { audience: Audience; title?: string; preset?: PresetRef } {
  const raw = (purpose ?? '').trim();
  if (raw === '') return { audience: 'general' };
  // Preset syntax ("P04", "P04: Acme") is disjoint from legacy audience
  // patterns, so legacy inputs parse exactly as before (correction 1).
  const pre = raw.match(PRESET_PREFIX);
  if (pre && pre[2].trim() !== '') return { audience: 'general', title: pre[2].trim(), preset: pre[1].toUpperCase() as PresetRef };
  const bare = raw.match(PRESET_BARE);
  if (bare) return { audience: 'general', preset: bare[1].toUpperCase() as PresetRef };
  for (const p of AUDIENCE_PREFIX) {
    const m = raw.match(p.re);
    if (m && m[2].trim() !== '') return { audience: p.audience, title: m[2].trim() };
  }
  for (const p of AUDIENCE_PATTERNS) {
    if (p.re.test(raw)) return { audience: p.audience };
  }
  return { audience: 'general', title: raw };
}

// ---------------------------------------------------------------------------
// One-shot analysis
// ---------------------------------------------------------------------------

export interface ClaimAnalysis {
  dim: Dimension;
  scores: DimScores;
  status: ClaimStatus;
  hero: string | null;
  heroScore: number;
  contextless: boolean;
  thin: boolean;
  pointer: boolean;
  codeFragment: boolean;
}

export function analyzeClaim(
  claim: Pick<Claim, 'text' | 'kind' | 'numbers'>,
  dims: readonly Dimension[] = DIMENSIONS,
): ClaimAnalysis {
  const { dim, scores } = classifyDimension(claim.text, dims);
  const status = classifyStatus(claim.text, claim.kind);
  const hero = selectHeroNumber(claim);
  return {
    dim,
    scores,
    status,
    hero,
    heroScore: hero === null ? 0 : heroScore(hero),
    contextless: isContextless(claim.text),
    thin: isThin(claim.text, claim.numbers),
    pointer: isPointer(claim.text),
    codeFragment: isCodeFragment(claim.text),
  };
}
