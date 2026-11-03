# Reference Study: zarazhangrui/frontend-slides

Source: https://github.com/zarazhangrui/frontend-slides (fetched via raw.githubusercontent.com, Nov 2026; cross-checked against local mirror at `frontend-slides/`).
Scope: SKILL.md, STYLE_PRESETS.md, bold-template-pack/selection-index.json, preview.md/design.md for signal / block-frame / blue-professional, viewport-base.css, html-template.md, animation-patterns.md, bold-template-pack/README.md, scripts/export-pdf.sh, README gallery section.
Constraint: observations only — no code copied. Typodeck keeps its shared engine + native PPTX output.

## 1. How it separates discovery / shortlist / selection / full-deck / verification

Five strictly ordered gates; each gate reads only the files it needs (progressive disclosure).

**Discovery (Phase 1 content + Phase 2 trigger).** Phase 1 asks ALL content questions together in one message (Purpose / Length / Content / Density), using a native structured-question UI when available. Density is a first-class choice: low-density/speaker-led vs high-density/reading-first, and it drives slide count, type scale, and layout for the rest of the run. Image evaluation (Step 1.2) scans, inspects, and grades each image USABLE/NOT USABLE, then co-designs the outline around text + images (not "plan slides then add images"). Inline editing is deliberately NOT asked here — it is a post-draft default. Reads: SKILL.md only.

**Shortlist (Phase 2, Step 2.0 — metadata only).** The agent reads two lightweight indexes: STYLE_PRESETS.md (12 safe presets: vibe, layout, typography, colors, signature elements) and selection-index.json (34 bold templates with slug, mood[], tone[], formality, density, scheme, best_for, avoid_for, preview_md/design_md paths). A mood→preset table maps user mood to candidates. Preview mix is fixed: 1 safe preset + at least 1 bold template + 1 wildcard (second bold template OR free custom design). Bold matching treats best_for as soft signals, keeps the three options genuinely different, and for conservative decks forces restrained choices in all three slots. After shortlisting, the agent reads ONLY the shortlisted candidates' small preview.md cards. It must never bulk-read design.md or template.html at this stage.

**Selection (Phase 2, Step 2.1 — visual, not verbal).** "Show, don't tell": the agent generates 3 real single-slide HTML title previews into `.frontend-slides/slide-previews/` (style-a/b/c.html), auto-opens them, and asks "Which style?" with a Mix-elements option. Preview authenticity rules are non-negotiable: each preview must look like a real first slide from the user's deck — no template names, slugs, Option A/B/C labels, file paths, preset names, or requirement notes rendered on the slide; names live only in the chat message. If a usable logo exists it is embedded in all three previews. Custom wildcards must still pass the same authenticity checks, imply a full expandable system, and carry no process labels.

**Full-deck (Phase 3 — exactly one recipe).** After the pick, the agent reads exactly one full design.md (or expands the custom wildcard's own CSS if that won — never switching systems afterward) plus html-template.md, viewport-base.css (pasted in full), and animation-patterns.md. Output is a single self-contained HTML file on a fixed 1920×1080 stage scaled as one transform (letterbox/pillarbox, never reflow; visibility via .active/.visible, never display:none; clamp() only outside the stage). design.md is treated as a recipe (fonts, palette, decorative vocabulary, spacing rhythm, component grammar), with viewport-fluid vw/vh/clamp values translated into stage coordinates. Demo content is never copied; template.html is a last-resort reference only. Density choice governs the whole deck (low: more slides, 1–3 bullets, quote/section beats; high: grids, tables, 4–8 bullets — but overflow always splits slides instead of shrinking text).

**Verification (Mode C rules + Phase 3 checks + Phase 5/6 delivery).** Every modification re-verifies: stage still 16:9, no text overflow, no panel overlap, screenshots at 1280×720 plus one phone viewport. After generation the agent must verify overflow AND overlap in rendered browser screenshots — scrollHeight checks alone are explicitly insufficient because grid panels can cover each other while passing. Phase 5 deletes previews, opens the deck, and summarizes customization points (:root variables, font link, .reveal). Phase 6 (optional share) deploys via Vercel or exports PDF by screenshotting each `.slide` at 1920×1080 with Playwright.

## 2. What multi-page testing looks like there

There is no automated test harness in the repo (no test/spec/verify files; scripts/ holds only extract-pptx.py, deploy.sh, export-pdf.sh). "Testing" is agent-executed visual inspection plus two mechanical scripts:

- **Per-slide screenshot review.** The agent renders and inspects slides for overflow and panel overlap; Mode C requires 1280×720 + phone viewports. design.md files document 10+ layout classes per system (cover, chapter, stat grids, timelines, compare, quote, pyramid, cycle, dashboard) so the agent knows which layouts must be exercised across the deck.
- **export-pdf.sh as the de-facto multi-page pass.** It serves the deck over HTTP, screenshots every `.slide` element one by one at 1920×1080 (or 1280×720 with --compact), and combines them into a PDF. Failure modes are documented (0 slides found = wrong class name; absolute asset paths break; ~20MB for 18 slides).
- **README gallery as the cross-layout proof.** The Bold Template Gallery shows 34 systems × 3 screenshots each (e.g. signal-1/18/8, block-frame-1/4/8), each trio spanning different layouts (title + content + data/closing) with a one-line design thesis. Screenshots live in the sibling beautiful-html-templates repo. This is human review infrastructure, not CI: there are no assertions, baselines, or diff gates.

## 3. What Typodeck should adopt

1. Progressive-disclosure selection pipeline (compact index → preview card → single full recipe; never bulk-load all systems).
2. Fixed preview mix: 1 safe + ≥1 bold + 1 wildcard, with tone adjustment for formal vs expressive briefs.
3. Preview authenticity rules: shortlist renders must be real slides with user content, zero workflow metadata on the slide.
4. Selection metadata schema per system: mood/tone/formality/density/scheme/best_for/avoid_for as shortlist signals (best_for soft, not a filter).
5. Density modes as an explicit upfront axis (speaker-led vs reading-first) driving slide count and layout choice.
6. "scrollHeight is not enough" verification principle: assert both text overflow AND panel overlap from rendered output.
7. Gallery proof pattern: N screenshots per system across different layout classes + one-line thesis, reviewed as a set.
8. design.md-as-recipe document shape (front-matter tokens + Overview/Colors/Typography/Layout/Signature-treatments sections) — structure only, rewritten for Typodeck tokens.
9. CJK/international note pattern (letter-spacing 0, looser line-height, no uppercase transforms on CJK runs).
10. Explicit DO-NOT-USE anti-slop list (banned fonts/colors/layouts) as eval failure criteria.

## 4. What Typodeck should NOT adopt

1. Zero-dependency single-HTML output — Typodeck keeps its shared engine; do not inline a per-deck controller.
2. Copying CSS, palettes, font stacks, or component code verbatim — study structure only; Typodeck tokens stay native.
3. Viewport-fluid source values (vw/vh/clamp/100vw canvas) as live rules — Typodeck authors in engine coordinates.
4. Per-deck SlidePresentation JS class / deck-stage.js duplication — engine owns scaling, nav, and progress.
5. Font bans that break PPTX (e.g. "never system fonts") — native PPTX needs embeddable/fallback-safe stacks.
6. deploy.sh / export-pdf.sh as-is — Typodeck export is native PPTX, not Playwright screenshots or Vercel hosting.
7. Single-slide-preview-only shortlisting — Typodeck shortlist evals should render multiple layout classes per candidate, not just the title slide.
8. Agent-manual verification as the whole story — Typodeck needs scripted assertions (overflow, overlap, contrast, font embedding) where frontend-slides relies on the agent eyeballing screenshots.

## Source map (all fetched)

SKILL.md (phases, mix rules, authenticity, verification); STYLE_PRESETS.md (12 presets + DO NOT USE + CSS gotchas); selection-index.json (schema_version 1, 34 templates, usage/never rules, fixed-stage policy); signal preview.md + design.md; block-frame preview.md; blue-professional preview.md + design.md; viewport-base.css (133 lines, mandatory base); html-template.md (stage scaler, SlidePresentation, inline-editing JS pattern, image pipeline); animation-patterns.md (effect-to-feeling guide); bold-template-pack/README.md (read order, implementation contract); scripts/export-pdf.sh (per-slide Playwright capture); README.md gallery (34 × 3 screenshots) + Architecture/Philosophy sections.
