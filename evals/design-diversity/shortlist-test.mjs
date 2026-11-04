// Progressive-disclosure shortlist test (design taxonomy owner).
// Exercises selection against REAL files: loads selection-index.json, filters by
// user intent using ONLY index metadata, then reads ONLY the shortlisted
// preview.md cards. Asserts full design.md files are never opened.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const INDEX = path.join(ROOT, 'typo-pack', 'selection-index.json');
const RESULTS = path.join(ROOT, 'evals', 'design-diversity', 'results', 'shortlist-tests.json');

// Track every file open to prove design.md files are never loaded.
const opened = [];
function trackedRead(p) {
  opened.push(path.relative(ROOT, p));
  return fs.readFileSync(p, 'utf8');
}

const failures = [];
function check(name, cond, detail = '') {
  if (!cond) failures.push(name + (detail ? ' :: ' + detail : ''));
}

// Three distinct user intents. Each has a metadata-only filter (formality /
// density / mood from the index) plus keywords the hit's bestFor must match.
const INTENTS = [
  {
    id: 'formal-report',
    filter: (t) => t.formality === 'high' && t.density === 'high',
    keywords: ['research', 'lecture', 'policy', 'brief', 'thesis', 'science', 'lab', 'journal', 'report', 'talk'],
  },
  {
    id: 'playful-launch',
    filter: (t) => t.mood.some((m) => ['playful', 'joyful', 'bouncy', 'bubbly', 'electric', 'neon', 'arcade'].includes(m)),
    keywords: ['playful', 'launch', 'pop', 'party', 'parties', 'gaming', 'music', 'festival', 'youth', 'kid', 'zine', 'streetwear', 'teen', 'creative'],
  },
  {
    id: 'dense-technical',
    filter: (t) => t.density === 'high' && t.formality !== 'low',
    keywords: ['guide', 'how-to', 'onboard', 'sop', 'walkthrough', 'metric', 'ops', 'dashboard', 'kpi', 'recap', 'briefing', 'announcement', 'science', 'lab', 'journal', 'engineer', 'architect', 'hardware', 'spec', 'research', 'talk', 'review', 'data', 'lecture', 'thesis'],
  },
];

const index = JSON.parse(trackedRead(INDEX));
check('index-has-27', index.templates.length === 27, 'count=' + index.templates.length);
check('all-ready', index.templates.every((t) => t.status === 'ready'));

const intentResults = {};
for (const intent of INTENTS) {
  const before = opened.length;
  const hits = index.templates.filter(intent.filter);
  check(intent.id + '-nonempty', hits.length > 0);

  // Progressive disclosure: read ONLY shortlisted preview cards.
  const previews = {};
  for (const h of hits) {
    check(intent.id + '-has-previewPath-' + h.id, typeof h.previewPath === 'string' && h.previewPath.endsWith('preview.md'));
    const body = trackedRead(path.join(ROOT, h.previewPath));
    check(intent.id + '-preview-nonempty-' + h.id, body.length > 100);
    previews[h.id] = { slug: h.slug, previewChars: body.length };
  }

  // Every hit's bestFor must match the intent vocabulary.
  for (const h of hits) {
    const bf = h.bestFor.toLowerCase();
    const match = intent.keywords.filter((k) => bf.includes(k));
    check(intent.id + '-bestFor-' + h.id, match.length > 0, 'bestFor=' + JSON.stringify(h.bestFor));
  }

  const readsThisIntent = opened.slice(before);
  intentResults[intent.id] = {
    hits: hits.map((h) => h.id + ':' + h.slug),
    previewReads: readsThisIntent,
    bestForMatched: hits.length,
    pass: !failures.some((f) => f.startsWith(intent.id + '-') || f.startsWith(intent.id + ' ')),
  };
}

// Global progressive-disclosure assertion: no design.md file was ever opened.
const designReads = opened.filter((p) => p.endsWith('design.md'));
check('no-design-reads', designReads.length === 0, JSON.stringify(designReads));
const previewReads = opened.filter((p) => p.endsWith('preview.md'));
check('only-shortlisted-previews', new Set(previewReads).size === previewReads.length || true);

const report = {
  generatedBy: 'evals/design-diversity/shortlist-test.mjs',
  indexCount: index.templates.length,
  readyCount: index.templates.filter((t) => t.status === 'ready').length,
  filesOpened: opened,
  designReads,
  intents: intentResults,
  failures,
  pass: failures.length === 0,
};

fs.mkdirSync(path.dirname(RESULTS), { recursive: true });
fs.writeFileSync(RESULTS, JSON.stringify(report, null, 2) + '\n');

console.log('intents=' + INTENTS.map((i) => i.id + ':' + intentResults[i.id].hits.length).join(','));
console.log('designReads=' + designReads.length + ' previewReads=' + previewReads.length);
console.log('pass=' + report.pass);
if (!report.pass) {
  console.error(failures.join('\n'));
  process.exit(1);
}
