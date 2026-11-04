#!/usr/bin/env node
/**
 * screenshot.mjs — render one design preview.html to a verified 1920x1080 PNG.
 *
 * Usage:
 *   node screenshot.mjs <slug> <DID> [--root=<repo-root>] [--chrome=<path>]
 *       [--budget=<ms>] [--src=<html-path>] [--timeout=<ms>]
 *
 * Renders typo-pack/templates/<slug>/preview.html with headless
 * Chrome (--window-size=1920,1080 plus a virtual-time budget so webfonts
 * settle) to evals/design-diversity/screenshots/<DID>.png, then verifies the
 * PNG's IHDR dimensions are exactly 1920x1080.
 *
 * DID must be D01..D27. Node built-ins only (no new dependencies).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(HERE, '..', '..', '..');
const DEFAULT_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DID_RE = /^D(0[1-9]|1[0-9]|2[0-7])$/;
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function flag(args, name, fallback) {
  const hit = args.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : fallback;
}

function readPngDims(pngPath) {
  const buf = fs.readFileSync(pngPath);
  if (buf.length < 32 || !buf.subarray(0, 8).equals(PNG_SIG)) {
    throw new Error('not a PNG (bad signature)');
  }
  // IHDR chunk: length(4) @8, type(4) @12 must be "IHDR", width @16, height @20.
  if (buf.subarray(12, 16).toString('ascii') !== 'IHDR') {
    throw new Error('not a PNG (missing IHDR first)');
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
}

function main() {
  const args = process.argv.slice(2);
  const positional = args.filter((a) => !a.startsWith('--'));
  const [slug, did] = positional;
  const root = path.resolve(flag(args, '--root', DEFAULT_ROOT));
  const chrome = flag(args, '--chrome', DEFAULT_CHROME);
  const budget = Number(flag(args, '--budget', '8000'));
  const timeoutMs = Number(flag(args, '--timeout', '120000'));
  const srcOverride = flag(args, '--src', '');

  if (!slug || !did) {
    console.error('usage: node screenshot.mjs <slug> <DID> [--root=..] [--chrome=..] [--budget=ms] [--src=path]');
    process.exitCode = 1;
    return;
  }
  if (!SLUG_RE.test(slug)) { console.error(`bad slug: ${slug}`); process.exitCode = 1; return; }
  if (!DID_RE.test(did)) { console.error(`bad DID (want D01..D27): ${did}`); process.exitCode = 1; return; }

  const src = srcOverride
    ? path.resolve(srcOverride)
    : path.join(root, 'typo-pack', 'templates', slug, 'preview.html');
  if (!fs.existsSync(src)) { console.error(`preview.html not found: ${src}`); process.exitCode = 1; return; }
  if (!fs.existsSync(chrome)) { console.error(`chrome not found: ${chrome}`); process.exitCode = 1; return; }

  const outDir = path.join(root, 'evals', 'design-diversity', 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${did}.png`);
  const url = pathToFileURL(src).href;

  const chromeArgs = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1920,1080',
    `--virtual-time-budget=${Number.isFinite(budget) ? budget : 8000}`,
    `--screenshot=${out}`,
    url,
  ];
  const run = spawnSync(chrome, chromeArgs, { encoding: 'utf8', timeout: timeoutMs });
  if (run.error) { console.error(`chrome launch failed: ${run.error.message}`); process.exitCode = 1; return; }
  if (run.status !== 0) {
    console.error(`chrome exited ${run.status}: ${(run.stderr || '').trim().slice(0, 500)}`);
    process.exitCode = 1;
    return;
  }
  if (!fs.existsSync(out)) { console.error(`no screenshot produced at ${out}`); process.exitCode = 1; return; }

  let dims;
  try {
    dims = readPngDims(out);
  } catch (e) {
    console.error(`screenshot is not a valid PNG: ${e.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[${slug} -> ${did}] ${out}`);
  console.log(`PNG: ${dims.width}x${dims.height}, ${dims.bytes} bytes`);
  if (dims.width !== 1920 || dims.height !== 1080) {
    console.error(`dimension mismatch: want 1920x1080, got ${dims.width}x${dims.height}`);
    process.exitCode = 1;
    return;
  }
  console.log('VERIFY: PASS (1920x1080)');
}

main();
