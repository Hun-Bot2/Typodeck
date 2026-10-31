# Merge Report — research/merged_registry (full-field rebuild)

Date: 2026-10-30. Merger: full-field recovery (`research/merge_full.py`,
stdlib-only, deterministic, re-runnable). This report supersedes the stub-era
report (preserved at `research/history/stub-era/merge_report.md`); the stub
registry snapshot is at `research/history/stub-era/merged_registry.jsonl`.

## 1. Inputs

| Agent | File | Records | Target | Agent visual-verified | Agent search-checked | Agent inaccessible |
|---|---|---|---|---|---|---|
| A (Swiss/ITS) | `agent-A.full.jsonl` | 100 (A-001..A-100) | 100 | 97 | 3 | 0 |
| B (editorial/books) | `agent-B.full.jsonl` | 70 (B-101..B-170) | 100 | 40 | 22 | 8 |
| C (postmodern/experimental) | `agent-C.full.jsonl` | 100 (C-201..C-300) | 100 | 12 | 83 | 5 |
| D (digital/docs/data) | `agent-D.full.jsonl` | 100 (D-301..D-400) | 100 | 42 | 58 | 0 |
| E (East Asian typography) | `agent-E.full.jsonl` | 77 (E-401..E-477) | 100 | 44 | 24 | 9 |
| Total | | **447** | 500 | **235** | **190** | **22** |

Original agent files are byte-identical inputs; the merger only reads them.
Missing 53 vs the 500 target (B short 30, E short 23) are **not filled** —
no fabricated or weakly sourced records were added.

## 2. Enum remaps (agent → schema)

- `visual_inspection_status`: verified → `inspected-reproduction` (web
  surrogate seen; no agent inspected a physical artifact, so no record claims
  `inspected-primary`); unverified → `secondary-description` (search-checked /
  metadata-only); inaccessible → `not-inspected`. Agent-A's finer-grained
  `inspection_detail` (21× inspected-primary, 30× reproduction,
  48× secondary-description, 1× not-inspected) disagrees with its own
  verified/unverified enum record-by-record and its notes describe fetched web
  pages, so the uniform enum remap above governs; every `inspection_detail`
  value is preserved verbatim in `research/merge_provenance.json`.
- `evidence_confidence`: agent claim kept for inspected records, capped
  otherwise so search-checked records are never equivalent to inspected ones:
  secondary-description caps at medium, not-inspected caps at low.
  Capped (11): B-142, B-143, B-144, B-145, B-146, B-148, B-149 (medium→low),
  C-205, C-241, C-245, C-248 (high→low).
- `slide_adaptability.rating`: B–E use high/medium/low verbatim; A maps
  adaptable→high, partial→medium, reference-only→low (sense confirmed from the
  agents' own notes, e.g. A-005 adaptable "transfer well", A-010
  reference-only "counter-example").

## 3. Category remap (agent → schema)

Schema enum has no experimental / CJK / information-design values, so
unmappable records honestly use `other` with the original category preserved
in the provenance sidecar (and shown in the gallery).

| Agent | Rule | Result |
|---|---|---|
| A | poster→poster; exhibition→exhibition; typeface→type-specimen; identity→environmental (SBB signage systems); all source-page kinds (article/review/biography/archive/book/platform/film/reference/research/journal) → swiss-international (sources *about* Swiss/ITS works) | poster 23, exhibition 11, type-specimen 4, environmental 2, swiss-international 60 |
| B | typographic-posters→poster; magazines/books/publishing/newspapers→editorial | poster 13, editorial 57 |
| C | postmodern/expressive-poster→poster; postmodern-editorial→editorial; kinetic-motion→kinetic-type; digital-type by title token (magazine→editorial, 11; font/specimen/typeface/dead-history/digital-fonts→type-specimen, 7; interviews/reviews/profiles→other, 13); remaining experimental/deconstruction/theory→other | poster 15, editorial 14, kinetic-type 7, type-specimen 7, other 57 |
| D | digital typography / technical documentation / developer-oriented→web-type; data typography→editorial for publisher/archive books (+ Storytelling with Data token), else other (project/about pages); information design→other | web-type 82, editorial 3, other 15 |
| E | all script/region categories (korean/japanese/east-asian/mixed-script/multilingual)→other | other 77 |

Merged totals: editorial 74, environmental 2, exhibition 11, kinetic-type 7,
other 149, poster 51, swiss-international 60, type-specimen 11, web-type 82.

## 4. Source-type remap (agent → schema)

museum→museum; gallery→museum (exhibition venues); archive→archive;
library→archive; publisher→book; magazine/design-press/press→article;
foundry→specimen; studio/designer-studio/designer→portfolio (makers' own
sites); university/platform/authoritative-platform→secondary;
standards-body/open-source-project/association/festival→other;
company→specimen for font titles (JetBrains Mono, Atkinson Hyperlegible,
IBM Plex token rule), else other (design-system/docs pages). No source URL
matched video/talk patterns, so those enum values are unused. Originals kept
in the sidecar.

## 5. Field carry-through (full-field, no stubs)

- `composition_analysis.summary` + `primitives`: verbatim (A/B `reading_order`
  lists joined with ` -> `). 2 records (C-268, C-269) have no agent summary;
  theirs is assembled from their own hierarchy/alignment/grid fields with a
  ` / `-joined, explicitly labeled prefix and `summary_reconstructed: true`
  in the sidecar — no outside claims added.
- `hierarchy` / `grid_strategy` / `whitespace_strategy`: verbatim from the
  agent's composition subfields (`unknown` only where the agent recorded
  nothing: C-268/269 whitespace).
- `typographic_techniques`: the agent's `text_treatment` carried as one entry
  (`unknown` only for C-268/269, which record none).
- `required_engine_capabilities`: top-level list, else the nested
  composition_analysis list (agents A and D nest it). Never empty.
- `alignment` / `rhythm` / `scale` / full `text_treatment` / `reading_order`
  originals: schema has no slot, so they are preserved verbatim per record in
  `merge_provenance.json → composition_verbatim` (and surfaced in the gallery
  detail view) — carried, not dropped.
- `context` / `publication` / `notes` / `check_method` /
  `verification_method` / `visual_notes` / `inspection_detail`: preserved
  verbatim in the sidecar per record.
- `originality_notes`: `unknown` for all 447 (no agent recorded it; never
  guessed — this is a genuine gap, see §8).
- `limitations`: honest statement built only from the agent's own
  reproducibility flag (yes/no/partial/bool variants across agents) plus its
  capability list.
- E-agent hedges (e.g. "not pixel-inspected", "inferred from processed text")
  are preserved in the sidecar and shown in the gallery so reviewers can weigh
  inspected vs search-checked evidence themselves.

## 6. Dedup + normalization

Canonical source_url (lowercase scheme/host, strip fragment + trailing slash,
drop default ports): **447 unique, 0 duplicates, 0 merge conflicts** — the
"all 447 unique" hypothesis was verified, not assumed. (Resolution policy, had
any collided: better-inspected record wins, ties break by file order A–E, every
collision logged.)

## 7. Outputs + validation

- `research/merged_registry.jsonl` + `research/merged_registry.json` (same 447
  records, id-sorted) + `research/merge_provenance.json` (447 entries).
- `python3 research/merge_full.py` →
  `recovered: 447 (A=100, B=70, C=100, D=100, E=77)` · `accepted: 447` ·
  `deduplicated (dropped): 0` · `rejected (violations): 0`, exit 0.
- `python3 research/validate.py research/merged_registry.jsonl` → `records:
  447 … inspected-reproduction=235, not-inspected=22,
  secondary-description=190 … OK: all records valid`, exit 0. Same for the
  `.json` file. (Validate each file separately: validating both together
  double-counts every record as a duplicate.)
- Record counts: recovered 447 · accepted 447 · deduplicated 0 · rejected 0 ·
  gallery-visible 447 (see reconciliation report for the gallery figure).

## 8. Gaps / unresolved (honest)

1. 53 references missing vs the 500 target (B −30, E −23): agents stopped
   rather than pad. Left missing per instruction; not fabricated.
2. Only 235 of 447 are visually inspected (C: 12/100, D: 42/100 — mostly
   bot-protection/JS-gating per agent notes); 190 are search-checked and 22
   inaccessible. Cluster/candidate analysis weights evidence accordingly.
3. `originality_notes` is `unknown` on all records (never recorded upstream).
4. No schema category fits experimental or East Asian typography (149 `other`);
   the gallery exposes the original per-agent category + agent filter so the
   G5/G7 clusters stay browsable.
5. C-268/C-269 summaries are labeled reconstructions from their own fields.
6. D's former "42 unattributable verified" gap is closed (full D records now
   carried); the former E-missing gap is closed (77 E records carried).
