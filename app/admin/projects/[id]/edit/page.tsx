import { notFound } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import { updateProject } from '../../../actions';

export const dynamic = 'force-dynamic';

function stepsToText(steps: { step: number; title: string; detail: string }[] | null): string {
  if (!steps || steps.length === 0) return '';
  return steps.map((s) => s.detail ? `${s.title} — ${s.detail}` : s.title).join('\n');
}

export default async function EditProject({ params }: { params: { id: string } }) {
  const sb = serverClient();
  const [{ data: project }, { data: categories }] = await Promise.all([
    sb.from('projects').select('*').eq('id', params.id).single(),
    sb.from('categories').select('id, name_th').order('sort_order'),
  ]);

  if (!project) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink">แก้ไขโครงงาน</h1>

      <form action={updateProject} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={project.id} />

        <Field label="ชื่อโครงงาน">
          <input name="title" required defaultValue={project.title} className={input} />
        </Field>

        <Field label="คำโปรยบนการ์ด">
          <textarea name="summary" rows={2} defaultValue={project.summary ?? ''} className={input} />
        </Field>

        <Field label="ลิงก์รูปปก (URL รูปภาพ)">
          <input name="cover_url" type="url" defaultValue={project.cover_url ?? ''} className={input} placeholder="https://..." />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="หมวดหมู่">
            <select name="category_id" defaultValue={project.category_id} className={input}>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name_th}</option>
              ))}
            </select>
          </Field>
          <Field label="ระดับความยาก">
            <select name="difficulty" defaultValue={project.difficulty} className={input}>
              <option value="easy">ง่าย</option>
              <option value="medium">ปานกลาง</option>
              <option value="hard">ยาก</option>
            </select>
          </Field>
          <Field label="งบต่ำสุด (บาท)">
            <input name="budget_min" type="number" defaultValue={project.budget_min} className={input} />
          </Field>
          <Field label="งบสูงสุด (บาท)">
            <input name="budget_max" type="number" defaultValue={project.budget_max} className={input} />
          </Field>
          <Field label="ระยะเวลา (สัปดาห์)">
            <input name="duration_weeks" type="number" defaultValue={project.duration_weeks} className={input} />
          </Field>
          <Field label="ระดับชั้น (4=ป.4 ถึง 12=ม.6)">
            <div className="flex gap-2">
              <input name="grade_min" type="number" min={4} max={12} defaultValue={project.grade_min} className={input} />
              <input name="grade_max" type="number" min={4} max={12} defaultValue={project.grade_max} className={input} />
            </div>
          </Field>
        </div>

        <Field label="เอาไว้ทำอะไร">
          <textarea name="purpose_md" rows={3} defaultValue={project.purpose_md ?? ''} className={input} />
        </Field>
        <Field label="ยากไหม">
          <textarea name="difficulty_md" rows={3} defaultValue={project.difficulty_md ?? ''} className={input} />
        </Field>

        <Field label="วิธีทำ — บรรทัดละขั้น ใช้รูปแบบ หัวข้อ — รายละเอียด">
          <textarea name="steps" rows={6} defaultValue={stepsToText(project.steps)} className={input} />
        </Field>

        <Field label="จุดที่ควรต่อยอดให้เป็นของตัวเอง">
          <textarea name="extension_md" rows={3} defaultValue={project.extension_md ?? ''} className={input} />
        </Field>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="publish"
            defaultChecked={project.status === 'published'}
            className="accent-brand"
          />
          เผยแพร่ (ไม่ติ๊กจะบันทึกเป็นร่าง)
        </label>

        <div className="flex gap-3">
          <button className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep">
            บันทึกการแก้ไข
          </button>
          <a href="/admin/projects" className="rounded-lg border border-line px-5 py-2.5 text-sm text-muted hover:border-brand hover:text-brand-deep">
            ยกเลิก
          </a>
        </div>
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
