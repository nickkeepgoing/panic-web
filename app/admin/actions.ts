'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { serverClient, isAdmin } from '@/lib/supabase/server';

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `p-${Date.now()}`;
}

export async function createProject(formData: FormData) {
  if (!(await isAdmin())) throw new Error('ไม่มีสิทธิ์');
  const sb = await serverClient();

  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('ต้องมีชื่อโครงงาน');

  const steps = String(formData.get('steps') ?? '')
    .split('\n').map((l) => l.trim()).filter(Boolean)
    .map((line, i) => ({ step: i + 1, title: line.split(' — ')[0] ?? line, detail: line.split(' — ')[1] ?? '' }));

  const { error } = await sb.from('projects').insert({
    slug: slugify(title),
    title,
    summary: String(formData.get('summary') ?? ''),
    category_id: Number(formData.get('category_id')),
    difficulty: String(formData.get('difficulty') ?? 'easy'),
    budget_min: Number(formData.get('budget_min') ?? 0),
    budget_max: Number(formData.get('budget_max') ?? 0),
    duration_weeks: Number(formData.get('duration_weeks') ?? 1),
    grade_min: Number(formData.get('grade_min') ?? 7),
    grade_max: Number(formData.get('grade_max') ?? 12),
    purpose_md: String(formData.get('purpose_md') ?? ''),
    difficulty_md: String(formData.get('difficulty_md') ?? ''),
    extension_md: String(formData.get('extension_md') ?? ''),
    steps,
    status: formData.get('publish') ? 'published' : 'draft',
    published_at: formData.get('publish') ? new Date().toISOString() : null,
  });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  redirect('/admin/projects');
}

export async function setProjectStatus(formData: FormData) {
  if (!(await isAdmin())) throw new Error('ไม่มีสิทธิ์');
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));

  await (await serverClient()).from('projects').update({
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
    reviewed_at: new Date().toISOString(),
  }).eq('id', id);

  revalidatePath('/admin/queue');
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
}

export async function createCompetition(formData: FormData) {
  if (!(await isAdmin())) throw new Error('ไม่มีสิทธิ์');
  const name = String(formData.get('name') ?? '').trim();
  const closeAt = String(formData.get('close_at') ?? '');
  if (!name || !closeAt) throw new Error('ต้องมีชื่อกิจกรรมและวันปิดรับ');

  const sb = await serverClient();
  const { data, error } = await sb.from('competitions').insert({
    slug: slugify(name),
    name,
    organizer: String(formData.get('organizer') ?? ''),
    source_url: String(formData.get('source_url') ?? ''),
    open_at: String(formData.get('open_at') ?? '') || null,
    close_at: closeAt,
    event_at: String(formData.get('event_at') ?? '') || null,
    status: 'published',
  }).select('id').single();
  if (error) throw new Error(error.message);

  // ลงหมุดปฏิทินให้อัตโนมัติ จะได้ไม่ต้องกรอกซ้ำสองที่
  const events = [
    formData.get('open_at') && { competition_id: data.id, kind: 'open', event_date: String(formData.get('open_at')) },
    { competition_id: data.id, kind: 'close', event_date: closeAt },
    formData.get('event_at') && { competition_id: data.id, kind: 'compete', event_date: String(formData.get('event_at')) },
  ].filter(Boolean);
  await sb.from('competition_events').insert(events as never);

  revalidatePath('/admin/competitions');
  revalidatePath('/calendar');
  redirect('/admin/competitions');
}
