import Image from 'next/image';
import { daysLeft, type Competition } from '@/lib/types';

/**
 * การ์ดกิจกรรม (โปสเตอร์) ใช้ทั้งหน้าแรกและหน้าปฏิทิน
 *
 * แสดงโปสเตอร์จาก cover_url ถ้ามี ถ้าไม่มีก็ขึ้นแผ่นสีไล่เฉดพร้อมชื่อกิจกรรมแทน
 * เพื่อไม่ให้การ์ดว่างเปล่า ปุ่ม "รายละเอียดและสมัคร" โผล่เฉพาะเมื่อ source_url
 * เป็นลิงก์จริง (ข้อมูลตัวอย่างบางชุดเก็บเป็น '#') คนจึงกดไปสมัครต่อได้จริง
 */
export function CompetitionCard({ competition }: { competition: Competition }) {
  const left = daysLeft(competition.close_at);
  const closed = left < 0;
  const urgent = !closed && left <= 7;

  const href = /^https?:\/\//i.test(competition.source_url ?? '') ? competition.source_url : null;
  const poster = /^https?:\/\//i.test(competition.cover_url ?? '') ? competition.cover_url! : null;

  const closeDate = new Date(competition.close_at).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const badge = left > 0 ? `เหลืออีก ${left} วัน` : left === 0 ? 'ปิดรับวันนี้' : 'ปิดรับแล้ว';

  return (
    <article
      className={`group flex w-full flex-col overflow-hidden rounded-card border bg-surface transition duration-200 ${
        urgent ? 'border-alert/40' : 'border-line'
      } ${closed ? 'opacity-70' : ''} ${href ? 'hover:border-brand hover:shadow-lift' : ''}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {poster ? (
          <Image
            src={poster}
            alt={`โปสเตอร์ ${competition.name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center bg-gradient-to-br from-brand to-brand-deep p-4 text-center"
            aria-hidden
          >
            <span className="font-display text-lg font-bold leading-snug text-white">{competition.name}</span>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${
            closed ? 'bg-ink/70 text-white' : urgent ? 'bg-alert text-white' : 'bg-white/90 text-brand-deep'
          }`}
        >
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base font-semibold text-ink group-hover:text-brand-deep">
          {competition.name}
        </h3>
        <p className="text-sm text-muted">{competition.organizer}</p>
        <p className="mt-1 text-sm text-muted">
          <time dateTime={competition.close_at}>ปิดรับ {closeDate}</time>
        </p>

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-deep"
          >
            รายละเอียดและสมัคร
            <span className="sr-only"> (เปิดในแท็บใหม่)</span>
          </a>
        )}
      </div>
    </article>
  );
}
