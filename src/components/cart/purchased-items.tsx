'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/store/cart-store';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export function PurchasedItems({ order }: { order: Order }) {
  const cart = useCart();
  const [downloading, setDownloading] = useState<string | null>(null);

  // The basket has served its purpose once the order exists.
  useEffect(() => {
    if (order.status === 'paid') cart.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.status]);

  const download = async (productId: string) => {
    setDownloading(productId);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        toast.error(data.error ?? 'Download failed.');
        return;
      }
      window.location.href = data.url;
    } finally {
      setDownloading(null);
    }
  };

  return (
    <ul className="space-y-3">
      {order.items.map((item) => (
        <li key={item.productId} className="surface-card flex flex-wrap items-center gap-4 p-4">
          <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl bg-surface-overlay">
            <Image src={item.thumbnail} alt="" fill sizes="112px" className="object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-display font-semibold text-ink">{item.name}</p>
            <p className="text-sm text-ink-subtle">{formatPrice(item.price)}</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => download(item.productId)}
              loading={downloading === item.productId}
            >
              <Download /> Download Files
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label={`View ${item.name}`}>
              <Link href={`/product/${item.slug}`}>
                <ExternalLink />
              </Link>
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
