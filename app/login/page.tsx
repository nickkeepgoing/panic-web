import { AuthForm } from '@/components/AuthForm';
import { hasSupabase } from '@/lib/supabase/config';

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-ink">เข้าใช้งาน</h1>
        <p className="text-muted">
          ไล่ดูโครงงานไม่ต้องเข้าสู่ระบบ แต่ถ้าจะบันทึกไว้ดูทีหลัง เก็บความคืบหน้า
          หรือรับแจ้งเตือนก่อนปิดรับสมัคร ต้องมีบัญชีก่อน
        </p>
      </div>
      {hasSupabase ? (
        <AuthForm next={searchParams.next} />
      ) : (
        <p className="rounded-card border border-line bg-surface p-5 text-sm text-muted">
          ยังไม่ได้ตั้งค่า Supabase — ใส่ค่าใน .env.local แล้วรีสตาร์ทเซิร์ฟเวอร์
        </p>
      )}
    </div>
  );
}
