import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductsTable } from '@/components/admin/products-table';
import { ProductService } from '@/lib/services/product-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Produits', robots: { index: false } };

export default async function AdminProductsPage() {
  const products = await ProductService.all(true);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-medium tracking-tight text-ink">Produits</h1>
          <p className="text-ink-muted">
            Créez, modifiez, tarifez et publiez tout ce que contient la boutique.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus /> Créer un produit
          </Link>
        </Button>
      </header>

      <ProductsTable products={products} />
    </div>
  );
}
