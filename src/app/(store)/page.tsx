import type { Metadata } from 'next';
import { Hero } from '@/components/home/hero';
import { TrustBar } from '@/components/home/trust-bar';
import { CategoryGrid } from '@/components/home/category-grid';
import { ProductSection } from '@/components/home/product-section';
import { PromoBanner } from '@/components/home/promo-banner';
import { DiscordCTA } from '@/components/layout/discord-cta';
import { ProductService } from '@/lib/services/product-service';
import { SettingsService } from '@/lib/services/settings-service';
import { SITE, absoluteUrlSafe } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${SITE.name} — Assets, maps et GUI premium pour Roblox Studio`,
  description: SITE.description,
  alternates: { canonical: absoluteUrlSafe('/') },
};

export default async function HomePage() {
  const [featured, bestSellers, newReleases, counts, settings] = await Promise.all([
    ProductService.featured(4),
    ProductService.bestSellers(8),
    ProductService.newReleases(4),
    ProductService.countByCategory(),
    SettingsService.get(),
  ]);

  return (
    <div className="space-y-24 pb-8 lg:space-y-32">
      <Hero products={featured} hero={settings.hero} />
      <TrustBar points={settings.trust} ticker={settings.ticker} />
      <CategoryGrid counts={counts} sections={settings.sections} />

      <ProductSection
eyebrow="Meilleures ventes"
        title={settings.sections.bestSellersTitle}
        description={settings.sections.bestSellersDescription}
        products={bestSellers}
        ctaHref="/marketplace?sort=best-selling"
ctaLabel="Voir toutes les meilleures ventes"
      />

      <PromoBanner products={featured} promo={settings.promo} />

      <ProductSection
eyebrow="Tout juste ajouté"
        title={settings.sections.newReleasesTitle}
        description={settings.sections.newReleasesDescription}
        products={newReleases}
        ctaHref="/new-releases"
ctaLabel="Voir toutes les nouveautés"
      />

      <DiscordCTA />
    </div>
  );
}
