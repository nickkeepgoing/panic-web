export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ยังไม่ได้ตั้งค่า Supabase ก็รันเว็บได้ ระบบจะใช้ข้อมูลตัวอย่างใน lib/data.ts แทน
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
