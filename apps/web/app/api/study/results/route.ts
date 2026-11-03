import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest } from 'next/server';
import {
  DEFAULT_REVIEWER,
  jsonError,
  latestResultsName,
  parseReviewerId,
  resultsDir,
} from '../_lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<Response> {
  const params = req.nextUrl.searchParams;
  const reviewerId = parseReviewerId(params.get('reviewerId') ?? DEFAULT_REVIEWER);
  if (!reviewerId) {
    return jsonError(400, 'invalid-reviewer', 'reviewerId is missing or malformed');
  }
  const name = await latestResultsName(reviewerId);
  if (!name) {
    return jsonError(404, 'no-results', 'no evaluation results for this reviewer yet');
  }
  let raw: string;
  try {
    raw = await fs.readFile(path.join(resultsDir(), name), 'utf8');
  } catch {
    return jsonError(404, 'no-results', 'no evaluation results for this reviewer yet');
  }
  try {
    return Response.json(JSON.parse(raw));
  } catch {
    return jsonError(500, 'results-corrupt', 'stored results file is not valid JSON');
  }
}
