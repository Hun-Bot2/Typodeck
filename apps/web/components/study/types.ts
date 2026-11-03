import type { Slide } from '@typodeck/core';

// ---------------------------------------------------------------- types ---

export interface StudyElement {
  id: string;
  role: string;
  label: string;
  preview: string;
}

export interface PublicCase {
  caseId: string;
  slide: Slide;
  system: string;
  elements: StudyElement[];
}

export interface Manifest {
  reviewerId: string;
  datasetVersion: string;
  seed: number;
  order: string[];
  total: number;
  cases: PublicCase[];
}

export type ProblemKind =
  | 'none'
  | 'clip'
  | 'contrast'
  | 'emphasis'
  | 'grouping'
  | 'reading-order'
  | 'spacing'
  | 'other';

export interface ProblemEntry {
  type: ProblemKind;
  blockIds: string[];
  comment: string;
}

export interface Annotation {
  reviewerId: string;
  datasetVersion: string;
  seed: number;
  caseId: string;
  firstFocus: string | null;
  ranking: string[][];
  groups: string[][];
  problems: ProblemEntry[];
  confidence: number | null;
  interpretation: { mainMessage: string | null; comment: string };
  status: 'in-progress' | 'done';
  updatedAt: string;
}

export function blankLocal(caseId: string): Omit<Annotation, 'reviewerId' | 'datasetVersion' | 'seed' | 'updatedAt' | 'status'> & { status: Annotation['status'] } {
  return {
    caseId,
    firstFocus: null,
    ranking: [],
    groups: [],
    problems: [],
    confidence: null,
    interpretation: { mainMessage: null, comment: '' },
    status: 'in-progress',
  };
}

export function isDone(a: Annotation | undefined): boolean {
  if (!a) return false;
  return a.firstFocus !== null && a.ranking.length > 0 && a.confidence !== null;
}

// ------------------------------------------------------- frozen strings ---

export const STR = {
  start: '평가 시작',
  firstFocusQ: '이 슬라이드를 처음 봤을 때 가장 먼저 눈에 들어온 요소는 무엇인가요?',
  rankQ: '어떤 요소가 가장 강조되어 보이나요? 중요해 보이는 순서대로 정렬해 주세요.',
  groupQ: '서로 연결된 하나의 정보처럼 보이는 요소들을 선택해 주세요.',
  problemsQ: '시각적으로 어색하거나 이해하기 어려운 부분이 있나요?',
  confidenceQ: '이 판단에 얼마나 확신하나요?',
  review: '응답 검토',
  save: '결과 저장',
  export: '결과 내보내기',
} as const;

export const PROBLEM_OPTIONS: { value: ProblemKind; label: string }[] = [
  { value: 'none', label: '문제 없음' },
  { value: 'clip', label: '텍스트 잘림·오버플로' },
  { value: 'contrast', label: '대비 부족' },
  { value: 'emphasis', label: '혼란스러운 강조' },
  { value: 'grouping', label: '불명확한 그룹화' },
  { value: 'reading-order', label: '어려운 읽기 순서' },
  { value: 'spacing', label: '열악한 간격·정렬' },
  { value: 'other', label: '기타' },
];

export function progressLabel(n: number, m: number): string {
  return `평가 ${n} / ${m}`;
}

// ------------------------------------------------------------------ api ---

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: { code?: string; message?: string } };
    if (body?.error?.message) return body.error.message;
    if (body?.error?.code) return body.error.code;
  } catch {
    /* fall through */
  }
  return `요청 실패 (${res.status})`;
}

export async function apiManifest(reviewer: string): Promise<Manifest> {
  const res = await fetch(`/api/study/manifest?reviewer=${encodeURIComponent(reviewer)}`);
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as Manifest;
}

export async function apiProgress(reviewer: string): Promise<{ annotations: Record<string, Annotation>; done: number }> {
  const res = await fetch(`/api/study/progress?reviewer=${encodeURIComponent(reviewer)}`);
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as { annotations: Record<string, Annotation>; done: number };
}

export async function apiAnnotate(
  reviewerId: string,
  caseId: string,
  patch: Record<string, unknown>,
): Promise<{ ok: boolean; updatedAt: string }> {
  const res = await fetch('/api/study/annotate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewerId, caseId, patch }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as { ok: boolean; updatedAt: string };
}

export async function apiFinalize(reviewerId: string): Promise<{ snapshot: string }> {
  const res = await fetch('/api/study/finalize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewerId }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as { snapshot: string };
}

export async function apiRunEval(reviewerId: string): Promise<{ ok: boolean; summary: unknown; resultsFile: string }> {
  const res = await fetch('/api/study/run-eval', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewerId }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as { ok: boolean; summary: unknown; resultsFile: string };
}

export async function apiResults(reviewerId: string): Promise<unknown> {
  const res = await fetch(`/api/study/results?reviewerId=${encodeURIComponent(reviewerId)}`);
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as unknown;
}

export function exportUrl(reviewerId: string, format: 'json' | 'csv'): string {
  return `/api/study/export?reviewerId=${encodeURIComponent(reviewerId)}&format=${format}`;
}

// --------------------------------------------------------------- drafts ---

export function draftKey(reviewer: string, caseId: string): string {
  return `typodeck.study.${reviewer}.${caseId}`;
}

interface Draft {
  savedAt: string;
  ann: Annotation;
}

function comparable(a: Annotation): string {
  const { updatedAt: _u, ...rest } = a;
  void _u;
  return JSON.stringify(rest);
}

export function loadDraft(reviewer: string, caseId: string): Draft | null {
  try {
    const raw = localStorage.getItem(draftKey(reviewer, caseId));
    if (!raw) return null;
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
}

export function saveDraft(reviewer: string, ann: Annotation): void {
  try {
    const draft: Draft = { savedAt: new Date().toISOString(), ann };
    localStorage.setItem(draftKey(reviewer, ann.caseId), JSON.stringify(draft));
  } catch {
    /* storage full or unavailable: server save still applies */
  }
}

/**
 * Merge a server annotation with a local draft. Server wins on conflict; the
 * losing draft is kept under a conflict key and reported via `conflicted`.
 */
export function mergeServerAndDraft(
  reviewer: string,
  caseId: string,
  server: Annotation | undefined,
  fallback: Annotation,
): { ann: Annotation; conflicted: boolean } {
  const draft = loadDraft(reviewer, caseId);
  if (!draft) {
    return { ann: server ?? fallback, conflicted: false };
  }
  if (!server) {
    return { ann: draft.ann, conflicted: false };
  }
  if (comparable(server) === comparable(draft.ann)) {
    return { ann: server, conflicted: false };
  }
  try {
    localStorage.setItem(`${draftKey(reviewer, caseId)}:conflict:${draft.savedAt}`, JSON.stringify(draft));
  } catch {
    /* best effort */
  }
  return { ann: server, conflicted: true };
}
