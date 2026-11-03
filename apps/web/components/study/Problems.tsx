'use client';

import { ElementList } from './SlideAnnotator';
import { PROBLEM_OPTIONS, type ProblemEntry, type ProblemKind, type StudyElement } from './types';

export function ProblemsEditor({
  elements,
  value,
  onChange,
}: {
  elements: StudyElement[];
  value: ProblemEntry[];
  onChange: (problems: ProblemEntry[]) => void;
}) {
  const active = new Set(value.map((e) => e.type));
  const untouched = value.length === 0;

  function toggle(kind: ProblemKind): void {
    if (kind === 'none') {
      onChange(active.has('none') && value.length === 1 ? [] : [{ type: 'none', blockIds: [], comment: '' }]);
      return;
    }
    const rest = value.filter((e) => e.type !== 'none' && e.type !== kind);
    if (active.has(kind)) {
      onChange(rest);
    } else {
      onChange([...rest, { type: kind, blockIds: [], comment: '' }]);
    }
  }

  function patch(kind: ProblemKind, p: Partial<ProblemEntry>): void {
    onChange(value.map((e) => (e.type === kind ? { ...e, ...p } : e)));
  }

  function toggleBlock(kind: ProblemKind, id: string): void {
    const entry = value.find((e) => e.type === kind);
    if (!entry) return;
    const has = entry.blockIds.includes(id);
    patch(kind, { blockIds: has ? entry.blockIds.filter((b) => b !== id) : [...entry.blockIds, id] });
  }

  return (
    <div>
      <div style={{ display: 'grid', gap: 6 }} role="group" aria-label="문제 유형">
        {PROBLEM_OPTIONS.map((opt) => {
          const on = untouched ? opt.value === 'none' : active.has(opt.value);
          return (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                border: on ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: on ? '#eff6ff' : '#fff',
                borderRadius: 6,
                padding: '8px 10px',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggle(opt.value)}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      {value
        .filter((e) => e.type !== 'none')
        .map((entry) => {
          const opt = PROBLEM_OPTIONS.find((o) => o.value === entry.type);
          return (
            <section
              key={entry.type}
              aria-label={`${opt?.label ?? entry.type} 상세`}
              style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 10, marginTop: 10 }}
            >
              <h4 style={{ margin: '0 0 6px' }}>{opt?.label ?? entry.type}</h4>
              <p style={{ fontSize: 13, color: '#475569', margin: '0 0 6px' }}>
                해당 요소가 있으면 슬라이드에서 클릭하여 표시합니다 (선택 사항).
              </p>
              <ElementList
                elements={elements}
                selected={entry.blockIds}
                onToggle={(id) => toggleBlock(entry.type, id)}
                multi
              />
              <label style={{ display: 'grid', gap: 4, fontSize: 14, marginTop: 8 }}>
                설명 (선택 사항)
                <input
                  type="text"
                  value={entry.comment}
                  maxLength={2000}
                  onChange={(e) => patch(entry.type, { comment: e.target.value })}
                  placeholder="어떤 점이 어색한지 적어 주세요"
                  style={{ padding: '6px 8px', fontSize: 14 }}
                />
              </label>
            </section>
          );
        })}
    </div>
  );
}

export function InterpretationEditor({
  elements,
  mainMessage,
  comment,
  onChange,
}: {
  elements: StudyElement[];
  mainMessage: string | null;
  comment: string;
  onChange: (mainMessage: string | null, comment: string) => void;
}) {
  return (
    <section
      aria-label="추가 해석"
      style={{ border: '1px dashed #94a3b8', borderRadius: 8, padding: 12, marginTop: 16 }}
    >
      <h4 style={{ margin: '0 0 4px' }}>추가 해석 (선택 사항)</h4>
      <p style={{ fontSize: 13, color: '#475569', margin: '0 0 8px' }}>
        위의 시각적 판단을 마친 뒤, 슬라이드의 핵심 메시지가 어디에 있다고 보는지 적어 주세요. 건너뛰어도 됩니다.
      </p>
      <ElementList
        elements={elements}
        selected={mainMessage ? [mainMessage] : []}
        onToggle={(id) => onChange(mainMessage === id ? null : id, comment)}
        multi={false}
        legend="핵심 메시지를 담은 요소"
      />
      {mainMessage !== null && (
        <button type="button" onClick={() => onChange(null, comment)} style={{ fontSize: 13 }}>
          선택 해제
        </button>
      )}
      <label style={{ display: 'grid', gap: 4, fontSize: 14, marginTop: 8 }}>
        해석 설명 (선택 사항)
        <textarea
          value={comment}
          maxLength={2000}
          rows={2}
          onChange={(e) => onChange(mainMessage, e.target.value)}
          style={{ padding: '6px 8px', fontSize: 14 }}
        />
      </label>
    </section>
  );
}

export function ConfidenceScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }} role="radiogroup" aria-label="확신도 1부터 5까지">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            style={{
              width: 48,
              height: 48,
              fontSize: 18,
              fontWeight: 700,
              borderRadius: 8,
              border: value === n ? '2px solid #2563eb' : '1px solid #cbd5e1',
              background: value === n ? '#eff6ff' : '#fff',
              cursor: 'pointer',
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#475569' }}>
        확신도는 판단에 대한 자신감이며, 슬라이드 품질에 대한 평가가 아닙니다.
      </p>
    </div>
  );
}
