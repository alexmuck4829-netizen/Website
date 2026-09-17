import { NextResponse, type NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';

export const dynamic = 'force-dynamic';

/** Simple rate limit so the dev password gate is not trivially brute-forced. */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'local';
  const now = Date.now();
  const record = attempts.get(ip);

  if (record && now - record.first < WINDOW && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in a few minutes.' },
      { status: 429 },
    );
  }

  const { password } = (await request.json()) as { password?: string };

  if (!password || !AuthService.verifyAdminPassword(password)) {
    attempts.set(ip, record && now - record.first < WINDOW
      ? { count: record.count + 1, first: record.first }
      : { count: 1, first: now });
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  attempts.delete(ip);
  await AuthService.startAdminSession();
  return NextResponse.json({ ok: true });
}
