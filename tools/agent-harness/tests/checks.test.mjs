import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkDims, checkOverflow, checkClip, checkVerbatim, checkFixture, checkSpec,
} from '../lib/checks.mjs';
import { proposeRepair } from '../lib/repair.mjs';

function metrics(over = {}) {
  return {
    doc: { sw: 1920, sh: 1080, iw: 1920, ih: 1080 },
    texts: [{ key: 'title', sw: 100, cw: 200, sh: 50, ch: 60, x: 72, y: 200, w: 200, h: 60 }],
    heads: [{ key: 'title', align: 'left' }],
    rounded: 0,
    rail: { x: 1272, y: 64, w: 576, h: 906 },
    numeral: { x: 1312, y: 104, w: 460, h: 340 },
    spec: { redrules: 1, grids: 1, rails: 1, footers: 1, fixtures: 0 },
    text: 'Hello world. Second sentence here.',
    ...over,
  };
}

test('checkDims passes exact 1920x1080 only', () => {
  assert.equal(checkDims(null, () => ({ width: 1920, height: 1080 })).ok, true);
  assert.equal(checkDims(null, () => ({ width: 1920, height: 1000 })).ok, false);
  assert.equal(checkDims(null, () => { throw new Error('bad'); }).ok, false);
});

test('checkOverflow flags horizontal scroll and footer crossing', () => {
  assert.equal(checkOverflow(metrics()).ok, true);
  const wide = metrics({ texts: [{ key: 'title', sw: 300, cw: 200, sh: 50, ch: 60, x: 0, y: 0, w: 200, h: 60, oy: 'visible' }] });
  const r = checkOverflow(wide);
  assert.equal(r.ok, false);
  assert.match(r.detail, /title: horizontal/);
  assert.equal(checkOverflow(metrics({ doc: { sw: 1920, sh: 1400 } })).ok, false);
  const cross = metrics({ texts: [{ key: 'sub', sw: 200, cw: 200, sh: 500, ch: 300, x: 72, y: 600, w: 200, h: 300, oy: 'visible' }] });
  assert.equal(checkOverflow(cross).ok, false);
});

test('checkOverflow excuses in-zone vertical glyph extent (display numerals)', () => {
  const m = metrics({ texts: [{ key: 'numeral', sw: 460, cw: 460, sh: 373, ch: 340, x: 1312, y: 104, w: 460, h: 340, oy: 'visible' }] });
  assert.equal(checkOverflow(m).ok, true);
  const clipped = metrics({ texts: [{ key: 'title', sw: 200, cw: 200, sh: 300, ch: 200, x: 72, y: 200, w: 200, h: 200, oy: 'hidden' }] });
  assert.equal(checkOverflow(clipped).ok, false);
});

test('checkOverflow tolerates subpixel rounding (<=2px)', () => {
  const m = metrics({ texts: [{ key: 't', sw: 202, cw: 200, sh: 60, ch: 60, x: 0, y: 0, w: 200, h: 60 }] });
  assert.equal(checkOverflow(m).ok, true);
});

test('checkClip flags numeral escaping the rail', () => {
  assert.equal(checkClip(metrics()).ok, true);
  const esc = metrics({ numeral: { x: 1200, y: 104, w: 460, h: 340 } });
  assert.equal(checkClip(esc).ok, false);
  const off = metrics({ texts: [{ key: 't', sw: 10, cw: 10, sh: 10, ch: 10, x: 1900, y: 100, w: 100, h: 10 }] });
  assert.equal(checkClip(off).ok, false);
});

test('checkVerbatim requires every string, split long ones by sentence', () => {
  assert.equal(checkVerbatim(metrics(), ['Hello world.', 'Second sentence here.']).ok, true);
  const r = checkVerbatim(metrics(), ['Hello world.', 'absent phrase']);
  assert.equal(r.ok, false);
  assert.match(r.detail, /absent phrase/);
  // whitespace-insensitive
  assert.equal(checkVerbatim(metrics(), ['Hello   world.']).ok, true);
  // case-insensitive (spec uppercase transforms render in innerText)
  const upper = metrics({ text: 'TYPODECK RESEARCH · READOUT 07' });
  assert.equal(checkVerbatim(upper, ['Typodeck Research · Readout 07']).ok, true);
});

test('checkFixture requires markers on fixture slides, forbids strays', () => {
  assert.equal(checkFixture(metrics(), { fixture: false }).ok, true);
  assert.equal(checkFixture(metrics(), { fixture: true }).ok, false);
  const m = metrics({ spec: { redrules: 1, grids: 1, rails: 1, footers: 1, fixtures: 1 } });
  assert.equal(checkFixture(m, { fixture: true }).ok, true);
  assert.equal(checkFixture(m, { fixture: false }).ok, false);
});

test('checkSpec enforces one red rule, chrome, left heads, no radius', () => {
  assert.equal(checkSpec(metrics()).ok, true);
  assert.equal(checkSpec(metrics({ spec: { redrules: 2, grids: 1, rails: 1, footers: 1, fixtures: 0 } })).ok, false);
  assert.equal(checkSpec(metrics({ heads: [{ key: 't', align: 'center' }] })).ok, false);
  assert.equal(checkSpec(metrics({ rounded: 3 })).ok, false);
});

test('proposeRepair steps titles down and shrinks dense tables', () => {
  const p1 = proposeRepair({
    failures: { overflow: { items: ['title: vertical +40px'] } },
    adjust: {}, slide: { title: 'T' }, role: 'cover',
  });
  assert.ok(p1 && p1.adjust.titlePx < 118);
  const p2 = proposeRepair({
    failures: { overflow: { items: ['table: vertical +200px'] } },
    adjust: {}, slide: { title: 'T' }, role: 'dense',
  });
  assert.ok(p2 && p2.adjust.tablePx < 21);
  const p3 = proposeRepair({
    failures: { clip: { items: ['numeral right +60px outside rail'] } },
    adjust: {}, slide: {}, role: 'cover',
  });
  assert.ok(p3 && p3.adjust.numeralPx < 400);
});

test('proposeRepair returns null when nothing applies (verbatim)', () => {
  const p = proposeRepair({
    failures: { verbatim: { items: ['missing x'] } },
    adjust: {}, slide: {}, role: 'cover',
  });
  assert.equal(p, null);
});
