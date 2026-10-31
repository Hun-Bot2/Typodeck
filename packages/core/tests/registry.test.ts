// Visual System Registry: versioning, resolution, deprecation, honesty.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { layoutDeck } from '../src/layout';
import { planNarrative } from '../src/narrative';
import { acceptIdea } from '../src/ingestion';
import { extractClaims } from '../src/evidence';
import {
  ENGINE_CAPABILITIES,
  REGISTRY_VERSION,
  VISUAL_SYSTEMS,
  listVisualSystems,
  resolveDeckSystem,
  resolveVisualSystem,
  type VisualSystemEntry,
} from '../src/visual-systems';
import { loadFixtureText } from './fake-fetch';

describe('registry contents', () => {
  it('holds the 3 production systems plus experimental candidates, all honest', () => {
    assert.equal(REGISTRY_VERSION, '1.0.0');
    const ids = Object.keys(VISUAL_SYSTEMS).sort();
    assert.deepEqual(ids, ['document', 'editorial', 'expressive', 'swiss']);
    for (const id of ids) {
      const e = VISUAL_SYSTEMS[id];
      assert.ok(/^\d+\.\d+\.\d+$/.test(e.version), `${id} version`);
      assert.ok(e.philosophy.length > 20, `${id} philosophy`);
      assert.ok(e.grammarRef.startsWith('composition-grammar@'), `${id} grammar`);
      assert.ok(e.supports.includes('native-text'), `${id} supports`);
      assert.ok(e.limitations.length >= 1, `${id} limitations recorded`);
    }
    for (const id of ['editorial', 'expressive', 'swiss']) {
      assert.equal(VISUAL_SYSTEMS[id].status, 'production', `${id} status`);
    }
    assert.equal(VISUAL_SYSTEMS.document.status, 'experimental');
    assert.equal(VISUAL_SYSTEMS.document.version, '0.1.0');
    const phils = new Set(ids.map((id) => VISUAL_SYSTEMS[id].philosophy));
    assert.equal(phils.size, ids.length);
  });
  it('lists production+experimental by default, deprecated on request', () => {
    const registry: Record<string, VisualSystemEntry> = {
      ...VISUAL_SYSTEMS,
      oldie: {
        id: 'oldie', version: '0.9.0', status: 'deprecated', philosophy: 'Retired test system.',
        grammarRef: 'composition-grammar@0.1.0', researchRefs: [], supports: ['native-text'],
        limitations: ['Superseded.'], supersededBy: 'swiss',
      },
    };
    assert.deepEqual(listVisualSystems(registry).map((e) => e.id), ['document', 'editorial', 'expressive', 'swiss']);
    assert.ok(listVisualSystems(registry, ['deprecated']).some((e) => e.id === 'oldie'));
  });
});

describe('resolution', () => {
  it('resolves shipped systems with typography; rejects unknown ids', () => {
    const r = resolveVisualSystem('swiss');
    assert.equal(r.entry.id, 'swiss');
    assert.equal(r.typography.id, 'swiss');
    assert.throws(() => resolveVisualSystem('nope'), /unknown visual system/);
  });
  it('fails loudly for registered entries without shipped typography', () => {
    const registry: Record<string, VisualSystemEntry> = {
      ...VISUAL_SYSTEMS,
      vapor: {
        id: 'vapor', version: '0.1.0', status: 'experimental', philosophy: 'Unshipped test entry.',
        grammarRef: 'composition-grammar@0.1.0', researchRefs: [], supports: [], limitations: ['No tokens.'],
      },
    };
    assert.throws(() => resolveVisualSystem('vapor', registry), /no shipped typography/);
  });
  it('pins stored deck versions and defaults unpinned decks to latest', () => {
    const ok = resolveDeckSystem({ system: 'swiss', systemVersion: '1.0.0' });
    assert.equal(ok.entry.version, '1.0.0');
    const legacy = resolveDeckSystem({ system: 'swiss' });
    assert.equal(legacy.entry.id, 'swiss');
    assert.throws(
      () => resolveDeckSystem({ system: 'swiss', systemVersion: '9.9.9' }),
      /pins swiss@9\.9\.9/,
    );
  });
});

describe('engine capabilities (honesty inventory)', () => {
  it('covers what layout/export do and excludes what they cannot', () => {
    for (const c of ['native-text', 'multi-column', 'optical-hang', 'measure-cap']) {
      assert.ok(ENGINE_CAPABILITIES.includes(c), `missing ${c}`);
    }
    for (const c of ['rotation', 'vertical-text', 'character-level-layout', 'variable-font-axis']) {
      assert.ok(!ENGINE_CAPABILITIES.includes(c), `falsely claims ${c}`);
    }
  });
});

describe('deck meta versioning', () => {
  it('layoutDeck stamps the registry version without changing geometry', () => {
    const claims = extractClaims(acceptIdea(loadFixtureText('idea-f4.txt')));
    const narrative = planNarrative(claims, { purpose: 'showcase', lang: 'en' });
    const deck = layoutDeck(narrative, 'swiss', { seed: 7 });
    assert.equal(deck.meta.systemVersion, VISUAL_SYSTEMS.swiss.version);
    // Geometry/content contract intact: same blocks, same text.
    assert.ok(deck.slides.length >= 5);
    assert.ok(deck.slides.every((s) => s.blocks.length > 0));
  });
});
