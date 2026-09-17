'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Blocks, Boxes, Clock, Gem, Headphones, Layers, RefreshCw, ShieldCheck, Sparkles, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';
import { Marquee } from '@/components/ui/motion';
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
  const reduce = useReducedMotion();

  return (
    <section className="container space-y-6">
      <motion.ul
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
      >
        {points.map((point) => {
          const Icon = ICONS[point.icon] ?? Sparkles;
          const colour = point.colour ?? '#0084FF';
          return (
          <li
            key={point.title}
            className="group relative flex items-start gap-3.5 bg-surface p-5 transition-colors duration-300 hover:bg-surface-raised"
          >
            <span
              className="relative grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 ease-brick group-hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(160deg, ${colour}2b, ${colour}0d)`,
                boxShadow: `inset 0 1px 0 ${colour}4d, inset 0 -3px 0 rgb(0 0 0 / 0.45)`,
                color: colour,
              }}
            >
              <Icon className="size-[18px]" />
            </span>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-ink">{point.title}</p>
              <p className="text-sm text-ink-muted">{point.description}</p>
            </div>
          </li>
          );
        })}
      </motion.ul>

      {/* Category ticker — quiet motion that signals catalogue breadth */}
      <Marquee speed={45} className="py-1">
        {ticker.map((label) => (
          <span
            key={label}
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface/60 px-4 py-2 text-sm text-ink-muted"
          >
            <span className="stud size-2 bg-brand/70" />
            {label}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
