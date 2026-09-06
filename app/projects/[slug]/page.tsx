import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/data';
import { DIFFICULTY_TH, budgetLabel, gradeLabel } from '@/lib/types';
import { SaveButton } from '@/components/SaveButton';

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const meta = [
    { label: 'ระดับความยาก', value: DIFFICULTY_TH[project.difficulty] },
    { label: 'งบประมาณโดยประมาณ', value: budgetLabel(project.budget_min, project.budget_max) },
    { label: 'ระยะเวลาทำ', value: `ประมาณ ${project.duration_weeks} สัปดาห์` },
    { label: 'ระดับชั้นที่เหมาะสม', value: gradeLabel(project.grade_min, project.grade_max) },
  ];

  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Link href="/projects" className="text-sm text-muted hover:text-brand-deep">
          คลังโครงงาน / {project.category}
        </Link>
        <h1 className="max-w-3xl font-display text-3xl font-semibold text-ink">{project.title}</h1>
        <p className="max-w-prose text-muted">{project.summary}</p>
        <SaveButton projectId={project.id} />
      </div>

      <dl className="grid gap-4 rounded-card border border-line bg-surface p-5 sm:grid-cols-4">
        {meta.map((m) => (
          <div key={m.label}>
            <dt className="text-xs text-muted">{m.label}</dt>
            <dd className="text-ink">{m.value}</dd>
          </div>
        ))}
      </dl>

      {project.purpose_md && (
        <Section title="เอาไว้ทำอะไร">
          <p>{project.purpose_md}</p>
        </Section>
      )}

      {project.difficulty_md && (
        <Section title="ยากไหม">
          <p>{project.difficulty_md}</p>
        </Section>
      )}

      {project.steps && project.steps.length > 0 && (
        <Section title="วิธีทำ">
          <ol className="flex flex-col gap-3">
            {project.steps.map((s) => (
              <li key={s.step} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-light text-xs text-brand-deep">
                  {s.step}
                </span>
                <span>
                  <strong className="font-medium text-ink">{s.title}</strong>
                  <span className="block text-muted">{s.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {project.materials && project.materials.length > 0 && (
        <Section title="อุปกรณ์ที่ใช้">
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="py-2 font-normal">รายการ</th>
                <th className="py-2 font-normal">จำนวน</th>
                <th className="py-2 text-right font-normal">ราคาโดยประมาณ</th>
              </tr>
            </thead>
            <tbody>
              {project.materials.map((m) => (
                <tr key={m.name} className="border-t border-line">
                  <td className="py-2">{m.name}</td>
                  <td className="py-2 text-muted">{m.qty}</td>
                  <td className="py-2 text-right text-muted">
                    {m.est_price === 0 ? 'ไม่มีค่าใช้จ่าย' : `${m.est_price.toLocaleString('th-TH')} บาท`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {project.extension_md && (
        <section className="rounded-card border-2 border-brand bg-brand-light/40 p-6">
          <h2 className="font-display text-xl font-medium text-brand-deep">
            จุดที่ควรต่อยอดให้เป็นของตัวเอง
          </h2>
          <p className="mt-2 max-w-prose text-ink">{project.extension_md}</p>
        </section>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-medium text-ink">{title}</h2>
      <div className="max-w-prose text-muted">{children}</div>
    </section>
  );
}
