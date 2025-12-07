import { fontFamily } from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'selector',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: ['dark', 'tabular-nums'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'grantmakers-orange': '#c54e00',
        'grantmakers-blue': '#607d8b',
        'grantmakers-blue-dark-bg': '#7fa8c4',
        'grantmakers-green': '#009688',
        'grantmakers-orange-light': '#e65c00',
        'grantmakers-orange-light-dark-bg': '#ff8547',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter Variable', ...fontFamily.sans],
      },
      boxShadow: {
        /**
         * Custom "Soft" Shadow Scale
         * Lighter opacity than Tailwind defaults for subtle, refined appearance
         */
        'soft-xs': '0 1px 5px 1px #ddd',
        'soft-sm': '0 0.25rem 0.375rem -0.0625rem hsla(0, 0%, 8%, 0.12), 0 0.125rem 0.25rem -0.0625rem hsla(0, 0%, 8%, 0.07)',
        'soft-md': '0 4px 7px -1px rgba(0, 0, 0, 0.11), 0 2px 4px -1px rgba(0, 0, 0, 0.07)',
        'soft-lg': '0 2px 12px 0 rgba(0, 0, 0, 0.16)',
        'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
        'soft-2xl': '0 0.3125rem 0.625rem 0 rgba(0, 0, 0, 0.12)',
        'soft-3xl': '0 8px 26px -4px hsla(0, 0%, 8%, 0.15), 0 8px 9px -5px hsla(0, 0%, 8%, 0.06)',
        blur: 'inset 0 0 1px 1px hsla(0, 0%, 100%, 0.9), 0 20px 27px 0 rgba(0, 0, 0, 0.05)',
      },
    },
    plugins: [forms],
  },
};

export default config;
