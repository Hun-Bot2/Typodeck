// Human-study QA verification (wave 2). Read-only against implementation;
// writes only: own test-* reviewer data under annotations/test + results.
// Usage: node evals/hierarchy/study/tests/qa-check.mjs [--base http://localhost:3100]
//
// Exit 0 = every check passed. Exit 1 = at least one check failed.
// Prints one CHECK:<name>:<pass|fail> line per check plus a JSON summary.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const STUDY_DIR = join(HERE, '..');
const REPO_ROOT = join(HERE, '..', '..', '..', '..');

const args = process.argv.slice(2);
const baseIdx = args.indexOf('--base');
const BASE = (baseIdx >= 0 && args[baseIdx + 1]) || process.env.QA_BASE || 'http://localhost:3100';
const STAMP = new Date().toISOString().replace(/[-:.]/g, '').replace('T', '-').slice(0, 15);
const REVIEWER = `test-qa-${STAMP}`;
const PARTIAL = `${REVIEWER}-partial`;
const GHOST = `${REVIEWER}-ghost`;

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass: !!pass, detail: String(detail).slice(0, 300) });
  console.log(`CHECK:${name}:${pass ? 'pass' : 'fail'} ${String(detail).slice(0, 200)}`);
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}
async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, text };
}
function parse(text) {
  try { return JSON.parse(text); } catch { return null; }
}

// --- (a) leak scan -------------------------------------------------------
const SECRET_VALUES = [
  'known-defect', 'known-good', 'headline-prominence', 'number-scale',
  'demote-primary', 'grouping-swap', 'dangle-group', 'primary-on-caption',
  'clip-support', 'contrast-fail', 'verified c/',
];
const SECRET_KEY_RES = [/"origin"\s*:/, /"defectSeed"\s*:/, /"expected"\s*:/];
function deepKeys(value, found = new Set()) {
  if (Array.isArray(value)) value.forEach((v) => deepKeys(v, found));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'origin' || k === 'defectSeed' || k === 'expected') found.add(k);
      deepKeys(v, found);
    }
  }
  return found;
}
function scanBody(label, text) {
  const hits = [];
  for (const re of SECRET_KEY_RES) if (re.test(text)) hits.push(re.source);
  for (const tok of SECRET_VALUES) if (text.includes(tok)) hits.push(tok);
  const doc = parse(text);
  if (doc) for (const k of deepKeys(doc)) hits.push(`key:${k}`);
  check(`leak:${label}`, hits.length === 0, hits.length === 0 ? 'no secret keys/values' : `HIT ${hits.join(',')}`);
  return hits.length === 0;
}

// --- main ----------------------------------------------------------------
console.log(`# qa-check base=${BASE} reviewer=${REVIEWER}`);

// (d-i) /study page 200
const studyPage = await get('/study');
check('page:study-200', studyPage.status === 200, `GET /study -> ${studyPage.status}, ${studyPage.text.length} bytes`);

// (a) pre-finalize responses
const manifestRes = await get(`/api/study/manifest?reviewer=${encodeURIComponent(REVIEWER)}`);
check('api:manifest-200', manifestRes.status === 200, `GET manifest -> ${manifestRes.status}`);
const manifest = parse(manifestRes.text);
const orderOk = !!manifest && manifest.datasetVersion === 'study-v1' && manifest.seed === 20261103
  && Array.isArray(manifest.order) && manifest.order.length === 25 && manifest.total === 25
  && Array.isArray(manifest.cases) && manifest.cases.length === 25;
check('data:manifest-shape', orderOk, orderOk ? `25 cases, seed ${manifest.seed}` : 'manifest shape mismatch');
check('data:excluded-hidden', !!manifest && !manifest.order.includes('S23') && !manifest.order.includes('S24'),
  'S23/S24 absent from human order');
{
  const r = await post('/api/study/annotate', { reviewerId: REVIEWER, caseId: 'S23', patch: { confidence: 3 } });
  check('api:annotate-excluded-410', r.status === 410, `annotate S23 -> ${r.status} (excluded)`);
}
let projOk = !!manifest;
if (manifest) {
  for (const c of manifest.cases) {
    const keys = Object.keys(c).sort().join(',');
    if (keys !== 'caseId,elements,slide,system') { projOk = false; break; }
  }
}
check('data:projection-keys', projOk, projOk ? 'every case exactly {caseId,slide,system,elements}' : 'extra/missing case keys');
scanBody('manifest', manifestRes.text);

const progressFresh = await get(`/api/study/progress?reviewer=${encodeURIComponent(REVIEWER)}`);
{
  const p = parse(progressFresh.text);
  check('api:progress-fresh', progressFresh.status === 200 && p && p.done === 0 && Object.keys(p.annotations || {}).length === 0,
    `fresh progress -> ${progressFresh.status} done=${p && p.done}`);
}
scanBody('progress', progressFresh.text);

const exportPre = await get(`/api/study/export?reviewerId=${encodeURIComponent(REVIEWER)}&format=json`);
check('api:export-prefinalize-404', exportPre.status === 404, `pre-finalize export -> ${exportPre.status}`);
scanBody('export-attempt', exportPre.text);

// (b-i) results gating before finalize
const resultsPre = await get(`/api/study/results?reviewerId=${encodeURIComponent(REVIEWER)}`);
check('api:results-prefinalize-404', resultsPre.status === 404, `pre-finalize results -> ${resultsPre.status}`);

// one annotate early so its response is also leak-scanned
const first = manifest.cases[0];
const idsOf = (c) => c.elements.map((e) => e.id);
function fullPatch(c, i) {
  const ids = idsOf(c);
  return {
    firstFocus: ids[0],
    ranking: ids.map((id) => [id]),
    groups: ids.length > 1 ? [[ids[0], ids[1]]] : [[ids[0]]],
    problems: i % 3 === 0
      ? [{ type: 'spacing', blockIds: [ids[0]], comment: 'qa note' }]
      : [{ type: 'none', blockIds: [], comment: '' }],
    confidence: (i % 5) + 1,
    interpretation: { mainMessage: ids[0], comment: 'qa interp' },
    status: 'done',
  };
}
const annFirst = await post('/api/study/annotate', { reviewerId: REVIEWER, caseId: first.caseId, patch: fullPatch(first, 0) });
{
  const b = parse(annFirst.text);
  check('api:annotate-first', annFirst.status === 200 && b && b.ok === true, `annotate ${first.caseId} -> ${annFirst.status}`);
}
scanBody('annotate', annFirst.text);
scanBody('study-html', studyPage.text);

// (b-ii) annotate remaining cases, with mid-way resume check
let annFail = 0;
const HALF = Math.floor(manifest.cases.length / 2);
for (let i = 1; i < manifest.cases.length; i++) {
  const c = manifest.cases[i];
  const r = await post('/api/study/annotate', { reviewerId: REVIEWER, caseId: c.caseId, patch: fullPatch(c, i) });
  if (r.status !== 200) { annFail++; console.log(`  annotate ${c.caseId} -> ${r.status} ${r.text.slice(0, 120)}`); }
  if (i === HALF) {
    const mid = await get(`/api/study/progress?reviewer=${encodeURIComponent(REVIEWER)}`);
    const p = parse(mid.text);
    const expectDone = HALF + 1; // cases[0..HALF] annotated
    check('api:progress-resume', mid.status === 200 && p && p.done === expectDone,
      `mid-way progress done=${p && p.done} expect=${expectDone}`);
  }
}
check('api:annotate-all25', annFail === 0, annFail === 0 ? 'all 25 annotate -> 200' : `${annFail} annotate failures`);
{
  const full = await get(`/api/study/progress?reviewer=${encodeURIComponent(REVIEWER)}`);
  const p = parse(full.text);
  check('api:progress-full', full.status === 200 && p && p.done === 25, `full progress done=${p && p.done}`);
}

// (b-iii) finalize twice: new timestamp, never overwrite
const fin1 = await post('/api/study/finalize', { reviewerId: REVIEWER });
const fin1Body = parse(fin1.text);
check('api:finalize-1', fin1.status === 200 && fin1Body && typeof fin1Body.snapshot === 'string',
  `finalize#1 -> ${fin1.status} snapshot=${fin1Body && fin1Body.snapshot}`);
await new Promise((r) => setTimeout(r, 1100)); // cross a UTC-second boundary for distinct stamps
const fin2 = await post('/api/study/finalize', { reviewerId: REVIEWER });
const fin2Body = parse(fin2.text);
const twoNames = fin1Body && fin2Body && fin1Body.snapshot !== fin2Body.snapshot;
check('api:finalize-2-new', fin2.status === 200 && twoNames,
  `finalize#2 -> ${fin2.status} snapshot=${fin2Body && fin2Body.snapshot} distinct=${!!twoNames}`);
{
  const dir = join(STUDY_DIR, 'annotations', 'test');
  const names = existsSync(dir) ? readdirSync(dir).filter((n) => n.startsWith(`${REVIEWER}.final.`)) : [];
  const bothKept = fin1Body && fin2Body && names.includes(fin1Body.snapshot) && names.includes(fin2Body.snapshot);
  check('data:snapshot-kept', !!bothKept, bothKept ? `both snapshots on disk (${names.length} matching)` : `files: ${names.join(',')}`);
}

// (b-iv) export JSON + CSV
const expJson = await get(`/api/study/export?reviewerId=${encodeURIComponent(REVIEWER)}&format=json`);
{
  const d = parse(expJson.text);
  const ok = expJson.status === 200 && d && d.reviewerId === REVIEWER && d.annotations && Object.keys(d.annotations).length === 25;
  check('api:export-json', !!ok, `export json -> ${expJson.status} cases=${d && d.annotations && Object.keys(d.annotations).length}`);
}
const expCsv = await get(`/api/study/export?reviewerId=${encodeURIComponent(REVIEWER)}&format=csv`);
function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}
{
  const rows = parseCsv(expCsv.text);
  const want = ['reviewerId', 'caseId', 'firstFocus', 'ranking', 'groups', 'problems', 'confidence', 'mainMessage', 'interpretationComment', 'status', 'updatedAt'];
  const headerOk = rows.length > 0 && rows[0].join('|') === want.join('|');
  const dataRows = rows.slice(1);
  const colsOk = dataRows.every((r) => r.length === want.length);
  check('api:export-csv', expCsv.status === 200 && headerOk && dataRows.length === 25 && colsOk,
    `export csv -> ${expCsv.status} header=${headerOk} rows=${dataRows.length} cols=${colsOk}`);
}

// (b-v) run-eval via route, B/D NOT RUN, results 200 with expected data
const runEval = await post('/api/study/run-eval', { reviewerId: REVIEWER });
{
  const b = parse(runEval.text);
  const arms = b && b.summary && b.summary.arms;
  const ok = runEval.status === 200 && arms && arms.A === 'RUN' && arms.B === 'NOT RUN' && arms.C === 'RUN' && arms.D === 'NOT RUN';
  check('api:run-eval', !!ok, `run-eval -> ${runEval.status} arms=${arms ? JSON.stringify(arms) : (b ? JSON.stringify(b) : runEval.text).slice(0, 160)}`);
}
{
  const r = await get(`/api/study/results?reviewerId=${encodeURIComponent(REVIEWER)}`);
  const d = parse(r.text);
  const rows = d && (d.rows || d.cases || d.perCase);
  const body = d ? JSON.stringify(d) : '';
  const hasBD = body.includes('NOT RUN');
  // Contract: only this endpoint may include expected/secret-derived data.
  // The runner surfaces it under repair.defect (category/mutation), not a
  // literal "expected" key, so assert on known secret-derived content.
  const hasExpected = body.includes('headline-prominence') && body.includes('demote-primary');
  check('api:results-post', r.status === 200 && !!d && hasBD && hasExpected,
    `results -> ${r.status} rows=${Array.isArray(rows) ? rows.length : '?'} B/D-NOT-RUN=${hasBD} hasExpected=${hasExpected}`);
}

// (c) validation errors
{
  const bad = await post('/api/study/annotate', { reviewerId: REVIEWER, caseId: first.caseId, patch: { firstFocus: 'no-such-block' } });
  check('api:bad-block-4xx', bad.status >= 400 && bad.status < 500, `bad block id -> ${bad.status} (expect client-error)`);
}
{
  const solo = manifest.cases[0];
  await post('/api/study/annotate', { reviewerId: PARTIAL, caseId: solo.caseId, patch: fullPatch(solo, 0) });
  const fin = await post('/api/study/finalize', { reviewerId: PARTIAL });
  check('api:finalize-partial-4xx', fin.status >= 400 && fin.status < 500, `partial finalize -> ${fin.status} (expect 4xx)`);
}
{
  const g = await get(`/api/study/export?reviewerId=${encodeURIComponent(GHOST)}&format=json`);
  check('api:export-ghost-404', g.status === 404, `unknown reviewer export -> ${g.status}`);
}

// (d) frozen Korean strings in served HTML/JS
async function studyJsBundle() {
  const srcs = [...studyPage.text.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]).filter((s) => s.startsWith('/'));
  let bundle = '';
  for (const s of [...new Set(srcs)]) {
    try { const r = await get(s); if (r.status === 200) bundle += `\n${r.text}`; } catch { /* ignore */ }
  }
  return { bundle, chunks: srcs.length };
}
{
  const { bundle, chunks } = await studyJsBundle();
  const hay = `${studyPage.text}\n${bundle}`;
  const frozen = [
    ['start', '평가 시작'],
    ['q-first', '이 슬라이드를 처음 봤을 때 가장 먼저 눈에 들어온 요소는 무엇인가요?'],
    ['q-rank', '어떤 요소가 가장 강조되어 보이나요? 중요해 보이는 순서대로 정렬해 주세요.'],
    ['q-group', '서로 연결된 하나의 정보처럼 보이는 요소들을 선택해 주세요.'],
    ['q-problems', '시각적으로 어색하거나 이해하기 어려운 부분이 있나요?'],
    ['q-confidence', '이 판단에 얼마나 확신하나요?'],
    ['review', '응답 검토'],
    ['save', '결과 저장'],
    ['export', '결과 내보내기'],
  ];
  let missing = [];
  for (const [name, s] of frozen) if (!hay.includes(s)) missing.push(name);
  const progressOk = hay.includes('평가 ') && hay.includes(' / ');
  if (!progressOk) missing.push('progress');
  check('page:frozen-strings', missing.length === 0,
    missing.length === 0 ? `all 10 strings + progress pattern in HTML+${chunks} JS chunks` : `missing: ${missing.join(',')}`);
  // leak scan over the client bundle too (defense in depth; contract scope is HTML)
  const bundleHits = [];
  for (const re of SECRET_KEY_RES) if (re.test(hay)) bundleHits.push(re.source);
  for (const tok of SECRET_VALUES) if (hay.includes(tok)) bundleHits.push(tok);
  check('leak:study-bundle', bundleHits.length === 0, bundleHits.length === 0 ? 'no secret keys/values in HTML+JS' : `HIT ${bundleHits.join(',')}`);
}

// (e) core suite still green
{
  const t0 = Date.now();
  const proc = spawnSync('npm', ['test'], { cwd: REPO_ROOT, timeout: 600000, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const out = `${proc.stdout || ''}\n${proc.stderr || ''}`;
  const passes = [...out.matchAll(/(?:# pass|ℹ pass) (\d+)/g)].map((m) => +m[1]);
  const fails = [...out.matchAll(/(?:# fail|ℹ fail) (\d+)/g)].map((m) => +m[1]);
  const pass = passes.length ? passes[passes.length - 1] : -1;
  const fail = fails.length ? fails[fails.length - 1] : -1;
  const ok = proc.status === 0 && fail === 0 && pass > 0;
  check('core:npm-test', ok, `npm test exit=${proc.status} pass=${pass} fail=${fail} (${Math.round((Date.now() - t0) / 1000)}s)`);
}

const failed = results.filter((r) => !r.pass);
console.log(`# summary ${results.length - failed.length}/${results.length} passed reviewer=${REVIEWER}`);
process.exit(failed.length === 0 ? 0 : 1);
