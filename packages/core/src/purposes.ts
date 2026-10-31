// Typodeck Purpose Presets (P01–P10) — versioned, machine-readable narrative
// strategies. A preset defines WHAT a presentation communicates (audience,
// goal, arc, evidence rules); it never names fonts, palettes, or coordinates.
// Visual systems render the resulting Slide IR without changing its content.
//
// Backward compatibility (correction 1): legacy audiences (hackathon /
// competition / showcase / general) keep their frozen ARC + 8-dimension
// behavior via resolvePurpose(). Legacy 'showcase' is NOT P04.

import type { ClaimKind } from './evidence';
import {
  ARC,
  AUDIENCE_LABEL,
  parsePurpose,
  type Audience,
  type ClaimStatus,
  type Dimension,
  type NarrLang,
  type PresetRef,
} from './semantics';

export type { PresetRef };
export type PresetVariant = 'short' | 'standard' | 'extended';
export type PresetId = PresetRef;

export interface LocalText {
  en: string;
  ko: string;
}

export interface PresetStep {
  /** Stable step id (kebab-case, unique within the preset). */
  id: string;
  /** Classification dimension feeding this step (16-dim extended set). */
  dim: Dimension;
  /** Kicker label shown on the slide. */
  label: LocalText;
  /** Optional steps are skipped silently when no claim qualifies. */
  optional?: boolean;
  /** When set, only claims with these lifecycle statuses may headline. */
  allowStatuses?: ClaimStatus[];
}

export interface PresetIntegrityRule {
  text: LocalText;
  /** True when mechanically enforced by the planner; else documented convention. */
  enforced: boolean;
}

export interface PresetIntegrity {
  /**
   * Dimensions whose ungrounded claims are dropped in REPO mode (when at
   * least one verified/suggestion claim exists). In pure-idea mode the idea
   * text is the only source, so ungrounded claims stay (labeled illustrative).
   */
  groundedOnlyDims?: Dimension[];
  /** Claim kinds allowed to headline number slides (default: all). */
  numberKinds?: ClaimKind[];
  rules: PresetIntegrityRule[];
}

export interface PresetVariantConfig {
  maxSlides: number;
  encore: boolean;
  /** Short variant keeps required steps only (plus emphasized optionals). */
  requiredOnly: boolean;
}

export interface PurposePreset {
  id: PresetId;
  version: string;
  name: LocalText;
  audience: LocalText;
  goal: LocalText;
  steps: PresetStep[];
  /** Cover pick priority (first dimensions win). */
  coverDims: Dimension[];
  /** Closing restatement priority. */
  closeDims: Dimension[];
  integrity: PresetIntegrity;
  variants: Record<PresetVariant, PresetVariantConfig>;
  langNotes: LocalText;
}

const VARIANTS: Record<PresetVariant, PresetVariantConfig> = {
  short: { maxSlides: 6, encore: false, requiredOnly: true },
  standard: { maxSlides: 12, encore: true, requiredOnly: false },
  extended: { maxSlides: 15, encore: true, requiredOnly: false },
};

function step(id: string, dim: Dimension, en: string, ko: string, extra: Partial<PresetStep> = {}): PresetStep {
  return { id, dim, label: { en, ko }, ...extra };
}

export const PRESETS: Record<PresetId, PurposePreset> = {
  P01: {
    id: 'P01', version: '1.0.0',
    name: { en: 'Hackathon / Competition', ko: '해커톤 / 경진대회' },
    audience: { en: 'Competition judges and live audience', ko: '심사위원과 현장 청중' },
    goal: { en: 'Tell a compelling, evidence-backed story that earns a high judging score.', ko: '높은 심사 점수를 받는 설득력 있고 근거 있는 이야기 전달' },
    steps: [
      step('problem-discovery', 'problem', 'Problem Discovery', '문제 발견'),
      step('affected-persona', 'context', 'Who It Affects', '영향받는 사용자', { optional: true }),
      step('pain-points', 'problem', 'Pain Points', '고통 지점'),
      step('existing-alternatives', 'differentiation', 'Existing Alternatives', '기존 대안'),
      step('proposed-solution', 'solution', 'Proposed Solution', '제안하는 해결책'),
      step('demo', 'capabilities', 'Demo', '데모'),
      step('differentiation', 'differentiation', 'Differentiation', '차별점'),
      step('impact', 'results', 'Impact', '기대 효과'),
    ],
    coverDims: ['problem', 'solution'],
    closeDims: ['solution', 'results'],
    integrity: {
      groundedOnlyDims: ['results'],
      rules: [
        { text: { en: 'Persona step is optional; omit it when unsupported.', ko: '페르소나 단계는 선택 사항이며 근거가 없으면 생략한다.' }, enforced: true },
        { text: { en: 'Never invent user interviews, validated demand, or business impact.', ko: '사용자 인터뷰, 검증된 수요, 비즈니스 임팩트를 지어내지 않는다.' }, enforced: false },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Direct, energetic arc; demo step carries the proof.', ko: '직접적이고 에너지 있는 구성; 데모 단계가 증거를 담당한다.' },
  },
  P02: {
    id: 'P02', version: '1.0.0',
    name: { en: 'Developer Portfolio', ko: '개발자 포트폴리오' },
    audience: { en: 'Hiring managers and peer engineers', ko: '채용 담당자와 동료 엔지니어' },
    goal: { en: 'Lead with what was actually built; show engineering judgment.', ko: '실제로 만든 것을 앞세우고 엔지니어링 판단력을 보여준다.' },
    steps: [
      step('built-artifact', 'results', 'Built Artifact', '만든 결과물'),
      step('key-capabilities', 'capabilities', 'Key Capabilities', '핵심 기능'),
      step('technical-challenges', 'problem', 'Technical Challenges', '기술적 난관'),
      step('engineering-decisions', 'decisions', 'Engineering Decisions', '엔지니어링 결정'),
      step('implementation', 'architecture', 'Implementation', '구현'),
      step('evidence', 'results', 'Evidence', '증거'),
      step('reflection', 'lessons', 'Reflection', '회고', { optional: true }),
    ],
    coverDims: ['results', 'capabilities'],
    closeDims: ['results', 'lessons'],
    integrity: {
      rules: [
        { text: { en: 'Distinguish individual contributions from team achievements in claim text and captions.', ko: '개인의 기여와 팀의 성과를 주장 텍스트와 캡션에서 구분한다.' }, enforced: false },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Artifact-first; decisions and trade-offs carry seniority signal.', ko: '결과물 우선; 결정과 트레이드오프가 시니어리티를 보여준다.' },
  },
  P03: {
    id: 'P03', version: '1.0.0',
    name: { en: 'Resume / Career', ko: '이력서 / 커리어' },
    audience: { en: 'Recruiters and hiring managers', ko: '리크루터와 채용 담당자' },
    goal: { en: 'Present concise, verifiable career claims.', ko: '간결하고 검증 가능한 커리어 주장을 제시한다.' },
    steps: [
      step('professional-identity', 'context', 'Professional Identity', '전문가 정체성'),
      step('core-strengths', 'capabilities', 'Core Strengths', '핵심 강점'),
      step('representative-achievements', 'results', 'Representative Achievements', '대표 성과'),
      step('individual-contribution', 'experience', 'Individual Contribution', '개인의 기여'),
      step('supporting-technical-evidence', 'architecture', 'Supporting Technical Evidence', '기술적 근거'),
      step('experience', 'experience', 'Experience', '경력'),
      step('career-direction', 'future', 'Career Direction', '커리어 방향', { optional: true }),
    ],
    coverDims: ['context', 'results'],
    closeDims: ['results', 'future'],
    integrity: {
      groundedOnlyDims: ['results'],
      numberKinds: ['verified', 'suggestion'],
      rules: [
        { text: { en: 'Do not invent employment, awards, responsibilities, or performance metrics.', ko: '고용, 수상, 책임, 성과 지표를 지어내지 않는다.' }, enforced: false },
        { text: { en: 'Hero metrics must be verified or suggestion-backed, never bare idea numbers.', ko: '핵심 지표는 검증된 출처가 있어야 하며 아이디어 텍스트의 숫자만으로는 내세우지 않는다.' }, enforced: true },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Terse bullets; every number needs a source.', ko: '간결한 불릿; 모든 숫자에 출처가 필요하다.' },
  },
  P04: {
    id: 'P04', version: '1.0.0',
    name: { en: 'Product Pitch', ko: '제품 피치' },
    audience: { en: 'Investors and stakeholders', ko: '투자자와 이해관계자' },
    goal: { en: 'Sell the opportunity while separating traction from assumptions.', ko: '기회를 설득하되 트랙션과 가정을 구분한다.' },
    steps: [
      step('opportunity', 'market', 'Opportunity', '기회'),
      step('customer-problem', 'problem', 'Customer Problem', '고객 문제'),
      step('product-proposition', 'solution', 'Product Proposition', '제품 제안'),
      step('differentiation', 'differentiation', 'Differentiation', '차별점'),
      step('business-model', 'model', 'Business Model', '비즈니스 모델'),
      step('evidence-traction', 'results', 'Evidence & Traction', '증거와 트랙션'),
      step('growth-strategy', 'future', 'Growth Strategy', '성장 전략'),
      step('the-ask', 'objectives', 'The Ask', '제안 요청'),
    ],
    coverDims: ['market', 'problem'],
    closeDims: ['objectives', 'results'],
    integrity: {
      groundedOnlyDims: ['results'],
      rules: [
        { text: { en: 'Distinguish validated traction (results) from assumptions and projections (model/future).', ko: '검증된 트랙션과 가정·전망을 구분한다.' }, enforced: true },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Ask closes the deck; market sizing stays in the opportunity step.', ko: '요청으로 마무리하며 시장 규모는 기회 단계에 둔다.' },
  },
  P05: {
    id: 'P05', version: '1.0.0',
    name: { en: 'Research Presentation', ko: '연구 발표' },
    audience: { en: 'Researchers and reviewers', ko: '연구자와 리뷰어' },
    goal: { en: 'Report question, method, results, and limits with qualifications intact.', ko: '질문, 방법, 결과, 한계를 조건과 함께 보고한다.' },
    steps: [
      step('research-question', 'objectives', 'Research Question', '연구 질문'),
      step('prior-work-gap', 'problem', 'Prior-Work Gap', '선행 연구의 간극'),
      step('hypothesis', 'methodology', 'Hypothesis', '가설'),
      step('methodology', 'methodology', 'Methodology', '방법론'),
      step('experiments', 'methodology', 'Experiments', '실험'),
      step('results', 'results', 'Results', '결과'),
      step('interpretation', 'results', 'Interpretation', '해석'),
      step('limitations', 'limitations', 'Limitations', '한계'),
    ],
    coverDims: ['objectives', 'problem'],
    closeDims: ['results', 'limitations'],
    integrity: {
      rules: [
        { text: { en: 'Preserve methodological qualifications and uncertainty; never drop limitation claims.', ko: '방법론적 조건과 불확실성을 유지하고 한계 주장을 누락하지 않는다.' }, enforced: false },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Methodology steps share a dimension but headline distinct claims.', ko: '방법론 단계들은 차원을 공유하되 서로 다른 주장을 내세운다.' },
  },
  P06: {
    id: 'P06', version: '1.0.0',
    name: { en: 'Technical Architecture', ko: '기술 아키텍처' },
    audience: { en: 'Staff engineers and architects', ko: '스태프 엔지니어와 아키텍트' },
    goal: { en: 'Prioritize engineering reasoning over promotional language.', ko: '홍보 문구보다 엔지니어링 추론을 우선한다.' },
    steps: [
      step('system-objective', 'objectives', 'System Objective', '시스템 목표'),
      step('requirements-constraints', 'objectives', 'Requirements & Constraints', '요구사항과 제약'),
      step('architecture', 'architecture', 'Architecture', '아키텍처'),
      step('key-decisions', 'decisions', 'Key Decisions', '핵심 결정'),
      step('trade-offs', 'decisions', 'Trade-offs', '트레이드오프'),
      step('reliability-performance', 'results', 'Reliability & Performance', '신뢰성과 성능'),
      step('validation', 'methodology', 'Validation', '검증'),
      step('future-work', 'future', 'Future Work', '향후 과제', { optional: true }),
    ],
    coverDims: ['objectives', 'architecture'],
    closeDims: ['decisions', 'results'],
    integrity: {
      rules: [
        { text: { en: 'Every architecture claim should pair with a decision or trade-off rationale.', ko: '아키텍처 주장은 결정이나 트레이드오프 근거와 짝을 이룬다.' }, enforced: false },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Reasoning-first; constraints are first-class steps.', ko: '추론 우선; 제약을 1급 단계로 다룬다.' },
  },
  P07: {
    id: 'P07', version: '1.0.0',
    name: { en: 'Business Review', ko: '사업 리뷰' },
    audience: { en: 'Executives and operators', ko: '임원과 실무 리더' },
    goal: { en: 'Report results, drivers, risks, and next actions with metric discipline.', ko: '결과, 요인, 리스크, 다음 행동을 지표 규율과 함께 보고한다.' },
    steps: [
      step('executive-results', 'results', 'Executive Results', '핵심 결과'),
      step('kpi-changes', 'results', 'KPI Changes', 'KPI 변화'),
      step('drivers', 'context', 'Drivers', '변화 요인'),
      step('segment-findings', 'market', 'Segment Findings', '세그먼트 분석'),
      step('risks', 'limitations', 'Risks', '리스크'),
      step('decisions', 'decisions', 'Decisions', '결정 사항'),
      step('next-actions', 'future', 'Next Actions', '다음 행동'),
    ],
    coverDims: ['results', 'context'],
    closeDims: ['decisions', 'future'],
    integrity: {
      groundedOnlyDims: ['results'],
      numberKinds: ['verified', 'suggestion'],
      rules: [
        { text: { en: 'Preserve metric definitions, periods, and units in claim text.', ko: '지표 정의, 기간, 단위를 주장 텍스트에 유지한다.' }, enforced: false },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Numbers-first; risks and decisions are never optional.', ko: '숫자 우선; 리스크와 결정은 생략하지 않는다.' },
  },
  P08: {
    id: 'P08', version: '1.0.0',
    name: { en: 'Educational Lecture', ko: '교육 강의' },
    audience: { en: 'Learners at a stated level', ko: '수준이 명시된 학습자' },
    goal: { en: 'Teach from objectives through examples to application and recap.', ko: '목표부터 예제, 적용, 정리까지 가르친다.' },
    steps: [
      step('learning-objectives', 'objectives', 'Learning Objectives', '학습 목표'),
      step('motivation', 'context', 'Motivation', '동기 부여'),
      step('prerequisites', 'context', 'Prerequisites', '선수 지식'),
      step('core-concepts', 'capabilities', 'Core Concepts', '핵심 개념'),
      step('worked-examples', 'capabilities', 'Worked Examples', '예제 풀이'),
      step('application', 'capabilities', 'Application', '적용'),
      step('recap', 'lessons', 'Recap', '정리', { optional: true }),
    ],
    coverDims: ['objectives', 'context'],
    closeDims: ['lessons', 'capabilities'],
    integrity: {
      rules: [
        { text: { en: 'Adapt explanations to audience expertise; never skip prerequisites silently.', ko: '청중 수준에 맞춰 설명하고 선수 지식을 조용히 생략하지 않는다.' }, enforced: false },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Expository claims default to capabilities; steps stay distinct by label and claim.', ko: '설명문은 capabilities로 분류되며 단계는 레이블과 주장으로 구분된다.' },
  },
  P09: {
    id: 'P09', version: '1.0.0',
    name: { en: 'Project Proposal', ko: '프로젝트 제안' },
    audience: { en: 'Sponsors and approvers', ko: '스폰서와 승인권자' },
    goal: { en: 'Propose future work without ever presenting it as done.', ko: '미래의 일을 제안하되 완료된 것으로 포장하지 않는다.' },
    steps: [
      step('current-situation', 'context', 'Current Situation', '현재 상황'),
      step('problem', 'problem', 'Problem', '문제'),
      step('objectives', 'objectives', 'Objectives', '목표'),
      step('proposed-approach', 'solution', 'Proposed Approach', '제안하는 접근법'),
      step('implementation-plan', 'methodology', 'Implementation Plan', '실행 계획'),
      step('resources', 'capabilities', 'Resources', '필요 자원'),
      step('risks', 'limitations', 'Risks', '리스크'),
      step('expected-outcomes', 'results', 'Expected Outcomes', '기대 성과', {
        allowStatuses: ['proposed', 'unverified'],
      }),
    ],
    coverDims: ['context', 'objectives'],
    closeDims: ['objectives', 'results'],
    integrity: {
      rules: [
        { text: { en: 'Expected outcomes admit only proposed/unverified claims; achieved results never headline them.', ko: '기대 성과에는 제안/미검증 주장만 사용하고 달성된 결과를 내세우지 않는다.' }, enforced: true },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Status filter on outcomes is the anti-fabrication gate.', ko: '성과 단계의 상태 필터가 과장 방지 장치다.' },
  },
  P10: {
    id: 'P10', version: '1.0.0',
    name: { en: 'Case Study', ko: '케이스 스터디' },
    audience: { en: 'Practitioners and evaluators', ko: '실무자와 평가자' },
    goal: { en: 'Report what happened, decided, resulted, and was learned.', ko: '일어난 일, 결정, 결과, 교훈을 보고한다.' },
    steps: [
      step('context', 'context', 'Context', '배경'),
      step('challenge', 'problem', 'Challenge', '도전 과제'),
      step('constraints', 'limitations', 'Constraints', '제약 조건'),
      step('approach', 'solution', 'Approach', '접근 방법'),
      step('key-decisions', 'decisions', 'Key Decisions', '핵심 결정'),
      step('results', 'results', 'Results', '결과'),
      step('lessons', 'lessons', 'Lessons', '교훈', { optional: true }),
    ],
    coverDims: ['context', 'problem'],
    closeDims: ['results', 'lessons'],
    integrity: {
      rules: [
        { text: { en: 'Distinguish direct evidence from retrospective interpretation in claim text.', ko: '직접 증거와 회고적 해석을 주장 텍스트에서 구분한다.' }, enforced: false },
      ],
    },
    variants: VARIANTS,
    langNotes: { en: 'Chronological arc; lessons close only when supported.', ko: '시간순 구성; 교훈은 근거가 있을 때만 맺는다.' },
  },
};

export const PRESET_IDS: readonly PresetId[] = [
  'P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10',
];

export function getPreset(id: string): PurposePreset {
  const p = (PRESETS as Record<string, PurposePreset>)[id.toUpperCase()];
  if (!p) throw new Error(`unknown purpose preset "${id}" (want P01..P10)`);
  return p;
}

/**
 * Explicit backward-compatible mapping for legacy audiences (correction 1).
 * Legacy 'showcase' (and siblings) resolve here — frozen ARC + 8-dimension
 * scoring — and NEVER to a purpose preset. P04 is a different narrative.
 */
export const LEGACY_PURPOSE_MAP: Record<Audience, { arc: Dimension[]; label: { en: string; ko: string }; note: string }> = {
  hackathon: { arc: ARC.hackathon, label: { en: 'Hackathon', ko: '해커톤' }, note: 'frozen legacy arc; P01 is the preset successor' },
  competition: { arc: ARC.competition, label: { en: 'Competition', ko: '경진대회' }, note: 'frozen legacy arc; P01 is the preset successor' },
  showcase: { arc: ARC.showcase, label: { en: 'Showcase', ko: '쇼케이스' }, note: 'frozen legacy arc; NOT P04 Product Pitch' },
  general: { arc: ARC.general, label: { en: 'Typodeck', ko: 'Typodeck' }, note: 'frozen legacy arc (default)' },
};

export type ResolvedPurpose =
  | { kind: 'legacy'; audience: Audience; title?: string }
  | { kind: 'preset'; preset: PurposePreset; title?: string };

export function resolvePurpose(opts: { purpose?: string; preset?: string }): ResolvedPurpose {
  if (opts.preset !== undefined) {
    const preset = getPreset(opts.preset);
    const title = (opts.purpose ?? '').trim();
    return { kind: 'preset', preset, title: title === '' ? undefined : title };
  }
  const parsed = parsePurpose(opts.purpose);
  if (parsed.preset) return { kind: 'preset', preset: getPreset(parsed.preset), title: parsed.title };
  return { kind: 'legacy', audience: parsed.audience, title: parsed.title };
}

/** Map a user duration to a preset variant (explicit variant wins). */
export function variantForDuration(durationMin: number | undefined, explicit?: PresetVariant): PresetVariant {
  if (explicit) return explicit;
  if (durationMin === undefined) return 'standard';
  if (durationMin <= 5) return 'short';
  if (durationMin <= 15) return 'standard';
  return 'extended';
}

/**
 * Kicker casing rule (single source of truth): Korean labels keep their
 * native case; English labels shout in upper case.
 */
export function kickerCase(label: string, lang: NarrLang): string {
  return lang === 'ko' ? label : label.toUpperCase();
}

/** Kicker label for a preset step (falls back to the dimension label). */
export function stepKicker(preset: PurposePreset, stepId: string, lang: NarrLang): string {
  const step = preset.steps.find((s) => s.id === stepId);
  if (!step) throw new Error(`unknown step "${stepId}" in preset ${preset.id}`);
  return kickerCase(step.label[lang], lang);
}

/** Cover kicker for a preset (its name). */
export function presetKicker(preset: PurposePreset, lang: NarrLang): string {
  return kickerCase(preset.name[lang], lang);
}

export function legacyKicker(audience: Audience, lang: NarrLang, customTitle?: string): string {
  if (audience === 'general') {
    return customTitle ? customTitle.toUpperCase().slice(0, 48) : 'TYPODECK';
  }
  return kickerCase(AUDIENCE_LABEL[lang][audience], lang);
}
