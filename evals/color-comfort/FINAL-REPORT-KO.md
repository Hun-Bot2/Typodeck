# Color-Comfort 이니셔티브 최종 보고서

- Repo: `/Users/jeonghun/Typodeck` (pwd 확인)
- Branch: `audit/color-comfort` (`git branch --show-current` 확인; f0aed77→HEAD 5커밋 + 미커밋 regen/re-QA/갤러리-spec 작업)
- HEAD: `68850b1caea99239b991e7ed509f4c65c8bda9a0` (`git rev-parse` 확인; base `f0aed77`에서 5커밋 전진)
- 사전 독해: `evals/typo-only/FINAL-REPORT-KO.md` 전문 (F1/F2·박스 제거·파스텔 정책 = no-regress 제약) + `audit.md`·`research.md`·`qa.md`(§§0–6+재QA R0–R4) 전문 + 커밋된 9종 `design.md` diff 전수(읽기 전용)
- 판정: **CONDITIONAL** (specimen/full-deck 재생성 + 재QA + 갤러리 spec 토글 완료, owner 판단만 잔여)
- 인계 근거: prior-1 SPECIMENS FINISH(31 PNG 재생성·전수 육안) + prior-3 재QA(62장 전수 육안·9 APPROVE) + prior-2 갤러리 spec/qdeck 토글(31 before·CDP 12/12). 본 보고서 작성자는 PNG 미시청 — 시각 주장은 인계 육안 인용이며 독자 검증 아님.
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

- BEFORE(색상·하네스): `evals/color-comfort/before/<7슬러그>-en|ko/slides/NN.png` — 98장, `git show f0aed77:` 추출のみ, 전장 IHDR 1920×1080 검증, 7 샘플 sha1이 f0aed77 blob과 일치·after와 상이
- BEFORE(색상·specimen/full-deck, 신규): `evals/color-comfort/before/specimens/<8슬러그>/{cover,evidence,explanation}.png` 24장 + `modulo-grid/slides/slide-*.png` 7장 = 31장, `git show f0aed77:` 추출のみ, 31/31 IHDR 1920×1080·31/31 `git hash-object`가 f0aed77 blob과 일치(prior-2, 미커밋)
- AFTER(현 worktree): `evals/hackathon/coverage/*/slides/*.png` (7디자인×EN/KO×7 = 98 변경 + drafting/vista 무델타) + `evals/design-quality/specimens/*/{cover,evidence,explanation}.png` 24장 + `full-decks/modulo-grid/slides/*.png` 7장 = 31장 재생성(미커밋)
- Typo-before(유지): `evals/typo-only/before/<54덱>/slides/NN.png` 378장 intact
- 대표 대조: `night-reel-en/06` 전후 전수 육안(red 키커/코스트 가독화, ground 상향·여전히 near-black, 레이아웃 동일, 박스 0)

## 5. 풀덱 리뷰 결과

- 전수 육안(전부 1920×1080): AFTER 98장 + BEFORE mate 13장(`git show` 추출) + drafting 01 EN + specimen 커버 9장
- 16/16 대상 report.json PASS 7/7. 픽셀 증거: atelier/night-reel 96–99%(전면 ground), gilded/modulo 1–4%(ink+액센트), maison/coin-op/monolith ≤0.6%(역할 한정)
- 전 하네스 덱 7슬라이드 단일 ground 유지 — 신규 점프 없음. modulo/maison 교대 규율은 §5b에서 렌더 검증됨(초판 prose-only 해소)
- EN/KO parity clean(줄바꿈·혼합 라틴 intact). KO 05 `.bad` 플래그 부재는 before/after 동일 사전 이슈(비회귀)
- 디자인별 판정(AGENT): **9 APPROVE, 0 REWORK, 0 REJECT**(하네스 범위)

## 5b. Specimen + modulo full-deck 재생성·재QA (신규, 인계 육안 인용)

- 재생성(prior-1, 미커밋): 31 HTML diff는 정규화 후 색값のみ·구 토큰 0건, 31/31 PNG IHDR 1920×1080·31/31 sha1 상이, 12/12 픽셀 샘플 신토큰 일치, 31장 전수 육안 30 clean + 1 결함(coin-op cover 웹폰트 폴백 캡처 → 파이프라인 재캡처 209673B·픽셀폰트 재확인). 8종 `preview.html`은 `/tmp` 렌더 8/8 VERIFY PASS·전수 육안 clean(미커밋). 9/9 report.json 유효·바이트 일치.
- 재QA(prior-3 = `qa.md` R0–R4, 미커밋): AFTER 31 + BEFORE mate 31 = **62장 전수 육안**, 62/62 IHDR 1920×1080. 변경분율-문서분류 일치(atelier/night-reel 전면, coin-op 글로우역, drafting 0.003급, maison ≤0.002, gilded/monolith 역할 한정). 26쌍 독립 재계산 전수 일치 + 신규 deep/amber(슬라이드-07) 6.83:1 통과. AFTER HTML 구 토큰 0건.
- 해소 확인: **G1**(8종 specimen) + **G2**(modulo full-deck) CLOSED. maison evidence.png = ivory 대체지 → gold-deep 5.26:1 렌더 검증(연산-only 해소). drafting 신 light-line 최초 렌더 실증. coin-op 글로우 트림 specimen 스케일 검증 + 폴백폰트 결함 수정·재시청. modulo full-deck 7장 연속 시퀀스 검증(연속 full-deep 없음·슬라이드 내 혼합 없음·점프 축소 15.97→13.82:1 렌더 확인). vista 변경 0 재확인.
- 재QA 판정(AGENT): **9 APPROVE, 0 REWORK, 0 REJECT**(8 specimen 세트 + modulo full-deck + vista 유지). 잔여 G4/G5/G6·U1–U3·D12/D15는 §9 유지.

## 6. 접근성 + 렌더링 체크

- 대비: QA 독립 재계산 40쌍 + 재QA 26쌍(신규 deep/amber 6.83:1 포함) 전수 일치. 변경 텍스트쌍 전부 AA 여유 통과(최소 night-reel red 4.86:1, 소형 최소 maison gold-deep 5.26:1). 기존 실패 3건 + 비가시 2슬롯(1.23/1.66:1) 수정. maison-ivory 5.26:1은 **렌더 검증됨**(§5b, 연산-only 해소)
- 하네스: `node --test tools/agent-harness/tests/` **51/51**(구현+QA 2회), HTML diff 588+/588− 전수 색값のみ·0 ODD, 98파일 박스 패턴 0건, 렌더 박스 0건
- No-regress: F1 fjord 13.56:1 intact, F2 "Red squares" 0건, D07 amber-off-white·D08 glyph-glow-only 준수, wine 은퇴 유지, 밴드 미부활, 파스텔 정책 준수
- PPTX: `npm run build -w @typodeck/core` 종료 0 → `node evals/hackathon/pptx/verify.mjs` **ALL-OK**(6/6, 7슬라이드/29박스, editable EN 1697/KO 973, 래스터 0). **구조 검증のみ — 네이티브 PowerPoint/Keynote 육안 NOT RUN**(typo-only 인계, 유지)
- Preview: 8종 `preview.html` 색편집 코드 정합 + `/tmp` 렌더 8/8 VERIFY PASS·전수 육안 clean(prior-1). PNG 미커밋이므로 증거는 인계 기록のみ — 커밋 시 재렌더 권장.

## 7. Owner 불확실 케이스 (AGENT 판단, 인간 눈 필요)

- **U1 atelier**: flag 코스트가 weight-700のみ(구 hue 1.23:1 비기능 — 수용된 트레이드오프)
- **U2 gilded**: muted(12.44:1) vs ink(15.58:1) 명도 간격 협소, 크기/웨이트 의존(대안은 비가시 텍스트)
- **U3 modulo**: flag 코스트 weight-only(자체 amber-on-white 금지로 강제, 규칙 준수 hue 없음)
- drafting-table/vista: 하네스 델타 0 → 하네스 탭 After-only 유지. 단 drafting-table은 specimen 토글 제공됨(§8, 신 light-line 렌더 실증). vista는 전 범위 변경 0 → 토글 없음이 정상.
- ~~maison gold-deep-on-ivory 5.26:1 연산-only~~ → **해소**: evidence.png ivory 렌더 검증(§5b).
- U1/U2/U3은 재QA에서도 종류·수용 상태 불변(accepted trade-off, 결함 아님) — owner 확정만 잔여.

## 8. 갤러리 위치 + 정확한 명령

- 갤러리: `evals/review/index.html` (27 카드, 색상 변경 **8** 뱃지, 하네스 탭 3상태 + **spec/qdeck 탭 색상 전/후 2단 토글(@f0aed77)·`B` 순환** — prior-2, 기존 토글 로직이 탭 공용이라 DATA `cbefore` 추가로 자동 활성화, 미커밋)
- 리뷰 서버(repo 루트): `python3 -m http.server 8901` → `http://localhost:8901/evals/review/index.html` (prior-2 검증: 5 URL 200, CDP 클릭 테스트 **12/12 PASS** — spec/qdeck cbefore src+캡션·B 순환·harness 토글·리뷰 라디오·노트 localStorage·vista 비활성, cbefore 상태 스크린샷 육안 확인)
- 갤러리 재빌드: `python3 evals/review/build.py` (cbefore 참조 **129** = harness 98 + spec 24 + qdeck 7, typo-before 378 intact, 부분 세트 빌드 에러 포함, 27 카드·Q-decks 6·pptx 12 출력·assert 0건)
- PPTX 검증: `npm run build -w @typodeck/core` → `node evals/hackathon/pptx/verify.mjs` (ALL-OK 기대)

## 9. 미해결 인계 (전 단계 — 한 건도 낙하 없음)

- [audit] 실제 덱 점프 빈도 미정량(harness coverage 범위 외)
- [audit/구현/QA/갤러리 공통] PPTX-네이티브 외관 NOT RUN (typo-only 인계 gap)
- [audit/구현] 8-bit-orbit dark ground 미감사·불변(byte-identical 참조, 범위 외)
- [research] Piepenbrock/Mayr/Mund/Buchner 2013 1차 NOT RUN(403/쿠키월/401 — NN/g 2차 인용のみ)
- [research] Dobres/Chahine/Reimer 2017 1차 NOT RUN(페이월 미시도 — NN/g 2차のみ)
- [research] Legge 1985 + Papadopoulos/Goudiras 2005 1차 NOT RUN(NN/g 2차のみ)
- [research] Aleman 2018 nature.com판 NOT RUN(인증 리다이렉트 — PMC6052140 동일 논문 전문으로 대체 검증)
- ~~[구현/QA/갤러리] `evals/design-quality/specimens/**` 8종 stale~~ → **CLOSED(G1)**: 31 PNG+HTML 재생성·62장 재QA·9 APPROVE(§5b, 미커밋)
- ~~[구현/QA] `full-decks/modulo-grid` stale~~ → **CLOSED(G2)**: 7장 재생성·연속 시퀀스 검증(§5b, 미커밋)
- ~~[구현/QA] 54덱 full sweep 미재실행~~ → **CLOSED(G5, 리드)**: full sweep 54/54 PASS 재실행(fieldnote-ko 일시 CDP 타임아웃 1건은 단건 재실행 PASS 후 기록 패치). `coverage.json` 현행.
- [구현/QA] 검증된 편안함 지표 없음 — 변경은 WCAG 연산 + 전수 육안 근거, 편안함 주장 아님
- ~~[specimen 단계] 선행 BLOCKED~~ → **CLOSED**: 팔레트 커밋 확인 후 재시도 완료(§5b)
- ~~[QA] `preview.html` 8건 PNG 렌더 NOT RUN~~ → **해소(G3)**: `/tmp` 렌더 8/8 PASS·육안 clean — 단 PNG 미커밋(인계 기록のみ, §6)
- [QA] U1/U2/U3 owner-불확실 AGENT 판정 (§7) — 재QA에서도 불변, **owner 확정 대기(유지)**
- ~~[갤러리] spec/qdeck 탭 색상 토글 없음~~ → **CLOSED**: cbefore 2단 토글 + 12/12 CDP PASS(§8, 미커밋)

## 10. 브랜치 + HEAD + 작업 규모

- Branch: `audit/color-comfort` (유지, 본 보고서는 커밋·푸시·amend·rebase·merge·reset 없음. f0aed77→HEAD 5커밋: 팔레트·remap·sweep·checkpoint·갤러리)
- HEAD SHA: `68850b1caea99239b991e7ed509f4c65c8bda9a0` (`git rev-parse` 확인)
- 변경 규모(커밋됨): design.md 9종 + preview.html 8종 + theme.mjs 3슬롯 + coverage 14덱×15파일 + color-before 98 PNG + 리뷰 갤러리 2파일 + pptx 7파일
- 변경 규모(미커밋, owner 리뷰 대기): specimen 31 PNG+HTML + report.json 9종 + `qa.md` 재QA R0–R4 + specimen color-before 31 PNG + 갤러리 spec/qdeck 토글 2파일. 금지 경로·`evals/typo-only/**`(읽기 전용) 불변, 폰트 커밋·유료 API 없음

## 11. Owner 결정 필요

1. **미커밋 승인·커밋**: specimen 31 + 재QA + 갤러리 spec 토글(§10) 리뷰 후 커밋 여부 — 기술 조건은 해소, 승급은 이 승인에 달림
2. **U1·U2·U3 수용 여부**: weight-only 플래그 / 협소 muted 간격의 현 상태 확정 또는 2차 인코딩 강화 (재QA 불변, 결함 아님)
3. **~~drafting-table specimen before/after~~ 해소**: specimen 토글 제공됨. vista 토글 없음은 정상(변경 0) — 확인만 잔여
4. **PPTX 네이티브 확인**: PowerPoint/Keynote 실렌더 육안 별도 수행 여부 (현 판정 구조のみ, NOT RUN 유지)
5. ~~**54덱 full sweep 재실행 여부**~~ → 해소(리드 54/54 재실행, G5 CLOSED)
6. **D12 cyan·D15 rose**(typo-only 인계): 변경 없음, 여전히 owner 판단 사항

## Verdict: CONDITIONAL

- READY가 아닌 이유: 기술 검증은 완료됐으나 owner 판단이 남았다 — U1/U2/U3 확정 대기(재QA 불변), 미커밋 묶음(§10) 리뷰·커밋 승인, PPTX-네이티브 별도 수행 여부. 근거 인용의 한계도 유지: 편안함 지표 없음(P4, 편안함 주장 아님), 극성 1차 문헌 4건 2차 인용のみ, preview PNG 미커밋.
- NOT READY가 아닌 이유: 전 범위 검증 완료(하네스 98장 + specimen/full-deck 62장 전수 육안 인용, 40+26쌍 재계산 일치, AA 실패 3건+비가시 2슬롯 수정·렌더 검증, 테스트 51/51, sweep 대상 16/16 PASS, PPTX 구조 ALL-OK, 갤러리 129 cbefore + CDP 12/12, REJECT 0, F1/F2·박스 제거·파스텔 무회귀). G1/G2/G3·갤러리 토글·BLOCKED CLOSED.
- 조건: §11 owner 승인(미커밋 커밋 + U1/U2/U3 확정)이 끝나면 READY 승급 가능. PPTX-네이티브·D12/D15·극성 1차 문헌은 READY를 막지 않는 owner 판단 사항(유지).

## Closure (리드, 2026-11-04)

- 미커밋 묶음(§10) 전수 육안 검증 후 커밋: coin-op cover 픽셀 폰트 복구 확인, night-reel 근검정+신 레드 확인, 갤러리 spec 탭 색상 토글 캡처 확인.
- 엔진 테스트 1건 실패 발견 → monolith 토큰 추종(`#FF4D00`→`#F04E12`, `template-pack.test.ts:166`) 후 575/575 복구. 하네스 51/51.
- G5 CLOSED(상동). 판정은 **CONDITIONAL 유지** — U1/U2/U3은 owner 눈으로 확정해야 하며, 편안함 지표 없음(P4) 하에서 에이전트 판단을 READY로 승급하지 않는다.
