import { NextRequest } from 'next/server';
import {
  EXTENDED_DIMENSIONS,
  IngestionError,
  getPreset,
  narrativeToSlideIR,
  parsePurpose,
  parseRepoInput,
  planDecksAll,
  serializeSlideMarkdown,
  type Dimension,
  type EvidenceSelection,
} from '@typodeck/core';
import { githubResponseCache, githubToken } from '@/lib/github-cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** Request body cap (~64 KB per the Phase 3 contract). */
const BODY_CAP_BYTES = 64 * 1024;
/** Whole-request bound so the route never hangs past ~120 s. */
const REQUEST_TIMEOUT_MS = 115_000;
/** Bound for the GitHub fetch inside the pipeline (core default is 30 s). */
const REPO_TIMEOUT_MS = 60_000;

const LEGACY_PURPOSES = new Set(['hackathon', 'competition', 'showcase']);
const VARIANTS = new Set(['short', 'standard', 'extended']);

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
  if (err instanceof Error && err.message === 'typodeck-request-timeout') {
    return jsonError(504, 'timeout', 'generation exceeded 115s and was aborted');
  }
  return jsonError(500, 'internal', err instanceof Error ? err.message : String(err));
}

interface GenerateBody {
  mode?: unknown;
  input?: unknown;
  purpose?: unknown;
  lang?: unknown;
  variant?: unknown;
  durationMin?: unknown;
  emphasis?: unknown;
  selection?: unknown;
}

/** Strict validation for the inspector's evidence review (never trusted blindly). */
function parseSelection(value: unknown): EvidenceSelection | undefined {
  if (value === undefined) return undefined;
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('selection must be an object');
  }
  const v = value as Record<string, unknown>;
  const out: EvidenceSelection = {};
  if (v.sha !== undefined) {
    if (v.sha !== null && typeof v.sha !== 'string') throw new Error('selection.sha must be a string or null');
    if (typeof v.sha === 'string' && (v.sha.length === 0 || v.sha.length > 100)) {
      throw new Error('selection.sha must be 1–100 chars or null');
    }
    out.sha = v.sha;
  }
  if (v.excluded !== undefined) {
    if (!Array.isArray(v.excluded) || v.excluded.length > 100) {
      throw new Error('selection.excluded must be an array of ≤100 claim ids');
    }
    for (const id of v.excluded) {
      if (typeof id !== 'string' || !/^c\d{1,4}$/.test(id)) {
        throw new Error('selection.excluded must contain claim ids like "c12"');
      }
    }
    out.excluded = v.excluded as string[];
  }
  if (v.reframed !== undefined) {
    if (!Array.isArray(v.reframed) || v.reframed.length > 100) {
      throw new Error('selection.reframed must be an array of ≤100 edits');
    }
    for (const r of v.reframed) {
      if (r === null || typeof r !== 'object' || Array.isArray(r)) {
        throw new Error('selection.reframed entries must be {id, text} objects');
      }
      const { id, text } = r as Record<string, unknown>;
      if (typeof id !== 'string' || !/^c\d{1,4}$/.test(id)) {
        throw new Error('selection.reframed entries need a claim id like "c12"');
      }
      if (typeof text !== 'string' || text.length === 0 || text.length > 1000) {
        throw new Error('selection.reframed text must be 1–1000 chars');
      }
    }
    out.reframed = v.reframed as Array<{ id: string; text: string }>;
  }
  return out;
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
      ? parsed.purpose.trim().slice(0, 80)
      : '';
  // Legacy audiences, preset ids (P01–P10, bare or "P04: Title"), and custom
  // titles all flow through; only malformed preset ids are rejected here.
  if (purpose !== '') {
    const resolved = parsePurpose(purpose);
    if (resolved.preset) {
      try {
        getPreset(resolved.preset);
      } catch {
        return jsonError(400, 'invalid-input', `unknown purpose preset "${resolved.preset}" (want P01–P10)`);
      }
    }
    // Anything else ("audience: title", free text) passes through to core parsing.
  }
  const lang = typeof parsed.lang === 'string' && parsed.lang.toLowerCase().startsWith('ko') ? 'ko' : 'en';
  const variant =
    typeof parsed.variant === 'string' && VARIANTS.has(parsed.variant) ? parsed.variant : undefined;
  if (parsed.variant !== undefined && variant === undefined) {
    return jsonError(400, 'invalid-input', 'variant must be short, standard, or extended');
  }
  const durationMin =
    typeof parsed.durationMin === 'number' && Number.isFinite(parsed.durationMin)
      ? Math.max(1, Math.min(180, Math.floor(parsed.durationMin)))
      : undefined;
  if (parsed.durationMin !== undefined && durationMin === undefined) {
    return jsonError(400, 'invalid-input', 'durationMin must be a number of minutes');
  }
  const emphasis =
    Array.isArray(parsed.emphasis) &&
    parsed.emphasis.every((e) => typeof e === 'string' && (EXTENDED_DIMENSIONS as readonly string[]).includes(e))
      ? (parsed.emphasis as string[])
      : undefined;
  if (parsed.emphasis !== undefined && emphasis === undefined) {
    return jsonError(400, 'invalid-input', 'emphasis must be an array of dimension ids');
  }

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
  let selection: EvidenceSelection | undefined;
  try {
    selection = parseSelection(parsed.selection);
  } catch (err) {
    return jsonError(400, 'invalid-input', err instanceof Error ? err.message : String(err));
  }

  const run = async (onStage?: (stage: string, detail?: string) => void) => {
    const raced = (async () => {
      const result = await planDecksAll(
        planInput,
        {
          purpose,
          lang,
          timeoutMs: REPO_TIMEOUT_MS,
          authToken: githubToken(),
          cache: githubResponseCache(),
          selection,
          variant: variant as 'short' | 'standard' | 'extended' | undefined,
          durationMin,
          emphasis: emphasis as Dimension[] | undefined,
        },
        onStage ? (stage, detail) => onStage(stage, detail) : undefined,
      );
      // Claims/raw files stay server-side; the client needs decks + provenance.
      // Slide Markdown is included so the narrative step can display and edit it.
      const parsed = parsePurpose(purpose);
      const slideMarkdown = serializeSlideMarkdown(
        narrativeToSlideIR(result.narrative, result.claims, { preset: parsed.preset }),
      );
      const source =
        result.ingested.kind === 'repo'
          ? {
              kind: 'repo' as const,
              owner: result.ingested.owner,
              repo: result.ingested.repo,
              branch: result.ingested.branch,
              sha: result.ingested.sha,
            }
          : { kind: 'idea' as const };
      return { narrative: result.narrative, decks: result.decks, provenance: result.provenance, slideMarkdown, source };
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
