# Design-Quality Rubric (Wave-2 scoring)

Scope: title-slide + specimen + full-deck judging for all 27 Typodeck systems.
Source language grounded in `audit/part-1.md` (D01–D09), `audit/part-2.md`
(D10–D18), `audit/part-3.md` (D19–D27).

## Separation rule (normative)

The five dimensions below stay SEPARATE. There is no aggregate score, no
averaging, no single PASS/FAIL. Each design carries five independent 1–5
scores plus a curatorial leaning (`Core / Specialized / Experimental /
Rework / Reject`, see `classification.md`). A design may score 5 on identity
and 2 on full-deck without contradiction — that split is the signal.

## Dimension 1 — Typography (TYP)

Roles, scale ladder, case/tracking treatments, alignment, wrapping, legibility
as rendered at 1920×1080.

- 5: All roles present and uncrossed (display/body/label/chrome each hold);
  scale ladder disciplined (cf. D01 400/118/34/20/19); tracking/case per spec;
  wrapping balanced, no orphans across emphasis boundaries; legible at
  projection distance.
- 4: Roles hold; one cosmetic wrapping or tracking nit (e.g. stranded "of" at
  line head as in D04/D07, ragged tag column as in D02.3).
- 3: Roles hold but hierarchy is shallow — single-line hero, thin strokes, or
  quiet accent give weak first fixation (cf. D09); or one voice crowds another.
- 2: A role breaks or crosses (wrong face/weight/case on a signature element),
  or emphasis monopoly violated (two intruders where spec allows one).
- 1: Illegible or wrong system — display face missing, body unreadable at full
  res, or chrome unreadable where the doc requires reading text (dim bar
  markers that are spec'd non-reading, cf. D23, do NOT count against this).

## Dimension 2 — Composition (COMP)

Grid, balance, whitespace doctrine vs. accidental void, fixation order.

- 5: Grid legible in pixels (12-col, module, band order, symmetry); content
  fills its zones; whitespace reads as doctrine (cf. D13 70% void defended,
  D11 bilateral symmetry).
- 4: Sound composition with one bottom-light or airy zone that stays within
  doctrine (cf. D01 rail bottom ~90px, D14 airy title field).
- 3: A void large enough to flag but doctrinal or content-driven — lower 40–55%
  empty on a title-only render (cf. D06 ~500px void, D09 lower ~400px,
  D16 lower ~45%, D17 middle ~40%); fix is editorial/density, not geometry.
- 2: Composition wastes its signature element (grid decorates instead of
  structuring, cf. D07 verbatim modules) or is top/left-heavy with a dead
  quadrant (cf. D05 bottom-left empty, D02 right column ~360px void + orphan
  chip).
- 1: Monumentality or structure fails its own promise — "viewport-filling" wall
  at ~52% width with no hard crop (cf. D03), or overlapping layers occlude a
  signature element into smudge (cf. D05 ghost 70% occluded).

## Dimension 3 — Identity (ID)

Distinct register, ornament discipline (essential/structural/semantic/
controlled/unnecessary per Part 1), audience fit.

- 5: Instantly recognizable register; every ornament earns its class; nothing
  unnecessary (cf. D01 Swiss rail+rule, D08 cabinet+scanlines, D25
  color-word layering, D27 one-italic-word).
- 4: Strong voice with one controlled ornament near its limit (cf. D04 drop cap
  on 2-line lede, D02 approval strip theatrical-but-on-fiction).
- 3: Coherent but generic without its non-type carriers — identity carried by
  void/rule/seal (D13) or arch/ornament field (D15); type alone would not
  identify the system. Ornament-dependent, masterful in slot.
- 2: Register correct but diluted — repeated strings across roles (cf. D11
  kicker/context same source, D08 triple-told "11 postmortems"), or accent
  budget overspent (cf. D07 three amber moments in grid region).
- 1: No coherent register, or ornaments fight doctrine (secondaries in a
  five-spot-ink system, centered-everything in a flush-left system, shadows in
  a matte system).

## Dimension 4 — Full-deck (DECK)

Data apparatus (figures/tables/callouts/footnotes/status), density modes
(low/high per SKILL.md), thin-vs-thick content robustness. Judged from the
title render plus the doc's specified apparatus.

- 5: Working apparatus visible or fully specified — KPI + case-log + ticker +
  status (D10), abstract + FIGURE bars + TABLE + footnotes (D22), stamp +
  tally trio + bullets + takeaway (D24); density modes addressed.
- 4: Apparatus present with one thin-content caveat — folio cells thin but
  structured (D17), body band sparse but no seam crossed (D21).
- 3: Narrow but honest vessel — no data apparatus by doctrine, correctly
  excludes data decks (D04 book, D09 luxury, D13 zen, D15 nouveau, D23
  low-third, D27 fashion). Score 3, not lower: the exclusion is the design.
- 2: Apparatus exists but misfires on thin content — modules restate headline
  words (D07), slots triple-tell the count (D08), folio echoes subtitle tail
  (D09.2).
- 1: System promises density it cannot render — "full front, calmly locked" at
  high density with a 40% hole and no fill rule (worse than D17's caveat), or
  overflow/overlap on dense slides.

## Dimension 5 — Technical (TECH)

Spec conformance (tokens/ornaments present), correctness (keying, freeze
states, collisions), render robustness (font coverage, crop, reduced-motion).

- 5: Every non-optional token renders; counts/flags exact (amber ×4 in D26,
  red ×3 in D17, one red in D23, one italic word in D27); no collision or
  freeze defect.
- 4: Conformant with a documented accepted risk — faint ghost numeral by design
  (D13), bloom-glyph fallback to verify (D15 ❦ U+2766), VT323/scanline
  softening tradeoff (D08.3).
- 3: Minor spec deviation, no visual harm — numeral contained not edge-cropped
  (D01.1), pragmatic hybrid bullet (D07.3), centered-folio interpretation
  (D09.3).
- 2: Real defect with a concrete fix — marquee freeze clips "T" in static
  export (D08.1), rotated chip ▸ near crop with LONG-title collision risk
  (D12), tape kisses scrap text at ~0px clearance (D05.2), "OF" orphaned
  across color boundary (D03.2).
- 1: Structural correctness break — duplicate apparatus key with two referents
  and zero added information (D06.1); any FAIL from the design-quality
  validator on a rendered slide (per `contracts.md` validator gate).
