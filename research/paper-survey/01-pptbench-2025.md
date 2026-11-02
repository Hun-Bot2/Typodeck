# PPTBench Paper — Full Summary (Thorough)

> Translated from the Korean survey `research/paper-survey-tmp/01-pptbench-2025.md`.
> Every number below was checked against the paper PDF (arXiv:2512.02624v1, 19 pages);
> corrections and confirmations are marked inline. Short attributed quotes only.

## 0. Bibliographic Information

- **Title:** PPTBench: Towards Holistic Evaluation of Large Language Models for PowerPoint Layout and Design Understanding
- **Authors:** Zheng Huang, Xukai Liu, Tianyu Hu, Kai Zhang, Ye Liu
- **Affiliations:** University of Science and Technology of China (USTC); State Key Laboratory of Cognitive Intelligence (Tianyu Hu is listed with USTC only)
- **Contacts (as printed):** {huangzheng, chthollylxk, tianyuhu}@mail.ustc.edu.cn, kkzhang08@ustc.edu.cn, yeliu.liuyeah@gmail.com
- **Venue/year:** arXiv preprint, 2 December 2025 ([NOT IN SOURCE]: no conference/journal publication stated; v1 basis)
- **arXiv:** cs.CV, arXiv:2512.02624v1
  - Abstract page: https://arxiv.org/abs/2512.02624
  - PDF: https://arxiv.org/pdf/2512.02624
- **Code/data:** https://github.com/Gastronomicluna/PPTBench-Eval (Abstract states "All datasets and code are fully released")
- **Source form:** arXiv HTML conversion (v1) for the original survey; verification performed against the PDF, main text §1–§5 + supplementary §6–§9, 19 pages
- **Length:** source text file 1,003 lines (approx. 115,913 bytes)

---

## 1. At-a-Glance Summary (5 sentences)

1. PPTBench is a multimodal benchmark that comprehensively evaluates MLLM/VLLM capabilities on PowerPoint slides across 4 categories — Detection, Understanding, Modification, Generation — with 11 subtasks and 4,439 samples.
2. It converts 958 real PPTX files (collected from government archives) into a dual-modality input of structured JSON (text, formatting, coordinate metadata) plus slide screenshots, and executes/evaluates modification and generation via sequences of 17 atomic API calls.
3. Experiments show closed models (GPT-4o, Gemini-2.0-Flash) lead open-source models in every category, but even the best reach only about 33% on Generation, confirming a large gap between semantic understanding and spatial/layout reasoning.
4. Ablations show JSON structure information contributes more to Detection/Modification while screenshot visual information contributes more to Understanding (charts/tables); CoT and API-template guidance substantially raise Generation, though CoT also reduces the number of executable API sequences from 748 to 531.
5. Case studies reveal systematic layout failures (misidentified dominant elements, misjudged chart proportions, overlap-inducing moves, image-over-bullet overlap), and the paper proposes visual–structural fusion and integrated sequential planning + visual understanding as follow-up work.

---

## 2. Research Problem and Background

### 2.1 Problem addressed

- PowerPoint is a practical multimodal domain combining rich textual content with highly structured visual layouts. Spatial relationships strongly influence how information is interpreted (§1).
- Commercial systems such as Canva AI Presentations, Microsoft Copilot for PowerPoint, and Beautiful.AI have already adopted VLLM-based automatic slide generation, so real-world demand for intelligent PPT assistants is large (§1).
- Nevertheless, academic research on PowerPoint reasoning and automation remains limited; layout-centric evaluation in particular is missing, so there is no holistic picture of how well models perform real slide authoring, editing, and refinement tasks (§1, Abstract).
- Goal: provide a benchmark that realistically measures MLLMs' multimodal reasoning, structural understanding, and end-to-end slide manipulation through a holistic evaluation spanning extraction → reasoning → modification → generation (§1, §3.1, §5).

### 2.2 Limitations of prior work [SOURCE-BASED]

Two fundamental limitations stated in §1 and §2.1:

1. **Only narrow, isolated subtasks (lack of breadth)**
   - PPTC (ACL 2024 Findings): evaluates API-based slide modification.
   - PPTC-R: evaluates robustness to adversarial instructions and software variations.
   - SLIDESBENCH (AutoPresent, CVPR 2025): defines natural-language-to-slide (NL-to-Slide) generation.
   - PPTAgent: formalizes document-to-presentation generation with structured edit-based workflows and layout reasoning.
   - But these are isolated to individual subtasks rather than a unified evaluation across understanding, reasoning, and design, so no holistic capability assessment is possible (§1 second paragraph, §2.1 last paragraph).
2. **Visual aspects ignored (lack of visual grounding)**
   - Existing benchmarks offer limited support for layout reasoning, spatial manipulation, and design-level understanding.
   - Many omit visual context or layout information, failing to evaluate what is central to producing coherent, professionally structured slides (§1, §2.1).
   - Verbatim from §2.1: "(1) Most prior work isolates specific subtasks, without providing a unified evaluation across understanding, reasoning, and design. (2) Many benchmarks lack visual grounding."

### 2.3 Related-work landscape (§2 summary)

- **General LLM evaluation:** LiveBench (reasoning, coding, instruction following).
- **Multimodal evaluation:** MMMU, MMMU-Pro, MathVista, AI2D, MMStar.
- **Domain-specific:** ChartQA (chart understanding), APIGen (multimodal API interaction).
- **VLM/MLLM:** Flamingo, GPT-4o, Gemini, LLaVA, MiniCPM-V, InternLM-XComposer, Qwen-VL, MiniGPT-4, Llama family.
- **LLM/VLM agents:** web navigation (VisualWebArena, WebShop, WebArena), software engineering (SWE-Agent, SWE-bench Multimodal), Embodied AI (EmbodiedEval etc.).
- The paper's positioning: despite these lines of work, existing MLLMs lack the ability to understand the structured layouts and compositional organization of PPT slides, and PPTBench fills this gap (end of §2.2).

---

## 3. Key Contributions (numbered)

1. **PPTBench benchmark:** a comprehensive multimodal benchmark with 4 progressive categories (Detection, Understanding, Modification, Generation), 11 subtasks, 4,439 samples (§1, §3.1).
2. **Explicit evaluation of layout/design reasoning:** task design requiring spatial relationships, element hierarchies, and slide-structure interpretation — evaluating reasoning over implicit relationships, semantic hierarchies, and structural organization, beyond element extraction (§1, §3.2).
3. **Realistic large-scale source:** curation of over 950 (exactly 958) professional PPT files in diverse domains and styles; mean 23.7 slides/presentation, mean 4.9 shapes/slide (§1, §6). [CORRECTED: Figure 6 legend prints n=959 and Figure 8 prints Mean=4.5, both inconsistent with the §6 text values 958 / 4.9 used here | PDF p.11 / Figures 6, 8]
4. **Dual-modality input:** structured JSON (text/layout metadata) + slide screenshots (visual grounding), discarding unnecessary Open XML complexity while preserving structural and visual information (§1, §3.3.1, §7.2).
5. **Controllable API-based interaction paradigm:** following PPTC, a standard schema of 17 atomic PowerPoint functions. The model generates a structured API-call sequence, which a deterministic executor runs to produce modified/generated slides (§3.3.3, §9.2).
6. **Reproducible labels via JSON reverse-engineering:** Detection reads JSON fields directly; Understanding is semi-automatic (visual parsing + LLM question generation + human verification); Modification uses post-controlled-API-execution states; Generation uses the source PPT as reference only because of subjectivity (§3.3.4).
7. **Key experimental findings:**
   (a) a large gap between semantic understanding and visual–layout reasoning,
   (b) failures to combine JSON+visual inputs and to integrate visual information into API planning,
   (c) Generation gains from CoT/template guidance and their limits,
   (d) visual demonstration of systematic layout errors such as misalignment and element overlap (§4.3–§4.6).
8. **Reproducibility:** full release of dataset and code (GitHub link, Abstract).

---

## 4. Methodology in Detail

### 4.1 Overall structure (§3.1)

- 4 top-level categories × 11 subtasks = 4,439 samples.
- [CORRECTED: per-subtask N recovered from the PDF — Detection: Content Extraction 400, Style Detection 400, Layout Detection 400 (1,200); Understanding: Text 626, Chart 207, Table 206 (1,039); Modification: Element Modification 600, Layout Refinement 400, Text Modification 200 (1,200); Generation: Slide Generation 800, Note Generation 200 (1,000); total 4,439 | PDF p.3 / Figure 2]
- The four tasks are interconnected, jointly testing capabilities from extraction → reasoning → modification → generation (§5).

### 4.2 Benchmark design: 4 categories (§3.2)

#### 4.2.1 Detection Tasks (§3.2.1)

Foundational ability to perceive slide elements: content extraction, style detection, layout analysis; a prerequisite for complex operations.

1. **Content Extraction**
   - Identify and extract structured textual information such as titles, subtitles, bullets, paragraphs, footnotes.
   - Foundation of PPT understanding and layout analysis.
2. **Style Detection**
   - Recognize and classify formatting attributes conveying visual emphasis and information hierarchy.
   - Font properties (typeface, weight, size, color), text effects (highlight, shadow), stylistic variations (italics, bold, underline).
   - Essential for design consistency and understanding intended emphasis.
3. **Layout Detection**
   - Analyze spatial layout and geometric relationships among elements.
   - Detect issues such as overlapping shapes, out-of-bounds elements, misaligned components, inconsistent spacing.
   - Includes locating bounding boxes of dominant elements and identifying the highest object on the slide.
   - Essential for keeping slides visually organized.

#### 4.2.2 Understanding Tasks (§3.2.2)

Deep understanding that goes beyond surface recognition to infer implicit conclusions within a slide: full semantic grasp via text interpretation + chart/table reasoning.

1. **Text Understanding**
   - Infer implicit textual information in slides.
   - Identify main topics, summarize text, recognize hierarchical relationships among text elements.
2. **Chart Understanding**
   - Interpret and reason over graphical charts in slides.
   - Identify chart types, analyze data series, interpret axes/legends to recognize patterns, correlations, anomalies across visualization formats.
3. **Table Understanding**
   - Reason over structured tabular data in slides.
   - Analyze table structure, interpret headers/cell contents, recognize logical relationships among rows/columns/categories to grasp hierarchical organization of structured data.

#### 4.2.3 Modification Tasks (§3.2.3)

Modify existing slides per user instructions: individual element edits, text updates, overall layout refinement.

1. **Element Modification**
   - Basic object-level actions: adding, deleting, resizing, repositioning shapes.
   - Involves understanding user instructions and API calls; foundation of higher-level content modification.
2. **Text Modification**
   - Edit textual elements: grammar correction, tone refinement, adapting phrasing to new contexts.
   - Reflects contextual understanding and semantic preservation.
3. **Layout Refinement**
   - Adjust spatial organization of elements: automatic alignment, resolving out-of-bounds placement, optimizing inter-element spacing.
   - Keeps slides clear, well-organized, and visually consistent.

#### 4.2.4 Generation Tasks (§3.2.4)

Create new slides from scratch per requirements/source materials: must synthesize information, structure it coherently, and design a visually appropriate layout.

1. **Note Generation**
   - Generate explanatory notes per slide capturing key ideas and the intended message.
   - Integrate information across slides, summarize key points, and produce coherent speaker notes reflecting the overall logical flow.
   - Demonstrates global understanding and the ability to produce contextually connected, audience-oriented explanations.
2. **Slide Generation**
   - Build complete slides from diverse input modalities such as screenshots or text.
   - Infer/reproduce spatial layouts from multimodal inputs + apply appropriate formatting, styling, and design conventions.
   - The most comprehensive task in PPTBench: integrates content comprehension, layout organization, and visual design to produce clear, professional slides.

- Appendix Figure 9 visualizes representative examples of the 4 categories in an expanded version (§7.1).

### 4.3 Data construction pipeline (§3.3)

#### 4.3.1 Instance format: (S, Q, A, L) tuples

- Every instance is represented as an (S, Q, A, L) tuple for consistency (§3.3, Table 1).
- [CORRECTED: Table 1 row labels confirmed in the PDF — Detection: S ✓, Q ✓, A ×, L ✓; Understanding: S ✓, Q ✓, A ×, L ✓; Modification: S ✓, Q ✓, A ✓, L ✓; Generation: S ×, Q ✓, A ✓, L × (the survey's HTML conversion had lost the row labels and could only guess this mapping) | PDF p.4 / Table 1]

#### 4.3.2 Slide Data S (§3.3.1)

- **Problem:** raw PPTX is unsuitable for direct LLM use. It follows the Open XML standard but carries excessive metadata, and represents layouts only through coordinate values, hindering direct semantic reasoning. Structured extraction and normalization are required.
- **Solution: dual-input representation**
  - **Structured JSON:** encodes shape types, textual content, spatial attributes (position, size).
  - **Slide Screenshot:** provides direct visual grounding.
  - Preserves structural and visual information while discarding unnecessary XML complexity for efficient LLM processing.

#### 4.3.3 Task Query Q (§3.3.2)

Queries are task-specific instructions in two forms: general queries and multiple-choice questions.

1. **General Query**
   - Contains only the user instruction.
   - A small set of natural-language templates plus extraction algorithms is built per top-level category for task relevance and executability; variable placeholders in templates are extracted automatically.
   - Applied to Detection, Modification, and Generation tasks.
2. **Multiple-Choice Question**
   - Used only for Understanding tasks, since correct answers are often implicit and direct evaluation would be unreliable.
   - An LLM generates slide-based multiple-choice questions → human reviewers verify questions and answers.
   - Two independent annotators, **98% agreement rate**.

#### 4.3.4 API List A (§3.3.3)

- For controllable, executable manipulation of PPT slides, an API-based interaction paradigm converts natural-language instructions into precise, verifiable editing operations.
- Following PPTC, a **standard schema of 17 atomic PowerPoint functions** is adopted, each with parameter definitions specifying shape identifiers, coordinates, colors, and style attributes (details in §9.2).
- At inference the model generates a structured API-call sequence (A_seq), executed by a deterministic slide executor to produce modified/new slides.

**Full list of the 17 APIs (per appendix §9.2, Listing 9):**

| # | Function signature | Description / preconditions |
|---|---|---|
| 1 | create_slide() | Create a new slide |
| 2 | choose_slide(slide_id: int) | Select the working slide; uses JSON slide_id [CORRECTED: PDF Listing 9 prints choose_shape before choose_slide; content identical | PDF p.19 / Listing 9] |
| 3 | choose_shape(shape_id: int) | Select the working shape; uses JSON shape_id; slide must be selected first |
| 4 | set_width(width: int) | Set selected shape width; shape must be selected first |
| 5 | set_height(height: int) | Set selected shape height; shape must be selected first |
| 6 | set_top(top: int) | Set selected shape top; shape must be selected first |
| 7 | set_left(left: int) | Set selected shape left; shape must be selected first |
| 8 | add_text_box(left, top, width, height, text) | Add a text box to the current slide and select it as current shape; current slide must be set first |
| 9 | add_picture(left, top, width, height, image_path) | Add a picture to the current slide and select it as current shape; current slide must be set first |
| 10 | insert_text(text: str) | Insert text into the selected shape; shape must be selected first |
| 11 | set_font_size(font_size: int) | Selected shape font size; shape must be selected first |
| 12 | set_font_style(font_style: str) | Selected shape font style; shape must be selected first |
| 13 | set_font(font_name: str) | Selected shape font; shape must be selected first |
| 14 | set_font_color(font_color: str) | Selected shape font color; shape must be selected first |
| 15 | set_notes_font(font_name: str) | Presentation notes font; slide must be selected, no shape selection required |
| 16 | set_text_align(align_style: str) | Horizontal text alignment within the selected shape; choose_shape must precede; applies to all paragraphs of the currently selected shape and affects only that shape |
| 17 | set_word_wrap(wrap: bool = True) | Enable/disable automatic word wrap for text within the currently selected shape; a text-capable shape (text box, auto shape) must be selected first |

- Three design principles (§9.2): **Atomicity** (each operation performs a single unambiguous action), **Composability** (complex edits/generation via combining atomic operations), **Executability** (all functions map directly to deterministic slide-level updates through the PowerPoint-compatible executor).
- Standardization goal: ensure performance differences stem from capability differences, not prompt/implementation variance.

#### 4.3.5 Label L (§3.3.4)

- The ground truth of each task. Labels are derived by reverse-engineering each task from the JSON representation, ensuring structural accuracy, semantic consistency, and reproducibility.
- Every PPT is first converted to a compact JSON preserving textual, geometric, and stylistic attributes of all elements; downstream labels are generated directly from this JSON so they align with the slides' true visual/semantic content.
  - **Detection:** read directly from JSON fields for element type, position, format.
  - **Understanding:** semi-automatic pipeline — visual parsing from JSON → LLM-based question generation → human verification; ensures factual correctness.
  - **Modification:** post-editing slide states produced by executing controlled API operations on the JSON structure; deterministic and verifiable.
  - **Generation:** the source PPT may serve as a reference but is not used as a label, due to the inherently subjective nature of generation tasks.
- Reliability: all generated labels undergo automated consistency checking plus partial human auditing.

### 4.4 Per-category construction details (appendix §7.3)

- **Detection:**
  - Content extraction: systematically extract text elements from PPTX files, preserving hierarchical relationships and structural context.
  - Style detection: derived directly from embedded PPTX metadata, capturing the full range of formatting attributes used across presentations.
  - Layout detection: more sophisticated approach. First identify slides with clean, well-structured layouts as baselines, then use a custom algorithm to introduce controlled modifications simulating common layout issues — overlapping shapes (strategic placement creating intersections), out-of-bounds elements (careful placement of shapes beyond slide boundaries).
- **Understanding:**
  - Text understanding: human reviewers select 600 slides with substantial content, used as the basis for generating multiple-choice questions targeting textual information/relationship comprehension.
  - 5-step construction: (1) identify chart/table slides with MLLMs, (2) cross-validate with multiple MLLMs, (3) generate multiple-choice questions with LLMs, (4) human reviewers verify questions/answers, (5) secondary review of 10% of entries ensuring a 98% accuracy rate.
- **Modification:**
  - Element modification: record content/properties of randomly selected shapes → remove them from slides → create tasks requiring the model to reintroduce them at appropriate positions.
  - Text modification: built from slides with substantial textual content; editing scenarios evaluating grammar correction, content adaptation, and consistency with existing elements.
  - Layout refinement: identify slides with room for visual enhancement; focus on optimizing element alignment/spacing, improving visual hierarchy, and enhancing overall balance/composition.
- **Generation:**
  - Extract diverse content elements from existing presentations — text (raw slide text, speaker notes, annotations), visual elements (images, charts, diagrams and other graphics), metadata (style information, formatting guidelines, layout patterns).
  - Models create new slides that effectively organize/present the provided content while maintaining professional design standards; diverse scenarios from simple text slides to complex multimedia presentations.

### 4.5 Structured JSON representation example (appendix §7.2)

- The paper specifies EMU (English Metric Unit) units and preserves precise bounding-box coordinates and hierarchical font details.
- Example slide: slide_width 9144000, slide_height 6858000, measurement_unit "emu", slide_id 256.
- Example shapes array:
  - PlaceHolder 1 (shape_id 9, PLACEHOLDER, SUBTITLE): height 1600200, width 7772400, left 762120, top 2742840; text "2009 Energy Conference / April 7, 2009"; font_details paragraph 0 Tahoma 40pt, paragraph 1 Tahoma 32pt.
  - Picture 4 (shape_id 10, PICTURE, RECTANGLE): height 1797120, width 7137360, left 1143000, top 380880; image_path "dataset/extracted_images/…/image_0_2.png".
  - shape_id 11 (PICTURE, RECTANGLE): height 1746360, width 7013520, left 1295280, top 4572000; image_path "…/image_0_3.png".
- The paper's point: fine-grained attributes such as units, bounding boxes, and hierarchical fonts must be explicitly preserved for accurate layout reasoning and modification.

### 4.6 Source dataset details (appendix §6)

- **Scale/source:** 958 PPT files collected from government sources.
- **Presentation statistics (§6.1):** mean 23.7 slides per presentation (median 19); most contain 15–30, matching typical professional presentation lengths for 30–45 minute sessions. Right-skewed distribution — mostly concise with some long comprehensive presentations (Figure 6).
- **Content element analysis (§6.2):**
  - Shape-type distribution (Figure 7): text boxes and basic shapes dominate at ~60%, images 25%, charts 15%; reflects the typical text-led, visually supported composition.
  - Slide complexity (Figure 8): mean 4.9 shapes per slide; most slides in the 5–20 range; well-structured professional quality; challenging enough for LLMs while keeping realistic test scenarios.
- **Dataset characteristics (§6.3):**
  - Domains: mostly government presentations on public policy, education, technical topics.
  - Language: primarily English with consistent professional terminology.
  - Time span: 2015–2023, capturing evolving presentation styles.
  - Format consistency: 4:3 aspect ratio dominates, reflecting institutional standardization.

### 4.7 Evaluation metric design (§4.2)

Dedicated metrics per category for objective, consistent evaluation.

1. **Detection — exact-match accuracy**
   - A = M(S, Q) is compared against ground truth L by exact matching.
   - Acc_det = (1/N) Σ I(A_i = L_i); I is the indicator function, N the number of detection samples.
2. **Understanding — multiple-choice accuracy**
   - Q includes 4 options E = {opt1..opt4}; the model selects one, A = M(S, Q).
   - Acc_und = (1/N) Σ I(A_i = L_i), L ∈ E.
3. **Modification — post-execution JSON exact match**
   - The model generates an API sequence A_seq = M(S, Q, A); executor E(·,·) applies it to the slide, yielding structured JSON S* = E(A_seq, S).
   - Acc_mod = (1/N) Σ I(S*_i = L_i).
   - Every structural attribute of the modified slide (element type, position, color, style) must exactly match the reference output.
4. **Generation — LLM-as-a-Judge 6-point rubric**
   - The model generates an API sequence A_seq = M(S', Q, A) from input S' and executes it to yield S*; the goal is a new slide effectively conveying the information in S'.
   - Following SLIDESBENCH, LLM-as-a-Judge is adopted due to the inherently subjective, multi-faceted nature of slide design quality. Evaluation model: Gemini-2.0.
   - 6-point rubric:
     - 0 Very Poor: no meaningful content, or completely unreadable/confusing.
     - 1 Poor: message unclear, poor design, severe issues with layout or content.
     - 2 Fair: basic message present but lacking clarity, coherence, or visual polish.
     - 3 Good: message clear, design acceptable, minor improvements needed.
     - 4 Very Good: strong clarity and design, effective visual communication.
     - 5 Excellent: highly professional, well-balanced, visually engaging and impactful.
   - Score_i ∈ {0..5} mapped to a percentage scale: Score_gen = (1/N) Σ Score_i × 20.
   - Appendix §8.1 Figure 10 shows representative examples of all score levels 0–5, visualizing the qualitative distinctions between mid-range (2–3) and high-quality (4–5) outputs and how content clarity, layout organization, and visual design affect ratings.

---

## 5. Experimental Results in Detail

### 5.1 Experiment setup (§4.1, §9.1)

- **Evaluated models:**
  - Closed-source: GPT-4o (OpenAI), Gemini-2.0-Flash (Google).
  - Open-source: Llama3.2-Vision (11B, 90B, Meta), LLaVA-1.5 (13B, 34B), MiniCPM-V (8B), Gemma-3 (12B).
- **Reproducibility:** temperature 0 (§4.1); closed-source APIs accessed consistently with temperature 0.0, top_p 0.95 (§9.1).
- **Hardware:** 8× NVIDIA Tesla A100 40GB, 2× Intel Xeon 12-core 3.0GHz CPUs, 256GB RAM, Ubuntu 20.04.5 LTS, CUDA 12.4.
- **Open-source deployment:** ollama framework with 4-bit quantization (intended to optimize memory while maintaining inference quality). [CORRECTED: §9.1 names only Llama3.2-Vision, LLaVA-1.5, and MiniCPM-V in the ollama/4-bit sentence; Gemma-3 (12B) is not listed there | PDF p.14 supp p.3 / §9.1]
- **Inference settings:** maximum context length 2,048 tokens and batch size 1, uniform across all models.

### 5.2 Main results (§4.3, Table 2)

[CORRECTED: full Table 2 matrix recovered from the PDF; the survey's HTML conversion had lost the row/column labels and most cells | PDF p.6 / Table 2]

| Model | Overall | Detection | Understanding | Modification | Generation |
|---|---|---|---|---|---|
| OpenAI GPT-4o | 76.79 | 95.92 | 94.03 | 86.95 | 30.25 |
| Gemini-2.0-Flash | 72.16 | 82.25 | 95.28 | 78.27 | 32.82 |
| Llama3.2-Vision (11B) | 41.84 | 66.75 | 84.79 | 11.70 | 4.11 |
| Llama3.2-Vision (90B) | 63.22 | 84.58 | 89.51 | 51.19 | 27.59 |
| LLaVA-1.5 (13B) | 31.92 | 56.58 | 70.93 | 0.17 | 0.00 |
| LLaVA-1.5 (34B) | 38.85 | 65.61 | 79.50 | 10.27 | 0.00 |
| MiniCPM-V (8B) | 32.69 | 45.75 | 83.06 | 1.94 | 0.00 |
| Gemma3 (12B) | 50.49 | 79.00 | 75.46 | 35.73 | 11.75 |

([COMPILER NOTE]: the Overall column equals the unweighted mean of the four category scores, e.g. GPT-4o (95.92+94.03+86.95+30.25)/4 = 76.79; the paper does not state the formula.)

**(1) Overall performance**

- Closed-source models consistently outperform their open-source counterparts across all task categories.
- GPT-4o: best Detection **95.92** and best Modification **86.95**.
- Gemini-2.0-Flash: best Understanding **95.28**.
- But both show clear weakness on Generation: Gemini-2.0-Flash only **32.82**, GPT-4o only **30.25**.
- Open-source models also perform reasonably strongly on Detection/Understanding (retaining basic content-extraction and semantic-comprehension capabilities), but fail on Modification/Generation, which require precise API planning — highlighting limited multi-step planning for complex slide editing/generation.
- Positive correlation between model size and performance across all model families: larger variants dominate, e.g. Llama3.2-Vision 90B vs 11B, most notably on Modification (**51.19% vs 11.70%**), suggesting stronger reasoning in larger models enables more complex PPT tasks.

**(2) Gap between semantic understanding and structural manipulation**

- The four tasks form a clear difficulty hierarchy: **Detection < Understanding < Modification < Generation**. [CORRECTED: the paper uses single "<" (§4.3); the survey rendered it as "<<" | PDF p.6 / §4.3]
- Most models do well on the first two categories but drop sharply on Modification, which requires translating user intent into precise, executable API operations.
- Especially pronounced in small models (MiniCPM-V 8B, LLaVA-1.5 13B), whose scores nearly collapse to zero.
- Generation is even more challenging: models consistently fail to produce coherent, well-structured slides from raw inputs; even the best model reaches only around 33%, while several open-source models score near zero.
- Overall: current MLLMs struggle to combine visual understanding with high-level multimodal planning on PPT tasks.

### 5.3 Ablation: input modality contributions (§4.4, Figure 3)

- **Design:** separate the contributions of structured JSON inputs vs visual slide screenshots.
  - Modification requires editing the original JSON representation, so the Image-only configuration is not applicable.
  - Generation starts from blank slides and is therefore excluded from the ablation.
- **Results:**
  - The dual-input configuration generally achieves the best overall performance across most models and tasks.
  - **Detection and Modification benefit substantially from JSON structural metadata**, since they rely on precise positional encoding and shape-level attributes.
  - **Understanding shows smaller JSON gains and stronger sensitivity to screenshot visual information**, since this category includes chart and table understanding, both of which rely heavily on visual cues and spatial relationships.
  - Interpretation: MLLMs leverage holistic visual semantics for comprehension while depending on explicit structure for accurate manipulation.
- **Paradoxical phenomenon:** several instances where removing one modality unexpectedly improves performance, more pronounced in smaller models on Modification tasks — suggesting limited multimodal fusion capability hinders aligning spatial and semantic representations; i.e. small models get confused when given both.

### 5.4 Discussion 1: Impact of Chain-of-Thought (§4.5.1, Table 3, §9.3)

- **Method:** introduce explicit step-by-step prompts plus 2–4 representative cases as guidance.
- [CORRECTED: full Table 3 matrix recovered from the PDF; "–" for LLaVA-1.5 (13B) Generation is printed as-is (not reported) | PDF p.8 / Table 3]

| Model | Detection w/o | Detection w/ | Understanding w/o | Understanding w/ | Modification w/o | Modification w/ | Generation w/o | Generation w/ |
|---|---|---|---|---|---|---|---|---|
| OpenAI GPT-4o | 95.92 | 95.08 | 94.03 | 94.51 | 86.95 | 84.01 | 30.25 | 39.36 |
| Gemini-2.0-Flash | 82.25 | 94.92 | 95.28 | 94.71 | 78.27 | 77.27 | 32.82 | 37.91 |
| LLaVA1.5 (13B) | 56.58 | 38.42 | 70.93 | 63.52 | 0.17 | 9.97 | – | – |
| Gemma3 (12B) | 79.00 | 78.92 | 75.46 | 58.02 | 35.73 | 57.64 | 11.75 | 33.15 |

- **Results:**
  - Large Generation gains in both strong and weak models: **GPT-4o 30.25% → 39.36%, Gemma3 (12B) 11.75% → 33.15%**.
  - Limited or negative effects on Detection/Understanding, where excessive reasoning introduces distraction or error propagation.
  - Interpretation: CoT is most beneficial for tasks requiring user-intent interpretation plus multi-step action-sequence generation; simpler tasks relying on direct visual matching can be hindered by noisy information in the CoT cases.
- **CoT examples (§9.3):** representative cases for Modification (change title font to Arial Black: identify slide_id 311 and TITLE placeholder shape_id 722 → choose_slide(311) → choose_shape(722) → set_font('Arial Black')) and Generation (6-step plan for a 2-slide title+image deck: create_slide(0) → choose_slide(256) → choose_shape(2) → insert_text → create_slide(8) → … → add_picture(141, 48, 432, 324, …)). The paper stresses that CoT directly guides geometric reasoning, layout refinement, and sequential API execution.

### 5.5 Discussion 2: Template-guided generation (§4.5.2, Figure 4, §9.2)

- **Method:** introduce API-level generation templates to guide Generation. Each template is a canonical layout pattern of deterministic API sequences specifying slide layout, background, typography, and element positioning. Three representative templates:
  1. **Title Slide:** establishes a clear visual hierarchy. Background image add_picture(0,0,720,540,…) + main title add_text_box(60,160,600,100,…)+formatting (483D8B, 32pt, CENTER, Arial Black) + subtitle description (110,280,500,50, 2F4F4F, 24pt, Calibri, word wrap) + date (210,415,300,30, 696969, 18pt).
  2. **Bullet Points Slide:** text alignment/spacing focus. Title (80,70,560,60, 28pt Arial Black, 483D8B) + body (100,130,520,360, LEFT, 22pt Calibri, 2F4F4F).
  3. **Image with Description Slide:** visual–textual coordination. Background + image (60,70,280,400) + title text (380,90,280,80, 32pt) + description (380,240,280,150, 18pt).
- **Results:**
  - Providing explicit templates substantially improves generated slide quality.
  - GPT-4o gains moderately: **39.36% → 45.72%** (CoT → CoT+Template).
  - Gemini-2.0-Flash gains more markedly: **37.91% → 55.97** — even advanced MLLMs benefit from external structural templates.
  - Smaller models such as Gemma3 (12B) show inconsistent effects (Figure 4: CoT 31.00 → CoT+Template 30.16, a slight decrease).
- [CORRECTED: Figure 4's Gemma3 CoT bar (31.00) does not match Table 3's Gemma3 w/CoT Generation value (33.15); GPT-4o and Gemini bars match Table 3 exactly. The paper gives no explanation for this discrepancy | PDF p.8 / Figure 4 vs Table 3]
- **Paradoxical finding:**
  - When CoT is applied, the count of valid (executable) API sequences drops markedly from **748 → 531**.
  - Interpretation: while CoT raises the quality of some outputs, low-quality or erroneous CoT steps may interfere with the model's sequential planning ability, causing execution failures — hypothesized to reflect a deeper limitation in combining sequential planning with visual understanding, which is essential for generating coherent, well-aligned slides through API operations.

### 5.6 Discussion 3: LLM-Judge vs Human (§4.5.3, Table 4)

The multi-dimensional, subjective nature of Generation evaluation is addressed by validating the reliability of LLM-based evaluation.

| Judge | LLM score | Human score | Spearman ρ |
|---|---|---|---|
| OpenAI GPT-4o | 30.25 | 28.37 | 0.86 |
| Gemini-2.0-Flash | 32.82 | 32.59 | 0.89 |

- Strong agreement between LLM judges and human expert scores, confirming the reliability of the LLM-based evaluation.

### 5.7 Case Study: 4 layout failure types (§4.6, Figure 5)

A unique aspect of PPTBench is evaluating MLLMs' slide-layout reasoning. Four representative failure cases, each from a different task but all centered on layout-related errors:

1. **Detection:** misidentifies a small slide-number box as the dominant element, overlooking the large central text area.
2. **Understanding:** extracts chart labels but fails to interpret spatial proportions, incorrectly judging the largest sector of a pie chart.
3. **Modification:** generates an API sequence moving a table in the wrong direction, causing severe overlap through inaccurate spatial reasoning.
4. **Generation:** produces correct textual and visual elements but places the image directly over the bullet points, demonstrating a lack of holistic layout planning.
- Overall: current VLLMs struggle to incorporate layout information into their reasoning; even when they understand individual elements, they fail to use spatial structure effectively, limiting PPT tasks that depend on accurate geometric/compositional reasoning.

### 5.8 Conclusions (§5)

- PPTBench is a comprehensive benchmark strengthening evaluation of layout understanding and design reasoning; its four interconnected tasks enable holistic assessment across extraction, reasoning, modification, and creation levels.
- The persistent gap between semantic comprehension and spatial manipulation reflects models' limited ability to coordinate textual semantics with spatial information.
- Incorporating CoT reasoning and API templates brings clear gains in structured editing and layout planning, but current VLLMs still struggle to integrate sequential planning with visual understanding, limiting their ability to fully exploit API semantics and produce clean, well-organized slides.
- Future work: explore more effective use of templates for tighter fusion of semantics, structure, and visual design toward real-world presentation automation.

---

## 6. Limitations and Follow-up Work

### 6.1 Limitations/future work stated by the paper [SOURCE-BASED]

- There is **no explicit Limitations section** ([NOT IN SOURCE]: integrated into §5 Conclusions).
- Limitations/tasks acknowledged in §5 and §4.5:
  1. Tight fusion of semantics, structure, and visual design not yet achieved; more effective use of templates proposed as future work.
  2. Insufficient integration of sequential planning + visual understanding; CoT/templates help but are not a fundamental fix.
  3. Difficulty combining visual cues with JSON-based layout structures (repeated in ablation, introduction, abstract).
  4. Failure to integrate visual information into API planning ability (stated in abstract and introduction).

### 6.2 Methodological limitations noted by the compiler (grounded in the paper; marked [COMPILER NOTE])

1. [COMPILER NOTE] **Source domain bias.** The 958 files are mostly government presentations (public policy, education, technical), English, 4:3-dominated, from 2015–2023 (§6.3). Representativeness of commercial/marketing/academic, multilingual, 16:9, and latest design trends is limited. There is tension between the "diverse domains and styles" claim (§1) and the actual source description.
2. [COMPILER NOTE] **Synthetic layout-issue construction.** Overlap/out-of-bounds cases in layout detection are simulated via controlled modifications from a custom algorithm (§7.3), whose distribution may differ from the subtle misalignments/imbalances of real expert slides.
3. [COMPILER NOTE] **Strictness of the Modification metric.** Post-execution JSON exact match (Acc_mod) requires exact agreement on all attributes including position, color, style (§4.2); semantically equivalent but numerically slightly different valid edits (e.g. 1px difference, equivalent color expressions) would be marked wrong. No comparison against tolerance-based metrics.
4. [COMPILER NOTE] **Circularity risk in Generation evaluation.** The judge Gemini-2.0 is from the same family as the evaluated Gemini-2.0-Flash (§4.2, §4.1). Human agreement (ρ 0.86–0.89, Table 4) supports reliability, but there is no analysis of judge–evaluatee independence or self-preference.
5. [COMPILER NOTE] **Open-source quantization bias.** Open-source models are deployed with ollama 4-bit quantization (§9.1). The "maintaining inference quality" claim has no before/after quantization numbers, which may affect the fairness of closed- (full-precision API) vs open-source (4-bit) comparisons.
6. [COMPILER NOTE] **API expressiveness ceiling.** The 17 APIs focus on text, pictures, and basic formatting; the list has no atomic functions for chart/table/shape-style/animation/master-theme manipulation (§9.2 list). An asymmetry: charts/tables are evaluated for understanding but generation/modification center on text/images.
7. [COMPILER NOTE] **Ambiguous placement of Note Generation.** A Generation subtask, but closer to text generation than API-execution-based generation. Whether the 0–5 design-quality rubric applies to note text as-is or a separate metric exists is [NOT IN SOURCE].
8. [COMPILER NOTE] **Missing per-subtask N and difficulty reporting.** [CORRECTED: per-subtask N (400/400/400, 626/207/206, 600/400/200, 800/200) was recovered from PDF Figure 2 (see §4.1); length distributions per subtask remain figure-only | PDF p.3 / Figure 2]
9. [COMPILER NOTE] **Unexplained mechanism of the CoT valid-sequence drop.** The 748→531 decrease is reported (§4.5.2) but without classification/ratios of failure types (wrong API name vs argument vs ordering vs execution exception).

---

## 7. Relevance to Typodeck

Typodeck context: a Slide Markdown → Slide IR (versioned intermediate representation) → Composition Engine → natively editable PPTX generation pipeline, with a Visual Critic (image+structure hybrid evaluation), a Grammar Registry (versioned visual system), a Validation-Repair gate, 38 Composition Candidates, and a reference-slide reproduction benchmark. Direction: Valid PPTX → Good Layout → Intended Visual Hierarchy (intended semantic importance = perceived visual importance).

### 7.1 Direct connections (grounded in the paper)

1. **JSON+screenshot dual input ↔ Slide IR + Visual Critic**
   - PPTBench's core design combines structured JSON (coordinates, formatting, hierarchy) with screenshots (§3.3.1, §7.2). Typodeck's Slide IR (structural intermediate representation) and Visual Critic (image+structure hybrid evaluation) share the same dual-representation philosophy. PPTBench's ablation result (Detection/Modification sensitive to JSON, Understanding sensitive to vision, §4.4) transfers directly to Typodeck evaluation design: validity checks on IR/JSON numbers, semantic/hierarchy judgments on rendered images.
2. **17 atomic APIs ↔ Composition Engine / Validation-Repair gate**
   - PPTBench's three API principles (Atomicity, Composability, Executability, §9.2) can serve as design principles for Typodeck's Composition Engine operations. In particular, defining the Modification metric as "post-execution JSON exact match" (§4.2) corresponds exactly to a Validation-Repair gate pass criterion (numeric structural agreement). PPTBench's choose_slide→choose_shape→set_* sequential dependencies can inform precondition design for Typodeck IR operations.
3. **3 API templates ↔ Grammar Registry / 38 Composition Candidates**
   - The result that Title/Bullet/Image-with-Description templates lifted Generation from GPT-4o 39.36→45.72 and Gemini 37.91→55.97 (§4.5.2) empirically demonstrates the effect of structural priors. Typodeck's Grammar Registry (versioned visual system) and 38 Composition Candidates can be positioned as a systematized, extended form of this. The contrast — PPTBench templates are 3 hardcoded API sequences while the Grammar Registry is a versioned, composable system — is useful for stating Typodeck's differentiation.
4. **LLM-as-a-Judge 6-point rubric ↔ Visual Critic / reference-slide reproduction benchmark**
   - PPTBench's 0–5 rubric (§4.2, §8.1) and human agreement ρ 0.86–0.89 (Table 4) can be directly borrowed as the evaluator-reliability validation methodology for Typodeck's Visual Critic. In particular, Figure 10's per-score-band example visualization is compatible with calibrating scoring criteria for Typodeck's reproduction benchmark.
5. **4 layout failure types ↔ evidence for Typodeck's goal stages**
   - Dominant-element misidentification, chart-proportion misjudgment, overlap-inducing moves, image-bullet overlap (§4.6) provide empirical evidence for Typodeck's "Valid PPTX → Good Layout → Intended Visual Hierarchy" staging: PPTBench models reach Valid (executable APIs) but fail at Good Layout (alignment, spacing, no overlap) and Intended Hierarchy (matching intended emphasis to dominant elements/visual emphasis).

### 7.2 Application ideas (grounded in the paper; speculation marked)

1. **Adopt PPTBench as an external validation benchmark for Typodeck.** Using the 958 PPTs, 4,439 samples, and public code/data (§3.1, Abstract) as-is, measure Typodeck pipeline Detection/Modification/Generation scores for direct comparison against existing MLLM results (Table 2 narrative values). [SPECULATION] Typodeck's deterministic Composition Engine may be advantaged over direct LLM API generation on the Modification exact-match metric, but this needs measurement.
2. **Port two-stage CoT+template generation into the Composition Engine.** Given CoT (intent interpretation, multi-step planning) plus API templates (structural priors) jointly yield up to +18pp on Generation (Gemini 37.91→55.97) (§4.5.1–§4.5.2), Typodeck can justify a 3-stage "Markdown intent parsing (CoT-like) → grammar candidate selection (template-like) → IR operation execution" structure.
3. **Modality-split evaluation design.** Based on the ablation result that JSON serves manipulation while vision serves understanding (§4.4), the Visual Critic can adopt separate "IR numeric checks (overlap, bounds, alignment)" and "rendered-image judgments (hierarchy, emphasis, balance)" sub-scores combined by weighted sum.
4. **Borrow the failure taxonomy.** Extend §4.6's 4 failure types into error codes (dominant-element, proportion, overlap, occlusion) for Typodeck's Validation-Repair gate. [SPECULATION] Since PPTBench failures stem from missing spatial reasoning, one could argue Typodeck's deterministic geometry checker preempts them — but measurement on PPTBench data must come first.
5. **Mimic the human-agreement protocol.** Apply Table 4's LLM-vs-Human + Spearman ρ reporting format directly to Typodeck Visual Critic reliability validation, e.g. adopting ρ ≥ 0.85 as a release criterion.

### 7.3 Caveats (grounded in the paper)

1. **Metric strictness differences.** PPTBench Modification requires JSON exact match (§4.2), so direct score comparison against Typodeck's tolerance-based gate may disadvantage Typodeck; renormalize to the same metric (exact match vs tolerance) when comparing.
2. **Domain mismatch.** PPTBench sources are mostly government documents, English, 4:3 (§6.3). If Typodeck targets different domains (e.g. marketing, Korean, 16:9), transfer performance needs separate validation.
3. **API scope mismatch.** The 17 PPTBench APIs include no chart/table creation functions (§9.2). If Typodeck natively generates charts/tables, PPTBench Generation scores alone cannot represent that capability.
4. **Judge-family caution.** The PPTBench Generation judge is Gemini-2.0 (§4.2). If Typodeck's Visual Critic is from the same family, self-preference concerns may arise; human evaluation alongside (Table 4 style) is recommended.
5. **CoT execution-failure rate.** CoT raises quality but reduces valid sequences 748→531 (§4.5.2). If a CoT-like stage is added to Typodeck, the Validation-Repair gate's retry/recovery rate must be designed jointly.

---

## 8. Citation Points (3 claims for the Typodeck paper)

1. **Claim:** "Even state-of-the-art MLLMs are strong at slide content understanding but systematically fail at spatial layout generation, so a deterministic layout validation/repair stage is needed in the generation pipeline."
   - **Source basis:** §4.3 difficulty hierarchy Detection < Understanding < Modification < Generation; best models only ~33% on Generation (Gemini-2.0-Flash 32.82, GPT-4o 30.25), some open-source models near zero; §4.6 case studies of 4 failure types (overlap, occlusion, misplacement).
2. **Claim:** "Structural templates are an empirically validated means of substantially improving MLLM slide generation quality, motivating their extension into a versioned visual grammar system."
   - **Source basis:** §4.5.2 template-guided generation; GPT-4o 39.36%→45.72%, Gemini-2.0-Flash 37.91%→55.97%; 3 API templates (Title, Bullet, Image-with-Description, §9.2).
3. **Claim:** "JSON structural information and rendered images are complementary: structural representations dominate manipulation accuracy, while visual information dominates semantic and chart/table understanding."
   - **Source basis:** §4.4 ablation; dual input best overall; Detection/Modification gain more from JSON while Understanding (incl. charts/tables) is sensitive to visual information; smaller models show degradations when modalities are combined.

---

## Appendix: Number/Fact Cross-Check Table (paper basis)

| Item | Value/fact | Source |
|---|---|---|
| Total samples | 4,439 | Abstract, §1, §3.1 |
| Source PPT count | 958 | Abstract, §3.3, §6 |
| Categories / subtasks | 4 / 11 | §3.1 |
| Atomic API count | 17 | §3.3.3, §9.2 |
| MC annotator agreement | 98% (2 annotators) | §3.3.2 |
| Understanding re-review | 10% of entries, 98% accuracy | §7.3 |
| Text-understanding slide selection | 600 slides | §7.3 |
| Mean slides/presentation | 23.7 (median 19) | §6.1 |
| Mean shapes/slide | 4.9 | §6.2 |
| Shape distribution | text/basic shapes ~60%, images 25%, charts 15% | §6.2 |
| Data span / aspect ratio | 2015–2023, 4:3 dominant | §6.3 |
| GPT-4o Detection/Modification | 95.92 / 86.95 | §4.3 |
| Gemini Understanding/Generation | 95.28 / 32.82 | §4.3 |
| GPT-4o Generation | 30.25 | §4.3 |
| Llama 90B vs 11B Modification | 51.19 vs 11.70 | §4.3 |
| CoT Generation GPT-4o | 30.25→39.36 | §4.5.1 |
| CoT Generation Gemma3 12B | 11.75→33.15 | §4.5.1 |
| Template GPT-4o | 39.36→45.72 | §4.5.2 |
| Template Gemini | 37.91→55.97 | §4.5.2 |
| CoT valid sequences | 748→531 | §4.5.2 |
| LLM–Human ρ | 0.86 (GPT-4o), 0.89 (Gemini) | Table 4, §4.5.3 |
| Hardware | A100 40GB ×8, Xeon ×2, 256GB RAM | §9.1 |
| Inference settings | temp 0, top_p 0.95, ctx 2048, batch 1, 4-bit quantization (open-source) | §4.1, §9.1 |
| Code/data | GitHub release | Abstract |

**Items the survey had marked [NOT IN SOURCE] due to conversion loss — now resolved from the PDF:** full Table 2 matrix (model×category scores + Overall column), full Table 3 matrix (CoT on/off for all models), Table 1 row labels (task mapping), Figure 2 per-subtask N. **Still [UNRESOLVED]:** numeric values inside Figure 3/6/7/8 bar charts (only qualitative findings used), Figure 10/11 image contents, whether a dedicated Note Generation metric exists.

