import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Marque : un curseur dans un carré indigo, géométrie serrée. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative grid size-9 shrink-0 place-items-center overflow-hidden rounded bg-brand-gradient',
        'bg-[length:180%_180%] transition-transform duration-500 ease-premium',
        'group-hover:scale-105 group-hover:animate-gradient-pan',
        'motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:animate-none',
        className,
      )}
      aria-hidden
    >
      {/* Le voile qui balaie la marque au survol du lien parent */}
      <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 opacity-0 group-hover:animate-sweep-x group-hover:opacity-100 motion-reduce:group-hover:animate-none" />
      <svg viewBox="0 0 24 24" fill="none" className="relative size-5 text-white transition-transform duration-500 ease-premium group-hover:translate-x-px group-hover:translate-y-px motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0">
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
  wordmarkTop = 'ONE MORE CLICK',
  wordmarkBottom = 'Studio',
}: {
  className?: string;
  showText?: boolean;
  href?: string;
  wordmarkTop?: string;
  wordmarkBottom?: string;
}) {
  return (
    <Link href={href} className={cn('group flex items-center gap-2.5', className)}>
      <LogoMark />
      {showText && (
        <span className="flex flex-col leading-none whitespace-nowrap">
          <span className="font-display text-[13px] font-medium tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-brand sm:text-[15px]">
            {wordmarkTop}
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-ink-subtle sm:text-[10px]">
            {wordmarkBottom}
          </span>
        </span>
      )}
    </Link>
  );
}
