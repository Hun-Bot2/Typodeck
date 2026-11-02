# Typodeck Skill — Optical Correction (read on demand)

Source: `packages/core/src/optical.ts`. Policy F10.1 holds: glyph-level
compensation lives in font metrics — corrections adjust box placement and
report line quality, never glyph advances.

## Tiers

- Measurable (auto-applied by default): O1 hangs leading quotes/parens on
  left-aligned blocks (bound: min(0.35em, 0.12in)); O3/O4 score rag quality
  and widow risk without auto-fixing.
- Heuristic (opt-in): O2 nudges centered heroes with trailing punctuation
  left (bound: min(0.25em, 0.06in)). Professional practice, needs visual
  confirmation — report it as applied-heuristic, not truth.
- Experimental (proposals ONLY, never applied): O5 large-numeral positioning
  and overshoot. Requires measured glyph metrics + visual review first.

## Apply

`applyOpticalCorrections(deck, {tiers})` → `{deck, log, proposals}`.
Default is measurable-only. Every log entry carries id, tier, rationale,
delta, hard bound, and detail. Re-validate the deck after applying
(`validateDeck`); deltas are margin-safe (x clamped ≥ 0).

## Visual review rules

- Never claim an optical improvement you have not seen rendered. Scorers
  (rag, widow) are regression signals, not verdicts.
- T11 stands: PowerPoint wraps its own way; estimateWrap divergence is
  UNMEASURED structurally. Render and compare before tightening any bound.
- Korean: no synthetic Hangul tracking (D04 autospace-neutral); keep-all +
  kinsoku are specified (D02/D03) but not yet in the wrap engine — say so.
