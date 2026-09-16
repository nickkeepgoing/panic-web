'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { serverClient, isAdmin } from '@/lib/supabase/server';
import { TAG_COMPETITIONS, TAG_PROJECTS } from '@/lib/cache';
import { parsePrice } from '@/lib/types';

/**
 * ล้างแคชหลังเขียนข้อมูล
 *
 * ต้องทำสองชั้นเสมอ ไม่งั้นหน้า public จะยังโชว์ของเดิม
 *  - revalidateTag: ล้าง Data Cache ของผลลัพธ์ fetch ที่หน้า public ใช้อ่าน
 *  - revalidatePath: ล้างหน้าที่ render ค้างไว้ (หน้าแรก/ปฏิทิน/คลังโครงงาน เป็น ISR 60 วิ)
 */
function revalidateProjectViews() {
  revalidateTag(TAG_PROJECTS);
  revalidatePath('/admin/projects');
  revalidatePath('/admin/queue');
  revalidatePath('/projects');
  revalidatePath('/');
}

function revalidateCompetitionViews() {
  revalidateTag(TAG_COMPETITIONS);
  revalidatePath('/admin/competitions');
  revalidatePath('/calendar');
  revalidatePath('/');
}

function slugify(input: string) {
  return input
    .normalize('NFC') // อักษรไทยต้อง normalize ก่อน ไม่งั้น slug ที่เก็บจะเปิดไม่ได้เมื่อ client normalize URL
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `p-${Date.now()}`;
}

function parseSteps(raw: string) {
  return raw
    .split('\n').map((l) => l.trim()).filter(Boolean)
    .map((line, i) => ({ step: i + 1, title: line.split(' — ')[0] ?? line, detail: line.split(' — ')[1] ?? '' }));
}

function parseMaterials(raw: string) {
  return raw
    .split('\n').map((l) => l.trim()).filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((p) => p.trim());
      // ห้ามใช้ Number() ตรง ๆ — ถ้าแอดมินพิมพ์ "120 บาท" จะได้ NaN
      // ซึ่งตอนเขียนลง jsonb จะกลายเป็น null แล้วหน้าโครงงานจะพังทั้งหน้า
      return { name: parts[0] ?? '', qty: parts[1] ?? '', est_price: parsePrice(parts[2]) };
    });
}

export async function createProject(formData: FormData) {
  if (!(await isAdmin())) throw new Error('ไม่มีสิทธิ์');
  const sb = serverClient();

  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('ต้องมีชื่อโครงงาน');

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
    cover_url: String(formData.get('cover_url') ?? '') || null,
    steps: parseSteps(String(formData.get('steps') ?? '')),
    materials: parseMaterials(String(formData.get('materials') ?? '')),
    status: formData.get('publish') ? 'published' : 'draft',
    published_at: formData.get('publish') ? new Date().toISOString() : null,
  });
  if (error) throw new Error(error.message);

  revalidateProjectViews();
  redirect('/admin/projects');
}

export async function updateProject(formData: FormData) {
  if (!(await isAdmin())) throw new Error('ไม่มีสิทธิ์');
  const sb = serverClient();
  const id = String(formData.get('id'));

  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('ต้องมีชื่อโครงงาน');

  const { error } = await sb.from('projects').update({
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
    cover_url: String(formData.get('cover_url') ?? '') || null,
    steps: parseSteps(String(formData.get('steps') ?? '')),
    materials: parseMaterials(String(formData.get('materials') ?? '')),
    status: formData.get('publish') ? 'published' : 'draft',
    published_at: formData.get('publish') ? new Date().toISOString() : undefined,
  }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidateProjectViews();
  revalidatePath(`/projects/${id}`);
  redirect('/admin/projects');
}

export async function setProjectStatus(formData: FormData) {
  if (!(await isAdmin())) throw new Error('ไม่มีสิทธิ์');
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));

  await serverClient().from('projects').update({
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
    reviewed_at: new Date().toISOString(),
  }).eq('id', id);

  revalidateProjectViews();
}

export type CompetitionFormState = { ok: boolean; message: string };

/** หมุดปฏิทินของประกาศหนึ่งใบ — ใช้ร่วมกันทั้งตอนเพิ่มและตอนแก้ไข */
function calendarPins(competitionId: string, openAt: string | null, closeAt: string, eventAt: string | null) {
  return [
    openAt && { competition_id: competitionId, kind: 'open', event_date: openAt },
    { competition_id: competitionId, kind: 'close', event_date: closeAt },
    eventAt && { competition_id: competitionId, kind: 'compete', event_date: eventAt },
  ].filter(Boolean);
}

/** ฟิลด์ที่ฟอร์มเพิ่มและฟอร์มแก้ไขส่งมาเหมือนกัน */
function readCompetitionForm(formData: FormData) {
  return {
    name: String(formData.get('name') ?? '').trim(),
    organizer: String(formData.get('organizer') ?? ''),
    source_url: String(formData.get('source_url') ?? ''),
    cover_url: String(formData.get('cover_url') ?? '') || null,
    open_at: String(formData.get('open_at') ?? '') || null,
    close_at: String(formData.get('close_at') ?? ''),
    event_at: String(formData.get('event_at') ?? '') || null,
  };
}

/**
 * แปลง error จาก Supabase เป็นข้อความที่แอดมินอ่านแล้วแก้ต่อได้
 * 42501 เกิดบ่อยสุด — ตารางเปิด RLS ไว้แต่ไม่มี policy ฝั่งเขียน
 */
function describeWriteError(error: { code?: string; message: string }) {
  if (error.code === '42501') {
    return 'ฐานข้อมูลปฏิเสธการบันทึก (RLS) — ยังไม่มี policy ฝั่งเขียนของตาราง competitions ' +
      'ให้รัน db/migrations/001-competitions-write-policy.sql ใน Supabase SQL Editor หนึ่งครั้ง';
  }
  if (error.code === '23505') return 'มีประกาศชื่อนี้อยู่แล้ว ลองเปลี่ยนชื่อให้ต่างจากเดิม';
  if (error.code === '23502') return 'ข้อมูลไม่ครบตามที่ฐานข้อมูลกำหนด: ' + error.message;
  return 'บันทึกไม่สำเร็จ: ' + error.message;
}

export async function createCompetition(
  _prev: CompetitionFormState,
  formData: FormData,
): Promise<CompetitionFormState> {
  if (!(await isAdmin())) return { ok: false, message: 'ไม่มีสิทธิ์เพิ่มประกาศ — ต้องเป็น editor หรือ super admin' };

  const fields = readCompetitionForm(formData);
  if (!fields.name || !fields.close_at) return { ok: false, message: 'ต้องมีชื่อกิจกรรมและวันปิดรับ' };

  const sb = serverClient();
  const { data, error } = await sb.from('competitions').insert({
    slug: slugify(fields.name),
    ...fields,
    status: 'published',
  }).select('id').single();

  if (error) return { ok: false, message: describeWriteError(error) };
  if (!data) return { ok: false, message: 'บันทึกแล้วแต่ฐานข้อมูลไม่ส่ง id กลับมา ลองโหลดหน้านี้ใหม่เพื่อตรวจสอบ' };

  // ประกาศบันทึกไปแล้ว หมุดปฏิทินพลาดไม่ควรทำให้ทั้งฟอร์มล้ม แค่บอกให้รู้
  const { error: eventsError } = await sb
    .from('competition_events')
    .insert(calendarPins(data.id, fields.open_at, fields.close_at, fields.event_at) as never);

  revalidateCompetitionViews();

  return {
    ok: true,
    message: eventsError
      ? `บันทึก "${fields.name}" แล้ว แต่ลงหมุดปฏิทินไม่สำเร็จ: ${eventsError.message}`
      : `บันทึกและเผยแพร่ "${fields.name}" แล้ว`,
  };
}

export async function updateCompetition(
  _prev: CompetitionFormState,
  formData: FormData,
): Promise<CompetitionFormState> {
  if (!(await isAdmin())) return { ok: false, message: 'ไม่มีสิทธิ์แก้ไขประกาศ — ต้องเป็น editor หรือ super admin' };

  const id = String(formData.get('id') ?? '');
  if (!id) return { ok: false, message: 'ไม่รู้ว่าจะแก้ประกาศไหน ลองกลับไปกดแก้ไขจากรายการอีกครั้ง' };

  const fields = readCompetitionForm(formData);
  if (!fields.name || !fields.close_at) return { ok: false, message: 'ต้องมีชื่อกิจกรรมและวันปิดรับ' };

  const status = String(formData.get('status') ?? 'published');
  const sb = serverClient();

  // ไม่แตะ slug ตอนแก้ไข — เปลี่ยนชื่อแล้ว slug เปลี่ยนตาม จะชน unique กับใบเก่าได้
  const { data, error } = await sb
    .from('competitions')
    .update({ ...fields, status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) return { ok: false, message: describeWriteError(error) };
  // ไม่ error แต่ไม่มีแถวกลับมา = ประกาศถูกลบไปแล้ว หรือ RLS ไม่ให้แก้ (ปฏิเสธเงียบ ไม่ใช่ 42501)
  if (!data) return { ok: false, message: 'แก้ไขไม่สำเร็จ — ไม่พบประกาศนี้ (อาจถูกลบไปแล้ว) หรือฐานข้อมูลไม่อนุญาตให้แก้ไข' };

  // วันที่อาจถูกแก้หรือลบออก ล้างหมุดเก่าทิ้งแล้วลงใหม่ทั้งชุดง่ายกว่าไล่เทียบทีละหมุด
  const { error: clearError } = await sb.from('competition_events').delete().eq('competition_id', id);
  const { error: eventsError } = clearError
    ? { error: clearError }
    : await sb
        .from('competition_events')
        .insert(calendarPins(id, fields.open_at, fields.close_at, fields.event_at) as never);

  revalidateCompetitionViews();

  return {
    ok: true,
    message: eventsError
      ? `บันทึกการแก้ไขแล้ว แต่ปรับหมุดปฏิทินไม่สำเร็จ: ${eventsError.message}`
      : `บันทึกการแก้ไข "${fields.name}" แล้ว`,
  };
}

export async function deleteCompetition(
  _prev: CompetitionFormState,
  formData: FormData,
): Promise<CompetitionFormState> {
  if (!(await isAdmin())) return { ok: false, message: 'ไม่มีสิทธิ์ลบประกาศ — ต้องเป็น editor หรือ super admin' };

  const id = String(formData.get('id') ?? '');
  if (!id) return { ok: false, message: 'ไม่รู้ว่าจะลบประกาศไหน ลองโหลดหน้านี้ใหม่' };

  // หมุดปฏิทินและรายการติดตามผูกไว้แบบ on delete cascade อยู่แล้ว ลบใบเดียวพอ
  // ต้อง select กลับมาด้วย เพราะ RLS ที่ไม่ให้ลบจะคืน "ลบ 0 แถว" เฉย ๆ ไม่ใช่ error
  const { data, error } = await serverClient().from('competitions').delete().eq('id', id).select('id');
  if (error) return { ok: false, message: describeWriteError(error) };
  if (!data || data.length === 0) {
    return { ok: false, message: 'ลบไม่สำเร็จ — ไม่พบประกาศนี้ (อาจถูกลบไปแล้ว) หรือฐานข้อมูลไม่อนุญาตให้ลบ' };
  }

  revalidateCompetitionViews();
  return { ok: true, message: 'ลบประกาศแล้ว' };
}
