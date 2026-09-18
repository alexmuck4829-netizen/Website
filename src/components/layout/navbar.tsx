'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Logo } from './logo';
import { SearchDropdown } from './search-dropdown';
import { DiscordIcon } from './discord-icon';
import { useCart } from '@/lib/store/cart-store';
import type { SiteSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * `secondary: true` garde le lien hors de la barre de bureau : la série
 * complète demande ~1443px, le conteneur du système en fait 1320 — au-delà,
 * la barre débordait et rognait le bouton d'action.
 * Ces liens restent atteignables depuis le menu mobile, le pied de page et
 * la grille de catégories.
 */
const NAV_LINKS = [
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Maps', href: '/marketplace?category=maps' },
  { label: 'Assets', href: '/marketplace?category=assets' },
  { label: 'GUI', href: '/marketplace?category=gui' },
  { label: 'Scripts', href: '/marketplace?category=scripts' },
  { label: 'Véhicules', href: '/marketplace?category=vehicles', secondary: true },
  { label: 'Packs', href: '/marketplace?category=packs', secondary: true },
  { label: 'Nouveautés', href: '/new-releases' },
];

/** Subscribes to scroll position without a setState-in-effect cascade. */
function useScrolled(threshold = 12): boolean {
  const subscribe = useCallback((listener: () => void) => {
    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}

export function Navbar({
  brand,
  discordUrl,
}: {
  brand: SiteSettings['brand'];
  discordUrl: string;
}) {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const cart = useCart();

  // Close the drawer when the route changes. Adjusting state during render is
  // React's documented pattern for this — an effect would cost an extra pass.
  const [menuRoute, setMenuRoute] = useState(pathname);
  if (menuRoute !== pathname) {
    setMenuRoute(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300 ease-premium',
          scrolled
            ? 'border-b border-line bg-base/85 backdrop-blur-xl supports-[backdrop-filter]:bg-base/70'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container flex h-16 items-center gap-4 lg:h-[72px]">
          <Logo wordmarkTop={brand.wordmarkTop} wordmarkBottom={brand.wordmarkBottom} />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Navigation principale">
            {NAV_LINKS.filter((link) => !link.secondary).map((link) => {
              const active = pathname === link.href.split('?')[0] && !link.href.includes('?');
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'group/nav relative whitespace-nowrap rounded px-3 py-2 text-sm font-normal transition-colors duration-300',
                    active ? 'text-brand' : 'text-ink-muted hover:text-brand',
                  )}
                >
                  {link.label}
                  {/* Filet qui se dessine du centre vers les bords au survol */}
                  <span
                    aria-hidden
                    className="absolute inset-x-3 bottom-1 h-px origin-center scale-x-0 bg-brand transition-transform duration-300 ease-premium group-hover/nav:scale-x-100 motion-reduce:transition-none"
                  />
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-px h-px bg-brand-gradient"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <SearchDropdown className="hidden lg:block lg:w-48 xl:w-52 2xl:w-64" />

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
            >
              <Search />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Rejoindre notre Discord"
              className="hidden sm:inline-flex"
            >
              <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                <DiscordIcon />
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Ma bibliothèque"
              className="hidden sm:inline-flex"
            >
              <Link href="/library">
                <User />
              </Link>
            </Button>

            <button
              type="button"
              onClick={cart.openCart}
              aria-label={`Panier, ${cart.count} article${cart.count === 1 ? '' : 's'}`}
              className="relative grid size-10 cursor-pointer place-items-center rounded-xl text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand"
            >
              <ShoppingCart className="size-[18px]" />
              <AnimatePresence>
                {cart.count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-brand text-[10px] font-medium text-white"
                  >
                    {cart.count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Button asChild className="ml-1 hidden md:inline-flex">
              <Link href="/marketplace">Parcourir la marketplace</Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent side="right" showClose={false} className="p-0">
          <div className="flex items-center justify-between border-b border-line p-4">
            <DialogTitle asChild>
              <Logo wordmarkTop={brand.wordmarkTop} wordmarkBottom={brand.wordmarkBottom} />
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
              <X />
            </Button>
          </div>
          <nav className="flex flex-col p-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
            <div className="hairline my-3" />
            <Link
              href="/library"
              className="rounded-xl px-3 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand"
            >
              Ma bibliothèque
            </Link>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand"
            >
              <DiscordIcon className="size-4" /> Discord
            </a>
          </nav>
          <div className="mt-auto border-t border-line p-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/marketplace">Parcourir la marketplace</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile search sheet */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-24 max-w-xl translate-y-0 p-4" showClose={false}>
          <DialogTitle className="sr-only">Rechercher un produit</DialogTitle>
          <SearchDropdown autoFocus />
        </DialogContent>
      </Dialog>
    </>
  );
}
