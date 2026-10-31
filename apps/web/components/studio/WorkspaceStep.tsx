'use client';

import { useEffect, useRef } from 'react';
import { SlideView } from '../SlideView';
import { ProvenancePanel } from './ProvenancePanel';
import { SystemPicker } from './SystemPicker';
import { INSPECTOR_TABS, type InspectorTab, type MobilePane } from './steps';
import type { CatalogSystem, GenerateResult, TypedError } from './types';

/**
 * Step 03 · Studio — focused editing workspace. Left: clickable slide
 * thumbnails. Center: 16:9 canvas with keyboard navigation. Right:
 * contextual inspector (Slide / Design / Text / Proof). Panels collapse;
 * on narrow viewports a tab bar switches between the three panes.
 *
 * Integration point for Agent C: overflow-critic findings should mount in
 * the Proof tab below <ProvenancePanel> (deck quality report per slide).
 */
export function WorkspaceStep({
  result,
  selected,
  onSelectSystem,
  slideIndex,
  onSlideIndex,
  compare,
  onCompare,
  systems,
  markdown,
  onMarkdownChange,
  markdownState,
  markdownError,
  onApplyMarkdown,
  edited,
  inspectorTab,
  onInspectorTab,
  leftCollapsed,
  onToggleLeft,
  rightCollapsed,
  onToggleRight,
  mobilePane,
  onMobilePane,
  onGoCreate,
}: {
  result: GenerateResult | null;
  selected: string;
  onSelectSystem: (id: string) => void;
  slideIndex: number;
  onSlideIndex: (i: number) => void;
  compare: string;
  onCompare: (id: string) => void;
  systems: CatalogSystem[];
  markdown: string;
  onMarkdownChange: (v: string) => void;
  markdownState: 'idle' | 'working' | 'done' | 'error';
  markdownError: TypedError | null;
  onApplyMarkdown: () => void;
  edited: boolean;
  inspectorTab: InspectorTab;
  onInspectorTab: (t: InspectorTab) => void;
  leftCollapsed: boolean;
  onToggleLeft: () => void;
  rightCollapsed: boolean;
  onToggleRight: () => void;
  mobilePane: MobilePane;
  onMobilePane: (p: MobilePane) => void;
  onGoCreate: () => void;
}) {
  const deck = result?.decks[selected];
  const slideCount = deck?.slides.length ?? 0;
  const safeIndex = slideCount === 0 ? 0 : Math.min(slideIndex, slideCount - 1);
  const current = deck && slideCount > 0 ? deck.slides[safeIndex] : null;
  const captions = current?.blocks.filter((b) => b.role === 'caption') ?? [];
  const compareDeck = compare !== '' ? result?.decks[compare] : undefined;
  const compareCurrent =
    compareDeck && compareDeck.slides.length > 0
      ? compareDeck.slides[Math.min(safeIndex, compareDeck.slides.length - 1)]
      : null;
  const deckIds = result ? Object.keys(result.decks) : [];
  const fontsFor = (id: string): { heading: string; body: string } | undefined =>
    systems.find((s) => s.id === id)?.fonts ?? undefined;

  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({ block: 'nearest' });
  }, [safeIndex, selected]);

  if (!result || !deck || !current) {
    return (
      <section className="ws-empty" aria-labelledby="ws-studio-title">
        <p className="block-index">03 · Studio</p>
        <h2 className="block-title" id="ws-studio-title" tabIndex={-1}>
          Studio
        </h2>
        <p className="empty-note">No deck yet. Create one first — the editing workspace opens here.</p>
        <div className="actions">
          <button type="button" className="btn-primary" onClick={onGoCreate}>
            Go to Create
          </button>
        </div>
      </section>
    );
  }

  const prev = (): void => onSlideIndex(slideCount === 0 ? 0 : (safeIndex + slideCount - 1) % slideCount);
  const next = (): void => onSlideIndex(slideCount === 0 ? 0 : (safeIndex + 1) % slideCount);

  const onThumbsKeyDown = (e: React.KeyboardEvent<HTMLOListElement>): void => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const dir = e.key === 'ArrowDown' ? 1 : -1;
    const target = (safeIndex + dir + slideCount) % slideCount;
    onSlideIndex(target);
    const buttons = e.currentTarget.querySelectorAll('button');
    buttons[target]?.focus();
  };

  const onCanvasKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSlideIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onSlideIndex(slideCount - 1);
    }
  };

  const onTablistKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const ids = INSPECTOR_TABS.map((t) => t.id);
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const target = ids[(ids.indexOf(inspectorTab) + dir + ids.length) % ids.length];
    onInspectorTab(target);
    document.getElementById(`ws-instab-${target}`)?.focus();
  };

  return (
    <section
      className="ws-work"
      data-left={leftCollapsed ? 'closed' : 'open'}
      data-right={rightCollapsed ? 'closed' : 'open'}
      data-mpane={mobilePane}
      aria-label="Slide editing workspace"
    >
      <h2 className="ws-sr" id="ws-studio-title" tabIndex={-1}>
        Studio — {selected}, slide {safeIndex + 1} of {slideCount}
      </h2>

      <div className="ws-mobiletabs" role="group" aria-label="Workspace panes">
        {(
          [
            ['slides', 'Slides'],
            ['canvas', 'Canvas'],
            ['panel', 'Panel'],
          ] as Array<[MobilePane, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`ws-mobiletab${mobilePane === id ? ' is-active' : ''}`}
            aria-pressed={mobilePane === id}
            onClick={() => onMobilePane(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {leftCollapsed ? (
        <button type="button" className="ws-rail" data-rail="slides" onClick={onToggleLeft} aria-expanded="false" aria-label="Show slide thumbnails">
          <span aria-hidden="true">›</span> Slides
        </button>
      ) : (
        <aside className="ws-thumbs" aria-label="Slide thumbnails">
          <div className="ws-pane-head">
            <p className="ws-pane-title">
              {selected} · {slideCount} slides
            </p>
            <button type="button" className="ws-collapse" onClick={onToggleLeft} aria-expanded="true" aria-label="Hide slide thumbnails">
              ‹
            </button>
          </div>
          <ol className="ws-thumblist" onKeyDown={onThumbsKeyDown} aria-label="Slides — up and down arrows move between slides">
            {deck.slides.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  ref={i === safeIndex ? activeThumbRef : undefined}
                  className={`ws-thumb${i === safeIndex ? ' is-active' : ''}`}
                  aria-current={i === safeIndex ? 'true' : undefined}
                  aria-label={`Slide ${i + 1} of ${slideCount}: ${s.thesis}`}
                  onClick={() => {
                    onSlideIndex(i);
                    canvasRef.current?.focus({ preventScroll: true });
                  }}
                >
                  <SlideView slide={s} system={selected} fonts={fontsFor(selected)} label={`Slide ${i + 1}: ${s.thesis}`} />
                  <span className="ws-thumb-cap">
                    {i + 1}. {s.thesis}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      )}

      <div className="ws-canvas-col">
        <div className="ws-canvasbar">
          <button type="button" className="btn-secondary" onClick={prev} aria-label="Previous slide">
            ← Prev
          </button>
          <span className="slide-counter" aria-live="polite">
            {safeIndex + 1} / {slideCount}
          </span>
          <button type="button" className="btn-secondary" onClick={next} aria-label="Next slide">
            Next →
          </button>
          <label className="ws-compare">
            Compare
            <select value={compare} onChange={(e) => onCompare(e.target.value)} aria-label="Side-by-side comparison">
              <option value="">Off</option>
              {deckIds
                .filter((id) => id !== selected)
                .map((id) => (
                  <option key={id} value={id}>
                    {selected} vs {id}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div className="ws-canvas-wrap">
          <div
            className={compare !== '' && compareCurrent ? 'ws-compare-grid' : 'ws-canvas-single'}
            ref={canvasRef}
            tabIndex={0}
            role="group"
            aria-label={`Slide canvas, ${selected}, slide ${safeIndex + 1} of ${slideCount}. Left and right arrows move between slides.`}
            onKeyDown={onCanvasKeyDown}
          >
            <div className="ws-canvas-frame">
              <SlideView
                slide={current}
                system={selected}
                fonts={fontsFor(selected)}
                label={`${selected} slide ${safeIndex + 1} of ${slideCount}: ${current.thesis}`}
              />
            </div>
            {compare !== '' && compareCurrent ? (
              <div className="ws-canvas-frame" role="group" aria-label={`Comparison canvas, ${compare}`}>
                <SlideView
                  slide={compareCurrent}
                  system={compare}
                  fonts={fontsFor(compare)}
                  label={`${compare} slide ${safeIndex + 1}: ${compareCurrent.thesis}`}
                />
              </div>
            ) : null}
          </div>
        </div>
        <p className="ws-canvas-meta">
          {result.narrative.title} · {result.narrative.lang}
          {edited ? (
            <>
              {' · '} <span className="badge">edited</span>
            </>
          ) : null}
        </p>
      </div>

      {rightCollapsed ? (
        <button type="button" className="ws-rail" data-rail="panel" onClick={onToggleRight} aria-expanded="false" aria-label="Show inspector">
          <span aria-hidden="true">‹</span> Panel
        </button>
      ) : (
        <aside className="ws-inspector" aria-label="Inspector">
          <div className="ws-pane-head">
            <div className="ws-tabs" role="tablist" aria-label="Inspector panels" onKeyDown={onTablistKeyDown}>
              {INSPECTOR_TABS.map((t) => (
                <button
                  key={t.id}
                  id={`ws-instab-${t.id}`}
                  type="button"
                  role="tab"
                  aria-selected={inspectorTab === t.id}
                  aria-controls={`ws-inspanel-${t.id}`}
                  tabIndex={inspectorTab === t.id ? 0 : -1}
                  className={`ws-tab${inspectorTab === t.id ? ' is-active' : ''}`}
                  onClick={() => onInspectorTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button type="button" className="ws-collapse" onClick={onToggleRight} aria-expanded="true" aria-label="Hide inspector">
              ›
            </button>
          </div>
          <div className="ws-tabpanels">
            {inspectorTab === 'slide' ? (
              <div role="tabpanel" id="ws-inspanel-slide" aria-labelledby="ws-instab-slide" tabIndex={0}>
                <p className="thesis-label">slide {safeIndex + 1}</p>
                <h3 className="ws-slide-thesis">{current.thesis}</h3>
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
            ) : null}
            {inspectorTab === 'design' ? (
              <div role="tabpanel" id="ws-inspanel-design" aria-labelledby="ws-instab-design" tabIndex={0}>
                <SystemPicker systems={systems} deckIds={deckIds} selected={selected} onSelect={onSelectSystem} name="ws-design" />
                <p className="hint">
                  Experimental candidates arrive through the research-import pipeline after human
                  review; nothing here is auto-promoted.
                </p>
              </div>
            ) : null}
            {inspectorTab === 'text' ? (
              <div role="tabpanel" id="ws-inspanel-text" aria-labelledby="ws-instab-text" tabIndex={0}>
                <p className="block-lede">
                  The planned narrative as editable Slide Markdown. Change wording or delete slides —
                  then re-render every system from the edited text.
                </p>
                <div className="field">
                  <label htmlFor="ws-markdown">Slide Markdown (v1)</label>
                  <textarea
                    id="ws-markdown"
                    className="markdown-editor ws-markdown"
                    value={markdown}
                    onChange={(e) => onMarkdownChange(e.target.value)}
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
                    onClick={onApplyMarkdown}
                    disabled={markdownState === 'working' || markdown.trim() === ''}
                  >
                    {markdownState === 'working' ? 'Re-rendering…' : 'Apply edits & re-render'}
                  </button>
                  {markdownState === 'done' ? <span className="export-status">Previews updated.</span> : null}
                </div>
              </div>
            ) : null}
            {inspectorTab === 'proof' ? (
              <div role="tabpanel" id="ws-inspanel-proof" aria-labelledby="ws-instab-proof" tabIndex={0}>
                <ProvenancePanel result={result} />
              </div>
            ) : null}
          </div>
        </aside>
      )}
    </section>
  );
}
