# Paper Digest: Predicting Visual Importance Across Graphic Design Types (Fosco et al., UIST 2020)

> Scope note (from the Korean survey): the survey was compiled from a full read of a designated source text (329 lines, 67,648 bytes, an arXiv HTML conversion), cover to cover (Abstract → 1 Introduction → 2 Related Work → 3 Imp1k → 4 UMSI → 5 Evaluation → 6 Applications → 7 Conclusion → References).
> Verification basis for this translation: PDF `sources/02-umsi-visual-importance.pdf` (arXiv:2008.02912v1, 12 pages, sha256 `dd800947…89278`), full text extracted and read; Figures 4, 5, and 7 (part) viewed from extracted images. Citation numbers below follow the PDF's reference list ([CORRECTED: the survey's HTML-based numbers ran one higher, i.e. survey [n] = PDF [n−1] for n ≥ 2 — e.g. survey [7]/[29]/[14]/[20] = PDF [6]/[28]/[13]/[19] — verified against the PDF body text and the ar5iv HTML rendering | PDF pp.1–12]; the single citation [1, 2, 3, 17] in §2.2 already matched the PDF and is unchanged).

---

## 0. Bibliographic Information

- **Title**: Predicting Visual Importance Across Graphic Design Types
- **Authors**: Camilo Fosco (MIT)¹, Vincent Casser (MIT)¹, Amish Kumar Bedi (Adobe Inc.)², Peter O'Donovan (Adobe Inc.)², Aaron Hertzmann (Adobe Research)³, Zoya Bylinskii (Adobe Research)³
- **Venue/year**: ACM UIST 2020. The paper states: "Note: This is the author's preprint copy. This is not the official ACM published version, which will appear at UIST 2020." [NOT IN SOURCE: the "October 20–23" conference dates given in the survey do not appear in the PDF.]
- **arXiv**: arXiv:2008.02912v1 [cs.CV], 7 August 2020 (stamp on PDF p.1). Canonical abstract page: https://arxiv.org/abs/2008.02912 [NOT IN SOURCE: the "Back to Abstract / Download PDF" page chrome cited in the survey is not part of the PDF.]
- **Categories/keywords**: H.5.1 Information Interfaces and Presentation: Multimedia / Graphic Designs; Importance; Saliency; Human Attention; Automated Design; User Interface for Design; Deep Learning
- **Code/data/project page**: stated in an Abstract footnote — "The model, code, and importance dataset are available at: http://predimportance.mit.edu" (no DOI is given [NOT IN SOURCE])

---

## 1. At-a-Glance Summary (5 sentences)

1. This paper proposes UMSI, the Unified Model of Saliency and Importance — a single model handling five graphic-design types (advertisements, infographics, mobile UIs, movie posters, webpages) plus natural images.
2. The core idea is to first automatically classify the input's design type and then predict a heatmap tuned to each class — importance for designs, saliency for natural images — so users never specify the input type.
3. It also builds and releases Imp1k: 5 classes × 200 = 1,000 designs with crowdsourced importance annotations.
4. UMSI beats the previous best importance model on every metric on the existing importance dataset (GDI) and on Imp1k (a 54% gain in CC on GDI), and approaches the state-of-the-art saliency model (SAM) on natural-image saliency.
5. It further demonstrates two applications that put predicted importance to work in the design process — an interactive tool for matching target relative importance, and a reflow tool that changes aspect ratio while preserving the importance ranking — each validated with a prototype and user studies.

---

## 2. Research Problem and Background

### 2.1 visual importance vs. saliency ([SOURCE-BASED]: §1, §2)

- **saliency**: models eye fixations; mostly used on natural images to predict "where people look" (§1: "Unlike saliency or visual flow which model eye fixations and trajectories, respectively").
- **visual flow**: models gaze trajectories (prior work on comics [9] and webpages [29]).
- **importance**: identifies design elements of interest/relevance to the viewer (§1: "importance identifies design elements of interest/relevance to the viewer"). It is approximated by averaging direct annotations of "elements that look important," instead of eye tracking. The paper argues importance is "more practical as a building block for downstream design applications" (§1).
- **Key conceptual choice** (§2): "As in prior work [6, 28], we are using a viewer-identified notion of importance rather than a designer-specified notion. We are not explicitly taking into account aesthetics or design heuristics, but are focused on modeling the behavior of the viewer of the content." For Typodeck's "intended vs. perceived importance" framing, this means the model sits squarely on the *perceived* importance side.

### 2.2 Limitations of prior models ([SOURCE-BASED]: Abstract, §1, §2, §3 opening)

1. **Single-specialized-dataset training, poor generalization**: "Previous methods for predicting saliency or visual importance are trained individually on specialized datasets, making them limited in application and leading to poor generalization on novel image classes" (Abstract). Natural-image saliency models perform poorly on graphic designs [6, 16], and specialized saliency models for visualizations [26], mobile UIs [9] [CORRECTED: the PDF prints [9] here — the manga/visual-flow paper — while the mobile-UI saliency paper is ref [15], as cited in the Introduction; apparent in-text citation slip in the original | PDF p.2], and webpages [29, 31] generalize poorly outside their design class (§2).
2. **Users must pick the model themselves**: the Abstract notes the requirement that "a user [know] which model to apply to which input." Since content, layout, and appearance differ greatly across domains (advertising, art, education, …), a designer must hunt for a model trained on their own design class (§1).
3. **Skewed prior importance datasets**: the only available importance-annotated graphic-design dataset (GDI [28]) covered posters and advertisements only. Webpages and mobile UIs are structured quite differently, so a model trained on posters alone does not generalize (§3 opening).
4. **Structural limits of prior importance models**:
   - O'Donovan et al. [28]: the first importance approach — crowdsourced the GDI dataset, then trained an importance predictor. But generalizing to a new design requires annotation of design element position and alignment (the "Full," non-automatic model that needs human element-location annotations at test time) (§2, §5.1).
   - Bylinskii et al. [6]: the first end-to-end deep-learning importance predictor — a Fully Convolutional Network [25] with semantic-segmentation pre-trained weights, fine-tuned on GDI. Its noted limitation is excessive text bias (§5.2).
5. **Application-side limits**: prior uses were passive feedback shown to designers [6], image-based retargeting [6], or retargeting requiring manual annotations [28] (§2). Thumbnailing [20, 31] was another use, but no interface actively intervened in the design process.

---

## 3. Key Contributions (numbered list; per Abstract and end of §1)

1. **UMSI (Unified Model of Saliency and Importance)**: a unified deep-learning model predicting importance for diverse design types and saliency for natural images, with a built-in automatic input-type classification module.
2. **Imp1k dataset**: importance annotations for 1,000 designs across 5 classes (webpages, movie posters, mobile UIs, infographics, advertisements).
3. **Design-revision tool for target importance**: an interactive application that auto-updates the layout once a designer sets per-element target importance (§6.1).
4. **Importance-driven reflow application**: converts a design to a new size/aspect ratio while preserving the relative importance of its elements (§6.2).
5. (Side contribution) Public release of model, code, and dataset (http://predimportance.mit.edu), plus a design-process attention-shift demo (§5.2, Fig. 5).

---

## 4. Methodology Details

### 4.1 The Imp1k Dataset (§3)

#### 4.1.1 Collection (§3.1)

- **Design intent**: cover five diverse design classes and purposes — knowledge-transfer designs (infographics), utility designs (webpages, mobile UIs), promotional designs (advertisements, movie posters).
- **Why data visualization was excluded** (explicit): prior work [6] covers importance for data visualizations, but this paper omits them because their highly structured layouts (axes, data marks, etc.) make them less amenable to the design applications that are this work's focus (§3 opening). → Slide-domain implication: slides full of structural elements (axes, charts) likewise fall outside this model's validated scope (see §7).
- **Sources** (sampled from existing research datasets so stimuli and annotations can be shared broadly):
  - Infographics: Visually29k [33]
  - Webpages: ClueWeb09 [7]
  - Movie posters: Chu et al.'s movie poster dataset [11]
  - Mobile UIs: RICO [14]
  - Advertisements: Pitt Image Ads [18]
- **Sampling**: 200 randomly sampled designs per class, 1,000 total. Filtering removed designs with too few elements, skewed aspect ratios, or class outliers.
- **PPT/slides included?** No. The five classes are only infographics, webpages, movie posters, mobile UIs, and advertisements; a full-text check finds no mention of slides or presentations anywhere (the sole "Presentation" hit is the ACM classification) [NOT IN SOURCE — restated as an explicit limitation in §6].

#### 4.1.2 The ImportAnnots annotation interface (§3.1)

- Uses the ImportAnnots UI [27] (part of the TurkEyes web crowdsourcing attention-data toolbox), based on O'Donovan et al.'s [28] original implementation.
- **Three annotation tools**:
  1. regular stroke: paintbrush-like painting with the mouse button held down
  2. polygon stroke: draw polygons by connecting vertices
  3. fill stroke: fill the area delimited by the initial click position and the latest mouse position, smoothly tracing continuous contours
- With any tool, a participant produces one **binary mask** annotating the most important design elements.

#### 4.1.3 Crowdsourcing scale and quality control (§3.1)

- **Platform**: Amazon Mechanical Turk (MTurk).
- **Task setup**: 10 same-class designs bundled per HIT; 30 participants requested per HIT; participants could complete multiple HITs.
- **Participants**: data from 249 individuals.
- **Quality control (sentinels)**: 3 sentinels per HIT — simple artificial designs whose importance annotation is expected to cover the only visible element in the design. 40 such sentinels were purpose-built with manually annotated ground-truth importance. The task proceeded only when participant annotations matched ground truth (intersection over union above 0.6) on at least 2 of the 3 sentinels.
- **Pay**: $1.00 per completed task.
- **Final maps**: each of the 1,000 designs gets an importance map by averaging 25–30 individual binary annotations. (Individual annotations are subjective, but prior work reports the participant average approximates attention maps [6, 21, 28].)

#### 4.1.4 Dataset analysis (§3.2, Figs. 2–3)

- **Qualitative per-class importance patterns**:
  - Movie posters: title and human faces dominate.
  - Webpages: attention goes to the site/company name (usually top-left).
  - Infographics: importance spread across the whole design.
  - Mobile UIs: spread across the whole design.
  - Advertisements: importance concentrated on a few central elements.
- **Annotation granularity**: across classes, people highlight up to ~7 different elements; finer-grained annotations were rare. → Citable empirical evidence for an upper bound (~7) on human-distinguished important elements when designing element-level importance comparison metrics.
- **Face/text quantification**: open-source face [24] and text [32] detectors were used to compute mean importance-map values over per-design face/text bounding boxes.
  - Relative face importance is highest on ads and movie posters, nearly tied between the two.
  - Text importance is highest in ads — perceived as on average 32% more important than text in infographics (the class with the second-highest average text importance).
- **Takeaway**: importance patterns differ greatly across classes, motivating a model that generalizes across diverse designs yet tailors predictions per class — the rationale for UMSI's classification module.

### 4.2 UMSI Architecture (§4.1, Fig. 4)

- **Overall**: input image → heatmap with a per-pixel importance value. An encoder-decoder structure is adopted, as in related image-to-image tasks (saliency, segmentation). Like the prior best importance model [6] (built on a semantic-segmentation architecture [25]), this work uses a segmentation-inspired pyramid pooling module over multi-scale features, plus a classification branch injecting class-specific information.
- **6 classification categories** (colored letters in Fig. 4): Ads (A), Infographics (I), Mobile-UIs (M), Movie posters (P), Webpages (W), Natural Images (N).

#### 4.2.1 Encoder

- **Xception encoder**: a high-performing state-of-the-art network used for segmentation [10] and saliency [8], built from depthwise separable convolutions with large compute savings at minimal accuracy cost.
- **Modifications**: final global average pooling and fully-connected layers removed → outputs feature maps. To obtain higher-resolution maps, the strides of both the 1×1 residual connection and the last two max pooling layers were reduced to one.

#### 4.2.2 Atrous Separable Pyramid Pooling (ASPP)

- An ASPP module [10] after the encoding module aggregates multi-scale image information.
- Dilated convolutions with different dilation rates run in parallel over a feature-map set → outputs concatenated → a projecting convolutional layer reduces channel dimensionality.
- **Exact figures**: 4 parallel convolutional layers with 256 filters, dilation rates 1, 6, 12, 18.

#### 4.2.3 Decoder

- A set of convolutions + upsampling layers + dropout, scaling feature maps back to the original image size without a large parameter increase.
- **Exact structure**: 3 blocks — the first two are 2 convolutional layers + one 2×2 upsampling layer each; the last is 1 convolutional + 1 upsampling layer. A 1×1 convolutional layer then converts feature maps into the final importance map.
- **Figures**: convolution kernel size 3, dropout 0.3, ReLU activations throughout.

#### 4.2.4 Classification module

- The encoder output is also passed in parallel to a classification submodule: two 3×3 convolutional layers → one stride-3 convolutional layer for dimensionality reduction → one more 3×3 convolutional layer → global pooling → a dense layer with dropout → a 1×1×256 feature vector Cf.
- **Dual use of Cf**:
  1. Direct input-class prediction: Cf feeds a dense layer with 6 outputs + softmax activation → a 1×6 class-probability vector.
  2. Class-specific injection for importance prediction: Cf is resized as needed → concatenated with the ASPP output along the channel dimension in the Concatenation layer → tailored per-class heatmaps.
- This concatenation is described as central to the model.

### 4.3 Training (§4.2)

#### 4.3.1 Training data setup

- **Stated difficulty**: natural images and graphic designs differ greatly in layout/attributes, and their ground-truth attention data differ in collection means, format, and quantity.
  - Largest natural-image saliency training set: SALICON [19] — mouse movements aggregated into saliency maps, 20K images.
  - Only prior graphic-design importance dataset: GDI [28] — 1,000 designs with aggregated binary-annotation importance maps, composed mainly of Flickr ads and posters.
  - Imp1k: also 1,000 designs, but split across 5 classes (the contrast with GDI).
- **Training procedure**:
  1. Pre-train on SALICON for 10–15 epochs → learn broadly saliency-relevant image features.
  2. Fine-tune on a graphic-design importance dataset — GDI or Imp1k, depending on the evaluation setting.
  3. To keep the network from "forgetting" saliency while learning design importance, mix 160 new SALICON images into every fine-tuning epoch. This number maintains class balance when training on Imp1k (training set = 80% of 200 designs per class = 160, balancing the 160 SALICON images).
- **Data splits (training details)**:
  - SALICON: the 10K training / 5K validation / 5K test splits from [19].
  - GDI: same train/test split as in [6].
  - Imp1k: test set = 20% randomly selected from each class (40 per class, 200 total — [COMPILER NOTE: arithmetic by the survey author]).

#### 4.3.2 Training settings (figures)

- **Losses**: KL loss (coefficient 10) + CC loss (coefficient −3); binary cross-entropy loss (weight 5) for the classification submodule.
- **Learning rate**: 1e−4, decreased by a factor of 10 every 3 epochs.
- **Regularization**: dropout of 0.3 on all layers against overfitting.
- **Batch/optimizer**: batch size 8, Adam optimizer.
- ([NOT IN SOURCE: total epoch count for the fine-tuning stage, input image resolution, hardware/GPU specs, training time, Adam betas and other fine hyperparameters.])

---

## 5. Experimental Results

### 5.1 Importance prediction (§5.1, Tables 1–2, Figs. 6–7)

#### Setup

- **Datasets**: evaluated on two importance datasets, GDI and Imp1k.
- **Metrics**: four — R² (↑), RMSE (↓), CC / Pearson correlation (↑), KL (↓). CC is the recommended metric for saliency evaluation [5].
- **Baselines**:
  - GDI: the prior best importance model [6]; the O'Donovan [28] "Full" (needs human annotations at test time; non-automatic) and fully-automatic (lower-performing) versions; a combined model of the two prior models [CORRECTED: the PDF body text prints "[5] and [28] … previously reported in [5]" (PDF p.5) — the same oddity appears in the HTML rendering ("[6] and [29] … in [6]"), so it is the paper's own in-text citation slip, not an HTML-conversion artifact; Table 1's row label "B. et al. + O. [6]" confirms the intended [6]+[28] combination]; the state-of-the-art saliency model SAM [13], pre-trained on SALICON then fine-tuned on GDI.
  - Imp1k: [6] trained on the full dataset (B. et al.), five per-class [6] models (B. et al. x5), SAM [13] fine-tuned on Imp1k, and two UMSI variants (see ablation below).

#### Results ([CORRECTED: Table 1–2 row labels recovered from the PDF — the survey's HTML source had lost them; all row-label guesses below are thereby confirmed | PDF p.5])

- **GDI (Table 1)**: UMSI beats the prior best importance model [6] on all four metrics — "notably achieves an improvement of 54% over the prior model according to [CC]". It also beats the non-automatic O'Donovan "Full" model, the fully-automatic O'Donovan model, and the combined model.

| Model (Table 1, GDI) | R² ↑ | RMSE ↓ | CC ↑ | KL ↓ |
|---|---|---|---|---|
| O. et al., Auto [28] | 0.539 | 0.212 | – | – |
| O. et al., Full [28] | 0.754 | 0.155 | – | – |
| B. et al. [6] | 0.576 | 0.203 | 0.596 | 0.409 |
| B. et al. + O. [6] | 0.769 | 0.150 | – | – |
| SAM [13] | 0.693 | 0.146 | 0.884 | 0.102 |
| UMSI | 0.781 | 0.120 | 0.915 | 0.086 |

- **Imp1k (Table 2)**: UMSI beats every alternative — full-dataset [6], per-class five [6] (B. et al. x5), fine-tuned SAM, UMSI-nc, UMSI-2stream — which the paper claims proves the contribution of the architecture design beyond training data.

| Model (Table 2, Imp1k) | R² ↑ | RMSE ↓ | CC ↑ | KL ↓ | Acc ↑ |
|---|---|---|---|---|---|
| B. et al. [6] | 0.072 | 0.181 | 0.758 | 0.301 | – |
| B. et al. x5 [6] | 0.061 | 0.205 | 0.732 | 0.388 | – |
| SAM [13] | 0.108 | 0.168 | 0.866 | 0.166 | – |
| UMSI-nc | 0.095 | 0.152 | 0.802 | 0.177 | – |
| UMSI-2stream | 0.105 | 0.141 | 0.852 | 0.168 | 0.91 |
| UMSI | 0.115 | 0.134 | 0.875 | 0.164 | 0.98 |

- **Qualitative results (Fig. 7)**: joint training on natural images + graphic designs distributes importance correctly in images with diverse text/visual mixes. In contrast, the saliency model (SAM) over-predicts visual regions (faces, images), while the importance model trained only on posters/ads ([6]) fails to generalize to complex designs and over-predicts all text elements at similar importance.
- **Hard cases (Fig. 7e–f)**: (e) an infographic requiring understanding of the presented data challenges all models; (f) a drawing belonging to no design class still yields correct predictions from the first two models — a generalization-beyond-classes case.
- **Failure modes (Fig. 6)**: (a) misses a subtle text overlay, classifies the input as a natural image, and over-emphasizes faces; (b) misclassifies a detail-crowded ad as an infographic (though top importance stays correct); (c) on a complex, busy design the classification is right but a secondary text overlay is picked as most important.

### 5.2 Saliency prediction (§5.2, Figs. 1, 5)

- **SALICON test set**: UMSI reaches CC 0.782, KL 0.341, vs. SAM [13] at CC 0.811, KL 0.324 — i.e. comparable to state-of-the-art but slightly below.
- **Qualitative**: output heatmap patterns closely resemble SAM's — people/faces detected, high-contrast elements identified (Figs. 1, 5a).
- **Design-process proof-of-concept (Fig. 5)**: designs were generated over a SALICON background image with importance annotations collected per design stage. On the plain natural image the model predicts an accurate saliency map → adding a title element flips the prediction to "advertisement" with the title most important → further elements spread importance across image and elements while background-image importance shrinks. Text bias is diminished relative to [6]'s excessive-text-bias limitation: the model correctly recognizes secondary design elements' importance over text.

### 5.3 Classification accuracy and ablation (§5.3, Fig. 3, Table 2)

- **Classification-module accuracy**: 95% average accuracy at assigning Imp1k designs to their 5 classes (per-class scores reported in Fig. 3 — figure only, values not in the body text [NOT IN SOURCE: numeric per-class values]). Fig. 3 confirms the model learned class-differentiating general importance trends.
- **Ablation**: two extra UMSI versions isolate the classification module's contribution.
  - UMSI-nc: classification module removed entirely.
  - UMSI-2stream: the classification module does not feed directly back into importance prediction (unlike Fig. 4) but branches off after the ASPP module — while still shaping the features the encoder/ASPP learn.
  - Result: both alternatives perform worse; removing the classification stream entirely (UMSI-nc) hurts scores most.

### 5.4 The two application demos (§6)

#### App 1: Model-assisted interactive design — relative-importance adjustment tool (§6.1, Figs. 8–9)

- **Concept**: beyond prior work's [6] passive real-time importance visualization, a use case where the user actively engages with the importance model and receives design suggestions. A bare-bones prototype with minimal support, built to test the model's ability — coupled with an optimization procedure — to actively adjust a design to user-imposed constraints.
- **Workflow**: user manipulates design elements on a canvas → real-time predicted-importance feedback per element (heatmap) → (new) direct interaction with each element's importance score to set increase/decrease constraints → an optimization procedure generates new design variants and scores them with the importance model.
- **Optimization**: a genetic algorithm adjusting the visual arrangement (scale, position) of design elements, selecting adjustments that shrink the gap between current predictions and user-set targets. (The optimizer itself is not this paper's contribution; implementation details are deferred to the Supplemental Material — [NOT IN SOURCE].)
- **UI layout (Fig. 8)**: A) canvas onto which to drag a vector graphics file, B) a set of layers for composing design elements, C) live preview of the interactively computed importance map, D) an interactive bar plot listing every element's predicted importance (element importance = average of importance values inside that element's mask), E) a progress bar for the optimization launched by bar adjustments.
- **Plumbing**: a real-time (TCP-network-based) interface between the front-end UI and the back-end importance model → remote computation on GPU-enabled infrastructure. Continuous back-end model execution keeps predictions updating live as the user edits.
- **Sample interaction sequence (Fig. 8, bottom)**: (i) clicking an element highlights its score in the bar plot, (ii) adjusting a bar launches the optimization that auto-adjusts the design, (iii) repeat until all elements reach their targets, (iv) selecting the importance heatmap overlays it on the final design.
- **User study (quantitative)**:
  - 6 initial designs × 3 elements per design (each chosen for an importance increase) × 5 consecutive runs = 90 design variants total.
  - Ground-truth importance maps collected via the ImportAnnots UI for every variant plus the 6 initial designs (25 annotators per design).
  - Mean CC between model predictions and ground truth = 0.928 (upper bound 1.0) — high agreement.
  - Averaged over 6 designs × 3 constraints, the target element's importance increased successfully in 87% of runs.
- **Example results (Fig. 9)**: (top) emphasizing the discount in a simple ad → spatial rearrangement enlarging and centralizing the selected element; (bottom) emphasizing the event venue while de-emphasizing the event title → time/date text split off from the venue, freeing room to enlarge the relevant information. Changing one element's target importance commonly affects neighbors too (preserving neighbors' importance as closely as possible while freeing room for the target element to gain importance).
- **Discussion/limits stated**: the design tool itself is bare-bones and optimizes no aesthetic properties (balance, symmetry, …), so returned results are not guaranteed to be good designs. Still, the 87% user-objective success rate shows early promise for importance models in future design tools. How best to weave AI/automatic assistance/collaboration into interfaces is stated as a substantial open problem for the field.

#### App 2: Model-assisted design reflow (§6.2, Figs. 10–11)

- **Concept**: when remaking an input design at another size (alternative form factors/devices), per-element importance scores computed from the importance heatmap guide element repositioning/rescaling. Core proposition: "by preserving the relative importance values of all the design elements in the reflow result, we maintain the designer's intention in allocating attention across design elements."
- **Integration**: built with the developers of a commercially-available layout application. The user creates/uploads an initial design → basic operations (placing, scaling, grouping) → when satisfied, the design is sent as an image to the back-end importance model → the predicted heatmap ranks the graphic elements by computing the average importance value over each element's extent.
- **Reflow algorithm**:
  - Input: initial design + target design size (Fig. 10a).
  - Per class/size/element-count, templates marking each element's importance rank were composed manually (Fig. 10c), based on professional designs of similar size and element count, and stored in the reflow application.
  - At test time: retrieve the template matching the input's element count with an aspect ratio similar to the target size → map each initial-design element to the template placeholder with the matching importance rank → the original element importance ranking is preserved.
- **User study 1 — crowdworkers**:
  - 17 graphic designs × 3 automatic variants at an alternative aspect ratio: (i) no-importance baseline (the host app's default constraint-based engine), (ii) reflow with the prior best importance model [6], (iii) reflow with UMSI.
  - Task: rank the variants 1 (best) to 3 (worst) by personal judgment, no further guidance. Variant order randomized across designs and participants.
  - 100 MTurk recruits, each shown 9 random + 3 repeat designs, paid $1.50. Only participants ranking consistently on 2/3 of the repeats were kept → 43 participants' data used (29 male, mostly in their 20s and 30s). ~23 rankings per design on average.
  - Result: UMSI-aided reflow ranked significantly better (p < 0.05, Bonferroni-corrected) than the other two (Fig. 11a). The [6]-aided reflow vs. baseline gap was not significant.
- **User study 2 — professional designers**:
  - 6 recruits from personal networks (3 male, aged 25–45, 3–20 years of experience), each ranking all 3 variants for all 17 designs, paid $5.00.
  - Result: average ranks confirm UMSI-aided reflow above the other two (Fig. 11b).
- **Discussion**:
  - Evaluated inside one particular design tool, but the reflow-quality gains are encouraging. Future reflow could add importance as a further constraint (preserving element importance ranks between original and redesign), combined with balance, symmetry, and other common aesthetic metrics.
  - Quoted remark from a professional-designer participant naive to the study's purpose and result sources: what makes a good reflow result is "the hierarchy of elements, making sure we read the most important thing first."
  - The approach modifies only element size and position. Future work could weigh colors, fonts, and other features affecting visual importance during reflow.
  - Notable: reflow gains were achieved with UMSI but not with the prior best model [6]. UMSI generalizes better to more diverse, complex designs and is less text-biased (Fig. 10b, d) — better-suited traits for reflow. In the Fig. 10e case all methods scored comparably; the key difference was each successive model zooming further into the man's face. Trained on natural images as well as designs, UMSI learned faces are highly salient to humans and prioritizes them. The baseline result most resembles a crop of the input.

---

## 6. Limitations and Follow-ups

### 6.1 Limitations/follow-ups stated in the paper

1. **No aesthetic-quality guarantee for the interactive tool** (§6.1 Discussion): it optimizes no aesthetic properties (balance, symmetry, …), so outputs are not guaranteed to be good designs.
2. **Narrow manipulation range of reflow** (§6.2 Discussion): only element size and position are modified; colors, fonts, and other features are future work.
3. **AI-assistance integration unsolved** (§6.1 Discussion): how best to incorporate AI/automatic assistance/collaboration into interfaces is a substantial open problem.
4. **Failure modes exist** (§5.1, Fig. 6): missed subtle text overlay + natural-image misclassification, detail-crowded ad misclassified as infographic, secondary element picked as most important on a complex design.
5. **Hard input types** (§5.1, Fig. 7e): infographics requiring understanding of the presented data challenge all models.
6. **Data visualization excluded** (§3): deliberately omitted for its structured layouts — an explicit scope restriction.
7. **Saliency slightly below SOTA** (§5.2): CC 0.782 vs. SAM's 0.811, KL 0.341 vs. 0.324. "Comparable" but strictly lower.
8. **Manual/outsourced optimization and templates**: App 1's genetic-algorithm details live in the Supplemental Material (not in the main text), and App 2's templates are hand-composed on top of a commercial app's existing engine.

### 6.2 Methodological limits noted by the survey author (not stated in the paper — marked)

1. **[COMPILER NOTE] PPT/slide domain unvalidated**: neither Imp1k's 5 classes, GDI (ads/posters), nor SALICON (natural images) include presentation slides, and the paper never mentions slides. Slides have distinct traits — (a) fixed 16:9/4:3 aspect ratios, (b) repeating title-body-figure hierarchy, (c) consumption alongside a speaker's voice, (d) information over decoration — so Imp1k-trained transfer is not guaranteed. Any Typodeck citation must state this limit.
2. **[COMPILER NOTE] viewer-identified vs. designer-intended gap**: the paper models only what viewers *feel* is important, not designer intent (stated in §2). For Typodeck's goal ("aligning intended semantic importance with perceived visual importance"), this model can serve only as the latter (perception-side) proxy; the former (intent) must come separately from Slide IR structure (titles, emphasis, ordering, …).
3. **[COMPILER NOTE] ~7-element ceiling**: annotations distinguish at most ~7 important elements. On dense, element-crowded slides, mask-average element scores may lose discriminative power [SPECULATION].
4. **[COMPILER NOTE] Crudeness of average-based element scores**: both apps score elements by "mean map value over the element extent," ignoring within-element distribution, inter-element contrast, and reading order. Only ranks are used, not rank gaps (how much more important).
5. **[COMPILER NOTE] Closed-world assumption of the classifier**: 6 fixed classes + softmax. An unknown class like slides is force-classified into the nearest existing class (infographics? [SPECULATION]), where the class-specific concatenation could inject the wrong prior. Fig. 6's misclassifications support this risk.
6. **[COMPILER NOTE] Limits of the evaluation metrics**: R²/RMSE/CC/KL are all pixel-distribution similarity metrics; none directly measures hierarchy correctness (is the intended #1 element predicted #1?). Typodeck's Hierarchy Agreement needs a separately designed metric.
7. **[COMPILER NOTE] App-study sample sizes**: App 1 uses 6 seed designs; App 2 uses 17 designs and 6 experts — proof-of-concept scale, insufficient for statistical generalization.
8. **[COMPILER NOTE] Reproduction gaps**: input resolution, fine-tune epoch count, preprocessing/augmentation, GPU/training time are absent from the main text [NOT IN SOURCE]; reproduction needs the Supplemental Material.

---

## 7. Relevance to Typodeck

Typodeck context assumed: a Slide Markdown → Slide IR (versioned intermediate representation) → Composition Engine → natively editable PPTX pipeline, a Visual Critic (image+structure hybrid evaluation), a Grammar Registry, a Validation-Repair gate, 38 Composition Candidates, a reference-slide reproduction benchmark, and the goal direction Valid PPTX → Good Layout → Intended Visual Hierarchy.

### 7.1 Direct connections (paper-grounded)

1. **Directly reusable element-importance scoring**: both apps score elements by "the average importance value over each element's extent" (§6.1: "averaging the importance values inside the mask of each design element"; §6.2: "computing the average importance value over each element's extent"), and App 2 ranks them. Since Slide IR natively holds element masks/bounding boxes, running an importance model over a slide render and averaging under IR element masks directly yields a "predicted perceived importance" vector — a natural fit for the Visual Critic's image+structure hybrid evaluation.
2. **"Preserve relative importance" = the Hierarchy Agreement archetype**: App 2's core proposition ("by preserving the relative importance values of all the design elements in the reflow result, we maintain the designer's intention") shares Typodeck's Intended Visual Hierarchy philosophy. Since the paper implements only rank preservation, Typodeck's Hierarchy Agreement (Spearman/Kendall rank correlation) is a legitimate quantification/extension to position against this paper.
3. **Grounding for Primary Emphasis Accuracy**: the paper's Fig. 7/9 and App 1 evaluation ("87% success at raising the target element's importance") already implicitly evaluate a top-1-hit concept. Typodeck's Primary Emphasis Accuracy (intended #1 element predicted #1) metricizes it, and the "87%" figure is citable as prior-art baseline performance (different domain/conditions, so motivation-only citation — no direct comparison).
4. **Precedent for the Validation-Repair gate**: App 1's loop (set target importance → optimize layout → verify with the model) is structurally identical to Typodeck's Validation-Repair gate (constrain → regenerate/repair → re-verify). That a weak optimizer (genetic algorithm + scale/position moves) still hit 87% argues the stronger generator (Composition Engine, 38 candidates) should clear the gate reliably (contains [SPECULATION] — see caveats below).
5. **Justifying the viewer-model vs. intent-model split**: since the paper models viewer-identified importance only (§2), Typodeck can cite it to justify the two-sided design "UMSI-class models = perceived side, Slide IR structure (titles/emphasis/reading order) = intended side," with their comparison (Hierarchy Agreement) as the contribution.
6. **Expert testimony defining good reflow as hierarchy**: the §6.2 designer quote ("the hierarchy of elements, making sure we read the most important thing first") is directly citable to justify Intended Visual Hierarchy as the goal direction.
7. **Why text-bias mitigation matters**: [6]'s excessive text bias is flagged as a limitation in §5.2 and claimed mitigated by UMSI. On text-dense slides, text bias is fatal (the trivial "title always hottest" solution), so text-bias checks are mandatory when selecting/fine-tuning a model.

### 7.2 Usage ideas ([SPECULATION] marked)

1. **([SPECULATION] idea) Add a "predicted vs. intended hierarchy" module to the Visual Critic**: rendered PNG → importance model (UMSI or successor) → IR-element-mask averaging → predicted ranking. Intended ranking from structural cues in Slide Markdown/IR (heading levels, emphasis marks, placement order, Grammar Registry role tags). Spearman/Kendall correlation as Hierarchy Agreement; top-1 hit as Primary Emphasis Accuracy.
2. **([SPECULATION] idea) Ranking signal for the 38 Composition Candidates**: compute Hierarchy Agreement for each candidate rendering of the same IR and use it to select/order candidates — the same "score variants with the model" pattern as §6.1.
3. **([SPECULATION] idea) Add a hierarchy dimension to the reproduction benchmark**: beyond pixel similarity, measure "predicted hierarchy of reference slide vs. predicted hierarchy of reproduction." Applying the same model to both sides makes it a relative comparison that cancels model bias [SPECULATION].
4. **([SPECULATION] idea) Slide-specific classification class**: since UMSI's training procedure "can be adapted, given a new training set, to any number of additional design classes" (Conclusion), a small slide-annotation build could motivate a 7th-class extension study. Caveat: whether the released code extends easily is unconfirmed [NOT IN SOURCE].
5. **([SPECULATION] idea) Repair-operator design hints**: App 1's result patterns (emphasis = enlarge + centralize; make room by rearranging de-emphasized elements; preserve neighbor importance) can inform the Composition Engine's repair-operator (scale/position) priorities.

### 7.3 Caveats for slide-domain transfer

1. **Assume an unvalidated domain**: same as §6.2 item 1. Any citation/use must state "validated on ads, posters, infographics, web, and mobile UIs; slides unvalidated."
2. **Misclassification may inject class bias**: when a slide is force-classified into one of the 6 classes (text-heavy → webpage? image-heavy → ad? [SPECULATION]), the class-specific path may inject a wrong prior. Check the classifier's output distribution first in transfer experiments; consider comparing against the classifier-free UMSI-nc variant.
3. **Fixed 16:9 aspect ratio vs. filtering**: Imp1k collection filtered out skewed aspect ratios (§3.1), so 16:9 widescreen slides may lie off-distribution [SPECULATION]. Verify how input resize/padding affects predictions.
4. **Text-crowded slides**: the text-bias issue (§7.1 item 7). Separately verify whether predictions trivially heat titles and whether body-text discrimination works.
5. **Missing presentation context**: the paper's importance assumes static image viewing, while real slides are consumed with a speaker's narration — "in-presentation perceived importance" may diverge [SPECULATION]. Typodeck metrics are safer scoped as "static-render perceived hierarchy."
6. **Element-granularity mismatch**: the paper's elements are graphic-element units (mask-averaged); Typodeck IR elements are text boxes, shapes, charts, …. Within-element importance distribution of composite elements (charts, tables) collapses into one average (§6.2 item 4). Consider sub-decomposition or special handling for composites.
7. **License/practicality**: model and code are public (§0) but license terms are unstated [NOT IN SOURCE] — verify before production-pipeline use. Also, this is a 2020 Xception-era model; do not adopt without comparing against recent transformer-based saliency/importance models (general recommendation, not [SPECULATION]).

---

## 8. Citation Points (3 claims for the Typodeck paper)

1. **"Viewer-perceived importance can be approximated by averaging crowdsourced annotations, serving as a proxy for attention maps."**
   - Source: §3.1 "While each participant's importance annotation is subjective, prior work has reported that the average over participants produces heatmaps that approximate attention maps [6, 21, 28]." Collection conditions: 25–30 annotators per design, sentinel IoU > 0.6 (2/3 or better), $1.00/HIT (10 designs).
   - Use: grounds defining the Visual Critic's predicted importance as a legitimate "perceived hierarchy" proxy.
2. **"Design-element importance can be quantified by averaging the predicted heatmap over each element's extent and ranked, and preserving relative importance (ranks) is the key to maintaining designer intent."**
   - Source: §6.2 "The predicted importance heatmap is then used to rank the graphic elements by importance, by computing the average importance value over each element's extent. Our proposition is that by preserving the relative importance values of all the design elements in the reflow result, we maintain the designer's intention in allocating attention across design elements." + expert quote "the hierarchy of elements, making sure we read the most important thing first."
   - Use: direct prior-art grounding for the Hierarchy Agreement (intended-vs-predicted rank Spearman/Kendall) metric design.
3. **"A unified importance model beats single-class specialists, and automatic layout adjustment to target importance succeeded 87% of the time."**
   - Source: §5.1 — 54% CC gain over the prior model on GDI, best on all four metrics; bests full/per-class specialists and SAM variants on Imp1k (Table 2). §6.1 app study: mean CC 0.928 over 90 variants, 87% target-element importance-increase success.
   - Use: (a) grounds the design choice of one unified Critic covering many slide genres; (b) feasibility precedent for the Validation-Repair gate — but with the nuance that domains (mostly 6 ad-style designs) and sample sizes differ, so cite as feasibility only, never as a direct performance comparison.

---

*Digest end. Figures and quotes verified against the PDF (arXiv:2008.02912v1, 12 pp.). Items limited by the survey's HTML conversion (notably Table 1–2 row labels) were repaired from the PDF and marked [CORRECTED]; figure-only values with no body-text statement are marked [NOT IN SOURCE].*
