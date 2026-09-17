'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, Play, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { GalleryImage } from '@/lib/types';
import { cn, youtubeId } from '@/lib/utils';

export function Gallery({
  images,
  videoUrl,
  productName,
}: {
  images: GalleryImage[];
  videoUrl?: string | null;
  productName: string;
}) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const ordered = [...images].sort((a, b) => a.position - b.position);
  const current = ordered[index];
  const video = youtubeId(videoUrl);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + ordered.length) % ordered.length),
    [ordered.length],
  );

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen, go]);

  if (!current) return null;

  return (
    <div className="min-w-0 space-y-3">
      {/* Main viewport */}
      <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface-overlay">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={current.url}
              alt={`${productName} — screenshot ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority={index === 0}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {ordered.length > 1 && (
          <>
            <GalleryNav side="left" onClick={() => go(-1)} />
            <GalleryNav side="right" onClick={() => go(1)} />
          </>
        )}

        <div className="absolute right-3 top-3 flex gap-2">
          {video && (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/80"
            >
              <Play className="size-3.5 fill-white" /> Video preview
            </button>
          )}
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="View fullscreen"
            className="grid size-9 cursor-pointer place-items-center rounded-lg border border-white/10 bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80"
          >
            <Expand className="size-4" />
          </button>
        </div>

        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white/85 backdrop-blur-md">
          {index + 1} / {ordered.length}
        </span>
      </div>

      {/* Thumbnails — horizontally scrollable on touch */}
      {ordered.length > 1 && (
        <div className="no-scrollbar mask-fade-x flex gap-2.5 overflow-x-auto pb-1">
          {ordered.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'relative aspect-[16/10] w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 sm:w-28',
                i === index
                  ? 'border-brand opacity-100 ring-2 ring-brand/25'
                  : 'border-line opacity-60 hover:opacity-100',
              )}
            >
              <Image src={image.url} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent
          showClose={false}
          className="max-w-[min(96vw,1400px)] border-none bg-transparent p-0 shadow-none"
        >
          <DialogTitle className="sr-only">{productName} screenshots</DialogTitle>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black">
            <Image
              src={current.url}
              alt={`${productName} — screenshot ${index + 1}`}
              fill
              sizes="96vw"
              className="object-contain"
            />
            {ordered.length > 1 && (
              <>
                <GalleryNav side="left" onClick={() => go(-1)} />
                <GalleryNav side="right" onClick={() => go(1)} />
              </>
            )}
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 grid size-10 cursor-pointer place-items-center rounded-xl border border-white/10 bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80"
            >
              <X className="size-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video modal */}
      {video && (
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="max-w-4xl overflow-hidden p-0">
            <DialogTitle className="sr-only">{productName} video preview</DialogTitle>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video}${videoOpen ? '?autoplay=1' : ''}`}
                title={`${productName} video preview`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full border-0"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function GalleryNav({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous image' : 'Next image'}
      className={cn(
        'absolute top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-xl border border-white/10 bg-black/55 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/80',
        'opacity-0 group-hover:opacity-100 max-md:opacity-100',
        side === 'left' ? 'left-3' : 'right-3',
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}
