import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parseSelectionIndex } from '@typodeck/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PACK_INDEX_REL = join('bold-template-pack', 'selection-index.json');

/** Walk up from the server cwd to the workspace root carrying the template pack. */
function findPackRoot(): string | null {
  let dir = process.cwd();
  for (;;) {
    if (existsSync(join(dir, PACK_INDEX_REL))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function jsonError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status });
}

/**
 * Studio template catalog: the 27 template-pack designs for the export
 * picker. Each entry is a selection card (slug/scheme/mood/bestFor);
 * the full design spec stays in the pack. Themed export re-themes the
 * template's base system geometry — the HTML specimen is not reproduced.
 * Progressive enhancement: the Studio exports fine when this 503s.
 */
export async function GET(): Promise<Response> {
  const root = findPackRoot();
  if (root === null) {
    return jsonError(503, 'template-pack-unavailable', 'template pack is not available on this server');
  }
  try {
    const entries = parseSelectionIndex(JSON.parse(readFileSync(join(root, PACK_INDEX_REL), 'utf8')));
    return Response.json({
      templates: entries.map((e) => ({
        slug: e.slug,
        name: e.name ?? e.slug,
        scheme: e.scheme,
        density: e.density,
        mood: e.mood ?? [],
        bestFor: e.bestFor ?? '',
      })),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return jsonError(503, 'template-pack-unavailable', `template pack index is unreadable: ${detail}`);
  }
}
