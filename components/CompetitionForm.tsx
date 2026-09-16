'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createCompetition, type CompetitionFormState } from '@/app/admin/actions';

const input = 'w-full rounded-lg border border-line bg-white px-3 py-2 text-ink outline-none focus:border-brand';
const empty: CompetitionFormState = { ok: false, message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-fit rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep disabled:opacity-60"
    >
      {pending ? 'กำลังบันทึก…' : 'บันทึกและเผยแพร่'}
    </button>
  );
}

export function CompetitionForm() {
  const [state, formAction] = useFormState(createCompetition, empty);
  const form = useRef<HTMLFormElement>(null);

  // สำเร็จแล้วล้างฟอร์มให้ ไม่งั้นกดซ้ำจะชน slug unique
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={formAction} className="flex max-w-2xl flex-col gap-4 rounded-card border border-line bg-surface p-5">
      {state.message && (
        <p
          role="status"
          className={`rounded-lg border px-3 py-2 text-sm ${
            state.ok ? 'border-brand bg-white text-brand-deep' : 'border-alert bg-white text-alert'
          }`}
        >
          {state.message}
        </p>
      )}
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">ชื่อกิจกรรม</span>
        <input name="name" required className={input} placeholder="เช่น ประกวดโครงงานวิทยาศาสตร์ 2570" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">ผู้จัด</span>
        <input name="organizer" className={input} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">ลิงก์ประกาศต้นทาง</span>
        <input name="source_url" type="url" className={input} placeholder="https://" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">รูปโปสเตอร์ (URL รูปภาพ)</span>
        <input name="cover_url" type="url" className={input} placeholder="https://..." />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">วันเปิดรับ</span>
          <input name="open_at" type="date" className={input} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">วันปิดรับ</span>
          <input name="close_at" type="date" required className={input} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">วันแข่ง</span>
          <input name="event_at" type="date" className={input} />
        </label>
      </div>
      <p className="text-xs text-muted">กรอกวันครบแล้วระบบจะลงหมุดปฏิทินให้เองทั้งสามวัน</p>
      <SubmitButton />
    </form>
  );
}
