# Design-Diversity Harness (Agent F, wave-1)

The ONE shared mechanism every design D01–D27 uses. Integration with
authored designs comes later; this directory defines the contract now.

## File map

| File | Role |
|------|------|
| `scaffold.html` | Fixed 1920×1080 stage + uniform scaler (letterbox, no reflow). Each `preview.html` embeds the delimited block verbatim. |
| `validate-design.mjs` | Structural gate: preview.md sections, design.md frontmatter + 23 manual sections, preview.html stage/content/forbidden-text checks. |
| `screenshot.mjs` | Headless-Chrome capture to `evals/design-diversity/screenshots/<DID>.png` + PNG-dimension verification. No new deps. |
| `fonts.md` | Google-Fonts-CDN loading + disclosed fallback policy. No committed fonts. |
| `pptx-fidelity.md` | Per-design export disclosure template (blur/blend/animation/pixel-shadow limits + fallbacks). |
| `HARNESS.md` | This file: end-to-end procedure + Preview-Rules checklist. |

## Conventions

- Design slots are **D01–D27** (screenshots are `<DID>.png`). Never reuse
  study `S`-case ids; the human-study branch data is out of scope.
- Template slug: lowercase-hyphen (`typo-pack/templates/<slug>/`).
- Reference: `typo-pack/templates/8-bit-orbit/` (`preview.md` +
  `design.md`; ships no `preview.html`). Its section skeleton is the
  structural contract; its visual identity must NOT be copied into new designs.

## End-to-end procedure

1. **Author `preview.md`** — 6 sections in order: Files, Selection Metadata,
   Visual Snapshot, Preview Ingredients, International / CJK Preview Note,
   Preview Rules (≥11 rule bullets).
2. **Author `design.md`** — YAML frontmatter with keys `version`, `name`,
   `description`, `colors`, `shadows`, `typography`, `spacing`, `canvas`,
   `components`; then all 23 manual sections (12 L2 in reference order +
   11 scoped L3 subsections — see `validate-design.mjs`).
3. **Build `preview.html`** — embed the `SCAFFOLD-EMBED` block from
   `scaffold.html` verbatim; keep `#deck-stage` at exactly 1920×1080;
   render the standardized PRIMARY content below verbatim.
4. **Validate** — `node evals/design-diversity/harness/validate-design.mjs <slug>`
   must print `RESULT: PASS` (exit 0). Fix FAILs; re-run.
5. **Capture** — `node evals/design-diversity/harness/screenshot.mjs <slug> <DID>`
   must print `VERIFY: PASS (1920x1080)`.
6. **Disclose** — fill the fonts block (`fonts.md`) and the PPTX fidelity
   table (`pptx-fidelity.md`) for the design.
7. **Submit** — `preview.md`, `design.md`, `preview.html`, `<DID>.png`,
   disclosures. No font binaries, no license-grant inventions.

## Standardized comparison content (Lead-fixed, verbatim)

PRIMARY (required in every `preview.html`):

- title: `The Hidden Cost of Rushing to Ship`
- subtitle: `What 11 postmortems taught us about review discipline`
- context: `Typodeck Research · November 2026`

LONG variant:

- title: `Why Every Postmortem Blames Communication While the Real Failures Hide in Unreviewed Configuration Changes`

SHORT variant:

- title: `Ship.`

KOREAN variant:

- title: `서두른 출시의 숨은 비용`
- subtitle: `11개 포스트모템이 가르쳐준 리뷰 원칙`
- context: `Typodeck Research · 2026년 11월`

## Preview-Rules checklist (all 11, per reference)

- [ ] Exactly one title slide at 1920×1080 inside the fixed-stage model.
- [ ] Palette, type roles, surface rhythm, decorative vocabulary preserved.
- [ ] Real title/subtitle/context used; no demo slide content copied.
- [ ] Rendered preview looks like a real first slide, not a selection card.
- [ ] No internal workflow text on the slide: no `preview`, `generated from`,
      `preview.md`, `template`, `preset`, `style option`, `Option A/B/C`,
      file names, paths, or source-doc labels.
- [ ] No template name or slug on the slide itself (chat message only).
- [ ] No requirement notes (vibe, audience, internal-use labels) unless the
      user explicitly wants those exact words in the deck.
- [ ] Only real deck content for visible chrome: deck title, real section
      title, date, author, company, page number, or genuine content phrases.
- [ ] `template.html` not read for preview generation.
- [ ] Other templates' `design.md` files not read.
- [ ] Full `design.md` read before generating final slides after selection.

## Exit codes

- `validate-design.mjs`: 0 = all pass; 1 = content failure; 2 = only
  failure is an absent `preview.html` (reported, distinct from breakage).
- `screenshot.mjs`: 0 = captured and verified 1920×1080; 1 = any failure.
