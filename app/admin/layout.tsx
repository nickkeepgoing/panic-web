import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

const ADMIN_NAV = [
  { href: '/admin', label: 'ภาพรวม' },
  { href: '/admin/projects', label: 'คลังโครงงาน' },
  { href: '/admin/competitions', label: 'กิจกรรมแข่งขัน' },
  { href: '/admin/queue', label: 'คิวตรวจอนุมัติ' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabase) {
    return <p className="text-muted">หน้าผู้ดูแลต้องต่อ Supabase ก่อน ดูขั้นตอนใน DEPLOY.md</p>;
  }

  const profile = await getProfile();
  if (!profile) redirect('/login?next=/admin');
  // ด่านที่สองอยู่ที่ RLS ในฐานข้อมูล ต่อให้หลุดด่านนี้ก็เขียนข้อมูลไม่ได้
  if (profile.role === 'student') {
    return (
      <div className="rounded-card border border-line bg-surface p-8">
        <h1 className="font-display text-xl text-ink">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</h1>
        <p className="mt-1 text-sm text-muted">
          ถ้าคุณควรมีสิทธิ์ ให้ super admin เปลี่ยน role ในตาราง profiles เป็น editor ให้ก่อน
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex flex-wrap gap-1 border-b border-line pb-3 text-sm">
        {ADMIN_NAV.map((n) => (
          <Link key={n.href} href={n.href} className="rounded-lg px-3 py-1.5 text-muted hover:bg-brand-light hover:text-brand-deep">
            {n.label}
          </Link>
        ))}
        <span className="ml-auto self-center text-xs text-muted">
          {profile.display_name} · {profile.role === 'super_admin' ? 'ผู้ดูแลสูงสุด' : 'บรรณาธิการ'}
        </span>
      </nav>
      {children}
    </div>
  );
}
