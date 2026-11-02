# Composition Grammar — Human Summary (2026-10-30)

Machine-readable source: `packages/core/src/composition.ts` (`COMPOSITION_GRAMMAR`).
Tests: `packages/core/tests/composition.test.ts`. Selection details for agents:
`plugins/typodeck/skills/typodeck/composition.md`.

## Semantic types (13, each with ≥2 strategies)

Opening (statement, context, breath), problem (tension, narrative), insight
(punchline, unpacked), thesis (statement, grouped, sparse), comparison
(columns, stacked, rows), process (sequenced, compact), architecture (map,
layered), evidence (anchored, collated, focused), metric (hero, anchored),
quote (voice, attributed), tradeoff (balanced, decided), transition (breath,
bridge), conclusion (restatement, charge). 31 candidates total.

## Primitives (13, typography-native only)

Scale/weight contrast, alignment, column rhythm, baseline relations,
controlled asymmetry, negative space, typographic grouping, textual
repetition, number-led composition, editorial headline treatment, directional
reading flow, optical alignment. No cards, boxes, arrows, icons, or
illustrations exist in the grammar.

## Selection (deck-aware, deterministic)

Same-type + same-system pool → precondition filter (roles, title length, body
count, language, evidence ref) → scored on length/idea/evidence/language/
neighbor/repetition/system-signature fit → hard no-triple-repeat → fallback
(same-type same-system → cross-system → thesis-statement, repetition-aware).
`planCompositions` classifies deck-wide first so neighbors inform choices.

## Renderer integration (opt-in, schema-safe)

`layoutDeck(narrative, system, {compositionPlan})` applies per-candidate
rhythm scale, body measure cap (~60 chars, derived A01/A07), and body-align
overrides. Absent plan = byte-identical baseline (all prior tests green).
Title line caps are critic advisories, not layout enforcement (A05
no-autofit tension: the engine will not shrink display type to fit).

## System distinctness

Signature primitives (editorial controlled-asymmetry, swiss column-rhythm,
expressive scale-contrast) are scored (+5) and audited (≥30% advisory).
System-gated candidates keep grammars genuinely different (e.g. Swiss
comparison-columns vs editorial comparison-stacked); cross-system fallback is
logged in the plan rationale when it occurs.
