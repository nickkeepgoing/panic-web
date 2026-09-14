'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { hasSupabase } from '@/lib/supabase/config';
import { browserClient } from '@/lib/supabase/browser';
import { NAV } from '@/lib/nav';

type Auth = { signedIn: boolean; admin: boolean };

/**
 * หัวเว็บทั้งแถบรวมอยู่ในคอมโพเนนต์เดียว
 *
 * เดิมแยกเป็น NavMenu กับ AuthNav ซึ่งทำให้เกิดสองปัญหาพร้อมกัน
 *  1. AuthNav โชว์ "ผู้ดูแล / ของฉัน / ออกจากระบบ" ทุกขนาดจอ ไม่มี breakpoint กั้น
 *     บนมือถือแถบจึงยาวเกินและตัวหนังสือถูกบีบจนขึ้นบรรทัดใหม่
 *  2. เมนูของ NavMenu วางแบบ absolute top-12 ซึ่งอิงกับกล่องปุ่มสูง 44px
 *     พอหัวเว็บถูกดันเป็นสองบรรทัด ระยะคงที่นั้นก็ไปตกทับโลโก้
 *
 * รอบนี้เมนูมือถือเป็นบล็อกที่อยู่ "ใต้แถวโลโก้" ในสายงานปกติ ไม่ใช่ absolute
 * จึงไม่มีทางทับโลโก้ได้เลยไม่ว่าหัวเว็บจะสูงเท่าไร และไม่ต้องแข่ง z-index กับใคร
 * (หัวเว็บมี backdrop-blur ซึ่งทำให้ลูกที่เป็น fixed ถูกจำกัดกรอบไว้ในหัวเว็บ
 *  การวางเมนูแบบ overlay ลอยจึงยิ่งเปราะ)
 */
export function SiteNav() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!hasSupabase) { setAuth({ signedIn: false, admin: false }); return; }
    let alive = true;
    (async () => {
      const sb = browserClient();
      const { data: user } = await sb.auth.getUser();
      if (!alive) return;
      if (!user.user) { setAuth({ signedIn: false, admin: false }); return; }
      const { data } = await sb.from('profiles').select('role').eq('id', user.user.id).maybeSingle();
      if (alive) setAuth({ signedIn: true, admin: data?.role === 'editor' || data?.role === 'super_admin' });
    })();
    return () => { alive = false; };
  }, []);

  // ย้ายหน้าแล้วต้องพับเมนูเอง ไม่งั้นเมนูค้างเปิดคาหน้าใหม่
  useEffect(() => { setOpen(false); }, [pathname]);

  // ปิดเมนูเมื่อ: กด Escape (แล้วส่งโฟกัสกลับที่ปุ่ม ไม่ปล่อยโฟกัสลอยในบล็อกที่หายไป),
  // แตะนอกหัวเว็บ, หรือจอขยายจนถึงช่วงที่เมนูเต็มแถบทำงานแทนแล้ว
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = () => { if (wide.matches) setOpen(false); };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl px-5">
      <div className="flex items-center gap-3 py-3 lg:gap-5">
        {/* shrink-0 + whitespace-nowrap กันชื่อแบรนด์ถูกบีบจนขึ้นบรรทัดใหม่ */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-lg font-bold tracking-tight text-ink"
        >
          <span className="flex h-8 items-center gap-px rounded-md px-1.5" aria-hidden>
            <i className="h-4 w-1 rounded-sm bg-sci" />
            <i className="h-5 w-1 rounded-sm bg-tech" />
            <i className="h-6 w-1 rounded-sm bg-engr" />
            <i className="h-5 w-1 rounded-sm bg-envi" />
            <i className="h-4 w-1 rounded-sm bg-soci" />
          </span>
          P.A.N.I.C.
        </Link>

        {/* ── จอกว้าง: วางเรียงในแถบเลย ──
            เปิดที่ lg (1024px) ไม่ใช่ sm/md เพราะกรณีผู้ดูแลซึ่งมีลิงก์หกรายการ
            ต้องใช้ความกว้าง 696px เมื่อวัดจากฟอนต์จริง ที่ 768px จึงเหลือช่องว่างแค่ 32px
            ซึ่งไม่พอรับแถบเลื่อนของเบราว์เซอร์เดสก์ท็อปหรือฟอนต์สำรองช่วงกำลังโหลด
            ช่วงแท็บเล็ตจึงใช้ปุ่มแฮมเบอร์เกอร์แทน ไม่ปล่อยให้ตัวหนังสือถูกบีบจนขึ้นบรรทัดใหม่ */}
        <nav className="ml-auto hidden items-center gap-1 text-sm lg:flex" aria-label="เมนูหลัก">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={pathname === n.href ? 'page' : undefined}
              className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-lg px-3 transition-colors duration-200 hover:bg-brand-light hover:text-brand-deep ${
                pathname === n.href ? 'font-medium text-brand-deep' : 'text-muted'
              }`}
            >
              {n.label}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px shrink-0 bg-line" aria-hidden />
          <AccountLinks auth={auth} />
        </nav>

        {/* ── จอแคบ: ปุ่มเข้าสู่ระบบกับปุ่มแฮมเบอร์เกอร์เท่านั้น ──
            วัดจากฟอนต์จริงที่เว็บใช้: โลโก้ 117.5px + ปุ่มเข้าสู่ระบบ 90.2px + ปุ่มเมนู 44px
            กับช่องไฟอีก 20px รวมเป็น 272px ขณะที่จอ 320px เหลือที่ให้แค่ 280px
            เหลือ 8px ซึ่งน้อยเกินกว่าจะวางใจ เพราะฟอนต์ถูกโหลดแบบ swap
            ช่วงที่ยังใช้ฟอนต์สำรองอยู่ตัวอักษรจะกว้างกว่านี้และดันจนจอเลื่อนแนวนอนได้
            ต่ำกว่า 360px จึงย้ายปุ่มเข้าสู่ระบบลงไปอยู่ในเมนูแทน */}
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
          {auth === null ? (
            <span className="hidden h-11 w-[5.25rem] min-[360px]:block" aria-hidden />
          ) : auth.signedIn ? null : (
            <Link
              href="/login"
              className="hidden min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-deep min-[360px]:inline-flex"
            >
              เข้าสู่ระบบ
            </Link>
          )}

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-brand-light hover:text-brand-deep"
            aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={open}
            aria-controls={panelId}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
            </svg>
          </button>
        </div>
      </div>

      {/* เมนูมือถืออยู่ใต้แถวโลโก้ในสายงานปกติ เปิดแล้วดันเนื้อหาลง ไม่ลอยไปทับอะไร
          จำกัดความสูงไว้เผื่อจอเตี้ย (มือถือแนวนอน) ให้เลื่อนในกล่องแทนที่จะล้นออกนอกจอ */}
      {open && (
        <div
          id={panelId}
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-line pb-3 lg:hidden"
        >
          <nav className="flex flex-col py-1" aria-label="เมนูหลัก">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === n.href ? 'page' : undefined}
                className={`flex min-h-[48px] items-center rounded-lg px-3 text-sm transition-colors duration-200 hover:bg-brand-light hover:text-brand-deep ${
                  pathname === n.href ? 'font-medium text-brand-deep' : 'text-muted'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {auth?.signedIn ? (
            <div className="flex flex-col border-t border-line pt-1">
              <AccountLinks auth={auth} stacked onNavigate={() => setOpen(false)} />
            </div>
          ) : (
            // คู่กับปุ่มในแถบด้านบน: แสดงเฉพาะตอนที่จอแคบจนปุ่มนั้นถูกซ่อน
            auth !== null && (
              <div className="border-t border-line pt-3 min-[360px]:hidden">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-deep"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ลิงก์ฝั่งบัญชี ใช้ชุดเดียวกันทั้งแถบจอกว้างและเมนูมือถือ
 * stacked = เรียงลงเป็นแถว ๆ สำหรับเมนูมือถือ
 */
function AccountLinks({
  auth,
  stacked = false,
  onNavigate,
}: {
  auth: Auth | null;
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  // จองพื้นที่เท่าปุ่มจริงระหว่างรอสถานะล็อกอิน กันหัวเว็บกระตุกตอนโหลดเสร็จ
  if (auth === null) return <span className="block h-11 w-24" aria-hidden />;

  const item = stacked
    ? 'flex min-h-[48px] w-full items-center rounded-lg px-3 text-sm text-muted transition-colors duration-200 hover:bg-brand-light hover:text-brand-deep'
    : 'inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-lg px-3 text-sm text-muted transition-colors duration-200 hover:bg-brand-light hover:text-brand-deep';

  if (!auth.signedIn) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-deep"
      >
        เข้าสู่ระบบ
      </Link>
    );
  }

  return (
    <>
      {auth.admin && <Link href="/admin" onClick={onNavigate} className={item}>ผู้ดูแล</Link>}
      <Link href="/me" onClick={onNavigate} className={item}>ของฉัน</Link>
      <form action="/auth/signout" method="post" className={stacked ? 'w-full' : undefined}>
        <button type="submit" className={item}>ออกจากระบบ</button>
      </form>
    </>
  );
}
