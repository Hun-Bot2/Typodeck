// Narrative Intelligence — tests for the Narrative Quality Gate.
// Each check is pinned with a hand-built narrative; planned decks from the
// real fixtures must additionally pass the gate end to end.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { extractClaims, type Claim } from '../src/evidence';
import { acceptIdea, fetchRepo } from '../src/ingestion';
import { planNarrativeWithQuality } from '../src/narrative';
import { evaluateNarrative } from '../src/quality';
import type { Narrative } from '../src/schema';
import {
  loadFixtureText,
  loadIdeaF4,
  loadRecordedRepo,
  loadRecordedRepoFrom,
  recordedRepoFetch,
} from './fake-fetch';

function mkClaim(id: string, text: string, kind: Claim['kind'], path: string): Claim {
  return {
    id, text, kind,
    refs: [{ path, lines: [1, 2] }],
    numbers: text.match(/\bv?\d[\d,]*(?:\.\d+)?/g) ?? [],
  };
}

const CLAIMS = [
  mkClaim('c1', 'Households waste 40 percent of fresh food every single week.', 'verified', 'README.md'),
  mkClaim('c2', 'Pantrylog fixes this with a 90-second weekly ritual for busy families.', 'verified', 'README.md'),
  mkClaim('c3', 'Pilot homes cut waste by 18 percent in eight measured weeks.', 'verified', 'README.md'),
  mkClaim('c4', 'Shoppers lose track of expiry dates constantly and give up.', 'verified', 'README.md'),
];

function slide(
  id: string,
  blocks: Array<[string, string]>,
): Narrative['slides'][number] {
  return {
    id,
    thesis: blocks.find(([r]) => r === 'title')?.[1] ?? blocks[0][1],
    blocks: blocks.map(([role, content]) => ({ role: role as never, content })),
  };
}

function goodNarrative(): Narrative {
  return {
    title: 'Pantrylog', lang: 'en',
    slides: [
      slide('n1-cover', [['kicker', 'PANTRYLOG'], ['title', 'Pantrylog'], ['body', CLAIMS[0].text]]),
      slide('n2-number', [
        ['kicker', 'BY THE NUMBERS'], ['number', '40 percent'],
        ['title', CLAIMS[0].text], ['caption', 'verified · README.md:1–2'],
      ]),
      slide('n3-problem', [
        ['kicker', 'PROBLEM'], ['title', CLAIMS[3].text],
        ['body', CLAIMS[3].text + ' Extra supporting detail.'],
        ['caption', 'verified · README.md:1–2'],
      ]),
      slide('n4-solution', [
        ['kicker', 'SOLUTION'], ['title', CLAIMS[1].text],
        ['body', CLAIMS[1].text + ' Extra supporting detail.'],
        ['caption', 'verified · README.md:1–2'],
      ]),
      slide('n4-results', [
        ['kicker', 'RESULTS'], ['title', CLAIMS[2].text], ['caption', 'verified · README.md:1–2'],
      ]),
      slide('n5-closing', [
        ['kicker', 'CLOSING'], ['title', 'The thesis, restated'], ['body', `${CLAIMS[1].text} ${CLAIMS[2].text}`],
      ]),
    ],
  };
}

describe('evaluateNarrative', () => {
  it('passes a coherent, sourced narrative', () => {
    const q = evaluateNarrative(goodNarrative(), CLAIMS, { audience: 'general' });
    assert.equal(q.pass, true, JSON.stringify(q.issues));
    assert.equal(q.scores.overall, 100);
  });

  it('flags repeated theses as errors', () => {
    const n = goodNarrative();
    n.slides.splice(
      3, 0,
      slide('n9-solution', [
        ['kicker', 'SOLUTION'], ['title', CLAIMS[1].text], ['caption', 'verified · README.md:1–2'],
      ]),
    );
    const q = evaluateNarrative(n, CLAIMS);
    assert.equal(q.pass, false);
    assert.ok(q.issues.some((i) => i.code === 'repeated-thesis' && i.severity === 'error'));
  });

  it('flags verbatim-duplicate slides as errors', () => {
    const n = goodNarrative();
    n.slides.splice(3, 0, { ...n.slides[2], id: 'n9-results' });
    const q = evaluateNarrative(n, CLAIMS);
    assert.ok(q.issues.some((i) => i.code === 'redundant-slide' && i.severity === 'error'));
  });

  it('flags fabricated hero metrics as errors', () => {
    const n = goodNarrative();
    n.slides[1].blocks.find((b) => b.role === 'number')!.content = '97 percent';
    const q = evaluateNarrative(n, CLAIMS);
    assert.ok(q.issues.some((i) => i.code === 'fabricated-metric' && i.severity === 'error'));
  });

  it('flags version heroes as errors even when quoted', () => {
    const version = mkClaim('c9', 'The 3.2 release is available now for download.', 'verified', 'README.md');
    const n = goodNarrative();
    n.slides[1] = slide('n2-number', [
      ['kicker', 'BY THE NUMBERS'], ['number', '3.2'],
      ['title', version.text], ['caption', 'verified · README.md:1–2'],
    ]);
    const q = evaluateNarrative(n, [...CLAIMS, version]);
    assert.ok(q.issues.some((i) => i.code === 'hero-metric-invalid' && i.severity === 'error'));
  });

  it('flags generic closings and identical title/body as errors', () => {
    const n = goodNarrative();
    n.slides[n.slides.length - 1].blocks.find((b) => b.role === 'body')!.content =
      'One thesis per slide; every number traceable to its source.';
    n.slides[2].blocks.find((b) => b.role === 'body')!.content =
      n.slides[2].blocks.find((b) => b.role === 'title')!.content;
    const q = evaluateNarrative(n, CLAIMS);
    assert.ok(q.issues.some((i) => i.code === 'weak-conclusion' && i.severity === 'error'));
    assert.ok(q.issues.some((i) => i.code === 'title-body-identical' && i.severity === 'error'));
  });

  it('flags contextless theses, missing captions, and arc disorder as warnings', () => {
    const n = goodNarrative();
    n.slides[2].blocks.find((b) => b.role === 'title')!.content = 'It will be great for all users now.';
    n.slides[2].blocks = n.slides[2].blocks.filter((b) => b.role !== 'caption');
    n.slides[2].id = 'n3-future';
    n.slides[3].id = 'n4-problem';
    const q = evaluateNarrative(n, CLAIMS);
    assert.ok(q.issues.some((i) => i.code === 'contextless-excerpt' && i.severity === 'warning'));
    assert.ok(q.issues.some((i) => i.code === 'caption-missing' && i.severity === 'warning'));
    assert.ok(q.issues.some((i) => i.code === 'arc-disorder' && i.severity === 'warning'));
    assert.equal(q.pass, true, 'warnings alone must not fail the gate');
  });

  it('resolves short heroes through the slide title, not substring search', () => {
    const dated = mkClaim('c9', 'Released version 1.40 on 2026-10-03 for users.', 'verified', 'CHANGELOG.md');
    const n = goodNarrative();
    n.slides[1].blocks.find((b) => b.role === 'number')!.content = '40';
    const q = evaluateNarrative(n, [dated, ...CLAIMS]);
    assert.ok(
      !q.issues.some((i) => i.code === 'hero-metric-invalid'),
      JSON.stringify(q.issues),
    );
  });

  it('flags thin dimension coverage as a warning', () => {
    const n: Narrative = {
      title: 'Thin', lang: 'en',
      slides: [
        slide('n1-cover', [['kicker', 'T'], ['title', 'Thin']]),
        slide('n2-capabilities', [
          ['kicker', 'WHAT IT DOES'], ['title', CLAIMS[0].text],
          ['caption', 'verified · README.md:1–2'],
        ]),
        slide('n3-closing', [['kicker', 'C'], ['title', 'Close'], ['body', CLAIMS[0].text]]),
      ],
    };
    const q = evaluateNarrative(n, CLAIMS);
    assert.ok(q.issues.some((i) => i.code === 'missing-dimension-coverage'));
  });
});

describe('planned fixture decks pass the gate', () => {
  it('F4 Pantrylog idea (EN + KO, all audiences)', () => {
    const claims = extractClaims(acceptIdea(loadIdeaF4()));
    for (const lang of ['en', 'ko']) {
      for (const purpose of ['hackathon', 'competition', 'showcase', 'Pantrylog']) {
        const { narrative, quality } = planNarrativeWithQuality(claims, { purpose, lang });
        assert.ok(narrative.slides.length >= 5 && narrative.slides.length <= 12);
        assert.equal(quality.pass, true, `${lang}/${purpose}: ${JSON.stringify(quality.issues)}`);
        assert.ok(quality.coverage.length >= 3, `${lang}/${purpose}: ${quality.coverage}`);
      }
    }
  });

  it('widgets repo, recsys repo, devtool and KO ideas', async () => {
    const widgets = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(loadRecordedRepo()),
    });
    const recsys = await fetchRepo('northwind', 'recdeck', {
      fetchImpl: recordedRepoFetch(loadRecordedRepoFrom('recorded-recsys.json')),
    });
    const cases: Array<[string, Claim[]]> = [
      ['widgets', extractClaims(widgets)],
      ['recsys', extractClaims(recsys)],
      ['devtool', extractClaims(acceptIdea(loadFixtureText('idea-devtool.txt')))],
      ['ko', extractClaims(acceptIdea(loadFixtureText('idea-ko.txt')))],
    ];
    for (const [name, claims] of cases) {
      const { narrative, quality } = planNarrativeWithQuality(claims, { purpose: 'showcase', lang: 'en' });
      assert.ok(narrative.slides.length >= 5, `${name}: only ${narrative.slides.length} slides`);
      assert.equal(quality.pass, true, `${name}: ${JSON.stringify(quality.issues)}`);
    }
    const { quality: ko } = planNarrativeWithQuality(cases[3][1], { purpose: '쇼케이스', lang: 'ko' });
    assert.equal(ko.pass, true, `ko: ${JSON.stringify(ko.issues)}`);
  });

  it('audiences produce genuinely different argument orders', () => {
    const claims = extractClaims(acceptIdea(loadIdeaF4()));
    const stems = (purpose: string): string =>
      planNarrativeWithQuality(claims, { purpose, lang: 'en' })
        .narrative.slides.map((s) => s.id.split('-').pop())
        .join(',');
    const hackathon = stems('hackathon');
    const competition = stems('competition');
    const showcase = stems('showcase');
    assert.notEqual(hackathon, competition, 'hackathon and competition arcs are identical');
    assert.notEqual(competition, showcase, 'competition and showcase arcs are identical');
    // Competition fronts proof: results headline before capabilities.
    const compOrder = competition.split(',');
    assert.ok(
      compOrder.indexOf('results') < compOrder.indexOf('capabilities'),
      `competition arc: ${competition}`,
    );
  });

  it('recsys deck never heroes a version, year, or date', async () => {
    const recsys = await fetchRepo('northwind', 'recdeck', {
      fetchImpl: recordedRepoFetch(loadRecordedRepoFrom('recorded-recsys.json')),
    });
    const claims = extractClaims(recsys);
    const { narrative } = planNarrativeWithQuality(claims, { purpose: 'hackathon', lang: 'en' });
    const heroes = narrative.slides
      .flatMap((s) => s.blocks)
      .filter((b) => b.role === 'number')
      .map((b) => b.content);
    assert.ok(heroes.length > 0, 'expected at least one number slide');
    const banned = ['2.1', '2.0', '3.0', '2025', '2026', '10', '30', 'v1', 'v2'];
    for (const h of heroes) assert.ok(!banned.includes(h), `bad hero "${h}"`);
  });
});
