import { envOr, resolveSiteUrl } from './env';
import type { Category, CategorySlug } from './types';

/**
 * Single source of truth for brand-level settings.
 * Change the Discord invite, support email or social links here — nowhere else.
 */
export const SITE = {
  name: 'One More Click Studio',
  shortName: 'OMC Studio',
  tagline: 'Ressources premium pour Roblox Studio',
  description:
    'Maps, assets, interfaces et ressources de développement premium, conçus pour les créateurs Roblox ambitieux.',
  url: resolveSiteUrl(),
  /** ← Put your real invite here (or set NEXT_PUBLIC_DISCORD_URL) */
  discordUrl: envOr('NEXT_PUBLIC_DISCORD_URL', 'https://discord.gg/TJ4a2JrS9S'),
  supportEmail: 'support@onemoreclick.studio',
  currency: 'EUR' as const,
  locale: 'fr-FR',
} as const;

export const CATEGORIES: Category[] = [
  {
    slug: 'maps',
    name: 'Maps',
    tagline: 'Des environnements complets, prêts pour votre prochaine expérience.',
    description:
      'Des places Roblox Studio complètes : éclairage optimisé, collisions propres, intérieurs finis. Ouvrez le fichier, publiez, itérez.',
    accent: ['#0084FF', '#22D3EE'],
    icon: 'Map',
  },
  {
    slug: 'assets',
    name: 'Assets',
    tagline: 'Des pièces 3D modulaires qui s’intègrent directement à votre build.',
    description:
      'Géométrie propre, pivots bien placés et échelle cohérente : les pièces s’emboîtent au lieu de vous résister.',
    accent: ['#3AD685', '#22D3EE'],
    icon: 'Boxes',
  },
  {
    slug: 'gui',
    name: 'GUI',
    tagline: 'Des interfaces qui donnent à un jeu l’air terminé.',
    description:
      'Inventaires, boutiques, HUD et menus : mise à l’échelle, états et support mobile déjà gérés.',
    accent: ['#7C5CFF', '#EC4899'],
    icon: 'LayoutDashboard',
  },
  {
    slug: 'scripts',
    name: 'Scripts',
    tagline: 'Des systèmes qui fonctionnent dès le premier lancement.',
    description:
      'Des modules Luau commentés pour les mécaniques que vous refaites sinon à chaque projet.',
    accent: ['#3AD685', '#0084FF'],
    icon: 'Code2',
  },
  {
    slug: 'vehicles',
    name: 'Véhicules',
    tagline: 'Des modèles conduisibles au comportement réglé.',
    description:
      'Voitures, flottes d’urgence et utilitaires : sièges, feux et châssis déjà configurés.',
    accent: ['#FF8A3C', '#F45656'],
    icon: 'Car',
  },
  {
    slug: 'buildings',
    name: 'Bâtiments',
    tagline: 'Extérieurs et intérieurs, les deux terminés.',
    description:
      'Maisons, commerces et structures industrielles détaillés dedans comme dehors — aucune façade creuse.',
    accent: ['#FFBD2E', '#FF8A3C'],
    icon: 'Building2',
  },
  {
    slug: 'props',
    name: 'Props',
    tagline: 'Les détails qui rendent une scène crédible.',
    description:
      'Mobilier urbain et habillage de décor qui transforment une baseplate vide en lieu vivant.',
    accent: ['#22D3EE', '#0084FF'],
    icon: 'Lamp',
  },
  {
    slug: 'studs',
    name: 'Studs',
    tagline: 'Kits de construction et blocs modulaires.',
    description:
      'Packs alignés sur la grille pour des blockouts rapides et une architecture cohérente.',
    accent: ['#FFBD2E', '#3AD685'],
    icon: 'Grid3x3',
  },
  {
    slug: 'packs',
    name: 'Packs',
    tagline: 'Tout ce qu’il faut pour un genre, réuni.',
    description:
      'Des collections multi-catégories, bien moins chères que l’achat pièce par pièce.',
    accent: ['#F45656', '#7C5CFF'],
    icon: 'Package',
  },
  {
    slug: 'other',
    name: 'Autres',
    tagline: 'Outils, documentation et extras.',
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
  { value: 'popular', label: 'Les plus populaires' },
  { value: 'newest', label: 'Les plus récents' },
  { value: 'best-selling', label: 'Les plus vendus' },
  { value: 'rating', label: 'Les mieux notés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
];

export const PRICE_BOUNDS = { min: 0, max: 60 } as const;

export const TRUST_POINTS = [
  { icon: 'Zap', title: 'Téléchargement immédiat', description: 'Les fichiers se débloquent dès le paiement validé.' },
  { icon: 'Gem', title: 'Assets de qualité', description: 'Optimisés, testés, prêts pour la production.' },
  { icon: 'ShieldCheck', title: 'Paiement sécurisé', description: 'Transactions gérées par Stripe.' },
  { icon: 'Blocks', title: 'Prêt pour Roblox Studio', description: 'Importez, publiez, continuez à créer.' },
] as const;

/** Accepted upload types, mirrored server-side in the upload route. */
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
export const ACCEPTED_FILE_EXTENSIONS = [
  '.zip', '.rbxl', '.rbxlx', '.rbxm', '.rbxmx', '.lua', '.luau', '.txt', '.pdf', '.md', '.json',
];
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8 MB
export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
