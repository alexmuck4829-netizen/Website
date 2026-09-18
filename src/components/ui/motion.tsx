'use client';

import React, {
  Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore,
  type CSSProperties, type ReactNode,
} from 'react';
import {
  AnimatePresence, motion, useInView, useMotionValue, useSpring, useTransform,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/constants';

/**
 * Motion primitives.
 *
 * House rules for everything in this file:
 *  - every effect is pointer-driven or scroll-driven, never autoplay-loud
 *  - every effect no-ops under `prefers-reduced-motion`
 *  - transforms only (no layout-triggering properties) so nothing janks
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(listener: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

/**
 * `prefers-reduced-motion`, sans casser l'hydratation.
 *
 * Le serveur ne connaît pas la préférence. Si le premier rendu client répond
 * déjà `true`, il produit un arbre différent de celui du serveur et React
 * signale un décalage d'hydratation. `useSyncExternalStore` garantit que le
 * rendu d'hydratation utilise l'instantané serveur (`false`), puis rebascule
 * immédiatement après — les composants rendent alors leur variante sobre.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

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
  const reduce = usePrefersReducedMotion();
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
  const reduce = usePrefersReducedMotion();
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
  const reduce = usePrefersReducedMotion();
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
        <Fragment key={`${word}-${i}`}>
          <motion.span
            className={cn('inline-block', wordClassName?.(word, i))}
            variants={{
              hidden: { opacity: 0, y: 16, filter: 'blur(10px)' },
              show: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {word}
          </motion.span>
          {/* A breaking space BETWEEN the inline-blocks. A non-breaking space
              inside the span stops a long headline from ever wrapping. */}
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
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
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  // Toujours 0 au premier rendu : c'est ce que le serveur a produit.
  const [value, setValue] = useState(0);

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

  // Mouvement réduit : la valeur finale est affichée telle quelle, sans compter.
  // On la dérive du rendu plutôt que de la poser dans l'effet, pour que le
  // rendu d'hydratation (où `reduce` vaut encore false) affiche bien 0.
  const shown = reduce ? to : value;

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {shown.toLocaleString(SITE.locale, {
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
  const reduce = usePrefersReducedMotion();

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
   SCROLL SCENE — an element that plays a short film as it crosses
   the viewport: it rises, sharpens, straightens and settles.
   Scroll-driven, so scrubbing back replays it in reverse.
   --------------------------------------------------------------- */
export function ScrollScene({
  children,
  className,
  rise = 60,
  scaleFrom = 0.94,
  rotateFrom = 0,
  blurFrom = 6,
}: {
  children: ReactNode;
  className?: string;
  rise?: number;
  scaleFrom?: number;
  rotateFrom?: number;
  blurFrom?: number;
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // 0 = l'élément entre par le bas, 1 = il est centré et posé.
  const raw = useMotionValue(0);
  const p = useSpring(raw, { stiffness: 110, damping: 28, mass: 0.5 });

  const y = useTransform(p, [0, 1], [rise, 0]);
  const scale = useTransform(p, [0, 1], [scaleFrom, 1]);
  const rotate = useTransform(p, [0, 1], [rotateFrom, 0]);
  const opacity = useTransform(p, [0, 0.55, 1], [0, 0.85, 1]);
  const filter = useTransform(p, (v) => `blur(${((1 - v) * blurFrom).toFixed(2)}px)`);

  useEffect(() => {
    if (reduce) return;

    const onScroll = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      // L'animation se joue entre « le haut de l'élément touche le bas de
      // l'écran » et « l'élément est remonté d'un quart d'écran ».
      const startAt = window.innerHeight;
      const endAt = window.innerHeight * 0.45;
      const progress = (startAt - rect.top) / Math.max(startAt - endAt, 1);
      raw.set(Math.min(Math.max(progress, 0), 1));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduce, raw]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, rotate, opacity, filter, transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   SCROLL TEXT — un paragraphe dont les mots s'allument au défilement.
   Le texte reste lisible en permanence : on ne joue que sur l'opacité
   entre « estompé » et « plein », jamais jusqu'à l'invisible.
   --------------------------------------------------------------- */
export function ScrollText({
  text,
  className,
  wordClassName,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduce) return;

    const onScroll = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const startAt = window.innerHeight * 0.9;
      const endAt = window.innerHeight * 0.35;
      const p = (startAt - rect.top) / Math.max(startAt - endAt, 1);
      setProgress(Math.min(Math.max(p, 0), 1));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduce]);

  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        // Chaque mot s'allume sur sa propre fenêtre de défilement.
        const threshold = i / words.length;
        const lit = reduce ? 1 : Math.min(Math.max((progress - threshold) * words.length, 0), 1);
        return (
          <Fragment key={`${word}-${i}`}>
            <span
              className={cn('transition-colors duration-300', wordClassName)}
              style={{ opacity: 0.35 + lit * 0.65 }}
            >
              {word}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        );
      })}
    </p>
  );
}

/* ---------------------------------------------------------------
   CURSOR GLOW — un lavis indigo qui suit le pointeur sur toute la
   page. Décoratif, désactivé au clavier et en mouvement réduit.
   --------------------------------------------------------------- */
export function CursorGlow() {
  const reduce = usePrefersReducedMotion();
  const x = useSpring(0, { stiffness: 120, damping: 26, mass: 0.6 });
  const y = useSpring(0, { stiffness: 120, damping: 26, mass: 0.6 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduce) return;
    // Pas de lueur au doigt : elle n'aurait aucun sens sur écran tactile.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setActive(true);
    };
    const onLeave = () => setActive(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [reduce, x, y]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed -z-10 size-[30rem] rounded-full opacity-0 blur-[120px] transition-opacity duration-700"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        opacity: active ? 0.5 : 0,
        background:
          'radial-gradient(circle, rgb(var(--c-brand) / 0.10), rgb(var(--c-electric) / 0.05) 55%, transparent 70%)',
      }}
    />
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
  const reduce = usePrefersReducedMotion();
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
  const reduce = usePrefersReducedMotion();
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
          aria-label="Retour en haut"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          className="card card-hover fixed bottom-6 right-6 z-40 grid size-11 place-items-center rounded-xl text-ink-muted transition-colors hover:text-ink"
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
