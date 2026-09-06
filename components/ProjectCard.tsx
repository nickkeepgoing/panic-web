import Link from 'next/link';
import Image from 'next/image';
import { categoryStyle } from '@/lib/categories';
import { DIFFICULTY_TH, budgetLabel, type Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  const c = categoryStyle(project.category);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface hover:shadow-lift"
    >
      {project.cover_url ? (
        <div className="relative h-40 w-full overflow-hidden bg-ground">
          <Image
            src={project.cover_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
            {project.category}
          </span>
        </div>
      ) : (
        <span className={`h-1.5 w-full ${c.bar}`} aria-hidden />
      )}

      <span className="flex flex-1 flex-col gap-2 p-5">
        {!project.cover_url && (
          <span className={`w-fit rounded-md px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
            {project.category}
          </span>
        )}
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
