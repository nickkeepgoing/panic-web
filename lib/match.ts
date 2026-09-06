import { GRADE_RANGE, TAG_LABELS, type QuizProfile, type TagSlug } from './quiz';
import { DIFFICULTY_TH, budgetLabel, type Project } from './types';

export type Match = { project: Project; score: number; hits: TagSlug[]; reason: string };

/**
 * ชั้น 1 — กรองด้วยเงื่อนไขตายตัว (ระดับชั้น งบ เวลา)
 * ชั้น 2 — ให้คะแนนตามน้ำหนักแท็กที่ทับกัน
 * ชั้น 3 (ทางเลือก) — ให้ LLM เขียนเหตุผล ดู lib/llm.ts
 */
export function rankProjects(profile: QuizProfile, projects: Project[], limit = 5): Match[] {
  const [gMin, gMax] = GRADE_RANGE[profile.gradeBand];
  const weights = new Map<TagSlug, number>(profile.tags.map((t) => [t.slug, t.score]));

  return projects
    .filter((p) => p.grade_max >= gMin && p.grade_min <= gMax)
    .filter((p) => p.budget_min <= profile.budgetMax)
    .filter((p) => p.duration_weeks <= profile.weeksMax)
    .map((p) => {
      const hits = (p.tags ?? []).filter((t) => weights.has(t as TagSlug)) as TagSlug[];
      const score = hits.reduce((sum, t) => sum + (weights.get(t) ?? 0), 0);
      return { project: p, score, hits, reason: fallbackReason(p, hits) };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** ใช้เมื่อไม่ได้ตั้งค่า LLM หรือเรียก API ไม่สำเร็จ — เว็บต้องใช้งานได้เสมอ */
export function fallbackReason(p: Project, hits: TagSlug[]) {
  const interests = hits.slice(0, 2).map((h) => TAG_LABELS[h]).join('และ');
  return `คุณตอบว่าสนใจ${interests || 'หัวข้อนี้'} และโครงงานนี้ใช้งบ${budgetLabel(p.budget_min, p.budget_max)} ทำเสร็จใน ${p.duration_weeks} สัปดาห์ ระดับ${DIFFICULTY_TH[p.difficulty]}`;
}
