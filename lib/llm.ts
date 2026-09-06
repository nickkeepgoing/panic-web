import type { Match } from './match';
import { TAG_LABELS } from './quiz';
import type { QuizProfile } from './quiz';

/**
 * ชั้นที่ 3 ของระบบแนะนำ — ให้ LLM เขียน "ทำไมเหมาะกับคุณ"
 * รองรับ 2 ผู้ให้บริการ ตั้งอันไหนไว้ก็ใช้อันนั้น ไม่ตั้งเลยก็ใช้ข้อความสำเร็จรูป
 *   GEMINI_API_KEY   — Gemini (ตั้ง GEMINI_MODEL เพื่อเปลี่ยนรุ่นได้)
 *   TYPHOON_API_KEY  — Typhoon ของ SCB 10X ภาษาไทยดีเป็นพิเศษ
 */
export async function writeReasons(profile: QuizProfile, matches: Match[]): Promise<Match[]> {
  const gemini = process.env.GEMINI_API_KEY;
  const typhoon = process.env.TYPHOON_API_KEY;
  if (!gemini && !typhoon) return matches;

  const interests = profile.tags.map((t) => `${TAG_LABELS[t.slug]} ${t.score}%`).join(', ');
  const list = matches
    .map((m, i) => `${i + 1}. ${m.project.title} — ${m.project.summary} (ใช้เวลา ${m.project.duration_weeks} สัปดาห์)`)
    .join('\n');

  const prompt = `คุณเป็นครูที่ปรึกษาโครงงานวิทยาศาสตร์ในโรงเรียนไทย
โปรไฟล์ความสนใจของนักเรียน: ${interests}
งบที่ใช้ได้: ${profile.budgetMax} บาท เวลาที่มี: ${profile.weeksMax} สัปดาห์

โครงงานที่ระบบคัดมาให้:
${list}

เขียนเหตุผลว่า "ทำไมเหมาะกับคุณ" ให้แต่ละโครงงาน ข้อละ 1 ประโยค ไม่เกิน 30 คำ
พูดกับนักเรียนโดยตรง อ้างอิงความสนใจที่เขาตอบจริง ห้ามชมเกินจริง ห้ามขึ้นต้นว่า "โครงงานนี้"
ตอบเป็น JSON array ของ string เท่านั้น ไม่ต้องมีคำอธิบายอื่นและไม่ต้องใส่ markdown`;

  try {
    const text = gemini ? await callGemini(prompt, gemini) : await callTyphoon(prompt, typhoon!);
    const cleaned = text.replace(/```json|```/g, '').trim();
    const reasons = JSON.parse(cleaned) as string[];
    if (!Array.isArray(reasons)) return matches;
    return matches.map((m, i) => (typeof reasons[i] === 'string' ? { ...m, reason: reasons[i] } : m));
  } catch {
    // LLM ล่มหรือคืนค่าเพี้ยน ก็ยังต้องมีผลลัพธ์ให้ผู้ใช้เสมอ
    return matches;
  }
}

async function callGemini(prompt: string, key: string) {
  const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash-lite';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      cache: 'no-store',
    },
  );
  const json = await res.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callTyphoon(prompt: string, key: string) {
  const res = await fetch('https://api.opentyphoon.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.TYPHOON_MODEL ?? 'typhoon-v2.1-12b-instruct',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    }),
    cache: 'no-store',
  });
  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? '';
}
