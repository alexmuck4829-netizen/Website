'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Blocks, CheckCircle2, Gem, ShieldCheck, Sparkles, Zap, type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BlurReveal, Counter, Magnetic, Parallax, Spotlight, StudRow, Tilt,
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
  const reduce = useReducedMotion();
  const showcase = products.slice(0, 4);

  return (
    <section className="relative overflow-hidden">
      {/* ---- Ambient layers: stud field + brick-coloured glow ---- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-blob left-[6%] top-[-8rem] size-[36rem] bg-brand/28" />
        <div className="glow-blob right-[-6%] top-[4rem] size-[30rem] bg-violet/20" />
        <div className="glow-blob left-[38%] top-[18rem] size-[24rem] bg-electric/14" />
        <div className="stud-field absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="container grid gap-14 pb-16 pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-24">
        {/* ---------------- Copy ---------------- */}
        <div className="max-w-xl">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-3"
          >
            <span className="brick inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink-muted">
              <Sparkles className="size-3.5 text-brand" />
              {hero.badge}
            </span>
            <StudRow count={4} colors={['#F45656', '#FFBD2E', '#3AD685', '#0084FF']} />
          </motion.div>

          <h1 className="mt-6 text-balance font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
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
            className="mt-6 text-pretty text-lg leading-relaxed text-ink-muted"
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
                  {hero.primaryCta.label} <ArrowRight />
                </Link>
              </Button>
            </Magnetic>
            <Button size="lg" variant="secondary" asChild>
              <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
            </Button>
          </motion.div>

          {/* ---- Live counters ---- */}
          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.66 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line"
          >
            {hero.stats.map((stat) => (
              <div key={stat.label} className="bg-surface/90 px-4 py-3.5">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  <Counter to={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                </dd>
                <p className="mt-0.5 text-[11px] leading-tight text-ink-subtle">{stat.label}</p>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------------- Showcase ---------------- */}
        <div className="relative">
          <Parallax offset={24}>
            <div className="relative mx-auto grid max-w-lg grid-cols-2 gap-4 lg:max-w-none">
              {showcase.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={reduce ? false : { opacity: 0, y: 34, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: EASE }}
                  className={i % 2 === 1 ? 'lg:translate-y-10' : i === 0 ? 'lg:-translate-y-2' : ''}
                >
                  <ShowcaseCard product={product} priority={i < 2} float={!reduce} index={i} />
                </motion.div>
              ))}
            </div>
          </Parallax>
        </div>
      </div>

      {/* ---- Reassurance strip, moulded into the section edge ---- */}
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
              <li key={label} className="flex items-center gap-2 text-sm text-ink-muted">
                <Icon className="size-4 text-brand" />
                {label}
              </li>
            );
          })}
        </motion.ul>
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
      <Tilt strength={6}>
        <Spotlight className="brick brick-press studs-top shimmer-border block rounded-2xl">
          <Link href={`/product/${product.slug}`} className="group block">
            <div className="relative aspect-[16/11] overflow-hidden rounded-t-2xl bg-surface-overlay">
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 45vw, 22vw"
                priority={priority}
                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <Badge variant={badge.variant} className="absolute left-2.5 top-2.5">
                {badge.label}
              </Badge>
            </div>
            <div className="space-y-1 p-3.5">
              <p className="truncate font-display text-sm font-semibold text-ink">{product.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-subtle">
                  {CATEGORY_MAP[product.category]?.name}
                </span>
                <span className="text-sm font-bold text-ink">
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
