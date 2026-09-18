'use client';

import Link from 'next/link';
import {
  ArrowUpRight, Boxes, Building2, Car, Code2, Grid3x3, Lamp, LayoutDashboard, Map, Package,
  Sparkles, type LucideIcon,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/misc';
import { ScrollStagger, ScrollStaggerItem, Spotlight } from '@/components/ui/motion';
import { PUBLIC_CATEGORIES } from '@/lib/constants';
import type { CategorySlug, SiteSettings } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = {
  Map, Boxes, LayoutDashboard, Code2, Car, Building2, Lamp, Grid3x3, Package, Sparkles,
};

export function CategoryGrid({
  counts,
  sections,
}: {
  counts: Record<CategorySlug, number>;
  sections: SiteSettings['sections'];
}) {
  return (
    <section className="container space-y-10">
      <SectionHeading
        eyebrow={sections.categoriesEyebrow}
        title={sections.categoriesTitle}
        description={sections.categoriesDescription}
      />

      <ScrollStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
        {PUBLIC_CATEGORIES.map((category) => {
          const Icon = ICONS[category.icon] ?? Boxes;
          const count = counts[category.slug] ?? 0;
          const [from, to] = category.accent;

          return (
            <ScrollStaggerItem key={category.slug} className="h-full">
              <Spotlight className="card card-hover block h-full">
                <Link
                  href={`/marketplace?category=${category.slug}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden p-5"
                >
                  {/* Le lavis de la catégorie inonde la carte au survol */}
                  <div
                    className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 opacity-0 transition-all duration-500 ease-premium group-hover:scale-y-100 group-hover:opacity-100 motion-reduce:hidden"
                    style={{ background: `linear-gradient(160deg, ${from}14, ${to}0a)` }}
                  />
                  {/* Halo d'angle, présent au repos, plus dense au survol */}
                  <div
                    className="pointer-events-none absolute -right-14 -top-14 size-44 rounded-full opacity-[0.08] blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-25 group-hover:blur-xl"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  />

                  <div className="relative space-y-4">
                    {/* La pastille se retourne et se remplit */}
                    <span
                      className="relative grid size-12 place-items-center overflow-hidden rounded border transition-all duration-500 ease-spring group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-6 motion-reduce:group-hover:transform-none"
                      style={{ background: `${from}0f`, borderColor: `${from}33`, color: from }}
                    >
                      <span
                        className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-premium group-hover:scale-y-100 motion-reduce:hidden"
                        style={{ background: from }}
                      />
                      <Icon className="relative size-5 transition-colors duration-300 group-hover:text-white" />
                    </span>

                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-ink transition-transform duration-500 ease-premium group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0">
                        {category.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-ink-muted">{category.tagline}</p>
                    </div>
                  </div>

                  <div className="relative mt-6 flex items-center justify-between border-t border-line pt-4 transition-colors duration-300 group-hover:border-current/20">
                    <span className="text-xs font-medium text-ink-subtle">
                      {count} {count === 1 ? 'produit' : 'produits'}
                    </span>
                    <span
                      className="grid size-7 place-items-center rounded-full transition-all duration-500 ease-spring group-hover:scale-110"
                      style={{ background: `${from}12`, color: from }}
                    >
                      <ArrowUpRight className="size-4 transition-transform duration-500 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Spotlight>
            </ScrollStaggerItem>
          );
        })}
      </ScrollStagger>
    </section>
  );
}
