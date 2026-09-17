import type { Metadata } from 'next';
import { ProductGrid } from '@/components/product/product-grid';
import { DiscordCTA } from '@/components/layout/discord-cta';
import { ProductService } from '@/lib/services/product-service';
import { absoluteUrlSafe } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New Releases',
  description:
    'The newest maps, assets, interfaces and packs added to One More Click Studio — built to the same standard as everything else in the catalogue.',
  alternates: { canonical: absoluteUrlSafe('/new-releases') },
};

export default async function NewReleasesPage() {
  const products = await ProductService.search({ sort: 'newest', perPage: 24 });

  return (
    <div className="space-y-20 py-12 lg:py-16">
      <div className="container space-y-10">
        <header className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Just added</p>
          <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Fresh Releases
          </h1>
          <p className="text-pretty text-lg text-ink-muted">
            Everything new in the store, newest first. Each release goes through the same checks as
            the rest of the catalogue before it goes live.
          </p>
        </header>

        <ProductGrid products={products.items} columns={4} priorityCount={4} />
      </div>

      <DiscordCTA />
    </div>
  );
}
