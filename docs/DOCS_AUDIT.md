# Typodeck — Documentation Audit (2026-10-31)

Branch: `agent/e-docs`, baseline `b09865c`. Auditor: Agent E (docs only;
no code touched). Every classification below was checked against the
baseline tree, the built core, or an executed command — not inferred
from prose alone.

Method: read every maintained doc in full (root README, all of
`docs/`, `skills/typodeck/` read-only, `showcase/`, `gallery/README.md`,
`landing/USABILITY.md`, `evals/` reports, and
`research/slide-reconstruction/report.md` via
`git show 088e510:research/slide-reconstruction/report.md` without
checkout). Ran `npm ci`, core `tsc` build, `npm test`, `deck`,
`samples`, `eval -- --fixture F4`, `eval:report`, `EXAMPLES.sh`, and
the web production build. Reverted all eval side effects afterwards.

## Verdicts

- **current** — accurate against baseline code; keep as-is.
- **needs-revision** — substantively right but stale in named places;
  fixed or flagged below.
- **historical** — accurate record of a past phase; keep, do not update
  in place (dated notes added where it could mislead).
- **superseded** — replaced by newer material; keep for provenance,
  point readers forward.
- **duplicate** — overlaps another doc with no unique content; candidate
  for merge (none found — see table).
- **obsolete** — wrong with no archival value; candidate for removal
  (none found — see table).

## Audit table

| Doc | Verdict | Evidence / notes |
|---|---|---|
| `README.md` | needs-revision → **rewritten** | Guarantees table was stale: cited S2 `180/216 (83.3%)` and S7 `p95 1.8 s / max 4.7 s` from the Phase 4 run, but committed `evals/summary.json` says S2 `144/180 (80.0%)`, S7 `p95 204 ms / max 624 ms` (warm-mixed). Did not mention `/landing`, presets, or Slide Markdown. Rewritten from verified runs only. |
| `docs/ARCHITECTURE.md` | historical | Phase 0 spec: says "three directions", "Server Actions / route handlers", 8-module pipeline. Baseline has 4 systems (`document` experimental), 5 route handlers, ~20 modules. Accurate as a Phase 0 record; dated note added pointing to ADRs + core README. |
| `docs/PRD.md` | historical | Phase 0 spec: MVP checkboxes unchecked though implemented; "three design directions"; §7 says "no speaker notes" but notes now ship to native PPTX notes (verified: `slide-ir.ts` notes chain + notes-part test). Dated note added. |
| `docs/DESIGN_SYSTEM.md` | needs-revision | §3 "Three Systems" — baseline ships 4 with `document` experimental (`visual-systems.ts` statuses). Constraint text (§1/§2/§4/§5) verified current against `export.ts`/`validate.ts`. Header note added; body kept. |
| `docs/EVALUATION.md` | historical | Phase 0 spec: 3 directions × 24 runs. Committed matrix is still 3-system/24-run (matches), but the tree now has a 4th system and `eval.ts` documents its own threshold semantics (diversity thresholds live in the script header, not here). Dated note added. |
| `docs/FAQ.md` | needs-revision | 11 of 12 entries verified current. "`HEAD` doesn't build" entry describes `main@ff68b70` fragments and an `integrate/release-readiness` branch — on this baseline `tsc` is clean and 270/270 pass. Entry rewritten to the verified state. |
| `docs/MUSE_PROVIDER.md` | current | Matches `provider.ts`: env-gated, both vars required, fallback labeled. Verified by code read + fallback receipts in every run. |
| `docs/GITHUB_JOURNEY.md` | historical | Accurate record of `feat/github-presentation-journey` validation (numbers reproduced: `is` evidence `56 claims / 47 verified` re-observed via `EXAMPLES.sh` Ex2). Worktree path + port are branch-local. Dated note added. |
| `docs/COMMS_RATIONALE.md` | historical | Accurate record of `docs/comms-audit` branch work (75/75 era, `ff68b70` fragments). Counts predate the 270-test baseline. Keep as provenance; no in-place updates. |
| `docs/LANDING_COPY.md` | superseded (partial) | Written as "proposed copy for a future landing page" — the landing page now exists (`apps/web/app/landing`, route `/landing`, verified in prod build). Claims ledger + never-claim list still current and normative. Note added pointing at the live page. |
| `docs/COMPOSITION_GRAMMAR.md` | current | Matches `composition.ts` (13 types, 31 candidates, 13 primitives) and `composition.test.ts`. Spot-checked constants. |
| `docs/NARRATIVE_AUDIT.md` | historical | Phase A defect record + Phase B remediation log. All E/N items marked FIXED; final `24/24 OVERALL PASS` matches committed `summary.json`. Keep; do not edit findings. |
| `docs/TYPOGRAPHY_AUDIT.md` | historical | Phase A/C findings T1–T11 with rendered-confirmation notes. Keep; resolutions live in later code, not here. |
| `docs/TYPOGRAPHY_RESEARCH.md` | current | Source-grounded study (S1–S14, access levels, F-findings). Bibliographic content; nothing to re-verify per run. Still referenced by `skills/typodeck/research-index.md`. |
| `docs/IMPLEMENTATION_LOG.md` | current | Append-only phase log through the Journey entry. This pass appends a docs entry; no earlier entries edited. |
| `docs/engineering/decisions/ADR-*.md` | **missing on baseline → reconstructed** | Prior branch `docs/launch-readme@aecb800` added 10 ADRs, but they are NOT ancestors of baseline `b09865c` (verified: `merge-base --is-ancestor` fails; `ls-tree b09865c` shows no `docs/engineering/`). No baseline doc references them (grep clean). Reconstructed from baseline evidence as `ADR-0011..0019`, each marked RECONSTRUCTED. |
| `skills/typodeck/*.md` | current (read-only) | Counts spot-checked: SKILL.md says 248 tests at writing; baseline is 270 (skill is Agent B's to update). `EXAMPLES.sh` re-ran green (exit 0). Not edited (forbidden). |
| `showcase/README.md` + `manifest.md` | current (read-only) | Evidence package with pins, seeds, per-run provenance. §7 breakage note refers to `ff68b70`, not this baseline — accurate in context. Not edited (forbidden). |
| `gallery/README.md` | current (read-only) | Matches `gallery/` contents (`index.html`, `build-data.js`, `data.js`). Not edited (forbidden). |
| `landing/USABILITY.md` | current (read-only) | Landing verification report; consistent with `apps/web/app/landing/` contents. Not edited (forbidden). |
| `evals/90-program-report.md` | historical (read-only) | Provisional 73/100, PENDING study honestly stated. Not edited (forbidden). |
| `evals/benchmark-90/protocol.md` + `rubric.md` | current (read-only) | Human-study package, still PENDING. Not edited (forbidden). |
| `evals/skill-benchmark/*.md` | historical (read-only) | R1–R8 implemented per the log; R9–R14 planned. Not edited (forbidden). |
| `research/slide-reconstruction/report.md` (@`088e510`) | historical (read-only) | 12-slide benchmark report; Tier B 11 PASS/1 PARTIAL, probes honest about silent-clip gaps. Read via `git show`, no checkout. |
| `CONTRIBUTING.md` | needs-revision (not owned) | Root file outside Agent E ownership: `npm test` row omits the build step the script performs; byte-drift gate predates timestamp variance now documented in `showcase/manifest.md` §5.3. Flagged, not edited. |
| `packages/core/README.md` | **missing → created** | Package had no README. Created: module map, API surface, commands — all verified. |

No duplicates and no fully obsolete docs found: apparent overlaps
(e.g. `COMMS_RATIONALE.md` vs this audit, `LANDING_COPY.md` vs the live
page, `TYPOGRAPHY_RESEARCH.md` vs `research/typography/`) differ in
era, audience, or normative status, so each is kept with a pointer
instead of merged.

## Link check

Scanned all owned docs (`README.md`, `docs/*.md`) for Markdown links:
no broken internal links. One false positive: the regex
`` `a[i](x)` `` in `IMPLEMENTATION_LOG.md` (inline code, not a link).
No baseline doc references the missing `docs/engineering/` ADRs, so no
dangling ADR links exist to repair.

## Commands verified (this baseline, Node v26.8.1 / npm 12.0.2)

| Command | Result |
|---|---|
| `npm ci` | OK (53 packages) |
| `npm run build -w @typodeck/core` | `tsc` clean, exit 0 |
| `npm test` | 270/270 pass, 0 fail |
| `npm run --silent deck -- --idea-file packages/core/fixtures/idea-f4.txt --system swiss --out /tmp/e-deck-swiss.pptx` | `provider: fallback`, 21 claims, `quality: pass overall=100`, 10 slides / 40 boxes, `validation: OK` |
| `npm run --silent samples` | 4 systems × 7 slides / 24 boxes, all `validation OK` |
| `npm run --silent eval -- --fixture F4` | 8/8 OK (F4 × EN/KO × 4 systems, seed 42) |
| `npm run --silent eval:report` | aggregates; note: re-running evals first rewrites `evals/reports/` + `summary.json` (reverted) |
| `bash skills/typodeck/EXAMPLES.sh /tmp/e-examples` | exit 0 (Ex2 live: 56 claims, 47 verified — reproduces journey numbers) |
| `npm run build -w @typodeck/web` | production build OK; routes `/`, `/landing`, 5 APIs |

## Remaining doc debt (for the owner)

1. `apps/web/app/landing/data.ts` header comment says
   `MAX_CLAIMS_TOTAL=40`; code (`evidence.ts:35`) says `60`. Code is
   outside docs ownership — needs an owner fix.
2. `CONTRIBUTING.md` staleness (above) — needs its owner's pass.
3. `skills/typodeck/SKILL.md` test count (248 at writing vs 270 now) —
   Agent B's surface.
4. No 4-system eval matrix committed: `summary.json` is the 3-system /
   24-run matrix. A full 4-system re-run needs GitHub quota (F1–F3 are
   live) and is pending; the README states this explicitly.
5. `docs/launch-readme@aecb800` ADRs (10 files) will need a naming
   reconciliation with this pass's `ADR-0011..0019` at merge time —
   topics overlap but numbering differs; both derive from the same code.
