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
 * `wide: true` keeps a link out of the bar until 2xl. The full set does not fit
 * inside the 1360px container at xl — it overflowed and clipped the CTA.
 * Every link remains reachable from the mobile menu, footer and category grid.
 */
const NAV_LINKS = [
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Maps', href: '/marketplace?category=maps' },
  { label: 'Assets', href: '/marketplace?category=assets' },
  { label: 'GUI', href: '/marketplace?category=gui' },
  { label: 'Scripts', href: '/marketplace?category=scripts' },
  { label: 'Vehicles', href: '/marketplace?category=vehicles', wide: true },
  { label: 'Packs', href: '/marketplace?category=packs', wide: true },
  { label: 'New Releases', href: '/new-releases' },
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
            ? 'border-b border-line bg-base/80 backdrop-blur-xl supports-[backdrop-filter]:bg-base/65 [box-shadow:inset_0_-1px_0_rgb(255_255_255/0.04),0_8px_24px_-16px_rgb(0_0_0/0.9)]'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container flex h-16 items-center gap-4 lg:h-[72px]">
          <Logo wordmarkTop={brand.wordmarkTop} wordmarkBottom={brand.wordmarkBottom} />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href.split('?')[0] && !link.href.includes('?');
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'relative whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                    active ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    link.wide && 'hidden 2xl:block',
                  )}
                >
                  {link.label}
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
              aria-label="Search"
            >
              <Search />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Join our Discord"
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
              aria-label="My library"
              className="hidden sm:inline-flex"
            >
              <Link href="/library">
                <User />
              </Link>
            </Button>

            <button
              type="button"
              onClick={cart.openCart}
              aria-label={`Cart, ${cart.count} item${cart.count === 1 ? '' : 's'}`}
              className="relative grid size-10 cursor-pointer place-items-center rounded-xl text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
            >
              <ShoppingCart className="size-[18px]" />
              <AnimatePresence>
                {cart.count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-brand text-[10px] font-bold text-white"
                  >
                    {cart.count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Button asChild className="ml-1 hidden md:inline-flex">
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
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
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X />
            </Button>
          </div>
          <nav className="flex flex-col p-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="hairline my-3" />
            <Link
              href="/library"
              className="rounded-xl px-3 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
            >
              My Library
            </Link>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
            >
              <DiscordIcon className="size-4" /> Discord
            </a>
          </nav>
          <div className="mt-auto border-t border-line p-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile search sheet */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-24 max-w-xl translate-y-0 p-4" showClose={false}>
          <DialogTitle className="sr-only">Search products</DialogTitle>
          <SearchDropdown autoFocus />
        </DialogContent>
      </Dialog>
    </>
  );
}
