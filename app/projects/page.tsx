import Link from 'next/link';
import { getProjects } from '@/lib/data';
import { ProjectCard } from '@/components/ProjectCard';
import { categoryStyle } from '@/lib/categories';
import { DIFFICULTY_TH } from '@/lib/types';

export const revalidate = 60;

const GRADE_FILTERS = [
  { key: 'primary', label: 'ประถม', sub: 'ป.4–ป.6', range: [4, 6] },
  { key: 'lower', label: 'มัธยมต้น', sub: 'ม.1–ม.3', range: [7, 9] },
  { key: 'upper', label: 'มัธยมปลาย', sub: 'ม.4–ม.6', range: [10, 12] },
] as const;

const BUDGET_FILTERS = [
  { key: '0', label: 'ไม่ใช้เงิน', max: 0 },
  { key: '500', label: 'ไม่เกิน 500 บาท', max: 500 },
  { key: '1500', label: 'ไม่เกิน 1,500 บาท', max: 1500 },
] as const;

type Search = { grade?: string; budget?: string; level?: string; cat?: string };

function buildHref(current: Search, key: keyof Search, value: string) {
  const next: Search = { ...current };
  if (next[key] === value) delete next[key];
  else next[key] = value;
  const qs = new URLSearchParams(next as Record<string, string>).toString();
  return qs ? `/projects?${qs}` : '/projects';
}

export default async function BrowsePage({ searchParams }: { searchParams: Search }) {
  const all = await getProjects();
  const categories = Array.from(new Set(all.map((p) => p.category)));

  const grade = GRADE_FILTERS.find((g) => g.key === searchParams.grade);
  const budget = BUDGET_FILTERS.find((b) => b.key === searchParams.budget);
  const filterCount = Object.keys(searchParams).length;

  // กรองด้วยเงื่อนไขตายตัวก่อนเสมอ ไม่ให้ขึ้นโครงงานที่ทำไม่ได้จริง
  const projects = all.filter((p) => {
    if (grade && (p.grade_max < grade.range[0] || p.grade_min > grade.range[1])) return false;
    if (budget && p.budget_min > budget.max) return false;
    if (searchParams.level && p.difficulty !== searchParams.level) return false;
    if (searchParams.cat && p.category !== searchParams.cat) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="font-display text-3xl font-bold text-ink">คลังโครงงาน</h1>
        <p className="text-muted">
          {projects.length === all.length ? `ทั้งหมด ${all.length} เรื่อง` : `ตรงเงื่อนไข ${projects.length} จาก ${all.length} เรื่อง`}
        </p>
        {filterCount > 0 && (
          <Link href="/projects" className="ml-auto text-sm text-brand-deep hover:underline">
            ล้างตัวกรอง
          </Link>
        )}
      </div>

      {/* หมวดหมู่แยกออกมาเป็นแถวใหญ่ เพราะเป็นตัวกรองที่คนใช้บ่อยที่สุด */}
      <div className="flex flex-wrap gap-2">
        {categories.map((name) => {
          const c = categoryStyle(name);
          const active = searchParams.cat === name;
          return (
            <Link
              key={name}
              href={buildHref(searchParams, 'cat', name)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                active ? `${c.ring} ${c.bg} ${c.text} font-medium` : 'border-line bg-surface text-muted hover:border-brand'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-sm ${c.bar}`} aria-hidden />
              {name}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-5 rounded-card border border-line bg-surface p-5 sm:grid-cols-3">
        <FilterGroup label="ระดับชั้น">
          {GRADE_FILTERS.map((g) => (
            <Pill key={g.key} active={searchParams.grade === g.key} href={buildHref(searchParams, 'grade', g.key)}>
              {g.label} <span className="text-xs opacity-70">{g.sub}</span>
            </Pill>
          ))}
        </FilterGroup>
        <FilterGroup label="ความยาก">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <Pill key={d} active={searchParams.level === d} href={buildHref(searchParams, 'level', d)}>
              {DIFFICULTY_TH[d]}
            </Pill>
          ))}
        </FilterGroup>
        <FilterGroup label="งบประมาณ">
          {BUDGET_FILTERS.map((b) => (
            <Pill key={b.key} active={searchParams.budget === b.key} href={buildHref(searchParams, 'budget', b.key)}>
              {b.label}
            </Pill>
          ))}
        </FilterGroup>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-line bg-surface p-10 text-center">
          <p className="font-display text-lg text-ink">ไม่มีโครงงานที่ตรงกับตัวกรองนี้</p>
          <p className="mt-1 text-sm text-muted">เอาตัวกรองงบประมาณออกก่อน มักจะเจอเพิ่มขึ้นมากที่สุด</p>
          <Link href="/projects" className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep">
            ล้างตัวกรองทั้งหมด
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, href, children }: { active: boolean; href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-lg border px-3 py-1.5 text-sm ${
        active ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-muted hover:border-brand hover:text-brand-deep'
      }`}
    >
      {children}
    </Link>
  );
}
