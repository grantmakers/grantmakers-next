/** @type {import('tailwindcss').Config}*/
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'grantmakers-orange': '#c54e00',
        'grantmakers-blue': '#607d8b',
      },
    },
  },

  plugins: [typography, forms],
};

module.exports = config;
