# LecSlides-370K / SlideParser 논문 전문 정리

> 대상 원문: `/lecslides.txt` (ICCV 2025 PDF → pdftotext 추출, 87,152B·724줄, 2단 레이아웃 혼합)
> 판독 범위: 전문 완독 — Abstract, 1. Introduction, 2. Related Work, 3. LecSlides-370K Dataset, 4. Method, 5. Experiments, 6. Conclusion, Acknowledgments, References 전체 확인 후 작성.
> 판독 메모: 2단 컬럼 추출이라 문장 순서가 뒤섞인 구간(Fig.1~Fig.4 캡션·수식·표)을 문맥으로 재구성. 수식 기호 일부 깨짐은 원문 추출 한계로 표기.

---

## 0. 서지 정보

- **제목:** Towards Comprehensive Lecture Slides Understanding: Large-scale Dataset and Effective Method
- **저자:** Enming Zhang, Yuzhe Li, Yuliang Liu, Yingying Zhu(교신저자 `*`), Xiang Bai
- **소속:** Huazhong University of Science and Technology (HUST)
  - 이메일: `{emzhang, yzli, ylliu, yyzhu, xbai}@hust.edu.cn`
- **발표처/연도:** ICCV 2025 (The IEEE/CVF International Conference on Computer Vision)
  - 원문 1쪽 상단 워터마크: "This ICCV paper is the Open Access version, provided by the Computer Vision Foundation."
  - 페이지 번호: 4455~4464
- **링크:**
  - GitHub(원문 명시, Abstract 말미): `https://github.com/zamling/LecSlides_370K` — "Dataset and Codes are available at" (원문 오타 `avaliable` 그대로 있음)
  - CVF Open Access: 원문 미기재(정확 URL 없음). ICCV 2025 proceedings는 IEEE Xplore 정식본 + CVF Open Access 병행(원문 워터마크 명시). 제목으로 CVF open access 검색 필요.
  - HuggingFace 데이터셋: 원문 미기재. GitHub 저장소 참조 필요.
- **지원:** NSFC (62206103, 62225603)
- **키워드:** lecture slides understanding, large-scale dataset, Lecture Summary, Lecture QA, text relation, SlideParser

---

## 1. 한눈 요약(5문장)

1. 강의 슬라이드는 온라인 교육의 핵심 매체이나, 기존 데이터셋은 규모·영역·태스크가 제한되고 종합적 이해(comprehensive understanding)를 다루지 못했다.
2. 저자들은 25,542개 강의·370,078개 슬라이드·15개 영역·114,472개 요약·259,461개 QA를 담은 대규모 멀티태스크 데이터셋 LecSlides-370K를 Slideshare 수집 기반으로 구축했다.
3. 두 가지 태스크 — 전역 이해용 Lecture Summary와 세부·위치파악용 Lecture QA(4개 유형) — 를 정의하고, train 109,472 / val 2,000 / test 3,000 청크 분할과 ROUGE·METEOR / EM·F1 평가 프로토콜을 제시했다.
4. 슬라이드 특유의 복잡한 텍스트 관계가 내부 논리 파악의 핵심 장애물임을 지적하고, 관계 예측 헤드(RPH)+관계 어텐션 레이어(RAL)+약지도 DL-Cluster 의사라벨로 구성된 SlideParser를 제안했다.
5. LecSlides-370K 양 태스크와 외부 SlideVQA 벤치마크에서 전 베이스라인을 상회했고, LecSlides 사전학습→SlideVQA 미세조정 시 추가 대폭 향상을 확인했다.

---

## 2. 연구 문제와 배경

### 2.1 강의 슬라이드 이해가 어려운 이유(원문 근거)

원문은 Introduction에서 장애물 2가지를 명시한다:

1. **텍스트가 결론적·헤드라인식(conclusive and headline-style)이라 상세화(detailed content)가 어렵다.**
   - 슬라이드 문구는 압축된 선언문이라, 이를 풀어쓴 상세 설명·요약을 생성하는 작업이 어렵다.
   - 관련 서술: "1) Texts in slides are often conclusive and headline-style statements, which complicate the task of providing detailed content."
2. **복잡한 텍스트 관계(complex text relations)가 내부 논리·합리적 응답 생성을 방해한다.**
   - 관련 서술: "2) The complex text relations pose additional challenges for models attempting to grasp the internal logic and generate reasonable responses."
   - Fig.1(b) 예시로 설명:
     - 좌상단 텍스트: demand forecasting의 세부 요구사항.
     - 각 블록 우측 텍스트: flow chart의 각 단계를 설명.
     - 즉, 공간적으로 떨어져 있어도 논리적으로 강결합된 텍스트 쌍이 존재.
   - 핵심 주장: "understanding complex text relations in slides can grasp the internal logic, and is the key part of understanding slides."

### 2.2 기존 데이터셋의 한계(원문 근거)

#### (1) 관련 데이터셋 목록(Section 2.1 + Table 1)

| 데이터셋 | 강의 수 | 슬라이드 수 | QA | Summary | 태스크 |
|---|---|---|---|---|---|
| LectureVideoDB [5] | 24 | 5,000 | - | - | Text Detection |
| LectureBank [17] | 1,352 | 51,939 | - | - | Prerequisite Chain |
| ALV [7] | - | 1,498 | - | - | Slide Segmentation |
| LPM [14] | 334 | 9,031 | - | - | Image Retrieval |
| M3AV [4] | 1,113 | 24,956 | - | - | ASR & TTS |
| SlideVQA [27] | 2,619 | 52,380 | 14,500 | - | QA |
| LecSlides-370K(본 논문) | 25,542 | 370,078 | 259,461 | 114,472 | QA & Summary |

- OCR 어노테이션 유무 열도 있으나 pdftotext 기호 깨짐(`!`/`%`)으로 개별 셀 판독 주의. 대세는 OCR 보유이나 ALV만 미보유 취지로 보임. 정확한 기호 의미는 원문 PDF 대조 필요.

#### (2) 기존 연구의 기능적 한계

- text detection in slides [5], slide segmentation [7], slides-speech image-text retrieval [14] 등은 존재하나 **comprehensive understanding slides에 주목한 작업은 없음**(Introduction).
- SlideVQA [27]는 슬라이드 QA 벤치마크를 제공했으나 **global understanding task(예: 전체 슬라이드 집합의 상세 요약 생성)를 간과**했다.
- LectureBank는 토픽 간 prerequisite 관계(지식 구조), ALV는 강의 비디오 분할, LectureVideoDB는 비디오 강의 텍스트 검출·인식, LPM은 음성-시각 대응 검색에 국한.

#### (3) 규모·다양성 한계

- 원문 요약: "restricted scales and limited number of lecture areas also constrain the development."
- Section 2.1 결론 2가지:
  1. 대부분 데이터셋이 slides understanding에 충분한 주목을 하지 않고, 정의한 태스크도 다각적 이해를 제공하지 못함.
  2. 제한된 데이터 규모가 슬라이드 이해 발전을 저해.
- LecSlides-370K 대비(Section 3.1, Fig.1(a)):
  - 기존 최대 SlideVQA 대비 **강의 수 약 9.7배, 슬라이드 수 약 7.1배**.
  - 영역 수: LecSlides 15개 vs SlideVQA·LPM 등은 한 자릿수(Fig.2(a) 기준).

### 2.3 기존 방법의 한계(Section 2.2)

관련 방법은 슬라이드 전용이 없고 3개 범주 차용:

1. **Vision-language methods** [16, 31, 34, 36]
   - 대규모 사전학습 후 다운스트림 멀티모달 이해에 미세조정.
   - vision-language fused transformer encoder 통합이 일반적 [16, 31, 36].
2. **NLP methods** [15, 22]
   - T5 [22], BART [15] 등 encoder-decoder로 텍스트 입력→텍스트 출력.
3. **Document understanding methods** [10, 28]
   - 전통 transformer encoder를 멀티모달 encoder로 교체, 텍스트+시각 융합.
   - 예: LayoutLM 시리즈 [10, 32, 33] — 텍스트·이미지 특징·2D 위치 임베딩 통합.

- 공통批判: "these related methods do not consider the complex text relations in slides, a crucial part of slides understanding, thereby yielding inferior performance."
- 특히 2D position embedding만으로는 슬라이드의 복잡 관계 이해에 불충분하고 부정확성을 유발할 수 있다고 Section 4.2에서 재차 지적.

---

## 3. 핵심 기여

원문 Introduction 말미 3개 기여 서술을 기준으로 정리(표현은 원문 충실 + 보완):

1. **대규모 멀티태스크 슬라이드 이해 데이터셋 LecSlides-370K 구축**
   - 25,542개 강의·370,078개 슬라이드·15개 영역.
   - 114,472개 summary 어노테이션 + 259,461개 QA 쌍.
   - 두 종합 태스크 Lecture Summary와 Lecture QA 도입.
2. **신규 방법 SlideParser 제안**
   - 슬라이드 내 복잡한 텍스트 관계를 효과적으로 예측·활용하는 보조 브랜치 포함.
   - 구성: Relation Prediction Head(RPH, 관계 예측) + Relation Attention Layer(RAL, 관계 활용).
   - RPH 품질 향상을 위한 약지도 의사관계라벨 파이프라인 DL-Cluster(공간+의미 동시 고려).
   - 관련 텍스트 간 어텐션 강화, 무관 텍스트 간 어텐션 감소.
3. **광범위한 실험으로 우수성 입증**
   - LecSlides-370K Lecture Summary·Lecture QA 벤치마크에서 전 관련 방법 상회.
   - SlideVQA [27]에서도 평가해 텍스트 관계 설계의 효과 추가 검증.
   - LecSlides 사전학습 → SlideVQA 미세조정 시 큰 성능 향상, 대규모 사전학습 데이터셋으로서의 가치 입증.

---

## 4. 방법론 상세

### 4.1 LecSlides-370K 데이터셋

#### 4.1.1 수집원·필터링·규모(Section 3.1)

- **수집원:** Slideshare (`https://www.slideshare.net`, 각주 명시).
- **원시 데이터:** 39,784개 강의에서 720,673개 슬라이드.
- **필터링:** 강의 내용과 무관한 슬라이드(광고 등) 또는 이해에 불필요한 부가 정보를 내용 기준으로 제거. 구체 필터 규칙·분류기·임계값은 원문 미기재.
- **최종 규모:**
  - 25,542개 강의.
  - 370,078개 슬라이드.
  - 15개 영역(예: computer science, marketing, medicine 등).
- **기존 최대(SlideVQA) 대비:** 강의 수 약 9.7배, 슬라이드 수 약 7.1배.

#### 4.1.2 강의 청크(lecture chunk) 분할

- 문제의식: 원시 강의 슬라이드 길이가 수 장~수백 장으로 편차가 커 연구자가 쓰기 어려움.
- 해결: 원시 슬라이드를 **114,472개 lecture chunk**로 분할.
- 원칙: **각 청크는 동일 sub-topic에 속한다.**
  - 예: 첫 슬라이드가 리스트 첫 항목만 보이고 다음 슬라이드가 후속 항목을 공개하면 같은 청크.
- 청크당 슬라이드 수:
  - 평균 3.2장.
  - 분포 Fig.2(b). **최빈값은 2장**(most chunks contain two slide images).
- 어노테이션 단위가 강의 전체가 아니라 청크임에 주의:
  - 학습/평가 입력은 청크 단위 멀티이미지.

#### 4.1.3 슬라이드 내 어노테이션(위치+텍스트)

- **위치 어노테이션:** texts, illustrations, tables의 positions.
  - 목적: 정보 추출·데이터 처리 부담을 줄이고 신방법 개발에 집중하도록.
- **텍스트 내용 어노테이션:** 슬라이드 내 textual contents.
  - 목적: 모델의 슬라이드 이해 보조.
- 추출 방식(OCR 엔진명·수작업 여부·품질 관리)은 원문 미기재.
- 시각 요소 집계:
  - diagrams 94,906개.
  - illustrations 34,562개.
  - tables 18,938개.
- 텍스트 집계:
  - 총 28,220,274 단어.
  - 평균 76.2 단어(문맥상 슬라이드당 평균으로 해석되나 원문은 "with an average of 76.2 words"로만 기재, 분모 명시 없음. 슬라이드당으로 추정).
  - 어휘 크기 84,630.
  - Fig.2(c): 대다수 슬라이드가 100단어 미만.

#### 4.1.4 15개 영역·다양성

- Fig.2(a): LecSlides-370K vs SlideVQA vs LPM의 학문분야별 강의 수.
- LecSlides 15개 disciplines. 원문이 전부 열거하지는 않음. 명시된 예:
  - business, natural sciences, computer sciences(Introduction).
  - computer science, marketing, medicine(Section 3.1).
  - marketing, agriculture 등 기존 데이터셋에 없는 분야 포함(Section 3.3.1).
- 분포 특성:
  - business 비중 최대.
  - law·marketing은 상대적으로 소수.
- 다양성 의의: 풍부한 교수 내용 + 다양한 장면 처리 요구 → 도전성 증가.

#### 4.1.5 전문성(어려움) 지표(Section 3.3.2)

- 강의 슬라이드는 전문 지식·용어 포함 → 도전적.
- Flesch Reading Ease (FRES) [13]: 평균 **34.3점**, 'Hard to Read' 수준.
- Flesch–Kincaid Grade Level [13]: 평균 **14.1학년**(대학 수준).
- 계산 대상(슬라이드 OCR 전체 vs 요약 어노테이션 등)은 원문 미기재.

#### 4.1.6 어노테이션 형식: summary + qa_pair

- 총량:
  - summary labels 114,472개.
  - QA pairs 259,461개.
- 파일 형식(JSON 스키마·필드명 등)은 원문 미기재. GitHub/HF 참조 필요.
- Summary 어노테이션:
  - Fig.2(d) 길이 분포.
  - 평균 길이 **124.6 단어**.
  - 생성 방식(수작업/모델 생성 후 검수 등)은 원문 미기재.
- QA 어노테이션:
  - 4개 유형:
    - binary choice.
    - visual analysis.
    - data interpretation.
    - textual reasoning.
  - Fig.2(e) 비율:
    - textual reasoning 64%.
    - visual analysis 18%.
    - data interpretation 14%.
    - binary choice 4%.
  - 평균 답안 길이 **4.1 단어**.
  - QA 생성·검증 절차 원문 미기재.
- Fig.1(b) 예시 QA:
  - Textual Reasoning: "What template is required to generate a specific requirement?" → "demand templates"
  - Binary Choice: "Is maintaining one year detailed forecast required for forecasting a number?" → "No"
  - Data Interpretation: "What is the demand input for starting forecast in January 11?" → "100"
  - Visual Analysis: "what is the next stage of Sales?" → "Marketing" (원문 대소문자·구두점 그대로)
  - Summary 예시 발췌: "Slides outline the key requirements for demand forecasting. It highlights the importance of allowing field sellers and product…" (추출 잘림 포함)

#### 4.1.7 두 태스크 정의(Section 3.2)

두 태스크는 가장 빈번한 학생 사용 기능 + 전역/세부 이해를 각각 담당:

1. **Lecture Summary(전역 이해)**
   - 입력: 강의 청크 `I = {I1, I2, ..., Ij}M`(원문 표기. `M`개 슬라이드 이미지 집합 의미이나 첨자 표기 깨짐).
   - 목표: 각 슬라이드 내용 분석 → 문맥 정보 통합 → 핵심 세부 유지 → 중복 제거 → 전체 슬라이드 요약 출력.
   - 평가 초점: 핵심 정보 추출 + 전역 이해.
2. **Lecture QA(세부 이해)**
   - 입력: 강의 청크 + 질의 `q`.
   - 목표: 질문에 대응하는 슬라이드를 식별한 뒤 해당 슬라이드 내용 기반으로 답변.
   - 평가 초점: 문제 위치 파악(locating) + 세밀 내용 이해.
   - 모델이 슬라이드 식별을 명시적으로 출력하는지, 아니면 내부 과정인지는 원문 미기재.

#### 4.1.8 평가 프로토콜·분할(Section 3.4)

- 분할(청크 단위):
  - train 109,472.
  - val 2,000.
  - test 3,000.
  - 합 114,472로 전체 청크와 일치.
- Lecture Summary 지표: **ROUGE-1, ROUGE-L [18], METEOR [3]**.
  - 이미지 캡션·텍스트 생성에서 널리 쓰이며 서로 다른 측면 평가.
- Lecture QA 지표: **EM(Exact Matching), F1**.
  - SlideVQA [27]를 따름.

---

### 4.2 SlideParser

#### 4.2.1 전체 아키텍처(Fig.3(a), Section 4)

3개 모듈:

1. **Transformer Encoder**(unified text-image multi-modal).
2. **Text Relation Prediction Module**(핵심 신규).
3. **Text Decoder**.

데이터 흐름:

1. 슬라이드 텍스트 + 이미지 패치를 Transformer Encoder 입력.
2. 출력 텍스트 임베딩을 Text Relation Prediction Module에 전달 → 텍스트 관계 예측 + 텍스트 임베딩 갱신.
3. 갱신된 텍스트 임베딩 + 출력 이미지 임베딩 결합 → Text Decoder → summary 또는 answer 생성.

#### 4.2.2 입력 스키마(Section 4.1)

- Transformer Encoder는 cross-modal representation 학습용 unified text-image multi-modal Transformer.
- 선행 문서이해 연구 [10, 28]와 유사하게 multi-layer 구조, 각 층은 multi-head self-attention + feed-forward networks.
- 입력:
  - 텍스트 임베딩 `X = x1:L`.
  - 이미지 임베딩 `V = v1:M`.
  - `L`, `M`은 각각 텍스트·시각 임베딩 시퀀스 길이.
- 텍스트 임베딩:
  - `L`개 텍스트 토큰 `{si}_(i=1)^L`을 word embedding + 1D position + 2D layout position embedding [28]으로 인코딩.
- 이미지 임베딩:
  - 슬라이드 이미지 `I ∈ R^(H×W×C)`를 `M = H/P × W/P`개 패치로 분할한 뒤 Patch Embedding.
  - 원문 추출은 `M = H P × P H`로 깨져 있으나 문맥상 패치 분할 수식.
- 멀티슬라이드 처리(Section 5.1):
  - 모든 모델에 encoder outputs의 **simple concat operator** 사용.
  - 세부 concat 축·순서·위치 구분 방식 원문 미기재.

#### 4.2.3 핵심 동기: 2D 위치만으로 부족

- Transformer Encoder의 2D position embedding은 선행 문서이해 [10, 28]에서 레이아웃·텍스트 관계 이해에 유효했음.
- 그러나 슬라이드 텍스트 관계는 전통 문서보다 복잡 → 2D 임베딩 편입만으로는 종합적 관계 이해에 불충분하고 부정확 유발 가능.
- 그래서 RPH(약지도 관계 예측) + RAL(관계 활용) 모듈 도입.

#### 4.2.4 Relation Prediction Head(RPH, Section 4.2.1)

목표: 정확한 텍스트 관계 예측. [30]에서 착안, 텍스트 위치+의미 정보 활용.

**(A) 공간 관계(spatial relation)**

- 입력: 텍스트 박스 `{bi}_(i=1)^L`.
- box delta 정의(Eq.1, 원문 LaTeX 깨짐 포함, 의미 재구성):

```text
Δ(bi, bj) = {
  (x_i^ctr - x_j^ctr)/w_i,
  (y_i^ctr - y_j^ctr)/h_i,
  log(w_i / w_j),
  log(h_i / h_j)  ※ 원문 추출은 4번째 항도 log(w_i/w_j)로 중복. h 비율이 정당한 형태로 보이나 원문 PDF 대조 필요
}
```

- `x^ctr`, `y^ctr`: 박스 중심 좌표.
- `w`, `h`: 박스 너비·높이.
- 두 박스의 공간 관계:

```text
r_{bi,bj} = { Δ(bi,bj), Δ(bi,bij), Δ(bij,bj) }
```

- `bij`: `bi`, `bj`의 union bounding box.
- 12차원 벡터(4D × 3).
- MLP 층 + 전체 박스 관계 통합 → 공간 관계 행렬 `R_spa ∈ R^(L×L)`.

**(B) 의미 관계(semantic relation)**

- Transformer Encoder 출력 텍스트 임베딩 `ET ∈ R^(L×D)` 사용.
- 두 텍스트 간 의미 관계(Eq.2):

```text
R_sem = (Wq ET × Wk ET^T) / sqrt(D)
```

- 형태상 scaled dot-product attention score와 동일.

**(C) 최종 예측 관계 행렬(Eq.3)**

```text
M̂_R = Sigmoid(R_spa + R_sem)
M̂_R ∈ R^(L×L)
```

#### 4.2.5 약지도 라벨 생성: DL-Cluster(Section 4.2.2, Fig.4)

##### 배경·필요성

- 실험 관찰: relation supervision 없이는 RPH가 합리적 텍스트 관계를 생성하지 못함(converge 어려움).
- 선행 [1, 8]은 전통 클러스터 방법 [6, 9]에 의존하나, 다양한 슬라이드 레이아웃을 효과적으로 처리 못 함.
- 저자 관찰: 슬라이드에서는 **공간 관계와 의미 관계가 모두 중요**.

##### 제안: DL-Cluster(Dynamic Layout Cluster)

dual-stream 의사관계라벨 생성 파이프라인. Fig.4 흐름:

```text
slide texts
→ [Sampling Spatial Relation + Finding Optimal K + Cluster + Binarization]
→ [Sentence Transformer Semantic Relation]
→ Merging two relations
→ Pseudo Relation label
```

##### 공간 스트림 절차

1. 각 텍스트 박스마다 **N개 reference points를 cluster points로 샘플링**.
   - N 값·샘플링 위치(박스 내부 균일/격자 등) 원문 미기재.
2. 슬라이드마다 클러스터 수를 동적으로 결정(고정값 부적합).
3. **Kmeans++ [2]** 기반으로 클러스터 수 `k`를 2부터 `K`까지 순회, **Silhouette method [24]**로 최적 수 선택.
   - `K = 8`(실험 설정 명시).
   - Silhouette 분석: 각 cluster point와 자기 클러스터 내 거리 vs 가장 가까운 이웃 클러스터 거리 비교.
   - 최적 `k`: 자기 클러스터 내 평균거리 최소 + 최근접 이웃 클러스터 평균거리 최대.
4. reference points 투표(voting)로 각 박스에 cluster ID 부여.
5. 공간 관계 점수 `s_spa` 계산(Eq.4):

```text
s_spa = {
  1 - (1/N) Σ_{ε=1..N} ||x_{i,ε} - μ_j|| , if Ci == Cj
  0                                         , if Ci != Cj
}
```

- `Ci`, `Cj`: 박스 클러스터.
- `μj`: `Cj`의 centroid.
- `x_{i,ε}`: 박스 `i`의 reference point.
- 해석: 같은 클러스터면 reference points-중심 평균거리 기반 점수, 다른 클러스터면 0.
- 거리 정규화 범위는 원문 미기재.

##### 의미 스트림 절차

1. 각 텍스트 박스의 textual contents 추출.
2. **Sentence Transformer [23]** 임베딩의 cosine distance로 의미 유사도 → `s_sem`.
3. 공간·의미 결합(Eq.5):

```text
s = β1 Norm(s_spa) + β2 Norm(s_sem)
β1 = 0.7, β2 = 0.3 (default)
```

- `Norm` 종류 원문 미기재.
- 결합 행렬 `MR = {sij}_(L×L)`를 **0.5 threshold로 이진화**.

##### 관계 손실(Eq.6)

```text
L_rel = BCELoss(M̂_R, MR)
```

#### 4.2.6 Relation Attention Layer(RAL, Section 4.2.3)

- Self Attention [29]으로 예측 관계 활용(Fig.3(b)).
- 예측 관계 행렬 `M̂_R`에서 어텐션 마스크 생성:
  - `mij < 0.5`이면 `-∞` 할당.
  - `mij ∈ M̂_R`.
- 출력 텍스트 임베딩 `ET`를 이 마스크付き **N-layer self-attention blocks**에 통과 → 갱신 임베딩 `E'_T`.
  - `N` 값 원문 미기재.
- 효과: 관련 텍스트 간 어텐션 강화, 무관 텍스트 간 어텐션 차단.
- 최종: `ET`와 `E'_T`를 **residual connection**으로 결합. 결합식 세부 원문 미기재.

#### 4.2.7 Text Decoder·전체 손실(Section 4.3)

- 선행 [28]을 따라 **T5 decoder**(uni-directional Transformer decoder, next prediction) 채택.
- summary/answer 텍스트 생성.
- 텍스트 생성 감독: **Cross Entropy loss** → `L_ce`.
- 전체 손실(Eq.7):

```text
L = L_ce + L_rel
```

- 두 항 가중치 없이 단순 합.

#### 4.2.8 학습 설정(Section 5.1)

- Transformer Encoder·Text Decoder 모두 **pretrained UDOP [28] 가중치로 초기화**.
- 옵티마이저: **AdamW [19]**, β1 0.9, β2 0.999, weight decay 0.02.
- 스케줄러: cosine learning rate scheduler.
- 초기 학습률: **4×10^-5**.
- 총 iterations: **41K**.
- 멀티슬라이드: encoder outputs simple concat(전 모델 공통).
- 배치 크기·GPU·학습 시간·시퀀스 길이·이미지 해상도·증강 등은 원문 미기재.
- LayoutLMv3는 text decoder가 없어 텍스트 생성 불가 → 본 방법과 동일한 text decoder를 추가해 평가.

#### 4.2.9 베이스라인 구성

- NLP: T5 [22], BART [15].
- Vision-language: mPLUG [16], Vid2Seq [34].
- 문서이해: LayoutLMv3 [10], Donut [12], UDOP [28].
- SlideVQA 추가 베이스라인(Table 4): VinVL [36], PreasM [35], T5, LayoutT5 [26], LayoutLMv2 [33], FiD [11], M3D [27].

---

## 5. 실험 결과 상세

### 5.1 LecSlides-370K Lecture Summary(Table 2)

지표: ROUGE-1 / ROUGE-L / METEOR. `#Params` 포함.

#### val 분할

| 방법 | Params | R-1 | R-L | METEOR |
|---|---:|---:|---:|---:|
| BART-base [15] | 217M | 33.1 | 21.1 | 21.9 |
| BART-large [15] | 509M | 35.9 | 21.9 | 24.2 |
| T5-base [22] | 272M | 34.6 | 21.6 | 22.8 |
| T5-large [22] | 803M | 36.2 | 22.1 | 24.9 |
| Vid2Seq [34] | 314M | 16.0 | 11.8 | 12.9 |
| mPLUG-base [16] | 350M | 27.1 | 19.0 | 21.6 |
| mPLUG-large [16] | 600M | 30.0 | 20.5 | 24.0 |
| Donut [12] | 543M | 27.4 | 18.6 | 21.3 |
| LayoutLMv3-base [10] | 533M | 33.6 | 21.0 | 23.8 |
| LayoutLMv3-large [10] | 768M | 34.6 | 21.6 | 24.8 |
| UDOP [28] | 794M | 36.1 | 22.1 | 26.4 |
| SlideParser(Ours) | 810M | **42.2** | **25.3** | **31.3** |

#### test 분할

| 방법 | Params | R-1 | R-L | METEOR |
|---|---:|---:|---:|---:|
| BART-base | 217M | 32.8 | 20.1 | 21.5 |
| BART-large | 509M | 35.0 | 21.0 | 22.9 |
| T5-base | 272M | 34.3 | 20.7 | 22.4 |
| T5-large | 803M | 35.1 | 21.3 | 23.2 |
| Vid2Seq | 314M | 17.8 | 13.1 | 14.1 |
| mPLUG-base | 350M | 27.6 | 19.3 | 21.7 |
| mPLUG-large | 600M | 29.8 | 20.3 | 23.6 |
| Donut | 543M | 27.6 | 18.5 | 21.1 |
| LayoutLMv3-base | 533M | 31.7 | 19.8 | 22.6 |
| LayoutLMv3-large | 768M | 33.9 | 21.0 | 23.2 |
| UDOP | 794M | 35.3 | 21.5 | 25.6 |
| SlideParser(Ours) | 810M | **41.7** | **24.7** | **30.4** |

#### 해석(원문 Section 5.2.1)

- SlideParser val 42.2/25.3/31.3으로 전부 1위. 효과는 텍스트 관계 이해 덕분으로 귀인.
- 시각 중심 방법(Vid2Seq, mPLUG 시리즈, Donut)이 최하위권.
  - 원인 해석: 시각 modality만 처리하면 슬라이드 세부 내용 추출 부족.
- NLP 방법(T5, BART)은 상대적으로 양호하나, 멀티모달 융합+텍스트 관계 활용을 갖춘 제안법에는 뒤짐.

#### 2위 대비 격차(정리자 계산)

- val R-1: SlideParser 42.2 vs 2위 T5-large 36.2 → **+6.0**.
- val R-L: 25.3 vs 2위 T5-large/UDOP 22.1 → **+3.2**.
- val METEOR: 31.3 vs 2위 UDOP 26.4 → **+4.9**.
- test R-1: 41.7 vs 2위 UDOP 35.3 → **+6.4**.
- 파라미터는 810M으로 비교군 최대이나, 803M T5-large·794M UDOP와 동급 규모.

### 5.2 LecSlides-370K Lecture QA(Table 3)

지표: EM / F1.

#### val / test

| 방법 | Params | val EM | val F1 | test EM | test F1 |
|---|---:|---:|---:|---:|---:|
| BART-base | 217M | 18.9 | 25.1 | 18.5 | 24.7 |
| BART-large | 509M | 20.6 | 27.1 | 19.8 | 26.3 |
| T5-base | 272M | 19.1 | 26.0 | 18.7 | 25.3 |
| T5-large | 803M | 20.9 | 27.4 | 20.0 | 27.1 |
| Vid2Seq | 314M | 7.0 | 14.3 | 6.7 | 13.6 |
| mPLUG-base | 350M | 8.4 | 10.9 | 8.5 | 10.1 |
| mPLUG-large | 600M | 9.5 | 14.3 | 9.5 | 14.2 |
| LayoutLMv3-base | 533M | 12.5 | 15.8 | 12.4 | 15.1 |
| LayoutLMv3-large | 768M | 13.6 | 19.3 | 13.5 | 19.1 |
| UDOP | 794M | 19.2 | 26.0 | 18.7 | 25.6 |
| SlideParser(Ours) | 810M | **23.7** | **33.0** | **23.6** | **32.1** |

#### 해석

- Lecture Summary가 전역 이해라면 QA는 특정 내용 심층 이해 측정.
- SlideParser가 전 베이스라인 상회.
- mPLUG·Vid2Seq 등 vision-language 모델이 여전히 최하위 → QA에서도 세부 텍스트 정보가 결정적임을 시사.
- 격차(정리자 계산):
  - val EM 23.7 vs 2위 T5-large 20.9 → **+2.8**.
  - val F1 33.0 vs 2위 T5-large 27.4 → **+5.6**.
  - test EM 23.6 vs 2위 T5-large 20.0 → **+3.6**.
  - test F1 32.1 vs 2위 T5-large 27.1 → **+5.0**.
- 절대 수치가 Summary보다 낮음(EM 20%대)은 데이터셋 난이도를 방증. 원문도 "related baselines struggle to extract the main point … and pinpoint the correct content"로 기술.

### 5.3 SlideVQA 성능(Table 4)

멀티이미지 슬라이드 VQA 벤치마크. dev/test EM/F1.

| 모델 | dev EM | dev F1 | test EM | test F1 |
|---|---:|---:|---:|---:|
| VinVL [36] | 9.4 | 11.4 | 10.7 | 13.5 |
| PreasM [35] | 36.3 | 41.9 | 30.7 | 38.2 |
| T5 [22] | 35.2 | 41.3 | 31.0 | 39.7 |
| LayoutT5 [26] | 38.9 | 44.8 | 31.7 | 39.9 |
| LayoutLMv2 [33] | 26.5 | 33.4 | 21.4 | 29.3 |
| FiD [11] | 37.6 | 42.9 | 30.4 | 38.9 |
| M3D [27] | 41.3 | 47.1 | 33.5 | 41.7 |
| SlideParser(Ours) | **44.1** | **49.8** | **37.5** | **43.9** |
| SlideParser†(LecSlides 사전학습→SlideVQA 미세조정) | **49.8** | **53.9** | **42.4** | **47.7** |

- SlideParser 단독도 전 방법 1위 → 텍스트 관계 설계의 일반화 입증 주장.
- `†`는 LecSlides-370K 사전학습 후 SlideVQA 미세조정(원문 오타 `SlidePraser` 1회).
- `†` 향상폭(정리자 계산):
  - dev EM 44.1→49.8 (**+5.7**), dev F1 49.8→53.9 (**+4.1**).
  - test EM 37.5→42.4 (**+4.9**), test F1 43.9→47.7 (**+3.8**).
- 원문 결론: 대규모·종합적 LecSlides-370K가 큰 성능 향상을 산출, 귀중한 대규모 사전학습 데이터셋으로 기능.

### 5.4 Ablation Study

#### 5.4.1 Text Relation Prediction Module 효과(Table 5)

- 대상: LecSlides-370K Lecture Summary(분할 명시 없음. 수치로 보아 val로 추정되나 원문 미기재).
- 조건:
  - r1: RPH ✗, RAL ✗, Pseudo Label ✗.
  - r2: RPH ✓, RAL ✓, Pseudo Label ✗(지도 없이 관계 예측·활용).
  - r3: RPH ✗, RAL ✓, Pseudo Label ✓(학습 가능 관계 대신 DL-Cluster 의사라벨을 RAL에 직접 투입).
  - r4: 전부 ✓(학습 가능 예측 + 약지도).

| 조건 | RPH | RAL | Pseudo | R-1 | R-L | METEOR |
|---|---|---|---|---:|---:|---:|
| r1 | ✗ | ✗ | ✗ | 36.3 | 22.6 | 26.9 |
| r2 | ✓ | ✓ | ✗ | 37.5 | 23.2 | 27.7 |
| r3 | ✗ | ✓ | ✓ | 41.8 | 25.0 | 30.8 |
| r4 | ✓ | ✓ | ✓ | **42.2** | **25.3** | **31.3** |

- 해석(원문):
  - r1 전체 모듈 제거 → 최하.
  - r2 무지도 관계 추가 → 소폭 향상에 그침. RPH가 합리적 관계로 수렴하기 어려움을 입증.
  - r3 의사라벨 직접 사용 → 큰 향상이나 r4에는 미달(r3 vs r4).
  - r4 학습 가능 관계 + 약지도 → 최고. 학습 가능 관계가 학습 중 정제(refined)됨을 시사.
- 격차(정리자 계산):
  - r1→r4: R-1 +5.9, METEOR +4.4.
  - r2→r3: R-1 +4.3 → 약지도 라벨 자체의 기여가 큼.
  - r3→r4: R-1 +0.4, METEOR +0.5 → 학습 가능 정제의 추가 이득은 작지만 일관적.

#### 5.4.2 의사라벨 클러스터 방법 비교(Table 6)

| Cluster Type | R-1 | R-L | METEOR |
|---|---:|---:|---:|
| Kmeans(k=3) | 40.9 | 24.8 | 29.8 |
| Kmeans(k=4) | 40.7 | 24.7 | 29.6 |
| HAC(n=3) | 41.0 | 24.8 | 30.1 |
| DBSCAN | 41.3 | 24.8 | 30.6 |
| DL-Cluster | **42.2** | **25.3** | **31.3** |

- DL-Cluster가 고정 클러스터 수 방법(K-means, HAC) 상회.
- 클러스터 수 미지정 방법(DBSCAN [6])도 상회. 이유: 공간+의미 동시 고려.
- HAC는 "Hierarchical Agglomerating Clustering"으로 원문 기재(일반 명칭 Agglomerative이나 원문 표기 유지).

#### 5.4.3 DL-Cluster의 공간·의미 기여(Table 7)

| Spatial | Semantic | R-1 | R-L | METEOR |
|---|---|---:|---:|---:|
| ✗ | ✓ | 38.3 | 23.7 | 28.5 |
| ✓ | ✗ | 41.4 | 24.8 | 30.7 |
| ✓ | ✓ | **42.2** | **25.3** | **31.3** |

- 어느 한 차원 제거도 성능 하락.
- 공간 관계의 영향이 더 큼(공간만 41.4 vs 의미만 38.3).
- 양자 병용 최고 → 상호 보완 주장.

### 5.5 시각화·정성 분석(Fig.5, Fig.6, Section 5.4)

#### Fig.5 RPH 예측 관계 시각화

- 관계 점수 0.5 초과 텍스트 쌍에 동일 색상 부여.
- 결과: 약지도 하에서 RPH가 합리적 텍스트 관계 예측.
- 구체 슬라이드 내용·색상 수는 추출 텍스트만으로 복원 불가. PDF 대조 필요.

#### Fig.6 Lecture QA 정성 비교

두 질의 예시(추출 순서 재구성):

**예시 1:**

- Q: "what are the potential characteristics for both disadvantages and advantages?"
- GT: "Diversity, Regional"
- T5: "Credibility, Diversity"
- mPLUG: "Diversity"
- UDOP: "Credibility, Logistics"
- Ours: "Diversity, Regional" (정답)

**예시 2:**

- Q: "what is the percentage of respondents who believe data center power consumption and cooling is a way to lower cost?"
- GT: "29%"
- T5: "15%"
- mPLUG: "40% and 50%"
- UDOP: "15%"
- Ours: "29%" (정답)

원문이 지적한 타 방법의 두 실패 유형:

1. 복잡한 텍스트 관계 탓에 올바른 내부 논리 파악 실패.
2. 슬라이드 내 다이어그램 수 증가 시 질문 대응 다이어그램 특정 실패.

반면 SlideParser는 텍스트 관계 이해로 답 위치를 쉽게 특정하고 정확히 응답.

### 5.6 결론(Section 6)

- LecSlides-370K: 더 큰 규모·더 다양한 학문 분야.
- SlideParser: 텍스트 관계 예측·활용의 중추적 역할 고려.
- 텍스트 관계 강화 설계의 효과 + 타 모델 상회 입증.
- 기대: LecSlides-370K와 SlideParser가 강의 슬라이드 연구 촉진(prompt).

---

## 6. 한계와 후속 과제

### 6.1 논문 명시 한계(원문 근거)

- **[원문] 별도 Limitations 섹션 없음.**
  - Conclusion·Experiments 어디에도 명시적 한계·실패 사례·윤리·편향 논의 없음.
- **[원문] 간접적으로 드러난 미해결점(원문 수치·서술 기반, 해석은 정리자):**
  - QA 절대 성능이 여전히 낮음(LecSlides test EM 23.6·F1 32.1). 관계 모델링 후에도 4개 중 3개는 exact match 실패 수준.
  - 무지도 관계 학습(r2)이 거의 개선 없음 → 방법 자체가 의사라벨 품질에 강하게 의존(Table 5).
  - 학습 가능 정제(r3→r4) 이득이 R-1 +0.4·METEOR +0.5로 작음 → RPH 학습의 한계 가능성.
  - 데이터 구축 필터·어노테이션 생성 절차·품질 검증 수치 언급 없음 → 재현·신뢰도 판단 불가.

### 6.2 정리자가 본 방법론적 한계(표기: [정리자 해석])

1. **[정리자 해석] 강의 슬라이드 도메인 편향**
   - Slideshare 수집 + business 과대표, law/marketing 과소 → 일반 프레젠테이션(투자 IR, 제품 소개, 학회 포스터, Typodeck 목표물)과 분포 차이 가능성.
   - FRES 34.3·Grade 14.1의 고난도 강의 텍스트에 최적화된 관계·요약이 일반 슬라이드의 짧은 마케팅 카피·숫자 강조에 그대로 전이될지는 미검증.
2. **[정리자 해석] 관계 정의가 이진·무유형(binary, untyped)**
   - 0.5 이진화로 관련/무관만 구분. 계층(title-body), 병렬(list items), 설명(refer-to), 순서(flow) 등 관계 유형 구분 없음.
   - Typodeck의 Spatial Relationship·Grouping에는 방향성·유형 정보가 필요하나 본 논문은 제공하지 않음.
3. **[정리자 해석] 공간 가중(0.7) vs 의미(0.3)의 고정성**
   - β 기본값 고정. 문서 유형·레이아웃 밀도에 따른 적응 없음.
   - 공간이 지배적이라 의미적으로 연결된 원거리 요소(표-본문 인용, 각주, 부록 참조) 포착에 취약할 수 있음.
4. **[정리자 해석] DL-Cluster 하이퍼파라미터 불투명**
   - N(reference points 수), 거리 정규화, 투표 규칙, Sentence Transformer 모델명, 임계값 0.5 선정 근거 모두 원문 미기재.
   - K=8 상한의 적절성도 슬라이드당 텍스트 수 분포(Fig.2(c)) 대비 검증 없음.
5. **[정리자 해석] RAL의 hard masking 위험**
   - 0.5 미만 일괄 `-∞`는 예측 오류 시 필요 문맥 완전 차단. soft weighting·신뢰도 가중과 비교 없음.
6. **[정리자 해석] 생성 손실 가중 부재**
   - `L = L_ce + L_rel` 단순합. 관계 손실과 생성 손실 스케일·수렴 속도 차이 조정 없음.
7. **[정리자 해석] 레이아웃 생성과 무관한 이해 전용**
   - 위치 어노테이션을 입력으로 소비만 하고, 레이아웃 생성·수정·검증은 다루지 않음. Typodeck의 Composition Engine에 직접 이식 불가, 이해 모듈로만 활용 가능.
8. **[정리자 해석] 평가의 생성 품질 한계**
   - Summary를 ROUGE·METEOR(표면 중첩)만으로 평가. 사실성·환각·핵심 누락·논리 충실도는 미측정.
   - QA도 EM·F1만 보고, 4개 유형별 breakdown·슬라이드 위치 정확도(localization accuracy) 미보고.
9. **[정리자 해석] 시각 요소 모델링 얕음**
   - diagrams·illustrations·tables 위치는 어노테이션하나, 관계 모델은 텍스트-텍스트에만 적용. 텍스트-차트·텍스트-표 관계는 RPH 범위 밖.
   - Fig.6에서 다이어그램 특정 실패를 지적하면서도 정량적 시각 근거 평가는 없음.
10. **[정리자 해석] 데이터 구축 재현성**
    - Slideshare 크롤링 시점·라이선스·필터 기준·청킹 알고리즘(자동/수동)·요약·QA 작성자(전문가/크라우드/LLM) 모두 원문 미기재.
    - 저작권·재배포 조건도 원문 미기재 → Typodeck 학습데이터 활용 전 GitHub 라이선스 확인 필수.

### 6.3 후속 과제 제안(표기: [정리자 제안]/[추측] 구분)

- **[정리자 제안]** 관계 유형화(계층·병렬·참조·순서) + 방향성 예측으로 확장. Typodeck Grouping·Structure Understanding과 직접 정합.
- **[정리자 제안]** 텍스트-시각 관계(캡션-차트, 레이블-표 셀)까지 RPH 확장.
- **[정리자 제안]** 유형별 QA 성능·청크 길이별 성능·도메인별 성능 breakdown 공개.
- **[정리자 제안]** 사실성·환각 평가(Entailment·LLM-as-judge)와 휴먼 평가 추가.
- **[추측]** β 적응형(밀집 슬라이드는 공간↑, 개념 슬라이드는 의미↑)이 일반화에 유리할 수 있으나 원문 근거 없음.

---

## 7. Typodeck 관련성

Typodeck 맥락 전제: `Slide Markdown → Slide IR(버전관리 중간표현) → Composition Engine → 네이티브 편집가능 PPTX`, Visual Critic(이미지+구조 하이브리드 평가), Grammar Registry(버전관리 시각 시스템), Validation-Repair 게이트, 38개 Composition Candidate, 참고 슬라이드 재현 벤치마크, 목표 `Valid PPTX → Good Layout → Intended Visual Hierarchy(의도된 의미 중요도 ≡ 지각된 시각 중요도)`.

### 7.1 직접 연결점(논문 근거 기반)

1. **텍스트 요소 간 관계 모델링의 필요성에 대한 실증**
   - 본 논문 핵심 명제: 슬라이드 이해의 열쇠는 복잡한 텍스트 관계 파악(Introduction, Section 4.2).
   - Typodeck의 Structure Understanding·Grouping이 같은 문제를 생성 관점에서 다룸. 이해→생성 대칭성 확보 가능.
   - Table 5 r1→r4 R-1 +5.9·METEOR +4.4는 관계 모델링의 정량적 가치 근거.
2. **공간+의미 이중 관계(DL-Cluster) ≈ Typodeck의 하이브리드 평가 철학**
   - DL-Cluster는 공간 클러스터(배치 근접·동일 그룹)와 의미 유사도(Sentence Transformer)를 β 가중 결합.
   - Visual Critic의 이미지+구조 하이브리드, Grammar Registry의 시각 시스템과 정합. 특히 "공간 제거 시 R-1 42.2→38.3(-3.9), 의미 제거 시 42.2→41.4(-0.8)"(Table 7)는 공간 배치의 지배적 기여를 보여 Typodeck의 레이아웃 우선순위와 부합.
3. **관계 활용 방식(RAL)이 Grouping·어텐션 설계에 시사**
   - RAL은 관계 행렬로 어텐션 마스크 생성 → 관련 요소끼리만 정보 교환.
   - Typodeck Composition Engine의 요소 그룹핑·정렬·계층 결정 시 동일 원리(관련군 내 응집, 무관군 격리) 적용 가능. 단 본 논문은 이해용 hard mask이므로 생성용으론 soft 버전 필요(§7.3).
4. **청크(동일 sub-topic) 개념 ≈ Slide IR의 의미 단위**
   - LecSlides의 lecture chunk는 리스트 연속 공개 등 의미 연속성을 유지하는 분할 단위.
   - Typodeck Slide Markdown→IR 변환 시 의미 단위 분할·병합 규칙 설계에 참조 가능. 평균 3.2장·최빈 2장이라는 수치는 IR 청크 크기 기본값 논의의 출발점.
5. **4개 QA 유형 ≈ Visual Critic·Validation 체크 차원**
   - textual reasoning 64%·visual analysis 18%·data interpretation 14%·binary choice 4%.
   - Typodeck 재현 벤치마크의 평가 루브릭(텍스트 논리·시각 대응·데이터 정확·이진 적합성)으로 매핑 가능.
6. **전문성 지표(FRES·Grade)가 난이도 표지의 선례**
   - FRES 34.3(Hard), Grade 14.1. Typodeck 참고 슬라이드 벤치마크에 난이도·도메인 태깅 도입 시 동일 지표 활용 가능.

### 7.2 활용 아이디어(구체, 우선순위순)

1. **Slide IR 관계 레이어에 RPH류 pseudo-label 파이프라인 도입**
   - 입력: IR 요소 박스+텍스트 → DL-Cluster식 공간 클러스터 + 임베딩 유사도 → 요소 관계 그래프(관련/무관) 생성.
   - 용도: Composition Candidate 38종의 그룹핑 사전정보, 정렬·간격 결정의 prior.
   - 기대: 관계군 기반 레이아웃 후보 축소 → 탐색 효율↑.
   - 주의: β·K·임계값은 강의→일반 슬라이드 재튜닝 필요(§7.3).
2. **Validation-Repair 게이트에 관계 일관성 검사 추가**
   - 검사: 논리 관련 요소가 시각적으로 격리됐는지(거리·색·크기 단절), 무관 요소가 오인될 만큼 근접·동형인지.
   - 본 논문 Fig.1(b) 사례(좌상 요구사항 vs 블록별 단계 설명)를 negative/positive 패턴으로 전환.
   - 지표: 관계군 내 분산(공간+스타일) vs 군간 분리도.
3. **Visual Critic에 의미-시각 중요도 일치(意図 hierarchy) 점수 정의**
   - 본 논문 Summary(전역 핵심 추출) + QA(세부 위치 파악) 이중 평가를 차용:
     - 전역: IR 의미 중요도 상위 요소가 시각 중요도(크기·대비·위치) 상위와 일치하는가.
     - 세부: 특정 질의(예: "핵심 수치의 근거는?")에 답하는 요소가 시각적으로 특정 가능한가.
   - Typodeck 목표 `Intended ≡ Perceived`의 측정 연산자로 전환.
4. **참고 슬라이드 재현 벤치마크에 LecSlides식 분할·지표 이식**
   - 동일 sub-topic 청크 분할 원칙 → 재현 단위 정의.
   - 요약류는 ROUGE·METEOR + 휴먼/LLM 사실성, QA류는 EM·F1 + 요소 위치 정확도 병행.
5. **Grammar Registry에 관계-스타일 규칙 버전관리**
   - 예: `relation.spatial.same-cluster → spacing.compact`, `relation.semantic.high + spatial.far → style.bridge(connector|color-link)` 같은 규칙을 버전관리.
   - 본 논문의 공간·의미 이원론을 스타일 문법으로 승격.
6. **사전학습 데이터로 LecSlides-370K 검토(조건부)**
   - Table 4 `†` 결과(사전학습 시 test EM +4.9·F1 +3.8)는 전이 가치의 근거.
   - 단 강의 도메인 편향·라이선스 확인 후, Typodeck 목표 분포와 혼합·도메인적응 전제.

### 7.3 주의점·비판적 검토

1. **도메인 전이 간극**
   - 강의 슬라이드(개념 전달·목록·flow chart) vs Typodeck 산출물(IR→PPTX 생성, 마케팅·IR·보고 범용). 레이아웃 어휘·강조 전략 상이.
   - business 과대표·law/marketing 과소 분포가 그대로 학습되면 특정 도메인 레이아웃 편향 가능.
2. **이해용 hard mask를 생성에 직이식 금지**
   - RAL의 `-∞` 차단은 이해(노이즈 제거)에 유효하나, 생성(새 배치 탐색)에선 가능성 조기 차단.
   - [추측] 생성용으론 soft 가중·제약 완화(constraint penalty) 형태가 적합하나 원문 근거 없음.
3. **무유형 관계의 표현 한계**
   - Typodeck Grouping·Structure Understanding은 계층·순서·참조 방향이 핵심이나 본 논문은 무방향 이진 관계만 제공.
   - 그대로 쓰면 "관련은 알되 어떻게 묶을지는 모름" 상태. 유형화 확장 없이 Grammar 규칙으로 직결 어려움.
4. **의사라벨 의존성과 재현 불투명**
   - Table 5에서 약지도 기여가 절대적(r2→r3 +4.3)이나 N·정규화·모델명·규칙 미공개 → 동일 성능 재현 보장 없음.
   - Typodeck 도입 시 자체 의사라벨 파이프라인 재구현·튜닝 비용 발생.
5. **시각 요소 관계 공백**
   - RPH는 텍스트 간만 모델링. 차트·표·일러스트와 텍스트 연결은 미해결 → 데이터 슬라이드·인포그래픽 비중 높은 Typodeck에 그대로 적용 시 공백.
6. **평가 지표의 표면성**
   - ROUGE·METEOR·EM·F1은 레이아웃·시각 위계 품질을 측정하지 않음. Typodeck의 `Good Layout → Intended Hierarchy` 목표와 직접 연결 안 됨.
   - 인용 시 "이해 성능"과 "생성·레이아웃 품질"을 혼동하지 말 것.
7. **라이선스·윤리**
   - Slideshare 크롤링물의 재배포·상용 조건 원문 미기재. GitHub/HF 라이선스 확인 전 학습·벤치 편입 금지.

---

## 8. 인용 포인트(Typodeck 논문용 주장 3개)

### 인용 1 — 슬라이드 이해·생성의 핵심은 텍스트 관계 모델링

- **주장(초안):** "슬라이드의 압축적·헤드라인식 텍스트와 복잡한 텍스트 관계는 내부 논리 파악의 핵심 장애물이며, 관계 모델링은 이해 성능을 직접 좌우한다."
- **원문 근거:**
  - Section 1: "Texts in slides are often conclusive and headline-style statements…" + "complex text relations pose additional challenges… to grasp the internal logic."
  - Section 1·4.2: "understanding complex text relations… is the key part of understanding slides."
  - Table 5: 관계 모듈 제거(r1) R-1 36.3 → 전체 적용(r4) 42.2 (**+5.9**), METEOR 26.9→31.3 (**+4.4**).
- **Typodeck 연결 문장(초안):** "우리는 이 관계를 생성 관점에서 역이용한다: IR 요소 간 관계 그래프를 Composition Engine의 그룹핑·배치 prior로 주입해 의도된 의미 구조와 지각된 시각 구조의 일치를 노린다."
- **주의:** 원문은 이해 전용. 생성 전이 주장은 본 논문 근거를 넘어서므로 "착안"으로 한정 표기.

### 인용 2 — 공간+의미 이중 관계가 상호 보완, 공간 기여 지배적

- **주장(초안):** "슬라이드 요소 관계는 공간 배치와 의미 유사도의 결합으로 가장 잘 포착되며, 특히 공간 구조의 기여가 크다."
- **원문 근거:**
  - Section 4.2.2 DL-Cluster: `s = 0.7·Norm(s_spa) + 0.3·Norm(s_sem)`, 0.5 이진화.
  - Table 7: 양자 병용 R-1 42.2 vs 공간만 41.4 vs 의미만 38.3. 공간 제거 시 -3.9, 의미 제거 시 -0.8.
  - Table 6: DL-Cluster 42.2가 K-means(k=3) 40.9·(k=4) 40.7·HAC 41.0·DBSCAN 41.3 전부 상회.
- **Typodeck 연결 문장(초안):** "이는 Typodeck의 이미지+구조 하이브리드 평가와 Grammar의 공간-우선 규칙 설계의 실증적 근거가 된다."
- **주의:** β=0.7/0.3은 강의 슬라이드 고정값. 일반 슬라이드 최적값이 아님을 명시.

### 인용 3 — 대규모 슬라이드 데이터의 사전학습 전이 가치 + 기존 VL 모델의 세부 텍스트 취약

- **주장(초안):** "대규모 슬라이드 코퍼스의 사전학습은 외부 슬라이드 QA로 전이되며, 순수 시각-언어 모델은 슬라이드 세부 텍스트 추출 부족으로 열위다."
- **원문 근거:**
  - Table 4: LecSlides 사전학습→SlideVQA 미세조정(`†`) 시 test EM 37.5→42.4 (**+4.9**), F1 43.9→47.7 (**+3.8**). SlideVQA 대비 강의 9.7배·슬라이드 7.1배 규모(Section 3.1·Fig.1).
  - Table 2·3: Vid2Seq· mPLUG 등 시각 중심 모델이 Summary·QA 모두 최하위권. 원문 해석: "only processing visual modality may lead to a lack of detailed content extraction."
  - 데이터 규모: 25,542 강의·370,078 슬라이드·15영역·요약 114,472·QA 259,461(Table 1).
- **Typodeck 연결 문장(초안):** "따라서 우리의 파이프라인은 시각 렌더 평가에만 의존하지 않고 IR 텍스트·구조를 일급 입력으로 유지하며, 벤치마크도 텍스트 논리·시각 대응·데이터 정확 차원으로 분리 평가한다."
- **주의:** 전이 실험은 이해→이해. 이해→생성 전이는 원문 근거 없음. "추측" 표기 없이 단정 금지.

---

## 부록 A. 핵심 수치 빠른 대조표

| 항목 | 수치 | 출처 |
|---|---:|---|
| 강의 / 슬라이드 / 영역 | 25,542 / 370,078 / 15 | Abstract·Table 1 |
| 원시 수집 | 39,784 강의·720,673 슬라이드 | §3.1 |
| 청크 수 / 평균 장수 / 최빈 | 114,472 / 3.2 / 2장 | §3.1·§3.3.3·Fig.2(b) |
| 요약 / QA | 114,472 / 259,461 | §3.2·Table 1 |
| diagrams / illustrations / tables | 94,906 / 34,562 / 18,938 | §3.3.3 |
| 총 단어 / 평균 / 어휘 | 28,220,274 / 76.2 / 84,630 | §3.3.3 |
| 요약 평균 길이 / 답안 평균 길이 | 124.6단어 / 4.1단어 | §3.3.4 |
| QA 유형(TR/VA/DI/BC) | 64% / 18% / 14% / 4% | Fig.2(e) |
| FRES / FK Grade | 34.3 Hard / 14.1 | §3.3.2 |
| 분할 train/val/test | 109,472 / 2,000 / 3,000 청크 | §3.4 |
| SlideVQA 대비 | 강의 9.7배·슬라이드 7.1배 | §3.1·Fig.1 |
| 학습률 / iterations / AdamW | 4e-5 / 41K / (0.9,0.999,wd 0.02) | §5.1 |
| DL-Cluster K / β1 / β2 / 임계 | 8 / 0.7 / 0.3 / 0.5 | §4.2.2 |
| Summary test(SlideParser) | R-1 41.7·R-L 24.7·METEOR 30.4 | Table 2 |
| QA test(SlideParser) | EM 23.6·F1 32.1 | Table 3 |
| SlideVQA test(SlideParser†) | EM 42.4·F1 47.7 | Table 4 |

## 부록 B. 원문 미기재 목록(재현·인용 시 확인 필요)

- Slideshare 수집 시점·크롤링 범위·라이선스·재배포 조건.
- 광고·부가정보 필터 규칙·청크 분할 자동/수동 여부·알고리즘.
- 위치·텍스트 어노테이션 생성 방식(OCR 엔진·수작업·모델+검수)·품질 지표.
- 요약·QA 작성 주체(전문가/크라우드/LLM)·가이드라인·검수·합의도.
- 어노테이션 파일 스키마(JSON 등)·HuggingFace 경로·학습 코드 하이퍼 전체(배치·GPU·에폭·시퀀스 길이·해상도).
- DL-Cluster N·Norm 종류·투표 규칙·Sentence Transformer 모델명·0.5 선정 근거·RAL 층수 N·concat 세부.
- 유형별·길이별·도메인별 breakdown, 통계 유의성, 휴먼 평가, 실패 사례, Limitations·윤리 논의.

## 부록 C. 판독 한계 고지

- pdftotext 2단 추출 특성상 Fig.1~Fig.4 캡션·표 셀 순서·수식 첨자가 일부 뒤섞임. 위 정리는 문맥 재구성 결과이며, Eq.1 네 번째 항(`log(w_i/w_j)` 중복)과 `M = H P × P H` 깨짐, Table 1 OCR 기호는 PDF 원도 대조 권장.
- 저자명·수치·표 값은 추출 텍스트 기준 전수 대조. 모호한 분모(평균 76.2단어 등)는 추정 표기.
- CVF·HuggingFace 정확 URL은 원문에 없어 기재하지 않음. GitHub만 원문 명시 URL로 인용.
