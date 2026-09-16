-- migration 005: site settings for footer content
-- admin แก้ได้ผ่าน /admin/settings

create table if not exists site_settings (
  key        text primary key,
  label      text not null,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

create policy "public read site settings"
  on site_settings for select using (true);

create policy "admin write site settings"
  on site_settings for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('editor','super_admin')
    )
  );

-- default values
insert into site_settings (key, label, value) values
  ('footer_tagline',    'คำอธิบายเว็บไซต์ (Footer)',
   'โครงงานทุกเรื่องที่นี่เป็นไอเดียตั้งต้น ไม่ใช่ผลงานสำเร็จรูป ทุกหน้าจึงมีหัวข้อ "จุดที่ควรต่อยอดให้เป็นของตัวเอง" เพราะสิ่งที่กรรมการให้คะแนนคือส่วนที่คุณคิดเพิ่ม'),
  ('footer_author',     'ผู้พัฒนา/ผู้จัดทำ',     ''),
  ('footer_school',     'โรงเรียน/สถาบัน',        ''),
  ('footer_powered_by', 'Powered by',             'Next.js · Supabase · Vercel')
on conflict (key) do nothing;
