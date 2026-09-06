import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: '#F7EAF1',
        surface: '#FFF8FB',
        ink: '#2A1B24',
        muted: '#6E5A65',
        line: '#F0C9DB',
        brand: { DEFAULT: '#C22367', deep: '#A8175A', light: '#FFD9E7' },
        alert: '#B4243C',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'sans-serif'],
      },
      borderRadius: { card: '12px' },
    },
  },
  plugins: [],
};
export default config;
