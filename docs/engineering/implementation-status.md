# Implementation status

Revision: `e610736`. Legend: ✅ integrated+verified · 🔶 integrated,
behavior code-read · 🧪 experimental · 🔬 research-only · ❌ missing/broken.

## Core pipeline — ✅

Ingestion, evidence grading, narrative (P01–P10 + legacy arcs), composition,
seeded layout, structural validation, addText-only PPTX export, fallback +
optional Muse provider. Evidence: 270/270 tests; live CLI runs (idea +
repo); `validatePptx` ok on fresh decks. Limits: fetch unauthenticated;
idea-mode claims ungrounded by design; no `--seed` flag.

## Visual systems — ✅ production ×3, 🧪 ×1

`editorial`, `swiss`, `expressive` production (`systems.ts`,
`visual-systems.ts` status registry); `document` experimental
(`implementation_notes.md`, preview-only candidates, 2 unrendered).
Related ADR: 0006.

## Studio + landing — ✅ (route: 🔶 for 3 of 5)

Studio UI, `/api/generate` (SSE + JSON, caps), `/api/export`
(server-side re-layout), landing page, a11y fixes F1–F6. Verified live:
`/` 200, `/api/generate` 200 + 5-slide narrative on production build.
`/api/{catalog,evidence,markdown}` code-read only. Limits: export route
live-probed only via build, not via HTTP POST in this pass.

## Skill — ✅ project skill

`skills/typodeck/` (SKILL.md + 8 guides + EXAMPLES.sh). Transcript exit 0
incl. live repo deck (56 claims/47 verified) and 8/8 eval re-run. Limits:
checkout-and-point only; no installer, marketplace, or registry listing.

## Research + review UIs — ✅ (🔬 for production use)

447-record registry (`validate.py` exit 0), provenance sidecar, gallery
(447 refs, 26 review items), PPT review app (115 files, 0–10 scores).
Research is not a production dependency (ADR-0010). Limits: gallery
absolute-path scrubbed this branch; 53 references unfilled by design.

## Evaluations — ✅ structural, human phase pending

Phase-4 matrix 24/24 PASS (S2 144/180 80.0%, S7 p95 204 ms);
benchmark-90 64/64 structural runs; visual-benchmark 30 outputs all gates
pass. No human ballots or verdicts exist anywhere — quality-preference
claims are unsupported. Showcase decks pinned with manifests; Deck 1
receipt figures stale (see known issues).

## Superseded / disconnected — ❌ on main, ✅ here

`main@ff68b70`: truncated `slide-ir.ts` / `visual-benchmark.ts` fragments
(tsc fails); 1-line README; no research/gallery/previews tracked. All
resolved on this branch. `stash@{0}` WIP superseded by `b09865c`; keep
for provenance, never apply.
