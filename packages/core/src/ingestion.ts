// Typodeck Phase 2 — bounded ingestion (Repository Mode + Idea Mode).
// All network goes through an injectable fetch so tests run offline.
// Bounds (ARCHITECTURE.md §6): ≤20 files, ≤200KB total, code sample ≤5
// files / 10KB each, default branch only, 30s timeout, 403/429 back-off
// then degrade to README-only or typed error. Private repos rejected.

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

export class IngestionError extends Error {
  readonly code: IngestionErrorCode;
  constructor(code: IngestionErrorCode, message: string) {
    super(message);
    this.name = 'IngestionError';
    this.code = code;
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
 * selective code sample. Degrades to README-only on persistent 403/429.
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
    'user-agent': 'typodeck-phase2',
  };
  if (opts.authToken) headers['authorization'] = `Bearer ${opts.authToken}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    // 1. Repo metadata: default branch + visibility gate.
    const metaRes = await httpGet(
      fetchImpl, `https://api.github.com/repos/${owner}/${repo}`, headers, ctrl.signal,
    );
    if (metaRes.status === 404) {
      throw new IngestionError('not-found', `repo not found: ${owner}/${repo}`);
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
    const treeRes = await httpGet(
      fetchImpl,
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      headers,
      ctrl.signal,
    );
    if (treeRes.status === 404) {
      throw new IngestionError('not-found', `branch not found: ${owner}/${repo}@${branch}`);
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
      const res = await httpGet(fetchImpl, url, headers, ctrl.signal);
      if (res.status === 403 || res.status === 429) {
        // Single back-off retry, then degrade to README-only or fail.
        const retryAfter = Number(res.headers['retry-after']);
        const delay = Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, 10000)
          : (opts.retryDelayMs ?? 1000);
        await sleep(delay);
        const retry = await httpGet(fetchImpl, url, headers, ctrl.signal);
        if (retry.status === 403 || retry.status === 429) {
          if (readmeFetched) {
            degraded = true;
            warnings.push(`rate limited (HTTP ${retry.status}); degraded to README-only`);
            return false;
          }
          throw new IngestionError(
            'rate-limited',
            `GitHub rate limit (HTTP ${retry.status}) before README could be fetched`,
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