'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabase } from './config';

export function browserClient() {
  if (!hasSupabase) throw new Error('ยังไม่ได้ตั้งค่า NEXT_PUBLIC_SUPABASE_URL และ ANON_KEY');
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
