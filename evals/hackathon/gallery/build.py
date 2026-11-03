"""Build hackathon gallery index.html (build-time inline, zero fetch, file:// OK).

Reads: bold-template-pack/selection-index.json, evals/design-quality coverage
inputs (classification.json), evals/hackathon/coverage/coverage.json +
per-deck slides + report.json. Serve root: repo root or evals/hackathon
(parent of gallery/); image paths are ../coverage/<slug>-<lang>/slides/NN.png.
"""
import json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[3]  # repo root
HQ = ROOT / "evals" / "hackathon"
OUT = pathlib.Path(__file__).resolve().parent

# Art-direction ranks (evals/hackathon/art-direction.md): S showcase, K keep,
# R refine-or-demote, X experimental.
RANK = {
    'D01': 'S', 'D22': 'S',
    'D11': 'K', 'D24': 'K', 'D10': 'K', 'D02': 'K', 'D26': 'K', 'D18': 'K',
    'D08': 'K', 'D13': 'K', 'D14': 'K', 'D23': 'K',
    'D03': 'R', 'D07': 'R', 'D04': 'R', 'D06': 'R', 'D09': 'R', 'D19': 'R',
    'D27': 'R', 'D15': 'R', 'D17': 'R', 'D20': 'R', 'D21': 'R',
    'D05': 'X', 'D12': 'X', 'D16': 'X', 'D25': 'X',
}
RANK_LABEL = {'S': 'Showcase', 'K': 'Keep', 'R': 'Refine?', 'X': 'Experimental'}

# Decks the lead personally viewed at full res, >=2 slides each incl. a
# stress slide (evidence or dense). Honest VIEWED badge.
VIEWED = {
    'gridline-swiss-ko', 'fika-en', 'peer-review-en',
    'night-reel-ko', 'ma-ko',
}

templates = json.loads((ROOT / "bold-template-pack" / "selection-index.json").read_text())["templates"]
classification = {d['did']: d for d in
                  json.loads((ROOT / "evals/design-quality/audit/classification.json").read_text())["designs"]}
coverage = json.loads((HQ / "coverage" / "coverage.json").read_text())["designs"]

ROLES = ['cover', 'divider', 'statement', 'evidence', 'comparison', 'dense', 'closing']
missing = []
DATA = []
for t in templates:
    did, slug = t['id'], t['slug']
    decks = {}
    for lang in ('en', 'ko'):
        cov = coverage.get(slug, {}).get(lang, {})
        rep_path = HQ / "coverage" / f"{slug}-{lang}" / "report.json"
        rep = json.loads(rep_path.read_text()) if rep_path.exists() else {}
        slides = []
        for n in range(1, 8):
            p = HQ / "coverage" / f"{slug}-{lang}" / "slides" / f"{n:02d}.png"
            if not p.exists():
                missing.append(str(p))
            slides.append(f"../coverage/{slug}-{lang}/slides/{n:02d}.png")
        key = f"{slug}-{lang}"
        status = cov.get('status', 'MISSING')
        decks[lang] = {
            'status': status, 'pass': cov.get('pass', '0/7'),
            'builder': (rep.get('builder') or cov.get('builder') or '?'),
            'viewed': key in VIEWED,
            'failing': cov.get('failing', []),
            'slides': slides,
        }
    DATA.append({
        'id': did, 'slug': slug, 'name': t['name'], 'rank': RANK[did],
        'rankLabel': RANK_LABEL[RANK[did]],
        'category': (classification.get(did) or {}).get('leaning', '?'),
        'mood': t.get('mood', []), 'tone': t.get('tone', []),
        'density': t.get('density', '?'), 'formality': t.get('formality', '?'),
        'scheme': t.get('scheme', '?'), 'bestFor': t.get('bestFor', ''),
        'decks': decks,
    })

assert len(DATA) == 27, len(DATA)
assert not missing, f"{len(missing)} missing PNGs: {missing[:5]}"

PAGE = """<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TypoPPT Hackathon Gallery — 27 full-deck routes</title>
<style>
:root{--bg:#0b0d10;--card:#151920;--line:#262c36;--fg:#e8eaf0;--dim:#9aa3b2;--acc:#f5a623;--ok:#3ddc84;--warn:#ff6b6b;--rankS:#f5a623;--rankK:#3ddc84;--rankR:#6aa8ff;--rankX:#8b93a3}
body{background:var(--bg);color:var(--fg);font:15px/1.5 -apple-system,"Segoe UI",sans-serif;margin:0}
header{padding:26px 28px 6px}h1{font-size:26px;margin:0 0 4px}header p{color:var(--dim);font-size:13.5px;margin:0 0 10px}
#bar{display:flex;gap:10px;flex-wrap:wrap;padding:10px 28px;align-items:center}
#bar select,#bar input{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 10px;font-size:14px}
#bar button{background:var(--chip,#232936);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 12px;font-size:13.5px;cursor:pointer}
#count{margin-left:auto;color:var(--dim);font-size:13.5px}
#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:16px;padding:14px 28px 40px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden;cursor:pointer}
.card:hover{border-color:#4a5261}.card img{width:100%;display:block;background:#000;aspect-ratio:16/9;object-fit:cover}
.card .pad{padding:12px 14px}.card h2{font-size:17px;margin:0 0 2px}.did{display:inline-block;background:var(--acc);color:#111;border-radius:6px;font-size:12.5px;padding:1px 8px;margin-right:8px;vertical-align:2px}
.rank{display:inline-block;border-radius:6px;font-size:12px;padding:1px 8px;margin-left:6px;vertical-align:2px;border:1px solid}
.rankS{color:var(--rankS);border-color:var(--rankS)}.rankK{color:var(--rankK);border-color:var(--rankK)}.rankR{color:var(--rankR);border-color:var(--rankR)}.rankX{color:var(--rankX);border-color:var(--rankX)}
.slug{color:var(--dim);font-size:12.5px}.meta{font-size:13px;color:var(--dim);margin-top:6px}.meta b{color:var(--fg);font-weight:600}
.statusline{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.badge{font-size:12px;border-radius:6px;padding:1px 8px;border:1px solid var(--line)}
.ok{color:var(--ok);border-color:var(--ok)}.bad{color:var(--warn);border-color:var(--warn)}
.pick{display:block;font-size:13px;color:var(--dim);margin-top:8px}
#detail{position:fixed;inset:0;z-index:20;background:#0b0d10f7;display:none;overflow:auto;padding:24px}
#detail.on{display:block}
.sheet{max-width:1180px;margin:0 auto;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
#closedetail{float:right;margin:12px;background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer}
.dhead{padding:18px 22px 0}.dhead h2{font-size:23px;margin:0}
.langrow{display:flex;gap:8px;padding:12px 22px 0;align-items:center}
.langrow button{background:#232936;color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 16px;font-size:14px;cursor:pointer}
.langrow button.active{background:var(--acc);color:#111;font-weight:700;border-color:var(--acc)}
#main{margin:14px 22px 0;background:#000;border:1px solid var(--line);border-radius:8px;overflow:hidden}
#main img{width:100%;display:block}
#film{display:flex;gap:8px;padding:12px 22px;overflow-x:auto}
#film img{height:64px;cursor:pointer;border:2px solid transparent;border-radius:4px}
#film img.active{border-color:var(--acc)}
.dnav{display:flex;gap:8px;align-items:center;padding:0 22px}
.dnav button{background:#232936;color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 14px;font-size:14px;cursor:pointer}
.dnav .pos{margin-left:auto;color:var(--dim);font-size:13px}
.review{padding:6px 22px 24px}.review label{margin-right:12px;font-size:13.5px}
.review textarea{width:100%;min-height:52px;background:#11141a;color:var(--fg);border:1px solid var(--line);border-radius:8px;margin-top:8px;font-size:13.5px}
#overlay{position:fixed;inset:0;z-index:30;background:#0b0d10f5;display:none;overflow:auto;padding:24px}
#overlay.on{display:block}#overlay .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:14px;max-width:1600px;margin:0 auto}
#overlay figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}
#overlay img{width:100%;display:block}#overlay figcaption{padding:8px 12px;font-size:13.5px}
#closeov{background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;margin-bottom:12px}
#comparebar{position:fixed;bottom:0;left:0;right:0;background:#151920f2;border-top:1px solid var(--line);padding:10px 28px;display:none;z-index:15}
#comparebar.on{display:block}#comparebar button{background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer}
footer{padding:0 28px 80px;color:var(--dim);font-size:13px}
</style></head><body>
<header><h1>TypoPPT Hackathon Gallery — 27 full-deck generation routes</h1>
<p>Harness-generated 7-slide decks (EN + KO) per design. Status badges are structural (deterministic checks); VIEWED means the lead inspected full-res renders. Default view: curated (Showcase + Keep).</p></header>
<div id="bar">
<input id="q" type="search" placeholder="Search name, slug" style="width:180px">
<select id="fRank"><option value="curated">Curation: curated</option><option value="all">Curation: all 27</option><option value="S">Showcase</option><option value="K">Keep</option><option value="R">Refine?</option><option value="X">Experimental</option></select>
<select id="fCat"><option value="all">Category: all</option><option>Core</option><option>Specialized</option></select>
<select id="fStatus"><option value="all">Deck: all</option><option value="ok">EN+KO PASS</option><option value="flag">has PARTIAL/ERROR</option></select>
<select id="fReview"><option value="all">Review: all</option><option value="Unreviewed">Unreviewed</option><option value="approve">Approve</option><option value="specialized">Specialized</option><option value="refine">Needs refinement</option><option value="reject">Reject</option></select>
<button id="exp">Export reviews</button><button id="imp">Import</button><input type="file" id="impfile" accept="application/json" hidden>
<span id="count"></span></div>
<div id="grid"></div>
<div id="comparebar"><span id="cmpcount"></span> <button id="cmpopen">Compare side by side</button> <button id="cmpclear">Clear</button></div>
<div id="detail" role="dialog" aria-label="Deck detail"><div class="sheet"><button id="closedetail">Close ✕</button><div id="dbody"></div></div></div>
<div id="overlay" role="dialog" aria-label="Comparison"><div style="max-width:1600px;margin:0 auto"><button id="closeov">Close ✕</button><div class="cols" id="ovcols"></div></div></div>
<footer>Bold-template-pack two-file contract preserved; decks generated by tools/agent-harness from design.md (+locales/ko). PPTX: engine path, see evals/hackathon/pptx/.</footer>
<script>
const DATA=__DATA__;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store={load(){try{return JSON.parse(localStorage.getItem('typohack-review')||'{}')}catch{return{}}},save(v){localStorage.setItem('typohack-review',JSON.stringify(v))}};
let REV=store.load();
const okBoth=t=>t.decks.en.status==='PASS'&&t.decks.ko.status==='PASS';
function badge(lang,d){const v=d.decks[lang];const cls=v.status==='PASS'?'ok':'bad';return `<span class="badge ${cls}">${lang.toUpperCase()} ${esc(v.status)} ${esc(v.pass)}${v.viewed?' ·VIEWED':''}</span>`}
function card(t){const el=document.createElement('div');el.className='card';el.dataset.id=t.id;
el.innerHTML=`<img src="${esc(t.decks.en.slides[0])}" alt="${esc(t.id)} cover" loading="lazy"><div class="pad"><h2><span class="did">${esc(t.id)}</span>${esc(t.name)}<span class="rank rank${esc(t.rank)}">${esc(t.rankLabel)}</span></h2><div class="slug">${esc(t.slug)} · ${esc(t.category)}</div><div class="meta">density <b>${esc(t.density)}</b> · formality <b>${esc(t.formality)}</b> · scheme <b>${esc(t.scheme)}</b></div><div class="statusline">${badge('en',t)}${badge('ko',t)}</div><div class="meta">review: <b>${esc(REV[t.id]?.verdict||'Unreviewed')}</b></div><label class="pick"><input type="checkbox" data-pick="${esc(t.id)}"> select for comparison</label></div>`;
return el}
const grid=document.getElementById('grid'),count=document.getElementById('count');
function render(){grid.innerHTML='';const q=document.getElementById('q').value.toLowerCase(),fr=document.getElementById('fRank').value,fc=document.getElementById('fCat').value,fs=document.getElementById('fStatus').value,frv=document.getElementById('fReview').value;let n=0;
for(const t of DATA){if(fr==='curated'&&!['S','K'].includes(t.rank))continue;if(fr!=='curated'&&fr!=='all'&&t.rank!==fr)continue;if(fc!=='all'&&t.category!==fc)continue;if(fs==='ok'&&!okBoth(t))continue;if(fs==='flag'&&okBoth(t))continue;const rv=REV[t.id]?.verdict||'Unreviewed';if(frv!=='all'&&rv!==frv)continue;if(q&&!(t.name+t.slug+t.id).toLowerCase().includes(q))continue;grid.appendChild(card(t));n++;}
count.textContent=`${n} / 27 shown`;}
for(const id of ['q','fRank','fCat','fStatus','fReview'])document.getElementById(id).addEventListener('input',render);
// compare
const picks=new Set(),cbar=document.getElementById('comparebar');
grid.addEventListener('change',e=>{const c=e.target.closest('[data-pick]');if(!c)return;c.checked?picks.add(c.dataset.pick):picks.delete(c.dataset.pick);cbar.classList.toggle('on',picks.size>0);document.getElementById('cmpcount').textContent=`${picks.size} selected`;});
document.getElementById('cmpclear').onclick=()=>{picks.clear();render();cbar.classList.remove('on');};
document.getElementById('cmpopen').onclick=()=>{const ov=document.getElementById('overlay');document.getElementById('ovcols').innerHTML=[...picks].slice(0,4).map(id=>{const t=DATA.find(x=>x.id===id);return `<figure><img src="${esc(t.decks.en.slides[0])}" alt=""><figcaption><b>${esc(t.id)} ${esc(t.name)}</b> — EN ${esc(t.decks.en.status)} · KO ${esc(t.decks.ko.status)}</figcaption></figure>`}).join('');ov.classList.add('on');};
document.getElementById('closeov').onclick=()=>document.getElementById('overlay').classList.remove('on');
// detail
const detail=document.getElementById('detail'),dbody=document.getElementById('dbody');
let D={id:null,lang:'en',slide:0,seq:[]};
function seqIds(){const ids=[...document.querySelectorAll('#grid .card')].map(el=>el.dataset.id);return ids.length?ids:DATA.map(t=>t.id)}
function openDetail(id,lang){const t=DATA.find(x=>x.id===id);if(!t)return;D.seq=seqIds();if(!D.seq.includes(id))D.seq=DATA.map(x=>x.id);D.id=id;D.lang=lang||D.lang||'en';D.slide=0;paintDetail(t);}
function paintDetail(t){const pos=D.seq.indexOf(D.id);const d=t.decks[D.lang];
dbody.innerHTML=`<div class="dhead"><h2><span class="did">${esc(t.id)}</span>${esc(t.name)}<span class="rank rank${esc(t.rank)}">${esc(t.rankLabel)}</span></h2><div class="slug">${esc(t.slug)} · ${esc(t.category)} · builder ${esc(d.builder)} · ${esc(d.status)} ${esc(d.pass)}${d.viewed?' · <b>VIEWED</b>':''}${d.failing&&d.failing.length?` · failing: ${esc(d.failing.join(','))}`:''}</div></div>
<div class="langrow"><button data-lang="en" class="${D.lang==='en'?'active':''}">English</button><button data-lang="ko" class="${D.lang==='ko'?'active':''}">한국어</button></div>
<div id="main"><img src="${esc(d.slides[D.slide])}" alt=""></div>
<div class="dnav"><button data-nav="-1">◀ Prev</button><button data-nav="1">Next ▶</button><span class="pos">slide ${D.slide+1} / 7 · design ${pos+1} / ${D.seq.length} (←/→ slides, ⇧←/→ designs)</span></div>
<div id="film">${d.slides.map((s,i)=>`<img src="${esc(s)}" data-i="${i}" class="${i===D.slide?'active':''}" alt="">`).join('')}</div>
<div class="review"><b>Owner review</b><br>${['approve|Approve','specialized|Specialized','refine|Needs refinement','reject|Reject'].map(o=>{const[v,l]=o.split('|');const cur=REV[t.id]?.verdict;return `<label><input type="radio" name="rv" value="${v}" ${cur===v?'checked':''}>${l}</label>`}).join('')}<textarea id="rvnote" placeholder="notes…">${esc(REV[t.id]?.note||'')}</textarea></div>`;
dbody.querySelector('.langrow').onclick=e=>{const b=e.target.closest('[data-lang]');if(b){D.lang=b.dataset.lang;D.slide=0;paintDetail(t);}};
dbody.querySelector('.dnav').onclick=e=>{const b=e.target.closest('[data-nav]');if(b)stepSlide(parseInt(b.dataset.nav,10));};
dbody.querySelector('#film').onclick=e=>{const im=e.target.closest('[data-i]');if(im){D.slide=+im.dataset.i;paintDetail(t);}};
dbody.querySelectorAll('[name=rv]').forEach(r=>r.onchange=()=>{REV[t.id]=REV[t.id]||{};REV[t.id].verdict=r.value;REV[t.id].updatedAt=new Date().toISOString();store.save(REV);});
dbody.querySelector('#rvnote').onchange=e=>{REV[t.id]=REV[t.id]||{};REV[t.id].note=e.target.value;REV[t.id].updatedAt=new Date().toISOString();store.save(REV);};
detail.classList.add('on');history.replaceState(null,'',`?d=${t.id}&lang=${D.lang}`);}
function stepSlide(n){const t=DATA.find(x=>x.id===D.id);D.slide=(D.slide+n+7)%7;paintDetail(t);}
function stepDesign(n){const i=D.seq.indexOf(D.id);openDetail(D.seq[(i+n+D.seq.length)%D.seq.length],D.lang);}
function closeDetail(){detail.classList.remove('on');history.replaceState(null,'',location.pathname);render();}
document.getElementById('closedetail').onclick=closeDetail;
detail.addEventListener('click',e=>{if(e.target===detail)closeDetail();});
document.addEventListener('keydown',e=>{if(!detail.classList.contains('on'))return;if(e.key==='Escape')closeDetail();else if(e.key==='ArrowRight')e.shiftKey?stepDesign(1):stepSlide(1);else if(e.key==='ArrowLeft')e.shiftKey?stepDesign(-1):stepSlide(-1);});
grid.addEventListener('click',e=>{if(e.target.closest('[data-pick]')||e.target.closest('label.pick'))return;const c=e.target.closest('.card');if(c)openDetail(c.dataset.id);});
// export/import
document.getElementById('exp').onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),reviews:REV},null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='typohack-reviews.json';a.click();};
document.getElementById('imp').onclick=()=>document.getElementById('impfile').click();
document.getElementById('impfile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);const inc=j.reviews||j;let n=0;for(const[k,v]of Object.entries(inc)){const cur=REV[k];if(!cur||(v.updatedAt||'')>(cur.updatedAt||'')){REV[k]=v;n++;}}store.save(REV);render();alert(`merged ${n} review(s)`);}catch{alert('invalid JSON')}};r.readAsText(f);};
render();
const qp=new URLSearchParams(location.search);if(qp.get('d')&&DATA.some(x=>x.id===qp.get('d')))openDetail(qp.get('d'),qp.get('lang')||'en');
</script></body></html>
"""

(OUT / "index.html").write_text(PAGE.replace("__DATA__", json.dumps(DATA)))
print(f"wrote index.html ({len(DATA)} cards, curated default)")
