# Typodeck engineering docs

Authoritative revision: `docs/launch-readme` @ `e610736`
(= `integrate/release-readiness:b09865c` + 447-reference research overlay +
launch docs). Code is identical to `b09865c`; main (`ff68b70`) is older and
does not build (truncated `visual-benchmark.ts` in tsc scope).

- [Repository map](repository-map.md) — directories, packages, artifact classes
- [Architecture](architecture.md) — implemented pipeline, modules, contracts
- [Development](development.md) — install, build, test, CLI commands
- [Runtime](runtime.md) — server inventory + authoritative review instance
- [Implementation status](implementation-status.md) — feature inventory
- [Known issues](known-issues.md) — prioritized blockers
- [Decisions](decisions/README.md) — ADRs (accepted vs reconstruction)
- [History](history/development-timeline.md) — timeline + integration history

Related: root [README.md](../../README.md) (product),
[docs/EVIDENCE_TRACEABILITY.md](../EVIDENCE_TRACEABILITY.md) (claim sources),
[docs/RELEASE_READINESS.md](../RELEASE_READINESS.md) (launch blockers).
Older specs under `docs/` (`ARCHITECTURE.md`, `DESIGN_SYSTEM.md`,
`EVALUATION.md`, …) predate this branch in places; where they conflict with
code, code wins — see [known issues](known-issues.md).
