'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/projects', label: 'คลังโครงงาน' },
  { href: '/quiz', label: 'แบบทดสอบ' },
  { href: '/calendar', label: 'ปฏิทินกิจกรรม' },
];

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-brand-light hover:text-brand-deep"
        aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 3l12 12M15 3L3 15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 4h14M2 9h14M2 14h14" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <nav className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-card border border-line bg-surface shadow-lift">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="block px-4 py-3 text-sm text-muted hover:bg-brand-light hover:text-brand-deep"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
