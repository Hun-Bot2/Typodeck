/* Typodeck PPT review scores. Reads window.PPT_REVIEW_DATA. */
(function () {
  'use strict';
  var D = window.PPT_REVIEW_DATA;
  if (!D) { document.body.innerHTML = '<p style="padding:2em">data.js missing — run <code>node review/build-data.js</code>.</p>'; return; }

  var LS_KEY = 'typodeck-ppt-scores-v1';
  var LS_REV = 'typodeck-ppt-reviewer-v1';

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function kb(n) { return n == null ? '?' : (n / 1024).toFixed(0) + 'KB'; }

  var store = {};
  try { store = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch (e) { store = {}; }
  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {}
    renderProgress();
  }
  function get(id) { return store[id] || { score: null, comment: '', updatedAt: '' }; }
  function setScore(id, v) {
    var d = get(id);
    d.score = (d.score === v) ? null : v; // toggle off on re-click
    d.updatedAt = d.score == null && !d.comment ? '' : new Date().toISOString();
    if (d.score == null && !d.comment) delete store[id]; else store[id] = d;
    save(); render();
  }
  function setComment(id, c) {
    var d = get(id);
    d.comment = c;
    d.updatedAt = (d.score == null && !c) ? '' : new Date().toISOString();
    if (d.score == null && !c) delete store[id]; else store[id] = d;
    try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {}
    renderProgress();
  }

  var groupLabel = {};
  D.groups.forEach(function (g) { groupLabel[g.id] = g.label; });

  $('fGroup').innerHTML = '<option value="">전체 그룹</option>' + D.groups.map(function (g) {
    return '<option value="' + esc(g.id) + '">' + esc(g.label) + ' (' + g.count + ')</option>';
  }).join('');

  function scoreClass(v) {
    if (v == null) return '';
    if (v <= 3) return 's-lo';
    if (v <= 6) return 's-mid';
    return 's-hi';
  }

  function renderProgress() {
    var n = 0, sum = 0;
    D.files.forEach(function (f) {
      var d = store[f.id];
      if (d && d.score != null) { n++; sum += d.score; }
    });
    $('progress').textContent = 'data ' + D.generatedAt.slice(0, 16).replace('T', ' ') +
      ' · ' + n + ' / ' + D.files.length + ' 채점' +
      (n ? ' · 평균 ' + (sum / n).toFixed(1) : '');
    $('footLine').textContent = n + ' scored, ' + (D.files.length - n) + ' remaining.';
  }

  function render() {
    var fg = $('fGroup').value, fs = $('fStatus').value,
      q = $('fQ').value.trim().toLowerCase(), sort = $('fSort').value;
    var rows = D.files.filter(function (f) {
      if (fg && f.group !== fg) return false;
      var scored = !!(store[f.id] && store[f.id].score != null);
      if (fs === 'scored' && !scored) return false;
      if (fs === 'unscored' && scored) return false;
      if (q && f.name.toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    if (sort !== 'group') {
      rows.sort(function (a, b) {
        var sa = store[a.id], sb = store[b.id];
        var va = sa && sa.score != null ? sa.score : -1;
        var vb = sb && sb.score != null ? sb.score : -1;
        return sort === 'score-desc' ? vb - va : va - vb;
      });
    }
    var host = $('list');
    host.innerHTML = '';
    var lastGroup = null;
    rows.forEach(function (f) {
      if (f.group !== lastGroup) {
        lastGroup = f.group;
        var h = document.createElement('h2');
        h.className = 'ghead';
        var g = D.groups.filter(function (x) { return x.id === f.group; })[0] || {};
        h.textContent = (g.label || f.group) + (g.desc ? ' — ' + g.desc : '');
        host.appendChild(h);
      }
      var d = get(f.id);
      var card = document.createElement('article');
      card.className = 'card ' + scoreClass(d.score);
      var btns = '';
      for (var v = 0; v <= 10; v++) {
        btns += '<button data-v="' + v + '" class="' + (d.score === v ? 'on' : '') +
          '" title="' + v + '점">' + v + '</button>';
      }
      card.innerHTML =
        '<div class="row1"><span class="fname">' + esc(f.name) + '</span>' +
        '<span class="meta">' + (f.slides == null ? '?' : f.slides) + ' slides · ' + kb(f.bytes) + '</span></div>' +
        '<div class="row2"><a class="open" href="../' + esc(f.path) + '">PPT 열기</a>' +
        (f.html ? '<a class="open html" href="../' + esc(f.html) + '">HTML 미리보기</a>' : '') +
        (d.score != null ? '<span class="cur">현재: ' + d.score + '점</span>' : '<span class="cur muted">미채점</span>') + '</div>' +
        '<div class="scores" data-id="' + esc(f.id) + '">' + btns + '</div>' +
        '<input class="comment" data-id="' + esc(f.id) + '" placeholder="코멘트 (선택)…" value="' + esc(d.comment || '') +
        '" aria-label="코멘트 ' + esc(f.name) + '">';
      host.appendChild(card);
    });
    host.querySelectorAll('.scores').forEach(function (box) {
      box.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'BUTTON') setScore(box.dataset.id, parseInt(ev.target.dataset.v, 10));
      });
    });
    host.querySelectorAll('.comment').forEach(function (c) {
      c.addEventListener('change', function () { setComment(c.dataset.id, c.value); });
    });
    if (!rows.length) host.innerHTML = '<p class="muted">조건에 맞는 파일이 없습니다.</p>';
    renderProgress();
  }

  ['fGroup', 'fStatus', 'fSort'].forEach(function (id) { $(id).addEventListener('change', render); });
  $('fQ').addEventListener('input', render);

  // reviewer + export/import
  $('reviewer').value = localStorage.getItem(LS_REV) || '';
  $('reviewer').addEventListener('change', function () {
    try { localStorage.setItem(LS_REV, $('reviewer').value); } catch (e) {}
  });
  function payload() {
    return {
      tool: 'typodeck-ppt-review', exportedAt: new Date().toISOString(),
      reviewer: $('reviewer').value || '', dataBuiltAt: D.generatedAt,
      scores: D.files.map(function (f) {
        var d = get(f.id);
        return { id: f.id, group: f.group, name: f.name, path: f.path, slides: f.slides,
          score: d.score, comment: d.comment || '', updatedAt: d.updatedAt || null };
      }),
    };
  }
  function download(name, text, type) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type }));
    a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  $('expJson').addEventListener('click', function () {
    download('ppt-scores.json', JSON.stringify(payload(), null, 2), 'application/json');
  });
  $('expCsv').addEventListener('click', function () {
    var p = payload();
    function q(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }
    var lines = ['reviewer,exportedAt,group,name,slides,score,comment,updatedAt,path'];
    p.scores.forEach(function (s) {
      lines.push([q(p.reviewer), q(p.exportedAt), q(s.group), q(s.name),
        q(s.slides == null ? '' : s.slides), q(s.score == null ? '' : s.score),
        q(s.comment), q(s.updatedAt || ''), q(s.path)].join(','));
    });
    download('ppt-scores.csv', lines.join('\n') + '\n', 'text/csv');
  });
  $('impFile').addEventListener('change', function (ev) {
    var f = ev.target.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        var p = JSON.parse(rd.result);
        if (p.reviewer != null) { $('reviewer').value = p.reviewer; try { localStorage.setItem(LS_REV, p.reviewer); } catch (e) {} }
        (p.scores || []).forEach(function (s) {
          if (!s.id) return;
          if (s.score == null && !s.comment) delete store[s.id];
          else store[s.id] = { score: s.score, comment: s.comment || '', updatedAt: s.updatedAt || '' };
        });
        save(); render();
      } catch (e) { alert('가져오기 실패: ' + e.message); }
      ev.target.value = '';
    };
    rd.readAsText(f);
  });
  $('clearAll').addEventListener('click', function () {
    if (!confirm('모든 점수와 코멘트를 지울까요?')) return;
    store = {};
    save(); render();
  });

  render();
})();
