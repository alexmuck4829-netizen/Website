'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Entrée déclenchée au défilement : le bloc arrive basculé vers l'arrière puis
 * se redresse en montant. C'est l'entrée par défaut de tout le site — pas de
 * `overflow` ni de `filter` ici, sinon les ombres de survol des enfants se
 * feraient rogner et le texte resterait légèrement flou au repos.
 *
 * Le respect de « mouvement réduit » est assuré par le MotionConfig global —
 * brancher ici sur useReducedMotion produisait un arbre différent côté client
 * et donc un décalage d'hydratation.
 */
export function Reveal({
  children,
  delay = 0,
  y = 44,
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
      initial={{ opacity: 0, y, rotateX: 10, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1100, transformOrigin: 'center bottom' }}
    >
      {children}
    </Comp>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
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
