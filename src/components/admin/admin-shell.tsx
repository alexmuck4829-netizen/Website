'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ExternalLink, FolderOpen, LayoutDashboard, LogOut, Menu, Package, Plus, Receipt, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/layout/logo';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: Receipt },
  { label: 'Media', href: '/admin/media', icon: FolderOpen },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNav, setMobileNav] = useState(false);

  const signOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileNav(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200',
              active
                ? 'bg-brand/12 text-brand'
                : 'text-ink-muted hover:bg-surface-raised hover:text-ink',
            )}
          >
            <item.icon className="size-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-base">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface/50 p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2.5 px-1">
          <LogoMark />
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-bold text-ink">OMC Studio</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink-subtle">Admin</span>
          </div>
        </Link>

        {nav}

        <div className="mt-auto space-y-2 border-t border-line pt-4">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/" target="_blank">
              <ExternalLink /> View store
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </div>
      </aside>

      {/* Topbar — mobile */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-base/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMobileNav(true)} aria-label="Open menu">
          <Menu />
        </Button>
        <Link href="/admin" className="flex items-center gap-2">
          <LogoMark className="size-8" />
          <span className="font-display text-sm font-bold text-ink">Admin</span>
        </Link>
        <Button size="sm" className="ml-auto" asChild>
          <Link href="/admin/products/new">
            <Plus /> New
          </Link>
        </Button>
      </header>

      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileNav(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-line bg-surface p-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display font-bold text-ink">Admin</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileNav(false)} aria-label="Close">
                <X />
              </Button>
            </div>
            {nav}
            <div className="mt-auto space-y-2 border-t border-line pt-4">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/" target="_blank">
                  <ExternalLink /> View store
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
                <LogOut /> Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
