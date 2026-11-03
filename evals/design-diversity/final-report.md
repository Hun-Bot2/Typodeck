# 27 Distinct Design Systems — Final Report

## 1. Authoritative branch and commit

- Branch: `integrate/27-design-systems`
- HEAD: `6df6e3c` (Wave-4 integration)
- Prior milestones: `f2dd579` (reference preserved) → `2daf73f` (Wave-1 audit/harness/matrix)
  → `1528c85` (Wave-2 27 systems) → `3903da9` (Wave-3 blind QA + fixes) → `6df6e3c` (Wave-4)
- Reference preserved byte-identical: `typodeck-design-reference.zip`
  (sha256 `da329259…`), `8-bit-orbit/preview.md` (`1730889b…`), `8-bit-orbit/design.md` (`367fe311…`)

## 2. Original S01–S27 audit table

Source: `evals/design-diversity/audit/original-27.md` + `duplicate-clusters.md`.
Identity = layout-geometry family × theme (language/content ignored).
Finding: **14 genuinely distinct identities** across the 27 study cases.

| Cluster | Members | Verdict |
|---|---|---|
| C1 hero-number swiss | S01 S07 S16 S19 | DUPLICATES (language twins + scale mutation) |
| C2 split-stats swiss | S02 S08 S18 S22 S23 | S02/S08 siblings (distinct themes); S18 S22 S23 duplicates |
| C3 editorial chapter | S03 S09 | DUPLICATES (language twins) |
| C4 dark mono steps | S04 S20 S24 | DUPLICATES (S23/S24 pixel-identical renders) |
| C5 document before/after | S05 S11 | DUPLICATES (language twins) |
| C6–C7 | S06 S10 | No duplicates (distinct) |
| C8 editorial findings | S12 S21 | DUPLICATES (near/exact twins) |
| C9 expressive poster | S13 S14 S25 | DUPLICATES (S14 twins S13; S25 near-twin) |
| C10–C14 | S15 S17 S26 S27 (+S08 sibling) | No duplicates (distinct) |

## 3. Why only S01–S06 and S12–S15 looked distinct

The 27 study cases were hierarchy fixtures, not 27 design systems: most S07–S11/S16–S27
slots were language twins (EN/KO same render), seeded-defect mutations (type scale/color/box
deltas on one identity), or narrative-only intent changes with identical pixels
(S23/S24 excluded as render-identical). S01–S06 and S12–S15 each happened to occupy
slots whose geometry×theme combination had no twin in the set, so they read as distinct.
The audit independently confirmed S01–S06 distinct, S14 twinning S13, and S23/S24 exact.

## 4. Preserved, revised, newly created

- Preserved look (rebuilt as full systems): D01 gridline-swiss (S01 swiss),
  D03 monolith (S13/S14 expressive), D04 chapter-verse (S03 editorial).
- Revised after blind QA: D15 whiplash — full grammar redesign (centered symmetric
  drop-cap stack → offset-arch alcove + top-anchored left column + ornament field).
- Newly created: the remaining 24 identities, each with reserved non-overlapping
  direction from `design-matrix.csv`. No Wave-1 study file was modified (read-only audit).

## 5. Full 27-design matrix

`evals/design-diversity/design-matrix.csv` (27 rows D01–D27: id, slug, name, identity,
typography roles, grid, signature, palette, surface, distinct-vs-others).
Runtime mirror: `bold-template-pack/selection-index.json` (`{"templates":[…]}`,
27 entries, all `status: ready`).

## 6. Paths to all 27 preview cards

`bold-template-pack/templates/<slug>/preview.md` for slugs:
gridline-swiss, field-manual, monolith, chapter-verse, cut-paste, seminar, modulo-grid,
coin-op, maison, signal-board, gilded-line, new-wave-static, ma, dessau, whiplash,
tty-paper, front-page, memphis-squiggle, fika, iron-press, vista, peer-review,
night-reel, fieldnote, bubble-os, drafting-table, atelier-noir.

## 7. Paths to all 27 full design documents

`bold-template-pack/templates/<slug>/design.md` (same 27 slugs; frontmatter + 23 manual
sections each; `validate-design.mjs` 27/27 PASS).

## 8. Screenshot contact sheet

`evals/design-diversity/gallery/contact-sheet.png` — all 27 at 640×360 + DID captions.
Primary shots: `evals/design-diversity/screenshots/D01..D27.png` (all 1920×1080, IHDR-verified).

## 9. Local gallery URL (verified reachable)

- Serve: `cd /Users/jeonghun/Typodeck/evals/design-diversity && python3 -m http.server 8321`
  (must serve from here: image paths are `../screenshots/…`, outside the gallery dir)
- Open: `http://localhost:8321/gallery/index.html` (verified 200: renders 27/27 cards,
  filters, comparison select; also works over `file://` — zero `fetch()` calls)
- Contact page: `http://localhost:8321/gallery/contact.html`

## 10. Remaining similar/disputed pairs

None open. Blind QA cleared all near-misses explicitly (visual-review.md §3):
D05/D18, D06/D22, D07/D14, D08/D16, D09/D27 (closest non-cluster), D04/D15/D20
(D15 redesigned, re-confirmed distinct), D19/D25, D03/D23, D03/D26, D11/D20,
D12/D18/D05/D25, D02/D10/D16/D22/D26, D01/D07/D14, D06/D13/D19.
Advisory only: drop-cap motif recurs in D04/D17 (different grammars — acceptable).

## 11. Design-selection execution evidence

`evals/design-diversity/shortlist-test.mjs` → `results/shortlist-tests.json` (`pass=true`):
3 intents (formal-report → D06+D22; playful-launch → D05 D08 D12 D18 D25;
dense-technical → D02 D06 D10 D17 D22 D26), 13 preview.md reads, **0 design.md reads**,
bestFor keyword match asserted per hit. Export route accepts `template` slug
(`apps/web/app/api/export/route.ts` + `route.test.ts`, 4 tests pass).

## 12. Full-deck generation results

`results/deck-smoke.md` + `deck-smoke/` (18 slides, 3 maximally different systems):
Gridline D01 COHERENT (6/6 pass), Chapter&Verse D04 COHERENT (6/6, 2 pass*),
NightReel D23 COHERENT with 3 minor density flags. All 10 design.md gaps found
during the smoke test were closed in the docs (DOC-GAPS, validators re-PASS).

## 13. Editable PPTX verification

`results/pptx-export-tests.md`: real engine path
(index + design.md → `template-pack.ts` → `layoutDeck({theme})` → exporter →
`validatePptxBytes`) + independent XML audit. Surveyed designs: **1168/1168 chars
editable, 0 raster images** (`p:pic=0 a:blip=0`) on monolith/maison/new-wave-static;
all-27 resolution survey passes (only fika hits ink fallback).
Honest gaps disclosed: fonts named-not-embedded; word-level run styling beyond
TextBlock schema; shape/chrome idioms (bands/slashes/hairlines) not representable
in the typography-only core path — HTML previews remain the visual reference.

## 14. Regression test results

- Full suite: **565/565 pass** (10 new `template-pack.test.ts` + 4 export route tests)
- `tsc -p packages/core` clean; `tsc --noEmit -p apps/web` clean
- `validate-design.mjs`: 27/27 PASS (incl. re-run after DOC-GAPS edits)
- RC `0811e90` untouched; prior human-study branch/data preserved

## 15. Remaining limitations

1. PPTX carries theme tokens (colors/type roles), not the full preview.html chrome —
   fidelity gaps listed in §13 apply.
2. Fonts load from CDN with documented fallbacks; no font files committed (no paid APIs).
3. `preview.md` is agent-facing prose; the engine parses `selection-index.json` +
   `design.md` frontmatter (deliberate, documented).
4. Reference `8-bit-orbit` docs are internal-only (no redistribution grant).

## 16. Review commands

```bash
cd /Users/jeonghun/Typodeck && git log --oneline -6   # milestone trail
cd evals/design-diversity && python3 -m http.server 8321  # gallery root
# open http://localhost:8321/gallery/index.html  (27 cards, filters, comparison mode)
node evals/design-diversity/shortlist-test.mjs        # selection evidence
npm test                                              # 565/565
```
