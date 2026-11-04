# Typodeck Skill — Engine Invocation (read on demand)

The Skill INVOKEs Typodeck Core; it never duplicates rendering logic.
Two surfaces, same pipeline: CLI-first for single decks, programmatic
for the improved pipeline and multi-system previews.

## CLI (`npm run --silent deck -- …`)

Built on `packages/core/scripts/make-deck.ts`:

```sh
npm run build -w @typodeck/core        # once per checkout
npm run --silent deck -- --idea-file idea.txt --system swiss --out out.pptx
npm run --silent deck -- --repo owner/repo --system editorial --out out.pptx
npm run --silent deck -- --idea "..." --system expressive --preset P04 --lang ko --out out.pptx
```

- Exactly one of `--repo owner/repo` | `--idea "…"` | `--idea-file p`.
- `--system editorial|swiss|expressive|document`
  (`document` is experimental — see `references/visual-systems.md`),
  or `--template slug` (experimental: 27 Typo Pack candidates;
  discover with `npm run --silent deck -- --list-templates`). `--system`
  and `--template` are mutually exclusive; `--template` cannot combine
  with `--revise`. A Typo Pack entry re-themes its base system's
  geometry — never describe themed output as the HTML specimen.
- `--suggest` shortlists Typo Pack candidates without generating:
  `--preset P01..P10` (retrieval hints only), `--density`, `--formality`,
  `--content-types a,b`, `--mood a,b`, `--lang`, `--top N` (default 5).
  Explicit filters override preset hints. Every pick prints its base
  system, score, and reasons; scores rank metadata fit, not visual
  quality.
- `--preset P01..P10` (purpose-aware arc) or legacy `--purpose
  hackathon|competition|showcase` (`references/purposes.md`).
- `--lang en|ko`. Exit 2 = usage error, exit 1 = typed failure
  (`failed: <code> …`), exit 0 + `validation: OK` = shippable.
- Read the receipts: `provider:`, `claims:`, `quality:`, `deck:`,
  `warning:` lines. No `validation: OK`, no ship.

## Programmatic (improved pipeline + previews)

From `@typodeck/core` (`packages/core/src/index.ts` re-exports all):

```js
import {
  planDeck, planDecksAll,           // narrative.ts — full pipeline
  planCompositions, planArtDirection,// composition.ts, art-direction.ts
  layoutDeck, validateDeck,          // layout.ts, schema.ts
  applyOpticalCorrections,           // optical.ts
  critiqueDeck, reviseDeck,          // critic.ts
  exportToPptx, exportToPptxBuffer,  // export.ts
  validatePptx, validatePptxBytes,   // validate.ts
} from '@typodeck/core';
```

- `planDeck(input, {system, purpose?, preset?, lang?, seed?, ...fetchOpts},
  onStage?)` → `{deck, narrative, claims, ingested, provenance}`.
  `input` is `{type:'repo', owner, repo}` or `{type:'idea', text}`.
- `planDecksAll(input, opts)` lays out ALL systems from the SAME
  narrative — the design-selection primitive.
- Improved pipeline: `planCompositions`/`planArtDirection` →
  `layoutDeck(narrative, system, {compositionPlan})` →
  `applyOpticalCorrections` → `critiqueDeck`/`reviseDeck`
  (details in `references/composition.md`, `references/optical.md`,
  `references/revision.md`). Worked code: `examples/05-improved-pipeline.mjs`.
- `exportToPptx(deck, path)` / `exportToPptxBuffer(deck)` then
  `validatePptx(path, expectedChars)` /
  `validatePptxBytes(bytes, expectedChars)` — always validate what
  you export (`references/export.md`).

## Studio API (same pipeline over HTTP)

- `POST /api/generate` `{mode, input, purpose?, lang?, variant?,
  durationMin?, emphasis?, selection?}` → `{narrative, decks,
  provenance}` over all systems (or SSE stage events). Body cap
  ~64 KB; repo fetch bound 60 s; whole-request timeout ~115 s.
- `POST /api/evidence` `{mode, input}` → inspectable claims.
- `POST /api/export` `{narrative, system, generatedBy?}` → `.pptx`
  attachment. The server re-lays-out from the narrative; client
  geometry is never trusted.
- `GET /api/catalog` → presets + systems. `POST /api/markdown` →
  render request from Slide Markdown.
- Status map: `not-found`→404, `private-repo`→403,
  `rate-limited`→429, `too-large`/`body-too-large`→413,
  `network`→502, `timeout`→504, `invalid-*`→400, `internal`/
  `layout-failed`/`export-validation-failed`→500.
