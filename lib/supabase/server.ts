import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabase } from './config';

/** ใช้ในทุก server component และ route handler — ผูกกับ session ของผู้ใช้ RLS จึงทำงาน */
export function serverClient() {
  const store = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get: (name: string) => store.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => {
        try { store.set({ name, value, ...options }); } catch { /* เรียกจาก server component ข้ามได้ */ }
      },
      remove: (name: string, options: CookieOptions) => {
        try { store.set({ name, value: '', ...options }); } catch { /* เช่นเดียวกัน */ }
      },
    },
  });
}

/**
 * อ่านอย่างเดียว ไม่มี session — ใช้กับหน้า public ที่ cache ได้
 *
 * tags: ติดแท็ก Data Cache ให้ทุก request ที่ยิงผ่าน client ตัวนี้
 * เพื่อให้หน้าแอดมินสั่ง revalidateTag() ล้างแคชได้ตรงชุดข้อมูลหลังเพิ่ม/แก้/ลบ
 * ไม่งั้นหน้าแรกกับหน้าปฏิทินจะค้างข้อมูลเดิมจนครบเวลา revalidate ของหน้านั้น
 */
export function anonClient(tags: string[] = []) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { tags } }),
    },
  });
}

export async function getSessionUser() {
  if (!hasSupabase) return null;
  const { data } = await serverClient().auth.getUser();
  return data.user ?? null;
}

export type Profile = { id: string; display_name: string; role: 'student' | 'editor' | 'super_admin'; grade_level: number | null; school_name: string | null };

export async function getProfile(): Promise<Profile | null> {
  if (!hasSupabase) return null;
  const sb = serverClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return null;
  const { data } = await sb.from('profiles').select('*').eq('id', auth.user.id).single();
  return (data as Profile) ?? null;
}

export async function isAdmin() {
  const p = await getProfile();
  return p?.role === 'editor' || p?.role === 'super_admin';
}
