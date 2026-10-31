# Known issues (prioritized)

Revision: `e610736`. Severity = impact on a human trusting review output.

## P0 — none open

No known crash, data-loss, or secret-leak path on this revision.

## P1 — review-blocking discrepancies

1. **Stale showcase receipt.** `showcase/manifest.md` Deck 1 claims 7 files /
   38 claims / 29 verified for `sindresorhus/is@e9c026c`; two live runs on
   current code produce 56 claims / 47 verified. Do not cite Deck 1 receipt
   numbers. Fix: re-run `showcase/run-deck.js` and refresh the manifest.
2. **Human evidence absent.** Benchmark-90 protocol unexecuted, zero ballots;
   visual-benchmark `decisions.json` all PENDING; no pixel proof that HTML
   previews match PPTX rendering. Any quality-win / 90+ / preference claim
   is unsupported until a human completes these artifacts.

## P2 — stale / conflicting docs

3. **Old specs predate the tree.** `docs/DESIGN_SYSTEM.md` (3 systems; tree
   ships experimental 4th), `docs/ARCHITECTURE.md` (8-module),
   `docs/EVALUATION.md` (24-run), `docs/NARRATIVE_AUDIT.md` (75/75 baseline),
   PRD "no speaker notes" scope line (code passes notes through; nothing
   authors them). This `docs/engineering/` set is authoritative instead.
4. **Superseded counts elsewhere.** Comms-eval figures (S2 180/216, S7 p95
   1.8 s) and non-270 suite sizes belong to other revisions. Citable here:
   270/270 tests; S2 144/180 (80.0%); S7 p95 204 ms (n=24, mixed cache).
5. **Broken doc refs.** `STUDIO-AUDIT.md` cites `audit/` (renamed
   `audit-studio/`); `PROVENANCE.md` cites absolute `/tmp` paths; benchmark
   docs cite gitignored `output/`. Fix or drop before launch.

## P3 — verification gaps

6. Unauthenticated GitHub fetch only; no token path exercised end to end.
7. `/api/{catalog,evidence,markdown}` + `/api/export` live POST: code-read,
   not HTTP-probed in this pass.
8. PPTX `core.xml` author fields unverified (`app.xml` clean).
9. Transitive dependency licenses unaudited (direct deps MIT-compatible).
10. CLI arg-parsing paths (`make-deck`, `generate-samples`) covered by
    smoke runs, not unit tests.

## Explicitly not issues

- `main@ff68b70` failing to compile: expected; superseded by `b09865c`.
- `document` system experimental: by design (ADR-0006).
- Missing 53 research references: deliberately unfilled (honesty rule).
