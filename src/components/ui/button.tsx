'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'group/btn relative isolate inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded font-medium overflow-hidden',
    'transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-premium',
    'cursor-pointer select-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:translate-y-0 active:scale-[0.98] active:duration-100',
    // Le halo de survol : un voile qui balaie le bouton, jamais une ombre portée.
    'before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:z-10',
    'before:w-1/3 before:-skew-x-12 before:bg-white/20 before:opacity-0',
    'before:transition-none hover:before:animate-sweep-x hover:before:opacity-100',
    'motion-reduce:transition-none motion-reduce:hover:before:animate-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-brand text-white',
          'hover:-translate-y-px hover:bg-brand-hover',
          'hover:shadow-glow',
        ].join(' '),
        secondary: [
          'bg-brand-soft text-brand border border-line-strong',
          'hover:-translate-y-px hover:border-brand/45 hover:bg-base',
        ].join(' '),
        outline:
          'border border-line-strong bg-base text-ink hover:-translate-y-px hover:border-brand/45 hover:text-brand',
        ghost:
          'text-ink-muted hover:bg-brand-soft hover:text-brand before:hidden',
        subtle: 'bg-surface text-ink border border-line hover:bg-brand-soft hover:text-brand',
        danger:
          'bg-danger/10 text-danger border border-danger/25 hover:bg-danger hover:text-white',
        link: 'text-brand underline-offset-4 hover:underline p-0 h-auto active:scale-100 before:hidden overflow-visible',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm [&_svg]:size-4',
        md: 'h-11 px-5 text-sm [&_svg]:size-4',
        lg: 'h-12 px-7 text-base [&_svg]:size-5',
        icon: 'h-10 w-10 [&_svg]:size-[18px]',
        'icon-sm': 'h-8 w-8 [&_svg]:size-4',
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
