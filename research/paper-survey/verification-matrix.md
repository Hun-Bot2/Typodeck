# Typodeck Paper Survey — Verification Matrix (Stage-1)

> One row per must-verify claim from Wave-1. **Status verdicts are cited from Wave-1 evidence, not re-verified here** (no PDF was re-read for this file).
> "Original survey statement" renders the Korean working survey (`research/paper-survey-tmp/`, tmp §0/§8 read directly, remainder via the faithful EN translation) in English.
> "Verified English interpretation" follows the EN files in this folder.
> Consistency between each Wave-1 verdict and its EN file was checked over the EN headers, §7 relevance sections, and all `[CORRECTED]` markers: **no inconsistency found, hence no Inconclusive rows.**
> Wave-1 "unresolved" items appear as Unverified rows at the end of each paper's table.

## P1 — PPTBench 2025 (Huang et al.) — `01-pptbench-2025.md`

| # | Source location (PDF) | Original survey statement | Verified English interpretation | Status | Implications for Typodeck |
|---|------------------------|---------------------------|---------------------------------|--------|--------------------------|
| P1-1 | Abstract, §3.3, §6; PDF pp.1,4,11 | 958 professional PPTX files collected from government archives (mean 23.7 slides/file). | Same: 958 PPTX from government archives confirmed. | Verified | Reusable external benchmark corpus (§7.2.1); domain-mismatch caveat: mostly government/English/4:3 (§7.3.2). |
| P1-2 | Abstract, §1, §3.1, Fig.2 center; PDF pp.1–3 | 4,439 evaluation samples in total. | Same: 4,439 samples confirmed. | Verified | Benchmark scale reference for Typodeck's own reproduction benchmark (§7.2.1). |
| P1-3 | PDF p.3, Fig.2 | 4 categories / 11 subtasks defined, but per-subtask N missing (HTML loss). | Definitions confirmed; per-subtask N recovered: Det 400/400/400, Und 626/207/206, Mod 600/400/200, Gen 800/200. | Corrected | Difficulty reporting now complete; length distributions per subtask remain figure-only (§7.3, §6.2). |
| P1-4 | §9.2, Listing 9; PDF p.19 | 17 atomic APIs governed by Atomicity / Composability / Executability. | Same; API order in Listing 9 noted (choose_shape before choose_slide, content identical). | Verified | API principles transferable to Composition Engine operation design; sequential preconditions inform IR ops (§7.1.2). |
| P1-5 | §4.5.2; PDF p.8 | 3 API templates (Title/Bullet/Image-with-Description) lift Generation: GPT-4o 39.36→45.72, Gemini 37.91→55.97. | Same figures confirmed. | Verified | Empirical support for structural priors → Grammar Registry / 38 Composition Candidates differentiation (§7.1.3, §8.2). |
| P1-6 | §4.2, Table 4; PDF pp.6,8 | Generation scored on a 0–5 LLM rubric; LLM–human ρ 0.86/0.89; judge is Gemini-2.0. | Same confirmed. | Verified | Rubric + agreement protocol portable to Visual Critic validation (ρ ≥ 0.85 release criterion, §7.2.5); judge-family self-preference caveat (§7.3.4). |
| P1-7 | §4.4; PDF p.7 | JSON structure helps Detection/Modification, screenshots help Understanding (charts/tables); dual input best overall; small models sometimes degrade with both modalities. | Same confirmed. | Verified | Justifies modality-split Visual Critic: IR numeric checks + rendered-image judgments (§7.2.3); citable as §8.3. |
| P1-8 | §4.5.2; PDF p.7 | CoT raises Generation quality but cuts executable API sequences from 748 to 531. | Same confirmed. | Verified | CoT-like stages must be co-designed with Validation-Repair retry/recovery rate (§7.3.5). |
| P1-9 | §4.6; PDF pp.7–8 | 4 systematic layout failures: dominant-element mis-ID, chart-proportion misjudgment, overlap-inducing moves, image-over-bullet overlap. | Same confirmed. | Verified | Failure taxonomy → Validation-Repair error codes; evidence for Valid→Good→Hierarchy staging (§7.1.5, §7.2.4). |
| P1-10 | Abstract, §4.3; PDF pp.1,6 | Difficulty hierarchy rendered as Detection << Understanding << Modification << Generation. | Paper uses single "<", not "<<"; gap wording per Abstract/§4.3. | Corrected | Cite with single "<" (§8.1); hierarchy remains the core motivation claim. |
| P1-11 | §4.1, §9.1; PDF pp.5,14 | 8 models evaluated; temp 0, top_p 0.95, ctx 2048, batch 1, 8×A100, ollama 4-bit for open models. | Same confirmed (see also P1-18 for the Gemma-3 list caveat). | Verified | Reproduction settings for any Typodeck-vs-PPTBench comparison (§7.2.1). |
| P1-12 | Abstract; PDF p.1 | "All datasets and code are fully released" + GitHub URL. | Same confirmed verbatim. | Verified | Corpus/code reusable as-is for external validation (§7.2.1). |
| P1-13 | Table 1; PDF p.4 | Table 1 row labels guessed from HTML (labels lost). | Mapping confirmed: Det S✓Q✓A✗L✓; Und S✓Q✓A✗L✓; Mod all ✓; Gen S✗Q✓A✓L✗. | Corrected | Input-modality requirements per category now citable without guessing. |
| P1-14 | Table 2; PDF p.6 | Table 2 mostly lost in HTML (labels + cells + Overall column). | Full matrix + Overall column recovered from PDF. | Corrected | Headline numbers (e.g. best Generation ≈33%) now directly citable (§8.1). |
| P1-15 | Table 3; PDF p.8 | Table 3 lost in HTML conversion. | Full matrix recovered; LLaVA-1.5 Generation "–" is as printed (not reported). | Corrected | Ablation/template numbers (P1-5) grounded cell-by-cell. |
| P1-16 | Fig.6, Fig.8, §6; PDF p.11 | n=958 files, mean 4.9 shapes/slide (text values). | Text values kept; Fig.6 legend prints n=959 and Fig.8 Mean=4.5 — paper-internal inconsistency flagged. | Corrected | Cite text values (958/4.9); never cite the figure legends. |
| P1-17 | Fig.4 vs Table 3; PDF p.8 | Gemma3 CoT Generation value as converted. | Fig.4 bar (31.00) ≠ Table 3 (33.15); GPT-4o/Gemini match exactly; no explanation in paper. | Corrected | Cite Table 3 (33.15) for Gemma3; flag the figure mismatch if Fig.4 is referenced. |
| P1-18 | §9.1; PDF p.14 (supp p.3) | All open models (incl. Gemma-3 12B) under ollama/4-bit. | §9.1 sentence names only Llama3.2-Vision, LLaVA-1.5, MiniCPM-V; Gemma-3 omitted — flagged. | Corrected | Gemma-3 deployment setting unknown; do not assert 4-bit for it. |
| P1-U1 | §4.2 (absent) | Note Generation assumed under the same 0–5 rubric. | Paper describes only the API-sequence Generation metric; rubric scope for notes unstated. | Unverified | Do not claim rubric coverage of Note Generation. |
| P1-U2 | Fig.3/6/7/8 (figure-only) | Bar-chart values used qualitatively. | Exact numerics not stated in body text; only qualitative findings used. | Unverified | Cite trends only, never precise bar values. |
| P1-U3 | Figs vs text (see P1-16/17) | Discrepancies assumed resolvable. | Paper-internal, unexplained; text/table values adopted by Wave-1. | Unverified | Carry the Wave-1 choice (text over figure) when citing. |

## P2 — UMSI Visual Importance (Fosco et al., UIST 2020) — `02-umsi-visual-importance.md`

| # | Source location (PDF) | Original survey statement | Verified English interpretation | Status | Implications for Typodeck |
|---|------------------------|---------------------------|---------------------------------|--------|--------------------------|
| P2-1 | PDF p.1 | Title/authors/affiliations; UIST 2020 preprint note; arXiv:2008.02912v1, 7 Aug 2020. | Same confirmed (UIST Oct 20–23 dates NOT IN SOURCE). | Verified | Cite as UIST 2020 preprint without conference dates. |
| P2-2 | PDF pp.2–3 | Imp1k: 1,000 designs, 200 per class; webpage/poster/mobile-UI/infographic/ad. | Same confirmed. | Verified | Class list bounds transfer claims: slides are none of the 5 (§7.3.1). |
| P2-3 | PDF pp.3–4, Fig.4 | Xception encoder, ASPP 256 filters d=1/6/12/18, decoder, 6-class module, KL×10/CC×−3/BCE×5 losses. | Same confirmed. | Verified | 2020-era architecture baseline; compare against transformer successors before adopting (§7.3.7). |
| P2-4 | PDF pp.8–9 | Element score = mean importance inside mask / over extent, in both applications. | Same confirmed verbatim. | Verified | Directly portable scoring operator: IR mask averaging → perceived-importance vector (§7.1.1, §8.2). |
| P2-5 | PDF p.8 | 90 variants (6×3×5), mean CC 0.928, 87% target-increase success. | Same confirmed. | Verified | Feasibility precedent (not a performance baseline) for Validation-Repair gate (§7.1.4, §8.3). |
| P2-6 | PDF pp.9–10 | "Preserve relative importance = designer intention" + hierarchy quote verbatim. | Same confirmed. | Verified | Hierarchy Agreement archetype; expert quote citable for Intended Visual Hierarchy (§7.1.2, §7.1.6). |
| P2-7 | PDF p.6 | UMSI shows diminished text bias vs prior model [6]'s excessive text bias. | Same confirmed. | Verified | Text-bias checks mandatory for text-dense slides (§7.1.7, §7.3.4). |
| P2-8 | PDF p.5, Tables 1–2 | All table values match; row labels guessed (O.Auto/Full, B., B.+O., SAM, UMSI …). | Values confirmed; 12 row labels repaired from PDF, confirming the guesses. | Corrected | "54% CC gain on GDI" and Imp1k wins now citable without guessing (§8.3). |
| P2-9 | PDF pp.5–6 | SALICON CC 0.782 / KL 0.341 vs SAM 0.811/0.324; 95% 5-class accuracy; Table 2 Acc 0.98. | Same confirmed. | Verified | Single unified critic handling 6 classes: design precedent for one Visual Critic (§8.3a). |
| P2-10 | PDF pp.8–10 + Conclusion | Bare-bones tool, size/position-only reflow, open problem, Fig.6 modes; visualizations omitted. | Same confirmed. | Verified | Repair-operator hints (enlarge+centralize); reflow scope limits (§7.2.5, §7.1.4). |
| P2-11 | PDF p.5 (body + Table 1) | Combined-model citation printed oddly ("[6] and [29] … in [6]"). | Oddity is the paper's own slip (identical in PDF and HTML), not conversion loss; Table 1 confirms [6]+[28]. | Corrected | Cite combination as Bylinskii+O'Donovan; ignore the in-text numbers. |
| P2-12 | PDF pp.1–12 (refs) | Citations per HTML numbering. | All re-keyed to PDF numbering (HTML ran +1); RelWork mobile-UI [9] sic noted. | Corrected | Use PDF citation numbers when tracing references (§2.2). |
| P2-13 | PDF pp.2–3 | MTurk: 249 workers, 10/HIT, 30/HIT, 3 sentinels IoU>0.6 (2/3), $1.00, 25–30 avg annotators. | Same confirmed. | Verified | Annotation protocol precedent for any Typodeck importance-labeling study (§8.1). |
| P2-14 | PDF p.3 | ≤7 elements per design; ad text 32% > infographics; faces top in ads/posters (tied). | Same confirmed. | Verified | Dataset composition facts bound generalization claims. |
| P2-15 | PDF p.4 | SALICON 20K (10K/5K/5K); pretrain 10–15 epochs; 160 SALICON/epoch; Imp1k test 20%/class. | Same confirmed. | Verified | Training protocol facts for reproduction attempts. |
| P2-16 | PDF p.4 | lr 1e-4 (/10 per 3 epochs), dropout 0.3, batch 8, Adam. | Same confirmed. | Verified | Hyperparameters for reproduction attempts. |
| P2-17 | PDF p.9 | Reflow study: 17 designs, 100→43 MTurk ($1.50), 6 designers ($5.00), p<0.05 Bonferroni. | Same confirmed. | Verified | User-study design precedent incl. stats bar. |
| P2-18 | Full-text grep | Survey states no slide/PPT coverage. | Zero slide/PPT mentions confirmed (only "Presentation" in ACM class line). | Verified | Hard scope boundary: every Typodeck citation must state slides unvalidated (§7.3.1). |
| P2-19 | PDF pp.1,10 | Training adaptable to new classes; code/data at predimportance.mit.edu. | Same confirmed. | Verified | 7th-class (slides) extension is paper-sanctioned future work, code permitting (§7.2.4). |
| P2-U1 | Fig.3 (figure-only) | Per-class classification accuracy numerics. | Body gives only the 95% average; figure values unrecoverable from text. | Unverified | Cite the 95% average only. |
| P2-U2 | Main text (absent) | Fine-tune epochs, input resolution, augmentation, GPU/time, Adam betas. | Absent from main text (may live in unretrieved Supplemental). | Unverified | Reproduction needs the Supplemental or re-tuning. |

## P3 — SlideCoder (Tang et al.) — `03-slidecoder.md`

| # | Source location (PDF) | Original survey statement | Verified English interpretation | Status | Implications for Typodeck |
|---|------------------------|---------------------------|---------------------------------|--------|--------------------------|
| P3-1 | §5.2, Table 1; PDF pp.6–7 | Overall gains +40.5/+34.0/+29.9 vs per-tier best baselines. | Same confirmed; arithmetic checks out. | Verified | Headline citation, but state the NL-input-baseline context (§7.3). |
| P3-2 | §5.2, Table 1; PDF pp.6–7 | Execution gains +38/+32/+27pp (99−61, 100−68, 96−69). | Same confirmed. | Verified | Execution rate dominates Overall (failures score 0): report separately in Visual Critic (§7.3). |
| P3-3 | §3.2, §5.4; PDF pp.3,7 | SCM validated at r=0.873, ICC=0.726 (4 raters × 50, 100 items); epsilon placement as drafted. | r=.873 (p=2.776e-32), ICC=.726 (p=1.186e-31) confirmed; weights absent; ε sits inside sqrt (draft misplaced it). | Corrected | Borrowable difficulty metric, but weights need recalibration on Typodeck data (§7.2.3, §8.2); small-sample caveat stands. |
| P3-4 | Algorithm 1; PDF p.4 | CGSeg 9 steps as listed. | Steps match; g/Dmax/T values absent from full text. | Verified | Top-contributing component; portable as region-decomposition preprocessing, but fixed-rule limits need hybrid (§7.2.1, §8.1). |
| P3-5 | §4.2.2; PDF pp.5–6 | TS-KB→Describer, OF-KB→Coder/Assembler; BGE M3 retrieval; top-k value. | Routing + BGE M3 confirmed; top-k value absent. | Verified | Two-level KB maps onto Grammar Registry + candidate retrieval; OF-KB versioning supports IR versioning rationale (§7.1.3, §8.3). |
| P3-6 | §4.3; PDF pp.5–6 | Position <x,y,w,h> with proportional scaling to inches <Position\*> + <Grammar>. | Same confirmed. | Verified | Coordinate-representation baseline for Composition Engine; linear-scaling limit is a Typodeck improvement point (§7.1.5). |
| P3-7 | §4.4, Table 7; PDF pp.6,19 | SlideMaster = Qwen2.5-VL-7B-Instruct + LoRA (Table 7 params); (RI,instr,prog) triplets. | Same confirmed; triplet count absent. | Verified | Fine-tuning precedent for a Typodeck-side 7B model. |
| P3-8 | §5.1; PDF p.6 | Max 3 self-refinement rounds (Coder+Assembler), first success kept. | Same confirmed. | Verified | Same pattern as Validation-Repair gate; block-discard/failure rules reusable (§7.1.4). |
| P3-9 | §5.5, Tables 3–4; PDF pp.8,12 | Ablation on 33/tier = 99 (GPT-4o); w/o CGSeg drops most. | Same confirmed. | Verified | Core evidence that segmentation is the key stage (§8.1). |
| P3-10 | §5.2, Table 1; PDF pp.6–7 | SLIDESBENCH 78.8 vs 66.9 = +11.9. | Same confirmed. | Verified | Cross-benchmark generalization evidence. |
| P3-11 | Tables 2 vs 5; PDF pp.7,12 | T2 title/placeholder vs T5 rectangle/object_placeholder labels; T2 sums. | Mismatch genuine in paper; T2 sums to 51, not 44. | Verified | Cite with the paper's own inconsistency noted; do not "fix" silently. |
| P3-12 | §5.1; PDF p.6 | Overall = average over all metrics/samples; failures score 0. | Same confirmed. | Verified | Metric-design warning: separate execution rate from quality (§7.3). |
| P3-13 | Table 1; PDF p.7 | Table 1 transcription as converted. | Full 24-row transcription matches rendered table incl. color-tier order. | Verified | All Slide2Code numbers citable cell-by-cell. |
| P3-14 | §5.3; PDF pp.6–7 | Reconstruction ratio 90.38/65.67, CLIP 88.66/69.87. | Same confirmed. | Verified | Fine-grained metric precedents for Visual Critic. |
| P3-15 | §A.2, Table 4; PDF pp.11–12 | Position 81.35→72.16 vs 81.3→72.2. | Both correct: §A.2 precise, Table 4 rounded. | Verified | Cite either with consistent precision. |
| P3-16 | Survey §§7.2–8 (supplemented) | Reconstructed §7.2-end/7.3/8 after cut-off. | All grounded in §§4–6 numbers; nothing unsupported. | Verified | Typodeck relevance + citation points stand as verified (§7.2–§8). |
| P3-17 | Table 4; PDF p.12 | Table 4 group headers as converted. | Header swap is a paper typo; column order/values unaffected. | Verified | Read values by column order, not header text. |
| P3-18 | Fig.6/7/8/9/10/11; PDF pp.13–18 | Draft said Figs 6–11 bodies image-only, no extractable text. | Bodies of Fig.6/8/9/10/11 ARE text-present; only Fig.7 (Describer prompt) is image-only. | Corrected | Prompt/KB texts (Coder, Layout-aware, TS/OF-KB) quotable from PDF text layer. |

## P4 — PPTAgent + PPTEval (Zheng et al., EMNLP 2025) — `04-pptagent-ppteval.md`

| # | Source location (PDF) | Original survey statement | Verified English interpretation | Status | Implications for Typodeck |
|---|------------------------|---------------------------|---------------------------------|--------|--------------------------|
| P4-1 | Eq.1–2; PDF p.14404 | Two-stage edit-based framing S=f(C), A=g(C,Rj). | Same confirmed. | Verified | Reference-based paradigm precedent for reproduction benchmark (§7.1.1, §8.2). |
| P4-2 | App.D; PDF p.14415 | Clustering θ=0.65, ViT embeddings, a-mask/solid-bg preprocessing. | Same confirmed. | Verified | Reusable reference-preprocessing/classifier for benchmark functional typing (§7.2.1). |
| P4-3 | Table 1; PDF p.14404 | Schema columns as HTML-read (empty third column). | Resolved: Category/Description/Data; HTML emptiness was conversion artifact. | Corrected | Schema = content-role dictionary, complement to Grammar Registry's visual dictionary (§7.1.3). |
| P4-4 | Table 2; PDF p.14405 | 5 edit ops with broken function names ("duplicate" etc.). | Resolved: del_span/del_image/clone_paragraph/replace_span/replace_image. | Corrected | Tabulate against Composition Engine ops; move/resize/align/contrast are Typodeck extensions (§7.2.3). |
| P4-5 | Table 3 + App.C; PDF p.14405 | C/D slide-averaged, Coh presentation-level, 1–5 scale + rationale. | Same confirmed. | Verified | Dimension split maps onto Typodeck: Content→fidelity, Design→Good Layout, Coherence→Rhythm (§7.2.5). |
| P4-6 | §4.5; PDF p.14407 | Design +40.9% ok; content +12.1%; KCTV pair values. | Design +40.9% ok; content is +10.1% (3.28 vs 2.98), not +12.1% (survey duplicated 3.34); KCTV pair ok. | Corrected | Cite +10.1%; mixed-configuration caveat stands (§7.1.1, §7.3.4). |
| P4-7 | Table 7; PDF p.14408 | Ablations: 4.48→3.36/3.45, 95→78.8, 95→74.6. | All exact confirmed. | Verified | Causal evidence: structural-role modeling + LLM-friendly IR + CodeRender matter (§8.3). |
| P4-8 | Table 5; PDF pp.14407,14409 | R-L 16.76 vs 14.25 reversal; PPL 41.41 vs 496.62. | Same confirmed. | Verified | Direct evidence that text-similarity metrics cannot evaluate slides → Visual Critic justification (§7.1.6, §8.1). |
| P4-9 | Table 8; PDF p.14409 | Pearson rows as HTML-read; kappa values. | Rows resolved; avg Pearson 0.71; κ 0.59 (0.61/0.61/0.54); upper Reference-Analysis block is new in ACL. | Corrected | "Exceed 0.71" as explicit Visual Critic goal; κ as agreement bar (§7.1.7). |
| P4-10 | §4.5/App.B.3; PDF p.14407 | +25.5/+36.6 coherence gains; >80% score ≥3, coherence ≥4. | Arithmetic ok; distributions confirmed. | Verified | Deck-structure modeling dominates impression → Rhythm dimension (§7.1.4). |
| P4-11 | App.E/Fig.11; PDF p.14415 | XML 1,006 lines, first 60 shown. | Same confirmed. | Verified | HTML-over-XML rationale precedent for Slide IR (§7.1.5). |
| P4-12 | Limitations; PDF p.14410 | Max-2 iterations; Limitation 2 = reference dependence. | Max-2 ok; ACL Limitation 2 is retrieval/content-richness limits, not reference dependence (arXiv wording). | Corrected | Input-condition trap applies to Typodeck: fallback Grammar / minimum layout needed (§7.3.1). |
| P4-13 | §4.5 text vs Table 5 | Coherence baseline labels as printed in text. | Text labels appear swapped vs Table 5 — flagged. | Corrected | Verify against ACL Table 5 before citing coherence comparisons (§7.3.4). |
| P4-14 | Table 4; PDF p.14406 | Domain stats with missing columns (HTML loss). | Fully resolved incl. Pres #Figs/#Pages columns. | Verified | Domain coverage citable without gaps. |
| P4-15 | Table 6; PDF p.14408 | INDEX errors 89.9%, counts as converted. | 1166→244, total 1296→273 confirmed. | Verified | Error-analysis precedent for Typodeck failure reporting. |
| P4-U1 | (absent) | Significance test method for reported gains. | Not stated in paper. | Unverified | Report Typodeck's own stats; do not attribute a method to this paper. |
| P4-U2 | App.C | Coherence eval input modality beyond "extracted logical structure". | Not specified further. | Unverified | Pin Typodeck Rhythm inputs explicitly instead (§7.3.3). |
| P4-U3 | (absent) | Edit failure rollback/idempotence semantics. | Not specified. | Unverified | Typodeck gate must specify its own retry semantics. |
| P4-U4 | §4.4 (ACL) | FID 64-dim vector detail (arXiv reading). | Absent in ACL §4.4 text. | Unverified | Do not cite FID details against the ACL version. |

## P5 — LecSlides-370K + SlideParser (Zhang et al., ICCV 2025) — `05-lecslides-slideparser.md`

| # | Source location (PDF) | Original survey statement | Verified English interpretation | Status | Implications for Typodeck |
|---|------------------------|---------------------------|---------------------------------|--------|--------------------------|
| P5-1 | Abstract, Fig.1, §3.1, Table 1; PDF pp.4455–4457 | 25,542 lectures / 370,078 slides / 15 areas. | Same confirmed. | Verified | Scale precedent for slide corpora; domain-bias caveat (Business-heavy, §7.3.1). |
| P5-2 | §3.2, §3.3.4, Fig.2(e); PDF p.4458 | Summary + QA tasks; QA shares TR64/VA18/DI14/BC4. | Same confirmed. | Verified | 4 QA types map onto Visual Critic / validation check dimensions (§7.1.5). |
| P5-3 | §4.2.1/§4.2.3, Fig.3b | RPH spatial+semantic → sigmoid; RAL −∞ mask (mij<0.5), N-layer, residual. | Same confirmed. | Verified | RAL mask principle informs grouping; hard mask must NOT port directly to generation — soften (§7.1.3, §7.3.2). |
| P5-4 | §4.2.2, Fig.4, Eq.4–6 | DL-Cluster dual-stream; β1=0.7/β2=0.3; K=8; binarize 0.5; BCE. | Same confirmed. | Verified | Spatial+semantic dualism → hybrid evaluation precedent; spatial dominance supports layout-first design (§7.1.2, §8.2). |
| P5-5 | Table 5; PDF p.4462 | r1→r4: R-1 +5.9, METEOR +4.4 (compiler arithmetic). | Arithmetic correct confirmed. | Verified | Quantitative evidence for relation modeling value (§7.1.1, §8.1). |
| P5-6 | Table 7; PDF p.4462 | vs 42.2: no-spatial −3.9, no-semantic −0.8. | Same confirmed. | Verified | Spatial contribution dominates: empirical backing for layout prioritization (§7.1.2). |
| P5-7 | Table 4, §5.2.2; PDF p.4461 | SlideVQA † test EM +4.9, F1 +3.8 (pretrain→finetune). | Same confirmed. | Verified | Transfer-value evidence for LecSlides pretraining, conditional on license/domain checks (§7.2.6, §8.3). |
| P5-8 | §3.3.2–3.3.3, Fig.2b | Chunk mean 3.2 / mode 2; FRES 34.3 Hard; Grade 14.1. | Same confirmed. | Verified | Chunk size → IR chunk defaults; FRES/Grade → benchmark difficulty tags (§7.1.4, §7.1.6). |
| P5-9 | §3.1–3.2 | Annotation positions+texts; 114,472 summaries / 259,461 QA; no file schema. | Same confirmed. | Verified | Annotation design precedent; schema must come from the repo, not the paper. |
| P5-10 | §5.1, Tables 2–4 | Baselines T5/BART/mPLUG/Vid2Seq/LMv3/Donut/UDOP; Table 4 adds 7 more. | Same confirmed. | Verified | Vision-only models weakest → IR text/structure must stay first-class inputs (§8.3). |
| P5-11 | §3.1 + footnote; PDF p.4457 | Source Slideshare; filtered "by contents"; no license text. | Same confirmed. | Verified | Licensing gap: check GitHub/HF before any training/benchmark use (§7.3.7). |
| P5-12 | §5–6; PDF pp.4461–4462 | No Limitations section; only indirect gaps. | Same confirmed. | Verified | Gaps (visual relations, untyped relations, metrics) inferred by compiler (§7.3). |
| P5-13 | Table 1; PDF p.4457 (render) | Table 1 OCR column glyphs unverified (`!`/`%`). | Renders ✓ for all datasets except ALV ✗. | Corrected | OCR-annotation coverage now citable exactly. |
| P5-14 | Eq.1; PDF p.4459 (render) | Eq.1 fourth term as extracted (duplicated log). | Duplicated `log(w_i/w_j)` is in the published PDF itself; presumed typo for `log(h_i/h_j)`. | Corrected | Cite with the typo noted; do not silently "fix" the equation. |
| P5-15 | §4.1; PDF p.4459 (render) | M formula garbled in extraction. | Renders correctly (M = H/P × W/P); garble was extraction-only. | Corrected | Patch sizing formula citable as printed. |
| P5-16 | §3.1, §3.4 | Raw 39,784 lectures / 720,673 slides; splits 109472/2000/3000. | Same confirmed. | Verified | Filtering yield + split precedent for corpus construction. |
| P5-17 | Tables 2,3,4,6, Fig.6; PDF pp.4461–4462 | Table/figure values as converted. | Values + Fig.6 QA examples match cell-by-cell. | Verified | All result numbers citable. |
| P5-18 | Abstract, §5.2.2/5.3.2 | Typos as converted. | "avaliable", "SlidePraser", "Agglomerating" confirmed as printed. | Verified | Quote; use [sic] if reproduced. |

## P6 — ColPali + ViDoRe (Faysse et al., ICLR 2025) — `06-colpali.md`

| # | Source location (PDF) | Original survey statement | Verified English interpretation | Status | Implications for Typodeck |
|---|------------------------|---------------------------|---------------------------------|--------|--------------------------|
| P6-1 | §3, Table 1; PDF p.4 | ViDoRe: 5 academic + 5 practical tasks, counts/langs/domains. | Same confirmed. | Verified | Query-design methodology (100 validated queries/topic) reusable for reference-search eval (§9.2). |
| P6-2 | §4.1–4.2, Eq.1–2; PDF p.6 | LI equation LI(q,d)=Σ max<Eg\|Ed> + softplus loss. | Same confirmed. | Verified | Fine-grained text+visual matching fits slide-search queries (§9.1). |
| P6-3 | §4.3 + App.B.2; PDF pp.6,18 | Train: 1 epoch, bfloat16, LoRA r=α=32, paged_adamw8bit, 8 GPUs, LR 5e-5, batch 32, 5×<unused0>. | Same confirmed. | Verified | Cheap reproduction/fine-tuning recipe for domain adaptation (§9.1). |
| P6-4 | Tables 2/4/5; PDF pp.7,18,19 | Table 2 rows as converted; Tables 4/5 labels+units lost. | Table 2 verified; Table 4/5 labels+units restored (BGE-M3 8.60, BM25 3.00/1.56±0.51, ColPali fp16 257.5 KB; ops 0.81/2.67/3.71/0.03/0.12/0.39 s, totals 7.22/0.12/0.39 s). | Corrected | 81.3 vs 67.0 vs 58.6 headline + cost arithmetic (447 refs ≈115MB, §9.2) now grounded. |
| P6-5 | §5.2, App.B; PDF pp.8,18 | 257.5 KB/page; pool factor 3: −66.7% vectors, 97.8% retained, Shift outlier. | Same confirmed. | Verified | Storage optimization portable (~38MB pooled); text-dense slides may pool poorly like Shift (§9.1). |
| P6-6 | §5.2–5.3; PDF pp.5,8,19 | Query enc BGE 22ms/15tok, ColPali 30ms; LI ~1ms/1k pages; totals 7.22/0.12/0.39 s. | Same confirmed. | Verified | Latency budget: 447-scale retrieval dominated by ~30ms query encoding (§9.2). |
| P6-7 | §6, Table 7; PDF pp.9–10 | +1,552 French-table samples; TabFQuAD +2.6 nDCG@5, +5 R@1, +0.4 overall. | Same confirmed (see P6-U2 for the R@1 table gap). | Verified | Small-set domain adaptation precedent: cheap slide fine-tuning plausible (§9.1). |
| P6-8 | §5.3, App.D; PDF pp.8–9,22 | <hour>/Kazakhstan heatmaps + white-patch ViT-register hypothesis. | Same confirmed; figures viewed. | Verified | Retrieval-debugging UI precedent; register hypothesis warns against over-reading maps (§9.1, §10.3). |
| P6-9 | §6 prose vs Table 7; PDF p.9 | QA-token prose: "improvement" +9.8/+6.3. | Prose sign flipped; Table 7 authoritative: removal costs −9.8/−6.5 (prose +6.3 also 0.2 off). | Corrected | Tokens HELP French tasks (+9.8/+6.5 for keeping); cite the table, never the prose direction. |
| P6-10 | Reproducibility; PDF pp.10–11 | MIT licenses for data/adapters/code/benchmark. | Same confirmed. | Verified | Cleanest license of the 7: adoption-ready pending slide-domain pilot (§9.3). |
| P6-11 | App.A.2; PDF pp.16–17 | Query-gen ≤3/img, 10k imgs/theme, Claude-3 prompt; 4 annotators ×~3h, 0 PII flags. | Same confirmed. | Verified | Effort estimate (4×3h per 100 queries/topic) directly reusable for Typodeck eval budgeting (§9.2). |
| P6-12 | §7 + Reproducibility; PDF p.10 | No Limitations section; limits derived from future work. | Same confirmed. | Verified | Limits (incl. Visual-Critic misuse ban) are compiler-derived but source-grounded (§9.3). |
| P6-13 | PDF p.1 (header/byline) | ICLR 2025 per brief only (no "ICLR" in HTML); ∗ meaning unclear. | Venue confirmed via per-page header; all of Faysse/Sibille/Wu share equal-contribution ∗. | Corrected | Cite as ICLR 2025 with three equal contributors. |
| P6-14 | §2.1, Tables 2/6; PDF pp.5,7,18 | 63/37 vs 61.32/38.70; R2/R3 rows; BiPali signs. | Gap genuine; R2/R3 swap + BiPali double-sign genuine in PDF. | Verified | Trust absolute values only; interpret signs with care. |
| P6-U1 | Table 7 | Row names "ColPali (224)" / "Reference: 448". | Undefined in PDF; delta-matched to 512-patch variant only. | Unverified | Do not assert the resolution meaning of 224/448. |
| P6-U2 | (absent) | TabFQuAD Recall@1 +5 supporting table. | Absent (Table 6 covers base models only). | Unverified | Cite +5 R@1 as text-only, without table backing. |
| P6-U3 | Appendix | Shift Project collection counts. | Absent (appendix names only 4 seeds). | Unverified | Do not cite Shift collection size. |
| P6-U4 | §6 / App.B | ColQwen2-VL/ColIdefics2 exact hyperparameters. | Only "same data and training strategy" stated. | Unverified | Reproduction of those variants needs author code. |

## P7 — PPTBench 2026 (Wang et al.) — `07-pptbench-2026.md`

| # | Source location (PDF) | Original survey statement | Verified English interpretation | Status | Implications for Typodeck |
|---|------------------------|---------------------------|---------------------------------|--------|--------------------------|
| P7-1 | §2.2, Table 6; PDF pp.1,3–4,18 | 500 tasks / 10 domains / Table 6; Others classes partial ("etc."). | Same confirmed; Others full class list repaired (eess.SP 16 … stat.AP 1). | Corrected | Domain list complete; scientific-diagram bias caveat stands (§7.3). |
| P7-2 | §2.3, App; PDF pp.4–5,30 | Gated S formula Eq.1, Stage 0–3 criteria, Stage-0 ≥3 components. | Same confirmed; merge dimension added (by dimension+category+subtype). | Corrected | Gated-scoring design portable: fundamental failures can't hide behind details (§7.1). |
| P7-3 | §3.2, Table 1; PDF pp.1,5–6 | Best 77.34 vs median 24.38; 5714/18000=31.74%; 10 models/36 configs. | Same confirmed. | Verified | Headline motivation citation: agents fail faithful reconstruction (§8.1). |
| P7-4 | §3.3, App.C.3 Fig.6; PDF pp.6,20 | Semantics (Stage 1) is the dominant failure stage. | Same confirmed. | Verified | Meaning-preservation sub-gate under Good Layout (§7.2). |
| P7-5 | §3.3, App.D Table 7; PDF pp.6,22 | Text 53.0% of 64,210.58; unexpected_wrap 5723.9/1864/0.577. | Same confirmed. | Verified | Direct evidence for post-render text checks in Visual Critic / Validation-Repair (§7.1, §8.2). |
| P7-6 | §3.3, App.F Table 10; PDF pp.7,24 | Review r.881/ρ.897 vs revision .255/.462 (n=27); disclaimer verbatim. | Same confirmed. | Verified | Inspect-and-regenerate loop rationale; causation explicitly denied — Typodeck needs own experiment (§7.1, §8.3). |
| P7-7 | §3.3, Table 1; PDF p.7 | Astra low→high +17.92 (+17.8pp gate, +1.4 detail); Opus xhigh 35.91→max 33.54. | Same confirmed. | Verified | Compute-budget lesson: prioritize gate-pass rate over detail (§7.1, §8.3). |
| P7-8 | §3.4, App.G; PDF pp.8,26–27 | Human agreement 86.5% (173/200, CI 81.1–90.6); repeat 96.0%; τ .971–.997. | Same confirmed. | Verified | Reliability-reporting template (agreement/repeatability/sensitivity/stability) for Visual Critic (§7.1). |
| P7-9 | App; PDF pp.30–31, Eq.3–4 | Severity 3.0/1.5/0.5/0; m(ρ) ladder 1.00/1.25/1.50/2.00/2.50. | Same confirmed. | Verified | Severity + affected-fraction structure portable to Grammar Registry violations (§7.1, §7.2). |
| P7-10 | App; PDF p.28 | Rank-1 lead 4.74, paired 95% CI [−0.07,9.53] incl. zero; 5/35 excl. zero. | Same confirmed. | Verified | Cite best-model by tier, never as definitive ranking (§7.3). |
| P7-11 | §2.2, §3.1; PDF pp.3,5,19 | Fixed renderer (LibreOffice) + frozen-price-snapshot costs. | Same confirmed. | Verified | Thresholds need cross-renderer validation; costs expire (§7.3). |
| P7-12 | Tables 2/3/8/10/11/13; PDF pp.8,23–24,26–27 | HTML-missing cells (kappas, F1, rows, variants) as convertible. | Gaps repaired from PDF (κ 0.809/0.797, F1, +5.89 variant, etc.). | Corrected | Judge-reliability numbers (P7-8) now fully backed. |
| P7-13 | §2.3; PDF p.4 | Judge = GPT-5.6 Luna High ×3 rounds; Gsem/Grt 2-round rules; caps 30/40/30. | Same confirmed. | Verified | Judge-design template (3 rounds + majority + merge) for Visual Critic (§7.1). |
| P7-14 | §3.2; PDF pp.5–6 | 8/36 configs >40; weakest Luna-none 1.53; flawless 461 (2.56%). | Same confirmed. | Verified | Score-distribution context for the §8.1 motivation claim. |
| P7-15 | §3.1–3.2; PDF p.5 | Cost $20.67–$1598.36, med ~$151.50; Astra 156884/849174 tok; Qwen-GLM cases. | Same confirmed. | Verified | Cost figures citable only with recomputation (§7.3). |
| P7-16 | §3.2; PDF p.6 | Mean-vs-gate r=.997; gate span 1.8–80.8 vs passed 63.0–97.1. | Same confirmed. | Verified | "Gate-pass × passed-mean" decomposition idea for 38 candidates (§7.2). |
| P7-17 | App.E Table 8; PDF p.23 | Common-pass Astra N=289: +0.98 detail, −9.8pp (66 new/−115). | Same confirmed. | Verified | Conditional-mean trap warning for candidate scoring (§7.2). |
| P7-18 | App.D Table 7; PDF p.22 | Table 7 top-15 rows; text 10191 / graph 10849 occurrences. | All rows match confirmed. | Verified | Issue taxonomy + frequencies ground Grammar Registry severities (§7.1). |
| P7-19 | §3.4, Table 4; PDF p.8 | Ranking stability τ .956 (.933–.975); 1st 97.4%; CI width 5.95/8.29. | Same confirmed. | Verified | Bootstrap-stability reporting precedent for Typodeck evals. |
| P7-20 | App.D; PDF p.21 | "Fails all three judge rounds" (Task 0104 reading). | Fixed: all-3-rounds applies to the Fig.7 pair only. | Corrected | Cite the corrected scope for the failure case. |
| P7-21 | App.A; PDF pp.16–17 | 2025-PPTBench contrast (4439/11/958/17 APIs) + Slide2Code (900/300). | Same confirmed. | Verified | Cross-links P7↔P1/P3 consistent with this survey's own figures. |

## Totals

| Status | P1 | P2 | P3 | P4 | P5 | P6 | P7 | Total |
|--------|----|----|----|----|----|----|----|-------|
| Verified | 10 | 16 | 16 | 9 | 15 | 11 | 17 | 94 |
| Corrected | 8 | 3 | 2 | 6 | 3 | 3 | 4 | 29 |
| Inconclusive | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Unverified | 3 | 2 | 0 | 4 | 0 | 4 | 0 | 13 |
| **Total rows** | **21** | **21** | **18** | **19** | **18** | **18** | **21** | **136** |

