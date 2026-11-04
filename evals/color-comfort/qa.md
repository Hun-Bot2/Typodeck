# Color-comfort independent QA

- Repo: `/Users/jeonghun/Typodeck` (`pwd` verified)
- Branch: `audit/color-comfort` (`git branch --show-current` verified, stayed on it, zero commits/pushes/amends/rebases/merges/resets)
- Base: `f0aed77` (typo-only READY; `git rev-parse --short HEAD` = f0aed77)
- Prior report read: `evals/typo-only/FINAL-REPORT-KO.md` (full read before judging; F1/F2 closure + box ban + pastel policy honored as no-regress constraints)
- Prior results used: 2 (audit), 1 (research), 4 (sibling color decisions), 3 (specimen updater BLOCKED — explains §6 gap G1)
- Ownership: this file only (`evals/color-comfort/qa.md`). All other paths read-only. No other file written (analysis scripts live in `/tmp`: `qa-pixels.py`, `qa-contrast.py`; BEFORE mates in `/tmp/qa-before/`).
- This QA built NOTHING under review. All aesthetic judgments below are labeled **AGENT assessment**, never human evaluation. No comfort/eye-strain claim is made (no validated slide-comfort metric exists — research P4); verdicts rest on readability, measured WCAG ratios, color harmony, hierarchy support, identity preservation, transitions, EN/KO parity, and typo-only intactness.

## 0. Scope actually changed (verified, not assumed)

- `git status`: 212 files under `evals/hackathon/coverage/` = exactly 14 decks × 15 files (7 HTML + 7 PNG + report.json) + 2 drafting-table report.json. The 14 decks are exactly the 7 token-affected designs × EN/KO: atelier-noir, coin-op, gilded-line, maison, modulo-grid, monolith, night-reel.
- Plus: 9 `design.md` (8 token changes + vista prose-only), 8 `preview.html`, `tools/agent-harness/lib/theme.mjs` (3 slot remaps).
- drafting-table harness PNGs: all 14 byte-identical to `f0aed77` (`cmp` per slide, §5) — light-line is not a harness slot, so only report timestamps changed.
- vista harness: zero changes (design.md prose-only). Untouched decks (fika, etc.): zero changes.
- Forbidden paths untouched: `evals/typo-only/**`, `8-bit-orbit`, `node_modules`, `tsbuildinfo`, `hierarchy/study/annotations/`, `paper-survey-tmp/` — `git status` confirms no modifications by this QA.

## 1. Method + coverage

- Viewed at full-res 1920×1080: **all 98 affected AFTER slides** (7 designs × 7 slides × EN/KO), **13 BEFORE mates** extracted via `git show f0aed77:...` only (`/tmp/qa-before/`), drafting-table 01 EN (identical-bytes representative), and **9 specimen covers** (8 affected + vista).
- Pixel proof (`/tmp/qa-pixels.py`, PIL): all 98 AFTER PNGs assert 1920×1080; per-slide BEFORE/AFTER changed-fraction + bbox recorded in §3 (atelier/night-reel ~96–99% = full-ground swaps; gilded/modulo 1–4% = ink+accent roles; maison/coin-op/monolith ≤0.6% = role-only).
- HTML proof: `git diff` over the 98 slide HTML files = 588 added / 588 deleted lines, and after hex/rgba normalization every line pairs with zero ODD lines — the slide changes are **color values only**, no tag/text/layout edits.
- Box proof: all 98 changed slide HTML files grep **0** matches for `border|box-shadow|linear-gradient|radial-gradient|border-radius|<table|<svg|<canvas|::before|::after`. Typo-only intact; zero new boxes in any viewed render.
- Ratio proof (`/tmp/qa-contrast.py`, independent WCAG implementation): every sibling-claimed ratio reproduced exactly (§2). F1 intact (fjord/off-white 13.56:1), F2 intact (0 "Red squares" in coverage).
- Harness: all 16 affected report.json = PASS 7/7; `node --test tools/agent-harness/tests/` re-run by this QA = **51/51 green**.

## 2. Recomputed contrast ratios (QA-owned numbers)

| Pair | QA ratio | Sibling claim | AA |
|---|---|---|---|
| porcelain/new-noir `#FAF8F5`/`#1D1C1B` | 16.05:1 | 16.05:1 | pass |
| porcelain/old-noir | 17.81:1 | 17.81:1 | pass |
| soft-line/new-noir | 10.28:1 | 10.28:1 | pass |
| gallery-gray/new-noir | 5.97:1 | 5.97:1 | pass |
| wine/old-noir BEFORE (harness kicker) | 1.23:1 | 1.23:1 | FAIL (fixed by remap) |
| phosphor-new/void `#3FE673` | 12.13:1 | 12.13:1 | pass |
| phosphor-old/void | 14.84:1 | 14.84:1 | pass |
| amber-new/void `#F2A91E` | 9.93:1 | 9.93:1 | pass |
| amber-old/void | 10.88:1 | 10.88:1 | pass |
| champagne-new/lacquer `#F0E6D2` | 15.58:1 | 15.58:1 | pass |
| champagne-old/lacquer | 16.82:1 | 16.82:1 | pass |
| champagne-dim/lacquer (new harness muted) | 12.44:1 | 12.44:1 | pass |
| warm-gray/lacquer BEFORE (harness muted) | 1.66:1 | 1.66:1 | FAIL (fixed by remap) |
| gray-new/black `#9C9C9C` | 7.17:1 | 7.17:1 | pass |
| gray-old/black | 3.86:1 | 3.86:1 | FAIL (fixed) |
| gold-deep-new/ivory `#77632F` | 5.26:1 | 5.26:1 | pass |
| gold-deep-old/ivory | 3.45:1 | 3.45:1 | FAIL (fixed) |
| white/deep-new `#1C2C4E` | 13.82:1 | 13.82:1 | pass |
| white/deep-old | 15.97:1 | 15.97:1 | pass |
| amber/deep-new | 6.83:1 | 6.83:1 | pass |
| amber/deep-old | 7.90:1 | 7.90:1 | pass |
| amber/white (still forbidden) | 2.02:1 | 2.02:1 | FAIL (stays off white) |
| amber-deep/white (still forbidden) | 2.77:1 | 2.77:1 | FAIL (stays non-text) |
| orange-new/black `#F04E12` | 5.33:1 | 5.33:1 | pass |
| orange-old/black | 5.80:1 | 5.80:1 | pass |
| white/black-new `#101012` | 17.43:1 | 17.43:1 | pass |
| white/black-old `#000000` | 19.26:1 | 19.26:1 | pass |
| red-new/black-new `#E5484D` | 4.86:1 | 4.86:1 | pass |
| red-old/black-old | 3.37:1 | 3.37:1 | large-only (fixed) |
| smoke/black-new | 5.51:1 | 5.51:1 | pass |
| dialogue/black-new | 11.48:1 | 11.48:1 | pass |
| light-line-new/blueprint `#93C2EE` | 5.68:1 | 5.68:1 | pass |
| light-line-old/blueprint | 4.83:1 | 4.83:1 | pass (thin → headroom) |
| fika F1 fjord/off-white | 13.56:1 | 13.56:1 | pass (intact) |
| vista cream-white/teal-deep | 14.35:1 | 14.35:1 | pass (untouched) |
| vista sand/deep-teal | 9.92:1 | 9.92:1 | pass (untouched) |
| vista burnt-orange/sand | 3.00:1 | 3.00:1 | exact floor (untouched, correctly) |

Saturation (QA recomputed): phosphor 1.00→0.77, amber 1.00→0.89, signal-orange 1.00→0.88, blood-red 0.83→0.75 — all match sibling claims.

## 3. Per-design verdicts (AGENT assessments)

### atelier-noir — APPROVE
- Change: noir `#111111`→`#1D1C1B`; harness accent wine→porcelain.
- Pixel evidence: all 14 slides changed_frac 0.96–0.99 (full-ground); BEFORE 01/06 EN+KO show the wine kicker + wine flag costs nearly invisible (1.23:1); AFTER kicker/costs crisp porcelain (16.05:1). Ground still reads near-black; monochrome couture identity preserved.
- Viewed: full 7-slide EN+KO AFTER + 4 BEFORE. Readability up everywhere; KO line-breaks clean, mixed Latin (`action item`, `FIXTURE`, `PR`) intact; no boxes; single ground = no transitions issue.
- Observation (not a defect): flag costs (slide 06: 5h/9h/12h/7h) lost their red hue and now read via weight-700 only. The old hue was non-functional (1.23:1), and the palette offers no other text-safe accent on noir — accepted trade-off. Owner-uncertain case U1 if hue-flagging matters.

### coin-op — APPROVE
- Change: phosphor `#33FF66`→`#3FE673` (S 1.00→0.77), amber `#FFB000`→`#F2A91E` (S 1.00→0.89), glow stops re-matched + alphas trimmed; void kept.
- Pixel evidence: changed_frac ≤0.006, bboxes confined to kicker/flag strips; BEFORE vs AFTER 01 side-by-side nearly identical to the eye — arcade identity fully intact. Slide 05 EN: Rushed column phosphor vs Reviewed bone keeps hue+position hierarchy.
- Viewed: full 7-slide EN+KO AFTER + 1 BEFORE. No boxes; D08 glyph-glow-only intact (0 box-shadow in all 14 slide HTML files); parity good.
- Gap: the glow-trim effect is only measurable, not render-verified at display scale — specimens/previews carrying the glow are stale/unrendered (§6 G1/G3). The harness verdict does not depend on it.

### gilded-line — APPROVE
- Change: champagne `#F5EFE0`→`#F0E6D2` (design's own warmer-cover direction); harness muted warm-gray→champagne-dim.
- Pixel evidence: changed_frac 0.011–0.029 across ink+muted roles; BEFORE 01/06 EN show metaline, ledger headers, caption, footer in near-invisible warm-gray (1.66:1); AFTER all readable champagne-dim (12.44:1). Gold kicker/accents intact; deco identity preserved.
- Viewed: full 7-slide EN+KO AFTER + 2 BEFORE. Slide 05 EN: Rushed gold vs Reviewed champagne — color+position mark sides. No boxes; parity good.
- Observation: muted (12.44:1) vs ink (15.58:1) are close in value; hierarchy now leans on size/weight. Readable and calm — accepted. Owner-uncertain case U2 only if stronger muted separation is wanted (the alternative was invisible text).

### maison — APPROVE
- Change: gray `#6E6E6E`→`#9C9C9C` (3.86→7.17:1), gold-deep `#9A7F45`→`#77632F` (3.45→5.26:1 on ivory).
- Pixel evidence: changed_frac 0.001–0.006 in tertiary roles; BEFORE 01 EN metaline dimmer vs AFTER clearly readable yet still subordinate to ivory body — four-tone discipline preserved. Gold kicker/flags intact.
- Viewed: full 7-slide EN+KO AFTER + 1 BEFORE. No boxes; parity good.
- Gap: gold-deep-on-ivory (5.26:1) is arithmetic-only — no ivory-alternate slide exists in the harness, and specimens are stale (§6 G1). The black-ground gray fix is render-verified; the ivory-ground fix awaits specimen regen + re-QA.

### modulo-grid — APPROVE
- Change: deep `#14213D`→`#1C2C4E`; harness accent amber→deep.
- Pixel evidence: changed_frac 0.011–0.038; BEFORE 01/06 EN show washed-out amber kicker/flags on white (2.02:1, violating the design's own never-amber-on-white rule); AFTER deep-navy roles crisp (13.82:1). Architectural identity preserved; amber correctly absent from white-ground harness slides.
- Viewed: full 7-slide EN+KO AFTER + 2 BEFORE. No boxes; parity good.
- Observation (same class as atelier): slide 06 flag costs now weight-only (deep 700). Forced by the design's own rule — accepted. Owner-uncertain case U3 if flag hue is wanted (no rule-compliant hue exists on white).
- Gap: the deep-ground stat moments (amber-on-deep 6.83:1) and the narrowed white↔deep jump are unverified in render — they live in stale specimens/full-decks (§6 G1/G2).

### monolith — APPROVE
- Change: signal-orange `#FF4D00`→`#F04E12` (S 1.00→0.88, 5.80→5.33:1).
- Pixel evidence: changed_frac ≤0.006 in kicker/flag roles; BEFORE vs AFTER 01 nearly identical to the eye — still loud, hot, structural. Slide 05 EN: Rushed orange vs Reviewed bone hierarchy intact.
- Viewed: full 7-slide EN+KO AFTER + 1 BEFORE. No boxes; parity good. One-strike rationing unchanged.

### night-reel — APPROVE
- Change: black `#000000`→`#101012`; blood-red `#C1121F`→`#E5484D` (3.37→4.86:1, S 0.83→0.75).
- Pixel evidence: all 14 slides changed_frac 0.96–0.99 (full-ground); ground still reads black in the letterbox frame (AGENT assessment); BEFORE 01/06 EN kicker/flags dimmer vs AFTER bright readable red. Widest range narrowed 19.26→17.43:1.
- Viewed: full 7-slide EN+KO AFTER + 2 BEFORE. Slide 05 EN: Rushed red vs Reviewed white — hierarchy supported. No boxes.
- Pre-existing, not a regression: KO 05 carries no `.bad` flags in EITHER before or after (verified in HTML) — EN/KO fixture asymmetry predates this change; color parity itself is exact.

### drafting-table — APPROVE (token change; no rendered demonstration yet)
- Change: light-line `#7FB3E8`→`#93C2EE` (4.83→5.68:1 headroom); blueprint untouched.
- Evidence: all 14 harness PNGs byte-identical to `f0aed77` (`cmp` clean) — the slot is unused by the harness, so zero render risk and zero render proof. Ratio verified arithmetically. Viewed 01 EN: blueprint + white + amber system clean, no boxes.
- Gap: the new light-line value appears in NO rendered PNG anywhere (specimens stale, §6 G1). Specimen regen + re-QA required before the value is visually confirmed.

### vista — APPROVE (retain without change)
- Evidence: zero harness diffs, zero token diffs (design.md prose-only); QA recomputed 14.35/9.92/exact-3.00:1 — matches sibling; touching the exact-floor burnt-orange pair would risk regression for no gain. Specimen cover viewed: current (tokens unchanged), clean bands, no boxes.

## 4. Cross-cutting checks

- Readability: every changed text pair passes AA with margin (min 4.86:1 night-reel red; min small-text 5.26:1 maison gold-deep). Three former AA failures fixed and two invisible-harness roles (1.23/1.66:1) repaired — all render-verified except maison-ivory (G1).
- Color harmony (AGENT): no new hues introduced anywhere; all moves are luminance/saturation steps or slot remaps to in-palette inks. No clashes observed in any of the 98 slides.
- Hierarchy support (AGENT): atelier/gilded/modulo remaps trade failed hues for readable inks; flag roles in atelier/modulo fall back to weight-only (U1/U3). Gilded muted-vs-ink separation narrows (U2). All accepted; none rise to REWORK.
- Identity preservation (AGENT): all 9 identities read intact — couture monochrome, arcade phosphor, deco lacquer/gold, maison four-tone, modular navy, brutalist strike, noir letterbox, blueprint sheet, travel-poster bands.
- Cross-slide comfort transitions: every harness deck holds a single ground across all 7 slides (verified by full-sequence viewing) — no new jumps; atelier/night-reel grounds narrowed in range. Modulo/maison alternation disciplines are prose-only until specimens/full-decks regenerate (G1/G2).
- EN/KO parity: all 7 designs parity-clean on color; KO breaks/line-mixing intact. Only asymmetry (KO 05 missing `.bad`) is pre-existing fixture content, identical before/after.
- Typo-only intact: color-only HTML diffs (588+/588− paired), 0 box-pattern matches in all 98 files, 0 boxes in all 98 viewed renders + 9 covers. F1/F2 intact. D07 (amber-off-white) and D08 (glyph-glow-only) honored; wine stays retired; bands not revived.

## 5. Honest-failure / NOT RUN list

- G1: `evals/design-quality/specimens/` for all 8 token-changed designs are STALE — HTML+PNG still carry old tokens (verified: `#111111`, `#FFB000`, `#7FB3E8`, `#F5EFE0`, `#14213D`, `#000000`, `#C1121F` present; 8 covers viewed showing BEFORE colors). Another stage must regenerate + re-QA. (Prior result 3 was blocked on exactly this.)
- G2: `evals/design-quality/full-decks/modulo-grid/` unregenerated (still `#14213D` family) — deep-ground jump narrowing unverified in render.
- G3: 8 `preview.html` color edits are code-consistent with `design.md` tokens (diff-verified) but NEVER rendered to PNG — visual verification NOT RUN.
- G4: PPTX-native appearance of changed grounds NOT RUN (inherited typo-only gap).
- G5: Full 54-deck sweep not re-run (16 affected report.json are current PASS 7/7; `coverage.json` last full-sweep record untouched).
- G6: Comfort itself has no validated metric — no eye-strain/comfort verdict is claimed; "comfort" evidence here = WCAG arithmetic + full-res AGENT viewing only.

## 6. Owner-uncertain cases (AGENT judgment, needs human eye)

- U1 atelier: flag costs weight-only (no hue). U2 gilded: muted-vs-ink value gap narrow. U3 modulo: flag costs weight-only (rule-forced). All three are accepted trade-offs for readability; flag only if the owner wants stronger secondary encoding.
- No REWORK or REJECT: every verdict is APPROVE on the color decisions as rendered in the harness. Initiative-level READY additionally requires G1+G2 regen with re-QA.

## Verdict

- 9 APPROVE (atelier-noir, coin-op, gilded-line, maison, modulo-grid, monolith, night-reel, drafting-table, vista), 0 REWORK, 0 REJECT — scoped to the color decisions and harness renders. Cross-cutting gaps G1–G6 recorded above; G1/G2 need another stage + re-QA.

---

# Re-QA: specimen + modulo full-deck re-captures (2026-11-04)

- Repo: `/Users/jeonghun/Typodeck` (`pwd` verified)
- Branch: `audit/color-comfort` (`git branch --show-current` verified, stayed on it, zero commits/pushes/amends/rebases/merges/resets)
- Base: `f0aed77` (BEFORE mates extracted via `git show f0aed77:...` ONLY into `/tmp/reqa-before/`)
- Context read fully first: `audit.md`, `research.md`, `qa.md` (§§0–6 + Verdict above), `FINAL-REPORT-KO.md`
- Palettes read: all 9 committed `design.md` diffs (`git diff f0aed77 -- bold-template-pack/templates/*/design.md`) — read-only, never edited
- Prior result used: 1 (SPECIMENS FINISH — its file/byte claims re-verified below, not assumed)
- Ownership: this section only (append to `evals/color-comfort/qa.md`). All other paths read-only. Analysis scripts live in `/tmp` (`reqa-pixels.py`, `reqa-sample.py`); BEFORE mates in `/tmp/reqa-before/`.
- This re-QA built NOTHING under review. All aesthetic judgments below are labeled **AGENT assessment**, never human evaluation. No comfort/eye-strain claim is made (research P4); verdicts rest on readability, re-measured WCAG ratios, color harmony, hierarchy support, identity preservation, transitions, typo-only intactness, and full-res viewing.

## R0. Scope verified (not assumed)

- `git diff --name-only f0aed77 -- evals/design-quality` = 71 files: 24 specimen PNG (8 designs × cover/evidence/explanation) + 7 modulo full-deck slide PNG + 31 matching HTML + 9 report.json. **31 PNGs re-captured, 31 BEFORE mates extracted — all 62 viewed at full-res 1920×1080 by this re-QA.**
- IHDR check (`reqa-pixels.py`): **31/31 AFTER + 31/31 BEFORE assert exactly 1920×1080, 0 dim-failures.**
- Changed fractions (AFTER vs BEFORE, threshold 8): atelier 0.977–0.983, night-reel 0.894–0.968, modulo specimen evidence 0.955, full-deck slide-02 0.958 (full-ground/deep swaps, bbox full-frame); full-deck whites 0.009–0.035; coin-op 0.017–0.033 (glow/type regions); drafting-table 0.0025–0.0038 (secondary marks); maison ≤0.0019 (tertiary roles); gilded/monolith ~0.0000 with bboxes confined to ink/strike type roles. Every fraction matches its design's documented change class.
- Ground-pixel samples (`reqa-sample.py`): atelier `#1D1C1B`, night-reel bars `#101012`, modulo deep `#1C2C4E` (specimen evidence + full-deck slide-02), coin-op void `#060A06`, monolith `#0E0E0E`, gilded lacquer `#0F0E0C`, maison black `#0B0B0C`, drafting blueprint `#0F3D7A` — **all AFTER samples match new tokens exactly; BEFORE mates carry old values.**
- Old-token grep over all 31 AFTER specimen/full-deck HTML files (`#111111|#33FF66|#FFB000|#7FB3E8|#F5EFE0|#14213D|#000000|#C1121F|#FF4D00|#6E6E6E|#9A7F45`): **zero matches.** Remaining `#000` is the universal outer scaffold (`html,body` + `#deck-viewport` background, verified present in all 27 specimen cover.html incl. untouched designs) — in-slide stage surfaces override it (night-reel rendered bars sample `#101012`).
- Vista: only diffs vs `f0aed77` are `design.md` prose-only (+2 rationale lines) + 2 coverage report.json `createdAt` timestamp-only changes. **Zero specimen/full-deck PNG/HTML diffs — retain-no-change confirmed.**

## R1. Recomputed contrast ratios (re-QA-owned numbers)

Independent WCAG implementation (`reqa-pixels.py`); every value reproduces the sibling/design.md claim exactly:

| Pair | Re-QA ratio | Claim | AA |
|---|---|---|---|
| porcelain/new-noir `#FAF8F5`/`#1D1C1B` | 16.05:1 | 16.05:1 | pass |
| soft-line/new-noir | 10.28:1 | 10.28:1 | pass |
| gallery-gray/new-noir | 5.97:1 | 5.97:1 | pass |
| phosphor-new/void `#3FE673` | 12.13:1 | 12.13:1 | pass |
| amber-new/void `#F2A91E` | 9.93:1 | 9.93:1 | pass |
| bone/void | 15.68:1 | 15.68:1 | pass |
| champagne-new/lacquer `#F0E6D2` | 15.58:1 | 15.58:1 | pass |
| champagne-dim/lacquer | 12.44:1 | 12.44:1 | pass |
| gold/lacquer | 9.18:1 | 9.18:1 | pass |
| gray-new/black `#9C9C9C` | 7.17:1 | 7.17:1 | pass |
| gold-deep-new/ivory `#77632F` | 5.26:1 | 5.26:1 | pass |
| ivory/black | 17.79:1 | 17.79:1 | pass |
| gold/black | 8.47:1 | 8.47:1 | pass |
| white/deep-new `#1C2C4E` | 13.82:1 | 13.82:1 | pass |
| amber/deep-new | 6.83:1 | 6.83:1 | pass |
| deep-new/white (headline) | 13.82:1 | 13.82:1 | pass |
| deep-new/amber (slide-07 closing) | 6.83:1 | — (new pair, first measured here) | pass |
| orange-new/black `#F04E12` | 5.33:1 | 5.33:1 | pass |
| bone/black | 17.00:1 | 17.00:1 | pass |
| white/black-new `#101012` | 17.43:1 | 17.43:1 | pass |
| red-new/black-new `#E5484D` | 4.86:1 | 4.86:1 | pass |
| smoke/black-new | 5.51:1 | 5.51:1 | pass |
| dialogue/black-new | 11.48:1 | 11.48:1 | pass |
| light-line-new/blueprint `#93C2EE` | 5.68:1 | 5.68:1 | pass |
| white/blueprint | 10.67:1 | 10.67:1 | pass |
| pale-blue/blueprint | 8.41:1 | 8.41:1 | pass |

Saturation re-verified: phosphor 1.00→0.77, amber 1.00→0.89, signal-orange 1.00→0.88, blood-red 0.83→0.75 — all match.

## R2. Per-design verdicts (AGENT assessments, pixel evidence)

### atelier-noir specimens — APPROVE
- Pixel evidence: changed_frac 0.977–0.983 full-frame; ground samples `#1D1C1B` (was `#111111`). AFTER cover/evidence/explanation viewed: ground still reads near-black (AGENT); porcelain Didone headlines, tagline, gallery-gray caps (`N°11 · THE RUSH ISSUE`, folios `01/03`) all crisp; giant numeral watermark intact; monochrome couture identity preserved. BEFORE mates viewed: identical layouts, fractionally darker ground.
- Readability: 16.05/10.28/5.97:1 all pass. No boxes in any of the 3 AFTER renders. Typo-only intact.

### coin-op specimens — APPROVE
- Pixel evidence: changed_frac 0.017–0.033, bboxes confined to glow/type regions. AFTER viewed: **true pixel fonts confirmed (VT323 display, Silkscreen caps) — the checkpoint webfont-fallback capture defect is fixed in the re-captured `cover.png` (209673B)**, verified by glyph inspection, not just byte size. Glow halos visibly tighter on AFTER (evidence `63%`, cover headline) while staying arcade-luminous; 13px micro labels (`INSERT COIN`, `1UP`) remain bone/amber-deep per the micro rule. BEFORE mates viewed: same layouts, marginally hotter bloom. D08 glyph-glow-only intact (0 box-shadow; no boxes in renders).
- Readability: 12.13/9.93/15.68:1 pass. Hierarchy (phosphor display vs bone body vs amber marquee) unchanged. The §3-coin-op glow-trim gap is now **render-verified at specimen scale**.

### drafting-table specimens — APPROVE
- Pixel evidence: changed_frac 0.0025–0.0038 in header-tag/sheet-line roles. AFTER viewed: the **first rendered demonstration of new light-line `#93C2EE`** — tags (`SHEET A-01 · COVER`, `SCALE 1:50`, `TYPODECK RESEARCH`) read brighter than BEFORE mates with blueprint/white/amber system otherwise identical; no boxes.
- Readability: 5.68:1 (was thin 4.83:1) with P4 headroom. The §3-drafting-table "no rendered PNG anywhere" gap is now **closed**.

### gilded-line specimens — APPROVE
- Pixel evidence: changed_frac ~0.0000, bboxes confined to champagne ink roles. AFTER viewed: warmer champagne headlines (`The Hidden Cost of Rushing to Ship`, `63%`, `Two teams, one deadline`) crisp on lacquer; gold rules/diamonds/kicker intact; deco identity preserved. BEFORE mates viewed: same layouts, fractionally cooler champagne. No boxes.
- Readability: 15.58/12.44/9.18:1 pass. Owner-uncertain U2 (muted-vs-ink value gap) is unchanged in kind at specimen scale and remains an accepted trade-off, not a defect.

### maison specimens — APPROVE
- Pixel evidence: changed_frac ≤0.0019 in tertiary roles. AFTER viewed: **evidence.png IS the ivory-ground alternate — gold-deep labels (`FINDING 01`, `FEWER SEV-1 ROLLBACKS`, `contained` italic) render readable at 5.26:1**, closing the arithmetic-only gap; gray micro text (cover folio `01/03`, evidence caption `Fixture data · not a real study`) readable yet subordinate; four-tone discipline preserved. BEFORE mates viewed: same layouts with dimmer gray (3.86:1) and washed gold-deep (3.45:1). No boxes.
- Readability: both former AA failures fixed and **both now render-verified**. Black↔ivory alternation appears once across the 3 specimens (cover black / evidence ivory / explanation black) — the never-twice-in-a-row bound holds.

### modulo-grid specimens — APPROVE
- Pixel evidence: cover 0.0266 + explanation 0.0195 (deep ink roles), evidence 0.955 full-deep. AFTER viewed: deep-navy headlines crisp on white (13.82:1); evidence full-deep slide with white type + amber `63%` stat strong (6.83:1); amber correctly absent from white grounds; architectural identity preserved. BEFORE mates viewed: same layouts, deeper navy. No boxes.
- The white↔deep jump narrowing (15.97→13.82:1) is **render-verified**; D07 amber-off-white holds.

### monolith specimens — APPROVE
- Pixel evidence: changed_frac ~0.0000, bboxes confined to strike roles. AFTER viewed: still loud, hot, structural — orange strike (`RUSHING`, `63%`, `DISCIPLINED REVIEW`) at poster scale, one strike per slide (rationing unchanged); bone mega type + dim meta intact. BEFORE mates nearly identical to the eye. No boxes.
- Readability: 5.33:1 strike / 17.00:1 bone pass. Rushed-vs-Reviewed side hierarchy (explanation) intact.

### night-reel specimens — APPROVE
- Pixel evidence: changed_frac 0.894–0.968 full-frame; bars sample `#101012` (was `#000000`). AFTER viewed: ground **still reads black in the letterbox frame (AGENT assessment)**; red kicker (`A STUDY IN REVIEW DISCIPLINE`, `FINDING 01`, `THE CHOICE`) bright and readable at 4.86:1; single red beat per slide intact; smoke/dialogue metadata readable. BEFORE mates viewed: pure-black ground with dimmer blood-red (3.37:1). No boxes.
- Readability: widest range narrowed 19.26→17.43:1; red now passes at small sizes too.

### modulo-grid full-deck (slides 01–07) — APPROVE
- Pixel evidence: slide-02 0.958 full-deep; whites 0.009–0.035; deep-mid sample `#1C2C4E`. All 7 AFTER + 7 BEFORE viewed in sequence: 01 white cover (deep headline) → 02 full-deep divider (white title + amber `01`) → 03/04/05/06 white (statement, deep-stat evidence, comparison, dense ledger) → 07 amber closing (deep-navy `Slow the review. Ship once.` at 6.83:1, first measured here). Never two consecutive full-deep slides; never mixed grounds within a slide — the restated alternation discipline holds in render. The §3-modulo gap (deep-ground stat moments + narrowed jump unverified) is now **closed**.
- Observation (not a defect): slide-05 Rushed-side bullets are small amber ■ markers on white (2.02:1 as a pair). They are **non-text glyphs, pre-existing in BEFORE identically**, always adjacent to deep-navy text (redundant encoding per P5); D07 governs amber *text* on white, and no amber text appears on any white slide. No action.

### vista — APPROVE (retain without change, re-confirmed)
- Zero specimen/full-deck diffs; design.md prose-only; harness report.json timestamp-only. No re-capture exists or is needed. Exact-floor burnt-orange pair (3.00:1) correctly untouched.

## R3. Cross-cutting re-QA checks

- Readability: every specimen/full-deck text pair passes AA with margin (min 4.86:1 night-reel red; min small-text 5.26:1 maison gold-deep). All three former AA failures + two invisible harness roles remain fixed; maison-ivory is now render-verified, not arithmetic-only.
- Color harmony (AGENT): no new hues; all moves remain luminance/saturation steps within documented palettes. No clashes in any of the 62 viewed renders.
- Hierarchy support (AGENT): kicker/display/body/marker voices unchanged in every design; flag/marker roles intact at specimen scale.
- Identity preservation (AGENT): all 8 changed identities read intact — couture monochrome, arcade phosphor, blueprint sheet, deco lacquer/gold, maison four-tone, modular navy, brutalist strike, noir letterbox.
- Cross-slide transitions: modulo full-deck (the only multi-ground deck in scope) shows the narrowed white↔deep jump with discipline intact; maison specimens show one bounded black↔ivory alternation; all other sets hold a single ground.
- Typo-only intact: 0 boxes in all 62 viewed renders; 0 old-token matches in all 31 AFTER HTML files; `#000` scaffold-only (verified universal); F1/F2/D07/D08/wine-retired/band-ban all hold.
- Prior-result verification: prior result 1's re-verifiable claims all reproduce — 31 PNGs 1920×1080, changed-fraction classes, new-token pixel samples, coin-op re-capture size 209673B with pixel fonts confirmed by viewing, report.json/timestamp records (read, not edited).

## R4. Gap closure + remaining

- CLOSED by this re-QA: G1 (8 specimen sets regenerated + re-QA'd), G2 (modulo full-deck regenerated + re-QA'd), maison-ivory arithmetic-only, drafting-table no-render, coin-op glow-trim render proof, coin-op fallback-font capture defect (fixed + re-viewed).
- REMAIN: G4 PPTX-native appearance NOT RUN (inherited); G5 full 54-deck sweep not re-run; G6 no validated comfort metric (no comfort verdict claimed here either); U1/U2/U3 owner-uncertain trade-offs (unchanged, still accepted); D12/D15 owner decisions (untouched).
- Honest record: this re-QA viewed specimens + full-deck only (its scope); harness-slide verdicts (§3) are referenced, not re-viewed. No EN/KO parity dimension exists at specimen scale (single-language fixtures).

## Re-QA verdict

- **9 APPROVE, 0 REWORK, 0 REJECT** — atelier-noir, coin-op, gilded-line, maison, modulo-grid (specimens + full-deck), monolith, night-reel, drafting-table specimens, vista retain. The §6 conditions for initiative READY within specimen/full-deck scope (G1+G2 regen with re-QA) are satisfied; remaining gaps are owner-decision or inherited items listed in R4.
