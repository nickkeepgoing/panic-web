'use client';

import { useState } from 'react';
import { browserClient } from '@/lib/supabase/browser';

function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('rate limit') || m.includes('too many') || m.includes('after')) {
    return 'ส่งอีเมลถึงขีดจำกัดแล้ว กรุณารอสักครู่แล้วลองใหม่';
  }
  if (m.includes('invalid') && m.includes('redirect')) {
    return 'Redirect URL ไม่ได้อยู่ในรายการที่อนุญาตใน Supabase — ตรวจสอบ Authentication → URL Configuration';
  }
  if (m.includes('email') && m.includes('not confirmed')) {
    return 'อีเมลนี้ยังไม่ได้ยืนยัน กรุณาตรวจสอบกล่องจดหมาย';
  }
  if (m.includes('signup') && m.includes('disabled')) {
    return 'ระบบปิดการสมัครสมาชิกชั่วคราว';
  }
  return `ส่งลิงก์ไม่สำเร็จ: ${msg}`;
}

export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function send() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('กรอกอีเมลให้ถูกรูปแบบก่อน');
      return;
    }
    setError('');
    setState('sending');
    try {
      const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next ?? '/me')}`;
      const { error } = await browserClient().auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirect },
      });
      if (error) {
        setError(friendlyError(error.message));
        setState('idle');
        return;
      }
      setState('sent');
    } catch (e) {
      setError('เชื่อมต่อไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่');
      setState('idle');
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-card border border-brand bg-brand-light/40 p-5">
        <p className="text-ink">ส่งลิงก์เข้าสู่ระบบไปที่ {email} แล้ว</p>
        <p className="mt-1 text-sm text-muted">เปิดอีเมลแล้วกดลิงก์ในนั้น ลิงก์ใช้ได้ครั้งเดียวและหมดอายุใน 1 ชั่วโมง</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">อีเมล</span>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="you@school.ac.th"
          className="rounded-lg border border-line bg-white px-3 py-2 text-ink outline-none focus:border-brand"
        />
      </label>
      {error && <p className="text-sm text-alert">{error}</p>}
      <button
        type="button"
        onClick={send}
        disabled={state === 'sending'}
        className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep disabled:opacity-60"
      >
        {state === 'sending' ? 'กำลังส่ง…' : 'ส่งลิงก์เข้าสู่ระบบ'}
      </button>
      <p className="text-xs text-muted">
        ไม่ต้องตั้งรหัสผ่าน เราส่งลิงก์ไปที่อีเมลให้กดเข้าใช้งาน จึงไม่มีรหัสผ่านให้รั่วไหล
      </p>
    </div>
  );
}
