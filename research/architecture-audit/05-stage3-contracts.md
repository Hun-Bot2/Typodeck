# Stage-3 frozen contracts (B/C/D/E/G)

> Agreed interfaces BEFORE implementation. Implementers must match these
> exact type names, field names, check names, and flag names. Predicates
> marked IMPL-OWNED are implementation with tests + Lead review; everything
> else is frozen. No Stage-3 agent may change another owner's files (§C8).

## C0 — Ground rules (all agents)

- Same input bytes → same output bytes. No wall-clock, no unseeded randomness.
- No default-path behavior change: absent intent/flags = byte-identical output.
- Additive only: extend interfaces with optional fields; never rename/remove.
- New tests go in NEW test files only. Never edit existing test files.
- No `git` commands of any kind.

## C1 — BlockIntent (frozen TypeScript, B implements verbatim)

```ts
// schema.ts
export type EmphasisLevel = 'primary' | 'secondary' | 'supporting';
export type BlockRelation = 'label-value' | 'evidence' | 'support';
export interface BlockIntent {
  emphasis?: EmphasisLevel;
  groupId?: string;              // 1–64 chars, [A-Za-z0-9_-]
  relation?: BlockRelation;
  deliberateCrop?: boolean;      // explicit intentional-crop opt-in (ADR-0022)
}
export interface NarrativeBlock {
  role: TextRole;
  content: string;
  intent?: BlockIntent;          // NEW optional field
}
export interface TextBlock {
  /* ...existing fields unchanged... */
  intent?: BlockIntent;          // NEW: layout copies it from NarrativeBlock
}
```

Validation (strict): enum values exact; `groupId` pattern/length enforced;
`deliberateCrop` must be boolean; unknown keys inside `intent` rejected.
`validateNarrative`, `validateSlideIR`, `validateDeck` all enforce this.
`narrativeToSlideIR` / `slideIRToNarrative` preserve `intent` (NOT dropped).
`layoutSlide` copies `intent` verbatim onto `TextBlock` (passthrough only —
no geometry effect in Stage 3).
Planner (`claimSlide`/`numberSlide`) MUST NOT emit `intent` in Stage 3
(user/Skill-authored only; legacy bit-identical gate stays green).

## C2 — Markdown `intent:` key (frozen grammar, B implements)

- An `intent:` line applies to the IMMEDIATELY PRECEDING block line only.
  `intent:` elsewhere (after singleton/meta/blank/another `intent:`) → throw.
- Value: space-separated tokens; empty value → throw; unknown token → throw;
  duplicate sub-key → throw. Tokens:
  - `emphasis=primary|secondary|supporting`
  - `group=<groupId>` (same pattern/length rule as C1)
  - `relation=label-value|evidence|support`
  - bare `crop` (= `deliberateCrop: true`)
- Serialization: emit `intent:` immediately after its block when present;
  canonical token order `emphasis group relation crop`; omit absent parts.
- Example: `title: 94% Accuracy` + `intent: emphasis=primary group=g1`.

## C3 — CriticFinding extension (frozen, D implements)

```ts
export interface CriticFinding {
  slideId: string; failureClass: FailureClass; check: string;
  severity: 'error' | 'warning'; detail: string; suggestedFix: string;
  blockIds?: string[];                          // NEW: positioned-block ids; absent = slide-level
  evidence?: string;                            // NEW: measured values, e.g. "title 18pt < body 24pt"
  confidence?: 'high' | 'medium' | 'low';       // NEW: default 'high' for deterministic
  source?: 'deterministic' | 'model-inferred';  // NEW: default 'deterministic'
}
```

Stage 3 emits `deterministic` findings only. `model-inferred` is reserved;
emitting it without a verified vision integration is a contract violation.

## C4 — New deterministic checks (names/severity frozen; predicates IMPL-OWNED)

| check | severity | confidence | required evidence |
|---|---|---|---|
| `hierarchy/primary-subordinate` | warning | medium | both prominence values + block ids |
| `grouping/related-isolated` | warning | medium | group id + separating geometry |
| `rendered/substitution` | warning | high | requested vs used face per block |
| `rendered/unintended-wrap` | warning | high | wrapped-lines signal per block |

Prominence proxy (frozen formula): `P = fontSize * (1 + (fontWeight - 400) / 400 * 0.25)`.
`hierarchy/primary-subordinate` fires when primary-emphasis block(s) exist on
the slide AND the max-P block is non-primary AND exceeds the max primary P by
> 5%. Purely typographic (size × weight); roles excluded from the formula.
Grouping/render predicates are IMPL-OWNED (D proposes exact predicate + tests;
Lead reviews). Absent probe signals = skip silently (no finding).

## C5 — Rendered probe extension (frozen field names, D implements)

```ts
export interface RenderedBlockMeasurement {
  /* ...existing 7 fields unchanged... */
  fontUsed?: string;      // NEW: resolved rendered face; absent = unmeasured
  wrappedLines?: number;  // NEW: rendered line count; absent = unmeasured
}
```

`critiqueRenderedOverflow` honors a third explicit opt-in channel:
`TextBlock.intent?.deliberateCrop === true` → listed in `intentional[]`, no
finding. Existing `intentional[]` allowlist + provisional `allowOverflow`
stay unchanged.

## C6 — Planner selection (C implements; signatures FROZEN)

- `selectComposition`, `scoreCandidate`, `planCompositions`,
  `SelectionContext`, `CompositionPlanItem`: NO signature changes. Intent
  flows via `SelectionContext.slide.blocks[].intent` (already passed).
- `scoreCandidate` adds intent-aware adjustments (IMPL-OWNED weights, must be
  documented constants + tests). `rationale` MUST cite intent when it changed
  the outcome (`; intent: ...` suffix convention).
- Registry records, `candidateIndex()`, `tone`/`contentRole`: UNTOUCHED in
  Stage 3 (deferred pending Stage-4 evidence).
- `reviseDeck`: signature frozen; alternate search keeps order but MUST skip
  alternates that already failed the SAME check on the SAME slide in this run
  (no ping-pong); rationale gains `; intent-aware` when intent influenced the
  choice. Budget unchanged (maxAttempts 3, seed 42, first-error fix).

## C7 — Production wiring flags (E implements; defaults OFF)

- CLI `make-deck`: `--critique` (critique only, append report to receipt, exit
  code unchanged) and `--revise[=N]` (default N=3; `reviseDeck` loop, export
  revised deck). Receipt gains optional
  `critique?: { attempts: number; errors: number; warnings: number; checks: string[] }`.
- `POST /api/export` body gains optional `critique?: boolean` (default
  false): runs `critiqueDeck`, includes the report in the response, never
  blocks export (advisory in Stage 3).
- Skill target is `plugins/typodeck/skills/typodeck/` ONLY (`skills/typodeck/`
  does not exist). E adds `references/semantic-hierarchy.md` (C2 authoring),
  `references/visual-inspection.md` (flags + finding reading),
  `references/repair-policy.md` (bounded-loop rules); minimal `SKILL.md`
  workflow update (stay concise); extend or add an example wiring
  `--revise`. No engine code in the Skill. Studio Proof tab stays TODO.

## C8 — File ownership (exclusive; violations fail review)

| Agent | Owns (write) | Must not touch |
|---|---|---|
| B (IR/schema) | `schema.ts`, `slide-ir.ts`, `slide-markdown.ts`, intent passthrough in `layout.ts` ONLY, NEW tests `tests/intent-*.test.ts` | narrative.ts, composition.ts, critic.ts, existing tests |
| C (planner) | `composition.ts` selection region (score/select/rationale), NEW tests `tests/intent-selection.test.ts` | registry records, schema.ts, critic.ts, existing tests |
| D (critic/probe) | `critic.ts` (findings, checks, probe, opt-in, revise tweak), NEW tests `tests/hierarchy-critic.test.ts` | schema.ts, composition.ts, layout.ts, existing tests |
| E (skill/CLI/API) | `plugins/typodeck/skills/typodeck/**`, `scripts/make-deck.ts` flags, `apps/web/app/api/export/route.ts` param | core engine files, existing tests |
| G (integration) | verification only + NEW regression tests; minimal mismatch fixes listed in report | silent cross-file edits |

## C9 — Acceptance per agent + integration gate

- B: strict validation tests (enums, groupId pattern, unknown-key rejection,
  duplicate/placement errors); round-trip preservation test (intent survives
  Narrative→IR→Narrative and Markdown→IR→Markdown byte-stable); legacy
  baselines byte-identical; full suite green.
- C: weight tests (intent changes outcome only when expected); rationale
  citation tests; determinism test (same bytes → same plan); suite green.
- D: per-check unit tests (fire + no-fire + evidence strings); probe
  absent-signal tests; opt-in tests (all 3 channels); revise no-ping-pong
  test; suite green.
- E: flag tests (receipt shape, defaults off); API param test; Skill docs
  accurate against C2/C7 (Lead verifies by reading).
- G: `npm test` 355/355 (or more) green; `tsc` clean; default-path byte-diff
  (regenerate showcase/benchmark fixtures, diff empty); contract-conformance
  checklist (exact names C1–C7); report lists every fix or none.
