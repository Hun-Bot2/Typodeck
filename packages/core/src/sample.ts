// Typodeck Typography Core — fixed sample narrative (Phase 1 fixture).
// 7 slides, mixed EN/KO, incl. a large-number slide and a text comparison slide.

import type { Narrative } from './schema';

export const SAMPLE_NARRATIVE: Narrative = {
  title: 'Typodeck Sample — Typography Only',
  lang: 'ko',
  slides: [
    {
      id: 's1-cover',
      thesis: 'Typography alone can carry a whole deck.',
      blocks: [
        { role: 'kicker', content: 'TYPODECK · SAMPLE 001' },
        { role: 'title', content: '타이포그래피로 말하는 덱' },
        {
          role: 'body',
          content:
            '도형도, 이미지도, 아이콘도 없습니다. 글자와 숫자, 여백과 색만으로 구성된 일곱 장의 슬라이드입니다.',
        },
      ],
    },
    {
      id: 's2-problem',
      thesis: 'Decks drown in decoration.',
      blocks: [
        { role: 'kicker', content: 'THE PROBLEM' },
        { role: 'title', content: 'Decoration buries the message' },
        {
          role: 'body',
          content:
            'Most decks pile on shapes, stock photos, and icons until the thesis disappears. Every decorative object is a tax the reader pays before reaching the point.',
        },
        { role: 'caption', content: 'Source: ungrounded sample claim — illustrative only' },
      ],
    },
    {
      id: 's3-number',
      thesis: 'One number per slide, set huge.',
      blocks: [
        { role: 'kicker', content: '핵심 지표 · KEY METRIC' },
        { role: 'number', content: '98%' },
        { role: 'title', content: '편집 가능한 텍스트의 비율' },
        { role: 'caption', content: 'Editable characters / total characters · 목표 100%' },
      ],
    },
    {
      id: 's4-compare',
      thesis: 'Before vs after, in pure text.',
      blocks: [
        { role: 'kicker', content: 'COMPARISON' },
        { role: 'title', content: 'Before / After' },
        {
          role: 'body',
          content:
            'Before: 14 shapes, 6 icons, 3 stock photos. The thesis hides on line 9 of a crowded slide.',
        },
        {
          role: 'body',
          content:
            'After: 3 text blocks. Kicker, headline, one short paragraph. 이전보다 메시지가 2배 빠르게 읽힙니다.',
        },
      ],
    },
    {
      id: 's5-korean',
      thesis: 'Long Korean paragraphs must wrap and fit without overflow.',
      blocks: [
        { role: 'kicker', content: '한국어 줄바꿈 검증' },
        { role: 'title', content: '긴 한글 문단도 넘치지 않게' },
        {
          role: 'body',
          content:
            '한글은 음절 단위로 줄바꿈이 일어나므로 영문 단어 단위 줄바꿈과는 다른 측정 모델이 필요합니다. 레이아웃 엔진은 자소와 음절을 넓은 글리프로 취급하고, 상자가 넘치면 글자 크기를 단계적으로 줄여서 16:9 슬라이드 안에 반드시 들어가도록 보장합니다. 이 문단은 의도적으로 길게 작성된 검증용 문단입니다.',
        },
      ],
    },
    {
      id: 's6-principles',
      thesis: 'Three principles of typographic slides.',
      blocks: [
        { role: 'kicker', content: 'PRINCIPLES' },
        { role: 'title', content: 'Three rules for type-only slides' },
        {
          role: 'body',
          content:
            'One: a single thesis per slide, stated in the headline. Two: scale contrast — the most important line is at least twice the size of the rest. Three: whitespace is structure; margins and rhythm separate ideas better than any divider line.',
        },
      ],
    },
    {
      id: 's7-closing',
      thesis: 'Closing statement.',
      blocks: [
        { role: 'kicker', content: 'TYPODECK' },
        { role: 'title', content: '글자가 디자인이 된다' },
        { role: 'caption', content: 'Set in Pretendard / Inter with Noto Sans KR fallback · 16:9' },
      ],
    },
  ],
};
