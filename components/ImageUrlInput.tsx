'use client';

import { useState } from 'react';

export function ImageUrlInput({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [broken, setBroken] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        type="url"
        value={url}
        onChange={(e) => { setUrl(e.target.value); setBroken(false); }}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-ink outline-none focus:border-brand"
        placeholder={placeholder ?? 'https://...'}
      />
      {url && !broken && (
        <div className="overflow-hidden rounded-lg border border-line bg-ground">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="ตัวอย่างรูปภาพ"
            className="h-48 w-full object-cover"
            onError={() => setBroken(true)}
          />
        </div>
      )}
      {url && broken && (
        <p className="rounded-lg border border-alert/30 bg-alert/5 px-3 py-2 text-sm text-alert">
          โหลดรูปไม่สำเร็จ — ตรวจสอบ URL อีกครั้ง
        </p>
      )}
    </div>
  );
}
