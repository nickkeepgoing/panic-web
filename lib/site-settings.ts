import { hasSupabase } from './supabase/config';
import { anonClient, serverClient } from './supabase/server';
import { revalidateTag } from 'next/cache';

export type SettingDef = { key: string; label: string; defaultValue: string };

export const SETTING_DEFS: SettingDef[] = [
  { key: 'footer_tagline',    label: 'คำอธิบายเว็บไซต์ (Footer)',  defaultValue: 'โครงงานทุกเรื่องที่นี่เป็นไอเดียตั้งต้น ไม่ใช่ผลงานสำเร็จรูป' },
  { key: 'footer_author',     label: 'ผู้พัฒนา/ผู้จัดทำ',          defaultValue: '' },
  { key: 'footer_school',     label: 'โรงเรียน/สถาบัน',             defaultValue: '' },
  { key: 'footer_powered_by', label: 'Powered by',                  defaultValue: 'Next.js · Supabase · Vercel' },
];

const TAG = 'site-settings';

/** อ่านค่าทั้งหมด — Next.js Data Cache tagged ด้วย 'site-settings' */
export async function getSiteSettings(): Promise<Record<string, string>> {
  const defaults = Object.fromEntries(SETTING_DEFS.map((d) => [d.key, d.defaultValue]));
  if (!hasSupabase) return defaults;
  try {
    const { data } = await anonClient([TAG]).from('site_settings').select('key,value');
    if (!data) return defaults;
    return { ...defaults, ...Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value])) };
  } catch {
    return defaults;
  }
}

/** Server Action: บันทึก settings ทั้งหมด แล้ว revalidate cache */
export async function saveSettings(formData: FormData): Promise<{ ok: boolean; message: string }> {
  'use server';
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
    revalidateTag(TAG);
    return { ok: true, message: 'บันทึกเรียบร้อย' };
  } catch (e) {
    return { ok: false, message: String(e) };
  }
}
