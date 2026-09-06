import { serverClient } from '@/lib/supabase/server';
import { createProject } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function NewProject() {
  const { data: categories } = await serverClient().from('categories').select('id, name_th').order('sort_order');

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink">เพิ่มโครงงาน</h1>

      <form action={createProject} className="flex flex-col gap-4">
        <Field label="ชื่อโครงงาน">
          <input name="title" required className={input} placeholder="เช่น เครื่องเตือนน้ำท่วมด้วยเซ็นเซอร์วัดระดับน้ำ" />
        </Field>

        <Field label="คำโปรยบนการ์ด">
          <textarea name="summary" rows={2} className={input} placeholder="อธิบายใน 1–2 บรรทัดว่าโครงงานนี้ทำอะไร" />
        </Field>

        <Field label="ลิงก์รูปปก (URL รูปภาพ)">
          <input name="cover_url" type="url" className={input} placeholder="https://..." />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="หมวดหมู่">
            <select name="category_id" className={input}>
              {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name_th}</option>)}
            </select>
          </Field>
          <Field label="ระดับความยาก">
            <select name="difficulty" className={input}>
              <option value="easy">ง่าย</option>
              <option value="medium">ปานกลาง</option>
              <option value="hard">ยาก</option>
            </select>
          </Field>
          <Field label="งบต่ำสุด (บาท)"><input name="budget_min" type="number" defaultValue={0} className={input} /></Field>
          <Field label="งบสูงสุด (บาท)"><input name="budget_max" type="number" defaultValue={0} className={input} /></Field>
          <Field label="ระยะเวลา (สัปดาห์)"><input name="duration_weeks" type="number" defaultValue={3} className={input} /></Field>
          <Field label="ระดับชั้น (4=ป.4 ถึง 12=ม.6)">
            <div className="flex gap-2">
              <input name="grade_min" type="number" min={4} max={12} defaultValue={7} className={input} />
              <input name="grade_max" type="number" min={4} max={12} defaultValue={12} className={input} />
            </div>
          </Field>
        </div>

        <Field label="เอาไว้ทำอะไร"><textarea name="purpose_md" rows={3} className={input} /></Field>
        <Field label="ยากไหม"><textarea name="difficulty_md" rows={3} className={input} /></Field>

        <Field label="วิธีทำ — บรรทัดละขั้น ใช้รูปแบบ หัวข้อ — รายละเอียด">
          <textarea name="steps" rows={5} className={input} placeholder={'ทดลองอ่านค่าเซ็นเซอร์ — วัดระยะในถังน้ำ จดค่าที่ได้\nแปลงค่าเป็นเซนติเมตร — เขียนโปรแกรมแปลงค่าดิบ'} />
        </Field>

        <Field label="จุดที่ควรต่อยอดให้เป็นของตัวเอง (บังคับกรอก)">
          <textarea name="extension_md" rows={3} required className={input}
            placeholder="ช่องนี้คือคำตอบของคำถามที่กรรมการจะถามว่าเว็บนี้ช่วยลอกโครงงานหรือเปล่า" />
        </Field>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="publish" className="accent-brand" />
          เผยแพร่ทันที (ไม่ติ๊กจะบันทึกเป็นร่าง)
        </label>

        <button className="w-fit rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep">
          บันทึกโครงงาน
        </button>
      </form>
    </div>
  );
}

const input = 'w-full rounded-lg border border-line bg-white px-3 py-2 text-ink outline-none focus:border-brand';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}
