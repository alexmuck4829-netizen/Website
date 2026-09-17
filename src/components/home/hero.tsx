'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CATEGORY_MAP } from '@/lib/constants';
import type { Product } from '@/lib/types';
import { effectivePrice, formatPrice } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ products }: { products: Product[] }) {
  const reduce = useReducedMotion();
  const showcase = products.slice(0, 4);

  return (
    <section className="relative overflow-hidden">
      {/* Ambient background — kept subtle, no neon */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-blob left-[8%] top-[-6rem] size-[34rem] bg-brand/25" />
        <div className="glow-blob right-[-8%] top-[6rem] size-[30rem] bg-electric/16" />
        <div className="absolute inset-0 bg-grid-faint bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="container grid gap-14 pb-16 pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-24">
        {/* ---- Copy ---- */}
        <div className="max-w-xl">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-ink-muted backdrop-blur">
              <Sparkles className="size-3.5 text-brand" />
              New drops every week
            </span>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease }}
            className="mt-6 text-balance font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]"
          >
            Build Better
            <br />
            Roblox Games.
            <span className="brand-gradient-text"> Faster.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease }}
            className="mt-6 text-pretty text-lg leading-relaxed text-ink-muted"
          >
            Premium maps, assets, interfaces and development resources made for ambitious Roblox
            creators.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/marketplace">
                Explore Marketplace <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/new-releases">View New Releases</Link>
            </Button>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['#7C5CFF', '#3D8BFF', '#34D399', '#F5A524'].map((c, i) => (
                  <span
                    key={c}
                    className="grid size-7 place-items-center rounded-full border-2 border-base text-[10px] font-bold text-white"
                    style={{ background: c, zIndex: 4 - i }}
                  >
                    {['V', 'M', 'L', 'K'][i]}
                  </span>
                ))}
              </div>
              <span className="text-sm text-ink-muted">
                <span className="font-semibold text-ink">12,000+</span> creators
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-3.5 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-sm text-ink-muted">
                <span className="font-semibold text-ink">4.8</span> average rating
              </span>
            </div>
          </motion.div>
        </div>

        {/* ---- Showcase ---- */}
        <div className="relative">
          <div className="relative mx-auto grid max-w-lg grid-cols-2 gap-4 lg:max-w-none">
            {showcase.map((product, i) => (
              <motion.div
                key={product.id}
                initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.75, delay: 0.16 + i * 0.09, ease }}
                className={
                  i % 2 === 1 ? 'lg:translate-y-10' : i === 0 ? 'lg:-translate-y-2' : ''
                }
              >
                <ShowcaseCard product={product} priority={i < 2} float={!reduce} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  product,
  priority,
  float,
  index,
}: {
  product: Product;
  priority: boolean;
  float: boolean;
  index: number;
}) {
  const badge = product.bestSeller
    ? { variant: 'best' as const, label: 'Best seller' }
    : product.newRelease
      ? { variant: 'new' as const, label: 'New' }
      : { variant: 'popular' as const, label: 'Popular' };

  return (
    <motion.div
      animate={float ? { y: [0, index % 2 === 0 ? -8 : 8, 0] } : undefined}
      transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="surface-card group block overflow-hidden transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-brand/30 hover:shadow-lift"
      >
        <div className="relative aspect-[16/11] overflow-hidden bg-surface-overlay">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 45vw, 22vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge variant={badge.variant} className="absolute left-2.5 top-2.5">
            {badge.label}
          </Badge>
        </div>
        <div className="space-y-1 p-3.5">
          <p className="truncate font-display text-sm font-semibold text-ink">{product.name}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-subtle">{CATEGORY_MAP[product.category]?.name}</span>
            <span className="text-sm font-semibold text-ink">
              {formatPrice(effectivePrice(product))}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
