import { ArrowRight, Bell, LifeBuoy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from './discord-icon';
import { SITE } from '@/lib/constants';

const PERKS = [
  { icon: LifeBuoy, label: 'Setup support', text: 'Stuck on an import? Ask and get an answer.' },
  { icon: Bell, label: 'Release alerts', text: 'New drops and updates announced first.' },
  { icon: Users, label: 'Creator community', text: 'Share builds, swap techniques, get feedback.' },
];

export function DiscordCTA() {
  return (
    <section className="container">
      <div className="surface-card relative overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="glow-blob -right-20 top-0 size-80 bg-[#5865F2]/20" />
        <div className="glow-blob -left-10 bottom-0 size-64 bg-brand/15" />

        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-3 py-1.5 text-xs font-medium text-[#A5B4FC]">
              <DiscordIcon className="size-3.5" /> Community
            </span>
            <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Build alongside other Roblox creators.
            </h2>
            <p className="max-w-xl text-pretty text-ink-muted sm:text-lg">
              Our Discord is where support happens, releases are announced first, and creators share
              what is working in their games. Free to join, no obligation to buy anything.
            </p>
            <Button size="lg" asChild>
              <a href={SITE.discordUrl} target="_blank" rel="noopener noreferrer">
                <DiscordIcon /> Join our Discord <ArrowRight />
              </a>
            </Button>
          </div>

          <ul className="grid gap-3">
            {PERKS.map((perk) => (
              <li
                key={perk.label}
                className="flex items-start gap-3.5 rounded-xl border border-line bg-surface/70 p-4 transition-colors duration-300 hover:border-line-strong"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#5865F2]/12 text-[#A5B4FC]">
                  <perk.icon className="size-[18px]" />
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-ink">{perk.label}</p>
                  <p className="text-sm text-ink-muted">{perk.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
