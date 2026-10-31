# Typodeck demo evidence — manifest

Reproducible evidence package for three pipeline-generated decks. Everything below
was observed in this worktree; nothing is invented. All file work happened inside
`showcase/` on `integrate/release-readiness` (produced on branch `showcase/demo-evidence`, base `ff68b70`);
the parent tree `/Users/jeonghun/Typodeck` was never written to.

## 1. Environment

- Location: `showcase/` on `integrate/release-readiness`; produced on branch `showcase/demo-evidence`, base commit `ff68b70`
  ("Checkpoint: Skill benchmark vs 3 external Skills + R1–R8 refinements").
- Work left UNCOMMITTED per repo convention (parent commits after review).
- Install: `NPM_CONFIG_CACHE=/tmp/npm-cache-show npm ci` — OK (53 packages).
- Build: `npm run build -w @typodeck/core` — see §7 (pre-existing breakage, pipeline unaffected).
- Date (UTC): 2026-10-30. Provider for all runs: `fallback` (deterministic, no model key).
- GitHub API budget: **10 of 12 used** (1 `rate_limit` + 3 repo-metadata + 6 pipeline).
  Quota at start: core remaining 58/60 (proceeded; abort threshold was < 15).

## 2. Repos, pins, purposes

| # | Repo (fits ≤20 files / 200 KB — see §4) | Branch | Pinned SHA (HEAD @ run) | System | Purpose | Why this purpose + system |
|---|------------------------------------------|--------|--------------------------|--------|---------|---------------------------|
| 1 | https://github.com/sindresorhus/is (small dev tool: type checks) | `main` | `e9c026c611c1160eaad50da00be4e676b626018f` | swiss | `Tool showcase: is` | Single-purpose API; swiss 4-column grid suits dense factual/API claims; "showcase" frames a capability overview. |
| 2 | https://github.com/iamkun/dayjs (substantial OSS lib: date-time, alt. to Moment.js) | `dev` | `436bde0bcded312781cbe45dc2b0ef079a36d8e3` | editorial | `Adoption case for Day.js` | Migration thesis + size numbers; editorial asymmetric serif gives one big idea per slide; number slides surface the size story. |
| 3 | https://github.com/microsoft/TypeScript-Handbook (docs-heavy: handbook pages) | `master` | `543d2dff18ef2a081fba88753931142ffe887a1e` | expressive | `Docs guide: TypeScript Handbook` | Long-form doc prose; expressive centered hero dramatizes guide sections and exercises the third system. |

SHA pinning: commit SHAs via `git ls-remote https://github.com/<o>/<r> HEAD`
(zero API cost). The pipeline-reported `sha` was **identical** to the ls-remote HEAD
SHA in all three runs, so the recorded tree/content SHA doubles as the commit pin.
Language: `en` for all runs.

## 3. Exact commands

From the repo root (`showcase/run-deck.js` wraps the real pipeline:
`planDeck` → `exportToPptx` → `validatePptx`, and saves deck JSON + a provenance report):

```sh
node showcase/run-deck.js --repo sindresorhus/is --system swiss \
  --purpose "Tool showcase: is" --lang en \
  --out showcase/decks/is-swiss.pptx --json showcase/decks/is-swiss.json

node showcase/run-deck.js --repo iamkun/dayjs --system editorial \
  --purpose "Adoption case for Day.js" --lang en \
  --out showcase/decks/dayjs-editorial.pptx --json showcase/decks/dayjs-editorial.json

node showcase/run-deck.js --repo microsoft/TypeScript-Handbook --system expressive \
  --purpose "Docs guide: TypeScript Handbook" --lang en \
  --out showcase/decks/handbook-expressive.pptx --json showcase/decks/handbook-expressive.json

node showcase/make-previews.js   # filmstrip HTML (SlideView-faithful) + geometry audit
python3 showcase/spot-check.py   # independent a:t / forbidden-element check over the PPTX zips
```

Screenshots (headless Chrome, verified working before use):

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --screenshot=<name>.filmstrip.png --window-size=1440,3000 "file://$PWD/<name>.filmstrip.html"
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --screenshot=<name>.slide1.png --window-size=1280,720 "file://$PWD/<name>.slide1.html"
```

## 4. Seeds, ingestion, claims, outputs

Seeds come from `deck.meta.seed` (layout default = hash of narrative bytes; the CLI
exposes no `--seed` flag, so there is no seed to set — determinism is by content hash).

### Deck 1 — `is-swiss` (seed `1143001754`)

- Ingested: **7 files, 31,963 bytes**, degraded=false. Files: `readme.md`
  (23,604 B / 925 lines), `.github/security.md` (170), `AGENTS.md` (781),
  `CLAUDE.md` (9), `license` (1,117), `source/utilities.ts` (211),
  `source/types.ts` (6,071). No truncations.
- Claims: total 38, verified 29, suggestion 9, ungrounded 0.
- Warnings: `built with the deterministic fallback (not model inference)`.
- Output: `showcase/decks/is-swiss.pptx` (134,653 B), 12 slides, 46 text boxes.
- Validator: OK — 12 slides, 46 text shapes, 1,332 editable chars, 13.33×7.5 in.

### Deck 2 — `dayjs-editorial` (seed `1713200736`)

- Ingested: **20 files, 30,275 bytes** (file cap reached; further files skipped),
  degraded=false. Files: `README.md` (7,864), `docs/zh-cn/README.zh-CN.md` (3,882),
  `.github/ISSUE_TEMPLATE/--bug-report.md` (430), `CONTRIBUTING.md` (1,124),
  `docs/demo/index.js` (867), `docs/en/{API-reference,I18n,Installation,Plugin}.md`
  (79 each), `docs/es-es/{API-reference,I18n,Installation,Plugin}.md` (80 each),
  `docs/es-es/README-es-es.md` (5,286), `docs/fr/README-fr.md` (4,703),
  `docs/he/README-he.md` (5,163), `docs/ja/{API-reference,I18n,Installation,Plugin}.md`
  (80 each). No truncations.
- Claims: total 40, verified 3, suggestion 37, ungrounded 0.
- Warnings: `file cap reached (20); remaining files skipped` + fallback note.
- Output: `showcase/decks/dayjs-editorial.pptx` (136,351 B), 12 slides, 46 text boxes.
- Validator: OK — 12 slides, 46 text shapes, 1,987 editable chars, 13.33×7.5 in.

### Deck 3 — `handbook-expressive` (seed `33113867`)

- Ingested: **20 files, 167,837 bytes** (file cap reached), degraded=false. Files:
  `README.md` (1,152), `.github/PULL_REQUEST_TEMPLATE.md` (717), `CONTRIBUTING.md`
  (475), `LICENSE` (11,358), `pages/Advanced Types.md` (45,016),
  `pages/Basic Types.md` (10,632), `pages/Classes.md` (19,657),
  `pages/Compiler Options in MSBuild.md` (9,998), `pages/Compiler Options.md`
  (22,418), `pages/Configuring Watch.md` (4,123), `pages/declaration files/By
  Example.md` (5,161), `Consumption.md` (1,637), `Deep Dive.md` (7,087), `Do's and
  Don'ts.md` (6,239), `Introduction.md` (2,504), `Library Structures.md` (12,861),
  `Publishing.md` (4,255), `Templates.md` (399),
  `templates/global-modifying-module.d.ts.md` (1,237),
  `templates/global-plugin.d.ts.md` (911). No truncations.
- Claims: total 40, verified 0, suggestion 40, ungrounded 0.
- Warnings: `file cap reached (20); remaining files skipped` + fallback note.
- Output: `showcase/decks/handbook-expressive.pptx` (136,338 B), 12 slides, 46 boxes.
- Validator: OK — 12 slides, 46 text shapes, 1,909 editable chars, 13.33×7.5 in.

Full per-run provenance (files, bytes, warnings, validation stats) is archived in
`showcase/decks/<name>.provenance.json`.

## 5. Editability verification

1. **Repo validator** (`validatePptx`, runs inside every `run-deck.js` invocation):
   all three decks OK — 16:9 slide size, all text boxes in bounds, no forbidden
   elements, editable-char floor met.
2. **Independent a:t spot check** (`showcase/spot-check.py`, stdlib zipfile):
   all 36 slides — every deck-JSON block's full content found inside that slide's
   `<a:t>` runs (HTML-unescaped), 46 `<a:t>` nodes per deck, zero forbidden
   elements (`p:pic`, `p:cxnSp`, `p:graphicFrame`, `a:blip`, `p:contentPart`,
   `a:tbl`, `v:shape`, `a:gradFill`). Result: 3/3 OK, 0 mismatches.
3. **Offline regeneration**: re-exporting each saved deck JSON via `exportToPptx`
   reproduces 12 slides / 46 boxes with validation OK. PPTX **bytes** differ
   between exports (pptxgenjs embeds timestamps) — the determinism guarantee covers
   layout JSON, not zip bytes.

## 6. Previews and visual defects

Method: static HTML filmstrips rendered from the actual deck JSON with the exact
`SlideView.tsx` geometry mapping and `globals.css` `.slide`/`.slide-block` rules
(grid arrangement instead of the studio's horizontal strip, so one screenshot
captures all slides), rasterized with headless Chrome. These are **HTML-geometry
previews, not PPTX renders** (see §8). Geometry audit (pairwise block overlap +
bounds on deck inches): clean on all 36 slides. All 36 slides visually inspected.

- `showcase/previews/<name>.filmstrip.png` — all 12 slides per deck.
- `showcase/previews/<name>.slide1.png` — cover at 1280×720.
- `showcase/previews/<name>.filmstrip.html` / `<name>.slide1.html` — sources.

**Layout verdict: no layout defects.** No overlaps, no out-of-bounds boxes, no
text clipping observed in any of the 36 slides; kicker/title/body/caption roles
render in the right places on all three systems.

**Content defects found (all are claim/evidence quality, not layout):**

- D1 — Number slides from URL artifacts: is slide 2 (`78019` from a type-fest blob
  URL); dayjs slide 2 (`17680888`, a user-images user ID) and slide 3 (`2345`,
  from a shields.io badge URL). Correctly labeled `unverified`, but meaningless.
- D2 — Raw markup as slide text: dayjs slides 8–11 (`alt="Gzip Size"></a>`,
  `alt="NPM Version"></a>`, shields `src="…"` URLs); handbook slide 6
  (`![Build Status](https://…)` raw markdown). Badge/HTML lines are not stripped.
- D3 — LICENSE boilerplate as claims: handbook slides 2–3 (`Version 2.0, January
  2004`, `Sections 1 through 9`) sourced from `LICENSE`.
- D4 — Duplicate slides: is slides 8 and 10 repeat the same `import {assert}`
  claim (no claim dedup).
- D5 — Nav/process cruft as claims: dayjs slide 1 + 7 (i18n language-link list),
  handbook slide 11 (PR-process sentence), is slide 11 (from `AGENTS.md`, an agent
  instructions file — questionable source).
- D6 — Title/body redundancy on every claim slide (title = shortened claim, body =
  full claim) — structural, reads repetitively.
- D7 — handbook has 0 verified / 40 suggestion claims; honesty labeling works
  (every caption carries `unverified`), but nothing is grounded.

## 7. Failures

- `npm run build -w @typodeck/core` exits non-zero: `src/slide-ir.ts` is a corrupt
  fragment at HEAD `ff68b70` (verified byte-identical in the parent tree — a
  committed defect, not local damage), plus an error in
  `scripts/visual-benchmark.ts`. tsc still emits; **nothing imports `slide-ir`**
  (absent from `src/index.ts`), so the `make-deck` path is unaffected — verified
  by smoke test plus three live runs. Untouched per the no-`core/src` constraint.
- Slide Markdown / HTML export: **not supported** — verified by inspecting
  `scripts/make-deck.ts`, `src/export.ts` (only `exportToPptx`/`exportToPptxBuffer`),
  and `apps/web/app/api/export/route.ts` (PPTX only). Not exported; recorded as a
  limitation, not attempted.

## 8. Limitations

- Previews are HTML-geometry renders, not PPTX rasterizations: no LibreOffice
  (`soffice` absent), no python-pptx/PIL, no Playwright browsers on this machine.
  Direct `.pptx` → PNG was therefore impossible; PPTX correctness rests on the
  validator (§5.1) plus the a:t spot check (§5.2).
- Preview fonts: Archivo Black, Inter, Noto Sans KR, Noto Serif KR were found in
  system font dirs, so editorial/expressive previews render near design intent;
  Pretendard and Source Serif 4 were absent and fell back.
- Re-runs fetch live repo HEAD: identical SHAs reproduce identical decks (content-
  hashed seeds `1143001754` / `1713200736` / `33113867`); upstream changes alter
  output. PPTX zip bytes vary run to run (timestamps).
- All runs used the deterministic `fallback` provider; no model-inference path
  was exercised.
