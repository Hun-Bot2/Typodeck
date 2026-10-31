'use client';

import { FriendlyError } from './FriendlyError';
import { ProvenancePanel } from './ProvenancePanel';
import {
  STAGES,
  STAGE_LABEL,
  formatEvidenceRef,
  type EvidenceClaimView,
  type EvidenceResult,
  type GenerateResult,
  type Phase,
  type Stage,
  type StageState,
  type TypedError,
} from './types';

/** Step 02 · Review — evidence inspector + live generation progress. */
export function ReviewStep({
  evidencePhase,
  evidenceError,
  evidence,
  evidenceFresh,
  repoMode,
  onUseIdea,
  excluded,
  reframes,
  editingId,
  draft,
  setDraft,
  onToggleExcluded,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  selectedCount,
  phase,
  error,
  stages,
  result,
  onGenerateFromSelection,
}: {
  evidencePhase: 'idle' | 'working' | 'done' | 'error';
  evidenceError: TypedError | null;
  evidence: EvidenceResult | null;
  evidenceFresh: boolean;
  repoMode: boolean;
  onUseIdea: () => void;
  excluded: ReadonlySet<string>;
  reframes: Record<string, string>;
  editingId: string | null;
  draft: string;
  setDraft: (v: string) => void;
  onToggleExcluded: (id: string) => void;
  onStartEdit: (claim: EvidenceClaimView) => void;
  onSaveEdit: (claim: EvidenceClaimView) => void;
  onCancelEdit: () => void;
  selectedCount: number;
  phase: Phase;
  error: TypedError | null;
  stages: Record<Stage, StageState>;
  result: GenerateResult | null;
  onGenerateFromSelection: () => void;
}) {
  return (
    <>
      <section className="studio-block ws-stepview" aria-labelledby="ws-review-title">
        <p className="block-index">02 · Review</p>
        <h2 className="block-title" id="ws-review-title" tabIndex={-1}>
          Evidence review
        </h2>
        <p className="block-lede">
          Every slide claim traces to a source below. Uncheck claims to exclude them, or reframe
          wording before generating — refs always point at the original source lines.
        </p>
        {evidencePhase === 'idle' ? (
          <p className="empty-note">
            Nothing inspected yet. Inspect evidence to review claims first, or generate decks directly.
          </p>
        ) : null}
        {evidencePhase === 'working' ? (
          <p className="empty-note" role="status">
            Reading the source…
          </p>
        ) : null}
        {evidencePhase === 'error' && evidenceError ? (
          <FriendlyError error={evidenceError} onUseIdea={repoMode ? onUseIdea : undefined} />
        ) : null}
        {evidencePhase === 'done' && evidence ? (
          <>
            {!evidenceFresh ? (
              <p className="empty-note">The source changed since this review — inspect again before generating.</p>
            ) : null}
            <p className="evidence-source">
              {evidence.source.kind === 'repo'
                ? `${evidence.source.owner}/${evidence.source.repo}@${evidence.source.branch} · ${evidence.source.sha === null || evidence.source.sha === undefined ? 'unpinned' : evidence.source.sha.slice(0, 12)} · ${evidence.files.length} files`
                : 'pasted idea text · idea.txt'}
              {evidence.degraded ? ' · README-only (rate limited)' : ''}
              {evidence.requests
                ? ` · ${evidence.requests.api} api / ${evidence.requests.blobs} blobs / ${evidence.requests.cached} cached`
                : ''}
            </p>
            <ul className="file-list" aria-label="Ingested files">
              {evidence.files.map((f) => (
                <li key={f.path}>
                  <span>{f.path}</span>
                  <span className="file-lines">
                    {f.lines} line{f.lines === 1 ? '' : 's'}{f.truncated ? ' · truncated' : ''}
                  </span>
                </li>
              ))}
            </ul>
            <ul className="claim-list" aria-label="Extracted claims">
              {evidence.claims.map((c) => {
                const isOut = excluded.has(c.id);
                const reframed = reframes[c.id];
                return (
                  <li key={c.id} className={`claim${isOut ? ' is-excluded' : ''}`}>
                    <div className="claim-head">
                      <label className="claim-check">
                        <input
                          type="checkbox"
                          checked={!isOut}
                          onChange={() => onToggleExcluded(c.id)}
                          aria-label={`${isOut ? 'Include' : 'Exclude'} claim ${c.id}`}
                        />
                        {c.id}
                      </label>
                    </div>
                    <p className="claim-text">
                      {reframed ?? c.text} {reframed ? <span className="badge">reframed by you</span> : null}
                    </p>
                    <p className="claim-meta">
                      <span className={`badge kind-${c.kind}`}>{c.kind}</span>
                      <span className={`badge status-${c.status}`}>{c.status}</span>
                      {c.numbers.map((n) => (
                        <span key={n} className="badge">
                          {n}
                        </span>
                      ))}
                      <span className="claim-ref">
                        {c.refs.map(formatEvidenceRef).join('; ')}
                        {c.url ? (
                          <>
                            {' · '}
                            <a href={c.url} target="_blank" rel="noreferrer">
                              GitHub ↗
                            </a>
                          </>
                        ) : null}
                      </span>
                      <button type="button" className="link-button" onClick={() => onStartEdit(c)}>
                        Reframe
                      </button>
                    </p>
                    {editingId === c.id ? (
                      <div className="reframe-row">
                        <input
                          type="text"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          aria-label={`Reframed text for claim ${c.id}`}
                          maxLength={1000}
                        />
                        <button type="button" className="btn-secondary" onClick={() => onSaveEdit(c)}>
                          Save
                        </button>
                        <button type="button" className="btn-secondary" onClick={onCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            {evidence.warnings.length > 0 ? (
              <ul className="warnings" aria-label="Evidence warnings">
                {evidence.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            ) : null}
            <div className="actions">
              <button
                type="button"
                className="btn-primary"
                onClick={onGenerateFromSelection}
                disabled={!evidenceFresh || phase === 'generating'}
              >
                {phase === 'generating' ? 'Generating…' : `Generate from ${selectedCount} claims`}
              </button>
            </div>
          </>
        ) : null}
      </section>

      <section className="studio-block ws-stepview" aria-labelledby="ws-progress-title">
        <p className="block-index">02 · Review</p>
        <h2 className="block-title" id="ws-progress-title">
          Generation
        </h2>
        {phase === 'idle' ? (
          <p className="empty-note">Nothing generated yet. Progress, provenance, and warnings will appear here.</p>
        ) : (
          <>
            {phase === 'error' && error ? (
              <FriendlyError error={error} onUseIdea={repoMode ? onUseIdea : undefined} />
            ) : null}
            <ol className="stages" aria-label="Pipeline progress" aria-live="polite">
              {STAGES.map((s, i) => (
                <li key={s}>
                  <span className="stage-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="stage-name">{s}</span>
                  <span className={`stage-state is-${stages[s]}`}>{STAGE_LABEL[stages[s]]}</span>
                </li>
              ))}
            </ol>
            <p className="hint">Progress above is reported live by the server over an event stream.</p>
            {result ? <ProvenancePanel result={result} /> : null}
          </>
        )}
      </section>
    </>
  );
}
