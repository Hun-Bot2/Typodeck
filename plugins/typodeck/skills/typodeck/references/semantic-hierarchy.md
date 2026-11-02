# Typodeck Skill — Semantic Hierarchy Authoring (read on demand)

Source: `packages/core/src/slide-markdown.ts` (`intent:` key),
`packages/core/src/schema.ts` (`BlockIntent`).

`intent` declares a block's semantic role for selection and critique.
It is user/Skill-authored ONLY: the planner never emits it, layout
copies it verbatim onto `TextBlock` (no geometry effect in Stage 3).

## Exact grammar (C2)

An `intent:` line applies to the IMMEDIATELY PRECEDING block line
only. `intent:` after a singleton/meta/blank line or after another
`intent:` line throws. Value is space-separated tokens:

- `emphasis=primary|secondary|supporting`
- `group=<groupId>` — 1–64 chars, `[A-Za-z0-9_-]` only
- `relation=label-value|evidence|support`
- bare `crop` (= `deliberateCrop: true`, intentional-crop opt-in)

Empty value throws; unknown token throws; duplicate sub-key throws;
unknown keys inside `intent` are rejected by validation.

## Serialization

Emit `intent:` immediately after its block when present; canonical
token order `emphasis group relation crop`; omit absent parts.

## Example

```md
title: 94% Accuracy
intent: emphasis=primary group=g1
```

## Effects

- Selection: `scoreCandidate` adjusts intent-aware weights (documented
  constants); `rationale` cites intent when it changed the outcome
  (`; intent: ...` suffix).
- Critic: `hierarchy/primary-subordinate` and
  `grouping/related-isolated` read `emphasis`/`groupId`.
- Rendered overflow gate: `deliberateCrop: true` lists the block in
  `intentional[]` with no finding (third opt-in channel, explicit
  only — never inferred).
