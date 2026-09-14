'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * เมนูหน้าผู้ดูแล — แยกเป็น client component เพราะต้องรู้ path ปัจจุบัน (usePathname)
 * เพื่อไฮไลต์เมนูที่กำลังอยู่ จอแคบเลื่อนแนวนอนแทนที่จะตัดขึ้นบรรทัดใหม่
 * ป้ายชื่อผู้ใช้จึงไม่ถูกดันจนเมนูเสียรูป
 */
export function AdminNav({
  items,
  identity,
}: {
  items: readonly { href: string; label: string }[];
  identity: string;
}) {
  const pathname = usePathname();
  // '/admin' ต้องตรงเป๊ะ ไม่งั้นมันจะ active ทุกหน้า ที่เหลือ active เมื่อ path ขึ้นต้นด้วยลิงก์นั้น
  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  return (
    <div className="flex flex-col gap-3 border-b border-line pb-3 sm:flex-row sm:items-center sm:gap-4">
      <nav
        aria-label="เมนูผู้ดูแล"
        className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((n) => {
          const active = isActive(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-lg px-3.5 text-sm transition-colors duration-200 ${
                active
                  ? 'bg-brand-light font-medium text-brand-deep'
                  : 'text-muted hover:bg-brand-light/60 hover:text-brand-deep'
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <span className="shrink-0 whitespace-nowrap text-xs text-muted sm:ml-auto">{identity}</span>
    </div>
  );
}
