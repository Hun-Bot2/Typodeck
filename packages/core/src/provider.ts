// Typodeck Phase 2 — model-provider abstraction.
// ModelProvider { complete(prompt, schemaHint) } with MetaMuseProvider
// (primary, env-gated) and DeterministicFallback (template-based, labeled).
// See docs/MUSE_PROVIDER.md for the public-endpoint investigation finding.

/** Metadata attached to every completion. Never contains secrets. */
export interface CompletionMeta {
  provider: string;
  [key: string]: unknown;
}

export interface CompletionResult {
  text: string;
  meta: CompletionMeta;
}

export interface ModelProvider {
  readonly id: string;
  complete(prompt: string, schemaHint?: string): Promise<CompletionResult>;
}

export const MUSE_ENDPOINT_ENV = 'TYPOdeck_MUSE_ENDPOINT';
export const MUSE_API_KEY_ENV = 'TYPOdeck_MUSE_API_KEY';

export interface MetaMuseProviderOptions {
  endpoint: string;
  apiKey: string;
  model?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

/**
 * Primary provider: POSTs an OpenAI-compatible chat-completions request to a
 * configured endpoint. ONLY constructed with an explicit endpoint + key
 * (see resolveProvider: both env vars must be set). The key is sent as a
 * Bearer token and never appears in meta, logs, or errors.
 */
export class MetaMuseProvider implements ModelProvider {
  readonly id = 'muse';
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: MetaMuseProviderOptions) {
    if (!opts.endpoint || !opts.apiKey) {
      throw new Error('MetaMuseProvider requires both endpoint and apiKey');
    }
    this.endpoint = opts.endpoint;
    this.apiKey = opts.apiKey;
    this.model = opts.model ?? 'muse-spark';
    this.timeoutMs = opts.timeoutMs ?? 30000;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  /** Endpoint host for meta records — never the key or full URL with secret. */
  endpointHost(): string {
    try {
      return new URL(this.endpoint).host;
    } catch {
      return 'unparseable-endpoint';
    }
  }

  async complete(prompt: string, schemaHint?: string): Promise<CompletionResult> {
    const started = Date.now();
    const userContent = schemaHint ? `${prompt}\n\nRespond conforming to this schema hint:\n${schemaHint}` : prompt;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await this.fetchImpl(this.endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: userContent }],
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        throw new Error(`muse provider HTTP ${res.status} from ${this.endpointHost()}`);
      }
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content;
      if (typeof text !== 'string' || text.length === 0) {
        throw new Error(`muse provider returned no text from ${this.endpointHost()}`);
      }
      return {
        text,
        meta: {
          provider: 'muse',
          endpoint: this.endpointHost(),
          model: this.model,
          latencyMs: Date.now() - started,
        },
      };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`muse provider timed out after ${this.timeoutMs}ms (${this.endpointHost()})`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}

/**
 * Deterministic template-driven outline planner. Pure function of its input:
 * same prompt -> same text. Used offline and whenever the Muse env vars are
 * absent. Every output is labeled generated_by=fallback in meta.
 */
export class DeterministicFallback implements ModelProvider {
  readonly id = 'fallback';

  async complete(prompt: string, _schemaHint?: string): Promise<CompletionResult> {
    void _schemaHint;
    return { text: planOutline(prompt), meta: { provider: 'fallback', generated_by: 'fallback' } };
  }
}

/** Pure template planner shared by the fallback provider. Exported for tests. */
export function planOutline(prompt: string): string {
  const excerpt = prompt.replace(/\s+/g, ' ').trim().slice(0, 160);
  const lines = [
    'FALLBACK OUTLINE (template-generated, not model inference)',
    `Topic: ${excerpt || '(empty prompt)'}`,
    '1. Cover — state the thesis in one line',
    '2. Context — what this is and who it is for',
    '3. Key points — one claim per slide, in source order',
    '4. Numbers — only figures quoted from the source, with refs',
    '5. Proposal — next steps, labeled as proposal/unverified',
    '6. Closing — restate the thesis',
  ];
  return lines.join('\n');
}

/**
 * Env-driven provider selection. MetaMuseProvider is active ONLY when BOTH
 * TYPOdeck_MUSE_ENDPOINT and TYPOdeck_MUSE_API_KEY are set (non-empty);
 * otherwise the deterministic fallback is used. Default: fallback.
 */
export function resolveProvider(
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl?: typeof fetch,
): ModelProvider {
  const endpoint = (env[MUSE_ENDPOINT_ENV] ?? '').trim();
  const apiKey = (env[MUSE_API_KEY_ENV] ?? '').trim();
  if (endpoint !== '' && apiKey !== '') {
    return new MetaMuseProvider({
      endpoint,
      apiKey,
      model: env['TYPOdeck_MUSE_MODEL']?.trim() || undefined,
      fetchImpl,
    });
  }
  return new DeterministicFallback();
}
