-- migration 004: Career & Interest Discovery system
-- New tables only — ไม่แตะตาราง/ข้อมูลเดิมใดเลย

-- ─── Career Categories ───────────────────────────────────────────────
create table if not exists career_categories (
  id         serial primary key,
  slug       text unique not null,
  name_th    text not null,
  color      text not null,   -- hex color e.g. '#0A7EA4'
  sort_order smallint not null default 0
);

-- ─── Careers ─────────────────────────────────────────────────────────
create table if not exists careers (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name_th      text not null,
  name_en      text not null,
  category_id  int not null references career_categories(id) on delete restrict,
  description_th text not null,
  education_hint_th text,
  skills_th    jsonb not null default '[]',
  -- 10 interest dimensions, score 0–10 each
  dim_tech      smallint not null default 0,
  dim_science   smallint not null default 0,
  dim_creative  smallint not null default 0,
  dim_helping   smallint not null default 0,
  dim_business  smallint not null default 0,
  dim_nature    smallint not null default 0,
  dim_data      smallint not null default 0,
  dim_law       smallint not null default 0,
  dim_craft     smallint not null default 0,
  dim_media     smallint not null default 0,
  -- link to existing project tag slugs for recommendation
  related_project_tags text[] not null default '{}',
  grade_min    smallint not null default 1,
  grade_max    smallint not null default 12,
  status       text not null default 'published'
                check (status in ('draft','published','archived')),
  sort_order   smallint not null default 0,
  created_at   timestamptz not null default now()
);

-- ─── Career Test Results ─────────────────────────────────────────────
create table if not exists career_results (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references profiles(id) on delete set null,
  anon_id      text,
  grade_band   text check (grade_band in ('primary','lower','upper')),
  answers      jsonb not null,
  dim_profile  jsonb not null,   -- {"tech":80,"science":60,...}
  top_career_ids uuid[],
  created_at   timestamptz not null default now()
);

create index on career_results (created_at desc);
create index on career_results (anon_id);

-- ─── Universal Event Log ─────────────────────────────────────────────
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  user_id     uuid references profiles(id) on delete set null,
  event_type  text not null,
  page        text,
  object_id   text,
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create index on events (event_type, created_at desc);
create index on events (session_id, created_at);
create index on events (created_at desc);

-- ─── RLS ─────────────────────────────────────────────────────────────
alter table career_categories  enable row level security;
alter table careers            enable row level security;
alter table career_results     enable row level security;
alter table events             enable row level security;

-- career_categories: anyone can read
create policy "public read career categories"
  on career_categories for select using (true);

-- careers: anyone can read published
create policy "public read published careers"
  on careers for select using (status = 'published');

-- career_results: anyone can insert (anon OK), users see own rows
create policy "insert career results"
  on career_results for insert
  with check (user_id = auth.uid() or user_id is null);

create policy "users read own career results"
  on career_results for select
  using (user_id = auth.uid() or anon_id is not null);

-- events: anyone can insert, admin reads all
create policy "insert events"
  on events for insert
  with check (session_id <> '');

create policy "admin read events"
  on events for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('editor','super_admin')
    )
  );

-- admin write for careers/categories
create policy "admin write career categories"
  on career_categories for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role in ('editor','super_admin'))
  );

create policy "admin write careers"
  on careers for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role in ('editor','super_admin'))
  );

-- ─── Seed: Career Categories ─────────────────────────────────────────
insert into career_categories (slug, name_th, color, sort_order) values
  ('tech',        'เทคโนโลยีและคอมพิวเตอร์',  '#0A7EA4', 1),
  ('healthcare',  'สุขภาพและการแพทย์',          '#0F7A55', 2),
  ('science',     'วิทยาศาสตร์และการวิจัย',     '#5B3FD6', 3),
  ('arts',        'ศิลปะ ดีไซน์ และสื่อ',       '#C22367', 4),
  ('business',    'ธุรกิจและการเงิน',            '#B35A00', 5),
  ('engineering', 'วิศวกรรมและช่าง',             '#6B4500', 6),
  ('social',      'สังคมและการบริการ',            '#A32E86', 7)
on conflict (slug) do nothing;

-- ─── Seed: Careers ───────────────────────────────────────────────────
-- tech=เทคโนโลยี science=วิทยาศาสตร์ creative=สร้างสรรค์ helping=ช่วยเหลือ
-- business=ธุรกิจ nature=ธรรมชาติ data=ข้อมูล law=กฎ/ระเบียบ craft=ฝีมือ media=สื่อ

-- Category 1: เทคโนโลยีและคอมพิวเตอร์
insert into careers (slug,name_th,name_en,category_id,description_th,education_hint_th,skills_th,
  dim_tech,dim_science,dim_creative,dim_helping,dim_business,dim_nature,dim_data,dim_law,dim_craft,dim_media,
  related_project_tags,grade_min,grade_max,sort_order)
select
  c.slug,c.name_th,c.name_en,cat.id,c.desc_th,c.edu_th,c.skills::jsonb,
  c.t,c.sc,c.cr,c.he,c.bu,c.na,c.da,c.la,c.crafts,c.me,
  c.tags,c.gmin,c.gmax,c.sord
from (values
  ('software-engineer','วิศวกรซอฟต์แวร์','Software Engineer',
   'สร้างโปรแกรม แอป และระบบซอฟต์แวร์ที่ผู้คนนับล้านใช้งานทุกวัน',
   'คณะวิศวกรรมศาสตร์ (คอมพิวเตอร์) หรือ วิทยาการคอมพิวเตอร์',
   '["เขียนโปรแกรม","แก้ปัญหา","คิดวิเคราะห์"]',
   10,5,6,3,4,0,8,2,4,2, ARRAY['coding','ai','data','electronics'], 7,12,1),

  ('ux-ui-designer','นักออกแบบ UX/UI','UX/UI Designer',
   'ออกแบบประสบการณ์และหน้าตาของแอปพลิเคชันให้ใช้งานง่ายและสวยงาม',
   'คณะสถาปัตยกรรมศาสตร์ (ออกแบบ) หรือ วิทยาการคอมพิวเตอร์ (Human-Computer Interaction)',
   '["ออกแบบ","ความคิดสร้างสรรค์","เทคโนโลยี"]',
   7,3,10,5,5,0,5,1,5,7, ARRAY['design','coding','data'], 7,12,2),

  ('data-scientist','นักวิทยาศาสตร์ข้อมูล','Data Scientist',
   'วิเคราะห์ข้อมูลขนาดใหญ่และสร้างโมเดล AI เพื่อช่วยให้องค์กรตัดสินใจได้ดีขึ้น',
   'คณะวิทยาศาสตร์ (สถิติ/คณิตศาสตร์) หรือ วิศวกรรมศาสตร์คอมพิวเตอร์',
   '["ข้อมูล","คณิตศาสตร์","AI"]',
   9,8,4,3,5,2,10,2,2,2, ARRAY['data','coding','ai'], 7,12,3),

  ('cybersecurity-engineer','วิศวกรความปลอดภัยไซเบอร์','Cybersecurity Engineer',
   'ปกป้องระบบคอมพิวเตอร์และข้อมูลจากการโจมตีและภัยคุกคามทางดิจิทัล',
   'คณะวิศวกรรมศาสตร์ (คอมพิวเตอร์/ไฟฟ้า) หรือ วิทยาศาสตร์คอมพิวเตอร์',
   '["ความปลอดภัย","โปรแกรมมิ่ง","วิเคราะห์"]',
   10,5,4,4,4,0,8,7,5,2, ARRAY['coding','electronics','data'], 7,12,4),

  ('game-developer','นักพัฒนาเกม','Game Developer',
   'สร้างวิดีโอเกมทั้งในด้านโปรแกรมมิ่ง กราฟิก และการออกแบบประสบการณ์ผู้เล่น',
   'คณะวิศวกรรมศาสตร์คอมพิวเตอร์ หรือ สื่อดิจิทัล/มัลติมีเดีย',
   '["โปรแกรมมิ่ง","ออกแบบ","ความคิดสร้างสรรค์"]',
   9,4,9,2,4,0,6,1,5,7, ARRAY['coding','design','ai'], 4,12,5)
) as c(slug,name_th,name_en,desc_th,edu_th,skills,t,sc,cr,he,bu,na,da,la,crafts,me,tags,gmin,gmax,sord)
cross join (select id from career_categories where slug='tech') as cat
on conflict (slug) do nothing;

-- Category 2: สุขภาพและการแพทย์
insert into careers (slug,name_th,name_en,category_id,description_th,education_hint_th,skills_th,
  dim_tech,dim_science,dim_creative,dim_helping,dim_business,dim_nature,dim_data,dim_law,dim_craft,dim_media,
  related_project_tags,grade_min,grade_max,sort_order)
select
  c.slug,c.name_th,c.name_en,cat.id,c.desc_th,c.edu_th,c.skills::jsonb,
  c.t,c.sc,c.cr,c.he,c.bu,c.na,c.da,c.la,c.crafts,c.me,
  c.tags,c.gmin,c.gmax,c.sord
from (values
  ('doctor','แพทย์','Doctor',
   'วินิจฉัย รักษาโรค และดูแลสุขภาพของผู้ป่วย ทั้งทางร่างกายและจิตใจ',
   'คณะแพทยศาสตร์ (6 ปี) ต้องสอบ TCAS ด้วยคะแนนสูง วิทยาศาสตร์สุขภาพ',
   '["วิทยาศาสตร์","การดูแลผู้ป่วย","ตัดสินใจรวดเร็ว"]',
   5,10,4,10,3,3,7,5,6,3, ARRAY['biology','chemistry','health','physics'], 7,12,1),

  ('nurse','พยาบาล','Nurse',
   'ดูแลผู้ป่วยในโรงพยาบาล ให้ยา ติดตามอาการ และให้กำลังใจผู้ป่วยและครอบครัว',
   'คณะพยาบาลศาสตร์ (4 ปี)',
   '["ดูแลผู้ป่วย","ชีววิทยา","สื่อสาร"]',
   3,7,4,10,2,2,5,4,6,3, ARRAY['biology','health','chemistry'], 4,12,2),

  ('pharmacist','เภสัชกร','Pharmacist',
   'จ่ายยา ให้คำแนะนำการใช้ยาที่ถูกต้อง และตรวจสอบปฏิกิริยาของยา',
   'คณะเภสัชศาสตร์ (6 ปี)',
   '["เคมี","ชีววิทยา","ใส่ใจละเอียด"]',
   4,9,3,7,4,2,6,5,5,2, ARRAY['chemistry','biology','health'], 7,12,3),

  ('psychologist','นักจิตวิทยา','Psychologist',
   'ศึกษาพฤติกรรมมนุษย์ ให้คำปรึกษา และช่วยรักษาปัญหาสุขภาพจิต',
   'คณะจิตวิทยา หรือ สังคมศาสตร์ (จิตวิทยา)',
   '["ฟังอย่างเข้าใจ","วิเคราะห์","ความเห็นอกเห็นใจ"]',
   3,8,5,10,3,2,7,4,2,6, ARRAY['health','social','biology'], 7,12,4),

  ('dentist','ทันตแพทย์','Dentist',
   'ดูแลสุขภาพช่องปากและฟัน ตั้งแต่อุดฟัน ถอนฟัน จนถึงจัดฟัน',
   'คณะทันตแพทยศาสตร์ (6 ปี)',
   '["งานละเอียด","วิทยาศาสตร์","ดูแลผู้ป่วย"]',
   4,8,4,8,3,1,5,3,9,2, ARRAY['biology','chemistry','health'], 7,12,5)
) as c(slug,name_th,name_en,desc_th,edu_th,skills,t,sc,cr,he,bu,na,da,la,crafts,me,tags,gmin,gmax,sord)
cross join (select id from career_categories where slug='healthcare') as cat
on conflict (slug) do nothing;

-- Category 3: วิทยาศาสตร์และการวิจัย
insert into careers (slug,name_th,name_en,category_id,description_th,education_hint_th,skills_th,
  dim_tech,dim_science,dim_creative,dim_helping,dim_business,dim_nature,dim_data,dim_law,dim_craft,dim_media,
  related_project_tags,grade_min,grade_max,sort_order)
select
  c.slug,c.name_th,c.name_en,cat.id,c.desc_th,c.edu_th,c.skills::jsonb,
  c.t,c.sc,c.cr,c.he,c.bu,c.na,c.da,c.la,c.crafts,c.me,
  c.tags,c.gmin,c.gmax,c.sord
from (values
  ('biologist','นักชีววิทยา','Biologist',
   'ศึกษาสิ่งมีชีวิตทุกรูปแบบ ตั้งแต่ระดับเซลล์ถึงระบบนิเวศ',
   'คณะวิทยาศาสตร์ (ชีววิทยา/พฤกษศาสตร์/สัตววิทยา)',
   '["ชีววิทยา","สังเกต","วิเคราะห์"]',
   4,10,4,4,2,8,7,2,5,3, ARRAY['biology','environment','chemistry','data'], 4,12,1),

  ('chemist','นักเคมี','Chemist',
   'ค้นคว้าและพัฒนาสารเคมี ยา วัสดุ และกระบวนการที่เป็นประโยชน์ต่อชีวิต',
   'คณะวิทยาศาสตร์ (เคมี/เคมีอุตสาหกรรม) หรือวิศวกรรมเคมี',
   '["เคมี","ทดลอง","วิเคราะห์ข้อมูล"]',
   5,10,4,3,2,4,8,2,7,2, ARRAY['chemistry','biology','physics','data'], 4,12,2),

  ('environmental-scientist','นักวิทยาศาสตร์สิ่งแวดล้อม','Environmental Scientist',
   'ศึกษาและแก้ปัญหาสิ่งแวดล้อม ตั้งแต่มลพิษอากาศ น้ำ ถึงการเปลี่ยนแปลงสภาพภูมิอากาศ',
   'คณะวิทยาศาสตร์ (สิ่งแวดล้อม) หรือวิศวกรรมสิ่งแวดล้อม',
   '["สิ่งแวดล้อม","วิเคราะห์","ภาคสนาม"]',
   4,9,4,5,2,10,7,4,4,4, ARRAY['environment','biology','chemistry','data'], 4,12,3),

  ('physicist','นักฟิสิกส์','Physicist',
   'ค้นหาหลักการพื้นฐานของจักรวาล ตั้งแต่อนุภาคขนาดเล็กถึงดาวกาแล็กซี',
   'คณะวิทยาศาสตร์ (ฟิสิกส์) หรือวิศวกรรมศาสตร์',
   '["คณิตศาสตร์","วิเคราะห์","คิดเชิงตรรกะ"]',
   8,10,4,3,2,3,9,2,5,2, ARRAY['physics','electronics','data','coding'], 7,12,4)
) as c(slug,name_th,name_en,desc_th,edu_th,skills,t,sc,cr,he,bu,na,da,la,crafts,me,tags,gmin,gmax,sord)
cross join (select id from career_categories where slug='science') as cat
on conflict (slug) do nothing;

-- Category 4: ศิลปะ ดีไซน์ และสื่อ
insert into careers (slug,name_th,name_en,category_id,description_th,education_hint_th,skills_th,
  dim_tech,dim_science,dim_creative,dim_helping,dim_business,dim_nature,dim_data,dim_law,dim_craft,dim_media,
  related_project_tags,grade_min,grade_max,sort_order)
select
  c.slug,c.name_th,c.name_en,cat.id,c.desc_th,c.edu_th,c.skills::jsonb,
  c.t,c.sc,c.cr,c.he,c.bu,c.na,c.da,c.la,c.crafts,c.me,
  c.tags,c.gmin,c.gmax,c.sord
from (values
  ('graphic-designer','นักออกแบบกราฟิก','Graphic Designer',
   'สร้างสรรค์งานภาพ โลโก้ โปสเตอร์ และสื่อดิจิทัลที่สื่อสารข้อความได้อย่างมีพลัง',
   'คณะสถาปัตยกรรมศาสตร์ (ออกแบบนิเทศศิลป์) หรือศิลปกรรมศาสตร์',
   '["ออกแบบ","ความคิดสร้างสรรค์","ซอฟต์แวร์กราฟิก"]',
   6,2,10,4,5,2,4,1,7,8, ARRAY['design','coding'], 4,12,1),

  ('filmmaker','ผู้กำกับ/ผู้สร้างภาพยนตร์','Filmmaker',
   'เล่าเรื่องผ่านภาพยนตร์และวิดีโอ ทั้งในมิติของศิลปะและการบันเทิง',
   'คณะนิเทศศาสตร์ (ภาพยนตร์) หรือสื่อดิจิทัล',
   '["เล่าเรื่อง","กล้อง","ตัดต่อ"]',
   6,2,10,4,5,3,4,2,5,10, ARRAY['design','social'], 4,12,2),

  ('musician','นักดนตรี','Musician',
   'แสดงดนตรีสด ประพันธ์เพลง หรือผลิตงานดนตรีในแนวทางที่ชื่นชอบ',
   'คณะดุริยางคศาสตร์ หรือดนตรีไทย/สากล',
   '["ดนตรี","ความคิดสร้างสรรค์","ฝึกฝน"]',
   3,3,10,4,3,3,3,1,8,8, ARRAY['design','craft'], 1,12,3),

  ('journalist','นักข่าว/นักเขียน','Journalist',
   'รายงานข่าว สืบสวน และเล่าเรื่องราวที่สำคัญให้สังคมได้รับรู้',
   'คณะนิเทศศาสตร์ (วารสารศาสตร์) หรือมนุษยศาสตร์',
   '["เขียน","สืบสวน","สื่อสาร"]',
   4,4,8,5,5,3,5,5,2,10, ARRAY['social','data'], 4,12,4),

  ('interior-designer','นักออกแบบตกแต่งภายใน','Interior Designer',
   'ออกแบบพื้นที่ภายในอาคารให้ใช้งานได้ดีและมีความสวยงามเหมาะกับผู้ใช้',
   'คณะสถาปัตยกรรมศาสตร์ (ออกแบบตกแต่งภายใน)',
   '["ออกแบบ","สร้างสรรค์","งานช่าง"]',
   4,4,9,5,6,4,4,3,8,5, ARRAY['design','craft','environment'], 4,12,5)
) as c(slug,name_th,name_en,desc_th,edu_th,skills,t,sc,cr,he,bu,na,da,la,crafts,me,tags,gmin,gmax,sord)
cross join (select id from career_categories where slug='arts') as cat
on conflict (slug) do nothing;

-- Category 5: ธุรกิจและการเงิน
insert into careers (slug,name_th,name_en,category_id,description_th,education_hint_th,skills_th,
  dim_tech,dim_science,dim_creative,dim_helping,dim_business,dim_nature,dim_data,dim_law,dim_craft,dim_media,
  related_project_tags,grade_min,grade_max,sort_order)
select
  c.slug,c.name_th,c.name_en,cat.id,c.desc_th,c.edu_th,c.skills::jsonb,
  c.t,c.sc,c.cr,c.he,c.bu,c.na,c.da,c.la,c.crafts,c.me,
  c.tags,c.gmin,c.gmax,c.sord
from (values
  ('entrepreneur','ผู้ประกอบการ','Entrepreneur',
   'สร้างธุรกิจจากศูนย์ แก้ปัญหาตลาด และสร้างคุณค่าให้กับสังคมผ่านการทำธุรกิจ',
   'คณะบริหารธุรกิจ (ผู้ประกอบการ) หรือวิศวกรรมศาสตร์',
   '["ความคิดสร้างสรรค์","ความเสี่ยง","บริหาร"]',
   5,3,8,4,10,2,7,5,4,6, ARRAY['social','data','design','coding'], 7,12,1),

  ('marketing-specialist','นักการตลาด','Marketing Specialist',
   'วางกลยุทธ์และสื่อสารแบรนด์ให้เข้าถึงลูกค้าและสร้างยอดขาย',
   'คณะบริหารธุรกิจ (การตลาด) หรือนิเทศศาสตร์',
   '["สื่อสาร","วิเคราะห์ตลาด","สร้างสรรค์"]',
   5,3,8,5,9,2,7,3,3,8, ARRAY['social','data','design'], 7,12,2),

  ('financial-analyst','นักวิเคราะห์การเงิน','Financial Analyst',
   'วิเคราะห์ข้อมูลทางการเงินเพื่อประเมินความเสี่ยงและโอกาสการลงทุน',
   'คณะบริหารธุรกิจ (การเงิน) หรือเศรษฐศาสตร์',
   '["ข้อมูล","คณิตศาสตร์","วิเคราะห์"]',
   6,5,3,3,9,1,10,6,2,3, ARRAY['data','social'], 7,12,3),

  ('accountant','นักบัญชี','Accountant',
   'บันทึก ตรวจสอบ และรายงานข้อมูลทางการเงินของบุคคลหรือองค์กร',
   'คณะบริหารธุรกิจ (การบัญชี) หรือเศรษฐศาสตร์',
   '["ตัวเลข","ละเอียดรอบคอบ","กฎหมาย"]',
   5,4,2,3,8,1,9,7,2,2, ARRAY['data','social'], 7,12,4)
) as c(slug,name_th,name_en,desc_th,edu_th,skills,t,sc,cr,he,bu,na,da,la,crafts,me,tags,gmin,gmax,sord)
cross join (select id from career_categories where slug='business') as cat
on conflict (slug) do nothing;

-- Category 6: วิศวกรรมและช่าง
insert into careers (slug,name_th,name_en,category_id,description_th,education_hint_th,skills_th,
  dim_tech,dim_science,dim_creative,dim_helping,dim_business,dim_nature,dim_data,dim_law,dim_craft,dim_media,
  related_project_tags,grade_min,grade_max,sort_order)
select
  c.slug,c.name_th,c.name_en,cat.id,c.desc_th,c.edu_th,c.skills::jsonb,
  c.t,c.sc,c.cr,c.he,c.bu,c.na,c.da,c.la,c.crafts,c.me,
  c.tags,c.gmin,c.gmax,c.sord
from (values
  ('civil-engineer','วิศวกรโยธา','Civil Engineer',
   'ออกแบบและสร้างโครงสร้างพื้นฐาน เช่น สะพาน ถนน ตึก และระบบน้ำประปา',
   'คณะวิศวกรรมศาสตร์ (โยธา)',
   '["คณิตศาสตร์","ฟิสิกส์","ออกแบบ"]',
   8,8,5,4,4,5,7,5,9,2, ARRAY['physics','environment','electronics','craft'], 4,12,1),

  ('mechanical-engineer','วิศวกรเครื่องกล','Mechanical Engineer',
   'ออกแบบและพัฒนาเครื่องจักร ยานพาหนะ และระบบพลังงานกล',
   'คณะวิศวกรรมศาสตร์ (เครื่องกล)',
   '["ฟิสิกส์","คณิตศาสตร์","ออกแบบ"]',
   9,9,5,3,3,3,7,3,9,2, ARRAY['physics','robotics','electronics','craft'], 4,12,2),

  ('electrician','ช่างไฟฟ้า','Electrician',
   'ติดตั้ง ซ่อมแซม และดูแลระบบไฟฟ้าในบ้านเรือนและโรงงาน',
   'อาชีวศึกษา (ช่างไฟฟ้า) หรือคณะวิศวกรรมศาสตร์ (ไฟฟ้า)',
   '["ไฟฟ้า","ซ่อมบำรุง","ความปลอดภัย"]',
   8,7,3,4,3,2,5,3,10,2, ARRAY['electronics','physics','craft'], 4,12,3),

  ('architect','สถาปนิก','Architect',
   'ออกแบบอาคาร บ้าน และพื้นที่สาธารณะให้ทั้งสวยงามและใช้งานได้จริง',
   'คณะสถาปัตยกรรมศาสตร์ (สถาปัตยกรรมหลัก)',
   '["ออกแบบ","ฟิสิกส์","ความคิดสร้างสรรค์"]',
   6,6,9,4,5,5,6,4,8,4, ARRAY['design','craft','environment','physics'], 4,12,4),

  ('robotics-engineer','วิศวกรหุ่นยนต์','Robotics Engineer',
   'สร้างและโปรแกรมหุ่นยนต์และระบบอัตโนมัติเพื่อทำงานแทนมนุษย์',
   'คณะวิศวกรรมศาสตร์ (หุ่นยนต์/คอมพิวเตอร์/ไฟฟ้า)',
   '["หุ่นยนต์","โปรแกรมมิ่ง","ฟิสิกส์"]',
   10,9,6,3,3,2,7,2,8,2, ARRAY['robotics','electronics','coding','physics'], 4,12,5)
) as c(slug,name_th,name_en,desc_th,edu_th,skills,t,sc,cr,he,bu,na,da,la,crafts,me,tags,gmin,gmax,sord)
cross join (select id from career_categories where slug='engineering') as cat
on conflict (slug) do nothing;

-- Category 7: สังคมและการบริการ
insert into careers (slug,name_th,name_en,category_id,description_th,education_hint_th,skills_th,
  dim_tech,dim_science,dim_creative,dim_helping,dim_business,dim_nature,dim_data,dim_law,dim_craft,dim_media,
  related_project_tags,grade_min,grade_max,sort_order)
select
  c.slug,c.name_th,c.name_en,cat.id,c.desc_th,c.edu_th,c.skills::jsonb,
  c.t,c.sc,c.cr,c.he,c.bu,c.na,c.da,c.la,c.crafts,c.me,
  c.tags,c.gmin,c.gmax,c.sord
from (values
  ('teacher','ครู/อาจารย์','Teacher',
   'ถ่ายทอดความรู้ สร้างแรงบันดาลใจ และเป็นแบบอย่างที่ดีให้กับนักเรียน',
   'คณะศึกษาศาสตร์ หรือครุศาสตร์ (5 ปี)',
   '["สื่อสาร","อดทน","ใส่ใจผู้อื่น"]',
   4,5,7,9,3,3,5,4,4,8, ARRAY['social','health','environment'], 4,12,1),

  ('social-worker','นักสังคมสงเคราะห์','Social Worker',
   'ช่วยเหลือบุคคลและครอบครัวที่ประสบปัญหา เพื่อให้มีคุณภาพชีวิตที่ดีขึ้น',
   'คณะสังคมสงเคราะห์ศาสตร์ หรือสังคมศาสตร์',
   '["ความเห็นใจ","ฟัง","แก้ปัญหา"]',
   2,4,5,10,3,3,5,7,2,5, ARRAY['social','health'], 7,12,2),

  ('lawyer','ทนายความ/นักกฎหมาย','Lawyer',
   'ให้คำปรึกษาทางกฎหมาย ว่าความ และช่วยให้ผู้คนได้รับความเป็นธรรม',
   'คณะนิติศาสตร์ (4 ปี)',
   '["กฎหมาย","ตรรกะ","การพูด"]',
   4,4,5,6,6,2,7,10,2,6, ARRAY['social','data'], 7,12,3),

  ('athlete-coach','นักกีฬา/โค้ช','Athlete / Coach',
   'แข่งขันกีฬาระดับสูงหรือฝึกสอนนักกีฬาเพื่อพัฒนาศักยภาพสูงสุด',
   'คณะวิทยาศาสตร์การกีฬา หรือพลศึกษา',
   '["กีฬา","วินัย","ความเป็นผู้นำ"]',
   3,6,5,7,4,5,5,3,9,5, ARRAY['health','biology','social'], 1,12,4),

  ('agricultural-scientist','นักวิทยาศาสตร์การเกษตร','Agricultural Scientist',
   'พัฒนาพันธุ์พืช เทคนิคการปลูก และระบบการเกษตรที่ยั่งยืนเพื่อความมั่นคงทางอาหาร',
   'คณะเกษตรศาสตร์ หรือวิทยาศาสตร์ (ชีววิทยา/เคมี)',
   '["ชีววิทยา","ธรรมชาติ","ทดลอง"]',
   4,8,5,6,4,10,5,3,7,3, ARRAY['agriculture','biology','environment','chemistry'], 1,12,5)
) as c(slug,name_th,name_en,desc_th,edu_th,skills,t,sc,cr,he,bu,na,da,la,crafts,me,tags,gmin,gmax,sord)
cross join (select id from career_categories where slug='social') as cat
on conflict (slug) do nothing;
