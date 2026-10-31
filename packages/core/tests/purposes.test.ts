// Purpose presets (P01–P10): config validity, planning behavior, integrity
// rules, variants, emphasis — plus legacy bit-identical migration tests.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { acceptIdea } from '../src/ingestion';
import { extractClaims } from '../src/evidence';
import { planNarrative, planNarrativeWithQuality } from '../src/narrative';
import { validateNarrative } from '../src/schema';
import {
  EXTENDED_DIMENSIONS,
  classifyDimension,
  parsePurpose,
  type Dimension,
} from '../src/semantics';
import {
  LEGACY_PURPOSE_MAP,
  PRESET_IDS,
  PRESETS,
  getPreset,
  resolvePurpose,
  stepKicker,
  variantForDuration,
} from '../src/purposes';
import { loadFixtureText } from './fake-fetch';

function fixturePath(name: string): string {
  return path.resolve(__dirname, '..', '..', 'fixtures', name);
}

function claimsOf(fixtureFile: string) {
  return extractClaims(acceptIdea(loadFixtureText(fixtureFile)));
}

describe('preset configs', () => {
  it('defines 10 versioned presets with valid step structure', () => {
    assert.deepEqual([...PRESET_IDS], ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10']);
    for (const id of PRESET_IDS) {
      const p = PRESETS[id];
      assert.equal(p.version, '1.0.0');
      assert.ok(p.steps.length >= 7 && p.steps.length <= 8, `${id} step count`);
      assert.equal(new Set(p.steps.map((s) => s.id)).size, p.steps.length);
      for (const s of p.steps) {
        assert.ok((EXTENDED_DIMENSIONS as readonly string[]).includes(s.dim));
        assert.ok(s.label.en.length > 0 && s.label.ko.length > 0);
      }
      assert.ok(p.coverDims.length > 0 && p.closeDims.length > 0);
      assert.ok(p.name.en && p.name.ko && p.audience.en && p.goal.en);
      assert.ok(p.variants.short.maxSlides < p.variants.standard.maxSlides);
    }
  });
  it('getPreset is case-insensitive and rejects unknown ids', () => {
    assert.equal(getPreset('p04').id, 'P04');
    assert.throws(() => getPreset('P11'), /unknown purpose preset/);
    assert.throws(() => getPreset('showcase'), /unknown purpose preset/);
  });
  it('stepKicker uppercases EN and keeps KO', () => {
    assert.equal(stepKicker(PRESETS.P04, 'opportunity', 'en'), 'OPPORTUNITY');
    assert.equal(stepKicker(PRESETS.P04, 'opportunity', 'ko'), '기회');
    assert.throws(() => stepKicker(PRESETS.P04, 'nope', 'en'), /unknown step/);
  });
});

describe('purpose resolution (correction 1)', () => {
  it('parses preset syntax without disturbing legacy patterns', () => {
    assert.deepEqual(parsePurpose('P04'), { audience: 'general', preset: 'P04' });
    assert.deepEqual(parsePurpose('p01'), { audience: 'general', preset: 'P01' });
    assert.deepEqual(parsePurpose('P04: Acme'), { audience: 'general', title: 'Acme', preset: 'P04' });
    assert.deepEqual(parsePurpose('showcase'), { audience: 'showcase' });
    assert.deepEqual(parsePurpose('showcase: Acme'), { audience: 'showcase', title: 'Acme' });
    assert.deepEqual(parsePurpose('hackathon'), { audience: 'hackathon' });
    assert.deepEqual(parsePurpose('Acme Corp'), { audience: 'general', title: 'Acme Corp' });
    assert.deepEqual(parsePurpose(undefined), { audience: 'general' });
  });
  it('legacy showcase maps to the frozen arc, never to P04', () => {
    assert.deepEqual(resolvePurpose({ purpose: 'showcase' }), {
      kind: 'legacy', audience: 'showcase', title: undefined,
    });
    assert.ok(LEGACY_PURPOSE_MAP.showcase.note.includes('NOT P04'));
    const r = resolvePurpose({ purpose: 'P04' });
    assert.equal(r.kind, 'preset');
  });
  it('explicit preset option wins and treats purpose as title', () => {
    const r = resolvePurpose({ purpose: 'Acme', preset: 'p07' });
    assert.equal(r.kind, 'preset');
    if (r.kind === 'preset') {
      assert.equal(r.preset.id, 'P07');
      assert.equal(r.title, 'Acme');
    }
    assert.throws(() => resolvePurpose({ preset: 'P99' }), /unknown purpose preset/);
  });
});

describe('legacy migration: bit-identical outputs', () => {
  const doc = JSON.parse(readFileSync(fixturePath('legacy-narrative-baselines.json'), 'utf8')) as {
    cases: Array<{ fixture: string; purpose: string | null; lang: string; narrative: unknown; quality: unknown }>;
  };
  it(`replays all ${doc.cases.length} pre-preset baseline cases exactly`, () => {
    assert.ok(doc.cases.length === 36);
    for (const c of doc.cases) {
      const claims = claimsOf(`${c.fixture}.txt`);
      const { narrative, quality } = planNarrativeWithQuality(claims, {
        purpose: c.purpose ?? undefined,
        lang: c.lang,
      });
      assert.deepEqual(narrative, c.narrative, `${c.fixture}/${c.purpose}/${c.lang} narrative`);
      assert.deepEqual(quality, c.quality, `${c.fixture}/${c.purpose}/${c.lang} quality`);
    }
  });
});

describe('extended dimensions (correction 2)', () => {
  const probes: Array<[string, Dimension]> = [
    ['We decided to adopt Postgres after weighing the options against MySQL.', 'decisions'],
    ['Our hypothesis is that batching reduces latency; the experiment design uses a control group.', 'methodology'],
    ['The addressable market includes 50000 small retailers with unmet demand.', 'market'],
    ['Revenue comes from per seat pricing with strong unit economics.', 'model'],
    ['I led a team of six engineers and was responsible for the API rollout.', 'experience'],
    ['The learning objectives require students to define photosynthesis.', 'objectives'],
    ['Currently teams coordinate releases over chat; the status quo breaks weekly.', 'context'],
    ['In hindsight we learned that smaller batches worked better than big launches.', 'lessons'],
  ];
  it('classifies new-dimension probes under the extended set', () => {
    for (const [text, want] of probes) {
      assert.equal(classifyDimension(text, EXTENDED_DIMENSIONS).dim, want, text);
    }
  });
  it('legacy default never returns a new dimension for the same probes', () => {
    const legacy = new Set(['solution', 'results', 'differentiation', 'limitations', 'capabilities', 'architecture', 'problem', 'future']);
    for (const [text] of probes) {
      assert.ok(legacy.has(classifyDimension(text).dim), text);
    }
  });
});

/** Synthetic pitch: two cue-clean claims per P04 step dimension (no digits, so no number slides steal claims). */
const PITCH_TEXT = [
  'Our addressable market includes fifty thousand small retailers.',
  'Customer demand keeps growing every quarter.',
  'Shop owners waste hours on manual inventory spreadsheets.',
  'Manual stock counts are expensive and error prone for owners.',
  'Stockwise automates stock tracking for busy owners.',
  'The app recommends orders before shelves run empty.',
  'Unlike generic list apps, Stockwise predicts expiry dates.',
  'No other tool combines scanning with demand forecasts.',
  'Revenue comes from per seat pricing at nine dollars monthly.',
  'Our business model earns recurring revenue per store.',
  'The pilot measured less waste across twenty five stores.',
  'Early users report faster restocking and fewer stockouts.',
  'We plan to launch in three more cities next quarter.',
  'The roadmap adds supplier integrations and analytics.',
  'The main objective is ten thousand paying teams.',
  'Our goal is nationwide coverage within two years.',
].join(' ');

function pitchClaims() {
  return extractClaims(acceptIdea(PITCH_TEXT));
}

describe('preset planning', () => {
  it('plans all 10 presets from the F4 idea with preset kickers, no filler', () => {
    for (const id of PRESET_IDS) {
      const n = planNarrative(claimsOf('idea-f4.txt'), { preset: id, lang: 'en' });
      validateNarrative(n);
      assert.ok(!n.slides.some((s) => s.id.includes('proposal')), `${id} has filler`);
      const kickers = n.slides.flatMap((s) => s.blocks.filter((b) => b.role === 'kicker').map((b) => b.content));
      assert.ok(kickers.length >= 3, `${id} kickers`);
      // Deterministic rerun.
      const again = planNarrative(claimsOf('idea-f4.txt'), { preset: id, lang: 'en' });
      assert.deepEqual(n, again);
    }
  });
  it('P04 kickers follow the pitch arc in order', () => {
    const n = planNarrative(pitchClaims(), { preset: 'P04', purpose: 'Acme', lang: 'en' });
    const kickers = n.slides.flatMap((s) => s.blocks.filter((b) => b.role === 'kicker').map((b) => b.content));
    assert.deepEqual(kickers, [
      'PRODUCT PITCH',
      'OPPORTUNITY',
      'CUSTOMER PROBLEM',
      'PRODUCT PROPOSITION',
      'DIFFERENTIATION',
      'BUSINESS MODEL',
      'EVIDENCE & TRACTION',
      'GROWTH STRATEGY',
      'THE ASK',
      'CLOSING',
    ]);
  });
  it('purpose-string preset syntax equals the explicit option', () => {
    const a = planNarrative(claimsOf('idea-f4.txt'), { purpose: 'P04: Acme', lang: 'en' });
    const b = planNarrative(claimsOf('idea-f4.txt'), { preset: 'P04', purpose: 'Acme', lang: 'en' });
    assert.deepEqual(a, b);
  });
  it('legacy showcase and P04 differ on identical claims', () => {
    const claims = claimsOf('idea-f4.txt');
    const legacy = planNarrative(claims, { purpose: 'showcase', lang: 'en' });
    const preset = planNarrative(claims, { preset: 'P04', lang: 'en' });
    const lk = legacy.slides[0].blocks.find((b) => b.role === 'kicker')?.content;
    const pk = preset.slides[0].blocks.find((b) => b.role === 'kicker')?.content;
    assert.equal(lk, 'SHOWCASE');
    assert.equal(pk, 'PRODUCT PITCH');
    assert.notDeepEqual(legacy, preset);
  });
  it('P03 bars ungrounded idea numbers from hero slides; P04 allows them', () => {
    const claims = claimsOf('idea-f4.txt'); // all ungrounded
    const p03 = planNarrative(claims, { preset: 'P03', lang: 'en' });
    const p04 = planNarrative(claims, { preset: 'P04', lang: 'en' });
    const heroes = (n: ReturnType<typeof planNarrative>) =>
      n.slides.flatMap((s) => s.blocks.filter((b) => b.role === 'number'));
    assert.equal(heroes(p03).length, 0);
    assert.ok(heroes(p04).length > 0);
  });
  it('thin evidence omits steps instead of inventing slides', () => {
    const claims = claimsOf('idea-devtool.txt');
    const n = planNarrative(claims, { preset: 'P05', lang: 'en' });
    validateNarrative(n);
    assert.ok(!n.slides.some((s) => s.id.includes('proposal')));
    assert.ok(n.slides.length >= 2); // cover + closing always exist
  });
});

describe('variants, duration, emphasis', () => {
  it('maps duration to variants; explicit variant wins', () => {
    assert.equal(variantForDuration(undefined), 'standard');
    assert.equal(variantForDuration(3), 'short');
    assert.equal(variantForDuration(10), 'standard');
    assert.equal(variantForDuration(30), 'extended');
    assert.equal(variantForDuration(30, 'short'), 'short');
  });
  it('short variant caps slides; extended allows more than standard cap', () => {
    const claims = claimsOf('idea-f4.txt');
    const short = planNarrative(claims, { preset: 'P04', variant: 'short', lang: 'en' });
    const standard = planNarrative(claims, { preset: 'P04', variant: 'standard', lang: 'en' });
    const extended = planNarrative(claims, { preset: 'P04', variant: 'extended', lang: 'en' });
    assert.ok(short.slides.length <= 6, `short has ${short.slides.length}`);
    assert.ok(short.slides.length < standard.slides.length);
    assert.ok(standard.slides.length <= 12 && extended.slides.length <= 15);
    const byDur = planNarrative(claims, { preset: 'P04', durationMin: 3, lang: 'en' });
    assert.deepEqual(byDur, short);
  });
  it('emphasis sways the closing restatement deterministically', () => {
    const claims = pitchClaims();
    const plain = planNarrative(claims, { preset: 'P04', lang: 'en' });
    const emph = planNarrative(claims, { preset: 'P04', emphasis: ['results'], lang: 'en' });
    const closing = (n: ReturnType<typeof planNarrative>) =>
      n.slides[n.slides.length - 1].blocks.find((b) => b.role === 'body')?.content;
    assert.ok(closing(plain) !== closing(emph), 'emphasis had no effect');
    const again = planNarrative(claims, { preset: 'P04', emphasis: ['results'], lang: 'en' });
    assert.deepEqual(emph, again);
  });
  it('ignores unknown emphasis dimensions at runtime', () => {
    const claims = claimsOf('idea-f4.txt');
    const n = planNarrative(claims, { preset: 'P04', emphasis: ['nope' as Dimension], lang: 'en' });
    validateNarrative(n);
  });
});
