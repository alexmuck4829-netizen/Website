import type { Metadata } from 'next';
import { CartView } from '@/components/cart/cart-view';

export const metadata: Metadata = {
  title: 'Your cart',
  description: 'Review the resources in your cart before checkout.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="container max-w-5xl py-12 lg:py-16">
      <header className="mb-8 space-y-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">Your cart</h1>
        <p className="text-ink-muted">
          Digital products — one licence per item, available to download the moment you pay.
        </p>
      </header>
      <CartView />
    </div>
  );
}
