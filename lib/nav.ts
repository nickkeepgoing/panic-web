/**
 * รายการเมนูหลัก แหล่งเดียวที่ใช้ร่วมกันทั้งหัวเว็บและฟุตเตอร์
 * แยกออกมาเป็นไฟล์ธรรมดา ไม่มี 'use client' เพราะ layout ซึ่งเป็น server component
 * ต้องอ่านค่านี้ได้ตรง ๆ ถ้า export จากไฟล์ฝั่ง client ค่าจะกลายเป็น client reference
 */
export const NAV = [
  { href: '/projects', label: 'คลังโครงงาน' },
  { href: '/quiz', label: 'แบบทดสอบ' },
  { href: '/career', label: 'ค้นหาอาชีพ' },
  { href: '/calendar', label: 'ปฏิทินกิจกรรม' },
] as const;
