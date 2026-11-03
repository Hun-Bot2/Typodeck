'use client';

import { useEffect, useState } from 'react';
import type { StudyElement } from './types';

function locate(ranking: string[][], id: string): [number, number] | null {
  for (let t = 0; t < ranking.length; t += 1) {
    const i = ranking[t].indexOf(id);
    if (i >= 0) return [t, i];
  }
  return null;
}

function normalize(ranking: string[][]): string[][] {
  return ranking.filter((tier) => tier.length > 0);
}

export function RankingEditor({
  elements,
  value,
  onChange,
}: {
  elements: StudyElement[];
  value: string[][];
  onChange: (ranking: string[][]) => void;
}) {
  const byId = new Map(elements.map((e) => [e.id, e]));
  const numOf = new Map(elements.map((e, i) => [e.id, i + 1]));
  const [dragId, setDragId] = useState<string | null>(null);

  // Seed one tier per element (element order) until the reviewer edits.
  useEffect(() => {
    if (value.length === 0 && elements.length > 0) {
      onChange(elements.map((e) => [e.id]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements.length, value.length]);

  const ranked = value.filter((tier) => tier.every((id) => byId.has(id)));
  const rankedIds = new Set(ranked.flat());
  const unranked = elements.filter((e) => !rankedIds.has(e.id));

  function move(id: string, dir: -1 | 1): void {
    const pos = locate(ranked, id);
    if (!pos) return;
    const [t, i] = pos;
    const next = ranked.map((tier) => [...tier]);
    if (dir === -1) {
      if (i > 0) {
        [next[t][i - 1], next[t][i]] = [next[t][i], next[t][i - 1]];
      } else if (t > 0) {
        next[t].splice(i, 1);
        next[t - 1].push(id);
      } else {
        return;
      }
    } else {
      if (i < next[t].length - 1) {
        [next[t][i + 1], next[t][i]] = [next[t][i], next[t][i + 1]];
      } else if (t < next.length - 1) {
        next[t].splice(i, 1);
        next[t + 1].unshift(id);
      } else {
        return;
      }
    }
    onChange(normalize(next));
  }

  function toggleTie(t: number): void {
    const next = ranked.map((tier) => [...tier]);
    if (t >= next.length - 1) return;
    next[t] = [...next[t], ...next[t + 1]];
    next.splice(t + 1, 1);
    onChange(normalize(next));
  }

  function split(tier: number, idx: number): void {
    const next = ranked.map((x) => [...x]);
    if (next[tier].length <= 1) return;
    const rest = next[tier].splice(idx);
    next.splice(tier + 1, 0, rest);
    onChange(normalize(next));
  }

  function dropOnTier(tier: number): void {
    if (!dragId) return;
    const pos = locate(ranked, dragId);
    const next = ranked.map((x) => [...x]);
    if (pos) next[pos[0]] = next[pos[0]].filter((id) => id !== dragId);
    if (!next[tier].includes(dragId)) next[tier].push(dragId);
    setDragId(null);
    onChange(normalize(next));
  }

  function addUnranked(id: string): void {
    onChange([...ranked, [id]]);
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {ranked.map((tier, t) => (
        <section
          key={`tier-${t}`}
          aria-label={`${t + 1}위`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => dropOnTier(t)}
          style={{
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: 8,
            background: dragId ? '#f8fafc' : '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <strong style={{ fontSize: 14 }}>{t + 1}위{tier.length > 1 ? ` · 동점 ${tier.length}` : ''}</strong>
            {t < ranked.length - 1 && (
              <button type="button" onClick={() => toggleTie(t)} style={{ fontSize: 12 }}>
                아래와 동점
              </button>
            )}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
            {tier.map((id, i) => {
              const el = byId.get(id);
              if (!el) return null;
              return (
                <li
                  key={id}
                  draggable
                  onDragStart={() => setDragId(id)}
                  onDragEnd={() => setDragId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      move(id, -1);
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      move(id, 1);
                    }
                  }}
                  tabIndex={0}
                  data-block-id={id}
                  aria-label={`${t + 1}위 ${numOf.get(id)}번 ${el.label}`}
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    border: '1px solid #94a3b8',
                    borderRadius: 6,
                    padding: '6px 8px',
                    background: '#fff',
                    fontSize: 14,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{numOf.get(id)}</span>
                  <span style={{ fontWeight: 600 }}>{el.label}</span>
                  <span style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {el.preview}
                  </span>
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button type="button" aria-label="위로" onClick={() => move(id, -1)}>▲</button>
                    <button type="button" aria-label="아래로" onClick={() => move(id, 1)}>▼</button>
                    {tier.length > 1 && (
                      <button type="button" aria-label="동점 해제" title="동점 해제" onClick={() => split(t, i)}>
                        분리
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      {unranked.length > 0 && (
        <section aria-label="미분류" style={{ border: '1px dashed #94a3b8', borderRadius: 8, padding: 8 }}>
          <div style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>아직 순위에 없음 (클릭하여 맨 아래에 추가)</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {unranked.map((el, k) => (
              <button key={el.id} type="button" data-block-id={el.id} onClick={() => addUnranked(el.id)}>
                {elements.indexOf(el) + 1} · {el.label}{k < unranked.length - 1 ? '' : ''}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function GroupingEditor({
  elements,
  value,
  selected,
  onToggleSelect,
  onChange,
}: {
  elements: StudyElement[];
  value: string[][];
  selected: string[];
  onToggleSelect: (id: string) => void;
  onChange: (groups: string[][]) => void;
}) {
  const labelOf = new Map(elements.map((e, i) => [e.id, `${i + 1} · ${e.label}`]));
  const [notice, setNotice] = useState('');

  function makeGroup(): void {
    if (selected.length < 2) {
      setNotice('그룹은 2개 이상의 요소를 선택해야 만듭니다.');
      return;
    }
    setNotice('');
    onChange([...value, [...selected]]);
    for (const id of selected) onToggleSelect(id);
  }

  function removeGroup(idx: number): void {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: '#475569' }}>예: 1번과 2번을 함께 선택하면 하나의 그룹이 됩니다.</p>
      {value.length > 0 && (
        <ul style={{ listStyle: 'none', margin: '8px 0', padding: 0, display: 'grid', gap: 6 }}>
          {value.map((g, i) => (
            <li
              key={`g-${i}`}
              style={{ border: '1px solid #94a3b8', borderRadius: 6, padding: '6px 8px', fontSize: 14 }}
            >
              그룹 {i + 1}: {g.map((id) => labelOf.get(id) ?? id).join(', ')}
              <button type="button" onClick={() => removeGroup(i)} style={{ marginLeft: 8, fontSize: 12 }}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0' }}>
        <button type="button" onClick={makeGroup} disabled={selected.length === 0}>
          선택한 요소로 그룹 만들기 ({selected.length})
        </button>
        {notice !== '' && (
          <span role="alert" style={{ fontSize: 13, color: '#b91c1c' }}>
            {notice}
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, color: '#475569' }}>
        슬라이드나 아래 목록에서 요소를 클릭하여 선택·해제합니다.
      </p>
    </div>
  );
}
