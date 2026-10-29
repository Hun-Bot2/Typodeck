// Shared offline fakes for Phase 2 tests. No network is ever used.
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import type { FetchImpl } from '../src/ingestion';

export interface RecordedRepo {
  owner: string;
  repo: string;
  meta: { default_branch: string; private: boolean };
  treeSha: string;
  blobs: Record<string, string>;
}

export function loadRecordedRepo(): RecordedRepo {
  const p = path.resolve(__dirname, '..', '..', 'fixtures', 'recorded-repo.json');
  return JSON.parse(readFileSync(p, 'utf8')) as RecordedRepo;
}

export function loadIdeaF4(): string {
  const p = path.resolve(__dirname, '..', '..', 'fixtures', 'idea-f4.txt');
  return readFileSync(p, 'utf8');
}

export interface FakeHttpResponse {
  status: number;
  headers?: Record<string, string>;
  body: string;
}

export type FakeHandler = (url: string, init: unknown) => FakeHttpResponse | Promise<FakeHttpResponse>;

/** Wrap a URL handler as a fetch implementation. */
export function fakeFetch(handler: FakeHandler): FetchImpl {
  const fn = (async (url: unknown, init?: unknown) => {
    const r = await handler(String(url), init);
    return {
      ok: r.status >= 200 && r.status < 300,
      status: r.status,
      headers: {
        forEach(cb: (value: string, key: string) => void): void {
          for (const [k, v] of Object.entries(r.headers ?? {})) cb(v, k);
        },
      },
      text: async () => r.body,
      json: async () => JSON.parse(r.body),
    };
  }) as unknown as FetchImpl;
  return fn;
}

export interface RecordedFetchOptions {
  /** Override blob contents (path -> text). Use null to force a 404. */
  blobOverrides?: Record<string, string | null>;
  /** Extra tree entries appended to the recorded tree. */
  extraTree?: Array<{ path: string; size: number }>;
  /** Replace the whole tree entry list. */
  treeOverride?: Array<{ path: string; size: number }>;
  /** Force repo-meta response (e.g. private:true, or a status). */
  metaOverride?: Record<string, unknown>;
  metaStatus?: number;
  /** Force every raw-blob request to this status (for rate-limit tests). */
  blobStatus?: number;
  /** Fail only paths matching this predicate with blobStatus. */
  blobStatusWhen?: (path: string) => boolean;
  /** Number of failing attempts before blob requests succeed (retry tests). */
  failFirstNBlobRequests?: number;
  /** Response headers for blob requests. */
  blobHeaders?: Record<string, string>;
}

/** Fake GitHub (API + raw) serving the recorded repo with optional faults. */
export function recordedRepoFetch(record: RecordedRepo, opts: RecordedFetchOptions = {}): FetchImpl {
  const apiBase = `https://api.github.com/repos/${record.owner}/${record.repo}`;
  let blobCalls = 0;
  return fakeFetch((url) => {
    if (url === apiBase) {
      return {
        status: opts.metaStatus ?? 200,
        body: JSON.stringify(opts.metaOverride ?? record.meta),
      };
    }
    if (url.startsWith(`${apiBase}/git/trees/`)) {
      const entries = opts.treeOverride ?? [
        ...Object.keys(record.blobs).map((p) => ({
          path: p,
          size: Buffer.byteLength(record.blobs[p], 'utf8'),
        })),
        ...(opts.extraTree ?? []),
      ];
      return {
        status: 200,
        body: JSON.stringify({
          sha: record.treeSha,
          truncated: false,
          tree: entries.map((e) => ({ path: e.path, type: 'blob', size: e.size })),
        }),
      };
    }
    const rawPrefix = `https://raw.githubusercontent.com/${record.owner}/${record.repo}/`;
    if (url.startsWith(rawPrefix)) {
      blobCalls += 1;
      const path = url.slice(rawPrefix.length).split('/').slice(1).join('/');
      const forced = opts.blobStatus !== undefined && (opts.blobStatusWhen?.(path) ?? true);
      const failing = forced && blobCalls <= (opts.failFirstNBlobRequests ?? Number.MAX_SAFE_INTEGER);
      if (failing) {
        return { status: opts.blobStatus as number, headers: opts.blobHeaders, body: 'rate limited' };
      }
      if (path in (opts.blobOverrides ?? {})) {
        const override = (opts.blobOverrides as Record<string, string | null>)[path];
        if (override === null) return { status: 404, body: 'not found' };
        return { status: 200, body: override };
      }
      if (path in record.blobs) return { status: 200, body: record.blobs[path] };
      // Synthetic blobs for extra/override tree entries.
      return {
        status: 200,
        body: `# Synthetic doc for ${path}\n\nThis synthetic document exercises ingestion bounds with several calm sentences about nothing in particular.\n`,
      };
    }
    return { status: 404, body: 'no such route in fake' };
  });
}

/** A fetch that hangs until aborted, then rejects like a real fetch would. */
export function abortAwareHungFetch(): FetchImpl {
  return fakeFetch((_url, init) => {
    const signal = (init as { signal?: AbortSignal } | undefined)?.signal;
    return new Promise<FakeHttpResponse>((_resolve, reject) => {
      if (signal?.aborted) {
        reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
        return;
      }
      signal?.addEventListener('abort', () => {
        reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
      });
    });
  });
}
