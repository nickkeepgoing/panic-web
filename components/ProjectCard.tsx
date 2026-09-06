import Link from 'next/link';
import { DIFFICULTY_TH, budgetLabel, type Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col gap-2 rounded-card border border-line bg-surface p-5 hover:border-brand"
    >
      <span className="w-fit rounded-full bg-brand-light px-2.5 py-0.5 text-xs text-brand-deep">
        {project.category}
      </span>
      <h3 className="font-display text-lg font-medium text-ink group-hover:text-brand-deep">
        {project.title}
      </h3>
      <p className="text-sm text-muted">{project.summary}</p>
      <dl className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3 text-xs text-muted">
        <div><dt className="sr-only">ความยาก</dt><dd>{DIFFICULTY_TH[project.difficulty]}</dd></div>
        <div><dt className="sr-only">งบประมาณ</dt><dd>{budgetLabel(project.budget_min, project.budget_max)}</dd></div>
        <div><dt className="sr-only">ระยะเวลา</dt><dd>{project.duration_weeks} สัปดาห์</dd></div>
      </dl>
    </Link>
  );
}
