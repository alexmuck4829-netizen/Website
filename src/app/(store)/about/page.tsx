import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Gem, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscordCTA } from '@/components/layout/discord-cta';
import { Reveal } from '@/components/ui/reveal';
import { absoluteUrlSafe } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About',
  description:
    'One More Click Studio builds production-ready resources for Roblox creators — maps, assets, interfaces and systems that save weeks of work.',
  alternates: { canonical: absoluteUrlSafe('/about') },
};

const VALUES = [
  {
    icon: Gem,
    title: 'Finished, not almost finished',
    text: 'Interiors are built, pivots are correct, lighting is tuned. The last 10% is where most asset packs stop and where we start.',
  },
  {
    icon: Clock,
    title: 'Your time is the point',
    text: 'Every product exists to remove a week from your schedule. If it does not do that, it does not go in the store.',
  },
  {
    icon: ShieldCheck,
    title: 'Honest product pages',
    text: 'Real screenshots, real file sizes, real limitations. You should know exactly what you are buying before you click.',
  },
  {
    icon: MessageSquare,
    title: 'Support that answers',
    text: 'Our Discord is where questions get answered — usually by the people who built the thing you are asking about.',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 py-12 lg:py-20">
      <div className="container max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">About us</p>
        <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          We build the parts of your game you would rather not build twice.
        </h1>
        <div className="space-y-4 text-pretty text-lg leading-relaxed text-ink-muted">
          <p>
            One More Click Studio started the way most of these things do: we kept rebuilding the
            same inventory system, the same city block, the same vehicle chassis on project after
            project. Eventually it made more sense to build them properly once.
          </p>
          <p>
            Everything in the store has been used in a real project before it was sold. That is the
            filter — not whether it looks good in a screenshot, but whether it survived contact with
            an actual game.
          </p>
        </div>
      </div>

      <div className="container grid gap-4 sm:grid-cols-2">
        {VALUES.map((value, i) => (
          <Reveal key={value.title} delay={i * 0.06}>
            <div className="surface-card h-full space-y-3 p-6">
              <span className="grid size-11 place-items-center rounded-xl border border-line bg-surface-overlay text-brand">
                <value.icon className="size-5" />
              </span>
              <h2 className="font-display text-lg font-semibold text-ink">{value.title}</h2>
              <p className="leading-relaxed text-ink-muted">{value.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="container flex justify-center">
        <Button size="lg" asChild>
          <Link href="/marketplace">Explore the marketplace</Link>
        </Button>
      </div>

      <DiscordCTA />
    </div>
  );
}
