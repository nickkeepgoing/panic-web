import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // พื้นหลังและตัวอักษร
        ground:  '#FBF4F7',
        surface: '#FFFFFF',
        ink:     '#241019',
        muted:   '#6B5560',
        line:    '#EFD9E4',

        // สีประจำแบรนด์ P.A.N.I.C.
        brand: { DEFAULT: '#C22367', deep: '#96144C', light: '#FFE3EE' },

        // สีประจำหมวดหมู่ ห้าสายวิชา
        sci:  '#5B3FD6',
        tech: '#0A7EA4',
        engr: '#B35A00',
        envi: '#0F7A55',
        soci: '#A32E86',

        alert: '#C42B3C',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'sans-serif'],
      },
      borderRadius: { card: '14px' },
      boxShadow: {
        lift: '0 1px 0 0 rgba(36,16,25,0.04), 0 8px 24px -12px rgba(36,16,25,0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
