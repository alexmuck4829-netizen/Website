import { envOr, resolveSiteUrl } from './env';
import type { Category, CategorySlug } from './types';

/**
 * Single source of truth for brand-level settings.
 * Change the Discord invite, support email or social links here — nowhere else.
 */
export const SITE = {
  name: 'One More Click Studio',
  shortName: 'OMC Studio',
  tagline: 'Premium Roblox Studio resources',
  description:
    'Premium maps, assets, interfaces and development resources made for ambitious Roblox creators.',
  url: resolveSiteUrl(),
  /** ← Put your real invite here (or set NEXT_PUBLIC_DISCORD_URL) */
  discordUrl: envOr('NEXT_PUBLIC_DISCORD_URL', 'https://discord.gg/onemoreclick'),
  supportEmail: 'support@onemoreclick.studio',
  currency: 'EUR' as const,
  locale: 'en-GB',
} as const;

export const CATEGORIES: Category[] = [
  {
    slug: 'maps',
    name: 'Maps',
    tagline: 'Complete environments ready for your next experience.',
    description:
      'Full Roblox Studio places with optimised lighting, collisions and interiors. Open the file, publish, iterate.',
    accent: ['#0084FF', '#22D3EE'],
    icon: 'Map',
  },
  {
    slug: 'assets',
    name: 'Assets',
    tagline: 'Modular 3D pieces built to drop straight into a build.',
    description:
      'Clean geometry, sensible pivots and consistent scale so parts snap together instead of fighting you.',
    accent: ['#3AD685', '#22D3EE'],
    icon: 'Boxes',
  },
  {
    slug: 'gui',
    name: 'GUI',
    tagline: 'Interfaces that make a game feel finished.',
    description:
      'Inventories, shops, HUDs and menus with proper scaling, states and mobile support already handled.',
    accent: ['#7C5CFF', '#EC4899'],
    icon: 'LayoutDashboard',
  },
  {
    slug: 'scripts',
    name: 'Scripts',
    tagline: 'Systems that work on the first run.',
    description:
      'Commented Luau modules for the mechanics you would otherwise rebuild on every project.',
    accent: ['#3AD685', '#0084FF'],
    icon: 'Code2',
  },
  {
    slug: 'vehicles',
    name: 'Vehicles',
    tagline: 'Drivable models with tuned handling.',
    description:
      'Cars, emergency fleets and utility vehicles with working seats, lights and chassis setups.',
    accent: ['#FF8A3C', '#F45656'],
    icon: 'Car',
  },
  {
    slug: 'buildings',
    name: 'Buildings',
    tagline: 'Exteriors and interiors, both finished.',
    description:
      'Houses, shops and industrial structures detailed inside and out — no hollow facades.',
    accent: ['#FFBD2E', '#FF8A3C'],
    icon: 'Building2',
  },
  {
    slug: 'props',
    name: 'Props',
    tagline: 'The details that sell a scene.',
    description:
      'Street furniture, clutter and set dressing that turn an empty baseplate into a believable place.',
    accent: ['#22D3EE', '#0084FF'],
    icon: 'Lamp',
  },
  {
    slug: 'studs',
    name: 'Studs',
    tagline: 'Building kits and modular blocks.',
    description:
      'Grid-aligned construction packs for rapid blockouts and consistent architecture.',
    accent: ['#FFBD2E', '#3AD685'],
    icon: 'Grid3x3',
  },
  {
    slug: 'packs',
    name: 'Packs',
    tagline: 'Everything for a genre, bundled.',
    description:
      'Multi-category collections priced well below buying each piece on its own.',
    accent: ['#F45656', '#7C5CFF'],
    icon: 'Package',
  },
  {
    slug: 'other',
    name: 'Other',
    tagline: 'Tools, docs and extras.',
    description: 'Supporting resources that do not fit a single category.',
    accent: ['#94A3B8', '#0084FF'],
    icon: 'Sparkles',
  },
];

/** Categories shown in the main navigation / homepage grid (Other is admin-only). */
export const PUBLIC_CATEGORIES = CATEGORIES.filter((c) => c.slug !== 'other');

export const CATEGORY_MAP: Record<CategorySlug, Category> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.slug]: c }),
  {} as Record<CategorySlug, Category>,
);

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest first' },
  { value: 'best-selling', label: 'Best selling' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export const PRICE_BOUNDS = { min: 0, max: 60 } as const;

export const TRUST_POINTS = [
  { icon: 'Zap', title: 'Instant download', description: 'Files unlock the moment payment clears.' },
  { icon: 'Gem', title: 'High quality assets', description: 'Optimised, tested, production-ready.' },
  { icon: 'ShieldCheck', title: 'Secure checkout', description: 'Payments handled by Stripe.' },
  { icon: 'Blocks', title: 'Ready for Roblox Studio', description: 'Drop in, publish, keep building.' },
] as const;

/** Accepted upload types, mirrored server-side in the upload route. */
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
export const ACCEPTED_FILE_EXTENSIONS = [
  '.zip', '.rbxl', '.rbxlx', '.rbxm', '.rbxmx', '.lua', '.luau', '.txt', '.pdf', '.md', '.json',
];
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8 MB
export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
