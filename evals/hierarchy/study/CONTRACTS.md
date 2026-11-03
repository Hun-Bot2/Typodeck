# Human Study frozen contracts (UI / DATA / QA)

> Wave-1 agents (UI + DATA) implement against this file in parallel.
> QA (wave 2) verifies. Exact names/shapes are frozen; visual styling and
> predicate details are implementation-owned. No agent touches another
> owner's files (§S5). No changes to `packages/core/src`, existing
> `evals/hierarchy/*` files, or other `apps/web` files. No git commands.

## S0 — Ground rules (all)

- Korean UI strings in §S4 are frozen verbatim (copy exactly).
- Expected answers / defect labels NEVER leave the server before finalize.
  Client-safe projection strips `origin`, `defectSeed`, `expected`.
- Reviewer sessions namespaced: ids starting `test-` persist under
  `annotations/test/` and are excluded from owner results.
- Determinism: case order from recorded seed; no wall-clock logic in
  evaluation (timestamps are metadata only).
- Default reviewer id: `owner`. Timestamps: `updatedAt` (ISO) only.

## S1 — Case model (DATA owns `study/cases.json`; server-side only)

```json
{
  "datasetVersion": "study-v1",
  "seed": 20261103,
  "order": ["S01", "S02"],
  "cases": [{
    "caseId": "S01",
    "fixtureId": "F01",
    "system": "swiss",
    "origin": "original|modified|known-good|known-defect|disputed",
    "defectSeed": null,
    "expected": {"note": "..."},
    "slide": {},
    "elements": [{"id": "F01-s1-b1", "role": "title", "label": "1 · title", "preview": "…60 chars…"}]
  }]
}
```

- 25–28 cases: 17 existing decks + controlled variants reusing Stage-4
  `defects.ts` seeds (headline, number-scale, grouping-swap, clip,
  contrast) + intentional-crop + dense-KO. No filler.
- Must include: ≥2 known-good, ≥1 known-defect per defect category,
  rest original/disputed. Coverage list from brief §4.
- `expected` shape is DATA-owned (nullable per field); UI never sees it.

## S2 — Annotation model (frozen)

```json
{
  "reviewerId": "owner", "datasetVersion": "study-v1", "seed": 20261103,
  "caseId": "S01",
  "firstFocus": "block-id|null",
  "ranking": [["b1"], ["b2", "b3"]],
  "groups": [["b1", "b2"]],
  "problems": [{"type": "none|clip|contrast|emphasis|grouping|reading-order|spacing|other", "blockIds": [], "comment": ""}],
  "confidence": 1,
  "interpretation": {"mainMessage": "block-id|null", "comment": ""},
  "status": "in-progress|done",
  "updatedAt": "iso"
}
```

- `ranking`: rank groups (inner arrays = ties). May be partial.
- Case `done` = firstFocus set + ranking non-empty + confidence set.
  Problems default to `[{type:"none",...}]` when untouched.
- Storage: `study/annotations/<reviewerId>.json` (live map);
  `test-*` → `study/annotations/test/`. Finalize writes
  `study/annotations/<reviewerId>.final.<UTC-timestamp>.json` (never
  overwritten; re-finalize creates a new timestamped snapshot).

## S3 — API (UI owns `apps/web/app/api/study/`)

- `GET /api/study/manifest?reviewer=ID` → `{reviewerId, datasetVersion,
  seed, order, total, cases:[{caseId, slide, system, elements}]}`.
  Client-safe projection enforced server-side.
- `GET /api/study/progress?reviewer=ID` → `{annotations:{caseId:ann}, done:n}`.
- `POST /api/study/annotate {reviewerId, caseId, patch}` → validates block
  ids against the case; `{ok:true, updatedAt}`.
- `POST /api/study/finalize {reviewerId}` → all cases `done` required;
  writes timestamped snapshot; `{snapshot}`.
- `GET /api/study/export?reviewerId=&format=json|csv` → download from
  latest snapshot (404 when none).
- `POST /api/study/run-eval {reviewerId}` → requires finalized snapshot;
  runs A/C vs human labels + repair eval (DATA runners, imported);
  writes `study/results/<reviewerId>.<timestamp>.json`; returns summary.
  B/D: capability probe only → `NOT RUN` + reason string.
- `GET /api/study/results?reviewerId=` → latest results JSON (404 before
  finalize/run). Only this endpoint may include `expected` data.

## S4 — UI (UI owns `apps/web/app/study/` + `components/study/`)

Reuse `SlideView` for live slide render (absolutely-positioned divs).
Click-to-select via `data-block-id` hit-testing + numbered badges; an
accessible numbered element list mirrors the same ids (fallback + keyboard).

Steps (frozen strings):
1. Welcome (Korean explanation) + button `평가 시작`.
2. `이 슬라이드를 처음 봤을 때 가장 먼저 눈에 들어온 요소는 무엇인가요?`
   Click element; highlight; never auto-select.
3. `어떤 요소가 가장 강조되어 보이나요? 중요해 보이는 순서대로 정렬해 주세요.`
   Drag-and-drop + keyboard reorder + tie toggle + element previews.
4. `서로 연결된 하나의 정보처럼 보이는 요소들을 선택해 주세요.`
   Multi-select grouping + one simple example. No semantic hints.
5. `시각적으로 어색하거나 이해하기 어려운 부분이 있나요?`
   Options: 문제 없음 / 텍스트 잘림·오버플로 / 대비 부족 / 혼란스러운
   강조 / 불명확한 그룹화 / 어려운 읽기 순서 / 열악한 간격·정렬 / 기타.
   Optional comment + affected-element click.
   Optional separate interpretation section AFTER visual judgment.
6. `이 판단에 얼마나 확신하나요?` 1–5 scale (confidence ≠ quality).
7. Progress `평가 N / M`, prev/next, revise, refresh-safe
   (localStorage draft + server save).
8. Completion: counts, missing, uncertain; buttons `응답 검토`,
   `결과 저장`, `결과 내보내기`. No model answers before finalize.
9. Dashboard (post-finalize, Korean): human vs A/C per case +
   aggregate, agreements/disagreements, repair before/after, arm
   statuses, untested hypotheses, visible uncertainty, no single score.

## S5 — File ownership (exclusive)

| Agent | Writes | Must not touch |
|---|---|---|
| UI | `apps/web/app/study/**`, `apps/web/app/api/study/**`, `apps/web/components/study/**` | other `apps/web`, `packages/`, `evals/` |
| DATA | `evals/hierarchy/study/**` except `annotations/` (runtime) | `apps/`, `packages/`, existing `evals/hierarchy/*` |
| QA (wave 2) | `evals/hierarchy/study/tests/**`, QA report | implementation files (report bugs, don't fix) |

DATA may import Stage-4 suite code (`../src/*`) — reuse, never duplicate.
UI imports `@typodeck/core` (built dist) + `SlideView` only.

## S6 — Acceptance

- UI: 8 steps render; click/rank/group/problems/confidence all editable;
  refresh-safe; export downloads; responses contain zero expected-label
  leakage; `test-` namespacing works; full scripted completion possible.
- DATA: manifest valid (25–28 cases, kinds balanced, seed recorded);
  runners execute A/C + repair + honest B/D-NOT-RUN; results schema has
  everything §S4.9 needs; README reproduces.
- QA: every check green or precisely reported; no fabricated labels.
