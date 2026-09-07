import type { TagSlug } from './quiz';
import { TAG_LABELS } from './quiz';

export type ImportedProject = {
  slug: string;
  title: string;
  summary: string;
  category_input: string;   // ยังไม่แปลงเป็น id — ทำใน route เพราะต้องคุยกับ DB
  difficulty: 'easy' | 'medium' | 'hard';
  budget_min: number;
  budget_max: number;
  duration_weeks: number;
  grade_min: number;
  grade_max: number;
  purpose_md: string;
  difficulty_md: string;
  extension_md: string;
  cover_url: string | null;
  steps: { step: number; title: string; detail: string }[];
  materials: { name: string; qty: string; est_price: number }[];
  tags: TagSlug[];
  tags_provided: boolean;    // แถวนี้มีคอลัมน์ tags หรือเปล่า — ว่างเปล่ากับไม่มีคอลัมน์ต้องแยกกัน
};

export type RowIssue = { row: number; field?: string; message: string };
export type ParsedRow = { row: number; data: ImportedProject; warnings: RowIssue[] };
export type ParseOutcome = { ok: ParsedRow[]; failed: RowIssue[] };

const DIFFICULTY_MAP: Record<string, 'easy' | 'medium' | 'hard'> = {
  easy: 'easy', medium: 'medium', hard: 'hard',
  'ง่าย': 'easy', 'ปานกลาง': 'medium', 'ยาก': 'hard',
};

const TAG_TH_TO_SLUG: Record<string, TagSlug> = Object.fromEntries(
  (Object.entries(TAG_LABELS) as [TagSlug, string][]).map(([slug, label]) => [label, slug]),
);

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function truncate(text: string, max: number) {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

/** "หัวข้อ :: รายละเอียด || หัวข้อ2 :: รายละเอียด2" -> ขั้นตอนแบบมีลำดับ */
function parseSteps(raw: string) {
  if (!raw.trim()) return [];
  return raw.split('||').map((s) => s.trim()).filter(Boolean).map((line, i) => {
    const [title, ...rest] = line.split('::');
    return { step: i + 1, title: (title ?? '').trim(), detail: rest.join('::').trim() };
  });
}

/** "ชื่อ | จำนวน | ราคา || ชื่อ2 | จำนวน2 | ราคา2" -> รายการอุปกรณ์ */
function parseMaterials(raw: string) {
  if (!raw.trim()) return [];
  return raw.split('||').map((s) => s.trim()).filter(Boolean).map((line) => {
    const [name, qty, price] = line.split('|').map((p) => p.trim());
    return { name: name ?? '', qty: qty ?? '', est_price: Number(price ?? 0) || 0 };
  });
}

/** "electronics;physics" หรือ "อิเล็กทรอนิกส์;ฟิสิกส์" -> รับได้ทั้งสองแบบ */
function parseTags(raw: string): { tags: TagSlug[]; unknown: string[] } {
  const parts = raw.split(';').map((s) => s.trim()).filter(Boolean);
  const tags: TagSlug[] = [];
  const unknown: string[] = [];
  for (const p of parts) {
    const bySlug = (Object.keys(TAG_LABELS) as TagSlug[]).find((s) => s === p);
    const byLabel = TAG_TH_TO_SLUG[p];
    const match = bySlug ?? byLabel;
    if (match) tags.push(match);
    else unknown.push(p);
  }
  return { tags, unknown };
}

const usedSlugs = new Set<string>();

/** ชนกันเมื่อไหร่ก็ต่อเลขให้ไม่ให้ upsert ทับของแถวอื่นในไฟล์เดียวกันโดยไม่ตั้งใจ */
function dedupeSlug(base: string) {
  let candidate = base || `project-${Date.now()}`;
  let n = 2;
  while (usedSlugs.has(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  usedSlugs.add(candidate);
  return candidate;
}

export function resetSlugTracking() {
  usedSlugs.clear();
}

/**
 * แปลงแถว CSV ดิบให้เป็นข้อมูลโครงงานที่พร้อมเขียนลง DB
 * บังคับกรอกแค่ title, category, purpose_md, extension_md — ที่เหลือมีค่าเริ่มต้นให้
 * เพื่อให้กรอกได้เร็วตอนเตรียมข้อมูลจำนวนมาก แล้วค่อยกลับมาเติมทีหลังได้
 */
export function parseImportRow(raw: Record<string, string>, rowNumber: number): ParsedRow | RowIssue {
  const title = (raw.title ?? '').trim();
  const category_input = (raw.category ?? '').trim();
  const purpose_md = (raw.purpose_md ?? '').trim();
  const extension_md = (raw.extension_md ?? '').trim();

  if (!title) return { row: rowNumber, field: 'title', message: 'ไม่มีชื่อโครงงาน — ข้ามแถวนี้' };
  if (!category_input) return { row: rowNumber, field: 'category', message: 'ไม่ได้ระบุหมวดหมู่ — ข้ามแถวนี้' };
  if (!purpose_md) return { row: rowNumber, field: 'purpose_md', message: 'ไม่ได้กรอก "เอาไว้ทำอะไร" — ข้ามแถวนี้' };
  if (!extension_md) return { row: rowNumber, field: 'extension_md', message: 'ไม่ได้กรอก "จุดที่ควรต่อยอด" — ข้ามแถวนี้' };

  const warnings: RowIssue[] = [];

  let slug = slugify(raw.slug || title);
  if (!raw.slug?.trim()) warnings.push({ row: rowNumber, field: 'slug', message: `ไม่ได้ระบุ slug — ตั้งให้อัตโนมัติเป็น "${slug}"` });
  slug = dedupeSlug(slug);

  const summary = (raw.summary ?? '').trim() || truncate(purpose_md, 140);
  if (!raw.summary?.trim()) warnings.push({ row: rowNumber, field: 'summary', message: 'ไม่ได้กรอกคำโปรย — ใช้ข้อความจาก "เอาไว้ทำอะไร" แทนไปก่อน' });

  const difficultyRaw = (raw.difficulty ?? '').trim().toLowerCase();
  const difficulty = DIFFICULTY_MAP[difficultyRaw] ?? DIFFICULTY_MAP[(raw.difficulty ?? '').trim()];
  if (raw.difficulty?.trim() && !difficulty) {
    return { row: rowNumber, field: 'difficulty', message: `ค่า "${raw.difficulty}" ไม่ใช่ easy/medium/hard หรือ ง่าย/ปานกลาง/ยาก — ข้ามแถวนี้` };
  }
  if (!raw.difficulty?.trim()) warnings.push({ row: rowNumber, field: 'difficulty', message: 'ไม่ได้ระบุความยาก — ตั้งเป็น "ง่าย" ไปก่อน' });

  const budget_min = raw.budget_min?.trim() ? Number(raw.budget_min) : 0;
  const budget_max = raw.budget_max?.trim() ? Number(raw.budget_max) : 0;
  if (!Number.isFinite(budget_min) || !Number.isFinite(budget_max) || budget_min < 0 || budget_max < budget_min) {
    return { row: rowNumber, field: 'budget', message: 'งบต่ำสุด/สูงสุดต้องเป็นตัวเลข และงบสูงสุดต้องไม่น้อยกว่างบต่ำสุด — ข้ามแถวนี้' };
  }

  const duration_weeks = raw.duration_weeks?.trim() ? Number(raw.duration_weeks) : 3;
  if (!Number.isFinite(duration_weeks) || duration_weeks <= 0) {
    return { row: rowNumber, field: 'duration_weeks', message: 'ระยะเวลาต้องเป็นตัวเลขมากกว่า 0 — ข้ามแถวนี้' };
  }
  if (!raw.duration_weeks?.trim()) warnings.push({ row: rowNumber, field: 'duration_weeks', message: 'ไม่ได้ระบุระยะเวลา — ตั้งเป็น 3 สัปดาห์ไปก่อน' });

  const grade_min = raw.grade_min?.trim() ? Number(raw.grade_min) : 7;
  const grade_max = raw.grade_max?.trim() ? Number(raw.grade_max) : 12;
  if (
    !Number.isInteger(grade_min) || !Number.isInteger(grade_max) ||
    grade_min < 4 || grade_max > 12 || grade_max < grade_min
  ) {
    return { row: rowNumber, field: 'grade', message: 'ระดับชั้นต้องเป็น 4–12 (4=ป.4, 12=ม.6) และค่าสูงสุดต้องไม่น้อยกว่าค่าต่ำสุด — ข้ามแถวนี้' };
  }
  if (!raw.grade_min?.trim() || !raw.grade_max?.trim()) {
    warnings.push({ row: rowNumber, field: 'grade', message: 'ไม่ได้ระบุระดับชั้นครบ — ตั้งเป็น ม.1–ม.6 ไปก่อน' });
  }

  const { tags, unknown } = parseTags(raw.tags ?? '');
  if (unknown.length > 0) {
    warnings.push({ row: rowNumber, field: 'tags', message: `ไม่รู้จักแท็ก: ${unknown.join(', ')} — ข้ามแท็กพวกนี้ไป (พิมพ์ผิดหรือใช้ชื่อที่ไม่มีในระบบ)` });
  }
  if (raw.tags?.trim() && tags.length === 0) {
    warnings.push({ row: rowNumber, field: 'tags', message: 'ไม่มีแท็กที่รู้จักเลยในแถวนี้ — แบบทดสอบจะไม่มีวันแนะนำโครงงานนี้' });
  }

  return {
    row: rowNumber,
    warnings,
    data: {
      slug,
      title,
      summary,
      category_input,
      difficulty: difficulty ?? 'easy',
      budget_min,
      budget_max,
      duration_weeks,
      grade_min,
      grade_max,
      purpose_md,
      difficulty_md: (raw.difficulty_md ?? '').trim(),
      extension_md,
      cover_url: raw.cover_url?.trim() || null,
      steps: parseSteps(raw.steps ?? ''),
      materials: parseMaterials(raw.materials ?? ''),
      tags,
      tags_provided: Boolean(raw.tags?.trim()),
    },
  };
}

export function isRowIssue(x: ParsedRow | RowIssue): x is RowIssue {
  return !('data' in x);
}
