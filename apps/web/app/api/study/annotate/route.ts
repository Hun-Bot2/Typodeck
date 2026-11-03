import { NextRequest } from 'next/server';
import {
  applyPatch,
  blankAnnotation,
  isExcludedCase,
  jsonError,
  parseReviewerId,
  readCases,
  readLive,
  validBlockIds,
  validatePatch,
  writeLive,
} from '../_lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BODY_CAP_BYTES = 256 * 1024;

export async function POST(req: NextRequest): Promise<Response> {
  const raw = await req.text();
  if (Buffer.byteLength(raw, 'utf8') > BODY_CAP_BYTES) {
    return jsonError(413, 'body-too-large', `request body caps at ${BODY_CAP_BYTES} bytes`);
  }
  let body: { reviewerId?: unknown; caseId?: unknown; patch?: unknown };
  try {
    body = (JSON.parse(raw) || {}) as typeof body;
  } catch {
    return jsonError(400, 'invalid-input', 'request body is not valid JSON');
  }
  const reviewerId = parseReviewerId(body.reviewerId);
  if (!reviewerId) {
    return jsonError(400, 'invalid-reviewer', 'reviewerId is missing or malformed');
  }
  if (typeof body.caseId !== 'string' || body.caseId.trim() === '') {
    return jsonError(400, 'invalid-case', 'caseId is missing or malformed');
  }
  const doc = await readCases();
  if (!doc) {
    return jsonError(503, 'not-ready', 'case data is not available yet');
  }
  const studyCase = doc.cases.find((c) => c.caseId === body.caseId);
  if (!studyCase) {
    return jsonError(404, 'unknown-case', `no case "${body.caseId}" in this dataset`);
  }
  if (isExcludedCase(studyCase)) {
    return jsonError(410, 'case-excluded', `case "${body.caseId}" was excluded from annotation`);
  }
  const checked = validatePatch(body.patch, validBlockIds(studyCase));
  if ('error' in checked) {
    return jsonError(400, 'invalid-patch', checked.error);
  }
  const now = new Date().toISOString();
  const live = (await readLive(reviewerId)) ?? {
    reviewerId,
    datasetVersion: doc.datasetVersion,
    seed: doc.seed,
    annotations: {},
    updatedAt: now,
  };
  const base =
    live.annotations[studyCase.caseId] ??
    blankAnnotation(reviewerId, doc.datasetVersion, doc.seed, studyCase.caseId, now);
  live.annotations[studyCase.caseId] = applyPatch(base, checked.patch, now);
  live.updatedAt = now;
  await writeLive(reviewerId, live);
  return Response.json({ ok: true, updatedAt: now });
}
