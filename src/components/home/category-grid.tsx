'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight, Boxes, Building2, Car, Code2, Grid3x3, Lamp, LayoutDashboard, Map, Package,
  Sparkles, type LucideIcon,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/misc';
import { Spotlight } from '@/components/ui/motion';
import { PUBLIC_CATEGORIES } from '@/lib/constants';
import type { CategorySlug, SiteSettings } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = {
  Map, Boxes, LayoutDashboard, Code2, Car, Building2, Lamp, Grid3x3, Package, Sparkles,
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function CategoryGrid({
  counts,
  sections,
}: {
  counts: Record<CategorySlug, number>;
  sections: SiteSettings['sections'];
}) {
  const reduce = useReducedMotion();

  return (
    <section className="container space-y-10">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <SectionHeading
          eyebrow={sections.categoriesEyebrow}
          title={sections.categoriesTitle}
          description={sections.categoriesDescription}
        />
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PUBLIC_CATEGORIES.map((category, index) => {
          const Icon = ICONS[category.icon] ?? Boxes;
          const count = counts[category.slug] ?? 0;
          const [from, to] = category.accent;

          return (
            <motion.div
              key={category.slug}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
            >
              <Spotlight className="brick brick-press studs-top block h-full rounded-2xl">
                <Link
                  href={`/marketplace?category=${category.slug}`}
                  className="group relative flex h-full flex-col justify-between p-5"
                >
                  {/* Brick-coloured wash keyed to the category */}
                  <div
                    className="pointer-events-none absolute -right-14 -top-14 size-44 rounded-full opacity-[0.18] blur-2xl transition-all duration-500 group-hover:opacity-40 group-hover:blur-xl"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  />

                  <div className="relative space-y-4">
                    {/* Icon tile, moulded like a 1x1 brick */}
                    <span
                      className="relative grid size-12 place-items-center rounded-xl transition-transform duration-300 ease-brick group-hover:-translate-y-0.5 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(160deg, ${from}2e, ${to}14)`,
                        boxShadow: `inset 0 1px 0 ${from}55, inset 0 -3px 0 rgb(0 0 0 / 0.45), 0 4px 12px -4px ${from}55`,
                        color: from,
                      }}
                    >
                      <Icon className="size-5" />
                      {/* stud on the icon tile */}
                      <span
                        className="stud absolute -top-1 right-2 size-2.5"
                        style={{ background: `linear-gradient(160deg, ${from}, ${from}88)` }}
                      />
                    </span>

                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                        {category.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-ink-muted">{category.tagline}</p>
                    </div>
                  </div>

                  <div className="relative mt-6 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-xs font-semibold text-ink-subtle">
                      {count} {count === 1 ? 'produit' : 'produits'}
                    </span>
                    <ArrowUpRight
                      className="size-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      style={{ color: from }}
                    />
                  </div>
                </Link>
              </Spotlight>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
