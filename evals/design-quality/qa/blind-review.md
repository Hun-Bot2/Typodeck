# Blind Visual QA Review — 27 Typodeck Systems (Wave-2 specimens + 6 full decks)

Reviewer: independent visual QA (built nothing here). Date: 2026-11-04.
Scope: `evals/design-quality/specimens/*/{cover,evidence,explanation}.png`
(81 renders, all verified 1920x1080) + `evals/design-quality/full-decks/*/slides/*.png`
(42 renders, 6 decks x 7). Rubric: `../audit/rubric.md` (5 separate 1-5 dimensions,
no aggregate). No single PASS: every design carries five independent scores below.

## 1. Blind protocol

- Three blind contact sheets in this dir, names/slugs hidden, order randomized:
  - `contact-cover-blind-seed101.png` (labels C-01..C-27), seed 101
  - `contact-evidence-blind-seed202.png` (labels E-01..E-27), seed 202
  - `contact-explanation-blind-seed303.png` (labels X-01..X-27), seed 303
- Mapping: `key.json` (orders recorded; decoded only after blind viewing notes).
- Six deck-sequence strips (in-order, not blind — coherence review):
  `strip-{field-manual,fika,gridline-swiss,modulo-grid,peer-review,signal-board}.png`.
- All 3 contact sheets + all 6 strips VIEWED. Full-res confirmation (not thumbs alone):
  16 1:1 crops + 8 full-image views + 3 critical 1:1 follow-ups, covering 20 distinct
  (design, slide) pairs across 17 designs (scratch plates in /tmp/qa_verify/, kept
  out of this dir). Wave-1 audit pixel evidence (`../audit/part-*.md`) used as
  discovery pointers only; every carried-forward claim below is marked T (thumb +
  Wave-1 carryover) or V (verified this session at 1:1/full-res).
- Independent code checks: all-81 fixture-string sweep; D07 module words, D11
  kicker/context strings, D12 chip glyph extracted from specimen HTML.

## 2. Dimension scores (TYP / COMP / ID / DECK / TECH, each 1-5, separate)

Legend: V = 1:1 or full-res verified this session; T = contact-thumb + Wave-1
carryover for fine detail. Per-slide verdicts: pass / flag (needs owner fix) /
reject (none issued — no illegible or wrong-system render found).

| DID | slug | TYP | COMP | ID | DECK | TECH | evidence tier |
|-----|------|-----|------|----|------|------|---------------|
| D01 | gridline-swiss | 5 | 4 | 5 | 5 | 4 | T+strip |
| D02 | field-manual | 5 | 3 | 5 | 4 | 4 | T+strip |
| D03 | monolith | 5 | 3 | 5 | 3 | 5 | V(evidence full) |
| D04 | chapter-verse | 5 | 4 | 4 | 3 | 4 | T |
| D05 | cut-paste | 5 | 3 | 5 | 3 | 4 | V(evidence 1:1) |
| D06 | seminar | 4 | 3 | 4 | 3 | 4 | V(evidence full+1:1) |
| D07 | modulo-grid | 5 | 5 | 4 | 4 | 4 | T+strip+DOM |
| D08 | coin-op | 5 | 3 | 5 | 3 | 5 | V(cover full+1:1) |
| D09 | maison | 5 | 4 | 4 | 3 | 4 | V(evidence full, expl 1:1) |
| D10 | signal-board | 5 | 3 | 5 | 4 | 4 | V(divider 1:1)+strip |
| D11 | gilded-line | 5 | 5 | 5 | 3 | 5 | V(expl 1:1)+DOM |
| D12 | new-wave-static | 5 | 4 | 5 | 3 | 2 | V(chip 1:1 x3)+DOM |
| D13 | ma | 5 | 5 | 3 | 3 | 4 | V(expl full) |
| D14 | dessau | 5 | 4 | 5 | 3 | 5 | T |
| D15 | whiplash | 5 | 4 | 3 | 3 | 4 | V(evidence 1:1) |
| D16 | tty-paper | 5 | 3 | 5 | 3 | 5 | V(expl 1:1) |
| D17 | front-page | 5 | 3 | 5 | 4 | 5 | V(expl 1:1) |
| D18 | memphis-squiggle | 5 | 4 | 5 | 3 | 5 | T |
| D19 | fika | 5 | 4 | 3 | 4 | 4 | T+strip |
| D20 | iron-press | 5 | 4 | 5 | 3 | 4 | T |
| D21 | vista | 5 | 4 | 5 | 3 | 4 | T |
| D22 | peer-review | 5 | 5 | 3 | 5 | 5 | V(dense 1:1)+strip |
| D23 | night-reel | 5 | 3 | 5 | 3 | 5 | V(expl full+right 1:1) |
| D24 | fieldnote | 5 | 4 | 5 | 5 | 4 | V(expl full) |
| D25 | bubble-os | 5 | 4 | 5 | 3 | 4 | T |
| D26 | drafting-table | 5 | 4 | 5 | 4 | 4 | T |
| D27 | atelier-noir | 5 | 4 | 5 | 3 | 4 | V(evidence full+band 1:1) |

27/27 scored on all five dimensions. No rejects. 1 TECH-2 (D12), 0 TECH-1.
DECK-5: D01, D22, D24. ID-3s are rubric-anchored (ornament-dependent D13/D15;
low-signature D19/D22), not failures.

## 3. Per-design notes + per-slide verdicts

- D01 gridline-swiss — ladder holds across all 3 specimens; rail bottom-light
  persists (COMP 4). Deck exemplary (DECK 5). TECH 4: deck slide-05 lacks fixture
  marking (specimen explanation HAS it — intra-design inconsistency).
  Slides: cover pass, evidence pass, explanation pass; deck s01-s04,s06,s07 pass,
  s05 flag (EX-SRC).
- D02 field-manual — three-voice fiction superb; right column/statement voids
  (COMP 3). Deck apparatus rich; s03 statement mostly empty (DECK 4).
  Slides: specimens pass; deck s03 flag (void), s05 flag (EX-SRC), rest pass.
- D03 monolith — V: evidence "63%" fully contained, message/support legible,
  source+footer present; lower ~30% empty black (COMP 3, content-driven).
  Cover wall/void per Wave-1, thumb-consistent. Slides: cover flag (void note),
  evidence pass, explanation pass.
- D04 chapter-verse — book contract honored; explanation dense-center fits (T).
  Slides: cover pass, evidence pass, explanation flag (EX-SRC).
- D05 cut-paste — V: evidence center clean (teal message block + taped support
  card legible, no occlusion). Cover ghost-SHIP occlusion + tape clearance NOT
  re-verified at 1:1 (T carryover; COMP 3, TECH 4 with verify note).
  Slides: cover flag (carryover — verify at full res), evidence pass, explanation pass.
- D06 seminar — V: keys ¹/² DISTINCT (margin ² ↔ text ², footnote ¹ ↔ text ¹):
  Wave-1 duplicate-key defect FIXED. Margin stat small vs message (TYP 4);
  lower ~45% + right-column void (COMP 3, content-driven).
  Slides: cover pass, evidence pass w/ void note, explanation flag (EX-SRC).
- D07 modulo-grid — DOM check: cover modules read "11 Postmortems / Case Files /
  Issue Nº 01" — Wave-1 headline-restating FIXED (DECK 4). Grid legible (COMP 5).
  Slides: specimens pass; deck s05 flag (EX-SRC), rest pass.
- D08 coin-op — V: marquee "TYPODECK RESEARCH · NOVEMBER 2026" complete and
  centered; Wave-1 "T" clip NOT present in Wave-2 (TECH 5). Cabinet air (COMP 3).
  Slides: all pass.
- D09 maison — V: evidence ladder + gold italic "contained" clean; explanation
  centered stack legible, caption fits. Airy lower third is doctrine (COMP 4).
  Slides: cover pass, evidence pass, explanation flag (EX-SRC).
- D10 signal-board — V: divider mid void ~400px below orienting line (COMP 3).
  Working KPI/log/ticker/status + dense log table (DECK 4, thin-caveat).
  Slides: specimens pass; deck s02 flag (void), s05 flag (EX-SRC), rest pass.
- D11 gilded-line — DOM check: kicker "◆ POSTMORTEM DOSSIER ◆" vs context
  "Typodeck Research · November 2026" DISTINCT — Wave-1 repetition FIXED (ID 5).
  V: explanation symmetric two-col + caption fits in frame. Slides: all pass.
- D12 new-wave-static — V (3 1:1 crops) + DOM: chip DOM reads "READ THE FAILURE
  LOG ▸" but the ▸ does NOT render — band runs past "G" (~25px margin) to the
  x=1920 canvas edge; glyph clipped (TECH-2, rubric-anchored). Plus EX-SRC
  missing on explanation. Slides: cover flag (▸ clip), evidence pass,
  explanation flag (EX-SRC).
- D13 ma — V: zen plate exact; ghost "03" behind title faint by design; seal
  present; right ~45% + lower ~35% void defended (COMP 5). ID 3 rubric-anchored
  (void/rule/seal carry identity). Slides: cover pass, evidence pass,
  explanation flag (EX-SRC).
- D14 dessau — primaries + glyph stack + lowercase doctrine hold (T); no red
  accent word is optional-compliant. Slides: all pass.
- D15 whiplash — V: ornament field (arch/halo/bloom/curls) clear of text;
  bloom renders heart-ish fleuron = documented Garamond-fallback accepted risk
  (TECH 4). ID 3 rubric-anchored (arch/ornament carry identity). Slides: all pass.
- D16 tty-paper — V: explanation bottom fits (source line + block cursor +
  status bar). Lower ~45% void on cover (T carryover, COMP 3). Slides: cover
  flag (void note), evidence pass, explanation pass.
- D17 front-page — V: explanation two-col ruled + caption clean. Middle ~40%
  void on thin cover (T carryover, COMP 3); folio/table apparatus (DECK 4).
  Slides: cover flag (void note), evidence pass, explanation pass.
- D18 memphis-squiggle — sticker-book depth holds; calm middle within doctrine
  (T). Slides: all pass.
- D19 fika — soft register low punch (ID 3). Deck coherent, dense pastel table
  fits (DECK 4). Intra-design inconsistency REVERSED vs D01/D02/D07/D10:
  specimen explanation LACKS marking, deck s05 HAS it. Slides: specimen
  explanation flag (EX-SRC); all 7 deck slides pass.
- D20 iron-press — frame + Fell + oxblood conformant (T). Slides: cover pass,
  evidence pass, explanation flag (EX-SRC).
- D21 vista — band stack + badge + ticket rule conformant (T); body band sparse
  (COMP 4). Slides: cover pass, evidence pass, explanation flag (EX-SRC).
- D22 peer-review — V: dense table P-01..P-10+ clean, three-line rules, footnote
  present. Full apparatus across deck (DECK 5). Low signature (ID 3).
  Marking present in specimen AND deck s05. Slides: all 10 pass.
- D23 night-reel — V (full + right-half 1:1): right-column lines end ~170px
  before edge — NO clip (early crop-edge suspicion refuted). Top-half black is
  low-third doctrine (COMP 3). One red rule. Slides: all pass.
- D24 fieldnote — V: explanation margin bookended (hand note top, takeaway
  bottom); middle-right air within doctrine (COMP 4). Stamp+tally+bullets+
  takeaway apparatus (DECK 5, rubric-cited). Slides: cover pass, evidence pass,
  explanation flag (EX-SRC).
- D25 bubble-os — color-word layering + pills + gloss hold (T). Slides: cover
  pass, evidence pass, explanation flag (EX-SRC).
- D26 drafting-table — dimensioned caps + revision table + amber flags (T);
  instrument apparatus gates prose (DECK 4). Slides: cover pass, evidence pass,
  explanation flag (EX-SRC).
- D27 atelier-noir — V (full + band 1:1): early overlap suspicion REFUTED —
  message fully legible left of x=1210 hairline, giant "63" clear at right;
  exactly one italic word ("contained") confirmed. Noir air (COMP 4).
  Slides: cover pass, evidence pass, explanation flag (EX-SRC).

## 4. Defect register (pixel evidence; V = this session, T = carryover)

1. [V, TECH-2] D12 cover: rotated chip "READ THE FAILURE LOG ▸" — ▸ in DOM,
   absent in pixels; band bleeds to x=1920 edge ("G" ends ~25px short).
   Fix: shift chip left ~40px or drop "▸"/shorten text; re-capture.
2. [V, TECH-flag] EX-SRC cluster: 12/27 explanation specimens carry NO
   fixture-not-fact marking (atelier-noir, bubble-os, chapter-verse,
   drafting-table, fieldnote, fika, iron-press, ma, maison, new-wave-static,
   seminar, vista — zero "fixture"/"not a real"/"invented" hits), while 15/27
   do; deck slide-05 split 2/4 (fika, peer-review have it; field-manual,
   gridline-swiss, modulo-grid, signal-board lack it). All 27 evidence
   specimens + all deck s04/s06 HAVE marking. Fix: add one source line per
   affected explanation/comparison slide; fix intra-design splits (D01, D02,
   D07, D10: deck s05; D19: specimen). Root cause is contract ambiguity:
   fixtures.md usage rules demand marking on comparison slides but the Slide-C
   block + deck table list no source-line beat — owners split on the gap.
   Recommend the contract add (or explicitly exempt) the beat.
3. [V, COMP] D10 deck s02 divider: ~400px void between "Three patterns, one
   discipline." (y≈370) and bottom readout — verified 1:1. Fix: add status
   cells or pull section readout up; editorial, not geometry.
4. [V, COMP] D06 evidence: lower ~45% + right column below y≈550 empty —
   verified full-image. Content-driven; fix is density/editorial.
5. [T+strip, COMP] D02 deck s03 statement: sentence + kicker only, large
   lower void. Fix: add procedure/FIG box or accept as pause slide.
6. [T, COMP carryovers, thumb-consistent] D03 cover wall ~52% + right void;
   D05 cover ghost occlusion; D16 cover lower ~45%; D17 cover middle ~40%;
   D08 cabinet side air; D23 top-half black (doctrinal). All content-driven
   or doctrinal; no geometry fix — density/editorial or accept.
7. Refuted this session (no action): D27 evidence text/numeral overlap (clear
   at 1:1); D23 explanation right-edge clip (170px margin at 1:1); D08 marquee
   "T" clip (complete); D06 duplicate ¹ key (distinct ¹/²); D07 module
   restating (modules read "11 Postmortems / Case Files / Issue Nº 01"); D11
   kicker/context repeat (distinct strings).

No wrapping orphans, alignment breaks, or illegible-at-full-res type observed
in any 1:1/full-res view. No validator FAIL seen (deck report.json files all
read validator PASS; specimens have no report files — recommend adding them).

## 5. Repeated-pattern clusters (cross-design)

- C1 folio-numeral-as-hero saturation: ~15/27 covers lead with a giant
  11/01/03 numeral (D01, D19, D07, D18, D10, D27, D13, D21, D12-ghost, D26,
  D23-marker, D16-folio, D04-folio, D09-folio, D02-tags). Treatments differ
  (rail, panel, badge, ghost, stamp, ticker), so no identity collision —
  gallery-curation note only: hang numeral-led covers apart.
- C2 EX-SRC split (see defect 2): the single biggest consistency break.
- C3 thin-slide voids: divider/statement/evidence lowers (D10-s02 V; D06-ev V;
  D02-s03, D19-s03, D08, D16, D23-air). All editorial/density, none structural.
- C4 centered-ceremonial stack: D20, D11, D09, D04, D25-card, D08-cabinet —
  distinct registers, shared symmetry; hang apart in gallery.
- C5 dark-mode cluster: D23, D03, D08, D27 (+D12 band) — distinct voices
  (cinema/shout/terminal/noir/punk); no collision.
- C6 Wave-1 responsiveness (positive): 4/4 re-checkable Wave-1 type defects
  fixed in Wave-2 (D06 keys, D07 modules, D08 marquee, D11 kicker); D12 ▸
  persists — the one carryover miss.
- C7 specimen/deck ownership split: marking present in one artifact and absent
  in the other for D01, D02, D07, D10 (specimen yes/deck no) and D19 (deck
  yes/specimen no) — specimens and decks were built without a shared checklist.

## 6. Full-deck coherence reviews (6/6 strips viewed)

- gridline-swiss: PASS. Chrome identical x7 (12-col grid, kicker+square+6px
  rule, index rail NN, footer NN/07); all 7 roles composed differently
  (display-xl / section / giant sentence / stat row / A-B zones / Swiss table /
  bottom-weighted closing). Dense table fits. Repetitive? No — rail numeral +
  role layouts vary; the most disciplined deck of the six. One flag: s05
  missing fixture marking.
- signal-board: PASS WITH CAVEAT. Chrome holds (command bar + footer);
  cover/evidence/comparison/dense are strong instrument spreads; s02 divider
  void (~400px) and thin s03 make the deck sag mid-sequence. Dense log table
  excellent. Flags: s02 void, s05 marking.
- field-manual: PASS WITH CAVEAT. Doc frame + steps + FIG/NOTE boxes carry all
  7; dense table strong; s03 statement thin (pause-slide acceptable if
  intentional — owner to confirm). Flags: s03 void, s05 marking.
- modulo-grid: PASS. Best role-variety: hero+modules / full-bleed band+amber
  numeral / sentence+underline / stat module+cards / white-vs-deep cards /
  zebra table / full-bleed amber closing. Amber discipline holds per region.
  One flag: s05 marking.
- fika: PASS. Soft chrome (kicker, folio) + rotating pastel panels; statement
  air is doctrinal; dense pastel-blue table fits and stays legible. No deck
  flags (s05 HAS marking). Coherent but lowest-punch — curation note, not defect.
- peer-review: PASS. Strongest apparatus deck: runhead+rules+footnotes x7 with
  abstract/FIGURE/TABLE/keywords trading per role; dense table verified 1:1
  (P-01..P-10+ clean). No deck flags. Slightly monotonous by doctrine
  (journal gray) — coherence, not repetitiveness.

Coherence vs repetitiveness verdict: all 6 decks are coherent (persistent
chrome + role-differentiated compositions); none is repetitive (no two slides
in any deck share a composition). The shared weakness is thin-slide density
(s02/s03 voids), not sameness.

## 7. Fix directions to Wave-2 owners (priority order)

1. P0 — EX-SRC-12 + deck-s05-4: add fixture source line (12 specimen owners +
   D01/D02/D07/D10 deck owners). Contract owner: resolve the Slide-C/deck-table
   vs usage-rules ambiguity explicitly.
2. P0 — D12 owner: un-clip chip ▸ (shift ~40px or trim text) + add EX-SRC.
3. P1 — D10 owner: fill s02 divider void (status cells / readout up).
4. P1 — D02 owner: confirm s03 pause-slide intent or add procedure box.
5. P2 — D05 owner: full-res verify ghost-SHIP occlusion + tape clearance
   (QA carryover, unresolved at 1:1). D01 owner: full-res verify rail-numeral
   crop (TECH-4 note).
6. P2 — specimens: add per-design report/classification validation records
   (only decks have report.json); gallery contract needs validator+verify PASS
   per design.

## 8. Gaps / unresolved

- Fine-detail TYP (tracking nits, orphans) for T-tier designs rests on
  480px thumbs + Wave-1 carryover, not fresh 1:1 type inspection.
- D05 cover ghost occlusion + tape clearance not re-verified at 1:1.
- D01 rail-numeral crop (contained vs edge-cropped) not verified at 1:1.
- Dense-table P-11 bottom rows confirmed via strip + report PASS, not 1:1.
- No specimen validator/verify records exist to check TECH-1 gate directly.
