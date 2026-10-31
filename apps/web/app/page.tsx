'use client';

import { useEffect, useRef, useState } from 'react';
import type { Deck, Narrative } from '@typodeck/core';
import { SlideView } from '../components/SlideView';

const STAGES = ['ingest', 'evidence', 'narrative', 'layout'] as const;
type Stage = (typeof STAGES)[number];
type StageState = 'pending' | 'active' | 'done';
type Phase = 'idle' | 'generating' | 'done' | 'error';

type SystemId = string;

interface CatalogPreset {
  id: string;
  version: string;
  name: { en: string; ko: string };
  audience: { en: string; ko: string };
  goal: { en: string; ko: string };
  steps: Array<{ id: string; dim: string; label: { en: string; ko: string }; optional: boolean }>;
  langNotes: { en: string; ko: string };
}

interface CatalogSystem {
  id: string;
  version: string;
  status: 'production' | 'experimental' | 'deprecated';
  philosophy: string;
  supports: string[];
  limitations: string[];
  renderable: boolean;
  fonts: { heading: string; body: string } | null;
}

interface Catalog {
  purposes: CatalogPreset[];
  systems: CatalogSystem[];
}

const LEGACY_PURPOSES = [
  { id: 'hackathon', label: 'Hackathon (legacy)' },
  { id: 'competition', label: 'Competition (legacy)' },
  { id: 'showcase', label: 'Showcase (legacy)' },
];

/** Fallback preset ids when /api/catalog is unreachable; core still validates. */
const FALLBACK_PRESETS = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10'];

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
  slideMarkdown?: string;
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
  body: { mode: string; input: string; purpose: string; lang: string; durationMin?: number },
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
  const [purpose, setPurpose] = useState('P01');
  const [lang, setLang] = useState('en');
  const [duration, setDuration] = useState('auto');
  const [customTitle, setCustomTitle] = useState('');
  const [catalog, setCatalog] = useState<Catalog | null>(null);
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
  const [markdown, setMarkdown] = useState('');
  const [markdownState, setMarkdownState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [markdownError, setMarkdownError] = useState<TypedError | null>(null);
  const [edited, setEdited] = useState(false);
  const [compare, setCompare] = useState<SystemId | ''>('');
  const viewerRef = useRef<HTMLDivElement>(null);

  const repoMode = repo.trim() !== '';

  useEffect(() => {
    let cancelled = false;
    fetch('/api/catalog')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setCatalog(data as Catalog);
      })
      .catch(() => {
        /* catalog is progressive enhancement; the Studio works without it */
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
    setMarkdown('');
    setMarkdownState('idle');
    setMarkdownError(null);
    setEdited(false);
    setElapsed(0);
    setStages({ ingest: 'pending', evidence: 'pending', narrative: 'pending', layout: 'pending' });
    try {
      const titled = customTitle.trim() !== '' ? `${purpose}: ${customTitle.trim()}` : purpose;
      const payload = await postGenerate(
        {
          mode: repoMode ? 'repo' : 'idea',
          input: repoMode ? repo.trim() : idea,
          purpose: titled,
          lang,
          durationMin: duration === 'auto' ? undefined : Number(duration),
        },
        markStage,
      );
      setResult(payload);
      setMarkdown(payload.slideMarkdown ?? '');
      setStages({ ingest: 'done', evidence: 'done', narrative: 'done', layout: 'done' });
      const firstRenderable = catalog?.systems.find((s) => s.renderable)?.id ?? 'editorial';
      setSelected(firstRenderable);
      setCompare('');
      setSlideIndex(0);
      setPhase('done');
    } catch (err) {
      setError(err as TypedError);
      setPhase('error');
    }
  };

  const applyMarkdown = async (): Promise<void> => {
    setMarkdownState('working');
    setMarkdownError(null);
    try {
      const res = await fetch('/api/markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown }),
      });
      const data = (await res.json().catch(() => null)) as (GenerateResult & { error?: TypedError }) | null;
      if (!res.ok || !data || data.error) {
        throw {
          code: data?.error?.code ?? `http-${res.status}`,
          message: data?.error?.message ?? res.statusText,
        } satisfies TypedError;
      }
      setResult(data);
      setMarkdown(data.slideMarkdown ?? markdown);
      setEdited(true);
      setSlideIndex(0);
      setExportState('idle');
      setExportError(null);
      setMarkdownState('done');
    } catch (err) {
      setMarkdownError(err as TypedError);
      setMarkdownState('error');
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
  const compareDeck = compare !== '' ? result?.decks[compare] : undefined;
  const compareCurrent =
    compareDeck && compareDeck.slides.length > 0
      ? compareDeck.slides[Math.min(slideIndex, compareDeck.slides.length - 1)]
      : null;
  const systems = catalog?.systems ?? [];
  const selectedPreset = catalog?.purposes.find((p) => p.id === purpose) ?? null;
  const fontsFor = (id: string): { heading: string; body: string } | undefined =>
    systems.find((s) => s.id === id)?.fonts ?? undefined;

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
              <optgroup label="Purpose presets">
                {catalog
                  ? catalog.purposes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} — {lang === 'ko' ? p.name.ko : p.name.en}
                      </option>
                    ))
                  : FALLBACK_PRESETS.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
              </optgroup>
              <optgroup label="Legacy">
                {LEGACY_PURPOSES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
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

        <div className="form-row">
          <div className="field">
            <label htmlFor="duration">Duration</label>
            <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={phase === 'generating'}>
              <option value="auto">Auto (standard)</option>
              <option value="5">Short · ~5 min</option>
              <option value="15">Standard · ~15 min</option>
              <option value="30">Extended · ~30 min</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="customTitle">Custom title (optional)</label>
            <input
              id="customTitle"
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Deck title (default: strongest claim)"
              disabled={phase === 'generating'}
              autoComplete="off"
            />
          </div>
        </div>

        {selectedPreset ? (
          <div className="preset-card">
            <p className="preset-id">
              {selectedPreset.id} · v{selectedPreset.version}
            </p>
            <p className="preset-goal">{lang === 'ko' ? selectedPreset.goal.ko : selectedPreset.goal.en}</p>
            <p className="hint">
              Audience: {lang === 'ko' ? selectedPreset.audience.ko : selectedPreset.audience.en}
            </p>
            <p className="arc-preview" aria-label="Narrative arc preview">
              {selectedPreset.steps
                .map((s) => (lang === 'ko' ? s.label.ko : s.label.en))
                .join(' → ')}
            </p>
          </div>
        ) : (
          <p className="hint">Legacy purpose: frozen pre-preset narrative behavior, unchanged.</p>
        )}

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
          <section className="studio-block" aria-labelledby="narrative-title">
            <p className="block-index">03</p>
            <h2 className="block-title" id="narrative-title">
              Narrative · Slide Markdown {edited ? <span className="badge">edited</span> : null}
            </h2>
            <p className="block-lede">
              The planned narrative as editable Slide Markdown. Change wording, reorder emphasis, or
              delete slides — then re-render every system from the edited text.
            </p>
            <div className="field">
              <label htmlFor="markdown">Slide Markdown (v1)</label>
              <textarea
                id="markdown"
                className="markdown-editor"
                value={markdown}
                onChange={(e) => {
                  setMarkdown(e.target.value);
                  setMarkdownState('idle');
                  setMarkdownError(null);
                }}
                spellCheck={false}
              />
            </div>
            {markdownState === 'error' && markdownError ? (
              <div className="error-box" role="alert">
                <p className="error-code">Markdown rejected · {markdownError.code}</p>
                <p>{markdownError.message}</p>
              </div>
            ) : null}
            <div className="actions">
              <button
                type="button"
                className="btn-primary"
                onClick={applyMarkdown}
                disabled={markdownState === 'working' || markdown.trim() === ''}
              >
                {markdownState === 'working' ? 'Re-rendering…' : 'Apply edits & re-render'}
              </button>
              {markdownState === 'done' ? <span className="export-status">Previews updated.</span> : null}
            </div>
          </section>

          <section className="studio-block" aria-labelledby="designs-title">
            <p className="block-index">04</p>
            <h2 className="block-title" id="designs-title">
              Design directions
            </h2>
            <p className="block-lede">
              Every system is laid out from the same narrative, so the previews are directly
              comparable. Select one to inspect and export.
            </p>
            {Object.keys(result.decks).map((id) => {
              const d = result.decks[id];
              const meta = systems.find((s) => s.id === id);
              const isSelected = selected === id;
              return (
                <div key={id} className={`system-section${isSelected ? ' is-selected' : ''}`}>
                  <div className="system-head">
                    <h3 className="system-name">
                      {id.charAt(0).toUpperCase() + id.slice(1)} · {d.slides.length} slides
                    </h3>
                    <span className="badge">{meta?.status ?? 'production'} · v{meta?.version ?? '1.0.0'}</span>
                    <button
                      type="button"
                      className="btn-secondary"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelected(id);
                        setSlideIndex(0);
                        setExportState('idle');
                        setExportError(null);
                      }}
                    >
                      {isSelected ? 'Selected' : `Select ${id}`}
                    </button>
                    {isSelected ? <span className="selected-note">selected for export</span> : null}
                  </div>
                  <p className="system-desc">{meta?.philosophy ?? ''}</p>
                  <div className="filmstrip" role="list" aria-label={`${id} slides`}>
                    {d.slides.map((s, i) => (
                      <figure className="thumb" key={s.id} role="listitem">
                        <SlideView
                          slide={s}
                          system={id}
                          fonts={fontsFor(id)}
                          label={`${id} slide ${i + 1}: ${s.thesis}`}
                        />
                        <figcaption>
                          {i + 1}. {s.thesis}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              );
            })}
            {systems
              .filter((s) => !s.renderable)
              .map((s) => (
                <div key={s.id} className="system-section is-muted">
                  <div className="system-head">
                    <h3 className="system-name">{s.id}</h3>
                    <span className="badge">{s.status} · not yet renderable</span>
                  </div>
                  <p className="system-desc">{s.philosophy}</p>
                </div>
              ))}
            <p className="hint">
              Experimental candidates arrive through the research-import pipeline after human review;
              nothing here is auto-promoted.
            </p>
          </section>

          <section className="studio-block" aria-labelledby="viewer-title">
            <p className="block-index">05</p>
            <h2 className="block-title" id="viewer-title">
              Slide viewer — {selected}
              {compare !== '' ? ` vs ${compare}` : ''}
            </h2>
            <p className="block-lede">
              {result.narrative.title} · {slideCount} slides · {result.narrative.lang}
            </p>
            <div className="field compare-field">
              <label htmlFor="compare">Side-by-side comparison</label>
              <select id="compare" value={compare} onChange={(e) => setCompare(e.target.value)}>
                <option value="">Off</option>
                {Object.keys(result.decks)
                  .filter((id) => id !== selected)
                  .map((id) => (
                    <option key={id} value={id}>
                      {selected} vs {id}
                    </option>
                  ))}
              </select>
            </div>
            {current ? (
              <>
                <div className={compare !== '' && compareCurrent ? 'compare-grid' : undefined}>
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
                      fonts={fontsFor(selected)}
                      label={`${selected} slide ${Math.min(slideIndex, slideCount - 1) + 1} of ${slideCount}: ${current.thesis}`}
                    />
                  </div>
                  {compare !== '' && compareCurrent ? (
                    <div className="viewer-frame" role="group" aria-label={`Comparison viewer, ${compare}`}>
                      <SlideView
                        slide={compareCurrent}
                        system={compare}
                        fonts={fontsFor(compare)}
                        label={`${compare} slide ${Math.min(slideIndex, slideCount - 1) + 1}: ${compareCurrent.thesis}`}
                      />
                    </div>
                  ) : null}
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
