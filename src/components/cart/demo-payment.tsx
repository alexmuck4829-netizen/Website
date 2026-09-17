'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Info, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/store/cart-store';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

/** Stand-in for Stripe's hosted page while no keys are configured. */
export function DemoPayment({ order }: { order: Order }) {
  const router = useRouter();
  const cart = useCart();
  const [processing, setProcessing] = useState(false);

  const pay = async () => {
    setProcessing(true);
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id }),
    });

    if (response.ok) {
      cart.clear();
      router.push(`/purchase/success?order=${order.id}`);
    } else {
      setProcessing(false);
    }
  };

  return (
    <div className="surface-card space-y-6 p-7">
      <div className="flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/8 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-gold" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-gold">Page de paiement de démonstration</p>
          <p className="text-sm text-ink-muted">
            Cette page remplace Stripe Checkout. Aucune carte n’est débitée et aucune donnée
            bancaire n’est collectée.
          </p>
        </div>
      </div>

      <div className="space-y-1.5 text-center">
        <p className="text-sm text-ink-muted">Commande {order.reference}</p>
        <p className="font-display text-4xl font-bold tracking-tight text-ink">
          {formatPrice(order.total)}
        </p>
        <p className="text-sm text-ink-subtle">
          {order.items.length} article{order.items.length === 1 ? '' : 's'} · {order.customerEmail}
        </p>
      </div>

      <ul className="space-y-2 border-y border-line py-4">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-4 text-sm">
            <span className="truncate text-ink-muted">{item.name}</span>
            <span className="shrink-0 text-ink">{formatPrice(item.price)}</span>
          </li>
        ))}
      </ul>

      <Button size="lg" className="w-full" onClick={pay} loading={processing}>
        <CreditCard /> Confirmer le paiement
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-ink-subtle">
        <Lock className="size-3.5" /> Les paiements réels passent par Stripe une fois configuré.
      </p>
    </div>
  );
}
