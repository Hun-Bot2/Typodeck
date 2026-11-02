// Stage 3 C1: strict BlockIntent validation (schema.ts).
// Table-driven: every invalid intent is rejected by validateNarrative,
// validateSlideIR, and validateDeck; valid intents pass all three.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateDeck,
  validateNarrative,
  type BlockIntent,
  type Deck,
  type Narrative,
} from '../src/schema';
import { SLIDE_IR_VERSION, validateSlideIR } from '../src/slide-ir';

function narrativeWithIntent(intent: unknown): unknown {
  return {
    title: 't',
    lang: 'en',
    slides: [
      {
        id: 's1',
        thesis: 'th',
        blocks: [
          { role: 'title', content: 'Hello', ...(intent === undefined ? {} : { intent }) },
          { role: 'body', content: 'Plain block without intent' },
        ],
      },
    ],
  };
}

function irWithIntent(intent: unknown): unknown {
  return {
    version: SLIDE_IR_VERSION,
    title: 't',
    lang: 'en',
    slides: [
      {
        id: 's1',
        type: 'thesis',
        thesis: 'th',
        blocks: [
          { role: 'title', content: 'Hello', ...(intent === undefined ? {} : { intent }) },
          { role: 'body', content: 'Plain block without intent' },
        ],
        refs: [],
        statuses: [],
      },
    ],
  };
}

function deckWithIntent(intent: unknown): unknown {
  return {
    meta: { title: 't', lang: 'en', system: 'editorial', seed: 1, generatedBy: 'test' },
    slides: [
      {
        id: 's1',
        thesis: 'th',
        background: '#ffffff',
        blocks: [
          {
            id: 's1-b0',
            role: 'title',
            content: 'Hello',
            x: 1,
            y: 1,
            w: 5,
            h: 1,
            fontSize: 24,
            fontWeight: 700,
            tracking: 0,
            lineHeight: 1.2,
            align: 'left',
            color: '#111111',
            ...(intent === undefined ? {} : { intent }),
          },
        ],
      },
    ],
  };
}

const INVALID: Array<[string, unknown]> = [
  ['bad emphasis', { emphasis: 'high' }],
  ['capitalized emphasis', { emphasis: 'Primary' }],
  ['empty emphasis', { emphasis: '' }],
  ['null emphasis', { emphasis: null }],
  ['numeric emphasis', { emphasis: 1 }],
  ['empty groupId', { groupId: '' }],
  ['groupId with space', { groupId: 'my group' }],
  ['groupId with dot', { groupId: 'g.1' }],
  ['groupId with bang', { groupId: 'g!1' }],
  ['groupId too long', { groupId: 'x'.repeat(65) }],
  ['numeric groupId', { groupId: 7 }],
  ['null groupId', { groupId: null }],
  ['bad relation', { relation: 'causes' }],
  ['capitalized relation', { relation: 'Evidence' }],
  ['empty relation', { relation: '' }],
  ['string deliberateCrop', { deliberateCrop: 'true' }],
  ['numeric deliberateCrop', { deliberateCrop: 1 }],
  ['null deliberateCrop', { deliberateCrop: null }],
  ['unknown key', { emphasis: 'primary', mood: 'bold' }],
  ['only unknown key', { group: 'g1' }],
  ['intent is a string', 'primary'],
  ['intent is a number', 42],
  ['intent is an array', ['primary']],
  ['intent is null', null],
];

describe('C1 strict validation', () => {
  for (const [name, intent] of INVALID) {
    it(`rejects ${name} in validateNarrative`, () => {
      assert.throws(() => validateNarrative(narrativeWithIntent(intent)), /intent|emphasis|groupId|relation|deliberateCrop|unknown key|must be an object/);
    });
    it(`rejects ${name} in validateSlideIR`, () => {
      assert.throws(() => validateSlideIR(irWithIntent(intent)), /intent|emphasis|groupId|relation|deliberateCrop|unknown key|must be an object|invalid Slide IR/);
    });
    it(`rejects ${name} in validateDeck`, () => {
      assert.throws(() => validateDeck(deckWithIntent(intent)), /intent|emphasis|groupId|relation|deliberateCrop|unknown key|must be an object/);
    });
  }
});

describe('C1 groupId pattern', () => {
  const good = ['g', 'g1', 'A-_9', 'x'.repeat(64), '-_', 'UPPER-lower_09'];
  for (const groupId of good) {
    it(`accepts groupId ${JSON.stringify(groupId.length > 12 ? groupId.slice(0, 12) + '…' : groupId)}`, () => {
      validateNarrative(narrativeWithIntent({ groupId }));
      validateSlideIR(irWithIntent({ groupId }));
      validateDeck(deckWithIntent({ groupId }));
    });
  }
  const bad: unknown[] = ['', 'x'.repeat(65), 'a b', 'a.b', 'a/b', 'a:b', 'ünï', 'g#1', '\t'];
  for (const groupId of bad) {
    it(`rejects groupId ${JSON.stringify(groupId)}`, () => {
      assert.throws(() => validateNarrative(narrativeWithIntent({ groupId })), /groupId/);
    });
  }
});

describe('C1 valid intents pass through', () => {
  const valid: BlockIntent[] = [
    {},
    { emphasis: 'primary' },
    { emphasis: 'secondary' },
    { emphasis: 'supporting' },
    { groupId: 'g1' },
    { relation: 'label-value' },
    { relation: 'evidence' },
    { relation: 'support' },
    { deliberateCrop: true },
    { deliberateCrop: false },
    { emphasis: 'primary', groupId: 'g-1_A', relation: 'evidence', deliberateCrop: true },
  ];
  for (const intent of valid) {
    it(`accepts ${JSON.stringify(intent)} in all validators`, () => {
      const n = validateNarrative(narrativeWithIntent(intent)) as Narrative;
      assert.deepEqual(n.slides[0].blocks[0].intent, intent);
      const ir = validateSlideIR(irWithIntent(intent));
      assert.deepEqual(ir.slides[0].blocks[0].intent, intent);
      const d = validateDeck(deckWithIntent(intent)) as Deck;
      assert.deepEqual(d.slides[0].blocks[0].intent, intent);
    });
  }
  it('absent intent stays absent (no key added)', () => {
    const n = validateNarrative(narrativeWithIntent(undefined)) as Narrative;
    assert.equal('intent' in n.slides[0].blocks[0], false);
    assert.equal('intent' in n.slides[0].blocks[1], false);
  });
});
