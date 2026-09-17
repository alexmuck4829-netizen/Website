'use client';

import React, {
  useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode,
} from 'react';
import {
  AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform,
} from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Motion primitives.
 *
 * House rules for everything in this file:
 *  - every effect is pointer-driven or scroll-driven, never autoplay-loud
 *  - every effect no-ops under `prefers-reduced-motion`
 *  - transforms only (no layout-triggering properties) so nothing janks
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------------------------------------------------------
   SPOTLIGHT — a soft glow that follows the cursor across a surface.
   Sets --mx/--my; the visual lives in the .spotlight CSS class.
   --------------------------------------------------------------- */
export function Spotlight({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((event: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      onMouseMove={onMove}
      className={cn('spotlight overflow-hidden', className)}
    >
      {children}
    </Component>
  );
}

/* ---------------------------------------------------------------
   TILT — subtle 3D rotation toward the cursor. Springs back on exit.
   --------------------------------------------------------------- */
export function Tilt({
  children,
  className,
  strength = 7,
  scale = 1.015,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  scale?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), spring);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ scale }}
      transition={{ duration: 0.3, ease: EASE }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn('preserve-3d', className)}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   MAGNETIC — element drifts toward the cursor inside a radius.
   Used on the primary CTA only; more than that gets tiring.
   --------------------------------------------------------------- */
export function Magnetic({
  children,
  className,
  radius = 90,
  pull = 0.3,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  pull?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 260, damping: 18 });
  const y = useSpring(0, { stiffness: 260, damping: 18 });

  useEffect(() => {
    if (reduce) return;

    const onMove = (event: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      if (Math.hypot(dx, dy) < radius + rect.width / 2) {
        x.set(dx * pull);
        y.set(dy * pull);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduce, radius, pull, x, y]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ x, y }} className={cn('inline-block', className)}>
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   BLUR REVEAL — headline words rise and sharpen, one after another.
   --------------------------------------------------------------- */
export function BlurReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  wordClassName?: (word: string, index: number) => string | undefined;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'p' | 'span';
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const Component = motion[Tag];

  if (reduce) {
    const Plain = Tag as React.ElementType;
    return <Plain className={className}>{text}</Plain>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn('inline-block', wordClassName?.(word, i))}
          variants={{
            hidden: { opacity: 0, y: 16, filter: 'blur(10px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {word}
          {i < words.length - 1 && ' '}
        </motion.span>
      ))}
    </Component>
  );
}

/* ---------------------------------------------------------------
   COUNTER — counts up once, when it scrolls into view.
   --------------------------------------------------------------- */
export function Counter({
  to,
  duration = 1600,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast then settles, reads as "counting up"
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(to * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {value.toLocaleString('en-GB', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ---------------------------------------------------------------
   MARQUEE — seamless horizontal loop, pauses on hover.
   --------------------------------------------------------------- */
export function Marquee({
  children,
  speed = 40,
  className,
  reverse = false,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  reverse?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={cn('group relative flex overflow-hidden mask-fade-edges', className)}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            'flex shrink-0 items-center gap-4 pr-4',
            !reduce && 'animate-marquee group-hover:[animation-play-state:paused]',
          )}
          style={
            reduce
              ? undefined
              : ({
                  animationDuration: `${speed}s`,
                  animationDirection: reverse ? 'reverse' : 'normal',
                } as CSSProperties)
          }
        >
          {children}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   STUD ROW — the brand motif as a decorative element.
   --------------------------------------------------------------- */
export function StudRow({
  count = 4,
  size = 10,
  className,
  colors,
  animate = true,
}: {
  count?: number;
  size?: number;
  className?: string;
  colors?: string[];
  animate?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          className="stud"
          style={{
            width: size,
            height: size,
            ...(colors?.[i % colors.length] && {
              background: `linear-gradient(160deg, ${colors[i % colors.length]}, ${colors[i % colors.length]}99)`,
            }),
          }}
          initial={reduce || !animate ? false : { scale: 0, opacity: 0 }}
          whileInView={reduce || !animate ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
        />
      ))}
    </span>
  );
}

/* ---------------------------------------------------------------
   PARALLAX — moves a layer against the scroll, cheaply.
   --------------------------------------------------------------- */
export function Parallax({
  children,
  offset = 40,
  className,
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const smooth = useSpring(y, { stiffness: 90, damping: 24, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;

    const onScroll = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      // -1 (below viewport) .. 1 (above viewport)
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      y.set(progress * offset);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduce, offset, y]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ y: smooth }} className={className}>
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   SCROLL PROGRESS — a thin brand-gradient bar pinned to the top.
   --------------------------------------------------------------- */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const width = useSpring(progress, { stiffness: 140, damping: 26, mass: 0.3 });
  // Computed before the early return: hooks must run in the same order every render.
  const widthPercent = useTransform(width, (v) => `${v}%`);

  useEffect(() => {
    if (reduce) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? (window.scrollY / max) * 100 : 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduce, progress]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-brand-gradient"
      style={{ width: widthPercent }}
    />
  );
}

/* ---------------------------------------------------------------
   BACK TO TOP — appears once the page is scrolled well down.
   --------------------------------------------------------------- */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          className="brick brick-press fixed bottom-6 right-6 z-40 grid size-11 place-items-center rounded-xl text-ink-muted transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
            <path
              d="M12 19V5M5 12l7-7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
