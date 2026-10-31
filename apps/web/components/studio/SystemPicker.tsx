'use client';

import type { CatalogSystem } from './types';

/**
 * Visual-system registry picker shared by the Studio inspector and the
 * Export step. Renderable systems are selectable; non-renderable registry
 * entries are listed honestly as not yet available.
 */
export function SystemPicker({
  systems,
  deckIds,
  selected,
  onSelect,
  name,
}: {
  systems: CatalogSystem[];
  /** System ids present in the generated decks (selectable). */
  deckIds: string[];
  selected: string;
  onSelect: (id: string) => void;
  /** Radio group name (must be unique per picker instance). */
  name: string;
}) {
  const renderable = systems.filter((s) => s.renderable && deckIds.includes(s.id));
  const deckOnly = deckIds.filter((id) => !renderable.some((s) => s.id === id));
  const unavailable = systems.filter((s) => !s.renderable || !deckIds.includes(s.id));

  return (
    <div className="ws-systems" role="radiogroup" aria-label="Visual system">
      {renderable.map((s) => (
        <label key={s.id} className={`ws-system${selected === s.id ? ' is-selected' : ''}`}>
          <span className="ws-system-head">
            <input
              type="radio"
              name={name}
              value={s.id}
              checked={selected === s.id}
              onChange={() => onSelect(s.id)}
              aria-label={`Select ${s.id}`}
            />
            <span className="ws-system-name">{s.id}</span>
            <span className="badge">
              {s.status} · v{s.version}
            </span>
            {selected === s.id ? <span className="selected-note">selected</span> : null}
          </span>
          <span className="ws-system-phil">{s.philosophy}</span>
        </label>
      ))}
      {deckOnly.map((id) => (
        <label key={id} className={`ws-system${selected === id ? ' is-selected' : ''}`}>
          <span className="ws-system-head">
            <input
              type="radio"
              name={name}
              value={id}
              checked={selected === id}
              onChange={() => onSelect(id)}
              aria-label={`Select ${id}`}
            />
            <span className="ws-system-name">{id}</span>
            <span className="badge">production</span>
            {selected === id ? <span className="selected-note">selected</span> : null}
          </span>
          <span className="ws-system-phil">No registry entry — catalog unreachable.</span>
        </label>
      ))}
      {unavailable.map((s) => (
        <div key={s.id} className="ws-system is-muted">
          <span className="ws-system-head">
            <span className="ws-system-name">{s.id}</span>
            <span className="badge">
              {s.status} · not available
            </span>
          </span>
          <span className="ws-system-phil">{s.philosophy}</span>
        </div>
      ))}
      {systems.length === 0 && deckOnly.length === 0 ? (
        <p className="empty-note">No registry data and no decks — generate first.</p>
      ) : null}
    </div>
  );
}
