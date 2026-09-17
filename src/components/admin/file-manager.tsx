'use client';

import { FileArchive, FileText, Lock, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/form';
import { Dropzone } from './dropzone';
import type { MediaAsset, ProductFile } from '@/lib/types';
import { formatBytes, formatDate } from '@/lib/utils';

/**
 * Manages the files customers actually pay for.
 * These land in the PRIVATE bucket — nothing here is reachable by URL.
 */
export function FileManager({
  files,
  onChange,
  productSlug,
  productId,
  productName,
  version,
}: {
  files: ProductFile[];
  onChange: (files: ProductFile[]) => void;
  productSlug: string;
  productId?: string;
  productName?: string;
  version: string;
}) {
  const handleUploaded = (asset: MediaAsset) => {
    onChange([
      ...files,
      {
        id: asset.id,
        name: asset.filename,
        storageKey: asset.storageKey,
        size: asset.size,
        type: asset.type,
        version,
        uploadedAt: asset.uploadedAt,
      },
    ]);
  };

  const setVersion = (id: string, value: string) =>
    onChange(files.map((f) => (f.id === id ? { ...f, version: value } : f)));

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-success/25 bg-success/8 p-4">
        <Lock className="mt-0.5 size-4 shrink-0 text-success" />
        <p className="text-sm leading-relaxed text-ink-muted">
          Ces fichiers sont stockés dans un <strong className="text-ink">bucket privé</strong>, hors de{' '}
          <code className="rounded bg-black/40 px-1 font-mono text-xs">/public</code>. Les clients ne
          reçoivent qu’un lien signé expirant au bout de 5 minutes, et uniquement après
          vérification d’une commande payée.
        </p>
      </div>

      <Dropzone
        kind="product-file"
        productSlug={productSlug}
        productId={productId}
        productName={productName}
        accept=".zip,.rbxl,.rbxlx,.rbxm,.rbxmx,.lua,.luau,.txt,.pdf,.md,.json"
        multiple
        hint="ZIP, RBXL, RBXLX, RBXM, RBXMX, LUA, PDF… · 500 Mo max chacun"
        onUploaded={handleUploaded}
      />

      {files.length === 0 ? (
        <p className="rounded-xl border border-gold/25 bg-gold/8 px-4 py-3 text-sm text-ink-muted">
          Aucun fichier attaché. Un produit publié sans fichier ne peut pas être livré — les clients
          verront une erreur au téléchargement.
        </p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/70 p-3.5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-surface-overlay text-brand">
                {file.type.includes('pdf') ? (
                  <FileText className="size-[18px]" />
                ) : (
                  <FileArchive className="size-[18px]" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{file.name}</p>
                <p className="text-xs text-ink-subtle">
                  {formatBytes(file.size)} · {file.type || 'binaire'} ·{' '}
                  {file.uploadedAt ? formatDate(file.uploadedAt) : 'en attente'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  v
                  <Input
                    value={file.version}
                    onChange={(e) => setVersion(file.id, e.target.value)}
                    className="h-8 w-16 px-2 text-xs"
                    aria-label={`Version de ${file.name}`}
                  />
                </label>

                {!file.storageKey && <Badge variant="draft">demo</Badge>}

                <button
                  type="button"
                  onClick={() => onChange(files.filter((f) => f.id !== file.id))}
                  aria-label={`Retirer ${file.name}`}
                  className="cursor-pointer rounded-lg p-2 text-ink-subtle transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
