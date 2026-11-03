#!/usr/bin/env node
/**
 * capture.mjs — deck-smoke capture for the design-diversity full-deck smoke test.
 *
 * Same render procedure as harness/screenshot.mjs (headless Chrome,
 * --window-size=1920,1080, --virtual-time-budget so webfonts settle, PNG IHDR
 * verification at exactly 1920x1080), but writes per-slide artifacts to
 * evals/design-diversity/deck-smoke/<name>.png instead of the fixed
 * screenshots/<DID>.png slots (which must not be overwritten: only 27 exist
 * and they hold the official design previews).
 *
 * Usage: node evals/design-diversity/deck-smoke/capture.mjs [--budget=<ms>]
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readPngDims(p) {
  const buf = fs.readFileSync(p);
  if (buf.length < 32 || !buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('bad PNG signature');
  if (buf.subarray(12, 16).toString('ascii') !== 'IHDR') throw new Error('missing IHDR');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
}

const args = process.argv.slice(2);
const budgetFlag = args.find((a) => a.startsWith('--budget='));
const budget = budgetFlag ? Number(budgetFlag.slice('--budget='.length)) : 8000;

const slides = fs.readdirSync(HERE).filter((f) => f.endsWith('.html')).sort();
if (!slides.length) { console.error('no slide html files in deck-smoke/'); process.exit(1); }
if (!fs.existsSync(CHROME)) { console.error(`chrome not found: ${CHROME}`); process.exit(1); }

let fail = 0;
for (const f of slides) {
  const src = path.join(HERE, f);
  const out = path.join(HERE, f.replace(/\.html$/, '.png'));
  const url = pathToFileURL(src).href;
  const run = spawnSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--window-size=1920,1080',
    `--virtual-time-budget=${budget}`,
    `--screenshot=${out}`, url,
  ], { encoding: 'utf8', timeout: 120000 });
  if (run.error || run.status !== 0) {
    console.error(`FAIL ${f}: ${run.error ? run.error.message : (run.stderr || '').trim().slice(0, 300)}`);
    fail++;
    continue;
  }
  try {
    const d = readPngDims(out);
    const ok = d.width === 1920 && d.height === 1080;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${f} -> ${d.width}x${d.height}, ${d.bytes} bytes`);
    if (!ok) fail++;
  } catch (e) {
    console.error(`FAIL ${f}: ${e.message}`);
    fail++;
  }
}
console.log(fail === 0 ? 'VERIFY: PASS (all 1920x1080)' : `VERIFY: FAIL (${fail} bad)`);
process.exit(fail === 0 ? 0 : 1);
