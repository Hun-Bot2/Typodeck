// Typodeck visual benchmark: fixed semantic fixtures x registry systems.
// Same Slide IR renders to editable PPTX + HTML preview per system, with
// structural gates (editability, forbidden objects, overflow, text parity).
// Aesthetic judgment stays human via decisions.json (PENDING scaffold;
// re-runs never clobber human entries).
//
//   node dist/scripts/visual-benchmark.js [--fixtures dir] [--out dir] [--seed 7]
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import JSZip from 'jszip';
import {
  escapeHtml,
  exportToPptxBuffer,
  findWorkflowTokens,
  geometrySignature,
  layoutDeck,
  listVisualSystems,
  parseSlideMarkdown,
  resolveVisualSystem,
  scaffoldDecisions,
  slideIRToNarrative,
  textParityOk,
  validatePptxBytes,
  type SlideIR,
  type SystemId,
  type Deck,
} from '../src/index';

const CANVAS_W_IN = 13.33;

function argValue(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : undefined;
}

async function extractPptxTexts(buffer: Buffer): Promise<string[]> {
  const zip = await JSZip.loadAsync(buffer as Uint8Array);
  const names = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort();
  const texts: string[] = [];
  for (const name of names) {
    const xml = await zip.file(name)?.async('string');
    if (xml === undefined) continue;
    for (const m of xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)) texts.push(m[1]);
  }
  return texts;
}

function previewHtml(ir: SlideIR, deck: Deck, fonts: { heading: string; body: string }, title: string): string {
  const blocks = deck.slides
    .map((s) =>
      s.blocks
        .map((b) => {
          const family = b.role === 'body' || b.role === 'caption' ? fonts.body : fonts.heading;
          return `<div class="block" style="left:${((b.x / CANVAS_W_IN) * 100).toFixed(3)}%;top:${((b.y / 7.5) * 100).toFixed(3)}%;width:${((b.w / CANVAS_W_IN) * 100).toFixed(3)}%;height:${((b.h / 7.5) * 100).toFixed(3)}%;font-size:${(((b.fontSize / 72) / CANVAS_W_IN) * 100).toFixed(3)}cqw;font-weight:${b.fontWeight};line-height:${b.lineHeight};letter-spacing:${b.tracking}em;text-align:${b.align};color:${escapeHtml(b.color)};font-family:${escapeHtml(family)}">${escapeHtml(b.content)}</div>`;
        })
        .join('\n'),
    )
    .join('\n');
  const bg = deck.slides[0]?.background ?? '#ffffff';
  return `<!DOCTYPE html>
<html lang="${escapeHtml(ir.lang)}">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>html,body{margin:0;padding:0;background:#888}.stage{position:relative;width:100%;aspect-ratio:16/9;container-type:inline-size;background:${escapeHtml(bg)}}.block{position:absolute;overflow:hidden;white-space:pre-wrap}</style>
</head><body><div class="stage" role="img" aria-label="${escapeHtml(ir.slides[0]?.thesis ?? title)}">
${blocks}
</div></body></html>
`;
}

interface OutputRecord {
  fixture: string;
  system: string;
  systemVersion: string;
  pptx: string;
  html: string;
  slides: number;
  editableChars: number;
  textParity: boolean;
  gatesPass: boolean;
  gateErrors: string[];
  signature: ReturnType<typeof geometrySignature>;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const root = path.resolve(__dirname, '..', '..', '..', '..');
  const fixturesDir = path.resolve(args.includes('--fixtures') ? (argValue(args, '--fixtures') as string) : path.join(root, 'evals', 'visual-benchmark', 'fixtures'));
  const outDir = path.resolve(args.includes('--out') ? (argValue(args, '--out') as string) : path.join(root, 'evals', 'visual-benchmark', 'output'));
  const seed = Number(argValue(args, '--seed') ?? '7');
  await fs.mkdir(outDir, { recursive: true });

  const fixtureFiles = (await fs.readdir(fixturesDir)).filter((f) => f.endsWith('.md')).sort();
  if (fixtureFiles.length === 0) {
    console.error(`no fixtures in ${fixturesDir}`);
    process.exitCode = 1;
    return;
  }
  const systems = listVisualSystems().filter((e) => {
    try {
      resolveVisualSystem(e.id);
      return true;
    } catch {
      console.log(`skip unrenderable system ${e.id} (${e.status})`);
      return false;
    }
  });
  if (systems.length === 0) {
    console.error('no renderable systems in registry');
    process.exitCode = 1;
    return;
  }

  const outputs: OutputRecord[] = [];
  const fonts: Record<string, { heading: string; body: string }> = {};
  for (const entry of systems) {
    const t = resolveVisualSystem(entry.id).typography;
    fonts[entry.id] = { heading: t.fonts.heading.join(', '), body: t.fonts.body.join(', ') };
  }

  for (const file of fixtureFiles) {
    const name = file.replace(/\.md$/, '');
    const ir = parseSlideMarkdown(await fs.readFile(path.join(fixturesDir, file), 'utf8'));
    const narrative = slideIRToNarrative(ir);
    const expectedTexts = ir.slides.flatMap((s) => s.blocks.map((b) => b.content));
    for (const entry of systems) {
      const tag = `${name} × ${entry.id}`;
      try {
        const deck = layoutDeck(narrative, entry.id as SystemId, { seed });
        const { buffer } = await exportToPptxBuffer(deck);
        const check = await validatePptxBytes(buffer, 1);
        const pptxTexts = await extractPptxTexts(Buffer.from(buffer));
        const parity = textParityOk(expectedTexts, pptxTexts);
        const gateErrors = [...check.errors];
        if (!parity) gateErrors.push('HTML/PPTX text parity mismatch');
        const htmlDoc = previewHtml(ir, deck, fonts[entry.id], `${name} · ${entry.id}`);
        const leaked = findWorkflowTokens(htmlDoc);
        if (leaked.length > 0) gateErrors.push(`workflow tokens in preview: ${leaked.join(', ')}`);
        const pptxName = `${name}.${entry.id}.pptx`;
        const htmlName = `${name}.${entry.id}.html`;
        await fs.writeFile(path.join(outDir, pptxName), buffer);
        await fs.writeFile(path.join(outDir, htmlName), htmlDoc);
        outputs.push({
          fixture: name,
          system: entry.id,
          systemVersion: entry.version,
          pptx: pptxName,
          html: htmlName,
          slides: deck.slides.length,
          editableChars: check.stats.editableChars,
          textParity: parity,
          gatesPass: gateErrors.length === 0,
          gateErrors,
          signature: geometrySignature(deck),
        });
        console.log(`[${outputs.length}] ${tag} ... ${gateErrors.length === 0 ? 'PASS' : `FAIL: ${gateErrors.join(' | ')}`}`);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        outputs.push({
          fixture: name, system: entry.id, systemVersion: entry.version,
          pptx: '', html: '', slides: 0, editableChars: 0, textParity: false,
          gatesPass: false, gateErrors: [message],
          signature: { slides: [] },
        });
        console.log(`[${outputs.length}] ${tag} ... ERROR: ${message}`);
      }
    }
  }

  // Contact sheet.
  const cells = outputs
    .map(
      (o) =>
        `<figure><figcaption>${escapeHtml(o.fixture)} · ${escapeHtml(o.system)} · ${o.gatesPass ? 'PASS' : 'FAIL'}</figcaption>` +
        (o.html !== '' ? `<iframe src="${escapeHtml(o.html)}" title="${escapeHtml(o.fixture)} ${escapeHtml(o.system)}"></iframe>` : '<p>no output</p>') +
        `</figure>`,
    )
    .join('\n');
  await fs.writeFile(
    path.join(outDir, 'index.html'),
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Typodeck visual benchmark</title><style>body{font-family:system-ui,sans-serif;margin:2rem}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(22rem,1fr));gap:1rem}figure{margin:0;border:1px solid #999;padding:.5rem}figcaption{font-size:.8rem;margin-bottom:.5rem}iframe{width:100%;aspect-ratio:16/9;border:1px solid #ccc}</style></head><body><h1>Typodeck visual benchmark</h1><p>${outputs.length} outputs · seed ${seed} · structural gates only (aesthetics: human review via decisions.json)</p><main>${cells}</main></body></html>\n`,
  );

  // Review decisions (merge-preserving).
  const decisionsPath = path.join(outDir, 'decisions.json');
  let existing: Parameters<typeof scaffoldDecisions>[0] = null;
  try {
    const raw = await fs.readFile(decisionsPath, 'utf8');
    const parsed = JSON.parse(raw) as { version?: unknown; systems?: unknown };
    if (parsed.version !== '1.0.0' || !Array.isArray(parsed.systems)) {
      throw new Error('unrecognized decisions file shape');
    }
    existing = parsed as Parameters<typeof scaffoldDecisions>[0];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`refusing to overwrite unreadable ${decisionsPath}: ${(e as Error).message}`);
      process.exitCode = 1;
      return;
    }
  }
  const decisions = scaffoldDecisions(
    existing,
    systems.map((e) => ({ id: e.id, version: e.version })),
  );
  await fs.writeFile(decisionsPath, `${JSON.stringify(decisions, null, 2)}\n`);

  const summary = {
    generatedAt: new Date().toISOString(),
    seed,
    fixtures: fixtureFiles,
    systems: systems.map((e) => ({ id: e.id, version: e.version, status: e.status })),
    fontInventory: fonts,
    outputs,
    gatesPass: outputs.filter((o) => o.gatesPass).length,
    gatesTotal: outputs.length,
    notes: [
      'Fixed semantic fixtures render identically across systems; only typography/geometry differ.',
      'Font inventory documents fallback chains statically; rendered substitution needs visual review.',
      'Rasterized PPTX-vs-HTML comparison is NOT performed (no in-repo rasterizer); text parity is structural.',
    ],
  };
  await fs.writeFile(path.join(outDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`\n${summary.gatesPass}/${summary.gatesTotal} outputs passed structural gates -> ${outDir}`);
  if (summary.gatesPass !== summary.gatesTotal) process.exitCode = 1;
}

void main();
