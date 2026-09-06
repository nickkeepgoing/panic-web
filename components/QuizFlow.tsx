'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { QUIZ, scoreQuiz, type QuizAnswers, type QuizProfile } from '@/lib/quiz';
import { rankProjects } from '@/lib/match';
import type { Project } from '@/lib/types';

type Result = { id: string; slug: string; title: string; summary: string; reason: string };

export function QuizFlow({ projects }: { projects: Project[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const question = QUIZ[step];
  const progress = Math.round(((step + (done ? 1 : 0)) / QUIZ.length) * 100);

  function choose(optionId: string) {
    setAnswers((a) => ({ ...a, [question.id]: optionId }));
    setError('');
    if (step + 1 < QUIZ.length) setStep(step + 1);
    else setDone(true);
  }

  function next() {
    if (!answers[question.id]) {
      setError('เลือกคำตอบก่อนหนึ่งข้อ');
      return;
    }
    if (step + 1 < QUIZ.length) setStep(step + 1);
    else setDone(true);
  }

  if (done) {
    return (
      <QuizResult
        answers={answers}
        projects={projects}
        onRestart={() => { setAnswers({}); setStep(0); setDone(false); }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between text-sm text-muted">
          <span>ข้อ {step + 1} จาก {QUIZ.length}</span>
          <span>{question.kind === 'filter' ? 'ข้อนี้ใช้กรองผลลัพธ์' : 'ข้อนี้วัดความสนใจ'}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-light">
          <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold text-ink">{question.question}</h1>
        {question.helper && <p className="text-sm text-muted">{question.helper}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((o) => {
          const selected = answers[question.id] === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              className={`rounded-card border p-4 text-left ${
                selected ? 'border-brand bg-brand-light' : 'border-line bg-surface hover:border-brand'
              }`}
            >
              <span className="text-ink">{o.label}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-alert">{error}</p>}

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-lg border border-line px-4 py-2 text-sm text-muted hover:border-brand"
          >
            ย้อนกลับ
          </button>
        )}
        <button
          type="button"
          onClick={next}
          className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-deep"
        >
          {step + 1 === QUIZ.length ? 'ดูผลลัพธ์' : 'ข้อถัดไป'}
        </button>
      </div>
    </div>
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
  const localProfile = useMemo(() => scoreQuiz(answers), [answers]);
  const localMatches = useMemo(
    () =>
      rankProjects(localProfile, projects, 5).map((m) => ({
        id: m.project.id,
        slug: m.project.slug,
        title: m.project.title,
        summary: m.project.summary,
        reason: m.reason,
      })),
    [localProfile, projects],
  );

  const [profile, setProfile] = useState<QuizProfile>(localProfile);
  const [matches, setMatches] = useState<Result[]>(localMatches);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ answers }),
        });
        if (!res.ok) throw new Error('match failed');
        const data = await res.json();
        if (!alive) return;
        setProfile(data.profile);
        setMatches(data.matches);
      } catch {
        // เซิร์ฟเวอร์ล่มก็ยังเห็นผลลัพธ์ที่คำนวณในเครื่อง
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [answers]);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">โปรไฟล์ความสนใจของคุณ</h1>
        <ul className="flex flex-col gap-3">
          {profile.tags.map((t) => (
            <li key={t.slug} className="flex items-center gap-4">
              <span className="w-40 shrink-0 text-sm text-ink">{t.label}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-brand-light">
                <span className="block h-full rounded-full bg-brand" style={{ width: `${t.score}%` }} />
              </span>
              <span className="w-12 text-right text-sm text-muted">{t.score}%</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          กรองด้วย: งบไม่เกิน {profile.budgetMax === 99999 ? 'ไม่จำกัด' : `${profile.budgetMax.toLocaleString('th-TH')} บาท`}
          {' · '}เวลาไม่เกิน {profile.weeksMax === 99 ? 'ไม่จำกัด' : `${profile.weeksMax} สัปดาห์`}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl font-medium text-ink">โครงงานที่เหมาะกับคุณ</h2>
          {loading && <span className="text-sm text-muted">กำลังเขียนเหตุผลให้แต่ละข้อ…</span>}
        </div>

        {matches.length === 0 ? (
          <div className="rounded-card border border-line bg-surface p-6">
            <p className="text-ink">ยังไม่มีโครงงานที่ผ่านเงื่อนไขงบและเวลาที่ตอบไว้</p>
            <p className="mt-1 text-sm text-muted">
              ลองทำแบบทดสอบใหม่แล้วขยับงบหรือเวลาขึ้นอีกนิด หรือไล่ดูคลังทั้งหมดเองก็ได้
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-4">
            {matches.map((m) => (
              <li key={m.id} className="rounded-card border border-line bg-surface p-5">
                <Link
                  href={`/projects/${m.slug}`}
                  className="font-display text-lg font-medium text-ink hover:text-brand-deep"
                >
                  {m.title}
                </Link>
                <p className="mt-1 text-sm text-muted">{m.summary}</p>
                <p className="mt-3 rounded-lg bg-brand-light/50 px-3 py-2 text-sm text-brand-deep">
                  ทำไมเหมาะกับคุณ: {m.reason}
                </p>
              </li>
            ))}
          </ol>
        )}

        <div className="flex gap-3">
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
      </section>
    </div>
  );
}
