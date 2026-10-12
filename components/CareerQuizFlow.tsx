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
  initialSessionId: string; // อ่านจาก cookie ฝั่ง server (อาจว่าง)
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Progress persistence (per-browser convenience — ล้มเหลวได้ เช่น private mode) ─
const PROGRESS_KEY = 'panic_career_progress';
type SavedProgress = { step: number; answers: CareerQuizAnswers };

function loadProgress(): SavedProgress | null {
  try {
    const p = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? 'null');
    if (p && typeof p.step === 'number' && p.step > 0 && p.step < CAREER_QUIZ.length && p.answers) return p;
  } catch {}
  return null;
}
function saveProgress(p: SavedProgress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}
function clearProgress() {
  try { localStorage.removeItem(PROGRESS_KEY); } catch {}
}

const AUTO_ADVANCE_MS = 280;
const SECONDS_PER_QUESTION = 8;

// ─── Main component ──────────────────────────────────────────────────────────
export function CareerQuizFlow({ careers, projects, initialSessionId }: Props) {
  const [state, setState] = useState<State>('start');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CareerQuizAnswers>({});
  const [resume, setResume] = useState<SavedProgress | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>();
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [topDimsList, setTopDimsList] = useState<DimSlug[]>([]);
  // session_id: อ่านจาก cookie ถ้ามีอยู่แล้ว ถ้าไม่มีสร้างใหม่แล้วเก็บใน cookie
  const [sessionId, setSessionId] = useState(initialSessionId);
  const headingRef = useRef<HTMLLegendElement>(null);
  const pageViewSent = useRef(false);
  const helperId = useId();
  // สลับลำดับตัวเลือกต่อ session — กันผู้ตอบจับ pattern ว่าตำแหน่งไหนเป็นสายไหน
  // (options แสดงหลังกดเริ่มเท่านั้น จึงไม่เกิด hydration mismatch)
  const [optionOrder] = useState(() =>
    CAREER_QUIZ.map((q) =>
      q.kind === 'filter' ? q.options : shuffle(q.options),
    ),
  );

  useEffect(() => {
    if (sessionId) return;
    const existing = document.cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith('panic_session_id='));
    if (existing) {
      setSessionId(existing.split('=')[1]);
    } else {
      const id = crypto.randomUUID();
      document.cookie = `panic_session_id=${id}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      setSessionId(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ยิง PAGE_VIEW ครั้งเดียวเมื่อมี session_id แล้ว (funnel step แรก)
  useEffect(() => {
    if (!sessionId || pageViewSent.current) return;
    pageViewSent.current = true;
    trackEvent(sessionId, 'PAGE_VIEW');
  }, [sessionId]);

  // ย้ายโฟกัสไปคำถามใหม่ทุกครั้ง (a11y — ตามแบบ QuizFlow)
  useEffect(() => {
    if (state === 'quiz') headingRef.current?.focus();
  }, [step, state]);

  // เปลี่ยนหน้า (start → quiz → results) ให้เริ่มที่ด้านบนเสมอ
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [state]);

  // มีความคืบหน้าค้างจากครั้งก่อนไหม
  useEffect(() => {
    setResume(loadProgress());
  }, []);

  useEffect(() => {
    if (state === 'quiz') saveProgress({ step, answers });
  }, [state, step, answers]);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // คีย์ลัด: 1–4 เลือกตัวเลือก
  useEffect(() => {
    if (state !== 'quiz') return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const opt = optionOrder[step][Number(e.key) - 1];
      if (opt) select(opt.id);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const isLast = step + 1 === CAREER_QUIZ.length;

  function start(from: SavedProgress | null) {
    trackEvent(sessionId, 'CAREER_TEST_START');
    if (!from) clearProgress();
    setAnswers(from?.answers ?? {});
    setStep(from?.step ?? 0);
    setResume(null);
    setState('quiz');
  }

  function goNext() {
    clearTimeout(advanceTimer.current);
    if (isLast) finish();
    else setStep((s) => Math.min(s + 1, CAREER_QUIZ.length - 1));
  }

  function select(optId: string) {
    const qid = CAREER_QUIZ[step].id;
    setAnswers((a) => ({ ...a, [qid]: optId }));
    // เลือกแล้วไปข้อถัดไปเอง (ข้อสุดท้ายรอให้กด "ดูผลลัพธ์")
    clearTimeout(advanceTimer.current);
    if (!isLast) {
      const from = step;
      advanceTimer.current = setTimeout(() => setStep((s) => (s === from ? s + 1 : s)), AUTO_ADVANCE_MS);
    }
  }

  function prev() {
    clearTimeout(advanceTimer.current);
    if (step > 0) setStep(step - 1);
  }

  function finish() {
    clearProgress();
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
      // results แสดงทันทีในหน้าเดียวกัน — ยิง RESULT_VIEW คู่กับ COMPLETE
      trackEvent(sessionId, 'CAREER_RESULT_VIEW');

      setState('results');
    }, 1500);
  }

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
          {resume ? (
            <>
              <button
                type="button"
                onClick={() => start(resume)}
                className="rounded-lg bg-brand px-10 py-3.5 font-display text-lg font-semibold text-white transition-colors duration-200 hover:bg-brand-deep"
              >
                ทำต่อจากข้อ {resume.step + 1}
              </button>
              <button
                type="button"
                onClick={() => start(null)}
                className="min-h-[44px] px-4 text-sm font-medium text-muted underline-offset-4 hover:text-brand-deep hover:underline"
              >
                เริ่มใหม่ตั้งแต่ข้อแรก
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => start(null)}
              className="rounded-lg bg-brand px-10 py-3.5 font-display text-lg font-semibold text-white transition-colors duration-200 hover:bg-brand-deep"
            >
              เริ่มค้นหาตัวเอง
            </button>
          )}
          <p className="text-sm text-muted">
            ใช้เวลาประมาณ {Math.ceil((CAREER_QUIZ.length * SECONDS_PER_QUESTION) / 60)} นาที · ไม่ต้องเข้าสู่ระบบ
          </p>
        </div>

        <ul className="grid w-full max-w-lg gap-2 text-left text-sm sm:grid-cols-3">
          {[
            ['ไม่มีคำตอบถูกหรือผิด', 'เลือกสิ่งที่คุณทำจริง ไม่ใช่สิ่งที่คิดว่าควรเป็น'],
            ['ข้ามได้', 'ข้อไหนไม่ตรงกับคุณเลย กดข้ามได้'],
            ['บันทึกอัตโนมัติ', 'ปิดหน้าไปแล้วกลับมาทำต่อได้'],
          ].map(([title, desc]) => (
            <li key={title} className="rounded-card border border-line bg-surface px-4 py-3">
              <p className="font-medium text-ink">{title}</p>
              <p className="text-muted">{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // ─── Quiz ────────────────────────────────────────────────────────────
  if (state === 'quiz') {
    const question = CAREER_QUIZ[step];
    const chosen = answers[question.id];
    const progress = Math.round(((step + 1) / CAREER_QUIZ.length) * 100);
    const cheer =
      progress >= 90 ? 'อีกนิดเดียว!' :
      progress >= 50 ? 'เกินครึ่งทางแล้ว' :
      progress >= 25 ? 'ไปได้สวย' :
      'ไม่มีคำตอบถูกหรือผิด';

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-6">
        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-muted">
            <span>ข้อ {step + 1} จาก {CAREER_QUIZ.length}</span>
            <span aria-live="polite">{cheer}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ground">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <fieldset key={step} className="anim-fadein flex flex-col gap-5">
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
            {optionOrder[step].map((opt, i) => {
              const isChosen = chosen === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`group flex min-h-[60px] cursor-pointer items-center gap-4 rounded-card border-2 px-4 py-3 transition-all duration-150 hover:border-brand has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2 active:scale-[0.99] ${
                    isChosen
                      ? 'border-brand bg-brand-light/50 shadow-lift'
                      : 'border-line bg-surface hover:bg-brand-light/30'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={opt.id}
                    checked={isChosen}
                    onChange={() => select(opt.id)}
                    onClick={() => isChosen && select(opt.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                      isChosen ? 'bg-brand text-white' : 'bg-ground text-muted group-hover:text-brand-deep'
                    }`}
                  >
                    {isChosen ? '✓' : i + 1}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-medium text-ink">{opt.label}</span>
                    {opt.hint && <span className="text-sm text-muted">{opt.hint}</span>}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="hidden text-xs text-muted sm:block">
            คลิกหรือกดเลข 1–{optionOrder[step].length} เพื่อเลือก{isLast ? '' : ' แล้วจะไปข้อถัดไปเอง'}
          </p>
        </fieldset>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={prev}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-line px-4 text-sm text-muted transition-colors hover:border-brand hover:text-brand-deep"
            >
              ← ย้อนกลับ
            </button>
          )}
          {chosen ? (
            <button
              type="button"
              onClick={goNext}
              className="ml-auto inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand px-6 font-medium text-white transition-colors hover:bg-brand-deep"
            >
              {isLast ? 'ดูผลลัพธ์' : 'ถัดไป →'}
            </button>
          ) : question.kind === 'interest' && (
            <button
              type="button"
              onClick={goNext}
              className="ml-auto inline-flex min-h-[44px] items-center rounded-lg px-4 text-sm font-medium text-muted transition-colors hover:bg-brand-light/40 hover:text-brand-deep"
            >
              {isLast ? 'ข้ามแล้วดูผลลัพธ์' : 'ไม่มีข้อไหนตรง — ข้าม'}
            </button>
          )}
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
          <div className="anim-fillbar h-2 rounded-full bg-brand" style={{ animationDuration: '1.5s' }} />
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
