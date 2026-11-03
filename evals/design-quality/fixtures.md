# Design-Quality Fixtures (eval copy contract)

The ONE shared content block every design renders in the design-quality
benchmark. Same words on every slide, in every design: judges score the
design, never the copy. Machine source of truth is
`evals/design-quality/fixtures.json`; this document is the human-readable
mirror plus the usage rules.

All copy below is **fixture, not fact**: realistic test sentences invented
for render benchmarking. No study, survey, or postmortem dataset stands
behind the numbers. Slides that present fixture data carry a source line
saying so.

## Slide B — evidence

One key message, one stat, one supporting line. Used verbatim by the
`evidence` specimen and by slide 4 of the benchmark deck.

- Key message: `Teams that required a second reviewer before merge contained failures earlier.`
- Stat: `63%` — `fewer sev-1 rollbacks`
- Supporting line: `Review depth predicted containment better than team size, tenure, or tooling.`
- Source line: `Fixture data · not a real study`

## Slide C — explanation

One comparison with two sides plus a shared caption. Used verbatim by the
`explanation` specimen and by slide 5 of the benchmark deck.

- Title: `Two teams, one deadline`
- Left side, `Rushed review`:
  - `Merged with a single skim approval`
  - `Config changes bundled into feature PRs`
  - `Rollback discovered by customers first`
- Right side, `Disciplined review`:
  - `Required a second reviewer on every merge`
  - `Config changes shipped in isolated PRs`
  - `Rollback caught in staging, never in production`
- Shared caption: `Same deadline, different discipline: one team paid at review time, the other in production.`

## Benchmark deck — 7 slides

The full-deck run renders all seven slide kinds in order. Cover copy follows
the diversity-harness PRIMARY convention verbatim
(`The Hidden Cost of Rushing to Ship` /
`What 11 postmortems taught us about review discipline` /
`Typodeck Research · November 2026`).

| # | Kind | Content beats |
|---|------|---------------|
| 1 | cover | PRIMARY title + subtitle + context; attribution only |
| 2 | divider | Section kicker `Part I — Evidence`; title `What the reviews actually caught`; orienting line `Three patterns, one discipline.`; no data |
| 3 | statement | Single sentence: `Rushing to ship moves failure downstream, where it costs more.`; optional source line; nothing else |
| 4 | evidence | Slide-B block verbatim (eyebrow `Finding 01` + message + stat + supporting + source line) |
| 5 | comparison | Slide-C block verbatim (eyebrow `The choice` + title + both sides + caption) |
| 6 | dense | Appendix table: 11 rows x 4 columns (`Case` / `Ship pressure` / `Missed check` / `Cost`), verbatim rows from `fixtures.json`; footnote `Fixture data · invented for density testing`; must fit 1920x1080 without scroll |
| 7 | closing | Closing line `Slow the review. Ship once.`; recap `Discipline upstream beats heroics downstream.`; context line; no new claims |

The dense slide is genuinely dense: eleven full data rows at real table
density, not a summary. It tests tabular discipline, not copywriting.

## Usage rules

- Same content in every design: copy fixtures.json strings verbatim.
  No paraphrase, no trimming, no extra adjectives.
- No invented extra claims on slides: if a sentence is not in
  fixtures.json, it does not appear — except eyebrows, kickers, page
  numbers, and the listed source/context lines.
- Fixture-not-fact marking: the `evidence`, `comparison`, and `dense`
  slides always carry their source/footnote line. Never present fixture
  numbers as research findings.
- Design freedom lives in layout, type, color, and ornament — never in
  the words.
