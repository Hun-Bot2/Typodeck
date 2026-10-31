# 90+ Scoring Rubric (100 points, pass criteria pre-registered)

A 90+ score is a TARGET, not a result to claim. Score only from the evidence
listed per dimension. Provisional scores must name their missing validation.

| Dimension | Max | What earns full marks (evidence required) |
|---|---|---|
| Research quality and provenance | 15 | >=4 bodies of knowledge; every principle has author/source/year-or-unverified/URL-or-biblio/source-type/access-level; access levels honest (no implied full reads); no copyrighted reproduction |
| Theoretical coverage and applicability | 15 | Perception vs convention vs lore explicitly separated; slide transfer reasoned per principle; limitations + counterexamples recorded; Korean/multilingual gaps named |
| Composition Grammar | 25 | >=13 semantic types with >=2 strategies each; typography-native primitives only; deck-aware selection (semantics, length, ideas, evidence, audience, context, language, neighbors, identity, history); machine-readable grammar with preconditions/constraints/tokens/scoring/exceptions/fallback/validation; renderer integration without schema break |
| Optical and multilingual quality | 15 | Bounded corrections with rationale + range + regression test each; measurable/heuristic/experimental tiers separated; experimental never silently applied; Korean breaking/wrapping/autospace/weight/punctuation handled or explicitly deferred |
| Integration and reliability | 10 | Baseline behavior preserved (old tests green); new modules covered by committed tests; real PPTX in/out; structural gates pass; no critical violations |
| Empirical validation | 20 | Paired baseline-vs-improved benchmark on held-out fixtures; objective metrics + failure/baseline-better reporting; blind A/B human protocol executed with >=1 experienced reviewer; statistics (n, CIs, agreement) reported |

## Pass criteria for a 90+ claim (ALL required)

1. No critical structural violations (0 forbidden, 0 overflow, editability 1.0).
2. Documented source provenance (registry complete per schema).
3. Demonstrable renderer integration (improved PPTX differs from baseline by
   the grammar/optical/art-direction pipeline, not by hand edits).
4. Improvement on held-out examples (pre-registered metrics + human A/B).
5. Credible visual or human evaluation evidence (rendered inspection at
   minimum; human study for full credit).
6. Transparent failure reporting (failures + baseline-better cases listed).

If any criterion is missing, report a PROVISIONAL score and the missing
validation. Current report: `evals/90-program-report.md`.
