# Typodeck Paper Survey (English, PDF-verified)

> Purpose: evidence base for the Typodeck paper's claims of the form "we consulted these papers, and considered HCI aspects as follows."
> Status: verified English translations in `research/paper-survey/`, translated from the Korean working folder (`research/paper-survey-tmp/`) and checked claim-by-claim against the source PDFs. Planned for promotion to formal documents under `docs/` when the paper is written.
> Written: 2026-11-02. All figures below were cross-checked against the source PDFs (see `verification-matrix.md` and `source-manifest.md`); consult those files before citing any number.

## The 7 papers (existence confirmed)

| # | File | Paper | Venue | Key figures |
|---|------|-------|-------|-------------|
| 1 | [01-pptbench-2025.md](01-pptbench-2025.md) | PPTBench: Holistic Eval for PPT Layout/Design | arXiv 2025 (2512.02624) | 958 PPTX · 4,439 samples · 4 categories · 17 APIs |
| 2 | [02-umsi-visual-importance.md](02-umsi-visual-importance.md) | Predicting Visual Importance (UMSI+Imp1k) | UIST 2020 | Imp1k 1,000 designs · 6 classes · 87% importance-adjustment success |
| 3 | [03-slidecoder.md](03-slidecoder.md) | SlideCoder: Layout-aware RAG Hierarchical Generation | arXiv 2025 (venue unstated in source) | +40.5 pts · exec. rate +38pp · SCM r=0.873 |
| 4 | [04-pptagent-ppteval.md](04-pptagent-ppteval.md) | PPTAgent + PPTEval | EMNLP 2025 | Pearson 0.71 · κ 0.59 · success rate 95% |
| 5 | [05-lecslides-slideparser.md](05-lecslides-slideparser.md) | LecSlides-370K + SlideParser | ICCV 2025 | 25,542 lectures · 370,078 slides · 15 areas |
| 6 | [06-colpali.md](06-colpali.md) | ColPali + ViDoRe | ICLR 2025 | For retrieval use. Similarity ≠ quality |
| 7 | [07-pptbench-2026.md](07-pptbench-2026.md) | PPTBench: Coding Agents Visual Coding | arXiv 2026 (2609.29718) | 500 tasks · best 77.34 / median 24.38 · pass rate 31.7% |

Note: No. 1 (2025, Huang et al.) and No. 7 (2026, Wang et al.) share only a title and are entirely different studies.

## Common structure (§0–§8 per file)

- §0 Bibliographic information / §1 At-a-glance summary / §2 Research problem & background / §3 Key contributions
- §4 Methodology details / §5 Experimental results details / §6 Limitations & follow-ups
- §7 Typodeck relevance (direct connections · application ideas · caveats)
- §8 Citation points, 3 each (paper-ready claims + source evidence)

Exceptions: No. 6 uses §9 relevance · §10 citation points · §11 numeric index · §12 not-in-source list. In No. 3, §7.2-end · §7.3 · §8 were supplemented after a cut-off (marked as such; re-verified during translation).

## Derived documents

- [08-ADR-mapping.md](08-ADR-mapping.md): paper↔ADR mapping (forward · reverse · gaps/new-ADR candidates)
- [09-HCI-reinterpretation.md](09-HCI-reinterpretation.md): reinterpretation draft for the Typodeck paper (theses · per-paper reinterpretation · HCI considerations · experiment proposal)
- [verification-matrix.md](verification-matrix.md): per-claim verification verdicts (Wave-1) with source locations
- [source-manifest.md](source-manifest.md): verified bibliographic data, PDF hashes, page counts, licenses

## Source texts

- Nos. 1, 2, 3, 4, 6, 7: full arXiv HTML reads for the original survey (No. 4 arXiv:2501.03936, No. 6 arXiv:2407.01449); verification was then done against the PDFs in `sources/`. No. 4 was verified against the ACL EMNLP 2025 proceedings version.
- No. 5: ICCV Open Access PDF + pdftotext extraction, with GitHub/HF as supplements.
- HTML-conversion losses (table row labels, figure values) were repaired from the PDFs wherever possible and are marked `[CORRECTED ...]` inline; figure-only values with no body-text basis remain marked `[NOT IN SOURCE]`.
