import { getCompetitions } from '@/lib/data';
import { daysLeft } from '@/lib/types';

export const revalidate = 60;

export default async function CalendarPage() {
  const competitions = await getCompetitions();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold text-ink">ปฏิทินกิจกรรมและกำหนดส่ง</h1>
        <p className="text-sm text-muted">
          สถานะทุกอันคำนวณจากวันปิดรับตอนเปิดหน้า จึงไม่มีทางค้างเป็น “เปิดรับ” ทั้งที่หมดเขตแล้ว
        </p>
      </div>

      <ol className="flex flex-col divide-y divide-line rounded-card border border-line bg-surface">
        {competitions.map((c) => {
          const left = daysLeft(c.close_at);
          return (
            <li key={c.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-5">
              <span className="w-24 shrink-0 text-sm text-muted">
                {new Date(c.close_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
              </span>
              <span className="flex-1">
                <span className="block font-display text-base font-medium text-ink">{c.name}</span>
                <span className="text-sm text-muted">{c.organizer}</span>
              </span>
              <span className={`text-sm ${left <= 7 ? 'text-alert' : 'text-brand-deep'}`}>
                {left <= 0 ? 'ปิดรับแล้ว' : `เหลือ ${left} วัน`}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
