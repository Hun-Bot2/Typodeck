// Example 04 — offline evidence report from real Core APIs (no network).
// Real input: packages/core/fixtures/idea-f4.txt. Builds the report the
// Skill owes every delivery (references/export.md § Evidence report).
// Prerequisite: npm run build -w @typodeck/core (EXAMPLES.sh does this).
// Usage: node examples/04-evidence-report.mjs [OUT_DIR]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..', '..');
const distEntry = path.join(root, 'packages/core/dist/src/index.js');
if (!existsSync(distEntry)) {
  console.error('FAIL 04: core not built — run: npm run build -w @typodeck/core');
  process.exit(1);
}
const core = await import(distEntry);
const { planDeck, displayStatus, formatRef, captionFor } = core;

const outDir = process.argv[2] ?? '/tmp/typodeck-skill';
mkdirSync(outDir, { recursive: true });

const fixture = path.join(root, 'packages/core/fixtures/idea-f4.txt');
const text = readFileSync(fixture, 'utf8');
const result = await planDeck({ type: 'idea', text }, { system: 'swiss' });
const { provenance, claims, deck, narrative } = result;
if (claims.length === 0) {
  console.error('FAIL 04: zero claims extracted');
  process.exit(1);
}

const lines = [
  '# Evidence report (example 04, offline)',
  '',
  `- fixture: packages/core/fixtures/idea-f4.txt (${text.length} chars)`,
  `- provider: ${provenance.provider} (generated_by=${provenance.generatedBy})`,
  `- claims: total=${provenance.claims.total} verified=${provenance.claims.verified} ` +
    `suggestion=${provenance.claims.suggestion} ungrounded=${provenance.claims.ungrounded}`,
  `- quality: ${provenance.quality.pass ? 'pass' : 'review'} overall=${provenance.quality.overall} ` +
    `errors=${provenance.quality.errors} warnings=${provenance.quality.warnings}`,
  `- deck: ${deck.slides.length} slides, system=${deck.meta.system}@${deck.meta.systemVersion} title="${narrative.title}"`,
  ...provenance.warnings.map((w) => `- warning: ${w}`),
  '',
  '| id | kind | status | numbers | refs | text |',
  '|----|------|--------|---------|------|------|',
  ...claims.map((c) => {
    const nums = c.numbers.length > 0 ? c.numbers.join(', ') : '—';
    const refs = c.refs.length > 0 ? c.refs.map(formatRef).join('; ') : '—';
    const safe = c.text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    return `| ${c.id} | ${c.kind} | ${displayStatus(c)} | ${nums} | ${refs} | ${safe} |`;
  }),
  '',
  `captions: ${claims.map((c) => captionFor(c, 'en')).join(' ‖ ')}`,
  '',
];
const reportPath = path.join(outDir, '04-evidence-report.md');
writeFileSync(reportPath, lines.join('\n'));
console.log(`provider: ${provenance.provider} (generated_by=${provenance.generatedBy})`);
console.log(
  `claims: total=${provenance.claims.total} verified=${provenance.claims.verified} ` +
    `suggestion=${provenance.claims.suggestion} ungrounded=${provenance.claims.ungrounded}`,
);
console.log(`report: ${claims.length} claims -> ${reportPath}`);
console.log('PASS 04: evidence report written from live pipeline receipts');
