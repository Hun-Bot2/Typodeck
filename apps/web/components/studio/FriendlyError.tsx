'use client';

import { useEffect, useRef } from 'react';
import { ERROR_GUIDE, formatResetAt, type TypedError } from './types';

export function FriendlyError({
  error,
  onUseIdea,
}: {
  error: TypedError;
  onUseIdea?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div className="error-box" role="alert" ref={ref} tabIndex={-1}>
      <p className="error-code">Error · {error.code}</p>
      <p>{error.message}</p>
      {error.resetAt ? <p className="guide">Quota resets at {formatResetAt(error.resetAt)}.</p> : null}
      {ERROR_GUIDE[error.code] ? <p className="guide">{ERROR_GUIDE[error.code]}</p> : null}
      {onUseIdea ? (
        <div className="error-actions">
          <button type="button" className="btn-secondary" onClick={onUseIdea}>
            Continue with pasted text instead
          </button>
        </div>
      ) : null}
    </div>
  );
}
