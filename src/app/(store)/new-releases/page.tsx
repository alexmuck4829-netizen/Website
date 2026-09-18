import type { Metadata } from 'next';
import { ProductGrid } from '@/components/product/product-grid';
import { DiscordCTA } from '@/components/layout/discord-cta';
import { ProductService } from '@/lib/services/product-service';
import { absoluteUrlSafe } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nouveautés',
  description:
    'Les maps, assets, interfaces et packs les plus récents de One More Click Studio — au même niveau d’exigence que le reste du catalogue.',
  alternates: { canonical: absoluteUrlSafe('/new-releases') },
};

export default async function NewReleasesPage() {
  const products = await ProductService.search({ sort: 'newest', perPage: 24 });

  return (
    <div className="space-y-20 py-12 lg:py-16">
      <div className="container space-y-10">
        <header className="max-w-3xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">Tout juste ajouté</p>
          <h1 className="text-balance font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Nouveautés
          </h1>
          <p className="text-pretty text-lg text-ink-muted">
            Toutes les nouveautés de la boutique, les plus récentes en premier. Chaque sortie passe
            les mêmes contrôles que le reste du catalogue avant d’être publiée.
          </p>
        </header>

        <ProductGrid products={products.items} columns={4} priorityCount={4} />
      </div>

      <DiscordCTA />
    </div>
  );
}
