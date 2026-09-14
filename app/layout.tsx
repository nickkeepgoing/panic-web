import type { Metadata } from 'next';
import { IBM_Plex_Sans_Thai, Bai_Jamjuree } from 'next/font/google';
import Link from 'next/link';
import { AuthNav } from '@/components/AuthNav';
import { NavMenu } from '@/components/NavMenu';
import './globals.css';

const body = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const display = Bai_Jamjuree({
  subsets: ['thai', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'P.A.N.I.C. — คลังไอเดียโครงงานวิทยาศาสตร์',
  description:
    'คลังไอเดียโครงงานวิทยาศาสตร์และเทคโนโลยีสำหรับนักเรียน ป.4–ม.6 พร้อมวิธีทำ งบประมาณ ระยะเวลา และปฏิทินกิจกรรมที่เปิดรับสมัครจริง',
};

const NAV = [
  { href: '/projects', label: 'คลังโครงงาน' },
  { href: '/quiz', label: 'แบบทดสอบ' },
  { href: '/calendar', label: 'ปฏิทินกิจกรรม' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${body.variable} ${display.variable}`}>
      <body className="font-sans">
        {/* หัวเว็บเป็น sticky และมีลิงก์หลายตัว คนที่ใช้คีย์บอร์ดจึงต้องกด Tab ผ่านทุกครั้ง
            ลิงก์ข้ามนี้ซ่อนอยู่จนกว่าจะถูกโฟกัส แล้วพาไปที่เนื้อหาหลักทันที */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2.5 focus:font-medium focus:text-white"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>

        <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-3">
            <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-ink">
              <span className="flex h-8 items-center gap-px rounded-md px-1.5" aria-hidden>
                <i className="h-4 w-1 rounded-sm bg-sci" />
                <i className="h-5 w-1 rounded-sm bg-tech" />
                <i className="h-6 w-1 rounded-sm bg-engr" />
                <i className="h-5 w-1 rounded-sm bg-envi" />
                <i className="h-4 w-1 rounded-sm bg-soci" />
              </span>
              P.A.N.I.C.
            </Link>
            <nav className="ml-auto flex items-center gap-1 text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="hidden min-h-[44px] items-center rounded-lg px-3 text-muted transition-colors duration-200 hover:bg-brand-light hover:text-brand-deep sm:inline-flex"
                >
                  {n.label}
                </Link>
              ))}
              <NavMenu />
              <AuthNav />
            </nav>
          </div>
        </header>

        <main id="content" className="mx-auto max-w-6xl px-5 py-10">{children}</main>

        <footer className="mt-16 border-t border-line bg-surface">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:gap-10">
            <p className="max-w-md text-sm text-muted">
              โครงงานทุกเรื่องที่นี่เป็นไอเดียตั้งต้น ไม่ใช่ผลงานสำเร็จรูป ทุกหน้าจึงมีหัวข้อ
              &ldquo;จุดที่ควรต่อยอดให้เป็นของตัวเอง&rdquo; เพราะสิ่งที่กรรมการให้คะแนนคือส่วนที่คุณคิดเพิ่ม
            </p>
            <nav className="flex flex-col gap-1 text-sm sm:ml-auto">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="inline-flex min-h-[44px] items-center text-muted transition-colors duration-200 hover:text-brand-deep">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
