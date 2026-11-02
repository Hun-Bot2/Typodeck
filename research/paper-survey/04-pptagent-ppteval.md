# PPTAgent Paper: Full Summary (for Typodeck)

> Verification basis: EMNLP 2025 proceedings version (ACL), pp. 14402–14418 (17 pages),
> PDF sha256 `5fb9c54c…bd31a`, verified page by page.
> The Korean survey was written from the arXiv HTML conversion (v3); table/figure numbers,
> author list, and the Limitations section differ in the ACL version. All such differences are
> marked [CORRECTED] inline with the ACL location. "PDF p.X" below means the printed
> proceedings page number.

## 0. Bibliographic Information

- **Title:** PPTAgent: Generating and Evaluating Presentations Beyond Text-to-Slides
- **Authors:** Hao Zheng*, Xinyan Guan* (*equal contribution), Hao Kong, Wenkai Zhang, Jia Zheng, Weixiang Zhou, Hongyu Lin, Yaojie Lu, Xianpei Han, Le Sun [CORRECTED: ACL version adds Wenkai Zhang and drops Ben He vs. the survey's arXiv author list | PDF p.14402]
- **Affiliations:** Chinese Information Processing Laboratory, Institute of Software, Chinese Academy of Sciences / University of Chinese Academy of Sciences / Shanghai Jiexin Technology
- **Venue/Year:** EMNLP 2025 (Main), pp. 14402–14418.
- **Links:** ACL PDF (verified); arXiv `2501.03936` (fallback, 16 pages, sha256 `c9566cb1…6e25`).
- **Code/Data:** https://github.com/icip-cas/PPTAgent — PPTAgent and PPTEval codebases plus the new Zenodo10K dataset (stated in Abstract/§1).
- **Dataset:** Zenodo10K — 10,448 presentations curated from Zenodo (European Organization for Nuclear Research and OpenAIRE, 2013), only artifacts with clear licenses.

---

## 1. Summary at a Glance (5 sentences)

1. This paper reframes document-to-presentation generation not as text-to-slides (summarize, then convert via templates/rules) but as a **reference-based two-stage editing (edit-based) process** inspired by human workflows.
2. The proposed **PPTAgent** analyzes a reference presentation in Stage I (slide clustering + content schema extraction), then in Stage II drafts an outline and creates each new slide by applying a sequence of executable editing actions (code) to a selected reference slide.
3. Instead of XML, it uses an **HTML rendering representation + edit APIs + REPL execution-feedback self-correction (max 2 iterations per slide)** so the LLM edits robustly while preserving layout and style.
4. For evaluation it proposes **PPTEval**, a reference-free three-dimension framework (**Content, Design, Coherence; 1–5 scale + rationales**). Content and Design are averaged at slide level; Coherence is assessed at whole-presentation level.
5. In experiments PPTAgent beat the baselines (rule-based DocPres, template-based KCTV) significantly on all three dimensions (representative average 3.67, Coherence 4.48, success rate ≥95%), and PPTEval showed an average Pearson correlation of 0.71 with human judgments, complementing/replacing inconsistent legacy metrics (PPL, ROUGE-L, FID).

---

## 2. Research Problem and Background

### 2.1 Task: automatic presentation generation from documents

- Presentations are a widely used medium for information delivery, valued for visual effectiveness in engaging audiences (Introduction, citing Fu et al., 2022).
- Creating a high-quality presentation simultaneously requires three things (Introduction):
  1. a captivating storyline,
  2. well-designed layouts,
  3. rich, compelling content.
- Hence growing interest in full-pipeline automation leveraging the generalization of LLMs/MLLMs (Mondal et al., 2024; Maheshwari et al., 2024; Ge et al., 2025).

### 2.2 Limitation 1 of the old paradigm: text-to-slides = abstractive summarization + rule/template conversion

- Existing approaches typically follow the **text-to-slides paradigm**: generated text is converted into slides via a limited set of human-defined rules or templates (Introduction, Figure 1).
- Prior work (Mondal et al., 2024; Sefid et al., 2021) treats presentation generation like an **abstractive summarization** task, text-content-centric, without holistic planning.
- The result is **text-heavy, fragmented** slides that fail to engage audiences (Barrick et al., 2018), ignoring the **visual-centric nature** of presentations (Fu et al., 2022).
- Related-work (§5 in ACL version) taxonomy:
  - **Rule-based:** Mondal et al., 2024; Bandyopadhyay et al., 2024 (DocPres). Text-enhancement-centric, visually neglectful, unengaging outputs.
  - **Template-based:** Cachola et al., 2024 (KCTV), industrial systems such as Tongyi (Alibaba). Visually better but dependent on extensive manual template annotation, limiting scalability and flexibility.

### 2.3 Limitation 2: evaluation covers content only, and only fragmentarily

- Problem statement (Abstract/Introduction): existing methods focus **in isolation on improving and evaluating content quality**, overlooking visual appeal and structural coherence, which limits practical applicability.
- The absence of a comprehensive evaluation framework is the paper's other starting point. Legacy metrics (PPL, ROUGE-L, FID) trend inconsistently with PPTEval/human judgment (§4.5, §4.7).

### 2.4 Inspiration from human workflows

- Humans do not build complex presentations from scratch in one shot. They **select exemplary slides as references and transfer key content onto them** (Duarte, 2010).
- PPTAgent therefore decomposes slide creation into (1) reference-slide selection and (2) stepwise editing.
- Figure 2 overview: in Stage I reference slides are categorized (e.g., opening slide, bullet-point slide); for each new slide an appropriate reference is chosen and modified with editing actions such as `replace_span`. (PDF p.14403 / Figure 2.)

### 2.5 Two challenges of the edit-based approach (stated in Introduction)

1. **Reference-selection difficulty:** the functional diversity and layout complexity of presentations make it hard for LLMs to directly decide which slide to reference. The key is improving LLM understanding of the reference presentation's structure and content patterns.
2. **Editing-execution difficulty:** most presentations are stored in PowerPoint's verbose, redundant XML format (Gryk, 2022). As Figure 11 shows, a single slide's XML runs to 1,006 lines, which hinders robust LLM editing.

---

## 3. Core Contributions (§1 list, verbatim + elaboration)

1. **PPTAgent:** a framework that redefines automatic presentation generation as an edit-based process guided by reference presentations.
2. **PPTEval:** a comprehensive evaluation framework assessing presentations on Content, Design, and Coherence.
3. **Code/data release:** the PPTAgent/PPTEval codebases and the new **Zenodo10K** presentation dataset to support future research.

---

## 4. Methodology Details

Follows the paper order §2 (PPTAgent) → §3 (PPTEval) → Appendices D/E/B/F.

### 4.1 Problem formulation (§2.1, Equations 1–2)

- **Conventional approach (Eq. 1):** given input content C, directly generate n slide elements.
  - `S = {e1, e2, ..., en} = f(C)`
  - Each element is defined by type, content, and styling attributes, e.g. `(Textbox, "Hello", {size, position, ...})`. [CORRECTED: attribute set is {size, position, ...}, no "border" | PDF p.14404 / §2.1]
  - Simple, but requires manual specification of styling attributes, which is hard for automated generation (Guo et al., 2023).
- **PPTAgent approach (Eq. 2):** given input content C and the j-th reference slide Rj selected from the reference presentation, generate a sequence of m executable actions.
  - `A = {a1, a2, ..., am} = g(C, Rj)`
  - Each action ai corresponds to one line of executable code.
  - Because it edits a reference slide instead of creating from scratch, well-designed layouts/styles are preserved.

### 4.2 Stage I: Presentation Analysis (§2.2)

Goal: understand the reference presentation to assist reference selection and slide generation. Two sub-steps.

#### 4.2.1 Slide Clustering

- Slides are split by functionality into two broad classes:
  - **structural slides:** support the presentation's organization (e.g., opening slide),
  - **content slides:** convey specific information (e.g., bullet-point slide).
- **Structural slides:** leverage the LLM's long-context capability to analyze all slides in the input presentation, identify structural slides, then label their structural roles from textual features and group them.
- **Content slides:**
  1. convert slides to images,
  2. group similar slide images via hierarchical clustering,
  3. analyze converted images with an MLLM to identify the layout pattern of each cluster.
- Details (Appendix D + Algorithm 1):
  - Similarity threshold **θ = 0.65**.
  - Preprocessing to focus on layout only: text content replaced with the placeholder character ("a"), image elements replaced with solid-color backgrounds.
  - Pairwise slide similarity matrix computed with cosine similarity over **ViT embeddings** (Wu et al., 2020) of the converted slide images.
  - Algorithm 1 (verbatim): input similarity matrix S ∈ R^{N×N}. While `max(S) ≥ θ`, find the most similar pair (i,j); merge into an existing cluster if either belongs to one, else create a new cluster. Zero out used rows/columns and repeat. Example clusters in Figure 9.
- Prompts: Appendix F.1, Figure 12 (structural-slide clustering), Figure 13 (layout-pattern inference). [CORRECTED: full prompt texts ARE present in the ACL PDF as selectable figure text | PDF p.14416]

#### 4.2.2 Schema Extraction

- After clustering, extract a content schema per cluster capturing **content organization**. Provides a clear, structured description of slide elements.
- Extraction framework: each element represented by **category, description, and content**.
- Verbatim example (ACL Table 1):

  | Category | Description | Data |
  |---|---|---|
  | Title | Main title | Sample Library |
  | Date | Date of the event | 15 February 2018 |
  | Image | Primary image to illustrate the slide | Picture: Children in a library with ... |

  [CORRECTED: column attribution resolved — Category/Description/Data as shown; the survey's HTML reading (empty third column) was a conversion artifact | PDF p.14404 / Table 1]
- The Appendix F extraction prompt (Figure 14) specifies per-element `description` (purpose only), `type` (text/image), and `data` (text or `<type>:<50-word description>`). [CORRECTED: prompt text present in ACL PDF | PDF p.14416 / Figure 14]
- Role: used as per-slide functional descriptions for reference selection and as guidance for slide generation (ablation: removing it drops success rate).

### 4.3 Stage II: Presentation Generation (§2.3)

Goal: draft an outline first, then iteratively edit the matching reference slide per entry via the edit APIs to build the target presentation.

#### 4.3.1 Outline Generation

- As in Figure 2, **the LLM constructs a structured presentation outline** of multiple entries.
- Each entry specifies, for one new slide: the slide's **purpose**, its **reference slide**, and the **relevant content** to retrieve from the input document (leveraging Stage-I functional understanding plus document structure and image captions).
- Prompt: Appendix F.2, Figure 15 (per-slide title + layout-from-allowed-list + description, JSON output). [CORRECTED: prompt text present in ACL PDF | PDF p.14416 / Figure 15]

#### 4.3.2 Slide Generation

- Guided by the structured outline, slides are generated **iteratively** entry by entry.
- For each slide the LLM combines the input document's text content + extracted image captions.
- New slides adopt the reference slide's layout while keeping content consistency and structural clarity.
- **Edit-based API design (ACL Table 2, exact names):**
  - `del_span` — Delete a span.
  - `del_image` — Delete an image element.
  - `clone_paragraph` — Clone an existing paragraph.
  - `replace_span` — Replace the content of a span.
  - `replace_image` — Replace the source of image.
  - [CORRECTED: exact function names resolved; "duplicate" op is `clone_paragraph` | PDF p.14405 / Table 2]
- **HTML rendering representation:** because of presentation-XML complexity (Appendix E), reference slides are rendered into an **HTML representation** (Feng et al., 2024) via rule-based conversion — more precise and intuitive. HTML + edit APIs enable fine-grained programmatic editing.
- **Appendix E code interaction:** Figure 10 is the HTML render example; Figure 11 is the first 60 lines of the same slide's XML representation (out of 1,006 lines total). Evidence of XML verbosity.
- **Self-correction mechanism** (adapted from Kamoi et al., 2024):
  - Generated editing actions are executed in a **Python REPL environment** (paper footnote: Wikipedia REPL).
  - On invalid operations (e.g., editing nonexistent elements), the interpreter returns **runtime error messages** (footnote: Python docs errors), appended to the conversation history as context.
  - The LLM analyzes the feedback and adjusts the editing actions (Guan et al., 2024; Wang et al., 2024b), refining iteratively until valid slides result or the retry limit is reached.
  - Experiment setting: **max 2 self-correction iterations per slide generation** (§4.2).
- Related prompts: Figure 16 (slide content generation), Figure 17 (editing-action generation; command format `(element_class, type, quantity_change, old_data, new_data)` with quantity-adjustment then content-replacement steps). [CORRECTED: prompt texts present in ACL PDF | PDF pp.14416–14417]

### 4.4 PPTEval (§3 + Appendix C + Appendix F.3)

#### 4.4.1 Design philosophy

- A comprehensive framework filling the **absence of label-free evaluation** for presentations. (ACL wording is "label-free"; the survey's "reference-free" matches the arXiv text.)
- Adopts the **MLLM-as-a-judge paradigm** (Chen et al., 2024a).
- Per dimension provides a **numeric score (1–5 scale) + detailed rationales**.
- Grounded in established presentation design principles (Duarte, 2008; Duarte, 2010). Focuses on three key dimensions.
- Evaluation unit: given a generated presentation, **content/design at slide level**, **coherence across the entire presentation**.
- Full process in Figure 3; representative scoring examples and criterion details in Appendix C and Figure 8.

#### 4.4.2 Dimension definitions (ACL Table 3 + Appendix C)

1. **Content:**
   - Table 3 criterion: "Text should be concise and grammatically sound, supported by relevant images."
   - Appendix C: evaluates information on slides (text + images) from three perspectives: amount of information; clarity and quality of textual content; support provided by visual content.
   - High-quality text = clear, impactful, proper amount of information. Images should complement/reinforce text, making information more accessible and engaging.
   - Method: evaluate with **MLLMs on slide images**, since slides cannot be easily comprehended in plain-text format.
2. **Design:**
   - Table 3 criterion: "Harmonious colors and proper layout ensure readability, while visual elements like geometric shapes enhance the overall appeal."
   - Appendix C: good design captures attention and enhances delivery. Three aspects: color schemes (clear contrast to highlight content while maintaining harmony); visual elements (geometric shapes etc. for expressiveness); overall design (basic principles — **avoid overlapping elements**, design must not interfere with content delivery).
3. **Coherence:**
   - Table 3 criterion: "Structure develops progressively, incorporating essential background information."
   - Appendix C: essential for audience engagement. Assessed on logical structure + contextual information provided. Good coherence = captivating storyline enriched with contextual information so the audience follows seamlessly.
   - Method: analyze the logical structure and contextual information extracted from the presentation.
   - All on the 1–5 scale. Full 1–5 rubrics per dimension are printed in Figures 21/22/23. [CORRECTED: rubric texts present in ACL PDF | PDF pp.14417–14418]

#### 4.4.3 PPTEval procedure, scoring, and human validation

- **Judge model:** §4.4 states PPTEval uses **GPT-4o** as the judging model.
- **Aggregation:** content/design scores averaged across slides; coherence assessed at presentation level (§4.4).
- **Human validation (Appendix C):**
  - Four graduate students recruited via a Shanghai-based crowdsourcing platform.
  - 250 presentations evaluated: 50 sampled from Zenodo10K (real-world) + 100 baseline-generated + 100 proposed-method-generated.
  - Assessed on three dimensions using the Appendix F criteria; converted slide images provided; scored individually then discussed to consensus.
  - Inter-rater agreement: Fleiss' Kappa average **0.59** (Content 0.61, Design 0.61, Coherence 0.54) — satisfactory agreement (citing Kwan et al., 2024).
- **PPTEval prompts:** Figures 18 (content description), 19 (style description), 20 (content extraction: per-slide summary + background metadata), 21 (content judging), 22 (style judging), 23 (coherence judging). [CORRECTED: full prompt texts present in ACL PDF | PDF pp.14417–14418]

---

## 5. Experimental Results Details

Note: ACL table/figure numbers differ from the survey's arXiv numbering. Mapping: survey Table 2 → ACL Table 4 (dataset stats); Table 3 → Table 5 (main results); Table 4 → Table 7-upper (ablation); Table 5 → Table 8 (correlations); Table 6 → Table 10 (weighted); Table 7 → Table 11 (weighted ablation); Table 8 → Table 9 (domains). Survey Figure 4 → ACL Figure 7 (score distribution); Figure 5 → Figure 5 (case study, same); Figure 6 → Figure 4 (self-correction iterations); Figure 7 → Figure 6 (metric heatmap); Figure 8 → Figure 8 (scoring examples, same). The ACL version adds: Table 6 (error-type distribution), Table 7-lower (controlled experiments vs. KCTV template + human-authored), Table 8-upper (reference-vs-generated correlation), and Figure 4 (self-correction iteration counts).

### 5.1 Dataset (§4.1 + Appendix A + ACL Table 4)

- **Two problems with existing datasets:**
  1. PDF/JSON storage loses semantic information (structural relationships between elements, styling attributes).
  2. Mostly AI-domain academic presentations, lacking diversity.
  - Affected datasets: Mondal et al., 2024; Sefid et al., 2021; Sun et al., 2021; Fu et al., 2022.
- **New Zenodo10K:**
  - Sourced from Zenodo (artifacts across domains, all under clear licenses).
  - **10,448 presentations** curated and publicly released.
- **Experiment sampling:** following Mondal et al., 2024, per each of **5 domains, 10 input documents** (content source) **and 10 reference presentations** (style/structure guidance) — i.e., 50 reference presentations and 50 input documents total.
  - 5 domains: **Culture, Education, Science, Society, Tech**.
  - Sampling criteria/preprocessing in Appendix A; statistics in Table 4.
- **ACL Table 4 statistics (domain mapping fully resolved):** columns = Domain | Document #Chars | Document #Figs | Presentation #Chars | Presentation #Figs | #Pages:

  | Domain | Doc #Chars | Doc #Figs | Pres #Chars | Pres #Figs | #Pages |
  |---|---|---|---|---|---|
  | Culture | 12,708 | 2.9 | 6,585 | 12.8 | 14.3 |
  | Education | 12,305 | 5.5 | 3,993 | 12.9 | 13.9 |
  | Science | 16,661 | 4.8 | 5,334 | 24.0 | 18.4 |
  | Society | 13,019 | 7.3 | 3,723 | 9.8 | 12.9 |
  | Tech | 18,315 | 11.4 | 5,325 | 12.9 | 16.8 |

  [CORRECTED: domain-row mapping and the two missing columns (Pres #Figs, #Pages) resolved | PDF p.14406 / Table 4]
- **Appendix A preprocessing:**
  - Cost control: **12–64-page presentations**, **2,048–20,480-character documents**.
  - VikParuchuri (2023, marker) used to extract text + visual content from source documents. Text organized into sections. Visual content: **Qwen2-VL generates image captions** guiding image selection. [CORRECTED: caption model is Qwen2-VL, which the survey omitted | PDF p.14413 / Appendix A]
  - Dedup: duplicate images with embedding cosine similarity **above 0.85** removed. Slide level: slides with text-embedding similarity to the preceding slide **over 0.8** removed (per Fu et al., 2022).

### 5.2 Implementation details (§4.2)

- **Three models used:**
  - GPT-4o-2024-08-06 (GPT-4o),
  - Qwen2.5-72B-Instruct (Qwen2.5, Yang et al., 2024),
  - Qwen2-VL-72B-Instruct (Qwen2-VL, Wang et al., 2024a).
- Models distinguished by handled modality (text/visual); notation is language-model (LM) + vision-model (VM) combos, e.g. `Qwen2.5_LM + Qwen2-VL_VM`.
- **Task scale:** 5 domains × 10 input documents × 10 reference presentations = **500 generation tasks per configuration**.
- **Max 2 self-correction iterations** per slide generation.
- Text embeddings: Chen et al., 2024b (BGE M3-embedding). Image embeddings: Wu et al., 2020.
- Open-source LLMs deployed with **VLLM** (Kwon et al., 2023) on **NVIDIA A100** GPUs.
- Total compute cost approx. **500 GPU hours**.

### 5.3 Baselines (§4.3)

- **DocPres** (Bandyopadhyay et al., 2024): multi-stage **rule-based** approach generating narrative-rich slides; similarity-based image integration.
- **KCTV** (Cachola et al., 2024): **template-based** method creating slides in an intermediate format, then converting to final presentations with predefined templates.
- Baselines run without vision models (they do not process visual information).
- Needing no reference presentations, each baseline configuration generates **50** presentations (5 domains × 10 documents). FID evaluation therefore excluded for baselines.

### 5.4 Evaluation metrics (§4.4)

1. **Success Rate (SR, %↑):** generation robustness (Wu et al., 2024). Percentage of successfully completed tasks.
   - PPTAgent: success = all slides generated without execution errors after self-correction.
   - KCTV: success = generated LaTeX file compiles.
   - DocPres: excluded (deterministic rule-based conversion).
2. **Perplexity (PPL↓):** likelihood of the model generating the given sequence. **Llama-3-8B** (Dubey et al., 2024) averaged over all slides in a presentation. Lower = more fluent text (per DocPres paper).
3. **Rouge-L** (Lin, 2004): longest-common-subsequence text similarity; **original documents used as reference** (no golden labels); **F1 reported**.
4. **FID** (Heusel et al., 2017): visual similarity between generated and reference presentations in feature space. (§4.4; the "64-dim output vector" detail from the survey's arXiv reading does not appear in the ACL §4.4 text. [COMPILER NOTE])
5. **PPTEval:** GPT-4o as judge on three dimensions; content/design averaged over slides, coherence at presentation level.

### 5.5 Overall results (§4.5 + Tables 5/9/10; ACL numbering)

#### 5.5.1 PPTAgent significantly improves overall quality

Paper prose values verbatim (stated as statistically significant; the test method itself is [NOT IN SOURCE]):

- **vs DocPres (rule-based):**
  - Paper: design and content `(3.34 vs. 2.37, +40.9%; 3.28 vs. 2.98, +10.1%)`.
  - [CORRECTED: content gain is +10.1%, not the survey's +12.1%; and the second pair's PPTAgent value is 3.28 (content), not 3.34 — the survey's HTML reading duplicated 3.34 | PDF p.14407 / §4.5, confirmed against Table 5]
  - Per Table 5: DocPres rows are GPT-4o (Content 2.98 / Design 2.33 / Coherence 3.24 / Avg 2.85) and Qwen2.5 (2.96 / 2.37 / 3.28 / 2.87). [COMPILER NOTE] The headline "3.34" design score comes from the Qwen2-VL_LM+Qwen2-VL_VM PPTAgent row (SR 43.0), while 3.28/4.48 come from the Qwen2.5_LM+Qwen2-VL_VM row — the paper's §4.5 comparisons mix PPTAgent configurations, and mix baseline LM rows (2.37 from Qwen2.5-DocPres vs. 2.98 from GPT-4o-DocPres). Trend (design improves most, +40.9%) is as stated.
- **vs KCTV (template-based):**
  - Paper: design and content `(3.34 vs. 2.95, +13.2%; 3.28 vs. 2.55, +28.6%)`. Verified: (3.34−2.95)/2.95 = 13.2%; (3.28−2.55)/2.55 = 28.6%. (KCTV Qwen2.5 row: 88.0 / 41.41 / 16.76 / – / 2.55 / 2.95 / 3.36 / 2.95.)
- **Most pronounced in coherence:**
  - Paper: 4.48 vs 3.57 (**+25.5%**, attributed to DocPres), 4.48 vs 3.28 (**+36.6%**, attributed to KCTV).
  - Percentages check arithmetically. [COMPILER NOTE] However, per Table 5 the value 3.57 is KCTV-GPT-4o's coherence and 3.28 is DocPres-Qwen2.5's coherence (DocPres rows: 3.24/3.28; KCTV rows: 3.57/3.36) — the baseline labels in the §4.5 sentence appear swapped relative to Table 5. Cite the numbers with this caveat. | PDF p.14407 / §4.5 and Table 5.
  - Paper attributes the gain to comprehensive analysis of slides' structural roles.
- Overall: PPTAgent generates high-quality presentations, **average 3.67 across PPTEval's three dimensions** (§1, §4.5; Qwen2.5_LM+Qwen2-VL_VM row: 95.0 / 496.62 / 14.25 / 6.20 / 3.28 / 3.27 / 4.48 / 3.67).

#### 5.5.2 Robust generation performance

- Both Qwen2.5_LM+Qwen2-VL_VM and GPT-4o_LM+GPT-4o_VM achieve **≥95% success rates** (95.0% and 97.8%).
- Significant improvement over KCTV `(97.8% vs. 88.0%)`. [CORRECTED: attribution resolved — 97.8% is PPTAgent-GPT-4o, 88.0% is KCTV-Qwen2.5 | PDF p.14407 / Table 5]
- Per-domain details (Table 9, Qwen2.5 configuration) in §5.5.4.
- Demonstrates versatility and robustness.

#### 5.5.3 PPTEval's strong assessment ability (disagreement with legacy metrics)

- Traditional metrics such as PPL and ROUGE-L trend **inconsistently** with PPTEval.
- Canonical case: KCTV has high **ROUGE-L 16.76** but low content 2.55; the proposed method has lower **ROUGE-L 14.25** but content 3.28. (§4.7 adds PPL: KCTV best at 41.41 vs. PPTAgent 496.62 — same reversal.)
- Interpretation: ROUGE over-emphasizes textual overlap with the source document, which can hurt presentation expressiveness.
- PPTEval's advance: the dual capability of **label-free design assessment + holistic presentation-coherence evaluation**. Agreement analysis in §5.10.

#### 5.5.4 Per-domain details (Appendix B.1, ACL Table 9)

- Table 9 caption reads `Qwen2-VL_LM+Qwen2-VL_VM` while the body text says the `Qwen2.5_LM+Qwen2-VL_VM` configuration — the inconsistency the survey flagged is retained verbatim in the ACL version. [COMPILER NOTE: cite as printed | PDF p.14413 / Table 9]
- Metrics: SR(%) / PPL / FID / PPTEval 3-dimension average.

  | Domain | SR(%) | PPL | FID | PPTEval avg |
  |---|---|---|---|---|
  | Culture | 93.0 | 185.3 | 5.00 | 3.70 |
  | Education | 94.0 | 249.0 | 7.90 | 3.69 |
  | Science | 96.0 | 500.6 | 6.07 | 3.56 |
  | Society | 95.0 | 396.8 | 5.32 | 3.59 |
  | Tech | 97.0 | 238.7 | 6.72 | 3.74 |

- Range: SR 93–97%, PPTEval average 3.56–3.74. Tech highest (3.74), Science lowest (3.56). Science PPL (500.6) is strikingly high yet does not move with the PPTEval average (another instance of metric disagreement).

#### 5.5.5 Success-rate-weighted performance (Appendix B.2, ACL Tables 10/11)

- Failed generations receive PPTEval score 0 (SR-weighted performance).
- ACL Table 10 (fully resolved; the survey's Table 6 row labels were conversion losses):

  | Configuration | Content | Design | Coherence | Avg |
  |---|---|---|---|---|
  | DocPres GPT-4o_LM | 2.98 | 2.33 | 3.24 | 2.85 |
  | DocPres Qwen2.5_LM | 2.96 | 2.37 | 3.28 | 2.87 |
  | KCTV GPT-4o_LM | 1.99 | 2.35 | 2.85 | 2.40 |
  | KCTV Qwen2.5_LM | 2.24 | 2.59 | 2.95 | 2.59 |
  | PPTAgent GPT-4o_LM+GPT-4o_VM | 3.17 | 3.16 | 4.20 | 3.54 |
  | PPTAgent Qwen2-VL_LM+Qwen2-VL_VM | 1.34 | 1.43 | 1.75 | 1.50 |
  | PPTAgent Qwen2.5_LM+Qwen2-VL_VM | 3.11 | 3.10 | 4.25 | 3.48 |

  [CORRECTED: row labels and all cells resolved; this also explains the survey's orphan SR figures 80.0/88.0/97.8/43.0/95.0 as the Table 5 SR column | PDF p.14413 / Table 10]
- Appendix B.2 prose: GPT-4o consistently outstanding across weighted metrics. Qwen2-VL's linguistic proficiency is compromised by multimodal post-training, whereas Qwen2.5's introduction mitigates this; the combination is on par with GPT-4o with the overall best performance — underscoring competitive open-source LLMs.
- Table 11 (SR-weighted ablation) in §5.6.

### 5.6 Ablation study (§5.1 in survey's numbering; ACL §"Ablation Study" + Tables 7/11)

- Configuration fixed: **Qwen2.5_LM+Qwen2-VL_VM**.
- Four removal conditions:
  1. **w/o Outline:** random slide as reference.
  2. **w/o Structure:** omit structural slides during outline generation.
  3. **w/o CodeRender:** replace slide representation with Guo et al. (2023)'s method.
  4. **w/o Schema:** remove content-schema guidance.
- ACL Table 7-upper (Setting column fully legible — the survey's guesses are confirmed exactly):

  | Setting | SR(%) | Content | Design | Coherence | Avg |
  |---|---|---|---|---|---|
  | PPTAGENT (full) | 95.0 | 3.28 | 3.27 | 4.48 | 3.67 |
  | w/o Outline | 91.0 | 3.24 | 3.30 | 3.36 | 3.30 |
  | w/o Schema | 78.8 | 3.08 | 3.23 | 4.04 | 3.45 |
  | w/o Structure | 92.2 | 3.28 | 3.25 | 3.45 | 3.32 |
  | w/o CodeRender | 74.6 | 3.27 | 3.34 | 4.38 | 3.66 |

  (Verified: w/o Outline → coherence 3.36; w/o Structure → coherence 3.45. | PDF p.14408 / Table 7)
- Two key findings (paper wording):
  1. **HTML-based representation significantly reduces interaction complexity** — removing Code Render drops success rate 95.0% → 74.6%.
  2. **Presentation analysis is crucial for generation quality** — removing outline/structural slides degrades coherence (4.48 → 3.36/3.45); removing the slide schema drops success rate 95.0% → 78.8%.
- ACL Table 11 (SR-weighted ablation):

  | Setting | SR | Content | Design | Coherence | Avg |
  |---|---|---|---|---|---|
  | Full | 95.0 | 3.11 | 3.10 | 4.25 | 3.48 |
  | w/o Outline | 91.0 | 2.94 | 3.00 | 3.05 | 3.00 |
  | w/o Schema | 78.8 | 2.42 | 2.54 | 3.18 | 2.71 |
  | w/o Structure | 92.2 | 3.02 | 2.99 | 3.18 | 3.06 |
  | w/o CodeRender | 74.6 | 2.43 | 2.49 | 3.26 | 2.73 |

  - Low success rates heavily impact overall effectiveness (failures scored 0).
- New in ACL — Controlled Experiments (Table 7-lower): PPTAgent run with KCTV's identical template but without KCTV's human annotations ("Controlled": 100.0 / 3.21 / 3.60 / 4.27 / 3.69) beats KCTV (88.0 / 2.55 / 2.95 / 3.36 / 2.95) and is comparable to 50 human-authored presentations ("Human": – / 4.01 / 3.95 / 4.28 / 4.08); the paper notes the current retrieval mechanism may constrain content richness. | PDF p.14408 / Table 7.

### 5.7 Case study (§"Case Study", ACL Figure 5)

- Representative generation examples per configuration in Figure 5. PPTAgent shown under two different references (a) and (b).
- Two PPTAgent advantages:
  1. Effectively integrates visual elements with contextually appropriate image placement while keeping slide content concise and well-structured.
  2. Generates diverse, visually engaging slides under diverse references.
- Baselines (DocPres, KCTV): constrained by rule/template paradigms, **predominantly text-heavy with limited visual variation**.

### 5.8 Score distribution (Appendix B.3, ACL Figure 7)

- Baselines: rule/template constraints limit content/design diversity; scores **concentrated at 2 and 3** (lower levels).
- PPTAgent: more favorable, dispersed distribution; **>80% score 3 or higher** in content/design.
- Coherence especially strong thanks to dedicated handling of structural slides: **over 80% score 4 or above**.

### 5.9 Effectiveness of self-correction (§4.5 + ACL Figure 4 and Table 6)

- Compares per-model counts of iterative self-corrections needed to generate one slide (Figure 4; ACL adds exact bar counts, e.g. GPT-4o 5781/6215 at 0 iterations scale).
- GPT-4o has superior self-correction capability, while Qwen2.5 makes fewer errors in the first generation.
- Qwen2-VL errs more frequently and corrects poorly, likely due to degraded language proficiency (multimodal post-training).
- All three models ultimately correct **more than half the errors**; iterative self-correction effectively ensures generation success.
- New in ACL — Table 6 error-type distribution across rounds (Round 0/1/2): SYNTAX 14/8/7; INDEX 1166/347/244; INST 70/10/8; HALLU 34/20/12; FUNCTION 12/3/2. INDEX errors are initially 89.9% (1,166) of all errors, falling to 244 after two rounds; INST/FUNCTION drop by over 80%, SYNTAX by 50%, HALLU by 64.7%; total 1,296 → 273. | PDF p.14408 / Table 6.

### 5.10 Agreement evaluation (§4.6–4.7 + ACL Table 8 + Figure 6)

#### 5.10.1 PPTEval vs. human preference

- Background: Chen et al. (2024a) and Kwan et al. (2024) stress LLMs' human-like discernment, but Laskar et al. (2024) warn LLM judges may be inadequate for complex tasks — so LLM–human correlation must be validated in the presentation context.
- ACL Table 8 (row identities fully resolved — the survey's unknown rows are Pearson/Spearman):

  | Correlation | Content | Design | Coherence | Avg |
  |---|---|---|---|---|
  | *Reference Analysis (generated vs. reference PPTEval scores)* |
  | Pearson | 0.43 | 0.77 | 0.11 | 0.44 |
  | Spearman | 0.41 | 0.78 | 0.11 | 0.43 |
  | *Agreement Analysis (human vs. LLM ratings)* |
  | Pearson | 0.70 | 0.90 | 0.55 | 0.71 |
  | Spearman | 0.73 | 0.88 | 0.57 | 0.74 |

  [CORRECTED: row identities resolved; the upper "Reference Analysis" block (RQ2 — design excellence transfers from references, Pearson 0.77 on Design) is new in the ACL version | PDF p.14409 / Table 8]
- Caption: all similarities have p < 0.05 (statistically significant).
- Prose: **average Pearson correlation 0.71**, exceeding other evaluation methods (Kwan et al., 2024) — PPTEval aligns well with human preference.

#### 5.10.2 PPTEval vs. legacy metrics

- Pearson correlation of PPTEval content/design dimensions against legacy metrics (ACL Figure 6 heatmap): PPL–Content −0.02, PPL–Design −0.11, FID–Content −0.09, FID–Design −0.06, Content–Design 0.59, PPL–FID 0.11. Only weak correlations.
- Current metrics are ineffective for presentation evaluation:
  - **PPL** centers on text fluency; struggles with fragmented slide content. (The survey's "frequent outliers" phrasing is an interpretive gloss — the paper says these metrics "struggle with the fragmented and diverse slide content." [COMPILER NOTE])
  - **ROUGE-L/FID** quantify similarity to reference text/presentations, but high reference conformity does not guarantee presentation efficacy, so they are unsuitable for content/design quality assessment.
- The weak correlations motivate PPTEval as the robust, comprehensive judge of both content quality and design efficacy.

### 5.11 Related work and conclusion (§5–6 in ACL numbering)

- §5 three strands: Automated Presentation Generation (rule vs. template) / LLM Agent (executable actions, Wang et al., 2024b; API integration, Guo et al., 2023) / LLM as a Judge (instruction-following and context perception, Liu et al., 2023; Zheng et al., 2023; MLLM judges, Chen et al., 2024a; multi-dimensional, Kwan et al., 2024; single-slide, Ge et al., 2025 — but no holistic evaluation).
- §6 Conclusion: PPTAgent conceptualizes presentation generation as a two-stage presentation-editing task completed through LLMs' code understanding/generation abilities; PPTEval provides quantitative metrics; multi-domain experiments prove superiority. Provides a **new paradigm for slide generation under unsupervised conditions** and insights for future work.

---

## 6. Limitations and Follow-ups

### 6.1 Paper-stated limitations (Limitations section, 3 items — ACL wording)

1. **Occasional generation failures:** despite a high success rate (>95%) on the dataset, the model occasionally fails to generate presentations, which could limit practicality.
2. **Limited retrieval capability:** the limited capability of the current retrieval system may restrict content richness in the generated outputs.
3. **Incomplete use of visual information:** although PPTAgent effectively leverages reference presentations to improve visual appeal, it does not fully utilize visual information for fine-grained slide design refinement, such as optimizing element placement to prevent overlapping. Future work: enhance generation robustness, incorporate a more capable retrieval mechanism, and investigate advanced slide design refinement using visual cues.
- [CORRECTED: ACL Limitation 2 is "limited retrieval capability / content richness" — the survey's arXiv-based "reference dependence" limitation (and its "suboptimal outputs" phrasing) does not appear in the ACL Limitations text | PDF p.14410 / Limitations, visually confirmed]

### 6.2 Methodological limitations in the compiler's view (extra-paper interpretation — marked [COMPILER NOTE])

1. [COMPILER NOTE] **No quantification of reference-quality bias:** the paper admits input-condition dependence (controlled experiments, §"Controlled Experiments") but reports no sensitivity study by reference quality (high/low) and no reference-vs-output quality correlation for generation quality (the Table 8 Reference Analysis covers PPTEval-score correlation only: Design 0.77). Reference-selection guidelines remain rules of thumb.
2. [COMPILER NOTE] **No detect-and-repair loop for design defects:** self-correction is keyed to **execution errors** (REPL feedback), not **visual defects** (overlap, contrast, alignment). With no render-image-based critic/repair stage, Limitation 3 (overlap) structurally persists.
3. [COMPILER NOTE] **Possible text bias in coherence evaluation:** coherence is assessed by analyzing "the logical structure and contextual information extracted from the presentation," but whether the extract is a textual summary or also covers deck-level visual rhythm (slide order, section dividers) is unclear in the paper; unlike content/design (slide-image-based), coherence's input modality is not explicitly specified ([NOT IN SOURCE]-adjacent).
4. [COMPILER NOTE] **Incomplete statistical reporting:** "statistically significant" is claimed without test method, sample unit (slide vs. deck), or multiple-comparison correction. (Table-label losses from the arXiv HTML are now resolved against the ACL PDF in this translation.)
5. [COMPILER NOTE] **Same model as judge and generator:** the PPTEval judge is GPT-4o and one generation configuration is also GPT-4o_LM+GPT-4o_VM. No self-preference-bias control (cross-judge, separate human-blind control reporting) appears in the paper. The 0.71 human correlation is aggregate and says nothing about per-model bias.
6. [COMPILER NOTE] **Edit atomicity unverified:** whether the 5 edit APIs suffice for complex layout rearrangement, and whether failures roll back partial application / retries are idempotent without state pollution, is [NOT IN SOURCE].
7. [COMPILER NOTE] **Ethics/practicality:** Zenodo license filtering and above-minimum-wage annotator pay are stated (Ethical Considerations). But license inheritance of outputs (derivative-work issues when cloning reference styles) is not discussed.

---

## 7. Typodeck Relevance

Typodeck context (task-specified): Slide Markdown → Slide IR (versioned intermediate representation) → Composition Engine → natively editable PPTX pipeline. Visual Critic (image+structure hybrid evaluation), Grammar Registry (versioned visual system), Validation-Repair gates, 38 Composition Candidates, reference-slide reproduction benchmark. Goal direction: Valid PPTX → Good Layout → Intended Visual Hierarchy (matching intended semantic importance with perceived visual importance).

### 7.1 Direct connections (paper-grounded)

1. **Head-on match with the reference-based generation paradigm:**
   - PPTAgent's core thesis is "don't generate from scratch; select a reference and edit" (§2.1 Eq. 2, §1 citing Duarte 2010) — the same problem framing as Typodeck's reference-slide reproduction benchmark.
   - Quantitative justification PPTAgent provides: edit-based reference approach improves design +40.9% over rule-based (DocPres) and content +28.6% / design +13.2% over template-based (KCTV) (§4.5). Citable as prior evidence for reference-based approaches. (With the §5.5.1 caveats: +10.1% not +12.1% for content-vs-DocPres; mixed-configuration comparisons; coherence baseline labels apparently swapped — verify against ACL Table 5 before citing.)
   - Difference: PPTAgent selects + edits whole reference slides, while Typodeck routes through Slide IR and the Composition Engine. PPTAgent's strength (reference-layout preservation) trades against input-condition dependence (Limitations 2 in ACL wording: retrieval/content-richness limits).
2. **Functional types ↔ Typodeck semantic roles:**
   - Stage I's structural (opening etc.) vs. content (bullet-point etc.) distinction + structural-role labeling (§2.2) directly corresponds to Typodeck's "slide functional type" concept.
   - PPTAgent ablation: removing structural slides collapses coherence 4.48 → 3.45 (§"Ablation Study"). Citable evidence that deck structural-role (opening/section/body/closing) modeling causally matters for deck quality.
3. **Schema extraction ↔ Grammar Registry:**
   - PPTAgent schemas (category·description·content, §2.2) structure the **what** of slide elements. Removing them drops success rate 95.0% → 78.8%.
   - If the Grammar Registry versions the **how** of the visual system (colors, fonts, spacing, roles), the two complement each other: schema = content-role dictionary, Grammar = visual-realization dictionary.
   - Connection idea: at reference-analysis time, jointly extract PPTAgent-style schemas (element roles) + Grammar Registry entries (tokens/constraints) into a "role → visual token" mapping table, reducing input-condition dependence. Role-token mapping transfer is more robust to low-quality references than whole-reference cloning.
4. **Deck-level coherence evaluation ↔ deck-level rhythm:**
   - PPTEval's split of content/design (slide-level) vs. coherence (whole-deck) (§3) mirrors Typodeck's split of per-slide Good Layout vs. deck-level Rhythm.
   - PPTAgent's coherence gains (+25.5%/+36.6%, §4.5) are the largest, and >80% of presentations score above 4 on coherence (Appendix B.3) — a signal that deck-structure modeling dominates overall impression.
   - PPTEval coherence is **narrative-centric** (progressive development + background information, §3/Appendix C). If Typodeck's Rhythm also covers visual rhythm (density, whitespace, emphasis distribution), it can be positioned as a superset.
5. **HTML intermediate representation ↔ Slide IR:**
   - PPTAgent replacing XML (1,006 lines) with an HTML render representation to lower LLM interaction complexity (§2.3, Appendix E) is the same rationale as Typodeck's Slide IR. Removing CodeRender drops success rate 95.0% → 74.6% — quantitative evidence that "an LLM-friendly intermediate representation is decisive for robustness."
   - Difference: PPTAgent's HTML is a render representation + edit-API combo that repairs only execution errors. If Typodeck's IR adds versioning and validation gates, a stronger claim is available.
6. **Metric disagreement ↔ Visual Critic justification:**
   - The ROUGE-L 16.76-vs-content-2.55 (KCTV) vs. ROUGE-L 14.25-vs-content-3.28 (PPTAgent) reversal (§4.5/§4.7), plus PPL's fragmentation problem and weak heatmap correlations (Figure 6), is direct evidence that "text-similarity metrics cannot evaluate slides."
   - This supports Typodeck's Visual Critic (image+structure hybrid). Notably, PPTAgent evaluates content on slide images (Appendix C: "slides cannot be easily comprehended in plain text") — effectively conceding image-based evaluation is unavoidable.
7. **Human-agreement benchmark numbers:**
   - PPTEval average Pearson 0.71, Fleiss' Kappa 0.59 (0.61/0.61/0.54) (§4.7, Appendix C). Usable as target/comparison lines for Typodeck's Visual Critic. "Exceeding 0.71" can be an explicit goal.

### 7.2 Application ideas (concrete; speculation marked)

1. **Borrow the reference-analysis pipeline (schema + clustering):**
   - Reuse PPTAgent Stage I (clustering θ=0.65, ViT embeddings, text→"a" / image→solid-color masking, Appendix D) as the **reference preprocessing/classifier** for Typodeck's reference-slide reproduction benchmark. Auto-classifying structural/content then splitting reproduction scores by functional type raises benchmark resolution.
   - [SPECULATION] Masking preprocessing may transfer to Typodeck Composition Candidate classification (38 types). Matching candidates against layout fingerprints with content removed should reduce text bias, but the paper has no Composition-Candidate-like concept, so effectiveness needs validation.
2. **Insert an Outline → IR generation stage:**
   - Insert PPTAgent's outline (reference + related document content per slide, §2.3) into the Typodeck pipeline between Slide Markdown and Slide IR as a **Deck Outline IR**. Explicit structural-role fields (opening/section/body) enable coherence-rhythm control.
3. **Map Edit APIs ↔ Composition Engine operations:**
   - Tabulate PPTAgent's 5 operations (delete/clone/replace: `del_span`, `del_image`, `clone_paragraph`, `replace_span`, `replace_image`) against the Composition Engine's atomic operation set. Operations PPTAgent lacks (**move, resize, align, contrast adjustment** — [SPECULATION] absent from the paper's 5, hence Typodeck extensions) are explicit differentiators.
4. **Validation-Repair gate rationale:**
   - Cite PPTAgent's self-correction catching only execution errors while leaving visual defects (overlap) behind (Limitation 3) as design rationale for Typodeck's Validation-Repair (image+structure hybrid): an evolution "from REPL repair to render repair."
5. **Evaluation-dimension mapping:**
   - Map PPTEval Content·Design·Coherence onto Typodeck evaluation: Content → (semantic fidelity), Design → Good Layout, Coherence → Deck-level Rhythm. Adding Typodeck's native fourth dimension **Intended Visual Hierarchy (intent–perception match)** supports a "PPTEval superset" claim. [SPECULATION] The paper has no visual-hierarchy-match concept, so frame this dimension as a novel Typodeck contribution.

### 7.3 Caveats (when applying to Typodeck)

1. **Input-condition trap:** PPTAgent's Limitation 2 (ACL: retrieval/content-richness limits; arXiv: reference dependence) applies equally to Typodeck's reference-based generation. Without output lower-bound guarantees for low-quality references (fallback Grammar, minimum layout), the same failures repeat.
2. **Separate judge from generator:** PPTEval using GPT-4o for both generation and judging (compiler limitation 5) is a cautionary tale for Visual Critic design. Separate the generation model from the evaluation model (or rule/learned metrics) and report human blind evaluation separately.
3. **Specify coherence inputs:** Do not repeat PPTEval's underspecified coherence input modality (compiler limitation 3). Pin Deck-level Rhythm evaluation inputs (slide-image sequence + IR structure + text) in the spec.
4. **Re-check cited table values against the ACL PDF:** the HTML-loss caveats on Tables 2/3/4/5/6 are resolved in this translation (§5.5.1, §5.6, §5.10.1), but re-confirm row/column attribution in ACL Tables 5/7/8 before citing in the Typodeck paper — especially the design/content configuration mixing and the ablation row mapping.

---

## 8. Citation Points (3 claims for the Typodeck paper)

1. **"Text-similarity metrics do not measure presentation quality, so image- and structure-based evaluation is needed."**
   - Evidence: §4.5/§4.7 overall results. KCTV ROUGE-L 16.76 (content 2.55) vs. PPTAgent ROUGE-L 14.25 (content 3.28) reversal. ROUGE's over-emphasis on source-text overlap hurts expressiveness.
   - Further evidence: §4.7 agreement evaluation. PPL struggles with slide fragmentation; ROUGE-L/FID (reference conformity ≠ efficacy) correlate weakly with content/design (Figure 6: −0.02/−0.11/−0.09/−0.06).
   - Typodeck link: justifies the Visual Critic (image+structure hybrid).
2. **"The reference-based editing paradigm beats rule- and template-based generation on design, content, and coherence alike."**
   - Evidence: §4.5. vs. DocPres design 3.34 vs. 2.37 (+40.9%), content 3.28 vs. 2.98 (+10.1%) [CORRECTED]; vs. KCTV design 3.34 vs. 2.95 (+13.2%), content 3.28 vs. 2.55 (+28.6%); coherence 4.48 vs. 3.57 (+25.5%) / vs. 3.28 (+36.6%) with the swapped-label caveat; three-dimension average 3.67.
   - Typodeck link: quantitative prior evidence for the reference-slide reproduction benchmark and reference-based generation pipeline. (Re-check ACL Table 5 attribution before citing.)
3. **"Deck-structure (structural role) modeling and an LLM-friendly intermediate representation causally contribute to generation robustness and coherence."**
   - Evidence: Ablation (ACL Table 7, Qwen2.5_LM+Qwen2-VL_VM). Removing outline/structure collapses coherence 4.48 → 3.36/3.45. Removing the HTML render representation drops success rate 95.0% → 74.6%. Removing schemas drops success rate 95.0% → 78.8%.
   - Typodeck link: justifies Slide IR (intermediate representation), functional types, Deck Outline, and the Grammar Registry.

---

## Appendix: Coverage and Omission Notice

- Scope read: full ACL PDF text (17 proceedings pages 14402–14418; 1,330 extracted-text lines) plus rendered-page images of Tables 5/6/7/8, Figure 4/5/6/7, and the Limitations section; arXiv fallback PDF downloaded for version comparison only.
- Items resolved against the ACL PDF (previously HTML-conversion losses in the survey): Edit API exact names; Appendix F prompt full texts (Figures 12–23, now selectable text); Table 2/3/4/5/6 row/column labels; Table 5's two correlation rows (Pearson/Spearman); statistical-test method remains [NOT IN SOURCE]; coherence-input modality detail, failure rollback/idempotence remain [NOT IN SOURCE].
- ACL-version additions absent from the survey's arXiv base (Table 6 error distribution, Table 7 controlled experiments, Table 8 Reference Analysis, Figure 4 counts, Qwen2-VL captioning, changed Limitation 2, author-list change) are incorporated and marked above.
