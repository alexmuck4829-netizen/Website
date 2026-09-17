import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Gallery } from '@/components/product/gallery';
import { BuyBox } from '@/components/product/buy-box';
import {
  Changelog, PerfectFor, ProductInformation, ScreenshotShowcase, WhatsIncluded, WhyYoullLoveIt,
} from '@/components/product/product-sections';
import { Reviews } from '@/components/product/reviews';
import { ProductGrid } from '@/components/product/product-grid';
import { SectionHeading } from '@/components/ui/misc';
import { Reveal } from '@/components/ui/reveal';
import { DiscordCTA } from '@/components/layout/discord-cta';
import { CATEGORY_MAP } from '@/lib/constants';
import { ProductService } from '@/lib/services/product-service';
import { AuthService } from '@/lib/services/auth-service';
import { absoluteUrlSafe, productJsonLd } from '@/lib/seo';
import { effectivePrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductService.bySlug(slug, true);
  if (!product) return { title: 'Product not found' };

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: absoluteUrlSafe(`/product/${product.slug}`) },
    openGraph: {
      type: 'website',
      title: `${product.name} — ${CATEGORY_MAP[product.category]?.name}`,
      description: product.shortDescription,
      images: [{ url: product.thumbnail, width: 1280, height: 720, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [product.thumbnail],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;

  // Admins can preview drafts; everyone else only sees published products.
  const admin = await AuthService.getAdminSession();
  const product = await ProductService.bySlug(slug, Boolean(admin));
  if (!product) notFound();

  const related = await ProductService.related(product, 4);
  const category = CATEGORY_MAP[product.category];

  return (
    <div className="pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productJsonLd({ ...product, price: effectivePrice(product) }),
          ),
        }}
      />

      <div className="container py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm">
          <Link href="/" className="text-ink-subtle transition-colors hover:text-ink">
            Home
          </Link>
          <ChevronRight className="size-3.5 text-ink-subtle" />
          <Link href="/marketplace" className="text-ink-subtle transition-colors hover:text-ink">
            Marketplace
          </Link>
          <ChevronRight className="size-3.5 text-ink-subtle" />
          <Link
            href={`/marketplace?category=${product.category}`}
            className="text-ink-subtle transition-colors hover:text-ink"
          >
            {category?.name}
          </Link>
          <ChevronRight className="size-3.5 text-ink-subtle" />
          <span className="text-ink-muted">{product.name}</span>
        </nav>

        {product.status !== 'published' && (
          <div className="mb-6 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
            Admin preview — this product is <strong>{product.status}</strong> and is not visible to
            customers.
          </div>
        )}

        {/* Hero: gallery + buy box */}
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          <Gallery
            images={product.gallery}
            videoUrl={product.videoUrl}
            productName={product.name}
          />
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BuyBox product={product} />
          </div>
        </div>
      </div>

      {/* Detail */}
      <div className="container space-y-20 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          <div className="space-y-8">
            <Reveal>
              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  About this product
                </h2>
                {product.description.split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="text-pretty leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </section>
            </Reveal>

            <WhatsIncluded items={product.included} />
            <PerfectFor items={product.perfectFor} />
          </div>

          <div className="space-y-6">
            <ProductInformation product={product} />
            <Changelog versions={product.versions} />
          </div>
        </div>

        <WhyYoullLoveIt benefits={product.benefits} />
        <ScreenshotShowcase product={product} />
        <Reviews
          reviews={product.reviews}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        {related.length > 0 && (
          <section className="space-y-8">
            <Reveal>
              <SectionHeading
                title="You May Also Like"
                description="Picked for matching style and scale, so they combine cleanly with this product."
              />
            </Reveal>
            <ProductGrid products={related} columns={4} />
          </section>
        )}
      </div>

      <DiscordCTA />
    </div>
  );
}
