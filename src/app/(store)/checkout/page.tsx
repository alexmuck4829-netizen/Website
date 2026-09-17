import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/cart/checkout-form';
import { PaymentService } from '@/lib/services/payment-service';
import { SettingsService } from '@/lib/services/settings-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Paiement',
  description: 'Finalisez votre achat et accédez immédiatement à vos fichiers.',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const settings = await SettingsService.get();
  return (
    <div className="container max-w-5xl py-12 lg:py-16">
      <header className="mb-8 space-y-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">Paiement</h1>
        <p className="text-ink-muted">
          Vos fichiers se débloquent dès la confirmation du paiement.
        </p>
      </header>
      <CheckoutForm
        stripeConfigured={PaymentService.isConfigured()}
        vatRegistered={settings.legal.vatRegistered}
      />
    </div>
  );
}
