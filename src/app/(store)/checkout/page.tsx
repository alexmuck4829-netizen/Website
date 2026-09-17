import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/cart/checkout-form';
import { PaymentService } from '@/lib/services/payment-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your purchase and get instant access to your files.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container max-w-5xl py-12 lg:py-16">
      <header className="mb-8 space-y-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">Checkout</h1>
        <p className="text-ink-muted">
          Your files are unlocked as soon as payment is confirmed.
        </p>
      </header>
      <CheckoutForm stripeConfigured={PaymentService.isConfigured()} />
    </div>
  );
}
