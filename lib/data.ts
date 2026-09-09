import { hasSupabase } from './supabase/config';
import { anonClient } from './supabase/server';
import type { Competition, Project } from './types';

// ------------------------------------------------------------------
// ข้อมูลตัวอย่าง 8 โครงงาน — ใช้ตอนยังไม่ต่อ Supabase เพื่อให้ npm run dev
// เห็นหน้าเว็บทำงานจริงได้ทันที ตัวเลขและเนื้อหาชุดเดียวกับใน db/seed.sql
// ------------------------------------------------------------------
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1', slug: 'flood-warning-sensor',
    title: 'เครื่องเตือนน้ำท่วมด้วยเซ็นเซอร์วัดระดับน้ำ',
    summary: 'ต่อเซ็นเซอร์วัดระดับน้ำกับบอร์ดไมโครคอนโทรลเลอร์ ให้แจ้งเตือนเข้ามือถือเมื่อน้ำสูงถึงจุดเสี่ยง',
    category: 'เทคโนโลยี', difficulty: 'medium',
    budget_min: 500, budget_max: 1200, duration_weeks: 3, grade_min: 7, grade_max: 12,
    tags: ['electronics', 'coding', 'environment'],
    purpose_md: 'เครื่องนี้วัดระดับน้ำในคลองหรือท่อระบายน้ำใกล้บ้านอย่างต่อเนื่อง เมื่อน้ำสูงถึงจุดที่ตั้งไว้ จะส่งเสียงเตือนที่ตัวเครื่องและแจ้งเตือนเข้าแอปในมือถือ เหมาะกับพื้นที่ที่น้ำขึ้นเร็วในช่วงฝนตกหนัก',
    difficulty_md: 'ถ้าเคยต่อวงจรพื้นฐานมาก่อน จะใช้เวลาเรียนรู้ประมาณ 1 สัปดาห์ ส่วนที่ยากที่สุดคือการปรับค่าเซ็นเซอร์ให้แม่นและกันน้ำให้ตัวเครื่อง ไม่ใช่การเขียนโปรแกรม',
    steps: [
      { step: 1, title: 'ทดลองอ่านค่าเซ็นเซอร์', detail: 'วัดระยะในถังน้ำ จดค่าที่ได้เทียบกับระดับน้ำจริง' },
      { step: 2, title: 'แปลงค่าเป็นเซนติเมตร', detail: 'เขียนโปรแกรมแปลงค่าดิบให้เป็นระดับน้ำที่อ่านเข้าใจได้' },
      { step: 3, title: 'ตั้งเกณฑ์เตือน 2 ระดับ', detail: 'เฝ้าระวัง / อันตราย แล้วต่อลำโพงกับไฟแสดงสถานะ' },
      { step: 4, title: 'ต่อ Wi-Fi และส่งแจ้งเตือน', detail: 'ส่งข้อความเข้ามือถือเมื่อถึงเกณฑ์อันตราย' },
      { step: 5, title: 'ทดสอบกลางแจ้ง 1 สัปดาห์', detail: 'บันทึกว่าพลาดหรือเตือนผิดกี่ครั้ง' },
    ],
    materials: [
      { name: 'บอร์ด ESP32', qty: '1 ตัว', est_price: 250 },
      { name: 'เซ็นเซอร์วัดระยะกันน้ำ', qty: '1 ตัว', est_price: 350 },
      { name: 'ลำโพงบัซเซอร์ + LED', qty: '1 ชุด', est_price: 60 },
      { name: 'กล่องกันน้ำ', qty: '1 ใบ', est_price: 120 },
    ],
    extension_md: 'ลองเก็บข้อมูลระดับน้ำย้อนหลัง 1 เดือนแล้วหาว่าฝนตกกี่มิลลิเมตรน้ำถึงจะขึ้นถึงจุดเสี่ยง จุดนี้จะทำให้โครงงานเป็นของคุณเอง ไม่ใช่การทำตามคลิปสอน',
  },
  {
    id: '2', slug: 'biodegradable-seedling-bag',
    title: 'ถุงเพาะชำย่อยสลายได้จากเปลือกผลไม้ในชุมชน',
    summary: 'ทดลองอัตราส่วนเปลือกผลไม้กับแป้งมันสำปะหลัง เทียบความแข็งแรงและเวลาย่อยสลายในดิน',
    category: 'สิ่งแวดล้อม', difficulty: 'easy',
    budget_min: 0, budget_max: 400, duration_weeks: 4, grade_min: 7, grade_max: 12,
    tags: ['environment', 'chemistry', 'agriculture'],
    purpose_md: 'ทำถุงเพาะชำที่ปลูกลงดินได้ทั้งถุงโดยไม่ต้องแกะออก ลดขยะพลาสติกจากการเพาะกล้าไม้ในโรงเรียน',
    difficulty_md: 'ไม่ต้องใช้เครื่องมือพิเศษ ใช้ครัวที่บ้านได้ ส่วนที่ต้องอดทนคือการรอผลย่อยสลาย 3–4 สัปดาห์',
    steps: [
      { step: 1, title: 'เก็บเปลือกผลไม้', detail: 'ตากแห้งแล้วบดให้ละเอียด' },
      { step: 2, title: 'ผสม 3 อัตราส่วน', detail: 'เปลือก:แป้ง = 1:1, 1:2, 2:1 แล้วขึ้นรูปเป็นถุง' },
      { step: 3, title: 'วัดความแข็งแรง', detail: 'ทดสอบรับน้ำหนักดินและการฉีกขาด' },
      { step: 4, title: 'ฝังดินวัดการย่อยสลาย', detail: 'ชั่งน้ำหนักที่เหลือทุกสัปดาห์' },
    ],
    materials: [
      { name: 'เปลือกผลไม้', qty: '2 กก.', est_price: 0 },
      { name: 'แป้งมันสำปะหลัง', qty: '1 กก.', est_price: 60 },
      { name: 'กลีเซอรีน', qty: '100 มล.', est_price: 80 },
    ],
    extension_md: 'ลองใส่เมล็ดปุ๋ยหรือสารบำรุงลงในเนื้อถุง เพื่อให้ถุงกลายเป็นปุ๋ยให้ต้นไม้ไปด้วยตอนย่อยสลาย',
  },
  {
    id: '3', slug: 'screen-time-survey',
    title: 'สำรวจการใช้เวลาหน้าจอของนักเรียนในโรงเรียน',
    summary: 'ออกแบบแบบสอบถาม เก็บข้อมูล 200 คน แล้วนำเสนอผลด้วยกราฟที่อ่านง่าย',
    category: 'สังคม', difficulty: 'easy',
    budget_min: 0, budget_max: 0, duration_weeks: 3, grade_min: 7, grade_max: 12,
    tags: ['social', 'data', 'health'],
    purpose_md: 'หาคำตอบว่านักเรียนในโรงเรียนใช้เวลาหน้าจอวันละกี่ชั่วโมง และเกี่ยวข้องกับเวลานอนหรือเกรดหรือไม่',
    difficulty_md: 'ไม่ต้องใช้อุปกรณ์เลย แต่ต้องออกแบบคำถามให้ดี ถ้าคำถามกำกวมข้อมูลจะใช้ไม่ได้ทั้งชุด',
    steps: [
      { step: 1, title: 'ตั้งคำถามวิจัย', detail: 'เขียนให้ชัดว่าจะตอบอะไร แล้วออกแบบแบบสอบถาม 10–15 ข้อ' },
      { step: 2, title: 'ทดลองใช้กับ 10 คน', detail: 'ดูว่าข้อไหนคนตอบไม่เข้าใจ แล้วแก้' },
      { step: 3, title: 'เก็บข้อมูลจริง 200 คน', detail: 'กระจายให้ครบทุกระดับชั้น' },
      { step: 4, title: 'วิเคราะห์และทำกราฟ', detail: 'หาค่าเฉลี่ยและความสัมพันธ์ระหว่างตัวแปร' },
    ],
    materials: [{ name: 'Google Forms', qty: '1 ชุด', est_price: 0 }],
    extension_md: 'เปรียบเทียบผลกับข้อมูลจริงจากฟีเจอร์ Screen Time ในมือถือของอาสาสมัคร จะได้รู้ว่าคนตอบแบบสอบถามประเมินตัวเองต่ำไปแค่ไหน',
  },
  {
    id: '4', slug: 'water-quality-test-kit',
    title: 'ชุดทดสอบคุณภาพน้ำคลองราคาประหยัด',
    summary: 'วัดค่า pH ความขุ่น และออกซิเจนละลายน้ำในคลองใกล้โรงเรียน เก็บข้อมูลต่อเนื่อง 8 สัปดาห์',
    category: 'วิทยาศาสตร์', difficulty: 'easy',
    budget_min: 500, budget_max: 1200, duration_weeks: 8, grade_min: 7, grade_max: 12,
    tags: ['environment', 'chemistry', 'data'],
    purpose_md: 'ทำชุดทดสอบที่โรงเรียนซื้อได้ในราคาไม่ถึงพันบาท เพื่อเฝ้าระวังคุณภาพน้ำในคลองใกล้ชุมชนอย่างต่อเนื่อง',
    difficulty_md: 'ขั้นตอนไม่ยาก แต่ต้องเก็บข้อมูลสม่ำเสมอ 8 สัปดาห์ ความอดทนสำคัญกว่าทักษะ',
    steps: [
      { step: 1, title: 'เลือกจุดเก็บตัวอย่าง 3 จุด', detail: 'ต้นน้ำ กลางน้ำ ท้ายน้ำ' },
      { step: 2, title: 'วัดค่าสัปดาห์ละครั้ง', detail: 'เวลาเดียวกันทุกครั้งเพื่อลดตัวแปรแทรก' },
      { step: 3, title: 'เทียบกับเกณฑ์มาตรฐาน', detail: 'ใช้เกณฑ์คุณภาพน้ำผิวดินของกรมควบคุมมลพิษ' },
    ],
    materials: [
      { name: 'ชุดวัด pH', qty: '1 ชุด', est_price: 300 },
      { name: 'แผ่นวัดความขุ่น', qty: '1 ชุด', est_price: 200 },
      { name: 'ขวดเก็บตัวอย่าง', qty: '9 ใบ', est_price: 150 },
    ],
    extension_md: 'เอาข้อมูลไปทำแผนที่คุณภาพน้ำของชุมชน แล้วส่งให้เทศบาลจริง ๆ ตรงนี้คือสิ่งที่กรรมการชอบมาก',
  },
  {
    id: '5', slug: 'auto-plant-watering',
    title: 'ระบบรดน้ำต้นไม้อัตโนมัติสั่งงานผ่านมือถือ',
    summary: 'ใช้เซ็นเซอร์ความชื้นดินสั่งปั๊มน้ำ พร้อมหน้าจอดูสถิติการรดน้ำย้อนหลัง',
    category: 'วิศวกรรม', difficulty: 'medium',
    budget_min: 1200, budget_max: 2500, duration_weeks: 4, grade_min: 7, grade_max: 12,
    tags: ['electronics', 'coding', 'agriculture', 'robotics'],
    purpose_md: 'รดน้ำต้นไม้ตามความชื้นจริงในดิน ไม่ใช่ตามเวลา ช่วยประหยัดน้ำและกันต้นไม้ตายช่วงปิดเทอม',
    difficulty_md: 'ต้องต่อวงจรที่มีปั๊มน้ำ ซึ่งใช้ไฟคนละชุดกับบอร์ด ตรงนี้พลาดบ่อยที่สุด ควรมีครูช่วยดูตอนต่อรีเลย์',
    steps: [
      { step: 1, title: 'สอบเทียบเซ็นเซอร์ความชื้น', detail: 'วัดดินแห้งสนิทกับดินชุ่มน้ำ จดค่าทั้งสองฝั่ง' },
      { step: 2, title: 'ต่อรีเลย์กับปั๊ม', detail: 'แยกแหล่งจ่ายไฟของปั๊มออกจากบอร์ด' },
      { step: 3, title: 'เขียนเงื่อนไขรดน้ำ', detail: 'ตั้งเกณฑ์ความชื้นต่ำสุดและเวลารดสูงสุดต่อครั้ง' },
      { step: 4, title: 'ทำหน้าจอดูสถิติ', detail: 'บันทึกทุกครั้งที่รด แล้วแสดงเป็นกราฟรายวัน' },
    ],
    materials: [
      { name: 'บอร์ด ESP32', qty: '1 ตัว', est_price: 250 },
      { name: 'เซ็นเซอร์ความชื้นดิน', qty: '2 ตัว', est_price: 200 },
      { name: 'ปั๊มน้ำ 5V + สายยาง', qty: '1 ชุด', est_price: 450 },
      { name: 'โมดูลรีเลย์', qty: '1 ตัว', est_price: 90 },
    ],
    extension_md: 'ลองเทียบการเจริญเติบโตของต้นไม้ 2 กลุ่ม กลุ่มที่รดตามเวลา กับกลุ่มที่รดตามความชื้น แล้ววัดผลด้วยความสูงและน้ำหนักแห้ง',
  },
  {
    id: '6', slug: 'waste-sorting-app',
    title: 'แอปจำแนกขยะด้วยกล้องมือถือ',
    summary: 'เก็บภาพขยะในโรงเรียนมาฝึกโมเดลจำแนกประเภท แล้วทำหน้าจอง่าย ๆ ให้เพื่อนทดลองใช้',
    category: 'เทคโนโลยี', difficulty: 'hard',
    budget_min: 0, budget_max: 0, duration_weeks: 6, grade_min: 10, grade_max: 12,
    tags: ['ai', 'coding', 'environment', 'data'],
    purpose_md: 'ช่วยให้คนแยกขยะถูกถัง โดยเปิดกล้องส่องขยะแล้วแอปบอกว่าควรทิ้งถังไหน',
    difficulty_md: 'ส่วนที่ยากไม่ใช่การเทรนโมเดล แต่เป็นการเก็บภาพให้หลากหลายพอ ถ้าถ่ายแต่บนโต๊ะสีขาว พอไปใช้จริงจะทายผิดหมด',
    steps: [
      { step: 1, title: 'กำหนดประเภทขยะ 4 กลุ่ม', detail: 'ทั่วไป รีไซเคิล อินทรีย์ อันตราย' },
      { step: 2, title: 'เก็บภาพกลุ่มละ 150 ภาพ', detail: 'ถ่ายหลายมุม หลายแสง หลายพื้นหลัง' },
      { step: 3, title: 'เทรนโมเดลด้วย Teachable Machine', detail: 'แบ่งข้อมูลฝึกกับข้อมูลทดสอบให้ชัด' },
      { step: 4, title: 'วัดความแม่นด้วยภาพที่โมเดลไม่เคยเห็น', detail: 'รายงานเป็นตารางสับสน ไม่ใช่แค่เปอร์เซ็นต์รวม' },
      { step: 5, title: 'ทำหน้าเว็บให้เพื่อนลองใช้', detail: 'เก็บสถิติว่าทายผิดกรณีไหนบ้าง' },
    ],
    materials: [{ name: 'มือถือที่มีกล้อง', qty: '1 เครื่อง', est_price: 0 }],
    extension_md: 'เก็บสถิติว่าโมเดลทายผิดตรงไหนบ่อยที่สุด แล้ววิเคราะห์ว่าทำไม เช่น ขวดใสกับถุงพลาสติกแยกยากเพราะอะไร ส่วนนี้มีค่ากว่าตัวเลขความแม่น',
  },
  {
    id: '7', slug: 'natural-ph-freshness-paper',
    title: 'กระดาษวัดความสดของอาหารจากสีธรรมชาติ',
    summary: 'ใช้สีจากกะหล่ำม่วงทำแถบวัดค่า pH ติดกล่องอาหาร เพื่อบอกว่าอาหารเริ่มเสียหรือยัง',
    category: 'วิทยาศาสตร์', difficulty: 'easy',
    budget_min: 0, budget_max: 300, duration_weeks: 3, grade_min: 4, grade_max: 9,
    tags: ['chemistry', 'biology', 'agriculture'],
    purpose_md: 'ทำแถบสีติดกล่องอาหารที่เปลี่ยนสีเมื่ออาหารเริ่มเสีย ช่วยลดการทิ้งอาหารที่ยังกินได้ และกันกินของที่เสียแล้ว',
    difficulty_md: 'ทำได้ที่บ้านทั้งหมด ส่วนที่ต้องระวังคือการควบคุมอุณหภูมิให้เหมือนกันทุกชุดทดลอง',
    steps: [
      { step: 1, title: 'สกัดสีจากกะหล่ำม่วง', detail: 'ต้มแล้วกรอง เก็บน้ำสีไว้ในที่มืด' },
      { step: 2, title: 'ทำแถบกระดาษ', detail: 'จุ่มกระดาษกรองแล้วตากให้แห้ง' },
      { step: 3, title: 'ทำตารางเทียบสี', detail: 'ทดสอบกับสารที่รู้ค่า pH แล้วถ่ายรูปเทียบ' },
      { step: 4, title: 'ทดสอบกับอาหารจริง', detail: 'นม เนื้อ ผลไม้ วัดทุก 6 ชั่วโมงเป็นเวลา 3 วัน' },
    ],
    materials: [
      { name: 'กะหล่ำปลีม่วง', qty: '1 หัว', est_price: 60 },
      { name: 'กระดาษกรอง', qty: '1 กล่อง', est_price: 120 },
    ],
    extension_md: 'ลองเทียบกับสีจากพืชไทยอย่างอัญชันหรือดอกกระเจี๊ยบ แล้วดูว่าอันไหนเปลี่ยนสีชัดที่สุดในช่วง pH ที่อาหารเริ่มเสีย',
  },
  {
    id: '8', slug: 'heat-insulation-from-waste',
    title: 'ทดสอบประสิทธิภาพวัสดุกันความร้อนจากของเหลือใช้',
    summary: 'เทียบอุณหภูมิในกล่องทดลองที่บุด้วยกล่องนม ฟองน้ำ และแกลบ ในเงื่อนไขเดียวกัน',
    category: 'วิทยาศาสตร์', difficulty: 'easy',
    budget_min: 0, budget_max: 400, duration_weeks: 3, grade_min: 4, grade_max: 9,
    tags: ['physics', 'environment', 'craft'],
    purpose_md: 'หาว่าของเหลือใช้ในบ้านชนิดไหนกันความร้อนได้ดีที่สุด เพื่อเอาไปใช้บุหลังคาหรือกล่องเก็บของจริง',
    difficulty_md: 'ง่ายที่สุดในคลัง แต่ต้องคุมตัวแปรให้ดี ทุกกล่องต้องหนาเท่ากันและวางกลางแดดพร้อมกัน',
    steps: [
      { step: 1, title: 'ทำกล่องทดลอง 4 ใบ', detail: 'ขนาดเท่ากัน บุวัสดุต่างกัน 3 ใบ เหลือ 1 ใบเป็นกลุ่มควบคุม' },
      { step: 2, title: 'วัดอุณหภูมิทุก 10 นาที', detail: 'วัดต่อเนื่อง 3 ชั่วโมงกลางแดด' },
      { step: 3, title: 'ทำซ้ำ 3 วัน', detail: 'เพื่อยืนยันว่าผลไม่ได้มาจากอากาศวันเดียว' },
    ],
    materials: [
      { name: 'กล่องโฟม', qty: '4 ใบ', est_price: 160 },
      { name: 'เทอร์โมมิเตอร์', qty: '4 อัน', est_price: 200 },
    ],
    extension_md: 'คำนวณว่าถ้าเอาวัสดุที่ดีที่สุดไปบุหลังคาห้องเรียนจริง จะลดอุณหภูมิได้กี่องศาและประหยัดค่าแอร์เท่าไหร่',
  },
];

export const SAMPLE_COMPETITIONS: Competition[] = [
  { id: 'c1', slug: 'junior-water-prize-2569', name: 'Thailand Junior Water Prize 2569', organizer: 'กรมทรัพยากรน้ำ', close_at: futureISO(3), source_url: '#' },
  { id: 'c2', slug: 'science-project-regional-2569', name: 'การประกวดโครงงานวิทยาศาสตร์ ระดับภาค 2569', organizer: 'สมาคมวิทยาศาสตร์แห่งประเทศไทย', close_at: futureISO(12), source_url: '#' },
  { id: 'c3', slug: 'young-inventor-2569', name: 'การประกวดสิ่งประดิษฐ์ของคนรุ่นใหม่', organizer: 'สำนักงานคณะกรรมการการอาชีวศึกษา', close_at: futureISO(26), source_url: '#' },
  { id: 'c4', slug: 'nsc-2570', name: 'NSC การแข่งขันพัฒนาโปรแกรมคอมพิวเตอร์', organizer: 'NECTEC สวทช.', close_at: futureISO(41), source_url: '#' },
];

function futureISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ------------------------------------------------------------------
// Data access — ถ้ามี Supabase จะอ่านจากฐานข้อมูล ถ้าไม่มีจะใช้ตัวอย่าง
// ------------------------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  if (!hasSupabase) return SAMPLE_PROJECTS;
  const { data, error } = await anonClient()
    .from('projects')
    .select('id, slug, title, summary, difficulty, budget_min, budget_max, duration_weeks, grade_min, grade_max, cover_url, categories(name_th)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error || !data) return SAMPLE_PROJECTS;
  return data.map(mapProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!hasSupabase) return SAMPLE_PROJECTS.find((p) => p.slug === slug) ?? null;
  // เลือกเฉพาะคอลัมน์ที่หน้าโครงงานใช้จริง — ห้ามใช้ select('*') เพราะจะดึงคอลัมน์
  // embedding (vector 768 มิติ) กับ search_text มาด้วย ทำให้ payload ใหญ่เกินจำเป็น
  // และ PostgREST อาจ serialize ชนิด vector ไม่ได้จน query พังทั้งแถว
  const { data, error } = await anonClient()
    .from('projects')
    .select(
      'id, slug, title, summary, category_id, difficulty, budget_min, budget_max, ' +
      'duration_weeks, grade_min, grade_max, purpose_md, difficulty_md, steps, ' +
      'materials, extension_md, cover_url, status, categories(name_th)',
    )
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return SAMPLE_PROJECTS.find((p) => p.slug === slug) ?? null;
  return mapProject(data);
}

export async function getCompetitions(): Promise<Competition[]> {
  if (!hasSupabase) return SAMPLE_COMPETITIONS;
  const { data, error } = await anonClient()
    .from('v_competitions')
    .select('id, slug, name, organizer, close_at, source_url')
    .gte('close_at', new Date().toISOString().slice(0, 10))
    .order('close_at');
  if (error || !data) return SAMPLE_COMPETITIONS;
  return data as Competition[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProject(row: any): Project {
  return {
    ...row,
    category: row.categories?.name_th ?? 'ทั่วไป',
    tags: row.tags ?? [],
  } as Project;
}
