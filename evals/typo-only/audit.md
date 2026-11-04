# Typo-only box-aesthetic audit

- Base SHA: `3a5d2bbea71144970e5513c804a12a2857371f4b` (branch `main` at audit start)
- Audit branch: `audit/box-aesthetic` (task named the branch `undefined`; placeholder replaced with a descriptive name)
- Tree state at audit: **NOT clean** — 56 pre-existing working-tree changes left untouched:
  `M .gitignore` plus ~55 deletions under `evals/hackathon/**` (art-direction.md, ko-typography.md,
  harness-proof, specimens-ko). No changes made by this audit except this file.
- `node_modules` is a real directory here, not a symlink; untouched per instructions.

## 1. Where the box-heavy aesthetic originates

Verdict: boxes do **not** come from the typo-only pipeline (Core schema, composition grammar,
Skill, Studio preview, or harness builders all forbid/avoid them). They come from the
**bold-template-pack `design.md` component vocabularies and their `preview.html` /
`evals/design-quality/specimens` HTML renderings**, which define cards, panels, pills, chips,
and callout boxes per design.

### Box-source table

| # | File:line | What it emits | Box-heavy? |
|---|---|---|---|
| 1 | `tools/agent-harness/lib/builder.mjs:186` | `* { border-radius:0 !important; }` global reset; gridline-swiss slides use rules/rails/tables only (`.rail` gray block at :201-202, `table.swiss` at :260-267, `.statrow` at :233) | No — square rule-based, zero rounded boxes |
| 2 | `tools/agent-harness/lib/builder-generic.mjs:157` | Same `border-radius:0` reset; zones/stat-rows/findings/tables via borders only (`.statrow` :197, `.zone` :212-221, `table.dtable` :224-232) | No — rules and hairlines, no box fills |
| 3 | `tools/agent-harness/lib/theme.mjs:7-35` | Canonical `panel` color slot per design (e.g. fika `panel: white`, field-manual `panel: box-fill`) | Latent — slot exists but `builder-generic.mjs` never reads `C.panel` (dead token) |
| 4 | `packages/core/src/schema.ts:1-4,124-157` | Typo-only schema; `FORBIDDEN_KEYS` rejects `card/cards/panel/border/shadow/fill/stroke` anywhere in a deck payload | No — actively forbids boxes |
| 5 | `packages/core/src/composition.ts:32-33` | "typography-native only. No cards, boxes, arrows, icons, rules, or illustrations exist in this grammar" | No |
| 6 | `packages/core/src/critic.ts:792`, `layout.ts:397` | "Box" = text bounding-box geometry (`background:${slide.background}}` flat slide bg only; `BLOCK_PAD` fit math) | No — measurement boxes, not visuals |
| 7 | `plugins/typodeck/skills/typodeck/SKILL.md:80-85` | Absolute constraints: "Forbid: rectangles/cards/panels, borders, rules/arrows … gradients/shadows/textures" | No — forbids boxes |
| 8 | `plugins/typodeck/skills/typodeck/references/density.md:24` | "shapes, no cards; use alignment and scale contrast instead" | No |
| 9 | `apps/web/components/SlideView.tsx:24-27,41-58` | "Text-only slide preview … No canvas rasterization, no decorative shapes"; absolutely-positioned text divs + flat `backgroundColor` | No |
| 10 | `apps/web/app/api/templates/route.ts:25-31` | Studio export picker lists 27 pack entries as "selection cards" (UI chrome); "the HTML specimen is not reproduced" | UI-only — picker cards, not slide boxes |
| 11 | `bold-template-pack/templates/fika/design.md:92-107` | `soft-panel` (24px rounded pastel-wash panel), `chip` (999px pastel pill); spacing tokens `radius-panel:24px`, `radius-card:16px`, `radius-chip:999px` (:78-80) | **YES — primary box source for D19** |
| 12 | `bold-template-pack/templates/fika/preview.html:56-65` | `.fika-panel { border-radius:24px; box-shadow: lift }`, `.fika-chip { border-radius:999px }`, `.fika-dot`, `.fika-rule` | **YES — renders the boxes** |
| 13 | `evals/design-quality/specimens/fika/cover.html:51-65` | Same `.fika-panel` / chip / dot CSS as preview (specimen copy) | **YES — rendered box instance** |
| 14 | `bold-template-pack/templates/field-manual/design.md:115-131` | `step-row` bordered numeral square, `figure-box` (1px ink border, white fill), `note-box` (1px blue border), `warn-chip` amber fill (:108-114) | **YES — primary box source for D02** |
| 15 | `evals/design-quality/specimens/field-manual/cover.html:86-87,109-110,186-198` | `.figbox` (white + 1px ink border), `.notebox` (white + 1px blue border) rendered twice | **YES — rendered box instances** |
| 16 | `bold-template-pack/templates/signal-board/design.md:106-125` | `kicker-pill` (999px), `kpi-card` (white + 1px border + 6px top border), `status-pill`, `case-log` dark evidence panel | **YES — third design.md; card/panel vocabulary** |
| 17 | Other `bold-template-pack/templates/*/design.md` | Box vocabulary across pack: `bubble-os` white bubble cards + pill badges (:4); `memphis-squiggle` tilted pills + thick-outlined stat card (:111-140); `modulo-grid` flat white module cards (:132); `coin-op` recessed stat panel (:146); `8-bit-orbit` frosted-glass card (:157); `fieldnote` tally/leaf cards (:135); `tty-paper` ASCII-bordered box (:145); `cut-paste` taped scrap (:76); `gilded-line` champagne panel (:85) | **YES — pack-wide pattern** |
| 18 | `ma/design.md:4` | Explicit counter-example: "No cards, no shadows, no gradients" | No — proves boxes are opt-in per design |

Net: the box-heavy look is **authored per-design in the template pack** (design.md → preview.html →
specimens), not generated by any shared pipeline stage. The typo-only Core/Skill/Studio path cannot
emit boxes even if asked (schema rejects the keys).

## 2. D02 field-manual current color tokens (design.md frontmatter)

Source: `bold-template-pack/templates/field-manual/design.md:5-12`

| Token | Value | Role |
|---|---|---|
| `paper` | `#FAF8F3` | warm ground + dotted grid |
| `ink` | `#1A1A1A` | all type, rules, borders |
| `procedural-blue` | `#0B5FFF` | note boxes, figure tags (never large fills) |
| `caution-amber` | `#FFB000` | warning-chip fills only (chip text is ink) |
| `muted` | `#6E6A5E` | secondary text, dashed leaders |
| `dot-grid` | `rgba(26,26,26,0.14)` | 1px dots, 24px grid |
| `box-fill` | `#FFFFFF` | figure/note box interiors |

Contrast on paper bg: ink 16.40:1; procedural-blue 4.83:1 (passes AA for text);
amber-on-paper 1.73:1 — but amber is a chip *fill* with ink text, never text-on-paper, so not a failure.

## 3. D19 fika current color tokens (design.md frontmatter)

Source: `bold-template-pack/templates/fika/design.md:5-14`

| Token | Value | Role |
|---|---|---|
| `off-white` | `#FAFAF7` | universal ground |
| `slate` | `#31404B` | the only text color (never pure black) |
| `sage` | `#A8C3B9` | pastel 1: chips, dots, accents |
| `blush` | `#E8B4A0` | pastel 2: chips, panels |
| `dusty-blue` | `#7FA6C9` | pastel 3: chips, kicker dot |
| `white` | `#FFFFFF` | rare floating cards over panels |
| `sage-wash` | `#DCE8E3` | large panel fills |
| `blush-wash` | `#F5DCD2` | large panel fills |
| `blue-wash` | `#D5E4F1` | large panel fills |

Contrast on off-white bg: slate text 10.22:1 (AA pass); sage 1.80, blush 1.75,
dusty-blue 2.45 — pastels are *fills only, never text* per design.md:144, so weak by design.

**Token drift note:** `evals/design-quality/specimens/fika/cover.html:51,65` and
`evals/design-diversity/design-matrix.csv` (D19 row) use slate `#3D4A54`, while
`design.md` specifies `#31404B`. Specimen/matrix predate or diverge from the pack frontmatter.

## 4. 27-design pastel/contrast survey

Method: `/tmp/contrast-survey.js` — WCAG relative-luminance ratios of body-ink on ground and of
each design's accent(s) on ground, from `bold-template-pack/templates/*/design.md` colors frontmatter
(bg/ink/accent slots per `tools/agent-harness/lib/theme.mjs:9-35`). "Pale bg" = ground L* light
(cream/paper/white/mist); "weak accent" = accent-on-ground < 3.00:1.

Body-text verdict: **all 27 pass AA (≥4.5:1)**; lowest are fieldnote 8.72, whiplash 9.69, fika 10.22.

| Design | Pale bg? | Ground | Ink (ratio) | Accent(s) on ground | Weak-accent? |
|---|---|---|---|---|---|
| D01 gridline-swiss | yes | `#FFFFFF` | 18.88 | signal-red 4.88 | no |
| D02 field-manual | yes | `#FAF8F3` | 16.40 | blue 4.83; amber 1.73 (fill-only) | **amber fill-only, by design** |
| D03 monolith | no (black) | `#0E0E0E` | 17.00 | orange 5.80 | no |
| D04 chapter-verse | yes | `#FBF7EF` | 16.25 | oxblood 8.70 | no |
| D05 cut-paste | yes | `#F4F1EA` | 16.33 | red 4.40 | borderline (4.40, near AA floor) |
| D06 seminar | yes | `#FFFFFF` | 15.91 | navy 11.48 | no |
| D07 modulo-grid | yes | `#FFFFFF` | 15.97 | amber 2.02 | **yes — amber signal weak** |
| D08 coin-op | no (void) | `#060A06` | 15.68 | phosphor 14.84 | no |
| D09 maison | no (black) | `#0B0B0C` | 17.79 | gold 8.47 | no |
| D10 signal-board | yes | `#F6F8FA` | 16.77 | signal-blue 4.85 | no |
| D11 gilded-line | no (lacquer) | `#0F0E0C` | 16.82 | gold 9.18 | no |
| D12 new-wave-static | yes | `#FFFFFF` | 21.00 | magenta 3.61 | **yes — display-only neon** |
| D13 ma | yes | `#F8F6F0` | 13.10 | shu-red 5.84 | no |
| D14 dessau | yes | `#FFFFFF` | 21.00 | red 4.88 | no |
| D15 whiplash | yes | `#F3EDE0` | 9.69 | bronze 4.24 | borderline (bronze 4.24) |
| D16 tty-paper | yes | `#F4F1EA` | 16.74 | green 4.86 | no |
| D17 front-page | yes | `#F7F4EC` | 16.76 | dark-red 9.11 | no |
| D18 memphis-squiggle | yes | `#FFF6E9` | 17.63 | pink 2.50; purple 4.54 | **yes — pink chip weak** |
| D19 fika | yes | `#FAFAF7` | 10.22 | sage 1.80; blush 1.75; dusty-blue 2.45 (all fill-only) | **yes — weakest set, fill-only by design** |
| D20 iron-press | yes | `#F1E9D6` | 14.28 | oxblood 8.49 | no |
| D21 vista | yes* | `#FFFDF6` | 11.96 | burnt-orange 3.62 | **yes — band accent weak-ish** |
| D22 peer-review | yes | `#FFFFFF` | 17.40 | link-blue 7.84 | no |
| D23 night-reel | no (black) | `#000000` | 19.26 | blood-red 3.37 | **yes — red-on-black weak** |
| D24 fieldnote | yes | `#E9DCC8` | 8.72 | clay 3.63 | **yes — earthy accent weak** |
| D25 bubble-os | yes | `#FFFFFF` | 14.43 | bubblegum 2.32 | **yes — candy accent weak** |
| D26 drafting-table | no (blueprint) | `#0F3D7A` | 10.67 | amber 7.40 | no |
| D27 atelier-noir | no (noir) | `#111111` | 17.81 | wine 1.23 (dark-on-dark decor) | **yes — wine invisible on noir; decorative** |
| (extra) 8-bit-orbit | no (void) | `#0A0E27` | 13.60 | neon-cyan 11.78 | no |

\*Vista ground token is `cream-white`; slides are stacked teal/sand bands, so the "pale bg" label is partial.

Pale-bg + weak-accent summary (the asked intersection): **D19 fika** (weakest, all three pastels
< 2.5), **D07 modulo-grid** (amber 2.02), **D25 bubble-os** (bubblegum 2.32),
**D18 memphis-squiggle** (pink 2.50), **D12 new-wave-static** (magenta 3.61),
**D21 vista** (burnt-orange 3.62), **D24 fieldnote** (clay 3.63); borderline D05 (4.40) and
D15 (4.24). Dark-ground weak accents (D23, D27) are outside the pale-bg question but recorded.
In every weak case the accent is a fill/decorative token, never body text — body text passes AA everywhere.

## 5. Failures / honest notes

- Task referenced repo/branch/output paths as `undefined`; resolved to workspace root
  `/Users/jeonghun/Typodeck`, branch `audit/box-aesthetic`, and `evals/typo-only/audit.md` (this file).
- Tree was not clean at start (56 pre-existing `evals/hackathon` deletions + `.gitignore` mod);
  recorded, not fixed, per minimal-touch rules.
- No `design.md` exists outside `bold-template-pack/templates/*/`; the "2-3 design.md docs" read were
  field-manual, fika, and signal-board from the pack. `evals/typo-only/` did not exist; created.
- Visual-claim rule (view full-res 1920x1080 PNGs) is N/A: this audit makes no render-quality visual
  claims, only code/token claims cited file:line above. No PNGs were graded PASS/FAIL.
