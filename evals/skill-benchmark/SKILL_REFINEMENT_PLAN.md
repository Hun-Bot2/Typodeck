# Skill Refinement Plan

Prioritized concrete changes to `skills/typodeck/`, each citing the
exact external source. Priority order follows the brief's Step 3.
"Implemented" flags mark what changed in this task; the rest are
planned with cost estimates. No design-quality improvement is
claimed without the side-by-side benchmark below.

## P0 — Do now (this task, docs + micro-code)

### R1. Explicit density policies (brief priority 4)

Map: gap items 6 + 10.
Source: `frontend-slides/SKILL.md` "Content Density Modes" + Phase 3
density application; `presentation-skill/SKILL.md` "Readable
defaults".
Change: add `density.md` — speaker-led vs reading-first policies,
preset/duration default mapping, type-floor checklist — and link it
from SKILL.md + composition.md. Record chosen policy in Slide IR
metadata (`densityPolicy?: 'speaker-led' | 'reading-first'`,
metadata-only, no geometry change). Implemented: YES (docs + IR
field + validation test).

### R2. Optional 3-system preview step (priorities 1, 2, 6)

Map: gap items 1 + 2 + 16.
Source: `frontend-slides/SKILL.md` Step 2.0 (3 previews, mix rules);
`presentation-skill` `present.py audition` ("optional, not an extra
step for every deck", freeze content, vary style).
Change: document the preview-before-export flow in
visual-systems.md — generate once over all systems, compare in the
gallery, export the chosen system; skip when a system is already
selected. Add antic-drift wording (approved Markdown never
re-planned). Implemented: YES (docs).

### R3. Preview authenticity rule + regression test (priority 5 support)

Map: gap item 3.
Source: `frontend-slides/SKILL.md` "Preview authenticity rules
(NON-NEGOTIABLE)"; `slide-wright/.../new-deck.md` Step 2 ("Keep all
process language off the slide").
Change: rule in visual-systems.md + test asserting benchmark HTML
contains no workflow tokens (`preview`, `Option A`, template slugs…).
Implemented: YES (docs + test).

### R4. Canonical adversarial inspection checklist (priority 5)

Map: gap items 21 + 25.
Source: `presentation-skill/.../visual_qa_prompt.md` ("Assume there
are problems", full defect list); `slide-wright/.../export-pptx.md`
"What to tell the user".
Change: typography-only adaptation of the checklist in revision.md
(drop shape/icon/figure items; add rag/widow/baseline/keep-all
items) + honest handoff block (HTML≠PPTX rendering, font
substitution, unmeasured items named). Implemented: YES (docs).

### R5. Honest-skip rule, Skill-wide (priority 5, 7)

Map: gap item 22.
Source: `slide-wright/.../new-deck.md` Step 4 ("If the script cannot
run, say the visual check was skipped");
`presentation-skill/SKILL.md` ("record the deferred render stage").
Change: one rule in SKILL.md §8 + revision.md: any QA layer that
cannot run must report `SKIPPED: <layer> (<reason>)`, never silent
green. Implemented: YES (docs).

### R6. Edit ladder + mandatory re-validate (priority 6)

Map: gap items 16 + 17.
Source: `presentation-skill/.../editing.md` ("Preserve First",
"Mandatory QA After Any Edit"); `slide-wright/SKILL.md` Editing.
Change: visual-systems.md edit ladder (Markdown rebuild → never
patch PPTX → re-validate + critic before delivery) + pinned-system
immutability line. Implemented: YES (docs).

### R7. Speaker notes reach PPTX (priority 6 completeness)

Map: gap item 18. Source: `slide-wright/.../new-deck.md` Step 4
(`<aside class="notes">`); `frontend-slides/SKILL.md` Phase 4
(notes preserved through conversion).
Change: `export.ts` writes IR `notes` to native PPTX speaker notes;
test asserts notes present and never on-slide. Implemented: YES.

### R8. Batched agentic intake, assumptions stated (priority 1 support)

Map: gap item 4. Source: `frontend-slides/SKILL.md` Phase 1 (ask
ALL questions together); `presentation-skill/SKILL.md` ("at most
three short questions… Otherwise state reasonable assumptions").
Change: SKILL.md workflow note for conversational driving: batch
missing inputs once (≤3), else proceed on stated assumptions.
Implemented: YES (docs).

## P1 — Next (planned, estimated)

### R9. Rendered-HTML QA script `check-html.mjs` (priority 5)

Map: gap items 19 + 20 + 31. Source: `slide-wright/scripts/
check-deck.mjs` (129 lines, defect classes + `--sheet` contact PNG
+ exit codes) + `export-pptx.md` dep pattern (`~/.cache`,727
override, Chrome-first).
Scope: headless-Chromium check over benchmark/Studio HTML previews
— outside-frame, clipped/scrolling, text overlap, size floor,
font-load failures — plus single-PNG contact sheet; environment-
gated tests (skip honestly without Chrome). Closes Typodeck's
largest known QA gap (font substitution, wrap, clipping
unmeasured). Cost: M. Not started.

### R10. Critic repair packets with source pointers (priority 5, 6)

Map: gap item 23. Source: `presentation-skill/SKILL.md`
(`repair_packet.json`: "affected source pointers, measured issues,
and image paths").
Scope: extend critic findings with `{slideId, markdownLine,
measuredIssue, previewPath}`. Cost: M. Not started.

### R11. Hash-bound review receipts (priority 8)

Map: gap item 24. Source: `presentation-skill/.../visual_qa_prompt.md`
(receipt "bound to the exact PPTX package hash and every rendered
slide hash, so a later rebuild cannot reuse a stale approval").
Scope: stamp `{pptxSha256, htmlSha256}` per decisions.json entry;
re-run marks STALE on hash change without clobbering human text.
Cost: S. Not started.

### R12. Registry growth contract: index → card → recipe (priority 3)

Map: gap item 7. Source: `frontend-slides` selection-index.json →
preview.md → design.md ladder.
Scope: when research candidates arrive, ship compact index +
per-system preview cards; full grammar docs load only for selected
systems. Cost: XS now (contract documented in R2), M at arrival.
Not started (blocked on research output by design).

### R13. `--preview-all` CLI flag (priority 2)

Map: gap item 1. Scope: one CLI run emitting 3 one-slide previews
(same narrative × 3 systems) for non-Studio users. Cost: S.
Not started.

## Explicitly not adopted

Per gap analysis REJECT items: mandatory approval gates,
per-deck invented themes, raster-background PPTX export, reveal.js
or SVG/shape engines, deploy/PDF sharing, entropy diversity gates
(premature at 3 systems). Reasons in SKILL_GAP_ANALYSIS.md.

## Benchmark — "Did the Skill actually get better?"

Adapted from `presentation-skill/.../benchmark_protocol.md`
(frozen manifest, external runs, blind review, failures in the
denominator, conjunctive superiority gate), re-scoped from
generator-ARM comparison to Skill-VERSION comparison (pre- vs
post-refinement), with Typodeck's identity constraints as hard gates.

### Design

- Arms (2): `skill-before` (git-stashed pre-refinement Skill docs +
  code) vs `skill-after` (this task's R1–R8). Generator runs happen
  OUTSIDE the harness; the harness ingests artifacts only.
- Frozen manifest: 6 prompts (2 pitch, 1 research, 1 architecture,
  1 KO-heavy, 1 mixed KO/EN) × 3 seeds = 18 cases × 2 arms = 36
  decks. Prompts are arm-neutral (no Skill-version identifiers);
  manifest SHA-256 frozen before any run.
- Same denominator: every case runs both arms with identical inputs
  (idea text, preset, system, seed). Failed runs stay in the
  denominator as typed failures (`timeout/no_artifact/tool_error/
  refused/invalid_artifact/other`); missing decks score 0 on
  affected dimensions — never silently omitted.
- Hard gates per deck (binary, evidenced): (1) layout — no severe
  overlap/clipping/off-canvas in rendered preview; (2) readability
  — R1 type floors met, contrast adequate; (3) placeholders — zero
  unresolved/template text; (4) editability — all text native
  editable, zero forbidden objects (existing `validatePptxBytes`);
  (5) reproducibility — rebuild from recorded inputs succeeds
  (byte-identical NOT required).

### Blinded review

- Packets show Option A/B per case (per-case shuffled, seed locked
  before review); reviewers get decks only — no manifest, gates,
  or key. Blinding attestation covers visible branding, notes,
  and package metadata.
- Dimensions (0–100, equally weighted): Content (task completion,
  evidence use, narrative quality), Aesthetics (composition,
  hierarchy, coherence, finish), Editability (practical PPTX
  revision). Complete score sheets required; `blinded:false`
  rejected.

### Claim gate (conjunctive — ALL must hold)

1. `skill-after` win rate > 0.60 (ties = 0.5).
2. Lower 95% paired-bootstrap CI bound on win rate > 0.55
   (unit = prompt+seed, 10k iterations, locked seed).
3. `skill-after` hard-gate pass rate ≥ 0.95.
4. Mean Editability within 0.05 below `skill-before` (noninferior).
5. Failure rate within 0.05 above `skill-before` (noninferior).

A pass is an internal benchmark result, not a release or quality
claim. Until human reviewers score packets, report only hard-gate
deltas + reviewer-pending status — exactly as Typodeck already does
for its 90-program A/B.

### Minimal viable first run (no new harness code)

1. Freeze 6 prompts + seeds in
   `evals/skill-benchmark/manifest.json` (write once, hash, never
   edit — bump `benchmark_id` instead).
2. Generate 36 decks via existing CLI (`--preset`, `--system`,
   `--seed`-equivalent config where supported; else preregistered
   config mapping per protocol).
3. Run existing validators (`validatePptxBytes`, critic, R3 token
   test) as hard gates 1–4; rebuild check as gate 5.
4. Assemble blind packets manually (Option A/B shuffle, locked
   seed recorded); score with `ballot-template.csv`-style sheets.
5. Compute win rate + bootstrap CI with a ~40-line script (only new
   code strictly required).

Full `deck_benchmark.py`-style harness (ingest/validate/packet/
analyze subcommands) is R14 if repeated Skill iterations justify it.
Cost: M. Not started.
