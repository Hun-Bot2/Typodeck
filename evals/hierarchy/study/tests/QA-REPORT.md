# Human-study QA report (wave 2)

- Date: 2026-11-03 (UTC)
- Script: `evals/hierarchy/study/tests/qa-check.mjs` (runnable: `node evals/hierarchy/study/tests/qa-check.mjs [--base URL]`, exit 0 = all pass)
- App: `next dev` for `apps/web` on port **3100** (port 3000 was already occupied by an unrelated listener, left untouched)
- QA reviewers used (all `test-*`, namespaced under `annotations/test/`): `test-qa-20261103-110644`, `test-qa-20261103-110803`, plus `-partial` / `-ghost` suffixed ids. No `annotations/` files outside `test/` were touched. No implementation file was modified.
- Final run: **29/29 checks pass** (reviewer `test-qa-20261103-110803`).

## Verdicts

| # | Check | Verdict | Detail |
|---|---|---|---|
| 1 | page:study-200 | pass | `GET /study` → 200, ~13 KB |
| 2 | api:manifest-200 | pass | `GET /api/study/manifest` → 200 |
| 3 | data:manifest-shape | pass | 27 cases, `study-v1`, seed 20261103 |
| 4 | data:projection-keys | pass | every case exactly `{caseId,slide,system,elements}` |
| 5 | leak:manifest | pass | no `origin`/`defectSeed`/`expected` keys, no known defect labels/values |
| 6 | api:progress-fresh | pass | fresh reviewer → 200, `done=0`, empty annotations |
| 7 | leak:progress | pass | no secret keys/values |
| 8 | api:export-prefinalize-404 | pass | pre-finalize export → 404 |
| 9 | leak:export-attempt | pass | no secret keys/values in 404 body |
| 10 | api:results-prefinalize-404 | pass | pre-finalize results → 404 |
| 11 | api:annotate-first | pass | full-patch annotate S01 → 200 `{ok:true}` |
| 12 | leak:annotate | pass | no secret keys/values |
| 13 | leak:study-html | pass | no secret keys/values in `/study` HTML |
| 14 | api:progress-resume | pass | mid-way progress `done=14`, matches annotated count |
| 15 | api:annotate-all27 | pass | all 27 cases annotated (firstFocus+ranking+groups+problems+confidence+interpretation) → 200 |
| 16 | api:progress-full | pass | full progress `done=27` |
| 17 | api:finalize-1 | pass | finalize → 200 with snapshot name |
| 18 | api:finalize-2-new | pass | second finalize → 200 with a NEW distinct timestamp |
| 19 | data:snapshot-kept | pass | both snapshots exist on disk (never overwritten) |
| 20 | api:export-json | pass | export JSON → 200, 27 annotations |
| 21 | api:export-csv | pass | export CSV → 200, exact 11-column header, 27 data rows, all rows parse with 11 cols |
| 22 | api:run-eval | pass | run-eval route → 200, arms `A:RUN B:NOT RUN C:RUN D:NOT RUN` |
| 23 | api:results-post | pass | results → 200, 27 rows, B/D `NOT RUN` + reason, secret-derived defect data present (only here) |
| 24 | api:bad-block-4xx | pass | unknown block id → 400 (client-error; see note 1) |
| 25 | api:finalize-partial-4xx | pass | finalize with 1/27 done → 422 |
| 26 | api:export-ghost-404 | pass | unknown reviewer export → 404 |
| 27 | page:frozen-strings | pass | all 5 question strings + `평가 시작/응답 검토/결과 저장/결과 내보내기` + `평가 N / M` pattern in HTML + 17 JS chunks |
| 28 | leak:study-bundle | pass | no secret keys/values in served HTML+JS |
| 29 | core:npm-test | pass | `npm test` exit 0: 555 pass, 0 fail (~27 s) |

## Notes (observations, not bugs)

1. Bad block id returns **400**, not 422. `CONTRACTS.md` §S3 does not pin an error code for annotate validation (it pins 404 only for export/results-before-finalize), so 400 is contract-compliant client-error behavior. Repro: `POST /api/study/annotate {reviewerId, caseId, patch:{firstFocus:"no-such-block"}}` → 400 `invalid-patch`.
2. The `deliberateCrop` block flag is served to the client (S13/S14/S25 slides) by design: it is a render attribute, not an expected label, and appears on non-disputed cases too. Excluded from leak tokens.
3. Post-finalize results surface expected/secret-derived data under `repair.defect` (`category`/`mutation`, e.g. `headline-prominence`/`demote-primary`), not under a literal `expected` key. This satisfies "only this endpoint may include expected data".
4. `test-` reviewers persist under `annotations/test/`; results for QA reviewers land in `study/results/test-qa-*` and are excluded from owner results per §S0.

## Bugs found

None. Every check above has a pass verdict; no implementation change is requested.

## Amendment 2026-11-03 — S23/S24 exclusion (owner-reported duplicate renders)

Owner found S23/S24 render byte-identical to S02/S04 (intent-only
variants). Fix: `status: excluded` in generator + cases.json; server
manifest/finalize/annotate/run-eval skip excluded (25 active);
welcome screen notes variants; guide/README updated; qa-check updated
(27→25 assertions + 2 exclusion checks). Re-run: 31/31 pass
(`--base http://localhost:3100`), npm test 555/555. Owner annotations
untouched (10 done preserved).
