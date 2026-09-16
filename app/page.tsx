import Link from 'next/link';
import { getCompetitions, getProjects } from '@/lib/data';
import { ProjectCard } from '@/components/ProjectCard';
import { CompetitionCard } from '@/components/CompetitionCard';
import { CATEGORY_ORDER, categoryStyle } from '@/lib/categories';
import { daysLeft } from '@/lib/types';

export const revalidate = 60;

// ─── Button primitives ────────────────────────────────────────────────────────
// GitHub-inspired "press" effect: shadow drops on hover, translates on active
// ใช้ใน 2 variant: solid (on dark/light) และ ghost (on dark)
const btn = {
  solid: 'inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 font-display font-semibold text-white shadow-[0_4px_0_0_#7B1540] transition-all duration-100 hover:shadow-[0_2px_0_0_#7B1540] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none',
  ghost: 'inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 font-display font-semibold text-white backdrop-blur transition-colors duration-200 hover:bg-white/12',
  outline: 'inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-brand px-6 font-display font-semibold text-brand transition-all duration-100 hover:bg-brand hover:text-white',
};

export default async function HomePage() {
  const [projects, competitions] = await Promise.all([getProjects(), getCompetitions()]);

  const open     = competitions.filter((c) => daysLeft(c.close_at) >= 0);
  const soonest  = open.slice(0, 3);
  const featured = projects.slice(0, 6);

  return (
    <div className="flex flex-col gap-20 sm:gap-28">

      {/* ═══════════════════════════════════════════════════════════════
          HERO — dark aurora background, bold headline, press-shadow CTAs
          อ้างอิง: 16personalities.com (dark immersive) + GitHub (press button)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0D0D14] px-6 py-16 sm:px-10 sm:py-20">
        {/* Aurora blobs — CSS only, no JS, respects reduced-motion automatically */}
        <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-brand/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#5B3FD6]/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0A7EA4]/15 blur-3xl" aria-hidden />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          {/* Left — copy */}
          <div className="flex flex-col items-start gap-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              สำหรับนักเรียน ป.1 – ม.6
            </span>

            <h1 className="font-display text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
              หาโครงงาน<br />ที่ทำได้จริง
            </h1>

            <p className="max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
              คลังไอเดียโครงงานวิทยาศาสตร์และเทคโนโลยี ทุกเรื่องบอกงบ เวลา
              และวิธีทำครบตั้งแต่ต้นจนจบ
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/quiz" className={btn.solid}>
                ทำแบบทดสอบหาโครงงาน
              </Link>
              <Link href="/projects" className={btn.ghost}>
                เลือกดูเอง
              </Link>
            </div>

            {/* Stats — large white numbers inside hero */}
            <dl className="flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
              <HeroStat value={projects.length} label="โครงงาน" />
              <HeroStat value={CATEGORY_ORDER.length} label="สายวิชา" />
              <HeroStat value={open.length} label="กิจกรรมเปิดรับ" />
            </dl>
          </div>

          {/* Right — floating glass project cards (decorative) */}
          <div className="hidden flex-col gap-3 lg:flex" aria-hidden>
            {projects.slice(0, 3).map((p, i) => {
              const c = categoryStyle(p.category);
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
                  style={{ marginLeft: i * 24, transform: `rotate(${(i - 1) * 0.7}deg)` }}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white ${c.bar}`}>
                    {c.abbr}
                  </span>
                  <span className="text-sm font-medium text-white/80">{p.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STEPS — numbered with brand accent bar, cleaner than before
          ═══════════════════════════════════════════════════════════════ */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">ใช้เวลาสามขั้น</h2>
          <p className="max-w-xl text-muted">
            ไม่ต้องเริ่มจากหน้ากระดาษเปล่า เริ่มจากไอเดียที่มีคนทำสำเร็จมาแล้ว
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-3">
          <Step n={1} title="บอกเงื่อนไขของคุณ" detail="ชั้นเรียน งบที่มี เวลาที่เหลือ และเรื่องที่สนใจ รวมสิบข้อสั้น ๆ" />
          <Step n={2} title="ได้โครงงานที่ทำได้จริง" detail="ระบบตัดเรื่องที่เกินงบหรือเกินเวลาออก แล้วบอกเหตุผลว่าทำไมถึงเหมาะ" />
          <Step n={3} title="ลงมือตามขั้นตอน" detail="วัสดุ ราคา ขั้นตอนครบ พร้อมหัวข้อว่าควรต่อยอดตรงไหน" />
        </ol>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CAREER DISCOVERY CTA — dark aurora, like 16personalities intro
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0D0D14] px-6 py-12 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-brand/35 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-[#5B3FD6]/30 blur-3xl" aria-hidden />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              ค้นพบตัวเอง
            </span>
            <h2 className="font-display text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
              ยังไม่รู้ว่าอยากเป็นอะไร?<br className="hidden sm:block" />
              ลองหาคำตอบจากชีวิตจริง
            </h2>
            <p className="max-w-md text-white/60">
              ตอบ 22 คำถามเกี่ยวกับสิ่งที่คุณทำและชอบ ระบบจะวิเคราะห์บุคลิก
              แล้วแนะนำอาชีพที่เหมาะกับคุณจาก 28 สาขา
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/career" className={btn.solid}>
                เริ่มค้นหาตัวเอง
              </Link>
              <span className="text-sm text-white/40">ใช้เวลา ~3 นาที · ไม่ต้องสมัครสมาชิก</span>
            </div>
          </div>

          {/* Career badge stack — staggered like personality type cards */}
          <div className="hidden flex-col gap-2 lg:flex" aria-hidden>
            {[
              { label: 'แพทย์',             color: '#0F7A55' },
              { label: 'วิศวกรซอฟต์แวร์',   color: '#0A7EA4' },
              { label: 'นักออกแบบ',          color: '#C22367' },
              { label: 'ผู้ประกอบการ',       color: '#B35A00' },
              { label: 'นักวิทยาศาสตร์',    color: '#5B3FD6' },
              { label: 'ครู/อาจารย์',        color: '#A32E86' },
            ].map((item, i) => (
              <span
                key={item.label}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white"
                style={{
                  backgroundColor: `${item.color}cc`,
                  transform: `translateX(${i % 2 === 0 ? 0 : 20}px)`,
                }}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORIES
          ═══════════════════════════════════════════════════════════════ */}
      <section className="flex flex-col gap-5">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">เลือกจากสายที่ชอบ</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_ORDER.map((name) => {
            const c = categoryStyle(name);
            const count = projects.filter((p) => p.category === name).length;
            return (
              <li key={name} className="flex">
                <Link
                  href={`/projects?cat=${encodeURIComponent(name)}`}
                  className="group flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-lift"
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-xl font-display text-lg font-bold text-white transition-transform duration-200 group-hover:scale-110 ${c.bar}`} aria-hidden>
                    {c.abbr}
                  </span>
                  <span className="font-display font-semibold text-ink">{name}</span>
                  <span className="text-sm text-muted">
                    {count > 0 ? `${count} โครงงาน` : 'ยังไม่มี'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COMPETITIONS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              เปิดรับสมัครอยู่ตอนนี้
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">ข่าวการแข่งขัน</h2>
          </div>
          <Link href="/calendar" className="text-sm font-semibold text-brand-deep hover:underline">
            ดูปฏิทินทั้งหมด →
          </Link>
        </div>
        {soonest.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {soonest.map((c) => (
              <li key={c.id} className="flex">
                <CompetitionCard competition={c} />
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            title="ยังไม่มีกิจกรรมที่เปิดรับอยู่ตอนนี้"
            detail="ปฏิทินอัปเดตตลอดปี ระหว่างนี้เลือกโครงงานเตรียมไว้ก่อนได้"
            href="/projects"
            cta="ไปดูคลังโครงงาน"
          />
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURED PROJECTS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">โครงงานแนะนำ</h2>
          <Link href="/projects" className="text-sm font-semibold text-brand-deep hover:underline">
            ดูคลังทั้งหมด →
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <Empty
            title="ยังไม่มีโครงงานในคลัง"
            detail="เพิ่มเรื่องแรกหรือนำเข้าไฟล์ CSV ได้จากหน้าผู้ดูแล"
            href="/admin/projects/new"
            cta="เพิ่มโครงงาน"
          />
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM CTA — dark, aurora-glow
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0D0D14] px-6 py-14 text-center sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-brand/25 blur-3xl" aria-hidden />
        <div className="relative mx-auto flex max-w-lg flex-col items-center gap-6">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            ยังเลือกไม่ถูกใช่ไหม
          </h2>
          <p className="text-white/60">
            ตอบสิบข้อเกี่ยวกับชั้นเรียน งบ และเวลาที่มี
            แล้วให้ระบบคัดเหลือเฉพาะเรื่องที่ทำเสร็จได้จริง
          </p>
          <Link href="/quiz" className={`${btn.solid} px-10`}>
            เริ่มตอบแบบทดสอบ
          </Link>
          <p className="text-xs text-white/30">ดูได้ทุกหน้าโดยไม่ต้องเข้าสู่ระบบ</p>
        </div>
      </section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-xs text-white/40">{label}</dt>
      <dd className="font-display text-2xl font-bold text-white">{value.toLocaleString('th-TH')}</dd>
    </div>
  );
}

function Step({ n, title, detail }: { n: number; title: string; detail: string }) {
  return (
    <li className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-surface p-6">
      {/* brand accent bar on left */}
      <div className="absolute left-0 top-0 h-full w-[3px] rounded-r-full bg-brand" aria-hidden />
      {/* large watermark number */}
      <span className="font-display text-6xl font-bold leading-none text-brand/10 select-none" aria-hidden>
        {n}
      </span>
      <h3 className="font-display text-base font-bold text-ink sm:text-lg">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{detail}</p>
    </li>
  );
}

function Empty({ title, detail, href, cta }: { title: string; detail: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-line bg-surface p-6">
      <p className="font-display font-semibold text-ink">{title}</p>
      <p className="text-sm text-muted">{detail}</p>
      <Link
        href={href}
        className="inline-flex min-h-[44px] items-center rounded-xl border border-line px-4 py-2 text-sm font-semibold text-brand-deep transition-colors duration-200 hover:border-brand hover:bg-brand-light"
      >
        {cta}
      </Link>
    </div>
  );
}
