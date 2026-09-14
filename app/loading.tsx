/**
 * แถบโหลดหน้า — Next แสดงคอมโพเนนต์นี้ให้เองตอนเปลี่ยนหน้าแล้ว server component
 * ปลายทางยังดึงข้อมูลไม่เสร็จ (Suspense streaming) จึงไม่ต้องผูก event นำทางเอง
 * แถบบาง ๆ ค้างบนสุดจอ สไลด์ไปมาจนกว่าหน้าใหม่จะพร้อม
 */
export default function Loading() {
  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-brand-light"
      role="status"
      aria-label="กำลังโหลดหน้า"
    >
      <div className="h-full w-1/4 rounded-full bg-brand animate-[loadingbar_1.1s_ease-in-out_infinite]" />
      <span className="sr-only">กำลังโหลดหน้า…</span>
    </div>
  );
}
