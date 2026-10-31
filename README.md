# Typodeck

Paste a repo URL or an idea. Get a slide deck where every number traces to a source — as an editable `.pptx`, not a screenshot.

## 1. Product

Typodeck is a typography-native presentation studio. It turns a public
GitHub repository or a pasted product description into a 5–12 slide
deck composed only of type, numbers, whitespace, and color, exported
as a native PowerPoint file where every character stays editable.

Generic AI deck generators invent facts, overflow text boxes, and hand
you flattened images you cannot edit. Typodeck does the opposite: it
extracts claims with file-and-line evidence, lays them out with a
deterministic typography engine, and exports native PowerPoint text
boxes. Zero images. Zero decorative shapes.

```sh
npm run --silent deck -- --idea-file packages/core/fixtures/idea-f4.txt --system swiss --out deck.pptx
# provider: fallback (generated_by=fallback)
# claims: total=21 verified=0 suggestion=0 ungrounded=21
# quality: pass overall=100 errors=0 warnings=0
# deck: 10 slides, 40 text boxes -> deck.pptx
# validation: OK
```

The transcript above is real output from this baseline (10 slides,
40 text boxes, `validation: OK`). No API key needed.

## 2. Two modes

One pipeline, two inputs. The mode is auto-detected: a URL means
repository mode, pasted text means idea mode.

**Repository mode** — give a public `owner/repo`. Typodeck fetches
README/docs plus a bounded code sample (≤20 files, ≤200 KB total, ≤5
code files at ≤10 KB each, 30 s timeout), then extracts atomic claims.
Code-backed claims are `verified`; README/docs claims stay
`suggestion` until a code file confirms a distinctive term.

**Idea mode** — paste 100–20,000 characters of product description.
All claims are labeled `ungrounded`; captions read `unverified ·
illustrative`. Numbers are copied verbatim — never computed, never
invented.

Then: claims → 5–12 slide outline (one thesis per slide) →
deterministic layout in your chosen system → PPTX export → structural
validation. Number slides are built only from claims that carry both
a number and a source ref.

## 3. Three interfaces, one engine

The CLI, the Web Studio, and the agent Skill all drive the same core
pipeline (`packages/core`). Pick the surface that fits; the deck
mechanics never change.

| Interface | Entry point | Best for |
|---|---|---|
| CLI | `npm run deck -- …` | Scripts, evals, reproducible one-shot decks |
| Web Studio | `npm run dev` → `http://localhost:3000` | Evidence inspection, Slide Markdown editing, visual preview, export |
| Agent Skill | `skills/typodeck/SKILL.md` | Agentic decks: the Skill orchestrates Core (CLI/API) and never lays out slides itself |

The Studio adds an evidence inspector (review files + claims, exclude
or reframe before generating), all-systems preview from one narrative,
Slide Markdown editing with server-side re-render, and `.pptx`
download. The Skill adds purpose presets, composition planning, and
critic/revision loops on top of the same functions. Neither interface
invents its own geometry: the Studio server re-lays-out from the
posted narrative, and the Skill ships only on `validation: OK`.

## 4. Philosophy

Four rules, all enforced in code rather than promised in prose:

1. **Grounded, or labeled.** Factual claims carry file path + line
   refs printed on the slide. Anything ungrounded is labeled
   `unverified` / `illustrative` / `proposal` — hypotheticals can
   never masquerade as facts.
2. **Editable down to the last character.** The exporter emits native
   text boxes only; a structural validator scans every PPTX for
   forbidden objects. Open it and rewrite any line.
3. **Deterministic.** A seeded layout engine places every box — no LLM
   in the geometry path. The same input reproduces the same layout
   JSON, so decks are reviewable artifacts, not one-off generations.
4. **Honest about provenance.** No live model endpoint has been
   verified, so every run uses the labeled deterministic fallback and
   says so in its receipt. Fallback output is never presented as
   model inference.

Typography-only is a deliberate constraint, not a missing feature.
Decorative visuals are where generated decks smuggle in fabricated
content (fake charts, stock metaphors) and uneditable pixels.

## 5. Quickstart — CLI

Prerequisites: Node.js ≥20.9.0 (`engines` in `package.json`) and npm.
No other system dependencies. Verified on Node v26.8.1 / npm 12.0.2.

```sh
git clone https://github.com/Hun-Bot2/Typodeck.git
cd Typodeck
npm ci                      # reproducible; package-lock.json, no churn
npm run build -w @typodeck/core
npm test                    # core suite, expect 270/270 green
npm run --silent deck -- --idea-file packages/core/fixtures/idea-f4.txt --system swiss --out deck.pptx
```

`.env` is optional — only for the live model provider or GitHub auth
(see [Configuration](#13-configuration)). Without model credentials,
Typodeck uses its labeled deterministic fallback.

## 6. Quickstart — Web Studio

```sh
npm ci
npm run build -w @typodeck/core   # required once: the API imports dist/
npm run dev                       # Studio at http://localhost:3000
```

Flow: paste a repo URL or idea → **Inspect evidence** (files, claims,
grounding, deep links) → optionally exclude/reframe claims →
**Generate** → pick a purpose preset + language → preview all systems
→ edit Slide Markdown → **Download `.pptx`**. A marketing page with a
live demo console ships at `/landing`.

If `/api/generate` returns HTTP 500 with `Can't resolve
'@typodeck/core'` while the homepage renders, `dist/` was never
emitted — run the build line above once.

## 7. Examples

Every example below was executed on this baseline; expected receipts
are shown.

**Idea → deck (offline, no network):**

```sh
npm run --silent deck -- --idea-file packages/core/fixtures/idea-f4.txt --system editorial --out idea.pptx
# deck: 10 slides, 40 text boxes -> idea.pptx
# validation: OK
```

**Repo → deck (needs network + GitHub quota):**

```sh
npm run --silent deck -- --repo sindresorhus/is --system swiss --out is.pptx
# claims: total=56 verified=47 suggestion=9 ungrounded=0
# deck: 10 slides, 37 text boxes -> is.pptx
# validation: OK
```

**Purpose-aware narrative (one of 10 presets, P01–P10):**

```sh
npm run --silent deck -- --idea-file packages/core/fixtures/idea-f4.txt --preset P04 --system expressive --out pitch.pptx
# validation: OK
```

**Fixed samples (one 7-slide deck per system, all four):**

```sh
npm run --silent samples
# editorial: 7 slides, 24 text boxes, validation OK
# swiss: 7 slides, 24 text boxes, validation OK
# expressive: 7 slides, 24 text boxes, validation OK
# document: 7 slides, 24 text boxes, validation OK
```

**Skill transcript (idea + live repo + offline eval):**

```sh
bash skills/typodeck/EXAMPLES.sh /tmp/typodeck-skill
# exit 0; skips honestly without network/quota
```

**Offline eval subset (no network needed):**

```sh
npm run --silent eval -- --fixture F4
# matrix: 8/8 runs succeeded in ~100ms (seed=42)
```

## 8. Architecture

```
ingestion → evidence → narrative → layout → export → validation
```

| Stage | Module | Responsibility |
|---|---|---|
| ingestion | `src/ingestion.ts` | Bounded repo fetch or pasted-text accept; typed errors |
| evidence | `src/evidence.ts` | Atomic claims; `verified` / `suggestion` / `ungrounded`; verbatim numbers |
| narrative | `src/narrative.ts` + `src/semantics.ts` | 5–12 slide outline, audience arcs, purpose presets, compact captions |
| layout | `src/layout.ts` + `src/systems.ts` | Seeded deterministic geometry per visual system; no LLM in path |
| export | `src/export.ts` | `addText`-only PPTX; slide background fill; nothing else |
| validation | `src/validate.ts` | Forbidden-object scan, bounds, editability floor — every export |

Supporting modules: `provider.ts` (env-gated model provider +
labeled fallback), `quality.ts` (advisory Narrative Quality Gate),
`purposes.ts` (P01–P10 presets), `slide-markdown.ts` / `slide-ir.ts`
(editable Slide Markdown + versioned IR), `visual-systems.ts`
(system registry), `composition.ts` / `optical.ts` / `critic.ts`
(improved-pipeline planning and review). Details:
[`packages/core/README.md`](packages/core/README.md),
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) (Phase 0 record),
[`docs/engineering/decisions/`](docs/engineering/decisions/).

No database, no auth, no cloud services. The API surface is five
routes: `POST /api/evidence` (inspect files + claims with deep
links), `POST /api/generate` (JSON or SSE stages; accepts an optional
claim-exclusion/reframe selection), `POST /api/markdown` (re-render
from edited Slide Markdown), `POST /api/export` (re-lays-out
server-side from the posted narrative; client geometry is never
trusted), and `GET /api/catalog` (system registry).

## 9. Design systems

Four registered systems (`visual-systems.ts`), three production, one
experimental. Same facts, materially different composition.

| System | Status | Composition | Density |
|---|---|---|---|
| Editorial | production | Asymmetric single column, serif titles, generous whitespace | Low (≤3 blocks/slide typical) |
| Swiss | production | Four-column grid, tight leading, title left / text right | High (≤6 blocks/slide) |
| Expressive | production | Centered hero, dramatic scale contrast, alternating ink/paper | Medium (≤4 blocks/slide) |
| Document | experimental | Dense reference hierarchy, technical-manual voice | High |

The Studio lays out all four from one narrative so previews are
directly comparable. Design diversity passes 24/24 pairs via headline
size + alignment mix. Honest footnote: blocks-per-slide is identical
across systems because layout preserves narrative block counts 1:1 —
recorded in the eval, not tuned away.

## 10. Capabilities

Verified on this baseline (each item executed or read in code):

- Repo mode: public `owner/repo` → 5–12 slides with file+line refs;
  live run observed at 56 claims (47 verified) / 10 slides / 37 boxes.
- Idea mode: 100–20,000 chars → labeled deck; zero fabricated refs
  over the idea-mode eval runs.
- 10 purpose presets (`--preset P01..P10`) + legacy audience arcs;
  KO/EN in every layer (narrative templates, captions, eval matrix).
- Slide Markdown editing (Studio) round-tripping through a versioned
  IR; speaker notes ride along to native PPTX notes.
- Evidence inspector with claim exclude/reframe; GITHUB_TOKEN wiring;
  honest `rate-limited` failures with reset time.
- Native `.pptx`: 16:9, 100% editable text, zero forbidden objects,
  provenance in core properties (`source: owner/repo@sha`).
- 270/270 core tests; 8/8 offline eval; production web build green.

## 11. Limitations

- Public repos only; private repos are rejected with a typed error.
  Unauthenticated GitHub calls share hourly quota — exhaustion fails
  fast as typed `rate-limited` with a reset time (no silent degrade);
  the Studio offers pasted-text idea mode as an offline fallback.
- Typography only, by design: no images, icons, charts, tables,
  shapes, or animations. No PDF export, no collaboration.
- KO/EN only. Font embedding licenses are not yet fully verified —
  check before redistributing decks commercially.
- The deterministic fallback produces template-structured outlines;
  it guarantees grounding mechanics, not prose quality.
- The 20-file ingest cap can fill with docs on large repos, leaving
  zero code-confirmed claims (captions stay honest). Blob fetching is
  sequential (~6 s evidence on capped repos).
- PPTX bytes vary run to run (embedded timestamps); the determinism
  guarantee covers layout JSON, not zip bytes.

More: [`docs/FAQ.md`](docs/FAQ.md), [`docs/PRD.md`](docs/PRD.md) §7
(out of scope), [`docs/GITHUB_JOURNEY.md`](docs/GITHUB_JOURNEY.md)
(journey limits).

## 12. Guarantees (measured, not promised)

Committed eval matrix: 4 fixtures × 2 languages × 3 production
systems = 24 runs, seed 42, provider `fallback`, measured 2026-10-30.
Source: [`evals/summary.json`](evals/summary.json); procedure:
[`docs/EVALUATION.md`](docs/EVALUATION.md) + `eval.ts` header. A
4-system re-run (32 runs, needs GitHub quota for F1–F3) is pending;
numbers below are the labeled 3-system baseline.

| Criterion | Result | Target |
|---|---|---|
| End-to-end success (S1) | 24/24 (100%) | ≥90% |
| Repo slides with ≥1 valid ref (S2) | 144/180 (80.0%); content slides 100% (cover/closing carry none by design) | ≥80% |
| Unsupported factual claims (S3) | max 0/deck | ≤1/deck |
| Forbidden objects in PPTX (S4) | 0 | 0 |
| Text editability (S5) | 100% | 100% |
| Overflowing boxes (S6) | 0 | 0 |
| Latency, `planDeck` wall (S7) | p95 204 ms, max 624 ms (15/24 warm cache) | ≤120 s |
| Idea-mode fabricated refs | 0 over 6 runs | 0 |
| Narrative quality (report-only) | 24/24 pass, mean 99.0, min 98 | — |

S7 measures `planDeck` wall time, not HTTP submit→preview. S6 counts
boxes exceeding bounds; there is no separate clipped-text detector
beyond the engine's own fitting. Both caveats are stated in the eval
reports, not footnoted away.

## 13. Configuration

| Variable | Effect |
|---|---|
| `TYPOdeck_MUSE_ENDPOINT` + `TYPOdeck_MUSE_API_KEY` | Both set → `MetaMuseProvider` (OpenAI-compatible chat-completions POST to your endpoint). Either missing → deterministic fallback, every output labeled `generated_by=fallback`. |
| `TYPOdeck_MUSE_MODEL` | Optional model name (default `muse-spark`) |
| `GITHUB_TOKEN` (or `GH_TOKEN`) | Optional GitHub token for higher rate limits. Without it, repo ingestion runs unauthenticated (60 req/hour/IP); quota exhaustion fails honestly as typed `rate-limited` with a reset time. |

Plainly stated: no live model endpoint has been verified — see
[`docs/MUSE_PROVIDER.md`](docs/MUSE_PROVIDER.md). Until one is, every
run uses the fallback and says so in its receipt. Never present
fallback output as model inference.

## 14. Development & contributing

```sh
npm run build -w @typodeck/core   # compile core (tsc, strict)
npm test                          # build core, then node --test — must be all green
npm run dev                       # Web Studio on http://localhost:3000
npm run eval -- --fixture F4      # offline eval subset; full matrix needs GitHub quota
npm run eval:report               # aggregate evals/reports/ into evals/summary.json
npm run journey                   # live repo→deck→export end-to-end (needs quota; exits 2 without)
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Short version: strict
TypeScript, `node --test` suites beside the code, injectable `fetch`
so tests never touch the network, typed errors with stable codes, and
every `.pptx` must pass the structural validator (0 forbidden
objects, all boxes in-bounds, 16:9). Do not commit tool side effects:
`next dev` rewrites `apps/web/next-env.d.ts` and `eval run` rewrites
`evals/reports/*.json`.

Repository layout:

```
packages/core/   Pipeline: ingestion, evidence, narrative, layout, export, validation, CLI, eval
apps/web/        Web Studio (Next.js): evidence inspector, SSE progress, 4-system preview, .pptx download
skills/typodeck/ Agent skill: CLI-first workflow, grounding rules, worked examples (EXAMPLES.sh)
evals/           Pinned fixtures, per-run reports, summary.json
docs/            Specs, audits, research, ADRs (docs/engineering/decisions/), log
```

## 15. License

MIT — see [`LICENSE`](LICENSE).
