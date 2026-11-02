# ADR-0002: Typography-first constraints

Status: Accepted. **RECONSTRUCTED 2026-10-31 by Agent E from baseline
`b09865c` evidence** (no ADR files exist on this baseline; each claim
below names the file that proves it).

Evidence: `docs/DESIGN_SYSTEM.md` §1–§2 (allow/forbid lists),
`packages/core/src/systems.ts` (role scales, rhythm, palettes),
`packages/core/src/layout.ts` (deterministic placement),
`packages/core/tests/contrast.test.ts` (WCAG AA per block),
`docs/TYPOGRAPHY_RESEARCH.md` (S1–S14 source study).

## Context

Unconstrained generation drifts toward decoration: cards, rules,
icons, ad-hoc colors. Each addition is a new overflow, contrast, and
editability risk, and decorative visuals can smuggle fabricated
content (fake charts, stock metaphors) into an otherwise grounded
deck.

## Decision

Slides are composed exclusively of editable text, numbers,
whitespace, and flat color. Allowed: family/size/weight, tracking,
leading, left/center/right alignment, margins/gutters/rhythm, solid
text + background colors from theme tokens only. Forbidden:
rectangles/cards/panels, borders, rules/arrows, icons/emoji, images,
rasterized text, gradients/shadows/textures. Body contrast ≥ 4.5:1,
16:9 canvas (13.33×7.5 in), safe margins ≥ 0.5 in. Research grounding
(Butterick, Rutter, klreq) lives in `docs/TYPOGRAPHY_RESEARCH.md`;
only source-supported rules ship, derived values stay labeled.

## Consequences

A small, testable surface: contrast is a regression test, overflow a
release gate (S6: 0). The cost is expressive range — no data graphics
or imagery, ever. Requests for forbidden elements are refused with a
typographic equivalent offered (`skills/typodeck/SKILL.md` §3).
