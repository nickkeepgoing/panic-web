// Career & Interest Discovery Quiz — 22 ข้อ
//
// อ้างอิงงานวิจัย:
//   Holland (1959, 1997) — RIASEC Interest Theory
//   Super (1970) — Work Values Inventory
//   Gardner (1983) — Multiple Intelligences
//   Csikszentmihalyi (1990) — Flow State (บ่งบอก genuine interest)
//
// หลักการ: ถามจากพฤติกรรมและสถานการณ์จริง ไม่ถามตรงว่า "อยากเป็นอะไร"
// เพราะคนส่วนใหญ่ยังไม่รู้ว่าตัวเองอยากเป็นอะไร แต่รู้ว่าชอบทำอะไร
//
// Dimensions 10 ตัวถูก map จาก RIASEC ดังนี้:
//   R (Realistic)    → craft, nature
//   I (Investigative)→ science, data, tech
//   A (Artistic)     → creative, media
//   S (Social)       → helping
//   E (Enterprising) → business, media
//   C (Conventional) → data, law

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

export type CareerQuizAnswers = Record<string, string>;

type WeightMap = Partial<Record<DimSlug, number>>;

type CareerQuizOption = {
  id: string;
  label: string;
  hint?: string;
  weights?: WeightMap;
  gradeBand?: GradeBand;
};

type CareerQuizQuestion = {
  id: string;
  kind: 'filter' | 'interest';
  question: string;
  helper?: string;
  options: CareerQuizOption[];
};

// ─── 22 Questions ────────────────────────────────────────────────────────────
// อิง Holland RIASEC + Super Work Values + Gardner Multiple Intelligences
// ทุกคำถามถามจากพฤติกรรมและสถานการณ์จริง ไม่ถามว่าอยากเป็นอะไร

export const CAREER_QUIZ: CareerQuizQuestion[] = [

  // ── Q1: Grade band (filter) ──────────────────────────────────────────────
  {
    id: 'grade',
    kind: 'filter',
    question: 'ตอนนี้เรียนอยู่ชั้นไหน?',
    options: [
      { id: 'primary',  label: 'ป.1 – ป.3',  gradeBand: 'primary' },
      { id: 'primary4', label: 'ป.4 – ป.6',  gradeBand: 'primary' },
      { id: 'lower',    label: 'ม.1 – ม.3',  gradeBand: 'lower'   },
      { id: 'upper',    label: 'ม.4 – ม.6',  gradeBand: 'upper'   },
    ],
  },

  // ── Q2: กิจกรรมยามว่าง ─────────────────────────────────────────────────
  // Holland: กิจกรรมที่เลือกทำเองบอก genuine interest ได้ดีที่สุด
  {
    id: 'freetime',
    kind: 'interest',
    question: 'วันหยุดที่ไม่มีการบ้าน คุณมักทำอะไรโดยไม่รู้สึกว่าเป็นงาน?',
    helper: 'เลือกสิ่งที่ทำแล้วรู้สึกสนุกและเวลาผ่านไปเร็ว',
    options: [
      { id: 'ft-make',  label: 'ซ่อมของ ประกอบโมเดล ต่อวงจร หรือทำของด้วยมือ',      weights: { craft: 3, tech: 2 } },
      { id: 'ft-art',   label: 'วาดรูป ถ่ายภาพ แต่งเพลง หรือสร้างสรรค์งานศิลปะ',    weights: { creative: 3, media: 2 } },
      { id: 'ft-read',  label: 'อ่านหนังสือ ดูสารคดี หรือหาข้อมูลเรื่องที่สนใจ',    weights: { science: 2, data: 2, tech: 1 } },
      { id: 'ft-hang',  label: 'ชวนเพื่อน จัดกิจกรรม หรือพูดคุยกับคนรอบข้าง',       weights: { helping: 2, business: 2, media: 1 } },
    ],
  },

  // ── Q3: บทบาทในบ้าน ──────────────────────────────────────────────────────
  // Holland R+S: สิ่งที่ทำในบ้านสะท้อน natural role ที่แท้จริง
  {
    id: 'home-role',
    kind: 'interest',
    question: 'ในบ้านหรือครอบครัว คุณมักเป็นคนที่ทำอะไร?',
    options: [
      { id: 'hr-fix',   label: 'ช่วยซ่อมของ ดูแลอุปกรณ์ หรือจัดการสิ่งของในบ้าน',  weights: { craft: 3, tech: 2 } },
      { id: 'hr-care',  label: 'ดูแลน้อง ช่วยเหลือผู้ใหญ่ หรือให้กำลังใจคนในบ้าน', weights: { helping: 3, media: 1 } },
      { id: 'hr-plan',  label: 'ช่วยวางแผน จัดการค่าใช้จ่าย หรือจัดระเบียบบ้าน',   weights: { data: 3, business: 2, law: 1 } },
      { id: 'hr-deco',  label: 'ช่วยตกแต่ง คิดเมนูอาหาร หรือทำให้บ้านน่าอยู่ขึ้น', weights: { creative: 3, craft: 1 } },
    ],
  },

  // ── Q4: เงิน 500 บาท ─────────────────────────────────────────────────────
  // Super Work Values: การใช้เงินบอก underlying value ได้ชัดมาก
  {
    id: 'money',
    kind: 'interest',
    question: 'ถ้าได้รับเงิน 500 บาทมาฟรีๆ สิ่งแรกที่นึกถึงคือ...',
    options: [
      { id: 'mo-invest', label: 'เก็บออมหรือหาวิธีทำให้เงินนั้นงอกเงย',             weights: { business: 3, data: 2 } },
      { id: 'mo-buy',    label: 'ซื้อวัสดุมาทำโปรเจกต์ ประดิษฐ์ หรือทดลอง',        weights: { craft: 3, science: 2 } },
      { id: 'mo-learn',  label: 'ลงทุนกับการเรียนรู้ เช่น หนังสือหรือคอร์สใหม่',    weights: { science: 2, data: 2, tech: 1 } },
      { id: 'mo-share',  label: 'ใช้กับการสร้างความสุขให้คนรอบข้างหรือช่วยคนอื่น',  weights: { helping: 3, media: 1 } },
    ],
  },

  // ── Q5: วิชาที่ถนัด ──────────────────────────────────────────────────────
  {
    id: 'subject',
    kind: 'interest',
    question: 'วิชาไหนที่คุณรู้สึกว่าทำได้ดีโดยไม่ต้องพยายามมาก?',
    options: [
      { id: 'sub-sci',  label: 'คณิตศาสตร์ วิทยาศาสตร์ หรือฟิสิกส์',               weights: { science: 3, data: 2, tech: 1 } },
      { id: 'sub-lang', label: 'ภาษาไทย ภาษาอังกฤษ หรือสังคมศึกษา',                weights: { media: 2, law: 2, helping: 1 } },
      { id: 'sub-art',  label: 'ศิลปะ ดนตรี หรือพลศึกษา',                           weights: { creative: 3, craft: 2 } },
      { id: 'sub-comp', label: 'คอมพิวเตอร์ งานเทคนิค หรือการงานอาชีพ',             weights: { tech: 3, craft: 2, data: 1 } },
    ],
  },

  // ── Q6: บทบาทในงานกลุ่ม ─────────────────────────────────────────────────
  // Holland E+S: social role เป็นตัวบ่งชี้ที่แม่นยำมาก
  {
    id: 'group-role',
    kind: 'interest',
    question: 'ในงานกลุ่ม คุณมักรับบทบาทอะไรโดยธรรมชาติ?',
    options: [
      { id: 'gr-lead',   label: 'ผู้นำ วางแผน แบ่งงาน และผลักดันให้ทีมเดินหน้า',     weights: { business: 3, law: 1, media: 1 } },
      { id: 'gr-do',     label: 'คนลงมือทำจริง ผลิตผลงาน หรือแก้ปัญหาเทคนิค',       weights: { craft: 3, tech: 2 } },
      { id: 'gr-bridge', label: 'คนกลาง ประสาน ทำให้ทุกคนทำงานร่วมกันได้',           weights: { helping: 3, media: 2 } },
      { id: 'gr-create', label: 'คนออกแบบ นำเสนอ หรือสร้างสรรค์ผลงาน',              weights: { creative: 3, media: 2 } },
    ],
  },

  // ── Q7: โปรเจกต์ในฝัน ───────────────────────────────────────────────────
  {
    id: 'dream-project',
    kind: 'interest',
    question: 'ถ้าทำโปรเจกต์ได้โดยไม่มีข้อจำกัด คุณจะทำอะไร?',
    options: [
      { id: 'dp-tech',   label: 'สร้างแอป เว็บ เกม หรือระบบที่คนอื่นใช้ได้จริง',    weights: { tech: 3, data: 2, creative: 1 } },
      { id: 'dp-sci',    label: 'ทดลองวิทยาศาสตร์หรือวิจัยเรื่องที่อยากรู้',         weights: { science: 3, data: 2 } },
      { id: 'dp-art',    label: 'สร้างผลงานศิลปะ ภาพยนตร์ เพลง หรือนิทรรศการ',       weights: { creative: 3, media: 2 } },
      { id: 'dp-help',   label: 'จัดกิจกรรมช่วยเหลือชุมชนหรือแก้ปัญหาสังคม',         weights: { helping: 3, business: 2 } },
    ],
  },

  // ── Q8: สิ่งที่เพื่อนขอความช่วยเหลือ ────────────────────────────────────
  // Holland: สิ่งที่คนอื่นขอจาก "เรา" บอก perceived strength ที่แม่นยำ
  {
    id: 'friend-help',
    kind: 'interest',
    question: 'เพื่อนมักขอความช่วยเหลือจากคุณเรื่องอะไร?',
    options: [
      { id: 'fh-tech',   label: 'แก้ปัญหาคอมพิวเตอร์ โทรศัพท์ หรืออุปกรณ์ต่างๆ',    weights: { tech: 3, craft: 2 } },
      { id: 'fh-listen', label: 'ฟังปัญหา ให้คำปรึกษา หรือช่วยคิดทางออก',           weights: { helping: 3, media: 1 } },
      { id: 'fh-design', label: 'ออกแบบงาน ตกแต่ง หรือทำให้สิ่งต่างๆ ดูดีขึ้น',      weights: { creative: 3, media: 2 } },
      { id: 'fh-plan',   label: 'วางแผน จัดการ หาข้อมูล หรือจัดระเบียบสิ่งต่างๆ',   weights: { data: 2, business: 2, law: 1 } },
    ],
  },

  // ── Q9: รับมือปัญหา ───────────────────────────────────────────────────────
  // Investigative vs Realistic: วิธีรับมือปัญหาบอก thinking style ที่ชัดมาก
  {
    id: 'problem-style',
    kind: 'interest',
    question: 'เวลาเจอปัญหาหรือสิ่งที่ไม่เข้าใจ คุณมักทำอะไรก่อน?',
    options: [
      { id: 'ps-research', label: 'ค้นหาข้อมูล วิเคราะห์ และแก้ปัญหาแบบเป็นขั้นตอน', weights: { data: 2, science: 2, tech: 1 } },
      { id: 'ps-try',      label: 'ลองผิดลองถูกด้วยมือ จนกว่าจะเจอวิธีที่ใช้ได้',    weights: { craft: 3, tech: 1 } },
      { id: 'ps-ask',      label: 'ปรึกษาคนที่ไว้ใจหรือคนที่รู้เรื่องนั้นดีกว่า',   weights: { helping: 2, media: 1 } },
      { id: 'ps-creative', label: 'มองหาวิธีใหม่ๆ ที่ไม่เคยมีใครลองทำ',             weights: { creative: 3, science: 1 } },
    ],
  },

  // ── Q10: บุคลิกในห้องเรียน ──────────────────────────────────────────────
  {
    id: 'classroom',
    kind: 'interest',
    question: 'ในห้องเรียน คุณมักเป็นคนแบบไหน?',
    options: [
      { id: 'cl-curious', label: 'ชอบถามคำถาม หาเหตุผล และตั้งข้อสังเกต',           weights: { science: 3, data: 2 } },
      { id: 'cl-quiet',   label: 'เงียบๆ แต่ทำงานออกมาได้ดีและละเอียดเสมอ',         weights: { data: 2, craft: 2, law: 1 } },
      { id: 'cl-social',  label: 'ชอบช่วยเพื่อน อธิบาย และทำให้ทุกคนเข้าใจด้วยกัน', weights: { helping: 3, media: 2 } },
      { id: 'cl-talk',    label: 'ชอบแสดงความคิดเห็น นำเสนอ และโน้มน้าวคนอื่น',     weights: { media: 2, business: 2, law: 1 } },
    ],
  },

  // ── Q11: ช่วยพ่อแม่ทำงาน ─────────────────────────────────────────────────
  // คำถามนี้ออกแบบมาเพื่อจับ entrepreneurial interest ที่ซ่อนอยู่
  // เด็กที่ช่วยพ่อแม่ขายของ/ทำธุรกิจ จะแสดงออกผ่านคำถามนี้
  {
    id: 'family-work',
    kind: 'interest',
    question: 'ถ้าต้องช่วยพ่อแม่หรือครอบครัวทำงาน คุณอยากช่วยส่วนไหน?',
    helper: 'เลือกตามที่รู้สึกว่าถนัดหรือสนใจจริงๆ ไม่มีคำตอบผิด',
    options: [
      { id: 'fw-sell',  label: 'ช่วยขายของ คุยกับลูกค้า หรือโปรโมตสินค้า',         weights: { business: 3, media: 2 } },
      { id: 'fw-fix',   label: 'ซ่อมแซม ดูแลอุปกรณ์ หรืองานช่างต่างๆ',             weights: { craft: 3, tech: 2 } },
      { id: 'fw-data',  label: 'จัดการบัญชี สต็อก หรือข้อมูลการเงิน',              weights: { data: 3, business: 2, law: 1 } },
      { id: 'fw-care',  label: 'ดูแลคนในบ้าน ทำอาหาร หรือสร้างบรรยากาศที่ดี',     weights: { helping: 3, craft: 1 } },
    ],
  },

  // ── Q12: Flow state — เวลาผ่านไปเร็ว ────────────────────────────────────
  // Csikszentmihalyi: กิจกรรมที่ทำให้เกิด flow = genuine passion ที่แท้จริง
  {
    id: 'flow',
    kind: 'interest',
    question: 'สิ่งที่ทำให้คุณรู้สึกว่า "เวลาผ่านไปเร็วมาก" จนลืมทุกอย่างคือ...',
    helper: 'นักจิตวิทยา Csikszentmihalyi เรียกสิ่งนี้ว่า "Flow" — สัญญาณของความสนใจที่แท้จริง',
    options: [
      { id: 'fl-code',  label: 'ตอนเขียนโปรแกรม แก้โจทย์ หรือทำงานกับข้อมูล',       weights: { data: 3, science: 2, tech: 2 } },
      { id: 'fl-create',label: 'ตอนวาดรูป แต่งเพลง หรือสร้างงานสร้างสรรค์',          weights: { creative: 3, craft: 2 } },
      { id: 'fl-talk',  label: 'ตอนคุย สอน ช่วย หรืออธิบายให้คนอื่นเข้าใจ',         weights: { helping: 3, media: 1 } },
      { id: 'fl-build', label: 'ตอนประกอบของ ซ่อม หรือทดลองทำสิ่งใหม่ด้วยมือ',      weights: { craft: 3, tech: 2, science: 1 } },
    ],
  },

  // ── Q13: เนื้อหาออนไลน์ ─────────────────────────────────────────────────
  {
    id: 'online-content',
    kind: 'interest',
    question: 'เนื้อหาออนไลน์ที่คุณดูแล้วไม่เบื่อและดูซ้ำได้เรื่อยๆ คือ...',
    options: [
      { id: 'oc-tech',   label: 'ทดลองวิทยาศาสตร์ DIY นวัตกรรม หรือ AI',              weights: { science: 2, tech: 2, craft: 2 } },
      { id: 'oc-nature', label: 'สารคดีธรรมชาติ สัตว์ สิ่งแวดล้อม หรือการเดินทาง',   weights: { nature: 3, science: 2 } },
      { id: 'oc-biz',    label: 'ธุรกิจ การลงทุน สตาร์ทอัป หรือเรื่องราวความสำเร็จ',  weights: { business: 3, data: 2 } },
      { id: 'oc-art',    label: 'ศิลปะ เพลง แฟชั่น ภาพยนตร์ หรือไลฟ์สไตล์',          weights: { creative: 3, media: 2 } },
    ],
  },

  // ── Q14: แก้ปัญหาชุมชน ─────────────────────────────────────────────────
  {
    id: 'community',
    kind: 'interest',
    question: 'ถ้าต้องช่วยแก้ปัญหาในชุมชน วิธีที่คุณอยากทำมากที่สุดคือ...',
    options: [
      { id: 'co-invent', label: 'สร้างนวัตกรรมหรืออุปกรณ์แก้ปัญหาแบบใหม่',          weights: { tech: 3, craft: 2, science: 1 } },
      { id: 'co-org',    label: 'รวมคน จัดกิจกรรม หรือระดมทุนให้เกิดการเปลี่ยนแปลง', weights: { business: 3, helping: 2 } },
      { id: 'co-research',label: 'ศึกษา วิจัย และหาสาเหตุที่แท้จริงก่อนแก้',          weights: { science: 3, data: 2 } },
      { id: 'co-teach',  label: 'ให้ความรู้ สอน หรือสร้างสื่อให้คนเข้าใจปัญหา',      weights: { media: 3, helping: 2 } },
    ],
  },

  // ── Q15: ทักษะที่อยากพัฒนา ──────────────────────────────────────────────
  {
    id: 'skill-growth',
    kind: 'interest',
    question: 'ถ้ามีเวลา 1 ชั่วโมงต่อวันเรียนทักษะใหม่ คุณจะเลือกอะไร?',
    options: [
      { id: 'sg-code',    label: 'เขียนโปรแกรม AI หรือวิเคราะห์ข้อมูล',              weights: { tech: 3, data: 2 } },
      { id: 'sg-business',label: 'ธุรกิจ การขาย หรือการพูดในที่สาธารณะ',             weights: { business: 3, media: 2 } },
      { id: 'sg-art',     label: 'ดนตรี วาดรูป ออกแบบ หรือถ่ายภาพ',                  weights: { creative: 3, craft: 2 } },
      { id: 'sg-care',    label: 'การแพทย์เบื้องต้น จิตวิทยา หรือการดูแลสุขภาพ',    weights: { helping: 3, science: 2 } },
    ],
  },

  // ── Q16: เพื่อนมองเห็นเราอย่างไร ────────────────────────────────────────
  // Super: External perception มักแม่นยำกว่า self-report ในบางมิติ
  {
    id: 'peer-view',
    kind: 'interest',
    question: 'เพื่อนๆ มักพูดถึงคุณว่าเป็นคนแบบไหน?',
    options: [
      { id: 'pv-smart',  label: 'ช่างสังเกต ละเอียด วิเคราะห์เก่ง และตอบคำถามได้',  weights: { data: 2, science: 2, law: 1 } },
      { id: 'pv-create', label: 'มีไอเดียแปลกใหม่เสมอ และทำให้สิ่งต่างๆ ดูน่าสนใจขึ้น', weights: { creative: 3, media: 1 } },
      { id: 'pv-kind',   label: 'อบอุ่น ไว้ใจได้ และพร้อมช่วยเหลือเสมอ',              weights: { helping: 3, media: 1 } },
      { id: 'pv-leader', label: 'กล้าแสดงออก พูดโน้มน้าวเก่ง และเป็นแกนนำได้',      weights: { business: 3, media: 2, law: 1 } },
    ],
  },

  // ── Q17: Flow state ที่สอง (Multiple Intelligence) ─────────────────────
  // Gardner: ตรวจสอบว่า intelligence ที่แท้จริงอยู่ที่ไหน
  {
    id: 'strength-moment',
    kind: 'interest',
    question: 'สถานการณ์ไหนที่ทำให้คุณรู้สึกว่า "ฉันทำสิ่งนี้ได้ดีจริงๆ"?',
    options: [
      { id: 'sm-solve', label: 'ตอนแก้โจทย์ยาก ค้นพบคำตอบ หรือวิเคราะห์ข้อมูล',     weights: { science: 2, data: 2, tech: 1 } },
      { id: 'sm-made',  label: 'ตอนสร้างหรือผลิตบางอย่างออกมาได้ด้วยมือตัวเอง',      weights: { craft: 3, creative: 2 } },
      { id: 'sm-helped',label: 'ตอนที่ช่วยให้ใครสักคนรู้สึกดีขึ้นหรือแก้ปัญหาได้',  weights: { helping: 3 } },
      { id: 'sm-led',   label: 'ตอนได้นำทีม จัดงาน หรือทำให้โปรเจกต์สำเร็จ',        weights: { business: 3, media: 2 } },
    ],
  },

  // ── Q18: ความสุขในการตัดสินใจ ──────────────────────────────────────────
  {
    id: 'decision',
    kind: 'interest',
    question: 'เวลาต้องตัดสินใจสำคัญ คุณมักพึ่งอะไร?',
    options: [
      { id: 'de-data',    label: 'ข้อมูลและตัวเลข เหตุผลต้องชัดเจนก่อนตัดสินใจ',     weights: { data: 3, science: 2, law: 1 } },
      { id: 'de-feel',    label: 'ความรู้สึกและสัญชาตญาณ ถ้าใจบอกให้ทำก็ทำ',         weights: { creative: 2, helping: 1 } },
      { id: 'de-future',  label: 'ประโยชน์ระยะยาวและโอกาสที่จะได้รับ',               weights: { business: 3, data: 2 } },
      { id: 'de-try',     label: 'ลองทำดูก่อน ถ้าไม่ได้ค่อยปรับแก้',                weights: { craft: 2, tech: 1, creative: 1 } },
    ],
  },

  // ── Q19: ประสบการณ์ที่ภาคภูมิใจ ─────────────────────────────────────────
  // Super: Peak experience บ่งบอก core values และ abilities ที่แท้จริง
  {
    id: 'proud-moment',
    kind: 'interest',
    question: 'ประสบการณ์ที่ทำให้คุณภาคภูมิใจที่สุดจนถึงตอนนี้คือ...',
    options: [
      { id: 'pm-learn',  label: 'ตอนเรียนรู้สิ่งยากจนทำได้สำเร็จ',                  weights: { science: 2, data: 2, craft: 1 } },
      { id: 'pm-create', label: 'ตอนสร้างผลงานที่คนอื่นชื่นชม',                       weights: { creative: 3, media: 2 } },
      { id: 'pm-help',   label: 'ตอนที่การกระทำของเราทำให้ชีวิตใครดีขึ้นจริงๆ',      weights: { helping: 3 } },
      { id: 'pm-lead',   label: 'ตอนนำทีมให้บรรลุเป้าหมายที่ยาก',                    weights: { business: 3, media: 2 } },
    ],
  },

  // ── Q20: 10 ปีข้างหน้า (values-based, ไม่ใช่ career-based) ─────────────
  // Super: ถามเรื่องชีวิต ไม่ใช่อาชีพ เพราะค่านิยมบอก direction ได้ลึกกว่า
  {
    id: 'future-life',
    kind: 'interest',
    question: 'ในอีก 10 ปี ถ้าชีวิตคุณประสบความสำเร็จ สิ่งที่สำคัญที่สุดคือ...',
    helper: 'ไม่ต้องเลือกตามที่คิดว่า "ควรจะเป็น" เลือกตามที่รู้สึกจริงๆ',
    options: [
      { id: 'fl-expert', label: 'มีความเชี่ยวชาญลึกในสิ่งที่รักจนเป็นที่ยอมรับ',     weights: { science: 2, data: 2, craft: 2 } },
      { id: 'fl-own',    label: 'มีธุรกิจหรือผลงานที่ตัวเองสร้างขึ้นมาเอง',           weights: { business: 3, creative: 2 } },
      { id: 'fl-impact', label: 'ได้ช่วยเหลือผู้คนและสร้างความแตกต่างให้โลก',         weights: { helping: 3, media: 1 } },
      { id: 'fl-stable', label: 'มีชีวิตมั่นคง ครอบครัวที่ดี และสุขภาพที่แข็งแรง',   weights: { law: 2, data: 1, helping: 1 } },
    ],
  },

  // ── Q21: กิจกรรมอาสาสมัคร ──────────────────────────────────────────────
  // Holland: การเลือกกิจกรรมที่ไม่มีรางวัลบอก intrinsic motivation ชัดมาก
  {
    id: 'volunteer',
    kind: 'interest',
    question: 'ถ้าเลือกทำกิจกรรมอาสาสมัครได้ คุณจะเลือกอะไร?',
    options: [
      { id: 'vo-teach',  label: 'สอนหรือติวน้องๆ ที่ต้องการความช่วยเหลือ',            weights: { helping: 3, media: 1 } },
      { id: 'vo-tech',   label: 'พัฒนาแอป เว็บ หรือเทคโนโลยีเพื่อชุมชน',             weights: { tech: 3, craft: 2 } },
      { id: 'vo-biz',    label: 'จัดงาน ขายของ หรือระดมทุนเพื่อการกุศล',             weights: { business: 3, media: 2 } },
      { id: 'vo-nature', label: 'ดูแลสิ่งแวดล้อม ปลูกต้นไม้ หรืออนุรักษ์ธรรมชาติ',  weights: { nature: 3, science: 2 } },
    ],
  },

  // ── Q22: สิ่งที่คุณอยากให้คนอื่น "จำ" คุณ ──────────────────────────────
  // Super Work Values: legacy value บอก core identity ที่ลึกที่สุด
  {
    id: 'legacy',
    kind: 'interest',
    question: 'ถ้าวันนึงคนอื่นพูดถึงคุณ คุณอยากให้เขาจำคุณในฐานะอะไรมากที่สุด?',
    options: [
      { id: 'le-innovate',label: 'คนที่สร้างสิ่งใหม่หรือแก้ปัญหาที่ไม่มีใครคิดถึง',  weights: { creative: 3, tech: 2, science: 1 } },
      { id: 'le-care',    label: 'คนที่ทำให้ชีวิตคนอื่นดีขึ้นจริงๆ',                  weights: { helping: 3 } },
      { id: 'le-build',   label: 'คนที่สร้างธุรกิจหรือองค์กรที่ยั่งยืนและสร้างงาน',   weights: { business: 3, law: 2 } },
      { id: 'le-master',  label: 'คนที่เชี่ยวชาญและเป็นอ้างอิงในสาขาของตัวเอง',       weights: { science: 2, data: 2, craft: 2 } },
    ],
  },
];

// ─── Scorer ──────────────────────────────────────────────────────────────────

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

  // normalize: max ที่เป็นไปได้ = จำนวนคำถาม interest × weight สูงสุดต่อข้อ (3)
  const interestCount = CAREER_QUIZ.filter((q) => q.kind === 'interest').length;
  const maxPossible = interestCount * 3;

  const dims = new Map<DimSlug, number>();
  for (const dim of ALL_DIMS) {
    const score = raw[dim] ?? 0;
    dims.set(dim, Math.round(Math.min(score / maxPossible, 1) * 100));
  }

  return { dims, gradeBand };
}
