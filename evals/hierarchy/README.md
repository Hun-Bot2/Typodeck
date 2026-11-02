# Stage-4 Hierarchy Eval

Intent-vs-visual hierarchy alignment suite (09-HCI §4 A/B/C/D design).
NEW files only — nothing outside `evals/hierarchy/` is read for writing.

| File | Purpose |
|---|---|
| `fixtures.json` | 16 intent-annotated slides + known-good references |
| `src/prominence.ts` | Frozen C4 prominence proxy + Spearman (tie-averaged) |
| `src/arms.ts` | Arm A text-only rules + Arm C layout-only checks (new code) |
| `src/defects.ts` | Controlled narrative/deck defect seeds (verified) |
| `src/metrics.ts` | Per-metric aggregation (NO combined score) |
| `src/types.ts` | Shared eval types |
| `src/run.ts` | Runner: A + C + BEFORE/AFTER + gates + results JSON |
| `capture-screenshots.mjs` | B/D pilot: headless-Chrome shots over the HTML mirror ONLY |
| `annotation-template.csv` | Blank human ballot |
| `annotation-guide.md` | B/D pilot protocol + human-review gate (binding) |
| `STAGE4-REPORT.md` | Results report + explicit NOT-PROVEN list |

Run:

```
./node_modules/.bin/tsc -p evals/hierarchy/tsconfig.json
node evals/hierarchy/dist/run.js
node evals/hierarchy/capture-screenshots.mjs
```

Outputs land in `results/` (`stage4-results.json`, `pptx/`, `screenshots/`).
Screenshots carry MIRROR-RISK: mirror HTML, never PPTX parity.
