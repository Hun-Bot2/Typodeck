'use client';

import {
  FALLBACK_PRESETS,
  LEGACY_PURPOSES,
  SAMPLE_REPOS,
  type Catalog,
  type CatalogPreset,
  type Phase,
} from './types';

/** Step 01 · Create — source material, purpose, language, generation kickoff. */
export function CreateStep({
  idea,
  setIdea,
  repo,
  setRepo,
  purpose,
  setPurpose,
  lang,
  setLang,
  duration,
  setDuration,
  customTitle,
  setCustomTitle,
  catalog,
  phase,
  evidencePhase,
  elapsed,
  repoMode,
  canSubmit,
  selectedPreset,
  onInspect,
  onGenerate,
}: {
  idea: string;
  setIdea: (v: string) => void;
  repo: string;
  setRepo: (v: string) => void;
  purpose: string;
  setPurpose: (v: string) => void;
  lang: string;
  setLang: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  customTitle: string;
  setCustomTitle: (v: string) => void;
  catalog: Catalog | null;
  phase: Phase;
  evidencePhase: 'idle' | 'working' | 'done' | 'error';
  elapsed: number;
  repoMode: boolean;
  canSubmit: boolean;
  selectedPreset: CatalogPreset | null;
  onInspect: () => void;
  onGenerate: () => void;
}) {
  const busy = phase === 'generating' || evidencePhase === 'working';
  return (
    <section className="studio-block ws-stepview" aria-labelledby="ws-create-title">
      <p className="block-index">01 · Create</p>
      <h2 className="block-title" id="ws-create-title" tabIndex={-1}>
        Source material
      </h2>
      <p className="block-lede">
        Paste a public GitHub repository URL to present a real project — or paste idea text
        instead. The mode is detected automatically: a repository address selects repository
        mode, otherwise the idea text is used.
      </p>

      <div className="field">
        <label htmlFor="repo">Public GitHub repository</label>
        <input
          id="repo"
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="owner/repo or https://github.com/owner/repo"
          disabled={busy}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="hint">Private repositories are rejected. Retrieval is bounded: ≤20 files, ≤200 KB.</p>
        <div className="sample-chips" aria-label="Try a sample repository">
          {SAMPLE_REPOS.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => setRepo(s)} disabled={busy}>
              Try {s}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="idea">Or paste idea text</label>
        <textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe the project: problem, users, product, numbers, roadmap… (100–20,000 characters)"
          disabled={busy}
        />
        <p className="char-count" aria-live="polite">
          {idea.length} characters{' '}
          {idea.length > 0 && idea.length < 100 ? <span className="short">(minimum 100)</span> : null}
        </p>
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
        <button type="button" className="btn-secondary" onClick={onInspect} disabled={!canSubmit}>
          {evidencePhase === 'working' ? 'Inspecting…' : 'Inspect evidence'}
        </button>
        <button type="button" className="btn-primary" onClick={onGenerate} disabled={!canSubmit}>
          {phase === 'generating' ? 'Generating…' : 'Generate decks'}
        </button>
        {phase === 'generating' ? <span className="elapsed">{elapsed}s elapsed</span> : null}
      </div>
    </section>
  );
}
