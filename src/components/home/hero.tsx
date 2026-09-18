'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Blocks, CheckCircle2, Gem, ShieldCheck, Sparkles, Zap, type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BlurReveal, Counter, Magnetic, ScrollDrift, Spotlight, Tilt, usePrefersReducedMotion,
} from '@/components/ui/motion';
import { CATEGORY_MAP } from '@/lib/constants';
import type { Product, SiteSettings } from '@/lib/types';
import { effectivePrice, formatPrice } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const REASSURANCE_ICONS: LucideIcon[] = [ShieldCheck, Zap, Blocks, Gem, CheckCircle2];

export function Hero({
  products,
  hero,
}: {
  products: Product[];
  hero: SiteSettings['hero'];
}) {
  const reduce = usePrefersReducedMotion();
  const showcase = products.slice(0, 4);

  return (
    <section className="relative overflow-hidden">
      {/* Lavis de teinte : la seule « profondeur » admise sur canevas clair. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-blob left-[4%] top-[-12rem] size-[40rem] bg-brand/[0.07]" />
        <div className="glow-blob right-[-8%] top-[2rem] size-[34rem] bg-electric/[0.06]" />
        <div className="glow-blob left-[34%] top-[20rem] size-[26rem] bg-lavender/20" />
      </div>

      <div className="container grid gap-14 pb-16 pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-24">
        {/* ---------------- Texte ---------------- */}
        <div className="max-w-xl">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="card inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-ink-muted">
              <Sparkles className="size-3.5 text-brand" />
              {hero.badge}
            </span>
          </motion.div>

          <h1 className="mt-6 text-balance font-display text-[2.6rem] font-light leading-[1.04] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.1rem]">
            <BlurReveal text={hero.titleLine1} as="span" className="block" />
            <BlurReveal text={hero.titleLine2} as="span" className="block" delay={0.12} />
            <BlurReveal
              text={hero.titleAccent}
              as="span"
              className="block"
              wordClassName={() => 'brand-gradient-text'}
              delay={0.28}
            />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
            className="mt-6 text-pretty text-lede text-ink-muted"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Button size="lg" asChild>
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowRight className="transition-transform duration-300 ease-premium group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </Magnetic>
            <Button size="lg" variant="secondary" asChild>
              <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
            </Button>
          </motion.div>

          {/* ---- Compteurs ---- */}
          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.66 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded border border-line bg-line"
          >
            {hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative bg-base px-4 py-3.5 transition-all duration-300 ease-premium hover:z-10 hover:bg-brand-soft"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-xl font-normal tracking-[-0.025em] text-ink transition-colors duration-300 group-hover:text-brand sm:text-2xl">
                  <Counter to={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                </dd>
                <p className="mt-0.5 text-[11px] leading-tight text-ink-subtle">{stat.label}</p>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------------- Vitrine ---------------- */}
        <div className="relative">
          <ScrollDrift distance={70}>
            {showcase.length > 0 ? (
              <div className="relative mx-auto grid max-w-lg grid-cols-2 gap-4 lg:max-w-none">
                {showcase.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={reduce ? false : { opacity: 0, y: 60, rotateX: 24, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.12, ease: EASE }}
                    style={{ transformPerspective: 1200, transformOrigin: 'center bottom' }}
                    className={i % 2 === 1 ? 'lg:translate-y-10' : i === 0 ? 'lg:-translate-y-2' : ''}
                  >
                    <ShowcaseCard product={product} priority={i < 2} float={!reduce} index={i} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyShowcase />
            )}
          </ScrollDrift>
        </div>
      </div>

      {/* ---- Bandeau de réassurance ---- */}
      <div className="container pb-4">
        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {hero.reassurance.map((label, i) => {
            const Icon = REASSURANCE_ICONS[i % REASSURANCE_ICONS.length];
            return (
              <li
                key={label}
                className="group flex items-center gap-2 text-sm text-ink-muted transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:text-brand"
              >
                <Icon className="size-4 text-brand transition-transform duration-300 ease-spring group-hover:-rotate-12 group-hover:scale-150 motion-reduce:group-hover:transform-none" />
                {label}
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

/**
 * Boutique encore vide (catalogue de démonstration supprimé, aucun produit
 * publié) : on montre un panneau de marque plutôt qu'une colonne blanche.
 */
function EmptyShowcase() {
  return (
    <div className="card relative mx-auto grid aspect-[4/3] max-w-lg place-items-center overflow-hidden bg-surface lg:max-w-none">
      <div className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.06] via-transparent to-electric/[0.06]" />
      <div className="relative flex flex-col items-center gap-3 px-8 text-center">
        <span className="grid size-12 place-items-center rounded bg-brand-gradient text-white">
          <Blocks className="size-6" />
        </span>
        <p className="font-display text-lg font-light tracking-[-0.02em] text-ink">
          Le catalogue arrive
        </p>
        <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
          Les premières ressources apparaîtront ici dès qu&apos;un produit sera publié.
        </p>
      </div>
    </div>
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
    ? { variant: 'best' as const, label: 'Meilleure vente' }
    : product.newRelease
      ? { variant: 'new' as const, label: 'Nouveau' }
      : { variant: 'popular' as const, label: 'Populaire' };

  return (
    <motion.div
      animate={float ? { y: [0, index % 2 === 0 ? -8 : 8, 0] } : undefined}
      transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Tilt strength={12} scale={1.04}>
        <Spotlight className="card card-hover shimmer-border shine block overflow-hidden">
          <Link href={`/product/${product.slug}`} className="group block">
            <div className="relative aspect-[16/11] overflow-hidden bg-surface-overlay">
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 45vw, 22vw"
                priority={priority}
                className="object-cover transition-transform duration-[1100ms] ease-premium group-hover:scale-[1.16] motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet/45 to-transparent" />
              <Badge variant={badge.variant} className="absolute left-2.5 top-2.5">
                {badge.label}
              </Badge>
            </div>
            <div className="space-y-1 p-3.5">
              <p className="truncate font-display text-sm font-medium tracking-[-0.015em] text-ink transition-colors duration-300 group-hover:text-brand">
                {product.name}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-subtle">
                  {CATEGORY_MAP[product.category]?.name}
                </span>
                <span className="text-sm font-medium text-ink">
                  {formatPrice(effectivePrice(product))}
                </span>
              </div>
            </div>
          </Link>
        </Spotlight>
      </Tilt>
    </motion.div>
  );
}
