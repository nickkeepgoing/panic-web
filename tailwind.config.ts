import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── Semantic tokens — switch via CSS variables ──────────────
        ground:  'var(--color-ground)',
        surface: 'var(--color-surface)',
        ink:     'var(--color-ink)',
        muted:   'var(--color-muted)',
        line:    'var(--color-line)',

        // ─── Brand ───────────────────────────────────────────────────
        brand: { DEFAULT: '#E03578', deep: '#C22367', light: 'var(--color-brand-light)' },

        // ─── Category colors (vibrant, readable on both modes) ───────
        sci:    '#7C5FFF',
        tech:   '#22A6D4',
        engr:   '#E07800',
        envi:   '#18A870',
        soci:   '#C844B0',
        health: '#E63946',
        agri:   '#65A30D',
        arts:   '#8B5CF6',

        alert: '#F04455',
      },
      fontFamily: {
        sans:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'sans-serif'],
      },
      borderRadius: { card: '14px' },
      boxShadow: {
        lift: 'var(--shadow-lift)',
      },
    },
  },
  plugins: [],
};
export default config;
