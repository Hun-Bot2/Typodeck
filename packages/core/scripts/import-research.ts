// Typodeck research import CLI: researcher JSONL -> candidate specs JSON.
//
//   node dist/scripts/import-research.js --input records.jsonl --out specs.json
//     [--min-grade A|B|C|D] [--include-not-transferable]
//
// Reads ONLY the caller-supplied input path (never research/ directly).
// Writes ONLY the caller-supplied output path. Exit 1 on any invalid
// record (nothing written); exit 2 on usage errors.
import { promises as fs } from 'node:fs';
import { importResearchRecords } from '../src/research-import';

function argValue(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : undefined;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const input = argValue(args, '--input');
  const out = argValue(args, '--out');
  const minGrade = argValue(args, '--min-grade') as 'A' | 'B' | 'C' | 'D' | undefined;
  const includeNotTransferable = args.includes('--include-not-transferable');
  if (!input || !out) {
    console.error('usage: import-research.js --input <records.jsonl> --out <specs.json> [--min-grade A|B|C|D] [--include-not-transferable]');
    process.exitCode = 2;
    return;
  }
  if (minGrade && !['A', 'B', 'C', 'D'].includes(minGrade)) {
    console.error(`invalid --min-grade "${minGrade}" (want A|B|C|D)`);
    process.exitCode = 2;
    return;
  }
  let text: string;
  try {
    text = await fs.readFile(input, 'utf8');
  } catch (e) {
    console.error(`cannot read input: ${e instanceof Error ? e.message : String(e)}`);
    process.exitCode = 1;
    return;
  }
  const { result, errors } = importResearchRecords(text, { minGrade, includeNotTransferable });
  if (errors.length > 0) {
    for (const e of errors.slice(0, 20)) {
      console.error(`line ${e.line}${e.ref_id ? ` (${e.ref_id})` : ''}: ${e.message}`);
    }
    if (errors.length > 20) console.error(`... and ${errors.length - 20} more`);
    console.error('wrote nothing: fix the records and retry');
    process.exitCode = 1;
    return;
  }
  await fs.writeFile(out, `${JSON.stringify({ generatedAt: new Date().toISOString(), ...result }, null, 2)}\n`);
  const s = result.stats;
  console.log(
    `imported ${result.specs.length} candidate spec(s) from ${s.lines} record(s) ` +
    `(${s.duplicates} duplicate(s), ${s.belowGrade} below grade, ${s.notTransferable} not-transferable) -> ${out}`,
  );
}

void main();
