import type { Config } from 'tailwindcss';

/**
 * ONE MORE CLICK STUDIO — design system
 * Charcoal surfaces, off-white type, violet -> electric-blue accent.
 * All colours are driven by CSS variables declared in src/app/globals.css,
 * so a rebrand only means editing that one file.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      // 1520 at 2xl so the full nav (needs ~1428px) fits once the two extra
      // links come back, and large screens get more presence.
      screens: { '2xl': '1520px' },
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
        brand: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          hover: 'rgb(var(--c-brand-hover) / <alpha-value>)',
          soft: 'rgb(var(--c-brand-soft) / <alpha-value>)',
        },
        electric: 'rgb(var(--c-electric) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
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
        // System monospace: the few code-ish labels do not justify a web font.
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.4), 0 8px 24px -12px rgb(0 0 0 / 0.6)',
        lift: '0 2px 4px rgb(0 0 0 / 0.3), 0 24px 48px -20px rgb(0 0 0 / 0.7)',
        glow: '0 0 0 1px rgb(var(--c-brand) / 0.28), 0 12px 40px -12px rgb(var(--c-brand) / 0.4)',
        inset: 'inset 0 1px 0 0 rgb(255 255 255 / 0.05)',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, rgb(var(--c-brand)) 0%, rgb(var(--c-electric)) 100%)',
        'brand-gradient-deep':
          'linear-gradient(135deg, rgb(var(--c-violet)) 0%, rgb(var(--c-brand)) 55%, rgb(var(--c-electric)) 100%)',
        'surface-gradient':
          'linear-gradient(180deg, rgb(var(--c-surface-raised) / 0.9) 0%, rgb(var(--c-surface) / 0.7) 100%)',
        'grid-faint':
          'linear-gradient(rgb(var(--c-line) / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-line) / 0.5) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
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
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
        // Slight overshoot — makes brick presses feel physical
        brick: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
