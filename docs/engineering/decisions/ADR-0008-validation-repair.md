# ADR-0008: Validation gates with advisory repair

Status: Accepted. **RECONSTRUCTED 2026-10-31 by Agent E from baseline
`b09865c` evidence** (no ADR files exist on this baseline; each claim
below names the file that proves it).

Evidence: `packages/core/src/validate.ts` (structural gates),
`packages/core/src/quality.ts` (Narrative Quality Gate),
`packages/core/src/critic.ts` + `optical.ts` (bounded review),
`packages/core/src/layout.ts` (fit/remediation in-engine),
`evals/summary.json` (S1–S7 + quality block).

## Context

A deck pipeline needs hard stops for corruption (uneditable output,
overflow) but must not refuse to ship over taste: a redundant slide
is a warning, a rasterized slide is a failure.

## Decision

Two layers. Hard gates fail the run: the structural validator unzips
each PPTX and rejects forbidden elements, out-of-bounds boxes, and
sub-floor editability (`export-validation-failed` — do not ship).
Advisory layers warn: the Narrative Quality Gate scores
meaningfulness/coherence/fidelity/information value
(`pass|review` + warnings, never fails a build); the critic applies
bounded (≤3) revisions with provenance and never rewrites content;
optical corrections carry rationale + bound + regression test each
(O1 ≤0.12in hang, O2 ≤0.06in nudge; O5 proposals never applied).
Layout remediates in-engine first (wrap, step-down) and flags what it
cannot fit.

## Consequences

Every shipped `.pptx` is structurally sound by construction, while
content judgment stays human (warnings surface in receipts, eval
reports, and the Studio). The cost: honest gaps stay visible — e.g.
no separate clipped-text detector exists beyond the engine's fitting,
and unmeasured items (font substitution, real wrap) are named, never
claimed.
