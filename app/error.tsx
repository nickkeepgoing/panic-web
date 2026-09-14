'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * ถ้าไม่มีไฟล์นี้ ข้อผิดพลาดฝั่งเซิร์ฟเวอร์จะกลายเป็นหน้าขาว
 * "Application error: a server-side exception has occurred" ซึ่งผู้ใช้ทำอะไรต่อไม่ได้เลย
 * หน้านี้อย่างน้อยบอกว่าเกิดอะไรขึ้นและให้กดลองใหม่ได้
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[error boundary]', error);
  }, [error]);

  return (
    <div className="rounded-card border-2 border-dashed border-line bg-surface p-10 text-center">
      <p className="font-display text-lg text-ink">หน้านี้โหลดไม่สำเร็จ</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">
        ส่วนใหญ่เป็นเพราะต่อฐานข้อมูลไม่ติดชั่วคราว ลองกดโหลดใหม่อีกครั้ง ถ้ายังไม่หายให้แจ้งผู้ดูแลพร้อมรหัสด้านล่าง
      </p>
      {error.digest && <p className="mt-3 font-mono text-xs text-muted">รหัสอ้างอิง: {error.digest}</p>}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          onClick={reset}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
        >
          ลองใหม่
        </button>
        <Link href="/projects" className="rounded-lg border border-line px-5 py-2.5 text-sm text-muted hover:border-brand hover:text-brand-deep">
          กลับไปคลังโครงงาน
        </Link>
      </div>
    </div>
  );
}
