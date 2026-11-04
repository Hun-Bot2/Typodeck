# Typodeck 논문 서베이 (임시 폴더)

> 목적: Typodeck 논문에서 "이런 논문들을 참고했고, HCI적으로 이렇게 고려했다"를 주장하기 위한 근거 정리.
> 상태: 임시 작업 폴더(`research/paper-survey-tmp/`). 논문 집필 시 `docs/` 정식 문서로 승격 예정.
> 작성: 2026-11-02. 원문 판독 기준 정리이며, 수치 인용 전 원 PDF 대조 필요(각 파일 §미기재 목록 참조).

## 논문 7편 (존재 확인 완료)

| # | 파일 | 논문 | 발표처 | 핵심 수치 |
|---|------|------|--------|-----------|
| 1 | [01-pptbench-2025.md](01-pptbench-2025.md) | PPTBench: Holistic Eval for PPT Layout/Design | arXiv 2025 (2512.02624) | 958 PPTX·4,439샘플·4카테고리·17 API |
| 2 | [02-umsi-visual-importance.md](02-umsi-visual-importance.md) | Predicting Visual Importance (UMSI+Imp1k) | UIST 2020 | Imp1k 1000개·6클래스·중요도조정 87% |
| 3 | [03-slidecoder.md](03-slidecoder.md) | SlideCoder: Layout-aware RAG Hierarchical Generation | EMNLP 2025 | +40.5점·실행률+38%p·SCM r=0.873 |
| 4 | [04-pptagent-ppteval.md](04-pptagent-ppteval.md) | PPTAgent + PPTEval | EMNLP 2025 | Pearson 0.71·κ 0.59·성공률 95% |
| 5 | [05-lecslides-slideparser.md](05-lecslides-slideparser.md) | LecSlides-370K + SlideParser | ICCV 2025 | 25,542강의·370,078슬라이드·15영역 |
| 6 | [06-colpali.md](06-colpali.md) | ColPali + ViDoRe | ICLR 2025 | 검색용. 유사도≠품질 |
| 7 | [07-pptbench-2026.md](07-pptbench-2026.md) | PPTBench: Coding Agents Visual Coding | arXiv 2026 (2609.29718) | 500과제·최고77.34/중앙24.38·통과31.7% |

주의: 1번(2025, Huang et al.)과 7번(2026, Wang et al.)은 제목만 같고 완전히 다른 연구.

## 공통 구조 (파일당 §0–§8)

- §0 서지 정보 / §1 한눈 요약 / §2 연구 문제·배경 / §3 핵심 기여
- §4 방법론 상세 / §5 실험 결과 상세 / §6 한계·후속 과제
- §7 Typodeck 관련성 (직접 연결점·활용 아이디어·주의점)
- §8 인용 포인트 3개 (Typodeck 논문용 주장 + 원문 근거)

예외: 06번은 §9 관련성·§10 인용·§11 수치일람·§12 미기재목록. 03번 §7.2-끝·§7.3·§8은 절단 보완(표기 있음).

## 파생 문서

- [08-ADR-mapping.md](08-ADR-mapping.md): 논문↔ADR 매핑 (정방향·역방향·갭/신규 ADR 후보)
- [09-HCI-reinterpretation-draft.md](09-HCI-reinterpretation-draft.md): Typodeck 논문용 재해석 초안 (테제·논문별 재해석·HCI 고려·실험 제안)

## 원문 출처

- 1,2,3,4,6,7번: arXiv HTML 전문 판독. 4번 arXiv:2501.03936, 6번 arXiv:2407.01449.
- 5번: ICCV Open Access PDF + pdftotext 추출본 판독, GitHub/HF 보조.
- HTML 변환 손실(표 행라벨·그림 수치)은 각 파일에 '원문 미기재'로 표기. 논문 인용 전 원 PDF 대조 필수.
