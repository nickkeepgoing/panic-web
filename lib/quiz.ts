// แบบทดสอบ 10 ข้อ
// แบ่งคำถามเป็น 2 ชนิด:
//   interest  -> ให้ "น้ำหนักแท็ก" ไปสะสมเป็นโปรไฟล์ความสนใจ
//   filter    -> เป็นเงื่อนไขตายตัว (งบ/เวลา/ระดับชั้น) ใช้กรองด้วย SQL ก่อนเสมอ
// เหตุผลที่แยก: งบ 300 บาทกับงบ 3,000 บาทไม่ใช่ "ความชอบ" แต่เป็นข้อจำกัด
// ถ้าเอาไปรวมเป็นน้ำหนักแท็ก ระบบจะแนะนำโครงงานที่เด็กทำไม่ได้จริง

export type TagSlug =
  | 'electronics' | 'coding' | 'ai' | 'robotics'
  | 'biology' | 'chemistry' | 'physics'
  | 'environment' | 'agriculture' | 'health'
  | 'social' | 'data' | 'design' | 'craft';

export const TAG_LABELS: Record<TagSlug, string> = {
  electronics: 'อิเล็กทรอนิกส์',
  coding: 'เขียนโปรแกรม',
  ai: 'ปัญญาประดิษฐ์',
  robotics: 'หุ่นยนต์และระบบอัตโนมัติ',
  biology: 'ชีววิทยา',
  chemistry: 'เคมี',
  physics: 'ฟิสิกส์',
  environment: 'สิ่งแวดล้อม',
  agriculture: 'เกษตรและอาหาร',
  health: 'สุขภาพ',
  social: 'สังคมและพฤติกรรม',
  data: 'วิเคราะห์ข้อมูล',
  design: 'ออกแบบและสื่อสาร',
  craft: 'งานประดิษฐ์',
};

type Weights = Partial<Record<TagSlug, number>>;

export type QuizOption = {
  id: string;
  label: string;
  hint?: string;
  weights?: Weights;
  filter?: { budgetMax?: number; weeksMax?: number; gradeBand?: 'primary' | 'lower' | 'upper' };
};

export type QuizQuestion = {
  id: string;
  kind: 'interest' | 'filter';
  question: string;
  helper?: string;
  options: QuizOption[];
};

export const QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    kind: 'filter',
    question: 'ตอนนี้เรียนอยู่ชั้นไหน',
    helper: 'ใช้กรองโครงงานที่ยากหรือง่ายเกินไปออก',
    options: [
      { id: 'q1a', label: 'ประถม (ป.4–ป.6)', filter: { gradeBand: 'primary' } },
      { id: 'q1b', label: 'มัธยมต้น (ม.1–ม.3)', filter: { gradeBand: 'lower' } },
      { id: 'q1c', label: 'มัธยมปลาย (ม.4–ม.6)', filter: { gradeBand: 'upper' } },
    ],
  },
  {
    id: 'q2',
    kind: 'interest',
    question: 'วันหยุดที่ไม่มีอะไรทำ คุณมักจะทำอะไร',
    helper: 'ตอบตามที่ทำจริง ไม่ต้องตอบตามที่ควรจะเป็น',
    options: [
      { id: 'q2a', label: 'รื้อของเล่นหรือเครื่องใช้ในบ้านมาดูข้างใน', weights: { electronics: 0.8, craft: 0.6, robotics: 0.4 } },
      { id: 'q2b', label: 'นั่งหน้าคอม ลองโปรแกรมหรือเกมใหม่ ๆ', weights: { coding: 0.9, ai: 0.5, data: 0.3 } },
      { id: 'q2c', label: 'ออกไปข้างนอก ดูต้นไม้ สัตว์ หรือถ่ายรูปธรรมชาติ', weights: { biology: 0.8, environment: 0.7, agriculture: 0.4 } },
      { id: 'q2d', label: 'วาดรูป ทำคลิป หรือแต่งของให้สวยขึ้น', weights: { design: 0.9, craft: 0.5, social: 0.3 } },
    ],
  },
  {
    id: 'q3',
    kind: 'interest',
    question: 'วิชาไหนที่เรียนแล้วรู้สึกว่า “อันนี้เราไหว”',
    options: [
      { id: 'q3a', label: 'ฟิสิกส์ / คณิตศาสตร์', weights: { physics: 0.9, electronics: 0.4, data: 0.4 } },
      { id: 'q3b', label: 'เคมี', weights: { chemistry: 0.9, environment: 0.3 } },
      { id: 'q3c', label: 'ชีววิทยา', weights: { biology: 0.9, health: 0.4, agriculture: 0.3 } },
      { id: 'q3d', label: 'คอมพิวเตอร์ / เทคโนโลยี', weights: { coding: 0.8, ai: 0.5, robotics: 0.4 } },
    ],
  },
  {
    id: 'q4',
    kind: 'interest',
    question: 'อยากให้ผลงานที่ทำเสร็จออกมาเป็นแบบไหน',
    helper: 'ข้อนี้บอกได้เยอะว่าคุณจะสนุกกับกระบวนการแบบไหน',
    options: [
      { id: 'q4a', label: 'เครื่องที่จับต้องได้ กดแล้วทำงาน', weights: { electronics: 0.8, robotics: 0.7, craft: 0.5 } },
      { id: 'q4b', label: 'แอปหรือเว็บที่เพื่อนเข้ามาลองใช้ได้', weights: { coding: 0.9, design: 0.5, ai: 0.4 } },
      { id: 'q4c', label: 'ผลการทดลองที่มีตัวเลขยืนยันชัด ๆ', weights: { chemistry: 0.6, biology: 0.6, physics: 0.5, data: 0.5 } },
      { id: 'q4d', label: 'ข้อค้นพบเกี่ยวกับคนรอบตัว พร้อมกราฟสรุป', weights: { social: 0.9, data: 0.7 } },
    ],
  },
  {
    id: 'q5',
    kind: 'interest',
    question: 'ปัญหาใกล้ตัวข้อไหนที่คุณอยากแก้มากที่สุด',
    options: [
      { id: 'q5a', label: 'น้ำท่วม น้ำเสีย อากาศเสียในชุมชน', weights: { environment: 0.9, electronics: 0.4, chemistry: 0.3 } },
      { id: 'q5b', label: 'ขยะล้นโรงเรียน แยกขยะไม่ถูก', weights: { environment: 0.8, ai: 0.4, craft: 0.4 } },
      { id: 'q5c', label: 'พืชผักปลูกไม่ขึ้น อาหารเสียเร็ว', weights: { agriculture: 0.9, biology: 0.5, chemistry: 0.3 } },
      { id: 'q5d', label: 'เพื่อนเครียด นอนน้อย ติดหน้าจอ', weights: { health: 0.8, social: 0.7, data: 0.4 } },
    ],
  },
  {
    id: 'q6',
    kind: 'interest',
    question: 'เวลาทำงานกลุ่ม คุณมักได้ทำหน้าที่อะไร',
    options: [
      { id: 'q6a', label: 'ลงมือทำชิ้นงาน ต่อ ตัด ประกอบ', weights: { craft: 0.8, electronics: 0.5, robotics: 0.4 } },
      { id: 'q6b', label: 'จัดการข้อมูล ทำตาราง ทำกราฟ', weights: { data: 0.9, coding: 0.4 } },
      { id: 'q6c', label: 'ออกไปคุยกับคน เก็บแบบสอบถาม', weights: { social: 0.9, health: 0.3 } },
      { id: 'q6d', label: 'ทำสไลด์ โปสเตอร์ และเป็นคนพูดนำเสนอ', weights: { design: 0.9, social: 0.4 } },
    ],
  },
  {
    id: 'q7',
    kind: 'interest',
    question: 'เคยใช้อะไรมาก่อนบ้าง',
    helper: 'เลือกอันที่คุ้นที่สุด ไม่เคยเลยก็ตอบข้อสุดท้ายได้',
    options: [
      { id: 'q7a', label: 'บอร์ด Arduino, micro:bit หรือ ESP32', weights: { electronics: 0.9, robotics: 0.6, coding: 0.4 } },
      { id: 'q7b', label: 'Python, Scratch หรือภาษาโปรแกรมอื่น', weights: { coding: 0.9, ai: 0.5, data: 0.4 } },
      { id: 'q7c', label: 'กล้องจุลทรรศน์ สารเคมี อุปกรณ์ในห้องแล็บ', weights: { chemistry: 0.7, biology: 0.7 } },
      { id: 'q7d', label: 'ยังไม่เคยใช้อะไรเลย อยากเริ่มจากศูนย์', weights: { craft: 0.5, social: 0.4, environment: 0.3 } },
    ],
  },
  {
    id: 'q8',
    kind: 'interest',
    question: 'ชอบทำงานที่ไหนมากกว่ากัน',
    options: [
      { id: 'q8a', label: 'นอกสถานที่ ลงพื้นที่เก็บข้อมูลจริง', weights: { environment: 0.7, biology: 0.5, social: 0.5 } },
      { id: 'q8b', label: 'ในห้องแล็บหรือห้องเรียน ทดลองซ้ำ ๆ', weights: { chemistry: 0.7, biology: 0.5, physics: 0.5 } },
      { id: 'q8c', label: 'ที่โต๊ะทำงาน มีคอมกับอินเทอร์เน็ตก็พอ', weights: { coding: 0.7, ai: 0.5, data: 0.5 } },
      { id: 'q8d', label: 'ที่โรงประดิษฐ์ มีเครื่องมือให้จับ', weights: { craft: 0.8, electronics: 0.5, robotics: 0.5 } },
    ],
  },
  {
    id: 'q9',
    kind: 'filter',
    question: 'งบที่ใช้ได้จริงประมาณเท่าไหร่',
    helper: 'ตอบตามจริง ระบบจะไม่แนะนำของที่เกินงบ',
    options: [
      { id: 'q9a', label: 'ไม่อยากใช้เงินเลย', filter: { budgetMax: 0 } },
      { id: 'q9b', label: 'ไม่เกิน 500 บาท', filter: { budgetMax: 500 } },
      { id: 'q9c', label: 'ประมาณ 500–1,500 บาท', filter: { budgetMax: 1500 } },
      { id: 'q9d', label: 'มากกว่า 1,500 บาทก็ไหว', filter: { budgetMax: 99999 } },
    ],
  },
  {
    id: 'q10',
    kind: 'filter',
    question: 'มีเวลาทำประมาณเท่าไหร่ก่อนต้องส่ง',
    options: [
      { id: 'q10a', label: 'ไม่เกิน 2 สัปดาห์', filter: { weeksMax: 2 } },
      { id: 'q10b', label: 'ประมาณ 1 เดือน', filter: { weeksMax: 4 } },
      { id: 'q10c', label: '2 เดือนขึ้นไป', filter: { weeksMax: 8 } },
      { id: 'q10d', label: 'ยังไม่มีกำหนด', filter: { weeksMax: 99 } },
    ],
  },
];

export type QuizAnswers = Record<string, string>;

export type QuizProfile = {
  tags: { slug: TagSlug; label: string; score: number }[];
  budgetMax: number;
  weeksMax: number;
  gradeBand: 'primary' | 'lower' | 'upper';
};

export function scoreQuiz(answers: QuizAnswers): QuizProfile {
  const raw = {} as Record<TagSlug, number>;
  let budgetMax = 99999;
  let weeksMax = 99;
  let gradeBand: QuizProfile['gradeBand'] = 'lower';

  for (const q of QUIZ) {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (!opt) continue;
    if (opt.filter?.budgetMax !== undefined) budgetMax = opt.filter.budgetMax;
    if (opt.filter?.weeksMax !== undefined) weeksMax = opt.filter.weeksMax;
    if (opt.filter?.gradeBand) gradeBand = opt.filter.gradeBand;
    for (const [slug, w] of Object.entries(opt.weights ?? {})) {
      raw[slug as TagSlug] = (raw[slug as TagSlug] ?? 0) + (w as number);
    }
  }

  // ปรับให้สูงสุด = 100% เพื่อให้แถบความสนใจอ่านง่าย
  const top = Math.max(...Object.values(raw), 1);
  const tags = (Object.entries(raw) as [TagSlug, number][])
    .map(([slug, score]) => ({ slug, label: TAG_LABELS[slug], score: Math.round((score / top) * 100) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return { tags, budgetMax, weeksMax, gradeBand };
}

export const GRADE_RANGE: Record<QuizProfile['gradeBand'], [number, number]> = {
  primary: [4, 6],
  lower: [7, 9],
  upper: [10, 12],
};
