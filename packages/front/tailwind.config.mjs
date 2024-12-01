/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
      },
      accentColor: {
        primary: colors.slate,
      },
      textColor: {
        primary: 'var(--color-primary)',
      },
      listStyleType: {
        checkmark: '"✓ "',
      },
    },
  },
  plugins: [],
};
