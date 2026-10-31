# Typodeck 90+ Program — Evaluation Report (2026-10-30)

Provisional score: 73/100. NOT a 90+ claim. Missing validation is listed
in §6; the human study is PENDING (no reviewers, no invented results).

## 1. What was built (all verified by run, not by report)

- Evidence registry: `research/typography/evidence-registry.json`
  (46 principles: A01-A13, B01-B14, C01-C09, D01-D10) + `SYNTHESIS.md`.
- Composition Grammar: `packages/core/src/composition.ts` — 13 semantic
  types, 31 candidates (≥2 per type), 13 typography-native primitives,
  deck-aware deterministic selection, machine-readable `COMPOSITION_GRAMMAR`.
- Renderer integration: `layoutDeck(..., {compositionPlan})` applies rhythm
  scale + body measure cap (~60 chars) + body-align overrides. Absent plan =
  byte-identical baseline (all prior tests green).
- Optical engine: `src/optical.ts` — O1 measurable hang (≤0.12in), O2
  heuristic center nudge (≤0.06in), O3/O4 rag/widow scorers (no auto-fix),
  O5 experimental proposals (never applied).
- Art direction: `src/art-direction.ts` — density/emphasis annotation +
  bounded dense-run re-selection + advisory repetition/identity checks.
- Critic + revision: `src/critic.ts` — deterministic structural checks +
  labeled geometric proxies + `visionUnmeasured` list + bounded (≤3) revision
  loop with provenance; content never rewritten.
- Benchmark: `evals/benchmark-90/fixtures.json` (8 held-out ideas B1-B8) +
  `scripts/benchmark-90.ts` → 48 PPTX + `summary.json` (paired deltas).
- Skill: `skills/typodeck/SKILL.md` + composition/optical/revision/
  evaluation/research-index supporting files (progressive disclosure).
- Human package: `protocol.md` + `rubric.md` + `ballot-template.csv` (PENDING).

## 2. Verification observed this session

- Tests: 179/179 pass (clean rebuild + `node --test`), up from the
  adjudicated 149/149 working-tree baseline — 30 new tests (composition 13,
  optical 9, art-direction 4, critic 4). Baseline behavior preserved (no
  prior test touched for greenness).
- Offline eval: F4 6/6 OK. Full matrix still needs live GitHub (quota).
- Benchmark: 48/48 runs OK (seed 42), 0 forbidden, 0 overflow, 0 critic
  errors, 0 triple-repeats in improved mode.
- Rendered inspection (Quick Look covers, 3 pairs): Swiss B2, Korean
  expressive B1, editorial B4 — see §4 (mixed results, reported honestly).

## 3. Objective deltas (improved minus baseline; negative = fewer violations)

Totals over 24 improved vs 24 baseline runs (same narrative bytes):

| Metric | Baseline | Improved | Delta |
|---|---|---|---|
| Forbidden objects | 0 | 0 | 0 |
| Overflow (bounds) | 0 | 0 | 0 |
| Title >2 lines | 137 | 136 | −1 |
| Body >60 chars/line | 118 | 31 | −87 |
| Widow/orphan lines | 119 | 128 | +9 (REGRESSION) |
| Critic errors | n/a | 0 | — |
| Triple-repeats | n/a | 0 | — |

Baseline-better pairs: 14/24 (mostly widow count). The measure cap works
(body>60: 118→31) but narrower columns create more orphans — T8 widow guard
is the known missing fix. Title>2 is a NARRATIVE issue (72-char titles):
layout cannot fix content, by design (accuracy over looks).

## 4. Rendered observations (covers only; inner slides uninspected)

1. B2 swiss: both clean (red kicker, bold title, right body). Improved body
   column slightly narrower. BOTH truncate the title mid-sentence
   ("keeps main...") — T3 narrative issue, unaffected by layout.
2. B1 Korean expressive: Hangul display renders well. Baseline splits an
   eojeol mid-word ("만/들었다"); improved avoids it — but this is line-width
   luck, NOT systematic keep-all (D03 still missing from the wrap engine).
3. B4 editorial: baseline body is one 72-char line (T2 confirmed visually);
   improved wraps to 2 lines ending in a 1-word orphan ("was.") — the widow
   regression made visible.

qlmanage renders first slides only; metric/comparison/dense inner slides are
UNINSPECTED visually. Font substitution, real wrap divergence (T11), and
clipping remain unmeasured (no in-repo rasterizer).

## 5. Provisional rubric score: 73/100

| Dimension | Score | Basis / deduction |
|---|---|---|
| Research provenance (15) | 13 | 46 principles, 4 bodies, honest access levels; −2 some cited URLs re-verified via audit agents, not all hand-opened this session |
| Theory coverage (15) | 13 | perception/convention/lore separated, transfer reasoned, gaps named; −2 no new primary reads beyond audit |
| Composition Grammar (25) | 20 | 13 types × ≥2, 13 primitives, deck-aware selection, integration + tests; −5 audience/context weakly weighted, columns partially applied |
| Optical/multilingual (15) | 9 | bounded tiers + tests, experimental never applied; −6 keep-all/kinsoku/Korean leading NOT in engine |
| Integration (10) | 10 | baseline preserved, 179 green, real PPTX, gates pass |
| Empirical validation (20) | 8 | paired held-out benchmark + honest deltas + cover renders; −12 human study pending, inner slides uninspected, no vision integration |

## 6. Missing validation (blocks any 90+ claim)

1. Human blind A/B not executed (protocol + rubric + ballots ready; reviewers: none).
2. Inner slides (metric/comparison/dense) never visually inspected.
3. No PPTX rasterizer: T11 wrap divergence, font substitution, clipping unmeasured.
4. No vision-model integration (none verified; nothing fabricated).
5. Korean wrap (keep-all/kinsoku), widow guard, narrative title caps unimplemented.
6. Full live-GitHub eval matrix still quota-blocked (offline gates green).

## 7. Failures and limits (kept, not hidden)

- Widow regression (+9) from measure caps; orphan fix deferred to validated re-break.
- Title>2 unchanged (137→136): narrative shortening (72 chars) vs display need
  (~50) unresolved; layout must not shrink display type (A05).
- 14/24 pairs baseline-better on ≥1 metric (widow-driven).
- Metric integrity holds (unsupported numbers demoted, never heroed) but no
  B5 number slide rendered-check passed visual review (covers only).
- Density/rhythm judgments are proxies; art-direction swaps are bounded and
  logged, not aesthetically validated.
