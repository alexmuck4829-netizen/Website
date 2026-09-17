'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CreditCard, Lock, ShieldCheck, ShoppingBag, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form';
import { EmptyState } from '@/components/ui/misc';
import { useCart } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';

export function CheckoutForm({ stripeConfigured }: { stripeConfigured: boolean }) {
  const cart = useCart();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: cart.items.map((i) => i.productId),
          email,
          name: name || undefined,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? 'Le paiement a échoué.');

      router.push(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setSubmitting(false);
    }
  };

  if (cart.hydrated && cart.count === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag />}
        title="Rien à payer"
        description="Ajoutez d’abord un produit à votre panier."
        action={
          <Button asChild size="lg">
            <Link href="/marketplace">Explorer la marketplace</Link>
          </Button>
        }
      />
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="space-y-6">
        <section className="surface-card space-y-5 p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Où devons-nous l’envoyer ?</h2>
          <p className="-mt-3 text-sm text-ink-muted">
            Votre licence et vos liens de téléchargement sont rattachés à cette adresse.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Adresse e-mail" required className="sm:col-span-2">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Nom" hint="Facultatif" className="sm:col-span-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Comment devons-nous vous appeler ?"
                autoComplete="name"
              />
            </Field>
          </div>
        </section>

        <section className="surface-card space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Paiement</h2>

          {stripeConfigured ? (
            <div className="flex items-start gap-3 rounded-xl border border-line bg-surface/60 p-4">
              <CreditCard className="mt-0.5 size-5 shrink-0 text-brand" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-ink">Stripe Checkout</p>
                <p className="text-sm text-ink-muted">
                  Vous serez redirigé vers la page de paiement hébergée par Stripe. Les données
                  de carte ne transitent jamais par nos serveurs.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/8 p-4">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-gold" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gold">Mode démonstration</p>
                <p className="text-sm text-ink-muted">
                  Stripe n’est pas encore configuré : cette commande se finalise sans paiement réel.
                  Ajoutez{' '}
                  <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-xs">
                    STRIPE_SECRET_KEY
                  </code>{' '}
                  pour activer le paiement réel.
                </p>
              </div>
            </div>
          )}

          <p className="flex items-center gap-2 text-xs text-ink-subtle">
            <Lock className="size-3.5" /> Nous ne stockons jamais les données de carte.
          </p>
        </section>

        {error && (
          <p className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle className="size-4" /> {error}
          </p>
        )}
      </div>

      <aside className="surface-card space-y-5 p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold text-ink">Récapitulatif</h2>

        <ul className="space-y-3">
          {cart.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
                <Image src={item.thumbnail} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{item.name}</span>
              <span className="text-sm font-medium text-ink">{formatPrice(item.price)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <span className="font-medium text-ink">Total</span>
          <span className="font-display text-2xl font-bold text-ink">
            {formatPrice(cart.subtotal)}
          </span>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          <ShieldCheck /> {stripeConfigured ? 'Payer avec Stripe' : 'Finaliser la commande démo'}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-sm text-ink-muted">
          <Zap className="size-4 text-success" /> Accès immédiat après paiement.
        </p>
      </aside>
    </form>
  );
}
