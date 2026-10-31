# ADR-0007: HTML preview is not PPTX proof

Status: Accepted. Evidence: `skills/typodeck/revision.md` (handoff
honesty block), gallery + review-app "HTML render" labels,
`gallery/REVIEW-GUIDE.md` ("no pixel proof exists").

## Context

Two renderers (HTML preview, PPTX export) can diverge; reviewers must not
mistake a screenshot for native-rendering evidence.

## Decision

Every inline slide render is labeled an HTML render. Quality judgments
require opening the actual `.pptx`. No benchmark claims pixel parity.

## Consequences

Review UI carries permanent disclaimers; benchmark-90 scores structure
and human preference separately, never conflating them.
