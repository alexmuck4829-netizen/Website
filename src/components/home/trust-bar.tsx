'use client';

import { motion } from 'framer-motion';
import {
  Blocks, Boxes, Clock, Gem, Headphones, Layers, RefreshCw, ShieldCheck, Sparkles, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';
import { Marquee, ScrollScene, usePrefersReducedMotion } from '@/components/ui/motion';
import type { SiteSettings } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = {
  Zap, Gem, ShieldCheck, Blocks, Boxes, Clock, Layers, Wrench, RefreshCw, Headphones, Sparkles,
};

export function TrustBar({
  points,
  ticker,
}: {
  points: SiteSettings['trust'];
  ticker: string[];
}) {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="container space-y-6">
      <ScrollScene rise={44} scaleFrom={0.97} blurFrom={4}>
      <motion.ul
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
      >
        {points.map((point) => {
          const Icon = ICONS[point.icon] ?? Sparkles;
          const colour = point.colour ?? '#533AFD';
          return (
          <li
            key={point.title}
            className="group relative flex items-start gap-3.5 bg-base p-5 transition-colors duration-300 hover:bg-surface"
          >
            <span
              className="relative grid size-11 shrink-0 place-items-center rounded border transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:scale-105"
              style={{
                background: `${colour}12`,
                borderColor: `${colour}33`,
                color: colour,
              }}
            >
              <Icon className="size-[18px]" />
            </span>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-ink">{point.title}</p>
              <p className="text-sm text-ink-muted">{point.description}</p>
            </div>
          </li>
          );
        })}
      </motion.ul>
      </ScrollScene>

      {/* Category ticker — quiet motion that signals catalogue breadth */}
      <Marquee speed={45} className="py-1">
        {ticker.map((label) => (
          <span
            key={label}
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-base px-4 py-2 text-sm text-ink-muted transition-colors duration-300 hover:border-brand/40 hover:text-brand"
          >
            <span className="size-1.5 rounded-full bg-brand/60" />
            {label}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
