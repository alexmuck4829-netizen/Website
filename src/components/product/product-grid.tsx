'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamicImport from 'next/dynamic';
import { ProductCard } from './product-card';

// The quick-view modal pulls in a dialog tree that most visitors never open.
const QuickView = dynamicImport(() => import('./quick-view').then((m) => m.QuickView), {
  ssr: false,
});
import { staggerContainer, staggerItem } from '@/components/ui/reveal';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ProductGrid({
  products,
  columns = 4,
  className,
  priorityCount = 0,
}: {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
  priorityCount?: number;
}) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  const cols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <>
      <motion.div
        className={cn('grid grid-cols-1 gap-5', cols, className)}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        {products.map((product, i) => (
          <motion.div key={product.id} variants={staggerItem}>
            <ProductCard
              product={product}
              onQuickView={setQuickView}
              priority={i < priorityCount}
              className="h-full"
            />
          </motion.div>
        ))}
      </motion.div>

      {quickView && (
        <QuickView
          product={quickView}
          open={!!quickView}
          onOpenChange={(open) => !open && setQuickView(null)}
        />
      )}
    </>
  );
}
