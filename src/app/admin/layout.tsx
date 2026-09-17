import { AdminShell } from '@/components/admin/admin-shell';
import { AuthService } from '@/lib/services/auth-service';

export const dynamic = 'force-dynamic';

/**
 * Real auth boundary. Middleware only checks that a session cookie exists; this
 * verifies its signature and expiry server-side before any admin UI renders.
 * Without a valid session the only reachable child is /admin/login, which
 * renders bare (no dashboard chrome).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await AuthService.getAdminSession();
  if (!session) return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
