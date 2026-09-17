'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold',
    'transition-all duration-200 ease-brick cursor-pointer select-none [&_svg]:shrink-0',
    'disabled:pointer-events-none disabled:opacity-50',
    // Brick press: the button sits on a dark bottom edge and sinks into it
    'active:translate-y-[3px] active:[box-shadow:inset_0_1px_0_0_rgb(255_255_255/0.14)]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-gradient text-white',
          '[box-shadow:inset_0_1px_0_0_rgb(255_255_255/0.35),inset_0_-3px_0_0_rgb(0_0_0/0.28),0_6px_20px_-8px_rgb(var(--c-brand)/0.95)]',
          'hover:-translate-y-0.5 hover:brightness-110',
          'hover:[box-shadow:inset_0_1px_0_0_rgb(255_255_255/0.4),inset_0_-3px_0_0_rgb(0_0_0/0.28),0_12px_28px_-8px_rgb(var(--c-brand)/1)]',
        ].join(' '),
        secondary: [
          'bg-surface-overlay text-ink border border-line-strong',
          '[box-shadow:inset_0_1px_0_0_rgb(255_255_255/0.08),inset_0_-3px_0_0_rgb(0_0_0/0.4)]',
          'hover:-translate-y-0.5 hover:border-brand/50 hover:bg-surface-raised',
        ].join(' '),
        outline:
          'border-2 border-line-strong bg-transparent text-ink hover:bg-surface-raised hover:border-brand/50',
        ghost: 'text-ink-muted hover:bg-surface-raised hover:text-ink active:translate-y-0',
        subtle: 'bg-white/5 text-ink hover:bg-white/10',
        danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
        link: 'text-brand underline-offset-4 hover:underline p-0 h-auto active:translate-y-0',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm [&_svg]:size-4',
        md: 'h-11 px-5 text-sm [&_svg]:size-4',
        lg: 'h-12 px-7 text-base [&_svg]:size-5',
        icon: 'h-10 w-10 [&_svg]:size-[18px]',
        'icon-sm': 'h-8 w-8 rounded-lg [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {asChild ? null : children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
