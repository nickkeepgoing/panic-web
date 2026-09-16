import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ─── Dark theme global tokens ───────────────────────────────
        ground:  '#0C0C18',   // page background — deep dark
        surface: '#16162A',   // card/panel surface — slightly lighter
        ink:     '#ECE8F4',   // primary text — near white, warm
        muted:   '#8B7C9A',   // secondary text — muted lavender (contrast ≥ 5:1 on surface)
        line:    '#2C2248',   // borders — subtle dark purple

        // ─── Brand ─────────────────────────────────────────────────
        brand: { DEFAULT: '#E03578', deep: '#C22367', light: '#2A0D1C' },
        //   brand.light เป็น dark-pink สำหรับ hover/badge บน dark bg

        // ─── Category colors (vibrant, ใช้ได้บน dark) ─────────────
        sci:  '#7C5FFF',   // purple brighter on dark
        tech: '#22A6D4',   // cyan
        engr: '#E07800',   // orange
        envi: '#18A870',   // green
        soci: '#C844B0',   // magenta

        alert: '#F04455',
      },
      fontFamily: {
        sans:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'sans-serif'],
      },
      borderRadius: { card: '14px' },
      boxShadow: {
        // lift: on dark — subtle white glow instead of dark shadow
        lift: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px -8px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
