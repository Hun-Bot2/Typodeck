'use client';

import { STEPS, STEP_META, type Step } from './steps';

/**
 * Persistent studio toolbar: brand, step navigation (Create → Review →
 * Studio → Export), live status, and the primary export action.
 * Studio/Export unlock once a deck exists.
 */
export function StudioToolbar({
  step,
  onStep,
  hasResult,
  deckTitle,
  slideCount,
  statusText,
  statusBusy,
  exportState,
  onExport,
}: {
  step: Step;
  onStep: (s: Step) => void;
  hasResult: boolean;
  deckTitle: string | null;
  slideCount: number;
  statusText: string;
  statusBusy: boolean;
  exportState: 'idle' | 'working' | 'done' | 'error';
  onExport: () => void;
}) {
  return (
    <div className="ws-toolbar" role="banner">
      <p className="ws-brand">
        <span className="ws-brand-mark" aria-hidden="true">
          T
        </span>
        <span>
          Typodeck <em>Studio</em>
        </span>
      </p>
      <nav className="ws-steps" aria-label="Studio steps">
        <ol>
          {STEPS.map((s) => {
            const locked = (s === 'studio' || s === 'export') && !hasResult;
            const active = step === s;
            return (
              <li key={s}>
                <button
                  type="button"
                  className={`ws-step${active ? ' is-active' : ''}`}
                  aria-current={active ? 'step' : undefined}
                  disabled={locked}
                  title={locked ? `${STEP_META[s].label} unlocks after generation` : STEP_META[s].hint}
                  onClick={() => onStep(s)}
                >
                  <span className="ws-step-index" aria-hidden="true">
                    {STEP_META[s].index}
                  </span>{' '}
                  {STEP_META[s].label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="ws-toolbar-right">
        <p className="ws-status" role="status" aria-live="polite">
          {statusBusy ? <span className="ws-spinner" aria-hidden="true" /> : null}
          {statusText}
        </p>
        {hasResult && deckTitle ? (
          <p className="ws-deckmeta">
            {deckTitle} · {slideCount} slides
          </p>
        ) : null}
        <div className="ws-links">
          <a href="/landing">Landing</a>
          <a href="/showcase">Showcase</a>
        </div>
        {hasResult ? (
          <button
            type="button"
            className="btn-primary ws-export-btn"
            onClick={onExport}
            disabled={exportState === 'working'}
          >
            {exportState === 'working' ? 'Exporting…' : 'Download .pptx'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
