'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, ShoppingBag, Tag, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/misc';
import { CATEGORY_MAP } from '@/lib/constants';
import { useCart } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';

export function CartView() {
  const cart = useCart();

  if (!cart.hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (cart.count === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Browse the marketplace and add the pieces your next project is missing."
        action={
          <Button asChild size="lg">
            <Link href="/marketplace">Explore marketplace</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <ul className="space-y-3">
        {cart.items.map((item) => (
          <li key={item.productId} className="surface-card flex gap-4 p-4">
            <Link
              href={`/product/${item.slug}`}
              className="relative aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-xl bg-surface-overlay sm:w-40"
            >
              <Image src={item.thumbnail} alt="" fill sizes="160px" className="object-cover" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
              <div className="space-y-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-display font-semibold text-ink transition-colors hover:text-brand"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-ink-subtle">{CATEGORY_MAP[item.category]?.name}</p>
                <p className="text-xs text-ink-subtle">
                  Digital product — quantity is fixed at 1 licence
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-lg font-semibold text-ink">
                  {formatPrice(item.price)}
                </span>
                <button
                  type="button"
                  onClick={() => cart.remove(item.productId)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-ink-subtle transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="size-4" /> Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="surface-card space-y-5 p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>

        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Subtotal ({cart.count})</dt>
            <dd className="text-ink">{formatPrice(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="flex items-center gap-1.5 text-ink-muted">
              <Tag className="size-3.5" /> Discount
            </dt>
            <dd className="text-ink-subtle">—</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3">
            <dt className="font-medium text-ink">Total</dt>
            <dd className="font-display text-2xl font-bold text-ink">
              {formatPrice(cart.subtotal)}
            </dd>
          </div>
        </dl>

        <Button size="lg" className="w-full" asChild>
          <Link href="/checkout">
            <ShieldCheck /> Secure Checkout
          </Link>
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-sm text-ink-muted">
          <Zap className="size-4 text-success" /> Instant access after payment.
        </p>

        <Link
          href="/marketplace"
          className="block text-center text-sm text-ink-muted transition-colors hover:text-ink"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
