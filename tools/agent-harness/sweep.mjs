// Coverage sweep: run the harness for every design x {en, ko}, collect statuses.
// Usage: node sweep.mjs [--langs=en,ko] [--out=DIR] [--contentDir=DIR]
// Writes <out>/<slug>-<lang>/{slides,report.json} + <out>/coverage.json.
// Honest statuses per design-lang: PASS (7/7), PARTIAL (n/7 + failing slides),
// ERROR (harness exit != 0 / crash).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');

/**
 * Honest per-design-lang classification (pure: unit-tested in tests/sweep.test.mjs).
 * A stale report.json from an earlier sweep must never mask a current-run
 * crash: generate exits 0 only after writing a PASS report and 1 only after
 * writing a FAIL report, so any other exit (2 = input/spec crash, null =
 * killed/timed out) is an ERROR even when a previous report is readable.
 * The stale counts ride along for context, never as the verdict.
 */
export function classifyEntry({ status, stderr, report }) {
  const tail = (stderr ?? '').slice(-300);
  if (!report || typeof report !== 'object') {
    return { status: 'ERROR', pass: '0/7', exit: status ?? null, tail };
  }
  const slides = report.slides ?? [];
  const fails = slides.filter((s) => s.status !== 'PASS').map((s) => s.file);
  const npass = slides.filter((s) => s.status === 'PASS').length;
  if (status !== 0 && status !== 1) {
    return {
      status: 'ERROR', pass: `${npass}/7`, builder: report.builder ?? 'unknown',
      failing: fails, exit: status ?? null, tail,
    };
  }
  return {
    status: report.status === 'PASS' ? 'PASS' : 'PARTIAL',
    pass: `${npass}/7`, builder: report.builder ?? 'unknown',
    failing: fails, exit: status,
  };
}

function main() {
  const flag = (name, fb) => {
    const hit = process.argv.find((a) => a.startsWith(`${name}=`));
    return hit ? hit.slice(name.length + 1) : fb;
  };

  const langs = flag('--langs', 'en,ko').split(',').map((s) => s.trim()).filter(Boolean);
  const outRoot = path.resolve(REPO, flag('--out', 'evals/hackathon/coverage'));
  const contentDir = path.resolve(REPO, flag('--contentDir', 'evals/hackathon/harness-proof'));
  const idx = JSON.parse(fs.readFileSync(path.join(REPO, 'bold-template-pack', 'selection-index.json'), 'utf8'));
  const slugs = idx.templates.map((t) => t.slug);
  const contentFor = (lang) => {
    const cand = path.join(contentDir, `proof-content.${lang}.json`);
    if (fs.existsSync(cand)) return cand;
    const alt = path.join(contentDir, `content-${lang}.json`);
    if (fs.existsSync(alt)) return alt;
    return cand;
  };

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
      let report = null;
      try {
        report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
      } catch { /* missing/unreadable report: classifyEntry reports ERROR */ }
      const entry = classifyEntry({ status: run.status, stderr: run.stderr, report });
      coverage.designs[slug][lang] = entry;
      console.log(`${key}: ${entry.status} ${entry.pass ?? ''} (exit ${entry.exit})`);
      fs.writeFileSync(path.join(outRoot, 'coverage.json'), JSON.stringify(coverage, null, 1));
    }
  }
  coverage.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(outRoot, 'coverage.json'), JSON.stringify(coverage, null, 1));
  const vals = Object.values(coverage.designs).flatMap((d) => Object.values(d));
  console.log(`DONE en+ko: PASS=${vals.filter((v) => v.status === 'PASS').length} PARTIAL=${vals.filter((v) => v.status === 'PARTIAL').length} ERROR=${vals.filter((v) => v.status === 'ERROR').length}`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main();
