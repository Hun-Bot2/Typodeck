// Colocated tests for GET /api/templates (template-pack selection cards).
//
// Run: compile this folder with tsc, then `node --test` the emitted file
// (same convention as ../export/route.test.ts). Not a Next route: only
// route.ts is served.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from './route.js';

describe('GET /api/templates', () => {
  it('lists every pack entry as a selection card', async () => {
    const res = await GET();
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      templates: Array<{
        slug: string;
        name: string;
        scheme: string;
        density: string;
        mood: string[];
        bestFor: string;
      }>;
    };
    assert.ok(Array.isArray(data.templates));
    assert.equal(data.templates.length, 27);
    const slugs = data.templates.map((t) => t.slug);
    assert.ok(slugs.includes('fika'));
    assert.ok(slugs.includes('gridline-swiss'));
    assert.ok(slugs.includes('monolith'));
    for (const t of data.templates) {
      assert.match(t.slug, /^[a-z0-9-]+$/);
      assert.ok(t.name.length > 0);
      assert.ok(t.scheme === 'light' || t.scheme === 'dark');
      assert.ok(['low', 'medium', 'high'].includes(t.density));
      assert.ok(Array.isArray(t.mood));
    }
  });
});
