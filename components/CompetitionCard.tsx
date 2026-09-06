import { daysLeft, type Competition } from '@/lib/types';

export function CompetitionCard({ competition }: { competition: Competition }) {
  const left = daysLeft(competition.close_at);
  const urgent = left > 0 && left <= 7;

  return (
    <article className="flex min-w-[270px] max-w-[300px] gap-4 rounded-card border border-line bg-surface p-4">
      <div className={`flex w-14 shrink-0 flex-col items-center justify-center rounded-lg ${urgent ? 'bg-alert text-white' : 'bg-brand-light text-brand-deep'}`}>
        <span className="font-display text-2xl font-bold leading-none">{left > 0 ? left : '—'}</span>
        <span className="text-[11px]">{left > 0 ? 'วัน' : 'ปิดแล้ว'}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-display text-base font-semibold text-ink">{competition.name}</h3>
        <p className="text-sm text-muted">{competition.organizer}</p>
      </div>
    </article>
  );
}
