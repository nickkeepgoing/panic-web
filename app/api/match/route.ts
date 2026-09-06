import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/data';
import { scoreQuiz, type QuizAnswers } from '@/lib/quiz';
import { rankProjects } from '@/lib/match';
import { writeReasons } from '@/lib/llm';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const answers = body?.answers as QuizAnswers | undefined;
  if (!answers) return NextResponse.json({ error: 'bad-request' }, { status: 400 });

  // คิดคะแนนใหม่ฝั่งเซิร์ฟเวอร์เสมอ ไม่เชื่อโปรไฟล์ที่ client ส่งมา
  const profile = scoreQuiz(answers);
  const projects = await getProjects();
  const ranked = rankProjects(profile, projects, 5);
  const withReasons = await writeReasons(profile, ranked);

  return NextResponse.json({
    profile,
    matches: withReasons.map((m) => ({
      id: m.project.id,
      slug: m.project.slug,
      title: m.project.title,
      summary: m.project.summary,
      reason: m.reason,
    })),
  });
}
