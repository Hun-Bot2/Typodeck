# HCI Reinterpretation (for the Typodeck Paper)

> Translated from the Korean draft `research/paper-survey-tmp/09-HCI-reinterpretation-draft.md`.
> Faithful translation only: no new claims, no new numbers. Numerical evidence is traceable to files 01–07.

> Thesis: Typodeck builds on the three-layer terrain of slide research (Slide Understanding → Visual Importance → Layout Generation),
> taking **the alignment of intended semantic importance with perceived visual importance ("Visual Hierarchy Alignment")** as its core design principle.
> Below are per-paper reinterpretation paragraphs + HCI considerations + an experiment proposal. Numerical evidence is traceable to files 01–07.

## 1. Terrain Definition (Proposed Related-Work Chapter Structure)

The slide problem divides into three layers. First, **Slide Understanding** (what is on the slide, and what each element means and how elements relate).
Second, **Visual Importance** (what people look at first and perceive as important).
Third, **Layout Generation** (where to place things, how large, and in what relations, so that the intended hierarchy is conveyed).
Typodeck's core problem is the second and third layers; the first layer is the foundation supporting them.

- Layer-1 foundation: LecSlides-370K/SlideParser (05) — text-relation modeling determines understanding performance (R-1 +5.9). PPTBench 2025 (01) — empirically demonstrates the gap between semantic understanding and visual-layout reasoning.
- Layer-2 core: UMSI (02) — predictability of perceived importance + the relative-importance preservation principle.
- Layer-3 core: SlideCoder (03), PPTAgent (04), PPTBench 2026 (07) — reference-based, hierarchical, and gated generation/evaluation.
- Cross-cutting (retrieval): ColPali (06) — reference retrieval only. Strictly separated from quality evaluation.

## 2. Per-Paper Reinterpretation (as Grounds for Typodeck Design Decisions)

**PPTBench 2025 (01) → "A model that understands is not a model that arranges."**
In the 4,439-sample, 4-category evaluation, MLLMs could interpret content yet failed to produce consistent spatial arrangements (misalignment, overlap),
failing to combine visual cues with JSON layout structure. Typodeck takes this gap head-on and adopts
(1) two-channel evaluation separating structure (IR numeric checks) from perception (rendered-image judgment; grounded in the §4.4 modality-split results),
(2) a versioned structure dictionary (Grammar Registry; systematizing the +6–18 point API-template effect),
(3) a human-agreement validation protocol at ρ 0.85+ (Table 4 method).

**UMSI (02) → "Perceived hierarchy is predictable, and agreement with intent is quality."**
UMSI, trained on Imp1k's 1,000 designs across 6 design types, computes per-element perceived importance as the mean importance over the element mask,
and demonstrated relative-importance-preserving reflow with 87% importance-adjustment success. Typodeck extends this by defining as core metrics
the rank agreement between the intended hierarchy (structural cues in the Slide IR) and the predicted hierarchy (perceptual model + IR mask averaging) — Hierarchy Agreement (Spearman/Kendall) —
and top-1 hit rate (Primary Emphasis Accuracy).
The expert designers' testimony ("make the most important thing read first," §6.2) is the HCI justification for this goal.
One caveat is stated explicitly: since UMSI is unverified on slides, slide-transfer validation is a precondition.

**SlideCoder (03) → "Reproduction is segment-generate-assemble, and segmentation contributes most."**
On the RI-to-Slide task, hierarchical segmentation (CGSeg) + retrieval augmentation (H-RAG) achieved Overall +40.5 points and execution rate +38 pp,
and the SCM difficulty metric agreed with human judgment at r = 0.873. This is the prior design for Typodeck's reproduction pipeline, benchmark difficulty tiers, and metric system,
and the OF-KB's version-mismatch prevention effect is the empirical justification for versioning the Slide IR and Grammar Registry.

**PPTAgent (04) → "Select a reference and edit it — and evaluate the whole deck."**
The two-stage reference-based editing approach showed a +40.9% design improvement, and PPTEval evaluated Content, Design, and Coherence separately.
Typodeck inherits reference-based generation (447 corpus), functional types (corresponding to Purpose presets), schema (what) + Grammar (how) complementarity, and deck-level Rhythm evaluation,
adding a fourth dimension (Intended Visual Hierarchy) to position itself as a "PPTEval superset."
Human agreement at Pearson 0.71 / κ 0.59 is the explicit target line for the Visual Critic ("exceed 0.71").
Conversely, self-correction that repairs only execution errors, and using the same model for generation and evaluation, serve as counterexamples — mandating render repair and judge separation.

**LecSlides/SlideParser (05) → "Arrangement without relations is not decoration but noise."**
At the 370,078-slide scale, the work showed the quantified value of text-relation modeling (+5.9 R-1) and the dominant contribution of spatial arrangement (removing space: −3.9 vs. removing semantics: −0.8).
Typodeck symmetrizes this from the generation perspective via an IR relation layer, relation-consistency gate checks, and versioned relation-style rules.
It acknowledges the limitation of undirected binary relations, leaving typed hierarchy/order/reference direction (candidate B) as follow-up work.

**ColPali (06) → "Retrieval is retrieval, not judgment."**
On ViDoRe, direct page-image embedding + late interaction overwhelmed text pipelines,
but its score is query-patch proximity, not design quality (contrast, alignment, hierarchy are absent from the objective).
Typodeck restricts ColPali-class models to searching the 447 references only (estimated ~115 MB, ~38 MB with pooling),
declaring role separation: quality judgment belongs to the Visual Critic + Validation-Repair. Drawing the similarity≠quality boundary is itself part of the contribution.

**PPTBench 2026 (07) → "A valid file and a good reproduction are different things, and inspection matters more than editing."**
In the 500 scientific-diagram reproductions: best 77.34 vs. median 24.38, 31.7% passing all gates.
53% of residual deductions come from text rendering fit (unexpected_wrap the largest) — caused by the gap between OOXML declarations and renderer decisions.
Inspection-count–quality correlation (r = 0.881) overwhelms edit-count–quality correlation (r = 0.255).
Typodeck takes from this benchmark gated evaluation (fundamental failures cannot hide), a text-rendering-fit gate (candidate C), an inspection-frequency-first loop,
and a judgment-reliability reporting template (86.5% human agreement, 96% repeatability).

## 3. HCI Considerations (Proposed Explicit Declarations)

1. **Reading order is not top-left → bottom-right.** Size, color, position, and grouping change gaze priority (MIT Comm Lab guide).
   Typodeck designs and validates the reading experience through intended–perceived hierarchy agreement, not forced coordinate order.
2. **Attention ≠ Reading Order ≠ Comprehension.** The element the eye reaches first is not necessarily read first or remembered better.
   Typodeck's metrics (Hierarchy Agreement etc.) are scoped to "perceived hierarchy on a static render" and are not equated with comprehension or presentation effectiveness.
3. **Dual structure: viewer model vs. intent model.** UMSI-class models cover the perceived side; the Slide IR covers the intended side.
   Comparing the two sides is itself the contribution, enabled by preserving the IR emphasis field (a precondition of candidate A).
4. **Accessible Reading Order is a separate axis.** Visual importance and screen-reader object order may differ (Microsoft guide).
   Both are validation targets, and passing one is never claimed as passing the other.
5. **Human judgment is the final standard.** Every automatic metric is reported together with human agreement (ρ, κ, blind agreement rate),
   and self-scoring by the same model is prohibited (judge–generator separation, candidate D).

## 4. Validation Experiment Proposal (A/B/C/D)

- Hypothesis: providing screenshot + structured Layout JSON + intended importance together (D) detects hierarchy errors better than text-only (A), image-only (B), or JSON-only (C).
- Design: same deck, same error types (deliberate shrinking, auxiliary enlargement, contrast inversion), 30–50 slides. Human importance rankings and error judgments as ground truth.
- Caution: D's superiority is an unverified hypothesis. Since PPTBench 2025 (01) §4.4 reported the difficulty of combining image + structure,
  the structure-information format itself (raw JSON vs. summarized prose vs. relation graph) is included as an experimental factor.
- Example success criteria: D's error-detection F1 significantly higher than B/C, with human agreement at ρ 0.85+ (01 Table 4 method) or exceeding 0.71 (04 criterion).

## 5. Prohibitions and Cautions for Writing

- Do not generalize UMSI numbers directly to slides (always note "unverified on slides").
- Do not cite ColPali similarity as quality evidence.
- When citing SlideCoder's 40.5 points, always state the comparison condition (vs. NL baselines).
- Do not write PPTBench 2026's rank-1 as a confirmed "best model" (CI includes 0 → use band wording).
- Do not conflate LecSlides ROUGE/EM with layout quality.
- Before citing any table number, cross-check against the original PDF (§4 list in 08-ADR-mapping.md).
