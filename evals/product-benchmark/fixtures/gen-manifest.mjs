// Build fixtures/sources.json + fixtures/numbers.json from fixtures/repos/*.
// Run: node evals/product-benchmark/fixtures/gen-manifest.mjs
// Outputs are committed; the slide audit treats numbers.json as the oracle.
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractNumbers, normNum } from '../measure/numbers.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const reposDir = path.join(root, 'repos');

const sources = { generatedAt: new Date().toISOString(), fixtures: {} };
const numbers = { generatedAt: sources.generatedAt, fixtures: {} };

for (const fx of (await fs.readdir(reposDir)).sort()) {
  const fxDir = path.join(reposDir, fx);
  const files = [];
  async function walk(dir) {
    for (const e of (await fs.readdir(dir, { withFileTypes: true })).sort((a, b) => a.name < b.name ? -1 : 1)) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else files.push(p);
    }
  }
  await walk(fxDir);
  const fileRows = [];
  const tokenSet = new Set();
  let totalBytes = 0;
  for (const f of files) {
    const rel = path.relative(fxDir, f);
    const buf = await fs.readFile(f);
    const text = buf.toString('utf8');
    totalBytes += buf.length;
    fileRows.push({
      path: rel,
      bytes: buf.length,
      lines: text.split('\n').length,
      sha256: createHash('sha256').update(buf).digest('hex'),
    });
    for (const t of extractNumbers(text)) {
      tokenSet.add(t);
      tokenSet.add(normNum(t));
    }
  }
  if (files.length > 20 || totalBytes > 200 * 1024) {
    throw new Error(`${fx}: exceeds Skill remote-mirroring budget`);
  }
  sources.fixtures[fx] = { files: fileRows, totalFiles: files.length, totalBytes };
  numbers.fixtures[fx] = { tokens: [...tokenSet].sort(), count: tokenSet.size };
}

await fs.writeFile(path.join(root, 'sources.json'), `${JSON.stringify(sources, null, 2)}\n`);
await fs.writeFile(path.join(root, 'numbers.json'), `${JSON.stringify(numbers, null, 2)}\n`);
console.log(`fixtures: ${Object.keys(sources.fixtures).join(', ')} (manifest + oracle written)`);
