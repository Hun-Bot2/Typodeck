import type { NextRequest } from 'next/server';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import {
  critiqueDeck,
  DeckValidationError,
  exportToPptxBuffer,
  layoutDeck,
  layoutDeckWithTemplate,
  parseSelectionIndex,
  resolveVisualSystem,
  TemplatePackError,
  validatePptxBytes,
  type SystemId,
  type TemplatePackEntry,
} from '@typodeck/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** Posted narratives are small, but cap the body regardless (512 KB). */
const BODY_CAP_BYTES = 512 * 1024;

function jsonError(status: number, code: string, message: string, extra?: Record<string, unknown>): Response {
  return Response.json({ error: { code, message, ...extra } }, { status });
}

/** Optional `template` slug -> themed export via the engine template-pack API. */
const PACK_INDEX_REL = join('bold-template-pack', 'selection-index.json');
const MAX_SLUG_ECHO = 100;

class TemplateRouteError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'TemplateRouteError';
  }
}

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

/**
 * Resolve a client slug to its selection-index entry + design.md text.
 * 400 for unknown slugs (client error); 500 when the on-disk pack is
 * missing or corrupt (server error).
 */
function loadTemplate(slug: string): { entry: TemplatePackEntry; designMarkdown: string } {
  const root = findPackRoot();
  if (root === null) {
    throw new TemplateRouteError(500, 'template-pack-unavailable', 'template pack is not available on this server');
  }
  let entries: TemplatePackEntry[];
  try {
    entries = parseSelectionIndex(JSON.parse(readFileSync(join(root, PACK_INDEX_REL), 'utf8')));
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new TemplateRouteError(500, 'template-pack-unavailable', `template pack index is unreadable: ${detail}`);
  }
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) {
    throw new TemplateRouteError(400, 'invalid-template', `unknown template "${slug.slice(0, MAX_SLUG_ECHO)}"`);
  }
  // designPath comes from the on-disk index, not the client; still contain it.
  const designAbs = resolve(root, entry.designPath);
  if (designAbs !== root && !designAbs.startsWith(root + sep)) {
    throw new TemplateRouteError(
      500,
      'template-pack-unavailable',
      `template "${entry.slug}" design path escapes the pack root`,
    );
  }
  try {
    return { entry, designMarkdown: readFileSync(designAbs, 'utf8') };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new TemplateRouteError(
      500,
      'template-pack-unavailable',
      `template "${entry.slug}" design file is unreadable: ${detail}`,
    );
  }
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
  let parsed: {
    narrative?: unknown;
    system?: unknown;
    generatedBy?: unknown;
    provenance?: unknown;
    critique?: unknown;
    template?: unknown;
  };
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

  // Optional advisory critique (C7): runs critiqueDeck and reports it in
  // response headers. Defaults OFF; never blocks export.
  let wantCritique = false;
  if (parsed.critique !== undefined) {
    if (typeof parsed.critique !== 'boolean') {
      return jsonError(400, 'invalid-input', 'critique must be a boolean');
    }
    wantCritique = parsed.critique;
  }

  // Optional template slug: resolved via the engine template-pack API.
  // Absent -> baseline layoutDeck path below, byte for byte unchanged.
  let templateSlug: string | undefined;
  if (parsed.template !== undefined) {
    if (typeof parsed.template !== 'string' || parsed.template.trim() === '') {
      return jsonError(400, 'invalid-template', 'template must be a non-empty template slug string');
    }
    templateSlug = parsed.template.trim();
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

  // Resolve the template before layout; the template's own systemId and
  // theme govern the themed deck (layoutDeckWithTemplate).
  let template: { entry: TemplatePackEntry; designMarkdown: string } | undefined;
  if (templateSlug !== undefined) {
    try {
      template = loadTemplate(templateSlug);
    } catch (err) {
      if (err instanceof TemplateRouteError) {
        return jsonError(err.status, err.code, err.message);
      }
      throw err;
    }
  }

  let deck;
  try {
    deck =
      template !== undefined
        ? layoutDeckWithTemplate(parsed.narrative, template.entry, template.designMarkdown)
        : layoutDeck(parsed.narrative, system);
  } catch (err) {
    if (err instanceof DeckValidationError) {
      return jsonError(400, 'invalid-narrative', `narrative rejected: ${err.message}`);
    }
    if (err instanceof TemplatePackError) {
      return jsonError(500, 'template-pack-unavailable', `template design is invalid: ${err.message}`);
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

  const fileSlug = template !== undefined ? template.entry.slug : system;
  const headers: Record<string, string> = {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml+xml',
    'Content-Disposition': `attachment; filename="typodeck-${fileSlug}.pptx"`,
    'Content-Length': String(buffer.length),
    'X-Typodeck-Slides': String(slideCount),
  };
  if (wantCritique) {
    try {
      const report = critiqueDeck(deck);
      const errors = report.findings.filter((f) => f.severity === 'error').length;
      const warnings = report.findings.filter((f) => f.severity === 'warning').length;
      const checks = [...new Set(report.findings.map((f) => f.check))].sort();
      headers['X-Typodeck-Critique-Errors'] = String(errors);
      headers['X-Typodeck-Critique-Warnings'] = String(warnings);
      headers['X-Typodeck-Critique-Checks'] = checks.join(',');
      headers['X-Typodeck-Critique-Report'] = Buffer.from(JSON.stringify(report)).toString('base64url');
    } catch {
      // Advisory only: a critique failure never blocks export.
    }
  }

  return new Response(new Uint8Array(buffer), { headers });
}
