import type { Config } from 'tailwindcss';

/**
 * ONE MORE CLICK STUDIO — design system
 * Canevas clair, encre midnight, action indigo (#533afd).
 * Géométrie serrée (rayons 4px), profondeur par teinte et par mouvement.
 * Toutes les couleurs viennent des variables CSS de src/app/globals.css,
 * donc un rebrand ne touche qu'un seul fichier.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      // 1320px : la largeur de référence du système. Au-delà, on laisse
      // respirer plutôt que d'étirer les lignes de texte.
      screens: { '2xl': '1320px' },
    },
    extend: {
      colors: {
        base: 'rgb(var(--c-base) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--c-surface) / <alpha-value>)',
          raised: 'rgb(var(--c-surface-raised) / <alpha-value>)',
          overlay: 'rgb(var(--c-surface-overlay) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--c-line) / <alpha-value>)',
          strong: 'rgb(var(--c-line-strong) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          muted: 'rgb(var(--c-ink-muted) / <alpha-value>)',
          subtle: 'rgb(var(--c-ink-subtle) / <alpha-value>)',
        },
        smoke: 'rgb(var(--c-smoke) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          hover: 'rgb(var(--c-brand-hover) / <alpha-value>)',
          soft: 'rgb(var(--c-brand-soft) / <alpha-value>)',
        },
        electric: 'rgb(var(--c-electric) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
        lavender: 'rgb(var(--c-lavender) / <alpha-value>)',
        brick: {
          red: 'rgb(var(--c-brick-red) / <alpha-value>)',
          yellow: 'rgb(var(--c-brick-yellow) / <alpha-value>)',
          green: 'rgb(var(--c-brick-green) / <alpha-value>)',
          orange: 'rgb(var(--c-brick-orange) / <alpha-value>)',
          pink: 'rgb(var(--c-brick-pink) / <alpha-value>)',
        },
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        success: 'rgb(var(--c-success) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        // Monospace système : les rares libellés techniques ne justifient pas
        // une police web supplémentaire.
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Échelle typographique : le tracking se resserre quand le corps grandit.
        'display-xl': ['clamp(3rem, 6vw, 5rem)', { lineHeight: '1.04', letterSpacing: '-0.03em', fontWeight: '300' }],
        'display-lg': ['clamp(2.5rem, 4.6vw, 3.75rem)', { lineHeight: '1.08', letterSpacing: '-0.028em', fontWeight: '300' }],
        'display-md': ['clamp(2rem, 3.4vw, 2.75rem)', { lineHeight: '1.14', letterSpacing: '-0.024em', fontWeight: '300' }],
        'display-sm': ['clamp(1.5rem, 2.4vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '300' }],
        lede: ['1.125rem', { lineHeight: '1.65', letterSpacing: '-0.008em' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.14em', fontWeight: '500' }],
      },
      borderRadius: {
        // Géométrie serrée : 4px partout, 6/8px pour les grands panneaux.
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
        '2xl': '10px',
        '3xl': '14px',
      },
      boxShadow: {
        // Le système n'utilise pas d'ombre portée pour l'élévation :
        // ces tokens servent uniquement aux états actifs et aux lueurs animées.
        card: '0 0 0 1px rgb(var(--c-line))',
        lift: '0 1px 2px rgb(var(--c-violet) / 0.06), 0 18px 44px -24px rgb(var(--c-violet) / 0.22)',
        glow: '0 0 0 1px rgb(var(--c-brand) / 0.22), 0 18px 48px -18px rgb(var(--c-brand) / 0.35)',
        'glow-lg': '0 0 0 1px rgb(var(--c-brand) / 0.3), 0 32px 80px -24px rgb(var(--c-brand) / 0.45)',
        inset: 'inset 0 1px 0 0 rgb(255 255 255 / 0.6)',
      },
      maxWidth: {
        shell: '1320px',
        prose: '68ch',
      },
      spacing: {
        section: '96px',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, rgb(var(--c-brand)) 0%, rgb(var(--c-electric)) 100%)',
        'brand-gradient-deep':
          'linear-gradient(135deg, rgb(var(--c-violet)) 0%, rgb(var(--c-brand)) 55%, rgb(var(--c-electric)) 100%)',
        'surface-gradient':
          'linear-gradient(180deg, rgb(var(--c-base)) 0%, rgb(var(--c-surface)) 100%)',
        'grid-faint':
          'linear-gradient(rgb(var(--c-line) / 0.9) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-line) / 0.9) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.6' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'blur-in': {
          from: { opacity: '0', filter: 'blur(10px)', transform: 'translateY(14px)' },
          to: { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' },
        },
        'stud-pop': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'sweep-x': {
          from: { transform: 'translateX(-120%) skewX(-18deg)' },
          to: { transform: 'translateX(220%) skewX(-18deg)' },
        },
        'orbit-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'draw-line': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 6s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        'accordion-down': 'accordion-down 0.25s ease-out',
        'accordion-up': 'accordion-up 0.25s ease-out',
        'blur-in': 'blur-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'stud-pop': 'stud-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        float: 'float 6s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease-in-out infinite',
        'sweep-x': 'sweep-x 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
        'orbit-slow': 'orbit-slow 28s linear infinite',
        'draw-line': 'draw-line 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
        // Léger dépassement — pour les micro-interactions qui doivent « claquer ».
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
