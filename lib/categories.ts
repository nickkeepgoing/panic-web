/**
 * ระบบสีตามหมวดหมู่ — สีในเว็บนี้ทำหน้าที่บอกข้อมูล ไม่ได้ใส่ไว้ให้สวย
 * เห็นสีแล้วต้องรู้ทันทีว่าเป็นโครงงานสายไหน ก่อนจะได้อ่านตัวอักษร
 */
export type CategoryStyle = {
  abbr: string;
  text: string;   // สีตัวอักษรบนพื้นอ่อน
  bg: string;     // พื้นอ่อนสำหรับป้าย
  bar: string;    // แถบสีทึบ
  ring: string;   // เส้นขอบตอนถูกเลือก
};

const STYLES: Record<string, CategoryStyle> = {
  'วิทยาศาสตร์': { abbr: 'วท', text: 'text-sci',  bg: 'bg-sci/10',  bar: 'bg-sci',  ring: 'border-sci' },
  'เทคโนโลยี':   { abbr: 'ทค', text: 'text-tech', bg: 'bg-tech/10', bar: 'bg-tech', ring: 'border-tech' },
  'วิศวกรรม':    { abbr: 'วก', text: 'text-engr', bg: 'bg-engr/10', bar: 'bg-engr', ring: 'border-engr' },
  'สิ่งแวดล้อม': { abbr: 'สว', text: 'text-envi', bg: 'bg-envi/10', bar: 'bg-envi', ring: 'border-envi' },
  'สังคม':       { abbr: 'สค', text: 'text-soci', bg: 'bg-soci/10', bar: 'bg-soci', ring: 'border-soci' },
};

const FALLBACK: CategoryStyle = {
  abbr: 'อื่น', text: 'text-brand-deep', bg: 'bg-brand-light', bar: 'bg-brand', ring: 'border-brand',
};

export function categoryStyle(name: string): CategoryStyle {
  return STYLES[name] ?? FALLBACK;
}

export const CATEGORY_ORDER = Object.keys(STYLES);
