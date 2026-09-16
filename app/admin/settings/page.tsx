import { getSiteSettings, SETTING_DEFS } from '@/lib/site-settings';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  const current = await getSiteSettings();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">การตั้งค่าเว็บไซต์</h1>
        <p className="text-sm text-muted">แก้ไขข้อมูลที่แสดงใน Footer และส่วนต่าง ๆ ของเว็บไซต์</p>
      </div>
      <SettingsForm current={current} defs={SETTING_DEFS} />
    </div>
  );
}
