# Typodeck

Paste a repo URL or an idea. Get a slide deck where every number traces to a source — as an editable `.pptx`, not a screenshot.

Generic AI deck generators invent facts, overflow text boxes, and hand you flattened images you can't edit. Typodeck does the opposite: it extracts claims with file-and-line evidence, lays them out with a deterministic typography engine, and exports native PowerPoint text boxes. Zero images. Zero decorative shapes. Every character editable.

```sh
npm run --silent deck -- --idea-file idea.txt --system swiss --out deck.pptx
# provider: fallback (generated_by=fallback)
# claims: total=4 verified=0 suggestion=0 ungrounded=4
# deck: 6 slides, 22 text boxes -> deck.pptx
# validation: OK
```

## Quick start

Prerequisites: Node.js ≥20.9.0 (`engines` in `package.json`; required by Next.js) and npm. No other system dependencies. Verified on Node v26.8.1 / npm 12.0.2.

```sh
git clone https://github.com/Hun-Bot2/Typodeck.git
cd Typodeck
npm ci                      # reproducible; package-lock.json, no churn
cp .env.example .env        # optional — only for the live model provider or GitHub auth
npm run build -w @typodeck/core
npm test                                    # core suite, expect 270/270 green
npm run --silent deck -- --idea-file packages/core/fixtures/idea-f4.txt --system swiss --out deck.pptx
```

That last command writes a 10-slide editable `deck.pptx` (21 claims, 40 text boxes, `quality: pass overall=100`) and prints a receipt: provider, claim counts, slide/box counts, warnings, and `validation: OK`. No API key needed — without model credentials, Typodeck uses its labeled deterministic fallback (see [Configuration](#configuration)).

Other entry points:

| Command | What it does |
|---|---|
| `npm run samples` | Emit one fixed 7-slide deck per design system (Editorial / Swiss / Expressive / Document) |
| `npm run dev` | Start the Web Studio at `http://localhost:3000` (evidence inspector → purposes → 4-system preview → Slide Markdown editing → export) |
| `npm run eval -- --fixture F4` | Offline eval subset (idea fixture, all systems × languages) |
| `npm run eval:report` | Aggregate `evals/reports/` into `evals/summary.json` with PASS/FAIL per criterion |
| `npm run journey` | Live repo→deck→export end-to-end script (needs GitHub quota; exits 2 without quota/network — see `docs/GITHUB_JOURNEY.md`) |

Verified on this branch (`integrate/release-readiness`) from a clean checkout: fresh `npm ci`, core `tsc` clean, 270/270 tests, web production build, and the offline quick-start above.

## How it works

Two input modes, one pipeline:

1. **Repository mode** — give a public `owner/repo`. Typodeck fetches README/docs plus a bounded code sample (≤20 files, ≤200 KB, ≤5 code files, 30 s timeout), then extracts atomic claims. Code-backed claims are `verified`; README/docs claims are `suggestion` until a code file confirms a distinctive term.
2. **Idea mode** — paste 100–20,000 characters of product description. All claims are labeled `ungrounded`; captions say `unverified · illustrative`. Numbers are copied verbatim — never computed, never invented.

Then: claims → 5–12 slide outline (one thesis per slide) → deterministic layout in your chosen system → PPTX export → structural validation. Number slides are built only from claims that carry both a number and a source ref.

```
ingestion → evidence → narrative → layout → export → validation
```

### Four design systems, same facts

| System | Composition | Density |
|---|---|---|
| Editorial | Asymmetric single column, serif titles, generous whitespace | Low (≤3 blocks/slide typical) |
| Swiss | Four-column grid, tight leading, title left / text right | High (≤6 blocks/slide) |
| Expressive | Centered hero, dramatic scale contrast, alternating ink/paper | Medium (≤4 blocks/slide) |
| Document (experimental) | Dense reference hierarchy, technical-manual voice | High |

The same narrative rendered in every system differs measurably (see Guarantees). The Web Studio lays out all four from one narrative so previews are directly comparable.

## Why not a generic AI deck generator

| | Typodeck | Typical AI deck tool |
|---|---|---|
| Factual claims | Cited with file path + line range, printed on-slide | Uncited or plausibly-worded |
| Ungrounded text | Labeled `unverified` / `illustrative` / `proposal` in captions | Presented as fact |
| Numbers | Copied verbatim from source; number slides require refs | Frequently hallucinated |
| Output | Native `.pptx` text boxes, 100% editable | Flattened images or locked layouts |
| Layout | Deterministic engine, seeded, same input → same geometry | Non-reproducible |
| Validation | Every export scanned: forbidden objects, bounds, editability | None |

## Guarantees (measured, not promised)

Full-matrix eval, 4 fixtures × 2 languages × 3 systems = 24 runs, seed 42, provider `fallback`, measured 2026-10-30 on the pre-integration 3-system build. Source: [`evals/summary.json`](evals/summary.json); procedure: [`docs/EVALUATION.md`](docs/EVALUATION.md). A 4-system re-run (32 runs) on the integrated tree is pending; numbers below are the labeled baseline, not a claim about this revision.

| Criterion | Result | Target |
|---|---|---|
| End-to-end success (S1) | 24/24 (100%) | ≥90% |
| Repo slides with ≥1 valid ref (S2) | 180/216 (83.3%); content slides 100% (cover/closing carry none by design) | ≥80% |
| Unsupported factual claims (S3) | max 0/deck | ≤1/deck |
| Forbidden objects in PPTX (S4) | 0 | 0 |
| Text editability (S5) | 100% | 100% |
| Overflowing boxes (S6) | 0 | 0 |
| Latency, submit → deck (S7) | p95 1.8 s, max 4.7 s | ≤120 s |
| Idea-mode fabricated refs | 0 over 6 runs | 0 |

Design diversity passes 24/24 pairs via headline size + alignment mix. Honest footnote: blocks-per-slide is identical across systems because layout preserves narrative block counts 1:1 — recorded in the eval, not tuned away.

## Repository layout

```
packages/core/   Pipeline: ingestion, evidence, narrative, layout, export, validation, CLI, eval
apps/web/        Web Studio (Next.js): source form, SSE stage progress, 4-system preview, .pptx download
skills/typodeck/ Agent skill: CLI-first workflow, grounding rules, worked examples (run: skills/typodeck/EXAMPLES.sh)
evals/           Pinned fixtures, per-run reports, summary.json
docs/            PRD, architecture, design system, evaluation spec, provider investigation, log
```

No database, no auth, no cloud services. The API surface is five routes: `POST /api/evidence` (inspect files + claims with deep links), `POST /api/generate` (JSON or SSE stages; accepts an optional claim-exclusion/reframe selection), `POST /api/markdown` (re-render from edited Slide Markdown), `POST /api/export` (re-lays-out server-side from the posted narrative; client geometry is never trusted), and `GET /api/catalog` (system registry). The repo-to-deck flow is documented in [`docs/GITHUB_JOURNEY.md`](docs/GITHUB_JOURNEY.md).

## Configuration

| Variable | Effect |
|---|---|
| `TYPOdeck_MUSE_ENDPOINT` + `TYPOdeck_MUSE_API_KEY` | Both set → `MetaMuseProvider` (OpenAI-compatible chat-completions POST to your endpoint). Either missing → deterministic fallback, every output labeled `generated_by=fallback`. |
| `TYPOdeck_MUSE_MODEL` | Optional model name (default `muse-spark`) |
| `GITHUB_TOKEN` (or `GH_TOKEN`) | Optional GitHub token, read by the Studio evidence/generate routes and `eval fixtures --token-env` for higher rate limits. Without it, repo ingestion runs unauthenticated (60 req/hour/IP); quota exhaustion fails honestly as typed `rate-limited` with a reset time. |

Plainly stated: no live model endpoint has been verified — see [`docs/MUSE_PROVIDER.md`](docs/MUSE_PROVIDER.md). Until one is, every run uses the fallback and says so in its receipt. Never present fallback output as model inference.

## Limitations

- Public repos only; private repos are rejected with a typed error. Unauthenticated GitHub calls share hourly quota — quota exhaustion fails fast as typed `rate-limited` with a reset time (no silent degrade); the Studio offers pasted-text idea mode as an offline fallback.
- Typography only, by design: no images, icons, charts, tables, shapes, or animations. No PDF export, no collaboration. Speaker notes ride along to native PPTX notes (never rendered on slides).
- KO/EN only. Font embedding licenses are not yet verified — check before redistributing decks commercially.
- The deterministic fallback produces template-structured outlines; it guarantees grounding mechanics, not prose quality.

More: [`docs/FAQ.md`](docs/FAQ.md), [`docs/PRD.md`](docs/PRD.md) §7 (out of scope).

## Troubleshooting

- **`Module not found: Can't resolve '@typodeck/core'`** (HTTP 500 from `/api/generate` while the homepage still renders): `dist/` was never emitted — run `npm run build -w @typodeck/core` once.
- **GitHub `rate-limited` / 403 errors in repo mode:** the public quota is small; the error names the reset time — wait for it, set `GITHUB_TOKEN`, or use idea mode. Private repos are rejected by design.
- **`next dev` rewrites `apps/web/next-env.d.ts`, and `eval run` rewrites `evals/reports/*.json`:** both are tool side effects — do not commit them.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Short version: strict TypeScript, `node --test` suites beside the code, every `.pptx` must pass the structural validator (0 forbidden objects, all boxes in-bounds, 16:9).

## License

MIT — see [`LICENSE`](LICENSE).
