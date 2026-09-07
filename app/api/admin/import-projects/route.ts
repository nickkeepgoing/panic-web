import { NextResponse } from 'next/server';
import { serverClient, isAdmin } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/config';
import { csvToObjects } from '@/lib/csv';
import { parseImportRow, isRowIssue, resetSlugTracking, type RowIssue } from '@/lib/import-projects';

export const runtime = 'nodejs';

const MAX_ROWS = 500;
const REQUIRED_COLUMNS = ['title', 'category', 'purpose_md', 'extension_md'];

export async function POST(request: Request) {
  if (!hasSupabase) return NextResponse.json({ error: 'ยังไม่ได้ต่อ Supabase' }, { status: 503 });
  if (!(await isAdmin())) return NextResponse.json({ error: 'ไม่มีสิทธิ์' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const csvText = body?.csv_text as string | undefined;
  if (!csvText?.trim()) return NextResponse.json({ error: 'ไม่มีข้อมูล CSV ส่งมา' }, { status: 400 });

  const { header, records } = csvToObjects(csvText);
  const missingColumns = REQUIRED_COLUMNS.filter((c) => !header.includes(c));
  if (missingColumns.length > 0) {
    return NextResponse.json({
      error: `หัวตารางขาดคอลัมน์ที่จำเป็น: ${missingColumns.join(', ')} — ดาวน์โหลดแม่แบบแล้วเทียบหัวตารางอีกครั้ง`,
    }, { status: 400 });
  }
  if (records.length === 0) return NextResponse.json({ error: 'ไม่มีข้อมูลแถวไหนให้นำเข้าเลย' }, { status: 400 });
  if (records.length > MAX_ROWS) {
    return NextResponse.json({ error: `นำเข้าได้ครั้งละไม่เกิน ${MAX_ROWS} แถว ไฟล์นี้มี ${records.length} แถว — แบ่งเป็นหลายไฟล์แล้วลองใหม่` }, { status: 400 });
  }

  const sb = serverClient();
  resetSlugTracking();

  const [{ data: categories }, { data: tags }] = await Promise.all([
    sb.from('categories').select('id, slug, name_th'),
    sb.from('tags').select('id, slug'),
  ]);
  const categoryById = new Map<number, { id: number }>();
  const categoryByKey = new Map<string, number>();
  for (const c of categories ?? []) {
    categoryByKey.set(c.slug.toLowerCase(), c.id);
    categoryByKey.set(c.name_th.trim(), c.id);
    categoryById.set(c.id, c);
  }
  const tagIdBySlug = new Map<string, number>((tags ?? []).map((t) => [t.slug, t.id]));

  const failed: RowIssue[] = [];
  const warnings: RowIssue[] = [];
  const readyRows: { rowNumber: number; categoryId: number; tags: string[]; tagsProvided: boolean; payload: Record<string, unknown> }[] = [];

  records.forEach((raw, i) => {
    const rowNumber = i + 2; // +1 หัวตาราง +1 นับจาก 1
    const parsed = parseImportRow(raw, rowNumber);
    if (isRowIssue(parsed)) { failed.push(parsed); return; }

    const categoryId = categoryByKey.get(parsed.data.category_input.toLowerCase())
      ?? categoryByKey.get(parsed.data.category_input);
    if (!categoryId) {
      failed.push({
        row: rowNumber, field: 'category',
        message: `ไม่รู้จักหมวดหมู่ "${parsed.data.category_input}" — ใช้ชื่อหมวดภาษาไทยที่มีอยู่แล้ว หรือ slug เช่น environment`,
      });
      return;
    }

    warnings.push(...parsed.warnings);
    const { data } = parsed;
    readyRows.push({
      rowNumber,
      categoryId,
      tags: data.tags,
      tagsProvided: data.tags_provided,
      payload: {
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        category_id: categoryId,
        difficulty: data.difficulty,
        budget_min: data.budget_min,
        budget_max: data.budget_max,
        duration_weeks: data.duration_weeks,
        grade_min: data.grade_min,
        grade_max: data.grade_max,
        purpose_md: data.purpose_md,
        difficulty_md: data.difficulty_md,
        extension_md: data.extension_md,
        cover_url: data.cover_url,
        steps: data.steps,
        materials: data.materials,
        status: 'published',
        published_at: new Date().toISOString(),
      },
    });
  });

  if (readyRows.length === 0) {
    return NextResponse.json({ total: records.length, inserted: 0, updated: 0, failed, warnings, rows: [] });
  }

  // เช็กว่า slug ไหนมีอยู่แล้ว เพื่อรายงานว่าแถวนี้เป็นการเพิ่มใหม่หรือแก้ของเดิม
  const slugs = readyRows.map((r) => r.payload.slug as string);
  const { data: existing } = await sb.from('projects').select('slug').in('slug', slugs);
  const existingSlugs = new Set((existing ?? []).map((e) => e.slug));

  const { data: upserted, error: upsertError } = await sb
    .from('projects')
    .upsert(readyRows.map((r) => r.payload), { onConflict: 'slug' })
    .select('id, slug');

  if (upsertError) {
    return NextResponse.json({ error: `บันทึกลงฐานข้อมูลไม่สำเร็จ: ${upsertError.message}` }, { status: 500 });
  }

  const idBySlug = new Map((upserted ?? []).map((p) => [p.slug, p.id as string]));

  // แท็ก: แตะเฉพาะแถวที่ระบุคอลัมน์ tags มา ไม่งั้นการอัปเดตแถวเดิมจะไปลบแท็กที่เคยตั้งไว้ทิ้งโดยไม่ตั้งใจ
  const rowsWithTags = readyRows.filter((r) => r.tagsProvided);
  if (rowsWithTags.length > 0) {
    const projectIds = rowsWithTags.map((r) => idBySlug.get(r.payload.slug as string)).filter(Boolean) as string[];
    if (projectIds.length > 0) {
      await sb.from('project_tags').delete().in('project_id', projectIds);
      const pairs = rowsWithTags.flatMap((r) => {
        const projectId = idBySlug.get(r.payload.slug as string);
        if (!projectId) return [];
        return r.tags
          .map((slug) => tagIdBySlug.get(slug))
          .filter((id): id is number => Boolean(id))
          .map((tagId) => ({ project_id: projectId, tag_id: tagId }));
      });
      if (pairs.length > 0) await sb.from('project_tags').insert(pairs);
    }
  }

  const rows = readyRows.map((r) => ({
    row: r.rowNumber,
    slug: r.payload.slug as string,
    title: r.payload.title as string,
    status: existingSlugs.has(r.payload.slug as string) ? ('updated' as const) : ('inserted' as const),
  }));

  return NextResponse.json({
    total: records.length,
    inserted: rows.filter((r) => r.status === 'inserted').length,
    updated: rows.filter((r) => r.status === 'updated').length,
    failed,
    warnings,
    rows,
  });
}
