'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Download, ExternalLink, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CATEGORY_MAP } from '@/lib/constants';
import type { LibraryEntry, Product } from '@/lib/types';
import { formatBytes, formatDate } from '@/lib/utils';

export function LibraryList({ entries }: { entries: LibraryEntry[] }) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [changelogFor, setChangelogFor] = useState<Product | null>(null);

  const download = async (productId: string, fileId?: string) => {
    setDownloading(productId);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, fileId }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        toast.error(data.error ?? 'Download failed.');
        return;
      }
      toast.success('Download link ready', { description: 'Valid for 5 minutes.' });
      window.location.href = data.url;
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      <ul className="space-y-4">
        {entries.map(({ product, purchasedAt }) => (
          <li key={product.id} className="surface-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/product/${product.slug}`}
                className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-surface-overlay sm:w-48"
              >
                <Image
                  src={product.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-display text-lg font-semibold text-ink transition-colors hover:text-brand"
                    >
                      {product.name}
                    </Link>
                    <Badge variant="neutral">v{product.specs.version}</Badge>
                  </div>
                  <p className="text-sm text-ink-subtle">
                    {CATEGORY_MAP[product.category]?.name} · Purchased {formatDate(purchasedAt)}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {product.files.length} file{product.files.length === 1 ? '' : 's'} ·{' '}
                    {product.specs.fileSize}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => download(product.id)}
                    loading={downloading === product.id}
                  >
                    <Download /> Download
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href={`/product/${product.slug}`}>
                      <ExternalLink /> View Product
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={() => setChangelogFor(product)}>
                    <History /> Changelog
                  </Button>
                </div>
              </div>
            </div>

            {/* Per-file downloads when a product ships several */}
            {product.files.length > 1 && (
              <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                {product.files.map((file) => (
                  <li key={file.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate text-ink-muted">{file.name}</span>
                    <span className="shrink-0 text-xs text-ink-subtle">
                      {formatBytes(file.size)}
                    </span>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => download(product.id, file.id)}
                      aria-label={`Download ${file.name}`}
                    >
                      <Download />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <Dialog open={!!changelogFor} onOpenChange={(open) => !open && setChangelogFor(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto p-0">
          <DialogTitle className="border-b border-line p-5 font-display text-lg font-semibold">
            {changelogFor?.name} — version history
          </DialogTitle>
          <ol className="space-y-5 p-5">
            {changelogFor?.versions.map((version, i) => (
              <li key={version.version} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-ink">Version {version.version}</span>
                  <span className="text-xs text-ink-subtle">{formatDate(version.releasedAt)}</span>
                  {i === 0 && <Badge variant="success">Latest</Badge>}
                </div>
                <ul className="space-y-1">
                  {version.changelog.map((entry) => (
                    <li key={entry} className="text-sm text-ink-muted">
                      — {entry}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </>
  );
}
