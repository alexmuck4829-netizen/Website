import { Blocks, Gem, ShieldCheck, Zap } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const ICONS = { Zap, Gem, ShieldCheck, Blocks } as const;

const POINTS = [
  { icon: 'Zap', title: 'Instant download', description: 'Files unlock the moment payment clears.' },
  { icon: 'Gem', title: 'High quality assets', description: 'Optimised, tested, production-ready.' },
  { icon: 'ShieldCheck', title: 'Secure checkout', description: 'Payments handled by Stripe.' },
  { icon: 'Blocks', title: 'Ready for Roblox Studio', description: 'Drop in, publish, keep building.' },
] as const;

export function TrustBar() {
  return (
    <section className="container">
      <Reveal>
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point) => {
            const Icon = ICONS[point.icon];
            return (
              <li
                key={point.title}
                className="group flex items-start gap-3.5 bg-surface p-5 transition-colors duration-300 hover:bg-surface-raised"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-overlay text-brand transition-colors duration-300 group-hover:border-brand/30">
                  <Icon className="size-[18px]" />
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-ink">{point.title}</p>
                  <p className="text-sm text-ink-muted">{point.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
