import {
  ArrowRight, Bell, Gift, LifeBuoy, MessageSquare, Sparkles, Users, type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from './discord-icon';
import { ScrollCurtain, ScrollWipe } from '@/components/ui/motion';
import { SettingsService } from '@/lib/services/settings-service';

const ICONS: Record<string, LucideIcon> = {
  LifeBuoy, Bell, Users, MessageSquare, Gift, Sparkles,
};

export async function DiscordCTA() {
  const settings = await SettingsService.get();
  const { discord, links } = settings;
  return (
    <section className="container">
      <ScrollCurtain rotate={9}>
      <div className="card relative overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="glow-blob -right-20 top-0 size-80 bg-[#5865F2]/[0.12] animate-float" />
        <div className="glow-blob -left-10 bottom-0 size-64 bg-brand/[0.10]" />

        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/35 bg-[#5865F2]/10 px-3 py-1.5 text-xs font-medium text-[#4451d6]">
              <DiscordIcon className="size-3.5" /> Communauté
            </span>
            <ScrollWipe y={56}>
              <h2 className="text-balance font-display text-3xl font-light tracking-[-0.028em] text-ink sm:text-4xl">
                {discord.title}
              </h2>
            </ScrollWipe>
            <ScrollWipe delay={0.1} y={28}>
              <p className="max-w-xl text-pretty text-ink-muted sm:text-lede">{discord.description}</p>
            </ScrollWipe>
            <Button size="lg" asChild>
              <a href={links.discordUrl} target="_blank" rel="noopener noreferrer">
                <DiscordIcon /> {discord.ctaLabel}
                <ArrowRight className="transition-transform duration-300 ease-premium group-hover/btn:translate-x-1" />
              </a>
            </Button>
          </div>

          <ul className="grid gap-3">
            {discord.perks.map((perk) => {
              const Icon = ICONS[perk.icon] ?? Sparkles;
              return (
                <li
                  key={perk.title}
                  className="group flex items-start gap-3.5 rounded border border-line bg-surface p-4 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-[#5865F2]/50 hover:bg-base hover:shadow-lift motion-reduce:hover:translate-y-0"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded bg-[#5865F2]/12 text-[#4451d6] transition-all duration-500 ease-spring group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-[#5865F2] group-hover:text-white motion-reduce:group-hover:transform-none">
                    <Icon className="size-[18px]" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-ink transition-transform duration-500 ease-premium group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0">
                      {perk.title}
                    </p>
                    <p className="text-sm text-ink-muted">{perk.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      </ScrollCurtain>
    </section>
  );
}
