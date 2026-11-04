// Typodeck Phase 2 — demo CLI: build a PPTX deck from a repo or an idea.
// Usage:
//   node dist/scripts/make-deck.js --repo owner/repo --system swiss --out out.pptx [--purpose ..] [--preset P04] [--lang ko|en]
//   node dist/scripts/make-deck.js --idea "..." --system editorial --out out.pptx
//   node dist/scripts/make-deck.js --idea-file path.txt --system expressive --out out.pptx
//   node dist/scripts/make-deck.js --idea-file path.txt --system swiss --out out.pptx --critique
//   node dist/scripts/make-deck.js --idea-file path.txt --system swiss --out out.pptx --revise[=N]
//   node dist/scripts/make-deck.js --idea-file path.txt --template fika --out out.pptx
//   node dist/scripts/make-deck.js --list-templates
// Prints the provider used + warnings; exits non-zero on validation failure.
// --critique appends an advisory critique receipt (exit code unchanged).
// --revise[=N] (default N=3) exports the bounded-revision deck instead.
// --template slug selects a Typo Pack candidate (experimental): the template's
// base system lays out the deck and the template's fonts/colors theme it.
// Geometry comes from the base system, not the template's HTML specimen.
import { existsSync, promises as fs } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { critiqueDeck, reviseDeck, type CriticReport } from '../src/critic';
import { exportToPptx } from '../src/export';
import { planDeck, type PlanDeckInput } from '../src/narrative';
import { SYSTEM_IDS, type SystemId } from '../src/systems';
import {
  layoutDeckWithTemplate,
  parseSelectionIndex,
  resolveTemplateDesign,
  selectTypoPack,
  systemIdForEntry,
  type TemplatePackEntry,
} from '../src/template-pack';
import { validatePptx } from '../src/validate';

function usage(): string {
  return [
    'Usage: make-deck --repo owner/repo | --idea "..." | --idea-file path',
    '               (--system editorial|swiss|expressive|document | --template slug)',
    '               --out file.pptx',
    '               [--purpose text] [--preset P01..P10] [--lang ko|en]',
    '               [--critique] [--revise[=N]]',
    '       make-deck --list-templates',
    '       make-deck --suggest [--preset P01..P10] [--density low|medium|high]',
    '                       [--formality low|medium|high] [--content-types a,b]',
    '                       [--mood a,b] [--lang ko|en] [--top N]',
  ].join('\n');
}

/** Typo Pack index, canonical name first, legacy name as fallback. */
const PACK_INDEX_CANDIDATES = [
  join('typo-pack', 'selection-index.json'),
  join('bold-template-pack', 'selection-index.json'),
];

/** Walk up from the cwd to the checkout root carrying the Typo Pack. */
function findPackRoot(): { root: string; indexRel: string } | null {
  let dir = process.cwd();
  for (;;) {
    for (const indexRel of PACK_INDEX_CANDIDATES) {
      if (existsSync(join(dir, indexRel))) return { root: dir, indexRel };
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

async function loadPackEntries(): Promise<{ root: string; entries: TemplatePackEntry[] }> {
  const found = findPackRoot();
  if (found === null) {
    throw new Error('Typo Pack not found: run from a TypoPPT checkout (typo-pack/selection-index.json)');
  }
  let entries: TemplatePackEntry[];
  try {
    entries = parseSelectionIndex(JSON.parse(await fs.readFile(join(found.root, found.indexRel), 'utf8')));
  } catch (err) {
    throw new Error(`Typo Pack index unreadable: ${err instanceof Error ? err.message : String(err)}`);
  }
  return { root: found.root, entries };
}

/** Resolve a template slug to its entry + design.md text (same guards as POST /api/export). */
async function loadTemplate(slug: string): Promise<{ entry: TemplatePackEntry; designMarkdown: string }> {
  const { root, entries } = await loadPackEntries();
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) {
    throw new Error(`unknown template "${slug.slice(0, 64)}" (see --list-templates)`);
  }
  // designPath comes from the on-disk index, not the CLI caller; still contain it.
  const designAbs = resolve(root, entry.designPath);
  if (designAbs !== root && !designAbs.startsWith(root + sep)) {
    throw new Error(`template "${entry.slug}" design path escapes the pack root`);
  }
  try {
    return { entry, designMarkdown: await fs.readFile(designAbs, 'utf8') };
  } catch (err) {
    throw new Error(`template "${entry.slug}" design file unreadable: ${err instanceof Error ? err.message : String(err)}`);
  }
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

  if (args.includes('--list-templates')) {
    try {
      const { entries } = await loadPackEntries();
      for (const e of entries) {
        const blurb = e.bestFor ? ` — ${e.bestFor}` : '';
        console.log(`${e.slug} [${e.scheme}/${e.density}, base ${systemIdForEntry(e)}]${blurb}`);
      }
    } catch (err) {
      console.error(`failed: ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
    return;
  }

  if (args.includes('--suggest')) {
    try {
      const { entries } = await loadPackEntries();
      const csv = (v: string | undefined): string[] | undefined =>
        v === undefined ? undefined : v.split(',').map((s) => s.trim()).filter((s) => s !== '');
      const topRaw = argValue(args, '--top');
      if (topRaw !== undefined && (!/^\d+$/.test(topRaw) || Number(topRaw) < 1)) {
        console.error('--top N requires a positive integer');
        console.error(usage());
        process.exit(2);
      }
      const picks = selectTypoPack(entries, {
        purpose: argValue(args, '--preset'),
        density: argValue(args, '--density') as 'low' | 'medium' | 'high' | undefined,
        formality: argValue(args, '--formality') as 'low' | 'medium' | 'high' | undefined,
        lang: argValue(args, '--lang'),
        contentTypes: csv(argValue(args, '--content-types')),
        mood: csv(argValue(args, '--mood')),
        top: topRaw === undefined ? undefined : Number(topRaw),
      });
      for (const p of picks) {
        console.log(`${p.slug} [${p.scheme}, base ${p.baseSystem}] score=${p.score} — ${p.reasons.join('; ') || 'no filters matched'}`);
      }
    } catch (err) {
      console.error(`failed: ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
    return;
  }

  const repoArg = argValue(args, '--repo');
  const ideaArg = argValue(args, '--idea');
  const ideaFileArg = argValue(args, '--idea-file');
  const systemArg = argValue(args, '--system');
  const templateArg = argValue(args, '--template');
  const outArg = argValue(args, '--out');
  const purpose = argValue(args, '--purpose');
  const preset = argValue(args, '--preset');
  const lang = argValue(args, '--lang') ?? 'en';

  const wantCritique = args.includes('--critique');
  const reviseOpt = reviseAttempts(args);

  const modes = [repoArg, ideaArg, ideaFileArg].filter((v) => v !== undefined);
  if (modes.length !== 1 || (!systemArg && !templateArg) || !outArg) {
    console.error(usage());
    process.exit(2);
  }
  if (systemArg && templateArg) {
    console.error('--system and --template are mutually exclusive: a template already selects its base system');
    console.error(usage());
    process.exit(2);
  }
  if (reviseOpt === 'invalid') {
    console.error('--revise[=N] requires a positive integer N (default 3)');
    console.error(usage());
    process.exit(2);
  }
  if (templateArg && reviseOpt !== undefined) {
    console.error('--revise cannot be combined with --template yet: revision replays the base system and would drop the theme');
    console.error(usage());
    process.exit(2);
  }
  if (systemArg && !(SYSTEM_IDS as readonly string[]).includes(systemArg)) {
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
    let template: { entry: TemplatePackEntry; designMarkdown: string } | undefined;
    let effectiveSystem = systemArg as SystemId;
    if (templateArg) {
      template = await loadTemplate(templateArg);
      effectiveSystem = resolveTemplateDesign(template.entry, template.designMarkdown).systemId;
    }
    const result = await planDeck(input, { system: effectiveSystem, purpose, preset, lang });
    let deck = result.deck;
    let critique: CritiqueReceipt | undefined;
    let reviseProvenance: string[] = [];
    if (template) {
      // Re-lay the planned narrative through the template's visual identity.
      // Geometry comes from the template's base system; fonts/colors from the template.
      deck = layoutDeckWithTemplate(result.narrative, template.entry, template.designMarkdown);
    } else if (reviseOpt !== undefined) {
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
    if (template) console.log(`template: ${template.entry.slug} (base system ${effectiveSystem}, experimental)`);
    if (template) console.log('warning: template geometry comes from the base system, not the HTML specimen (see evals/design-quality/results-pptx.md)');
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
