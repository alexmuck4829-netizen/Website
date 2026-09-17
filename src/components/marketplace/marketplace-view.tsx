'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/misc';
import { ProductGrid } from '@/components/product/product-grid';
import { Filters } from './filters';
import { Toolbar } from './toolbar';
import type { CategorySlug, Paginated, Product } from '@/lib/types';

/**
 * Client shell around the server-rendered result set. Filters mutate the URL;
 * the server re-queries. Pagination is "Load more" style via the page param.
 */
export function MarketplaceView({
  result,
  counts,
}: {
  result: Paginated<Product>;
  counts: Record<CategorySlug, number>;
}) {
  const [density, setDensity] = useState<3 | 4>(4);
  const searchParams = useSearchParams();
  const router = useRouter();

  const loadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('perPage', String(result.perPage + 12));
    router.push(`/marketplace?${params.toString()}`, { scroll: false });
  };

  const hasMore = result.items.length < result.total;

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          <Filters counts={counts} />
        </div>
      </aside>

      <div className="space-y-6">
        <Toolbar
          total={result.total}
          counts={counts}
          density={density}
          onDensityChange={setDensity}
        />

        {result.items.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products match those filters"
            description="Try widening the price range or clearing a category — the catalogue is growing every week."
            action={
              <Button asChild variant="secondary">
                <Link href="/marketplace">Reset filters</Link>
              </Button>
            }
          />
        ) : (
          <>
            <ProductGrid products={result.items} columns={density} priorityCount={4} />

            {hasMore && (
              <div className="flex flex-col items-center gap-3 pt-4">
                <p className="text-sm text-ink-subtle">
                  Showing {result.items.length} of {result.total}
                </p>
                <Button variant="secondary" size="lg" onClick={loadMore}>
                  Load more products
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
