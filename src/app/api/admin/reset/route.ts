import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { clearDemoData, resetDb } from '@/lib/services/db';

export const dynamic = 'force-dynamic';

/** Réinstalle le catalogue et l'historique de démonstration. */
export async function POST() {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  await resetDb();
  return NextResponse.json({ ok: true });
}

/**
 * Supprime définitivement les données de démonstration : produits seedés,
 * leurs avis, et les commandes fictives. Les produits créés depuis
 * l'administration et leurs commandes réelles sont conservés.
 */
export async function DELETE() {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const result = await clearDemoData();
  return NextResponse.json({ ok: true, ...result });
}
