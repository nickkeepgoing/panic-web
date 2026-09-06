import { daysLeft, type Competition } from '@/lib/types';

export function CompetitionCard({ competition }: { competition: Competition }) {
  const left = daysLeft(competition.close_at);
  const urgent = left <= 7;

  return (
    <article
      className={`flex min-w-[260px] flex-col gap-1.5 rounded-card border bg-surface p-4 ${
        urgent ? 'border-alert' : 'border-line'
      }`}
    >
      <p className={`text-xs font-medium ${urgent ? 'text-alert' : 'text-brand-deep'}`}>
        {left <= 0 ? 'ปิดรับแล้ว' : `ปิดรับใน ${left} วัน`}
      </p>
      <h3 className="font-display text-base font-medium text-ink">{competition.name}</h3>
      <p className="text-sm text-muted">{competition.organizer}</p>
    </article>
  );
}
