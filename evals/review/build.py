"""Build unified owner-review gallery (all designs, all sources, one page).

Reads: bold-template-pack/selection-index.json,
  evals/design-quality/{specimens,full-decks,pptx,audit/classification.json},
  evals/design-diversity/screenshots (legacy pre-refinement covers, reference only),
  evals/hackathon/{coverage,art-direction ranks,pptx},
  evals/typo-only/before (pre-regen harness renders @257cdce, for before/after toggle),
  evals/color-comfort/before (pre-color-change harness renders @f0aed77, color toggle).
Writes: evals/review/index.html (build-time inline DATA, zero fetch).
Serve root: repo root. Image paths are ../design-quality/... etc.
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).resolve().parent
Q = ROOT / "evals" / "design-quality"
DIV = ROOT / "evals" / "design-diversity"
HQ = ROOT / "evals" / "hackathon"

RANK = {
    'D01': 'S', 'D22': 'S',
    'D11': 'K', 'D24': 'K', 'D10': 'K', 'D02': 'K', 'D26': 'K', 'D18': 'K',
    'D08': 'K', 'D13': 'K', 'D14': 'K', 'D23': 'K',
    'D03': 'R', 'D07': 'R', 'D04': 'R', 'D06': 'R', 'D09': 'R', 'D19': 'R',
    'D27': 'R', 'D15': 'R', 'D17': 'R', 'D20': 'R', 'D21': 'R',
    'D05': 'X', 'D12': 'X', 'D16': 'X', 'D25': 'X',
}
RANK_LABEL = {'S': 'Showcase', 'K': 'Keep', 'R': 'Refine?', 'X': 'Experimental'}
WHY = {
    'D01': 'Exemplary cover+evidence+explanation+7-slide deck; only flaw is rail bottom-light',
    'D22': '10/10 slides pass, zero flags; fullest data apparatus, exact rules',
    'D11': 'Flawless symmetric deco; kicker/context duplication FIXED',
    'D24': 'Complete three-voice apparatus; stamp+tally+hand+takeaway all earn place',
    'D10': 'Pixel-faithful instrument; ticker oddity FIXED; s02 void is the one dent',
    'D02': 'Richest procedural fiction; voids narrowed in Wave-2, s03 thin',
    'D26': 'Dimensioned caps + revision table exact; amber x4 disciplined',
    'D18': 'Sticker-book depth exact; type sovereign over confetti',
    'D08': 'Marquee clip FIXED; coherent cabinet; hero small vs frame',
    'D13': 'Exact zen plate; ghost-01 touches title stem — nudge only',
    'D14': 'Primaries+glyphs exact; red accent ADDED in Wave-2; title zone airy',
    'D23': 'Towering Bebas + single red rule; doctrinal black, no clip (V)',
    'D03': 'Wave-2 wall now full-width line 1, but right x1050-1900 y350-900 still void',
    'D07': 'Modules FIXED but left-bottom 60%x250px void; CASE/FILES bullet mismatch',
    'D04': 'Lovely cover; drop cap too loud for 2-line lede (C); no data vessel',
    'D06': 'Keys FIXED (distinct 1/2); ~500px void below y555 reads unfinished',
    'D09': 'Single-line hero + ~400px lower void; calm to the point of flat',
    'D19': 'Chips restate headline/subtitle VERBATIM; soft register, low punch',
    'D27': 'Hairline x1210 strikes THROUGH headline glyphs; no data vessel',
    'D15': 'Bloom fleuron renders heart-like; bottom curls read as stray arcs',
    'D17': 'Drop-cap splits "What" w/ ~40px gap; middle ~40% empty newsprint',
    'D20': '"ofRushing" missing space (P0 type bug); fleuron mis-renders',
    'D21': 'One subtitle line floating in ~520px-tall cream band',
    'D05': 'Ghost occlusion FIXED (now clear); still top-heavy, bottom-left empty',
    'D12': 'TECH-2: chip clipped at x1920 edge; right zone over-stacked',
    'D16': 'Session ends line 12; lower ~45% empty paper; density unproven',
    'D25': '"Ship" orphaned alone on line 2 in aqua box; card right half airy',
}
# Harness decks the lead personally viewed at full res (>=2 slides each).
VIEWED = {'gridline-swiss-ko', 'fika-en', 'peer-review-en', 'night-reel-ko', 'ma-ko'}

templates = json.loads((ROOT / "bold-template-pack" / "selection-index.json").read_text())["templates"]
classification = {d['did']: d for d in
                  json.loads((Q / "audit" / "classification.json").read_text())["designs"]}
coverage = json.loads((HQ / "coverage" / "coverage.json").read_text())["designs"]

QKINDS = ['cover', 'divider', 'statement', 'evidence', 'comparison', 'dense', 'closing']
SPEC = ['cover', 'evidence', 'explanation']
missing = []
n_cbefore_refs = []
DATA = []
for t in templates:
    did, slug = t['id'], t['slug']
    src = {}
    # refined specimens (3)
    spec = []
    for k in SPEC:
        p = Q / "specimens" / slug / f"{k}.png"
        if not p.exists():
            missing.append(str(p))
        spec.append({'label': k, 'img': f"../design-quality/specimens/{slug}/{k}.png"})
    src['spec'] = spec
    # quality full deck (6 designs)
    qdeck = []
    qdir = Q / "full-decks" / slug / "slides"
    if qdir.exists():
        for n, k in enumerate(QKINDS, 1):
            p = qdir / f"slide-{n:02d}-{k}.png"
            if not p.exists():
                missing.append(str(p))
            qdeck.append({'label': f"{n:02d} {k}",
                          'img': f"../design-quality/full-decks/{slug}/slides/slide-{n:02d}-{k}.png"})
    src['qdeck'] = qdeck
    # harness decks EN/KO
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
            b = ROOT / "evals" / "typo-only" / "before" / f"{slug}-{lang}" / "slides" / f"{n:02d}.png"
            if not b.exists():
                missing.append(str(b))
            entry = {'label': f"{n:02d} {QKINDS[n-1]}",
                       'img': f"../hackathon/coverage/{slug}-{lang}/slides/{n:02d}.png",
                       'before': f"../typo-only/before/{slug}-{lang}/slides/{n:02d}.png"}
            cb = ROOT / "evals" / "color-comfort" / "before" / f"{slug}-{lang}" / "slides" / f"{n:02d}.png"
            if cb.exists():
                entry['cbefore'] = f"../color-comfort/before/{slug}-{lang}/slides/{n:02d}.png"
                n_cbefore_refs.append(str(cb.relative_to(ROOT)))
            elif (ROOT / "evals" / "color-comfort" / "before" / f"{slug}-{lang}").exists():
                missing.append(str(cb))  # partial color-before set is a build error
            slides.append(entry)
        key = f"{slug}-{lang}"
        decks[lang] = {'status': cov.get('status', 'MISSING'), 'pass': cov.get('pass', '0/7'),
                       'builder': (rep.get('builder') or cov.get('builder') or '?'),
                       'viewed': key in VIEWED, 'failing': cov.get('failing', []),
                       'slides': slides}
    src['harness'] = decks
    # legacy pre-refinement cover (reference only)
    leg = DIV / "screenshots" / f"{did}.png"
    if not leg.exists():
        missing.append(str(leg))
    src['legacy'] = f"../design-diversity/screenshots/{did}.png"
    # pptx links
    pptx = []
    qp = Q / "pptx" / f"{slug}.pptx"
    if qp.exists():
        pptx.append({'label': 'Quality deck PPTX', 'href': f"../design-quality/pptx/{slug}.pptx"})
    for lang in ('en', 'ko'):
        hp = HQ / "pptx" / f"{slug}-{lang}.pptx"
        if hp.exists():
            pptx.append({'label': f"Harness {lang.upper()} PPTX (engine path)",
                         'href': f"../hackathon/pptx/{slug}-{lang}.pptx"})
    cls = classification.get(did) or {}
    color_changed = any('cbefore' in s for lang in ('en', 'ko') for s in src['harness'][lang]['slides'])
    DATA.append({
        'id': did, 'slug': slug, 'name': t['name'], 'rank': RANK[did],
        'colorChanged': color_changed,
        'rankLabel': RANK_LABEL[RANK[did]], 'why': WHY[did],
        'category': cls.get('leaning', '?'),
        'clsNote': cls.get('notes', '') or cls.get('rationale', ''),
        'mood': t.get('mood', []), 'tone': t.get('tone', []),
        'density': t.get('density', '?'), 'formality': t.get('formality', '?'),
        'scheme': t.get('scheme', '?'), 'bestFor': t.get('bestFor', ''),
        'src': src, 'pptx': pptx,
    })

assert len(DATA) == 27, len(DATA)
assert not missing, f"{len(missing)} missing: {missing[:5]}"
_CB = ROOT / "evals" / "color-comfort" / "before"
cb_disk = sorted(str(p.relative_to(ROOT)) for p in _CB.rglob("*.png")) if _CB.exists() else []
assert sorted(n_cbefore_refs) == cb_disk, \
    f"color-before wiring drift: refs={len(n_cbefore_refs)} disk={len(cb_disk)}"

PAGE = """<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Typodeck 통합 리뷰 — 27 디자인 전체</title>
<style>
:root{--bg:#101216;--card:#1a1e24;--line:#2b313b;--fg:#eceff4;--dim:#a7b0bd;--acc:#e8b33c;--ok:#3ddc84;--warn:#ff7a7a;--rankS:#e8b33c;--rankK:#3ddc84;--rankR:#6aa8ff;--rankX:#8b93a3}
body{background:var(--bg);color:var(--fg);font:15px/1.55 -apple-system,"Segoe UI","Noto Sans KR",sans-serif;margin:0}
header{padding:26px 28px 4px;max-width:1400px}h1{font-size:25px;margin:0 0 4px;letter-spacing:-.3px}
header p{color:var(--dim);font-size:13.5px;margin:0 0 6px;max-width:1000px}
#bar{display:flex;gap:10px;flex-wrap:wrap;padding:12px 28px;align-items:center;position:sticky;top:0;background:var(--bg);z-index:5;border-bottom:1px solid var(--line)}
#bar select,#bar input{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 10px;font-size:14px}
#bar button{background:#232936;color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 12px;font-size:13.5px;cursor:pointer}
#count{margin-left:auto;color:var(--dim);font-size:13.5px}
#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;padding:16px 28px 40px;max-width:1700px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden;cursor:pointer}
.card:hover{border-color:#525b6a}.card img{width:100%;display:block;background:#000;aspect-ratio:16/9;object-fit:cover}
.card .pad{padding:12px 14px}.card h2{font-size:17px;margin:0 0 2px}
.did{display:inline-block;background:var(--acc);color:#181206;border-radius:6px;font-size:12.5px;font-weight:700;padding:1px 8px;margin-right:8px;vertical-align:2px}
.rank{display:inline-block;border-radius:6px;font-size:12px;padding:1px 8px;margin-left:6px;vertical-align:2px;border:1px solid}
.rankS{color:var(--rankS);border-color:var(--rankS)}.rankK{color:var(--rankK);border-color:var(--rankK)}.rankR{color:var(--rankR);border-color:var(--rankR)}.rankX{color:var(--rankX);border-color:var(--rankX)}
.slug{color:var(--dim);font-size:12.5px}.meta{font-size:13px;color:var(--dim);margin-top:6px}.meta b{color:var(--fg);font-weight:600}
.statusline{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.badge{font-size:12px;border-radius:6px;padding:1px 8px;border:1px solid var(--line);color:var(--dim)}
.ok{color:var(--ok);border-color:var(--ok)}.bad{color:var(--warn);border-color:var(--warn)}
.pick{display:block;font-size:13px;color:var(--dim);margin-top:8px}
#detail{position:fixed;inset:0;z-index:20;background:#101216f7;display:none;overflow:auto;padding:22px}
#detail.on{display:block}
.sheet{max-width:1220px;margin:0 auto;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
#closedetail{float:right;margin:12px;background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;color:#181206}
.dhead{padding:18px 22px 0}.dhead h2{font-size:22px;margin:0}
.why{font-size:13px;color:var(--dim);margin-top:4px;max-width:1000px}.why b{color:var(--fg)}
.tabs{display:flex;gap:8px;padding:12px 22px 0;flex-wrap:wrap}
.tabs button{background:#232936;color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 14px;font-size:13.5px;cursor:pointer}
.tabs button.active{background:var(--acc);color:#181206;font-weight:700;border-color:var(--acc)}
.tabs button:disabled{opacity:.35;cursor:default}
.ver{display:flex;gap:8px;padding:10px 22px 0;align-items:center;font-size:13px;color:var(--dim)}
.ver button{background:#232936;color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:5px 12px;font-size:13px;cursor:pointer}
.ver button.active{background:var(--acc);color:#181206;font-weight:700;border-color:var(--acc)}
.ver button:disabled{opacity:.35;cursor:default}
.ver .src{font-size:12px}
#main{margin:14px 22px 0;background:#000;border:1px solid var(--line);border-radius:8px;overflow:hidden}
#main img{width:100%;display:block}
.cap{padding:8px 22px 0;color:var(--dim);font-size:13px}
#film{display:flex;gap:8px;padding:10px 22px;overflow-x:auto}
#film img{height:62px;cursor:pointer;border:2px solid transparent;border-radius:4px}
#film img.active{border-color:var(--acc)}
.dnav{display:flex;gap:8px;align-items:center;padding:0 22px}
.dnav button{background:#232936;color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:7px 14px;font-size:14px;cursor:pointer}
.dnav .pos{margin-left:auto;color:var(--dim);font-size:13px}
.pptx{padding:8px 22px;font-size:13.5px}.pptx a{color:var(--acc);margin-right:14px}
.review{padding:6px 22px 24px}.review label{margin-right:12px;font-size:13.5px}
.review textarea{width:100%;min-height:52px;background:#11141a;color:var(--fg);border:1px solid var(--line);border-radius:8px;margin-top:8px;font-size:13.5px}
#overlay{position:fixed;inset:0;z-index:30;background:#101216f5;display:none;overflow:auto;padding:24px}
#overlay.on{display:block}#overlay .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:14px;max-width:1700px;margin:0 auto}
#overlay figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}
#overlay img{width:100%;display:block}#overlay figcaption{padding:8px 12px;font-size:13.5px}
#closeov{background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;margin-bottom:12px;color:#181206}
#comparebar{position:fixed;bottom:0;left:0;right:0;background:#1a1e24f2;border-top:1px solid var(--line);padding:10px 28px;display:none;z-index:15}
#comparebar.on{display:block}#comparebar button{background:var(--acc);border:0;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;color:#181206}
footer{padding:0 28px 90px;color:var(--dim);font-size:13px;max-width:1100px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style></head><body>
<header><h1>Typodeck 통합 리뷰 — 27개 디자인, 출처 전부 한곳에</h1>
<p>정제 표본 3종(cover · evidence · explanation) + Quality 풀덱 7장(6종) + Harness 풀덱 EN/KO 7장(27종 전부) + 정제 전 표지(참고용). 뱃지의 PASS는 구조 검증이며 심미 승인이 아닙니다. VIEWED = 리드가 전수 판독한 Harness 덱. 리뷰는 이 페이지에서 새로 시작됩니다(이전 해커톤 갤러리 리뷰와 별개). Harness EN/KO 탭에서는 재생성 전 렌더(Typo-Before @257cdce)와 현재본(After)을 전환할 수 있습니다. 색상 변경 7종(하네스 14덱)은 색상-Before(@f0aed77) 버튼으로 변경 전/후를 대조할 수 있습니다.</p></header>
<div id="bar">
<input id="q" type="search" placeholder="검색: 이름, slug" style="width:170px">
<select id="fRank"><option value="all">등급: 전부</option><option value="S">Showcase</option><option value="K">Keep</option><option value="R">Refine?</option><option value="X">Experimental</option></select>
<select id="fCat"><option value="all">분류: 전부</option><option>Core</option><option>Specialized</option></select>
<select id="fQ"><option value="all">Quality 풀덱: 전부</option><option value="yes">있음(6종)</option><option value="no">없음</option></select>
<select id="fReview"><option value="all">내 리뷰: 전부</option><option value="Unreviewed">미리뷰</option><option value="approve">승인</option><option value="specialized">Specialized</option><option value="refine">재작업</option><option value="reject">반려</option></select>
<button id="exp">리뷰 내보내기</button><button id="imp">가져오기</button><input type="file" id="impfile" accept="application/json" hidden>
<span id="count"></span></div>
<div id="grid"></div>
<div id="comparebar"><span id="cmpcount"></span> <button id="cmpopen">나란히 비교</button> <button id="cmpclear">해제</button></div>
<div id="detail" role="dialog" aria-label="Detail"><div class="sheet"><button id="closedetail">닫기 ✕</button><div id="dbody"></div></div></div>
<div id="overlay" role="dialog" aria-label="Compare"><div style="max-width:1700px;margin:0 auto"><button id="closeov">닫기 ✕</button><div class="cols" id="ovcols"></div></div></div>
<footer>출처: evals/design-quality (정제 표본·풀덱·PPTX 6) · evals/hackathon (Harness EN/KO 54덱·PPTX 6) · evals/design-diversity (정제 전 표지 27, 참고용) · evals/typo-only/before (Harness 재생성 전 378장 @257cdce) · evals/color-comfort/before (색상 변경 전 98장 @f0aed77). 리뷰 데이터는 브라우저 localStorage + JSON 내보내기로 보관됩니다.</footer>
<script>
const DATA=__DATA__;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store={load(){try{return JSON.parse(localStorage.getItem('typodeck-unified-review')||'{}')}catch{return{}}},save(v){localStorage.setItem('typodeck-unified-review',JSON.stringify(v))}};
let REV=store.load();
const RVL={approve:'승인',specialized:'Specialized',refine:'재작업',reject:'반려'};
function card(t){const el=document.createElement('div');el.className='card';el.dataset.id=t.id;
const en=t.src.harness.en,ko=t.src.harness.ko;
el.innerHTML=`<img src="${esc(t.src.spec[0].img)}" alt="${esc(t.id)} cover" loading="lazy"><div class="pad"><h2><span class="did">${esc(t.id)}</span>${esc(t.name)}<span class="rank rank${esc(t.rank)}">${esc(t.rankLabel)}</span></h2><div class="slug">${esc(t.slug)} · ${esc(t.category)}</div><div class="meta">density <b>${esc(t.density)}</b> · formality <b>${esc(t.formality)}</b> · scheme <b>${esc(t.scheme)}</b></div><div class="statusline"><span class="badge ok">표본 3/3</span><span class="badge ${t.src.qdeck.length?'ok':''}">Q풀덱 ${t.src.qdeck.length?'7장':'없음'}</span><span class="badge ${en.status==='PASS'?'ok':'bad'}">EN ${esc(en.status)}${en.viewed?' ·VIEWED':''}</span><span class="badge ${ko.status==='PASS'?'ok':'bad'}">KO ${esc(ko.status)}${ko.viewed?' ·VIEWED':''}</span><span class="badge">PPTX ${t.pptx.length}</span>${t.colorChanged?'<span class="badge ok">색변경전 있음</span>':''}</div><div class="meta">내 리뷰: <b>${esc(RVL[REV[t.id]?.verdict]||'미리뷰')}</b></div><label class="pick"><input type="checkbox" data-pick="${esc(t.id)}"> 비교 선택</label></div>`;
return el}
const grid=document.getElementById('grid'),count=document.getElementById('count');
function render(){grid.innerHTML='';const q=document.getElementById('q').value.toLowerCase(),fr=document.getElementById('fRank').value,fc=document.getElementById('fCat').value,fq=document.getElementById('fQ').value,frv=document.getElementById('fReview').value;let n=0;
for(const t of DATA){if(fr!=='all'&&t.rank!==fr)continue;if(fc!=='all'&&t.category!==fc)continue;if(fq==='yes'&&!t.src.qdeck.length)continue;if(fq==='no'&&t.src.qdeck.length)continue;const rv=REV[t.id]?.verdict||'Unreviewed';if(frv!=='all'&&rv!==frv)continue;if(q&&!(t.name+t.slug+t.id).toLowerCase().includes(q))continue;grid.appendChild(card(t));n++;}
count.textContent=`${n} / 27 표시 · 리뷰 ${Object.keys(REV).length} / 27`;}
for(const id of ['q','fRank','fCat','fQ','fReview'])document.getElementById(id).addEventListener('input',render);
const picks=new Set(),cbar=document.getElementById('comparebar');
grid.addEventListener('change',e=>{const c=e.target.closest('[data-pick]');if(!c)return;c.checked?picks.add(c.dataset.pick):picks.delete(c.dataset.pick);cbar.classList.toggle('on',picks.size>0);document.getElementById('cmpcount').textContent=`${picks.size}개 선택`;});
document.getElementById('cmpclear').onclick=()=>{picks.clear();render();cbar.classList.remove('on');};
document.getElementById('cmpopen').onclick=()=>{const ov=document.getElementById('overlay');document.getElementById('ovcols').innerHTML=[...picks].slice(0,4).map(id=>{const t=DATA.find(x=>x.id===id);return `<figure><img src="${esc(t.src.spec[0].img)}" alt=""><figcaption><b>${esc(t.id)} ${esc(t.name)}</b> — ${esc(t.rankLabel)} · Q풀덱 ${t.src.qdeck.length?'있음':'없음'} · EN ${esc(t.src.harness.en.status)} · KO ${esc(t.src.harness.ko.status)}</figcaption></figure>`}).join('');ov.classList.add('on');};
document.getElementById('closeov').onclick=()=>document.getElementById('overlay').classList.remove('on');
const detail=document.getElementById('detail'),dbody=document.getElementById('dbody');
const TABS=[['spec','정제 표본 3'],['qdeck','Quality 풀덱 7'],['en','Harness EN 7'],['ko','Harness KO 7'],['legacy','정제 전 표지']];
let D={id:null,tab:'spec',slide:0,seq:[],ver:'after'};
function tabSlides(t,tab){if(tab==='spec')return t.src.spec;if(tab==='qdeck')return t.src.qdeck;if(tab==='en')return t.src.harness.en.slides;if(tab==='ko')return t.src.harness.ko.slides;return[{label:'legacy cover (정제 전, 참고용)',img:t.src.legacy}];}
function seqIds(){const ids=[...document.querySelectorAll('#grid .card')].map(el=>el.dataset.id);return ids.length?ids:DATA.map(t=>t.id)}
function openDetail(id,tab){const t=DATA.find(x=>x.id===id);if(!t)return;D.seq=seqIds();if(!D.seq.includes(id))D.seq=DATA.map(x=>x.id);D.id=id;D.tab=tab||'spec';if(D.tab==='qdeck'&&!t.src.qdeck.length)D.tab='spec';D.slide=0;paintDetail(t);}
function paintDetail(t){const pos=D.seq.indexOf(D.id);const slides=tabSlides(t,D.tab);if(D.slide>=slides.length)D.slide=0;const s=slides[D.slide];
const hasBefore=slides.some(x=>x.before);
const hasCbefore=slides.some(x=>x.cbefore);
const pic=x=>D.ver==='cbefore'?(x.cbefore||x.img):(D.ver==='before'&&x.before)?x.before:x.img;
const hd=D.tab==='en'?t.src.harness.en:D.tab==='ko'?t.src.harness.ko:null;
dbody.innerHTML=`<div class="dhead"><h2><span class="did">${esc(t.id)}</span>${esc(t.name)}<span class="rank rank${esc(t.rank)}">${esc(t.rankLabel)}</span></h2><div class="slug">${esc(t.slug)} · ${esc(t.category)} · density ${esc(t.density)} · formality ${esc(t.formality)} · scheme ${esc(t.scheme)}</div><div class="why"><b>아트디렉션:</b> ${esc(t.why)}</div>${t.clsNote?`<div class="why"><b>Quality 분류:</b> ${esc(t.clsNote)}</div>`:''}${hd?`<div class="why">builder ${esc(hd.builder)} · ${esc(hd.status)} ${esc(hd.pass)}${hd.viewed?' · <b>VIEWED</b>':''}${hd.failing&&hd.failing.length?` · failing: ${esc(hd.failing.join(','))}`:''}</div>`:''}</div>
<div class="tabs">${TABS.map(([k,l])=>{const dis=(k==='qdeck'&&!t.src.qdeck.length)?'disabled':'';return `<button data-tab="${k}" class="${D.tab===k?'active':''}" ${dis}>${l}</button>`}).join('')}</div>
<div class="ver">보기: <button data-ver="after" class="${D.ver==='after'?'active':''}">After (현재)</button><button data-ver="cbefore" class="${D.ver==='cbefore'?'active':''}" ${hasCbefore?'':'disabled'}>색상-Before (@f0aed77)</button><button data-ver="before" class="${D.ver==='before'?'active':''}" ${hasBefore?'':'disabled'}>Typo-Before (@257cdce)</button><span class="src">${hasCbefore?'색상 전/후 + 타이포 전 3단 비교 · 단축키 B':hasBefore?'Harness EN/KO 탭만 Typo-Before 제공 · 단축키 B':(D.tab==='legacy'?'정제 전 표지는 그 자체가 이전본입니다':'이 탭은 Before 없음')}</span></div>
<div id="main"><img src="${esc(pic(s))}" alt=""></div><div class="cap">${esc(s.label)}${D.ver==='cbefore'&&s.cbefore?' · 색상-BEFORE @f0aed77 (색상 변경 전 렌더)':(D.ver==='before'&&s.before)?' · TYPO-BEFORE @257cdce (재생성 전 렌더)':(hasCbefore||hasBefore)?' · AFTER (현재 재생성본)':''}${D.tab==='legacy'?' — 정제 전 원본 표지입니다. 현재 품질 기준이 아닙니다.':''}</div>
<div class="dnav"><button data-nav="-1">◀ 이전</button><button data-nav="1">다음 ▶</button><span class="pos">${D.slide+1} / ${slides.length} · 디자인 ${pos+1} / ${D.seq.length} (←/→ 슬라이드, Shift+←/→ 디자인)</span></div>
<div id="film">${slides.map((x,i)=>`<img src="${esc(pic(x))}" data-i="${i}" class="${i===D.slide?'active':''}" alt="" loading="lazy">`).join('')}</div>
${t.pptx.length?`<div class="pptx"><b>PPTX:</b> ${t.pptx.map(p=>`<a href="${esc(p.href)}" download>${esc(p.label)} ⬇</a>`).join('')}</div>`:'<div class="pptx">PPTX 없음</div>'}
<div class="review"><b>내 리뷰</b><br>${['approve|승인','specialized|Specialized','refine|재작업','reject|반려'].map(o=>{const[v,l]=o.split('|');const cur=REV[t.id]?.verdict;return `<label><input type="radio" name="rv" value="${v}" ${cur===v?'checked':''}>${l}</label>`}).join('')}<textarea id="rvnote" placeholder="메모…">${esc(REV[t.id]?.note||'')}</textarea></div>`;
dbody.querySelector('.tabs').onclick=e=>{const b=e.target.closest('[data-tab]');if(b&&!b.disabled){D.tab=b.dataset.tab;D.slide=0;paintDetail(t);}};
dbody.querySelector('.ver').onclick=e=>{const b=e.target.closest('[data-ver]');if(b&&!b.disabled){D.ver=b.dataset.ver;paintDetail(t);}};
dbody.querySelector('.dnav').onclick=e=>{const b=e.target.closest('[data-nav]');if(b)stepSlide(parseInt(b.dataset.nav,10));};
dbody.querySelector('#film').onclick=e=>{const im=e.target.closest('[data-i]');if(im){D.slide=+im.dataset.i;paintDetail(t);}};
dbody.querySelectorAll('[name=rv]').forEach(r=>r.onchange=()=>{REV[t.id]=REV[t.id]||{};REV[t.id].verdict=r.value;REV[t.id].updatedAt=new Date().toISOString();store.save(REV);});
dbody.querySelector('#rvnote').onchange=e=>{REV[t.id]=REV[t.id]||{};REV[t.id].note=e.target.value;REV[t.id].updatedAt=new Date().toISOString();store.save(REV);};
detail.classList.add('on');history.replaceState(null,'',`?d=${t.id}&tab=${D.tab}`);}
function stepSlide(n){const t=DATA.find(x=>x.id===D.id);const L=tabSlides(t,D.tab).length;D.slide=(D.slide+n+L)%L;paintDetail(t);}
function stepDesign(n){const i=D.seq.indexOf(D.id);openDetail(D.seq[(i+n+D.seq.length)%D.seq.length],D.tab);}
function closeDetail(){detail.classList.remove('on');history.replaceState(null,'',location.pathname);render();}
document.getElementById('closedetail').onclick=closeDetail;
detail.addEventListener('click',e=>{if(e.target===detail)closeDetail();});
document.addEventListener('keydown',e=>{if(!detail.classList.contains('on'))return;if(e.key==='Escape')closeDetail();else if(e.key==='ArrowRight')e.shiftKey?stepDesign(1):stepSlide(1);else if(e.key==='ArrowLeft')e.shiftKey?stepDesign(-1):stepSlide(-1);else if((e.key==='b'||e.key==='B')&&!e.target.closest('textarea,input')){const t=DATA.find(x=>x.id===D.id);if(t){const sl=tabSlides(t,D.tab);const avail=['after'];if(sl.some(x=>x.cbefore))avail.push('cbefore');if(sl.some(x=>x.before))avail.push('before');if(avail.length>1){D.ver=avail[(avail.indexOf(D.ver)+1)%avail.length];paintDetail(t);}}}});
grid.addEventListener('click',e=>{if(e.target.closest('[data-pick]')||e.target.closest('label.pick'))return;const c=e.target.closest('.card');if(c)openDetail(c.dataset.id);});
document.getElementById('exp').onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),reviews:REV},null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='typodeck-unified-reviews.json';a.click();};
document.getElementById('imp').onclick=()=>document.getElementById('impfile').click();
document.getElementById('impfile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);const inc=j.reviews||j;let n=0;for(const[k,v]of Object.entries(inc)){const cur=REV[k];if(!cur||(v.updatedAt||'')>(cur.updatedAt||'')){REV[k]=v;n++;}}store.save(REV);render();alert(`${n}개 리뷰 병합`);}catch{alert('JSON 오류')}};r.readAsText(f);};
render();
const qp=new URLSearchParams(location.search);if(qp.get('d')&&DATA.some(x=>x.id===qp.get('d')))openDetail(qp.get('d'),qp.get('tab')||'spec');
</script></body></html>
"""

(OUT / "index.html").write_text(PAGE.replace("__DATA__", json.dumps(DATA)))
n_q = sum(1 for d in DATA if d['src']['qdeck'])
n_p = sum(len(d['pptx']) for d in DATA)
n_cc = sum(1 for d in DATA if d['colorChanged'])
print(f"wrote index.html (27 cards, Q-decks {n_q}, pptx links {n_p}, color-changed {n_cc}, color-before {len(n_cbefore_refs)})")
