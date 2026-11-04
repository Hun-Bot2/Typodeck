'use client';

import { ProvenancePanel } from './ProvenancePanel';
import { SystemPicker } from './SystemPicker';
import type { CatalogSystem, GenerateResult, TemplateEntry, TypedError } from './types';

/** Step 04 · Export — system select, optional theme, provenance, PPTX download. */
export function ExportStep({
  result,
  selected,
  onSelectSystem,
  systems,
  templates,
  template,
  onSelectTemplate,
  exportState,
  exportError,
  onExport,
  onGoStudio,
}: {
  result: GenerateResult | null;
  selected: string;
  onSelectSystem: (id: string) => void;
  systems: CatalogSystem[];
  templates: TemplateEntry[] | null;
  template: string;
  onSelectTemplate: (slug: string) => void;
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
      {templates !== null && templates.length > 0 ? (
        <>
          <h3 className="ws-export-sub">2 · Theme the download (optional, experimental)</h3>
          <div className="field">
            <label htmlFor="ws-template">Typo Pack theme</label>
            <select id="ws-template" value={template} onChange={(e) => onSelectTemplate(e.target.value)}>
              <option value="">None — export the {selected} system as previewed</option>
              {templates.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name} · {t.scheme} · {t.baseSystem} geometry
                  {t.bestFor !== '' ? ` — ${t.bestFor}` : ''}
                </option>
              ))}
            </select>
          </div>
          <p className="empty-note">
            A theme re-colors and re-faces the {selected} layout at download time. The canvas preview does not change —
            open the downloaded file to see the theme.
          </p>
        </>
      ) : null}
      <h3 className="ws-export-sub">{templates !== null && templates.length > 0 ? '3' : '2'} · Check provenance</h3>
      <ProvenancePanel result={result} />
      <h3 className="ws-export-sub">{templates !== null && templates.length > 0 ? '4' : '3'} · Download</h3>
      <div className="actions">
        <button type="button" className="btn-primary" onClick={onExport} disabled={exportState === 'working'}>
          {exportState === 'working' ? 'Exporting…' : `Download ${template !== '' ? template : selected}.pptx`}
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
