import { NextRequest } from 'next/server';
import {
  DeckValidationError,
  SYSTEM_IDS,
  layoutDeck,
  listVisualSystems,
  parseSlideMarkdown,
  resolveVisualSystem,
  slideIRToNarrative,
  serializeSlideMarkdown,
  validateDeck,
  type SystemId,
} from '@typodeck/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BODY_CAP_BYTES = 512 * 1024;

function jsonError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status });
}

/**
 * Re-render edited Slide Markdown across every renderable visual system.
 * The posted markdown is strictly parsed; layout is recomputed server-side.
 */
export async function POST(req: NextRequest): Promise<Response> {
  const raw = await req.text();
  if (Buffer.byteLength(raw, 'utf8') > BODY_CAP_BYTES) {
    return jsonError(413, 'body-too-large', `request body exceeds the ${BODY_CAP_BYTES}-byte cap`);
  }
  let parsed: { markdown?: unknown };
  try {
    parsed = (JSON.parse(raw) || {}) as typeof parsed;
  } catch {
    return jsonError(400, 'invalid-input', 'request body is not valid JSON');
  }
  if (typeof parsed.markdown !== 'string' || parsed.markdown.trim() === '') {
    return jsonError(400, 'invalid-input', 'markdown must be a non-empty string');
  }
  let narrative;
  let canonical: string;
  try {
    narrative = slideIRToNarrative(parseSlideMarkdown(parsed.markdown));
    canonical = serializeSlideMarkdown(parseSlideMarkdown(parsed.markdown));
  } catch (err) {
    return jsonError(400, 'invalid-markdown', err instanceof Error ? err.message : String(err));
  }
  const decks: Record<string, unknown> = {};
  const skipped: string[] = [];
  for (const entry of listVisualSystems()) {
    let systemId: string;
    try {
      systemId = resolveVisualSystem(entry.id).typography.id;
    } catch {
      skipped.push(`${entry.id} (no shipped typography)`);
      continue; // registered but unrenderable: skipped honestly, never faked
    }
    if (!(SYSTEM_IDS as readonly string[]).includes(systemId)) {
      skipped.push(`${entry.id} (no layout support yet)`);
      continue;
    }
    try {
      const deck = layoutDeck(narrative, systemId as SystemId);
      validateDeck(deck);
      deck.meta.generatedBy = 'typodeck-studio/markdown-edit';
      decks[entry.id] = deck;
    } catch (err) {
      if (err instanceof DeckValidationError) {
        return jsonError(400, 'invalid-narrative', `edited narrative rejected: ${err.message}`);
      }
      return jsonError(500, 'layout-failed', err instanceof Error ? err.message : String(err));
    }
  }
  return Response.json({
    narrative,
    decks,
    slideMarkdown: canonical,
    provenance: {
      provider: 'markdown-edit',
      generatedBy: 'typodeck-studio/markdown-edit',
      claims: { total: 0, verified: 0, suggestion: 0, ungrounded: 0 },
      warnings: [
        'edited narrative: claims were not re-extracted; refs reflect the last parse',
        ...skipped.map((s) => `skipped system ${s}`),
      ],
    },
  });
}
