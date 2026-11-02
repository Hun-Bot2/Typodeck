# A3 Audit: Composition Registry + Planner + Scorer + Typography/Layout Engine

Scope: `packages/core/src/{composition,systems,layout,visual-systems,research-import,art-direction,critic,optical}.ts`,
callers in `packages/core/scripts/*`, `apps/web/app/api/*`, tests in `packages/core/tests/*`.
All claims below cite inspected file:line bodies. Paths abbreviated `src/…`, `tests/…` = `packages/core/…`.

## Verdicts (one per assigned question)

1. **Registry schema: PARTIAL.** `bestFor`/`avoidFor`/`density`/`formality`/`languages`/`constraints`
   exist on composition candidates; **`tone` and `contentRole` do NOT exist** anywhere in core.
2. **Planner: deterministic classify → gate → score → select.** Inputs, weights, and exposed
   reasons documented below; `audience`/`nextType` inputs are accepted but **unused by scoring**.
3. **Neighbor handling: variation is enforced, consistency is soft.** Anti-repeat penalties + hard
   no-triple rule + rhythm rebalancing; consistency = same-type pool + signature bonus only.
   Text-length constraints exist at four layers (precondition → score → layout fit → critic gate).
4. **Layout engine: deterministic, seeded, pure.** Header and body say so explicitly; test asserts
   byte-identical JSON. One seeded RNG use (expressive hero width), seeded per slide.
5. **Contrast/readability: enforced in 5 places**, strictest = `contrast.test.ts` (4.5:1 every block).
   Critic contrast finding is the only error-severity readability gate; the rest are warnings/scores.
6. **Lifecycle: experimental→production promotion is MANUAL — no code path promotes.**
   Importer can only emit `experimental` specs; registry resolves + pins versions; review scaffold
   tracks human PENDING/KEEP/REVISE decisions.
7. **Intent-aware surface:** extend `CandidateMeta` + `SelectionContext` + `scoreCandidate` in
   `src/composition.ts`, thread intent through `planCompositions` opts, and **wire the plan into
   the production pipeline** (today `planDeck`/API routes lay out with NO plan). Module + test
   list in §7.

---

## (1) Registry entry schema

Two registries exist; the composition-candidate registry is the selection surface.

### CompositionCandidate (src/composition.ts:87-108)

```ts
export interface CompositionCandidate {
  id: string;                                   // :88
  semanticTypes: SemanticSlideType[];           // :89
  systems: SystemId[];                          // :90
  primitives: CompositionPrimitive[];           // :91
  preconditions: CompositionPreconditions;      // :92
  constraints: CompositionConstraints;          // :93
  rationale: string;                            // :95
  exceptions: string[];                         // :97
  bestFor?: string[];                           // :99  PRESENT
  avoidFor?: string[];                          // :101 PRESENT (else defaults to `exceptions`)
  density?: CandidateDensity;                   // :103 PRESENT ('sparse'|'balanced'|'dense', :83)
  formality?: CandidateFormality;               // :105 PRESENT ('formal'|'neutral'|'expressive', :85)
  theme?: CandidateTheme;                       // :107
}
```

- `tone`: **ABSENT.** No `tone` field on `CompositionCandidate`, `CandidateMeta` (:116-121), or
  `CandidateIndexRow` (:630-638). The only `tone:` vocabulary in the repo is
  `frontend-slides/bold-template-pack/selection-index.json` (HTML template pack — a separate,
  non-core selection system).
- `contentRole`: **ABSENT.** Zero matches in core. The role vocabulary is `TextRole`
  (`kicker|title|body|number|caption`), consumed via `preconditions.requiresRoles` (:56).
- `languages`: **PRESENT but narrow** — `preconditions.languages?: Array<'ko'|'en'|'any'>` (:63-64),
  enforced at :829 (`!includes('any') && !includes(lang)` → reject). `lang` derives from
  `narrative.lang` ko-prefix at :957. No candidate currently sets it (all rely on default allow).
- `constraints`: **PRESENT** — `CompositionConstraints` (:69-80): `maxTitleLines` (default 2),
  `maxBodyCharsPerLine` (default 60), `bodyAlign?`, `columns` (1-4), `rhythmScale`.
- `preconditions` (:54-67): `requiresRoles?`, `maxTitleChars?` (50–140 across candidates),
  `maxBodyBlocks?`, `minBodyBlocks?`, `languages?`, `needsEvidenceRef?`.
- Backfill/derivation so every record carries metadata: `CANDIDATE_META_BACKFILL` (:372-409)
  merged at :411-414; `densityOfCandidate` (:610-615, columns/negative-space heuristic),
  `formalityOfCandidate` (:618-623, system heuristic), `avoidForOfCandidate` (:626-628, falls
  back to `exceptions`). `candidateIndex()` (:648-661) exposes
  `id/semanticTypes/systems/density/formality/bestFor/avoidFor` rows for agent shortlisting.
- Visual identity override: `CandidateTheme extends ThemeOverride` + `id` (:111-114);
  `THEME_DEFS` (:425-562), candidate→theme map (:564-601), attached at :603-607.

### VisualSystemEntry (src/visual-systems.ts:16-34) — NOT the selection surface

Fields: `id/version/status/philosophy/grammarRef/researchRefs/supports/limitations/supersededBy?`.
No tone/density/formality/contentRole. Answers WHICH systems exist; selection reads candidates.

## (2) Planner selection algorithm

### Stage 1 — classifySlide (src/composition.ts:720-790, "Pure + deterministic")

Content overrides beat id-stem mapping: comparison signal + ≥2 bodies (:727-731) → `comparison`;
quote marks/attribution (:733-736) → `quote`; ≥2 step markers + ≥2 bodies (:737-740) → `process`;
trade-off lexicon + ≥2 bodies (:741-744) → `tradeoff`; short bridging title mid-deck (:746-749) →
`transition`. Then stems: `cover`/index-0 → `opening` (:752-754); `closing`/last → `conclusion`
(:755-757); `number` → `metric` iff number-role present (high confidence only with caption ref,
:758-769); `proposal` → `tradeoff` (:770-772); `point` → `evidence` (:773-775); `DIM_TO_TYPE`
(:684-701, used :776-781); foreign stems fall back by shape (:782-789). Every branch returns
`{type, rationale, confidence}`.

### Stage 2 — planCompositions (src/composition.ts:954-977)

Classify ALL slides first, then select in deck order, threading `priorCandidates`.
Per-slide `SelectionContext` (:798-812) inputs: `classification, slide, index, total, lang,
systemId, prevType, nextType, priorCandidates, audience?`.

### Stage 3 — gate + score + select

- Hard gate `preconditionsMet` (:822-832): roles, title chars, body min/max, languages, evidence ref.
- `scoreCandidate` (:835-878, base 100): title>100 chars with 2-line cap −15 (:840);
  each body>300 chars −8 (:843); ≥3 bodies in 1-col −12 (:845); ≤1 body in ≥2-col −6 (:846);
  ref present on metric/evidence +6 (:849); number-role specialization +8 (:853);
  ko + 2-col −4 (:856); repeat of last −25, of 2-back −10 (:861-862); ≥40% same-candidate
  in decks ≥5 −20 (:863-865); system-signature primitive +5 (:866-872:
  editorial `controlled-asymmetry`, swiss `column-rhythm`, expressive `scale-contrast`,
  document `textual-repetition`); deterministic id-hash epsilon tie-break, "no RNG state"
  (:873-876).
- `selectComposition` (:911-947): filter pool by type+system+preconditions (:912-914); **hard
  rule: never a 3rd repeat in a row** when an alternate qualifies (:916-920); empty pool →
  `fallbackCandidate` with `score: -1` (:921-930); else best-wins (:931-936).
- **Selection reasons ARE exposed**: `CompositionPlanItem` (:814-820) carries
  `slideId/semanticType/candidateId/rationale/score`; rationale = classification rationale +
  same-type-neighbor note + `"chose <id> (<prims>) score=<n>"` (:937-939).
- `fallbackCandidate` (:880-908): same-type same-system first → same-type any-system →
  `thesis-statement`; repeat-aware. `validateCompositionPlan` (:980-992): plan length, known
  ids, no triple-repeat. Machine-readable bundle `COMPOSITION_GRAMMAR` (:998-1010).

### Dead inputs (gaps for intent work)

`ctx.audience`, `ctx.index`, `ctx.nextType` are **never read** by `scoreCandidate`;
`ctx.prevType` only appends a rationale string (:938) and does not change the score.
`PlanCompositionsOptions.audience` (:949-951) is threaded but unscored.

## (3) Neighbor variation vs consistency; text-length constraints

### Variation (enforced, three layers)

1. Scorer: −25 immediate repeat, −10 two-back, −20 over 40% budget (:861-865).
2. Hard filter: 3rd-in-a-row blocked when an alternate meets preconditions (:916-920);
   validation error otherwise (:987-989).
3. Deck-level `balanceRhythm` (src/art-direction.ts:61-102): breaks runs of 3+ dense slides by
   swapping the middle slide to a same-type/same-system `<2`-column alternate (precondition-checked);
   at most one swap per run. Soft advisories: >50% single-candidate issue (:130-134), ≥4 dense
   in a row issue (:135-143). Critic `compositionVariety = 1 − maxShare` (src/critic.ts:198-199).

### Consistency (soft only)

Same-type candidate pool + system-signature +5 (:866-872); art-direction signature-identity
advisory <30% (src/art-direction.ts:155-162); bookend/arc notes (:145-153). No forward-looking
constraint: `nextType` is computed (:970) but unused.

### Text-length constraints (four layers)

| Layer | Location | Rule |
|---|---|---|
| Precondition (hard reject) | composition.ts:54-67,822-832 | per-candidate `maxTitleChars` (50–140), `maxBodyBlocks`/`minBodyBlocks` |
| Score (soft) | composition.ts:840-846 | title>100 −15; body>300 −8 each; idea/column mismatch −12/−6 |
| Layout fit (mechanical) | layout.ts:216-233 `fitText`, :811 scales | shrink-to-min then 10-step size relaxation; `applyMeasureCap` :334-338 |
| Critic gate (advisory) | critic.ts:94-108 | title>2 lines, body>60 chars → warnings; `typographicFit` score :176-179,204 |

## (4) Typography/layout engine determinism

Explicit contract, quoted verbatim:

- src/layout.ts:1-3: `"Typodeck Typography Core — deterministic layout engine. Pure function:
  (narrative, system) -> positioned deck. Seeded/deterministic: identical input bytes ->
  byte-identical output."`
- src/layout.ts:876-879: `"Deterministic layout: (narrative, system) -> positioned deck.
  Pure function — no I/O, no wall-clock, no unseeded randomness."`
- src/composition.ts:719 (`classifySlide`) and :910 (`selectComposition`): `"Pure +
  deterministic."`; :873-876 tie-break `"stable, no RNG state"`.

Mechanics: seed = `opts.seed ?? layoutSeed(narrative, systemId)` where `layoutSeed` =
`hashString(systemId + JSON.stringify(narrative))` (layout.ts:872-874,883). Per-slide RNG
`mulberry32(hashString(seed:system:slide))` (:815) is consumed ONLY by `planExpressive`
hero-width variant (:460) — deterministic per slide id. FNV-1a `hashString` (:38-45) and
`mulberry32` (:48-57) are platform-stable integer math. Overflow relaxation iterates fixed
scales `[1 … 0.13]` and first-clean-wins (:811-858); `assertNoOverlaps` throws only on true
overlap (:274-282). Test: `tests/layout.test.ts:26-32` asserts byte-identical JSON across runs
for every system. Placement strategies are per-system and materially different: `planEditorial`
(:353-372), `planSwiss` 4-col grid (:375-444), `planExpressive` centered hero (:447-502),
`planDocument` hierarchy-stack (:510-546); G1 `planMonumentalNumeral` (:602-675) and G3
`planExplainerColumns` (:684-767) override placement when the plan selects those candidates
(:820-823). Composition plan only modulates rhythm/measure/align via `overridesFromPlan`
(:318-327); absent plan = baseline behavior exactly (layout.ts:861-870).

## (5) Contrast/readability enforcement locations

- **Token assignment**: `colorFor(system, role, background)` (src/systems.ts:171-185) incl.
  expressive-alt guard (yellow accent unreadable 1.28:1 on light alt → dark ink, :177-179);
  `backgroundFor` parity alternation (:187-191). Stamped per block in `materialize`
  (src/layout.ts:795). Candidate themes are "WCAG AA (verified by tests/theme.test.ts)"
  (src/composition.ts:418-419).
- **Critic (error severity)**: `contrastRatio` (src/critic.ts:60-65); per-block WCAG AA —
  large (≥18pt or ≥14pt bold) needs 3.0, else 4.5 — failure is `severity: 'error'`
  (src/critic.ts:125-134); `contrastAA` share score (:182-194,207). This is the only
  readability check that can fail `reviseDeck`'s error gate.
- **Strictest gate (tests)**: `tests/contrast.test.ts:21-34` requires **4.5:1 for every block**
  in every system (no large-text relaxation). `tests/theme.test.ts` force-renders each themed
  candidate and checks AA pairs.
- **Readability proxies (warnings/scores, never errors)**: title>2 lines, body>60 chars
  (critic.ts:94-108); `widowRisk` O4 (src/optical.ts:125-129) and `ragScore` O3 (:102-118)
  surfaced as critic warnings (:110-124); hierarchy title>body (:146-158);
  `typographicFit`/`opticalQuality` scores (:176-190,204-205). Overflow: estimate gate
  `estimatedOverflowBlock` (layout.ts:264-271) + relaxation loop; rendered-truth gate
  `critiqueRenderedOverflow` (critic.ts:408-444, error `overflow-visible`, explicit opt-in only).
- **Human-only**: `ReviewScores` readability/hierarchy/composition/… are `number|null`
  defaulting to null — "Aesthetic judgment stays human… never invents visual QA scores"
  (src/visual-review.ts:1-4,10-43).

## (6) Experimental vs production lifecycle mechanics

- Statuses: `SystemStatus = 'production'|'experimental'|'deprecated'` (src/visual-systems.ts:14).
  Production: editorial/swiss/expressive `1.0.0`; experimental: document `0.1.0` with provisional
  grammar limitation (:100-113). `listVisualSystems` defaults to production+experimental (:162-169).
- **No promotion code path exists.** Research importer "has no code path that creates or promotes
  production Visual Systems; every emitted spec carries status experimental"
  (src/research-import.ts:5-9); `CandidateSpec.status: 'experimental'` literal (:270-271,328).
  Promotion = hand-edit registry status/version + `src/systems.ts` tokens + candidates; no
  checklist/test enforces it (gap).
- Safety rails: `resolveVisualSystem` throws for registered entries without shipped typography
  (:137-143, tested tests/registry.test.ts:61-70); `resolveDeckSystem` pins `{system,systemVersion}`
  and throws on mismatch — "keep deprecated entries resolvable; do not delete them" (:147-159);
  `layoutDeck` stamps `meta.systemVersion` (:891). `supersededBy` marks successors (:32-33).
- Blast-radius control: document-only composition candidates (:331-361) leave production selection
  unchanged; G1/G3 planners trigger only on their candidate ids (layout.ts:820-823); optical
  tiers measurable-default/heuristic-opt-in/**experimental-never-applied** (src/optical.ts:164-194);
  `experimentalProposals` O5 records but never applies (:147-162).
- Human gate: `scaffoldDecisions` preserves prior decisions, adds new systems as PENDING, resets
  to PENDING on version change (src/visual-review.ts:57-91).
- Comparable evidence: `scripts/preview-experimental.ts` renders one fixed narrative in every
  renderable system to PPTX+HTML+manifest (:135-229); catalog API reports per-system
  `status/renderable` honestly (apps/web/app/api/catalog/route.ts:31-51).

## (7) Exact surface for adding intent-aware selection

### State of the world (verified wiring gap)

`SelectionContext.audience` / `PlanCompositionsOptions.audience` exist but are unscored (§2).
Upstream intent sources exist but are **unconnected** to selection: `parsePurpose`
(src/semantics.ts:594-611) → `resolvePurpose` (src/purposes.ts:379-388) → preset/audience;
`SlideIRSlide.emphasis?` ("Optional emphasis intent for the renderer", src/slide-ir.ts:36),
`SlideIR.preset`, `SlideIR.densityPolicy` (metadata-only). Critically, the **production path
never plans**: `planDeck` calls `layoutDeck(narrative, system, …)` with NO `compositionPlan`
(src/narrative.ts:879; same in `planDecksAll`), and `markdown`/`export` API routes likewise
(apps/web/app/api/markdown/route.ts:65, apps/web/app/api/export/route.ts:74).
`planCompositions` is exercised only by `scripts/preview-experimental.ts:171`,
`scripts/benchmark-90.ts:118-128`, and tests. Intent-aware selection has zero production effect
until the plan is threaded into `planDeck`/routes (following the preview-experimental pattern).

### Modules to change (ordered)

1. `src/composition.ts` — `CandidateMeta` (:116-121) + `CompositionCandidate` (:87-108): add
   `tone?`/`contentRole?`/intent tags; extend `CANDIDATE_META_BACKFILL` (:372-409) +
   `densityOfCandidate`-style derived helpers (:610-628) + `candidateIndex()` rows (:648-661).
2. `src/composition.ts` — `SelectionContext` (:798-812): add typed intent input (audience/purpose/
   tone/contentRole); `scoreCandidate` (:835-878): add intent-match term with documented weight;
   `selectComposition` (:911-947)/`planCompositions`+opts (:949-977): thread intent; update
   `COMPOSITION_GRAMMAR.scoring` docs (:1003-1007) and rationale strings (:937-939).
3. `src/art-direction.ts` — `balanceRhythm` (:61-102) same-type swap and `densityOf/emphasisOf`
   (:40-54) must preserve intent fit (currently intent-blind).
4. `src/critic.ts` — `reviseDeck` alternate search (:280-286) filters on type+system+roles only;
   must carry the intent filter or revision can undo intent-aware picks.
5. `src/layout.ts` — only if intent adds new geometric constraints: extend `overridesFromPlan`
   (:318-327) + `applyMeasureCap` pattern (:334-338); G1/G3-style dedicated planners (:602-767)
   only for new geometry families.
6. `src/narrative.ts` (`planDeck` :879, `planDecksAll` :966) + API routes (`generate`, `markdown`,
   `export`) — thread `compositionPlan` (with intent) into `layoutDeck`; this is the activation step.
7. Optional: `src/research-import.ts` `CandidateSpec` (:268-287) if imported specs should carry
   intent tags; `frontend-slides/.../selection-index.json` `tone`/`best_for`/`avoid_for`
   vocabulary reusable as a tag seed (different system — copy values, not code).

### Tests to add/extend

`tests/composition.test.ts` (gating/scoring/determinism inc. new-field coverage assert :29-39);
`tests/art-direction.test.ts` (rhythm revision preserves intent); `tests/grammar-g1g3.test.ts`
(if geometry planners touched); `tests/theme.test.ts` (if themed); `tests/critic.test.ts`
(`reviseDeck` keeps intent picks); `tests/registry.test.ts` + `tests/contrast.test.ts`
(strict 4.5:1 — any new theme/palette must pass); `tests/layout.test.ts` (determinism +
   no-overlap); `tests/pipeline.test.ts` / `tests/decks-all.test.ts` (end-to-end with plan
   threaded); `tests/import-research.test.ts` (if spec schema changes); `tests/eval.test.ts`
   (benchmark expectations).

## Files inspected (bodies read)

`src/composition.ts` (full, 1010 lines), `src/layout.ts` (full, 897), `src/systems.ts` (full),
`src/visual-systems.ts` (full), `src/research-import.ts` (full), `src/art-direction.ts` (full),
`src/critic.ts` (:1-500 + overflow gate), `src/optical.ts` (full), `src/quality.ts` (full),
`src/purposes.ts` (full), `src/visual-review.ts` (full), `src/index.ts`, `src/semantics.ts`
(:1-110, :580-640), `src/slide-ir.ts` (:25-60), `scripts/preview-experimental.ts` (full),
`scripts/benchmark-90.ts` (via grep :115-182), `src/narrative.ts` (:879 area via grep),
`apps/web/app/api/{catalog,generate,markdown,export}/route.ts` (catalog full; others via grep),
`tests/{composition,registry,contrast,layout,theme}.ts` (full or head), grep sweeps for
`tone|contentRole|intent|contrast|experimental|promot|planCompositions|reviseDeck` over
`packages/core` + `apps` + `frontend-slides`.
