# Typodeck Skill — Evidence Extraction + Claim Verification (read on demand)

Source: `packages/core/src/evidence.ts` (`extractClaims`,
`rephraseClaims`), `packages/core/src/semantics.ts`
(`displayStatus`), `packages/core/src/narrative.ts` (`formatRef`,
`captionFor`).

## Extraction (deterministic)

`extractClaims(ingested)` caps output at 24 claims/file and 60 total
(`MAX_CLAIMS_PER_FILE`, `MAX_CLAIMS_TOTAL`); claim text is capped at
280 chars (`MAX_CLAIM_CHARS`). Each `Claim` carries
`{id, text, kind, refs, numbers}` where `numbers` holds every numeric
token copied verbatim from the source.

- Repo mode: claims start as `suggestion` (README/docs) and upgrade
  to `verified` only on code confirmation.
- Idea mode (including local analysis): claims are `ungrounded`.

## Verification rules (non-negotiable)

- Numbers verbatim with refs; reframed numbers keep only tokens
  still verbatim in the source (`applyEvidenceSelection`).
- Versions, years, and hashes are never heroes and never bare:
  `formatRef` renders `path:lines` pointers; `captionFor` attaches
  the lifecycle tag (`implemented` | `proposed` | `historical` |
  `deprecated` | `unverified`) from the single source of truth
  `displayStatus`.
- Deprecated claims never headline; proposals are never stated as
  achieved results (`references/purposes.md` integrity rules).
- `rephraseClaims` needs a real `ModelProvider`; without one the
  fallback path keeps extraction text as-is and says so.

## What to show the user

Per claim: id, kind, lifecycle tag, text, numbers, refs. Studio
exposes this read-only via `POST /api/evidence`
(`{mode, input}` → claims + pointers); the inspector's
`EvidenceSelection` is strictly validated before generation
(`references/engine.md`). The offline equivalent is
`examples/04-evidence-report.mjs`.
