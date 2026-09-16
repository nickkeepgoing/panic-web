import Link from 'next/link';
import { serverClient } from '@/lib/supabase/server';
import { daysLeft } from '@/lib/types';
import { CompetitionForm } from '@/components/CompetitionForm';
import { DeleteCompetitionButton } from '@/components/DeleteCompetitionButton';

export const dynamic = 'force-dynamic';

const STATUS_TH: Record<string, string> = {
  draft: 'ร่าง', pending: 'รอตรวจ', published: 'เผยแพร่แล้ว', rejected: 'ตีกลับ', archived: 'เก็บเข้าคลัง',
};

export default async function AdminCompetitions() {
  const { data } = await serverClient()
    .from('competitions')
    .select('id, name, organizer, open_at, close_at, status')
    .order('close_at', { ascending: false })
    .limit(50);

  const rows = data ?? [];

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink">ประกาศกิจกรรมแข่งขัน</h1>
        {rows.length === 0 ? (
          <p className="rounded-card border border-line bg-surface p-6 text-muted">ยังไม่มีประกาศในระบบ</p>
        ) : (
          <ul className="divide-y divide-line rounded-card border border-line bg-surface">
            {rows.map((c) => {
              const left = c.close_at ? daysLeft(c.close_at) : 0;
              return (
                <li key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-ink">{c.name}</span>
                    <span className="text-sm text-muted">
                      {c.organizer || 'ไม่ระบุผู้จัด'} · ปิดรับ {c.close_at}
                    </span>
                  </span>
                  {/* สถานะ วันที่เหลือ และปุ่มจัดการอยู่กลุ่มเดียวกัน จอเล็กจึงตกลงมาเป็นแถวเดียวใต้ชื่อ */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <span className={`text-sm ${left <= 0 ? 'text-muted' : left <= 7 ? 'text-alert' : 'text-brand-deep'}`}>
                      {left <= 0 ? 'ปิดรับแล้ว' : `เหลือ ${left} วัน`}
                    </span>
                    <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs text-brand-deep">
                      {STATUS_TH[c.status] ?? c.status}
                    </span>
                    <Link
                      href={`/admin/competitions/${c.id}/edit`}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:border-brand hover:text-brand-deep"
                    >
                      แก้ไข
                    </Link>
                    <DeleteCompetitionButton id={c.id} name={c.name} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-medium text-ink">เพิ่มประกาศใหม่</h2>
        <CompetitionForm />
      </section>
    </div>
  );
}
