-- migration 006: เพิ่มหมวดหมู่ใหม่ 3 สาย
insert into categories (slug, name_th, color) values
  ('health',  'สุขภาพ',          '#E63946'),
  ('agri',    'เกษตรและอาหาร',   '#65A30D'),
  ('arts',    'ศิลปะและสื่อ',    '#8B5CF6')
on conflict (slug) do nothing;
