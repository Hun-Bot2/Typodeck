# A2 Audit: Slide IR + Slide Markdown + Narrative Planner

Scope: `packages/core/src/{slide-ir,slide-markdown,schema,narrative,purposes,semantics,composition,layout}.ts`
plus valves (`/api/markdown`, `/api/generate`), validators, and tests. Every claim below cites a file:line read in this session.

## (1) Content importance / emphasis — VERDICT: three homonyms, no per-block importance

Three different things share the name "emphasis"; none is per-block content importance:

1. `SlideIRSlide.emphasis?: string` — free-text renderer hint. `packages/core/src/slide-ir.ts:36-37`:
   `/** Optional emphasis intent for the renderer (plain text, never executed). */ emphasis?: string;`
   Slide-level only, untyped string, no per-block counterpart. `NarrativeBlock` is exactly
   `{ role: TextRole; content: string }` (`packages/core/src/schema.ts:82-85`) — no importance field.
   Positioned `TextBlock` (`packages/core/src/schema.ts:25-48`) likewise has no importance/emphasis field.
2. `PlanNarrativeOptions.emphasis?: Dimension[]` (`packages/core/src/narrative.ts:61`) — planner *input*:
   dimension ids pinned into short variants and tie-breaks (`packages/core/src/narrative.ts:457-468,497-499,644-647`).
   Never persisted onto any slide/block; `/api/generate` validates it as dimension ids
   (`apps/web/app/api/generate/route.ts:170-176`).
3. `ArtDirectionSlide.emphasis: 'hero' | 'statement' | 'support'` (`packages/core/src/art-direction.ts:22,29,48-54`) —
   derived post-hoc from (semanticType, candidate primitives); advisory, not stored intent.

ADR-0016 emphasis-drop claim: **TRUE**, and stronger than stated. `slideIRToNarrative`
(`packages/core/src/slide-ir.ts:129-141`) keeps only `{title, lang, slides[{id, thesis, blocks, notes}]}` and drops
`type`, `refs`, `statuses`, `emphasis`, `preset`, `densityPolicy`. Additionally `narrativeToSlideIR`
(`packages/core/src/slide-ir.ts:85-123`) never *populates* `emphasis` (no assignment; only `notes` passes through
at `:112`), so the field is settable only via hand-edited Markdown. Pinned by test
`packages/core/tests/slide-ir.test.ts:61-72` ("round-trips narrative content exactly (emphasis dropped, notes preserved)").
ADR text: `docs/engineering/decisions/ADR-0016-slide-markdown-ir.md:27-28`.

Related gap: `densityPolicy?: 'speaker-led' | 'reading-first'` (`packages/core/src/slide-ir.ts:42-52`) is IR-only
metadata that Slide Markdown silently drops — `serializeSlideMarkdown` (`packages/core/src/slide-markdown.ts:24-37`)
never writes it and the parser accepts only `lang`/`preset` meta (`packages/core/src/slide-markdown.ts:97-113`).
Precedent for "IR-only optional field", but lossy through the Markdown round-trip.

## (2) Explicit semantic relationships — VERDICT: none; all relations are implicit or recovered

No element carries explicit relationships:

- Blocks have no ids and no link fields (`packages/core/src/schema.ts:82-85`). No label-value pairing, no
  grouping ids, no sequence pointers, no citation pointers. Order = array order (implicit sequence only).
- Support relation is positional convention: `claimSlide` appends `support.text` as `body` after title
  (`packages/core/src/narrative.ts:179-195`), same in `numberSlide` (`:197-215`). Downstream cannot distinguish
  support-body from claim-body.
- Evidence linkage is *recovered by fuzzy text matching*, not stored ids: `linksBlockToClaim`
  (`packages/core/src/slide-ir.ts:59-71`) requires normalized exact match, or a `…`-suffixed title prefix
  ≥40 chars; blocks/claims <20 chars never link. `refs: string[]` are opaque `path:line` strings
  (`packages/core/src/slide-ir.ts:32-33`, formatted by `formatRef` at `packages/core/src/narrative.ts:99-103`);
  `statuses: ClaimStatus[]` is a parallel array (`packages/core/src/slide-ir.ts:34-35`).
- Citation detection downstream re-parses caption *text*: `captionHasRef` regex `/[:/]/`
  (`packages/core/src/composition.ts:715-717`), status tags via `CAPTION_STATUS_TAGS`
  (`packages/core/src/semantics.ts:77-80`). Captions are composed by `captionFor`
  (`packages/core/src/narrative.ts:114-124`).
- Slide `type` is *assigned by classifier*, not planner intent: `classifySlide`
  (`packages/core/src/composition.ts:720-790`) uses content-signal overrides first (`:727-749`), then id-stem
  mapping (`:752-781`) via `DIM_TO_TYPE` (`:684-701`). Stems (`n<N>-<dim>`, `point`, `proposal`, `number`,
  `cover`, `closing`) are planner naming conventions (`packages/core/src/narrative.ts:259-262,504-507`), not a
  typed field — foreign stems fall back to shape inference (`packages/core/src/composition.ts:782-789`).

## (3) IR version + migration; stored-deck pinning — VERDICT: exact-match gates, zero migration machinery

- `SLIDE_IR_VERSION = '1.0.0'` (`packages/core/src/slide-ir.ts:21`); `validateSlideIR` throws on any other value
  (`packages/core/src/slide-ir.ts:151`). No `migrate*`/`upgrade*` function exists for IR (repo-wide grep finds only
  cue-word matches in `packages/core/src/semantics.ts:359,415`). A version bump is therefore a hard break for old
  payloads, consistent with ADR-0016 "bumped with migration care, not silently extended"
  (`docs/engineering/decisions/ADR-0016-slide-markdown-ir.md:34-36`) — but the "care" has no harness.
- Slide Markdown: `SLIDE_MARKDOWN_VERSION = 1`, header `#!slide-markdown 1` (`packages/core/src/slide-markdown.ts:12-13`);
  first line must match exactly (`:71-73`). Strict parser: unknown meta/field keys, dup singletons/ids, malformed
  lines all throw (`:97-153`); strictness table pinned in `packages/core/tests/slide-markdown.test.ts:43-72`.
- `Narrative` and `Deck` have **no version field at all** (`packages/core/src/schema.ts:76-99`).
- Stored-deck pinning is `{system, systemVersion}`: optional `DeckMeta.systemVersion`
  (`packages/core/src/schema.ts:64-65`, "absent on pre-registry decks (= latest)"); `layoutDeck` stamps
  `VISUAL_SYSTEMS[system.id]?.version` (`packages/core/src/layout.ts:887-894`); `resolveDeckSystem` throws on
  version mismatch (`packages/core/src/visual-systems.ts:146-159`). ADR statement at
  `docs/engineering/decisions/ADR-0016-slide-markdown-ir.md:23-25` ("re-render, never silently substitute").
  Caveat: `resolveDeckSystem` has **no production caller** in `apps/` or `packages/*/src` — only
  `packages/core/tests/registry.test.ts:72-77,99` and `packages/core/scripts/visual-benchmark.ts:75,147,161`.
  Pinning is written but never enforced on a read path outside tests/scripts.

## (4) Planner outputs; what reaches layout — VERDICT: Narrative only; IR metadata never reaches layout

Planner output (`planNarrative`, `packages/core/src/narrative.ts:672-675`): a `Narrative`
(`packages/core/src/schema.ts:95-99`) = `{title, lang, slides[{id, thesis, blocks[{role, content}], notes?}]}`.
`planNarrativeWithQuality` additionally returns a `QualityReport` (`packages/core/src/narrative.ts:224-233`;
`evaluateNarrative` at `packages/core/src/quality.ts:104`). There is no separate outline artifact: arc/step
membership survives only implicitly via id stems, kicker labels, and caption text. Legacy path
(`planLegacyNarrative`, `:240-439`, 5–12 slides, proposal-filler padding at `:387-405`) vs preset path
(`planPresetNarrative`, `:446-670`, steps omitted when unsupported, no filler at `:631-632`).

What reaches layout: `layoutDeck(input: unknown, …)` re-validates via `validateNarrative`
(`packages/core/src/layout.ts:880-881`), so it consumes **only** Narrative fields. Consequences:

- IR `type`/`refs`/`statuses`/`emphasis`/`preset`/`densityPolicy` never reach layout — `slideIRToNarrative`
  drops them (`packages/core/src/slide-ir.ts:129-141`). Layout re-derives semantics from Narrative text via the
  optional `compositionPlan` (`packages/core/src/layout.ts:861-870,884`), built by `planCompositions` from the
  Narrative (`packages/core/src/composition.ts:954-977`), applying only rhythm/measure/align overrides plus
  candidate geometry/theme (`packages/core/src/layout.ts:318-325,802-837`). Test-pinned content-invariance:
  `packages/core/tests/slide-ir.test.ts:119-127`.
- `thesis` is copied to the output `Slide` but never used for geometry (single use at
  `packages/core/src/layout.ts:852`).
- The main pipeline **bypasses IR entirely**: `planDeck` = ingestion → evidence → narrative → layout
  (`packages/core/src/narrative.ts:903-931`). IR/Markdown sit only on the edit path:
  `POST /api/markdown` does `slideIRToNarrative(parseSlideMarkdown(md))` → `layoutDeck` per system
  (`apps/web/app/api/markdown/route.ts:45,65`).
- `notes` flow end-to-end: narrative → IR → narrative → layout (`packages/core/src/layout.ts:855`) → native PPTX
  notes (`packages/core/src/export.ts:77-80`); never rendered on slides.

## (5) Purpose presets P01–P10 + frozen arcs — VERDICT: as documented; mechanics verified

- `PRESETS` record (`packages/core/src/purposes.ts:95-351`): 10 presets, each `version: '1.0.0'`, with `steps[]`,
  `coverDims`/`closeDims` pick priorities, `integrity`, shared `variants`, `langNotes`. `PRESET_IDS`
  (`:353-355`); `getPreset` case-insensitive (`:357-361`).
- `PresetStep` (`:31-42`): `{id, dim (16-dim set), label{en,ko}, optional?, allowStatuses?}`.
- `PresetIntegrity` (`:44-60`): `groundedOnlyDims?` (drops ungrounded claims in repo mode, enforced in
  `allowed()` at `packages/core/src/narrative.ts:485-495`), `numberKinds?` (e.g. P03 `:165`, P07 `:268`),
  `rules[{text, enforced}]` where `enforced:false` = documented convention only (e.g. P01 `:117`, P02 `:141`).
  Hardest gate: P09 outcomes admit only `proposed`/`unverified` (`packages/core/src/purposes.ts:313-315`).
- Variants: shared `VARIANTS` (`:85-89`) — short `{maxSlides 6, encore false, requiredOnly true}`,
  standard `{12, encore}`, extended `{15, encore}`. `variantForDuration` (`:391-397`): explicit wins;
  ≤5min short, ≤15 standard, else extended.
- Preset planning mechanics (`planPresetNarrative`, `packages/core/src/narrative.ts:446-670`): short variant keeps
  required-first + emphasized optionals, slices to `maxSlides-2`, restores arc order (`:463-473`); number slides
  honor `numberKinds` (`:515-556`); cover from `presetKicker` + strongest cover-dim claim (`:558-588`); thesis pass
  per step with support pick (`:592-623`); encore while `< min(10, maxSlides)` (`:625-629`); closing restatement by
  `closeDims` (`:634-665`).
- Frozen arcs verified: `ARC` 4 audiences marked FROZEN (`packages/core/src/semantics.ts:83-93`);
  `LEGACY_PURPOSE_MAP` (`packages/core/src/purposes.ts:368-373`, "showcase … NEVER to a purpose preset");
  `resolvePurpose` keeps legacy/preset disjoint (`:379-388`, `parsePurpose` at
  `packages/core/src/semantics.ts:594-611`); `planLegacyNarrative` frozen bit-identical
  (`packages/core/src/narrative.ts:235-239`) against `packages/core/fixtures/legacy-narrative-baselines.json`,
  replayed by `packages/core/tests/purposes.test.ts:108-112`. `showcase ≠ P04` pinned at
  `packages/core/tests/purposes.test.ts:89-96,208-216`. 16-dim set: `DIMENSIONS` frozen 8 + `NEW_DIMENSIONS` 8 =
  `EXTENDED_DIMENSIONS` (`packages/core/src/semantics.ts:37-63`); legacy classifiers default to the frozen 8
  (`:300,328-345,629-633`).

## (6) Schema-change surface for OPTIONAL typed intent metadata — file/test list

Source files that must change (validators ignore unknown keys, so every layer needs an explicit addition;
Markdown's strict parser additionally *rejects* unknown keys):

1. `packages/core/src/schema.ts` — extend `NarrativeBlock`/`NarrativeSlide` (`:82-93`); add checks in
   `validateNarrative` (`:243-272`). Note `FORBIDDEN_KEYS` (`:102-134`) rejects only listed names — a new key
   passes silently today, which is exactly why explicit validation + tests are required.
2. `packages/core/src/slide-ir.ts` — extend `SlideIRSlide` (`:23-40`); thread through `narrativeToSlideIR`
   (`:85-123`) and `slideIRToNarrative` (`:129-141`); validate in `validateSlideIR` (`:148-185`, cf. emphasis check
   at `:179`).
3. `packages/core/src/slide-markdown.ts` — extend vocabulary `BLOCK_KEYS`/`SINGLETON_KEYS`/meta keys (`:15-17`);
   `serializeSlideMarkdown` (`:24-37`); `PendingSlide`/`finishSlide` (`:39-64`); `parseSlideMarkdown` (`:67-164`).
   Decide: Markdown-visible (like `emphasis`) vs IR-only (like `densityPolicy`, currently dropped — see §1 gap).
4. `packages/core/src/narrative.ts` — emit from `claimSlide`/`numberSlide` (`:179-215`) if planner-populated, or
   `PlanNarrativeOptions` (`:51-62`) if user-driven. Either choice changes planner output bytes (see fixture risk).
5. `packages/core/src/layout.ts` — passthrough/ignore decision in `layoutSlide` (`:801-859`); note `layoutSeed`
   hashes full narrative JSON (`:872-874`), so a new Narrative field re-seeds every deck (deterministic, but
   snapshot-breaking).
6. Conditional: `packages/core/src/composition.ts` preconditions (`:54-67`) if layout-selectable;
   `packages/core/src/export.ts` (`:50-83`) if PPTX-visible; `packages/core/src/quality.ts` if quality-gated;
   `apps/web/app/api/markdown/route.ts:45-46` (double-parse round-trip preserves only known keys);
   `apps/web/app/api/generate/route.ts` if user-settable.

Tests/fixtures requiring new migration tests:

- `packages/core/tests/schema.test.ts` — narrative validation + forbidden-key scan (rejects unknown *roles* at
  `:32-34`; needs unknown-*field* policy tests for the new key).
- `packages/core/tests/slide-ir.test.ts` — dropped-vs-preserved contract (`:61-72`), structural rejection table
  (`:83-98`); add typed-metadata cases.
- `packages/core/tests/slide-markdown.test.ts` — canonical byte-stability (`:29-33`), strictness table (`:45-62`),
  hand-written deck (`:92-122`); any vocabulary addition changes canonical bytes.
- `packages/core/tests/purposes.test.ts:108-112` + `packages/core/fixtures/legacy-narrative-baselines.json` —
  **bit-identical legacy gate**: if the planner emits the new field on the legacy path, baselines break and must
  be regenerated deliberately (frozen-contract violation unless scoped to preset path).
- `packages/core/tests/narrative.test.ts`, `pipeline.test.ts`, `decks-all.test.ts` — end-to-end bytes/provenance.
- Version decision: `SLIDE_IR_VERSION` exact-match (`packages/core/src/slide-ir.ts:151`) means old payloads fail
  loudly; there is no migration harness (§3) — either bump + write one, or keep the field optional-and-ignored by
  old validators (current validators ignore unknown keys, so forward-read works; old writers just omit it).
