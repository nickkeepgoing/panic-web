-- แก้อาการ "หน้านี้โหลดไม่สำเร็จ" ตอนกดบันทึกประกาศกิจกรรมแข่งขันในหน้า /admin/competitions
--
-- สาเหตุ: ตาราง competitions (และ articles) เปิด row level security ไว้
-- แต่มีแค่ policy ฝั่งอ่าน ไม่มี policy ฝั่งเขียน
-- Postgres ปฏิเสธ insert ทุกครั้งด้วย error 42501
-- "new row violates row-level security policy" ต่อให้ล็อกอินเป็น editor/super_admin แล้วก็ตาม
--
-- รันไฟล์นี้ครั้งเดียวใน Supabase SQL Editor ของโปรเจกต์ที่ใช้งานจริง
-- (ฐานข้อมูลที่สร้างใหม่จาก db/schema.sql มี policy พวกนี้อยู่แล้ว ไม่ต้องรันซ้ำ)

drop policy if exists admin_write_comps on competitions;
create policy admin_write_comps on competitions
  for all using (is_admin()) with check (is_admin());

drop policy if exists admin_write_articles on articles;
create policy admin_write_articles on articles
  for all using (is_admin()) with check (is_admin());

-- ตรวจผล: ต้องเห็น competitions และ articles อย่างละ 2 แถว (อ่าน 1 + เขียน 1)
-- select tablename, policyname, cmd from pg_policies
--  where tablename in ('competitions','articles') order by tablename, policyname;
