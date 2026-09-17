import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Euro, Package, Plus, ShoppingCart, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/admin/stat-card';
import nextDynamic from 'next/dynamic';

// recharts is ~380KB. Loading it on demand keeps it out of every shared chunk.
const RevenueChart = nextDynamic(
  () => import('@/components/admin/revenue-chart').then((m) => m.RevenueChart),
  { loading: () => <div className="brick h-[19rem] animate-pulse" /> },
);
import { ProductService } from '@/lib/services/product-service';
import { OrderService } from '@/lib/services/order-service';
import { formatPrice, relativeDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false } };

export default async function AdminDashboard() {
  const [stats, series, recentOrders, bestSelling, recentProducts] = await Promise.all([
    ProductService.stats(),
    OrderService.revenueSeries(14),
    OrderService.recent(6),
    OrderService.bestSelling(5),
    ProductService.search({ sort: 'newest', perPage: 5, status: 'all' }),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Dashboard</h1>
          <p className="text-ink-muted">Everything happening in the store.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus /> Create product
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatPrice(stats.revenue)}
          sub={`${stats.orders} paid orders`}
          icon={Euro}
          accent="success"
        />
        <StatCard
          label="Total sales"
          value={String(stats.sales)}
          sub="Licences delivered"
          icon={ShoppingCart}
          accent="brand"
        />
        <StatCard
          label="Products"
          value={String(stats.products)}
          sub={`${stats.published} published · ${stats.drafts} drafts`}
          icon={Package}
          accent="electric"
        />
        <StatCard
          label="Customers"
          value={String(stats.customers)}
          sub="Unique buyers"
          icon={Users}
          accent="gold"
        />
      </div>

      <RevenueChart data={series} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <section className="surface-card overflow-hidden">
          <header className="flex items-center justify-between border-b border-line p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm text-brand hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </header>

          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-ink-muted">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {order.customerName ?? order.customerEmail}
                    </p>
                    <p className="text-xs text-ink-subtle">
                      {order.reference} · {order.items.length} item
                      {order.items.length === 1 ? '' : 's'} · {relativeDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={order.status === 'paid' ? 'success' : 'neutral'}>
                    {order.status}
                  </Badge>
                  <span className="shrink-0 text-sm font-semibold text-ink">
                    {formatPrice(order.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Best selling */}
        <section className="surface-card overflow-hidden">
          <header className="border-b border-line p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Best selling products</h2>
          </header>

          {bestSelling.length === 0 ? (
            <p className="p-5 text-sm text-ink-muted">No sales recorded yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {bestSelling.map(({ product, sales, revenue }) => (
                <li key={product.id} className="flex items-center gap-3 p-4">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
                    <Image src={product.thumbnail} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="truncate text-sm font-medium text-ink hover:text-brand"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-ink-subtle">{sales} sold</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ink">
                    {formatPrice(revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Recent products */}
      <section className="surface-card overflow-hidden">
        <header className="flex items-center justify-between border-b border-line p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Recently added</h2>
          <Link
            href="/admin/products"
            className="flex items-center gap-1 text-sm text-brand hover:underline"
          >
            All products <ArrowRight className="size-3.5" />
          </Link>
        </header>
        <ul className="divide-y divide-line">
          {recentProducts.items.map((product) => (
            <li key={product.id} className="flex items-center gap-3 p-4">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
                <Image src={product.thumbnail} alt="" fill sizes="44px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="truncate text-sm font-medium text-ink hover:text-brand"
                >
                  {product.name}
                </Link>
                <p className="text-xs capitalize text-ink-subtle">
                  {product.category} · v{product.specs.version}
                </p>
              </div>
              <Badge variant={product.status === 'published' ? 'success' : product.status === 'draft' ? 'draft' : 'hidden'}>
                {product.status}
              </Badge>
              <span className="shrink-0 text-sm font-semibold text-ink">
                {formatPrice(product.price)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
