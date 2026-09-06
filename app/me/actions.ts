'use server';

import { revalidatePath } from 'next/cache';
import { serverClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/config';

export async function updateProfile(formData: FormData) {
  if (!hasSupabase) throw new Error('ยังไม่ได้ต่อฐานข้อมูล');
  const sb = serverClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) throw new Error('ยังไม่ได้เข้าสู่ระบบ');

  const displayName = String(formData.get('display_name') ?? '').trim();
  if (displayName.length < 2) throw new Error('ชื่อต้องยาวอย่างน้อย 2 ตัวอักษร');

  const { error } = await sb.from('profiles').update({
    display_name: displayName,
    school_name: String(formData.get('school_name') ?? '').trim() || null,
  }).eq('id', auth.user.id);

  if (error) throw new Error(error.message);
  revalidatePath('/me');
}
