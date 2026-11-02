// Typodeck Typography Core — PPTX exporter.
// Native text boxes ONLY (addText) + slide background fill.
// This module must never call addShape / addImage / addTable / addChart /
// addMedia — enforced by code review and the structural validator.

import PptxGenJS from 'pptxgenjs';
import { SLIDE_HEIGHT_IN, SLIDE_WIDTH_IN, validateDeck, type Deck, type TextBlock } from './schema';
import { fontFaceFor, getSystem } from './systems';

/** 16:9 layout sized to the Typodeck canvas (13.33 x 7.5 in). */
export const LAYOUT_16x9 = 'LAYOUT_16x9';

function stripHash(hex: string): string {
  return hex.replace(/^#/, '').toUpperCase();
}

function textOptions(block: TextBlock, fontFace: string): PptxGenJS.TextPropsOptions {
  return {
    x: block.x,
    y: block.y,
    w: block.w,
    h: block.h,
    align: block.align,
    valign: 'top',
    fontFace,
    fontSize: block.fontSize,
    bold: block.fontWeight >= 700,
    italic: false,
    color: stripHash(block.color),
    // Tracking: pptxgenjs charSpacing is in points; convert from em.
    charSpacing: Math.round(block.tracking * block.fontSize * 10) / 10,
    lineSpacingMultiple: block.lineHeight,
    wrap: true,
    margin: 0,
  };
}

export interface ExportResult {
  path: string;
  slideCount: number;
  textBoxCount: number;
}

export interface ExportBufferResult {
  buffer: Buffer;
  slideCount: number;
  textBoxCount: number;
}

function buildPresentation(deck: Deck): { pptx: PptxGenJS; slideCount: number; textBoxCount: number } {
  const system = getSystem(deck.meta.system);

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: LAYOUT_16x9, width: SLIDE_WIDTH_IN, height: SLIDE_HEIGHT_IN });
  pptx.layout = LAYOUT_16x9;
  pptx.title = deck.meta.title;
  // Provenance travels in the core properties (File > Info), never on slides.
  pptx.author = deck.meta.generatedBy;
  pptx.company = 'Typodeck';
  const prov = deck.meta.provenance;
  if (prov?.repo) {
    const pin = prov.sha ? prov.sha.slice(0, 12) : (prov.branch ?? '?');
    pptx.subject = `source: ${prov.repo}@${pin}`;
  }

  let textBoxCount = 0;
  for (const slide of deck.slides) {
    const pSlide = pptx.addSlide();
    // Background fill only — the single allowed background primitive.
    pSlide.background = { color: stripHash(slide.background) };
    for (const block of slide.blocks) {
      const face = block.fontFace ?? fontFaceFor(system, block.role);
      // The ONLY drawing call in the exporter: native editable text boxes.
      pSlide.addText(block.content, textOptions(block, face));
      textBoxCount += 1;
    }
    // Speaker notes travel in the native notes part — never on slides.
    if (slide.notes !== undefined && slide.notes.length > 0) {
      pSlide.addNotes(slide.notes);
    }
  }
  return { pptx, slideCount: deck.slides.length, textBoxCount };
}

/**
 * Export a validated deck to an editable .pptx file.
 * Only slide.addText (native text boxes) and slide background fill are used.
 */
export async function exportToPptx(deckInput: unknown, outPath: string): Promise<ExportResult> {
  const deck: Deck = validateDeck(deckInput);
  const { pptx, slideCount, textBoxCount } = buildPresentation(deck);

  await pptx.writeFile({ fileName: outPath });
  return { path: outPath, slideCount: deck.slides.length, textBoxCount };
}

/**
 * Export a validated deck to in-memory .pptx bytes (for the Web Studio
 * download route — no temp files). Same content as exportToPptx.
 */
export async function exportToPptxBuffer(deckInput: unknown): Promise<ExportBufferResult> {
  const deck: Deck = validateDeck(deckInput);
  const { pptx, slideCount, textBoxCount } = buildPresentation(deck);

  const out = await pptx.write({ outputType: 'nodebuffer' });
  const buffer = Buffer.isBuffer(out) ? out : Buffer.from(out as Uint8Array);
  return { buffer, slideCount: deck.slides.length, textBoxCount };
}
