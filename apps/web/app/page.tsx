'use client';

import { useEffect, useRef, useState } from 'react';
import type { Deck, Narrative } from '@typodeck/core';
import { SlideView } from '../components/SlideView';

const STAGES = ['ingest', 'evidence', 'narrative', 'layout'] as const;
type Stage = (typeof STAGES)[number];
type StageState = 'pending' | 'active' | 'done';
type Phase = 'idle' | 'generating' | 'done' | 'error';

const SYSTEMS = [
  { id: 'editorial', blurb: 'Asymmetric single column, serif titles, generous whitespace. One large idea per slide.' },
  { id: 'swiss', blurb: 'Four-column grid, tight leading, high density. Title left, supporting text right.' },
  { id: 'expressive', blurb: 'Centered hero composition with dramatic scale contrast on alternating ink/paper.' },
] as const;
type SystemId = (typeof SYSTEMS)[number]['id'];

interface ClaimCounts {
  total: number;
  verified: number;
  suggestion: number;
  ungrounded: number;
}

interface Provenance {
  provider: string;
  generatedBy: string;
  claims: ClaimCounts;
  warnings: string[];
}

interface GenerateResult {
  narrative: Narrative;
  decks: Record<SystemId, Deck>;
  provenance: Provenance;
}

interface TypedError {
  code: string;
  message: string;
}

const STAGE_LABEL: Record<StageState, string> = {
  pending: 'waiting',
  active: 'working…',
  done: 'done',
};

async function postGenerate(
  body: { mode: string; input: string; purpose: string; lang: string },
  onStage: (stage: Stage) => void,
): Promise<GenerateResult> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify(body),
  });
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/event-stream')) {
    const data = (await res.json().catch(() => null)) as { error?: TypedError } | null;
    throw {
      code: data?.error?.code ?? `http-${res.status}`,
      message: data?.error?.message ?? res.statusText,
    } satisfies TypedError;
  }
  const reader = res.body?.getReader();
  if (!reader) throw { code: 'network', message: 'empty response stream' } satisfies TypedError;
  const decoder = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf('\n\n')) >= 0) {
      const raw = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      let event = 'message';
      let data = '';
      for (const line of raw.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data += line.slice(5).trim();
      }
      if (event === 'stage') {
        try {
          const s = JSON.parse(data) as { stage: Stage };
          if ((STAGES as readonly string[]).includes(s.stage)) onStage(s.stage);
        } catch {
          /* ignore malformed progress frames */
        }
      } else if (event === 'result') {
        return JSON.parse(data) as GenerateResult;
      } else if (event === 'error') {
        const e = JSON.parse(data) as TypedError;
        throw { code: e.code ?? 'internal', message: e.message ?? 'generation failed' } satisfies TypedError;
      }
    }
  }
  throw { code: 'internal', message: 'stream ended without a result' } satisfies TypedError;
}

export default function StudioPage() {
  const [idea, setIdea] = useState('');
  const [repo, setRepo] = useState('');
  const [purpose, setPurpose] = useState('hackathon');
  const [lang, setLang] = useState('en');
  const [phase, setPhase] = useState<Phase>('idle');
  const [stages, setStages] = useState<Record<Stage, StageState>>({
    ingest: 'pending',
    evidence: 'pending',
    narrative: 'pending',
    layout: 'pending',
  });
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<TypedError | null>(null);
  const [selected, setSelected] = useState<SystemId>('editorial');
  const [slideIndex, setSlideIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [exportState, setExportState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [exportError, setExportError] = useState<TypedError | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const repoMode = repo.trim() !== '';

  useEffect(() => {
    if (phase !== 'generating') return;
    const started = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 250);
    return () => clearInterval(timer);
  }, [phase]);

  const markStage = (stage: Stage): void => {
    setStages((prev) => {
      const next = { ...prev };
      let seen = false;
      for (const s of STAGES) {
        if (s === stage) {
          next[s] = 'active';
          seen = true;
        } else {
          next[s] = seen ? 'pending' : 'done';
        }
      }
      return next;
    });
  };

  const generate = async (): Promise<void> => {
    setPhase('generating');
    setError(null);
    setResult(null);
    setExportState('idle');
    setExportError(null);
    setElapsed(0);
    setStages({ ingest: 'pending', evidence: 'pending', narrative: 'pending', layout: 'pending' });
    try {
      const payload = await postGenerate(
        { mode: repoMode ? 'repo' : 'idea', input: repoMode ? repo.trim() : idea, purpose, lang },
        markStage,
      );
      setResult(payload);
      setStages({ ingest: 'done', evidence: 'done', narrative: 'done', layout: 'done' });
      setSelected('editorial');
      setSlideIndex(0);
      setPhase('done');
    } catch (err) {
      setError(err as TypedError);
      setPhase('error');
    }
  };

  const exportDeck = async (): Promise<void> => {
    if (!result) return;
    setExportState('working');
    setExportError(null);
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narrative: result.narrative,
          system: selected,
          generatedBy: result.provenance.generatedBy,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: TypedError } | null;
        throw {
          code: data?.error?.code ?? `http-${res.status}`,
          message: data?.error?.message ?? res.statusText,
        } satisfies TypedError;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `typodeck-${selected}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setExportState('done');
    } catch (err) {
      setExportError(err as TypedError);
      setExportState('error');
    }
  };

  const deck = result?.decks[selected];
  const slideCount = deck?.slides.length ?? 0;
  const current = deck && slideCount > 0 ? deck.slides[Math.min(slideIndex, slideCount - 1)] : null;
  const captions = current?.blocks.filter((b) => b.role === 'caption') ?? [];

  const prev = (): void => setSlideIndex((i) => (slideCount === 0 ? 0 : (i + slideCount - 1) % slideCount));
  const next = (): void => setSlideIndex((i) => (slideCount === 0 ? 0 : (i + 1) % slideCount));

  return (
    <>
      <section className="studio-block" aria-labelledby="source-title">
        <p className="block-index">01</p>
        <h2 className="block-title" id="source-title">
          Source material
        </h2>
        <p className="block-lede">
          Paste an idea, or point at a public repository. The mode is detected automatically: a
          repository address selects repository mode, otherwise the idea text is used.
        </p>

        <div className="field">
          <label htmlFor="idea">Idea text</label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe the project: problem, users, product, numbers, roadmap… (100–20,000 characters)"
            disabled={phase === 'generating'}
          />
          <p className="char-count" aria-live="polite">
            {idea.length} characters{' '}
            {idea.length > 0 && idea.length < 100 ? <span className="short">(minimum 100)</span> : null}
          </p>
        </div>

        <div className="field">
          <label htmlFor="repo">Public GitHub repository (optional)</label>
          <input
            id="repo"
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="owner/repo or https://github.com/owner/repo"
            disabled={phase === 'generating'}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="hint">Private repositories are rejected. Retrieval is bounded: ≤20 files, ≤200 KB.</p>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="purpose">Purpose</label>
            <select id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} disabled={phase === 'generating'}>
              <option value="hackathon">Hackathon</option>
              <option value="competition">Competition</option>
              <option value="showcase">Showcase</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="lang">Language</label>
            <select id="lang" value={lang} onChange={(e) => setLang(e.target.value)} disabled={phase === 'generating'}>
              <option value="en">English</option>
              <option value="ko">한국어</option>
            </select>
          </div>
        </div>

        <p className="mode-line" aria-live="polite">
          Mode: <strong>{repoMode ? 'repository' : 'idea'}</strong>
          {repoMode ? ` — ${repo.trim()}` : ''}
        </p>

        <div className="actions">
          <button type="button" className="btn-primary" onClick={generate} disabled={phase === 'generating'}>
            {phase === 'generating' ? 'Generating…' : 'Generate decks'}
          </button>
          {phase === 'generating' ? <span className="elapsed">{elapsed}s elapsed</span> : null}
        </div>
      </section>

      <section className="studio-block" aria-labelledby="progress-title">
        <p className="block-index">02</p>
        <h2 className="block-title" id="progress-title">
          Generation
        </h2>
        {phase === 'idle' ? (
          <p className="empty-note">Nothing generated yet. Progress, provenance, and warnings will appear here.</p>
        ) : (
          <>
            {phase === 'error' && error ? (
              <div className="error-box" role="alert">
                <p className="error-code">Error · {error.code}</p>
                <p>{error.message}</p>
              </div>
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
            {result ? (
              <div className="prov-grid">
                <div>
                  <h3>Provider</h3>
                  <p>
                    <span className={`badge provider-${result.provenance.provider}`}>{result.provenance.provider}</span>
                    <span className="badge">generated_by: {result.provenance.generatedBy}</span>
                  </p>
                  <p className="hint">Progress above is reported live by the server over an event stream.</p>
                </div>
                <div>
                  <h3>Claims</h3>
                  <dl className="counts">
                    <div>
                      <dt>verified </dt>
                      <dd>{result.provenance.claims.verified}</dd>
                    </div>
                    <div>
                      <dt>suggestion </dt>
                      <dd>{result.provenance.claims.suggestion}</dd>
                    </div>
                    <div>
                      <dt>ungrounded </dt>
                      <dd>{result.provenance.claims.ungrounded}</dd>
                    </div>
                    <div>
                      <dt>total </dt>
                      <dd>{result.provenance.claims.total}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3>Warnings ({result.provenance.warnings.length})</h3>
                  {result.provenance.warnings.length === 0 ? (
                    <p className="empty-note">None.</p>
                  ) : (
                    <ul className="warnings">
                      {result.provenance.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>

      {result ? (
        <>
          <section className="studio-block" aria-labelledby="designs-title">
            <p className="block-index">03</p>
            <h2 className="block-title" id="designs-title">
              Design directions
            </h2>
            <p className="block-lede">
              All three systems are laid out from the same narrative, so the previews are directly
              comparable. Select one to inspect and export.
            </p>
            {SYSTEMS.map((sys) => {
              const d = result.decks[sys.id];
              const isSelected = selected === sys.id;
              return (
                <div key={sys.id} className={`system-section${isSelected ? ' is-selected' : ''}`}>
                  <div className="system-head">
                    <h3 className="system-name">
                      {sys.id.charAt(0).toUpperCase() + sys.id.slice(1)} · {d.slides.length} slides
                    </h3>
                    <button
                      type="button"
                      className="btn-secondary"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelected(sys.id);
                        setSlideIndex(0);
                        setExportState('idle');
                        setExportError(null);
                      }}
                    >
                      {isSelected ? 'Selected' : `Select ${sys.id}`}
                    </button>
                    {isSelected ? <span className="selected-note">selected for export</span> : null}
                  </div>
                  <p className="system-desc">{sys.blurb}</p>
                  <div className="filmstrip" role="list" aria-label={`${sys.id} slides`}>
                    {d.slides.map((s, i) => (
                      <figure className="thumb" key={s.id} role="listitem">
                        <SlideView slide={s} system={sys.id} label={`${sys.id} slide ${i + 1}: ${s.thesis}`} />
                        <figcaption>
                          {i + 1}. {s.thesis}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          <section className="studio-block" aria-labelledby="viewer-title">
            <p className="block-index">04</p>
            <h2 className="block-title" id="viewer-title">
              Slide viewer — {selected}
            </h2>
            <p className="block-lede">
              {result.narrative.title} · {slideCount} slides · {result.narrative.lang}
            </p>
            {current ? (
              <>
                <div
                  className="viewer-frame"
                  ref={viewerRef}
                  tabIndex={0}
                  role="group"
                  aria-label={`Slide viewer, ${selected}. Use left and right arrow keys to move between slides.`}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      prev();
                    } else if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      next();
                    }
                  }}
                >
                  <SlideView
                    slide={current}
                    system={selected}
                    label={`${selected} slide ${Math.min(slideIndex, slideCount - 1) + 1} of ${slideCount}: ${current.thesis}`}
                  />
                </div>
                <div className="viewer-controls">
                  <button type="button" className="btn-secondary" onClick={prev} aria-label="Previous slide">
                    ← Prev
                  </button>
                  <span className="slide-counter" aria-live="polite">
                    {Math.min(slideIndex, slideCount - 1) + 1} / {slideCount}
                  </span>
                  <button type="button" className="btn-secondary" onClick={next} aria-label="Next slide">
                    Next →
                  </button>
                </div>
                <div className="viewer-meta">
                  <p className="thesis-label">thesis</p>
                  <h3>{current.thesis}</h3>
                  <p className="caption-label">captions / refs</p>
                  {captions.length === 0 ? (
                    <p className="empty-note">No caption on this slide.</p>
                  ) : (
                    <ul className="caption-list">
                      {captions.map((c) => (
                        <li key={c.id}>{c.content}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={exportDeck}
                    disabled={exportState === 'working'}
                  >
                    {exportState === 'working' ? 'Exporting…' : `Download ${selected}.pptx`}
                  </button>
                  {exportState === 'done' ? <span className="export-status">Download started.</span> : null}
                  {exportState === 'error' && exportError ? (
                    <span className="export-status is-error" role="alert">
                      Export failed · {exportError.code}: {exportError.message}
                    </span>
                  ) : null}
                </div>
              </>
            ) : null}
          </section>
        </>
      ) : null}
    </>
  );
}
