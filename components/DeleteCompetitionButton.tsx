'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { deleteCompetition, type CompetitionFormState } from '@/app/admin/actions';

const empty: CompetitionFormState = { ok: false, message: '' };

function Button({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      // ลบแล้วกู้คืนไม่ได้ ถามยืนยันก่อนเสมอ และบอกชื่อไปด้วยกันกดผิดใบ
      onClick={(e) => {
        if (!confirm(`ลบประกาศ "${name}" ออกจากระบบ?\nหมุดปฏิทินและรายการติดตามของประกาศนี้จะหายไปด้วย และกู้คืนไม่ได้`)) {
          e.preventDefault();
        }
      }}
      className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:border-alert hover:text-alert disabled:opacity-60"
    >
      {pending ? 'กำลังลบ…' : 'ลบ'}
    </button>
  );
}

export function DeleteCompetitionButton({ id, name }: { id: string; name: string }) {
  const [state, formAction] = useFormState(deleteCompetition, empty);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      {/* ลบสำเร็จแถวจะหายไปพร้อมข้อความ เหลือไว้เฉพาะกรณีลบไม่ผ่าน */}
      {!state.ok && state.message && <span className="text-xs text-alert">{state.message}</span>}
      <Button name={name} />
    </form>
  );
}
