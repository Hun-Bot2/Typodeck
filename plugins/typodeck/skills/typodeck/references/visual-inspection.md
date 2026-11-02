# Typodeck Skill — Visual Inspection via Critique Flags (read on demand)

Source: `packages/core/src/critic.ts` (`critiqueDeck`),
`packages/core/scripts/make-deck.ts`, `apps/web/app/api/export/route.ts`.

## Flags (all defaults OFF, advisory only — never block export)

- CLI `--critique`: critique the exported deck, append a receipt line,
  exit code unchanged:
  `critique: attempts=1 errors=E warnings=W checks=a,b,c`
  (`checks=-` when no findings).
- CLI `--revise[=N]` (default N=3): run the bounded `reviseDeck`
  loop, export the REVISED deck; receipt `attempts` = attempts used,
  counts/checks from the final report; `revise:` provenance lines
  precede the receipt.
- API `POST /api/export` body `critique?: boolean` (default false):
  runs `critiqueDeck`; report in `X-Typodeck-Critique-Errors`,
  `-Warnings`, `-Checks` headers plus the full JSON report base64url
  in `X-Typodeck-Critique-Report`.

## Reading a finding

Every finding carries `slideId`, `failureClass`
(`semantic|structural|typographic|perceptual`), `check`, `severity`
(`error|warning`), `detail`, `suggestedFix`, plus Stage-3 fields:

- `blockIds?`: positioned-block ids; absent = slide-level finding.
- `evidence?`: measured values, e.g. `title 18pt < body 24pt`.
- `confidence?`: `high|medium|low`; deterministic checks default `high`.
- `source?`: `deterministic` (Stage 3 emits only these);
  `model-inferred` is reserved — emitting it without a verified
  vision integration is a contract violation. Never fabricate it.

Fix errors before warnings; the repair loop fixes the FIRST error by
class per attempt (`references/repair-policy.md`).

## Stage-3 deterministic checks (all `warning`)

| check | confidence | required evidence |
|---|---|---|
| `hierarchy/primary-subordinate` | medium | both prominence values + block ids |
| `grouping/related-isolated` | medium | group id + separating geometry |
| `rendered/substitution` | high | requested vs used face per block |
| `rendered/unintended-wrap` | high | wrapped-lines signal per block |

Prominence proxy (frozen): `P = fontSize * (1 + (fontWeight - 400)
/ 400 * 0.25)`. `hierarchy/primary-subordinate` fires when
primary-emphasis block(s) exist AND the max-P block is non-primary
AND exceeds the max primary P by > 5%. Purely typographic
(size × weight); roles excluded. Absent probe signals (`fontUsed`,
`wrappedLines`) = skip silently, no finding.
