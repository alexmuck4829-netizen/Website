import type { Metadata } from 'next';
import { OrdersTable } from '@/components/admin/orders-table';
import { OrderService } from '@/lib/services/order-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Orders', robots: { index: false } };

export default async function AdminOrdersPage() {
  const orders = await OrderService.all();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Orders</h1>
        <p className="text-ink-muted">Every purchase, who made it and what they can download.</p>
      </header>

      <OrdersTable orders={orders} />
    </div>
  );
}
