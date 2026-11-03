# 27 디자인 시스템 갤러리 — 검토 가이드

## 1. 서버 실행

```bash
cd /Users/jeonghun/Typodeck/evals/design-diversity && python3 -m http.server 8321
```

## 2. 갤러리 접속

브라우저에서 `http://localhost:8321/gallery/index.html` 을 여세요.
(D01–D27 카드 27장이 모두 보여야 합니다.)

## 3. 전체 한눈에 보기

`http://localhost:8321/gallery/contact.html` 또는 `contact-sheet.png`에서 27개 전체를 비교하세요.

## 4. 필터 사용

상단의 Mood / Density / Formality / Scheme 필터로 원하는 성격의 디자인만 추려 보세요.

## 5. 나란히 비교

카드의 `select for comparison` 체크박스로 2–4개를 골라 나란히 비교하세요.

## 6. 카드 클릭 상세 보기

카드를 클릭하면 상세 창이 열립니다: 큰 프리뷰 이미지 + 탭 3종

- `Preview card` — 해당 디자인의 preview.md 전문
- `Full spec` — 해당 디자인의 design.md 전문 (토큰 + 23섹션 매뉴얼)
- `Full-deck smoke` — D01/D04/D23에 한해 6종 슬라이드(표지/구분/본문/숫자/비교/맺음) 렌더 결과

닫기는 `Close ✕`, 배경 클릭, 또는 `Esc` 키.

## 6. 디자인 문서 확인

각 카드의 `design:` / `preview:` 경로가 해당 디자인의 전체 스펙(`design.md`)과
프리뷰 카드(`preview.md`) 위치입니다. 예: `bold-template-pack/templates/maison/design.md`

## 7. 선택 테스트 재현 (선택)

```bash
cd /Users/jeonghun/Typodeck && node evals/design-diversity/shortlist-test.mjs
```

`pass=true`, `designReads=0`이면 shortlist가 preview 카드만 읽고 동작한 것입니다.

## 8. 서버 종료

터미널에서 `Ctrl+C`를 누르세요.
