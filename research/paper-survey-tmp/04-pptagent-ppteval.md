# PPTAgent 논문 전문 정리 (Typodeck용)

## 0. 서지 정보

- **제목:** PPTAgent: Generating and Evaluating Presentations Beyond Text-to-Slides
- **저자:** Hao Zheng†, Xinyan Guan† (†동등 기여), Hao Kong, Jia Zheng, Weixiang Zhou, Hongyu Lin, Yaojie Lu, Ben He, Xianpei Han, Le Sun
- **소속:** Chinese Information Processing Laboratory, Institute of Software, Chinese Academy of Sciences / University of Chinese Academy of Sciences / Shanghai Jiexin Technology
- **발표처/연도:** EMNLP 2025 (과제 지정 기준). 원문 자체는 arXiv 프리프린트 `2501.03936v3 [cs.AI] 2021-02-21` 표기.
- **arXiv 링크:** https://arxiv.org/abs/2501.03936 (PDF: `/pdf/2501.03936v3`)
- **라이선스:** CC BY 4.0 (arXiv HTML 표기)
- **코드/데이터:** https://github.com/icip-cas/PPTAgent (초록 명시. "PPTAgent and PPTEval codebases" + 신데이터셋 Zenodo10K 공개)
- **데이터셋:** Zenodo10K — Zenodo(European Organization for Nuclear Research and OpenAIRE, 2013)에서 수집한 10,448개 프레젠테이션. 라이선스 명확한 것만 수집.
- **원문 형태:** arXiv HTML 변환본(LATeXML). 일부 표(Table 2/3/6 헤더, API 함수명, Figure 내 프롬프트 전문)는 이미지·수식 변환 누락으로 깨짐. 아래에서 해당箇所는 '원문 HTML 변환본 표기 기준'으로 별도 표기.

---

## 1. 한눈 요약 (5문장)

1. 이 논문은 문서→프레젠테이션 생성을 기존의 text-to-slides(요약 후 템플릿·규칙으로 변환)가 아니라, 인간 작업흐름에서 착안한 **참조 기반 2단계 편집(edit-based) 과정**으로 재정의한다.
2. 제안 방법 **PPTAgent**는 Stage I에서 참조 프레젠테이션을 분석(슬라이드 클러스터링 + 콘텐츠 스키마 추출)하고, Stage II에서 아웃라인 생성 후 참조 슬라이드를 선택해 일련의 실행 가능한 편집 액션(코드)으로 새 슬라이드를 만든다.
3. XML 대신 **HTML 렌더링 표현 + edit API + REPL 실행 피드백 기반 self-correction(슬라이드당 최대 2회)** 으로 LLM이 레이아웃·스타일을 보존하면서 강건하게 편집하게 한다.
4. 평가를 위해 참조-free 3차원 평가 프레임워크 **PPTEval(Content·Design·Coherence, 1~5점 + 근거)** 을 제안한다. Content·Design은 슬라이드 단위 평균, Coherence는 덱 전체 단위 평가이다.
5. 실험에서 PPTAgent는 베이스라인(DocPres 규칙기반, KCTV 템플릿기반) 대비 세 차원 전부에서 유의미하게 우수했고(대표 평균 3.67, Coherence 4.48, 성공률 ≥95%), PPTEval은 인간 평가와 평균 Pearson 0.71의 상관으로 기존 지표(PPL·ROUGE-L·FID)의 불일치를 대체·보완함을 보였다.

---

## 2. 연구 문제와 배경

### 2.1 과제: 문서로부터의 자동 프레젠테이션 생성

- 프레젠테이션은 시각적 효과로 청중을 끌어들이는 널리 쓰이는 정보 전달 매체이다(서론, Fu et al., 2022 인용).
- 고품질 프레젠테이션 제작에는 세 가지가 동시에 필요하다(원문 서론):
  1. captivating storyline(매력적인 스토리라인),
  2. well-designed layouts(잘 설계된 레이아웃),
  3. rich, compelling content(풍부하고 설득력 있는 콘텐츠).
- 그래서 전 과정 자동화에 대한 관심이 커지고 있으며, LLM·MLLM의 일반화 능력을 활용하려는 시도들이 있다(Mondal et al., 2024; Maheshwari et al., 2024; Ge et al., 2025).

### 2.2 기존 패러다임의 한계 1: text-to-slides = 추상 요약 + 규칙/템플릿 변환

- 기존 접근은 전형적으로 **text-to-slides 패러다임**을 따른다. LLM 출력을 미리 정한 규칙·템플릿으로 슬라이드에 변환한다(서론, Figure 1).
- 선행 연구(Mondal et al., 2024; Sefid et al., 2021)는 프레젠테이션 생성을 **abstractive summarization 과제**처럼 다루며 텍스트 콘텐츠 중심이었다.
- 결과적으로 프레젠테이션의 **visual-centric nature**(Fu et al., 2022)를 간과하고, text-heavy하고 단조로운(monotonous) 슬라이드를 만들어 청중 몰입에 실패한다(Barrick et al., 2018 인용).
- 관련연구(§6) 분류:
  - **규칙기반:** Mondal et al., 2024; Bandyopadhyay et al., 2024(DocPres). 텍스트 강화 중심, 시각 소홀, 산출물이 매력 부족.
  - **템플릿기반:** Cachola et al., 2024(KCTV), 산업계 Tongyi(Alibaba) 등. 시각적으로는 낫지만 템플릿 어노테이션에 대규모 수작업이 필요해 확장성·유연성이 제한됨.

### 2.3 기존 패러다임의 한계 2: 평가는 콘텐츠만, 그것도 단편적으로

- 초록·서론의 문제의식: 기존 방법들은 **콘텐츠 품질의 개선과 평가에만 고립적으로(isolation) 집중**하고, 시각적 매력(visual appeal)과 구조적 일관성(structural coherence)을 간과한다. 이것이 실용성을 제한한다.
- 종합 평가 프레임워크의 부재가 논문의 또 다른 출발점이다. 기존 지표(PPL, ROUGE-L, FID)는 아래에서 보듯 PPTEval·인간 판단과 추세가 불일치한다(§4.5, §5.5).

### 2.4 인간 워크플로우에서의 착안

- 인간은 복잡한 프레젠테이션을 한 번에 처음부터 만들지 않는다. **모범 슬라이드를 참조로 고르고, 핵심 콘텐츠를 요약·전이(transfer)** 한다(Duarte, 2010).
- 이에 착안해 PPTAgent는 슬라이드 생성을 두 단계로 분해한다:
  1. 참조 슬라이드 선택,
  2. 단계적 편집.
- Figure 2 개요: Stage I에서 참조 슬라이드를 범주화(예: opening slide, bullet-point slide)하고, 새 슬라이드마다 적절한 참조를 골라 `replace_span` 같은 편집 액션들로 수정한다.

### 2.5 edit-based 접근의 두 가지 도전과제 (서론 명시)

1. **참조 선택의 어려움:** 프레젠테이션의 레이아웃·모달 복잡성 때문에 LLM이 직접 어떤 슬라이드를 참조해야 할지 정하기 어렵다. 핵심은 참조 프레젠테이션의 구조·콘텐츠 패턴에 대한 LLM의 이해를 높이는 것이다.
2. **편집 실행의 어려움:** 대부분 프레젠테이션은 PowerPoint XML 형식으로 저장되는데, 장황하고 중복이 많다(Gryk, 2022). Figure 11 예시처럼 1개 슬라이드 XML이 1,006줄에 달해 LLM이 강건하게 편집하기 어렵다.

---

## 3. 핵심 기여 (원문 §1 번호 목록 그대로 + 부연)

1. **PPTAgent 제안:** 자동 프레젠테이션 생성을 참조 프레젠테이션에 안내되는 edit-based 과정으로 재정의한 프레임워크.
2. **PPTEval 제안:** Content·Design·Coherence 3차원으로 평가하는 종합 평가 프레임워크.
3. **코드·데이터 공개:** PPTAgent·PPTEval 코드베이스와 새 프레젠테이션 데이터셋 **Zenodo10K**를 공개해 후속 연구 지원.

---

## 4. 방법론 상세

원문 §2(PPTAgent) → §3(PPTEval) → 부록 D/E/B/F 순서를 따른다.

### 4.1 문제 정의 (§2.1, 수식 1~2)

- **기존 방식(수식 1):** 입력 콘텐츠 C가 주어지면 n개 슬라이드 요소를 직접 생성한다.
  - `S = {e1, e2, ..., en} = f(C)`
  - 각 요소는 타입·콘텐츠·스타일 속성으로 정의. 예: `(Textbox, "Hello", {border, size, position, ...})`.
  - 단순하지만 스타일 속성을 수동 지정해야 해서 자동 생성에 어렵다(Guo et al., 2023 인용).
- **PPTAgent 방식(수식 2):** 입력 콘텐츠 C와 참조 프레젠테이션에서 고른 j번째 참조 슬라이드 Rj가 주어지면, m개 실행 가능 액션 시퀀스를 생성한다.
  - `A = {a1, a2, ..., am} = g(C, Rj)`
  - 각 액션 ai는 실행 가능한 코드 한 줄에 해당.
  - 처음부터 만들지 않고 참조 슬라이드를 편집하므로, 잘 설계된 레이아웃·스타일을 보존한다.

### 4.2 Stage I: Presentation Analysis (§2.2)

목표: 참조 선택과 슬라이드 생성을 돕기 위해 참조 프레젠테이션을 이해한다. 두 하위 단계.

#### 4.2.1 Slide Clustering

- 슬라이드를 기능(functionality) 기준 두 대분류로 나눈다:
  - **structural slides:** 프레젠테이션 구성을 지탱(예: opening slide),
  - **content slides:** 구체 정보 전달(예: bullet-point slide).
- **structural slides 처리:** LLM의 long-context 능력을 활용해 입력 프레젠테이션 전체 슬라이드를 분석하고, structural slide를 식별한 뒤 텍스트 특징 기반 구조적 역할(structural role)을 라벨링하고 그룹화한다.
- **content slides 처리:**
  1. 슬라이드를 이미지로 변환,
  2. 계층적 클러스터링(hierarchical clustering)으로 유사 슬라이드 이미지 그룹화,
  3. MLLM으로 변환 이미지들을 분석해 각 클러스터 내 레이아웃 패턴 식별.
- 세부(부록 D + Algorithm 1):
  - 유사도 임계값 **θ = 0.65**.
  - 레이아웃에만 집중하도록 전처리: 텍스트 콘텐츠는 플레이스홀더 문자("a")로, 이미지 요소는 단색 배경(solid-color background)으로 치환.
  - 변환 슬라이드 이미지의 **ViT 임베딩**(Wu et al., 2020) 기반 코사인 유사도로 슬라이드 쌍 유사도 행렬 계산.
  - Algorithm 1(원문 그대로): 유사도 행렬 S∈R^{N×N} 입력. `max(S) ≥ θ`인 동안 가장 유사한 쌍 (i,j)를 찾아 기존 클러스터에 있으면 병합, 없으면 신규 클러스터 생성. 사용된 행·열을 0으로 갱신하고 반복. Figure 9에 클러스터 예시.
- 관련 프롬프트: 부록 F.1, Figure 12(structural slide 클러스터링용), Figure 13(레이아웃 패턴 추론용). 프롬프트 전문은 figure 이미지로만 있어 **원문 미기재(텍스트 변환본에 없음)**.

#### 4.2.2 Schema Extraction

- 클러스터링 후 각 클러스터 슬라이드의 **콘텐츠 조직(content organization)** 을 파악하기 위해 콘텐츠 스키마를 추출한다. 슬라이드 요소에 대한 명확하고 구조화된 기술(description)을 제공한다.
- 추출 프레임워크: 각 요소를 **category(범주) · description(설명) · content(data)(내용)** 로 표현.
- 원문 예시(표 그대로):

  | Category | Description | Data |
  |---|---|---|
  | Main title | Sample Library | (원문 HTML에서 빈칸) |
  | Date of the event | 15 February 2018 | (원문 HTML에서 빈칸) |
  | Primary image to illustrate the slide | Picture: Children in a library with … | (원문 HTML에서 빈칸) |

  - 주의: HTML 변환본에서 3열이 비어 보인다. 원 PDF에서는 category/description/data 배치일 가능성. **열 귀속은 원문 HTML 변환본 표기 기준 불확실.**
- 상세 지침은 부록 F(Figure 14, 스키마 추출용 프롬프트). 전문은 이미지로만 있어 **원문 미기재**.
- 역할: 이후 참조 선택 시 슬라이드 단위 기능 기술(functional description)로 쓰고, 슬라이드 생성 시 가이던스로 쓴다(ablation에서 제거 시 성공률 하락).

### 4.3 Stage II: Presentation Generation (§2.3)

목표: 아웃라인을 먼저 만들고, 각 항목에 맞는 참조 슬라이드를 edit API로 반복 편집해 목표 프레젠테이션을 만든다.

#### 4.3.1 Outline Generation

- Figure 2처럼 **LLM으로 구조화된 아웃라인**을 생성한다. 아웃라인은 다수 항목(entry)으로 구성.
- 각 항목 = 새 슬라이드 1개에 대응하며, 다음을 포함:
  - **참조 슬라이드:** Stage I의 슬라이드 단위 기능 기술 기반 선택.
  - **관련 문서 콘텐츠:** 입력 문서 기반 식별.
- 프롬프트: 부록 F.2 Figure 15. 전문 **원문 미기재**.

#### 4.3.2 Slide Generation

- 구조화된 아웃라인에 안내되어 대응 항목 기반으로 슬라이드를 **반복적으로(iteratively)** 생성한다.
- 각 슬라이드마다 LLM은 입력 문서의 텍스트 콘텐츠 + 추출된 이미지 캡션을 통합한다.
- 새 슬라이드는 참조 슬라이드의 레이아웃을 채택하면서 콘텐츠 일관성과 구조적 명확성을 보장한다.
- **Edit-based API 설계:** 참조 슬라이드를 편집하도록 LLM이 쓸 수 있게 한다. 원문 나열(HTML 변환본에서 함수명 열이 소실되어 설명만 남음):
  - Delete a span.
  - Delete an image element.
  - Create a duplicate of an existing paragraph.
  - Replace the content of a span.
  - Replace the source of image.
  - 본문에서 예시로 `replace_span` 언급. 나머지 정확한 함수 시그니처·인자는 **원문 미기재**(Figure 17 편집 액션 생성 프롬프트도 이미지).
- **HTML 렌더링 표현:** 프레젠테이션 XML의 복잡성(부록 E) 때문에 참조 슬라이드를 **HTML 표현**(Feng et al., 2024)으로 렌더링한다. 더 정밀하고 직관적이어서 이해가 쉽다. 이 HTML 형식 + edit API 조합으로 정밀한 콘텐츠 수정을 가능하게 한다.
- **부록 E Code Interaction:** Figure 10은 HTML 렌더 예시, Figure 11은 같은 슬라이드 XML 표현의 처음 60줄(전체 1,006줄 중 발췌). XML 장황함의 근거.
- **Self-correction 메커니즘**(Kamoi et al., 2024 인용):
  - 생성된 편집 액션들을 **REPL 환경**(원문 각주: Wikipedia REPL)에서 실행한다.
  - 참조 슬라이드에 적용 실패 시 REPL이 **실행 피드백**(원문 각주: Python docs errors)을 제공한다.
  - LLM이 피드백을 분석해 편집 액션을 조정한다(Guan et al., 2024; Wang et al., 2024b). 유효 슬라이드가 나오거나 최대 재시도 횟수 도달까지 반복 정제한다.
  - 실험 설정: 슬라이드 생성당 **최대 2회 self-correction 반복** 허용(§4.2).
- 관련 프롬프트: Figure 16(슬라이드 콘텐츠 생성용), Figure 17(편집 액션 생성용). 전문 **원문 미기재**.

### 4.4 PPTEval (§3 + 부록 B + 부록 F.3)

#### 4.4.1 설계 철학

- 프레젠테이션용 **참조-free 평가(reference-free evaluation)의 부재**를 메우는 종합 프레임워크.
- **MLLM-as-a-judge 패러다임**(Chen et al., 2024a) 채택.
- 각 차원마다 **숫자 점수(1~5 척도) + 상세 근거(detailed rationales)** 를 제공한다.
- 확립된 프레젠테이션 디자인 원칙에 grounded(Duarte, 2008; Duarte, 2010). 세 핵심 차원에 집중.
- 평가 단위: 생성된 프레젠테이션이 주어지면 **content·design은 슬라이드 수준**, **coherence는 전체 프레젠테이션 수준**에서 평가.
- 전체 과정은 Figure 3, 상세 채점 기준·대표 예시는 부록 B와 Figure 8.

#### 4.4.2 세 차원 정의 (Table 1 + 부록 B)

HTML 변환본 Table 1은 행 레이블이 소실되어 기준 문구만 남았다. 부록 B 서술과 합쳐 정리한다.

1. **Content(콘텐츠):**
   - Table 1 기준 문구: "Text should be concise and grammatically sound, supported by relevant images."
   - 부록 B: 슬라이드에 제시된 정보(텍스트+이미지) 평가. 세 관점:
     - 정보량(amount of information),
     - 텍스트 콘텐츠의 명확성·품질(clarity and quality),
     - 시각 콘텐츠의 뒷받침(support provided by visual content).
   - 고품질 텍스트 = 명확하고 임팩트 있으며 적절한 정보량을 전달. 이미지는 텍스트를 보완·강화해 정보를 더 접근 가능하고 매력적으로 만들어야 한다.
   - 평가 방법: 슬라이드는 plain text로 쉽게 이해되지 않으므로 **슬라이드 이미지 대상 MLLM**으로 평가.
2. **Design(디자인):**
   - Table 1 기준 문구: "Harmonious colors and proper layout ensure readability, while visual elements like geometric shapes enhance the overall appeal."
   - 부록 B: 좋은 디자인은 주목을 끌 뿐 아니라 콘텐츠 전달을 강화한다. 세 측면:
     - 색상 설계(color schemes): 콘텐츠를 부각하는 명확한 대비 + 조화 유지.
     - 시각 요소(visual elements): 기하 도형 같은 요소로 표현력 강화.
     - 전체 디자인(overall design): 기본 원칙 준수. **요소 겹침(overlapping) 회피**, 디자인이 콘텐츠 전달을 방해하지 않을 것.
3. **Coherence(일관성/응집성):**
   - Table 1 기준 문구: "Structure develops progressively, incorporating essential background information."
   - 부록 B: 청중 몰입 유지에 필수. 논리 구조(logical structure) + 제공된 맥락 정보(contextual information) 기준 평가.
   - 모델이 captivating storyline을 구축하고, 청중이 끊김 없이 따라올 수 있게 맥락 정보로 풍부화(enriched)할 때 좋은 coherence.
   - 평가 방법: 프레젠테이션에서 추출한 논리 구조·맥락 정보를 분석해 평가.
   - 전부 1~5 척도.

#### 4.4.3 PPTEval 평가 절차·점수 체계

- **심판 모델:** §4.4에서 PPTEval은 **GPT-4o를 judging model**로 쓴다고 명시.
- **집계:** content·design 점수는 슬라이드들에 걸쳐 평균, coherence는 프레젠테이션 수준에서 평가(§4.4).
- **인간 검증 절차(부록 B):**
  - 상하이 기반 크라우드소싱 플랫폼으로 대학원생 4명 모집.
  - 총 250개 프레젠테이션 평가: Zenodo10K에서 무작위 50개(실세계) + 베이스라인 생성 100개 + 제안 방법 생성 100개.
  - PPTEval 틀·부록 F 채점 기준으로 3차원 평가. 변환된 슬라이드 이미지를 제공하고 개별 채점 후 논의해 합의로 최종 점수.
  - 평가자 간 일치도 Fleiss' Kappa 평균 **0.59**(Content 0.61, Design 0.61, Coherence 0.54). satisfactory agreement(Kwan et al., 2024 인용).
- **PPTEval 프롬프트:** Figure 18(content 기술용), 19(style 기술용), 20(content 추출용), 21(content 평가용), 22(style 평가용), 23(coherence 평가용). 전문은 이미지로만 있어 **원문 미기재**.

---

## 5. 실험 결과 상세

### 5.1 데이터셋 (§4.1 + 부록 A + Table 2/8)

- **기존 데이터셋의 두 문제:**
  1. PDF·JSON 저장으로 의미 정보 손실(요소 간 구조 관계·스타일 속성).
  2. 주로 AI 학술 프레젠테이션이라 다양성 부족.
  - 해당 데이터셋: Mondal et al., 2024; Sefid et al., 2021; Sun et al., 2021; Fu et al., 2022.
- **Zenodo10K 신규 구축:**
  - 출처 Zenodo(다양한 도메인 산출물, 명확한 라이선스).
  - **10,448개 프레젠테이션** 큐레이션 후 공개.
- **실험 샘플링:** Mondal et al., 2024를 따라 **5개 도메인에서 참조용 50개 프레젠테이션** 샘플링. 같은 도메인에서 **입력 문서 50개** 추가 수집.
  - 5개 도메인: Table 8 기준 **Culture, Education, Science, Society, Tech**.
  - 샘플링 기준·전처리 상세는 부록 A, 통계는 Table 2.
- **Table 2 통계(원문 HTML 변환본에서 행·열 레이블 소실):**
  - 캡션: 문자 수('#Chars')·그림 수('#Figs')·페이지 수('#Pages') 상세.
  - 본문에 남은 숫자 행(도메인 귀속 불명, 순서대로):
    - 12,708 / 2.9 / 6,585
    - 12,305 / 5.5 / 3,993
    - 16,661 / 4.8 / 5,334
    - 13,019 / 7.3 / 3,723
    - 18,315 / 11.4 / 5,325
  - **도메인-행 매핑은 원문 HTML 변환본 기준 복원 불가. 원 PDF Table 2 확인 필요.**
- **부록 A 전처리:**
  - 비용 관리 위해 **12~64페이지 프레젠테이션**, **2,048~20,480자 문서** 선택.
  - VikParuchuri(2023, marker)로 원본 문서에서 텍스트·시각 콘텐츠 추출. 텍스트는 섹션 단위 정리. 시각 콘텐츠는 이미지 캡션 생성해 텍스트 기술 기반 관련 이미지 선택 지원.
  - 중복 제거: 이미지 임베딩 코사인 유사도 **0.85 초과** 시 중복 이미지 제거. 슬라이드 단위: 앞 슬라이드 대비 텍스트 임베딩 코사인 **0.8 초과** 시 개별 슬라이드 제거(Fu et al., 2022 제안).

### 5.2 구현 상세 (§4.2)

- **사용 모델 3종:**
  - GPT-4o-2024-08-06 (GPT-4o),
  - Qwen2.5-72B-Instruct (Qwen2.5, Yang et al., 2024),
  - Qwen2-VL-72B-Instruct (Qwen2-VL, Wang et al., 2024a).
- 모델을 다루는 모달리티(텍스트·시각) 따라 구분. 표기는 언어모델(LM)+시각모델(VM) 조합. 예: `Qwen2.5_LM + Qwen2-VL_VM`.
- **작업 규모:** 5개 도메인 × 입력 문서 10개 × 참조 프레젠테이션 10개 = **구성당 500개 생성 작업**.
- 슬라이드 생성당 **최대 2회 self-correction**.
- 텍스트 임베딩: Chen et al., 2024b(BGE M3-embedding). 이미지 임베딩: Wu et al., 2020.
- 오픈소스 LLM은 **VLLM**(Kwon et al., 2023)으로 **NVIDIA A100**에 배포.
- 총 계산 비용 약 **500 GPU 시간**.

### 5.3 베이스라인 (§4.3)

- **DocPres**(Bandyopadhyay et al., 2024): 다단계로 내러티브 풍부한 슬라이드를 만드는 **규칙기반** 접근. 유사도 기반 메커니즘으로 이미지 통합.
- **KCTV**(Cachola et al., 2024): 중간 형식으로 슬라이드를 만든 뒤 미리 정의된 템플릿으로 최종 변환하는 **템플릿기반** 방법.
- 베이스라인은 시각 정보를 처리하지 않아 vision model 없이 동작.
- 참조 프레젠테이션이 필요 없어 구성당 **50개**(5 도메인 × 10 문서) 생성. 따라서 FID 평가는 제외.

### 5.4 평가 지표 (§4.4)

1. **Success Rate(SR, %↑):** 생성 강건성(Wu et al., 2024). 성공 완료 작업 비율.
   - PPTAgent: self-correction 후 실행 오류 없이 전 슬라이드 생성 시 성공.
   - KCTV: 생성 LaTeX 파일 컴파일 성공 시 성공.
   - DocPres: 결정적 규칙기반 변환이라 이 평가에서 제외.
2. **Perplexity(PPL↓):** 모델이 주어진 시퀀스를 만들 likelihood. **Llama-3-8B**(Dubey et al., 2024)로 프레젠테이션 내 전 슬라이드 평균. 낮을수록 텍스트 유창(DocPres 논문 기준).
3. **Rouge-L**(Lin, 2004): 생성-참조 텍스트 간 최장공통부분수열 기반 텍스트 유사도. **F1 보고**(정밀·재현 균형).
4. **FID**(Heusel et al., 2017): 생성-참조 프레젠테이션 간 특징공간 유사도. 표본 적어 **64차원 출력 벡터**로 계산.
5. **PPTEval:** GPT-4o를 심판으로 3차원 평가. content·design은 슬라이드 평균, coherence는 프레젠테이션 수준.

### 5.5 전체 결과 (§4.5 + Table 3/4/6/8)

#### 5.5.1 PPTAgent가 전체 품질 유의미 개선

원문 서술 수치 그대로(통계적 유의미하다고 명시, 검정 방법 자체는 **원문 미기재**):

- **vs DocPres(규칙기반):**
  - design·content 모두 큰 개선. 원문 표기: `(3.34 vs. 2.37, +40.9%; 3.34 vs. 2.98, +12.1%)`.
  - 주의: 두 항목 모두 3.34로 적혀 있어 순서상 design=3.34 vs 2.37, content=3.34(?) vs 2.98로 읽힌다. 뒤 KCTV 비교·Table 4(Qwen 구성 content 3.28/design 3.27)와 자리값이 엇갈린다. **대표 구성·소수점 귀속은 원 PDF Table 3 확인 필요.** 경향 자체는 design 개선폭이 가장 크고(+40.9%), DocPres 산출물은 디자인 노력이 최소라고 설명.
- **vs KCTV(템플릿기반):**
  - 원문 표기: design·content `(3.34 vs. 2.95, +13.2%; 3.28 vs. 2.55, +28.6%)`. edit-based 패러다임의 효능을 보여준다고 해석.
- **coherence에서 가장 두드러짐:**
  - 4.48 vs DocPres 3.57 (**+25.5%**),
  - 4.48 vs KCTV 3.28 (**+36.6%**).
  - 원인 귀속: 슬라이드 구조적 역할에 대한 종합 분석 덕분.
- 서론·§4.5 종합: PPTAgent 고품질 생성, **PPTEval 세 차원 평균 3.67**.

#### 5.5.2 강건한 생성 성능

- Qwen2.5_LM+Qwen2-VL_VM과 GPT-4o_LM+GPT-4o_VM 모두 **≥95% 성공률**.
- KCTV 대비 유의미 개선으로 `(97.8% vs. 88.0%)` 표기. 97.8%는 GPT-4o 구성 쪽으로 읽히나 **구성 귀속 라벨이 본문에서 명시적으로 붙지 않음. 원문 HTML 변환본 기준 불확실.**
- 도메인별 상세 성능(Table 8, Qwen 구성)은 §5.5.4에 분리.
- 방법의 다재·강건성을 보여준다고 해석.

#### 5.5.3 PPTEval의 우수한 평가 능력 (기존 지표와 불일치)

- PPL·ROUGE-L 같은 전통 지표는 PPTEval과 **평가 추세 불일치**.
- 대표 사례: KCTV는 **ROUGE-L 16.76**(높음)인데 content 2.55(낮음). 제안 방법은 반대로 **ROUGE-L 14.25**(낮음)인데 content 3.28(높음).
- 해석: ROUGE는 원본 문서와의 텍스트 정합을 과도 강조해 프레젠테이션 표현력을 해칠 수 있다.
- PPTEval의 진전: **참조-free 디자인 평가 + 프레젠테이션 coherence의 총체적 평가**라는 이중 능력. 추가 일치도 평가는 §5.5.

#### 5.5.4 도메인별 상세 (부록 C Table 8)

- 구성 표기가 HTML에서 `Qwen2-VL_LM+Qwen2-VL_VM`로 깨짐. 문맥상 `Qwen2.5_LM+Qwen2-VL_VM`의 오변환으로 보이나 **원문 PDF 확인 필요**.
- 지표: SR(%) / PPL / FID / PPTEval 3차원 평균.

  | Domain | SR(%) | PPL | FID | PPTEval 평균 |
  |---|---|---|---|---|
  | Culture | 93.0 | 185.3 | 5.00 | 3.70 |
  | Education | 94.0 | 249.0 | 7.90 | 3.69 |
  | Science | 96.0 | 500.6 | 6.07 | 3.56 |
  | Society | 95.0 | 396.8 | 5.32 | 3.59 |
  | Tech | 97.0 | 238.7 | 6.72 | 3.74 |

- 범위: SR 93~97%, PPTEval 평균 3.56~3.74. Tech가 평균 최고(3.74), Science가 최저(3.56). PPL은 Science(500.6)가 두드러지게 높으나 PPTEval 평균과 같은 방향으로 움직이지 않음(지표 불일치의 또 다른 예시).

#### 5.5.5 성공률 가중 성능 (부록 C Table 6/7)

- 실패 생성에 PPTEval 0점을 부여한 SR-weighted 성능.
- Table 6(방법 비교): HTML 변환본에서 SR(%) 열 숫자만 남음. `– / – / 80.0 / 88.0 / 97.8 / 43.0 / 95.0`.
  - 행이 7개라 구성 매핑 불가. 캡션은 DocPres·KCTV·PPTAgent 비교, SR·PPL·Rouge-L·FID·SR-weighted PPTEval 사용이라 명시. **행 라벨 원문 미기재(변환 소실).**
- Table 7(ablation 가중치 버전)은 §5.6에 병기.
- 부록 C 서술: GPT-4o가 여러 지표에서 일관되게 우수. Qwen2-VL은 멀티모달 post-training 트레이드오프로 언어 능력에 한계가 있으나, Qwen2.5 도입이 이를 완화해 GPT-4o와 대등, 최고 성능 달성. 오픈소스 LLM의 경쟁력을 강조.

### 5.6 Ablation Study (§5.1 + Table 4/7)

- 구성: **Qwen2.5_LM+Qwen2-VL_VM** 고정.
- 4개 제거 조건:
  1. **w/o Outline:** 참조로 무작위 슬라이드 선택.
  2. **w/o Structure:** 아웃라인 생성 시 structural slide 생략.
  3. **w/o CodeRender:** 슬라이드 표현을 Guo et al.(2023) 방식으로 교체.
  4. **w/o Schema:** 콘텐츠 스키마 가이던스 제거.
- Table 4(원문 HTML에서 Setting 열 소실. 본문 서술로 역매핑):

  | 설정(본문 서술 기반 추정, 순서 주의) | SR(%) | Content | Design | Coherence | Avg |
  |---|---|---|---|---|---|
  | Full (전체) | 95.0 | 3.28 | 3.27 | 4.48 | 3.67 |
  | w/o Outline (coh 3.36으로 추정) | 91.0 | 3.24 | 3.30 | 3.36 | 3.30 |
  | w/o Schema (SR 78.8로 추정) | 78.8 | 3.08 | 3.23 | 4.04 | 3.45 |
  | w/o Structure (coh 3.45로 추정) | 92.2 | 3.28 | 3.25 | 3.45 | 3.32 |
  | w/o CodeRender (SR 74.6으로 추정) | 74.6 | 3.27 | 3.34 | 4.38 | 3.66 |

  - 추정 근거(원문 §5.1 서술): "Code Render 제거 시 성공률 95.0%→74.6%", "outline·structural slide 제거 시 coherence 4.48→3.36/3.45", "slide schema 제거 시 성공률 95.0%→78.8%".
  - **행-조건 1:1 매핑은 원 PDF Table 4 확인 필요.** 특히 w/o Outline/w/o Structure 중 어느 쪽이 3.36이고 어느 쪽이 3.45인지는 본문에서 순서만 나열.
- 핵심 발견 2가지(원문 표현 그대로):
  1. **HTML 기반 표현이 상호작용 복잡도를 크게 낮춤.** Code Render 제거 시 성공률 95.0%→74.6%로 대폭 하락이 증거.
  2. **Presentation analysis가 생성 품질에 결정적.** outline·structural slide 제거 시 coherence 크게 하락(4.48→3.36/3.45). slide schema 제거 시 성공률 95.0%→78.8% 하락.
- Table 7(SR 가중 ablation, 같은 순서 추정):

  | 설정(추정) | SR | Content | Design | Coherence | Avg |
  |---|---|---|---|---|---|
  | Full | 95.0 | 3.11 | 3.10 | 4.25 | 3.48 |
  | w/o Outline 추정 | 91.0 | 2.94 | 3.00 | 3.05 | 3.00 |
  | w/o Schema 추정 | 78.8 | 2.42 | 2.54 | 3.18 | 2.71 |
  | w/o Structure 추정 | 92.2 | 3.02 | 2.99 | 3.18 | 3.06 |
  | w/o CodeRender 추정 | 74.6 | 2.43 | 2.49 | 3.26 | 2.73 |

  - 낮은 성공률이 전체 효능에 크게 영향(실패=0점 처리).

### 5.7 Case Study (§5.2, Figure 5)

- 서로 다른 구성의 대표 생성 예시를 Figure 5에 제시. PPTAgent는 서로 다른 참조(a)·(b) 하에서 생성.
- PPTAgent 우위 2가지:
  1. 문맥에 적절한 이미지 배치로 시각 요소를 효과 통합 + 간결하고 잘 구조화된 슬라이드 콘텐츠 유지.
  2. 다양한 참조 하에서 시각적으로 매력적인 슬라이드를 다양하게 생성.
- 베이스라인(DocPres·KCTV): 규칙·템플릿 패러다임 제약으로 **주로 텍스트 기반, 시각 변이 제한**.

### 5.8 Score Distribution (§5.3, Figure 4)

- 베이스라인: 규칙·템플릿 제약으로 content·design 모두 다양성 제한. 점수가 **2·3점에集中**.
- PPTAgent: 더 분산된 분포. content·design에서 **>80%가 3점 이상**.
- structural slide의 종합 고려 덕분에 coherence가 특히 우수. **80% 초과가 4점 초과(above 4)**.

### 5.9 Effectiveness of Self-Correction (§5.4, Figure 6)

- 슬라이드 1개 생성에 필요한 반복 self-correction 횟수를 모델별로 비교.
- GPT-4o가 Qwen2.5보다 self-correction 능력 우수. 반면 Qwen2.5는 첫 생성에서 오류가 더 적음.
- Qwen2-VL은 오류가 더 잦고 self-correction 능력도 떨어짐. 멀티모달 post-training 때문으로 추정(Wang et al., 2024a).
- 최종적으로 세 모델 모두 **절반 초과 오류를 성공 교정**. 반복 self-correction이 생성 성공을 효과 보장한다고 해석.

### 5.10 Agreement Evaluation (§5.5 + Table 5 + Figure 7)

#### 5.10.1 PPTEval vs 인간 선호

- 배경: Chen et al.(2024a)은 여러 생성 과제에서 LLM의 인간 유사 분별력을 강조. 그러나 Laskar et al.(2024)이 복잡 과제에서 LLM 평가자 부적절 가능성을 지적했으므로, 프레젠테이션 맥락에서 LLM-인간 상관 검증이 필요.
- Table 5(인간-LLM 평점 상관. HTML에서 열 어긋남):
  - 헤더 표기: `Correlation / Content / Design / Coherence / Avg`
  - 행 1: `0.70 / 0.90 / 0.55 / 0.71`
  - 행 2: `0.73 / 0.88 / 0.57 / 0.74`
  - 행 라벨 소실로 두 행이 각각 무엇인지(예: Pearson/Spearman인지, 모델별인지) **원문 미기재(변환 소실)**. 캡션은 "different dimensions(Coherence, Content, Design) 간 상관. 전부 p<0.05로 통계 유의".
- 본문 수치: **평균 Pearson 상관 0.71**. 다른 평가 방법들(Kwan et al., 2024) 점수를 상회. PPTEval이 인간 선호와 잘 정렬된다고 해석.

#### 5.10.2 PPTEval vs 기존 지표

- PPTEval content·design 차원과 기존 지표 간 Pearson 상관 분석(Figure 7 heatmap).
- 현재 지표들이 프레젠테이션 평가에 비효과적:
  - **PPL:** 텍스트 유창 측정 중심. 슬라이드 콘텐츠의 단편적(fragmented) 특성 탓에 성능 저조, 이상치(outlier) 빈발.
  - **ROUGE-L·FID:** 각각 참조 텍스트·참조 프레젠테이션과의 유사도 정량화. 그러나 참조에 높은 적합이 프레젠테이션 효능을 보장하지 않으므로 content·design 품질 평가에 부적절.
- 약한 상관들이 양쪽(콘텐츠 품질+디자인 효능)을 보는 강건하고 종합적인 평가로서 PPTEval의 필요성을 보여준다고 해석.

### 5.11 관련 연구·결론 (§6~7)

- §6 세 갈래: Automated Presentation Generation(규칙 vs 템플릿) / LLM Agent(실행 가능 액션으로 과제 수행 Wang et al., 2024b; API 통합 Guo et al., 2023) / LLM as a Judge(지시 추종·맥락 지각. Liu et al., 2023; Zheng et al., 2023; MLLM 심판 Chen et al., 2024a; 다차원 Kwan et al., 2024; 단일 슬라이드 Ge et al., 2025 — 그러나 총체적 관점 평가는 없음).
- §7 결론: PPTAgent는 LLM의 코드 이해·생성 능력으로 완성하는 2단계 프레젠테이션 편집 과제로 개념화. PPTEval로 정량 지표 제공. 다도메인 실험에서 우월 입증. **비지도 조건(unsupervised) 하 슬라이드 생성의 새 패러다임** 제공 및 후속 연구 통찰.

---

## 6. 한계와 후속 과제

### 6.1 논문 명시 한계 (Limitations 절, 3가지)

1. **가끔 생성 실패:** 데이터셋에서 높은 성공률(>95%)에도 불구하고 가끔 실패. 신뢰도(reliability) 제한 가능.
2. **참조 의존성:** 고품질 전처리 참조를 제공할 수 있어도, 생성 품질이 입력 참조 프레젠테이션 품질에 영향받음. 차선(suboptimal) 산출 가능.
3. **시각 정보의 불완전 활용:** 레이아웃 최적화가 선행 대비 개선됐으나, 슬라이드 디자인 정제에 시각 정보를 충분히 활용하지 못함. **요소 겹침 같은 간헐적 디자인 결함 → 가독성 저해.** 후속 과제로 강건성 강화, 참조 의존 감소, 생성 과정에 시각 정보 더 잘 통합을 제시.

### 6.2 정리자가 본 방법론적 한계 (논문 외부 해석 — '정리자 해석' 표기)

1. **[정리자 해석] 참조 품질 편향의 정량화 부재:** 참조 의존을 한계로 인정하지만, 참조 품질(고/저)별 생성 품질 민감도 실험·참조-생성 품질 상관 분석은 본문에 없음. 참조 선택 가이드라인(좋은 참조의 조건)이 경험칙으로 남는다.
2. **[정리자 해석] 디자인 결함의 탐지-수리 루프 부재:** self-correction은 **실행 오류**(REPL 피드백) 기준이지 **시각 결함**(겹침·대비·정렬) 기준이 아니다. 렌더 이미지 기반 critic·repair 단계가 없어 한계 3(겹침)이 구조적으로 남는다.
3. **[정리자 해석] Coherence 평가의 텍스트 편향 가능:** coherence를 "추출된 논리 구조·맥락 정보" 분석으로 평가한다고 하나, 추출물이 텍스트 요약물인지, 시각 순서·섹션 구분자 같은 덱 단위 시각 리듬까지 보는지 본문에서 불명확. 슬라이드 이미지 기반 content/design과 달리 coherence의 입력 모달리티가 명시적으로 규정되지 않음(**원문 미기재**에 가까움).
4. **[정리자 해석] 통계 보고의 불완전:** "통계적 유의미" 언급이 있으나 검정 방법·표본 단위(슬라이드 vs 덱)·다중비교 보정이 없음. Table 5 두 행의 정체, Table 2/3/6 라벨이 HTML에서 소실되어 독립 검증이 어려움(원 PDF 대조 필요).
5. **[정리자 해석] 심판-생성자 동일 모델 문제:** PPTEval 심판이 GPT-4o이고, 생성 구성 중 하나도 GPT-4o_LM+GPT-4o_VM이다. 자기선호(self-preference) 편향 통제(교차 심판, 인간 blind 대조군 분리 보고)가 본문에 없음. 인간 상관 0.71은 전체 기준이라 모델별 편향까지는 말해주지 않는다.
6. **[정리자 해석] 편집 원자성(atomicity)의 검증 부재:** edit API 5종(삭제×2·복제×1·교체×2)만으로 복잡한 레이아웃 재배치가 가능한지, 실패 시 부분 적용 롤백이 있는지 본문에 없음. REPL 재시도가 상태 오염(state pollution) 없이 멱등한지 불명확.
7. **[정리자 해석] 윤리·실용성:** Zenodo 라이선스 필터링과 어노테이터 최저임금 초과 보상은 명시(Ethical Considerations). 그러나 생성물의 라이선스 계승(참조 스타일 복제 시 파생저작물 문제)은 다루지 않음.

---

## 7. Typodeck 관련성

Typodeck 맥락(과제 지정): Slide Markdown→Slide IR(버전관리 중간표현)→Composition Engine→네이티브 편집가능 PPTX 파이프라인. Visual Critic(이미지+구조 하이브리드 평가), Grammar Registry(버전관리 시각 시스템), Validation-Repair 게이트, 38개 Composition Candidate, 참고 슬라이드 재현 벤치마크 보유. 목표 방향 Valid PPTX → Good Layout → Intended Visual Hierarchy(의도된 의미 중요도-지각된 시각 중요도 일치).

### 7.1 직접 연결점 (논문 근거 있음)

1. **참고 기반 생성 패러다임의 정면 일치:**
   - PPTAgent의 핵심 명제는 "처음부터 생성하지 말고 참조를 고르고 편집하라"(§2.1 수식 2, §1 Duarte 2010 인용)이다. Typodeck의 참고 슬라이드 재현 벤치마크와 같은 문제의식이다.
   - PPTAgent 실험이 보여준 것: 참조 기반 edit 방식이 규칙기반(DocPres) 대비 design +40.9%, 템플릿기반(KCTV) 대비 content +28.6%/design +13.2%의 개선(§4.5). 참고 기반 접근의 정량적 정당화 근거로 인용 가능.
   - 차이: PPTAgent의 참조는 통째 슬라이드 선택+편집이고, Typodeck은 Slide IR·Composition Engine 경유이다. PPTAgent는 참조 레이아웃 보존이 강점인 대신 참조 품질 의존이 한계(§Limitations 2)로 남는다.
2. **기능 유형(Functional types) ↔ Typodeck 의미 역할:**
   - Stage I의 structural(opening 등) vs content(bullet-point 등) 구분 + 구조적 역할 라벨링(§2.2)은, Typodeck의 "슬라이드 기능 유형" 개념과 직접 대응한다.
   - PPTAgent ablation에서 structural slide 제거 시 coherence 4.48→3.45 수준으로 붕괴(§5.1). 덱 구조 역할(오프닝·섹션·본문·클로징) 모델링이 덱 품질에 인과적으로 중요하다는 증거로 쓸 수 있다.
3. **스키마 추출(Schema Extraction) ↔ Grammar Registry:**
   - PPTAgent 스키마(category·description·content, §2.2)는 슬라이드 요소의 **무엇(what)** 을 구조화한다. ablation에서 제거 시 성공률 95.0%→78.8%(§5.1).
   - Grammar Registry가 시각 시스템(색·서체·간격·역할)의 **어떻게(how)** 를 버전관리한다면, 둘은 상호보완이다. 스키마=콘텐츠 역할 사전, Grammar=시각 실현 사전으로 연결 가능.
   - 연결 아이디어: 참조 분석 시 PPTAgent식 스키마(요소 역할) + Grammar 레지스트리 항목(토큰·제약)을 함께 추출해, "역할→시각 토큰" 매핑 테이블로 만들면 참조 의존성(한계 2)을 완화할 수 있다. 참조 통째 복제가 아니라 역할-토큰 매핑 이식이므로 저품질 참조에도 강건.
4. **덱 단위 Coherence 평가 ↔ Deck-level Rhythm:**
   - PPTEval이 content·design(슬라이드 단위)과 coherence(덱 전체)를 분리 평가(§3)한 것은, Typodeck의 슬라이드 단위 Good Layout과 덱 단위 Rhythm 분리와 같은 구조이다.
   - PPTAgent 결과에서 coherence 개선폭(+25.5%/+36.6%)이 가장 크고(§4.5), 점수 분포에서 80% 초과가 4점 초과(§5.3). 덱 구조 모델링이 전체 인상에 지배적이라는 신호.
   - PPTEval coherence 정의(점진적 전개+배경 정보, §3·부록 B)는 **서사(narrative) 중심**이다. Typodeck의 Rhythm이 시각 리듬(밀도·여백·강조 분배)까지 포함한다면 상위호환으로 위치지을 수 있다.
5. **HTML 중간표현 ↔ Slide IR:**
   - PPTAgent가 XML(1,006줄) 대신 HTML 렌더 표현으로 LLM 상호작용 복잡도를 낮춘 것(§2.3·부록 E)은, Typodeck Slide IR의 존재 이유와 동일하다. ablation에서 CodeRender 제거 시 성공률 95.0%→74.6%(§5.1)는 "LLM 친화적 중간표현이 강건성에 결정적"이라는 정량 근거.
   - 차이: PPTAgent HTML은 렌더 표현+편집 API 결합이고 실행 오류만 수리한다. Typodeck IR이 버전관리·검증 게이트까지 포함한다면 더 강한 주장 가능.
6. **평가 지표 불일치 ↔ Visual Critic 정당화:**
   - ROUGE-L 16.76 vs content 2.55(KCTV)와 ROUGE-L 14.25 vs content 3.28(PPTAgent)의 역전(§4.5), PPL의 이상치·단편성 문제(§5.5)는 "텍스트 유사도 지표로 슬라이드를 평가할 수 없다"는 직접 증거이다.
   - 이는 Typodeck Visual Critic(이미지+구조 하이브리드)의 필요성을 뒷받침한다. 특히 PPTAgent가 content 평가에 슬라이드 이미지를 쓴 점(부록 B: plain text로 이해 불가)은 이미지 기반 평가의 불가피성을 선언한 것과 같다.
7. **인간 일치도 벤치마크 수치:**
   - PPTEval 평균 Pearson 0.71, Fleiss' Kappa 0.59(0.61/0.61/0.54)(§5.5·부록 B). Typodeck Visual Critic의 인간 일치도 목표·비교선으로 인용 가능. "0.71 초과"를 명시적 목표로 삼을 수 있다.

### 7.2 활용 아이디어 (구체적, 추측 표기 준수)

1. **참조 분석 파이프라인 차용(스키마+클러스터링):**
   - PPTAgent Stage I(클러스터링 θ=0.65, ViT 임베딩, 텍스트→"a"·이미지→단색 마스킹, 부록 D)를 Typodeck 참고 슬라이드 재현 벤치마크의 **참조 전처리·분류기**로 차용. structural/content 자동 분류 후 기능 유형별 재현 점수를 분리 집계하면 벤치마크 해상도가 올라간다.
   - [추측] 마스킹 전처리는 Typodeck Composition Candidate 분류(38종)에도 전이 가능. 콘텐츠를 지운 레이아웃 지문(layout fingerprint)으로 후보 매칭을 하면 텍스트 편향이 줄어들 것으로 예상되나, 원문에 Composition Candidate 같은 개념은 없어 효과는 검증 필요.
2. **Outline → IR 생성 단계 삽입:**
   - PPTAgent 아웃라인(참조+관련 문서 콘텐츠 per 슬라이드, §2.3)을 Typodeck 파이프라인의 Slide Markdown→Slide IR 사이에 **Deck Outline IR**로 삽입. structural 역할(오프닝·섹션·본문)을 명시 필드로 두면 coherence 리듬 제어가 가능.
3. **Edit API ↔ Composition Engine 연산 대응:**
   - PPTAgent 5종 연산(삭제·복제·교체)을 Composition Engine의 원자 연산 집합과 대응표로 정리. PPTAgent에 없는 연산(**이동·리사이즈·정렬·대비 조정** — [추측] 원문 5종에 없으므로 Typodeck 확장분)이 Typodeck의 차별점임을 명시.
4. **Validation-Repair 게이트 강화 근거:**
   - PPTAgent self-correction이 실행 오류만 잡고 시각 결함(겹침)은 남긴 점(한계 3)을 Typodeck Validation-Repair(이미지+구조 하이브리드)의 설계 근거로 인용. "REPL 수리 → 렌더 수리"로의 진화로 위치지을 수 있다.
5. **평가 차원 매핑:**
   - PPTEval Content·Design·Coherence를 Typodeck 평가에 매핑: Content→(의미 충실도), Design→Good Layout, Coherence→Deck-level Rhythm. 여기에 Typodeck 고유 차원 **Intended Visual Hierarchy(의도-지각 일치)** 를 4번째로 추가하면 "PPTEval 상위호환" 주장 가능. [추측] 논문에 visual hierarchy 일치 개념은 없으므로, 이 차원은 Typodeck 신규 기여로 프레이밍해야 한다.

### 7.3 주의점 (Typodeck 적용 시)

1. **참조 의존성 함정:** PPTAgent 한계 2(참조 품질 의존)는 Typodeck 참고 기반 생성에도 그대로 적용된다. 저품질 참조 입력 시 출력 하한 보장(폴백 Grammar·최소 레이아웃)이 없으면 같은 실패를 답습한다.
2. **심판-생성자 분리:** PPTEval이 GPT-4o로 생성·평가를 겸한 점(정리자 한계 5)은 Typodeck Visual Critic 설계의 반면교사. 생성 모델과 평가 모델(또는 규칙·학습 지표)을 분리하고, 인간 blind 평가를 별도 보고해야 한다.
3. **Coherence 입력 명시:** PPTEval coherence의 입력 모달리티가 불명확한 점(정리자 한계 3)을 Typodeck은 반복하지 말 것. Deck-level Rhythm 평가 입력(슬라이드 이미지 시퀀스+IR 구조+텍스트)을 명세에 못 박아야 한다.
4. **표 수치 인용 시 원 PDF 대조:** 본 정리에 표시한 Table 2/3/4/5/6의 HTML 소실 부분은 Typodeck 논문 인용 전 원 PDF에서 행·열 귀속을 반드시 재확인해야 한다. 특히 §5.5.1의 design/content 자리값과 §5.6의 ablation 행 매핑.

---

## 8. 인용 포인트 (Typodeck 논문용 주장 3개)

1. **"텍스트 유사도 지표는 프레젠테이션 품질을 측정하지 못하므로 이미지·구조 기반 평가가 필요하다."**
   - 근거: §4.5 Overall Result. KCTV ROUGE-L 16.76(content 2.55) vs PPTAgent ROUGE-L 14.25(content 3.28)의 역전. ROUGE가 원문 정합 과도 강조로 표현력 저해.
   - 추가 근거: §5.5 Agreement Evaluation. PPL은 슬라이드 단편성으로 이상치 빈발, ROUGE-L·FID는 참조 적합≠효능으로 content·design과 약한 상관(Figure 7).
   - Typodeck 연결: Visual Critic(이미지+구조 하이브리드)의 필요성 정당화.

2. **"참조 기반 편집(edit) 패러다임은 규칙·템플릿 기반 생성보다 디자인·콘텐츠·일관성 전부에서 우수하다."**
   - 근거: §4.5. vs DocPres design 3.34 vs 2.37(+40.9%), vs KCTV design 3.34 vs 2.95(+13.2%)·content 3.28 vs 2.55(+28.6%), coherence 4.48 vs 3.57(+25.5%, DocPres)/vs 3.28(+36.6%, KCTV). 세 차원 평균 3.67.
   - Typodeck 연결: 참고 슬라이드 재현 벤치마크·참조 기반 생성 파이프라인의 정량적 선행 근거. (단, 자리값은 원 PDF Table 3 대조 후 인용.)

3. **"덱 구조(structural role) 모델링과 LLM 친화적 중간표현이 생성 강건성·일관성에 인과적으로 기여한다."**
   - 근거: §5.1 Ablation(Table 4, Qwen2.5_LM+Qwen2-VL_VM). outline·structural 제거 시 coherence 4.48→3.36/3.45 붕괴. HTML 렌더 표현 제거 시 성공률 95.0%→74.6%. 스키마 제거 시 성공률 95.0%→78.8%.
   - Typodeck 연결: Slide IR(중간표현)·기능 유형·Deck Outline·Grammar Registry의 설계 정당화. (행-조건 매핑은 원 PDF Table 4 대조 후 인용.)

---

## 부록: 정리 범위·누락 고지

- 읽은 범위: 지정 텍스트 파일 전체 559줄(초록~§7·Limitations·Ethical Considerations·References·부록 A~F·Algorithm 1·Table 6~8·Figure 캡션). 읽기 전 요약 미개시 준수.
- 원문 미기재/변환 소실 목록:
  - Edit API 정확한 함수명·시그니처(설명 5종만, `replace_span` 1개만 본문 언급).
  - 부록 F 프롬프트 전문(Figure 12~23 이미지).
  - Figure 1/2/3/4/5/6/7/8/9/10/11 본문 이미지 내용(캡션만 확인).
  - Table 2 도메인-행 매핑, Table 3 전체 셀·행 라벨, Table 4/7 Setting 열(본문 서술로 역추정, 불확실 표기), Table 5 두 행의 정체, Table 6 행 라벨.
  - 통계 검정 방법, coherence 평가 입력 모달리티 상세, 편집 실패 시 롤백·멱등성.
- 파일 쓰기 금지 준수. 본 텍스트가 최종 결과 전문이다.
