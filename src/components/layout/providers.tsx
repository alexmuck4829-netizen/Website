'use client';

import { MotionConfig } from 'framer-motion';
import { Toaster } from 'sonner';
import { CartProvider } from '@/lib/store/cart-store';
import { WishlistProvider } from '@/lib/store/wishlist-store';
import { CartDrawer } from './cart-drawer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // `reducedMotion="user"` fait respecter la préférence système par Framer
    // lui-même : les composants n'ont plus besoin de rendre un arbre différent,
    // ce qui évitait le décalage d'hydratation (le serveur ne connaît pas la
    // préférence, le client si).
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <WishlistProvider>
          {children}
          <CartDrawer />
          <Toaster
            theme="light"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgb(var(--c-base))',
                border: '1px solid rgb(var(--c-line-strong))',
                color: 'rgb(var(--c-ink))',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgb(var(--c-violet) / 0.06), 0 18px 44px -24px rgb(var(--c-violet) / 0.22)',
              },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </MotionConfig>
  );
}
