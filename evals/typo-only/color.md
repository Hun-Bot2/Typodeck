# Typo-only color research + token refinement

- Base SHA: `3a5d2bbea71144970e5513c804a12a2857371f4b` (branch `audit/box-aesthetic` at work start)
- Task placeholders were literally `undefined` (repo root, branch); resolved to workspace
  root `/Users/jeonghun/Typodeck`, branch `audit/box-aesthetic`.
- Ownership: only `bold-template-pack/**` (except `8-bit-orbit/**`, untouched byte-identical
  reference) and this file. No other tree paths modified by this task.
- Prior audit: `evals/typo-only/audit.md` (prior result 1); its 27-design survey scopes §4.
- Contrast method: WCAG relative-luminance ratios via `/tmp/navy-contrast.js`
  (AA text floor 4.5:1; large-text/UI-component floor 3:1).
- Renders viewed full-res 1920×1080 before choosing: `/tmp/fm-baseline.png`,
  `/tmp/fika-baseline.png`, `/tmp/navy-compare.png` (all four navy candidates on real
  components), `/tmp/fm-final.png`, `/tmp/fika-final.png`.

## 1. Research sources

No brief with documented URLs was supplied in this task's input (repo/branch fields were
`undefined` and no brief file exists in the owned subtrees), so the canonical public
documentation was resolved and fetched directly. No source below was unreachable; nothing
is marked NOT RUN.

1. Tableau Blueprint — Visual Best Practices
   ([source](https://help.tableau.com/current/blueprint/en-us/bp_visual_best_practices.htm),
   fetched 200, 2026-11-04): primary design colors should be neutral (grayscale maximizes
   contrast for data-driven points); extended accent colors used sparingly to draw attention;
   distinguish sequential / diverging / categorical / highlighting / alerting motifs; one
   color must not mean three things; account for color blindness.
2. Tableau — Best Practices for Designing Accessible Views
   ([source](https://help.tableau.com/current/pro/desktop/en-us/accessibility_best_practice.htm),
   fetched 200, 2026-11-04): color alone is not enough distinction — pair with shape, size,
   labels; palette colors should differ on the light-dark spectrum; text contrast 4.5:1
   (3:1 large text); verify with a contrast analyzer.
3. ColorBrewer 2.0 — color advice for cartography
   ([source](https://colorbrewer2.org/), fetched 200, 2026-11-04, Cynthia Brewer / Mark
   Harrower / Penn State): schemes organized by data nature — sequential, diverging,
   qualitative — with colorblind-safe / print-friendly / photocopy-safe filters.
4. RColorBrewer reference (Brewer scheme definitions)
   ([source](https://mirror.metanet.ch/cran/web/packages/RColorBrewer/refman/RColorBrewer.html),
   fetched 200, 2026-11-04): sequential = lightness steps, light→dark with value;
   diverging = light critical middle, dark contrasting-hue extremes; qualitative = hue
   differences with no implied magnitude, for nominal/categorical data.

Applied reading for this pack: pastels behave like the light end of a sequential scheme —
they are grounds, never signals. Any pastel must therefore carry a dark text pairing on the
opposite end of the light-dark spectrum (Tableau accessibility rule), and no meaning may
ride on a pastel-vs-pale distinction alone (ColorBrewer qualitative discipline).

## 2. Shared pastel rule (encoded in every touched design.md)

> A pastel or light tint may exist only with a deliberate contrast role: as a ground
> behind dark text, or as a fill behind dark text. Never pastel-on-pale text, never
> tint-on-tint type, never meaning carried by a pastel-vs-pale distinction without an
> adjacent text label. Every pastel's text pairing must be measured and must pass AA
> (4.5:1, or 3:1 only for large text ≥24px / ≥18.66px bold).

Encoded at: `field-manual/design.md` (Pastel & Tint Policy),
`fika/design.md` (Pastel Policy), `memphis-squiggle/design.md` (Pastel & tint policy).

## 3. Token diffs

Navy selection: `#182B49` chosen after viewing all four candidates (`#14233B`, `#182B49`,
`#102A43`, `#1B263B`) on real components and full-slide renders. All four pass AA hugely
on the light grounds (13–16:1); `#182B49` keeps the clearest blue read at 19px tags, 14px
dots, and 1px borders so note-blue stays distinguishable from near-black ink (`#1B263B`
collapses toward ink; `#102A43` leans petrol). Classic navy/amber pairing on warm paper.

### D02 field-manual — `procedural-blue` → deep navy (incompatible saturation fix)

| Token | Before | After | Roles |
|---|---|---|---|
| `procedural-blue` | `#0B5FFF` | `#182B49` | note-box borders, NOTE/FIG tags, done glyphs |

- Why: electric royal blue (4.83:1 on paper) clashed with the warm paper/ink/amber
  controlled-document system; renders confirmed it read as web-UI blue, not procedural.
  Navy measures 13.36:1 on paper `#FAF8F3`, 14.18:1 on box-white — verified in
  `/tmp/fm-final.png` (PASS: deep, distinct from ink, harmonious with amber chips).
- Token name kept (`procedural-blue`); prose now says "Procedural Navy".
- Files: `design.md` (:8, :160, :182, +Pastel & Tint Policy), `preview.html` (5
  occurrences), `preview.md` (:24, :30).
- ko note: untouched — no color roles changed (same roles, deeper value) and the ko file
  never references blue.

### D19 fika — new `fjord` navy for chip text + kicker dot (AA failure fix)

| Token | Before | After | Roles |
|---|---|---|---|
| `fjord` (new) | — | `#182B49` | all chip text, kicker-dot default |
| `slate` | chip text + all text | body/headline/label text only | — |
| `dusty-blue` | fills + kicker dot | fills + wash source only | — |

- Why: slate-on-dusty-blue chip text measured **4.17:1 — AA failure** at 22px bold
  (sage 5.68 / blush 5.83 passed). Uniform fjord chip text passes on all three fills
  (7.55 / 7.75 / 5.54) and the navy kicker dot replaces a 2.45:1 speck. Pastel rotation,
  washes, and slate body text unchanged. Verified in `/tmp/fika-final.png` (PASS: crisp
  chip text, calm preserved).
- Files: `design.md` (frontmatter + chip/dot components + Colors + Do/Don't + iteration
  rules + Pastel Policy), `preview.html` (chip rule, dot rule), `preview.md` (:24, :30,
  :34, :36), `locales/ko/typography.md` (chip fjord note).
- Consistency: `preview.md` also aligned two drifted `#3D4A54`-family values to the
  `design.md` authority `#31404B` / `rgba(49,64,75,0.08)` (:24, :36). Specimen/matrix
  drift (`evals/design-quality/specimens`, design-matrix) is outside owned scope — see §6.

### D18 memphis-squiggle — white labels on purple chips (AA failure fix)

No token values changed. Added rule: chip labels are ink except on purple chips, which
carry white labels (ink `#111111` on purple `#6C5CE7` = 3.88:1 fails at 22px caps; white
on purple = 4.86:1 passes). Pink/teal/yellow chips keep ink labels (7.05:1+). Doc-only
fix — `preview.html` shows pink + teal chips only, so no markup change was needed.
- Files: `design.md` (chip component :111, Defaults, signature treatment), pastel policy
  note, `locales/ko/typography.md` (one line).

## 4. Flagged designs deliberately preserved (audit scope respected)

Fixes were limited to designs the audit flagged; within those, only genuine text-legibility
defects were changed. Fill-only / decorative / large-display accents were preserved:

- D07 modulo-grid: amber fills always pair with deep-navy text; amber numerals sit inside
  deep bands; `amber-deep` already covers small caps on white. No amber text on white
  exists. Preserved.
- D25 bubble-os: "never raw bubblegum for text" already documented and enforced via
  `bubble-deep` for the emphasis word. Preserved.
- D12 new-wave-static: audited magenta intruder (3.61:1) passes the 3:1 large-text floor
  at 104px poster size; neon is identity-critical ("voltage comes from full-saturation
  contrast"). Preserved; cyan-word gap recorded in §6.
- D21 vista: sand numeral on burnt-orange badge measures 3.00:1 at 72px — passes the
  large-text floor exactly; "never body text" documented. Preserved.
- D24 fieldnote: all clay text is large (26px bold stamps, 40–52px Caveat) so 3.63:1
  passes 3:1. Preserved.
- D05 cut-paste (borderline): red first-line 4.40:1 at 92px passes large-text; white
  badge numeral on red 4.96:1. Preserved.
- D15 whiplash (borderline): bronze draws lines/glyphs only, never text. Preserved;
  rose-swash gap recorded in §6.

## 5. Measurements (new, this task)

| Pair | Ratio | Verdict |
|---|---|---|
| D02 navy `#182B49` on paper / box-white | 13.36 / 14.18 | AA pass |
| D19 fjord on sage / blush / dusty-blue chips | 7.55 / 7.75 / 5.54 | AA pass |
| D19 slate on dusty-blue chip (before) | 4.17 | AA fail → fixed |
| D19 slate on washes (sage/blush/blue) | 8.49 / 8.17 / 8.24 | AA pass |
| D19 caption slate@72% on off-white | 4.58 | AA pass (thin margin, left as-is) |
| D18 white on purple chip (after) | 4.86 | AA pass |
| D18 ink on purple chip (before) | 3.88 | AA fail → fixed |
| D21 sand on burnt-orange badge, 72px | 3.00 | large-text pass (exact floor) |
| D12 cyan payoff on white, ~104px | 2.07 | large-text fail → gap, §6 |
| D15 rose swash in 23px body | 3.26 | AA fail → gap, §6 |

## 6. Failures / known gaps (honest record)

- Task input had no brief URLs and `undefined` repo/branch placeholders; canonical public
  docs were resolved instead (listed in §1). Owner to confirm these match the brief.
- D12 cyan payoff word (`#00C2FF` on white ≈ 2.07:1 at headline size) fails even the 3:1
  large-text floor. Outside the audit's named defect (audit flagged magenta, which
  passes); neon is identity-critical, so preserved by design. Owner decision: constrain
  cyan words to black-band contexts or accept as punk display exception.
- D15 rose swash (`#B76E79` on parchment 3.26:1) passes at 31px deck scale but fails AA
  if placed in 23px body, which the component text permits. D15 was audit-borderline, not
  a defect, so untouched per scope. Suggested owner fix: restrict swash to deck scale+.
- Fika `#3D4A54` vs `#31404B` drift persists outside owned scope
  (`evals/design-quality/specimens/fika/*`, design-matrix D19 row); only the owned
  `preview.md` lines were aligned. Specimen re-render is a separate task.
- Visual PASS claims above cover D02/D19 final preview renders only (viewed at full
  1920×1080). D18's fix is doc-only (no purple chip in its preview); no render claim.
- Pre-existing dirty tree (`evals/hackathon` deletions + `.gitignore` mod, per prior
  audit) was left untouched.
