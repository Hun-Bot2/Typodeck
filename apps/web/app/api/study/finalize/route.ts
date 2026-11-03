import { NextRequest } from 'next/server';
import {
  activeOrder,
  isDone,
  jsonError,
  parseReviewerId,
  readCases,
  readLive,
  writeSnapshot,
} from '../_lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
  let body: { reviewerId?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return jsonError(400, 'invalid-input', 'request body is not valid JSON');
  }
  const reviewerId = parseReviewerId(body.reviewerId);
  if (!reviewerId) {
    return jsonError(400, 'invalid-reviewer', 'reviewerId is missing or malformed');
  }
  const doc = await readCases();
  if (!doc) {
    return jsonError(503, 'not-ready', 'case data is not available yet');
  }
  const live = await readLive(reviewerId);
  const annotations = live?.annotations ?? {};
  const missing = activeOrder(doc).filter((caseId) => !isDone(annotations[caseId]));
  if (missing.length > 0) {
    return jsonError(422, 'incomplete', `${missing.length} case(s) still need responses`, { missing });
  }
  for (const caseId of activeOrder(doc)) {
    const ann = annotations[caseId];
    if (ann.problems.length === 0) {
      ann.problems = [{ type: 'none', blockIds: [], comment: '' }];
    }
    ann.status = 'done';
  }
  const name = await writeSnapshot(reviewerId, {
    reviewerId,
    datasetVersion: doc.datasetVersion,
    seed: doc.seed,
    finalizedAt: new Date().toISOString(),
    annotations,
  });
  return Response.json({ snapshot: name });
}
