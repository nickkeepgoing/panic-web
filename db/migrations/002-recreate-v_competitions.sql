-- แก้อาการ "หน้าแรก/ปฏิทินโชว์ข้อมูลตัวอย่างค้าง ไม่อัปเดตตามฐานข้อมูลจริง"
--
-- สาเหตุ: view v_competitions ถูกสร้างด้วย `select c.*` ตั้งแต่ก่อนที่ตาราง
-- competitions จะมีคอลัมน์ cover_url เพิ่มเข้ามาทีหลัง Postgres ไม่อัปเดตรายชื่อ
-- คอลัมน์ของ view ให้อัตโนมัติเมื่อตารางต้นทางเปลี่ยน ต้อง drop แล้วสร้างใหม่เท่านั้น
-- ผลคือทุก query จาก v_competitions พัง 400 (42703: column v_competitions.cover_url
-- does not exist) แล้วโค้ดฝั่งเว็บ (lib/data.ts) จะ fallback ไปใช้ข้อมูลตัวอย่างในโค้ดแทนเงียบ ๆ
--
-- รันไฟล์นี้ครั้งเดียวใน Supabase SQL Editor ของโปรเจกต์ที่ใช้งานจริง

drop view if exists v_competitions;

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

-- ตรวจผล: ต้องเห็นคอลัมน์ cover_url ในผลลัพธ์ และไม่มี error
-- select id, name, cover_url from v_competitions;
