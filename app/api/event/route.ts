import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/config';

// Fire-and-forget event tracking — ไม่ block ผู้ใช้ถ้า error
export async function POST(request: Request) {
  if (!hasSupabase) return NextResponse.json({ ok: true });

  const body = await request.json().catch(() => null);
  const session_id = (body?.session_id as string | undefined)?.trim();
  const event_type = (body?.event_type as string | undefined)?.trim();

  if (!session_id || !event_type) {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  // รับ user_id ถ้า login อยู่ (ไม่บังคับ)
  const sb = serverClient();
  const { data: auth } = await sb.auth.getUser().catch(() => ({ data: { user: null } }));

  try {
    await sb.from('events').insert({
      session_id,
      user_id: auth?.user?.id ?? null,
      event_type,
      page:      body?.page      ?? null,
      object_id: body?.object_id ?? null,
      metadata:  body?.metadata  ?? {},
    });
  } catch { /* fire-and-forget — ไม่โยน error ให้ client */ }

  return NextResponse.json({ ok: true });
}
