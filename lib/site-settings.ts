// site-settings data access — no server actions here (see app/admin/settings/actions.ts)
import { hasSupabase } from './supabase/config';
import { anonClient } from './supabase/server';

export { hasSupabase } from './supabase/config';

export type SettingDef = { key: string; label: string; defaultValue: string };

export const SETTING_DEFS: SettingDef[] = [
  { key: 'footer_tagline',    label: 'คำอธิบายเว็บไซต์ (Footer)',  defaultValue: 'โครงงานทุกเรื่องที่นี่เป็นไอเดียตั้งต้น ไม่ใช่ผลงานสำเร็จรูป' },
  { key: 'footer_author',     label: 'ผู้พัฒนา/ผู้จัดทำ',          defaultValue: '' },
  { key: 'footer_school',     label: 'โรงเรียน/สถาบัน',             defaultValue: '' },
  { key: 'footer_powered_by', label: 'Powered by',                  defaultValue: 'Next.js · Supabase · Vercel' },
];

const TAG = 'site-settings';

export async function getSiteSettings(): Promise<Record<string, string>> {
  const defaults = Object.fromEntries(SETTING_DEFS.map((d) => [d.key, d.defaultValue]));
  if (!hasSupabase) return defaults;
  try {
    const { data } = await anonClient([TAG]).from('site_settings').select('key,value');
    if (!data) return defaults;
    return {
      ...defaults,
      ...Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value])),
    };
  } catch {
    return defaults;
  }
}
