import fs from 'node:fs/promises';
import path from 'node:path';
import type { Slide } from '@typodeck/core';

/**
 * Shared server helpers for /api/study/*. Client-safe projection is done by
 * allowlist (toPublicCase builds fresh objects with only the four keys the
 * client may see), so server-only case fields never reach a response body.
 */

export const DEFAULT_REVIEWER = 'owner';

/** Study data root. STUDY_DIR wins; otherwise resolved relative to apps/web. */
export function studyDir(): string {
  const override = process.env.STUDY_DIR;
  if (override !== undefined && override.trim() !== '') {
    return path.resolve(override);
  }
  const cwd = process.cwd();
  const tail = `apps${path.sep}web`;
  if (cwd === tail || cwd.endsWith(tail)) {
    return path.resolve(cwd, '..', '..', 'evals', 'hierarchy', 'study');
  }
  return path.resolve(cwd, 'evals', 'hierarchy', 'study');
}

const REVIEWER_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

export function parseReviewerId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const id = value.trim();
  if (id === '' || !REVIEWER_RE.test(id)) return null;
  return id;
}

export function isTestReviewer(reviewerId: string): boolean {
  return reviewerId.startsWith('test-');
}

export function casesFile(dir: string = studyDir()): string {
  return path.join(dir, 'cases.json');
}

export function annotationsDir(reviewerId: string, dir: string = studyDir()): string {
  return isTestReviewer(reviewerId)
    ? path.join(dir, 'annotations', 'test')
    : path.join(dir, 'annotations');
}

export function liveFile(reviewerId: string, dir: string = studyDir()): string {
  return path.join(annotationsDir(reviewerId, dir), `${reviewerId}.json`);
}

/** Filesystem-safe UTC stamp, e.g. 20261103T120000Z. */
export function utcStamp(when: Date = new Date()): string {
  return when.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function snapshotFileName(reviewerId: string, stamp: string): string {
  return `${reviewerId}.final.${stamp}.json`;
}

export function resultsDir(dir: string = studyDir()): string {
  return path.join(dir, 'results');
}

// ---------------------------------------------------------------- cases ---

export interface StudyElement {
  id: string;
  role: string;
  label: string;
  preview: string;
}

export interface StudyCase {
  caseId: string;
  system: string;
  slide: Slide;
  elements: StudyElement[];
  [key: string]: unknown;
}

export interface CasesDoc {
  datasetVersion: string;
  seed: number;
  order: string[];
  cases: StudyCase[];
}

export async function readCases(): Promise<CasesDoc | null> {
  let raw: string;
  try {
    raw = await fs.readFile(casesFile(), 'utf8');
  } catch {
    return null;
  }
  let doc: unknown;
  try {
    doc = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof doc !== 'object' || doc === null) return null;
  const d = doc as Record<string, unknown>;
  if (typeof d.datasetVersion !== 'string' || typeof d.seed !== 'number') return null;
  if (!Array.isArray(d.order) || !Array.isArray(d.cases)) return null;
  return doc as CasesDoc;
}

/** The only case shape the client may receive. */
export interface PublicCase {
  caseId: string;
  slide: Slide;
  system: string;
  elements: StudyElement[];
}

export function toPublicCase(c: StudyCase): PublicCase {
  return {
    caseId: c.caseId,
    slide: c.slide,
    system: c.system,
    elements: (c.elements ?? []).map((e) => ({
      id: e.id,
      role: e.role,
      label: e.label,
      preview: e.preview,
    })),
  };
}

/** Ids a patch may reference: element ids plus rendered block ids. */
export function validBlockIds(c: StudyCase): Set<string> {
  const ids = new Set<string>();
  for (const e of c.elements ?? []) {
    if (typeof e.id === 'string') ids.add(e.id);
  }
  for (const b of c.slide?.blocks ?? []) {
    if (typeof b.id === 'string') ids.add(b.id);
  }
  return ids;
}

// ---------------------------------------------------------- annotations ---

export const PROBLEM_KINDS = [
  'none',
  'clip',
  'contrast',
  'emphasis',
  'grouping',
  'reading-order',
  'spacing',
  'other',
] as const;

export type ProblemKind = (typeof PROBLEM_KINDS)[number];

export interface ProblemEntry {
  type: ProblemKind;
  blockIds: string[];
  comment: string;
}

export interface Interpretation {
  mainMessage: string | null;
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
  interpretation: Interpretation;
  status: 'in-progress' | 'done';
  updatedAt: string;
}

export interface LiveDoc {
  reviewerId: string;
  datasetVersion: string;
  seed: number;
  annotations: Record<string, Annotation>;
  updatedAt: string;
}

export interface SnapshotDoc {
  reviewerId: string;
  datasetVersion: string;
  seed: number;
  finalizedAt: string;
  annotations: Record<string, Annotation>;
}

export function blankAnnotation(
  reviewerId: string,
  datasetVersion: string,
  seed: number,
  caseId: string,
  now: string,
): Annotation {
  return {
    reviewerId,
    datasetVersion,
    seed,
    caseId,
    firstFocus: null,
    ranking: [],
    groups: [],
    problems: [{ type: 'none', blockIds: [], comment: '' }],
    confidence: null,
    interpretation: { mainMessage: null, comment: '' },
    status: 'in-progress',
    updatedAt: now,
  };
}

/** Case done = firstFocus set + ranking non-empty + confidence set. */
export function isDone(a: Annotation | undefined): boolean {
  if (!a) return false;
  return (
    a.firstFocus !== null &&
    Array.isArray(a.ranking) &&
    a.ranking.length > 0 &&
    a.confidence !== null &&
    Number.isInteger(a.confidence) &&
    (a.confidence as number) >= 1 &&
    (a.confidence as number) <= 5
  );
}

export async function readLive(reviewerId: string): Promise<LiveDoc | null> {
  let raw: string;
  try {
    raw = await fs.readFile(liveFile(reviewerId), 'utf8');
  } catch {
    return null;
  }
  try {
    const doc = JSON.parse(raw) as LiveDoc;
    if (typeof doc !== 'object' || doc === null || typeof doc.annotations !== 'object') return null;
    return doc;
  } catch {
    return null;
  }
}

export async function writeLive(reviewerId: string, doc: LiveDoc): Promise<void> {
  await fs.mkdir(annotationsDir(reviewerId), { recursive: true });
  await fs.writeFile(liveFile(reviewerId), JSON.stringify(doc, null, 2) + '\n', 'utf8');
}

async function matchingFiles(dir: string, prefix: string): Promise<string[]> {
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return [];
  }
  return names.filter((n) => n.startsWith(prefix) && n.endsWith('.json')).sort();
}

export async function latestSnapshotName(reviewerId: string): Promise<string | null> {
  const names = await matchingFiles(annotationsDir(reviewerId), `${reviewerId}.final.`);
  return names.length > 0 ? names[names.length - 1] : null;
}

export async function readLatestSnapshot(reviewerId: string): Promise<SnapshotDoc | null> {
  const name = await latestSnapshotName(reviewerId);
  if (!name) return null;
  try {
    const raw = await fs.readFile(path.join(annotationsDir(reviewerId), name), 'utf8');
    return JSON.parse(raw) as SnapshotDoc;
  } catch {
    return null;
  }
}

/** Write a timestamped snapshot; never overwrites (suffixes on collision). */
export async function writeSnapshot(reviewerId: string, doc: SnapshotDoc): Promise<string> {
  const dir = annotationsDir(reviewerId);
  await fs.mkdir(dir, { recursive: true });
  const stamp = utcStamp();
  let name = snapshotFileName(reviewerId, stamp);
  for (let i = 2; i < 100; i += 1) {
    try {
      await fs.access(path.join(dir, name));
      name = snapshotFileName(reviewerId, `${stamp}-${i}`);
    } catch {
      break;
    }
  }
  await fs.writeFile(path.join(dir, name), JSON.stringify(doc, null, 2) + '\n', 'utf8');
  return name;
}

export async function latestResultsName(reviewerId: string): Promise<string | null> {
  const names = await matchingFiles(resultsDir(), `${reviewerId}.`);
  return names.length > 0 ? names[names.length - 1] : null;
}

// --------------------------------------------------------------- patch ---

export interface AnnotatePatch {
  firstFocus?: string | null;
  ranking?: string[][];
  groups?: string[][];
  problems?: ProblemEntry[];
  confidence?: number | null;
  interpretation?: { mainMessage?: string | null; comment?: string };
  status?: 'in-progress' | 'done';
}

function isIdList(value: unknown, valid: Set<string>): value is string[][] {
  if (!Array.isArray(value)) return false;
  for (const tier of value) {
    if (!Array.isArray(tier) || tier.length === 0) return false;
    for (const id of tier) {
      if (typeof id !== 'string' || !valid.has(id)) return false;
    }
  }
  return true;
}

export function validatePatch(
  patch: unknown,
  valid: Set<string>,
): { patch: AnnotatePatch } | { error: string } {
  if (typeof patch !== 'object' || patch === null || Array.isArray(patch)) {
    return { error: 'patch must be an object' };
  }
  const p = patch as Record<string, unknown>;
  const out: AnnotatePatch = {};
  if (p.firstFocus !== undefined) {
    if (p.firstFocus !== null && (typeof p.firstFocus !== 'string' || !valid.has(p.firstFocus))) {
      return { error: 'firstFocus must be a block id of this case or null' };
    }
    out.firstFocus = p.firstFocus as string | null;
  }
  if (p.ranking !== undefined) {
    if (!isIdList(p.ranking, valid)) {
      return { error: 'ranking must be non-empty tiers of block ids of this case' };
    }
    out.ranking = p.ranking;
  }
  if (p.groups !== undefined) {
    if (!isIdList(p.groups, valid)) {
      return { error: 'groups must be non-empty lists of block ids of this case' };
    }
    out.groups = p.groups;
  }
  if (p.problems !== undefined) {
    if (!Array.isArray(p.problems)) return { error: 'problems must be an array' };
    const entries: ProblemEntry[] = [];
    for (const e of p.problems) {
      if (typeof e !== 'object' || e === null) return { error: 'problem entries must be objects' };
      const r = e as Record<string, unknown>;
      if (typeof r.type !== 'string' || !(PROBLEM_KINDS as readonly string[]).includes(r.type)) {
        return { error: 'problem type is not one of the known kinds' };
      }
      if (!Array.isArray(r.blockIds)) return { error: 'problem blockIds must be an array' };
      for (const id of r.blockIds) {
        if (typeof id !== 'string' || !valid.has(id)) {
          return { error: 'problem blockIds must be block ids of this case' };
        }
      }
      if (typeof r.comment !== 'string' || r.comment.length > 2000) {
        return { error: 'problem comment must be a string of at most 2000 chars' };
      }
      entries.push({ type: r.type as ProblemKind, blockIds: r.blockIds as string[], comment: r.comment });
    }
    out.problems = entries;
  }
  if (p.confidence !== undefined) {
    if (p.confidence !== null && (!Number.isInteger(p.confidence) || (p.confidence as number) < 1 || (p.confidence as number) > 5)) {
      return { error: 'confidence must be an integer 1-5 or null' };
    }
    out.confidence = p.confidence as number | null;
  }
  if (p.interpretation !== undefined) {
    if (typeof p.interpretation !== 'object' || p.interpretation === null) {
      return { error: 'interpretation must be an object' };
    }
    const r = p.interpretation as Record<string, unknown>;
    const interp: { mainMessage?: string | null; comment?: string } = {};
    if (r.mainMessage !== undefined) {
      if (r.mainMessage !== null && (typeof r.mainMessage !== 'string' || !valid.has(r.mainMessage))) {
        return { error: 'interpretation.mainMessage must be a block id of this case or null' };
      }
      interp.mainMessage = r.mainMessage as string | null;
    }
    if (r.comment !== undefined) {
      if (typeof r.comment !== 'string' || r.comment.length > 2000) {
        return { error: 'interpretation.comment must be a string of at most 2000 chars' };
      }
      interp.comment = r.comment;
    }
    out.interpretation = interp;
  }
  if (p.status !== undefined) {
    if (p.status !== 'in-progress' && p.status !== 'done') {
      return { error: 'status must be in-progress or done' };
    }
    out.status = p.status;
  }
  return { patch: out };
}

export function applyPatch(base: Annotation, patch: AnnotatePatch, now: string): Annotation {
  return {
    ...base,
    ...(patch.firstFocus !== undefined ? { firstFocus: patch.firstFocus } : {}),
    ...(patch.ranking !== undefined ? { ranking: patch.ranking } : {}),
    ...(patch.groups !== undefined ? { groups: patch.groups } : {}),
    ...(patch.problems !== undefined ? { problems: patch.problems } : {}),
    ...(patch.confidence !== undefined ? { confidence: patch.confidence } : {}),
    ...(patch.interpretation !== undefined
      ? { interpretation: { ...base.interpretation, ...patch.interpretation } }
      : {}),
    ...(patch.status !== undefined ? { status: patch.status } : {}),
    updatedAt: now,
  };
}

// ----------------------------------------------------------------- csv ---

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function snapshotToCsv(doc: SnapshotDoc): string {
  const header = [
    'reviewerId',
    'caseId',
    'firstFocus',
    'ranking',
    'groups',
    'problems',
    'confidence',
    'mainMessage',
    'interpretationComment',
    'status',
    'updatedAt',
  ];
  const lines = [header.join(',')];
  const ids = Object.keys(doc.annotations).sort();
  for (const caseId of ids) {
    const a = doc.annotations[caseId];
    const rank = a.ranking.map((tier) => tier.join('+')).join('>');
    const groups = a.groups.map((g) => g.join('+')).join(';');
    const problems = a.problems
      .map((e) => `${e.type}${e.blockIds.length > 0 ? `@${e.blockIds.join('+')}` : ''}${e.comment !== '' ? `:${e.comment}` : ''}`)
      .join(';');
    lines.push(
      [
        doc.reviewerId,
        a.caseId,
        a.firstFocus ?? '',
        rank,
        groups,
        problems,
        a.confidence === null ? '' : String(a.confidence),
        a.interpretation.mainMessage ?? '',
        a.interpretation.comment,
        a.status,
        a.updatedAt,
      ]
        .map(csvCell)
        .join(','),
    );
  }
  return lines.join('\n') + '\n';
}

// -------------------------------------------------------------- errors ---

export function jsonError(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>,
): Response {
  return Response.json({ error: { code, message, ...extra } }, { status });
}
