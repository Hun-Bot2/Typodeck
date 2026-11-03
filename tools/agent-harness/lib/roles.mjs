// Semantic role planner: slide intent (+ explicit role) -> composition role.
// Roles are the gridline-swiss composition vocabulary from design.md:
// cover | divider | statement | evidence | comparison | dense | closing
// Deterministic: explicit role wins when valid, else keyword scoring on
// intent + content shape. Never throws on unknown intents (falls back).

export const ROLES = ['cover', 'divider', 'statement', 'evidence', 'comparison', 'dense', 'closing'];

const KEYWORDS = {
  cover: ['cover', 'title slide', 'open the deck', 'opening', 'title + lede', 'introduce'],
  divider: ['divider', 'section', 'chapter', 'part ', 'orient', 'transition', 'new section'],
  statement: ['statement', 'thesis', 'single sentence', 'one line', 'manifesto', 'claim', 'big sentence'],
  evidence: ['evidence', 'stat', 'metric', 'number', 'data point', 'proof', 'result', 'finding', 'support'],
  comparison: ['compar', 'versus', ' vs ', 'a/b', 'before/after', 'before-after', 'contrast', 'either', 'side'],
  dense: ['dense', 'table', 'rows', 'matrix', 'detail', 'breakdown', 'list of', 'many', 'inventory'],
  closing: ['clos', 'end', 'takeaway', 'recap', 'next step', 'thank', 'cta', 'call to action', 'final'],
};

function scoreIntent(intentLower, role) {
  let s = 0;
  for (const kw of KEYWORDS[role]) {
    if (intentLower.includes(kw)) s += kw.length; // longer keyword = more specific
  }
  return s;
}

/** Content-shape bonus: structured fields vote for their natural role. */
function shapeScore(slide, role) {
  switch (role) {
    case 'evidence':
      return (slide.stats?.length ? 30 : 0) + (slide.findings?.length ? 20 : 0)
        + (slide.message ? 10 : 0);
    case 'comparison':
      return slide.zones ? 60 : 0;
    case 'dense':
      return (slide.table ? 60 : 0) + ((slide.findings?.length ?? 0) >= 3 ? 15 : 0);
    case 'statement':
      return (slide.statement && !slide.table && !slide.zones ? 25 : 0);
    case 'cover':
      return (slide.title && slide.lede ? 10 : 0);
    case 'divider':
      return (slide.title && slide.orienting ? 10 : 0);
    case 'closing':
      return (slide.recap ? 10 : 0);
    default:
      return 0;
  }
}

/**
 * Plan one slide's role. Returns { role, reason }.
 * Position hints: first slide defaults to cover, last to closing on ties.
 */
export function planRole(slide, index, total) {
  if (slide.role !== undefined) {
    if (!ROLES.includes(slide.role)) {
      return { role: 'evidence', reason: `unknown explicit role "${slide.role}", fell back to evidence` };
    }
    return { role: slide.role, reason: 'explicit role in content JSON' };
  }
  const intent = String(slide.intent ?? '').toLowerCase();
  let best = null;
  for (const role of ROLES) {
    let s = scoreIntent(intent, role) + shapeScore(slide, role);
    if (index === 0 && role === 'cover') s += 5;
    if (index === total - 1 && role === 'closing') s += 5;
    if (best === null || s > best.score) best = { role, score: s };
  }
  if (best.score <= 0) {
    if (index === 0) return { role: 'cover', reason: 'no signal; first slide defaults to cover' };
    if (index === total - 1) return { role: 'closing', reason: 'no signal; last slide defaults to closing' };
    return { role: 'evidence', reason: 'no signal; middle slide defaults to evidence' };
  }
  return { role: best.role, reason: `intent+shape match (score ${best.score})` };
}

/** Plan roles for a whole deck. Returns [{ role, reason }]. */
export function planDeckRoles(slides) {
  return slides.map((s, i) => planRole(s, i, slides.length));
}
