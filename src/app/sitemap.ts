import type { MetadataRoute } from 'next';
import { ProductService } from '@/lib/services/product-service';
import { PUBLIC_CATEGORIES, SITE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, '');
  const products = await ProductService.all();

  return [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/marketplace`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/new-releases`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/license`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/refunds`, changeFrequency: 'yearly', priority: 0.3 },
    ...PUBLIC_CATEGORIES.map((c) => ({
      url: `${base}/marketplace?category=${c.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
