/* Typodeck review gallery. Reads window.TYPODECK_DATA (built by build-data.js
   from real repo artifacts). No finals are auto-selected; verdicts are human-only. */
(function () {
  'use strict';
  var D = window.TYPODECK_DATA;
  if (!D) { document.body.innerHTML = '<p style="padding:2em">data.js missing — run <code>node gallery/build-data.js</code>.</p>'; return; }

  var VERDICTS = ['KEEP', 'REVISE', 'MERGE', 'REJECT'];
  var LS_KEY = 'typodeck-gallery-decisions-v1';
  var LS_REV = 'typodeck-gallery-reviewer-v1';

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- decisions store ----------
  var store = {};
  try { store = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch (e) { store = {}; }
  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {}
    renderDecCount(); renderDecisions();
  }
  function getDec(key) { return store[key] || { verdict: '', comment: '', updatedAt: '' }; }
  function setVerdict(key, v) {
    var d = getDec(key);
    d.verdict = (d.verdict === v) ? '' : v; // toggle off
    d.updatedAt = d.verdict ? new Date().toISOString() : '';
    if (!d.verdict && !d.comment) delete store[key]; else store[key] = d;
    save(); refreshVerdictWidgets();
  }
  function setComment(key, c) {
    var d = getDec(key);
    d.comment = c;
    if (d.verdict) d.updatedAt = new Date().toISOString();
    else if (c) d.updatedAt = new Date().toISOString();
    if (!d.verdict && !d.comment) delete store[key]; else store[key] = d;
    try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {}
    renderDecCount(); renderDecisions();
  }

  // ---------- header / missing ----------
  var missing = D.files.filter(function (f) { return !f.exists; });
  var regN = D.registry ? D.registry.length : 0;
  $('buildLine').textContent = 'data built ' + D.generatedAt + ' · ' + regN +
    ' registry records · ' + D.reviewItems.length + ' reviewable candidates · ' +
    'narrative ' + ((D.manifest && D.manifest.narrativeSha256 || '').slice(0, 12)) + '… · seed ' +
    ((D.manifest && D.manifest.seed) ?? '?');
  $('footLine').textContent = 'Decisions are human-only; nothing here auto-selects finals.';
  if (missing.length || D.warnings.length) {
    var bar = $('missingBar');
    bar.hidden = false;
    var html = '<strong>' + missing.length + ' artifact(s) explicitly missing.</strong> Nothing is faked; affected views are labeled.';
    html += '<ul>' + missing.map(function (f) { return '<li>MISSING: ' + esc(f.path) + '</li>'; }).join('') +
      D.warnings.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>';
    bar.innerHTML = html;
  }

  // ---------- tabs ----------
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      ['references', 'interpretations', 'compare', 'decisions'].forEach(function (n) {
        $('tab-' + n).hidden = (n !== t.dataset.tab);
      });
    });
  });

  // ---------- verdict widget ----------
  function verdictWidget(key) {
    var d = getDec(key);
    var wrap = document.createElement('div');
    wrap.className = 'verdict';
    wrap.dataset.key = key;
    VERDICTS.forEach(function (v) {
      var b = document.createElement('button');
      b.textContent = v;
      b.title = 'Mark ' + key + ' as ' + v;
      if (d.verdict === v) b.classList.add('on-' + v);
      b.addEventListener('click', function () { setVerdict(key, v); });
      wrap.appendChild(b);
    });
    var c = document.createElement('input');
    c.className = 'comment';
    c.placeholder = 'comment…';
    c.value = d.comment || '';
    c.setAttribute('aria-label', 'Comment on ' + key);
    c.addEventListener('change', function () { setComment(key, c.value); });
    var frag = document.createDocumentFragment();
    frag.appendChild(wrap); frag.appendChild(c);
    return frag;
  }
  function refreshVerdictWidgets() {
    document.querySelectorAll('.verdict').forEach(function (wrap) {
      var d = getDec(wrap.dataset.key);
      Array.prototype.forEach.call(wrap.children, function (b) {
        b.classList.remove('on-KEEP', 'on-REVISE', 'on-MERGE', 'on-REJECT');
        if (d.verdict === b.textContent) b.classList.add('on-' + b.textContent);
      });
      var c = wrap.nextElementSibling;
      if (c && c.classList.contains('comment') && document.activeElement !== c) c.value = d.comment || '';
    });
  }

  // ---------- references ----------
  // Verification status is the primary trust signal: visually inspected
  // references are never shown as equivalent to search-checked ones.
  var STATUS_LABEL = {
    'inspected-reproduction': 'VISUALLY INSPECTED',
    'secondary-description': 'SEARCH-CHECKED',
    'not-inspected': 'NOT INSPECTED'
  };
  function statusBadge(st) {
    var cls = st === 'inspected-reproduction' ? 'verified'
      : st === 'secondary-description' ? 'secondary' : 'uninsp';
    return '<span class="badge status ' + cls + '" title="schema status: ' + esc(st) + '">' +
      esc(STATUS_LABEL[st] || st) + '</span>';
  }
  function statusClass(st) {
    return st === 'inspected-reproduction' ? 'st-inspected'
      : st === 'secondary-description' ? 'st-secondary' : 'st-uninsp';
  }
  // Candidate evidence panel (refs joined to live registry statuses at build time).
  function evidenceHtml(ev, label) {
    if (!ev) return '';
    var refs = (ev.refs || []).map(function (r) {
      if (r.missing) return '<li><span class="badge missing">MISSING REF</span> ' + esc(r.id) + '</li>';
      return '<li>' + statusBadge(r.status) + ' <span class="id">' + esc(r.id) + '</span> ' +
        esc(r.title || '') + ' <a href="' + esc(r.source_url) + '" target="_blank" rel="noopener">source ↗</a></li>';
    }).join('');
    var rules = (ev.rules || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    var gaps = (ev.gaps || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    return '<details class="ev"><summary>' + esc(label) + ' — refs, rules, known gaps (' +
      (ev.refs || []).length + ' refs)</summary>' +
      '<ul class="evrefs">' + refs + '</ul>' +
      (rules ? '<p class="muted">interpreted rules:</p><ul>' + rules + '</ul>' : '') +
      (gaps ? '<p class="muted">known differences / unsupported:</p><ul>' + gaps + '</ul>' : '') +
      '</details>';
  }
  var reviewByKey = {};
  D.reviewItems.forEach(function (r) { reviewByKey[r.key] = r; });
  var cats = D.registryStats ? Object.keys(D.registryStats.byCategory).sort() : [];
  var stats = D.registryStats ? Object.keys(D.registryStats.byStatus).sort() : [];
  var agents = D.registryStats && D.registryStats.byAgent
    ? Object.keys(D.registryStats.byAgent).sort() : [];
  $('fCat').innerHTML = '<option value="">all categories</option>' + cats.map(function (c) {
    return '<option>' + esc(c) + '</option>';
  }).join('');
  $('fStatus').innerHTML = '<option value="">all statuses</option>' + stats.map(function (s) {
    return '<option value="' + esc(s) + '">' + esc(STATUS_LABEL[s] || s) + '</option>';
  }).join('');
  if ($('fAgent')) {
    $('fAgent').innerHTML = '<option value="">all agents</option>' + agents.map(function (a) {
      var n = D.registryStats.byAgent[a];
      return '<option value="' + esc(a) + '">' + esc(a) + ' (' + n + ')</option>';
    }).join('');
  }
  if ($('statusLegend') && D.registryStats) {
    var bs = D.registryStats.byStatus;
    $('statusLegend').innerHTML = Object.keys(STATUS_LABEL).map(function (st) {
      return statusBadge(st) + ' <strong>' + (bs[st] || 0) + '</strong>';
    }).join(' &nbsp; ') + ' <span class="muted">— verification status is shown first on every card; ' +
      'inspected = page/surrogate seen, search-checked = metadata/description only, ' +
      'not inspected = inaccessible.</span>';
  }
  function renderRefs() {
    var list = $('refList');
    if (!D.registry) {
      list.innerHTML = '<p><span class="badge missing">MISSING</span> research/merged_registry.json was not found when data.js was built. Re-run <code>node gallery/build-data.js</code>.</p>';
      $('refCount').textContent = '';
      return;
    }
    var fc = $('fCat').value, fs = $('fStatus').value,
      fa = $('fAgent') ? $('fAgent').value : '',
      q = $('fQ').value.trim().toLowerCase();
    var rows = D.registry.filter(function (r) {
      if (fc && r.category !== fc) return false;
      if (fs && r.status !== fs) return false;
      if (fa && r.agent !== fa) return false;
      if (q) {
        var hay = [r.id, r.title, r.designer, r.source_url, r.agent,
          r.source_type, r.category, r.origCategory, r.summary,
          (r.primitives || []).join(' ')].join(' ').toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    $('refCount').textContent = rows.length + ' / ' + D.registry.length + ' records';
    list.innerHTML = rows.slice(0, 400).map(function (r) {
      var prims = (r.primitives || []).map(function (p) {
        return '<span class="badge">' + esc(p) + '</span>';
      }).join('');
      return '<article class="refcard ' + statusClass(r.status) + '">' +
        '<div>' + statusBadge(r.status) +
        (r.summaryRecon ? '<span class="badge secondary">summary reassembled from own fields</span>' : '') +
        (r.confCapped ? '<span class="badge secondary">confidence capped (was ' + esc(r.confClaimed || '?') + ')</span>' : '') + '</div>' +
        '<h3><span class="id">' + esc(r.id) + '</span>' + esc(r.title) + '</h3>' +
        '<div class="meta">' + esc(r.designer || 'unknown') +
        (r.year ? ' · ' + esc(r.year) : ' · year unknown') + ' · ' + esc(r.agent) + '</div>' +
        '<div class="meta">' + esc(r.category) +
        (r.origCategory && r.origCategory !== r.category ? ' (agent: ' + esc(r.origCategory) + ')' : '') +
        ' · ' + esc(r.source_type) + ' · ' + esc((r.adaptability && r.adaptability.rating) || '?') +
        ' adaptability · ' + esc(r.confidence || '?') + ' confidence</div>' +
        '<p><a href="' + esc(r.source_url) + '" target="_blank" rel="noopener">source ↗</a>' +
        (r.method ? ' <span class="muted">via ' + esc(r.method) + '</span>' : '') + '</p>' +
        (prims ? '<p>' + prims + '</p>' : '') +
        '<details open><summary>composition (agent observations)</summary><p>' + esc(r.summary || '—') + '</p>' +
        '<dl class="obs">' +
        '<dt>reading order</dt><dd>' + esc(r.reading_order || '—') + '</dd>' +
        '<dt>hierarchy</dt><dd>' + esc(r.hierarchy || '—') + '</dd>' +
        '<dt>grid</dt><dd>' + esc(r.grid || '—') + '</dd>' +
        '<dt>whitespace</dt><dd>' + esc(r.whitespace || '—') + '</dd>' +
        '<dt>techniques</dt><dd>' + esc((r.techniques || []).join('; ') || '—') + '</dd>' +
        (r.align ? '<dt>alignment</dt><dd>' + esc(r.align) + '</dd>' : '') +
        (r.rhythm ? '<dt>rhythm</dt><dd>' + esc(r.rhythm) + '</dd>' : '') +
        (r.scale ? '<dt>scale</dt><dd>' + esc(r.scale) + '</dd>' : '') +
        '</dl></details>' +
        '<details><summary>transfer + provenance</summary>' +
        '<p class="muted">adaptability: ' + esc((r.adaptability && r.adaptability.notes) || '—') + '</p>' +
        '<p class="muted">capabilities: ' + esc((r.capabilities || []).join('; ') || '—') + '</p>' +
        '<p class="muted">limitations: ' + esc(r.limitations || '—') + '</p>' +
        (r.context ? '<p class="muted">context: ' + esc(r.context) + '</p>' : '') +
        (r.publication ? '<p class="muted">publication: ' + esc(r.publication) + '</p>' : '') +
        (r.visualNotes ? '<p class="muted">agent verification note: ' + esc(r.visualNotes) + '</p>' : '') +
        '</details></article>';
    }).join('') + (rows.length > 400 ? '<p class="muted">First 400 of ' + rows.length + ' shown — narrow the filters.</p>' : '');
  }
  ['fCat', 'fStatus', 'fAgent'].forEach(function (id) {
    if ($(id)) $(id).addEventListener('change', renderRefs);
  });
  $('fQ').addEventListener('input', renderRefs);
  renderRefs();

  // ---------- interpretations ----------
  function slideShot(stageHtml, capHtml) {
    var d = document.createElement('div');
    d.className = 'shot pv';
    d.innerHTML = stageHtml + '<div class="cap">' + capHtml + '</div>';
    return d;
  }
  function renderInterp() {
    var host = $('sysList');
    host.innerHTML = '';
    $('interpIntro').textContent = D.manifest
      ? 'Identical narrative across systems ("' + D.manifest.narrativeTitle + '", seed ' + D.manifest.seed + '). ' +
        'Verdicts here sync with Compare and Decisions.'
      : 'Manifest missing — system list unavailable.';
    D.systems.forEach(function (s) {
      var card = document.createElement('div');
      card.className = 'syscard';
      var head = '<div class="syshead"><h2>' + esc(s.system) + '</h2>' +
        '<span class="badge ' + (s.status === 'experimental' ? 'experimental' : 'verified') + '">' +
        esc(s.status) + ' ' + esc(s.version) + '</span>' +
        (s.validationOk ? '<span class="badge verified">validatePptx OK</span>' : '<span class="badge missing">VALIDATION FAILED</span>') +
        (s.htmlParityOk ? '<span class="badge verified">text parity OK</span>' : '<span class="badge missing">PARITY FAILED</span>') +
        '<span class="links">' +
        (s.htmlExists ? '<a href="../' + esc(s.html) + '">full html</a>' : '<span class="badge missing">HTML MISSING</span>') +
        (s.pptxExists ? '<a href="../' + esc(s.pptx) + '">pptx</a>' : '<span class="badge missing">PPTX MISSING</span>') +
        '</span></div>';
      head += '<div class="muted">' + s.slides + ' slides · ' + s.textBoxes + ' text boxes · ' +
        s.editableChars + ' editable chars · ' + s.bytes + ' bytes</div>';
      head += '<div class="muted">Inline slides below are HTML renders, not PPTX proof — ' +
        'open the linked PPTX to judge editable output.</div>';
      if (s.evidence) head += evidenceHtml(s.evidence, 'system evidence');
      card.innerHTML = head;
      var shots = document.createElement('div');
      shots.className = 'shots';
      if (!s.htmlExists) {
        shots.innerHTML = '<p><span class="badge missing">MISSING</span> No rendered slides: ' + esc(s.html) + ' not found.</p>';
      } else {
        s.renderedSlides.forEach(function (sl, i) {
          var cand = (s.candidates && s.candidates[i]) || 'unknown-candidate';
          var key = s.system + ':' + cand;
          var cell = document.createElement('div');
          var shot = slideShot(sl.stageHtml, 'HTML render · ' + esc(sl.meta));
          cell.appendChild(shot);
          var ri = reviewByKey[key];
          if (ri && ri.evidence) {
            var evd = document.createElement('div');
            evd.innerHTML = evidenceHtml(ri.evidence, 'candidate evidence');
            cell.appendChild(evd);
          }
          cell.appendChild(verdictWidget(key));
          shots.appendChild(cell);
        });
      }
      card.appendChild(shots);
      // Unexercised doc-only candidates (no preview rendered)
      var unex = D.reviewItems.filter(function (r) { return r.system === s.system && !r.previewRendered; });
      if (unex.length) {
        var u = document.createElement('div');
        u.innerHTML = '<p class="muted">Composition candidates with <strong>no rendered preview</strong> (missing, not faked):</p>';
        unex.forEach(function (r) {
          var row = document.createElement('div');
          row.innerHTML = '<p><span class="badge missing">NO PREVIEW</span> <code>' + esc(r.candidate) + '</code></p>' +
            evidenceHtml(r.evidence, 'candidate evidence');
          row.appendChild(verdictWidget(r.key));
          u.appendChild(row);
        });
        card.appendChild(u);
      }
      host.appendChild(card);
    });
    if (!D.systems.length) host.innerHTML = '<p><span class="badge missing">MISSING</span> No systems in manifest.</p>';
  }
  renderInterp();

  // ---------- compare ----------
  var cmpSel = $('cSlide');
  cmpSel.innerHTML = D.slideLabels.map(function (m, i) {
    return '<option value="' + i + '">' + esc(m) + '</option>';
  }).join('') || '<option value="">(no slides)</option>';
  var cmpChecks = $('cSysChecks');
  cmpChecks.innerHTML = D.systems.map(function (s) {
    return '<label><input type="checkbox" checked value="' + esc(s.system) + '"> ' + esc(s.system) + '</label>';
  }).join('');
  function renderCompare() {
    var grid = $('cmpGrid');
    grid.innerHTML = '';
    var idx = parseInt(cmpSel.value, 10);
    var on = Array.prototype.filter.call(cmpChecks.querySelectorAll('input:checked'), function (x) { return x; })
      .map(function (x) { return x.value; });
    grid.className = 'cmpgrid cols-' + Math.min(Math.max(on.length, 1), 4);
    if (isNaN(idx)) { grid.innerHTML = '<p><span class="badge missing">MISSING</span> No slides available.</p>'; return; }
    if (!on.length) { grid.innerHTML = '<p class="muted">Select at least one system.</p>'; return; }
    on.forEach(function (name) {
      var s = D.systems.filter(function (x) { return x.system === name; })[0];
      var col = document.createElement('div');
      col.className = 'cmpcol pv';
      if (!s || !s.renderedSlides[idx]) {
        col.innerHTML = '<div class="cap"><strong>' + esc(name) + '</strong> ' +
          '<span class="badge missing">SLIDE MISSING</span></div>';
      } else {
        var cand = (s.candidates && s.candidates[idx]) || 'unknown-candidate';
        col.innerHTML = '<div class="cap"><strong>' + esc(name) + '</strong> · <code>' +
          esc(cand) + '</code> <span class="muted">(HTML render)</span></div>' + s.renderedSlides[idx].stageHtml;
        var cri = reviewByKey[name + ':' + cand];
        if (cri && cri.evidence) {
          var cev = document.createElement('div');
          cev.innerHTML = evidenceHtml(cri.evidence, 'candidate evidence');
          col.appendChild(cev);
        }
        col.appendChild(verdictWidget(name + ':' + cand));
      }
      grid.appendChild(col);
    });
  }
  cmpSel.addEventListener('change', renderCompare);
  cmpChecks.addEventListener('change', renderCompare);
  renderCompare();

  // ---------- decisions ----------
  $('reviewer').value = localStorage.getItem(LS_REV) || '';
  $('reviewer').addEventListener('change', function () {
    try { localStorage.setItem(LS_REV, $('reviewer').value); } catch (e) {}
  });
  function decidedCount() {
    return D.reviewItems.filter(function (r) { return getDec(r.key).verdict; }).length;
  }
  function renderDecCount() {
    $('decCount').textContent = String(decidedCount());
    $('decProgress').textContent = decidedCount() + ' / ' + D.reviewItems.length + ' candidates decided';
  }
  function renderDecisions() {
    var tb = $('decBody');
    tb.innerHTML = '';
    D.reviewItems.forEach(function (r) {
      var d = getDec(r.key);
      var tr = document.createElement('tr');
      var rev = d.updatedAt ? d.updatedAt.slice(0, 16).replace('T', ' ') : '—';
      var evCell = '<span class="muted">—</span>';
      if (r.evidence && r.evidence.refs && r.evidence.refs.length) {
        evCell = r.evidence.refs.map(function (e) {
          if (e.missing) return '<span class="badge missing">MISSING ' + esc(e.id) + '</span>';
          var cls = e.status === 'inspected-reproduction' ? 'verified'
            : e.status === 'secondary-description' ? 'secondary' : 'uninsp';
          return '<span class="badge ' + cls + '" title="' + esc(e.title || '') + '">' + esc(e.id) + '</span>';
        }).join(' ');
      }
      tr.innerHTML = '<td>' + esc(r.system) + (r.docOnly ? ' <span class="badge experimental">doc-only</span>' : '') + '</td>' +
        '<td><code>' + esc(r.candidate) + '</code></td>' +
        '<td>' + evCell + '</td>' +
        '<td>' + (r.previewRendered
          ? esc(r.slideIndexes.map(function (i) { return 'slide ' + (i + 1); }).join(', '))
          : '<span class="badge missing">NO PREVIEW</span>') + '</td>' +
        '<td><select class="vsel" data-key="' + esc(r.key) + '"><option value="">—</option>' +
        VERDICTS.map(function (v) { return '<option' + (d.verdict === v ? ' selected' : '') + '>' + v + '</option>'; }).join('') +
        '</select></td>' +
        '<td class="c">' + esc(d.comment || '—') + '</td><td class="muted">' + esc(rev) + '</td>';
      tb.appendChild(tr);
    });
    tb.querySelectorAll('.vsel').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var key = sel.dataset.key, d = getDec(key);
        d.verdict = sel.value;
        d.updatedAt = sel.value ? new Date().toISOString() : (d.comment ? d.updatedAt : '');
        if (!d.verdict && !d.comment) delete store[key]; else store[key] = d;
        save(); refreshVerdictWidgets();
      });
    });
    renderDecCount();
  }
  renderDecisions();

  function exportPayload() {
    return {
      tool: 'typodeck-review-gallery',
      exportedAt: new Date().toISOString(),
      reviewer: $('reviewer').value || '',
      dataBuiltAt: D.generatedAt,
      narrative: D.manifest ? {
        title: D.manifest.narrativeTitle, sha256: D.manifest.narrativeSha256, seed: D.manifest.seed,
      } : null,
      decisions: D.reviewItems.map(function (r) {
        var d = getDec(r.key);
        return {
          key: r.key, system: r.system, candidate: r.candidate,
          slideIndexes: r.slideIndexes, previewRendered: r.previewRendered,
          verdict: d.verdict || null, comment: d.comment || '', updatedAt: d.updatedAt || null,
        };
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
    download('typodeck-review-decisions.json', JSON.stringify(exportPayload(), null, 2), 'application/json');
  });
  $('expCsv').addEventListener('click', function () {
    var p = exportPayload();
    function q(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }
    var lines = ['reviewer,exportedAt,system,candidate,slides,previewRendered,verdict,comment,updatedAt,narrativeSha256'];
    p.decisions.forEach(function (d) {
      lines.push([q(p.reviewer), q(p.exportedAt), q(d.system), q(d.candidate),
        q(d.slideIndexes.map(function (i) { return i + 1; }).join(';')), q(d.previewRendered),
        q(d.verdict || ''), q(d.comment), q(d.updatedAt || ''),
        q(p.narrative ? p.narrative.sha256 : '')].join(','));
    });
    download('typodeck-review-decisions.csv', lines.join('\n') + '\n', 'text/csv');
  });
  $('impFile').addEventListener('change', function (ev) {
    var f = ev.target.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        var p = JSON.parse(rd.result);
        if (p.reviewer != null) { $('reviewer').value = p.reviewer; try { localStorage.setItem(LS_REV, p.reviewer); } catch (e) {} }
        (p.decisions || []).forEach(function (d) {
          if (!d.key) return;
          if (!d.verdict && !d.comment) delete store[d.key];
          else store[d.key] = { verdict: d.verdict || '', comment: d.comment || '', updatedAt: d.updatedAt || '' };
        });
        save(); refreshVerdictWidgets();
      } catch (e) { alert('Import failed: ' + e.message); }
      ev.target.value = '';
    };
    rd.readAsText(f);
  });
  $('clearAll').addEventListener('click', function () {
    if (!confirm('Clear all verdicts and comments?')) return;
    store = {};
    save(); refreshVerdictWidgets();
  });
})();
