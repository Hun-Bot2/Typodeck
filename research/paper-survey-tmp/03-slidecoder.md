# SlideCoder 논문 전문 정리 (Typodeck용)

## 0. 서지 정보

- **제목**: SlideCoder: Layout-aware RAG-enhanced Hierarchical Slide Generation from Design
- **저자**: Wenxin Tang†, Jingyu Xiao†(† 공동1저자), Wenxuan Jiang, Xi Xiao, Yuhang Wang, Xuxin Tang, Qing Li, Yuehe Ma, Junliang Liu, Shisong Tang, Michael R. Lyu
- **소속**: 칭화대(Tsinghua), 홍콩중문대(CUHK), 노스이스턴대, 사우스웨스트대, Kuaishou Technology, Peng Cheng Laboratory, BNU-HKBU UIC, Dalian Maritime Univ.
- **발표처/연도**: arXiv cs.CV, v1 2025-06-09. 과제 지시문에는 EMNLP 2025 표기이나, **원문 텍스트 내 게재지 표기는 없음(원문 미기재)**. arXiv 카테고리는 cs.CV.
- **arXiv 링크**: https://arxiv.org/abs/2506.07964 (원문의 Back-to-abstract/PDF 링크 기준, PDF: /pdf/2506.07964v1)
- **DOI**: 원문 미기재.
- **코드**: https://github.com/vinsontang1/SlideCoder (Abstract 명시)
- **데이터**: Slide2Code 벤치마크 300샘플(난이도별 100개씩). Zenodo10k(약 32,000개 샘플링) + SLIDEBENCH를 모집단으로 구성. 별도 데이터 다운로드 링크는 원문 미기재(코드 저장소에 있다고 추측되나 원문 미기재).

---

## 1. 한눈 요약

1. 이 논문은 자연어(NL) 대신 **참조 이미지(Reference Image, RI)로부터 편집 가능한 PPTX 생성 코드를 만드는 "Reference Image to Slide Generation" 과제**를 정식 정의한다.
2. 슬라이드 난이도를 정량화하는 **Tri-Metric Slide Complexity Metric(SCM)** 을 제안하고, 이에 기반한 최초의 난이도 티어 벤치마크 **Slide2Code(300개)** 를 구축한다.
3. 색상 그라디언트 기반 재귀 분할(**CGSeg**), 3-에이전트(**Describer→Coder→Assembler**) 구조, 2단계 지식베이스의 **계층적 RAG(H-RAG)**, 위치 정보를 주입하는 **Layout-aware Prompt**를 결합한 프레임워크 **SlideCoder**를 제안한다.
4. python-pptx 역공학(reverse-engineering) 도구를 새로 만들어 학습 데이터를 개선하고, Qwen2.5-VL-7B-Instruct 기반 **SlideMaster(7B, LoRA)** 를 파인튜닝해 GPT-4o급에 근접시켰다.
5. Slide2Code에서 SlideCoder는 최강 베이스라인 대비 Overall 기준 simple **+40.5점**, medium **+34.0점**, complex **+29.9점**을 달성하고, 실행 성공률은 난이도별 각각 **+38%p, +32%p, +27%p**를 기록한다.

---

## 2. 연구 문제와 배경

### 2.1 해결하려는 문제: Reference Image to Slide Generation

- **입력**: 슬라이드 참조 이미지 I₀(편집 불가한 png/pdf 슬라이드, 웹페이지 디자인 등).
- **출력**: python-pptx 기반 Python 실행 코드 Cg. 실행하면 새 슬라이드 파일 Fg와 렌더 이미지 Ig가 생성됨.
- **평가**: 원본 코드 C₀가 없으므로, (I₀, F₀) 쌍과 (Ig, Fg) 쌍을 비교해 프레임워크 G와 MLLM M의 성능을 측정(§3.1).
- **사용 시나리오**(§1, Figure 1 서술):
  (a) 사용자가 좋은 디자인을 보고 편집 가능한 pptx로 바꾸고 싶을 때.
  (b) 슬라이드 제작 기술이 없는 사용자가 디자인 이미지를 입력해 슬라이드를 만들 때.
- **가정(중요)**: 사용자 입력은 "Design"(디자인 레이아웃)과 "Pictures"(삽입용 그림/배경 이미지)가 **분리되어 제공**된다고 가정(§4 서두, Limitations에서 명시적 한계로 재언급).

### 2.2 기존 NL 기반 생성의 한계 (원문 근거)

논문은 AutoPresent(Ge et al. 2025, SLIDESBENCH 기반 LLaMA 파인튜닝 + SLIDESLIB 고수준 API)를 직접 겨냥하며 세 가지 한계를 제시한다(§1).

1. **자연어의 표현력 한계**
   - NL은 색상·레이아웃·스타일 같은 시각 디자인을 정확히 기술할 수 없음.
   - 사용자는 때로는 디자인 이미지를 직접 입력하길 원함.
2. **복잡 슬라이드에 대한 MLLM 실패 유형 3종**(Figure 1 분류)
   - **miss**: 시각/텍스트 요소의 완전 누락(예: 좌상단 도형 누락).
   - **incorrect**: 스타일·속성 편차(예: 제목이 bold가 아님).
   - **disorder**: 공간 배치·정렬 불일치(예: 3개 부제목 위치/정렬 오류).
   - 원인으로 다양한 요소 타입과 높은 요소 밀도를 지목.
3. **python-pptx 이해 부족 → 실행 불가 코드**
   - MLLM이 python-pptx를 잘 몰라 구문적으로 유효하지 않거나 실행 안 되는 코드를 생성.
   - AutoPresent의 SLIDESLIB은 이를 고수준 API 5종으로 우회하지만, 그 대가로 **유연성과 포괄성을 제한**하고 결과물이 지나치게 단순해짐.
   - 본 논문 역공학 분석 기준 AutoPresent 도구는 객체 타입 5종·스타일 16종만 지원(§5.3, Table 2).

### 2.3 관련연구 위치(§2)

- **2.1 MLLM 코드 생성**: UI 코드 생성(Interaction2Code, DesignBench, MRWeb, Web2Code), SVG 코드 생성(StarVector, Chat2SVG, SVGEditBench), 시각 프로그래밍 문제(MMCode, HumanEval-V 등). MLLM이 plug-and-play 수준이 아니고 미세 오류를 내며, 코드 수리(code repair) 연구 흐름이 있음을 정리.
- **2.2 슬라이드 생성·이해**: 기존은 문서→슬라이드 내용 추출 중심(Doc2PPT, PPSGen, SlideSeer). LLM 이후 PPTAgent(Zheng et al. 2025, 템플릿+텍스트 기반), AutoPresent(NL→슬라이드 코드). 단 AutoPresent는 coarse-grained NL 서술과 naive agent 설계 때문에 품질이 제한된다고 비판.

---

## 3. 핵심 기여

1. **신규 과제 정의 + SCM + Slide2Code 벤치마크**: Reference Image to Slide Generation 과제를 정의하고, Tri-Metric Slide Complexity Metric(SCM)을 제안한 뒤, 이에 기반한 최초의 난이도별 벤치마크 Slide2Code(300샘플, simple/medium/complex 각 100개)를 구축.
2. **SlideCoder 프레임워크**: Color Gradients-based Segmentation(CGSeg) + Layout-aware Prompt + Hierarchical RAG 기반 코드 생성(H-RAG) 결합. 복잡 슬라이드 이해와 python-pptx 라이브러리 이해를 동시에 강화.
3. **SlideMaster 7B + 역공학 도구**: 적용 범위가 넓은 PPTX 역공학 도구를 새로 구축해 고품질 학습 데이터를 만들고, Qwen2.5-VL-7B-Instruct 기반 SlideMaster를 LoRA 파인튜닝. GPT-4o 성능에 근접하는 오픈소스 모델 확보.

---

## 4. 방법론 상세

### 4.1 전체 구조(§4, Figure 3)

SlideCoder는 참조 이미지(RI) → 실행 가능한 Python 슬라이드 코드의 end-to-end 프레임워크이며 3개 핵심 모듈 + 파인튜닝 모델로 구성된다.

1. **CGSeg**: 입력 Design을 의미 단위 블록(region)으로 분할.
2. **H-RAG 코드 생성 모듈**: 3개 협력 에이전트(Describer, Coder, Assembler)가 코드 생성.
3. **Layout-aware Prompt**: Assembler가 공간 일관성과 구문 정확성을 확보하도록 위치·문법 정보를 주입.
4. **SlideMaster**: 위 프레임워크 위에서 동작하는 파인튜닝 7B 오픈소스 모델.

데이터 흐름:

```text
Design(이미지) + Pictures(이미지 자원)
  → CGSeg: 블록 분할 (sub-image Im + 위치 pm)
  → Describer: Overall Description + Block Description 생성
  → Coder: 블록별 Code Snippets 생성
  → Assembler + Layout-aware Prompt: 전체 코드 조립
  → 실행 → Fg(슬라이드) / Ig(렌더 이미지)
  → 실행 실패 시 self-refinement (최대 3회)
```

실패 처리(§5.1): Coder가 최대 시도 후에도 실행 코드를 못 만들면 해당 블록 폐기. Assembler 실패 시 해당 샘플은 execution failure로 기록.

### 4.2 Slide2Code 벤치마크 과제 정의(§3.1)

- 기호: I₀=참조 이미지, F₀=원본 슬라이드 파일, G=생성 프레임워크, M=MLLM.
- 생성 코드: Cg = G_M(I₀). 실행 결과: Fg, 렌더 이미지 Ig.
- 원본 코드 C₀는 이용 불가 → (I₀, F₀) vs (Ig, Fg) 비교 평가.
- 각 인스턴스는 참조 슬라이드 이미지 + 대응 PPTX 슬라이드로 구성.
- 목적: 서로 다른 MLLM 백본을 복잡도별로 비교.

### 4.3 Slide Complexity Metric(SCM, §3.2)

#### 4.3.1 설계 동기

- 시각적 외관과 제작 난이도가 불일치하는 문제를 지적. 예: 시각적으로 복잡한 이미지 삽입도 실제 조작은 최소일 수 있음.
- 그래서 **제작 난이도(production difficulty)** 와 **시각 복잡도(visual complexity)** 를 함께 반영하는 Tri-Metric을 설계.

#### 4.3.2 세 가지 원시 지표

샘플 i에 대해:

1. **c_i**: 요소 개수(element count). 조작 비용 반영.
2. **e_i**: 서로 다른 요소 타입 수(element type count). 예: textbox, placeholder. 조작 비용 반영.
3. **v_i**: Element Coverage Ratio. CGSeg(§4.1)로 계산한 "활성화된 컬러 그리드 수 / 전체 그리드 수". 시각적 풍부함(visual richness) 반영.

#### 4.3.3 정규화와 가중 집계(계산식)

원문의 수식을 그대로 옮기면:

- 각 원시 점수 x_i ∈ {c_i, e_i, v_i}를 아래처럼 정규화:

```text
x̃_i = σ((x_i − μ) / (√σ² + ε))
```

- μ, σ²: 집합 Y = {1, 2, 3, ..., N} 전체 샘플에 대한 평균·분산.
- σ(·): sigmoid 함수(Han and Moraga 1995 인용).
- ε: 수치 안정용 작은 상수(구체값 원문 미기재).

- 최종 복잡도 점수:

```text
z_i = α·c̃_i + β·ẽ_i + γ·ṽ_i
```

- 조건: α + β + γ = 1.
- α, β, γ는 제작 노력과 시각 복잡도의 중요도를 반영하는 가중치.
- **가중치 구체값은 원문 미기재.**

#### 4.3.4 인간 판단과의 일치(§5.4)

- Slide2Code에서 100개 무작위 추출, 박사과정 4명을 주석자로 각 50개씩 평가.
- 평가 차원: shape 수, shape 타입 다양성, element coverage 수준. 0~100점. 프로토콜은 Appendix D(Figure 6, 이미지라 텍스트 미포함).
- 각 슬라이드를 2명이 독립 평가 후 평균.
- Pearson r = **0.873**, p = **2.776×10⁻³²**. 강한 정적 상관.
- ICC = **0.726**, p = **1.186×10⁻³¹**. 상당한 일치.
- 결론: SCM은 인간의 복잡도 판단과 잘 맞는 객관 지표.

### 4.4 데이터 수집(§3.3)

- 모집단 Y 구성:
  - Zenodo10k(Zheng et al. 2025, 최대 공개 슬라이드 데이터셋)에서 약 **32,000개** 무작위 샘플링.
  - 다양성과 비교 분석을 위해 **SLIDEBENCH 샘플도 Y에 추가**(추가 개수 원문 미기재).
- 전체 Y에 대해 정규화 복잡도 z 계산.
- **KMeans로 3개 클러스터** 생성 → 클러스터 중심을 z 순서로 정렬해 simple/medium/complex 레벨 정의.
- 각 클러스터에서 **100개씩 무작위 추출 → 최종 Slide2Code 300개**.
- Figure 2 분석: Zenodo10k와 SLIDEBENCH는 simple/medium 편중이 심한 반면, Slide2Code는 3레벨 균형 구성이라 복잡도별 공정한 평가 가능.

### 4.5 Color Gradient-based Segmentation(CGSeg, §4.1)

#### 4.5.1 목적

- MLLM이 복잡한 슬라이드 디자인을 이해하는 난이도를 낮추기 위해, 슬라이드 이미지를 블록으로 재귀 분할.

#### 4.5.2 알고리즘 단계(Algorithm 1)

입력: 이미지 I, 그리드 크기 g, 현재 깊이 D, 최대 깊이 Dmax, 임계값 T.
출력: 분할된 sub-image 리스트.

1. **종료 조건**: D = Dmax이면 ∅ 반환(lines 1–3). Dmax·g·T 구체값은 원문 미기재.
2. **그리드 분할**: I를 g×g 그리드 블록 G로 분할(line 4).
3. **그라디언트 크기 계산**: 각 블록의 Sobel magnitude를 구해 색상 그라디언트 강도 측정(line 5).
4. **중앙값 기준 활성화**: 전체 블록 그라디언트의 중앙값 Cmid를 구하고, c_ij > T·Cmid인 블록을 활성화(M_ij=1), 아니면 0(lines 6–14).
5. **Flood-fill**: 이진 활성화 마스크 M에 flood-fill(Burtsev and Kuzmin 1993)을 적용해 시각적으로 일관된 연결 영역을 그룹화(line 15).
6. **연결 영역 분리**: 연결 영역들을 분리해 sub-image 후보로 추출(line 16).
7. **Crop + 위치 저장**: 각 영역 m에서 sub-image I_m과 위치 정보 p_m을 crop해 결과 집합 R에 추가(lines 19–20).
8. **재귀 분할**: 각 I_m에 대해 CGSeg(I_m, g, D+1, Dmax, T)를 재귀 호출하고 결과를 R에 합침(lines 21–22). 지역 시각 복잡도에 따라 분할 granularity를 적응적으로 정교화.
9. 최종 R 반환.

Figure 4 대응:
- (a) 입력 이미지 → (b) 활성화 그리드 블록 → (c) flood-fill 영역 → (d) 재귀 분할 최종 결과.

#### 4.5.3 SCM과의 연결

- SCM의 v_i(Element Coverage Ratio)는 바로 이 CGSeg의 활성화 그리드 비율로 계산됨(§3.2). 즉 CGSeg는 분할기와 복잡도 측정기의 이중 역할을 함.

### 4.6 Hierarchical RAG 코드 생성 모듈(§4.2)

#### 4.6.1 세 에이전트의 역할(§4.2.1)

1. **Describer**: 전체 Design 서술(Overall Description) + 각 분할 블록 서술(Block Description) 생성.
2. **Coder**: 블록과 블록 서술을 입력받아 대응 코드 스니펫 생성.
3. **Assembler**: Layout-aware Prompt(§4.3)로 코드 스니펫들을 조립해 최종 슬라이드 코드 생성. Pictures 자원도 함께 사용. 실행 결과물이 RI와 구조·시각적으로 정렬되도록 함.
4. **Self-refinement**: 생성 코드가 실행 불가면 오류를 피드백으로 MLLM이 코드 재생성. Coder·Assembler 모두 최대 3회(§5.1, Ge et al. 2025와 동일).

각 에이전트는 역할에 따라 서로 다른 지식베이스에서 지식을 가져다 프롬프트에 사용(§4.2.1 후반).

#### 4.6.2 H-RAG의 2단계 지식베이스(§4.2.2)

1. **상위: Shape Type Knowledge Base(TS-KB)**
   - python-pptx 문서의 객체(object) 서술을 포함.
   - Describer에서 표준화된 서술 생성을 유도. 예: "This autoshape includes a textbox…"에서 autoshape·textbox 모두 문서의 객체명.
   - 크기가 작아(원문: "Given the size…", 문맥상 충분히 작다는 의미) **전체 엔트리를 Describer에 삽입**해 타입 커버리지 완전 보장.
2. **하위: Operation Function Knowledge Base(OF-KB)**
   - 전체 구문 명세(파라미터, 반환값 등) 포함.
   - 구조 상세는 Appendix F. 예시: 함수명·파라미터·반환값·사용 예·텍스트 설명(Figure 10, 11 언급이나 이미지라 본문 텍스트 미포함).

#### 4.6.3 검색 방식

- **BGE M3-Embedding**(Chen et al. 2024)으로 엔트리 임베딩 → 벡터 검색 DB 구축.
- 프롬프트 p의 벡터 q_p와 각 엔트리 키 k_i의 코사인 유사도 cos(q_p, k_i)로 매칭.
- 상위 k개 관련 엔트리를 p에 삽입. **k값 원문 미기재.**
- 계층적 파이프라인:
  - Describer: TS-KB에서 객체 타입을 검색 → 블록 이미지 요소 식별 → 표준화 서술 출력.
  - Coder: 그 서술로 OF-KB 조회 → 코드 스니펫 생성.
  - Assembler: 스니펫으로 전체 구문 패턴 검색 → 실행 가능 코드 생성.

### 4.7 Layout-aware Prompt(§4.3)

Assembler 조립 프롬프트의 요구사항 2가지:

1. 각 블록이 최종 슬라이드의 정확한 위치에 나타나야 함.
2. 병합 코드의 구문 오류를 피하고 코드 컨텍스트 일관성을 유지해야 함.

구성:

- **위치 주입**: CGSeg에서 추출한 Position <x,y,w,h>를 python-pptx 표준 위치 단위(**inches**)로 주입. Design 해상도와 실제 슬라이드 크기가 다르므로 **비례 스케일링**으로 슬라이드 좌표에 매핑 → <Position*>.
- **문법 주입**: H-RAG 지식베이스에서 검색한 구문 패턴 <Grammar>을 주입해 구문 오류·코드 충돌 방지.
- 최종 프롬프트 = <Design>(참조 이미지) + <Overall description>(전체 서술) + <Code Snippets>(Coder의 부분 코드) + <Position*>(레이아웃 표현) + <Grammar>(구문 패턴)를 사전 정의 템플릿에 통합.
- 템플릿 전문은 Appendix E(Figure 7/8/9 이미지, 텍스트 미포함).

### 4.8 SlideMaster 7B 파인튜닝 + 역공학 데이터(§4.4, §5.3, Appendix B/C)

#### 4.8.1 학습 데이터

- SLIDESBENCH 학습셋 기반 (RI, instruction, program) 트리플 구성.
- Ge et al.(2025)의 역공학 도구는 제한된 슬라이드 스타일에만 라벨(Python 코드) 생성 → 학습 데이터 품질 저하.
- 이를 완화하려고 **더 넓은 스타일 범위를 처리하는 새 역공학 도구** 개발 → 라벨 품질 향상.

#### 4.8.2 역공학 도구 지원 범위(§5.3 Table 2, Appendix B Table 5/6)

| 타입 | Ours 스타일 수 | AutoPresent 스타일 수 |
|---|---|---|
| title | 10 | 3 |
| textbox | 10 | 5 |
| bullet points | 8 | 5 |
| background color | 1 | 1 |
| image | 2 | 2 |
| placeholder | 4 | – (미지원) |
| freeform | 2 | – |
| connector | 5 | – |
| table | 4 | – |
| triangle | 5 | – |

- 합계: Ours는 **객체 타입 10종·스타일 44종**, AutoPresent는 **5종·16종**.
- Appendix B Table 5(Ours) 세부 스타일:
  - textbox: Position, Text frame margin, Alignment, Paragraph spacing, Font style, Fill color, Font size, Bold, Italic, Underline
  - rectangle: Position, Line color, Line width, Fill color (Table 2의 title 행과 명칭이 다소 불일치. 원문 그대로 기재)
  - object_placeholder: Position, Fill color, Object position
  - freeform: Position, Fill color
  - bullet_points: Position, Item content, Font size, Font color, Fill color, Bold, Italic, Underline
  - image: Position, Image path
  - background_color: Color
  - connector: Start position, End position, Arrow color, Arrow width, Arrow style
  - table: Position, Cell height, Cell fill color, Text inside cell
  - triangle: Position, Type, Line color, Line width, Fill color
- Appendix B Table 6(AutoPresent) 세부:
  - title: Font size, Font color, Fill color
  - textbox: Position, Font size, Bold, Font color, Fill color
  - bullet_points: Position, Item content, Font size, Font color, Fill color
  - image: Position, Image path
  - background color: Color

#### 4.8.3 역공학 품질 정량 평가(§5.3)

두 지표로 Ours vs Ge et al.(2025) 비교:

1. **Reconstruction Ratio**(역공학 코드로 재구성한 슬라이드의 shape 수 / 원본 shape 수):
   - Ours **90.38%** vs AutoPresent **65.67%**.
2. **CLIP Score**(역공학 슬라이드의 시각·스타일 보존도):
   - Ours **88.66%** vs AutoPresent **69.87%**.

#### 4.8.4 SlideMaster 파인튜닝 설정

- 베이스: **Qwen2.5-VL-7B-Instruct**(Bai et al. 2025). §4 서두·기여 서술에는 "Qwen-VL-7B"/"Qwen2.5-VL" 표기가 혼재하나, §4.4와 §5.1의 정식 표기는 Qwen2.5-VL-7B-Instruct.
- 방식: **LoRA**(Hu et al. 2022).
- Appendix C Table 7 하이퍼파라미터:
  - Rank 8, Max Sequence Length 4096, Batch Size 4, Gradient Accumulation Steps 8, Learning rate 1e-4, Epochs 10, Warmup Ratio 0.1, Mixed Precision bf16.
- 학습 데이터 규모(트리플 개수)는 원문 미기재.

---

## 5. 실험 결과 상세

### 5.1 실험 설정(§5.1)

- **백본**: GPT-4o(버전 20241120, 공식 API), Gemini-2.0-flash(2025년 5월 접근, 공식 API), SlideMaster(Qwen2.5-VL-7B-Instruct 기반 파인튜닝).
- **생성 설정**: 최대 토큰 4096, temperature 0.
- **Self-refinement**: Coder·Assembler 각 최대 3회. 첫 성공 시도를 출력으로 채택.
- **평가 지표 4종**(§3.1 기호 사용):
  1. **Global Visual Metrics**: 원본 이미지 I₀ vs 생성 이미지 Ig의 **CLIP**(Hessel et al. 2021), **SSIM**(Nilsson and Akenine-Möller 2020).
  2. **Local Structural Metrics**: 원본 파일 F₀ vs 생성 파일 Fg의 **content similarity**, **position similarity**(Ge et al. 2025 방식).
  3. **Execution**: Cg 무오류 실행 성공률.
  4. **Overall Score**: 전 샘플·전 지표 평균. 실행 실패는 0점 처리.

### 5.2 주요 정량 결과(Table 1, §5.2)

Table 1 상단=Slide2Code(난이도별), 하단=SLIDESBENCH. 아래에 핵심 수치를 재구성한다. (원문 테이블 파싱 순서: Execution% / Content / Position / Clip / SSIM / Overall)

#### 5.2.1 Slide2Code — Simple 레벨

| Framework | Backbone | Exec% | Content | Position | CLIP | SSIM | Overall |
|---|---|---|---|---|---|---|---|
| AutoPresent | AutoPresent | 61.0 | 92.7 | 78.9 | 70.8 | 80.3 | 48.6 |
| AutoPresent | Gemini2.0-flash | 57.0 | 91.4 | 78.3 | 69.7 | 79.0 | 44.8 |
| AutoPresent | GPT-4o | 58.0 | 92.7 | 80.9 | 68.8 | 75.6 | 45.4 |
| SlideCoder | SlideMaster | 86.0 | 92.4 | 87.4 | 77.6 | 91.1 | 76.7 |
| SlideCoder | Gemini2.0-flash | 97.0 | 94.5 | 88.6 | 81.3 | 90.7 | 87.0 |
| SlideCoder | GPT-4o | 99.0 | 96.3 | 88.1 | 79.8 | 91.8 | **89.1** |

- 최강 베이스라인 Overall 48.6(AutoPresent) → SlideCoder+GPT-4o 89.1. 차이 **+40.5점**(원문 보고와 일치).
- 실행률: 61.0 → 99.0, 차이 **+38%p**(원문 보고와 일치).

#### 5.2.2 Slide2Code — Medium 레벨

| Framework | Backbone | Exec% | Content | Position | CLIP | SSIM | Overall |
|---|---|---|---|---|---|---|---|
| AutoPresent | AutoPresent | 53.0 | 89.6 | 77.3 | 69.2 | 79.1 | 41.4 |
| AutoPresent | Gemini2.0-flash | 68.0 | 88.7 | 79.9 | 66.3 | 71.6 | 51.5 |
| AutoPresent | GPT-4o | 50.0 | 92.3 | 74.6 | 67.6 | 72.6 | 36.8 |
| SlideCoder | SlideMaster | 75.0 | 84.7 | 79.8 | 75.4 | 86.4 | 61.7 |
| SlideCoder | Gemini2.0-flash | 90.0 | 90.9 | 84.6 | 82.3 | 85.5 | 76.6 |
| SlideCoder | GPT-4o | 100.0 | 92.5 | 84.7 | 81.5 | 86.2 | **85.5** |

- 최강 베이스라인 Overall 51.5 → 85.5. 차이 **+34.0점**(원문 보고와 일치).
- 실행률: 68.0 → 100.0, 차이 **+32%p**(원문 보고와 일치).

#### 5.2.3 Slide2Code — Complex 레벨

| Framework | Backbone | Exec% | Content | Position | CLIP | SSIM | Overall |
|---|---|---|---|---|---|---|---|
| AutoPresent | AutoPresent | 67.0 | 87.2 | 71.4 | 65.9 | 73.4 | 48.5 |
| AutoPresent | Gemini2.0-flash | 66.0 | 89.3 | 72.2 | 63.1 | 64.7 | 45.2 |
| AutoPresent | GPT-4o | 69.0 | 90.3 | 73.3 | 62.3 | 63.3 | 47.1 |
| SlideCoder | SlideMaster | 73.0 | 76.1 | 70.5 | 72.4 | 82.8 | 54.2 |
| SlideCoder | Gemini2.0-flash | 88.0 | 92.7 | 80.9 | 81.7 | 81.2 | 71.6 |
| SlideCoder | GPT-4o | 96.0 | 94.3 | 80.0 | 80.7 | 82.6 | **78.4** |

- 최강 베이스라인 Overall 48.5 → 78.4. 차이 **+29.9점**(원문 보고와 일치).
- 실행률: 69.0 → 96.0, 차이 **+27%p**(원문 보고와 일치).

#### 5.2.4 SLIDESBENCH (하단)

| Framework | Backbone | Exec% | Content | Position | CLIP | SSIM | Overall |
|---|---|---|---|---|---|---|---|
| AutoPresent | AutoPresent | 84.1 | 92.2 | 67.2 | 81.6 | 73.7 | 65.3 |
| AutoPresent | Gemini2.0-flash | 56.4 | 91.7 | 62.9 | 77.1 | 66.0 | 40.4 |
| AutoPresent | GPT-4o | 86.7 | 92.5 | 76.3 | 78.0 | 70.8 | 66.9 |
| SlideCoder | SlideMaster | 87.2 | 91.5 | 76.9 | 73.4 | 80.0 | 68.4 |
| SlideCoder | Gemini2.0-flash | 89.7 | 90.0 | 85.4 | 81.8 | 80.0 | 75.0 |
| SlideCoder | GPT-4o | 94.9 | 94.8 | 83.9 | 82.1 | 80.9 | **78.8** |

- SlideCoder+GPT-4o Overall 78.8, 최강 베이스라인(66.9) 대비 **+11.9점**.
- 오픈소스 SlideMaster(SlideCoder+SlideMaster, 68.4)가 두 데이터셋 모두에서 GPT-4o 기반 최강 베이스라인을 상회한다고 원문이 주장. Slide2Code에서는 SlideMaster의 simple 76.7/medium 61.7/complex 54.2가 각 레벨 베이스라인 최고(48.6/51.5/48.5)를 모두 상회. SLIDESBENCH에서는 68.4 > 66.9.

#### 5.2.5 저자의 해석(§5.2)

- SlideCoder는 전 난이도·전 지표(Local Structural + Global Visual)에서 베이스라인을 상회 → 구조 레이아웃과 시각 외관 보존 모두 강함.
- SlideCoder의 Overall은 난이도 상승에 따라 단계적으로 하락(simple 89.1 → medium 85.5 → complex 78.4) → 입력의 시각·구조 단서를 활용함을 시사.
- 반면 NL 기반 베이스라인은 난이도에 둔감하고 Overall이 난이도 계층을 반영하지 못함(예: AutoPresent 백본 Overall이 simple 48.6 → medium 41.4 → complex 48.5로 비단조).

### 5.3 Reverse Tool 분석(§5.3, 위 §4.8.2~4.8.3 수치와 동일)

- 지원 범위: Ours 10종/44스타일 vs AutoPresent 5종/16스타일.
- Reconstruction Ratio: **90.38%** vs **65.67%**.
- CLIP Score: **88.66%** vs **69.87%**.
- 상세 비교는 Appendix B(Table 5/6).

### 5.4 Complexity Metric 분석(§5.4)

- 인간 평가 프로토콜과 상관계수는 위 §4.3.4 참조.
- Pearson r=0.873(p=2.776×10⁻³²), ICC=0.726(p=1.186×10⁻³¹).

### 5.5 Ablation Study(§5.5, Appendix A)

#### 5.5.1 설정(Appendix A.1)

1. **w/o Layout**: Assembler 입력에서 각 블록의 위치 좌표만 제거.
2. **w/o CGSeg**: CGSeg와 layout-aware prompt를 비활성화. Coder가 부분 코드, Assembler가 조립을 맡는 구조에서 CGSeg 제거 시 Assembler가 불필요해지므로 **Assembler와 layout-aware prompt 둘 다 제거**, Coder 출력 코드를 최종 출력으로 직접 사용.
3. **w/o H-RAG**: 전 에이전트에서 지식베이스 검색(<Grammar> 내용) 제거.
4. **Native setting**: H-RAG와 CGSeg 둘 다 제거. H-RAG 없는 일반 프롬프트로 MLLM이 참조 이미지에서 전체 슬라이드 코드를 직접 생성. 네이티브 MLLM 기본 능력 측정용.

실험 조건: 난이도별 33개씩 총 99개 무작위 추출, GPT-4o로 추론.

#### 5.5.2 전체 결과(Table 3: Execution% / Overall, 난이도별 3행씩)

| Setting | Simple (Exec/Overall) | Medium (Exec/Overall) | Complex (Exec/Overall) |
|---|---|---|---|
| SlideCoder | 100.0 / 89.9 | 100.0 / 85.8 | 100.0 / 82.2 |
| w/o Layout | 100.0 / 81.2 | 93.9 / 73.6 | 93.9 / 71.8 |
| w/o CGSeg | 75.8 / 55.4 | 51.5 / 39.6 | 69.7 / 48.4 |
| w/o H-RAG | 90.9 / 80.4 | 81.8 / 69.3 | 84.8 / 70.7 |
| Native | 75.8 / 53.9 | 48.5 / 37.4 | 66.7 / 46.9 |

- 어느 컴포넌트를 제거해도 실행률·Overall이 하락 → 각 기여 확인.
- **w/o CGSeg의 하락폭이 가장 큼.** H-RAG가 있어 Native보다는 약간 낫지만 전 지표에서 큰 하락.

#### 5.5.3 상세 지표(Table 4: Exec/Content/Position/CLIP/SSIM/Overall)

대표 하락폭(원문 서술 + 테이블 수치):

- **w/o Layout**: complex Position이 **81.35 → 72.16**(원문 §A.2 서술. 테이블 반올림값은 81.3 → 72.2)로 크게 하락. 복잡 케이스에서 CGSeg가 RI를 더 많은 블록으로 나누는데, 레이아웃 정보가 없으면 에이전트가 다요소 공간 관계를 모델링하지 못해 겹침·캔버스 이탈이 발생. 다른 지표도 소폭 영향.
- **w/o CGSeg**: 단일 Describer가 전체 복잡 슬라이드를 처리해야 해 용량 초과 → 코드 생성 실패 빈발, 실행 성공률 급락. H-RAG 지식 덕에 Native보다는 약간 우수.
- **w/o H-RAG**: Describer에서 <Grammar> 제거 시 python-pptx 객체 식별 능력 저하. Coder·Assembler에서 제거 시 구문 가이던스 상실 → 모델 학습 데이터와 현행 python-pptx 버전 간 불일치로 인한 **버전 관련 오류** 빈발. 종합 성능 하락.
- **Native**: CGSeg+H-RAG 둘 다 없이 단일 Coder가 보조 없이 전체 슬라이드 처리 → 평범한 MLLM 추론으로 축소. 실행률·전체 성능 최저.

### 5.6 Case Study(§5.6, Figure 5)

- NL 기반 모델은 참조 이미지의 세부·레이아웃 요구를 못 맞추고, 요소 겹침·캔버스 경계 초과를 자주 발생.
- medium·complex 샘플에서는 생성 코드가 컴파일 실패하는 경우도 많음.
- SlideCoder의 CGSeg는 MLLM이 세부 디테일에 집중하도록 돕고, layout-aware prompt는 요소 공간 배치를 참조 이미지에 가깝게 정렬.

### 5.7 결론(§6)

- 신규 RI-to-Slide 과제, SCM, 난이도별 Slide2Code, CGSeg+Layout-aware Prompt+H-RAG의 SlideCoder, 7B 오픈소스용 고품질 학습셋. 실험에서 SlideCoder가 최강 베이스라인을 상회.

---

## 6. 한계와 후속 과제

### 6.1 논문 명시 한계(Limitations 섹션, 원문 그대로 3가지)

1. **단일 슬라이드만 생성**: 참조 이미지 1장 → 슬라이드 1장. 다중 슬라이드(프레젠테이션 전체) 생성 시나리오는 미탐구.
2. **Design/Pictures 분리 입력 가정**: 사용자 입력에 디자인과 이미지 요소가 분리되어 있다고 가정. 그림이 임베드된 완성 슬라이드가 통째로 입력되는 경우는 처리하지 않음.
3. **고정 규칙(fixed-rule) 분할**: 예산·시간 제약으로 분할 알고리즘(CGSeg)이 고정 규칙 패러다임. 후속 연구로 적응적·정확한 블록 분할을 위한 모델 기반 탐지 접근을 제안.

### 6.2 정리자가 본 방법론적 한계 [정리자 분석 — 원문 근거 병기]

1. **CGSeg 하이퍼파라미터 불투명**: 그리드 크기 g, 최대 깊이 Dmax, 임계값 T, 재귀 종료 후 블록 선택 기준이 원문에 없음. 재현·전용 시 튜닝 부담이 큼. [근거: Algorithm 1에 기호만 있고 값 미기재]
2. **SCM 가중치(α,β,γ) 미공개**: 복잡도 점수의 핵심인 가중치 값이 없음. 티어 경계(KMeans 중심)도 공개됐는지 불명. [근거: §3.2에 α+β+γ=1 조건만 명시]
3. **H-RAG 검색 하이퍼파라미터 미공개**: top-k의 k, 임베딩 청크 단위, OF-KB/TS-KB 엔트리 수가 없음. [근거: §4.2.2]
4. **위치 매핑의 선형 가정**: <x,y,w,h> 비례 스케일링은 참조 이미지와 슬라이드 종횡비가 다르면 왜곡 가능. 패딩/크롭 처리 언급 없음. [근거: §4.3]
5. **Ablation 표본 작음**: 난이도별 33개씩 총 99개. 통계적 유의성 검정 없음. [근거: §5.5]
6. **인간 평가자 4명·100개**: SCM 검증 표본이 제한적. 주석자 간 합의(annotator-annotator ICC)가 아닌 SCM-vs-주석자 ICC만 보고. [근거: §5.4]
7. **Overall 지표의 평균 함의**: 실행 실패를 0점으로 평균에 포함하므로, 실행률 차이가 Overall을 지배할 수 있음. 품질 지표와 실행 지표를 분리 해석할 필요가 있음. [근거: §5.1 metric 정의]
8. **베이스라인이 NL 입력에 묶임**: AutoPresent 계열은 이미지 이해 없이 NL 서술로만 생성하므로, RI 과제에서의 열위는 다소 자명. 동일 RI 입력의 네이티브 MLLM 직접 생성(Native setting)이 더 공정한 1차 베이스라인이며, 이 대비 개선폭(w/o CGSeg~Native 행 기준)도 크긴 하나 Table 1의 40.5점 수치와는 다른 맥락임을 유의. [근거: §5.2 vs §5.5]
9. **역공학 CLIP 비교의 순환성 주의**: 역공학 품질 지표로 CLIP을 쓰는데, CLIP은 생성 평가에도 쓰임. 동일 지표 재사용이 과적합 인상을 줄 수 있음. [근거: §5.1, §5.3]
10. **Table 2와 Table 5의 타입명 불일치**: Table 2의 "title(10종)"이 Table 5에는 "rectangle"으로 나타나는 등 명칭 정합이 불완전. 재현 시 코드 저장소 확인 필요. [근거: §5.3 Table 2 vs Appendix B Table 5]

---

## 7. Typodeck 관련성

Typodeck 맥락: Slide Markdown → Slide IR(버전관리 중간표현) → Composition Engine → 네이티브 편집가능 PPTX 파이프라인. Visual Critic(이미지+구조 하이브리드 평가), Grammar Registry(버전관리 시각 시스템), Validation-Repair 게이트, 38개 Composition Candidate, 참고 슬라이드 재현 벤치마크 보유. 목표: Valid PPTX → Good Layout → Intended Visual Hierarchy(의도된 의미 중요도와 지각된 시각 중요도의 일치).

### 7.1 직접 연결점

1. **참고 슬라이드 재현 벤치마크 ↔ Slide2Code/RI-to-Slide 과제**
   - Typodeck의 참고 슬라이드 재현 벤치마크는 SlideCoder의 RI-to-Slide 과제 정의(I₀→Cg→Fg/Ig, 원본 코드 없이 이미지+파일 쌍 비교)와 구조적으로 동일.
   - Slide2Code의 난이도 티어(simple/medium/complex) 설계는 Typodeck 재현 벤치마크의 난이도 라벨링에 직접 참조 가능. 특히 "제작 난이도+시각 복잡도" 이중 관점(요소 수·타입 다양성·coverage)은 Typodeck의 Valid→Good→Hierarchy 목표와 정합.
2. **Visual Critic ↔ 4종 평가 지표**
   - SlideCoder의 Global Visual(CLIP/SSIM) + Local Structural(content/position) + Execution + Overall 구조는 Typodeck Visual Critic의 이미지+구조 하이브리드 평가와 같은 설계 철학.
   - Position similarity를 별도 지표로 둔 점은 Typodeck의 Good Layout·Visual Hierarchy 목표에 직접 대응.
3. **Grammar Registry ↔ H-RAG의 TS-KB/OF-KB**
   - TS-KB(객체 타입 표준 서술)와 OF-KB(함수 구문 명세)의 2층 분리는 Typodeck Grammar Registry의 "버전관리 시각 시스템" 개념과 상통. 특히 OF-KB가 "버전 불일치 오류 방지"에 기여했다는 ablation 해석(§A.2)은 Grammar Registry의 버전관리 당위성을 뒷받침하는 실증 사례로 인용 가능.
4. **Validation-Repair 게이트 ↔ Self-refinement + Assembler**
   - Coder·Assembler의 최대 3회 self-refinement(오류 피드백 재생성)는 Typodeck의 Validation-Repair 게이트와 동일한 패턴. 실행 실패 시 블록 폐기/샘플 실패 처리 규칙도 게이트 설계에 참조 가능.
5. **Composition Engine ↔ Layout-aware Prompt의 <Position*>**
   - CGSeg 위치를 inches 단위로 비례 스케일링해 주입하는 방식은, Typodeck Composition Engine의 좌표·레이아웃 표현 설계에 비교 기준이 됨. 단 선형 스케일링의 한계(§6.2 항목 4)는 Typodeck이 개선점으로 삼을 수 있음.
6. **Slide IR ↔ Describer의 표준화 서술 + Code Snippets**
   - Describer의 표준화 블록 서술(python-pptx 객체명 기반)과 Coder의 블록별 스니펫은 "버전관리 중간표현"의 약한 형태. Typodeck의 Slide IR이 이보다 명시적·버전관리된다는 차별점을 주장할 수 있음.

### 7.2 활용 아이디어(전용 가능성)

1. **CGSeg 아이디어의 전용 [원문 근거 + 추측 혼합]**
   - (원문 근거) CGSeg는 Sobel+중앙값 임계값+flood-fill+재귀 분할의 경량 고정규칙 분할기로, 복잡 케이스에서 실행률·Overall을 크게 끌어올린 최대 기여 컴포넌트(ablation w/o CGSeg 하락폭 최대).
   - (활용) Typodeck의 참고 슬라이드 재현 파이프라인에서 "참조 이미지 → 영역 분해 → 영역별 IR 생성 → 조립" 전처리로 전용 가능. 특히 Visual Critic의 영역별 점수(local scoring) 단위로도 재사용 가능.
   - (추측) 다만 CGSeg는 고정 규칙이라 Typodeck이 표방하는 의미 기반 레이아웃(의도된 계층)과는 철학이 다름. 색상 경계가 약한 미니멀 슬라이드에서는 과소분할 가능성이 있어, 모델 기반 탐지(논문도 후속 과제로 제안) 또는 Typodeck의 구조 파서와 하이브리드하는 방향이 적합할 것으로 추측.
2. **H-RAG 2층 지식베이스의 전용 [원문 근거 중심]**
   - TS-KB(타입 표준화) → Describer, OF-KB(구문 명세) → Coder/Assembler의 역할 분담 검색은 Typodeck의 Grammar Registry + Composition Candidate 검색 구조에 직접 이식 가능.
   - BGE M3-Embedding+코사인 유사도+top-k 삽입이라는 단순 구조라 구현 비용이 낮음. Typodeck의 38개 Composition Candidate를 "OF-KB식 구문 패턴"으로 색인하면, 후보 선택의 근거 추적 가능성(provenance)이 높아진다. [이하 §7.2-끝·§7.3·§8은 원문 정리본 절단으로 부모 세션이 본 파일 내용(§4~§6 수치) 기준으로 보완 작성]
3. **SCM식 난이도 티어의 전용 [원문 근거 중심]**
   - SCM(요소 수·타입 다양성·coverage, α+β+γ=1)은 인간 난이도 평가와 Pearson r=0.873, ICC=0.726(§5.4)으로 검증된 난이도 지표. Typodeck 재현 벤치마크의 케이스 난이도 라벨링에 그대로 차용 가능. 단 가중치 미공개(§6.2 항목 2)라 Typodeck 데이터로 재보정 필요.

### 7.3 주의점
- **베이스라인 비교 맥락 주의**: 40.5점 개선은 NL-입력 베이스라인(AutoPresent) 대비 수치. 동일 RI 입력 Native 설정 대비 개선폭은 별개 맥락이므로(§6.2 항목 8), Typodeck 인용 시 비교 조건을 명시해야 한다.
- **Overall 지표 해석 주의**: 실행 실패=0점 평균 포함이라 실행률이 Overall을 지배(§6.2 항목 7). Typodeck Visual Critic이 이 지표 체계를 차용하면 실행률과 품질 지표를 분리 보고해야 한다.
- **하이퍼파라미터 공백**: CGSeg·SCM 가중치·top-k 미공개(§6.2 항목 1~3). 전용 시 재현 실험으로 값을 확정해야 한다.

---

## 8. 인용 포인트 (Typodeck 논문용 주장 3개)

1. **"참조 이미지→편집 가능 슬라이드 재현은 분할-생성-조립의 계층 구조가 핵심이며, 분할(CGSeg)이 최대 기여 컴포넌트다"**
   근거: SlideCoder 전체 구조 §4 + ablation에서 w/o CGSeg 하락폭 최대(§5.5). Typodeck 재현 파이프라인의 영역 분해 단계 정당화 근거로 인용.
2. **"난이도 지표는 인간 판단과 정합해야 하며, SCM은 Pearson 0.873 / ICC 0.726으로 검증됐다"**
   근거: §5.4 SCM 검증(인간 평가자 4명·100개). Typodeck 재현 벤치마크 난이도 라벨링 설계의 선행 근거로 인용. 단 표본 작음(§6.2 항목 5~6)은 한계로 병기.
3. **"버전 명세 지식(OF-KB)이 생성 오류를 줄인다 — 버전관리 중간표현의 실증적 당위성"**
   근거: OF-KB의 버전 불일치 오류 방지 기여(§A.2 ablation 해석). Typodeck Slide IR·Grammar Registry 버전관리 설계의 지지 근거로 인용.