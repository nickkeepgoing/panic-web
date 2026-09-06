import { serverClient } from '@/lib/supabase/server';
import { daysLeft } from '@/lib/types';
import { createCompetition } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminCompetitions() {
  const { data } = await serverClient()
    .from('competitions')
    .select('id, name, organizer, open_at, close_at, status')
    .order('close_at', { ascending: false })
    .limit(50);

  const rows = data ?? [];
  const input = 'w-full rounded-lg border border-line bg-white px-3 py-2 text-ink outline-none focus:border-brand';

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
        <form action={createCompetition} className="flex max-w-2xl flex-col gap-4 rounded-card border border-line bg-surface p-5">
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
          <p className="text-xs text-muted">
            กรอกวันครบแล้วระบบจะลงหมุดปฏิทินให้เองทั้งสามวัน ไม่ต้องกรอกซ้ำอีกที่
          </p>
          <button className="w-fit rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep">
            บันทึกและเผยแพร่
          </button>
        </form>
      </section>
    </div>
  );
}
