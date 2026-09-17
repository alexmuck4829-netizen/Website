'use client';

import { Toaster } from 'sonner';
import { CartProvider } from '@/lib/store/cart-store';
import { WishlistProvider } from '@/lib/store/wishlist-store';
import { CartDrawer } from './cart-drawer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <CartDrawer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgb(29 29 40)',
              border: '1px solid rgb(55 55 71)',
              color: 'rgb(237 237 242)',
            },
          }}
        />
      </WishlistProvider>
    </CartProvider>
  );
}
