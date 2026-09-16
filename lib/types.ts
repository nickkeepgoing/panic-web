export type Difficulty = 'easy' | 'medium' | 'hard';

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  difficulty: Difficulty;
  budget_min: number;
  budget_max: number;
  duration_weeks: number;
  grade_min: number;
  grade_max: number;
  tags: string[];
  cover_url?: string;
  gallery_urls?: string[];
  purpose_md?: string;
  difficulty_md?: string;
  steps?: { step: number; title: string; detail: string }[];
  materials?: { name: string; qty: string; est_price: number }[];
  extension_md?: string;
  save_count?: number;
};

export type Competition = {
  id: string;
  slug: string;
  name: string;
  organizer: string;
  close_at: string;
  source_url: string;
  cover_url?: string;
};

export const DIFFICULTY_TH: Record<Difficulty, string> = {
  easy: 'ง่าย',
  medium: 'ปานกลาง',
  hard: 'ยาก',
};

export function budgetLabel(min: number, max: number) {
  if (max === 0) return 'ไม่มีค่าใช้จ่าย';
  if (max < 500) return 'ต่ำกว่า 500 บาท';
  return `${min.toLocaleString('th-TH')}–${max.toLocaleString('th-TH')} บาท`;
}

/**
 * materials เก็บใน jsonb จึงไม่มีอะไรบังคับว่า est_price ต้องเป็นตัวเลข
 * แถวที่บันทึกราคาเป็นข้อความ (เช่น "120 บาท") จะกลายเป็น NaN แล้วถูกเขียนลงเป็น null
 * เรียก .toLocaleString กับ null ตรง ๆ = ทั้งหน้าโครงงานพังเป็น 500
 */
export function priceLabel(v: number | null | undefined) {
  if (v == null || !Number.isFinite(v)) return 'ไม่ระบุราคา';
  if (v === 0) return 'ไม่มีค่าใช้จ่าย';
  return `${v.toLocaleString('th-TH')} บาท`;
}

/** "120", "120 บาท", "1,200" -> ตัวเลข — ต้องไม่คืน NaN เพราะ jsonb จะเก็บเป็น null */
export function parsePrice(raw: unknown): number {
  const n = typeof raw === 'number' ? raw : Number(String(raw ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function gradeLabel(min: number, max: number) {
  const one = (g: number) => (g <= 6 ? `ป.${g}` : `ม.${g - 6}`);
  return `${one(min)} – ${one(max)}`;
}

export function daysLeft(dateISO: string) {
  const ms = new Date(dateISO).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}
