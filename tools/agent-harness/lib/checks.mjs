// Deterministic slide checks: dims / overflow / clip / verbatim /
// fixture-marking / spec-chrome. Pure functions over (metrics, png, slide)
// so they are unit-testable without a browser.

export const TOL_PX = 2; // subpixel rounding tolerance
const STAGE = { w: 1920, h: 1080 };

function norm(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

/** dims: PNG buffer must decode to exactly 1920x1080. */
export function checkDims(png, pngDims) {
  let d;
  try {
    d = pngDims(png);
  } catch (e) {
    return fail(`unreadable PNG: ${e.message}`);
  }
  if (d.width !== STAGE.w || d.height !== STAGE.h) {
    return fail(`png is ${d.width}x${d.height}, want 1920x1080`);
  }
  return pass('png is 1920x1080');
}

/**
 * overflow: horizontal scroll is always a defect; vertical scroll is a defect
 * only when it escapes the content zone (past footerTop) or is really
 * clipped (overflow != visible). Display numerals with line-height < 1em
 * legitimately report sh > ch (glyph extent exceeds the tight line box);
 * their containment is enforced by checkClip instead.
 */
export function checkOverflow(metrics, geom = STAGE) {
  const footerTop = geom.footerTop ?? 970;
  const bad = [];
  for (const t of metrics.texts ?? []) {
    if (t.sw - t.cw > TOL_PX) bad.push(`${t.key}: horizontal +${t.sw - t.cw}px`);
    if ((t.sh - t.ch) <= TOL_PX) continue;
    const chrome = ['rail', 'numeral', 'meta', 'footer', 'pageidx'].includes(t.key);
    const bottom = t.y + Math.max(t.sh, t.ch);
    if (!chrome && bottom > footerTop + TOL_PX) {
      bad.push(`${t.key}: vertical +${t.sh - t.ch}px, crosses footer`);
    } else if (t.oy && t.oy !== 'visible') {
      bad.push(`${t.key}: vertical +${t.sh - t.ch}px clipped`);
    }
  }
  const d = metrics.doc ?? {};
  if ((d.sw ?? 0) - STAGE.w > TOL_PX) bad.push(`document: horizontal +${d.sw - STAGE.w}px`);
  if ((d.sh ?? 0) - STAGE.h > TOL_PX) bad.push(`document: vertical +${d.sh - STAGE.h}px`);
  if (bad.length > 0) return { ok: false, detail: `overflow: ${bad.join('; ')}`, items: bad };
  return pass('no overflow');
}

/** clip: numeral contained in rail when a rail exists (legacy chrome);
 * typography-only slides carry the numeral as free display type, so a
 * missing rail falls back to stage containment. Stage children always
 * inside 1920x1080. */
export function checkClip(metrics) {
  const bad = [];
  const { rail, numeral } = metrics;
  if (!numeral) {
    bad.push('numeral missing');
  } else if (rail) {
    if (numeral.x < rail.x - TOL_PX) bad.push(`numeral left ${Math.round(numeral.x - rail.x)}px outside rail`);
    if (numeral.x + numeral.w > rail.x + rail.w + TOL_PX) {
      bad.push(`numeral right +${Math.round(numeral.x + numeral.w - rail.x - rail.w)}px outside rail`);
    }
    if (numeral.y < rail.y - TOL_PX) bad.push('numeral above rail top');
    // Numeral may extend below the visible rail only if rail clips it: rail has
    // overflow hidden, so bottom bleed is hidden — still flag past 40px.
    if (numeral.y + numeral.h > rail.y + rail.h + 40) bad.push('numeral bleeds below rail');
  } else if (numeral.x < -TOL_PX || numeral.y < -TOL_PX ||
      numeral.x + numeral.w > STAGE.w + TOL_PX || numeral.y + numeral.h > STAGE.h + TOL_PX) {
    bad.push('numeral rect outside 1920x1080 stage');
  }
  for (const t of metrics.texts ?? []) {
    if (t.x < -TOL_PX || t.y < -TOL_PX || t.x + t.w > STAGE.w + TOL_PX || t.y + t.h > STAGE.h + TOL_PX) {
      bad.push(`${t.key}: rect outside 1920x1080 stage`);
    }
  }
  if (bad.length > 0) return { ok: false, detail: `clip: ${bad.join('; ')}`, items: bad };
  return pass('numeral + stage containment holds');
}

/**
 * verbatim: every content string appears in rendered text. Compared
 * case-insensitively: the spec mandates uppercase transforms on kickers,
 * captions, and meta, and innerText returns the rendered (uppercased) text.
 */
export function checkVerbatim(metrics, strings) {
  const hay = norm(metrics.text ?? '').toLowerCase();
  const missing = [];
  for (const s of strings) {
    const n = norm(s).toLowerCase();
    if (!n) continue;
    // Long strings: require all sentences (split on . ! ? ;) to survive.
    const parts = n.length > 120 ? n.split(/(?<=[.!?;])\s+/).filter((p) => p.trim()) : [n];
    for (const p of parts) {
      if (!hay.includes(p)) missing.push(trunc(p));
    }
  }
  if (missing.length > 0) {
    return { ok: false, detail: `verbatim: ${missing.length} string(s) missing: ${missing.slice(0, 3).join(' | ')}`, items: missing };
  }
  return pass(`verbatim: ${strings.length} strings present`);
}

/** fixture-marking: fixture slides must render a visible marker. */
export function checkFixture(metrics, slide) {
  const count = metrics.spec?.fixtures ?? 0;
  if (slide.fixture) {
    if (count < 1) return fail('fixture slide has no [data-fixture] marker');
    return pass('fixture marker present');
  }
  if (count > 0) return fail('non-fixture slide carries a fixture marker');
  return pass('no stray fixture marker');
}

/** spec-chrome (typography-only): no rules/rails/grids, one footer,
 * left headlines, no radius. Hierarchy must come from type alone. */
export function checkSpec(metrics) {
  const bad = [];
  const s = metrics.spec ?? {};
  if ((s.redrules ?? 0) !== 0) bad.push(`content red rules: ${s.redrules}, want 0 (typography only)`);
  if ((s.grids ?? 0) !== 0) bad.push('exposed column grid present (typography only)');
  if ((s.rails ?? 0) !== 0) bad.push('index rail panel present (typography only)');
  if (s.footers !== 1) bad.push('footer bar missing');
  for (const h of metrics.heads ?? []) {
    if (h.align === 'center' || h.align === 'justify') bad.push(`headline ${h.key} is ${h.align}`);
  }
  if ((metrics.rounded ?? 0) > 0) bad.push(`${metrics.rounded} rounded element(s)`);
  if (bad.length > 0) return { ok: false, detail: `spec: ${bad.join('; ')}`, items: bad };
  return pass('typography-only chrome + type rules hold');
}

/** clip-generic: stage children inside 1920x1080 (no rail requirement). */
export function checkClipStage(metrics) {
  const bad = [];
  for (const t of metrics.texts ?? []) {
    if (t.x < -TOL_PX || t.y < -TOL_PX || t.x + t.w > STAGE.w + TOL_PX || t.y + t.h > STAGE.h + TOL_PX) {
      bad.push(`${t.key}: rect outside 1920x1080 stage`);
    }
  }
  if (bad.length > 0) return { ok: false, detail: `clip: ${bad.join('; ')}`, items: bad };
  return pass('stage containment holds');
}

/** spec-generic (typography-only): footer present, no rules/rails/grids,
 * headlines left-aligned, no rounded chrome. */
export function checkSpecGeneric(metrics) {
  const bad = [];
  const s = metrics.spec ?? {};
  if ((s.redrules ?? 0) !== 0) bad.push(`content rules: ${s.redrules}, want 0 (typography only)`);
  if ((s.grids ?? 0) !== 0) bad.push('exposed column grid present (typography only)');
  if ((s.rails ?? 0) !== 0) bad.push('rail panel present (typography only)');
  if (s.footers !== 1) bad.push(`footers: ${s.footers ?? 0}, want exactly 1`);
  for (const h of metrics.heads ?? []) {
    if (h.align === 'center' || h.align === 'justify') bad.push(`headline ${h.key} is ${h.align}`);
  }
  if ((metrics.rounded ?? 0) > 0) bad.push(`${metrics.rounded} rounded element(s)`);
  if (bad.length > 0) return { ok: false, detail: `spec: ${bad.join('; ')}`, items: bad };
  return pass('generic chrome + type rules hold');
}

function pass(detail) {
  return { ok: true, detail };
}

function fail(detail) {
  return { ok: false, detail, items: [detail] };
}

function trunc(s) {
  return s.length > 80 ? `${s.slice(0, 77)}...` : s;
}
