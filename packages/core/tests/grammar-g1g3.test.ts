// G1/G3 grammar integration tests (research/slide-reconstruction).
// Every new composition: short/medium/long content x 2 systems (contexts) x
// EN/KO, each verified as HTML (rendered overflow gate) + editable PPTX
// (structural byte validation + text parity). O1-O5 stay unpromoted.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  CANDIDATE_IDS,
  COMPOSITION_CANDIDATES,
  candidateIndex,
  planCompositions,
} from '../src/composition';
import {
  critiqueDeck,
  critiqueRenderedOverflow,
  measureSlideRender,
} from '../src/critic';
import { exportToPptxBuffer } from '../src/export';
import { layoutDeck } from '../src/layout';
import type { Narrative } from '../src/schema';
import type { SystemId } from '../src/systems';
import { validatePptxBytes } from '../src/validate';

const HAS_CHROME = (() => {
  for (const bin of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'google-chrome', 'chromium']) {
    const r = spawnSync(bin, ['--version'], { encoding: 'utf8', timeout: 10000 });
    if (!r.error && r.status === 0) return true;
  }
  return process.env.TYPODECK_CHROME !== undefined && process.env.TYPODECK_CHROME !== '';
})();

// ---------------------------------------------------------------------------
// Matrix content: short / medium / long x EN / KO (probe-inspired, original)
// ---------------------------------------------------------------------------

interface G1Case { numeral: string; title: string; kicker: string }
const G1_CASES: Record<string, G1Case> = {
  'short-en': { numeral: '5', title: 'Oceans, Mapped', kicker: 'FIELD NOTES' },
  'med-en': { numeral: '12', title: 'Where the Night Trains Still Run', kicker: 'SPECIAL REPORT' },
  'long-en': { numeral: '98%', title: 'Where the Night Trains Still Run on Time Across Every Border', kicker: 'SPECIAL REPORT' },
  'short-ko': { numeral: '3', title: '한반도의 새', kicker: '기획 특집' },
  'med-ko': { numeral: '12', title: '밤에도 정시에 달리는 열차들', kicker: '심층 보도' },
  'long-ko': { numeral: '98%', title: '국경을 넘어 밤에도 정시에 달리는 야간 열차의 비밀', kicker: '심층 보도' },
};

interface G3Case { runhead: string; headline: string; bodies: string[] }
const G3_CASES: Record<string, G3Case> = {
  'short-en': {
    runhead: 'CHANGELOG: RELEASE 4.2', headline: 'WHY NOW?',
    bodies: [
      'Three small fixes ship together because they share one root cause.',
      'Sync now batches writes. Large folders finish in one pass.',
      'Retries back off instead of hammering. Logs stay readable.',
    ],
  },
  'med-en': {
    runhead: 'POLICY BRIEF: HARBOR LEVY', headline: 'WHY THE LEVY FAILED',
    bodies: [
      'The harbor levy failed twice: once at the ballot box and once more in committee, and the two failures have different causes.',
      'The levy needed dockworkers and merchants to campaign together. They never shared a room, and neither group trusted the consultants.',
      'Revenue projections changed three times as fuel prices swung. Each revision gave opponents a fresh headline.',
      'A favorable state audit arrived in August and sat unread while the committee debated procedure. Timing beat substance.',
    ],
  },
  'long-en': {
    runhead: 'POLICY BRIEF: HARBOR LEVY', headline: 'WHY THE LEVY FAILED TWICE',
    bodies: [
      'The harbor levy failed twice: once at the ballot box and once more in committee, and the two failures have different causes that are usually conflated in press coverage. Understanding each separately is the only way to draft a third attempt that survives.',
      'The levy needed dockworkers and merchants to campaign together. They never shared a room: the merchants met downtown on Tuesdays while the dockworkers met at the hall on Thursdays, and neither group trusted the consultants who carried messages between them.',
      'Revenue projections changed three times during the campaign as fuel prices swung. Each revision gave opponents a fresh headline, and the final estimate landed the week before the vote, too late to explain to anyone.',
      'A favorable state audit arrived in August and sat unread while the committee debated procedure. By the time anyone quoted it, the narrative had hardened beyond what any single document could shift.',
      'Coastal precincts split from inland ones late in the race. Canvassers reported doors closing on the levy weeks before the polls moved, and the campaign never found a message that traveled both ways.',
      'The next draft should lock projections early, meet jointly, and publish the audit summary on page one. Details: harbor.example.org/levy-postmortem',
    ],
  },
  'short-ko': {
    runhead: '자료 해설: 기대 수명', headline: '왜 무지인가?',
    bodies: [
      '세계 기대 수명에 대한 질문에 많은 사람이 오답을 고른다.',
      '세계 보건이 크게 나아졌다는 사실은 잘 알려져 있지 않다.',
      '기대 수명의 증가는 너무 느리게 일어나 뉴스가 되지 못한다.',
    ],
  },
  'med-ko': {
    runhead: '자료 해설: 기대 수명', headline: '왜 무지인가?',
    bodies: [
      '세계 기대 수명에 대한 질문에 많은 사람이 오답을 고른다. 그 이유를 이해하는 일은 생각보다 어렵고, 같은 오답 패턴이 여러 나라에서 반복된다.',
      '세계 보건이 크게 나아졌다는 사실은 잘 알려져 있지 않다. 전환에는 수십 년이 걸렸고 그 과정은 기록으로만 남았다.',
      '기대 수명의 증가는 너무 느리게 일어나 뉴스가 되지 못한다. 수십 년 이어지지만 대중은 모른다.',
      '다수가 여전히 극빈층이라는 오해가 오답을 낳는다. 실제로는 수십억 명이 중간 소득 국가에 산다.',
    ],
  },
  'long-ko': {
    runhead: '자료 해설: 기대 수명과 세계 보건', headline: '왜 세계 보건의 진전을 모르는가?',
    bodies: [
      '세계 기대 수명에 대한 질문에 많은 사람이 오답을 고른다. 그 이유를 이해하는 일은 생각보다 어렵다. 같은 오답 패턴이 여러 나라에서 반복되기 때문이며, 이는 교육과 보도의 구조적 문제와 맞닿아 있다.',
      '세계 보건이 크게 나아졌다는 사실은 잘 알려져 있지 않다. 전환에는 수십 년이 걸렸고, 그 과정은 뉴스 한 줄로 요약되지 않는 느린 변화의 연속이었다.',
      '기대 수명의 증가는 너무 느리게 일어나 뉴스가 되지 못한다. 수십 년 이어지는 추세이지만 대중은 모르고, 언론은 극적인 사건만 다룬다.',
      '다수가 여전히 극빈층이라는 오해가 오답을 낳는다. 실제로는 수십억 명이 중간 소득 국가에 살며, 극빈층의 비율은 역사상 가장 낮은 수준이다.',
      '설문 응답자들은 소득 분포를 묻는 문항에서도 비슷한 오류를 보인다. 다봉 분포를 상상하지만 실제 분포는 단일 봉우리에 가깝다.',
      '자세한 내용은 자료실에서 확인할 수 있다. 수치는 공개 통계에 근거한다: example.org/ko-longevity',
    ],
  },
};

const FOOT_EN = ['probe.example.org/teach', 'Free teaching material for a fact-based worldview', 'Version: 6'];
const FOOT_KO = ['probe.example.org/ko-teach', '사실 기반 세계관을 위한 무료 교육 자료', '버전: 6'];

function g1Narrative(key: string): Narrative {
  const c = G1_CASES[key];
  const ko = key.endsWith('-ko');
  return {
    title: `G1 ${key}`, lang: ko ? 'ko' : 'en',
    slides: [{
      id: 'n0-cover', thesis: `G1 probe ${key}`,
      blocks: [
        { role: 'kicker', content: c.kicker },
        { role: 'number', content: c.numeral },
        { role: 'title', content: c.title },
        ...(ko ? FOOT_KO : FOOT_EN).map((content) => ({ role: 'caption' as const, content })),
      ],
    }],
  };
}

function g3Narrative(key: string): Narrative {
  const c = G3_CASES[key];
  const ko = key.endsWith('-ko');
  return {
    title: `G3 ${key}`, lang: ko ? 'ko' : 'en',
    slides: [
      // Cover first, closing last: edge positions classify by position.
      { id: 'n0-cover', thesis: `G3 probe ${key} cover`, blocks: [{ role: 'title', content: ko ? '기대 수명 보고서' : 'The Longevity Report' }] },
      {
        id: 'n2-results', thesis: `G3 probe ${key}`,
        blocks: [
          { role: 'kicker', content: c.runhead },
          { role: 'title', content: c.headline },
          ...c.bodies.map((content) => ({ role: 'body' as const, content })),
          ...(ko ? FOOT_KO : FOOT_EN).map((content) => ({ role: 'caption' as const, content })),
        ],
      },
      { id: 'n4-closing', thesis: `G3 probe ${key} close`, blocks: [{ role: 'title', content: ko ? '핵심 요약' : 'Takeaway' }] },
    ],
  };
}

function g3SlideIndex(): number { return 1; }

// ---------------------------------------------------------------------------
// Records, metadata, index
// ---------------------------------------------------------------------------

describe('G1/G3 candidate records', () => {
  it('G1 monumental-numeral-cover exists with full selection metadata', () => {
    const c = COMPOSITION_CANDIDATES['opening-monumental-numeral'];
    assert.ok(c, 'G1 candidate missing');
    assert.deepEqual(c.semanticTypes, ['opening']);
    assert.ok(c.systems.includes('swiss'));
    assert.ok(c.preconditions.requiresRoles?.includes('number'));
    assert.ok((c.bestFor?.length ?? 0) >= 1);
    assert.ok((c.avoidFor?.length ?? 0) >= 1);
    assert.equal(c.density, 'sparse');
    assert.equal(c.formality, 'formal');
  });
  it('G3 explainer-columns exists with full selection metadata', () => {
    const c = COMPOSITION_CANDIDATES['evidence-explainer-columns'];
    assert.ok(c, 'G3 candidate missing');
    assert.ok(c.semanticTypes.includes('evidence') && c.semanticTypes.includes('insight'));
    assert.equal(c.constraints.columns, 2);
    assert.ok((c.bestFor?.length ?? 0) >= 1);
    assert.ok((c.avoidFor?.length ?? 0) >= 1);
    assert.equal(c.density, 'dense');
    assert.equal(c.formality, 'neutral');
  });
  it('O1-O5 single-instance observations are NOT promoted', () => {
    const banned = ['quiz', 'stat-stack', 'monumental-quote', 'constellation', 'dark-title-stack'];
    for (const id of CANDIDATE_IDS) {
      for (const b of banned) assert.ok(!id.includes(b), `${id} looks like promoted ${b}`);
    }
  });
  it('candidate-index covers every record with density/formality/best/avoid', () => {
    const idx = candidateIndex();
    assert.equal(idx.length, CANDIDATE_IDS.length);
    for (const row of idx) {
      assert.ok(['sparse', 'balanced', 'dense'].includes(row.density), row.id);
      assert.ok(['formal', 'neutral', 'expressive'].includes(row.formality), row.id);
      assert.ok(row.bestFor.length >= 1, `${row.id} bestFor`);
      assert.ok(row.avoidFor.length >= 1, `${row.id} avoidFor`);
    }
  });
});

describe('G1/G3 selection', () => {
  for (const system of ['swiss', 'editorial'] as const) {
    it(`selects G1 for numeral-bearing openings (${system})`, () => {
      const plan = planCompositions(g1Narrative('short-en'), system);
      assert.equal(plan[0].candidateId, 'opening-monumental-numeral');
    });
  }
  it('does not select G1 without a hero number', () => {
    const n = {
      title: 't', lang: 'en',
      slides: [{ id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'A plain opening title' }] }],
    } as unknown as Narrative;
    for (const system of ['swiss', 'editorial'] as const) {
      const plan = planCompositions(n, system);
      assert.notEqual(plan[0].candidateId, 'opening-monumental-numeral');
    }
  });
  it('selects G3 for dense evidence without refs', () => {
    // med-en has 4 bodies; strip :// refs so collated/anchored gate out.
    const n = g3Narrative('med-en');
    n.slides[g3SlideIndex()].blocks = n.slides[g3SlideIndex()].blocks.map((b) =>
      b.role === 'caption' ? { ...b, content: 'General teaching note' } : b);
    const plan = planCompositions(n, 'swiss');
    assert.equal(plan[g3SlideIndex()].candidateId, 'evidence-explainer-columns');
  });
});

// ---------------------------------------------------------------------------
// Responsive rules R1-R3
// ---------------------------------------------------------------------------

describe('responsive rules', () => {
  it('R1: numeral box width grows with digit count', () => {
    const wOf = (numeral: string): number => {
      const n = g1Narrative('short-en');
      n.slides[0].blocks[1] = { role: 'number', content: numeral };
      const deck = layoutDeck(n, 'swiss', {
        seed: 7,
        compositionPlan: [{ slideId: 'n0-cover', semanticType: 'opening', candidateId: 'opening-monumental-numeral', rationale: 'test', score: 1 }],
      });
      return deck.slides[0].blocks.find((b) => b.role === 'number')?.w ?? -1;
    };
    const w1 = wOf('5');
    const w2 = wOf('12');
    const w3 = wOf('98%');
    assert.ok(w2 > w1, `12 (${w2}) should exceed 5 (${w1})`);
    assert.ok(w3 > w1, `98% (${w3}) should exceed 5 (${w1})`);
  });
  it('R2: long titles step down and stay within 2 lines', () => {
    const n = g1Narrative('long-en');
    const plan = planCompositions(n, 'swiss');
    assert.equal(plan[0].candidateId, 'opening-monumental-numeral');
    const deck = layoutDeck(n, 'swiss', { seed: 7, compositionPlan: plan });
    const title = deck.slides[0].blocks.find((b) => b.role === 'title');
    assert.ok(title && title.fontSize < 57, `R2 step-down, got ${title?.fontSize}`);
    const short = layoutDeck(g1Narrative('short-en'), 'swiss', {
      seed: 7,
      compositionPlan: [{ slideId: 'n0-cover', semanticType: 'opening', candidateId: 'opening-monumental-numeral', rationale: 't', score: 1 }],
    });
    const shortTitle = short.slides[0].blocks.find((b) => b.role === 'title');
    // R2's rule is relative step-down (short stays larger than long), not an
    // exact size: the render guard may shrink even short titles until
    // rendered ink fits the box (57pt spilled ~0.4in on 2 lines).
    assert.ok(
      shortTitle && title && shortTitle.fontSize > title.fontSize,
      `short (${shortTitle?.fontSize}) should exceed long (${title?.fontSize})`,
    );
    assert.ok(shortTitle && shortTitle.fontSize <= 57, `short should not exceed 57, got ${shortTitle?.fontSize}`);
  });
  it('R3: G3 column count parameterizes (single col <=2 middle, grouped above)', () => {
    const xsOf = (key: string): number[] => {
      const n = g3Narrative(key);
      const deck = layoutDeck(n, 'swiss', {
        seed: 7,
        compositionPlan: [{ slideId: 'n2-results', semanticType: 'evidence', candidateId: 'evidence-explainer-columns', rationale: 't', score: 1 }],
      });
      // Middle bodies (not lede, not closing): distinct column x-edges.
      const bodies = deck.slides[g3SlideIndex()].blocks.filter((b) => b.role === 'body');
      const middle = bodies.length <= 3 ? bodies.slice(1) : bodies.slice(1, -1);
      return [...new Set(middle.map((b) => Math.round(b.x * 100)))].sort((a, b) => a - b);
    };
    assert.equal(xsOf('short-en').length, 1, 'short G3 stays single-column');
    assert.equal(xsOf('long-en').length, 2, 'long G3 groups into 2 columns');
  });
});

// ---------------------------------------------------------------------------
// Full matrix: layout + static critique + PPTX per cell (always run)
// ---------------------------------------------------------------------------

const SYSTEMS: SystemId[] = ['swiss', 'editorial'];
const KEYS = ['short-en', 'med-en', 'long-en', 'short-ko', 'med-ko', 'long-ko'];

async function verifyPptxCell(narrative: Narrative, system: SystemId, candidateId: string): Promise<void> {
  const targetIdx = candidateId.startsWith('opening-') ? 0 : g3SlideIndex();
  const slideId = narrative.slides[targetIdx].id;
  const semanticType = candidateId.startsWith('opening-') ? 'opening' : 'evidence';
  const deck = layoutDeck(narrative, system, {
    seed: 7,
    compositionPlan: [{ slideId, semanticType, candidateId, rationale: 'matrix', score: 1 }],
  });
  // layoutDeck throws on overlap; validate via critique (no overflow-risk).
  const report = critiqueDeck(deck);
  const risks = report.findings.filter((f) => f.check === 'overflow-risk');
  assert.deepEqual(risks, [], `${candidateId} ${system} static overflow-risk: ${JSON.stringify(risks)}`);
  const { buffer, slideCount, textBoxCount } = await exportToPptxBuffer(deck);
  assert.equal(slideCount, narrative.slides.length);
  assert.equal(textBoxCount, deck.slides.reduce((a, s) => a + s.blocks.length, 0));
  const expectedChars = deck.slides.flatMap((s) => s.blocks).reduce((a, b) => a + b.content.length, 0);
  const check = await validatePptxBytes(buffer, expectedChars);
  assert.equal(check.ok, true, `${candidateId} ${system}: ${check.errors.join('; ')}`);
}

describe('G1 matrix: layout + static critique + PPTX', () => {
  for (const system of SYSTEMS) {
    for (const key of KEYS) {
      it(`G1 ${key} ${system} validates, fits statically, exports editable PPTX`, async () => {
        await verifyPptxCell(g1Narrative(key), system, 'opening-monumental-numeral');
      });
    }
  }
});

describe('G3 matrix: layout + static critique + PPTX', () => {
  for (const system of SYSTEMS) {
    for (const key of KEYS) {
      it(`G3 ${key} ${system} validates, fits statically, exports editable PPTX`, async () => {
        await verifyPptxCell(g3Narrative(key), system, 'evidence-explainer-columns');
      });
    }
  }
});

// ---------------------------------------------------------------------------
// Full matrix: rendered overflow gate per cell (Chrome-gated)
// ---------------------------------------------------------------------------

function verifyRenderedCell(narrative: Narrative, system: SystemId, candidateId: string): void {
  const targetIdx = candidateId.startsWith('opening-') ? 0 : g3SlideIndex();
  const slideId = narrative.slides[targetIdx].id;
  const semanticType = candidateId.startsWith('opening-') ? 'opening' : 'evidence';
  const deck = layoutDeck(narrative, system, {
    seed: 7,
    compositionPlan: [{ slideId, semanticType, candidateId, rationale: 'matrix', score: 1 }],
  });
  const slide = deck.slides[targetIdx];
  const ms = measureSlideRender(slide, system);
  assert.equal(ms.length, slide.blocks.length, 'probe must cover every block');
  const r = critiqueRenderedOverflow(slide, ms);
  assert.deepEqual(r.unmeasured, []);
  const errs = r.findings.filter((f) => f.check === 'overflow-visible');
  assert.deepEqual(errs, [], `${candidateId} rendered clip: ${JSON.stringify(errs)}`);
}

describe('G1/G3 matrix: rendered overflow gate', { skip: !HAS_CHROME }, () => {
  for (const system of SYSTEMS) {
    for (const key of KEYS) {
      it(`G1 ${key} ${system} renders without clipping`, () => {
        verifyRenderedCell(g1Narrative(key), system, 'opening-monumental-numeral');
      });
    }
  }
  for (const system of SYSTEMS) {
    for (const key of KEYS) {
      it(`G3 ${key} ${system} renders without clipping`, () => {
        verifyRenderedCell(g3Narrative(key), system, 'evidence-explainer-columns');
      });
    }
  }
});
