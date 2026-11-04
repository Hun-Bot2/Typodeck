# NOTICE — research/ licensing (read before redistributing)

Typodeck's MIT license (repo root `LICENSE`) covers Typodeck's own code and
documentation. It does NOT automatically cover third-party materials stored
under `research/`.

- `research/slide-reconstruction/`: contains slide captures used under
Creative Commons licenses (CC-BY 4.0, CC BY-SA 4.0, CC BY-SA 3.0) with
per-source attribution, URLs, and verification status in
`research/slide-reconstruction/sources.json`. Reuse must comply with those
licenses (attribution; ShareAlike where applicable). Link-only cases
(FOSDEM) store no third-party pixels and must stay that way.
- `research/merged_registry.*`, `research/agent-*.jsonl`, `research/typography/`:
the 447-reference corpus has NO license metadata (see `DOCS_AUDIT.md` and the
reconstruction report). Entries are research notes, many secondary
descriptions. Do NOT treat them as licensed for redistribution and do NOT
promote them into production templates on license assumptions.
- Benchmark and evaluation outputs under `evals/` and `output/` generated
during this project are project artifacts; inputs drawn from the above
retain their own terms.

When installing or distributing the Typodeck Skill, only
`plugins/typodeck/skills/typodeck/` is needed; research assets need not
(and by default do not) ship with it.
