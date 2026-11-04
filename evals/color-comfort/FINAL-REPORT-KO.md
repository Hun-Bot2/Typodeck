# Color-Comfort 이니셔티브 최종 보고서

- Repo: `/Users/jeonghun/Typodeck` (pwd 확인)
- Branch: `audit/color-comfort` (`git branch --show-current` 확인, 커밋 없음)
- HEAD: `f0aed775f1cd0e525d7de65442ee3ba661d5c530` (`git rev-parse` 확인, = base `f0aed77`)
- 사전 독해: `evals/typo-only/FINAL-REPORT-KO.md` 전문 (F1/F2·박스 제거·파스텔 정책 = no-regress 제약)
- 판정: **CONDITIONAL** (하네스 범위 검증 완료, specimen/full-deck 재생성 + 재QA가 조건)
- 스코프 선언: 이 보고서는 객관적 편안함 개선을 주장하지 않는다. "편안함" 근거 = WCAG 연산 + 전수 육안(AGENT 판단)뿐이며, 검증된 슬라이드 편안함 지표는 존재하지 않는다(P4). 모든 미학 판단은 **AGENT 판단**이지 인간 평가가 아니다.

## 1. 대상 디자인 + 진단된 문제 (측정 vs 주관 분리)

대상 9종 (`evals/color-comfort/audit.md` §2, 커버 27종 전수 1920×1080 확인 + 대상 커버 전수 육안):

- **A. 전면 near-black 6종**: atelier-noir, coin-op, gilded-line, maison, monolith, night-reel
- **B. 점프형 1종**: modulo-grid (white ↔ deep-navy 슬라이드 간 점프, 렌더 확인)
- **C. dark-not-black 2종**: drafting-table (blueprint-blue 전면), vista (deep-teal 부분 밴드)
- 제외 근거 기록: new-wave-static(블랙 밴드 은퇴 어휘, 현행 white — 부활 금지), 8-bit-orbit(untouchable 참조, 감사 제외)

측정된 문제 [MEASURED]:

- AA 실패 텍스트: maison gray `#6E6E6E` **3.86:1**(소형 본문), maison gold-deep `#9A7F45` on ivory **3.45:1**, 하네스 atelier wine 키커 **1.23:1**(비가시), 하네스 gilded warm-gray muted **1.66:1**(비가시), 하네스 modulo amber-on-white **2.02:1**(자체 규칙 위반)
- 극단 범위: night-reel white-on-black **19.26:1**(감사 최대), atelier 17.81, maison 17.79, gilded 16.82, modulo 15.97
- 점프: maison black↔ivory 문서상 **~250x** 휘도 스윙(팩 최대), modulo white↔deep 렌더 확인 ~60x
- 전채도 액센트: coin-op phosphor/amber S=1.00, monolith signal-orange S=1.00, modulo amber S=0.98
- 얇은 타이프(사실 기록): night-reel/atelier/maison에 300 웨이트 장문, atelier Didone 헤어라인, coin-op 13px micro + 3중 text-shadow 글로우

주관·가설 [HYPOTHESIS — 진단 아님]: 헤어라인 halation 가능성, 글로우 bloom-가독성 트레이드오프, 전면 점프의 불편 후보. 설문·인간 검증 없음, 안구 피로 진단 주장 없음.

## 2. 리서치 원칙 + 출처

`evals/color-comfort/research.md` (428행, 2026-11-04 전원 live 200 수신. 렌더 미시청·비율 미측정·PASS 없음 선언):

| 원칙 | 내용 | 출처 체인 |
|---|---|---|
| P1 ground/ink/accent 위계 | ground는 중립 역할, 본문 단일 ink, 슬라이드당 1 액센트 = 1 의미 | Tableau Blueprint(S1)+Authoring(S3)+UMSI ~7 상한 |
| P2 범주 vs 순차 혼동 금지 | 범주=색상차(밝기 서열 함의 없음), 순서=명도 단계, 편차=발산형 | S8 RColorBrewer 3패밀리 + S1 5모티프 + S7 필터 |
| P3 dark-ground 액센트 절제 | 소형 텍스트가 극성 대가 최대, dark 위 액센트는 저채도, 밝은 방=별도 가독 체크 | NN/g Budiu 2020 종합(S9)+WCAG 휘도 모델(S4)+얇은선 경고(S6) |
| P4 WCAG 통과 ≠ 편안함 | 통과율은 손상시력 가독 하한, 선언색 기반, 극성/환경/시간 무시, 저대비 필요 사용자 존재 | S4 근거+경고, S9/S10, S6 |
| P5 중복 인코딩 | 색 단독 전달 금지, 비색상 쌍(라벨·글리프·크기·위치·3:1 명도차) 필수 | WCAG 1.4.1(S5)+Tableau(S2/S3) |

금지된 보편 처방 6건 (§4): 항상-black-교체 금지, dark-default 전역 반전 금지, 단일 액센트 강제 금지, 비율-온리 리스타일 금지, 근시 근거 극성 논증 금지(S10 n=7 1시간 맥락동·저자도 역학조사 요구), D12/D15를 저대비 선례로 인용 금지.

주요 1차 출처: Tableau Blueprint/Accessible/Authoring(S1–S3), WCAG 2.1 이해문서 1.4.3/1.4.1/1.4.11(S4–S6), ColorBrewer 2.0(S7), RColorBrewer(S8), NN/g Budiu 2020 2차 종합(S9), Aleman/Wang/Schaeffel 2018 PMC6052140 전문(S10, peer-reviewed 1차). 1차 미수행 4건은 §9 인계.

## 3. 유지 vs 변경 팔레트 (디자인별 why)

전 변경은 `design.md` Colors 섹션에 사유 기록 + 토큰값만 변경(타이포·형태 불변):

| 디자인 | 결정 | 값 | 왜 |
|---|---|---|---|
| atelier-noir | ADJUST LUMINANCE + 하네스 remap | noir `#111111`→`#1D1C1B`(16.05:1), accent wine→porcelain | 범위 축소 + wine 키커 1.23:1 비가시 복구, 모노크롬 유지 |
| coin-op | ADJUST SATURATION | phosphor→`#3FE673`(S .77, 12.13:1), amber→`#F2A91E`(S .89, 9.93:1), 글로우 stop 재매칭+alpha 축소, void 유지 | 전채도 2액센트+bloom 완화, D08 glyph-glow-only 유지 |
| gilded-line | RETAIN BG + CORRECTED FG + remap | champagne→`#F0E6D2`(자체 warmer-cover 규칙, 15.58:1), muted warm-gray→champagne-dim(12.44:1) | 비가시(1.66:1) ledger/메타 복구, deco 정체성 유지 |
| maison | RETAIN BG + CORRECTED FG | gray→`#9C9C9C`(7.17:1), gold-deep→`#77632F`(ivory 위 5.26:1), 교대 상한(연속 금지) 명문화 | AA 실패 2건 수정, 4톤 규율 유지 |
| monolith | ADJUST SATURATION | signal-orange→`#F04E12`(S .88, 5.33:1) | 포스터 스케일 전채도 완화, 여전히 loud |
| night-reel | REPLACE DARK TREATMENT | `#000000`→`#101012`(17.43:1, 여전히 black 판독 AGENT), blood-red→`#E5484D`(4.86:1 소형 통과) | 순수흑 제거 + red 소형 AA, letterbox 유지 |
| modulo-grid | ADJUST LUMINANCE + remap | deep→`#1C2C4E`(13.82:1, amber-on-deep 6.83:1), accent amber→deep | 점프폭 축소 + amber-on-white 2.02:1 자체규칙 위반 해소(육안 발견·재검증) |
| drafting-table | RETAIN BG + CORRECTED FG | light-line→`#93C2EE`(5.68:1 P4 헤드룸), blueprint 유지 | thin 여유 확보, 청사진 유지 |
| vista | RETAIN WITHOUT CHANGE | 변경 없음(14.35/9.92/exact-3.00 재확인) | 부분 밴드 한정 + exact-floor 쌍 شکن 위험, prose-only |

`theme.mjs` 3 슬롯 remap: atelier accent wine→porcelain, gilded muted warm-gray→champagne-dim, modulo accent amber→deep. fika fjord 불변(F1 intact).

## 4. Before/After 경로

- BEFORE(색상): `evals/color-comfort/before/<7슬러그>-en|ko/slides/NN.png` — 98장, `git show f0aed77:` 추출のみ, 전장 IHDR 1920×1080 검증, 7 샘플 sha1이 f0aed77 blob과 일치·after와 상이
- AFTER(현 worktree): `evals/hackathon/coverage/*/slides/*.png` (7디자인×EN/KO×7 = 98 변경 + drafting/vista 무델타)
- Typo-before(유지): `evals/typo-only/before/<54덱>/slides/NN.png` 378장 intact
- 대표 대조: `night-reel-en/06` 전후 전수 육안(red 키커/코스트 가독화, ground 상향·여전히 near-black, 레이아웃 동일, 박스 0)

## 5. 풀덱 리뷰 결과

- 전수 육안(전부 1920×1080): AFTER 98장 + BEFORE mate 13장(`git show` 추출) + drafting 01 EN + specimen 커버 9장
- 16/16 대상 report.json PASS 7/7. 픽셀 증거: atelier/night-reel 96–99%(전면 ground), gilded/modulo 1–4%(ink+액센트), maison/coin-op/monolith ≤0.6%(역할 한정)
- 전 하네스 덱 7슬라이드 단일 ground 유지 — 신규 점프 없음. modulo/maison 교대 규율은 prose-only(specimen/full-deck 재생성 전까지 렌더 미검증)
- EN/KO parity clean(줄바꿈·혼합 라틴 intact). KO 05 `.bad` 플래그 부재는 before/after 동일 사전 이슈(비회귀)
- 디자인별 판정(AGENT): **9 APPROVE, 0 REWORK, 0 REJECT** — 단 initiative READY는 §8 조건 필요
- 미검증: `full-decks/modulo-grid` stale(`#14213D`계) — deep 점프 축소 렌더 미확인

## 6. 접근성 + 렌더링 체크

- 대비: QA 독립 재계산 40쌍 전수 일치. 변경 텍스트쌍 전부 AA 여유 통과(최소 night-reel red 4.86:1, 소형 최소 maison gold-deep 5.26:1). 기존 실패 3건 + 비가시 2슬롯(1.23/1.66:1) 수정. 단 maison-ivory는 연산のみ(§9)
- 하네스: `node --test tools/agent-harness/tests/` **51/51**(구현+QA 2회), HTML diff 588+/588− 전수 색값のみ·0 ODD, 98파일 박스 패턴 0건, 렌더 박스 0건
- No-regress: F1 fjord 13.56:1 intact, F2 "Red squares" 0건, D07 amber-off-white·D08 glyph-glow-only 준수, wine 은퇴 유지, 밴드 미부활, 파스텔 정책 준수
- PPTX: `npm run build -w @typodeck/core` 종료 0 → `node evals/hackathon/pptx/verify.mjs` **ALL-OK**(6/6, 7슬라이드/29박스, editable EN 1697/KO 973, 래스터 0). **구조 검증のみ — 네이티브 PowerPoint/Keynote 육안 NOT RUN**(typo-only 인계)

## 7. Owner 불확실 케이스 (AGENT 판단, 인간 눈 필요)

- **U1 atelier**: flag 코스트가 weight-700のみ(구 hue 1.23:1 비기능 — 수용된 트레이드오프)
- **U2 gilded**: muted(12.44:1) vs ink(15.58:1) 명도 간격 협소, 크기/웨이트 의존(대안은 비가시 텍스트)
- **U3 modulo**: flag 코스트 weight-only(자체 amber-on-white 금지로 강제, 규칙 준수 hue 없음)
- drafting-table/vista: 하네스 PNG 델타 0 → 갤러리 색상 토글 After-only. specimen 수준 before/after 필요 여부 owner 판단
- maison gold-deep-on-ivory 5.26:1: 연산のみ — ivory 슬라이드 렌더 전무

## 8. 갤러리 위치 + 정확한 명령

- 갤러리: `evals/review/index.html` (27 카드, 색상 변경 7 뱃지, 슬라이드별 3상태 토글 After/색상-Before(@f0aed77)/typo-Before, `B` 순환, spec/qdeck 탭은 의도적 토글 없음)
- 리뷰 서버(repo 루트): `python3 -m http.server 8901` → `http://localhost:8901/evals/review/index.html` (검증 시 4 URL 200, CDP 클릭 테스트 PASS, 리뷰 라디오·노트·export intact, 미변경 덱 색상 버튼 비활성 확인)
- 갤러리 재빌드: `python3 evals/review/build.py` (cbefore 참조 98 + typo-before 378 intact + assert)
- PPTX 검증: `npm run build -w @typodeck/core` → `node evals/hackathon/pptx/verify.mjs` (ALL-OK 기대)

## 9. 미해결 인계 (전 단계 — 한 건도 낙하 없음)

- [audit] 실제 덱 점프 빈도 미정량(harness coverage 범위 외)
- [audit/구현/QA/갤러리 공통] PPTX-네이티브 외관 NOT RUN (typo-only 인계 gap)
- [audit/구현] 8-bit-orbit dark ground 미감사·불변(byte-identical 참조, 범위 외)
- [research] Piepenbrock/Mayr/Mund/Buchner 2013 1차 NOT RUN(403/쿠키월/401 — NN/g 2차 인용のみ)
- [research] Dobres/Chahine/Reimer 2017 1차 NOT RUN(페이월 미시도 — NN/g 2차のみ)
- [research] Legge 1985 + Papadopoulos/Goudiras 2005 1차 NOT RUN(NN/g 2차のみ)
- [research] Aleman 2018 nature.com판 NOT RUN(인증 리다이렉트 — PMC6052140 동일 논문 전문으로 대체 검증)
- [구현/QA/갤러리] `evals/design-quality/specimens/**` 8종 stale(구 토큰 HTML+PNG) — 타 단계 재생성 + 재QA 필요
- [구현/QA] `coverage.json` 최종 full-sweep 기록 유지, 54덱 full sweep 미재실행(개별 report.json은 현행 PASS 7/7)
- [구현/QA] 검증된 편안함 지표 없음 — 변경은 WCAG 연산 + 전수 육안 근거, 편안함 주장 아님
- [specimen 단계] 선행 BLOCKED 해소 경과: 당시 working tree에 팔레트 부재로 0건 수정·핸드페이크 거부(정당한 중단). **합성 시점에 9종 design.md 팔레트가 전부 랜딩 확인됨**(예: modulo diff 검증) → 재시도 트리거 충족. 단 steps 2–4(9×3 specimen PNG + modulo full-deck 7장 재캡처·육안·report.json) 여전히 미착수
- [QA] `preview.html` 8건 색편집 코드 정합하나 PNG 렌더 NOT RUN
- [QA] U1/U2/U3 owner-불확실 AGENT 판정 (§7)
- [갤러리] spec/qdeck 갤러리 탭 색상 토글 없음(의도적 — stale PNG 탓)

## 10. 브랜치 + HEAD + 작업 규모

- Branch: `audit/color-comfort` (불변 유지, 커밋·푸시·amend·rebase·merge·reset 없음)
- HEAD SHA: `f0aed775f1cd0e525d7de65442ee3ba661d5c530`
- 변경 규모: design.md 9종 + preview.html 8종 + theme.mjs 3슬롯 + coverage 14덱×15파일 + color-before 98 PNG + 리뷰 갤러리 2파일 + pptx 7파일. 금지 경로 및 `evals/typo-only/**`(읽기 전용) 불변, 폰트 커밋·유료 API 없음

## 11. Owner 결정 필요

1. **조건 승인**: 8종 specimen + `full-decks/modulo-grid` 재생성 + 재QA 범위 승인 (CONDITIONAL→READY의 조건)
2. **U1·U2·U3 수용 여부**: weight-only 플래그 / 협소 muted 간격의 현 상태 확정 또는 2차 인코딩 강화
3. **drafting-table/vista**: After-only 토글로 충분한지, specimen 수준 before/after 필요한지
4. **PPTX 네이티브 확인**: PowerPoint/Keynote 실렌더 육안 별도 수행 여부 (현 판정 구조のみ)
5. **54덱 full sweep 재실행 여부** (`coverage.json` 갱신)
6. **D12 cyan·D15 rose**(typo-only 인계): 변경 없음, 여전히 owner 판단 사항

## Verdict: CONDITIONAL

- READY가 아닌 이유: 토큰 변경 8종의 specimen HTML+PNG가 전부 구 토큰 stale이고, `full-decks/modulo-grid`·`preview.html` 렌더·maison-ivory 쌍이 미검증이다. 시각 주장의 증거 사슬이 하네스에서 끊기므로, 재생성 + 재QA 없이는 이니셔티브 READY 불가.
- NOT READY가 아닌 이유: 하네스 범위에서는 완전하다(98장 전수 육안, 40쌍 재계산 일치, AA 실패 3건+비가시 2슬롯 수정, 테스트 51/51, sweep 대상 16/16 PASS, PPTX 구조 ALL-OK, REJECT 0, F1/F2·박스 제거 무회귀). 잔여물은 한정된 재생성 작업이다.
- 조건: 8종 specimen + modulo full-deck 재생성·전수 육안·report.json 갱신 + 재QA(§9 항목 해소 확인)가 끝나면 READY 승급 가능. PPTX-네이티브·D12/D15·극성 1차 문헌은 READY를 막지 않는 owner 판단 사항.
