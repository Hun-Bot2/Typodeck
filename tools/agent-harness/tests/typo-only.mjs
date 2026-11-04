// Shared typography-only assertions for harness builder tests.
// A typography-only slide carries hierarchy via position, alignment,
// proximity, scale, weight, color, and whitespace: no visible rectangles,
// cards, panels, rails, rules, table grids, borders-as-containers, or
// colored boxes behind text. The only background is the full-slide ground.
import assert from 'node:assert/strict';

function styleOf(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  assert.ok(m, 'expected one <style> block');
  return m[1];
}

function bodyOf(html) {
  return html.slice(html.indexOf('</style>'));
}

/** Assert emitted slide HTML contains no box/rule/table chrome. */
export function assertTypoOnly(html, what) {
  const css = styleOf(html);
  const body = bodyOf(html);
  // No table elements (dense role uses a typographic ledger instead).
  for (const tag of ['<table', '<thead', '<tbody', '<th', '<td', '</table>']) {
    assert.ok(!body.includes(tag), `${what}: must not contain ${tag}`);
  }
  // No rule/rail/grid/panel markup (class-scoped so copy can't trip it).
  const classes = [...body.matchAll(/class="([^"]*)"/g)].join(' ');
  for (const cls of ['redrule', 'accentrule', 'railrule', 'colgrid', 'rail', 'panel', 'card']) {
    assert.ok(!new RegExp(`(^| )${cls}( |$)`).test(classes), `${what}: must not contain "${cls}" markup`);
  }
  // No generated boxes via pseudo-elements.
  assert.ok(!css.includes('::before') && !css.includes('::after'), `${what}: no ::before/::after boxes`);
  // No borders of any kind (there is no border-radius reset left to allow).
  assert.ok(!/border/i.test(css), `${what}: CSS must not contain any border property`);
  // No shadows, outlines, or gradients.
  for (const prop of ['box-shadow', 'text-shadow', 'outline', 'gradient']) {
    assert.ok(!css.includes(prop), `${what}: CSS must not contain ${prop}`);
  }
  // Backgrounds only on the full-slide ground (html/body/.slide).
  const bgCount = (css.match(/background\s*:/g) ?? []).length;
  assert.ok(bgCount <= 2, `${what}: at most html,body + .slide backgrounds, found ${bgCount}`);
  // Slide keeps the 1920x1080 stage and footer.
  assert.ok(html.includes('1920px') && html.includes('1080px'), `${what}: stage`);
  assert.ok(html.includes('data-t="footer"'), `${what}: footer marker`);
  assert.ok(html.includes('data-t="numeral"'), `${what}: numeral marker`);
  assert.ok(html.includes('data-headline'), `${what}: headline marker`);
}
