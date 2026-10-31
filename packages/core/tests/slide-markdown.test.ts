// Slide Markdown: canonical serialization, strict parsing, hostile-content
// inertness, human editability.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { acceptIdea } from '../src/ingestion';
import { extractClaims } from '../src/evidence';
import { planNarrative } from '../src/narrative';
import { narrativeToSlideIR, slideIRToNarrative } from '../src/slide-ir';
import { parseSlideMarkdown, serializeSlideMarkdown } from '../src/slide-markdown';
import { loadFixtureText } from './fake-fetch';

function f4IR(lang: 'en' | 'ko' = 'en') {
  const claims = extractClaims(acceptIdea(loadFixtureText('idea-f4.txt')));
  const narrative = planNarrative(claims, { preset: 'P04', lang });
  return { claims, narrative, ir: narrativeToSlideIR(narrative, claims, { preset: 'P04' }) };
}

describe('round-trip', () => {
  it('IR -> Markdown -> IR is identical (EN preset)', () => {
    const { ir } = f4IR('en');
    assert.deepEqual(parseSlideMarkdown(serializeSlideMarkdown(ir)), ir);
  });
  it('IR -> Markdown -> IR is identical (KO legacy path)', () => {
    const claims = extractClaims(acceptIdea(loadFixtureText('idea-ko.txt')));
    const narrative = planNarrative(claims, { purpose: 'showcase', lang: 'ko' });
    const ir = narrativeToSlideIR(narrative, claims);
    assert.deepEqual(parseSlideMarkdown(serializeSlideMarkdown(ir)), ir);
  });
  it('serialization is canonical (byte-stable)', () => {
    const { ir } = f4IR('en');
    const once = serializeSlideMarkdown(ir);
    assert.equal(serializeSlideMarkdown(parseSlideMarkdown(once)), once);
  });
  it('edited Markdown flows back to an equivalent narrative', () => {
    const { ir } = f4IR('en');
    const md = serializeSlideMarkdown(ir).replaceAll('thesis: ', 'thesis: EDITED ');
    const edited = parseSlideMarkdown(md);
    const n = slideIRToNarrative(edited);
    assert.ok(n.slides.every((s) => s.thesis.startsWith('EDITED ')));
  });
});

describe('strictness', () => {
  const good = () => serializeSlideMarkdown(f4IR('en').ir);
  it('rejects malformed documents', () => {
    const cases: Array<[string, string]> = [
      ['bad version', good().replace('#!slide-markdown 1', '#!slide-markdown 2')],
      ['missing title', good().replace(/^# .+\n/m, '')],
      ['missing lang', good().replace(/^> lang: .+\n/m, '')],
      ['unknown meta', good().replace('> lang: en', '> lang: en\n> theme: dark')],
      ['unknown field', good().replace('\nthesis: ', '\nfont: Haettenschweiler\nthesis: ')],
      ['dup thesis', good().replace('\nthesis: ', '\nthesis: dup\nthesis: ')],
      ['unknown type', good().replace(/\] \w+/, '] meme')],
      ['unknown status', good().replace('statuses: ', 'statuses: vibes, ')],
      ['missing thesis', good().replace(/\nthesis: [^\n]+\n/, '\n')],
      ['garbage line', good() + 'this is not a field\n'],
      ['content outside slide', '#!slide-markdown 1\n# t\n> lang: en\nbody: orphan\n'],
    ];
    for (const [name, doc] of cases) {
      assert.throws(() => parseSlideMarkdown(doc), /invalid Slide Markdown/, name);
    }
  });
  it('rejects duplicate slide ids', () => {
    const md = good();
    const ids = [...md.matchAll(/^## \[([^\]]+)\]/gm)].map((m) => m[1]);
    assert.ok(ids.length >= 2);
    assert.throws(
      () => parseSlideMarkdown(md.replace(`## [${ids[1]}]`, `## [${ids[0]}]`)),
      /duplicate slide id/,
    );
  });
});

describe('hostile content stays inert', () => {
  it('preserves markup-looking content as literal text', () => {
    const { ir } = f4IR('en');
    ir.slides[1].blocks.push({ role: 'body', content: '<script>alert(1)</script>' });
    ir.slides[1].blocks.push({ role: 'body', content: '[x](javascript:alert(1))' });
    ir.slides[1].blocks.push({ role: 'body', content: '## [fake] thesis' });
    ir.slides[1].blocks.push({ role: 'body', content: '> lang: evil' });
    const back = parseSlideMarkdown(serializeSlideMarkdown(ir));
    const bodies = back.slides[1].blocks.filter((b) => b.role === 'body').map((b) => b.content);
    assert.ok(bodies.includes('<script>alert(1)</script>'));
    assert.ok(bodies.includes('[x](javascript:alert(1))'));
    assert.ok(bodies.includes('## [fake] thesis'));
    assert.ok(bodies.includes('> lang: evil'));
    assert.equal(back.slides.length, ir.slides.length); // no injected slides
  });
});

describe('human editability', () => {
  it('parses a hand-written minimal deck', () => {
    const md = [
      '#!slide-markdown 1',
      '# Handmade Deck',
      '> lang: en',
      '> preset: P01',
      '',
      '## [n1-cover] opening',
      'thesis: We fix pantry waste',
      'kicker: HACKATHON',
      'title: Pantrylog keeps every shelf visible',
      'refs: ',
      'statuses: ',
      'notes: Smile at the judges.',
      '',
      '## [n2-closing] conclusion',
      'thesis: Join the pilot',
      'kicker: CLOSING',
      'title: One ritual, zero silent waste',
      'refs: idea.txt:3',
      'statuses: unverified',
      '',
    ].join('\n');
    const ir = parseSlideMarkdown(md);
    assert.equal(ir.slides.length, 2);
    assert.equal(ir.slides[0].notes, 'Smile at the judges.');
    assert.deepEqual(ir.slides[0].refs, []);
    assert.deepEqual(ir.slides[1].refs, ['idea.txt:3']);
    // Both slides render through the standard pipeline.
    slideIRToNarrative(ir);
  });
});
