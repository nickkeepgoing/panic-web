import { serverClient } from '@/lib/supabase/server';
import { daysLeft } from '@/lib/types';
import { CompetitionForm } from '@/components/CompetitionForm';

export const dynamic = 'force-dynamic';

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
                <li key={c.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-4">
                  <span className="flex-1">
                    <span className="block text-ink">{c.name}</span>
                    <span className="text-sm text-muted">{c.organizer}</span>
                  </span>
                  <span className="text-sm text-muted">ปิดรับ {c.close_at}</span>
                  <span className={`text-sm ${left <= 0 ? 'text-muted' : left <= 7 ? 'text-alert' : 'text-brand-deep'}`}>
                    {left <= 0 ? 'ปิดรับแล้ว' : `เหลือ ${left} วัน`}
                  </span>
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
