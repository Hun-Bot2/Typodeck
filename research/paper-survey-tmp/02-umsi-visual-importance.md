# 논문 전문 정리: Predicting Visual Importance Across Graphic Design Types (Fosco et al., UIST 2020)

> 읽기 범위 확인: 지정된 원문 텍스트 파일(329줄, 67,648바이트, arXiv HTML 변환본) 전체를 처음부터 끝까지(초록→1 서론→2 관련연구→3 Imp1k→4 UMSI→5 평가→6 응용→7 결론→References) 빠짐없이 읽고 작성함. 파일 쓰기 없이 결과 텍스트로 반환함.
> 주의: HTML 변환 과정에서 Table 1·2의 행 레이블(모델명)이 소실되어 수치만 남아 있음. 해당 부분은 원문 서술을 기준으로 정리하고, 행-모델 대응은 추측임을 별도 표기함.

---

## 0. 서지 정보

- **제목**: Predicting Visual Importance Across Graphic Design Types
- **저자**: Camilo Fosco (MIT)¹, Vincent Casser (MIT)¹, Amish Kumar Bedi (Adobe Inc.)², Peter O'Donovan (Adobe Inc.)², Aaron Hertzmann (Adobe Research)³, Zoya Bylinskii (Adobe Research)³
- **발표처/연도**: ACM UIST 2020 (UIST'20, 2020년 10월 20–23일). 본문 표기: "Note: This is the author's preprint copy. This is not the official ACM published version, which will appear at UIST 2020."
- **arXiv**: arXiv:2008.02912v1 [cs.CV], 2020년 8월 7일. 링크: https://arxiv.org/abs/2008.02912 (원문 내 "Back to Abstract / Download PDF" 링크로 확인)
- **카테고리/키워드**: H.5.1 Information Interfaces and Presentation Multimedia / Graphic Designs; Importance; Saliency; Human Attention; Automated Design; User Interface for Design; Deep Learning
- **코드/데이터/프로젝트 페이지**: 원문 초록 각주에 명시 — "The model, code, and importance dataset are available at: http://predimportance.mit.edu" (DOI는 원문 미기재)

---

## 1. 한눈 요약 (5문장)

1. 이 논문은 5종의 그래픽 디자인(광고, 인포그래픽, 모바일 UI, 영화 포스터, 웹페이지)과 자연 이미지를 단일 모델로 처리하는 Unified Model of Saliency and Importance(UMSI)를 제안한다.
2. 핵심 아이디어는 입력의 디자인 유형을 먼저 자동 분류한 뒤, 클래스별 특성에 맞춘 importance(디자인)/saliency(자연 이미지) 히트맵을 예측하는 것으로, 사용자가 입력 유형을 지정할 필요가 없다.
3. 이와 함께 5개 클래스 × 200개 = 1,000개 디자인에 크라우드소싱 중요도 어노테이션을付与한 Imp1k 데이터셋을 새로 구축·공개한다.
4. UMSI는 기존 importance 데이터셋(GDI)과 Imp1k에서 이전 최고 성능 모델을 모든 지표에서 상회하고(CC 기준 GDI에서 54% 향상), 자연 이미지 saliency에서도 최신 모델(SAM)에 근접한 성능을 보인다.
5. 나아가 예측된 중요도를 실제 설계 과정에 쓰는 두 응용(상대 중요도 목표치를 맞추는 대화형 디자인 도구, 중요도 순위를 보존하며 화면비를 바꾸는 reflow 도구)을 프로토타입과 사용자 평가로 입증한다.

---

## 2. 연구 문제와 배경

### 2.1 visual importance vs saliency 개념 구분 (원문 근거: §1, §2)

- **saliency**: 시선 고정(eye fixation)을 모델링하는 개념. 주로 자연 이미지에서 "사람이 어디를 보는가"를 예측하는 데 쓰여 왔음(§1: "Unlike saliency or visual flow which model eye fixations and trajectories, respectively").
- **visual flow**: 시선 궤적(trajectory)을 모델링하는 개념(만화[10], 웹페이지[30] 대상 선행 연구).
- **importance**: 시청자에게 관심/관련(relevance)이 있는 디자인 요소를 식별하는 개념(§1: "importance identifies design elements of interest/relevance to the viewer"). 시선 추적 대신 "중요해 보이는 요소"를 직접 어노테이션한 값의 평균으로 근사함. 논문은 importance가 "하위(downstream) 디자인 응용의 구성 요소(building block)로서 더 실용적"이라고 주장함(§1).
- **중요한 개념적 선택** (§2): "[7], [29]의 선행 연구와 마찬가지로, 우리는 디자이너가 지정한(designer-specified) 중요도가 아니라 시청자가 식별한(viewer-identified) 중요도 개념을 사용한다. 미학(aesthetics)이나 디자인 휴리스틱을 명시적으로 고려하지 않으며, 콘텐츠 시청자의 행동 모델링에 집중한다." 이 구분은 Typodeck의 "의도된 중요도 vs 지각된 중요도" 구도에서 정확히 '지각된 중요도' 측에 대응하는 모델임을 의미함.

### 2.2 기존 모델의 한계 (원문 근거: Abstract, §1, §2, §3 서두)

1. **개별 특화 데이터셋 학습과 낮은 일반화**: "이전의 saliency·visual importance 예측 방법들은 개별 특화 데이터셋에 각각 학습되어, 적용 범위가 제한적이고 새로운 이미지 클래스에 대한 일반화가 poor하며"(Abstract). 자연 이미지용 saliency 모델을 그래픽 디자인에 적용하면 성능이 poor하고[7][17], 시각화[27]·모바일 UI[10]·웹페이지[30][32]용 특화 saliency 모델들도 각 디자인 클래스 밖으로의 일반화 능력이 제한적임(§2).
2. **사용자가 모델을 직접 골라야 함**: "사용자가 어떤 입력에 어떤 모델을 적용할지 알아야 한다"(Abstract). 광고·예술·교육 등 도메인별로 콘텐츠·레이아웃·외양이 크게 달라, 디자이너는 자신의 디자인 클래스에 맞춰 학습된 모델을 찾아야 하는 문제(§1).
3. **기존 importance 데이터셋의 편중**: 이전에 이용 가능했던 importance 어노테이션 그래픽 디자인 데이터셋(GDI[29])은 포스터·광고에 한정됨. 반면 웹페이지·모바일 UI는 구조가 상당히 달라, 포스터만으로 학습한 모델은 일반화되지 않음(§3 서두).
4. **기존 importance 모델의 구조적 한계**:
   - O'Donovan 등[29]: 최초의 importance 접근법. 크라우드소싱 GDI 데이터셋 수집 후 importance 예측 모델 학습. 단, 새 디자인에 일반화하려면 디자인 요소의 위치·정렬에 대한 어노테이션이 필요함(테스트 시점에 사람의 그래픽 요소 위치 어노테이션을 요구하는 "Full" 비자동 모델)(§2, §5.1).
   - Bylinskii 등[7]: 최초의 end-to-end 딥러닝 importance 예측. Fully Convolutional Network[26]에 semantic segmentation 사전학습 가중치를 사용해 GDI에 fine-tune. 그러나 과도한 텍스트 편향(excessive text bias)이 한계로 지적됨(§5.2).
5. **응용 측면의 한계**: 기존에는 예측된 importance를 디자이너에게 보여주는 수동적 피드백[7]이나 이미지 기반 리타게팅[7], 수동 어노테이션을 요구하는 리타게팅[29] 수준에 머물렀음(§2). 썸네일링[21][31] 용도로도 쓰였으나, 디자인 과정에 능동적으로 개입하는 인터페이스는 없었음.

---

## 3. 핵심 기여 (번호 목록, §1末·Abstract 기준)

1. **UMSI (Unified Model of Saliency and Importance)**: 서로 다른 종류의 디자인에 대한 importance와 자연 이미지에 대한 saliency를 함께 예측하는 통합 딥러닝 모델. 입력 디자인 유형 자동 분류 모듈 내장.
2. **Imp1k 데이터셋**: 5개 클래스(웹페이지, 영화 포스터, 모바일 UI, 인포그래픽, 광고)의 1,000개 디자인에 대한 importance 어노테이션 데이터셋.
3. **목표 중요도(target importance) 맞춤용 디자인 수정 도구**: 디자이너가 요소별 목표 중요도를 지정하면 레이아웃을 자동 업데이트하는 대화형 응용(§6.1).
4. **importance를 활용한 reflow 응용**: 디자인 요소들의 상대적 중요도를 보존하면서 새로운 크기·화면비로 자동 변환하는 응용(§6.2).
5. (부수 기여) 모델·코드·데이터셋 공개(http://predimportance.mit.edu), 설계 과정 단계별 attention 전이 데모(§5.2, Fig. 5).

---

## 4. 방법론 상세

### 4.1 Imp1k 데이터셋 (§3)

#### 4.1.1 수집 방법 (§3.1)

- **설계 의도**: 5개의 다양한 디자인 클래스와 용도를 포괄 — 지식 전달용 디자인(인포그래픽), 실용 목적 디자인(웹페이지, 모바일 UI), 홍보 목적 디자인(광고, 영화 포스터).
- **데이터 시각화(data visualization) 제외 이유** (명시적): 선행 연구[7]가 데이터 시각화의 importance를 다루지만, 본 논문은 제외함. 이유: 고도로 구조화된 레이아웃(축, 데이터 마크 등) 때문에 본 연구가 초점을 맞추는 디자인 응용(design applications)에 덜 적합하기 때문(§3 서두). → 슬라이드 도메인 관점에서 시사점: 축·차트 등 구조적 요소가 많은 슬라이드도 같은 이유로 이 모델의 검증 범위 밖에 있음(§7 Typodeck 관련성에서 후술).
- **원천 소스** (기존 연구 데이터셋에서 샘플링 — 자극과 어노테이션을 연구 커뮤니티에 널리 공유하기 위함):
  - 인포그래픽: Visually29k[34]
  - 웹페이지: ClueWeb09[8]
  - 영화 포스터: Chu 등의 영화 포스터 데이터셋[12]
  - 모바일 UI: RICO[15]
  - 광고: Pitt Image Ads[19]
- **샘플링**: 클래스당 200개씩 무작위 샘플링, 총 1,000개. 필터링 기준: 요소가 너무 적은 디자인, 치우친 화면비(skewed aspect ratios), 해당 클래스 내 이상치(outlier)는 제외.
- **PPT/슬라이드 포함 여부**: 포함되지 않음. 5개 클래스는 인포그래픽·웹페이지·영화 포스터·모바일 UI·광고뿐이며, 슬라이드·프레젠테이션에 대한 언급은 원문 전체에 없음(원문 미기재 — §6 한계에서 별도 명시).

#### 4.1.2 ImportAnnots 어노테이션 인터페이스 (§3.1)

- O'Donovan 등[29]의 원래 구현을 기반으로 한 ImportAnnots UI[28] (TurkEyes 웹 기반 크라우드소싱 attention 데이터 도구 모음의 일부) 사용.
- **세 가지 어노테이션 도구**:
  1. regular stroke: 마우스 버튼을 누른 채 페인트브러시처럼 칠하기
  2. polygon stroke: 꼭짓점을 연결해 다각형 그리기
  3. fill stroke: 초기 클릭 위치와 최신 마우스 위치로 경계된 영역을 채워, 연속된 외곽선을 매끄럽게 따라가기
- 참가자는 이 중 어떤 도구를 써서든 가장 중요한 디자인 요소를 어노테이션한 **이진 마스크(binary mask)** 1장을 생성함.

#### 4.1.3 크라우드소싱 규모·품질 관리 (§3.1)

- **플랫폼**: Amazon Mechanical Turk (MTurk).
- **과제 구성**: 같은 클래스의 디자인 10개를 1개 HIT으로 묶음. HIT당 30명 요청. 참가자는 여러 HIT 수행 가능.
- **참가자 수**: 총 249명의 개별 참가자로부터 데이터 수집.
- **품질 관리(센티널)**: HIT당 3개의 센티널(단순한 인공 디자인 — 디자인 내 유일한 가시 요소에 중요도 어노테이션이 covering될 것으로 기대됨) 포함. 센티널 40종을 직접 제작하고 ground truth importance를 수동 어노테이션. 참가자 어노테이션과 ground truth의 IoU(intersection over union)가 0.6 초과인 센티널이 3개 중 2개 이상일 때만 과제 진행을 허용.
- **보상**: 과제 완료당 $1.00 지급.
- **최종 맵 생성**: 1,000개 각 디자인에 대해 25~30개의 개별 이진 어노테이션을 평균하여 importance map 계산. (개별 어노테이션은 주관적이지만, 참가자 평균이 attention map을 근사한다는 선행 보고[7][22][29]에 근거.)

#### 4.1.4 데이터셋 분석 결과 (§3.2, Fig. 2·3)

- **클래스별 importance 패턴 정성 관찰**:
  - 영화 포스터: 제목(title)과 사람 얼굴이 지배적.
  - 웹페이지: 사이트명·회사명(보통 좌상단)에 attention이 끌림.
  - 인포그래픽: 전체 디자인에 importance가 분산.
  - 모바일 UI: 전체에 분산.
  - 광고: 디자인 중앙의 소수 요소에 importance 집중.
- **어노테이션 입도**: 클래스 공통으로 사람이 어노테이션하는 요소는 최대 7개 정도(up to 7 different elements). 이보다 세밀한 어노테이션은 드물었음. → 요소 단위 중요도 비교 지표를 설계할 때, 사람이 구분하는 중요 요소 수의 상한(약 7개)에 대한 경험적 근거로 인용 가능.
- **얼굴/텍스트 정량 분석**: 오픈소스 얼굴 검출기[25]와 텍스트 검출기[33]를 사용해, 디자인별 얼굴·텍스트 바운딩 박스 위의 평균 importance map 값을 계산.
  - 얼굴의 상대적 중요도는 광고와 영화 포스터에서 가장 높으며, 두 클래스가 거의 동점(nearly tied).
  - 텍스트의 중요도는 광고에서 가장 높음. 평균적으로 인포그래픽(텍스트 평균 중요도 2위 클래스)의 텍스트보다 32% 더 중요하게 인식됨.
- **분석의 결론**: 클래스 간 importance 패턴 차이가 크므로, 다양한 디자인에 일반화하면서 각 클래스에 맞춘 예측을 하는 모델이 필요함 — UMSI의 분류 모듈 설계 근거.

### 4.2 UMSI 아키텍처 (§4.1, Fig. 4)

- **전체 구조**: 입력 이미지 → 픽셀별 importance 값을 담은 히트맵 예측. saliency·segmentation 같은 image-to-image 예측 과제와 관련되어 encoder-decoder 구조 채택. 선행 최고 importance 모델[7]이 semantic segmentation 아키텍처[26] 기반이었듯, 본 논문도 서로 다른 스케일의 특징을 활용하는 segmentation 영감의 pyramid pooling 모듈 사용 + 클래스 특화 정보를 활용하는 분류 브랜치 추가.
- **6개 분류 범주** (Fig. 4의 색상 문자 표기): Ads(A), Infographics(I), Mobile-UIs(M), Movie posters(P), Webpages(W), Natural Images(N).

#### 4.2.1 Encoder

- **Xception 인코더** 사용: segmentation[11]·saliency[9] 과제에서 쓰이는 고성능 최신 네트워크. depthwise separable convolution으로 구성되어 계산량 절감이 크고 정확도 비용은 최소.
- **수정 사항**: 최종 global average pooling과 fully-connected 층 제거 → 특징 맵 출력. 고해상도 맵 획득을 위해 1×1 residual connection과 마지막 두 max pooling 층의 stride를 모두 1로 축소.

#### 4.2.2 Atrous Separable Pyramid Pooling (ASPP)

- 인코딩 모듈 뒤에 ASPP 모듈[11] 배치: 여러 scale의 이미지 정보를 집계.
- 주어진 특징 맵 집합에 서로 다른 dilation rate의 dilated convolution을 병렬 적용 → 출력 맵들을 concatenate → projecting convolutional layer로 채널 차원 축소.
- **구체 수치**: 256개 필터의 병렬 convolutional layer 4개, dilation rate = 1, 6, 12, 18.

#### 4.2.3 Decoder

- Convolution + upsampling 층 + dropout의 집합. 파라미터를 크게 늘리지 않고 특징 맵을 원본 이미지 크기로 확대.
- **구체 구성**: 3개 블록 — 처음 2개 블록은 convolutional layer 2개 + 2×2 upsampling 층, 마지막 블록은 convolutional 1개 + upsampling 1개. 이어서 1×1 convolutional layer가 특징 맵을 최종 importance map으로 변환.
- **수치**: convolution 커널 크기 3, dropout 0.3, 전체에 ReLU 활성화.

#### 4.2.4 Classification (분류 모듈)

- 인코더 출력을 병렬로 받는 분류 서브모듈: 3×3 convolutional layer 2개 → 차원 축소용 stride-3 convolutional layer → 3×3 convolutional layer 1개 → global pooling → dropout 포함 dense layer → 1×1×256 특징 벡터 Cf.
- **Cf의 이중 용도**:
  1. 직접적인 입력 클래스 예측: Cf를 6개 출력 + softmax 활성화의 dense layer에 입력 → 1×6 클래스 확률 벡터.
  2. importance 예측용 클래스 특화 정보 주입: Cf를 필요 차원으로 resize → Concatenation layer에서 ASPP 모듈 출력과 채널 차원으로 concatenate → 클래스별 맞춤 히트맵 생성.
- 이 concatenation이 모델의 핵심(central)으로 명시됨.

### 4.3 학습 (§4.2)

#### 4.3.1 학습 데이터 구성

- **어려움의 명시**: 자연 이미지와 그래픽 디자인은 레이아웃·속성이 크게 다르고, ground truth attention 데이터의 수집 수단·형식·양이 다름.
  - 자연 이미지 saliency 학습용 최대 데이터셋: SALICON[20] — 마우스 움직임을 집계한 saliency map, 20K 이미지.
  - 본 논문 이전 유일한 그래픽 디자인 importance 데이터셋: GDI[29] — 1,000개 디자인, 이진 어노테이션 집계 importance map. 주로 Flickr의 광고·포스터로 구성.
  - Imp1k: 1,000개 디자인을 5개 클래스로 분할 (GDI와의 대비점).
- **학습 절차(training procedure)**:
  1. SALICON에 10~15 epoch 사전학습(pre-train) → saliency 전반 관련 이미지 특징 학습.
  2. 그래픽 디자인 importance 데이터셋(GDI 또는 Imp1k — 평가 설정에 따라 선택)에 fine-tune.
  3. 디자인 importance 학습 중 saliency를 "잊지" 않도록, fine-tuning의 매 epoch마다 새로운 SALICON 이미지 160장을 섞음. 이 수는 Imp1k 학습 시 클래스 균형을 유지함(학습 집합 = 클래스당 200개 중 80% = 160개이므로, SALICON 160장과 균형).
- **데이터 분할(training details)**:
  - SALICON: 10K 학습 / 5K 검증 / 5K 테스트 분할[20] 사용.
  - GDI: [7]과 동일한 train/test 분할 사용.
  - Imp1k: 각 클래스에서 20%를 무작위 선택해 테스트 집합으로 정의(클래스당 40개, 총 200개 테스트 — 수치 계산은 정리자 산출).

#### 4.3.2 학습 설정 (수치)

- **손실함수**: KL 손실(계수 10) + CC 손실(계수 −3) 조합. 분류 서브모듈용 binary cross-entropy 손실(가중치 5).
- **학습률**: 1e-4, 3 epoch마다 1/10로 감소.
- **정규화**: 과적합 방지를 위해 모든 층에 dropout 0.3.
- **배치/옵티마이저**: 배치 크기 8, Adam 옵티마이저.
- (원문 미기재: 전체 epoch 수(fine-tune 단계), 이미지 입력 해상도, 하드웨어/GPU 사양, 학습 소요 시간, Adam의 beta 등 세부 하이퍼파라미터.)

---

## 5. 실험 결과 상세

### 5.1 importance 예측 평가 (§5.1, Table 1·2, Fig. 6·7)

#### 평가 설정

- **데이터셋**: GDI와 Imp1k 두 importance 데이터셋에서 평가.
- **지표**: 4종 — R²(↑), RMSE(↓), CC(Pearson 상관, ↑), KL(↓). CC는 saliency 평가의 권장 지표[6]로 명시.
- **베이스라인**:
  - GDI 평가: 이전 최고 importance 모델[7], O'Donovan 모델[29]의 "Full"(테스트 시 사람 어노테이션 요구, 비자동)과 완전 자동(fully-automatic, 저성능) 버전, 두 선행 모델의 결합(combined) 모델(원문 표기 "[6]과 [29]의 결합으로 [6]에 보고된 것" — 참조 번호가 문맥상 어색하므로 HTML 변환 과정의 참조 번호 오류일 가능성이 있음. 의미상 [7]+[29] 결합으로 보이나 원문 미확인 상태로 표기함), 최신 saliency 모델 SAM[14]을 SALICON 사전학습 후 GDI에 fine-tune한 버전.
  - Imp1k 평가: [7]을 전체 데이터셋에 학습한 버전(B. et al.), [7]을 5개 클래스별로 각각 학습한 5개 모델(B. et al. x5), SAM[14]을 Imp1k에 fine-tune한 버전, UMSI 변형 2종(아래 절제 연구).

#### 결과 (서술 기준 — 표의 행 레이블이 변환본에서 소실되어 모델별 수치 대응은 추측 표기)

- **GDI(Table 1)**: UMSI가 4개 평가 지표 모두에서 이전 최고 importance 모델[7]을 상회. 특히 CC 지표에서 이전 모델 대비 54% 향상(notably achieves an improvement of 54% over the prior model according to CC). 테스트 시 사람 어노테이션을 요구하는 비자동 O'Donovan "Full" 모델과 완전 자동 O'Donovan 모델도 상회. 두 선행 모델의 결합 모델(combined model)도 상회.
- 변환본 Table 1에 남은 수치 행(6행, 순서대로): (0.539, 0.212, –, –), (0.754, 0.155, –, –), (0.576, 0.203, 0.596, 0.409), (0.769, 0.150, –, –), (0.693, 0.146, 0.884, 0.102), (0.781, 0.120, 0.915, 0.086). 열 순서는 R²↑, RMSE↓, CC↑, KL↓. 일부 행의 CC/KL이 '–'인 것은 구형 모델이 R²/RMSE만 보고한 것과 부합함(추측). 마지막 행이 전 지표 최적(R² 0.781, RMSE 0.120, CC 0.915, KL 0.086)이므로 UMSI 행일 가능성이 높으나(추측), 원문 확인 없이 단정하지 않음.
- **Imp1k(Table 2)**: UMSI가 모든 대안을 상회 — 전체 학습 [7], 클래스별 5개 [7](B. et al. x5), fine-tune된 SAM, UMSI-nc, UMSI-2stream. 이는 학습 데이터가 아닌 아키텍처 설계의 기여를 입증한다고 주장.
- 변환본 Table 2에 남은 수치 행(6행, 순서대로, 열 = R²↑, RMSE↓, CC↑, KL↓, Acc↑): (0.072, 0.181, 0.758, 0.301, –), (0.061, 0.205, 0.732, 0.388, –), (0.108, 0.168, 0.866, 0.166, –), (0.095, 0.152, 0.802, 0.177, –), (0.105, 0.141, 0.852, 0.168, 0.91), (0.115, 0.134, 0.875, 0.164, 0.98). 마지막 행이 전 지표 최적 + 분류 정확도 포함이므로 UMSI, 5번째 행(Acc 0.91)이 UMSI-2stream일 가능성이 높으나(추측), 원문 확인 없이 단정하지 않음.
- **정성 결과(Fig. 7)**: 자연 이미지+그래픽 디자인을 함께 학습했기에 텍스트·시각 요소 비중이 다양한 이미지에서 importance를 올바르게 분배. 대조적으로 saliency 모델(SAM)은 시각 영역(얼굴·이미지)을 과예측하고, 포스터·광고에만 학습한 importance 모델([7])은 복잡한 디자인에 일반화하지 못하고 모든 텍스트 요소를 비슷한 중요도로 과예측함.
- **어려운 사례(Fig. 7e·f)**: (e) 제시된 데이터를 이해해야 importance를 맞출 수 있는 인포그래픽은 모든 모델에 어려움. (f) 어떤 디자인 클래스에도 속하지 않는 드로잉에도 처음 두 모델(UMSI 등)은 올바른 예측 생성 — 클래스 외 입력에 대한 일반화 사례로 제시.
- **실패 모드(Fig. 6)**: (a) 미묘한 텍스트 오버레이를 놓치고 자연 이미지로 분류, 얼굴을 과도 강조. (b) 세부가 많은 광고를 인포그래픽으로 오분류(그래도 최상단 importance는 유지). (c) 복잡하고 번잡한 디자인: 분류는 맞았으나 부차적인 텍스트 오버레이를 최중요로 선택.

### 5.2 saliency 예측 평가 (§5.2, Fig. 1·5)

- **SALICON 테스트셋** 평가: UMSI는 CC 0.782, KL 0.341. 비교 대상 SAM[14]은 CC 0.811, KL 0.324. 즉 state-of-the-art에 필적(comparably)하나 소폭 하회.
- **정성 관찰**: SAM과 출력 히트맵 패턴이 매우 유사 — 인물·얼굴 검출, 고대비 요소 식별이 올바름(Fig. 1, Fig. 5a).
- **설계 과정 proof-of-concept (Fig. 5)**: SALICON 이미지를 배경으로 한 디자인을 생성하고 설계 단계별 importance 어노테이션을 수집. 자연 이미지 상태에서는 정확한 saliency map 예측 → 제목 요소 추가 시 광고로 분류하고 제목을 최중요로 예측 → 요소 추가에 따라 이미지·요소 전반에 importance 분배 + 배경 이미지 중요도 감소. [7]의 한계였던 과도한 텍스트 편향(diminished text bias)이 완화되어, 텍스트보다 부차 디자인 요소의 중요도를 정확히 인식함.

### 5.3 분류 정확도 및 절제 연구 (§5.3, Fig. 3, Table 2)

- **분류 모듈 정확도**: Imp1k 5개 클래스 판별 평균 정확도 95%. 클래스별 정확도는 Fig. 3에 보고(변환본에서 그림 수치 확인 불가 — 원문 미기재扱い). Fig. 3에서 모델이 5개 클래스를 구분하는 importance 일반 경향을 학습했음을 확인.
- **절제 연구(ablation)**: 분류 모듈의 기여도 평가를 위해 2개 변형 추가 학습.
  - UMSI-nc: 분류 모듈 완전 제거.
  - UMSI-2stream: 분류 모듈이 importance 예측에 직접 피드백되지 않고(Fig. 4 구조 아님), ASPP 모듈 뒤에서 분기 — 그래도 인코더·ASPP가 학습하는 특징에는 영향.
  - 결과: 두 대안 모두 원 아키텍처보다 저성능. 분류 스트림이 전혀 없는 경우(UMSI-nc)의 점수 하락이 가장 큼.

### 5.4 응용 데모 2종 (§6)

#### 응용 1: 모델 보조 대화형 디자인 — 상대 중요도 조정 도구 (§6.1, Fig. 8·9)

- **개념**: 선행 연구[7]의 수동적 실시간 importance 시각화를 넘어, 사용자가 importance 모델과 능동적으로 상호작용하며 디자인 제안을 받는 유스케이스. 최적화 절차와 결합해 사용자가 부과한 제약에 맞게 디자인을 능동 조정하는 모델의 능력을 평가하기 위한 최소 기능(bare-bones) 프로토타입.
- **워크플로**: 사용자가 캔버스에서 디자인 요소를 조작 → 각 요소의 예측 importance 실시간 피드백(히트맵) → (신규) 각 요소의 importance 점수와 직접 상호작용하며 요소별 중요도 증감 제약 지정 → 최적화 절차가 새 디자인 변형들을 생성하고 importance 모델로 점수화.
- **최적화**: 디자인 요소들의 시각적 배치(scale·위치)를 조정하는 genetic algorithm. 현재 예측값과 사용자 지정 목표값 간 격차(gap)를 줄이는 조정을 선택. (최적화 알고리즘 자체는 본 논문의 기여가 아니므로 구현 세부사항은 Supplemental Material에 위임 — 원문 미기재.)
- **UI 구성(Fig. 8)**: A) 벡터 그래픽 파일을 드래그할 캔버스, B) 디자인 요소 합성용 레이어 집합, C) 현재 디자인의 실시간 계산 importance map 미리보기, D) 전 요소의 예측 importance 점수를 나열한 대화형 막대 그래프(요소별 importance = 해당 요소 마스크 내부 importance 값들의 평균), E) 막대값 조정 시 실행되는 최적화 절차의 진행 바.
- **기술 구조**: 프론트엔드 UI와 백엔드 importance 모델 간 실시간(TCP 네트워크 기반) 인터페이스 → GPU 연산 인프라에서 원격 계산. 사용자 조작에 따라 백엔드에서 모델을 연속 실행해 예측을 실시간 업데이트.
- **상호작용 순서 예시(Fig. 8 하단)**: (i) 요소 클릭 → 막대 그래프에서 해당 요소 점수 하이라이트, (ii) 막대 조정 → 최적화 절차 실행되어 디자인 자동 조정, (iii) 전 요소 목표값 도달까지 반복, (iv) importance 히트맵 선택 → 최종 디자인에 오버레이.
- **사용자 평가(정량)**:
  - 6개 초기 디자인 × 디자인당 3개 요소(각각 importance를 높이고자 선택) × 5회 연속 실행 = 총 90개 디자인 변형.
  - 각 변형과 6개 초기 디자인에 대해 ImportAnnots UI로 ground truth importance map 수집(디자인당 25명 어노테이션).
  - 모델 예측과 ground truth의 평균 CC = 0.928 (상한 1.0) — 높은 일치.
  - 6개 디자인 × 3개 제약 평균, 목표 요소의 importance 증가 성공률 87%.
- **결과 예시(Fig. 9)**: (상) 단순 광고에서 할인(discount) 강조 → 선택 요소를 확대·중앙 배치하는 공간 재배열. (하) 행사 장소 강조 + 행사 제목 두드러짐 감소 → 시간·날짜 텍스트와 장소를 분리해 관련 정보 확대 여지 확보. 한 요소의 목표 중요도 변경은 보통 이웃 요소에도 영향을 줌(다른 요소가 중요도를 얻도록 여지를 주면서 이웃 요소들의 중요도를 최대한 보존).
- **논의·한계 명시**: 디자인 도구 자체는 bare-bones이며 균형·대칭 등 미적 속성을 최적화하지 않으므로, 반환 결과가 양질의 디자인임이 보장되지 않음. 그럼에도 사용자 지정 importance 목표 달성률 87%로, 향후 디자인 도구에서 importance 모델의 효용에 대한 초기 가능성을 보임. AI·자동 지원을 인터페이스에 통합하는 최선책은 해당 분야의 큰 미해결 문제(open problem)라고 명시.

#### 응용 2: 모델 보조 디자인 reflow (§6.2, Fig. 10·11)

- **개념**: 입력 디자인을 다른 크기 변형(대체 폼팩터·기기 대응)으로 만들 때, importance 히트맵에서 계산한 디자인 요소별 importance 점수로 요소 재배치·크기조정을 안내. 핵심 명제: "reflow 결과에서 전 요소의 상대적 importance 값을 보존함으로써, 디자인 요소들에 attention을 배분한 디자이너의 의도를 유지한다."
- **통합 방식**: 상용 레이아웃 애플리케이션 개발자와 협업해 importance 모델을 reflow에 통합. 사용자가 초기 디자인 제작·업로드 → 기본 조작(배치·확대축소·그룹화) → 만족 시 디자인을 이미지로 백엔드 importance 모델에 전송 → 예측 히트맵으로 각 요소 범위(extent) 위의 평균 importance 값을 계산해 그래픽 요소들의 importance 순위(rank) 결정.
- **Reflow 알고리즘**:
  - 입력: 초기 디자인 + 목표 디자인 크기(Fig. 10a).
  - 클래스별·크기별·요소 수별로, 해당 디자인의 각 요소 importance 순위를 표시한 템플릿을 수동 제작(Fig. 10c). 비슷한 크기·요소 수의 전문(professional) 디자인을 참고해 작성, reflow 애플리케이션에 저장.
  - 테스트 시: 입력 디자인과 요소 수가 같고 목표 디자인 크기와 화면비가 비슷한 템플릿을 검색 → 초기 디자인의 각 요소를 importance 순위가 일치하는 템플릿 placeholder에 매핑 → 원본 디자인의 요소 importance 순위를 보존.
- **사용자 평가 1 — 크라우드워커**:
  - 17개 그래픽 디자인 × 3종 자동 변형(대체 화면비): (i) importance 미사용 베이스라인(사용한 상용 앱의 기본 constraint-based 엔진), (ii) 선행 최고 importance 모델[7] 사용 reflow, (iii) UMSI 사용 reflow.
  - 과제: 변형을 1(최고)~3(최저)으로 순위화. 개인 판단 기준, 추가 지침 없음. 변형 순서는 디자인·참가자별 무작위화.
  - MTurk 100명 모집, 1인당 9개 무작위 + 3개 반복 디자인, $1.50 보상. 반복 3개 중 2개 이상 일관되게 순위화한 참가자만 유지 → 43명 데이터 사용(남 29, 주로 20~30대). 디자인당 평균 23명의 순위.
  - 결과: UMSI 사용 reflow가 다른 두 변형보다 유의하게 우수(p<0.05, Bonferroni 보정)(Fig. 11a). [7] 사용 reflow와 베이스라인 차이는 유의하지 않음.
- **사용자 평가 2 — 전문 디자이너**:
  - 개인 네트워크에서 6명 모집(남 3, 25~45세, 경력 3~20년). 각자 17개 전 디자인에 3종 변형 순위화, $5.00 보상.
  - 결과: 평균 순위로 UMSI 사용 reflow가 다른 두 변형보다 우수 확인(Fig. 11b).
- **논의**:
  - 특정 디자인 도구 내 평가지만, reflow 품질 향상이 고무적. 향후 reflow는 importance를 추가 제약(원본·redesign 간 요소 importance 순위 보존)으로, 균형·대칭 등 일반 미적 지표와 결합할 수 있음.
  - 연구 목적·결과 출처를 모르는 전문 디자이너 참가자의 언급 인용: 좋은 reflow 결과를 만드는 것은 "요소들의 위계(hierarchy) — 가장 중요한 것을 먼저 읽도록 만드는 것."
  - 본 접근법은 요소 크기와 위치만 수정. 향후 색상·폰트 등 다른 특징도 reflow 중 시각 중요도에 영향을 주는 요소로 고려 가능.
  - 주목점: UMSI로는 reflow 개선을 달성했으나 선행 최고 모델[7]로는 못했음. UMSI는 더 다양하고 복잡한 디자인에 잘 일반화하고 텍스트 편향이 적음(Fig. 10b,d) — reflow 응용에 더 적합한 특성. Fig. 10e 사례에서는 모든 방법의 점수가 비슷했고, 핵심 차이는 후속 모델일수록 남자의 얼굴에 더 zoom-in했다는 점. UMSI는 그래픽 디자인에 더해 자연 이미지로도 학습했기에 얼굴이 사람에게 매우 salient함을 학습해 우선시함. 베이스라인 결과는 입력 디자인의 crop에 가장 가까움.

---

## 6. 한계와 후속 과제

### 6.1 논문에 명시된 한계·후속 과제

1. **대화형 도구의 미적 품질 무보장** (§6.1 Discussion): 도구가 균형·대칭 등 미적 속성을 최적화하지 않으므로 결과물이 좋은 디자인이라는 보장이 없음.
2. **reflow의 제한된 조작 범위** (§6.2 Discussion): 요소 크기와 위치만 수정함. 색상·폰트 등 다른 특징은 향후 과제.
3. **AI 지원 통합의 미해결 문제** (§6.1 Discussion): 인터페이스에 AI·자동 지원·협업을 통합하는 최선책은 분야의 큰 open problem.
4. **실패 모드 존재** (§5.1, Fig. 6): 미묘한 텍스트 오버레이 누락 + 자연 이미지 오분류, 세부 과다 광고의 인포그래픽 오분류, 복잡한 디자인에서 부차 요소의 최중요 오선택.
5. **어려운 입력 유형** (§5.1, Fig. 7e): 제시된 데이터의 이해를 요구하는 인포그래픽은 모든 모델에 어려움.
6. **데이터 시각화 미포함** (§3): 구조화된 레이아웃 때문에 의도적으로 제외 — 적용 범위 제한의 명시적 인정.
7. **saliency 성능이 SOTA에 소폭 하회** (§5.2): CC 0.782 vs SAM 0.811, KL 0.341 vs 0.324. "comparable"이나 엄밀히는 낮음.
8. **최적화·템플릿의 수동/외주 요소**: 응용 1의 genetic algorithm 세부사항은 Supplemental Material 위임(본문 미기재), 응용 2의 템플릿은 수동 제작 + 상용 앱의 기존 엔진 활용.

### 6.2 정리자가 본 방법론적 한계 (논문 미명시 — 구분 표기)

1. **[정리자 지적] PPT/슬라이드 도메인 미검증**: Imp1k의 5개 클래스와 GDI(광고·포스터), SALICON(자연 이미지) 어디에도 프레젠테이션 슬라이드가 포함되지 않으며, 원문 전체에 슬라이드 언급이 없음. 슬라이드는 (a) 16:9/4:3 고정 화면비, (b) 제목+본문+그림의 반복 위계, (c) 발표자 음성과 병행 소비, (d) 장식보다 정보 전달 우선이라는 고유 특성이 있어, Imp1k 학습 모델이 그대로 전이될 보장이 없음. Typodeck 인용 시 반드시 한계로 명시해야 할 점.
2. **[정리자 지적] viewer-identified vs designer-intended의 간극**: 논문이 모델링하는 것은 어디까지나 '시청자가 중요하다고 느낀 것'이지, 디자이너의 의도가 아님(§2에서 명시). Typodeck의 목표("의도된 의미 중요도와 지각된 시각 중요도의 일치")에서 이 모델은 후자(지각) 측 proxy로만 쓸 수 있고, 전자(의도)는 Slide IR의 구조(제목/강조/순서 등)에서 별도 도출해야 함.
3. **[정리자 지적] 요소 수 상한(약 7개)**: 어노테이션 분석에서 사람이 구분한 중요 요소가 최대 7개 정도. 요소가 많은 고밀도 슬라이드에서는 맵 평균 기반 요소 점수의 변별력이 떨어질 수 있음(추측).
4. **[정리자 지적] 평균 기반 요소 점수의 조잡함**: 두 응용 모두 "요소 범위 내 맵 값의 평균"을 요소 점수로 사용. 요소 내부 분포(어디가 뜨거운지), 요소 간 대비, 읽기 순서 등은 반영하지 않음. 순위(rank)까지만 쓰고 순위 간격(얼마나 더 중요한지)은 활용하지 않음.
5. **[정리자 지적] 분류 모듈의 닫힌 세계 가정**: 6개 고정 클래스 + softmax. 슬라이드 같은 미지 클래스는 가장 가까운 기존 클래스(예: 인포그래픽?)로 강제 분류되며(추측), 그 경우 클래스 특화 concatenation이 오히려 편향을 주입할 수 있음. Fig. 6의 오분류 사례가 이 위험을 뒷받침.
6. **[정리자 지적] 평가 지표의 한계**: R²/RMSE/CC/KL은 모두 픽셀 분포 유사도 지표로, "위계가 맞는가(1순위 요소가 1순위로 예측되는가)" 같은 순위·위계 정확도를 직접 재지 않음. Typodeck의 Hierarchy Agreement와는 별도 지표 설계가 필요.
7. **[정리자 지적] 응용 평가의 표본 규모**: 응용 1은 6개 초기 디자인, 응용 2는 17개 디자인·전문가 6명으로 proof-of-concept 수준. 통계적 일반화에는 부족.
8. **[정리자 지적] 재현 정보 부족**: 입력 해상도, fine-tune epoch 수, 전처리·증강, GPU·학습 시간 등이 본문에 없음(원문 미기재). SuperMat 참조 없이는 재현 불가.

---

## 7. Typodeck 관련성

Typodeck 맥락 전제: Slide Markdown→Slide IR(버전관리 중간표현)→Composition Engine→네이티브 편집가능 PPTX 파이프라인, Visual Critic(이미지+구조 하이브리드 평가), Grammar Registry, Validation-Repair 게이트, 38개 Composition Candidate, 참고 슬라이드 재현 벤치마크, 목표 방향 Valid PPTX→Good Layout→Intended Visual Hierarchy.

### 7.1 직접 연결점 (논문 근거 있음)

1. **요소별 중요도 점수 산출법의 직접 차용**: 논문의 두 응용은 공통으로 "각 요소 범위(extent) 위의 평균 importance 값"으로 요소 점수를 계산하고(§6.1: "averaging the importance values inside the mask of each design element", §6.2: "computing the average importance value over each element's extent"), 응용 2에서는 이를 순위화(rank)함. Typodeck의 Slide IR은 요소 마스크/바운딩박스를 네이티브로 가지므로, 슬라이드 렌더링 이미지에 importance 모델을 적용한 뒤 IR 요소 마스크로 평균을 내면 '예측된 지각 중요도' 벡터를 그대로 얻을 수 있음. 이는 Visual Critic의 이미지+구조 하이브리드 평가에 정확히 들어맞는 결합점임.
2. **"상대 중요도 보존" 원칙 = Hierarchy Agreement의 원형**: 응용 2의 핵심 명제("reflow 결과에서 전 요소의 상대적 importance 값을 보존함으로써 디자이너의 의도를 유지")는 Typodeck의 Intended Visual Hierarchy 목표와 같은 철학임. 논문이 순위(rank) 보존까지만 구현했으므로, Typodeck의 Hierarchy Agreement(Spearman·Kendall 순위상관) 지표는 이를 정량 지표화한 정당한 확장으로 논문에 위치지을 수 있음.
3. **Primary Emphasis Accuracy의 근거**: 논문 Fig. 7·9와 응용 1 평가("목표 요소의 importance 증가 성공률 87%")는 '최상위 중요 요소가 의도대로 되는가'라는 1순위 적중 개념을 이미 암묵적으로 평가함. Typodeck의 Primary Emphasis Accuracy(1순위 의도 요소가 예측 1순위인지)는 이 성공률 개념의 지표화이며, "87% 성공" 수치를 선행 성과 baseline 인용으로 쓸 수 있음(단, 도메인·조건이 다르므로 직접 비교는 불가하고 동기 부여용 인용으로 한정).
4. **Validation-Repair 게이트의 선례**: 응용 1의 루프(목표 중요도 지정→최적화로 레이아웃 조정→모델로 검증)는 Typodeck의 Validation-Repair 게이트와 구조적으로 동일함(제약 지정→재생성/수리→재검증). 논문이 genetic algorithm + scale/위치 조정이라는 약한 최적화로도 87% 달성을 보인 점은, Composition Engine(38개 candidate)이 더 강한 생성기이므로 게이트 성공 가능성이 높다는 논증 재료가 됨(추측 포함 — 아래 주의점 참조).
5. **시청자 모델 vs 의도 모델의 역할 분담 명시**: 논문이 viewer-identified 중요도만 모델링함을 명시(§2)했으므로, Typodeck 논문에서 "UMSI류 모델 = 지각(perceived) 측면, Slide IR 구조(제목/강조/독서 순서) = 의도(intended) 측면"이라는 이원 구조를 정당화하는 인용으로 쓸 수 있음. 두 측면의 비교(Hierarchy Agreement)가 곧 논문의 기여가 되는 구도.
6. **"위계가 좋은 reflow의 정의"라는 전문가 증언**: §6.2의 전문 디자이너 인용("the hierarchy of elements, making sure we read the most important thing first")은 Intended Visual Hierarchy를 목표 방향으로 삼는 정당화 인용으로 직접 사용 가능.
7. **텍스트 편향 완화의 필요성**: [7]의 과도한 텍스트 편향이 §5.2에서 한계로 지적되고 UMSI가 이를 완화했다고 주장됨. 텍스트 밀도가 높은 슬라이드에서는 텍스트 편향이 치명적이므로(제목이 항상 1순위로 예측되는 trivial 해법 위험), 모델 선정·파인튜닝 시 텍스트 편향 검증이 필수라는 요구사항의 근거가 됨.

### 7.2 활용 아이디어 (추측 표기)

1. **(아이디어/추측) Visual Critic에 '예측 위계 vs 의도 위계' 모듈 추가**: 렌더링 PNG → importance 모델(UMSI 또는 후속 모델) → IR 요소 마스크 평균 → 예측 순위. 의도 순위는 Slide Markdown/IR의 구조적 단서(見出し 레벨, 강조 표시, 배치 순서, Grammar Registry의 역할 태그)에서 도출. Spearman·Kendall 상관을 Hierarchy Agreement로, 1순위 적중을 Primary Emphasis Accuracy로 정의.
2. **(아이디어/추측) 38개 Composition Candidate의 랭킹 신호**:同一 IR에 대한 38개 후보 렌더링 각각의 Hierarchy Agreement를 계산해 후보 선택·정렬 신호로 사용. 논문 응용 1의 "모델로 변형들을 점수화"하는 용법(§6.1)과 동일 패턴.
3. **(아이디어/추측) 재현 벤치마크의 위계 평가 차원 추가**: 참고 슬라이드 재현 벤치마크에 픽셀 유사도뿐 아니라 "참고 슬라이드의 예측 위계 vs 재생성본의 예측 위계" 일치도 차원 추가. 동일 모델을 양쪽에 적용하므로 모델 편향이 상쇄되는 상대 비교가 됨(추측).
4. **(아이디어/추측) 슬라이드 특화 분류 클래스 추가**: UMSI의 학습 절차가 "새 학습 집합이 주어지면 임의 개수의 추가 클래스에 적응 가능"(§7)하므로, 슬라이드 어노테이션 소규모 구축 시 7번째 클래스로 확장하는 후속 연구 구도. 단, 원문 공개 코드의 확장 용이성은 미확인(원문 미기재).
5. **(아이디어/추측) Repair 연산자 설계 힌트**: 응용 1의 결과 패턴(강조=확대+중앙 배치, 비강조 요소의 여지 확보 재배치, 이웃 요소 중요도 보존)은 Composition Engine의 repair 연산자(스케일/위치 조정)의 우선순위 설계에 참고 가능.

### 7.3 슬라이드 도메인 전이 시 주의점

1. **미검증 도메인임을 전제**: §6.2 항목 1과 동일. 인용·활용 시 "광고·포스터·인포그래픽·웹·모바일 UI에서 검증, 슬라이드 미검증"을 반드시 명시.
2. **오분류 시 클래스 편향 주입 위험**: 슬라이드가 6개 기존 클래스 중 하나로 강제 분류될 때(예: 텍스트 많음→웹페이지? 그림 많음→광고?), 클래스 특화 경로가 잘못된 prior를 주입할 수 있음(추측). 전이 실험 시 분류 출력 분포를 먼저 확인할 것. UMSI-nc(분류 없는) 변형과의 비교도 고려.
3. **16:9 고정 화면비와 필터링 조건의 충돌**: Imp1k 수집 시 치우친 화면비를 필터링(§3.1)했으므로, 16:9 와이드 슬라이드는 학습 분포 외일 가능성(추측). 입력 리사이즈/패딩 방식이 예측에 미치는 영향 확인 필요.
4. **텍스트 과밀 슬라이드**: 텍스트 편향 이슈(§7.1 항목 7). 제목이 항상 뜨거워지는 trivial 예측인지, 본문 간 변별이 되는지 별도 검증 필요.
5. **발표 맥락의 부재**: 논문의 importance는 정적 이미지 시청 기준. 실제 슬라이드는 발표자 설명과 함께 소비되므로 '발표 중 지각 중요도'와 괴리 가능(추측). Typodeck 지표는 "정적 렌더 기준 지각 위계"로 범위를 한정해 정의하는 편이 안전.
6. **요소 입도 불일치**: 논문의 요소는 그래픽 요소 단위(마스크 평균), Typodeck IR의 요소는 텍스트 박스·도형·차트 등. 차트·표 같은 복합 요소 내부의 중요도 분포는 평균 하나로 뭉개짐(§6.2 항목 4). 복합 요소는 하위 분해 또는 별도 처리 고려.
7. **라이선스·실용성**: 모델·코드가 공개되어 있으나(§0), 라이선스 조건은 원문에 없음(원문 미기재). 상용 파이프라인 편입 전 확인 필요. 또한 2020년 Xception 기반 모델이므로, 최신 트랜스포머 기반 saliency/importance 모델과의 성능 비교 없이 채택하지 말 것(추측이 아닌 일반적 권고).

---

## 8. 인용 포인트 (Typodeck 논문용 주장 3개)

1. **"시청자가 지각하는 중요도는 크라우드소싱 어노테이션의 평균으로 근사할 수 있으며, 이는 attention map의 대리(proxy)가 된다"**
   - 원문 근거: §3.1 "While each participant's importance annotation is subjective, prior work has reported that the average over participants produces heatmaps that approximate attention maps [7][22][29]." 수집 조건: 디자인당 25~30명, 센티널 IoU>0.6 (2/3 이상), $1.00/HIT(10개).
   - 용도: Visual Critic의 예측 중요도를 '지각된 위계'의 정당한 대리치로 정의하는 근거.
2. **"디자인 요소의 중요도는 예측 히트맵 위에서 요소 범위 내 평균값으로 정량화하고 순위화할 수 있으며, 상대 중요도(순위) 보존이 디자이너 의도 유지의 핵심이다"**
   - 원문 근거: §6.2 "The predicted importance heatmap is then used to rank the graphic elements by importance, by computing the average importance value over each element's extent. Our proposition is that by preserving the relative importance values of all the design elements in the reflow result, we maintain the designer's intention in allocating attention across design elements." + 전문가 인용 "the hierarchy of elements, making sure we read the most important thing first."
   - 용도: Hierarchy Agreement(의도 순위 vs 예측 순위의 Spearman·Kendall) 지표 설계의 직접적 선행 근거.
3. **"통합 importance 모델은 단일 클래스 특화 모델들을 상회하며, 목표 중요도를 맞추는 자동 레이아웃 조정에서 87% 성공률을 보였다"**
   - 원문 근거: §5.1 GDI에서 CC 기준 이전 모델 대비 54% 향상, 4개 지표 전부 상회 / Imp1k에서 전체·클래스별 특화·SAM 변형 전부 상회(Table 2). §6.1 응용 평가: 90개 변형 평균 CC 0.928, 목표 요소 importance 증가 성공률 87%.
   - 용도: (a) 단일 통합 Critic이 다종 슬라이드 유형을 처리할 수 있다는 설계 선택의 근거, (b) Validation-Repair 게이트의 달성 가능성nuance — 단, 도메인(광고 위주 6개 디자인)과 표본 규모가 다르므로 직접 성능 비교가 아닌 feasibility 선례로만 인용할 것.

---

*정리 끝. 수치·인용은 지정 원문(329줄 변환본) 기준. 표 행 레이블 소실 등 변환본 한계가 있는 항목은 각각 표기함.*
