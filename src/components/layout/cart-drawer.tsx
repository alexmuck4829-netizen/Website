'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, ShoppingBag, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CATEGORY_MAP } from '@/lib/constants';
import { useCart } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const cart = useCart();

  return (
    <Dialog open={cart.isOpen} onOpenChange={cart.setOpen}>
      <DialogContent side="right" className="flex flex-col p-0">
        <div className="flex items-center gap-2.5 border-b border-line p-5">
          <ShoppingBag className="size-5 text-brand" />
          <DialogTitle className="font-display text-lg font-medium text-ink">
            Votre panier
          </DialogTitle>
          <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-ink-muted">
            {cart.count}
          </span>
        </div>

        {cart.count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid size-14 place-items-center rounded-2xl border border-line bg-surface-overlay">
              <ShoppingBag className="size-6 text-ink-subtle" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-ink">Votre panier est vide</p>
              <p className="text-sm text-ink-muted">
                Parcourez la marketplace et ajoutez ce dont votre prochain projet a besoin.
              </p>
            </div>
            <Button asChild onClick={() => cart.closeCart()}>
              <Link href="/marketplace">Explorer la marketplace</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-2 overflow-y-auto p-4">
              {cart.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 rounded-xl border border-line bg-surface/60 p-2.5"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={() => cart.closeCart()}
                    className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-overlay"
                  >
                    <Image src={item.thumbnail} alt="" fill sizes="64px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => cart.closeCart()}
                      className="line-clamp-1 text-sm font-medium text-ink transition-colors hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-ink-subtle">{CATEGORY_MAP[item.category]?.name}</p>
                    <p className="mt-1 text-sm font-medium text-ink">{formatPrice(item.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => cart.remove(item.productId)}
                    aria-label={`Retirer ${item.name}`}
                    className="h-fit cursor-pointer rounded-lg p-1.5 text-ink-subtle transition-colors hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-line bg-surface/80 p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-muted">Sous-total</span>
                <span className="font-display text-xl font-medium text-ink">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>

              <Button size="lg" className="w-full" asChild onClick={() => cart.closeCart()}>
                <Link href="/checkout">
                  <ShieldCheck /> Paiement sécurisé
                </Link>
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-ink-subtle">
                <Zap className="size-3.5 text-success" />
                Accès immédiat après paiement
              </div>

              <Link
                href="/cart"
                onClick={() => cart.closeCart()}
                className="block text-center text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Voir le panier complet
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
