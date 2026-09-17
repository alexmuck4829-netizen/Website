/**
 * Domain model for the ONE MORE CLICK STUDIO marketplace.
 * Everything the UI renders flows through these types, so adding a field here
 * and in the admin form is all it takes to extend the catalogue.
 */

export type CategorySlug =
  | 'maps'
  | 'assets'
  | 'gui'
  | 'scripts'
  | 'vehicles'
  | 'buildings'
  | 'props'
  | 'studs'
  | 'packs'
  | 'other';

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  /** Tailwind gradient stops used by the category art */
  accent: [string, string];
  icon: string;
}

export type ProductStatus = 'draft' | 'published' | 'hidden';

export type LicenseType = 'standard' | 'commercial' | 'custom';

export interface ProductLicense {
  type: LicenseType;
  commercialUse: boolean;
  modification: boolean;
  redistribution: boolean;
  resale: boolean;
  attributionRequired: boolean;
  /** Only used when type === 'custom' */
  customText?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  /** Sort order inside the product gallery */
  position: number;
}

export interface ProductFile {
  id: string;
  name: string;
  /** Storage key — NEVER a public URL. Resolved server-side only. */
  storageKey: string;
  size: number;
  type: string;
  version: string;
  uploadedAt: string;
}

export interface ProductVersion {
  version: string;
  releasedAt: string;
  changelog: string[];
}

export interface Review {
  id: string;
  author: string;
  avatarSeed: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
}

export interface ProductSpecs {
  compatibility: string;
  fileType: string;
  fileSize: string;
  version: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CategorySlug;
  subcategory?: string;
  tags: string[];

  price: number;
  salePrice?: number | null;
  saleActive: boolean;
  currency: 'EUR';

  thumbnail: string;
  gallery: GalleryImage[];
  videoUrl?: string | null;

  files: ProductFile[];
  versions: ProductVersion[];

  license: ProductLicense;
  specs: ProductSpecs;

  included: string[];
  benefits: { title: string; description: string; icon: string }[];
  perfectFor: string[];

  rating: number;
  reviewCount: number;
  reviews: Review[];
  salesCount: number;

  featured: boolean;
  newRelease: boolean;
  bestSeller: boolean;

  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

/** Shape accepted by the admin create/edit form. */
export type ProductInput = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'reviews' | 'reviewCount' | 'rating' | 'salesCount'
> &
  Partial<Pick<Product, 'rating' | 'reviewCount' | 'salesCount'>>;

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  thumbnail: string;
  category: CategorySlug;
  quantity: number;
}

export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  thumbnail: string;
}

export interface Order {
  id: string;
  reference: string;
  customerEmail: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: 'EUR';
  status: OrderStatus;
  paymentProvider: 'stripe' | 'demo';
  paymentIntentId?: string;
  createdAt: string;
}

export interface LibraryEntry {
  order: Order;
  product: Product;
  purchasedAt: string;
}

export type SortKey = 'popular' | 'newest' | 'best-selling' | 'price-asc' | 'price-desc' | 'rating';

export interface ProductQuery {
  q?: string;
  categories?: CategorySlug[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: SortKey;
  page?: number;
  perPage?: number;
  status?: ProductStatus | 'all';
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface MediaAsset {
  id: string;
  filename: string;
  storageKey: string;
  url: string;
  size: number;
  type: string;
  kind: 'image' | 'file' | 'document';
  productId?: string;
  productName?: string;
  uploadedAt: string;
}

export interface DownloadLogEntry {
  id: string;
  productId: string;
  fileId: string;
  customerEmail: string;
  orderId: string;
  ip: string;
  at: string;
}
