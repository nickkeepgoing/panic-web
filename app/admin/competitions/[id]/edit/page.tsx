import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import { CompetitionForm, type CompetitionDraft } from '@/components/CompetitionForm';

export const dynamic = 'force-dynamic';

export default async function EditCompetition({ params }: { params: { id: string } }) {
  const { data } = await serverClient()
    .from('competitions')
    .select('id, name, organizer, source_url, cover_url, open_at, close_at, event_at, status')
    .eq('id', params.id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">แก้ไขประกาศกิจกรรม</h1>
        <Link href="/admin/competitions" className="text-sm text-muted hover:text-brand-deep">
          กลับไปรายการประกาศ
        </Link>
      </div>
      <CompetitionForm competition={data as CompetitionDraft} />
    </div>
  );
}
