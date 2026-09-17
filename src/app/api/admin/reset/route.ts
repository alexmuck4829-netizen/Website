import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { resetDb } from '@/lib/services/db';

export const dynamic = 'force-dynamic';

/**
 * Restores the demo catalogue and clears orders/media.
 * Use this to wipe the demo ledger before going live.
 */
export async function POST() {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  await resetDb();
  return NextResponse.json({ ok: true });
}
