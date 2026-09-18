'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Entrée déclenchée au défilement : une courte montée en fondu, jouée une fois.
 * Le respect de « mouvement réduit » est assuré par le MotionConfig global —
 * brancher ici sur useReducedMotion produisait un arbre différent côté client
 * et donc un décalage d'hydratation.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
}) {
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/** Container that staggers its children on scroll into view. */
export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}
