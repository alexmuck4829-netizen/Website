'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showClose?: boolean;
    /** 'center' for modals, 'right'/'left' for drawers, 'bottom' for mobile sheets */
    side?: 'center' | 'right' | 'left' | 'bottom';
  }
>(({ className, children, showClose = true, side = 'center', ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 border border-line-strong bg-surface shadow-lift duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out',
        side === 'center' &&
          'left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        side === 'right' &&
          'inset-y-0 right-0 h-full w-full max-w-md border-y-0 border-r-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
        side === 'left' &&
          'inset-y-0 left-0 h-full w-full max-w-sm border-y-0 border-l-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
        side === 'bottom' &&
          'inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl border-x-0 border-b-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
        className,
      )}
      {...props}
    >
      {children}
      {showClose && (
        <DialogPrimitive.Close className="absolute right-4 top-4 z-10 grid size-8 cursor-pointer place-items-center rounded-lg text-ink-subtle transition-colors hover:bg-white/5 hover:text-ink">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = 'DialogContent';

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1.5 border-b border-line p-5', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 border-t border-line p-5 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}
