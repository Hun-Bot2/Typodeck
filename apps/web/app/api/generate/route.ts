import { NextRequest } from 'next/server';
import { IngestionError, planDecksAll } from '@typodeck/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** Request body cap (~64 KB per the Phase 3 contract). */
const BODY_CAP_BYTES = 64 * 1024;
/** Whole-request bound so the route never hangs past ~120 s. */
const REQUEST_TIMEOUT_MS = 115_000;
/** Bound for the GitHub fetch inside the pipeline (core default is 30 s). */
const REPO_TIMEOUT_MS = 60_000;

const PURPOSES = new Set(['hackathon', 'competition', 'showcase']);

function jsonError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status });
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
    return jsonError(status, err.code, err.message);
  }
  if (err instanceof Error && err.message === 'typodeck-request-timeout') {
    return jsonError(504, 'timeout', 'generation exceeded 115s and was aborted');
  }
  return jsonError(500, 'internal', err instanceof Error ? err.message : String(err));
}

/** Accept `owner/repo` or a full `github.com/owner/repo` URL (with .git, branch paths, queries). */
export function parseRepoInput(input: string): { owner: string; repo: string } | null {
  const t = input.trim();
  const url = t.match(/^https?:\/\/(?:www\.)?github\.com\/([^/\s?#]+)\/([^/\s?#]+?)(?:\.git)?(?:[/?#].*)?$/i);
  if (url) return { owner: url[1], repo: url[2] };
  const short = t.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
  if (short) return { owner: short[1], repo: short[2] };
  return null;
}

interface GenerateBody {
  mode?: unknown;
  input?: unknown;
  purpose?: unknown;
  lang?: unknown;
}

export async function POST(req: NextRequest): Promise<Response> {
  const contentLength = req.headers.get('content-length');
  if (contentLength !== null && Number(contentLength) > BODY_CAP_BYTES) {
    return jsonError(413, 'body-too-large', `request body exceeds the ${BODY_CAP_BYTES}-byte cap`);
  }
  const raw = await req.text();
  if (Buffer.byteLength(raw, 'utf8') > BODY_CAP_BYTES) {
    return jsonError(413, 'body-too-large', `request body exceeds the ${BODY_CAP_BYTES}-byte cap`);
  }
  let parsed: GenerateBody;
  try {
    parsed = (JSON.parse(raw) || {}) as GenerateBody;
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
  const purpose =
    typeof parsed.purpose === 'string' && parsed.purpose.trim() !== ''
      ? parsed.purpose.trim().slice(0, 64)
      : '';
  if (purpose !== '' && !PURPOSES.has(purpose)) {
    return jsonError(400, 'invalid-input', 'purpose must be hackathon, competition, or showcase');
  }
  const lang = typeof parsed.lang === 'string' && parsed.lang.toLowerCase().startsWith('ko') ? 'ko' : 'en';

  const planInput =
    mode === 'repo'
      ? (() => {
          const repo = parseRepoInput(input);
          if (!repo) {
            return null;
          }
          return { type: 'repo' as const, owner: repo.owner, repo: repo.repo };
        })()
      : { type: 'idea' as const, text: input };
  if (planInput === null) {
    return jsonError(
      400,
      'invalid-input',
      'repo input must be "owner/repo" or a public github.com URL',
    );
  }

  const run = async (onStage?: (stage: string, detail?: string) => void) => {
    const raced = (async () => {
      const result = await planDecksAll(
        planInput,
        { purpose, lang, timeoutMs: REPO_TIMEOUT_MS },
        onStage ? (stage, detail) => onStage(stage, detail) : undefined,
      );
      // Claims/raw files stay server-side; the client needs decks + provenance.
      return { narrative: result.narrative, decks: result.decks, provenance: result.provenance };
    })();
    const timer = new Promise<never>((_resolve, reject) => {
      setTimeout(() => reject(new Error('typodeck-request-timeout')), REQUEST_TIMEOUT_MS);
    });
    return Promise.race([raced, timer]);
  };

  // SSE variant: real server progress (ingest -> evidence -> narrative -> layout).
  if (req.headers.get('accept')?.includes('text/event-stream')) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: string, data: unknown): void => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };
        try {
          const payload = await run((stage, detail) => send('stage', { stage, detail }));
          send('result', payload);
        } catch (err) {
          const res = toErrorResponse(err);
          const body = (await res.json()) as { error: { code: string; message: string } };
          send('error', { ...body.error, status: res.status });
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  }

  try {
    return Response.json(await run());
  } catch (err) {
    return toErrorResponse(err);
  }
}
