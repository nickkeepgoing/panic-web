import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/config';

export async function POST(request: Request) {
  if (!hasSupabase) return NextResponse.json({ error: 'no-db' }, { status: 503 });

  const sb = await serverClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const projectId = body?.projectId as string | undefined;
  const action = body?.action as 'save' | 'remove' | 'progress' | undefined;
  if (!projectId || !action) return NextResponse.json({ error: 'bad-request' }, { status: 400 });

  if (action === 'remove') {
    await sb.from('saved_projects').delete().eq('user_id', auth.user.id).eq('project_id', projectId);
    return NextResponse.json({ saved: false });
  }

  if (action === 'progress') {
    const percent = Math.min(100, Math.max(0, Number(body?.percent ?? 0)));
    await sb.from('saved_projects').update({ progress_percent: percent })
      .eq('user_id', auth.user.id).eq('project_id', projectId);
    return NextResponse.json({ saved: true, percent });
  }

  // RLS บังคับอยู่แล้วว่า user_id ต้องเป็นตัวเอง ปลอมส่งของคนอื่นมาไม่ได้
  await sb.from('saved_projects').upsert({ user_id: auth.user.id, project_id: projectId });
  return NextResponse.json({ saved: true });
}
