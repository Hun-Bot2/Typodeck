import { NextRequest } from 'next/server';
import {
  DEFAULT_REVIEWER,
  jsonError,
  latestSnapshotName,
  parseReviewerId,
  readLatestSnapshot,
  snapshotToCsv,
} from '../_lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<Response> {
  const params = req.nextUrl.searchParams;
  const reviewerId = parseReviewerId(params.get('reviewerId') ?? DEFAULT_REVIEWER);
  if (!reviewerId) {
    return jsonError(400, 'invalid-reviewer', 'reviewerId is missing or malformed');
  }
  const format = params.get('format') ?? 'json';
  if (format !== 'json' && format !== 'csv') {
    return jsonError(400, 'invalid-format', 'format must be json or csv');
  }
  const snapshot = await readLatestSnapshot(reviewerId);
  if (!snapshot) {
    return jsonError(404, 'no-snapshot', 'no finalized snapshot for this reviewer yet');
  }
  const base = (await latestSnapshotName(reviewerId)) ?? `${reviewerId}.final.json`;
  if (format === 'csv') {
    return new Response(snapshotToCsv(snapshot), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${base}.csv"`,
      },
    });
  }
  return new Response(JSON.stringify(snapshot, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${base}"`,
    },
  });
}
