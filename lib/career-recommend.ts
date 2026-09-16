// Career matching — dot-product similarity ระหว่าง profile กับ career dimensions
// โปร่งใส: แต่ละ match รู้ว่า dimension ไหนขับเคลื่อน

import { ALL_DIMS, type CareerQuizProfile, type DimSlug } from './career-quiz';
import type { Career } from './career-data';

export type CareerMatch = {
  career: Career;
  score: number;     // 0–100
  topDims: DimSlug[]; // 2–3 dimension ที่ขับเคลื่อนผลลัพธ์
};

/** คะแนนความคล้ายคลึง: dot product ของ profile (0-100) × career dim (0-10) */
function scoreCareer(profile: CareerQuizProfile, career: Career): number {
  let sum = 0;
  let maxPossible = 0;

  for (const dim of ALL_DIMS) {
    const profileVal = (profile.dims.get(dim) ?? 0) / 100; // 0-1
    const careerVal = career[`dim_${dim}` as keyof Career] as number / 10; // 0-1
    sum += profileVal * careerVal;
    maxPossible += careerVal;
  }

  if (maxPossible === 0) return 0;
  return Math.round((sum / maxPossible) * 100);
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
