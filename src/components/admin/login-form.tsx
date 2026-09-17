'use client';

import { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Info, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form';
import { LogoMark } from '@/components/layout/logo';

export function AdminLoginForm({ next, devMode }: { next?: string; devMode: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      startTransition(() => {
        router.push(next ?? '/admin');
        router.refresh();
      });
    } else {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? 'La connexion a échoué.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <LogoMark className="size-12" />
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Tableau de bord
          </h1>
          <p className="text-sm text-ink-muted">Zone privée. Connectez-vous pour gérer la boutique.</p>
        </div>
      </div>

      <form onSubmit={submit} className="surface-card space-y-4 p-6">
        <Field label="Mot de passe administrateur" error={error ?? undefined}>
          <Input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          <Lock /> Se connecter
        </Button>
      </form>

      {devMode && (
        <div className="flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/8 p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-gold" />
          <p className="text-xs leading-relaxed text-ink-muted">
            <strong className="text-gold">Mode développement.</strong> Aucun{' '}
            <code className="rounded bg-black/40 px-1 font-mono">ADMIN_PASSWORD</code> n’est défini, le mot
            de passe par défaut est donc{' '}
            <code className="rounded bg-black/40 px-1 font-mono">omc-admin</code>. Définissez-en un
            vrai dans <code className="rounded bg-black/40 px-1 font-mono">.env.local</code> avant de
            déployer.
          </p>
        </div>
      )}

      {error && (
        <p className="flex items-center justify-center gap-2 text-sm text-danger">
          <AlertCircle className="size-4" /> {error}
        </p>
      )}
    </div>
  );
}
