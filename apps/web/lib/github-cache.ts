import { createMemoryCache, type ResponseCache } from '@typodeck/core';

/**
 * Process-level GitHub GET cache shared by /api/evidence and /api/generate,
 * so generating right after inspecting costs zero additional quota. It lives
 * on globalThis because Next bundles each route separately — a module-level
 * value would be one cache per route. 200s only, TTL-bounded, auth-mode
 * separated (see core createMemoryCache).
 */
const CACHE_KEY = '__typodeck_github_cache__';

export function githubResponseCache(): ResponseCache {
  const g = globalThis as unknown as Record<string, ResponseCache | undefined>;
  if (!g[CACHE_KEY]) {
    g[CACHE_KEY] = createMemoryCache({ ttlMs: 120_000, maxEntries: 50 });
  }
  return g[CACHE_KEY] as ResponseCache;
}

/** Server-side GitHub token (never sent to the client, never logged). */
export function githubToken(): string | undefined {
  return (process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '').trim() || undefined;
}
