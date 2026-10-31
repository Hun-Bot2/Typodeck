// Phase 4 — offline tests for the pure eval-harness helpers.
// No network: diversity math, caption parsing, ref validation, percentile.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createFetchCache,
  diversityFeatures,
  editabilityOfSlideXml,
  median,
  pairwiseDiversity,
  parseCaptionRefs,
  percentile,
  refIsValid,
  type DiversityFeatures,
} from '../scripts/eval';
import type { Deck } from '../src/schema';

function block(role: 'title' | 'body', align: 'left' | 'center' | 'right', fontSize: number) {
  return {
    id: 'b',
    role,
    content: 'x',
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    fontSize,
    fontWeight: 400 as const,
    tracking: 0,
    lineHeight: 1,
    align,
    color: '#111111',
  };
}

describe('percentile/median', () => {
  it('nearest-rank p95', () => {
    assert.equal(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 0.95), 19);
    assert.equal(percentile([5], 0.95), 5);
    assert.equal(percentile([], 0.95), 0);
  });
  it('median of odd/even/empty', () => {
    assert.equal(median([3, 1, 2]), 2);
    assert.equal(median([1, 4]), 2.5);
    assert.equal(median([]), 0);
  });
});

describe('parseCaptionRefs', () => {
  it('parses EN source captions with ranges', () => {
    assert.deepEqual(parseCaptionRefs('Source: readme.md:3–7; docs/a.md:2'), [
      { path: 'readme.md', lines: [3, 7] },
      { path: 'docs/a.md', lines: [2, 2] },
    ]);
  });
  it('parses KO source captions and strips honesty tags', () => {
    assert.deepEqual(parseCaptionRefs('출처: idea.txt:1–4 · unverified · illustrative'), [
      { path: 'idea.txt', lines: [1, 4] },
    ]);
  });
  it('parses compact v2 captions with status tags', () => {
    assert.deepEqual(parseCaptionRefs('verified · src/pack.js:2'), [
      { path: 'src/pack.js', lines: [2, 2] },
    ]);
    assert.deepEqual(parseCaptionRefs('unverified · illustrative · idea.txt:5'), [
      { path: 'idea.txt', lines: [5, 5] },
    ]);
    assert.deepEqual(parseCaptionRefs('verified · README.md:3–7; docs/a.md'), [
      { path: 'README.md', lines: [3, 7] },
      { path: 'docs/a.md' },
    ]);
  });
  it('accepts extensionless and spaced paths, still rejects prose', () => {
    assert.deepEqual(parseCaptionRefs('unverified · historical · History.rdoc:8'), [
      { path: 'History.rdoc', lines: [8, 8] },
    ]);
    assert.deepEqual(parseCaptionRefs('verified · My Doc.md:3'), [
      { path: 'My Doc.md', lines: [3, 3] },
    ]);
    assert.deepEqual(
      parseCaptionRefs('unverified · illustrative · proposed · idea.txt:9'),
      [{ path: 'idea.txt', lines: [9, 9] }],
    );
    assert.deepEqual(parseCaptionRefs('verified · a suggested direction'), []);
  });
  it('caches repeat fetches and serves consumable clones', async () => {
    let calls = 0;
    const inner = (async (url: unknown) => {
      calls += 1;
      return new Response(`body-for-${String(url)}`, { status: 200 });
    }) as typeof fetch;
    const cache = createFetchCache(inner);
    const a = await cache.impl('https://x.test/one');
    const b = await cache.impl('https://x.test/one');
    const c = await cache.impl('https://x.test/two');
    assert.equal(await a.text(), 'body-for-https://x.test/one');
    assert.equal(await b.text(), 'body-for-https://x.test/one');
    assert.equal(await c.text(), 'body-for-https://x.test/two');
    assert.equal(calls, 2);
    assert.equal(cache.takeHits(), 1);
    assert.equal(cache.takeHits(), 0);
  });
  it('never caches error responses', async () => {
    let calls = 0;
    const inner = (async () => {
      calls += 1;
      return new Response('limited', { status: 429 });
    }) as typeof fetch;
    const cache = createFetchCache(inner);
    await cache.impl('https://x.test/flaky');
    await cache.impl('https://x.test/flaky');
    assert.equal(calls, 2);
    assert.equal(cache.takeHits(), 0);
  });
  it('bare labels yield no refs', () => {
    assert.deepEqual(parseCaptionRefs('proposal · unverified — a suggested direction'), []);
    assert.deepEqual(parseCaptionRefs('unverified'), []);
    assert.deepEqual(parseCaptionRefs('verified'), []);
    assert.deepEqual(parseCaptionRefs(''), []);
  });
});

describe('refIsValid', () => {
  const files = new Map([['readme.md', 100]]);
  it('accepts in-bounds refs, rejects unknown paths and bad ranges', () => {
    assert.equal(refIsValid({ path: 'readme.md', lines: [1, 50] }, files), true);
    assert.equal(refIsValid({ path: 'readme.md' }, files), true);
    assert.equal(refIsValid({ path: 'nope.md', lines: [1, 2] }, files), false);
    assert.equal(refIsValid({ path: 'readme.md', lines: [1, 101] }, files), false);
    assert.equal(refIsValid({ path: 'readme.md', lines: [0, 5] }, files), false);
  });
});

describe('diversity', () => {
  const deck = (aligns: Array<'left' | 'center' | 'right'>, titleSize: number): Deck => ({
    meta: { title: 't', lang: 'en', system: 'x', seed: 1, generatedBy: 'fallback' },
    slides: [
      { id: 's1', thesis: '', background: '#FFFFFF', blocks: aligns.map((a) => block('body', a, 12)) },
      { id: 's2', thesis: '', background: '#FFFFFF', blocks: [block('title', aligns[0], titleSize)] },
    ],
  });
  it('features capture headline size and alignment mix', () => {
    const f = diversityFeatures(deck(['left', 'left', 'right'], 46));
    assert.deepEqual(f.blocksPerSlide, [3, 1]);
    assert.equal(f.medianHeadlineSize, 46);
    assert.ok(Math.abs(f.alignmentMix.left - 0.75) < 1e-9);
  });
  it('editorial-vs-expressive-like pair differs in 2 of 3', () => {
    const a: DiversityFeatures = {
      blocksPerSlide: [4, 4],
      meanBlocksPerSlide: 4,
      medianHeadlineSize: 46,
      alignmentMix: { left: 1, center: 0, right: 0 },
    };
    const b: DiversityFeatures = {
      blocksPerSlide: [4, 4],
      meanBlocksPerSlide: 4,
      medianHeadlineSize: 64,
      alignmentMix: { left: 0, center: 1, right: 0 },
    };
    const d = pairwiseDiversity(a, b);
    assert.equal(d.blocksDiffer, false);
    assert.equal(d.headlineDiffer, true);
    assert.equal(d.alignDiffer, true);
    assert.equal(d.differCount, 2);
    assert.equal(d.pass, true);
  });
  it('near-identical pair fails', () => {
    const a: DiversityFeatures = {
      blocksPerSlide: [4],
      meanBlocksPerSlide: 4,
      medianHeadlineSize: 30,
      alignmentMix: { left: 1, center: 0, right: 0 },
    };
    const b: DiversityFeatures = {
      blocksPerSlide: [4],
      meanBlocksPerSlide: 4,
      medianHeadlineSize: 31,
      alignmentMix: { left: 0.95, center: 0, right: 0.05 },
    };
    const d = pairwiseDiversity(a, b);
    assert.equal(d.pass, false);
  });
});

describe('editabilityOfSlideXml', () => {
  it('splits locked vs editable a:t chars', () => {
    const xml =
      '<p:sp><p:txBody><a:p><a:r><a:t>hello</a:t></a:r></a:p></p:txBody></p:sp>' +
      '<p:sp><p:nvSpPr><a:spLocks noTxEdt="1"/></p:nvSpPr>' +
      '<p:txBody><a:p><a:r><a:t>locked</a:t></a:r></a:p></p:txBody></p:sp>';
    assert.deepEqual(editabilityOfSlideXml(xml), { editable: 5, locked: 6 });
  });
});
