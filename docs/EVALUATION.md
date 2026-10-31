# Typodeck — Evaluation (Phase 0)

> Historical record (2026-10-30): the committed matrix is still the
> 3-system / 24-run shape described here, but metric threshold
> semantics (notably diversity) live in `packages/core/scripts/eval.ts`
> and a 4th system now exists. See `evals/summary.json` for current
> numbers and `docs/DOCS_AUDIT.md` for the audit.

## 1. Fixtures (`evals/fixtures/`)
| ID | Type | Content |
|----|------|---------|
| F1 | doc-rich repo | Public repo, README ≥ 2k words, docs/ ≥ 3 files |
| F2 | code-heavy repo | Public repo, README < 300 words, source ≥ 50 files |
| F3 | repo with numbers | Public repo with ≥ 10 verifiable numbers (stars, versions, benchmarks) |
| F4 | raw idea | 500-word pasted product description, no URL |

Pin exact repo URLs + commit SHAs in `evals/fixtures.json` at Phase 1.

## 2. Procedure
Run each fixture in KO and EN × all three directions (4 × 2 × 3 = 24 runs).
Record per-run JSON report under `evals/reports/`.

## 3. Metrics
| Metric | Definition | Pass |
|--------|------------|------|
| forbidden-object count | Non-textbox shapes/lines/images in PPTX XML | 0 |
| editability | Editable chars / total visible chars | 1.0 |
| overflow | Text boxes exceeding bounds or clipped | 0 |
| source-backed accuracy | Factual claims with ≥1 valid ref / all factual claims (Repo) | ≥ 0.8 |
| unsupported claims | Factual claims with no/invalid ref (Repo) | ≤ 1/deck |
| design diversity | Pairwise direction distance: differ in ≥2 of 3 features (§3, DESIGN_SYSTEM) | all 3 pairs |
| latency | Submit → previews P95 | ≤ 120 s |

## 4. Reproducible Commands (target interface, Phase 1+)
```sh
npm run eval:fixtures          # fetch + pin fixtures
npm run eval -- --lang ko --direction all
npm run eval:report            # aggregate reports → evals/summary.json
```
Reports must include: fixture ID, commit SHA, direction, lang, provider
(muse|fallback), all metric values, and seed.
