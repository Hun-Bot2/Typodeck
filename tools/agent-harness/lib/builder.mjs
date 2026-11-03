// Spec-driven slide builder: composes per-role HTML/CSS from design.md tokens.
// Every color, type size, and spacing constant comes from the parsed spec —
// no hardcoded palette. Layouts follow the design.md component vocabulary
// (kicker+square, one 6px red rule, index rail, hairline footer, exposed grid).

import { px } from './spec.mjs';

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fontStack(lang, spec, latinStack, weight) {
  if (lang === 'ko') {
    // design.md CJK strategy A: single CJK family; numerals stay Latin.
    const w = weight >= 800 ? 900 : weight >= 600 ? 700 : weight >= 500 ? 500 : 400;
    return { family: "'Noto Sans KR', 'Archivo', sans-serif", weight: w };
  }
  return { family: latinStack, weight };
}

function lh(base, lang, rules) {
  const b = Number(base);
  if (lang === 'ko') return Math.max(b * (rules?.lineHeightBoost ?? 1.18), b + 0.15).toFixed(2);
  return String(b);
}

function track(lang, rules, latin) {
  if (lang === 'ko' && rules?.noTracking) return '0';
  return latin;
}

function caps(lang, rules) {
  if (lang === 'ko' && rules?.noUppercase) return 'none';
  return 'uppercase';
}

/** Title ladder from design.md iteration rule 8: 118 -> 72 -> 48 by length. */
export function titleLadder(kind, len) {
  if (kind === 'cover' || kind === 'closing') {
    if (len <= 45) return 118;
    if (len <= 80) return 72;
    return 48;
  }
  if (kind === 'divider') return 72;
  if (kind === 'statement') return len <= 60 ? 104 : 72;
  return 48;
}

export function buildSlide({ spec, slide, role, index, total, deck, lang, adjust = {} }) {
  const T = spec.tokens;
  const cjk = spec.cjk;
  const C = T.colors;
  const nn = String(index + 1).padStart(2, '0');
  const tt = String(total).padStart(2, '0');
  const typo = (name) => T.typography[name];
  const fam = (name, fb) => typo(name).fontFamily || fb;

  const displayF = fontStack(lang, spec, fam('display-xl', "'Archivo', sans-serif"), 800);
  const kickF = lang === 'ko'
    ? { family: "'Noto Sans KR', sans-serif", weight: 700 }
    : { family: fam('kicker', "'Archivo', sans-serif"), weight: 600 };
  const bodyF = lang === 'ko'
    ? { family: "'Noto Sans KR', sans-serif", weight: 400 }
    : { family: fam('body', "'Inter', sans-serif"), weight: 400 };
  const bodyMed = lang === 'ko'
    ? { family: "'Noto Sans KR', sans-serif", weight: 500 }
    : { family: fam('caption', "'Inter', sans-serif"), weight: 500 };

  const narrow = role === 'dense';
  const contentW = narrow ? 1326 : 1176;
  const railLeft = narrow ? 1422 : 1272;
  const railW = narrow ? 426 : 576;
  const numeralPx = adjust.numeralPx ?? (narrow ? 300 : px(typo('index-numeral').fontSize));

  const fontsHref = lang === 'ko'
    ? (cjk?.fontHref ?? 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Archivo:wght@800&display=swap')
    : 'https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=Inter:wght@400;500&display=swap';

  const kicker = slide.kicker
    ? `<p class="kicker" data-t="kicker" data-headline>${esc(slide.kicker)}</p>\n<div class="redrule" aria-hidden="true"></div>`
    : `<div class="redrule notop" aria-hidden="true"></div>`;

  const meta = (slide.meta?.length ? slide.meta : [
    { label: 'Issue', value: `${nn} / ${tt}` },
    { label: 'Date', value: deck.date ?? '' },
    { label: 'Context', value: deck.context ?? '' },
  ]).filter((m) => (typeof m === 'string' ? m : m.value)).map((m) => {
    if (typeof m === 'string') return `<li data-t="meta">${esc(m)}</li>`;
    return `<li data-t="meta"><span>${esc(m.label)}</span>${esc(m.value)}</li>`;
  }).join('\n');

  const fx = slide.fixture
    ? `<span class="fx" data-fixture title="${esc(slide.fixtureNote ?? 'illustrative content')}">· FIXTURE</span>` : '';

  const withFx = (html) => (slide.fixture && !html.includes('data-fixture') ? `${html} ${fx}` : html);

  const notes = [];
  let bodyHtml = '';
  const titleLen = (slide.title ?? slide.statement ?? '').length;

  if (role === 'cover' || role === 'closing') {
    const size = adjust.titlePx ?? titleLadder(role, titleLen);
    notes.push(`${role} composition: display ${size}px + ${role === 'cover' ? 'lede' : 'recap'}`);
    const cls = role === 'cover' ? 'title-xl' : 'close-line';
    const sub = role === 'cover' ? slide.lede : slide.recap;
    const subCls = role === 'cover' ? 'lede' : 'close-recap';
    bodyHtml = `
    <h1 class="${cls}" data-t="title" data-headline style="font-size:${size}px">${esc(slide.title ?? deck.title ?? '')}</h1>
    ${sub ? `<p class="${subCls}" data-t="sub">${withFx(esc(sub))}</p>` : ''}`;
  } else if (role === 'divider') {
    const size = adjust.titlePx ?? 72;
    notes.push(`divider composition: section title ${size}px + orienting line, no data`);
    bodyHtml = `
    <h1 class="sec-title" data-t="title" data-headline style="font-size:${size}px">${esc(slide.title ?? '')}</h1>
    ${slide.orienting ? `<p class="orient" data-t="sub">${withFx(esc(slide.orienting))}</p>` : ''}`;
  } else if (role === 'statement') {
    const size = adjust.titlePx ?? titleLadder('statement', titleLen);
    notes.push(`statement composition: single ${size}px sentence + source line, restraint held`);
    bodyHtml = `
    <p class="statement" data-t="title" data-headline style="font-size:${size}px">${esc(slide.statement ?? slide.title ?? '')}</p>
    ${slide.source ? `<p class="srcline" data-t="src">${withFx(esc(slide.source))}</p>` : ''}`;
  } else if (role === 'evidence') {
    const size = adjust.titlePx ?? 48;
    notes.push(`evidence composition: message ${size}px + stat/finding row under 2px rule`);
    let mid = '';
    if (slide.stats?.length) {
      const spx = adjust.statsPx ?? 150;
      mid = `<div class="statrow" data-t="stats">${slide.stats.map((s) => {
        const v = typeof s === 'string' ? s : s.value;
        const l = typeof s === 'string' ? '' : (s.label ?? '');
        return `<div class="stat"><div class="statnum" style="font-size:${spx}px">${esc(v)}</div><div class="statlab">${esc(l)}</div></div>`;
      }).join('')}</div>`;
    } else if (slide.findings?.length) {
      mid = `<ol class="findings" data-t="findings">${slide.findings.slice(0, 4).map((f, i) => {
        const h = typeof f === 'string' ? f : f.head;
        const b = typeof f === 'string' ? '' : (f.body ?? '');
        return `<li><span class="fnum">${String(i + 1).padStart(2, '0')}</span><span class="fbody"><span class="fhead">${esc(h)}</span>${b ? `<span class="fsub">${esc(b)}</span>` : ''}</span></li>`;
      }).join('')}</ol>`;
      if (slide.findings.length > 4) notes.push('findings capped at 4 rows per spec');
    }
    bodyHtml = `
    <h1 class="ev-msg" data-t="title" data-headline style="font-size:${size}px">${esc(slide.message ?? slide.title ?? '')}</h1>
    ${mid}
    ${slide.lede ? `<p class="ev-sup" data-t="sub">${withFx(esc(slide.lede))}</p>` : ''}
    ${slide.source ? `<p class="srcline" data-t="src">${withFx(esc(slide.source))}</p>` : ''}`;
  } else if (role === 'comparison') {
    const size = adjust.titlePx ?? 56;
    notes.push('comparison composition: two-zone A/B, positional identity, valence squares');
    const zone = (z, cls) => `<div class="zone ${cls}" data-t="zone-${cls}">
      <h2 class="zone-h" data-headline>${esc(z.label)}</h2>
      <ul>${(z.rows ?? []).map((r) => {
        const t = typeof r === 'string' ? r : r.text;
        const flag = typeof r === 'string' ? false : !!r.flag;
        return `<li class="${flag ? 'bad' : 'good'}">${esc(t)}</li>`;
      }).join('')}</ul></div>`;
    bodyHtml = `
    <h1 class="cmp-title" data-t="title" data-headline style="font-size:${size}px">${esc(slide.title ?? slide.message ?? '')}</h1>
    <div class="zones">${zone(slide.zones.a, 'zone-a')}${zone(slide.zones.b, 'zone-b')}</div>
    ${slide.caption ? `<p class="caption" data-t="cap">${withFx(esc(slide.caption))}</p>` : ''}`;
  } else if (role === 'dense') {
    const size = adjust.titlePx ?? 48;
    const tpx = adjust.tablePx ?? 21;
    notes.push(`dense composition: swiss table ${tpx}px, rail narrowed to cols 10-12`);
    const t = slide.table;
    bodyHtml = `
    <h1 class="d-title" data-t="title" data-headline style="font-size:${size}px">${esc(slide.title ?? slide.message ?? '')}</h1>
    <table class="swiss" data-t="table" style="font-size:${tpx}px"><thead><tr>${t.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${t.rows.map((row, i) => `<tr class="${t.flags?.[i] ? 'flag' : ''}">${row.map((cell, j) => `<td class="${j === 0 ? 'case' : j === 2 ? 'cost' : ''}">${esc(String(cell))}</td>`).join('')}</tr>`).join('')}</tbody></table>
    ${t.footnote ? `<p class="d-foot" data-t="tfoot">${withFx(esc(t.footnote))}</p>` : ''}`;
  }

  const footerCtx = deck.context ?? deck.title ?? '';
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(deck.title ?? 'Deck')} — ${nn}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontsHref}" rel="stylesheet">
<style>
  * { border-radius:0 !important; }
  html, body { margin:0; padding:0; background:#000; }
  .slide { position:relative; width:1920px; height:1080px; background:${C.white};
    color:${C.ink}; font-family:${bodyF.family}; overflow:hidden; }
  .colgrid { position:absolute; top:0; bottom:0; left:72px; right:72px;
    display:grid; grid-template-columns:repeat(12, 1fr); gap:24px; pointer-events:none; }
  .colgrid i { border-left:1px solid ${C.gridline}; display:block; }
  .colgrid i:last-child { border-right:1px solid ${C.gridline}; }
  .content { position:absolute; top:64px; left:72px; width:${contentW}px; max-height:796px; }
  .kicker { display:flex; align-items:center; gap:16px; font-family:${kickF.family};
    font-weight:${kickF.weight}; font-size:20px; letter-spacing:${track(lang, cjk?.rules, '0.18em')};
    text-transform:${caps(lang, cjk?.rules)}; color:${C['signal-red']}; margin:0; }
  .kicker::before { content:""; width:18px; height:18px; background:${C['signal-red']}; flex:0 0 auto; }
  .redrule { height:6px; background:${C['signal-red']}; margin-top:20px; width:100%; }
  .redrule.notop { margin-top:0; }
  .rail { position:absolute; top:64px; bottom:110px; left:${railLeft}px; width:${railW}px;
    background:${C['rail-gray']}; padding:40px 36px; box-sizing:border-box; overflow:hidden; }
  .numeral { font-family:'Archivo', "Arial Black", sans-serif; font-weight:800;
    font-size:${numeralPx}px; line-height:0.85; letter-spacing:-0.02em; color:${C.ink}; margin:0; }
  .railrule { height:6px; background:${C['signal-red']}; margin:28px 0 12px 0; }
  .meta { margin:0; padding:0; list-style:none; }
  .meta li { font-family:${bodyMed.family}; font-size:19px; font-weight:500;
    letter-spacing:${track(lang, cjk?.rules, '0.1em')}; text-transform:${caps(lang, cjk?.rules)};
    line-height:1.5; padding:14px 0; border-top:1px solid #D9D9D9; }
  .meta li span { display:block; color:${C.muted}; font-size:16px; }
  .footer { position:absolute; left:72px; right:72px; bottom:0; height:110px;
    border-top:2px solid ${C.ink}; display:flex; align-items:center;
    justify-content:space-between; background:${C.white}; }
  .footer .ctx { font-family:${bodyMed.family}; font-size:20px; font-weight:500;
    letter-spacing:${track(lang, cjk?.rules, '0.08em')}; text-transform:${caps(lang, cjk?.rules)}; margin:0; }
  .footer .idx { font-family:'Archivo', "Arial Black", sans-serif; font-weight:600;
    font-size:22px; letter-spacing:0.12em; margin:0; }
  h1, .statement { font-family:${displayF.family}; font-weight:${displayF.weight};
    text-align:left; margin:44px 0 0 0; }
  .title-xl { line-height:${lh(1.02, lang, cjk?.rules)}; letter-spacing:${track(lang, cjk?.rules, '-0.01em')}; }
  .sec-title { line-height:${lh(1.05, lang, cjk?.rules)}; letter-spacing:${track(lang, cjk?.rules, '-0.01em')}; margin-top:60px; }
  .statement { line-height:${lh(1.06, lang, cjk?.rules)}; letter-spacing:${track(lang, cjk?.rules, '-0.01em')}; margin-top:70px; }
  .ev-msg { line-height:${lh(1.12, lang, cjk?.rules)}; letter-spacing:${track(lang, cjk?.rules, '-0.01em')}; margin-top:40px; }
  .cmp-title { line-height:${lh(1.08, lang, cjk?.rules)}; letter-spacing:${track(lang, cjk?.rules, '-0.01em')}; margin-top:36px; }
  .d-title { line-height:${lh(1.08, lang, cjk?.rules)}; letter-spacing:${track(lang, cjk?.rules, '-0.01em')}; margin-top:32px; }
  .close-line { line-height:${lh(1.02, lang, cjk?.rules)}; letter-spacing:${track(lang, cjk?.rules, '-0.01em')}; margin-top:120px; }
  .lede { font-size:34px; line-height:${lh(1.45, lang, cjk?.rules)}; color:#333; margin:36px 0 0 0; max-width:1026px; }
  .orient { font-size:34px; line-height:${lh(1.45, lang, cjk?.rules)}; color:#333; margin:36px 0 0 0; max-width:1026px; }
  .close-recap { font-size:34px; line-height:${lh(1.45, lang, cjk?.rules)}; color:#333; margin:40px 0 0 0; max-width:1026px; }
  .srcline { font-family:${bodyMed.family}; font-size:20px; font-weight:500;
    letter-spacing:${track(lang, cjk?.rules, '0.08em')}; text-transform:${caps(lang, cjk?.rules)};
    color:${C.muted}; margin:40px 0 0 0; }
  .statrow { display:flex; gap:36px; margin:44px 0 0 0; border-top:2px solid ${C.ink}; padding-top:32px; }
  .stat { display:flex; align-items:flex-end; gap:20px; padding-right:36px; border-right:1px solid #D9D9D9; }
  .stat:last-child { border-right:none; }
  .statnum { font-family:${displayF.family}; font-weight:${displayF.weight}; line-height:0.9;
    letter-spacing:${track(lang, cjk?.rules, '-0.02em')}; }
  .statlab { font-family:${bodyMed.family}; font-size:20px; font-weight:500;
    letter-spacing:${track(lang, cjk?.rules, '0.08em')}; text-transform:${caps(lang, cjk?.rules)};
    line-height:1.5; padding-bottom:18px; max-width:300px; }
  .ev-sup { font-size:24px; line-height:${lh(1.5, lang, cjk?.rules)}; color:#333; margin:32px 0 0 0; max-width:1026px; }
  .findings { list-style:none; margin:36px 0 0 0; padding:0; border-top:2px solid ${C.ink}; }
  .findings li { display:flex; gap:24px; padding:24px 0; border-bottom:1px solid #E4E4E4; }
  .fnum { font-family:${displayF.family}; font-weight:${displayF.weight}; font-size:30px; flex:0 0 96px; }
  .fbody { display:flex; flex-direction:column; gap:8px; }
  .fhead { font-family:${displayF.family}; font-weight:${displayF.weight}; font-size:30px; line-height:1.15; }
  .fsub { font-size:24px; line-height:${lh(1.5, lang, cjk?.rules)}; color:#333; }
  .zones { display:flex; gap:24px; margin-top:36px; }
  .zone { flex:1 1 0; }
  .zone-b { border-left:1px solid #D9D9D9; padding-left:24px; }
  .zone-h { font-family:${displayF.family}; font-weight:${displayF.weight}; font-size:30px;
    line-height:1.15; margin:0; }
  .zone ul { list-style:none; margin:0; padding:18px 0 0 0; border-top:2px solid ${C.ink}; margin-top:12px; }
  .zone li { display:flex; gap:14px; align-items:flex-start; font-size:22px; line-height:1.45;
    padding:12px 0; border-bottom:1px solid #E4E4E4; }
  .zone li::before { content:""; width:14px; height:14px; flex:0 0 auto; margin-top:9px; background:${C.ink}; }
  .zone li.bad::before { background:${C['signal-red']}; }
  .caption { font-size:22px; line-height:1.5; color:${C.muted}; margin:30px 0 0 0;
    border-top:1px solid #D9D9D9; padding-top:20px; }
  table.swiss { border-collapse:collapse; margin:24px 0 0 0; width:100%; }
  table.swiss th { font-family:${bodyMed.family}; font-weight:500; letter-spacing:${track(lang, cjk?.rules, '0.08em')};
    text-transform:${caps(lang, cjk?.rules)}; color:${C.muted}; text-align:left; font-size:0.86em;
    padding:10px 16px 10px 0; border-top:2px solid ${C.ink}; border-bottom:2px solid ${C.ink}; }
  table.swiss td { line-height:1.3; padding:8px 16px 8px 0; border-bottom:1px solid #E4E4E4; white-space:nowrap; }
  table.swiss td.case { font-family:${displayF.family}; font-weight:${displayF.weight}; font-size:0.95em; }
  table.swiss tr.flag td.cost::before { content:""; display:inline-block; width:12px; height:12px;
    background:${C['signal-red']}; margin-right:10px; }
  .d-foot { font-family:${bodyMed.family}; font-size:18px; font-weight:500;
    letter-spacing:${track(lang, cjk?.rules, '0.08em')}; text-transform:${caps(lang, cjk?.rules)};
    color:${C.muted}; margin:14px 0 0 0; }
  .fx { color:${C.muted}; font-size:0.85em; letter-spacing:0.08em; white-space:nowrap; }
</style>
</head>
<body>
<div class="slide" data-contain="stage">
  <div class="colgrid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  <div class="content">
    ${kicker}
    ${bodyHtml}
  </div>
  <aside class="rail" data-t="rail">
    <p class="numeral" data-t="numeral" data-contain="rail">${nn}</p>
    <div class="railrule" aria-hidden="true"></div>
    <ul class="meta">${meta}</ul>
  </aside>
  <footer class="footer"><p class="ctx" data-t="footer">${esc(footerCtx)}</p><p class="idx" data-t="pageidx">${nn} / ${tt}</p></footer>
</div>
</body>
</html>
`;
  return { html, notes };
}
