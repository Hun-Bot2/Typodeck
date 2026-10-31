'use client';

import { ProvenancePanel } from './ProvenancePanel';
import { SystemPicker } from './SystemPicker';
import type { CatalogSystem, GenerateResult, TypedError } from './types';

/** Step 04 · Export — system select, provenance check, native PPTX download. */
export function ExportStep({
  result,
  selected,
  onSelectSystem,
  systems,
  exportState,
  exportError,
  onExport,
  onGoStudio,
}: {
  result: GenerateResult | null;
  selected: string;
  onSelectSystem: (id: string) => void;
  systems: CatalogSystem[];
  exportState: 'idle' | 'working' | 'done' | 'error';
  exportError: TypedError | null;
  onExport: () => void;
  onGoStudio: () => void;
}) {
  if (!result) {
    return (
      <section className="studio-block ws-stepview" aria-labelledby="ws-export-title">
        <p className="block-index">04 · Export</p>
        <h2 className="block-title" id="ws-export-title" tabIndex={-1}>
          Export
        </h2>
        <p className="empty-note">No deck yet. Create one first — export unlocks after generation.</p>
        <div className="actions">
          <button type="button" className="btn-primary" onClick={onGoStudio}>
            Back to Studio
          </button>
        </div>
      </section>
    );
  }
  const deck = result.decks[selected];
  const slideCount = deck?.slides.length ?? 0;
  return (
    <section className="studio-block ws-stepview" aria-labelledby="ws-export-title">
      <p className="block-index">04 · Export</p>
      <h2 className="block-title" id="ws-export-title" tabIndex={-1}>
        Export — {result.narrative.title}
      </h2>
      <p className="block-lede">
        {slideCount} slides · {result.narrative.lang} · native PowerPoint text boxes only.
        Layout is recomputed on the server at export time from the narrative.
      </p>
      <h3 className="ws-export-sub">1 · Pick the design direction</h3>
      <SystemPicker
        systems={systems}
        deckIds={Object.keys(result.decks)}
        selected={selected}
        onSelect={onSelectSystem}
        name="ws-export"
      />
      <h3 className="ws-export-sub">2 · Check provenance</h3>
      <ProvenancePanel result={result} />
      <h3 className="ws-export-sub">3 · Download</h3>
      <div className="actions">
        <button type="button" className="btn-primary" onClick={onExport} disabled={exportState === 'working'}>
          {exportState === 'working' ? 'Exporting…' : `Download ${selected}.pptx`}
        </button>
        {exportState === 'done' ? <span className="export-status">Download started.</span> : null}
        {exportState === 'error' && exportError ? (
          <span className="export-status is-error" role="alert">
            Export failed · {exportError.code}: {exportError.message}
          </span>
        ) : null}
      </div>
    </section>
  );
}
