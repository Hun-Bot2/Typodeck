// Coverage sweep: run the harness for every design x {en, ko}, collect statuses.
// Usage: node sweep.mjs [--langs=en,ko] [--out=DIR]
// Writes <out>/<slug>-<lang>/{slides,report.json} + <out>/coverage.json.
// Honest statuses per design-lang: PASS (7/7), PARTIAL (n/7 + failing slides),
// ERROR (harness exit != 0 / crash).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const flag = (name, fb) => {
  const hit = process.argv.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : fb;
};

const langs = flag('--langs', 'en,ko').split(',').map((s) => s.trim()).filter(Boolean);
const outRoot = path.resolve(REPO, flag('--out', 'evals/hackathon/coverage'));
const idx = JSON.parse(fs.readFileSync(path.join(REPO, 'typo-pack', 'selection-index.json'), 'utf8'));
const slugs = idx.templates.map((t) => t.slug);
const contentFor = (lang) => path.join(REPO, 'evals', 'hackathon', 'harness-proof', `proof-content.${lang}.json`);

const coverage = { startedAt: new Date().toISOString(), langs, designs: {} };
for (const slug of slugs) {
  coverage.designs[slug] = {};
  for (const lang of langs) {
    const out = path.join(outRoot, `${slug}-${lang}`);
    const run = spawnSync('node', [
      path.join(HERE, 'generate.mjs'), '--design', slug, '--lang', lang,
      '--content', contentFor(lang), '--out', out,
    ], { encoding: 'utf8', timeout: 600000 });
    const key = `${slug}-${lang}`;
    let entry;
    try {
      const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
      const fails = (report.slides ?? []).filter((s) => s.status !== 'PASS').map((s) => s.file);
      entry = {
        status: report.status === 'PASS' ? 'PASS' : 'PARTIAL',
        pass: `${(report.slides ?? []).filter((s) => s.status === 'PASS').length}/7`,
        builder: report.builder ?? 'unknown',
        failing: fails,
        exit: run.status,
      };
    } catch {
      entry = { status: 'ERROR', pass: '0/7', exit: run.status, tail: (run.stderr ?? '').slice(-300) };
    }
    coverage.designs[slug][lang] = entry;
    console.log(`${key}: ${entry.status} ${entry.pass ?? ''} (exit ${entry.exit})`);
    fs.writeFileSync(path.join(outRoot, 'coverage.json'), JSON.stringify(coverage, null, 1));
  }
}
coverage.finishedAt = new Date().toISOString();
fs.writeFileSync(path.join(outRoot, 'coverage.json'), JSON.stringify(coverage, null, 1));
const vals = Object.values(coverage.designs).flatMap((d) => Object.values(d));
console.log(`DONE en+ko: PASS=${vals.filter((v) => v.status === 'PASS').length} PARTIAL=${vals.filter((v) => v.status === 'PARTIAL').length} ERROR=${vals.filter((v) => v.status === 'ERROR').length}`);
