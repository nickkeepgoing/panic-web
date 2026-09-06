import { serverClient } from '@/lib/supabase/server';
import { setProjectStatus } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminQueue() {
  const { data } = await (await serverClient())
    .from('projects')
    .select('id, title, summary, created_at, profiles:submitted_by(display_name)')
    .eq('status', 'pending')
    .order('created_at');

  const rows = (data ?? []) as unknown as {
    id: string; title: string; summary: string; created_at: string;
    profiles: { display_name: string } | null;
  }[];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">คิวตรวจอนุมัติ</h1>
        <p className="text-sm text-muted">โครงงานที่นักเรียนหรือครูส่งเข้ามา ยังไม่ขึ้นเว็บจนกว่าจะกดเผยแพร่</p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-card border border-line bg-surface p-6 text-muted">ไม่มีอะไรค้างในคิว</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
              <div>
                <h2 className="font-display text-lg font-medium text-ink">{p.title}</h2>
                <p className="text-sm text-muted">{p.summary}</p>
                <p className="mt-1 text-xs text-muted">
                  ส่งโดย {p.profiles?.display_name ?? 'ไม่ระบุ'} · {new Date(p.created_at).toLocaleDateString('th-TH')}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={setProjectStatus}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="status" value="published" />
                  <button className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep">
                    อนุมัติและเผยแพร่
                  </button>
                </form>
                <form action={setProjectStatus}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button className="rounded-lg border border-line px-4 py-2 text-sm text-muted hover:border-alert hover:text-alert">
                    ตีกลับ
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
