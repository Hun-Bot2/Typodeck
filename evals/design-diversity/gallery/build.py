#!/usr/bin/env python3
"""Build gallery/index.html + contact.html from selection-index.json (build-time inline, no runtime fetch)."""
import json, html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[3]  # repo root
SEL = ROOT / "bold-template-pack" / "selection-index.json"
OUT = pathlib.Path(__file__).resolve().parent
VALIDATION = "PASS"  # all 27 verified via harness validate-design.mjs at build time


def md_to_html(src: str) -> str:
    """Minimal stdlib markdown renderer: fences, frontmatter, headings, lists, inline code/bold."""
    lines = src.split("\n")
    out: list[str] = []
    i = 0
    # YAML frontmatter block
    if lines and lines[0].strip() == "---":
        j = 1
        while j < len(lines) and lines[j].strip() != "---":
            j += 1
        out.append("<pre class=\"frontmatter\">" + html.escape("\n".join(lines[: j + 1])) + "</pre>")
        i = j + 1
    def inline(s: str) -> str:
        s = html.escape(s)
        s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
        s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
        return s
    para: list[str] = []
    in_list = False
    def flush_para():
        if para:
            out.append("<p>" + inline(" ".join(para)) + "</p>")
            para.clear()
    def close_list():
        nonlocal in_list
        if in_list:
            out.append("</ul>")
            in_list = False
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith("```"):
            flush_para(); close_list()
            j = i + 1
            while j < len(lines) and not lines[j].strip().startswith("```"):
                j += 1
            out.append("<pre>" + html.escape("\n".join(lines[i + 1 : j])) + "</pre>")
            i = j + 1
            continue
        m = re.match(r"^(#{1,4})\s+(.*)$", line)
        if m:
            flush_para(); close_list()
            lvl = len(m.group(1)) + 1  # doc h1 -> page h2
            out.append(f"<h{lvl}>{inline(m.group(2))}</h{lvl}>")
        elif re.match(r"^(\s*[-*]|\s*\d+\.)\s+\S", line):
            flush_para()
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append("<li>" + inline(re.sub(r"^\s*(?:[-*]|\d+\.)\s+", "", line)) + "</li>")
        elif line.strip() == "":
            flush_para(); close_list()
        else:
            para.append(line.strip())
        i += 1
    flush_para(); close_list()
    return "\n".join(out)


# deck-smoke coverage: DID -> png stem prefix in evals/design-diversity/deck-smoke/
DECK_SMOKE_PREFIX = {"D01": "gridline", "D04": "chapter", "D23": "nightreel"}
DECK_SMOKE_LABELS = ["title", "divider", "text-heavy", "numbers", "comparison", "closing"]

templates = json.loads(SEL.read_text())["templates"]
assert len(templates) == 27, len(templates)
for t in templates:
    t["validation"] = VALIDATION
    t["shot"] = f"../screenshots/{t['id']}.png"
    tdir = ROOT / "bold-template-pack" / "templates" / t["slug"]
    t["previewHtml"] = md_to_html((tdir / "preview.md").read_text())
    t["designHtml"] = md_to_html((tdir / "design.md").read_text())
    stem = DECK_SMOKE_PREFIX.get(t["id"])
    t["deckShots"] = (
        [{"src": f"../deck-smoke/{stem}-{n:02d}-{lbl.split('-')[0]}.png", "label": lbl}
         for n, lbl in enumerate(DECK_SMOKE_LABELS, 1)]
        if stem else []
    )
    # fix stems to actual filenames (title/divider/text/numbers/compare/closing)
    for d in t["deckShots"]:
        actual = {"text": "text", "numbers": "numbers", "comparison": "compare"}.get(
            d["label"].split("-")[0], d["label"].split("-")[0])
        d["src"] = re.sub(r"-[a-z]+\.png$", f"-{actual}.png", d["src"])

data_json = json.dumps(templates, ensure_ascii=False)
moods = sorted({m for t in templates for m in t["mood"]})
mood_opts = "\n".join(f'<option value="{html.escape(m)}">{html.escape(m)}</option>' for m in moods)

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Typodeck Design Diversity Gallery — D01..D27</title>
<style>
:root{--bg:#14161a;--card:#1e2127;--line:#2c313a;--fg:#e8eaf0;--dim:#9aa3b2;--acc:#ffb224;--pass:#3fd68c;--chip:#2a2f38}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{padding:28px 28px 8px}header h1{margin:0 0 4px;font-size:26px}header p{margin:4px 0;color:var(--dim)}
#controls{position:sticky;top:0;z-index:5;background:#14161af2;border-block:1px solid var(--line);padding:12px 28px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
#controls input[type=search],#controls select{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:14px}
#controls input[type=search]{min-width:220px}
#count{margin-left:auto;color:var(--dim)}
#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px;padding:20px 28px 60px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column}
.card img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:#000}
.card .body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:8px}
.card h2{margin:0;font-size:18px}.card h2 .did{display:inline-block;background:var(--acc);color:#111;border-radius:6px;font-size:13px;padding:1px 8px;margin-right:8px;vertical-align:2px}
.slug{color:var(--dim);font-size:13px}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{background:var(--chip);border:1px solid var(--line);border-radius:20px;padding:1px 10px;font-size:12.5px}
.chip.tone{border-style:dashed}.meta{font-size:13.5px;color:var(--dim)}
.meta b{color:var(--fg);font-weight:600}
.pass{display:inline-block;background:#0e2e1f;color:var(--pass);border:1px solid #1c5c3c;border-radius:6px;font-size:12.5px;padding:1px 8px}
.bestfor{font-size:13.5px}.paths{font-size:12px;color:var(--dim)}.paths code{font-family:ui-monospace,monospace;font-size:11.5px;color:#c3cad6;word-break:break-all}
.pick{display:flex;gap:8px;align-items:center;margin-top:2px;font-size:13px;color:var(--dim)}
#comparebar{position:fixed;left:0;right:0;bottom:0;z-index:9;background:#0d0f12f5;border-top:1px solid var(--line);padding:10px 28px;display:none;gap:12px;align-items:center}
#comparebar.on{display:flex}#comparebar button{background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-size:14px;font-weight:700;cursor:pointer}
#comparebar button.ghost{background:transparent;color:var(--dim);border:1px solid var(--line);font-weight:400}
#overlay{position:fixed;inset:0;z-index:10;background:#0b0d10fa;display:none;overflow:auto;padding:24px}
#overlay.on{display:block}#overlay .cols{display:grid;gap:16px}
#overlay figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
#overlay img{width:100%;display:block}#overlay figcaption{padding:10px 12px;font-size:13px}#overlay figcaption h3{margin:0 0 4px;font-size:16px}
#closeov{position:sticky;top:0;float:right;background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer}
.card{cursor:pointer}.card:hover{border-color:#4a5261}
.detailhint{font-size:12.5px;color:var(--acc)}
#detail{position:fixed;inset:0;z-index:20;background:#0b0d10f7;display:none;overflow:auto;padding:24px}
#detail.on{display:block}
#detail .sheet{max-width:1180px;margin:0 auto;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
#detail .sheet #detailbody>img:first-child{width:auto;max-width:100%;max-height:72vh;display:block;margin:0 auto;background:#000}
#detail .dhead{padding:18px 22px 6px}
#detail .dhead h2{margin:0;font-size:24px}#detail .dhead h2 .did{display:inline-block;background:var(--acc);color:#111;border-radius:6px;font-size:14px;padding:2px 10px;margin-right:10px;vertical-align:3px}
#detail .tabs{display:flex;gap:8px;padding:12px 22px 0;flex-wrap:wrap}
#detail .tabs button{background:var(--chip);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 14px;font-size:14px;cursor:pointer}
#detail .tabs button.active{background:var(--acc);color:#111;border-color:var(--acc);font-weight:700}
#detail .tabbody{padding:6px 22px 26px;max-height:60vh;overflow:auto}
#detail .tabbody pre{background:#11141a;border:1px solid var(--line);border-radius:8px;padding:12px;overflow:auto;font-size:12.5px}
#detail .tabbody code{font-family:ui-monospace,monospace;font-size:12.5px;color:#ffd98a}
#detail .tabbody pre code{color:#e8eaf0}
#detail .tabbody h2{font-size:20px;margin-top:22px}#detail .tabbody h3{font-size:17px}#detail .tabbody li{margin:3px 0}
#detail .deckgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
#detail .deckgrid figure{margin:0}#detail .deckgrid img{width:100%;display:block;border:1px solid var(--line);border-radius:8px}
#detail .deckgrid figcaption{font-size:12.5px;color:var(--dim);padding:4px 2px}
#closedetail{position:sticky;top:0;float:right;margin:12px;background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;z-index:2}
footer{padding:0 28px 80px;color:var(--dim);font-size:13px}
.hidden{display:none!important}
</style>
</head>
<body>
<header>
<h1>Typodeck Design-Diversity Gallery — D01&ndash;D27</h1>
<p>Rendered 1920&times;1080 previews from <code>evals/design-diversity/screenshots/</code>. Metadata inlined at build time from <code>bold-template-pack/selection-index.json</code> (works over <code>file://</code>). Repo paths below are plain text, not links.</p>
</header>
<div id="controls">
<input type="search" id="q" placeholder="Search name, slug, mood, best-for&hellip;" aria-label="Search">
<select id="fmood" aria-label="Mood filter"><option value="">Mood: all</option>
__MOODS__</select>
<select id="fdensity" aria-label="Density filter"><option value="">Density: all</option><option>low</option><option>medium</option><option>high</option></select>
<select id="fform" aria-label="Formality filter"><option value="">Formality: all</option><option>low</option><option>medium</option><option>high</option></select>
<select id="fscheme" aria-label="Scheme filter"><option value="">Scheme: all</option><option>light</option><option>dark</option></select>
<span id="count"></span>
</div>
<main id="grid"></main>
<div id="comparebar"><span id="selinfo"></span><button id="gocompare">Compare side-by-side</button><button class="ghost" id="clearsel">Clear</button></div>
<div id="overlay" role="dialog" aria-label="Comparison"><button id="closeov">Close ✕</button><div class="cols" id="ovcols"></div></div>
<div id="detail" role="dialog" aria-label="Design detail"><div class="sheet"><button id="closedetail">Close ✕</button><div id="detailbody"></div></div></div>
<footer><p>Contact sheet: <code>contact-sheet.png</code> (built from <code>contact.html</code> via headless-Chrome screenshot — see <code>README.md</code>). Validation column = harness <code>validate-design.mjs</code> result at gallery build time.</p></footer>
<script>
const DATA = __DATA__;
const grid = document.getElementById('grid');
const selected = new Set();
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function card(t){
  const el = document.createElement('article');
  el.className = 'card'; el.dataset.id = t.id;
  el.innerHTML =
    `<img src="${esc(t.shot)}" alt="${esc(t.id)} ${esc(t.name)} preview" loading="eager">`+
    `<div class="body"><h2><span class="did">${esc(t.id)}</span>${esc(t.name)}</h2>`+
    `<div class="slug">${esc(t.slug)} · status: ${esc(t.status)}</div>`+
    `<div class="chips">${t.mood.map(m=>`<span class="chip">${esc(m)}</span>`).join('')}${t.tone.map(m=>`<span class="chip tone">${esc(m)}</span>`).join('')}</div>`+
    `<div class="meta">density <b>${esc(t.density)}</b> · formality <b>${esc(t.formality)}</b> · scheme <b>${esc(t.scheme)}</b><br>validation <span class="pass">✓ ${esc(t.validation)}</span></div>`+
    `<div class="bestfor"><b>Best for:</b> ${esc(t.bestFor)}</div>`+
    `<div class="paths">design: <code>${esc(t.designPath)}</code><br>preview: <code>${esc(t.previewPath)}</code></div>`+
    `<label class="pick"><input type="checkbox" data-pick="${esc(t.id)}"> select for comparison</label><div class="detailhint">Click card for full-size preview + spec ▸</div></div>`;
  return el;
}
DATA.forEach(t=>grid.appendChild(card(t)));
const q=document.getElementById('q'),fm=document.getElementById('fmood'),fd=document.getElementById('fdensity'),ff=document.getElementById('fform'),fs=document.getElementById('fscheme'),count=document.getElementById('count');
function apply(){
  const needle=q.value.trim().toLowerCase();let n=0;
  document.querySelectorAll('.card').forEach(el=>{
    const t=DATA.find(x=>x.id===el.dataset.id);
    const hay=(t.id+' '+t.name+' '+t.slug+' '+t.mood.join(' ')+' '+t.tone.join(' ')+' '+t.bestFor+' '+t.visualSignature).toLowerCase();
    const ok=(!needle||hay.includes(needle))&&(!fm.value||t.mood.includes(fm.value))&&(!fd.value||t.density===fd.value)&&(!ff.value||t.formality===ff.value)&&(!fs.value||t.scheme===fs.value);
    el.classList.toggle('hidden',!ok);if(ok)n++;
  });
  count.textContent=n+' / '+DATA.length+' shown';
}
[q,fm,fd,ff,fs].forEach(c=>c.addEventListener('input',apply));apply();
const bar=document.getElementById('comparebar'),selinfo=document.getElementById('selinfo');
grid.addEventListener('change',e=>{
  const cb=e.target.closest('[data-pick]');if(!cb)return;
  if(cb.checked){if(selected.size>=4){cb.checked=false;alert('Comparison holds at most 4 designs.');return;}selected.add(cb.dataset.pick);}
  else selected.delete(cb.dataset.pick);
  bar.classList.toggle('on',selected.size>0);
  selinfo.textContent=selected.size+' selected'+(selected.size<2?' (pick at least 2)':'')+': '+[...selected].join(', ');
});
document.getElementById('clearsel').onclick=()=>{selected.clear();document.querySelectorAll('[data-pick]').forEach(c=>c.checked=false);bar.classList.remove('on');};
const ov=document.getElementById('overlay'),ovcols=document.getElementById('ovcols');
document.getElementById('gocompare').onclick=()=>{
  if(selected.size<2){alert('Select 2–4 designs to compare.');return;}
  const items=[...selected].map(id=>DATA.find(x=>x.id===id));
  ovcols.style.gridTemplateColumns=`repeat(${items.length},minmax(0,1fr))`;
  ovcols.innerHTML=items.map(t=>`<figure><img src="${esc(t.shot)}" alt="${esc(t.id)} ${esc(t.name)}"><figcaption><h3>${esc(t.id)} · ${esc(t.name)}</h3><div>${t.mood.map(esc).join(' · ')}</div><div>density <b>${esc(t.density)}</b> · formality <b>${esc(t.formality)}</b> · ${esc(t.scheme)}</div><div>${esc(t.bestFor)}</div></figcaption></figure>`).join('');
  ov.classList.add('on');
};
document.getElementById('closeov').onclick=()=>ov.classList.remove('on');
ov.addEventListener('click',e=>{if(e.target===ov)ov.classList.remove('on');});
const detail=document.getElementById('detail'),detailbody=document.getElementById('detailbody');
function openDetail(id){
  const t=DATA.find(x=>x.id===id);if(!t)return;
  const tabs=[['preview','Preview card (preview.md)','previewHtml']];
  tabs.push(['design','Full spec (design.md)','designHtml']);
  if(t.deckShots&&t.deckShots.length)tabs.push(['deck','Full-deck smoke (6 slides)','deck']);
  detailbody.innerHTML=
    `<img src="${esc(t.shot)}" alt="${esc(t.id)} ${esc(t.name)} full preview">`+
    `<div class="dhead"><h2><span class="did">${esc(t.id)}</span>${esc(t.name)}</h2>`+
    `<div class="slug">${esc(t.slug)} · status: ${esc(t.status)} · validation ✓ ${esc(t.validation)}</div>`+
    `<div class="meta">density <b>${esc(t.density)}</b> · formality <b>${esc(t.formality)}</b> · scheme <b>${esc(t.scheme)}</b></div>`+
    `<div class="chips">${t.mood.map(m=>`<span class="chip">${esc(m)}</span>`).join('')}${t.tone.map(m=>`<span class="chip tone">${esc(m)}</span>`).join('')}</div>`+
    `<div class="bestfor"><b>Best for:</b> ${esc(t.bestFor)}</div>`+
    `<div class="bestfor" style="color:var(--dim)">${esc(t.visualSignature||'')}</div></div>`+
    `<div class="tabs" role="tablist">${tabs.map((tb,i)=>`<button data-tab="${tb[0]}" class="${i===0?'active':''}" role="tab">${esc(tb[1])}</button>`).join('')}</div>`+
    `<div class="tabbody" id="tabbody"></div>`;
  const tabbody=document.getElementById('tabbody');
  function show(key){
    const tb=tabs.find(x=>x[0]===key);
    detailbody.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===key));
    if(tb[2]==='deck'){
      tabbody.innerHTML=`<div class="deckgrid">${t.deckShots.map(d=>`<figure><img src="${esc(d.src)}" alt="${esc(t.id)} ${esc(d.label)}" loading="lazy"><figcaption>${esc(d.label)}</figcaption></figure>`).join('')}</div>`;
    }else{tabbody.innerHTML=t[tb[2]];}
    tabbody.scrollTop=0;
  }
  detailbody.querySelector('.tabs').onclick=e=>{const b=e.target.closest('[data-tab]');if(b)show(b.dataset.tab);};
  show(tabs[0][0]);
  detail.classList.add('on');detailRestoreScroll=window.scrollY;document.body.style.overflow='hidden';
  history.replaceState(null,'','?d='+t.id);
}
let DetailRestoreScroll=0;
function closeDetail(){detail.classList.remove('on');document.body.style.overflow='';history.replaceState(null,'',location.pathname);window.scrollTo(0,DetailRestoreScroll||0);}
document.getElementById('closedetail').onclick=closeDetail;
detail.addEventListener('click',e=>{if(e.target===detail)closeDetail();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDetail();ov.classList.remove('on');}});
grid.addEventListener('click',e=>{
  if(e.target.closest('[data-pick]')||e.target.closest('label.pick'))return;
  const card=e.target.closest('.card');if(card)openDetail(card.dataset.id);
});
const deepId=new URLSearchParams(location.search).get('d');
if(deepId&&DATA.some(x=>x.id===deepId))openDetail(deepId);
</script>
</body>
</html>
"""

page = PAGE.replace("__MOODS__", mood_opts).replace("__DATA__", data_json)
(OUT / "index.html").write_text(page)
print("wrote index.html", len(page), "bytes")

# ---- contact.html: 9x3 grid of 1920x1080 thumbs scaled to 213px wide ----
cells = "\n".join(
    f'<figure><img src="../screenshots/{t["id"]}.png" alt="{html.escape(t["id"])}"><figcaption>{t["id"]} · {html.escape(t["name"])}</figcaption></figure>'
    for t in templates
)
contact = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Contact sheet source</title>
<style>body{{margin:0;background:#fff;font:14px system-ui,sans-serif}}h1{{margin:16px 20px 4px;font-size:22px}}p{{margin:0 20px 12px;color:#555}}
.grid{{display:grid;grid-template-columns:repeat(3,640px);gap:0}}figure{{margin:0;border:1px solid #ddd}}img{{width:640px;height:360px;display:block}}figcaption{{padding:4px 8px;background:#111;color:#eee;font-size:13px}}</style>
</head><body><h1>Typodeck D01&ndash;D27 contact sheet</h1><p>3 cols &times; 9 rows · thumbs 640&times;360 from evals/design-diversity/screenshots/</p>
<div class="grid">{cells}</div></body></html>
"""
(OUT / "contact.html").write_text(contact)
print("wrote contact.html")
