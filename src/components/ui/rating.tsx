import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const SIZES = { sm: 'size-3', md: 'size-4', lg: 'size-5' } as const;
const TEXT = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' } as const;

export function Rating({ value, count, size = 'sm', showValue = true, className }: RatingProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => {
          const filled = value >= i + 1;
          const half = !filled && value > i;
          return (
            <span key={i} className="relative">
              <Star className={cn(SIZES[size], 'text-line-strong')} />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${(value - i) * 100}%` }}
                >
                  <Star className={cn(SIZES[size], 'fill-gold text-gold')} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className={cn(TEXT[size], 'font-medium text-ink')}>{value.toFixed(1)}</span>
      )}
      {count != null && (
        <span className={cn(TEXT[size], 'text-ink-subtle')}>
          ({count.toLocaleString('fr-FR')})
        </span>
      )}
      <span className="sr-only">
        Note de {value.toFixed(1)} sur 5{count != null ? `, sur ${count} avis` : ''}
      </span>
    </div>
  );
}
