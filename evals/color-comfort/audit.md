# Black-background discomfort audit

- Repo: `/Users/jeonghun/Typodeck` (`pwd` verified)
- Branch: `audit/color-comfort` (`git branch --show-current` verified, no commits made)
- Base: `f0aed77` (typo-only READY, F1/F2 closure)
- Prior report read: `evals/typo-only/FINAL-REPORT-KO.md` (full read before designing this audit)
- Ownership: this file only (`evals/color-comfort/audit.md`). All other paths read-only.
- Method: frontmatter `colors:` + "Default surface background" statements in
  `bold-template-pack/templates/*/design.md`, plus rendered covers at
  `evals/design-quality/specimens/*/cover.png` (all 27 verified 1920x1080 via
  PIL; affected covers viewed at full res by the auditor).
- Measurement: `/tmp/comfort-contrast.py` (WCAG relative luminance + ratios,
  HSL saturation). AA text floor 4.5:1; large-text floor 3:1
  (>=24px / >=18.66px bold).
- Scope rule: "near-black" = ground luminance L < ~0.02 AND low saturation
  (neutral). Dark saturated grounds (blueprint blue, deep teal) are classified
  separately as dark-not-black. `8-bit-orbit` is the untouched reference and is
  listed for completeness only, never measured for change.

## 1. Full-pack cover screen (rendered ground truth)

Mean luminance + dark-pixel fraction (L<0.02) of every specimen cover,
downscaled to 240x135 for the screen only (all verdicts confirmed by
full-res viewing of affected covers):

| Cover | mean L | dark frac | Ground verdict |
|---|---|---|---|
| atelier-noir | 0.0169 | 0.93 | FULL near-black |
| maison | 0.0083 | 0.97 | FULL near-black |
| gilded-line | 0.0119 | 0.96 | FULL near-black |
| coin-op | 0.0145 | 0.95 | FULL near-black |
| night-reel | 0.0792 | 0.86 | FULL pure black |
| monolith | 0.1941 | 0.66 | FULL near-black (large bone title mass) |
| drafting-table | 0.0890 | 0.00 | FULL dark blue (not black) |
| vista | 0.6070 | 0.01 | PARTIAL dark-teal bands |
| modulo-grid | 0.9620 | 0.01 | PARTIAL (cover white; deep stat grounds on other slides, render-confirmed) |
| new-wave-static | 0.9223 | 0.01 | NOT dark (white; black bands retired, see §3) |
| all other 17 | 0.69–0.97 | 0.00–0.04 | light grounds |

## 2. Affected list

**A. Full-slide black / near-black grounds (6):**
atelier-noir, coin-op, gilded-line, maison, monolith, night-reel.

**B. Partial dark grounds with slide-to-slide ground jumps (1):**
modulo-grid — white default ground, full-slide deep-navy (`#14213D`, L=0.0157)
stat grounds ("one deep-ground moment per slide, never mixed grounds";
evidence.png render-confirmed full-deep slide with white type + amber stat).

**C. Dark but NOT near-black (2, included for completeness, lower priority):**
drafting-table — full blueprint-blue `#0F3D7A` ground (L=0.0484, saturated);
vista — deep-teal `#0E3B43` bands + teal-deep `#0A2D34` ground band
(L=0.0363/0.0219, saturated) alternating with sand/cream bands in-slide.

**Excluded with reason:**
new-wave-static — frontmatter states "Typography-only: no bands, bars, chips,
or filled shapes"; signal black survives only as rules/type on white.
Cover + evidence.png both viewed: white ground. No black-background slide
exists in the current register. (Prior color.md §6 "black-band contexts" idea
refers to retired vocabulary — later stages must NOT reintroduce bands to fix
D12 cyan; that would regress the typo-only box ban.)
dessau — white ground, black is rules/type only. All other designs: light grounds.
8-bit-orbit — dark-void `#0A0E27` ground exists but the pack is the
byte-identical untouched reference; out of scope by initiative constraint.

## 3. Per-design findings

Conventions: [MEASURED] = computed ratio / frontmatter spec / viewed render.
[HYPOTHESIS] = candidate discomfort factor, NOT a diagnosis — no claim is made
that any viewer experiences eye strain. WCAG ratios pass/fail against AA text
floors only; high ratios are reported as extreme luminance range, not as harm.

### A1. night-reel — pure-black ground, widest range

- Ground: `#000000` (L=0.0000, pure black — the only L=0 ground in the pack).
- [MEASURED] white `#F5F5F5` title on black = **19.26:1** (highest in audit).
- [MEASURED] blood-red `#C1121F` kicker on black = 3.37:1 — passes the 3:1
  large-text floor (kicker is 40px/400) with a thin 0.37 margin; FAILS 4.5:1,
  so any future small-size red text would be an AA defect.
- [MEASURED] smoke `#8A8A8A` meta = 6.08:1; dialogue `#C9C9C9` = 12.68:1.
- Type: titles 120–196px/400; dialogue 44px/**300**; body-light 32px/**300**;
  context-line 30px/**300** — light-weight long-form text on pure black.
- Accent saturation: blood-red S=0.83 (strong but not neon).
- [HYPOTHESIS] candidates: maximal luminance range (0.00 ↔ 0.93 white mass);
  thin (300) extended text on pure black; saturated red kicker adjacent to
  full-white title mass.

### A2. monolith — near-black + full-saturation orange strike

- Ground: `#0E0E0E` (L=0.0044).
- [MEASURED] bone `#F5F0E6` mega type = 17.00:1; signal-orange `#FF4D00`
  strike = 5.80:1 (AA pass); dim `#8A8578` meta = 5.25:1.
- Type: Anton 290px mega / 150px display / 96px headline, all 400; body
  32px/400. No thin type — weight 400 minimum everywhere.
- Accent saturation: signal-orange S=**1.00** at huge scale (one word per
  slide per rationing rule). Cover viewed: orange "RUSHING" spans ~40% width.
- [HYPOTHESIS] candidates: extreme range + full-saturation orange at poster
  scale on near-black; large bone masses (~34% of pixels non-dark) keep
  average luminance high despite black ground.

### A3. coin-op — glowing phosphor on near-black void

- Ground: `#060A06` (L=0.0027, darkest chromatic ground).
- [MEASURED] phosphor `#33FF66` = 14.84:1; amber `#FFB000` = 10.88:1;
  bone `#E8E4D8` = 15.68:1; phosphor-dim 6.41:1; bone-dim 7.67:1. All pass AA.
- Type: VT323 display 40–128px/400; body 17–24px/400; micro labels down to
  **13px**/400 (amber/Silkscreen). No thin weights, but smallest text in audit.
- Glow: [MEASURED] triple-layer text-shadow halo
  (8px/32px/90px phosphor at 0.9/0.45/0.25 alpha) on every hero element;
  amber + bone glows on marquee/labels. This is the only design with glow on
  body-adjacent text (bone glow 6px/0.35). (Typo-only exception D08 already
  documents glow as glyph-limited, box-shadow 0 — do not regress.)
- Accent saturation: phosphor S=**1.00**, amber S=**1.00**.
- [HYPOTHESIS] candidates: two fully-saturated accents + multi-layer bloom on
  near-black; 13px pixel-face micro text under glow (bloom-vs-legibility
  tradeoff at small sizes).

### A4. atelier-noir — near-black + light-weight serif/sans

- Ground: `#111111` (L=0.0056).
- [MEASURED] porcelain `#FAF8F5` = 17.81:1; soft-line `#C9C9C9` = 11.40:1;
  gallery-gray `#999999` = 6.63:1; accent-ivory 14.66:1. All pass AA.
  Wine `#4A0E18` = 1.23:1 — already retired from visible vocabulary (do not
  reintroduce; see §4).
- Type: display 60–126px/400; body 26px/**300**; tagline 33px/**300**
  (Montserrat 300 mandated); context-line 27px/**300**. Thin weights carry
  sentences, not just labels. Cover viewed: high-contrast Didone-style serif
  with hairline thin strokes on black.
- Accent saturation: none — monochrome (noir/porcelain/gray). Lowest-saturation
  dark design in the pack.
- [HYPOTHESIS] candidates: thin-weight (300) text + high-contrast serif
  hairlines on near-black (halation-prone letterforms, unverified); extreme
  range 17.81:1 with no mid-tone relief except gray chrome.

### A5. maison — near-black + documented ivory alternates (jump risk)

- Ground: `#0B0B0C` (L=0.0034); rare inverted ivory `#F7F3EC` alternates.
- [MEASURED] ivory on black = 17.79:1; ivory-dim 11.81:1; gold `#C6A664`
  accent = 8.47:1.
- [MEASURED DEFECT] gray `#6E6E6E` counters/hints/micro text (13px/500
  counter, 14px folio class) = **3.86:1 — AA failure at small sizes**.
  Usage is "tertiary marks — counters, hints, de-emphasized micro text",
  so the failing pair carries real (if minor) text. Owner decision needed;
  any fix must keep the four-tone discipline (black/ivory/gold/gray).
- [MEASURED DEFECT, alternate ground] gold-deep `#9A7F45` labels on ivory
  alternate = **3.45:1 — fails AA** for 17px/500 context labels (passes only
  the 3:1 large-text floor). Inversions are "rare" and manual ("never twice
  in a row"), so exposure is bounded but real.
- Type: Cormorant light serif display 32–96px/500; body 19–26px/**300**;
  body-small 15–18px/**300**; 13–17px tracked caps hardware.
- [MEASURED] slide-to-slide jump: black (L=0.0034) ↔ ivory (L≈0.87) is a
  ~250x luminance swing between consecutive slides by design ("matte plane
  alternation ... is the elevation"). This is the largest DOCUMENTED
  inter-slide swing in the pack.
- Accent saturation: gold S=0.46 (muted) — no neon concern.
- [HYPOTHESIS] candidates: full-field black↔ivory alternation across slides;
  thin (300) small body on black; lightness of Cormorant hairlines.

### A6. gilded-line — near-black, muted gold (quietest dark design)

- Ground: lacquer `#0F0E0C` (L=0.0044).
- [MEASURED] champagne `#F5EFE0` = 16.82:1; champagne-dim 12.44:1;
  gold `#D4AF37` = 9.18:1. All pass AA with margin.
- Type: 20–68px, weights 400–700. No thin type, no micro text below 20px.
- Deco teal `#1F4E5F` is a reserved-but-unused token ("cannot hold contrast
  on lacquer") — do not activate without measurement.
- Accent saturation: gold S=0.65 (moderate). Single ground, no alternation.
- [HYPOTHESIS] candidates: extreme range only (16.82:1); otherwise the
  calmest dark design — no neon, no glow, no thin type, no jumps.

### B. modulo-grid — white ↔ deep-navy inter-slide jumps (render-confirmed)

- Grounds: white `#FFFFFF` default; deep `#14213D` (L=0.0157) full-slide
  stat grounds.
- [MEASURED] white on deep = 15.97:1; amber `#FCA311` stat on deep = 7.90:1
  (matches prior 7.89:1 record — no drift).
- [MEASURED] evidence.png viewed: FULL deep slide (white headline, amber
  "63%", white body) vs white cover — a ~60x mean-luminance swing between
  specimen slides of the same design. "Never mixed grounds" holds within a
  slide; across slides the swing is the design.
- [DO-NOT-REGRESS] amber-deep `#D98A0B` on white = 2.77:1 (prior AA failure,
  fixed by moving amber to deep grounds only). Any comfort-motivated
  lightening of deep grounds must re-measure this pair family.
- Type on deep: Sora 800 (heavy — no thin-type concern); body 16–21px/400
  Inter white on deep.
- Accent saturation: amber S=0.98 (near-full) but confined to stat numerals.
- [HYPOTHESIS] candidates: repeated white↔deep full-field jumps across a
  deck (frequency depends on stat-slide density, unmeasured).

### C1. drafting-table — dark saturated blue (not near-black)

- Ground: blueprint `#0F3D7A` (L=0.0484 — ~10x brighter than near-black set).
- [MEASURED] white = 10.67:1; pale-blue `#D6E6FA` body = 8.41:1;
  light-line `#7FB3E8` = 4.83:1 (thin AA margin — secondary marks only);
  amber `#FFD166` flags = 7.40:1. All pass AA.
- Type: 600-weight titles (146px), body 28px/400. No thin type.
- Single ground, no alternation; amber rationed to 3 roles.
- Verdict: dark-ground design but outside the near-black discomfort scope;
  include in later-stage spot checks only (blue-field + white mass).

### C2. vista — dark-teal bands inside light slides (not near-black)

- Bands: deep-teal `#0E3B43` (L=0.0363), teal-deep `#0A2D34` (L=0.0219).
- [MEASURED] sand on deep-teal = 9.92:1; cream body on teal-deep = 14.35:1;
  burnt-orange on sand = 3.00:1 exact large-text-floor pass at 72px
  (prior record, no drift — do not regress).
- Cover viewed: teal sky band (~250px) + sand headline band + cream body +
  teal ground band — dark bands are partial and in-slide, never full-field.
- Verdict: band-level dark accents, no full dark slides; out of near-black
  scope. Later stages: keep the 3.00:1 numeral pair intact.

## 4. Prior color decisions that later stages must not regress

From `evals/typo-only/color.md` + `FINAL-REPORT-KO.md` (incl. F1/F2 closure):

1. **F1 (CLOSED):** fika harness accent is fjord `#182B49` (13.56:1), not
   dusty-blue (2.45:1). Any shared-token change must keep fika accent dark.
2. **F2 (CLOSED):** "Red squares" stale captions removed (27 decks). Caption
   edits must not reintroduce box language.
3. **Pastel policy:** pastels are grounds behind dark text only; no
   pastel-on-pale text, no tint-on-tint type, every pastel pairing measured
   AA. A dark-mode "softening" that puts light-gray text on near-black at
   <4.5:1 would violate the same principle in reverse.
4. **D02 navy `#182B49` / D19 fjord:** 13–14:1 pairs on paper; keep.
5. **D18 purple chips:** white labels (4.86:1), not ink (3.88:1). Doc-only fix.
6. **D12 cyan `#00C2FF` on white ≈2.07:1** (large-text fail, preserved as punk
   identity; owner decision pending): do NOT fix by inventing black bands —
   bands are retired vocabulary in new-wave-static ("no bands, bars, chips").
   Black-band revival = typo-only regression.
7. **D15 rose swash:** deck-scale+ placement limit proposed; body-size rose
   (3.26:1) stays out.
8. **D07/modulo amber-deep on white 2.77:1:** stays off white; amber lives on
   deep grounds only (7.90:1 re-verified in this audit).
9. **Wine `#4A0E18` on noir (1.23:1)** stays retired (atelier-noir).
10. **Box ban:** no card/panel/border/shadow/fill revival — comfort fixes are
    token/type/ground changes only. Coin-op glow stays text-shadow-only,
    glyph-limited (D08 exception); no box-shadow.
11. **PPTX-native rendering** is still NOT RUN — any token change inherits
    that gap; HTML/PPTX structure gates stay green.

## 5. Research-survey review (no comfort evidence found)

Read: `research/paper-survey/00-INDEX.md` (full) + targeted greps across
01–09, verification-matrix, source-manifest for
dark-mode / black-background / eye-strain / fatigue / discomfort / glare /
luminance / WCAG / contrast-ratio / color-blindness / halation.
Result: **zero findings** on dark-mode comfort, luminance limits, or
color-vision accessibility. Color appears only as (a) implementation
attributes (font/fill/line color params), (b) UMSI reflow future work
("colors, fonts ... are future work" — 02 §6.2), (c) HCI thesis that
"size, color, position, grouping change gaze priority" (09 §3.1).

Carry-over constraints for later stages (from 08/09, not comfort claims):

- Hierarchy preservation is the validated axis (ADR-0012 typography-first:
  size·contrast·position). Comfort edits must keep intended–perceived
  hierarchy agreement; re-check specimen hierarchy judgments after changes.
- Attention ≠ reading order ≠ comprehension (09 §3.2): never claim a
  comfort fix improves comprehension or effectiveness — scope is
  "perceived static render" only.
- Human judgment is final + judge–generator separation (09 §3.5): comfort
  verdicts need human reads of full-res renders, not self-scores.
- Similarity ≠ quality (08, ColPali caution): do not use retrieval
  similarity as comfort/quality evidence.
- Experiment template available (09 §4: A/B/C/D with contrast inversion as
  an error type) if a later stage runs human validation.

## 6. Honest record / failures

- PASS/FAIL is used ONLY for WCAG arithmetic and render confirmations above.
  No comfort verdict (comfortable/uncomfortable) is given for any design —
  the survey contains no comfort evidence and no human validation was run.
- new-wave-static black bands: NOT FOUND in current register (retired).
  Recorded as excluded, not as a gap.
- Slide-to-slide jump frequency (how often deep/ivory alternates occur in
  real decks) was NOT measured — harness coverage decks were out of scope
  for this audit; later stages should quantify before prescribing.
- PPTX-native appearance of dark grounds NOT RUN (inherited gap).
- 8-bit-orbit dark grounds noted but not audited (untouchable reference).
- No paths outside this file were written; no commits, branches, or
  worktrees touched; `evals/typo-only/**` read-only as required.
