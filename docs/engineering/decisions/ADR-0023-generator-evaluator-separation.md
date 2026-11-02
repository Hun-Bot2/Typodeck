# ADR-0023: Separation of generator and evaluator (extends ADR-0018)

Status: Proposed (Stage 2, 2026-11-02). Extends ADR-0018; deterministic
separation parts are already Accepted there. Model-evaluator isolation
requires Stage 3 implementation and Stage 4 measurement.

## Context

Production has no eyes (`research/architecture-audit/03-critic-render-audit.
md`, `04-skill-studio-audit.md`): production `labelDeck` = layout + validate,
critic NOT wired (`packages/core/src/narrative.ts:876`); CLI `make-deck`
never calls critique/revise (`packages/core/scripts/make-deck.ts:63-86`);
Studio generate/export routes never call critique/revise
(`apps/web/app/api/generate/route.ts:203-242`,
`apps/web/app/api/export/route.ts:69`); Proof-tab critic mount is a TODO
(`apps/web/components/studio/WorkspaceStep.tsx:16-17`); quality gate is
advisory-only (`packages/core/src/quality.ts:1-5`). The only end-to-end
critic → revise → export → validate chain lives in
`plugins/typodeck/skills/typodeck/examples/05-improved-pipeline.mjs:47-78`.

Parity gaps on the road to one gate: export route re-layouts without
`compositionPlan` and uses char floor 100 vs CLI exact
(`apps/web/app/api/export/route.ts:74,90`); client Provenance drops quality
scores the CLI receipts show (`apps/web/components/studio/types.ts:52-58`).

Correction to prior briefs: the canonical Skill is
`plugins/typodeck/skills/typodeck/SKILL.md` (11 steps, 121 lines, v0.1.0);
`skills/typodeck/SKILL.md` does not exist. INSTALL.md: Muse VERIFIED,
Codex/Claude DOCUMENTED (audit 04).

## Research evidence (all Verified in `research/paper-survey/`)

- PPTAgent (`04-pptagent-ppteval.md`): self-correction catches execution
  errors only, visual defects survive; same-model generation+evaluation as
  the anti-pattern. PPTEval Pearson 0.71 / κ 0.59 as the evaluator-agreement
  target line.
- PPTBench 2026 (`07-pptbench-2026.md`): 3-round majority judge, 86.5%
  human blind agreement (173/200, CI 81.1–90.6), 96.0% repeatability —
  the reliability-reporting template (agreement + repeatability + rank
  stability) before any "better" claim.

## Interpretation (ours, not the papers')

1. Wire the existing deterministic critic + `reviseDeck` into production
   paths behind explicit flags — no default behavior change until Stage 4
   shows no regression.
2. Any model-based evaluator must be isolated from the generator (different
   model, or rules+model hybrid with the rules side decisive for ship/no-
   ship). Never same-model self-grading for published claims.
3. Close the parity gaps (char floor, provenance scores, compositionPlan
   threading) with tests so CLI/Studio/Skill share one gate function.

## Assumptions

- The deterministic critic (rules + measured DOM) is trustworthy enough to
  gate; the hypothetical part is only model-based hierarchy judgment.
- Human blind evaluation remains the top of the evidence ladder for any
  "outperforms" statement (Stage 4 protocol).

## Alternatives considered

1. Wire critic into production unconditionally now — rejected: unmeasured
   regression risk; flag-gate + evaluate first.
2. Same-model self-grading — rejected: the PPTAgent lesson.
3. Leave the critic in examples/ — rejected: production then has no eyes.

## Existing code that could satisfy the requirement

Promote the pattern (not a code copy) of `examples/05` chain:
`reviseDeck` (maxAttempts 3, seed 42, first-error fix, provenance per
attempt, content never rewritten — `critic.ts:238-298`),
`CriticFinding.suggestedFix` (`critic.ts:25-32`), `validatePptx` ship gate
(`validate.ts:130-190`). Critic is already re-exported from
`packages/core/src/index.ts:23` — the upgrade surface is additive.

## Compatibility implications

- Additive; default paths stay byte-identical until flags are enabled, with
  tests pinning both modes.
- No schema changes in this ADR (finding kinds flow through existing
  `CriticFinding`).

## Acceptance criteria

- One shared gate function called by CLI, Studio, and Skill paths (flagged
  rollout with before/after byte-diff reports).
- Parity gaps closed with regression tests.
- Stage 4 A/B/C/D run with human ground truth; evaluator agreement reported
  (ρ/κ/blind-%) before any superiority claim.

## Decision

Proposed (extends ADR-0018; deterministic parts already Accepted there).
