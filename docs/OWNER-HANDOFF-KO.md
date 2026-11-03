# TypoPPT 오너 액션 가이드

엔지니어링이 끝냈습니다. 아래 5가지만 오너가 직접 해야 합니다.
순서대로 진행하세요. 예상 총 소요: 2–3시간 (+ 영상 편집 별도).

---

## 1. PPTX 실물 확인 (PowerPoint/Keynote) — 제출 전 필수

**해야 할 일:** 쇼케이스 PPTX 4종을 실제 PowerPoint(또는 Keynote)에서
열어 눈으로 확인합니다.

**오너만 가능한 이유:** 자동 검증은 구조(박스 위치, 금지 요소)만
봅니다. 실제 렌더링(줄바꿈, 자간, 글꼴 대체)은 사람 눈으로만 판단됩니다.
엔지니어링 단계에서는 macOS QuickLook으로만 확인했습니다.

**언제:** 다른 작업보다 먼저. 여기서 문제를 찾으면 알려주세요.

**단계:**

```sh
open docs/showcase/readme-editorial.pptx docs/showcase/readme-swiss.pptx \
  docs/showcase/readme-expressive.pptx docs/showcase/readme-dense-technical.pptx
```

1. 각 파일의 슬라이드 2(숫자 슬라이드)를 봅니다. 큰 숫자와 제목이
   겹치지 않아야 합니다. (엔진 수정으로 해결됨 — 확인 필요)
2. 텍스트 상자를 클릭해 글자를 직접 고쳐봅니다. (편집 가능성 확인)
3. 한국어 덱도 확인합니다 (아래 명령으로 생성 후 열기):

```sh
node packages/core/dist/scripts/make-deck.js \
  --idea-file packages/core/fixtures/idea-ko.txt --lang ko \
  --system swiss --out /tmp/ko-check.pptx && open /tmp/ko-check.pptx
```

**완료 기준:** 4개 파일 모두 겹침 없이 읽히고, 텍스트 편집이 되며,
한국어 덱의 한글이 깨지지 않습니다.

## 2. 데모 영상 녹화 (60–90초) — 제출 전 필수

**해야 할 일:** 실제 화면을 녹화합니다. 대역·합성 footage는 없습니다.

**오너만 가능한 이유:** 목소리/화면/계정이 오너의 것이어야 하며,
외부 공개물이라 오너 승인이 필요합니다.

**언제:** 1번 확인 직후.

**단계:** [docs/media/VIDEO-RECORDING-GUIDE.md](media/VIDEO-RECORDING-GUIDE.md)의
씬 1–7을 순서대로 녹화합니다 (총 82초 분량). 민감정보(토큰·계정명)가
화면에 안 잡히게 주의하세요. 녹화 후 알려주시면 README 삽입은
[VIDEO-INTEGRATION.md](media/VIDEO-INTEGRATION.md) 절차대로 처리합니다.

**완료 기준:** 가이드의 Acceptance checklist 7항목이 모두 체크됩니다.

## 3. 브랜드 확정 — 공개 전 필수

**해야 할 일:** 두 가지를 결정합니다.

**오너만 가능한 이유:** 제품명과 시각 정체성은 오너의 결정입니다.

**언제:** README 공개 전 (제출과 무관하게 빨리 정할수록 좋음).

**단계:**

1. 제품명: 공개 브랜드 **TypoPPT**로 갑니까? (코드 식별자는 당분간
   `typodeck` 유지 — 패키지·CLI·스킬명은 바꾸지 않았습니다.)
2. `brand/typoppt/`의 3개 방향 보드를 봅니다
   (`direction-a-editorial.svg`, `direction-b-swiss.svg`,
   `direction-c-display.svg`). 현재 선택은 **B (Swiss)** 입니다.
   유지/변경을 알려주세요.

**완료 기준:** “TypoPPT + B 유지” 또는 변경안을 회신합니다.

## 4. 공개 저장소 Owner 결정 — 공개 전 필수

**해야 할 일:** 공개 repo의 owner(org)를 정합니다.

**오너만 가능한 이유:** GitHub org 생성/계정 권한이 필요합니다.

**언제:** 최초 공개 푸시 전.

**배경:** 현재 원격은 `Hun-Bot2/Typodeck`인데, 플러그인 매니페스트의
URL은 `github.com/typodeck/typodeck`을 가리킵니다. `typodeck` org명은
이미 사용 중이라 그대로 쓸 수 없습니다.

**단계:**

1. 공개 owner를 정합니다 (예: `Hun-Bot2/Typodeck` 그대로 공개).
2. 알려주시면 매니페스트 URL·README clone 주소를 owner에 맞춰
   수정합니다. (엔지니어 작업, 10분)

**완료 기준:** 공개 URL이 확정되고, 매니페스트와 README가 그 URL을
가리킵니다.

## 5. 해커톤 제출 — 마감 전

**해야 할 일:** 제출 폼에 아래를 기재합니다.

- 데모 영상 (2번 결과물)
- 저장소 URL (4번에서 확정)
- 핵심 문장: “You bring the content. TypoPPT handles the design.”
- 근거 자료: `docs/showcase/`의 PPTX 4종 (실제 편집 가능),
  `evals/summary.json` (24/24), 테스트 575/575

**완료 기준:** 제출 접수 확인.

---

## 참고: 엔지니어가 이미 끝낸 것 (조치 불필요)

- Agent Skill 설치·실행 검증, 의도 파악(EN/KO) UX
- 27개 템플릿의 CLI·Studio·API 연결 (experimental)
- 한국어 export 수정 (ko-KR 로케일, KR 글꼴, 금칙 처리)
- 숫자 히어로 겹침 버그 수정 (3개 시스템 렌더 확인)
- README·브랜드·쇼케이스·영상 가이드
- 전체 테스트 575/575, Studio smoke 확인

## 의도적으로 손대지 않은 것

- 코드 식별자 개명 (`typodeck` → TypoPPT 일괄 변경 안 함)
- 디렉토리 대규모 이동 (마감 전 안정성 우선)
- 패키지 배포·마켓플레이스 등록·외부 배포 (오너 승인 필요)
- PowerPoint 실렌더 비교 (오너 환경에서 1번으로 수행)
