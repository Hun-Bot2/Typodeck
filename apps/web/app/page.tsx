'use client';

import { useEffect, useState } from 'react';
import { CreateStep } from '../components/studio/CreateStep';
import { ExportStep } from '../components/studio/ExportStep';
import { ReviewStep } from '../components/studio/ReviewStep';
import { StudioToolbar } from '../components/studio/StudioToolbar';
import { WorkspaceStep } from '../components/studio/WorkspaceStep';
import { postGenerate } from '../components/studio/api';
import type { InspectorTab, MobilePane, Step } from '../components/studio/steps';
import {
  STAGES,
  type Catalog,
  type EvidenceClaimView,
  type EvidenceResult,
  type GenerateResult,
  type Phase,
  type Stage,
  type StageState,
  type SystemId,
  type TypedError,
} from '../components/studio/types';

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
  const [evidence, setEvidence] = useState<EvidenceResult | null>(null);
  const [evidenceInput, setEvidenceInput] = useState('');
  const [evidencePhase, setEvidencePhase] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [evidenceError, setEvidenceError] = useState<TypedError | null>(null);
  const [excluded, setExcluded] = useState<ReadonlySet<string>>(new Set());
  const [reframes, setReframes] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const [step, setStep] = useState<Step>('create');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('slide');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>('canvas');

  const repoMode = repo.trim() !== '';
  const canSubmit =
    phase !== 'generating' &&
    evidencePhase !== 'working' &&
    (idea.trim() !== '' || repo.trim() !== '');
  const canonicalInput = repoMode ? `repo:${repo.trim()}` : `idea:${idea}`;
  const evidenceFresh = evidence !== null && evidencePhase === 'done' && evidenceInput === canonicalInput;

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

  const editing = step === 'studio' && result !== null;
  useEffect(() => {
    document.body.dataset.studio = editing ? 'editing' : '';
    return () => {
      document.body.dataset.studio = '';
    };
  }, [editing]);

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

  const gotoStep = (s: Step): void => {
    setStep(s);
    requestAnimationFrame(() => {
      document.getElementById(`ws-${s}-title`)?.focus({ preventScroll: true });
    });
  };

  const inspect = async (): Promise<void> => {
    setEvidencePhase('working');
    setEvidenceError(null);
    setEvidence(null);
    setStep('review');
    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: repoMode ? 'repo' : 'idea', input: repoMode ? repo.trim() : idea }),
      });
      const data = (await res.json().catch(() => null)) as (EvidenceResult & { error?: TypedError }) | null;
      if (!res.ok || !data || data.error) {
        throw {
          code: data?.error?.code ?? `http-${res.status}`,
          message: data?.error?.message ?? res.statusText,
          ...(data?.error?.resetAt ? { resetAt: data.error.resetAt } : {}),
        } satisfies TypedError;
      }
      setEvidence(data);
      setEvidenceInput(canonicalInput);
      setExcluded(new Set());
      setReframes({});
      setEditingId(null);
      setEvidencePhase('done');
    } catch (err) {
      setEvidenceError(err as TypedError);
      setEvidencePhase('error');
    }
  };

  const useIdeaInstead = (): void => {
    setRepo('');
    setEvidence(null);
    setEvidencePhase('idle');
    setEvidenceError(null);
    setError(null);
    if (phase === 'error') setPhase('idle');
  };

  const toggleExcluded = (id: string): void => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEdit = (claim: EvidenceClaimView): void => {
    setEditingId(claim.id);
    setDraft(reframes[claim.id] ?? claim.text);
  };

  const saveEdit = (claim: EvidenceClaimView): void => {
    const text = draft.replace(/\s+/g, ' ').trim();
    if (text === '' || text === claim.text) {
      setReframes((prev) => {
        const next = { ...prev };
        delete next[claim.id];
        return next;
      });
    } else {
      setReframes((prev) => ({ ...prev, [claim.id]: text }));
    }
    setEditingId(null);
  };

  const selectedCount = evidence ? evidence.claims.length - excluded.size : 0;

  const generate = async (withSelection: boolean): Promise<void> => {
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
    setStep('review');
    setStages({ ingest: 'pending', evidence: 'pending', narrative: 'pending', layout: 'pending' });
    try {
      const titled = customTitle.trim() !== '' ? `${purpose}: ${customTitle.trim()}` : purpose;
      const selection =
        withSelection && evidenceFresh && evidence
          ? {
              ...(evidence.source.kind === 'repo' ? { sha: evidence.source.sha ?? null } : {}),
              excluded: [...excluded],
              reframed: Object.entries(reframes)
                .filter(([id, text]) => !excluded.has(id) && text !== evidence.claims.find((c) => c.id === id)?.text)
                .map(([id, text]) => ({ id, text })),
            }
          : undefined;
      const payload = await postGenerate(
        {
          mode: repoMode ? 'repo' : 'idea',
          input: repoMode ? repo.trim() : idea,
          purpose: titled,
          lang,
          durationMin: duration === 'auto' ? undefined : Number(duration),
          ...(selection ? { selection } : {}),
        },
        markStage,
      );
      setResult(payload);
      setMarkdown(payload.slideMarkdown ?? '');
      setStages({ ingest: 'done', evidence: 'done', narrative: 'done', layout: 'done' });
      const firstRenderable =
        catalog?.systems.find((s) => s.renderable && s.status === 'production')?.id ?? 'editorial';
      setSelected(firstRenderable);
      setCompare('');
      setSlideIndex(0);
      setMobilePane('canvas');
      setPhase('done');
      setStep('studio');
    } catch (err) {
      setError(err as TypedError);
      setPhase('error');
      // A failed run must not leave a stage stuck on "working…".
      setStages((prev) => {
        const next = { ...prev };
        for (const s of STAGES) {
          if (next[s] === 'active') next[s] = 'pending';
        }
        return next;
      });
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
          ...(result.source?.kind === 'repo'
            ? {
                provenance: {
                  repo: `${result.source.owner}/${result.source.repo}`,
                  branch: result.source.branch,
                  sha: result.source.sha ?? null,
                },
              }
            : {}),
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

  const selectSystem = (id: string): void => {
    setSelected(id);
    setSlideIndex(0);
    setExportState('idle');
    setExportError(null);
  };

  const changeMarkdown = (v: string): void => {
    setMarkdown(v);
    setMarkdownState('idle');
    setMarkdownError(null);
  };

  const deck = result?.decks[selected];
  const slideCount = deck?.slides.length ?? 0;
  const systems = catalog?.systems ?? [];
  const selectedPreset = catalog?.purposes.find((p) => p.id === purpose) ?? null;

  const statusText =
    phase === 'generating'
      ? `Generating… ${elapsed}s`
      : evidencePhase === 'working'
        ? 'Inspecting…'
        : phase === 'error'
          ? 'Generation failed'
          : evidencePhase === 'error'
            ? 'Inspection failed'
            : phase === 'done'
              ? 'Deck ready'
              : evidencePhase === 'done'
                ? 'Evidence ready'
                : 'Idle';
  const statusBusy = phase === 'generating' || evidencePhase === 'working';

  return (
    <div className={editing ? 'ws-editing' : 'ws-flow'}>
      <StudioToolbar
        step={step}
        onStep={gotoStep}
        hasResult={result !== null}
        deckTitle={result?.narrative.title ?? null}
        slideCount={slideCount}
        statusText={statusText}
        statusBusy={statusBusy}
        exportState={exportState}
        onExport={exportDeck}
      />
      {step === 'create' ? (
        <CreateStep
          idea={idea}
          setIdea={setIdea}
          repo={repo}
          setRepo={setRepo}
          purpose={purpose}
          setPurpose={setPurpose}
          lang={lang}
          setLang={setLang}
          duration={duration}
          setDuration={setDuration}
          customTitle={customTitle}
          setCustomTitle={setCustomTitle}
          catalog={catalog}
          phase={phase}
          evidencePhase={evidencePhase}
          elapsed={elapsed}
          repoMode={repoMode}
          canSubmit={canSubmit}
          selectedPreset={selectedPreset}
          onInspect={() => void inspect()}
          onGenerate={() => void generate(false)}
        />
      ) : null}
      {step === 'review' ? (
        <ReviewStep
          evidencePhase={evidencePhase}
          evidenceError={evidenceError}
          evidence={evidence}
          evidenceFresh={evidenceFresh}
          repoMode={repoMode}
          onUseIdea={useIdeaInstead}
          excluded={excluded}
          reframes={reframes}
          editingId={editingId}
          draft={draft}
          setDraft={setDraft}
          onToggleExcluded={toggleExcluded}
          onStartEdit={startEdit}
          onSaveEdit={saveEdit}
          onCancelEdit={() => setEditingId(null)}
          selectedCount={selectedCount}
          phase={phase}
          error={error}
          stages={stages}
          result={result}
          onGenerateFromSelection={() => void generate(true)}
        />
      ) : null}
      {step === 'studio' ? (
        <WorkspaceStep
          result={result}
          selected={selected}
          onSelectSystem={selectSystem}
          slideIndex={slideIndex}
          onSlideIndex={setSlideIndex}
          compare={compare}
          onCompare={setCompare}
          systems={systems}
          markdown={markdown}
          onMarkdownChange={changeMarkdown}
          markdownState={markdownState}
          markdownError={markdownError}
          onApplyMarkdown={() => void applyMarkdown()}
          edited={edited}
          inspectorTab={inspectorTab}
          onInspectorTab={setInspectorTab}
          leftCollapsed={leftCollapsed}
          onToggleLeft={() => setLeftCollapsed((v) => !v)}
          rightCollapsed={rightCollapsed}
          onToggleRight={() => setRightCollapsed((v) => !v)}
          mobilePane={mobilePane}
          onMobilePane={setMobilePane}
          onGoCreate={() => gotoStep('create')}
        />
      ) : null}
      {step === 'export' ? (
        <ExportStep
          result={result}
          selected={selected}
          onSelectSystem={selectSystem}
          systems={systems}
          exportState={exportState}
          exportError={exportError}
          onExport={() => void exportDeck()}
          onGoStudio={() => gotoStep('studio')}
        />
      ) : null}
    </div>
  );
}
