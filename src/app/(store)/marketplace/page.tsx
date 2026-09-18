import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MarketplaceView } from '@/components/marketplace/marketplace-view';
import { ProductCardSkeleton } from '@/components/product/product-card';
import { CATEGORY_MAP, SITE } from '@/lib/constants';
import { ProductService } from '@/lib/services/product-service';
import type { CategorySlug, SortKey } from '@/lib/types';
import { absoluteUrlSafe } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? CATEGORY_MAP[params.category as CategorySlug] : null;
  const query = typeof params.q === 'string' ? params.q : null;

  const title = category
    ? `${category.name} pour Roblox Studio`
    : query
      ? `Recherche : ${query}`
      : 'Marketplace';

  return {
    title,
    description: category?.description ?? SITE.description,
    alternates: { canonical: absoluteUrlSafe('/marketplace') },
  };
}

export default async function MarketplacePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const asArray = (value: string | string[] | undefined): string[] =>
    value == null ? [] : Array.isArray(value) ? value : [value];

  const categories = asArray(params.category) as CategorySlug[];
  const query = typeof params.q === 'string' ? params.q : undefined;

  const [result, counts] = await Promise.all([
    ProductService.search({
      q: query,
      categories,
      sort: (typeof params.sort === 'string' ? params.sort : 'popular') as SortKey,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      minRating: params.minRating ? Number(params.minRating) : undefined,
      page: 1,
      perPage: Number(params.perPage ?? 12),
    }),
    ProductService.countByCategory(),
  ]);

  const activeCategory = categories.length === 1 ? CATEGORY_MAP[categories[0]] : null;

  return (
    <div className="container space-y-10 py-12 lg:py-16">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
          {activeCategory ? activeCategory.name : 'Marketplace'}
        </p>
        <h1 className="text-balance font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {query
            ? `Résultats pour « ${query} »`
            : activeCategory
              ? activeCategory.name
              : 'Tout ce qu’il faut pour créer plus vite.'}
        </h1>
        <p className="text-pretty text-lg text-ink-muted">
          {activeCategory
            ? activeCategory.description
            : 'Maps, assets, interfaces, scripts et packs complets — prêts pour la production et pensés pour Roblox Studio.'}
        </p>
      </header>

      <Suspense
        fallback={
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <MarketplaceView result={result} counts={counts} />
      </Suspense>
    </div>
  );
}
