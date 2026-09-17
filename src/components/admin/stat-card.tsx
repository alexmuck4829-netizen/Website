import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'brand',
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: 'brand' | 'success' | 'electric' | 'gold';
}) {
  const accents = {
    brand: 'text-brand bg-brand/10 border-brand/20',
    success: 'text-success bg-success/10 border-success/20',
    electric: 'text-electric bg-electric/10 border-electric/20',
    gold: 'text-gold bg-gold/10 border-gold/20',
  };

  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-ink-muted">{label}</p>
          <p className="font-display text-3xl font-bold tracking-tight text-ink">{value}</p>
          {sub && <p className="text-xs text-ink-subtle">{sub}</p>}
        </div>
        <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl border', accents[accent])}>
          <Icon className="size-[18px]" />
        </span>
      </div>
    </div>
  );
}
