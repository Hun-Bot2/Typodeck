# PPTBench (arXiv:2609.29718, 2026) — Full Research Note for Typodeck

## 0. Bibliographic information

- **Title**: PPTBench: Can Coding Agents Reconstruct the Visual World through Structured, Editable Slides? [CORRECTED: title ends with "?" in the PDF | PDF p.1]
- **Authors**: Xiaoqiu Wang\*, Yizhe Chi\*, Wenyi Li\* (equal contribution), Deyao Hong, Zhihan Shan, Mingju Gao, Kaisen Yang, Youjie Zheng, Calvin Xiao, Qinhuai Na‡ (corresponding author)
- **Affiliations**: Navers Lab, Einsia.AI, Tsinghua University / corresponding email: nana@einsia.ai
- **Venue/year**: arXiv preprint, cs.CL; v2 dated September 28, 2026. No conference/journal venue is stated [NOT IN SOURCE].
- **arXiv link**: https://arxiv.org/abs/2609.29718 (source prints arXiv:2609.29718v2 [cs.CL])
- **DOI**: [NOT IN SOURCE].
- **Project homepage**: https://lab.einsia.ai/pptbench (the only external link stated in the paper)
- **Code/data links**: [NOT IN SOURCE] (no GitHub repository or data download link in the body; homepage only).
- **License**: CC BY 4.0 (as shown on the arXiv HTML listing; not stated in the PDF).
- **Difference from the 2025 PPTBench (must not confuse)**: This is an entirely different study from Huang et al.'s 2025 PPTBench (arXiv:2512.02624, "Towards Holistic Evaluation of Large Language Models for PowerPoint Layout and Design Understanding"). The 2025 paper covers 4,439 instances in 11 subtasks drawn from 958 government presentations, spanning slide detection, understanding, modification, and generation, with screenshot + structured-JSON inputs, 17 predefined PowerPoint APIs, task-specific accuracy, and a six-point LLM rubric (source §1, §4, App. A.3). This paper (2026) is instead a visual-coding agent benchmark that reconstructs 500 scientific flow diagrams from real arXiv papers as single-slide native editable PPTX files: no target PPTX or object decomposition is given, the agent freely chooses its authoring library, and process/connector fidelity is verified with hard gates. This entire note covers the 2026 paper.

## 1. At-a-glance summary (5 sentences)

1. To measure "visual coding" (the ability to translate a visual target into executable code), the paper proposes PPTBench: 500 tasks across 10 domains that reconstruct scientific flow diagrams from real papers as natively editable PPTX.
2. Evaluation uses a 4-stage Agentic Judge (Stage 0 artifact validity → Stage 1 semantic correctness → Stage 2 rendering/text quality → Stage 3 fine-grained visual quality) with a gated design so that fundamental failures cannot hide behind detail scores.
3. Evaluating 18,000 reconstructions across 10 models and 36 model–harness–effort configurations, the best reaches 77.34 (GPT-6 Astra, high effort) while the configuration median is 24.38, confirming a large gap in reliable visual coding.
4. Agents generally produce valid slide files, but only 31.74% pass all gates, semantic recovery is the dominant bottleneck, and 53.0% of residual deductions are text-fitting problems (largest item: unexpected_wrap).
5. More reasoning effort contributes mainly via hard-gate pass-rate gains rather than detail quality on each configuration's passing tasks, and inspection/review frequency correlates with total score more strongly than revision frequency.

## 2. Research problem and background

### 2.1 The visual-coding concept

- Source §1 definition: visual coding is an agent's ability to "translate their understanding of visual targets into executable code" (Abstract, §1).
- The core challenge is "aligning visual understanding with programmatic representation" (§1).
- Beyond generating valid programs, the agent must infer the visual structure of the target and faithfully express it in executable form (§1).

### 2.2 Why slides [SOURCE-BASED]

- A slide is not a mere image but an "editable composition" whose elements have distinct types and spatial relationships (§1).
- Shapes, text, diagrams, and layout form a compact visual language that organizes and communicates information (§1).
- Slides are a pervasive medium of human knowledge (explaining ideas, presenting research, teaching, communicating decisions) (§1).
- Slide reconstruction therefore requires recovering "how visual elements are organized to convey meaning" and expressing that structure as an editable artifact, not just replicating appearance (§1).
- The task definition (§2.1) pins this down as a contract: observe only one reference image I and generate a single-slide PPTX artifact P=A(I) composed entirely of native PowerPoint objects except explicitly approved raster elements. This blocks trivial solutions such as embedding the reference image and forces structural reconstruction.

### 2.3 Gaps in existing evaluation [SOURCE-BASED]

Source §1, §4, and App. A classify prior benchmarks as follows.

- **Slide-generation suites** (document/request-based: PPTAgent, SlidesGen-bench, PresentBench, etc.): they evaluate open-ended design, not faithful reproduction of a fixed target.
- **Chart-to-code / screenshot-to-markup** (ChartMimic, Plot2Code, Design2Code, WebSight, etc.): they reproduce a fixed target as code/markup, but the output is not native slide objects.
- **Office benchmarks** (e.g., PPTC): they evaluate instructed edits to existing PPTX files, not from-scratch reconstruction.
- **Slide2Code**: the closest setting, directly evaluating image→editable-slide reconstruction: 900 examples in 3 complexity tiers (main experiment uses 300), comparing content/position against the original PPTX plus execution, CLIP, and SSIM. It targets general slide designs and assumes a target PPTX for evaluation.
- **2025 PPTBench**: spans detection, understanding, modification, and generation including screenshot-based generation, using task-specific accuracy and a holistic generation score.
- **This paper's gap-filling**: it focuses on scientific process diagrams, verifies whether native editable reconstructions preserve process/connector structure, and awards visual-detail points only after gating artifact validity → process fidelity → legibility, separating structural failures from appearance errors (§1 closing paragraph, §4).

## 3. Core contributions (numbered; mirrors source §1 "primary contributions")

1. **Problem framing and medium choice**: defines the core visual-coding challenge as "recovering visual structure in executable representations" and selects editable slides as the medium for measuring it.
2. **PPTBench benchmark and 4-stage Agentic Judge (introduced)**: 500 scientific flow-diagram reconstruction tasks from real arXiv papers plus an automated 4-stage Agentic Judge verifying artifact validity, semantic correctness, rendering quality, and fine-grained visual fidelity.
3. **Large-scale frontier-model experiments with systematic limits**: experiments on 10 models × 36 configurations reveal systematic limits of current agents (gaps in semantic recovery and visual fidelity) and suggest directions for visual-coding agents.

## 4. Methodology detail

### 4.1 Task definition (§2.1 Task formulation)

- **Input**: a reference image I — a rasterized rendering of a paper flow diagram. The agent's only observation of the target.
- **Output**: a single-slide PPTX artifact P=A(I) composed of native PowerPoint objects; only elements that cannot be faithfully expressed with native primitives may be reused as explicitly approved raster.
- **Evaluation rendering**: the PPTX is rendered in a fixed rendering environment to obtain I^=R(P), which is compared against reference I.
- **Core contract**: (a) single slide, (b) natively editable objects, (c) approved raster appears unchanged in its intended location, (d) direct embedding of the reference image is forbidden (the evaluator screens raster for reference copies).

### 4.2 Benchmark construction: 1,000 candidates → 500 fixed tasks (§2.2)

#### (a) Figure sources

- Query arXiv metadata, download source archives, parse LaTeX figure environments to locate the authors' original graphics files.
- Use captions, file paths, and asset properties to identify flow, system-architecture, and module diagrams.
- Reason for using published figures: to expose agents to the irregular layouts, mixed notation, and visual conventions researchers actually use.
- Each candidate's paper identifier, title, version, figure number, and related metadata are preserved so every task is traceable to its source.

#### (b) Preprocessing

- Render each candidate directly from its original asset; record source identity and rendering parameters (reproducibility).
- Embedded raster blocks are inspected separately: only self-contained elements that cannot reasonably be recreated with native PowerPoint primitives are approved for reuse; the rest must be rebuilt as editable objects.
- Remove repeated figures and alternate exports within each paper.
- After filtering/preprocessing, 1,000 candidates proceed to human screening (Figure 2).

#### (c) Human screening (5 exclusion criteria)

Annotators review the 1,000 candidates and retain 500. The five exclusion criteria:

1. Exclude figures outside the flow/architecture categories.
2. Exclude diagrams too simple in content/logic to discriminate models.
3. Exclude references with insufficient resolution or illegible text.
4. Exclude cropping errors, source corruption, or rendering defects.
5. Exclude figures whose key connections, arrow directions, and node boundaries cannot be consistently identified. If the reference itself leaves an arrow's direction unclear, no reconstruction can be reliably judged against it.

Selection principle: diagrams "challenging enough to reveal differences between systems and clear enough to evaluate." The resulting 500 tasks form the fixed evaluation set.

#### (d) Task inputs

- Each task provides one reference image plus manually approved raster assets where needed.
- The agent inspects/measures the reference, then builds a single-slide reconstruction from editable text, shapes, and connectors.
- Approved raster assets must appear unchanged in their intended locations.
- The agent receives only task-specific inputs with no source-paper provenance and no access to other tasks.

#### (e) Benchmark composition and coverage (50 arXiv categories → 10 domains)

- The 500 tasks span 50 arXiv primary categories, grouped into the 10 representative domains of Figure 1. Per-domain task counts, categories, and representative source papers (App. B, Table 6):

| Domain | Tasks | arXiv classes (tasks) | Representative source paper (arXiv ID) |
|---|---|---|---|
| Systems, architecture and SE | 91 | cs.SE 32, cs.DC 31, cs.AR 25, cs.CE 1, cs.ET 1, cs.OS 1 | TDFlow (2510.23761) |
| AI and machine learning | 90 | cs.LG 54, cs.AI 19, cs.NE 15, stat.ML 2 | Distributionally Robust Framework (2505.17717) |
| Computer vision and imaging | 67 | cs.CV 51, eess.IV 15, cs.MM 1 | Interpretable Knowledge NAS (2403.13293) |
| NLP, speech and audio | 54 | cs.CL 29, eess.AS 17, cs.SD 8 | Efficient LLM Architectures Survey (2508.09834) |
| Quantum and fundamental physics | 43 | quant-ph 34, gr-qc 7, hep-ex 1, nucl-th 1 | Pinball (2512.09807) |
| Astronomy and astrophysics | 37 | astro-ph.IM 30, astro-ph.EP 3, astro-ph.GA 2, astro-ph.HE 2 | HERA Pipeline Validation (2104.09547) |
| Robotics and HCI | 29 | cs.RO 18, cs.HC 11 | RIPS for ROS 2 (2412.19272) |
| Networking, security and IR | 25 | cs.NI 10, cs.CR 5, cs.IT 5, cs.IR 4, cs.SI 1 | OPC UA Big Data architecture (2306.01418) |
| Biomedicine and life sciences | 19 | q-bio.QM 6, q-bio.NC 5, q-bio.BM 4, physics.med-ph 2, physics.bio-ph 1, q-bio.GN 1 | MegaFold (2506.20686) |
| Others | 45 | eess.SP 16, cond-mat.mtrl-sci 10, cs.CY 5, econ.GN 3, physics.soc-ph 2, physics.ins-det 2, cond-mat.dis-nn 1, cond-mat.str-el 1, math.DS 1, math.OC 1, physics.comp-ph 1, physics.flu-dyn 1, stat.AP 1 [CORRECTED: full class list; survey showed only the top classes with "etc." | PDF p.18 / Table 6] | Nab DAQ Architecture (2407.17606) |

- Structural differences across domains (§2.2): system workflows use branches and feedback loops whose connections determine the process; neural architectures combine repeated modules with dense mathematical labels; quantum circuits use the spatial convention of gate placement along aligned wires to encode operation order. Agents must recover both the visual arrangement and the relationships it expresses.

### 4.3 Evaluation protocol: 4-stage Agentic Judge (§2.3, Figure 3, Eq. (1))

#### Overall score formula

- Each reconstruction scores 0–100: the product of 3 validity gates and visual-detail quality.

  S = Gart(Stage 0) · Gsem(Stage 1) · Grt(Stage 2) · (Slayout + Stext + Sgraphics)(Stage 3)

- Gart is a deterministic binary gate (artifact validity).
- Stages 1–3 are judged by GPT-5.6 Luna High in 3 independent rounds.
- Gsem=1 requires at least two rounds to pass Stage 1; Grt=1 requires at least two of those rounds to also pass Stage 2. Both are 0/1, so a candidate must pass both judged gates in at least two rounds to receive any detail score.
- Findings from passing rounds are merged and converted to scores by deterministic rules.
- Points: layout max 30, text max 40, local graphics max 30. Normalized detail quality Q = (sum)/100.
- Judgments verify the "depicted process" by visual inspection even when PowerPoint object structures differ — i.e., no match against a reference OOXML tree is required (§2.3, §4).
- The judge is agentic: it can write and run its own cropping, color-segmentation, and geometric-measurement scripts to inspect the reference and reconstruction.
- Prompts, taxonomy, severities, dimension caps, the ratio staircase, and aggregation rules were frozen before the initial leaderboard recomputation and retained for later configurations (App. G.1).

#### Stage 0: artifact validity (deterministic checks)

- PPTX must parse and render, contain exactly 1 slide and at least 3 native editable components.
- No external relationships, embedded fonts, attachments, or ActiveX payloads.
- Missing/invalid artifacts score 0.
- Object-bounds checks + screening of raster images for reference copies.
- Valid slides are rendered and paired with the reference after cropping outer whitespace and normalizing scale/centering. Full-resolution images remain available for inspection. Image-preparation details in App. C.2 (see §4.4).

#### Stage 1: semantic correctness

- Compares nodes, labels, and directed connections.
- Checks: missing/added/incorrectly merged steps, wrong endpoints or directions, altered branches/merges/loops/cross-panel links, and label errors that change meaning.
- Local connector segments and intermediate arrowheads are traced, so a missing segment or moved arrowhead alone can fail this stage even when the overall process looks plausible.
- One confirmed discrepancy ends the round; the affected node/connection is recorded as the reason.

#### Stage 2: rendering and text quality

- After the semantic gate passes, legibility is checked.
- Failure triggers (either): (a) black regions, distortion, tearing, severe ghosting, or blank blocks affecting more than 30% of the figure, or (b) more than 50% of text boxes overflowing, overlapping, or breaking improperly.
- A failure ends the round. Localized defects proceed to Stage 3 for graded deductions.

#### Stage 3: fine-grained visual quality

- Compares layout/composition, text/typography, and local graphics such as nodes and connectors.
- The judge assigns no points directly; it records only defects and their extent.
- Merge rule: findings from passing rounds are merged by dimension, category, and issue subtype [CORRECTED: survey said "by issue type within each category"; the source merges by dimension, category, and issue subtype | PDF p.4/p.30], retaining the largest reported affected fraction.
- A fixed rubric deducts points by severity and extent, up to each dimension's cap.
- Outer whitespace, global centering, and absolute content scale do not affect the score.
- Finding schema, merge rules, and deduction formulas in App. I; scored examples in App. H.

### 4.4 Execution, cost, image, and score-aggregation details (App. C, I)

- **Generation prompt (App. C.1)**: instructs inspecting the reference image and reconstructing it as a single editable PowerPoint slide. Lists the task's approved raster resources, requires each to appear unmodified in its intended location, and requires all other diagram content as native objects. Before submission, the agent must open or parse the deck to verify validity.
- **Authoring tools**: the agent's free choice; python-pptx and Pillow are provided.
- **Astra runtime**: Codex CLI 0.154.0, generation concurrency 10, judge concurrency 4/effort. Model-call, first-event, and stream-idle timeouts disabled. Invalid/missing model outputs score 0. Rendering operates on the final generated deck.
- **Cost accounting**: 500-task generation totals per configuration (judging excluded). Recorded provider charges or token usage repriced at a frozen price snapshot; reasoning tokens billed as output, cached input accounted separately. Astra rates (per million tokens): $10 uncached input, $1 cached input, $12.50 cache writes, $50 output. Long-context surcharges, service-tier adjustments, and tool fees excluded.
- **Image preparation (App. C.2)**: Stage 0 validation → LibreOffice rendering → 3 judge stages → deterministic 3-round aggregation. Normalization: median border color as background, content threshold 10 intensity levels, 2% crop margin (4-pixel minimum). Aspect-preserving crops centered in 1200×900 white panels, 4-pixel separation. Full-resolution images enclosed. All 2,500 Astra runs exclude captions. Agents receive only reference/resource images with no provenance.
- **Deduction formulas (App. I, Eqs. (2)–(4))**: merged fraction ρk = max (category-level affected fraction assigned in passing rounds reporting that finding). Severity bases bk: High 3.0, Medium 1.5, Low 0.5, Diagnostic 0. Dimension caps (Wlayout, Wtext, Wgraphics) = (30, 40, 30). Multiplier m(ρ): ρ≤0.02→1.00, ≤0.10→1.25, ≤0.25→1.50, ≤0.50→2.00, ≤1→2.50. Per-dimension penalty Pd = min(Wd, Σ round2[bk·m(ρk)]), retained score Sd = Wd−Pd. Identical merged findings give identical scores (deterministic); rubric weights can change without re-judging images.
- **Issue taxonomy (App. I, Table 15)**: layout (panel misalignment High/Medium/Diagnostic, node layout deviation High/Medium, panel style error Low/Diagnostic), text (spelling/omission High/Low, overflow/edge-touch High/Medium, improper typography Medium/Low), local graphics (node shape High/Medium/Low, node style Low, node shadow Diagnostic, vector/icon confusion Medium/Low, line/arrow details High/Medium/Low/Diagnostic). Diagnostic means recorded with zero deduction (e.g., global_scale, global_centering, outer_whitespace, panel_shadow, node-shadow family, line_shadow).

## 5. Experimental results detail

### 5.1 Setup and metrics (§3.1)

- **Scale**: 10 models × 36 model–harness–effort configurations (Table 1), all 500 tasks per configuration → 18,000 scored reconstructions.
- **Harnesses**: Codex, Claude Code, or OpenCode per model as listed in Table 1; results are model+harness joint performance, not the model alone.
- **Evaluation scope**: the full benchmark, including tasks used for protocol development and judge validation.
- **Main metric**: mean S over all 500 tasks (invalid/gated outputs score zero).
- **Auxiliary metrics**: artifact validity (Stage-0 pass rate), gate-pass rate (all-gate pass rate), score on passed tasks (mean over all-gate-passing reconstructions only). Mean S = gate-pass rate × score on passed tasks.
- Layout/text/graphics scores are also all-task means (gated = 0) and sum to mean S.
- Generation cost is per-configuration USD for 500 tasks (judging excluded).
- Execution/cost details in App. C.1; configuration- and family-weighting comparisons in App. E.

### 5.2 Overall performance (Table 1, §3.2)

- **Best**: GPT-6 Astra + Codex + high = **77.34** (gate-pass 80.8%, passed-task score 95.7, layout 24.02/30, text 30.02/40, graphics 23.30/30, cost $321).
- **2nd/3rd**: Astra xhigh 72.60 (74.8%, 97.1, $967), Astra max 68.76 (71.0%, 96.8, $1,598).
- **4th/5th**: Astra medium 68.16 (71.6%, $208), Kimi K3 + OpenCode + high 67.80 (73.8%, 91.9, $1,158).
- **6th**: Astra low 59.42 (63.0%, $179).
- **Median**: **24.38** across the 36 configurations.
- **Above 40**: 8 of 36 configurations.
- **Weakest**: GPT-5.6 Luna + Codex + none = 1.53 (1.8% gate-pass).
- **Flawless passes**: 461 of 18,000 (2.56%) pass the gates with zero recorded detail findings.
- **Cost**: 500-task generation costs range $20.67–$1,598.36, median about $151.50. Astra averages 156,884 tokens/task at high effort and 849,174 at max.
- **Cost-contrast cases**: Qwen 3.8 Max + Claude Code + xhigh scores 47.69, within 1.59 points of Sol Max (49.28) at roughly one-third the cost ($307 vs $988). GLM-5.3-Flash + OpenCode + max reaches 32.42 for $52.53. Astra Max is the most expensive configuration. These are comparisons among evaluated model–harness configurations under the frozen price snapshot.
- **Other lower-rank examples**: Claude Opus 5 family 17.90–35.91 (xhigh best at 35.91), Claude Sonnet 5 family 4.03–8.98, GPT-5.6 Terra 3.55–33.46, GPT-5.6 Luna 1.53–31.02, GPT-5.5 medium 9.64, GPT-5.6 Sol none–max 4.99–49.28.

### 5.3 Agent behavior and failure modes (§3.3, Figures 4–5, App. C.3, D, E, F)

#### (a) Valid-file generation vs. semantic/visual-fidelity gap

- Only 5,714 of 18,000 (**31.74%**) pass all gates. Figure 4 shows the per-reconstruction distribution of gate-triggering rounds; two or more rejections give a zero score.
- Per-model breakdown (App. C.3, Figure 6): **semantics (Stage 1) is the dominant failure stage**.
- Representative failures (App. D): palette/panel layout preserved while arrows reverse or branch targets change (Task 0017: disconnected subtraction branch, rerouted selection path; Task 0104: altered feedback connector below the Update block). [CORRECTED: the "fails all three judge rounds" statement covers the two Figure 7 examples (Task 0017 and the illegible-connector-label case); no round count is stated for Task 0104 (Figure 8) | PDF p.21]
- **Range contrast**: gate-pass rates span 1.8–80.8% while passed-task mean scores span only 63.0–97.1. Mean score tracks gate passage closely (r = 0.997), consistent with the multiplicative score and the larger variation in gate success.

#### (b) Text fitting dominates residual deductions

- Of 64,210.58 total penalty points among gate-passing cases: text 53.0%, local graphics 34.3%, layout 12.8%.
- Largest single deduction: **unexpected_wrap** (unintended line wrapping) — 5,723.9 points (5,724 in body text), 1,864 cases, mean affected fraction 0.577.
- Clipping, overflow, and unintended line breaks expose "a gap between declared text-frame geometry and rendered output": the OOXML text frame specifies only a container while the renderer decides wrapping, so inspecting native objects alone misses defects visible after rendering (§3.3).
- App. D.1, Table 7 — top-15 deductions (cases · mean fraction · total · single-round support): unexpected_wrap (Text/Medium/1,864/0.577/5,723.9/6.8%), outside_text_box (Text/High/658/0.319/3,441.8/35.7%), node_aspect_ratio (Graphics/Medium/802/0.655/2,614.5/53.7%), horizontal_alignment (Text/Medium/737/0.694/2,446.7/42.1%), text_connector_overlap (Text/High/385/0.342/2,061.8/55.3%), text_node_overlap (Text/High/379/0.306/1,929.8/43.5%), substituted_icon (Graphics/Medium/542/0.794/1,877.0/36.5%), node_size (Graphics/Medium/520/0.654/1,699.7/67.1%), font_size (Text/Low/1,315/0.905/1,593.2/46.1%), edge_touch (Text/Medium/574/0.308/1,473.1/62.7%), node_fill (Graphics/Low/1,200/0.848/1,421.2/44.2%), mid_word_break (Text/Medium/434/0.575/1,343.5/48.2%), vertical_alignment (Text/Medium/382/0.798/1,325.8/76.2%), text_color (Text/Medium/388/0.737/1,307.0/45.1%), node_spacing (Layout/Medium/360/0.781/1,237.6/73.3%). Across all issue types, 10,191 text and 10,849 local-graphics occurrences recorded.

#### (c) Reasoning-effort effects: gate-passage gains, diminishing/non-monotonic

- GPT-6 Astra low→high: +17.92 points (gate-pass rate +17.8pp, passed-task score +1.4 points).
- Sol none→max: +44.29 points (gate-pass rate +46.8pp). Terra and Luna show the same broad pattern (Figure 5).
- More compute is not uniformly beneficial: Opus peaks at xhigh (35.91) then falls to 33.54 at max, while Sonnet moves 8.76 (high) → 8.98 (xhigh) but loses artifact validity (98.4% → 95.6%).
- Interpretation: more compute chiefly changes how often systems recover the process (gate passage); it does not consistently eliminate local visual defects.
- **Conditional-mean trap**: passed-task means cover different passing sets per configuration and cannot be directly compared. On the 289 tasks passing under both Astra High and Max, Max's detail rises +0.98 points while its overall gate-pass rate falls −9.8pp (66 newly passing, 115 newly failing; net −49/500). App. E, Table 8 gives matched common-pass comparisons [CORRECTED: full Table 8 repaired from the PDF — Opus 5 max: N=147, Δdetail +1.76 [0.15, 3.43], Δp 0.0pp; Sonnet 5 xhigh: N=35, +0.58 [−2.75, 3.87], +0.4pp; Luna max: N=85, +4.39 [1.88, 7.01], +12.6pp; Sol max: N=109, +4.13 [2.43, 5.91], +20.8pp; Terra max: N=66, +2.83 [0.22, 5.47], +18.0pp; Astra max: N=289, +0.98 [0.18, 1.75], −9.8pp | PDF p.23 / Table 8] (high vs. highest effort; percentile intervals from 10,000 paired task resamples, seed 20260925, no multiplicity adjustment).

#### (d) Inspection frequency vs. score (correlation, not causation)

- Trajectory analysis over 27 configurations (26 across five effort sweeps + one GPT-5.5 configuration; Sol Medium excluded; families: Sol, Terra, Luna, Opus, Sonnet, GPT-5.5) (App. F).
- Review turn (renders/inspects the candidate) vs. revision turn (edits the deck).
- Mean score vs. review turns: Pearson r = 0.881, Spearman ρ = 0.897. Vs. revision turns: r = 0.255, ρ = 0.462. Inspection correlates with score more strongly than editing.
- **Explicitly not causal**: "This association … does not establish that forced inspection improves quality: reasoning effort affects both inspection and performance, and equally frequent reviews yield different scores across families." E.g., at max effort Sol averages 6.75 reviews/task at 49.28, Luna 6.48 reviews at 31.02, Terra 3.15 reviews at 33.46. Within-family review–score correlations range 0.922–0.998, but revision counts also correlate positively within these effort sweeps [CORRECTED: exact per-family values repaired from the PDF — Opus 5 (n=5): review r 0.947/ρ 0.900, revision r 0.927/ρ 0.900; Sonnet 5 (n=4): 0.922/1.000, 0.913/1.000; Luna (n=6): 0.946/1.000, 0.920/0.943; Sol (n=5): 0.998/1.000, 0.979/0.900; Terra (n=6): 0.955/1.000, 0.798/0.600; GPT-5.5 (n=1): undefined | PDF p.24 / Table 10]. "The pooled contrast thus describes differences in agent behavior without isolating the effect of visual inspection."

### 5.4 Judge agreement and ranking stability (§3.4, App. G)

- **Substantial agreement with human gate judgments**: 50 tasks × 4 reconstructions = 200 cases, labeled independently by 3 annotators blinded to model, effort, and judge outputs. Annotators are unanimous on 81.5%. The 3-round Luna High majority agrees with the human majority on **86.5%** (173/200, Wilson 95% CI 81.1–90.6%), with 15 extra gates and 12 missed gates [CORRECTED: Table 2 gaps repaired from the PDF — human pairwise agreement 90.5% (κ 0.781), 89.0% (κ 0.766), 83.5% (κ 0.645); Fleiss κ 0.728; judge-vs-human-majority Cohen κ 0.696, precision (gate) 88.9%, recall 90.9%, F1 89.9%; confusion: Luna-gate/human-gate 120, Luna-gate/human-pass 15, Luna-pass/human-gate 12, Luna-pass/human-pass 53 | PDF p.8 / Table 2]. Human three-way unanimity and majority-to-majority agreement measure different quantities, so the former is not an exact ceiling for the latter.
- **Judge repeatability**: Luna High single-round unanimity 87.5% (Fleiss κ 0.809). Two independently collected 3-round majorities (rounds 1–3 vs. 4–6) agree on 192/200 cases (**96.0%**; 8 disagreements — 3 gated only by the first triplet, 5 only by the second). The additional triplet evaluates gates only, without Stage 3 enumeration [CORRECTED: Table 3 gaps repaired — Sol Medium 86.5%/κ 0.797/27 flipped, Terra High 81.0%/κ 0.714/38 flipped; repeated-triplet Cohen κ 0.908, gate F1 0.971 | PDF p.8 / Table 3].
- **Detail findings**: single-round support varies widely by issue (unexpected_wrap 6.8% vs. node_spacing 73.3%). On 52 cases passed by all three annotators, exact issue-set match holds in 9 cases (17.3%), mean pairwise Jaccard 0.392. Across four detail-scoring variants, rank correlations with the original ordering remain τ = 0.971–0.997 (App. G.4) [CORRECTED: exact Table 13 values repaired — two-round support τ 0.975, median Δ +1.77, max |Δ| 4.53, 8/630 reversed; unit multiplier τ 0.971, +1.70, 4.15, 9/630; equal weights τ 0.997, +0.13, 0.55, 1/630; category maximum τ 0.981, +1.21, 2.74, 6/630; among the 5,714 passed cases two-round support raises mean detail +5.89 and category maximum +3.87; all variants keep Astra High first and preserve the top-five set | PDF p.27 / Table 13]. Gate-vote-threshold sensitivity (1-pass / majority / unanimous) in App. G.3: reaggregating Astra's 7,500 recorded rounds, gate votes disagree in 258 cases (170 task IDs); 1-pass admits 97 majority failures, unanimity rejects 161 majority passes (Table 12). [CORRECTED: within-triplet detail variation (Table 11, conditional on all three rounds passing, 1,645 Astra artifacts) repaired — Low (n=279): median range 2.50, 95th pct 8.52, mean pairwise diff 2.03; Medium (324): 1.87/7.76/1.84; High (366): 1.50/7.50/1.62; XHigh (354): 1.06/7.50/1.30; Max (322): 0.62/7.50/1.27; all (1,645): 1.25/7.50/1.60 | PDF p.26 / Table 11]
- **Ranking stability**: 10,000 paired task-bootstraps per benchmark size (Table 4). At 500 tasks, mean Kendall τ 0.956 (5–95% 0.933–0.975), Astra High ranks first in 97.4% of resamples, top-2 set reproduced 88.0%, top-5 99.8%. Mean 95% CI width 5.95 (max 8.29). At 500 tasks, only 5 of 35 adjacent score differences have 95% intervals excluding zero. Astra High's lead over Astra XHigh is 4.74 points with paired 95% CI [−0.07, 9.53] (includes zero).
- **Aggregation weighting (App. E, Table 9)**: 36 configurations equal-weighted 28.18 (CI 26.72–29.62, median 24.38); within-family equal-weighted 31.91 (median 27.14); highest-effort selection 38.26 (median 33.50); observed-best selection 39.36 (median 34.69). Intervals use paired 500-task resamples.

### 5.5 Related work (§4) and appendix comparison table (App. A, Table 5)

- §4 is organized into (1) presentations/posters/office documents, (2) diagram understanding/parsing/generation, (3) model-based judges and agentic execution.
- App. A, Table 5 compares 7 rows: chart reconstruction (plotting code), visual code reconstruction (TikZ/SVG etc.), diagram parsing/evaluation (constituents/relations), slide generation/editing (decks/PPTX edits), reference-image slide reconstruction (Slide2Code, editable PPTX), 2025 PPTBench (answers/API sequences), this PPTBench (native PPTX slide; fixed scientific-diagram reconstruction + native validity + visible process fidelity + visual-defect checks).
- Distinction from Slide2Code (App. A.2): collects 500 scientific flows without target PPTX files; staged records separate native validity, reference-specific process/connector requirements, and visual penalties.
- Distinction from 2025 PPTBench (App. A.3): see §0/§5.5 above. Agents freely choose their authoring library; hard gates on reference-specific process/connector fidelity and rendering quality apply before localized findings convert to deterministic deductions.

### 5.6 Conclusion (§5)

- PPTBench evaluates how coding agents translate visual targets into structured, editable slides: 500 scientific flow tasks + 4-stage judge (artifact validity, process semantics, rendering quality, visual detail).
- Across ten models and 36 configurations, agents generally produce valid slides but struggle to preserve the depicted process and visual structure; best mean score 77.34.
- Follow-ups: explicit structural reasoning and verification through rendered feedback; extending evaluation to richer visual artifacts such as interfaces and 3D scenes.
- Vision: supporting agents that turn visual intent into meaningful artifacts people can inspect, edit, and reuse.

## 6. Limitations and follow-ups

### 6.1 Paper-stated limitations/follow-ups [SOURCE-BASED]

- **Follow-ups (§5)**: (a) explicit structural reasoning, (b) verification through rendered feedback, (c) extending evaluation to richer visual artifacts (interfaces, 3D scenes). The current benchmark stays within scientific flow diagrams / single-slide PPTX.
- **Correlation ≠ causation (§3.3)**: the strong inspection-frequency/score correlation cannot be read causally; forced inspection is not shown to raise quality.
- **Conditional means not comparable (§3.3, App. E)**: passed-task means cover different passing sets per configuration, so direct comparison is distorted; supplemented with matched common-pass comparisons.
- **No unanimity-as-ceiling reading (§3.4)**: human unanimity (81.5%) is not an exact ceiling for human-majority/judge-majority agreement (86.5%); they are different statistics.
- **Ranking uncertainty (App. G.5)**: even at 500 tasks, only 5 of 35 adjacent differences are significant (95% CI excluding zero), and the rank-1 lead (4.74 points) has a paired CI including zero. Broad tiers are stable; adjacent ranks are not definitive.
- **Cost-comparison scope (§3.2)**: cost comparisons hold only among evaluated configurations under the frozen price snapshot; they change if prices move.
- **Judge-validation scope (§3.4, App. G.1)**: human validation covers gate judgments (200 cases) and issue sets (52 cases); continuous detail scores are addressed only via judge-variation and scoring-policy sensitivity analyses.
- **Harness confounding (§3.1)**: results are model+harness joint performance and cannot be attributed to the model alone.

### 6.2 Methodological limitations in the compiler's view [COMPILER NOTE — not directly claimed in the source]

- **Judge–generator model overlap**: judging relies on the single GPT-5.6 Luna High family while Luna/Sol/Terra from the same GPT-5.6 line are also evaluated. The paper reports blinded validation, repeatability, and policy sensitivity but no direct control for same-family self-preference.
- **Text weight (40/100) dominating results**: 53% of residual deductions are text and the largest item is a renderer-dependent wrapping issue. This lets typo/render fitting dominate detail scores relative to the benchmark's headline goal of "process-meaning recovery." The gates discriminate meaning first so it is not fatal, but within-pass rankings are sensitive to text-render issues.
- **Arbitrary Stage-2 thresholds (30%/50%)**: no empirical basis is given for the 30% render-defect / 50% text-box cutoffs. Moving them could shift gate-pass rates substantially.
- **Single-round-support spread**: issues with high single-round support (e.g., node_spacing 73.3%) enter deductions as-is under the "reported in any passing round → adopt + max fraction" merge rule. That the two-round-support variant raises mean detail +5.89 points suggests the current aggregation may lean toward lenient adoption (though rank correlations stay ≥ 0.971) [CORRECTED: the +5.89 figure is the mean-detail gain among the 5,714 passed cases | PDF p.27].
- **Two sides of ignoring object structure**: judging only the "visible process" without OOXML-tree matching means editability itself is unevaluated. A reconstruction can score highly with crude object decomposition (e.g., rampant text boxes, no grouping) as long as meaning/appearance match. "Editable" is enforced only via Stage-0 minimum conditions (3 native components, raster-copy ban).
- **Single-reference-image input vs. reality**: real slide authoring also uses text briefs, brand systems, and content sources, but this task is limited to reproducing one image. It does not measure planning/drafting ability of generative slide pipelines.
- **Fixed LibreOffice renderer**: evaluation rendering is fixed to LibreOffice. It may differ from native PowerPoint rendering, and renderer-dependent judgments (e.g., text wrapping) depend on that choice.
- **Domain imbalance**: domain task counts differ 2–5× (Systems 91, AI/ML 90 vs. Biomedicine 19). Mean scores weight toward large domains.
- **Trajectory-sample bias**: the review–revision correlation analysis covers only 27 configurations / 6 families and excludes the top performers (Astra, Kimi, Qwen, GLM). Whether the "inspection matters more than editing" pattern holds for the best settings is [NOT IN SOURCE].
- **Asymmetric Astra runtime detail**: runtime settings (Codex CLI version, concurrency, timeouts) are reported in detail only for Astra; other harness settings are at Table-1 listing level (which the paper itself acknowledges).

## 7. Typodeck relevance

Typodeck context premise: Slide Markdown → Slide IR (versioned intermediate representation) → Composition Engine → native editable PPTX pipeline; Visual Critic (image+structure hybrid evaluation); Grammar Registry (versioned visual system); Validation-Repair gates; 38 Composition Candidates; an owned reference-slide reproduction benchmark. Goal direction: Valid PPTX → Good Layout → Intended Visual Hierarchy (matching intended meaning importance to perceived visual importance).

### 7.1 Direct connections (grounded in the paper)

- **Prior art for editable-PPTX reproduction evaluation**: PPTBench first enforces "Stage 0 artifact validity (parseable, single slide, ≥3 native components, external-relationship/embedded-font/ActiveX bans, raster-copy screening)" for reference-image→native-PPTX reconstruction (§2.3). It maps directly onto Typodeck's Validation-Repair gate stage 1 (Valid PPTX) and is a portable checklist for Typodeck's reference-slide reproduction benchmark.
- **Matching gated-evaluation philosophy**: the S = Gart·Gsem·Grt·(detail sum) design ensures "fundamental failures cannot hide behind detail scores" (§2.3). It is structurally identical to Typodeck's Valid PPTX → Good Layout → Intended Visual Hierarchy staging. Stage 1 items (nodes, labels, directed connections, branch/merge/loop preservation) are reusable as concrete check items (endpoints, directions, branch targets, meaning-changing label edits) for the meaning-preservation axis of Typodeck's intended-vs-perceived importance goal.
- **Warning that text render fitting is the largest deduction source**: 53.0% of residual deductions are text; top item unexpected_wrap (5,724 points, 1,864 cases) is caused by "the gap between declared OOXML geometry and renderer wrapping decisions" (§3.3). If Typodeck's Composition Engine declares text-box geometry without render checks, it will reproduce the same failures. Direct evidence that the Visual Critic must include post-render text checks (overflow, overlap, unintended wrapping, mid-word breaks).
- **Quantitative basis for inspect-and-regenerate loops**: review-turn/score correlation r = 0.881/ρ = 0.897 vs. revision-turn r = 0.255/ρ = 0.462 (27 configurations, §3.3, App. F). Empirical support for designing Typodeck's inspect-and-regenerate loop (Visual Critic → regeneration) around render-inspection frequency. But since the paper denies causation (§3.3), Typodeck needs its own controlled experiment to claim a causal effect of forced inspection.
- **Limits of reasoning-effort returns**: effort gains come mostly via gate-pass rate (+17.8pp) rather than passed-task detail (+1.4, Astra low→high), and some models decline at max effort (Opus xhigh→max 35.91→33.54, §3.3). A design lesson for Typodeck agents: split compute budgets between stage-1 pass rate (gates) and stage-2 detail quality.
- **Judge-design template**: 3 independent rounds + majority (2/3), passing-round finding merge (max fraction), deterministic score conversion, human blinded validation (86.5% agreement, Wilson CI), repeatability (96.0%), policy sensitivity (τ 0.971–0.997), task-bootstrap ranking-stability reporting (§3.4, App. G). Directly reusable as the reliability-reporting format (agreement, repeatability, sensitivity, ranking stability) for Typodeck's Visual Critic.
- **Reusable issue taxonomy**: App. I, Table 15's dozens of issue subtypes (panel/node/text/connector/arrow) with severity bases (High 3.0 / Medium 1.5 / Low 0.5 / Diagnostic 0) plus the affected-fraction staircase m(ρ) directly inform the violation-item/severity design of Typodeck's Grammar Registry. The Diagnostic concept (recorded, zero deduction) is useful for "observe but don't penalize" items.

### 7.2 Application ideas (speculation marked)

- **Typodeck 3-gate mapping (a mapping proposal, not speculation)**: consider restructuring the reference-slide reproduction benchmark in gated form — PPTBench Stage 0 → Typodeck Valid PPTX, Stage 1 → a meaning-preservation sub-gate under Good Layout, Stage 2 → a render-legibility gate, Stage 3 → Intended Visual Hierarchy detail scores. [The mapping proposal is the compiler's interpretation, not a source claim] [COMPILER NOTE]
- **New text-render verification gate**: after Composition Engine output, render via LibreOffice (or Typodeck's standard renderer) and check text-box overflow/overlap/wrapping in the Validation-Repair gate. Use PPTBench Stage-2 thresholds (30%/50%) as initial values, then recalibrate on Typodeck data. [Threshold porting is a speculation-level proposal] [SPECULATION]
- **Inspection-frequency budget experiment [SPECULATION]**: a controlled experiment varying review counts (1→3→5) in the inspect-and-regenerate loop while measuring reproduction score and cost would let Typodeck directly obtain the "causal effect of forced inspection" the paper leaves open. [Whether causation can be established is speculation]
- **Gated scoring for the 38 Composition Candidates [SPECULATION]**: replacing per-candidate mean scores with the "gate-pass rate × passed-candidate mean" decomposition could isolate the gate bottleneck driving means, as in the paper's r = 0.997 observation. [Whether it helps is speculation]
- **Borrowing Grammar Registry violation severities (a reference proposal, not speculation)**: apply the High/Medium/Low/Diagnostic 4-level + affected-fraction-staircase structure to Typodeck visual-system violations. But PPTBench weights (3.0/1.5/0.5, m(ρ) 1.00–2.50) are tuned for scientific diagrams and need re-estimation for Typodeck slides. [The re-estimation need is the compiler's judgment] [COMPILER NOTE]

### 7.3 Caveats (grounded in the paper; speculation separated)

- **Shallow verification of "editable"**: PPTBench's "editable" is a minimum-conditions check (Stage 0); object-decomposition quality (grouping, masters, style consistency) is unevaluated [SOURCE-BASED; see §6.2]. Typodeck must not claim editability from this benchmark's score alone if native editability is a core value.
- **Scientific-diagram bias**: all 500 tasks are scientific flow/architecture diagrams [SOURCE-BASED]. They do not generalize to general marketing/report slides (typography, whitespace, brand aesthetics). Typodeck's benchmark must keep domains separate.
- **Single-image-input scope**: text-brief/content-source-based generation (document→deck) is out of scope [SOURCE-BASED]. This paper cannot justify Typodeck's full Slide Markdown→IR→Engine pipeline; it applies only to the reconstruction segment.
- **Renderer dependence (partly speculation)**: the evaluation renderer is fixed to LibreOffice [SOURCE-BASED]. If Typodeck's standard renderer differs, text judgments may change [SPECULATION]. Do not reuse thresholds without cross-renderer validation.
- **Statistical uncertainty of the rank-1 lead**: Astra High's rank-1 paired 95% CI includes zero [SOURCE-BASED]. Cite the "best model" by tier, never as a definitive ranking.
- **Cost figures expire**: they rest on a frozen price snapshot and may differ at citation time [SOURCE-BASED]. Do not cite cost claims without recomputation.

## 8. Citation points (3 claims for a Typodeck paper)

1. **"Current coding agents can produce valid slide files but fail to faithfully recover the process and visual structure of scientific diagrams."**
   Evidence: across 10 models, 36 configurations, and 18,000 reconstructions, only 31.74% (5,714) pass all gates; best 77.34 vs. median 24.38 (§3.2–§3.3). Semantics (Stage 1) is the dominant failure stage (App. C.3). Suited as the primary citation for Typodeck's contribution motive ("why a validation-strong reproduction pipeline is needed").

2. **"Over half of residual quality loss in slide reproduction comes from text render fitting, caused by the gap between declared OOXML geometry and renderer wrapping decisions."**
   Evidence: text accounts for 53.0% of 64,210.58 total passed-case deductions; top item unexpected_wrap at 5,724 points, 1,864 cases, mean fraction 0.577 (§3.3, App. D.1, Table 7). Cite for the need for post-render text checks in Typodeck's Validation-Repair gate and text-box handling in the Composition Engine.

3. **"Visual reproduction quality correlates more strongly with inspection (render-and-check) counts than edit counts (r = 0.881 vs. r = 0.255), and reasoning-effort gains come mostly via gate-pass-rate improvement rather than detail quality."**
   Evidence: 27-configuration trajectory analysis, review Pearson 0.881 / Spearman 0.897 vs. revision 0.255/0.462 (§3.3, App. F). Astra low→high +17.92 points decomposes into gate +17.8pp and passed-task +1.4 (§3.3). Cite for Typodeck's inspect-and-regenerate loop (Visual-Critic-centered design) and compute-budget principle (pass rate first). Since the paper denies causation, phrase as "correlational evidence; causal validation performed in this (Typodeck) study."

---

*Compilation basis: full reading of the source (PDF, 32 pages: Abstract, §1–§5, references, App. A–I). Numbers and quotations follow source notation. [CORRECTED: the survey's "755-line arXiv HTML" basis note is superseded — this translation was verified against the PDF (sha256 b7cf50c4…de98d64, 32 pages), and the Table 2/3/8/10/11/13 cells missing from the HTML conversion were repaired from the PDF as marked inline | PDF Tables 2/3/8/10/11/13] Items [NOT IN SOURCE]: DOI, code/data repository links, task-split seeds beyond the 10 domains (the seed 20260925 in App. E is for paired resampling, not task splitting), and visual-only numbers in Figures 1/4/5/9/10/11 (only body-text figures reflected).*
