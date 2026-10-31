// Narrative Intelligence — tests for deterministic semantic analysis.
// Covers dimension ranking, lifecycle status, hero-number validation,
// redundancy/similarity, contextless detection, and audience parsing.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { extractClaims } from '../src/evidence';
import { fetchRepo } from '../src/ingestion';
import {
  analyzeClaim,
  claimSimilarity,
  classifyDimension,
  classifyStatus,
  displayStatus,
  isChangelogClaim,
  isCodeFragment,
  isContextless,
  isHeroEligible,
  isPointer,
  isThin,
  parsePurpose,
  selectHeroNumber,
} from '../src/semantics';
import { loadRecordedRepoFrom, recordedRepoFetch } from './fake-fetch';

describe('classifyDimension', () => {
  const cases: Array<[string, string]> = [
    ['The average household wastes 40 percent of the fresh food it buys.', 'problem'],
    ['Pantrylog fixes this with a 90-second weekly ritual.', 'solution'],
    ['Pilot data shows a 32 percent drop in expired items.', 'results'],
    ['Generic list apps with over 50 million downloads but no expiry tracking.', 'differentiation'],
    ['Capture fatigue sets in if logging takes longer than 90 seconds a week.', 'limitations'],
    ['The roadmap has three phases, starting with barcode coverage.', 'future'],
    ['The app proposes 5 dinner ideas built from what is in stock.', 'capabilities'],
    ['The layout engine packs panels without overlap or flicker.', 'architecture'],
    ['Refresh loops should tick no faster than 10 times per second.', 'limitations'],
    ['Shipgate is a deployment CLI for small teams that dread release Fridays.', 'solution'],
    ['매일 점심 메뉴를 정하는 데 평균 20분을 낭비한다.', 'problem'],
    ['맛집로그는 30초 만에 메뉴를 추천하고 선택을 자동으로 기록한다.', 'solution'],
    ['파일럿 측정 결과 점심 고민 시간이 70% 줄었다.', 'results'],
    ['로드맵은 두 단계로 식당 데이터베이스를 구축할 예정이다.', 'future'],
  ];
  for (const [text, want] of cases) {
    it(`labels "${text.slice(0, 48)}…" as ${want}`, () => {
      assert.equal(classifyDimension(text).dim, want);
    });
  }
  it('defaults scoreless neutral text to capabilities', () => {
    assert.equal(classifyDimension('Widgets are nice and calm here today.').dim, 'capabilities');
  });
  it('is deterministic', () => {
    const t = 'Pilot data shows a 32 percent drop in expired items over eight weeks.';
    assert.deepEqual(classifyDimension(t), classifyDimension(t));
  });
});

describe('classifyStatus', () => {
  it('marks present-tense repo claims implemented', () => {
    assert.equal(
      classifyStatus('The layout engine packs panels without overlap.', 'verified'),
      'implemented',
    );
  });
  it('marks roadmap and future language proposed (repo and idea alike)', () => {
    assert.equal(
      classifyStatus('Phase one will cut indexing lag from 6 hours to 15 minutes.', 'suggestion'),
      'proposed',
    );
    assert.equal(
      classifyStatus('The roadmap will add progressive rollouts in phase two.', 'ungrounded'),
      'proposed',
    );
  });
  it('marks superseded context historical', () => {
    assert.equal(
      classifyStatus('Previously the team served a popularity baseline from a nightly cron.', 'suggestion'),
      'historical',
    );
  });
  it('marks removal notices deprecated', () => {
    assert.equal(
      classifyStatus('The old YAML format is deprecated and will be removed in 2.0.', 'ungrounded'),
      'deprecated',
    );
  });
  it('does not read email domains as product vision', () => {
    assert.equal(
      classifyStatus('Copyright (c) 2008-2009 TJ Holowaychuk <tj@vision-media.ca>', 'verified'),
      'implemented',
    );
  });
  it('keeps ordinary idea claims unverified', () => {
    assert.equal(
      classifyStatus('Shipgate runs 22 preflight checks in about 9 seconds.', 'ungrounded'),
      'unverified',
    );
  });
  it('does not mistake hypothetical problem language for a proposal', () => {
    assert.equal(
      classifyStatus('Bestseller lists bury the products they would buy.', 'suggestion'),
      'implemented',
    );
  });
});

describe('displayStatus', () => {
  it('agrees with the classifier, reading changelog files as historical', () => {
    const ref = (path: string) => ({ path, lines: [1, 1] as [number, number] });
    assert.equal(
      displayStatus({ text: 'The layout engine packs panels without overlap.', kind: 'verified', refs: [ref('src/pack.js')] }),
      'implemented',
    );
    assert.equal(
      displayStatus({ text: 'Phase one will cut indexing lag from 6 hours to 15 minutes.', kind: 'suggestion', refs: [ref('README.md')] }),
      'proposed',
    );
    assert.equal(
      displayStatus({ text: 'Fixed a crash when the panel list is empty for all users.', kind: 'suggestion', refs: [ref('CHANGELOG.md')] }),
      'historical',
    );
    assert.equal(
      displayStatus({ text: 'Shipgate runs 22 preflight checks in about 9 seconds.', kind: 'ungrounded', refs: [ref('idea.txt')] }),
      'unverified',
    );
    assert.equal(
      displayStatus({ text: 'The old YAML format is deprecated and will be removed in 2.0.', kind: 'verified', refs: [ref('docs/migrate.md')] }),
      'deprecated',
    );
  });
});

describe('selectHeroNumber', () => {
  it('prefers the measured result over the version number', () => {
    assert.equal(
      selectHeroNumber({ text: 'The 3.2 release cut render time by 18%.', numbers: ['3.2', '18%'] }),
      '18%',
    );
    assert.equal(isHeroEligible('3.2', 'The 3.2 release cut render time by 18%.'), false);
  });
  it('rejects years and date fragments, keeps the real metric', () => {
    const text = 'Version 2.1 shipped on 2026-10-30 with an 18 percent lift in click-through.';
    assert.equal(
      selectHeroNumber({ text, numbers: ['2.1', '2026', '10', '30', '18 percent'] }),
      '18 percent',
    );
    assert.equal(
      selectHeroNumber({ text: 'On 10/30 we ship the release.', numbers: ['10', '30'] }),
      null,
    );
  });
  it('rejects bare version tokens', () => {
    assert.equal(selectHeroNumber({ text: 'The v2 api is live now.', numbers: ['v2'] }), null);
  });
  it('rejects decimals next to support/require language as versions', () => {
    assert.equal(
      selectHeroNumber({ text: 'Drops support for Ruby 1.8.', numbers: ['1.8'] }),
      null,
    );
    assert.equal(
      selectHeroNumber({ text: 'Supports Python 3.9 and newer releases.', numbers: ['3.9'] }),
      null,
    );
    assert.equal(
      selectHeroNumber({
        text: 'Please use 4.2.1 if you still need Ruby 1.8 compatibility.',
        numbers: ['4.2', '1', '1.8'],
      }),
      null,
    );
  });
  it('rejects issue/PR/bug numbers as heroes', () => {
    assert.equal(
      selectHeroNumber({
        text: 'Fixed a bug with always_trace (#91) for users.',
        numbers: ['91'],
      }),
      null,
    );
    assert.equal(
      selectHeroNumber({ text: 'See issue 33 for the full discussion thread.', numbers: ['33'] }),
      null,
    );
  });
  it('prefers compact units, then decimals, then word units, then bare counts', () => {
    assert.equal(
      selectHeroNumber({
        text: 'Renders dashboards in under 120ms across 12 panels.',
        numbers: ['120ms', '12 panels'],
      }),
      '120ms',
    );
    assert.equal(
      selectHeroNumber({ text: 'Recall@10 of 0.31 on the retail benchmark.', numbers: ['10', '0.31'] }),
      '0.31',
    );
    assert.equal(
      selectHeroNumber({
        text: 'Wastes 40 percent of food, about 80 dollars a month.',
        numbers: ['40 percent', '80 dollars'],
      }),
      '40 percent',
    );
  });
  it('prefers the target bound of a from-X-to-Y range', () => {
    assert.equal(
      selectHeroNumber({
        text: 'Phase one will cut indexing lag from 6 hours to 15 minutes.',
        numbers: ['6 hours', '15 minutes'],
      }),
      '15 minutes',
    );
  });
  it('handles Korean counters: durations eligible, dates rejected', () => {
    assert.equal(
      selectHeroNumber({ text: '평균 20분을 낭비하고 3만원을 쓴다.', numbers: ['20분', '3만원'] }),
      '20분',
    );
    assert.equal(
      selectHeroNumber({ text: '3일 동안 매일 사용했다.', numbers: ['3일'] }),
      '3일',
    );
    assert.equal(selectHeroNumber({ text: '2026년에 출시했다.', numbers: ['2026년'] }), null);
    assert.equal(
      selectHeroNumber({ text: '10월 30일에 출시했다.', numbers: ['10', '30일'] }),
      null,
    );
  });
});

describe('claimSimilarity', () => {
  const readmeRanker =
    'The ranker blends collaborative filtering with on-device session signals to propose ten items in under 40ms.';
  const serveRanker =
    'Serve blends collaborative filtering with session signals to propose ten items fast in production use.';
  it('scores near-duplicate claims as redundant', () => {
    assert.ok(claimSimilarity(readmeRanker, serveRanker) >= 0.55);
    assert.equal(claimSimilarity(readmeRanker, readmeRanker), 1);
  });
  it('scores topically distinct claims as different', () => {
    assert.ok(
      claimSimilarity(readmeRanker, 'P99 latency is 40ms at 800 requests per second.') < 0.55,
    );
  });
});

describe('isContextless / isThin', () => {
  it('flags pronoun-led sentences with no anchor', () => {
    assert.equal(isContextless('It will be great for all users now.'), true);
  });
  it('keeps grounded It-led sentences', () => {
    assert.equal(
      isContextless('It ships as a single 2kB dependency-free module with zero configuration.'),
      false,
    );
  });
  it('flags pointer sentences, but not content starting with Read', () => {
    assert.equal(isPointer('See docs/roadmap.md for planned work.'), true);
    assert.equal(isPointer('Read receipts sync automatically.'), false);
  });
  it('flags API-example residue as code fragments, not prose', () => {
    assert.equal(isCodeFragment('dayjs().set(\'month\', 3).month() // get and set'), true);
    assert.equal(isCodeFragment('import dayjs from \'dayjs\' for parsing dates'), true);
    assert.equal(isCodeFragment('Read https://example.com/docs for details here.'), false);
    assert.equal(isCodeFragment('Each function validates its input carefully.'), false);
  });
  it('reads changelog-family docs as historical, not same-named code', () => {
    assert.equal(isChangelogClaim({ refs: [{ path: 'History.rdoc', lines: [8, 8] }] }), true);
    assert.equal(isChangelogClaim({ refs: [{ path: 'CHANGELOG.md' }] }), true);
    assert.equal(isChangelogClaim({ refs: [{ path: 'src/history.js' }] }), false);
    assert.equal(isChangelogClaim({ refs: [{ path: 'README.md' }] }), false);
    assert.equal(isChangelogClaim({ refs: [] }), false);
  });
  it('flags short numberless fragments as thin, keeps substantive claims', () => {
    assert.equal(isThin('The core loop has three steps.', []), true);
    assert.equal(
      isThin('Renders tables, gauges, and sparklines with plain Unicode characters.', []),
      false,
    );
    assert.equal(isThin('Cut render time by 18% this week.', ['18%']), false);
  });
});

describe('parsePurpose', () => {
  it('detects bare audiences in EN and KO', () => {
    assert.deepEqual(parsePurpose('hackathon'), { audience: 'hackathon' });
    assert.deepEqual(parsePurpose('competition'), { audience: 'competition' });
    assert.deepEqual(parsePurpose('showcase'), { audience: 'showcase' });
    assert.deepEqual(parsePurpose('해커톤'), { audience: 'hackathon' });
  });
  it('splits audience prefixes from custom titles', () => {
    assert.deepEqual(parsePurpose('Competition: Acme'), { audience: 'competition', title: 'Acme' });
    assert.deepEqual(parsePurpose('쇼케이스: 맛집로그'), { audience: 'showcase', title: '맛집로그' });
  });
  it('treats anything else as a custom title with a general audience', () => {
    assert.deepEqual(parsePurpose('Widgets'), { audience: 'general', title: 'Widgets' });
    assert.deepEqual(parsePurpose(''), { audience: 'general' });
    assert.deepEqual(parsePurpose(undefined), { audience: 'general' });
  });
});

describe('recsys fixture analysis', () => {
  it('covers implemented, proposed, historical, and deprecated claims', async () => {
    const record = loadRecordedRepoFrom('recorded-recsys.json');
    const ingested = await fetchRepo('northwind', 'recdeck', {
      fetchImpl: recordedRepoFetch(record),
    });
    const claims = extractClaims(ingested);
    assert.ok(claims.length >= 12, `expected >=12 claims, got ${claims.length}`);
    const statuses = new Set(claims.map((c) => analyzeClaim(c).status));
    for (const want of ['implemented', 'proposed', 'historical', 'deprecated']) {
      assert.ok(statuses.has(want as never), `missing status ${want}: ${[...statuses]}`);
    }
    // No hero metric may be a version, year, or date fragment from the fixture.
    const banned = new Set(['2.1', '2.0', '3.0', '2025', '2026', '10', '30', 'v1', 'v2']);
    for (const c of claims) {
      const hero = analyzeClaim(c).hero;
      if (hero !== null) {
        assert.ok(!banned.has(hero), `bad hero "${hero}" from ${c.id}: ${c.text}`);
      }
    }
    // The recommender's headline metric survives as a hero candidate.
    const lift = claims.find((c) => c.text.includes('18 percent lift'));
    assert.ok(lift, 'expected the 18-percent-lift claim');
    assert.equal(analyzeClaim(lift).hero, '18 percent');
  });
});
