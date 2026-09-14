import { daysLeft, type Competition } from '@/lib/types';

/**
 * การ์ดกิจกรรมบนหน้าแรก
 *
 * เดิมการ์ดนี้เป็น <article> เฉย ๆ ที่กดไม่ได้ ทั้งที่หน้าตาเหมือนของที่กดได้
 * และไม่เคยใช้ source_url เลย คนอ่านเจอกิจกรรมที่ใกล้ปิดแล้วไปสมัครต่อไม่ได้
 * ตอนนี้ชื่อกิจกรรมเป็นลิงก์ แล้วขยายพื้นที่กดให้เต็มการ์ดด้วย ::after
 * ชื่อที่โปรแกรมอ่านหน้าจอประกาศจึงเป็นชื่อกิจกรรม ไม่ใช่ข้อความทั้งใบ
 */
export function CompetitionCard({ competition }: { competition: Competition }) {
  const left = daysLeft(competition.close_at);
  const urgent = left >= 0 && left <= 7;

  // ข้อมูลตัวอย่างเก็บ source_url เป็น '#' จึงต้องเช็คว่าเป็นลิงก์จริงก่อนทำให้กดได้
  const href = /^https?:\/\//i.test(competition.source_url ?? '') ? competition.source_url : null;

  const closeDate = new Date(competition.close_at).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const countdown =
    left > 0 ? { big: String(left), small: 'วัน' } : left === 0 ? { big: 'วันนี้', small: 'ปิดรับ' } : { big: '—', small: 'ปิดแล้ว' };

  return (
    <article
      className={`relative flex w-full gap-4 rounded-card border bg-surface p-4 transition duration-200 ${
        urgent ? 'border-alert/40' : 'border-line'
      } ${href ? 'hover:border-brand hover:shadow-lift focus-within:border-brand focus-within:shadow-lift' : ''}`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg ${
          urgent ? 'bg-alert text-white' : 'bg-brand-light text-brand-deep'
        }`}
      >
        {left > 0 && <span className="sr-only">เหลืออีก </span>}
        <span className={`font-display font-bold leading-none ${left > 0 ? 'text-2xl' : 'text-sm'}`}>
          {countdown.big}
        </span>
        <span className="mt-0.5 text-[11px] leading-none">{countdown.small}</span>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="font-display text-base font-semibold text-ink">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0 hover:text-brand-deep"
            >
              {competition.name}
              <span className="sr-only"> (เปิดหน้าสมัครในแท็บใหม่)</span>
            </a>
          ) : (
            competition.name
          )}
        </h3>
        <p className="text-sm text-muted">{competition.organizer}</p>
        {/* วันที่ปิดรับต้องเห็นด้วย ไม่ใช่มีแต่ "เหลือ N วัน" เพราะคนต้องเอาไปลงปฏิทินจริง */}
        <p className="mt-1 text-sm text-muted">
          <time dateTime={competition.close_at}>ปิดรับ {closeDate}</time>
        </p>
      </div>
    </article>
  );
}
