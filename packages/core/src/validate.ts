// Typodeck Typography Core — structural PPTX validation.
// Unzips the .pptx, parses slide XML, and asserts the typography-only
// constraint: zero forbidden elements, all text in editable a:t nodes,
// every text box within the 16:9 slide bounds.

import JSZip from 'jszip';
import { promises as fs } from 'node:fs';
import { SLIDE_HEIGHT_IN, SLIDE_WIDTH_IN } from './schema';

const EMU_PER_INCH = 914400;

export interface PptxValidationStats {
  slides: number;
  textShapes: number;
  editableChars: number;
  slideSizeIn: { w: number; h: number } | null;
}

export interface PptxValidationResult {
  ok: boolean;
  errors: string[];
  stats: PptxValidationStats;
}

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : null;
}

interface Shape {
  xml: string;
  spPr: string | null;
}

/** Split slide XML into its <p:sp> text-shape elements. */
function textShapes(slideXml: string): Shape[] {
  const out: Shape[] = [];
  const re = /<p:sp[\s>]([\s\S]*?)<\/p:sp>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(slideXml)) !== null) {
    const inner = m[1];
    const spPr = inner.match(/<p:spPr[\s>]([\s\S]*?)<\/p:spPr>|<p:spPr[^>]*\/>/)?.[0] ?? null;
    out.push({ xml: m[0], spPr });
  }
  return out;
}

function validateSlideXml(name: string, xml: string, errors: string[], stats: PptxValidationStats): void {
  // --- Forbidden element scan (typography-only gate) ---
  const forbidden: Array<[RegExp, string]> = [
    [/<p:pic[\s>]/, 'p:pic (raster picture)'],
    [/<p:cxnSp[\s>]/, 'p:cxnSp (connector)'],
    [/<p:graphicFrame[\s>]/, 'p:graphicFrame (chart/table/diagram)'],
    [/<p:grpSp[\s>]/, 'p:grpSp (group shape)'],
    [/<a:blip[\s>]/, 'a:blip (image fill)'],
    [/<a:blipFill[\s>]/, 'a:blipFill (picture fill)'],
    [/<p:contentPart[\s>]/, 'p:contentPart (embedded media)'],
    [/<p:oleObj[\s>]/, 'p:oleObj (embedded object)'],
    [/<c:chart[\s>]/, 'c:chart (embedded chart)'],
    [/<a:tbl[\s>]/, 'a:tbl (table)'],
    [/<v:shape[\s>]/, 'v:shape (VML shape)'],
    [/<a:gradFill[\s>]/, 'a:gradFill (gradient)'],
    [/<a:pattFill[\s>]/, 'a:pattFill (pattern fill)'],
  ];
  for (const [re, label] of forbidden) {
    if (re.test(xml)) errors.push(`${name}: forbidden element ${label}`);
  }

  // --- Per-shape checks ---
  for (const shape of textShapes(xml)) {
    stats.textShapes += 1;
    const spPr = shape.spPr ?? '';
    // Only plain rect geometry allowed (no preset autoshapes).
    const prst = spPr.match(/<a:prstGeom[^>]*prst="([^"]*)"/)?.[1];
    if (prst !== undefined && prst !== 'rect') {
      errors.push(`${name}: text shape uses non-rect geometry prst="${prst}"`);
    }
    // No fill or outline on the text-box container itself.
    if (/<a:solidFill[\s>]/.test(spPr)) errors.push(`${name}: text shape has solid fill (only slide background fill allowed)`);
    // An outline counts only when it carries actual paint. pptxgenjs emits an
    // empty <a:ln></a:ln> placeholder on every text box — that draws nothing.
    for (const ln of spPr.match(/<a:ln[\s>][\s\S]*?<\/a:ln>|<a:ln[^>]*\/>/g) ?? []) {
      if (/<a:(solidFill|gradFill|pattFill|blipFill)[\s>]/.test(ln)) {
        errors.push(`${name}: text shape has outline/line with paint`);
      }
    }
    if (/<a:effectLst[\s>]/.test(spPr)) errors.push(`${name}: text shape has effects (shadow etc.)`);

    // --- Bounds check from a:xfrm ---
    const xfrm = spPr.match(/<a:xfrm[\s>]([\s\S]*?)<\/a:xfrm>/)?.[1];
    if (!xfrm) {
      errors.push(`${name}: text shape missing a:xfrm transform`);
      continue;
    }
    const off = xfrm.match(/<a:off[^>]*\/>/)?.[0];
    const ext = xfrm.match(/<a:ext[^>]*\/>/)?.[0];
    if (!off || !ext) {
      errors.push(`${name}: text shape has incomplete a:xfrm`);
      continue;
    }
    const x = Number(attr(off, 'x')) / EMU_PER_INCH;
    const y = Number(attr(off, 'y')) / EMU_PER_INCH;
    const w = Number(attr(ext, 'cx')) / EMU_PER_INCH;
    const h = Number(attr(ext, 'cy')) / EMU_PER_INCH;
    if (![x, y, w, h].every(Number.isFinite)) {
      errors.push(`${name}: text shape has non-numeric geometry`);
      continue;
    }
    const tol = 0.02;
    if (x < -tol || y < -tol || x + w > SLIDE_WIDTH_IN + tol || y + h > SLIDE_HEIGHT_IN + tol) {
      errors.push(
        `${name}: text box [${x.toFixed(2)},${y.toFixed(2)},${w.toFixed(2)},${h.toFixed(2)}] exceeds slide bounds ${SLIDE_WIDTH_IN}x${SLIDE_HEIGHT_IN}`,
      );
    }
  }

  // --- Editability: collect editable text; flag locked shapes ---
  if (/<a:spLocks[^>]*noTxEdt="1"/.test(xml)) {
    errors.push(`${name}: locked (non-editable) text found`);
  }
  const texts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]);
  for (const t of texts) stats.editableChars += t.length;
}

/**
 * Structurally validate exported .pptx bytes.
 * When `expectedMinChars` is given, also require at least that many
 * editable characters (guards against empty/rasterized decks).
 */
export async function validatePptxBytes(
  data: Uint8Array | Buffer | ArrayBuffer,
  expectedMinChars = 1,
): Promise<PptxValidationResult> {
  const errors: string[] = [];
  const stats: PptxValidationStats = { slides: 0, textShapes: 0, editableChars: 0, slideSizeIn: null };
  const zip = await JSZip.loadAsync(data as Uint8Array);

  // Slide size must be 16:9.
  const presFile = zip.file('ppt/presentation.xml');
  if (!presFile) {
    errors.push('missing ppt/presentation.xml');
    return { ok: false, errors, stats };
  }
  const presXml = await presFile.async('string');
  const sldSz = presXml.match(/<p:sldSz[^>]*\/>/)?.[0];
  if (!sldSz) {
    errors.push('presentation.xml missing p:sldSz');
  } else {
    const cx = Number(attr(sldSz, 'cx')) / EMU_PER_INCH;
    const cy = Number(attr(sldSz, 'cy')) / EMU_PER_INCH;
    stats.slideSizeIn = { w: cx, h: cy };
    const ratio = cx / cy;
    if (Math.abs(ratio - 16 / 9) > 0.01) {
      errors.push(`slide size ${cx.toFixed(2)}x${cy.toFixed(2)} is not 16:9`);
    }
  }

  const slideNames = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort();
  if (slideNames.length === 0) errors.push('no slides found in ppt/slides/');
  stats.slides = slideNames.length;

  for (const name of slideNames) {
    const xml = await zip.file(name)?.async('string');
    if (xml === undefined) {
      errors.push(`${name}: unreadable`);
      continue;
    }
    validateSlideXml(name, xml, errors, stats);
  }

  if (stats.slides > 0 && stats.textShapes === 0) {
    errors.push('deck contains zero text shapes');
  }
  if (stats.editableChars < expectedMinChars) {
    errors.push(`only ${stats.editableChars} editable chars, expected >= ${expectedMinChars}`);
  }

  return { ok: errors.length === 0, errors, stats };
}

/**
 * Structurally validate an exported .pptx file.
 * When `expectedMinChars` is given, also require at least that many
 * editable characters (guards against empty/rasterized decks).
 */
export async function validatePptx(filePath: string, expectedMinChars = 1): Promise<PptxValidationResult> {
  const buf = await fs.readFile(filePath);
  return validatePptxBytes(buf, expectedMinChars);
}
