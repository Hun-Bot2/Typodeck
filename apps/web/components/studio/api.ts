import { STAGES, type GenerateResult, type Stage, type TypedError } from './types';

export interface GenerateSelection {
  sha?: string | null;
  excluded?: string[];
  reframed?: Array<{ id: string; text: string }>;
}

export interface GenerateBody {
  mode: string;
  input: string;
  purpose: string;
  lang: string;
  durationMin?: number;
  selection?: GenerateSelection;
}

/** Normalize any thrown/parsed error payload into a TypedError. */
export function toTypedError(err: unknown, fallbackCode: string, fallbackMessage: string): TypedError {
  if (err !== null && typeof err === 'object' && 'code' in err && 'message' in err) {
    const e = err as Partial<TypedError>;
    return {
      code: typeof e.code === 'string' ? e.code : fallbackCode,
      message: typeof e.message === 'string' ? e.message : fallbackMessage,
      ...(typeof e.resetAt === 'string' ? { resetAt: e.resetAt } : {}),
      ...(typeof e.retryAfterMs === 'number' ? { retryAfterMs: e.retryAfterMs } : {}),
    };
  }
  return { code: fallbackCode, message: fallbackMessage };
}

/**
 * POST /api/generate over SSE: streams `stage` progress frames, then resolves
 * with the `result` payload or rejects with the server's TypedError.
 */
export async function postGenerate(body: GenerateBody, onStage: (stage: Stage) => void): Promise<GenerateResult> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify(body),
  });
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/event-stream')) {
    const data = (await res.json().catch(() => null)) as { error?: TypedError } | null;
    throw toTypedError(
      data?.error
        ? { ...data.error, code: data.error.code ?? `http-${res.status}` }
        : { code: `http-${res.status}`, message: res.statusText },
      `http-${res.status}`,
      res.statusText,
    );
  }
  const reader = res.body?.getReader();
  if (!reader) throw { code: 'network', message: 'empty response stream' } satisfies TypedError;
  const decoder = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf('\n\n')) >= 0) {
      const raw = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      let event = 'message';
      let data = '';
      for (const line of raw.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data += line.slice(5).trim();
      }
      if (event === 'stage') {
        try {
          const s = JSON.parse(data) as { stage: Stage };
          if ((STAGES as readonly string[]).includes(s.stage)) onStage(s.stage);
        } catch {
          /* ignore malformed progress frames */
        }
      } else if (event === 'result') {
        return JSON.parse(data) as GenerateResult;
      } else if (event === 'error') {
        const e = JSON.parse(data) as TypedError;
        throw toTypedError(
          e,
          e.code ?? 'internal',
          e.message ?? 'generation failed',
        );
      }
    }
  }
  throw { code: 'internal', message: 'stream ended without a result' } satisfies TypedError;
}
