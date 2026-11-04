# PPTBench 논문 전문 정리 (Thorough)

## 0. 서지 정보

- **제목:** PPTBench: Towards Holistic Evaluation of Large Language Models for PowerPoint Layout and Design Understanding
- **저자:** Zheng Huang, Xukai Liu, Tianyu Hu, Kai Zhang, Ye Liu
- **소속:** University of Science and Technology of China (USTC), State Key Laboratory of Cognitive Intelligence (Tianyu Hu는 USTC만 표기)
- **연락처(원문 표기):** {huangzheng, chthollylxk, tianyuhu}@mail.ustc.edu.cn, kkzhang08@ustc.edu.cn, yeliu.liuyeah@gmail.com
- **발표처/연도:** arXiv 프리프린트, 2025년 12월 2일 (원문 미기재: 학회/저널 게재 여부 없음, v1 기준)
- **arXiv:** cs.CV, arXiv:2512.02624v1
  - 초록 페이지: https://arxiv.org/abs/2512.02624
  - PDF: https://arxiv.org/pdf/2512.02624
- **코드/데이터:** https://github.com/Gastronomicluna/PPTBench-Eval (Abstract에서 "All datasets and code are fully released" 명시)
- **원문 형태:** arXiv HTML 변환본(v1), 본문 §1–§5 + 부록 §6–§9
- **분량:** 원문 텍스트 파일 1,003줄(약 115,913 bytes)

---

## 1. 한눈 요약 (5문장 이내)

1. PPTBench는 PowerPoint 슬라이드에 대한 MLLM/VLLM의 능력을 Detection·Understanding·Modification·Generation 4개 카테고리, 11개 서브태스크, 4,439개 샘플로 종합 평가하는 멀티모달 벤치마크이다.
2. 958개 실제 PPTX(정부 아카이브 수집)를 구조화 JSON(텍스트·서식·좌표 메타데이터)과 슬라이드 스크린샷의 이중 입력(dual-modality)으로 변환하고, 수정·생성은 17개 원자 API 호출 시퀀스로 실행·평가한다.
3. 실험 결과 클로즈드 모델(GPT-4o, Gemini-2.0-Flash)이 오픈소스 모델을 전 카테고리에서 앞서지만, Generation에서는 최고 성능도 약 33%에 불과해 의미 이해와 공간·레이아웃 추론 사이에 큰 격차가 확인됐다.
4. Ablation에서 JSON 구조 정보는 Detection·Modification에, 스크린샷 시각 정보는 Understanding(차트·표)에 더 기여했고, CoT와 API 템플릿 가이드는 Generation을 크게 올리지만 CoT는 실행 가능한 API 시퀀스 수를 748개에서 531개로 줄이는 부작용도 보였다.
5. 케이스 스터디는 지배 요소 오인식, 차트 공간 비율 오판, 겹침 유발 이동, 이미지-불릿 중첩 등 체계적 레이아웃 실패를 보여주며, 논문은 시각-구조 융합과 순차 계획+시각 이해 통합을 후속 과제로 제시한다.

---

## 2. 연구 문제와 배경

### 2.1 해결하려는 문제

- PowerPoint는 풍부한 텍스트 내용과 고도로 구조화된 시각 레이아웃이 결합된 실용 멀티모달 도메인이다. 공간 관계가 정보 해석에 강하게 영향을 준다(§1).
- Canva AI Presentations, Microsoft Copilot for PowerPoint, Beautiful.AI 같은 상용 시스템은 이미 VLLM 기반 슬라이드 자동 생성을 도입했고, 지능형 PPT 어시스턴트에 대한 현실 수요가 크다(§1).
- 그럼에도 학계 연구는 PowerPoint 추론·자동화에서 제한적이며, 특히 레이아웃 중심 평가가 빠져 있어 모델이 실제 슬라이드 작성·편집·세련화 작업을 얼마나 잘하는지 총체적으로 알 수 없다(§1, Abstract).
- 목표: 추출→추론→수정→생성 수준을 관통하는 holistic 평가로, MLLM의 멀티모달 추론·구조 이해·종단간 슬라이드 조작 능력을 현실적으로 측정하는 벤치마크를 제공한다(§1, §3.1, §5).

### 2.2 기존 연구의 한계 (원문 근거)

논문 §1, §2.1이 명시한 두 가지 근본 한계:

1. **좁고 고립된 서브태스크만 다룸 (breadth 부족)**
   - PPTC(ACL 2024 Findings): API 기반 슬라이드 수정 능력 평가.
   - PPTC-R: 적대적 지시·소프트웨어 변이에 대한 강건성 평가.
   - SLIDESBENCH(AutoPresent, CVPR 2025): 자연어→슬라이드(NL-to-Slide) 생성 정의.
   - PPTAgent: 구조화된 편집 기반 워크플로와 레이아웃 추론으로 문서→프레젠테이션 생성 정식화.
   - 그러나 이들은 이해·추론·디자인을 가로지르는 통합 평가가 아니라 개별 서브태스크에 고립되어 있어 총체적 능력 평가가 불가하다(§1 2번째 문단, §2.1 마지막 문단).
2. **시각 측면 무시 (visual grounding 부족)**
   - 기존 벤치마크는 레이아웃 추론, 공간 조작, 디자인 수준 이해에 대한 지원이 제한적이다.
   - 시각 맥락이나 레이아웃 정보를 포함하지 않는 경우가 많아, 일관되고 전문적으로 구조화된 슬라이드 생성에 핵심인 요소를 평가하지 못한다(§1, §2.1).
   - §2.1 표현 그대로: "(1) Most prior work isolates specific subtasks, without providing a unified evaluation across understanding, reasoning, and design. (2) Many benchmarks lack visual grounding."

### 2.3 관련 연구 지형 (원문 §2 정리)

- **범용 LLM 평가:** LiveBench(추론·코딩·지시 따르기).
- **멀티모달 평가:** MMMU, MMMU-Pro, MathVista, AI2D, MMStar.
- **도메인 특화:** ChartQA(차트 이해), APIGen(멀티모달 API 상호작용).
- **VLM/MLLM:** Flamingo, GPT-4o, Gemini, LLaVA, MiniCPM-V, InternLM-XComposer, Qwen-VL, MiniGPT-4, Llama 계열.
- **LLM/VLM 에이전트:** 웹 내비게이션(VisualWebArena, WebShop, WebArena), 소프트웨어 엔지니어링(SWE-Agent, SWE-bench Multimodal), Embodied AI(EmbodiedEval 등).
- 논문의 위치 선정: 위 흐름에도 불구하고 기존 MLLM은 PPT 슬라이드의 구조화 레이아웃과 구성 조직을 이해하는 능력이 부족하며, PPTBench가 이 간극을 메운다(§2.2 마지막).

---

## 3. 핵심 기여 (번호 목록)

1. **PPTBench 벤치마크 제안:** 4개 점진적 카테고리(Detection·Understanding·Modification·Generation), 11개 서브태스크, 4,439개 샘플의 종합 멀티모달 벤치마크(§1, §3.1).
2. **레이아웃·디자인 추론의 명시적 평가:** 공간 관계, 요소 계층, 슬라이드 구조 해석을 요구하는 태스크 설계. 요소 추출을 넘어 암묵적 관계·의미 계층·구조 조직 추론까지 평가(§1, §3.2).
3. **현실 기반 대규모 소스:** 950개 이상(정확히는 958개)의 전문 PPT를 다양한 도메인·스타일로 큐레이션. 평균 23.7 슬라이드/프레젠테이션, 평균 4.9 shape/슬라이드(§1, §6).
4. **이중 입력 표현(dual-modality input):** 구조화 JSON(텍스트·레이아웃 메타데이터) + 슬라이드 스크린샷(시각 그라운딩). 불필요한 Open XML 복잡성은 버리고 구조·시각 정보를 보존(§1, §3.3.1, §7.2).
5. **제어 가능한 API 기반 상호작용 패러다임:** PPTC를 따라 17개 원자 PowerPoint 함수 표준 스키마 채택. 모델이 구조화된 API 호출 시퀀스를 생성하면 결정적 executor가 실행해 수정·생성 슬라이드를 산출(§3.3.3, §9.2).
6. **JSON 역공학 기반 재현 가능한 라벨:** Detection은 JSON 필드 직접 읽기, Understanding은 반자동(시각 파싱+LLM 문항 생성+인간 검증), Modification은 제어된 API 실행 후 상태, Generation은 주관성 때문에 원본 PPT를 참조로만 사용(§3.3.4).
7. **핵심 실험 발견:**
   (a) 의미 이해 vs 시각-레이아웃 추론의 큰 격차,
   (b) JSON+시각 결합 실패 및 API 계획 능력에 시각 정보 통합 실패,
   (c) CoT·템플릿 가이드의 Generation 개선 효과와 그 한계,
   (d) 오정렬·요소 겹침 등 체계적 레이아웃 오류의 시각적 입증(§4.3–§4.6).
8. **재현성:** 데이터셋·코드 전체 공개(GitHub 링크, Abstract).

---

## 4. 방법론 상세

### 4.1 전체 구조 (§3.1)

- 4개 대분류 × 11개 서브태스크 = 4,439 샘플.
- Figure 2에서 카테고리별·서브태스크별 샘플 수 분포를 제시하나, HTML 변환본에는 수치표가 없고 캡션만 존재하므로 **서브태스크별 정확한 N은 원문 미기재(그림에만 존재)**.
- 네 태스크는 상호 연결되어 추출→추론→수정→생성 수준의 능력을 종합 테스트한다(§5).

### 4.2 벤치마크 설계: 4개 카테고리 (§3.2)

#### 4.2.1 Detection Tasks (§3.2.1)

LLM의 슬라이드 요소 지각 기초 능력. 내용 추출·스타일 감지·레이아웃 분석. 복잡 연산의 전제조건.

1. **Content Extraction (내용 추출)**
   - 제목, 부제목, 글머리 기호, 단락, 각주 등 구조화 텍스트 정보 식별·추출.
   - PPT 이해와 레이아웃 분석의 기초.
2. **Style Detection (스타일 감지)**
   - 시각 강조·정보 계층을 전달하는 서식 속성 인식·분류.
   - 글꼴 속성(서체, 굵기, 크기, 색), 텍스트 효과(하이라이트, 그림자), 스타일 변형(이탤릭, 굵게, 밑줄).
   - 디자인 일관성 유지와 의도된 강조 이해에 필수.
3. **Layout Detection (레이아웃 감지)**
   - 요소 간 공간 레이아웃·기하 관계 분석.
   - 겹치는 도형, 슬라이드 경계 초과 요소, 오정렬 컴포넌트, 비일관 간격 같은 이슈 탐지.
   - 지배 요소(dominant element)의 바운딩박스 위치 파악, 슬라이드 최상단 객체 식별 등 포함.
   - 슬라이드를 시각적으로 정돈되게 유지하는 데 필수.

#### 4.2.2 Understanding Tasks (§3.2.2)

표면 인식을 넘어 슬라이드 내 함축된 결론을 추론하는 깊은 이해. 텍스트 해석 + 차트·표 추론을 통한 전체 의미 파악.

1. **Text Understanding**
   - 슬라이드 내 암묵적 텍스트 정보 추론.
   - 주제 파악, 텍스트 요약, 텍스트 요소 간 계층 관계 인식.
2. **Chart Understanding**
   - 슬라이드 내 그래픽 차트 해석·추론.
   - 차트 유형 식별, 데이터 계열 분석, 축·범례 해석으로 다양한 시각화 형식의 패턴·상관·이상 인식.
3. **Table Understanding**
   - 슬라이드 내 구조화 표 데이터 추론.
   - 표 구조 분석, 헤더·셀 내용 해석, 행·열·범주 간 논리 관계 인식으로 구조화 데이터의 계층 조직 파악.

#### 4.2.3 Modification Tasks (§3.2.3)

사용자 지시에 따른 기존 슬라이드 수정. 개별 요소 편집·텍스트 업데이트·전체 레이아웃 세련화.

1. **Element Modification**
   - 도형 추가·삭제·크기 조정·위치 변경 같은 기초 객체 수준 액션.
   - 사용자 지시와 API 호출 이해를 수반. 고수준 내용 수정의 기초.
2. **Text Modification**
   - 문법 교정, 어조 다듬기, 새 맥락에 맞는 표현 적응 같은 텍스트 요소 편집.
   - 맥락 이해와 의미 보존 능력 반영.
3. **Layout Refinement**
   - 요소 공간 조직 조정. 자동 정렬, 경계 초과 배치 해결, 요소 간 간격 최적화.
   - 슬라이드를 명확하고 잘 조직되며 시각적으로 일관되게 유지.

#### 4.2.4 Generation Tasks (§3.2.4)

특정 요구·소스 자료에 따라 새 슬라이드를 처음부터 생성. 정보 종합+일관 구조화+시각적으로 적절한 레이아웃 설계 필요.

1. **Note Generation**
   - 각 슬라이드의 설명 노트 생성. 핵심 아이디어·의도 메시지 포착.
   - 다수 슬라이드 정보 통합, 핵심 요약, 전체 논리 흐름 반영하는 일관된 발표자 노트 생성.
   - 전역 이해와 맥락 연결된 청중 지향 설명 능력 입증.
2. **Slide Generation**
   - 스크린샷·텍스트 같은 다양한 입력 양식에서 완전한 슬라이드 구축.
   - 멀티모달 입력에서 공간 레이아웃 추론·재현 + 적절한 서식·스타일·디자인 관습 적용.
   - PPTBench에서 가장 종합적인 태스크. 내용 이해+레이아웃 조직+시각 디자인을 통합해 명확하고 전문적인 슬라이드 산출.

- 부록 Figure 9는 4개 카테고리의 대표 예시를 확장판으로 시각화하나 HTML 변환본에 이미지 수치 없음(§7.1).

### 4.3 데이터 구축 파이프라인 (§3.3)

#### 4.3.1 인스턴스 형식: (S, Q, A, L) 튜플

- 모든 인스턴스는 일관성을 위해 (S, Q, A, L) 튜플로 표현(§3.3, Table 1).
- Table 1은 태스크별 네 요소 사용 여부를 ✓/×로 표시하는 표이나, **HTML 변환본에서 행 라벨(태스크명)이 소실되어 깨짐**(원문 148–156줄). 셀 패턴만 보면:
  - 행 1: S ✓, Q ✓, A ×, L ✓
  - 행 2: S ✓, Q ✓, A ×, L ✓
  - 행 3: S ✓, Q ✓, A ✓, L ✓
  - 행 4: S ×, Q ✓, A ✓, L ×
- 문맥상 행 1–2는 Detection·Understanding(입력 슬라이드+질의, API 없음, 라벨 있음), 행 3은 Modification(전부 사용), 행 4는 Generation(원본 슬라이드 입력 없음, API 사용, 주관성으로 라벨 없음)에 대응하는 것으로 추정되나, **행-태스크 매핑은 원문 미기재(변환본 손실)이므로 추측 표기**.

#### 4.3.2 Slide Data S (§3.3.1)

- **문제:** 원시 PPTX는 LLM에 직접 부적합. Open XML 표준을 따르지만 과도한 메타데이터를 포함하고, 레이아웃을 좌표값으로만 표현해 직접 의미 추론을 방해. 구조화 추출·정규화 필요.
- **해결: 이중 입력 표현**
  - **Structured JSON:** shape 유형, 텍스트 내용, 공간 속성(위치·크기) 인코딩.
  - **Slide Screenshot:** 직접 시각 그라운딩 제공.
  - 구조·시각 정보를 보존하면서 불필요한 XML 복잡성을 제거해 LLM이 효율적으로 처리.

#### 4.3.3 Task Query Q (§3.3.2)

질의는 태스크별 지시. 일반 질의(general query)와 객관식(multiple-choice) 두 형태.

1. **General Query**
   - 사용자 지시만 포함.
   - 태스크 관련성·실행 가능성을 위해 대분류별 소규모 자연어 템플릿 집합과 추출 알고리즘을 구축한 뒤 템플릿의 변수 플레이스홀더를 자동 추출.
   - Detection, Modification, Generation 태스크에 적용.
2. **Multiple-Choice Question**
   - Understanding 태스크 전용. 정답이 암묵적인 경우가 많아 직접 평가가 신뢰 불가하므로 객관식 채택.
   - LLM이 슬라이드 기반 객관식 문항을 생성 → 인간 검토자가 문항·정답 검증.
   - 독립 어노테이터 2명, **98% 일치율**.

#### 4.3.4 API List A (§3.3.3)

- PPT 슬라이드의 제어 가능하고 실행 가능한 조작을 위해 자연어 지시를 정밀하고 검증 가능한 편집 연산으로 바꾸는 API 기반 상호작용 패러다임.
- PPTC를 따라 **17개 원자 PowerPoint 함수 표준 스키마** 채택. 각 함수는 shape 식별자·좌표·색·스타일 속성을 명시하는 파라미터 정의 포함(상세는 부록 §9.2).
- 추론 시 모델은 구조화된 API 호출 시퀀스(A_seq)를 생성하고, 결정적 slide executor가 이를 실행해 수정·신규 슬라이드를 산출.

**17개 API 전체 목록 (부록 §9.2 원문 Listing 기준):**

| # | 함수 시그니처 | 설명·호출 전제 |
|---|---|---|
| 1 | create_slide() | 새 슬라이드 생성 |
| 2 | choose_slide(slide_id: int) | 작업 슬라이드 선택. JSON의 slide_id 사용 |
| 3 | choose_shape(shape_id: int) | 작업 shape 선택. JSON의 shape_id 사용. 슬라이드 먼저 선택 필수 |
| 4 | set_width(width: int) | 선택 shape 너비 설정. shape 선택 선행 |
| 5 | set_height(height: int) | 선택 shape 높이 설정. shape 선택 선행 |
| 6 | set_top(top: int) | 선택 shape 상단 위치 설정. shape 선택 선행 |
| 7 | set_left(left: int) | 선택 shape 좌측 위치 설정. shape 선택 선행 |
| 8 | add_text_box(left, top, width, height, text) | 현재 슬라이드에 텍스트박스 추가 후 해당 shape를 현재 shape으로 선택. 슬라이드 선행 설정 필수 |
| 9 | add_picture(left, top, width, height, image_path) | 현재 슬라이드에 그림 추가 후 현재 shape으로 선택. 슬라이드 선행 설정 필수 |
| 10 | insert_text(text: str) | 선택 shape에 텍스트 삽입. shape 선택 선행 |
| 11 | set_font_size(font_size: int) | 선택 shape 글꼴 크기. shape 선택 선행 |
| 12 | set_font_style(font_style: str) | 선택 shape 글꼴 스타일. shape 선택 선행 |
| 13 | set_font(font_name: str) | 선택 shape 글꼴. shape 선택 선행 |
| 14 | set_font_color(font_color: str) | 선택 shape 글꼴 색. shape 선택 선행 |
| 15 | set_notes_font(font_name: str) | 프레젠테이션 노트 글꼴. 슬라이드 선택 필요, shape 선택 불필요 |
| 16 | set_text_align(align_style: str) | 선택 shape 내 텍스트 수평 정렬. 반드시 choose_shape 선행. 현재 선택 shape의 모든 단락에 적용되며 해당 shape에만 영향 |
| 17 | set_word_wrap(wrap: bool = True) | 현재 선택 shape 내 텍스트 자동 줄바꿈 on/off. 텍스트 포함 가능 shape(텍스트박스·자동도형) 선택 선행 |

- 설계 3원칙(§9.2): **Atomicity**(각 연산은 단일하고 모호성 없는 액션), **Composability**(원자 연산 조합으로 복잡 편집·생성 절차 달성), **Executability**(모든 함수가 PowerPoint 호환 executor를 통해 결정적 슬라이드 업데이트에 직접 매핑).
- 표준화 목적: 성능 차이가 프롬프트·구현 분산이 아니라 능력 차이에서 오도록 보장.

#### 4.3.5 Label L (§3.3.4)

- 각 태스크의 정답. JSON 표현에서 각 태스크를 역공학(reverse-engineering)으로 도출해 구조 정확성·의미 일관성·재현성 보장.
- 전 PPT를 모든 요소의 텍스트·기하·스타일 속성을 보존하는 compact JSON으로 변환한 뒤, 다운스트림 라벨을 이 JSON에서 직접 생성해 슬라이드의 실제 시각·의미 내용과 정렬.
  - **Detection:** 요소 유형·위치·서식에 대응하는 JSON 필드에서 직접 읽기.
  - **Understanding:** 반자동 과정 — JSON에서 시각 파싱 → LLM 기반 문항 생성 → 인간 검증. 사실 정확성 보장.
  - **Modification:** 제어된 API 연산을 JSON 구조에 실행해 만든 편집 후 슬라이드 상태. 결정적이고 검증 가능.
  - **Generation:** 원본 PPT를 참조로 쓸 수는 있으나 생성 태스크의 본질적 주관성 때문에 라벨로 사용하지 않음.
- 신뢰성: 생성된 라벨 전체에 자동 일관성 검사 + 부분 인간 감사(auditing).

### 4.4 카테고리별 구축 세부 (부록 §7.3)

- **Detection:**
  - 내용 추출: PPTX에서 텍스트 요소를 계층 관계·구조 맥락 보존하며 체계 추출.
  - 스타일 감지: PPTX 내장 메타데이터에서 직접 도출. 프레젠테이션 전반의 서식 속성 전 범위 포착.
  - 레이아웃 감지: 더 정교한 접근. 먼저 깨끗하고 잘 구조화된 레이아웃의 슬라이드를 베이스라인으로 식별한 뒤, 커스텀 알고리즘으로 제어된 변형을 도입해 흔한 레이아웃 이슈 시뮬레이션 — 겹치는 도형(교차를 만드는 전략적 배치), 경계 초과 요소(경계 밖 형상에 대한 신중한 배치).
- **Understanding:**
  - 텍스트 이해: 실질 내용 포함 600개 슬라이드를 인간 검토자가 선정. 이를 기반으로 텍스트 정보·관계 이해를 겨냥한 객관식 생성.
  - 구축 과정 5단계: (1) MLLM으로 차트·표 포함 슬라이드 식별, (2) 다중 MLLM 교차 검증, (3) LLM으로 객관식 생성, (4) 인간 검토자 문항·정답 검증, (5) 10% 항목 2차 검토로 98% 정확률 보장.
- **Modification:**
  - 요소 수정: 무작위 shape의 내용·속성을 기록 → 슬라이드에서 제거 → 모델이 적절한 위치에 재도입해야 하는 태스크 생성.
  - 텍스트 수정: 실질 텍스트 슬라이드 기반. 문법 교정·내용 적응·기존 요소와 일관성 유지를 평가하는 편집 시나리오 설계.
  - 레이아웃 세련화: 시각 향상 여지가 있는 슬라이드 식별. 요소 정렬·간격 최적화, 시각 계층 개선, 전체 균형·구성 향상에 초점.
- **Generation:**
  - 기존 프레젠테이션에서 다양한 내용 요소 추출 — 텍스트(슬라이드 원문, 발표자 노트, 주석), 시각 요소(이미지, 차트, 다이어그램 등 그래픽), 메타데이터(스타일 정보, 서식 가이드라인, 레이아웃 패턴).
  - 모델은 제공된 내용을 효과적으로 조직·제시하면서 전문 디자인 기준을 유지하는 새 슬라이드 생성. 단순 텍스트 슬라이드부터 복잡 멀티미디어까지 다양한 시나리오 포함.

### 4.5 구조화 JSON 표현 예시 (부록 §7.2)

- 측정 단위 EMU(English Metric Unit) 명시, 정밀 바운딩박스 좌표, 계층적 글꼴 상세 보존.
- 원문 예시 슬라이드: slide_width 9144000, slide_height 6858000, measurement_unit "emu", slide_id 256.
- shapes 배열 예시:
  - PlaceHolder 1 (shape_id 9, PLACEHOLDER, SUBTITLE): height 1600200, width 7772400, left 762120, top 2742840. 텍스트 "2009 Energy Conference / April 7, 2009". font_details에 단락0 Tahoma 40pt, 단락1 Tahoma 32pt.
  - Picture 4 (shape_id 10, PICTURE, RECTANGLE): height 1797120, width 7137360, left 1143000, top 380880. image_path "dataset/extracted_images/…/image_0_2.png".
  - shape_id 11 (PICTURE, RECTANGLE): height 1746360, width 7013520, left 1295280, top 4572000. image_path "…/image_0_3.png".
- 논문 강조: 측정 단위·바운딩박스·계층 글꼴 같은 세밀 속성을 명시적으로 보존해야 정확한 레이아웃 추론·수정이 가능하다.

### 4.6 원본 데이터셋 상세 (부록 §6)

- **규모·출처:** 정부 출처(government sources) 수집 958개 PPT.
- **프레젠테이션 통계(§6.1):** 프레젠테이션당 평균 23.7 슬라이드(중앙값 19). 대부분 15–30개. 30–45분 세션의 전형적 전문가 프레젠테이션 길이와 부합. 우편향(right-skewed) 분포 — 대부분 간결하나 일부 긴 종합 프레젠테이션 존재(Figure 6).
- **내용 요소 분석(§6.2):**
  - Shape 유형 분포(Figure 7): 텍스트박스·기본도형이 약 60%로 지배, 이미지 25%, 차트 15%. 텍스트 중심+시각 보조의 전형 구성 반영.
  - 슬라이드 복잡도(Figure 8): 슬라이드당 평균 4.9 shape. 대부분 5–20개 범위. 잘 구조화된 전문가 품질. LLM에 충분한 도전이면서 현실적 테스트 시나리오 유지.
- **데이터셋 특성(§6.3):**
  - 도메인: 공공정책·교육·기술 주제의 정부 프레젠테이션 위주.
  - 언어: 영어가 주 언어, 일관된 전문 용어.
  - 기간: 2015–2023년, 진화하는 프레젠테이션 스타일 포착.
  - 형식 일관성: 4:3 종횡비가 지배, 제도적 표준화 반영.

### 4.7 평가 지표 설계 (§4.2)

카테고리별 전용 지표로 객관적이고 일관된 평가를 의도.

1. **Detection — 완전일치 정확도**
   - A = M(S, Q)를 정답 L과 exact matching 비교.
   - Acc_det = (1/N) Σ I(A_i = L_i). I는 지시함수, N은 detection 샘플 수.
2. **Understanding — 객관식 정확도**
   - Q에 4개 선택지 E = {opt1..opt4} 포함. 모델이 하나 선택 A = M(S, Q).
   - Acc_und = (1/N) Σ I(A_i = L_i), L ∈ E.
3. **Modification — 실행 후 JSON 완전일치**
   - 모델이 API 시퀀스 A_seq = M(S, Q, A) 생성. executor E(·,·)가 슬라이드에 적용해 구조화 JSON S* = E(A_seq, S) 산출.
   - Acc_mod = (1/N) Σ I(S*_i = L_i).
   - 수정 슬라이드의 모든 구조 속성(요소 유형·위치·색·스타일)이 참조 출력과 정확히 일치해야 함.
4. **Generation — LLM-as-a-Judge 6점 루브릭**
   - 모델이 입력 S' 기반 API 시퀀스 A_seq = M(S', Q, A)를 생성하고 실행해 S* 산출. S'에 담긴 정보를 효과적으로 전달하는 새 슬라이드가 목표.
   - 슬라이드 디자인 품질의 본질적 주관성·다면성 때문에 SLIDESBENCH를 따라 LLM-as-a-Judge 채택. 평가 모델 Gemini-2.0.
   - 6점 루브릭:
     - 0 Very Poor: 의미 있는 내용 없음 또는 완전히 읽기 불가/혼란.
     - 1 Poor: 메시지 불명확, 디자인 저조, 레이아웃·내용에 심각한 이슈.
     - 2 Fair: 기본 메시지는 있으나 명확성·일관성·시각 완성도 부족.
     - 3 Good: 메시지 명확, 디자인 허용 가능, 사소한 개선 필요.
     - 4 Very Good: 강한 명확성·디자인, 효과적 시각 커뮤니케이션.
     - 5 Excellent: 매우 전문적, 균형 잡힘, 시각적으로 매력적이고 임팩트 있음.
   - Score_i ∈ {0..5}를 20배해 백분율화: Score_gen = (1/N) Σ Score_i × 20.
   - 부록 §8.1 Figure 10에 0–5 전 점수대 대표 예시. 중간(2–3)과 고품질(4–5)의 질적 구분, 내용 명확성·레이아웃 조직·시각 디자인이 평점에 미치는 영향 시각화.

---

## 5. 실험 결과 상세

### 5.1 실험 설정 (§4.1, §9.1)

- **평가 모델:**
  - 클로즈드: GPT-4o(OpenAI), Gemini-2.0-Flash(Google).
  - 오픈소스: Llama3.2-Vision(11B, 90B, Meta), LLaVA-1.5(13B, 34B), MiniCPM-V(8B), Gemma-3(12B).
- **재현성:** temperature 0 설정(§4.1). 클로즈드 API는 temperature 0.0, top_p 0.95로 일관되게 접근(§9.1).
- **하드웨어:** NVIDIA Tesla A100 40GB ×8, Intel Xeon 12코어 3.0GHz ×2, RAM 256GB, Ubuntu 20.04.5 LTS, CUDA 12.4.
- **오픈소스 배포:** ollama 프레임워크, 4비트 양자화(메모리 최적화+추론 품질 유지 의도).
- **추론 설정:** 최대 컨텍스트 길이 2,048 토큰, 배치 크기 1로 전 모델 통일.

### 5.2 주요 결과 수치 (§4.3, Table 2)

- **주의:** HTML 변환본의 Table 2(원문 216–228줄)가 렌더링 붕괴로 행·열 라벨과 대부분의 셀 수치가 소실됨. 아래 수치는 본문 서술(§4.3)에서 직접 언급된 것만 기재. 언급되지 않은 모델·서브태스크별 세부 수치는 **원문 미기재(변환본 손실)**.

**(1) 전체 성능 (overall performance)**

- 클로즈드 모델이 전 태스크 카테고리에서 오픈소스 대응 모델을 일관되게 상회.
- GPT-4o: Detection **95.92**로 최고, Modification **86.95**로 최고.
- Gemini-2.0-Flash: Understanding **95.28**로 최고.
- 그러나 Generation에서 두 모델 모두 뚜렷한 약점: Gemini-2.0-Flash **32.82**, GPT-4o **30.25**에 불과.
- 오픈소스 모델도 Detection·Understanding에서는 합리적으로 강한 성능(내용 추출·의미 이해 기초 능력 보유). 그러나 정밀 API 계획이 필요한 Modification·Generation에서 실패. 복잡한 슬라이드 편집·생성에 필요한 다단계 계획 능력의 제한을 부각.
- 모델 크기와 성능의 양의 상관: 전 모델 패밀리에서 대형이 우세. 예) Llama3.2-Vision 90B vs 11B, 특히 Modification에서 **51.19% vs 11.70%**로 대폭 상회. 대형 모델의 강한 추론 능력이 복잡 PPT 태스크 처리를 가능케 한다는 해석.

**(2) 의미 이해 vs 구조 조작의 격차**

- 네 태스크는 명확한 난이도 계층: **Detection << Understanding << Modification << Generation**.
- 대부분 모델이 앞 두 카테고리에서는 양호하나, 사용자 의도를 정밀하고 실행 가능한 API 연산으로 번역해야 하는 Modification에서 급락.
- 소형 모델(MiniCPM-V 8B, LLaVA-1.5 13B)에서 특히 두드러지며 점수가 거의 0으로 붕괴.
- Generation은 더 큰 도전. 원시 입력에서 일관되고 잘 구조화된 슬라이드 생성에 일관되게 실패. 최고 모델도 약 33%에 불과, 일부 오픈소스 모델은 거의 0점.
- 총평: 현재 MLLM은 PPT 태스크에서 시각 이해와 고수준 멀티모달 계획을 결합하는 데 고전한다.

### 5.3 Ablation: 입력 모달리티 기여 (§4.4, Figure 3)

- **설계:** 구조화 JSON 입력 vs 시각 슬라이드 스크린샷의 기여 분리.
  - Modification은 원본 JSON 표현 편집이 필수이므로 Image-only 구성 적용 불가.
  - Generation은 빈 슬라이드에서 시작하므로 ablation에서 제외.
- **결과:**
  - 이중 입력 구성이 대부분 모델·태스크에서 전반적으로 최고 성능.
  - **Detection·Modification은 JSON 구조 메타데이터의 이득이 큼.** 정밀 위치 인코딩·shape 수준 속성에 의존하기 때문.
  - **Understanding은 JSON 이득이 작고 스크린샷 시각 정보에 더 민감.** 차트·표 이해를 포함하며 둘 다 시각 단서·공간 관계에 크게 의존하기 때문.
  - 해석: MLLM은 이해에는 전체적 시각 의미(holistic visual semantics)를 활용하고, 정확한 조작에는 명시적 구조에 의존.
- **역설적 현상:** 한 모달리티를 제거했는데 성능이 오르는 사례가 여러 건 관찰. 소형 모델의 Modification에서 더 두드러짐. 제한된 멀티모달 융합 능력이 공간·의미 표현 정렬을 방해한다는 해석. 즉 작은 모델은 두 정보를 함께 주면 오히려 혼란.

### 5.4 Discussion 1: Chain-of-Thought의 영향 (§4.5.1, Table 3, §9.3)

- **방법:** 명시적 단계별 프롬프트 + 대표 케이스 2–4개를 가이드로 도입.
- **결과(Table 3은 변환본에서 행 라벨 손실, 서술 수치만 기재):**
  - Generation에서 큰 개선. 강한 모델·약한 모델 모두 향상: **GPT-4o 30.25% → 39.36%, Gemma3(12B) 11.75% → 33.15%**.
  - Detection·Understanding에서는 제한적 또는 부정적 효과. 과도한 추론이 주의 분산·오류 전파를 유발.
  - 해석: CoT는 사용자 의도 해석+다단계 액션 시퀀스 생성이 필요한 태스크에 가장 유익. 직접 시각 매칭에 의존하는 단순 태스크는 CoT 케이스의 잡음으로 방해받을 수 있음.
- **CoT 예시(§9.3):** Modification(제목 글꼴을 Arial Black으로 변경: slide_id 311, TITLE placeholder shape_id 722 식별 → choose_slide(311) → choose_shape(722) → set_font('Arial Black')), Generation(타이틀+이미지 2슬라이드 생성의 6단계 계획: create_slide(0) → choose_slide(256) → choose_shape(2) → insert_text → create_slide(8) → … → add_picture(141, 48, 432, 324, …))을 대표로 수록. CoT가 기하 추론·레이아웃 세련화·순차 API 실행을 직접 가이드함을 강조.

### 5.5 Discussion 2: 템플릿 가이드 생성 (§4.5.2, Figure 4, §9.2)

- **방법:** API 수준 생성 템플릿(API-level generation template)을 도입해 Generation 유도. 각 템플릿은 슬라이드 레이아웃·배경·타이포그래피·요소 배치를 명시하는 결정적 API 시퀀스로 구성된 정준 레이아웃 패턴. 3개 대표 템플릿:
  1. **Title Slide:** 명확한 시각 계층 수립. 배경 이미지 add_picture(0,0,720,540,…) + 메인 타이틀 add_text_box(60,160,600,100,…)+서식(483D8B, 32pt, CENTER, Arial Black) + 부제 설명(110,280,500,50, 2F4F4F, 24pt, Calibri, word wrap) + 날짜(210,415,300,30, 696969, 18pt).
  2. **Bullet Points Slide:** 텍스트 정렬·간격 중심. 제목(80,70,560,60, 28pt Arial Black, 483D8B) + 본문(100,130,520,360, LEFT, 22pt Calibri, 2F4F4F).
  3. **Image with Description Slide:** 시각-텍스트 협응. 배경 + 이미지(60,70,280,400) + 제목 텍스트(380,90,280,80, 32pt) + 설명(380,240,280,150, 18pt).
- **결과:**
  - 명시적 템플릿 제공이 생성 슬라이드 품질을 큰 폭으로 개선.
  - GPT-4o는 중간 정도 이득: **39.36% → 45.72%**.
  - Gemini-2.0-Flash는 더 두드러짐: **37.91% → 55.97%**. 고도 MLLM도 외부 구조 템플릿에서 이득을 얻음.
  - Gemma3(12B) 같은 소형 모델은 일관성 없는 효과.
- **역설적 발견:**
  - CoT 적용 시 유효(실행 가능) API 시퀀스 수가 **748개 → 531개**로 뚜렷이 감소.
  - 해석: CoT가 일부 출력 품질은 올리지만, 저품질·오류 CoT 단계가 모델의 순차 계획 능력을 방해해 실행 실패 유발. 현재 MLLM이 순차 계획과 시각 이해를 결합하는 데 고전한다는 더 깊은 한계를 반영한다는 가설. 이는 API 연산으로 일관되고 잘 정렬된 슬라이드 생성에 필수적인 능력.

### 5.6 Discussion 3: LLM-Judge vs Human (§4.5.3, Table 4)

Generation 평가의 다차원·주관성 문제를 LLM 평가의 신뢰성 검증으로 대응.

| Judge | LLM 점수 | Human 점수 | Spearman ρ |
|---|---|---|---|
| OpenAI GPT-4o | 30.25 | 28.37 | 0.86 |
| Gemini-2.0-Flash | 32.82 | 32.59 | 0.89 |

- LLM 판정과 인간 전문가 점수 간 강한 일치. LLM 기반 평가의 신뢰성 확인.

### 5.7 Case Study: 레이아웃 실패 4종 (§4.6, Figure 5)

PPTBench의 고유 측면은 MLLM의 슬라이드 레이아웃 추론 능력 평가. 태스크는 다르지만 모두 레이아웃 관련 오류 중심인 4개 대표 실패 사례:

1. **Detection:** 작은 슬라이드 번호 박스를 지배 요소로 오인식. 큰 중앙 텍스트 영역을 간과.
2. **Understanding:** 차트 라벨은 추출했으나 공간 비율 해석 실패. 원형 차트에서 최대 섹터를 잘못 판단.
3. **Modification:** 표를 잘못된 방향으로 이동시키는 API 시퀀스 생성. 부정확한 공간 추론으로 심각한 겹침 유발.
4. **Generation:** 텍스트·시각 요소 자체는 올바르게 생성했으나 이미지를 글머리 기호 위에 직접 배치. 전체적 레이아웃 계획 부재 입증.
- 총평: 현재 VLLM은 레이아웃 정보를 추론 과정에 통합하는 데 고전. 개별 요소는 이해해도 공간 구조를 효과적으로 활용하지 못해, 정확한 기하·구성 추론에 의존하는 PPT 태스크 수행이 제한됨.

### 5.8 결론 서술 (§5)

- PPTBench는 레이아웃 이해·디자인 추론 평가를 강화하는 종합 벤치마크. 네 상호 연결 태스크로 추출·추론·수정·생성 수준의 총체적 평가 가능.
- 의미 이해와 공간 조작 사이의 지속적 격차는 텍스트 의미와 공간 정보의 협응 능력 제한을 반영.
- CoT 추론·API 템플릿 통합은 구조화 편집·레이아웃 계획에서 명확한 이득. 그러나 현재 VLLM이 순차 계획과 시각 이해를 통합하는 데 여전히 고전하며, API 의미의 완전 활용과 깨끗하고 잘 조직된 슬라이드 산출이 제한됨.
- 향후 연구: 실제 프레젠테이션 자동화를 위해 의미·구조·시각 디자인의 더 긴밀한 융합을 위한 템플릿의 효과적 활용 탐색.

---

## 6. 한계와 후속 과제

### 6.1 논문이 명시한 한계·향후 과제 (원문 근거)

- **명시적 Limitations 섹션은 없음** (원문 미기재: §5 Conclusions에 통합 서술).
- §5·§4.5에서 인정한 한계·과제:
  1. 의미·구조·시각 디자인의 긴밀한 융합 미달성. 템플릿의 더 효과적 활용을 향후 연구로 제시.
  2. 순차 계획+시각 이해 통합 부족. CoT·템플릿이 개선하나 근본 해결이 아님.
  3. 시각 단서와 JSON 기반 레이아웃 구조 결합의 어려움(Ablation·서론·초록 반복 언급).
  4. API 계획 능력에 시각 정보 통합 실패(초록·서론 명시).

### 6.2 정리자가 본 방법론적 한계 (논문 내용에 근거, [정리자 지적] 표기)

1. **[정리자 지적] 소스 도메인 편향.** 958개가 정부 프레젠테이션 위주(공공정책·교육·기술), 영어, 4:3 지배, 2015–2023년(§6.3). 상업·마케팅·학술·다국어·16:9·최신 디자인 트렌드의 대표성이 제한적. "diverse domains and styles"(§1) 주장과 실제 소스 설명 사이에 긴장 존재.
2. **[정리자 지적] 레이아웃 이슈의 합성(synthetic) 구축.** Layout detection의 겹침·경계 초과를 커스텀 알고리즘의 제어된 변형으로 시뮬레이션(§7.3). 실제 전문가 슬라이드의 미묘한 오정렬·불균형과 분포가 다를 수 있음.
3. **[정리자 지적] Modification 지표의 엄격성.** 실행 후 JSON 완전일치(Acc_mod)는 위치·색·스타일 전 속성의 정확 일치를 요구(§4.2). 의미적으로 동등하나 수치로 미세하게 다른 유효 편집(예: 1px 차이, 동등 색 표현)을 오답 처리할 가능성. 관용도 기반 지표와의 비교 없음.
4. **[정리자 지적] Generation 평가의 순환성 위험.** 평가자 Gemini-2.0이 피평가자 Gemini-2.0-Flash와 동 계열(§4.2, §4.1). 인간 일치도(ρ 0.86–0.89, Table 4)로 신뢰성을 뒷받침하나, 평가자-피평가자 독립성·자체 선호(self-preference) 분석은 없음.
5. **[정리자 지적] 오픈소스 양자화 편향.** 오픈소스 모델을 ollama 4비트 양자화로 배포(§9.1). "추론 품질 유지" 주장이나 양자화 전후 비교 수치 없음. 클로즈드(풀 정밀도 API) vs 오픈소스(4비트) 비교의 공정성에 영향 가능.
6. **[정리자 지적] API 표현력의 상한.** 17개 API는 텍스트·그림·기본 서식에 집중되고, 차트·표·도형 스타일·애니메이션·마스터/테마 조작에 대한 원자 함수는 목록에 없음(§9.2 목록 기준). 차트·표 이해는 평가하면서 생성·수정은 텍스트·이미지 중심인 비대칭.
7. **[정리자 지적] Note Generation의 위치 모호.** Generation 하위태스크이나 API 실행 기반이 아니라 텍스트 생성에 가까움. 평가 루브릭(0–5 디자인 품질)이 노트 텍스트에 그대로 적용되는지, 별도 지표가 있는지 **원문 미기재**.
8. **[정리자 지적] 서브태스크별 N·난이도 보고 부족.** 총 4,439 샘플·11 서브태스크는 명시되나 서브태스크별 샘플 수·길이 분포가 본문 수치표로 없고 Figure 2에만 의존(변환본에서 수치 소실). 카테고리 평균이 어떤 서브태스크에 좌우되는지 판단 불가.
9. **[정리자 지적] CoT 유효 시퀀스 감소의 메커니즘 미해명.** 748→531 감소는 보고되나(§4.5.2), 실패 유형(API명 오류 vs 인자 오류 vs 순서 오류 vs 실행 예외)의 분류·비율은 없음.

---

## 7. Typodeck 관련성

Typodeck 맥락: Slide Markdown → Slide IR(버전관리 중간표현) → Composition Engine → 네이티브 편집가능 PPTX 생성 파이프라인. Visual Critic(이미지+구조 하이브리드 평가), Grammar Registry(버전관리 시각 시스템), Validation-Repair 게이트, 38개 Composition Candidate, 참고 슬라이드 재현 벤치마크 보유. 목표 방향: Valid PPTX → Good Layout → Intended Visual Hierarchy(의도 의미 중요도 = 지각 시각 중요도 일치).

### 7.1 직접 연결점 (논문 내용에 근거)

1. **JSON+스크린샷 이중 입력 ↔ Slide IR + Visual Critic**
   - PPTBench의 핵심 설계가 구조화 JSON(좌표·서식·계층)과 스크린샷의 결합(§3.3.1, §7.2). Typodeck의 Slide IR(구조 중간표현)과 Visual Critic(이미지+구조 하이브리드 평가)은 동일한 이중 표현 철학. PPTBench의 Ablation 결과(Detection·Modification은 JSON에, Understanding은 시각에 민감, §4.4)는 Typodeck 평가 설계에 직접 이전 가능: 유효성 검증은 IR/JSON 수치로, 의미·계층 판단은 렌더 이미지로 분담하는 근거가 됨.
2. **17개 원자 API ↔ Composition Engine·Validation-Repair 게이트**
   - PPTBench API의 3원칙(Atomicity·Composability·Executability, §9.2)은 Typodeck Composition Engine의 연산 설계 원칙으로 참조 가능. 특히 Modification 지표가 "실행 후 JSON 완전일치"로 정의된 점(§4.2)은 Validation-Repair 게이트의 통과 기준(수치적 구조 일치)과 정확히 대응. PPTBench의 choose_slide→choose_shape→set_* 순차 의존성은 Typodeck IR 연산의 선행조건(precondition) 설계에 참고 가능.
3. **API 템플릿 3종 ↔ Grammar Registry·38개 Composition Candidate**
   - PPTBench의 Title·Bullet·Image-with-Description 템플릿이 Generation을 GPT-4o 39.36→45.72, Gemini 37.91→55.97로 끌어올린 결과(§4.5.2)는 구조 사전(structural prior)의 효과를 실증. Typodeck의 Grammar Registry(버전관리 시각 시스템)와 38개 Composition Candidate는 이를 체계화·확장한 형태로 위치시킬 수 있음. PPTBench 템플릿이 하드코딩된 3개 API 시퀀스인 반면 Grammar Registry는 버전관리·조합 가능 체계라는 대비가 Typodeck 차별점 서술에 유용.
4. **LLM-as-a-Judge 6점 루브릭 ↔ Visual Critic·참고 슬라이드 재현 벤치마크**
   - PPTBench의 0–5 루브릭(§4.2, §8.1)과 인간 일치도 ρ 0.86–0.89(Table 4)는 Typodeck Visual Critic의 평가자 신뢰성 검증 방법론으로 직접 차용 가능. 특히 Figure 10의 점수대별 예시 시각화는 Typodeck 재현 벤치마크의 채점 기준 캘리브레이션 방식과 호환.
5. **4종 레이아웃 실패 ↔ Typodeck 목표 단계의 근거**
   - 지배 요소 오인식·차트 비율 오판·겹침 유발 이동·이미지-불릿 중첩(§4.6)은 Typodeck의 "Valid PPTX → Good Layout → Intended Visual Hierarchy" 단계론에 대한 실증 근거. PPTBench 모델들이 Valid(실행 가능 API)까지는 도달해도 Good Layout(정렬·간격·겹침 없음)과 Intended Hierarchy(지배 요소·시각 강조의 의도 일치)에서 실패한다는 해석이 가능.

### 7.2 활용 아이디어 (논문 내용에 근거, 추측은 표기)

1. **PPTBench를 Typodeck 외부 검증 벤치로 채택.** 958개 PPT·4,439 샘플·공개 코드/데이터(§3.1, Abstract)를 그대로 사용해 Typodeck 파이프라인의 Detection·Modification·Generation 점수를 측정하면 기존 MLLM 결과(Table 2 서술 수치)와 직접 비교 가능. [추측] Typodeck의 결정적 Composition Engine은 Modification 완전일치 지표에서 LLM 직접 API 생성보다 유리할 가능성이 있으나 실측 필요.
2. **CoT+템플릿 2단 생성을 Composition Engine에 이식.** PPTBench에서 CoT(의도 해석·다단계 계획)와 API 템플릿(구조 사전)의 조합이 Generation 최대 +18%p(Gemini 37.91→55.97) 효과를 낸 점(§4.5.1–§4.5.2)을 근거로, Typodeck도 "Markdown 의도 파싱(CoT 유사) → Grammar 후보 선택(템플릿 유사) → IR 연산 실행" 3단 구조의 정당성을 주장 가능.
3. **모달리티 분담 평가 설계.** Ablation에서 JSON이 조작에, 시각이 이해에 기여한 결과(§4.4)를 근거로 Visual Critic 내부에 "IR 수치 검사(겹침·경계·정렬)"와 "렌더 이미지 판단(계층·강조·균형)"의 2채널 점수를 분리하고 가중합하는 설계 채택 가능.
4. **실패 분류 체계 차용.** §4.6의 4종 실패를 Typodeck Validation-Repair 게이트의 오류 코드 체계(지배요소·비율·겹침·중첩)로 확장. [추측] PPTBench 실패가 공간 추론 부재에서 오므로 Typodeck의 결정적 기하 검사기가 이를 선제 차단한다는 주장이 가능하나, PPTBench 데이터에서의 실측이 선행돼야 함.
5. **인간 일치도 프로토콜 모방.** Table 4의 LLM vs Human+Spearman ρ 보고 형식을 Typodeck Visual Critic 신뢰성 검증에 그대로 적용. ρ 0.85 이상을 공개 기준으로 삼는 방안.

### 7.3 주의점 (논문 내용에 근거)

1. **지표 엄격성 차이.** PPTBench Modification은 JSON 완전일치를 요구(§4.2)하므로 Typodeck의 관용도 기반 게이트와 점수 직접 비교 시 불리할 수 있음. 비교 시 동일 지표(완전일치 vs 관용도)로 재정규화 필요.
2. **도메인 불일치.** PPTBench 소스가 정부 문서·영어·4:3 위주(§6.3). Typodeck 목표 도메인이 다르면(예: 마케팅·한글·16:9) 전이 성능을 별도 검증해야 함.
3. **API 범위 불일치.** PPTBench 17개 API에 차트·표 생성 함수가 없음(§9.2). Typodeck이 차트·표를 네이티브 생성한다면 PPTBench Generation 점수만으로 능력을 대표할 수 없음.
4. **평가자 계열 주의.** PPTBench Generation 평가자가 Gemini-2.0(§4.2). Typodeck Visual Critic이 동일 계열이면 자체 선호 논란 가능. 인간 평가 병행(Table 4 방식) 권장.
5. **CoT 실행 실패율.** CoT가 품질을 올리지만 유효 시퀀스를 748→531로 감소(§4.5.2). Typodeck에 CoT 유사 단계를 넣을 경우 Validation-Repair 게이트의 재시도·복구율이 함께 설계돼야 함.

---

## 8. 인용 포인트 (Typodeck 논문용 주장 3개)

1. **주장:** "최신 MLLM도 슬라이드 내용 이해에는 강하지만 공간 레이아웃 생성에는 체계적으로 실패하므로, 생성 파이프라인에 결정적 레이아웃 검증·복구 단계가 필요하다."
   - **원문 근거:** §4.3 난이도 계층 Detection << Understanding << Modification << Generation. 최고 모델 Generation 약 33%(Gemini-2.0-Flash 32.82, GPT-4o 30.25), 일부 오픈소스 거의 0점. §4.6 케이스 스터디의 겹침·중첩·오배치 4종 실패.
2. **주장:** "구조 사전(structural template)은 MLLM 슬라이드 생성 품질을 크게 올리는 실증된 수단이며, 버전관리되는 시각 문법 체계로 확장할 동기가 된다."
   - **원문 근거:** §4.5.2 템플릿 가이드 생성. GPT-4o 39.36%→45.72%, Gemini-2.0-Flash 37.91%→55.97%. 3종 API 템플릿(Title·Bullet·Image-with-Description, §9.2).
3. **주장:** "JSON 구조 정보와 렌더 이미지는 상호보완적이어서, 조작 정확도에는 구조 표현이, 의미·차트/표 이해에는 시각 정보가 우세하게 기여한다."
   - **원문 근거:** §4.4 Ablation. 이중 입력이 전반 최고. Detection·Modification은 JSON 이득이 크고, Understanding(차트·표 포함)은 시각 정보에 민감. 소형 모델에서 모달리티 결합 시 오히려 성능 저하 사례.

---

## 부록: 수치·사실 대조표 (원문 기준)

| 항목 | 수치·사실 | 출처 |
|---|---|---|
| 총 샘플 | 4,439 | Abstract, §1, §3.1 |
| 원본 PPT 수 | 958 | Abstract, §3.3, §6 |
| 카테고리·서브태스크 | 4개·11개 | §3.1 |
| 원자 API 수 | 17 | §3.3.3, §9.2 |
| 객관식 어노테이터 일치율 | 98% (2명) | §3.3.2 |
| Understanding 2차 검토 | 10% 항목, 98% 정확률 | §7.3 |
| 텍스트 이해 선정 슬라이드 | 600개 | §7.3 |
| 평균 슬라이드/프레젠테이션 | 23.7 (중앙값 19) | §6.1 |
| 평균 shape/슬라이드 | 4.9 | §6.2 |
| Shape 분포 | 텍스트·기본도형 ~60%, 이미지 25%, 차트 15% | §6.2 |
| 데이터 기간·종횡비 | 2015–2023, 4:3 지배 | §6.3 |
| GPT-4o Detection/Modification | 95.92 / 86.95 | §4.3 |
| Gemini Understanding/Generation | 95.28 / 32.82 | §4.3 |
| GPT-4o Generation | 30.25 | §4.3 |
| Llama 90B vs 11B Modification | 51.19 vs 11.70 | §4.3 |
| CoT Generation GPT-4o | 30.25→39.36 | §4.5.1 |
| CoT Generation Gemma3 12B | 11.75→33.15 | §4.5.1 |
| 템플릿 GPT-4o | 39.36→45.72 | §4.5.2 |
| 템플릿 Gemini | 37.91→55.97 | §4.5.2 |
| CoT 유효 시퀀스 | 748→531 | §4.5.2 |
| LLM-Human ρ | 0.86 (GPT-4o), 0.89 (Gemini) | Table 4, §4.5.3 |
| 하드웨어 | A100 40GB ×8, Xeon ×2, 256GB RAM | §9.1 |
| 추론 설정 | temp 0, top_p 0.95, ctx 2048, batch 1, 4비트 양자화(오픈소스) | §4.1, §9.1 |
| 코드/데이터 | GitHub 공개 | Abstract |

**변환본 손실로 원문 미기재 처리한 항목:** Table 2 전체 행렬(모델×카테고리 세부 점수), Table 3 전체 행렬(CoT 전후 전 모델), Table 1 행 라벨(태스크명 매핑), Figure 2 서브태스크별 N, Figure 3/4/6/7/8/10/11의 그래프·이미지 내 수치, Note Generation 전용 평가 여부.
