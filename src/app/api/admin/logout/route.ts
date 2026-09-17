import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';

export const dynamic = 'force-dynamic';

export async function POST() {
  await AuthService.endAdminSession();
  return NextResponse.json({ ok: true });
}
