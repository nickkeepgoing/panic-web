import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProfile, serverClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/config';
import { ProgressControl } from '@/components/ProgressControl';
import { daysLeft } from '@/lib/types';
import { updateProfile } from './actions';

export const dynamic = 'force-dynamic';

export default async function MePage() {
  if (!hasSupabase) {
    return <p className="text-muted">หน้านี้ต้องต่อ Supabase ก่อน ดูขั้นตอนใน DEPLOY.md</p>;
  }

  const profile = await getProfile();
  if (!profile) redirect('/login?next=/me');

  const sb = serverClient();
  const [{ data: saves }, { data: follows }] = await Promise.all([
    sb.from('saved_projects')
      .select('progress_percent, created_at, projects(id, slug, title, summary, duration_weeks)')
      .order('created_at', { ascending: false }),
    sb.from('competition_follows')
      .select('applied, competitions(id, name, organizer, close_at)')
      .order('created_at', { ascending: false }),
  ]);

  const savedRows = (saves ?? []) as unknown as {
    progress_percent: number;
    projects: { id: string; slug: string; title: string; summary: string; duration_weeks: number };
  }[];
  const followRows = (follows ?? []) as unknown as {
    applied: boolean;
    competitions: { id: string; name: string; organizer: string; close_at: string };
  }[];

  const input = 'w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink outline-none focus:border-brand';

  return (
    <div className="flex flex-col gap-10">
      {/* Profile card */}
      <section className="flex flex-wrap items-center gap-4 rounded-card border border-line bg-surface p-6">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-light font-display text-xl text-brand-deep">
          {profile.display_name.slice(0, 1).toUpperCase()}
        </span>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold text-ink">{profile.display_name}</h1>
          <p className="text-sm text-muted">
            {profile.school_name ?? 'ยังไม่ได้ระบุโรงเรียน'}
            {profile.role !== 'student' && ' · ผู้ดูแลระบบ'}
          </p>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="font-display text-2xl text-ink">{savedRows.length}</p>
            <p className="text-xs text-muted">บันทึกไว้</p>
          </div>
          <div>
            <p className="font-display text-2xl text-ink">{followRows.filter((f) => f.applied).length}</p>
            <p className="text-xs text-muted">สมัครแล้ว</p>
          </div>
        </div>
      </section>

      {/* Profile edit */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-medium text-ink">แก้ไขโปรไฟล์</h2>
        <form action={updateProfile} className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 sm:max-w-md">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">ชื่อที่แสดงในเว็บ</span>
            <input name="display_name" required defaultValue={profile.display_name} className={input} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">โรงเรียน</span>
            <input name="school_name" defaultValue={profile.school_name ?? ''} placeholder="ชื่อโรงเรียน (ไม่บังคับ)" className={input} />
          </label>
          <button className="w-fit rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-deep">
            บันทึก
          </button>
        </form>
      </section>

      {/* Saved projects */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-medium text-ink">โครงงานที่บันทึกไว้</h2>
        {savedRows.length === 0 ? (
          <div className="rounded-card border border-line bg-surface p-6">
            <p className="text-ink">ยังไม่มีโครงงานที่บันทึกไว้</p>
            <Link href="/quiz" className="mt-2 inline-block text-sm text-brand-deep hover:underline">
              เริ่มจากทำแบบทดสอบหาโครงงานที่ใช่
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {savedRows.map((row) => (
              <li key={row.projects.id} className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
                <Link href={`/projects/${row.projects.slug}`} className="font-display text-lg font-medium text-ink hover:text-brand-deep">
                  {row.projects.title}
                </Link>
                <p className="text-sm text-muted">{row.projects.summary}</p>
                <ProgressControl projectId={row.projects.id} initial={row.progress_percent} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Followed competitions */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-medium text-ink">กิจกรรมที่ติดตาม</h2>
        {followRows.length === 0 ? (
          <p className="text-sm text-muted">ยังไม่ได้ติดตามกิจกรรมไหน</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line rounded-card border border-line bg-surface">
            {followRows.map((f) => {
              const left = daysLeft(f.competitions.close_at);
              return (
                <li key={f.competitions.id} className="flex flex-wrap items-baseline gap-x-4 p-5">
                  <span className="flex-1">
                    <span className="block text-ink">{f.competitions.name}</span>
                    <span className="text-sm text-muted">{f.competitions.organizer}</span>
                  </span>
                  <span className={`text-sm ${left <= 7 ? 'text-alert' : 'text-muted'}`}>
                    {f.applied ? 'สมัครแล้ว' : left <= 0 ? 'ปิดรับแล้ว' : `เหลือ ${left} วัน`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
