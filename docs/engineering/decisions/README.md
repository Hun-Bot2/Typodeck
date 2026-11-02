# Architecture Decision Records

Accepted = evidenced in code/tests/commits on `e610736`.
Reconstruction = rationale inferred from artifacts; owner confirmation
pending. No ADR changes policy by itself.

- [ADR-0001](ADR-0001-editable-pptx.md) — Typography-only native editable PPTX (Accepted)
- [ADR-0002](ADR-0002-slide-ir.md) — Slide Markdown + versioned Slide IR (Accepted)
- [ADR-0003](ADR-0003-purpose-presets.md) — Purpose-aware narrative presets (Accepted)
- [ADR-0004](ADR-0004-evidence-grounding.md) — Evidence grounding + provenance (Accepted)
- [ADR-0005](ADR-0005-bounded-fetch.md) — Bounded unauthenticated GitHub fetch (Accepted)
- [ADR-0006](ADR-0006-visual-systems.md) — Four systems, three production (Accepted)
- [ADR-0007](ADR-0007-html-not-proof.md) — HTML preview is not PPTX proof (Accepted)
- [ADR-0008](ADR-0008-skill-orchestrates.md) — Skill orchestrates Core (Accepted)
- [ADR-0009](ADR-0009-fallback-provider.md) — Deterministic fallback by default (Accepted)
- [ADR-0010](ADR-0010-research-separation.md) — Research overlay separate from production (Accepted, process)
- [ADR-0011](ADR-0011-editable-pptx.md) — Native editable PPTX as the only artifact (Reconstructed; overlaps 0001 with additional code evidence)
- [ADR-0012](ADR-0012-typography-first.md) — Typography-first constraints (Reconstructed)
- [ADR-0013](ADR-0013-shared-engine.md) — One shared engine for CLI, Studio, and Skill (Reconstructed)
- [ADR-0014](ADR-0014-two-modes.md) — Two input modes, one product (Reconstructed)
- [ADR-0015](ADR-0015-evidence-grounding.md) — Evidence grounding and provenance (Reconstructed; overlaps 0004)
- [ADR-0016](ADR-0016-slide-markdown-ir.md) — Slide Markdown and versioned Slide IR (Reconstructed; overlaps 0002)
- [ADR-0017](ADR-0017-system-registry.md) — Versioned visual-system registry (Reconstructed; overlaps 0006)
- [ADR-0018](ADR-0018-validation-repair.md) — Validation gates with advisory repair (Reconstructed)
- [ADR-0019](ADR-0019-fallback-distribution.md) — Zero-config distribution via fallback provider (Reconstructed; overlaps 0009)
- [ADR-0020](ADR-0020-visual-hierarchy-alignment.md) — Visual Hierarchy Alignment: intended importance vs perceived prominence (Proposed, Stage 2)
- [ADR-0021](ADR-0021-typed-relationships.md) — Typed spatial and semantic relationships, scoped minimal pair (Proposed, Stage 2)
- [ADR-0022](ADR-0022-rendered-text-fitting.md) — Rendered text fitting and geometry validation (Proposed, Stage 2)
- [ADR-0023](ADR-0023-generator-evaluator-separation.md) — Separation of generator and evaluator, extends ADR-0018 (Proposed, Stage 2)

## Numbering reconciliation (main-consolidation merge)

ADR-0001–0010 are the originals (launch consolidation). ADR-0011–0019 are
Agent E's reconstructions, written against baseline `b09865c` (which had no
ADR files) as 0001–0009 and renumbered at merge time to avoid collisions —
see `docs/DOCS_AUDIT.md` debt item 5, now resolved. Where topics overlap, the
original is authoritative and the reconstruction stands as additional code
evidence; a future pass may fold them.
