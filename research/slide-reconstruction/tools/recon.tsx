// Slide-reconstruction tool (research-only, never a production template).
// Usage: node dist/recon.js <case-dir>
// Reads case.json, builds a Deck through the REAL Typodeck pipeline
// (Tier A: markdown -> IR -> narrative -> planCompositions -> layoutDeck;
// Tier B: hand-placed blocks -> validateDeck), then writes recon.html
// (SSR of the production SlideView), recon.pptx, deck.json, report.json.
// Both tiers ship only on validation: OK. No parallel renderer: HTML comes
// from apps/web/components/SlideView, PPTX from core/export.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { SlideView } from '../../../apps/web/components/SlideView.js';
import {
  exportToPptxBuffer,
  layoutDeck,
  parseSlideMarkdown,
  planCompositions,
  slideIRToNarrative,
  validateDeck,
  validatePptxBytes,
  type CompositionPlanItem,
  type Deck,
  type SystemId,
} from '../../../packages/core/src/index.js';

// Run with cwd = worktree root.
const ROOT = process.cwd();

interface CaseSpec {
  tier: 'A' | 'B';
  system: string;
  fonts?: { heading: string; body: string };
  markdown?: string;
  candidateId?: string;
  title?: string;
  thesis?: string;
  background?: string;
  blocks?: Array<Record<string, unknown>>;
}

function slideCss(): string {
  const css = readFileSync(join(ROOT, 'apps', 'web', 'app', 'globals.css'), 'utf8');
  const start = css.indexOf('/* Slide renderer');
  const end = css.indexOf('/* Viewer */', start);
  if (start < 0 || end < 0) throw new Error('slide-renderer CSS block not found');
  return css.slice(start, end);
}

async function main(): Promise<void> {
  const caseDir = resolve(process.argv[2] ?? '');
  if (!caseDir) throw new Error('usage: recon.js <case-dir>');
  const spec = JSON.parse(readFileSync(join(caseDir, 'case.json'), 'utf8')) as CaseSpec;
  let deck: Deck;
  const notes: string[] = [];
  if (spec.tier === 'A') {
    if (!spec.markdown) throw new Error('tier A needs markdown');
    const ir = parseSlideMarkdown(spec.markdown);
    const narrative = slideIRToNarrative(ir);
    const planned = planCompositions(narrative, spec.system as SystemId, {});
    let plan: CompositionPlanItem[] = planned;
    if (spec.candidateId) {
      plan = planned.map((p) => ({ ...p, candidateId: spec.candidateId as string, fallback: true }));
      notes.push(`candidate overridden to ${spec.candidateId} (engine picked ${planned.map((p) => p.candidateId).join(',') || 'none'})`);
    } else {
      notes.push(`engine candidates: ${planned.map((p) => `${p.slideId}=${p.candidateId}`).join(', ') || 'none'}`);
    }
    deck = layoutDeck(narrative, spec.system as SystemId, { compositionPlan: plan });
  } else {
    if (!spec.blocks || !spec.background || !spec.thesis) throw new Error('tier B needs blocks/background/thesis');
    deck = {
      meta: {
        title: spec.title ?? 'reconstruction',
        lang: 'en',
        system: spec.system,
        seed: 7,
        generatedBy: 'recon-research',
      },
      slides: [
        {
          id: 'r1',
          thesis: spec.thesis,
          background: spec.background,
          blocks: spec.blocks as unknown as Deck['slides'][number]['blocks'],
        },
      ],
    };
    notes.push(`hand-placed ${spec.blocks.length} blocks through schema + validators`);
  }
  validateDeck(deck);
  const slide = deck.slides[0];
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>recon</title><style>html,body{margin:0;padding:0;background:#808080}body{display:flex;align-items:center;justify-content:center;min-height:100vh}.wrap{width:min(100vw,177.78vh);max-height:100vh}${slideCss()}</style></head><body><div class="wrap">${renderToStaticMarkup(
    SlideView({ slide, system: spec.system, label: slide.thesis, fonts: spec.fonts }),
  )}</div></body></html>`;
  writeFileSync(join(caseDir, 'recon.html'), html);
  writeFileSync(join(caseDir, 'deck.json'), JSON.stringify(deck, null, 2));
  const { buffer } = await exportToPptxBuffer(deck);
  writeFileSync(join(caseDir, 'recon.pptx'), buffer);
  const expectedChars = deck.slides.flatMap((s) => s.blocks).reduce((n, b) => n + b.content.length, 0);
  const valid = await validatePptxBytes(buffer, expectedChars);
  const report = {
    tier: spec.tier,
    system: spec.system,
    validation: 'OK',
    export: valid.ok
      ? { ok: true, editableChars: valid.stats.editableChars }
      : { ok: false, errors: valid.errors },
    notes,
  };
  writeFileSync(join(caseDir, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}

main().catch((e: unknown) => {
  console.error(`recon failed: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});
