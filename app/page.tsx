import Link from 'next/link';
import { getCompetitions, getProjects } from '@/lib/data';
import { ProjectCard } from '@/components/ProjectCard';
import { CompetitionCard } from '@/components/CompetitionCard';

export const revalidate = 60;

export default async function HomePage() {
  const [projects, competitions] = await Promise.all([getProjects(), getCompetitions()]);

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-5">
        <p className="text-sm text-brand-deep">ระบบคัดสรรไอเดียโครงงาน · สำหรับ ป.4 – ม.6</p>
        <h1 className="max-w-2xl font-display text-4xl font-semibold text-ink">
          หาโครงงานที่ใช่ ในเวลาไม่ถึงสองนาที
        </h1>
        <p className="max-w-prose text-muted">
          คลังไอเดียโครงงานวิทยาศาสตร์และเทคโนโลยี พร้อมวิธีทำ งบประมาณ ระยะเวลา
          และปฏิทินกิจกรรมที่เปิดรับสมัครจริง
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/quiz"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
          >
            ทำแบบทดสอบหาโครงงานที่ใช่
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-brand px-5 py-2.5 text-sm font-medium text-brand-deep hover:bg-brand-light"
          >
            เลือกดูตามหมวดหมู่
          </Link>
        </div>
        <p className="text-sm text-muted">
          {projects.length} โครงงาน · {competitions.length} กิจกรรมที่เปิดรับ · ดูฟรีไม่ต้องเข้าสู่ระบบ
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-medium text-ink">กิจกรรมที่เปิดรับสมัคร</h2>
          <Link href="/calendar" className="text-sm text-brand-deep hover:underline">
            ดูปฏิทินทั้งหมด
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {competitions.map((c) => (
            <CompetitionCard key={c.id} competition={c} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-medium text-ink">โครงงานแนะนำ</h2>
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
