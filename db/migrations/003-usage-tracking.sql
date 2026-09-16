-- migration 003: atomic counters for view/save tracking
-- เรียก rpc('increment_view_count', { pid }) จาก server component เพื่อนับการดู
-- เรียก rpc('adjust_save_count', { pid, delta }) จาก /api/save เพื่อนับการบันทึก

create or replace function increment_view_count(pid uuid)
returns void language sql security definer set search_path = public as $$
  update projects set view_count = view_count + 1 where id = pid and status = 'published';
$$;

create or replace function adjust_save_count(pid uuid, delta int)
returns void language sql security definer set search_path = public as $$
  update projects set save_count = greatest(0, save_count + delta) where id = pid;
$$;

grant execute on function increment_view_count(uuid) to anon, authenticated;
grant execute on function adjust_save_count(uuid, integer) to authenticated;
