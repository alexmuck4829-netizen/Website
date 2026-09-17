import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin/login-form';
import { AuthService, IS_DEV_AUTH } from '@/lib/services/auth-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Connexion administrateur',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await AuthService.getAdminSession()) redirect('/admin');
  const { next } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5 py-16">
      <AdminLoginForm next={next} devMode={IS_DEV_AUTH} />
    </div>
  );
}
