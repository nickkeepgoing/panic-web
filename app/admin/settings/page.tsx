'use client';

import { useActionState, useEffect, useRef } from 'react';
import { SETTING_DEFS, saveSettings } from '@/lib/site-settings';

// useActionState ต้องการ client component
// ค่าปัจจุบันส่งผ่าน props จาก Server Component wrapper ด้านล่าง

type Props = { current: Record<string, string> };

function SettingsForm({ current }: Props) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, fd: FormData) => saveSettings(fd),
    null,
  );
  const msgRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state) msgRef.current?.focus();
  }, [state]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">การตั้งค่าเว็บไซต์</h1>
        <p className="text-sm text-muted">แก้ไขข้อมูลที่แสดงใน Footer และส่วนต่าง ๆ ของเว็บไซต์</p>
      </div>

      <form action={action} className="flex flex-col gap-6">
        {SETTING_DEFS.map((def) => (
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
              state.ok
                ? 'bg-envi/10 text-envi'
                : 'bg-alert/10 text-alert'
            }`}
          >
            {state.message}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand px-6 font-display font-semibold text-white shadow-[0_4px_0_0_#7B1540] transition-all duration-100 hover:shadow-[0_2px_0_0_#7B1540] hover:translate-y-[2px] disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none"
          >
            {pending ? 'กำลังบันทึก…' : 'บันทึก'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Server Component wrapper — ดึงค่าปัจจุบันจาก DB แล้วส่ง props
import { getSiteSettings } from '@/lib/site-settings';
export default async function SettingsPage() {
  const current = await getSiteSettings();
  return <SettingsForm current={current} />;
}
