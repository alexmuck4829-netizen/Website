import type { Metadata } from 'next';
import { CartView } from '@/components/cart/cart-view';

export const metadata: Metadata = {
  title: 'Votre panier',
  description: 'Vérifiez les ressources de votre panier avant de payer.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="container max-w-5xl py-12 lg:py-16">
      <header className="mb-8 space-y-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">Votre panier</h1>
        <p className="text-ink-muted">
          Produits numériques — une licence par article, téléchargeable dès le paiement.
        </p>
      </header>
      <CartView />
    </div>
  );
}
