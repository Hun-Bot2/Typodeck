'use client';

import { useMemo } from 'react';
import type { Slide } from '@typodeck/core';
import { SlideView } from '../SlideView';
import type { StudyElement } from './types';

const CANVAS_W_IN = 13.33;
const CANVAS_H_IN = 7.5;

function pct(n: number): string {
  return `${n * 100}%`;
}

export function SlideAnnotator({
  slide,
  system,
  elements,
  selected,
  onToggle,
  label,
}: {
  slide: Slide;
  system: string;
  elements: StudyElement[];
  selected: string[];
  onToggle: (id: string) => void;
  label?: string;
}) {
  const overlays = useMemo(() => {
    const byId = new Map(slide.blocks.map((b, i) => [b.id, i]));
    return elements.map((el, i) => {
      let bi = byId.get(el.id);
      if (bi === undefined) bi = i < slide.blocks.length ? i : undefined;
      return { el, num: i + 1, block: bi === undefined ? null : slide.blocks[bi] };
    });
  }, [slide, elements]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <SlideView slide={slide} system={system} label={label ?? slide.thesis} />
      <div style={{ position: 'absolute', inset: 0 }} role="group" aria-label={label ?? slide.thesis}>
        {overlays.map(({ el, num, block }) => {
          if (!block) return null;
          const active = selected.includes(el.id);
          return (
            <button
              key={el.id}
              type="button"
              data-block-id={el.id}
              aria-pressed={active}
              aria-label={`${num}번 ${el.label}`}
              title={`${num} · ${el.label}`}
              onClick={() => onToggle(el.id)}
              style={{
                position: 'absolute',
                left: pct(block.x / CANVAS_W_IN),
                top: pct(block.y / CANVAS_H_IN),
                width: pct(block.w / CANVAS_W_IN),
                height: pct(block.h / CANVAS_H_IN),
                background: active ? 'rgba(37, 99, 235, 0.22)' : 'rgba(37, 99, 235, 0.06)',
                border: active ? '2px solid #2563eb' : '1px dashed rgba(37, 99, 235, 0.55)',
                borderRadius: 4,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  minWidth: 20,
                  height: 20,
                  lineHeight: '20px',
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                  background: active ? '#1d4ed8' : '#64748b',
                  borderRadius: 10,
                  padding: '0 5px',
                }}
              >
                {num}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ElementList({
  elements,
  selected,
  onToggle,
  multi,
  legend,
}: {
  elements: StudyElement[];
  selected: string[];
  onToggle: (id: string) => void;
  multi: boolean;
  legend?: string;
}) {
  return (
    <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 12, margin: '12px 0' }}>
      {legend !== undefined && <legend style={{ fontSize: 13, color: '#475569' }}>{legend}</legend>}
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
        {elements.map((el, i) => {
          const active = selected.includes(el.id);
          return (
            <li key={el.id}>
              <button
                type="button"
                data-block-id={el.id}
                aria-pressed={active}
                onClick={() => onToggle(el.id)}
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'baseline',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: active ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: active ? '#eff6ff' : '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    minWidth: 22,
                    height: 22,
                    lineHeight: '22px',
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fff',
                    background: active ? '#1d4ed8' : '#64748b',
                    borderRadius: 11,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontWeight: 600 }}>{el.label}</span>
                <span style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {el.preview}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b', flexShrink: 0 }}>
                  {multi ? (active ? '선택됨' : '선택') : active ? '●' : '○'}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </fieldset>
  );
}
