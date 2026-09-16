import { cookies } from 'next/headers';
import { getCareers } from '@/lib/career-data';
import { getProjects } from '@/lib/data';
import { CareerQuizFlow } from '@/components/CareerQuizFlow';

export const dynamic = 'force-dynamic';

export default async function CareerPage() {
  const [careers, projects] = await Promise.all([getCareers(), getProjects()]);

  // อ่าน session_id จาก cookie เท่านั้น — ห้าม .set() ใน Server Component
  // ถ้ายังไม่มี cookie ให้ CareerQuizFlow สร้างฝั่ง client แล้วเก็บเอง
  const sessionId = cookies().get('panic_session_id')?.value ?? '';

  return (
    <div className="flex flex-col gap-10">
      <CareerQuizFlow careers={careers} projects={projects} initialSessionId={sessionId} />
    </div>
  );
}
