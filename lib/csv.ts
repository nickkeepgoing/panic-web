/**
 * ตัวแปลง CSV แบบไม่พึ่ง library ภายนอก
 * รองรับเซลล์ที่มีจุลภาค ขึ้นบรรทัดใหม่ในเซลล์ (ถ้าอยู่ในเครื่องหมายคำพูด) และ BOM
 * ที่ Excel / Google Sheets ใส่มาให้เวลา export
 */
export function parseCsv(text: string): string[][] {
  // ตัด BOM ที่ Excel แปะไว้หน้าไฟล์เสมอ ถ้าไม่ตัดคอลัมน์แรกจะอ่านชื่อผิด
  const clean = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];

    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') { inQuotes = true; continue; }
    if (ch === ',') { row.push(field); field = ''; continue; }
    if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }
    field += ch;
  }

  // แถวสุดท้ายไม่มี \n ปิดท้าย ต้องเก็บด้วยมือ
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // ตัดแถวว่างล้วน (บรรทัดว่างท้ายไฟล์ที่ export มาบ่อย ๆ)
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

export function csvToObjects(text: string): { header: string[]; records: Record<string, string>[] } {
  const rows = parseCsv(text);
  if (rows.length === 0) return { header: [], records: [] };

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const records = rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((key, i) => { obj[key] = (r[i] ?? '').trim(); });
    return obj;
  });

  return { header, records };
}
