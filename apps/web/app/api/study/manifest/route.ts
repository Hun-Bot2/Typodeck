import { NextRequest } from 'next/server';
import {
  DEFAULT_REVIEWER,
  activeCases,
  activeOrder,
  jsonError,
  parseReviewerId,
  readCases,
  toPublicCase,
} from '../_lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<Response> {
  const params = req.nextUrl.searchParams;
  const reviewerId = parseReviewerId(
    params.get('reviewer') ?? params.get('reviewerId') ?? DEFAULT_REVIEWER,
  );
  if (!reviewerId) {
    return jsonError(400, 'invalid-reviewer', 'reviewer id uses letters, digits, dot, underscore, hyphen (max 64)');
  }
  const doc = await readCases();
  if (!doc) {
    return jsonError(503, 'not-ready', 'case data is not available yet');
  }
  return Response.json({
    reviewerId,
    datasetVersion: doc.datasetVersion,
    seed: doc.seed,
    order: activeOrder(doc),
    total: activeOrder(doc).length,
    cases: activeCases(doc).map(toPublicCase),
  });
}
