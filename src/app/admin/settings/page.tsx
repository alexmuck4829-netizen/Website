import type { Metadata } from 'next';
import { SettingsForm } from '@/components/admin/settings-form';
import { SettingsService } from '@/lib/services/settings-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Site settings', robots: { index: false } };

export default async function AdminSettingsPage() {
  const settings = await SettingsService.get();
  return <SettingsForm initial={settings} />;
}
