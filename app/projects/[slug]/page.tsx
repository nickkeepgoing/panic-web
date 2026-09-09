import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/data';
import { DIFFICULTY_TH, budgetLabel, gradeLabel } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';
import { SaveButton } from '@/components/SaveButton';

// ดึงข้อมูลสดจากฐานข้อมูลทุกครั้ง ไม่ล็อกรายชื่อ slug ไว้ตั้งแต่ตอน build
// มิฉะนั้นโครงงานที่แอดมินเพิ่มใหม่ (ยังไม่มีตอน build) จะขึ้น 404
export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();
  const c = categoryStyle(project.category);

  const meta = [
    { label: 'ความยาก', value: DIFFICULTY_TH[project.difficulty] },
    { label: 'งบประมาณ', value: budgetLabel(project.budget_min, project.budget_max) },
    { label: 'ระยะเวลา', value: `${project.duration_weeks} สัปดาห์` },
    { label: 'ระดับชั้น', value: gradeLabel(project.grade_min, project.grade_max) },
  ];

  const totalCost = (project.materials ?? []).reduce((s, m) => s + m.est_price, 0);

  return (
    <article className="flex flex-col gap-10">
      <header className="overflow-hidden rounded-card border border-line bg-surface">
        {project.cover_url ? (
          <div className="relative h-56 w-full sm:h-72">
            <Image
              src={project.cover_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : (
          <div className={`h-2 w-full ${c.bar}`} aria-hidden />
        )}
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-3 text-sm">
            <Link href={`/projects?cat=${encodeURIComponent(project.category)}`} className={`rounded-md px-2 py-0.5 font-medium ${c.bg} ${c.text}`}>
              {project.category}
            </Link>
            <Link href="/projects" className="text-muted hover:text-brand-deep">กลับไปคลังโครงงาน</Link>
          </div>
          <h1 className="max-w-3xl font-display text-3xl font-bold text-ink sm:text-4xl">{project.title}</h1>
          <p className="max-w-prose text-muted">{project.summary}</p>
          <SaveButton projectId={project.id} />
        </div>

        <dl className="grid grid-cols-2 divide-x divide-y divide-line border-t border-line sm:grid-cols-4 sm:divide-y-0">
          {meta.map((m) => (
            <div key={m.label} className="p-4 sm:p-5">
              <dt className="text-xs text-muted">{m.label}</dt>
              <dd className="font-display text-lg font-semibold text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="flex flex-col gap-10">
          {project.purpose_md && (
            <Section title="เอาไว้ทำอะไร"><p>{project.purpose_md}</p></Section>
          )}

          {project.difficulty_md && (
            <Section title="ยากไหม"><p>{project.difficulty_md}</p></Section>
          )}

          {project.steps && project.steps.length > 0 && (
            <Section title="วิธีทำ">
              <ol className="flex flex-col">
                {project.steps.map((s, i) => (
                  <li key={s.step} className="flex gap-4 pb-5">
                    <span className="flex flex-col items-center">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-white ${c.bar}`}>
                        {s.step}
                      </span>
                      {i < project.steps!.length - 1 && <span className="mt-1 w-px flex-1 bg-line" aria-hidden />}
                    </span>
                    <span className="pt-1">
                      <strong className="font-display font-semibold text-ink">{s.title}</strong>
                      <span className="block text-muted">{s.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Section>
          )}
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          {project.materials && project.materials.length > 0 && (
            <div className="rounded-card border border-line bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-ink">อุปกรณ์ที่ใช้</h2>
              <ul className="mt-3 flex flex-col divide-y divide-line text-sm">
                {project.materials.map((m) => (
                  <li key={m.name} className="flex items-baseline gap-3 py-2">
                    <span className="flex-1 text-ink">{m.name}</span>
                    <span className="text-xs text-muted">{m.qty}</span>
                    <span className="w-20 text-right text-muted">
                      {m.est_price === 0 ? 'ไม่มีค่าใช้จ่าย' : `${m.est_price.toLocaleString('th-TH')} บาท`}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-baseline justify-between border-t border-line pt-3 text-sm">
                <span className="text-muted">รวมโดยประมาณ</span>
                <span className="font-display text-lg font-bold text-ink">
                  {totalCost === 0 ? 'ไม่มีค่าใช้จ่าย' : `${totalCost.toLocaleString('th-TH')} บาท`}
                </span>
              </p>
            </div>
          )}

          {project.extension_md && (
            <div className="rounded-card bg-brand p-6 text-white">
              <h2 className="font-display text-lg font-bold">จุดที่ควรต่อยอดให้เป็นของตัวเอง</h2>
              <p className="mt-2 text-white/90">{project.extension_md}</p>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      <div className="max-w-prose text-muted">{children}</div>
    </section>
  );
}
