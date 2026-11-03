import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { NextRequest } from 'next/server';
import {
  annotationsDir,
  casesFile,
  jsonError,
  latestSnapshotName,
  parseReviewerId,
  readCases,
  resultsDir,
  studyDir,
  utcStamp,
} from '../_lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const execFileAsync = promisify(execFile);

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
  const snapshot = await latestSnapshotName(reviewerId);
  if (!snapshot) {
    return jsonError(404, 'no-snapshot', 'finalize before running the evaluation');
  }
  const dir = studyDir();
  const runner = path.join(dir, 'run-eval.mjs');
  try {
    await fs.access(runner);
  } catch {
    return jsonError(503, 'runner-missing', 'evaluation runner is not installed yet');
  }
  await fs.mkdir(resultsDir(dir), { recursive: true });
  const outName = `${reviewerId}.${utcStamp()}.json`;
  const outPath = path.join(resultsDir(dir), outName);
  let stdout: string;
  try {
    const res = await execFileAsync(
      process.execPath,
      [
        runner,
        '--reviewer',
        reviewerId,
        '--cases',
        casesFile(dir),
        '--annotations',
        path.join(annotationsDir(reviewerId, dir), snapshot),
        '--out',
        outPath,
      ],
      { timeout: 280000, maxBuffer: 8 * 1024 * 1024 },
    );
    stdout = res.stdout;
  } catch (err) {
    const e = err as { code?: number | string; stderr?: string };
    const reason = typeof e.stderr === 'string' && e.stderr.trim() !== '' ? e.stderr.trim() : 'runner failed';
    if (e.code === 2) {
      return jsonError(422, 'eval-rejected', reason);
    }
    return jsonError(500, 'eval-failed', reason);
  }
  let summary: unknown = null;
  try {
    const lastLine = stdout.trim().split('\n').pop() ?? '';
    summary = JSON.parse(lastLine);
  } catch {
    summary = null;
  }
  return Response.json({ ok: true, summary, resultsFile: outName });
}
