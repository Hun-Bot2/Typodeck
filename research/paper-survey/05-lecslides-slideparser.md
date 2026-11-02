# LecSlides-370K / SlideParser — Full Paper Summary (English translation)

> Source survey (Korean): `research/paper-survey-tmp/05-lecslides-slideparser.md` (read in full before verification)
> Verified against: `research/paper-survey/sources/05-lecslides-slideparser.pdf`
> (ICCV 2025 Open Access, 10 pages, pp. 4455–4464, 3,323,914 bytes,
> sha256 `07110f4220048a1c6b6ff25fc0e0d397762e76d0323c80262e30caab03e4b552`)
> Fresh pdftotext extraction: 87,152 bytes / 724 lines (identical size to the survey's extraction basis).
> Figure panels checked by rendering PDF pp. 4457–4459 (Fig. 1 caption text, Fig. 2, Fig. 3, Table 1, Eq. 1).
> Marker legend: [SOURCE-BASED] = grounded in the paper text; [COMPILER NOTE] = compiler's
> interpretation/proposal/judgment; [SPECULATION] = conjecture without source basis;
> [NOT IN SOURCE] = not stated in the paper; [CORRECTED: ...] = fix applied during verification
> with PDF location; [UNRESOLVED: ...] = could not be verified.

> Reading scope of the original survey: full text — Abstract, 1. Introduction, 2. Related Work,
> 3. LecSlides-370K Dataset, 4. Method, 5. Experiments, 6. Conclusion, Acknowledgments,
> References — all checked before writing.
> Reading note: the two-column extraction scrambles sentence order in some passages
> (Fig. 1–Fig. 4 captions, equations, tables); these were reconstructed from context.
> Some broken equation symbols are extraction limitations of the source text.

---

## 0. Bibliographic Information

- **Title:** Towards Comprehensive Lecture Slides Understanding: Large-scale Dataset and Effective Method
- **Authors:** Enming Zhang, Yuzhe Li, Yuliang Liu, Yingying Zhu (corresponding author `*`), Xiang Bai
- **Affiliation:** Huazhong University of Science and Technology (HUST)
  - Emails: `{emzhang, yzli, ylliu, yyzhu, xbai}@hust.edu.cn`
- **Venue/Year:** ICCV 2025 (The IEEE/CVF International Conference on Computer Vision)
  - Page-1 watermark: "This ICCV paper is the Open Access version, provided by the Computer Vision Foundation."
  - Page numbers: 4455–4464
- **Links:**
  - GitHub (stated in the paper, end of Abstract): `https://github.com/zamling/LecSlides_370K` — "Dataset and Codes are available at" (the source typo `avaliable` is preserved as printed)
  - CVF Open Access: [NOT IN SOURCE] (no exact URL). ICCV 2025 proceedings appear both as the official IEEE Xplore version and CVF Open Access (per the watermark). Search CVF open access by title.
  - HuggingFace dataset: [NOT IN SOURCE]. Check the GitHub repository.
- **Funding:** NSFC (62206103, 62225603)
- **Keywords:** lecture slides understanding, large-scale dataset, Lecture Summary, Lecture QA, text relation, SlideParser

---

## 1. Five-Sentence Overview

1. Lecture slides are a core medium of online education, but existing datasets are limited in scale, areas, and tasks, and none address comprehensive understanding.
2. The authors built LecSlides-370K from a Slideshare crawl: 25,542 lectures, 370,078 slides, 15 areas, 114,472 summaries, 259,461 QA pairs — a large-scale multi-task dataset.
3. They define two tasks — Lecture Summary for global understanding and Lecture QA (4 question types) for fine-grained/localizing understanding — with a train 109,472 / val 2,000 / test 3,000 chunk split and ROUGE/METEOR / EM/F1 evaluation protocols.
4. They argue that the complex text relations peculiar to slides are the key obstacle to grasping internal logic, and propose SlideParser, composed of a Relation Prediction Head (RPH) + Relation Attention Layer (RAL) + weakly supervised DL-Cluster pseudo-labels.
5. SlideParser surpasses all baselines on both LecSlides-370K tasks and on the external SlideVQA benchmark, and pre-training on LecSlides followed by fine-tuning on SlideVQA yields a further large gain.

---

## 2. Research Problem and Background

### 2.1 Why lecture slides understanding is hard [SOURCE-BASED]

The Introduction names two obstacles:

1. **Slide text is conclusive and headline-style, which complicates providing detailed content.**
   - Slide phrases are compressed declarative statements, so generating elaborated descriptions/summaries from them is hard.
   - Source sentence: "1) Texts in slides are often conclusive and headline-style statements, which complicate the task of providing detailed content."
2. **Complex text relations hinder grasping the internal logic and generating reasonable responses.**
   - Source sentence: "2) The complex text relations pose additional challenges for models attempting to grasp the internal logic and generate reasonable responses."
   - Explained with the Fig. 1(b) example:
     - Upper-left text: detailed requirements for demand forecasting.
     - Text on the right of each block: explains each step of the flow chart.
     - I.e., text pairs exist that are spatially distant yet logically tightly coupled.
   - Core claim: "understanding complex text relations in slides can grasp the internal logic, and is the key part of understanding slides."

### 2.2 Limitations of existing datasets [SOURCE-BASED]

#### (1) Related dataset list (Section 2.1 + Table 1)

| Dataset | Lectures | Slides | QA | Summary | Task |
|---|---|---|---|---|---|
| LectureVideoDB [5] | 24 | 5,000 | - | - | Text Detection |
| LectureBank [17] | 1,352 | 51,939 | - | - | Prerequisite Chain |
| ALV [7] | - | 1,498 | - | - | Slide Segmentation |
| LPM [14] | 334 | 9,031 | - | - | Image Retrieval |
| M3AV [4] | 1,113 | 24,956 | - | - | ASR & TTS |
| SlideVQA [27] | 2,619 | 52,380 | 14,500 | - | QA |
| LecSlides-370K (this paper) | 25,542 | 370,078 | 259,461 | 114,472 | QA & Summary |

- [CORRECTED: the OCR-annotation column renders as ✓ (present) for every dataset except ALV (✗); the extraction glyphs `!`/`%` decode consistently with Tables 5/7 | PDF p. 4457 / Table 1]

#### (2) Functional limits of prior work

- Text detection in slides [5], slide segmentation [7], slides–speech image-text retrieval [14] etc. exist, but **no work has paid attention to comprehensive understanding of slides** (Introduction).
- SlideVQA [27] provides a slide QA benchmark but **overlooks the global understanding task (e.g., generating a detailed summary of a complete slide set)**.
- LectureBank is confined to prerequisite relations among topics (knowledge structure), ALV to lecture video fragmentation, LectureVideoDB to text detection/recognition in video lectures, and LPM to speech–vision retrieval.

#### (3) Scale/diversity limits

- Paper's summary: "restricted scales and limited number of lecture areas also constrain the development."
- Two conclusions of Section 2.1:
  1. Most datasets pay insufficient attention to slides understanding, and their defined tasks do not provide multi-perspective understanding.
  2. Limited data scale hinders advances in slides understanding.
- LecSlides-370K comparison (Section 3.1, Fig. 1(a)):
  - vs. the previous largest, SlideVQA: **~9.7× lectures, ~7.1× slides**.
  - Areas: LecSlides 15 vs. single-digit counts for SlideVQA, LPM, etc. (per Fig. 2(a)).
  [CORRECTED: Fig. 2(a) visually confirmed — SlideVQA bars appear in ~6–7 disciplines, LPM in ~4 | PDF p. 4458 / Fig. 2(a)]

### 2.3 Limits of existing methods (Section 2.2)

No slide-specific methods exist; three borrowed categories:

1. **Vision-language methods** [16, 31, 34, 36]
   - Large-scale pre-training, then fine-tuning on downstream multi-modal understanding.
   - Commonly integrate a vision-language fused transformer encoder [16, 31, 36].
2. **NLP methods** [15, 22]
   - T5 [22], BART [15], etc.: encoder-decoder, text input → text output.
3. **Document understanding methods** [10, 28]
   - Replace the traditional transformer encoder with a multi-modal encoder, fusing text + vision.
   - E.g., the LayoutLM series [10, 32, 33] — integrating text, image features, and 2D position embeddings.
- Shared criticism: "these related methods do not consider the complex text relations in slides, a crucial part of slides understanding, thereby yielding inferior performance."
- Section 4.2 reiterates that 2D position embeddings alone are insufficient for slides' complex relations and may introduce inaccuracies.

---

## 3. Core Contributions

Based on the three contribution statements at the end of the Introduction (faithful to the source, with clarifications):

1. **A large-scale multi-task slide understanding dataset, LecSlides-370K**
   - 25,542 lectures, 370,078 slides, 15 areas.
   - 114,472 summary annotations + 259,461 QA pairs.
   - Introduces the two comprehensive tasks Lecture Summary and Lecture QA.
2. **A novel method, SlideParser**
   - Includes an auxiliary branch that effectively predicts and utilizes complex text relations in slides.
   - Components: Relation Prediction Head (RPH, relation prediction) + Relation Attention Layer (RAL, relation utilization).
   - A weakly supervised pseudo-relation-label pipeline, DL-Cluster, considering spatial + semantic relations jointly, to improve RPH quality.
   - Enhances attention between related texts, reduces it between unrelated texts.
3. **Extensive experiments demonstrating superiority**
   - Surpasses all related methods on the LecSlides-370K Lecture Summary and Lecture QA benchmarks.
   - Also evaluated on SlideVQA [27] to further validate the text-relation design.
   - Pre-training on LecSlides → fine-tuning on SlideVQA gives a large performance boost, demonstrating its value as a large-scale pre-training dataset.

---

## 4. Methodology Details

### 4.1 The LecSlides-370K Dataset

#### 4.1.1 Source, filtering, scale (Section 3.1)

- **Source:** Slideshare (`https://www.slideshare.net`, stated in a footnote).
- **Raw data:** 720,673 slides from 39,784 lectures.
- **Filtering:** slides irrelevant to lecture content (ads, etc.) or carrying extraneous information unnecessary for comprehension were removed by content. Concrete filter rules/classifier/thresholds are [NOT IN SOURCE].
- **Final scale:**
  - 25,542 lectures.
  - 370,078 slides.
  - 15 areas (e.g., computer science, marketing, medicine).
- **Vs. previous largest (SlideVQA):** ~9.7× lectures, ~7.1× slides.

#### 4.1.2 Lecture chunking

- Motivation: raw lectures range from a few to hundreds of slides, which is hard for researchers to use.
- Solution: raw slides segmented into **114,472 lecture chunks**.
- Principle: **each chunk belongs to the same sub-topic.**
  - E.g., if one slide shows the first item of a list and the next slide reveals subsequent items, they belong to the same chunk.
- Slides per chunk:
  - Mean 3.2.
  - Distribution in Fig. 2(b). **Mode is 2** (most chunks contain two slide images).
- Note the annotation unit is the chunk, not the whole lecture:
  - Training/evaluation inputs are chunk-level multi-image sets.

#### 4.1.3 In-slide annotations (positions + text)

- **Position annotations:** positions of texts, illustrations, tables.
  - Purpose: reduce information-extraction/data-processing burden so researchers can focus on new methods.
- **Text content annotations:** textual contents in slides.
  - Purpose: help models understand slides better.
- Extraction pipeline (OCR engine name, manual vs. automatic, quality control) is [NOT IN SOURCE].
- Visual element counts:
  - 94,906 diagrams.
  - 34,562 illustrations.
  - 18,938 tables.
- Text counts:
  - 28,220,274 words total.
  - Mean 76.2 words (reads as per-slide mean, but the source says only "with an average of 76.2 words" with no denominator stated; per-slide is the compiler's inference).
  - Vocabulary size 84,630.
  - Fig. 2(c): the majority of slides contain fewer than 100 words.

#### 4.1.4 15 areas / diversity

- Fig. 2(a): lecture counts per discipline for LecSlides-370K vs. SlideVQA vs. LPM.
- LecSlides has 15 disciplines. The paper text does not enumerate all of them. Named examples:
  - business, natural sciences, computer sciences (Introduction).
  - computer science, marketing, medicine (Section 3.1).
  - marketing, agriculture, etc., absent from previous datasets (Section 3.3.1).
- [CORRECTED: the Fig. 2(a) x-axis shows 15 discipline categories (Business largest; Law and Marketing smallest); axis labels read approximately as Business, Engineering, Natural Science, Education, Computer Science, Humanities, Social Science, Mathematics, other, Medicine, Environmental, Agriculture, Information …, Law, Marketing — the paper text itself names only the examples above | PDF p. 4458 / Fig. 2(a)]
- Distribution: business has the highest proportion; law and marketing lectures are relatively small.
- Diversity rationale: rich teaching content + demand to handle diverse scenes → more challenging.

#### 4.1.5 Expertise (difficulty) indicators (Section 3.3.2)

- Lecture slides contain specialized knowledge and terminologies → challenging.
- Flesch Reading Ease (FRES) [13]: mean **34.3**, a 'Hard to Read' level.
- Flesch–Kincaid Grade Level [13]: mean **grade 14.1** (college level).
- The computation target (full slide OCR vs. summary annotations, etc.) is [NOT IN SOURCE].

#### 4.1.6 Annotation format: summary + qa_pair

- Totals:
  - 114,472 summary labels.
  - 259,461 QA pairs.
- File format (JSON schema, field names, etc.) is [NOT IN SOURCE]. Check GitHub/HF.
- Summary annotations:
  - Length distribution in Fig. 2(d).
  - Mean length **124.6 words**.
  - Generation procedure (manual / model-generated-then-reviewed, etc.) is [NOT IN SOURCE].
- QA annotations:
  - 4 types:
    - binary choice.
    - visual analysis.
    - data interpretation.
    - textual reasoning.
  - Fig. 2(e) shares:
    - textual reasoning 64%.
    - visual analysis 18%.
    - data interpretation 14%.
    - binary choice 4%.
  - Mean answer length **4.1 words**.
  - QA generation/validation procedure is [NOT IN SOURCE].
- Fig. 1(b) example QAs:
  - Textual Reasoning: "What template is required to generate a specific requirement?" → "demand templates"
  - Binary Choice: "Is maintaining one year detailed forecast required for forecasting a number?" → "No"
  - Data Interpretation: "What is the demand input for starting forecast in January 11?" → "100"
  - Visual Analysis: "what is the next stage of Sales?" → "Marketing" (case/punctuation as printed)
  - Summary excerpt: "Slides outline the key requirements for demand forecasting. It highlights the importance of allowing field sellers and product…" (including extraction truncation)

#### 4.1.7 Task definitions (Section 3.2)

The two tasks cover the most frequently used student functions + global/detailed understanding respectively:

1. **Lecture Summary (global understanding)**
   - Input: lecture chunk `I = {I1, I2, ..., Ij}^M` (as printed; means a set of `M` slide images, though the index variable `j` vs. count `M` is inconsistent in the original).
   - Goal: analyze each slide's content → integrate contextual information → retain key details → eliminate redundancies → output a summary of all slides.
   - Evaluation focus: key-information extraction + global understanding.
2. **Lecture QA (detailed understanding)**
   - Input: lecture chunk + query `q`.
   - Goal: identify the slide corresponding to the question, then answer based on that slide's content.
   - Evaluation focus: locating the problem + fine-grained content understanding.
   - Whether the model explicitly outputs the identified slide or does so internally is [NOT IN SOURCE].

#### 4.1.8 Evaluation protocol / splits (Section 3.4)

- Splits (chunk-level):
  - train 109,472.
  - val 2,000.
  - test 3,000.
  - Sum is 114,472, matching the total chunk count.
- Lecture Summary metrics: **ROUGE-1, ROUGE-L [18], METEOR [3]**.
  - Widely used in image captioning/text generation, assessing different aspects.
- Lecture QA metrics: **EM (Exact Matching), F1**.
  - Following SlideVQA [27].

---

### 4.2 SlideParser

#### 4.2.1 Overall architecture (Fig. 3(a), Section 4)

Three modules:

1. **Transformer Encoder** (unified text-image multi-modal).
2. **Text Relation Prediction Module** (the key novelty).
3. **Text Decoder**.

Data flow:

1. Slide texts + image patches are fed into the Transformer Encoder.
2. Output text embeddings go to the Text Relation Prediction Module → text relations predicted + text embeddings updated.
3. Updated text embeddings combine with output image embeddings → Text Decoder → summary or answer.

#### 4.2.2 Input schema (Section 4.1)

- The Transformer Encoder is a unified text-image multi-modal Transformer for learning cross-modal representations.
- Like prior document-understanding work [10, 28], it is multi-layer; each layer is mainly multi-head self-attention + feed-forward networks.
- Inputs:
  - Text embeddings `X = x1:L`.
  - Image embeddings `V = v1:M`.
  - `L`, `M` are the textual and visual embedding sequence lengths.
- Text embeddings:
  - `L` text tokens `{si}_(i=1)^L` encoded by word embedding with 1D position and 2D layout position embedding [28].
- Image embeddings:
  - Slide image `I ∈ R^(H×W×C)` split into `M = H/P × W/P` patches, then Patch Embedding.
  - [CORRECTED: the `M` formula renders correctly in the PDF; the `M = H P × P H` form was only an extraction garble | PDF p. 4459]
- Multi-slide handling (Section 5.1):
  - A **simple concat operator** over encoder outputs is used for all models.
  - Concat axis/order/position marking details are [NOT IN SOURCE].

#### 4.2.3 Key motivation: 2D positions alone are insufficient

- The Transformer Encoder's 2D position embedding proved effective for layout/text-relation understanding in prior document understanding [10, 28].
- But slide text relations are more complex than traditional documents → 2D embedding alone may not suffice for comprehensive relation comprehension and could introduce inaccuracies.
- Hence the RPH (weakly supervised relation prediction) + RAL (relation utilization) modules.

#### 4.2.4 Relation Prediction Head (RPH, Section 4.2.1)

Goal: accurate text relation prediction. Inspired by [30], using text position + semantic information.

**(A) Spatial relation**

- Input: text boxes `{bi}_(i=1)^L`.
- Box delta (Eq. 1):

```text
Δ(bi, bj) = {
  (x_i^ctr - x_j^ctr)/w_i,
  (y_i^ctr - y_j^ctr)/h_i,
  log(w_i / w_j),
  log(w_i / w_j)  [as printed — see correction below]
}
```

- [CORRECTED: the duplicated fourth term `log(w_i/w_j)` appears in the published PDF itself, not as an extraction artifact; it is presumably a typo for `log(h_i/h_j)` | PDF p. 4459 / Eq. 1]
- `x^ctr`, `y^ctr`: box center coordinates.
- `w`, `h`: box width/height.
- Spatial relation of two boxes:

```text
r_{bi,bj} = { Δ(bi,bj), Δ(bi,bij), Δ(bij,bj) }
```

- `bij`: union bounding box of `bi`, `bj`.
- A 12-D vector (4D × 3).
- An MLP layer + integration over all box relations → spatial relation matrix `R_spa ∈ R^(L×L)`.

**(B) Semantic relation**

- Uses Transformer Encoder output text embeddings `ET ∈ R^(L×D)`.
- Semantic relation between two texts (Eq. 2):

```text
R_sem = (Wq ET × Wk ET^T) / sqrt(D)
```

- Same form as a scaled dot-product attention score.

**(C) Final predicted relation matrix (Eq. 3)**

```text
M̂_R = Sigmoid(R_spa + R_sem)
M̂_R ∈ R^(L×L)
```

#### 4.2.5 Weakly supervised label generation: DL-Cluster (Section 4.2.2, Fig. 4)

##### Background / motivation

- Empirical observation: without relation supervision, RPH fails to generate reasonable text relations (hard to converge).
- Prior work [1, 8] relies on traditional clustering methods [6, 9], which cannot handle diverse slide layouts effectively.
- Authors' observation: in slides, **both spatial and semantic relations matter**.

##### Proposal: DL-Cluster (Dynamic Layout Cluster)

A dual-stream pseudo-relation-label generation pipeline. Fig. 4 flow:

```text
slide texts
→ [Sampling Spatial Relation + Finding Optimal K + Cluster + Binarization]
→ [Sentence Transformer Semantic Relation]
→ Merging two relations
→ Pseudo Relation label
```

##### Spatial stream

1. For each text box, **sample N reference points as cluster points**.
   - N's value and sampling positions (uniform in-box / grid, etc.) are [NOT IN SOURCE].
2. Determine the cluster count dynamically per slide (a fixed count is unsuitable).
3. Based on **Kmeans++ [2]**, iterate cluster count `k` from 2 to `K`, selecting the optimum via the **Silhouette method [24]**.
   - `K = 8` (stated in the experiment setup).
   - Silhouette analysis: compare each cluster point's distance to its own cluster vs. its nearest neighboring cluster.
   - Optimal `k`: minimum mean distance to points in its own cluster + maximum mean distance to the nearest neighboring cluster's points.
4. Assign each box a cluster ID by reference-point voting.
5. Compute the spatial relation score `s_spa` (Eq. 4):

```text
s_spa = {
  1 - (1/N) Σ_{ε=1..N} ||x_{i,ε} - μ_j|| , if Ci == Cj
  0                                         , if Ci != Cj
}
```

- `Ci`, `Cj`: box clusters.
- `μj`: centroid of `Cj`.
- `x_{i,ε}`: reference point of box `i`.
- Reading: same cluster → score from mean reference-point-to-centroid distance; different clusters → 0.
- Distance normalization range is [NOT IN SOURCE].

##### Semantic stream

1. Extract the textual contents of each text box.
2. Semantic similarity via cosine distance of **Sentence Transformer [23]** embeddings → `s_sem`.
3. Combine spatial + semantic (Eq. 5):

```text
s = β1 Norm(s_spa) + β2 Norm(s_sem)
β1 = 0.7, β2 = 0.3 (default)
```

- The kind of `Norm` is [NOT IN SOURCE].
- The combined matrix `MR = {sij}_(L×L)` is **binarized with a 0.5 threshold**.

##### Relation loss (Eq. 6)

```text
L_rel = BCELoss(M̂_R, MR)
```

#### 4.2.6 Relation Attention Layer (RAL, Section 4.2.3)

- Utilizes predicted relations via Self Attention [29] (Fig. 3(b)).
- From the predicted relation matrix `M̂_R`, build an attention mask:
  - assign `-∞` when `mij < 0.5`.
  - `mij ∈ M̂_R`.
- Output text embeddings `ET` pass through **N-layer self-attention blocks** with this mask → updated embeddings `E'_T`.
  - The value of `N` is [NOT IN SOURCE].
- Effect: attention enhanced between related texts, blocked between unrelated texts.
- Finally, `ET` and `E'_T` are combined by **residual connection**. Combination details are [NOT IN SOURCE].

#### 4.2.7 Text Decoder / total loss (Section 4.3)

- Following prior work [28], a **T5 decoder** (uni-directional Transformer decoder, next-token prediction) is adopted.
- Generates summary/answer text.
- Generation supervision: **Cross Entropy loss** → `L_ce`.
- Total loss (Eq. 7):

```text
L = L_ce + L_rel
```

- Plain sum with no weighting between the two terms.

#### 4.2.8 Training setup (Section 5.1)

- Both Transformer Encoder and Text Decoder are **initialized from pretrained UDOP [28] weights**.
- Optimizer: **AdamW [19]**, β1 0.9, β2 0.999, weight decay 0.02.
- Scheduler: cosine learning rate scheduler.
- Initial learning rate: **4×10^-5**.
- Total iterations: **41K**.
- Multi-slide: encoder-output simple concat (common to all models).
- Batch size, GPUs, training time, sequence length, image resolution, augmentation, etc. are [NOT IN SOURCE].
- LayoutLMv3 has no text decoder so it cannot generate text → the same text decoder as the proposed method is added for evaluation.

#### 4.2.9 Baseline configuration

- NLP: T5 [22], BART [15].
- Vision-language: mPLUG [16], Vid2Seq [34].
- Document understanding: LayoutLMv3 [10], Donut [12], UDOP [28].
- Extra SlideVQA baselines (Table 4): VinVL [36], PreasM [35], T5, LayoutT5 [26], LayoutLMv2 [33], FiD [11], M3D [27].

---

## 5. Experimental Results in Detail

### 5.1 LecSlides-370K Lecture Summary (Table 2)

Metrics: ROUGE-1 / ROUGE-L / METEOR. `#Params` included.

#### val split

| Method | Params | R-1 | R-L | METEOR |
|---|---:|---:|---:|---:|
| BART-base [15] | 217M | 33.1 | 21.1 | 21.9 |
| BART-large [15] | 509M | 35.9 | 21.9 | 24.2 |
| T5-base [22] | 272M | 34.6 | 21.6 | 22.8 |
| T5-large [22] | 803M | 36.2 | 22.1 | 24.9 |
| Vid2Seq [34] | 314M | 16.0 | 11.8 | 12.9 |
| mPLUG-base [16] | 350M | 27.1 | 19.0 | 21.6 |
| mPLUG-large [16] | 600M | 30.0 | 20.5 | 24.0 |
| Donut [12] | 543M | 27.4 | 18.6 | 21.3 |
| LayoutLMv3-base [10] | 533M | 33.6 | 21.0 | 23.8 |
| LayoutLMv3-large [10] | 768M | 34.6 | 21.6 | 24.8 |
| UDOP [28] | 794M | 36.1 | 22.1 | 26.4 |
| SlideParser (Ours) | 810M | **42.2** | **25.3** | **31.3** |

#### test split

| Method | Params | R-1 | R-L | METEOR |
|---|---:|---:|---:|---:|
| BART-base | 217M | 32.8 | 20.1 | 21.5 |
| BART-large | 509M | 35.0 | 21.0 | 22.9 |
| T5-base | 272M | 34.3 | 20.7 | 22.4 |
| T5-large | 803M | 35.1 | 21.3 | 23.2 |
| Vid2Seq | 314M | 17.8 | 13.1 | 14.1 |
| mPLUG-base | 350M | 27.6 | 19.3 | 21.7 |
| mPLUG-large | 600M | 29.8 | 20.3 | 23.6 |
| Donut | 543M | 27.6 | 18.5 | 21.1 |
| LayoutLMv3-base | 533M | 31.7 | 19.8 | 22.6 |
| LayoutLMv3-large | 768M | 33.9 | 21.0 | 23.2 |
| UDOP | 794M | 35.3 | 21.5 | 25.6 |
| SlideParser (Ours) | 810M | **41.7** | **24.7** | **30.4** |

#### Reading (Section 5.2.1 of the paper)

- SlideParser ranks 1st on all val metrics at 42.2/25.3/31.3, attributed to text-relation understanding.
- Vision-heavy methods (Vid2Seq, mPLUG series, Donut) are at the bottom.
  - Stated cause: processing only the visual modality leads to a lack of detailed content extraction.
- NLP methods (T5, BART) do relatively well but lag behind the proposed method with its multi-modal fusion + text-relation utilization.

#### Gaps to the runner-up (compiler-computed)

- val R-1: SlideParser 42.2 vs. runner-up T5-large 36.2 → **+6.0**.
- val R-L: 25.3 vs. runner-up T5-large/UDOP 22.1 → **+3.2**.
- val METEOR: 31.3 vs. runner-up UDOP 26.4 → **+4.9**.
- test R-1: 41.7 vs. runner-up UDOP 35.3 → **+6.4**.
- Parameters are 810M, the largest in the comparison, but in the same class as 803M T5-large and 794M UDOP.

### 5.2 LecSlides-370K Lecture QA (Table 3)

Metrics: EM / F1.

#### val / test

| Method | Params | val EM | val F1 | test EM | test F1 |
|---|---:|---:|---:|---:|---:|
| BART-base | 217M | 18.9 | 25.1 | 18.5 | 24.7 |
| BART-large | 509M | 20.6 | 27.1 | 19.8 | 26.3 |
| T5-base | 272M | 19.1 | 26.0 | 18.7 | 25.3 |
| T5-large | 803M | 20.9 | 27.4 | 20.0 | 27.1 |
| Vid2Seq | 314M | 7.0 | 14.3 | 6.7 | 13.6 |
| mPLUG-base | 350M | 8.4 | 10.9 | 8.5 | 10.1 |
| mPLUG-large | 600M | 9.5 | 14.3 | 9.5 | 14.2 |
| LayoutLMv3-base | 533M | 12.5 | 15.8 | 12.4 | 15.1 |
| LayoutLMv3-large | 768M | 13.6 | 19.3 | 13.5 | 19.1 |
| UDOP | 794M | 19.2 | 26.0 | 18.7 | 25.6 |
| SlideParser (Ours) | 810M | **23.7** | **33.0** | **23.6** | **32.1** |

(Note: Donut appears in Table 2 but has no row in the paper's Table 3.)

#### Reading

- Where Lecture Summary measures global understanding, QA measures in-depth understanding of specific content.
- SlideParser is above all baselines.
- Vision-language models such as mPLUG and Vid2Seq are still at the bottom → detailed textual information is decisive for QA too.
- Gaps (compiler-computed):
  - val EM 23.7 vs. runner-up T5-large 20.9 → **+2.8**.
  - val F1 33.0 vs. runner-up T5-large 27.4 → **+5.6**.
  - test EM 23.6 vs. runner-up T5-large 20.0 → **+3.6**.
  - test F1 32.1 vs. runner-up T5-large 27.1 → **+5.0**.
- Absolute scores are lower than Summary (EM in the 20s), evidencing dataset difficulty. The paper likewise notes that "related baselines struggle to extract the main point … and pinpoint the correct content."

### 5.3 SlideVQA Performance (Table 4)

Multi-image slide VQA benchmark. dev/test EM/F1.

| Model | dev EM | dev F1 | test EM | test F1 |
|---|---:|---:|---:|---:|
| VinVL [36] | 9.4 | 11.4 | 10.7 | 13.5 |
| PreasM [35] | 36.3 | 41.9 | 30.7 | 38.2 |
| T5 [22] | 35.2 | 41.3 | 31.0 | 39.7 |
| LayoutT5 [26] | 38.9 | 44.8 | 31.7 | 39.9 |
| LayoutLMv2 [33] | 26.5 | 33.4 | 21.4 | 29.3 |
| FiD [11] | 37.6 | 42.9 | 30.4 | 38.9 |
| M3D [27] | 41.3 | 47.1 | 33.5 | 41.7 |
| SlideParser (Ours) | **44.1** | **49.8** | **37.5** | **43.9** |
| SlideParser† (LecSlides pre-training → SlideVQA fine-tuning) | **49.8** | **53.9** | **42.4** | **47.7** |

- SlideParser alone ranks 1st over all methods → claimed as evidence that the text-relation design generalizes.
- `†` = pre-training on LecSlides-370K then fine-tuning on SlideVQA (the paper prints the typo `SlidePraser` once).
- `†` gains (compiler-computed):
  - dev EM 44.1→49.8 (**+5.7**), dev F1 49.8→53.9 (**+4.1**).
  - test EM 37.5→42.4 (**+4.9**), test F1 43.9→47.7 (**+3.8**).
- Paper's conclusion: the large-scale, comprehensive LecSlides-370K yields a great performance enhancement and serves as a valuable large-scale pre-training dataset.

### 5.4 Ablation Study

#### 5.4.1 Effect of the Text Relation Prediction Module (Table 5)

- Target: LecSlides-370K Lecture Summary (split not stated. The values match val, so val is inferred, but [NOT IN SOURCE]).
- Conditions:
  - r1: RPH ✗, RAL ✗, Pseudo Label ✗.
  - r2: RPH ✓, RAL ✓, Pseudo Label ✗ (predicting/utilizing relations with no supervision).
  - r3: RPH ✗, RAL ✓, Pseudo Label ✓ (DL-Cluster pseudo-labels fed directly into RAL instead of learnable relations).
  - r4: all ✓ (learnable prediction + weak supervision).

| Condition | RPH | RAL | Pseudo | R-1 | R-L | METEOR |
|---|---|---|---|---:|---:|---:|
| r1 | ✗ | ✗ | ✗ | 36.3 | 22.6 | 26.9 |
| r2 | ✓ | ✓ | ✗ | 37.5 | 23.2 | 27.7 |
| r3 | ✗ | ✓ | ✓ | 41.8 | 25.0 | 30.8 |
| r4 | ✓ | ✓ | ✓ | **42.2** | **25.3** | **31.3** |

- Reading (paper):
  - r1, whole module removed → worst.
  - r2, unsupervised relations added → only slight improvement. Proves RPH struggles to converge to reasonable relations.
  - r3, pseudo-labels used directly → large improvement but still short of r4 (r3 vs. r4).
  - r4, learnable relations + weak supervision → best. Suggests learnable relations are refined during training.
- Gaps (compiler-computed):
  - r1→r4: R-1 +5.9, METEOR +4.4.
  - r2→r3: R-1 +4.3 → the weak-supervision labels themselves contribute the most.
  - r3→r4: R-1 +0.4, METEOR +0.5 → the extra gain from learnable refinement is small but consistent.

#### 5.4.2 Comparing pseudo-label clustering methods (Table 6)

| Cluster Type | R-1 | R-L | METEOR |
|---|---:|---:|---:|
| Kmeans (k=3) | 40.9 | 24.8 | 29.8 |
| Kmeans (k=4) | 40.7 | 24.7 | 29.6 |
| HAC (n=3) | 41.0 | 24.8 | 30.1 |
| DBSCAN | 41.3 | 24.8 | 30.6 |
| DL-Cluster | **42.2** | **25.3** | **31.3** |

- DL-Cluster beats fixed-cluster-count methods (K-means, HAC).
- It also beats unspecified-count methods (DBSCAN [6]). Reason: joint spatial + semantic consideration.
- HAC is printed as "Hierarchical Agglomerating Clustering" (the usual name is Agglomerative, but the paper's spelling is preserved).

#### 5.4.3 Spatial vs. semantic contribution in DL-Cluster (Table 7)

| Spatial | Semantic | R-1 | R-L | METEOR |
|---|---|---:|---:|---:|
| ✗ | ✓ | 38.3 | 23.7 | 28.5 |
| ✓ | ✗ | 41.4 | 24.8 | 30.7 |
| ✓ | ✓ | **42.2** | **25.3** | **31.3** |

- Removing either dimension degrades performance.
- Spatial relations matter more (spatial-only 41.4 vs. semantic-only 38.3).
- Best when combined → claimed mutually complementary.

### 5.5 Visualization / qualitative analysis (Fig. 5, Fig. 6, Section 5.4)

#### Fig. 5 — RPH predicted-relation visualization

- Text pairs with relation score above 0.5 are given the same color.
- Result: under weak supervision, RPH predicts reasonable text relations.
- Concrete slide contents/color counts cannot be recovered from extracted text alone. PDF comparison needed.

#### Fig. 6 — Lecture QA qualitative comparison

Two query examples (reconstructed extraction order):

**Example 1:**

- Q: "what are the potential characteristics for both disadvantages and advantages?"
- GT: "Diversity, Regional"
- T5: "Credibility, Diversity"
- mPLUG: "Diversity"
- UDOP: "Credibility, Logistics"
- Ours: "Diversity, Regional" (correct)

**Example 2:**

- Q: "what is the percentage of respondents who believe data center power consumption and cooling is a way to lower cost?"
- GT: "29%"
- T5: "15%"
- mPLUG: "40% and 50%"
- UDOP: "15%"
- Ours: "29%" (correct)

Two failure modes of other methods noted in the paper:

1. Failing to grasp the correct internal logic due to complex text relations.
2. As the number of diagrams on a slide grows, failing to pinpoint the diagram corresponding to the question.

In contrast, SlideParser easily locates the answer and responds accurately by understanding text relations.

### 5.6 Conclusion (Section 6)

- LecSlides-370K: larger scale, more diverse disciplines.
- SlideParser: accounts for the pivotal role of text-relation prediction and utilization.
- Demonstrates the effect of the text-relation-enhanced design and superiority over other models.
- Hope: LecSlides-370K and SlideParser will prompt lecture-slides research.

---

## 6. Limitations and Follow-ups

### 6.1 Paper-stated limitations [SOURCE-BASED]

- **[Source] No dedicated Limitations section.**
  - Neither Conclusion nor Experiments contains any explicit discussion of limitations, failure cases, ethics, or bias.
- **[Source] Indirectly visible open issues (paper's numbers/statements; readings are the compiler's):**
  - QA absolute performance is still low (LecSlides test EM 23.6 / F1 32.1). Even with relation modeling, roughly 3 of 4 fail exact match.
  - Unsupervised relation learning (r2) barely improves → the method depends strongly on pseudo-label quality (Table 5).
  - Learnable refinement (r3→r4) gains only R-1 +0.4 / METEOR +0.5 → possible limits of RPH learning.
  - No mention of data-construction filtering, annotation-generation procedures, or quality-validation numbers → reproducibility/reliability cannot be judged.

### 6.2 Methodological limitations in the compiler's view ([COMPILER NOTE] marking)

1. **[COMPILER NOTE] Lecture-slide domain bias**
   - Slideshare crawl + business over-representation, law/marketing under-representation → possible distribution gap vs. general presentations (investor IR, product pitches, conference posters, Typodeck targets).
   - Whether relations/summaries tuned to high-difficulty lecture text (FRES 34.3, Grade 14.1) transfer to short marketing copy and number-forward general slides is unverified.
2. **[COMPILER NOTE] Relations are binary and untyped**
   - The 0.5 binarization distinguishes only related/unrelated. No relation types such as hierarchy (title–body), parallelism (list items), reference (refer-to), or order (flow).
   - Typodeck's Spatial Relationship / Grouping needs directionality and type information, which this paper does not provide.
3. **[COMPILER NOTE] Fixed spatial (0.7) vs. semantic (0.3) weights**
   - β defaults are fixed, with no adaptation to document type or layout density.
   - Since spatial dominates, semantically linked distant elements (table–body citations, footnotes, appendix references) may be missed.
4. **[COMPILER NOTE] Opaque DL-Cluster hyperparameters**
   - N (reference-point count), distance normalization, voting rule, Sentence Transformer model name, and the rationale for the 0.5 threshold are all [NOT IN SOURCE].
   - The adequacy of the K=8 cap is not validated against the per-slide text-count distribution (Fig. 2(c)).
5. **[COMPILER NOTE] RAL hard-masking risk**
   - Blanket `-∞` below 0.5 fully blocks needed context on prediction errors. No comparison with soft weighting / confidence weighting.
6. **[COMPILER NOTE] No generation-loss weighting**
   - `L = L_ce + L_rel` is a plain sum, with no adjustment for scale/convergence-speed differences between relation and generation losses.
7. **[COMPILER NOTE] Understanding-only, irrelevant to layout generation**
   - Position annotations are only consumed as input; layout generation/modification/validation is not addressed. Not directly portable to Typodeck's Composition Engine — usable only as an understanding module.
8. **[COMPILER NOTE] Limits of the generation evaluation**
   - Summaries evaluated only by ROUGE/METEOR (surface overlap). Factuality, hallucination, key-point omission, and logical fidelity are unmeasured.
   - QA reports only EM/F1 — no breakdown by the 4 question types and no slide-localization accuracy.
9. **[COMPILER NOTE] Shallow visual-element modeling**
   - Diagram/illustration/table positions are annotated, but the relation model covers text–text only. Text–chart / text–table relations are outside RPH's scope.
   - The paper notes diagram-localization failures (Fig. 6) yet provides no quantitative visual-grounding evaluation.
10. **[COMPILER NOTE] Data-construction reproducibility**
    - Slideshare crawl date, license, filter criteria, chunking algorithm (automatic/manual), summary/QA authors (experts/crowd/LLM) are all [NOT IN SOURCE].
    - Copyright/redistribution terms are also [NOT IN SOURCE] → the GitHub license must be checked before using it as Typodeck training data.

### 6.3 Follow-up proposals ([COMPILER NOTE]/[SPECULATION] marking)

- **[COMPILER NOTE]** Extend to typed relations (hierarchy/parallelism/reference/order) + directional prediction. Directly aligns with Typodeck Grouping/Structure Understanding.
- **[COMPILER NOTE]** Extend RPH to text–visual relations (caption–chart, label–table-cell).
- **[COMPILER NOTE]** Report performance breakdowns by QA type, chunk length, and domain.
- **[COMPILER NOTE]** Add factuality/hallucination evaluation (entailment, LLM-as-judge) and human evaluation.
- **[SPECULATION]** Adaptive β (spatial↑ for dense slides, semantic↑ for conceptual slides) may generalize better, but there is no source basis.

---

## 7. Relevance to Typodeck

Typodeck context assumed: `Slide Markdown → Slide IR (versioned intermediate representation) → Composition Engine → natively editable PPTX`, Visual Critic (image+structure hybrid evaluation), Grammar Registry (versioned visual system), Validation-Repair gates, 38 Composition Candidates, reference-slide reproduction benchmark, goal `Valid PPTX → Good Layout → Intended Visual Hierarchy (intended semantic importance ≡ perceived visual importance)`.

### 7.1 Direct connections (paper-evidence-based)

1. **Empirical evidence for modeling relations between text elements**
   - The paper's core thesis: grasping complex text relations is the key to slide understanding (Introduction, Section 4.2).
   - Typodeck's Structure Understanding / Grouping tackles the same problem from the generation side. Understanding→generation symmetry is achievable.
   - Table 5 r1→r4 (R-1 +5.9, METEOR +4.4) is quantitative evidence for the value of relation modeling.
2. **Spatial+semantic dual relations (DL-Cluster) ≈ Typodeck's hybrid-evaluation philosophy**
   - DL-Cluster combines spatial clustering (layout proximity / same group) with semantic similarity (Sentence Transformer) via β weighting.
   - Aligns with the Visual Critic's image+structure hybrid and the Grammar Registry's visual system. In particular, "removing spatial drops R-1 42.2→38.3 (−3.9); removing semantic drops 42.2→41.4 (−0.8)" (Table 7) shows spatial layout's dominant contribution, matching Typodeck's layout prioritization.
3. **The relation-utilization mechanism (RAL) informs Grouping/attention design**
   - RAL builds an attention mask from the relation matrix → information flows only among related elements.
   - The same principle (cohesion within related groups, isolation across unrelated groups) applies to the Typodeck Composition Engine's element grouping/alignment/hierarchy decisions. But the paper's hard mask is for understanding; generation needs a soft version (§7.3).
4. **Chunks (same sub-topic) ≈ the semantic unit of Slide IR**
   - LecSlides lecture chunks preserve meaning continuity (e.g., progressive list reveal) as the segmentation unit.
   - Applicable to semantic-unit split/merge rules in Typodeck's Slide Markdown→IR conversion. The mean 3.2 / mode 2 chunk size is a starting point for IR chunk-size defaults.
5. **4 QA types ≈ Visual Critic / Validation check dimensions**
   - textual reasoning 64% / visual analysis 18% / data interpretation 14% / binary choice 4%.
   - Mappable to the Typodeck reproduction benchmark's evaluation rubric (text logic / visual correspondence / data accuracy / binary fitness).
6. **Expertise indicators (FRES/Grade) as a precedent for difficulty labeling**
   - FRES 34.3 (Hard), Grade 14.1. The same indicators can tag difficulty/domain in the Typodeck reference-slide benchmark.

### 7.2 Concrete application ideas (in priority order)

1. **Introduce an RPH-style pseudo-label pipeline into the Slide IR relation layer**
   - Input: IR element boxes+text → DL-Cluster-style spatial clustering + embedding similarity → element relation graph (related/unrelated).
   - Use: grouping priors for the 38 Composition Candidates; priors for alignment/spacing decisions.
   - Expected: relation-group-based layout candidate pruning → better search efficiency.
   - Caveat: β/K/thresholds need re-tuning from lecture to general slides (§7.3).
2. **Add relation-consistency checks to the Validation-Repair gate**
   - Checks: whether logically related elements are visually isolated (a disconnect in distance/color/size), whether unrelated elements are misleadingly close/homogeneous.
   - Convert the paper's Fig. 1(b) case (upper-left requirements vs. per-block stage descriptions) into negative/positive patterns.
   - Metrics: within-relation-group dispersion (spatial+style) vs. across-group separation.
3. **Define an intent–perception hierarchy-match score in the Visual Critic**
   - Borrow the paper's dual Summary (global key extraction) + QA (detailed locating) evaluation:
     - Global: do the top IR-semantic-importance elements match the top visual-importance (size/contrast/position) elements?
     - Detailed: for a specific query (e.g., "what supports the key number?"), is the answering element visually locatable?
   - Converts to a measurement operator for Typodeck's goal `Intended ≡ Perceived`.
4. **Port LecSlides-style segmentation/metrics to the reference-slide reproduction benchmark**
   - Same-sub-topic chunking principle → reproduction-unit definition.
   - Summary-likes: ROUGE/METEOR + human/LLM factuality; QA-likes: EM/F1 + element-location accuracy.
5. **Version relation–style rules in the Grammar Registry**
   - E.g., versioned rules like `relation.spatial.same-cluster → spacing.compact`, `relation.semantic.high + spatial.far → style.bridge(connector|color-link)`.
   - Elevates the paper's spatial/semantic dualism into style grammar.
6. **Consider LecSlides-370K as pre-training data (conditional)**
   - The Table 4 `†` result (pre-training: test EM +4.9, F1 +3.8) evidences transfer value.
   - But only after checking lecture-domain bias and licensing, and premised on mixing/domain adaptation with Typodeck's target distribution.

### 7.3 Caveats / critical review

1. **Domain transfer gap**
   - Lecture slides (concept delivery, lists, flow charts) vs. Typodeck outputs (IR→PPTX generation; marketing/IR/reporting general use). Layout vocabulary and emphasis strategies differ.
   - Learning the business-heavy, law/marketing-light distribution as-is may bias layouts toward specific domains.
2. **Never port the understanding hard mask directly into generation**
   - RAL's `-∞` blocking suits understanding (noise removal), but in generation (new-layout search) it prematurely prunes possibilities.
   - [SPECULATION] A soft-weighting / constraint-relaxation (constraint penalty) form suits generation, but there is no source basis.
3. **Expressiveness limits of untyped relations**
   - Typodeck Grouping/Structure Understanding hinges on hierarchy/order/reference direction, but the paper provides only undirected binary relations.
   - Used as-is: "relatedness known, but not how to group." Hard to wire directly into Grammar rules without typed extension.
4. **Pseudo-label dependence and reproduction opacity**
   - Weak supervision contributes almost everything in Table 5 (r2→r3 +4.3), yet N/normalization/model name/rules are undisclosed → no guarantee of reproducing the same performance.
   - Adopting it in Typodeck incurs reimplementation/tuning cost for a dedicated pseudo-label pipeline.
5. **Visual-element relation gap**
   - RPH models text–text only. Chart/table/illustration↔text links are unsolved → a gap when applied to Typodeck, where data slides/infographics dominate.
6. **Superficiality of evaluation metrics**
   - ROUGE/METEOR/EM/F1 do not measure layout or visual-hierarchy quality. They do not connect directly to Typodeck's `Good Layout → Intended Hierarchy` goal.
   - When citing, do not confuse "understanding performance" with "generation/layout quality."
7. **Licensing/ethics**
   - Redistribution/commercial terms of the Slideshare crawl are [NOT IN SOURCE]. Do not adopt for training/benchmarking before checking the GitHub/HF license.

---

## 8. Citation Points (3 candidate claims for the Typodeck paper)

### Citation 1 — Text-relation modeling is the crux of slide understanding/generation

- **Claim (draft):** "Slides' compressed, headline-style text and complex text relations are the key obstacle to grasping internal logic, and relation modeling directly determines understanding performance."
- **[SOURCE-BASED]:**
  - Section 1: "Texts in slides are often conclusive and headline-style statements…" + "complex text relations pose additional challenges… to grasp the internal logic."
  - Sections 1/4.2: "understanding complex text relations… is the key part of understanding slides."
  - Table 5: removing relation modules (r1) R-1 36.3 → full model (r4) 42.2 (**+5.9**), METEOR 26.9→31.3 (**+4.4**).
- **Typodeck bridge sentence (draft):** "We reverse this relation for generation: an IR element relation graph is injected into the Composition Engine as a grouping/layout prior, aiming to align intended semantic structure with perceived visual structure."
- **Caveat:** the source is understanding-only. Generation-transfer claims go beyond this paper's evidence, so frame them as "inspired by."

### Citation 2 — Spatial+semantic dual relations are complementary, with spatial dominant

- **Claim (draft):** "Slide element relations are best captured by combining spatial layout with semantic similarity, with spatial structure contributing most."
- **[SOURCE-BASED]:**
  - Section 4.2.2 DL-Cluster: `s = 0.7·Norm(s_spa) + 0.3·Norm(s_sem)`, 0.5 binarization.
  - Table 7: combined R-1 42.2 vs. spatial-only 41.4 vs. semantic-only 38.3. Removing spatial: −3.9; removing semantic: −0.8.
  - Table 6: DL-Cluster 42.2 beats K-means (k=3) 40.9 / (k=4) 40.7 / HAC 41.0 / DBSCAN 41.3.
- **Typodeck bridge sentence (draft):** "This is empirical support for Typodeck's image+structure hybrid evaluation and the Grammar's space-first rule design."
- **Caveat:** β=0.7/0.3 is a fixed lecture-slide value. State explicitly that it is not optimal for general slides.

### Citation 3 — Pre-training transfer value of large slide corpora + detailed-text weakness of pure VL models

- **Claim (draft):** "Pre-training on a large slide corpus transfers to external slide QA, while pure vision-language models underperform for lack of detailed slide-text extraction."
- **[SOURCE-BASED]:**
  - Table 4: LecSlides pre-training→SlideVQA fine-tuning (`†`): test EM 37.5→42.4 (**+4.9**), F1 43.9→47.7 (**+3.8**). Scale vs. SlideVQA: 9.7× lectures, 7.1× slides (Section 3.1, Fig. 1).
  - Tables 2–3: vision-heavy models (Vid2Seq, mPLUG, …) rank bottom on both Summary and QA. Paper's reading: "only processing visual modality may lead to a lack of detailed content extraction."
  - Data scale: 25,542 lectures / 370,078 slides / 15 areas / 114,472 summaries / 259,461 QAs (Table 1).
- **Typodeck bridge sentence (draft):** "Our pipeline therefore keeps IR text/structure as first-class inputs rather than relying only on rendered-visual evaluation, and evaluates the benchmark separately along text-logic / visual-correspondence / data-accuracy dimensions."
- **Caveat:** the transfer experiment is understanding→understanding. Understanding→generation transfer has no source basis. Never state it without a "conjecture" marking.

---

## Appendix A. Quick Number Cross-Check

| Item | Value | Source |
|---|---:|---|
| Lectures / slides / areas | 25,542 / 370,078 / 15 | Abstract, Table 1 |
| Raw crawl | 39,784 lectures, 720,673 slides | §3.1 |
| Chunks / mean size / mode | 114,472 / 3.2 / 2 | §3.1, §3.3.3, Fig. 2(b) |
| Summaries / QAs | 114,472 / 259,461 | §3.2, Table 1 |
| diagrams / illustrations / tables | 94,906 / 34,562 / 18,938 | §3.3.3 |
| Total words / mean / vocab | 28,220,274 / 76.2 / 84,630 | §3.3.3 |
| Mean summary length / mean answer length | 124.6 words / 4.1 words | §3.3.4 |
| QA types (TR/VA/DI/BC) | 64% / 18% / 14% / 4% | Fig. 2(e) |
| FRES / FK Grade | 34.3 Hard / 14.1 | §3.3.2 |
| Split train/val/test | 109,472 / 2,000 / 3,000 chunks | §3.4 |
| Vs. SlideVQA | 9.7× lectures, 7.1× slides | §3.1, Fig. 1 |
| LR / iterations / AdamW | 4e-5 / 41K / (0.9, 0.999, wd 0.02) | §5.1 |
| DL-Cluster K / β1 / β2 / threshold | 8 / 0.7 / 0.3 / 0.5 | §4.2.2 |
| Summary test (SlideParser) | R-1 41.7, R-L 24.7, METEOR 30.4 | Table 2 |
| QA test (SlideParser) | EM 23.6, F1 32.1 | Table 3 |
| SlideVQA test (SlideParser†) | EM 42.4, F1 47.7 | Table 4 |

## Appendix B. [NOT IN SOURCE] List (check before reproducing/citing)

- Slideshare crawl date, crawl scope, license, redistribution terms.
- Ad/extraneous-info filter rules; chunking automatic/manual status and algorithm.
- Position/text annotation pipeline (OCR engine, manual, model+review) and quality metrics.
- Summary/QA authors (experts/crowd/LLM), guidelines, review, agreement.
- Annotation file schema (JSON etc.), HuggingFace path, full training hyperparameters (batch, GPUs, epochs, sequence length, resolution).
- DL-Cluster N, Norm kind, voting rule, Sentence Transformer model name, rationale for 0.5, RAL layer count N, concat details.
- Breakdowns by type/length/domain, statistical significance, human evaluation, failure cases, Limitations/ethics discussion.

## Appendix C. Reading-Limitation Notice

- Owing to two-column pdftotext extraction, Fig. 1–Fig. 4 captions, table-cell order, and equation subscripts are partly scrambled. The above is a context-based reconstruction.
- [CORRECTED: during verification, the Eq. 1 fourth-term duplication and the `M` formula were checked against rendered PDF p. 4459 — the duplication is in the published PDF itself (presumed typo for `log(h_i/h_j)`), while the `M` formula renders correctly as `M = H/P × W/P`; Table 1 OCR glyphs were checked against rendered PDF p. 4457 (✓ except ALV ✗).]
- Author names, numbers, and table values were cross-checked exhaustively against the extracted text. Ambiguous denominators (e.g., mean 76.2 words) carry inference markings.
- CVF/HuggingFace exact URLs are not in the paper and hence not given. Only GitHub is cited as the paper-stated URL.
