# Before/After Reconciliation — Full-Field Research Recovery (2026-10-30)

Recovery + integration of the five recovered agent files (A–E) into the
merged registry, gallery, and candidate analysis. The rebuilt gallery and
updated candidate analysis below are ready for human review. No finals were
selected; no systems were promoted.

## 1. Record counts (exact)

| Measure | Value |
|---|---|
| Recovered (A=100, B=70, C=100, D=100, E=77) | 447 |
| Accepted into merged registry | 447 |
| Deduplicated (dropped as dupes) | 0 |
| Rejected (schema violations) | 0 |
| Gallery-visible (browsable, all filters) | 447 |
| Merge conflicts | 0 (all 447 canonical source URLs verified unique) |
| Missing vs 500 target (B −30, E −23) | 53 — left missing, not fabricated |

Verification split after rebuild: **235 visually inspected /
190 search-checked / 22 inaccessible** (was: 149 / 208 / 13 over 370 stubs).

## 2. Registry: stubs → full-field

Before: `research/merged_registry.{jsonl,json}` held 370 stub records (A–D
only; designer/year/composition withheld as `unknown`; D's 42 verified
unattributable; E absent). Snapshots preserved at
`research/history/stub-era/`.

After: 447 records with full agent observations carried through
(`research/merge_full.py`, re-runnable; mapping rules in
`research/merge_report.md`):
real titles/designers/years, verbatim composition summaries + primitives,
hierarchy/grid/whitespace, text-treatment techniques, capability lists, and
adaptability judgments. Fields the schema has no slot for (alignment, rhythm,
scale, context, publication, check/verification methods and notes,
`inspection_detail`, original categories) are preserved verbatim per record in
the new `research/merge_provenance.json` sidecar and surfaced in the gallery —
carried, not dropped.

Explicit judgment calls (all reported, none silent):
- Confidence capped on 11 records so search-checked/inaccessible evidence is
  never equivalent to inspected evidence (B-142/143/144/145/146/148/149 →
  low; C-205/241/245/248 → low). Badged in the gallery.
- 2 summaries (C-268, C-269) reassembled from their own analysis fields with
  a labeled prefix (`/ `-joined) and `summary_reconstructed` flag. Badged.
- `originality_notes` is `unknown` on all 447 (never recorded upstream —
  genuine gap, not a stub).
- No record claims `inspected-primary` (no agent saw a physical artifact).

## 3. Gallery: rebuilt, decisions preserved

- `gallery/data.js` rebuilt from the 447-record registry + provenance:
  build reports **26 review items, 447 registry records, 0 missing files,
  0 warnings**.
- Verification status is now the primary trust signal: every card leads with
  VISUALLY INSPECTED / SEARCH-CHECKED / NOT INSPECTED, has a matching card
  tint, and the References tab carries a status legend with live counts
  (235 / 190 / 22). New agent filter (A–E) keeps the G5/G7 corpora browsable
  despite 149 `other` schema categories; original agent categories shown.
- Cards now show full composition observations + transfer/provenance detail
  (was: summary + limitations only).
- Human decisions preserved: all 26 review-item keys byte-identical and in
  order vs the pre-rebuild bundle; `localStorage` keys
  (`typodeck-gallery-decisions-v1`, reviewer key) and export/import formats
  untouched. Interpretations/Compare/Decisions logic unchanged.
- Render smoke (`/tmp/gallery-render-smoke.js`, kept): all 447 records
  render through the real `app.js` paths; all three status tiers, tints,
  provenance, and legend counts asserted. Open `gallery/index.html`
  directly (`file://` works) or serve the repo root.

## 4. Candidate analysis: recomputed with East Asian typography

`research/candidate_visual_systems.md` rewritten from directly-read record
evidence (every claim cites record ids with inspected/search-checked splits);
stub-era version preserved at
`research/history/stub-era/candidate_visual_systems.md`.

- New **G7 East Asian typography** cluster (E corpus: 44 inspected, 27 of
  them high-adaptability): Hangul-first multiscript alignment, per-script
  credit architecture, syllable-block composition, serial grids, faceted
  index, thesis-exhibition pattern, preface-kickers — plus infeasible
  vertical/ruby/kinsoku rows.
- New principle #8 (dominant-script metrics first) and 4 new repeated
  patterns from G7.
- S1 (`document`) re-evaluated against re-inspected G4 records:
  hierarchy-stack distinctness confirmed, but the verbatim-role need is only
  8/27 inspected → **stays a conditional candidate**.
- New **S6 mixed-script/vertical system — REJECTED** (transferable half is
  candidate-level; distinctive half infeasible). S2/S3/S4/S5 verdicts stand
  on upgraded [Ri]-grounded evidence.

## 5. Experimental system: untouched, not promoted

Zero changes under `packages/`, `apps/`, or any tracked file (`git status`
shows only the five restored untracked dirs). The `document` system remains
experimental (`0.1.0`); no new Visual Systems implemented; no schema roles
added. `research/implementation_notes.md` byte-identical (md5 verified).

## 6. Preserved artifacts (verified)

- Original agent files byte-identical (md5 matches stash blobs):
  A `99cfc2d5…`, B `9476aea8…`, C `19ef3294…`, D `cec06d6f…`, E `b78ea34f…`.
- Stub-era `merge_report.md`, `candidate_visual_systems.md`,
  `merged_registry.jsonl` snapshotted under `research/history/stub-era/`.
- Unrelated work: no tracked file modified; the user's
  `stash@{0}` ("wip-before-github-journey") kept intact.

Note: mid-task, an external `git stash -u` + reset wiped all untracked
research/gallery/previews content from the tree. The exact bytes were
recovered from `stash@{0}^3` (verified by line counts + md5); only the five
task-needed paths were restored, nothing else touched.

## 7. Verification

- `python3 research/merge_full.py` → recovered 447, accepted 447,
  dedup-dropped 0, rejected 0, exit 0.
- `python3 research/validate.py research/merged_registry.jsonl` → 447
  records, OK, exit 0 (same for `.json`; each validated separately to avoid
  double-counting).
- `npm test` → **250/250 pass** (run in disposable worktree `/tmp/typodeck-
  verify` = HEAD + stashed wip + this recovery; log kept at
  `/tmp/typodeck-verify-tests.log`. Note: HEAD alone does not compile —
  pre-existing breakage fixed by the stashed wip, unrelated to this task.)
- `npm run benchmark-90` → **64/64 runs succeeded** (seed 42, incl. the
  experimental `document` system; exit 0; log at
  `/tmp/typodeck-verify-bench.log`).
- Gallery: `node --check` on `app.js`/`build-data.js`, rebuild with
  0 warnings, render smoke passed (above).

## 8. Ready for human review

1. Open `gallery/index.html` → References (447, tiered) → Interpretations /
   Compare (6-slide comparable previews, 4 systems) → Decisions (26 items,
   export JSON/CSV).
2. Read `research/candidate_visual_systems.md` (§4 S1 condition, §5 new G7
   infeasible rows) and `research/merge_report.md` (§8 gaps).
3. Open decisions: S1 promotion vs fold-into-swiss; `verbatim-role` schema
   addition; future candidate folds (S2/S3/S6 transferable patterns).
   The missing 53 references remain unfilled by design.
