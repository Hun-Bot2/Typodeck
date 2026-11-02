# Typodeck Skill — Composition (read on demand)

Machine-readable source: `packages/core/src/composition.ts`
(`COMPOSITION_GRAMMAR`: preconditions, constraints, tokens, scoring,
exceptions, fallback, validation). Human summary: `docs/COMPOSITION_GRAMMAR.md`.

## Classify content

`classifySlide(slide, index, total)` → `{type, rationale, confidence}`.
13 semantic types: opening, problem, insight, thesis, comparison, process,
architecture, evidence, metric, quote, tradeoff, transition, conclusion.
Content signals (vs/before-after, quotes, step markers, trade-off language)
beat id-stem mapping; every decision carries a rationale + confidence.

## Choose a composition

`planCompositions(narrative, systemId)` classifies deck-wide, then
`selectComposition(ctx)` scores same-type, same-system candidates by:
semantic fit, content length, idea count (~4-chunk budget, B08), evidence
density, language (Korean 2-column penalty until keep-all lands), surrounding
slides, system signature, prior patterns. Repetition: −25 identical neighbor,
soft 40% budget, HARD no-triple-repeat when an alternate qualifies. Deterministic
tie-break (id hash). Fallback: same-type same-system → same-type any-system →
`thesis-statement`, repetition-aware.

## Justify emphasis

A Metric slide NEVER auto-becomes a centered number. `metric-hero` requires
meaningful (number role) + supported (caption ref) + relevant (thesis-tied);
otherwise `metric-anchored` (number subordinate to a title). Unsupported
numbers are flagged `unsupported-metric` by the critic, never heroed.
Read the plan rationale per slide before defending any layout.

## Balance consistency and variation

Systems stay distinct via signature primitives (editorial
controlled-asymmetry, swiss column-rhythm, expressive scale-contrast) plus
system-gated candidates. Art direction (`planArtDirection`) annotates
density/emphasis per slide and breaks 3+ dense runs by same-type re-selection
(one swap per run, no forced quotas). Opening/closing relationship is noted
(arc vs deliberate bookend). Repetition >50% and identity <30% are advisory
issues, not errors.

## Exceptions

Each candidate lists `exceptions` (when NOT to use it) — e.g. no
`comparison-columns` beyond 4 bodies, no `transition-breath` with body copy.
When no candidate meets preconditions, the plan records a `fallback` rationale
with score −1. Surface fallbacks in your report; they mark narrative shapes
the grammar handles weakly.
