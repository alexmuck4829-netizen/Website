'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { createPersistentStore } from './persistent-store';

const wishlistStore = createPersistentStore<string[]>('omc.wishlist.v1', []);

interface WishlistValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const ids = wishlistStore.useValue();

  const value = useMemo<WishlistValue>(
    () => ({
      ids,
      count: ids.length,
      has: (id) => ids.includes(id),
      toggle: (id) =>
        wishlistStore.set((current) =>
          current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
        ),
    }),
    [ids],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
