# Typodeck — Narrative Audit (Phase A, 2026-10-30)

Observed against the committed baseline (75/75 tests green). All findings below
were reproduced by running the built core (`packages/core/dist`) on the
recorded widgets repo fixture and the F4 Pantrylog idea — not inferred from
code reading alone.

## Method

- `extractClaims` + `planNarrative` on F4 (`idea-f4.txt`, 11 lines, ~22 sentences).
- Same pipeline on the recorded repo (`recorded-repo.json`: README + 2 docs + 2 code files).
- Manual inspection of `narrative.ts`, `evidence.ts`, `ingestion.ts`, `layout.ts`,
  `scripts/eval.ts`, and every test suite.

## Defects

### E1 — Number regex fabricates units (evidence.ts, CRITICAL)

`NUMBER_RE` has no trailing boundary guard, so the optional unit group matches
the first letter of the following word:

- observed: `"all 12 storage zones"` → `["12 s"]`, `"60 staple products"` →
  `["60 s"]`, `"4 supported grocery"` → `["4 s"]` (F4 claims c3, c5, c10).
- observed: `"90-second weekly ritual"` → `["90"]` (unit dropped; hero shows bare `90`).
- unobserved but reachable by the same pattern: digit prefixes of commit hashes
  and identifiers (`436bde0…` → `"436"`), since matching stops before letters.

Numbers must be copied verbatim; `"12 s"` is not a substring of the source in
any meaningful sense and can surface on a number slide.

### E2 — First-N claim truncation drops whole topics (evidence.ts, CRITICAL)

`MAX_CLAIMS_PER_FILE = 12`. F4 is a single file with ~22 sentences, so every
sentence after the 12th is silently discarded. Observed: the business-model
paragraph survives only as its first sentence, and the roadmap, competition,
and risk paragraphs never become claims at all. There is no importance-based
selection — position wins.

### E3 — No semantic classification (evidence.ts / narrative.ts)

Claims carry only `verified | suggestion | ungrounded`. Nothing distinguishes
problem / solution / results / future, or implemented / proposed / historical /
deprecated / unverified. Consequences observed:

- widgets n9 (`Each function validates its input and throws a typed error`)
  is an incidental API note promoted to a full slide;
- widgets n7 (`the 3.2 release cut render time by 18%`) is the only result on
  the board, but the planner cannot tell the meaningful token (`18%`) from the
  incidental one (`3.2` — a version, currently `numbers[0]`-eligible).

### N1 — No argument arc (narrative.ts)

Slide order is cover → first-2-numeric → file order → closing. There is no
problem→solution→evidence→next structure, and `purpose` (`hackathon` /
`competition` / `showcase` from the Studio API) only changes the cover kicker
case, never the ordering or emphasis.

### N2 — Title/body duplication (narrative.ts)

Thesis slides set `title = shorten(claim, 72)` and `body = claim`. Observed:
short claims render title and body identically (`The core loop has three
steps.` on widgets-style and F4 n8), contributing zero information.

### N3 — Repeated theses (narrative.ts)

The cover lead (`claims[0]`) is reused verbatim as slide n4's thesis + body
(observed F4: n1 body == n4 title == n4 body). The widgets deck carries four
near-identical layout-engine slides (c6, c11, c18, c20: "packs panels without
overlap", "explicit widths…deterministic" ×2, "packs panels…simple grid") with
no redundancy detection.

### N4 — Hero metrics are `numbers[0]` (narrative.ts)

Number slides take the first numeric token regardless of meaning. Observed
F4: heroes `40` and `90` (both unitless; `90` lost `-second`). Versions
(`3.2`), years, and unitless counts are all eligible.

### N5 — Contextless excerpts as full slides (narrative.ts)

Observed F4 n8: a whole slide for `The core loop has three steps.` — a section
header with no standalone meaning. Nothing scores slide-level information value.

### N6 — Generic closing (narrative.ts)

Every deck closes with `The thesis, restated / One thesis per slide; every
number traceable to its source.` — template filler that restates no thesis and
points nowhere.

### N7 — Citation machinery on every slide (narrative.ts)

Captions read `Source: idea.txt:1 · unverified · illustrative`. Traceability is
required, but the `Source:` prefix plus stacked tags dominate the small caption
role on all 10 content slides.

### N8 — KO mode relabels chrome only (narrative.ts)

KO decks translate kickers/closings but keep the same selection logic and quote
source-language claims (correct for fidelity). Framing templates beyond the
current labels do not exist, so audience-aware KO narratives cannot be built.

### N9 — No quality gate (missing module)

No code scores meaningfulness, coherence, evidence fidelity, or slide-level
information value. `planDeck` warnings cover only provenance and empty claims.
A deck of 10 redundant, contextless slides passes exactly like a good one.

## Non-defects (verified working, preserved as-is)

- Bounded ingestion, typed errors, README-first degrade: covered by tests.
- Code-confirmation upgrade (`widgetizer` README claim → verified): observed.
- `rephraseClaims` number preservation: covered by tests.
- Determinism (claims, narrative, end-to-end seed 42): covered by tests.
- Typography-only export + structural validation: covered by tests.
- Eval S1–S7 semantics: sound; S2's 83% (cover/closing carry no refs) is by design.

## Remediation status (Phase B, 2026-10-30)

- E1 fabricated units → FIXED (`evidence.ts` boundary-safe regex + tests).
- E2 first-N truncation → FIXED (caps 24/60 + ranked selection + tests).
- E3 no classification → FIXED (`semantics.ts`: 8 dims, 5 statuses).
- N1 no arc → FIXED (audience arcs + order tests).
- N2 title/body duplication → FIXED (support bodies / omitted bodies + gate).
- N3 repeated theses → FIXED (dedupe + cover-echo rule + gate + tests).
- N4 `numbers[0]` heroes → FIXED (validated hero selection + gate + tests).
- N5 contextless excerpts → FIXED (thin/pointer demotion + gate warnings).
- N6 generic closing → FIXED (sourced restate + forward + gate).
- N7 citation machinery → FIXED (compact captions; caption-free cover/closing).
- N8 KO chrome-only → FIXED (native KO templates, KO units/heroes, KO fixture).
- N9 no quality gate → FIXED (`quality.ts`, wired into pipeline/eval/CLI).
- New finds during remediation: license boilerplate as narrative (FIXED),
  gate title-resolution for short heroes (FIXED), S2 dilution by short
  decks (FIXED via encore substance passes).
- Live-read rounds R1–R4 (F1/F2/F3): badge alt-texts, issue templates,
  language tables, HTML wrappers, process docs, `vision` false-
  positives, version heroes, wrapped MIT lines, dotted-version
  fragments, marker-dense code-header legalese (region rule), code
  operator lines, relocation follow-ups, `**bold**` residue,
  blockquote prefixes, linter directives, URL attributions, raw
  TSDoc markup — all FIXED with regression tests; final live re-read
  + matrix re-run 2026-10-30 ~06:45 UTC: 24/24 OVERALL PASS.

## Remediation plan (Phase B)

1. `evidence.ts`: boundary-safe number regex with verbatim unit capture
   (`40 percent`, `90-second`, `50 million downloads`); raise claim caps so
   later paragraphs survive (selection moves to the planner).
2. New `semantics.ts`: 8-dimension importance rank, 5-way lifecycle status,
   hero-number validation (reject versions/dates/hashes), Jaccard redundancy,
   contextless detection, audience parsing (EN+KO), natural KO/EN templates.
3. `narrative.ts`: arc-ordered selection (cover + ≤2 number slides + one slide
   per dimension + sourced closing), support bodies instead of duplicated
   title/body, compact captions (`verified · src/pack.js:2`), sourced but
   caption-free cover/closing.
4. New `quality.ts`: Narrative Quality Gate (meaningfulness, coherence,
   fidelity, information value) wired into `planDeck` warnings/provenance and
   the eval reports. Advisory — never fails a build.
5. Fixtures: new recommendation-engine recorded repo plus contrasting idea
   fixtures (devtool with versions/dates/hashes, KO consumer idea); F4 kept.
6. Tests: new `semantics` + `quality` suites; updated caption/parser tests;
   full suite must stay green; EXAMPLES.sh re-verified.
