'use server';

import { revalidateTag } from 'next/cache';
import { serverClient } from '@/lib/supabase/server';
import { hasSupabase, SETTING_DEFS } from '@/lib/site-settings';

export async function saveSettings(
  _prev: unknown,
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  if (!hasSupabase) return { ok: false, message: 'ยังไม่ต่อฐานข้อมูล' };
  try {
    const sb = serverClient();
    const rows = SETTING_DEFS.map((d) => ({
      key: d.key,
      label: d.label,
      value: (formData.get(d.key) as string ?? '').trim(),
      updated_at: new Date().toISOString(),
    }));
    const { error } = await sb.from('site_settings').upsert(rows);
    if (error) return { ok: false, message: error.message };
    revalidateTag('site-settings');
    return { ok: true, message: 'บันทึกเรียบร้อย' };
  } catch (e) {
    return { ok: false, message: String(e) };
  }
}
