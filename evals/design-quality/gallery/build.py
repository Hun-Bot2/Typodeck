#!/usr/bin/env python3
"""Build gallery/index.html from classification.json + selection-index.json.

Build-time inline, zero runtime fetch: all metadata is embedded as JSON so
the page works over file://. Serve root is evals/design-quality/, so image
paths are relative (../specimens/... from gallery/index.html).
"""
import json
import html
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
DQ = HERE.parent  # evals/design-quality (serve root)
ROOT = DQ.parents[1]  # repo root
CLASSIFICATION = DQ / "audit" / "classification.json"
SEL = ROOT / "typo-pack" / "selection-index.json"

SLIDE_LABELS = [
    ("slide-01-cover", "01 cover"),
    ("slide-02-divider", "02 divider"),
    ("slide-03-statement", "03 statement"),
    ("slide-04-evidence", "04 evidence"),
    ("slide-05-comparison", "05 comparison"),
    ("slide-06-dense", "06 dense"),
    ("slide-07-closing", "07 closing"),
]

clf = json.loads(CLASSIFICATION.read_text())["designs"]
sel = {t["id"]: t for t in json.loads(SEL.read_text())["templates"]}
assert len(clf) == 27, len(clf)

designs = []
for c in clf:
    t = sel[c["did"]]
    assert t["slug"] == c["slug"], (c["did"], t["slug"], c["slug"])
    slug = c["slug"]
    missing: list[str] = []

    def rel(p: pathlib.Path, label: str) -> str | None:
        rp = p.relative_to(DQ).as_posix()
        if not p.exists():
            missing.append(label)
            return None
        return "../" + rp

    cover = rel(DQ / "specimens" / slug / "cover.png", "cover")
    evidence = rel(DQ / "specimens" / slug / "evidence.png", "evidence")
    explanation = rel(DQ / "specimens" / slug / "explanation.png", "explanation")
    deck = None
    deck_html = DQ / "full-decks" / slug / "deck.html"
    if deck_html.exists():
        slides = []
        for stem, label in SLIDE_LABELS:
            sp = DQ / "full-decks" / slug / "slides" / f"{stem}.png"
            rp = sp.relative_to(DQ).as_posix()
            if not sp.exists():
                missing.append(stem)
                continue
            slides.append({"src": "../" + rp, "label": label})
        deck = {"html": "../" + deck_html.relative_to(DQ).as_posix(), "slides": slides}
    designs.append({
        "id": c["did"], "slug": slug, "name": t["name"],
        "leaning": c["leaning"], "status": t["status"],
        "mood": t["mood"], "tone": t["tone"],
        "density": t["density"], "formality": t["formality"],
        "scheme": t["scheme"], "bestFor": t["bestFor"],
        "avoidFor": t["avoidFor"], "contentTypes": t["contentTypes"],
        "visualSignature": t["visualSignature"],
        "rationale": c.get("rationale", ""), "notes": c.get("notes", ""),
        "strongest": c.get("strongest_dimension", ""),
        "weakest": c.get("weakest_dimension", ""),
        "cover": cover, "evidence": evidence, "explanation": explanation,
        "deck": deck, "missing": missing,
    })

n_deck = sum(1 for d in designs if d["deck"])
n_missing = sum(1 for d in designs if d["missing"])
print(f"designs={len(designs)} full_decks={n_deck} with_missing={n_missing}")
for d in designs:
    if d["missing"]:
        print(f"  MISSING {d['id']} {d['slug']}: {d['missing']}")

data_json = json.dumps(designs, ensure_ascii=False)
moods = sorted({m for d in designs for m in d["mood"]})
mood_opts = "\n".join(
    f'<option value="{html.escape(m)}">{html.escape(m)}</option>' for m in moods
)

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Typodeck Design-Quality Gallery &mdash; D01..D27</title>
<style>
:root{--bg:#14161a;--card:#1e2127;--line:#2c313a;--fg:#e8eaf0;--dim:#9aa3b2;--acc:#ffb224;--pass:#3fd68c;--chip:#2a2f38;--core:#7cc4ff;--spec:#d3a6ff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
header{padding:28px 28px 8px}header h1{margin:0 0 4px;font-size:26px}header p{margin:4px 0;color:var(--dim)}
header code{font-family:ui-monospace,monospace;font-size:12.5px;color:#c3cad6}
#controls{position:sticky;top:0;z-index:5;background:#14161af2;border-block:1px solid var(--line);padding:12px 28px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
#controls input[type=search],#controls input[type=text],#controls select{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:14px}
#controls input[type=search]{min-width:200px}#controls input[type=text]{min-width:160px}
#controls .spacer{flex:1}
#controls button{background:var(--chip);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:8px 12px;font-size:13.5px;cursor:pointer}
#controls button:hover{border-color:var(--acc)}
#count{color:var(--dim);white-space:nowrap}
#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px;padding:20px 28px 60px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;cursor:pointer}
.card:hover{border-color:#4a5261}
.card img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:#000}
.card .missingimg{width:100%;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;background:#2a1215;color:#ff9a9a;font-size:14px}
.card .body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:8px}
.card h2{margin:0;font-size:18px}.card h2 .did{display:inline-block;background:var(--acc);color:#111;border-radius:6px;font-size:13px;padding:1px 8px;margin-right:8px;vertical-align:2px}
.slug{color:var(--dim);font-size:13px}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{background:var(--chip);border:1px solid var(--line);border-radius:20px;padding:1px 10px;font-size:12.5px}
.chip.tone{border-style:dashed}
.chip.lean-core{border-color:var(--core);color:var(--core)}.chip.lean-spec{border-color:var(--spec);color:var(--spec)}
.meta{font-size:13.5px;color:var(--dim)}.meta b{color:var(--fg);font-weight:600}
.pass{display:inline-block;background:#0e2e1f;color:var(--pass);border:1px solid #1c5c3c;border-radius:6px;font-size:12.5px;padding:1px 8px}
.warn{display:inline-block;background:#2a1215;color:#ff9a9a;border:1px solid #5c1c1c;border-radius:6px;font-size:12.5px;padding:1px 8px}
.positioning{font-size:13.5px}.positioning b{font-weight:600}
.deckflag{font-size:12.5px;color:var(--acc)}
.verdict{font-size:12.5px;border-radius:6px;padding:1px 8px;border:1px solid var(--line);color:var(--dim)}
.verdict.v-approve-core{background:#0e2e1f;color:var(--pass);border-color:#1c5c3c}
.verdict.v-specialized{background:#1a2340;color:var(--core);border-color:#2c4a7c}
.verdict.v-needs-refinement{background:#2e230e;color:var(--acc);border-color:#5c4a1c}
.verdict.v-reject{background:#2a1215;color:#ff9a9a;border-color:#5c1c1c}
.pick{display:flex;gap:8px;align-items:center;margin-top:2px;font-size:13px;color:var(--dim)}
.detailhint{font-size:12.5px;color:var(--acc)}
#comparebar{position:fixed;left:0;right:0;bottom:0;z-index:9;background:#0d0f12f5;border-top:1px solid var(--line);padding:10px 28px;display:none;gap:12px;align-items:center;flex-wrap:wrap}
#comparebar.on{display:flex}#comparebar button{background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-size:14px;font-weight:700;cursor:pointer;color:#111}
#comparebar button.ghost{background:transparent;color:var(--dim);border:1px solid var(--line);font-weight:400}
#overlay{position:fixed;inset:0;z-index:10;background:#0b0d10fa;display:none;overflow:auto;padding:24px}
#overlay.on{display:block}#overlay .cols{display:grid;gap:16px}
#overlay figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
#overlay figure img.shot{width:100%;display:block}
#overlay figcaption{padding:10px 12px;font-size:13px;display:flex;flex-direction:column;gap:6px}
#overlay figcaption h3{margin:0;font-size:16px}
#closeov{position:sticky;top:0;float:right;background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;color:#111}
#detail{position:fixed;inset:0;z-index:20;background:#0b0d10f7;display:none;overflow:auto;padding:24px}
#detail.on{display:block}
#detail .sheet{max-width:1280px;margin:0 auto;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
#detail .sheetimg{width:100%;display:block;background:#000}
#detail .dhead{padding:18px 22px 6px;display:flex;flex-direction:column;gap:8px}
#detail .dhead h2{margin:0;font-size:24px}#detail .dhead h2 .did{display:inline-block;background:var(--acc);color:#111;border-radius:6px;font-size:14px;padding:2px 10px;margin-right:10px;vertical-align:3px}
#detail .tabs{display:flex;gap:8px;padding:12px 22px 0;flex-wrap:wrap}
#detail .tabs button{background:var(--chip);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 14px;font-size:14px;cursor:pointer}
#detail .tabs button.active{background:var(--acc);color:#111;border-color:var(--acc);font-weight:700}
#detail .tabbody{padding:12px 22px 26px}
#detail .tabbody img.full{width:100%;display:block;border:1px solid var(--line);border-radius:8px;background:#000}
#closedetail{position:sticky;top:0;float:right;margin:12px;background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;z-index:2;color:#111}
.dnav{display:flex;gap:8px;align-items:center;padding:10px 22px 0;flex-wrap:wrap}
.dnav button{background:var(--chip);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 14px;font-size:14px;cursor:pointer}
.dnav button:hover{border-color:var(--acc)}
.dnav .pos{margin-left:auto;color:var(--dim);font-size:13px}
.filmstrip{display:flex;gap:8px;overflow-x:auto;padding:12px 0 4px}
.filmstrip img{width:168px;aspect-ratio:16/9;object-fit:cover;border:2px solid var(--line);border-radius:6px;cursor:pointer;background:#000;flex:none}
.filmstrip img.cur{border-color:var(--acc)}
.filmstrip figure{margin:0;text-align:center;font-size:11.5px;color:var(--dim);flex:none}
.deckmain{position:relative}
.deckcap{display:flex;gap:10px;align-items:center;margin-top:8px;font-size:13.5px;color:var(--dim);flex-wrap:wrap}
.deckcap a{color:var(--acc)}
.review{border-top:1px solid var(--line);margin-top:14px;padding:14px 22px 22px;display:flex;flex-direction:column;gap:10px}
.review h3{margin:0;font-size:16px}
.review .opts{display:flex;gap:8px;flex-wrap:wrap}
.review label.rv{background:var(--chip);border:1px solid var(--line);border-radius:8px;padding:6px 12px;font-size:13.5px;cursor:pointer}
.review label.rv:has(input:checked){border-color:var(--acc);background:#2e230e}
.review textarea{background:#11141a;color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:13.5px;min-height:64px;width:100%;font-family:inherit}
.review .saved{font-size:12.5px;color:var(--dim)}
.mini-review{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.mini-review select{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:6px;padding:4px 6px;font-size:12.5px}
footer{padding:0 28px 90px;color:var(--dim);font-size:13px}
.hidden{display:none!important}
</style>
</head>
<body>
<header>
<h1>Typodeck Design-Quality Gallery &mdash; D01&ndash;D27</h1>
<p>Specimen renders from <code>specimens/&lt;slug&gt;/{cover,evidence,explanation}.png</code>, full decks from <code>full-decks/&lt;slug&gt;/</code>. Metadata inlined at build time (works over <code>file://</code>). Serve root is <code>evals/design-quality/</code>.</p>
</header>
<div id="controls">
<input type="search" id="q" placeholder="Search name, slug, notes&hellip;" aria-label="Search">
<select id="flean" aria-label="Category filter"><option value="">Category: all</option><option>Core</option><option>Specialized</option></select>
<select id="fmood" aria-label="Mood filter"><option value="">Mood: all</option>
__MOODS__</select>
<select id="fdensity" aria-label="Density filter"><option value="">Density: all</option><option>low</option><option>medium</option><option>high</option></select>
<input type="text" id="fpurpose" placeholder="Purpose (best-for)&hellip;" aria-label="Purpose filter">
<select id="frev" aria-label="Review filter"><option value="">Review: all</option><option value="unreviewed">Unreviewed</option><option value="approve-core">Approve-Core</option><option value="specialized">Specialized</option><option value="needs-refinement">Needs-refinement</option><option value="reject">Reject</option></select>
<span id="count"></span>
<span class="spacer"></span>
<button id="exportbtn" title="Download reviews JSON (timestamped, never overwrites)">Export reviews</button>
<button id="importbtn" title="Import a reviews JSON; merges by timestamp, never silently overwrites">Import</button>
<input type="file" id="importfile" accept="application/json" class="hidden">
</div>
<main id="grid"></main>
<div id="comparebar"><span id="selinfo"></span><button id="gocompare">Compare side-by-side</button><button class="ghost" id="clearsel">Clear</button></div>
<div id="overlay" role="dialog" aria-label="Comparison"><button id="closeov">Close &#10005;</button><div class="cols" id="ovcols"></div></div>
<div id="detail" role="dialog" aria-label="Design detail"><div class="sheet"><button id="closedetail">Close &#10005;</button><div id="detailbody"></div></div></div>
<footer><p>Rebuild with <code>python3 build.py</code> in this directory. Owner reviews persist to <code>localStorage</code> (<code>typodeck-dq-reviews-v1</code>); Export downloads a timestamped JSON merge of all reviews.</p></footer>
<script>
const DATA = __DATA__;
const VERDICTS = [["","Unreviewed"],["approve-core","Approve-Core"],["specialized","Specialized"],["needs-refinement","Needs-refinement"],["reject","Reject"]];
const VLABEL = Object.fromEntries(VERDICTS);
const LSKEY = "typodeck-dq-reviews-v1";
let reviews = {};
try { reviews = JSON.parse(localStorage.getItem(LSKEY) || "{}"); } catch (e) { reviews = {}; }
function saveReviews() { try { localStorage.setItem(LSKEY, JSON.stringify(reviews)); } catch (e) { /* private mode */ } }
function getReview(id) { return reviews[id] || { verdict: "", notes: "", updatedAt: "" }; }
function setReview(id, verdict, notes) {
  reviews[id] = { verdict: verdict || "", notes: notes || "", updatedAt: new Date().toISOString() };
  saveReviews(); refreshVerdictBadges(id);
}
function refreshVerdictBadges(id) {
  const r = getReview(id);
  document.querySelectorAll(`[data-vbadge="${id}"]`).forEach(el => {
    el.className = "verdict" + (r.verdict ? " v-" + r.verdict : "");
    el.textContent = r.verdict ? VLABEL[r.verdict] : "Unreviewed";
  });
  apply();
}
function esc(s){return String(s == null ? "" : s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function imgOrPlaceholder(src, alt, cls) {
  if (src) return `<img src="${esc(src)}" alt="${esc(alt)}" class="${cls || ""}" loading="eager">`;
  return `<div class="missingimg">missing render: ${esc(alt)}</div>`;
}
function verdictBadge(id) {
  const r = getReview(id);
  return `<span class="verdict${r.verdict ? " v-" + r.verdict : ""}" data-vbadge="${esc(id)}">${esc(r.verdict ? VLABEL[r.verdict] : "Unreviewed")}</span>`;
}
const grid = document.getElementById('grid');
const selected = new Set();
function card(t) {
  const el = document.createElement('article');
  el.className = 'card'; el.dataset.id = t.id;
  const leanCls = t.leaning === 'Core' ? 'lean-core' : 'lean-spec';
  const gate = t.missing.length
    ? `<span class="warn">missing: ${esc(t.missing.join(', '))}</span>`
    : `<span class="pass">\\u2713 specimens PASS</span>`;
  el.innerHTML =
    imgOrPlaceholder(t.cover, t.id + ' ' + t.name + ' cover') +
    `<div class="body"><h2><span class="did">${esc(t.id)}</span>${esc(t.name)}</h2>` +
    `<div class="slug">${esc(t.slug)} \\u00b7 status: ${esc(t.status)}</div>` +
    `<div class="chips"><span class="chip ${leanCls}">${esc(t.leaning)}</span>` +
    t.mood.map(m=>`<span class="chip">${esc(m)}</span>`).join('') +
    t.tone.map(m=>`<span class="chip tone">${esc(m)}</span>`).join('') + `</div>` +
    `<div class="positioning"><b>Best for:</b> ${esc(t.bestFor)}</div>` +
    `<div class="positioning" style="color:var(--dim)">${esc(t.rationale)}</div>` +
    `<div class="meta">density <b>${esc(t.density)}</b> \\u00b7 formality <b>${esc(t.formality)}</b> \\u00b7 scheme <b>${esc(t.scheme)}</b><br>${gate} ${verdictBadge(t.id)}</div>` +
    (t.deck ? `<div class="deckflag">\\u25b6 full deck: 7 slides</div>` : ``) +
    `<label class="pick"><input type="checkbox" data-pick="${esc(t.id)}"> select for comparison</label><div class="detailhint">Click card for Cover / Evidence / Explanation + review \\u25b8</div></div>`;
  return el;
}
DATA.forEach(t=>grid.appendChild(card(t)));
const q=document.getElementById('q'),fl=document.getElementById('flean'),fm=document.getElementById('fmood'),
      fd=document.getElementById('fdensity'),fp=document.getElementById('fpurpose'),fr=document.getElementById('frev'),
      count=document.getElementById('count');
function apply(){
  const needle=q.value.trim().toLowerCase(), purpose=fp.value.trim().toLowerCase();
  let n=0;
  document.querySelectorAll('.card').forEach(el=>{
    const t=DATA.find(x=>x.id===el.dataset.id);
    const hay=(t.id+' '+t.name+' '+t.slug+' '+t.mood.join(' ')+' '+t.tone.join(' ')+' '+t.rationale+' '+t.notes+' '+t.visualSignature).toLowerCase();
    const r=getReview(t.id);
    const ok=(!needle||hay.includes(needle))&&(!fl.value||t.leaning===fl.value)&&
      (!fm.value||t.mood.includes(fm.value))&&(!fd.value||t.density===fd.value)&&
      (!purpose||t.bestFor.toLowerCase().includes(purpose))&&
      (!fr.value||(fr.value==='unreviewed' ? !r.verdict : r.verdict===fr.value));
    el.classList.toggle('hidden',!ok);if(ok)n++;
  });
  count.textContent=n+' / '+DATA.length+' shown';
}
[q,fl,fm,fd,fp,fr].forEach(c=>c.addEventListener('input',apply));apply();
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
  if(selected.size<2){alert('Select 2\\u20134 designs to compare.');return;}
  const items=[...selected].map(id=>DATA.find(x=>x.id===id));
  ovcols.style.gridTemplateColumns=`repeat(${items.length},minmax(0,1fr))`;
  ovcols.innerHTML=items.map(t=>{
    const r=getReview(t.id);
    return `<figure>${imgOrPlaceholder(t.cover, t.id+' '+t.name, 'shot')}<figcaption><h3>${esc(t.id)} \\u00b7 ${esc(t.name)}</h3>`+
    `<div>${esc(t.leaning)} \\u00b7 density <b>${esc(t.density)}</b> \\u00b7 ${esc(t.scheme)}</div>`+
    `<div>${esc(t.bestFor)}</div><div style="color:var(--dim)">${esc(t.rationale)}</div>`+
    `<div class="mini-review"><select data-cmp-verdict="${esc(t.id)}" aria-label="Verdict for ${esc(t.id)}">`+
    VERDICTS.map(([v,l])=>`<option value="${v}"${r.verdict===v?' selected':''}>${esc(l)}</option>`).join('')+
    `</select>${verdictBadge(t.id)}</div>`+
    `<div style="color:var(--dim);font-size:12.5px">${r.notes?esc(r.notes):'no owner notes yet \\u2014 open detail to add'}</div>`+
    `<div><button data-cmp-open="${esc(t.id)}" style="background:var(--chip);color:var(--fg);border:1px solid var(--line);border-radius:6px;padding:4px 10px;cursor:pointer">Open detail \\u25b8</button></div>`+
    `</figcaption></figure>`;
  }).join('');
  ov.classList.add('on');
};
ovcols.addEventListener('change',e=>{
  const s=e.target.closest('[data-cmp-verdict]');if(!s)return;
  const r=getReview(s.dataset.cmpVerdict);
  setReview(s.dataset.cmpVerdict, s.value, r.notes);
});
ovcols.addEventListener('click',e=>{
  const b=e.target.closest('[data-cmp-open]');if(!b)return;
  ov.classList.remove('on');openDetail(b.dataset.cmpOpen);
});
document.getElementById('closeov').onclick=()=>ov.classList.remove('on');
ov.addEventListener('click',e=>{if(e.target===ov)ov.classList.remove('on');});
const detail=document.getElementById('detail'),detailbody=document.getElementById('detailbody');
let detailSeq=[],deckIdx=0,curTab='cover',curId=null;
function visibleSeq(){
  const ids=[...document.querySelectorAll('#grid .card:not(.hidden)')].map(el=>el.dataset.id);
  return ids.length?ids:DATA.map(t=>t.id);
}
function setQuery(params) {
  try {
    const u = new URL(location.href);
    u.search = new URLSearchParams(params).toString();
    history.replaceState(null, '', u.search ? '?' + u.search : location.pathname);
  } catch (e) { /* file:// may reject replaceState */ }
}
function tabsFor(t) {
  const tabs=[['cover','Cover'],['evidence','Evidence'],['explanation','Explanation']];
  if(t.deck&&t.deck.slides.length)tabs.push(['deck','Full deck ('+t.deck.slides.length+' slides)']);
  return tabs;
}
function openDetail(id, tab){
  const t=DATA.find(x=>x.id===id);if(!t)return;
  curId=id;deckIdx=0;
  detailSeq=visibleSeq();
  if(!detailSeq.includes(id))detailSeq=DATA.map(x=>x.id);
  const pos=detailSeq.indexOf(id);
  const tabs=tabsFor(t);
  curTab=(tab&&tabs.some(x=>x[0]===tab))?tab:'cover';
  const leanCls=t.leaning==='Core'?'lean-core':'lean-spec';
  const r=getReview(id);
  detailbody.innerHTML=
    `<div class="dhead"><h2><span class="did">${esc(t.id)}</span>${esc(t.name)}</h2>`+
    `<div class="slug">${esc(t.slug)} \\u00b7 status: ${esc(t.status)} \\u00b7 `+
    (t.missing.length?`<span class="warn">missing: ${esc(t.missing.join(', '))}</span>`:`<span class="pass">\\u2713 renders verified</span>`)+` ${verdictBadge(t.id)}</div>`+
    `<div class="chips"><span class="chip ${leanCls}">${esc(t.leaning)}</span>`+
    t.mood.map(m=>`<span class="chip">${esc(m)}</span>`).join('')+t.tone.map(m=>`<span class="chip tone">${esc(m)}</span>`).join('')+`</div>`+
    `<div class="positioning"><b>Best for:</b> ${esc(t.bestFor)} &nbsp;\\u00b7&nbsp; <b>Avoid for:</b> ${esc(t.avoidFor)}</div>`+
    `<div class="positioning" style="color:var(--dim)">${esc(t.rationale)}</div>`+
    `<div class="meta">density <b>${esc(t.density)}</b> \\u00b7 formality <b>${esc(t.formality)}</b> \\u00b7 scheme <b>${esc(t.scheme)}</b> \\u00b7 strongest <b>${esc(t.strongest)}</b> \\u00b7 weakest <b>${esc(t.weakest)}</b></div>`+
    `<div class="meta">content types: ${t.contentTypes.map(esc).join(', ')}</div></div>`+
    `<div class="dnav"><button data-nav="-1">\\u25c0 Prev</button><button data-nav="1">Next \\u25b6</button><span class="pos">${pos+1} / ${detailSeq.length} (\\u2190/\\u2191/\\u2193/\\u2192, Esc)</span></div>`+
    `<div class="tabs" role="tablist">${tabs.map(tb=>`<button data-tab="${tb[0]}" class="${tb[0]===curTab?'active':''}" role="tab">${esc(tb[1])}</button>`).join('')}</div>`+
    `<div class="tabbody" id="tabbody"></div>`+
    `<div class="review"><h3>Owner review \\u2014 ${esc(t.id)} ${esc(t.name)}</h3>`+
    `<div class="opts" role="radiogroup">${VERDICTS.map(([v,l])=>`<label class="rv"><input type="radio" name="rv" value="${v}"${r.verdict===v?' checked':''}> ${esc(l)}</label>`).join('')}</div>`+
    `<textarea id="rvnotes" placeholder="Owner notes (autosaved to this browser)\\u2026">${esc(r.notes)}</textarea>`+
    `<div class="saved" id="rvsaved">${r.updatedAt?'Last saved '+esc(r.updatedAt):'Not reviewed yet'}</div></div>`;
  const tabbody=document.getElementById('tabbody');
  function show(key){
    curTab=key;
    detailbody.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===key));
    if(key==='deck'){deckIdx=0;renderDeck();}
    else if(t[key]){tabbody.innerHTML=`<img class="full" src="${esc(t[key])}" alt="${esc(t.id)} ${esc(key)} full-size">`;}
    else{tabbody.innerHTML=`<div class="missingimg">missing render: ${esc(t.id)} ${esc(key)}</div>`;}
    tabbody.scrollTop=0;setQuery({d:t.id,tab:key});
  }
  function renderDeck(){
    const slides=t.deck.slides;
    deckIdx=Math.max(0,Math.min(deckIdx,slides.length-1));
    const s=slides[deckIdx];
    tabbody.innerHTML=
      `<div class="deckmain"><img class="full" id="deckmain" src="${esc(s.src)}" alt="${esc(t.id)} ${esc(s.label)}">`+
      `<div class="deckcap"><button data-slide="-1" style="background:var(--chip);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:6px 14px;cursor:pointer">\\u25c0</button>`+
      `<button data-slide="1" style="background:var(--chip);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:6px 14px;cursor:pointer">\\u25b6</button>`+
      `<span><b>${esc(s.label)}</b> \\u00b7 slide ${deckIdx+1} / ${slides.length} (\\u2191/\\u2193 to step)</span>`+
      `<a href="${esc(t.deck.html)}">Open full deck.html \\u2197</a></div></div>`+
      `<div class="filmstrip">${slides.map((d,i)=>`<figure><img src="${esc(d.src)}" data-thumb="${i}" class="${i===deckIdx?'cur':''}" alt="${esc(d.label)}" loading="lazy"><figcaption>${esc(d.label)}</figcaption></figure>`).join('')}</div>`;
  }
  tabbody.onclick=e=>{
    const th=e.target.closest('[data-thumb]');
    if(th){deckIdx=parseInt(th.dataset.thumb,10);renderDeck();return;}
    const sb=e.target.closest('[data-slide]');
    if(sb&&t.deck){deckIdx=(deckIdx+parseInt(sb.dataset.slide,10)+t.deck.slides.length)%t.deck.slides.length;renderDeck();}
  };
  detailbody.querySelector('.tabs').onclick=e=>{const b=e.target.closest('[data-tab]');if(b)show(b.dataset.tab);};
  detailbody.querySelector('.dnav').onclick=e=>{const b=e.target.closest('[data-nav]');if(b)stepDetail(parseInt(b.dataset.nav,10));};
  detailbody.querySelector('.review .opts').onchange=e=>{setReview(t.id,e.target.value,document.getElementById('rvnotes').value);document.getElementById('rvsaved').textContent='Last saved '+getReview(t.id).updatedAt;};
  document.getElementById('rvnotes').oninput=e=>{setReview(t.id,detailVerdict(),e.target.value);document.getElementById('rvsaved').textContent='Last saved '+getReview(t.id).updatedAt;};
  show(curTab);
  detail.classList.add('on');DetailRestoreScroll=window.scrollY;document.body.style.overflow='hidden';
}
function DetailVerdict(){
  const c=detailbodySafeChecked();return c?c.value:'';
}
function DetailbodySafeChecked(){return detailbody.querySelector('.review input[name=rv]:checked');}
let DetailRestoreScroll=0;
function closeDetail(){if(!detail.classList.contains('on'))return;detail.classList.remove('on');document.body.style.overflow='';setQuery({});window.scrollTo(0,DetailRestoreScroll||0);}
document.getElementById('closedetail').onclick=closeDetail;
detail.addEventListener('click',e=>{if(e.target===detail)closeDetail();});
function stepDetail(d){
  if(!detail.classList.contains('on')||!detailSeq.length)return;
  let i=detailSeq.indexOf(curId);if(i<0)i=0;
  const n=detailSeq[(i+d+detailSeq.length)%detailSeq.length];
  detail.scrollTop=0;openDetail(n,curTab);
}
function stepSlide(d){
  const t=DATA.find(x=>x.id===curId);
  if(!detail.classList.contains('on')||!t||!t.deck||curTab!=='deck')return;
  deckIdx=(deckIdx+d+t.deck.slides.length)%t.deck.slides.length;
  const s=t.deck.slides[deckIdx],main=document.getElementById('deckmain');
  if(main){main.src=s.src;main.alt=t.id+' '+s.label;}
  document.querySelectorAll('#tabbody .filmstrip img').forEach(im=>im.classList.toggle('cur',parseInt(im.dataset.thumb,10)===deckIdx));
  const cap=document.querySelector('#tabbody .deckcap span');
  if(cap)cap.innerHTML=`<b>${esc(s.label)}</b> \\u00b7 slide ${deckIdx+1} / ${t.deck.slides.length} (\\u2191/\\u2193 to step)`;
}
document.addEventListener('keydown',e=>{
  if(e.target&&(e.target.tagName==='TEXTAREA'||e.target.tagName==='INPUT'||e.target.tagName==='SELECT'))return;
  if(e.key==='Escape'){closeDetail();ov.classList.remove('on');}
  else if(detail.classList.contains('on')&&e.key==='ArrowRight')stepDetail(1);
  else if(detail.classList.contains('on')&&e.key==='ArrowLeft')stepDetail(-1);
  else if(detail.classList.contains('on')&&e.key==='ArrowDown'){e.preventDefault();stepSlide(1);}
  else if(detail.classList.contains('on')&&e.key==='ArrowUp'){e.preventDefault();stepSlide(-1);}
});
grid.addEventListener('click',e=>{
  if(e.target.closest('[data-pick]')||e.target.closest('label.pick'))return;
  const c=e.target.closest('.card');if(c)openDetail(c.dataset.id);
});
// ---- review export / import (timestamped merge, never silent overwrite) ----
document.getElementById('exportbtn').onclick=()=>{
  const stamp=new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  const payload={exportedAt:new Date().toISOString(),localStorageKey:LSKEY,count:Object.keys(reviews).length,reviews:reviews};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`typodeck-dq-reviews-${stamp}.json`;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);
};
document.getElementById('importbtn').onclick=()=>document.getElementById('importfile').click();
document.getElementById('importfile').onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      const obj=JSON.parse(rd.result);
      const incoming=obj.reviews||obj;
      let added=0,keptNewer=0,tookNewer=0,skipped=0;
      const log=[];
      for(const [id,entry] of Object.entries(incoming)){
        if(!DATA.some(t=>t.id===id)||!entry||typeof entry!=='object'){skipped++;continue;}
        const cur=reviews[id];
        if(!cur){reviews[id]={verdict:entry.verdict||'',notes:entry.notes||'',updatedAt:entry.updatedAt||obj.exportedAt||''};added++;}
        else if((entry.updatedAt||'')>(cur.updatedAt||'')){reviews[id]={verdict:entry.verdict||'',notes:entry.notes||'',updatedAt:entry.updatedAt||''};tookNewer++;log.push(id+' (import newer)');}
        else{keptNewer++;log.push(id+' (kept local newer)');}
      }
      saveReviews();
      DATA.forEach(t=>refreshVerdictBadges(t.id));
      alert(`Import merge complete (nothing silently overwritten):\\n+ ${added} added\\n+ ${tookNewer} updated (import newer)\\n+ ${keptNewer} kept (local newer)\\n+ ${skipped} skipped (unknown design)\\n${log.slice(0,12).join('\\n')}${log.length>12?'\\n\\u2026':''}`);
    }catch(err){alert('Import failed: '+err.message);}
    e.target.value='';
  };
  rd.readAsText(f);
};
const deepParams=new URLSearchParams(location.search);
const deepId=deepParams.get('d'),deepTab=deepParams.get('tab');
if(deepId&&DATA.some(x=>x.id===deepId))openDetail(deepId,deepTab);
</script>
</body>
</html>
"""

page = PAGE.replace("__MOODS__", mood_opts).replace("__DATA__", data_json)
(HERE / "index.html").write_text(page)
print("wrote index.html", len(page), "bytes")



