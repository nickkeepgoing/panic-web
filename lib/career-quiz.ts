// Career & Interest Discovery Quiz — 12 ข้อ
// ออกแบบให้ทำได้ตั้งแต่ ป.1 ถึง ม.6 คำถามใช้ภาษาเรียบง่าย
//
// มี 2 ประเภท:
//   filter   → Q1 (ระดับชั้น) กำหนด gradeBand ซึ่งใช้ filter careers
//   interest → Q2-Q12 สะสม dimension weights แล้ว normalize เป็น 0-100

export type DimSlug =
  | 'tech'      // เทคโนโลยี
  | 'science'   // วิทยาศาสตร์
  | 'creative'  // ความคิดสร้างสรรค์
  | 'helping'   // การช่วยเหลือดูแล
  | 'business'  // ธุรกิจและบริหาร
  | 'nature'    // ธรรมชาติสิ่งแวดล้อม
  | 'data'      // ข้อมูลและตัวเลข
  | 'law'       // กฎระเบียบและสังคม
  | 'craft'     // งานช่างและฝีมือ
  | 'media';    // สื่อและการสื่อสาร

export const DIM_LABELS: Record<DimSlug, string> = {
  tech:     'เทคโนโลยี',
  science:  'วิทยาศาสตร์',
  creative: 'ความคิดสร้างสรรค์',
  helping:  'การดูแลช่วยเหลือ',
  business: 'ธุรกิจและบริหาร',
  nature:   'ธรรมชาติ',
  data:     'ข้อมูลและตัวเลข',
  law:      'กฎหมายและสังคม',
  craft:    'งานช่างและฝีมือ',
  media:    'สื่อและการสื่อสาร',
};

export const ALL_DIMS: DimSlug[] = Object.keys(DIM_LABELS) as DimSlug[];

export type GradeBand = 'primary' | 'lower' | 'upper';

export type CareerQuizProfile = {
  dims: Map<DimSlug, number>; // 0–100 normalized
  gradeBand: GradeBand;
};

export type CareerQuizAnswers = Record<string, string>; // question_id → option_id

type WeightMap = Partial<Record<DimSlug, number>>;

type CareerQuizOption = {
  id: string;
  label: string;
  hint?: string;
  weights?: WeightMap;
  gradeBand?: GradeBand; // สำหรับ filter question เท่านั้น
};

type CareerQuizQuestion = {
  id: string;
  kind: 'filter' | 'interest';
  question: string;
  helper?: string;
  options: CareerQuizOption[];
};

export const CAREER_QUIZ: CareerQuizQuestion[] = [
  // ─── Q1: Grade band (filter) ──────────────────────────────────────
  {
    id: 'grade',
    kind: 'filter',
    question: 'ตอนนี้เรียนอยู่ชั้นไหน?',
    options: [
      { id: 'primary',  label: 'ป.1 – ป.3',  hint: 'ประถมต้น',    gradeBand: 'primary' },
      { id: 'primary4', label: 'ป.4 – ป.6',  hint: 'ประถมปลาย',   gradeBand: 'primary' },
      { id: 'lower',    label: 'ม.1 – ม.3',  hint: 'มัธยมต้น',    gradeBand: 'lower' },
      { id: 'upper',    label: 'ม.4 – ม.6',  hint: 'มัธยมปลาย',   gradeBand: 'upper' },
    ],
  },

  // ─── Q2: กิจกรรมวันหยุด ─────────────────────────────────────────
  {
    id: 'hobby',
    kind: 'interest',
    question: 'ถ้าวันนี้ไม่ต้องเรียน คุณอยากทำอะไรมากที่สุด?',
    options: [
      { id: 'hobby-art',   label: 'วาดรูป ทำงานศิลปะ หรือเล่นดนตรี',       weights: { creative: 3, media: 2 } },
      { id: 'hobby-tech',  label: 'ทดลองต่อวงจร เขียนโปรแกรม หรือซ่อมอุปกรณ์', weights: { tech: 2, craft: 2, science: 2 } },
      { id: 'hobby-out',   label: 'เล่นกีฬา ออกกำลังกาย หรืออยู่กลางแจ้ง',   weights: { craft: 2, nature: 2, helping: 1 } },
      { id: 'hobby-read',  label: 'อ่านหนังสือ ดูวิดีโอ หรือค้นหาความรู้ใหม่', weights: { science: 2, data: 2, media: 1 } },
    ],
  },

  // ─── Q3: รูปแบบการทำงาน ─────────────────────────────────────────
  {
    id: 'workstyle',
    kind: 'interest',
    question: 'คุณชอบทำงานแบบไหนมากกว่า?',
    options: [
      { id: 'ws-alone',  label: 'ทำคนเดียว ได้คิดและทำในแบบของตัวเอง',       weights: { data: 2, science: 2, tech: 1 } },
      { id: 'ws-small',  label: 'ทำกับกลุ่มเล็ก ๆ ที่ไว้ใจกันได้',           weights: { helping: 2, creative: 1, craft: 1 } },
      { id: 'ws-many',   label: 'ทำงานกับคนเยอะ ๆ และชอบพบปะผู้คน',         weights: { media: 2, business: 2, helping: 1 } },
      { id: 'ws-tool',   label: 'ทำงานกับเครื่องมือ อุปกรณ์ หรือสิ่งของ',    weights: { craft: 3, tech: 2, science: 1 } },
    ],
  },

  // ─── Q4: วิชาที่ถนัด ─────────────────────────────────────────────
  {
    id: 'subject',
    kind: 'interest',
    question: 'วิชาในโรงเรียนที่รู้สึกสนุกหรือทำได้ดีที่สุดคือวิชาอะไร?',
    options: [
      { id: 'sub-sci',  label: 'คณิตศาสตร์ หรือวิทยาศาสตร์',                 weights: { science: 3, data: 2, tech: 1 } },
      { id: 'sub-art',  label: 'ศิลปะ ดนตรี หรือพลศึกษา',                    weights: { creative: 3, media: 1, craft: 2 } },
      { id: 'sub-lang', label: 'ภาษา หรือสังคมศึกษา',                         weights: { media: 2, law: 2, business: 1, helping: 1 } },
      { id: 'sub-comp', label: 'คอมพิวเตอร์ หรืองานฝีมือ',                    weights: { tech: 3, craft: 2, data: 1 } },
    ],
  },

  // ─── Q5: ปัญหาที่อยากแก้ ────────────────────────────────────────
  {
    id: 'problem',
    kind: 'interest',
    question: 'ถ้าเลือกได้ คุณอยากช่วยแก้ปัญหาเรื่องอะไรในชุมชน?',
    options: [
      { id: 'prob-env',    label: 'สิ่งแวดล้อมและขยะ',                         weights: { nature: 3, science: 2, craft: 1 } },
      { id: 'prob-health', label: 'สุขภาพของคนในชุมชน',                        weights: { helping: 3, science: 2, data: 1 } },
      { id: 'prob-law',    label: 'ความปลอดภัยและกฎระเบียบ',                  weights: { law: 3, craft: 1, data: 1 } },
      { id: 'prob-edu',    label: 'การศึกษาและโอกาสของเด็ก',                   weights: { helping: 2, media: 2, business: 1 } },
    ],
  },

  // ─── Q6: ความสุขมาจากไหน ────────────────────────────────────────
  {
    id: 'satisfaction',
    kind: 'interest',
    question: 'คุณรู้สึกภูมิใจหรือมีความสุขมากที่สุดเมื่อ...',
    options: [
      { id: 'sat-help',    label: 'ทำให้คนอื่นรู้สึกดีขึ้น หรือช่วยแก้ปัญหาให้ใครสักคน', weights: { helping: 3, media: 1 } },
      { id: 'sat-make',    label: 'สร้างหรือประดิษฐ์บางอย่างด้วยมือตัวเอง',              weights: { craft: 3, creative: 2, tech: 1 } },
      { id: 'sat-data',    label: 'วิเคราะห์ข้อมูลหรือค้นพบคำตอบที่ซ่อนอยู่',           weights: { data: 3, science: 2, tech: 1 } },
      { id: 'sat-show',    label: 'นำเสนอ แสดง หรือสร้างผลงานให้คนอื่นเห็น',            weights: { media: 3, creative: 2, business: 1 } },
    ],
  },

  // ─── Q7: เนื้อหาที่ติดตาม ────────────────────────────────────────
  {
    id: 'content',
    kind: 'interest',
    question: 'เวลาดูวิดีโอออนไลน์หรืออ่านข่าว คุณสนใจเรื่องอะไรมากที่สุด?',
    options: [
      { id: 'con-tech',    label: 'เทคโนโลยีใหม่ ๆ AI หรือการประดิษฐ์',         weights: { tech: 3, data: 2, science: 1 } },
      { id: 'con-sci',     label: 'การค้นพบทางวิทยาศาสตร์และธรรมชาติ',          weights: { science: 3, nature: 2, data: 1 } },
      { id: 'con-biz',     label: 'ข่าวธุรกิจ การลงทุน หรือสตาร์ทอัป',          weights: { business: 3, data: 2, law: 1 } },
      { id: 'con-art',     label: 'ศิลปะ แฟชั่น เพลง หรือวัฒนธรรม',             weights: { creative: 3, media: 2 } },
    ],
  },

  // ─── Q8: ประเมินตัวเอง ───────────────────────────────────────────
  {
    id: 'selfview',
    kind: 'interest',
    question: 'คุณมองว่าตัวเองเป็นคนแบบไหน?',
    options: [
      { id: 'sv-logic',  label: 'ชอบคิดวิเคราะห์ หาเหตุผล และแก้ปัญหา',       weights: { data: 2, science: 2, law: 2 } },
      { id: 'sv-create', label: 'ชอบลองสิ่งใหม่ คิดนอกกรอบ และแสดงออก',       weights: { creative: 3, tech: 1, media: 1 } },
      { id: 'sv-care',   label: 'ใส่ใจคนรอบข้าง ชอบช่วยเหลือและรับฟัง',       weights: { helping: 3, media: 1, business: 1 } },
      { id: 'sv-do',     label: 'ชอบลงมือทำมากกว่าพูด ชอบทำงานจริงจัง',       weights: { craft: 3, tech: 2, nature: 1 } },
    ],
  },

  // ─── Q9: สภาพแวดล้อมการทำงาน ─────────────────────────────────────
  {
    id: 'workplace',
    kind: 'interest',
    question: 'ถ้าเลือกได้ คุณอยากทำงานในสภาพแวดล้อมแบบไหน?',
    options: [
      { id: 'wp-office',  label: 'สำนักงานหรือหน้าคอมพิวเตอร์',                weights: { tech: 2, data: 2, business: 1, law: 1 } },
      { id: 'wp-hosp',    label: 'โรงพยาบาล คลินิก หรือสถานที่ดูแลสุขภาพ',     weights: { helping: 3, science: 2 } },
      { id: 'wp-out',     label: 'กลางแจ้งหรือในธรรมชาติ',                      weights: { nature: 3, craft: 2, science: 1 } },
      { id: 'wp-studio',  label: 'สตูดิโอ ห้องทดลอง หรือพื้นที่สร้างสรรค์',    weights: { creative: 3, craft: 2, tech: 1, science: 1 } },
    ],
  },

  // ─── Q10: ทักษะที่อยากพัฒนา ─────────────────────────────────────
  {
    id: 'skills',
    kind: 'interest',
    question: 'ทักษะไหนที่คุณอยากพัฒนาหรือเรียนรู้มากที่สุดในอนาคต?',
    options: [
      { id: 'sk-tech',    label: 'การเขียนโปรแกรม เทคโนโลยี หรือ AI',           weights: { tech: 3, data: 2 } },
      { id: 'sk-science', label: 'วิทยาศาสตร์การแพทย์หรือสิ่งแวดล้อม',          weights: { science: 3, helping: 2 } },
      { id: 'sk-biz',     label: 'ธุรกิจ การสื่อสาร หรือการนำเสนอ',              weights: { business: 3, media: 2, law: 1 } },
      { id: 'sk-art',     label: 'ศิลปะ ดีไซน์ หรืองานช่าง',                    weights: { creative: 3, craft: 2, media: 1 } },
    ],
  },

  // ─── Q11: ช่วยเพื่อนเรื่องอะไร ──────────────────────────────────
  {
    id: 'strength',
    kind: 'interest',
    question: 'ถ้าเพื่อนขอความช่วยเหลือ คุณถนัดช่วยเรื่องอะไรที่สุด?',
    options: [
      { id: 'str-tech',    label: 'แก้ปัญหาคอมพิวเตอร์หรืออุปกรณ์',            weights: { tech: 3, craft: 2 } },
      { id: 'str-care',    label: 'ฟังปัญหาและให้คำแนะนำ',                      weights: { helping: 3, media: 1 } },
      { id: 'str-design',  label: 'ออกแบบหรือตกแต่งงาน',                        weights: { creative: 3, media: 2 } },
      { id: 'str-plan',    label: 'วางแผนหรือจัดการสิ่งต่าง ๆ',                  weights: { business: 3, data: 2, law: 1 } },
    ],
  },

  // ─── Q12: ค่านิยมในชีวิตการทำงาน ─────────────────────────────────
  {
    id: 'values',
    kind: 'interest',
    question: 'ในชีวิตการทำงาน อะไรสำคัญที่สุดสำหรับคุณ?',
    options: [
      { id: 'val-help',    label: 'ได้ช่วยเหลือผู้คนและสร้างความแตกต่าง',        weights: { helping: 3, media: 1, science: 1 } },
      { id: 'val-create',  label: 'ได้สร้างสิ่งใหม่ที่ไม่เคยมีมาก่อน',           weights: { creative: 3, tech: 2, business: 1 } },
      { id: 'val-think',   label: 'ได้ทำงานที่ท้าทายและต้องใช้ความคิด',          weights: { data: 2, science: 2, tech: 2 } },
      { id: 'val-stable',  label: 'งานมั่นคง มีรายได้ดี และได้รับการยอมรับ',     weights: { business: 2, law: 2, data: 1 } },
    ],
  },
];

// ─── Scorer ─────────────────────────────────────────────────────────────────

/** max weight สำหรับแต่ละ dim — ใช้ normalize ผลให้เป็น 0–100 */
const MAX_PER_DIM: Record<DimSlug, number> = (() => {
  const acc: Record<string, number> = {};
  for (const q of CAREER_QUIZ) {
    if (q.kind !== 'interest') continue;
    const maxOption = Math.max(
      ...q.options.map((o) => Math.max(...Object.values(o.weights ?? {}))),
    );
    if (!Number.isFinite(maxOption)) continue;
    for (const o of q.options) {
      for (const [dim, w] of Object.entries(o.weights ?? {})) {
        acc[dim] = (acc[dim] ?? 0) + w;
      }
    }
  }
  return acc as Record<DimSlug, number>;
})();

export function scoreCareerQuiz(answers: CareerQuizAnswers): CareerQuizProfile {
  const raw: Record<string, number> = {};
  let gradeBand: GradeBand = 'upper';

  for (const q of CAREER_QUIZ) {
    const chosen = answers[q.id];
    if (!chosen) continue;

    if (q.kind === 'filter') {
      const opt = q.options.find((o) => o.id === chosen);
      if (opt?.gradeBand) gradeBand = opt.gradeBand;
      continue;
    }

    const opt = q.options.find((o) => o.id === chosen);
    if (!opt?.weights) continue;
    for (const [dim, w] of Object.entries(opt.weights)) {
      raw[dim] = (raw[dim] ?? 0) + (w as number);
    }
  }

  // normalize: คำนวณสูงสุดที่เป็นไปได้สำหรับแต่ละ dim แล้วเปลี่ยนเป็น 0-100
  // ถ้า dim ไม่ถูกทดสอบเลยให้เป็น 0
  const totalQuestions = CAREER_QUIZ.filter((q) => q.kind === 'interest').length;
  const dims = new Map<DimSlug, number>();

  for (const dim of ALL_DIMS) {
    const score = raw[dim] ?? 0;
    // เทียบกับ max ที่เป็นไปได้ (ถ้า user เลือกตัวเลือกที่ให้คะแนน dim นี้สูงสุดทุกข้อ)
    // แต่เพื่อความง่าย ใช้ max fixed = totalQuestions × 3 (max weight ต่อข้อ)
    const maxPossible = totalQuestions * 3;
    dims.set(dim, Math.round(Math.min(score / maxPossible, 1) * 100));
  }

  return { dims, gradeBand };
}
