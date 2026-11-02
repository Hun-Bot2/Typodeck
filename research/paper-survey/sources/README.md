# Paper source PDFs (local working copies, NOT committed)

Seven publisher/arXiv PDFs verified during Stage 1 (~49 MB total).
They are git-ignored; re-fetch from the URLs in
[`../source-manifest.md`](../source-manifest.md) and confirm the
recorded sha256 hashes:

```sh
cd research/paper-survey/sources
curl -L -o 01-pptbench-2025.pdf https://arxiv.org/pdf/2512.02624
curl -L -o 02-umsi-visual-importance.pdf https://arxiv.org/pdf/2008.02912
curl -L -o 03-slidecoder.pdf https://arxiv.org/pdf/2506.07964
curl -L -o 04-pptagent-ppteval.pdf https://aclanthology.org/2025.emnlp-main.728.pdf
curl -L -o 05-lecslides-slideparser.pdf http://openaccess.thecvf.com/content/ICCV2025/papers/Zhang_Towards_Comprehensive_Lecture_Slides_Understanding_Large-scale_Dataset_and_Effective_Method_ICCV_2025_paper.pdf
curl -L -o 06-colpali.pdf https://arxiv.org/pdf/2407.01449v6
curl -L -o 07-pptbench-2026.pdf https://arxiv.org/pdf/2609.29718
shasum -a 256 *.pdf  # compare with source-manifest.md
```

Do not copy paper figures into the repo (see Stage-1 report).
