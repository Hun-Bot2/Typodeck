# Typo-only independent visual QA

- Repo: `/Users/jeonghun/Typodeck` (pwd verified), branch `audit/box-aesthetic`
  (`git branch --show-current` verified; stayed on it, no commits).
- Run-1 context read fully before viewing: `evals/typo-only/audit.md`,
  `evals/typo-only/color.md`. Stage-1 prior results 1–5 consumed via handoff index
  (`handoff-52004c0d…txt`, 173 lines, fully read) — used as pointers, every claim
  below re-verified by my own viewing.
- Scope kept: only `evals/typo-only/qa.md` (this file) written; everything else
  read-only. No broad discovery; scans scoped to named subtrees.
- Method: every PNG below verified 1920×1080 from disk bytes (PIL) and viewed at
  full res by this agent. 97 current + 8 BEFORE = 105 images viewed.

## 1. Coverage (what was actually viewed)

| Set | Expected | Viewed | Dims |
|---|---|---|---|
| D02+D19 harness EN+KO (`evals/hackathon/coverage/{field-manual,fika}-{en,ko}/slides/01–07.png`) | 28 | 28/28 | 1920×1080 all |
| Refined covers (`evals/design-quality/specimens/*/cover.png`, 27 slugs) | 27 | 27/27 | 1920×1080 all |
| Rebuilt full decks (`evals/design-quality/full-decks/{field-manual,fika,gridline-swiss,modulo-grid,peer-review,signal-board}/slides/slide-*.png`) | 42 | 42/42 (all 6 decks × 7 rebuilt — confirmed on disk) | 1920×1080 all |
| BEFORE from `257cdce` (`git show 257cdce:evals/hackathon/coverage/…`, slides 01+06 × 4 decks, extracted to `/tmp/qa-before/`) | — | 8/8 | 1920×1080 all |

## 2. BEFORE (257cdce) → AFTER comparison (D02/D19 harness)

- **D02 field-manual: PASS, clear improvement.** BEFORE: electric royal-blue
  `#0B5FFF` kicker text, thick royal rule under kicker, full ruled table grids on
  slide 06 with royal `■` markers in Cost column (`/tmp/qa-before/field-manual-en-06.png`
  vs current `slides/06.png`). AFTER: deep navy `#182B49` kickers/tags, zero rules,
  zero grids, cost highlights as navy text. Navy reads procedural, distinct from
  ink, harmonious with amber statement ground (full-deck slide-03).
- **D19 fika: PARTIAL — grids removed, contrast defect carried over.** BEFORE:
  dusty-blue kicker/rule plus full ruled tables with dusty-blue `■` markers
  (`/tmp/qa-before/fika-en-06.png`). AFTER: no rules/grids, but the accent stayed
  `dusty-blue` — now as *running text* (kickers, all "Rushed" items on slide 05,
  cost highlights 5h/9h/12h/7h on slide 06). Root cause:
  `tools/agent-harness/lib/theme.mjs:18` still maps
  `fika: { accent: 'dusty-blue' }`; the run-1 `fjord` `#182B49` fix (color.md §3)
  never reached the harness theme. Dusty-blue on off-white ≈ 2.45:1 (audit §3) —
  AA failure on kickers (~19px caps), accent items, and cost figures, and it
  carries meaning (Rushed-vs-Reviewed side distinction, cost emphasis), violating
  the shared pastel rule (color.md §2).
- **KO BEFORE→AFTER:** same structural changes; KO line-breaking clean in both
  (no mid-word breaks; mixed Latin `action item`, `FIXTURE` intact).

## 3. Strict criteria judgments (all 97 current slides)

- **Boxes/cards/panels/table grids: NONE on any of the 97.** No rounded/single
  rectangles, no card fills, no bordered containers, no table gridlines. Closest
  calls, all accepted as text: `☑/☐` checkbox glyphs (D02), `■` square bullets
  (gridline comparison, modulo source lines — same size/weight as text, no fill
  region), coin-op block cursor, full-slide solid grounds (field-manual amber
  statement, modulo deep divider + amber closing, signal-board slate log,
  vista/bubble-os full-bleed bands — grounds, not boxes).
- **Hierarchy/alignment/whitespace:** strong across all sets. Kicker → headline →
  body → folio rhythm consistent; dense 11-row tables align on 4 columns with no
  orphans/overruns on any slide; no clipped or overlapping text observed at full
  res in any of the 105 views.
- **D02/D19 navy quality:** D02 navy excellent everywhere (harness, cover,
  full deck). D19 navy (`fjord`) excellent in specimens + full deck (navy kicker
  dots, navy tag text, slate body) — but **absent from the D19 harness decks**,
  which still render dusty-blue (see §2, REWORK item F1).
- **KO line-breaking:** PASS — all 14 KO harness slides clean; no mid-word breaks,
  no Latin/Korean collisions, footers intact.
- **Generic repetition:** no reject-worthy repetition. Noted mild patterns (all
  accepted): fika full-deck 02/03/07 share kicker + big-serif + folio shape (roles
  differ); all six dense slides share the 4-column fixture table (same fixture,
  per-design type systems differ); harness D02/D19 share builder layout (same
  harness, expected). Counter-evidence of variety: 27 covers each carry distinct
  type systems (pixel, blackletter-adjacent serif, mono ledger, deco, ASCII…).

## 4. Defects (pixel-verified)

| ID | Severity | Location | Evidence |
|---|---|---|---|
| F1 | REWORK | D19 harness EN+KO, all 14 slides | Kicker + accent text in dusty-blue ≈2.45:1 on off-white (e.g. `fika-en/slides/05.png` "Rushed" column, `06.png` cost figures). `theme.mjs:18` accent never followed run-1 fjord fix. Meaning rides on pastel-vs-pale alone. |
| F2 | REWORK (minor, text-only) | `field-manual-en/slides/05.html:97`, `fika-en/slides/05.html:97` | Caption reads "Red squares mark failure modes…" — zero red squares exist on either slide (verified pixel-by-pixel at full res). Stale caption from the boxed era; KO decks correctly lack it. |
| A1 | Advisory | signal-board cover + full deck | Orange status words (`UNDER REVIEW`, `FLAGSHIP`, `POSTMORTEM SERIES`) and red `FAULT` (4.54:1 thin pass, per prior result 1) carry status meaning via color + position + glyph (`▲/▼/●`). Readable at full res; no change demanded. |

## 5. Per-design verdicts

Scope note: full multi-slide evidence exists only for D01/D02/D07/D10/D19/D22
(harness and/or full deck + cover). D03–D06, D08–D09, D11–D18, D20–D21, D23–D27
were judged on their refined covers only — verdicts marked (cover-only).

| Design | Verdict | Basis |
|---|---|---|
| D01 gridline-swiss | APPROVE | Cover + 7 full-deck slides: zero boxes, crisp hierarchy, red accents ≥4.88:1. |
| D02 field-manual | REWORK | Box-free + navy superb, but F2 stale "Red squares" caption on harness EN 05. Fix = reword caption. |
| D03 monolith | APPROVE (cover-only) | Clean phosphor-on-black type cover, no boxes. |
| D04 chapter-verse | APPROVE (cover-only) | Clean verse cover, no boxes. |
| D05 cut-paste | APPROVE (cover-only) | Ghost-outline type cover, no boxes. |
| D06 seminar | APPROVE (cover-only) | Clean centered cover, no boxes. |
| D07 modulo-grid | APPROVE | Cover + 7 full-deck slides: zero boxes; amber confined to grounds/glyphs; deep-navy text. |
| D08 coin-op | APPROVE (cover-only) | Pixel-type cover, phosphor glow on glyphs only; no boxes. |
| D09 maison | APPROVE (cover-only) | Clean gold-on-black cover, no boxes. |
| D10 signal-board | APPROVE | Cover + 7 full-deck slides: ruled rows are hairlines, not grids; no boxes; A1 advisory only. |
| D11 gilded-line | APPROVE (cover-only) | Diamond + hairline cover, no boxes. |
| D12 new-wave-static | APPROVE (cover-only) | Outline-numeral cover, no boxes. |
| D13 ma | APPROVE (cover-only) | Ghost-numeral + seal-glyph cover, no boxes. |
| D14 dessau | APPROVE (cover-only) | Clean grotesk cover, no boxes. |
| D15 whiplash | APPROVE (cover-only) | Clean swash cover, no boxes. |
| D16 tty-paper | APPROVE (cover-only) | ASCII-type cover, no boxes. |
| D17 front-page | APPROVE (cover-only) | Nameplate cover, no boxes. |
| D18 memphis-squiggle | APPROVE (cover-only) | Zigzag-glyph cover, no boxes; accents only in strokes/markers. |
| D19 fika | REWORK | Specimens + full deck exemplary (fjord navy), but F1 dusty-blue text on all 14 harness slides + F2 stale caption on EN 05. Fix = harness accent → fjord navy; reword caption. |
| D20 iron-press | APPROVE (cover-only) | Clean press cover, no boxes. |
| D21 vista | APPROVE (cover-only) | Full-bleed bands are grounds, not boxes; no containers. |
| D22 peer-review | APPROVE | Cover + 7 full-deck slides: tabular numerals without gridlines; no boxes. |
| D23 night-reel | APPROVE (cover-only) | Clean red-kicker-line cover, no boxes. |
| D24 fieldnote | APPROVE (cover-only) | Clean stamp cover, no boxes. |
| D25 bubble-os | APPROVE (cover-only) | Full-bleed bands + star glyphs; no boxes. |
| D26 drafting-table | APPROVE (cover-only) | Clean blueprint cover, no boxes. |
| D27 atelier-noir | APPROVE (cover-only) | Clean noir cover, no boxes. |

**Reject list: empty.** No REJECTs — every viewed slide is box-free with intact
hierarchy; the two REWORKs are a theme-token follow (F1) and a one-line caption
fix (F2). No verdict was taken from test counts; all rest on full-res viewing.

## 6. Failures / honest notes

- BEFORE comparison covers slides 01+06 × 4 D02/D19 harness decks (8 images),
  not all 28 BEFORE slides — recorded, not extrapolated.
- Cover-only verdicts (21 designs) judge covers alone; evidence/explanation
  specimens were rebuilt by sibling tasks but are outside this QA's viewing set.
- `/tmp/qa-before/*.png` (8 BEFORE extractions) are scratch outside the repo.
