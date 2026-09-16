import Link from 'next/link';
import { getCompetitions, getProjects } from '@/lib/data';
import { ProjectCard } from '@/components/ProjectCard';
import { CompetitionCard } from '@/components/CompetitionCard';
import { CATEGORY_ORDER, categoryStyle } from '@/lib/categories';
import { daysLeft } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage() {
  const [projects, competitions] = await Promise.all([getProjects(), getCompetitions()]);

  /* ปิดรับ "วันนี้" คือ 0 วัน ซึ่งยังสมัครทันและเร่งด่วนที่สุด
     เงื่อนไขเดิม > 0 ตัดกิจกรรมที่หมดเขตวันนี้ทิ้งทั้งที่ควรขึ้นเป็นอันแรก */
  const open = competitions.filter((c) => daysLeft(c.close_at) >= 0);
  const soonest = open.slice(0, 3);
  const featured = projects.slice(0, 6);

  return (
    <div className="flex flex-col gap-20 sm:gap-24">
      {/* ─── ฮีโร่ ─────────────────────────────────────────────────────
          คำพาดหัว ปุ่มหลักสองปุ่ม แล้วปิดท้ายด้วยตัวเลขจริงเป็นหลักฐาน
          กองการ์ดด้านขวาเป็นภาพประกอบล้วน จึงซ่อนจากโปรแกรมอ่านหน้าจอ
          เพราะชื่อโครงงานชุดเดียวกันมีให้อ่านอยู่แล้วในส่วน "โครงงานแนะนำ" */}
      <section className="grid items-center gap-10 pt-2 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand-deep">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
            สำหรับนักเรียน ป.4 – ม.6
          </span>

          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
            หาโครงงานที่ทำได้จริง<br />ในเวลาไม่ถึงสองนาที
          </h1>

          <p className="max-w-md text-lg text-muted">
            คลังไอเดียโครงงานวิทยาศาสตร์และเทคโนโลยี ทุกเรื่องบอกงบ เวลา
            และวิธีทำครบตั้งแต่ต้นจนจบ ไม่ต้องเดาว่าทำเสร็จไหม
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/quiz"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-brand-deep"
            >
              ทำแบบทดสอบหาโครงงาน
            </Link>
            <Link
              href="/projects"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-line bg-surface px-6 py-3 font-medium text-ink transition-colors duration-200 hover:border-brand hover:text-brand-deep"
            >
              เลือกดูเองทั้งหมด
            </Link>
          </div>

          <dl className="flex w-full flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
            <Stat value={projects.length} label="โครงงานพร้อมวิธีทำ" />
            <Stat value={CATEGORY_ORDER.length} label="สายวิชาให้เลือก" />
            <Stat value={open.length} label="กิจกรรมที่ยังเปิดรับ" />
          </dl>

          <p className="text-sm text-muted">ดูได้ทุกหน้าโดยไม่ต้องเข้าสู่ระบบ ล็อกอินเมื่ออยากบันทึกเก็บไว้</p>
        </div>

        <div
          className="grid-paper relative hidden rounded-card border border-line bg-surface p-6 lg:block"
          aria-hidden
        >
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

      {/* ─── ใช้งานยังไง ───────────────────────────────────────────────
          หน้าเดิมกระโดดจากฮีโร่ไปหมวดหมู่ทันที คนที่เพิ่งเข้ามาครั้งแรก
          จึงไม่รู้ว่าเว็บนี้พาไปถึงไหน สามขั้นนี้ตอบคำถามนั้นก่อนเลื่อนต่อ */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-bold text-ink">ใช้เวลาสามขั้น</h2>
          <p className="max-w-xl text-muted">
            ไม่ต้องเริ่มจากหน้ากระดาษเปล่า เริ่มจากไอเดียที่มีคนทำสำเร็จมาแล้ว
            แล้วค่อยต่อยอดเป็นของตัวเอง
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-3">
          <Step
            n={1}
            title="บอกเงื่อนไขของคุณ"
            detail="ชั้นเรียน งบที่มี เวลาที่เหลือ และเรื่องที่สนใจ รวมสิบข้อสั้น ๆ"
            icon={
              <>
                <path d="M9 11l3 3 6-6" />
                <path d="M21 12a9 9 0 11-6.22-8.56" />
              </>
            }
          />
          <Step
            n={2}
            title="ได้โครงงานที่ทำได้จริง"
            detail="ระบบตัดเรื่องที่เกินงบหรือเกินเวลาออกให้ก่อน แล้วบอกเหตุผลว่าทำไมถึงเหมาะ"
            icon={
              <>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </>
            }
          />
          <Step
            n={3}
            title="ลงมือตามขั้นตอน"
            detail="แต่ละเรื่องมีวัสดุ ราคา และขั้นตอนครบ พร้อมหัวข้อว่าควรต่อยอดตรงไหน"
            icon={
              <>
                <path d="M4 5h11a3 3 0 013 3v11" />
                <path d="M4 5v12a3 3 0 003 3h10" />
                <path d="M8 9h6M8 13h4" />
              </>
            }
          />
        </ol>
      </section>

      {/* ─── หมวดหมู่ ───────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">เลือกจากสายที่ชอบ</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_ORDER.map((name) => {
            const c = categoryStyle(name);
            const count = projects.filter((p) => p.category === name).length;
            return (
              <li key={name} className="flex">
                <Link
                  href={`/projects?cat=${encodeURIComponent(name)}`}
                  className="flex w-full flex-col gap-3 overflow-hidden rounded-card border border-line bg-surface p-4 transition duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-lift"
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-xl font-display text-lg font-bold text-white ${c.bar}`} aria-hidden>
                    {c.abbr}
                  </span>
                  <span className="font-display font-semibold text-ink">{name}</span>
                  {/* นับเป็นศูนย์ได้จริงเมื่อฐานข้อมูลยังไม่มีเรื่องในสายนั้น
                      ต้องบอกตรง ๆ ไม่งั้นกดเข้าไปเจอหน้าว่างโดยไม่รู้สาเหตุ */}
                  <span className="text-sm text-muted">
                    {count > 0 ? `${count} โครงงาน` : 'ยังไม่มี — ดูสายอื่น'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ─── ข่าวรับสมัคร ───────────────────────────────────────────────
          โชว์กิจกรรมที่ "เปิดรับอยู่ตอนนี้" เป็นการ์ดโปสเตอร์พร้อมปุ่มสมัคร
          เรียงจากใกล้ปิดที่สุดก่อน คนที่เข้ามาจึงเห็นของที่ต้องรีบก่อนเสมอ */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              เปิดรับสมัครอยู่ตอนนี้
            </span>
            <h2 className="font-display text-2xl font-bold text-ink">ข่าวการแข่งขัน</h2>
          </div>
          <Link href="/calendar" className="text-sm font-medium text-brand-deep hover:underline">
            ดูปฏิทินทั้งหมด
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

      {/* ─── โครงงานแนะนำ ─────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-display text-2xl font-bold text-ink">โครงงานแนะนำ</h2>
          <Link href="/projects" className="text-sm font-medium text-brand-deep hover:underline">
            ดูคลังทั้งหมด
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
            detail="ถ้าคุณเป็นผู้ดูแล เพิ่มเรื่องแรกหรือนำเข้าไฟล์ CSV ได้จากหน้าผู้ดูแล"
            href="/admin/projects/new"
            cta="เพิ่มโครงงาน"
          />
        )}
      </section>

      {/* ─── ปิดท้ายด้วยปุ่มอีกครั้ง ──────────────────────────────────
          คนที่เลื่อนมาถึงล่างสุดคือคนที่สนใจที่สุด แต่หน้าเดิมปล่อยให้ชนฟุตเตอร์
          โดยไม่มีอะไรให้กดต่อ ต้องเลื่อนกลับขึ้นไปบนสุดเอง */}
      <section className="grid-paper rounded-card border border-line bg-surface px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            ยังเลือกไม่ถูกใช่ไหม
          </h2>
          <p className="text-muted">
            ตอบสิบข้อเกี่ยวกับชั้นเรียน งบ และเวลาที่มี แล้วให้ระบบคัดเหลือเฉพาะเรื่องที่คุณทำเสร็จได้จริง
            พร้อมเหตุผลว่าทำไมถึงเหมาะกับคุณ
          </p>
          <Link
            href="/quiz"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-brand-deep sm:w-auto"
          >
            เริ่มตอบแบบทดสอบ
          </Link>
        </div>
      </section>
    </div>
  );
}

/* dt ต้องมาก่อน dd ในโครงสร้าง โปรแกรมอ่านหน้าจอจึงได้ยิน "ชื่อค่า: ตัวเลข"
   ส่วนสายตาอยากเห็นตัวเลขขึ้นก่อน จึงพลิกลำดับด้วย flex-col-reverse แทน */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-display text-2xl font-bold text-ink">{value.toLocaleString('th-TH')}</dd>
    </div>
  );
}

function Step({
  n,
  title,
  detail,
  icon,
}: {
  n: number;
  title: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
      <span className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-light text-brand-deep">
          {/* ไอคอนเป็น SVG เส้น ไม่ใช้อีโมจิ เพราะอีโมจิเปลี่ยนหน้าตาตามเครื่องและอ่านออกเสียงมั่ว */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {icon}
          </svg>
        </span>
        <span className="font-display text-sm font-semibold text-muted">ขั้นที่ {n}</span>
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="text-sm text-muted">{detail}</p>
    </li>
  );
}

function Empty({ title, detail, href, cta }: { title: string; detail: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-card border border-dashed border-line bg-surface p-6">
      <p className="font-display font-semibold text-ink">{title}</p>
      <p className="text-sm text-muted">{detail}</p>
      <Link
        href={href}
        className="inline-flex min-h-[44px] items-center rounded-lg border border-line px-4 py-2 text-sm font-medium text-brand-deep transition-colors duration-200 hover:border-brand hover:bg-brand-light"
      >
        {cta}
      </Link>
    </div>
  );
}
