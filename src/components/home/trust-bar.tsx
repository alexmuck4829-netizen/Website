'use client';

import {
  Blocks, Boxes, Clock, Gem, Headphones, Layers, RefreshCw, ShieldCheck, Sparkles, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';
import { Marquee, ScrollStagger, ScrollStaggerItem } from '@/components/ui/motion';
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
  return (
    <section className="container space-y-6">
      <ScrollStagger
        className="grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.09}
      >
        {points.map((point) => {
          const Icon = ICONS[point.icon] ?? Sparkles;
          const colour = point.colour ?? '#533AFD';
          return (
          <ScrollStaggerItem key={point.title} className="h-full">
            <div className="group relative flex h-full items-start gap-3.5 overflow-hidden bg-base p-5">
              {/* Le fond se remplit depuis le bas au survol */}
              <span
                className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-premium group-hover:scale-y-100 motion-reduce:hidden"
                style={{ background: `${colour}0d` }}
              />
              <span
                className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded border transition-all duration-500 ease-spring group-hover:-translate-y-1 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:group-hover:transform-none"
                style={{ background: `${colour}12`, borderColor: `${colour}33`, color: colour }}
              >
                <span
                  className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-premium group-hover:scale-y-100 motion-reduce:hidden"
                  style={{ background: colour }}
                />
                <Icon className="relative size-[18px] transition-colors duration-300 group-hover:text-white" />
              </span>
              <div className="relative space-y-0.5">
                <p className="text-sm font-medium text-ink transition-transform duration-500 ease-premium group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0">
                  {point.title}
                </p>
                <p className="text-sm text-ink-muted">{point.description}</p>
              </div>
            </div>
          </ScrollStaggerItem>
          );
        })}
      </ScrollStagger>

      {/* Category ticker — quiet motion that signals catalogue breadth */}
      <Marquee speed={45} className="py-1">
        {ticker.map((label) => (
          <span
            key={label}
            className="group/chip flex shrink-0 cursor-default items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-base px-4 py-2 text-sm text-ink-muted transition-all duration-300 ease-spring hover:-translate-y-1 hover:scale-105 hover:border-brand/50 hover:bg-brand-soft hover:text-brand motion-reduce:hover:transform-none"
          >
            <span className="size-1.5 rounded-full bg-brand/60 transition-transform duration-300 ease-spring group-hover/chip:scale-150" />
            {label}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
