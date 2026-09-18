import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Gem, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscordCTA } from '@/components/layout/discord-cta';
import { Reveal } from '@/components/ui/reveal';
import { absoluteUrlSafe } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'One More Click Studio conçoit des ressources prêtes pour la production destinées aux créateurs Roblox — maps, assets, interfaces et systèmes qui font gagner des semaines.',
  alternates: { canonical: absoluteUrlSafe('/about') },
};

const VALUES = [
  {
    icon: Gem,
    title: 'Fini, pas presque fini',
    text: 'Les intérieurs sont construits, les pivots sont justes, l’éclairage est réglé. Les 10 derniers pour cent sont là où la plupart des packs s’arrêtent et où nous commençons.',
  },
  {
    icon: Clock,
    title: 'Votre temps est l’enjeu',
    text: 'Chaque produit existe pour retirer une semaine de votre planning. S’il ne le fait pas, il n’entre pas dans la boutique.',
  },
  {
    icon: ShieldCheck,
    title: 'Des fiches produit honnêtes',
    text: 'De vraies captures, de vraies tailles de fichiers, de vraies limites. Vous devez savoir exactement ce que vous achetez avant de cliquer.',
  },
  {
    icon: MessageSquare,
    title: 'Un support qui répond',
    text: 'Notre Discord est l’endroit où les questions trouvent réponse — en général auprès de ceux qui ont construit ce dont vous parlez.',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 py-12 lg:py-20">
      <div className="container max-w-3xl space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">À propos</p>
        <h1 className="text-balance font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Nous construisons les parties de votre jeu que vous préférez ne pas refaire deux fois.
        </h1>
        <div className="space-y-4 text-pretty text-lg leading-relaxed text-ink-muted">
          <p>
            One More Click Studio a commencé comme la plupart de ces projets : nous refaisions sans
            cesse le même système d’inventaire, le même quartier, le même châssis de véhicule, projet
            après projet. À un moment, il devenait plus logique de les construire correctement une
            bonne fois.
          </p>
          <p>
            Tout ce qui se trouve dans la boutique a servi dans un vrai projet avant d’être vendu.
            C’est le filtre : pas de savoir si ça rend bien en capture, mais si ça a survécu au
            contact d’un vrai jeu.
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
              <h2 className="font-display text-lg font-medium text-ink">{value.title}</h2>
              <p className="leading-relaxed text-ink-muted">{value.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="container flex justify-center">
        <Button size="lg" asChild>
          <Link href="/marketplace">Explorer la marketplace</Link>
        </Button>
      </div>

      <DiscordCTA />
    </div>
  );
}
