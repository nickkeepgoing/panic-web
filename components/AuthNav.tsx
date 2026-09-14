'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { hasSupabase } from '@/lib/supabase/config';
import { browserClient } from '@/lib/supabase/browser';

export function AuthNav() {
  const [state, setState] = useState<{ signedIn: boolean; admin: boolean } | null>(null);

  useEffect(() => {
    if (!hasSupabase) { setState({ signedIn: false, admin: false }); return; }
    let alive = true;
    (async () => {
      const sb = browserClient();
      const { data: auth } = await sb.auth.getUser();
      if (!alive) return;
      if (!auth.user) { setState({ signedIn: false, admin: false }); return; }
      const { data } = await sb.from('profiles').select('role').eq('id', auth.user.id).maybeSingle();
      if (alive) setState({ signedIn: true, admin: data?.role === 'editor' || data?.role === 'super_admin' });
    })();
    return () => { alive = false; };
  }, []);

  if (!state) return <span className="block h-11 w-24" aria-hidden />;

  if (!state.signedIn) {
    return (
      <Link href="/login" className="inline-flex min-h-[44px] items-center rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-deep">
        เข้าสู่ระบบ
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-1">
      {state.admin && (
        <Link href="/admin" className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm text-muted transition-colors duration-200 hover:bg-brand-light hover:text-brand-deep">
          ผู้ดูแล
        </Link>
      )}
      <Link href="/me" className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm text-muted transition-colors duration-200 hover:bg-brand-light hover:text-brand-deep">
        ของฉัน
      </Link>
      <form action="/auth/signout" method="post">
        <button className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm text-muted transition-colors duration-200 hover:text-brand-deep">ออกจากระบบ</button>
      </form>
    </span>
  );
}
