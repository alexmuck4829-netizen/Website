'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Check, Download, Heart, RefreshCw, ShieldCheck, ShoppingCart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { CATEGORY_MAP } from '@/lib/constants';
import { useCart } from '@/lib/store/cart-store';
import { useWishlist } from '@/lib/store/wishlist-store';
import type { Product } from '@/lib/types';
import { cn, discountPercent, effectivePrice, formatPrice } from '@/lib/utils';

const REASSURANCE = [
  { icon: Zap, label: 'Téléchargement numérique immédiat' },
  { icon: ShieldCheck, label: 'Paiement sécurisé' },
  { icon: RefreshCw, label: 'Mises à jour incluses' },
];

export function BuyBox({
  product,
  vatRegistered,
}: {
  product: Product;
  vatRegistered: boolean;
}) {
  const cart = useCart();
  const wishlist = useWishlist();
  const router = useRouter();
  const [buying, setBuying] = useState(false);

  const price = effectivePrice(product);
  const onSale = product.saleActive && product.salePrice != null;
  const discount = onSale ? discountPercent(product.price, product.salePrice!) : 0;
  const inCart = cart.has(product.id);
  const saved = wishlist.has(product.id);

  const buyNow = () => {
    setBuying(true);
    if (!inCart) cart.add(product);
    router.push('/checkout');
  };

  const addToCart = () => {
    if (inCart) {
      cart.openCart();
      return;
    }
    cart.add(product);
    toast.success('Ajouté au panier', { description: product.name });
  };

  return (
    <div className="space-y-5">
      {/* Identity */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            {CATEGORY_MAP[product.category]?.name}
          </span>
          {product.bestSeller && <Badge variant="best">Meilleure vente</Badge>}
          {product.newRelease && <Badge variant="new">Nouveau</Badge>}
        </div>

        <h1 className="text-balance font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <Rating value={product.rating} size="md" />
          <a href="#reviews" className="text-sm text-ink-muted underline-offset-4 hover:underline">
            {product.reviewCount} avis
          </a>
          <span className="text-sm text-ink-subtle">
            {product.salesCount.toLocaleString('fr-FR')} ventes
          </span>
        </div>
      </div>

      <p className="text-pretty leading-relaxed text-ink-muted">{product.shortDescription}</p>

      {/* Price + actions */}
      <div className="surface-card space-y-4 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <span className="font-display text-4xl font-bold tracking-tight text-ink">
            {formatPrice(price)}
          </span>
          {onSale && (
            <>
              <span className="pb-1 text-lg text-ink-subtle line-through">
                {formatPrice(product.price)}
              </span>
              <Badge variant="sale" size="md" className="mb-1.5">
                −{discount}%
              </Badge>
            </>
          )}
        </div>

        <p className="-mt-2 text-xs text-ink-subtle">
          {vatRegistered
            ? 'Prix TTC. Téléchargement immédiat après paiement.'
            : 'TVA non applicable, art. 293 B du CGI. Téléchargement immédiat après paiement.'}
        </p>

        <div className="space-y-2.5">
          <Button size="lg" className="w-full" onClick={buyNow} loading={buying}>
            Acheter maintenant
          </Button>

          <div className="flex gap-2.5">
            <Button
              size="lg"
              variant="secondary"
              className="flex-1"
              onClick={addToCart}
              aria-label={inCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
            >
              {inCart ? <Check className="text-success" /> : <ShoppingCart />}
              {inCart ? 'Dans le panier' : 'Ajouter au panier'}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-12"
              onClick={() => wishlist.toggle(product.id)}
              aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              aria-pressed={saved}
            >
              <Heart className={cn('size-5 transition-all', saved && 'fill-danger text-danger')} />
            </Button>
          </div>
        </div>

        <ul className="space-y-2 border-t border-line pt-4">
          {REASSURANCE.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5 text-sm text-ink-muted">
              <item.icon className="size-4 shrink-0 text-success" />
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Licence summary — visible before purchase, as it should be */}
      <div className="rounded-xl border border-line bg-surface/60 p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-ink">
            {product.license.type === 'commercial'
              ? 'Licence commerciale'
              : product.license.type === 'custom'
                ? 'Licence personnalisée'
                : 'Licence standard'}
          </span>
          <a href="/license" className="text-xs text-brand underline-offset-4 hover:underline">
            Conditions complètes
          </a>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <LicenceLine label="Utiliser dans vos jeux" allowed={product.license.commercialUse} />
          <LicenceLine label="Modifier librement" allowed={product.license.modification} />
          <LicenceLine label="Redistribuer les fichiers" allowed={product.license.redistribution} />
          <LicenceLine label="Revendre en votre nom" allowed={product.license.resale} />
        </ul>
      </div>

      <div className="flex items-center gap-2 text-xs text-ink-subtle">
        <Download className="size-3.5" />
        {product.specs.fileType} · {product.specs.fileSize} · Version {product.specs.version}
      </div>
    </div>
  );
}

function LicenceLine({ label, allowed }: { label: string; allowed: boolean }) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        className={cn(
          'grid size-3.5 shrink-0 place-items-center rounded-full',
          allowed ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger',
        )}
      >
        {allowed ? '✓' : '✕'}
      </span>
      <span className="text-ink-muted">{label}</span>
    </li>
  );
}
