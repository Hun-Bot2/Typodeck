'use client';

/**
 * Landing hero demo: a working repo→deck console wired to the real
 * `/api/generate` (SSE) and `/api/export` (PPTX download) routes.
 * Same contracts as the Studio page; no mocks.
 */

import { useEffect, useState } from 'react';
import type { Deck, Narrative } from '@typodeck/core';
import styles from './landing.module.css';
import { SYSTEMS, type SystemId } from './data';

const STAGES = ['ingest', 'evidence', 'narrative', 'layout'] as const;
type Stage = (typeof STAGES)[number];
type Phase = 'idle' | 'generating' | 'done' | 'error';

interface Provenance {
  provider: string;
  generatedBy: string;
  claims: { total: number; verified: number; suggestion: number; ungrounded: number };
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

export default function DemoConsole() {
  const [input, setInput] = useState('sindresorhus/is');
  const [purpose, setPurpose] = useState('showcase');
  const [phase, setPhase] = useState<Phase>('idle');
  const [doneStages, setDoneStages] = useState<Stage[]>([]);
  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<TypedError | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [exporting, setExporting] = useState<SystemId | null>(null);
  const [exportError, setExportError] = useState<TypedError | null>(null);

  useEffect(() => {
    if (phase !== 'generating') return;
    const started = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 250);
    return () => clearInterval(timer);
  }, [phase]);

  const markStage = (stage: Stage): void => {
    setActiveStage(stage);
    setDoneStages((prev) => {
      const idx = STAGES.indexOf(stage);
      const done = STAGES.slice(0, idx);
      return Array.from(new Set([...prev, ...done]));
    });
  };

  const generate = async (): Promise<void> => {
    const trimmed = input.trim();
    if (trimmed === '') {
      setError({ code: 'invalid-input', message: 'Enter a public repo as owner/repo or a github.com URL.' });
      setPhase('error');
      return;
    }
    setPhase('generating');
    setError(null);
    setResult(null);
    setExportError(null);
    setElapsed(0);
    setDoneStages([]);
    setActiveStage(null);
    try {
      const payload = await postGenerate(
        { mode: 'repo', input: trimmed, purpose, lang: 'en' },
        markStage,
      );
      setResult(payload);
      setDoneStages([...STAGES]);
      setActiveStage(null);
      setPhase('done');
    } catch (err) {
      setError(err as TypedError);
      setPhase('error');
    }
  };

  const download = async (system: SystemId): Promise<void> => {
    if (!result || exporting) return;
    setExporting(system);
    setExportError(null);
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narrative: result.narrative,
          system,
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
      a.download = `typodeck-${system}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      setExportError(err as TypedError);
    } finally {
      setExporting(null);
    }
  };

  const working = phase === 'generating';

  return (
    <div className={styles.console} aria-live="polite">
      <p className={styles.consoleTitle}>
        <span>
          <span
            className={`${styles.liveDot} ${working ? styles.liveDotWorking : ''}`}
            aria-hidden="true"
          />
          live demo · POST /api/generate → /api/export
        </span>
        <span>{working ? `${elapsed}s elapsed` : 'idle'}</span>
      </p>

      <div className={styles.field}>
        <label htmlFor="ld-repo">Public GitHub repository</label>
        <div className={styles.formRow}>
          <input
            id="ld-repo"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !working) void generate();
            }}
            placeholder="owner/repo or https://github.com/owner/repo"
            disabled={working}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className={styles.btnPrimary} onClick={() => void generate()} disabled={working}>
            {working ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>

      <div className={styles.formSecond}>
        <div className={styles.field}>
          <label htmlFor="ld-purpose">Purpose</label>
          <select
            id="ld-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            disabled={working}
          >
            <option value="hackathon">Hackathon</option>
            <option value="competition">Competition</option>
            <option value="showcase">Showcase</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="ld-mode">Output</label>
          <select id="ld-mode" value="pptx" disabled aria-label="Output format (fixed)">
            <option value="pptx">Editable .pptx</option>
          </select>
        </div>
      </div>
      <p className={styles.formHint}>
        Public repos only · ≤20 files / ≤200 KB · takes up to ~2 minutes · progress streams live
        from the server.
      </p>

      {phase !== 'idle' ? (
        <ol className={styles.stages} aria-label="Pipeline progress">
          {STAGES.map((s, i) => (
            <li key={s}>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <span className={activeStage === s ? styles.active : doneStages.includes(s) ? styles.done : ''}>
                {s}
                {activeStage === s ? '…' : doneStages.includes(s) ? ' ✓' : ''}
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      {phase === 'error' && error ? (
        <div className={styles.errorBox} role="alert">
          <p className={styles.errorCode}>Error · {error.code}</p>
          <p>{error.message}</p>
        </div>
      ) : null}

      {phase === 'done' && result ? (
        <div className={styles.result}>
          <p className={styles.resultTitle}>{result.narrative.title}</p>
          <p className={styles.resultMeta}>
            {result.decks.editorial.slides.length} slides · {result.provenance.claims.total} claims
            ({result.provenance.claims.verified} verified / {result.provenance.claims.suggestion}{' '}
            suggestion / {result.provenance.claims.ungrounded} ungrounded)
          </p>
          <p>
            <span className={`${styles.badge} ${styles.badgeDashed}`}>
              provider: {result.provenance.provider}
            </span>
            <span className={styles.badge}>generated_by: {result.provenance.generatedBy}</span>
          </p>
          {result.provenance.warnings.length > 0 ? (
            <ul className={styles.warnList}>
              {result.provenance.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          ) : null}
          <div className={styles.downloads}>
            {SYSTEMS.map((sys) => (
              <button
                key={sys.id}
                type="button"
                className={styles.btnSecondary}
                onClick={() => void download(sys.id)}
                disabled={exporting !== null}
              >
                {exporting === sys.id ? 'Exporting…' : `Download ${sys.id}.pptx`}
              </button>
            ))}
          </div>
          {exportError ? (
            <p className={styles.elapsed} role="alert">
              Export failed · {exportError.code}: {exportError.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
