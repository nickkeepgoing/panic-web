import Link from 'next/link';
import { getProjects } from '@/lib/data';
import { ProjectCard } from '@/components/ProjectCard';
import { DIFFICULTY_TH } from '@/lib/types';

export const revalidate = 60;

const GRADE_FILTERS = [
  { key: 'primary', label: 'ประถม (ป.4–ป.6)', range: [4, 6] },
  { key: 'lower', label: 'ม.ต้น (ม.1–ม.3)', range: [7, 9] },
  { key: 'upper', label: 'ม.ปลาย (ม.4–ม.6)', range: [10, 12] },
] as const;

const BUDGET_FILTERS = [
  { key: '0', label: 'ไม่มีค่าใช้จ่าย', max: 0 },
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

function Chip({ active, href, children }: { active: boolean; href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-sm ${
        active ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-muted hover:border-brand'
      }`}
    >
      {children}
    </Link>
  );
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const all = await getProjects();
  const categories = Array.from(new Set(all.map((p) => p.category)));

  const grade = GRADE_FILTERS.find((g) => g.key === sp.grade);
  const budget = BUDGET_FILTERS.find((b) => b.key === sp.budget);

  // ชั้นที่ 1 ของระบบแนะนำ: กรองด้วยเงื่อนไขตายตัวก่อนเสมอ
  const projects = all.filter((p) => {
    if (grade && (p.grade_max < grade.range[0] || p.grade_min > grade.range[1])) return false;
    if (budget && p.budget_min > budget.max) return false;
    if (sp.level && p.difficulty !== sp.level) return false;
    if (sp.cat && p.category !== sp.cat) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold text-ink">คลังโครงงาน</h1>
        <p className="text-sm text-muted">พบ {projects.length} โครงงาน</p>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
        <FilterRow label="ระดับชั้น">
          {GRADE_FILTERS.map((g) => (
            <Chip key={g.key} active={sp.grade === g.key} href={buildHref(sp, 'grade', g.key)}>
              {g.label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="หมวดหมู่">
          {categories.map((c) => (
            <Chip key={c} active={sp.cat === c} href={buildHref(sp, 'cat', c)}>
              {c}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="ระดับความยาก">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <Chip key={d} active={sp.level === d} href={buildHref(sp, 'level', d)}>
              {DIFFICULTY_TH[d]}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="งบประมาณ">
          {BUDGET_FILTERS.map((b) => (
            <Chip key={b.key} active={sp.budget === b.key} href={buildHref(sp, 'budget', b.key)}>
              {b.label}
            </Chip>
          ))}
        </FilterRow>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-8 text-center">
          <p className="text-ink">ยังไม่มีโครงงานที่ตรงกับตัวกรองนี้</p>
          <p className="mt-1 text-sm text-muted">ลองเอาตัวกรองงบประมาณออกก่อน มักจะเจอเพิ่มขึ้นมากที่สุด</p>
          <Link href="/projects" className="mt-4 inline-block text-sm text-brand-deep hover:underline">
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

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-28 shrink-0 text-sm text-muted">{label}</span>
      {children}
    </div>
  );
}
