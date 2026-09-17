import { SITE } from './constants';

export { SITE };

/**
 * metadataBase for the root layout. Next evaluates this at module scope while
 * collecting page data, so a throw here fails the whole build — which is
 * exactly what an empty NEXT_PUBLIC_SITE_URL used to do. Returning undefined
 * only costs relative OG image URLs.
 */
export function metadataBase(): URL | undefined {
  try {
    return new URL(SITE.url);
  } catch {
    return undefined;
  }
}

/** Absolute URL helper that tolerates a missing/relative NEXT_PUBLIC_SITE_URL. */
export function absoluteUrlSafe(path = '/'): string {
  try {
    return new URL(path, SITE.url).toString();
  } catch {
    return path;
  }
}

/** JSON-LD for a product page — improves how search engines render listings. */
export function productJsonLd(product: {
  name: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  rating: number;
  reviewCount: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: absoluteUrlSafe(product.thumbnail),
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      url: absoluteUrlSafe(`/product/${product.slug}`),
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toFixed(1),
        reviewCount: product.reviewCount,
      },
    }),
  };
}
