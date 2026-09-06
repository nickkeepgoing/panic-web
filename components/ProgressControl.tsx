'use client';

import { useState } from 'react';

export function ProgressControl({ projectId, initial }: { projectId: string; initial: number }) {
  const [percent, setPercent] = useState(initial);
  const [saved, setSaved] = useState(true);

  async function commit(value: number) {
    setSaved(false);
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ projectId, action: 'progress', percent: value }),
    });
    setSaved(true);
  }

  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-24 shrink-0 text-muted">ความคืบหน้า</span>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={percent}
        onChange={(e) => setPercent(Number(e.target.value))}
        onMouseUp={() => commit(percent)}
        onTouchEnd={() => commit(percent)}
        onKeyUp={() => commit(percent)}
        className="flex-1 accent-brand"
      />
      <span className="w-16 text-right text-muted">{percent}%{saved ? '' : ' …'}</span>
    </label>
  );
}
