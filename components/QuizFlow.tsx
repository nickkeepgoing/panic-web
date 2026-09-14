'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { QUIZ, scoreQuiz, type QuizAnswers } from '@/lib/quiz';
import { recommend, FACTOR_LABELS, type FactorKey, type Recommendation } from '@/lib/recommend';
import { DIFFICULTY_TH, budgetLabel, type Project } from '@/lib/types';

const BAR_COLORS = ['bg-brand', 'bg-sci', 'bg-tech', 'bg-envi', 'bg-engr'];
const FACTOR_ORDER: FactorKey[] = ['interest', 'budget', 'time', 'skill', 'difficulty'];

export function QuizFlow({ projects }: { projects: Project[] }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLLegendElement>(null);
  const helperId = useId();

  // ย้ายโฟกัสไปที่คำถามทุกครั้งที่เปลี่ยนข้อ โปรแกรมอ่านหน้าจอจะได้ประกาศคำถามใหม่เอง
  // ไม่ใช่ให้ผู้ใช้คลำหาว่าตอนนี้อยู่ข้อไหน
  useEffect(() => {
    if (started && !done) headingRef.current?.focus();
  }, [step, started, done]);

  // --- Start screen ---
  if (!started) {
    return (
      <div className="flex flex-col items-center gap-8 py-12 text-center">
        <div className="flex h-20 w-20 items-end gap-1.5 rounded-2xl bg-brand p-4">
          {[40, 55, 70, 55, 40].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-white/80" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-bold text-ink">ค้นหาโครงงานที่ใช่</h1>
          <p className="max-w-sm text-muted">
            ตอบ {QUIZ.length} ข้อสั้น ๆ ระบบจะเลือกโครงงานจาก {projects.length} เรื่อง
            ที่เหมาะกับความสนใจและข้อจำกัดของคุณจริง ๆ
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="rounded-lg bg-brand px-10 py-3.5 font-display text-lg font-semibold text-white hover:bg-brand-deep"
          >
            เริ่มทำแบบทดสอบ
          </button>
          <p className="text-sm text-muted">ใช้เวลาประมาณ 2 นาที · ดูฟรีไม่ต้องเข้าสู่ระบบ</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-muted">
          {['งบประมาณที่มี', 'เวลาที่มี', 'ความสนใจ', 'ระดับชั้น'].map((tag) => (
            <span key={tag} className="rounded-full border border-line bg-surface px-3 py-1">{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  // --- Quiz screen ---
  const question = QUIZ[step];

  // เลือกคำตอบแล้ว "ไม่" เด้งไปข้อถัดไปเอง — ผู้ใช้กดถัดไปเองเพื่อให้คุมจังหวะได้
  // และเพื่อไม่ให้การเลื่อนเลือกด้วยลูกศรคีย์บอร์ด (radio) กระโดดข้ามข้อ
  function select(optionId: string) {
    setAnswers((a) => ({ ...a, [question.id]: optionId }));
    setError('');
  }

  function next() {
    if (!answers[question.id]) {
      setError('เลือกคำตอบก่อนหนึ่งข้อ');
      return;
    }
    if (step + 1 < QUIZ.length) setStep(step + 1);
    else setDone(true);
  }

  function back() {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  }

  if (done) {
    return (
      <QuizResult
        answers={answers}
        projects={projects}
        onRestart={() => { setAnswers({}); setStep(0); setDone(false); setStarted(false); }}
      />
    );
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => { e.preventDefault(); next(); }}
    >
      {/* ── ความคืบหน้า: ตัวเลขข้อ + ป้ายชนิดคำถาม + แถบแบ่งช่อง ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-ink">
            ข้อ {step + 1} <span className="text-muted">จาก {QUIZ.length}</span>
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              question.kind === 'filter' ? 'bg-tech/10 text-tech' : 'bg-brand-light text-brand-deep'
            }`}
          >
            {question.kind === 'filter' ? 'ใช้กรองผลลัพธ์' : 'วัดความสนใจ'}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={QUIZ.length}
          aria-valuenow={step + 1}
          aria-label={`ความคืบหน้า ข้อ ${step + 1} จาก ${QUIZ.length}`}
          className="flex gap-1.5"
        >
          {QUIZ.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${i <= step ? 'bg-brand' : 'bg-brand-light'}`}
            />
          ))}
        </div>
      </div>

      {/* ── คำถาม + ตัวเลือกเป็น radio จริง คีย์บอร์ดเลื่อนด้วยลูกศรได้ตามมาตรฐาน ── */}
      <fieldset className="flex flex-col gap-4 border-0 p-0">
        <legend
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-2xl font-bold text-ink outline-none sm:text-3xl"
        >
          {question.question}
        </legend>
        {question.helper && <p id={helperId} className="-mt-1 text-sm text-muted">{question.helper}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((o) => (
            <label
              key={o.id}
              className="flex cursor-pointer items-start gap-3 rounded-card border border-line bg-surface p-4 transition-colors duration-200 hover:border-brand hover:bg-brand-light/40 has-[:checked]:border-brand has-[:checked]:bg-brand-light has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
            >
              <input
                type="radio"
                name={question.id}
                value={o.id}
                checked={answers[question.id] === o.id}
                onChange={() => select(o.id)}
                aria-describedby={question.helper ? helperId : undefined}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-line transition-colors duration-200 peer-checked:border-brand"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-brand opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
              </span>
              <span className="text-ink">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p role="alert" className="text-sm font-medium text-alert">{error}</p>}

      <div className="flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="inline-flex min-h-[44px] items-center rounded-lg border border-line px-4 text-sm font-medium text-muted transition-colors duration-200 hover:border-brand hover:text-brand-deep"
          >
            ย้อนกลับ
          </button>
        )}
        <button
          type="submit"
          className="ml-auto inline-flex min-h-[44px] items-center rounded-lg bg-brand px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-deep"
        >
          {step + 1 === QUIZ.length ? 'ดูผลลัพธ์' : 'ข้อถัดไป'}
        </button>
      </div>
    </form>
  );
}

function QuizResult({
  answers,
  projects,
  onRestart,
}: {
  answers: QuizAnswers;
  projects: Project[];
  onRestart: () => void;
}) {
  // ทุกอย่างคำนวณในเครื่อง เร็วและได้ผลเดิมทุกครั้ง ไม่ต้องพึ่ง network
  const profile = useMemo(() => scoreQuiz(answers), [answers]);
  const recs = useMemo(() => recommend(profile, projects, 6), [profile, projects]);
  const best = recs[0];
  const rest = recs.slice(1);
  const weak = !!best && best.overall < 55;

  // ผลลัพธ์คำนวณเสร็จทันที แต่โชว์หน้า "กำลังคำนวณ" สั้น ๆ ให้ผู้ใช้รู้สึกว่าระบบ
  // กำลังวิเคราะห์คำตอบจริง ผู้ที่ตั้งค่าลดการเคลื่อนไหวไว้จะข้ามไปดูผลทันที
  const [calculating, setCalculating] = useState(true);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setCalculating(false);
      return;
    }
    const t = setTimeout(() => setCalculating(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (calculating) return <Calculating count={projects.length} />;

  return (
    <div className="flex flex-col gap-10">
      {/* โปรไฟล์ความสนใจ + ข้อจำกัด — โชว์ก่อนเพื่อให้ผู้ใช้เห็นว่าระบบอ่านคำตอบยังไง */}
      <section className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-bold text-ink">ผลลัพธ์ของคุณ</h1>
        <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
          <p className="text-sm font-medium text-ink">โปรไฟล์ความสนใจที่ระบบอ่านได้</p>
          <ul className="flex flex-col gap-2.5">
            {profile.tags.map((t, i) => (
              <li key={t.slug} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm text-ink sm:w-40">{t.label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-ground">
                  <span className={`block h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} style={{ width: `${t.score}%` }} />
                </span>
                <span className="w-10 text-right text-sm text-muted">{t.score}%</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">
            ข้อจำกัด: งบไม่เกิน {profile.budgetMax === 99999 ? 'ไม่จำกัด' : `${profile.budgetMax.toLocaleString('th-TH')} บาท`}
            {' · '}เวลาไม่เกิน {profile.weeksMax === 99 ? 'ไม่จำกัด' : `${profile.weeksMax} สัปดาห์`}
          </p>
        </div>
      </section>

      {!best ? (
        <div className="rounded-card border border-line bg-surface p-6">
          <p className="text-ink">ยังไม่มีโครงงานในคลังให้จับคู่</p>
          <p className="mt-1 text-sm text-muted">ลองกลับมาใหม่เมื่อมีการเพิ่มโครงงาน</p>
        </div>
      ) : (
        <>
          {/* กรณีไม่มีเรื่องที่ตรงเป๊ะ ไม่ขึ้นหน้าว่าง แต่บอกให้ย่อขอบเขตแทน */}
          {weak && (
            <div className="rounded-card border border-engr/40 bg-engr/5 p-5">
              <p className="font-display font-semibold text-ink">ยังไม่มีเรื่องที่ตรงเป๊ะกับข้อจำกัดของคุณ</p>
              <p className="mt-1 text-sm text-muted">
                แต่เรื่องด้านล่างปรับให้ทำได้จริงด้วยการย่อขอบเขตลง ดูข้อเสนอในการ์ดแต่ละใบได้เลย
              </p>
            </div>
          )}

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" />
                </svg>
              </span>
              <h2 className="font-display text-2xl font-bold text-ink">โครงงานที่ตรงกับคุณมากที่สุด</h2>
            </div>
            <BestCard rec={best} />
          </section>

          {rest.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-display text-xl font-bold text-ink">ตัวเลือกอื่นที่น่าสนใจ</h2>
              <ol className="grid gap-4 sm:grid-cols-2">
                {rest.map((r) => (
                  <li key={r.project.id} className="flex">
                    <OtherCard rec={r} />
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg border border-brand px-4 py-2 text-sm text-brand-deep hover:bg-brand-light"
        >
          ทำแบบทดสอบใหม่
        </button>
        <Link href="/projects" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep">
          ไล่ดูคลังทั้งหมด
        </Link>
      </div>
    </div>
  );
}

/** หน้าจอคั่นระหว่างทำแบบทดสอบเสร็จกับการโชว์ผล — ให้ความรู้สึกว่ากำลังประมวลผล */
function Calculating({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-center gap-8 py-20 text-center" role="status" aria-live="polite">
      <div className="flex h-24 w-24 items-end justify-center gap-2 rounded-2xl bg-brand p-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-full w-1.5 origin-bottom rounded-sm bg-white/85 animate-[equalize_0.9s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">กำลังคำนวณผลลัพธ์</h1>
        <p className="max-w-xs text-muted">จับคู่คำตอบของคุณกับโครงงานทั้ง {count} เรื่อง แล้วให้คะแนนความเหมาะสม</p>
      </div>

      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-brand-light">
        <div className="h-full rounded-full bg-brand animate-[fillbar_1.5s_ease-out_forwards]" />
      </div>

      <span className="sr-only">กำลังคำนวณผลลัพธ์…</span>
    </div>
  );
}

/** คะแนนความเข้ากันรวม สีบอกระดับ: เขียวเข้ม(แบรนด์)=สูง อำพัน=กลาง แดง=ต่ำ */
function MatchScore({ value, small }: { value: number; small?: boolean }) {
  const tone = value >= 80 ? 'text-brand' : value >= 55 ? 'text-engr' : 'text-alert';
  return (
    <div className="shrink-0 text-right">
      <span className={`font-display font-bold leading-none ${tone} ${small ? 'text-2xl' : 'text-4xl'}`}>{value}%</span>
      <span className="block text-xs text-muted">ตรงกับคุณ</span>
    </div>
  );
}

function factorTone(v: number) {
  return v >= 80 ? 'bg-brand' : v >= 50 ? 'bg-engr' : 'bg-alert';
}

/** ตารางคะแนนรายปัจจัย — หัวใจของความโปร่งใส ผู้ใช้เห็นว่าคะแนนรวมมาจากอะไร */
function FactorBreakdown({ factors, compact }: { factors: Record<FactorKey, number>; compact?: boolean }) {
  return (
    <dl className={`grid gap-x-5 gap-y-2 ${compact ? '' : 'sm:grid-cols-2'}`}>
      {FACTOR_ORDER.map((k) => (
        <div key={k} className="flex items-center gap-3">
          <dt className="w-20 shrink-0 text-xs text-muted">{FACTOR_LABELS[k]}</dt>
          <dd className="flex flex-1 items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ground">
              <span className={`block h-full rounded-full ${factorTone(factors[k])}`} style={{ width: `${factors[k]}%` }} />
            </span>
            <span className="w-9 text-right text-xs tabular-nums text-muted">{factors[k]}%</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Fact({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-ground px-2 py-1 text-muted">{children}</span>;
}

function BestCard({ rec }: { rec: Recommendation }) {
  const p = rec.project;
  return (
    <article className="flex flex-col gap-5 overflow-hidden rounded-card border-2 border-brand bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <Link href={`/projects/${p.slug}`} className="font-display text-xl font-bold leading-snug text-ink hover:text-brand-deep">
            {p.title}
          </Link>
          {p.summary && <p className="text-sm text-muted">{p.summary}</p>}
        </div>
        <MatchScore value={rec.overall} />
      </div>

      <FactorBreakdown factors={rec.factors} />

      <p className="rounded-lg border-l-4 border-brand bg-brand-light/60 px-4 py-3 text-sm text-brand-deep">{rec.reason}</p>

      {rec.scopeHint && (
        <div className="rounded-lg border border-engr/40 bg-engr/5 px-4 py-3 text-sm">
          <p className="font-medium text-ink">ปรับให้ทำได้จริง</p>
          <p className="mt-1 text-muted">{rec.scopeHint}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        <Fact>{DIFFICULTY_TH[p.difficulty]}</Fact>
        <Fact>{budgetLabel(p.budget_min, p.budget_max)}</Fact>
        <Fact>{p.duration_weeks} สัปดาห์</Fact>
      </div>

      <Link
        href={`/projects/${p.slug}`}
        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-deep sm:w-fit"
      >
        ดูรายละเอียดโครงงาน
      </Link>
    </article>
  );
}

function OtherCard({ rec }: { rec: Recommendation }) {
  const p = rec.project;
  const poster = /^https?:\/\//i.test(p.cover_url ?? '') ? p.cover_url! : null;

  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group flex w-full gap-4 rounded-card border border-line bg-surface p-3 transition duration-200 hover:border-brand hover:shadow-lift"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-brand-light">
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="96px"
          />
        ) : (
          <span className="block h-full w-full bg-gradient-to-br from-brand to-brand-deep" aria-hidden />
        )}
        <span className="absolute left-1.5 top-1.5 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-bold text-brand-deep shadow-sm">
          {rec.overall}%
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink group-hover:text-brand-deep">
          {p.title}
        </h3>
        <span className="mt-auto flex flex-wrap gap-1.5 text-xs">
          <Fact>{DIFFICULTY_TH[p.difficulty]}</Fact>
          <Fact>{budgetLabel(p.budget_min, p.budget_max)}</Fact>
          <Fact>{p.duration_weeks} สัปดาห์</Fact>
        </span>
      </div>
    </Link>
  );
}
