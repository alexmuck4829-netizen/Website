import type { Product, ProductVersion, Review } from '../types';
import { DEFAULT_BENEFITS, SEEDS, type Seed } from './seed-products';

const previews = (slug: string, shots: number) =>
  Array.from({ length: shots }, (_, i) => ({
    id: `${slug}-img-${i + 1}`,
    url: `/previews/${slug}-${i + 1}.svg`,
    alt: `${slug} preview ${i + 1}`,
    position: i,
  }));

function expand(seed: Seed): Product {
  const created = new Date(Date.now() - seed.createdDaysAgo * 86_400_000).toISOString();
  const shots = seed.shots ?? 4;

  const versions: ProductVersion[] = (seed.changelog ?? [
    { version: seed.specs.version, days: seed.createdDaysAgo, notes: ['Initial release'] },
  ]).map((c) => ({
    version: c.version,
    releasedAt: new Date(Date.now() - c.days * 86_400_000).toISOString(),
    changelog: c.notes,
  }));

  const reviews: Review[] = seed.reviews.map((r, i) => ({
    ...r,
    id: `${seed.slug}-rev-${i + 1}`,
    avatarSeed: r.author,
  }));

  const updatedAt = versions[0]?.releasedAt ?? created;

  return {
    id: seed.slug,
    slug: seed.slug,
    name: seed.name,
    shortDescription: seed.short,
    description: seed.description,
    category: seed.category,
    subcategory: seed.subcategory,
    tags: seed.tags,

    price: seed.price,
    salePrice: seed.salePrice ?? null,
    saleActive: seed.salePrice != null,
    currency: 'EUR',

    thumbnail: `/previews/${seed.slug}-thumb.svg`,
    gallery: previews(seed.slug, shots),
    videoUrl: seed.video ?? null,

    // Demo file entries. Real uploads replace these via /admin — storageKey is a
    // private storage path, never a public URL.
    files: [
      {
        id: `${seed.slug}-file-1`,
        name: `${seed.slug}-v${seed.specs.version}.zip`,
        storageKey: `products/${seed.slug}/downloads/${seed.slug}-v${seed.specs.version}.zip`,
        size: Math.round(parseFloat(seed.specs.fileSize) * 1024 * 1024),
        type: 'application/zip',
        version: seed.specs.version,
        uploadedAt: updatedAt,
      },
    ],
    versions,

    license: {
      type: seed.price >= 40 ? 'commercial' : 'standard',
      commercialUse: true,
      modification: true,
      redistribution: false,
      resale: false,
      attributionRequired: false,
      ...seed.license,
    },

    specs: {
      compatibility: 'Roblox Studio',
      fileType: seed.specs.fileType,
      fileSize: seed.specs.fileSize,
      version: seed.specs.version,
      updatedAt,
    },

    included: seed.included,
    benefits: seed.benefits ?? DEFAULT_BENEFITS,
    perfectFor: seed.perfectFor,

    rating: seed.rating,
    reviewCount: seed.reviewCount,
    reviews,
    salesCount: seed.sales,

    featured: seed.flags?.featured ?? false,
    newRelease: seed.flags?.newRelease ?? seed.createdDaysAgo < 45,
    bestSeller: seed.flags?.bestSeller ?? false,

    status: 'published',
    createdAt: created,
    updatedAt,
  };
}

/** The demo catalogue, expanded into full Product records. */
export const SEED_PRODUCTS: Product[] = SEEDS.map(expand);
