// Typodeck Phase 2 — demo CLI: build a PPTX deck from a repo or an idea.
// Usage:
//   node dist/scripts/make-deck.js --repo owner/repo --system swiss --out out.pptx [--purpose ..] [--preset P04] [--lang ko|en]
//   node dist/scripts/make-deck.js --idea "..." --system editorial --out out.pptx
//   node dist/scripts/make-deck.js --idea-file path.txt --system expressive --out out.pptx
//   node dist/scripts/make-deck.js --idea-file path.txt --system swiss --out out.pptx --critique
//   node dist/scripts/make-deck.js --idea-file path.txt --system swiss --out out.pptx --revise[=N]
// Prints the provider used + warnings; exits non-zero on validation failure.
// --critique appends an advisory critique receipt (exit code unchanged).
// --revise[=N] (default N=3) exports the bounded-revision deck instead.
import { promises as fs } from 'node:fs';
import { critiqueDeck, reviseDeck, type CriticReport } from '../src/critic';
import { exportToPptx } from '../src/export';
import { planDeck, type PlanDeckInput } from '../src/narrative';
import { SYSTEM_IDS, type SystemId } from '../src/systems';
import { validatePptx } from '../src/validate';

function usage(): string {
  return [
    'Usage: make-deck --repo owner/repo | --idea "..." | --idea-file path',
    '               --system editorial|swiss|expressive --out file.pptx',
    '               [--purpose text] [--preset P01..P10] [--lang ko|en]',
    '               [--critique] [--revise[=N]]',
  ].join('\n');
}

function argValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  if (i < 0 || i + 1 >= args.length) return undefined;
  return args[i + 1];
}

/** Stage-3 receipt block (C7): appended to the console receipt only when flagged. */
export interface CritiqueReceipt {
  attempts: number;
  errors: number;
  warnings: number;
  checks: string[];
}

function toCritiqueReceipt(attempts: number, report: CriticReport): CritiqueReceipt {
  const errors = report.findings.filter((f) => f.severity === 'error').length;
  const warnings = report.findings.filter((f) => f.severity === 'warning').length;
  const checks = [...new Set(report.findings.map((f) => f.check))].sort();
  return { attempts, errors, warnings, checks };
}

function formatCritiqueReceipt(c: CritiqueReceipt): string {
  return `critique: attempts=${c.attempts} errors=${c.errors} warnings=${c.warnings} checks=${c.checks.length > 0 ? c.checks.join(',') : '-'}`;
}

/** Parse `--revise` (default 3) / `--revise=N`. Returns undefined when absent. */
function reviseAttempts(args: string[]): number | undefined | 'invalid' {
  for (const a of args) {
    if (a === '--revise') return 3;
    if (a.startsWith('--revise=')) {
      const n = Number(a.slice('--revise='.length));
      if (!Number.isInteger(n) || n < 1) return 'invalid';
      return n;
    }
  }
  return undefined;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const repoArg = argValue(args, '--repo');
  const ideaArg = argValue(args, '--idea');
  const ideaFileArg = argValue(args, '--idea-file');
  const systemArg = argValue(args, '--system');
  const outArg = argValue(args, '--out');
  const purpose = argValue(args, '--purpose');
  const preset = argValue(args, '--preset');
  const lang = argValue(args, '--lang') ?? 'en';

  const wantCritique = args.includes('--critique');
  const reviseOpt = reviseAttempts(args);

  const modes = [repoArg, ideaArg, ideaFileArg].filter((v) => v !== undefined);
  if (modes.length !== 1 || !systemArg || !outArg) {
    console.error(usage());
    process.exit(2);
  }
  if (reviseOpt === 'invalid') {
    console.error('--revise[=N] requires a positive integer N (default 3)');
    console.error(usage());
    process.exit(2);
  }
  if (!(SYSTEM_IDS as readonly string[]).includes(systemArg)) {
    console.error(`unknown --system "${systemArg}" (want ${SYSTEM_IDS.join('|')})`);
    process.exit(2);
  }

  let input: PlanDeckInput;
  if (repoArg) {
    const parts = repoArg.split('/');
    if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
      console.error(`--repo must be owner/repo, got "${repoArg}"`);
      process.exit(2);
    }
    input = { type: 'repo', owner: parts[0], repo: parts[1] };
  } else if (ideaArg !== undefined) {
    input = { type: 'idea', text: ideaArg };
  } else {
    const text = await fs.readFile(ideaFileArg as string, 'utf8');
    input = { type: 'idea', text };
  }

  try {
    const result = await planDeck(input, { system: systemArg as SystemId, purpose, preset, lang });
    let deck = result.deck;
    let critique: CritiqueReceipt | undefined;
    let reviseProvenance: string[] = [];
    if (reviseOpt !== undefined) {
      const revised = reviseDeck(result.narrative, systemArg as SystemId, { maxAttempts: reviseOpt });
      deck = revised.deck;
      reviseProvenance = revised.provenance;
      const finalReport = revised.reports[revised.reports.length - 1];
      critique = toCritiqueReceipt(revised.attempts, finalReport);
    }
    const res = await exportToPptx(deck, outArg);
    const expectedChars = deck.slides
      .flatMap((s) => s.blocks)
      .reduce((a, b) => a + b.content.length, 0);
    const check = await validatePptx(outArg, expectedChars);

    console.log(`provider: ${result.provenance.provider} (generated_by=${result.provenance.generatedBy})`);
    console.log(
      `claims: total=${result.provenance.claims.total} verified=${result.provenance.claims.verified} ` +
        `suggestion=${result.provenance.claims.suggestion} ungrounded=${result.provenance.claims.ungrounded}`,
    );
    const q = result.provenance.quality;
    console.log(
      `quality: ${q.pass ? 'pass' : 'review'} overall=${q.overall} errors=${q.errors} warnings=${q.warnings}`,
    );
    console.log(`deck: ${res.slideCount} slides, ${res.textBoxCount} text boxes -> ${res.path}`);
    for (const line of reviseProvenance) console.log(`revise: ${line}`);
    for (const w of result.provenance.warnings) console.log(`warning: ${w}`);
    if (wantCritique && critique === undefined) {
      critique = toCritiqueReceipt(1, critiqueDeck(deck));
    }
    if (critique !== undefined) console.log(formatCritiqueReceipt(critique));
    if (!check.ok) {
      for (const e of check.errors) console.error(`validation error: ${e}`);
      process.exit(1);
    }
    console.log('validation: OK');
  } catch (err) {
    console.error(`failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

void main();
