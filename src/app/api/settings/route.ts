import { NextResponse, type NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { SettingsService } from '@/lib/services/settings-service';
import type { SiteSettings } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ settings: await SettingsService.get() });
}

export async function PATCH(request: NextRequest) {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const patch = (await request.json()) as Partial<SiteSettings>;
  return NextResponse.json({ settings: await SettingsService.update(patch) });
}

export async function DELETE() {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  return NextResponse.json({ settings: await SettingsService.reset() });
}
