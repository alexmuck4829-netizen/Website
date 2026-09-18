'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Eye, Heart, ShoppingCart, Check } from 'lucide-react';
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

/** Bouton flottant posé sur l'aperçu : il glisse depuis la droite au survol. */
const FLOATING_ACTION = [
  'grid size-9 cursor-pointer place-items-center rounded border border-white/20',
  'bg-violet/60 text-white backdrop-blur-md',
  'translate-x-3 opacity-0 transition-all duration-300 ease-spring',
  'group-hover:translate-x-0 group-hover:opacity-100',
  'hover:scale-125 hover:border-white/50 hover:bg-brand',
  // Sur tactile il n'y a pas de survol : les actions restent visibles.
  'max-md:translate-x-0 max-md:opacity-100',
  'motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:hover:scale-100',
].join(' ');

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
    <Tilt strength={9} scale={1.02} className={cn('h-full', className)}>
      <Spotlight
        as="article"
        className="card card-hover shine group relative flex h-full flex-col overflow-hidden"
      >
        {/* Filet indigo qui s'allume sur tout le pourtour au survol */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 ring-1 ring-inset ring-brand/50 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* ---- Aperçu ------------------------------------------------- */}
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
            className="object-cover transition-transform duration-[1100ms] ease-premium group-hover:scale-[1.14] motion-reduce:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-violet/55 via-violet/[0.04] to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

          {/* Voile indigo qui monte depuis le bas de l'image */}
          <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-brand/70 via-brand/25 to-transparent transition-transform duration-500 ease-premium group-hover:translate-y-0 motion-reduce:hidden" />

          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
            {product.bestSeller && <Badge variant="best">Meilleure vente</Badge>}
            {product.newRelease && !product.bestSeller && <Badge variant="new">Nouveau</Badge>}
            {product.featured && !product.bestSeller && !product.newRelease && (
              <Badge variant="popular">Populaire</Badge>
            )}
            {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          </div>

          {/* Actions flottantes */}
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                wishlist.toggle(product.id);
              }}
              aria-label={wishlist.has(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              aria-pressed={wishlist.has(product.id)}
              className={FLOATING_ACTION}
            >
              <Heart
                className={cn(
                  'size-4 transition-all duration-300',
                  wishlist.has(product.id) && 'scale-110 fill-danger text-danger',
                )}
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
                className={cn(FLOATING_ACTION, 'delay-75')}
              >
                <Eye className="size-4" />
              </button>
            )}
          </div>

          {/* Pastille de catégorie : elle laisse la place à l'invitation */}
          <span className="absolute bottom-3 left-3 z-10 rounded-full border border-white/20 bg-violet/60 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md transition-all duration-500 ease-premium group-hover:-translate-y-1 group-hover:border-white/40">
            {category?.name ?? product.category}
          </span>

          {/* Invitation qui remonte depuis le bord bas */}
          <span className="absolute bottom-3 right-3 z-10 flex translate-y-6 items-center gap-1.5 rounded-full bg-base px-3 py-1.5 text-[11px] font-medium text-brand opacity-0 transition-all duration-500 ease-spring group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:hidden">
            Voir le produit
            <ArrowUpRight className="size-3.5" />
          </span>
        </Link>

        {/* ---- Corps -------------------------------------------------- */}
        <div className={cn('flex flex-1 flex-col gap-3 p-4', compact && 'gap-2 p-3.5')}>
          <div className="space-y-1.5">
            <h3 className="font-display text-base font-medium leading-snug tracking-[-0.02em] text-ink">
              <Link
                href={`/product/${product.slug}`}
                className="bg-gradient-to-r from-brand to-brand bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-premium group-hover:bg-[length:100%_1px] group-hover:text-brand"
              >
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
              <span className="font-display text-xl font-medium tracking-[-0.025em] text-ink transition-colors duration-300 group-hover:text-brand">
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
              aria-label={
                inCart ? `${product.name} est dans votre panier` : `Ajouter ${product.name} au panier`
              }
              className="shrink-0 transition-transform duration-300 ease-spring group-hover:scale-110 motion-reduce:group-hover:scale-100"
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
