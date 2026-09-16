// Career data access — Supabase + sample fallback (same pattern as lib/data.ts)
import { hasSupabase } from './supabase/config';
import { anonClient } from './supabase/server';

export type CareerCategory = {
  id: number;
  slug: string;
  name_th: string;
  color: string;   // hex color
  sort_order: number;
};

export type Career = {
  id: string;
  slug: string;
  name_th: string;
  name_en: string;
  category_id: number;
  category?: CareerCategory;
  description_th: string;
  education_hint_th?: string;
  skills_th: string[];
  dim_tech: number;
  dim_science: number;
  dim_creative: number;
  dim_helping: number;
  dim_business: number;
  dim_nature: number;
  dim_data: number;
  dim_law: number;
  dim_craft: number;
  dim_media: number;
  related_project_tags: string[];
  grade_min: number;
  grade_max: number;
};

// ─── Sample data for offline dev ───────────────────────────────────────────

export const SAMPLE_CAREER_CATEGORIES: CareerCategory[] = [
  { id: 1, slug: 'tech',        name_th: 'เทคโนโลยีและคอมพิวเตอร์', color: '#0A7EA4', sort_order: 1 },
  { id: 2, slug: 'healthcare',  name_th: 'สุขภาพและการแพทย์',        color: '#0F7A55', sort_order: 2 },
  { id: 3, slug: 'science',     name_th: 'วิทยาศาสตร์และการวิจัย',   color: '#5B3FD6', sort_order: 3 },
  { id: 4, slug: 'arts',        name_th: 'ศิลปะ ดีไซน์ และสื่อ',     color: '#C22367', sort_order: 4 },
  { id: 5, slug: 'business',    name_th: 'ธุรกิจและการเงิน',          color: '#B35A00', sort_order: 5 },
  { id: 6, slug: 'engineering', name_th: 'วิศวกรรมและช่าง',           color: '#6B4500', sort_order: 6 },
  { id: 7, slug: 'social',      name_th: 'สังคมและการบริการ',          color: '#A32E86', sort_order: 7 },
];

export const SAMPLE_CAREERS: Career[] = [
  {
    id: 's1', slug: 'software-engineer', name_th: 'วิศวกรซอฟต์แวร์', name_en: 'Software Engineer',
    category_id: 1, description_th: 'สร้างโปรแกรม แอป และระบบซอฟต์แวร์ที่ผู้คนนับล้านใช้งานทุกวัน',
    education_hint_th: 'คณะวิศวกรรมศาสตร์ (คอมพิวเตอร์) หรือวิทยาการคอมพิวเตอร์',
    skills_th: ['เขียนโปรแกรม', 'แก้ปัญหา', 'คิดวิเคราะห์'],
    dim_tech: 10, dim_science: 5, dim_creative: 6, dim_helping: 3, dim_business: 4,
    dim_nature: 0, dim_data: 8, dim_law: 2, dim_craft: 4, dim_media: 2,
    related_project_tags: ['coding', 'ai', 'data', 'electronics'], grade_min: 7, grade_max: 12,
  },
  {
    id: 's2', slug: 'doctor', name_th: 'แพทย์', name_en: 'Doctor',
    category_id: 2, description_th: 'วินิจฉัย รักษาโรค และดูแลสุขภาพของผู้ป่วย',
    education_hint_th: 'คณะแพทยศาสตร์ (6 ปี)',
    skills_th: ['วิทยาศาสตร์', 'การดูแลผู้ป่วย', 'ตัดสินใจรวดเร็ว'],
    dim_tech: 5, dim_science: 10, dim_creative: 4, dim_helping: 10, dim_business: 3,
    dim_nature: 3, dim_data: 7, dim_law: 5, dim_craft: 6, dim_media: 3,
    related_project_tags: ['biology', 'chemistry', 'health', 'physics'], grade_min: 7, grade_max: 12,
  },
  {
    id: 's3', slug: 'graphic-designer', name_th: 'นักออกแบบกราฟิก', name_en: 'Graphic Designer',
    category_id: 4, description_th: 'สร้างสรรค์งานภาพ โลโก้ และสื่อดิจิทัลที่สื่อสารข้อความได้อย่างมีพลัง',
    education_hint_th: 'คณะสถาปัตยกรรมศาสตร์ (ออกแบบนิเทศศิลป์)',
    skills_th: ['ออกแบบ', 'ความคิดสร้างสรรค์', 'ซอฟต์แวร์กราฟิก'],
    dim_tech: 6, dim_science: 2, dim_creative: 10, dim_helping: 4, dim_business: 5,
    dim_nature: 2, dim_data: 4, dim_law: 1, dim_craft: 7, dim_media: 8,
    related_project_tags: ['design', 'coding'], grade_min: 4, grade_max: 12,
  },
  {
    id: 's4', slug: 'teacher', name_th: 'ครู/อาจารย์', name_en: 'Teacher',
    category_id: 7, description_th: 'ถ่ายทอดความรู้ สร้างแรงบันดาลใจ และเป็นแบบอย่างที่ดีให้กับนักเรียน',
    education_hint_th: 'คณะศึกษาศาสตร์ หรือครุศาสตร์ (5 ปี)',
    skills_th: ['สื่อสาร', 'อดทน', 'ใส่ใจผู้อื่น'],
    dim_tech: 4, dim_science: 5, dim_creative: 7, dim_helping: 9, dim_business: 3,
    dim_nature: 3, dim_data: 5, dim_law: 4, dim_craft: 4, dim_media: 8,
    related_project_tags: ['social', 'health', 'environment'], grade_min: 4, grade_max: 12,
  },
  {
    id: 's5', slug: 'robotics-engineer', name_th: 'วิศวกรหุ่นยนต์', name_en: 'Robotics Engineer',
    category_id: 6, description_th: 'สร้างและโปรแกรมหุ่นยนต์และระบบอัตโนมัติ',
    education_hint_th: 'คณะวิศวกรรมศาสตร์ (หุ่นยนต์/คอมพิวเตอร์)',
    skills_th: ['หุ่นยนต์', 'โปรแกรมมิ่ง', 'ฟิสิกส์'],
    dim_tech: 10, dim_science: 9, dim_creative: 6, dim_helping: 3, dim_business: 3,
    dim_nature: 2, dim_data: 7, dim_law: 2, dim_craft: 8, dim_media: 2,
    related_project_tags: ['robotics', 'electronics', 'coding', 'physics'], grade_min: 4, grade_max: 12,
  },
  {
    id: 's6', slug: 'entrepreneur', name_th: 'ผู้ประกอบการ', name_en: 'Entrepreneur',
    category_id: 5, description_th: 'สร้างธุรกิจจากศูนย์ และสร้างคุณค่าให้กับสังคม',
    education_hint_th: 'คณะบริหารธุรกิจ หรือวิศวกรรมศาสตร์',
    skills_th: ['ความคิดสร้างสรรค์', 'ความเสี่ยง', 'บริหาร'],
    dim_tech: 5, dim_science: 3, dim_creative: 8, dim_helping: 4, dim_business: 10,
    dim_nature: 2, dim_data: 7, dim_law: 5, dim_craft: 4, dim_media: 6,
    related_project_tags: ['social', 'data', 'design', 'coding'], grade_min: 7, grade_max: 12,
  },
  {
    id: 's7', slug: 'environmental-scientist', name_th: 'นักวิทยาศาสตร์สิ่งแวดล้อม', name_en: 'Environmental Scientist',
    category_id: 3, description_th: 'ศึกษาและแก้ปัญหาสิ่งแวดล้อม ตั้งแต่มลพิษจนถึงสภาพภูมิอากาศ',
    education_hint_th: 'คณะวิทยาศาสตร์ (สิ่งแวดล้อม) หรือวิศวกรรมสิ่งแวดล้อม',
    skills_th: ['สิ่งแวดล้อม', 'วิเคราะห์', 'ภาคสนาม'],
    dim_tech: 4, dim_science: 9, dim_creative: 4, dim_helping: 5, dim_business: 2,
    dim_nature: 10, dim_data: 7, dim_law: 4, dim_craft: 4, dim_media: 4,
    related_project_tags: ['environment', 'biology', 'chemistry', 'data'], grade_min: 4, grade_max: 12,
  },
];

// ─── Data access ─────────────────────────────────────────────────────────────

function logFallback(where: string, error: unknown) {
  console.error(`[career-data] ${where} ต่อ Supabase ไม่ได้ ใช้ข้อมูลตัวอย่างแทน:`, error);
}

export async function getCareerCategories(): Promise<CareerCategory[]> {
  if (!hasSupabase) return SAMPLE_CAREER_CATEGORIES;
  try {
    const { data, error } = await anonClient()
      .from('career_categories')
      .select('*')
      .order('sort_order');
    if (error || !data) { logFallback('getCareerCategories', error); return SAMPLE_CAREER_CATEGORIES; }
    return data as CareerCategory[];
  } catch (e) {
    logFallback('getCareerCategories', e);
    return SAMPLE_CAREER_CATEGORIES;
  }
}

export async function getCareers(): Promise<Career[]> {
  if (!hasSupabase) return SAMPLE_CAREERS;
  try {
    const { data, error } = await anonClient()
      .from('careers')
      .select('*, career_categories(id,slug,name_th,color,sort_order)')
      .eq('status', 'published')
      .order('sort_order');
    if (error || !data) { logFallback('getCareers', error); return SAMPLE_CAREERS; }
    // flatten category join
    return data.map((row: Record<string, unknown>) => ({
      ...row,
      category: row.career_categories,
    })) as Career[];
  } catch (e) {
    logFallback('getCareers', e);
    return SAMPLE_CAREERS;
  }
}
