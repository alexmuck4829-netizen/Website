import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Brand mark: a cursor inside a stud-like rounded square. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-gradient',
        '[box-shadow:inset_0_1px_0_rgb(255_255_255/0.45),inset_0_-3px_0_rgb(0_0_0/0.3),0_4px_16px_-6px_rgb(var(--c-brand)/0.9)]',
        className,
      )}
      aria-hidden
    >
      <span className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
      {/* two studs moulded into the top of the brick */}
      <span className="absolute left-1.5 top-0 h-1.5 w-2.5 rounded-b-full bg-white/30" />
      <span className="absolute right-1.5 top-0 h-1.5 w-2.5 rounded-b-full bg-white/30" />
      <svg viewBox="0 0 24 24" fill="none" className="relative size-5 text-white">
        <path
          d="M6 4.2 18.4 11a.7.7 0 0 1-.06 1.27l-4.53 1.86a.7.7 0 0 0-.38.38l-1.86 4.53A.7.7 0 0 1 10.3 19L4.2 6.6a.7.7 0 0 1 .9-.9Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  showText = true,
  href = '/',
}: {
  className?: string;
  showText?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn('group flex items-center gap-2.5 transition-opacity hover:opacity-90', className)}
    >
      <LogoMark />
      {showText && (
        <span className="flex flex-col leading-none whitespace-nowrap">
          <span className="font-display text-[13px] font-bold tracking-tight text-ink sm:text-[15px]">
            ONE MORE CLICK
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-ink-subtle sm:text-[10px]">
            Studio
          </span>
        </span>
      )}
    </Link>
  );
}
