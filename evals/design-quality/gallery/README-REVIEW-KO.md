# 디자인 품질 갤러리 — 검토 가이드

## 1. 서버 실행

```bash
cd /Users/jeonghun/Typodeck/evals/design-quality && python3 -m http.server 8322
```

## 2. 갤러리 접속

브라우저에서 `http://localhost:8322/gallery/index.html` 을 여세요.
(27장 카드, 상태: Core 5 / Specialized 22)

## 3. 3종 슬라이드 보기

카드를 클릭하면 상세 창의 탭 3종(Cover / Evidence / Explanation)으로
같은 디자인의 표지·근거·설명 슬라이드를 비교하세요.

## 4. 풀덱 보기 (6종)

`▶ full deck: 7 slides` 표시가 있는 디자인(D01·D02·D07·D10·D19·D22)은
상세 뷰의 Deck 탭에서 7장 필름스트립 + 큰 화면 + 이전/다음 탐색이 됩니다.
`deck.html` 링크로 7장 조립본도 열립니다.

## 5. 필터

Category(카테고리) / Mood / Density / Purpose / Review 필터와 검색으로 추리세요.

## 6. 평가 남기기

상세 뷰 또는 비교 모드에서 디자인마다 판정 4종(Core 승인 / Specialized /
보완 필요 / Reject)과 메모를 남기세요. 브라우저에 자동 저장됩니다.

## 7. 평가 내보내기/가져오기

`Export reviews`로 JSON 다운로드, `Import`로 병합 가져오기(덮어쓰기 없음).

## 8. 나란히 비교

`select for comparison` 체크(최대 4개) 후 하단 바로 비교 모드.

## 9. 서버 종료

터미널에서 `Ctrl+C`.
