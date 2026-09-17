'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileArchive, FileText, FolderOpen, Lock, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/misc';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/form';
import type { MediaAsset } from '@/lib/types';
import { formatBytes, formatDate } from '@/lib/utils';

export function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');

  const filtered = useMemo(
    () =>
      assets.filter((asset) => {
        if (kind !== 'all' && asset.kind !== kind) return false;
        if (!query.trim()) return true;
        const needle = query.toLowerCase();
        return (
          asset.filename.toLowerCase().includes(needle) ||
          (asset.productName?.toLowerCase().includes(needle) ?? false)
        );
      }),
    [assets, query, kind],
  );

  const totalSize = filtered.reduce((sum, a) => sum + a.size, 0);

  if (assets.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen />}
        title="Aucun fichier téléversé"
        description="Les fichiers téléversés depuis les onglets Médias ou Fichiers d’un produit apparaissent ici, avec le produit auquel ils appartiennent."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un fichier…"
            className="pl-10"
          />
        </div>

        <Select value={kind} onValueChange={setKind}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les fichiers</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="file">Fichiers produits</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <li key={asset.id} className="surface-card overflow-hidden">
            {asset.kind === 'image' && asset.url ? (
              <div className="relative aspect-[16/10] bg-surface-overlay">
                <Image
                  src={asset.url}
                  alt={asset.filename}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-surface-overlay">
                <div className="flex flex-col items-center gap-2 text-ink-subtle">
                  {asset.kind === 'document' ? (
                    <FileText className="size-8" />
                  ) : (
                    <FileArchive className="size-8" />
                  )}
                  <span className="flex items-center gap-1 text-xs text-success">
                    <Lock className="size-3" /> privé
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-1.5 p-3.5">
              <p className="truncate text-sm font-medium text-ink" title={asset.filename}>
                {asset.filename}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
                <Badge variant={asset.kind === 'image' ? 'popular' : 'success'}>{asset.kind}</Badge>
                <span>{formatBytes(asset.size)}</span>
                <span>{formatDate(asset.uploadedAt)}</span>
              </div>
              {asset.productName && (
                <p className="truncate text-xs text-ink-muted">
                  {asset.productId ? (
                    <Link
                      href={`/admin/products/${asset.productId}/edit`}
                      className="hover:text-brand"
                    >
                      {asset.productName}
                    </Link>
                  ) : (
                    asset.productName
                  )}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="text-sm text-ink-subtle">
        {filtered.length} fichiers · {formatBytes(totalSize)} au total
      </p>
    </div>
  );
}
