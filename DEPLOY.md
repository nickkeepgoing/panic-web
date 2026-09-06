# วิธี deploy ขึ้นใช้งานจริง

ทั้งหมดใช้เวลาประมาณ 40 นาที ค่าใช้จ่ายช่วงแรก 0 บาท ยกเว้นค่าโดเมน
ทำตามลำดับ อย่าข้ามขั้น เพราะขั้น 3 ต้องใช้ค่าจากขั้น 1

---

## 1. สร้างฐานข้อมูลบน Supabase

1. สมัครที่ supabase.com แล้วกด **New project**
2. ตั้งค่า:
   - **Name**: `panic-web`
   - **Database password**: กดสุ่มแล้ว **เก็บไว้ในที่ปลอดภัย** ใช้ตอนตั้ง backup
   - **Region**: `Southeast Asia (Singapore)` — ใกล้ไทยที่สุด หน่วงประมาณ 30 ms
3. รอสร้างเสร็จประมาณ 2 นาที
4. เปิด **SQL Editor** → **New query** → วางเนื้อหาไฟล์ `db/schema.sql` ทั้งไฟล์ → **Run**
5. เปิด query ใหม่ → วาง `db/seed.sql` → **Run**
6. ไปที่ **Table Editor** ตรวจว่ามีตาราง `projects`, `competitions`, `quiz_questions` และมีข้อมูลอยู่

> ถ้าขั้น 4 ขึ้น error เรื่อง `extension "vector"` ให้ไปที่ Database → Extensions
> แล้วเปิด `vector`, `pg_trgm`, `pg_cron` ด้วยมือก่อน แล้วรัน schema ใหม่

### ตั้งค่า Auth

1. **Authentication → Providers** → เปิด **Email** ไว้ ปิด **Confirm email** ไม่ได้ ให้เปิดไว้ตามเดิม
2. **Authentication → URL Configuration**
   - **Site URL**: ตอนนี้ใส่ `http://localhost:3000` ไปก่อน แล้วกลับมาแก้หลัง deploy
   - **Redirect URLs**: เพิ่ม `http://localhost:3000/auth/callback`

### สร้าง Storage bucket สำหรับไฟล์แนบ

**Storage → New bucket** → ชื่อ `documents` → **Private** (ห้าม public เพราะเป็นไฟล์รูปเล่มที่มีลิขสิทธิ์)

---

## 2. รันในเครื่องให้ผ่านก่อน

```bash
npm install
cp .env.example .env.local
```

เปิด `.env.local` แล้วเติมค่าจาก Supabase → **Project Settings → API**

| ตัวแปร | เอามาจาก |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key — **ห้ามใส่ในโค้ดฝั่งหน้าเว็บ** |

```bash
npm run dev
```

เปิด http://localhost:3000 แล้วลองครบทุกอย่าง: ทำแบบทดสอบ, เข้าสู่ระบบ, กดบันทึกโครงงาน

### ตั้งตัวเองเป็นแอดมิน

หลังเข้าสู่ระบบครั้งแรก ไปที่ Supabase → **SQL Editor** แล้วรัน (แก้อีเมลเป็นของคุณ):

```sql
update profiles set role = 'super_admin'
where id = (select id from auth.users where email = 'you@example.com');
```

รีเฟรชหน้าเว็บ จะเห็นเมนู "ผู้ดูแล" โผล่มา

> ไม่มีหน้าสมัครเป็นแอดมินโดยตั้งใจ — ถ้าใครกดสมัครเป็นแอดมินเองได้คือช่องโหว่
> การเพิ่มแอดมินคนต่อไปต้องให้ super admin แก้ `role` ในตาราง `profiles` ให้เป็น `editor`

---

## 3. ขึ้น Vercel

1. push โค้ดขึ้น GitHub (repo ตั้งเป็น private ก็ได้)
   ```bash
   git init && git add . && git commit -m "first deploy"
   git remote add origin https://github.com/<ชื่อคุณ>/panic-web.git
   git push -u origin main
   ```
2. ไปที่ vercel.com → **Add New → Project** → เลือก repo นี้
3. ส่วน **Environment Variables** ใส่ให้ครบ **4 ตัว** (ค่าเดียวกับ `.env.local`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY` (ถ้ามี — ไม่ใส่ระบบก็ทำงาน แค่เหตุผลจะเป็นข้อความสำเร็จรูป)
4. กด **Deploy** รอประมาณ 2 นาที
5. ได้ URL มาแล้ว **กลับไปแก้ที่ Supabase**:
   - **Authentication → URL Configuration → Site URL** = `https://ชื่อโปรเจกต์.vercel.app`
   - **Redirect URLs** เพิ่ม `https://ชื่อโปรเจกต์.vercel.app/auth/callback`

   ข้อนี้ลืมบ่อยที่สุด ถ้าไม่แก้ ลิงก์ในอีเมลจะเด้งกลับ localhost แล้วเข้าสู่ระบบไม่ได้

---

## 4. ผูกโดเมน

1. ซื้อโดเมนที่ไหนก็ได้ (`.com` ประมาณ 400 บาท/ปี, `.in.th` ประมาณ 800 บาท/ปี)
2. Vercel → **Settings → Domains** → **Add** → ใส่โดเมน
3. ทำตามที่ Vercel บอกในหน้าจัดการ DNS ของผู้ขายโดเมน — ปกติคือ
   - เพิ่ม `A` record ชี้ไป IP ที่ Vercel ให้ (สำหรับโดเมนหลัก)
   - เพิ่ม `CNAME` ชื่อ `www` ชี้ไป `cname.vercel-dns.com`
4. รอ DNS กระจาย 10 นาทีถึง 24 ชั่วโมง — SSL ออกให้อัตโนมัติ ไม่ต้องทำอะไรเพิ่ม
5. **กลับไปแก้ Site URL กับ Redirect URLs ที่ Supabase อีกครั้ง** ให้เป็นโดเมนจริง

---

## 5. ตั้ง backup (ห้ามข้าม)

free tier ไม่มี backup ให้ ถ้าลงข้อมูลโครงงานไป 100 เรื่องแล้วหาย = เริ่มใหม่หมด

1. Supabase → **Project Settings → Database → Connection string → URI**
   คัดลอกมาแล้วแทน `[YOUR-PASSWORD]` ด้วยรหัสจากขั้น 1
2. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
   - ชื่อ: `SUPABASE_DB_URL`
   - ค่า: connection string เมื่อกี้
3. ไฟล์ `.github/workflows/backup.yml` ในโปรเจกต์นี้จะ dump ให้ทุกคืนตี 2 เอง
4. ลองกด **Actions → สำรองฐานข้อมูลรายวัน → Run workflow** ดูว่าผ่านไหม

---

## 6. เปิดงานตามเวลา

`db/schema.sql` ตั้ง `pg_cron` ไว้แล้ว 2 งาน ตรวจว่าทำงานอยู่จริงด้วย:

```sql
select jobname, schedule, active from cron.job;
```

ควรเห็น `deadline-reminder` (แจ้งเตือนก่อนปิดรับ 7 วัน) กับ `publish-scheduled` (เผยแพร่ตามเวลาที่ตั้ง)
ถ้าไม่ขึ้น ให้ไป Database → Extensions เปิด `pg_cron` แล้วรันส่วนที่ 11 ของ schema ใหม่

---

## เช็กก่อนส่งงาน

- [ ] เปิดเว็บด้วยมือถือจริง ไม่ใช่แค่ย่อหน้าต่างเบราว์เซอร์
- [ ] ทำแบบทดสอบจนจบแล้วได้ผลลัพธ์ครบ 5 โครงงาน
- [ ] เข้าสู่ระบบด้วยอีเมลจริง กดลิงก์ในอีเมลแล้วเข้าได้
- [ ] กดบันทึกโครงงาน แล้วไปเห็นในหน้า "ของฉัน"
- [ ] เข้าหน้าผู้ดูแลด้วยบัญชีนักเรียนแล้ว **ต้องเข้าไม่ได้**
- [ ] เพิ่มประกาศกิจกรรมจากหน้าแอดมิน แล้วไปโผล่ในหน้าปฏิทิน
- [ ] ลอง backup workflow ผ่านอย่างน้อย 1 ครั้ง

---

## เมื่อไหร่ต้องจ่ายเงิน

| อาการ | แปลว่า | ทางแก้ |
|---|---|---|
| เว็บล่มตอนไม่มีคนเข้า 7 วัน | โปรเจกต์ฟรีถูก pause | เข้า dashboard กด resume หรือขึ้น Pro |
| ขึ้น error เรื่อง egress | เกิน 5 GB/เดือน | ขึ้น Pro ($25/เดือน ราว 850 บาท) |
| ฐานข้อมูลเต็ม | เกิน 500 MB | ขึ้น Pro (ได้ 8 GB) |

ถ้ายังไม่ถึงจุดนั้น อยู่ฟรีได้ยาว
