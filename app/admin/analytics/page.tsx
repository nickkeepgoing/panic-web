import { serverClient } from '@/lib/supabase/server';
import { getCareers, getCareerCategories } from '@/lib/career-data';
import { hasSupabase } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

// ─── Types ─────────────────────────────────────────────────────────────────
type OverviewStats = {
  careerTestsStarted: number;
  careerTestsCompleted: number;
  projectViews: number;
  projectSaves: number;
  uniqueSessions: number;
};

type CareerCount = { slug: string; name_th: string; count: number };
type DimCount = { dim: string; label: string; total: number };
type GradeDist = { grade_band: string; count: number };
type FunnelStep = { label: string; count: number };

// ─── Data fetchers ────────────────────────────────────────────────────────

async function fetchOverview(sb: ReturnType<typeof serverClient>): Promise<OverviewStats> {
  const [started, completed, projViews, projSaves, sessions] = await Promise.all([
    sb.from('events').select('id', { count: 'exact', head: true }).eq('event_type', 'CAREER_TEST_START'),
    sb.from('events').select('id', { count: 'exact', head: true }).eq('event_type', 'CAREER_TEST_COMPLETE'),
    sb.from('events').select('id', { count: 'exact', head: true }).eq('event_type', 'PROJECT_VIEW'),
    sb.from('events').select('id', { count: 'exact', head: true }).eq('event_type', 'PROJECT_SAVE'),
    sb.from('events').select('session_id'),
  ]);

  const uniqueSessions = new Set((sessions.data ?? []).map((r: { session_id: string }) => r.session_id)).size;

  return {
    careerTestsStarted:   started.count   ?? 0,
    careerTestsCompleted: completed.count ?? 0,
    projectViews:         projViews.count ?? 0,
    projectSaves:         projSaves.count ?? 0,
    uniqueSessions,
  };
}

async function fetchPopularCareers(
  sb: ReturnType<typeof serverClient>,
  careerList: Awaited<ReturnType<typeof getCareers>>,
): Promise<CareerCount[]> {
  const { data } = await sb
    .from('career_results')
    .select('top_career_ids')
    .not('top_career_ids', 'is', null);

  if (!data) return [];

  const counts: Record<string, number> = {};
  for (const row of data as { top_career_ids: string[] }[]) {
    for (const id of row.top_career_ids ?? []) {
      counts[id] = (counts[id] ?? 0) + 1;
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, count]) => {
      const career = careerList.find((c) => c.id === id);
      return { slug: career?.slug ?? id, name_th: career?.name_th ?? id, count };
    });
}

async function fetchDimDistribution(
  sb: ReturnType<typeof serverClient>,
): Promise<DimCount[]> {
  const { data } = await sb.from('career_results').select('dim_profile');
  if (!data) return [];

  const DIMS = ['tech','science','creative','helping','business','nature','data','law','craft','media'];
  const DIM_LABELS: Record<string, string> = {
    tech:'เทคโนโลยี', science:'วิทยาศาสตร์', creative:'ความคิดสร้างสรรค์',
    helping:'การดูแลช่วยเหลือ', business:'ธุรกิจ', nature:'ธรรมชาติ',
    data:'ข้อมูลและตัวเลข', law:'กฎหมาย', craft:'งานช่าง', media:'สื่อ',
  };
  const totals: Record<string, number> = {};
  for (const row of data as { dim_profile: Record<string, number> }[]) {
    for (const dim of DIMS) {
      totals[dim] = (totals[dim] ?? 0) + (row.dim_profile?.[dim] ?? 0);
    }
  }
  return DIMS
    .map((dim) => ({ dim, label: DIM_LABELS[dim] ?? dim, total: totals[dim] ?? 0 }))
    .sort((a, b) => b.total - a.total);
}

async function fetchGradeDistribution(
  sb: ReturnType<typeof serverClient>,
): Promise<GradeDist[]> {
  const { data } = await sb
    .from('career_results')
    .select('grade_band')
    .not('grade_band', 'is', null);

  if (!data) return [];
  const counts: Record<string, number> = {};
  for (const row of data as { grade_band: string }[]) {
    counts[row.grade_band] = (counts[row.grade_band] ?? 0) + 1;
  }
  const LABELS: Record<string, string> = { primary: 'ประถม', lower: 'ม.ต้น', upper: 'ม.ปลาย' };
  return Object.entries(counts).map(([k, v]) => ({ grade_band: LABELS[k] ?? k, count: v }));
}

async function fetchFunnel(sb: ReturnType<typeof serverClient>): Promise<FunnelStep[]> {
  const STEPS = [
    { event: 'PAGE_VIEW',             label: 'เข้าหน้าค้นหาอาชีพ' },
    { event: 'CAREER_TEST_START',     label: 'เริ่มแบบทดสอบ' },
    { event: 'CAREER_TEST_COMPLETE',  label: 'ทำแบบทดสอบเสร็จ' },
    { event: 'CAREER_RESULT_VIEW',    label: 'ดูผลลัพธ์' },
    { event: 'PROJECT_VIEW',          label: 'คลิกดูโครงงาน' },
  ];

  const results = await Promise.all(
    STEPS.map(({ event }) =>
      sb.from('events').select('id', { count: 'exact', head: true }).eq('event_type', event),
    ),
  );

  return STEPS.map(({ label }, i) => ({ label, count: results[i].count ?? 0 }));
}

async function fetchContentGap(
  sb: ReturnType<typeof serverClient>,
  careerList: Awaited<ReturnType<typeof getCareers>>,
): Promise<{ career: string; count: number; projectCount: number }[]> {
  const { data: results } = await sb.from('career_results').select('top_career_ids');
  if (!results) return [];

  const counts: Record<string, number> = {};
  for (const row of results as { top_career_ids: string[] }[]) {
    for (const id of row.top_career_ids ?? []) {
      counts[id] = (counts[id] ?? 0) + 1;
    }
  }

  // careers ที่มีความสนใจสูงแต่ related_project_tags ว่างหรือน้อย
  const { data: projectTagRows } = await sb
    .from('project_tags')
    .select('tags(slug)');

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const availableTags = new Set(
    (projectTagRows ?? []).flatMap((r: any) => {
      const t = r.tags;
      if (!t) return [];
      if (Array.isArray(t)) return t.map((x: any) => x.slug).filter(Boolean);
      return t.slug ? [t.slug] : [];
    }),
  );

  return careerList
    .filter((c) => {
      const interest = counts[c.id] ?? 0;
      const tagHits = c.related_project_tags.filter((t) => availableTags.has(t)).length;
      return interest >= 2 && tagHits === 0;
    })
    .map((c) => ({ career: c.name_th, count: counts[c.id] ?? 0, projectCount: 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

// ─── Sub-components ───────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-card border border-line bg-surface p-5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-display text-3xl font-bold text-ink">{typeof value === 'number' ? value.toLocaleString('th-TH') : value}</dd>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-lg font-bold text-ink">{children}</h2>;
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-40 shrink-0 truncate text-muted" title={label}>{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-ground">
        <div className="h-2 rounded-full bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-xs font-medium text-ink">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  if (!hasSupabase) {
    return (
      <p className="rounded-card border border-line bg-surface p-8 text-muted">
        Analytics ต้องต่อ Supabase ก่อน
      </p>
    );
  }

  const sb = serverClient();
  const [careerList, categories, overview, popularCareers, dimDist, gradeDist, funnel, contentGap] =
    await Promise.all([
      getCareers(),
      getCareerCategories(),
      fetchOverview(sb),
      getCareers().then((c) => fetchPopularCareers(sb, c)),
      fetchDimDistribution(sb),
      fetchGradeDistribution(sb),
      fetchFunnel(sb),
      getCareers().then((c) => fetchContentGap(sb, c)),
    ]);

  const completionRate =
    overview.careerTestsStarted > 0
      ? Math.round((overview.careerTestsCompleted / overview.careerTestsStarted) * 100)
      : 0;

  const maxCareerCount = Math.max(...popularCareers.map((c) => c.count), 1);
  const maxDimTotal    = Math.max(...dimDist.map((d) => d.total), 1);
  const maxFunnel      = Math.max(...funnel.map((f) => f.count), 1);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Analytics</h1>
        <p className="text-sm text-muted">ข้อมูลพฤติกรรมผู้ใช้และความสนใจของนักเรียน</p>
      </div>

      {/* ─── Overview ─── */}
      <section className="flex flex-col gap-3">
        <SectionTitle>ภาพรวม</SectionTitle>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Sessions ทั้งหมด"       value={overview.uniqueSessions} />
          <StatCard label="เริ่มแบบทดสอบอาชีพ"     value={overview.careerTestsStarted} />
          <StatCard label="ทำแบบทดสอบเสร็จ"        value={overview.careerTestsCompleted} sub={`อัตราสำเร็จ ${completionRate}%`} />
          <StatCard label="ยอดดูโครงงาน"            value={overview.projectViews} />
          <StatCard label="บันทึกโครงงาน"           value={overview.projectSaves} />
        </dl>
      </section>

      {/* ─── Funnel ─── */}
      <section className="flex flex-col gap-3">
        <SectionTitle>Funnel การใช้งาน</SectionTitle>
        <div className="rounded-card border border-line bg-surface p-5">
          <div className="flex flex-col gap-3">
            {funnel.map((f, i) => (
              <div key={f.label} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand font-display text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="w-48 shrink-0 text-muted">{f.label}</span>
                <div className="flex-1 overflow-hidden rounded-full bg-ground">
                  <div
                    className="h-2.5 rounded-full bg-brand transition-all duration-500"
                    style={{ width: `${Math.round((f.count / maxFunnel) * 100)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs font-medium text-ink">{f.count.toLocaleString('th-TH')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ─── Popular Careers ─── */}
        <section className="flex flex-col gap-3">
          <SectionTitle>อาชีพที่นักเรียนสนใจมากที่สุด</SectionTitle>
          <div className="rounded-card border border-line bg-surface p-5">
            {popularCareers.length === 0 ? (
              <p className="text-sm text-muted">ยังไม่มีข้อมูล — รอให้นักเรียนทำแบบทดสอบก่อน</p>
            ) : (
              <div className="flex flex-col gap-3">
                {popularCareers.map((c) => (
                  <BarRow key={c.slug} label={c.name_th} value={c.count} max={maxCareerCount} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Interest Dimensions ─── */}
        <section className="flex flex-col gap-3">
          <SectionTitle>ความสนใจของนักเรียนแยกตามด้าน</SectionTitle>
          <div className="rounded-card border border-line bg-surface p-5">
            {dimDist.every((d) => d.total === 0) ? (
              <p className="text-sm text-muted">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="flex flex-col gap-3">
                {dimDist.map((d) => (
                  <BarRow key={d.dim} label={d.label} value={d.total} max={maxDimTotal} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ─── Grade Distribution ─── */}
      <section className="flex flex-col gap-3">
        <SectionTitle>ระดับชั้นของผู้ทำแบบทดสอบ</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {gradeDist.length === 0 ? (
            <p className="text-sm text-muted">ยังไม่มีข้อมูล</p>
          ) : (
            gradeDist.map((g) => (
              <div key={g.grade_band} className="flex flex-col items-center gap-1 rounded-card border border-line bg-surface px-6 py-4">
                <span className="font-display text-2xl font-bold text-ink">{g.count}</span>
                <span className="text-sm text-muted">{g.grade_band}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ─── Content Gap Insight ─── */}
      {contentGap.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Insight: อาชีพที่นักเรียนสนใจแต่โครงงานที่เกี่ยวข้องยังน้อย</SectionTitle>
          <div className="rounded-card border border-alert/30 bg-alert/5 p-5">
            <p className="mb-3 text-sm text-muted">
              อาชีพด้านล่างได้รับความสนใจจากผลแบบทดสอบ แต่ยังไม่มีโครงงานในคลังที่เชื่อมโยงกัน
              เพิ่มโครงงานที่เกี่ยวข้องเพื่อให้นักเรียนได้สำรวจต่อ
            </p>
            <ul className="flex flex-col gap-2">
              {contentGap.map((item) => (
                <li key={item.career} className="flex items-center gap-3 text-sm">
                  <span className="flex-1 font-medium text-ink">{item.career}</span>
                  <span className="rounded-full bg-alert/10 px-2 py-0.5 text-xs text-alert">
                    {item.count} ครั้ง · 0 โครงงาน
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
