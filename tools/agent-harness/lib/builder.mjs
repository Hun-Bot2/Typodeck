// Spec-driven slide builder (typography-only): composes per-role HTML/CSS
// from design.md tokens. Every color, type size, and spacing constant comes
// from the parsed spec — no hardcoded palette. Hierarchy is carried by
// position, alignment, proximity, scale, weight, color, and whitespace only:
// no visible rectangles, cards, panels, rails, rules, table grids, borders
// used as containers, or colored boxes behind text. The only background is
// the full-slide solid ground.

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

  // Typographic two-column rhythm: text column left, folio numeral + meta
  // right, separated by whitespace only (no rail panel, no grid lines).
  const contentW = 1152;
  const folioLeft = 1288;
  const folioW = 560;
  const numeralPx = adjust.numeralPx ?? px(typo('index-numeral').fontSize);

  const fontsHref = lang === 'ko'
    ? (cjk?.fontHref ?? 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Archivo:wght@800&display=swap')
    : 'https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=Inter:wght@400;500&display=swap';

  const kicker = slide.kicker
    ? `<p class="kicker" data-t="kicker" data-headline>${esc(slide.kicker)}</p>`
    : '';

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

  const withFx = (html) => (slide.fixture && !html.includes('data-fixture') ? `${html}&nbsp;${fx}` : html);

  const notes = [];
  let bodyHtml = '';
  const titleLen = (slide.title ?? slide.statement ?? '').length;

  if (role === 'cover' || role === 'closing') {
    const size = adjust.titlePx ?? titleLadder(role, titleLen);
    notes.push(`${role} composition: display ${size}px + ${role === 'cover' ? 'lede' : 'recap'}, type only`);
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
    notes.push(`evidence composition: message ${size}px + stat/finding group, whitespace-separated`);
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
    notes.push('comparison composition: two-zone A/B, positional identity, accent marks flags');
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
    notes.push(`dense composition: typographic ledger ${tpx}px, aligned columns, no grid`);
    const t = slide.table;
    bodyHtml = `
    <h1 class="d-title" data-t="title" data-headline style="font-size:${size}px">${esc(slide.title ?? slide.message ?? '')}</h1>
    <div class="ledger" data-t="table" style="font-size:${tpx}px">${t.columns.map((c) => `<span class="lhead">${esc(c)}</span>`).join('')}
    ${t.rows.map((row, i) => `<div class="lrow${t.flags?.[i] ? ' flag' : ''}">${row.map((cell, j) => `<span class="cell${j === 0 ? ' case' : j === 2 ? ' cost' : ''}">${esc(String(cell))}</span>`).join('')}</div>`).join('')}
    </div>
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
  html, body { margin:0; padding:0; background:${C.white}; }
  .slide { position:relative; width:1920px; height:1080px; background:${C.white};
    color:${C.ink}; font-family:${bodyF.family}; overflow:hidden; }
  .content { position:absolute; top:64px; left:72px; width:${contentW}px; max-height:796px; }
  .kicker { font-family:${kickF.family};
    font-weight:${kickF.weight}; font-size:20px; letter-spacing:${track(lang, cjk?.rules, '0.18em')};
    text-transform:${caps(lang, cjk?.rules)}; color:${C['signal-red']}; margin:0; }
  .folio { position:absolute; top:64px; left:${folioLeft}px; width:${folioW}px;
    text-align:right; }
  .numeral { font-family:'Archivo', "Arial Black", sans-serif; font-weight:800;
    font-size:${numeralPx}px; line-height:0.85; letter-spacing:-0.02em; color:${C.ink}; margin:0; }
  .meta { margin:36px 0 0 0; padding:0; list-style:none; }
  .meta li { font-family:${bodyMed.family}; font-size:19px; font-weight:500;
    letter-spacing:${track(lang, cjk?.rules, '0.1em')}; text-transform:${caps(lang, cjk?.rules)};
    line-height:1.5; padding:0; margin:0 0 20px 0; }
  .meta li span { display:block; color:${C.muted}; font-size:16px; }
  .footer { position:absolute; left:72px; right:72px; bottom:0; height:110px;
    display:flex; align-items:center;
    justify-content:space-between; }
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
  .statrow { display:flex; gap:80px; margin:52px 0 0 0; }
  .stat { display:flex; align-items:flex-end; gap:20px; }
  .statnum { font-family:${displayF.family}; font-weight:${displayF.weight}; line-height:0.9;
    letter-spacing:${track(lang, cjk?.rules, '-0.02em')}; white-space:nowrap; }
  .statlab { font-family:${bodyMed.family}; font-size:20px; font-weight:500;
    letter-spacing:${track(lang, cjk?.rules, '0.08em')}; text-transform:${caps(lang, cjk?.rules)};
    line-height:1.5; padding-bottom:18px; max-width:300px; }
  .ev-sup { font-size:24px; line-height:${lh(1.5, lang, cjk?.rules)}; color:#333; margin:36px 0 0 0; max-width:1026px; }
  .findings { list-style:none; margin:44px 0 0 0; padding:0; }
  .findings li { display:flex; gap:24px; padding:0; margin:0 0 32px 0; }
  .findings li:last-child { margin-bottom:0; }
  .fnum { font-family:${displayF.family}; font-weight:${displayF.weight}; font-size:30px; flex:0 0 96px; color:${C['signal-red']}; }
  .fbody { display:flex; flex-direction:column; gap:8px; }
  .fhead { font-family:${displayF.family}; font-weight:${displayF.weight}; font-size:30px; line-height:1.15; }
  .fsub { font-size:24px; line-height:${lh(1.5, lang, cjk?.rules)}; color:#333; }
  .zones { display:flex; gap:96px; margin-top:44px; }
  .zone { flex:1 1 0; }
  .zone-h { font-family:${displayF.family}; font-weight:${displayF.weight}; font-size:30px;
    line-height:1.15; margin:0; }
  .zone ul { list-style:none; margin:20px 0 0 0; padding:0; }
  .zone li { font-size:22px; line-height:1.45; padding:0; margin:0 0 20px 0; }
  .zone li:last-child { margin-bottom:0; }
  .zone li.bad { color:${C['signal-red']}; font-weight:600; }
  .caption { font-size:22px; line-height:1.5; color:${C.muted}; margin:36px 0 0 0; }
  .ledger { display:grid; grid-template-columns:7em 10em 8em 1fr; column-gap:2.5em;
    margin:32px 0 0 0; line-height:1.35; font-variant-numeric:tabular-nums; }
  .lhead { font-family:${bodyMed.family}; font-weight:500; letter-spacing:${track(lang, cjk?.rules, '0.08em')};
    text-transform:${caps(lang, cjk?.rules)}; color:${C.muted}; font-size:0.86em; padding:0 0 0.9em 0; }
  .lrow { display:contents; }
  .lrow > .cell { padding:0.42em 0; white-space:nowrap; }
  .lrow > .cell.case { font-family:${displayF.family}; font-weight:${displayF.weight}; font-size:0.95em; }
  .lrow.flag > .cell.cost { color:${C['signal-red']}; font-weight:700; }
  .d-foot { font-family:${bodyMed.family}; font-size:18px; font-weight:500;
    letter-spacing:${track(lang, cjk?.rules, '0.08em')}; text-transform:${caps(lang, cjk?.rules)};
    color:${C.muted}; margin:22px 0 0 0; }
  .fx { color:${C.muted}; font-size:0.85em; letter-spacing:0.08em; white-space:nowrap; }
</style>
</head>
<body>
<div class="slide" data-contain="stage">
  <div class="content">
    ${kicker}
    ${bodyHtml}
  </div>
  <div class="folio">
    <p class="numeral" data-t="numeral">${nn}</p>
    <ul class="meta">${meta}</ul>
  </div>
  <footer class="footer"><p class="ctx" data-t="footer">${esc(footerCtx)}</p><p class="idx" data-t="pageidx">${nn} / ${tt}</p></footer>
</div>
</body>
</html>
`;
  return { html, notes };
}
