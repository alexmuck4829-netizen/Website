import Link from 'next/link';
import {
  ArrowUpRight, Boxes, Building2, Car, Code2, Grid3x3, Lamp, LayoutDashboard, Map, Package,
  Sparkles, type LucideIcon,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/misc';
import { Reveal, StaggerGroup, staggerItem } from '@/components/ui/reveal';
import { PUBLIC_CATEGORIES } from '@/lib/constants';
import type { CategorySlug } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = {
  Map, Boxes, LayoutDashboard, Code2, Car, Building2, Lamp, Grid3x3, Package, Sparkles,
};

export function CategoryGrid({ counts }: { counts: Record<CategorySlug, number> }) {
  return (
    <section className="container space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow="Categories"
          title="Explore by Category"
          description="Every resource is sorted so you can find the missing piece instead of scrolling through everything."
        />
      </Reveal>

      <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PUBLIC_CATEGORIES.map((category) => {
          const Icon = ICONS[category.icon] ?? Boxes;
          const count = counts[category.slug] ?? 0;
          return (
            <Link
              key={category.slug}
              href={`/marketplace?category=${category.slug}`}
              className="surface-card group relative flex flex-col justify-between overflow-hidden p-5 transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-brand/30 hover:shadow-lift"
              style={{ ...(staggerItem as object) }}
            >
              {/* Category art: a soft gradient wash that intensifies on hover */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full opacity-[0.16] blur-2xl transition-all duration-500 group-hover:opacity-30 group-hover:blur-xl"
                style={{
                  background: `linear-gradient(135deg, ${category.accent[0]}, ${category.accent[1]})`,
                }}
              />

              <div className="relative space-y-4">
                <span
                  className="grid size-11 place-items-center rounded-xl border border-line bg-surface-overlay transition-transform duration-300 group-hover:scale-105"
                  style={{ color: category.accent[0] }}
                >
                  <Icon className="size-5" />
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {category.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{category.tagline}</p>
                </div>
              </div>

              <div className="relative mt-6 flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs font-medium text-ink-subtle">
                  {count} {count === 1 ? 'product' : 'products'}
                </span>
                <ArrowUpRight className="size-4 text-ink-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>
            </Link>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
