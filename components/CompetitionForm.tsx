'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
  createCompetition,
  updateCompetition,
  type CompetitionFormState,
} from '@/app/admin/actions';

export type CompetitionDraft = {
  id: string;
  name: string;
  organizer: string | null;
  source_url: string | null;
  cover_url: string | null;
  open_at: string | null;
  close_at: string;
  event_at: string | null;
  status: string;
};

const input = 'w-full rounded-lg border border-line bg-white px-3 py-2 text-ink outline-none focus:border-brand';
const empty: CompetitionFormState = { ok: false, message: '' };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-fit rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep disabled:opacity-60"
    >
      {pending ? 'กำลังบันทึก…' : label}
    </button>
  );
}

/** ฟอร์มเดียวใช้ได้ทั้งเพิ่มใหม่และแก้ไข — ส่ง competition มาคือโหมดแก้ไข */
export function CompetitionForm({ competition }: { competition?: CompetitionDraft }) {
  const editing = Boolean(competition);
  const [state, formAction] = useFormState(editing ? updateCompetition : createCompetition, empty);
  const form = useRef<HTMLFormElement>(null);

  // เพิ่มสำเร็จแล้วล้างฟอร์มให้ ไม่งั้นกดซ้ำจะชน slug unique
  // โหมดแก้ไขห้ามล้าง ไม่งั้นค่าที่เพิ่งบันทึกจะเด้งกลับเป็นค่าเดิมตอนเปิดหน้า
  useEffect(() => {
    if (state.ok && !editing) form.current?.reset();
  }, [state, editing]);

  return (
    <form ref={form} action={formAction} className="flex max-w-2xl flex-col gap-4 rounded-card border border-line bg-surface p-5">
      {competition && <input type="hidden" name="id" value={competition.id} />}

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
        <input name="name" required defaultValue={competition?.name ?? ''} className={input} placeholder="เช่น ประกวดโครงงานวิทยาศาสตร์ 2570" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">ผู้จัด</span>
        <input name="organizer" defaultValue={competition?.organizer ?? ''} className={input} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">ลิงก์ประกาศต้นทาง</span>
        <input name="source_url" type="url" defaultValue={competition?.source_url ?? ''} className={input} placeholder="https://" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">รูปโปสเตอร์ (URL รูปภาพ)</span>
        <input name="cover_url" type="url" defaultValue={competition?.cover_url ?? ''} className={input} placeholder="https://..." />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">วันเปิดรับ</span>
          <input name="open_at" type="date" defaultValue={competition?.open_at ?? ''} className={input} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">วันปิดรับ</span>
          <input name="close_at" type="date" required defaultValue={competition?.close_at ?? ''} className={input} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">วันแข่ง</span>
          <input name="event_at" type="date" defaultValue={competition?.event_at ?? ''} className={input} />
        </label>
      </div>
      <p className="text-xs text-muted">กรอกวันครบแล้วระบบจะลงหมุดปฏิทินให้เองทั้งสามวัน</p>

      {competition && (
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">สถานะ</span>
          <select name="status" defaultValue={competition.status} className={`${input} sm:max-w-xs`}>
            <option value="published">เผยแพร่ (คนทั่วไปเห็น)</option>
            <option value="draft">ร่าง (ซ่อนจากหน้าเว็บ)</option>
            <option value="archived">เก็บเข้าคลัง</option>
          </select>
        </label>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={editing ? 'บันทึกการแก้ไข' : 'บันทึกและเผยแพร่'} />
        {editing && (
          <Link href="/admin/competitions" className="text-sm text-muted hover:text-brand-deep">
            กลับไปรายการประกาศ
          </Link>
        )}
      </div>
    </form>
  );
}
