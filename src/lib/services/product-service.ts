import { randomUUID } from 'node:crypto';
import type {
  CategorySlug, Paginated, Product, ProductInput, ProductQuery, SortKey,
} from '../types';
import { effectivePrice, slugify } from '../utils';
import { readDb, writeDb } from './db';

/**
 * Every read of the catalogue goes through here — pages never touch the store
 * directly. Point these functions at Supabase later and the UI is unaffected.
 */

const PER_PAGE = 12;

function sortProducts(items: Product[], sort: SortKey = 'popular'): Product[] {
  const copy = [...items];
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case 'best-selling':
      return copy.sort((a, b) => b.salesCount - a.salesCount);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'price-asc':
      return copy.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case 'price-desc':
      return copy.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case 'popular':
    default:
      // Popularity blends sales volume with review confidence.
      return copy.sort(
        (a, b) =>
          b.salesCount * 0.6 + b.rating * b.reviewCount * 0.4 -
          (a.salesCount * 0.6 + a.rating * a.reviewCount * 0.4),
      );
  }
}

function matchesQuery(p: Product, q: ProductQuery): boolean {
  if (q.categories?.length && !q.categories.includes(p.category)) return false;
  if (q.minRating != null && p.rating < q.minRating) return false;

  const price = effectivePrice(p);
  if (q.minPrice != null && price < q.minPrice) return false;
  if (q.maxPrice != null && price > q.maxPrice) return false;

  if (q.q) {
    const needle = q.q.toLowerCase().trim();
    const haystack = [p.name, p.shortDescription, p.category, p.subcategory ?? '', ...p.tags]
      .join(' ')
      .toLowerCase();
    if (!needle.split(/\s+/).every((word) => haystack.includes(word))) return false;
  }
  return true;
}


/**
 * Une fiche produit doit toujours avoir sa structure complète : les pages
 * lisent `specs.version`, `gallery`, `files`… sans garde. Le formulaire d'admin
 * envoie tout, mais un appel direct à l'API peut omettre des champs — sans ces
 * valeurs par défaut, le produit incomplet faisait planter le tableau de bord.
 */
function productDefaults(now: string): Omit<Product, 'id' | 'slug' | 'name'> {
  return {
    shortDescription: '',
    description: '',
    category: 'other',
    tags: [],
    price: 0,
    salePrice: null,
    saleActive: false,
    currency: 'EUR',
    thumbnail: '',
    gallery: [],
    videoUrl: null,
    files: [],
    versions: [],
    license: {
      type: 'standard',
      commercialUse: true,
      modification: true,
      redistribution: false,
      resale: false,
      attributionRequired: false,
    },
    specs: {
      compatibility: 'Roblox Studio',
      fileType: '—',
      fileSize: '—',
      version: '1.0',
      updatedAt: now,
    },
    included: [],
    benefits: [],
    perfectFor: [],
    rating: 0,
    reviewCount: 0,
    reviews: [],
    salesCount: 0,
    featured: false,
    newRelease: true,
    bestSeller: false,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
}

/** Une clé absente doit garder la valeur par défaut, pas l'écraser par undefined. */
function stripUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

export const ProductService = {
  async all(includeUnpublished = false): Promise<Product[]> {
    const db = await readDb();
    return includeUnpublished ? db.products : db.products.filter((p) => p.status === 'published');
  },

  async search(query: ProductQuery = {}): Promise<Paginated<Product>> {
    const db = await readDb();
    const status = query.status ?? 'published';
    const pool = status === 'all' ? db.products : db.products.filter((p) => p.status === status);

    const filtered = pool.filter((p) => matchesQuery(p, query));
    const sorted = sortProducts(filtered, query.sort);

    const perPage = query.perPage ?? PER_PAGE;
    const page = Math.max(1, query.page ?? 1);
    const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));

    return {
      items: sorted.slice((page - 1) * perPage, page * perPage),
      total: sorted.length,
      page,
      perPage,
      totalPages,
    };
  },

  async bySlug(slug: string, includeUnpublished = false): Promise<Product | null> {
    const db = await readDb();
    const found = db.products.find((p) => p.slug === slug);
    if (!found) return null;
    if (!includeUnpublished && found.status !== 'published') return null;
    return found;
  },

  async byId(id: string): Promise<Product | null> {
    const db = await readDb();
    return db.products.find((p) => p.id === id) ?? null;
  },

  async byIds(ids: string[]): Promise<Product[]> {
    const db = await readDb();
    return ids.map((id) => db.products.find((p) => p.id === id)).filter((p): p is Product => !!p);
  },

  async featured(limit = 4): Promise<Product[]> {
    const items = await ProductService.all();
    const flagged = items.filter((p) => p.featured);
    // Une boutique qui n'a encore rien mis en avant ne doit pas afficher une
    // vitrine vide : on retombe sur le catalogue, comme bestSellers/newReleases.
    return sortProducts(flagged.length >= limit ? flagged : items, 'popular').slice(0, limit);
  },

  async bestSellers(limit = 8): Promise<Product[]> {
    const items = await ProductService.all();
    const flagged = items.filter((p) => p.bestSeller);
    return sortProducts(flagged.length >= limit ? flagged : items, 'best-selling').slice(0, limit);
  },

  async newReleases(limit = 8): Promise<Product[]> {
    const items = await ProductService.all();
    const flagged = items.filter((p) => p.newRelease);
    return sortProducts(flagged.length >= limit ? flagged : items, 'newest').slice(0, limit);
  },

  async related(product: Product, limit = 4): Promise<Product[]> {
    const items = await ProductService.all();
    const scored = items
      .filter((p) => p.id !== product.id)
      .map((p) => {
        let score = 0;
        if (p.category === product.category) score += 5;
        if (p.subcategory && p.subcategory === product.subcategory) score += 2;
        score += p.tags.filter((t) => product.tags.includes(t)).length * 1.5;
        score += p.rating / 5;
        return { p, score };
      })
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.p);
  },

  /** Quick-search suggestions for the navbar dropdown. */
  async suggest(term: string, limit = 6): Promise<Product[]> {
    if (!term.trim()) return [];
    const { items } = await ProductService.search({ q: term, perPage: limit, sort: 'popular' });
    return items;
  },

  async countByCategory(): Promise<Record<CategorySlug, number>> {
    const items = await ProductService.all();
    return items.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {} as Record<CategorySlug, number>);
  },

  async create(input: ProductInput): Promise<Product> {
    return writeDb((db) => {
      const now = new Date().toISOString();
      const slug = uniqueSlug(db.products, input.slug || slugify(input.name));
      const product: Product = {
        ...productDefaults(now),
        ...stripUndefined(input),
        id: randomUUID(),
        name: input.name,
        slug,
        rating: input.rating ?? 0,
        reviewCount: input.reviewCount ?? 0,
        reviews: [],
        salesCount: input.salesCount ?? 0,
        createdAt: now,
        updatedAt: now,
      };
      db.products.unshift(product);
      return product;
    });
  },

  async update(id: string, patch: Partial<ProductInput>): Promise<Product | null> {
    return writeDb((db) => {
      const index = db.products.findIndex((p) => p.id === id);
      if (index === -1) return null;
      const current = db.products[index];
      const slug =
        patch.slug && patch.slug !== current.slug
          ? uniqueSlug(db.products.filter((p) => p.id !== id), patch.slug)
          : current.slug;
      const updated: Product = {
        ...current,
        ...patch,
        slug,
        id: current.id,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
      };
      db.products[index] = updated;
      return updated;
    });
  },

  async remove(id: string): Promise<boolean> {
    return writeDb((db) => {
      const before = db.products.length;
      db.products = db.products.filter((p) => p.id !== id);
      db.media = db.media.filter((m) => m.productId !== id);
      return db.products.length < before;
    });
  },

  async duplicate(id: string): Promise<Product | null> {
    return writeDb((db) => {
      const source = db.products.find((p) => p.id === id);
      if (!source) return null;
      const now = new Date().toISOString();
      const copy: Product = {
        ...structuredClone(source),
        id: randomUUID(),
        name: `${source.name} (copy)`,
        slug: uniqueSlug(db.products, `${source.slug}-copy`),
        status: 'draft',
        salesCount: 0,
        reviews: [],
        reviewCount: 0,
        rating: 0,
        createdAt: now,
        updatedAt: now,
      };
      db.products.unshift(copy);
      return copy;
    });
  },

  async setStatus(id: string, status: Product['status']): Promise<Product | null> {
    return ProductService.update(id, { status });
  },

  /** Publishes a new version: prepends the changelog entry and updates specs. */
  async addVersion(
    id: string,
    version: string,
    changelog: string[],
  ): Promise<Product | null> {
    return writeDb((db) => {
      const product = db.products.find((p) => p.id === id);
      if (!product) return null;
      const releasedAt = new Date().toISOString();
      product.versions = [{ version, releasedAt, changelog }, ...product.versions];
      product.specs = { ...product.specs, version, updatedAt: releasedAt };
      product.updatedAt = releasedAt;
      return product;
    });
  },

  async stats() {
    const db = await readDb();
    const paid = db.orders.filter((o) => o.status === 'paid');
    return {
      products: db.products.length,
      published: db.products.filter((p) => p.status === 'published').length,
      drafts: db.products.filter((p) => p.status === 'draft').length,
      revenue: paid.reduce((sum, o) => sum + o.total, 0),
      sales: paid.reduce((sum, o) => sum + o.items.length, 0),
      orders: paid.length,
      customers: new Set(paid.map((o) => o.customerEmail)).size,
    };
  },
};

function uniqueSlug(existing: { slug: string }[], base: string): string {
  const clean = slugify(base) || 'product';
  if (!existing.some((p) => p.slug === clean)) return clean;
  let i = 2;
  while (existing.some((p) => p.slug === `${clean}-${i}`)) i += 1;
  return `${clean}-${i}`;
}
