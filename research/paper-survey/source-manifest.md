# Typodeck Paper Survey — Source Manifest (Stage-1)

> Every PDF below is stored under `research/paper-survey/sources/`.
> sha256 and page counts were computed locally on 2026-11-02 (`shasum -a 256`, `pdfinfo`).
> Titles/authors/venues follow the Wave-1 PDF-verified English surveys in this folder.
> Retrieval date for all entries: **2026-11-02**.

## P1 — 01-pptbench-2025.pdf

- **Title:** PPTBench: Towards Holistic Evaluation of Large Language Models for PowerPoint Layout and Design Understanding
- **Authors:** Zheng Huang, Xukai Liu, Tianyu Hu, Kai Zhang, Ye Liu
- **Year/venue (verified):** 2025, arXiv preprint (no conference/journal stated; v1 basis)
- **arXiv/DOI:** arXiv:2512.02624v1 [cs.CV]; DOI not in source
- **Publisher URL:** https://arxiv.org/abs/2512.02624
- **PDF URL actually used:** https://arxiv.org/pdf/2512.02624
- **sha256:** `9a5532cd7e1bdca4e9e55f31484e24e868f2fa5118de73f3f06ac833af63580d`
- **Pages:** 19 (pdfinfo; 5,516,811 bytes)
- **License:** Not stated in source (Abstract: "All datasets and code are fully released", code at https://github.com/Gastronomicluna/PPTBench-Eval)
- **Retrieval date:** 2026-11-02

## P2 — 02-umsi-visual-importance.pdf

- **Title:** Predicting Visual Importance Across Graphic Design Types
- **Authors:** Camilo Fosco, Vincent Casser, Amish Kumar Bedi, Peter O'Donovan, Aaron Hertzmann, Zoya Bylinskii
- **Year/venue (verified):** 2020, ACM UIST 2020 (author's preprint copy; "not the official ACM published version")
- **arXiv/DOI:** arXiv:2008.02912v1 [cs.CV], 7 Aug 2020; DOI not in source
- **Publisher URL:** https://arxiv.org/abs/2008.02912 (ACM published version exists; exact ACM DL URL not in source)
- **PDF URL actually used:** arXiv PDF of 2008.02912v1 (via curl fallback after truncated fetch)
- **sha256:** `dd800947f37bb8f60c1b3d1d59b86ae842706e48e4cb804d9498811e20989278`
- **Pages:** 12 (pdfinfo; 14,771,083 bytes)
- **License:** Not stated in source (model/code/dataset at http://predimportance.mit.edu; verify before production use)
- **Retrieval date:** 2026-11-02

## P3 — 03-slidecoder.pdf

- **Title:** SlideCoder: Layout-aware RAG-enhanced Hierarchical Slide Generation from Design
- **Authors:** Wenxin Tang, Jingyu Xiao (co-first), Wenxuan Jiang, Xi Xiao, Yuhang Wang, Xuxin Tang, Qing Li, Yuehe Ma, Junliang Liu, Shisong Tang, Michael R. Lyu
- **Year/venue (verified):** 2025, arXiv preprint (v1 2025-06-09, cs.CV; no venue marking in source — task brief mentions EMNLP 2025, unverified)
- **arXiv/DOI:** arXiv:2506.07964; DOI not in source
- **Publisher URL:** https://arxiv.org/abs/2506.07964
- **PDF URL actually used:** https://arxiv.org/pdf/2506.07964v1 (via curl after truncated fetch)
- **sha256:** `aa58d2de24373d94e60aa114fb87921675c281b3ea9fa5b4d3e2d7822f36fcc6`
- **Pages:** 19 (pdfinfo; 5,903,840 bytes)
- **License:** Not stated in source (code at https://github.com/vinsontang1/SlideCoder)
- **Retrieval date:** 2026-11-02

## P4 — 04-pptagent-ppteval.pdf

- **Title:** PPTAgent: Generating and Evaluating Presentations Beyond Text-to-Slides
- **Authors (ACL verified):** Hao Zheng, Xinyan Guan (equal contribution), Hao Kong, Wenkai Zhang, Jia Zheng, Weixiang Zhou, Hongyu Lin, Yaojie Lu, Xianpei Han, Le Sun (ACL adds Wenkai Zhang, drops Ben He vs. arXiv list)
- **Year/venue (verified):** 2025, EMNLP 2025 (Main), pp. 14402–14418
- **arXiv/DOI:** arXiv:2501.03936 (fallback/unverified reading basis v3); DOI not in source
- **Publisher URL:** https://aclanthology.org/2025.emnlp-main.728/ (orchestrator-supplied from task brief; consistent with pp. 14402–14418 proceedings PDF)
- **PDF URL actually used:** https://aclanthology.org/2025.emnlp-main.728.pdf (orchestrator-supplied from task brief; local sha256 verified above)
- **sha256:** `5fb9c54cd763a9748a8aff5161833fc1b815a3099d2c083b2ce96db3514bd31a`
- **Pages:** 17 (pdfinfo; 6,408,473 bytes)
- **License:** CC BY 4.0 stated on arXiv HTML listing (tmp §0); ACL-version license text not verified
- **Retrieval date:** 2026-11-02

## P5 — 05-lecslides-slideparser.pdf

- **Title:** Towards Comprehensive Lecture Slides Understanding: Large-scale Dataset and Effective Method
- **Authors:** Enming Zhang, Yuzhe Li, Yuliang Liu, Yingying Zhu (corresponding), Xiang Bai
- **Year/venue (verified):** 2025, ICCV 2025 (IEEE/CVF; CVF Open Access version, pp. 4455–4464)
- **arXiv/DOI:** Neither in source
- **Publisher URL:** http://openaccess.thecvf.com/content/ICCV2025/html/Zhang_Towards_Comprehensive_Lecture_Slides_Understanding_Large-scale_Dataset_and_Effective_Method_ICCV_2025_paper.html (orchestrator-supplied; corroborated: same-URL download in prior session produced identical sha256/size)
- **PDF URL actually used:** http://openaccess.thecvf.com/content/ICCV2025/papers/Zhang_Towards_Comprehensive_Lecture_Slides_Understanding_Large-scale_Dataset_and_Effective_Method_ICCV_2025_paper.pdf (orchestrator-supplied; identical bytes to prior-session download)
- **sha256:** `07110f4220048a1c6b6ff25fc0e0d397762e76d0323c80262e30caab03e4b552`
- **Pages:** 10 (pdfinfo; 3,323,914 bytes)
- **License:** Not stated in source (Slideshare-crawl redistribution/commercial terms NOT IN SOURCE; dataset/code at https://github.com/zamling/LecSlides_370K)
- **Retrieval date:** 2026-11-02

## P6 — 06-colpali.pdf

- **Title:** ColPali: Efficient Document Retrieval with Vision Language Models
- **Authors:** Manuel Faysse, Hugues Sibille, Tony Wu (all three equal-contribution ∗), Bilel Omrani, Gautier Viaud, Céline Hudelot, Pierre Colombo
- **Year/venue (verified):** 2025, ICLR 2025 conference paper (header on every PDF page); arXiv:2407.01449v6 [cs.IR], 28 Feb 2025
- **arXiv/DOI:** arXiv:2407.01449v6; DOI not in source
- **Publisher URL:** https://arxiv.org/abs/2407.01449 (ICLR venue confirmed via PDF header, not via HTML)
- **PDF URL actually used:** https://arxiv.org/pdf/2407.01449v6 (via curl after truncated fetch)
- **sha256:** `852ec724f3d48316265611579f4c556a14fea24f29360b5929d02e4604662631`
- **Pages:** 26 (pdfinfo; 8,260,302 bytes)
- **License:** MIT — training data, model checkpoints (adapters), entire codebase, and evaluation benchmark (Reproducibility Statement); hub at https://hf.co/vidore
- **Retrieval date:** 2026-11-02

## P7 — 07-pptbench-2026.pdf

- **Title:** PPTBench: Can Coding Agents Reconstruct the Visual World through Structured, Editable Slides?
- **Authors:** Xiaoqiu Wang, Yizhe Chi, Wenyi Li (equal contribution), Deyao Hong, Zhihan Shan, Mingju Gao, Kaisen Yang, Youjie Zheng, Calvin Xiao, Qinhuai Na (corresponding)
- **Year/venue (verified):** 2026, arXiv preprint (v2 2026-09-28, cs.CL; no venue stated)
- **arXiv/DOI:** arXiv:2609.29718v2; DOI not in source
- **Publisher URL:** https://arxiv.org/abs/2609.29718
- **PDF URL actually used:** arXiv PDF of 2609.29718 (via curl after truncated fetch)
- **sha256:** `b7cf50c4c8f556f3506da41a1ca81b372c9b3797df8b6713a9b2d5302de98d64`
- **Pages:** 32 (pdfinfo; 5,641,908 bytes)
- **License:** CC BY 4.0 (arXiv HTML listing; not stated in the PDF). Project page: https://lab.einsia.ai/pptbench
- **Retrieval date:** 2026-11-02
