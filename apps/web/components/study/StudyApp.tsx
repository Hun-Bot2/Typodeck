'use client';

import { useRef, useState } from 'react';
import { SlideView } from '../SlideView';
import { Dashboard } from './Dashboard';
import { GroupingEditor, RankingEditor } from './RankGroup';
import { ConfidenceScale, InterpretationEditor, ProblemsEditor } from './Problems';
import { ElementList, SlideAnnotator } from './SlideAnnotator';
import {
  STR,
  apiAnnotate,
  apiFinalize,
  apiManifest,
  apiProgress,
  blankLocal,
  exportUrl,
  isDone,
  mergeServerAndDraft,
  progressLabel,
  saveDraft,
  type Annotation,
  type Manifest,
  type ProblemEntry,
} from './types';

type Phase = 'welcome' | 'annotate' | 'review' | 'dashboard';
type SubStep = 'first' | 'rank' | 'group' | 'problems' | 'confidence';

const SUBS: SubStep[] = ['first', 'rank', 'group', 'problems', 'confidence'];
const SUB_TITLES: Record<SubStep, string> = {
  first: '첫 시선',
  rank: '강조 순서',
  group: '그룹화',
  problems: '시각적 문제',
  confidence: '확신도',
};

const btnPrimary: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 15,
  fontWeight: 700,
  borderRadius: 8,
  border: '2px solid #1d4ed8',
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
};

const btnPlain: React.CSSProperties = {
  padding: '8px 14px',
  fontSize: 14,
  borderRadius: 8,
  border: '1px solid #94a3b8',
  background: '#fff',
  cursor: 'pointer',
};

function fallbackAnn(manifest: Manifest, reviewer: string, caseId: string): Annotation {
  return {
    reviewerId: reviewer,
    datasetVersion: manifest.datasetVersion,
    seed: manifest.seed,
    ...blankLocal(caseId),
    updatedAt: '',
  };
}

export function StudyApp() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [reviewerInput, setReviewerInput] = useState('owner');
  const [reviewer, setReviewer] = useState('owner');
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [anns, setAnns] = useState<Record<string, Annotation>>({});
  const [caseIdx, setCaseIdx] = useState(0);
  const [sub, setSub] = useState<SubStep>('first');
  const [groupSel, setGroupSel] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<Record<string, 'saved' | 'saving' | 'error'>>({});
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const total = manifest?.order.length ?? 0;
  const caseId = manifest?.order[caseIdx];
  const currentCase = manifest?.cases.find((c) => c.caseId === caseId);
  const ann = caseId && manifest ? (anns[caseId] ?? fallbackAnn(manifest, reviewer, caseId)) : null;

  function scheduleSave(reviewerId: string, next: Annotation): void {
    setSaveState((s) => ({ ...s, [next.caseId]: 'saving' }));
    saveDraft(reviewerId, next);
    const key = next.caseId;
    if (timers.current[key]) clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => {
      const patch = {
        firstFocus: next.firstFocus,
        ranking: next.ranking,
        groups: next.groups,
        problems: next.problems.length > 0 ? next.problems : [{ type: 'none', blockIds: [], comment: '' }],
        confidence: next.confidence,
        interpretation: next.interpretation,
        status: isDone(next) ? 'done' : 'in-progress',
      };
      apiAnnotate(reviewerId, key, patch)
        .then(() => setSaveState((s) => ({ ...s, [key]: 'saved' })))
        .catch(() => setSaveState((s) => ({ ...s, [key]: 'error' })));
    }, 600);
  }

  function update(patch: Partial<Annotation>): void {
    if (!manifest || !caseId || !ann) return;
    const next = { ...ann, ...patch };
    setAnns((a) => ({ ...a, [caseId]: next }));
    scheduleSave(reviewer, next);
  }

  async function start(): Promise<void> {
    const id = reviewerInput.trim() === '' ? 'owner' : reviewerInput.trim();
    setBusy(true);
    setError('');
    try {
      const [m, p] = await Promise.all([apiManifest(id), apiProgress(id)]);
      const merged: Record<string, Annotation> = {};
      const flagged: string[] = [];
      for (const cid of m.order) {
        const fb = fallbackAnn(m, id, cid);
        const { ann: a, conflicted } = mergeServerAndDraft(id, cid, p.annotations[cid], fb);
        merged[cid] = a;
        if (conflicted) flagged.push(cid);
      }
      setReviewer(id);
      setManifest(m);
      setAnns(merged);
      setConflicts(flagged);
      setCaseIdx(0);
      setSub('first');
      setGroupSel([]);
      setPhase('annotate');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function goCase(idx: number, s: SubStep): void {
    setCaseIdx(idx);
    setSub(s);
    setGroupSel([]);
  }

  function next(): void {
    if (!manifest) return;
    const si = SUBS.indexOf(sub);
    if (si < SUBS.length - 1) {
      setSub(SUBS[si + 1]);
    } else if (caseIdx < total - 1) {
      goCase(caseIdx + 1, 'first');
    } else {
      setPhase('review');
    }
  }

  function prev(): void {
    if (!manifest) return;
    const si = SUBS.indexOf(sub);
    if (si > 0) {
      setSub(SUBS[si - 1]);
    } else if (caseIdx > 0) {
      goCase(caseIdx - 1, 'confidence');
    }
  }

  async function finalize(): Promise<void> {
    setBusy(true);
    setError('');
    try {
      const res = await apiFinalize(reviewer);
      setSnapshot(res.snapshot);
      setPhase('dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const saveLabel = caseId ? saveState[caseId] : undefined;

  // ---------------------------------------------------------------- welcome ---
  if (phase === 'welcome') {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        <h2>시각 계층 평가</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          슬라이드를 하나씩 보고, 눈에 들어오는 순서와 강조, 그룹, 어색한 점을 기록해 주세요.
          정답을 맞히는 시험이 아니라, 보이는 그대로의 인상을 수집하는 평가입니다.
          응답은 서버에 자동 저장되며, 언제든 이전 케이스로 돌아가 수정할 수 있습니다.
        </p>
        <label style={{ display: 'grid', gap: 4, fontSize: 14, maxWidth: 320 }}>
          평가자 이름
          <input
            type="text"
            value={reviewerInput}
            onChange={(e) => setReviewerInput(e.target.value)}
            style={{ padding: '8px 10px', fontSize: 15 }}
          />
        </label>
        <div style={{ marginTop: 16 }}>
          <button type="button" style={btnPrimary} onClick={() => void start()} disabled={busy}>
            {busy ? '불러오는 중…' : STR.start}
          </button>
        </div>
        {error !== '' && (
          <p role="alert" style={{ color: '#b91c1c', fontSize: 14 }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  if (!manifest || !currentCase || !ann || !caseId) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        <p>평가 데이터를 불러오지 못했습니다.</p>
        <button type="button" style={btnPlain} onClick={() => setPhase('welcome')}>
          처음으로
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------- review ---
  if (phase === 'review') {
    const missing = manifest.order.filter((cid) => !isDone(anns[cid]));
    const uncertain = manifest.order.filter((cid) => {
      const c = anns[cid]?.confidence;
      return c !== null && c !== undefined && c <= 2;
    });
    const doneCount = manifest.order.length - missing.length;
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px' }}>
        <h2>응답 확인</h2>
        <p style={{ fontSize: 15 }}>
          완료 {doneCount} / {total} · 미완성 {missing.length}건 · 불확실(확신도 2 이하) {uncertain.length}건
        </p>
        {missing.length > 0 && (
          <p style={{ fontSize: 14 }}>미완성: {missing.join(', ')}</p>
        )}
        {uncertain.length > 0 && (
          <p style={{ fontSize: 14 }}>불확실: {uncertain.join(', ')}</p>
        )}
        <ul style={{ listStyle: 'none', margin: '12px 0', padding: 0, display: 'grid', gap: 6 }}>
          {manifest.order.map((cid, i) => {
            const a = anns[cid];
            const done = isDone(a);
            return (
              <li
                key={cid}
                style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 6, padding: '6px 10px', fontSize: 14 }}
              >
                <strong>{cid}</strong>
                <span>{done ? '완료' : '미완성'}</span>
                <span style={{ color: '#475569' }}>확신도 {a?.confidence ?? '—'}</span>
                <button type="button" style={{ marginLeft: 'auto', ...btnPlain }} onClick={() => { goCase(i, 'first'); setPhase('annotate'); }}>
                  수정
                </button>
              </li>
            );
          })}
        </ul>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            style={btnPlain}
            onClick={() => {
              const firstOpen = manifest.order.findIndex((cid) => !isDone(anns[cid]));
              goCase(firstOpen >= 0 ? firstOpen : 0, 'first');
              setPhase('annotate');
            }}
          >
            {STR.review}
          </button>
          <button type="button" style={btnPrimary} onClick={() => void finalize()} disabled={busy || missing.length > 0}>
            {busy ? '저장 중…' : STR.save}
          </button>
          <a href={exportUrl(reviewer, 'json')} download style={{ alignSelf: 'center' }}>
            {STR.export} (JSON)
          </a>
          <a href={exportUrl(reviewer, 'csv')} download style={{ alignSelf: 'center' }}>
            {STR.export} (CSV)
          </a>
        </div>
        {missing.length > 0 && (
          <p style={{ fontSize: 13, color: '#475569' }}>모든 케이스를 완료해야 결과를 저장할 수 있습니다.</p>
        )}
        {error !== '' && (
          <p role="alert" style={{ color: '#b91c1c', fontSize: 14 }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------- dashboard ---
  if (phase === 'dashboard') {
    return (
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        {snapshot !== null && (
          <p style={{ fontSize: 13, color: '#475569' }}>저장됨: {snapshot}</p>
        )}
        <Dashboard reviewer={reviewer} />
        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            style={btnPlain}
            onClick={() => {
              goCase(0, 'first');
              setPhase('annotate');
            }}
          >
            응답으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------- annotate ---
  const si = SUBS.indexOf(sub);
  const problemBlockIds = ann.problems.filter((p) => p.type !== 'none').flatMap((p) => p.blockIds);
  const lastProblem: ProblemEntry | undefined = [...ann.problems].reverse().find((p) => p.type !== 'none');

  function toggleGroup(id: string): void {
    setGroupSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function toggleProblemSlide(id: string): void {
    if (!lastProblem || !ann) return;
    const has = lastProblem.blockIds.includes(id);
    const current = ann.problems;
    const problems = current.map((p) =>
      p.type === lastProblem.type
        ? { ...p, blockIds: has ? p.blockIds.filter((b) => b !== id) : [...p.blockIds, id] }
        : p,
    );
    update({ problems });
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: 16 }}>{progressLabel(caseIdx + 1, total)}</strong>
        <span style={{ fontSize: 14, color: '#475569' }}>
          {caseId} · {SUB_TITLES[sub]} ({si + 1}/5) · 평가자 {reviewer}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: saveLabel === 'error' ? '#b91c1c' : '#475569' }}>
          {saveLabel === 'saving' ? '저장 중…' : saveLabel === 'error' ? '저장 실패 (임시 저장됨)' : '저장됨'}
        </span>
      </div>
      {conflicts.includes(caseId) && (
        <p role="alert" style={{ fontSize: 14, background: '#fef9c3', border: '1px solid #eab308', borderRadius: 6, padding: '8px 10px' }}>
          서버 응답과 임시 저장본이 달라 서버 버전을 사용합니다. 임시 저장본은 별도로 보관했습니다.
        </p>
      )}
      {error !== '' && (
        <p role="alert" style={{ color: '#b91c1c', fontSize: 14 }}>
          {error}
        </p>
      )}

      {sub === 'first' && (
        <section aria-label={SUB_TITLES.first}>
          <h3>{STR.firstFocusQ}</h3>
          <SlideAnnotator
            slide={currentCase.slide}
            system={currentCase.system}
            elements={currentCase.elements}
            selected={ann.firstFocus ? [ann.firstFocus] : []}
            onToggle={(id) => update({ firstFocus: ann.firstFocus === id ? null : id })}
          />
          <ElementList
            elements={currentCase.elements}
            selected={ann.firstFocus ? [ann.firstFocus] : []}
            onToggle={(id) => update({ firstFocus: ann.firstFocus === id ? null : id })}
            multi={false}
          />
        </section>
      )}

      {sub === 'rank' && (
        <section aria-label={SUB_TITLES.rank}>
          <h3>{STR.rankQ}</h3>
          <SlideView slide={currentCase.slide} system={currentCase.system} />
          <div style={{ marginTop: 12 }}>
            <RankingEditor
              elements={currentCase.elements}
              value={ann.ranking}
              onChange={(ranking) => update({ ranking })}
            />
          </div>
        </section>
      )}

      {sub === 'group' && (
        <section aria-label={SUB_TITLES.group}>
          <h3>{STR.groupQ}</h3>
          <SlideAnnotator
            slide={currentCase.slide}
            system={currentCase.system}
            elements={currentCase.elements}
            selected={groupSel}
            onToggle={toggleGroup}
          />
          <GroupingEditor
            elements={currentCase.elements}
            value={ann.groups}
            selected={groupSel}
            onToggleSelect={toggleGroup}
            onChange={(groups) => update({ groups })}
          />
          <ElementList
            elements={currentCase.elements}
            selected={groupSel}
            onToggle={toggleGroup}
            multi
          />
        </section>
      )}

      {sub === 'problems' && (
        <section aria-label={SUB_TITLES.problems}>
          <h3>{STR.problemsQ}</h3>
          <SlideAnnotator
            slide={currentCase.slide}
            system={currentCase.system}
            elements={currentCase.elements}
            selected={problemBlockIds}
            onToggle={toggleProblemSlide}
          />
          {lastProblem !== undefined && (
            <p style={{ fontSize: 13, color: '#475569' }}>
              슬라이드 클릭은 마지막으로 선택한 문제 유형({lastProblem.type})에 표시됩니다.
            </p>
          )}
          <ProblemsEditor
            elements={currentCase.elements}
            value={ann.problems}
            onChange={(problems) => update({ problems })}
          />
          <InterpretationEditor
            elements={currentCase.elements}
            mainMessage={ann.interpretation.mainMessage}
            comment={ann.interpretation.comment}
            onChange={(mainMessage, comment) => update({ interpretation: { mainMessage, comment } })}
          />
        </section>
      )}

      {sub === 'confidence' && (
        <section aria-label={SUB_TITLES.confidence}>
          <h3>{STR.confidenceQ}</h3>
          <SlideView slide={currentCase.slide} system={currentCase.system} />
          <div style={{ marginTop: 12 }}>
            <ConfidenceScale value={ann.confidence} onChange={(v) => update({ confidence: v })} />
          </div>
        </section>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="button" style={btnPlain} onClick={prev} disabled={caseIdx === 0 && si === 0}>
          이전
        </button>
        <button type="button" style={btnPrimary} onClick={next}>
          {caseIdx === total - 1 && si === SUBS.length - 1 ? '응답 확인으로' : '다음'}
        </button>
        <button type="button" style={{ marginLeft: 'auto', ...btnPlain }} onClick={() => setPhase('review')}>
          전체 검토
        </button>
      </div>
    </div>
  );
}
