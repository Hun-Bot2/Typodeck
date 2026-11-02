# A4 Audit: Critic + Validators + Render + Export

Scope: `packages/core/src/{critic,validate,quality,optical,layout,export,visual-review,slide-ir,schema,systems}.ts`,
`apps/web/components/SlideView.tsx`, `apps/web/app/api/{generate,export}/route.ts`,
`packages/core/scripts/{benchmark-90,visual-benchmark,eval}.ts`, `showcase/*.js`.
All findings below were read from file bodies. Verdicts: YES / NO / PARTIAL.

## (1) Critic input: layout metadata — PARTIAL (bboxes+fonts+contrast yes; rotation+layers no)

`critiqueDeck(deck, narrative?, plan?)` (`critic.ts:68`) receives the full positioned
`Deck`: `Slide.blocks: TextBlock[]` with `x,y,w,h` inches, `fontSize/fontWeight/tracking/
lineHeight/align/color/fontFace?`, plus `Slide.background` (`schema.ts:25-58`).

What the critic actually consumes per block (`critic.ts:71-145`):

- bboxes: `b.x/b.y/b.w/b.h` for `bounds` (`critic.ts:74`) and pairwise `rectsOverlap`
  (`critic.ts:136-145`, predicate `layout.ts:249-256`).
- fonts: `fontSize/fontWeight` feed `estimateWrap` bold flag and the `large`-text branch
  (`critic.ts:81,127`); `tracking/lineHeight` feed wrap (`critic.ts:81`); `fontFace`
  is ignored by the critic (only `export.ts:72` reads it).
- contrast: locally computed `contrastRatio(b.color, slide.background)` with WCAG AA
  thresholds 4.5:1 / 3:1-large (`critic.ts:60-65,126-134`).
- intent: `narrative` and `plan` are near-dead inputs — `if (narrative && plan) { void plan; }`
  (`critic.ts:171-173`); `plan` is used only for the `compositionVariety` score
  (`critic.ts:197-199`); `narrative` is otherwise unused.

Explicitly absent — no such fields exist on `TextBlock` (`schema.ts:25-48`):

- rotation: engine cannot emit it; `ENGINE_CAPABILITIES` omits it and the importer
  "fails loudly" on `rotation` (`visual-systems.ts:38-62`).
- layers/z-order/opacity: no fields; paint order is implicit block emission order.
- `fontFace` (candidate-theme override, `layout.ts:796`) never reaches any check.

Quoted interfaces: `CriticFinding{slideId,failureClass,check,severity,detail,suggestedFix}`
(`critic.ts:25-32`); `FailureClass='semantic'|'structural'|'typographic'|'perceptual'`
(`critic.ts:23`); `CriticScores{typographicFit,opticalQuality,compositionVariety,contrastAA}`
(`critic.ts:34-43`); `CriticReport{findings,scores,visionUnmeasured}` (`critic.ts:45-50`).

## (2) Screenshots to the critic — NO; screenshot plumbing — effectively NO

No critic path takes an image. `critiqueDeck` takes `Deck` only; `critiqueRenderedOverflow`
takes `Slide + RenderedBlockMeasurement[]` (`critic.ts:408-412`), where each measurement is
DOM box metrics (`scrollWidth/scrollHeight/clientWidth/clientHeight/fontSizePx/lineHeightPx`,
`critic.ts:310-321`) — numbers, not pixels.

The only "rendered" plumbing is DOM measurement, not screenshots:

- `OVERFLOW_PROBE_JS` collects `.slide-block` scroll/client sizes into `#typodeck-overflow`
  (`critic.ts:469-495`); `measureHtmlWithChrome` runs headless Chrome `--dump-dom` and parses
  that JSON (`critic.ts:561-598`); `measureSlideRender` = `renderMeasureHtml` + measure
  (`critic.ts:604-608`). No `--screenshot`, no pixel buffer, no image diff anywhere in
  `packages/core/src` (grep for screenshot/playwright/puppeteer/toDataURL: zero hits).
- The only `--screenshot` invocations in the repo are manual commands inside comments of
  `apps/web/scripts/showcase-filmstrip.js:1-11` (human-run filmstrip PNGs for landing/
  showcase) — not code, not wired to any check.
- Self-declared gap: `visionUnmeasured` lists 5 items incl. "vision-model aesthetic scores
  (no verified integration; not fabricated)" (`critic.ts:209-216`); header comment states
  "no vision model is integrated" (`critic.ts:1-6`); benchmark notes repeat "Font
  substitution is UNMEASURED" (`benchmark-90.ts:246`) and "Rasterized PPTX-vs-HTML
  comparison is NOT performed (no in-repo rasterizer)" (`visual-benchmark.ts:220`).

## (3) Deterministic validators inventory

| # | Check | Location | Trigger / threshold |
|---|-------|----------|---------------------|
| V1 | Deck bounds + ranges | `schema.ts:176-213` (`checkBlock`), `validateDeck` `:219-241` | rect outside 13.33x7.5 (`:192`); w/h<=0; fontSize (0,400]; tracking [-0.1,1]; lineHeight [0.8,3]; weight/align enums; #rrggbb; forbidden keys (`:102-134`) |
| V2 | Overlap (throw) | `layout.ts:274-282` `assertNoOverlaps`, called `:840` per scale | any positive-area pair throws; layout retries smaller scales |
| V3 | Estimated overflow (loop signal) | `layout.ts:264-271` `estimatedOverflowBlock`, called `:845` | ink-H or width exceeds box +0.005in -> next scale in `[1..0.13]` (`:811`) |
| V4 | critic `bounds` ERROR | `critic.ts:74-79` | block outside 13.33x7.5 (hardcoded, not the schema consts) |
| V5 | critic `overlap` ERROR | `critic.ts:136-145` | `rectsOverlap` pair |
| V6 | critic `contrast` ERROR | `critic.ts:126-134` | ratio < 4.5 (3.0 if >=18pt or >=14pt bold) |
| V7 | critic `overflow-risk` WARNING (estimate) | `critic.ts:83-93` | same V3 predicate; "confirm with critiqueRenderedOverflow" |
| V8 | critic `title-lines`/`body-measure` WARNING | `critic.ts:94-108` | title >2 lines; body line >60 chars (estimateWrap) |
| V9 | critic `widow-risk`/`rag-quality` WARNING | `critic.ts:110-124` via `optical.ts:102-129` | final line <=2 words; rag score <70 (title/number, multi-line) |
| V10 | critic `hierarchy` WARNING | `critic.ts:146-158` | title-min <= body-max pt |
| V11 | critic `unsupported-metric` WARNING | `critic.ts:159-167` | `number` role without `caption` containing `[:/]` |
| V12 | rendered `overflow-visible` ERROR | `critic.ts:408-444` via `detectRenderedOverflow` `:366-388` + `overflowTolerances` `:355-363` | scroll-client > (ratio-0.5)*fontSize v / 0.05*fontSize h, min 2px |
| V13 | rendered `overflow-unmeasured` WARNING | `critic.ts:436-442` | block id with no measurement |
| V14 | intentional-crop opt-in | `critic.ts:323-330,419-425` + `allowOverflow` provisional flag `:421` | allowlist or `allowOverflow:true`; never inferred |
| V15 | PPTX structure | `validate.ts:130-191` `validatePptxBytes`/`validatePptx` | 16:9 ratio +/-0.01 (`:148-156`); 13 forbidden-element regexes (`:50-67`); rect-only geometry (`:74-77`); container fill/painted-outline/effects rejected (`:79-87`); `a:xfrm` bounds tol 0.02in (`:89-114`); `noTxEdt` lock (`:118-120`); zero-shapes + editable-char floor (`:173-178`) |
| V16 | geometry/text/token parity | `visual-review.ts:113-130,154-168` | `geometrySignature` (round4 structural equiv); `textParityOk` (whitespace-normalized join); `findWorkflowTokens` (12 tokens) |
| V17 | narrative quality (advisory) | `quality.ts:104-336` `evaluateNarrative` | 14 codes (fabricated-metric, repeated-thesis, caption-missing, ...); `pass` = zero errors; never throws |
| V18 | optical O1/O2 + O5 proposals | `optical.ts:45-95,147-162` via `applyOpticalCorrections` `:175-194` | hang <== min(0.35em,0.12in); center-nudge <== min(0.25em,0.06in); O5 never applied |
| V19 | showcase JS geometry audit | `showcase/make-previews.js` (bounds tol 0.02 + pairwise overlap) | duplicate of V1/V2 in untested JS mirror |

Gaps: no min-*rendered*-size check (only `fitText` min shrink, `layout.ts:216-233`, and
schema fontSize>0); no PPTX-side wrap/clipping measurement (bounds only); no rotation/
layer checks (unrepresentable); V7/V12 can disagree by design (char-model vs DOM).

## (4) Typography metrics: APPROXIMATED, not measured

- Single source of truth is the char-width table `charWidthEm` (`layout.ts:80-91`):
  space 0.28, narrow set 0.35 (`layout.ts:63`; `1` deliberately excluded, `:64-66`),
  wide-latin 0.85, A-Z 0.7, digits 0.58, default 0.55, CJK-wide 1.0 (`isWideCjk`, `:69-77`),
  bold x1.06. `estimateWrap` (`:105-195`) does greedy wrap: CJK char-level, latin
  word-glued, hard-break for overflowing tokens, `\n` honored.
- Heights are line-box math (`heightIn = lines*em*lineHeight`, `:194`); `inkHeightIn`
  subtracts 0.3 line-boxes as estimated sub-cap excess ("cap ~0.7em EST", `layout.ts:204-213`).
  No real font metrics (ascent/descent/cap-height) are read anywhere.
- `fitText` (`layout.ts:216-233`) shrinks >=8%/step down to per-role `minFontSize`
  (`systems.ts:54-58,80-84,106-110,133-137`); residue is warned (V7), never force-fit.
- Font substitution: PPTX embeds ONE face — `fontFaceFor` = first fallback-chain entry,
  quotes stripped (`systems.ts:164-168`); HTML renders full stacks (`SlideView.tsx:3-19`,
  `visual-benchmark.ts:117-120`). If PowerPoint/LibreOffice substitutes, wrap reflows
  silently: listed unmeasured (`critic.ts:211`, `benchmark-90.ts:246`).
- Wrap parity HTML-vs-PPTX: HTML `pre-wrap + break-word + overflow:hidden`
  (`globals.css:413-418`, `critic.ts:530-531`); PPTX `wrap:true, margin:0`
  (`export.ts:33-34`). Divergence is the documented T11 gap (`critic.ts:210`).

## (5) Repair loop mechanics — YES, bounded; NOT in production path

`reviseDeck(narrative, systemId, opts)` (`critic.ts:238-298`):

- Budget: `maxAttempts ?? 3`, `seed ?? 42` (`critic.ts:239-240`); attempt 0 is
  `planArtDirection` rhythm balancing (`:244-247`).
- Per attempt: `layoutDeck` with plan -> `applyOpticalCorrections(measurable+heuristic)`
  -> `validateDeck` (re-validated every attempt, `:252`) -> `critiqueDeck`.
- Stopping: 0 errors -> stop (warnings never block, `:256-259`); max reached -> bounded
  stop (`:260-263`); unknown slide or no alternate candidate -> early stop (`:267-270,:290-293`).
- Fix operator (first error only, one change/attempt, `:265`): `unsupported-metric` ->
  demote to `metric-anchored` (`:271-279`); else first alternate candidate with same
  semantic type + system support + satisfied `requiresRoles` (`:281-289`).
- Provenance: `provenance: string[]`, exactly one line per attempt (`ReviseResult`,
  `:224-231`; `reports[]` parallel array). Content-preservation: "Fixes operate on the
  composition plan + layout/optical pipeline (content itself is never rewritten)"
  (`critic.ts:234-237`); determinism tested (`critic.test.ts:57-62`).
- crucial: production `planDeck`/`planDecksAll` run `layoutDeck` + `validateDeck` ONLY
  (`narrative.ts:876-889,899-960,966-1013`); `reviseDeck`/`critiqueDeck`/
  `applyOpticalCorrections` are invoked only by `benchmark-90.ts:119-134` (improved mode),
  `grammar-g1g3.test.ts:290`, and unit tests. `/api/export` recomputes layout and runs
  only `validatePptxBytes` (`apps/web/app/api/export/route.ts:69-95`).

## (6) HTML vs PPTX inspection parity — NO (asymmetric by design, honestly labeled)

- PPTX side: structural XML validation only (V15) + text extraction parity
  (`visual-benchmark.ts:36-48` vs `textParityOk`). No PPTX rendering, no wrap/overflow
  measurement in native output.
- HTML side: DOM-box overflow gate (V12-V14) over `renderMeasureHtml` mirror
  (`critic.ts:512-535`), which mirrors `SlideView.tsx:40-64` geometry math
  (%-position, cqw font-size) plus `data-block-id` (real SlideView has none; index
  fallback in `detectRenderedOverflow`, `critic.ts:372`, tested
  `overflow-gate.test.ts:82-89`).
- Policy: ADR-0007 "HTML preview is not PPTX proof... No benchmark claims pixel parity"
  (`docs/engineering/decisions/ADR-0007-html-not-proof.md:12-15`); gallery guide:
  "no pixel proof exists; evidence is structural" (`gallery/REVIEW-GUIDE.md:100`).
- Mirror-risk debt: FOUR parallel HTML renderers with no shared builder — canonical
  `SlideView.tsx`, `critic.ts:512 renderMeasureHtml` (self-flagged "MIRROR RISK",
  `:505-511`), `visual-benchmark.ts:50 previewHtml` (uses `.block`, no cqw parity check),
  `showcase/make-previews.js` + `showcase-filmstrip.js` (JS mirrors). Font stacks are
  triplicated (`SlideView.tsx:3-5`, `critic.ts:448-457`, `visual-benchmark.ts:117-120`).
- `frontend-slides/` is a user-owned ignored clone (`git log 37d31cb`), not repo surface.

## (7) Hybrid critic (image + layout + intent) insertion surface

Existing contracts to extend (all sync except PPTX validation):

1. Finding/repair contract: `CriticFinding` + `CriticReport` (`critic.ts:25-50`) — add
   checks (e.g. `render-divergence`, `substitution-detected`) and optionally a
   `source: 'static'|'dom'|'visual'` discriminator; `visionUnmeasured` (`:209-216`) is
   the explicit backlog list to shrink. `ReviseOptions/ReviseResult` (`:219-231`) carry
   budget/provenance; new fix operators slot into the first-error dispatch (`:264-293`).
2. Layout input: `Deck` (`schema.ts:76-79`) already carries bboxes+style; `Narrative`
   (`:95-99`) / `SlideIR` (`slide-ir.ts:45-54`, `refs/statuses/emphasis/notes`) carry
   intent — today `critiqueDeck` ignores narrative content (`critic.ts:171-173`), so an
   intent-aware check has a free parameter slot with no refactor.
3. Render input: `RenderedBlockMeasurement[]` (`critic.ts:310-321`) is the DOM-metric
   channel; extend `OVERFLOW_PROBE_JS` (`:469-495`) for more signals (computed
   font-family to detect substitution, `Range.getClientRects` for real wrap) without
   changing the `measureHtmlWithChrome` transport (`:561-598`, sync `spawnSync`).
4. Screenshot channel (to build): `renderMeasureHtml` (`:512-535`) already produces the
   capture-ready document (fixed 1280px stage, `:498-500`); add a
   `captureSlideScreenshot(html): PNG` beside `measureHtmlWithChrome` using the same
   `CHROME_CANDIDATES` resolution (`:546-553`) and `--screenshot` (precedent: manual
   command in `showcase-filmstrip.js:1-11`). No new dependency needed.
5. Equivalence helpers: `geometrySignature` (`visual-review.ts:113-130`) for before/after
   repair diffing; `textParityOk` (`:166-168`) as the content-preservation assertion for
   any visual repair step.
6. PPTX-side parity: `validatePptxBytes` (`validate.ts:130-181`, async) + `extractPptxTexts`
   pattern (`visual-benchmark.ts:36-48`) — a PPTX rasterizer (LibreOffice `--convert-to
   pdf` + render, or equivalent) would plug in here; T11 (`critic.ts:210`) names it.
7. Pipeline wiring gap to close: critic/repair must be inserted into `labelDeck`
   (`narrative.ts:876-889`) or `/api/export` (currently layout->export->validate only)
   for any hybrid verdict to gate production output; today only `benchmark-90.ts:119-134`
   exercises critique-then-export.

Unresolved (needs live run, out of read-only scope): measured Chrome `--dump-dom` vs
`--screenshot` latency/weight for the filmstrip path; whether design faces (Pretendard/
Noto/Archivo) resolve in the measuring Chrome (fallback changes DOM metrics silently).
