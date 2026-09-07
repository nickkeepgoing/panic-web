import Link from 'next/link';
import { serverClient } from '@/lib/supabase/server';
import { setProjectStatus } from '../actions';

export const dynamic = 'force-dynamic';

const STATUS_TH: Record<string, string> = {
  draft: 'ร่าง', pending: 'รอตรวจ', published: 'เผยแพร่แล้ว', rejected: 'ตีกลับ', archived: 'เก็บเข้าคลัง',
};

export default async function AdminProjects() {
  const { data } = await serverClient()
    .from('projects')
    .select('id, title, status, difficulty, updated_at')
    .order('updated_at', { ascending: false })
    .limit(50);

  const rows = data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">คลังโครงงาน</h1>
        <Link
          href="/admin/projects/import"
          className="ml-auto rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand-deep hover:bg-brand-light"
        >
          นำเข้าจาก CSV
        </Link>
        <Link href="/admin/projects/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep">
          เพิ่มโครงงาน
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-card border border-line bg-surface p-6 text-muted">
          ยังไม่มีโครงงานในระบบ — เริ่มจากรัน db/seed.sql หรือกดเพิ่มโครงงานแรก
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-card border border-line bg-surface">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
              <span className="flex-1 text-ink">{p.title}</span>
              <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs text-brand-deep">
                {STATUS_TH[p.status] ?? p.status}
              </span>
              <Link
                href={`/admin/projects/${p.id}/edit`}
                className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:border-brand hover:text-brand-deep"
              >
                แก้ไข
              </Link>
              <form action={setProjectStatus}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="status" value={p.status === 'published' ? 'draft' : 'published'} />
                <button className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:border-brand hover:text-brand-deep">
                  {p.status === 'published' ? 'ถอนออก' : 'เผยแพร่'}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
