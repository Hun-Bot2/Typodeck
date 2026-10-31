// Typodeck Phase 2 — bounded ingestion (Repository Mode + Idea Mode).
// All network goes through an injectable fetch so tests run offline.
// Bounds (ARCHITECTURE.md §6): ≤20 files, ≤200KB total, code sample ≤5
// files / 10KB each, default branch only, 30s timeout, 403/429 back-off
// then degrade to README-only or typed error. Private repos rejected.
//
// Rate-limit handling (GitHub answers quota exhaustion with HTTP 403, not
// 429): every GitHub response is inspected for x-ratelimit-remaining,
// x-ratelimit-reset, and retry-after. Quota exhaustion surfaces as typed
// 'rate-limited' with the reset time — never a bare 'network' error. A
// single retry happens only when retry-after is present; otherwise the
// failure is immediate so callers can show the reset time right away.

export type FetchImpl = typeof fetch;

export const MAX_FILES = 20;
export const MAX_TOTAL_BYTES = 200 * 1024;
export const MAX_CODE_FILES = 5;
export const MAX_CODE_FILE_BYTES = 10 * 1024;
export const DEFAULT_TIMEOUT_MS = 30000;
export const MIN_IDEA_CHARS = 100;
export const MAX_IDEA_CHARS = 20000;

export type IngestionErrorCode =
  | 'private-repo'
  | 'not-found'
  | 'rate-limited'
  | 'timeout'
  | 'too-large'
  | 'invalid-input'
  | 'idea-length'
  | 'network';

/** Structured rate-limit detail attached to 'rate-limited' errors. Never secret. */
export interface RateLimitInfo {
  /** ISO timestamp of the x-ratelimit-reset header when GitHub sent one. */
  resetAt?: string;
  /** Honored retry-after delay in ms when GitHub sent one. */
  retryAfterMs?: number;
}

export class IngestionError extends Error {
  readonly code: IngestionErrorCode;
  readonly rateLimit?: RateLimitInfo;
  constructor(code: IngestionErrorCode, message: string, rateLimit?: RateLimitInfo) {
    super(message);
    this.name = 'IngestionError';
    this.code = code;
    if (rateLimit) this.rateLimit = rateLimit;
  }
}

export interface IngestedFile {
  /** Repo-relative path, or 'idea.txt' for Idea Mode. */
  path: string;
  /** Byte size of the stored text (UTF-8). */
  bytes: number;
  /** True when the source was cut to fit a bound. */
  truncated: boolean;
  /** File text (possibly truncated). */
  text: string;
  /** 1-based line count of text. */
  lines: number;
}

export interface EvidencePointer {
  source: 'repo' | 'idea';
  owner?: string;
  repo?: string;
  branch?: string;
  sha?: string | null;
  path: string;
}

/** Request budget accounting for one fetchRepo call (retries counted). */
export interface IngestRequestStats {
  /** Network calls to api.github.com (meta + tree + retries). */
  api: number;
  /** Network calls to raw.githubusercontent.com (blobs + retries). */
  blobs: number;
  /** Logical calls served from the response cache (no network). */
  cached: number;
}

export interface IngestedRepo {
  kind: 'repo';
  owner: string;
  repo: string;
  branch: string;
  sha: string | null;
  files: IngestedFile[];
  /** True when rate limits forced a README-only degrade. */
  degraded: boolean;
  warnings: string[];
  evidence: EvidencePointer[];
  /** Present on fresh ingests; absent on older/hand-built fixtures. */
  requests?: IngestRequestStats;
}

export interface IngestedIdea {
  kind: 'idea';
  files: IngestedFile[];
  warnings: string[];
  evidence: EvidencePointer[];
}

export type Ingested = IngestedRepo | IngestedIdea;

export interface FetchRepoOptions {
  fetchImpl?: FetchImpl;
  timeoutMs?: number;
  /** Delay before the single 403/429 retry. Default 1000ms. */
  retryDelayMs?: number;
  /** Optional GitHub token (never logged). */
  authToken?: string;
  /** Pin a branch (default: repo default branch). Used by eval fixtures. */
  branch?: string;
  /**
   * Optional response cache (200s only, TTL-bounded). Share one across
   * calls to keep repeated ingests of the same repo off the rate limit.
   * Absent by default so offline tests stay deterministic.
   */
  cache?: ResponseCache;
}

/**
 * Minimal GET response cache: URL -> 200 body. Implementations must be
 * synchronous and TTL-bounded; see createMemoryCache.
 */
export interface ResponseCache {
  get(key: string): string | undefined;
  set(key: string, body: string): void;
}

export interface MemoryCacheOptions {
  /** Entry time-to-live. Default 120000ms. */
  ttlMs?: number;
  /** Max entries (oldest evicted first). Default 100. */
  maxEntries?: number;
  /** Bodies larger than this are never cached. Default 512KB. */
  maxEntryBytes?: number;
}

/** Small in-process TTL cache for successful GitHub GETs. No timers. */
export function createMemoryCache(opts: MemoryCacheOptions = {}): ResponseCache {
  const ttlMs = opts.ttlMs ?? 120000;
  const maxEntries = opts.maxEntries ?? 100;
  const maxEntryBytes = opts.maxEntryBytes ?? 512 * 1024;
  const store = new Map<string, { body: string; expires: number }>();
  return {
    get(key: string): string | undefined {
      const hit = store.get(key);
      if (!hit) return undefined;
      if (Date.now() > hit.expires) {
        store.delete(key);
        return undefined;
      }
      return hit.body;
    },
    set(key: string, body: string): void {
      if (Buffer.byteLength(body, 'utf8') > maxEntryBytes) return;
      if (!store.has(key) && store.size >= maxEntries) {
        const oldest = store.keys().next().value as string | undefined;
        if (oldest !== undefined) store.delete(oldest);
      }
      store.set(key, { body, expires: Date.now() + ttlMs });
    },
  };
}

function toIngestedFile(path: string, text: string, truncated: boolean): IngestedFile {
  const bytes = Buffer.byteLength(text, 'utf8');
  return { path, bytes, truncated, text, lines: text === '' ? 0 : text.split('\n').length };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface HttpResult {
  status: number;
  headers: Record<string, string>;
  text: string;
}

async function httpGet(
  fetchImpl: FetchImpl,
  url: string,
  headers: Record<string, string>,
  signal: AbortSignal,
): Promise<HttpResult> {
  let res: Response;
  try {
    res = (await fetchImpl(url, { headers, signal })) as Response;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new IngestionError('timeout', `request timed out: ${url}`);
    }
    throw new IngestionError('network', `request failed: ${url} (${String(err)})`);
  }
  const text = await res.text().catch(() => '');
  const outHeaders: Record<string, string> = {};
  try {
    res.headers.forEach((v, k) => {
      outHeaders[k.toLowerCase()] = v;
    });
  } catch {
    /* ignore header-read failures */
  }
  return { status: res.status, headers: outHeaders, text };
}

/** True for the statuses GitHub uses for quota/abuse limiting. */
function isLimitStatus(status: number): boolean {
  return status === 403 || status === 429;
}

/** Structured rate-limit detail from response headers (never secret). */
function rateLimitInfo(headers: Record<string, string>): RateLimitInfo {
  const info: RateLimitInfo = {};
  const resetSec = Number(headers['x-ratelimit-reset']);
  if (Number.isFinite(resetSec) && resetSec > 0) {
    info.resetAt = new Date(resetSec * 1000).toISOString();
  }
  const retrySec = Number(headers['retry-after']);
  if (Number.isFinite(retrySec) && retrySec >= 0) {
    info.retryAfterMs = retrySec * 1000;
  }
  return info;
}

/** Human suffix naming the quota reset, for errors and warnings. */
function resetSuffix(headers: Record<string, string>): string {
  const { resetAt } = rateLimitInfo(headers);
  return resetAt ? ` (quota resets at ${resetAt})` : '';
}

/**
 * Accept `owner/repo` or a full `github.com/owner/repo` URL (with .git,
 * branch paths, queries). Returns null for anything else — callers must
 * reject with 'invalid-input', never guess.
 */
export function parseRepoInput(input: string): { owner: string; repo: string } | null {
  const t = input.trim();
  const url = t.match(/^https?:\/\/(?:www\.)?github\.com\/([^/\s?#]+)\/([^/\s?#]+?)(?:\.git)?(?:[/?#].*)?$/i);
  if (url) return { owner: url[1], repo: url[2] };
  const short = t.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
  if (short) return { owner: short[1], repo: short[2] };
  return null;
}

/**
 * Deep link to a source line range on github.com. The branch is passed
 * through unencoded (slash branches stay navigable); owner/repo/path
 * segments are encoded. Only build links from ingested branch + real
 * extraction line spans — never from guessed locations.
 */
export function githubBlobUrl(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  lines?: [number, number],
): string {
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  const base =
    `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}` +
    `/blob/${branch}/${encoded}`;
  if (!lines) return base;
  const [a, b] = lines;
  return a === b ? `${base}#L${a}` : `${base}#L${a}-L${b}`;
}

function isReadme(path: string): boolean {
  const base = path.split('/').pop() ?? '';
  return /^readme(\..*)?$/i.test(base);
}

function isDoc(path: string): boolean {
  const lower = path.toLowerCase();
  return (
    lower.startsWith('docs/') ||
    lower.startsWith('doc/') ||
    lower.startsWith('documentation/') ||
    lower.endsWith('.md') ||
    lower.endsWith('.mdx') ||
    lower.endsWith('.rst') ||
    lower.endsWith('.txt') ||
    lower === 'changelog' ||
    lower === 'history.rdoc'
  );
}

/**
 * Files with no narrative value, skipped before blob fetch: license/
 * attribution texts anywhere, GitHub meta-templates (issue/PR forms),
 * and contributor-process docs (contributing guides, conduct codes,
 * support/security/sponsor pages).
 */
function isSkipped(path: string): boolean {
  const lower = path.toLowerCase();
  const base = lower.split('/').pop() ?? '';
  if (/^(license|licence|copying|notice|patents)(\..*)?$/.test(base)) return true;
  if (
    /^(contributing|code_of_conduct|code-of-conduct|support|security|sponsors|funding|authors|maintainers)(\..*)?$/.test(
      base,
    )
  ) {
    return true;
  }
  if (lower.includes('.github/') && lower.includes('template')) return true;
  return false;
}

const CODE_EXTENSIONS = new Set([
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.rb', '.go', '.rs',
  '.java', '.kt', '.swift', '.c', '.h', '.cc', '.cpp', '.hpp', '.cs', '.php',
]);

function isCode(path: string): boolean {
  const lower = path.toLowerCase();
  if (/(^|[/_.-])(tests?|specs?|__tests__)([/_.-]|$)/.test(lower)) return false;
  if (/\.(test|spec)\.[a-z]+$/.test(lower)) return false;
  const dot = lower.lastIndexOf('.');
  if (dot < 0) return false;
  return CODE_EXTENSIONS.has(lower.slice(dot));
}

/**
 * Fetch a public GitHub repo with hard bounds. README + docs first, then a
 * selective code sample. Degrades to README-only on persistent blob 403/429;
 * API-call limits fail fast as typed 'rate-limited' with reset info. Every
 * call is counted on the returned `requests` budget; pass `cache` to serve
 * repeat ingests without spending quota.
 */
export async function fetchRepo(
  owner: string,
  repo: string,
  opts: FetchRepoOptions = {},
): Promise<IngestedRepo> {
  if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) {
    throw new IngestionError('invalid-input', `invalid owner/repo: ${owner}/${repo}`);
  }
  const fetchImpl = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'typodeck',
  };
  if (opts.authToken) headers['authorization'] = `Bearer ${opts.authToken}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  // Request budgeting: every network call is counted by kind; cache hits
  // are counted separately so callers can see quota actually consumed.
  // The cache key includes the auth mode so authed and anonymous views of
  // the same URL never share entries.
  const requests: IngestRequestStats = { api: 0, blobs: 0, cached: 0 };
  const cachePrefix = opts.authToken ? 'a:' : 'u:';
  const get = async (kind: 'api' | 'blobs', url: string): Promise<HttpResult> => {
    const cached = opts.cache?.get(`${cachePrefix}${url}`);
    if (cached !== undefined) {
      requests.cached += 1;
      return { status: 200, headers: {}, text: cached };
    }
    const res = await httpGet(fetchImpl, url, headers, ctrl.signal);
    requests[kind] += 1;
    if (res.status === 200) opts.cache?.set(`${cachePrefix}${url}`, res.text);
    return res;
  };
  // A single retry happens only when GitHub names a delay; quota exhaustion
  // without retry-after fails fast with the reset time attached.
  const maybeRetry = async (kind: 'api' | 'blobs', url: string, res: HttpResult): Promise<HttpResult> => {
    const { retryAfterMs } = rateLimitInfo(res.headers);
    if (retryAfterMs === undefined) return res;
    await sleep(Math.min(retryAfterMs, 10000));
    return get(kind, url);
  };

  try {
    // 1. Repo metadata: default branch + visibility gate.
    let metaRes = await get('api', `https://api.github.com/repos/${owner}/${repo}`);
    if (metaRes.status === 404) {
      throw new IngestionError('not-found', `repo not found: ${owner}/${repo} (missing, renamed, or private)`);
    }
    if (isLimitStatus(metaRes.status)) {
      metaRes = await maybeRetry('api', `https://api.github.com/repos/${owner}/${repo}`, metaRes);
    }
    if (isLimitStatus(metaRes.status)) {
      throw new IngestionError(
        'rate-limited',
        `GitHub rate limit (HTTP ${metaRes.status}) fetching repo metadata for ${owner}/${repo}` +
          `${resetSuffix(metaRes.headers)}. Authenticate for higher quota or retry after the reset.`,
        rateLimitInfo(metaRes.headers),
      );
    }
    if (metaRes.status !== 200) {
      throw new IngestionError('network', `repo metadata HTTP ${metaRes.status} for ${owner}/${repo}`);
    }
    let meta: { default_branch?: string; private?: boolean };
    try {
      meta = JSON.parse(metaRes.text) as { default_branch?: string; private?: boolean };
    } catch {
      throw new IngestionError('network', `unparseable repo metadata for ${owner}/${repo}`);
    }
    if (meta.private === true) {
      throw new IngestionError('private-repo', `private repos are not supported: ${owner}/${repo}`);
    }
    const branch = opts.branch ?? meta.default_branch ?? 'main';

    // 2. Single recursive tree call (N blobs fetched after, N ≤ 20).
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    let treeRes = await get('api', treeUrl);
    if (treeRes.status === 404) {
      throw new IngestionError('not-found', `branch not found: ${owner}/${repo}@${branch}`);
    }
    if (isLimitStatus(treeRes.status)) {
      treeRes = await maybeRetry('api', treeUrl, treeRes);
    }
    if (isLimitStatus(treeRes.status)) {
      throw new IngestionError(
        'rate-limited',
        `GitHub rate limit (HTTP ${treeRes.status}) fetching the file tree for ${owner}/${repo}@${branch}` +
          `${resetSuffix(treeRes.headers)}. Authenticate for higher quota or retry after the reset.`,
        rateLimitInfo(treeRes.headers),
      );
    }
    if (treeRes.status !== 200) {
      throw new IngestionError('network', `tree HTTP ${treeRes.status} for ${owner}/${repo}@${branch}`);
    }
    let tree: { sha?: string; truncated?: boolean; tree?: Array<{ path?: string; type?: string; size?: number }> };
    try {
      tree = JSON.parse(treeRes.text) as typeof tree;
    } catch {
      throw new IngestionError('network', `unparseable tree for ${owner}/${repo}@${branch}`);
    }
    const blobs = (tree.tree ?? []).filter(
      (e) => e.type === 'blob' && typeof e.path === 'string',
    ) as Array<{ path: string; type: string; size?: number }>;

    // 3. Prioritize: README first, then docs, then selective code sample.
    const kept = blobs.filter((e) => !isSkipped(e.path));
    const readmes = kept.filter((e) => isReadme(e.path));
    const docs = kept.filter((e) => !isReadme(e.path) && isDoc(e.path) && (e.size ?? 0) <= 60 * 1024);
    const code = kept.filter((e) => isCode(e.path) && (e.size ?? 0) <= 40 * 1024);
    docs.sort((a, b) => a.path.localeCompare(b.path));
    // Prefer shallow, small, non-vendored code files.
    const vendored = (p: string): boolean =>
      p.includes('node_modules/') || p.includes('vendor/') || p.includes('dist/') || p.includes('build/');
    code.sort(
      (a, b) =>
        Number(vendored(a.path)) - Number(vendored(b.path)) ||
        a.path.split('/').length - b.path.split('/').length ||
        (a.size ?? 0) - (b.size ?? 0) ||
        a.path.localeCompare(b.path),
    );
    const selected: Array<{ path: string; code: boolean }> = [
      ...readmes.map((e) => ({ path: e.path, code: false })),
      ...docs.map((e) => ({ path: e.path, code: false })),
      ...code.map((e) => ({ path: e.path, code: true })),
    ];

    // 4. Fetch blobs with hard bounds.
    const files: IngestedFile[] = [];
    const evidence: EvidencePointer[] = [];
    const warnings: string[] = [];
    if (tree.truncated === true) {
      warnings.push('GitHub truncated the file tree; selection may miss files in large repos');
    }
    let totalBytes = 0;
    let codeCount = 0;
    let degraded = false;
    let readmeFetched = false;

    const fetchOne = async (path: string, isCode: boolean): Promise<boolean> => {
      if (files.length >= MAX_FILES) {
        warnings.push(`file cap reached (${MAX_FILES}); remaining files skipped`);
        return false;
      }
      if (isCode && codeCount >= MAX_CODE_FILES) return false; // skip quietly; cap is structural
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
      const res = await get('blobs', url);
      if (isLimitStatus(res.status)) {
        // Single back-off retry, then degrade to README-only or fail.
        // Raw-blob limits are usually transient abuse throttles, so the
        // retry always runs (unlike the fail-fast API calls above).
        const { retryAfterMs } = rateLimitInfo(res.headers);
        const delay = retryAfterMs !== undefined && retryAfterMs > 0
          ? Math.min(retryAfterMs, 10000)
          : (opts.retryDelayMs ?? 1000);
        await sleep(delay);
        const retry = await get('blobs', url);
        if (isLimitStatus(retry.status)) {
          if (readmeFetched) {
            degraded = true;
            warnings.push(`rate limited (HTTP ${retry.status}); degraded to README-only${resetSuffix(retry.headers)}`);
            return false;
          }
          throw new IngestionError(
            'rate-limited',
            `GitHub rate limit (HTTP ${retry.status}) before README could be fetched` +
              `${resetSuffix(retry.headers)}. Authenticate for higher quota or retry after the reset.`,
            rateLimitInfo(retry.headers),
          );
        }
        return storeBlob(path, isCode, retry.text, retry.status);
      }
      return storeBlob(path, isCode, res.text, res.status);
    };

    const storeBlob = (path: string, isCode: boolean, text: string, status: number): boolean => {
      if (status !== 200) {
        warnings.push(`skipped ${path} (HTTP ${status})`);
        return true; // continue with other files
      }
      let truncated = false;
      if (isCode && text.length > MAX_CODE_FILE_BYTES) {
        text = text.slice(0, MAX_CODE_FILE_BYTES);
        truncated = true;
      }
      const remaining = MAX_TOTAL_BYTES - totalBytes;
      const asBytes = Buffer.byteLength(text, 'utf8');
      if (asBytes > remaining) {
        // Cut to the remaining budget on a byte boundary.
        const buf = Buffer.from(text, 'utf8').subarray(0, remaining);
        text = buf.toString('utf8');
        truncated = true;
      }
      const file = toIngestedFile(path, text, truncated);
      if (truncated) warnings.push(`truncated ${path} to fit size bounds`);
      totalBytes += file.bytes;
      files.push(file);
      evidence.push({ source: 'repo', owner, repo, branch, sha: tree.sha ?? null, path });
      if (isCode) codeCount += 1;
      if (isReadme(path)) readmeFetched = true;
      return !truncated || totalBytes < MAX_TOTAL_BYTES;
    };

    for (const sel of selected) {
      if (totalBytes >= MAX_TOTAL_BYTES) {
        warnings.push(`total size cap reached (${MAX_TOTAL_BYTES} bytes); remaining files skipped`);
        break;
      }
      const cont = await fetchOne(sel.path, sel.code);
      if (!cont) break;
    }

    if (files.length === 0) {
      throw new IngestionError('not-found', `no readable files in ${owner}/${repo}@${branch}`);
    }
    return {
      kind: 'repo',
      owner,
      repo,
      branch,
      sha: tree.sha ?? null,
      files,
      degraded,
      warnings,
      evidence,
      requests,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Accept pasted idea text (100–20,000 chars). Stored as idea.txt; every
 * downstream claim is marked ungrounded by the evidence module.
 */
export function acceptIdea(text: string): IngestedIdea {
  if (typeof text !== 'string' || text.length < MIN_IDEA_CHARS || text.length > MAX_IDEA_CHARS) {
    throw new IngestionError(
      'idea-length',
      `idea text must be ${MIN_IDEA_CHARS}–${MAX_IDEA_CHARS} chars, got ${typeof text === 'string' ? text.length : typeof text}`,
    );
  }
  const file = toIngestedFile('idea.txt', text, false);
  return {
    kind: 'idea',
    files: [file],
    warnings: [],
    evidence: [{ source: 'idea', path: 'idea.txt' }],
  };
}