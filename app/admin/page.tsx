import Link from 'next/link';
import { serverClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  const sb = serverClient();
  const [projects, published, pending, comps] = await Promise.all([
    sb.from('projects').select('id', { count: 'exact', head: true }),
    sb.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    sb.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('competitions').select('id', { count: 'exact', head: true }).gte('close_at', new Date().toISOString().slice(0, 10)),
  ]);

  const cards = [
    { label: 'โครงงานทั้งหมด', value: projects.count ?? 0, note: `เผยแพร่แล้ว ${published.count ?? 0}` },
    { label: 'กิจกรรมที่ยังเปิดรับ', value: comps.count ?? 0, note: 'นับจากวันปิดรับที่ยังไม่ถึง' },
    { label: 'รอตรวจอนุมัติ', value: pending.count ?? 0, note: 'โครงงานที่ผู้ใช้ส่งเข้ามา' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">ภาพรวมระบบ</h1>
        <div className="ml-auto flex gap-2">
          <Link href="/admin/projects/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep">
            เพิ่มโครงงาน
          </Link>
          <Link href="/admin/competitions" className="rounded-lg border border-brand px-4 py-2 text-sm text-brand-deep hover:bg-brand-light">
            เพิ่มประกาศกิจกรรม
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-line bg-surface p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="font-display text-3xl text-ink">{c.value.toLocaleString('th-TH')}</p>
            <p className="text-xs text-muted">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
