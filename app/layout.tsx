import type { Metadata } from 'next';
import { IBM_Plex_Sans_Thai, Anuphan } from 'next/font/google';
import Link from 'next/link';
import { AuthNav } from '@/components/AuthNav';
import './globals.css';

const body = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const display = Anuphan({
  subsets: ['thai', 'latin'],
  weight: ['500', '600'],
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
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
            <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm text-white">P</span>
              P.A.N.I.C.
            </Link>
            <nav className="ml-auto flex items-center gap-1 text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-lg px-3 py-1.5 text-muted hover:bg-brand-light hover:text-brand-deep"
                >
                  {n.label}
                </Link>
              ))}
              <AuthNav />
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>

        <footer className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-muted">
            <p className="max-w-prose">
              โครงงานทุกเรื่องในคลังนี้เป็นไอเดียตั้งต้น ไม่ใช่ผลงานสำเร็จรูป ทุกหน้ามีหัวข้อ
              “จุดที่ควรต่อยอดให้เป็นของตัวเอง” เพราะสิ่งที่กรรมการให้คะแนนคือส่วนที่คุณคิดเพิ่ม
              ไม่ใช่ส่วนที่ทำตาม
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
