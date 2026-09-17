import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DemoPayment } from '@/components/cart/demo-payment';
import { OrderService } from '@/lib/services/order-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Demo payment',
  robots: { index: false, follow: false },
};

export default async function DemoCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await OrderService.byId(orderId);
  if (!order) notFound();

  return (
    <div className="container flex max-w-lg flex-col justify-center py-16 lg:py-24">
      <DemoPayment order={order} />
    </div>
  );
}
