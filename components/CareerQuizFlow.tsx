'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { CAREER_QUIZ, DIM_LABELS, scoreCareerQuiz, type CareerQuizAnswers, type DimSlug } from '@/lib/career-quiz';
import { recommendCareers, type CareerMatch } from '@/lib/career-recommend';
import { type Career, type CareerCategory } from '@/lib/career-data';
import { ProjectCard } from '@/components/ProjectCard';
import type { Project } from '@/lib/types';

type Props = {
  careers: Career[];
  projects: Project[];
  sessionId: string;
};

type State = 'start' | 'quiz' | 'calculating' | 'results';

// ─── Event helper ────────────────────────────────────────────────────────────
function trackEvent(sessionId: string, type: string, extra?: Record<string, unknown>) {
  fetch('/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, event_type: type, page: '/career', ...extra }),
  }).catch(() => {});
}

// ─── Category badge colors via inline style (DB-driven, can't use Tailwind purge) ─
function CategoryBadge({ category }: { category?: CareerCategory }) {
  if (!category) return null;
  return (
    <span
      className="inline-block rounded-md px-2 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: category.color }}
    >
      {category.name_th}
    </span>
  );
}

// ─── Score bar ───────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <span>ความเหมาะสม</span>
      <div className="flex-1 overflow-hidden rounded-full bg-ground">
        <div
          className="h-1.5 rounded-full bg-brand transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-8 text-right font-medium text-ink">{score}%</span>
    </div>
  );
}

// ─── Career card in results ──────────────────────────────────────────────────
function CareerCard({ match }: { match: CareerMatch }) {
  const { career, score, topDims } = match;
  const cat = career.category as CareerCategory | undefined;

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-lg font-bold text-ink">{career.name_th}</h3>
          <p className="text-xs text-muted">{career.name_en}</p>
        </div>
        <CategoryBadge category={cat} />
      </div>

      <ScoreBar score={score} />

      <p className="text-sm text-muted">{career.description_th}</p>

      {topDims.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topDims.map((d) => (
            <span key={d} className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-deep">
              {DIM_LABELS[d]}
            </span>
          ))}
        </div>
      )}

      {career.skills_th.length > 0 && (
        <div>
          <p className="mb-1 text-xs text-muted">ทักษะที่เกี่ยวข้อง</p>
          <div className="flex flex-wrap gap-1">
            {career.skills_th.map((s) => (
              <span key={s} className="rounded-md bg-ground px-2 py-0.5 text-xs text-muted">{s}</span>
            ))}
          </div>
        </div>
      )}

      {career.education_hint_th && (
        <p className="rounded-lg bg-ground px-3 py-2 text-xs text-muted">
          <span className="font-medium text-ink">การศึกษา: </span>
          {career.education_hint_th}
        </p>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export function CareerQuizFlow({ careers, projects, sessionId }: Props) {
  const [state, setState] = useState<State>('start');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CareerQuizAnswers>({});
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [topDimsList, setTopDimsList] = useState<DimSlug[]>([]);
  const headingRef = useRef<HTMLLegendElement>(null);
  const helperId = useId();

  // ย้ายโฟกัสไปคำถามใหม่ทุกครั้ง (a11y — ตามแบบ QuizFlow)
  useEffect(() => {
    if (state === 'quiz') headingRef.current?.focus();
  }, [step, state]);

  // ─── Start ──────────────────────────────────────────────────────────
  if (state === 'start') {
    return (
      <div className="flex flex-col items-center gap-8 py-12 text-center">
        <div className="flex h-20 w-20 items-end gap-1.5 rounded-2xl bg-brand p-4">
          {[35, 55, 70, 55, 35].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-white/80" style={{ height: `${h}%` }} aria-hidden />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-bold text-ink">ค้นหาตัวเองและอาชีพที่ใช่</h1>
          <p className="max-w-sm text-muted">
            ตอบ {CAREER_QUIZ.length} ข้อสั้น ๆ เกี่ยวกับตัวคุณ
            ระบบจะแนะนำอาชีพที่เหมาะกับความสนใจและบุคลิกของคุณจาก {careers.length} อาชีพ
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => {
              trackEvent(sessionId, 'CAREER_TEST_START');
              setState('quiz');
            }}
            className="rounded-lg bg-brand px-10 py-3.5 font-display text-lg font-semibold text-white transition-colors duration-200 hover:bg-brand-deep"
          >
            เริ่มค้นหาตัวเอง
          </button>
          <p className="text-sm text-muted">ใช้เวลาประมาณ 3 นาที · ไม่ต้องเข้าสู่ระบบ</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-sm text-muted">
          {['ความสนใจ', 'รูปแบบการทำงาน', 'บุคลิกภาพ', 'ทักษะ', 'สภาพแวดล้อม'].map((tag) => (
            <span key={tag} className="rounded-full border border-line bg-surface px-3 py-1">{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  // ─── Quiz ────────────────────────────────────────────────────────────
  if (state === 'quiz') {
    const question = CAREER_QUIZ[step];
    const chosen = answers[question.id];

    function select(optId: string) {
      setAnswers((a) => ({ ...a, [question.id]: optId }));
      setError('');
    }

    function next() {
      if (!chosen) { setError('เลือกคำตอบก่อนนะ'); return; }
      if (step + 1 < CAREER_QUIZ.length) {
        setStep(step + 1);
      } else {
        // คำนวณผล
        setState('calculating');
        setTimeout(() => {
          const profile = scoreCareerQuiz(answers);
          const result = recommendCareers(profile, careers, 5);
          setMatches(result);

          // หา top dims จาก profile
          const sorted = [...profile.dims.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .filter(([, v]) => v >= 30)
            .map(([d]) => d);
          setTopDimsList(sorted);

          // บันทึก event
          trackEvent(sessionId, 'CAREER_TEST_COMPLETE', {
            metadata: { top_careers: result.slice(0, 3).map((m) => m.career.slug) },
          });

          setState('results');
        }, 2800);
      }
    }

    function prev() {
      if (step > 0) { setStep(step - 1); setError(''); }
    }

    const progress = Math.round(((step + 1) / CAREER_QUIZ.length) * 100);

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-6">
        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-muted">
            <span>ข้อ {step + 1} จาก {CAREER_QUIZ.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ground">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <fieldset className="flex flex-col gap-5">
          <legend
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-xl font-bold text-ink focus:outline-none sm:text-2xl"
          >
            {question.question}
          </legend>
          {question.helper && (
            <p id={helperId} className="text-sm text-muted">{question.helper}</p>
          )}

          <div className="flex flex-col gap-3" role="group" aria-describedby={question.helper ? helperId : undefined}>
            {question.options.map((opt) => (
              <label
                key={opt.id}
                className={`flex cursor-pointer items-start gap-4 rounded-card border p-4 transition-all duration-150 hover:border-brand hover:bg-brand-light/30 ${
                  chosen === opt.id
                    ? 'border-brand bg-brand-light/40 shadow-lift'
                    : 'border-line bg-surface'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt.id}
                  checked={chosen === opt.id}
                  onChange={() => select(opt.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium text-ink">{opt.label}</span>
                  {opt.hint && <span className="text-sm text-muted">{opt.hint}</span>}
                </span>
              </label>
            ))}
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-alert">{error}</p>
          )}
        </fieldset>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={prev}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-line px-4 text-sm text-muted transition-colors hover:border-brand hover:text-brand-deep"
            >
              ย้อนกลับ
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="ml-auto inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand px-6 font-medium text-white transition-colors hover:bg-brand-deep"
          >
            {step + 1 < CAREER_QUIZ.length ? 'ถัดไป' : 'ดูผลลัพธ์'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Calculating ─────────────────────────────────────────────────────
  if (state === 'calculating') {
    return (
      <div className="flex flex-col items-center gap-8 py-16 text-center">
        <div className="flex h-16 items-end gap-1" aria-hidden>
          {[40, 60, 80, 60, 40].map((h, i) => (
            <div
              key={i}
              className="anim-equalize w-3 rounded-sm bg-brand"
              style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-display text-lg font-semibold text-ink">กำลังวิเคราะห์ความสนใจของคุณ…</p>
          <p className="text-sm text-muted">ระบบกำลังเปรียบเทียบกับ {careers.length} อาชีพ</p>
        </div>
        <div className="w-full max-w-xs overflow-hidden rounded-full bg-ground">
          <div className="anim-fillbar h-2 rounded-full bg-brand" />
        </div>
      </div>
    );
  }

  // ─── Results ─────────────────────────────────────────────────────────
  // รวม related projects จากทุก career ที่แนะนำ (deduplicate)
  const allRelatedTags = new Set(matches.flatMap((m) => m.career.related_project_tags));
  const relatedProjects = projects
    .filter((p) => p.tags?.some((t) => allRelatedTags.has(t)))
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      {/* ─── Header ─── */}
      <header className="grid-paper rounded-card border border-line bg-surface px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand-deep">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
            ผลการค้นหา
          </span>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            อาชีพที่น่าสนใจสำหรับคุณ
          </h1>
          <p className="max-w-prose text-muted">
            ผลลัพธ์นี้เกิดจากความสนใจและบุคลิกที่คุณตอบไว้ ไม่ใช่การกำหนดอนาคต
            ใช้เป็นแรงบันดาลใจในการสำรวจเพิ่มเติมได้เลย
          </p>

          {topDimsList.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-ink">ความสนใจหลักของคุณ</p>
              <div className="flex flex-wrap gap-2">
                {topDimsList.map((d) => (
                  <span key={d} className="rounded-full border border-brand/30 bg-brand-light px-3 py-1 text-sm font-medium text-brand-deep">
                    {DIM_LABELS[d]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ─── Career cards ─── */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-bold text-ink">อาชีพที่คุณอาจสนใจ</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {matches.map((m) => (
            <CareerCard key={m.career.id} match={m} />
          ))}
        </div>
      </section>

      {/* ─── Related projects ─── */}
      {relatedProjects.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-ink">โครงงานที่เกี่ยวข้องกับความสนใจของคุณ</h2>
            <Link href="/projects" className="text-sm font-medium text-brand-deep hover:underline">
              ดูคลังทั้งหมด
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Footer actions ─── */}
      <section className="flex flex-col items-center gap-4 rounded-card border border-line bg-surface p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display font-semibold text-ink">ต้องการลองใหม่?</p>
          <p className="text-sm text-muted">คำตอบที่ต่างออกไปอาจเปิดอาชีพใหม่ที่ไม่เคยนึกถึง</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setStep(0);
            setMatches([]);
            setTopDimsList([]);
            setState('start');
          }}
          className="inline-flex min-h-[44px] shrink-0 items-center rounded-lg border border-line px-5 text-sm font-medium text-brand-deep transition-colors hover:border-brand hover:bg-brand-light"
        >
          ทำแบบทดสอบใหม่
        </button>
      </section>
    </div>
  );
}
