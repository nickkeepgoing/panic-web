import Link from 'next/link';
import { getCompetitions, getProjects } from '@/lib/data';
import { ProjectCard } from '@/components/ProjectCard';
import { CompetitionCard } from '@/components/CompetitionCard';
import { CATEGORY_ORDER, categoryStyle } from '@/lib/categories';
import { daysLeft } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage() {
  const [projects, competitions] = await Promise.all([getProjects(), getCompetitions()]);
  const soonest = competitions.filter((c) => daysLeft(c.close_at) > 0).slice(0, 4);

  return (
    <div className="flex flex-col gap-16">
      {/* ฮีโร่: หัวเรื่องคู่กับกองการ์ดโครงงานจริงที่วางเหลื่อมกันเหมือนแฟ้มไอเดียบนโต๊ะ */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col items-start gap-5">
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
            หาโครงงานที่ทำได้จริง<br />ในเวลาไม่ถึงสองนาที
          </h1>
          <p className="max-w-md text-muted">
            คลังไอเดียโครงงานวิทยาศาสตร์และเทคโนโลยีสำหรับ ป.4 ถึง ม.6
            ทุกเรื่องบอกงบ เวลา และวิธีทำครบ ไม่ต้องเดาว่าทำเสร็จไหม
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-deep"
            >
              ตอบ 10 ข้อ ให้ระบบเลือกให้
            </Link>
            <Link
              href="/projects"
              className="rounded-lg border border-line bg-surface px-6 py-3 font-medium text-ink hover:border-brand hover:text-brand-deep"
            >
              เลือกดูเองทั้งหมด
            </Link>
          </div>
          <p className="text-sm text-muted">
            ตอนนี้มี {projects.length} โครงงาน และ {soonest.length} กิจกรรมที่ยังเปิดรับสมัคร ดูได้เลยไม่ต้องเข้าสู่ระบบ
          </p>
        </div>

        <div className="grid-paper relative hidden rounded-card border border-line bg-surface p-6 lg:block">
          <div className="flex flex-col gap-3">
            {projects.slice(0, 3).map((p, i) => {
              const c = categoryStyle(p.category);
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3 shadow-lift"
                  style={{ marginLeft: i * 22, transform: `rotate(${(i - 1) * 0.8}deg)` }}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md font-display text-sm font-bold text-white ${c.bar}`}>
                    {c.abbr}
                  </span>
                  <span className="text-sm text-ink">{p.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* หมวดหมู่: สีประจำสายวิชา กดแล้วเข้าคลังที่กรองไว้ให้แล้ว */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">เลือกจากสายที่ชอบ</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_ORDER.map((name) => {
            const c = categoryStyle(name);
            const count = projects.filter((p) => p.category === name).length;
            return (
              <Link
                key={name}
                href={`/projects?cat=${encodeURIComponent(name)}`}
                className="flex flex-col gap-3 overflow-hidden rounded-card border border-line bg-surface p-4 hover:shadow-lift"
              >
                <span className={`grid h-11 w-11 place-items-center rounded-lg font-display text-base font-bold text-white ${c.bar}`}>
                  {c.abbr}
                </span>
                <span className="font-display font-semibold text-ink">{name}</span>
                <span className="text-sm text-muted">{count} โครงงาน</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-ink">ใกล้ปิดรับสมัคร</h2>
          <Link href="/calendar" className="text-sm text-brand-deep hover:underline">
            ดูปฏิทินทั้งหมด
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {soonest.map((c) => (
            <CompetitionCard key={c.id} competition={c} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-ink">โครงงานแนะนำ</h2>
          <Link href="/projects" className="text-sm text-brand-deep hover:underline">
            ดูคลังทั้งหมด
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
