// Generic spec-driven slide builder (typography-only): composes per-role
// HTML/CSS from a canonical theme (see theme.mjs). Same marker contract as
// the bespoke gridline builder (data-t keys, data-headline, data-fixture)
// and same repair adjust keys (titlePx, tablePx, statsPx), so checks +
// repair work unchanged. Title sizes snap to the repair ladder so step-down
// math is exact. Hierarchy is carried by position, alignment, proximity,
// scale, weight, color, and whitespace only: no visible rectangles, cards,
// panels, rules, table grids, borders used as containers, or colored boxes
// behind text. The only background is the full-slide solid ground.

import { esc, titleLadder } from './builder.mjs';
import { koStacks, latinFontsHref, PRETENDARD_CSS, NOTO_KR_CSS } from './theme.mjs';

const RUNGS = [118, 104, 96, 72, 56, 48, 40];

export function snapDown(px, max = 118) {
  const v = Math.min(Number(px) || 48, max);
  return RUNGS.find((r) => r <= v) ?? 40;
}

function lh(base, lang) {
  const b = Number(base);
  if (lang === 'ko') return Math.max(b * 1.18, b + 0.15).toFixed(2);
  return String(b);
}

// Korean runs: never inherit Latin tracking/uppercase (ko-typography research).
function track(lang, latin) {
  return lang === 'ko' ? '0' : latin;
}
function caps(lang, latin) {
  return lang === 'ko' ? 'none' : latin;
}

export function buildSlideGeneric({ theme, slide, role, index, total, deck, lang, adjust = {} }) {
  const C = theme.colors;
  const T = theme.type;
  const ko = lang === 'ko' ? koStacks(theme) : null;
  const F = (slot) => (ko ? ko[slot] : { family: T[slot].family, weight: T[slot].weight });
  const displayF = F('display');
  const titleF = F('title');
  const kickF = F('kicker');
  const bodyF = F('body');
  const capF = F('caption');
  const numF = F('numeral');

  const nn = String(index + 1).padStart(2, '0');
  const tt = String(total).padStart(2, '0');

  const links = [];
  if (lang === 'ko') {
    links.push(`<link href="${PRETENDARD_CSS}" rel="stylesheet">`);
    const latin = latinFontsHref(theme);
    if (latin) links.push(`<link href="${latin}&family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">`);
    else links.push(`<link href="${NOTO_KR_CSS}" rel="stylesheet">`);
  } else {
    const href = latinFontsHref(theme);
    if (href) links.push(`<link href="${href}" rel="stylesheet">`);
  }

  const kicker = slide.kicker
    ? `<p class="kicker" data-t="kicker" data-headline>${esc(slide.kicker)}</p>`
    : '';

  const fx = slide.fixture
    ? `<span class="fx" data-fixture title="${esc(slide.fixtureNote ?? 'illustrative content')}">· FIXTURE</span>` : '';
  const withFx = (html) => {
    if (!slide.fixture || html.includes('data-fixture')) return html;
    // Fixture copy often names FIXTURE literally: fold it into the marker.
    if (/FIXTURE/i.test(html)) return html.replace(/\s*·?\s*FIXTURE/i, `&nbsp;${fx}`);
    return `${html}&nbsp;${fx}`;
  };

  const metaLine = (slide.meta?.length ? slide.meta : [])
    .map((m) => (typeof m === 'string' ? m : [m.label, m.value].filter(Boolean).join(' ')))
    .filter(Boolean).map((s) => esc(s)).join(' · ');
  const metaHtml = metaLine ? `<p class="metaline" data-t="meta">${metaLine}</p>` : '';

  const notes = [];
  let bodyHtml = '';
  const titleLen = (slide.title ?? slide.statement ?? '').length;
  const tense = adjust.bodyTight ? 0.875 : 1;

  if (role === 'cover' || role === 'closing') {
    const size = adjust.titlePx ?? Math.min(titleLadder(role, titleLen), snapDown(T.display.size));
    notes.push(`${role} composition: ${T.display.role} ${size}px + ${role === 'cover' ? 'lede' : 'recap'}, type only`);
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
    const size = adjust.titlePx ?? Math.min(titleLadder('statement', titleLen), snapDown(T.display.size * 0.9));
    notes.push(`statement composition: single ${size}px sentence + source line`);
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
      if (slide.findings.length > 4) notes.push('findings capped at 4 rows');
    }
    bodyHtml = `
    <h1 class="ev-msg" data-t="title" data-headline style="font-size:${size}px">${esc(slide.message ?? slide.title ?? '')}</h1>
    ${mid}
    ${slide.lede ? `<p class="ev-sup" data-t="sub">${withFx(esc(slide.lede))}</p>` : ''}
    ${slide.source ? `<p class="srcline" data-t="src">${withFx(esc(slide.source))}</p>` : ''}`;
  } else if (role === 'comparison') {
    const size = adjust.titlePx ?? 56;
    notes.push('comparison composition: two-zone A/B with positional identity, accent marks flags');
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
  const kobreak = lang === 'ko' ? 'word-break:keep-all; overflow-wrap:normal;' : '';
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(deck.title ?? 'Deck')} — ${nn}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${links.join('\n')}
<style>
  html, body { margin:0; padding:0; background:${C.bg}; }
  .slide { position:relative; width:1920px; height:1080px; background:${C.bg};
    color:${C.ink}; font-family:${bodyF.family}; overflow:hidden; }
  .content { position:absolute; top:72px; left:96px; right:96px; max-height:820px; }
  .kicker { font-family:${kickF.family};
    font-weight:${kickF.weight}; font-size:20px; letter-spacing:${track(lang, '0.14em')};
    text-transform:${caps(lang, T.kicker.textTransform)}; color:${C.accent}; margin:0; ${kobreak} }
  .metaline { font-family:${capF.family}; font-size:18px; font-weight:${capF.weight};
    letter-spacing:${track(lang, '0.06em')}; text-transform:${caps(lang, 'none')};
    color:${C.muted}; margin:14px 0 0 0; ${kobreak} }
  .footer { position:absolute; left:96px; right:96px; bottom:0; height:104px;
    display:flex; align-items:center;
    justify-content:space-between; }
  .footer .ctx { font-family:${capF.family}; font-size:19px; font-weight:${capF.weight};
    letter-spacing:${track(lang, '0.06em')}; text-transform:${caps(lang, 'none')};
    color:${C.muted}; margin:0; ${kobreak} }
  .footer .idx { font-family:${numF.family}; font-weight:${numF.weight};
    font-size:22px; letter-spacing:0.1em; margin:0; color:${C.ink}; }
  .footer .idx .numeral { font-size:30px; }
  h1, .statement { font-family:${titleF.family}; font-weight:${titleF.weight};
    text-align:left; margin:44px 0 0 0; ${kobreak} }
  .title-xl { font-family:${displayF.family}; font-weight:${displayF.weight};
    line-height:${lh(1.04, lang)}; letter-spacing:${track(lang, '-0.01em')}; }
  .sec-title { line-height:${lh(1.05, lang)}; margin-top:60px; }
  .statement { line-height:${lh(1.1, lang)}; margin-top:70px; }
  .ev-msg { line-height:${lh(1.12, lang)}; margin-top:40px; }
  .cmp-title { line-height:${lh(1.08, lang)}; margin-top:36px; }
  .d-title { line-height:${lh(1.08, lang)}; margin-top:32px; }
  .close-line { font-family:${displayF.family}; font-weight:${displayF.weight};
    line-height:${lh(1.04, lang)}; margin-top:120px; }
  .lede { font-size:${Math.round(34 * tense)}px; line-height:${lh(1.5, lang)}; margin:36px 0 0 0; max-width:1380px; ${kobreak} }
  .orient { font-size:${Math.round(34 * tense)}px; line-height:${lh(1.5, lang)}; margin:36px 0 0 0; max-width:1380px; ${kobreak} }
  .close-recap { font-size:${Math.round(34 * tense)}px; line-height:${lh(1.5, lang)}; margin:40px 0 0 0; max-width:1380px; ${kobreak} }
  .srcline { font-family:${capF.family}; font-size:20px; font-weight:${capF.weight};
    letter-spacing:${track(lang, '0.06em')}; text-transform:${caps(lang, 'none')};
    color:${C.muted}; margin:40px 0 0 0; ${kobreak} }
  .statrow { display:flex; gap:72px; margin:52px 0 0 0; }
  .stat { display:flex; align-items:flex-end; gap:22px; }
  .statnum { font-family:${numF.family}; font-weight:${numF.weight}; line-height:0.9;
    letter-spacing:${track(lang, '-0.02em')}; white-space:nowrap; }
  .statlab { font-family:${capF.family}; font-size:20px; font-weight:${capF.weight};
    letter-spacing:${track(lang, '0.06em')}; text-transform:${caps(lang, 'none')};
    line-height:1.5; padding-bottom:18px; max-width:320px; ${kobreak} }
  .ev-sup { font-size:${Math.round(24 * tense)}px; line-height:${lh(1.55, lang)}; margin:36px 0 0 0; max-width:1380px; ${kobreak} }
  .findings { list-style:none; margin:44px 0 0 0; padding:0; }
  .findings li { display:flex; gap:24px; padding:0; margin:0 0 30px 0; }
  .findings li:last-child { margin-bottom:0; }
  .fnum { font-family:${numF.family}; font-weight:${numF.weight}; font-size:30px; flex:0 0 96px; color:${C.accent}; }
  .fbody { display:flex; flex-direction:column; gap:8px; }
  .fhead { font-family:${titleF.family}; font-weight:${titleF.weight}; font-size:30px; line-height:1.2; ${kobreak} }
  .fsub { font-size:24px; line-height:${lh(1.55, lang)}; ${kobreak} }
  .zones { display:flex; gap:96px; margin-top:44px; }
  .zone { flex:1 1 0; }
  .zone-h { font-family:${titleF.family}; font-weight:${titleF.weight}; font-size:30px;
    line-height:1.2; margin:0; ${kobreak} }
  .zone ul { list-style:none; margin:20px 0 0 0; padding:0; }
  .zone li { font-size:22px; line-height:1.5;
    padding:0; margin:0 0 20px 0; ${kobreak} }
  .zone li:last-child { margin-bottom:0; }
  .zone li.bad { color:${C.accent}; font-weight:600; }
  .caption { font-size:22px; line-height:1.55; color:${C.muted}; margin:36px 0 0 0; ${kobreak} }
  .ledger { display:grid; grid-template-columns:7em 10em 8em 1fr; column-gap:2.5em;
    margin:32px 0 0 0; line-height:1.35; font-variant-numeric:tabular-nums; }
  .lhead { font-family:${capF.family}; font-weight:${capF.weight}; letter-spacing:${track(lang, '0.06em')};
    text-transform:${caps(lang, 'none')}; color:${C.muted}; font-size:0.86em; padding:0 0 0.9em 0; ${lang === 'ko' ? 'word-break:keep-all;' : ''} }
  .lrow { display:contents; }
  .lrow > .cell { padding:0.42em 0; white-space:nowrap; ${lang === 'ko' ? 'word-break:keep-all;' : ''} }
  .lrow > .cell.case { font-family:${numF.family}; font-weight:${numF.weight}; font-size:0.95em; }
  .lrow.flag > .cell.cost { color:${C.accent}; font-weight:700; }
  .d-foot { font-family:${capF.family}; font-size:18px; font-weight:${capF.weight};
    letter-spacing:${track(lang, '0.06em')}; text-transform:${caps(lang, 'none')};
    color:${C.muted}; margin:22px 0 0 0; ${kobreak} }
  .fx { color:${C.muted}; font-size:0.85em; letter-spacing:0.06em; white-space:nowrap; }
</style>
</head>
<body>
<div class="slide" data-contain="stage">
  <div class="content">
    ${kicker}
    ${metaHtml}
    ${bodyHtml}
  </div>
  <footer class="footer"><p class="ctx" data-t="footer">${esc(footerCtx)}</p><p class="idx" data-t="pageidx"><span class="numeral" data-t="numeral">${nn}</span> / ${tt}</p></footer>
</div>
</body>
</html>
`;
  return { html, notes };
}
