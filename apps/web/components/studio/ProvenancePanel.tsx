'use client';

import type { GenerateResult } from './types';

/** Provenance + claim counts + warnings, shared by inspector and export. */
export function ProvenancePanel({ result }: { result: GenerateResult }) {
  return (
    <div className="prov-grid ws-prov">
      <div>
        <h3>Provider</h3>
        <p>
          <span className={`badge provider-${result.provenance.provider}`}>{result.provenance.provider}</span>
          <span className="badge">generated_by: {result.provenance.generatedBy}</span>
        </p>
        {result.provenance.requests ? (
          <p className="hint">
            Requests: {result.provenance.requests.api} api · {result.provenance.requests.blobs} blobs ·{' '}
            {result.provenance.requests.cached} cached
          </p>
        ) : null}
        {result.source?.kind === 'repo' ? (
          <p className="hint">
            Source: {result.source.owner}/{result.source.repo}@{result.source.branch} ·{' '}
            {result.source.sha === null || result.source.sha === undefined
              ? 'unpinned'
              : result.source.sha.slice(0, 12)}
          </p>
        ) : (
          <p className="hint">Source: pasted idea text · idea.txt</p>
        )}
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
  );
}
