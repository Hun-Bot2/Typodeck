# Merge Report — research/merged_registry

Date: 2026-10-30. Merger: synthesis child (agent-13). Method: `/tmp/merge_registry.py`
(handoff-evidence parsing + documented heuristics; no invented visuals).

## 1. Inputs

| Agent | Handoff label | Records | Target | Agent visual-verified | Status |
|---|---|---|---|---|---|
| A (Swiss/ITS) | prior result 6 | 100 (A-001..A-100) | 100 | 97 (+3 metadata-only) | complete |
| B (editorial) | prior result 4 | 70 (B-101..B-170) | 100 | 40 (+22 search-only, 8 inaccessible) | complete, SHORT 30 |
| C (postmodern/experimental) | prior result 2 | 100 (C-201..C-300) | 100 | 12 (+83 search-only, 5 inaccessible) | complete, visual-SHORT |
| D (digital/docs/data) | prior result 5 | 100 (D-301..D-400) | 100 | 42 (+58 search-only) | complete, visual-SHORT |
| E | prior result 3 | 0 | 100 | 0 | FAILED (model runtime error) |
| Audit/schema | prior result 1 | schema + validator | — | — | complete |

Agent-attested visual-verified total: **191 of 400** (A–D) / 500 (A–E).
Per-agent coverage notes (categories, source mix, confidence splits) are preserved in the
handoff files, not repeated here.

## 2. Enum remap (agent → schema)

Agent enum (verified/unverified/inaccessible) → schema enum:
verified → `inspected-reproduction` (web surrogate seen, not the artifact itself);
unverified → `secondary-description`; inaccessible → `not-inspected`.
Positional ID↔URL mapping corroborated by every named checkable item (A-002/A-012/A-014,
B-142..B-149, all 12 C verified + 5 C inaccessible match evidence order exactly).

## 3. Dedup + normalization

Normalized source_url (lowercase scheme/host, strip fragment + trailing slash, drop
default ports): **370 unique, 0 duplicates removed** (neither within- nor cross-agent).

## 4. Output + validation

- `research/merged_registry.jsonl` + `research/merged_registry.json` (same 370 records).
- `python3 research/validate.py research/merged_registry.jsonl --target 400` →
  `records: 370 … inspected-reproduction=149, not-inspected=13,
  secondary-description=208 … OK: all records valid`, exit 0.
- Same result for the `.json` file. (Validate each file separately: validating the
  directory would double-count both files as duplicates.)
- Merged-registry inspected total: **149** (D's 42 unattributable from handoff, held at
  `secondary-description`; E missing). Validator reports SHORT vs 400 — expected.

## 5. Honesty rules applied

- designer=`unknown`, year=null, composition/hierarchy/grid/whitespace=`unknown` on all
  370 records (originals not carried in handoffs); titles are slug-derived working labels.
- Category: per-agent default (A swiss-international, B editorial, else other) + explicit
  path-token overrides (poster/exhibition/type-specimen/book-cover/kinetic-type/…) +
  D web-type host set. Source_type: article/book path tokens, then host map, else secondary.
- Confidence: inspected-reproduction→medium, secondary-description→limited,
  not-inspected→low (per-record agent confidences unattributable).

## 6. Gaps / unresolved

1. Isolated `research/agent-{A,B,C,D}.jsonl` full records never visible here; merged
   records are stubs pending a full-field re-merge.
2. D's 42 verified identities unknown; merged verified understates truth by 42.
3. Agent E's 100-record slice entirely absent (no topic list carried in the failure).
4. B short 30 records vs target (agent chose honesty over padding).
5. C/D visual-verified shortfalls (12/100, 42/100) — mostly bot-protection/JS-gating.
6. B/C/D agents never saw `research/schema.json` (absent in their checkouts); their field
   shapes were reconstructed from the handoff description, so a future full-field merge
   must still run `validate.py` and normalize `visual_inspection_status` values.
