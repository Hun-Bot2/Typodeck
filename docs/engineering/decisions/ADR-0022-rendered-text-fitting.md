# ADR-0022: Rendered text fitting and geometry validation

Status: Proposed (Stage 2, 2026-11-02). Requires Stage 3 implementation and
Stage 4 measurement before acceptance.

## Context

Typography is fully approximated (`research/architecture-audit/
03-critic-render-audit.md`): `charWidthEm` table + greedy `estimateWrap`
(`packages/core/src/layout.ts:80,105`), `EST 0.7em` cap height
(`:210`), no real font metrics anywhere, font substitution unmeasured
(`fontFaceFor`, `packages/core/src/systems.ts:165`). PPTX `wrap:true`
vs HTML `pre-wrap` diverge (T11 gap, `packages/core/src/export.ts:33`,
`packages/core/src/critic.ts:210`).

What exists: a DOM-only rendered gate — `critiqueRenderedOverflow`
(`critic.ts:408`) consumes headless-Chrome `--dump-dom` metrics via
`measureHtmlWithChrome` (`critic.ts:561`), with probe JS
(`OVERFLOW_PROBE_JS`, `critic.ts:469`). Zero screenshot plumbing (only
`--screenshot` mentions are manual commands in comments,
`apps/web/scripts/showcase-filmstrip.js:1`). Known honest gaps:
`visionUnmeasured[5]` (`critic.ts:209-216`), MIRROR RISK self-flag
(`critic.ts:505`), canonical `SlideView` has no `data-block-id` probe
(`apps/web/components/SlideView.tsx:40`). Rotation/layer/z/opacity are
unrepresentable (`schema.ts:25-48`; rotation omitted from
`ENGINE_CAPABILITIES`, `visual-systems.ts:44`).

## Research evidence (all Verified in `research/paper-survey/`)

- PPTBench 2026 (`07-pptbench-2026.md`): text is 53.0% of residual penalty;
  `unexpected_wrap` top item (5,723.9 pts / 1,864 cases / 0.577); root cause
  is the OOXML-declaration vs renderer-decision gap. Gated scoring (hard
  gates multiply detail scores) as the scoring shape.
- PPTBench 2025 (`01-pptbench-2025.md`): overlap/misalignment failure
  taxonomy for the finding vocabulary.
- ADR-0007 (HTML preview is not PPTX proof): content parity ≠ visual parity;
  no pixel-parity claims without a renderer in the loop.

## Interpretation (ours, not the papers')

Validate text in the actual rendered layout: extend the existing DOM probe
first (substitution + unintended-wrap signals), add screenshot plumbing
later as Stage-4 experiment inputs (B/D arms). Preserve intentional
cropping: a deliberate expressive crop (flagged via ADR-0020 intent
exceptions) must pass; accidental clipping and silent overflow must fail.

## Assumptions

- Headless Chrome stays the measuring renderer (already assumed by
  `measureHtmlWithChrome`; missing Chrome = "unmeasured", never "clean" —
  this rule is kept).
- LibreOffice/PowerPoint rendering is out of scope for automated gates;
  native-render questions get human-review artifacts, not claims.
- DOM metrics approximate the HTML mirror, not the PPTX (MIRROR RISK stays
  flagged until measured).

## Alternatives considered

1. Real font metrics via font parsing — rejected for now: cost; the DOM
   probe is closer to ground truth for the HTML mirror.
2. Screenshot-only critic now — rejected: zero plumbing exists; DOM metrics
   first, screenshots as experiment inputs.
3. In-repo PPTX rasterizer — rejected: none exists
   (`visual-benchmark.ts:220`); human review instead.

## Existing code that could satisfy the requirement

Extend, don't replace: `critiqueRenderedOverflow` (new finding kinds),
`OVERFLOW_PROBE_JS` (substitution/wrap signals), `reviseDeck` bounded loop
(consumes findings), `visionUnmeasured` (shrink with dated entries as items
get measured — acceptance tracks this list).

## Compatibility implications

- Additive only; the rendered gate stays opt-in where it is today.
- Missing-Chrome behavior unchanged ("unmeasured", never "clean").
- No schema changes required for probe-signal findings (existing
  `CriticFinding` + `suggestedFix`).

## Acceptance criteria

- Probe reports font-substitution + unintended-wrap signals per block.
- New deterministic findings flow into `CriticFinding` with severity and
  `suggestedFix`; intentional-crop exceptions pass with a test.
- `visionUnmeasured` shrinks with dated entries; nothing silently dropped.
- Existing loop budget kept (`reviseDeck`: maxAttempts 3, seed 42, stop on
  0 errors, content never rewritten).

## Decision

Proposed.
