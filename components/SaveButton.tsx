'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasSupabase } from '@/lib/supabase/config';
import { browserClient } from '@/lib/supabase/browser';

// ดึงสถานะฝั่ง client เพื่อให้หน้ารายละเอียดยังเป็น static ได้ (เร็วและ SEO ดี)
export function SaveButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasSupabase) return;
    let alive = true;
    (async () => {
      const sb = browserClient();
      const { data: auth } = await sb.auth.getUser();
      if (!alive || !auth.user) return;
      setSignedIn(true);
      const { data } = await sb
        .from('saved_projects')
        .select('project_id')
        .eq('user_id', auth.user.id)
        .eq('project_id', projectId)
        .maybeSingle();
      if (alive) setSaved(Boolean(data));
    })();
    return () => { alive = false; };
  }, [projectId]);

  async function toggle() {
    if (!hasSupabase) {
      setError('ยังไม่ได้ต่อฐานข้อมูล — ดูขั้นตอนใน DEPLOY.md');
      return;
    }
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setBusy(true);
    setError('');
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ projectId, action: saved ? 'remove' : 'save' }),
    });
    setBusy(false);
    if (!res.ok) {
      setError('บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง');
      return;
    }
    setSaved(!saved);
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`w-fit rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60 ${
          saved ? 'border border-brand text-brand-deep hover:bg-brand-light' : 'bg-brand text-white hover:bg-brand-deep'
        }`}
      >
        {saved ? 'บันทึกไว้แล้ว — เอาออก' : signedIn ? 'บันทึกไว้ดูทีหลัง' : 'เข้าสู่ระบบเพื่อบันทึก'}
      </button>
      {error && <p className="text-sm text-alert">{error}</p>}
    </div>
  );
}
