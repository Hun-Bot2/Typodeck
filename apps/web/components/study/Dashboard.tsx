'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiResults, apiRunEval, exportUrl } from './types';

// ------------------------------------------------------------- helpers ---

function obj(v: unknown): Record<string, unknown> | null {
  return typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function fmt(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function shortList(v: unknown, max = 3): string {
  if (!Array.isArray(v)) return fmt(v);
  const flat = v.map((t) => (Array.isArray(t) ? t.join('+') : fmt(t)));
  return flat.slice(0, max).join(' › ') + (flat.length > max ? ` 외 ${flat.length - max}` : '');
}

interface RowView {
  caseId: string;
  humanFirst: string | null;
  humanRank: unknown;
  humanGroups: number | null;
  humanProblems: string;
  humanConfidence: number | null;
  armA: Record<string, unknown> | null;
  armC: Record<string, unknown> | null;
  armB: Record<string, unknown> | null;
  armD: Record<string, unknown> | null;
  repair: Record<string, unknown> | null;
}

function toRow(r: unknown): RowView | null {
  const o = obj(r);
  if (!o || typeof o.caseId !== 'string') return null;
  const human = obj(o.human) ?? {};
  const arms = obj(o.arms) ?? {};
  const problems = Array.isArray(human.problems)
    ? (human.problems as unknown[]).map((p) => fmt(obj(p)?.type ?? p)).join(', ')
    : fmt(human.problems);
  return {
    caseId: o.caseId,
    humanFirst: typeof human.firstFocus === 'string' ? human.firstFocus : null,
    humanRank: human.ranking,
    humanGroups: Array.isArray(human.groups) ? (human.groups as unknown[]).length : null,
    humanProblems: problems === '' ? '—' : problems,
    humanConfidence: typeof human.confidence === 'number' ? human.confidence : null,
    armA: obj(arms.A) ?? obj(o.A),
    armC: obj(arms.C) ?? obj(o.C),
    armB: obj(o.B),
    armD: obj(o.D),
    repair: obj(o.repair),
  };
}

function armFirst(arm: Record<string, unknown> | null): string | null {
  if (!arm) return null;
  const v = arm.firstFocus ?? arm.first ?? arm.primary;
  return typeof v === 'string' ? v : null;
}

function matchLabel(human: string | null, arm: string | null): string {
  if (human === null || arm === null) return '비교 불가';
  return human === arm ? '일치' : '불일치';
}

// ------------------------------------------------------------ component ---

export function Dashboard({ reviewer }: { reviewer: string }) {
  const [results, setResults] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setResults(await apiResults(reviewer));
    } catch (e) {
      setResults(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [reviewer]);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(): Promise<void> {
    setRunning(true);
    setError('');
    try {
      await apiRunEval(reviewer);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  if (loading) return <p>결과를 불러오는 중입니다…</p>;

  if (!results) {
    return (
      <div>
        <h2>평가 결과</h2>
        <p style={{ fontSize: 14, color: '#475569' }}>
          아직 실행된 평가가 없습니다{error !== '' ? ` (${error})` : ''}.
        </p>
        <button type="button" onClick={() => void run()} disabled={running}>
          {running ? '평가 실행 중…' : '평가 실행'}
        </button>
      </div>
    );
  }

  const doc = obj(results) ?? {};
  const rawRows = doc.rows ?? doc.cases ?? doc.results ?? [];
  const rows = (Array.isArray(rawRows) ? rawRows : []).map(toRow).filter((r): r is RowView => r !== null);
  const metrics = obj(doc.metrics) ?? obj(doc.aggregate);
  const untested = doc.untestedHypotheses ?? obj(doc.hypotheses)?.untested ?? null;

  const agreeA = rows.filter((r) => r.humanFirst !== null && armFirst(r.armA) === r.humanFirst).length;
  const agreeC = rows.filter((r) => r.humanFirst !== null && armFirst(r.armC) === r.humanFirst).length;
  const comparedA = rows.filter((r) => r.humanFirst !== null && armFirst(r.armA) !== null).length;
  const comparedC = rows.filter((r) => r.humanFirst !== null && armFirst(r.armC) !== null).length;
  const uncertain = rows.filter((r) => r.humanConfidence !== null && (r.humanConfidence as number) <= 2);

  const armStatus = (arm: Record<string, unknown> | null, ranLabel: string): { label: string; reason: string } => {
    if (!arm) return { label: '실행 안 함', reason: '' };
    const status = typeof arm.status === 'string' ? arm.status : '';
    if (status === 'NOT RUN') {
      return { label: '실행 안 함', reason: typeof arm.reason === 'string' ? arm.reason : '' };
    }
    return { label: ranLabel, reason: '' };
  };
  const first = rows[0];
  const stA = armStatus(first?.armA ?? null, '실행됨');
  // A/C run when their row objects exist; B/D report NOT RUN with reasons.
  const stB = first?.armB ? armStatus(first.armB, '실행됨') : { label: '실행 안 함', reason: '' };
  const stC = armStatus(first?.armC ?? null, '실행됨');
  const stD = first?.armD ? armStatus(first.armD, '실행됨') : { label: '실행 안 함', reason: '' };

  return (
    <div>
      <h2>평가 결과</h2>
      <p style={{ fontSize: 14, color: '#475569' }}>
        사람 응답과 자동 평가(A/C)를 케이스별로 비교합니다. 단일 종합 점수는 표시하지 않습니다.
      </p>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
        <button type="button" onClick={() => void load()}>
          다시 불러오기
        </button>
        <a href={exportUrl(reviewer, 'json')} download>
          JSON 내보내기
        </a>
        <a href={exportUrl(reviewer, 'csv')} download>
          CSV 내보내기
        </a>
      </div>
      {error !== '' && (
        <p role="alert" style={{ color: '#b91c1c', fontSize: 14 }}>
          {error}
        </p>
      )}

      <section aria-label="실행 상태" style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 12, margin: '12px 0' }}>
        <h3 style={{ margin: '0 0 8px' }}>실행 상태</h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li>암 A: {stA.label}{stA.reason !== '' ? ` — ${stA.reason}` : ''}</li>
          <li>암 B: {stB.label}{stB.reason !== '' ? ` — ${stB.reason}` : ''}</li>
          <li>암 C: {stC.label}{stC.reason !== '' ? ` — ${stC.reason}` : ''}</li>
          <li>암 D: {stD.label}{stD.reason !== '' ? ` — ${stD.reason}` : ''}</li>
        </ul>
      </section>

      <section aria-label="종합 비교" style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 12, margin: '12px 0' }}>
        <h3 style={{ margin: '0 0 8px' }}>종합 비교</h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li>첫 시선 일치 (사람–A): {comparedA > 0 ? `${agreeA} / ${comparedA}` : '비교 불가'}</li>
          <li>첫 시선 일치 (사람–C): {comparedC > 0 ? `${agreeC} / ${comparedC}` : '비교 불가'}</li>
          <li>불확실한 응답 (확신도 2 이하): {uncertain.length}건{uncertain.length > 0 ? ` (${uncertain.map((r) => r.caseId).join(', ')})` : ''}</li>
        </ul>
        {metrics && (
          <div style={{ marginTop: 8 }}>
            <h4 style={{ margin: '8px 0 4px' }}>종합 지표</h4>
            <dl style={{ margin: 0, fontSize: 14 }}>
              {Object.entries(metrics).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 8 }}>
                  <dt style={{ fontWeight: 600 }}>{k}</dt>
                  <dd style={{ margin: 0 }}>{fmt(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {untested !== null && untested !== undefined && (
          <div style={{ marginTop: 8 }}>
            <h4 style={{ margin: '8px 0 4px' }}>검증하지 못한 가설</h4>
            <p style={{ fontSize: 14, margin: 0 }}>{fmt(untested)}</p>
          </div>
        )}
      </section>

      <section aria-label="케이스별 결과">
        <h3>케이스별 결과</h3>
        {rows.length === 0 && <p style={{ fontSize: 14 }}>표시할 케이스가 없습니다.</p>}
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((r) => (
            <article key={r.caseId} style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 12 }}>
              <h4 style={{ margin: '0 0 6px' }}>{r.caseId}</h4>
              <div style={{ fontSize: 14, display: 'grid', gap: 4 }}>
                <div>사람 첫 시선: {r.humanFirst ?? '—'} (확신도 {r.humanConfidence ?? '—'})</div>
                <div>사람 상위 강조: {shortList(r.humanRank)}</div>
                <div>사람 그룹 {r.humanGroups ?? '—'}개 · 문제: {r.humanProblems}</div>
                <div>
                  A 첫 시선: {armFirst(r.armA) ?? '—'} · {matchLabel(r.humanFirst, armFirst(r.armA))}
                  {r.armA && r.armA.note !== undefined ? ` (${fmt(r.armA.note)})` : ''}
                </div>
                <div>
                  C 첫 시선: {armFirst(r.armC) ?? '—'} · {matchLabel(r.humanFirst, armFirst(r.armC))}
                  {r.armC && r.armC.note !== undefined ? ` (${fmt(r.armC.note)})` : ''}
                </div>
                {(r.armB || r.armD) && (
                  <div style={{ color: '#475569' }}>
                    B: {r.armB ? fmt(r.armB.status ?? '—') : '—'}
                    {r.armB && typeof r.armB.reason === 'string' ? ` (${r.armB.reason})` : ''} · D:{' '}
                    {r.armD ? fmt(r.armD.status ?? '—') : '—'}
                    {r.armD && typeof r.armD.reason === 'string' ? ` (${r.armD.reason})` : ''}
                  </div>
                )}
                {r.repair && (
                  <div>
                    복구 전후: {fmt(r.repair.before ?? r.repair.from)} → {fmt(r.repair.after ?? r.repair.to)}
                    {r.repair.note !== undefined ? ` (${fmt(r.repair.note)})` : ''}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
