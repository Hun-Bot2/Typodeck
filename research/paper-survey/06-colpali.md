# ColPali: Full Paper Summary (for Typodeck)

> English translation of `research/paper-survey-tmp/06-colpali.md` (sections 0–12 preserved).
> Verified against the PDF at `research/paper-survey/sources/06-colpali.pdf`
> (arXiv 2407.01449v6, ICLR 2025 conference version, 26 pages, 8,260,302 bytes,
> sha256 `852ec724f3d48316265611579f4c556a14fea24f29360b5929d02e4604662631`).
> Marker legend: [SPECULATION], [COMPILER NOTE], [NOT IN SOURCE], [SOURCE-BASED],
> [CORRECTED: ...], [UNRESOLVED: ...].

## 0. Bibliographic Information

- Title: ColPali: Efficient Document Retrieval with Vision Language Models
- Authors: Manuel Faysse, Hugues Sibille, Tony Wu, Bilel Omrani, Gautier Viaud, Céline Hudelot, Pierre Colombo
  - Byline marks: ∗ on Faysse, Sibille, and Wu sharing one "Equal Contribution" footnote [CORRECTED: HTML rendering suggested only Faysse carried the note; the PDF marks all three first authors with ∗ for equal contribution | PDF p.1].
  - Email (as stated in source): manuel.faysse@centralesupelec.fr
  - Affiliations (as stated in source): Illuin Technology, CentraleSupélec Paris-Saclay, ETH Zürich (Sibille), Equall.ai (Colombo).
- Venue/year:
  - arXiv: 2407.01449v6, cs.IR, 28 February 2025 (PDF header).
  - ICLR 2025: confirmed — every PDF page carries the header "Published as a conference paper at ICLR 2025" [CORRECTED: the HTML conversion lacked the string "ICLR"; the PDF verifies the venue | PDF p.1].
- Links:
  - arXiv abstract: `/abs/2407.01449v6`; PDF `/pdf/2407.01449v6`.
  - DOI: [NOT IN SOURCE].
  - Unified code/models/data/benchmark: https://hf.co/vidore
  - HuggingFace organization: https://huggingface.co/vidore
  - ViDoRe leaderboard: https://huggingface.co/spaces/vidore/vidore-leaderboard
  - Training dataset: https://huggingface.co/datasets/vidore/colpali_train_set
  - Example SigLIP checkpoint used: https://huggingface.co/google/siglip-so400m-patch14-384
  - License: training data, model checkpoints (adapters), entire codebase, and evaluation benchmark released under MIT licenses (Reproducibility Statement).
- Source scope:
  - Main text: Abstract, 1 Introduction, 2 Problem Formulation & Related Work, 3 ViDoRe, 4 ColPali, 5 Results, 6 Ablation, 7 Conclusions, Reproducibility, Acknowledgements, References.
  - Appendices: A Benchmark Datasets, B Implementation details, C Additional results, D More similarity maps, E Model glossary, F Examples.
  - The Korean survey was written after reading the full delegated HTML-conversion text (1548 lines, ~106KB); this translation re-verifies every substantial number against the PDF.
  - The HTML conversion had dropped some table row/column labels and figure values; those locations are repaired from the PDF below and marked [CORRECTED: ...].

## 1. Summary at a Glance (5 sentences)

1. The bottleneck in modern document retrieval is not the embedding model itself but the long, brittle text-extraction pipeline of PDF parsing, OCR, layout detection, chunking, and captioning.
2. To measure this, the authors built ViDoRe, a page-level retrieval benchmark (5 academic + 5 practical tasks; English/French; text/table/figure/infographic).
3. They then propose ColPali, a VLM-based retriever (PaliGemma-3B extension with ColBERT-style late interaction) that produces multi-vector embeddings directly from document page images.
4. ColPali reaches 81.3 mean nDCG@5 on ViDoRe, far ahead of the strongest text pipeline (Unstructured+Captioning+BGE-M3, 67.0) and fine-tuned SigLIP (58.6).
5. At the same time it reduces offline indexing to a single forward pass (raising indexing throughput), offers interpretability via token–patch similarity heatmaps, and releases code, data, and models.

## 2. Research Problem and Background

### 2.1 Problem definition ([SOURCE-BASED] §2)

- A retrieval system is defined as a relevance score s(q,d) between a query q and a document d.
- In this paper a "document" is an individual page: the atomic retrieval unit is the page.
- Reflecting practical industrial (RAG, search-engine) constraints, the system is decomposed into two phases:
  - (1) Offline indexing: building the document index.
  - (2) Online querying: matching a query against the index; low latency is essential.
- Three properties an efficient document retrieval system should exhibit:
  - R1: strong retrieval performance (standard retrieval metrics).
  - R2: fast online querying (average latency).
  - R3: high indexing throughput (pages embeddable per unit time).
- R1/R2/R3 form the skeleton of the §3 evaluation and the §5 results.

### 2.2 The problem of visually rich documents

- Documents are visually rich structures conveying information not only through text but also figures, page layout, tables, even fonts (Abstract, §1).
- Yet modern retrieval systems index pages mostly from extracted textual information.
- Hence they fail to exploit key visual cues efficiently, limiting capability in practical applications such as RAG (Abstract).

### 2.3 Limits of the text-extraction pipeline ([SOURCE-BASED])

- Source §1 enumerates the standard PDF indexing steps as:
  1. Extract words with a PDF parser or OCR.
  2. Segment page objects (paragraphs/titles/tables/figures/headers) with a document layout detection model.
  3. Define a chunking strategy grouping text passages with semantic coherence.
  4. In modern setups, optionally add a captioning step describing visually rich elements in natural language suited to embedding models.
- The key empirical claim of source §1:
  - On visually rich document retrieval, optimizing the ingestion pipeline yields much better performance than optimizing the text embedding model (citing Table 2).
- Factual statements from source §3.2:
  - Unstructured alone is a strong baseline, but integrating visual elements (OCR or captioning) is needed for performance.
  - Both strategies incur substantial latency/resource costs (§5.2).
  - PDF parsing pipelines can be very lengthy, worse with OCR/captioning (Figure 2).
- In short, the essence of the problem is not "weak text embeddings" but "visual information is lost/distorted during text extraction, and restoring it makes the pipeline long and expensive."

### 2.4 Related-work landscape ([SOURCE-BASED] §2.1, §2.2, Appendix E)

- Statistical methods:
  - TF-IDF, BM25 remain widely used for simplicity and efficiency.
- Neural retrievers:
  - Bi-encoder: map documents and queries independently, then match fast via cosine distance.
  - Cross-encoder: concatenate query+document into one input with full attention. Can be slightly better but needs |D| online encoding passes, hence inefficient.
- Late interaction (ColBERT):
  - Pre-compute/index one embedding per document token.
  - Interact with query token embeddings at runtime.
  - Combines rich query–document term interaction with bi-encoder-style offline computation and fast matching.
  - The direct methodological parent of ColPali.
- The evaluation gap:
  - Text embedding benchmarks (BEIR, MTEB, etc.) focus on embedding-model capability.
  - Much industrial performance gain comes from the upstream ingestion stage.
  - Table/chart retrieval work is limited to task-specific methods repurposing QA datasets.
  - Authors' claim: no document retrieval benchmark evaluated practical end-to-end settings across document types/topics using both textual and visual features.
- Integrating visual features:
  - Contrastive VLMs (CLIP/SigLIP-style): align disjoint visual/text encoders with contrastive loss. Some OCR ability exists, but the visual component is often not optimized for text understanding.
  - FILIP: extends late interaction to cross-modal VLMs with max-similarity operations between text tokens and image patches.
  - Visually rich document understanding: encode text tokens jointly with visual/layout features (DocFormer, LayoutLMv3, etc.).
  - Recent VLMs: feed image patch vectors of a contrastively trained ViT into LLM input embeddings, concatenated with text token embeddings.
  - PaliGemma-3B:
    - Projects SigLIP-So400m/14 patch embeddings into the Gemma-2B text vector space.
    - Chosen for relatively small size, public fine-tuned checkpoints across resolutions/tasks, and promising document-understanding benchmark performance.
    - Notable property: the text model is fine-tuned with full-block attention on the prefix (instruction text + image tokens).
    - Appendix E: 3B parameters; SigLIP vision encoder + Gemma-2B decoder + multimodal linear projection. Segments an image into a fixed number of ViT tokens prepended to an optional text prompt. Operates as a Prefix-LM so image tokens can access the task query. Four training stages: unimodal pretraining, extended multimodal pretraining, short high-resolution pretraining, task-specific fine-tuning.
  - VLMs are strong at VQA/captioning/document understanding but not optimized for retrieval. ColPali fills this gap.

## 3. Key Contributions

1. Design and release of ViDoRe (Visual Document Retrieval Benchmark):
   - A comprehensive benchmark dedicated to page-level document retrieval.
   - 5 academic + 5 practical tasks; English/French; medical/business/scientific/administrative domains; text/figure/infographic/table modalities.
   - Public leaderboard.
2. Empirical diagnosis of current systems:
   - Same-condition evaluation of Unstructured-based industrial pipelines (text-only, +OCR, +captioning) with BM25/BGE-M3, plus contrastive VLMs.
   - Quantifies the visual-information bottleneck and the indexing-latency problem.
3. The ColPali concept and model:
   - "Retrieval in Vision Space": embeddings generated directly from document page images.
   - Extends PaliGemma-3B into a ColBERT-style multi-vector representation generator.
   - Late-interaction matching between query text tokens and document image patch tokens.
4. Full release of training/evaluation resources:
   - 118,695 query–page training pairs, model checkpoints (adapters), codebase, and benchmark under MIT licenses.
   - Leaderboard, detailed results, and training configuration for reproducibility.
5. Joint demonstration of performance + efficiency + interpretability:
   - Large gains over the strongest prior pipeline on ViDoRe.
   - Simplified/accelerated indexing, low online query latency, plus practical analyses (token pooling, similarity maps).
6. Systematic ablations on transfer/generalization/scalability:
   - Isolates patch count, backbone VLM, vision training, query-augmentation tokens, loss, domain adaptation, and out-of-domain generalization.
   - Shows better generative VLMs yield better visual retrievers (ColQwen2-VL).

## 4. Methodology Details

### 4.1 The ViDoRe benchmark ([SOURCE-BASED] §3, Appendices A, F)

#### 4.1.1 Design goals and evaluation unit

- Goal: comprehensively evaluate the ability to match queries to relevant documents at page level.
- Composed of orthogonal subtasks:
  - Modality: text, figures, infographics, tables.
  - Topic domain: medical, business, scientific, administrative.
  - Language: English, French.
  - Difficulty: varying complexity so both weak and strong systems produce signal.
- Candidate document count limited per task:
  - Reason: captioning-based approaches can take dozens of seconds per page, so even complex systems must be evaluable in reasonable time.
  - The authors claim this design evaluates without sacrificing quality.
- A reference training set is provided for trainable retrieval systems.

#### 4.1.2 Task composition and scale ([SOURCE-BASED] Table 1, PDF p.4)

| Split | Dataset | Language | # Queries | # Documents | Description (source) |
|---|---|---|---:|---:|---|
| Academic | DocVQA | English | 500 | 500 | Scanned documents from UCSF Industry |
| Academic | InfoVQA | English | 500 | 500 | Infographics scrapped from the web |
| Academic | TAT-DQA | English | 1600 | 1600 | High-quality financial reports |
| Academic | arXivQA | English | 500 | 500 | Scientific Figures from arXiv |
| Academic | TabFQuAD | French | 210 | 210 | Tables scrapped from the web |
| Practical | Energy | English | 100 | 1000 | Documents about energy |
| Practical | Healthcare | English | 100 | 1000 | Medical documents |
| Practical | Government | English | 100 | 1000 | Administrative documents |
| Practical | AI | English | 100 | 1000 | Scientific documents related to AI |
| Practical | Shift Project | French | 100 | 1000 | Environmental reports |

- Academic totals (from table): 3310 queries, 3310 documents.
- Practical totals (from table): 500 queries, 5000 documents.
- Grand total (from table, compiler arithmetic): 3810 queries, 8310 documents.
- Practical tasks have a 10:1 document/query ratio — a larger retrieval pool than academic tasks (1:1).

#### 4.1.3 Academic task construction ([SOURCE-BASED] §3.1, Appendix A.1)

- Widely used VQA benchmarks repurposed as retrieval tasks:
  - From each page-question-answer triplet, the question becomes the query and the linked page the gold document.
- Per-dataset source descriptions:
  - DocVQA: images from the UCSF Industry Documents Library; manually annotated questions/answers.
  - InfoVQA: collected from the internet with the search query "infographics"; manually annotated questions/answers.
  - TAT-DQA: large-scale Document VQA built on public real-world financial reports; rich tables/text with numerical reasoning focus; manually annotated by finance experts.
  - arXivQA: VQA on figures from arXiv papers; questions synthetically generated with GPT-4 Vision.
  - TabFQuAD: for TableQA evaluation in realistic industry settings; tables from French industrial PDFs; existing human-annotated queries augmented with additional queries generated by this paper's method; released with this paper.
- The source describes academic datasets as single-modality-focused (DocVQA/InfoVQA/arXivQA lineage) or varied visually rich documents (TAT-DQA).

#### 4.1.4 Practical task construction ([SOURCE-BASED] §3.1, Appendix A.2, F)

- Purpose: go beyond repurposed QA datasets toward realistic industrial retrieval evaluation (e.g., RAG).
- Procedure:
  1. Collect publicly accessible PDFs.
  2. Generate page-related queries with Claude-3 Sonnet (a high-quality proprietary VLM).
  3. Extensively filter for quality/relevance by human annotators.
- Scale:
  - 1000 document pages collected per topic.
  - 100 queries per topic.
  - Corpus topics deliberately specific to maximize syntactic proximity between documents, making retrieval harder.
- Answers generated alongside:
  - Purposes: (1) ground queries and improve quality; (2) provide resources for future work.
- Web crawler (Appendix A.2):
  - Seeded with a user-defined query (e.g., artificial intelligence).
  - GPT-3.5 Turbo brainstorms related topics/subtopics.
  - The same model generates diverse search queries per subtopic.
  - A pool of parallel workers collects relevant documents from Google Search rankings via SerpAPI with a PDF-only filetype filter.
  - File hashes stored in a shared Bloom filter for deduplication.
  - Unique files downloaded and stored in SQLite with metadata.
- Data mix:
  - Four seeds: energy, government reports, healthcare industry, artificial intelligence.
  - About 100 documents collected per seed.
  - Manually curated toward real retrieval-model use cases and visually rich pages.
  - Documents containing private information removed.
  - Collection counts for Shift Project (French environmental reports) are [NOT IN SOURCE] in the appendix; only Table 1's 1000 pages / 100 queries is confirmed.
- Query generation:
  - At most 3 questions per image, for efficiency and API-call limits.
  - 10,000 images randomly sampled per theme from collected documents, then passed to Claude-3 Sonnet.
  - The full expert prompt is published in Appendix A.2 (paraphrased): act as a Multimodal RAG assistant; generate questions a user unaware of the corpus would ask to retrieve information; each question relevant to the page subject, neither too specific nor too general, with the answer found in the page; output at most 3 question+answer-list pairs in a fixed JSON dictionary and nothing else; return an empty list if no question can be asked.
- Human validation:
  - Every synthetic ViDoRe query manually validated.
  - Criteria: quality, query relevance, and consistency with the benchmark's goal of evaluating retrieval in practical industrial settings.
  - Document-pair queries randomly assigned to 4 volunteer annotators, who removed queries failing the criteria.
  - Annotators were also instructed to flag documents with PII or content unsuited to an academic benchmark; zero flags were raised in the whole process.
  - 100 queries collected per topic this way.
  - Annotators were colleagues/collaborators of the authors volunteering help; each spent approximately 3 hours filtering the larger query set down to 100 high-quality queries per topic.
- Appendix F example queries:
  - Energy: tax-deferred account/product types; 25-year total savings of a Durham PV system under net-metering flat rate; 2030 California peak electricity demand forecast.
  - AI: common TAII outcome areas by age group; what the robot monitored to activate the blower motor/blinker; the key PDP-architecture approach.
  - Healthcare: PZT chemical formula; government entities in US public healthcare financing; what AVPU means for assessing consciousness of a seriously ill child.
  - Government: EPA mandates under the Pollution Prevention Act; KPMG Hazem Hassan's strategy; trust signal score of the consumer-industry best-in-class archetype.
  - Shift (French): 2050 SAF import capacity vs. actual consumption graph reading; share of Kazakhstan oil production from offshore fields; top countries by cumulative 2020 crude discoveries.

#### 4.1.5 Evaluation metrics ([SOURCE-BASED] §3.1, §5, Appendix C)

- R1 performance metrics:
  - Standard retrieval metrics (nDCG, Recall@K, MRR).
  - The paper's main metric is nDCG@5.
  - Complete result sets released on HuggingFace.
  - Appendix C.1 separately reports a Recall@1 table (Table 6).
- Practical requirements R2/R3:
  - Query latency (R2) and indexing throughput (R3) considered jointly.
- Text-only metrics are not computed for benchmarks with only visual elements (footnotes of Tables 2, 6, 7).

### 4.2 Current-system evaluation setup ([SOURCE-BASED] §3.2, Appendices B.4, B.5)

#### 4.2.1 The Unstructured pipeline

- The off-the-shelf Unstructured tool at the highest resolution settings represents the standard industrial RAG pipeline.
- What Unstructured orchestrates:
  - Deep-learning vision models for title/document layout detection (YOLOX cited).
  - OCR engine (Tesseract cited) for text extraction from non-native PDFs.
  - Specialized methods/models for table detection and reconstruction.
  - A chunking strategy (by-title) leveraging detected document structure to preserve section boundaries when concatenating text.
- Simplest configuration (text-only):
  - Keeps textual elements only.
  - Figures/images/tables treated as noise and filtered out.

#### 4.2.2 Visual-element integration variants

- Unstructured + OCR:
  - Tables/charts/images run through an OCR engine.
  - Processed by Unstructured, then chunked independently.
- Unstructured + Captioning:
  - A fully fledged captioning strategy built.
  - Visual elements fed to Claude-3 Sonnet for highly detailed textual descriptions.
  - Table/figure captioning prompt (Appendix B.5, paraphrased): act as a document-analysis assistant; give a detailed qualitative (not quantitative) summary of the table/figure in at most 3000 characters; answer with the caption only.
  - Appendix B.5 includes full example captions for Energy (hourly generation stacked bar chart) and Government (System of Record table).
- Both strategies aim to integrate visual elements into the retrieval pipeline but incur significant latency/resource costs.

#### 4.2.3 Embeddings and page scoring

- Text chunk embeddings:
  - Okapi BM25 (the de facto standard sparse statistical retrieval method).
  - BGE-M3 (multilingual dense encoder, SOTA in its size category).
- Chunks embedded and scored independently.
- Page-level scores obtained by max-pooling over the page's chunk scores.
- The authors state they empirically validated max-pooling over sub-page chunks as more effective than concatenating all page chunks before page-wise embedding.

#### 4.2.4 Contrastive VLM baselines

- Strongest then-available vision-language embedding models evaluated:
  - Jina CLIP.
  - Nomic Embed Vision.
  - SigLIP-So400m/14.
- Their ViDoRe performance lags behind (§3.2 results summary, quantified in Table 2).

#### 4.2.5 Conclusions of the current-system assessment (§3.2 Results)

- Performance:
  - Best results combine the Unstructured parser with visual information (captioning or OCR on visual elements).
  - Little difference between BM25 and BGE-M3 — interpreted as evidence of the visual information bottleneck.
  - Contrastive VLMs lag behind.
- Latency:
  - Indexing latencies (Figure 2; the text labels them R2 though by the §2 definition they are R3 — an apparent label swap, verified present in the PDF | PDF p.5) show PDF parsing pipelines can be very lengthy.
  - Worse when OCR/captioning is included.
  - Runtime querying latencies (labeled R3 in text though R2 by the §2 definition — likewise swapped in the PDF | PDF p.5) are very good for all evaluated systems.
  - ≤ 22 ms on an NVIDIA L4, thanks to fast query encoding and cosine similarity matching.

### 4.3 ColPali architecture ([SOURCE-BASED] §4.1)

#### 4.3.1 Core idea

- Motivated by recent VLMs' strong document understanding, adapted for retrieval.
- Key concept:
  - Leverage the alignment between text-token and image-token output embeddings acquired during multimodal fine-tuning.
- ColPali:
  - A PaliGemma-3B extension.
  - Capable of generating ColBERT-style multi-vector representations of text and images.
- Why PaliGemma-3B:
  - Small size.
  - Many released checkpoints fine-tuned for different resolutions/tasks.
  - Promising performance on document understanding benchmarks.
- Additional design:
  - A projection layer maps each language-model output token embedding (text or image) into a D=128 vector space.
  - D=128 matches the ColBERT paper.
  - Purpose: keep lightweight bag-of-embedding representations.

#### 4.3.2 Late-interaction matching equation

- Multi-vector representations of query q and document d:
  - Eq ∈ R^{Nq×D}: query multi-vector.
  - Ed ∈ R^{Nd×D}: document page multi-vector.
  - Common embedding space R^D.
  - Nq: number of query vectors.
  - Nd: number of document page embedding vectors.
- Late interaction operator LI(q,d):
  - For each query vector, take the maximum dot product against the Nd document embedding vectors.
  - Sum over all query vectors.
- Equation (source Eq. 1, PDF p.6):
  - LI(q,d) = Σ_{i∈[1,Nq]} max_{j∈[1,Nd]} <Eq(i) | Ed(j)>
  - where <·|·> is the dot product.
- A document page has one embedding per image patch token; at inference all text-token to image-patch interactions are computed.

#### 4.3.3 Contrastive loss

- The late interaction operation is fully differentiable, enabling backpropagation.
- Batch {qk, dk}_{k∈[1,b]}:
  - b query–page pairs.
  - For each k, dk is the document matching qk.
- Following ColBERT, in-batch contrastive loss L defined with:
  - Positive score: sk+ = LI(qk, dk).
  - Hardest in-batch negative score: sk− = max_{l, l≠k} LI(qk, dl).
  - I.e., only the single highest-scoring other document in the batch is used as the negative.
- Softmax cross-entropy restated in the numerically stable softplus form:
  - softplus(x) = log(1+exp(x)).
  - L = −(1/b) Σ_k log[exp(sk+)/(exp(sk+)+exp(sk−))]
  - = (1/b) Σ_k log(1+exp(sk− − sk+)).
- This is source Eq. 2 (PDF p.6).
- Appendix/ablations compare against a contrastive loss using all in-batch negatives (§6).

### 4.4 Training ([SOURCE-BASED] §4.2, Appendices A.3, B.1, B.2)

#### 4.4.1 Training data

- 118,695 query–page pairs total.
  - Train splits of openly available academic datasets: 63%.
  - Synthetic dataset of web-crawled PDF pages with VLM-generated (Claude-3 Sonnet) pseudo-questions: 37%.
- Split details (Appendix A.3 Table 3, PDF p.18):

| Split | Size | Language | Domain (source) |
|---|---:|---|---|
| DocVQA | 39463 | English | Scanned documents from UCSF Industry |
| InfoVQA | 10074 | English | Infographics scrapped from the web |
| TATDQA | 13251 | English | High-quality financial reports |
| arXivQA | 10000 | English | Scientific Scientific Figures from arXiv ("Scientific" duplicated in source) |
| Scrapped PDFs | 45940 | English | Varied PDFs from 3885 distinct URL domains |
| TOTAL | 118695 | English-only | Mixed |

- Academic subtotal (compiler arithmetic): 72788 pairs = 61.32% of the total, vs. 63% in the main text — a ~1.7pp gap with no explanation in the source. Verified against the PDF: the discrepancy is genuine, not a conversion artifact.
- Synthetic subtotal: 45940 pairs = 38.70% of the total, vs. 37% in the main text — same caveat.
- The training set is fully English by design:
  - Purpose: study zero-shot generalization to non-English languages.
  - A footnote notes multilingual data may be present in the Gemma-2B pretraining corpus and potentially in PaliGemma-3B multimodal training.
- Contamination prevention:
  - Explicitly verified that no multi-page PDF document is used both in ViDoRe and in the train set.
  - Appendix A.3: a PDF document cannot have pages in both train and test, and no duplicate documents within a split.
- Validation set:
  - 2% of all samples, for hyperparameter tuning.
- Release:
  - Training dataset openly released for reproducibility and future research.

#### 4.4.2 Training configuration

- Epochs: 1 epoch on the train set.
- Precision: bfloat16 unless specified otherwise.
- Parameter-efficient fine-tuning:
  - LoRA, α=32, r=32.
  - Trains the language model's transformer layers plus the final randomly initialized projection layer.
  - Vision encoder frozen by default; a vision-unfrozen variant is separately ablated.
- Optimizer: paged_adamw_8bit.
- Hardware/parallelism:
  - 8-GPU setup, data parallelism.
- Learning rate:
  - 5e-5 with linear decay and 2.5% warmup steps.
  - Appendix B.2: tuned on the validation split (2% of train); bi-encoder methods are more sensitive to LR variation than late-interaction models; 5e-5 is best for all models.
- Batch:
  - Total batch b=32, no accumulation.
  - Per-device batch hard to scale past b=4 due to long sequences; multi-GPU training simulates larger batches.
- Query augmentation:
  - 5 `<unused0>` tokens appended to query tokens, as in ColBERT.
  - Serves as a soft, differentiable query expansion/re-weighting mechanism.
- Codebase:
  - Written in PyTorch.
  - HuggingFace tooling for model implementations and trainers.
- LoRA rank/α experiments:
  - No particular improvement observed past r=α=32.

## 5. Experimental Results

### 5.1 Main performance Table 2 (nDCG@5, [SOURCE-BASED] §5.1, PDF p.7)

- Column order: ArxivQ, DocQ, InfoQ, TabF, TATQ, Shift, AI, Energy, Gov., Health., Avg.
- Values below are transcribed row by row from source Table 2. Arrows are the source's own vs.-previous-row delta notation. Every value re-verified against the PDF.

#### 5.1.1 Unstructured text-only

- BM25:
  - ArxivQ -, DocQ 34.1, InfoQ -, TabF -, TATQ 44.0, Shift 59.6, AI 90.4, Energy 78.3, Gov. 78.8, Health. 82.6, Avg. -.
- BGE-M3:
  - ArxivQ -, DocQ 28.4(↓5.7), InfoQ -, TabF -, TATQ 36.1(↓7.9), Shift 68.5(↑8.9), AI 88.4(↓2.0), Energy 76.8(↓1.5), Gov. 77.7(↓1.1), Health. 84.6(↑2.0), Avg. -.

#### 5.1.2 Unstructured + OCR

- BM25:
  - 31.6, 36.8, 62.9, 46.5, 62.7, 64.3, 92.8, 85.9, 83.9, 87.2, Avg. 65.5.
- BGE-M3:
  - 31.4(↓0.2), 25.7(↓11.1), 60.1(↓2.8), 70.8(↑24.3), 50.5(↓12.2), 73.2(↑8.9), 90.2(↓2.6), 83.6(↓2.3), 84.9(↑1.0), 91.1(↑3.9), Avg. 66.1(↑0.6).

#### 5.1.3 Unstructured + Captioning

- BM25:
  - 40.1, 38.4, 70.0, 35.4, 61.5, 60.9, 88.0, 84.7, 82.7, 89.2, Avg. 65.1.
- BGE-M3:
  - 35.7(↓4.4), 32.9(↓5.4), 71.9(↑1.9), 69.1(↑33.7), 43.8(↓17.7), 73.1(↑12.2), 88.8(↑0.8), 83.3(↓1.4), 80.4(↓2.3), 91.3(↑2.1), Avg. 67.0(↑1.9).
  - This row is the best text-pipeline average (67.0).

#### 5.1.4 Contrastive VLMs

- Jina-CLIP:
  - 25.4, 11.9, 35.5, 20.2, 3.3, 3.8, 15.2, 19.7, 21.4, 20.8, Avg. 17.7.
- Nomic-vision:
  - 17.1, 10.7, 30.1, 16.3, 2.7, 1.1, 12.9, 10.9, 11.4, 15.7, Avg. 12.9.
- SigLIP (Vanilla):
  - 43.2, 30.3, 64.1, 58.1, 26.2, 18.7, 62.5, 65.7, 66.1, 79.1, Avg. 51.4.

#### 5.1.5 Authors' models (Ours)

- SigLIP (Vanilla) restated:
  - Same as above. Avg. 51.4.
- BiSigLIP (+fine-tuning):
  - 58.5(↑15.3), 32.9(↑2.6), 70.5(↑6.4), 62.7(↑4.6), 30.5(↑4.3), 26.5(↑7.8), 74.3(↑11.8), 73.7(↑8.0), 74.2(↑8.1), 82.3(↑3.2), Avg. 58.6(↑7.2).
- BiPali (+LLM):
  - 56.5, 30.0, 67.4, 76.9, 33.4, 43.7, 71.2, 61.9, 73.8, 73.6, Avg. 58.8(↑0.2).
  - The source's delta notation shows doubled signs such as `↓-2.0` [CORRECTED: this double-sign notation is present in the PDF itself, not an HTML artifact | PDF p.7 / Table 2; also in Table 6]. Absolute values above are unaffected; interpret signs with care.
- ColPali (+Late Inter.):
  - 79.1(↑22.6), 54.4(↑24.5), 81.8(↑14.4), 83.9(↑7.0), 65.8(↑32.4), 73.2(↑29.5), 96.2(↑25.0), 91.0(↑29.1), 92.7(↑18.9), 94.4(↑20.8), Avg. 81.3(↑22.5).
  - Best on every task. +14.3 over the best text pipeline (67.0); +22.7 over BiSigLIP (58.6); +22.5 over BiPali (58.8).

### 5.2 Three factors behind the performance ([SOURCE-BASED] §5.1)

- The authors summarize performance as achieved iteratively through three factors:
  1. A carefully crafted task-specific dataset.
  2. Pairing a pretrained LLM with a vision model to better leverage text semantics from the image.
  3. Multi-vector embeddings instead of a single vector, better capturing the vast visual information in a document.
- BiSigLIP interpretation:
  - SigLIP is a strong vision-language bi-encoder pretrained on billions of English WebLI image–text pairs.
  - Further fine-tuning its textual component on the document-oriented dataset yields across-the-board improvements.
  - Particularly pronounced on figure retrieval (ArxivQA) and table retrieval (TabFQuAD).
- BiPali interpretation:
  - In the PaliGemma architecture, SigLIP patch embeddings are fed through the text language model to obtain LLM-contextualized output patch embeddings.
  - Patch-count footnote: 1024 patches for PaliGemma's vision encoder vs. 729 for the standalone SigLIP model.
  - This aligns image token representations with text token embeddings in the LLM embedding space, augmenting vision embeddings with the language model's text understanding.
  - Average-pooling these representations into a single dense vector creates the PaliGemma bi-encoder (BiPali).
  - After training-set fine-tuning it performs slightly worse in English than tuned BiSigLIP.
  - Hypothesized reason: unlike SigLIP, original PaliGemma is trained for next-token prediction, not contrastive matching; the 119K-image contrastive fine-tuning is 5 orders of magnitude smaller than SigLIP's original contrastive training.
  - Notable improvements on French tasks instead: BiPali's LLM (Gemma 2B) aids multilingual text understanding — remarkable given the train set contains no non-English samples.
- ColPali interpretation:
  - Feeding image patch embeddings through the language model natively maps them into a latent space similar to the textual (query) input.
  - This enables the ColBERT strategy: one embedding per image patch token, computing text-token to image-patch interactions at inference.
  - A step-change improvement over BiPali.
  - Largely outperforms the strong Unstructured+captioning baselines and all text-image embedding models.
  - The gap is particularly stark on visually complex tasks (infographics InfoVQA, figures ArxivQA, tables TabFQuAD).
  - Yet text-centric documents are also better retrieved by ColPali across all domains/languages — the authors' conclusion is that it is the overall best document retrieval model.

### 5.3 Negative results ([SOURCE-BASED] §5.1, Appendix C.2 Table 7)

- ColSigLIP:
  - A late-interaction variant of BiSigLIP was trained but obtained abysmal performance.
  - Hypothesized cause: SigLIP pretraining uses only a pooled latent representation in the contrastive loss, so individual patch/token embedding representations are not optimized.
  - Table 7 values (nDCG@5):
    - ColSigLIP (Original): 2.6, 2.2, 2.3, 5.7, 1.8, 1.0, 2.6, 4.1, 1.4, 1.5, Avg. 2.5.
    - ColSigLIP (PaliGemma): 3.1, 3.0, 5.1, 6.2, 2.5, 1.0, 3.4, 3.4, 2.3, 2.2, Avg. 3.2.
- BiSigLIPPaliGemma:
  - A variant taking image representations from the SigLIP model further updated by PaliGemma fine-tuning, and text representations from PaliGemma's text model.
  - After training-set fine-tuning, severely inferior to SigLIP Vanilla (which simply encodes with SigLIP's original text/vision components).
  - Suggests a logical misalignment between SigLIP embeddings and Gemma embeddings after PaliGemma training.
  - Table 7 values:
    - BiSigLIP (PaliGemma): 18.5, 14.6, 33.4, 39.5, 16.1, 5.2, 27.6, 32.6, 36.6, 35.7, Avg. 26.0.
    - About half of Vanilla's 51.4.

### 5.4 Recall@1 results (Appendix C.1 Table 6, PDF p.21)

- Table 6 evaluates the same systems with Recall@1 (column order as Table 2; averages verified):
  - Unstructured+OCR BM25 Avg. 55.9.
  - Unstructured+OCR BGE-M3 Avg. 57.5.
  - Unstructured+Captioning BM25 Avg. 55.9.
  - Unstructured+Captioning BGE-M3 Avg. 57.2.
  - Jina-CLIP Avg. 12.6.
  - Nomic-vision Avg. 8.8.
  - SigLIP Vanilla Avg. 39.7.
  - BiSigLIP Avg. 47.1.
  - BiPali Avg. 45.6.
  - ColPali: 72.4, 45.6, 74.6, 75.4, 53.1, 55.0, 93.0, 85.0, 85.0, 88.0, Avg. 72.7.
- Same ranking structure as nDCG@5. ColPali dominates on Recall@1 as well.

### 5.5 Latency and memory ([SOURCE-BASED] §5.2, Appendices B.3, B.4)

#### 5.5.1 Online querying (R2)

- BGE encoding: about 22 ms for 15 tokens.
- ColPali language-model query encoding: about 30 ms.
  - Online batch size 1, averaged over 1000 queries.
- At small corpus sizes the late interaction operation adds marginal overhead:
  - ≈ 1 ms per 1000 pages in the corpus.
  - Cosine similarity between bi-encoder vectors is even faster.
- Optimized late-interaction engines (PLAID, etc.) are said to scale to millions of documents with reduced latency degradation.
- Cited: Santhanam et al. 2022 (PLAID), Lee et al. 2023.

#### 5.5.2 Offline indexing (R3)

- Standard bi-encoder retrieval:
  - One vector embedding per chunk; easy to store, fast to compute.
  - But preprocessing PDFs into chunks (layout detection, OCR, chunking) is the most time-consuming part.
  - Captioning for multimodal handling exacerbates it further.
- ColPali:
  - Encodes directly from the page image representation.
  - Although the model is larger than standard retrieval encoders, skipping preprocessing gives large speedups at indexing.
  - Pages embedded end-to-end in a single forward pass.
  - VRAM usage depends exclusively on the fixed sequence length (patches per image), enabling efficient batching that fully leverages hardware acceleration.
  - Benefits from LLM efficiency improvements such as Flash Attention.
- Measurement conditions (footnote):
  - NVIDIA L4 GPU.
  - Averaged on 100 pages.
  - ColPali batch of 4 pages, bi-encoder text-chunk batch of 8.
  - 2.1 chunks per page on average.
- Appendix B.4 additional conditions:
  - Same g2-standard-8 GCP VM + NVIDIA L4.
  - Documents embedded with Unstructured highest settings + captioning (§3.2).
  - SigLIP/ColPali in bfloat16.
  - Average per-page latency over 1000 randomly chosen documents across all ViDoRe test splits. (Note: the §5.2 footnote says 100 pages while Appendix B.4 says 1000 documents — both figures are as stated in the source.)
  - BGE-M3 batch 8, SigLIP/ColPali batch 4.
- Table 5 values [CORRECTED: row labels and column structure lost in the HTML conversion are restored from the PDF | PDF p.19 / Table 5]:

| Indexing operation | Unstructured | SigLIP | ColPali |
|---|---:|---:|---:|
| Layout detection | 0.81 | NA | NA |
| OCR | 2.67 | NA | NA |
| Captioning | 3.71 | NA | NA |
| Page encoding | 0.03 | 0.12 | 0.39 |
| Total | 7.22 | 0.12 | 0.39 |

  - Unit: seconds of per-page latency. Caption: SigLIP and ColPali are much faster than Unstructured because they skip layout detection, OCR, and captioning.
  - Consistent with Figure 2 (PDF Parser 7.22s, SigLIP 0.12s, ColPali 0.39s | PDF p.5).

#### 5.5.3 Storage footprint

- ColPali stores one vector per image patch.
- Includes 6 extra text tokens "Describe the image" concatenated to the image patches.
- Each PaliGemma vector projected to a D=128 low-dimensional space for efficiency.
- Resulting memory: 257.5 KB per page (Appendix B.3).
- Authors' claim:
  - Naive ColBERT indexing memory can be drastically improved via compression/clustering.
  - Cited: Santhanam et al. 2022, Clavié et al. 2024.
- Table 4 values [CORRECTED: model-name/unit mapping lost in the HTML conversion is restored from the PDF | PDF p.18 / Table 4]:

| Model | Embedding size (KB) |
|---|---:|
| BGE-M3 | 8.60 |
| BM25 (dense emb.) | 3.00 |
| BM25 (sparse emb.) | 1.56 ± 0.51 |
| ColPali (float16) | 257.5 |

  - Caption: embedding-size comparison on the ViDoRe DocVQA test set; mean±std for sparse embeddings; BGE-M3/BM25 generally use 2–5 vectors per page.
  - Main-text statement: ColPali's embedding size is an order of magnitude larger than BM25 and two orders larger than BGE-M3; centroid cluster pooling or binary quantization can cut it by two orders of magnitude with minimal performance hit, making storage competitive.

#### 5.5.4 Token pooling

- Method: token pooling from Clavié et al. 2024; a CRUDE-compliant (document addition/deletion friendly) multi-vector embedding reduction.
- For ColPali, many patches (e.g., white background) share redundant information; pooling them reduces embedding count.
- Figure 3 (left): retrieval performance under hierarchical mean token pooling on image embeddings.
- Pool factor 3:
  - Total vector count reduced by 66.7%.
  - 97.8% of original performance retained.
- The Shift dataset is a clear outlier:
  - Composed of the most text-dense documents.
  - Information-dense documents contain fewer redundant patches and may degrade more under pooling.

### 5.6 Interpretability ([SOURCE-BASED] §5.3, Figure 3, Appendix D)

- Method:
  - Superimpose the late-interaction heatmap on the original image.
  - For each query term, visualize the most salient image patches.
  - Yields interpretable insight into model focus zones.
- Figure 3 (right) example (Energy; verified by viewing PDF p.9):
  - For the query token `< hour>` [CORRECTED: the PDF text layer renders "< hour>"; the survey's `<_hour>` spelling came from the HTML conversion | PDF p.9], both the words "hourly" and "hours" show high similarity.
  - Interpreted as demonstrating strong OCR capability.
  - Notable focus also on a non-trivial visual feature: the x-axis representing hours.
  - The heatmap figure shows an hourly energy-generation stacked bar chart with the query about which hour had the highest overall generation in 2019.
- Appendix D further example (Shift; verified by viewing PDF p.22):
  - For the token `< Kazakhstan>`, high similarity on all patches containing the word "Kazakhstan."
  - Patches around "Kashagan" (an offshore oil field in Kazakhstan) also show high similarity, suggesting world-knowledge capability.
  - The figure shows a French production-history document with the query asking which share of Kazakhstan's oil production comes from offshore fields.
- White-patch observation:
  - Both Figure 3 and Figure 6 show some white patches with high similarity.
  - Surprising at first glance, since white patches should carry no meaningful signal from the original image.
  - Authors' hypothesis: these patch vectors play a role similar to ViT registers (Darcet et al. 2023) — repurposed for internal computation, storing global information from the whole image.
- Further visualizations in Appendix D; dataset examples in Appendix F.

## 6. Ablation Details ([SOURCE-BASED] §6, Appendix C.2 Table 7, PDF pp.9–10, 21)

- Default reporting unit: mean nDCG@5 delta over all ViDoRe tasks.
- Details in Table 7. Reference ColPali (Reference: 448) averages 81.3.
- Table 7 transcriptions below use the same column order as Table 2. All rows re-verified against the PDF.

### 6.1 Model size vs. image patch count

- Half-patch PaliGemma variant (512):
  - Clear degradation vs. the 1024-patch ColPali (−24.8 nDCG@5).
  - Much lower memory usage.
  - The matching Table 7 row appears to be `ColPali (224)`:
    - 71.0, 37.4, 62.3, 65.7, 28.6, 20.4, 65.7, 66.8, 73.9, 73.0, Avg. 56.5.
    - −24.8 vs. the 81.3 reference, matching the main-text delta exactly.
    - [UNRESOLVED: the source never defines what "224" (or "448" in the reference row name) denotes — plausibly input resolution — while the main text calls the variant the 512-patch model. The name mismatch stands; only the delta identifies them as the same variant.]
- Idefics2-8B alternative:
  - A similar-architecture VLM: Mistral-7B language backbone + SigLIP vision encoder + perceiver resampler.
  - Main differences from PaliGemma: language model size (2B vs. 7B) and image patch count (512–2048 for PaliGemma; 64 post-resampling for Idefics2, with an option of 4 sub-image crops of 64 tokens each for 320 total).
  - Interpretation: better language models enable more efficient representations of image embeddings.
  - ColIdefics2 with 64 patches largely outperforms ColPali with 512 patches (+20.1).
  - But ColIdefics2 (64) remains less accurate than ColPali (1024) (−4.7), while about twice as slow in training and inference latency.
  - Table 7 `ColIdefics2 (64)`:
    - 73.6, 48.0, 82.4, 81.6, 63.0, 57.2, 95.5, 86.9, 86.6, 91.2, Avg. 76.6.
    - −4.7 vs. reference, matching the main text.
  - Authors' conclusion: tradeoffs exist between performance (R1), online querying latency (R2), offline indexation (R3), and index memory size.

### 6.2 Unfreezing the vision component

- A variant also backpropagating through and updating the vision encoder and projection layer.
- Slight degradation (−0.7 nDCG@5).
- Explicitly noted that conclusions may change at larger training-data scales.
- Table 7 `ColPali (Vision Trained)`:
  - 78.8, 53.9, 81.3, 81.7, 64.4, 70.6, 95.3, 91.7, 93.5, 94.7, Avg. 80.6.
  - −0.7 vs. reference.

### 6.3 Query-augmentation token effect (main-text/table mismatch — resolved from PDF)

- Main-text statement (PDF p.9):
  - ColBERT's special tokens are concatenated to the query as soft query-augmentation buffers.
  - Training without these tokens shows no significant difference on English benchmarks.
  - But French-task performance "seems to improve (+9.8 nDCG@G on Shift, +6.3 nDCG@5 on TabFQuAD, Table 7)" (with an `nDCG@G` typo on the Shift unit — verified present in the PDF).
- Table 7 `ColPali (No Q.A. Tokens)` actual values:
  - 80.4, 53.2, 82.4, 77.4, 65.7, 63.4, 97.0, 89.9, 93.6, 92.4, Avg. 79.6.
  - Compared against reference (79.1, 54.4, 81.8, 83.9, 65.8, 73.2, 96.2, 91.0, 92.7, 94.4, 81.3):
    - Shift: 63.4 vs. 73.2 = −9.8.
    - TabF: 77.4 vs. 83.9 = −6.5 (opposite sign to the main text's +6.3, and 0.2 off in magnitude).
    - Average: −1.7.
- [COMPILER NOTE] Resolution [CORRECTED: the main-text direction is flipped; the "improvement" magnitudes are the reference model's advantage with the tokens kept, i.e., removing the tokens costs −9.8 on Shift and −6.5 on TabFQuAD per Table 7 | PDF p.9 / Table 7]: the correct reading is that the query-augmentation tokens *help* French tasks (+9.8 Shift / +6.5 TabF for keeping them; the prose's +6.3 differs from the table by 0.2). Trust the table, not the prose direction. The Korean survey flagged this as an unresolved sign contradiction; the PDF confirms the contradiction is real and the table is authoritative.

### 6.4 Pairwise CE loss effect

- Training with an in-batch negative contrastive loss instead of the pairwise CE loss (hardest negative only) slightly degrades performance (−1.6).
- Table 7 `ColPali (No Pairwise)`:
  - 79.0, 53.0, 82.1, 85.3, 63.2, 66.2, 94.9, 88.9, 92.7, 92.1, Avg. 79.7.
  - −1.6 vs. reference.
  - Only TabF (85.3 vs. 83.9) rises; the rest mostly fall.

### 6.5 Adapting to new tasks (domain fine-tuning)

- Authors' claim: unlike complex multi-step retrieval pipelines, ColPali trains end-to-end, directly optimizing the downstream retrieval task — greatly facilitating fine-tuning for specialized domains, multilingual retrieval, or difficult visual elements.
- Demonstration:
  - 1552 samples of French tables + associated queries added to the train set — the only French data in it; all other examples unchanged.
  - nDCG@5 +2.6 and Recall@1 +5 on TabFQuAD, with no degradation elsewhere (+0.4 overall).
- Table 7 `ColPali (+TabFQuAD training)`:
  - 77.6, 54.7, 82.6, 86.5, 65.4, 73.9, 94.8, 92.4, 94.2, 94.8, Avg. 81.7.
  - TabF 86.5 vs. 83.9 = +2.6; average 81.7 vs. 81.3 = +0.4. Matches the main text.
  - The supporting table for Recall@1 +5 is [NOT IN SOURCE] (Table 6 covers base models only).

### 6.6 Better VLMs make better retrievers (ColQwen2-VL)

- Motivation: whether improved VLMs' generative-task gains transfer after ColPali-style adaptation for retrieval.
- Method: train the then-recent SOTA 2B generative VLM Qwen2-VL 2B with the same data and training strategy, obtaining ColQwen2-VL.
- Image patches limited to 768 to approximately match ColPali's memory (slightly fewer than ColPali's 1024).
- Result: +5.3 nDCG@5 over ColPali — interpreted as a clear correlation between generative benchmark performance and retrieval metrics.
- Table 7 `ColQwen2 (768)`:
  - 86.4, 56.2, 89.8, 88.7, 75.2, 85.7, 98.8, 94.8, 93.6, 97.3, Avg. 86.6.
  - +5.3 vs. reference.

### 6.7 Out-of-domain generalization (DocMatix)

- Motivation:
  - Some ViDoRe datasets (academic tasks incl. DocVQA) have train splits integrated into the ColPali train set — standard practice for embedding models.
  - ColPali is also strong on unseen distributions (e.g., French data), but performance under fully disjoint training is of interest.
- Method:
  - Train solely on the recent large-scale synthetically annotated visual document QA dataset DocMatix, subsampled to a comparably sized train set.
- Results:
  - Minor ViDoRe drop (−2.2 nDCG@5).
  - Still over 12 points above the closest baseline.
  - Claimed to show good generalization beyond the training distribution and that results are not unreasonably boosted relative to baselines (BGE-M3) that cannot be fine-tuned on the same data.
  - Footnote reason: training BGE-M3 on inference-like data would require running complex extraction pipelines (including external proprietary captioning) over 100K+ documents — too costly and slow. Unnecessary for training vision-based models.
- Table 7 `ColPali (Docmatix)`:
  - 71.3, 48.0, 80.0, 83.9, 59.1, 73.8, 95.7, 93.8, 92.5, 93.1, Avg. 79.1.
  - −2.2 vs. reference.
  - +12.1 over the closest baseline (67.0), matching the main text's "over 12 points."

## 7. Conclusions and Future Work ([SOURCE-BASED] §7)

- Conclusions:
  - Introduced ViDoRe, evaluating document retrieval systems in realistic settings with visually complex documents.
  - Demonstrated that current retrieval pipelines and contrastive VLMs struggle to efficiently exploit visual information in documents, yielding suboptimal performance.
  - Presented ColPali, a novel retrieval method creating high-quality multi-vector embeddings purely from visual document features via VLMs.
  - Largely outperforms the best existing document retrieval methods, with faster corpus indexing and low querying latencies maintained — circumventing many pain points of modern document retrieval applications.
  - Publicly released ViDoRe, data, codebase, and all models/baselines to drive industrial adoption and future work.
- Future Work:
  - Performance gains via better data/backbones/training strategies.
  - Long-term vision: combine visual retrieval with visually grounded query answering into end-to-end RAG operating purely from image features.
  - Supported by concurrent work (Ma et al. 2024) showing VLM promise for visual QA; may eventually become a new industrial standard for document processing.
  - On this path reliability is key: confidence estimation for information retrieval could be central to abstention mechanisms (Gisserot-Boukhlef et al. 2024 cited) — particularly relevant given late interaction's information-rich multi-vector scoring.
  - Expanding benchmarking to more languages/modalities/tasks is a crucial direction (Jiang et al. 2024 cited).

## 8. Limitations and Follow-ups

### 8.1 Limits stated in (or directly derivable from) the paper ([SOURCE-BASED])

- There is no standalone Limitations section (verified: the paper runs §7 Conclusions → Reproducibility → Acknowledgements → References). The following derive directly from Future Work / Reproducibility / main-text statements only:
  - Language/modality/task coverage gaps:
    - ViDoRe covers English/French, 10 tasks, limited domains/modalities. Benchmark expansion is a stated crucial future direction (§7).
  - Training-data bias:
    - Train set fully English by design. French zero-shot shown, but generalization to other languages unevaluated.
    - Partial overlap with academic train distributions exists. Mitigated by the DocMatix disjoint experiment, but not a fully distribution-independent evaluation.
  - Reliability/uncertainty gaps:
    - Confidence estimation/abstention named as a key future piece of the end-to-end visual RAG vision. The current model has no built-in confidence/abstention mechanism.
  - Storage overhead:
    - 257.5 KB/page is 1–2 orders of magnitude larger than BM25/BGE-M3. Compression/clustering/quantization competitiveness is claimed but this paper measures no ViDoRe table for those optimized variants.
  - Scope of latency evaluation:
    - Online query 30 ms vs. 22 ms, ~1 ms/1000 pages late interaction, etc., are small-corpus figures. Million-scale behavior rests on cited external optimization engines.
    - Table 5/Figure 2 details were lost in the HTML conversion, hindering per-operation attribution — now repaired from the PDF (see §5.5.2), resolving this caveat.
  - Query-augmentation token interpretation:
    - The §6 prose/Table 7 sign mismatch (§6.3) is confirmed real in the PDF; the table (−9.8/−6.5 for removal) is authoritative and the prose direction flipped. No firm prose-based conclusion on the French effect should be cited.
  - Reproduction cost of captioning baselines:
    - High-detail captioning and query generation depend on the proprietary Claude-3 Sonnet API. A footnote concedes building equivalent BGE-M3 fine-tuning data is too costly/slow — affecting both baseline-fairness discussion and reproducibility.

### 8.2 Methodological limits seen by the compiler (non-source interpretation, marked)

- The following are the compiler's Typodeck-oriented inferences, not source claims:
  - A retrieval model, not a reconstruction/generation model:
    - ColPali outputs page–query relevance (LI scores) and token–patch similarity distributions. It does not output element boundaries, reading order, hierarchy, text transcription, or table structure.
    - A different purpose from the structured representations Typodeck's Slide IR (versioned intermediate representation) or Composition Engine need.
  - Outside visual-quality assessment:
    - The LI score is "query–page semantic/visual relevance," not "design quality/readability/hierarchy intent."
    - High similarity gives no guarantee of good layout. Must not be misused as a Visual Critic substitute.
  - Limits of interpretability:
    - Similarity maps show only "which patches were close to the query token" — not why it is good (contrast, alignment, whitespace, type scale).
    - If white-patch activations are registers (§D hypothesis), they may be global-information stores — risky to misread as local evidence.
  - Page-level atomicity:
    - Both ViDoRe and ColPali retrieve whole pages. Object-level matching within a slide (title/chart/table/note) or partial-region retrieval is outside the source scope.
    - A granularity mismatch exists against candidate-unit evaluation such as Typodeck's 38 Composition Candidates (a consequence of the source design, not [SPECULATION]).
  - Domain-transfer uncertainty:
    - Training/evaluation centers on documents (reports/papers/infographics). Presentation slides (large type, whitespace-driven layouts, animation/master variants) are a different distribution.
    - Applied to slides as-is, performance may differ from ViDoRe figures [SPECULATION].
  - Multilingual/typography generalization:
    - French zero-shot is a positive signal, but Korean/Hangul typography, vertical writing, and mixed-font settings are unevaluated (the unevaluated fact is [NOT IN SOURCE]; transfer uncertainty is [SPECULATION]).
  - Index scale and cost:
    - 257.5 KB/page × a large corpus is burdensome uncompressed. Pooling/quantization figures are projections validated only at ViDoRe's small scale.
    - Fine at Typodeck's 447-reference scale (computed below), but tens of thousands to millions of slides need separate design.

## 9. Typodeck Relevance

- Typodeck context assumed:
  - Pipeline: Slide Markdown → Slide IR (versioned intermediate representation) → Composition Engine → natively editable PPTX.
  - Visual Critic (image+structure hybrid evaluation), Grammar Registry (versioned visual system), Validation-Repair gates, 38 Composition Candidates, reference-slide reproduction benchmark.
  - Goal direction: Valid PPTX → Good Layout → Intended Visual Hierarchy (intended semantic importance = perceived visual importance).

### 9.1 Direct connections ([SOURCE-BASED])

- The ingestion-bottleneck argument is directly citable:
  - ColPali §1/Table 2 demonstrates "pipeline optimization matters more than embedding optimization" on visually rich documents.
  - If Typodeck's Slide IR/Composition Engine shoulders parser+rule pipeline complexity, the same bottleneck logic applies; the paper's pipeline-simplification performance/latency gains transfer as motivation.
- Precedent for direct page-image embedding:
  - ColPali embeds page renderings in a single forward pass without OCR/layout/chunking/captioning (§4, §5.2).
  - Typodeck could likewise add a retrieval path embedding slide-render PNG/PDF directly — especially for "which reference is this similar to" queries in the reference-slide reproduction benchmark, without text extraction.
- Fine-grained matching via late interaction:
  - Per query token, max-select the most relevant patch and sum (§4.1 Eq. 1).
  - Fits slide-search queries mixing text and visuals (e.g., "quarterly revenue stacked bar chart") by scoring evidential patches per term.
  - The largest ViDoRe gaps on infographic/figure/table tasks (§5.1) speak to chart/table-centric slide search.
- Partial use of interpretability maps:
  - Per-query-term salient-patch visualization (§5.3, Appendix D).
  - Usable in Typodeck in a limited role: debugging "why was this reference retrieved" or highlighting slide regions matching query intent.
  - Must stay within relevance-evidence scope, not quality judgment (§9.3).
- End-to-end fine-tuning ease:
  - Just 1552 French table samples added: TabFQuAD +2.6 nDCG@5, +0.4 overall (§6).
  - Suggests Typodeck could domain-adapt with a small slide query–page set, with faster experiment cycles than a complex multi-stage pipeline.
- Storage optimization via token pooling:
  - Pool factor 3: −66.7% vectors, 97.8% performance retained (§5.2).
  - Caveat: text-dense documents are outliers (Shift). Text-dense slides (table/bullet crowding) may likewise pool poorly (the Shift observation is [SOURCE-BASED] analogy; applying it to slides is [SPECULATION]).

### 9.2 Application ideas (concrete; speculation marked)

- Retrieval stage for searching the 447 reference designs:
  - Proposal [COMPILER NOTE]: index the 447 reference slide renderings as a ColPali-style multi-vector index. Retrieve top-K references with user brief/queries (e.g., "traction slide for fundraising, log-scale chart") and pass them as draft/style hints to the Composition Engine.
  - Scale arithmetic (source figures, compiler arithmetic):
    - 447 pages × 257.5 KB ≈ 115 MB (before pooling/compression).
    - With pool factor 3, vectors shrink to 1/3 → ~38 MB (arithmetic application of the source's 66.7% reduction, not [SPECULATION]; but retaining 97.8% on slide distributions is [SPECULATION]).
    - At 447 scale, late-interaction overhead (~1 ms/1000 pages) is negligible; online latency would be dominated by ~30 ms query encoding [SPECULATION].
  - ViDoRe practical tasks (1000 pages/100 queries per topic) are a similar scale; 447 items (under half) may make retrieval easier than ViDoRe [SPECULATION].
  - Connection to the 38 Composition Candidates:
    - Render the 38 candidates into the same index space and pre-filter by brief–candidate LI score [SPECULATION].
    - But LI scores measure brief–candidate relevance, not layout quality — final selection must stay with the Visual Critic + Validation-Repair.
- Auxiliary metric for the reference-slide reproduction benchmark:
  - Use cross-modal similarity between generated-slide and reference-slide renderings as an auxiliary reproduction (retrieval-style recall) signal [SPECULATION].
  - But ColPali is trained for query-text to page-image matching; image-to-image similarity or pixel reproduction measurement is outside the source scope — do not promote to a primary metric without separate validation.
- Grammar Registry linkage [SPECULATION]:
  - Link retrieved references' style tokens (font/color/spacing) to Grammar Registry versions to trace "which grammar version this reference came from."
  - ColPali itself outputs no style attributes, so a separate parser/VLM tagger is needed for style tags; ColPali serves only the retrieval path.
- Borrowing ViDoRe-style query design ([SOURCE-BASED] + [SPECULATION]):
  - Borrow Appendix A.2's methodology (100 human-validated high-quality queries per topic) for Typodeck reference-search evaluation.
  - The reported effort of 4 annotators × 3 hours for 100 queries per topic is directly usable for estimating Typodeck eval-set construction.
  - The Claude-3 Sonnet prompt template (max 3 pairs, forced JSON, empty list allowed) is a reusable template.

### 9.3 Cautions: do not misuse as a Visual Critic ([SOURCE-BASED])

- Similarity ≠ design quality:
  - ColPali's LI score is a sum of query-token to patch inner products (§4.1). Its training objective is gold-page identification (§4.2 loss). Contrast/alignment/whitespace/readability/visual-hierarchy concepts are not in the objective.
  - ViDoRe metrics (nDCG@5, Recall@1) measure only "was the gold page ranked highly" — not "is the page well designed."
  - LI scores must therefore not be read as Visual Critic scores. High LI means "relevant to the brief," not "Good Layout."
- Gap from Intended Visual Hierarchy:
  - Typodeck's goal is intended semantic importance = perceived visual importance.
  - ColPali similarity maps show embedding-space proximity of query terms, not perceptual saliency: e.g., `< hour>` responding to "hourly"/the x-axis (§5.3) is text–patch alignment, not a judgment that the x-axis is visually important.
  - If white-patch activations are global-information registers (§D hypothesis), reading map highlights as "design elements to attend to" is misreading.
- Scope of partial late-interaction interpretability:
  - Allowed: search debugging ("this query token matched because of this region"), evidence for reference selection, mismatch analysis.
  - Forbidden: scoring quality from map activations, judging layout goodness from map area/intensity, map-driven automatic layout edits.
  - The Visual Critic (image+structure hybrid) may consult a ColPali map as one input feature [SPECULATION], but final judgment must rest with grammar/structure/perceptual rules.
- No adoption without slide-domain transfer validation:
  - Training/evaluation is document-centric. Slide distributions (large type, whitespace, master layouts) are unevaluated.
  - Run a pilot evaluation on the 447 references (human-validated queries + nDCG/Recall) before adopting. Do not expect ViDoRe's 81.3 to transfer to slides as-is (a methodological caution, not [SPECULATION]).

## 10. Citation Points (3 claims for Typodeck papers)

1. Claim: in visually rich document retrieval the bottleneck is the text-extraction pipeline, not the embedding model; pipeline optimization beats embedding optimization.
   - Source basis: §1 "optimizing the ingestion pipeline yields much better performance ... than optimizing the text embedding model" (citing Table 2).
   - Figures: Table 2 shows BM25→BGE-M3 swaps gain only +0.6–+1.9 on average (Unstructured+OCR 65.5→66.1; +Captioning 65.1→67.0), while moving from text-only to visual integration (+OCR/+Captioning) makes previously unmeasurable tasks (ArxivQ/InfoQ/TabF) measurable and forms the 65–67 average band.
   - Typodeck use: motivation for Slide IR/preprocessing pipeline design; prior evidence for the "parser is the bottleneck" premise.
2. Claim: VLM late-interaction retrieval directly embedding page images outperforms strong text pipelines (parser + OCR/captioning + latest embeddings) by a large margin.
   - Source basis: §5.1 ColPali discussion, Table 2.
   - Figures: ColPali mean nDCG@5 81.3 vs. Unstructured+Captioning+BGE-M3 67.0 (+14.3) and vs. BiSigLIP 58.6 (+22.7). Visually complex task gaps: ArxivQ 79.1 (+39.0 over best text 40.1), InfoQ 81.8 (+9.9 over 71.9), TabF 83.9 (+13.1 over 70.8). Recall@1 also 72.7 vs. 57.5 (Table 6).
   - Typodeck use: justification for introducing rendering-based reference retrieval; citation for the "search without extraction" design choice.
3. Claim: late interaction yields interpretable retrieval by visualizing evidential patches per query token, capturing non-trivial visual features such as axis labels beyond OCR level.
   - Source basis: §5.3 Figure 3, Appendix D Figure 6.
   - Qualitative (not numeric) evidence: the `< hour>` token shows high similarity to "hourly"/"hours" words and the hour x-axis; `<Kazakhstan>` to all "Kazakhstan" patches and patches around "Kashagan" (offshore oil field). Cite the white-patch register hypothesis alongside to mark against over-interpretation.
   - Typodeck use: prior basis for a reference-search evidence UI — qualified as relevance evidence, not quality assessment, and explicitly separated from the Visual Critic.

## 11. Numeric Index (source-based, for verification)

- Train set: 118695 = 39463 + 10074 + 13251 + 10000 + 45940 (compiler sum matches).
- Main-text 63%/37% vs. table-computed 61.32%/38.70%: ~1.7pp mismatch, unexplained in source. Verified genuine in the PDF.
- Headline mean nDCG@5: ColPali 81.3, best text 67.0, BiSigLIP 58.6, BiPali 58.8, SigLIP Vanilla 51.4, Jina 17.7, Nomic 12.9.
- ColPali mean Recall@1: 72.7 (Table 6).
- Query encoding: BGE 22 ms / 15 tokens; ColPali 30 ms. LI overhead ~1 ms / 1000 pages.
- Storage: 257.5 KB/page (D=128, one vector per patch + 6 "Describe the image" tokens).
- Pooling: pool factor 3 → −66.7% vectors, 97.8% performance retained. Shift outlier.
- Ablation deltas (mean nDCG@5): 512-patch −24.8; ColIdefics2(64) −4.7 (vs. 1024); vision unfreeze −0.7; in-batch loss −1.6; +TabFQuAD training +0.4 (+2.6 on that task); ColQwen2 +5.3; DocMatix −2.2.
- Query-augmentation tokens: prose +9.8/+6.3 ("improvement") vs. Table 7 −9.8/−6.5 (removal cost). [CORRECTED: prose direction flipped; table authoritative | PDF p.9 / Table 7.]
- Negatives: ColSigLIP mean 2.5–3.2; BiSigLIP(PaliGemma) 26.0.
- ViDoRe scale: academic 3310/3310, practical 500/5000 (queries/documents, table-based sums).
- Human validation: 4 annotators, ~3 hours each, 100 queries per topic. 0 PII flags.
- Training: 1 epoch, bfloat16, LoRA r=α=32, paged_adamw_8bit, 8 GPUs, LR 5e-5 linear decay 2.5% warmup, total batch 32, 5 `<unused0>` tokens after the query.
- License: MIT (data/adapters/code/benchmark).

## 12. Not-in-Source / Uncertainty List

- ICLR 2025 publication status: unconfirmable from the HTML conversion (only in the delegation brief) [CORRECTED: confirmed in the PDF header on every page | PDF p.1].
- DOI: [NOT IN SOURCE].
- Raw graph values of Figures 1/2: captions and main-text prose only; no tabular numbers. (Figure 2 totals 7.22s/0.12s/0.39s confirmed via Table 5 and the figure text layer | PDF pp.5, 19.)
- Table 4 model–value mapping and units: lost in the HTML conversion [CORRECTED: restored — BGE-M3 8.60, BM25 dense 3.00, BM25 sparse 1.56±0.51, ColPali float16 257.5, unit KB | PDF p.18 / Table 4].
- Table 5 operation–value mapping: lost in the HTML conversion [CORRECTED: restored — Layout 0.81, OCR 2.67, Captioning 3.71, Page enc. 0.03/0.12/0.39, Total 7.22/0.12/0.39, unit seconds | PDF p.19 / Table 5].
- §3.2 R2/R3 labels: appear swapped vs. the §2 definitions (indexing latency labeled R2, query latency R3) — verified present in the PDF itself | PDF p.5.
- Table 2 BiPali row `↓-X` double signs: looked like HTML artifacts [CORRECTED: present in the PDF itself | PDF p.7 / Table 2; also Table 6]. Trust absolute values only.
- §6 query-augmentation French-effect sign: prose/table contradiction [CORRECTED: prose direction flipped; Table 7 authoritative (−9.8/−6.5 for removal; prose +6.3 is 0.2 off) | PDF p.9 / Table 7].
- Table 7 `ColPali (224)` row-name meaning of 224: [NOT IN SOURCE]. Delta-matched to the 512-patch variant only [UNRESOLVED: 224/448 likely input resolutions, but undefined in the PDF].
- Supporting table for the +TabFQuAD experiment's Recall@1 +5: [NOT IN SOURCE] (Table 6 covers base models only).
- Shift practical-data collection counts (whether the ~100-document figure applies): appendix names only the 4 seeds; Shift-specific counts [NOT IN SOURCE].
- Whether ColQwen2-VL/ColIdefics2 training details (epochs, LR, etc.) exactly match the reference: only "same data and training strategy" stated; no table.
- Korean/slide/presentation-domain evaluation: [NOT IN SOURCE].
- Design quality, layout evaluation, element-relation reconstruction: outside source scope (not explicitly disclaimed, but absent from objective/metrics).
