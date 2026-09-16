// ---------------------------------------------------------------------
// เครื่องมือแนะนำโครงงาน — ให้คะแนนแบบโปร่งใส 5 ปัจจัย
//
// ไม่ใช่ AI/ML และไม่แอบอ้างว่าเป็น เป็นระบบให้คะแนนตามกฎ (rule-based scoring)
// ที่อธิบายได้ทุกตัวเลข: ผู้ใช้เห็นได้ว่าทำไมโครงงานถึงถูกแนะนำ
//
//   คะแนนรวม = ความสนใจ 30% + งบประมาณ 25% + เวลา 25% + ทักษะ 10% + ความยาก 10%
//
// ต่างจาก lib/match.ts เดิมตรงที่ "ไม่ตัด" โครงงานที่งบ/เวลาไม่พอทิ้ง แต่ให้คะแนน
// ต่ำลงแล้วเสนอวิธีย่อขอบเขตแทน (ดู scopeHint) จึงไม่มีทางเจอหน้าว่างเปล่า
// ---------------------------------------------------------------------
import { GRADE_RANGE, TAG_LABELS, type QuizProfile, type TagSlug } from './quiz';
import { DIFFICULTY_TH, budgetLabel, type Difficulty, type Project } from './types';

export type FactorKey = 'interest' | 'budget' | 'time' | 'skill' | 'difficulty';

export const FACTOR_LABELS: Record<FactorKey, string> = {
  interest: 'ความสนใจ',
  budget: 'งบประมาณ',
  time: 'เวลา',
  skill: 'ทักษะ/อุปกรณ์',
  difficulty: 'ความยาก',
};

/** น้ำหนักแต่ละปัจจัย รวมได้ 1.0 — แก้ที่นี่ที่เดียวถ้าจะปรับสูตร */
export const FACTOR_WEIGHTS: Record<FactorKey, number> = {
  interest: 0.3,
  budget: 0.25,
  time: 0.25,
  skill: 0.1,
  difficulty: 0.1,
};

export type Recommendation = {
  project: Project;
  overall: number; // 0–100
  factors: Record<FactorKey, number>; // แต่ละตัว 0–100
  hits: TagSlug[]; // แท็กความสนใจที่ตรงกัน
  reason: string; // คำอธิบายที่อิงคำตอบจริงของผู้ใช้
  scopeHint?: string; // ข้อเสนอย่อขอบเขต เมื่องบ/เวลาไม่พอ
};

// แท็กที่นับเป็น "ทักษะ/อุปกรณ์" (kind='skill' ใน seed) ใช้แยกปัจจัยทักษะออกจากความสนใจรวม
const SKILL_TAGS = new Set<TagSlug>(['electronics', 'coding', 'ai', 'data', 'design', 'craft']);

// ความเหมาะของความยากต่อระดับชั้น — ป.ต้นควรได้ของง่าย ม.ปลายรับของยากได้
const DIFFICULTY_FIT: Record<QuizProfile['gradeBand'], Record<Difficulty, number>> = {
  primary: { easy: 1.0, medium: 0.55, hard: 0.3 },
  lower: { easy: 0.9, medium: 1.0, hard: 0.6 },
  upper: { easy: 0.75, medium: 0.95, hard: 1.0 },
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const pct = (n: number) => Math.round(clamp01(n) * 100);

/** งบที่ตอบไว้ (budgetMax) เทียบกับราคาสูงสุดของโครงงาน — ยิ่งมีเงินเหลือยิ่งเต็ม */
function budgetFit(userMax: number, p: Project): number {
  if (userMax >= 99999 || p.budget_max <= 0) return 1; // ไม่จำกัดงบ หรือโครงงานฟรี
  return clamp01(userMax / p.budget_max);
}

/** เวลาที่มี (weeksMax) เทียบกับเวลาที่โครงงานต้องใช้ */
function timeFit(userWeeks: number, p: Project): number {
  if (userWeeks >= 99 || p.duration_weeks <= 0) return 1;
  return clamp01(userWeeks / p.duration_weeks);
}

/** ความสนใจ: ผสมแท็กที่ตรงมากที่สุด (60%) กับค่าเฉลี่ยความตรงทั้งหมด (40%) */
function interestFit(userScore: Map<TagSlug, number>, tags: TagSlug[]): number {
  if (tags.length === 0) return 0.4; // โครงงานไม่ได้ระบุแท็ก ให้กลาง ๆ ไม่ลงโทษ
  const scores = tags.map((t) => (userScore.get(t) ?? 0) / 100);
  const max = Math.max(...scores);
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
  return clamp01(max * 0.6 + avg * 0.4);
}

/** ทักษะ/อุปกรณ์: ดูเฉพาะแท็กสายทักษะที่โครงงานต้องใช้ ว่าผู้ใช้เคยเลือกไว้แค่ไหน */
function skillFit(userScore: Map<TagSlug, number>, tags: TagSlug[]): number {
  const needed = tags.filter((t) => SKILL_TAGS.has(t));
  if (needed.length === 0) return 0.7; // ไม่ต้องใช้ทักษะเฉพาะทาง
  const avg = needed.reduce((s, t) => s + (userScore.get(t) ?? 0) / 100, 0) / needed.length;
  return clamp01(Math.max(avg, 0.3)); // ยังไม่มีทักษะก็เรียนรู้ได้ ไม่ให้เป็นศูนย์
}

/** ความยากเทียบระดับชั้น และหักคะแนนถ้าช่วงชั้นของโครงงานไม่คาบเกี่ยวกับผู้ใช้เลย */
function difficultyFit(profile: QuizProfile, p: Project): number {
  const base = DIFFICULTY_FIT[profile.gradeBand][p.difficulty];
  const [gMin, gMax] = GRADE_RANGE[profile.gradeBand];
  const gradeOverlap = p.grade_max >= gMin && p.grade_min <= gMax;
  return clamp01(base * (gradeOverlap ? 1 : 0.4));
}

function score(profile: QuizProfile, p: Project): Recommendation {
  const userScore = new Map<TagSlug, number>(profile.tags.map((t) => [t.slug, t.score]));
  const tags = (p.tags ?? []) as TagSlug[];
  const hits = tags.filter((t) => userScore.has(t));

  const factors: Record<FactorKey, number> = {
    interest: pct(interestFit(userScore, tags)),
    budget: pct(budgetFit(profile.budgetMax, p)),
    time: pct(timeFit(profile.weeksMax, p)),
    skill: pct(skillFit(userScore, tags)),
    difficulty: pct(difficultyFit(profile, p)),
  };

  const overall = Math.round(
    (Object.keys(factors) as FactorKey[]).reduce((sum, k) => sum + factors[k] * FACTOR_WEIGHTS[k], 0),
  );

  return { project: p, overall, factors, hits, reason: buildReason(profile, p, factors, hits), scopeHint: buildScopeHint(profile, p, factors) };
}

/** จัดอันดับโครงงานทั้งหมด — ไม่ตัดทิ้ง คืนเรียงจากคะแนนสูงสุด
 *  เมื่อคะแนนเท่ากัน ให้โครงงานที่ถูกบันทึกมากกว่าได้อันดับสูงกว่า (popularity tiebreaker) */
export function recommend(profile: QuizProfile, projects: Project[], limit = 6): Recommendation[] {
  return projects
    .map((p) => score(profile, p))
    .sort((a, b) => b.overall - a.overall || (b.project.save_count ?? 0) - (a.project.save_count ?? 0))
    .slice(0, limit);
}

/** คำอธิบายเชิงพลวัต — อิงคำตอบจริง ไม่ใช่ข้อความสำเร็จรูป */
function buildReason(profile: QuizProfile, p: Project, f: Record<FactorKey, number>, hits: TagSlug[]): string {
  const parts: string[] = [];

  if (hits.length > 0) {
    const names = hits.slice(0, 2).map((h) => TAG_LABELS[h]).join('และ');
    parts.push(`ตรงกับความสนใจด้าน${names}`);
  }

  if (f.budget >= 90) parts.push(`อยู่ในงบที่ตั้งไว้ (${budgetLabel(p.budget_min, p.budget_max)})`);
  else if (f.budget >= 60) parts.push(`ใช้งบราว ${budgetLabel(p.budget_min, p.budget_max)} ซึ่งใกล้เคียงกับที่มี`);
  else parts.push(`ใช้งบ ${budgetLabel(p.budget_min, p.budget_max)} ซึ่งเกินงบที่ตอบไว้`);

  if (f.time >= 90) parts.push(`ทำเสร็จได้ใน ${p.duration_weeks} สัปดาห์ ทันเวลาที่มี`);
  else parts.push(`ต้องใช้เวลาราว ${p.duration_weeks} สัปดาห์ มากกว่าที่ระบุไว้`);

  if (f.difficulty >= 85) parts.push(`ความยากระดับ${DIFFICULTY_TH[p.difficulty]} เหมาะกับระดับชั้น`);

  // ขึ้นต้นด้วยเหตุผลเด่นสุด แล้วต่อด้วยที่เหลือคั่นด้วยจุด
  return `แนะนำเพราะ${parts.join(' · ')}`;
}

/** ข้อเสนอย่อขอบเขต (MVP) เมื่อโครงงานเกินงบหรือเกินเวลาที่ผู้ใช้มี */
function buildScopeHint(profile: QuizProfile, p: Project, f: Record<FactorKey, number>): string | undefined {
  const tips: string[] = [];
  if (f.time < 70 && profile.weeksMax < 99) {
    tips.push(`ทำเป็นเวอร์ชันเล็กก่อน เช่น ลดจำนวนการทดลองหรือฟีเจอร์ลง ให้จบใน ${profile.weeksMax} สัปดาห์`);
  }
  if (f.budget < 70 && profile.budgetMax < 99999) {
    tips.push(`เลือกอุปกรณ์รุ่นประหยัดหรือใช้ของที่มีอยู่แล้ว เพื่อคุมงบไม่ให้เกิน ${profile.budgetMax.toLocaleString('th-TH')} บาท`);
  }
  return tips.length ? tips.join(' และ') : undefined;
}

// ---------------------------------------------------------------------
// self-check — รันด้วย: node --experimental-strip-types (หรือ tsc แล้ว node)
// ยืนยันพฤติกรรมหลักว่าไม่พังเวลาแก้สูตร
// ---------------------------------------------------------------------
export function demo(): void {
  const assert = (cond: boolean, msg: string) => {
    if (!cond) throw new Error(`recommend.demo ล้มเหลว: ${msg}`);
  };

  const base = (over: Partial<Project>): Project => ({
    id: 'x', slug: 'x', title: 'x', summary: '', category: 'เทคโนโลยี', difficulty: 'medium',
    budget_min: 500, budget_max: 1000, duration_weeks: 4, grade_min: 7, grade_max: 12, tags: ['coding'],
    ...over,
  });

  const profile: QuizProfile = {
    tags: [{ slug: 'coding', label: 'เขียนโปรแกรม', score: 100 }],
    budgetMax: 1000, weeksMax: 4, gradeBand: 'upper',
  };

  const cheapFast = score(profile, base({ budget_max: 800, duration_weeks: 3 }));
  const priceySlow = score(profile, base({ budget_max: 5000, duration_weeks: 12 }));

  assert(cheapFast.overall > priceySlow.overall, 'โครงงานที่พองบพอเวลา ต้องได้คะแนนสูงกว่า');
  assert(priceySlow.factors.budget < cheapFast.factors.budget, 'งบเกินต้องได้ budget fit ต่ำกว่า');
  assert(!!priceySlow.scopeHint, 'โครงงานที่เกินงบ/เวลาต้องมีข้อเสนอย่อขอบเขต');
  assert(cheapFast.factors.interest === 100, 'แท็กตรงเต็ม ความสนใจต้องเป็น 100');

  const noInterest = score({ ...profile, tags: [] }, base({ tags: ['biology'] }));
  assert(noInterest.factors.interest < cheapFast.factors.interest, 'ไม่ตรงความสนใจต้องได้คะแนนต่ำกว่า');

  const list = recommend(profile, [base({ budget_max: 800, duration_weeks: 3 }), base({ budget_max: 5000, duration_weeks: 12 })]);
  assert(list[0].overall >= list[1].overall, 'ผลลัพธ์ต้องเรียงจากคะแนนมากไปน้อย');

  console.log('recommend.demo ผ่านทุกข้อ ✓');
}
