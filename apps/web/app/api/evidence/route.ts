import { NextRequest } from 'next/server';
import {
  IngestionError,
  acceptIdea,
  displayStatus,
  extractClaims,
  fetchRepo,
  githubBlobUrl,
  parseRepoInput,
  type Claim,
  type Ingested,
} from '@typodeck/core';
import { githubResponseCache, githubToken } from '@/lib/github-cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** Request body cap (~64 KB, same contract as /api/generate). */
const BODY_CAP_BYTES = 64 * 1024;
/** Bound for the GitHub fetch inside the handler (core default is 30 s). */
const REPO_TIMEOUT_MS = 60_000;

function jsonError(status: number, code: string, message: string, extra?: Record<string, unknown>): Response {
  return Response.json({ error: { code, message, ...extra } }, { status });
}

function toErrorResponse(err: unknown): Response {
  if (err instanceof IngestionError) {
    const status =
      err.code === 'not-found'
        ? 404
        : err.code === 'rate-limited'
          ? 429
          : err.code === 'private-repo'
            ? 403
            : err.code === 'timeout'
              ? 504
              : err.code === 'too-large'
                ? 413
                : err.code === 'network'
                  ? 502
                  : 400;
    return jsonError(status, err.code, err.message, err.rateLimit ? { ...err.rateLimit } : undefined);
  }
  return jsonError(500, 'internal', err instanceof Error ? err.message : String(err));
}

interface EvidenceBody {
  mode?: unknown;
  input?: unknown;
}

interface EvidenceClaim {
  id: string;
  text: string;
  kind: Claim['kind'];
  status: ReturnType<typeof displayStatus>;
  refs: Claim['refs'];
  numbers: string[];
  /** Deep link to the first ref's line range; null for idea mode. */
  url: string | null;
}

/**
 * Inspect verified project evidence without generating a deck: ingested
 * files plus every extracted claim with grounding, lifecycle status,
 * refs, and a deep link to the exact source lines. Powers the Evidence
 * Inspector step that precedes generation.
 */
export async function POST(req: NextRequest): Promise<Response> {
  const contentLength = req.headers.get('content-length');
  if (contentLength !== null && Number(contentLength) > BODY_CAP_BYTES) {
    return jsonError(413, 'body-too-large', `request body exceeds the ${BODY_CAP_BYTES}-byte cap`);
  }
  const raw = await req.text();
  if (Buffer.byteLength(raw, 'utf8') > BODY_CAP_BYTES) {
    return jsonError(413, 'body-too-large', `request body exceeds the ${BODY_CAP_BYTES}-byte cap`);
  }
  let parsed: EvidenceBody;
  try {
    parsed = (JSON.parse(raw) || {}) as EvidenceBody;
  } catch {
    return jsonError(400, 'invalid-input', 'request body is not valid JSON');
  }

  const mode = parsed.mode;
  const input = typeof parsed.input === 'string' ? parsed.input : '';
  if (mode !== 'idea' && mode !== 'repo') {
    return jsonError(400, 'invalid-input', 'mode must be "idea" or "repo"');
  }
  if (input.trim() === '') {
    return jsonError(400, 'invalid-input', 'input must be a non-empty string');
  }

  let ingested: Ingested;
  try {
    if (mode === 'repo') {
      const repo = parseRepoInput(input);
      if (!repo) {
        return jsonError(400, 'invalid-input', 'repo input must be "owner/repo" or a public github.com URL');
      }
      ingested = await fetchRepo(repo.owner, repo.repo, {
        timeoutMs: REPO_TIMEOUT_MS,
        authToken: githubToken(),
        cache: githubResponseCache(),
      });
    } else {
      ingested = acceptIdea(input);
    }
  } catch (err) {
    return toErrorResponse(err);
  }

  const claims = extractClaims(ingested);
  const repoCtx = ingested.kind === 'repo' ? ingested : null;
  const out: EvidenceClaim[] = claims.map((c) => ({
    id: c.id,
    text: c.text,
    kind: c.kind,
    status: displayStatus(c),
    refs: c.refs,
    numbers: c.numbers,
    url:
      repoCtx && c.refs.length > 0
        ? githubBlobUrl(repoCtx.owner, repoCtx.repo, repoCtx.branch, c.refs[0].path, c.refs[0].lines)
        : null,
  }));

  return Response.json({
    source:
      ingested.kind === 'repo'
        ? { kind: 'repo', owner: ingested.owner, repo: ingested.repo, branch: ingested.branch, sha: ingested.sha }
        : { kind: 'idea' },
    files: ingested.files.map((f) => ({ path: f.path, lines: f.lines, bytes: f.bytes, truncated: f.truncated })),
    claims: out,
    counts: {
      total: claims.length,
      verified: claims.filter((c) => c.kind === 'verified').length,
      suggestion: claims.filter((c) => c.kind === 'suggestion').length,
      ungrounded: claims.filter((c) => c.kind === 'ungrounded').length,
    },
    warnings: ingested.warnings,
    degraded: ingested.kind === 'repo' ? ingested.degraded : false,
    ...(ingested.kind === 'repo' && ingested.requests ? { requests: ingested.requests } : {}),
  });
}
