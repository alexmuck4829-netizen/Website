import type { SiteSettings } from '../types';

/**
 * Factory defaults for every piece of editable site content.
 *
 * These seed the database on first run. After that, /admin/settings is the
 * source of truth — editing this file does nothing to a running install.
 * Use "Reset to defaults" in the admin to come back to these values.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  brand: {
    name: 'One More Click Studio',
    shortName: 'OMC Studio',
    wordmarkTop: 'ONE MORE CLICK',
    wordmarkBottom: 'Studio',
    tagline: 'Premium Roblox Studio resources',
    description:
      'Premium maps, assets, interfaces and development resources made for ambitious Roblox creators.',
  },
  links: {
    discordUrl: 'https://discord.gg/TJ4a2JrS9S',
    supportEmail: 'support@onemoreclick.studio',
  },
  theme: {
    brand: '#0084FF',
    accent: '#22D3EE',
    violet: '#7C5CFF',
  },
  hero: {
    badge: 'New drops every week',
    titleLine1: 'Build Better',
    titleLine2: 'Roblox Games.',
    titleAccent: 'Faster.',
    subtitle:
      'Premium maps, assets, interfaces and development resources made for ambitious Roblox creators.',
    primaryCta: { label: 'Explore Marketplace', href: '/marketplace' },
    secondaryCta: { label: 'View New Releases', href: '/new-releases' },
    stats: [
      { value: 1240, suffix: '+', label: 'Assets delivered' },
      { value: 4.8, decimals: 1, label: 'Average rating' },
      { value: 12, suffix: 'k+', label: 'Creators' },
    ],
    reassurance: ['Verified listings', 'Instant download', 'Ready for Roblox Studio'],
  },
  trust: [
    { icon: 'Zap', title: 'Instant download', description: 'Files unlock the moment payment clears.', colour: '#FFBD2E' },
    { icon: 'Gem', title: 'High quality assets', description: 'Optimised, tested, production-ready.', colour: '#22D3EE' },
    { icon: 'ShieldCheck', title: 'Secure checkout', description: 'Payments handled by Stripe.', colour: '#3AD685' },
    { icon: 'Blocks', title: 'Ready for Roblox Studio', description: 'Drop in, publish, keep building.', colour: '#0084FF' },
  ],
  ticker: [
    'Maps', 'Vehicles', 'GUI kits', 'Luau systems', 'Low-poly assets', 'Buildings',
    'Street props', 'Build kits', 'Complete packs', 'Terrain', 'HUDs', 'Interiors',
  ],
  sections: {
    categoriesEyebrow: 'Categories',
    categoriesTitle: 'Explore by Category',
    categoriesDescription:
      'Every resource is sorted so you can find the missing piece instead of scrolling through everything.',
    bestSellersTitle: 'Best Sellers',
    bestSellersDescription:
      'The resources creators come back for. Ranked by sales and rated by people who actually shipped with them.',
    newReleasesTitle: 'Fresh Releases',
    newReleasesDescription:
      'New to the store this month, built to the same standard as everything else.',
  },
  promo: {
    eyebrow: 'Premium resources',
    title: 'Upgrade Your Next Roblox Project.',
    description:
      'Stop wasting hours building everything from scratch. Get production-ready resources and focus on creating the experience.',
    cta: { label: 'Explore Premium Assets', href: '/marketplace' },
    points: [
      { icon: 'Clock', title: 'Weeks back', description: 'Skip the part of the project that is not the fun part.' },
      { icon: 'Layers', title: 'Consistent quality', description: 'Assets that match in scale, style and finish.' },
      { icon: 'Wrench', title: 'Yours to customise', description: 'Clean hierarchies built to be modified.' },
    ],
  },
  discord: {
    title: 'Build alongside other Roblox creators.',
    description:
      'Our Discord is where support happens, releases are announced first, and creators share what is working in their games. Free to join, no obligation to buy anything.',
    ctaLabel: 'Join our Discord',
    perks: [
      { icon: 'LifeBuoy', title: 'Setup support', description: 'Stuck on an import? Ask and get an answer.' },
      { icon: 'Bell', title: 'Release alerts', description: 'New drops and updates announced first.' },
      { icon: 'Users', title: 'Creator community', description: 'Share builds, swap techniques, get feedback.' },
    ],
  },
  footer: {
    blurb:
      'Premium maps, assets, interfaces and development resources for ambitious Roblox creators. Built to save you weeks.',
    disclaimer:
      'One More Click Studio is an independent creator studio. It is not affiliated with, endorsed by, or sponsored by Roblox Corporation. "Roblox" and "Roblox Studio" are trademarks of Roblox Corporation.',
    copyright: 'One More Click Studio. All rights reserved.',
  },
  seo: {
    titleSuffix: 'Premium Roblox Studio Assets, Maps & GUI',
    description:
      'Premium maps, assets, interfaces and development resources made for ambitious Roblox creators.',
  },
  updatedAt: new Date(0).toISOString(),
};
