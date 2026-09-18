'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, ShoppingCart, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Spotlight, Tilt } from '@/components/ui/motion';
import { CATEGORY_MAP } from '@/lib/constants';
import { useCart } from '@/lib/store/cart-store';
import { useWishlist } from '@/lib/store/wishlist-store';
import type { Product } from '@/lib/types';
import { cn, discountPercent, effectivePrice, formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
  className?: string;
  compact?: boolean;
}

export function ProductCard({
  product,
  onQuickView,
  priority = false,
  className,
  compact = false,
}: ProductCardProps) {
  const cart = useCart();
  const wishlist = useWishlist();

  const price = effectivePrice(product);
  const onSale = product.saleActive && product.salePrice != null;
  const discount = onSale ? discountPercent(product.price, product.salePrice!) : 0;
  const inCart = cart.has(product.id);
  const category = CATEGORY_MAP[product.category];

  return (
    <Tilt strength={7} scale={1.015} className={cn('h-full', className)}>
      <Spotlight
        as="article"
        className={cn(
          'card card-hover shine group relative flex h-full flex-col overflow-hidden',
          'hover:border-brand/40 hover:shadow-lift',
        )}
      >
      {/* ---- Preview ------------------------------------------------ */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface-overlay"
        aria-label={`Voir ${product.name}`}
      >
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.08] motion-reduce:group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-violet/55 via-violet/[0.04] to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          {product.bestSeller && <Badge variant="best">Meilleure vente</Badge>}
          {product.newRelease && !product.bestSeller && <Badge variant="new">Nouveau</Badge>}
          {product.featured && !product.bestSeller && !product.newRelease && (
            <Badge variant="popular">Populaire</Badge>
          )}
          {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
        </div>

        {/* Hover actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 ease-premium group-hover:opacity-100 max-md:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              wishlist.toggle(product.id);
            }}
            aria-label={wishlist.has(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={wishlist.has(product.id)}
            className="grid size-9 cursor-pointer place-items-center rounded border border-white/15 bg-violet/55 text-white backdrop-blur-md transition-all duration-300 ease-premium hover:scale-110 hover:border-white/40 hover:bg-brand motion-reduce:hover:scale-100"
          >
            <Heart
              className={cn('size-4 transition-all', wishlist.has(product.id) && 'fill-danger text-danger')}
            />
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              aria-label={`Aperçu rapide de ${product.name}`}
              className="grid size-9 cursor-pointer place-items-center rounded border border-white/15 bg-violet/55 text-white backdrop-blur-md transition-all duration-300 ease-premium hover:scale-110 hover:border-white/40 hover:bg-brand motion-reduce:hover:scale-100"
            >
              <Eye className="size-4" />
            </button>
          )}
        </div>

        {/* Category chip sits on the image so the card body stays for selling copy */}
        <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-violet/55 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md transition-transform duration-500 ease-premium group-hover:-translate-y-0.5">
          {category?.name ?? product.category}
        </span>
      </Link>

      {/* ---- Body --------------------------------------------------- */}
      <div className={cn('flex flex-1 flex-col gap-3 p-4', compact && 'gap-2 p-3.5')}>
        <div className="space-y-1.5">
          <h3 className="font-display text-base font-medium leading-snug tracking-[-0.02em] text-ink">
            <Link href={`/product/${product.slug}`} className="transition-colors hover:text-brand">
              {product.name}
            </Link>
          </h3>
          {!compact && (
            <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">
              {product.shortDescription}
            </p>
          )}
        </div>

        <Rating value={product.rating} count={product.reviewCount} />

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-medium tracking-[-0.025em] text-ink">
              {formatPrice(price)}
            </span>
            {onSale && (
              <span className="text-sm text-ink-subtle line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <Button
            size="icon"
            variant={inCart ? 'secondary' : 'primary'}
            onClick={() => (inCart ? cart.openCart() : (cart.add(product), cart.openCart()))}
            aria-label={inCart ? `${product.name} est dans votre panier` : `Ajouter ${product.name} au panier`}
            className="shrink-0"
          >
            {inCart ? <Check className="text-success" /> : <ShoppingCart />}
          </Button>
        </div>
      </div>
      </Spotlight>
    </Tilt>
  );
}

/** Skeleton used while a grid is loading. */
export function ProductCardSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="skeleton aspect-[16/10]" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex justify-between pt-2">
          <div className="skeleton h-6 w-20 rounded" />
          <div className="skeleton size-10 rounded" />
        </div>
      </div>
    </div>
  );
}
