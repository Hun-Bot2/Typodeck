// Typodeck GitHub-to-Presentation journey — reproducible end-to-end check.
// Usage:
//   node dist/scripts/journey.js --repo owner/repo [--purpose P01] [--lang en]
//                                [--out report.json] [--token-env GITHUB_TOKEN]
//
// Runs the real user journey against live GitHub: evidence inspection->
// purpose-aware generation -> PPTX export, then verifies grounding,
// HTML/PPTX parity, and editability. Prints a human summary plus a JSON
// report path. Exit 0 = pass, 1 = failed check, 2 = skipped (no quota /
// no network) or bad usage. Never invents data: every assertion reads the
// artifacts the pipeline actually produced.
import JSZip from 'jszip';
import { promises as fs } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { createMemoryCache } from '../src/ingestion';
import { displayStatus } from '../src/semantics';
import { exportToPptxBuffer } from '../src/export';
import { extractClaims } from '../src/evidence';
import { fetchRepo, IngestionError, parseRepoInput } from '../src/ingestion';
import { planDecksAll } from '../src/narrative';
import { SYSTEM_IDS } from '../src/systems';
import { validatePptxBytes } from '../src/validate';

function usage(): string {
  return [
    'Usage: journey --repo owner/repo [--purpose P01] [--lang ko|en]',
    '                [--out report.json] [--token-env VAR]',
  ].join('\n');
}

function argValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  if (i < 0 || i + 1 >= args.length) return undefined;
  return args[i + 1];
}

function norm(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function unescapeXml(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/** Per-slide text in document order, joined from every editable a:t run. */
async function pptxSlideTexts(buffer: Buffer): Promise<string[]> {
  const zip = await JSZip.loadAsync(buffer);
  const names = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]));
  const out: string[] = [];
  for (const name of names) {
    const xml = (await zip.file(name)?.async('string')) ?? '';
    const runs = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => unescapeXml(m[1]));
    out.push(norm(runs.join('')));
  }
  return out;
}

interface Check {
  name: string;
  pass: boolean;
  detail: string;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const repoArg = argValue(args, '--repo');
  const purpose = argValue(args, '--purpose') ?? 'P01';
  const lang = argValue(args, '--lang') ?? 'en';
  const outArg = argValue(args, '--out');
  const tokenEnv = argValue(args, '--token-env');
  if (!repoArg) {
    console.error(usage());
    process.exit(2);
  }
  const parsed = parseRepoInput(repoArg);
  if (!parsed) {
    console.error(`invalid --repo "${repoArg}" (want owner/repo or a github.com URL)`);
    process.exit(2);
  }
  const token =
    (tokenEnv ? (process.env[tokenEnv] ?? '').trim() : undefined) ??
    (process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '').trim() ??
    '';
  const authToken = token === '' ? undefined : token;
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'typodeck',
    ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
  };

  // 0. Quota pre-check: one cheap call so a dead quota skips honestly.
  let quota: { limit: number; remaining: number; reset: string } | null = null;
  try {
    const res = await fetch('https://api.github.com/rate_limit', { headers });
    const body = (await res.json()) as { rate?: { limit?: number; remaining?: number; reset?: number } };
    quota = {
      limit: body.rate?.limit ?? -1,
      remaining: body.rate?.remaining ?? -1,
      reset: body.rate?.reset ? new Date(body.rate.reset * 1000).toISOString() : 'unknown',
    };
  } catch (err) {
    console.log(`SKIP: could not reach GitHub (${String(err)}); no data invented.`);
    process.exit(2);
  }
  if (quota.remaining >= 0 && quota.remaining < 3) {
    console.log(`SKIP: GitHub core quota ${quota.remaining}/${quota.limit} (resets ${quota.reset}); retry later.`);
    process.exit(2);
  }

  const checks: Check[] = [];
  const check = (name: string, pass: boolean, detail: string): void => {
    checks.push({ name, pass, detail });
  };
  // The Studio shares one cache between inspect and generate; the journey
  // does the same, so the second ingest costs zero quota.
  const cache = createMemoryCache();

  // 1. Evidence phase = time to first useful preview.
  const t0 = performance.now();
  const ingested = await fetchRepo(parsed.owner, parsed.repo, { authToken, cache }).catch((err: unknown) => {
    if (err instanceof IngestionError && (err.code === 'rate-limited' || err.code === 'network')) {
      console.log(`SKIP: evidence ingest hit ${err.code}: ${err.message}`);
      process.exit(2);
    }
    throw err;
  });
  const claims = extractClaims(ingested);
  const evidenceMs = Math.round(performance.now() - t0);

  const filesByPath = new Map(ingested.files.map((f) => [f.path, f]));
  let badRefs = 0;
  let reflesNumeric = 0;
  for (const c of claims) {
    if (c.kind !== 'ungrounded' && c.refs.length === 0) badRefs += 1;
    for (const r of c.refs) {
      const f = filesByPath.get(r.path);
      if (!f) {
        badRefs += 1;
        continue;
      }
      if (r.lines) {
        const [a, b] = r.lines;
        if (a < 1 || b > f.lines || a > b) badRefs += 1;
      }
    }
    if (c.numbers.length > 0 && c.refs.length === 0) reflesNumeric += 1;
  }
  check('source-extraction', ingested.files.length > 0, `${ingested.files.length} files from ${parsed.owner}/${parsed.repo}@${ingested.branch}`);
  check('evidence-grounded', badRefs === 0, `${badRefs} claim refs outside their source files`);
  check('no-unsupported-numbers', reflesNumeric === 0, `${reflesNumeric} numeric claims without refs`);

  // 2. Generation (served from cache: same bytes the inspector reviewed).
  const t1 = performance.now();
  const gen = await planDecksAll(
    { type: 'repo', owner: parsed.owner, repo: parsed.repo },
    { purpose, lang, authToken, cache },
  );
  const generateMs = Math.round(performance.now() - t1);
  check(
    'narrative-planned',
    gen.narrative.slides.length >= 5 && gen.narrative.slides.length <= 12,
    `${gen.narrative.slides.length} slides, ${gen.claims.length} claims in play`,
  );
  check(
    'selection-pool-honest',
    gen.claims.length <= claims.length,
    `${gen.claims.length}/${claims.length} reviewed claims used`,
  );

  // 3. Export every system: validation + HTML/PPTX parity + editability.
  const t2 = performance.now();
  let parityBad = 0;
  let exportBad = 0;
  let editableChars = 0;
  const slideCount = gen.narrative.slides.length;
  for (const system of SYSTEM_IDS) {
    const deck = gen.decks[system];
    const { buffer } = await exportToPptxBuffer(deck);
    const valid = await validatePptxBytes(buffer, 100);
    if (!valid.ok) {
      exportBad += 1;
      continue;
    }
    editableChars = Math.max(editableChars, valid.stats.editableChars);
    const pptxTexts = await pptxSlideTexts(buffer);
    const deckTexts = deck.slides.map((s) => norm(s.blocks.map((b) => b.content).join('')));
    if (pptxTexts.length !== deckTexts.length) {
      parityBad += 1;
      continue;
    }
    for (let i = 0; i < pptxTexts.length; i++) {
      if (pptxTexts[i] !== deckTexts[i]) parityBad += 1;
    }
  }
  const exportMs = Math.round(performance.now() - t2);
  check('export-valid', exportBad === 0, `${SYSTEM_IDS.length - exportBad}/${SYSTEM_IDS.length} systems validate`);
  check('html-pptx-parity', parityBad === 0, `${parityBad} mismatched slide texts across ${SYSTEM_IDS.length} systems`);
  check('editable-text', editableChars >= 100, `${editableChars} editable chars in the richest export`);

  // 4. Number slides trace to verbatim claim numbers.
  const claimNumbers = new Set(gen.claims.flatMap((c) => c.numbers));
  let untraced = 0;
  for (const system of SYSTEM_IDS) {
    for (const slide of gen.decks[system].slides) {
      for (const b of slide.blocks) {
        if (b.role === 'number' && !claimNumbers.has(b.content)) untraced += 1;
      }
    }
  }
  check('number-traceability', untraced === 0, `${untraced} number blocks without a verbatim claim number`);

  const counts = {
    total: claims.length,
    verified: claims.filter((c) => c.kind === 'verified').length,
    suggestion: claims.filter((c) => c.kind === 'suggestion').length,
    ungrounded: claims.filter((c) => c.kind === 'ungrounded').length,
  };
  const statuses = claims.map((c) => displayStatus(c));
  const statusCounts: Record<string, number> = {};
  for (const s of statuses) statusCounts[s] = (statusCounts[s] ?? 0) + 1;
  const report = {
    repo: `${parsed.owner}/${parsed.repo}`,
    branch: ingested.branch,
    sha: ingested.sha,
    purpose,
    lang,
    at: new Date().toISOString(),
    quota,
    timingsMs: { evidence: evidenceMs, generate: generateMs, export: exportMs },
    requests: ingested.requests ?? null,
    files: ingested.files.map((f) => ({ path: f.path, lines: f.lines, bytes: f.bytes, truncated: f.truncated })),
    counts,
    statusCounts,
    slideCount,
    warnings: gen.provenance.warnings,
    checks,
    pass: checks.every((c) => c.pass),
  };
  const outPath = outArg ?? `/tmp/typodeck-journey-${parsed.owner}-${parsed.repo}.json`;
  await fs.writeFile(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const bottleneck =
    evidenceMs >= generateMs && evidenceMs >= exportMs
      ? 'evidence (GitHub fetch)'
      : generateMs >= exportMs
        ? 'generate (plan + layout)'
        : 'export (PPTX build)';
  console.log(`repo: ${parsed.owner}/${parsed.repo}@${ingested.branch} (${ingested.sha ?? 'unpinned'})`);
  console.log(`time to first useful preview (evidence): ${evidenceMs} ms`);
  console.log(`generate: ${generateMs} ms · export (${SYSTEM_IDS.length} systems): ${exportMs} ms`);
  console.log(`bottleneck: ${bottleneck}`);
  console.log(`claims: ${counts.total} (${counts.verified} verified / ${counts.suggestion} suggestion / ${counts.ungrounded} ungrounded)`);
  for (const c of checks) {
    console.log(`${c.pass ? 'PASS' : 'FAIL'} ${c.name}: ${c.detail}`);
  }
  console.log(`report: ${outPath}`);
  if (!report.pass) process.exit(1);
}

main().catch((err: unknown) => {
  if (err instanceof IngestionError) {
    console.error(`journey failed: [${err.code}] ${err.message}`);
    process.exit(1);
  }
  console.error(`journey failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
