// O5: rendered overflow via headless Chrome. IDENTICAL instrument for both arms:
// the same injected collector, the same engine `detectRenderedOverflow`
// tolerances (Agent C critic). Containers cycle one-visible-at-a-time so
// hidden slides (Arm A nav) are measured exactly as presented.
// Run (throwaway core): TD_CORE_DIST=... node measure/chrome-overflow.mjs <deckHtml> <outJson>
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

const DIST = process.env.TD_CORE_DIST;
if (!DIST) { console.error('TD_CORE_DIST is required'); process.exit(2); }
const need = createRequire(import.meta.url);
const { measureHtmlWithChrome, detectRenderedOverflow } = need(path.join(DIST, 'src', 'critic.js'));

// Leaf slide containers only (an Arm A .stage wrapper holds .slide children
// and must not be cycled itself). Same output fields as the engine probe.
const MEASURE_JS = `(function(){
  function collect(){
    var all=[...document.querySelectorAll('.stage,.slide')];
    var containers=all.filter(function(c){return !c.querySelector('.stage,.slide');});
    if(!containers.length) containers=[document.body];
    var orig=containers.map(function(c){return c.style.display;});
    containers.forEach(function(c){c.style.display='none';});
    var out=[];var idx=0;
    containers.forEach(function(c,si){
      var isSlide=c.classList.contains('slide')&&!c.classList.contains('stage');
      c.style.display=isSlide?'flex':'block';
      var blocks=c.querySelectorAll('.slide-block');
      var stageW=c.clientWidth||document.documentElement.clientWidth;
      for(var i=0;i<blocks.length;i++){
        var el=blocks[i];var cs=window.getComputedStyle(el);
        var fs=parseFloat(cs.fontSize)||0;
        var lh=cs.lineHeight==='normal'?fs*1.2:(parseFloat(cs.lineHeight)||fs*1.2);
        out.push({index:idx++,blockId:el.getAttribute('data-block-id'),
          slideId:el.getAttribute('data-slide-id')||('container-'+si),stageWidthPx:stageW,
          scrollWidth:el.scrollWidth,scrollHeight:el.scrollHeight,
          clientWidth:el.clientWidth,clientHeight:el.clientHeight,
          fontSizePx:fs,lineHeightPx:lh});
      }
      c.style.display='none';
    });
    containers.forEach(function(c,k){c.style.display=orig[k];});
    if(!document.getElementById('typodeck-overflow')){
      var s=document.createElement('script');s.id='typodeck-overflow';s.type='application/json';
      s.textContent=JSON.stringify(out);document.body.appendChild(s);
    }
  }
  if(document.readyState==='complete')collect();else window.addEventListener('load',collect);
})();`;

function chromeVersion() {
  const bins = [process.env.TYPODECK_CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'google-chrome', 'chromium'].filter(Boolean);
  for (const b of bins) {
    try { return execFileSync(b, ['--version'], { encoding: 'utf8' }).trim(); } catch { /* next */ }
  }
  return 'unknown';
}

async function main() {
  const [deckHtml, outJson] = process.argv.slice(2);
  if (!deckHtml || !outJson) { console.error('usage: chrome-overflow.mjs <deckHtml> <outJson>'); process.exit(2); }
  const html = await fs.readFile(deckHtml, 'utf8');
  const blockCount = (html.match(/data-block-id="/g) ?? []).length;
  if (!html.includes('slide-block')) throw new Error('no .slide-block hooks in deck HTML');
  const instrumented = html.replace('</body>', `<script>${MEASURE_JS}</script></body>`);
  if (instrumented === html) throw new Error('no </body> for probe injection');

  const measurements = measureHtmlWithChrome(instrumented, { widthPx: 1280 });
  const fallbackIds = [...html.matchAll(/data-block-id="([^"]+)"/g)].map((m) => m[1]);
  const rows = detectRenderedOverflow(measurements, fallbackIds);
  const byId = new Map(measurements.map((m, i) => [rows[i].blockId, { ...rows[i], fontSizePx: m.fontSizePx, lineHeightPx: m.lineHeightPx, slideId: m.slideId, stageWidthPx: m.stageWidthPx }]));
  const overflowing = [...byId.values()].filter((r) => r.overflowX || r.overflowY);

  const out = {
    deck: path.basename(deckHtml),
    chrome: chromeVersion(),
    viewport: '1280x720',
    blocksInHtml: blockCount,
    measured: measurements.length,
    overflowBlocks: overflowing.length,
    overflowing: overflowing.map((r) => ({
      blockId: r.blockId, slideId: r.slideId,
      axes: [r.overflowX ? `w ${r.scrollWidth}>${r.clientWidth} (tol ${r.hTolerancePx.toFixed(1)})` : null, r.overflowY ? `h ${r.scrollHeight}>${r.clientHeight} (tol ${r.vTolerancePx.toFixed(1)})` : null].filter(Boolean),
      fontSizePx: +r.fontSizePx.toFixed(2),
    })),
    // Per-block font sizes feed O6 (min title/body px).
    fonts: [...byId.values()].map((r) => ({ blockId: r.blockId, slideId: r.slideId, fontSizePx: +r.fontSizePx.toFixed(2) })),
    stageWidthsPx: [...new Set(measurements.map((m) => m.stageWidthPx))],
  };
  await fs.mkdir(path.dirname(outJson), { recursive: true });
  await fs.writeFile(outJson, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`o5: ${out.deck} measured=${out.measured}/${out.blocksInHtml} overflow=${out.overflowBlocks} (${out.chrome})`);
}

main().catch((e) => { console.error(`SKIPPED: chrome-overflow (${e.message})`); process.exit(3); });
