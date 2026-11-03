import { NextRequest } from 'next/server';
import {
  DEFAULT_REVIEWER,
  isDone,
  jsonError,
  parseReviewerId,
  readLive,
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
  const live = await readLive(reviewerId);
  const annotations = live?.annotations ?? {};
  const done = Object.values(annotations).filter(isDone).length;
  return Response.json({ annotations, done });
}
