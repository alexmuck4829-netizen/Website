'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const fieldBase =
  'w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink placeholder:text-ink-subtle transition-colors duration-200 hover:border-line-strong/80 focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-50';

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('text-sm font-medium text-ink', className)}
    {...props}
  />
));
Label.displayName = 'Label';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, 'h-11', className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldBase, 'min-h-28 py-3 leading-relaxed', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-3">
          <Label>
            {label}
            {required && <span className="ml-1 text-brand">*</span>}
          </Label>
          {hint && <span className="text-xs text-ink-subtle">{hint}</span>}
        </div>
      )}
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-line-strong transition-colors duration-200 data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=unchecked]:bg-line',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="pointer-events-none block size-4 translate-x-1 rounded-full bg-white shadow transition-transform duration-200 data-[state=checked]:translate-x-6" />
  </SwitchPrimitive.Root>
));
Switch.displayName = 'Switch';

/** Labelled toggle row used throughout the admin forms. */
export function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-surface/60 p-3.5">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
        {description && <p className="text-xs text-ink-subtle">{description}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer size-[18px] shrink-0 cursor-pointer rounded-[6px] border border-line-strong transition-colors data-[state=checked]:border-brand data-[state=checked]:bg-brand',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      <Check className="size-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(fieldBase, 'flex h-11 cursor-pointer items-center justify-between gap-2', className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 text-ink-subtle" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-80 min-w-[10rem] overflow-hidden rounded border border-line-strong bg-base shadow-lift',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        position === 'popper' && 'translate-y-1',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = 'SelectContent';

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm text-ink-muted outline-none transition-colors data-[highlighted]:bg-brand-soft data-[highlighted]:text-ink data-[state=checked]:text-brand',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-line">
      <SliderPrimitive.Range className="absolute h-full bg-brand-gradient" />
    </SliderPrimitive.Track>
    {(props.value ?? props.defaultValue ?? [0]).map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block size-4 cursor-grab rounded-full border-2 border-brand bg-base shadow transition-transform hover:scale-110 active:cursor-grabbing"
      />
    ))}
  </SliderPrimitive.Root>
));
Slider.displayName = 'Slider';
