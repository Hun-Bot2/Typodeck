// Agent C evidence generator: before/after decks for the overflow gate + G1/G3.
// Regenerate inputs with:
//   for c in gapminder-tq2-p1 gapminder-tle-p5 gen-g1-long-en gen-g1-metric gen-g3-long-en; do
//     git show 088e510:research/slide-reconstruction/cases/$c/case.json > output/agent-c/inputs/$c.case.json
//   done
// Run: node output/agent-c/generate.mjs  (requires built core + headless Chrome)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const OUT = join(ROOT, 'output/agent-c');
const core = await import(join(ROOT, 'packages/core/dist/src/index.js'));
const {
  candidateIndex, critiqueDeck, critiqueRenderedOverflow, exportToPptxBuffer,
  layoutDeck, measureSlideRender, planCompositions, renderMeasureHtml,
  validateDeck, validatePptxBytes, CANDIDATE_INDEX_VERSION, COMPOSITION_GRAMMAR,
} = core;

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const inputs = (n) => JSON.parse(readFileSync(join(OUT, 'inputs', n), 'utf8'));

function shot(htmlPath, pngPath) {
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--window-size=1280,720', `--screenshot=${pngPath}`, `file://${htmlPath}`],
    { timeout: 60000, stdio: 'pipe' });
}

// NOTE: PPTX parity below is structural only (validatePptxBytes: byte-level
// <a:t> runs + box counts + validator acceptance) — NEVER a visual-fidelity
// claim. PPTX rendering remains unverified (no Office automation).
const evidence = { generatedAt: new Date().toISOString(), grammar: COMPOSITION_GRAMMAR.version, cases: [] };

async function emitBefore(name, tierCase, probeCase, expectClips) {
  const dir = join(OUT, 'before');
  mkdirSync(dir, { recursive: true });
  // Fixed Tier-B geometry + swapped probe content (the silent-clip setup).
  const probe = Object.fromEntries(probeCase.blocks.map((b) => [b.id, b.content]));
  const blocks = tierCase.blocks.map((b) => ({ ...b, content: probe[b.id] ?? b.content }));
  const deck = validateDeck({ meta: { title: name, lang: 'en', system: tierCase.system, seed: 7, generatedBy: 'agent-c-evidence' },
    slides: [{ id: 'r1', thesis: tierCase.thesis ?? name, background: tierCase.background, blocks }] });
  const slide = deck.slides[0];
  const html = renderMeasureHtml(slide, tierCase.system);
  writeFileSync(join(dir, `${name}.html`), html);
  writeFileSync(join(dir, `${name}.deck.json`), JSON.stringify(deck, null, 2));
  const ms = measureSlideRender(slide, tierCase.system);
  const gate = critiqueRenderedOverflow(slide, ms);
  const staticReport = critiqueDeck(deck);
  const { buffer } = await exportToPptxBuffer(deck);
  writeFileSync(join(dir, `${name}.pptx`), buffer);
  shot(join(dir, `${name}.html`), join(dir, `${name}.png`));
  const expectedChars = blocks.reduce((a, b) => a + b.content.length, 0);
  const pptx = await validatePptxBytes(buffer, expectedChars);
  const clips = gate.findings.filter((f) => f.check === 'overflow-visible').map((f) => f.detail);
  const ok = expectClips.every((id) => clips.some((d) => d.includes(id)));
  evidence.cases.push({ name, kind: 'before-fixed-geometry', validation: 'OK',
    staticOverflowRisk: staticReport.findings.filter((f) => f.check === 'overflow-risk').map((f) => f.detail),
    renderedClips: clips, expectedClipsFound: ok,
    pptx: { ok: pptx.ok, editableChars: pptx.stats?.editableChars, expectedChars } });
  console.log(`${ok ? 'PASS' : 'FAIL'} before/${name}: ${clips.length} rendered clip(s) [${clips.join(' | ')}]`);
  if (!ok) process.exitCode = 1;
}

async function emitAfter(name, narrative, system, opts = {}) {
  const dir = join(OUT, 'after');
  mkdirSync(dir, { recursive: true });
  const targetIdx = opts.targetIdx ?? narrative.slides.length - 1;
  let plan = planCompositions(narrative, system);
  if (opts.forceCandidate) {
    plan = plan.map((p, i) => i === targetIdx
      ? { ...p, candidateId: opts.forceCandidate, rationale: `${p.rationale}; evidence: forced ${opts.forceCandidate}` }
      : p);
  }
  const deck = layoutDeck(narrative, system, { seed: 7, compositionPlan: plan });
  const slide = deck.slides[targetIdx];
  const html = renderMeasureHtml(slide, system);
  writeFileSync(join(dir, `${name}.html`), html);
  writeFileSync(join(dir, `${name}.deck.json`), JSON.stringify(deck, null, 2));
  const ms = measureSlideRender(slide, system);
  const gate = critiqueRenderedOverflow(slide, ms);
  const staticReport = critiqueDeck(deck);
  const { buffer } = await exportToPptxBuffer(deck);
  writeFileSync(join(dir, `${name}.pptx`), buffer);
  shot(join(dir, `${name}.html`), join(dir, `${name}.png`));
  const expectedChars = deck.slides.flatMap((s) => s.blocks).reduce((a, b) => a + b.content.length, 0);
  const pptx = await validatePptxBytes(buffer, expectedChars);
  const clips = gate.findings.filter((f) => f.check === 'overflow-visible');
  const risks = staticReport.findings.filter((f) => f.check === 'overflow-risk');
  const ok = clips.length === 0 && risks.length === 0 && pptx.ok;
  evidence.cases.push({ name, kind: 'after-engine', system, candidate: plan[targetIdx].candidateId,
    forced: opts.forceCandidate ?? null,
    validation: 'OK', staticOverflowRisk: risks.map((f) => f.detail),
    renderedClips: clips.map((f) => f.detail), clean: ok,
    pptx: { ok: pptx.ok, editableChars: pptx.stats?.editableChars, expectedChars } });
  console.log(`${ok ? 'PASS' : 'FAIL'} after/${name} [${plan[targetIdx].candidateId}${opts.forceCandidate ? ' forced' : ''}]: clips=${clips.length} risks=${risks.length} pptx=${pptx.ok}`);
  if (!ok) process.exitCode = 1;
}

function narrativeFromProbe(slideId, thesis, probeBlocks, order) {
  const byId = Object.fromEntries(probeBlocks.map((b) => [b.id, b]));
  const roleOf = (id) => byId[id].role;
  return { title: thesis, lang: 'en', slides: [{ id: slideId, thesis,
    blocks: order.map((id) => ({ role: roleOf(id), content: byId[id].content })) }] };
}

// BEFORE: the 3 research silent clips on fixed Tier-B geometry.
const tq2 = inputs('gapminder-tq2-p1.case.json');
const tle5 = inputs('gapminder-tle-p5.case.json');
const g1long = inputs('gen-g1-long-en.case.json');
const g1metric = inputs('gen-g1-metric.case.json');
const g3long = inputs('gen-g3-long-en.case.json');
await emitBefore('before-g1-long-en', tq2, g1long, ['title']);
await emitBefore('before-g1-metric', tq2, g1metric, ['number']);
// Faithful G3 probe: the research-observed body1 clip is font-sensitive (box
// fits exactly, dY=0, under macOS fallback fonts; it clipped under the
// researcher's wider fonts). Recorded as-is with no clip expectation.
await emitBefore('before-g3-long-en', tle5, g3long, []);
// Synthetic deep variant (+2 lines in body1): clips under ANY font,
// demonstrating the G3 clip class deterministically.
{
  const deep = JSON.parse(JSON.stringify(g3long));
  const b1 = deep.blocks.find((b) => b.id === 'body1');
  b1.content += ' The precinct-level returns told the same story twice over, and neither recount changed the margin. Observers filed the same complaint in every district.';
  await emitBefore('before-g3-deep', tle5, deep, ['body1']);
}

// AFTER: identical probe content through the engine (G1/G3 selected, R1-R3 applied).
await emitAfter('after-g1-long-en', narrativeFromProbe('n0-cover', 'G1 after', g1long.blocks,
  ['kicker', 'number', 'title', 'url', 'foot-l', 'foot-c', 'foot-r']), 'swiss');
await emitAfter('after-g1-metric', narrativeFromProbe('n0-cover', 'G1 metric after', g1metric.blocks,
  ['kicker', 'number', 'title', 'url', 'foot-l', 'foot-c', 'foot-r']), 'swiss');
// G3 after: 3-slide narrative (cover/evidence/closing) so the explainer
// classifies as evidence. 11 bodies exceed G3's max-8 precondition, so the
// plan is forced — the Tier-B shape itself is the stress case for R3.
{
  const g3 = narrativeFromProbe('n2-results', 'G3 after', g3long.blocks,
    ['run-l', 'headline', 'lede', 'star1', 'sub1', 'body1', 'star2', 'sub2', 'body2', 'star3', 'sub3', 'body3', 'closing', 'foot-l', 'foot-c', 'foot-r']);
  // star glyphs are body-role in Tier-B; keep roles, drop run-r duplicate kicker (kept: run-l).
  g3.slides.unshift({ id: 'n0-cover', thesis: 'cover', blocks: [{ role: 'title', content: 'The Harbor Levy' }] });
  g3.slides.push({ id: 'n4-closing', thesis: 'close', blocks: [{ role: 'title', content: 'What survives' }] });
  await emitAfter('after-g3-long-en', g3, 'swiss', { targetIdx: 1, forceCandidate: 'evidence-explainer-columns' });
}
// AFTER KO pair (long content × editorial context).
await emitAfter('after-g1-long-ko', { title: 'G1 KO after', lang: 'ko', slides: [{ id: 'n0-cover', thesis: 'G1 KO',
  blocks: [ { role: 'kicker', content: '심층 보도' }, { role: 'number', content: '98%' },
    { role: 'title', content: '국경을 넘어 밤에도 정시에 달리는 야간 열차의 비밀' },
    { role: 'caption', content: 'probe.example.org/ko-teach' }, { role: 'caption', content: '사실 기반 세계관을 위한 무료 교육 자료' }, { role: 'caption', content: '버전: 6' } ] }] }, 'editorial');
await emitAfter('after-g3-long-ko', { title: 'G3 KO after', lang: 'ko', slides: [
  { id: 'n0-cover', thesis: 'cover', blocks: [{ role: 'title', content: '기대 수명 보고서' }] },
  { id: 'n2-results', thesis: 'G3 KO', blocks: [ { role: 'kicker', content: '자료 해설: 기대 수명과 세계 보건' },
    { role: 'title', content: '왜 세계 보건의 진전을 모르는가?' },
    { role: 'body', content: '세계 기대 수명에 대한 질문에 많은 사람이 오답을 고른다. 그 이유를 이해하는 일은 생각보다 어렵다. 같은 오답 패턴이 여러 나라에서 반복되기 때문이며, 이는 교육과 보도의 구조적 문제와 맞닿아 있다.' },
    { role: 'body', content: '세계 보건이 크게 나아졌다는 사실은 잘 알려져 있지 않다. 전환에는 수십 년이 걸렸고, 그 과정은 뉴스 한 줄로 요약되지 않는 느린 변화의 연속이었다.' },
    { role: 'body', content: '기대 수명의 증가는 너무 느리게 일어나 뉴스가 되지 못한다. 수십 년 이어지는 추세이지만 대중은 모르고, 언론은 극적인 사건만 다룬다.' },
    { role: 'body', content: '다수가 여전히 극빈층이라는 오해가 오답을 낳는다. 실제로는 수십억 명이 중간 소득 국가에 살며, 극빈층의 비율은 역사상 가장 낮은 수준이다.' },
    { role: 'body', content: '설문 응답자들은 소득 분포를 묻는 문항에서도 비슷한 오류를 보인다. 다봉 분포를 상상하지만 실제 분포는 단일 봉우리에 가깝다.' },
    { role: 'body', content: '자세한 내용은 자료실에서 확인할 수 있다. 수치는 공개 통계에 근거한다: example.org/ko-longevity' },
    { role: 'caption', content: 'probe.example.org/ko-teach' }, { role: 'caption', content: '사실 기반 세계관을 위한 무료 교육 자료' }, { role: 'caption', content: '버전: 6' } ] },
  { id: 'n4-closing', thesis: 'close', blocks: [{ role: 'title', content: '핵심 요약' }] }] }, 'editorial', { targetIdx: 1, forceCandidate: 'evidence-explainer-columns' });

// Candidate-index snapshot (derived live from records; this file is a convenience copy).
writeFileSync(join(OUT, 'candidate-index.json'), JSON.stringify(
  { indexVersion: CANDIDATE_INDEX_VERSION, grammar: COMPOSITION_GRAMMAR.version, rows: candidateIndex() }, null, 2));
writeFileSync(join(OUT, 'EVIDENCE.json'), JSON.stringify(evidence, null, 2));
console.log(`\nwrote ${evidence.cases.length} cases + candidate-index.json + EVIDENCE.json`);
