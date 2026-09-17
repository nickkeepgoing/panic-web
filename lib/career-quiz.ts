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
    question: 'เมื่อมีเวลาว่างอย่างแท้จริง ไม่มีใครคาดหวังอะไร ความคิดของคุณมักล่องลอยไปทางไหน?',
    helper: 'ไม่ต้องคิดมาก — นึกถึงสิ่งที่เกิดขึ้นจริงโดยอัตโนมัติ',
    options: [
      { id: 'ad-make',    label: 'คิดถึงสิ่งที่อยากสร้าง ประกอบ ซ่อม หรือผลิตด้วยมือตัวเอง',            weights: { craft: 3, tech: 2 } },
      { id: 'ad-why',     label: 'สงสัยเรื่องที่ยังไม่รู้คำตอบ อยากค้นหาว่า "ทำไม" หรือ "เกิดขึ้นได้อย่างไร"', weights: { science: 3, data: 1 } },
      { id: 'ad-people',  label: 'นึกถึงคนอื่น อยากช่วย ดูแล หรือทำให้ใครสักคนรู้สึกดีขึ้น',             weights: { helping: 3, media: 1 } },
      { id: 'ad-express', label: 'อยากแสดงออกบางสิ่ง ผ่านเรื่องราว ภาพ เสียง หรือรูปแบบใดก็ได้',          weights: { creative: 3, media: 2 } },
    ],
  },

  // ── Q3: ความสนใจที่ลึก — สัญญาณ Investigative (Holland I) ───────────────
  // Holland: หัวข้อที่ค้นหาโดยไม่มีใครบอกบ่งบอก genuine intellectual interest
  {
    id: 'what_fascinates',
    kind: 'interest',
    question: 'หัวข้อแบบไหนที่ทำให้คุณดูดิ่ง ลืมเวลา แม้ไม่มีใครบอกให้ไปค้นหา?',
    options: [
      { id: 'wf-systems',  label: 'กลไก ระบบ หรือหลักการที่อธิบายว่าสิ่งต่างๆ ทำงานอย่างไร',          weights: { science: 3, tech: 2 } },
      { id: 'wf-people',   label: 'ผู้คน ความสัมพันธ์ และเรื่องราวของชีวิตจริง',                       weights: { helping: 2, media: 3 } },
      { id: 'wf-nature',   label: 'สิ่งมีชีวิต สภาพแวดล้อม และโลกธรรมชาติรอบตัวเรา',                 weights: { nature: 3, science: 2 } },
      { id: 'wf-patterns', label: 'รูปแบบ ตัวเลข หรือโครงสร้างที่ซ่อนอยู่ในสิ่งที่ดูเหมือนไม่มีความหมาย', weights: { data: 3, science: 2 } },
    ],
  },

  // ── Q4: Flow state — กิจกรรมที่ทำให้ "อยู่กับมัน" ────────────────────────
  // Csikszentmihalyi: ถามสัญญาณ flow ที่ชัดเจน ไม่ใช่การถามความชอบทั่วไป
  {
    id: 'flow_activity',
    kind: 'interest',
    question: 'กิจกรรมแบบไหนที่ทำให้คุณรู้สึก "อยู่กับมัน" อย่างสมบูรณ์ จนลืมเวลาและสิ่งรอบข้าง?',
    options: [
      { id: 'fa-build',   label: 'ค่อยๆ สร้างหรือแก้ไขบางอย่างด้วยมือ และเห็นมันเปลี่ยนแปลงไปทีละนิด', weights: { craft: 3, tech: 2 } },
      { id: 'fa-analyze', label: 'คิดวิเคราะห์ปัญหาซับซ้อน แล้วค่อยๆ เห็นรูปแบบหรือคำตอบชัดขึ้น',        weights: { science: 2, data: 3 } },
      { id: 'fa-teach',   label: 'อธิบาย ถ่ายทอด หรือสอนบางอย่างจนคนอื่นเข้าใจจริงๆ',                  weights: { helping: 3, media: 2 } },
      { id: 'fa-create',  label: 'สร้างสรรค์งานที่แสดงออกถึงสิ่งที่รู้สึกหรือมองเห็น',                   weights: { creative: 3, craft: 1 } },
    ],
  },

  // ── Q5: สัญชาตญาณต่อสิ่งผิดปกติ ─────────────────────────────────────────
  // SCCT: self-efficacy แสดงออกผ่านสิ่งที่ทำเมื่อไม่มีใครบอก
  // Investigative vs Realistic vs Social responses
  {
    id: 'problem_instinct',
    kind: 'interest',
    question: 'เมื่อเห็นบางอย่างที่ดูผิดปกติหรือไม่ทำงานถูกต้อง สัญชาตญาณแรกของคุณคืออะไร?',
    options: [
      { id: 'pi-analyze', label: 'อยากแยกแยะ ค้นหา และเข้าใจว่า "สาเหตุที่แท้จริง" คืออะไร',            weights: { science: 3, data: 2 } },
      { id: 'pi-fix',     label: 'อยากลองแตะ ปรับ หรือแก้ไขมันทันทีด้วยมือตัวเอง',                     weights: { craft: 3, tech: 2 } },
      { id: 'pi-ask',     label: 'อยากถามคนที่เกี่ยวข้องว่ารู้สึกอย่างไรกับสิ่งที่เกิดขึ้น',             weights: { helping: 2, media: 2, law: 1 } },
      { id: 'pi-invent',  label: 'อยากสร้างวิธีแก้ใหม่ที่ไม่เหมือนวิธีที่คนอื่นเคยลอง',                 weights: { creative: 3, business: 2 } },
    ],
  },

  // ── Q6: การรับมือกับความคลุมเครือ ────────────────────────────────────────
  // Budner (1962): tolerance for ambiguity ทำนาย Holland type ได้ชัดมาก
  // Savickas: career adaptability วัดจากการตอบสนองต่อสิ่งที่ไม่รู้จัก
  {
    id: 'unknown_territory',
    kind: 'interest',
    question: 'เมื่อต้องทำงานโดยไม่มีคู่มือ ไม่มีแบบอย่าง และไม่รู้ว่าผลจะออกมาอย่างไร คุณรู้สึกอย่างไร?',
    options: [
      { id: 'ut-thrive',    label: 'ตื่นเต้น — นี่คือพื้นที่ที่ทำให้ตัวเองคิดได้ดีที่สุด',              weights: { creative: 2, science: 2, business: 1 } },
      { id: 'ut-structure', label: 'ไม่สบายใจเล็กน้อย แต่ทันทีที่สร้างโครงสร้างของตัวเองได้ ก็เดินหน้าต่อ', weights: { data: 3, law: 2 } },
      { id: 'ut-consult',   label: 'มองหาคนที่ผ่านสถานการณ์คล้ายกันมาก่อน แล้วเรียนรู้จากเขา',           weights: { helping: 1, science: 1, business: 2 } },
      { id: 'ut-dive',      label: 'ดำดิ่งเข้าไปเลย ลองผิดลองถูก แล้วค่อยปรับทีหลัง',                   weights: { craft: 2, tech: 2, creative: 1 } },
    ],
  },

  // ── Q7: ความรู้สึกสำเร็จที่ลึกที่สุด ────────────────────────────────────
  // Super: peak experience บอก core values และ genuine abilities
  {
    id: 'satisfaction_peak',
    kind: 'interest',
    question: 'ความรู้สึก "ฉันทำสำเร็จ" ที่ลึกที่สุดในชีวิตของคุณมักเกิดขึ้นเมื่อ...',
    options: [
      { id: 'sp-understood', label: 'เข้าใจบางอย่างที่ซับซ้อนจนเห็นภาพรวมชัดเจน',           weights: { science: 3, data: 2 } },
      { id: 'sp-made',       label: 'สิ่งที่สร้างหรือซ่อมแซมด้วยมือตัวเองออกมาทำงานได้จริง', weights: { craft: 3, tech: 2 } },
      { id: 'sp-helped',     label: 'ช่วยให้ใครสักคนผ่านพ้นสิ่งที่ยากไปได้',                 weights: { helping: 3, media: 1 } },
      { id: 'sp-led',        label: 'นำทีมหรือโครงการไปถึงเป้าหมายที่ตั้งไว้',                weights: { business: 3, media: 2 } },
    ],
  },

  // ── Q8: วิธีเรียนรู้ที่ได้ผลดีที่สุด ────────────────────────────────────
  // Kolb (1984): learning styles ทำนาย Holland types ได้
  // R → experiential, I → reflective, A → diverger, C → assimilator
  {
    id: 'learning_mode',
    kind: 'interest',
    question: 'เมื่อต้องเรียนรู้ทักษะหรือแนวคิดใหม่ที่ยาก คุณเรียนรู้ได้เร็วที่สุดเมื่อ...',
    options: [
      { id: 'lm-theory', label: 'ศึกษาทฤษฎีและหลักการให้เข้าใจก่อน แล้วจึงลงมือปฏิบัติ', weights: { science: 2, data: 2, law: 1 } },
      { id: 'lm-do',     label: 'ลองทำทันที เรียนรู้จากข้อผิดพลาดที่เกิดขึ้นจริง',        weights: { craft: 3, tech: 2 } },
      { id: 'lm-watch',  label: 'ดูหรือฟังคนที่ทำได้ดีก่อน แล้วค่อยลองทำตาม',             weights: { helping: 1, media: 2, craft: 1 } },
      { id: 'lm-explore',label: 'สำรวจเองอย่างอิสระ ไม่มีเส้นทางตายตัว',                  weights: { creative: 2, science: 2, nature: 1 } },
    ],
  },

  // ── Q9: บทบาทที่ธรรมชาติดึงไป ───────────────────────────────────────────
  // Holland: perceived social role = strong predictor (กำหนดโดยคนอื่น ไม่ใช่ตัวเอง)
  {
    id: 'natural_role',
    kind: 'interest',
    question: 'ในสถานการณ์กลุ่มที่ต้องร่วมกันแก้ปัญหา คุณมักถูก "ดึง" ไปสู่บทบาทใดโดยธรรมชาติ?',
    options: [
      { id: 'nr-analyst', label: 'คนที่ตรวจสอบข้อเท็จจริง วิเคราะห์ และบอกว่าเกิดอะไรขึ้นจริง',       weights: { data: 3, science: 2, law: 1 } },
      { id: 'nr-maker',   label: 'คนที่ลงมือแก้ปัญหาเฉพาะหน้าด้วยทักษะที่ตัวเองมี',                  weights: { craft: 3, tech: 2 } },
      { id: 'nr-bridge',  label: 'คนที่ดูแลให้ทุกคนรู้สึกว่าตัวเองมีคุณค่าและทำงานร่วมกันได้',         weights: { helping: 3, media: 2 } },
      { id: 'nr-compass', label: 'คนที่มองภาพรวม ชี้ทิศทาง และผลักดันให้ทีมเดินไปข้างหน้า',           weights: { business: 3, media: 1 } },
    ],
  },

  // ── Q10: วิธีถ่ายทอดที่ถนัดที่สุด ───────────────────────────────────────
  // Gardner (1983): Multiple Intelligences — วิธีถ่ายทอดสะท้อน dominant intelligence
  {
    id: 'how_you_explain',
    kind: 'interest',
    question: 'เมื่อต้องทำให้คนอื่นเข้าใจบางอย่างที่ซับซ้อน วิธีที่คุณมักเลือกโดยอัตโนมัติคือ...',
    options: [
      { id: 'he-logic',  label: 'อธิบายด้วยตรรกะและโครงสร้างที่ชัดเจน ทีละขั้นตอน',                  weights: { data: 2, law: 2, science: 1 } },
      { id: 'he-show',   label: 'วาด สาธิต หรือสร้างตัวอย่างที่จับต้องได้ให้เห็นเลย',                  weights: { creative: 2, craft: 3 } },
      { id: 'he-story',  label: 'เล่าเรื่องหรือยกตัวอย่างที่ทำให้คนอื่นรู้สึกและจำได้',               weights: { media: 3, helping: 2 } },
      { id: 'he-direct', label: 'พูดตรงๆ สั้น ให้ข้อมูลที่จำเป็น ไม่ประดับประดา',                     weights: { data: 2, business: 2 } },
    ],
  },

  // ── Q11: สภาพแวดล้อมที่ทำให้ทำงานได้ดีที่สุด ────────────────────────────
  // Kristof (1996): Person-Environment Fit — setting preference predicts satisfaction
  {
    id: 'best_environment',
    kind: 'interest',
    question: 'สภาพแวดล้อมแบบไหนที่ทำให้คุณทำงานได้ดีที่สุดอย่างสม่ำเสมอ?',
    options: [
      { id: 'be-quiet',  label: 'เงียบ เป็นระเบียบ มีสมาธิ ไม่มีการรบกวน',                            weights: { data: 3, science: 2, law: 1 } },
      { id: 'be-alive',  label: 'มีชีวิตชีวา พลุกพล่าน ได้พูดคุยและรับพลังจากคนรอบข้าง',              weights: { business: 2, helping: 2, media: 2 } },
      { id: 'be-hands',  label: 'ได้ทำงานกับสิ่งที่จับต้องได้ มีพื้นที่และวัสดุจริง',                  weights: { craft: 3, nature: 2 } },
      { id: 'be-fluid',  label: 'ยืดหยุ่น ท้าทาย ไม่รู้ว่าวันพรุ่งนี้จะเจอกับอะไร',                  weights: { creative: 2, business: 2 } },
    ],
  },

  // ── Q12: สิ่งที่ทำให้หมดแรง แม้ทำได้ดี ──────────────────────────────────
  // Super Work Values: สิ่งที่ทำให้เบื่อบอก values ที่ขาดหายได้ชัดกว่าการถามตรงๆ
  {
    id: 'what_drains',
    kind: 'interest',
    question: 'สิ่งที่ทำให้คุณหมดแรงจากงานเร็วที่สุด แม้จะทำมันได้ดีก็ตาม คือ...',
    options: [
      { id: 'wd-repeat',   label: 'งานที่ทำซ้ำซากโดยไม่ต้องใช้ความคิดหรือตัดสินใจ',                   weights: { creative: 2, science: 2, business: 1 } },
      { id: 'wd-solo',     label: 'งานที่ต้องทำคนเดียวนานๆ โดยไม่มีการพูดคุยหรือแลกเปลี่ยน',           weights: { helping: 2, media: 2, business: 1 } },
      { id: 'wd-caged',    label: 'งานที่ถูกควบคุมมากเกินไป ไม่มีพื้นที่ตัดสินใจเอง',                  weights: { creative: 2, craft: 1, business: 1 } },
      { id: 'wd-unclear',  label: 'งานที่ไม่มีเป้าหมายชัดเจน หรือไม่รู้ว่ากำลังก้าวหน้าหรือเปล่า',    weights: { data: 2, law: 2, science: 1 } },
    ],
  },

  // ── Q13: แรงจูงใจภายใน — SDT ────────────────────────────────────────────
  // Deci & Ryan (1985): intrinsic motivation คือ predictor ที่แม่นยำที่สุด
  // ถามสิ่งที่ทำโดยไม่มีใครสั่งและไม่มีรางวัล = แรงจูงใจภายในแท้จริง
  {
    id: 'intrinsic_pull',
    kind: 'interest',
    question: 'อะไรที่ทำให้คุณลุกขึ้นทำบางอย่างโดยไม่มีใครบังคับหรือให้รางวัล?',
    helper: 'นักจิตวิทยา Deci & Ryan เรียกสิ่งนี้ว่า "แรงจูงใจภายใน" — สัญญาณที่แม่นยำกว่าการถามความชอบ',
    options: [
      { id: 'ip-curiosity', label: 'ความอยากรู้ว่า "ทำไม" หรือ "มันทำงานยังไง"',                       weights: { science: 3, data: 2 } },
      { id: 'ip-create',    label: 'โอกาสสร้างหรือพัฒนาบางอย่างที่ยังไม่มีอยู่',                        weights: { craft: 2, tech: 2, creative: 2 } },
      { id: 'ip-impact',    label: 'รู้ว่าสิ่งที่ทำจะทำให้ชีวิตของใครสักคนดีขึ้นจริงๆ',                 weights: { helping: 3, media: 1 } },
      { id: 'ip-challenge', label: 'ท้าทายที่ต้องใช้ทั้งความกล้าและความสามารถของตัวเอง',                 weights: { business: 3, law: 1 } },
    ],
  },

  // ── Q14: SCCT — สิ่งที่คนอื่นขอจากคุณ ───────────────────────────────────
  // Lent et al. (1994): perceived competence from others = reliable self-efficacy signal
  // สิ่งที่คนขอโดยไม่ได้บอก = ความสามารถที่คนอื่นมองเห็นก่อนตัวเอง
  {
    id: 'others_seek_you',
    kind: 'interest',
    question: 'คนรอบข้างมักขอให้คุณช่วยเรื่องอะไรโดยอัตโนมัติ แม้คุณไม่ได้เสนอตัว?',
    options: [
      { id: 'os-explain', label: 'อธิบายสิ่งที่ซับซ้อนให้เข้าใจง่ายขึ้น หรือแก้ปัญหาที่คนอื่นคิดไม่ออก', weights: { science: 2, data: 2, media: 1 } },
      { id: 'os-repair',  label: 'ซ่อม แก้ไข หรือทำให้สิ่งที่พังกลับมาทำงานได้',                       weights: { craft: 3, tech: 2 } },
      { id: 'os-listen',  label: 'ฟัง รับฟัง และช่วยให้ตัดสินใจเรื่องยากๆ ในชีวิต',                    weights: { helping: 3, media: 1 } },
      { id: 'os-design',  label: 'ออกแบบ ตกแต่ง หรือทำให้บางอย่างดูหรือรู้สึกดีขึ้น',                  weights: { creative: 3, craft: 1, media: 1 } },
    ],
  },

  // ── Q15: ความท้าทายที่ดึงดูด ─────────────────────────────────────────────
  // Holland: approach tendency = ตัวชี้วัดที่น่าเชื่อถือกว่า avoidance tendency
  {
    id: 'challenge_attraction',
    kind: 'interest',
    question: 'ความท้าทายแบบไหนที่ทำให้คุณรู้สึกอยากเดินเข้าหา ไม่ใช่หลีกเลี่ยง?',
    options: [
      { id: 'ca-unknown',  label: 'หาคำตอบที่ยังไม่มีใครรู้ หรือพิสูจน์บางสิ่งจากศูนย์',              weights: { science: 3, data: 2 } },
      { id: 'ca-physical', label: 'ทดสอบขีดจำกัดของทักษะมือหรือร่างกายของตัวเอง',                     weights: { craft: 3, nature: 2 } },
      { id: 'ca-persuade', label: 'โน้มน้าว สร้างความเชื่อมั่น หรือทำให้คนยอมรับแนวคิดใหม่',          weights: { business: 3, media: 2 } },
      { id: 'ca-blank',    label: 'สร้างบางอย่างจากความว่างเปล่า โดยไม่มีกรอบกำหนด',                  weights: { creative: 3, craft: 1 } },
    ],
  },

  // ── Q16: สิ่งที่ดึงดูดสายตาในชีวิตประจำวัน ──────────────────────────────
  // Holland: automatic attention = most reliable interest indicator
  // คนไม่รู้ตัวว่าตัวเองสังเกตอะไร — สิ่งที่ดึงสายตาโดยอัตโนมัติบอกโครงสร้างความสนใจแท้จริง
  {
    id: 'world_attention',
    kind: 'interest',
    question: 'เมื่อเดินผ่านสถานที่ต่างๆ ในชีวิตประจำวัน อะไรดึงดูดสายตาและความคิดคุณโดยอัตโนมัติ?',
    options: [
      { id: 'wa-systems',  label: 'กลไก โครงสร้าง หรือระบบที่อยู่เบื้องหลังสิ่งที่มองเห็น',          weights: { tech: 2, science: 2, data: 1 } },
      { id: 'wa-aesthetic',label: 'รูปร่าง สี พื้นผิว และรายละเอียดที่ทำให้สิ่งต่างๆ น่าสนใจหรืองดงาม', weights: { creative: 3, craft: 1 } },
      { id: 'wa-people',   label: 'ผู้คน การแสดงออก และสิ่งที่พวกเขาต้องการหรือรู้สึก',               weights: { helping: 3, media: 1, law: 1 } },
      { id: 'wa-living',   label: 'สิ่งมีชีวิต ต้นไม้ สัตว์ และความสัมพันธ์ระหว่างสิ่งมีชีวิตกับสภาพแวดล้อม', weights: { nature: 3, science: 2 } },
    ],
  },

  // ── Q17: ความหมายของงาน — Super Work Values ──────────────────────────────
  // Super (1990): work values ทำนาย career satisfaction ได้ดีกว่า ability matching
  {
    id: 'work_meaning',
    kind: 'interest',
    question: 'สิ่งที่ทำให้คุณรู้สึกว่างานที่ทำ "คุ้มค่า" จริงๆ คืออะไร?',
    options: [
      { id: 'wm-grow',    label: 'ได้พัฒนาความสามารถและความรู้ใหม่ในตัวเอง',                           weights: { science: 2, data: 1, craft: 2 } },
      { id: 'wm-lasting', label: 'สิ่งที่สร้างไว้ยังคงอยู่และมีคนใช้ประโยชน์จากมันต่อ',                weights: { craft: 2, tech: 2, business: 1 } },
      { id: 'wm-change',  label: 'ส่งผลกระทบต่อชีวิตหรือความเป็นอยู่ของคนอื่นโดยตรงและจับต้องได้',     weights: { helping: 3, nature: 1 } },
      { id: 'wm-mastery', label: 'ทำในสิ่งที่คนอื่นทำได้น้อยคนนัก และเป็นที่พึ่งพาได้',               weights: { science: 2, data: 2, law: 2 } },
    ],
  },

  // ── Q18: ตัวยึดในการตัดสินใจ ─────────────────────────────────────────────
  // Holland C vs E: คนที่ยึดข้อมูล vs คนที่ยึดโอกาส แสดง Conventional vs Enterprising ชัด
  {
    id: 'decision_anchor',
    kind: 'interest',
    question: 'เมื่อต้องตัดสินใจสำคัญโดยไม่มีข้อมูลครบ คุณยึดอะไรเป็นหลัก?',
    options: [
      { id: 'da-data',      label: 'รวบรวมข้อมูลเพิ่มจนมั่นใจพอ แม้ต้องใช้เวลา',                       weights: { data: 3, science: 2, law: 1 } },
      { id: 'da-instinct',  label: 'ประสบการณ์และสัญชาตญาณที่สะสมมาจากการลงมือทำจริงๆ',                weights: { craft: 2, creative: 1, science: 1 } },
      { id: 'da-trusted',   label: 'มุมมองของคนที่ตัวเองไว้วางใจและเคารพ',                              weights: { helping: 2, media: 1, business: 1 } },
      { id: 'da-fast',      label: 'ตัดสินใจเร็วและพร้อมปรับแก้ถ้าผลลัพธ์ไม่เป็นอย่างที่คาด',           weights: { business: 3, creative: 1 } },
    ],
  },

  // ── Q19: วิธีฟื้นคืนพลัง ──────────────────────────────────────────────────
  // Introversion/Extraversion (Big Five) + Work Environment Preference
  // สิ่งที่ฟื้นคืนพลังหลังจากเหนื่อยบอก energy source ที่แท้จริง
  {
    id: 'recharge_method',
    kind: 'interest',
    question: 'หลังจากวันที่เหนื่อยมาก สิ่งที่ช่วยให้คุณฟื้นคืนพลังกลับมาได้จริงๆ คือ...',
    options: [
      { id: 'rm-alone',    label: 'อยู่คนเดียวในที่เงียบ มีเวลาคิดหรืออ่านตามลำพัง',                   weights: { science: 2, data: 1, nature: 1 } },
      { id: 'rm-physical', label: 'ทำบางอย่างด้วยมือหรือร่างกาย ไม่ว่าจะเป็นอะไรก็ตาม',                weights: { craft: 3, nature: 2 } },
      { id: 'rm-connect',  label: 'พูดคุย แบ่งปัน หรืออยู่กับคนที่ทำให้รู้สึกเป็นตัวเอง',               weights: { helping: 2, media: 2 } },
      { id: 'rm-project',  label: 'ลงมือทำโปรเจกต์ส่วนตัวที่อยากทำมานาน',                              weights: { creative: 2, science: 1, craft: 1 } },
    ],
  },

  // ── Q20: การเปลี่ยนแปลงในอุดมคติ ────────────────────────────────────────
  // Super: future orientation บอก underlying values ที่ลึกกว่าการถาม "คุณอยากทำอะไร"
  {
    id: 'ideal_change',
    kind: 'interest',
    question: 'ถ้าการกระทำของคุณเปลี่ยนบางอย่างได้จริง คุณอยากให้มันเป็นการเปลี่ยนแปลงแบบไหน?',
    options: [
      { id: 'ic-system',  label: 'ทำให้ระบบหรือกระบวนการมีความยุติธรรมหรือมีประสิทธิภาพมากขึ้น',         weights: { law: 3, data: 2, business: 1 } },
      { id: 'ic-access',  label: 'ทำให้สิ่งที่ซับซ้อนกลายเป็นสิ่งที่คนทั่วไปเข้าถึงและเข้าใจได้',       weights: { media: 3, tech: 2, helping: 1 } },
      { id: 'ic-people',  label: 'ทำให้ชีวิตของคนที่กำลังเจ็บปวดหรือต้องการช่วยเหลือดีขึ้นจริงๆ',       weights: { helping: 3, science: 1 } },
      { id: 'ic-nature',  label: 'ทำให้โลกธรรมชาติและสิ่งมีชีวิตอยู่รอดและเติบโตได้ดีกว่าเดิม',         weights: { nature: 3, science: 2 } },
    ],
  },

  // ── Q21: การรับมือกับความเสี่ยง ──────────────────────────────────────────
  // Zuckerman (1994): sensation seeking / risk tolerance ทำนาย E vs C ได้ชัดมาก
  // Locus of control (Rotter, 1966): internal vs external
  {
    id: 'risk_orientation',
    kind: 'interest',
    question: 'เมื่อต้องเลือกระหว่างทางที่ผลตอบแทนสูงแต่ไม่แน่นอน กับทางที่ผลน้อยกว่าแต่มั่นคงกว่า คุณมักทำอย่างไร?',
    options: [
      { id: 'ro-analyze', label: 'วิเคราะห์ความเสี่ยงให้ละเอียดก่อน แล้วเลือกตามที่ข้อมูลบอก',          weights: { data: 2, law: 2, science: 1 } },
      { id: 'ro-safe',    label: 'มักเลือกทางที่มั่นคงกว่า เพราะความแน่นอนทำให้ทำงานได้ดีกว่า',          weights: { law: 3, data: 1 } },
      { id: 'ro-bold',    label: 'มักเลือกทางที่ท้าทายกว่า เพราะโอกาสที่ดีไม่ได้มาบ่อยๆ',               weights: { business: 3, creative: 1 } },
      { id: 'ro-values',  label: 'ขึ้นอยู่กับว่าสิ่งที่เสี่ยงนั้นสำคัญและมีความหมายต่อตัวเองมากแค่ไหน', weights: { helping: 2, creative: 1, science: 1 } },
    ],
  },

  // ── Q22: ความสบายใจกับระเบียบและโครงสร้าง ───────────────────────────────
  // Holland C vs A: structure preference เป็น discriminator ที่แม่นยำมาก
  {
    id: 'structure_comfort',
    kind: 'interest',
    question: 'คุณรู้สึกสบายใจและทำงานได้ดีที่สุดเมื่อ...',
    options: [
      { id: 'sc-rules',    label: 'มีขั้นตอน กฎ และมาตรฐานที่ชัดเจนให้ปฏิบัติตาม',                     weights: { law: 3, data: 2 } },
      { id: 'sc-goal',     label: 'มีเป้าหมายชัดแต่เลือกเส้นทางได้เอง',                                 weights: { business: 2, creative: 2 } },
      { id: 'sc-free',     label: 'ทุกอย่างยืดหยุ่น ปรับแผนได้ตลอดตามสถานการณ์',                        weights: { creative: 2, nature: 1, craft: 1 } },
      { id: 'sc-team',     label: 'มีโครงสร้างหลวมๆ และทีมตัดสินใจร่วมกัน',                             weights: { helping: 2, business: 2, media: 1 } },
    ],
  },

  // ── Q23: ช่วงเวลาที่รู้สึกว่า "เกิดมาเพื่อสิ่งนี้" ─────────────────────
  // SCCT: peak performance experience = strongest self-efficacy signal
  {
    id: 'peak_performance',
    kind: 'interest',
    question: 'ประสบการณ์ที่ทำให้คุณรู้สึกว่า "ฉันเกิดมาเพื่อสิ่งนี้" หรือ "ฉันทำสิ่งนี้ได้ดีจริงๆ" คือ...',
    options: [
      { id: 'pp-teach',   label: 'ตอนที่อธิบายบางอย่างได้จนคนฟังเปลี่ยนความเข้าใจหรือมองเห็นสิ่งใหม่',  weights: { helping: 3, media: 2 } },
      { id: 'pp-make',    label: 'ตอนที่สร้างบางอย่างออกมาได้ในแบบที่ตัวเองพอใจอย่างแท้จริง',            weights: { creative: 3, craft: 2 } },
      { id: 'pp-solve',   label: 'ตอนที่แก้ปัญหาซับซ้อนและเห็นคำตอบที่ชัดเจนจากความยุ่งเหยิง',           weights: { science: 3, data: 2 } },
      { id: 'pp-lead',    label: 'ตอนที่นำทีมหรือสถานการณ์ไปสู่ผลลัพธ์ที่วางไว้',                       weights: { business: 3, media: 1 } },
    ],
  },

  // ── Q24: มรดกที่อยากทิ้งไว้ ─────────────────────────────────────────────
  // Super: legacy value = core identity ที่ลึกที่สุด
  // คำถามนี้ให้มองไกลออกไป เพื่อหลุดจาก present-state bias
  {
    id: 'legacy_wish',
    kind: 'interest',
    question: 'ถ้าคนรุ่นหลังจดจำสิ่งที่คุณทิ้งไว้ในโลก คุณอยากให้มันเป็นอะไร?',
    helper: 'ไม่ต้องคิดว่าควรจะตอบอะไร — เลือกตามที่รู้สึกจริงๆ',
    options: [
      { id: 'lw-knowledge', label: 'ความรู้หรือความเข้าใจที่ช่วยให้คนอื่นมองเห็นโลกได้ชัดและลึกขึ้น',    weights: { science: 3, media: 2, data: 1 } },
      { id: 'lw-creation',  label: 'งาน สิ่งประดิษฐ์ หรือโครงสร้างที่ยังคงทำประโยชน์อยู่',               weights: { craft: 3, tech: 2, business: 1 } },
      { id: 'lw-people',    label: 'คนที่ชีวิตดีขึ้นเพราะสิ่งที่คุณทำให้พวกเขาโดยตรง',                   weights: { helping: 3, nature: 1 } },
      { id: 'lw-system',    label: 'ระบบหรือองค์กรที่สร้างคุณค่าได้แม้คุณไม่อยู่แล้ว',                    weights: { business: 3, law: 2 } },
    ],
  },

  // ── Q25: ปฏิกิริยาต่อความอยุติธรรม ──────────────────────────────────────
  // Moral foundations theory (Haidt, 2012): moral intuitions predict career domains
  // คนที่รู้สึกถึงความอยุติธรรมต่างกันจะถูกดึงไปสู่บทบาทที่ต่างกัน
  {
    id: 'fairness_response',
    kind: 'interest',
    question: 'เมื่อเห็นสถานการณ์ที่ไม่ยุติธรรมหรือระบบที่ทำงานผิดพลาด ปฏิกิริยาแรกของคุณคืออะไร?',
    options: [
      { id: 'fr-analyze', label: 'อยากวิเคราะห์ว่าทำไมถึงเป็นแบบนี้ และหาวิธีแก้ที่ยั่งยืน',            weights: { law: 3, data: 2, science: 1 } },
      { id: 'fr-tell',    label: 'อยากสื่อสารและบอกเล่าให้คนอื่นรู้และเข้าใจสิ่งที่เกิดขึ้น',             weights: { media: 3, helping: 2 } },
      { id: 'fr-help',    label: 'อยากลงมือช่วยคนที่ได้รับผลกระทบโดยตรงทันที',                           weights: { helping: 3, law: 1 } },
      { id: 'fr-build',   label: 'อยากสร้างทางเลือกหรือระบบที่ดีกว่าแทนของเดิม',                          weights: { business: 3, tech: 2, creative: 1 } },
    ],
  },

  // ── Q26: ความลึกกับความกว้าง ─────────────────────────────────────────────
  // Holland I vs C: breadth seekers (I) vs depth/mastery seekers (C)
  // Super: variety vs mastery work values
  {
    id: 'depth_vs_breadth',
    kind: 'interest',
    question: 'ในการเรียนรู้หรือการทำงาน คุณรู้สึกพอใจมากกว่าเมื่อ...',
    options: [
      { id: 'db-wide',    label: 'ได้สำรวจหัวข้อหลากหลาย ค้นพบความเชื่อมโยง และเรียนรู้กว้างๆ',         weights: { science: 2, creative: 2, media: 1 } },
      { id: 'db-deep',    label: 'ขุดลึกในเรื่องเดียวจนเชี่ยวชาญและเป็นที่พึ่งพาของคนอื่นได้',            weights: { science: 2, data: 2, craft: 2 } },
      { id: 'db-result',  label: 'เห็นผลลัพธ์ของงานเร็ว และวัดความก้าวหน้าได้ชัดเจน',                    weights: { business: 2, data: 2, craft: 1 } },
      { id: 'db-connect', label: 'ได้ทำงานที่เชื่อมต่อกับคนหลากหลายและต้องใช้ทักษะหลายด้าน',              weights: { helping: 2, media: 2, business: 1 } },
    ],
  },

  // ── Q27: ความสัมพันธ์กับโลกธรรมชาติ ─────────────────────────────────────
  // Holland R extended: nature orientation ไม่ใช่แค่ชอบออกกำลัง
  // แต่บ่งบอกว่าตัวเองเห็นตัวเองเป็นส่วนหนึ่งของสิ่งมีชีวิตหรือไม่
  {
    id: 'nature_relationship',
    kind: 'interest',
    question: 'ความสัมพันธ์ของคุณกับโลกธรรมชาติ สิ่งมีชีวิต และสภาพแวดล้อมเป็นอย่างไร?',
    options: [
      { id: 'nr-bond',     label: 'รู้สึกผูกพันและมีพลังเมื่ออยู่ในธรรมชาติ มันสำคัญต่อชีวิตฉันมาก',     weights: { nature: 3, craft: 1 } },
      { id: 'nr-science',  label: 'สนใจจากมุมมองทางวิเคราะห์ อยากเข้าใจมันมากกว่าแค่เพลิดเพลิน',         weights: { science: 3, data: 1 } },
      { id: 'nr-beauty',   label: 'ชื่นชมและรู้สึกได้ถึงความงาม แต่สนใจในสิ่งที่มนุษย์สร้างมากกว่า',     weights: { creative: 2, craft: 2 } },
      { id: 'nr-context',  label: 'เป็นพื้นที่ที่ดีสำหรับคิดทบทวน แต่ไม่ใช่สิ่งที่ขับเคลื่อนความสนใจหลักของฉัน', weights: { data: 2, tech: 2 } },
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
