import { NextResponse, type NextRequest } from 'next/server';
import { serverClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/config';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/me';

  if (code && hasSupabase) {
    const sb = serverClient();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) {
      // สร้างแถวใน profiles ให้ผู้ใช้ใหม่ครั้งแรกที่เข้าระบบ
      const { data } = await sb.auth.getUser();
      if (data.user) {
        await sb.from('profiles').upsert(
          { id: data.user.id, display_name: data.user.email?.split('@')[0] ?? 'ผู้ใช้ใหม่' },
          { onConflict: 'id', ignoreDuplicates: true },
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=1`);
}
