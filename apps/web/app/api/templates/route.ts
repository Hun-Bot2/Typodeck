import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parseSelectionIndex, systemIdForEntry } from '@typodeck/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Typo Pack index, canonical name first, legacy name as fallback. */
const PACK_INDEX_CANDIDATES = [
  join('typo-pack', 'selection-index.json'),
  join('bold-template-pack', 'selection-index.json'),
];

/** Walk up from the server cwd to the workspace root carrying the Typo Pack. */
function findPackRoot(): { root: string; indexRel: string } | null {
  let dir = process.cwd();
  for (;;) {
    for (const indexRel of PACK_INDEX_CANDIDATES) {
      if (existsSync(join(dir, indexRel))) return { root: dir, indexRel };
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function jsonError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status });
}

/**
 * Studio template catalog: the 27 Typo Pack candidates for the export
 * picker. Each entry is a selection card (slug/scheme/mood/bestFor);
 * the full design spec stays in the pack. Themed export re-themes the
 * template's base system geometry — the HTML specimen is not reproduced.
 * Progressive enhancement: the Studio exports fine when this 503s.
 */
export async function GET(): Promise<Response> {
  const found = findPackRoot();
  if (found === null) {
    return jsonError(503, 'template-pack-unavailable', 'Typo Pack is not available on this server');
  }
  try {
    const entries = parseSelectionIndex(JSON.parse(readFileSync(join(found.root, found.indexRel), 'utf8')));
    return Response.json({
      templates: entries.map((e) => ({
        slug: e.slug,
        name: e.name ?? e.slug,
        scheme: e.scheme,
        density: e.density,
        baseSystem: systemIdForEntry(e),
        mood: e.mood ?? [],
        bestFor: e.bestFor ?? '',
      })),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return jsonError(503, 'template-pack-unavailable', `Typo Pack index is unreadable: ${detail}`);
  }
}
