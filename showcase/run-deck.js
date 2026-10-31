// Typodeck demo-evidence runner (showcase-only, NOT part of packages/core).
// Wraps the real pipeline (planDeck -> exportToPptx -> validatePptx) and emits
// machine-readable provenance plus a deck JSON for the HTML filmstrip.
// Usage:
//   node showcase/run-deck.js --repo owner/repo --system swiss \
//     --purpose "..." --lang en --out showcase/decks/x.pptx --json showcase/decks/x.json
'use strict';
const { promises: fs } = require('node:fs');
const path = require('node:path');

const CORE = path.join(__dirname, '..', 'packages', 'core', 'dist', 'src');
const { planDeck } = require(path.join(CORE, 'narrative'));
const { exportToPptx } = require(path.join(CORE, 'export'));
const { validatePptx } = require(path.join(CORE, 'validate'));

function argValue(args, flag) {
  const i = args.indexOf(flag);
  if (i < 0 || i + 1 >= args.length) return undefined;
  return args[i + 1];
}

async function main() {
  const args = process.argv.slice(2);
  const repoArg = argValue(args, '--repo');
  const system = argValue(args, '--system');
  const out = argValue(args, '--out');
  const jsonOut = argValue(args, '--json');
  const purpose = argValue(args, '--purpose');
  const lang = argValue(args, '--lang') || 'en';
  if (!repoArg || !system || !out || !jsonOut) {
    console.error('usage: run-deck.js --repo o/r --system s --out a.pptx --json a.json [--purpose p] [--lang l]');
    process.exit(2);
  }
  const [owner, repo] = repoArg.split('/');
  if (!owner || !repo) {
    console.error(`--repo must be owner/repo, got "${repoArg}"`);
    process.exit(2);
  }
  try {
    const result = await planDeck({ type: 'repo', owner, repo }, { system, purpose, lang });
    const res = await exportToPptx(result.deck, out);
    const expectedChars = result.deck.slides
      .flatMap((s) => s.blocks)
      .reduce((a, b) => a + b.content.length, 0);
    const check = await validatePptx(out, expectedChars);
    await fs.writeFile(jsonOut, JSON.stringify(result.deck, null, 2) + '\n');

    const ing = result.ingested;
    const report = {
      repo: `${owner}/${repo}`,
      url: `https://github.com/${owner}/${repo}`,
      branch: ing.kind === 'repo' ? ing.branch : null,
      treeSha: ing.kind === 'repo' ? ing.sha : null,
      files: ing.files.map((f) => ({ path: f.path, bytes: f.bytes, lines: f.lines, truncated: f.truncated })),
      totalBytes: ing.files.reduce((a, f) => a + f.bytes, 0),
      degraded: ing.kind === 'repo' ? ing.degraded : false,
      purpose: purpose || null,
      lang,
      system,
      seed: result.deck.meta.seed,
      provider: result.provenance.provider,
      generatedBy: result.provenance.generatedBy,
      claims: result.provenance.claims,
      warnings: result.provenance.warnings,
      pptx: { path: out, slideCount: res.slideCount, textBoxCount: res.textBoxCount },
      validation: { ok: check.ok, errors: check.errors, stats: check.stats },
    };
    console.log(JSON.stringify(report, null, 2));
    if (!check.ok) process.exit(1);
  } catch (err) {
    console.error(JSON.stringify({ error: err && err.code ? `${err.code}: ${err.message}` : String(err) }));
    process.exit(1);
  }
}

main();
