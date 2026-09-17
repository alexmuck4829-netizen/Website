'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 ease-premium disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-gradient text-white shadow-[0_6px_20px_-8px_rgb(var(--c-brand)/0.9)] hover:shadow-[0_10px_30px_-8px_rgb(var(--c-brand)/1)] hover:brightness-110',
        secondary:
          'bg-surface-overlay text-ink border border-line-strong hover:border-brand/50 hover:bg-surface-raised',
        outline:
          'border border-line-strong bg-transparent text-ink hover:bg-surface-raised hover:border-brand/40',
        ghost: 'text-ink-muted hover:bg-surface-raised hover:text-ink',
        subtle: 'bg-white/5 text-ink hover:bg-white/10',
        danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
        link: 'text-brand underline-offset-4 hover:underline p-0 h-auto',
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
