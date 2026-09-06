import { getCompetitions } from '@/lib/data';
import { daysLeft } from '@/lib/types';

export const revalidate = 60;

export default async function CalendarPage() {
  const competitions = await getCompetitions();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-ink">ปฏิทินกำหนดส่ง</h1>
        <p className="max-w-prose text-muted">
          จำนวนวันคำนวณใหม่ทุกครั้งที่เปิดหน้า จึงไม่มีทางค้างเป็น "เปิดรับ" ทั้งที่หมดเขตไปแล้ว
          กดติดตามไว้จะได้รับแจ้งเตือนล่วงหน้า 7 วัน
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {competitions.map((c) => {
          const left = daysLeft(c.close_at);
          const closed = left <= 0;
          const urgent = !closed && left <= 7;
          return (
            <li
              key={c.id}
              className={`flex flex-wrap items-center gap-4 overflow-hidden rounded-card border bg-surface p-4 ${
                urgent ? 'border-alert' : 'border-line'
              } ${closed ? 'opacity-60' : ''}`}
            >
              <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-lg ${
                closed ? 'bg-ground text-muted' : urgent ? 'bg-alert text-white' : 'bg-brand-light text-brand-deep'
              }`}>
                <span className="font-display text-2xl font-bold leading-none">{closed ? '—' : left}</span>
                <span className="text-[11px]">{closed ? 'ปิดแล้ว' : 'วัน'}</span>
              </div>
              <div className="min-w-[200px] flex-1">
                <h2 className="font-display text-lg font-semibold text-ink">{c.name}</h2>
                <p className="text-sm text-muted">{c.organizer}</p>
              </div>
              <p className="text-sm text-muted">
                ปิดรับ {new Date(c.close_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
