import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Euro, FolderOpen, Package, Plus, Receipt, Settings, ShoppingCart, Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/admin/stat-card';
import nextDynamic from 'next/dynamic';

// recharts is ~380KB. Loading it on demand keeps it out of every shared chunk.
const RevenueChart = nextDynamic(
  () => import('@/components/admin/revenue-chart').then((m) => m.RevenueChart),
  { loading: () => <div className="card h-[19rem] animate-pulse" /> },
);
import { ProductService } from '@/lib/services/product-service';
import { OrderService } from '@/lib/services/order-service';
import { formatPrice, relativeDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Tableau de bord', robots: { index: false } };

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
          <h1 className="font-display text-3xl font-medium tracking-tight text-ink">Tableau de bord</h1>
          <p className="text-ink-muted">Tout ce qui se passe dans la boutique.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus /> Créer un produit
          </Link>
        </Button>
      </header>

      {/* Raccourcis : chaque section reste atteignable même si la barre
          latérale est masquée sur un écran étroit. */}
      <nav aria-label="Sections de l’administration">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/admin/products', icon: Package, label: 'Produits', sub: 'Créer, modifier, publier' },
            { href: '/admin/orders', icon: Receipt, label: 'Commandes', sub: 'Achats et téléchargements' },
            { href: '/admin/media', icon: FolderOpen, label: 'Médias', sub: 'Images et fichiers' },
            { href: '/admin/settings', icon: Settings, label: 'Réglages du site', sub: 'Textes, couleurs, Discord' },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="card card-hover group flex h-full items-center gap-3.5 p-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand [box-shadow:inset_0_1px_0_rgb(var(--c-brand)/0.35),inset_0_-3px_0_rgb(0_0_0/0.45)]">
                  <item.icon className="size-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{item.label}</span>
                  <span className="block truncate text-xs text-ink-subtle">{item.sub}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-ink-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Chiffre d’affaires"
          value={formatPrice(stats.revenue)}
          sub={`${stats.orders} commandes payées`}
          icon={Euro}
          accent="success"
        />
        <StatCard
          label="Ventes totales"
          value={String(stats.sales)}
          sub="Licences livrées"
          icon={ShoppingCart}
          accent="brand"
        />
        <StatCard
          label="Produits"
          value={String(stats.products)}
          sub={`${stats.published} publiés · ${stats.drafts} brouillons`}
          icon={Package}
          accent="electric"
        />
        <StatCard
          label="Clients"
          value={String(stats.customers)}
          sub="Acheteurs uniques"
          icon={Users}
          accent="gold"
        />
      </div>

      <RevenueChart data={series} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <section className="surface-card overflow-hidden">
          <header className="flex items-center justify-between border-b border-line p-5">
            <h2 className="font-display text-lg font-medium text-ink">Commandes récentes</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm text-brand hover:underline"
            >
              Tout voir <ArrowRight className="size-3.5" />
            </Link>
          </header>

          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-ink-muted">Aucune commande pour le moment.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {order.customerName ?? order.customerEmail}
                    </p>
                    <p className="text-xs text-ink-subtle">
                      {order.reference} · {order.items.length} article
                      {order.items.length === 1 ? '' : 's'} · {relativeDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={order.status === 'paid' ? 'success' : 'neutral'}>
                    {order.status}
                  </Badge>
                  <span className="shrink-0 text-sm font-medium text-ink">
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
            <h2 className="font-display text-lg font-medium text-ink">Produits les plus vendus</h2>
          </header>

          {bestSelling.length === 0 ? (
            <p className="p-5 text-sm text-ink-muted">Aucune vente enregistrée.</p>
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
                    <p className="text-xs text-ink-subtle">{sales} vendus</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-ink">
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
          <h2 className="font-display text-lg font-medium text-ink">Ajoutés récemment</h2>
          <Link
            href="/admin/products"
            className="flex items-center gap-1 text-sm text-brand hover:underline"
          >
            Tous les produits <ArrowRight className="size-3.5" />
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
              <span className="shrink-0 text-sm font-medium text-ink">
                {formatPrice(product.price)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
