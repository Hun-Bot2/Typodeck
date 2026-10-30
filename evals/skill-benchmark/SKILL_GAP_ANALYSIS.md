# Skill Gap Analysis — External Practices vs Typodeck

Source citations use `[A/B/C §…]` = SOURCE_AUDIT.md sections. Every
candidate practice is classified ADOPT / ADAPT / REJECT /
ALREADY IMPLEMENTED with reason and cost.

Cost scale: XS = Skill-doc edit only · S = docs + test/lint rule ·
M = new script or small renderer change · L = new subsystem.

## Discovery and planning

### 1. Three meaningfully different previews before full-deck generation [A §Step 2.0]

**ADAPT.** Typodeck already generates all 3 registry systems over the
SAME narrative (`/api/generate` → gallery + compare), which is
structurally the audition pattern — but the Skill never prescribes an
explicit preview-before-export step, and CLI users get one system per
run. Adapt: document an optional preview step (generate once, compare
systems in the gallery, then export the chosen system). Keep it
optional when a system is already selected [C §audition: "optional,
not an extra step for every deck"]. Cost: XS (Skill docs) + S
(optional `--preview-all` CLI flag emitting 3 one-slide previews).

### 2. One-proposal approval gate; never build before yes [B §Step 3]

**REJECT as mandatory, ADOPT the optionality framing.** Forcing a
gate per action contradicts the task brief and Typodeck's CLI/API
automation story. Adopt instead the audition framing: exploration is
available but skipped when the design is already selected.
Cost: XS.

### 3. Preview authenticity: real content, zero process labels [A §Step 2.0; B §Step 2]

**ADOPT.** "No `preview/Option A/template` text on slides" is
currently implicit in Typodeck (kickers come from narrative, never
workflow state) but unstated — a regression risk as gallery/compare
UI grows. Add an explicit rule + a test asserting benchmark HTML
contains no workflow tokens. Cost: S.

### 4. Batched intake questionnaire, Purpose/Length/Content/Density [A §Phase 1]

**ADAPT (partially ALREADY).** Typodeck Studio already exposes
purpose/audience/duration controls and CLI takes args; it never
interrogates. Adopt only the batching principle for agentic use:
when driving Typodeck conversationally, ask missing inputs ONCE,
batched (≤3 questions [C §Clarify]), then proceed on stated
assumptions. Cost: XS.

### 5. Infer-everything, ask at most one question [B §Step 1]

**ALREADY (philosophy).** Typodeck CLI/API defaults (legacy arc,
`swiss`, `en`) embody inference-over-interrogation. No change;
cite as shared principle.

### 6. Density modes: speaker-led vs reading-first [A §Density Modes; B §composed]

**ADAPT — highest-value planning adoption.** Typodeck has duration
and audience inputs but no explicit density POLICY linking them to
text-per-slide, slide count, or type scale; presets adapt arcs, not
density. Adapt: define two density policies in the Skill
(speaker-led: 1 idea/slide, large type, more slides; reading-first:
self-contained slides, structured density, still split-before-shrink),
map duration+preset to a default, and record it in Slide IR metadata.
Renderer caps already split content; this makes the policy explicit
and testable. Cost: S now (docs + IR field + planner hint), M later
(density-aware composition scoring).

## Progressive disclosure

### 7. Compact selection index → preview cards → full recipe on selection [A §Skill]

**ALREADY (structure) + ADOPT (growth path).** Typodeck Skill already
discloses progressively (SKILL.md → purposes/composition/optical/
revision/evaluation/visual-systems on demand). Adopt the index→card→
recipe ladder as the growth contract for when research candidates
arrive: registry index (compact) → per-system preview card → full
grammar doc only for selected/rendered systems. Cost: XS now
(document the contract in visual-systems.md); M when candidates land.

### 8. Corpus as retrieval memory; load atoms only [C §Design Decisions]

**ALREADY.** `research-index.md` + evidence registry follow this;
46 principles are never pasted into context. No change.

## Layout and composition rules

### 9. Action titles; topic labels forbidden; one claim per slide [B §aesthetics/Step 1]

**ALREADY (core) + ADOPT (wording).** Slide IR requires thesis per
slide; claim selection enforces evidence-backed headlines. Adopt the
checkable title-quality wording ("claim, not label") into
`composition.md`/critic title checks. Cost: XS.

### 10. Readable defaults: pt floors, ≤2 title lines, split-before-shrink [C §Design]

**ADAPT.** Typodeck enforces in-bounds geometry and 16:9 margins but
states no absolute type floors in the Skill (body contrast ≥4.5:1
exists). Adapt: publish floors mapped to Typodeck units (title,
body, caption minima; ≤2 title lines; shorten/split/convert before
shrinking) as a QA checklist in `revision.md`, enforced first as
critic warnings, later as gates. Cost: S.

### 11. Similarity guard across decks (≥3 differing choices) [B §theme-generation]

**REJECT (invention half) / ALREADY (repetition half).** Typodeck
does not invent per-deck themes — systems are human-selected from a
versioned registry — so cross-deck invention guards don't apply.
Within-deck repetition is already covered (art-direction repetition
checks, benchmark triple-repeat = 0). No change.

### 12. Grammar owns arc/grid/density; presets own palette/type only [C §catalog]

**ALREADY (stronger).** Typodeck separates Purpose → Narrative →
Visual System → Renderer, a strictly cleaner split than
grammar/preset. No change; cite as Typodeck lead.

### 13. No arbitrary coordinates in source; renderer owns coordinates [C §Core/SKILL]

**ALREADY.** Slide IR is coordinate-free; `layout.ts` owns geometry.
No change; cite as Typodeck lead.

### 14. Structural diversity gate with entropy thresholds [C §Diversity Gate]

**REJECT for now.** Color-blind clustering over 9 roles needs a
render corpus that doesn't exist yet and is overkill at 3 systems.
Revisit when research candidates arrive. Cost if later: L.

## Preview, edit, iterate

### 15. Preview file IS the deck file; approved slides never regenerated [B §Step 4]

**ALREADY.** Slide Markdown is the stable source; Markdown re-render
never re-plans narrative; stored decks pin `{system, systemVersion}`.
No change; cite as Typodeck lead.

### 16. Source-first editing; typed ops; mandatory QA after ANY edit [C §editing.md]

**ALREADY (path) + ADOPT (rule).** Studio Markdown-edit → re-render
exists. Adopt the explicit ladder: (1) edit Slide Markdown,
rebuild; (2) never patch generated PPTX; (3) every edit re-runs
validation + critic before delivery. Cost: XS (docs) + S (Studio
already re-validates on export; assert in test).

### 17. In-place edit keeps approved theme; out-of-scope declared, not forced [B §Editing]

**ALREADY (spirit).** Registry systems fail loudly instead of
falling back; Markdown edits preserve system pin. Add one line to
visual-systems.md making "edits never change the pinned system"
explicit. Cost: XS.

### 18. Speaker notes in output [B §Step 4; A §Phase 4]

**ADAPT (small gap found).** Slide IR carries `notes` ("never
rendered on slides") but `export.ts` does not write PPTX speaker
notes — notes silently die at export. Adapt: write IR notes to
native PPTX notes via pptxgenjs. Cost: S (implementation + test).

## QA and honesty

### 19. Rendered-slide QA in headless Chrome: frame/clip/overlap/size-floor/font-load [B §check-deck.mjs]

**ADOPT — highest-value engineering adoption.** This is Typodeck's
biggest known QA gap (no in-repo rasterizer; font substitution,
wrap divergence, clipping all UNMEASURED). A `check-html.mjs`
analogue over Typodeck's HTML previews (same five defect classes +
contact-sheet PNG) ports directly: our previews are absolutely-
positioned text blocks, simpler than reveal.js DOM. Cost: M (new
script + Playwright/Chrome dep, environment-gated tests). Until it
lands, adopt the honest-skip rule (item 22).

### 20. Contact-sheet single-image review [B §Step 4; C §visual_review]

**ALREADY (format differs).** Benchmark `index.html` gallery shows
all outputs; slide-wright's single-PNG sheet suits model vision
input better. Minor ADAPT when item 19 lands (emit PNG sheet
alongside HTML). Cost: included in 19.

### 21. "Assume problems" fresh-eyes pass + fix-and-verify cycle rule [C §visual_qa_prompt]

**ADOPT.** Typodeck's critic is deterministic proxies + pending
human A/B; it lacks a canonical adversarial inspection checklist
and the "no success before one fix-and-verify cycle" discipline.
Adopt the checklist (adapted to typography-only: drop
shape/icon/figure items) into `revision.md`. Cost: XS.

### 22. Honest skip/deferral reporting [B §Step 4; C §QA]

**ADOPT.** "If the script cannot run, say the visual check was
skipped" + "record the deferred render stage, do not probe
unrelated apps." Typodeck's critic already names unmeasured items;
adopt the exact reporting wording as a Skill-wide rule so every
future QA layer degrades honestly. Cost: XS.

### 23. Repair packet: source pointers + measured issues + image paths [C §Quick Deck]

**ADAPT.** Critic output names failure classes but doesn't point at
Slide Markdown source lines. Plan: extend critic findings with
`{slideId, markdownLine, measuredIssue, previewPath}`. Cost: M.

### 24. Visual review receipt bound to artifact hashes [C §visual_qa_prompt]

**ADAPT.** `decisions.json` preserves human KEEP/REVISE/MERGE/REJECT
but isn't bound to artifact bytes — a re-render could silently
invalidate a review. Plan: stamp `{pptxSha256, htmlSha256}` per
system entry; re-run marks entries STALE when hashes change
(without clobbering the human text). Cost: S.

### 25. Font-fallback honesty block (webfonts unembedded; LibreOffice≠PowerPoint) [B §export-pptx]

**ADOPT (wording).** Typodeck uses system-font stacks so the acute
risk is smaller, but PPTX-vs-HTML rendering differences are
equally real and currently under-documented. Adopt a "What to tell
the user" handoff block in the Skill. Cost: XS.

### 26. Placeholder/unresolved-content grep gate [C §QA]

**ALREADY.** Zero fabricated refs, no-meaningless-number rules, and
claim-status tracking cover this. No change.

## Export

### 27. Native-text-over-raster-background PPTX export [B §export-pptx]

**REJECT.** Flatly violates typography-only native-text purity
(shapes/charts baked into a background picture). Typodeck's pure
native-text export is the identity to preserve. No change.

### 28. reveal.js / any HTML-deck engine as renderer [B §engine]

**REJECT.** Explicitly forbidden by the task brief. No change.

### 29. SVG-first / shape-native pipelines [D §icgma]

**REJECT.** Same identity reason as 27. No change.

### 30. Vercel deploy / screenshot-PDF export [A §Phase 6]

**REJECT (scope).** Sharing/PDF are post-deck concerns; PDF
screenshots would reintroduce rasterized text into Typodeck's
story. Revisit only if users ask. No change.

### 31. Self-installing exporter deps into ~/.cache [B §export-pptx]

**ADAPT (note).** If item 19 needs Playwright/Chrome, follow this
pattern (cache outside the repo, env override) rather than adding
repo dependencies. Cost: included in 19.

## Benchmarking

### 32. Frozen-manifest blind benchmark with superiority gate [C §benchmark_protocol]

**ADAPT — basis for Typodeck's Skill benchmark.** The arm-comparison
harness (frozen prompts+seeds, external runs, blind Option labels,
failures kept in denominator, conjunctive superiority rule with
bootstrap CIs) is the most disciplined evaluation design of the
three. Typodeck needs Skill-VERSION comparison (before/after
refinement), not generator-arm comparison; the mechanics transfer
directly. See SKILL_REFINEMENT_PLAN.md §Benchmark. Cost: M.

## Scorecard

- ALREADY IMPLEMENTED (12): 5, 8, 11-half, 12, 13, 15, 16-half,
  17-half, 20, 26 + philosophy halves of 4/9.
- ADOPT (6): 3, 21, 22, 25 + optionality framing of 2 + growth
  contract of 7.
- ADAPT (9): 1, 4, 6, 9-wording, 10, 16-rule, 18, 23, 24, 31, 32
  (+ 20-PNG inside 19).
- REJECT (7): 2-mandate, 11-invention, 14, 27, 28, 29, 30.

Net: Typodeck leads on source/IR separation, native-text purity,
and registry discipline; it lags on rendered QA, density policy,
and benchmark rigor. The refinement plan closes exactly those gaps.
