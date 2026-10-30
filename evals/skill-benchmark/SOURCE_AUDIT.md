# Source Audit — Open-Source Presentation Skills

Inspected 2026-10-30 from fresh clones into `/tmp` (not committed).
Every claim below names the file it was read from; nothing is inferred
from README marketing alone.

## A. frontend-slides

- URL: https://github.com/zarazhangrui/frontend-slides
- Inspected commit: `9906a34d640d2111f724544cbc50f7f130569ae1`
- License: MIT (Copyright 2025 Zara Zhang)
- Engine: zero-dependency single HTML file per deck, fixed 1920×1080
  stage scaled to viewport (`SKILL.md` Core Principles, Fixed Stage
  Rules; `viewport-base.css` mandatory include).

### Skill structure and progressive disclosure

- `SKILL.md` (~380 lines) is the full workflow: Principles → Density
  Modes → Phase 0 Detect Mode → Phase 1 Content Discovery → Phase 2
  Style Discovery → Phase 3 Generate → Phase 4 PPT Conversion →
  Phase 5 Delivery → Phase 6 Share/Export → Supporting Files table.
- Progressive disclosure is explicit (Principle 4): read
  `STYLE_PRESETS.md` + `bold-template-pack/selection-index.json`
  (compact metadata) first; read a template's `preview.md` card only
  after shortlisting; read full `design.md` only for the selected
  template, never for the others (`SKILL.md` Step 2.0, lines ~144–178;
  Supporting Files table).
- Template pack: `bold-template-pack/templates/<name>/{preview,design}.md`
  per template plus `selection-index.json` with mood/tone/best_for/
  avoid_for/formality/density/scheme facets.

### Content planning workflow

- Phase 1 asks 4 batched questions together (Purpose / Length /
  Content / Density) via structured-question UI when available
  (`SKILL.md` Phase 1, lines ~89–110). Explicitly defers the inline-
  editing question until after a draft exists.
- Optional image evaluation (Step 1.2): scan → inspect → USABLE/NOT
  USABLE verdicts → co-design outline around text AND images →
  confirm outline. Usable logos are embedded (base64) into each
  style preview.

### Design discovery workflow

- Step 2.0 generates **3 distinct single-slide HTML previews by
  default**: 1 safe preset + ≥1 bold template + 1 wildcard
  (second template or free custom design), with mix rules for
  conservative vs expressive decks (lines ~134–160).
- If the user names a preset, it occupies one slot; the rest are
  generated around it. No "options or picker?" meta-question.
- Step 2.1: user picks Style A/B/C or Mix elements.

### Layout rules

- Fixed-stage invariants are NON-NEGOTIABLE: 1920×1080 canvas,
  uniform scale, no responsive reflow of slide content, slide
  visibility via `.active`/`.visible` (never `display:none`),
  `prefers-reduced-motion`, no negated CSS functions (lines ~38–52).
- Density modes: **Low/speaker-led** (1 idea/slide, 1–3 bullets,
  large type, more slides) vs **High/reading-first** (self-contained
  slides, 4–8 bullets or 4–6 cards, structured grids). Mixed needs
  snap to the closer mode; overflow splits slides instead of
  shrinking type (lines ~54–63, Phase 3 lines ~208–215).
- Mode C (enhancement) modification rules: count-before-adding,
  split-on-overflow, re-verify stage/overflow/overlap after ANY
  modification (lines ~75–85).

### Preview generation

- Previews are real animated title slides saved to
  `.frontend-slides/slide-previews/style-{a,b,c}.html`, opened
  automatically (Step 2.0). Preview authenticity rules are
  NON-NEGOTIABLE: real first-slide content only; no process labels
  (`preview`, `Option A`, template names, requirement notes) rendered
  on any slide (lines ~180–187).

### Editing and iteration

- Post-draft inline editing by default (press E, click text, Ctrl+S);
  users never choose editing behavior before seeing a draft.
- Mode C edits existing HTML in place with overflow/overlap
  re-verification, including a phone-viewport screenshot check.

### Visual quality assurance

- QA is screenshot-based and agent-performed: after generating,
  verify content overflow AND panel overlap in rendered browser
  screenshots; `scrollHeight` checks alone are explicitly
  insufficient because grid panels can cover each other
  (Phase 3, line ~225). No dedicated QA script ships in-repo;
  `scripts/` holds only `deploy.sh`, `export-pdf.sh`,
  `extract-pptx.py`.

### Export architecture

- No PPTX export. Phase 6 offers Vercel deploy (`scripts/deploy.sh`)
  or PDF via headless-browser screenshots at 1920×1080 combined
  into one PDF (`scripts/export-pdf.sh`, Playwright installs on
  first run; `--compact` 1280×720 option). Gotchas documented:
  slides need `class="slide"`, relative asset paths, ~20 MB for
  18 slides.
- Reverse direction only: `scripts/extract-pptx.py` (python-pptx)
  extracts text/images/notes for HTML conversion (Phase 4).

### Known limitations (stated or observed)

- PDF is a static screenshot snapshot (no animation/interactivity).
- No structural validator, no font-fallback treatment, no
  placeholder-text checks, no reproducible-benchmark story.
- Decorative CSS vocabulary (cards, gradients, shapes) is core to
  its aesthetics — incompatible with typography-only constraints.

## B. slide-wright

- URL: https://github.com/arifszn/slide-wright
- Inspected commit: `a751585b43353b6b9320a97106b59b9dea7ce817`
- License: MIT (Copyright 2026 Ariful Alam)
- Engine: reveal.js from CDN inside a single self-contained HTML
  file; the engine is deliberately hidden from the user
  (`SKILL.md` "The engine (keep this internal)").

### Skill structure and progressive disclosure

- Root `SKILL.md` (~52 lines) states one defining rule — propose the
  look, get a yes, then build — plus edit-existing and hand-off
  steps. A sync script (`tools/sync-root-skill.sh --check`,
  enforced in CI) keeps it identical to
  `slide-wright/SKILL.md`.
- 11 references under `slide-wright/references/`, each labeled with
  the step that needs it; "Read these as you reach them, not all at
  once" (`SKILL.md` Reference files). New-deck flow lives in
  `new-deck.md` (Steps 1–4); hand-off in `SKILL.md` (Step 5).

### Content planning workflow

- Step 1 (`new-deck.md`): NO opening questionnaire — infer purpose,
  audience, length, and evidence needs from whatever the user gave;
  ask at most one question and only when the request is too thin to
  design from. Composed-slides rule: every content slide is
  self-contained (readable without the presenter), one claim per
  slide, split on overflow, never scroll/shrink below theme sizes.

### Design discovery workflow

- Step 2: read `theme-generation.md` + `design-aesthetics.md`, apply
  the similarity guard, invent ONE theme (palette, type system,
  layout system, exhibit style — no preset library), build a
  two-slide preview (real title slide + real content slide with
  action title and full exhibit) as `./<deck-slug>.html`, open it.
- Step 3 approval gate is the ONLY question in the message: build /
  different direction / adjust. Rejection triggers one steering
  question (Surprise-me-first + contextual directions, never a
  fixed list); the retry must be radically different, not a recolor.
- Full deck is never built before a yes. The preview file IS the
  deck file — approved slides are kept, never regenerated
  (anti-drift rule, Step 4).

### Layout rules

- `design-aesthetics.md`: boardroom-grade bar — every content slide
  = action title (claim, 1–2 lines, never a topic label) + one
  exhibit (flow/mockup/chart/comparison/timeline/metric panel);
  one dominant surface + one accent; strict type scale (80/40/28/20
  px on canvas, body ≥26 px, labels ≥18 px); left-aligned grid;
  copy rules (1–2 sentences or 3–5 bullets under 10 words).
- `theme-generation.md`: per-deck palette/type/layout/exhibit
  decisions; WCAG AA body text; 12-column grid; recurring chrome
  optional per theme. Similarity guard: ≥3 of 7 choices (surface,
  pairing, geometry, title placement, exhibit family, card
  treatment, chrome) must differ from the last unrelated deck,
  plus ≥3 composition-level variants.
- "Honest check": picture the slide projected in a boardroom from
  a respected company; fix anything that looks web-made.

### Preview generation

- Two real slides in the final file, opened in the browser; theme
  name in the message, never on a slide; no process language in
  filename or slides (`new-deck.md` Step 2).

### Editing and iteration

- Reveal.js decks (whoever built them) are edited in place with the
  theme kept; proposal flow skipped. Non-reveal HTML is declared
  out of scope rather than force-rewritten. Every edit re-runs
  `check-deck.mjs` until clean (`SKILL.md` Editing).

### Visual quality assurance

- `scripts/check-deck.mjs` (129 lines, headless Chrome): per slide
  reports content outside frame, clipped/scrolling text,
  overlapping text blocks, text under the 18 px floor, and web
  fonts that did not load (`document.fonts` check); `--sheet`
  writes a contact-sheet PNG; exit 1 on defects, 2 on load
  failure. Step 4 mandates fix-and-rerun until `OK`, then ONE
  human look at the contact sheet "for what code cannot see".
- Honest skip rule: "If the script cannot run, say the visual
  check was skipped."

### Export architecture

- `scripts/export-pptx.mjs` + `lib/extract.mjs` (301 lines, runs
  in-page): headless browser finds leaf text blocks rebuildable
  as native PowerPoint text, hides exactly that text in the DOM,
  screenshots the slide as a full-slide background picture, then
  writes background + native editable text boxes (font/size/
  color/weight/alignment/spacing) + speaker notes via pptxgenjs
  (`references/export-pptx.md`). Shapes/charts/SVG stay raster.
- Deps self-install to `~/.cache/slide-wright`; uses installed
  Chrome, downloads Chromium only if none.
- Tests (`tests/`, CI on Ubuntu with LibreOffice + poppler):
  exporter tests, an independent OOXML structural validator
  (`validate-ooxml.mjs`, written from ECMA-376 — checks dangling
  rels, content types, color values), and pixel-level
  render-position tests (`pixels.mjs` ink-centroid analysis
  against LibreOffice renders).
- Handoff honesty (`export-pptx.md` "What to tell the user"):
  web fonts are NOT embedded (substitution moves line breaks);
  chip padding stays in the picture; animations flattened;
  unfaithful text (SVG/gradient/rotated/...) stays raster with
  per-slide counts; placement checked against LibreOffice, NOT
  PowerPoint — user is asked to open once in PowerPoint.

### Known limitations (stated or observed)

- Raster-background export violates editable-native-text purity
  (text is native, everything else is a picture).
- reveal.js CDN dependency; no offline story documented.
- One-proposal-at-a-time discovery (no side-by-side comparison).
- No content-planning schema, no benchmark protocol, no
  multilingual typography treatment.

## C. presentation-skill (siril9 fork family)

- URL: https://github.com/siril9/presentation-skill
- Inspected commit: `efd899c5ddf866af2ce0001c4c9340af775d4d55`
- License: MIT (Copyright 2026 Siril Sengolraj). Note: the same
  skill text appears under several fork names (dunerbing,
  wccym951126, xiaoqiwang19); siril9's tree was the most
  complete at inspection time.
- Engine: source-first PPTX via scripts (pptxgenjs templates in
  `templates/pptxgenjs/`); Python orchestration CLI
  (`scripts/present.py`, `qa_gate.py`, `render_slides.py`,
  `visual_review.py`, `deck_benchmark.py`, `audition_styles.py`,
  `deck_ir.py`, … — 60+ scripts).

### Skill structure and progressive disclosure

- `SKILL.md` (338 lines): Core Contract (source-first, deterministic
  rendering, fix-source-and-rebuild) → route choice (Quick Deck /
  Saved Workspace / Existing PPTX) → model profiles → design
  decisions → data/figures → QA/delivery → progressive-references
  list (11 entries, "Do not preload all references, presets, or
  corpus records").
- 20+ references; the descriptor corpus is "retrieval memory —
  load only the selected record or distilled atoms"
  (`SKILL.md` Design Decisions).

### Content planning workflow

- Quick Deck: `present.py brief` emits a model-ready brief (topic,
  prompt, slides, profile); agent authors `outline.json`
  (schema: `references/outline_schema.md`, 952 lines) carrying
  `style_preset` + `grammar_id`; slide order from evidence, not
  starter sequence; `role` = structure, `slide_intent` = story job.
- Saved Workspace: `init/build --draft/build` lifecycle with
  `design_brief.json`, `content_plan.json` (thesis, arc, roles),
  `evidence_plan.json` (claims, sources, chart candidates),
  `asset_plan.json`, `outline.json`, `notes.md` (assumptions).
  Builds also write deterministic `build/deck_ir.json`: a
  coordinate-free semantic representation with stable object IDs,
  evidence links, reading order, editability metadata —
  "Renderer scripts continue to own coordinates."
- Intake: at most 3 short questions, only when missing info would
  change the deck; otherwise state assumptions and proceed; never
  invent results (`SKILL.md` Clarify Only What Matters).

### Design discovery workflow

- `present.py audition --outline … --presets a b c`: renders the
  SAME representative content in a few candidate styles and writes
  `comparison.jpg`. Explicitly OPTIONAL — "not an extra step for
  every deck" — used only when style choice is genuinely
  uncertain; selection by evidence fit and hierarchy, not
  decoration; source unchanged (`SKILL.md` Quick Deck).
- 8 structural grammar families above 13 style presets
  (`composition_grammar_catalog.md`): each grammar owns reading
  path, persistent frame, primary proof, narrative arc, grid,
  density, role variants, invariant + forbidden moves; presets
  contribute only palette/type/treatment. Routing via
  `composition_grammar_catalog.py`; mixing rules cap borrowing
  (≤2 treatments, never another grammar's frame); diversity gate
  script clusters semantic occupancy/topology/reading-order with
  entropy thresholds (color-blind structural check).
- Visual A/B rule: freeze one outline, vary only `deck_style`.

### Layout rules

- Invariants (`SKILL.md` Design Decisions): one dominant idea +
  clear reading path per slide; focal point suited to evidence
  (plain bullets/table valid when best; decoration not required);
  left body copy; vary composition with the argument; bounded
  `role_layout_variant: primary|alternate|dense`; NO arbitrary
  coordinates in outline; footer region reserved.
- Readable defaults: titles ≥28 pt, body ≥16 pt, subtitles ≥13 pt,
  captions ≥9 pt, ≤2 title lines; shorten/split/convert before
  shrinking. "Use actual content to balance white space."

### Preview generation

- Audition `comparison.jpg` for style choice; rendered contact
  sheet + slide JPGs for QA (`render_slides.py`). Render cache
  keyed on content + environment (never reuses a visual judgment).

### Editing and iteration

- `references/editing.md` (302 lines): Preserve First; 4 tools for
  4 levels (`edit_deck.py` typed text/slide ops with
  `--require-match` output safety, outline rebuild,
  unpack/repack XML, template adaptation); mandatory QA after ANY
  edit ("Fix source and rebuild", never patch generated PPTX when
  source exists).

### Visual quality assurance

- 3-layer gate (`visual_qa_prompt.md` + `SKILL.md` QA And Delivery):
  (1) `qa_gate.py --strict-geometry` deterministic shape checks
  (overflow/overlap/density/contrast); (2) `visual_review.py`
  rendered packet (contact sheet, wrap-risk, orphan-word, footer-
  clearance, rhythm heuristics); (3) fresh-subagent visual pass
  over rendered JPGs with the canonical "assume problems" prompt
  (CLI-emitted with absolute paths; never hand-copied).
- "Do not declare success until at least one fix-and-verify cycle
  has completed." Re-verify affected slides after every fix.
  High-stakes: `visual_judgment_v1` JSON + receipt bound to exact
  PPTX + per-slide render hashes (`visual_review_receipt.py`) —
  a rebuild cannot reuse a stale approval; never invent a receipt.
- Degraded environments: preserve deck + static QA, record the
  deferred render stage, do not probe unrelated Office apps.

### Export architecture

- Native PPTX from source via pptxgenjs role-layout contracts
  (`templates/pptxgenjs/*.js`); charts/tables/diagrams kept
  editable "where practical". Hard gates for delivery: preflight,
  geometry, rendered visual review, placeholders, readability/
  accessibility, delivery readiness (`report_delivery_readiness.py`).
- Reproducibility: figure artifacts carry source fingerprints,
  scripts, manifests, bindings, rebuild commands
  (`scaffold_figure_artifacts.py`); bar charts include zero by
  default.

### Known limitations (stated or observed)

- Heavyweight: 60+ scripts, dual Python/Node runtime, pinned
  environment (`npm run doctor`, `setup:python`).
- Decorative vocabulary (cards, borders, imagery) permitted —
  incompatible with typography-only constraints.
- No multilingual typography treatment observed; profiles
  (`fast/balanced/quality-first`, model-named aliases) are
  orchestration policies specific to its harness assumptions.
- Benchmark harness compares generator ARMS (external runs),
  not Skill versions — adaptable but not directly reusable.

## D. Skills considered but not deeply audited

- `mamarexa/foundation-skills` (pitch-deck-writer): feasibility-
  study pipeline; deck building is one downstream step, less
  relevant to Skill mechanics.
- `MiniMax-AI/skills` pptx-generator (+ nexu-io mirror): template-
  first PptxGenJS snippets; no discovery/QA/benchmark story at
  the catalog level inspected.
- `icgma/slide-skill`: SVG-first pipeline with routed workflows;
  noted for routing-by-scenario but not cloned (diminishing
  returns after three full audits; see gap analysis REJECT notes
  for SVG-shape pipelines under typography-only constraints).
