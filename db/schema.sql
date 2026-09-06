-- =====================================================================
-- โครงงาน HUB / P.A.N.I.C. — Database schema (PostgreSQL 15+ / Supabase)
-- รันไฟล์นี้ใน Supabase SQL Editor หรือใช้เป็น migration แรกของโปรเจกต์
-- =====================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";     -- ค้นหาไทยแบบ substring (ไทยไม่มีช่องว่าง)
create extension if not exists "vector";      -- pgvector สำหรับ semantic search
create extension if not exists "pg_cron";     -- งานตามเวลา (แจ้งเตือนก่อนปิดรับ)

-- ---------------------------------------------------------------------
-- 0. ENUM
-- ---------------------------------------------------------------------
create type user_role      as enum ('student', 'editor', 'super_admin');
create type content_status as enum ('draft', 'pending', 'published', 'rejected', 'archived');
create type difficulty     as enum ('easy', 'medium', 'hard');
create type link_type      as enum ('youtube', 'document', 'github', 'reference');
create type tag_kind       as enum ('subject', 'skill', 'faculty', 'major', 'topic');
create type comp_event     as enum ('open', 'close', 'compete', 'announce');

-- ---------------------------------------------------------------------
-- 1. ผู้ใช้
-- auth.users เป็นของ Supabase Auth — ตารางนี้เก็บข้อมูลส่วนที่แอปใช้
-- ---------------------------------------------------------------------
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  role          user_role not null default 'student',
  grade_level   smallint check (grade_level between 4 and 12),  -- ป.4=4 … ม.6=12
  school_name   text,
  bio           text,
  avatar_url    text,
  created_at    timestamptz not null default now()
);
create index on profiles (role);

-- ---------------------------------------------------------------------
-- 2. Taxonomy — หมวดหมู่ + แท็ก (ห้ามให้แอดมินพิมพ์เองเป็น free text)
-- ---------------------------------------------------------------------
create table categories (
  id            serial primary key,
  slug          text unique not null,
  name_th       text not null,
  abbr_th       text,                       -- "วท" "ทค" ใช้บนไอคอนหน้าแรก
  color_hex     text,
  sort_order    smallint not null default 0,
  status        content_status not null default 'draft',
  created_at    timestamptz not null default now()
);

create table tags (
  id            serial primary key,
  slug          text unique not null,
  name_th       text not null,
  kind          tag_kind not null,
  created_at    timestamptz not null default now()
);
create index on tags (kind);

-- ---------------------------------------------------------------------
-- 3. โครงงาน
-- ---------------------------------------------------------------------
create table projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  summary         text not null,                       -- คำโปรยบนการ์ด
  category_id     int not null references categories(id),

  -- ฟิลด์ที่เป็นจุดแข็งของเว็บ ใช้กรองด้วย SQL ล้วน (AI ไม่ยุ่ง)
  difficulty      difficulty not null,
  budget_min      int not null default 0,              -- บาท
  budget_max      int not null default 0,
  duration_weeks  smallint not null,
  grade_min       smallint not null check (grade_min between 4 and 12),
  grade_max       smallint not null check (grade_max between 4 and 12),

  -- เนื้อหา 4 หัวข้อหลัก + กันข้อครหาเรื่องลอกโครงงาน
  purpose_md      text not null,                       -- เอาไว้ทำอะไร
  difficulty_md   text,                                -- ยากไหม / ต้องรู้อะไรมาก่อน
  steps           jsonb not null default '[]'::jsonb,  -- [{step, title, detail}]
  materials       jsonb not null default '[]'::jsonb,  -- [{name, qty, est_price}]
  extension_md    text not null,                       -- จุดที่ควรต่อยอดให้เป็นของตัวเอง
  cover_url       text,

  -- workflow
  status          content_status not null default 'draft',
  submitted_by    uuid references profiles(id) on delete set null,
  reviewed_by     uuid references profiles(id) on delete set null,
  reviewed_at     timestamptz,
  reject_reason   text,
  published_at    timestamptz,

  -- ค้นหา
  search_text     text,                 -- ตัดคำไทยด้วย PyThaiNLP แล้วเก็บคำคั่นช่องว่าง
  embedding       vector(768),          -- ว่างได้ตอนแรก แล้วให้ worker เติม
  embedding_at    timestamptz,

  view_count      int not null default 0,
  save_count      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  check (grade_max >= grade_min),
  check (budget_max >= budget_min)
);

create index on projects (status, published_at desc);
create index on projects (category_id, difficulty);
create index on projects (grade_min, grade_max);
create index on projects (budget_max);
create index projects_search_trgm on projects using gin (search_text gin_trgm_ops);
create index projects_embed_hnsw  on projects using hnsw (embedding vector_cosine_ops);

create table project_tags (
  project_id uuid references projects(id) on delete cascade,
  tag_id     int  references tags(id) on delete cascade,
  primary key (project_id, tag_id)
);
create index on project_tags (tag_id);

create table project_links (
  id         bigserial primary key,
  project_id uuid not null references projects(id) on delete cascade,
  url        text not null,
  label      text,
  kind       link_type not null default 'reference'
);
create index on project_links (project_id);

-- ไฟล์รูปเล่ม: default คือ "ลิงก์ไปต้นทาง" อัปโหลดได้เฉพาะเจ้าของผลงาน
create table project_documents (
  id             bigserial primary key,
  project_id     uuid not null references projects(id) on delete cascade,
  storage_path   text not null,               -- path ใน Supabase Storage
  file_name      text not null,
  mime_type      text,
  size_bytes     bigint,
  uploaded_by    uuid references profiles(id) on delete set null,
  owner_declared boolean not null default false,   -- ผู้อัปโหลดยืนยันว่าเป็นเจ้าของ
  approved_by    uuid references profiles(id) on delete set null,
  created_at     timestamptz not null default now()
);
create index on project_documents (project_id);

-- โครงงานที่คล้ายกัน (2 ทิศ — insert 2 แถวเสมอ หรือ query แบบ union)
create table related_projects (
  project_id uuid references projects(id) on delete cascade,
  related_id uuid references projects(id) on delete cascade,
  weight     smallint not null default 1,
  primary key (project_id, related_id),
  check (project_id <> related_id)
);

-- ---------------------------------------------------------------------
-- 4. บทความ (แยกจากโครงงานคนละตาราง)
-- ---------------------------------------------------------------------
create table articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  body_md      text not null,
  cover_url    text,
  category_id  int references categories(id),
  author_id    uuid references profiles(id) on delete set null,
  status       content_status not null default 'draft',
  publish_at   timestamptz,               -- ตั้งเวลาเผยแพร่
  published_at timestamptz,
  view_count   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index on articles (status, published_at desc);

-- ---------------------------------------------------------------------
-- 5. กิจกรรมแข่งขัน + ปฏิทิน
-- สถานะ (เปิดรับ/ใกล้ปิด/ปิดแล้ว) ไม่เก็บเป็นคอลัมน์ — คำนวณจากวันที่
-- ---------------------------------------------------------------------
create table competitions (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  organizer      text not null,
  description_md text,
  source_url     text not null,             -- ลิงก์ประกาศต้นทาง กันข้อมูลเน่า
  apply_url      text,
  open_at        date,
  close_at       date not null,
  event_at       date,
  announce_at    date,
  grade_min      smallint,
  grade_max      smallint,
  category_id    int references categories(id),
  status         content_status not null default 'draft',
  publish_at     timestamptz,
  created_by     uuid references profiles(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index on competitions (close_at);
create index on competitions (status, close_at);

create view v_competitions as
select c.*,
       (c.close_at - current_date) as days_left,
       case
         when current_date > c.close_at                       then 'closed'
         when c.open_at is not null and current_date < c.open_at then 'upcoming'
         when (c.close_at - current_date) <= 7                then 'closing_soon'
         else 'open'
       end as apply_status
from competitions c
where c.status = 'published';

-- ปฏิทิน: 1 กิจกรรมมีได้หลายหมุด (เปิดรับ/ปิดรับ/วันแข่ง/ประกาศผล)
create table competition_events (
  id             bigserial primary key,
  competition_id uuid not null references competitions(id) on delete cascade,
  kind           comp_event not null,
  event_date     date not null,
  note           text
);
create index on competition_events (event_date);

create table competition_projects (
  competition_id uuid references competitions(id) on delete cascade,
  project_id     uuid references projects(id) on delete cascade,
  primary key (competition_id, project_id)
);

-- ---------------------------------------------------------------------
-- 6. กิจกรรมของผู้ใช้
-- ---------------------------------------------------------------------
create table saved_projects (
  user_id          uuid references profiles(id) on delete cascade,
  project_id       uuid references projects(id) on delete cascade,
  progress_percent smallint not null default 0 check (progress_percent between 0 and 100),
  note             text,
  created_at       timestamptz not null default now(),
  primary key (user_id, project_id)
);
create index on saved_projects (project_id);

create table competition_follows (
  user_id        uuid references profiles(id) on delete cascade,
  competition_id uuid references competitions(id) on delete cascade,
  applied        boolean not null default false,
  applied_at     timestamptz,
  remind_days    smallint not null default 7,
  created_at     timestamptz not null default now(),
  primary key (user_id, competition_id)
);
create index on competition_follows (competition_id);

create table notifications (
  id         bigserial primary key,
  user_id    uuid not null references profiles(id) on delete cascade,
  title      text not null,
  body       text,
  link_url   text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index on notifications (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- 7. แบบทดสอบ
-- หัวใจคือ option_tag_weights — คำตอบให้ "น้ำหนักแท็ก" ไม่ใช่ผูกโครงงานตรงๆ
-- ---------------------------------------------------------------------
create table quiz_questions (
  id         serial primary key,
  kind       text not null default 'interest',   -- interest | filter
  question   text not null,
  helper     text,
  sort_order smallint not null,
  is_active  boolean not null default true
);

create table quiz_options (
  id          serial primary key,
  question_id int not null references quiz_questions(id) on delete cascade,
  label       text not null,
  sort_order  smallint not null,
  filter      jsonb          -- ใช้กับคำถามชนิด filter เช่น {"budget_max":500}
);
create index on quiz_options (question_id);

create table option_tag_weights (
  option_id int references quiz_options(id) on delete cascade,
  tag_id    int references tags(id) on delete cascade,
  weight    numeric(4,2) not null,        -- -1.00 ถึง 1.00
  primary key (option_id, tag_id)
);

create table quiz_results (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id) on delete set null,  -- null ได้ = ไม่ล็อกอิน
  anon_id       text,                                             -- cookie id
  answers       jsonb not null,            -- [{question_id, option_id}]
  tag_profile   jsonb not null,            -- {"electronics":0.82,"coding":0.74}
  matched_ids   uuid[],                    -- โครงงาน 5 อันดับที่ระบบเลือก
  reasons       jsonb,                     -- {"project_id":"ทำไมเหมาะกับคุณ..."}
  created_at    timestamptz not null default now()
);
create index on quiz_results (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- 8. คิวงานเบื้องหลัง (สร้าง embedding / ตัดคำไทย)
-- ---------------------------------------------------------------------
create table embedding_jobs (
  id          bigserial primary key,
  project_id  uuid not null references projects(id) on delete cascade,
  status      text not null default 'queued',   -- queued | done | error
  attempts    smallint not null default 0,
  error       text,
  created_at  timestamptz not null default now()
);
create index on embedding_jobs (status, created_at);

-- security definer เพราะตอนนักเรียนส่งโครงงานเข้าคิว trigger จะเขียน embedding_jobs
-- ในสิทธิ์ของนักเรียน ซึ่ง RLS ไม่อนุญาต แล้วจะทำให้ insert โครงงานล้มทั้งรายการ
create or replace function queue_embedding() returns trigger
security definer set search_path = public as $$
begin
  -- ต้องแยก branch ให้ชัด ห้ามรวมเงื่อนไข INSERT กับการอ้าง old ไว้ใน if เดียวกัน
  -- เพราะ PL/pgSQL ไม่การันตี short-circuit ตอน INSERT จะฟ้องว่า old ยังไม่ถูกกำหนดค่า
  if tg_op = 'INSERT' then
    insert into embedding_jobs (project_id) values (new.id);
  elsif new.title      is distinct from old.title
     or new.summary    is distinct from old.summary
     or new.purpose_md is distinct from old.purpose_md then
    insert into embedding_jobs (project_id) values (new.id);
  end if;
  return new;
end $$ language plpgsql;

create trigger trg_queue_embedding
after insert or update on projects
for each row execute function queue_embedding();

-- ---------------------------------------------------------------------
-- 9. ฟังก์ชันค้นหาแบบ 3 ชั้น (ชั้น 1 กรอง + ชั้น 2 vector)
-- ---------------------------------------------------------------------
create or replace function match_projects(
  query_embedding vector(768),
  p_grade         smallint default null,
  p_budget_max    int      default null,
  p_categories    int[]    default null,
  p_difficulty    difficulty[] default null,
  p_limit         int      default 20
) returns table (id uuid, title text, similarity float)
language sql stable as $$
  select p.id, p.title, 1 - (p.embedding <=> query_embedding) as similarity
  from projects p
  where p.status = 'published'
    and p.embedding is not null
    and (p_grade      is null or p_grade between p.grade_min and p.grade_max)
    and (p_budget_max is null or p.budget_min <= p_budget_max)
    and (p_categories is null or p.category_id = any(p_categories))
    and (p_difficulty is null or p.difficulty = any(p_difficulty))
  order by p.embedding <=> query_embedding
  limit p_limit;
$$;

-- ---------------------------------------------------------------------
-- 10. Row Level Security
-- ---------------------------------------------------------------------
create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('editor','super_admin')
  );
$$;

alter table profiles          enable row level security;
alter table projects          enable row level security;
alter table articles          enable row level security;
alter table competitions      enable row level security;
alter table saved_projects    enable row level security;
alter table competition_follows enable row level security;
alter table notifications     enable row level security;
alter table quiz_results      enable row level security;

-- อ่านสาธารณะ: เห็นเฉพาะที่เผยแพร่แล้ว
create policy read_published_projects on projects
  for select using (status = 'published' or is_admin() or submitted_by = auth.uid());
create policy read_published_articles on articles
  for select using (status = 'published' or is_admin());
create policy read_published_comps on competitions
  for select using (status = 'published' or is_admin());

-- เขียนได้เฉพาะแอดมิน (ยกเว้นนักเรียนส่งโครงงานเข้าคิว)
create policy admin_write_projects on projects
  for all using (is_admin()) with check (is_admin());
create policy student_submit_project on projects
  for insert with check (auth.uid() = submitted_by and status = 'pending');

-- ข้อมูลส่วนตัว: เจ้าของเท่านั้น
create policy own_profile   on profiles           for all using (id = auth.uid()) with check (id = auth.uid());
create policy own_saves     on saved_projects     for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy own_follows   on competition_follows for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy own_notifs    on notifications      for select using (user_id = auth.uid());
create policy own_quiz      on quiz_results       for all using (user_id = auth.uid()) with check (user_id = auth.uid() or user_id is null);


-- ตารางที่เหลือต้องเปิด RLS ด้วย: ตารางที่ไม่เปิด RLS จะถูกอ่านและ "เขียน" ได้
-- ผ่าน anon key ทันที เพราะ Supabase เปิด PostgREST ให้ทุกตารางโดยอัตโนมัติ
alter table categories           enable row level security;
alter table tags                 enable row level security;
alter table project_tags         enable row level security;
alter table project_links        enable row level security;
alter table project_documents    enable row level security;
alter table related_projects     enable row level security;
alter table competition_events   enable row level security;
alter table competition_projects enable row level security;
alter table quiz_questions       enable row level security;
alter table quiz_options         enable row level security;
alter table option_tag_weights   enable row level security;
alter table embedding_jobs       enable row level security;

-- อ่านได้ทุกคน เขียนได้เฉพาะแอดมิน
do $$
declare t text;
begin
  foreach t in array array['categories','tags','project_tags','project_links','related_projects',
                           'competition_events','competition_projects','quiz_questions',
                           'quiz_options','option_tag_weights']
  loop
    execute format('create policy %I on %I for select using (true)', 'public_read_' || t, t);
    execute format('create policy %I on %I for all using (is_admin()) with check (is_admin())', 'admin_write_' || t, t);
  end loop;
end $$;

-- ไฟล์แนบและคิวงานเบื้องหลัง: แอดมินเท่านั้น
create policy admin_documents on project_documents for all using (is_admin()) with check (is_admin());
create policy read_documents  on project_documents for select using (true);
create policy admin_jobs      on embedding_jobs   for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- 11. งานตามเวลา
-- ---------------------------------------------------------------------
-- แจ้งเตือนล่วงหน้า 7 วันก่อนปิดรับ (ทุกวัน 08:00 เวลาไทย = 01:00 UTC)
select cron.schedule('deadline-reminder', '0 1 * * *', $$
  insert into notifications (user_id, title, body, link_url)
  select f.user_id,
         'ใกล้ปิดรับสมัคร: ' || c.name,
         'เหลืออีก ' || (c.close_at - current_date) || ' วัน',
         '/competitions/' || c.slug
  from competition_follows f
  join competitions c on c.id = f.competition_id
  where c.close_at - current_date = f.remind_days
    and c.status = 'published'
  on conflict do nothing;
$$);

-- เผยแพร่เนื้อหาที่ตั้งเวลาไว้ (ทุก 10 นาที)
select cron.schedule('publish-scheduled', '*/10 * * * *', $$
  update articles set status = 'published', published_at = now()
   where status = 'draft' and publish_at is not null and publish_at <= now();
  update competitions set status = 'published'
   where status = 'draft' and publish_at is not null and publish_at <= now();
$$);
