'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Rating } from '@/components/ui/rating';
import { CATEGORY_MAP } from '@/lib/constants';
import { useCart } from '@/lib/store/cart-store';
import type { Product } from '@/lib/types';
import { discountPercent, effectivePrice, formatPrice } from '@/lib/utils';

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const cart = useCart();
  if (!product) return null;

  const price = effectivePrice(product);
  const onSale = product.saleActive && product.salePrice != null;
  const inCart = cart.has(product.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <div className="grid max-h-[85vh] overflow-y-auto md:grid-cols-2">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px]">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute left-3 top-3 flex gap-1.5">
              {product.bestSeller && <Badge variant="best">Meilleure vente</Badge>}
              {onSale && (
                <Badge variant="sale">-{discountPercent(product.price, product.salePrice!)}%</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                {CATEGORY_MAP[product.category]?.name}
              </p>
              <DialogTitle className="font-display text-2xl font-semibold tracking-tight text-ink">
                {product.name}
              </DialogTitle>
              <Rating value={product.rating} count={product.reviewCount} size="md" />
            </div>

            <DialogDescription className="text-sm leading-relaxed text-ink-muted">
              {product.shortDescription}
            </DialogDescription>

            <ul className="space-y-1.5">
              {product.included.slice(0, 4).map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 border-t border-line pt-4">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-3xl font-semibold tracking-tight text-ink">
                  {formatPrice(price)}
                </span>
                {onSale && (
                  <span className="text-ink-subtle line-through">{formatPrice(product.price)}</span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!inCart) cart.add(product);
                    onOpenChange(false);
                    cart.openCart();
                  }}
                >
                  {inCart ? <Check /> : <ShoppingCart />}
                  {inCart ? 'Dans le panier' : 'Ajouter au panier'}
                </Button>
                <Button variant="secondary" asChild>
                  <Link href={`/product/${product.slug}`} onClick={() => onOpenChange(false)}>
                    Détails <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
