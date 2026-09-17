import type { Config } from 'tailwindcss';

// Design system v5 — "Pinterest doux" : palette pastel chaude, grandes rondeurs,
// beaucoup d'air. Terracotta + sauge (pas juste un seul accent) pour éviter le cliché single-tone.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E4785F', // terracotta chaud — couleur de marque
          light: '#EFA48F',
          dark: '#C15A42',
        },
        secondary: {
          DEFAULT: '#8FA891', // sauge — second accent, calme et naturel
          light: '#B4C7B6',
        },
        cream: '#FBF3EC',
        neutral: {
          900: '#3D2E28', // brun chaud, pas noir pur
          500: '#8A776E',
          200: '#EDE1D6',
          50: '#FBF3EC',
        },
        success: '#6E9B70',
        warning: '#D69A4B',
        danger: '#C15A42',
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        card: '1.75rem',
        button: '1.25rem',
      },
      boxShadow: {
        soft: '0 12px 40px -12px rgba(61,46,40,0.16)',
        lift: '0 24px 60px -16px rgba(61,46,40,0.22)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 30s linear infinite' },
    },
  },
  plugins: [],
};
export default config;
