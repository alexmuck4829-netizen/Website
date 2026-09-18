import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide transition-colors [&_svg]:size-3',
  {
    variants: {
      variant: {
        new: 'border-electric/30 bg-electric/12 text-electric',
        popular: 'border-brand/30 bg-brand/12 text-brand',
        best: 'border-gold/30 bg-gold/12 text-gold',
        sale: 'border-danger/30 bg-danger/15 text-danger',
        neutral: 'border-line bg-surface text-ink-muted',
        success: 'border-success/30 bg-success/12 text-success',
        outline: 'border-line-strong bg-transparent text-ink-muted',
        draft: 'border-gold/30 bg-gold/10 text-gold',
        hidden: 'border-line bg-surface text-ink-subtle',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] uppercase',
        md: 'px-2.5 py-1 text-[11px] uppercase',
        lg: 'px-3 py-1.5 text-xs',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'sm' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { badgeVariants };
