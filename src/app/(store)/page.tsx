import type { Metadata } from 'next';
import { Hero } from '@/components/home/hero';
import { TrustBar } from '@/components/home/trust-bar';
import { CategoryGrid } from '@/components/home/category-grid';
import { ProductSection } from '@/components/home/product-section';
import { PromoBanner } from '@/components/home/promo-banner';
import { DiscordCTA } from '@/components/layout/discord-cta';
import { ProductService } from '@/lib/services/product-service';
import { SITE, absoluteUrlSafe } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${SITE.name} — Premium Roblox Studio Assets, Maps & GUI`,
  description: SITE.description,
  alternates: { canonical: absoluteUrlSafe('/') },
};

export default async function HomePage() {
  const [featured, bestSellers, newReleases, counts] = await Promise.all([
    ProductService.featured(4),
    ProductService.bestSellers(8),
    ProductService.newReleases(4),
    ProductService.countByCategory(),
  ]);

  return (
    <div className="space-y-24 pb-8 lg:space-y-32">
      <Hero products={featured} />
      <TrustBar />
      <CategoryGrid counts={counts} />

      <ProductSection
        eyebrow="Best sellers"
        title="Best Sellers"
        description="The resources creators come back for. Ranked by sales and rated by people who actually shipped with them."
        products={bestSellers}
        ctaHref="/marketplace?sort=best-selling"
        ctaLabel="View all best sellers"
      />

      <PromoBanner products={featured} />

      <ProductSection
        eyebrow="Just added"
        title="Fresh Releases"
        description="New to the store this month, built to the same standard as everything else."
        products={newReleases}
        ctaHref="/new-releases"
        ctaLabel="View all new releases"
      />

      <DiscordCTA />
    </div>
  );
}
