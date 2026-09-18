'use client';

import { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form';

/**
 * Demo identity step: the email used at checkout unlocks that library.
 * Swap this component for Supabase Auth's sign-in when you connect it —
 * everything downstream already works off the server session.
 */
export function SignInPrompt() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      startTransition(() => router.refresh());
    } else {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? 'Connexion impossible.');
      setLoading(false);
    }
  };

  return (
    <div className="surface-card space-y-6 p-7">
      <div className="space-y-2 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl border border-line bg-surface-overlay text-brand">
          <KeyRound className="size-5" />
        </span>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink">
          Accéder à ma bibliothèque
        </h1>
        <p className="text-sm text-ink-muted">
          Saisissez l’adresse e-mail utilisée lors du paiement, vos achats apparaîtront ici.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Adresse e-mail" error={error ?? undefined}>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          <Mail /> Continuer
        </Button>
      </form>

      <p className="text-center text-xs text-ink-subtle">
        Authentification de démonstration. Connectez Supabase Auth pour de vrais comptes, des
        liens magiques et la récupération de mot de passe.
      </p>
    </div>
  );
}
