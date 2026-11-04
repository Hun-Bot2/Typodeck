#!/usr/bin/env node
// typodeck-harness generate: design.md + content JSON -> validated 1920x1080 deck.
// Usage:
//   node generate.mjs --design <slug> --lang en|ko --content <json> --out <dir>
// Reads (repo, read-only): bold-template-pack/templates/<slug>/{design.md,locales/ko.md?}
// Writes (only): <out>/{slides/NN.html, slides/NN.png, report.json}

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseContent, contentStrings, ContentError } from './lib/content.mjs';
import { parseDesignFile, assertGridlineTokens, SpecError } from './lib/spec.mjs';
import { planDeckRoles } from './lib/roles.mjs';
import { buildSlide } from './lib/builder.mjs';
import { buildSlideGeneric } from './lib/builder-generic.mjs';
import { toTheme } from './lib/theme.mjs';
import { launchChrome, renderSlide, pngDims } from './lib/render.mjs';
import { checkDims, checkOverflow, checkClip, checkClipStage, checkVerbatim, checkFixture, checkSpec, checkSpecGeneric } from './lib/checks.mjs';
import { proposeRepair, REPAIR_ROUNDS } from './lib/repair.mjs';

// Bespoke builders keyed by slug; every other design uses the generic themed builder.
const BESPOKE = new Set(['gridline-swiss']);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const VERSION = '0.2.0';

function usage() {
  return [
    'Usage: generate.mjs --design <slug> --lang en|ko --content <json> --out <dir>',
    '  --design   template slug under bold-template-pack/templates/',
    '  --lang     en | ko (ko applies the design CJK section + locales/ko.md when present)',
    '  --content  path to content JSON (deck + slides with intent)',
    '  --out      output dir (created; receives slides/NN.{html,png} + report.json)',
    '  --port     CDP port base (default 9333; +1 per retry)',
    '  --no-repair  disable bounded repair (single render per slide)',
    '  --help     print this help',
  ].join('\n');
}

function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--no-repair') out.noRepair = true;
    else if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1];
      if (v === undefined || v.startsWith('--')) throw new Error(`flag ${a} needs a value`);
      out[k] = v;
      i++;
    } else throw new Error(`unexpected arg: ${a}`);
  }
  return out;
}

async function loadSpec(slug, lang) {
  const dir = path.join(REPO, 'bold-template-pack', 'templates', slug);
  let designText;
  try {
    designText = await fs.readFile(path.join(dir, 'design.md'), 'utf8');
  } catch {
    throw new SpecError(`design "${slug}" not found at bold-template-pack/templates/${slug}/design.md`);
  }
  const spec = parseDesignFile(designText, slug);
  let localeNote = 'no locales/ko override file; CJK rules from design.md CJK section';
  if (lang === 'ko') {
    // Optional per-locale token overrides (read when present, never required).
    // locales/ko/typography.md is prose guidance (no front-matter): presence is
    // recorded, and the builders apply the central KO stacks + CJK rules.
    for (const cand of ['locales/ko.md', 'locales/ko/design.md', 'locales/ko/typography.md']) {
      try {
        const t = await fs.readFile(path.join(dir, cand), 'utf8');
        try {
          const extra = parseDesignFile(t, `${slug}:${cand}`);
          spec.tokens = { ...spec.tokens, ...extra.tokens };
          localeNote = `applied ${cand} overrides`;
        } catch {
          localeNote = `${cand} present (prose guidance); central KO stacks applied`;
        }
        break;
      } catch { /* optional */ }
    }
  }
  return { spec, localeNote };
}

function runChecks({ png, metrics, slide, bespoke }) {
  return {
    dims: checkDims(png, pngDims),
    overflow: checkOverflow(metrics),
    clip: bespoke ? checkClip(metrics) : checkClipStage(metrics),
    verbatim: checkVerbatim(metrics, contentStrings(slide)),
    fixture: checkFixture(metrics, slide),
    spec: bespoke ? checkSpec(metrics) : checkSpecGeneric(metrics),
  };
}

const allOk = (checks) => Object.values(checks).every((c) => c.ok);

async function main() {
  const a = args(process.argv.slice(2));
  if (a.help) {
    console.log(usage());
    return;
  }
  for (const k of ['design', 'lang', 'content', 'out']) {
    if (!a[k]) {
      console.error(`missing --${k}\n${usage()}`);
      process.exit(2);
    }
  }
  if (a.lang !== 'en' && a.lang !== 'ko') {
    console.error('--lang must be en or ko');
    process.exit(2);
  }
  const outDir = path.resolve(a.out);
  const slidesDir = path.join(outDir, 'slides');

  let content;
  try {
    content = parseContent(JSON.parse(await fs.readFile(a.content, 'utf8')));
  } catch (e) {
    console.error(e instanceof ContentError ? e.message : `cannot read content: ${e.message}`);
    process.exit(2);
  }
  const { spec, localeNote } = await loadSpec(a.design, a.lang);
  const bespoke = BESPOKE.has(a.design);
  let theme = null;
  if (bespoke) {
    try {
      assertGridlineTokens(spec.tokens, a.design);
    } catch (e) {
      console.error(e.message);
      process.exit(2);
    }
  } else {
    try {
      theme = toTheme(spec.tokens, a.design);
    } catch (e) {
      console.error(e.message);
      process.exit(2);
    }
  }
  console.log(`spec: ${a.design} (${a.lang}) — ${localeNote} — builder: ${bespoke ? 'bespoke' : 'generic'}`);
  const roles = planDeckRoles(content.slides);
  roles.forEach((r, i) => console.log(`slide ${i + 1}: role=${r.role} (${r.reason})`));

  await fs.mkdir(slidesDir, { recursive: true });
  const port = Number(a.port ?? 9333);
  const chrome = await launchChrome(port);
  const reportSlides = [];
  try {
    for (let i = 0; i < content.slides.length; i++) {
      const slide = content.slides[i];
      const { role, reason } = roles[i];
      const nn = String(i + 1).padStart(2, '0');
      const htmlPath = path.join(slidesDir, `${nn}.html`);
      const pngPath = path.join(slidesDir, `${nn}.png`);
      let adjust = {};
      let repairs = [];
      let rounds = 0;
      let final = null;
      const maxRounds = a.noRepair ? 1 : REPAIR_ROUNDS + 1;
      for (let r = 0; r < maxRounds; r++) {
        rounds = r + 1;
        const built = bespoke
          ? buildSlide({ spec, slide, role, index: i, total: content.slides.length,
              deck: content.deck, lang: a.lang, adjust })
          : buildSlideGeneric({ theme, slide, role, index: i, total: content.slides.length,
              deck: content.deck, lang: a.lang, adjust });
        const { html, notes } = built;
        await fs.writeFile(htmlPath, html);
        const { png, metrics } = await renderSlide(port, `file://${htmlPath}`);
        const checks = runChecks({ png, metrics, slide, bespoke });
        final = { png, metrics, checks, notes };
        if (allOk(checks)) break;
        if (a.noRepair || r === maxRounds - 1) break;
        const failures = Object.fromEntries(
          Object.entries(checks).filter(([, c]) => !c.ok),
        );
        const proposal = proposeRepair({ failures, adjust, slide, role });
        if (!proposal) break;
        adjust = proposal.adjust;
        repairs.push(`round ${rounds}: ${proposal.applied.join(', ')}`);
      }
      await fs.writeFile(pngPath, final.png);
      const status = allOk(final.checks) ? 'PASS' : 'FAIL';
      console.log(`slide ${nn} [${role}] ${status} (${rounds} round${rounds > 1 ? 's' : ''})${repairs.length ? ` — ${repairs.join('; ')}` : ''}`);
      for (const [name, c] of Object.entries(final.checks)) {
        if (!c.ok) console.log(`    FAIL ${name}: ${c.detail}`);
      }
      reportSlides.push({
        index: i + 1,
        file: `slides/${nn}.html`,
        png: `slides/${nn}.png`,
        role,
        roleReason: reason,
        compositionNote: [...final.notes,
          ...(Object.keys(adjust).length ? [`adjustments: ${JSON.stringify(adjust)}`] : []),
        ].join('; '),
        repairs,
        rounds,
        checks: final.checks,
        status,
      });
    }
  } finally {
    await chrome.stop();
  }

  const pass = reportSlides.filter((s) => s.status === 'PASS').length;
  const report = {
    harness: VERSION,
    design: a.design,
    lang: a.lang,
    builder: bespoke ? 'bespoke' : 'generic',
    localeNote,
    createdAt: new Date().toISOString(),
    status: pass === reportSlides.length ? 'PASS' : 'FAIL',
    summary: { pass, fail: reportSlides.length - pass, total: reportSlides.length },
    slides: reportSlides,
  };
  await fs.writeFile(path.join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`report: ${path.join(outDir, 'report.json')} — ${report.status} (${pass}/${reportSlides.length})`);
  process.exit(report.status === 'PASS' ? 0 : 1);
}

main().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(2);
});
