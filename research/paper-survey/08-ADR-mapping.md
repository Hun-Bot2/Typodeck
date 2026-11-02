# Paper ↔ ADR Mapping

> Basis: `docs/engineering/decisions/` ADR-0001–0019 (Accepted).
> Notation: [SUPPORTS] grounds an existing ADR / [EXTENDS] idea that broadens an ADR / [GAP] needed but missing from ADRs / [CAUTION] against misuse.
> Supporting numbers are traceable via the § references in each survey file (01–07).

## 1. Paper → ADR (forward)

### 01 PPTBench 2025 → IR dual representation, gates, structural priors
- [SUPPORTS] ADR-0002/0016 (Slide IR): the structured JSON+screenshot dual-input design (§3.3.1) is isomorphic to the IR+render dual representation. The modality-split result (JSON=manipulation, vision=understanding, §4.4) grounds the two-channel evaluation "IR numeric checks + rendered-image judgments."
- [SUPPORTS] ADR-0018 (Validation-Repair): the 17 atomic APIs' three principles (Atomicity·Composability·Executability, §9.2) → design principles for Composition Engine operations. The Modification "post-execution JSON exact match" (§4.2) → gate pass criterion.
- [SUPPORTS] ADR-0006/0017 (Grammar Registry): the three API templates lifting Generation by +6–18 points (§4.5.2) → empirical evidence for the structural prior. The Registry can be positioned as extending this into a versioned, compositional system.
- [SUPPORTS] ADR-0007 (HTML≠proof): the render-based 0–5 rubric + human agreement ρ 0.86–0.89 (Table 4) → borrowable as the Visual Critic reliability-validation methodology.
- [EXTENDS] The 4 layout failure types in §4.6 (dominant-element misidentification, proportion misjudgment, overlap, occlusion) → empirical grounding for the gate error-code taxonomy + the "Valid→Good→Hierarchy" staging.

### 02 UMSI → prototype for hierarchy metrics and the gate loop
- [EXTENDS] ADR-0018: Application 1's loop (target importance→optimization adjustment→model validation, §6.1) = a precedent for the gate structure. Element-mask-averaged importance (§6.1–6.2) → directly borrowable as the method for computing a per-IR-element 'predicted perceived importance' vector.
- [GAP] ADR-0016: emphasis metadata is dropped at the IR boundary. Without an 'intended hierarchy' in the IR to compare against a UMSI-style perception model, Hierarchy Agreement cannot be computed → **intended-importance fields must be preserved in the IR (new ADR candidate A)**.
- [SUPPORTS] ADR-0012 (Typography-first): "preserving relative importance = preserving designer intent" (§6.2) → consistent with Typodeck's position of realizing hierarchy through typographic means (size·contrast·position). The designer quote ("make them read the most important thing first") → usable as a goal-justifying citation.
- [CAUTION] Not validated on slides (ads·posters·infographics·web·mobile UI only). Possible out-of-16:9 distribution, text bias (§5.2), static-viewing basis (no presentation context). State the domain limitation when citing.

### 03 SlideCoder → empirical grounding for the reproduction pipeline and versioning
- [SUPPORTS] ADR-0001/0011 (editable PPTX): the RI-to-Slide task (image+file pair comparison without source code) = structurally identical to Typodeck's reproduction benchmark.
- [SUPPORTS] ADR-0017: OF-KB's contribution to preventing version-mismatch errors (§A.2) → empirical grounding for the Registry's version-management rationale.
- [SUPPORTS] ADR-0018: Coder·Assembler max-3 self-refinement = the gate pattern. The discard-block-on-execution-failure rule → reference for gate design.
- [SUPPORTS] ADR-0016: the Describer's normalized descriptions+snippets = a weak intermediate representation. Slide IR can claim differentiation as explicit and versioned.
- [EXTENDS] SCM (Pearson 0.873·ICC 0.726, §5.4) → borrowable for reproduction-benchmark difficulty labeling. The 4-metric family (Global CLIP/SSIM + Local content/position + Execution + Overall) → reference for the Visual Critic metric system. But Overall's dominance by execution rate (§6.2–7) should be improved via separate reporting.
- [CAUTION] 40.5 points is vs. NL-input baselines. Weights·hyperparameters undisclosed, so recalibration is needed for dedicated use.

### 04 PPTAgent → grounding for reference-based approach, deck structure, and evaluation dimensions
- [SUPPORTS] ADR-0010 (447-ref corpus): "pick a reference and edit it" (§2.1) + reference-based improvements (design +40.9% etc., §4.5) → quantitative justification for the reference-based approach.
- [SUPPORTS] ADR-0003 (Purpose presets): functional types structural/content + role labeling (§2.2) ↔ slide functional types. Coherence collapse on structural removal (§5.1) → causal-importance evidence for deck-structure role modeling.
- [EXTENDS] ADR-0017: schema (what; success 95→78.8% on removal, §5.1) + Grammar (how) = complementary. Transplanting the "role→visual token" mapping can mitigate reference-quality dependence (limitation 2).
- [SUPPORTS] ADR-0016: the HTML intermediate representation determining success rate (95→74.6% on CodeRender removal, §5.1) → quantitative evidence that "an LLM-friendly intermediate representation is decisive for robustness."
- [EXTENDS] PPTEval's Content·Design·Coherence split (§3) → Typodeck evaluation mapping (Content→fidelity, Design→Good Layout, Coherence→Deck Rhythm) + a 4th dimension, Intended Visual Hierarchy = a "PPTEval superset" framing. Human agreement Pearson 0.71·κ 0.59 → Critic target line ("beat 0.71").
- [CAUTION] Self-correction repairs only execution errors; visual defects (overlap) remain (limitation 3) → grounds the "REPL repair→render repair" evolution. Same model for generation and evaluation (GPT-4o) → a judge-generator-separation anti-example.

### 05 LecSlides/SlideParser → grounding for relation modeling and grouping
- [EXTENDS] ADR-0002/0016: the quantitative value of text relation modeling (R-1 +5.9·METEOR +4.4, Table 5) → grounds introducing an IR relation layer (RPH-style pseudo-labels). Lecture chunks (mean 3.2 slides) → reference for IR semantic-unit splitting rules.
- [SUPPORTS] ADR-0018: relation-consistency checks (whether logically related elements are visually isolated) → added gate check items. The 4 QA types (text reasoning 64%·visual analysis 18%·data interpretation 14%·binary 4%) → reproduction-benchmark rubric mapping.
- [EXTENDS] ADR-0006/0017: dual spatial+semantic relations (DL-Cluster, −3.9 without spatial vs −0.8 without semantic, Table 7) → versioned relation-style rules (`same-cluster → spacing.compact`, etc.).
- [GAP] Only undirected binary relations provided → no hierarchy·order·reference direction needed for Typodeck Grouping. **Relation-type extension must come first (new ADR candidate B)**. The understanding-time hard mask (−∞) must not be transplanted directly into generation → convert to soft constraints.
- [CAUTION] Lecture-domain bias, visual-element relation gap (text-to-text only), ROUGE/EM metrics unrelated to layout quality. License unstated (verify before training use).

### 06 ColPali → reference search only (forbidden as a Critic)
- [EXTENDS] ADR-0010: a ColPali-style multi-vector index over the 447 reference renderings (447×257.5KB≈115MB, ~38MB pooled) → the Retrieval stage of design-case search. ViDoRe query-construction cost (4 annotators×3h/100 queries) → estimate reference for the eval set.
- [CAUTION] Unrelated to ADR-0018: the LI score is query–patch proximity, not quality (contrast·alignment·hierarchy are not in the objective, §4.2). **Forbidden to interpret as a Visual Critic score**. Allowed scope: search debugging·selection rationale·mismatch analysis. Final selection stays with the Visual Critic + Validation-Repair.
- [CAUTION] No slide-distribution evaluation. Pilot first (human-verified queries + nDCG/Recall) before adoption. Usable as a first-pass filter over the 38 candidates, but relevance≠quality.

### 07 PPTBench 2026 → blueprint for gated evaluation and text-render checks
- [SUPPORTS] ADR-0001/0011 + ADR-0018: Stage 0 artifact validity (parseable·single slide·min 3 native components·raster ban, §2.3) → transplant as the Valid PPTX gate checklist.
- [SUPPORTS] ADR-0018: the gated score (S=Gart·Gsem·Grt·detailSum, "fundamental failures cannot hide behind detail scores") = isomorphic to the Valid→Good→Hierarchy staging goal. Stage 1 decision items (endpoints·directions·branches·labels) → reusable for the meaning-preservation axis.
- [GAP] **New text-render fitting gate (new ADR candidate C)**: 53% of residual deductions are text, top item unexpected_wrap (§3.3). Cause = the gap between declared OOXML geometry and renderer wrapping decisions. Post-Composition-Engine render→overflow·overlap·wrap checks must be added to the gate.
- [SUPPORTS] Inspect-and-regenerate loop: review correlation r=0.881 vs revision r=0.255 (§3.3) → empirical support for a "render-inspection-frequency-first" design. But causation denied → Typodeck needs its own controlled experiment.
- [EXTENDS] Judge-template borrowing: 3-round majority·human blinded 86.5%·repeatability 96%·sensitivity·ranking stability (§3.4) → Critic reliability-reporting format. The issue taxonomy (High 3.0/Med 1.5/Low 0.5/Diagnostic 0 + impact share) → reference for the Registry violation-severity system.
- [CAUTION] Shallow editability validation (minimum-condition level). Science-diagram bias (all 500 tasks). Fixed LibreOffice (cross-renderer validation needed). Rank-1 CI includes 0 (report bands).

## 2. ADR → paper (reverse)

| ADR | Supporting/extending papers | Key evidence |
|-----|-----------------------------|--------------|
| 0001/0011 Editable PPTX | 03, 07 | RI reproduction-task isomorphism / Stage 0 checklist |
| 0002/0016 Slide IR | 01, 03, 04, 05 | Dual representation·OF-KB·HTML intermediate representation·relation layer |
| 0003 Purpose presets | 04 | Functional types·coherence-collapse experiment |
| 0006/0017 Registry | 01, 03, 04, 05, 07 | Structural prior·OF-KB·schema complement·relation rules·severity |
| 0007 HTML≠proof | 01, 07 | Render rubric ρ .86–.89 / LibreOffice-dependence warning |
| 0010 Research separation·447 corpus | 04, 06 | Reference-based justification / search index (115→38MB) |
| 0012 Typography-first | 02 | Relative-importance preservation·designer quote |
| 0018 Validation-Repair | 01, 02, 03, 04, 05, 07 | All 6 papers connected (atomic APIs·gate loop·3× repair·render repair·relation checks·gated score) |

## 3. Gaps → new ADR candidates

| Candidate | Content | Grounding papers | Precondition |
|-----------|---------|------------------|--------------|
| A. Visual Hierarchy Alignment | Measure·gate intended importance (Slide IR) vs perceived importance (prediction model) agreement | 02 (prototype), 05 (measurement operator), 04 (4th dimension) | IR emphasis-field preservation (ADR-0016 revision) |
| B. Relation-typed IR layer | Undirected binary → relation graph incl. hierarchy·order·reference direction | 05 (starting point), 01 (JSON relation encoding) | Soft-constraint design (hard mask forbidden) |
| C. Text render fitting gate | Post-render overflow·overlap·wrap checks (Stage-2-like) | 07 (53%·unexpected_wrap), 01 (overlap failures) | Fixed standard renderer + threshold recalibration |
| D. Judge-generator separation | Separate evaluator from generator + human blind in parallel | 04 (anti-example), 07 (86.5% validation template) | Critic model selection |

## 4. Pre-citation checklist

- 01: Table 2·3 matrices, Figure numbers → check against source PDF.
- 02: Table 1·2 row–model mapping (conversion loss) → check against source PDF. Verify license.
- 03: Table 2/5 type-name mismatch → check code repository.
- 04: Table 2/3/4/5/6 missing cells → check against source PDF.
- 05: N·normalization·model names·rules undisclosed → check GitHub/HF. Verify license.
- 06: Table 4·5 mapping, §6 sign contradiction → check against source PDF.
- 07: Table 2·3·8–11·13 missing cells → check against source PDF. Domain·cost timeliness.
