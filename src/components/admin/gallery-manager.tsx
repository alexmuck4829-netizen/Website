'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageIcon, Star, Trash2 } from 'lucide-react';
import { Dropzone } from './dropzone';
import type { GalleryImage, MediaAsset } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Gallery editor: upload several screenshots, reorder them, delete one, or
 * promote one to be the product thumbnail.
 */
export function GalleryManager({
  images,
  onChange,
  onPromoteToThumbnail,
  productSlug,
  productId,
  productName,
}: {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  onPromoteToThumbnail: (url: string) => void;
  productSlug: string;
  productId?: string;
  productName?: string;
}) {
  const sorted = [...images].sort((a, b) => a.position - b.position);

  const reposition = (list: GalleryImage[]) =>
    onChange(list.map((image, index) => ({ ...image, position: index })));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    reposition(next);
  };

  const handleUploaded = (asset: MediaAsset) => {
    onChange([
      ...sorted,
      {
        id: asset.id,
        url: asset.url,
        alt: `${productName ?? 'Produit'} — capture ${sorted.length + 1}`,
        position: sorted.length,
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <Dropzone
        kind="gallery"
        productSlug={productSlug}
        productId={productId}
        productName={productName}
        accept="image/png,image/jpeg,image/webp,image/avif"
        multiple
        hint="PNG, JPG, WEBP ou AVIF · 8 Mo max chacun · déposez-en plusieurs à la fois"
        onUploaded={handleUploaded}
        compact
      />

      {sorted.length === 0 ? (
        <p className="flex items-center gap-2 rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-ink-subtle">
          <ImageIcon className="size-4" />
          Aucune capture pour l’instant. Les acheteurs jugent un produit là-dessus — ajoutez-en au moins trois.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((image, index) => (
            <li
              key={image.id}
              className="group relative overflow-hidden rounded-xl border border-line bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 p-2">
                <div className="flex gap-0.5">
                  <IconAction
                    label="Déplacer à gauche"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    icon={ChevronLeft}
                  />
                  <IconAction
                    label="Déplacer à droite"
                    onClick={() => move(index, 1)}
                    disabled={index === sorted.length - 1}
                    icon={ChevronRight}
                  />
                </div>

                <div className="flex gap-0.5">
                  <IconAction
                    label="Utiliser comme miniature"
                    onClick={() => onPromoteToThumbnail(image.url)}
                    icon={Star}
                  />
                  <IconAction
                    label="Supprimer"
                    onClick={() => reposition(sorted.filter((i) => i.id !== image.id))}
                    icon={Trash2}
                    danger
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {sorted.length > 0 && (
        <p className="text-xs text-ink-subtle">
          La première image apparaît en premier sur la fiche produit. Utilisez l’étoile pour
          promouvoir une image en miniature.
        </p>
      )}
    </div>
  );
}

function IconAction({
  label,
  onClick,
  icon: Icon,
  disabled,
  danger,
}: {
  label: string;
  onClick: () => void;
  icon: React.ElementType;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'grid size-7 cursor-pointer place-items-center rounded-lg text-ink-subtle transition-colors hover:bg-white/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30',
        danger && 'hover:bg-danger/10 hover:text-danger',
      )}
    >
      <Icon className="size-3.5" />
    </button>
  );
}
