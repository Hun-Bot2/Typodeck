# Typodeck Skill — Repair Policy (read on demand)

Source: `packages/core/src/critic.ts` (`reviseDeck`).

## Bounded loop (hard rules)

- Max 3 attempts by default (`--revise[=N]` overrides N; seed 42,
  deterministic: same input bytes → same output bytes).
- Each attempt: critique → fix the FIRST error by class only →
  regenerate → re-evaluate.
- Stop on clean (0 errors), on no-alternate, or at max attempts.
- No ping-pong: skip alternates that already failed the SAME check on
  the SAME slide in this run.
- Fixes are targeted only: semantic demotion to `metric-anchored`, or
  an alternate same-type candidate. No random restyling, no shotgun
  edits — one change per attempt.

## Content and provenance

- Content is NEVER rewritten for looks (factual accuracy over visual
  appeal). Editability is re-validated after every attempt.
- Every attempt appends a provenance line (what failed, what was
  tried); CLI prints them as `revise:` lines.
- Rationale gains `; intent-aware` when intent influenced the choice,
  plus `; intent: ...` citation when it changed the outcome.
- Report: attempts used, residual errors/warnings, and all
  `visionUnmeasured` items as unverified. An AI critic — or these
  proxies — is not ground truth.

## Fix at the source

Repair via narrative/composition/intent, re-render, re-verify
affected slides; one fix often moves another problem. Never patch a
generated PPTX. Errors before warnings; warnings ship with the
advisory receipt, never as failures.
