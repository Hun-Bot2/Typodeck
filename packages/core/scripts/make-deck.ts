// Typodeck Phase 2 — demo CLI: build a PPTX deck from a repo or an idea.
// Usage:
//   node dist/scripts/make-deck.js --repo owner/repo --system swiss --out out.pptx [--purpose ..] [--lang ko|en]
//   node dist/scripts/make-deck.js --idea "..." --system editorial --out out.pptx
//   node dist/scripts/make-deck.js --idea-file path.txt --system expressive --out out.pptx
// Prints the provider used + warnings; exits non-zero on validation failure.
import { promises as fs } from 'node:fs';
import { exportToPptx } from '../src/export';
import { planDeck, type PlanDeckInput } from '../src/narrative';
import { SYSTEM_IDS, type SystemId } from '../src/systems';
import { validatePptx } from '../src/validate';

function usage(): string {
  return [
    'Usage: make-deck --repo owner/repo | --idea "..." | --idea-file path',
    '               --system editorial|swiss|expressive --out file.pptx',
    '               [--purpose text] [--lang ko|en]',
  ].join('\n');
}

function argValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  if (i < 0 || i + 1 >= args.length) return undefined;
  return args[i + 1];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const repoArg = argValue(args, '--repo');
  const ideaArg = argValue(args, '--idea');
  const ideaFileArg = argValue(args, '--idea-file');
  const systemArg = argValue(args, '--system');
  const outArg = argValue(args, '--out');
  const purpose = argValue(args, '--purpose');
  const lang = argValue(args, '--lang') ?? 'en';

  const modes = [repoArg, ideaArg, ideaFileArg].filter((v) => v !== undefined);
  if (modes.length !== 1 || !systemArg || !outArg) {
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
    const result = await planDeck(input, { system: systemArg as SystemId, purpose, lang });
    const res = await exportToPptx(result.deck, outArg);
    const expectedChars = result.deck.slides
      .flatMap((s) => s.blocks)
      .reduce((a, b) => a + b.content.length, 0);
    const check = await validatePptx(outArg, expectedChars);

    console.log(`provider: ${result.provenance.provider} (generated_by=${result.provenance.generatedBy})`);
    console.log(
      `claims: total=${result.provenance.claims.total} verified=${result.provenance.claims.verified} ` +
        `suggestion=${result.provenance.claims.suggestion} ungrounded=${result.provenance.claims.ungrounded}`,
    );
    console.log(`deck: ${res.slideCount} slides, ${res.textBoxCount} text boxes -> ${res.path}`);
    for (const w of result.provenance.warnings) console.log(`warning: ${w}`);
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
