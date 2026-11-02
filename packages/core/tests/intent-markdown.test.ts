// Stage 3 C2: Markdown `intent:` grammar (slide-markdown.ts).
// Placement, tokens, canonical serialization order, strict errors.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SLIDE_IR_VERSION, type SlideIR } from '../src/slide-ir';
import { parseSlideMarkdown, serializeSlideMarkdown } from '../src/slide-markdown';

const HEAD = '#!slide-markdown 1\n# Deck title\n> lang: en\n';
const SLIDE_OPEN = '\n## [s1] thesis\nthesis: The thesis\n';
const SLIDE_TAIL = 'refs: \nstatuses: \n';

function doc(body: string): string {
  return `${HEAD}${SLIDE_OPEN}${body}${SLIDE_TAIL}`;
}

function irWithIntents(): SlideIR {
  return {
    version: SLIDE_IR_VERSION,
    title: 'Deck title',
    lang: 'en',
    slides: [
      {
        id: 's1',
        type: 'thesis',
        thesis: 'The thesis',
        blocks: [
          { role: 'title', content: '94% Accuracy', intent: { emphasis: 'primary', groupId: 'g1' } },
          { role: 'body', content: 'Supporting detail here' },
          {
            role: 'caption',
            content: 'Source note',
            intent: { emphasis: 'supporting', groupId: 'my-group_9', relation: 'evidence', deliberateCrop: true },
          },
        ],
        refs: [],
        statuses: [],
      },
    ],
  };
}

describe('C2 parsing', () => {
  it('attaches intent to the immediately preceding block only', () => {
    const ir = parseSlideMarkdown(doc('title: 94% Accuracy\nintent: emphasis=primary group=g1\nbody: Detail\n'));
    assert.deepEqual(ir.slides[0].blocks[0].intent, { emphasis: 'primary', groupId: 'g1' });
    assert.equal('intent' in ir.slides[0].blocks[1], false);
  });
  it('parses all four token kinds', () => {
    const ir = parseSlideMarkdown(doc('body: Detail\nintent: emphasis=supporting group=my-group_9 relation=evidence crop\n'));
    assert.deepEqual(ir.slides[0].blocks[0].intent, {
      emphasis: 'supporting',
      groupId: 'my-group_9',
      relation: 'evidence',
      deliberateCrop: true,
    });
  });
  it('accepts tokens in any order', () => {
    const ir = parseSlideMarkdown(doc('body: Detail\nintent: crop relation=support group=g emphasis=secondary\n'));
    assert.deepEqual(ir.slides[0].blocks[0].intent, {
      emphasis: 'secondary',
      groupId: 'g',
      relation: 'support',
      deliberateCrop: true,
    });
  });
  it('accepts each enum value', () => {
    for (const e of ['primary', 'secondary', 'supporting']) {
      const ir = parseSlideMarkdown(doc(`body: x\nintent: emphasis=${e}\n`));
      assert.deepEqual(ir.slides[0].blocks[0].intent, { emphasis: e });
    }
    for (const r of ['label-value', 'evidence', 'support']) {
      const ir = parseSlideMarkdown(doc(`body: x\nintent: relation=${r}\n`));
      assert.deepEqual(ir.slides[0].blocks[0].intent, { relation: r });
    }
  });
});

describe('C2 placement errors', () => {
  const cases: Array<[string, string]> = [
    ['after thesis', 'thesis: DUP\nintent: emphasis=primary\ntitle: T\n'],
    ['after refs', 'title: T\nrefs: a:1\nintent: emphasis=primary\n'],
    ['after statuses', 'title: T\nstatuses: proposed\nintent: emphasis=primary\n'],
    ['after blank line', 'title: T\n\nintent: emphasis=primary\n'],
    ['two in a row', 'title: T\nintent: emphasis=primary\nintent: group=g\n'],
    ['first line of slide', 'intent: emphasis=primary\ntitle: T\n'],
    ['empty value', 'title: T\nintent:\n'],
    ['blank value', 'title: T\nintent:   \n'],
  ];
  for (const [name, body] of cases) {
    it(`throws on intent ${name}`, () => {
      // Cases that need a nonstandard slide shape spell it out fully.
      const text = name === 'after thesis'
        ? `${HEAD}\n## [s1] thesis\ntitle: T\nthesis: The thesis\nintent: emphasis=primary\n${SLIDE_TAIL}`
        : name === 'first line of slide'
          ? `${HEAD}\n## [s1] thesis\nintent: emphasis=primary\nthesis: The thesis\ntitle: T\n${SLIDE_TAIL}`
          : doc(body);
      assert.throws(() => parseSlideMarkdown(text), /invalid Slide Markdown/, name);
    });
  }
  it('throws on intent outside any slide', () => {
    assert.throws(
      () => parseSlideMarkdown(`${HEAD}intent: emphasis=primary\n`),
      /invalid Slide Markdown/,
    );
  });
});

describe('C2 token errors', () => {
  const cases: Array<[string, string]> = [
    ['bad emphasis', 'intent: emphasis=high'],
    ['empty emphasis', 'intent: emphasis='],
    ['bare emphasis', 'intent: emphasis'],
    ['capitalized key', 'intent: Emphasis=primary'],
    ['empty group', 'intent: group='],
    ['bad group chars', 'intent: group=a!'],
    ['group with space', 'intent: group=has space'],
    ['groupId key (must be group)', 'intent: groupId=g1'],
    ['bad relation', 'intent: relation=causes'],
    ['empty relation', 'intent: relation='],
    ['crop with value', 'intent: crop=true'],
    ['unknown token', 'intent: bogus'],
    ['dup emphasis', 'intent: emphasis=primary emphasis=secondary'],
    ['dup group', 'intent: group=a group=b'],
    ['dup relation', 'intent: relation=evidence relation=support'],
    ['dup crop', 'intent: crop crop'],
  ];
  for (const [name, line] of cases) {
    it(`throws on ${name}`, () => {
      assert.throws(() => parseSlideMarkdown(doc(`title: T\n${line}\n`)), /invalid Slide Markdown/, name);
    });
  }
});

describe('C2 serialization', () => {
  it('emits intent immediately after its block in canonical order', () => {
    const md = serializeSlideMarkdown(irWithIntents());
    const lines = md.split('\n');
    const titleIdx = lines.indexOf('title: 94% Accuracy');
    assert.equal(lines[titleIdx + 1], 'intent: emphasis=primary group=g1');
    const capIdx = lines.indexOf('caption: Source note');
    assert.equal(lines[capIdx + 1], 'intent: emphasis=supporting group=my-group_9 relation=evidence crop');
  });
  it('canonicalizes scrambled token order', () => {
    const ir = irWithIntents();
    ir.slides[0].blocks[0].intent = { deliberateCrop: true, relation: 'support', groupId: 'g', emphasis: 'secondary' };
    const md = serializeSlideMarkdown(ir);
    assert.ok(md.includes('\nintent: emphasis=secondary group=g relation=support crop\n'));
  });
  it('emits no intent lines when absent', () => {
    const ir = irWithIntents();
    for (const b of ir.slides[0].blocks) delete b.intent;
    assert.equal(serializeSlideMarkdown(ir).includes('\nintent:'), false);
  });
  it('Markdown -> IR -> Markdown is byte-stable', () => {
    const once = serializeSlideMarkdown(irWithIntents());
    assert.deepEqual(parseSlideMarkdown(once), irWithIntents());
    assert.equal(serializeSlideMarkdown(parseSlideMarkdown(once)), once);
  });
});
