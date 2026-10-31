# Typodeck — Comms Audit & Before/After Rationale

Branch: `docs/comms-audit` (worktree `/tmp/typodeck-docs`). Docs files only;
no code touched. Reference conventions: problem-first openers, install above
the fold, one runnable example as the moment of conviction, measured proof,
and honest limitations (ripgrep/fzf-style) — structure only, no copied voice.

## Audit (before)

| Area | Before | Verdict |
|---|---|---|
| Tagline | None (`README.md` was `# Typodeck`, 10 bytes) | Missing |
| Short description | None | Missing |
| Getting started | None in README; commands existed only in `docs/*` + skill | Missing at the front door |
| Features | Listed in PRD/design docs, never summarized for visitors | Buried |
| Architecture | `docs/ARCHITECTURE.md` (good, internal tone) | Keep; surface a 6-line version in README |
| Contributing | No file | Missing |
| FAQ / limitations | Scattered (`PRD.md` §7, `MUSE_PROVIDER.md`, log caveats) | Unconsolidated; key honesty points invisible |

The deeper risk was hype drift: `PRD.md` opens "AI-powered", but
`docs/MUSE_PROVIDER.md` records that no live model endpoint was ever verified
and every run uses the labeled deterministic fallback. Any front-door copy
repeating "AI-powered" without that qualification would mislead.

## After (this branch)

| File | Change |
|---|---|
| `README.md` | Full rewrite: problem-led opener → real CLI transcript → quick start → how-it-works → comparison → measured guarantees → layout → config → limitations |
| `CONTRIBUTING.md` | New: docs to read, commands, 4 non-negotiable gates, conventions, PR checklist |
| `docs/FAQ.md` | New: 12 questions consolidating limitations, bounds, provider honesty, re-eval |
| `docs/LANDING_COPY.md` | New: hero/subhead/CTAs, proof bar, pillars, how-it-works, comparison, claims ledger, never-claim list |
| `docs/COMMS_RATIONALE.md` | This file |

## Messaging decisions

1. **Lead with the problem solved, not the tech.** "Every number traces to a
   source — as an editable `.pptx`, not a screenshot" names the two concrete
   pains (fabricated facts, uneditable output) before any pipeline detail.
2. **Differentiate on enforced mechanics, not adjectives.** The comparison
   table contrasts verifiable behaviors (refs on-slide, verbatim numbers,
   native text boxes, seeded layout) with the category default. No superlatives.
3. **Evidence-backed storytelling only where verified.** Each README guarantee
   cites `evals/summary.json` S1–S7 values; footnotes disclose what the metrics
   don't cover (S7 measured `planDeck` wall, not HTTP submit→preview; no
   separate clip detector; blocks-per-slide identical across systems).
4. **Provider honesty is a feature.** README + FAQ + landing copy all state:
   no live endpoint verified, fallback labeled, never presented as inference.
   This matches `MUSE_PROVIDER.md` and the CLI's own warnings.
5. **Scannable.** Tables over paragraphs; commands copy-pasteable; each section
   answers one question. Internal specs stay in `docs/` and are linked, not
   duplicated.

## Verification log (this session)

- `npm ci` in this worktree (`docs/comms-audit` @ `ff68b70`): OK (53 packages).
- `tsc -p packages/core/tsconfig.json` in this worktree: FAILS on two
  intentionally committed fragments (`slide-ir.ts` 29 lines, 5 errors;
  `visual-benchmark.ts` 5 lines, 1 error). Commit message confirms: "this
  snapshot does not build standalone." No code edited (docs-only constraint).
- Full quick-start verified in scratch worktree `/tmp/typodeck-docs-verify`
  @ `ad4c3db` (Node v26.8.1, npm 12.0.2):
  - `npm ci` OK; `npm run build -w @typodeck/core` OK
  - `npm test` (workspace core): **75/75 pass**, 0 fail
  - `npm run deck -- --idea-file idea-f4.txt --system swiss`:
    12 slides, 46 boxes, `validation: OK`
  - `npm run samples`: 7 slides / 24 boxes × 3 systems; bytes
    93975/93508/94078 (match the implementation log exactly)
  - `npm run eval -- --fixture F4 --lang en --direction swiss`: OK
    (slides=12, forbid=0, edit=1.000, over=0)
  - `npm run build -w @typodeck/web`: OK (routes `/`, `/api/generate`, `/api/export`)
- `npm run dev` serving was NOT re-verified here (sandbox blocks `listen()`);
  README cites the Phase 3 observed probes + this session's `next build`.
- Web search consulted for README structure conventions (problem-first hero,
  install above fold, runnable example, measured proof, honest limitations).

## Unresolved / follow-ups for the owner

1. Re-verify the README quick-start on the branch HEAD once the R1–R8 full
   context lands (fragments currently block a standalone build); then remove
   the repo-state note from README and the matching FAQ entry.
2. README links `evals/summary.json` relatively — confirm it renders for the
   intended host (GitHub blob vs. Pages).
3. No hero visual exists; conventions call for a screenshot/GIF above the fold.
   Proposed: Web Studio preview screenshot once the branch builds.
4. Font-embedding licenses still unverified (carried from the Phase 1 log) —
   flagged in README/FAQ as a pre-commercial-distribution check.
