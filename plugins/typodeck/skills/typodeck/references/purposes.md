# Purpose Presets (P01–P10)

Purpose defines WHAT the deck communicates. It never hardcodes fonts,
palettes, or coordinates. The same narrative renders in any visual system.

Source of truth: `packages/core/src/purposes.ts` (all presets `version 1.0.0`).

## The 10 presets

| ID | Name (en / ko) | Audience |
|----|----------------|----------|
| P01 | Hackathon / Competition · 해커톤 / 경진대회 | Competition judges and live audience |
| P02 | Developer Portfolio · 개발자 포트폴리오 | Hiring managers and peer engineers |
| P03 | Resume / Career · 이력서 / 커리어 | Recruiters and hiring managers |
| P04 | Product Pitch · 제품 피치 | Investors and stakeholders |
| P05 | Research Presentation · 연구 발표 | Researchers and reviewers |
| P06 | Technical Architecture · 기술 아키텍처 | Staff engineers and architects |
| P07 | Business Review · 사업 리뷰 | Executives and operators |
| P08 | Educational Lecture · 교육 강의 | Learners at a stated level |
| P09 | Project Proposal · 프로젝트 제안 | Sponsors and approvers |
| P10 | Case Study · 케이스 스터디 | Practitioners and evaluators |

Each preset specifies: audience, goal, default arc, required/optional
evidence, semantic slide types, claim priorities, missing-evidence fallback,
integrity rules, short/standard/extended variants, EN+KO labels.

## Semantic model: 16 dimensions

- `DIMENSIONS` (frozen 8, legacy behavior): solution, results,
  differentiation, limitations, capabilities, architecture, problem, future.
- `NEW_DIMENSIONS` (preset-only 8): decisions, methodology, market, model,
  experience, objectives, context, lessons.
- `EXTENDED_DIMENSIONS` = all 16. Classifiers default to the legacy 8;
  presets opt into 16 via an explicit parameter.

Rule: add display labels or presets first; add a dimension only when a
preset's arc cannot be expressed without it. Never edit `DIMENSIONS`.

## Legacy mapping (backward compatible)

`resolvePurpose({purpose?, preset?})`:

- `--preset P01..P10` (or API `preset`) always wins when present.
- Otherwise the legacy `purpose` string maps through `LEGACY_PURPOSE_MAP`
  to a FROZEN arc — bit-identical to pre-preset behavior
  (see `packages/core/fixtures/legacy-narrative-baselines.json`, 36 cases).
- Legacy `showcase` is NOT P04. It keeps its own frozen arc; P04 is a
  stricter investor arc with traction-vs-assumption separation.

## Usage

CLI: `node packages/core/dist/scripts/make-deck.js --idea-file idea.txt
--preset P04 --system swiss --out out.pptx`

API: `POST /api/generate` accepts `preset` (P01–P10), `audience`,
`durationMin`, `emphasis`; response includes `slideMarkdown`.

Design retrieval is separate: the same preset id can guide Typo Pack
ranking (`--suggest --preset P05`), but it only supplies density,
formality, and base-system hints. It never selects a production system
and never changes the narrative arc.

## Integrity rules (all presets)

- Missing evidence → omit or reframe the slide; never invent content.
- No fabricated interviews, demand, traction, employment, awards, metrics.
- Proposals: proposed outcomes are never stated as achieved results.
- Research: preserve qualifications and uncertainty.
- Reviews: preserve metric definitions, periods, units.
