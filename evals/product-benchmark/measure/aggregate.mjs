// Merge per-deck metrics + overflow + sidecars + timings into results.json.
// Adds cross-system B diversity (eval.ts pairwiseDiversity thresholds).
// Run: node aggregate.mjs <outDir> <numbersJson> <quotaProbe>
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

function pairwise(a, b) {
  const blocksDiffer = Math.abs(a.meanBlocksPerSlide - b.meanBlocksPerSlide) >= 0.5;
  const denom = Math.max(a.medianHeadlineSize, b.medianHeadlineSize);
  const headlineDiffer = denom > 0 && Math.abs(a.medianHeadlineSize - b.medianHeadlineSize) / denom >= 0.15;
  const al = Math.abs(a.alignmentMix.left - b.alignmentMix.left)
    + Math.abs(a.alignmentMix.center - b.alignmentMix.center)
    + Math.abs(a.alignmentMix.right - b.alignmentMix.right) >= 0.2;
  const n = [blocksDiffer, headlineDiffer, al].filter(Boolean).length;
  return { blocksDiffer, headlineDiffer, alignDiffer: al, differCount: n, pass: n >= 2 };
}

async function main() {
  const [outDir, , quotaProbe] = process.argv.slice(2);
  const metricsDir = path.join(outDir, 'metrics');
  const files = (await fs.readdir(metricsDir)).filter((f) => f.endsWith('.metrics.json')).sort();
  const runs = [];
  for (const f of files) {
    const m = JSON.parse(await fs.readFile(path.join(metricsDir, f), 'utf8'));
    const base = f.replace('.metrics.json', '');
    let overflow = null;
    try { overflow = JSON.parse(await fs.readFile(path.join(metricsDir, `${base}.overflow.json`), 'utf8')); } catch { /* skipped */ }
    let sidecar = null;
    try { sidecar = JSON.parse(await fs.readFile(path.join(outDir, `${base}.sidecar.json`), 'utf8')); } catch { /* arm A */ }
    runs.push({ ...m, overflow, sidecar });
  }
  const timings = (await fs.readFile(path.join(outDir, 'timings.jsonl'), 'utf8')).trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  // CLI gen_ms per B deck comes from receipts.log lines.
  const receipts = (await Promise.all((await fs.readdir(outDir)).filter((f) => /^receipts-.*\.log$/.test(f))
    .map((f) => fs.readFile(path.join(outDir, f), 'utf8')))).join('\n');
  for (const m of receipts.matchAll(/=== (\S+) (\S+) exit=(\d+) gen_ms=(\d+) ===/g)) {
    timings.push({ fx: m[1], arm: 'b', sys: m[2], gen_ms: +m[4], exit: +m[3] });
  }
  // Cross-system diversity per fixture (production systems only).
  const diversity = [];
  for (const fx of [...new Set(runs.map((r) => r.fx))]) {
    const sys = {};
    for (const r of runs.filter((r) => r.fx === fx && r.arm === 'b' && r.sidecar?.diversityFeatures)) {
      sys[r.sys] = r.sidecar.diversityFeatures;
    }
    const ids = Object.keys(sys);
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      diversity.push({ fx, a: ids[i], b: ids[j], ...pairwise(sys[ids[i]], sys[ids[j]]) });
    }
  }
  const results = {
    generatedAt: new Date().toISOString(),
    pins: {
      baseline: 'b09865c701944ecbf475dbd58e524b9a7e4bd75b',
      skill: '76a9570c2696ab96b2931edd2aee0cbf8d402ad1 (agent/b-skill)',
      engine: 'd0c5166a54d7998fdb2151e26bff5ac7f9eb05cb (agent/c-composition)',
      seed: 42, viewport: '1280x720', chrome: runs.find((r) => r.overflow?.chrome)?.overflow?.chrome ?? 'unmeasured',
    },
    quota: { githubCallsByBenchmark: 0, probe: (quotaProbe ?? '').slice(0, 200) },
    timings,
    crossSystemDiversity: diversity,
    runs,
  };
  await fs.writeFile(path.join(outDir, 'results.json'), `${JSON.stringify(results, null, 2)}\n`);
  console.log(`aggregate: ${runs.length} decks, diversity pairs=${diversity.length}`);
}

main().catch((e) => { console.error(`FAIL aggregate: ${e.message}`); process.exit(1); });
