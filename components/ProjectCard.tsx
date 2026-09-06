import Link from 'next/link';
import { categoryStyle } from '@/lib/categories';
import { DIFFICULTY_TH, budgetLabel, type Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  const c = categoryStyle(project.category);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface hover:shadow-lift"
    >
      <span className={`h-1.5 w-full ${c.bar}`} aria-hidden />
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className={`w-fit rounded-md px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
          {project.category}
        </span>
        <span className="font-display text-lg font-semibold text-ink group-hover:text-brand-deep">
          {project.title}
        </span>
        <span className="text-sm text-muted">{project.summary}</span>

        <span className="mt-auto flex flex-wrap gap-1.5 pt-4 text-xs">
          <Fact>{DIFFICULTY_TH[project.difficulty]}</Fact>
          <Fact>{budgetLabel(project.budget_min, project.budget_max)}</Fact>
          <Fact>{project.duration_weeks} สัปดาห์</Fact>
        </span>
      </span>
    </Link>
  );
}

function Fact({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-ground px-2 py-1 text-muted">{children}</span>;
}
