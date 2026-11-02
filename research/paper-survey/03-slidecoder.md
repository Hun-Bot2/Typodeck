# SlideCoder: Full Paper Summary (for Typodeck)

> Translator/verifier note: faithful English translation of `research/paper-survey-tmp/03-slidecoder.md`
> (Korean, 501 lines). Every number below was checked against the paper PDF
> (`research/paper-survey/sources/03-slidecoder.pdf`, arXiv:2506.07964v1, 19 pages, 5,903,840 bytes,
> sha256 `aa58d2de24373d94e60aa114fb87921675c281b3ea9fa5b4d3e2d7822f36fcc6`). Verified 2026-11-02.
> Markers: [SOURCE-BASED], [SPECULATION], [COMPILER NOTE], [COMPILER ANALYSIS], [NOT IN SOURCE],
> [CORRECTED: change | location], [UNRESOLVED: reason]. No claim absent from the Korean survey was added.

## 0. Bibliographic Information

- **Title**: SlideCoder: Layout-aware RAG-enhanced Hierarchical Slide Generation from Design
- **Authors**: Wenxin Tang†, Jingyu Xiao† († co-first authors), Wenxuan Jiang, Xi Xiao, Yuhang Wang, Xuxin Tang, Qing Li, Yuehe Ma, Junliang Liu, Shisong Tang, Michael R. Lyu
- **Affiliations**: Tsinghua University, The Chinese University of Hong Kong (CUHK), Northeastern University, Southwest University, Kuaishou Technology, Peng Cheng Laboratory, BNU-HKBU United International College, Dalian Maritime University.
- **Venue/year**: arXiv cs.CV, v1 2025-06-09. The task brief mentions EMNLP 2025, but **the source text itself carries no venue marking [NOT IN SOURCE]**. arXiv category is cs.CV.
- **arXiv link**: https://arxiv.org/abs/2506.07964 (per the source's back-to-abstract/PDF links; PDF: /pdf/2506.07964v1)
- **DOI**: [NOT IN SOURCE].
- **Code**: https://github.com/vinsontang1/SlideCoder (stated in the Abstract)
- **Data**: Slide2Code benchmark, 300 samples (100 per difficulty tier). Population: ~32,000 samples drawn from Zenodo10k plus SLIDESBENCH samples. No separate data download link is given [NOT IN SOURCE] ([SPECULATION] it may live in the code repository, but [NOT IN SOURCE]).
- [COMPILER NOTE: the paper mixes the spellings "SLIDEBENCH" (§3.3 body) and "SLIDESBENCH" (Table 1 caption); this translation uses SLIDESBENCH throughout | PDF §3.3 / Table 1 p.7]

---

## 1. At-a-Glance Summary

1. This paper formally defines the **"Reference Image to Slide Generation"** task: producing editable PPTX-generating code from a **reference image (RI)** instead of natural language (NL).
2. It proposes the **Tri-Metric Slide Complexity Metric (SCM)** for quantifying slide difficulty, and builds **Slide2Code (300 samples)**, the first difficulty-tiered benchmark grounded in SCM.
3. It proposes the **SlideCoder** framework, which combines color-gradient-based recursive segmentation (**CGSeg**), a 3-agent (**Describer → Coder → Assembler**) structure, a two-level knowledge-base **hierarchical RAG (H-RAG)**, and a **Layout-aware Prompt** that injects position information.
4. It builds a new python-pptx reverse-engineering tool to improve training data, and fine-tunes **SlideMaster (7B, LoRA)** on Qwen2.5-VL-7B-Instruct, approaching GPT-4o-level performance.
5. On Slide2Code, SlideCoder beats the strongest baseline by **+40.5 points** (simple), **+34.0 points** (medium), and **+29.9 points** (complex) in Overall score, with execution success-rate gains of **+38pp, +32pp, +27pp** per difficulty tier.

---

## 2. Research Problem and Background

### 2.1 Problem: Reference Image to Slide Generation

- **Input**: a slide reference image I₀ (a non-editable png/pdf slide, a webpage design, etc.).
- **Output**: python-pptx-based executable Python code Cg; running it produces a new slide file Fg and a rendered image Ig.
- **Evaluation**: since the original code C₀ is unavailable, performance of framework G and MLLM M is measured by comparing the (I₀, F₀) pair against the (Ig, Fg) pair (§3.1).
- **Usage scenarios** (§1, Figure 1 narrative):
  (a) a user sees a good design and wants to turn it into an editable pptx;
  (b) a user without slide-making skills inputs a design image to produce slides.
- **Key assumption**: the user input is assumed to arrive with the "Design" (design layout) and the "Pictures" (insertable figures/background images) **provided separately** (§4 opening; restated as an explicit limitation in Limitations).

### 2.2 Limits of Existing NL-Based Generation [SOURCE-BASED]

The paper targets AutoPresent (Ge et al. 2025 — LLaMA fine-tuning on SLIDESBENCH + the SLIDESLIB high-level API) and presents three limitations (§1).

1. **Expressiveness limits of natural language**
   - NL cannot precisely describe visual designs such as color, layout, and style.
   - Users sometimes want to input the design image directly.
2. **Three MLLM failure modes on complex slides** (Figure 1 taxonomy)
   - **miss**: complete omission of visual/textual elements (e.g., a shape missing in the top-left corner).
   - **incorrect**: style/attribute deviations (e.g., the title is not bold).
   - **disorder**: spatial arrangement/alignment mismatch (e.g., three subtitles wrongly positioned/aligned).
   - The paper blames diverse element types and high element density.
3. **Poor python-pptx understanding → non-executable code**
   - MLLMs do not know python-pptx well and generate syntactically invalid or non-executable code.
   - AutoPresent's SLIDESLIB works around this with 5 high-level APIs, but at the cost of **restricted flexibility and comprehensiveness**, yielding overly simplistic outputs.
   - By this paper's reverse-engineering analysis, AutoPresent's tooling supports only 5 object types and 16 styles (§5.3, Table 2).

### 2.3 Related-Work Positioning (§2)

- **2.1 MLLM code generation**: UI code generation (Interaction2Code, DesignBench, MRWeb, Web2Code), SVG code generation (StarVector, Chat2SVG, SVGEditBench), visual programming problems (MMCode, HumanEval-V, etc.). MLLMs are not yet plug-and-play, still make subtle errors, and there is a code-repair research thread.
- **2.2 Slide generation/understanding**: prior work centered on extracting content from documents into slides (Doc2PPT, PPSGen, SlideSeer). Post-LLM work includes PPTAgent (Zheng et al. 2025, template + text based) and AutoPresent (NL → slide code). AutoPresent is criticized for coarse-grained NL descriptions and a naive agent design that limit output quality.

---

## 3. Key Contributions

1. **New task definition + SCM + Slide2Code benchmark**: defines the Reference Image to Slide Generation task, proposes the Tri-Metric Slide Complexity Metric (SCM), and builds the first difficulty-tiered benchmark Slide2Code (300 samples, 100 each of simple/medium/complex).
2. **SlideCoder framework**: combines Color Gradients-based Segmentation (CGSeg) + Layout-aware Prompt + H-RAG-based code generation (H-RAG), strengthening both complex-slide understanding and python-pptx library understanding.
3. **SlideMaster 7B + reverse-engineering tool**: builds a new, broader-coverage PPTX reverse-engineering tool to produce high-quality training data, and LoRA-fine-tunes SlideMaster on Qwen2.5-VL-7B-Instruct — an open-source model approaching GPT-4o performance.

---

## 4. Methodology Details

### 4.1 Overall Structure (§4, Figure 3)

SlideCoder is an end-to-end reference-image (RI) → executable-Python-slide-code framework with 3 core modules plus a fine-tuned model.

1. **CGSeg**: segments the input Design into semantically meaningful blocks (regions).
2. **H-RAG code generation module**: 3 collaborating agents (Describer, Coder, Assembler) generate the code.
3. **Layout-aware Prompt**: lets the Assembler secure spatial consistency and syntactic correctness by injecting position and grammar information.
4. **SlideMaster**: the fine-tuned 7B open-source model running on top of this framework.

Data flow:

```text
Design (image) + Pictures (image assets)
  → CGSeg: block segmentation (sub-image Im + position pm)
  → Describer: Overall Description + Block Descriptions
  → Coder: per-block Code Snippets
  → Assembler + Layout-aware Prompt: full-code assembly
  → execute → Fg (slide) / Ig (rendered image)
  → on execution failure: self-refinement (max 3 rounds)
```

Failure handling (§5.1): if the Coder cannot produce executable code after the maximum attempts, that block is discarded. If the Assembler fails, the sample is recorded as an execution failure.

### 4.2 Slide2Code Benchmark Task Definition (§3.1)

- Notation: I₀ = reference image, F₀ = original slide file, G = generation framework, M = MLLM.
- Generated code: Cg = G_M(I₀). Execution yields Fg and rendered image Ig.
- Original code C₀ is unavailable → compare (I₀, F₀) vs (Ig, Fg).
- Each instance consists of a reference slide image + its corresponding PPTX slide.
- Goal: compare different MLLM backbones across complexity levels.

### 4.3 Slide Complexity Metric (SCM, §3.2)

#### 4.3.1 Design motivation

- The paper notes that visual appearance and construction effort can mismatch: e.g., inserting a visually complex image may require minimal manipulation.
- Hence the Tri-Metric reflects both **production difficulty** and **visual complexity**.

#### 4.3.2 Three raw indicators

For sample i:

1. **c_i**: element count. Reflects manipulation cost.
2. **e_i**: distinct element-type count. E.g., textbox, placeholder. Reflects manipulation cost.
3. **v_i**: Element Coverage Ratio. "Number of activated color grids / total grids" computed via CGSeg (§4.1). Reflects visual richness.

#### 4.3.3 Normalization and weighted aggregation (formulas)

The source formulas, transcribed:

- Each raw score x_i ∈ {c_i, e_i, v_i} is normalized as:

```text
x̃_i = σ((x_i − μ) / √(σ² + ε))
```

[CORRECTED: in the paper the ε sits inside the square root, (x_i − μ)/√(σ²+ε); the Korean draft wrote (√σ² + ε) | PDF p.3 / §3.2]

- μ, σ²: mean and variance over the full set Y = {1, 2, 3, ..., N}.
- σ(·): the sigmoid function (citing Han and Moraga 1995).
- ε: a small constant for numerical stability (concrete value [NOT IN SOURCE]).

- Final complexity score:

```text
z_i = α·c̃_i + β·ẽ_i + γ·ṽ_i
```

- Constraint: α + β + γ = 1.
- α, β, γ are weights reflecting the importance of production effort vs. visual complexity.
- **Concrete weight values are [NOT IN SOURCE].**

#### 4.3.4 Agreement with human judgment (§5.4)

- 100 samples randomly drawn from Slide2Code; 4 doctoral students as annotators, 50 slides each.
- Rating dimensions: number of shapes, diversity of shape types, level of element coverage. 0–100 scale. Protocol in Appendix D (Figure 6).
[CORRECTED: the Korean draft said Figure 6 was image-only with no extractable text; the Figure 6 body text (evaluation guide) IS present in the PDF | PDF p.13 / Appendix D]
- Each slide independently rated by 2 annotators, then averaged.
- Pearson r = **0.873**, p = **2.776×10⁻³²**. Strong positive correlation.
- ICC = **0.726**, p = **1.186×10⁻³¹**. Substantial agreement.
- Conclusion: SCM is an objective metric well aligned with human complexity judgments.

### 4.4 Data Collection (§3.3)

- Population Y:
  - ~**32,000** samples randomly drawn from Zenodo10k (Zheng et al. 2025, the largest public slide dataset).
  - **SLIDESBENCH samples additionally incorporated into Y** for diversity and comparative analysis (added count [NOT IN SOURCE]).
- Normalized complexity z computed for all of Y.
- **KMeans into 3 clusters** → cluster centers sorted by z define the simple/medium/complex levels.
- **100 samples randomly drawn per cluster → final Slide2Code of 300**.
- Figure 2 analysis: Zenodo10k and SLIDESBENCH are heavily skewed toward simple/medium, while Slide2Code is balanced across 3 levels, enabling fair complexity-tiered evaluation.

### 4.5 Color Gradient-based Segmentation (CGSeg, §4.1)

#### 4.5.1 Purpose

- Recursively split the slide image into blocks so the MLLM has less difficulty understanding complex slide designs.

#### 4.5.2 Algorithm steps (Algorithm 1)

Input: image I, grid size g, current depth D, max depth Dmax, threshold T.
Output: list of segmented sub-images.

1. **Termination**: if D = Dmax, return ∅ (lines 1–3). Concrete values of Dmax, g, T are [NOT IN SOURCE].
2. **Grid split**: divide I into g×g grid blocks G (line 4).
3. **Gradient magnitude**: compute the Sobel magnitude per block to measure color-gradient strength (line 5).
4. **Median-based activation**: take the median Cmid of all block gradients; blocks with c_ij > T·Cmid are activated (M_ij=1), else 0 (lines 6–14).
5. **Flood-fill**: apply flood-fill (Burtsev and Kuzmin 1993) to the binary activation mask M to group visually coherent connected regions (line 15).
6. **Connected-region split**: separate the connected regions as sub-image candidates (line 16).
7. **Crop + store position**: crop each region m into sub-image I_m and position p_m, adding both to result set R (lines 19–20).
8. **Recursion**: recursively call CGSeg(I_m, g, D+1, Dmax, T) for each I_m and merge results into R (lines 21–22). Segmentation granularity adaptively refines with local visual complexity.
9. Return final R.

Figure 4 mapping:
- (a) input image → (b) activated grid blocks → (c) flood-filled regions → (d) final recursive result.

#### 4.5.3 Link to SCM

- SCM's v_i (Element Coverage Ratio) is exactly this CGSeg activated-grid ratio (§3.2). CGSeg thus doubles as segmenter and complexity measurer.

### 4.6 Hierarchical RAG Code Generation Module (§4.2)

#### 4.6.1 Roles of the three agents (§4.2.1)

1. **Describer**: generates the global Design narrative (Overall Description) + per-segment-block narratives (Block Descriptions).
2. **Coder**: takes blocks and block descriptions as input and produces the corresponding code snippets.
3. **Assembler**: assembles the snippets into the final slide code via the Layout-aware Prompt (§4.3), also using the Pictures assets, so the executed artifact aligns with the RI structurally and visually.
4. **Self-refinement**: if generated code is not executable, errors are fed back and the MLLM regenerates the code. Both Coder and Assembler get at most 3 rounds (§5.1, same as Ge et al. 2025).

Each agent additionally draws knowledge from a different knowledge base according to its role (§4.2.1 closing).

#### 4.6.2 H-RAG's two-level knowledge base (§4.2.2)

1. **Upper level: Shape Type Knowledge Base (TS-KB)**
   - Contains object descriptions from the python-pptx documentation.
   - Guides standardized description generation in the Describer. Example: in "This autoshape includes a textbox…", both autoshape and textbox are object names from the documentation.
   - Given its size (source: "Given the size…", read in context as small enough), **all entries are inserted into the Describer** to fully guarantee type coverage.
2. **Lower level: Operation Function Knowledge Base (OF-KB)**
   - Contains full syntax specifications (parameters, return values, etc.).
   - Structural details in Appendix F. Examples: function name, parameters, return value, usage example, textual explanation (Figures 10, 11).
[CORRECTED: the Korean draft said Figures 10–11 were image-only with no text in the body; both figures' body text (TS-KB object-type examples; OF-KB function-name/parameters/return-value/example/explanation) IS present in the PDF | PDF pp.17–18 / Appendix F]

#### 4.6.3 Retrieval method

- Entries are embedded with **BGE M3-Embedding** (Chen et al. 2024) into a vector retrieval database.
- The prompt p's vector q_p is matched against each entry key k_i by cosine similarity cos(q_p, k_i).
- The top-k relevant entries are inserted into p. **The value of k is [NOT IN SOURCE].**
- Hierarchical pipeline:
  - Describer: retrieves object types from TS-KB → identifies elements in block images → emits standardized narratives.
  - Coder: queries OF-KB with those narratives → generates code snippets.
  - Assembler: retrieves full syntax patterns with the snippets → generates executable code.

### 4.7 Layout-aware Prompt (§4.3)

Two requirements on the Assembler assembly prompt:

1. Each block must appear at the correct position in the final slide.
2. Merged-code syntax errors must be avoided and code-context consistency maintained.

Components:

- **Position injection**: the Position \<x,y,w,h\> extracted by CGSeg is injected in python-pptx's standard position unit (**inches**). Since the Design resolution differs from the real slide size, **proportional scaling** maps it onto slide coordinates → \<Position*\>.
- **Grammar injection**: grammar patterns \<Grammar\> retrieved from the H-RAG knowledge base are injected to prevent syntax errors and code conflicts.
- Final prompt = \<Design\> (reference image) + \<Overall description\> (global narrative) + \<Code Snippets\> (Coder's partial code) + \<Position*\> (layout representation) + \<Grammar\> (syntax patterns), integrated into a predefined template.
- Full templates in Appendix E (Figures 7/8/9).
[CORRECTED: the Korean draft said all of Figures 7–9 were image-only with no text; the bodies of Figure 8 (Coder prompt) and Figure 9 (Layout-aware prompt) ARE text-present in the PDF — only the Figure 7 body (Describer prompt) is image-only | PDF pp.14–16 / Appendix E]

### 4.8 SlideMaster 7B Fine-tuning + Reverse-engineered Data (§4.4, §5.3, Appendix B/C)

#### 4.8.1 Training data

- (RI, instruction, program) triplets built on the SLIDESBENCH training set.
- Ge et al. (2025)'s reverse-engineering tool generates labels (Python code) for only a limited range of slide styles → degraded training-data quality.
- To mitigate this, the authors develop **a new reverse-engineering tool handling a broader style spectrum** → improved label quality.

#### 4.8.2 Reverse-engineering tool coverage (§5.3 Table 2, Appendix B Tables 5/6)

| Type | Ours style count | AutoPresent style count |
|---|---|---|
| title | 10 | 3 |
| textbox | 10 | 5 |
| bullet points | 8 | 5 |
| background color | 1 | 1 |
| image | 2 | 2 |
| placeholder | 4 | – (unsupported) |
| freeform | 2 | – |
| connector | 5 | – |
| table | 4 | – |
| triangle | 5 | – |

- Totals: Ours **10 object types / 44 styles**; AutoPresent **5 types / 16 styles**.
- [COMPILER NOTE: Table 2's Ours column actually sums to 51 (10+10+8+1+2+4+2+5+4+5), not the 44 styles claimed in the §5.3 body text; Table 5's per-type style lists do sum to 44 — a genuine in-paper inconsistency beyond the name mismatch below | PDF p.7 Table 2 vs §5.3/p.12 Table 5]
- Appendix B Table 5 (Ours) style details:
  - textbox: Position, Text frame margin, Alignment, Paragraph spacing, Font style, Fill color, Font size, Bold, Italic, Underline
  - rectangle: Position, Line color, Line width, Fill color (naming is somewhat inconsistent with Table 2's title row; transcribed as in the source)
  - object_placeholder: Position, Fill color, Object position
  - freeform: Position, Fill color
  - bullet_points: Position, Item content, Font size, Font color, Fill color, Bold, Italic, Underline
  - image: Position, Image path
  - background_color: Color
  - connector: Start position, End position, Arrow color, Arrow width, Arrow style
  - table: Position, Cell height, Cell fill color, Text inside cell
  - triangle: Position, Type, Line color, Line width, Fill color
- Appendix B Table 6 (AutoPresent) details:
  - title: Font size, Font color, Fill color
  - textbox: Position, Font size, Bold, Font color, Fill color
  - bullet_points: Position, Item content, Font size, Font color, Fill color
  - image: Position, Image path
  - background color: Color

#### 4.8.3 Quantitative reverse-engineering quality (§5.3)

Ours vs Ge et al. (2025) on two metrics:

1. **Reconstruction Ratio** (shapes in the reverse-engineered slide / shapes in the original):
   - Ours **90.38%** vs AutoPresent **65.67%**.
2. **CLIP Score** (visual/style preservation of the reverse-engineered slide):
   - Ours **88.66%** vs AutoPresent **69.87%**.

#### 4.8.4 SlideMaster fine-tuning configuration

- Base: **Qwen2.5-VL-7B-Instruct** (Bai et al. 2025). The §4 opening and contribution text mix the spellings "Qwen-VL-7B"/"Qwen2.5-VL", but the formal notation in §4.4 and §5.1 is Qwen2.5-VL-7B-Instruct.
- Method: **LoRA** (Hu et al. 2022).
- Appendix C Table 7 hyperparameters:
  - Rank 8, Max Sequence Length 4096, Batch Size 4, Gradient Accumulation Steps 8, Learning rate 1e-4, Epochs 10, Warmup Ratio 0.1, Mixed Precision bf16.
- Training-data scale (triplet count) is [NOT IN SOURCE].

---

## 5. Experimental Results Details

### 5.1 Experimental Setup (§5.1)

- **Backbones**: GPT-4o (version 20241120, official API), Gemini-2.0-flash (accessed May 2025, official API), SlideMaster (fine-tuned on Qwen2.5-VL-7B-Instruct).
- **Generation settings**: max tokens 4096, temperature 0.
- **Self-refinement**: Coder and Assembler up to 3 rounds each. The first successful attempt is taken as the output.
- **Four evaluation metrics** (using the §3.1 notation):
  1. **Global Visual Metrics**: **CLIP** (Hessel et al. 2021) and **SSIM** (Nilsson and Akenine-Möller 2020) between the original image I₀ and the generated image Ig.
  2. **Local Structural Metrics**: **content similarity** and **position similarity** between the original file F₀ and the generated file Fg (following Ge et al. 2025).
  3. **Execution**: success rate of executing Cg without errors.
  4. **Overall Score**: average of all metric values across all samples. Execution failures score 0.

### 5.2 Main Quantitative Results (Table 1, §5.2)

Table 1 top = Slide2Code (per difficulty), bottom = SLIDESBENCH. Key numbers reconstructed below. (Source table column order: Execution% / Content / Position / CLIP / SSIM / Overall; row colors green/yellow/red = simple/medium/complex, top to bottom — confirmed against the rendered table.)

#### 5.2.1 Slide2Code — Simple level

| Framework | Backbone | Exec% | Content | Position | CLIP | SSIM | Overall |
|---|---|---|---|---|---|---|---|
| AutoPresent | AutoPresent | 61.0 | 92.7 | 78.9 | 70.8 | 80.3 | 48.6 |
| AutoPresent | Gemini2.0-flash | 57.0 | 91.4 | 78.3 | 69.7 | 79.0 | 44.8 |
| AutoPresent | GPT-4o | 58.0 | 92.7 | 80.9 | 68.8 | 75.6 | 45.4 |
| SlideCoder | SlideMaster | 86.0 | 92.4 | 87.4 | 77.6 | 91.1 | 76.7 |
| SlideCoder | Gemini2.0-flash | 97.0 | 94.5 | 88.6 | 81.3 | 90.7 | 87.0 |
| SlideCoder | GPT-4o | 99.0 | 96.3 | 88.1 | 79.8 | 91.8 | **89.1** |

- Strongest-baseline Overall 48.6 (AutoPresent) → SlideCoder+GPT-4o 89.1. Gap **+40.5 points** (matches the source's reported figure).
- Execution rate: 61.0 → 99.0, gap **+38pp** (matches the source's reported figure).

#### 5.2.2 Slide2Code — Medium level

| Framework | Backbone | Exec% | Content | Position | CLIP | SSIM | Overall |
|---|---|---|---|---|---|---|---|
| AutoPresent | AutoPresent | 53.0 | 89.6 | 77.3 | 69.2 | 79.1 | 41.4 |
| AutoPresent | Gemini2.0-flash | 68.0 | 88.7 | 79.9 | 66.3 | 71.6 | 51.5 |
| AutoPresent | GPT-4o | 50.0 | 92.3 | 74.6 | 67.6 | 72.6 | 36.8 |
| SlideCoder | SlideMaster | 75.0 | 84.7 | 79.8 | 75.4 | 86.4 | 61.7 |
| SlideCoder | Gemini2.0-flash | 90.0 | 90.9 | 84.6 | 82.3 | 85.5 | 76.6 |
| SlideCoder | GPT-4o | 100.0 | 92.5 | 84.7 | 81.5 | 86.2 | **85.5** |

- Strongest-baseline Overall 51.5 → 85.5. Gap **+34.0 points** (matches the source's reported figure).
- Execution rate: 68.0 → 100.0, gap **+32pp** (matches the source's reported figure).

#### 5.2.3 Slide2Code — Complex level

| Framework | Backbone | Exec% | Content | Position | CLIP | SSIM | Overall |
|---|---|---|---|---|---|---|---|
| AutoPresent | AutoPresent | 67.0 | 87.2 | 71.4 | 65.9 | 73.4 | 48.5 |
| AutoPresent | Gemini2.0-flash | 66.0 | 89.3 | 72.2 | 63.1 | 64.7 | 45.2 |
| AutoPresent | GPT-4o | 69.0 | 90.3 | 73.3 | 62.3 | 63.3 | 47.1 |
| SlideCoder | SlideMaster | 73.0 | 76.1 | 70.5 | 72.4 | 82.8 | 54.2 |
| SlideCoder | Gemini2.0-flash | 88.0 | 92.7 | 80.9 | 81.7 | 81.2 | 71.6 |
| SlideCoder | GPT-4o | 96.0 | 94.3 | 80.0 | 80.7 | 82.6 | **78.4** |

- Strongest-baseline Overall 48.5 → 78.4. Gap **+29.9 points** (matches the source's reported figure).
- Execution rate: 69.0 → 96.0, gap **+27pp** (matches the source's reported figure).

#### 5.2.4 SLIDESBENCH (bottom)

| Framework | Backbone | Exec% | Content | Position | CLIP | SSIM | Overall |
|---|---|---|---|---|---|---|---|
| AutoPresent | AutoPresent | 84.1 | 92.2 | 67.2 | 81.6 | 73.7 | 65.3 |
| AutoPresent | Gemini2.0-flash | 56.4 | 91.7 | 62.9 | 77.1 | 66.0 | 40.4 |
| AutoPresent | GPT-4o | 86.7 | 92.5 | 76.3 | 78.0 | 70.8 | 66.9 |
| SlideCoder | SlideMaster | 87.2 | 91.5 | 76.9 | 73.4 | 80.0 | 68.4 |
| SlideCoder | Gemini2.0-flash | 89.7 | 90.0 | 85.4 | 81.8 | 80.0 | 75.0 |
| SlideCoder | GPT-4o | 94.9 | 94.8 | 83.9 | 82.1 | 80.9 | **78.8** |

- SlideCoder+GPT-4o Overall 78.8, **+11.9 points** over the strongest baseline (66.9).
- The source claims the open-source SlideMaster (SlideCoder+SlideMaster, 68.4) beats the best GPT-4o-based baseline on both datasets. On Slide2Code, SlideMaster's simple 76.7 / medium 61.7 / complex 54.2 all exceed each tier's best baseline (48.6 / 51.5 / 48.5). On SLIDESBENCH, 68.4 > 66.9.

#### 5.2.5 Authors' interpretation (§5.2) [SOURCE-BASED]

- SlideCoder beats the baselines at every difficulty tier and on every metric family (Local Structural + Global Visual) → strong at preserving both structural layout and visual appearance.
- SlideCoder's Overall declines stepwise with difficulty (simple 89.1 → medium 85.5 → complex 78.4) → suggests it exploits the input's visual/structural cues.
- NL-based baselines, by contrast, are insensitive to difficulty and their Overall does not reflect the difficulty hierarchy (e.g., the AutoPresent backbone's Overall goes simple 48.6 → medium 41.4 → complex 48.5, non-monotonically).

### 5.3 Reverse Tool Analysis (§5.3; same numbers as §§4.8.2–4.8.3 above)

- Coverage: Ours 10 types / 44 styles vs AutoPresent 5 types / 16 styles.
- Reconstruction Ratio: **90.38%** vs **65.67%**.
- CLIP Score: **88.66%** vs **69.87%**.
- Full comparison in Appendix B (Tables 5/6).

### 5.4 Complexity Metric Analysis (§5.4)

- Human-evaluation protocol and correlations as in §4.3.4 above.
- Pearson r = 0.873 (p = 2.776×10⁻³²), ICC = 0.726 (p = 1.186×10⁻³¹).

### 5.5 Ablation Study (§5.5, Appendix A)

#### 5.5.1 Settings (Appendix A.1)

1. **w/o Layout**: remove only each block's position coordinates from the Assembler input.
2. **w/o CGSeg**: disable CGSeg and the layout-aware prompt. Since the Coder produces partial code and the Assembler handles assembly, removing CGSeg makes the Assembler unnecessary — so **both the Assembler and the layout-aware prompt are removed**, and the Coder's output code is used directly as the final output.
3. **w/o H-RAG**: remove knowledge-base retrieval (\<Grammar\> content) for all agents.
4. **Native setting**: remove both H-RAG and CGSeg. The MLLM generates the full slide code directly from the reference image with ordinary H-RAG-free prompts. Measures native MLLM capability.

Experiment: 33 samples randomly drawn per difficulty tier (99 total), inference with GPT-4o.

#### 5.5.2 Full results (Table 3: Execution% / Overall, 3 rows per tier)

| Setting | Simple (Exec/Overall) | Medium (Exec/Overall) | Complex (Exec/Overall) |
|---|---|---|---|
| SlideCoder | 100.0 / 89.9 | 100.0 / 85.8 | 100.0 / 82.2 |
| w/o Layout | 100.0 / 81.2 | 93.9 / 73.6 | 93.9 / 71.8 |
| w/o CGSeg | 75.8 / 55.4 | 51.5 / 39.6 | 69.7 / 48.4 |
| w/o H-RAG | 90.9 / 80.4 | 81.8 / 69.3 | 84.8 / 70.7 |
| Native | 75.8 / 53.9 | 48.5 / 37.4 | 66.7 / 46.9 |

- Removing any component drops both execution rate and Overall → each component's contribution confirmed.
- **The w/o CGSeg drop is the largest.** It stays slightly above Native thanks to H-RAG, but drops sharply on all metrics.

#### 5.5.3 Detailed metrics (Table 4: Exec/Content/Position/CLIP/SSIM/Overall)

[COMPILER NOTE: Table 4's group headers are swapped relative to Table 1 — "Global Visual Metrics" sits over the Content/Position columns and "Local Structural Metrics" over Clip/SSIM. This is a labeling typo in the paper; column order and values are unaffected | PDF p.12 Table 4]

Representative drops (source narrative + table values):

- **w/o Layout**: complex Position drops steeply **81.35 → 72.16** (source §A.2 narrative; table rounds to 81.3 → 72.2). In complex cases CGSeg splits the RI into more blocks, and without layout information the agent cannot model multi-element spatial relations → overlaps and off-canvas content. Other metrics are mildly affected too.
- **w/o CGSeg**: a single Describer must handle the whole complex slide, exceeding its capacity → frequent code-generation failures and plunging execution success. Slightly better than Native thanks to H-RAG knowledge.
- **w/o H-RAG**: removing \<Grammar\> from the Describer degrades python-pptx object identification. Removing it from Coder/Assembler loses syntax guidance → frequent **version-related errors** from mismatches between model training data and the current python-pptx version. Overall performance degrades.
- **Native**: with neither CGSeg nor H-RAG, a single Coder handles the entire slide unaided → reduced to plain MLLM inference. Lowest execution rate and overall performance.

### 5.6 Case Study (§5.6, Figure 5)

- NL-based models fail to meet the reference image's detail/layout demands, frequently producing element overlaps and content exceeding canvas bounds.
- On medium/complex samples, the generated code often fails to compile.
- SlideCoder's CGSeg helps the MLLM focus on fine-grained details, and the layout-aware prompt aligns element placement closely with the reference image.

### 5.7 Conclusion (§6)

- A new RI-to-Slide task, SCM, difficulty-tiered Slide2Code, the SlideCoder of CGSeg + Layout-aware Prompt + H-RAG, and a high-quality training set for the 7B open-source model. Experiments show SlideCoder surpassing the strongest baselines.

---

## 6. Limitations and Follow-ups

### 6.1 Paper-Stated Limitations (Limitations section, 3 items as in the source) [SOURCE-BASED]

1. **Single-slide generation only**: one reference image → one slide. The multi-slide (whole-presentation) generation scenario is unexplored.
2. **Separate Design/Pictures input assumption**: user input is assumed to contain design and image components separately. The case of a complete slide with embedded pictures given as a whole input is not handled.
3. **Fixed-rule segmentation**: due to budget/time constraints, the segmentation algorithm (CGSeg) follows a fixed-rule paradigm. Future work is suggested on model-based detection approaches for adaptive, accurate block partitioning.

### 6.2 Methodological Limitations in the Compiler's View [COMPILER ANALYSIS — with source grounds]

1. **Opaque CGSeg hyperparameters**: grid size g, max depth Dmax, threshold T, and post-recursion block-selection criteria are absent from the source. Heavy tuning burden for reproduction/adoption. [Ground: Algorithm 1 gives symbols only, no values]
2. **Undisclosed SCM weights (α,β,γ)**: the core complexity-score weights are missing. Whether tier boundaries (KMeans centers) are published is also unclear. [Ground: §3.2 states only the α+β+γ=1 constraint]
3. **Undisclosed H-RAG retrieval hyperparameters**: no top-k k, no embedding chunk unit, no OF-KB/TS-KB entry counts. [Ground: §4.2.2]
4. **Linear assumption in position mapping**: \<x,y,w,h\> proportional scaling can distort when the reference image and slide aspect ratios differ. No padding/cropping treatment mentioned. [Ground: §4.3]
5. **Small ablation sample**: 33 per tier, 99 total. No statistical significance testing. [Ground: §5.5]
6. **4 human raters, 100 items**: limited sample for SCM validation. Only SCM-vs-rater ICC is reported, not rater-vs-rater agreement. [Ground: §5.4]
7. **Averaging implication of the Overall metric**: execution failures enter the average as 0, so execution-rate gaps can dominate Overall. Quality and execution metrics need separate interpretation. [Ground: §5.1 metric definition]
8. **Baselines tied to NL input**: AutoPresent-family baselines generate from NL narratives without image understanding, so trailing on the RI task is somewhat expected. The Native setting (native MLLM direct generation on the same RI input) is the fairer first baseline, and its improvement margin (per the w/o-CGSeg…Native rows) is large but a different context from Table 1's 40.5-point figure — cite with care. [Ground: §5.2 vs §5.5]
9. **Circularity caution on reverse-engineering CLIP comparison**: CLIP is used both as the reverse-engineering quality metric and in generation evaluation. Reusing the same metric can give an overfitting impression. [Ground: §5.1, §5.3]
10. **Type-name mismatch between Table 2 and Table 5**: Table 2's "title (10 styles)" appears as "rectangle" in Table 5, etc. — incomplete name reconciliation. Check the code repository when reproducing. [Ground: §5.3 Table 2 vs Appendix B Table 5; verified genuine — see also the Table 2 sum discrepancy noted in §4.8.2]

---

## 7. Typodeck Relevance

Typodeck context: a Slide Markdown → Slide IR (versioned intermediate representation) → Composition Engine → natively editable PPTX pipeline. It has a Visual Critic (image+structure hybrid evaluation), a Grammar Registry (versioned visual system), a Validation-Repair gate, 38 Composition Candidates, and a reference-slide reproduction benchmark. Goal ladder: Valid PPTX → Good Layout → Intended Visual Hierarchy (alignment of intended semantic importance with perceived visual importance).

### 7.1 Direct Connections

1. **Reference-slide reproduction benchmark ↔ Slide2Code / RI-to-Slide task**
   - Typodeck's reference-slide reproduction benchmark is structurally identical to SlideCoder's RI-to-Slide task definition (I₀→Cg→Fg/Ig, image+file-pair comparison without original code).
   - Slide2Code's difficulty tiers (simple/medium/complex) are directly reusable for difficulty labeling of Typodeck's reproduction benchmark. In particular, the dual "production difficulty + visual complexity" view (element count, type diversity, coverage) aligns with Typodeck's Valid→Good→Hierarchy goals.
2. **Visual Critic ↔ the 4-metric evaluation suite**
   - SlideCoder's Global Visual (CLIP/SSIM) + Local Structural (content/position) + Execution + Overall structure shares the design philosophy of Typodeck's Visual Critic image+structure hybrid evaluation.
   - Keeping Position similarity as a separate metric maps directly onto Typodeck's Good Layout / Visual Hierarchy goals.
3. **Grammar Registry ↔ H-RAG's TS-KB/OF-KB**
   - The two-level split of TS-KB (object-type standard narratives) and OF-KB (function syntax specs) resonates with Typodeck's Grammar Registry "versioned visual system" concept. The ablation reading that OF-KB contributed to "preventing version-mismatch errors" (§A.2) is citable empirical support for the Grammar Registry's versioning rationale.
4. **Validation-Repair gate ↔ Self-refinement + Assembler**
   - The Coder/Assembler max-3-rounds self-refinement (error-feedback regeneration) is the same pattern as Typodeck's Validation-Repair gate. The block-discard / sample-failure rules on execution failure are also reusable for gate design.
5. **Composition Engine ↔ Layout-aware Prompt's \<Position*\>**
   - Injecting CGSeg positions in inches with proportional scaling is a comparison baseline for Typodeck Composition Engine coordinate/layout representation design. The linear-scaling limit (§6.2 item 4) is an improvement point Typodeck can claim.
6. **Slide IR ↔ Describer's standardized narratives + Code Snippets**
   - The Describer's standardized block narratives (python-pptx-object-name-based) and the Coder's per-block snippets are a weak form of "versioned intermediate representation". Typodeck can argue its Slide IR as the more explicit, versioned differentiation.

### 7.2 Adoption Ideas (Transferability)

1. **Transferring the CGSeg idea [[SOURCE-BASED] + [SPECULATION] mix]**
   - ([SOURCE-BASED]) CGSeg is a lightweight fixed-rule segmenter (Sobel + median threshold + flood-fill + recursive splitting) and the top-contributing component, lifting execution rate and Overall sharply on complex cases (largest drop under w/o CGSeg in the ablation).
   - (Application) Transferable as a "reference image → region decomposition → per-region IR generation → assembly" preprocessing step in Typodeck's reference-slide reproduction pipeline. Also reusable as the unit for per-region scoring (local scoring) in the Visual Critic.
   - ([SPECULATION]) CGSeg is fixed-rule, however, which differs philosophically from Typodeck's meaning-based layout (intended hierarchy). Minimal slides with weak color boundaries may be under-segmented, so a hybrid with model-based detection (also the paper's suggested follow-up) or with Typodeck's structure parser seems the right direction.
2. **Transferring the H-RAG two-level knowledge base [[SOURCE-BASED]]**
   - The role-split retrieval — TS-KB (type standardization) → Describer, OF-KB (syntax specs) → Coder/Assembler — ports directly onto Typodeck's Grammar Registry + Composition Candidate retrieval structure.
   - The simple BGE M3-Embedding + cosine similarity + top-k insertion structure is cheap to implement. Indexing Typodeck's 38 Composition Candidates as "OF-KB-style syntax patterns" would improve provenance traceability of candidate selection. [Provenance note carried over from the Korean draft: from the end of §7.2 through §7.3 and §8, the parent session supplemented the text against this file's own §§4–6 numbers after the source summary was cut off; each item's grounds were re-verified for this translation and all check out — no unsupported item found.]
3. **Transferring the SCM-style difficulty tiers [[SOURCE-BASED]]**
   - SCM (element count, type diversity, coverage; α+β+γ=1) is a difficulty metric validated against human difficulty ratings at Pearson r = 0.873, ICC = 0.726 (§5.4). Directly borrowable for case-difficulty labeling of Typodeck's reproduction benchmark. Caveat: weights undisclosed (§6.2 item 2), so recalibration on Typodeck data is needed.

### 7.3 Caveats

- **Baseline-comparison context**: the 40.5-point gain is over NL-input baselines (AutoPresent). The margin over the same-RI-input Native setting is a separate context (§6.2 item 8), so Typodeck citations must state the comparison conditions.
- **Overall-metric interpretation**: execution failures enter the average as 0, so execution rate dominates Overall (§6.2 item 7). If the Typodeck Visual Critic borrows this metric suite, execution rate and quality metrics must be reported separately.
- **Hyperparameter gaps**: CGSeg / SCM weights / top-k undisclosed (§6.2 items 1–3). Adoption requires reproduction experiments to pin values down.

---

## 8. Citation Points (3 Claims for Typodeck Papers)

1. **"Reference-image → editable-slide reproduction hinges on a segment–generate–assemble hierarchy, with segmentation (CGSeg) as the top-contributing component."**
   Grounds: SlideCoder overall structure (§4) + largest drop under w/o CGSeg in the ablation (§5.5). Citable to justify the region-decomposition stage of Typodeck's reproduction pipeline.
2. **"Difficulty metrics must agree with human judgment; SCM is validated at Pearson 0.873 / ICC 0.726."**
   Grounds: §5.4 SCM validation (4 human raters, 100 items). Citable as prior grounds for Typodeck reproduction-benchmark difficulty-labeling design. Caveat the small sample (§6.2 items 5–6) alongside.
3. **"Version-spec knowledge (OF-KB) reduces generation errors — empirical rationale for a versioned intermediate representation."**
   Grounds: OF-KB's contribution to preventing version-mismatch errors (§A.2 ablation reading). Citable in support of the Typodeck Slide IR / Grammar Registry versioning design.

