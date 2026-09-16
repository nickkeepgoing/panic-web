import { cookies } from 'next/headers';
import { getCareers } from '@/lib/career-data';
import { getProjects } from '@/lib/data';
import { CareerQuizFlow } from '@/components/CareerQuizFlow';
import { hasSupabase } from '@/lib/supabase/config';
import { serverClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function CareerPage() {
  const [careers, projects] = await Promise.all([getCareers(), getProjects()]);

  // session_id สำหรับ analytics — สร้างครั้งแรก แล้วเก็บใน cookie
  const store = cookies();
  let sessionId = store.get('panic_session_id')?.value ?? '';
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    store.set('panic_session_id', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false, // ให้ client JS อ่านได้สำหรับ event tracking
    });
  }

  // บันทึก PAGE_VIEW (fire-and-forget)
  if (hasSupabase) {
    const { data: auth } = await serverClient().auth.getUser().catch(() => ({ data: { user: null } }));
    serverClient().from('events').insert({
      session_id: sessionId,
      user_id: auth?.user?.id ?? null,
      event_type: 'PAGE_VIEW',
      page: '/career',
    }).then(() => {}, () => {});
  }

  return (
    <div className="flex flex-col gap-10">
      <CareerQuizFlow careers={careers} projects={projects} sessionId={sessionId} />
    </div>
  );
}
