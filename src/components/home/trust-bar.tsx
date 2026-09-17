'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Blocks, Gem, ShieldCheck, Zap } from 'lucide-react';
import { Marquee } from '@/components/ui/motion';

const POINTS = [
  { icon: Zap, title: 'Instant download', description: 'Files unlock the moment payment clears.', colour: '#FFBD2E' },
  { icon: Gem, title: 'High quality assets', description: 'Optimised, tested, production-ready.', colour: '#22D3EE' },
  { icon: ShieldCheck, title: 'Secure checkout', description: 'Payments handled by Stripe.', colour: '#3AD685' },
  { icon: Blocks, title: 'Ready for Roblox Studio', description: 'Drop in, publish, keep building.', colour: '#0084FF' },
] as const;

const TICKER = [
  'Maps', 'Vehicles', 'GUI kits', 'Luau systems', 'Low-poly assets', 'Buildings',
  'Street props', 'Build kits', 'Complete packs', 'Terrain', 'HUDs', 'Interiors',
];

export function TrustBar() {
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
        {POINTS.map((point) => (
          <li
            key={point.title}
            className="group relative flex items-start gap-3.5 bg-surface p-5 transition-colors duration-300 hover:bg-surface-raised"
          >
            <span
              className="relative grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 ease-brick group-hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(160deg, ${point.colour}2b, ${point.colour}0d)`,
                boxShadow: `inset 0 1px 0 ${point.colour}4d, inset 0 -3px 0 rgb(0 0 0 / 0.45)`,
                color: point.colour,
              }}
            >
              <point.icon className="size-[18px]" />
            </span>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-ink">{point.title}</p>
              <p className="text-sm text-ink-muted">{point.description}</p>
            </div>
          </li>
        ))}
      </motion.ul>

      {/* Category ticker — quiet motion that signals catalogue breadth */}
      <Marquee speed={45} className="py-1">
        {TICKER.map((label) => (
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
