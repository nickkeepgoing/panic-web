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
  purpose_md?: string;
  difficulty_md?: string;
  steps?: { step: number; title: string; detail: string }[];
  materials?: { name: string; qty: string; est_price: number }[];
  extension_md?: string;
};

export type Competition = {
  id: string;
  slug: string;
  name: string;
  organizer: string;
  close_at: string;
  source_url: string;
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

export function gradeLabel(min: number, max: number) {
  const one = (g: number) => (g <= 6 ? `ป.${g}` : `ม.${g - 6}`);
  return `${one(min)} – ${one(max)}`;
}

export function daysLeft(dateISO: string) {
  const ms = new Date(dateISO).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}
