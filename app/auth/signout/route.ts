import { NextResponse, type NextRequest } from 'next/server';
import { serverClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/config';

export async function POST(request: NextRequest) {
  if (hasSupabase) await serverClient().auth.signOut();
  return NextResponse.redirect(new URL('/', request.url), { status: 303 });
}
