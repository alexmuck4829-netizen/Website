'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPersistentStore } from './persistent-store';
import type { CartItem, Product } from '@/lib/types';
import { effectivePrice } from '@/lib/utils';

/**
 * Cart state. Digital goods, so quantity is always 1 per product — adding a
 * product twice is a no-op rather than an error the customer has to understand.
 * Persisted to localStorage and shared across tabs.
 */
const cartStore = createPersistentStore<CartItem[]>('omc.cart.v1', []);

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  hydrated: boolean;
  add: (product: Product) => { added: boolean };
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = cartStore.useValue();
  const hydrated = cartStore.useHydrated();
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((product: Product) => {
    if (cartStore.get().some((i) => i.productId === product.id)) return { added: false };

    cartStore.set((current) => [
      ...current,
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: effectivePrice(product),
        thumbnail: product.thumbnail,
        category: product.category,
        quantity: 1,
      },
    ]);
    return { added: true };
  }, []);

  const remove = useCallback((productId: string) => {
    cartStore.set((current) => current.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => cartStore.set([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      subtotal: items.reduce((sum, i) => sum + i.price, 0),
      isOpen,
      hydrated,
      add,
      remove,
      clear,
      has: (id: string) => items.some((i) => i.productId === id),
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      setOpen,
    }),
    [items, isOpen, hydrated, add, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
