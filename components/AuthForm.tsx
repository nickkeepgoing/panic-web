'use client';

import { useState } from 'react';
import { browserClient } from '@/lib/supabase/browser';

type Mode = 'signin' | 'signup';

export function AuthForm({ next }: { next?: string }) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function submit() {
    setError('');
    setNotice('');

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('กรอกอีเมลให้ถูกรูปแบบก่อน');
      return;
    }
    if (password.length < 8) {
      setError('รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }
    if (mode === 'signup' && displayName.trim().length < 2) {
      setError('ใส่ชื่อที่จะให้แสดงในเว็บอย่างน้อย 2 ตัวอักษร');
      return;
    }

    setBusy(true);
    const sb = browserClient();

    if (mode === 'signup') {
      const { data, error } = await sb.auth.signUp({ email, password });
      setBusy(false);
      if (error) {
        setError(
          error.message.includes('already registered')
            ? 'อีเมลนี้สมัครไว้แล้ว กดสลับไปเข้าสู่ระบบได้เลย'
            : 'สมัครไม่สำเร็จ ลองใหม่อีกครั้ง',
        );
        return;
      }
      if (!data.session) {
        setNotice('สมัครแล้ว รอยืนยันทางอีเมลก่อนจึงจะเข้าใช้งานได้');
        return;
      }
      await sb.from('profiles').upsert({ id: data.session.user.id, display_name: displayName.trim() });
      // Hard reload so AuthNav and all server components reflect new session
      window.location.href = next ?? '/me';
      return;
    }

    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      return;
    }
    window.location.href = next ?? '/me';
  }

  const field = 'w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-ink outline-none focus:border-brand';

  return (
    <div className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6">
      <div className="flex gap-1 rounded-lg bg-ground p-1 text-sm">
        {(['signin', 'signup'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(''); setNotice(''); }}
            className={`flex-1 rounded-md px-3 py-2 font-medium ${
              mode === m ? 'bg-brand text-white' : 'text-muted hover:text-brand-deep'
            }`}
          >
            {m === 'signin' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        ))}
      </div>

      {mode === 'signup' && (
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">ชื่อที่จะให้แสดงในเว็บ</span>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={field} placeholder="เช่น นิค" />
        </label>
      )}

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">อีเมล</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          placeholder="you@school.ac.th"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">รหัสผ่าน</span>
        <input
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className={field}
          placeholder="อย่างน้อย 8 ตัวอักษร"
        />
      </label>

      {error && <p className="text-sm text-alert">{error}</p>}
      {notice && <p className="text-sm text-brand-deep">{notice}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="rounded-lg bg-brand px-5 py-3 font-medium text-white hover:bg-brand-deep disabled:opacity-60"
      >
        {busy ? 'กำลังดำเนินการ…' : mode === 'signin' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
      </button>
    </div>
  );
}
