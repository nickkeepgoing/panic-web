'use client';

import { useRef, useState } from 'react';

type RowIssue = { row: number; field?: string; message: string };
type RowResult = { row: number; slug: string; title: string; status: 'inserted' | 'updated' };
type ImportResponse = {
  total: number;
  inserted: number;
  updated: number;
  failed: RowIssue[];
  warnings: RowIssue[];
  rows: RowResult[];
  error?: string;
};

export function ImportProjectsForm() {
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    const text = await file.text();
    setCsvText(text);
    setResult(null);
    setError('');
  }

  async function submit() {
    if (!csvText.trim()) {
      setError('ยังไม่มีข้อมูล — วางข้อความ CSV หรือเลือกไฟล์ก่อน');
      return;
    }
    setBusy(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/admin/import-projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ csv_text: csvText }),
      });
      const data = (await res.json()) as ImportResponse;
      if (!res.ok) {
        setError(data.error ?? 'นำเข้าไม่สำเร็จ ลองใหม่อีกครั้ง');
        return;
      }
      setResult(data);
    } catch {
      setError('ติดต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line bg-surface p-8 text-center hover:border-brand">
          <span className="font-display font-semibold text-ink">
            {fileName || 'เลือกไฟล์ CSV'}
          </span>
          <span className="text-sm text-muted">ไฟล์จาก Excel หรือ Google Sheets (Export เป็น .csv)</span>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-muted">หรือวางข้อความ CSV ตรงนี้</span>
          <textarea
            value={csvText}
            onChange={(e) => { setCsvText(e.target.value); setFileName(''); setResult(null); setError(''); }}
            rows={8}
            className="w-full flex-1 rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-ink outline-none focus:border-brand"
            placeholder="title,category,purpose_md,extension_md,...&#10;เครื่องทำน้ำอุ่นพลังแดด,สิ่งแวดล้อม,..."
          />
        </div>
      </div>

      {error && <p className="rounded-lg border border-alert/30 bg-alert/5 px-4 py-3 text-sm text-alert">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="w-fit rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-deep disabled:opacity-60"
      >
        {busy ? 'กำลังนำเข้า…' : 'นำเข้าโครงงาน'}
      </button>

      {result && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            <Stat label="ทั้งหมด" value={result.total} tone="neutral" />
            <Stat label="เพิ่มใหม่" value={result.inserted} tone="good" />
            <Stat label="แก้ของเดิม" value={result.updated} tone="good" />
            <Stat label="ข้ามไป" value={result.failed.length} tone={result.failed.length > 0 ? 'bad' : 'neutral'} />
          </div>

          {result.failed.length > 0 && (
            <IssueList title="แถวที่ข้ามไป (ต้องแก้แล้วนำเข้าใหม่)" issues={result.failed} tone="bad" />
          )}
          {result.warnings.length > 0 && (
            <IssueList title="คำเตือน (นำเข้าแล้ว แต่ควรกลับไปเติมข้อมูล)" issues={result.warnings} tone="warn" />
          )}

          {result.rows.length > 0 && (
            <div className="overflow-hidden rounded-card border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-ground text-muted">
                  <tr>
                    <th className="px-4 py-2 font-normal">แถว</th>
                    <th className="px-4 py-2 font-normal">ชื่อโครงงาน</th>
                    <th className="px-4 py-2 font-normal">slug</th>
                    <th className="px-4 py-2 font-normal">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {result.rows.map((r) => (
                    <tr key={r.row}>
                      <td className="px-4 py-2 text-muted">{r.row}</td>
                      <td className="px-4 py-2 text-ink">{r.title}</td>
                      <td className="px-4 py-2 text-muted">{r.slug}</td>
                      <td className="px-4 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${
                          r.status === 'inserted' ? 'bg-envi/10 text-envi' : 'bg-tech/10 text-tech'
                        }`}>
                          {r.status === 'inserted' ? 'เพิ่มใหม่' : 'แก้ของเดิม'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: 'neutral' | 'good' | 'bad' }) {
  const color = tone === 'good' ? 'text-envi' : tone === 'bad' ? 'text-alert' : 'text-ink';
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function IssueList({ title, issues, tone }: { title: string; issues: RowIssue[]; tone: 'bad' | 'warn' }) {
  const style = tone === 'bad' ? 'border-alert/30 bg-alert/5' : 'border-engr/30 bg-engr/5';
  const textColor = tone === 'bad' ? 'text-alert' : 'text-engr';
  return (
    <div className={`rounded-card border p-4 ${style}`}>
      <h3 className={`font-display font-semibold ${textColor}`}>{title}</h3>
      <ul className="mt-2 flex flex-col gap-1 text-sm text-ink">
        {issues.map((issue, i) => (
          <li key={i}>
            <span className="text-muted">แถว {issue.row}:</span> {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
