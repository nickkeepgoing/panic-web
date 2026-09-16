'use client';

import { useActionState, useEffect, useRef } from 'react';
import { saveSettings } from './actions';
import type { SettingDef } from '@/lib/site-settings';

type Props = { current: Record<string, string>; defs: SettingDef[] };

export function SettingsForm({ current, defs }: Props) {
  const [state, action, pending] = useActionState(saveSettings, null);
  const msgRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state) msgRef.current?.focus();
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-6">
      {defs.map((def) => (
        <div key={def.key} className="flex flex-col gap-2">
          <label htmlFor={def.key} className="text-sm font-medium text-ink">
            {def.label}
          </label>
          {def.key === 'footer_tagline' ? (
            <textarea
              id={def.key}
              name={def.key}
              rows={3}
              defaultValue={current[def.key] ?? def.defaultValue}
              className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          ) : (
            <input
              id={def.key}
              name={def.key}
              type="text"
              defaultValue={current[def.key] ?? def.defaultValue}
              placeholder={def.defaultValue || `ระบุ${def.label}`}
              className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          )}
        </div>
      ))}

      {state && (
        <p
          ref={msgRef}
          tabIndex={-1}
          className={`rounded-xl px-4 py-3 text-sm font-medium focus:outline-none ${
            state.ok ? 'bg-envi/10 text-envi' : 'bg-alert/10 text-alert'
          }`}
        >
          {state.message}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand px-6 font-display font-semibold text-white shadow-[0_4px_0_0_#7B1540] transition-all duration-100 hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#7B1540] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
        >
          {pending ? 'กำลังบันทึก…' : 'บันทึก'}
        </button>
      </div>
    </form>
  );
}
