import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        powderBlush: 'rgb(var(--color-primary) / <alpha-value>)',
        eggshell: 'rgb(var(--color-background) / <alpha-value>)',
        icyAqua: 'rgb(var(--color-secondary) / <alpha-value>)',
        lightBlue: 'rgb(var(--color-accent) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        primaryDark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        primarySoft: 'rgb(var(--color-primary-soft) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        secondaryDark: 'rgb(var(--color-secondary-dark) / <alpha-value>)',
        secondarySoft: 'rgb(var(--color-secondary-soft) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        accentDark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
        accentSoft: 'rgb(var(--color-accent-soft) / <alpha-value>)',
        blush: 'rgb(var(--color-primary) / <alpha-value>)',
        blushDark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        blushSoft: 'rgb(var(--color-primary-soft) / <alpha-value>)',
        cream: 'rgb(var(--color-background) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surfaceSoft: 'rgb(var(--color-surface-soft) / <alpha-value>)',
        neutralSoft: 'rgb(var(--color-neutral-soft) / <alpha-value>)',
        ink: 'rgb(var(--color-text) / <alpha-value>)',
        mist: 'rgb(var(--color-muted) / <alpha-value>)',
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
        line: 'rgb(var(--color-border) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
      },
      fontFamily: {
        body: ['Manrope', 'sans-serif'],
        heading: ['Fraunces', 'serif'],
        album: ['Fraunces', 'serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgb(var(--color-primary) / 0.14)',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgb(var(--color-primary-soft) / 0.92), rgb(var(--color-background) / 0.6) 40%, transparent 70%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
