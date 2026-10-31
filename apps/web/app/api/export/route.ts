import { NextRequest } from 'next/server';
import {
  DeckValidationError,
  exportToPptxBuffer,
  layoutDeck,
  resolveVisualSystem,
  validatePptxBytes,
  type SystemId,
} from '@typodeck/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** Posted narratives are small, but cap the body regardless (512 KB). */
const BODY_CAP_BYTES = 512 * 1024;

function jsonError(status: number, code: string, message: string, extra?: Record<string, unknown>): Response {
  return Response.json({ error: { code, message, ...extra } }, { status });
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
  let parsed: { narrative?: unknown; system?: unknown; generatedBy?: unknown; provenance?: unknown };
  try {
    parsed = (JSON.parse(raw) || {}) as typeof parsed;
  } catch {
    return jsonError(400, 'invalid-input', 'request body is not valid JSON');
  }
  // Optional provenance echo from /api/generate (validated, never trusted blindly).
  let provenance: { repo?: string; branch?: string; sha?: string | null } | undefined;
  if (parsed.provenance !== undefined) {
    if (parsed.provenance === null || typeof parsed.provenance !== 'object' || Array.isArray(parsed.provenance)) {
      return jsonError(400, 'invalid-input', 'provenance must be an object');
    }
    const p = parsed.provenance as Record<string, unknown>;
    for (const key of ['repo', 'branch'] as const) {
      if (p[key] !== undefined && (typeof p[key] !== 'string' || (p[key] as string).length > 200)) {
        return jsonError(400, 'invalid-input', `provenance.${key} must be a string of ≤200 chars`);
      }
    }
    if (p.sha !== undefined && p.sha !== null && (typeof p.sha !== 'string' || (p.sha as string).length > 100)) {
      return jsonError(400, 'invalid-input', 'provenance.sha must be a string of ≤100 chars or null');
    }
    provenance = {
      ...(typeof p.repo === 'string' ? { repo: p.repo } : {}),
      ...(typeof p.branch === 'string' ? { branch: p.branch } : {}),
      ...(p.sha === null || typeof p.sha === 'string' ? { sha: p.sha } : {}),
    };
  }

  // Validate the system id against the registry; never trust client
  // geometry — layout is recomputed. Registered-but-unrenderable systems
  // fail loudly here instead of exporting the wrong design.
  if (typeof parsed.system !== 'string') {
    return jsonError(400, 'invalid-system', 'system must be a registered visual system id');
  }
  try {
    resolveVisualSystem(parsed.system);
  } catch {
    return jsonError(400, 'invalid-system', `unknown or unrenderable system "${parsed.system}"`);
  }
  const system = parsed.system as SystemId;

  let deck;
  try {
    deck = layoutDeck(parsed.narrative, system);
  } catch (err) {
    if (err instanceof DeckValidationError) {
      return jsonError(400, 'invalid-narrative', `narrative rejected: ${err.message}`);
    }
    return jsonError(500, 'layout-failed', err instanceof Error ? err.message : String(err));
  }
  deck.meta.generatedBy =
    typeof parsed.generatedBy === 'string' && parsed.generatedBy.trim() !== ''
      ? parsed.generatedBy.trim().slice(0, 64)
      : 'typodeck-studio/phase3';
  if (provenance && (provenance.repo !== undefined || provenance.branch !== undefined)) {
    deck.meta.provenance = provenance;
  }

  const { buffer, slideCount } = await exportToPptxBuffer(deck);
  const check = await validatePptxBytes(buffer, 100);
  if (!check.ok) {
    return jsonError(500, 'export-validation-failed', `exported file failed validation: ${check.errors.join('; ')}`, {
      errors: check.errors,
    });
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml+xml',
      'Content-Disposition': `attachment; filename="typodeck-${system}.pptx"`,
      'Content-Length': String(buffer.length),
      'X-Typodeck-Slides': String(slideCount),
    },
  });
}
