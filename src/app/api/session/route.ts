import { NextResponse, type NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';

export const dynamic = 'force-dynamic';

/** Customer identity. Replace with Supabase Auth when you are ready. */
export async function GET() {
  const session = await AuthService.getCustomerSession();
  return NextResponse.json({ session });
}

export async function POST(request: NextRequest) {
  const { email, name } = (await request.json()) as { email?: string; name?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  const session = await AuthService.startCustomerSession(email, name);
  return NextResponse.json({ session });
}

export async function DELETE() {
  await AuthService.endCustomerSession();
  return NextResponse.json({ ok: true });
}
