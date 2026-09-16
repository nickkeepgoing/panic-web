import type { Metadata } from 'next';
import { IBM_Plex_Sans_Thai, Bai_Jamjuree } from 'next/font/google';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NAV } from '@/lib/nav';
import { getSiteSettings } from '@/lib/site-settings';
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="th" className={`${body.variable} ${display.variable} dark`}>
      <head>
        {/* ป้องกัน flash of wrong theme: รันก่อน paint */}
        <script dangerouslySetInnerHTML={{ __html:
          `try{var t=localStorage.getItem('panic_theme');` +
          `document.documentElement.classList.toggle('dark',t?t==='dark':true)}` +
          `catch(e){document.documentElement.classList.add('dark')}`
        }} />
      </head>
      <body className="font-sans">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2.5 focus:font-medium focus:text-white"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>

        <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
          <SiteNav />
        </header>

        <main id="content" className="mx-auto max-w-6xl px-5 py-10">{children}</main>

        <footer className="mt-16 border-t border-line bg-surface">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:gap-10">
            <div className="flex max-w-md flex-col gap-2">
              <p className="text-sm text-muted">
                {settings.footer_tagline}
              </p>
              {settings.footer_author && (
                <p className="text-xs text-muted">
                  จัดทำโดย <span className="font-medium text-ink">{settings.footer_author}</span>
                  {settings.footer_school && ` · ${settings.footer_school}`}
                </p>
              )}
              {settings.footer_powered_by && (
                <p className="text-xs text-muted">
                  Powered by <span className="font-medium text-ink">{settings.footer_powered_by}</span>
                </p>
              )}
            </div>
            <nav className="flex flex-col gap-1 text-sm sm:ml-auto">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="inline-flex min-h-[44px] items-center text-muted transition-colors duration-200 hover:text-brand-deep"
                >
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
