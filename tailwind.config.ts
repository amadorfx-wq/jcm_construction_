import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          obsidian: '#0D0E15',
          carbon: '#111827',
          smoke: '#A3A6AE',
          cream: '#FAFAFB',
        },
      },
      boxShadow: {
        luxury: '0 8px 40px 0 rgba(15, 23, 42, 0.06)',
        'luxury-lg': '0 20px 64px 0 rgba(15, 23, 42, 0.09)',
      },
    },
  },
  plugins: [],
};

export default config;
