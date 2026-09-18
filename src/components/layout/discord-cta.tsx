import {
  ArrowRight, Bell, Gift, LifeBuoy, MessageSquare, Sparkles, Users, type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from './discord-icon';
import { SettingsService } from '@/lib/services/settings-service';

const ICONS: Record<string, LucideIcon> = {
  LifeBuoy, Bell, Users, MessageSquare, Gift, Sparkles,
};

export async function DiscordCTA() {
  const settings = await SettingsService.get();
  const { discord, links } = settings;
  return (
    <section className="container">
      <div className="surface-card relative overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="glow-blob -right-20 top-0 size-80 bg-[#5865F2]/20" />
        <div className="glow-blob -left-10 bottom-0 size-64 bg-brand/15" />

        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-3 py-1.5 text-xs font-medium text-[#A5B4FC]">
              <DiscordIcon className="size-3.5" /> Communauté
            </span>
            <h2 className="text-balance font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              {discord.title}
            </h2>
            <p className="max-w-xl text-pretty text-ink-muted sm:text-lg">{discord.description}</p>
            <Button size="lg" asChild>
              <a href={links.discordUrl} target="_blank" rel="noopener noreferrer">
                <DiscordIcon /> {discord.ctaLabel} <ArrowRight />
              </a>
            </Button>
          </div>

          <ul className="grid gap-3">
            {discord.perks.map((perk) => {
              const Icon = ICONS[perk.icon] ?? Sparkles;
              return (
                <li
                  key={perk.title}
                  className="flex items-start gap-3.5 rounded-xl border border-line bg-surface/70 p-4 transition-colors duration-300 hover:border-line-strong"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#5865F2]/12 text-[#A5B4FC]">
                    <Icon className="size-[18px]" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-ink">{perk.title}</p>
                    <p className="text-sm text-ink-muted">{perk.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
