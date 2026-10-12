// Career & Interest Discovery Quiz — v2 — 27 ข้อ
//
// ─── กรอบวิจัย ───────────────────────────────────────────────────────────────
//
//   Holland (1959, 1997)         RIASEC Interest Theory
//     → โครงสร้างหลักของ 6 ประเภทบุคลิก (R-I-A-S-E-C)
//     → craft≈R, science≈I, creative≈A, helping≈S, business≈E, data/law≈C
//     → หลักการ: วัดจากกิจกรรมที่ทำจริง ไม่ใช่อาชีพที่อยากเป็น
//
//   Super (1970, 1990)            Work Values Inventory
//     → ค่านิยมงาน: ความสำเร็จ, อิสระ, ความหลากหลาย, ความมั่นคง,
//       การช่วยเหลือ, สุนทรียะ, ชื่อเสียง, สภาพแวดล้อม
//     → คำถามเรื่องความหมาย ค่านิยม และมรดกที่ทิ้งไว้
//
//   Csikszentmihalyi (1990)       Flow Theory
//     → กิจกรรมที่ทำให้เกิด flow = ความสนใจที่แท้จริงที่แม่นยำที่สุด
//     → ถามว่า "เมื่อไหร่ที่คุณลืมเวลา" ไม่ใช่ "คุณชอบอะไร"
//
//   Deci & Ryan (1985)            Self-Determination Theory
//     → แรงจูงใจภายใน (intrinsic) ทำนายความพึงพอใจในงานได้ดีกว่าภายนอก
//     → ถามว่า "อะไรที่ทำโดยไม่ต้องการรางวัล"
//
//   Lent, Brown & Hackett (1994)  Social Cognitive Career Theory (SCCT)
//     → self-efficacy + กิจกรรมที่สนุก → ความสนใจ → เป้าหมาย
//     → ถามทั้ง "คุณทำอะไรได้ดี" และ "อะไรที่คนอื่นมักขอความช่วยเหลือ"
//
//   Savickas (2005)               Career Construction Theory
//     → career adaptability: ความกังวล, ความอยากรู้, ความมั่นใจ
//     → ถามเรื่องการรับมือกับสิ่งที่ไม่รู้จัก และการตอบสนองต่อความท้าทาย
//
//   Budner (1962)                 Tolerance for Ambiguity
//     → ทนต่อความคลุมเครือได้สูง → เหมาะกับงานวิจัย, สร้างสรรค์, ผู้ประกอบการ
//     → ทนได้ต่ำ → เหมาะกับงานที่มีขั้นตอนชัดเจน, กฎ, มาตรฐาน
//
//   Kristof (1996)                Person-Environment Fit
//     → การจับคู่ค่านิยม + สภาพแวดล้อมทำนายความพึงพอใจดีกว่าทักษะอย่างเดียว
//
// ─── หลักการออกแบบคำถาม ────────────────────────────────────────────────────
//
//   1. พฤติกรรม > การระบุความชอบ ("ฉันทำอะไร" > "ฉันชอบอะไร")
//      เหตุผล: behavioral questions ลด social desirability bias (Campion et al. 1994)
//
//   2. สถานการณ์จริง > นามธรรม ("เมื่อเจอสถานการณ์ X" > "คุณชอบ X ไหม")
//      เหตุผล: situational questions predict real behavior better (Hartung 2011)
//
//   3. ไม่ระบุชื่ออาชีพ สาขา หรืออุตสาหกรรมในคำถามหรือตัวเลือกใด
//      เหตุผล: ป้องกัน confirmation bias — ค้นพบ "คน" ก่อน แล้วจึง map ไปอาชีพ
//
//   4. ตัวเลือกทั้ง 4 มีความดึงดูดเท่าๆ กัน ไม่มีคำตอบ "ถูก"
//      เหตุผล: forced-choice design eliminates acquiescence bias
//
//   5. ครอบคลุม 6 มิติชีวิต: การรับรู้, การแก้ปัญหา, สังคม, ค่านิยม, สภาพแวดล้อม, อารมณ์
//
// ─── Dimension Map ──────────────────────────────────────────────────────────
//
//   DimSlug    Holland   ความหมายทางจิตวิทยา
//   ─────────  ────────  ─────────────────────────────────────────────────────
//   craft      R         ทักษะมือ, สร้างงาน, จับต้องได้, ซ่อมแซม
//   tech       R+I       ตรรกะเชิงระบบ, กลไก, วิศวกรรมประยุกต์
//   science    I         ความอยากรู้ที่ลึก, วิเคราะห์, ค้นหาความจริง
//   creative   A         การแสดงออก, จินตนาการ, สุนทรียะ
//   helping    S         การดูแล, สอน, เชื่อมต่อ, เห็นอกเห็นใจ
//   business   E         ริเริ่ม, ผู้นำ, โน้มน้าว, สร้างโอกาส
//   data       C         ระเบียบ, แม่นยำ, ขั้นตอน, วิธีการ
//   law        C+S       ความยุติธรรม, กฎ, โครงสร้างสังคม
//   nature     R ext.    ความผูกพันกับธรรมชาติ, สิ่งมีชีวิต
//   media      A+S       การสื่อสาร, เล่าเรื่อง, สร้างความหมายร่วม

export type DimSlug =
  | 'tech'      // ตรรกะเชิงระบบ
  | 'science'   // ความสงสัยใคร่รู้
  | 'creative'  // การแสดงออกเชิงสร้างสรรค์
  | 'helping'   // การดูแลและเชื่อมต่อ
  | 'business'  // ความคิดริเริ่มและภาวะผู้นำ
  | 'nature'    // ความผูกพันกับธรรมชาติ
  | 'data'      // ความแม่นยำและการจัดระเบียบ
  | 'law'       // ความยุติธรรมและโครงสร้าง
  | 'craft'     // ทักษะมือและการสร้างงาน
  | 'media';    // การสื่อสารและการเล่าเรื่อง

// Labels ที่แสดงผู้ใช้ — ภาษาลักษณะบุคคล ไม่ใช่ชื่อสาขาวิชา
export const DIM_LABELS: Record<DimSlug, string> = {
  tech:     'ตรรกะเชิงระบบ',
  science:  'ความสงสัยใคร่รู้',
  creative: 'การแสดงออกเชิงสร้างสรรค์',
  helping:  'การดูแลและเชื่อมต่อ',
  business: 'ความคิดริเริ่มและภาวะผู้นำ',
  nature:   'ความผูกพันกับธรรมชาติ',
  data:     'ความแม่นยำและการจัดระเบียบ',
  law:      'ความยุติธรรมและโครงสร้าง',
  craft:    'ทักษะมือและการสร้างงาน',
  media:    'การสื่อสารและการเล่าเรื่อง',
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

// ─── 27 Questions ────────────────────────────────────────────────────────────
//
// v2 design: ค้นพบ "คน" ก่อน แล้วจึง map ไปอาชีพ
// ทุกคำถามถามจากพฤติกรรม สถานการณ์จริง และสัญญาณจากชีวิต
// ไม่มีคำถามหรือตัวเลือกใดที่ระบุชื่ออาชีพหรือสาขาวิชา
//
// หมวดหมู่คำถาม:
//   Q2–Q4   : สัญญาณการมีส่วนร่วม (Flow / Engagement)
//   Q5–Q8   : รูปแบบการคิดและการเรียนรู้
//   Q9–Q11  : รูปแบบสังคมและการทำงานร่วมกัน
//   Q12–Q14 : แรงจูงใจและค่านิยม
//   Q15–Q17 : สิ่งที่ดึงดูดความสนใจในโลก
//   Q18–Q21 : สภาพแวดล้อมและการตัดสินใจ
//   Q22–Q25 : อัตลักษณ์และความภาคภูมิใจ
//   Q26–Q27 : ความสัมพันธ์กับโลกธรรมชาติและสังคม

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

  // ── Q2: สัญญาณ Flow — ความสนใจที่แท้จริง ────────────────────────────────
  // Csikszentmihalyi (1990): กิจกรรมที่ทำให้เกิด flow = genuine interest
  // วัดจากพฤติกรรมจริง ไม่ใช่การระบุความชอบ
  {
    id: 'attention_drift',
    kind: 'interest',
    question: 'ตอนว่าง ๆ ไม่มีอะไรต้องทำ คุณมักจะ...',
    options: [
      { id: 'ad-make',    label: 'หยิบของรอบตัวมาแกะ ต่อ หรือดัดแปลงเล่น', weights: { craft: 3, tech: 2 } },
      { id: 'ad-why',     label: 'นั่งหาข้อมูลเรื่องที่สงสัยค้างไว้', weights: { science: 3, data: 1 } },
      { id: 'ad-people',  label: 'ทักไปคุยกับเพื่อนหรือคนในบ้าน ถามว่าเป็นยังไงบ้าง', weights: { helping: 3, media: 1 } },
      { id: 'ad-express', label: 'ขีดเขียน วาด ร้องเพลง หรือแต่งอะไรเล่น ๆ', weights: { creative: 3, media: 2 } },
    ],
  },

  // ── Q3: ความสนใจที่ลึก — สัญญาณ Investigative (Holland I) ───────────────
  // Holland: หัวข้อที่ค้นหาโดยไม่มีใครบอกบ่งบอก genuine intellectual interest
  {
    id: 'what_fascinates',
    kind: 'interest',
    question: 'ถ้าเปิดคลิปหรือบทความต่อกันไปเรื่อย ๆ มักไปจบที่เรื่องแนวไหน?',
    options: [
      { id: 'wf-systems',  label: 'ของสิ่งหนึ่งทำงานยังไง ข้างในมีอะไร', weights: { science: 3, tech: 2 } },
      { id: 'wf-people',   label: 'ชีวิตจริงและประสบการณ์ของใครสักคน', weights: { helping: 2, media: 3 } },
      { id: 'wf-nature',   label: 'สัตว์ ต้นไม้ ทะเล ภูเขา หรือสภาพอากาศ', weights: { nature: 3, science: 2 } },
      { id: 'wf-patterns', label: 'สถิติ อันดับ ตัวเลขเปรียบเทียบ หรือปริศนา', weights: { data: 3, science: 2 } },
    ],
  },

  // ── Q4: Flow state — กิจกรรมที่ทำให้ "อยู่กับมัน" ────────────────────────
  // Csikszentmihalyi: ถามสัญญาณ flow ที่ชัดเจน ไม่ใช่การถามความชอบทั่วไป
  {
    id: 'flow_activity',
    kind: 'interest',
    question: 'ทำอะไรแล้วเงยหน้ามาอีกที เวลาผ่านไปนานโดยไม่รู้ตัว?',
    options: [
      { id: 'fa-build',   label: 'ประกอบ ต่อ หรือซ่อมของชิ้นหนึ่งไปเรื่อย ๆ', weights: { craft: 3, tech: 2 } },
      { id: 'fa-analyze', label: 'แก้โจทย์หรือปริศนาที่ยังคิดไม่ออก', weights: { science: 2, data: 3 } },
      { id: 'fa-teach',   label: 'อธิบายเรื่องหนึ่งให้เพื่อนฟังจนเพื่อนร้อง "อ๋อ"', weights: { helping: 3, media: 2 } },
      { id: 'fa-create',  label: 'วาด เขียน ตัดต่อ หรือแต่งอะไรสักอย่าง', weights: { creative: 3, craft: 1 } },
    ],
  },

  // ── Q5: สัญชาตญาณต่อสิ่งผิดปกติ ─────────────────────────────────────────
  // SCCT: self-efficacy แสดงออกผ่านสิ่งที่ทำเมื่อไม่มีใครบอก
  // Investigative vs Realistic vs Social responses
  {
    id: 'problem_instinct',
    kind: 'interest',
    question: 'เวลามีอะไรไม่เป็นไปตามที่ควร (ทั้งของ งาน หรือแผน) คุณมักเริ่มจาก...',
    options: [
      { id: 'pi-analyze', label: 'ไล่ดูทีละจุดว่ามันเริ่มผิดตรงไหน', weights: { science: 3, data: 2 } },
      { id: 'pi-fix',     label: 'ลองขยับ ปรับ หรือเปลี่ยนดูเลย เดี๋ยวก็รู้', weights: { craft: 3, tech: 2 } },
      { id: 'pi-ask',     label: 'ถามคนที่เกี่ยวข้องว่าเกิดอะไรขึ้นกับเขาบ้าง', weights: { helping: 2, media: 2, law: 1 } },
      { id: 'pi-invent',  label: 'คิดวิธีใหม่ไปเลย ไม่ใช้แบบเดิม', weights: { creative: 3, business: 2 } },
    ],
  },

  // ── Q6: การรับมือกับความคลุมเครือ ────────────────────────────────────────
  // Budner (1962): tolerance for ambiguity ทำนาย Holland type ได้ชัดมาก
  // Savickas: career adaptability วัดจากการตอบสนองต่อสิ่งที่ไม่รู้จัก
  {
    id: 'unknown_territory',
    kind: 'interest',
    question: 'ได้งานที่ไม่มีตัวอย่างและไม่มีใครบอกวิธีทำ คุณจะ...',
    options: [
      { id: 'ut-thrive',    label: 'ชอบนะ จะได้ทำในแบบของตัวเอง', weights: { creative: 2, science: 2, business: 1 } },
      { id: 'ut-structure', label: 'เขียนลำดับขั้นตอนให้ตัวเองก่อน', weights: { data: 3, law: 2 } },
      { id: 'ut-consult',   label: 'ไปถามคนที่เคยทำมาก่อน', weights: { helping: 1, science: 1, business: 2 } },
      { id: 'ut-dive',      label: 'ลงมือเลย ผิดแล้วค่อยแก้', weights: { craft: 2, tech: 2, creative: 1 } },
    ],
  },

  // ── Q7: ความรู้สึกสำเร็จที่ลึกที่สุด ────────────────────────────────────
  // Super: peak experience บอก core values และ genuine abilities
  {
    id: 'satisfaction_peak',
    kind: 'interest',
    question: 'ช่วงเวลาไหนที่ทำให้คุณรู้สึกดีกับตัวเอง?',
    options: [
      { id: 'sp-understood', label: 'ตอนที่เรื่องที่งงมานาน จู่ ๆ ก็เข้าใจ', weights: { science: 3, data: 2 } },
      { id: 'sp-made',       label: 'ตอนที่ของที่ทำเองใช้งานได้จริง', weights: { craft: 3, tech: 2 } },
      { id: 'sp-helped',     label: 'ตอนที่เพื่อนบอกว่าคุยกับเราแล้วสบายใจขึ้น', weights: { helping: 3, media: 1 } },
      { id: 'sp-led',        label: 'ตอนที่งานกลุ่มเสร็จทันเพราะเราคอยจัดการ', weights: { business: 3, media: 2 } },
    ],
  },

  // ── Q8: วิธีเรียนรู้ที่ได้ผลดีที่สุด ────────────────────────────────────
  // Kolb (1984): learning styles ทำนาย Holland types ได้
  // R → experiential, I → reflective, A → diverger, C → assimilator
  {
    id: 'learning_mode',
    kind: 'interest',
    question: 'จะหัดทำอะไรใหม่ ๆ คุณชอบเริ่มแบบไหน?',
    options: [
      { id: 'lm-theory', label: 'อ่านวิธีหรือหลักการให้เข้าใจก่อน', weights: { science: 2, data: 2, law: 1 } },
      { id: 'lm-do',     label: 'ลองทำเลย ผิดตรงไหนค่อยรู้', weights: { craft: 3, tech: 2 } },
      { id: 'lm-watch',  label: 'ดูคนอื่นทำสักรอบ แล้วทำตาม', weights: { helping: 1, media: 2, craft: 1 } },
      { id: 'lm-explore',label: 'ลองไปเรื่อย ๆ ตามที่สนใจ ไม่ต้องมีลำดับ', weights: { creative: 2, science: 2, nature: 1 } },
    ],
  },

  // ── Q9: บทบาทที่ธรรมชาติดึงไป ───────────────────────────────────────────
  // Holland: perceived social role = strong predictor (กำหนดโดยคนอื่น ไม่ใช่ตัวเอง)
  {
    id: 'natural_role',
    kind: 'interest',
    question: 'ทำงานกลุ่มทีไร คุณมักลงเอยด้วยการทำส่วนไหน?',
    options: [
      { id: 'nr-analyst', label: 'หาข้อมูล เช็กว่าอะไรถูกอะไรผิด', weights: { data: 3, science: 2, law: 1 } },
      { id: 'nr-maker',   label: 'ลงมือทำชิ้นงานจริง', weights: { craft: 3, tech: 2 } },
      { id: 'nr-bridge',  label: 'คอยดูว่าทุกคนโอเค ไม่มีใครถูกทิ้ง', weights: { helping: 3, media: 2 } },
      { id: 'nr-compass', label: 'แบ่งงาน ตั้งเป้า และตามงาน', weights: { business: 3, media: 1 } },
    ],
  },

  // ── Q10: วิธีถ่ายทอดที่ถนัดที่สุด ───────────────────────────────────────
  // Gardner (1983): Multiple Intelligences — วิธีถ่ายทอดสะท้อน dominant intelligence
  {
    id: 'how_you_explain',
    kind: 'interest',
    question: 'ต้องอธิบายเรื่องยาก ๆ ให้เพื่อนฟัง คุณมักจะ...',
    options: [
      { id: 'he-logic',  label: 'ไล่ทีละข้อ 1, 2, 3', weights: { data: 2, law: 2, science: 1 } },
      { id: 'he-show',   label: 'วาดรูปหรือทำให้ดูเลย', weights: { creative: 2, craft: 3 } },
      { id: 'he-story',  label: 'ยกตัวอย่างหรือเล่าเป็นเรื่อง', weights: { media: 3, helping: 2 } },
      { id: 'he-direct', label: 'บอกแค่ส่วนที่ต้องรู้ สั้น ๆ', weights: { data: 2, business: 2 } },
    ],
  },

  // ── Q11: สภาพแวดล้อมที่ทำให้ทำงานได้ดีที่สุด ────────────────────────────
  // Kristof (1996): Person-Environment Fit — setting preference predicts satisfaction
  {
    id: 'best_environment',
    kind: 'interest',
    question: 'ถ้าเลือกที่นั่งทำการบ้านได้ คุณจะเลือก...',
    options: [
      { id: 'be-quiet',  label: 'ห้องเงียบ ๆ โต๊ะเป็นระเบียบ', weights: { data: 3, science: 2, law: 1 } },
      { id: 'be-alive',  label: 'ที่ที่มีคนคุยกันอยู่รอบ ๆ', weights: { business: 2, helping: 2, media: 2 } },
      { id: 'be-hands',  label: 'ข้างนอก หรือที่ที่มีพื้นที่วางของและขยับตัวได้', weights: { craft: 3, nature: 2 } },
      { id: 'be-fluid',  label: 'เปลี่ยนที่ไปเรื่อย ๆ แล้วแต่วัน', weights: { creative: 2, business: 2 } },
    ],
  },

  // ── Q12: สิ่งที่ทำให้หมดแรง แม้ทำได้ดี ──────────────────────────────────
  // Super Work Values: สิ่งที่ทำให้เบื่อบอก values ที่ขาดหายได้ชัดกว่าการถามตรงๆ
  {
    id: 'what_drains',
    kind: 'interest',
    question: 'อะไรทำให้คุณเบื่อเร็วที่สุด?',
    options: [
      { id: 'wd-repeat',   label: 'ทำแบบเดิมซ้ำ ๆ ทั้งวัน', weights: { creative: 2, science: 2, business: 1 } },
      { id: 'wd-solo',     label: 'นั่งทำคนเดียวนาน ๆ ไม่มีใครให้คุยด้วย', weights: { helping: 2, media: 2, business: 1 } },
      { id: 'wd-caged',    label: 'มีคนคอยบอกว่าต้องทำยังไงทุกขั้น', weights: { creative: 2, craft: 1, business: 1 } },
      { id: 'wd-unclear',  label: 'ไม่รู้ว่าต้องทำถึงไหนถึงจะเสร็จ', weights: { data: 2, law: 2, science: 1 } },
    ],
  },

  // ── Q13: แรงจูงใจภายใน — SDT ────────────────────────────────────────────
  // Deci & Ryan (1985): intrinsic motivation คือ predictor ที่แม่นยำที่สุด
  // ถามสิ่งที่ทำโดยไม่มีใครสั่งและไม่มีรางวัล = แรงจูงใจภายในแท้จริง
  {
    id: 'intrinsic_pull',
    kind: 'interest',
    question: 'อะไรทำให้คุณลงมือทำบางอย่างเอง โดยไม่มีใครสั่ง?',
    options: [
      { id: 'ip-curiosity', label: 'อยากรู้ว่ามันเป็นแบบนั้นเพราะอะไร', weights: { science: 3, data: 2 } },
      { id: 'ip-create',    label: 'อยากเห็นของที่ยังไม่มีใครทำ', weights: { craft: 2, tech: 2, creative: 2 } },
      { id: 'ip-impact',    label: 'รู้ว่ามีคนจะได้ใช้ประโยชน์จากมัน', weights: { helping: 3, media: 1 } },
      { id: 'ip-challenge', label: 'อยากรู้ว่าตัวเองทำได้ไหม', weights: { business: 3, law: 1 } },
    ],
  },

  // ── Q14: SCCT — สิ่งที่คนอื่นขอจากคุณ ───────────────────────────────────
  // Lent et al. (1994): perceived competence from others = reliable self-efficacy signal
  // สิ่งที่คนขอโดยไม่ได้บอก = ความสามารถที่คนอื่นมองเห็นก่อนตัวเอง
  {
    id: 'others_seek_you',
    kind: 'interest',
    question: 'เพื่อนหรือคนในบ้านมักมาขอให้คุณช่วยเรื่องไหน?',
    options: [
      { id: 'os-explain', label: 'สอนการบ้าน หรือช่วยคิดเรื่องที่คิดไม่ออก', weights: { science: 2, data: 2, media: 1 } },
      { id: 'os-repair',  label: 'ดูของที่เสีย หรือตั้งค่าอุปกรณ์ให้', weights: { craft: 3, tech: 2 } },
      { id: 'os-listen',  label: 'ฟังเรื่องที่ไม่สบายใจ', weights: { helping: 3, media: 1 } },
      { id: 'os-design',  label: 'เลือกสี จัดของ หรือแต่งให้ดูดีขึ้น', weights: { creative: 3, craft: 1, media: 1 } },
    ],
  },

  // ── Q15: ความท้าทายที่ดึงดูด ─────────────────────────────────────────────
  // Holland: approach tendency = ตัวชี้วัดที่น่าเชื่อถือกว่า avoidance tendency
  {
    id: 'challenge_attraction',
    kind: 'interest',
    question: 'ถ้ามีการแข่งขันให้เลือกลง 1 รายการ คุณจะเลือก...',
    options: [
      { id: 'ca-unknown',  label: 'ไขปริศนาที่ยังไม่มีใครแก้ได้', weights: { science: 3, data: 2 } },
      { id: 'ca-physical', label: 'ภารกิจที่ต้องใช้ร่างกายหรือความคล่องมือ', weights: { craft: 3, nature: 2 } },
      { id: 'ca-persuade', label: 'นำเสนอไอเดียให้กรรมการเชื่อ', weights: { business: 3, media: 2 } },
      { id: 'ca-blank',    label: 'ทำผลงานอะไรก็ได้ เริ่มจากกระดาษเปล่า', weights: { creative: 3, craft: 1 } },
    ],
  },

  // ── Q16: สิ่งที่ดึงดูดสายตาในชีวิตประจำวัน ──────────────────────────────
  // Holland: automatic attention = most reliable interest indicator
  // คนไม่รู้ตัวว่าตัวเองสังเกตอะไร — สิ่งที่ดึงสายตาโดยอัตโนมัติบอกโครงสร้างความสนใจแท้จริง
  {
    id: 'world_attention',
    kind: 'interest',
    question: 'ระหว่างเดินทางไปโรงเรียน คุณมักสังเกตอะไร?',
    options: [
      { id: 'wa-systems',  label: 'ว่าสิ่งต่าง ๆ ทำงานยังไง เช่น ไฟจราจร ประตูอัตโนมัติ', weights: { tech: 2, science: 2, data: 1 } },
      { id: 'wa-aesthetic',label: 'สี ป้าย การแต่งตัว หรือของที่ดูแปลกตา', weights: { creative: 3, craft: 1 } },
      { id: 'wa-people',   label: 'คนรอบ ๆ ว่ากำลังทำอะไร อารมณ์ไหน', weights: { helping: 3, media: 1, law: 1 } },
      { id: 'wa-living',   label: 'หมา แมว นก ต้นไม้ ท้องฟ้า', weights: { nature: 3, science: 2 } },
    ],
  },

  // ── Q17: ความหมายของงาน — Super Work Values ──────────────────────────────
  // Super (1990): work values ทำนาย career satisfaction ได้ดีกว่า ability matching
  {
    id: 'work_meaning',
    kind: 'interest',
    question: 'ทำงานชิ้นหนึ่งเสร็จ อะไรทำให้รู้สึกว่าคุ้มที่ทำ?',
    options: [
      { id: 'wm-grow',    label: 'ได้ทักษะหรือความรู้ใหม่ติดตัว', weights: { science: 2, data: 1, craft: 2 } },
      { id: 'wm-lasting', label: 'งานนั้นยังถูกใช้ต่อไปอีกนาน', weights: { craft: 2, tech: 2, business: 1 } },
      { id: 'wm-change',  label: 'เห็นว่ามีคนได้ประโยชน์จากมันจริง ๆ', weights: { helping: 3, nature: 1 } },
      { id: 'wm-mastery', label: 'ทำได้ในแบบที่คนอื่นทำไม่ค่อยได้', weights: { science: 2, data: 2, law: 2 } },
    ],
  },

  // ── Q18: ตัวยึดในการตัดสินใจ ─────────────────────────────────────────────
  // Holland C vs E: คนที่ยึดข้อมูล vs คนที่ยึดโอกาส แสดง Conventional vs Enterprising ชัด
  {
    id: 'decision_anchor',
    kind: 'interest',
    question: 'ต้องตัดสินใจเรื่องสำคัญ แต่ยังรู้ข้อมูลไม่หมด คุณจะ...',
    options: [
      { id: 'da-data',      label: 'หาข้อมูลเพิ่มอีกหน่อยก่อน', weights: { data: 3, science: 2, law: 1 } },
      { id: 'da-instinct',  label: 'เชื่อความรู้สึกจากที่เคยลองมา', weights: { craft: 2, creative: 1, science: 1 } },
      { id: 'da-trusted',   label: 'ถามคนที่ไว้ใจ', weights: { helping: 2, media: 1, business: 1 } },
      { id: 'da-fast',      label: 'เลือกไปก่อน ไม่ใช่ค่อยเปลี่ยน', weights: { business: 3, creative: 1 } },
    ],
  },

  // ── Q19: วิธีฟื้นคืนพลัง ──────────────────────────────────────────────────
  // Introversion/Extraversion (Big Five) + Work Environment Preference
  // สิ่งที่ฟื้นคืนพลังหลังจากเหนื่อยบอก energy source ที่แท้จริง
  {
    id: 'recharge_method',
    kind: 'interest',
    question: 'วันที่เหนื่อยมาก กลับถึงบ้านแล้วอยากทำอะไร?',
    options: [
      { id: 'rm-alone',    label: 'อยู่เงียบ ๆ คนเดียว อ่านหรือดูอะไรสักอย่าง', weights: { science: 2, data: 1, nature: 1 } },
      { id: 'rm-physical', label: 'ออกไปขยับตัว เดิน ปั่นจักรยาน หรือทำงานบ้าน', weights: { craft: 3, nature: 2 } },
      { id: 'rm-connect',  label: 'คุยกับคนที่สนิท', weights: { helping: 2, media: 2 } },
      { id: 'rm-project',  label: 'ทำเรื่องที่ตัวเองทำค้างไว้', weights: { creative: 2, science: 1, craft: 1 } },
    ],
  },

  // ── Q20: การเปลี่ยนแปลงในอุดมคติ ────────────────────────────────────────
  // Super: future orientation บอก underlying values ที่ลึกกว่าการถาม "คุณอยากทำอะไร"
  {
    id: 'ideal_change',
    kind: 'interest',
    question: 'ถ้าแก้อะไรในโรงเรียนหรือแถวบ้านได้ 1 อย่าง จะเลือกแบบไหน?',
    options: [
      { id: 'ic-system',  label: 'กฎหรือขั้นตอนที่ไม่แฟร์หรือยุ่งยากเกินไป', weights: { law: 3, data: 2, business: 1 } },
      { id: 'ic-access',  label: 'เรื่องที่คนส่วนใหญ่ไม่เข้าใจ ให้เข้าใจง่ายขึ้น', weights: { media: 3, tech: 2, helping: 1 } },
      { id: 'ic-people',  label: 'คนที่กำลังลำบาก ให้มีคนดูแลมากขึ้น', weights: { helping: 3, science: 1 } },
      { id: 'ic-nature',  label: 'ขยะ ต้นไม้ หรือสัตว์จรในพื้นที่', weights: { nature: 3, science: 2 } },
    ],
  },

  // ── Q21: การรับมือกับความเสี่ยง ──────────────────────────────────────────
  // Zuckerman (1994): sensation seeking / risk tolerance ทำนาย E vs C ได้ชัดมาก
  // Locus of control (Rotter, 1966): internal vs external
  {
    id: 'risk_orientation',
    kind: 'interest',
    question: 'มี 2 ทางให้เลือก: ทางแรกได้แน่นอนแต่ไม่มาก ทางที่สองอาจได้มากหรือไม่ได้เลย คุณมักจะ...',
    options: [
      { id: 'ro-analyze', label: 'เทียบข้อดีข้อเสียก่อนแล้วค่อยเลือก', weights: { data: 2, law: 2, science: 1 } },
      { id: 'ro-safe',    label: 'เลือกทางแรก', weights: { law: 3, data: 1 } },
      { id: 'ro-bold',    label: 'เลือกทางที่สอง', weights: { business: 3, creative: 1 } },
      { id: 'ro-values',  label: 'แล้วแต่ว่าเรื่องนั้นสำคัญกับเราแค่ไหน', weights: { helping: 2, creative: 1, science: 1 } },
    ],
  },

  // ── Q22: ความสบายใจกับระเบียบและโครงสร้าง ───────────────────────────────
  // Holland C vs A: structure preference เป็น discriminator ที่แม่นยำมาก
  {
    id: 'structure_comfort',
    kind: 'interest',
    question: 'แบบไหนที่คุณทำงานได้สบายที่สุด?',
    options: [
      { id: 'sc-rules',    label: 'มีขั้นตอนบอกชัดว่าต้องทำอะไรบ้าง', weights: { law: 3, data: 2 } },
      { id: 'sc-goal',     label: 'รู้ว่าต้องได้อะไร แต่วิธีทำเลือกเอง', weights: { business: 2, creative: 2 } },
      { id: 'sc-free',     label: 'ไม่มีกำหนดตายตัว เปลี่ยนแผนได้ตลอด', weights: { creative: 2, nature: 1, craft: 1 } },
      { id: 'sc-team',     label: 'ทุกคนในกลุ่มช่วยกันตัดสิน', weights: { helping: 2, business: 2, media: 1 } },
    ],
  },

  // ── Q23: ช่วงเวลาที่รู้สึกว่า "เกิดมาเพื่อสิ่งนี้" ─────────────────────
  // SCCT: peak performance experience = strongest self-efficacy signal
  {
    id: 'peak_performance',
    kind: 'interest',
    question: 'เคยมีตอนไหนที่รู้สึกว่า "อันนี้เราทำได้ดีนะ"?',
    options: [
      { id: 'pp-teach',   label: 'ตอนอธิบายแล้วเพื่อนเข้าใจ', weights: { helping: 3, media: 2 } },
      { id: 'pp-make',    label: 'ตอนทำงานชิ้นหนึ่งออกมาได้ถูกใจตัวเอง', weights: { creative: 3, craft: 2 } },
      { id: 'pp-solve',   label: 'ตอนคิดโจทย์ยาก ๆ ออก', weights: { science: 3, data: 2 } },
      { id: 'pp-lead',    label: 'ตอนพาทีมทำงานจนเสร็จ', weights: { business: 3, media: 1 } },
    ],
  },

  // ── Q24: มรดกที่อยากทิ้งไว้ ─────────────────────────────────────────────
  // Super: legacy value = core identity ที่ลึกที่สุด
  // คำถามนี้ให้มองไกลออกไป เพื่อหลุดจาก present-state bias
  {
    id: 'legacy_wish',
    kind: 'interest',
    question: 'ถ้าอีก 50 ปีมีคนพูดถึงคุณ อยากให้เขาพูดว่า...',
    options: [
      { id: 'lw-knowledge', label: '"เขาทำให้เราเข้าใจเรื่องนี้"', weights: { science: 3, media: 2, data: 1 } },
      { id: 'lw-creation',  label: '"ของที่เขาทำ ยังใช้กันอยู่ถึงทุกวันนี้"', weights: { craft: 3, tech: 2, business: 1 } },
      { id: 'lw-people',    label: '"ชีวิตฉันดีขึ้นเพราะเขา"', weights: { helping: 3, nature: 1 } },
      { id: 'lw-system',    label: '"ที่นี่มีได้เพราะเขาเริ่มไว้"', weights: { business: 3, law: 2 } },
    ],
  },

  // ── Q25: ปฏิกิริยาต่อความอยุติธรรม ──────────────────────────────────────
  // Moral foundations theory (Haidt, 2012): moral intuitions predict career domains
  // คนที่รู้สึกถึงความอยุติธรรมต่างกันจะถูกดึงไปสู่บทบาทที่ต่างกัน
  {
    id: 'fairness_response',
    kind: 'interest',
    question: 'มีกฎใหม่ในห้องที่ทำให้บางคนเสียเปรียบ คุณน่าจะ...',
    options: [
      { id: 'fr-analyze', label: 'หาว่ากฎนี้มาจากไหน แล้วเสนอวิธีที่ดีกว่า', weights: { law: 3, data: 2, science: 1 } },
      { id: 'fr-tell',    label: 'เล่าหรือโพสต์ให้คนอื่นรู้ว่าเกิดอะไรขึ้น', weights: { media: 3, helping: 2 } },
      { id: 'fr-help',    label: 'ไปคุยและช่วยคนที่เสียเปรียบก่อน', weights: { helping: 3, law: 1 } },
      { id: 'fr-build',   label: 'จัดแบบใหม่ขึ้นมาเองแล้วชวนคนมาใช้', weights: { business: 3, tech: 2, creative: 1 } },
    ],
  },

  // ── Q26: ความลึกกับความกว้าง ─────────────────────────────────────────────
  // Holland I vs C: breadth seekers (I) vs depth/mastery seekers (C)
  // Super: variety vs mastery work values
  {
    id: 'depth_vs_breadth',
    kind: 'interest',
    question: 'ช่วงปิดเทอม คุณอยากใช้เวลาแบบไหน?',
    options: [
      { id: 'db-wide',    label: 'ลองหลาย ๆ อย่าง อย่างละนิด', weights: { science: 2, creative: 2, media: 1 } },
      { id: 'db-deep',    label: 'ฝึกอย่างเดียวจนเก่งจริง ๆ', weights: { science: 2, data: 2, craft: 2 } },
      { id: 'db-result',  label: 'ทำอะไรที่นับได้ว่าก้าวหน้าไปเท่าไหร่', weights: { business: 2, data: 2, craft: 1 } },
      { id: 'db-connect', label: 'ทำกิจกรรมที่ได้เจอคนใหม่ ๆ หลายแบบ', weights: { helping: 2, media: 2, business: 1 } },
    ],
  },

  // ── Q27: ความสัมพันธ์กับโลกธรรมชาติ ─────────────────────────────────────
  // Holland R extended: nature orientation ไม่ใช่แค่ชอบออกกำลัง
  // แต่บ่งบอกว่าตัวเองเห็นตัวเองเป็นส่วนหนึ่งของสิ่งมีชีวิตหรือไม่
  {
    id: 'nature_relationship',
    kind: 'interest',
    question: 'ถ้าได้ไปเที่ยวป่าหรือทะเล 3 วัน คุณน่าจะ...',
    options: [
      { id: 'nr-bond',     label: 'สนุกมาก อยากอยู่นานกว่านั้น', weights: { nature: 3, craft: 1 } },
      { id: 'nr-science',  label: 'เดินดูว่ามีพืชหรือสัตว์อะไรบ้าง แล้วหาข้อมูลต่อ', weights: { science: 3, data: 1 } },
      { id: 'nr-beauty',   label: 'สนใจที่พัก สะพาน หรือของที่คนสร้างไว้มากกว่า', weights: { creative: 2, craft: 2 } },
      { id: 'nr-context',  label: 'ได้พักก็ดี แต่ 3 วันอาจนานไป', weights: { data: 2, tech: 2 } },
    ],
  },

  // ── Q28: รูปแบบการทำงานร่วมกัน ──────────────────────────────────────────
  // Holland S vs I: social density preference = strong discriminator
  // ถามว่า "รูปแบบไหนที่ทำได้ดีที่สุด" ไม่ใช่ "ชอบอยู่คนเดียวหรือกับคน"
  {
    id: 'collaboration_style',
    kind: 'interest',
    question: 'เวลามีงานกลุ่ม แบบไหนที่คุณทำได้ดีที่สุด?',
    options: [
      { id: 'cs-solo',    label: 'แยกไปทำส่วนของตัวเอง แล้วค่อยมารวม', weights: { science: 2, data: 2, craft: 2 } },
      { id: 'cs-small',   label: 'ทำกับเพื่อนสนิท 2–3 คน', weights: { helping: 2, business: 2, tech: 1 } },
      { id: 'cs-crowd',   label: 'ทำกับคนเยอะ ๆ คุยกันตลอด', weights: { media: 3, business: 2, helping: 1 } },
      { id: 'cs-lead',    label: 'เป็นคนกลางคอยประสานให้ทุกส่วนต่อกันได้', weights: { business: 3, media: 1, law: 1 } },
    ],
  },

  // ── Q29: จินตนาการทำงานอย่างไร ───────────────────────────────────────────
  // Gardner (1983): dominant intelligence แสดงออกผ่านการสร้างสรรค์
  // คำถามนี้แยก Logical-Mathematical vs Spatial vs Interpersonal vs Linguistic
  {
    id: 'imagination_type',
    kind: 'interest',
    question: 'เวลาต้องคิดไอเดียใหม่ คุณมักเริ่มจาก...',
    options: [
      { id: 'it-system',  label: 'เขียนขั้นตอนหรือผังว่าแต่ละส่วนต่อกันยังไง', weights: { tech: 2, data: 2, business: 1 } },
      { id: 'it-hands',   label: 'หยิบของมาลองทำเป็นแบบจำลองเลย', weights: { craft: 3, creative: 2 } },
      { id: 'it-vision',  label: 'นึกภาพผลลัพธ์ในหัวก่อน', weights: { creative: 3, science: 1 } },
      { id: 'it-connect', label: 'ชวนคนอื่นมาคุย แล้วรวมความคิดกัน', weights: { helping: 3, media: 2 } },
    ],
  },

  // ── Q30: การรับมือกับความล้มเหลว ─────────────────────────────────────────
  // Dweck (2006): growth mindset patterns บ่งบอก career resilience orientation
  // ปฏิกิริยาต่อความล้มเหลว = ตัวชี้วัดที่น่าเชื่อถือของ work values ที่แท้จริง
  {
    id: 'failure_response',
    kind: 'interest',
    question: 'ทำอะไรไปเยอะแล้วไม่สำเร็จ คุณมักจะ...',
    options: [
      { id: 'fr-analyze', label: 'ดูว่าพลาดตรงไหน จะได้ไม่พลาดอีก', weights: { data: 3, science: 2, law: 1 } },
      { id: 'fr-bounce',  label: 'ลองใหม่เลยด้วยวิธีอื่น', weights: { business: 3, craft: 2 } },
      { id: 'fr-reflect', label: 'พักก่อน แล้วค่อยกลับมาคิดใหม่', weights: { creative: 2, science: 2 } },
      { id: 'fr-share',   label: 'เล่าให้คนที่ไว้ใจฟัง', weights: { helping: 2, media: 2, business: 1 } },
    ],
  },

  // ── Q31: วิธีคิดก่อนแก้ปัญหา ─────────────────────────────────────────────
  // Holland I vs S: คำถามแรกที่ถามตัวเองก่อนแก้ปัญหาบ่งบอก orientation ชัดมาก
  {
    id: 'problem_frame',
    kind: 'interest',
    question: 'ก่อนเริ่มงานชิ้นใหม่ คำถามแรกในหัวคุณมักเป็น...',
    options: [
      { id: 'pf-root',    label: '"ปัญหาจริง ๆ คืออะไรกันแน่?"', weights: { science: 3, data: 2 } },
      { id: 'pf-people',  label: '"ใครเดือดร้อน แล้วเขาต้องการอะไร?"', weights: { helping: 3, media: 1 } },
      { id: 'pf-success', label: '"ทำแค่ไหนถึงจะเรียกว่าเสร็จ?"', weights: { data: 3, law: 2, business: 1 } },
      { id: 'pf-better',  label: '"มีใครเคยทำแบบนี้มาก่อนไหม?"', weights: { science: 2, craft: 1, business: 2 } },
    ],
  },

  // ── Q32: สิ่งที่สังเกตในเรื่องราวและสื่อ ─────────────────────────────────
  // Holland A vs S vs I: สิ่งที่จำจากสื่อบ่งบอก dominant processing mode ได้ชัด
  {
    id: 'story_attention',
    kind: 'interest',
    question: 'ดูหนังหรืออ่านนิยายจบ เรื่องที่คุณยังคิดต่อคือ...',
    options: [
      { id: 'sa-logic',   label: 'ทำไมตัวละครถึงตัดสินใจแบบนั้น', weights: { business: 2, science: 2, law: 1 } },
      { id: 'sa-world',   label: 'โลกในเรื่องมีกฎยังไง', weights: { science: 2, data: 2, tech: 1 } },
      { id: 'sa-emotion', label: 'ความสัมพันธ์ของตัวละคร', weights: { helping: 3, media: 2 } },
      { id: 'sa-craft',   label: 'ภาพ เพลง หรือวิธีเล่าเรื่อง', weights: { creative: 3, media: 2 } },
    ],
  },

  // ── Q33: ทิศทางที่มองในอนาคต ─────────────────────────────────────────────
  // Super (1990): life roles + time orientation
  // มองอนาคต 20 ปีโดยไม่ระบุอาชีพ ให้เห็น core life values ที่ซ่อนอยู่
  {
    id: 'future_vision',
    kind: 'interest',
    question: 'นึกถึงตัวเองตอนอายุ 35 อยากให้ชีวิตมีอะไรมากที่สุด?',
    options: [
      { id: 'fv-depth',   label: 'เก่งเรื่องหนึ่งมากจนคนมาถาม', weights: { science: 2, data: 2, craft: 2 } },
      { id: 'fv-build',   label: 'มีสิ่งที่ตัวเองเริ่มไว้ แล้วมันเดินต่อได้เอง', weights: { business: 3, tech: 1 } },
      { id: 'fv-bonds',   label: 'มีคนใกล้ชิดที่ผูกพันกันจริง ๆ', weights: { helping: 3, nature: 1 } },
      { id: 'fv-free',    label: 'ได้เลือกเองว่าจะทำอะไร เมื่อไหร่', weights: { creative: 2, business: 2, law: 1 } },
    ],
  },

  // ── Q34: สิ่งที่สังเกตในงานฝีมือและสิ่งประดิษฐ์ ─────────────────────────
  // Holland R: spatial intelligence แสดงออกผ่านสิ่งที่สังเกตในสิ่งที่สร้างขึ้น
  {
    id: 'craft_attention',
    kind: 'interest',
    question: 'ได้ของใช้ชิ้นใหม่มา (เช่น กระเป๋า ขวดน้ำ ของเล่น) สิ่งแรกที่คุณดูคือ...',
    options: [
      { id: 'cat-quality', label: 'ทำมาดีไหม แข็งแรง เนี้ยบไหม', weights: { craft: 3, data: 2 } },
      { id: 'cat-design',  label: 'ใช้ง่ายไหม ทำไมถึงออกแบบแบบนี้', weights: { tech: 2, creative: 2, data: 1 } },
      { id: 'cat-beauty',  label: 'สวยไหม ถือแล้วรู้สึกยังไง', weights: { creative: 3, craft: 1 } },
      { id: 'cat-solve',   label: 'ทำได้อย่างที่บอกไว้จริงหรือเปล่า', weights: { science: 2, law: 2, data: 1 } },
    ],
  },

  // ── Q35: จังหวะและระดับความเข้มข้น ──────────────────────────────────────
  // Super: work pace and intensity preference
  // คนที่ชอบงานช้าแต่ละเอียดกับคนที่ชอบงานเร็วแต่ยืดหยุ่น → different career fits
  {
    id: 'pace_preference',
    kind: 'interest',
    question: 'งานแบบไหนที่คุณทำแล้วรู้สึกเข้ากับตัวเอง?',
    options: [
      { id: 'pp-precise',  label: 'งานละเอียด ต้องเป๊ะ ผิดไม่ได้', weights: { data: 3, law: 2, craft: 2 } },
      { id: 'pp-fast',     label: 'งานเร็ว เปลี่ยนแผนได้ทันที', weights: { business: 3, tech: 1 } },
      { id: 'pp-creative', label: 'งานที่ต้องคิดอะไรใหม่ตลอด', weights: { creative: 3, science: 1 } },
      { id: 'pp-impact',   label: 'งานที่ได้เจอและคุยกับคนตลอด', weights: { helping: 3, media: 1 } },
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

  // normalize แบบสัมพัทธ์: มิติที่เด่นที่สุดของคนนี้ = 100
  // (คำตอบกระจายหลายมิติเสมอ ถ้าหารด้วยคะแนนเต็มทุกมิติจะต่ำจนเกณฑ์ "ความสนใจหลัก" ไม่เคยผ่าน
  //  และข้อที่ข้ามไม่ทำให้คะแนนลดลง)
  const top = Math.max(0, ...Object.values(raw));

  const dims = new Map<DimSlug, number>();
  for (const dim of ALL_DIMS) {
    dims.set(dim, top ? Math.round(((raw[dim] ?? 0) / top) * 100) : 0);
  }

  return { dims, gradeBand };
}
