// Career matching — dot-product similarity ระหว่าง profile กับ career dimensions
// โปร่งใส: แต่ละ match รู้ว่า dimension ไหนขับเคลื่อน

import { ALL_DIMS, type CareerQuizProfile, type DimSlug } from './career-quiz';
import type { Career } from './career-data';

export type CareerMatch = {
  career: Career;
  score: number;     // 0–100
  topDims: DimSlug[]; // 2–3 dimension ที่ขับเคลื่อนผลลัพธ์
};

/**
 * คะแนนความเหมาะสม: Pearson correlation ระหว่าง "รูปทรง" ความสนใจของผู้ใช้กับของอาชีพ
 * r = 1 → มิติที่เด่น/ด้อยตรงกันหมด, r = 0 → ไม่สัมพันธ์, r = -1 → ตรงข้าม
 * แปลงเป็น 0–100 ด้วย (r + 1) / 2 — อาชีพที่ตรงจริงได้ ~70–95%
 * (สูตรเดิม dot product ÷ ผลรวม ให้ทุกอาชีพ ~17–23% เพราะคำตอบกระจายหลายมิติ)
 */
function scoreCareer(profile: CareerQuizProfile, career: Career): number {
  const p = ALL_DIMS.map((d) => profile.dims.get(d) ?? 0);
  const c = ALL_DIMS.map((d) => career[`dim_${d}` as keyof Career] as number);
  const mp = p.reduce((s, x) => s + x, 0) / p.length;
  const mc = c.reduce((s, x) => s + x, 0) / c.length;

  let cov = 0, vp = 0, vc = 0;
  for (let i = 0; i < p.length; i++) {
    cov += (p[i] - mp) * (c[i] - mc);
    vp += (p[i] - mp) ** 2;
    vc += (c[i] - mc) ** 2;
  }
  const r = vp && vc ? cov / Math.sqrt(vp * vc) : 0;
  return Math.round(((r + 1) / 2) * 100);
}

/** หา dim ที่ทั้ง career สูง (≥7) และ profile สูง (≥40) — เหตุผลจริงของ match */
function topDims(profile: CareerQuizProfile, career: Career): DimSlug[] {
  return ALL_DIMS
    .filter((d) => {
      const careerVal = career[`dim_${d}` as keyof Career] as number;
      const profileVal = profile.dims.get(d) ?? 0;
      return careerVal >= 7 && profileVal >= 40;
    })
    .sort((a, b) => {
      const careerA = career[`dim_${a}` as keyof Career] as number;
      const careerB = career[`dim_${b}` as keyof Career] as number;
      return careerB - careerA;
    })
    .slice(0, 3);
}

/**
 * เรียง careers จากที่เหมาะสมที่สุด ไม่ตัดทิ้ง เพื่อไม่ให้ผลลัพธ์ว่างเปล่า
 * careers นอก grade range ได้ penalty ×0.5 แต่ยังแสดง
 */
export function recommendCareers(
  profile: CareerQuizProfile,
  careers: Career[],
  limit = 5,
): CareerMatch[] {
  const GRADE_BAND_RANGE: Record<string, [number, number]> = {
    primary: [1, 6],
    lower:   [7, 9],
    upper:   [10, 12],
  };

  const [gMin, gMax] = GRADE_BAND_RANGE[profile.gradeBand] ?? [1, 12];

  return careers
    .map((career) => {
      let score = scoreCareer(profile, career);
      // penalty สำหรับ careers ที่ grade range ไม่คาบเกี่ยว
      const gradeOverlap = career.grade_max >= gMin && career.grade_min <= gMax;
      if (!gradeOverlap) score = Math.round(score * 0.5);
      return { career, score, topDims: topDims(profile, career) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
