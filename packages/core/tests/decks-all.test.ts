import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { exportToPptxBuffer } from '../src/export';
import { planDecksAll, type PipelineStage } from '../src/narrative';
import { SYSTEM_IDS } from '../src/systems';
import { validatePptxBytes } from '../src/validate';
import {
  loadFixtureText,
  loadIdeaF4,
  loadRecordedRepoFrom,
  recordedRepoFetch,
} from './fake-fetch';

const idea = loadIdeaF4();

describe('planDecksAll (Phase 3: one narrative, all systems)', () => {
  it('lays out all systems from the same narrative', async () => {
    const stages: PipelineStage[] = [];
    const res = await planDecksAll(
      { type: 'idea', text: idea },
      { purpose: 'hackathon', lang: 'en' },
      (stage) => stages.push(stage),
    );
    assert.deepEqual(Object.keys(res.decks).sort(), [...SYSTEM_IDS].sort());
    const counts = new Set(Object.values(res.decks).map((d) => d.slides.length));
    assert.equal(counts.size, 1, 'all systems share the same slide count');
    const n = res.narrative.slides.length;
    assert.ok(n >= 5 && n <= 12);
    for (const system of SYSTEM_IDS) {
      const deck = res.decks[system];
      assert.equal(deck.slides.length, n);
      assert.deepEqual(
        deck.slides.map((s) => s.id),
        res.narrative.slides.map((s) => s.id),
      );
      assert.equal(deck.meta.generatedBy, 'fallback');
    }
    assert.equal(res.provenance.provider, 'fallback');
    assert.equal(res.provenance.claims.ungrounded, res.provenance.claims.total);
    assert.ok(res.provenance.warnings.length > 0);
    assert.deepEqual(stages.slice(0, 3), ['ingest', 'evidence', 'narrative']);
    assert.deepEqual(stages.slice(3), SYSTEM_IDS.map(() => 'layout'));
  });

  it('exports an in-memory deck to bytes that validate clean', async () => {
    const res = await planDecksAll({ type: 'idea', text: idea }, { lang: 'en' });
    const deck = res.decks.swiss;
    const { buffer, slideCount, textBoxCount } = await exportToPptxBuffer(deck);
    assert.ok(buffer.length > 10000, `pptx bytes unexpectedly small: ${buffer.length}`);
    assert.equal(slideCount, deck.slides.length);
    assert.equal(textBoxCount, deck.slides.reduce((a, s) => a + s.blocks.length, 0));
    const check = await validatePptxBytes(buffer, 100);
    assert.equal(check.ok, true, check.errors.join('; '));
    assert.equal(check.stats.slides, deck.slides.length);
  });

  it('covers the recsys repo and KO idea end to end in all systems', async () => {
    const recsys = loadRecordedRepoFrom('recorded-recsys.json');
    const res = await planDecksAll(
      { type: 'repo', owner: 'northwind', repo: 'recdeck' },
      { purpose: 'competition', lang: 'en', fetchImpl: recordedRepoFetch(recsys) },
    );
    assert.equal(res.provenance.quality.pass, true);
    for (const system of SYSTEM_IDS) {
      const { buffer } = await exportToPptxBuffer(res.decks[system]);
      const check = await validatePptxBytes(buffer, 100);
      assert.equal(check.ok, true, `${system}: ${check.errors.join('; ')}`);
    }
    const ko = await planDecksAll(
      { type: 'idea', text: loadFixtureText('idea-ko.txt') },
      { purpose: '쇼케이스', lang: 'ko' },
    );
    assert.equal(ko.narrative.lang, 'ko');
    for (const system of SYSTEM_IDS) {
      const { buffer } = await exportToPptxBuffer(ko.decks[system]);
      const check = await validatePptxBytes(buffer, 100);
      assert.equal(check.ok, true, `${system}: ${check.errors.join('; ')}`);
    }
  });
});
