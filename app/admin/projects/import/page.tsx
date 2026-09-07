import Link from 'next/link';
import { ImportProjectsForm } from '@/components/ImportProjectsForm';

export default function ImportProjectsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-ink">นำเข้าโครงงานจาก CSV</h1>
        <p className="max-w-prose text-sm text-muted">
          เตรียมโครงงานหลายเรื่องในสเปรดชีต แล้วนำเข้าทีเดียว — เร็วกว่ากรอกทีละหน้ามาก
          รันซ้ำได้ ถ้า slug ซ้ำกับของเดิมจะกลายเป็นการแก้ไขแทนการสร้างซ้ำ
        </p>
      </div>

      <a
        href="/templates/projects-template.csv"
        download
        className="w-fit rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand-deep hover:bg-brand-light"
      >
        ดาวน์โหลดแม่แบบ CSV
      </a>

      <details className="rounded-card border border-line bg-surface p-5">
        <summary className="cursor-pointer font-display font-semibold text-ink">คอลัมน์ที่ใช้ได้ทั้งหมด</summary>
        <div className="mt-4 flex flex-col gap-4 text-sm">
          <div>
            <p className="font-medium text-ink">ต้องกรอก</p>
            <p className="text-muted">title, category, purpose_md, extension_md</p>
          </div>
          <div>
            <p className="font-medium text-ink">ไม่กรอกก็ได้ — ระบบตั้งค่าเริ่มต้นให้แล้วเตือนกลับมา</p>
            <p className="text-muted">
              slug (ตั้งจาก title อัตโนมัติ), summary (ตัดมาจาก purpose_md), difficulty (ง่าย),
              budget_min / budget_max (0), duration_weeks (3), grade_min / grade_max (7–12)
            </p>
          </div>
          <div>
            <p className="font-medium text-ink">ไม่กรอกก็ได้ ไม่มีค่าเริ่มต้น</p>
            <p className="text-muted">difficulty_md, cover_url, steps, materials, tags</p>
          </div>

          <div className="border-t border-line pt-4">
            <p className="font-medium text-ink">category</p>
            <p className="text-muted">ใช้ชื่อหมวดภาษาไทยที่มีอยู่แล้ว เช่น &quot;สิ่งแวดล้อม&quot; หรือ slug ภาษาอังกฤษ เช่น environment</p>
          </div>
          <div>
            <p className="font-medium text-ink">difficulty</p>
            <p className="text-muted">easy / medium / hard หรือ ง่าย / ปานกลาง / ยาก</p>
          </div>
          <div>
            <p className="font-medium text-ink">steps — หนึ่งเซลล์ ใช้ || คั่นแต่ละขั้น :: คั่นหัวข้อกับรายละเอียด</p>
            <code className="mt-1 block rounded-md bg-ground px-3 py-2 text-xs">
              ทดลองอ่านค่าเซ็นเซอร์ :: วัดระยะในถังน้ำ || ตั้งเกณฑ์เตือน :: แยกเฝ้าระวังกับอันตราย
            </code>
          </div>
          <div>
            <p className="font-medium text-ink">materials — หนึ่งเซลล์ ใช้ || คั่นแต่ละชิ้น | คั่นชื่อ/จำนวน/ราคา</p>
            <code className="mt-1 block rounded-md bg-ground px-3 py-2 text-xs">
              บอร์ด ESP32 | 1 ตัว | 250 || เซ็นเซอร์วัดระยะ | 1 ตัว | 350
            </code>
          </div>
          <div>
            <p className="font-medium text-ink">tags — หนึ่งเซลล์ ใช้ ; คั่น ต้องเป็นคำในระบบเท่านั้น</p>
            <code className="mt-1 block rounded-md bg-ground px-3 py-2 text-xs">
              electronics;coding;environment
            </code>
            <p className="mt-1 text-muted">
              electronics, coding, ai, robotics, biology, chemistry, physics,
              environment, agriculture, health, social, data, design, craft
            </p>
            <p className="mt-1 text-muted">
              ถ้าแถวเดิมมีแท็กอยู่แล้วและไม่ใส่คอลัมน์นี้ตอนอัปเดต แท็กเดิมจะไม่ถูกลบ —
              ใส่คอลัมน์นี้เมื่ออยากเปลี่ยนแท็กเท่านั้น
            </p>
          </div>
        </div>
      </details>

      <ImportProjectsForm />

      <Link href="/admin/projects" className="text-sm text-muted hover:text-brand-deep">
        กลับไปหน้าคลังโครงงาน
      </Link>
    </div>
  );
}
