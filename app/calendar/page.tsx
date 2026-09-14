import { getCompetitions } from '@/lib/data';
import { type Competition } from '@/lib/types';
import { CompetitionCard } from '@/components/CompetitionCard';

export const revalidate = 60;

const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const pad = (n: number) => String(n).padStart(2, '0');
const keyOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

/** รายชื่อเดือน (ปี, เดือน 0-based) ตั้งแต่เดือนของ startISO ถึงเดือนของ endISO — จำกัด 12 เดือนกันวนยาว */
function monthsBetween(startISO: string, endISO: string) {
  const [sy, sm] = startISO.split('-').map(Number);
  const [ey, em] = endISO.split('-').map(Number);
  const endIdx = ey * 12 + (em - 1);
  const out: { y: number; m: number }[] = [];
  let y = sy;
  let m = sm - 1;
  for (let guard = 0; y * 12 + m <= endIdx && guard < 12; guard++) {
    out.push({ y, m });
    if (++m > 11) { m = 0; y++; }
  }
  return out;
}

export default async function CalendarPage() {
  const competitions = await getCompetitions();

  // จับกลุ่มกิจกรรมตามวันปิดรับ เพื่อลงหมุดในช่องปฏิทินของวันนั้น
  const byDay = new Map<string, Competition[]>();
  for (const c of competitions) {
    const k = c.close_at.slice(0, 10);
    const list = byDay.get(k) ?? [];
    list.push(c);
    byDay.set(k, list);
  }

  const now = new Date();
  const todayKey = keyOf(now.getFullYear(), now.getMonth(), now.getDate());
  const lastISO = competitions.length ? competitions[competitions.length - 1].close_at.slice(0, 10) : todayKey;
  const months = monthsBetween(todayKey, lastISO);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-ink">ปฏิทินกิจกรรม</h1>
        <p className="max-w-prose text-muted">
          ช่องที่แต้มสีคือวันปิดรับสมัคร เลื่อนดูรายละเอียดและกดสมัครได้จากการ์ดโปสเตอร์ด้านล่าง
          จำนวนวันคำนวณใหม่ทุกครั้งที่เปิดหน้า จึงไม่ค้างเป็น &ldquo;เปิดรับ&rdquo; ทั้งที่หมดเขตแล้ว
        </p>
      </div>

      {/* ── ปฏิทินรายเดือน ── */}
      {months.length > 0 && (
        <section className="flex flex-col gap-6">
          {months.map(({ y, m }) => (
            <MonthGrid key={`${y}-${m}`} y={y} m={m} byDay={byDay} todayKey={todayKey} />
          ))}
          <p className="flex items-center gap-2 text-sm text-muted">
            <span className="h-2.5 w-2.5 rounded-full bg-brand" aria-hidden />
            วันปิดรับสมัคร
          </p>
        </section>
      )}

      {/* ── การ์ดโปสเตอร์ พร้อมปุ่มสมัคร ── */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">รายละเอียดกิจกรรม</h2>
        {competitions.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((c) => (
              <li key={c.id} className="flex">
                <CompetitionCard competition={c} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-card border border-dashed border-line bg-surface p-6 text-muted">
            ยังไม่มีกิจกรรมที่เปิดรับอยู่ตอนนี้ ปฏิทินอัปเดตตลอดปี
          </p>
        )}
      </section>
    </div>
  );
}

function MonthGrid({
  y,
  m,
  byDay,
  todayKey,
}: {
  y: number;
  m: number;
  byDay: Map<string, Competition[]>;
  todayKey: string;
}) {
  const firstWeekday = new Date(y, m, 1).getDay(); // 0 = อาทิตย์
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <h3 className="border-b border-line px-4 py-3 font-display text-lg font-semibold text-ink">
        {MONTHS[m]} {y + 543}
      </h3>

      <div className="grid grid-cols-7 border-b border-line bg-ground text-center text-xs font-medium text-muted">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (d == null) return <div key={i} className="aspect-square border-b border-r border-line/60" />;

          const k = keyOf(y, m, d);
          const events = byDay.get(k);
          const isToday = k === todayKey;

          return (
            <div
              key={i}
              title={events?.map((e) => e.name).join(', ')}
              className={`relative flex aspect-square flex-col gap-1 border-b border-r border-line/60 p-1.5 ${
                events ? 'bg-brand-light' : ''
              }`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${
                  isToday ? 'bg-brand font-semibold text-white' : events ? 'font-semibold text-brand-deep' : 'text-muted'
                }`}
              >
                {d}
              </span>
              {events && (
                <span className="min-h-0 flex-1 overflow-hidden">
                  {/* จอเล็กแสดงจุด จอ sm ขึ้นไปแสดงชื่อย่อ เพื่อไม่ให้ช่องแคบล้น */}
                  <span className="block h-1.5 w-1.5 rounded-full bg-brand sm:hidden" aria-hidden />
                  <span className="hidden text-[11px] leading-tight text-brand-deep sm:line-clamp-2 sm:block">
                    {events[0].name}
                    {events.length > 1 && ` +${events.length - 1}`}
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
