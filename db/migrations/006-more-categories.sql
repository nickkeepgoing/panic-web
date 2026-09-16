-- migration 006: เพิ่มหมวดหมู่ใหม่ 3 สาย
-- สีของแต่ละหมวดอยู่ใน lib/categories.ts ไม่ได้เก็บใน DB
insert into categories (slug, name_th) values
  ('health', 'สุขภาพ'),
  ('agri',   'เกษตรและอาหาร'),
  ('arts',   'ศิลปะและสื่อ')
on conflict (slug) do nothing;
