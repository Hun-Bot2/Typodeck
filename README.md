# Typodeck

Typodeck turns a product idea or a public GitHub repo into a
typography-only pitch deck: real editable PowerPoint text, no stock imagery,
no chart junk, no same-y AI styling. Every number on a slide traces back to
extracted evidence, and the exporter refuses anything that is not text —
verified structurally on every run.

```sh
npm ci
npm run deck -- --idea-file idea.txt --system swiss --out deck.pptx
```

```text
provider: fallback (generated_by=fallback)
claims: total=1 verified=0 suggestion=0 ungrounded=1
deck: 5 slides, 17 text boxes -> deck.pptx
validation: OK
```

Repo mode grounds claims in code instead — `sindresorhus/is` just produced
`claims: total=56 verified=47` with the same `validation: OK`.

## How it works

One deterministic pipeline, same for CLI, Studio, and agents:

1. **Ingest** — idea text (100–20,000 chars) or a public `owner/repo`,
   bounded to 20 files / 200 KB, README first. Private repos are rejected;
   quota exhaustion surfaces as a typed `rate-limited` error with reset time.
2. **Evidence** — claims are graded `verified` (code), `suggestion` (docs),
   or `ungrounded` (idea). Numbers stay verbatim and carry references;
   ungrounded numbers are labeled illustrative, never presented as fact.
3. **Narrative** — 5–12 slides: cover, number slides from verified claims,
   proposals, closing. Works without any API key via the labeled
   deterministic fallback; an optional Muse provider activates only when both
   endpoint and key are configured.
4. **Layout** — one of three typography systems (`editorial`, `swiss`,
   `expressive`), seeded and overlap-free on a 16:9 canvas. Five text roles,
   flat backgrounds, WCAG AA contrast.
5. **Validate + export** — the PPTX is unzipped and re-checked: 16:9, zero
   pictures/charts/tables/groups/gradients, all text in editable runs, every
   box in bounds. Anything else fails the run instead of shipping.

A fourth system, `document` (technical-manual voice), exists as
**experimental** and is not covered by the production guarantees.

## Output

- `.pptx` with native editable text (`a:t` runs, no locks) plus a machine
  receipt (slides, boxes, editable chars, validation verdict).
- Deck JSON for programmatic use, and a human review gallery for the
  underlying design research (`gallery/index.html`).
- Real examples in this repo: [`showcase/decks/`](showcase/decks/)
  (three generated decks with provenance JSON) and
  [`previews/`](previews/) (the same narrative rendered in all four systems).

English and Korean are both supported inputs; layout, wrapping, and the
evaluation matrix cover `en` and `ko`. The bundled preview set itself is
English-only.

## Run it

Prerequisite: Node.js ≥ 20.9.

```sh
git clone <this-repo> && cd typodeck
npm ci
printf '%s' "A neighborhood tool library: members borrow tools for a small
monthly fee. Each branch stocks 400 items and runs repair workshops." \
> idea.txt
npm run deck -- --idea-file idea.txt --system swiss --out deck.pptx
```

Other entry points, same engine:

- **Studio (web):** `npm run dev`, open http://localhost:3000, paste an idea
  or repo, preview, export. API: `POST /api/generate`, `POST /api/export`.
- **Samples:** `npm run samples` writes one deck per production system.
- **Eval:** `npm run eval` re-runs the 24-case matrix into `evals/reports/`.
- **Agent Skill:** `skills/typodeck/` is a portable project skill
  (Muse Code, Codex, Claude Code — check out the repo and point the harness
  at that directory). `skills/typodeck/EXAMPLES.sh` is an executable
  transcript; it passes end to end. The skill is not marketplace-listed.

## Quality evidence

- **Tests:** 270/270 pass (`npm test`), covering ingestion bounds, claim
  grading, narrative shape, per-system layout, PPTX validation, and contrast.
- **Phase-4 eval:** 24/24 runs pass (4 fixtures × EN/KO × 3 systems),
  S2 144/180 content slides (80.0%), latency p95 204 ms. Reports and summary
  in [`evals/`](evals/).
- **Design research:** 447 inspected references with a provenance-preserving
  merge, browsable with verification status in the gallery.
  See [`research/`](research/) and
  [`gallery/REVIEW-GUIDE.md`](gallery/REVIEW-GUIDE.md).

What is **not** claimed: no human-preference wins, no 90+ benchmark score
(the blind A/B protocol in `evals/benchmark-90/` is defined but unexecuted —
zero ballots exist), and no pixel proof that HTML previews match PPTX
rendering. The gallery labels renders accordingly; judge the `.pptx` files.

## Not supported

Images, charts, tables, shapes, animations, PDF export, private-repo access,
and speaker-note authoring (notes present in input pass through to the native
notes part untouched). Repo fetch is unauthenticated public GitHub only.

## Layout

```text
packages/core   Engine: pipeline, typography systems, PPTX export + validator
apps/web        Typodeck Studio (Next.js) + API routes
skills/typodeck Portable Agent Skill + worked examples
research/       447-reference design corpus, merge tooling, synthesis
gallery/        Static human-review UI over research + generated slides
evals/          Fixtures, eval harness, benchmark protocols, skill benchmark
showcase/       Pinned generated decks with manifests and previews
docs/           Architecture, design system, evaluation, launch readiness
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please keep the honesty rules that the
test suite enforces: no invented numbers, no silent fallbacks, no unverified
claims in docs. MIT licensed — see [LICENSE](LICENSE).
