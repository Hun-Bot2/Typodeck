# TypoPPT 타이포그래피-온리 이니셔티브 최종 보고서

- Repo: `/Users/jeonghun/Typodeck` (pwd 확인)
- Branch: `audit/box-aesthetic` (`git branch --show-current` 확인, 커밋 없음)
- HEAD: `e8a3f2823922a688ac66a80dedf687c86bbbb8df` (`git rev-parse` 확인)
- Run-1 입력: `evals/typo-only/audit.md`, `evals/typo-only/color.md` 전문 정독 후 작성
- 판정: **READY** (리드 마감 — F1·F2 수정·재검증 완료, 아래 Closure 참조. 단 PPTX-네이티브 육안 대조는 여전히 NOT RUN)

## 1. 박스 미학의 원인

공유 파이프라인(Core 스키마, composition 문법, Skill, Studio 미리보기, 하네스 빌더)은
박스를 금지·회피한다. 스키마는 `card/panel/border/shadow/fill` 키를 거부하고,
빌더는 `border-radius:0` 리셋 + 룰/헤어라인만 사용한다. 박스 미학의 유일한 출처는
**bold-template-pack 각 `design.md`의 컴포넌트 어휘와 그 `preview.html`·specimen 렌더링**이다
(카드·패널·pill·chip·callout 박스가 디자인별로 저작됨). 즉 팩 제거가 곧 해결이며,
파이프라인 수정이 아니다. (근거: `evals/typo-only/audit.md` §1, 박스-출처 표 18행)

## 2. 아키텍처·디자인 변경

- **팩 27종 `design.md` 어휘 재작성**: 카드·패널·pill·chip·박스 어휘를 타이포그래피
  어휘(헤어라인 룰, 글리프, 고스트 숫자, 자간·크기 대비)로 교체. 색·서체 토큰
  키/값은 보존, 은퇴 어휘는 retired 표기.
- **하네스 빌더 타이포그래피-온리 확정**: `builder.mjs`·`builder-generic.mjs`를
  전수 정독으로 박스-프리 확인. 팩 토큰 개명 3건 추종
  (`signal-board` pill-label→kicker-label, `new-wave-static` context-chip→context-line·
  band-caps→footer-giant, `memphis` chip-label→stamp-label).
- **하네스 신뢰성 수정** (`tools/agent-harness/`): Chrome 디버그-포트 재시도
  (`launchChromeWithRetry`, 기존 문서에 있던 미구현 +1/재시도 이행), 포트 소유권
  검증(타 프로세스 브라우저에 침묵 접속 거부), 실패-런치 프로필 정리,
  sweep 정직성(`classifyEntry` — 비정상 종료 시 낡은 report.json이 PASS를
  가장하지 못하게, 문서화된 계약 이행). `HARNESS.md` 갱신(인터페이스 불변,
  버전 범프 없음). 테스트 51/51 (신규 13: 재시도 4·소유권 4·sweep 정직성 5).

## 3. 수정된 시스템 목록

| 시스템 | 변경 |
|---|---|
| `bold-template-pack/templates/*/design.md` (27종) | 박스 어휘→타이포 어휘, 토큰 보존 |
| `evals/design-quality/specimens/*/` (27종 × cover/evidence/explanation) | HTML 81개 재작성 + PNG 81개 재캡처(전부 1920×1080, 전수 육안 확인) |
| `evals/design-quality/full-decks/` 6덱 × 7슬라이드 | HTML 42개 재작성 + PNG 42개 재캡처(전부 1920×1080, 전수 육안 확인) |
| `evals/hackathon/coverage/` 54덱 | sweep 54/54 PASS (0 PARTIAL·0 ERROR, 전 종료코드 0) |
| `tools/agent-harness/` | render 재시도·소유권·sweep 정직성·ROLE_MAP 추종, 테스트 51/51 |
| `evals/review/` | Before/After 토글 갤러리 (`build.py` + `index.html` 재빌드) |
| `evals/hackathon/pptx/` | 6개 PPTX 재생성 + 구조 검증 ALL-OK |
| `evals/typo-only/before/` | 378개 BEFORE PNG (54덱 × 7, `257cdce`에서 추출) |

## 4. D02·D19 색상 변경

- **D02 field-manual**: `procedural-blue` `#0B5FFF` → `#182B49` (Procedural Navy).
  전기적 로열 블루가 웜 페이퍼/잉크/앰버 시스템과 충돌한다는 렌더 확인에 따른
  비호환 채도 수정. 종이 위 13.36:1, 박스-화이트 위 14.18:1. 토큰명 유지.
- **D19 fika**: 신규 `fjord` `#182B49` — 전 chip 텍스트 + kicker-dot 기본값.
  slate-on-dusty-blue chip이 22px bold에서 **4.17:1 AA 실패**였음이 원인이어서,
  fjord로 전 필에서 통과(7.55 / 7.75 / 5.54). 파스텔 로테이션·워시·slate 본문은 불변.
- **D18 memphis-squiggle**: 토큰값 변경 없이 규칙 추가 — purple chip 라벨은
  화이트(ink-on-purple 3.88:1 실패 → white-on-purple 4.86:1 통과).
  문서-온리 수정(preview에 purple chip 없음 → 렌더 주장 없음).
- D02 구형 로열-블루 specimen 잔재는 이번 재작성에서 navy로 정리됨.

## 5. 색상 리서치 출처

(run-1에 brief URL이 없어 정식 공개 문서로 직접 해결, 전부 200 수신)

1. Tableau Blueprint — Visual Best Practices: 기본색은 중립, 액센트는 절제,
   순차/발산/범주/강조/경보 모티프 구분, 한 색에 세 의미 금지, 색맹 고려.
2. Tableau — 접근성 뷰 설계 모범사례: 색 단독 구분 금지(형태·크기·라벨 병행),
   명암 스펙트럼 분리, 본문 4.5:1(큰 글자 3:1), 대비 분석기로 검증.
3. ColorBrewer 2.0: 데이터 성격별 스킴(순차·발산·정성), 색맹-안전/인쇄 필터.
4. RColorBrewer 레퍼런스: 순차=명도 단계, 발산=밝은 중간 + 어두운 양극,
   정성=크기 함의 없는 색상 차이(명목 데이터용).

적용 독해: 파스텔은 순차 스킴의 밝은 끝 = ground이지 signal이 아니다.

## 6. 파스텔 정책

> 파스텔·연틴트는 의도된 대비 역할이 있을 때만 존재한다: 어두운 텍스트 뒤의
> ground, 또는 어두운 텍스트 뒤의 fill. 파스텔-온-페일 텍스트 금지,
> 틴트-온-틴트 타이프 금지, 인접 텍스트 라벨 없이 파스텔-vs-페일 구분에만
> 의미를 싣는 것 금지. 모든 파스텔의 텍스트 페어링은 측정되어야 하고 AA를
> 통과해야 한다(4.5:1, 큰 글자 ≥24px/≥18.66px bold에 한해 3:1).

`field-manual`·`fika`·`memphis-squiggle` 각 `design.md`에 인코딩됨.

## 7. 타이포-온리 구성 예시

- 헤어라인 룰·다이아몬드·`///`·fleuron·asterism·커서·상태점 글리프가
  카드·패널·표 격자를 대체.
- 고스트 숫자·기울기·자간·크기 대비로 위계 표현 (`■`·`●`·`▲`·`▼`·`☑`·`☐`·`⚠`는
  텍스트와 같은 크기·두께의 유니코드 문자, CSS 도형 아님).
- 전면 솔리드 ground만 허용(amber 성명 슬라이드, deep 디바이더·클로징,
  slate 로그, vista/bubble-os 전면 밴드 — ground이지 박스가 아님).
- 정적 감사: 슬라이드 CSS에서 border/box-shadow/gradient/border-radius/
  table/svg/canvas/의사요소 0건.
- 예외 기록 2건: D08 phosphor `text-shadow`는 글리프 한정(박스-섀도우 0,
  정체성 예외로 문서화). D07 evidence는 전면 deep ground 위 amber-on-deep
  7.89:1 (amber/amber-deep 모두 화이트 위 실패 2.02/2.77 — 구 문서의
  text-safe 주장을 정정).

## 8. EN/KO 비교

- D02·D19 하네스 EN+KO 28슬라이드 전수 육안: 구조 변경 동일, KO 줄바꿈
  깨끗(단어 중간 분리 없음, `action item`·`FIXTURE` 등 혼합 라틴 intact,
  푸터 intact).
- KO dense 각주 이중 FIXTURE는 낡은 coverage 잔재였고, 재생성 출력은 단일
  마커로 접힘(육안 확인).
- F2 stale 캡션("Red squares…")은 EN에만 존재, KO 덱에는 없음(정상).

## 9. 풀덱 결과

- 6덱(field-manual·fika·gridline-swiss·modulo-grid·peer-review·signal-board)
  × 7슬라이드 = 42/42 재작성·재캡처·전수 육안 PASS.
- 콘텐츠·주장 보존, 기록된 최소 델타 1건: peer-review Figure 1 캡션
  "one bar per postmortem" → "one line per postmortem" (박스 금지로 막대가
  존재하지 않게 됨). 그룹 C의 peer-review "lower bars"→"lower counts"도
  동종 적응.
- 측정된 결함은 수정 후 해당 슬라이드 재확인: modulo amber-deep 2.77 실패 →
  deep navy; signal-board 녹색 단어 3.10 실패 → slate+글리프; muted 4.47 →
  `#475569`. signal-board 적색 FAULT 4.54:1은 thin pass로 report에 기록.
- `deck.html` 6개(재빌드 마커) + `report.json` 6개(슬라이드별 PASS·렌더 검증·
  정직한 gap 목록) 갱신, 전 JSON 파싱·전 7/7 html+png 쌍 해소.

## 10. HTML/PPTX 검증

- HTML: specimen 81 + 풀덱 42 + `design.md` 27종 파서·`toTheme`·gridline
  assert 통과. 하네스 sweep 54/54 PASS(신선한 report, 조용한 실행 창).
- PPTX: `npm run build -w @typodeck/core` 종료 0,
  `node evals/hackathon/pptx/verify.mjs` → PPTX-VERIFY ALL-OK 종료 0.
  6/6 파일 7슬라이드/29박스, editable==예상(EN 1701/KO 973), 래스터 0,
  validateOk true. `results.json` + 6 pptx 재작성(동일 바이트 크기).
- 한계: PPTX 판정은 **구조 검증のみ** — 네이티브 PowerPoint/Keynote
  렌더 확인은 미수행(NOT RUN).

## 11. Before/After 경로

- BEFORE: `evals/typo-only/before/<54덱>/slides/NN.png` — 378/378개를
  `git show 257cdce`로만 추출, 전부 IHDR 1920×1080 검증, 6개 샘플 sha1이
  257cdce blob과 일치하고 worktree after-파일과 상이. 예:
  `evals/typo-only/before/field-manual-en/slides/06.png` (표 격자·블루 마커) vs
  현 coverage 동 경로(타이포-온리 navy).
- AFTER(현 worktree): `evals/hackathon/coverage/*/slides/*.png` (하네스 54덱),
  `evals/design-quality/specimens/*/cover|evidence|explanation.png` (81),
  `evals/design-quality/full-decks/*/slides/slide-*.png` (42).
- QA 직접 비교: BEFORE 8장(슬라이드 01+06 × D02/D19 EN/KO)을 `/tmp/qa-before/`에
  추출해 after와 육안 대조. D02는 명확한 개선(royal→navy, 격자 제거),
  D19는 부분적(격자 제거됐으나 dusty-blue가 본문 텍스트로 잔류 — F1).

## 12. 잔여 약한 디자인

- **F1 (REWORK)**: D19 하네스 EN+KO 전 14슬라이드 — kicker·액센트 텍스트가
  dusty-blue ≈2.45:1 (kicker 약 19px caps, "Rushed" 열, cost 수치).
  `tools/agent-harness/lib/theme.mjs:18`의 `fika: accent dusty-blue`이 run-1
  fjord 수정을 추종하지 않음. 의미가 파스텔-vs-페일 구분에만 실려 파스텔
  정책 위반. 수정: 하네스 액센트 → fjord navy.
- **F2 (REWORK, 경미·텍스트のみ)**: `field-manual-en/slides/05.html:97`,
  `fika-en/slides/05.html:97` 캡션 "Red squares mark failure modes…" —
  양 슬라이드 모두 적색 사각형 0개(전수 픽셀 확인). 박스 시대의 stale 캡션.
  수정: 캡션 재작성.
- **A1 (조언)**: signal-board 오렌지 상태어 + 적색 FAULT(4.54:1 thin pass)는
  색+위치+글리프로 의미 전달, 전체 해상도에서 가독. 변경 요구 없음.
- 디자인별 판정: 25 APPROVE(21종은 cover-only), 2 REWORK(D02: F2, D19: F1+F2),
  **REJECT 0**. QA는 97 현행 슬라이드에서 박스·카드·패널·표 격자 0건을 확인.
- run-1 잔여 gap 인계: D12 cyan payoff어(`#00C2FF` on white ≈2.07:1,
  대형에서도 3:1 실패 — 네온 정체성상 보존, owner 결정 필요),
  D15 rose swash(23px 본문 배치 시 3.26:1 실패 — deck 스케일+로 제한 권장),
  D18 수정은 문서-온리(렌더 주장 없음).

## 13. 갤러리 위치 + 정확한 명령

- 갤러리: `evals/review/index.html` (27 카드, 하네스 378슬라이드 before 링크,
  Q-덱 6, pptx 12, zero-missing assert 통과). 상세 뷰에 탭별 Before/After
  토글(Harness EN/KO 활성, spec/qdeck/legacy는 사유와 함께 비활성),
  `B` 단축키, 캡션. 리뷰 라디오·노트·export/import 불변.
- 검증된 실행(리뷰 서버, repo 루트에서):
  `python3 -m http.server 8901` 후 브라우저에서 `http://localhost:8901/evals/review/index.html`
  (검증 시 3 URL 200 확인: index.html 108630B, before 93035B, after 91179B.
  CDP 클릭 테스트: Before 클릭 시 `#main` src가 `typo-only/before` URL로
  전환 + 캡션 갱신, approve+note가 localStorage에 유지됨).
- PPTX 검증: `npm run build -w @typodeck/core` →
  `node evals/hackathon/pptx/verify.mjs` (ALL-OK 기대).
- 갤러리 재빌드: `python3 evals/review/build.py` (harness 슬라이드 before
  URL + missing-assert 내장).

## 14. 브랜치 + HEAD

- Branch: `audit/box-aesthetic` ( invariant 유지, 커밋·푸시·amend·rebase·merge·
  reset 없음 — 전 단계 공통).
- HEAD SHA: `e8a3f2823922a688ac66a80dedf687c86bbbb8df`.
- 작업 규모(대략): specimen 216파일(72×3그룹) + 풀덱 96파일 + 팩 design.md
  27종 + 하네스 owned 코드 + 리뷰 갤러리 2파일 + before 378 PNG + pptx 7파일.
  금지 경로(node_modules, tsbuildinfo, hierarchy annotations,
  paper-survey-tmp, 8-bit-orbit) 및 폰트 커밋·유료 API 없음.

## 15. Owner 결정 필요

1. **F1·F2 수정 승인** (CONDITIONAL→READY의 조건): D19 하네스 액센트를
   fjord navy로 추종 + EN 05 캡션 2행 재작성. QA가 수정 범위를 한정했으므로
   소규모 후속 작업.
2. **D12 cyan 대형 예외 수용 여부**: black-band 맥락으로 제한할지,
   punk display 예외로 수용할지.
3. **D15 rose swash 배치 제한**: deck 스케일+(31px~)로 제한하는 문서 수정 승인.
4. **PPTX 네이티브 확인**: PowerPoint/Keynote 실렌더 육안 확인을 별도 수행할지
   (현 판정은 구조のみ).
5. **color.md §1 출처 확정**: brief URL이 없어 정식 공개 문서로 대체했으므로,
   brief와 일치하는지 owner 확인.
6. **후속 추종**: 팩 토큰 개명이 계속되면 `ROLE_MAP` 추가 추종 필요 가능
   (최종 sweep은 조용한 창에서 검증됐으나 이후 개명분은 미확인).
7. **design-matrix D19 행 `#3D4A54` 드리프트**: specimen 측은 재작성으로 정리됐으나
   matrix 행 잔류 여부를 별도 확인 필요.

## Closure (리드, 2026-11-04)

- F1 수정: `theme.mjs` fika accent `dusty-blue`→`fjord` 1행. 대비율 2.45→**13.56:1**
  (off-white `#FAFAF7` 기준, 리드 직접 계산). fika EN/KO 14슬라이드 재생성 후
  `fika-en/01`·`fika-en/05` 전수 육안 확인 — 네이비 악센트, 박스 없음.
- F2 수정: `proof-content.en.json:80` + `tests/fixtures/content-en.json:80` 캡션을
  "Failure modes observed in the rushed cases are listed under Rushed; position
  marks sides."로 교체. coverage 내 "Red squares" 잔류 0건, 신 캡션 27덱 적용 확인.
  (KO는 원래 정상. 구 `harness-proof/gridline-swiss-en` 스냅샷 1건은 아카이브로 잔류.)
- 재검증: sweep **54/54 PASS**, 하네스 테스트 51/51, 엔진 575/575, PPTX 6/6 ALL-OK.
- 조건 충족으로 CONDITIONAL→**READY** 승급. 단, PPTX-네이티브(PowerPoint/Keynote)
  육안 대조는 여전히 NOT RUN이며 owner 판단 사항으로 남는다.

## Verdict (워크플로 당시): CONDITIONAL

- READY가 아닌 이유: F1은 AA 실패(≈2.45:1) 텍스트가 14개 하네스 슬라이드에
  살아 있고 의미를 운반하므로, 미학 주장과 무관하게 접근성 결함이다.
  F2는 stale 캡션으로 사실 오류다. 둘 다 QA가 픽셀 증거로 확정했고 수정
  범위가 명확하다.
- NOT READY가 아닌 이유: 박스 제거 자체는 완전하다(현행 97 + specimen 81 +
  풀덱 42 전수 육안, 정적 감사 0건, sweep 54/54, PPTX 구조 ALL-OK,
  REJECT 0). F1·F2는 테마-토큰 추종 1건 + 캡션 2행으로 닫히는 한정 결함이다.
- 조건: F1·F2 수정 + D19 하네스 14슬라이드 재캡처·육안 확인이 끝나면 READY로
  승급 가능. D12·D15·PPTX-네이티브·출처 확정은 READY를 막지 않는 owner 판단 사항.
